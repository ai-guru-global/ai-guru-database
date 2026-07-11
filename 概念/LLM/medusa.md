---
title: "Medusa 多头推测解码 (Medusa Multi-Head Speculative Decoding)"
category: -concepts
tags: ["medusa", "speculative-decoding", "multi-head", "self-speculative", "inference-optimization"]
relationships:
  - target: "概念/speculative-decoding"
    type: related_to
  - target: "概念/eagle"
    type: related_to
  - target: "概念/mtp"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Medusa 是自推测解码方案——在目标模型上添加多个预测头（Prediction Heads），同时预测未来多个 Token，无需独立 Draft 模型。加速 2-3 倍且无额外模型显存开销。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
tier: core
---

# Medusa 多头推测解码

> **一句话理解**: Medusa 是"多头并行预测"——在目标模型上加几个轻量 Head，同时预测未来多个 Token，无需额外 Draft 模型。

---

## 1. 核心思想

```
传统投机解码：
目标模型 ←→ 独立 Draft 模型（需额外加载）

Medusa 自推测解码：
目标模型
├── 原始输出头 → Token[t+1]（标准自回归）
├── Medusa Head 1 → 预测 Token[t+1]
├── Medusa Head 2 → 预测 Token[t+2]
├── Medusa Head 3 → 预测 Token[t+3]
└── 验证：目标模型一次前向传播验证所有预测
```

---

## 2. 与其他推测解码方案对比

| 方案 | Draft 来源 | 加速比 | 额外显存 | 接受率 |
|------|-----------|--------|---------|--------|
| **标准投机解码** | 独立小模型 | 1.5-2× | 大 | 60-80% |
| **Medusa** | 多头并行 ← 本文 | 2-3× | 极小 | 70-85% |
| **EAGLE** | 特征外推 | 2-3× | 极小 | 80-90% |
| **EAGLE-2** | 动态 Draft Tree | 3-4× | 极小 | 85-95% |
| **MTP (DeepSeek)** | 模型内置预测头 | 2-3× | 无 | 80-95% |

---

## 3. Medusa 架构细节

| 特性 | 说明 |
|------|------|
| **Head 数量** | 通常 3-5 个 |
| **Head 结构** | 2 层 MLP（极轻量） |
| **训练方式** | 冻结主模型，仅训练 Heads |
| **推理方式** | Tree Attention 并行验证 |
| **兼容性** | 任何自回归 LLM |

---

## 4. Medusa vs EAGLE

| 维度 | Medusa | EAGLE |
|------|--------|-------|
| **预测方式** | 各 Head 独立预测 | 特征级外推 |
| **上下文利用** | 仅最后 Token | 完整上下文特征 |
| **接受率** | 70-85% | 80-90% |
| **训练成本** | 低（训练 Heads） | 低（训练 Head） |
| **复杂度** | 低 | 中 |

---

## Related

- [[概念/speculative-decoding]] — 投机解码
- [[概念/eagle]] — EAGLE 推测解码
- [[概念/mtp]] — Multi-Token Prediction
- [[概念/prefill-decode]] — Prefill/Decode 阶段
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
