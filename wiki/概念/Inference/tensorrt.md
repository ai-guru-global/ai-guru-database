---
title: "TensorRT"
category: -concepts
tags: ["inference", "nvidia", "gpu", "optimization", "tensorrt-llm", "quantization", "kernel-fusion"]
summary: "TensorRT 是 NVIDIA 的高性能深度学习推理优化器和运行时，通过图层融合、精度校准、kernel 自动调优等手段加速推理；TensorRT-LLM 是其 LLM 专用版本。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "NVIDIA TensorRT"
  - "TRT"
relationships:
  - target: "概念/Inference/nvidia-gpu"
    type: runs_on
  - target: "概念/Inference/cuda"
    type: uses
  - target: "概念/Inference/tensorrt-llm"
    type: related_to
  - target: "概念/Inference/model-serving"
    type: used_by
sources:
  - "https://developer.nvidia.com/tensorrt"
  - "https://github.com/NVIDIA/TensorRT-LLM"
name_zh: "NVIDIA 推理优化器"
---

# TensorRT

> 中文简称：NVIDIA 推理优化器

> **一句话理解**: TensorRT 是 NVIDIA 的「推理加速器」，能把训练好的模型编译成在 NVIDIA GPU 上跑得更快的版本。

## 核心优化技术

| 优化技术 | 原理 | 加速效果 |
|----------|------|----------|
| **Layer Fusion** | 合并 Conv+BN+ReLU 等连续层 | 减少 kernel launch + 内存访问 |
| **精度校准** | FP32→FP16/INT8/FP8 量化 | 2-4× 吞吐提升 |
| **Kernel Auto-Tuning** | 自动选择最优 CUDA kernel | 10-30% 加速 |
| **Dynamic Shape** | 支持可变输入尺寸 | 避免 padding 浪费 |
| **内存优化** | 张量内存复用、转置消除 | 减少显存占用 |
| **Multi-Stream** | 多 CUDA 流并行执行 | 提高 GPU 利用率 |

## 工作流程

```
训练模型 (PyTorch/TF/ONNX)
    ↓
导出 ONNX / 直接解析
    ↓
TensorRT Builder 优化
    ├─ 图层融合
    ├─ 精度校准 (FP16/INT8)
    ├─ Kernel 自动调优
    └─ 内存规划
    ↓
生成 Engine (.plan / .engine)
    ↓
TensorRT Runtime 执行推理
```

## TensorRT vs TensorRT-LLM

| 维度 | TensorRT | TensorRT-LLM |
|------|----------|-------------|
| 适用模型 | CNN/Transformer 通用 | GPT/LLM 专用 |
| 核心优化 | 图层融合、量化 | TP/PP、PagedAttention、In-flight Batching |
| 输入特征 | 固定/动态 shape | 变长序列、自回归生成 |
| KV Cache | 无 | Paged KV Cache 管理 |
| 多 GPU | 数据并行 | Tensor Parallel + Pipeline Parallel |
| 精度 | FP16/INT8 | FP16/FP8/INT4-AWQ/GPTQ |
| 部署 | 独立 / Triton | Triton + Python backend |

## TensorRT-LLM 核心特性

| 特性 | 说明 |
|------|------|
| **In-flight Batching** | 请求级别的动态 batching，类似 Continuous Batching |
| **Paged Attention** | KV Cache 分页管理，减少显存碎片 |
| **FP8 量化** | H100 原生支持，几乎无精度损失 |
| **Tensor Parallel** | 单层切分到多 GPU，降低单卡显存 |
| **Pipeline Parallel** | 多层切分到多节点，支持跨机部署 |
| **Speculative Decoding** | 小模型草稿 + 大模型验证，加速 2-3× |
| **Medusa** | 多头并行解码，加速 1.5-2× |

## 性能基准（2026）

| 模型 | GPU | 引擎 | 吞吐 (tokens/s) | TTFT |
|------|-----|------|----------------|------|
| Llama-3.1-70B | 4×H100 | TensorRT-LLM FP8 | ~4500 | ~200ms |
| Llama-3.1-70B | 4×H100 | vLLM FP16 | ~3200 | ~350ms |
| Qwen2.5-72B | 4×H100 | TensorRT-LLM FP8 | ~4200 | ~220ms |
| Llama-3.1-8B | 1×H100 | TensorRT-LLM FP8 | ~12000 | ~50ms |

> 注: TensorRT-LLM 在 FP8 场景下吐吐通常领先 vLLM 30-50%，但配置复杂度更高。

## 使用示例

### TensorRT 通用推理

