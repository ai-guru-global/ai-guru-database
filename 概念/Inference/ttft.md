--
title: TTFT（Time To First Token）
category: concepts
tags:
  - llm
  - inference
  - ttft
  - latency
  - performance
  - serving
  - prefill
  - scheduling
aliases:
  - TTFT
  - Time To First Token
  - 首 token 延迟
  - 首字延迟
relationships:
  - target: "概念/Inference/tpot"
    type: paired_with
  - target: "概念/Inference/model-serving"
    type: part_of
  - target: "概念/Inference/kv-cache"
    type: affected_by
  - target: "概念/Inference/paged-attention"
    type: optimized_by
  - target: "概念/Inference/prefix-caching"
    type: optimized_by
  - target: "概念/Inference/continuous-batching"
    type: affected_by
  - target: "概念/Inference/request-scheduling"
    type: affected_by
summary: "TTFT 是从收到用户请求到模型返回第一个生成 token 的时间，主要消耗在 prompt 的预填充（prefill）阶段。2026 年通过 Prefill-Decode 分离、Chunked Prefill、前缀缓存等技术，70B 模型 4K prompt 的 TTFT 已从 2s 降至 200ms 以内。"
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-07-21
sources:
  - 部署推理/Inference_Performance/Long_Context_Inference_2026.md
  - 架构基建/AI_Stack_Deep_Dive.md
---

# TTFT（Time To First Token）

> **一句话理解**: TTFT 是用户按下回车到看到第一个字的等待时间——Prefill 阶段越短，用户感觉"秒回"。

## 为什么 TTFT 重要？

对于交互式应用（聊天、搜索、代码助手），用户看到第一个字之前只能等待。TTFT 直接决定用户体验：

| TTFT 范围 | 用户感知 | 典型场景 |
|:---------:|---------|----------|
| < 100ms | 即时响应 | 短 prompt 对话、缓存命中 |
| 100-500ms | 可接受 | 标准 RAG 查询 |
| 500ms-1s | 轻微卡顿 | 长文档分析 |
| > 1s | 明显等待 | 未优化的长上下文 |
| > 3s | 不可接受 | 需紧急优化 |

## TTFT 的构成

```
TTFT = 网络传输 + 队列等待 + 预填充计算 + 首个 token 采样
         ~5ms      0-500ms     主要部分       ~1ms
```

### 预填充阶段（Prefill）

1. 对整个 prompt 执行一次完整前向传播
2. 计算所有 prompt token 的 KV Cache
3. 输出第一个新 token 的 logits

计算量与 prompt 长度近似线性（FlashAttention 优化后）：

```
Prefill FLOPs ≈ 2 × params × prompt_length
Attention FLOPs ∝ prompt_length² × d_head × n_heads
```

## 影响 TTFT 的因素

| 因素 | 影响机制 | 量化示例 |
|------|---------|----------|
| **Prompt 长度** | 线性增加计算量 | 4K→32K: TTFT ×6-8 |
| **模型大小** | 前向传播时间正比于参数量 | 7B→70B: TTFT ×3-5 |
| **Batch 排队** | 等待 GPU 空闲 slot | 高负载: +200-2000ms |
| **硬件算力** | GPU FLOPs 和显存带宽 | H100 vs A100: -40% |
| **量化精度** | 减少计算量和显存 | FP8: -30% TTFT |
| **并行策略** | TP 加速单请求 Prefill | TP4: -60% TTFT |
| **前缀缓存** | 跳过重复前缀计算 | 命中: -70-90% |

## 2026 年优化技术全景

| 技术 | 原理 | TTFT 改善 | 引擎支持 |
|------|------|:---------:|----------|
| **Chunked Prefill** | 将长 Prefill 分块，与 Decode 交错 | 降低排队延迟 | vLLM, SGLang |
| **Prefill-Decode 分离** | 独立 GPU 池处理 Prefill | 消除资源争抢 | Mooncake, DistServe |
| **前缀缓存** | 复用共享 prompt 的 KV Cache | 命中时 -70-90% | SGLang, vLLM APC |
| **FlashAttention-3** | Hopper 异步 + FP8 Prefill | -30-40% | TRT-LLM, SGLang |
| **张量并行** | 多卡并行 Prefill | TP4: -60% | 所有引擎 |
| **投机 Prefill** | 在排队时预计算可能的前缀 | 减少等待 | SGLang |
| **FP8 量化** | 降低计算密度 | -25-35% | vLLM, TRT-LLM |

## 实测 TTFT 基准 (H100, 2026)

| 模型 | Prompt 长度 | TTFT (无优化) | TTFT (全优化) | 优化手段 |
|------|:----------:|:------------:|:------------:|----------|
| Qwen2.5-7B | 2K | 180ms | 60ms | TP1 + FA3 + FP8 |
| Qwen2.5-72B | 2K | 800ms | 220ms | TP4 + FA3 + FP8 |
| Qwen2.5-72B | 8K | 2.5s | 600ms | TP4 + Chunked |
| Qwen2.5-72B | 32K | 9s | 1.8s | TP4 + Chunked + FP8 |
| DeepSeek-V3 | 4K | 1.2s | 180ms | TP8 + 前缀缓存命中 |
| Llama-3.1-405B | 4K | 3.5s | 900ms | TP8 + FA3 |

