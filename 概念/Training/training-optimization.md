---
title: "训练优化 (Training Optimization)"
category: -concepts
tags: ["training-optimization", "optimizer", "learning-rate", "mixed-precision", "throughput"]
relationships:
  - target: "概念/Training/mixed-precision"
    type: complements
  - target: "概念/Training/distributed-training"
    type: related_to
  - target: "概念/Training/gradient-checkpointing"
    type: complements
sources:
  - 07_模型训练/03_Optimization/
  - 07_模型训练/01_Training_Fundamentals/
summary: "训练优化是提升模型训练收敛速度、稳定性与硬件利用率的技术集合，涵盖优化器选择、学习率调度、混合精度、梯度技巧与内存优化五大维度。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-07-27
updated: 2026-07-27
aliases:
  - "Training Optimization"
  - "训练调优"
name_zh: "训练优化"
---
# 训练优化 (Training Optimization)

> 中文简称：训练优化

> 同样的模型和数据，优化做得好可以省一半卡时。

---

## 1. 定义

**训练优化**指在算法与工程两个层面提升训练效率的技术总和：算法层追求**更快收敛、更稳定**（优化器、调度、正则），工程层追求**更高 MFU**（Model FLOPs Utilization：混合精度、内存优化、通信重叠）。

---

## 2. 五大优化维度

| 维度 | 关键技术 | 典型收益 |
|------|----------|----------|
| **优化器** | AdamW（默认）、Lion、Muon、Adafactor | 收敛速度/显存 |
| **学习率调度** | Warmup + Cosine/WSD 衰减 | 训练稳定性 |
| **数值精度** | BF16 混合精度、FP8 训练 | 吞吐 ×1.5–2 |
| **梯度技巧** | 裁剪(clip=1.0)、累积、checkpointing | 防爆炸/等效大 batch/省显存 |
| **内存优化** | ZeRO 分片、CPU offload、FlashAttention | 更大模型/上下文 |

---

## 3. LLM 训练标准配方（2026）

1. **AdamW**：β=(0.9, 0.95)，weight decay 0.1
2. **调度**：warmup 0.1–1% 步数 → cosine 衰减到峰值 10%，或 WSD（Warmup-Stable-Decay）便于续训
3. **精度**：BF16 计算 + FP32 主权重/优化器状态；前沿玩家 FP8（DeepSeek-V3 已验证）
4. **梯度裁剪**：全局 norm 1.0
5. **批量**：百万 token 级全局 batch，梯度累积凑齐

---

## 4. 稳定性排障

| 症状 | 常见原因 | 处理 |
|------|----------|------|
| Loss spike | 脏数据/lr 过高 | 回滚 checkpoint + 跳过数据段 |
| Loss 不降 | warmup 不足/初始化不当 | 延长 warmup、检查 init |
| NaN | FP16 溢出 | 换 BF16 / loss scaling |
| MFU 低 | 通信瓶颈/小 kernel | 通信重叠、fused kernel |

---

## Related

- [[概念/Training/mixed-precision]] — 混合精度训练
- [[概念/Training/gradient-checkpointing]] — 梯度检查点
- [[概念/Training/distributed-training]] — 分布式训练
- [[概念/Training/zero-redundancy-optimizer]] — ZeRO 优化器
- [[概念/Training/fp8]] — FP8 训练
- [[概念/Training/training-cost-optimization]] — 训练成本优化

> ℹ️ 2026 年趋势：Muon 等二阶近似优化器在中等规模验证超越 AdamW；FP8 训练从实验室走向生产。
