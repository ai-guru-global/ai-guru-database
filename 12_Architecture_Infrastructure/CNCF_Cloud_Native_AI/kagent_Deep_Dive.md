---
title: "kagent: Kubernetes 原生的 DevOps AI Agent 框架"
category: "12-architecture-infrastructure"
tags: ["cncf", "kubernetes", "kagent", "agent", "aiops", "devops", "llm"]
summary: "> **一句话理解**: kagent 是 CNCF 沙箱级的「在 Kubernetes 里声明式运行 AI Agent」的框架——把 Agent 变成 K8s CRD(配模型+工具+指令),由控制器跑 Agent 循环,天生支持 GitOps/RBAC/多租户,专为 DevOps 自动化设计。"
created: "2026-06-16"
updated: "2026-06-16"
---

# kagent: Kubernetes 原生的 DevOps AI Agent 框架

> **一句话理解**: kagent 是 CNCF 沙箱级的「在 Kubernetes 里声明式运行 AI Agent」的框架——把 Agent 变成 K8s CRD(配模型+工具+指令),由控制器跑 Agent 循环,天生支持 GitOps/RBAC/多租户,专为 DevOps 自动化设计。

> 📐 **概念方法论**: kagent 解决的是「把 AI Agent 从应用代码里搬到 Kubernetes 控制平面」——它不提供"现成的 SRE 助手",而是给你一组 CRD（`Agent`/`Tool`/`Model`/`Binding`）让你**声明式定义自己的平台 Agent**,再由 controller 调起 Autogen 运行时跑 plan→act→observe 循环。理解它的前提是先理解 Agent 在生产里跑起来的全链路（见 [[13_Agent_Production/index]] 的 Agent 生产部署），以及它和"诊断型"工具的差异——K8sGPT 是"你问我答"的单轮诊断器（见 [[CNCF_Cloud_Native_AI/K8sGPT_Deep_Dive]]），而 kagent 是"你给我工具和指令、我自主多步执行"的可编程 Agent 框架。

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

kagent 起源于 Spectro Cloud、已捐赠给 **CNCF Sandbox**，是为 **DevOps / 平台工程师**设计的开源编程框架，目标只有一个：**让 AI Agent 成为 Kubernetes 里的一等公民**——用 CRD 声明 Agent（配模型、工具、系统指令），由控制器跑 Agent 循环，整套生命周期 GitOps 化。

```
   传统 Agent 框架(LangGraph/CrewAI)              kagent
   ┌────────────────────────────────┐      ┌────────────────────────────────┐
   │  写在应用代码里 (.py)           │      │  声明成 K8s 资源 (.yaml)        │
   │  ├─ model = ChatOpenAI()       │      │  kind: Agent                   │
   │  ├─ tools = [kubectl_fn, ...]  │      │  spec: model / tools / prompt  │
   │  └─ app.run(user_input)        │ ───► │  controller 跑 plan→act→observe│
   │  自己管 state/部署/RBAC/监控    │      │  GitOps/RBAC/多租户天生就有     │
   └────────────────────────────────┘      └────────────────────────────────┘
   Agent = 一段应用进程                      Agent = 一个 K8s 对象
```

一句话：**kagent = Agent-as-CRD + Controller 驱动的 Agent 循环 + 内置 DevOps 工具集**。它不是"一个 Agent"，而是"让你在 K8s 上造并运行 Agent 的框架"。

### 1.2 核心特性

| 特性 | 说明 | 生产价值 |
|------|------|----------|
| **Agent-as-CRD** | `Agent` 是 K8s 资源，spec 声明模型/工具/系统指令 | 定义即代码，可 review/回滚/审计 |
| **声明式编排** | `plan→tool call→observe→respond` 循环由 controller 驱动 | 免写 Agent loop，专注工具与指令 |
| **GitOps 原生** | Agent/Tool/Model/Binding 全是 CRD，可被 Argo/Flux 同步 | 纳入 Git 单一事实源 |
| **K8s RBAC 集成** | Agent 按 ServiceAccount+RoleBinding 行事，kubectl/helm 权限走原生 RBAC | 最小权限天然落地，可追溯 |
| **内置 DevOps 工具** | 开箱即用 kubectl、helm、git | 5 分钟搭一个"会操作集群的 Agent" |
| **自定义工具** | Python 函数或任意 HTTP 服务都能注册成 Tool | CMDB/监控/工单等业务工具可接入 |
| **多租户 / 多 Agent** | `Binding` 控制"哪个 Agent 在哪个 ns/集群跑" | 每团队一个 Agent，互不干扰 |
| **Web UI + REST/gRPC API** | UI 看会话/调 Agent，API 供程序集成 | 既给人用，也给系统调用 |

### 1.3 CNCF 状态与版本历程

