---
title: "KV 缓存 2.0 (MLA / Multi-Head Latent Attention / DeepSeek 方案)"
category: concepts
tags:
  - inference
  - kv-cache
  - mla
  - multi-head-latent-attention
  - deepseek
  - kv-compression
aliases:
  - KV Cache 2.0
  - MLA
  - Multi-Head Latent Attention
  - DeepSeek MLA
  - Latent Attention
relationships:
  - target: "概念/kv-cache"
    type: extends
  - target: "概念/kv-cache-compression"
    type: related_to
  - target: "概念/multi-head-latent-attention"
    type: related_to
  - target: "概念/deepseek-series"
    type: related_to
summary: "KV 缓存 2.0 / MLA(Multi-Head Latent Attention)是 DeepSeek V2/V3/R1 2024-2025 突破"GQA / MQA 仍不够"的关键创新——把 KV 压缩到"潜在空间"(latent),用低秩联合压缩 K + V。70B 模型 KV 缓存从 280GB 降到 1.4GB(200x),长上下文推理成本可降 90%+,几乎无损。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "KV 缓存 2.0"
---

# KV 缓存 2.0 / MLA

> 中文简称：KV 缓存 2.0

> **一句话理解**:MLA(Multi-Head Latent Attention)是 DeepSeek 2024-06 提出的"KV 缓存终极压缩"——把 K + V 联合压缩到"潜在向量",推理时只缓存潜在向量,KV 体积缩小 200x,长上下文推理成本降 90%+。是 V2 / V3 / R1 的核心架构。

---

## 一、传统 KV 缓存的痛点

| 模型 | 隐藏维度 | 层数 | 头数 | KV/Token | 200K 上下文 KV |
|---|---|---|---|---|---|
| Llama 2 7B | 4096 | 32 | 32 | 524KB | 105GB |
| Llama 2 70B | 8192 | 80 | 64 | 2.6MB | 520GB |
| Llama 3 70B | 8192 | 80 | 64 | 2.6MB | 520GB |

**问题**:长上下文场景 KV 缓存爆炸,推理成本极高。

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 多头潜在注意力 | Multi-Head Latent Attention(MLA) | DeepSeek V2 核心 |
| 潜在空间 | Latent Space | 压缩后的低维空间 |
| 低秩联合压缩 | Low-Rank Joint Compression | K + V 一起压缩 |
| 矩阵吸收 | Matrix Absorption | 推理时把权重吸收到 Q |
| 键值缓存 | KV Cache | 推理缓存 |
| 压缩键值 | Compressed KV | MLA 缓存 |
| 解耦键 | Decoupled Key | RoPE 单独处理 |
| RoPE | Rotary Position Embedding | 旋转位置编码 |
| GQA | Grouped-Query Attention | 多 Q 共享 K/V |
| MQA | Multi-Query Attention | 所有 Q 共享 K/V |
| 共享专家 | Shared Experts | MoE 共享部分 |
| 路由专家 | Routed Experts | MoE 路由部分 |
| 推理优化 | Inference Optimization | MLA 目标 |
| 长上下文 | Long Context | 128K+ |
| 困惑度 | Perplexity | 衡量质量 |
| 位置编码 | Position Embedding | RoPE / ALiBi |
| 矩阵分解 | Matrix Decomposition | 低秩近似 |
| 8-bit 量化 | INT8 Quantization | MLA 可叠加 |

---

## 三、MLA vs 传统方案对比

| 方案 | KV/Token | 200K 上下文 KV | 质量损失 |
|---|---|---|---|
| **MHA(Multi-Head)** | 2.6MB | 520GB | 0%(基线) |
| **MQA(Multi-Query)** | 0.04MB | 8GB | <1% |
| **GQA-8** | 0.16MB | 32GB | <0.5% |
| **MLA(DeepSeek)** | **0.005MB** | **1.4GB** | **<0.1%** |
| **MLA + INT8** | 0.003MB | 0.7GB | <0.5% |

---

## 四、MLA 架构详解

### 4.1 训练时

```
Input hidden state h_t
   ↓
[Down Projection] → c_t(潜在向量,低维,如 512 维)
   ↓
c_t 同时恢复 K' 和 V' (上投影)
   ↓
[Decoupled RoPE K] → k_t_R(位置信息,单独)
   ↓
输出 K = [K'; k_t_R] / V = V'
```

### 4.2 推理时(关键!)

**不缓存 K' 和 V',只缓存 c_t(潜在向量)和 k_t_R**

