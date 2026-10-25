---
title: "K8s Policy as Code for AI (OPA / Kyverno / Gatekeeper / 策略引擎)"
category: concepts
tags:
  - k8s
  - policy
  - opa
  - kyverno
  - gatekeeper
  - rego
  - cel
  - ai-governance
  - ai-compliance
aliases:
  - K8s Policy AI
  - OPA / Open Policy Agent
  - Kyverno
  - Gatekeeper
  - Rego
  - CEL
  - Policy as Code
relationships:
  - target: "概念/opa"
    type: extends
  - target: "概念/kyverno"
    type: extends
  - target: "概念/ai-governance"
    type: related_to
  - target: "概念/llm-safety"
    type: related_to
summary: "K8s 上对 AI 工作负载实施策略即代码(Policy as Code)的统一方案——OPA/Rego 做通用策略语言,Kyverno 用 CEL 简化策略编写,Gatekeeper 是 OPA 在 K8s 的官方集成,2025-2026 新增 AI 专项策略(GPU 配额、模型来源审计、敏感数据过滤、推理限流)。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "OPA / Kyverno / Gatekeeper / 策略引擎"
---

# K8s Policy as Code for AI

> 中文简称：OPA / Kyverno / Gatekeeper / 策略引擎

> **一句话理解**:把"AI 集群治理规则"用代码表达——Kyverno 用 CEL 写策略像写 SQL,OPA/Rego 像写逻辑程序,Gatekeeper 集成到 Admission Webhook。AI 场景专项策略:GPU 配额、模型来源白名单、推理 QPS 限流、敏感数据脱敏、PII 检测、模型血缘追踪。

---

## 一、为什么需要 Policy as Code for AI?

- **GPU 资源失控**:一个团队申请 100 张 H100,不治理就"占着不用"
- **模型来源不明**:随便拉个 HuggingFace 模型就跑生产,可能含木马或受限模型
- **数据合规**:GDPR / EU AI Act / 个人信息保护法,要求"模型训练数据可追溯"
- **推理滥用**:无 QPS 限流,被刷爆,账单失控
- **审计追踪**:金融/医疗要求所有模型调用留痕

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 策略即代码 | Policy as Code(PaC) | 用代码表达治理规则 |
| 准入控制 | Admission Control | K8s API 请求拦截 |
| 准入控制器 | Admission Controller | K8s 拦截器 |
| 准入 Webhook | Admission Webhook | HTTP 回调,扩展准入逻辑 |
| 验证准入 | Validating Admission | 验证请求合法性 |
| 变更准入 | Mutating Admission | 修改请求默认值 |
| 通用表达式语言 | Common Expression Language(CEL) | Google/K8s 推出的策略表达式 |
| 策略语言 | Rego | OPA 的专用策略语言 |
| 策略引擎 | Policy Engine | 执行策略的服务 |
| 资源配额 | Resource Quota | 限制 namespace 资源总量 |
| 限制范围 | LimitRange | 限制 Pod/Container 默认值 |
| 策略违规 | Policy Violation | 违反策略的事件 |
| 审计 | Audit | K8s 审计日志,记录所有 API 调用 |
| 守护集 | DaemonSet | 节点级守护进程 |
| 集群策略 | ClusterPolicy | Kyverno 集群级策略 |
| 策略报告 | PolicyReport | wgpolicyk8s 标准的策略合规报告 |
| 模式匹配 | Pattern Matching | Rego 规则中数据匹配方式 |
| 形式化验证 | Formal Verification | 数学证明策略无歧义 |

---

## 三、核心项目对比(2026-02 快照)

| 项目 | 策略语言 | 适用场景 | GitHub Stars | 上手难度 |
|---|---|---|---|---|
| **OPA / Gatekeeper** | Rego | 通用、复杂策略 | OPA 9K+ / GK 3.8K | ★★★★ (Rego 学习曲线陡) |
| **Kyverno** | CEL + YAML | K8s 原生,简单直观 | 6K+ | ★★ (CEL 易学) |
| **Kubewarden** | Rego / WASM | 多语言策略(WebAssembly) | 1.5K+ | ★★★ |
| **Validating Admission Policy(VAP)** | CEL | K8s 1.30+ GA,内置 | 内置 | ★★ (K8s 原生) |
| **jsPolicy** | JavaScript / TypeScript | JS 开发者友好 | 0.7K+ | ★★ |
| **Polaris** | YAML 检查 | 集群健康检查 + 报告 | 3.5K+ | ★ (只检查不拦截) |

---

## 四、Kyverno(CEL + YAML)— K8s 原生首选

### 4.1 优势

