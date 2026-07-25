---
title: "HolmesGPT: AI 事故调查员"
category: "12-architecture-infrastructure-cncf-cloud-native-ai"
tags: ["cncf", "kubernetes", "holmesgpt", "aiops", "llm", "incident-response", "agent"]
summary: "> **一句话理解**: HolmesGPT 是 CNCF 沙箱级的「AI 事故调查员」——被告警触发后，它会主动去拉日志/指标、执行 kubectl 命令和 Runbook、关联多源可观测数据，产出根因+证据+修复建议，和 K8sGPT 的「扫集群」互补。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Holmesgpt Deep Dive"
  - "HolmesGPT Deep Dive"
  - HolmesGPT_Deep_Dive
sources: []

---
# HolmesGPT: AI 事故调查员

> **一句话理解**: HolmesGPT 是 CNCF 沙箱级的「AI 事故调查员」——被告警触发后，它会主动去拉日志/指标、执行 kubectl 命令和 Runbook、关联多源可观测数据，产出根因+证据+修复建议，和 K8sGPT 的「扫集群」互补。

> 📐 **概念方法论**: 理解 HolmesGPT 的关键是抓住「调查 (Investigate)」这个动词。它不是被动罗列异常的扫描器（那是 [[CNCF_Cloud_Native_AI/K8sGPT_Deep_Dive]] 的职责），而是被告警驱动后，像 oncall 工程师那样**主动去查**——计划要看什么、调用工具取证、观察结果、再推理下一步，直到形成根因假设。这与 [[13_运维/02_SRE_Reliability/AI_Incident_Response_Playbook]] 中「告警 → 分诊 → 取证 → 根因 → 修复建议」流程完全同构：HolmesGPT 把这条人工流程 LLM Agent 化了。

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

```
HolmesGPT: AI agent for cloud-native troubleshooting / incident investigation
═══════════════════════════════════════════════════════════════════════════
仓库: github.com/HolmesGPT/holmesgpt   (脱胎于 Robusta)
归属: CNCF Sandbox (ai:true), 2025-10 接纳
分类: CNCF Landscape -> AI Native -> Observability / AIOps

核心理念 (是"调查员", 不是"扫描器"):
• 响应式 (Reactive)    : 由告警/事件触发, 针对单一问题深挖
• Agentic (代理式)     : LLM 自主决定下一步看什么、跑什么命令
• 多源关联 (Correlate) : 日志/指标/Trace + kubectl + 变更记录
• Runbook 执行        : 声明式剧本可被 LLM 调用执行
• 根因 + 证据         : 输出结构化报告, 带证据链而非"猜测"

它不是什么:
✗ 集群健康扫描器 (那是 K8sGPT 的活: 主动扫"哪里坏了")
✗ 告警降噪/路由  (那是 Alertmanager/PagerDuty 的活)
✗ 自动修复执行器 (默认只建议不执行; exec 受 RBAC 限制)
✓ 它是"被告警叫醒后, 自己去查清楚到底发生了什么"的 AI oncall
```

### 1.2 核心特性

| 特性 | 说明 | 解决的痛点 |
|------|------|-----------|
| **告警触发式调查** | 被 Alertmanager/PagerDuty/Opsgenie 告警触发后，针对该具体告警深挖 | 告警只说"出事了"，不说"为什么" |
| **Agentic 调查循环** | LLM 自主规划取证步骤，调用工具、观察、迭代推理，直到根因 | 规则脚本覆盖不了长尾场景，需类人推理 |
| **多源数据关联** | 同时拉 Prometheus 指标、Pod 日志、kubectl 状态、Grafana/Datadog 面板 | 根因常藏在跨系统数据里，人工关联慢 |
| **Runbook 执行** | 声明式剧本（"若 CrashLoopBackOff，则查 previous logs / OOM"）可被调用 | 把团队排障 SOP 固化为机器可执行资产 |
| **kubectl 工具** | 可真正 `exec` 进 Pod、跑诊断命令、取 describe/logs，是"有手"的 Agent | 只读 LLM 拿不到实时深度信息 |
| **变更关联** | 关联 GitHub/Jira/Argo CD 变更，判断"是不是最近部署导致" | 大量事故源自变更，需快速定位回归点 |
| **回报到协作平台** | 调查结果回帖到 Slack/Teams/PagerDuty incident | 排障结论散落在个人脑中和聊天记录 |
| **本地 LLM (Ollama)** | 支持接 Ollama 本地模型，可气隙部署、数据不出网 | 金融/政企不能把集群信息发给云端 LLM |

