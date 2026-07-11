---
title: "QwQ 推理模型 (QwQ Reasoning Model)"
category: -concepts
tags: ["qwq", "qwen", "reasoning", "chain-of-thought", "thinking-model", "ai-stack"]
relationships:
  - target: "概念/reasoning-models"
    type: related_to
  - target: "概念/qwen3-pro"
    type: related_to
  - target: "概念/deepseek-models"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "QwQ 是通义千问系列的推理模型（32B），通过 Chain-of-Thought 思维链实现深度推理，对标 OpenAI o1 和 DeepSeek-R1。AI Stack 预置 QwQ-32B。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: supporting
---

# QwQ 推理模型

> **一句话理解**: QwQ 是通义千问的"深度思考版"——32B 参数的推理模型，用思维链（CoT）逐步推理复杂问题，对标 o1/R1。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **全名** | QwQ-32B |
| **厂商** | 阿里云通义千问 |
| **类型** | 推理模型 (Reasoning Model) |
| **参数量** | 32B |
| **对标** | OpenAI o1、DeepSeek-R1 |
| **AI Stack** | 预置 QwQ-32B |

---

## 2. 推理模型 vs 标准模型

| 维度 | 标准模型 (Instruct) | 推理模型 (Thinking) |
|------|-------------------|-------------------|
| **回答方式** | 直接输出答案 | 先思考再回答 |
| **思维链** | 隐式（内部） | 显式（可见推理过程） |
| **适用场景** | 通用问答、创作 | 数学、逻辑、编程、推理 |
| **延迟** | 较低 | 较高（需生成推理过程） |
| **Token 消耗** | 较少 | 较多（含推理 token） |
| **代表模型** | Qwen3-Instruct | QwQ、o1、R1 |

---

## 3. 推理流程

```
QwQ 推理流程
│
├── 输入：用户问题（如数学题）
│
├── 思考阶段（<think>...</think>）
│   ├── 问题分析：识别问题类型
│   ├── 方法选择：选择解题策略
│   ├── 逐步推导：逻辑链条展开
│   ├── 验证检查：自检推理正确性
│   └── 结论形成：汇总最终答案
│
└── 输出：经过深度推理的回答
```

---

## 4. 竞品对比

| 模型 | 参数量 | 上下文 | 开源 | 推理能力 |
|------|--------|--------|------|----------|
| **QwQ-32B** | 32B | 128K | ✅ Apache 2.0 | AIME 数学 79.5 |
| **DeepSeek-R1** | 671B (37B 激活) | 128K | ✅ MIT | AIME 数学 79.8 |
| **OpenAI o1** | 未公开 | 200K | ❌ 闭源 | AIME 数学 83 |
| **OpenAI o3-mini** | 未公开 | 200K | ❌ 闭源 | AIME 数学 87 |

---

## 5. AI Stack 中的推理模型选择

| 场景 | 推荐模型 | 说明 |
|------|----------|------|
| 数学/逻辑推理 | QwQ-32B | 32B 推理模型 |
| 复杂分析 | Qwen3-Pro-Thinking | 专有优化推理版 |
| 深度推理 | DeepSeek-R1 | 671B 满血推理 |
| 通用问答 | Qwen3-Instruct | 标准指令跟随 |

---

## Related

- [[概念/reasoning-models]] — 推理模型
- [[概念/qwen3-pro]] — Qwen3-Pro 优化模型
- [[概念/deepseek-models]] — DeepSeek 系列
- [[概念/cot-react-reasoning-prompt]] — CoT 推理提示
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
