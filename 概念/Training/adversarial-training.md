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
name_zh: "对抗训练"
---

# Adversarial Training

> 中文简称：对抗训练

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
- [[17_伦理安全/04_AI_Safety_RedTeaming/AI_Safety_RedTeaming|红队测试]] — 生成对抗样本
- [[12_架构基建/10_Security/AI_Security_Fundamentals|AI 安全基础]]

## 2026 对抗训练生态现状

| 方法 | 类型 | 适用 | 状态 |
|------|------|------|------|
| FGSM | 白盒 | 图像分类 | ✅ 成熟 |
| PGD | 白盒 | 通用 | ✅ 成熟 |
| TRADES | 鲁棒性 | 通用 | ✅ 主流 |
| 红队测试 | 黑盒 | LLM 安全 | ✅ 主流 |
| 对抗微调 | 防御 | LLM | ✅ 前沿 |

## 检查清单

- [ ] 对抗样本生成方法已选择
- [ ] 鲁棒性评估已建立
- [ ] 防御策略已配置
- [ ] 红队测试已执行
- [ ] 安全审计已完成

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 鲁棒性差 | 未对抗训练 | 加入对抗样本训练 |
| 精度下降 | 对抗训练过度 | 平衡精度和鲁棒性 |
| 计算成本高 | 对抗样本生成慢 | 使用快速生成方法 |
| 防御失效 | 攻击方法更新 | 持续更新防御策略 |

## 延伸阅读

- [[概念/LLM/llm-safety|LLM Safety]] — LLM 安全
- [[概念/Safety/adversarial-attack|Adversarial Attacks]] — 对抗攻击
- [[17_伦理安全/04_AI_Safety_RedTeaming/AI_Safety_RedTeaming|红队测试]] — 红队测试
- [[12_架构基建/10_Security/AI_Security_Fundamentals|AI 安全基础]] — AI 安全
- [[概念/Training/pre-training|Pre-training]] — 预训练

> ℹ️ 对抗训练是提升模型鲁棒性的核心技术，2026年 LLM 安全场景中红队测试 + 对抗微调是标配。

## 对抗训练方法对比

| 方法 | 原理 | 效果 | 计算成本 |
|------|------|------|------|
| FGSM | 单步梯度攻击 | 中 | 低 |
| PGD | 多步投影梯度 | 高 | 高 |
| TRADES | 平衡精度鲁棒 | 高 | 高 |
| Free AT | 免费对抗训练 | 中 | 低 |
| MART | 最小风险对抗 | 高 | 高 |
| 红队微调 | LLM 对抗样本 | 高 | 中 |

## LLM 对抗训练场景

| 场景 | 攻击类型 | 防御方法 |
|------|------|------|
| 提示注入 | 恶意指令 | 对抗微调 + 过滤 |
| 越狱攻击 | 绕过安全 | RLHF + 红队 |
| 数据污染 | 训练数据投毒 | 数据清洗 + 检测 |
| 模型窃取 | 查询攻击 | 访问控制 + 水印 |
| 对抗样本 | 输入扰动 | 对抗训练 + 检测 |

## 对抗训练配置示例

```python
# PGD 对抗训练配置
adversarial_config = {
    "method": "pgd",
    "epsilon": 8/255,        # 扰动范围
    "alpha": 2/255,          # 步长
    "num_steps": 10,         # PGD 步数
    "random_start": True,    # 随机初始化
    "loss_fn": "kl",         # 损失函数
}

# LLM 红队微调配置
redteam_config = {
    "attack_prompts": "redteam_dataset.jsonl",
    "defense_method": "dpo",
    "safety_weight": 0.3,
    "helpful_weight": 0.7,
}
```

## 鲁棒性评估指标

| 指标 | 说明 | 目标值 |
|------|------|------|
| 干净准确率 | 正常输入精度 | > 90% |
| 鲁棒准确率 | 对抗输入精度 | > 70% |
| 攻击成功率 | 攻击有效比例 | < 10% |
| 精度-鲁棒平衡 | 两者权衡 | 最优前沿 |
