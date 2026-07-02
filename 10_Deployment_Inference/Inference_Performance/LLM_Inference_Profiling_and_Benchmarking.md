---
title: 推理 Profiling 与 Benchmarking
category: 10-deployment-inference-inference-performance
tags: [inference, profiling, benchmarking, performance, latency, throughput]
summary: "> 如何公平、可复现地测量 LLM 推理性能，并用工具定位真正的瓶颈。"
created: 2026-06-15
updated: 2026-06-15
tier: supporting
aliases:
  - "Llm Inference Profiling And Benchmarking"
  - "LLM Inference Profiling and Benchmarking"
  - LLM_Inference_Profiling_and_Benchmarking

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# 推理 Profiling 与 Benchmarking

> 性能优化前先测对。本文讲清楚测什么、怎么测、以及常见的坑。

---

## 1. 测什么

### 1.1 核心指标

| 指标 | 定义 | 为什么重要 |
|------|------|------------|
| **TTFT** | 首 token 返回时间 | 用户“开始看到回复”的等待感 |
| **TPOT** | 每个输出 token 的平均耗时 | 流式输出的流畅感 |
| **E2E Latency** | 完整请求耗时 | 用户总等待时间 |
| **Throughput** | tok/s 或 req/s | 系统总产能 |
| **QPS** | 每秒请求数 | 在线服务能力 |
| **GPU Utilization** | GPU 利用率 | 资源是否吃饱 |
| **GPU Memory Usage** | 显存占用 | 会不会 OOM |
| **Power / TCO** | 功耗与总成本 | 长期运营成本 |

### 1.2 尾延迟很重要

- **P50**：一半请求比它快。
- **P99**：99% 请求比它快，反映最差用户体验。
- LLM 推理中 P99 往往比 P50 高 2-5 倍，因为存在长输入、大 batch、调度抢占。

---

## 2. 怎么测：Benchmarking 方法论

### 2.1 固定变量

对比不同引擎/配置时，必须固定：

- 模型与权重（相同 checkpoint）
- 量化方式（FP16 / FP8 / INT8 / AWQ / GPTQ）
- 硬件（GPU 型号、数量、驱动、CUDA 版本）
- 输入/输出长度分布
- 并发数（requests per second 或同时在线请求数）
- 温度、top_p、max_tokens 等生成参数

### 2.2 负载模型

不要用单一 prompt 测，要用分布：

| 负载类型 | 特点 | 测什么 |
|----------|------|--------|
| **ShareGPT 类对话** | 输入输出长度变化大 | 真实在线对话性能 |
| **固定输入+固定输出** | 控制变量 | 对比引擎 raw 吞吐 |
| **泊松到达** | 模拟真实请求到达 | QPS 与延迟关系 |
| **突发流量** | 短时间内大量请求 | 调度与队列行为 |

### 2.3 常用工具

| 工具 | 用途 | 特点 |
|------|------|------|
| **llmperf** | 端到端 benchmark | 支持 vLLM、TGI、TensorRT-LLM 等，输出 TTFT/TPOT/吞吐 |
| **benchmark_throughput.py (vLLM)** | vLLM 自带吞吐测试 | 快速验证 vLLM 配置 |
| **benchmark_latency.py (vLLM)** | vLLM 自带延迟测试 | 快速验证单请求延迟 |
| **TGI benchmark** | TGI 自带工具 | 与 TGI 深度集成 |
| **ab / wrk / k6** | HTTP 压测 | 测 API 层 QPS |
| **自定义脚本** | 灵活控制负载 | 适合特定业务场景 |

### 2.4 一个最小可复现实验

```bash
# 启动服务
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-2-7b-chat-hf \
  --tensor-parallel-size 1 \
  --max-num-seqs 256

# 用 llmperf 压测
python -m llmperf.launcher \
  --model meta-llama/Llama-2-7b-chat-hf \
  --max-num-completed-requests 100 \
  --timeout 600 \
  --num-concurrent-requests 10 \
  --results-dir ./results
```

