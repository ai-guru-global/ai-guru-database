---
title: "L09 AI Agent 元认知：自我反思、Corrective RAG 与代码生成"
category: "15-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - metacognition
  - corrective-rag
  - code-generation
  - self-reflection
sources:
  - "原始/github-sources/ai-agents-for-beginners/09-metacognition/README.md"
summary: "Microsoft AI Agents 课程第9课（最长一章）：元认知=Agent 思考自己的思考。覆盖自我反思、规划、Corrective RAG（含 RAG 作 Prompting vs Tool 之辨）、代码生成 Agent、环境感知与 SQL-as-RAG。"
provenance:
  extracted: 0.84
  inferred: 0.13
  ambiguous: 0.03
base_confidence: 0.84
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: supporting
created: 2026-06-15
updated: 2026-06-15
aliases:
  - "Microsoft Ai Agents L09 Metacognition"
  - "Microsoft AI Agents L09 Metacognition"
  - Microsoft_AI_Agents_L09_Metacognition

---
# L09 AI Agent 元认知：自我反思、Corrective RAG 与代码生成

> 来源：[Microsoft AI Agents for Beginners / 09-metacognition](https://github.com/microsoft/ai-agents-for-beginners/tree/main/09-metacognition)（本课是全课程最长的一章，1434 行）

## 学习目标

完成本课后，你将能够：

1. 理解推理循环（reasoning loops）在 Agent 定义中的作用
2. 用规划与评估技术构建可自我纠错的 Agent
3. 创建能操控代码完成任务的 Agent

---

## 一、什么是元认知（Metacognition）

**元认知 = 思考自己的思考** —— Agent 评估并调整自身策略与动作的高阶认知过程。

**真实元认知的标志**（不是简单的"再试一次"）：

- *"我刚才优先选了便宜航班，因为…但可能错过了直飞，让我重新查一遍。"*
- *"上次我过度依赖了用户的偏好，这次要改决策策略本身，不只是改最终推荐。"*
- *"只要用户说'太挤'，我不只删除热门景点——我要反思：按 popularity 排序本身就有问题。"*

### 元认知在 Agentic AI 中解决的四大挑战

| 挑战 | 元认知如何帮助 |
|------|----------------|
| **Transparency** | 解释 Agent 的推理与决策路径 |
| **Reasoning** | 综合信息做合理判断 |
| **Adaptation** | 适应新环境与变化条件 |
| **Perception** | 提升识别与解读环境信号的准确性 |

### 四大实用价值

- **Self-Reflection**：自评表现，识别改进点
- **Adaptability**：基于反馈与变化调整策略
- **Error Correction**：自主检测并修正错误
- **Resource Management**：优化时间与算力

---

## 二、AI Agent 的三大组件

| 组件 | 内涵 |
|------|------|
| **Persona** | 个性与特征，决定与用户交互的方式 |
| **Tools** | Agent 可执行的能力与函数 |
| **Skills** | Agent 拥有的知识与专长 |

三者合成一个"**专长单元（expertise unit）**" ^[inferred]。

---

## 三、Planning 的四要素

| 要素 | 说明 |
|------|------|
| **Current Task** | 清晰定义当前任务 |
| **Steps** | 把任务拆成可管理步骤 |
| **Required Resources** | 识别所需资源 |
| **Experience** | 利用过往经验指导规划 |

Travel Agent 完整 9 步流程：偏好采集 → 信息检索 → 生成推荐 → 呈现行程 → 收集反馈 → 据反馈调整 → 最终确认 → 预订确认 → 持续支持。

---

## 四、Corrective RAG（修正型 RAG）

### RAG vs Pre-emptive Context Load

| 模式 | 触发时机 | 适合 |
|------|----------|------|
| **RAG** | 查询时按需检索 | 开放式问题、大知识库 |
| **Pre-emptive Context Load** | 提前把上下文塞进 prompt | 已知任务结构、上下文体积可控 |

### RAG 作 Prompting Technique vs 作 Tool

| 视角 | 实现方式 | 优劣 |
|------|----------|------|
| **Prompting Technique** | 在 prompt 中指示"先检索再回答" | 简单；但 LLM 不一定遵守 |
| **Tool** | 把检索注册为 function，由 LLM 决定调用 | 更可控、可观测；但实现复杂 |

课程暗示 **Tool 视角更适合生产环境** ^[inferred]。

### Corrective RAG 三层机制

1. **Prompting Technique** —— 用特定提示引导检索
2. **Tool** —— 实现算法让 Agent 评估检索结果的相关性
3. **Evaluation** —— 持续评估表现并调整

### 关联技术

- **Bootstrapping the Plan with a Goal** —— 先有目标再迭代
- **LLM Re-ranking & Scoring** —— 用 LLM 本身对候选结果重排
- **Evaluating Relevancy** —— 关键概念：precision / recall / context window fit
- **Search with Intent** —— 不只匹配关键词，要理解查询意图

---

## 五、Generating Code as a Tool（代码生成 Agent）

让 Agent **生成并执行代码**作为工具，是元认知的高级形态。课程用 Data Analysis 与 Travel Agent 两个例子：

### 实现五步

1. **任务理解**：把自然语言请求转为编程任务
2. **代码生成**：LLM 产出可执行 Python
3. **安全执行**：沙盒（如 Docker）中运行
4. **结果评估**：检验输出是否合理
5. **迭代修正**：失败时让 Agent 看 traceback 自己改

### Environmental Awareness & Reasoning

Agent 不只生成代码，还要"**感知环境**"——例如发现数据库 schema 变了，主动调整 SQL；或看到 pandas DataFrame 列名变化，自动改字段引用 ^[inferred]。

---

## 六、SQL as RAG Technique

课程专门讨论把 SQL 当 RAG 用：

| 关键概念 | 说明 |
|----------|------|
| **Structured Retrieval** | 用 SQL 精确查询结构化数据 |
| **Schema-Aware** | Agent 必须理解表结构 |
| **Aggregation as Reasoning** | `GROUP BY`、`JOIN` 等于把推理下推到数据库 |

**应用场景**：Travel Agent 把酒店/航班数据存 SQL，用自然语言→SQL 让用户精确查询"低于 200 美金且近机场的四星酒店"。

---

## 七、元认知的最小可运行示例

课程末尾给了一个浓缩示例（hotel 选择）：

```python
# Step 1: 用"最便宜"策略推荐
agent.recommend(strategy="cheapest")
# → 推荐 $80/晚 but 2-star,远郊

# Step 2: 反思——"用户的反馈说地点重要,我的策略错了"
agent.reflect()  # 修改 strategy 本身

# Step 3: 用调整后的策略再推荐
agent.recommend(strategy="balanced")  # 重新算
# → 推荐 $150/晚,4-star,近机场
```

> 这个例子点出**真正元认知 vs 简单重试**的区别：元认知修改的是**策略本身**，不是修改最终输出 ^[extracted]。

---

## 与其他课的衔接

- 本课是 [[智能体/Course_Notes/Microsoft_AI_Agents_L08_Multi_Agent]] 的深化——多 Agent 中每个成员都可以具备元认知
- Corrective RAG 是 [[智能体/Course_Notes/Microsoft_AI_Agents_L05_Agentic_RAG]] 的进阶版
- 与 [[智能体/Agentic_Design_Patterns_AndrewNg]] 的 Reflection 模式高度相关，本课提供了 Reflection 的工程化实现 ^[inferred]

---

## 关联阅读

- [[智能体/Course_Notes/Microsoft_AI_Agents_L08_Multi_Agent]] — 上一课：多 Agent
- [[智能体/Course_Notes/Microsoft_AI_Agents_L10_Production]] — 下一课：生产化
- [[智能体/Course_Notes/Microsoft_AI_Agents_L05_Agentic_RAG]] — Agentic RAG 基础
- [[智能体/Agentic_Design_Patterns_AndrewNg]] — Reflection 模式
- [[RAG系统/README]] — 本仓库 RAG 主题总览
- [[学习/courses/microsoft/microsoft_ai_agents_for_beginners]] — 课程总览

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
