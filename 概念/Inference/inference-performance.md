---
title: Inference Performance
category: -concepts
tags: [inference, performance, latency, throughput, optimization, benchmarking, ttft, tpot]
relationships:
  - target: "概念/Inference/kv-cache"
    type: optimized_by
  - target: "概念/Inference/paged-attention"
    type: optimized_by
  - target: "概念/Inference/continuous-batching"
    type: optimized_by
  - target: "概念/Inference/speculative-decoding"
    type: optimized_by
  - target: "概念/Inference/prefill-decode"
    type: decomposed_into
  - target: "概念/Inference/request-scheduling"
    type: related_to
  - target: "概念/Inference/quantization"
    type: related_to
  - target: "部署推理/Inference_Performance/README"
    type: deepened_by
sources:
  - 部署推理/Inference_Performance/README.md
  - 部署推理/Inference_Performance/Inference_Performance_Fundamentals.md
summary: LLM 推理性能工程关注 TTFT、TPOT、吞吐、QPS 等核心指标，通过计算优化、KV Cache 优化、调度优化和系统架构优化，降低延迟并提高资源利用率。
lifecycle: draft
tier: core
created: 2026-06-15
updated: 2026-07-21
aliases:
  - "Inference Performance"
  - "inference performance"
  - "推理性能"

---
# Inference Performance（推理性能）

> 推理性能工程就是：**用更少的资源、更低的延迟、更高的吞吐，把 LLM 推理服务跑得更稳更快。**

## 核心指标体系

| 指标 | 全称 | 含义 | 典型目标 |
|------|------|------|----------|
| **TTFT** | Time To First Token | 首 token 延迟 | <500ms (P99) |
| **TPOT** | Time Per Output Token | 每 token 生成延迟 | <50ms (P99) |
| **Throughput** | 吞吐量 | tokens/s (GPU) | 最大化 |
| **QPS** | Queries Per Second | 每秒处理请求数 | 根据 SLO |
| **E2E Latency** | 端到端延迟 | 请求到完整响应 | <5s (P95) |
| **Tokens/s/user** | 用户体感速度 | 单用户每秒看到多少字 | >30 tokens/s |

## 两阶段瓶颈分析

| 阶段 | 计算特征 | 瓶颈 | 优化方向 |
|------|----------|------|----------|
| **Prefill** | 算力密集 (Compute-bound) | GPU FLOPS | FlashAttention、TP、量化 |
| **Decode** | 带宽密集 (Memory-bound) | 显存带宽 | KV Cache 压缩、Batching、投机解码 |

```
Prefill: 一次处理所有输入 token → 计算量大但只执行一次
Decode:  每次生成 1 个 token → 计算量小但要重复 N 次
```

## 四大优化方向

### 1. 计算优化

| 技术 | 效果 | 适用阶段 |
|------|------|----------|
| FlashAttention-3 | 减少 HBM 访问，加速 2-3× | Prefill + Decode |
| FP8 计算 | H100 算力翻倍 | Prefill |
| CUDA Graph | 消除 kernel launch 开销 | Decode |
| 算子融合 | 减少内存读写 | 全局 |

### 2. 显存 / KV Cache 优化

| 技术 | 效果 |
|------|------|
| PagedAttention | 消除显存碎片，利用率 +30% |
| KV Cache 量化 (FP8) | 显存减半 |
| GQA/MLA | 从架构减少 KV 头数 |
| Prefix Caching | 复用公共前缀 KV |
| Sliding Window | 限制 KV 长度 |

### 3. 调度与并发优化

| 技术 | 效果 |
|------|------|
| Continuous Batching | GPU 利用率 40%→90% |
| Chunked Prefill | TTFT P99 降低 50-70% |
| Speculative Decoding | 单请求加速 2-3× |
| Prefill/Decode 分离 | 各自独立优化 |

### 4. 系统架构优化

| 技术 | 效果 |
|------|------|
| Tensor Parallel | 多卡并行降低单请求延迟 |
| Pipeline Parallel | 跨机扩展 |
| NVLink/InfiniBand | 高速通信 |
| 弹性扩缩容 | 应对流量波动 |

## 影响推理速度的六大因素

1. **模型本身**: 参数越多通常越慢；但 MoE、MLA/GQA 等结构可以用更少的实际计算和更小的 KV Cache 跑得更快。
2. **硬件三件套**: 算力（FLOPS）决定 prefill 多快；显存带宽决定 decode 多快；显存大小决定能跑多长的上下文。
3. **输入输出长度**: 输入越长，首字等待越久；输出越长，总时间越久。
4. **软件优化**: FlashAttention、KV Cache 压缩、Continuous Batching、量化、投机解码都能显著提速。
5. **并发与调度**: 请求太少 GPU 吃不饱；请求太多大家排队。好的调度器能平衡延迟和吞吐。
6. **系统架构**: 多卡要快通信（NVLink/IB）；PD 分离让 prefill 和 decode 各自优化；弹性扩缩容应对流量波动。