| 时间 | 事件 | 说明 |
|------|------|------|
| 2024 | 项目开源 | Spectro Cloud 把内部 K8s Agent 工具链脱敏开源 |
| 2024 | CNCF Sandbox 接纳 | 进入 CNCF 生态 |
| v0.x (2024) | CRD 体系成型 | `Agent`/`Tool`/`Model`/`Binding` 四件套 |
| 2024-2025 | Autogen runtime + UI | 基于 Autogen 跑 Agent 循环，配 Web UI |
| **v1.0 (2025)** | 首个稳定版 | API 稳定、生产可用性提升 |

> 仓库：<https://github.com/kagent-dev/kagent> ｜ License: Apache-2.0 ｜ Helm chart: `kagent/kagent`
> 注：kagent 处于 Sandbox 阶段，CRD schema 仍在演进，生产前务必锁定 chart 版本与 CRD 版本对齐（见 §4.2）。

---

## 2. 核心概念

### 2.1 四个核心 CRD

| CRD | 是什么 | 类比 |
|-----|--------|------|
| **Agent** | 核心 CRD。声明"用哪个模型、有哪些工具、系统指令是什么"——Agent 的人格与能力清单 | Deployment 之于 Pod |
| **Tool** | Agent 可调用的能力单元。内置（kubectl/helm）或自定义（Python 函数 / HTTP 服务） | 一个函数 / 一个 API endpoint |
| **Model** | LLM 提供商配置。OpenAI/Anthropic/Ollama 都抽象成 Model，存密钥、baseURL、参数 | Secret + Provider 配置合体 |
| **Binding** | "哪个 Agent 在哪里跑"——绑定到 namespace / 集群 / ServiceAccount | 多租户与多集群的粘合层 |

#### 2.1.1 各 CRD 关键字段速查

| CRD | 关键字段 | 职责 |
|-----|---------|------|
| Agent | `spec.model` | 引用 Model CRD，决定用哪个 LLM |
| Agent | `spec.tools` | 可调用的 Tool 列表（内置 + 自定义） |
| Agent | `spec.systemPrompt` | 系统指令，角色/边界/输出契约 |
| Agent | `spec.agentRef.serviceAccount` / `maxIterations` | 运行身份（RBAC 边界）/ 循环上限（防失控） |
| Tool | `spec.description` | LLM 看到的工具描述，直接影响调用准确率 |
| Tool | `spec.builtin` / `http` / `python` | 三种调用通道：内置 / HTTP / Python |
| Tool | `spec.schema` / `auth.secretRef` | 入参 JSONSchema（转 LLM tool schema）/ 鉴权凭据走 Secret |
| Model | `spec.provider` | `OpenAI`/`Anthropic`/`Ollama`/`AzureOpenAI` |
| Model | `spec.apiKeySecretRef` / `baseURL` / `temperature` | Secret 存 Key / 自托管端点 / 采样温度（建议 0.1–0.3） |
| Binding | `spec.scope.namespaces` / `clusters` | 限制 Agent 在哪些 ns / 哪些集群行事 |
| Binding | `spec.resources.limits` / `state.backend` | CPU/内存/token 配额 / 会话状态后端（Postgres/Redis） |

> 引用关系单向：`Binding` → `Agent` → `Model` + `Tool[]`。删被引用对象会让 Agent `READY=False`，GitOps 要保证 apply 顺序（Model/Tool → Agent → Binding）或用 `ownerReferences`。

### 2.2 Agent 循环（plan → act → observe → reflect → respond）

kagent 在 controller 牵引下，由 Autogen runtime 跑标准 ReAct 风格的 Agent 循环：

```
   用户输入 / 触发事件 (alert / webhook / 定时)
        │
        ▼
   ┌─────────────────────┐
   │ 1. Plan (LLM 推理)  │ ← 系统 Prompt + 历史 + 工具清单进 LLM
   └──────────┬──────────┘
              ▼
   ┌─────────────────────┐
   │ 2. Act (工具调用)    │ ← controller 把 tool call 派给 Tool server
   └──────────┬──────────┘   按 Agent 的 ServiceAccount 行事
              ▼
   ┌─────────────────────┐
   │ 3. Observe (观察)    │ ← tool 输出塞回上下文,写进对话历史
   └──────────┬──────────┘
        ┌─────┴─────┐
        ▼           ▼
   还需更多信息?  任务完成?
   回到 Plan     输出最终回答/state 持久化
   (多轮迭代)
```

> 关键差异：单轮 LLM 是"问一句答一句"；Agent 循环是"自主多步执行直到达成目标"。kagent 把这个循环、状态、工具调度全封装进 controller，你只管声明 Agent 长什么样。

**循环每步职责与产出：**

| 阶段 | 执行者 | 关键产出 | 失败兜底 |
|------|--------|----------|----------|
| **Plan** | LLM | 下一步动作：调哪个工具 / 直接回答 | 工具不存在→LLM 重规划 |
| **Act** | runtime→Tool server | 工具实际执行结果 | RBAC denied→错误回灌 LLM |
| **Observe** | runtime | 结果塞进对话历史 | 工具超时→降级或重试 |
| **Reflect** | LLM | 判断"够了/继续/失败上报" | 死循环→`maxIterations` 兜底 |
| **Respond** | LLM | 结构化输出 + 写 AgentSession | — |

