---
title: Grouped-Query Attention (GQA)
category: -concepts
tags: [attention, kv-cache, gqa, mqa, mha, inference-optimization, transformer]
relationships:
  - target: "概念/LLM/transformer-architecture"
    type: extends
  - target: "概念/LLM/multi-head-latent-attention"
    type: related_to
  - target: "概念/LLM/attention-variants"
    type: related_to
  - target: "概念/Inference/kv-cache"
    type: optimizes
sources:
  - 部署推理/Inference_Performance/Inference_Terms_for_dummy.md
  - "https://arxiv.org/abs/2305.13245"  # GQA paper
summary: GQA 让多个 query 头共享同一组 K/V 头，折中 MHA 的精度和 MQA 的 KV Cache 压缩，是 Llama 3、Qwen 2、Mistral 等 2024-2026 主流模型的默认注意力机制。KV Cache 降至 MHA 的 1/4~1/8，decode 吐吐量提升 30-50%。
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
lifecycle_changed: 2026-06-15
tier: core
created: 2026-06-15
updated: 2026-07-21
aliases:
  - "Grouped Query Attention"
  - "grouped query attention"
  - "GQA"

---
# Grouped-Query Attention (GQA)

> GQA 让多个 query 头共享同一组 K/V 头，在精度和 KV Cache 压缩之间取平衡——2024-2026 主流模型的默认选择。

## 大白话

LLM 有很多个“注意力头”，每个头都要记前面 token 的笔记（KV Cache）。

- **MHA**：32 个头各记各的，笔记最厚。
- **GQA**：32 个头分成 8 组，每组共用一份笔记，笔记变薄。
- **MQA**：所有头共用一份笔记，最薄。

GQA 是“折中方案”：比 MHA 省显存，比 MQA 精度高。

## 三种注意力对比

```
MHA (Multi-Head Attention):
Q: [H1 Q][H2 Q][H3 Q]...[H32 Q]   ← 32 个独立 Q 头
K: [H1 K][H2 K][H3 K]...[H32 K]   ← 32 个独立 K 头
V: [H1 V][H2 V][H3 V]...[H32 V]   ← 32 个独立 V 头
KV Cache: 32 × 2 × d_head × seq_len

GQA (Grouped-Query Attention, G=8):
Q: [H1 Q][H2 Q][H3 Q]...[H32 Q]   ← 32 个 Q 头
K: [G1 K]  [G2 K]  ...  [G8 K]    ← 8 个 K 头 (每 4 个 Q 共享)
V: [G1 V]  [G2 V]  ...  [G8 V]    ← 8 个 V 头
KV Cache: 8 × 2 × d_head × seq_len  ← 降至 1/4

MQA (Multi-Query Attention):
Q: [H1 Q][H2 Q][H3 Q]...[H32 Q]   ← 32 个 Q 头
K: [     1 K     ]              ← 1 个 K 头 (所有 Q 共享)
V: [     1 V     ]              ← 1 个 V 头
KV Cache: 1 × 2 × d_head × seq_len  ← 降至 1/32
```

## 性能影响量化

| 指标 | MHA (32头) | GQA (8组) | MQA (1组) |
|------|:--------:|:-------:|:-------:|
| KV Cache 大小 | 100% | **25%** | 3.1% |
| Decode 吐吐量 | 基线 | **+30-50%** | +60-80% |
| 模型精度 | 最佳 | 接近 MHA | 略有下降 |
| 显存占用 (7B, 4K ctx) | ~2 GB | ~0.5 GB | ~0.06 GB |
| 训练成本 | 基线 | 相同 | 相同 |

## 主流模型采用情况 (2024-2026)

| 模型 | 注意力类型 | Q 头数 | KV 头数 | 压缩比 |
|------|----------|:-----:|:-----:|:-----:|
| **Llama 3 70B** | GQA | 64 | 8 | 8:1 |
| **Qwen2.5 72B** | GQA | 64 | 8 | 8:1 |
| **Mistral 7B** | GQA | 32 | 8 | 4:1 |
| **Gemma 2 9B** | MHA+GQA 混合 | 16 | 8 | 交替 |
| **DeepSeek-V3** | MLA | 128 | 压缩 | 极致 |
| **Falcon 40B** | MQA | 128 | 1 | 128:1 |

## 为什么影响推理速度

Decode 阶段每生成一个 token 都要读取全部 KV Cache。GQA 把 KV Cache 降到原来的 1/4 ~ 1/8：

- **内存带宽压力降低**：Decode 是 memory-bound，读取量减少直接提升 TPOT
- **并发容量增加**：同样显存可容纳更多并发请求
- **长上下文受益更大**：seq_len 越长，KV Cache 节省越显著

## 与 MLA 的关系

