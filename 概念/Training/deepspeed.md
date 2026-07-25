---
title: "DeepSpeed"
category: -concepts
tags: ["deepspeed", "microsoft", "distributed-training", "zero", "parallelism", "inference", "optimization", "moe"]
relationships:
  - target: "概念/distributed-training"
    type: extends
  - target: "概念/megatron-lm"
    type: related_to
  - target: "概念/fsdp"
    type: related_to
  - target: "概念/hami"
    type: related_to
  - target: "概念/ray"
    type: related_to
sources:
  - 07_模型训练/04_Distributed_Training/DeepSpeed_Deep_Dive.md
summary: "DeepSpeed 是微软开源的深度学习训练与推理优化库，以 ZeRO 显存优化、DeepSpeed-Inference、MoE 训练和 ZeRO-Inference 著称，广泛用于千亿参数大模型的预训练与微调。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: reviewed
tier: core
updated: 2026-07-25
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Deepspeed

---
# DeepSpeed

> 微软出品的「大模型训练加速器」——用 ZeRO 优化把千亿参数模型塞进有限 GPU。

---

## 1. 一句话定义

**DeepSpeed** 是微软开源的深度学习训练与推理优化库，核心特性包括 **ZeRO（Zero Redundancy Optimizer）** 显存优化、DeepSpeed-Inference 高吞吐推理、MoE（Mixture of Experts）训练、Offloading 和稀疏注意力等。它让研究者用更少的 GPU 训练更大的模型。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **ZeRO** | 把优化器状态、梯度、参数分片到多卡/多节点，消除冗余 |
| **ZeRO-Offload** | 把优化器状态/计算卸载到 CPU/NVMe |
| **ZeRO-Infinity** | 支持 NVMe 扩展，训练万亿参数模型 |
| **DeepSpeed-Inference** | 推理阶段的多 GPU 并行与量化 |
| **MoE** | 专家混合模型训练 |
| **Sparse Attention** | 长序列注意力优化 |
| **Pipeline Parallelism** | 与 Megatron-LM 集成 |
| **1-bit Adam / LAMB** | 通信压缩优化器 |

---

## 3. ZeRO 三个阶段

| 阶段 | 分片内容 | 显存节省 |
|------|---------|---------|
| **ZeRO-1** | 优化器状态分片 | 4x |
| **ZeRO-2** | 优化器状态 + 梯度分片 | 8x |
| **ZeRO-3** | 优化器状态 + 梯度 + 参数分片 | 与数据并行度线性相关 |

```
Data Parallel Group
  ├── GPU 0: optimizer_state_shard_0 + gradient_shard_0 + param_shard_0
  ├── GPU 1: optimizer_state_shard_1 + gradient_shard_1 + param_shard_1
  └── GPU N: ...
```

---

## 4. 典型场景

1. **千亿参数预训练**：ZeRO-3 + ZeRO-Infinity 扩展。
2. **单卡微调大模型**：ZeRO-Offload 把优化器状态放 CPU。
3. **低资源实验室**：用 1-2 张卡微调 7B/13B 模型。
4. **高吞吐推理服务**：DeepSpeed-Inference 多卡并行。

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **PyTorch FSDP** | PyTorch 原生 ZeRO-3 类似实现 |
| **Megatron-LM** | 张量并行/流水线并行，常与 DeepSpeed 结合 |
| **Ray Train** | 可封装 DeepSpeed 分布式训练 |
| **HuggingFace Transformers** | 集成 `deepspeed` 参数，原生支持 |
| **HAMi** | DeepSpeed 训练任务可申请 HAMi vGPU |

---

## 6. 优势与局限

### 优势
- 极大降低大模型训练显存门槛。
- 与 HuggingFace 生态集成良好。
- 支持推理优化和 MoE。

### 局限
- 配置复杂，JSON 配置项多。
- 调试难度大，通信问题定位困难。
- 极致性能通常需结合 Megatron-LM。

---

## Related

- [[07_模型训练/04_Distributed_Training/DeepSpeed_Deep_Dive]] — DeepSpeed 深度解析
- [[概念/distributed-training]] — 分布式训练
- [[概念/fsdp]] — PyTorch FSDP
- [[概念/megatron-lm]] — Megatron-LM
- [[概念/hami]] — HAMi GPU 虚拟化
- [[概念/ray]] — Ray 分布式框架
- [[概念/training-cost-optimization|训练成本优化]] — ZeRO 在 FinOps 体系中的角色

---

