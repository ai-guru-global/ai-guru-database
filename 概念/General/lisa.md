---
title: "LISA (Layerwise Importance Sampled Adam)"
category: -concepts
tags: ["fine-tuning", "llm", "memory-efficiency", "optimizer", "training"]
relationships:
  - target: "概念/peft"
    type: related_to
  - target: "概念/qlora"
    type: related_to
  - target: "概念/colossalai"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "通过随机采样模型层级进行梯度更新，以极低显存开销实现全参数微调效果的 LLM 微调方法，无需 LoRA 等额外参数。"
provenance:
  extracted: 0.50
  inferred: 0.35
  ambiguous: 0.15
base_confidence: 0.78
lifecycle: reviewed
tier: supporting
name_zh: "分层重要性采样微调"
---

# LISA (Layerwise Importance Sampled Adam)

> 中文简称：分层重要性采样微调

[LISA](https://arxiv.org/abs/2403.17919)（Layerwise Importance Sampled Adam）是一种创新的 LLM 微调方法，通过**随机采样模型的少数层级**进行梯度更新，在保持全参数微调效果的同时，将显存消耗降低到与 LoRA 相当的水平。与 LoRA/QLoRA 等方法不同，LISA **不引入任何额外参数**，直接对原始模型权重进行选择性更新。

## 核心原理

### 关键洞察

LISA 基于一个核心观察：**LLM 微调时并非所有层级同等重要**。

```
传统全参数微调: 所有层级都计算梯度并更新 → 显存巨大
LoRA: 冻结原权重，插入低秩适配器 → 额外参数
LISA: 每次迭代只采样 k 层进行更新 → 无额外参数

效果: 全参数微调 ≈ LISA >> LoRA (在部分任务上)
显存: 全参数微调 >> LoRA ≈ LISA
```

### 算法流程

```
LISA 训练循环:

1. 从模型的 L 层中随机采样 k 层 (k << L)
   - 均匀采样或按重要性加权采样
   
2. 冻结未采样的层 (requires_grad = False)

3. 前向传播 (全模型, 冻结层不计算梯度)

4. 反向传播 (仅计算采样层的梯度)

5. Adam/AdamW 更新采样层权重

6. 解冻所有层, 重复步骤 1
```

### 重要性加权采样

```python
# 均匀采样
importance_scores = [1.0] * num_layers

# 基于梯度的重要性加权
# 记录每层的历史梯度范数
importance_scores = layer_grad_norms / sum(layer_grad_norms)

# 按重要性采样 k 层
sampled_layers = random.choices(
    range(num_layers),
    weights=importance_scores,
    k=k
)
```

## 代码实现

### 核心实现

```python
import torch
import random

class LISA:
    """Layerwise Importance Sampled Adam"""
    
    def __init__(self, model, k_layers, sampling="uniform"):
        self.model = model
        self.k = k_layers  # 每次采样的层数
        self.sampling = sampling
        self.layers = self._get_transformer_layers(model)
        self.importance = [1.0] * len(self.layers)
    
    def _get_transformer_layers(self, model):
        """提取 Transformer 层级"""
        layers = []
        for name, module in model.named_modules():
            if "layer" in name and isinstance(module, torch.nn.Module):
                layers.append(module)
        return layers
    
    def sample_and_freeze(self):
        """采样 k 层，冻结其余"""
        # 按重要性加权采样
        sampled_indices = random.choices(
            range(len(self.layers)),
            weights=self.importance,
            k=self.k
        )
        sampled_indices = set(sampled_indices)
        
        # 冻结/解冻
        for i, layer in enumerate(self.layers):
            if i in sampled_indices:
                for param in layer.parameters():
                    param.requires_grad = True
            else:
                for param in layer.parameters():
                    param.requires_grad = False
        
        return sampled_indices
    
    def update_importance(self):
        """更新层级重要性（基于梯度范数）"""
        for i, layer in enumerate(self.layers):
            grad_norm = 0.0
            for param in layer.parameters():
                if param.grad is not None:
                    grad_norm += param.grad.data.norm(2).item() ** 2
            self.importance[i] = grad_norm ** 0.5
```

### 训练循环

```python
lisa = LISA(model, k_layers=3, sampling="importance")
optimizer = torch.optim.AdamW(
    filter(lambda p: p.requires_grad, model.parameters()),
    lr=2e-5
)

for epoch in range(num_epochs):
    for batch in dataloader:
        # 每 n 步重新采样
        if step % resample_interval == 0:
            lisa.sample_and_freeze()
        
        # 前向 + 反向
        loss = model(**batch).loss
        loss.backward()
        
        # 更新
        optimizer.step()
        optimizer.zero_grad()
        
        # 更新重要性
        lisa.update_importance()
```

## 与同类方法对比

| 方法 | 额外参数 | 显存 (7B) | 效果 | 复杂度 |
|------|----------|-----------|------|--------|
| **Full Fine-tuning** | 无 | ~60GB | 最佳 | 低 |
| **LoRA** | 低秩矩阵 | ~16GB | 好 | 中 |
| **QLoRA** | 低秩矩阵 | ~8GB | 好 | 中 |
| **LISA** | **无** | **~12GB** | **接近全参** | **低** |
| **DoRA** | 方向+幅度 | ~18GB | 很好 | 中 |

## 核心优势

1. **零额外参数**: 不需要 LoRA 适配器、Adapter 层等额外参数
2. **显存高效**: 仅采样层的梯度需要显存
3. **效果接近全参微调**: 在多个基准上优于 LoRA
4. **即插即用**: 仅需修改采样逻辑，不改变模型架构
5. **理论保证**: 收敛性已被证明

## 局限性

1. **采样开销**: 每步采样引入少量额外计算
2. **超参数敏感**: k_layers 的选择影响效果
3. **推理合并**: 不像 LoRA 可以合并适配器加速推理
4. **研究阶段**: 生产验证较少

## 典型应用场景

- **消费级 GPU 微调**: 在 RTX 3090/4090 上微调 7B-13B 模型
- **快速实验**: 不需要设计 LoRA 配置，直接开始微调
- **领域适配**: 将通用模型适配到特定领域
- **指令微调**: 指令跟随能力的微调

## 与 AI Stack 的集成

在 AI Stack 中，LISA 的典型集成点：

1. **PEFT/Transformers** — 可作为 HuggingFace Trainer 的自定义优化策略
2. **训练集群** — 在 GPU 资源有限时作为全参微调的替代方案
3. **CI/CD** — 在有限资源的 CI 环境中快速验证微调效果
4. **边缘训练** — 在边缘设备上进行小模型微调

## 安装

```bash
# LISA 本身不需要安装，是一种训练策略
# 基于 PyTorch + Transformers 实现
pip install torch transformers
```

## 参考资源

- [LISA 论文 (arXiv)](https://arxiv.org/abs/2403.17919)
- [LISA 官方实现](https://github.com/OptimalScale/LMFlow)
- [LMFlow 框架](https://github.com/OptimalScale/LMFlow)

## 相关概念

- [[概念/peft]] — PEFT 参数高效微调库
- [[概念/qlora]] — QLoRA 量化低秩适配
- [[概念/colossalai]] — ColossalAI 分布式训练
- [[概念/bitsandbytes]] — bitsandbytes 量化优化库
