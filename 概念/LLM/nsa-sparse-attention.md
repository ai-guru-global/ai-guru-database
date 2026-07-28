---
title: NSA 原生稀疏注意力(Native Sparse Attention)
category: concepts
tags:
  - llm
  - attention-mechanism
  - sparse-attention
  - nsa
  - deepseek
  - long-context
aliases:
  - Native Sparse Attention
  - 原生稀疏注意力
  - NSA
  - 硬件对齐稀疏注意力
relationships:
  - target: "概念/llm-architectures"
    type: evolves_from
  - target: "概念/long-context-llm"
    type: related_to
  - target: "概念/flash-attention-kernels"
    type: related_to
summary: NSA(Native Sparse Attention, DeepSeek 2025-02, arXiv:2502.11089)是**原生可训练**的稀疏注意力机制,通过"压缩 + 选择 + 滑动窗口"三分支动态稀疏策略,在 64K 序列上实现**解码 11.6×、前向 9.0×、反向 6.0×** 加速,同时 MMLU/LongBench/推理任务**性能超越全注意力基线**;DeepSeek 创始人梁文锋亲自挂名。NSA 是 2025 之后所有长上下文 LLM 架构的范式参考。
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources:
  - NSA arXiv:2502.11089(DeepSeek)
  - DeepSeek-V3 论文对比
  - HuggingFace NSA 实现 lucidrains
  - DeepSeek 官方 GitHub
  - TriDao Mamba NSA Kernel
name_zh: "NSA 原生稀疏注意力"
---

# NSA 原生稀疏注意力(Native Sparse Attention)

> 中文简称：NSA 原生稀疏注意力

## 一句话总结

**NSA(Native Sparse Attention)** 是 DeepSeek 2025-02 提出的**原生可训练**稀疏注意力机制(arXiv:2502.11089,梁文锋亲自挂名),通过"压缩 + 选择 + 滑动窗口"三分支动态策略,在 64K 序列上**解码 11.6×、前向 9.0×、反向 6.0×** 加速;**关键反直觉发现**:用 NSA 预训练的模型在 MMLU/LongBench/AIME 推理任务上**全面超越全注意力基线**,2025 之后所有长上下文 LLM 架构(Mamba-2、Sliding Window Attention、Linear Attention)都被迫以 NSA 为参照。

---

## 1. 核心问题:为什么需要 NSA?

### 1.1 标准注意力的瓶颈

Transformer 的 softmax 注意力复杂度 O(n²),在 64K 序列上:
- **解码阶段**:softmax 注意力占**总延迟 70-80%**(Hoffmann et al. 估算)
- **内存**:KV cache O(n × d × layers × heads)
- **算力**:FLOPs 随长度二次增长

### 1.2 现有稀疏方法的三大缺陷

| 缺陷 | 表现 |
|---|---|
| **事后稀疏(推理时)** | 在预训练全注意力上剪枝,模型偏离优化轨迹 |
| **不兼容 GQA/MQA** | 每个 head 独立选 KV,与 GQA 共享 KV 的内存访问设计冲突 |
| **非训练感知** | 离散选择(聚类/SimHash)无法反向传播,梯度阻断 |

> NSA 的核心洞察:**稀疏必须"原生"地从预训练阶段就融入**,而非"事后剪枝"。

---

## 2. NSA 三分支动态稀疏策略

NSA 对每个查询 q_t 维护三个并行分支,门控融合:

### 2.1 三分支总览

| 分支 | 作用 | 参数量 | 频率 |
|---|---|---|---|
| **压缩分支(Compression)** | MLP 聚合连续 token 块 → 粗粒度全局信息 | 中(MLP) | 始终 |
| **选择分支(Selection)** | 基于压缩分数选 top-n 块 → 细粒度关键信息 | 轻(门控) | 始终 |
| **滑动窗口(Sliding Window)** | 维护最近 w=512 token → 局部上下文 | 几乎无 | 始终 |

### 2.2 数学形式

$$
\tilde{K}_t = f_K(q_t, k_{:t}, v_{:t}), \quad \tilde{V}_t = f_V(q_t, k_{:t}, v_{:t})
$$

$$
o_t^* = \sum_{c \in \{cmp, slc, win\}} g_t^c \cdot \text{Attn}(q_t, \tilde{K}_t^c, \tilde{V}_t^c)
$$

> **关键约束**:N_t = Σ size[tilde K_t^c] ≪ t,保持高稀疏率;三个分支有**独立的 K 和 V**(防止捷径学习,梯度隔离)。

### 2.3 关键超参(DeepSeek 27B 实验)

| 参数 | 值 | 含义 |
|---|---|---|
| 压缩块长 l | 32 | 每块 32 token |
| 滑动步长 d | 16 | 块间重叠,避免信息碎片化 |
| 选择块长 l' | 64 | 选择粒度 |
| 选择块数 n | 16 | top-16 块 |
| 滑动窗口 w | 512 | 最近 512 token 全注意力 |

