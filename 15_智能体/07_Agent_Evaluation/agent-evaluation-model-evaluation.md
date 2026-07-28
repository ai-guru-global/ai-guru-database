---
title: "Agent 评估 × 模型评估 — 从指标到行为的评估范式迁移"
category: -synthesis
tags: [agent-evaluation, model-evaluation, benchmark, evaluation, llm-as-judge, agentic-ai]
sources:
  - "[[15_智能体/07_Agent_Evaluation/Assessment/Evaluation_Workflow]]"
  - "[[08_模型评估/Model_Evaluation]]"
  - "[[08_模型评估/04_Evaluation_Tools/LLM_as_Judge_Deep_Dive]]"
  - "[[08_模型评估/02_Benchmarks/Agentic_Benchmark_Guide]]"
created: 2026-06-05
updated: 2026-06-05
summary: "传统模型评估关注'输出是否正确'，Agent 评估关注'行为是否达成目标'。两者交汇催生了 LLM-as-Judge、过程奖励、轨迹评估等新范式。"
provenance:
  extracted: 0.2
  inferred: 0.7
  ambiguous: 0.1
lifecycle: draft
lifecycle_changed: 2026-06-05
tier: core
aliases:
  - "Agent Evaluation Model Evaluation"
  - "agent evaluation model evaluation"

name_zh: "Agent 评估 × 模型评估 — 从指标到行为的评估范式迁移"
---
# Agent 评估 × 模型评估 — 从指标到行为的评估范式迁移

> 中文简称：Agent 评估 × 模型评估 — 从指标到行为的评估范式迁移

## The Connection

传统模型评估（Model Evaluation）建立在**确定性输入-输出映射**的假设上：给定 prompt，模型输出 token 序列，用 BLEU/ROUGE/accuracy 衡量质量。但 AI Agent 打破了这个假设——Agent 的输出不是一次性的，而是**多步骤的行为轨迹**（工具调用、推理链、环境交互），评估对象从"单次输出"变成了"整个决策过程"。

## Where They Co-occur

- **LLM-as-Judge**：用强模型评估弱模型的输出，既用于传统 LLM 评估（MT-Bench），也用于 Agent 轨迹评分
- **Benchmark 设计**：SWE-bench（代码 Agent）、GAIA（通用 Agent）、BFCL（函数调用）都借鉴了传统 benchmark（MMLU、HumanEval）的方法论
- **在线评估**：A/B 测试从"模型 A vs B 的指标对比"演进为"Agent A vs B 的任务完成率对比"
- **安全评估**：Red-teaming 从"对抗 prompt"扩展为"对抗 Agent 行为链"

## Cross-cutting Insight

Agent 评估不是模型评估的简单扩展，而是一次**范式迁移**：

| 维度 | 传统模型评估 | Agent 评估 |
|------|-------------|-----------|
| 评估对象 | 单次输出 | 多步行为轨迹 |
| 成功标准 | 输出正确性 | 目标达成率 |
| 评估方法 | 自动化指标 + 人工标注 | LLM-as-Judge + 过程奖励模型 |
| 基准设计 | 固定 QA 对 | 交互式环境 + 动态场景 |
| 失败分析 | 错误分类 | 失败点定位（哪一步出错） |
| 回归测试 | 模型版本对比 | 策略版本 + 环境版本对比 |

核心洞察：**Agent 评估 = 模型评估 × 环境评估 × 策略评估**。三者耦合使得评估复杂度呈指数增长，这解释了为什么 SWE-bench 等 Agent benchmark 的构建成本远高于 MMLU。

## Tensions and Trade-offs

| 张力 | 说明 |
|------|------|
| **确定性 vs 随机性** | 传统评估要求可复现，但 Agent 行为因工具调用、环境状态而天然不确定 |
| **自动化 vs 人类判断** | Agent 的"好行为"难以自动量化——需要人类判断"这个决策过程是否合理" |
| **单元 vs 集成** | 模型评估类似单元测试（单模块），Agent 评估类似集成测试（多模块协作），两者需要分层 |
| **成本 vs 覆盖** | Agent 评估需要真实环境交互（API 调用、代码执行），成本远高于静态 benchmark |

## Open Questions

- 如何设计 Agent 的"过程奖励模型"（Process Reward Model）来评估中间步骤质量，而非只看最终结果
- 能否将传统模型评估的 calibration 方法应用于 Agent——让 Agent 的置信度与实际成功率对齐
- Agent 回归测试中如何处理环境版本漂移（API 变更、数据库状态变化）

## Related

- [[15_智能体/07_Agent_Evaluation/Assessment/Evaluation_Workflow]] — Agent 评估工作流
- [[08_模型评估/Model_Evaluation]] — 模型评估基础
- [[08_模型评估/04_Evaluation_Tools/LLM_as_Judge_Deep_Dive]] — LLM-as-Judge 深度解读
- [[08_模型评估/02_Benchmarks/Agentic_Benchmark_Guide]] — Agent 评估基准指南
- [[08_模型评估/04_Evaluation_Tools/Online_Evaluation]] — 在线评估方法
- [[治理/benchmark-evaluation]] — 评测基准 × 评测方法论

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

## 知识图谱关联

| 关联主题 | 关系 | 参考路径 |
|----------|------|----------|
| Agent基础理论 | 前置知识 | 15_智能体/01_Agent_Foundations/ |
| 框架与工具 | 实现支撑 | 15_智能体/02_Agent_Frameworks/ |
| 评估与测试 | 质量保障 | 15_智能体/07_Agent_Evaluation/ |
| 协议与标准 | 互操作基础 | 15_智能体/Agent_Protocols/ |
| 生产部署 | 运维实践 | 15_智能体/10_Enterprise_Agent/ |
| 记忆系统 | 核心能力 | 15_智能体/06_Memory_Infrastructure/ |
| 工作流编排 | 执行引擎 | 15_智能体/03_Agent_Workflow/ |
| 技能扩展 | 能力增强 | 15_智能体/05_Agent_Skills/ |

## 版本与更新记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2025-01 | 初始版本创建 |
| v1.1 | 2025-06 | 补充技术对比和最佳实践 |
| v2.0 | 2026-01 | 全面扩写深化+结构化增强 |
| v2.1 | 2026-07 | 质量强化：补充FAQ/术语表/检查清单 |
