---

title: "Agent Harness (智能体驭具)"
tags: [agent-harness, production-engineering, system-architecture, agent-loop, guardrails]
created: 2026-06-17
updated: 2026-07-21
tier: core
aliases:
  - "Agent Harness"
  - "agent harness"
category: -concepts
lifecycle: reviewed

relationships:
  - target: "概念/Agent/agent-loop"
    type: contains
  - target: "概念/Agent/mcp"
    type: integrates
  - target: "概念/Agent/agent-production-deployment"
    type: enables
  - target: "概念/Agent/agentops"
    type: monitored_by
sources:
  - "https://docs.anthropic.com/en/docs/agents"
  - "https://langchain-ai.github.io/langgraph/"
---

# Agent Harness (智能体驭具)

## 定义

Agent Harness 是包裹在 AI 模型外围的软件基础设施框架，负责模型推理之外的一切：工具执行、状态持久化、安全边界、错误恢复和生命周期管理。核心公式为 **Agent = LLM + Harness**——模型决定思维上限，Harness 决定工程下限。

"Harness"源自马具隐喻：不是给马匹增加力量，而是引导方向、分散风险、标准化协作。

## 核心机制

### 五大核心子系统

1. **运行时引擎**：维护 Agent Loop 主循环（感知 -> 推理 -> 决策 -> 执行 -> 学习 -> 判断），管理状态机（Initializing -> Executing -> Completed -> Stopped）
2. **工具层**：智能体与真实世界的连接点，负责工具注册、发现、参数验证、权限检查、执行隔离和结果标准化
3. **记忆子系统**：三层架构——工作记忆（上下文窗口）、短期记忆（会话级摘要）、长期记忆（向量索引 + 持久化知识）
4. **模型集成与输出治理**：管理与 LLM 的交互，四步防御流程——格式解析 -> 自愈修复 -> 语义验证 -> 安全检查
5. **编排引擎**：支持复杂多步任务和多智能体协作，工作流定义（顺序/条件/并行/循环）和依赖管理

### 运行时引擎状态机

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Initializing│────▶│  Executing  │────▶│  Completed  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   Stopped   │ (异常/超时/用户中断)
                   └─────────────┘
```

每个状态转换都伴随：
- **检查点保存**：序列化当前上下文、工具状态、中间结果
- **事件发射**：`state_changed` 事件推送至可观测性层
- **资源清理**：释放临时文件句柄、网络连接、沙箱实例

### 工具层执行流程

```python
# Harness 工具层伪代码
class ToolHarness:
    def execute(self, tool_call: ToolCall) -> ToolResult:
        # 1. 参数验证 (JSON Schema)
        self.validate_params(tool_call.args)
        # 2. 权限检查 (RBAC/ABAC)
        self.check_permission(tool_call.tool_name, self.agent.trust_level)
        # 3. 沙箱隔离 (高风险工具)
        sandbox = self.get_sandbox(tool_call.risk_level)
        # 4. 执行 + 超时控制
        result = sandbox.run(tool_call, timeout=self.config.timeout)
        # 5. 结果标准化 + 审计日志
        self.audit.log(tool_call, result)
        return self.normalize(result)
```

### 两大基础保障

- **安全层**：梯度化权限模型、沙箱隔离、输入验证防注入、输出过滤、完整审计日志
- **可观测性层**：日志（详细事件序列）、追踪（单请求完整路径，OpenTelemetry 标准）、指标（吞吐量/延迟/错误率）

### 安全权限梯度模型

| 信任等级 | 权限范围 | 升级条件 |
|----------|----------|----------|
| L0 沙箱 | 只读操作、模拟执行 | 初始状态 |
| L1 受限 | 文件读写（限定目录）、API 调用（白名单） | 成功率 >95%，运行 7 天无严重错误 |
| L2 标准 | 数据库写入、外部服务调用 | 成功率 >98%，运行 30 天 |
| L3 特权 | 系统级操作、跨域访问 | 人工审批 + 安全审计通过 |

### 通用参考架构

```
接入层 (CLI / Web API / SDK)
  |
编排层 (任务分解 / 多智能体协调 / 工作流管理)
  |
智能体核心层 (运行时引擎 + 工具层 + 记忆 + 模型集成)
  |    -- 星型拓扑，运行时引擎是唯一协调者