---

## 3. 硬件对齐 Kernel 设计

### 3.1 为什么需要 Triton 自定义 Kernel?

| 阶段 | 标准 FlashAttention | NSA 挑战 |
|---|---|---|
| 预填充/训练 | ✅ 高吞吐 | 选择性 KV 加载不连续 |
| 解码 | ✅ 内存优化 | GQA 共享 KV 的稀疏访问模式冲突 |

### 3.2 Group-Centric Data Loading

```text
对于 GQA 组内的 h 个 query 头:
  1. 把 h 个 query 头同时加载到 SRAM
  2. 加载它们共享的稀疏 KV 块(按 It 索引)
  3. 内层循环按 I_t 顺序加载连续 KV 块
  4. 外层用 Triton 网格调度
```

**两项关键优化**:
1. **组内共享消除冗余 KV 传输**
2. **SM 间平衡工作负载**

→ 实现**接近最佳算术强度**(每次内存访问支撑足够多 FLOPs)

---

## 4. 核心实验结果(DeepSeek 27B,8K 预训练 + 32K 持续训练)

### 4.1 通用基准(与全注意力比较)

| 基准 | NSA 27B | 全注意力 27B | 优势 |
|---|---|---|---|
| **MMLU** | 略胜 | 基线 | 7/9 任务超越 |
| **CMMLU** | 略胜 | 基线 | ✅ |
| **GSM8K** | 显著 | 4.6% | 8.4% (NSA) |
| **DROP** | 显著 | 较弱 | 复杂推理领先 |

### 4.2 长上下文(LongBench)

| 任务 | NSA 27B | 全注意力 27B | Exact-Top | Quest |
|---|---|---|---|---|
| **LongBench 平均** | **0.469** | 0.437 | 0.423 | 0.392 |
| **多跳 QA** | **+8.7%** | 基线 | - | - |
| **代码理解** | **+6.9%** | 基线 | - | - |

### 4.3 推理能力

| 任务 | NSA 8K CoT | NSA 16K CoT | 全注意力 8K | 全注意力 16K |
|---|---|---|---|---|
| **AIME 24** | 12.1% | 14.6% | 4.6% | 9.2% |

> **AIME 12.1% vs 4.6%**——NSA 在数学竞赛题上**几乎翻 3 倍**,核心源自"压缩"过滤了无关注意力路径。

### 4.4 64K 加速(8×A100,64K 序列)

| 阶段 | NSA 加速比 |
|---|---|
| **解码** | **11.6×** |
| **前向传播** | 9.0× |
| **反向传播** | 6.0× |

> **"大海捞针"测试**:NSA 在 64K 序列任意位置**100% 准确率**。

---

## 5. NSA 的"反直觉"性能:为什么稀疏反而更好?

| 解释 | 出处 |
|---|---|
| **去噪效应**:稀疏过滤冗余 token,让模型更专注 | 论文 6.2 节 |
| **块状聚类现象**:注意力分数天然呈块状分布(可视化) | 论文 6.2 |
| **预训练即学稀疏**:模型从小就在"高效阅读"环境下训练 | 论文 4.3 |
| **压缩分支的归纳偏置**:类似人类先看摘要再精读 | 人类认知类比 |

---

## 6. 2026 生态速览

| 流派 | 代表 | 立场 |
|---|---|---|
| **NSA 派(原生稀疏)** | DeepSeek、NSA 后续工作 | 预训练即稀疏,11.6× 加速 |
| **Linear Attention 派** | Mamba-2、RWKV、RetNet | O(n) 复杂度 |
| **Sliding Window 派** | Mistral、Mixtral | 固定窗口 + 稀疏全局 |
| **Hybrid 派** | Jamba、Mamba-Transformer 混合 | 局部 Transformer + 全局 SSM |
| **Full Attention 派** | GPT-4o、Claude 3.5、Qwen-2.5 | 算力充足时仍最优 |
| **Diffusion 派** | LLaDA、Mercury | 双向稀疏 + 全局感知 |

---

## 7. 生产最佳实践

### 7.1 何时选 NSA?

| 场景 | 选型 |
|---|---|
| **64K+ 长文档 / 仓库级代码** | ✅ NSA 必选(11.6× 加速) |
| **多轮长对话(1M+ tokens)** | ✅ NSA + Sliding Window |
| **128K 上下文** | ⚠️ Full Attention 仍可(算力够) |
| **8K 短上下文** | ❌ Full Attention 更快(无需稀疏) |
| **推理任务(AIME/MATH/Code)** | ✅ NSA 显著更好(+8% 提升) |
| **极低延迟实时对话** | ✅ NSA 解码 11.6× 加速 |

