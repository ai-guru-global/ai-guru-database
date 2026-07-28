---
title: "PyTorch（深度学习框架）"
category: -concepts
tags: [pytorch, deep-learning, framework, fsdp, gpu, python]
aliases:
  - "PyTorch"
  - "Torch"
relationships:
  - target: "概念/fsdp"
    type: built_into
  - target: "概念/tensor-parallelism"
    type: supports
sources:
  - 03_深度学习/08_DL_Frameworks/pytorch_overview.md
  - 概念/fsdp.md
summary: "PyTorch 是 Meta 于 2016 年开源的深度学习框架，凭借动态图、Pythonic API、强大生态成为研究界和工业界事实标准；2026 年原生支持 FSDP、DDP、torch.compile、torch.distributed 等分布式训练能力。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.90
  inferred: 0.08
  ambiguous: 0.02
base_confidence: 0.95
created: 2026-06-24
updated: 2026-07-21
name_zh: "深度学习框架"
---

# PyTorch（深度学习框架）

> 中文简称：深度学习框架

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

- [[概念/fsdp]] — FSDP（PyTorch 原生）
- [[概念/distributed-training]] — 分布式训练
- [[概念/tensor-parallelism]] — 张量并行
- [[03_深度学习/08_DL_Frameworks/pytorch_overview]] — PyTorch 深度解析

---

## 2026 PyTorch 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **PyTorch 2.x** | 深度学习框架 | GA |
| **torch.compile** | 编译优化 | GA |
| **FSDP** | 全分片数据并行 | GA |
| **Tensor Parallel** | 张量并行 | GA |
| **PyTorch Distributed** | 分布式训练 | GA |

## 生产最佳实践

1. **torch.compile**：启用 torch.compile 加速
2. **FSDP 训练**：大模型训练用 FSDP
3. **Tensor Parallel**：超大模型用 Tensor Parallel
4. **混合精度**：训练用混合精度
5. **分布式检查点**：定期保存检查点

## 训练配置示例

```python
import torch
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP

# FSDP 大模型训练
model = FSDP(
    model,
    sharding_strategy=ShardingStrategy.FULL_SHARD,
    mixed_precision=MixedPrecision(
        param_dtype=torch.bfloat16,
        reduce_dtype=torch.bfloat16,
    ),
    auto_wrap_policy=size_based_auto_wrap_policy,
)

# torch.compile 加速
model = torch.compile(model, mode="max-autotune")
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| OOM | 模型/批太大 | FSDP/梯度累积/量化 |
| 训练慢 | 未用编译优化 | torch.compile |
| 通信瓶颈 | 网络带宽不足 | RDMA/梯度压缩 |
| 数值不稳定 | 混合精度问题 | 调整 loss scaling |
| 检查点太大 | 未分片保存 | 分布式检查点 |

## 版本兼容性

| 组件 | 版本 | 说明 |
|------|------|------|
| PyTorch | 2.4+ | 核心框架 |
| CUDA | 12.x | GPU 环境 |
| NCCL | 2.20+ | 集合通信 |
| DeepSpeed | 0.14+ | 训练加速 |

## 生产检查清单

1. 启用 torch.compile 加速训练
2. 使用 FSDP 分片大模型
3. 启用混合精度 (bfloat16)
4. 配置分布式检查点
5. 监控 GPU 利用率和通信效率
6. 定期更新 PyTorch 版本

## 总结

PyTorch 是 AI 研究和生产的事实标准框架，2026 年 PyTorch 2.x 的 torch.compile 和 FSDP 使其在大模型训练和部署中保持领先地位。

> 💡 PyTorch 的核心价值：从研究到生产的无缝过渡——同一个框架既能做实验又能上生产，是 AI 工程师的必备技能。

5. **与 TensorFlow 对比**：研究场景优先 PyTorch

## PyTorch 2026 生态

| 组件 | 功能 | 状态 |
|------|------|------|
| **PyTorch 2.x** | torch.compile 加速 | GA |
| **torch.compile** | 图编译优化 | GA |
| **FSDP2** | 分布式训练 | GA |
| **torch.export** | 模型导出 | GA |
| **ExecuTorch** | 边缘部署 | GA |
| **DTensor** | 分布式张量 | GA |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| OOM | 批处理过大 | 降低 batch_size + 梯度累积 |
| 训练慢 | 未用 torch.compile | 启用编译优化 |
| 多卡不均衡 | 数据分配不均 | 使用 DistributedSampler |
| 导出失败 | 动态控制流 | 使用 torch.export + 静态化 |

## 生产检查清单

1. ✅ 启用 torch.compile 加速训练/推理
2. ✅ 分布式训练使用 FSDP2
3. ✅ 混合精度训练（bf16/fp16）
4. ✅ 梯度累积降低显存占用
5. ✅ 模型导出使用 torch.export
6. ✅ 定期更新 PyTorch 版本

## 总结

PyTorch 是 2026 年 AI 研究和生产的绝对主流框架，torch.compile 和 FSDP2 使其在性能和分布式能力上达到新高度。从研究到生产的无缝过渡是其核心优势。

> 💡 PyTorch 的核心价值：“同一个框架，从实验到生产”——不需要换框架就能部署。