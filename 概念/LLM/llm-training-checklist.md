---
title: LLM 训练检查清单
category: concepts
tags:
  - llm
  - training
  - checklist
  - best-practices
  - fine-tuning
  - alignment
aliases:
  - LLM Training Checklist
  - 训练检查清单
  - LLM Fine-tuning Checklist
relationships:
  - target: "概念/pre-training"
    type: related_to
  - target: "概念/sft"
    type: related_to
  - target: "概念/rlhf"
    type: related_to
  - target: "概念/distributed-training"
    type: related_to
summary: 本页汇总 LLM 训练（预训练、SFT、对齐）过程中需要关注的数据、超参、稳定性、评估和工程 checklist。
lifecycle: reviewed
tier: supporting
created: 2026-06-25
updated: 2026-06-25
sources: []
---

# LLM 训练检查清单

## 一句话总结

LLM 训练需要在**数据质量**、**超参数**、**训练稳定性**、**评估**和**工程效率**五个维度上进行系统检查。

---

## 1. 数据准备

- [ ] 数据来源合法、版权清晰
- [ ] 进行去重（文档级、段落级、n-gram 级）
- [ ] 过滤低质量、有毒、偏见内容
- [ ] 控制数据配比（代码、网页、书籍、对话等）
- [ ] 清洗特殊字符、乱码、重复片段
- [ ] 对 SFT/对齐数据：检查标注质量、格式一致性
- [ ] 划分训练/验证/测试集，避免数据泄漏

---

## 2. Tokenizer 与格式

- [ ] 确认词表大小与模型匹配
- [ ] 检查特殊 token 是否完整（pad、eos、mask 等）
- [ ] 统一 SFT 的 prompt 模板（chat template）
- [ ] 验证长文本不会被过度截断
- [ ] 检查 tokenizer 对目标语言的支持

---

## 3. 超参数

- [ ] 设置合适的学习率（预训练大，SFT 小）
- [ ] 配置 warmup 步数（通常 1%~5% 总步数）
- [ ] 选择学习率衰减策略（cosine、linear）
- [ ] 设置 batch size 并配合学习率缩放
- [ ] 配置梯度裁剪（通常 1.0）
- [ ] 设置权重衰减（weight decay，通常 0.01）
- [ ] 确认 dropout 率（预训练通常 0.0~0.1）

---

## 4. 训练稳定性

- [ ] 监控 loss 曲线，及时处理 loss spike
- [ ] 使用混合精度（FP16/BF16）并配置 Loss Scaling
- [ ] 启用 Gradient Checkpointing 节省显存
- [ ] 配置分布式训练策略（DP/TP/PP/ZeRO）
- [ ] 定期保存 checkpoint
- [ ] 监控梯度范数，防止梯度爆炸
- [ ] 检查数据加载是否成为瓶颈

---

## 5. 评估

- [ ] 监控训练/验证 PPL
- [ ] 在下游任务基准上测试
- [ ] 进行人工评估（有用性、安全性、流畅性）
- [ ] 对比 SFT/对齐前后的效果变化
- [ ] 检查是否出现灾难性遗忘
- [ ] 评估长上下文能力

---

## 6. 安全与对齐

- [ ] 对齐数据覆盖有害、偏见、隐私场景
- [ ] 使用 KL 约束防止 RLHF/DPO 过度优化
- [ ] 监控奖励黑客（reward hacking）现象
- [ ] 进行红队测试（red teaming）
- [ ] 评估模型拒绝不当请求的能力

---

## 7. 工程效率

- [ ] 选择合适框架（Megatron、DeepSpeed、FSDP）
- [ ] 优化数据加载和预处理 pipeline
- [ ] 监控 GPU 利用率，减少空闲等待
- [ ] 使用 FlashAttention 加速训练
- [ ] 合理设置 checkpoint 保存频率
- [ ] 记录实验参数和结果（experiment tracking）

---

## 阶段-specific 重点

| 阶段 | 重点关注 |
|---|---|
| **预训练** | 数据规模/质量、训练稳定性、PPL |
| **SFT** | 指令数据质量、格式一致性、避免过拟合 |
| **RLHF** | 偏好数据质量、奖励模型泛化、KL 约束 |
| **DPO** | 偏好对质量、参考模型选择、超参数 β |

---

## 延伸阅读

- [[概念/pre-training|预训练]]
- [[概念/sft|SFT]]
- [[概念/rlhf|RLHF]]
- [[概念/dpo|DPO]]
- [[概念/distributed-training|分布式训练]]
- [[概念/mixed-precision|混合精度训练]]
- [[概念/perplexity|困惑度 PPL]]
