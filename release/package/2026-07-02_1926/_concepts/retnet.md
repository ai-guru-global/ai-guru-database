---
title: "RetNet"
category: -concepts
tags: ["retnet", "transformer-alternative", "long-context", "architecture", "rnnt"]
relationships:
  - target: "_concepts/transformer-architecture"
    type: alternative_to
  - target: "_concepts/mamba"
    type: related_to
  - target: "_concepts/state-space-models"
    type: related_to
  - target: "_concepts/kv-cache"
    type: replaces
sources:
  - 00_AI_Introduction/AI_New_Architectures.md
  - 05_NLP_LLMs/LLM_Architecture_Evolution.md
  - 03_Deep_Learning/State_Space_Models_2026.md
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
updated: 2026-06-16
aliases:
  - Retnet

---
# RetNet

## 核心要点

- **RetNet 是微软 2023 年提出的‘非 Attention’大模型架构**。
- **核心思想叫 Retention（保留机制）**：把序列信息编码成一个递归状态，同时支持并行训练。
- **三大实现形式**：
  - **并行表示**：训练时和 Transformer 一样并行。
  - **循环表示**：推理时像 RNN 一样逐 token 更新。
  - **分块循环表示**：折中方案，块内并行、块间循环。
- **最大卖点**：推理成本随序列长度线性增长，且不需要 KV Cache。

## 一句话理解

RetNet 像一台‘既能批量备课、又能逐页讲课’的翻译机：训练时全班一起学，推理时一页页翻，不需要背下整本书。

## 详细内容

### 为什么想替代 Transformer？

Transformer 的 Attention 是黄金标准，但有两个硬伤：
1. **推理成本高**：生成每个新 token 都要重新访问前面所有 token 的 KV Cache。
2. **显存随长度增长**：KV Cache 是长上下文推理的显存杀手。

### Retention 机制

RetNet 用一个衰减因子和位置编码，把历史信息压缩进一个状态向量：

```
新状态 = 衰减 × 旧状态 + 新输入 × 位置权重
输出    = 新状态 × 查询向量
```

- **衰减（decay）**：越远的过去影响越小，像人短期记忆的遗忘曲线。
- **位置权重**：用相对位置编码保留顺序信息。

### 三种表示方式

| 形式 | 用途 | 特点 |
|------|------|------|
| **并行（Parallel）** | 训练 | 和 Attention 类似，可矩阵并行 |
| **循环（Recurrent）** | 推理 | 每步 O(1) 状态更新，无 KV Cache |
| **分块循环（Chunkwise）** | 长序列 | 块内并行、块间循环，兼顾效率 |

### RetNet vs Transformer vs Mamba

| 维度 | Transformer | RetNet | Mamba |
|------|-------------|--------|-------|
| 训练并行 | ✅ 完全并行 | ✅ 完全并行 | ⚠️ 需并行扫描 |
| 推理复杂度 | L² | L | L |
| 需要 KV Cache | ✅ 是 | ❌ 否 | ❌ 否 |
| 位置信息 | 绝对/相对位置编码 | 指数衰减位置编码 | 隐含在状态转移中 |
| 生态成熟度 | 极高 | 低 | 中 |

### 应用与局限

- **适合场景**：超长上下文生成、低显存推理、流式处理。
- **局限**：后续研究证明 RetNet 在部分任务上的效果不如 Transformer，且生态（预训练模型、推理框架）远不如 Transformer 成熟。

## 开放问题

- RetNet 的大规模预训练效果是否能稳定超越或持平 Transformer。
- 如何与现有推理引擎（vLLM、TensorRT-LLM）深度集成。
- 与 Mamba 相比，在长文本、代码、数学推理上的优劣边界。

## Related

- [[_concepts/transformer-architecture]] — Transformer 架构
- [[_concepts/mamba]] — Mamba
- [[_concepts/state-space-models]] — 状态空间模型（SSM）
- [[_concepts/kv-cache]] — KV Cache
- [[00_AI_Introduction/AI_New_Architectures]] — AI 新架构
- [[03_Deep_Learning/State_Space_Models_2026]] — 状态空间模型 2026
