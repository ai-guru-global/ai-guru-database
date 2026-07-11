---
title: "K8sGPT: 给 K8s 集群装一个 AI SRE"
category: "12-architecture-infrastructure-cncf-cloud-native-ai"
tags: ["cncf", "kubernetes", "k8sgpt", "aiops", "llm", "observability", "sre"]
summary: "> **一句话理解**: K8sGPT 是 CNCF 沙箱级的'AI SRE'——用一组分析器扫集群里的失败信号，再交给 LLM（可本地 Ollama）翻译成'哪里坏了、怎么修'的人话，支持 CLI 和常驻 Operator 两种模式。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "K8sgpt Deep Dive"
  - "K8sGPT Deep Dive"
  - K8sGPT_Deep_Dive

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# K8sGPT: 给 K8s 集群装一个 AI SRE

> **一句话理解**: K8sGPT 是 CNCF 沙箱级的"AI SRE"——用一组分析器扫集群里的失败信号，再交给 LLM（可本地 Ollama）翻译成"哪里坏了、怎么修"的人话，支持 CLI 和常驻 Operator 两种模式。

> 📐 **概念方法论**: K8sGPT 把 SRE 的"读告警 → 读 Event/Pod 日志 → 在脑子里推理根因 → 写处置建议"这条认知链路，拆成**确定性**（Analyzers 提取结构化失败信号）+ **概率性**（LLM 翻译成自然语言）两段。这种"用 LLM 操作 LLM 基础设施"的范式与 [[运维/SRE_for_AI_Systems]] 一脉相承；与同类项目 [[CNCF_Cloud_Native_AI/HolmesGPT_Deep_Dive]] 相比，K8sGPT 更偏"集群健康扫描器"，HolmesGPT 更偏"告警分诊员"。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [安装部署](#4-安装部署)
5. [快速开始](#5-快速开始)
6. [生产配置](#6-生产配置)
7. [运维与可观测](#7-运维与可观测)
8. [对比与选择](#8-对比与选择)
9. [常见问题 FAQ](#9-常见问题-faq)

---

## 1. 概述

### 1.1 定位

K8sGPT 是一个用 LLM 给 Kubernetes 集群做"分诊（triage）"的工具：它扫描集群里的失败信号（崩溃的 Pod、配置错误的 Service/Ingress、Pending 的 PVC、异常的 Node 状态……），把那些干巴巴的 K8s 术语翻译成一句人话——"这个 Pod 因为 OOM 被杀了，建议把 memory limit 调到 1Gi"，并给出修复方向。

```
┌──────────────────────────────────────────────────────────────────┐
│                  传统排障 vs K8sGPT 排障                          │
├──────────────────────────────────────────────────────────────────┤
│  传统 SRE 排障:                                                  │
│    kubectl get pods → 看 STATUS → kubectl describe →            │
│    读 Events → 读 logs → 脑补根因 → 翻文档 → 写处置             │
│    (每条告警 5~30 分钟，严重依赖经验)                            │
│                                                                  │
│  K8sGPT:                                                        │
│    k8sgpt analyze --explain                                     │
│      ↓ Analyzer 自动读 Events/Pod/Service/Ingress/PVC...         │
│      ↓ 脱敏 (anonymize) 敏感字段                                 │
│      ↓ 送入 LLM (OpenAI / 本地 Ollama)                          │
│    → "default/web-xxx 因 OOMKilled 退出，当前 limit 512Mi        │
│       偏紧，建议上调至 1Gi 并检查内存泄漏"                        │
│    (每条 5~30 秒，新人也能看懂)                                  │
└──────────────────────────────────────────────────────────────────┘
```

一句话：**K8sGPT = 一组集群健康 Analyzers + LLM 翻译层 +（可选）常驻 Operator**。它不是替代 Prometheus 告警，而是给告警和排障加一层"自然语言解释 + 修复建议"。

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| 内置 Analyzers（分析器） | 一组"pack"，各自知道如何从特定资源里抽取失败信号：Pod/Container 错误、Service、Ingress、Node、Events、PVC、HPA、PDB、NetworkPolicy、Cert-Manager 证书、StatefulSet、CronJob 等 |
| 多 AI Backend | OpenAI / Azure OpenAI / Amazon Bedrock / Cohere / Google Gemini / LocalAI / **Ollama（本地）**，可自由切换 |
| 数据脱敏（Anonymization） | 发送给 LLM 之前，对 Service 名、Namespace、Pod 名、密钥等做哈希/掩码，PII 不出集群 |
| 离线 / 气隙模式 | 接本地 Ollama 或 vLLM 即可全离线运行，满足金融、政务、内网环境合规要求 |
| 双形态 | **CLI**（`k8sgpt analyze`，按需扫描）+ **Operator**（集群内常驻，持续生成 Result CRD 并推送通知） |
| 通知集成 | Operator 模式可推送 Slack / MS Teams / Discord / Mattermost / 飞书；并可作为告警富化源接入 Prometheus/Alertmanager/PagerDuty |
| 自定义分析器 | 通过 Go plugin 机制扩展自己的 Analyzer（例如扫公司内部 CRD） |
| 结果缓存 | 对相同问题做缓存，避免重复消耗 LLM token |
| Trivy 集成 | 可调用 Trivy 对镜像做安全扫描，把漏洞结果一并交给 LLM 解释 |
| 报告生成 | `k8sgpt analyze --report` 输出可归档的 JSON/HTML 报告 |

### 1.3 CNCF 状态与版本历程

| 时间 | 事件 | 说明 |
|------|------|------|
| 2023-Q2 | 项目开源 | 由 Alex Jones 发起，定位"K8s + GPT" |
| 2023-08 | CNCF Sandbox 接纳 | 进入 CNCF 生态，ai:true 标记 |
| v0.3 (2024) | Operator GA、多 Backend | Operator 模式成熟，新增 Bedrock/Bedrock/Cohere/Gemini/Ollama 后端 |
| v0.4 (2025) | 自定义分析器、通知增强 | Go plugin 分析器、更多 notification sink、Trivy 深度集成 |
| 2025-2026 | 走向 Incubating | 社区规模扩大，与 kagent/HolmesGPT 形成 AIOps 矩阵 |

> 仓库：<https://github.com/k8sgpt-ai/k8sgpt> ｜ License: Apache-2.0 ｜ CNCF Sandbox（ai:true）｜ 主要语言: Go

---

## 2. 核心概念

### 2.1 五个关键名词

| 概念 | 是什么 | 类比 |
|------|--------|------|
| **Analyzer（分析器 / pack）** | 一个确定性的 Go 模块，知道如何"读"某类资源并抽取失败信号（如读 Pod 的 `status.containerStatuses` 找 `OOMKilled`） | 体检中心的各科检查项目 |
| **AI Backend** | LLM 提供方抽象层。OpenAI/Azure/Bedrock/Cohere/Gemini/LocalAI/Ollama 都实现同一接口 | 数据库 driver |
| **Anonymization（脱敏）** | 在把上下文发给 LLM 前，把命名空间名、Pod 名、Secret 引用、IP 等替换成掩码（如 `dep_namespace`），LLM 回来后再反解 | 给病历打码再给医生看 |
| **Filter（过滤器）** | 启用 / 禁用某些 Analyzer，或排除某些 namespace/label，用于降噪 | 体检套餐勾选 |
| **Result** | 一次诊断的产物。CLI 下打印到终端；Operator 下落到 `Result` CRD，包含 `Kind/Name/Error/AI 解释/建议` | 一张诊断报告单 |

### 2.2 一次扫描的端到端流程

```
   k8sgpt analyze --explain
            │
            ▼
 ┌──────────────────────┐
 │ 1. 并行跑各 Analyzer │   Pod / Service / Ingress / Node / PVC /
 │    (确定性抽取信号)   │   HPA / PDB / Events / Cert-Manager ...
 └──────────┬───────────┘
            │  结构化的"问题片段"(含原始 K8s 字段)
            ▼
 ┌──────────────────────┐
 │ 2. Anonymize 脱敏     │   NAMESPACE→dep_xxx, POD→dep_pod,
 │    (PII 不出集群)     │   Secret/ConfigMap 内容剔除
 └──────────┬───────────┘
            │  干净的上下文
            ▼
 ┌──────────────────────┐
 │ 3. 拼_prompt → LLM    │   OpenAI / Ollama(via OpenAI-compat API)
 │    (Backend 抽象层)   │   可带 Trivy 漏洞结果
 └──────────┬───────────┘
            │  自然语言解释 + 修复建议
            ▼
 ┌──────────────────────┐
 │ 4. 反脱敏 → 输出      │   CLI: 打印终端 / 报告
 │    (restore 真实名)   │   Operator: 写 Result CRD → 通知
 └──────────────────────┘
```

> 关键设计点：**确定性部分（Analyzer）和概率性部分（LLM）严格分离**。即使关掉 LLM（`--no-explain`），K8sGPT 仍然能输出"哪些资源有问题、什么错误"，只是没有人话翻译——这让结果可审计、可回归。

---

## 3. 架构设计

### 3.1 CLI 模式（按需扫描）

```
 ┌─────────────────────────────────────────────────────────────┐
 │                      开发者笔记本 / 跳板机                    │
 │                                                             │
 │   $ k8sgpt analyze --explain --filter Pod,Service           │
 │         │                                                   │
 │         │  kubeconfig                                       │
 │         ▼                                                   │
 │   ┌──────────────────────────────────────────────┐          │
 │   │ k8sgpt CLI (Go 二进制)                        │          │
 │   │  ├─ list analyzers → 并发读取 K8s API          │          │
 │   │  ├─ anonymize                                 │          │
 │   │  ├─ HTTP POST → AI Backend                    │          │
 │   │  └─ 反脱敏 + 打印                             │          │
 │   └─────────┬──────────────────┬──────────────────┘          │
 │             │                  │                             │
 └─────────────┼──────────────────┼─────────────────────────────┘
               │                  │
               ▼                  ▼
      ┌────────────────┐   ┌──────────────────┐
      │  K8s API Server │   │  AI Backend       │
      │  (read-only RBAC)│   │ (OpenAI/Ollama...)│
      └────────────────┘   └──────────────────┘
```

特点：无副作用、不驻留、凭 `kubeconfig` 以只读权限读集群。适合**临时排障 / CI 流水线 / 值班时一键体检**。

### 3.2 Operator 模式（常驻、持续）

```
 ┌──────────────────────── 集群内 ────────────────────────────────┐
 │                                                                │
 │   ┌──────────────┐   创建/配置     ┌──────────────────────┐    │
 │   │ K8sGPT CRD   │ ───────────────▶│ k8sgpt-operator       │    │
 │   │ (用户声明)    │                 │ (Deployment, 1 副本)  │    │
 │   └──────────────┘                 └──────────┬───────────┘    │
 │        指定: backend / filter / 通知 sink        │               │
 │                                                  │ 周期性触发    │
 │                                                  ▼               │
 │                                      ┌──────────────────────┐   │
 │                                      │ 内置 analyzers 并发   │   │
 │                                      │ 扫描集群 (read K8s)   │   │
 │                                      └──────────┬───────────┘   │
 │                                                 │               │
 │                          ┌──────────────────────┴──────────┐    │
 │                          ▼                                  ▼    │
 │              ┌────────────────────┐              ┌──────────────┐│
 │              │ Result CRD (落地)   │              │ Notification ││
 │              │ kind/name/错误/建议 │              │ Slack/Teams/ ││
 │              └─────────┬──────────┘              │ Discord/飞书 ││
 │                        │                         └──────────────┘│
 │                        │ kubectl get result                        │
 └────────────────────────┼──────────────────────────────────────────┘
                          ▼
                ┌────────────────────┐         ┌──────────────────┐
                │  Prometheus /       │ ◀─────  │ AI Backend       │
                │  Alertmanager /     │ 富化    │ (集群内 Ollama   │
                │  PagerDuty          │ 告警    │  或外部 OpenAI)  │
                └────────────────────┘         └──────────────────┘
```

Operator 模式的价值在于**把 K8sGPT 变成一个常驻的"诊断工厂"**：

1. 持续按调度周期扫描集群，把每个问题落成一条 `Result` CRD（可被 kubectl/GitOps 管理）。
2. 新 Result 触发通知，推到 Slack/Teams/PagerDuty，值班人员直接看到"人话根因"。
3. 作为 Alertmanager 的 webhook receiver，给原始告警做**富化（enrichment）**——告警里附上 K8sGPT 的 LLM 解释。
4. 配合 Argo CD / Flux，Result 也能纳入 GitOps 审计流。

### 3.3 数据流与安全边界

| 关注点 | CLI 模式 | Operator 模式 |
|--------|---------|---------------|
| 集群数据流向 | 笔记本 → LLM | 集群内 Pod → LLM（可走 in-cluster Ollama，全程不出集群） |
| 凭证存储 | 本地 `~/.k8sgpt.yaml` | Secret 引用，CRD 里只放引用名 |
| 网络出口 | 由你控制（可指向内网 Ollama） | 由 Backend 决定；选 Ollama 即零外呼 |
| 最小权限 | `cluster-reader` 级 RBAC | 同左，建议额外用 NetworkPolicy 限制 operator 的出口 |

---

## 4. 安装部署

### 4.1 CLI 安装

```bash
# macOS
brew install k8sgpt

# Linux (binary)
curl -sLo k8sgpt https://github.com/k8sgpt-ai/k8sgpt/releases/latest/download/k8sgpt_Linux_x86_64
chmod +x k8sgpt && sudo mv k8sgpt /usr/local/bin/

# 验证
k8sgpt version
```

### 4.2 认证到 AI Backend

```bash
# 方式 A: OpenAI (云端)
k8sgpt auth add --backend openai --model gpt-4o-mini \
  --key "sk-xxxx"

# 方式 B: 本地 Ollama (离线/气隙) — 推荐 airgapped 场景
k8sgpt auth add --backend localai \
  --baseurl http://ollama.ollama.svc:11434/v1 \
  --model llama3.1:8b
# 注意: Ollama 暴露 OpenAI 兼容端点，K8sGPT 当作 localai/openai-compat 后端对接

# 查看已配置后端
k8sgpt auth list
# 切换默认后端
k8sgpt auth default --backend localai
```

> Ollama 端建议至少 `qwen2.5:14b` 或 `llama3.1:8b` 以上，模型太小会导致解释含糊。详见 [[部署推理/Inference_Engines/Ollama_Deep_Dive]]。

### 4.3 Operator 安装（Helm）

```bash
helm repo add k8sgpt https://charts.k8sgpt.ai/
helm repo update

helm upgrade --install k8sgpt k8sgpt/k8sgpt \
  --namespace k8sgpt --create-namespace \
  --set serviceAccount.create=true
```

### 4.4 RBAC（最小权限）

Operator 默认需要一个近乎 `cluster-reader` 的 ClusterRole 来读取各类资源。生产建议**自建精简版**，按实际启用的 analyzer 收紧：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: k8sgpt
  namespace: k8sgpt
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: k8sgpt-reader
rules:
  - apiGroups: ["", "apps", "networking.k8s.io", "autoscaling", "policy",
                "cert-manager.io", "batch"]
    resources: ["pods", "services", "ingresses", "nodes", "events",
                "persistentvolumeclaims", "horizontalpodautoscalers",
                "poddisruptionbudgets", "networkpolicies", "deployments",
                "statefulsets", "cronjobs", "certificates"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: k8sgpt-reader
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: k8sgpt-reader
subjects:
  - kind: ServiceAccount
    name: k8sgpt
    namespace: k8sgpt
```

### 4.5 气隙部署清单

| 组件 | 来源 | 说明 |
|------|------|------|
| k8sgpt CLI/Operator 镜像 | 私有镜像仓库 | 离线 `helm pull` + `docker save/load` |
| Ollama 镜像 + 模型权重 | 内网模型仓库 | 提前 `ollama pull llama3.1:8b` 并持久化 |
| Backend | 集群内 Ollama Deployment | Service `ollama.ollama.svc:11434`，全程内网 |
| 出口 NetworkPolicy | 默认 deny-all | 仅放行 operator → ollama 的 11434 |

---

## 5. 快速开始

### 5.1 CLI: 一键扫描并解释

```bash
# 0) 先认证 (见 4.2)

# 1) 列出所有可用 analyzer
k8sgpt filters list
# 默认启用: Pod / ReplicaSet / PersistentVolumeClaim / Service /
#           Ingress / Node / Event / HPA / PDB ...

# 2) 全量扫描(只列问题, 不调 LLM)
k8sgpt analyze
# 输出示例:
# namespace: default, Pod: web-7c9, OOMKilled (Exit 137)
# namespace: api,   Ingress: api-ing, Missing TLS secret

# 3) 扫描 + LLM 解释(人话)
k8sgpt analyze --explain
# AI: Pod web-7c9 因超过 memory limit 512Mi 被内核 OOMKilled。
#     建议上调 resources.limits.memory 至 1Gi，并用 metrics-server
#     排查是否内存泄漏...

# 4) 只扫某几个 analyzer + 输出 JSON 报告
k8sgpt analyze --filter Pod,Service --explain \
  --output json --report > report.json

# 5) 匿名化(默认开), 显式确认
k8sgpt analyze --explain --anonymize
```

### 5.2 Operator: 常驻诊断 + Slack 通知

**Step 1** — 部署一个 AI Backend 凭证（用本地 Ollama 可跳过，直接在 CRD 里写 URL）：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: k8sgpt-openai
  namespace: k8sgpt
type: Opaque
stringData:
  openai-api-key: sk-xxxxxxxx
```

**Step 2** — 创建 `K8sGPT` CRD 实例（用本地 Ollama，零外呼）：

```yaml
apiVersion: core.k8sgpt.ai/v1alpha1
kind: K8sGPT
metadata:
  name: k8sgpt
  namespace: k8sgpt
spec:
  backend:
    type: localai                       # 走 OpenAI 兼容协议
    baseUrl: http://ollama.ollama.svc:11434/v1
    model: llama3.1:8b
  # 若用云端 OpenAI 改为:
  # backend:
  #   type: openai
  #   secret:
  #     name: k8sgpt-openai
  #     key: openai-api-key
  noCache: false                        # 启用结果缓存
  filters:
    - Pod
    - Service
    - Ingress
    - Node
    - Events
    - PersistentVolumeClaim
  # 排除某些 namespace降噪
  # (通过 label/annotation selector 实现)
  enableAnalyzer:
    - name: pod-errors
  notification:
    slack:
      webhook: https://hooks.slack.com/services/xxx/yyy
      channel: "#ops-oncall"
```

**Step 3** — 查看 Result：

```bash
kubectl get results -A
# NAMESPACE   NAME                          KIND      STATUS
# k8sgpt      default-web-7c9-oom           Pod       active
# k8sgpt      api-api-ing-missing-tls       Ingress   active

kubectl describe result default-web-7c9-oom -n k8sgpt
# spec:
#   error:
#     text: "OOMKilled, Exit 137"
#   ai:
#     "Pod web-7c9 超过 memory limit 512Mi 被杀。建议..."
```

**Step 4** — Slack 频道自动收到富化消息（含根因 + 建议）。

---

## 6. 生产配置

### 6.1 Analyzer 启用策略（降噪第一要务）

默认全开 analyzer 在大集群里会产生大量噪声，**生产按"能动手解决的才开"**。下表覆盖内置 analyzer 全家桶（`k8sgpt filters list` 可查最新清单），**典型噪声**列反映 200 节点集群的经验信噪比：

| Analyzer | 检查内容 | 建议开关 | 典型噪声 |
|----------|---------|---------|---------|
| `Pod` | Container `OOMKilled` / `CrashLoopBackOff` / `ImagePullBackOff` / 重启循环 | ✅ 开 | 低（几乎都是真问题） |
| `Deployment` | 合并 Pod+ReplicaSet 信号、滚动更新卡顿、副本不达期望 | ✅ 开 | 低 |
| `StatefulSet` | `ordinal` Pod 未就绪、`volumeClaimTemplate` Pending | ✅ 开 | 低 |
| `DaemonSet` | 某些节点上未调度、滚动更新中断 | ✅ 开 | 中 |
| `CronJob` / `Job` | 失败 Job、`failed` 计数超 `backoffLimit` | ✅ 开 | 中（高频调度时） |
| `Service` | 无后端 Endpoints、`type`/端口错配、外部名解析失败 | ✅ 开 | 低 |
| `Ingress` | 后端 Service 不存在、TLS Secret 缺失、规则冲突 | ✅ 开 | 中 |
| `Node` | `NotReady` / `DiskPressure` / `MemoryPressure` / `PIDPressure` | ✅ 开 | 低 |
| `PersistentVolumeClaim` | Pending（无匹配 PV / StorageClass）、容量/绑定失败 | ✅ 开 | 低 |
| `Events` | 兜底读命名空间内 Warning 事件 | ✅ 开 | 中（事件风暴时刷屏） |
| `Cert-Manager Certificate` | 临近过期、签发失败、Order 卡住 | ✅ 开 | 中 |
| `CoreDNS` | ConfigMap 配置异常、CoreDNS Pod 未就绪 | ⚠️ 看场景 | 中 |
| `HPA` | `DesiredReplicas` 恒等于 `min`/触顶 `max`、指标缺失 | ⚠️ 看场景 | 高（常态触发） |
| `PDB` | `AllowedDisruptions: 0`、与滚动更新冲突 | ⚠️ 看场景 | 高（语义易误判） |
| `NetworkPolicy` | 默认 deny 后选中的 Pod 无任何放行规则 | ⚠️ 看场景 | 高（语义易误判） |

```bash
# CLI 关掉噪声大的 analyzer
k8sgpt filters disable --filter NetworkPolicy,HPA,PDB
k8sgpt filters list          # 核对当前生效集
```

#### 降噪手册（Noise-Reduction Playbook）

大集群降噪是迭代的，推荐四步收敛：

1. **基线采样**：全开跑 24~48h，按 analyzer 统计 `active` Result 数，抽样 50 条标注"真问题占比"，低于 30% 的列为降噪候选。
2. **命名空间收窄**：用 `--namespace` 把扫描圈在生产命名空间，整体排除 `kube-system` / `monitoring` / `gatekeeper-system` 等"已知设计行为"区。
3. **标签级排除**：对混沌注入、压测等已知噪声资源，用 `--label-selector` 反选，或给资源打 `k8sgpt.ai/ignore=true`，自定义 plugin 里读该标签 `continue`。
4. **生命周期治理**：反复误报用 `kubectl patch result <name> -p '{"spec":{"status":"solved"}}'` 标记；挂 TTL Controller 清掉超 N 天的 `solved` Result，避免 etcd 堆积。

```bash
# 仅扫某命名空间 + 排除带 ignore 标签的资源
k8sgpt analyze --explain --namespace payments-prod \
  --label-selector='app.kubernetes.io/part-of=payments,!k8sgpt.ai/ignore'
```

### 6.2 脱敏策略

| 策略 | 适用 |
|------|------|
| 默认脱敏（推荐生产） | 公有云 LLM、合规环境 |
| 关闭脱敏（`--no-anonymize`） | 仅本地 Ollama + 内网调试，可让 LLM 看到真名以提升定位精度 |
| 自定义脱敏字段 | 通过扩展 analyzer / plugin 屏蔽公司特定敏感字段 |

### 6.3 AI Backend 选型（成本 vs 隐私）

| 维度 | OpenAI / Azure | Bedrock / Gemini | 本地 Ollama / vLLM |
|------|----------------|------------------|---------------------|
| 隐私 | 数据出集群 | 数据出集群（区域可控） | **零外呼，气隙可用** |
| 成本 | 按 token 计费 | 按 token 计费 | 仅 GPU/CPU 成本 |
| 解释质量 | ★★★★★ | ★★★★ | ★★★（8B-14B）— ★★★★★（70B+） |
| 延迟 | 0.5~2s | 1~3s | 1~10s（看模型/硬件） |
| 合规 | 需 DPA | 区域选择 | **完全自控** |

> 生产经验：**关键生产集群用本地 Ollama + 14B 以上模型**；Dev/Staging 集群可用 OpenAI gpt-4o-mini 控成本。

### 6.4 通知路由

| 渠道 | 用途 |
|------|------|
| Slack/飞书 | 日常 P3/P4 问题，团队频道 |
| MS Teams | 企业内协作 |
| Discord | 开源社区集群 |
| PagerDuty（经 Alertmanager） | P1/P2 值班，要求响应 |
| Alertmanager webhook | 给原始告警做富化，不单独发 |

### 6.5 结果 TTL 与调度

```yaml
spec:
  # 缓存: 重复问题不重复消耗 token
  noCache: false
  # 周期: Operator 默认每隔一段时间扫描一次; 通过 extraOptions 调
  extraOptions:
    - "--interval=300s"        # 每 5 分钟扫一轮
  # Result 自动清理(配合 TTL controller 或自建 Job)
```

### 6.6 生产 CRD 模板（完整）

```yaml
apiVersion: core.k8sgpt.ai/v1alpha1
kind: K8sGPT
metadata:
  name: k8sgpt-prod
  namespace: k8sgpt
spec:
  backend:
    type: localai
    baseUrl: http://ollama.ollama.svc:11434/v1
    model: qwen2.5:14b
  noCache: false
  filters:                       # 精选低噪声 analyzer
    - Pod
    - Events
    - PersistentVolumeClaim
    - Ingress
    - Node
  anonymize: true                # 强制脱敏
  extraOptions:
    - "--interval=300s"
    - "--max-concurrency=3"      # 限流, 避免 Ollama 过载
  notification:
    slack:
      webhook: ${SLACK_WEBHOOK}
      channel: "#ops-oncall"
   # 资源限制(Operator 自身)
   # 由 Helm values 控制 deployment resources
```

### 6.7 多命名空间 / 多集群 高级 CRD（PagerDuty 路由）

多租户分治时推荐**每个业务命名空间组跑一个独立 `K8sGPT` CR**，各自带独立 backend、filter、通知 sink，便于按业务线核算成本。下面面向 `payments` 业务线，覆盖命名空间范围扫描、prompt 微调（`--language` / `--with-doc`）与 PagerDuty 路由：

```yaml
apiVersion: core.k8sgpt.ai/v1alpha1
kind: K8sGPT
metadata:
  name: k8sgpt-payments
  namespace: k8sgpt
spec:
  backend:
    type: openai
    model: gpt-4o-mini
    secret:
      name: k8sgpt-openai
      key: openai-api-key
  noCache: false
  anonymize: true
  filters:
    - Pod
    - Deployment
    - Service
    - Ingress
    - PersistentVolumeClaim
    - Node
  extraOptions:
    - "--namespace=payments-prod"          # 命名空间范围扫描
    - "--label-selector=app.kubernetes.io/part-of=payments"
    - "--max-concurrency=2"
    - "--language=zh"                      # prompt 微调: 输出语言
    - "--with-doc"                         # prompt 微调: 追加官方文档片段
  notification:
    slack:
      webhook: ${SLACK_WEBHOOK_PAYMENTS}
      channel: "#payments-oncall"
```

> **PagerDuty 路由**：K8sGPT 不直接呼 PagerDuty，而是把 `Result` 暴露成 Prometheus 指标（含 `status`/`kind`/`namespace` 标签），由 Alertmanager 规则判定哪些 active Result 升级为 P1/P2 再 route 到 PagerDuty——paging 门槛受 `group_wait`/`repeat_interval` 统一管控，避免 LLM 抖动炸值班手机。**多集群同理**：每集群一套 Operator + 一个 CR，统一指向中心 LLM 网关，Result 经远程写汇聚到中心 Prometheus，Alertmanager 在中心层统一 route、LLM 后端集中治理。

---

## 7. 运维与可观测

### 7.1 Result 质量与幻觉控制

LLM 会幻觉，K8sGPT 的解释**必须人工复核**再动手。运维要点：

| 风险 | 控制措施 |
|------|---------|
| LLM 编造不存在的资源名 | 脱敏后名字是掩码，反解时严格映射；出现陌生名先查 |
| 建议命令有破坏性 | 任何 "kubectl delete" 类建议都要人审，CI 里禁止自动执行 |
| 模型太小导致解释含糊 | 本地模型至少 14B；复杂问题升级到 70B 或云端大模型 |
| 过时上下文 | Result 有时间戳，超过 1h 的建议重新扫描 |

**幻觉信号核查表**——复核 Result 时，逐条对照下列信号；命中任意一条就把该 Result 打回重扫，不要照着动手：

| 幻觉信号 | 表现 | 根因 | 处置 |
|---------|------|------|------|
| 编造资源名 | 解释里出现集群中根本不存在的 Pod/Service/Deployment 名 | 脱敏反解错位 / 模型外推补全 | 用 `kubectl get` 逐个核对；确认是掩码映射问题就升级 k8sgpt |
| 泛泛而谈、不可执行 | 建议只是"检查网络配置 / 查看日志"，无具体资源与命令 | 模型太小 / 上下文被截断 / analyzer 未传够字段 | 升级到 14B+；开 `--with-doc`；关掉过载 analyzer |
| 引用过时事件 | 引用的 Event `lastTimestamp` 已是几天前 | Result 未及时清理 / 缓存命中陈旧 | 重新 `analyze`；缩短 `extraOptions --interval` |
| 虚构修复命令 | 给出 `kubectl edit` 不存在的字段或错误 API version | 模型训练数据过时 | 人工核对 `kubectl api-resources` |

```bash
# 批量复核 active results
kubectl get results -A -o custom-columns=NS:.metadata.namespace,\
NAME:.metadata.name,KIND:.spec.kind,AGE:.metadata.creationTimestamp

# 关闭某个误报 result (标记 solved)
kubectl patch result <name> -n k8sgpt --type merge \
  -p '{"spec":{"status":"solved"}}'
```

### 7.2 Backend 延迟与成本

```bash
# CLI 自带耗时统计
k8sgpt analyze --explain --output json | jq '.[] | {name, duration}'

# OpenAI 成本监控: 监控 token 用量(经网关或 OpenAI dashboard)
# Ollama 延迟: 看 ollama 指标 ollama_request_duration_seconds
```

| 指标 | 阈值建议 |
|------|---------|
| 单次 explain 延迟 | < 5s（云端）/ < 10s（本地 14B） |
| Operator 扫描周期 | 300s（避免 LLM 过载） |
| 单集群日均 token | 设预算上限，超出告警 |

**成本与延迟实测对比**（典型规模：200 节点 / ~15k Pod / 一次全量 `analyze --explain` 约 120~200 条问题，未命中缓存）：

| 后端 | 模型 | tokens/run（input+output） | 延迟 p50 | 延迟 p99 | 单次成本（估值） | 适用 |
|------|------|----------------------------|---------|---------|-----------------|------|
| OpenAI | `gpt-4o-mini` | 60k~120k | 0.8s | 2.5s | ~$0.02~0.05 | Dev/Staging，成本敏感（Azure OpenAI 区域驻留同理） |
| Ollama 本地 | `qwen2.5:14b`（CPU/GPU） | 60k~120k | 4s | 12s | 仅硬件摊销 | 气隙 / 数据不出集群 |
| Ollama 本地 | `llama3.1:70b`（单卡 A100） | 60k~120k | 6s | 18s | 仅硬件摊销 | 生产解释质量对标云端 |

> 经验值：**单条 Result 平均消耗 400~900 tokens**（脱敏后的 K8s 上下文 + 解释输出）。命中缓存（`noCache: false`）后重复问题零 token、零延迟，因此**大集群务必开缓存**——日均可省 60~80% token。监控 Ollama 看 `ollama_request_duration_seconds`，监控 OpenAI 建议在出口加 LLM 网关（如 LiteLLM / one-api）统一计费与限流。

### 7.3 误报率与降噪

误报主要来自：HPA/PDB/NetworkPolicy 等非"错误"状态被当成问题。应对：

1. **Filter 收敛**：先全开跑一周，统计每个 analyzer 的 active result 占比，关掉信噪比低的。
2. **namespace 排除**：把 `kube-system`、`monitoring` 等系统命名空间排除。
3. **Result lifecycle**：把反复出现的稳定误报标记 `solved` 或在 analyzer plugin 里加白名单。

### 7.4 Operator 资源占用

```bash
kubectl -n k8sgpt top pod -l app.kubernetes.io/name=k8sgpt
# 典型: CPU 50~200m, Mem 50~150Mi (不含 Ollama)
```

> Ollama 本身的资源开销取决于模型大小，见 [[部署推理/Inference_Engines/Ollama_Deep_Dive]]。建议 Ollama 独立 Deployment，避免与 operator 争抢资源。

### 7.5 常见故障排查

| 现象 | 可能原因 | 解决 |
|------|---------|------|
| `backend error: connection refused` | Ollama Service 不可达 | 检查 Service/DNS；`curl ollama:11434/api/tags` |
| Operator Result 不更新 | 扫描周期过长 / operator crash | `kubectl logs -n k8sgpt -l app.kubernetes.io/name=k8sgpt` |
| 脱敏后输出可读性太差，全篇 `dep_xxx` | 默认 anonymize 把所有真名打码 | 仅本地 Ollama 内网调试时用 `--no-anonymize`；生产保留脱敏但靠反解还原 |
| `backend error: 401 Unauthorized` / auth failed | OpenAI key 过期 / Bedrock 临时凭证失效 / CRD secret 引用错 | `k8sgpt auth list` 核对；轮换 key；确认 Secret 与 CRD 在同 namespace |
| Operator 部署成功但从不生成 Result | RBAC 读权限缺失 / filters 全空 / backend 未认证静默失败 | 看 operator logs 找 `forbidden` / `auth` 错；补 ClusterRole；确认 `spec.filters` 非空 |
| Result 全是 OK，但集群明显在报错 | analyzer 未覆盖该资源 / namespace 被排除 / 事件已过 TTL | `--filter` 加对应 analyzer；去掉 `--namespace` 限制；重跑 `--explain` |
| 通知刷屏、Slack/PagerDuty 被打爆 | 高频扫描 + 无去重 + 每条 Result 都推 | 调大 `--interval`；开缓存；通知层加 Alertmanager `group_wait`/`repeat_interval` |
| 误报率偏高（把正常状态当问题） | HPA/PDB/NetworkPolicy 语义误判 | 关掉噪声 analyzer；自定义 plugin 加白名单；标 `solved` |
| 大集群 `analyze` 超时（backend timeout） | 单次 context 过大 / 并发过高把后端打满 | 加 `--max-concurrency`；按 namespace 分片；换更强后端或拆多 CR |
| 自定义 Go analyzer plugin 不加载 | plugin 符号未导出 / 与 k8sgpt 版本 ABI 不匹配 | 确认 `var Analyzer = ...` 大写导出；用同版本 Go 编译；`--plugin` 路径可读 |

### 7.6 调优 Prompt（extraOptions）

K8sGPT 内置 prompt 模板，可通过 `extraOptions` 传额外参数微调语言风格、详细度。例如让解释更偏"给新人看"、或要求输出 `kubectl` 修复命令。进阶可改 Go plugin 自定义 analyzer 的 prompt 前缀。

---

## 8. 对比与选择

### 8.1 K8sGPT vs 同类 AIOps 工具

| 维度 | K8sGPT | HolmesGPT | Robusta | Botkube | 裸 Prometheus 告警 |
|------|--------|-----------|---------|---------|---------------------|
| 定位 | 集群健康扫描器 + LLM 解释 | 告警分诊员（alert triage） | K8s 事件处理 + 自动化 | 协作机器人（Slack/ChatOps） | 指标阈值告警 |
| 触发方式 | CLI 按需 / Operator 周期 | 主要接 Alertmanager 告警 | 事件/告警触发 | 聊天指令触发 | 规则触发 |
| LLM 解释 | ✅ 核心 | ✅ 核心 | ⚠️ 可选集成 | ⚠️ 可选 | ❌ |
| 离线/气隙 | ✅ Ollama | ✅ Ollama | ⚠️ | ⚠️ | ✅（无需 LLM） |
| 自动修复 | ❌ 只给建议 | ⚠️ 实验性 | ✅ 强（Action） | ⚠️ | ❌ |
| 常驻 Operator | ✅ | ⚠️ | ✅ | ✅ | — |
| CNCF 状态 | Sandbox | Sandbox | 第三方 | 第三方 | Graduated |

### 8.2 何时选 K8sGPT

- ✅ **想要"集群体检"而非"单告警分诊"**：K8sGPT 的 analyzer 是主动扫全集群的，HolmesGPT 更偏被动接告警。
- ✅ **要离线/气隙的 LLM 解释**：K8sGPT 对本地 Ollama 支持成熟，金融、政务内网友好。
- ✅ **想要 GitOps 友好的 Result CRD**：诊断结果可被 kubectl/Argo CD 管理、审计。
- ✅ **CI 流水线里跑 `k8sgpt analyze`** 做部署后健康检查。

### 8.3 何时考虑其它

- 主要痛点是**给已有 Prometheus 告警加解释** → [[CNCF_Cloud_Native_AI/HolmesGPT_Deep_Dive]]。
- 需要**自动执行修复动作**（不止给建议）→ Robusta。
- 团队习惯**在 Slack 里手动跑命令** → Botkube。
- 需要**自主多步 Agent**（自动调多个工具收尾）→ [[CNCF_Cloud_Native_AI/kagent_Deep_Dive]]。
- 只要**指标告警，不要 LLM** → 直接 Prometheus + Alertmanager。

---

## 9. 常见问题 FAQ

**Q1: K8sGPT 能完全离线/气隙运行吗？**
A: 能。CLI 和 Operator 都可对接集群内的 Ollama（OpenAI 兼容端点），全程不外呼。模型提前 `ollama pull` 进集群即可。这是 K8sGPT 相对纯云端方案的最大优势。

**Q2: 把集群数据发给 LLM 会泄露敏感信息吗？**
A: 默认开启 anonymization，会把 namespace/pod/service 名、Secret/ConfigMap 内容等替换成掩码，LLM 只看到结构化的"匿名问题"。合规要求高的场景再叠加本地 Ollama，做到数据零外呼。但要注意：关闭脱敏（`--no-anonymize`）或用云端模型时，仍需走数据合规流程。

**Q3: 集群很大，Result 刷屏怎么降噪？**
A: 三板斧：(1) `filters` 精选低噪声 analyzer，关掉 HPA/PDB/NetworkPolicy；(2) 排除 `kube-system`/`monitoring` 等系统 namespace；(3) 把稳定误报标 `solved` 或在 analyzer plugin 加白名单。

**Q4: K8sGPT 和 HolmesGPT 有什么区别？**
A: 核心区别在**触发模型**：K8sGPT 主动扫全集群（"体检"），HolmesGPT 被动接告警分诊（"看诊"）。K8sGPT 的 Result 是持续生成的 CRD，HolmesGPT 更像给单条告警配一个 LLM 解释器。二者可互补：HolmesGPT 处理实时告警，K8sGPT 做周期性巡检。

**Q5: LLM 解释会幻觉，能直接照着改吗？**
A: 不能。K8sGPT 的输出是"建议"不是"指令"，**必须人工复核**。尤其涉及 `kubectl delete`、扩缩容等动作前要核对 Result 里的 `error.text` 原始字段。生产中禁止把 K8sGPT 的建议直接接入自动修复。

**Q6: 本地 Ollama 用多大模型合适？**
A: 排障场景至少 14B（如 `qwen2.5:14b`、`llama3.1:8b` 勉强）。复杂根因分析建议 70B 级别。模型太小会出现"含糊其辞"或编造资源。详见 [[部署推理/Inference_Engines/Ollama_Deep_Dive]]。

---

## Related

- README — CNCF 云原生 LLM 项目全景
- [[CNCF_Cloud_Native_AI/HolmesGPT_Deep_Dive]] — 告警分诊员，K8sGPT 的互补项
- [[CNCF_Cloud_Native_AI/kagent_Deep_Dive]] — 自主多步 Agent，更强的自动修复方向
- [[运维/SRE_for_AI_Systems]] — 用 LLM 做 SRE 的方法论总论
- [[部署推理/Inference_Engines/Ollama_Deep_Dive]] — K8sGPT 离线模式依赖的本地推理引擎
