---
title: TPOT（Time Per Output Token）
category: concepts
tags:
  - llm
  - inference
  - tpot
  - latency
  - throughput
  - serving
aliases:
  - TPOT
  - Time Per Output Token
  - 每 token 延迟
  - 生成延迟
relationships:
  - target: "概念/ttft"
    type: paired_with
  - target: "概念/model-inference"
    type: part_of
  - target: "概念/kv-cache"
    type: optimized_by
  - target: "概念/paged-attention"
    type: optimized_by
  - target: "概念/speculative-decoding"
    type: optimized_by
summary: TPOT 是模型生成阶段每输出一个 token 的平均时间，主要受内存带宽和 KV Cache 影响，是衡量 LLM 推理服务流畅度的核心指标。
lifecycle: reviewed
tier: supporting
created: 2026-06-25
updated: 2026-07-21
sources: []
name_zh: "每 token 生成时间"
---

# TPOT（Time Per Output Token）

> 中文简称：每 token 生成时间

## 一句话总结

TPOT（Time Per Output Token）是**模型生成阶段每输出一个 token 的平均时间**，反映生成过程的流畅度。

---

## 为什么 TPOT 重要？

首个 token 返回后，用户会连续看到后续 token 流出。TPOT 决定：

- 文字“打字”速度是否自然；
- 长回复是否让用户等待过久；
- 系统单位时间内能服务多少 token。

理想情况下，TPOT 应接近人类阅读速度（约 50~200ms/token）。

---

## TPOT 的构成

```
TPOT ≈ 解码阶段单次前向传播时间
```

解码阶段（Decoding）与预填充（Prefill）不同：

- 每次只输入一个新 token；
- 需要读取之前所有 token 的 KV Cache；
- 计算量小，但内存访问密集。

---

## 影响 TPOT 的因素

| 因素 | 影响 |
|---|---|
| **KV Cache 大小** | 越大，读取越慢，TPOT 越高 |
| **序列长度** | 长上下文需要更大的 KV Cache |
| **内存带宽** | 解码阶段主要是内存带宽瓶颈 |
| **批处理大小** | 增大 batch 可提高吞吐，但可能增加单请求 TPOT |
| **量化** | 降低权重和 KV Cache 大小，减少内存访问 |
| **模型大小** | 参数量越大，加载权重越慢 |

---

## 优化 TPOT 的方法

| 方法 | 原理 |
|---|---|
| **KV Cache 优化** | 缓存历史 K/V，避免重复计算 |
| **PagedAttention** | 更高效管理 KV Cache 内存 |
| **量化（INT8/INT4/FP8）** | 减少权重和 KV Cache 大小 |
| **GQA / MQA** | 减少 KV Cache 的头维度 |
| **Continuous Batching** | 动态组 batch，提高 GPU 利用率 |
| **Speculative Decoding** | 小模型生成候选，大模型验证，降低有效 TPOT |
| **CUDA 图 / Kernel 优化** | 减少 kernel 启动开销 |

---

## TTFT vs TPOT

| 指标 | TTFT | TPOT |
|---|---|---|
| **全称** | Time To First Token | Time Per Output Token |
| **测量对象** | 第一个 token 的延迟 | 之后每个 token 的延迟 |
| **主要阶段** | Prefill | Decoding |
| **瓶颈** | 计算 FLOPs | 内存带宽、KV Cache |
| **优化重点** | 加速预填充 | 加速解码、减少内存访问 |

两者共同决定端到端延迟：

```
Total Latency ≈ TTFT + (output_length - 1) × TPOT
```

---

## 吞吐量（Throughput）与 TPOT 的关系

```
Throughput ≈ batch_size / TPOT
```

- 增大 batch size 可以提高吞吐，但可能增加每个请求的 TPOT；
- 优化目标是在满足延迟要求的前提下最大化吞吐。

---

## 延伸阅读

- [[概念/ttft|TTFT]]
- [[概念/model-inference|模型推理]]
- [[概念/kv-cache|KV Cache]]
- [[概念/paged-attention|PagedAttention]]
- [[概念/speculative-decoding|推测解码]]
- [[概念/continuous-batching|Continuous Batching]]

