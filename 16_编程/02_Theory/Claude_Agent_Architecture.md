---
title: "Claude Agent 架构：设计模式、上下文管理与多智能体协作"
tags: [claude, anthropic, ai-coding, agent, multi-agent, architecture]
source: yeasy/claude_guide
created: 2026-06-16
tier: peripheral
aliases:
  - "Claude Agent Architecture"
  - Claude_Agent_Architecture
sources: []

name_zh: "Claude Agent 架构：设计模式、上下文管理与多智能体协作"
---
# Claude Agent 架构：设计模式、上下文管理与多智能体协作

> 中文简称：Claude Agent 架构：设计模式、上下文管理与多智能体协作

> 本页面提炼自《Claude 技术指南》第八章，覆盖 Agent 设计模式、上下文管理、Extended Thinking、多 Agent 协作、Agent SDK 和 Managed Agents。

---

## 一、为什么选择 Claude 做 Agent

### 1.1 三大核心优势

| 优势 | 说明 |
|------|------|
| **Tool Use 准确率最高** | Berkeley Function Calling Leaderboard 长期领先，极少参数填错或幻觉调用 |
| **超长 Context（最高 1M）** | 容纳更长执行轨迹，减少"灾难性遗忘" |
| **Constitutional AI 安全机制** | 面对危险指令有内置道德刹车 |

### 1.2 Agent 自动化等级

| 等级 | 名称 | 人类角色 | 典型场景 |
|------|------|---------|---------|
| **L1** | Copilot | 指挥每一步 | "帮我重构这个函数" |
| **L2** | Router | 定义意图 | "查天气" → 自动选 Weather API |
| **L3** | Generalist | AI 自主规划 | "写一个贪吃蛇并运行" |
| **L4** | Autonomous | 无需干预 | "每周五自动爬竞品价格" |

> 生产级 Agent 系统重点在 **L3 和 L4**：AI 具有完整的规划、决策和自我修正能力。

---

## 二、五大核心设计模式

### 2.1 模式概览

Anthropic 工程实践总结的五个基础构建块：

| 模式 | 核心思想 | 适用场景 |
|------|---------|---------|
| **Prompt Chaining** | 线性步骤，上一步输出作为下一步输入 | 流程明确的管道式任务 |
| **Routing** | 根据输入分类，分流到最适合的处理单元 | 多类型请求的入口分发 |
| **Parallelization** | 同时运行多个独立子任务，聚合结果 | 可"分而治之"的场景 |
| **Orchestrator-Workers** | 中央大脑动态规划和分配任务 | 复杂的多步骤项目 |
| **Evaluator-Optimizer** | 生成后由另一个角色评审改进 | 需要质量迭代的任务 |

### 2.2 ReAct 模式

