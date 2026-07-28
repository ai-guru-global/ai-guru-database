---
title: 混合精度训练 (Mixed Precision Training)
category: 05-training
tags: ["mixed-precision", "fp16", "bf16", "fp8", "training-optimization"]
summary: "混合精度训练完整指南：FP16/BF16/FP8 原理与实践、Loss Scaling、AMP 使用、各硬件支持、2026 最新 FP8 训练与性能优化。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

name_zh: "混合精度训练"
---
# 混合精度训练 (Mixed Precision Training)

> 中文简称：混合精度训练

## 1. 为什么需要混合精度？

```
FP32 (单精度): 32 bit = 1符号 + 8指数 + 23尾数
  - 内存: 4 bytes/参数
  - 7B 模型: 28GB 仅参数
  - 训练 (含优化器): ~112GB

FP16 (半精度): 16 bit = 1符号 + 5指数 + 10尾数
  - 内存: 2 bytes/参数 → 省 50%
  - 计算: Tensor Core 加速 2-8x
  - 问题: 范围小 (易溢出/下溢)

BF16 (Brain Float): 16 bit = 1符号 + 8指数 + 7尾数
  - 范围: 与 FP32 相同 (不易溢出)
  - 精度: 比 FP16 低 (尾数少)
  - 2026: 训练默认选择

FP8 (8位浮点): 8 bit = 1符号 + 4/5指数 + 2/3尾数
  - 内存: 1 byte/参数 → 省 75%
  - 计算: H100/B200 原生支持
  - 2025-2026: 前沿训练精度

混合精度 = 前向/反向用低精度 + 权重主副本用高精度
```

## 2. 核心机制

### 2.1 Loss Scaling

```python
import torch

class MixedPrecisionTrainer:
    """
    混合精度训练核心: Loss Scaling
    
    问题: FP16 梯度太小 → 下溢为 0
    解决: 放大 loss → 梯度变大 → 更新前缩回
    """
    def __init__(self, model, optimizer, use_bf16=True):
        self.model = model
        self.optimizer = optimizer
        self.dtype = torch.bfloat16 if use_bf16 else torch.float16
        
        # FP16 需要 GradScaler; BF16 不需要 (范围够大)
        self.scaler = torch.amp.GradScaler('cuda', enabled=not use_bf16)
        
        # FP32 主权重 (优化器状态)
        self.master_weights = {
            n: p.data.float().clone() 
            for n, p in model.named_parameters()
        }
    
    def train_step(self, batch):
        """一个训练步"""
        # 前向: 低精度
        with torch.amp.autocast('cuda', dtype=self.dtype):
            output = self.model(batch["input"])
            loss = compute_loss(output, batch["target"])
        
        # 反向: 低精度梯度
        self.scaler.scale(loss).backward()
        
        # 更新: 高精度
        self.scaler.step(self.optimizer)
        self.scaler.update()
        self.optimizer.zero_grad()
        
        return loss.item()

# BF16 vs FP16:
# BF16: 不需要 Loss Scaling (指数位多，范围大)
# FP16: 必须 Loss Scaling (否则梯度下溢)
# 2026: 优先用 BF16 (A100/H100/B200 都支持)
```

### 2.2 PyTorch AMP 实战

```python
# 最简混合精度训练 (PyTorch 2.x):

model = MyModel().cuda()
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)

# 方法1: torch.amp.autocast (推荐)
for batch in dataloader:
    with torch.amp.autocast('cuda', dtype=torch.bfloat16):
        output = model(batch["input"])
        loss = loss_fn(output, batch["target"])
    
    loss.backward()
    optimizer.step()
    optimizer.zero_grad()

# 方法2: 手动管理 (更灵活)
scaler = torch.amp.GradScaler('cuda')  # 仅 FP16 需要

for batch in dataloader:
    with torch.amp.autocast('cuda', dtype=torch.float16):
        output = model(batch["input"])
        loss = loss_fn(output, batch["target"])
    
    scaler.scale(loss).backward()
    scaler.unscale_(optimizer)
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    scaler.step(optimizer)
    scaler.update()
    optimizer.zero_grad()
```

## 3. FP8 训练 (2025-2026)

### 3.1 FP8 格式

```python
# FP8 两种格式:
# E4M3: 1符号 + 4指数 + 3尾数 (范围小，精度高) → 前向
# E5M2: 1符号 + 5指数 + 2尾数 (范围大，精度低) → 反向梯度

FP8_USAGE = {
    "前向激活": "E4M3 (精度优先)",
    "反向梯度": "E5M2 (范围优先)",
    "权重": "E4M3 (静态量化)",
    "优化器状态": "仍用 FP32/BF16",
}

# 硬件支持:
# NVIDIA H100: FP8 Tensor Core (2x BF16 吞吐)
# NVIDIA B200: FP8 + FP4 (2025+)
# AMD MI300X: FP8 支持
```

