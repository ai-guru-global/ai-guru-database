---
title: "RAGAS: RAG 评估框架"
category: "09-testing"
tags: ["testing", "ai-testing", "prompt-testing", "evaluation", "rag"]
summary: "> **一句话理解**: RAGAS 是一个专门评估 RAG 系统质量的开源框架——通过多维度指标（Faithfulness、Answer Relevancy、Context Precision 等）量化评估你的 RAG 应用。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Ragas Deep Dive"
  - "RAGAS Deep Dive"
  - RAGAS_Deep_Dive
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# RAGAS: RAG 评估框架

> **一句话理解**: RAGAS 是一个专门评估 RAG 系统质量的开源框架——通过多维度指标（Faithfulness、Answer Relevancy、Context Precision 等）量化评估你的 RAG 应用。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [指标详解](#5-指标详解)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
RAGAS: RAG 评估框架
═══════════════════════════════════════════════════════════════════

定位: 专门评估 RAG (检索增强生成) 系统的开源评估框架

核心理念:
───────────────────────────────────────────────────────────────────
• 多维度指标: 从检索到生成全链路评估
• LLM-as-Judge: 用大模型评估回答质量
• 轻量级: 简单 API，快速集成
• 研究驱动: 基于学术论文的评估方法
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **多维度评估** | Context、Answer、Faithfulness 等 |
| **LLM-as-Judge** | 自动评估，无需人工标注 |
| **简单 API** | 几行代码完成评估 |
| **基准对比** | 内置数据集对比 |
| **RAG 优化** | 针对性指标定位问题 |

### 1.3 支持的指标

| 指标 | 说明 | 范围 |
|------|------|------|
| **Faithfulness** | 答案是否基于上下文 | 0-1 |
| **Answer Relevancy** | 答案与问题的相关性 | 0-1 |
| **Context Precision** | 上下文排序质量 | 0-1 |
| **Context Recall** | 上下文召回率 | 0-1 |
| **Context Entity Recall** | 实体召回率 | 0-1 |
| **Answer Correctness** | 答案正确性 | 0-1 |

---

## 2. 核心概念

### 2.1 评估流程

```
RAGAS 评估流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        RAGAS 评估流程                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  输入:                                                            │
│  ├── user_input: 用户问题                                        │
│  ├── retrieved_contexts: 检索到的上下文                          │
│  ├── response: RAG 系统生成的答案                                │
│  └── ground_truth: 真实答案 (可选)                               │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Step 1: 指标计算                                            │ │
│  │ ────────────────────────────────────────────────────────     │ │
│  │ • Faithfulness: 检查答案是否来自上下文                      │ │
│  │ • Answer Relevancy: 评估答案与问题的相关性                  │ │
│  │ • Context Precision: 评估上下文排序                         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Step 2: LLM 评估                                            │ │
│  │ ────────────────────────────────────────────────────────     │ │
│  │ • 使用 GPT-4 等模型作为评判                                 │ │
│  │ • 生成细粒度评分和理由                                       │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  输出:                                                            │
│  └── EvaluationResult: {metric_name: score, reasoning: ...}    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 与传统评估的区别

| 维度 | 传统评估 | RAGAS |
|------|----------|-------|
| **正确性判断** | 精确匹配 | 语义相似 |
| **评估成本** | 人工标注 | 自动评估 |
| **覆盖维度** | 单一指标 | 多维度 |
| **定位问题** | 模糊 | 具体到检索/生成 |

---

## 3. 架构设计

### 3.1 评估架构

```
RAGAS 评估架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        RAGAS 架构                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   User Input                                                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Question, Contexts, Response, Ground Truth              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │               Metric Calculator                          │   │
│   │  ┌────────────┐ ┌────────────┐ ┌────────────┐           │   │
│   │  │Faithful-  │ │   Answer   │ │  Context   │           │   │
│   │  │  ness     │ │ Relevancy │ │ Precision  │           │   │
│   │  └────────────┘ └────────────┘ └────────────┘           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │               LLM Judge (GPT-4/Claude)                 │   │
│   │  用于需要语义判断的指标                                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │               Evaluation Result                          │   │
│   │  {metrics: {...}, reasoning: {...}, scores: [...]}      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install ragas
```

### 4.2 基础评估

```python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)

# 准备数据
eval_data = {
    "user_input": "什么是量子计算?",
    "retrieved_contexts": [
        "量子计算是一种利用量子力学原理进行计算的技术。",
        "量子计算机使用量子比特而非经典比特。"
    ],
    "response": "量子计算是一种利用量子力学原理的新型计算方式，它使用量子比特。",
    "ground_truth": "量子计算是基于量子力学原理的计算方式，使用量子比特。"
}