> ReAct 的完整原理、三要素循环、生产护栏详见 [[Agentic_AI_Complete_Guide#3.3-react-推理与行动的统一]]。

最经典的 Agent 模式：**行动之前先思考，行动之后看结果。**

```
用户输入 → Thought（思考）→ Action（调用工具）→ Observation（观察结果）→ 循环
                                                                    ↓ 任务完成
                                                              Final Answer
```

**优点**：灵活，能解决未知问题，容错率高
**缺点**：容易死循环，Token 消耗大，可能跑题

### 2.3 Plan-and-Solve 模式

对特别复杂的任务，ReAct 视野太窄容易迷失。Plan-and-Solve 要求 **先写大纲再执行**。

```
用户目标 → Planner（生成计划）→ Executor（逐步执行）
                                    ↓ 失败
                              Replanner（调整计划）→ 更新计划
```

**ReAct vs Plan-and-Execute 选择标准**：
- **不知道下一步会看到什么** → 优先 ReAct（如排查线上故障）
- **知道大致要做哪几步** → 优先 Plan-and-Execute（如重构支付模块）

**混合模式**（生产最佳实践）：
1. 先用 Planner 生成全局任务树
2. Executor 在每个子任务内运行局部 ReAct
3. 遇到明显阻塞时才请求 Replanner

#### Claude Code 团队的演进

最初用 `TodoWrite` 工具维护列表，但模型经常"忘记"条目。最终用更成熟的 **Task 系统**替代：
- **依赖关系**：任务之间可定义先后依赖
- **跨代理共享**：Task 在主代理和子代理之间共享——"共享白板"

### 2.4 Reflection 模式

通过引入**自我批评**提升质量：

```
Generator（输出草稿）→ Critic（反馈意见）→ Generator（修改）→ 循环直至通过
```

**Reflexion 实战**：单元测试失败 → Agent 反思假设错误 → 生成修复代码 → 重试

### 2.5 Routing 模式

当系统有成百上千个工具时，引入轻量级 Router 做意图分类：

```
用户："我要退货" → Router → CustomerService_Agent
用户："这首歌叫什么" → Router → Music_Agent
```

### 2.6 Tool Use + RAG 混合

最强大的 Agent 同时具备两种能力：
- **RAG**：获取知识（"公司请假制度"）
- **Tool Use**：执行操作（"提交请假条"）

**最佳实践**：把 RAG 当作一种 Tool——定义 `search_knowledge_base(query)` 工具，Agent 自己决定搜文档还是调 API。

---

## 三、长任务 Agent 的 Harness 设计

### 3.1 双层架构

| 角色 | 职责 |
|------|------|
| **Initializer Agent** | 一次性运行，环境检查、依赖安装 |
| **Executor Agent** | 反复迭代，每次只完成一个功能单元 |

### 3.2 JSON Checklist 进度跟踪

**不要用 Markdown 列表**——改用 JSON 格式。模型对 JSON 结构的遵守度显著更高。

```json
{
  "features": [
    {
      "id": "feature_001",
      "description": "端到端：用户注册流程",
      "passes": false,
      "lastChecked": "2026-03-28T09:00:00Z",
      "notes": "前端表单已完成，后端邮件验证待实现"
    }
  ]
}
```

**关键原则**：
- 所有条目初始化为 `false`，Agent **只能修改 `passes` 字段**
- 禁止删除或编辑已有条目
- 200+ 条目的细粒度描述比 5 个宽泛目标更有效

### 3.3 单功能增量开发

1. 单次迭代只做一个功能
2. 完成后运行端到端测试验证
3. 通过 → 标记 `passes: true`，提交 Git Commit
4. 继续下一个功能

### 3.4 会话开始的基线测试

长任务跨多个会话运行。**每个新会话启动时**：
1. 读取进度清单，了解前一个会话完成了什么
2. 重新验证已标记为 `passes: true` 的功能（捕捉回归）
3. 发现回归 → 立即修复

---

## 四、上下文管理与记忆系统

### 4.1 三层记忆架构

```
Agent ↔ Working Memory（上下文窗口）← 当前对话、CoT、临时变量
      ↔ Episodic Memory（向量数据库）← 历史事件、RAG 检索
      ↔ Semantic Memory（外部知识库）← SOP、产品手册
```

### 4.2 上下文记忆 vs 权重记忆

Agent 排错的关键区分：
- **上下文不足**（该给的信息没给）→ 改进 RAG 或扩大窗口
- **权重缺陷**（模型从没学过）→ 等待下一代模型或通过工具弥补

### 4.3 突破上下文窗口限制

**Prompt Caching**：
- 静态 Prefix 缓存，Input Token 成本最高降低 90%
- 默认 5 分钟缓存，1 小时缓存已 GA

**Memory Tool**：给 Agent 显式"记事本"

```json
{
  "name": "manage_memory",
  "parameters": {
    "action": "save | read | delete",
    "key": "coding_lang",
    "value": "Python"
  }
}
```

**渐进式上下文加载**：
- **Grep 优于 RAG**（代码场景）：让 Agent 像人类一样通过关键词搜索"钻入"代码库
- **Agent Guide 模式**：不在 System Prompt 堆砌文档，提供子代理按需查询
- **核心原则**：让 Agent 主动构建自己的上下文，而非被动接收预加载信息

**Context Compression**：每隔 N 轮触发 Summary Agent，将历史压缩为摘要替换原始记录。

### 4.4 Claude Code 的 7 层记忆架构

| 层 | 名称 | 关键机制 |
|----|------|---------|
| 1 | 工具结果存储 | 超阈值持久化到磁盘，仅留 ~2KB 预览 |
| 2 | 微型压缩 | 时间清理 + 缓存微压缩 |
| 3 | 会话记忆 | 结构化笔记，零额外 API 调用注入 |
| 4 | 完整压缩 | 紧急机制，分支 Agent 生成摘要 |
| 5 | 自动记忆提取 | 任务结束提取持久化知识 |
| 6 | 梦想机制 | 跨会话记忆整合（研究预览） |
| 7 | 跨 Agent 通信 | Haiku 生成进度快照 |

### 4.5 会话分支与工作状态恢复

| 操作 | 说明 |
|------|------|
| **Resume** | 从中断处继续，恢复完整工作场景（不只是消息） |
| **Fork** | 从某时间点创建分支，独立演化 |
| **Subagent** | 拥有独立上下文窗口的从属代理 |

**关键理解**：Resume 恢复的是**操作语境**（Operational Context），而非仅仅是消息序列——它保存的不只是"说了什么"，而是"在做什么"。

### 4.6 记忆生命周期管理

- **TTL**：短期任务状态设 24 小时过期
- **Relevance Scoring**：语义相似度 + 时间衰减因子
- **Privacy Purge**：提供"忘记我"功能（GDPR 合规）

---

## 五、Extended Thinking 深度推理

> 模型支持矩阵（Adaptive/Extended Thinking）、effort 级别选择、成本公式与 ROI 决策框架详见 [[Claude_Complete_Guide#八extended-thinking-与-adaptive-thinking]]。此处仅保留对 Agent 架构的影响。

### 5.1 对 Agent 架构的影响

- **减少外部 Loop**：将部分规划与校验内化为一次更强的 Thinking Call
- **混合策略**：Planner/Reviewer 开启 Thinking，Executor 使用快速模式
- **System 1 vs System 2**：简单任务用快思考（直觉式反应），复杂任务用慢思考（逻辑推理、逐步验证）

---

## 六、多 Agent 协作模式

### 6.1 三种协作模式

#### Hierarchical（层级式）

最常见、最可控。Boss 拆任务分发，Worker 执行回报。

```
用户 → Boss Agent
        ├── Coder Agent（写代码）
        ├── Reviewer Agent（审查代码）
        └── Writer Agent（写文档）
       ← 汇总结果 → 用户
```

**优点**：逻辑清晰，死循环风险低
**缺点**：Boss 容易成为瓶颈（Context 爆炸）

#### Joint Chat（共享聊天室）

所有 Agent 看到彼此消息，轮转发言。

**优点**：信息同步快
**缺点**：容易"吵架"，Context 消耗极快

#### Handoff（交接式）

常见于客服场景。Level 1 识别意图 → Handoff → Level 2 专员继续服务。

### 6.2 A2A 通信契约

**不要**让 Agent 之间用自然语言聊天——定义结构化消息协议。

```json
{
  "task_id": "task-001",
  "task_type": "refund_request",
  "dependencies": [],
  "acceptance_criteria": ["核验订单", "确认退款条件", "输出处理结论"],
  "payload": { "order_id": "ORD-123" }
}
```

**核心原则**：对人保留自然语言，对机器优先结构化协议。

### 6.3 人工参与

人类本质上是 MAS 中的一个特殊 Agent：`ask_human(question)` 工具。

### 6.4 最佳实践：避免"三个和尚没水喝"

1. **明确 SOP**：每个 Worker 的 System Prompt 极度具体
2. **共享状态数据库**：用 Redis 或文件系统作"共享白板"，不要把一切放 Prompt
3. **最大轮次限制**：超过 N 轮强制终止，报错给人类

---

## 七、实现框架

### 7.1 LangGraph（基于图论的编排）

```python
from langgraph.graph import StateGraph, END

workflow = StateGraph(AgentState)
workflow.add_node("coder", coder_agent)
workflow.add_node("reviewer", reviewer_agent)
workflow.set_entry_point("coder")
workflow.add_edge("coder", "reviewer")
workflow.add_conditional_edges("reviewer", should_continue, {
    "end": END,
    "revise": "coder"  # 循环回 coder 修改
})
app = workflow.compile()
```

适合构建复杂的、有状态的、循环的工作流。

### 7.2 OpenAI Swarm（教学示例）

轻量级 Handoff 模式实现。定义 `transfer_to_agent_b` 工具，模型自己决定何时交接。

> Swarm 已标记为 experimental/educational，生产用途应迁移到 Agents SDK。

---

## 八、Claude Code 多智能体能力

### 8.1 三层能力体系

| 层级 | 能力 | 特点 |
|------|------|------|
| **Claude Code Subagents** | 产品内建委派能力 | 独立上下文窗口，上下文隔离 |
| **Agent SDK Subagents** | 自建多 Agent 编排 | 自定义角色、状态流转 |
| **Agent Teams** | 高层协作功能 | 多实例在同一任务空间协同 |

### 8.2 Subagent Frontmatter 完整字段

文件式 subagent 是带 YAML frontmatter 的 Markdown，存放在 `.claude/agents/`：

```yaml
---
name: pr-review
description: 在合并前审查 diff，查找 bug、安全问题、遗漏的测试
tools: Read, Grep, Glob, Bash
model: opus
effort: high
memory: project
isolation: worktree    # 可选：在临时 git worktree 中运行
---
```

**关键设计原则**（以 PR 审查为例）：

1. **只读工具**（`Read, Grep, Glob, Bash`）——审查者不改代码，避免偏向"我来修一下"
2. **最强模型**（`opus` + `high`）——审查是高风险低频任务
3. **项目记忆**（`memory: project`）——积累项目特定的"已知陷阱"
4. **明确反向边界**（Do NOT flag）——避免无限扩散关心范围

### 8.3 Built-in Subagents

| 名称 | 模型 | 用途 |
|------|------|------|
| **Explore** | Haiku | 只读文件发现、代码搜索 |
| **Plan** | inherit | Plan 模式下的代码库研究 |
| **general-purpose** | inherit | 探索+修改混合任务 |

### 8.4 Agent SDK Subagents

```python
from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition

async for message in query(
    prompt="Review the authentication module",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Grep", "Glob", "Agent"],
        agents={
            "security-reviewer": AgentDefinition(
                description="Security reviewer for auth code.",
                prompt="Review for auth bypass, secret leakage.",
                tools=["Read", "Grep", "Glob"],
                model="opus",
                effort="high",
            )
        },
    ),
):
    if hasattr(message, "result"):
        print(message.result)
```

---

## 九、Agent SDK 架构深度分析

### 9.1 三层架构

```
应用层        → 业务逻辑、工作流编排、事件处理
Agent 层      → Agent 定义、协作协议、状态管理
运行时层      → 消息队列、执行引擎、上下文管理
服务层        → Claude API、工具调用、外部集成
```

### 9.2 Agent 反馈循环：收集-执行-验证

**收集上下文 (Gather)**：
- 文件系统作为索引（Agent 通过 `grep`、`tail` 智能加载）
- 语义搜索（速度优先但准确性较低）
- Subagents 并行化 + 上下文隔离
- 自动上下文压缩

**执行任务 (Take Action)**：
- 工具（Agent 的主要行动构建块）
- Bash 脚本（通用灵活工具）
- 代码生成（精确、可组合、可重用）
- MCP 标准化集成

**验证工作 (Verify)**：
- 基于规则的反馈（代码 lint 是最好的形式）
- 视觉反馈（截图验证 UI）
- LLM 作为评判者（另一个模型评判输出）

### 9.3 四种协作协议

| 模式 | 说明 | 代码模式 |
|------|------|---------|
| **Pipeline** | 顺序处理，上一步输出作下一步输入 | `for agent in agents: result = agent.process(data)` |
| **Fan-out/Fan-in** | 并行处理后聚合 | `asyncio.gather(*tasks)` |
| **Conditional** | 基于条件路由到不同 Agent | `if/elif` 分类分发 |
| **Iterative** | 反馈循环改进结果 | 评估 → 反馈 → 重试 |

### 9.4 生产级错误处理

| 错误类型 | 策略 |
|---------|------|
| **429 频率限制** | 指数退避重试（`2^retry_count` 秒 + 随机抖动） |
| **401 认证失败** | 立即失败，不重试 |
| **400 无效请求** | 立即失败，交由上层修正参数 |
| **上下文溢出** | 截断策略（删除 30% 最老消息，保留 System Prompt 和最近 5 条） |
| **超时** | 线性退避（`5 * (retry_count + 1)` 秒） |
| **5xx 服务器错误** | 指数退避 + 熔断器（3 次失败打开，5 分钟后半开） |

---

## 十、Managed Agents：全托管 Agent 平台

### 10.1 定位

Anthropic 提供的托管 Agent harness，运行在托管基础设施上。2026-04-09 公开测试，目前仍为 public beta。

### 10.2 Agent SDK vs Managed Agents

| 维度 | Agent SDK | Managed Agents |
|------|-----------|---------------|
| 部署位置 | 自有基础设施 | Anthropic 云端 |
| 执行环境 | 自行实现 | 配置托管容器 |
| 长时间运行 | 需自行处理状态 | Session 作为托管运行实例 |
| 工具接入 | 自行实现 | 预置 bash、文件、搜索等 |
| 适用场景 | 高度定制 | 快速上线、降低运维 |

### 10.3 四个核心对象

| 对象 | 说明 |
|------|------|
| **Agent** | 模型、系统提示词、工具、MCP、skills 的可版本化配置 |
| **Environment** | 托管容器模板（包、网络、文件挂载） |
| **Session** | 在某个环境中运行的一次 Agent 实例 |
| **Events** | 应用与 Agent 之间的消息、工具结果和状态更新 |

### 10.4 何时选择

**优先 Managed Agents**：
- 减少自建 agent loop 和容器运行时的基础设施负担
- 需要长时间运行或异步回收
- 团队缺乏 Agent 基础设施运维经验

**优先 Agent SDK / 自托管**：
- 需要完全控制 agent loop 和调度策略
- 执行环境必须部署在自有基础设施
- 已有成熟的容器编排和监控体系

---

## 十一、Agent 设计速查清单

### 11.1 架构决策

- [ ] 选择设计模式（ReAct / Plan-and-Solve / 混合）
- [ ] 确定自动化等级（L1-L4）
- [ ] 设计记忆系统（Working / Episodic / Semantic）
- [ ] 选择协作模式（Hierarchical / Joint Chat / Handoff）
- [ ] 定义 A2A 通信契约

### 11.2 工程实施

- [ ] 实现 Agent 反馈循环（收集-执行-验证）
- [ ] 配置权限边界（最小权限原则）
- [ ] 设计错误处理（分类 + 退避 + 熔断）
- [ ] 建立可观测性（日志 + 监控 + 告警）
- [ ] 实施成本优化（模型路由 + 缓存 + 批量）

### 11.3 质量保障

- [ ] 人机回环（高风险操作需人工确认）
- [ ] 最大轮次限制（防止无限循环）
- [ ] 共享状态数据库（避免 Prompt 膨胀）
- [ ] 基线测试（每次新会话验证已有成果）
- [ ] 灰度发布 + 回滚机制

---

## 相关页面

- [[Claude_Complete_Guide]] - Claude 模型家族、提示工程与工具协议
- [[Claude_Code_Deep_Dive]] - Claude Code CLI、SDK、IDE 与自动化工作流
- [[Context_Engineering_Guide]] - 从提示词工程到上下文工程
- [[LLM_Fundamentals]] - 大语言模型基础知识
