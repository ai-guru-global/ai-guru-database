---
title: "Checkpoint 检查点"
category: -concepts
tags: ["checkpoint", "fault-tolerance", "distributed-training", "model-saving", "resume-training"]
relationships:
  - target: "概念/distributed-training"
    type: related_to
  - target: "概念/distributed-parallelism"
    type: related_to
  - target: "概念/model-training"
    type: belongs_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
  - 07_模型训练/Distributed_Training_2026.md
summary: "Checkpoint 是分布式训练的容错机制，定期将模型参数、优化器状态、训练进度持久化到磁盘。GPU 故障时从最近 Checkpoint 恢复，避免数天训练成果丢失。"
provenance:
  extracted: 0.45
  inferred: 0.45
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
name_zh: "Checkpoint 检查点"
---

# Checkpoint 检查点 (Checkpointing)

> 中文简称：Checkpoint 检查点

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

- [[概念/distributed-training]] — 分布式训练
- [[概念/distributed-parallelism]] — 分布式并行策略
- [[概念/model-training]] — 模型训练
- [[概念/deepspeed]] — DeepSpeed（ZeRO Checkpoint）
- [[12_架构基建/AI_Stack_Deep_Dive]] — AI Stack（容错层）

---

## 2026 Checkpoint 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **异步 Checkpoint** | 训练不中断的后台异步保存 | GA |
| **分布式 Checkpoint** | PyTorch DCP 多卡并行保存/加载 | GA |
| **增量 Checkpoint** | 只保存变化部分，减少存储和 I/O | GA |
| **对象存储直写** | 直接写入 S3/OSS 避免本地磁盘瓶颈 | GA |
| **容错恢复** | 节点故障自动从最近 Checkpoint 恢复 | GA |

## 生产最佳实践

1. **频率平衡**：每 500-1000 步保存一次，平衡恢复时间与存储成本
2. **异步保存**：生产训练必用异步 Checkpoint，避免 I/O 阻塞训练
3. **多副本存储**：Checkpoint 同时写本地 + 对象存储，防止单点丢失
4. **定期清理**：保留最近 N 个 + 最优 Checkpoint，避免存储爆炸
5. **验证完整性**：加载前校验 Checkpoint 哈希，防止损坏文件导致训练崩溃

## Checkpoint 管理示例

```python
import torch
from pathlib import Path

class CheckpointManager:
    def __init__(self, save_dir: str, max_keep: int = 5):
        self.save_dir = Path(save_dir)
        self.max_keep = max_keep
        self.save_dir.mkdir(parents=True, exist_ok=True)
    
    def save(self, model, optimizer, step: int, metrics: dict):
        path = self.save_dir / f"checkpoint-step{step}.pt"
        torch.save({
            "step": step,
            "model_state_dict": model.state_dict(),
            "optimizer_state_dict": optimizer.state_dict(),
            "metrics": metrics,
        }, path)
        self._cleanup()
    
    def _cleanup(self):
        """保留最近 N 个 + 最优"""
        checkpoints = sorted(self.save_dir.glob("checkpoint-*.pt"))
        if len(checkpoints) > self.max_keep:
            for ckpt in checkpoints[:-self.max_keep]:
                ckpt.unlink()
    
    def load_latest(self):
        checkpoints = sorted(self.save_dir.glob("checkpoint-*.pt"))
        if not checkpoints:
            return None
        return torch.load(checkpoints[-1], weights_only=True)
```

## Checkpoint 策略对比

| 策略 | 保存频率 | 存储开销 | 恢复粒度 | 适用场景 |
|------|----------|----------|----------|----------|
| 每 N 步 | 固定 | 中 | 细 | 通用训练 |
| 最优保存 | 指标提升时 | 低 | 粗 | 微调 |
| 异步保存 | 后台线程 | 中 | 细 | 大模型训练 |
| 分布式保存 | 每卡独立 | 高 | 细 | 多机训练 |
| 增量保存 | 仅变化参数 | 低 | 细 | 超大模型 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 存储爆炸 | 未清理旧 Checkpoint | 设置 max_keep + 定期清理 |
| 加载失败 | 文件损坏 | 保存时计算哈希 + 加载前校验 |
| 保存阻塞训练 | 同步 I/O | 使用异步保存线程 |
| 多机不一致 | 分布式保存失败 | 使用 DCP 分布式 Checkpoint |

## 生产检查清单

1. ✅ 异步保存避免阻塞训练
2. ✅ 设置 max_keep 自动清理旧文件
3. ✅ 保存时计算哈希 + 加载前校验
4. ✅ 多机训练使用分布式 Checkpoint
5. ✅ 存储到持久化存储（S3/NFS）
6. ✅ 记录每个 Checkpoint 的训练指标

## 总结

Checkpoint 是训练容错和模型管理的核心机制，2026 年大模型训练必须使用异步保存、分布式 Checkpoint 和自动清理策略，确保训练中断后可快速恢复且不浪费存储资源。

> 💡 Checkpoint 的核心价值是“训练保险”——任何长时间训练都必须有完善的 Checkpoint 策略，否则一次故障可能浪费数天工作。