> 全优化 = 张量并行 + FlashAttention-3 + FP8 + 前缀缓存 + Chunked Prefill

## TTFT vs TPOT

| 指标 | TTFT | TPOT |
|------|------|------|
| **全称** | Time To First Token | Time Per Output Token |
| **测量对象** | 第一个 token 的延迟 | 之后每个 token 的延迟 |
| **主要阶段** | Prefill（计算密集） | Decode（带宽密集） |
| **决定体验** | 响应速度感 | 生成流畅度 |
| **瓶颈** | FLOPs、prompt 长度 | 显存带宽、batch size |
| **优化方向** | 并行、缓存、分块 | 批处理、量化、投机解码 |

端到端延迟公式：

```
Total Latency ≈ TTFT + (output_length - 1) × TPOT
示例: 200ms + 511 × 30ms ≈ 15.5s (512 tokens)
```

## 监控与告警

```python
# Prometheus 指标 (vLLM/SGLang 内置)
# vllm:time_to_first_token_seconds
# sglang:ttft_seconds

# 告警规则示例 (PromQL)
histogram_quantile(0.95,
  rate(vllm:time_to_first_token_seconds_bucket[5m])
) > 0.5
# P95 TTFT > 500ms 时告警
```

```bash
# SGLang 健康检查 + TTFT 监控
curl -s http://localhost:30000/v1/metrics | grep ttft
# 输出: sglang:ttft_seconds{quantile="0.5"} 0.12
#       sglang:ttft_seconds{quantile="0.95"} 0.38
```

## 生产最佳实践

1. **SLO 设定**: 交互式场景 P95 TTFT < 500ms，批量场景可放宽至 2s
2. **前缀缓存必开**: System Prompt 通常 2-8K token，缓存后 TTFT 降 70%+
3. **Chunked Prefill**: 长 prompt (>4K) 场景必开，避免阻塞 Decode 请求
4. **Prefill-Decode 分离**: 高并发 (>100 QPS) 时独立 Prefill 池消除争抢
5. **TP 度选择**: 单请求 TTFT 敏感时增大 TP，吞吐敏感时减小 TP
6. **监控 P50/P95/P99**: 仅看均值会掩盖尾部延迟问题

## 延伸阅读

- [[概念/Inference/tpot|TPOT]]
- [[概念/Inference/model-serving|模型服务]]
- [[概念/Inference/kv-cache|KV Cache]]
- [[概念/Inference/prefix-caching|前缀缓存]]
- [[概念/Inference/continuous-batching|连续批处理]]
- [[概念/Inference/request-scheduling|请求调度]]
- [[概念/LLM/flash-attention-kernels|FlashAttention]]

## TTFT 优化技术全景

| 技术 | 加速比 | 复杂度 | 说明 |
|------|--------|--------|------|
| **Chunked Prefill** | 1.5-3x | 低 | 分块 prefill，避免阻塞 |
| **Prefix Caching** | 2-5x | 低 | 缓存公共前缀 KV |
| **Flash Attention** | 1.5-2x | 低 | IO 感知注意力算子 |
| **量化 (FP8)** | 1.5x | 中 | 减少计算量 |
| **PD 分离** | 1.5-2x | 高 | Prefill 专用 GPU |
| **TensorRT 编译** | 2-3x | 高 | 图优化 + 算子融合 |

## TTFT 计算公式

```
TTFT = 网络延迟 + 排队延迟 + Prefill 时间

Prefill 时间 ≈ (input_tokens × model_flops) / gpu_throughput

示例: Qwen3-8B, 4K 输入, A100
  Prefill ≈ 4096 × 16GFLOP / 312TFLOPS ≈ 210ms
  实际 TTFT ≈ 250-400ms (含网络和排队)
```

## 生产最佳实践

1. **监控 TTFT P99**：关注尾部延迟，而非平均值
2. **Prefix Caching 必开**：相同 System Prompt 可缓存 2-5x 加速
3. **长输入用 Chunked Prefill**：避免 128K 输入阻塞其他请求
4. **设置 TTFT SLA**：根据业务设置 TTFT 上限，超时降级
5. **预热模型**：冷启动时 TTFT 极高，生产环境保持模型常驻

---

## 2026 TTFT 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Chunked Prefill** | 分块预填充降低 TTFT 峰值 | GA |
| **Speculative Prefill** | 投机预填充加速首 Token | 研究 |
| **Disaggregated Prefill** | Prefill/Decode 分离降低 TTFT | GA |
| **TTFT SLO 监控** | 实时 P50/P99 TTFT 跟踪 | GA |
| **预热策略** | 模型常驻 + 定期心跳保持热度 | GA |

## 生产最佳实践

1. **SLO 定义**：明确 TTFT 目标（如 P99 < 500ms）
2. **Chunked Prefill**：长输入场景启用分块预填充
3. **队列监控**：跟踪请求排队时间，队列过长需扩容
4. **模型预热**：部署后发送预热请求，避免首次请求高延迟
5. **与 TPOT 平衡**：TTFT 和 TPOT 往往需要权衡优化
