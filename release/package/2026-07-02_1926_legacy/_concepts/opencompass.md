---
title: "OpenCompass"
category: -concepts
tags: ["opencompass", "evaluation", "benchmark", "llm", "chinese-llm", "mmbench", "multimodal"]
relationships:
  - target: "_concepts/model-evaluation"
    type: extends
  - target: "_concepts/benchmark"
    type: enables
  - target: "_concepts/lm-evaluation-harness"
    type: related_to
  - target: "_concepts/llm"
    type: evaluates
sources:
  - 模型评估/Evaluation_Tools/OpenCompass_Deep_Dive.md
summary: "OpenCompass 是上海人工智能实验室开源的一站式 LLM 评测平台，支持学科、知识、推理、多语言、多模态等丰富基准，是国内大模型评测的重要工具。"
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
  - Opencompass

---
# OpenCompass

> 国产 LLM 评测的「一站式平台」——从学科考试到多模态，全面评估中文大模型。

---

## 1. 一句话定义

**OpenCompass** 是上海人工智能实验室开源的 **一站式大模型评测平台**，支持学科考试、知识问答、推理、多语言、长文本、多模态等丰富基准。它是国内大模型评测和社区榜单（如 CompassRank、CompassKit）的核心工具。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **多维度基准** | 学科、知识、理解、推理、语言、考试、长文本、智能体 |
| **多模型支持** | HuggingFace、API（OpenAI、Claude、ERNIE、Qwen 等） |
| **多模态评测** | MMBench、MME、SEED 等视觉语言基准 |
| **中文优化** | C-Eval、CMMLU、GAOKAO-Bench 等中文考试 |
| **高效推理** | 支持 vLLM、LMDeploy 等加速后端 |
| **可视化报告** | 生成雷达图、排行榜、详细报告 |
| **模块化设计** | 数据集、模型、评测策略可插拔 |

---

## 3. 典型场景

1. **中文大模型评估**：C-Eval、CMMLU、Gaokao 等中文考试。
2. **多模态模型评测**：图文理解、视觉问答。
3. **模型能力雷达图**：全面展示模型各学科能力。
4. **社区榜单打榜**：参与 CompassRank 评测。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **LM Evaluation Harness** | 国际学术基准为主，OpenCompass 中文和多模态更全 |
| **HELM** | 斯坦福 holistic 评估 |
| **vLLM / LMDeploy** | OpenCompass 可调用加速推理 |
| **HuggingFace Evaluate** | 通用 NLP 评估 |

---

## 5. 优势与局限

### 优势
- 中文基准覆盖全面。
- 多模态评测能力强。
- 可视化报告直观。

### 局限
- 对非中文模型和纯英文场景，部分基准不如 Harness 通用。
- 配置和扩展比 Harness 复杂。

---

## Related

- [[模型评估/Evaluation_Tools/OpenCompass_Deep_Dive]] — OpenCompass 深度解析
- [[_concepts/model-evaluation]] — 模型评估
- [[_concepts/benchmark]] — 基准测试
- [[_concepts/lm-evaluation-harness]] — LM Evaluation Harness
- [[模型评估/Benchmarks/LLM_Benchmark_Suite_2026]] — LLM 基准套件 2026
