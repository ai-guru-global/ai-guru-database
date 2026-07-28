---
title: "结构化输出 (Structured Output)"
category: -concepts
tags: ["structured-output", "json-mode", "function-calling", "constrained-decoding", "pydantic"]
relationships:
  - target: "概念/Agent/function-calling"
    type: complements
  - target: "概念/LLM/decoding-strategies"
    type: related_to
  - target: "概念/Agent/tool-calling"
    type: related_to
sources:
  - 05_大模型/16_Constrained_Generation/
  - 15_智能体/01_Agent_Foundations/
summary: "结构化输出让 LLM 按预定义 Schema（JSON/XML/Pydantic 模型）生成可被程序直接解析的结果，是 Agent 工具调用、数据抽取和 API 集成的基础能力。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.90
lifecycle: reviewed
tier: core
created: 2026-07-27
updated: 2026-07-27
aliases:
  - "Structured Output"
  - "JSON Mode"
  - "结构化生成"
name_zh: "结构化输出"
---
# 结构化输出 (Structured Output)

> 中文简称：结构化输出

> 让模型说"机器能懂的话"——按 Schema 生成，而不是自由发挥。

---

## 1. 定义

**结构化输出**指约束 LLM 按预定义格式（JSON Schema、Pydantic 模型、正则、CFG 文法）生成内容，保证输出可被下游程序 100% 解析。它是 Agent 工具调用、信息抽取、表单填充等生产场景的基石。

---

## 2. 实现路径对比

| 路径 | 机制 | 可靠性 | 代表 |
|------|------|--------|------|
| **Prompt 约定** | 提示词要求输出 JSON | 低（易跑偏） | 早期做法 |
| **JSON Mode** | API 层保证合法 JSON | 中（结构不保证） | OpenAI json_object |
| **Schema 约束解码** | 解码时屏蔽非法 token | 高（100% 合规） | Outlines / XGrammar / llguidance |
| **Function Calling** | 模型微调 + Schema 注入 | 高 | OpenAI tools / Claude tool_use |
| **重试 + 校验** | Pydantic 校验失败后重试 | 中 | Instructor |

---

## 3. 约束解码原理

1. 将 JSON Schema 编译为有限状态机（FSM）或下推自动机
2. 每步解码时，只允许符合当前状态的合法 token（logit masking）
3. 保证语法 100% 合规，且几乎不增加推理延迟（XGrammar 掩码开销 <1%）

---

## 4. 工程实践

| 关注点 | 建议 |
|--------|------|
| **Schema 设计** | 字段少而精，加 description 提升语义准确率 |
| **枚举优先** | 用 enum 替代自由文本，降低幻觉 |
| **可选字段** | 慎用 optional，模型倾向填满所有字段 |
| **嵌套深度** | 控制在 3 层以内，深层嵌套准确率下降 |
| **框架选型** | vLLM/SGLang 原生支持 guided decoding；应用层用 Instructor/Pydantic |

---

## Related

- [[概念/Agent/function-calling]] — 函数调用（结构化输出的典型应用）
- [[概念/Agent/tool-calling]] — 工具调用
- [[概念/LLM/decoding-strategies]] — 解码策略
- [[概念/LLM/guidance|Guidance]] — 约束生成框架
- [[概念/Agent/mcp]] — MCP 协议（工具 Schema 标准化）

> ℹ️ 2026 年趋势：约束解码已成为推理引擎标配（vLLM/SGLang/TensorRT-LLM 均内置），结构化输出可靠性不再依赖提示词技巧。