# 评估
result = evaluate(
    eval_data,
    metrics=[
        faithfulness,
        answer_relevancy,
        context_precision,
        context_recall,
    ]
)

# 输出结果
print(result)
# {
#   'faithfulness': 0.85,
#   'answer_relevancy': 0.92,
#   'context_precision': 0.88,
#   'context_recall': 0.90
# }
```

### 4.3 批量评估

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy
from datasets import Dataset

# 创建评估数据集
eval_samples = [
    {
        "user_input": "什么是深度学习?",
        "retrieved_contexts": ["深度学习是机器学习的一个分支..."],
        "response": "深度学习是机器学习的分支，使用神经网络。",
        "ground_truth": "深度学习是基于神经网络的机器学习方法。"
    },
    {
        "user_input": "解释Transformer架构",
        "retrieved_contexts": ["Transformer是一种注意力机制..."],
        "response": "Transformer是一种使用自注意力的架构。",
        "ground_truth": "Transformer是基于自注意力机制的神经网络架构。"
    },
]

dataset = Dataset.from_list(eval_samples)

# 批量评估
result = evaluate(dataset, metrics=[faithfulness, answer_relevancy])
print(result)
```

### 4.4 与 LangChain 集成

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy
from langchain.chains import RetrievalQA

# 假设已有 RAG Chain
qa_chain = RetrievalQA.from_chain_type(...)

# 评估
samples = []
for query in test_queries:
    result = qa_chain({"query": query})
    samples.append({
        "user_input": query,
        "retrieved_contexts": [doc.page_content for doc in result["source_documents"]],
        "response": result["result"],
    })

# 评估
from ragas import evaluate
from ragas.metrics import faithfulness
result = evaluate(samples, metrics=[faithfulness])
```

---

## 5. 指标详解

### 5.1 Faithfulness

```python
# Faithfulness 评估原理
"""
1. 从 response 中提取所有claims
2. 检查每个 claim 是否能从 context 推断出来
3. 计算：忠诚度 = 有效的 claims / 总 claims

示例:
context: "量子计算使用量子比特，可以在叠加态存在。"
response: "量子计算使用量子比特，这是量子计算的核心。"
→ 全部 claims 都能从 context 推断 → Faithfulness = 1.0

context: "量子计算使用量子比特。"
response: "量子计算可以破解所有密码系统。"
→ claim 无法从 context 推断 → Faithfulness < 1.0
"""
```

### 5.2 Answer Relevancy

```python
# Answer Relevancy 评估原理
"""
1. 基于 response 生成多个等价问题
2. 计算 original question 与生成问题的相似度
3. 取平均作为 Relevancy Score

理想答案应该能回答问题，反过来说能引出原问题
"""
```

### 5.3 Context Precision

```python
# Context Precision 评估原理
"""
1. 检查每个 relevant context 是否被正确排序
2. 高相关上下文排在前面得高分

排序质量 = Σ(相关度 × 位置权重) / 总数
"""
```

---

## 6. 对比与选择

### 6.1 与其他评估工具对比

| 维度 | RAGAS | DeepEval | LangSmith |
|------|-------|----------|-----------|
| **专注领域** | RAG | 测试框架 | 全流程 |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **指标丰富** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **集成能力** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **开源** | ✅ | ✅ | ❌ |

### 6.2 适用场景

**✅ RAGAS 最佳场景:**
- RAG 系统质量评估
- RAG 优化迭代
- 快速验证 RAG 配置
- 对比不同 RAG 方案

**❌ 不适合场景:**
- 非 RAG 应用评估
- 需要复杂报告
- 完整测试流程管理

---

## 参考资源

- [RAGAS GitHub](https://github.com/explodinggradients/ragas)
- [RAGAS 文档](https://docs.ragas.io/)
- [RAGAS 论文](https://arxiv.org/abs:2309.15217)

---

*Last updated: 2026-04-25*
*Version: 1.0.0*

## Related

- [[测试/Testing_Fundamentals/AI-Testing-in-nutshell.md|AI-Testing-in-nutshell]]
- [[测试/Testing_Fundamentals/AI_Testing_for_dummy.md|AI_Testing_for_dummy]]
- [[测试/Testing_Frameworks/Java_AI_Testing.md|Java_AI_Testing]]
- [[测试/README.md|测试 README]]
- [[../../RAG系统/RAG_Fundamentals/RAG-in-nutshell|RAG-in-nutshell]]
