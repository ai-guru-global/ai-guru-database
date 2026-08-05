---
title: 状态空间模型
category: -concepts
tags: ["deep-learning", "ssm", "mamba", "state-space", "linear-complexity", "sequence-models"]
aliases: [SSM, State Space Model, Mamba, 状态空间, 线性复杂度序列模型]
relationships:
  - target: "[[概念/transformer-architecture]]"
    type: related_to
  - target: "概念/neural-networks"
    type: related_to
  - target: "概念/optimization-regularization"
    type: related_to
  - target: "概念/mamba"
    type: exemplified_by
  - target: "概念/retnet"
    type: related_to
sources:
  - 03_深度学习/02_神经网络核心/State_Space_Models_2026.md
summary: Transformer 的潜在替代架构，通过状态空间方程实现 O(n) 线性复杂度序列建模，Mamba 引入选择性机制在长序列任务上展现优势。
provenance:
  extracted: 0.80
  inferred: 0.12
  ambiguous: 0.08
base_confidence: 0.72
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-07-21T00:00:00Z
name_zh: "状态空间模型"
---

# 状态空间模型

> 中文简称：状态空间模型

状态空间模型（State Space Model, SSM）是 2023-2026 年兴起的序列建模新范式，以 $O(n)$ 线性复杂度挑战 Transformer 的 $O(n^2)$ 注意力。Mamba（S6）通过选择性状态空间机制在长序列建模、DNA 分析、音频生成等任务上展现竞争力，被视为序列建模的下一代架构。

## 核心要点

- **线性复杂度**：训练 $O(L \cdot D^2)$，推理 $O(L \cdot D)$，内存 $O(L \cdot D)$（vs transformer-architecture $O(L^2 \cdot D)$）
- **固定内存推理**：无需 KV Cache，序列长度不影响内存
- **选择性机制**：Mamba 的核心创新，SSM 参数由输入动态生成
- **SSM-Transformer 混合**：Jamba 等混合架构结合两者优势
- **超长上下文**：可处理 100K-1M+ tokens，Transformer 难以企及

## 详细内容

### 状态空间方程

SSM 的数学基础来自控制论，连续形式：

$$x'(t) = A \cdot x(t) + B \cdot u(t), \quad y(t) = C \cdot x(t) + D \cdot u(t)$$

离散化用于神经网络（$\Delta$ 为步长）：

$$x_k = \bar{A} \cdot x_{k-1} + \bar{B} \cdot u_k, \quad y_k = \bar{C} \cdot x_k$$

其中 $\bar{A} = \exp(\Delta \cdot A)$, $\bar{B} = (\exp(\Delta \cdot A) - I) \cdot A^{-1} \cdot B$。离散化使连续方程可在离散token序列上运算 ^[inferred]。

### SSM 家族演进

```
S4 (2021) → 首次将 SSM 用于长序列建模，击败 Transformer 在 Long Range Arena
S4D, LSSL (2022) → 简化计算，初步实践
Mamba/S6 (2023) → 选择性状态空间机制，与 Transformer 竞争的开始
Mamba-2 (2024) → 统一 SSM 和注意力，8x 训练速度提升
Jamba (2025) → SSM-Transformer 混合架构，生产级部署
百万级上下文 SSM (2026) → 处理 1M+ token，多模态 SSM
```

### Mamba 选择性机制

Mamba 的核心创新是**输入依赖的选择机制**：SSM 参数 $A, B, C$ 由输入动态生成，而非固定全局参数。这使模型能根据内容选择性地传播或遗忘信息 ^[inferred]。

关键组件：
1. **输入投影**：将输入映射到高维空间
2. **局部卷积**：捕获局部上下文信息
3. **选择性扫描**：动态 SSM 参数 + 并行扫描算法
4. **门控机制**：SiLU 激活实现门控输出

选择性扫描的核心循环：

$$h_k = \bar{A}_k \cdot h_{k-1} + \bar{B}_k \cdot u_k, \quad y_k = \bar{C}_k \cdot h_k$$

注意 $A, B, C$ 带下标 $k$，表示每个时间步参数不同。

### 与 Transformer 复杂度对比

| 维度 | Mamba | Transformer |
|------|-------|-------------|
| 训练复杂度 | $O(L \cdot D^2)$ | $O(L^2 \cdot D)$ |
| 推理复杂度 | $O(L \cdot D)$ | $O(L \cdot D)$ |
| 内存复杂度 | $O(L \cdot D)$ | $O(L^2 \cdot D)$ |
| 序列长度外推 | 100K+ | 32K-200K |

实际内存对比：

| 序列长度 | Mamba 内存 | Transformer 内存 |
|----------|-----------|-----------------|
| 4K | 2GB | 4GB |
| 32K | 4GB | 32GB |
| 100K | 8GB | 不可行 |
| 1M | 16GB | 不可行 |