> **Reflect 是关键**：runtime 每轮让 LLM 评估"是否达成目标"，而非机械"调满 N 次就停"。强模型（GPT-4o/Claude）reflect 更准；弱模型易过早收尾或反复兜圈。

### 2.3 Tool 调用机制深入（HTTP / Python / 内置）

三种通道对 LLM 完全透明，runtime 仅按 tool name 路由，结果统一序列化回灌 Observe：

| 通道 | 适用 | 鉴权 | 隔离性 | 典型示例 |
|------|------|------|--------|----------|
| **内置** | K8s/DevOps 工具链 | Agent SA + RBAC | 进程级，受准入控制 | kubectl get、helm upgrade |
| **HTTP** | 接入已有 REST 服务 | 凭据走 `auth.secretRef` | 网络隔离，服务自鉴权 | 查 Prometheus、提 Jira 工单 |
| **Python** | 轻量函数、SDK 封装 | 共享进程上下文 | 弱（同进程），慎放敏感操作 | 解析 YAML、查 CMDB SDK |

> **description 与 schema 质量直接决定 LLM 调用准确率**：模糊描述（如"查东西"）让模型瞎猜；精确描述（如"查询 Alertmanager 当前活跃告警，可按 silenced 过滤"）让模型知道何时该用、怎么传参——这是自定义工具最常踩的坑。

---

## 3. 架构设计

### 3.1 整体架构

```
   ┌─────────────────────────── kagent 控制平面 ───────────────────────────┐
   │                                                                        │
   │  kagent controller ──watch CRD──► Autogen Agent Runtime                │
   │   (reconcile)                       (plan→act→observe 循环)             │
   │        │                                │ tool call                     │
   │        │ chat/API                       ▼                               │
   │  ┌─────┴──────────┐            ┌────────────────────────────────────┐  │
   │  │ Web UI +       │            │ Tool Servers                       │  │
   │  │ REST/gRPC API  │            │  ├─ built-in: kubectl/helm/git     │  │
   │  │ CRD Store      │ ◄─LLM──►   │  └─ custom: Python fn / HTTP       │  │
   │  │ (Agent/Tool/   │            │ 按 Agent 的 SA + RBAC 执行工具调用 │  │
   │  │  Model/Binding)│            └──────────────┬─────────────────────┘  │
   │  └────────────────┘            Model Providers │                        │
   │                               OpenAI/Anthropic/Ollama(本地)/自托管      │
   └─────────────────────────────────────────┬─────────────────────────────┘
                                             │ 工具实际操作目标集群
                                             ▼
                                       Kubernetes API Server
```

### 3.2 关键组件职责

| 组件 | 职责 |
|------|------|
| **kagent controller** | 监听 CRD 变更，把声明式 spec reconcile 成运行中的 Agent 实例；管理会话与状态生命周期 |
| **Autogen runtime** | 实际跑 Agent 循环的引擎。kagent 不重造轮子，复用 Autogen 的多 agent/tool calling 能力，再包上 K8s 语义 |
| **Tool servers** | 工具执行体。内置工具受控执行；自定义工具可是 Python 进程或远端 HTTP 服务 |
| **Model providers** | LLM 客户端抽象。`Model` CRD 持有 provider 类型、baseURL、apiKey（走 Secret）、温度等 |
| **REST/gRPC API + UI** | UI 给人看会话/调试，API 给程序调用（如 Alertmanager webhook 触发 rollback Agent） |
| **State backend** | 持久化会话历史与 Agent 状态，跨重启续跑；默认 K8s 内存储，生产建议外接 Postgres |

**组件协作链路**：controller 是唯一的 reconcile 入口——watch CRD 变更后把 Agent spec 实例化成 Autogen runtime 可执行的会话；runtime 负责 LLM 往返与工具调度，但**所有工具调用都借用 Agent 绑定的 ServiceAccount 身份**，权限边界与 controller 进程本身解耦。Tool server 在进程内（内置）或网络侧（HTTP）执行，结果回 runtime 写入 state backend。UI/API 与 controller 同进程或 sidecar，是"读模型 + 触发会话"的前端，不经手工具调用——所以 UI 被攻破也不会直接拿到集群操作权。

### 3.3 一个工具调用是怎么落地的（安全核心）

```
   Agent 决定: tool=kubectl, args="get pods -n prod"
        │
        ▼  controller 派发给 kubectl Tool server
        ▼  绑定 Agent.spec.agentRef 指向的 ServiceAccount
        ▼  以该 SA 身份向 kube-apiserver 发请求 ───► RBAC 校验
                                                   │
                              没权限? → 返回 Forbidden, Agent 据此自我纠错
        ▼  拿到 Pod 列表 → 塞回 Observe → LLM 据此继续推理
```