---

## 3. 怎么定位：Profiling 工具

### 3.1 PyTorch Profiler

适合定位模型内部算子耗时。

```python
from torch.profiler import profile, ProfilerActivity

with profile(activities=[ProfilerActivity.CPU, ProfilerActivity.CUDA]) as prof:
    output = model(input_ids)

print(prof.key_averages().table(sort_by="cuda_time_total", row_limit=20))
```

能看到：

- 每个 op 的 CPU/CUDA 时间
- Kernel launch overhead
- 数据传输时间

### 3.2 NVIDIA Nsight Systems

系统级 profiling，看 GPU、CPU、NCCL 的时间线。

```bash
nsys profile -o report.qdrep \
  python inference_script.py
```

适合分析：

- Kernel 之间是否有 gap（GPU 空闲）
- All-to-All / AllReduce 通信时间
- CPU 预处理是否拖后腿
- CUDA graph 是否生效

### 3.3 NVIDIA Nsight Compute

单个 kernel 的深度分析，看 occupancy、memory bandwidth、shared memory 等。

```bash
ncu -o report.ncu-rep \
  python inference_script.py
```

### 3.4 vLLM / SGLang 内置指标

- Prometheus 指标：`vllm:time_to_first_token_seconds`, `vllm:time_per_output_token_seconds`
- 日志中的 scheduling 延迟、KV cache 利用率

### 3.5 系统级工具

| 工具 | 用途 |
|------|------|
| `nvidia-smi dmon` | GPU 利用率、显存、温度、功耗 |
| `nvidia-smi nvlink` | NVLink 带宽 |
| `iperf` / `ib_write_bw` | 网络/IB 带宽 |
| `htop` / `perf` | CPU 利用率、系统调用 |

---

## 4. 常见坑

### 4.1 没有 warm up

第一次推理通常要：

- 编译 CUDA graph
- 分配 KV Cache
- JIT 编译某些 kernel

结论：正式测试前先跑 10-50 个请求 warm up。

### 4.2 只看吞吐不看延迟

高吞吐可能是用大 batch 换的，但单用户延迟可能很差。

### 4.3 输入输出长度不真实

用固定 128/512 token 测出来的结果，和真实对话分布可能差很远。

### 4.4 忽略尾延迟

P50 好看，但 P99 可能超过 SLA。

### 4.5 不同量化方式混比

FP16 vs INT4 的吞吐对比不公平，要说明精度和速度 trade-off。

### 4.6 没有控制并发

吞吐随并发数变化很大，必须报告“在多少并发下”的结果。

---

## 5. 报告模板

一个可复现的 benchmark 报告至少包含：

```
1. 环境
   - 模型：xxx
   - 硬件：NVIDIA H100 x8
   - 软件：CUDA 12.4, vLLM 0.6.0

2. 配置
   - 量化：FP16
   - TP：1
   - max_num_seqs：256
   - batching：continuous

3. 负载
   - 数据集：ShareGPT
   - 平均输入长度：800
   - 平均输出长度：300
   - 并发数：1 / 10 / 50 / 100

4. 结果
   | 并发 | TTFT P50/P99 | TPOT P50/P99 | Throughput |

5. 分析
   - 瓶颈判断
   - 优化建议
```

---

## 6. 一句话总结

> Benchmarking 要控制变量、用真实负载、看尾延迟；Profiling 要结合系统级和算子级工具，找到真正的瓶颈再优化。

---

## Related

- [[_concepts/inference-performance]] — 推理性能概念卡
- [[10_Deployment_Inference/Inference_Performance/README|推理性能专题]]
- [[10_Deployment_Inference/Inference_Performance/Inference_Performance_Fundamentals|推理性能基础]]
- [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive|vLLM Deep Dive]]
- [[10_Deployment_Inference/Inference_Engines/SGLang_Deep_Dive|SGLang Deep Dive]]

- [[10_Deployment_Inference/README|模型部署与推理]]
