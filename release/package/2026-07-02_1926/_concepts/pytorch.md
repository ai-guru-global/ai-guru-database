---
title: "PyTorch（深度学习框架）"
category: -concepts
tags: [pytorch, deep-learning, framework, fsdp, gpu, python]
aliases:
  - "PyTorch"
  - "Torch"
relationships:
  - target: "_concepts/fsdp"
    type: built_into
  - target: "_concepts/tensor-parallelism"
    type: supports
sources:
  - 03_Deep_Learning/DL_Frameworks/pytorch_overview.md
  - _concepts/fsdp.md
summary: "PyTorch 是 Meta 于 2016 年开源的深度学习框架，凭借动态图、Pythonic API、强大生态成为研究界和工业界事实标准；2026 年原生支持 FSDP、DDP、torch.compile、torch.distributed 等分布式训练能力。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.90
  inferred: 0.08
  ambiguous: 0.02
base_confidence: 0.95
created: 2026-06-24
updated: 2026-06-24
---

# PyTorch（深度学习框架）

## 核心要点

- **定位**：动态图深度学习框架，研究界 + 工业界事实标准。
- **核心特性**：
  - **动态计算图**：与 TensorFlow 1.x 静态图对比，调试更直观
  - **Pythonic API**：与 NumPy 风格一致
  - **GPU 加速**：CUDA / ROCm / MPS（Apple Silicon）
  - **torch.compile**：PyTorch 2.0+ 的图编译加速
  - **分布式训练原生**：DDP / FSDP / TP / PP
  - **生态丰富**：HuggingFace / torchvision / torchaudio
- **版本里程碑**：
  - **1.x**（2019-2022）：动态图时代
  - **2.0**（2023）：torch.compile + 性能大幅提升
  - **2.5+**（2024-2026）：FSDP v2 + 异步检查点 + 性能再优化

## 一句话解释

> PyTorch = "深度学习的 NumPy"；2026 年仍是训练和研究的默认选择，工业部署（TensorRT / ONNX）也以 PyTorch 模型为主。

## 核心模块

| 模块 | 用途 |
|------|------|
| `torch.Tensor` | 多维数组（GPU/CPU）|
| `torch.nn` | 神经网络层 |
| `torch.optim` | 优化器（SGD / AdamW / ...）|
| `torch.utils.data` | DataLoader / Dataset |
| `torch.autograd` | 自动微分 |
| `torch.distributed` | 分布式训练（DDP / FSDP / TP）|
| `torch.compile` | 图编译加速 |
| `torch.export` | 模型导出（TorchScript / ONNX）|
| `torch.cuda` | CUDA 加速 |

## 分布式训练能力

```python
# 1. DDP（数据并行，最简单）
torch.nn.parallel.DistributedDataParallel(model, device_ids=[local_rank])

# 2. FSDP（PyTorch 原生分片数据并行）
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP
model = FSDP(model, ...)

# 3. TP（张量并行，PyTorch 2.4+）
from torch.distributed.tensor import DTensor, Shard
# PyTorch DTensor API

# 4. TP + FSDP 组合
# 通过 DeviceMesh 组合
```

## 与其他框架对比

| 维度 | PyTorch | TensorFlow | JAX |
|------|---------|------------|-----|
| 动态图 | ✅ | ❌（1.x）/ ✅（2.x）| ✅ 函数式 |
| 研究友好 | ✅✅ | ❌ | ✅ |
| 工业部署 | ✅（需转换）| ✅✅ 原生 | ❌ |
| 分布式 | ✅✅ | ✅ | ✅ |
| 移动端 | PyTorch Mobile | TFLite | ❌ |
| 学习曲线 | 平缓 | 陡 | 中 |

## 何时使用

✅ **推荐**：
- 研究 / 实验
- LLM 训练（与 DeepSpeed / FSDP / Megatron 集成）
- 学术界（论文代码默认 PyTorch）
- 自定义模型 / 新算法

⚠️ **不推荐**：
- 极致生产部署（先转 ONNX / TensorRT）
- 移动端（用 PyTorch Mobile 或 TFLite）

## Related

- [[_concepts/fsdp]] — FSDP（PyTorch 原生）
- [[_concepts/distributed-training]] — 分布式训练
- [[_concepts/tensor-parallelism]] — 张量并行
- [[03_Deep_Learning/DL_Frameworks/pytorch_overview]] — PyTorch 深度解析