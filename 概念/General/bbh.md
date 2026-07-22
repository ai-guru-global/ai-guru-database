---
title: "BBH"
category: -concepts
tags: ["bbh", "big-bench", "benchmark", "reasoning", "llm-evaluation", "few-shot"]
relationships:
  - target: "概念/model-evaluation"
    type: belongs_to
  - target: "概念/reasoning-models"
    type: tests
  - target: "概念/llm-arena"
    type: complements
  - target: "概念/red-teaming"
    type: differs_from
sources:
  - 模型评估/Benchmarks/LLM_Benchmark_Suite_2026.md
  - 模型评估/Model_Evaluation.md
  - 模型评估/Evaluation-in-nutshell.md
summary: "BBH（Big-Bench Hard）是从 Google Big-Bench 中挑选的 23 个困难任务子集，专门测试大模型在复杂推理、多步思考和少样本学习上的能力。它被认为是衡量模型‘聪明程度’的重要基准之一。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Bbh

---
# BBH

## 核心要点

- **BBH = Big-Bench Hard**，是从 Big-Bench（Google 发布的大规模基准集合）中挑出的 23 个最难任务。
- **测的是复杂推理**：因果关系、逻辑演绎、数学、常识推理、多步规划等。
- **使用 few-shot 提示**：每个任务给几个示例，但不给中间推导过程，看模型能否自己学会。
- **常和 CoT（思维链）一起测**：模型直接答 vs 让模型一步步想，后者通常得分高很多。

## 一句话理解

BBH 就像给大模型做一份‘高难度综合智力题’：不考死记硬背，考你能不能举一反三、逻辑推理、多步思考。

## 详细内容

### Big-Bench 是什么？

Big-Bench 是 Google 发布的超大规模 LLM 基准，包含 200+ 任务，覆盖：
- 语言理解
- 常识推理
- 数学
- 代码
- 多语言
- 社会偏见
- 等等

任务太多太杂，于是研究者挑出其中人类也觉得难的 23 个，组成 BBH。

### BBH 覆盖的能力

| 能力 | 示例任务 |
|------|----------|
| **逻辑推理** | 布尔表达式、逻辑网格 |
| **因果推理** | 因果判断、反事实推理 |
| **数学** | 多步算术、单位换算 |
| **常识** | 物理常识、社会常识 |
| **规划** | 导航、任务排序 |
| **语言理解** | 消歧、指代消解 |

### 为什么重要？

- **区分模型的‘真聪明’与‘背答案’**：BBH 任务通常需要多步推理，不能靠记忆。
- **观察 scaling law**：模型越大，BBH 提升越明显，是研究涌现能力的重要指标。
- **评估推理策略**：比如 CoT、Self-Consistency 在 BBH 上效果提升显著。

### 评分方式

- 每个任务单独算准确率。
- 最终报告 23 个任务的平均准确率。
- 主流模型（GPT-4、Claude、Gemini、DeepSeek）会公开 BBH 分数作为能力参考。

## 开放问题

- BBH 题目是否会被模型在预训练时见过，导致分数虚高。
- 如何设计更难的推理基准，避免‘数据污染’。
- BBH 分数与实际业务效果之间的相关性。

## Related

- [[概念/model-evaluation]] — 模型评估
- [[概念/reasoning-models]] — 推理模型
- [[概念/llm-arena]] — LLM Arena
- [[概念/red-teaming]] — 红队测试
- [[模型评估/Benchmarks/LLM_Benchmark_Suite_2026]] — LLM 基准套件 2026

---

## 2026 BBH 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **BIG-Bench Hard** | 困难推理基准测试 | GA |
| **CoT 评估** | 思维链推理评估 | GA |
| **多步推理** | 多步推理能力测试 | GA |
| **与 MMLU 对比** | BBH vs MMLU | GA |
| **推理模型评估** | 推理模型专项评估 | GA |

## 生产最佳实践

1. **推理评估**：推理能力用 BBH 评估
2. **CoT 提示**：BBH 测试用 CoT 提示
3. **与 MMLU 配合**：BBH + MMLU 全面评估
4. **推理模型**：推理模型重点测 BBH
5. **持续评估**：模型迭代持续 BBH 评估

## BBH 评测配置示例

```python
# 使用 lm-evaluation-harness 运行 BBH
# lm_eval --model hf \
#   --model_args pretrained=Qwen/Qwen2.5-72B \
#   --tasks bbh_cot_fewshot \
#   --num_fewshot 3 \
#   --batch_size 8

# 或使用 OpenCompass
from opencompass import Config
config = Config({
    "models": [{"path": "Qwen/Qwen2.5-72B"}],
    "datasets": ["bbh"],
    "prompt_mode": "cot",  # 思维链提示
    "num_fewshot": 3
})
```

## 2026 主流模型 BBH 分数参考

| 模型 | BBH (CoT) | 说明 |
|------|-----------|------|
| GPT-5 | ~95% | 最强通用 |
| o3 | ~97% | 推理专用 |
| Claude 4 | ~93% | 强推理 |
| Gemini 2.5 Pro | ~92% | 多模态强 |
| Qwen3-235B | ~90% | 开源最强 |
| DeepSeek-V3 | ~89% | 性价比 |
| Llama 4 405B | ~87% | 开源 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 分数远低于预期 | 未用 CoT 提示 | 启用思维链提示 |
| 数据污染疑虑 | 训练集包含 BBH 题目 | 结合新基准交叉验证 |
| 与业务效果不相关 | 基准与场景不匹配 | 补充业务自定义评测 |
| 评测成本高 | 23 个任务全跑 | 选取相关子集 |
| 结果不稳定 | 采样随机性 | temperature=0 + 多次运行 |

## 版本兼容性

| 工具 | 版本 | 说明 |
|------|------|------|
| lm-eval-harness | 0.4+ | 评测框架 |
| OpenCompass | 0.2+ | 国产评测 |
| BIG-Bench | 最新 | 原始数据集 |

## 生产检查清单

1. 始终使用 CoT 提示测试 BBH
2. 与 MMLU、HumanEval 等组合评估
3. 设置 temperature=0 确保可复现
4. 关注数据污染风险
5. 结合业务场景自定义评测
6. 跟踪模型迭代 BBH 分数变化

## 版本兼容性

| 基准/工具 | 版本 | 任务数 | 备注 |
|------|------|------|------|
| **BBH** | 2022 原始 | 23 | BIG-Bench 困难子集 |
| **BBH-CoT** | 2023 | 23 | 添加 Chain-of-Thought 提示 |
| **lm-eval-harness** | ≥ 0.4 | 23 | 标准评测框架 |
| **OpenCompass** | ≥ 2024 | 23 | 国产评测平台 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 分数与论文不符 | 提示词差异 | 使用标准 CoT 提示模板 |
| 部分任务得分极低 | 模型弱项 | 分析子任务分数，针对性优化 |
| 评测成本高 | 23 个任务全跑 | 先跑核心子集（逻辑/数学） |
| 过拟合基准 | 训练数据污染 | 结合业务自定义评测 |

## 总结

BBH 是衡量 LLM 复杂推理能力的金标准基准，23 个困难任务覆盖逻辑、因果、数学、规划等多维度。它是评估推理模型（o3、DeepSeek-R1）效果的核心指标。

> 💡 BBH 的核心价值：它测的是“真推理”而非“背答案”——模型必须展现多步思考能力才能得分，是区分“聪明”与“博学”的关键基准。

## 相关概念

- [[概念/benchmark]] — 基准测试总论
- [[概念/mmlu]] — MMLU 多任务评估
- [[概念/gsm8k]] — GSM8K 数学推理
