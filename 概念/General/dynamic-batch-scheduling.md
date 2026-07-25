---
title: "动态批调度"
category: -concepts
tags: ["inference", "batching", "scheduling", "throughput", "continuous-batching"]
relationships:
  - target: "概念/continuous-batching"
    type: related_to
  - target: "概念/model-serving"
    type: optimizes
  - target: "概念/paged-attention"
    type: synergizes_with
  - target: "概念/kv-cache"
    type: manages
sources:
  - 10_部署推理/04_Inference_Performance/Request_Scheduling_for_LLMs.md
  - 10_部署推理/02_Inference_Engines/vLLM_Deep_Dive.md
  - 10_部署推理/02_Inference_Engines/SGLang_Deep_Dive.md
summary: "动态批调度是推理引擎在每个生成步骤后重新安排请求的策略：新请求随时插入，完成请求随时退出，让 GPU 一直处于满负荷运转，避免‘等一个慢请求拖垮整批’的浪费。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - "Dynamic Batch Scheduling"
  - "dynamic batch scheduling"

---
# 动态批调度

## 核心要点

- **传统静态批处理**：等一个 batch 里所有请求都生成完，才接收下一批。如果某个请求特别长，其他请求都要干等。
- **动态批调度（Dynamic Batching）**：在每个 decode step 结束后，把已完成的请求踢出去，把新来的请求塞进来。
- **Continuous Batching / In-flight Batching** 是其工程实现，vLLM、SGLang、TensorRT-LLM、TGI 都支持。
- **收益**：GPU 利用率提升 2-4 倍，P99 延迟更稳定。

## 一句话理解

动态批调度就像‘拼车算法’：车不停地开，有人到站下车，有人中途上车，保证座位不空、效率最高。

## 详细内容

### 静态批处理的问题

```
静态 batch：
请求 A: ████████░░░░░░░░░░  （长）
请求 B: ████░░░░░░░░░░░░░░  （短）
请求 C: ██████░░░░░░░░░░░░  （中）
        ↑ B 和 C 明明跑完了，但要等 A 结束才能处理新请求
```

### 动态批处理

```
Step 1: A + B + C 一起跑
Step 2: B 完成退出，D 加入 → A + C + D
Step 3: C 完成退出，E 加入 → A + D + E
Step 4: A 完成退出，F 加入 → D + E + F
```

每个 step 后都重新组织 batch，GPU 几乎不空闲。

### 关键技术组件

| 组件 | 作用 |
|------|------|
| **迭代级调度器** | 每个 decode step 后重新排队 |
| **抢占（Preemption）** | 显存不足时暂停低优先级请求 |
| **Chunked Prefill** | 长 prompt 分块，和 decode 交错执行 |
| **优先级队列** | 保证 SLO，高优先级请求先处理 |
| **Token 预算** | 限制单步最大 batch size，防止延迟尖刺 |

### 与 PagedAttention 的关系

动态批调度要随时插入/释放请求，KV Cache 的管理必须非常灵活。PagedAttention 把 KV Cache 分成小块（block），就像操作系统的虚拟内存，支持请求动态进出，两者天然配合。

### 生产调优要点

- **max_num_seqs**：同时处理的请求数上限。
- **max_model_len**：支持的最大上下文长度。
- **gpu_memory_utilization**：留给 KV Cache 的显存比例。
- **scheduler_delay_factor**：等待更多请求到达再调度，权衡吞吐与延迟。

## 开放问题

- 如何在高吞吐与低 TTFT 之间做最优权衡。
- 多模态、多 LoRA、speculative decoding 下的调度策略。
- 按用户/租户区分的 QoS 调度。

## Related

- [[概念/continuous-batching]] — Continuous Batching
- [[概念/paged-attention]] — PagedAttention
- [[概念/model-serving]] — 模型服务
- [[概念/inference-performance]] — 推理性能
- [[10_部署推理/04_Inference_Performance/Request_Scheduling_for_LLMs]] — LLM 请求调度
- [[10_部署推理/02_Inference_Engines/vLLM_Deep_Dive]] — vLLM 深度解析

