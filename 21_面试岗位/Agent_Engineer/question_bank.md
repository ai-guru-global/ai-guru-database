---
title: Agent Engineer 题库 (Agent Engineer Question Bank)
category: "18-interview-agent-engineer"
tags: ["interview", "question-bank", "agent", "LLM-agent", "tool-use", "planning", "multi-agent", "ReAct"]
summary: "**一句话概括**: Agent Engineer 面试题库，覆盖 Agent 架构、规划、工具调用、多智能体、记忆系统、评估调试等核心方向，含基础/进阶/场景/系统设计/行为题。"
created: "2026-07-23"
updated: "2026-07-23"
tier: core
sources: []
---

# Agent Engineer 题库

> 覆盖 LLM Agent 工程化的核心知识点。关联 [[21_面试岗位/Agent_Engineer/Agent_Engineer_2026|Agent Engineer 2026]] 与 [[15_智能体/index|智能体]] 章节。

---

## Agent 基础理论 (10 题)

1. 什么是 LLM Agent？它与传统 chatbot/RAG 系统的本质区别是什么？
2. 解释 ReAct（Reasoning + Acting）范式，它如何让 LLM 边推理边行动？
3. Agent 的核心组件有哪些？（规划器/记忆/工具/执行器）各自职责？
4. 什么是 function calling / tool use？它与传统的 API 调用有何不同？
5. 比较 Plan-and-Execute 与 ReAct 两种 Agent 范式的优劣。
6. 什么是 Chain-of-Thought（CoT）和 Tree-of-Thought（ToT）？它们在 Agent 规划中的作用？
7. Agent 的"自主性"分几个等级？从 L0 到 L5 分别是什么？
8. 解释 Agent loop 的基本流程：感知 → 规划 → 行动 → 观察 → 反思。
9. 什么是 agentic workflow？它与 single-turn LLM 调用的区别？
10. Reflexion / Self-Refine 等自我反思机制如何提升 Agent 表现？

## 规划与推理 (8 题)

11. 如何让 Agent 处理需要多步骤的复杂任务？任务分解（decomposition）有哪些策略？
12. Agent 在长程任务中容易"跑偏"，如何保证目标对齐？
13. 比较 linear planning、DAG planning、adaptive planning 的适用场景。
14. 当 Agent 的某一步行动失败时，如何设计重试/回退/重新规划机制？
15. 如何评估 Agent 的规划质量？有哪些自动评估方法？
16. Token 预算有限时，如何平衡"想清楚再行动"与"快速试错"？
17. Agent 如何处理需要等待外部条件（异步事件）的任务？
18. 什么是 sub-agent / 嵌套 Agent？何时该用？

## 工具调用 (8 题)

19. 设计一个让 LLM 正确选择并调用工具的系统，关键挑战有哪些？
20. 工具描述（tool description）应该怎么写才能提高调用准确率？
21. 如何处理 Agent 传错参数、调用不存在的工具、参数类型错误？
22. 多个工具功能重叠时，Agent 如何消歧？
23. 如何让 Agent 处理需要鉴权/副作用的工具（如发邮件、转账）？
24. 设计一个"代码执行"工具的安全沙箱方案。
25. MCP（Model Context Protocol）是什么？它如何标准化工具接入？
26. 如何让 Agent 动态发现并学习新工具（runtime tool learning）？

## 记忆系统 (7 题)

27. Agent 的记忆分哪些类型？（短期/长期/情景/语义/程序性）
28. 如何设计 Agent 的长期记忆？向量数据库 vs 知识图谱 vs 结构化存储？
29. 上下文窗口有限时，如何管理对话历史？（摘要/检索/遗忘策略）
30. 什么是 Agent 的"工作记忆"？它与大模型 KV Cache 的关系？
31. 如何让 Agent 跨会话记住用户偏好和历史任务？
32. 记忆污染（错误信息写入记忆）如何检测与修复？
33. 设计一个 RAG-enhanced Agent，如何决定何时检索、检索什么？

## 多智能体系统 (7 题)

