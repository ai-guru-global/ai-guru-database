---
title: "ZeRO 零冗余优化器 (Zero Redundancy Optimizer)"
category: -concepts
tags: ["zero", "deepspeed", "memory-optimization", "data-parallel", "fsdp"]
relationships:
  - target: "概念/Training/deepspeed"
    type: part_of
  - target: "概念/Training/fsdp"
    type: related_to
  - target: "概念/Training/distributed-training"
    type: part_of
sources:
  - 07_模型训练/04_分布式训练/
summary: "ZeRO 通过将优化器状态、梯度和参数分片到各数据并行进程，消除传统数据并行的显存冗余，是 DeepSpeed 的核心技术，PyTorch FSDP 是其同思想实现。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.90
lifecycle: reviewed
tier: core
created: 2026-07-27
updated: 2026-09-03
aliases:
  - "ZeRO"
  - "Zero Redundancy Optimizer"
  - "零冗余优化器"
name_zh: "ZeRO 零冗余优化器"
---
# ZeRO 零冗余优化器 (Zero Redundancy Optimizer)

> 中文简称：ZeRO 零冗余优化器

> 数据并行时每张卡都存一份完整状态太浪费——切开分着放。

---

## 1. 定义

**ZeRO**（Microsoft, 2020）针对数据并行的显存冗余：传统 DP 中每个 GPU 都保存完整的参数、梯度和优化器状态。以 Adam + 混合精度为例，每参数需 **16 字节**（FP16 参数 2 + 梯度 2 + FP32 主权重 4 + momentum 4 + variance 4），7B 模型仅状态就需 112GB。ZeRO 将这些状态**分片（shard）**到 N 个进程，按需通信重建。

---

## 2. 三个阶段

| 阶段 | 分片对象 | 单卡显存（N 卡） | 额外通信 |
|------|----------|------------------|----------|
| **ZeRO-1** | 优化器状态 | 4Ψ + 12Ψ/N | 无增加 |
| **ZeRO-2** | + 梯度 | 2Ψ + 14Ψ/N | 无增加 |
| **ZeRO-3** | + 参数 | 16Ψ/N | +50%（前向 all-gather） |

（Ψ = 参数量字节基数；N = 并行度）

扩展：**ZeRO-Offload**（状态卸载到 CPU）、**ZeRO-Infinity**（NVMe 卸载，单卡微调百亿模型）。

---

## 3. ZeRO vs FSDP vs 3D 并行

| 方案 | 定位 |
|------|------|
| **DeepSpeed ZeRO** | 原创实现，配置驱动（json） |
| **PyTorch FSDP/FSDP2** | 官方原生同思想实现，生态融合更好 |
| **3D 并行（Megatron）** | TP/PP 切模型计算图，ZeRO 只切状态；超大模型两者组合 |

选型经验：**<13B 用 ZeRO-2/3 即可；>70B 需 TP+PP+ZeRO-1 组合**。

---

## 4. 工程要点

1. ZeRO-3 参数聚合有延迟开销，小模型反而变慢，先试 ZeRO-2
2. `overlap_comm: true` 通信计算重叠是免费加速
3. Offload 用带宽换显存，PCIe 会成瓶颈，优先加卡而非 offload
4. 与 LoRA 微调组合时，QLoRA + ZeRO-2 常是单机最优解

---

## 5. 三阶段显存对比（70B 模型 × 8 卡实例）

| 阶段 | 切分内容 | 70B 模型显存/卡（8 卡） | 通信开销 |
|------|----------|--------------------------|----------|
| **DDP（无分片）** | 无 | 840GB | 1× |
| **ZeRO-1** | Optimizer States | 280GB | 1.0× |
| **ZeRO-2** | + Gradients | 210GB | 1.0× |
| **ZeRO-3** | + Parameters | 105GB | 1.5× |
| **ZeRO-3 + Offload** | + CPU Offload | 35GB | 2× |

---

