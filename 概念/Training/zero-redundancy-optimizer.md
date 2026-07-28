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
  - 07_模型训练/04_Distributed_Training/
summary: "ZeRO 通过将优化器状态、梯度和参数分片到各数据并行进程，消除传统数据并行的显存冗余，是 DeepSpeed 的核心技术，PyTorch FSDP 是其同思想实现。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.90
lifecycle: reviewed
tier: core
created: 2026-07-27
updated: 2026-07-27
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

## Related

- [[概念/Training/deepspeed]] — DeepSpeed（ZeRO 宿主框架）
- [[概念/Training/fsdp]] — FSDP（PyTorch 原生实现）
- [[概念/Training/distributed-training]] — 分布式训练总览
- [[概念/Training/megatron-lm]] — Megatron-LM（3D 并行）
- [[概念/Training/mixed-precision]] — 混合精度（显存账本基础）

> ℹ️ 记忆锚点：ZeRO 的三阶段就是"先切状态、再切梯度、最后切参数"，切得越多省得越多、通信越贵。
