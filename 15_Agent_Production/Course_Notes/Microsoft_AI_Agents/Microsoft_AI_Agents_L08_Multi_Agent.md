---
title: "L08 多 Agent 设计模式：组聊、Hand-off、协同过滤"
category: "15-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - multi-agent
  - group-chat
  - handoff
  - orchestration
sources:
  - "_raw/github-sources/ai-agents-for-beginners/08-multi-agent/README.md"
summary: "Microsoft AI Agents 课程第8课：何时切换到多 Agent（大负载/复杂任务/多元专长）、多 Agent 优于单 Agent 的三原因、实现六要素（通信/协调/架构/可见性/模式/HITL），以及组聊/Hand-off/协同过滤三大模式。"
provenance:
  extracted: 0.86
  inferred: 0.11
  ambiguous: 0.03
base_confidence: 0.83
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: supporting
created: 2026-06-15
updated: 2026-06-15
---

# L08 多 Agent 设计模式：组聊、Hand-off、协同过滤

> 来源：[Microsoft AI Agents for Beginners / 08-multi-agent](https://github.com/microsoft/ai-agents-for-beginners/tree/main/08-multi-agent)

## 学习目标

完成本课后，你将能够：

- 识别多 Agent 适用场景
- 解释多 Agent 相对单 Agent 的优势
- 掌握多 Agent 实现的六个构建块

> **一句话**：多 Agent 是一种**让多个 Agent 协作达成共同目标**的设计模式，广泛用于机器人、自动驾驶、分布式计算。

---

## 一、何时该用多 Agent

| 场景 | 例子 |
|------|------|
| **大负载（Large workloads）** | 大数据处理可分片并行 |
| **复杂任务（Complex tasks）** | 自动驾驶中导航/避障/V2V 通信分别由不同 Agent 管 |
| **多元专长（Diverse expertise）** | 医疗场景：诊断、治疗方案、病患监护各有专精 |

---

## 二、多 Agent 优于单 Agent 的三原因

| 优势 | 说明 |
|------|------|
| **Specialization（专精）** | 单 Agent 万能但易混淆，多 Agent 各擅其长 |
| **Scalability（可扩展）** | 加 Agent 比加重单 Agent 更线性 |
| **Fault Tolerance（容错）** | 一个挂了其他的还能继续 |

**类比**：单 Agent 像"夫妻店旅行社"——一个员工干所有事；多 Agent 像"连锁旅行社"——不同柜台处理不同业务。

---

## 三、实现六要素

| 要素 | 关键决策 |
|------|----------|
| **Agent Communication** | 哪些 Agent 互通信息？怎么互通？（航班 Agent 要把旅行日期告诉酒店 Agent） |
| **Coordination Mechanisms** | 如何协调动作以满足用户偏好（机场附近酒店）与约束（机场才有的租车）？ |
| **Agent Architecture** | Agent 内部如何决策与学习？（如基于历史偏好的 ML 推荐模型） |
| **Visibility（可观测性）** | 日志/监控、可视化、性能指标——多 Agent 调试比单 Agent 难得多 |
| **Multi-Agent Patterns** | 集中式 vs 去中心化 vs 混合架构 |
| **Human-in-the-Loop** | 何时该请人介入？高频低风险 vs 低频高风险不同对待 |

### 可见性三件套

- **Logging & Monitoring**：每条 action 记录 agent_id / action / timestamp / outcome
- **Visualization**：用图展示信息流，识别瓶颈
- **Performance Metrics**：任务完成时间、TPS、推荐准确率

---

## 四、三大多 Agent 模式

### 1. Group Chat（组聊）

- 多个 Agent 在共享频道交换消息
- 适用：团队协作、客服、社交网络
- 实现：集中式（中央服务器路由）或去中心式（直接通信）

### 2. Hand-off（移交）

- 每个 Agent 代表工作流的一步/一项任务
- Agent 按预定义规则把任务交给下一个 Agent
- 适用：客服、任务管理、工作流自动化

### 3. Collaborative Filtering（协同过滤）

- 多个 Agent 协同出推荐
- 例：股票推荐——行业专家 Agent + 技术分析 Agent + 基本面分析 Agent
- 各 Agent 贡献不同维度的专长

---

## 五、案例：退款流程的 Agent 拆解

课程给了一个详尽案例，把"退款"流程拆成 **5 个流程专属 Agent + 11 个通用 Agent**：

**流程专属**：Customer / Seller / Payment / Resolution / Compliance

**通用（可被其他业务复用）**：Shipping / Feedback / Escalation / Notification / Analytics / Audit / Reporting / Knowledge / Security / Quality

> 💡 这个案例暗示了多 Agent 设计的真正成本：**通用 Agent 数量往往超过业务专属 Agent** ^[inferred]。设计时要分清"这个 Agent 只服务此流程"还是"全公司都能复用"。

---

## 六、本课作业

> 设计一个客服流程的多 Agent 系统，识别所涉 Agent、角色职责、交互方式。

提示：先想客服的不同**阶段**（接入、诊断、解决、回访、升级…），再想**任何系统都需要**的通用 Agent（审计、安全、通知…）。需要的 Agent 比直觉多得多。

---

## 与其他课的衔接

- 接 [[15_Agent_Production/Course_Notes/Microsoft_AI_Agents/Microsoft_AI_Agents_L07_Planning_Design]]：Planner 输出的结构化 plan 触发这里的多 Agent 路由
- [[15_Agent_Production/Course_Notes/Microsoft_AI_Agents/Microsoft_AI_Agents_L09_Metacognition]]（下一课）将探讨 Agent **自我反思**——多 Agent 中的每个成员都可以具备元认知能力 ^[inferred]

---

## 关联阅读

- [[15_Agent_Production/Course_Notes/Microsoft_AI_Agents/Microsoft_AI_Agents_L07_Planning_Design]] — 上一课：Planner 触发多 Agent
- [[15_Agent_Production/Course_Notes/Microsoft_AI_Agents/Microsoft_AI_Agents_L09_Metacognition]] — 下一课：元认知
- [[15_Agent_Production/Agentic_Design_Patterns_AndrewNg]] — Andrew Ng 的 Multi-Agent 模式
- [[15_Agent_Production/Agent_Workflow/README]] — 工作流编排概览
- [[90_Learn/courses/microsoft/microsoft_ai_agents_for_beginners]] — 课程总览