- **策略用 YAML 写**,K8s 用户最熟
- **CEL 表达式**轻量、强大(类似 SQL/JS 表达式)
- **三种动作**:`validate` / `mutate` / `generateImages`(生成资源)
- **PolicyReport** 标准合规报告
- 2025-2026 新增:**生成式策略**(自动生成 Kyverno 策略)+ **AI 治理插件**

### 4.2 AI 治理实战

#### 4.2.1 GPU 配额与标签强制

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: ai-gpu-quota
spec:
  validationFailureAction: Enforce
  rules:
  - name: require-ai-team-label
    match:
      any:
      - resources:
          kinds: ["Pod"]
          namespaces: ["ai-*"]
    validate:
      message: "All AI Pods must have labels ai-team and ai-model"
      pattern:
        metadata:
          labels:
            ai-team: "?*"
            ai-model: "?*"
  - name: max-gpu-per-pod
    match:
      any:
      - resources:
          kinds: ["Pod"]
    validate:
      message: "Single Pod cannot request more than 8 GPUs"
      pattern:
        spec:
          containers:
          - resources:
              limits:
                "nvidia.com/gpu": "8|?*"
```

#### 4.2.2 镜像来源白名单(防木马模型)

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: ai-image-whitelist
spec:
  validationFailureAction: Enforce
  rules:
  - name: allowed-registries
    match:
      any:
      - resources:
          kinds: ["Pod"]
          namespaces: ["ai-*"]
    validate:
      message: "AI Pods must use approved registries"
      pattern:
        spec:
          containers:
          - image: "registry.example.com/ai/* | nvcr.io/nvidia/* | quay.io/coreos/*"
```

#### 4.2.3 推理服务自动注入限流

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: ai-inference-mutate
spec:
  rules:
  - name: inject-token-limit-env
    match:
      any:
      - resources:
          kinds: ["Deployment"]
          selector:
            matchLabels:
              ai-workload: inference
    mutate:
      patchStrategicMerge:
        spec:
          template:
            spec:
              containers:
              - name: vllm
                env:
                - name: VLLM_MAX_NUM_SEQS
                  value: "256"
                - name: VLLM_RATE_LIMIT_TOKENS_PER_S
                  value: "10000"
```

---

## 五、OPA / Gatekeeper(Rego)— 复杂策略首选

### 5.1 优势

- **Rego** 表达力强(图遍历、JSON Path、嵌套数据)
- 适合复杂业务规则(多条件、跨资源)
- 工业界事实标准(FiveStars Open Policy Agent)

### 5.2 Gatekeeper 实战

```rego
# Rego 策略:GPU 命名空间配额
package k8sallowedrepos

# 拒绝超过 100 GPU 的 namespace
deny[msg] {
  input.metadata.namespace == "ai-research"
  input.spec.hard["requests.nvidia.com/gpu"]
  count := to_number(input.spec.hard["requests.nvidia.com/gpu"])
  count > 100
  msg := sprintf("namespace %v requests more than 100 GPUs", [input.metadata.namespace])
}

# 模型镜像必须来自批准仓库
deny[msg] {
  input.kind == "Pod"
  container := input.spec.containers[_]
  not startswith(container.image, "registry.example.com/ai/")
  not startswith(container.image, "nvcr.io/nvidia/")
  msg := sprintf("Pod uses unapproved image: %v", [container.image])
}
```

### 5.3 工具与生态

- **Conftest**:本地测试 Rego 策略
- **OPA Playground**:在线 Rego 编辑器
- **Styra DAS**:商业策略管理平台

---

## 六、Validating Admission Policy(VAP)— K8s 1.30+ 内置

### 6.1 优势

- K8s **1.30+ GA**,1.32 stable,**无需第三方组件**
- 用 CEL 表达式,无 Rego 学习成本
- 性能:内置实现,延迟 < 1ms

### 6.2 实战

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: ai-pod-must-have-gpu-label
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups: [""]
      resources: ["pods"]
      operations: ["CREATE"]
  validations:
  - expression: "object.metadata.labels.has('ai.model.name')"
    message: "AI Pods must have label ai.model.name"
```

---

## 七、AI 场景策略库(2025-2026 最佳实践)

