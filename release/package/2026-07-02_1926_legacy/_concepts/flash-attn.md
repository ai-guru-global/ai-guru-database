---
title: "Flash Attention (高效注意力内核)"
category: -concepts
tags: ["attention", "gpu", "memory-efficiency", "cuda", "inference", "training"]
relationships:
  - target: "_concepts/vllm"
    type: related_to
  - target: "_concepts/sglang"
    type: related_to
  - target: "_concepts/triton-server"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "通过 IO 感知的分块算法大幅降低 Transformer 注意力计算的显存占用与延迟，已成为 LLM 推理/训练的事实标准内核。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.90
lifecycle: stable
tier: core
---

# Flash Attention

[Flash Attention](https://github.com/Dao-AILab/flash-attention) 是由 Tri Dao 等人提出的 IO 感知（IO-aware）的精确注意力计算算法，通过**分块计算（Tiling）和重计算（Recomputation）**策略，将 Transformer 注意力机制的显存复杂度从 O(N²) 降低到 O(N)，同时利用 GPU SRAM（共享内存）的高带宽特性大幅提升计算速度。Flash Attention 已成为几乎所有 LLM 推理引擎和训练框架的**标配内核**。

## 核心原理

### 标准注意力 vs Flash Attention

```
标准注意力 (Standard Attention):
1. S = Q @ K^T         → 写入 O(N²) 到 HBM
2. P = softmax(S)      → 读取 O(N²) 从 HBM
3. O = P @ V            → 写入 O(N²) 到 HBM

瓶颈: HBM 带宽（不是计算）

Flash Attention:
1. 将 Q, K, V 分成 blocks
2. 对每个 block:
   a. 加载 Q_block, K_block, V_block 到 SRAM
   b. 在 SRAM 中计算 S_block = Q_block @ K_block^T
   c. 在 SRAM 中计算 P_block = softmax(S_block)
   d. 在 SRAM 中累加 O_block += P_block @ V_block
3. 写回 O 到 HBM

关键: 永远不在 HBM 中存储完整的 N×N 注意力矩阵
```

### 复杂度对比

| 指标 | 标准注意力 | Flash Attention |
|------|-----------|----------------|
| **显存** | O(N²) | O(N) |
| **FLOPs** | O(N²d) | O(N²d) |
| **HBM 读写** | O(N²d + N²) | O(N²d²/M) |
| **精确性** | 精确 | 精确（非近似） |

> M = SRAM 大小, d = head 维度, N = 序列长度

### GPU 内存层次

```
GPU 内存层次 (A100):

SRAM (Shared Memory):
  容量: 192 KB/SM
  带宽: ~19 TB/s
  延迟: 极低

HBM (高带宽显存):
  容量: 80 GB
  带宽: ~2 TB/s
  延迟: 高

→ Flash Attention 将计算搬到 SRAM，避免频繁的 HBM 读写
```

## 版本演进

### Flash Attention 1

- **论文**: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness" (2022)
- **核心**: Tiling + Online Softmax
- **加速**: 2-4x (A100)
- **限制**: 仅前向 + 反向，需存储 softmax 统计量

### Flash Attention 2

- **论文**: "FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning" (2023)
- **改进**: 减少非 MatMul FLOPs、优化线程块分配
- **加速**: 50-73% 更快（vs Flash Attention 1）
- **效率**: 达到 A100 理论峰值的 50-73%

### Flash Attention 3

- **论文**: 2024
- **改进**: 利用 H100 的 TMA（Tensor Memory Accelerator）、异步执行
- **加速**: 1.5-2x (vs Flash Attention 2)
- **特性**: WGMMA 指令、低精度(FP8)支持

## 核心特性

### 1. 精确注意力

Flash Attention 是**精确计算**，不是近似：
- 不使用 LSH（局部敏感哈希）
- 不使用稀疏注意力
- 数学上等价于标准注意力

### 2. 支持的架构

| 架构 | Flash Attention 2 | Flash Attention 3 |
|------|-------------------|-------------------|
| **Ampere (A100)** | ✅ | ❌ |
| **Ada (RTX 4090)** | ✅ | ❌ |
| **Hopper (H100)** | ✅ | ✅ |
| **Blackwell (B200)** | 待确认 | ✅ |

### 3. 支持的功能

```python
# 基础 MHA
from flash_attn import flash_attn_func
output = flash_attn_func(q, k, v, causal=True)

# GQA (Grouped Query Attention)
from flash_attn import flash_attn_func
# q: [batch, seqlen, nheads_q, headdim]
# k: [batch, seqlen, nheads_kv, headdim]  (nheads_kv < nheads_q)
output = flash_attn_func(q, k, v, causal=True)

# MQA (Multi-Query Attention)
# k, v: [batch, seqlen, 1, headdim]
output = flash_attn_func(q, k, v, causal=True)

# FlashDecoding (推理优化)
from flash_attn import flash_attn_with_kvcache
output = flash_attn_with_kvcache(
    q, k_cache, v_cache,
    causal=True,
    window_size=(-1, 1024)  # 滑动窗口
)

# 可变长度序列 (不 padding)
from flash_attn import flash_attn_varlen_func
output = flash_attn_varlen_func(
    q, k, v,
    cu_seqlens_q, cu_seqlens_k,
    max_seqlen_q, max_seqlen_k
)
```

### 4. 集成生态

Flash Attention 已被广泛集成：

| 框架 | 集成方式 |
|------|----------|
| **vLLM** | 默认注意力后端 |
| **SGLang** | 默认注意力后端 |
| **Transformers** | `attn_implementation="flash_attention_2"` |
| **NeMo** | Megatron 内置 |
| **DeepSpeed** | 可配置后端 |
| **xFormers** | memory_efficient_attention |

## 安装

```bash
# pip (需要 CUDA toolkit)
pip install flash-attn --no-build-isolation

# 或从源码编译 (需要匹配 CUDA 版本)
git clone https://github.com/Dao-AILab/flash-attention.git
cd flash-attention
python setup.py install

# 预编译 wheel (推荐)
# 从 GitHub Releases 下载对应 CUDA/PyTorch 版本的 wheel
```

## 在 AI Stack 中的角色

### 推理加速

```
vLLM 推理流程:
Prompt → Tokenize → Prefill (Flash Attention) → Decode (PagedAttention) → Output

- Prefill: Flash Attention 处理 Prompt 的并行注意力
- Decode: PagedAttention 处理 Token-by-Token 生成
- 两者互补：Flash Attn 优化并行计算，PagedAttn 优化 KV Cache
```

### 训练加速

```
训练中的注意力计算:
前向: Flash Attention (减少激活显存)
反向: Flash Attention (重计算代替存储)

效果:
- 7B 模型训练显存减少 ~40%
- 训练速度提升 ~2x (A100)
- 支持更长的序列长度
```

## 性能基准 (A100 80GB)

| 模型 | 序列长度 | 标准注意力 | Flash Attn 2 | 提升 |
|------|----------|-----------|-------------|------|
| Llama-7B | 2048 | 1.0x | 2.1x | +110% |
| Llama-13B | 4096 | 1.0x | 2.5x | +150% |
| Llama-70B | 8192 | OOM | ✅ | ∞ |

## K8s 生产注意事项

- **CUDA 版本匹配**: 容器 CUDA 版本必须与 Flash Attention 编译版本一致
- **GPU 架构**: A100/H100 需不同的 wheel
- **构建时间**: 从源码编译需要 10-30 分钟（推荐预编译镜像）
- **内存**: 编译时需要 ~16GB RAM（CI 中需注意）

## 参考资源

- [Flash Attention GitHub](https://github.com/Dao-AILab/flash-attention)
- [Flash Attention 论文](https://arxiv.org/abs/2205.14135)
- [Flash Attention 2 论文](https://arxiv.org/abs/2307.08691)
- [Tri Dao 实验室](https://dao-ailab.github.io/)

## 相关概念

- [[_concepts/vllm]] — vLLM 高性能推理引擎
- [[_concepts/sglang]] — SGLang 结构化生成语言
- [[_concepts/triton-server]] — NVIDIA Triton 推理服务器
- [[_concepts/onnx]] — ONNX 开放神经网络交换格式
- [[_concepts/exllama]] — ExLlamaV2 量化推理引擎
