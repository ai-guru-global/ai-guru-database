---
title: Speculative Decoding (投机解码)
category: -concepts
tags: [inference, speculative-decoding, mtp, acceleration]
relationships:
  - target: "_concepts/model-deployment"
    type: optimizes
  - target: "_concepts/transformer-architecture"
    type: builds_on
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
  - 部署推理/Caching/Speculative_Decoding_Advanced_2026.md
summary: Speculative Decoding 用小模型(draft)快速生成候选 token，大模型(target)一次前向传播并行验证，接受率 >85%，实现 2-3× 延迟降低且不改变输出分布。DeepSeek MTP 变体无需外部 draft model，用内置辅助头实现投机解码。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: draft
lifecycle_changed: 2026-06-03
tier: core
created: 2026-06-03 00:00:00+00:00
updated: 2026-06-03 00:00:00+00:00
aliases:
  - "Speculative Decoding"
  - "speculative decoding"

---
# Speculative Decoding (投机解码)

## 核心要点

- **Draft-Verify 范式**：小模型快速生成 k 个候选 token，大模型一次前向传播并行验证全部候选
- **接受率 >85%**：多数候选 token 被接受，每步平均输出 1+k 个 token
- **输出分布不变**：通过 Rejection Sampling 保证输出与直接大模型采样统计等价
- **DeepSeek MTP 变体**：无需外部小模型，用训练时的辅助预测头作为 draft model

## 详细内容

### 标准 Speculative Decoding

```
Step 1: Draft Model 快速生成 k 个候选 token
  [The] → [cat] → [sat] → [on] → [the]    (k=4 candidates)

Step 2: Target Model 一次前向传播并行验证
  输入: [The, cat, sat, on, the]
  输出: 验证每个位置的概率分布

Step 3: Rejection Sampling 决定接受/拒绝
  如果 P_target(token) / P_draft(token) ≥ U(0,1) → 接受
  否则 → 拒绝该 token 及后续所有 token，从修正分布重新采样
```

### 变体方法

| 方法 | Draft Model | 特点 |
|------|------------|------|
| **Standard** | 独立小模型（如 Llama-68M） | 通用，需额外加载小模型 |
| **N-gram** | 基于 n-gram 匹配 | 无需额外模型，适合重复性文本 |
| **EAGLE/EAGLE3** | 特征级 draft head | 轻量级 head，精度高于 n-gram |
| **MTP (DeepSeek)** | 内置辅助预测头 | 训练时已学习，无需额外组件 |
| **Medusa** | 多 head 并行预测 | 多个预测头覆盖不同距离 |

### MTP (Multi-Token Prediction) 变体

DeepSeek-V3 的 MTP 在训练时增加辅助预测头，推理时天然作为 draft model：

```
训练阶段:  h_t → predict(t+1) + predict(t+2)   (双训练信号)
推理阶段:  MTP head → draft token    (快速，单层计算)
           Main model → verify token  (一次前向传播)
```

**vLLM 配置**：
```bash
--speculative_config '{
  "method": "mtp",
  "num_speculative_tokens": 1
}'
```

**限制**：DeepSeek 仅暴露单层 MTP 权重，MTP≥3 时质量不保证；算子限制 MTP ≤ 15。

### 性能指标

| 指标 | 典型值 |
|------|--------|
| 接受率 | >85%（贪心策略） |
| 延迟加速 | 2-3× |
| 吞吐提升 | 1.5-2× |
| 精度影响 | 无（统计等价） |
| 额外显存 | draft model 大小（通常 <1GB） |

## 来源

- Leviathan et al., "Fast Inference from Transformers via Speculative Decoding," ICML 2023
- DeepSeek-V3 Technical Report, arXiv:2412.19437

## Related

- [[_concepts/kv-cache]] — KV Cache（投机解码中的验证步骤也利用 KV Cache）
- [[_concepts/model-deployment]] — 模型部署
- [[部署推理/Caching/Speculative_Decoding_Advanced_2026]] — 投机解码高级技术
