---
title: "Agent Skill 通用参考规范"
category: references
tags: ["agent", "skill", "spec", "reference", "best-practices"]
summary: "Agent Skill 文档的文件结构、元数据、引用约定与最佳实践参考。"
created: 2026-07-02
updated: 2026-07-02
sources: []
---

# Agent Skill 通用参考规范

本规范为 `15_智能体/05_Agent_Skills/` 下的 Skill 文档提供统一的文件结构、元数据、引用约定与最佳实践，确保 Skill 定义可被 Agent 框架、自动化工具与人工审阅一致地解析和使用。

## 文件结构

每个 Skill 文档建议使用以下分层结构：

1. **Frontmatter**：YAML 元数据，包含 title、category、tags、summary、created、updated、version、author 等字段。
2. **概述**：用 2-4 句话说明 Skill 解决什么问题、输入输出是什么、适用场景。
3. **接口定义**：列出参数、返回值、类型与约束，优先使用表格呈现。
4. **示例**：至少一个可运行的最小示例，包含输入、调用与输出。
5. **错误处理**：常见异常、错误码与降级策略。
6. **依赖与引用**：依赖的其他 Skill、工具、模型或外部 API。
7. **版本与变更**：版本号、变更日志、兼容性说明。

## 元数据约定

Frontmatter 字段应保持一致：

- `title`：Skill 中文或英文名称，避免缩写。
- `category`：固定为 `agent-skills` 或所属子分类，如 `agent-skills/reasoning`。
- `tags`：3-8 个关键词，覆盖功能、领域、技术栈。
- `summary`：一句话描述，不超过 120 字。
- `created` / `updated`：ISO 日期 `YYYY-MM-DD`。
- `version`：语义化版本，如 `1.2.0`。
- `authors`：维护者列表，可选。
- `status`：`draft`、`stable`、`deprecated` 之一。

## 字段类型与命名

参数命名采用 `snake_case`，避免与编程语言关键字冲突。常用类型：

- `string`：文本输入，建议附加 `max_length` 与格式约束。
- `number` / `integer`：数值，需标注单位、精度与取值范围。
- `boolean`：仅用于明确的开关语义。
- `enum`：有限选项，必须列出所有合法值及其含义。
- `datetime`：统一为 ISO 8601，如 `2026-07-02T14:58:54+08:00`。
- `filepath`：相对路径优先，避免硬编码绝对路径。
- `json`：复杂对象应给出 JSON Schema 或示例。

## 引用约定

- 引用知识库内部页面使用 Obsidian wikilink：`[[15_智能体/05_Agent_Skills/README|Agent Skills]]`。
- 引用外部资源使用 Markdown 标准链接，并注明访问日期：`[OpenAI API](https://platform.openai.com/docs) (访问于 2026-07-02)`。
- 引用其他 Skill 时使用相对路径或 wikilink，确保在移动文件后不中断。
- 避免使用裸 URL，统一用链接文本描述目标内容。

## 最佳实践

- **单一职责**：一个 Skill 只做一件事，复杂流程拆分为多个子 Skill。
- **可测试性**：每个 Skill 提供测试用例，覆盖正常路径、边界条件与异常路径。
- **幂等性**：相同输入应产生相同输出，避免副作用不可预期。
- **最小权限**：调用外部 API 时仅申请必要的权限与范围。
- **文档与代码同步**：接口变更时同步更新文档版本号与示例。
- **可观测性**：关键步骤记录日志，输出包含 trace_id 或类似追踪标识。
- **向后兼容**：破坏性变更必须通过 major 版本升级，并在文档中标注迁移路径。

## 示例 Frontmatter

```yaml
---
title: "文本摘要 Skill"
category: agent-skills
tags: ["nlp", "summarization", "llm"]
summary: "对长文本生成结构化摘要，支持指定输出长度与风格。"
created: 2026-07-02
updated: 2026-07-02
version: "2.0.0"
status: stable
---
```

## Related

- [[15_智能体/05_Agent_Skills/README|Agent Skills]]
- [[90_学习/References/index|References Index]]
- [[15_智能体/05_Agent_Skills/Common_Field_Types|Common Field Types]]
- [[01_数学基础/03_Probability_Statistics/Skill_Statistics_Cheatsheet|Statistics]]
- [[15_智能体/05_Agent_Skills/Skill_Migration_v1_to_v2|Migration v1 to v2]]

## 附录：核心概念速查

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| Agent Loop | 感知-思考-行动循环 | 核心执行流程 |
| Tool Use | 调用外部工具/API | 扩展能力 |
| Memory | 短期/长期记忆 | 上下文维护 |
| Planning | 任务分解与排序 | 复杂任务 |
| Reflection | 自我评估改进 | 质量提升 |
| Multi-Agent | 多Agent协作 | 分布式任务 |

