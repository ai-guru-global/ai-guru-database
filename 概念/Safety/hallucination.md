---

title: "Hallucination (幻觉)"
tags: [hallucination, llm-reliability, rag-systems, factuality, agent-security]
created: 2026-06-17
tier: core
aliases:
  - Hallucination
category: -concepts
lifecycle: reviewed

relationships:
sources: []
---

# Hallucination (幻觉)

## 定义

幻觉（Hallucination）是大语言模型生成的内容与事实不符、缺乏依据或逻辑矛盾的现象。模型输出的文本看似流畅自信，但无法溯源到训练数据或输入上下文中的真实信息。NIST AI 600-1 将其称为"虚构"（Confabulation），是 LLM 系统最核心的可靠性挑战之一。

## 核心机制

### 幻觉的成因

幻觉的根源在于 LLM 的技术特性：

1. **概率性生成**：模型基于 Token 概率分布采样，而非事实检索——它"预测"最可能的下一个词，而非"查找"正确答案
2. **训练数据噪声**：训练集中的错误、过时信息和矛盾被内化到模型权重中
3. **知识截止**：模型不知道训练数据截止后发生的事件，但可能自信地"编造"
4. **注意力偏差**：长上下文中模型可能过度关注某些信息而忽略关键约束
5. **参数记忆的固有局限**：固化在权重中的知识是统计压缩的结果，非精确存储

### 幻觉的分类

| 类型 | 描述 | 示例 |
|