需要 K' 时,**矩阵吸收**:
- 推理时 Q × (K')^T = (Q × W_UK) × c_t^T
- 把 W_UK 吸收到 Q 计算中
- 不需要恢复 K' 完整形式

### 4.3 显存节省

- K' 维度 = 128(头) × 128(头维度) × 2(K+V) = 32768
- c_t 维度 = 512(潜在)
- 压缩比:32768 / 512 = **64x**
- 加上 INT8 / INT4 量化,可叠加

---

## 五、DeepSeek V2/V3/R1 应用

### 5.1 DeepSeek V2(2024-05)

- 236B 总参 / 21B 激活
- MLA + DeepSeekMoE
- 训练成本仅 GPT-4 的 1/10

### 5.2 DeepSeek V3(2024-12)

- 671B 总参 / 37B 激活
- MLA + DeepSeekMoE + FP8 训练
- KV 缓存 1.4GB / 200K 上下文

### 5.3 DeepSeek R1(2025-01)

- 基于 V3,加 RL
- 同样 MLA 架构
- 长上下文推理成本极低

---

## 六、FlashMLA 详解(2025-02 开源)

### 6.1 核心创新

- 专为 Hopper H100 / H200 优化
- **Block-Sparse MLA**:只在必要 block 算 attention
- **Tensor Core 利用率** 90%+

### 6.2 性能

- **MLA 计算**:比 PyTorch eager 快 5x
- **显存**:与训练时 KV 体积相当
- **论文**:FlashMLA(2025-02)

### 6.3 实战

```python
import torch
from flash_mla import get_mla_metadata, flash_mla_with_kvcache

# Decode 模式
metadata = get_mla_metadata(...)
output = flash_mla_with_kvcache(
    q, k_cache, v_cache, ...,
    block_size=64,
    num_heads=128,
    head_dim=576,  # MLA 头维度
)
```

---

## 七、其他 KV 压缩方案对比

| 方案 | 团队 | 压缩比 | 质量损失 | 状态 |
|---|---|---|---|---|
| **MLA** | DeepSeek | 64x | <0.1% | GA |
| **GQA** | Google | 4x | <0.5% | GA |
| **MQA** | Google | 32x | <1% | GA |
| **KV Quantization** | 多团队 | 4-8x | <0.5% | GA |
| **StreamingLLM** | MIT | 4x | <2% | 学术 |
| **H2O** | 多团队 | 4x | <1% | 学术 |
| **Scissorhands** | 多团队 | 8x | <2% | 学术 |
| **FastGen** | Microsoft | 4x | <1% | GA |
| **ShadowKV** | 字节跳动 | 16x | <0.5% | 实验 |

---

## 八、生产最佳实践

1. **首选 MLA 架构**:DeepSeek V3 / R1 / V2 已验证。
2. **DeepSeek V3 部署**:vLLM / SGLang / TRT-LLM 原生 MLA。
3. **FlashMLA 加速**:H100 / H200 上必装。
4. **MLA + INT8 量化**:显存再降 2x,质量 < 0.5% 损失。
5. **200K 上下文场景**:MLA 是唯一可行方案(GQA 仍太贵)。
6. **Batch 推理**:MLA 显存优势在 batch 大时更明显。
7. **长文档 RAG**:MLA + 长上下文 + 摘要,极强。
8. **混合方案**:MLA 主模型 + GQA fallback,灵活。
9. **监控 KV 命中率**:> 95% 健康,< 80% 检查调度。
10. **A/B 测试**:MLA vs GQA 推理成本对比。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **MLA** | DeepSeek V2/V3/R1 标配,开源 |
| **FlashMLA** | v2.0(2025-12),性能 3x 提升 |
| **MLA 复制** | Kimi K2、GLM-5、Qwen 3 部分采用 |
| **vLLM** | v0.7+ 原生 MLA |
| **SGLang** | v0.4+ 支持 |
| **TensorRT-LLM** | v0.12+ 支持 |
| **企业应用** | 长上下文 RAG / Agent / 金融分析 |
| **ARR 规模** | 整体 LLM 推理市场 $2B+ |
| **竞品** | MLA / GQA / MQA / 量化 / 稀疏 |

---

## 十、See Also(官方源)

### 论文

- DeepSeek-V2 论文 [arxiv.org/abs/2405.04434](https://arxiv.org/abs/2405.04434)
- DeepSeek-V3 论文 [arxiv.org/abs/2412.19437](https://arxiv.org/abs/2412.19437)
- FlashMLA 论文 [arxiv.org/abs/2502.01089](https://arxiv.org/abs/2502.01089)

### 代码

- DeepSeek-V3 [github.com/deepseek-ai/DeepSeek-V3](https://github.com/deepseek-ai/DeepSeek-V3)
- FlashMLA [github.com/deepseek-ai/FlashMLA](https://github.com/deepseek-ai/FlashMLA)
- flash-attention 集成 [github.com/Dao-AILab/flash-attention](https://github.com/Dao-AILab/flash-attention)

### 推理框架

- vLLM MLA 支持 [docs.vllm.ai](https://docs.vllm.ai/)
- SGLang MLA [github.com/sgl-project/sglang](https://github.com/sgl-project/sglang)
- TensorRT-LLM [github.com/NVIDIA/TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM)

### 相关方案

- GQA 论文 [arxiv.org/abs/2305.13245](https://arxiv.org/abs/2305.13245)
- MQA 论文 [arxiv.org/abs/1911.02150](https://arxiv.org/abs/1911.02150)
- StreamingLLM [arxiv.org/abs/2309.17453](https://arxiv.org/abs/2309.17453)

---

## 十一、相关概念卡

- [[概念/kv-cache|Kv Cache]]
- [[概念/kv-cache-compression|Kv Cache Compression]]
- [[概念/multi-head-latent-attention|Multi Head Latent Attention]]
- [[概念/flashmla|Flashmla]]
- [[概念/deepseek-series|Deepseek Series]]
- [[概念/long-context-llm|Long Context Llm]]
- [[概念/flash-attention-kernels|Flash Attention Kernels]]
- [[概念/flashinfer|Flashinfer]]