## 6. FSDP 实战（PyTorch 原生）

```python
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP
from torch.distributed.fsdp import MixedPrecision, BackwardPrefetch

model = FSDP(
    model,
    mixed_precision=MixedPrecision(
        param_dtype=torch.bfloat16,
        reduce_dtype=torch.float32,
        buffer_dtype=torch.bfloat16,
    ),
    backward_prefetch=BackwardPrefetch.BACKWARD_PRE,
    device_id=torch.cuda.current_device(),
)
```

Transformer 逐层包装（以 Llama 为例）：

```python
from torch.distributed.fsdp.wrap import transformer_auto_wrap_policy
from transformers.models.llama.modeling_llama import LlamaDecoderLayer

policy = transformer_auto_wrap_policy(
    transformer_layer_cls={LlamaDecoderLayer},
)

model = FSDP(
    model,
    auto_wrap_policy=policy,
    mixed_precision=MixedPrecision(param_dtype=torch.bfloat16, ...),
)
```

启动（FSDP 在 torch 2.0+ 内置）：

```bash
torchrun --nproc_per_node=8 train.py
```

---

## 7. DeepSpeed ZeRO 实战

ZeRO-3 + CPU Offload 的 `ds_config.json` 关键配置：

```json
{
  "train_micro_batch_size_per_gpu": 2,
  "gradient_accumulation_steps": 8,
  "gradient_clipping": 1.0,
  "bf16": {
    "enabled": true
  },
  "zero_optimization": {
    "stage": 3,
    "offload_optimizer": {
      "device": "cpu",
      "pin_memory": true
    },
    "offload_param": {
      "device": "cpu",
      "pin_memory": true
    },
    "overlap_comm": true,
    "contiguous_gradients": true,
    "reduce_bucket_size": "auto",
    "stage3_prefetch_bucket_size": "auto",
    "stage3_gather_16bit_weights_on_model_save": true
  }
}
```

启动：

```bash
deepspeed --num_gpus=8 train.py --deepspeed ds_config.json
```

关键优势：CPU/NVMe Offload 扩展性最强；`overlap_comm` 自动做通信计算重叠；config 一行切换 ZeRO 阶段。

---

## 8. 3D 并行（TP + PP + DP/ZeRO）

主流方案：DeepSpeed + Megatron（DeepSpeed 3D Parallel，工业标准）、FSDP + TP（PyTorch 原生）、Megatron-LM（NVIDIA 3D 并行）。

配置示例（8 节点 64 卡）：

```
- TP（张量并行） = 8（单节点内）
- PP（流水线并行） = 4（跨节点）
- DP/ZeRO = 2
- 总 GPU = 8 × 4 × 2 = 64
```

典型应用：Llama 3 405B（16K H100，3D 并行）、DeepSeek V3（ZeRO + EP + 256 卡）、Qwen 3（FSDP + TP）。

---

## 9. 生产最佳实践

1. **首选 FSDP（原生）**：PyTorch 2.0+ 内置，与 torchrun 完美集成。
2. **< 30B 模型用 ZeRO-2 / FSDP FULL_SHARD**：开 ZeRO-3 通信开销大。
3. **30B+ 模型用 ZeRO-3 / FSDP FULL_SHARD**：显存必须切。
4. **> 100B 用 ZeRO-3 + CPU Offload**：70B 可在 8 卡 A100 训练。
5. **BF16 + FSDP**：用 BF16 替代 FP16，数值稳定。
6. **激活重计算必开**：节省 30-50% 显存。
7. **通信优化**：NCCL P2P + Ring AllReduce，跨节点用 RDMA。
8. **Checkpoint 频繁保存**：ZeRO-3 保存需 gather，慢但可靠。
9. **Mixed Precision**：Param BF16 + Reduce FP32，稳定且快。
10. **3D 并行复杂度高**：简单场景 2D（ZeRO + TP）。
11. **Offload CPU 用高速内存**：NVMe 慢，慎用。
12. **监控通信/计算比**：> 30% 通信考虑调小 ZeRO 阶段。

