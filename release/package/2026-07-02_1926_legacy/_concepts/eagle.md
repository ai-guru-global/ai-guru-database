---
title: "EAGLE 推测解码 (EAGLE Speculative Decoding)"
category: -concepts
tags: ["eagle", "speculative-decoding", "draft-model", "inference-optimization", "feature-level"]
relationships:
  - target: "_concepts/speculative-decoding"
    type: related_to
  - target: "_concepts/mtp"
    type: related_to
  - target: "_concepts/flashinfer"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "EAGLE (Extrapolation Algorithm for Greater Language-model Efficiency) 是特征级推测解码方案，用轻量 Draft Head 预测目标模型的特征而非 Token，接受率达 80-90%，加速 2-3 倍。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: stable
tier: core
---

# EAGLE 推测解码

> **一句话理解**: EAGLE 是" smarter 的投机解码"——不用独立小模型，而是用轻量 Head 预测目标模型内部特征，接受率更高、加速更大。

---

## 1. 核心思想

传统投机解码使用独立 Draft Model，EAGLE 使用目标模型特征外推：

```
传统投机解码：
├── Draft Model（独立小模型）
│   └── 预测 Token → 目标模型验证
└── 问题：Draft 质量有限，接受率 60-80%

EAGLE 推测解码：
├── Feature Head（轻量网络，~1% 参数）
│   ├── 输入：目标模型最后一层隐藏状态
│   └── 输出：预测下一层隐藏状态 → 解码 Token
└── 优势：特征级预测，接受率 80-90%
```

---

## 2. EAGLE vs 传统投机解码

| 维度 | 传统投机解码 | EAGLE | EAGLE-2 |
|------|-----------|-------|---------|
| **Draft 来源** | 独立小模型 | 特征外推 Head | 动态 Draft Tree |
| **额外参数** | 需加载完整模型 | ~1% 目标模型参数 | ~1% |
| **接受率** | 60-80% | 80-90% | 85-95% |
| **加速比** | 1.5-2× | 2-3× | **3-4×** |
| **显存开销** | 大（额外模型） | 极小 | 极小 |
| **训练成本** | 需独立训练 Draft | 轻量 Head 微调 | 轻量 Head 微调 |

---

## 3. EAGLE-2 改进

| 改进 | 说明 |
|------|------|
| **动态 Draft Tree** | 根据置信度动态选择 Draft 数量 |
| **Context-aware** | 利用完整上下文特征，而非仅最后 Token |
| **更高接受率** | 85-95%，接近无损 |
| **无需重训** | 可复用 EAGLE Head |

---

## 4. 推测解码方案对比

| 方案 | Draft 来源 | 加速比 | 接受率 | 显存 |
|------|-----------|--------|--------|------|
| **标准投机解码** | 独立小模型 | 1.5-2× | 60-80% | 大 |
| **Medusa** | 多头并行预测 | 2-3× | 70-85% | 小 |
| **EAGLE** | 特征外推 | 2-3× | 80-90% | 极小 |
| **EAGLE-2** | 动态 Draft Tree | 3-4× | 85-95% | 极小 |
| **MTP (DeepSeek)** | 模型内置预测头 | 2-3× | 80-95% | 无额外 |

---

## 5. 在推理框架中的支持

| 框架 | EAGLE 支持 | 说明 |
|------|-----------|------|
| **vLLM** | ✅ | 实验性支持 |
| **SGLang** | ✅ | 原生支持 |
| **TensorRT-LLM** | ⚠️ | 需手动配置 |
| **Ollama** | ❌ | 不支持 |

---

## Related

- [[_concepts/speculative-decoding]] — 投机解码
- [[_concepts/mtp]] — Multi-Token Prediction
- [[_concepts/flashinfer]] — FlashInfer 算子库
- [[_concepts/prefill-decode]] — Prefill/Decode 推理阶段
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack 深度解析
