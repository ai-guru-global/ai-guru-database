---
title: "Ragas RAG 评估框架 (Ragas - RAG Assessment)"
category: -concepts
tags: ["ragas", "rag-evaluation", "llm-as-judge", "metrics", "hallucination"]
relationships:
  - target: "概念/rag-systems"
    type: related_to
  - target: "概念/deepeval"
    type: related_to
  - target: "概念/agent-evaluation"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "Ragas 是专为 RAG 系统设计的开源评估框架——提供 Faithfulness（忠实度）、Answer Relevancy（答案相关性）、Context Precision/Recall 等 RAG 专项指标。是 RAG 系统质量度量的事实标准。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
---

# Ragas RAG 评估框架

> **一句话理解**: Ragas 是"RAG 系统的体检报告"——一套指标量化回答忠实度、检索精度、答案相关性，帮你判断 RAG 到底靠不靠谱。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **全称** | RAG Assessment (Ragas) |
| **开源协议** | MIT |
| **GitHub** | 8K+ ⭐ |
| **核心价值** | RAG 系统的标准化评估方法 |
| **评估方式** | LLM-as-Judge + 传统 NLP 指标 |

---

## 2. 核心指标体系

```
┌─────────────────────────────────────────┐
│          Ragas 指标体系                 │
├─────────────────────────────────────────┤
│                                         │
│  生成质量 (Generation)                  │
│    ├── Faithfulness 忠实度              │
│    │   → 回答是否基于检索到的上下文     │
│    │   → 越高 = 幻觉越少               │
│    │                                   │
│    └── Answer Relevancy 答案相关性      │
│        → 回答是否与问题相关             │
│        → 越高 = 回答越精准             │
│                                         │
│  检索质量 (Retrieval)                   │
│    ├── Context Precision 上下文精确度   │
│    │   → 检索到的文档中有多少是相关的   │
│    │                                   │
│    ├── Context Recall 上下文召回率      │
│    │   → 相关文档被检索到了多少         │
│    │                                   │
│    └── Context Relevancy 上下文相关性   │
│        → 检索到的上下文与问题有多相关   │
│                                         │
│  综合                                   │
│    └── Answer Correctness 答案正确性    │
│        → 综合评估回答的正确性           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3. 使用方法

### 3.1 基础评估

```python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)
from datasets import Dataset

# 准备评估数据
eval_data = {
    "question": [
        "vLLM 是什么？",
        "MoE 架构有什么优势？",
    ],
    "answer": [
        "vLLM 是高性能 LLM 推理引擎，使用 PagedAttention。",
        "MoE 通过专家路由实现计算效率提升。",
    ],
    "contexts": [
        ["vLLM 是一个高性能 LLM 推理服务引擎..."],
        ["MoE (混合专家模型) 使用路由机制..."],
    ],
    "ground_truth": [
        "vLLM 是基于 PagedAttention 的高性能推理引擎",
        "MoE 优势是计算效率高，只激活部分专家",
    ],
}

dataset = Dataset.from_dict(eval_data)

# 运行评估
results = evaluate(
    dataset=dataset,
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
)
print(results)
# {'faithfulness': 0.92, 'answer_relevancy': 0.88, ...}
```

### 3.2 指标解读

| 指标 | 范围 | 好的分数 | 含义 |
|------|:---:|:---:|------|
| **Faithfulness** | 0-1 | > 0.8 | 回答基于上下文，无幻觉 |
| **Answer Relevancy** | 0-1 | > 0.8 | 回答切题，不跑偏 |
| **Context Precision** | 0-1 | > 0.7 | 检索的文档大多是相关的 |
| **Context Recall** | 0-1 | > 0.7 | 大部分相关文档都被检索到了 |

---

## 4. RAG 调优闭环

```
┌─────────────────────────────────────────┐
│     RAG 评估驱动优化                    │
├─────────────────────────────────────────┤
│                                         │
│  1. 构建 RAG 系统                       │
│     ↓                                   │
│  2. Ragas 评估 → 发现问题              │
│     ├── Faithfulness 低 → 幻觉多       │
│     │   → 改进: 调整 Prompt / 加 Re-ranker │
│     ├── Context Recall 低 → 检索不全   │
│     │   → 改进: 调 chunk size / 换 Embedding │
│     └── Answer Relevancy 低 → 回答跑偏 │
│         → 改进: 优化 Prompt / 调模型    │
│     ↓                                   │
│  3. 修改 RAG 配置                       │
│     ↓                                   │
│  4. 重新评估 → 验证改进效果             │
│                                         │
└─────────────────────────────────────────┘
```

---

## 5. 与其他评估工具对比

| 特性 | Ragas | DeepEval | Promptfoo | TruLens |
|------|-------|----------|-----------|---------|
| **RAG 专项** | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★☆ |
| **LLM 通用评估** | ★★★☆☆ | ★★★★★ | ★★★★★ | ★★★★☆ |
| **开源** | ✅ | ✅ | ✅ | ✅ |
| **指标数量** | 10+ RAG | 14+ 通用 | 配置式 | 10+ |
| **LangChain 集成** | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★☆ |
| **适合场景** | RAG 评估 | LLM 全面评估 | Prompt 测试 | 生产监控 |

---

## 6. 关键要点

1. **RAG 评估标准**：Faithfulness + Context + Answer 三维指标是 RAG 质量度量的行业共识
2. **LLM-as-Judge**：使用 LLM 作为评估器，不需要大量标注数据
3. **开源免费**：完全开源，可自托管
4. **驱动优化**：指标低分直接指向优化方向（检索/生成/Prompt）
5. **LangChain 生态**：与 LangSmith 配合使用效果最佳
6. **CI/CD 集成**：可作为 RAG 系统的自动化质量门禁

## 2026 RAGAS 生态现状

| 指标 | 说明 | 计算方式 | 状态 |
|------|------|------|------|
| Faithfulness | 忠实度 | LLM 判断 | ✅ 成熟 |
| Answer Relevancy | 答案相关性 | 余弦相似度 | ✅ 成熟 |
| Context Precision | 上下文精度 | LLM 判断 | ✅ 成熟 |
| Context Recall | 上下文召回 | LLM 判断 | ✅ 成熟 |
| Answer Correctness | 答案正确性 | 语义相似度 | ✅ 成熟 |
| Noise Sensitivity | 噪声敏感度 | 新增 | ✅ 新增 |

## 检查清单

- [ ] RAGAS 已安装且版本固定
- [ ] 评估指标已选择
- [ ] 测试集已构建
- [ ] CI/CD 集成已配置
- [ ] 评估基线已建立
- [ ] 定期评估已配置

## 延伸阅读

- [[概念/RAG/langsmith|LangSmith]] — 可观测性
- [[概念/RAG/opik|Opik]] — 可观测性对比
- [[概念/RAG/rag-patterns|RAG Patterns]] — RAG 模式
- [[概念/RAG/rag-production-architecture|RAG 生产架构]]
- [[08_模型评估/index|Model Evaluation]] — 模型评估

> ℹ️ RAGAS 是 RAG 评估的事实标准，2026年提供 6+ 评估指标，是 RAG 系统质量门禁的必备工具。