### 1.3 CNCF 状态与版本历程

| 时间 | 事件 |
|------|------|
| 2023–2024 | 在 Robusta 项目中孵化，作为其 AI 排障引擎出现 |
| 2024 | `v0.x` 独立为 HolmesGPT，支持 OpenAI/Azure/Anthropic，CLI + Helm 双形态 |
| 2025 上半年 | Runbook 体系成熟，接入 Grafana/Datadog/kubectl 工具集 |
| 2025-10 | 被接纳为 **CNCF Sandbox** 项目（Landscape 标记 `ai:true`） |
| 2025–2026 | 持续迭代 Ollama 本地化、告警去重、调查深度控制，与 K8sGPT 差异化定位 |

---

## 2. 核心概念

HolmesGPT 围绕五个概念运转：**Investigation（调查）、Tools（工具）、Runbooks（剧本）、LLM Backend（模型后端）、Evidence（证据）**。一条告警触发一次 Investigation，由 LLM 驱动，通过调用 Tools/Runbooks 取证，中间结果沉淀为 Evidence，最终归纳成带根因和修复建议的报告。

```
   告警 ──► ┌─────────────────┐    ┌──────────────┐
            │  Investigation  │───►│ LLM Backend  │
            │  (LLM 驱动循环) │    │ OpenAI/Ollama│
            └────────┬────────┘    └──────────────┘
                     │ 调用取证
        ┌────────────┼─────────────┐
        ▼            ▼             ▼
   ┌────────┐  ┌──────────┐  ┌──────────┐
   │ Tools  │  │ Runbooks │  │ 变更源   │
   │kubectl │  │ 声明式   │  │GitHub/Jira│
   │PromQL  │  │ 排障剧本 │  └──────────┘
   │日志/Trc│  └────┬─────┘
   └───┬────┘       │(也调用Tools)
       └─────┬──────┘
             ▼
   ┌───────────────────────────────────┐
   │ Evidence 证据链 → 调查报告          │
   │   根因 + 证据 + 修复建议            │
   │   → 回帖 Slack/Teams/PagerDuty     │
   └───────────────────────────────────┘
```

**Investigation** 是核心工作单元：一条告警进入后创建上下文（告警元数据、关联工作负载、逐步积累的观察记录），由 LLM 多轮迭代，直到判定证据足够给出根因，或达到步数/时间上限。**Evidence** 是每份报告附带的证据链——调用了哪些工具、拿到什么原始数据、每步推理依据，让结论可回溯，避免「LLM 凭空编根因」，也是事后复盘的依据。

**Tools** 是「有手」的体现——LLM 通过工具接口真实查询集群状态：

| 工具类别 | 典型动作 | 说明 |
|---------|---------|------|
| **kubectl** | `describe pod`、`logs --previous`、`get events`、`top` | 受 RBAC 限制，默认只读 + 有限 exec |
| **Prometheus** | 执行 PromQL，拉相关指标时间序列 | 围绕告警指标做"前后对比"取证 |
| **日志/Trace** | 从 Loki/ES/CloudWatch/Jaeger 拉相关数据 | 取告警时间窗内异常 |
| **Grafana/Datadog** | 截取 dashboard 面板快照 | 把"图表证据"纳入报告 |
| **变更源** | 查 GitHub Commit/PR、Jira、Argo CD rollout | 判断是否"最近变更导致" |

**Runbook** 是区别于「裸 LLM + 工具」的关键——一份**声明式排障剧本**，描述「遇到某类问题应按什么顺序查什么」。LLM 调查时按告警类型匹配并调用 Runbook 取证——相当于把资深 SRE 的经验「编译」成机器可执行资产：

```yaml
# 针对Pod CrashLoopBackOff 的排障剧本 (概念示意)
runbook:
  name: "investigate-crashloopbackoff"
  trigger:
    alert: "KubePodCrashLooping"
  steps:
    - "获取 Pod previous 容器日志 (kubectl logs --previous)"
    - "检查是否 OOMKilled (describe pod 的 Last State)"
    - "检查 requests/limits 是否过低"
    - "查询最近 30 分钟该 Deployment 的镜像/配置变更"
    - "若 OOM: 建议调大 memory limit; 若报错: 提取错误栈关联代码"
```

