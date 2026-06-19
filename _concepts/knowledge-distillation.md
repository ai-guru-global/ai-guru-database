---
title: "知识蒸馏 (Knowledge Distillation)"
category: concept
tags: ["distillation", "model-compression", "teacher-student", "logit-distillation", "deepseek"]
relationships:
  - target: "_concepts/model-compression"
    type: complements
  - target: "_concepts/llm-architectures"
    type: related_to
  - target: "_concepts/mixture-of-experts"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
  - 02_Machine_Learning/Ensemble_Learning/
summary: "知识蒸馏将大模型的暗知识（soft labels）迁移到小模型，以更低成本获得接近大模型的效果。DeepSeek-R1 通过蒸馏产生了 7B/14B/32B/70B 全系列推理模型。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.90
lifecycle: stable
tier: core
created: 2026-06-04
updated: 2026-06-04
---

# 知识蒸馏 (Knowledge Distillation)

> 让小学生学会专家的思维方式，而不只是背答案。

---

## 1. 定义

**知识蒸馏**（Knowledge Distillation, KD）由 Hinton et al. 2015 提出，将大模型（Teacher）的知识迁移到小模型（Student），使小模型在推理时获得接近大模型的效果。

核心思想：大模型的 **soft labels**（概率分布）比 hard labels（0/1标签）包含更丰富的"暗知识"（dark knowledge）——如类别间的相似关系。

---

## 2. 知识蒸馏类型

| 类型 | 蒸馏对象 | 代表方法 | 特点 |
|------|----------|----------|------|
| **Logit 蒸馏** | Teacher 的输出概率分布 | Hinton KD (2015) | 最经典，直接匹配 softmax 输出 |
| **特征蒸馏** | 中间层特征/激活值 | FitNets (2015) | 匹配中间表示，适合深层网络 |
| **关系蒸馏** | 样本间关系/注意力 | Attention Transfer (2017) | 匹配注意力模式 |
| **数据蒸馏** | Teacher 生成的数据 | SeqKD (2019) | 用 Teacher 生成训练数据 |
| **在线蒸馏** | 两个模型交替训练 | Deep Mutual Learning (2018) | 无需预训练 Teacher |
| **自蒸馏** | 模型自身深层 → 浅层 | Born Again Networks (2018) | 无需外部 Teacher |

---

## 3. LLM 时代的蒸馏

### 3.1 经典 LLM 蒸馏案例

| Teacher → Student | 方法 | 效果 |
|-------------------|------|------|
| **GPT-4 → Alpaca** | SeqKD（生成指令数据） | 低成本复现 ChatGPT |
| **DeepSeek-R1 → 7B/14B/32B/70B** | 数据蒸馏 + 微调 | 小模型推理能力接近大模型 |
| **Llama-70B → Llama-8B** | Logit 蒸馏 | 8B 模型性能逼近 70B |
| **Claude → Vicuna** | 数据蒸馏 | 生成高质量对话数据 |

### 3.2 DeepSeek-R1 蒸馏

DeepSeek-R1 是知识蒸馏的经典案例：

```
DeepSeek-R1 (671B MoE)
│
├── 蒸馏训练数据: R1 的完整推理过程（思维链 + 验证 + 反思）
│
├── DeepSeek-R1-Distill-Qwen-1.5B  ← 蒸馏 + SFT
├── DeepSeek-R1-Distill-Qwen-7B    ← 蒸馏 + SFT
├── DeepSeek-R1-Distill-Qwen-14B   ← 蒸馏 + SFT
├── DeepSeek-R1-Distill-Qwen-32B   ← 蒸馏 + SFT
└── DeepSeek-R1-Distill-Llama-70B  ← 蒸馏 + SFT
```

关键发现：蒸馏 + 小模型 > RL 训练的同等大小模型。

---

## 4. 核心公式

### Hinton KD（温度缩放）

Teacher 输出经温度缩放的 softmax：

\[
q_i = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}
\]

总损失：

\[
\mathcal{L} = \alpha \cdot \mathcal{L}_{CE}(y, \hat{y}) + (1 - \alpha) \cdot T^2 \cdot \text{KL}(q_T \| q_S)
\]

- \(T\)：温度参数（越大分布越软，典型 2-20）
- \(\alpha\)：硬标签 vs 软标签权重平衡

---

## 5. 蒸馏 vs 微调 vs RAG

| 方案 | 知识更新 | 成本 | 推理延迟 | 可解释性 | 适用场景 |
|------|----------|------|----------|----------|----------|
| **蒸馏** | 一次性 | 中 | 低（小模型） | 低 | 部署受限环境 |
| **微调** | 可迭代 | 高 | 同原模型 | 低 | 风格/能力适配 |
| **RAG** | 实时 | 低 | 中（检索+生成） | 高 | 知识密集问答 |

---

## 6. 工程最佳实践

| 关注点 | 建议 |
|--------|------|
| **Teacher 选择** | 效果好的大模型，不一定需要最强 |
| **温度 T** | 分类任务 T=3-5，生成任务 T=1-2 |
| **数据质量** | 蒸馏数据需覆盖多样场景和难度 |
| **Student 架构** | 与 Teacher 架构相似时效果更好 |
| **渐进蒸馏** | 先蒸馏到中等模型，再蒸馏到更小的模型 |
| **混合训练** | 蒸馏数据 + 原始数据混合训练，防止灾难性遗忘 |

---

## 7. 局限与开放问题

1. **知识上界**：Student 能力通常不超过 Teacher
2. **推理模式迁移**：CoT 推理模式的蒸馏效果不稳定
3. **数据污染**：Teacher 生成的数据可能带有偏见
4. **版权风险**：蒸馏商业模型可能涉及知识产权问题
5. **评估困难**：如何全面评估蒸馏后的知识保留程度

---

## Related

- [[_concepts/model-compression]] — 模型压缩（蒸馏是压缩手段之一）
- [[_concepts/llm-architectures]] — LLM 架构（Teacher/Student 选型）
- [[_concepts/mixture-of-experts]] — MoE（DeepSeek-R1 的 Teacher 架构）
- [[_concepts/lora-peft]] — LoRA/PEFT（蒸馏后的微调方案）
- [[_concepts/reasoning-models]] — 推理模型（DeepSeek-R1 蒸馏链）
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack
