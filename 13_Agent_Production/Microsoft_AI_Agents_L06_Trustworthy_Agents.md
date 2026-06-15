---
title: "L06 构建可信 AI Agent：系统消息框架、威胁建模与人在回路"
category: "13-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - trustworthiness
  - system-prompt
  - threat-modeling
  - human-in-the-loop
  - security
sources:
  - "_raw/github-sources/ai-agents-for-beginners/06-building-trustworthy-agents/README.md"
summary: "Microsoft AI Agents 课程第6课：用四步 System Message Framework 工程化系统提示、识别五类 Agent 威胁（任务注入/越权/资源耗尽/知识库污染/级联错误），以及 Human-in-the-Loop 兜底。"
provenance:
  extracted: 0.88
  inferred: 0.10
  ambiguous: 0.02
base_confidence: 0.85
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: supporting
created: 2026-06-15
updated: 2026-06-15
---

# L06 构建可信 AI Agent：系统消息框架、威胁建模与人在回路

> 来源：[Microsoft AI Agents for Beginners / 06-building-trustworthy-agents](https://github.com/microsoft/ai-agents-for-beginners/tree/main/06-building-trustworthy-agents)

## 学习目标

完成本课后，你将能够：

- 识别并缓解构建 AI Agent 时的风险
- 实施数据与访问的安全管理
- 创建既能保护隐私又能提供优质体验的 Agent

---

## 一、System Message Framework（系统消息框架）

Agent 比 Chatbot 更依赖系统提示——因为 Agent 要执行具体任务，指令必须高度明确。课程给出可扩展的四步法：

### Step 1 — 写 Meta System Message（元提示）

让 LLM 帮你生成 system prompt 的"模板提示"：

```text
You are an expert at creating AI agent assistants.
You will be provided a company name, role, responsibilities and other
information that you will use to provide a system prompt for.
To create the system prompt, be descriptive as possible and provide a
structure that a system using an LLM can better understand the role and
responsibilities of the AI assistant.
```

### Step 2 — 写 Basic Prompt（基础描述）

包含角色、任务、职责。例：

```text
You are a travel agent for Contoso Travel that is great at booking flights.
To help customers you can perform the following tasks: lookup available flights,
book flights, ask for preferences in seating and times, cancel any previously
booked flights, and alert customers on any delays or cancellations.
```

### Step 3 — LLM 优化生成结构化 System Message

将 Meta + Basic 一起喂给 LLM，产出含 **公司名 / 角色 / 目标 / 关键职责 / 语气风格 / 用户交互指令 / 附加备注** 的结构化 prompt。

### Step 4 — Iterate and Improve

System prompt 一次写对几乎不可能。把它当迭代工具：小幅修改 Basic → 通过框架重生成 → 对比评估 → 持续优化。这种模板化也方便为**多个 Agent 批量生成**系统消息 ^[inferred]

---

## 二、Agent 五大威胁模型

| 威胁 | 描述 | 缓解策略 |
|------|------|----------|
| **Task & Instruction（任务/指令注入）** | 攻击者通过 prompt 或输入操纵 Agent 的指令与目标 | 输入校验与过滤；**限制对话轮数** |
| **Access to Critical Systems（关键系统越权）** | Agent 与敏感服务的通信被劫持 | 最小权限访问；通信加密；强认证与访问控制 |
| **Resource & Service Overloading（资源耗尽）** | 攻击者借 Agent 大量请求后端服务，制造故障或高额账单 | 速率限制；请求/轮数配额 |
| **Knowledge Base Poisoning（知识库污染）** | 不直接攻击 Agent，而是污染它依赖的 RAG 数据，导致偏见响应 | 定期校验数据；写入访问仅限受信身份 |
| **Cascading Errors（级联错误）** | 一个工具的错误传播到其他系统，扩大攻击面 | Docker 容器隔离；fallback + 重试机制 |

---

## 三、Human-in-the-Loop（HITL）

最有效的兜底机制：把用户当作多 Agent 系统中的另一个"Agent"，对运行中的过程**批准或终止**。

Microsoft Agent Framework 示意：

```python
from agent_framework.azure import AzureAIProjectAgentProvider
from azure.identity import AzureCliCredential

provider = AzureAIProjectAgentProvider(credential=AzureCliCredential())

response = provider.create_response(
    input="Write a 4-line poem about the ocean.",
    instructions="You are a helpful assistant. Ask for user approval before finalizing.",
)

print(response.output_text)
user_input = input("Do you approve? (APPROVE/REJECT): ")
if user_input == "APPROVE":
    print("Response approved.")
else:
    print("Response rejected. Revising...")
```

HITL 适合高风险动作（取消订单、转账、删除数据），不适合低风险高频动作（查询、推荐）^[[inferred]]。

---

## 与其他课的衔接

- 本课侧重**安全设计模式**，[[13_Agent_Production/Microsoft_AI_Agents_L18_Securing_AI_Agents]] 侧重**加密审计收据（Signed Receipts）**这一具体技术
- 与 [[19_Ethics_Safety/GenAI_L13_Securing_AI_Applications]] 互为补充：那节是 GenAI 通用安全，本节是 Agent 专属安全

## 参考资源

- [Responsible AI overview](https://learn.microsoft.com/azure/ai-studio/responsible-use-of-ai-overview)
- [Safety system messages](https://learn.microsoft.com/azure/ai-services/openai/concepts/system-message)
- [Microsoft RAI Impact Assessment Template](https://blogs.microsoft.com/wp-content/uploads/prod/sites/5/2022/06/Microsoft-RAI-Impact-Assessment-Template.pdf)

---

## 关联阅读

- [[13_Agent_Production/Microsoft_AI_Agents_L05_Agentic_RAG]] — 上一课：Agentic RAG
- [[13_Agent_Production/Microsoft_AI_Agents_L07_Planning_Design]] — 下一课：规划设计
- [[13_Agent_Production/Microsoft_AI_Agents_L18_Securing_AI_Agents]] — L18：加密审计收据深度技术
- [[13_Agent_Production/Microsoft_AI_Agents_L03_Design_Principles]] — L03：透明度/可控原则的理论基础
- [[19_Ethics_Safety/GenAI_L13_Securing_AI_Applications]] — GenAI 应用安全基础
- [[90_Learn/Courses/Microsoft_AI_Agents_for_Beginners]] — 课程总览