---

## 2026 TPOT 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **TPOT 优化** | 通过批处理、KV Cache、量化降低每 Token 延迟 | GA |
| **Speculative Decoding** | 小模型草稿 + 大模型验证加速生成 | GA |
| **Disaggregated 推理** | Prefill/Decode 分离部署优化 TPOT | GA |
| **SLO 监控** | 实时跟踪 P50/P99 TPOT 指标 | GA |
| **自适应批处理** | 根据 TPOT 目标动态调整 batch size | GA |

## 生产最佳实践

1. **SLO 定义**：明确 TPOT 目标（如 P99 < 50ms），作为容量规划基准
2. **KV Cache 管理**：使用 PagedAttention 避免 KV Cache 内存碎片
3. **批处理平衡**：batch size 越大吞吐越高但 TPOT 增加，找到最优平衡点
4. **量化降延迟**：INT8/FP8 量化可显著降低 TPOT，精度损失可接受
5. **分离架构**：高并发场景考虑 Prefill/Decode 分离，避免互相干扰

## TPOT 优化配置示例

```python
# vLLM TPOT 优化配置
from vllm import LLM, SamplingParams

llm = LLM(
    model="meta-llama/Llama-3-70B-Instruct",
    tensor_parallel_size=4,        # 4卡并行
    max_model_len=8192,
    gpu_memory_utilization=0.90,
    enable_chunked_prefill=True,   # 分块预填充
    max_num_seqs=256,              # 最大并发序列
    quantization="fp8",            # FP8 量化降 TPOT
)

params = SamplingParams(
    temperature=0.7,
    max_tokens=1024,
    # 流式输出降低感知 TPOT
)

# 监控 TPOT 指标
import time
start = time.perf_counter()
outputs = llm.generate(prompts, params)
total_time = time.perf_counter() - start
tokens_generated = sum(len(o.outputs[0].token_ids) for o in outputs)
tpot_ms = (total_time / tokens_generated) * 1000
print(f"TPOT: {tpot_ms:.1f}ms/token")
```

## TPOT 优化技术对比

| 技术 | TPOT 降低 | 复杂度 | 精度影响 | 适用场景 |
|------|-----------|--------|----------|----------|
| FP8 量化 | 30-40% | 低 | 极小 | 通用 |
| INT8 量化 | 40-50% | 低 | 小 | 通用 |
| Speculative Decoding | 50-70% | 中 | 无 | 通用 |
| Prefill/Decode 分离 | 20-30% | 高 | 无 | 高并发 |
| 自适应批处理 | 15-25% | 中 | 无 | 流量波动 |
| KV Cache 压缩 | 10-20% | 中 | 极小 | 长上下文 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| TPOT 波动大 | 批处理大小变化 | 自适应批处理 + QoS 分级 |
| 长文本 TPOT 增加 | KV Cache 增大 | 使用 PagedAttention + 压缩 |
| 并发时 TPOT 飙升 | GPU 资源争抢 | Prefill/Decode 分离 |
| 量化后质量下降 | 量化过度 | 使用 FP8 而非 INT4 |

## 生产检查清单

1. ✅ 定义明确 TPOT SLO（P50/P99）
2. ✅ 使用 PagedAttention 管理 KV Cache
3. ✅ 找到 batch size 与 TPOT 的最优平衡点
4. ✅ 考虑 FP8/INT8 量化降低延迟
5. ✅ 高并发场景评估 Prefill/Decode 分离
6. ✅ 实时监控 TPOT 指标 + 告警

## 总结

TPOT（Time Per Output Token）是衡量 LLM 推理体验的核心指标，直接影响用户感知的“打字速度”。2026 年通过量化、推测解码、分离架构和自适应批处理的组合优化，生产环境 TPOT 已可稳定控制在 20-50ms/token。

> 💡 TPOT 优化的核心是“平衡”——吐吐量、延迟、成本三者不可兼得，需要根据业务 SLO 找到最优点。