---

## 2026 动态批调度生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Continuous Batching** | 连续批处理 | GA |
| **vLLM** | 高性能推理引擎 | GA |
| **TensorRT-LLM** | NVIDIA 推理优化 | GA |
| **请求调度** | LLM 请求调度 | GA |
| **PagedAttention** | 分页注意力 | GA |

## 生产最佳实践

1. **Continuous Batching**：推理用 Continuous Batching
2. **vLLM 部署**：LLM 推理用 vLLM
3. **请求调度**：优化请求调度策略
4. **PagedAttention**：启用 PagedAttention
5. **监控指标**：监控批处理效率指标

## 调度策略对比

| 策略 | 延迟 | 吐量 | 适用场景 |
|------|------|------|----------|
| **FCFS** | 低 | 中 | 简单场景 |
| **SJF** | 最低 | 中 | 短请求优先 |
| **优先级** | 可控 | 中 | 多租户 QoS |
| **公平调度** | 中 | 高 | 多用户均衡 |
| **抢占式** | 最低 | 高 | 实时场景 |

## vLLM 调度配置

```python
# vLLM 调度配置
from vllm import LLM, SamplingParams

llm = LLM(
    model="Qwen/Qwen2.5-72B-Instruct",
    tensor_parallel_size=4,
    max_num_seqs=256,        # 最大并发序列数
    max_num_batched_tokens=8192,  # 最大批处理 token
    scheduler_delay_factor=0.0,   # 调度延迟因子
    num_scheduler_steps=1,        # 调度步数
    enable_chunked_prefill=True,  # 分块预填充
)
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 吐量低 | 批大小太小 | 增大 max_num_seqs |
| 延迟高 | 批大小太大 | 减小批大小/分块预填充 |
| 显存不足 | 并发太多 | 减小 max_num_seqs |
| 长请求阻塞 | 无抢占机制 | 启用抢占式调度 |
| GPU 利用率低 | 请求不足 | 动态批 + 填充 |

## 版本兼容性

| 工具 | 版本 | 说明 |
|------|------|------|
| vLLM | 0.6+ | Continuous Batching |
| TensorRT-LLM | 0.12+ | In-flight Batching |
| TGI | 2.x | 连续批处理 |

## 生产检查清单

1. 根据 SLO 设置合适的批大小
2. 启用 PagedAttention 优化显存
3. 配置请求优先级和抢占策略
4. 监控批处理效率和 GPU 利用率
5. 压力测试确认吐量和延迟
6. 配置请求超时和重试机制

## 版本兼容性

| 引擎 | 版本 | 批处理策略 | 备注 |
|------|------|------|------|
| **vLLM** | ≥ 0.4 | Continuous + PagedAttention | 行业标准 |
| **TensorRT-LLM** | ≥ 0.9 | In-flight Batching | NVIDIA |
| **SGLang** | ≥ 0.2 | RadixAttention | 前缀缓存 |
| **TGI** | ≥ 2.0 | Continuous Batching | HF 官方 |
| **llama.cpp** | 2025+ | 动态批处理 | CPU/边缘 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 尾部延迟高 | 长序列占用资源 | 设置 max_tokens + 抢占机制 |
| 显存 OOM | KV Cache 溢出 | PagedAttention + 动态分配 |
| 吞吐量低 | batch size 太小 | 调大 max_num_seqs |
| 首 token 慢 | Prefill 与 Decode 争抢 | 分离 Prefill/Decode 节点 |

## 总结

动态批调度是 LLM 推理性能的核心优化手段，Continuous Batching 相比静态批处理可提升 2-5× 吐量。vLLM 的 PagedAttention + Continuous Batching 已成为行业标准。

> 💡 动态批调度的核心价值：让 GPU 永远不等待——请求完成即插入新请求，消除静态批处理的“木桶效应”。

