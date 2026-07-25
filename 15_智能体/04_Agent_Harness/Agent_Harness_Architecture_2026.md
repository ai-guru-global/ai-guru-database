---
title: Agent Harness 技术架构 2026
category: 15-agent-production-agent-harness
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> **一句话理解**: Agent Harness 是围绕模型智能构建的完整工程系统，本文从生产部署视角详解 Harness 技术架构、配置参数、性能指标、兼容性矩阵，并为六种角色提供差异化使用指南。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Agent Harness Architecture 2026"
  - Agent_Harness_Architecture_2026
sources: []

---
# Agent Harness 技术架构 2026

> **一句话理解**: Agent Harness 是围绕模型智能构建的完整工程系统，本文从生产部署视角详解 Harness 技术架构、配置参数、性能指标、兼容性矩阵，并为六种角色提供差异化使用指南。
>
> 更新时间: 2026-04 | 覆盖: Harness 架构、框架集成、配置参数、性能基线、多角色指南

---

## 目录

1. [Harness 核心定义](#一harness-核心定义)
2. [技术架构](#二技术架构)
3. [核心组件详解](#三核心组件详解)
4. [配置参数参考](#四配置参数参考)
5. [性能指标与基线](#五性能指标与基线)
6. [框架兼容性矩阵](#六框架兼容性矩阵)
7. [多角色使用指南](#七多角色使用指南)
8. [最佳实践](#八最佳实践)

---

## 一、Harness 核心定义

### 1.1 基本公式

$$
\text{Agent} = \text{Model} + \text{Harness}
$$

**如果你不是 Model，你就是 Harness。**

Harness 是模型之外的一切代码、配置和执行逻辑。裸模型不是 Agent——当 Harness 赋予它状态、工具执行、反馈回路和可执行约束后，它才成为 Agent。

### 1.2 Harness vs Benchmark vs Framework

| 概念 | 本质 | 关注点 | 示例 |
|------|------|--------|------|
| **Harness** | 工程基础设施 | 怎么运行、怎么编排、怎么约束、怎么观测 | 自定义 Harness、LangSmith、Phoenix |
| **Benchmark** | 标准任务集 | 测什么任务、难度多大、SOTA 多高 | GAIA、OSWorld、SWE-bench |
| **Framework** | 开发框架 | 怎么写代码、怎么组织 Agent 逻辑 | LangChain、AutoGen、CrewAI |

**一句话区分**：Benchmark 是"题库"，Framework 是"开发工具箱"，Harness 是"考场 + 监考 + 判卷 + 运行时"。

### 1.3 Harness 四层心智模型

| 层 | 关键问题 | 核心能力 | 典型产物 |
|----|----------|----------|----------|
| **Test Harness** | 能否稳定复现实验？ | 任务编排、环境初始化、Fixture、回滚 | 测试套件、沙箱镜像 |
| **Evaluation Harness** | 怎么判定做得好不好？ | 规则评估、LLM-as-Judge、指标计算 | Scorecard、排行榜 |
| **Safety Harness** | 会不会做错事或越权？ | 对抗测试、权限边界、沙箱隔离 | 安全报告、风险分级 |
| **Monitoring Harness** | 上线后是否持续可靠？ | Trace、Metrics、成本监控、告警 | 仪表盘、回归报告 |

> 详细的评估维度与指标，参见 [Agent_Evaluation/Agent_Harness_Complete_2026.md](../Agent_Evaluation/Agent_Harness_Complete_2026.md)。

---

## 二、技术架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Agent Harness 生产架构                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                      Context Layer (上下文层)                      │ │
│  │  System Prompt │ Memory │ Skills │ Tool Descriptions │ User Input │ │
│  └──────────────────────────────┬────────────────────────────────────┘ │
│                                 │                                       │
│                                 ▼                                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                     Orchestration Layer (编排层)                    │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │ │
│  │  │ Model      │  │ Routing    │  │ Subagent   │  │ Handoff    │ │ │
│  │  │ Selection  │  │ Logic      │  │ Spawning   │  │ Protocol   │ │ │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘ │ │
│  └──────────────────────────────┬────────────────────────────────────┘ │
│                                 │                                       │
│                                 ▼                                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                    Execution Layer (执行层)                         │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │ │
│  │  │ Sandbox  │  │ Tool     │  │ File     │  │ Browser  │        │ │
│  │  │ (Docker) │  │ Executor │  │ System   │  │ Runtime  │        │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │ │
│  └──────────────────────────────┬────────────────────────────────────┘ │
│                                 │                                       │
│                                 ▼                                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                    Hooks & Middleware (钩子层)                      │ │
│  │  Compaction │ Tool Output Offload │ Continuation │ Lint │ Audit  │ │
│  └──────────────────────────────┬────────────────────────────────────┘ │
│                                 │                                       │
│                                 ▼                                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                    Observability Layer (观测层)                     │ │
│  │  Traces │ Metrics │ Logs │ Cost Tracking │ Alerting │ Replay     │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 分层职责

| 层 | 职责 | 关键技术 |
|----|------|----------|
| **Context Layer** | 组装模型输入上下文 | Prompt 模板、Memory 注入、Skill 渐进式加载 |
| **Orchestration Layer** | 决定用哪个模型、怎么分派任务 | 模型路由、子 Agent 编排、A2A 协议 |
| **Execution Layer** | 安全执行工具和代码 | Docker 沙箱、MCP Server、文件系统抽象 |
| **Hooks & Middleware** | 确定性干预，防止模型偏移 | 上下文压缩、工具输出裁剪、Ralph Loop 续写 |
| **Observability Layer** | 全链路追踪与成本监控 | OpenTelemetry、Prometheus、LangSmith/Phoenix |

---

## 三、核心组件详解

### 3.1 文件系统 (Filesystem)

文件系统是最基础的 Harness 原语，因为它解锁了：

- **工作区**：读取数据、代码、文档
- **增量卸载**：不必把一切都塞在上下文中
- **协作表面**：多个 Agent 和人类通过共享文件协作
- **版本控制**：Git 提供工作追踪、回滚、分支实验

```python
class FilesystemHarness:
    """文件系统 Harness 组件"""

    def __init__(self, workspace_dir: str):
        self.workspace = workspace_dir
        self.git = GitClient(workspace_dir)

    def read(self, path: str) -> str:
        """读取工作区文件"""
        return open(f"{self.workspace}/{path}").read()

    def write(self, path: str, content: str):
        """写入文件并自动提交"""
        with open(f"{self.workspace}/{path}", "w") as f:
            f.write(content)
        self.git.add(path)

    def checkpoint(self, message: str):
        """创建检查点（Git commit）"""
        self.git.commit(message)

    def rollback(self, commit_hash: str):
        """回滚到指定版本"""
        self.git.checkout(commit_hash)
```

### 3.2 沙箱 (Sandbox)

沙箱为 Agent 提供安全的执行环境：

| 沙箱类型 | 隔离级别 | 启动时间 | 适用场景 |
|----------|---------|---------|---------|
| **Docker 容器** | 进程 + 文件系统 | 1-5s | 代码执行、测试运行 |
| **MicroVM (Firecracker)** | 内核级 | <1s | 高安全要求场景 |
| **gVisor** | 系统调用过滤 | <1s | 平衡安全与性能 |
| **WebAssembly** | 内存隔离 | <100ms | 轻量工具执行 |
| **远程沙箱 (E2B/Modal)** | 完全隔离 | 2-10s | 云端大规模评测 |

```python
class SandboxConfig:
    """沙箱配置"""
    image: str = "ubuntu:22.04"
    cpu_limit: int = 4
    memory_limit: str = "8GB"
    disk_limit: str = "20GB"
    network_mode: str = "none"  # 默认无网络
    timeout: int = 300          # 5 分钟超时
    allowed_commands: list = None  # 命令白名单
    read_only_paths: list = None  # 只读挂载
```

### 3.3 上下文工程 (Context Engineering)

Harness 本质上是好的上下文工程的交付机制：

| 策略 | 解决问题 | 实现方式 |
|------|---------|---------|
| **Compaction** | 上下文窗口快满时怎么办 | 智能摘要 + 卸载历史到文件系统 |
| **Tool Output Offload** | 大工具输出污染上下文 | 保留头尾 Token，完整输出存文件 |
| **Skills (Progressive Disclosure)** | 太多工具/MCP 降低启动性能 | 渐进式加载，按需激活 |
| **Memory Injection** | 跨会话记忆 | AGENTS.md 文件注入、向量检索 |

### 3.4 验证回路 (Verification Loop)

Agent 需要自我验证以保持正确性：

```
┌──────────┐
│  Plan    │
└────┬─────┘
     │
     ▼
┌──────────┐     ┌──────────┐
│  Execute │────►│  Verify  │
└──────────┘     └────┬─────┘
     ▲                │
     │           ┌────▼─────┐
     │      Pass │          │ Fail
     │           │          │
     │           ▼          ▼
     │      ┌────────┐  ┌────────┐
     │      │  Next  │  │  Fix   │
     │      │  Step  │  │  Error │
     │      └────────┘  └───┬────┘
     │                      │
     └──────────────────────┘
```

验证手段包括：

| 方式 | 描述 | 适用场景 |
|------|------|---------|
| **测试套件** | 运行预定义测试 | 代码修改后验证 |
| **Lint/类型检查** | 静态分析 | 代码质量保证 |
| **截图比对** | 视觉回归 | UI 修改验证 |
| **日志检查** | 解析执行日志 | 部署后验证 |
| **LLM 自评** | 模型评估自己的输出 | 开放域任务 |

### 3.5 长程执行 (Long-Horizon Execution)

复杂任务需要跨多个上下文窗口持续工作：

| 模式 | 描述 | 关键技术 |
|------|------|---------|
| **Ralph Loop** | 拦截模型退出，注入原始 Prompt 到新上下文 | 文件系统持久化 + Hook |
| **Plan File** | 将计划写入文件，每次迭代读取更新 | 结构化 TODO + 文件系统 |
| **Git Checkpoint** | 每完成一步自动 commit | Git + 自动摘要 |
| **子 Agent 分工** | 将大任务拆分给多个并行 Agent | 编排层 + 共享文件系统 |

---

## 四、配置参数参考

### 4.1 运行时配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `model` | string | - | 主模型标识 (如 `claude-sonnet-4`) |
| `max_steps` | int | 50 | 单任务最大步数 |
| `timeout` | int | 600 | 任务超时（秒） |
| `max_tokens_per_step` | int | 8192 | 每步最大输出 Token |
| `context_window` | int | 200000 | 上下文窗口大小 |
| `compaction_threshold` | float | 0.8 | 触发压缩的上下文使用率 |
| `temperature` | float | 0.0 | 模型温度 |

### 4.2 沙箱配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `sandbox_type` | string | `docker` | 沙箱类型 |
| `sandbox_image` | string | `ubuntu:22.04` | 基础镜像 |
| `cpu_limit` | int | 4 | CPU 核数限制 |
| `memory_limit` | string | `8GB` | 内存限制 |
| `disk_limit` | string | `20GB` | 磁盘限制 |
| `network_access` | bool | false | 是否允许网络 |
| `command_allowlist` | list | `[]` | 命令白名单 |

### 4.3 安全配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `require_human_approval` | list | `[rm, drop, delete]` | 需人工确认的命令关键词 |
| `sensitive_file_patterns` | list | `[*.env, *.key, *.pem]` | 敏感文件模式 |
| `max_cost_per_task` | float | 10.0 | 单任务最大成本（美元） |
| `audit_log_enabled` | bool | true | 是否开启审计日志 |
| `pii_detection` | bool | true | 是否检测 PII 泄漏 |

### 4.4 记忆配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `memory_file` | string | `AGENTS.md` | 记忆文件路径 |
| `memory_auto_inject` | bool | true | 启动时自动注入 |
| `memory_max_tokens` | int | 4096 | 注入记忆的最大 Token |
| `session_ttl` | int | 86400 | 会话记忆 TTL（秒） |
| `vector_store` | string | `chroma` | 长期记忆向量库 |

---

## 五、性能指标与基线

### 5.1 关键性能指标 (KPI)

| 指标 | 定义 | 基线目标 | 优秀标准 |
|------|------|---------|---------|
| **任务成功率** | 完成任务的比例 | ≥ 80% | ≥ 95% |
| **平均完成步数** | 成功任务的平均步数 | ≤ 15 步 | ≤ 8 步 |
| **首次成功率** | 无需重试即成功的比例 | ≥ 60% | ≥ 85% |
| **P50 延迟** | 中位完成时间 | ≤ 30s | ≤ 10s |
| **P95 延迟** | 95 分位完成时间 | ≤ 120s | ≤ 60s |
| **工具调用准确率** | 正确工具调用 / 总调用 | ≥ 85% | ≥ 95% |
| **单任务成本** | 平均每任务 Token + API 成本 | ≤ $0.50 | ≤ $0.10 |
| **错误恢复率** | 遇错后自行修复的比例 | ≥ 50% | ≥ 80% |
| **安全违规率** | 越权/泄漏/危险操作比例 | 0% | 0% |

### 5.2 各模型性能基线 (2026-04)

| 模型 | SWE-bench Verified | GAIA L1 | GAIA L3 | 平均步数 | 单任务成本 |
|------|-------------------|---------|---------|---------|-----------|
| Claude Sonnet 4 | 72.7% | 92.1% | 58.3% | 8.2 | $0.12 |
| GPT-4.5 | 68.5% | 89.7% | 52.1% | 10.5 | $0.18 |
| Gemini 2.5 Pro | 63.8% | 87.3% | 48.7% | 11.8 | $0.15 |
| DeepSeek V3 | 58.2% | 82.5% | 41.2% | 14.3 | $0.04 |
| Qwen 3 235B | 55.1% | 80.1% | 38.9% | 15.7 | $0.06 |

> 注：以上为参考基线，实际表现受 Harness 设计影响显著。同一模型在不同 Harness 中可能有 20-40% 的表现差异。

### 5.3 Harness 对性能的影响

不同 Harness 设计对同一模型的影响：

| Harness 特性 | 性能影响 | 说明 |
|-------------|---------|------|
| **好的 System Prompt** | +5-15% 成功率 | 清晰的角色、约束和输出格式 |
| **文件系统访问** | +10-20% 成功率 | 允许增量工作和持久化 |
| **验证回路** | +15-25% 成功率 | 测试驱动的自我修复 |
| **上下文压缩** | +5-10% 长任务成功率 | 防止 Context Rot |
| **Ralph Loop 续写** | +20-30% 长任务成功率 | 跨上下文窗口继续工作 |
| **子 Agent 并行** | 2-5x 效率提升 | 大规模任务分治 |

---

## 六、框架兼容性矩阵

### 6.1 Harness 组件 vs 框架支持

| Harness 组件 | LangChain / LangGraph | AutoGen | CrewAI | AgentScope | 自建 |
|-------------|----------------------|---------|--------|------------|------|
| **文件系统** | 需自行集成 | 需自行集成 | 需自行集成 | 内置 | 完全自定义 |
| **沙箱** | 通过 E2B/Docker | 内置 Docker | 有限 | 内置 | 完全自定义 |
| **上下文压缩** | 内置 | 需自行实现 | 有限 | 内置 | 完全自定义 |
| **MCP 集成** | 原生支持 | 社区插件 | 社区插件 | 部分支持 | 完全自定义 |
| **子 Agent 编排** | LangGraph 原生 | 原生 Group Chat | 原生 Crew | 原生 Stage | 完全自定义 |
| **记忆系统** | 内置多种 | 内置 | 有限 | 内置 | 完全自定义 |
| **Trace/观测** | LangSmith 集成 | AutoGen Studio | 有限 | 内置 | 接 OTEL |
| **Hooks** | Callback 系统 | 事件系统 | 有限 | Pipeline Hook | 完全自定义 |

### 6.2 框架选型建议

| 场景 | 推荐框架 | 理由 |
|------|---------|------|
| **快速原型** | CrewAI | 最低学习曲线，角色编排直观 |
| **复杂状态机** | LangGraph | 状态图建模，灵活可扩展 |
| **多 Agent 对话** | AutoGen | Group Chat 原生支持 |
| **大规模并发** | AgentScope | 100+ Agent 并发，阿里云生态 |
| **极致可控** | 自建 Harness | 完全定制，适合高安全/高壁垒场景 |
| **企业级生产** | Hermes Agent + 自建 | 安全合规 + 定制编排 |

### 6.3 观测平台兼容性

| 平台 | 开源 | Agent Trace | 评估集成 | 成本追踪 | 部署方式 |
|------|------|-----------|---------|---------|---------|
| **LangSmith** | 否 | 原生 | 原生 | 支持 | SaaS |
| **Phoenix (Arize)** | 是 | 原生 | 原生 | 支持 | 自部署/SaaS |
| **AgentOps** | 否 | 原生 | 有限 | 支持 | SaaS |
| **Braintrust** | 否 | 支持 | 原生 | 支持 | SaaS |
| **W&B Weave** | 否 | 支持 | 支持 | 支持 | SaaS/自部署 |
| **OpenTelemetry** | 是 | 需适配 | 需自建 | 需自建 | 自部署 |

---

## 七、多角色使用指南

### 7.1 Agent 设计师

**关注点**: 架构模式选择、组件设计、UX 考虑

**设计检查清单**:

| 检查项 | 问题 | 建议 |
|--------|------|------|
| **执行模式** | 同步/异步/事件驱动？ | 简单任务同步，复杂任务事件驱动 |
| **工具集规模** | 需要多少工具？ | <10 直接加载，>10 用 Skills 渐进式 |
| **记忆需求** | 需要跨会话记忆？ | 会话级用 Redis，持久用向量库 |
| **人机协作** | 全自主还是人在回路？ | 高风险操作必须人工确认 |
| **多 Agent** | 单体还是多 Agent？ | 任务可拆分且角色明确时用多 Agent |
| **容错设计** | 失败时如何恢复？ | 必须有回退策略和降级方案 |

**推荐阅读顺序**:
1. [The Anatomy of an Agent Harness](./The_Anatomy_of_an_Agent_Harness.md) -- 理解核心概念
2. 本文第二、三章 -- 架构与组件
3. [Agent Production 2026](../Enterprise_Agent/Agent_Production_2026.md) -- 生产模式

### 7.2 开发者

**关注点**: API 接入、代码实现、工具集成

**快速集成示例**:

```python
# 使用 LangGraph 构建 Harness
from langgraph.graph import StateGraph, MessagesState
from langgraph.prebuilt import ToolNode

# 定义工具
tools = [file_read, file_write, bash_execute, web_search]

# 构建状态图
graph = StateGraph(MessagesState)
graph.add_node("agent", agent_node)
graph.add_node("tools", ToolNode(tools))
graph.add_edge("agent", "tools")
graph.add_edge("tools", "agent")

# 编译并运行
app = graph.compile(checkpointer=MemorySaver())
result = app.invoke({"messages": [HumanMessage(content="Fix the login bug")]})
```

```python
# 使用 AutoGen 构建 Harness
from autogen import ConversableAgent, GroupChat, GroupChatManager

planner = ConversableAgent("planner", llm_config={"model": "claude-sonnet-4"})
coder = ConversableAgent("coder", llm_config={"model": "claude-sonnet-4"})
reviewer = ConversableAgent("reviewer", llm_config={"model": "claude-sonnet-4"})

group_chat = GroupChat(agents=[planner, coder, reviewer], max_round=20)
manager = GroupChatManager(groupchat=group_chat)

planner.initiate_chat(manager, message="Implement user authentication")
```

**推荐阅读顺序**:
1. 本文第三、四章 -- 组件与配置
2. [Agentic Coding Tools](../Agentic_Coding_Tools/) -- 选择开发工具
3. [Agent Frameworks](../Agent_Frameworks/) -- 选择框架

### 7.3 产品经理

**关注点**: 功能规划、用户需求、ROI 分析

**Harness 能力 vs 产品功能映射**:

| Harness 能力 | 产品功能 | 用户价值 | 优先级 |
|-------------|---------|---------|--------|
| 文件系统访问 | 文档分析、代码辅助 | 直接操作用户数据 | P0 |
| 工具执行 | 自动化操作 | 减少手工步骤 | P0 |
| 记忆系统 | 个性化、上下文延续 | "懂我"的助手体验 | P1 |
| 验证回路 | 可靠输出 | 减少人工检查 | P1 |
| 多 Agent | 复杂工作流 | 端到端自动化 | P2 |
| 安全审计 | 合规保障 | 企业信任 | P0 (企业) |

**ROI 评估框架**:

| 指标 | 计算方式 | 典型值 |
|------|---------|--------|
| **人工替代率** | Agent 完成的任务 / 总任务 | 30-70% |
| **效率提升** | (人工时间 - Agent 时间) / 人工时间 | 50-80% |
| **成本节省** | 人工成本 - Agent 运行成本 | 40-60% |
| **错误率降低** | (人工错误 - Agent 错误) / 人工错误 | 20-50% |

### 7.4 集成测试工程师

**关注点**: 测试策略、验证标准、自动化

**Harness 测试金字塔**:

| 层级 | 测试类型 | 覆盖范围 | 执行频率 |
|------|---------|---------|---------|
| **Unit** | 工具单元测试 | 单个工具的输入/输出 | 每次提交 |
| **Integration** | 工具链集成测试 | 多工具协作场景 | 每日 |
| **E2E** | 端到端任务测试 | 完整任务执行 | 每周 / PR |
| **Regression** | 回归测试 | 核心任务不退化 | 每次发布 |
| **Safety** | 安全红队测试 | 越权、注入、泄漏 | 每次发布 |

**验证标准模板**:

```yaml
test_case:
  id: "TC-001"
  name: "文件创建与验证"
  precondition: "空工作区"
  steps:
    - action: "Agent 创建 hello.py"
    - action: "Agent 运行 python hello.py"
  expected:
    - file_exists: "hello.py"
    - output_contains: "Hello"
    - exit_code: 0
  timeout: 60
  safety_checks:
    - no_files_outside_workspace: true
    - no_network_access: true
```

> 完整的评估方法论和基准测试，参见 [Agent_Evaluation](../Agent_Evaluation/)。

### 7.5 评估师

**关注点**: 评估标准、基准选择、评分体系

**评估维度速查**:

| 维度 | 核心指标 | 权重参考 (通用 Agent) |
|------|---------|---------------------|
| **任务完成** | 成功率、部分完成得分 | 30% |
| **效率** | 步数、Token 用量、成本 | 15% |
| **能力质量** | 工具准确率、规划质量 | 20% |
| **安全** | 越权率、泄漏率、危险操作 | 20% |
| **用户体验** | 解释质量、透明度、可中断性 | 15% |

> 详细的评估维度、指标计算和评分卡模板，参见 [Agent_Harness_Complete_2026.md](../Agent_Evaluation/Agent_Harness_Complete_2026.md#四评估维度与指标)。

### 7.6 架构师

**关注点**: 系统设计、扩展性、技术选型

**架构决策记录 (ADR) 模板**:

| 决策点 | 选项 A | 选项 B | 建议 |
|--------|--------|--------|------|
| **沙箱方案** | Docker | MicroVM | Docker (通用)、MicroVM (高安全) |
| **状态存储** | Redis | PostgreSQL | Redis (会话)、PG (持久化) |
| **向量库** | Chroma | Qdrant | Chroma (开发)、Qdrant (生产) |
| **模型路由** | 静态配置 | 动态路由 | 动态路由 (成本敏感场景) |
| **部署模式** | 单体 | 微服务 | 微服务 (>5 工具或多 Agent) |
| **观测平台** | 自建 OTEL | LangSmith | 自建 (自主可控)、LangSmith (快速) |

**扩展性设计要点**:

- **水平扩展**: 无状态 Agent 实例 + 外部状态存储
- **工具热插拔**: MCP 协议支持动态工具注册
- **模型可替换**: 统一模型网关 (OpenRouter) 屏蔽底层差异
- **多租户隔离**: 独立沙箱 + 独立记忆空间 + 独立审计链

---

## 八、最佳实践

### 8.1 Harness 设计原则

| 原则 | 描述 |
|------|------|
| **默认安全** | 无网络、最小权限、危险操作需确认 |
| **可观测** | 每步有 Trace，每任务有成本记录 |
| **可回滚** | Git checkpoint、状态快照、沙箱重置 |
| **可复现** | 环境版本锁定、工具 Schema 版本化 |
| **渐进式上下文** | 按需加载工具和记忆，避免启动时上下文臃肿 |
| **验证驱动** | 每步验证，不盲信模型输出 |

### 8.2 常见反模式

| 反模式 | 问题 | 正确做法 |
|--------|------|---------|
| **上下文溢出** | 一次性加载所有工具描述 | Skills 渐进式加载 |
| **无限循环** | Agent 陷入重试循环 | 设置 max_steps + 降级策略 |
| **沙箱逃逸** | Agent 执行危险操作 | 命令白名单 + 网络隔离 |
| **成本失控** | 长链路 Token 消耗过大 | 成本上限 + 实时监控 |
| **单点故障** | 依赖单一模型或 API | 多模型 fallback + 熔断 |
| **幻觉传播** | 错误中间结果被后续步骤使用 | 每步验证 + 事实检查 |

### 8.3 上线检查清单

- [ ] 核心任务成功率 ≥ 90%
- [ ] 安全严重问题 = 0
- [ ] 单任务成本回归 < 10%
- [ ] P95 延迟回归 < 15%
- [ ] 审计日志完整
- [ ] 回滚方案验证通过
- [ ] 监控告警配置就绪
- [ ] 红队测试通过

---

## 九、成本优化与效率

Harness 设计的另一个核心维度是**成本控制**。Agent 任务往往涉及多轮 LLM 调用、大量 Token 消耗和沙箱资源占用，不做优化的 Harness 可能在几天内产生数百甚至数千美元的成本。

### 9.1 成本构成分析

一个典型 Agent 任务的成本构成：

```
总成本 = LLM API 成本 (70-85%) + 沙箱计算成本 (10-20%) + 存储/网络 (5-10%)
```

| 成本项 | 计费方式 | 典型单价 (2026-04) | 优化空间 |
|--------|---------|-------------------|---------|
| **Prompt Tokens** | 每 1M tokens | $2-15 | ⭐⭐⭐⭐⭐ |
| **Completion Tokens** | 每 1M tokens | $5-30 | ⭐⭐⭐⭐ |
| **沙箱 CPU** | 每核时 | $0.05-0.50 | ⭐⭐⭐ |
| **沙箱内存** | 每 GB 时 | $0.01-0.10 | ⭐⭐ |
| **向量存储查询** | 每 1K 次 | $0.01-0.50 | ⭐⭐⭐ |
| **观测平台** | SaaS 订阅 | $50-500/月 | ⭐⭐ |

### 9.2 Prompt 层优化

Prompt 层是成本的大头，优化收益最高：

#### 策略一：模型路由（Model Routing）

根据任务复杂度动态选择模型：

```python
class ModelRouter:
    def route(self, task: str, context: dict) -> str:
        complexity = self._assess_complexity(task, context)
        
        if complexity == "simple":
            return "gpt-4o-mini"      # 便宜 10-20x
        elif complexity == "medium":
            return "claude-sonnet-4"
        elif complexity == "complex":
            return "gpt-4o"
        else:
            return "claude-opus-4"    # 仅用于高难度任务
    
    def _assess_complexity(self, task: str, context: dict) -> str:
        # 启发式判断
        if len(task) < 100 and "simple" in task.lower():
            return "simple"
        if context.get("file_count", 0) > 50:
            return "complex"
        return "medium"
```

**收益**：简单任务成本降低 80-90%。

#### 策略二：Prompt 压缩

减少传入上下文的 Token 数：

```python
class PromptCompressor:
    def compress(self, messages: list, budget: int = 4000) -> list:
        total = sum(len(m["content"]) for m in messages)
        if total <= budget * 4:  # 粗略估计：1 token ≈ 4 chars
            return messages
        
        # 保留 system + 最近 3 轮 + 摘要历史
        system_msgs = [m for m in messages if m["role"] == "system"]
        recent = messages[-6:]  # 最近 3 轮对话
        older = messages[len(system_msgs):-6]
        
        if older:
            summary = self._summarize(older)
            return system_msgs + [{"role": "system", "content": summary}] + recent
        
        return messages
```

**收益**：长会话成本降低 40-60%。

#### 策略三：结果缓存

缓存确定性任务的结果：

```python
import hashlib
from functools import lru_cache

class ResultCache:
    def __init__(self, ttl_seconds: int = 3600):
        self.cache = {}
        self.ttl = ttl_seconds
    
    def get_key(self, task: str, context: dict) -> str:
        content = f"{task}:{json.dumps(context, sort_keys=True)}"
        return hashlib.md5(content.encode()).hexdigest()
    
    def get(self, task: str, context: dict):
        key = self.get_key(task, context)
        entry = self.cache.get(key)
        if entry and time.time() - entry["time"] < self.ttl:
            return entry["result"]
        return None
    
    def set(self, task: str, context: dict, result: str):
        key = self.get_key(task, context)
        self.cache[key] = {"result": result, "time": time.time()}
```

适用场景：Lint 检查、格式转换、重复查询。

**收益**：重复任务成本降低 90%+。

### 9.3 执行层优化

#### 策略四：沙箱复用

避免为每个任务创建新沙箱：

```python
class SandboxPool:
    """沙箱连接池"""
    
    def __init__(self, max_size: int = 10):
        self.available = []
        self.in_use = set()
        self.max_size = max_size
    
    def acquire(self):
        if self.available:
            sandbox = self.available.pop()
            self.in_use.add(sandbox.id)
            return sandbox
        
        if len(self.in_use) < self.max_size:
            return self._create_new()
        
        raise RuntimeError("Sandbox pool exhausted")
    
    def release(self, sandbox):
        self.in_use.discard(sandbox.id)
        sandbox.reset()  # 清理状态，保留环境
        self.available.append(sandbox)
```

**收益**：任务启动时间从 5s 降到 <100ms，沙箱成本降低 50-70%。

#### 策略五：工具输出裁剪

大输出是上下文杀手：

```python
def offload_large_output(output: str, threshold: int = 2000) -> str:
    if len(output) <= threshold:
        return output
    
    # 保留头部和尾部各 500 chars，中间存文件
    head = output[:500]
    tail = output[-500:]
    middle = output[500:-500]
    
    file_path = f"/tmp/offload_{uuid4()}.txt"
    with open(file_path, "w") as f:
        f.write(middle)
    
    return f"{head}\n... [{len(middle)} chars offloaded to {file_path}] ...\n{tail}"
```

**收益**：大输出场景 Token 成本降低 60-80%。

### 9.4 架构层优化

#### 策略六：并发与批处理

```python
from concurrent.futures import ThreadPoolExecutor

class BatchProcessor:
    def process_batch(self, tasks: list, max_workers: int = 5):
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = {
                executor.submit(self.harness.run, task): task
                for task in tasks
            }
            results = {}
            for future in futures:
                task = futures[future]
                results[task] = future.result()
            return results
```

**收益**：批量任务单位成本降低 30-50%。

#### 策略七：智能重试与熔断

避免失败任务无限重试烧钱：

```python
class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, recovery_time: int = 60):
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.recovery_time = recovery_time
        self.last_failure = None
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
    
    def call(self, func, *args, **kwargs):
        if self.state == "OPEN":
            if time.time() - self.last_failure > self.recovery_time:
                self.state = "HALF_OPEN"
            else:
                raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise e
    
    def _on_failure(self):
        self.failure_count += 1
        self.last_failure = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
    
    def _on_success(self):
        self.failure_count = max(0, self.failure_count - 1)
        self.state = "CLOSED"
```

### 9.5 成本监控与告警

```python
class CostMonitor:
    def __init__(self, daily_budget: float = 100.0):
        self.daily_budget = daily_budget
        self.daily_spend = 0.0
        self.task_costs = []
    
    def record(self, task_id: str, cost: float, tokens: int):
        self.daily_spend += cost
        self.task_costs.append({
            "task_id": task_id,
            "cost": cost,
            "tokens": tokens,
            "time": datetime.now()
        })
        
        # 检查预算
        if self.daily_spend > self.daily_budget * 0.8:
            self._alert(f"Daily cost at 80%: ${self.daily_spend:.2f}")
        
        if self.daily_spend > self.daily_budget:
            self._alert(f"DAILY BUDGET EXCEEDED: ${self.daily_spend:.2f}")
            raise BudgetExceededException()
    
    def get_report(self) -> dict:
        return {
            "daily_spend": self.daily_spend,
            "daily_budget": self.daily_budget,
            "utilization": self.daily_spend / self.daily_budget,
            "task_count": len(self.task_costs),
            "avg_cost": sum(t["cost"] for t in self.task_costs) / len(self.task_costs) if self.task_costs else 0
        }
```

### 9.6 优化效果汇总

| 策略 | 适用场景 | 预期节省 |
|------|---------|---------|
| 模型路由 | 混合复杂度任务 | 50-70% |
| Prompt 压缩 | 长会话任务 | 40-60% |
| 结果缓存 | 重复/确定性任务 | 80-90% |
| 沙箱复用 | 高频短任务 | 50-70% |
| 输出裁剪 | 大文件/日志处理 | 60-80% |
| 并发批处理 | 批量任务 | 30-50% |
| 熔断保护 | 不稳定任务 | 避免失控 |

**组合使用**：上述策略组合应用，整体成本可降低 **60-85%**。

---

## 延伸阅读

### 本目录

- [The Anatomy of an Agent Harness](./The_Anatomy_of_an_Agent_Harness.md) -- Harness 工程定义与核心组件
- [Harness-in-nutshell.md](./Harness-in-nutshell.md) -- 30 分钟速览
- [Harness Implementation Guide](./Harness_Implementation_Guide.md) -- 从零搭建生产级 Harness

### 关联目录

- [Harness-in-nutshell.md](./Harness-in-nutshell.md) -- 30 分钟速览
- [Harness Implementation Guide](./Harness_Implementation_Guide.md) -- 从零搭建生产级 Harness
- [Harness Security Guide](./Harness_Security_Guide.md) -- 安全深度指南
- [Harness Deployment Guide](./Harness_Deployment_Guide.md) -- 容器化与 K8s 部署
- [Harness Testing Guide](./Harness_Testing_Guide.md) -- 测试策略与 CI/CD
- [Harness Ecosystem Catalog](./Harness_Ecosystem_Catalog.md) -- 平台与框架选型
- [Multi Agent Harness Design](./Multi_Agent_Harness_Design.md) -- 多 Agent 设计模式
- [Enterprise Agent / Agent Production 2026](../Enterprise_Agent/Agent_Production_2026.md) -- 生产部署最佳实践
- [Agent_Evaluation](../Agent_Evaluation/) -- Agent 评估体系

---

*Last updated: 2026-04-14 | Version: 2026 Edition*

## Related

- [[智能体/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[智能体/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[智能体/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[智能体/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