## 2026 DeepSpeed 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **ZeRO-3** | 参数/梯度/优化器全分片 | GA |
| **ZeRO-Inference** | 推理时显存优化 | GA |
| **DeepSpeed-Chat** | RLHF 训练框架 | GA |
| **MoE 支持** | 专家并行训练 | GA |
| **FP8 训练** | H100 原生支持 | GA |

## 生产最佳实践

1. **ZeRO 级别**：显存充足用 ZeRO-2，不足用 ZeRO-3 + Offload
2. **配置简化**：使用 DeepSpeed Config JSON 生成器避免配置错误
3. **与 Megatron 结合**：超大规模训练用 Megatron-DeepSpeed
4. **通信优化**：启用通信重叠、梯度压缩降低带宽需求
5. **监控指标**：关注 MFU、显存峰值、通信/计算比

## 2026 DeepSpeed 生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| ZeRO-1/2/3 | ✅ | 显存优化核心 |
| ZeRO++ | ✅ | 量化通信 |
| DeepSpeed-Chat | ✅ | RLHF 全栈 |
| FP8 训练 | ✅ | Hopper 加速 |
| MoE 支持 | ✅ | 专家并行 |
| 推理优化 | ✅ | DeepSpeed-Inference |

## 检查清单

- [ ] ZeRO 阶段已根据显存需求选择
- [ ] 混合精度已配置（BF16/FP16）
- [ ] 梯度检查点已启用
- [ ] 通信优化已配置（重叠/压缩）
- [ ] Checkpoint 策略已配置
- [ ] 监控已接入（MFU/显存/通信）

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 显存 OOM | ZeRO 阶段不够 | 升级 ZeRO-3 + offload |
| 通信瓶颈 | 带宽不足 | 启用 ZeRO++ 量化通信 |
| 训练慢 | 未重叠通信 | 配置通信重叠 |
| 收敛差 | 学习率不当 | 调优 lr + warmup |

## 延伸阅读

- [[概念/Training/megatron-lm|Megatron-LM]] — NVIDIA 分布式框架
- [[概念/Training/fsdp|FSDP]] — PyTorch 全分片
- [[概念/Training/mixed-precision|Mixed Precision]] — 混合精度
- [[概念/Training/gradient-checkpointing|Gradient Checkpointing]] — 梯度检查点
- [[概念/GPU/model-parallelism|Model Parallelism]] — 模型并行

> ℹ️ DeepSpeed 是 2026 年最主流的分布式训练框架，ZeRO 系列是显存优化核心，与 Megatron 结合可支撑万亿参数训练。

## ZeRO 阶段选择指南

| 阶段 | 显存节省 | 通信开销 | 适用场景 |
|------|------|------|------|
| ZeRO-1 | 4x | 低 | 多卡训练 |
| ZeRO-2 | 8x | 中 | 大模型训练 |
| ZeRO-3 | 线性 | 高 | 超大模型 |
| ZeRO++ | 线性 | 低 | 带宽受限 |

## 延伸阅读

- [[概念/Training/megatron-lm|Megatron-LM]] — NVIDIA 分布式框架
- [[概念/Training/fsdp|FSDP]] — PyTorch 全分片
- [[概念/Training/mixed-precision|Mixed Precision]] — 混合精度
- [[概念/Training/gradient-checkpointing|Gradient Checkpointing]] — 梯度检查点
- [[概念/GPU/model-parallelism|Model Parallelism]] — 模型并行

> ℹ️ DeepSpeed ZeRO 是 2026 年显存优化的核心技术，与 Megatron 结合可支撑万亿参数 训练。

## 性能参考

| 配置 | MFU | 显存节省 | 适用 |
|------|------|------|------|
| ZeRO-1 | 45% | 4x | 多卡 |
| ZeRO-2 | 42% | 8x | 大模型 |
| ZeRO-3 | 38% | 线性 | 超大模型 |

## 源码级洞察（v0.19.3）

- ZeRO-1/2 在 `deepspeed/runtime/zero/stage_1_and_2.py`（`DeepSpeedZeroOptimizer`），ZeRO-3 在 `stage3.py`（`DeepSpeedZeroOptimizer_Stage3`），由 `zero_optimization.stage` 配置直接选型。
- ZeRO-3 的"参数从未完整存在于单卡"源于 `zero.Init` hook 模块 `__init__`（`partition_parameters.py`）+ 前向按需 all-gather（`partitioned_param_coordinator.py`）。
- 源码归档：`code/llm-frameworks/DeepSpeed-v0.19.3/`，详见 [[07_模型训练/04_Distributed_Training/DeepSpeed_Deep_Dive|DeepSpeed 深度解析]] 第 13 节。
