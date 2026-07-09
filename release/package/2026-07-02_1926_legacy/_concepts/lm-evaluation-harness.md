---
title: "LM Evaluation Harness"
category: -concepts
tags: ["lm-evaluation-harness", "eleutherai", "evaluation", "benchmark", "llm", "few-shot", "perplexity"]
relationships:
  - target: "_concepts/model-evaluation"
    type: extends
  - target: "_concepts/benchmark"
    type: enables
  - target: "_concepts/opencompass"
    type: related_to
  - target: "_concepts/llm"
    type: evaluates
sources:
  - 模型评估/Evaluation_Tools/LM_Evaluation_Harness_Deep_Dive.md
summary: "LM Evaluation Harness 是 EleutherAI 开源的 LLM 评测框架，支持数百个基准测试（MMLU、HELLASWAG、ARC 等），提供统一接口和可复现流程，是学术和工业界最常用的模型评估工具之一。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - "Lm Evaluation Harness"
  - "lm evaluation harness"

---
# LM Evaluation Harness

> LLM 评测的「瑞士军刀」——一个命令行工具跑遍数百个学术基准。

---

## 1. 一句话定义

**LM Evaluation Harness** 是 EleutherAI 开源的 **LLM 评测框架**，支持数百个学术基准（如 MMLU、HELLASWAG、ARC、TruthfulQA、GSM8K 等）。它提供统一的模型加载、任务配置、评估指标和输出格式，是学术研究和工业界评估基础模型能力的事实标准工具之一。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **多模型支持** | HuggingFace Transformers、GPT-NeoX、vLLM、LLaMA、Mamba 等 |
| **多基准任务** | MMLU、ARC、HellaSwag、Winogrande、TruthfulQA、GSM8K 等 |
| **Few-shot 评估** | 可配置每个任务的示例数 |
| **多指标** | 准确率、F1、BLEU、ROUGE、perplexity 等 |
| **并行加速** | 支持数据并行和 vLLM 加速 |
| **可扩展** | 可自定义新任务和指标 |
| **输出标准化** | 生成 JSON/CSV/表格报告 |

---

## 3. 典型场景

1. **基础模型评估**：预训练后跑标准基准看能力。
2. **微调效果对比**：比较不同 checkpoint 的指标变化。
3. **量化模型评估**：验证量化对性能的影响。
4. **学术研究**：论文中复现和报告标准基准分数。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **OpenCompass** | 中文社区主导的评测平台，与 Harness 互补 |
| **HELM** | 斯坦福 holistic 评估框架 |
| **HuggingFace Evaluate** | 通用 NLP 评估库 |
| **vLLM** | Harness 可调用 vLLM 加速推理 |

---

## 5. 优势与局限

### 优势
- 基准覆盖最全，社区维护活跃。
- 命令行简单，一行命令跑多个任务。
- 结果可复现性强。

### 局限
- 主要聚焦学术基准，对业务场景指标支持有限。
- 自定义任务需要学习 YAML 配置。
- 多语言/中文基准覆盖不如 OpenCompass。

---

## Related

- [[模型评估/Evaluation_Tools/LM_Evaluation_Harness_Deep_Dive]] — LM Evaluation Harness 深度解析
- [[_concepts/model-evaluation]] — 模型评估
- [[_concepts/benchmark]] — 基准测试
- [[_concepts/opencompass]] — OpenCompass
- [[模型评估/Benchmarks/LLM_Benchmark_Suite_2026]] — LLM 基准套件 2026
