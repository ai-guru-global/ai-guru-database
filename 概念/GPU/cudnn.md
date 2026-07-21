---
title: "cuDNN"
category: -concepts
tags: ["gpu", "nvidia", "deep-learning", "library", "cudnn", "transformer-engine"]
summary: "cuDNN 是 NVIDIA 针对深度神经网络原语优化的高性能 GPU 库，被 PyTorch、TensorFlow 等框架广泛用于卷积、RNN、Transformer 等算子加速。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "CUDA Deep Neural Network library"
  - "cuDNN"
relationships:
  - target: "概念/cuda"
    type: part_of
  - target: "概念/nvidia-gpu"
    type: runs_on
sources: []
---

# cuDNN

> **一句话理解**: cuDNN 是 NVIDIA 给深度学习算子做的「加速包」，卷积、注意力、归一化这些常用操作都靠它跑得快。

## 定义

cuDNN（CUDA Deep Neural Network library）是 NVIDIA 提供的 GPU 加速深度学习原语库，为卷积、池化、归一化、激活、RNN、Attention 等操作提供高度优化的实现。它是 PyTorch/TensorFlow 等框架在 GPU 上运行的核心依赖。

## 核心组件

| 模块 | 功能 | 典型算子 |
|------|------|----------|
| **Convolution** | 卷积前向/反向 | Conv2d, DepthwiseConv |
| **Normalization** | 归一化 | BatchNorm, LayerNorm, RMSNorm |
| **Attention** | 注意力机制 | FlashAttention, MHA, GQA |
| **RNN/LSTM** | 循环网络 | GRU, LSTM |
| **Pooling** | 池化 | MaxPool, AvgPool |
| **Activation** | 激活函数 | ReLU, GELU, SiLU |
| **MatMul** | 矩阵乘法 | GEMM, BatchedGEMM |

## 版本与生态（2026）

| 方面 | 状态 |
|------|------|
| **当前版本** | cuDNN 9.x（融合后端 API） |
| **Transformer Engine** | cuDNN + FP8 融合，H100 原生支持 |
| **FlashAttention** | cuDNN 9 内置 Flash Attention 实现 |
| **PyTorch 集成** | `torch.backends.cudnn.benchmark = True` 自动选最优算法 |
| **容器化** | NVIDIA NGC 镜像预装，无需手动安装 |

## 性能调优

```python
# PyTorch 中启用 cuDNN 自动调优
import torch
torch.backends.cudnn.benchmark = True   # 自动搜索最优卷积算法
torch.backends.cudnn.allow_tf32 = True  # 允许 TF32 加速
```

| 调优项 | 说明 |
|---------|------|
| `benchmark=True` | 首次运行时搜索最优卷积算法，后续复用 |
| `allow_tf32` | A100+ 上用 TF32 代替 FP32，提速 3-8x |
| `cudnn_deterministic` | 牺牲速度换可复现性 |
| **Graph API** | cuDNN 9 融合图执行，减少 kernel launch 开销 |

## 与竞品对比

| 库 | 厂商 | 对应关系 |
|------|------|----------|
| **cuDNN** | NVIDIA | CUDA 生态核心 |
| **MIOpen** | AMD | ROCm 生态对应 |
| **oneDNN** | Intel | CPU/GPU 通用 |
| **ATB** | 华为 | 昇腾 CANN 内置 |

## 生产最佳实践

1. **始终用 NGC 容器**：确保 CUDA + cuDNN + 驱动版本匹配
2. **开启 benchmark**：固定输入尺寸时显著提速
3. **升级 cuDNN 版本**：新版常带来 10-30% 性能提升
4. **H100 用 Transformer Engine**：自动 FP8 融合，比纯 cuDNN 更快
5. **排查版本冲突**：`python -c "import torch; print(torch.backends.cudnn.version())"`

## Related

- [[概念/cuda|CUDA]]
- [[概念/nvidia-gpu|NVIDIA GPU]]
- [[概念/GPU/flops|FLOPS]] — cuDNN 优化直接影响实际 FLOPS 利用率
- [[概念/LLM/tensorrt-llm|TensorRT-LLM]] — 推理时替代 cuDNN 的更高层优化
