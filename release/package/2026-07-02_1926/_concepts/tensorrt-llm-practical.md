---
title: TensorRT-LLM 实战指南
category: concepts
tags:
  - llm
  - inference
  - tensorrt-llm
  - nvidia
  - optimization
  - quantization
  - serving
aliases:
  - TensorRT-LLM
  - TRT-LLM
  - TensorRT LLM
relationships:
  - target: "_concepts/vllm-practical"
    type: alternative_to
  - target: "_concepts/quantization"
    type: uses
  - target: "_concepts/model-serving"
    type: related_to
summary: TensorRT-LLM 是 NVIDIA 推出的高性能 LLM 推理 SDK，通过算子融合、量化、KV Cache 优化等技术，在 NVIDIA GPU 上实现极致推理性能。
lifecycle: reviewed
tier: supporting
created: 2026-06-25
updated: 2026-06-25
sources: []
---

# TensorRT-LLM 实战指南

## 一句话总结

**TensorRT-LLM** 是 NVIDIA 专为自家 GPU 优化的高性能 LLM 推理 SDK，通过算子融合、FP8/INT8 量化、[[_concepts/kv-cache|KV Cache]] 管理等技术实现极致吞吐。

---

## 核心优势

| 特性 | 说明 |
|---|---|
| **算子融合** | 减少 kernel 启动和内存访问开销 |
| **多精度支持** | FP16、BF16、FP8、INT8、INT4 |
| **In-Flight Batching** | 类似 Continuous Batching 的动态批处理 |
| **KV Cache 优化** | PagedAttention 支持 |
| **NVIDIA GPU 深度优化** | 针对 A100、H100、L40S 等优化 |

---

## 安装

```bash
# 推荐用 Docker
 docker run --gpus all -it --rm nvcr.io/nvidia/tritonserver:24.01-trtllm-python-py3

# 或使用 pip（需匹配 CUDA 版本）
pip install tensorrt_llm
```

---

## 工作流程

```mermaid
flowchart LR
    A[HF 模型] --> B[转换为 TensorRT-LLM 格式]
    B --> C[构建 Engine]
    C --> D[部署推理服务]
    D --> E[运行 Triton Inference Server]
```

---

## 模型转换与构建

```bash
# 1. 从 Hugging Face 下载并转换模型
python examples/llama/convert_checkpoint.py \
    --model_dir /path/to/llama-7b \
    --output_dir /path/to/converted \
    --dtype float16

# 2. 构建 TensorRT Engine
python examples/llama/build.py \
    --model_dir /path/to/converted \
    --output_dir /path/to/engine \
    --dtype float16 \
    --max_batch_size 64 \
    --max_input_len 2048 \
    --max_output_len 512
```

---

## 推理

### Python Runtime

```python
from tensorrt_llm.runtime import ModelRunner
from transformers import AutoTokenizer

runner = ModelRunner.from_dir("/path/to/engine")
tokenizer = AutoTokenizer.from_pretrained("/path/to/llama-7b")

input_ids = tokenizer.encode("人工智能的未来是", return_tensors="pt")
outputs = runner.generate(
    input_ids,
    max_new_tokens=100,
    temperature=0.7,
    top_p=0.9
)
print(tokenizer.decode(outputs[0]))
```

### Triton 服务部署

```bash
# 准备 Triton 模型仓库
python tools/fill_template.py \
    -i tools/gpt2/preprocessing/config.pbtxt \
    -o /path/to/repo/preprocessing/config.pbtxt \
    tokenizer_dir:/path/to/llama-7b

# 启动 Triton
tritonserver --model-repository /path/to/repo
```

---

## 量化

### FP8 量化（需 Hopper 架构）

```bash
python examples/quantization/quantize.py \
    --model_dir /path/to/llama-7b \
    --output_dir /path/to/fp8 \
    --dtype fp8 \
    --qformat fp8
```

### INT8 SmoothQuant

```bash
python examples/quantization/quantize.py \
    --model_dir /path/to/llama-7b \
    --output_dir /path/to/int8 \
    --dtype float16 \
    --qformat int8_sq
```

---

## TensorRT-LLM vs vLLM

| 维度 | TensorRT-LLM | vLLM |
|---|---|---|
| 厂商 | NVIDIA | 开源社区 |
| 部署复杂度 | 高（需构建 engine）| 低 |
| 峰值性能 | 极高（NVIDIA GPU）| 高 |
| 灵活性 | 中 | 高 |
| 量化支持 | FP8/INT8/INT4 完善 | AWQ/GPTQ/FP8 |
| 生态 | 与 Triton 深度集成 | 与 FastChat/SGLang 集成 |
| 适用场景 | 大规模生产部署 | 快速上线、灵活迭代 |

---

## 适用场景

- 已有 NVIDIA GPU 集群，追求极致吞吐；
- 需要与 Triton Inference Server 集成；
- 使用 FP8 量化（H100 等 Hopper 架构）；
- 模型固定，不频繁更换。

---

## 常见问题

| 问题 | 原因 | 解决 |
|---|---|---|
| 构建 engine 时间长 | 需要编译优化 | 提前构建并缓存 engine |
| 模型不支持 | 算子未实现 | 查看官方 examples 列表 |
| OOM | engine 构建时 max batch 过大 | 降低 max_batch_size / max_seq_len |
| 精度下降 | 量化导致 | 尝试更高精度或校准 |

---

## 延伸阅读

- [[_concepts/vllm-practical|vLLM 实战]]
- [[_concepts/huggingface-generate-deep-dive|Hugging Face generate()]]
- [[_concepts/quantization|模型量化]]
- [[_concepts/model-serving|模型服务选型]]
- [[_concepts/llm-inference-checklist|推理上线检查清单]]