| 维度 | GQA | MLA (Multi-head Latent Attention) |
|------|-----|-----|
| 压缩方式 | 减少 KV 头数 | 低秩投影压缩 KV |
| 压缩比 | 4-8× | 10-20× |
| 精度损失 | 极小 | 极小 (解耦 RoPE) |
| 代表模型 | Llama 3, Qwen2.5 | DeepSeek-V3 |
| 复杂度 | 低 | 中 |

## 推理引擎支持

所有主流推理引擎均原生支持 GQA：

| 引擎 | GQA 支持 | 优化方式 |
|------|:------:|----------|
| vLLM | ✅ | PagedAttention 自动适配 KV 头数 |
| SGLang | ✅ | FlashInfer 算子原生支持 |
| TensorRT-LLM | ✅ | 编译时自动优化 |
| LMDeploy | ✅ | TurboMind 内核适配 |
| llama.cpp | ✅ | GGUF 格式记录 KV 头数 |

## 生产最佳实践

1. **模型选型优先 GQA**：2024+ 新模型基本都采用 GQA，无需额外配置
2. **KV Cache 量化叠加**：GQA + KV INT8 可进一步压缩至 1/8 × 1/2 = 1/16
3. **长上下文场景受益最大**：128K+ 场景下 GQA 的显存优势更加显著
4. **不要混淆 GQA 和 MoE**：GQA 是注意力层优化，MoE 是 FFN 层优化，二者正交

## GQA vs MHA vs MQA vs MLA

| 架构 | KV 头数 | 显存占用 | 质量 | 代表模型 |
|------|---------|----------|------|----------|
| **MHA** | = Q 头数 | 最高 | 最佳 | GPT-3, Llama 1 |
| **GQA** | 1 < KV < Q | 中 | 接近 MHA | Llama 3, Qwen3 |
| **MQA** | 1 | 最低 | 略低 | Falcon, StarCoder |
| **MLA** | 低秩压缩 | 极低 | 接近 MHA | DeepSeek-V3 |

## 显存计算示例

```python
# 70B 模型，32K 上下文，GQA (8 KV heads)
num_layers = 80
num_kv_heads = 8
head_dim = 128
seq_len = 32768
bytes_per_element = 2  # BF16

# KV Cache 大小
kv_cache_bytes = (
    2 *  # K and V
    num_layers *
    num_kv_heads *
    head_dim *
    seq_len *
    bytes_per_element
)
print(f"KV Cache: {kv_cache_bytes / 1e9:.1f} GB")  # ~10.7 GB

# 对比 MHA (64 heads)
mha_bytes = kv_cache_bytes * (64 / 8)
print(f"MHA KV Cache: {mha_bytes / 1e9:.1f} GB")  # ~85.9 GB
```

## 2026 生态现状

| 类别 | 状态 | 说明 |
|------|------|------|
| **新模型标配** | 普及 | 2024+ 几乎所有新模型采用 GQA |
| **MLA 兴起** | 发展 | DeepSeek 推动 MLA 成为新趋势 |
| **引擎支持** | 完善 | 所有主流引擎原生支持 |
| **与量化叠加** | 成熟 | GQA + FP8 KV Cache 成为标配 |

## Related

- [[概念/LLM/attention-variants]] — 注意力变体
- [[概念/LLM/multi-head-latent-attention]] — MLA
- [[概念/Inference/kv-cache]] — KV Cache
- [[概念/Inference/kv-cache-compression]] — KV Cache 压缩
- [[部署推理/Inference_Performance/Inference_Terms_for_dummy|推理性能术语大白话 解释]]

## GQA 显存计算示例

```
模型: Llama 3 70B
- 层数: 80, Q 头数: 64, KV 头数: 8, 头维度: 128
- 序列长度: 4096, 精度: FP16 (2 bytes)

MHA KV Cache:  80 × 64 × 4096 × 128 × 2 × 2 = 10.7 GB
GQA KV Cache:  80 × 8  × 4096 × 128 × 2 × 2 = 1.34 GB
压缩比: 8x (等于 Q/KV 头数比 64/8)

结论: GQA 使 70B 模型在单卡 80GB 上可服务 4K 上下文
```

## GQA 配置与推理引擎支持

| 引擎 | GQA 支持 | 配置方式 |
|------|---------|----------|
| **vLLM** | 自动识别 | 无需配置 |
| **SGLang** | 自动识别 | 无需配置 |
| **TensorRT-LLM** | 自动识别 | 无需配置 |
| **llama.cpp** | 自动识别 | GGUF 元数据 |
| **HuggingFace** | 模型配置 | num_key_value_heads |

## 生产最佳实践

1. **无需手动配置**：推理引擎自动识别 GQA 架构
2. **叠加 KV INT8**：GQA + KV 量化可进一步压缩 2x
3. **长上下文优先 GQA**：避免 MHA 的显存爆炸
4. **批处理效率**：GQA 模型批处理效率显著高于 MHA
5. **模型选型关注**：优先选择 GQA/MLA 架构的模型