### 性能对比（2026 基准）

| 任务 | Transformer | Mamba-2 | 胜者 |
|------|------------|---------|------|
| 语言建模 | 12.3 | 12.1 | ≈ |
| 长序列（1M） | N/A | 15.2 | Mamba |
| DNA 建模 | 28.5 | 21.3 | Mamba |
| 代码生成 | 35.1 | 36.8 | ≈ |
| 训练速度 | 1x | 2-4x | Mamba |

短序列两者性能相当，长序列和特定领域（基因、音频）Mamba 显著领先 ^[inferred]。

### SSM-Transformer 混合架构

**Jamba** 采用 SSM 层 + Attention 层交替（比例约 4:1 或 8:1）：
- SSM 层处理长距离依赖（高效）
- long-context-models 层处理局部精细模式（精准）

**Mamba-2 融合注意力**将 SSM 计算统一到注意力框架中，并行计算后加权融合 ^[inferred]。

### 训练考量

SSM 的训练与 传统神经网络 有所不同：
- 需要硬件感知的并行扫描算法（不可用标准 autograd）
- 离散化参数 $\Delta$ 是可学习的
- 选择性参数 $B, C$ 的动态生成增加了计算开销但提升性能

### 多模态 SSM（2026）

- **Mamba-Vision**：空间 SSM 替代 ViT，训练速度 2x
- **Mamba-Language**：超长上下文 1M+ tokens，DNA 序列专用优化
- **Mamba-Multi**：统一多模态表示，跨模态注意力

## 开放问题

- SSM 能否在通用语言任务上完全超越 Transformer？ ^[ambiguous]
- 选择性机制的数学性质（表达能力边界）尚不完全清楚 ^[ambiguous]
- SSM 与 世界模型 的结合是否是通向 AGI 的路径？

## 来源

- 03_深度学习/02_神经网络核心/State_Space_Models_2026.md
- Gu & Dao (2023) "Mamba: Linear-Time Sequence Modeling with Selective State Spaces"
- Dao & Gu (2024) "Mamba-2: Transforming State Space Models"
- Lieber et al. (2024) "Jamba: A Hybrid Transformer-Mamba Language Model"

## Related

- [[概念/mamba]] — Mamba
- [[概念/retnet]] — RetNet
- [[概念/transformer-architecture]] — Transformer 架构
- [[概念/long-context-models]] — 长上下文模型
- [[03_深度学习/02_神经网络核心/11_State_Space_模型_2026]] — 状态空间模型 2026

## See Also (深度专题)

- [[05_大模型/02_序列模型/02_序列模型|序列模型深度解析]] — SSM/Mamba 与 Transformer 的系统性架构对比
- [[05_大模型/04_LLM架构/16_Transformer_替代架构|Transformer 替代架构]] — Mamba/RWKV/RetNet 等新架构全景

---

## 2026 SSM 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Mamba-2** | 结构化状态空间模型，线性复杂度 | GA |
| **Jamba** | Mamba + Transformer 混合架构 | GA |
| **RWKV-6** | 线性注意力 RNN，支持 128K 上下文 | GA |
| **RetNet** | 保留网络，训练并行/推理递归 | 研究 |
| **Hyena** | 长卷积替代注意力 | 研究 |

## 生产最佳实践

1. **长序列优势**：SSM 适合超长序列(100K+)，内存复杂度线性
2. **与 Transformer 混合**：生产环境考虑 Jamba 等混合架构
3. **推理速度**：SSM 推理速度比 Transformer 快 2-5x
4. **生态成熟度**：SSM 生态不如 Transformer 成熟，生产前充分测试
5. **场景匹配**：长文档/代码/时间序列场景优先考虑 SSM
6. **显存规划**：SSM 显存恒定，适合显存受限场景
7. **与 Transformer 对比**：同任务下对比质量和速度再决策

## SSM vs Transformer 对比

| 维度 | SSM (Mamba) | Transformer |
|------|-------------|-------------|
| **训练复杂度** | O(n) | O(n²) |
| **推理显存** | 恒定 | 随序列增长 (KV Cache) |
| **长序列吐量** | 优势显著 | 受 KV Cache 限制 |
| **复杂推理** | 较弱 | 强 |
| **生态成熟度** | 发展中 | 成熟 |
| **代表模型** | Mamba-2, Jamba | GPT-4, Llama 3, Qwen3 |

## 延伸阅读

- [[概念/LLM/mamba|Mamba]]
- [[概念/LLM/retnet|RetNet]]
- [[概念/LLM/transformer-architecture-plain|Transformer 架构]]
- [[03_深度学习/02_神经网络核心/11_State_Space_模型_2026|状态空间模型 2026]]