**LLM Backend** 模型无关，LLM 只是「推理引擎」：

| 后端 | 适用 | 数据隐私 | 成本 |
|------|------|---------|------|
| **OpenAI (GPT-4o 等)** | 通用、推理强 | 出网 | 按 token |
| **Azure OpenAI** | 企业合规、区域可控 | 企业租户 | 按 token + Azure |
| **Anthropic (Claude)** | 长上下文、推理强 | 出网 | 按 token |
| **Ollama (本地)** | 气隙、强隐私、离线 | 完全不出网 | 仅算力 |

---

## 3. 架构设计

### 3.1 调查引擎的 Agentic 循环

核心是 **ReAct 风格的 Agent 循环**（Reason + Act）：LLM 先推理出"下一步该看什么"，调用工具取证，观察结果，再推理下一步，迭代直到形成根因假设或触及边界。

```
   告警 ─► ┌──────────────────────────────────────────────────────────┐
           │  Investigation Engine  (Agentic ReAct Loop)              │
           │  ┌────────┐  ┌────────┐  ┌─────────┐  ┌───────────────┐  │
           │  │1. Plan │► │2.Tool  │► │3.Observe│► │4. Reason:     │  │
           │  │决定看啥│  │ Call   │  │ 看结果  │  │ 证据够了吗?   │  │
           │  └────────┘  └────────┘  └─────────┘  └──────┬────────┘  │
           │       ▲                                     │ 否→回Plan  │
           │       └─────────────────────────────────────┘            │
           │                          是 ▼                            │
           └──────────────────────────┬───────────────────────────────┘
                                      ▼
                      调查报告: 根因+证据+建议 ──► 回帖 Slack/Teams/PD
```

| 控制点 | 作用 | 生产意义 |
|-------|------|---------|
| **步数上限 (max_steps)** | 限制迭代轮数 | 防无限循环烧 token |
| **超时 (timeout)** | 限制单次调查总时长 | 不阻塞告警通道 |
| **工具白名单** | 限制可调用工具 | 安全/合规 |
| **RBAC 边界** | 受 ServiceAccount 权限约束 | 最小权限 |
| **终止判据** | LLM 判定证据足够即停 | 避免过度调查 |

把抽象循环落到真实工具调用——告警 `KubePodCrashLooping @ default/payments-api`：

```
告警: KubePodCrashLooping (pod=payments-api-7c9, restarts=14)
  │
  ├─ Step1 [kubectl logs --previous]  -> "OutOfMemoryError: Java heap" (exit 137)
  ├─ Step2 [PromQL] max_over_time(    -> 峰值 512Mi > limit 256Mi
  │           container_memory_working_set_bytes[30m])
  ├─ Step3 [Runbook] crashloop-deep   -> rollout 2h 前部署、镜像未变, 排除回归
  └─ Step4 [Reason] 根因=OOMKilled    -> 建议 limit 256Mi→768Mi + 查堆泄漏
        ▼
  Notifier ──► Slack: 根因 OOMKilled | 证据[step1 日志][step2 指标][step3 无变更]
                      建议 limit→768Mi  [认领事故] [静默1h]
```

四步跨了 **kubectl / PromQL / Runbook** 三类工具，每步留证据——这正是 oncall 拿到告警后会做的事，只是 Agent 化、秒级完成。

### 3.2 核心组件职责

服务内拆为五个解耦组件，通过 Investigation 上下文协作，可独立替换（换模型只动 LLM Backend、加诊断能力只往 Tool Registry 注册新工具，互不耦合）：

| 组件 | 职责 | 典型实现 |
|------|------|---------|
| **Investigation Engine** | 驱动 ReAct 循环，持有告警上下文与中间状态 | Python 控制循环 + step 计数 |
| **Tool Registry** | 注册并向 LLM 暴露工具，统一鉴权/超时 | kubectl / Prometheus / 日志 / Runbook |
| **LLM Backend** | 抽象模型调用，多 provider 可切换 | OpenAI / Azure / Anthropic / Ollama |
| **Notifier** | 报告回发协作平台，按 severity 路由 | Slack / Teams / PagerDuty webhook |
| **Evidence Store** | 沉淀每步工具调用与返回，组装证据链 | 内存 + 可选落盘，供事后复盘 |

