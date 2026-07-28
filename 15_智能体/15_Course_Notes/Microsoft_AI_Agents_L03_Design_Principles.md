---
title: "L03 Agentic 设计原则：Space / Time / Core 三维框架"
category: "15-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - agentic-design-principles
  - hax
  - human-centric-ux
  - trust
sources:
  - "原始/github-sources/ai-agents-for-beginners/03-agentic-design-patterns/README.md"
summary: "Microsoft AI Agents 课程第3课：以人为中心的 Agentic 设计三原则——空间(Space)、时间(Time)、核心(Core)，以及透明度/可控/一致三大实施指南。"
provenance:
  extracted: 0.85
  inferred: 0.12
  ambiguous: 0.03
base_confidence: 0.83
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: supporting
created: 2026-06-15
updated: 2026-06-15
aliases:
  - "Microsoft Ai Agents L03 Design Principles"
  - "Microsoft AI Agents L03 Design Principles"
  - Microsoft_AI_Agents_L03_Design_Principles

name_zh: "L03 Agentic 设计原则：Space / Time / Core 三维框"
---
# L03 Agentic 设计原则：Space / Time / Core 三维框架

> 中文简称：L03 Agentic 设计原则：Space / Time / Core 三维框

> 来源：[Microsoft AI Agents for Beginners / 03-agentic-design-patterns](https://github.com/microsoft/ai-agents-for-beginners/tree/main/03-agentic-design-patterns)

> ⚠️ 本课名虽叫 "design-patterns"，实际讲的是 **human-centric UX 设计原则**（不是 GoF/Andrew Ng 那种工程模式）。不要和 [[15_智能体/01_Agent_Foundations/Agentic_Design_Patterns_AndrewNg]] 混淆。

## 学习目标

完成本课后，你将能够：

1. 解释 Agentic 设计三原则的内涵
2. 应用透明度/可控/一致性三大实施指南
3. 用原则指导一个真实 Agent（如 Travel Agent）的设计

---

## 为什么需要"设计原则"

生成式 AI 的模糊性是特性而非缺陷——工程师面对 Agentic 系统往往不知从何入手。Microsoft 提出**以人为中心**的设计原则作为起点（不是规定性架构），目标是让 Agent：

- 扩展人类能力（头脑风暴、自动化）
- 弥补知识缺口（领域知识、翻译）
- 促进按个人偏好协作
- 让人成为"更好的自己"（教练、正念、韧性）^[inferred]

---

## 三维原则框架

| 维度 | 含义 | 核心要求 |
|------|------|----------|
| **Agent (Space)** | Agent 运行的环境 | Connecting not collapsing；易触达但适度隐形 |
| **Agent (Time)** | Agent 跨时间运作的方式 | 过去反思 / 当下轻推 / 未来进化 |
| **Agent (Core)** | Agent 设计的核心要素 | 拥抱不确定性，但建立信任 |

### Space 维度

- **Connecting, not collapsing** —— Agent 应连接人、事件、知识，**不是替代或贬低人** ^[inferred]
- **Easily accessible yet occasionally invisible** —— 已授权用户在任何设备都能找到它；支持多模态输入输出；可前台/后台无缝切换；后台路径对用户透明可控

### Time 维度

- **Past**: 基于丰富历史数据（不只是事件/人/状态）提供更相关结果；主动反思记忆以服务当下
- **Now**: Nudging 而非 notifying——不只是静态通知，而是简化流程、动态生成线索、根据语境/文化/意图定制
- **Future**: 适应设备/平台/模态；适应用户行为与可访问性需求；通过持续交互进化

### Core 维度

- **Embrace uncertainty but establish trust** —— Agent 不确定性是设计要素而非缺陷；信任与透明是底层基础；人类掌控开关，状态始终可见

---

## 三大实施指南

| 指南 | 落地要求 |
|------|----------|
| **Transparency（透明）** | 告知用户 AI 介入、运作方式（含过往行为）、如何反馈与修改 |
| **Control（可控）** | 用户可定制偏好、个性化系统属性，**包括"被遗忘权"** |
| **Consistency（一致）** | 跨设备/端点提供一致的多模态体验；用熟悉的 UI 元素（如麦克风图标）；减少认知负载（简洁回复、视觉辅助、"Learn More"分层） |

---

## 案例：用原则设计 Travel Agent

| 原则 | 设计落地 |
|------|----------|
| Transparency | 产品页明示"这是 AI Agent"；提供 Hello 引导与示例 prompt；展示历史 prompt；明确反馈通道（👍👎 / Send Feedback）；标注使用限制 |
| Control | 用户可改 System Prompt；可调详尽程度/写作风格/禁忌话题；可查看与删除关联文件、prompt、历史对话 |
| Consistency | 用回形针图标表示上传文件；图像图标统一表示图形上传；标签人物用标准 @ 图标 |

---

## 与其他 Agentic 设计资源的关系

- 本课的"原则"是 **UX/产品视角** —— 回答"应不应该 / 是否符合人的需要"
- [[15_智能体/01_Agent_Foundations/Agentic_Design_Patterns_AndrewNg]] 是 **工程视角** —— 回答"如何用代码实现 Reflection / Tool Use / Planning / Multi-Agent"
- 两者互补：先有原则确定方向，再用模式落地

## 参考资源

- [Practices for Governing Agentic AI Systems — OpenAI](https://openai.com)
- [HAX Toolkit — Microsoft Research](https://microsoft.com)
- [Responsible AI Toolbox](https://responsibleaitoolbox.ai)

---

## 关联阅读

- [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L02_Frameworks]] — 上一课：框架选型
- [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L04_Tool_Use]] — 下一课：工具使用设计模式
- [[15_智能体/01_Agent_Foundations/Agentic_Design_Patterns_AndrewNg]] — Andrew Ng 工程视角的四大 Agentic 模式
- [[17_伦理安全/01_Ethics_Fundamentals/GenAI_L03_Using_GenAI_Responsibly]] — 负责任 AI 概览
- [[90_学习/courses/microsoft/microsoft_ai_agents_for_beginners]] — 课程总览

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

## 快速参考

| 维度 | 要点 | 备注 |
|------|------|------|
| 核心概念 | 理解基本原理和设计动机 | 理论基础 |
| 技术选型 | 根据场景选择合适方案 | 实践指导 |
| 最佳实践 | 遵循行业标准做法 | 质量保障 |
| 常见陷阱 | 避免已知问题和反模式 | 经验总结 |
| 发展趋势 | 关注技术演进方向 | 前瞻视野 |

## 延伸阅读

| 资源 | 类型 | 适用阶段 |
|------|------|----------|
| 官方文档 | 参考手册 | 全阶段 |
| 技术博客 | 深度分析 | 进阶 |
| 开源项目 | 代码实践 | 实战 |
| 学术论文 | 前沿研究 | 精通 |
| 社区讨论 | 经验交流 | 全阶段 |

## 检查清单

- [ ] 核心概念已理解并能向他人解释
- [ ] 已完成至少一个实践项目
- [ ] 了解主流方案的优劣势
- [ ] 掌握常见问题排查方法
- [ ] 关注最新技术动态和趋势
