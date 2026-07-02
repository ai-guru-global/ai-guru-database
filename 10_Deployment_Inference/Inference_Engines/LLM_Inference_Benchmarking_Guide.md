---
title: "LLM 推理引擎基准测试指南"
category: "10-deployment-inference"
tags: ["deployment", "inference", "benchmarking", "llm", "performance", "ttft", "tpot", "throughput"]
summary: "> **一句话理解**: 面向 LLM 推理引擎的基准测试指南——统一指标定义、测试工具、评测方法和结果解读，帮助你客观对比 vLLM、SGLang、TensorRT-LLM 等引擎的真实性能。"
created: "2026-06-15"
updated: "2026-06-15"
tier: supporting
aliases:
  - "Llm Inference Benchmarking Guide"
  - "LLM Inference Benchmarking Guide"
  - LLM_Inference_Benchmarking_Guide

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# LLM 推理引擎基准测试指南

> **一句话理解**: 面向 LLM 推理引擎的基准测试指南——统一指标定义、测试工具、评测方法和结果解读，帮助你客观对比 vLLM、SGLang、TensorRT-LLM 等引擎的真实性能。

---

## 目录

1. [核心指标](#1-核心指标)
2. [测试方法论](#2-测试方法论)
3. [测试工具](#3-测试工具)
4. [各引擎测试命令](#4-各引擎测试命令)
5. [结果解读](#5-结果解读)
6. [常见陷阱](#6-常见陷阱)
7. [报告模板](#7-报告模板)

---

## 1. 核心指标

### 1.1 延迟类指标

```
延迟指标定义
═══════════════════════════════════════════════════════════════════

TTFT (Time To First Token):
───────────────────────────────────────────────────────────────────
从发送请求到收到第一个输出 token 的时间
• 反映 prefill 阶段效率
• 对用户感知延迟影响最大
• 单位: ms

TPOT (Time Per Output Token):
───────────────────────────────────────────────────────────────────
相邻两个输出 token 之间的平均间隔
• 反映 decode 阶段效率
• 影响流式输出平滑度
• 单位: ms/token

E2E Latency:
───────────────────────────────────────────────────────────────────
从发送请求到收到完整响应的总时间
• E2E ≈ TTFT + TPOT × output_tokens
• 单位: s
```

### 1.2 吞吐类指标

```
吞吐指标定义
═══════════════════════════════════════════════════════════════════

Throughput (tok/s):
───────────────────────────────────────────────────────────────────
单位时间内生成的 token 总数
• 总吞吐 = 所有请求输出 token 数 / 总时间
• 单卡吞吐 = 总吞吐 / GPU 数量
• 单位: tokens/s

QPS (Queries Per Second):
───────────────────────────────────────────────────────────────────
每秒完成的请求数
• 适合短输出场景
• 单位: req/s

Goodput:
───────────────────────────────────────────────────────────────────
满足 SLO 的成功请求比例
• 例如: TTFT < 500ms 且 TPOT < 50ms 的请求占比
• 单位: %
```

### 1.3 资源类指标

| 指标 | 说明 | 关注原因 |
|------|------|----------|
| **GPU 利用率** | SM 占用率 | 反映算力是否充分利用 |
| **显存占用** | HBM 使用量 | 决定最大并发和模型规模 |
| **KV Cache 占用率** | 缓存池使用比例 | 反映内存管理效率 |
| **CPU 利用率** | 调度器开销 | 高并发时可能成为瓶颈 |
| **PCIe 带宽** | CPU-GPU 传输 | 大输入/输出场景重要 |

### 1.4 质量类指标

| 指标 | 说明 |
|------|------|
| **输出一致性** | 多次相同输入输出是否一致 (temperature=0) |
| **精度保持** | 量化后 perplexity 变化 |
| **错误率** | OOM / timeout / 5xx 比例 |

---

## 2. 测试方法论

### 2.1 测试维度

```
LLM 推理测试维度
═══════════════════════════════════════════════════════════════════

1. 单请求性能 (Single Request)
───────────────────────────────────────────────────────────────────
• 测量 TTFT、TPOT、E2E Latency
• 排除排队和并发干扰
• 适合评估单用户体验

2. 固定并发性能 (Fixed Concurrency)
───────────────────────────────────────────────────────────────────
• 设置 N 个并发客户端持续发送请求
• 测量吞吐和 P99 延迟
• 适合评估系统容量

3. 负载渐变 (Ramping Load)
───────────────────────────────────────────────────────────────────
• 从 1 个并发逐步增加到 N 个
• 观察吞吐和延迟的变化曲线
• 找到饱和点和崩溃点

4. 混合负载 (Mixed Workload)
───────────────────────────────────────────────────────────────────
• 不同输入长度、输出长度混合
• 模拟真实生产流量
• 测试调度和内存管理
```

### 2.2 数据集设计

```python
# 输入长度分布示例
input_length_distribution = {
    "short": (10, 100),      # 聊天、代码补全
    "medium": (500, 2000),   # RAG、文档问答
    "long": (4000, 16000),   # 长文档总结
}

# 输出长度分布示例
output_length_distribution = {
    "short": (50, 200),      # 简单回答
    "medium": (200, 1000),   # 解释、总结
    "long": (1000, 4000),    # 长文生成
}

# 建议测试用例
# 1. 固定输入 1K + 固定输出 256 (baseline)
# 2. 固定输入 4K + 固定输出 512 (长输入)
# 3. 混合输入 0.5K-4K + 混合输出 128-1K (真实场景)
```

### 2.3 预热与稳定

```
测试执行规范
═══════════════════════════════════════════════════════════════════

1. 模型预热
───────────────────────────────────────────────────────────────────
• 启动后先发送 10-50 个请求预热
• 让 KV Cache、CUDA graph、编译缓存生效

2. 丢弃前 N 个结果
───────────────────────────────────────────────────────────────────
• 正式测试前丢弃前 20% 数据
• 避免冷启动影响

3. 持续运行时间
───────────────────────────────────────────────────────────────────
• 至少运行 5-10 分钟
• 长上下文场景建议 30 分钟

4. 多次重复
───────────────────────────────────────────────────────────────────
• 至少重复 3 次取平均
• 剔除异常值
```

---

## 3. 测试工具

### 3.1 llmperf

```bash
# 安装
pip install llmperf

# 测试 vLLM
python -m llmperf \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --api-url http://localhost:8000/v1/completions \
  --max-num-completed-requests 100 \
  --timeout 600 \
  --num-concurrent-requests 10 \
  --results-dir ./results
```

### 3.2 自定义 Python 脚本

```python
import time
import asyncio
import aiohttp
import statistics
from dataclasses import dataclass

@dataclass
class BenchmarkResult:
    ttft_ms: float
    tpot_ms: float
    total_tokens: int
    output_tokens: int

async def send_request(session, url, payload):
    start = time.time()
    ttft = None
    token_times = []
    output_tokens = 0

    async with session.post(url, json=payload) as resp:
        async for chunk in resp.content:
            chunk_time = time.time()
            if ttft is None:
                ttft = (chunk_time - start) * 1000
            output_tokens += 1
            token_times.append(chunk_time)

    tpot = statistics.mean([
        token_times[i+1] - token_times[i]
        for i in range(len(token_times)-1)
    ]) * 1000 if len(token_times) > 1 else 0

    return BenchmarkResult(
        ttft_ms=ttft,
        tpot_ms=tpot,
        total_tokens=output_tokens,
        output_tokens=output_tokens
    )

async def benchmark(url, payload, concurrency=10, total=100):
    semaphore = asyncio.Semaphore(concurrency)
    results = []

    async def bounded_request(session, payload):
        async with semaphore:
            return await send_request(session, url, payload)

    async with aiohttp.ClientSession() as session:
        tasks = [bounded_request(session, payload) for _ in range(total)]
        results = await asyncio.gather(*tasks)

    ttfts = [r.ttft_ms for r in results]
    tpots = [r.tpot_ms for r in results]

    print(f"TTFT P50: {statistics.median(ttfts):.1f}ms")
    print(f"TTFT P99: {sorted(ttfts)[int(len(ttfts)*0.99)]:.1f}ms")
    print(f"TPOT P50: {statistics.median(tpots):.1f}ms/token")
    print(f"TPOT P99: {sorted(tpots)[int(len(tpots)*0.99)]:.1f}ms/token")

# 使用
payload = {
    "model": "meta-llama/Llama-3.1-8B-Instruct",
    "prompt": "解释量子纠缠的基本原理",
    "max_tokens": 256,
    "temperature": 0,
    "stream": True
}
asyncio.run(benchmark("http://localhost:8000/v1/completions", payload))
```

### 3.3 vLLM 自带 benchmark

```bash
# vLLM 自带 benchmark_throughput.py
python benchmarks/benchmark_throughput.py \
  --backend vllm \
  --dataset benchmarks/ShareGPT_V3_unfiltered_cleaned_split.json \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --tokenizer meta-llama/Llama-3.1-8B-Instruct \
  --num-prompts 1000 \
  --max-model-len 4096

# vLLM 自带 benchmark_latency.py
python benchmarks/benchmark_latency.py \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --input-len 1024 \
  --output-len 256 \
  --batch-size 1 \
  --tensor-parallel-size 1
```

### 3.4 SGLang 自带 benchmark

```bash
# SGLang benchmark
python -m sglang.bench_serving \
  --backend sglang \
  --dataset-name random \
  --random-input-len 1024 \
  --random-output-len 256 \
  --num-prompts 1000 \
  --max-concurrency 100
```

### 3.5 TensorRT-LLM 自带 benchmark

```bash
# TensorRT-LLM benchmark
python benchmarks/python/benchmark.py \
  -m llama_8b \
  --mode plugin \
  --batch_size 1 8 16 32 \
  --input_output_len "1024,256" \
  --log_dir ./trt_llm_benchmark
```

### 3.6 工具对比

| 工具 | 适用引擎 | 特点 | 推荐场景 |
|------|----------|------|----------|
| **llmperf** | 通用 | 云 API / 本地，OpenAI 兼容 | 跨引擎对比 |
| **vLLM benchmark** | vLLM | 官方，参数丰富 | vLLM 深度调优 |
| **SGLang bench_serving** | SGLang | 官方，真实数据集 | SGLang 深度调优 |
| **TensorRT-LLM benchmark** | TensorRT-LLM | 官方，底层指标 | TRT-LLM 深度调优 |
| **自定义脚本** | 通用 | 灵活 | 特定场景 |

---

## 4. 各引擎测试命令

### 4.1 vLLM 测试

```bash
# 启动服务
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --port 8000 \
  --max-num-seqs 256

# 使用 llmperf
python -m llmperf \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --api-url http://localhost:8000/v1/completions \
  --num-concurrent-requests 10 \
  --max-num-completed-requests 100
```

### 4.2 SGLang 测试

```bash
# 启动服务
python -m sglang.launch_server \
  --model-path meta-llama/Llama-3.1-8B-Instruct \
  --port 30000

# 使用 SGLang bench_serving
python -m sglang.bench_serving \
  --backend sglang \
  --num-prompts 1000 \
  --max-concurrency 100 \
  --random-input-len 1024 \
  --random-output-len 256
```

### 4.3 TensorRT-LLM 测试

```bash
# 启动 Triton
tritonserver --model-repository ./models

# 使用 custom script 或 perf_analyzer
triton perf-analyzer \
  -m tensorrt_llm \
  --shape input_ids:1,1024 \
  --shape input_lengths:1 \
  --concurrency-range 1:32
```

### 4.4 TGI 测试

```bash
# 启动服务
text-generation-launcher --model-id meta-llama/Llama-3.1-8B-Instruct --port 8080

# 使用 llmperf (TGI 支持 OpenAI 兼容接口)
python -m llmperf \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --api-url http://localhost:8080/v1/completions \
  --num-concurrent-requests 10
```

### 4.5 云 API 测试

```bash
# Groq
python -m llmperf \
  --model llama-3.1-70b-versatile \
  --api-url https://api.groq.com/openai/v1/completions \
  --api-key $GROQ_API_KEY

# Together
python -m llmperf \
  --model meta-llama/Llama-3.1-70B-Instruct-Turbo \
  --api-url https://api.together.xyz/v1/completions \
  --api-key $TOGETHER_API_KEY
```

---

## 5. 结果解读

### 5.1 性能曲线分析

```
典型性能曲线
═══════════════════════════════════════════════════════════════════

吞吐 (tok/s)
    │
    │      ______  饱和点
    │     /
    │    /
    │   /
    │  /
    │ /
    │/____________________ 并发数

延迟 (ms)
    │
    │          /  急剧上升区
    │         /
    │        /
    │_______/_____________ 并发数
        线性区

关键观察:
• 线性区: 增加并发，吞吐线性增长，延迟稳定
• 饱和点: 吞吐不再增长，延迟开始上升
• 崩溃点: 延迟急剧上升，错误率增加
```

### 5.2 如何评估

| 场景 | 关注指标 | 优秀标准 |
|------|----------|----------|
| 实时聊天 | TTFT P99 < 200ms | 用户无感知等待 |
| 流式输出 | TPOT P99 < 50ms | 输出流畅 |
| 批量处理 | 吞吐 / $ | 单位成本最低 |
| RAG | TTFT + 前缀缓存命中率 | 命中 > 70% |
| 长上下文 | 128K 下的 TTFT | < 2s |

### 5.3 成本归一化

```
成本归一化计算
═══════════════════════════════════════════════════════════════════

自建成本:
───────────────────────────────────────────────────────────────────
$ / 1M tokens = (月 GPU 租金) / (月生成 token 数)

云 API 成本:
───────────────────────────────────────────────────────────────────
$ / 1M tokens = input_price × input_tokens + output_price × output_tokens

对比示例:
• 自建 H100 跑 8B 模型: ~$0.0001 / 1M tokens (理想满负荷)
• Groq 8B: ~$0.13 / 1M tokens
• Together 8B: ~$0.40 / 1M tokens

注意: 自建需考虑利用率、运维、电力、故障成本
```

---

## 6. 常见陷阱

### 6.1 陷阱一：忽略预热

```
❌ 错误: 启动后立即测试
✅ 正确: 先发送 50+ 请求预热，丢弃前 20% 数据
```

### 6.2 陷阱二：单点测试

```
❌ 错误: 只测 batch=1
✅ 正确: 测试 1 / 8 / 16 / 32 / 64 / 128 并发
```

### 6.3 陷阱三：输入长度单一

```
❌ 错误: 只用 100 token 输入
✅ 正确: 覆盖 0.5K / 2K / 8K / 32K / 128K
```

### 6.4 陷阱四：温度非零

```
❌ 错误: temperature=0.7 导致输出长度不稳定
✅ 正确: 对比延迟用 temperature=0，对比质量用业务配置
```

### 6.5 陷阱五：只看平均延迟

```
❌ 错误: 只看 mean TTFT
✅ 正确: 关注 P50 / P95 / P99，特别是尾延迟
```

---

## 7. 报告模板

```markdown
# LLM 推理引擎基准测试报告

## 测试环境
- 引擎: vLLM 0.8.2
- 模型: meta-llama/Llama-3.1-8B-Instruct
- GPU: H100 80GB x1
- 测试工具: llmperf
- 测试时间: 2026-06-15

## 测试配置
- 并发: 1 / 8 / 16 / 32 / 64
- 输入长度: 1024 tokens
- 输出长度: 256 tokens
- 温度: 0

## 结果
| 并发 | TTFT P50 | TTFT P99 | TPOT P50 | TPOT P99 | 吞吐 (tok/s) |
|------|----------|----------|----------|----------|--------------|
| 1    | 45ms     | 50ms     | 12ms     | 15ms     | 80           |
| 8    | 48ms     | 65ms     | 14ms     | 20ms     | 580          |
| 16   | 52ms     | 90ms     | 16ms     | 28ms     | 1050         |
| 32   | 70ms     | 150ms    | 20ms     | 45ms     | 1800         |
| 64   | 120ms    | 300ms    | 35ms     | 80ms     | 2500         |

## 结论
- 饱和点约 32 并发
- P99 延迟在 64 并发时超过业务 SLO
- 推荐生产配置: 最大并发 32

## 成本估算
- 单卡 H100 月成本: $2,500
- 月可处理 token: ~30T
- 单位成本: ~$0.00008 / 1M tokens
```

---

## 参考资源

- [llmperf GitHub](https://github.com/ray-project/llmperf)
- [vLLM Benchmarks](https://github.com/vllm-project/vllm/tree/main/benchmarks)
- [SGLang Benchmark](https://github.com/sgl-project/sglang/tree/main/python/sglang/bench_serving)
- [TensorRT-LLM Benchmark](https://github.com/NVIDIA/TensorRT-LLM/tree/main/benchmarks)

---

*Last updated: 2026-06-15*
*Version: 1.0.0*

## Related

- [[10_Deployment_Inference/Inference_Engines/LLM_Inference_Engine_Selection_Guide|LLM_Inference_Engine_Selection_Guide]]
- [[10_Deployment_Inference/Inference_Engines/LLM_Inference_Engine_Migration_Guide|LLM_Inference_Engine_Migration_Guide]]
- [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive|vLLM_Deep_Dive]]
- [[10_Deployment_Inference/Inference_Engines/SGLang_Deep_Dive|SGLang_Deep_Dive]]
- [[10_Deployment_Inference/Inference_Engines/TensorRT_LLM_Deep_Dive|TensorRT_LLM_Deep_Dive]]
- [[10_Deployment_Inference/Deployment_Inference_2026|Deployment_Inference_2026]]
