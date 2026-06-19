---
title: "Mamba"
category: concepts
tags: ["mamba", "state-space-model", "ssm", "long-context", "architecture", "transformer-alternative"]
relationships:
  - target: "concepts/state-space-models"
    type: belongs_to
  - target: "concepts/transformer-architecture"
    type: alternative_to
  - target: "concepts/retnet"
    type: related_to
  - target: "concepts/long-context-models"
    type: enables
sources:
  - 03_Deep_Learning/State_Space_Models_2026.md
  - 00_AI_Introduction/AI_New_Architectures.md
  - 04_NLP_LLMs/LLM_Architecture_Evolution.md
summary: "Mamba 是一种‘用线性扫描代替注意力’的模型结构。它像一条传送带，边读边更新一个隐藏状态，不必像 Transformer 那样回头看所有词，因此在超长序列上更快、更省显存。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: stable
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# Mamba

## 核心要点

- **Mamba 属于 State Space Model（SSM，状态空间模型）**，目标是用线性复杂度处理长序列。
- **Transformer 的 Attention 是‘全连接回看’**：每个词都要和所有词算相似度，长度翻倍时计算量翻四倍。
- **Mamba 是‘边走边记’**：维护一个隐藏的‘状态向量’，每读一个新词就更新它，不需要回头。
- **关键创新**：选择性状态空间（Selective SSM），让模型决定哪些信息写入状态、哪些丢弃，弥补早期 SSM 记忆能力弱的缺点。

## 一句话理解

Mamba 就像一位边走边做笔记的速记员：不用反复翻阅整本书，而是把读过的内容压缩成几张关键摘要，所以读再长的文章也不累。

## 详细内容

### Transformer 的问题

Transformer 靠 Attention 看上下文，效果很好，但代价是：
- 序列长度 L 增大时，计算量按 L² 增长。
- 长文本推理时显存和延迟都爆炸。

### Mamba 怎么解决

Mamba 把序列建模看成动力系统：

```
新状态 = A × 旧状态 + B × 新输入
输出    = C × 新状态
```

其中 A、B、C 是学习得到的矩阵。每步只需做一次矩阵运算，计算量按 L 线性增长。

### 选择性状态空间

传统 SSM 的问题是“死记硬背”：它不能选择记住什么、忘记什么。

Mamba 让 B、C 和步长 Δ 都与输入相关，意味着：
- 看到重要内容 → 多记住
- 看到无关内容 → 少记或遗忘
- 类似 RNN 的门控，但训练可以并行化

### 优缺点对比

| 维度 | Transformer | Mamba |
|------|-------------|-------|
| 长序列速度 | L²，慢 | L，快 |
| 显存占用 | 高（Attention + KV Cache） | 低 |
| 训练并行 | 容易 | 需特殊算法（并行扫描） |
| 效果 | 已验证很强 | 部分任务接近，部分仍有差距 |
| 生态 | 极其成熟 | 快速发展中 |

### 典型应用

- **超长文本建模**：基因组序列、长文档、视频时序。
- **端侧/高效推理**：低延迟、低显存场景。
- **混合架构**：与 Transformer 层交替使用（如 Jamba、Zamba）。

## 开放问题

- Mamba 在需要强长距离依赖推理的任务上是否已全面追上 Transformer。
- 硬件优化（CUDA kernel、Triton）是否能充分发挥其线性复杂度优势。
- 与 KV Cache 压缩、量化等技术结合后的实际收益。

## Related

- [[concepts/state-space-models]] — 状态空间模型（SSM）
- [[concepts/retnet]] — RetNet
- [[concepts/transformer-architecture]] — Transformer 架构
- [[concepts/long-context-models]] — 长上下文模型
- [[03_Deep_Learning/State_Space_Models_2026]] — 状态空间模型 2026
- [[00_AI_Introduction/AI_New_Architectures]] — AI 新架构