横切关注点 (安全 / 可观测性 / 存储)
```

关键架构事实：模型调用、工具执行、记忆更新不是各自独立的层级，而是在运行时引擎的同一个循环中交替发生。

### 实证验证

Harness 层级改进的效果已被多方验证：
- OpenAI Codex 团队：引入 Harness 层后准确率提升 30-40 个百分点，零模型改进
- LangChain Deep Agents：纯 Harness 改进使 Terminal Bench 从 52.8% 提升到 66.5%
- Anthropic 反向验证：固定模型只改基础设施配置，成功率漂移 +6pp

## 关键设计决策

- **约束优先原则**：首先定义"不能做什么"，然后在约束内赋能。好的约束减少搜索空间、加快执行、提高成功率
- **可验证性原则**：每个行为可观察、可审计、可重放，对抗"暗码"（Dark Code，运行时生成后即消散的行为）
- **渐进信任原则**：从最低信任等级开始，基于量化证据（成功率、运行天数、无严重错误）逐步提升
- **故障假设原则**：主动假设每一步都可能失败，提前设计重试、降级、检查点恢复方案
- **智能体工学原则**：为 Agent（而非人类）设计软件，最小化使用摩擦、最大化信息密度

## 与其他概念的关系

- [[agent-loop]] -- Agent Loop 是 Harness 运行时引擎的核心执行机制
- [[context-engineering]] -- 上下文工程是 Harness 的子系统，决定模型每步"看到什么"
- [[mcp]] -- MCP 协议是 Harness 工具层的标准化接入方式
- [[guardrails]] -- 安全层和权限控制是 Harness 的核心保障
- [[a2a-protocol]] -- 编排引擎通过 A2A 等协议支持多智能体协作
- [[prompt-engineering]] -- Harness 包含提示词管理，但远超提示词工程的范围

## 2026 年 Harness 生态

| 框架/产品 | Harness 层级 | 特色 |
|-----------|--------------|------|
| **Claude Code** | 完整 Harness | 工具沙箱 + 权限梯度 + 审计 |
| **OpenAI Codex** | 完整 Harness | 云沙箱 + 多步规划 |
| **LangGraph Platform** | 编排 + 状态 | 图编排 + 持久化 + 人工审批 |
| **CrewAI Enterprise** | 编排 + 安全 | 角色 SOP + 护栏 |
| **Temporal + Agent** | 持久化执行 | 故障恢复 + 长时运行 |

## 生产最佳实践

1. **先定义约束再赋能**：明确 Agent 不能做什么，比定义能做什么更重要
2. **每步可观测**：OpenTelemetry 贯穿 Agent Loop 每个 Step
3. **沙箱隔离高风险工具**：代码执行、数据库写入必须隔离
4. **渐进信任**：新 Agent 从最低权限开始，基于证据逐步提升
5. **故障假设**：每步都可能失败，预设重试、降级、检查点恢复
6. **幂等设计**：工具执行支持幂等重试，避免副作用累积
7. **上下文压缩**：长对话自动摘要，防止上下文窗口溢出

## 常见反模式

| 反模式 | 症状 | 修复方案 |
|--------|------|----------|
| **裸奔 Agent** | 无 Harness 直接调用 LLM API | 引入最小 Harness（循环+工具+安全） |
| **过度编排** | 简单任务使用复杂 DAG | 单 Agent 优先，必要时才多 Agent |
| **暗码执行** | 运行时生成代码后无法审计 | 强制代码持久化 + 审计日志 |
| **权限膨胀** | Agent 默认拥有所有权限 | 零信任起步，渐进授权 |
| **状态丢失** | 崩溃后无法恢复 | 每步检查点 + 持久化状态机 |

## Harness 成熟度评估

```yaml
# Harness 成熟度自评清单
level_1_basic:
  - agent_loop: "有明确的感知-推理-执行循环"
  - tool_execution: "工具调用有参数验证"
  - error_handling: "基础 try-catch 错误处理"

level_2_production:
  - observability: "OpenTelemetry 追踪 + 结构化日志"
  - security: "权限梯度 + 沙箱隔离"
  - state_management: "检查点 + 故障恢复"

level_3_enterprise:
  - multi_agent: "多智能体编排 + A2A 协议"
  - governance: "完整审计 + 合规报告"
  - self_healing: "自动降级 + 自愈机制"
```

## 关键指标 (KPIs)

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 任务成功率 | >95% | 完整完成任务的比例 |
| 平均循环次数 | <10 | Agent Loop 迭代次数 |
| 工具调用成功率 | >98% | 单次工具执行成功率 |
| 故障恢复时间 | <30s | 从检查点恢复的时间 |
| 安全事件率 | <0.1% | 越权/注入等安全事件 |

## 深入阅读

- [[15_智能体/04_Agent_Harness/Harness_Engineering_Complete_Guide.md]] -- Harness 完整架构与五大设计原则
- [[15_智能体/04_Agent_Harness/Harness_Core_Subsystems.md]] -- 四大核心子系统的工程实现细节
- [[15_智能体/03_Agent_Workflow/AgentOps_Production_Guide.md]] -- Harness 在生产中的故障模式与反模式
- [[16_编程/02_Theory/Claude_Agent_Architecture.md]] -- Claude Code 的 Harness 设计模式
- [[概念/agent-production-deployment]] -- Agent 生产部署系统工程
- [[概念/Agent/agentops|AgentOps]] — Agent 可观测性平台
- [[概念/Agent/agent-framework|Agent 框架总览]] — 主流框架对比