### 7.2 工程模板

```python
# NSA 三分支融合
def nsa_attention(q, k, v, l=32, d=16, l_prime=64, n=16, w=512):
    # 1. 压缩分支:块级 MLP 聚合
    k_cmp = block_mlp_compress(k, l, d)  # [n_blocks, d]
    
    # 2. 选择分支:基于压缩分数选 top-n 块
    importance = softmax(q @ k_cmp.T)  # [1, n_blocks]
    top_blocks = topk(importance, n)   # [n]
    k_sel = k[top_blocks].reshape(n * l_prime, -1)  # 选中的 KV
    
    # 3. 滑动窗口
    k_win = k[-w:]; v_win = v[-w:]
    
    # 4. 门控融合
    g_cmp, g_sel, g_win = gate_mlp(q)  # [3] softmax
    out = g_cmp * attn(q, k_cmp, v_cmp) + \
          g_sel * attn(q, k_sel, v_sel) + \
          g_win * attn(q, k_win, v_win)
    return out
```

### 7.3 训练建议

| 决策 | 推荐 |
|---|---|
| **预训练起点** | 必须从 0 开始训练(不能后接全注意力) |
| **数据** | 长文档 + 代码(让选择分支学会"选关键") |
| **学习率** | 与全注意力一致(无额外约束) |
| **稀疏率** | N_t / t = 16 × 64 / 65536 ≈ 1.5%(激进稀疏) |
| **GQA 组数** | 4(与 DeepSeek-V3 一致) |

### 7.4 推理部署

| 决策 | 推荐 |
|---|---|
| **Triton kernel** | 必须,否则加速不显 |
| **batch_size** | 越大加速比越高(>32 时 ~10×) |
| **长度 > 8K** | 显著优势(<8K 时全注意力更快) |
| **多查询实例** | KV cache 节省 4-10×,节省显存 |

---

## 8. NSA vs 主流长上下文方案

| 方案 | 复杂度 | 训练时可用? | 推理加速 | 性能 |
|---|---|---|---|---|
| **Full Attention** | O(n²) | ✅ | ❌(基线) | 基线 |
| **NSA(原生稀疏)** | O(n × √n) | ✅ | **11.6×** | **超越** |
| **Mamba-2(SSM)** | O(n) | ✅ | ~3× | 略低于 Attention |
| **Linear Attention** | O(n) | ✅ | ~5× | 略低 |
| **Sliding Window** | O(n × w) | ✅ | ~8× | 中等 |
| **H2O(事后剪枝)** | O(n²) 预填充 | ❌ | ~2× | 明显下降 |
| **Quest(查询感知)** | O(n × n_blk) | ❌ | ~3× | 中等 |

> **唯一同时满足"原生训练 + 训练感知 + 硬件对齐 + 性能超越"的方案** = NSA。

---

## 9. See Also(官方源)

| 来源 | 链接 |
|---|---|
| **NSA 论文 arXiv:2502.11089** | https://arxiv.org/abs/2502.11089 |
| **DeepSeek 官方 GitHub** | https://github.com/deepseek-ai |
| **HuggingFace PyTorch 实现(lucidrains)** | https://github.com/lucidrains/native-sparse-attention-pytorch |
| **DeepSeek-V3 论文(对比基线)** | https://arxiv.org/abs/2412.19437 |
| **Mamba-2(SSM 替代方案)** | https://arxiv.org/abs/2312.00752 |
| **FlashAttention-2(底层基础)** | https://arxiv.org/abs/2307.08691 |
| **关键术语英中对照** | Native Sparse Attention / Compressed Attention / Selected Attention / Sliding Window / Block-wise Sparsity / GQA-Sharing / Arithmetic Intensity / Triton Kernel |

---

## 10. 一句话结论(2026)

**NSA 是 2025 长上下文 LLM 架构的"分水岭"——首次证明"原生稀疏"既能在 64K 上 11.6× 加速,又能在 AIME/LongBench/MMLU 上**反超**全注意力;梁文锋挂名 + DeepSeek 实战背书 + 全部代码开源,使 NSA 成为 2026 之后所有长上下文 LLM 架构设计的"必读论文"和"基线对照"——Full Attention 在 64K+ 场景不再是默认选择。**

## 相关链接

- [[概念/LLM/attention-variants|注意力变体]] — 稀疏注意力家族
- [[概念/Inference/flash-attn|Flash Attention]] — 同类高效注意力机制
- [[概念/LLM/kv-cache-compression|KV 缓存压缩]] — 稀疏注意力降低 KV 缓存
- [[05_大模型/05_LLM_Architectures/Long_Context_Models_2026|长上下文模型 2026]] — 稀疏注意力对长上下文的意义
- [[概念/LLM/long-context-llm|长上下文 LLM]] — NSA 的主要应用场景