```python
import tensorrt as trt

# 从 ONNX 构建 Engine
builder = trt.Builder(trt.Logger())
network = builder.create_network(1 << int(trt.NetworkDefinitionCreationFlag.EXPLICIT_BATCH))
parser = trt.OnnxParser(network, trt.Logger())
parser.parse_from_file("model.onnx")

# 配置精度
config = builder.create_builder_config()
config.set_flag(trt.BuilderFlag.FP16)  # 启用 FP16

# 构建并保存
engine = builder.build_serialized_network(network, config)
with open("model.engine", "wb") as f:
    f.write(engine)
```

### TensorRT-LLM 构建

```bash
# 1. 转换模型格式
python convert_checkpoint.py --model_dir ./llama-70b \
    --output_dir ./trt_ckpt --dtype float16 --tp_size 4

# 2. 构建 Engine
trtllm-build --checkpoint_dir ./trt_ckpt \
    --output_dir ./trt_engine \
    --gemm_plugin float16 \
    --max_batch_size 64 \
    --max_input_len 4096 \
    --max_output_len 2048

# 3. 运行推理
python run.py --engine_dir ./trt_engine --tokenizer_dir ./llama-70b
```

## 部署架构

```
Client → Triton Inference Server
              ↓
         TensorRT-LLM Backend
              ├─ Model Repository (Engine 文件)
              ├─ In-flight Batcher
              ├─ KV Cache Manager
              └─ Multi-GPU (TP/PP)
```

## 选型建议

| 场景 | 推荐方案 |
|------|----------|
| 追求极致性能、固定模型 | TensorRT-LLM |
| 快速迭代、多模型切换 | vLLM / SGLang |
| CNN/视觉模型推理 | TensorRT 通用版 |
| 多框架混合部署 | Triton + TensorRT backend |
| 资源受限的边缘设备 | TensorRT INT8 |

## 阿里云专有云关联

在阿里云专有云推理部署中，TensorRT-LLM 是 NVIDIA H100/A100 等 GPU 上的高性能推理方案之一。PAI-EAS 支持 TensorRT-LLM 作为推理后端，配合 Triton 实现生产级部署。

## Related

- [[概念/Inference/tensorrt-llm|TensorRT-LLM]]
- [[概念/Inference/nvidia-gpu|NVIDIA GPU]]
- [[概念/Inference/cuda|CUDA]]
- [[概念/Inference/triton-inference-server|Triton Inference Server]]
- [[概念/Inference/request-scheduling|Request Scheduling]]

## TensorRT 优化技术全景

| 技术 | 说明 | 加速比 |
|------|------|--------|
| **层融合** | 合并 Conv+BN+ReLU 等连续层 | 1.2-1.5x |
| **精度校准** | FP32→FP16/INT8/FP8 自动转换 | 1.5-3x |
| **Kernel 自动调优** | 选择最优 CUDA kernel | 1.1-1.3x |
| **动态张量内存** | 减少显存分配开销 | 1.1x |
| **多流执行** | 并行执行独立层 | 1.2-1.5x |

## TensorRT 工作流

```
PyTorch/ONNX 模型
    ↓
TensorRT Builder (编译优化)
    ↓
TensorRT Engine (.engine / .plan)
    ↓
TensorRT Runtime (推理执行)

注意: Engine 与 GPU 型号 + TensorRT 版本绑定
不同 GPU 需重新编译
```

## 生产最佳实践

1. **极致性能选 TensorRT**：吐吐量要求极高时使用
2. **编译缓存**：Engine 编译耗时 30min-2h，CI/CD 中缓存
3. **FP8 必开**：H100+ 必开 FP8，性能翻倍且质量保留
4. **版本固定**：TensorRT 版本与 CUDA/驱动强绑定
5. **回退方案**：开发用 vLLM，生产切 TensorRT-LLM

---

## 2026 TensorRT 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **TensorRT 10.x** | NVIDIA 高性能推理优化器 | GA |
| **TensorRT-LLM** | LLM 专用推理引擎 | GA |
| **FP8 推理** | H100 FP8 精度推理加速 | GA |
| **torch.compile 集成** | PyTorch 编译后端 | GA |
| **Triton 集成** | Triton Server TRT 后端 | GA |

## 生产最佳实践

1. **版本固定**：TensorRT 版本与 CUDA/驱动强绑定，必须锁定
2. **引擎缓存**：启用 engine cache 避免重复编译
3. **精度策略**：FP16 为默认，FP8 需 H100+ 且验证精度
4. **回退方案**：开发用 vLLM，生产切 TensorRT-LLM
5. **性能对比**：与 vLLM/SGLang 对比，确认实际收益
