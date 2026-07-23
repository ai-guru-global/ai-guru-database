---
title: vLLM 实战指南
category: concepts
tags:
  - llm
  - inference
  - vllm
  - serving
  - paged-attention
  - throughput
  - practical
aliases:
  - vLLM Practical
  - vLLM 实战
  - vLLM 推理引擎
relationships:
  - target: "概念/paged-attention"
    type: uses
  - target: "概念/continuous-batching"
    type: uses
  - target: "概念/kv-cache"
    type: optimizes
  - target: "概念/huggingface-generate-deep-dive"
    type: alternative_to
  - target: "概念/model-serving"
    type: related_to
summary: vLLM 是专为高吞吐 LLM 推理设计的开源引擎，核心创新是 PagedAttention。本文覆盖安装、离线推理、在线服务、参数调优及与 Hugging Face 的对比。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-07-21
sources: []
---

# vLLM 实战指南

## 一句话总结

**vLLM** 是基于 **PagedAttention** 的高吞吐 LLM 推理引擎，能显著提升多并发场景下的 GPU 利用率和服务吞吐。

---

## 核心优势

| 特性 | 说明 |
|---|---|
| **PagedAttention** | 将 KV Cache 分页管理，减少内存碎片和浪费 |
| **Continuous Batching** | 动态批处理，提升 GPU 利用率 |
| **高并发吞吐** | 相比 HF generate() 提升 10~100 倍 |
| **兼容 Hugging Face** | 直接加载 HF 格式模型 |
| **OpenAI 兼容 API** | 提供与 OpenAI 类似的推理接口 |

---

## 安装

```bash
pip install vllm

# CUDA 12.1
pip install vllm --extra-index-url https://download.pytorch.org/whl/cu121
```

---

## 离线推理

```python
from vllm import LLM, SamplingParams

# 加载模型
llm = LLM(model="meta-llama/Llama-2-7b-chat-hf")

# 配置采样参数
sampling_params = SamplingParams(
    temperature=0.7,
    top_p=0.9,
    max_tokens=256
)

# 单条推理
outputs = llm.generate("人工智能的未来是", sampling_params)
print(outputs[0].outputs[0].text)

# 批量推理
prompts = ["你好", "今天天气如何？", "解释量子计算"]
outputs = llm.generate(prompts, sampling_params)
for output in outputs:
    print(output.outputs[0].text)
```

---

## 在线服务

### 启动 OpenAI 兼容服务

```bash
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-2-7b-chat-hf \
    --tensor-parallel-size 1 \
    --dtype bfloat16 \
    --max-model-len 4096
```

### 客户端调用

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="dummy"
)

response = client.chat.completions.create(
    model="meta-llama/Llama-2-7b-chat-hf",
    messages=[{"role": "user", "content": "你好"}],
    temperature=0.7,
    max_tokens=256
)
print(response.choices[0].message.content)
```

---

## 关键配置参数

| 参数 | 说明 | 建议 |
|---|---|---|
| `--tensor-parallel-size` | 张量并行卡数 | 单卡 1，多卡 2/4/8 |
| `--pipeline-parallel-size` | 流水线并行 | 超大模型使用 |
| `--max-num-seqs` | 最大并发序列数 | 根据显存调整，默认 256 |
| `--max-model-len` | 模型最大序列长度 | 根据模型能力设置 |
| `--dtype` | 权重精度 | `bfloat16`、`float16`、`fp8` |
| `--quantization` | 量化方式 | `awq`、`gptq`、`fp8` |
| `--gpu-memory-utilization` | GPU 显存利用率上限 | 0.85 ~ 0.95 |
| `--swap-space` | CPU swap 空间大小 | 长上下文场景增大 |

---

## 性能调优

### 1. 增大 batch size

```bash
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-2-7b-chat-hf \
    --max-num-seqs 512 \
    --gpu-memory-utilization 0.95
```

### 2. 使用量化

```bash
python -m vllm.entrypoints.openai.api_server \
    --model TheBloke/Llama-2-7B-AWQ \
    --quantization awq \
    --dtype half
```

### 3. 长上下文优化

```bash
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-2-7b-chat-hf \
    --max-model-len 8192 \
    --swap-space 16
```

---

## vLLM vs Hugging Face

| 维度 | vLLM | Hugging Face generate() |
|---|---|---|
| 适用场景 | 生产服务、高并发 | 原型开发、研究实验 |
| 吞吐 | 高 | 中 |
| 易用性 | 中 | 高 |
| 灵活性 | 中 | 高 |
| KV Cache | PagedAttention 优化 | 基础实现 |
| 批处理 | Continuous Batching | 静态 batch |

---

## 常见问题

| 问题 | 原因 | 解决 |
|---|---|---|
| OOM | 并发过高或序列过长 | 降低 `max-num-seqs` 或 `max-model-len` |
| TTFT 高 | prompt 太长 | 启用 chunked prefill |
| 量化模型加载失败 | 量化配置不兼容 | 确认 vLLM 支持该量化类型 |
| 输出不一致 | 采样随机性 | 设置 `seed` |

---

## 延伸阅读

- [[概念/vllm|vLLM 概念卡]] — PagedAttention 原理
- [[概念/paged-attention|PagedAttention]]
- [[概念/continuous-batching|Continuous Batching]]
- [[概念/kv-cache|KV Cache]]
- [[概念/huggingface-generate-deep-dive|Hugging Face generate()]]
- [[概念/model-serving|模型服务选型]]
- [[概念/llm-inference-checklist|推理上线检查清单]]

---

## 2026 vLLM 实践生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **vLLM 0.8+** | 最流行的开源 LLM 推理引擎 | GA |
| **PagedAttention** | 分页 KV Cache 管理 | GA |
| **多模态** | 图文/视频输入推理 | GA |
| **分布式** | TP/PP 多卡并行 | GA |
| **OpenAI 兼容** | 完全兼容 OpenAI API | GA |

## 生产最佳实践

1. **显存规划**：gpu_memory_utilization 设置 0.85-0.90
2. **批处理**：max_num_seqs 根据显存调整，通常 256-512
3. **量化**：AWQ/GPTQ 量化降低显存占用
4. **监控**：导出 Prometheus 指标，跟踪 TTFT/TPOT/吐吐量
5. **滚动更新**：K8s 部署配置 rolling update 零停机