34. 多 Agent 协作的常见拓扑有哪些？（hub-spoke / pipeline / debate / swarm）
35. 何时该用多 Agent 而非单 Agent？过度拆分的风险？
36. Agent 间如何通信？共享黑板模式 vs 直接消息传递的优劣。
37. 设计一个"代码开发"多 Agent 系统（PM + 架构师 + 编码 + 测试 + 评审），如何分工？
38. 多 Agent 中的冲突如何解决？共识机制设计。
39. Agent 编排框架（LangGraph / CrewAI / AutoGen / OpenAI Swarm）的对比与选型。
40. 如何评估多 Agent 系统的整体表现？端到端 vs 单 Agent 指标。

## 评估与调试 (7 题)

41. Agent 评估为什么比传统 ML 更难？非确定性、长轨迹、复合错误。
42. 常见的 Agent 评估基准有哪些？（AgentBench / WebArena / SWE-bench / τ-bench）
43. 如何设计 Agent 的离线评估（固定任务集）与在线评估（真实用户）？
44. Agent 出错时如何定位是规划问题、工具问题还是底层模型问题？
45. 如何做 Agent 的 trace/可观测性？（步骤日志/状态快照/回放）
46. LLM-as-Judge 评估 Agent 输出的局限与改进？
47. 如何对 Agent 做 A/B 测试？非确定性下的统计显著性。

## 系统设计 (6 题)

48. **设计一个能自主浏览网页完成购物任务的 Agent**。需考虑：页面理解、表单填写、支付安全、异常处理。
49. **设计一个企业级客服 Agent**，能查询订单、处理退款、升级人工。SLA、并发、成本如何控制？
50. **设计一个数据分析 Agent**，用户用自然语言提问，Agent 自动取数、分析、可视化、生成报告。
51. **设计一个代码 Agent（如 SWE-agent）**，能读懂代码库、定位 bug、提交 PR。如何评价其改动质量？
52. **设计一个多模态 Agent**，能看图、听语音、操作 GUI。延迟、模态对齐如何处理？
53. **设计 Agent 的成本控制机制**：如何在保证任务完成率的同时控制 token 消耗和 API 费用？

## 工程实践 (6 题)

54. 如何做 Agent 的 prompt 版本管理与回归测试？
55. Agent 在生产环境如何做灰度发布？非确定性输出怎么灰度？
56. 如何监控线上 Agent 的表现？关键指标有哪些？（任务完成率/步数/成本/延迟）
57. Agent 涉及敏感操作时，如何设计 human-in-the-loop 审批机制？
58. 如何防止 Agent 被注入攻击（prompt injection / 间接注入）？
59. Agent 的"幻觉"导致执行错误操作，如何兜底与回滚？

## 行为面试 (5 题)

60. 描述你做过的最有挑战的 Agent 项目，核心难点与你的贡献。
61. Agent 效果不达预期时，你如何系统性地排查和优化？
62. 你如何看待 Agent 的可靠性问题？在不可靠基础上如何构建可靠产品？
63. 团队对 Agent 架构有分歧（如多 Agent vs 单 Agent），你如何推动决策？
64. 你如何跟上 Agent 领域快速演进（论文/框架几乎每周更新）？

## 16_编程/实操题方向 (4 题)

65. 用 LangGraph（或选定的框架）实现一个 ReAct Agent，能调用计算器和搜索两个工具。
66. 实现一个带向量记忆的对话 Agent，支持跨会话记忆检索。
67. 实现一个简单的多 Agent debate 系统，两个 Agent 针对一个问题辩论 N 轮后输出共识。
68. 为一个给定 Agent 实现 trace 日志 + 离线评估脚本，计算任务完成率和平均步数。

---

## Related

- [[21_面试岗位/Agent_Engineer/Agent_Engineer_2026|Agent Engineer 2026 指南]]
- [[21_面试岗位/Interview_Guide/index|面试总指南]]
- [[15_智能体/index|智能体章节]]
- [[15_智能体/02_Agent_Frameworks/index|Agent 框架]]
- [[10_部署推理/index|部署推理]]（Agent 底层依赖推理服务）
- [[14_RAG系统/index|RAG 系统]]（Agent 记忆的基础）

---

*题库版本: 2026-07-23。共 68 题，覆盖 8 大方向。*
