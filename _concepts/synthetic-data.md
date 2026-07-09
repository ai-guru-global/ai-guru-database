---
title: "Synthetic Data（合成数据）"
category: -concepts
tags: [synthetic-data, data-augmentation, distillation, llm-generated, pretraining]
aliases:
  - "Synthetic Data"
  - "合成数据"
  - "LLM-Generated Data"
relationships:
  - target: "_concepts/data-cleaning-pipeline"
    type: complementary
sources:
  - _concepts/data-cleaning-pipeline.md
  - _synthesis/pretraining-synthetic-data.md
summary: "Synthetic Data（合成数据）是用 LLM 或算法生成的人工标注数据，用于训练数据增强 / 蒸馏 / 隐私保护；2026 年是高质量领域数据和隐私敏感场景的核心方案。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.88
created: 2026-06-24
updated: 2026-06-24
---

# Synthetic Data（合成数据）

## 核心要点

- **定义**：用 LLM / 算法 / 模拟生成的人工标注数据，替代或补充真实数据。
- **主要场景**：
  - **冷启动**：领域数据稀缺时，先用合成数据训练
  - **数据增强**：在少量真实数据基础上扩充
  - **隐私保护**：用合成数据替代含 PII 的真实数据
  - **长尾场景**：罕见场景真实数据不足
  - **指令微调**：用 LLM 生成大量 (prompt, response) 对
  - **RLHF Reward Model 训练**：用 LLM 生成偏好对
  - **蒸馏**：用大模型输出训练小模型
- **生成方法**：
  - **Self-Instruct**：让 LLM 自我生成指令
  - **Evol-Instruct**：从简单指令演化复杂指令
  - **Magpie**：从 LLM 内部知识采样
  - **Rejection Sampling**：生成多个候选 + 过滤最优
  - **多模型集成**：多 LLM 生成 + 投票

## 一句话解释

> Synthetic Data = "让 AI 自己造数据"；用 LLM 生成训练数据解决数据稀缺 / 隐私 / 长尾问题。

## 主流方法对比

| 方法 | 提供方 | 强项 |
|------|--------|------|
| **Self-Instruct** | UW | 简单、自举训练 |
| **Evol-Instruct** | Microsoft | 难度可调 |
| **Magpie** | UIUC | 从 LLM 内部知识采样 |
| **Alpaca** | Stanford | GPT-3.5 生成 52K |
| **WizardLM** | Microsoft | Evol-Instruct 应用 |
| **UltraChat** | 开源 | 多轮对话合成 |
| **Humpback** | Microsoft | 工具调用合成 |
| **OpenHermes** | 开源社区 | 综合多源 |

## 关键质量挑战

| 挑战 | 现象 | 缓解 |
|------|------|------|
| **幻觉** | 合成数据含错误信息 | 多模型投票 + 知识校验 |
| **同质化** | 数据多样性差 | 多温度采样 + 多源 prompt |
| **偏见放大** | 放大 LLM 原有偏见 | 多模型生成 + 反偏见规则 |
| **标注噪声** | LLM 自身标注错误 | 多轮审核 + 难例标注 |
| **领域偏移** | 与目标分布偏离 | 真实数据混合 + 校准 |

## 与真实数据的混合策略

```
训练数据 = 真实数据 (高质量 + 少量)
         + 合成数据 (大规模 + 中等质量)
         + 过滤后合成数据 (质量 ≥ 阈值)

典型比例:
├── 真实 : 合成 = 1:9  (冷启动)
├── 真实 : 合成 = 3:7  (数据增强)
├── 真实 : 合成 = 7:3  (后期微调)
└── 真实 : 合成 = 9:1  (高质量对齐)
```

## 何时使用

✅ **推荐**：
- 领域冷启动（医疗、法律、金融数据稀缺）
- 隐私合规（GDPR / HIPAA 不能用真实数据）
- 长尾场景（罕见病例、边缘案例）
- 指令微调数据扩充（已有 1K → 扩到 100K）
- 蒸馏（用大模型训练小模型）

⚠️ **不推荐**：
- 已有充足真实数据
- 任务对事实性要求极高（幻觉风险）
- 多样性敏感的任务（合成数据易同质化）

## Related

- [[_concepts/data-cleaning-pipeline]] — 数据清洗流水线
- [[_synthesis/pretraining-synthetic-data]] — 预训练合成数据综合
- [[MLOps/Orchestration/Data_Pipeline_Orchestration]] — 数据流水线