---
title: "AI Guardrails (AI 护栏)"
tags: [guardrails, llm-security, agent-harness, input-validation, output-moderation, hitl]
created: 2026-06-17
---

# AI Guardrails (AI 护栏)

## 定义

AI Guardrails 是围绕 LLM 和智能体系统构建的多层安全防护体系，通过输入过滤、输出审核、工具权限控制、沙箱隔离和人工审批等机制，确保 AI 系统在可控边界内运行。护栏不是单一功能模块，而是渗透在系统架构各层的安全非功能属性。

## 核心机制

### 输入输出过滤

**多层输入验证架构**：

```
格式验证 -> 长度检查 -> 编码规范化 -> 模式检测 -> 语义分析
```

| 验证层次 | 技术 | 目标 |
|----------|------|------|
| 格式验证 | Schema 校验、类型检查 | 确保输入结构合法 |
| 长度限制 | Token 数上限 | 防止资源耗尽攻击 |
| 编码规范化 | Unicode 归一化 | 防止编码混淆绕过 |
| 模式检测 | 正则匹配、注入特征库 | 拦截已知注入模式 |
| 语义分析 | ML 分类器、意图识别 | 检测语义层恶意意图 |

**输出审核模式**：
- **实时审核**：逐条检查，适合高安全场景（延迟较高）
- **异步审核**：先返回后检查，适合低风险场景
- **多级审核**：规则 -> ML 模型 -> 人工，逐级深入

### 工具调用策略

**权限分级与最小权限原则**：

| 类别 | 典型工具 | 默认策略 |
|------|---------|---------|
| 只读查询 | 搜索、读取 | 默认允许 |
| 有副作用写入 | 写入、编辑 | 默认拒绝，按需放开 |
| 执行/命令类 | exec、process | 默认拒绝，最小范围放开 |
| 交互自动化 | browser、canvas | 默认拒绝 |

**策略流水线**：profile -> 全局策略 -> agent 策略 -> 渠道策略 -> sandbox 策略。每层内部 deny 优先。

**工具链权限提升防御**：检测多工具组合的危险模式（如"读敏感文件 + 发送邮件"不能同时拥有）。

### 沙箱隔离设计

执行隔离粒度从低到高：

1. **异常捕获**：try-catch 级别的错误隔离
2. **进程隔离**：独立进程执行，防止资源竞争
3. **容器隔离**：Docker / gVisor 沙箱
4. **系统级沙箱**：Docker + seccomp + Bubblewrap，完整的环境隔离

### Human-in-the-Loop (HITL) 审批

| 风险等级 | 操作示例 | 人工干预 |
|----------|----------|----------|
| 低 | 读取公开信息 | 无需确认 |
| 中 | 发送内部邮件 | 可选确认 |
| 高 | 修改数据库 | 必须确认 |
| 极高 | 执行系统命令 | 多人确认 |

HITL 设计原则：渐进式授权、可解释性、最小打扰、批量确认。

### 结构化输出验证

生产环境中不能只依赖 Prompt + 事后校验。现代推理引擎在生成循环底层引入：

- **有限状态机 (FSM)** 或 **正则表达式** 约束输出格式
- **Logits Masking**：动态屏蔽不合规词汇
- 从物理层面提供 Schema Reliability，且不拖累原生吞吐

四步防御流程：格式解析 -> 自愈修复 -> 语义验证 -> 安全检查。

## 关键设计决策

- **纵深防御 vs 单点防护**：七层架构确保单层失效不导致全局崩溃——边界防护、输入安全、上下文安全、模型安全、工具安全、输出安全、运营安全
- **Rule of Two（Meta 2025）**：单个 Agent 最多同时满足三类高风险能力（处理不可信输入 / 访问敏感数据 / 改变状态）中的两项，三项都需要时必须引入监督或独立验证
- **安全 > 功能 > 体验**：Fallback 优先级——宁可降级功能也不突破安全边界
- **护栏配置 vs 提示词约束**：安全边界必须由工具策略和沙箱在执行层物理拦截，不能只写在提示词里
- **必备护栏参数**：max_steps（最大步数）、token_budget（Token 预算）、连续重复检测、成本熔断

## 与其他概念的关系

- [[prompt-injection]] -- 输入验证和上下文隔离是防御注入攻击的核心护栏
- [[hallucination]] -- 输出验证门控和事实性检查是检测和拦截幻觉的关键防线
- [[agent-harness]] -- 安全层和权限控制是 Harness 五大子系统的横切关注点
- [[agent-loop]] -- max_steps、token_budget、成本熔断都是循环级别的护栏
- [[mcp]] -- MCP Server 的工具策略（allow/deny）和沙箱隔离是护栏的具体实现
- [[context-engineering]] -- 边界泄漏防御和上下文隔离是上下文工程中的安全护栏
- [[rlhf]] -- RLHF 安全对齐是模型层护栏，与系统层护栏互补但可被绕过

## 深入阅读

- [[17_Ethics_Safety/LLM_Security_Defense_Guide.md]] -- 纵深防御架构、I/O 防护与 Constitutional Classifiers
- [[17_Ethics_Safety/LLM_Security_Complete_Guide.md]] -- OWASP LLM Top 10 与攻击技术全景
- [[17_Ethics_Safety/Agent_RAG_Security.md]] -- 智能体安全设计原则、Rule of Two 与多智能体安全架构
- [[15_Agent_Production/Agent_Harness/Harness_Engineering_Complete_Guide.md]] -- Harness 安全层与渐进信任原则
- [[15_Agent_Production/Agent_Workflow/AgentOps_Production_Guide.md]] -- 护栏缺失的反模式与故障模式