### 3.3 与告警/协作平台的集成拓扑

HolmesGPT 以**旁路**方式接入现有可观测体系，不改变告警链路，只"插队"在告警和人之间多一个 AI 调查环节：

```
┌──────────────┐ 告警 ┌───────────────┐ webhook ┌───────────────────────┐
│ Prometheus   │─────►│ Alertmanager  │────────►│      HolmesGPT        │
│ / 监控源      │      └───────────────┘         │  (Investigation 环)   │
└──────────────┘                                │  kubectl ─► K8s API    │
                                                 │  PromQL  ─► Prometheus │
                                                 │  日志/Tr ─► Loki/ES/Jaeger│
                                                 │  变更关联► GitHub/Jira/Argo│
                                                 │  Runbook 库            │
                                                 │        │ LLM 调用       │
                                                 │        ▼               │
                                                 │  LLM Backend           │
                                                 │  (OpenAI / Ollama)     │
                                                 └──────────┬────────────┘
                                                            │ 调查报告
                          ┌─────────────────────────────────┼──────────────┐
                          ▼                 ▼                 ▼              ▼
                      ┌──────┐        ┌─────────┐      ┌───────────┐   ┌──────────┐
                      │Slack │        │ Teams   │      │PagerDuty  │   │Opsgenie  │
                      └──────┘        └─────────┘      └───────────┘   └──────────┘
```

妙处在于**不替代任何现有组件**：Alertmanager 照常路由，PagerDuty 照常值班，HolmesGPT 只额外在告警触发时"自动跑一遍排障脚本"并回帖。接入风险低，可先小范围灰度（只接某 severity 告警）再扩大。

---

## 4. 安装部署

HolmesGPT 有两种形态：**Helm Chart（集群常驻服务，生产推荐）** 和 **CLI 二进制（一次性/调试）**。

### 4.1 前置条件

| 项 | 要求 |
|----|------|
| Kubernetes / Helm | >= 1.24 / >= 3.10 |
| 告警源 | 已运行 Alertmanager / PagerDuty / Opsgenie 之一 |
| LLM 后端 | OpenAI API Key 或集群内 Ollama，二选一 |
| RBAC | HolmesGPT ServiceAccount 需 read + 有限 exec |

### 4.2 Helm 安装

```bash
helm repo add robusta https://robusta-charts.storage.googleapis.com
helm repo update

helm install holmes robusta/holmes \
  --namespace holmes --create-namespace \
  --set holmes.openai.apiKey=$OPENAI_API_KEY
```

### 4.3 接入 Alertmanager + Slack

```yaml
# alertmanager-config.yaml (片段): webhook 指向 HolmesGPT
route:
  receiver: holmes
receivers:
  - name: holmes
    webhook_configs:
      - url: http://holmes.holmes.svc.cluster.local/alertmanager
        send_resolved: true
```

```yaml
# holmes values.yaml: 回报到 Slack
holmes:
  slack:
    enabled: true
    webhook_url: "https://hooks.slack.com/services/XXX/YYY/ZZZ"
    default_channel: "#ops-oncall"
```

### 4.4 AI 后端：云端 vs 本地

**本地（Ollama，气隙/隐私）**——先在集群内部署 Ollama 并拉模型：

```bash
helm install ollama <ollama-chart> --namespace ollama
kubectl -n ollama exec deploy/ollama -- ollama pull qwen2.5:14b
```

```yaml
holmes:
  llm:
    provider: ollama
    ollama:
      url: http://ollama.ollama.svc.cluster.local:11434
      model: qwen2.5:14b
```

### 4.5 RBAC（最小权限）

需要「读集群 + 有限 exec」。生产务必收窄，不要用 cluster-admin：

```yaml
# holmes-rbac.yaml
apiVersion: v1
kind: ServiceAccount
metadata: { name: holmes, namespace: holmes }
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata: { name: holmes-investigator }
rules:
  - apiGroups: ["", "apps", "batch"]
    resources: ["pods", "pods/log", "events", "deployments", "jobs", "configmaps"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods/exec"]
    verbs: ["create"]   # 仅必要 exec, 用于诊断
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata: { name: holmes-binding }
roleRef: { apiGroup: rbac.authorization.k8s.io, kind: ClusterRole, name: holmes-investigator }
subjects:
  - kind: ServiceAccount
    name: holmes
    namespace: holmes
```