## 硬件参考（2026）

| GPU | FP16 算力 | 显存 | 带宽 | 适用 |
|-----|----------|------|------|------|
| H100 SXM | 989 TFLOPS | 80GB HBM3 | 3.35 TB/s | 训练+推理 |
| H200 | 989 TFLOPS | 141GB HBM3e | 4.8 TB/s | 长上下文推理 |
| B200 | 2250 TFLOPS | 192GB HBM3e | 8 TB/s | 下一代旗舰 |
| A100 | 312 TFLOPS | 80GB HBM2e | 2 TB/s | 上一代主力 |
| L40S | 362 TFLOPS | 48GB GDDR6 | 864 GB/s | 推理专用 |

## 性能评测最佳实践

1. **控制变量**: 固定模型、量化、硬件、并发，每次只变一个因素
2. **关注尾延迟**: P50 可能很好，P99 才是用户体验
3. **区分场景**: 短对话 vs 长文档 vs 代码生成，性能表现差异巨大
4. **预热后测量**: 前几次请求有 CUDA 编译、内存分配开销，应排除
5. **多并发测试**: 单请求延迟 ≠ 生产环境性能，必须测并发场景

## Related

- [[概念/Inference/prefill-decode|Prefill / Decode 阶段]]
- [[概念/Inference/kv-cache|KV Cache 优化]]
- [[概念/Inference/paged-attention|PagedAttention]]
- [[概念/Inference/continuous-batching|Continuous Batching]]
- [[概念/Inference/speculative-decoding|投机解码]]
- [[概念/Inference/request-scheduling|请求调度]]
- [[概念/Inference/quantization|量化]]
- [[部署推理/Inference_Performance/README|推理性能专题]]

## 推理性能优化全景

| 优化技术 | 加速比 | 复杂度 | 适用场景 |
|---------|--------|--------|----------|
| **Continuous Batching** | 2-5x | 低 | 所有服务 |
| **PagedAttention** | 1.5-2x | 低 | 显存受限 |
| **Flash Attention** | 1.5-2x | 低 | 长序列 |
| **量化 (FP8/INT4)** | 1.5-3x | 中 | 生产部署 |
| **投机解码** | 2-3x | 中 | 延迟敏感 |
| **KV Cache 压缩** | 1.5-2x | 中 | 长上下文 |
| **TensorRT 编译** | 2-4x | 高 | 极致性能 |
| **PD 分离** | 1.5-2x | 高 | 大规模服务 |

## 性能基准测试方法

```bash
# 使用 vLLM benchmark 工具
python -m vllm.entrypoints.openai.api_server \
  --model Qwen/Qwen3-8B --tensor-parallel-size 1

# 压测
python -m vllm.entrypoints.benchmark_serving \
  --model Qwen/Qwen3-8B \
  --num-prompts 1000 \
  --request-rate 10

# 关注指标: TTFT, TPOT, E2E Latency, Throughput
```

## 生产最佳实践

1. **先测基准线**：优化前先测量当前性能，建立基准
2. **吐吐量 vs 延迟**：明确业务优先级，两者往往矛盾
3. **并发测试**：单请求延迟 ≠ 生产性能，必须测并发
4. **监控 P99**：关注尾部延迟，而非平均值
5. **定期回归**：模型/引擎升级后重新测试性能

## 2026 推理性能基准

| 引擎 | 模型 | 吐吐量 (tok/s) | TTFT (ms) | 硬件 |
|------|------|---------------|-----------|------|
| **vLLM 0.8** | Llama-3-70B | 2,800 | 180 | 2×H100 |
| **SGLang 0.4** | Llama-3-70B | 3,100 | 150 | 2×H100 |
| **TensorRT-LLM** | Llama-3-70B | 3,500 | 120 | 2×H100 |
| **vLLM 0.8** | Qwen2.5-72B | 2,600 | 200 | 2×H100 |

## 性能测试代码示例

```python
import time
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1")

# 测量 TTFT + 吐吐量
start = time.perf_counter()
stream = client.chat.completions.create(
    model="meta-llama/Llama-3-70B",
    messages=[{"role": "user", "content": "Explain quantum computing"}],
    stream=True
)
ttft = None; tokens = 0
for chunk in stream:
    if chunk.choices[0].delta.content and ttft is None:
        ttft = (time.perf_counter() - start) * 1000
    tokens += 1
total = (time.perf_counter() - start) * 1000
print(f"TTFT: {ttft:.0f}ms | Tokens: {tokens} | TPS: {tokens/(total/1000):.0f}")
```

## 延伸阅读

- [[概念/Inference/inference-performance-gaps|性能缺口]] — 瓶颈分析与优化
- [[概念/Inference/ttft|TTFT]] — 首 Token 延迟优化
- [[概念/Inference/continuous-batching|连续批处理]] — 吐吐量优化
- [[概念/Inference/quantization|量化]] — 精度与速度权衡

> ℹ️ 推理性能优化需先建立基准线，再针对性优化，避免盲目调参。