---

## 10. 2026 生态速览

| 维度 | 2026 状态 |
|------|-----------|
| **DeepSpeed** | v0.17，ZeRO-Infinity 卸载到 NVMe |
| **FSDP** | PyTorch 2.5+，FULL_SHARD 默认 |
| **Megatron-LM** | v0.12，3D 并行成熟 |
| **3D 并行** | 主流，DeepSpeed + Megatron |
| **FP8 训练** | NVIDIA Hopper 原生，Transformer Engine |
| **MoE 并行** | EP（专家并行）成熟，DeepSpeed + Megatron |
| **Ring Attention** | 长序列分片，12M context |
| **企业应用** | 70B+ 模型训练标配 |
| **主要竞品** | DeepSpeed / FSDP / Megatron / ColossalAI / Mesh-TensorFlow |

---

## 11. 官方资源

- DeepSpeed：[deepspeed.ai](https://www.deepspeed.ai/) ｜ [GitHub](https://github.com/microsoft/DeepSpeed) ｜ [ZeRO 论文](https://arxiv.org/abs/1910.02054) ｜ [ZeRO-Infinity](https://arxiv.org/abs/2104.07857)
- FSDP：[PyTorch 文档](https://pytorch.org/docs/stable/fsdp.html) ｜ [FSDP 论文](https://arxiv.org/abs/2304.11277)
- Megatron：[Megatron-LM](https://github.com/NVIDIA/Megatron-LM) ｜ [论文](https://arxiv.org/abs/1909.08053) ｜ [Megatron-DeepSpeed](https://github.com/microsoft/Megatron-DeepSpeed)
- 其他：[ColossalAI](https://github.com/hpcaitech/ColossalAI) ｜ [Mesh-TensorFlow](https://github.com/tensorflow/mesh) ｜ [Ring Attention](https://github.com/lhao499/llm_large_context)

---

## Related

- [[概念/Training/deepspeed]] — DeepSpeed（ZeRO 宿主框架）
- [[概念/Training/fsdp]] — FSDP（PyTorch 原生实现）
- [[概念/Training/distributed-training]] — 分布式训练总览
- [[概念/Training/megatron-lm]] — Megatron-LM（3D 并行）
- [[概念/Training/mixed-precision]] — 混合精度（显存账本基础）

> ℹ️ 记忆锚点：ZeRO 的三阶段就是"先切状态、再切梯度、最后切参数"，切得越多省得越多、通信越贵。

## 核心知识体系

| 知识层 | 核心内容 | 深度要求 | 学习优先级 |
|--------|----------|----------|------------|
| 基础理论 | 核心概念/数学原理/基本定义 | 深入理解并能推导 | P0 |
| 核心方法 | 主流算法/技术路线/框架工具 | 熟练掌握并能应用 | P0 |
| 工程实践 | 系统设计/性能优化/生产部署 | 独立完成项目 | P1 |
| 前沿研究 | 最新论文/技术趋势/开放问题 | 了解并跟踪 | P2 |
| 行业应用 | 落地案例/最佳实践/经验教训 | 参考并借鉴 | P1 |

## 技术路线对比

| 维度 | 经典方法 | 深度学习方法 | 大模型方法 | 选型建议 |
|------|----------|--------------|------------|----------|
| 数据需求 | 少量标注 | 大量标注 | 海量预训练 | 按数据规模 |
| 计算成本 | 低 | 中-高 | 极高 | 按预算约束 |
| 泛化能力 | 有限 | 良好 | 优秀 | 按任务复杂度 |
| 可解释性 | 高 | 低 | 极低 | 按合规要求 |
| 部署难度 | 简单 | 中等 | 复杂 | 按运维能力 |
| 迭代速度 | 快 | 中 | 慢 | 按业务节奏 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何快速入门该领域? | 先建立直觉(可视化/类比)，再学数学原理，最后代码实现 |
| 需要哪些前置知识? | 线性代数+概率统计+微积分+Python编程基础 |
| 如何选择学习资源? | 经典教材打基础+顶会论文跟前沿+开源项目练实战 |
| 理论学习和实践如何平衡? | 7:3比例——70%时间理解原理，30%时间动手验证 |
| 如何评估自己的掌握程度? | 能向他人清晰解释+能独立实现+能解决变体问题 |

## 核心术语速查

| 中文 | 英文 | 说明 |
|------|------|------|
| 零冗余优化器 | Zero Redundancy Optimizer（ZeRO） | DeepSpeed 优化器分片 |
| 全分片数据并行 | Fully Sharded Data Parallel（FSDP） | PyTorch 原生 |
| 优化器分片 | Optimizer Sharding | ZeRO-1 |
| 梯度分片 | Gradient Sharding | ZeRO-2 |
| 参数分片 | Parameter Sharding | ZeRO-3 |
| 数据并行 | Data Parallel（DP） | 每卡全模型 |
| 模型并行 | Model Parallel（MP） | 模型切分到卡 |
| 张量并行 | Tensor Parallel（TP） | 单层内切分 |
| 流水线并行 | Pipeline Parallel（PP） | 层间切分 |
| 专家并行 | Expert Parallel（EP） | MoE 专家分片 |
| 序列并行 | Sequence Parallel（SP） | 长序列切分 |
| 优化器状态 | Optimizer States | Adam 的 m/v |
| 激活重计算 | Activation Recomputation | 节省显存 |
| 混合精度 | Mixed Precision | FP16/BF16/FP8 |
| Offload | Offload | CPU / NVMe 卸载 |
| 3D 并行 | 3D Parallelism | TP + PP + DP |
| 通信开销 | Communication Overhead | 切分后增加 |

## 推荐资源

| 类型 | 资源 | 适用阶段 |
|------|------|----------|
| 教材 | 领域经典教材(花书/CS229等) | 入门-基础 |
| 课程 | Stanford/MIT在线课程 | 入门-进阶 |
| 论文 | 顶会最佳论文+综述 | 进阶-精通 |
| 代码 | PyTorch/HuggingFace官方示例 | 基础-实战 |
| 社区 | 技术博客+论文读书会 | 全阶段 |
| 竞赛 | Kaggle/天池/学术竞赛 | 基础-进阶 |

## 检查清单

- [ ] 核心概念能向他人清晰解释
- [ ] 数学原理能独立推导
- [ ] 核心算法能手写实现
- [ ] 主流框架和工具已掌握
- [ ] 完成至少一个端到端项目
- [ ] 能阅读和理解领域论文
- [ ] 了解最新技术趋势和开放问题
- [ ] 知识已文档化沉淀

## 实践操作指南

| 步骤 | 行动 | 工具/方法 | 预期产出 |
|------|------|-----------|----------|
| 1. 学习 | 系统学习核心知识 | 教材/课程/文档 | 知识体系建立 |
| 2. 练习 | 动手实践加深理解 | 实验/项目/练习 | 技能熟练 |
| 3. 应用 | 在实际项目中应用 | 工作项目/开源 | 经验积累 |
| 4. 优化 | 持续改进和优化 | 性能分析/重构 | 质量提升 |
| 5. 分享 | 输出和分享知识 | 博客/演讲/教学 | 影响力建设 |

## 常见误区与正确认知

| 误区 | 正确认知 | 建议 |
|------|----------|------|
| 只学理论不实践 | 实践是检验理解的唯一标准 | 每学一个概念就动手验证 |
| 追求完美再开始 | 完成比完美更重要 | 先做MVP再迭代 |
| 忽视基础知识 | 基础决定上限 | 定期回顾基础 |
| 盲目追新 | 新技术需要验证 | 评估后再采用 |
| 单打独斗 | 协作效率更高 | 积极参与社区 |