> 改用按命名空间绑定的 Role，可进一步把调查范围限制在特定命名空间。

---

## 5. 快速开始

目标：从零到端到端跑通一条 AI 调查。共六步——前两步安装接入（细节见 §4），步骤 3 写 Runbook，步骤 4–5 触发告警并看结果。

### 5.1 步骤 1–2：安装、接告警源、配模型

```bash
helm install holmes robusta/holmes -n holmes --create-namespace \
  --set holmes.openai.apiKey=$OPENAI_API_KEY
```

```yaml
holmes:                          # holmes-values.yaml
  alertmanager: { enabled: true, url: http://alertmanager.monitoring:9093 }
  llm.ollama:  { url: http://ollama.ollama.svc:11434, model: qwen2.5:14b }   # 气隙
  # llm.openai: { api_key: "$OPENAI_API_KEY", model: gpt-4o }                # 云端
  slack: { webhook_url: "https://hooks.slack.com/...", default_channel: "#ops-oncall" }
```

> Alertmanager 加 receiver 指向 HolmesGPT；PagerDuty/Opsgenie 把 incident webhook 指向 `/pagerduty`、`/opsgenie` 端点。

### 5.2 步骤 3：写自定义 Runbook

把团队排障 SOP 沉淀为声明式剧本——投资回报最高的环节，ConfigMap 挂载即生效：

```yaml
# custom-runbooks/crashloop-deep.yaml
runbook:
  name: "crashloop-deep"
  trigger: { alert: "KubePodCrashLooping" }
  steps:
    - "取上一轮崩溃日志 (kubectl logs --previous)"
    - "describe pod 查 OOMKilled / ExitCode"
    - "PromQL 取 30m 内存峰值对比 limit"
    - "rollout history 排除变更回归"
    - "OOM: 建议调大 limit; 报错: 关联代码"
```

```bash
kubectl -n holmes create configmap holmes-runbooks \
  --from-file=custom-runbooks/ -o yaml | kubectl apply -f -
```

> Runbook 不是硬编码流程，而是给 LLM 的「排障指南」——LLM 按告警匹配后自主决定执行顺序与工具调用。

### 5.3 部署一个会触发告警的工作负载

```yaml
# broken-pod.yaml - 一个故意 OOM 的 Pod
apiVersion: v1
kind: Pod
metadata: { name: oom-demo, namespace: default }
spec:
  containers:
    - name: memhog
      image: polinux/stress
      resources:
        requests: { memory: "32Mi" }
        limits:   { memory: "64Mi" }   # 故意设小, 必然 OOM
      command: ["stress", "--vm", "1", "--vm-bytes", "256M", "--vm-hang", "1"]
  restartPolicy: Always
```

```bash
kubectl apply -f broken-pod.yaml
kubectl get pod oom-demo -w   # 很快进入 CrashLoopBackOff
```

### 5.4 触发告警并观察调查

若已配 `KubePodCrashLooping` 规则，Prometheus 会自动触发经 Alertmanager 推给 HolmesGPT；也可手动 CLI 触发（适合调试）：

```bash
holmes investigate alert --alert KubePodCrashLooping --namespace default --pod oom-demo
kubectl -n holmes logs -f deploy/holmes   # 观察 Agent 循环
```

典型日志展现每一步：

```
[plan]    KubePodCrashLooping @ default/oom-demo -> 计划: previous logs + describe
[tool]    kubectl logs oom-demo --previous
[observe] stress 进程被 SIGKILL, exit code 137
[plan]    检查是否 OOMKilled
[tool]    kubectl describe pod oom-demo
[observe] Last State: Terminated, Reason: OOMKilled, ExitCode=137
[reason]  容器超 memory limit(64Mi) 被 OOM Kill -> CrashLoop
[done]    根因: OOMKilled; 建议: 调大 limit 或排查内存泄漏
```

### 5.5 接收 Slack 回帖

