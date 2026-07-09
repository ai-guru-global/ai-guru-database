---
title: "Agent 生产环境部署 Runbook"
category: 15-agent-production
tags: ["ai-agents", "agent-production", "deployment", "kubernetes", "observability", "sandbox", "sre"]
summary: "> **一句话理解**: 把 Agent 从 Demo 推上生产环境，需要在架构、K8s 部署、工具沙箱、版本控制、可观测性和灾备六个维度建立可复现的工程化 Runbook。"
created: 2026-07-02
updated: 2026-07-02
tier: core
aliases:
  - "Agent Production Deployment Runbook"
  - Agent_Production_Deployment_Runbook
---

# Agent 生产环境部署 Runbook

> **一句话理解**: 把 Agent 从 Demo 推上生产环境，需要在架构、K8s 部署、工具沙箱、版本控制、可观测性和灾备六个维度建立可复现的工程化 Runbook。

---

## 目录

1. [概述与适用范围](#1-概述与适用范围)
2. [Agent 生产架构组件](#2-Agent-生产架构组件)
3. [有状态 vs 无状态部署](#3-有状态-vs-无状态部署)
4. [Kubernetes 部署模式](#4-Kubernetes-部署模式)
5. [工具调用安全与沙箱隔离](#5-工具调用安全与沙箱隔离)
6. [Prompt / Skill / Config 版本化与 CI/CD](#6-Prompt--Skill--Config-版本化与-CI/CD)
7. [可观测性体系](#7-可观测性体系)
8. [灾难恢复与备份](#8-灾难恢复与备份)
9. [生产上线 Checklist](#9-生产上线-Checklist)
10. [Related](#Related)

---

## 1. 概述与适用范围

Agent 系统的生产部署与传统微服务存在本质差异：LLM 输出是非确定性的、执行路径是动态生成的、工具调用可能带来真实世界副作用、会话状态与长期记忆需要跨实例持久化。因此，一份可执行的生产 Runbook 不能止于"把容器跑起来"，而必须覆盖从组件划分、状态管理、沙箱隔离到版本控制、可观测性和灾难恢复的全生命周期。

本文档面向 Agent 平台工程师、AI 应用架构师和 SRE，目标是提供一套可直接落地的部署模板、配置示例与检查清单。文中技术术语保留英文，实践建议基于 2024-2026 年主流工程经验，适用于基于 LangGraph、AutoGen、CrewAI、agno 等框架构建的 Agent 服务。

### 1.1 生产成熟度分级

为了统一团队对"生产就绪"的认知，建议将 Agent 部署划分为三个成熟度等级：

| 等级 | 特征 | 适用场景 |
|------|------|---------|
| **L1: 实验部署** | 单副本容器、本地或开发环境、无状态、无持久化记忆 | PoC、内部 Demo |
| **L2: 可扩展部署** | 多副本、K8s Deployment、外部缓存、基础监控、灰度发布 | 内部工具、低并发应用 |
| **L3: 企业级生产部署** | 多 AZ、有状态持久化、沙箱隔离、完整可观测性、灾备、合规审计 | 对外服务、高并发、高可用要求 |

本文档默认以 L3 企业级生产部署为目标，但会根据场景说明哪些配置在 L1/L2 可以简化。

---

## 2. Agent 生产架构组件

生产级 Agent 系统通常拆分为以下五个核心组件，每个组件都有独立的扩缩容、故障域和版本策略。

```text
┌─────────────────────────────────────────────────────────────┐
│                         API Gateway                          │
│   (路由 / 限流 / Fallback / 密钥管理 / 成本归因)              │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Planner    │ │ Orchestrator │ │   Memory     │
│  (规划推理)   │ │  (编排调度)   │ │  (记忆服务)   │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        ▼
              ┌──────────────────┐
              │   Tool Sandbox   │
              │  (工具执行沙箱)   │
              └──────────────────┘
```

### 2.1 Planner

Planner 负责把用户目标拆解为可执行的步骤序列。生产环境中建议将 Planner 与执行器解耦：

- **独立扩缩容**: Planner 通常重推理、低频率，适合小副本 + 高 CPU/内存配比。在 GPU 推理集群中，Planner 可单独部署在 CPU 节点，避免与 LLM 推理服务争抢显存。
- **可回滚**: Prompt 变更可能导致规划策略突变，需要支持 Prompt 版本快速回滚。建议把 System Prompt 放入 ConfigMap 或 Feature Flag 平台，而非硬编码在镜像中。
- **超时控制**: 复杂任务的规划时间可能不可控，必须设置硬超时与最大步骤数。推荐默认值：单次规划超时 30s，单个任务最大步骤 20 步。
- **规划失败降级**: 当 Planner 无法生成有效计划时，应降级为"单步直接回答"或返回清晰的错误信息，避免无限重试消耗 Token。

### 2.2 Memory

Memory 负责短期工作记忆与长期记忆的存取，是 Agent 从"一次性问答"走向"持续协作"的关键：

- **工作记忆 (Working Memory)**: 当前会话上下文，通常放在 Redis 或进程内存中，TTL 控制在分钟级。容量受限于 LLM 上下文窗口，需要定期做摘要压缩。
- **短期记忆 (Short-term Memory)**: 最近 N 轮对话或任务摘要，使用 Redis / KeyDB 缓存，TTL 小时级。建议对超过 5 轮的对话做滑动窗口摘要。
- **长期记忆 (Long-term Memory)**: 向量数据库（Milvus、Pinecone、Weaviate、Qdrant）持久化用户画像与历史经验。需要定期清理过期或低质量记忆，避免检索噪声。
- **记忆一致性**: 有状态 Agent 跨副本切换时，记忆读取必须保证最终一致性。建议采用"写后立即读"的缓存策略，而非依赖本地进程内存。

### 2.3 Tools

Tools 是 Agent 与外部世界交互的边界，也是安全管控的重点：

- 所有工具必须注册到统一的 Tool Registry，附带 schema、权限标签、超时与重试策略。
- 高风险工具（代码执行、文件系统、数据库写入、第三方 API 调用）必须进入沙箱。
- 工具描述（Tool Description）需要经过安全审查，避免通过 Prompt Injection 篡改工具语义。
- 对工具的调用结果做大小限制，防止异常返回（如超大网页内容）撑爆上下文窗口。

### 2.4 Sandbox

Sandbox 为工具执行提供隔离环境，是防止 Agent "越狱" 的最后一道防线：

- 轻量级: E2B、Daytona 提供基于 Firecracker microVM 的云端沙箱，启动延迟在秒级。
- 私有化: Firecracker、Kata Containers、gVisor 可在自有 K8s 集群中运行，满足数据不出境要求。
- 网络隔离: 默认拒绝出站连接，仅允许白名单域名与端口。
- 资源限制: 每个沙箱必须设置 CPU、内存、磁盘、执行时长上限，防止恶意或异常代码耗尽资源。

### 2.5 Orchestrator

Orchestrator 负责任务调度、多 Agent 协作与状态机推进：

- 在 LangGraph 中对应 StateGraph 的运行时。
- 在 AutoGen 中对应 GroupChat 的调度器。
- 需要持久化任务状态，支持断点续跑与中断恢复。
- 对于长时间任务，建议将 Orchestrator 与 Worker 分离，Orchestrator 只负责状态机推进，具体 LLM 调用与工具执行交给 Worker 队列处理。

---

## 3. 有状态 vs 无状态部署

部署前必须首先回答一个核心问题：该 Agent 是否需要保留会话状态。

| 维度 | 无状态部署 | 有状态部署 |
|------|-----------|-----------|
| **适用场景** | 单次文档分析、分类、摘要、代码审查 | 客服机器人、代码助手、顾问型 Agent、多轮工作流 |
| **扩展性** | 极佳，任意副本可处理任意请求 | 受限于会话亲和性或分布式状态同步 |
| **故障恢复** | 简单，重启容器即可 | 需要恢复会话状态与长期记忆 |
| **延迟** | 低，无需状态 IO | 依赖外部缓存/数据库读取 |
| **成本** | 低 | 高，需要 Redis/Vector DB/持久化队列 |
| **K8s 资源** | Deployment + HPA | StatefulSet / Deployment + 共享状态存储 |

### 3.1 无状态模式

所有上下文通过请求携带，Agent 实例不保留任何状态。适合一次性任务。

```python
@app.post("/analyze")
async def analyze(request: AnalysisRequest):
    # 所有信息来自 request，不依赖本地状态
    result = await agent.run(
        context=request.context,
        instructions=request.instructions,
        max_steps=10
    )
    return result
```

无状态模式虽然简单，但并不意味着可以忽略上下文长度管理。请求中携带的完整历史会线性增加 Token 成本和延迟，建议对长历史做摘要后再传入。

### 3.2 有状态模式

会话状态持久化到外部存储，Agent 实例可随时替换。推荐架构：

```text
用户请求 → API Gateway → Agent Pod
                            │
                            ▼
                    ┌───────────────┐
                    │  会话状态缓存  │
                    │  (Redis TTL)  │
                    └───────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  长期记忆向量库 │
                    │ (Milvus/Weaviate) │
                    └───────────────┘
```

关键点：

- 使用 `session_id` 作为状态键，避免依赖 Pod IP 或 session affinity。
- 状态写操作必须幂等，防止重试导致重复工具调用或重复扣费。
- 为会话状态设置 TTL，避免僵尸会话占用内存。建议默认 TTL 24 小时，超时会话归档到对象存储。
- 对敏感会话状态加密存储，密钥通过 KMS 管理。

### 3.3 混合模式

实际生产中更常见的是"计算无状态、存储有状态"的混合模式：Agent Pod 不保留本地状态，但所有状态通过外部 Redis 和 Vector DB 共享。这样既能水平扩展，又能支持多轮对话。

---

## 4. Kubernetes 部署模式

### 4.1 无状态 Agent：Deployment + HPA

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agent-stateless
spec:
  replicas: 3
  selector:
    matchLabels:
      app: agent-stateless
  template:
    metadata:
      labels:
        app: agent-stateless
    spec:
      containers:
        - name: agent
          image: registry/agent:v1.2.3
          env:
            - name: MEMORY_BACKEND
              value: "redis"
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: agent-secrets
                  key: redis-url
          resources:
            requests:
              memory: "2Gi"
              cpu: "1000m"
            limits:
              memory: "8Gi"
              cpu: "4000m"
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: agent-stateless-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: agent-stateless
  minReplicas: 3
  maxReplicas: 50
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Pods
      pods:
        metric:
          name: agent_request_queue_length
        target:
          type: AverageValue
          averageValue: "10"
```

对于 Agent 服务，仅依赖 CPU 扩容容易滞后。建议结合自定义指标：请求队列长度、P99 延迟、任务排队数。

### 4.2 有状态 Agent：StatefulSet + Headless Service

当 Agent 需要稳定的网络标识、有序启动或本地持久化缓存时，使用 StatefulSet。但长期记忆仍应外置到共享存储。

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: agent-stateful
spec:
  serviceName: agent-stateful-headless
  replicas: 3
  selector:
    matchLabels:
      app: agent-stateful
  template:
    metadata:
      labels:
        app: agent-stateful
    spec:
      containers:
        - name: agent
          image: registry/agent:v1.2.3
          env:
            - name: PERSISTENT_MEMORY
              value: "true"
            - name: VECTOR_STORE_URL
              value: "http://milvus:19530"
          volumeMounts:
            - name: scratch
              mountPath: /tmp/agent-scratch
  volumeClaimTemplates:
    - metadata:
        name: scratch
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi
```

### 4.3 Pod Disruption Budget

无论 Deployment 还是 StatefulSet，都应配置 PDB，保证升级或节点维护期间最小可用副本：

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: agent-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: agent-stateless
```

### 4.4 异步任务队列：Worker + Job

对于长时间运行的 Agent 任务（如代码生成、报告撰写、多 Agent 协作），建议拆分为异步 Job：

```text
API Server: 接收请求，写入任务队列（Redis Streams / RabbitMQ / SQS）
   │
   ▼
Agent Worker: 消费任务，执行 Agent 循环，持久化中间状态
   │
   ▼
Callback / Webhook: 任务完成后通知上游系统
```

优势：

- 避免长连接占用 Gateway 资源。
- 支持任务优先级、重试、死信队列。
- Worker 崩溃后可从上一个 checkpoint 恢复。

### 4.5 多模型路由与 Fallback

生产环境通常不会只依赖一个模型。LLM Gateway 层应实现：

- **按任务复杂度路由**: 简单任务走轻量模型（如 GPT-4o-mini / Qwen3-4B），复杂任务走强模型（如 GPT-4.1 / Claude 4 / DeepSeek-V3）。
- **Fallback**: 主模型超时或失败时，自动降级到备用模型或缓存响应。
- **成本归因**: 按 `session_id` / `user_id` / `team_id` 记录 Token 消耗与调用次数。
- **限流与配额**: 按 API Key、用户、团队设置 RPM 和 TPM 上限，防止单用户拖垮服务。

---

## 5. 工具调用安全与沙箱隔离

工具调用是 Agent 最具风险的环节。2024-2026 年的生产实践已形成"白名单 + 沙箱 + 审计"的三层防御。

### 5.1 工具权限模型

| 风险等级 | 示例 | 执行环境 | 网络策略 |
|---------|------|---------|---------|
| **只读 / 低风险** | 天气查询、搜索引擎、向量检索 | 容器内直接执行 | 允许特定域名 |
| **中风险** | 数据库只读查询、文件读取 | 容器内 + 只读权限 | 内网白名单 |
| **高风险** | 代码执行、文件写入、数据库变更、第三方 API 调用 | 沙箱 / microVM | 默认拒绝 + 显式白名单 |

### 5.2 沙箱选型对比

| 方案 | 隔离级别 | 启动延迟 | 适用场景 | 运维复杂度 |
|------|---------|---------|---------|-----------|
| **E2B** | Firecracker microVM | <1s | 云端代码执行、快速原型 | 低（托管） |
| **Daytona** | Firecracker / 容器 | <1s | 企业级开发环境、CI Agent | 中（可私有化） |
| **Firecracker** | KVM microVM | <125ms | 自有基础设施、大规模沙箱 | 高 |
| **Kata Containers** | 轻量 VM | 1-3s | K8s 原生集成 | 中 |
| **gVisor** | 用户态内核 | 100ms 级 | 容器沙箱、现有 K8s 工作负载 | 中 |

### 5.3 沙箱调用示例

```python
from e2b_code_interpreter import Sandbox

async def execute_tool_in_sandbox(code: str, session_id: str):
    sbx = await Sandbox.create(
        template="agent-python-sandbox",
        timeout=60,
        envs={"SESSION_ID": session_id},
        # 默认无网络，仅允许白名单
        network_access={
            "allowed_hosts": ["api.example.com:443"]
        }
    )
    try:
        result = await sbx.run_code(code)
        return {"stdout": result.stdout, "stderr": result.stderr}
    finally:
        await sbx.kill()
```

### 5.4 输入输出护栏

- **输入侧**: 使用 Llama Guard、Nemo Guardrails 或 AWS Bedrock Guardrails 检测 Prompt Injection、Jailbreak、PII 泄露。
- **输出侧**: 对工具调用参数做 schema 校验，对最终输出做毒性、偏见、幻觉检测。
- **审计**: 记录所有工具调用的输入、输出、执行时长、调用者身份，保留不少于 180 天。

### 5.5 最小权限原则

- 每个工具只授予完成其功能所需的最小权限。
- 数据库工具使用只读账号，除非明确需要写入。
- 文件系统工具限定在指定目录，禁止访问 `/etc`、`/proc` 等敏感路径。
- API 调用工具通过专用 API Key 管理，支持按调用方限流与撤销。

---

## 6. Prompt / Skill / Config 版本化与 CI/CD

Agent 的可变部分比传统软件更多，必须将 Prompt、Skill、Config 纳入版本控制，并实现灰度发布与快速回滚。

### 6.1 版本化对象

| 对象 | 存储位置 | 版本策略 | 回滚方式 |
|------|---------|---------|---------|
| **System Prompt** | Git / ConfigMap / Feature Flag 平台 | SemVer + Git SHA | 切换 ConfigMap 或 Flag |
| **Tool Schema (Skill)** | Git + Tool Registry | SemVer | 回退 Skill 版本 |
| **Agent Config** | Git + 配置中心 | 环境隔离（dev/staging/prod） | 配置回滚 |
| **模型路由策略** | Git + Gateway Config | 策略版本化 | 切换路由规则 |

### 6.2 Git 仓库结构示例

```text
agent-repo/
├── prompts/
│   ├── planner/
│   │   ├── v1.0.0.md
│   │   └── v1.1.0.md
│   └── customer-service/
│       └── v2.0.0.md
├── skills/
│   ├── search_web/
│   │   ├── v1.0.0.yaml
│   │   └── v1.0.1.yaml
│   └── execute_sql/
│       └── v1.0.0.yaml
├── configs/
│   ├── dev.yaml
│   ├── staging.yaml
│   └── prod.yaml
└── k8s/
    ├── deployment.yaml
    ├── hpa.yaml
    └── sandbox-policy.yaml
```

### 6.3 CI/CD 流水线

```yaml
# .github/workflows/agent-deploy.yaml
name: Agent Production Deploy
on:
  push:
    branches: [main]
    paths:
      - "prompts/**"
      - "skills/**"
      - "configs/**"
      - "src/**"

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate Skill Schema
        run: python scripts/validate_skills.py
      - name: Prompt Regression Test
        run: pytest tests/prompt_regression/
  deploy-staging:
    needs: validate
    steps:
      - name: Deploy to Staging
        run: kubectl apply -k k8s/overlays/staging
  deploy-prod-canary:
    needs: deploy-staging
    steps:
      - name: Canary 10%
        run: kubectl set image deployment/agent agent=registry/agent:${GITHUB_SHA} -n prod && kubectl patch deployment/agent -p '{"spec":{"replicas":1}}' -n prod
      - name: Wait for SLO
        run: python scripts/wait_for_slo.py --duration 300 --error-rate 0.001
  deploy-prod-full:
    needs: deploy-prod-canary
    steps:
      - name: Full Rollout
        run: kubectl apply -k k8s/overlays/prod
```

### 6.4 灰度与回滚

- 使用 Feature Flag（LaunchDarkly、Unleash、Flagsmith）控制新 Prompt 或新 Skill 的放量比例。
- 监控关键指标：任务成功率、平均步骤数、P99 延迟、错误率、用户反馈分数。
- 一旦指标异常，优先回滚 Prompt / Skill 版本，而非整个服务镜像。
- 建立"配置变更 = 代码变更"的文化：任何 Prompt 调优都需要经过 PR、Review、CI 测试与灰度发布。

---

## 7. 可观测性体系

Agent 的可观测性不能仅停留在"API 是否 200"，必须覆盖 Trace、Step、Tool、LLM Call 和成本五个层面。

### 7.1 Trace 架构

```text
Trace (一次用户请求)
├── Span 1: Planning
│   └── LLM Call Span
├── Span 2: Tool Selection
├── Span 3: Tool Execution (Sandbox)
│   ├── Sub-span: Network Request
│   └── Sub-span: File IO
├── Span 4: Observation / Reflection
│   └── LLM Call Span
└── Span 5: Final Response
```

使用 OpenTelemetry 注入 trace_id 与 span_id，贯通 Gateway、Agent Runtime、Tool Sandbox 与 LLM Gateway。

### 7.2 Step 级别监控

| 指标 | 采集方式 | 告警阈值建议 |
|------|---------|-------------|
| 任务成功率 | 业务埋点 | < 95% 触发 P1 |
| 平均步骤数 | Agent Runtime 上报 | 较基线上涨 20% 触发预警 |
| 单步 P99 延迟 | OpenTelemetry | > 2s 触发 P2 |
| 工具调用失败率 | Tool Registry 上报 | > 1% 触发 P2 |
| 幻觉 / 毒性输出率 | Guardrails 输出 | > 0.1% 触发 P1 |
| Token 消耗 / 请求 | LLM Gateway | 超过预算 80% 触发成本预警 |

### 7.3 成本 Dashboard

成本 Dashboard 应至少包含：

- 按模型、按团队、按 Agent 类型的 Token 消耗。
- 输入 Token vs 输出 Token 比例。
- 工具调用成本（尤其是付费 API）。
- Sandbox 运行时长与资源消耗。
- 与预算对比的趋势图。

### 7.4 日志规范

所有日志必须包含以下字段：

```json
{
  "timestamp": "2026-07-02T08:30:00Z",
  "level": "INFO",
  "trace_id": "abc123",
  "span_id": "def456",
  "session_id": "sess-789",
  "user_id": "user-xyz",
  "agent_version": "v1.2.3",
  "event": "tool_execution",
  "tool_name": "search_web",
  "tool_version": "v1.0.1",
  "duration_ms": 245,
  "status": "success",
  "tokens_in": 120,
  "tokens_out": 450
}
```

### 7.5 告警与 On-Call

建议将 Agent 告警分为三个层级：

- **P0**: 服务整体不可用、大量工具调用失败、安全护栏高频触发、成本异常暴涨。需要立即响应。
- **P1**: 任务成功率下降、P99 延迟升高、特定模型持续失败。需要在 30 分钟内响应。
- **P2**: 单步延迟轻微升高、资源利用率接近阈值。需要在工作时间内处理。

告警应附带 trace_id 和最近变更记录，便于快速定位是代码、Prompt、模型还是工具侧的问题。

---

## 8. 灾难恢复与备份

Agent 系统的灾备不仅要恢复服务，还要恢复用户的会话状态、长期记忆和未完成的任务队列。

### 8.1 RTO / RPO 建议

| 数据类型 | RTO | RPO | 备份策略 |
|---------|-----|-----|---------|
| **Agent 服务容器** | < 5 min | N/A | 多副本 + 镜像仓库 |
| **会话状态 (Redis)** | < 10 min | < 5 min | AOF + RDB + 跨区复制 |
| **长期记忆 (Vector DB)** | < 30 min | < 1 h | 快照 + 增量备份 |
| **任务队列** | < 15 min | < 1 min | 持久化队列 + 镜像队列 |
| **Prompt / Skill / Config** | < 5 min | 0 | Git + 配置中心多副本 |
| **审计日志** | < 1 h | < 15 min | 对象存储跨区域复制 |

### 8.2 会话状态备份

- Redis 开启 AOF 持久化与 RDB 快照，并配置跨可用区复制。
- 关键会话状态在每次步骤结束后同步写入对象存储（S3 / GCS / OSS）作为冷备。
- 定期演练会话恢复，验证 `session_id` 可正确还原到最新步骤。

### 8.3 长期记忆备份

- 向量数据库每日快照，保存到低成本对象存储。
- 同时保留原始文本与 Embedding 模型版本，防止模型升级后向量不兼容。
- 制定 Embedding 模型版本迁移 SOP，避免"换模型后记忆失效"。

### 8.4 任务队列备份

- 使用持久化消息队列（Redis Streams、RabbitMQ、Kafka、AWS SQS）。
- 任务消息中包含完整的上下文与 checkpoint，Worker 崩溃后可由其他 Worker 接管。
- 死信队列（DLQ）中的任务需要人工或自动重放机制。

### 8.5 灾难恢复演练

建议每季度执行一次灾备演练，验证以下场景：

- 单个 Agent Pod 崩溃后，新 Pod 能否从 Redis 恢复会话状态。
- Redis 主节点故障后，从节点提升为主节点是否会导致数据丢失。
- 向量数据库全量恢复后，检索质量是否保持一致。
- 长时间任务执行中断后，能否从 checkpoint 继续执行。

---

## 9. 生产上线 Checklist

在将 Agent 系统正式推向生产前，建议逐项确认以下内容。

### 架构与部署

- [ ] Planner、Memory、Tools、Sandbox、Orchestrator 已拆分为独立组件或服务边界。
- [ ] 已明确有状态 vs 无状态部署模式，并选择了对应的 K8s 资源（Deployment / StatefulSet / Job）。
- [ ] HPA 或 KEDA 已配置，扩缩容指标包含队列长度与延迟，而非仅 CPU。
- [ ] Pod Disruption Budget 已设置，保证滚动更新期间最小可用副本数。

### 安全与沙箱

- [ ] 所有工具已注册到 Tool Registry，并标注风险等级。
- [ ] 高风险工具（代码执行、文件写入、数据库变更）已接入沙箱（E2B / Daytona / Firecracker / Kata / gVisor）。
- [ ] 沙箱默认无网络访问，出站域名已显式白名单化。
- [ ] 输入输出已接入 Guardrails，检测 Prompt Injection、Jailbreak、PII、毒性、幻觉。
- [ ] 工具调用参数已做 JSON Schema 校验，防止 LLM 生成非法参数。

### 版本管理与 CI/CD

- [ ] System Prompt、Tool Schema、Agent Config 已纳入 Git 版本控制。
- [ ] CI/CD 流水线包含 Prompt 回归测试与 Skill Schema 校验。
- [ ] 生产发布采用灰度（Canary）策略，支持按流量比例或用户维度放量。
- [ ] 回滚 SOP 已文档化，可在 5 分钟内回滚 Prompt / Skill / 服务镜像。

### 可观测性

- [ ] 已接入 OpenTelemetry，Trace 覆盖 Gateway、Agent Runtime、Tool Sandbox、LLM Gateway。
- [ ] Step 级别指标已采集，包括任务成功率、平均步骤数、单步延迟、工具失败率。
- [ ] 成本 Dashboard 已上线，可按模型 / 团队 / Agent 类型查看 Token 与资源消耗。
- [ ] 结构化日志已统一字段规范（trace_id、session_id、agent_version、tool_name 等）。

### 灾备与合规

- [ ] 会话状态（Redis）已开启 AOF + RDB + 跨区复制。
- [ ] 长期记忆向量库已每日快照，并保存到对象存储。
- [ ] 任务队列已持久化，支持 Worker 故障后断点续跑。
- [ ] 审计日志保留策略已满足合规要求（通常 ≥ 180 天）。
- [ ] 已制定并演练过 RTO / RPO 恢复流程。

---

## Related

- [[Agent/Enterprise_Agent/Agent_Production_2026|AI Agent 生产部署最佳实践 2026]]
- [[Agent/Agent_Foundations/Agent_Observability_2026|Agent 可观测性与调试 2026]]
- [[Agent/Agent_Foundations/Agent_State_Management|Agent 状态管理]]
- [[Agent/Memory_Infrastructure/Agent_Memory_Systems_2026|AI Agent 记忆系统架构]]
- [[Agent/Agent_Harness/Agent_Harness_Architecture_2026|Agent Harness 技术架构 2026]]
- [[架构基建/AI_SRE_Runbook|AI SRE Runbook]]
- [[部署推理/Inference_Engines/LLM_Inference_Engine_Selection_Guide|LLM 推理引擎选型指南]]
