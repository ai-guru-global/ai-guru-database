---
title: "Checkpoint 检查点"
category: -concepts
tags: ["checkpoint", "fault-tolerance", "distributed-training", "model-saving", "resume-training"]
relationships:
  - target: "_concepts/distributed-training"
    type: related_to
  - target: "_concepts/distributed-parallelism"
    type: related_to
  - target: "_concepts/model-training"
    type: belongs_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
  - 07_Model_Training/Distributed_Training_2026.md
summary: "Checkpoint 是分布式训练的容错机制，定期将模型参数、优化器状态、训练进度持久化到磁盘。GPU 故障时从最近 Checkpoint 恢复，避免数天训练成果丢失。"
provenance:
  extracted: 0.45
  inferred: 0.45
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# Checkpoint 检查点 (Checkpointing)

> 分布式训练的"存档点"——没有它，一次 GPU 故障可能浪费数天的算力。

---

## 1. 定义

**Checkpoint**（检查点）是在训练过程中定期将模型的完整状态（参数、优化器状态、学习率调度、训练步数等）持久化到磁盘的机制。当训练因硬件故障、OOM 或人为中断而停止时，可以从最近的 Checkpoint 恢复训练。

---

## 2. Checkpoint 保存内容

| 组件 | 说明 | 大小占比 |
|------|------|----------|
| **模型参数** | 所有层的权重和偏置 | ~70% |
| **优化器状态** | Adam 的 m/v 动量（与参数等大） | ~25% |
| **学习率调度** | LR scheduler 状态 | <1% |
| **训练元信息** | epoch、step、loss 历史 | <1% |
| **随机数种子** | RNG state（保证可复现性） | <1% |
| **梯度缩放因子** | AMP loss scaling 状态 | <1% |

**Checkpoint 大小估算**：
```
Checkpoint ≈ 模型参数 × 4（FP32 主权重 + Adam m + Adam v + FP16 工作权重）

示例：
- Llama 7B: 7B × 4 bytes × 4 ≈ 112 GB
- Llama 70B: 70B × 4 bytes × 4 ≈ 1.1 TB
- DeepSeek-V3 (671B): 671B × 4 bytes × 4 ≈ 10.7 TB
```

---

## 3. 保存策略

| 策略 | 频率 | 优势 | 劣势 |
|------|------|------|------|
| **按步数** | 每 N 步保存 | 简单可控 | 步间隔不均匀 |
| **按时间** | 每 T 分钟保存 | 时间均匀 | 可能保存过于频繁 |
| **按指标** | loss 降低或指标提升时 | 只保留最优 | 可能遗漏中间状态 |
| **混合策略** | 按步 + 保留最优 | 兼顾恢复和选优 | 实现复杂 |

### 最佳实践

| 关注点 | 建议 |
|--------|------|
| **保存频率** | 每 500-2000 步或每 15-30 分钟 |
| **保留数量** | 保留最近 3-5 个 + 全局最优 1 个 |
| **存储位置** | 本地 SSD（快速）+ 远端存储（持久） |
| **异步保存** | 后台线程写入，不阻塞训练 |
| **Sharded 保存** | 分布式训练时分片存储（每 GPU 保存自己的分片） |

---

## 4. 分布式训练中的 Checkpoint

### 4.1 各框架实现

| 框架 | Checkpoint 机制 | 特点 |
|------|----------------|------|
| **PyTorch DDP** | `torch.save()` 单进程保存 | 简单，需手动处理分布式 |
| **DeepSpeed** | ZeRO Checkpoint 分片保存 | 自动分片，支持 ZeRO-1/2/3 |
| **Megatron-LM** | 分布式 Checkpoint | 支持 TP/PP 并行分片 |
| **FSDP** | `FullStateDict` 或 `ShardedStateDict` | PyTorch 原生 FSDP 分片 |
| **ColossalAI** | Booster API | 自动处理并行策略 |

### 4.2 Sharded vs Full Checkpoint

| 方式 | 说明 | 优缺点 |
|------|------|--------|
| **Full State Dict** | 收集所有参数到 rank 0 保存 | 恢复简单，但 OOM 风险 |
| **Sharded State Dict** | 每个 rank 保存自己的分片 | 内存友好，恢复时需原并行度 |

---

## 5. AI Stack 中的 Checkpoint

AI Stack 异构 GPU 集群容错层包含 Checkpoint 机制：

```
AI Stack 容错层
│
├── GPU 故障自动检测与隔离
├── Checkpoint 定期持久化（防故障丢失）
│   └── 训练中断 → 从最近 Checkpoint 自动恢复
└── 故障节点自动替换 + 任务重调度
```

---

## 6. 高级技术

| 技术 | 说明 | 优势 |
|------|------|------|
| **异步 Checkpoint** | 保存操作在后台线程执行 | 训练不中断 |
| **增量 Checkpoint** | 仅保存变化的参数 | 减少 I/O 量 |
| **内存映射 (mmap)** | 直接 mmap 到文件 | 恢复速度接近即时 |
| **Resharding** | 恢复时使用不同并行度 | 灵活调整集群规模 |
| **Checkpoint 压缩** | 对参数进行 INT8 压缩存储 | 减少 75% 存储 |

---

## 7. 局限与开放问题

1. **存储成本**：大模型 Checkpoint 可达 TB 级，存储成本高
2. **保存延迟**：同步保存会暂停训练数秒到数分钟
3. **并行度变更**：从 8-GPU Checkpoint 恢复到 16-GPU 需要 resharding
4. **版本兼容**：框架升级后旧 Checkpoint 可能无法加载

---

## Related

- [[_concepts/distributed-training]] — 分布式训练
- [[_concepts/distributed-parallelism]] — 分布式并行策略
- [[_concepts/model-training]] — 模型训练
- [[_concepts/deepspeed]] — DeepSpeed（ZeRO Checkpoint）
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack（容错层）