> 这条链路是 kagent 的安全核心：**Agent 能干什么，完全由它绑定的 ServiceAccount 的 RBAC 决定**，不是 Prompt 说了算。即便 Prompt 让它删集群，SA 没 delete 权限也删不掉。

**工具调用 RPC 全流程（含错误路径）：**

```
   runtime ──tool_call──► dispatcher
       │ 1.解析 name→Tool server  2.注入 Agent SA token
       ▼
   Tool server 以 SA 身份向 kube-apiserver / 远端发请求
       │
       ├── 200 OK + 结果 ──┐    ┌── 403/5xx/超时 ──┐
       ◄── result ─────────┘    ◄── error(文本回灌)─┘
       ▼  Observe → LLM 决定"继续调工具"或"回答用户"
```

> 错误也回灌给 LLM：收到 `Forbidden` 时 Agent **会据此自我纠错**或如实上报"我没权限"——错误本身就是 Agent 的学习信号，比静默失败有用得多。

**GitOps 同步流**：Git 仓库（`models/ tools/ agents/ bindings/`）→ PR review → Argo/Flux sync → kube-apiserver apply CRD → controller watch 到变更 → reconcile。旧会话不中断，新会话用新 spec；审计/回滚 = `git revert` + 重新 sync。

> 因为全是 CRD，**改 Agent 行为 = 改 Git YAML**——review 留痕、回滚即 revert、多环境就是不同目录。这是 kagent 相对应用内 Agent 框架的结构性优势。

---

## 4. 安装部署

### 4.1 Helm 安装

```bash
helm repo add kagent https://kagent-dev.github.io/kagent
helm repo update
helm install kagent kagent/kagent --namespace kagent-system --create-namespace
kubectl get pods -n kagent-system   # kagent-controller-0 / kagent-ui Running
```

### 4.2 版本对齐清单（生产必做）

| 项 | 要求 |
|----|------|
| chart 版本 | `helm pull` 锁定具体版本，不要 `latest` |
| CRD 版本 | chart 自带，单独升级 CRD 务必与 controller 版本一致 |
| Autogen runtime | 内置于 controller 镜像，随 chart 升级 |
| K8s 版本 | 支持 1.27+，注意 RBAC / admission API 兼容性 |

### 4.3 配置 LLM Provider（Model CRD）

```bash
kubectl create secret generic openai-key \
  --from-literal=OPENAI_API_KEY=sk-xxxx -n kagent-system
```

```yaml
apiVersion: kagent.dev/v1
kind: Model
metadata: { name: prod-gpt4o, namespace: kagent-system }
spec:
  provider: OpenAI
  model: gpt-4o
  apiKeySecretRef: { name: openai-key, key: OPENAI_API_KEY }
  temperature: 0.2
```

本地模型（数据不出集群）用 Ollama：

```yaml
apiVersion: kagent.dev/v1
kind: Model
metadata: { name: local-llama, namespace: kagent-system }
spec:
  provider: Ollama
  model: llama3:70b
  baseURL: http://ollama.ollama.svc:11434
  temperature: 0.1
```

### 4.4 注册内置工具（kubectl / helm 的 RBAC）

内置工具需要一个有权限的 ServiceAccount。最小权限 SA + Role 示例：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata: { name: sre-agent-sa, namespace: prod }
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata: { name: sre-agent-read, namespace: prod }
rules:
  - apiGroups: [""]
    resources: ["pods", "services", "events", "deployments"]
    verbs: ["get", "list", "watch"]   # 故意不给 delete/update
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata: { name: sre-agent-bind, namespace: prod }
roleRef: { apiGroup: rbac.authorization.k8s.io, kind: Role, name: sre-agent-read }
subjects: [{ kind: ServiceAccount, name: sre-agent-sa, namespace: prod }]
```

### 4.5 访问 Web UI

```bash
kubectl port-forward svc/kagent -n kagent-system 8081:80
# 浏览器打开 http://localhost:8081
```

UI 可浏览已声明的 Agent、发起会话、查看 tool call 明细、调试 system prompt。

---

## 5. 快速开始

目标：声明一个"部署助手" Agent，给它 kubectl 工具 + GPT-4o，让它能回答集群里 Pod 的状态。

**端到端流程**（每步对应一条命令或一份 YAML）：

| 步 | 动作 | 关键产物 | 详见 |
|----|------|----------|------|
| 1 | Helm 安装 kagent | controller + UI Running | §4.1 |
| 2 | 注册 Model（OpenAI 或 Ollama） | `Model` CRD READY | §4.3 |
| 3 | 建 ServiceAccount + 最小权限 RBAC | SA 可被 Agent 绑定 | §4.4 |
| 4 | 声明 Agent（引用 Model + 内置 kubectl Tool） | `Agent` CRD READY=True | §5.1 |
| 5 | apply → UI 发起会话 → 观察 Agent 自主调 kubectl | Observe 返回真实集群数据 | §5.2 |
| 6 | 读 AgentSession 审计全轨迹 | 每次工具调用可追溯 | §7.1 |

下面假设步骤 1–3 已完成（Model `prod-gpt4o`、SA `sre-agent-sa` 均就绪），重点演示 4–5；§5.4 再演示一个自定义 Python Tool 的完整闭环。

### 5.1 声明 Agent

```yaml
apiVersion: kagent.dev/v1
kind: Agent
metadata: { name: deployment-assistant, namespace: prod }
spec:
  model: prod-gpt4o                      # 引用 §4.3 的 Model
  description: "监控 prod 命名空间的部署状态"
  systemPrompt: |
    你是一个 Kubernetes 部署助手,运行在 prod 命名空间。
    当用户询问部署或 Pod 状态时,用 kubectl 工具实际查询,
    基于真实输出回答,不要编造。发现异常时主动指出并给出建议。
  tools: [kubectl]                       # 内置工具
  agentRef: { serviceAccount: sre-agent-sa }   # §4.4 的 SA,决定 kubectl 权限边界
