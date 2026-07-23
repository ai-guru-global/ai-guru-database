---
title: "Learn Claude Code L08：Context Compact — 上下文总会满，要有办法腾地方"
category: 15-agent-production
tags:
  - ai-agents
  - agent-harness
  - claude-code
  - context-window
  - compression
  - memory
sources:
  - "原始/github-sources/learn-claude-code/s08_context_compact/README.md"
  - "https://github.com/shareAI-lab/learn-claude-code"
summary: "Learn Claude Code 第八课：四层压缩管线——snip（裁剪旧对话）、micro（旧工具结果占位）、budget（大结果落盘）、LLM 全量摘要——应对上下文窗口限制。"
provenance:
  extracted: 0.80
  inferred: 0.17
  ambiguous: 0.03
base_confidence: 0.72
lifecycle: draft
lifecycle_changed: 2026-06-12
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Learn Claude Code L08 Context Compact"
  - Learn_Claude_Code_L08_Context_Compact

---
# Learn Claude Code L08：Context Compact — 上下文总会满，要有办法腾地方

> **一句话理解**: 上下文窗口有限，四层压缩策略“便宜的先跑，贵的后跑”：先裁剪旧对话、再占位旧结果、再大结果落盘，最后才让 LLM 做全量摘要。

## 问题

Agent 读了大文件、跑了多轮命令后，`messages` 涨到超过上下文上限，API 返回 `prompt_too_long`，无法继续工作。

## 四层压缩管线

| 层级 | 名称 | 触发条件 | 成本 |
|------|------|----------|------|
| L1 | snip_compact | 消息数 > 50 | 0 API |
| L2 | micro_compact | 旧 tool_result 仍占空间 | 0 API |
| L3 | tool_result_budget | 单条 user 消息 > 200KB | 0 API |
| L4 | compact_history | 前三层后仍超限 | 1 API（LLM 摘要） |

## 各层要点

- **L1 snip_compact**：保留头部 3 条 + 尾部 47 条，中间用占位符替代；注意不能把 `assistant(tool_use)` 和对应的 `user(tool_result)` 拆开 ^[extracted]
- **L2 micro_compact**：只保留最近 3 条 tool_result 完整内容，更旧的替换为占位符 ^[extracted]
- **L3 tool_result_budget**：大 tool_result 落盘到 `.task_outputs/tool-results/`，上下文只留 `<persisted-output>` 标记 + 预览 ^[extracted]
- **L4 compact_history**：保存完整 transcript 到 `.transcripts/`，让 LLM 生成保留目标/发现/已改文件/剩余工作的摘要 ^[extracted]

## 设计原则

- 教学版只演示策略框架，真实 Claude Code 的压缩更复杂（保留 cache 边界、prompt cache 友好）^[inferred]
- 压缩是有损的，s09 的记忆系统用于保留不应丢失的细节

## 关联阅读

- [[学习/courses/share_ai/learn_claude_code]] — 完整 20 课映射
- [[学习/Courses/share_ai/learn_claude_code]] — 仓库引用索引
- [[智能体/Course_Notes/Learn_Claude_Code_L09_Memory_System]] — 记忆系统
- [[智能体/Memory_Infrastructure/Agent_Memory_Systems_2026]] — Agent 记忆系统 2026

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

## 核心技术栈对比

| 技术层 | 方案A | 方案B | 方案C | 选型建议 |
|--------|-------|-------|-------|----------|
| 推理引擎 | 自研循环 | ReAct框架 | Plan-and-Execute | 复杂任务用Plan |
| 记忆系统 | 向量数据库 | KV缓存 | 混合存储 | 长期用向量库 |
| 工具调用 | Function Call | MCP协议 | 自定义API | 标准化用MCP |
| 编排层 | 状态机 | DAG工作流 | 动态规划 | 确定性用DAG |
| 评估层 | 单元测试 | E2E测试 | 人工评审 | 组合使用 |
| 部署层 | 容器化 | Serverless | 混合部署 | 高并发用Serverless |

## 架构设计原则

| 原则 | 说明 | 实践 |
|------|------|------|
| 模块化 | 功能解耦独立演进 | 插件化架构+接口抽象 |
| 可观测 | 全链路追踪可审计 | Trace/Metrics/Logging |
| 容错性 | 单点故障不影响全局 | 重试+熔断+降级 |
| 可扩展 | 水平扩展无瓶颈 | 无状态设计+消息队列 |
| 安全性 | 最小权限+沙箱隔离 | RBAC+输入验证 |
| 可测试 | 各层独立可测 | Mock+契约测试 |

## 性能优化策略

| 策略 | 效果 | 适用场景 |
|------|------|----------|
| 提示词缓存 | 减少重复计算30-50% | 多轮对话/固定前缀 |
| 并行工具调用 | 延迟降低40-60% | 独立工具无依赖 |
| 流式输出 | 首token延迟降低80% | 用户交互场景 |
| 模型路由 | 成本降低50-70% | 简单/复杂任务分流 |
| 上下文压缩 | Token消耗降低60% | 长对话/大文档 |
| 批处理 | 吞吐量提升3-5x | 离线评估/数据处理 |

## 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| Agent循环不终止 | 停止条件不明确 | 设置最大步数+明确终止条件 |
| 工具调用失败 | 参数格式/权限问题 | 增加参数验证+错误重试 |
| 上下文溢出 | 对话过长超出窗口 | 摘要压缩+滑动窗口 |
| 幻觉输出 | 知识不足/提示不当 | RAG增强+事实验证 |
| 响应过慢 | 模型/网络瓶颈 | 模型降级+缓存+并行 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础架构 | 1周 | 理解Agent范式 |
| 基础 | 单Agent实现+工具调用 | 2周 | 可运行原型 |
| 进阶 | 多Agent协作+记忆系统 | 2-3周 | 完整系统 |
| 实战 | 生产部署+评估优化 | 3-4周 | 生产级应用 |
| 精通 | 架构设计+前沿研究 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| ReAct | Reasoning+Acting交替执行范式 |
| Tool Use | Agent调用外部工具的能力 |
| Context Window | 模型单次可处理的token上限 |
| Chain-of-Thought | 逐步推理增强输出质量 |
| Orchestration | 多Agent/步骤的编排调度 |
| Grounding | 将输出锚定到事实/数据源 |
| Hallucination | 模型生成不存在的信息 |
| Agentic Loop | Agent的感知-思考-行动循环 |

## 知识图谱关联

| 关联主题 | 关系 | 参考路径 |
|----------|------|----------|
| Agent基础理论 | 前置知识 | 智能体/Agent_Foundations/ |
| 框架与工具 | 实现支撑 | 智能体/Agent_Frameworks/ |
| 评估与测试 | 质量保障 | 智能体/Agent_Evaluation/ |
| 协议与标准 | 互操作基础 | 智能体/Agent_Protocols/ |
| 生产部署 | 运维实践 | 智能体/Enterprise_Agent/ |
| 记忆系统 | 核心能力 | 智能体/Memory_Infrastructure/ |
| 工作流编排 | 执行引擎 | 智能体/Agent_Workflow/ |
| 技能扩展 | 能力增强 | 智能体/Agent_Skills/ |

## 版本与更新记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2025-01 | 初始版本创建 |
| v1.1 | 2025-06 | 补充技术对比和最佳实践 |
| v2.0 | 2026-01 | 全面扩写深化+结构化增强 |
| v2.1 | 2026-07 | 质量强化：补充FAQ/术语表/检查清单 |
