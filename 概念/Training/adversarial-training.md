---
title: "Adversarial Training"
category: -concepts
tags: ["security", "ai", "adversarial", "model-training", "robustness"]
summary: "Adversarial Training（对抗训练）是在训练过程中加入对抗样本，提升模型对对抗攻击鲁棒性的方法。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "对抗训练"
relationships:
  - target: "概念/Safety/prompt-injection"
    type: related_to
  - target: "概念/LLM/llm-safety"
    type: improves
sources:
  - "https://arxiv.org/abs/1412.6572"  # Goodfellow FGSM
  - "https://arxiv.org/abs/1706.06083"  # Madry PGD
---

# Adversarial Training

> **一句话理解**: 对抗训练就是「用假样本一起训练」，让模型见过各种使坏的输入，从而变得更抗骗。

## 核心原理

### 什么是对抗样本

对抗样本是在原始输入上添加精心设计的微小扰动，使模型产生错误输出：

```
原始图片: 熊猫 (置信度 99%)
     + 微小扰动 (人眼不可见)
     = 对抗样本 → 模型识别为"长臂猿" (置信度 99%)
```

### 对抗训练流程

```
1. 取一批正常样本 x
2. 生成对抗样本 x' = x + ε (FGSM/PGD)
3. 混合训练: loss = L(model, x, y) + λ·L(model, x', y)
4. 更新模型参数
5. 重复 1-4
```

## 主要方法

| 方法 | 原理 | 优势 | 劣势 |
|------|------|------|------|
| **FGSM** | 单步梯度符号扰动 | 快速 | 鲁棒性有限 |
| **PGD** | 多步迭代投影梯度 | 强鲁棒性 | 训练慢 3-10x |
| **TRADES** | 平衡准确率与鲁棒性 | 灵活调节 | 超参敏感 |
| **FreeAT** | 重用梯度减少计算 | 快速 | 稳定性差 |
| **对抗微调** | 在 LLM 微调中加入对抗提示 | 适合 NLP | 研究早期 |

### PGD 对抗训练代码示例

```python
import torch
import torch.nn.functional as F

def pgd_attack(model, x, y, epsilon=0.03, alpha=0.01, steps=7):
    """PGD 对抗样本生成"""
    x_adv = x.clone().detach() + torch.empty_like(x).uniform_(-epsilon, epsilon)
    
    for _ in range(steps):
        x_adv.requires_grad_(True)
        loss = F.cross_entropy(model(x_adv), y)
        grad = torch.autograd.grad(loss, x_adv)[0]
        x_adv = x_adv.detach() + alpha * grad.sign()
        x_adv = torch.clamp(x_adv, x - epsilon, x + epsilon)
    
    return x_adv.detach()

# 对抗训练循环
for x, y in dataloader:
    x_adv = pgd_attack(model, x, y)
    x_combined = torch.cat([x, x_adv])
    y_combined = torch.cat([y, y])
    
    loss = F.cross_entropy(model(x_combined), y_combined)
    loss.backward()
    optimizer.step()
```

## LLM 中的对抗训练

在 LLM 时代，对抗训练的应用场景扩展：

| 场景 | 方法 | 目标 |
|------|------|------|
| **安全对齐** | 对抗提示 + 拒绝训练 | 抵抗越狱 |
| **幻觉缓解** | 对抗事实 + 纠正训练 | 减少编造 |
| **偏见消除** | 对抗性别/种族提示 | 公平输出 |
| **指令遵循** | 对抗干扰指令 | 不被带偏 |

## 效果与代价

| 指标 | 无对抗训练 | 有对抗训练 |
|------|------------|------------|
| Clean Accuracy | 95% | 92-94% |
| Robust Accuracy (PGD) | 0-5% | 50-70% |
| 训练时间 | 1x | 3-10x |
| 推理时间 | 1x | 1x (无额外开销) |

## 最佳实践

1. **渐进式训练**：先正常训练，再逐步增加对抗比例
2. **调节 ε**：扰动太大会降低 clean accuracy，太小则鲁棒性不足
3. **多方法组合**：FGSM + PGD 混合训练效果更好
4. **评估先行**：用 AutoAttack 等强攻击评估真实鲁棒性
5. **LLM 场景**：结合红队测试生成对抗提示用于安全微调

## Related

- [[概念/Safety/prompt-injection|Prompt 注入]] — LLM 中的对抗攻击
- [[概念/LLM/llm-safety|LLM 安全]] — 对抗训练的应用场景
- [[伦理安全/AI_Safety_RedTeaming/AI_Safety_RedTeaming|红队测试]] — 生成对抗样本
- [[架构基建/Security/AI_Security_Fundamentals|AI 安全基础]]