```

```bash
kubectl apply -f deployment-assistant.yaml -n prod
kubectl get agent -n prod   # deployment-assistant  READY=True
```

### 5.2 通过 UI 发起会话

在 UI 里选中 `deployment-assistant`，输入"prod 命名空间有没有 Pod 在 CrashLoopBackOff？"，观察执行轨迹：

```
[Plan]    用户问 CrashLoopBackOff,我需要列出 prod 的 Pod 状态
[Act]     tool=kubectl, args="get pods -n prod --field-selector=status.phase!=Running"
[Observe] 返回: payment-svc-xxx (CrashLoopBackOff), order-svc-yyy (Running)
[Plan]    payment-svc 异常,需要看它的事件定位原因
[Act]     tool=kubectl, args="describe pod payment-svc-xxx -n prod"
[Observe] Events: Back-off restarting; 终止码 137 (OOMKilled)
[Respond] prod 有 1 个异常 Pod: payment-svc-xxx,CrashLoopBackOff,
          终止码 137 提示 OOMKilled。建议: 检查内存 limit 或排查泄漏。
```

注意整个过程 Agent 自主做了**两次** kubectl 调用——这是 Agent 循环与单轮 LLM 的本质区别。

### 5.3 通过 API 程序化调用

```bash
curl -X POST http://kagent.kagent-system.svc/api/agents/deployment-assistant/sessions \
  -H "Content-Type: application/json" \
  -d '{"message": "prod 命名空间有没有 Pod 在 CrashLoopBackOff?"}'
```

这使 kagent 能被外部系统触发——比如 Alertmanager 告警 webhook 直接触发 Agent 跑诊断。

### 5.4 第二个例子：自定义 Python Tool（找出高重启 Pod）

内置 kubectl 返回原始输出，LLM 要自己解析。频繁使用时，把"过滤逻辑"封进自定义 Tool 更省 token、更准。下面注册一个"列出重启次数 > N 的 Pod"的 Python 工具，走完声明→注册→挂载全流程。

**工具代码**（打包进 controller 可加载的 Python 模块）：

```python
from kagent.tools import tool
from kubernetes import client, config

@tool(description="列出指定 namespace 中 restartCount 超过阈值的 Pod")
def list_high_restart_pods(namespace: str, threshold: int = 5) -> list[dict]:
    config.load_incluster_config()
    v1 = client.CoreV1Api()
    out = []
    for pod in v1.list_namespaced_pod(namespace).items:
        for cs in pod.status.container_statuses or []:
            if cs.restart_count > threshold:
                reason = cs.last_state.terminated.reason if cs.last_state else "Unknown"
                out.append({"name": pod.metadata.name, "restartCount": cs.restart_count, "reason": reason})
    return out
```

**声明为 Tool CRD**（GitOps 可管）：

```yaml
apiVersion: kagent.dev/v1
kind: Tool
metadata: { name: list-high-restart-pods, namespace: prod }
spec:
  description: "列出 namespace 中 restartCount 超过阈值的 Pod"
  python: { module: platform_tools.reliability, function: list_high_restart_pods }
  schema:
    type: object
    properties:
      namespace: { type: string }
      threshold: { type: integer, default: 5 }
    required: [namespace]
```

**挂到 Agent**（基于 §5.1 模板，改 tools + systemPrompt）：

```yaml
spec:
  tools: [list-high-restart-pods, kubectl]   # 自定义 + 内置混用
  systemPrompt: |
    你是可靠性助手。用户问"哪些 Pod 不稳定"时,先调 list-high-restart-pods,
    再对 top-N 调 kubectl describe 定位根因。