几秒到几十秒后，HolmesGPT 在 `#ops-oncall` 发出结构化消息：告警摘要、根因（OOMKilled）、证据链（step1 OOM 日志 / step2 内存峰值 / step3 无变更）、修复建议（limit 256Mi→768Mi），并附 `[查看完整调查] [认领事故] [静默1h]` 动作链接。全程无需人工介入，oncall 可直接点链接复核证据。

### 5.6 常用 CLI 命令

| 命令 | 用途 |
|------|------|
| `holmes investigate alert --alert <name>` | 针对一条告警做调查 |
| `holmes investigate issue --jira <id>` | 针对 Jira issue 做调查 |
| `holmes investigate pr --github <repo>#<n>` | 针对 PR 变更做调查 |
| `holmes ask "<问题>"` | 自然语言提问，让 Agent 去集群里找答案 |

---

## 6. 生产配置

### 6.1 告警源与灰度策略

| 告警源 | 接入 | 适用 |
|-------|------|------|
| **Alertmanager** | webhook receiver | 已用 Prometheus 生态 |
| **PagerDuty / Opsgenie** | incident webhook | 已用 PD/OG 值班 |
| **Grafana** | Alerting webhook | Grafana 统一告警 |
| **Datadog** | monitor webhook | 已用 DD 监控 |

生产建议：**先只接 `severity=critical`**，验证调查质量后再放开到 warning。

### 6.2 Runbook 库（投资回报最高处）

把高频事故排障 SOP 沉淀为 Runbook，是 HolmesGPT 价值最大的环节：

```yaml
# custom-runbooks/app-oom-investigation.yaml
runbook:
  name: "app-oom-investigation"
  description: "针对业务 Pod OOM 的深度调查"
  trigger: { alert: "KubeContainerOOMKilled" }
  steps:
    - "获取 Pod 最近 1h 内存指标 (container_memory_working_set_bytes)"
    - "检查是否存在单调上升 (疑似泄漏)"
    - "对比 limit 与实际峰值, 判断阈值是否过低"
    - "查最近部署变更 (Argo CD / GitHub), 判断是否回归"
    - "若泄漏: 建议加监控+排查代码; 若阈值低: 建议调大 limit"
```

Runbook 目录挂进 HolmesGPT Pod 即被加载。

### 6.3 LLM 后端选择

| 维度 | 云端 (OpenAI/Azure/Claude) | 本地 (Ollama) |
|------|---------------------------|---------------|
| 推理质量 | 高（前沿模型） | 中（受本地模型限制） |
| 数据隐私 | 集群信息出网 | 完全不出网 |
| 成本 | 按 token | 仅算力硬件 |
| 气隙 | 不支持 | 支持 |
| 适用 | 通用、追求调查质量 | 金融/政企/强合规 |

### 6.4 调查深度与通知控制

```yaml
holmes:
  investigation:
    max_steps: 12              # 单次调查最多迭代步数
    timeout_seconds: 120       # 单次调查总超时
    max_concurrent: 5          # 同时进行的调查数
    dedup_window_seconds: 300  # 同一告警 5 分钟内只查一次
```

| 策略 | 配置 | 效果 |
|------|------|------|
| **告警去重** | `dedup_window` | 同 alertname+labels 窗口内只查一次 |
| **按 severity 路由** | critical→深查，warning→简查 | 区分投入 |
| **分级回报** | critical→@oncall，warning→频道 | 减少无效 @ |

### 6.5 工具执行 Guardrails

能 `exec` 进 Pod 是双刃剑，生产必须加护栏：

| 护栏 | 做法 |
|------|------|
| **RBAC 最小权限** | 只读 + 受控 exec，禁写/禁删 |
| **命令白名单** | 限制可执行诊断命令（如 `ls/cat/netstat`） |
| **禁 mutating** | 明确禁止 apply/delete/交互式 shell |
| **审计日志** | 记录每次工具调用及输出（见第 7 节） |
| **命名空间隔离** | Role 而非 ClusterRole，限定调查范围 |

### 6.6 生产 values.yaml 汇总

