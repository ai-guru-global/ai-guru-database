---
title: 浮点精度与混合精度训练 (Floating Point Precision)
category: 01-math-foundations
tags: ["floating-point", "mixed-precision", "fp16", "bf16", "fp8", "training"]
summary: "深入理解 AI 训练和推理中的浮点精度选择：IEEE 754 格式、混合精度训练原理、Loss Scaling、FP8 训练实战，以及精度-性能-显存的三角权衡。"
created: 2026-07-21
updated: 2026-07-21
tier: core
sources: []

---
# 浮点精度与混合精度训练

## 1. IEEE 754 浮点格式详解

### 1.1 浮点数结构

```
值 = (-1)^sign × 2^(exponent - bias) × (1 + mantissa)

FP32:  [S|EEEEEEEE|MMMMMMMMMMMMMMMMMMMMMMM]  32 bits
FP16:  [S|EEEEE|MMMMMMMMMM]                  16 bits
BF16:  [S|EEEEEEEE|MMMMMMM]                  16 bits
FP8:   [S|EEEE|MMM] 或 [S|EEEEE|MM]          8 bits
```

### 1.2 各格式对比

| 格式 | 位数 | 指数位 | 尾数位 | 最大值 | 最小正数 | 精度(有效位) |
|------|------|--------|--------|--------|----------|-------------|
| FP64 | 64 | 11 | 52 | 1.8×10³⁰⁸ | 2.2×10⁻³⁰⁸ | ~16 |
| FP32 | 32 | 8 | 23 | 3.4×10³⁸ | 1.2×10⁻³⁸ | ~7 |
| TF32 | 19 | 8 | 10 | 3.4×10³⁸ | 1.2×10⁻³⁸ | ~3.3 |
| BF16 | 16 | 8 | 7 | 3.4×10³⁸ | 1.2×10⁻³⁸ | ~2.4 |
| FP16 | 16 | 5 | 10 | 65504 | 6.1×10⁻⁵ | ~3.3 |
| FP8 E4M3 | 8 | 4 | 3 | 448 | 2⁻⁹ | ~1.7 |
| FP8 E5M2 | 8 | 5 | 2 | 57344 | 2⁻¹⁶ | ~1.4 |
| INT8 | 8 | - | - | 127/-128 | 1 | 定点 |
| INT4 | 4 | - | - | 7/-8 | 1 | 定点 |

### 1.3 为什么 BF16 成为训练主流？

```
FP16 的致命缺陷:
- 动态范围小 (最大 65504)
- 大模型激活值/梯度容易溢出
- 必须配合 Loss Scaling 使用

BF16 的优势:
- 动态范围 = FP32 (指数位相同)
- 无需 Loss Scaling
- 硬件原生支持 (A100/H100/TPU)
- 代价: 精度降低 (7位尾数 vs 23位)

2026 趋势: FP8 训练
- H100/B200 原生 FP8 Tensor Core
- 前向: FP8 E4M3 (精度优先)
- 反向: FP8 E5M2 (范围优先)
- 配合 per-tensor scaling 保持精度
```

## 2. 混合精度训练 (Mixed Precision Training)

### 2.1 核心原理

```
┌─────────────────────────────────────────────────────┐
│  混合精度训练三要素:                                  │
│                                                     │
│  1. FP32 主权重 (Master Weights)                    │
│     - 参数更新在 FP32 精度下进行                     │
│     - 保证小梯度不被截断                             │
│                                                     │
│  2. FP16/BF16 前向+反向计算                         │
│     - 矩阵乘法用低精度 (Tensor Core 加速)           │
│     - 激活值用低精度存储 (节省显存)                  │
│                                                     │
│  3. Loss Scaling (仅 FP16 需要)                     │
│     - 将 Loss 放大 2^k 倍                           │
│     - 防止小梯度在 FP16 中下溢为 0                  │
│     - 更新前缩回: grad = grad / scale               │
└─────────────────────────────────────────────────────┘
```

### 2.2 PyTorch 混合精度实战

```python
import torch
from torch.amp import autocast, GradScaler

model = MyModel().cuda()
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)
scaler = GradScaler('cuda')  # FP16 需要; BF16 不需要

for batch in dataloader:
    optimizer.zero_grad()
    
    # 前向: 自动选择 FP16/BF16
    with autocast('cuda', dtype=torch.float16):
        output = model(batch['input'])
        loss = criterion(output, batch['target'])
    
    # 反向: 缩放梯度
    scaler.scale(loss).backward()
    
    # 更新: 反缩放 + 裁剪 + 步进
    scaler.unscale_(optimizer)
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    scaler.step(optimizer)
    scaler.update()  # 动态调整 scale factor
```

### 2.3 BF16 训练 (无需 Scaler)

```python
# BF16 更简洁 — 无需 Loss Scaling
with autocast('cuda', dtype=torch.bfloat16):
    output = model(batch['input'])
    loss = criterion(output, batch['target'])

loss.backward()
torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
optimizer.step()
```