```

```bash
kubectl apply -f high-restart-tool.yaml -f reliability-agent.yaml -n prod
# UI 问: "prod 哪些 Pod 不稳定?" → Agent 直接调自定义工具,一次拿到结构化结果
```

> 这就是 kagent 的可编程性：**业务逻辑下沉到 Tool，编排逻辑写在 systemPrompt**，LLM 只负责"决定何时用哪个"。换需求不用改 LLM，改 Tool 即可——Tool 升级走 GitOps PR，可 review 可回滚。

---

## 6. 生产配置

### 6.1 自定义 Tool（Python 函数）

kagent 把普通 Python 函数注册成 Tool，框架自动把函数签名转成 LLM 可理解的 tool schema：

```python
from kagent.tools import tool

@tool(description="查询 CMDB 中某服务的责任人")
def get_service_owner(service: str) -> str:
    return cmdb_client.lookup(service).owner
```

绑定到 Agent 即可：`spec.tools: [get_service_owner, kubectl]`。

### 6.2 自定义 Tool（HTTP 服务）

已有 HTTP 服务（监控、工单、CMDB）直接接入，无需改造成 Python：

```yaml
apiVersion: kagent.dev/v1
kind: Tool
metadata: { name: alertmanager-query, namespace: prod }
spec:
  description: "查询 Alertmanager 当前活跃告警"
  http:
    baseURL: http://alertmanager.monitoring.svc:9093
    method: GET
    path: /api/v2/alerts
    auth: { type: Bearer, secretRef: { name: am-token, key: token } }
  schema:
    type: object
    properties:
      silenced: { type: boolean, description: "是否包含被静默的告警" }
```

### 6.3 系统提示词设计要点

| 要点 | 实践 |
|------|------|
| **角色与边界** | 明确"你是谁、只能操作哪个 namespace、不能做什么"——Prompt 是第一道防线，RBAC 是第二道 |
| **强制工具优先** | 写明"涉及集群状态必须用 kubectl 实查,不许凭记忆答"，压制幻觉 |
| **输出契约** | 规定结构化输出（异常须含：对象名/现象/根因假设/建议动作），便于下游消费 |
| **安全护栏** | "危险操作（delete/scale down）前必须向用户确认"，配合 RBAC 双保险 |
| **少样本** | 给 1-2 个"输入→工具调用→输出"示例，显著提升工具使用准确率 |

### 6.4 RBAC 最小权限清单

| Agent 用途 | SA 权限范围 |
|------------|-------------|
| 只读诊断（K8sGPT 式） | `get/list/watch` 限定 namespace，绝不给 `delete/update` |
| 部署回滚 | `apps/rollouts` 的 `update`（仅 rollback），不给 create/delete |
| 服务 onboarding | 仅 `create` 特定资源类型，命名空间隔离 |
| 跨集群巡检 | 单独 SA + readonly ClusterRole，按集群分别下发 |

> 黄金法则：**先按"完全不给"起手，Agent 报错 Forbidden 再逐一加权限**。永远不要给 cluster-admin。

### 6.5 多 Agent 与 Binding（多租户）

```yaml
apiVersion: kagent.dev/v1
kind: Binding
metadata: { name: prod-team-binding, namespace: prod }
spec:
  agent: deployment-assistant
  scope: { namespaces: [prod, prod-canary] }   # Agent 只在这两个 ns 按对应 SA 行事
  resources: { limits: { cpu: "2", memory: 2Gi } }
```

每团队一个 Agent + 一个 Binding + 独立 SA，namespace 隔离 + 配额隔离 + RBAC 隔离三重保障。

### 6.6 Model 选型与 GitOps 接入

Model 选型（成本/隐私/能力）：

| 场景 | 推荐模型 | 理由 |
|------|----------|------|
| 复杂推理（多步诊断、跨工具编排） | GPT-4o / Claude Sonnet | 工具调用准确率高，少跑偏 |
| 高频简单查询（状态查询） | GPT-4o-mini / Llama 3 70B | 单价低、吞吐高 |
| 敏感数据不出集群 | Ollama 跑 Llama 3 / Qwen 本地 | 数据合规，需自备 GPU |

GitOps（因为全是 CRD，Argo/Flux 天然支持）：

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata: { name: kagent-agents, namespace: argocd }
spec:
  source: { repoURL: git@github.com:org/platform-agents.git, path: agents/prod }
  destination: { server: https://kubernetes.default.svc, namespace: prod }
  syncPolicy: { automated: { prune: true, selfHeal: true } }
```

平台团队 PR review 改 Agent 配置 → Argo 同步 → controller reconcile，全程可审计、可回滚——这是 kagent 相对应用内 Agent 框架最大的结构性优势。生产建议把会话历史外置 Postgres（默认 K8s 内存储仅用于开发），避免 controller 重启丢上下文。

---

## 7. 运维与可观测

### 7.1 Agent 执行日志与会话审计

```bash
kubectl logs -n kagent-system deploy/kagent-controller -c manager
kubectl get agentsessions.kagent.dev -n prod          # 会话历史 CRD
kubectl describe agentsession <id> -n prod            # 单次会话全轨迹(含每个 tool call)
```