```yaml
holmes:
  llm:
    provider: azure_openai
    azure_openai:
      endpoint: "https://my-aoai.openai.azure.com"
      deployment: "gpt-4o"
      apiKey: "${AZURE_OAI_KEY}"
  alertmanager:
    enabled: true
    url: http://prometheus-alertmanager.monitoring:9093
  slack:
    enabled: true
    webhook_url: "${SLACK_WEBHOOK}"
    default_channel: "#ops-oncall"
  grafana:
    enabled: true
    url: http://grafana.monitoring:3000
  investigation:
    max_steps: 12
    timeout_seconds: 120
    max_concurrent: 5
    dedup_window_seconds: 300
  runbooks:
    custom_path: /etc/holmes/runbooks
  guardrails:
    exec_enabled: true
    exec_command_whitelist: ["ls", "cat", "netstat", "env", "ps"]
    allow_mutating: false
  resources:
    requests: { cpu: "200m", memory: "256Mi" }
    limits:   { cpu: "1",    memory: "1Gi" }
```

---

## 7. 运维与可观测

### 7.1 调查质量与成本指标

HolmesGPT 自身是会产生错误的 AI 系统，需单独观测：

| 指标 | 含义 | 健康基线 |
|------|------|---------|
| `holmes_investigations_total` | 调查总次数（按告警类型） | 趋势平稳 |
| `holmes_investigation_duration_seconds` | 单次调查耗时 | P95 < 90s |
| `holmes_tool_calls_total` | 工具调用次数（按工具） | 监控 kubectl 调用量 |
| `holmes_investigation_steps` | 单次调查迭代步数 | 均值 < 8 |
| `holmes_root_cause_confidence` | LLM 自评根因置信度 | 观测分布 |
| `holmes_llm_tokens_total` | LLM token 消耗（按方向） | 成本核心 |

### 7.2 LLM 幻觉检查（最关键的风险控制）

AI 调查员最大风险是「一本正经地编根因」，必须有人工复核环节：

- **强制 Evidence 可追溯**：每条结论必须能点开原始日志/指标，无证据结论标记「低置信」。
- **抽样人工复核**：每日随机抽 N 条由 oncall 复核根因准确性，记录误判率。
- **置信度阈值**：低置信度结论只进频道、不 @ oncall，避免误导。
- **对比基线**：定期用历史已复盘事故回放，检查是否给出与人工一致的根因。

### 7.3 工具执行审计

每次工具调用都应落审计日志，用于合规与事后追溯：

```json
{
  "ts": "2026-06-16T03:12:44Z",
  "investigation_id": "inv-a1b2",
  "alert": "KubePodCrashLooping",
  "tool": "kubectl",
  "command": "kubectl -n default logs oom-demo --previous",
  "result_size_bytes": 1834,
  "exit_code": 0,
  "duration_ms": 412
}
```

建议投递到独立 SIEM/Loki 索引，与业务日志隔离，便于合规审计。

### 7.4 成本控制

| 手段 | 做法 | 效果 |
|------|------|------|
| **去重窗口** | 同告警 5 分钟内不重复查 | 削峰 |
| **分级深度** | critical 深查、warning 浅查 | 减无效 token |
| **max_steps 限制** | 限制迭代步数 | 防跑飞 |
| **日志截断** | 工具返回的大日志先截断 | 减输入 token |
| **本地模型分流** | 高频/低价值查询走 Ollama | 贵查询留给云端 |
| **预算告警** | 对 token 消耗设日预算告警 | 防失控 |

### 7.5 常见运维问题

| 症状 | 可能原因 | 排查 |
|------|---------|------|
| 根因总「不相关」 | LLM 太弱 / 工具拿不到上下文 | 换更强模型；检查 RBAC 能否取日志 |
| 调查耗时过长 | max_steps 过大 / 工具慢 | 调小 max_steps；查 kubectl/PromQL 延迟 |
| Slack 被刷屏 | 未配去重 | 设 dedup_window |
| Ollama 质量差 | 本地模型推理能力不足 | 升级模型或关键告警切云端 |
| 工具调用被拒 | RBAC 不够 | 检查 Role/ClusterRole 权限 |
| 误报根因 | Runbook 缺失或太泛 | 补充/收窄自定义 Runbook |

---

## 8. 对比与选择

### 8.1 与同类工具对比