## 附录：技术栈对比

| 框架/工具 | 特点 | 适用场景 | 成熟度 |
|----------|------|----------|--------|
| LangChain | 链式调用 | 通用Agent | ★★★★☆ |
| LangGraph | 图结构编排 | 复杂流程 | ★★★★☆ |
| AutoGen | 多Agent对话 | 协作任务 | ★★★★☆ |
| CrewAI | 角色分工 | 团队模拟 | ★★★☆☆ |
| OpenAI SDK | 官方框架 | 快速原型 | ★★★★☆ |
| Semantic Kernel | 企业级 | .NET/Java | ★★★★☆ |

## 附录：学习路径

| 阶段 | 推荐内容 | 目标 |
|------|----------|------|
| 入门 | 基础概念文档 | 理解Agent |
| 进阶 | 本文档深度内容 | 掌握技术 |
| 实践 | 动手项目 | 构建应用 |
| 前沿 | 最新论文/产品 | 跟踪发展 |

## 附录：常见问题

| 问题 | 解答 |
|------|------|
| Agent和Chatbot的区别？ | Agent能自主决策+使用工具+持续执行 |
| 需要什么前置知识？ | LLM基础+编程+系统设计 |
| 如何评估Agent？ | 任务完成率+效率+安全性 |
| 2026年趋势？ | 多Agent协作/企业级/具身智能 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 智能体 | Agent | 自主决策AI系统 |
| 工具调用 | Tool Use | 使用外部工具 |
| 记忆 | Memory | 上下文/历史 |
| 规划 | Planning | 任务分解 |
| 反思 | Reflection | 自我评估 |
| 编排 | Orchestration | 流程管理 |
| 协议 | Protocol | 通信标准 |
| 护栏 | Guardrails | 安全约束 |

## 附录：检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 理解核心概念 | Agent架构 | ☐ |
| 掌握工具调用 | MCP/Function Calling | ☐ |
| 了解记忆机制 | 短期/长期 | ☐ |
| 理解规划推理 | CoT/ReAct | ☐ |
| 动手实践 | 构建Agent | ☐ |
| 了解评估方法 | 质量度量 | ☐ |

> 💡 智能体是AI从"对话"走向"行动"的关键跨越。掌握Agent开发，是2026年AI工程师的核心竞争力。

---
*Last updated: 2026-07-21*

## 关键技术对比

| 维度 | 方案一 | 方案二 | 方案三 | 适用场景 |
|------|--------|--------|--------|----------|
| 架构模式 | 单体Agent | 多Agent协作 | 层级Agent | 按复杂度选择 |
| 通信方式 | 直接调用 | 消息队列 | 事件驱动 | 按耦合度选择 |
| 状态管理 | 内存存储 | 外部数据库 | 分布式缓存 | 按持久性选择 |
| 错误处理 | 重试机制 | 补偿事务 | 人工介入 | 按严重性选择 |
| 扩展策略 | 垂直扩展 | 水平扩展 | 弹性伸缩 | 按负载选择 |

## 最佳实践清单

| 实践 | 说明 | 优先级 |
|------|------|--------|
| 明确任务边界 | Agent职责单一不越界 | P0 |
| 结构化输出 | 使用JSON Schema约束 | P0 |
| 全链路日志 | 记录每步决策依据 | P0 |
| 超时控制 | 每步设置合理超时 | P1 |
| 回退机制 | 失败时优雅降级 | P1 |
| 成本监控 | 跟踪Token消耗 | P1 |
| 定期评估 | 持续监控质量指标 | P2 |
| 版本管理 | 提示词/配置版本化 | P2 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何选择合适的模型? | 根据任务复杂度：简单任务用小模型降本，复杂推理用大模型保质 |
| Agent何时停止? | 设置明确终止条件：任务完成/达到最大步数/超时/用户中断 |
| 如何防止幻觉? | RAG增强+事实验证+结构化输出约束+多轮确认 |
| 多Agent如何协调? | 明确角色分工+共享状态+消息传递+冲突解决机制 |
| 如何评估Agent质量? | 任务完成率+推理正确性+工具使用准确率+用户满意度 |

## 术语速查

| 术语 | 含义 |
|------|------|
| Agentic | 具有自主决策和行动能力的AI系统特征 |
| Orchestration | 多组件/Agent的协调编排 |
| Grounding | 将AI输出锚定到真实数据/事实 |
| Tool Calling | Agent调用外部API/函数的能力 |
| Reflection | Agent对自身输出的自我评估和改进 |
| Planning | Agent将复杂任务分解为子步骤 |
| Memory | Agent跨会话保持信息的机制 |
| Guardrails | 限制Agent行为的安全护栏 |