每个 tool call（参数、返回、耗时、状态码）都记录在 session 对象里，是审计"Agent 到底干了什么"的唯一权威来源。可观测体系的整体方法论见 [[10_MLOps_Pipeline/LLM_Observability]]。

### 7.2 关键指标

| 指标 | 含义 | 告警参考 |
|------|------|----------|
| `kagent_agent_runs_total` | Agent 执行次数 | 突增 = 异常触发潮 |
| `kagent_agent_run_duration_seconds` | 单次 Agent 循环耗时 | P95 > 业务阈值（如 60s） |
| `kagent_tool_calls_total{tool,status}` | 工具调用计数/成败 | 错误率 > 5% |
| `kagent_llm_tokens_total{type}` | LLM token（prompt/completion） | 突增 = 成本异常 |
| `kagent_agent_loops` | 单次会话循环轮数 | P95 过高 = 反复试错/卡循环 |
| `kagent_tool_call_duration_seconds` | 单次工具调用耗时 | P95 > 阈值 = 工具或下游慢 |
| `kagent_tool_call_errors_total{tool,reason}` | 工具调用失败（按原因拆分） | RBAC/超时/5xx 分类看，错误率 > 5% |
| `kagent_llm_cost_usd_total{model}` | 按 Model 核算的美元成本 | 突增 = 失控循环或模型涨价 |
| `kagent_agent_success_rate{agent}` | 会话成功完成比例 | 低 = 模型/工具/Prompt 问题 |

> 建议按 `namespace` + `agent` 打 label 做成本与故障归属。可观测整体方法论见 [[10_MLOps_Pipeline/LLM_Observability]]。

### 7.3 LLM Token / 成本追踪

每个会话记录 prompt/completion token 按 Model 单价核算。按 namespace/team 打标签做成本归属；给 Binding 设 token 上限防失控；高频查询用廉价模型，复杂诊断才升 4o（详见 §7.5）。

### 7.4 常见故障排查

| 症状 | 可能原因 | 排查 |
|------|----------|------|
| Tool call 报 Forbidden | SA 的 RBAC 没覆盖该资源/动词 | `kubectl auth can-i --as=system:serviceaccount:prod:sre-agent-sa ...` |
| Tool call 一直失败重试 | 工具服务不可达 / schema 不匹配 | 看 Tool CRD 状态；controller 日志看 tool error |
| 卡死循环（同一工具反复调） | prompt 没终止条件 / 模型能力不足 | 加轮数上限；换更强模型；prompt 加"连续失败 N 次就放弃" |
| 幻觉（不查就编 Pod 名） | prompt 没强制工具优先 | 强化"必须用 kubectl 实查"，给少样本 |
| LLM 调用 401/429 | apiKey 失效 / 限流 | 检查 Model CRD 的 secret；provider 配退避重试 |
| 会话上下文丢失 | state backend 没配 / 重启 | 配外置 Postgres；检查 Binding 的 state 配置 |
| Agent READY=False | Model/Tool 引用不存在 / SA 缺失 | `kubectl describe agent` 看 Conditions |
| Binding 调度到错误 ns/集群 | `scope.namespaces` / `clusters` 写错 | `kubectl get binding -o yaml` 核对 scope |
| UI 无法连接 API | API service 未就绪 / Ingress 端口配错 | `kubectl get apiservice`；port-forward 验证连通 |
| Autogen runtime 崩溃重启 | 模型返回非 JSON / 上下文超长 | 看 controller 日志栈；缩短历史或换大窗口模型 |

### 7.5 成本失控防护

黄金组合：**maxIterations 兜底 + 模型分级省日常 + token 配额防单次失控**，三层都配上再贵的模型也烧不爆。

| 手段 | 配置位置 | 效果 |
|------|----------|------|
| **maxIterations 上限** | `Agent.spec.maxIterations` | 防死循环烧 token |
| **token 配额** | `Binding.spec.resources.limits` | 单 Binding 超 N token 即熔断 |
| **模型分级** | 按 Agent 选 Model | 简单查询用 mini，诊断才上 4o |
| **会话历史裁剪** | state backend 配置 | 超长历史滑动窗口，控 prompt token |
| **按团队成本归属** | namespace label + 成本导出 | 谁的 Agent 谁买单，逼出浪费 |

### 7.6 升级

```bash
helm upgrade kagent kagent/kagent -n kagent-system --version <new-version>
```

升级前看 release notes 的 CRD 变更、Autogen runtime 兼容性；先在 canary 集群验证 Agent 行为不回归，再滚动到生产；会话状态建议先备份。

---

## 8. 对比与选择

### 8.1 kagent vs LangGraph/CrewAI vs K8sGPT/HolmesGPT vs 原生 Autogen

