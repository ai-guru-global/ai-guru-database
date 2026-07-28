---
title: "小语言模型 (Small Language Models)"
category: -concepts
tags: ["slm", "edge-llm", "phi", "qwen", "on-device", "model-compression"]
relationships:
  - target: "概念/Training/knowledge-distillation"
    type: complements
  - target: "概念/LLM/edge-llm"
    type: related_to
  - target: "概念/Training/model-compression"
    type: related_to
sources:
  - 05_大模型/12_Edge_LLM/
  - 05_大模型/05_LLM_Architectures/
summary: "小语言模型（SLM，通常 <10B 参数）通过高质量数据、蒸馏和架构优化，在特定任务上逼近大模型效果，是端侧部署、低成本推理和 Agent 子任务的主力选择。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-07-27
updated: 2026-07-27
aliases:
  - "Small Language Models"
  - "SLM"
  - "小模型"
name_zh: "小语言模型"
---
# 小语言模型 (Small Language Models)

> 中文简称：小语言模型

> 不是所有任务都需要 670B——把合适的模型放在合适的位置。

---

## 1. 定义

**小语言模型**（SLM）泛指参数量在 0.5B–10B 区间的语言模型。与"缩小版大模型"不同，现代 SLM 通过**数据质量优先**（教科书级语料）、**蒸馏**（大模型教学）和**推理时扩展**（test-time compute）在数学、代码等任务上达到甚至超越上一代大模型。

---

## 2. 代表模型谱系

| 系列 | 参数规模 | 特色 |
|------|----------|------|
| **Phi 系列** | 1.5B–14B | "教科书数据"路线鼻祖 |
| **Qwen 小尺寸** | 0.5B–7B | 中英双语、全尺寸开源 |
| **Gemma 系列** | 2B–9B | Google 开源、端侧友好 |
| **MiniCPM** | 1.2B–8B | 端侧多模态 |
| **DeepSeek-R1-Distill** | 1.5B–14B | 推理能力蒸馏 |

---

## 3. SLM vs LLM 选型

| 维度 | SLM | LLM |
|------|-----|-----|
| **推理成本** | 低 1–2 个数量级 | 高 |
| **延迟** | 毫秒级、可端侧 | 百毫秒级起 |
| **通用能力** | 窄任务强、泛化弱 | 强 |
| **隐私** | 可完全本地化 | 通常依赖云端 |
| **典型场景** | 路由/分类/抽取/端侧助手/Agent 子任务 | 复杂推理/开放创作 |

---

## 4. 工程实践

1. **级联架构**：SLM 前置处理 80% 简单请求，困难样本升级到 LLM
2. **蒸馏定制**：用业务数据 + 大模型标注蒸馏领域 SLM
3. **量化协同**：SLM + INT4/FP8 量化，单卡可跑数十并发
4. **Agent 分工**：规划用 LLM、执行子任务用 SLM，显著降本

---

## Related

- [[概念/Training/knowledge-distillation]] — 知识蒸馏（SLM 主要生产方式）
- [[概念/LLM/edge-llm]] — 端侧 LLM
- [[概念/Training/model-compression]] — 模型压缩
- [[概念/LLM/phi-series]] — Phi 系列
- [[概念/LLM/qwen-series]] — Qwen 系列
- [[概念/LLM/test-time-compute]] — 推理时扩展

> ℹ️ 2026 年趋势：NVIDIA 等提出"SLM 是 Agent 系统的未来"——多数 Agent 子任务重复、窄域，SLM 分工是成本最优解。