| 维度 | **HolmesGPT** | **K8sGPT** | **Robusta** | **纯 Alertmanager** |
|------|--------------|-----------|-------------|---------------------|
| **定位** | AI 事故调查员（响应式） | AI 集群扫描器（主动式） | K8s 事件/告警自动化平台 | 告警路由/分发 |
| **触发** | 被告警触发后深挖 | 主动扫描集群异常 | 事件驱动多功能平台 | 规则阈值触发 |
| **产出** | 根因 + 证据 + 修复建议 | 异常清单 + 解释 | 诊断 + 自动修复 + 通知 | 告警通知 |
| **Agentic** | 强（自主多步调查） | 弱（一次分析） | 中（规则+脚本） | 无 |
| **kubectl exec** | 有（受控） | 通常只读分析 | 有 | 无 |
| **本地 LLM** | 支持（Ollama） | 支持（Ollama） | 依赖内置 AI | 不涉及 |
| **CNCF** | Sandbox | Sandbox | 非 CNCF | 生态标准 |

### 8.2 何时选谁

- **选 HolmesGPT**：告警进来后要自动查清根因而非只收通知；想把 SRE 排障 SOP 固化为 Runbook 资产；oncall 压力大，希望 AI 先分诊取证；有隐私/气隙要求需本地 LLM。
- **选 K8sGPT**：要**主动巡检**定期扫"集群哪里不健康"；要简单的异常解释，不需多步深挖；要轻量、只读、低风险的健康体检。

### 8.3 互补使用（推荐）

HolmesGPT 和 K8sGPT **不是二选一，而是互补**，经典组合形成「扫 → 查 → 修」闭环：

```
 K8sGPT (主动扫描) ──► 巡检报告 / 发现潜在问题 (周期性, 广度)
        │ 触发告警 (Alertmanager)
        ▼
 HolmesGPT (响应调查) ──► 针对具体告警深挖根因+证据+建议 (深度)
        │ 人工决策 + Robusta 自动修复 (可选, 动作)
```

K8sGPT 负责**发现**（广度扫集群），HolmesGPT 负责**解释**（深度查单点），Robusta 可选负责**修复**（动作）。

---

## 9. 常见问题 FAQ

**Q1：HolmesGPT 会自动改我的集群吗（自动修复）？**
默认不会。产出是**根因 + 证据 + 修复建议**，是否执行由人决定。工具受 RBAC 限制，建议生产关闭 mutating。如需自动修复可配 Robusta remediation，但要单独评估风险。

**Q2：数据隐私怎么保证？能气隙部署吗？**
可以。LLM 后端切到集群内 Ollama（本地模型），所有日志/指标/kubectl 输出都不出网，满足气隙与强合规。代价是本地模型推理质量通常弱于前沿云端模型。

**Q3：LLM 给的根因是错的怎么办？**
依靠 Evidence 证据链复核：每条结论都应能回溯到原始日志/指标。生产应建立抽样人工复核机制，把误判率当指标监控，并通过补充 Runbook 持续改进。低置信结论不 @ oncall。

**Q4：和 K8sGPT 到底什么区别？会重复吗？**
K8sGPT 是"扫集群找问题"（主动、广度），HolmesGPT 是"被告警叫醒后查清楚为什么"（响应、深度）。两者互补不冲突，推荐同时用（见 8.3）。

**Q5：一条告警要花多少 token？贵吗？**
取决于调查深度和工具返回的日志大小，典型一次中等复杂度调查在数千到数万 token。通过去重窗口、max_steps、日志截断、低价值查询走本地模型可把成本压到可接受范围。建议对 token 设日预算告警。

**Q6：Runbook 怎么积累？冷启动怎么办？**
冷启动可只用内置 Runbook，靠 LLM 通用推理兜底。随团队处理真实事故，把高频事故 SOP 逐步沉淀为自定义 Runbook——这相当于把团队经验编译成机器可执行资产，越用越准。

---

## Related

- [[CNCF_Cloud_Native_AI/README]] — CNCF 云原生 AI 项目总览
- [[CNCF_Cloud_Native_AI/K8sGPT_Deep_Dive]] — AI 集群扫描器（主动巡检，与 HolmesGPT 互补）
- [[CNCF_Cloud_Native_AI/kagent_Deep_Dive]] — 多 Agent 框架，可承载更复杂的多步运维 Agent
- [[13_运维/02_SRE_Reliability/AI_Incident_Response_Playbook]] — AI 事故响应流程，HolmesGPT 是其 Agent 化实现
- [[13_运维/SRE_for_AI_Systems]] — AI 系统的 SRE 实践，HolmesGPT 同样适用于 LLM 服务事故调查