### 3.2 FP8 训练实践

```python
# 使用 TransformerEngine (NVIDIA):
import transformer_engine.pytorch as te

# 替换标准层为 FP8 层
model = te.TransformerLayer(
    hidden_size=4096,
    ffn_hidden_size=16384,
    num_attention_heads=32,
    fp8=True,  # 启用 FP8
    fp8_recipe=te.recipe.DelayedScaling(
        margin=0,
        fp8_format=te.recipe.Format.HYBRID,  # E4M3+E5M2
        amax_history_len=1024,
        amax_compute_algo="max",
    ),
)

# 或使用 torch.float8 (PyTorch 2.4+):
from torch.float8 import Float8LinearConfig

config = Float8LinearConfig(
    cast_config_input=ScalingType.DELAYED,
    cast_config_weight=ScalingType.DELAYED,
    cast_config_grad_output=ScalingType.DELAYED,
)
# 将 Linear 层替换为 Float8Linear
```

## 4. 性能对比

### 4.1 各精度训练性能

| 精度 | 显存 (7B) | 吞吐 (相对) | 质量 | 硬件要求 |
|------|-----------|------------|------|---------|
| FP32 | 112 GB | 1x | 基准 | 任何 GPU |
| FP16 + AMP | 56 GB | 2-3x | 需 Loss Scale | V100+ |
| BF16 | 56 GB | 2-3x | 等同 FP32 | A100+ |
| FP8 | 28 GB | 4-5x | 轻微损失 | H100+ |
| FP8 + 量化优化器 | 21 GB | 4-5x | 轻微损失 | H100+ |

### 4.2 显存计算

```python
# 训练显存 = 模型 + 梯度 + 优化器 + 激活

def estimate_training_memory(n_params, precision="bf16", 
                             optimizer="adamw", batch_size=1,
                             seq_len=2048, activation_ckpt=False):
    """估算训练显存 (GB)"""
    P = n_params  # 参数量
    
    # 模型参数
    if precision == "fp32":
        model_mem = P * 4
    else:  # bf16/fp16
        model_mem = P * 2
    
    # 梯度 (同精度)
    grad_mem = model_mem
    
    # 优化器状态 (AdamW: m + v + master weights)
    if optimizer == "adamw":
        optim_mem = P * 12  # 4(m) + 4(v) + 4(master)
    elif optimizer == "adamw_8bit":
        optim_mem = P * 6   # 量化优化器
    elif optimizer == "sgd":
        optim_mem = P * 8   # 4(momentum) + 4(master)
    
    # 激活 (粗略估计)
    if activation_ckpt:
        act_mem = batch_size * seq_len * 4096 * 2  # 大幅减少
    else:
        act_mem = batch_size * seq_len * 4096 * 34  # 完整激活
    
    total = (model_mem + grad_mem + optim_mem + act_mem) / 1e9
    return total

# 示例: 7B BF16 AdamW
# ≈ 14 + 14 + 84 + 激活 ≈ 120+ GB (需要多卡)
```

## 5. 最佳实践

```python
MIXED_PRECISION_BEST_PRACTICES = {
    "选择精度": [
        "A100/H100/B200 → 默认 BF16",
        "H100/B200 追求速度 → FP8 (TransformerEngine)",
        "V100/旧卡 → FP16 + GradScaler",
        "CPU 训练 → FP32 或 BF16 (Intel)",
    ],
    "常见问题": [
        "Loss 变 NaN → 检查是否有溢出 (FP16)",
        "精度下降 → 确保 LayerNorm/Softmax 用 FP32",
        "FP8 不稳定 → 增大 amax_history_len",
    ],
    "优化技巧": [
        "Gradient Checkpointing: 用计算换显存",
        "ZeRO: 分片优化器状态",
        "8-bit Adam: 优化器显存减半",
        "Flash Attention: 减少激活显存",
    ],
}
```

## 6. 交叉引用

- [[07_模型训练/04_Distributed_Training/|分布式训练]]
- [[07_模型训练/03_Optimization/|优化器]]
- [[07_模型训练/04_Distributed_Training/Training_Infrastructure|训练基础设施]]
- [[概念/Training/mixed-precision|混合精度概念]]
- [[概念/Training/fp8|FP8]]
- [[12_架构基建/|架构基建]]