| 维度 | kagent | LangGraph/CrewAI | K8sGPT/HolmesGPT | 原生 Autogen |
|------|--------|------------------|------------------|---------------|
| **形态** | K8s CRD + controller | 应用代码库 | 现成 CLI/工具 | Python 库 |
| **Agent 定义** | YAML（Agent CRD） | Python 图 | 固定内置 | Python 代码 |
| **部署模型** | 常驻 controller | 自己部署进程 | 一次性命令/Server | 自己部署 |
| **GitOps** | 原生（全是 CRD） | 需自己搭 | 配置文件半 GitOps | 无 |
| **RBAC/多租户** | K8s 原生 | 自己实现 | 单租户为主 | 自己实现 |
| **工具** | 内置 kubectl/helm + 自定义 | 全自定义 | 内置分析器为主 | 全自定义 |
| **目标用户** | 平台/DevOps 工程师 | 应用开发者 | 排障/SRE | 研究者/应用开发者 |
| **能力倾向** | 多步自主执行平台任务 | 通用 Agent 编排 | 单轮诊断/分析 | 多 agent 对话/研究 |

### 8.2 什么时候选 kagent

选 kagent，当且仅当你**同时**需要：

1. **声明式 / GitOps 管理** Agent 定义（审计、版本化、回滚是硬要求）
2. **K8s 原生的 RBAC 与多租户**隔离（多团队共享一个 Agent 平台）
3. **自主多步执行**的 Agent（不是单轮问答），且主要操作对象是 **Kubernetes / DevOps 工具链**
4. 一个**常驻、可被事件触发**（alert/webhook/定时）的 Agent 运行时

### 8.3 什么时候不选

- 只想做一次性诊断 → 用 **K8sGPT/HolmesGPT**，更轻
- Agent 逻辑强耦合业务应用、不需要 K8s 化管理 → 用 **LangGraph/CrewAI** 在应用里
- 研究多 agent 协作原型 → 直接用 **Autogen**，更灵活
- 以 RAG / 知识库问答为主 → kagent 不是为这个设计的

---

## 9. 常见问题 FAQ

**Q1: kagent 和 LangGraph 到底有什么区别？为什么要把 Agent 搬到 K8s？**
A: LangGraph 是**应用内**的 Agent 编排库，Agent 是一段 Python 进程；kagent 把 Agent 变成 **K8s 资源**，由 controller 跑循环。搬到 K8s 的收益：配置可 GitOps 审计/回滚、权限走原生 RBAC、多团队多租户天然隔离、可被 alert/webhook 事件触发。单体应用里要个 Agent，LangGraph 够了；平台团队要给多业务团队提供"Agent 即服务"，kagent 的结构性优势才显现。

**Q2: 能跑本地模型吗？数据敏感不能出集群。**
A: 能。配 `Model` CRD 的 `provider: Ollama`，baseURL 指向集群内 Ollama 服务即可。代价是需自备 GPU、模型能力通常弱于 GPT-4o，复杂工具调用准确率会下降，建议工具数量少、任务明确时用本地模型。

**Q3: Agent 的会话状态存在哪？重启会丢吗？**
A: 默认存在 K8s 内（开发可用），生产建议外接 Postgres（可靠）或 Redis（低延迟）。配好 state backend 后 controller 重启不丢上下文；`AgentSession` CRD 也会留存执行轨迹供审计。

**Q4: kubectl 工具怎么限权？怕 Agent 把集群搞坏。**
A: 权限**完全**由 Agent 绑定的 ServiceAccount 的 RBAC 决定，与 prompt 无关。给 Agent 专用 SA + 最小权限 Role（只给需要的资源/动词，绝不给 cluster-admin），Agent 调 kubectl 时按该 SA 行事。双层防御：prompt 写"危险操作必须确认"，RBAC 兜底"没权限就是干不了"。

**Q5: Agent 卡在循环里反复调同一工具怎么办？**
A: 三招：① Binding 设最大循环轮数上限；② system prompt 加"连续失败 N 次就停止并上报"；③ 换能力更强的模型。监控 `kagent_agent_loops`，P95 异常高就介入。

**Q6: kagent 现在能上生产吗？成熟度如何？**
A: v1.0（2025）后 API 趋稳，但仍处 CNCF Sandbox，schema 可能演进。建议：锁定 chart 版本、canary 集群先行、做好升级回归测试。核心稳定性链路建议再观察一两个大版本；辅助性平台自动化（巡检、onboarding、PR triage）已可试点。

---

## Related

- [[CNCF_Cloud_Native_AI/README]] — CNCF 云原生 AI 项目总览
- [[CNCF_Cloud_Native_AI/K8sGPT_Deep_Dive]] — 单轮诊断型 SRE 助手（与 kagent 多步执行型互补）
- [[CNCF_Cloud_Native_AI/HolmesGPT_Deep_Dive]] — 另一诊断型工具，定位参考
- [[13_Agent_Production/index]] — Agent 生产部署的完整方法论
- [[10_MLOps_Pipeline/LLM_Observability]] — LLM/Agent 可观测体系（token、成本、轨迹追踪）