## 3. FP8 训练 (2024-2026 前沿)

### 3.1 FP8 训练架构

```
┌──────────────────────────────────────────────┐
│  FP8 训练数据流:                              │
│                                              │
│  权重 (FP32 master)                          │
│    ↓ cast + per-tensor scale                 │
│  权重 (FP8 E4M3) ──→ GEMM ──→ 激活 (FP8)   │
│                          ↑                   │
│  输入激活 (FP8 E4M3) ────┘                   │
│                                              │
│  反向:                                       │
│  梯度 (FP8 E5M2) ──→ GEMM ──→ 权重梯度     │
│                          ↑                   │
│  激活转置 (FP8 E4M3) ───┘                    │
│                                              │
│  更新: 权重梯度 → FP32 → AdamW → FP32 权重  │
└──────────────────────────────────────────────┘
```

### 3.2 Per-Tensor Scaling

```python
# FP8 的核心: 动态缩放因子
class FP8Linear(torch.nn.Module):
    def forward(self, x):
        # 计算缩放因子: 使数据填满 FP8 范围
        x_amax = x.abs().max()
        x_scale = 448.0 / x_amax  # E4M3 最大值
        
        # 量化到 FP8
        x_fp8 = (x * x_scale).to(torch.float8_e4m3fn)
        w_fp8 = (self.weight * self.w_scale).to(torch.float8_e4m3fn)
        
        # FP8 矩阵乘法 (Tensor Core)
        out_fp8 = torch._scaled_mm(x_fp8, w_fp8.t())
        
        # 反量化
        return out_fp8 / (x_scale * self.w_scale)
```

## 4. 推理量化精度

### 4.1 量化格式选择

| 场景 | 推荐格式 | 精度损失 | 加速比 |
|------|----------|----------|--------|
| 云端通用推理 | FP16 / BF16 | <0.1% | 2× |
| 云端高吞吐 | INT8 (W8A8) | <0.5% | 4× |
| 边缘/手机 | INT4 (W4A16) | 1-3% | 8× |
| 极致压缩 | INT2/GPTQ/AWQ | 3-8% | 16× |
| 2026 前沿 | FP4 (NVFP4) | <1% | 8× |

### 4.2 量化感知训练 (QAT)

```python
# 在训练中模拟量化误差
import torch.ao.quantization as quant

# 插入 FakeQuantize 节点
model_fp32 = MyModel()
model_fp32.qconfig = quant.get_default_qat_qconfig('fbgemm')
model_qat = quant.prepare_qat(model_fp32)

# 正常训练 (前向模拟量化，反向 STE 直通)
for epoch in range(fine_tune_epochs):
    train(model_qat, dataloader)

# 转换为真实量化模型
model_int8 = quant.convert(model_qat)
```

## 5. 精度问题诊断

### 5.1 常见精度问题排查

```python
# 诊断工具: 检查每层激活值分布
def debug_precision(model, input_tensor):
    hooks = []
    stats = {}
    
    def make_hook(name):
        def hook(module, input, output):
            if isinstance(output, torch.Tensor):
                stats[name] = {
                    'mean': output.float().mean().item(),
                    'std': output.float().std().item(),
                    'max': output.float().max().item(),
                    'min': output.float().min().item(),
                    'nan_count': torch.isnan(output).sum().item(),
                    'inf_count': torch.isinf(output).sum().item(),
                    'zero_ratio': (output == 0).float().mean().item(),
                }
        return hook
    
    for name, module in model.named_modules():
        hooks.append(module.register_forward_hook(make_hook(name)))
    
    model(input_tensor)
    
    for h in hooks:
        h.remove()
    
    return stats
```

### 5.2 精度-性能权衡决策树

```
需要训练还是推理？
├── 训练
│   ├── 有 H100/B200? → FP8 混合精度 (最快)
│   ├── 有 A100? → BF16 混合精度 (稳定)
│   ├── 有 V100/旧卡? → FP16 + Loss Scaling
│   └── 显存极度紧张? → BF16 + 梯度检查点
└── 推理
    ├── 精度敏感 (医疗/金融)? → FP16
    ├── 通用场景? → INT8 (W8A8)
    ├── 边缘设备? → INT4 (AWQ/GPTQ)
    └── 极致速度? → FP8 / INT4 + 投机解码
```

## 相关文档

- [[01_数学基础/05_Numerical_Methods/Numerical_Methods|数值方法总论]]
- [[01_数学基础/GPU_Programming/|GPU 编程]] — Tensor Core 与精度
- [[07_模型训练/04_Distributed_Training/|分布式训练]] — 多卡混合精度
- [[10_部署推理/02_Inference_Engines/|推理引擎]] — 量化推理
- [[05_大模型/07_Fine_tuning_Techniques/|微调技术]] — LoRA 精度选择