| 场景 | 策略 | 推荐工具 |
|---|---|---|
| **GPU 配额** | namespace 总 GPU 限制 | ResourceQuota + Kyverno |
| **模型来源审计** | 只允许白名单 registry | Kyverno / Gatekeeper |
| **推理 QPS 限流** | 自动注入 Envoy 限流配置 | Kyverno Mutate |
| **敏感数据脱敏** | Pod 挂载 secret 必须先脱敏 | OPA + Vault |
| **PII 检测** | 推理请求过 PII 过滤 | Gateway 层 + Presidio |
| **模型血缘** | 训练数据 + 模型版本必须可追溯 | OPA + ML Metadata |
| **成本告警** | GPU 利用率低自动告警/缩减 | KEDA + Prometheus |
| **推理可观测** | 所有 LLM 调用必须接 Langfuse/LangSmith | Kyverno Mutate |
| **训练数据隔离** | 训练 namespace 与推理 namespace 网络隔离 | NetworkPolicy + OPA |
| **审计日志** | 所有 API 调用必须记录到审计后端 | K8s Audit Policy |

---

## 八、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **Kyverno** | v1.13+,AI 治理插件,生成式策略实验 |
| **OPA / Gatekeeper** | v0.68+ / v3.18+,OPA v1.0 RC |
| **K8s VAP** | 1.30+ GA,1.32 stable,逐步替代 Gatekeeper 简单场景 |
| **CEL** | 表达力持续增强,支持 AI 场景元数据 |
| **Rego** | v1.0 标准化,新版本性能提升 5x |
| **策略即代码工具链** | Conftest / Styra / OPAL / Snyk IaC 集成 |
| **AI 专项** | Kyverno GenAI 插件(自动生成 AI 策略) |
| **合规** | EU AI Act 要求可解释策略,Kyverno/OPA 输出可审计报告 |
| **主要采纳** | 金融 / 医疗 / 政企 100% 部署,中型企业 50%+ |

---

## 九、生产最佳实践

1. **简单策略用 Kyverno(CEL),复杂策略用 OPA(Rego)**:YAML 优先,Rego 兜底。
2. **K8s 1.30+ 启用 VAP**:内置实现,延迟最低,无需第三方。
3. **策略先 Audit 后 Enforce**:`validationFailureAction: Audit` 跑 1-2 周,统计违规率,再切 `Enforce`。
4. **策略版本化入库**:策略文件 GitOps 管理(Argo CD / Flux),变更可审计。
5. **PolicyReport 自动同步到 Grafana**:把违规率做成 dashboard,持续观察。
6. **GPU 配额必须分层**:`LimitRange`(Pod 级)+ `ResourceQuota`(NS 级)+ `Kyverno`(Cluster 级)。
7. **镜像白名单 + Sigstore 签名验证**:用 Kyverno + cosign 验证镜像来源,防供应链攻击。
8. **LLM 推理必接 Langfuse/LangSmith**:Kyverno Mutate 自动注入 OTEL endpoint,所有调用留痕。
9. **Rego 策略必须单测**:用 Conftest + OPA test 跑 CI,避免误伤生产。
10. **生成式策略谨慎采用**:Kyverno 1.13+ 的 AI 生成策略是实验特性,人工 review 必须。

---

## 十、See Also(官方源)

### OPA / Gatekeeper

- OPA 官方 [openpolicyagent.org](https://www.openpolicyagent.org/)
- Gatekeeper [github.com/open-policy-agent/gatekeeper](https://github.com/open-policy-agent/gatekeeper)
- Rego 文档 [opa.io/docs/policy-language](https://www.openpolicyagent.org/docs/latest/policy-language/)
- OPA Playground [play.openpolicyagent.org](https://play.openpolicyagent.org/)

### Kyverno

- Kyverno 官方 [kyverno.io](https://kyverno.io/)
- GitHub [github.com/kyverno/kyverno](https://github.com/kyverno/kyverno)
- CEL 文档 [kyverno.io/docs/writing-policies/cel](https://kyverno.io/docs/writing-policies/cel/)
- PolicyReport [github.com/kubernetes-sigs/wg-policy-prototypes](https://github.com/kubernetes-sigs/wg-policy-prototypes)

### K8s VAP

- VAP 文档 [kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy](https://kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy/)
- CEL 规范 [github.com/google/cel-spec](https://github.com/google/cel-spec)

### 其他

- Conftest [github.com/open-policy-agent/conftest](https://github.com/open-policy-agent/conftest)
- Styra DAS [styra.com](https://www.styra.com/)
- OPAL [github.com/permitio/opal](https://github.com/permitio/opal)

---

## 十一、相关概念卡

- [[概念/opa|Opa]]
- [[概念/kyverno|Kyverno]]
- [[概念/ai-governance|Ai Governance]]
- [[概念/llm-safety|Llm Safety]]
- [[概念/model-security|Model Security]]
- [[概念/resource-quota|Resource Quota]]
- [[概念/rbac|Rbac]]
- [[概念/network-policy|Network Policy]]
