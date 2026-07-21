---
title: "RetNet"
category: -concepts
tags: ["retnet", "transformer-alternative", "long-context", "architecture", "rnnt"]
relationships:
  - target: "概念/transformer-architecture"
    type: alternative_to
  - target: "概念/mamba"
    type: related_to
  - target: "概念/state-space-models"
    type: related_to
  - target: "概念/kv-cache"
    type: replaces
sources:
  - AI入门/AI_New_Architectures.md
  - 大模型/LLM_Architecture_Evolution.md
  - 深度学习/State_Space_Models_2026.md
summary: "RetNet 是微软提出的 Transformer 替代方案，用‘保留机制（Retention）’取代 Attention。它既能像 Transformer 一样并行训练，又能像 RNN 一样线性复杂度推理，并且完全不需要 KV Cache。"
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.8
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Retnet
  - "Retentive Network"
  - "保留网络"

---
# RetNet

> **一句话理解**: RetNet 像一台“既能批量备课、又能逐页讲课”的翻译机：训练时全班一起学，推理时一页页翻，不需要背下整本书。

## 核心要点

- **RetNet 是微软 2023 年提出的“非 Attention”大模型架构**
- **核心思想叫 Retention（保留机制）**：把序列信息编码成一个递归状态，同时支持并行训练
- **三大实现形式**：并行（训练）、循环（推理）、分块循环（长序列）
- **最大卖点**：推理成本随序列长度线性增长，且不需要 KV Cache

## 为什么想替代 Transformer？

Transformer 的 Attention 有两个硬伤：
1. **推理成本高**：生成每个新 token 都要重新访问前面所有 token 的 KV Cache
2. **显存随长度增长**：KV Cache 是长上下文推理的显存杀手

## Retention 机制

```
新状态 = 衰减 × 旧状态 + 新输入 × 位置权重
输出    = 新状态 × 查询向量
```

- **衰减（decay）**：越远的过去影响越小，像人短期记忆的遗忘曲线
- **位置权重**：用相对位置编码保留顺序信息

## 三种表示方式

| 形式 | 用途 | 复杂度 | 特点 |
|------|------|:------:|------|
| **并行** | 训练 | O(L²) | 和 Attention 类似，可矩阵并行 |
| **循环** | 推理 | O(1)/步 | 每步 O(1) 状态更新，无 KV Cache |
| **分块循环** | 长序列 | O(L×C) | 块内并行、块间循环，兼顾效率 |

## 架构对比

| 维度 | Transformer | RetNet | Mamba |
|------|-------------|--------|-------|
| 训练并行 | ✅ 完全并行 | ✅ 完全并行 | ⚠️ 需并行扫描 |
| 推理复杂度 | O(L²) | O(L) | O(L) |
| 需要 KV Cache | ✅ 是 | ❌ 否 | ❌ 否 |
| 显存占用 | 随 L 线性增长 | 恒定 | 恒定 |
| 位置信息 | 绝对/相对 PE | 指数衰减 PE | 隐含在状态转移 |
| 生态成熟度 | 极高 | 低 | 中 |
| 2026 状态 | 主流 | 研究阶段 | 活跃 |

## 2026 年现状与定位

| 方面 | 现状 |
|------|------|
| **大规模验证** | 尚未有 >7B 的公开预训练模型达到 Transformer 同等水平 |
| **生态支持** | 无主流推理引擎原生支持 (vLLM/SGLang/TRT-LLM 均不支持) |
| **研究影响** | 启发了后续 YOCO、GLA 等线性注意力架构 |
| **实用场景** | 超长序列流式处理、端侧低显存推理 |
| **与 Mamba 对比** | Mamba 生态更成熟，实际效果更接近 Transformer |

## 适用场景与局限

✅ **适合**：
- 超长上下文生成（>100K token）
- 低显存推理（端侧/嵌入式）
- 流式处理（实时翻译、语音）

⚠️ **局限**：
- 部分任务效果不如 Transformer（复杂推理、代码）
- 生态远不如 Transformer/Mamba 成熟
- 缺乏大规模预训练验证

## 延伸阅读

- [[概念/LLM/mamba|Mamba]]
- [[概念/LLM/attention-variants|注意力变体]]
- [[概念/LLM/transformer-architecture-plain|Transformer 架构]]
- [[概念/Inference/kv-cache|KV Cache]]
- [[深度学习/State_Space_Models_2026|状态空间模型 2026]]
