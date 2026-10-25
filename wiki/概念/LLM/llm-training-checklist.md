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
updated: 2026-07-21
sources: []
name_zh: "LLM 训练检查清单"
---

# LLM 训练检查清单

> 中文简称：LLM 训练检查清单

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

---

## 2026 训练生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **FP8 训练** | H100+ 原生支持，吐吐量提升 2x | GA |
| **3D 并行** | 数据 + 模型 + 流水线并行线性扩展 | GA |
| **FlashAttention-3** | H100 专用 IO 感知注意力，1.5-2x 加速 | GA |
| **ZeRO-Infinity** | 优化器状态卸载到 NVMe，支持更大模型 | GA |
| **GRPO/DPO** | 无需 Critic 的 RLHF 替代方案 | GA |

## 生产最佳实践

1. **FP8 优先**：H100+ GPU 默认启用 FP8 训练，质量保留且速度翻倍
2. **学习率调度**：使用 Cosine Annealing + Warmup，避免训练不稳定
3. **梯度累积**：显存不足时用梯度累积模拟大 batch，避免 OOM
4. **Checkpoint 定期保存**：每 N 步保存 checkpoint，支持断点续训
5. **监控 loss 曲线**：实时监控 train/eval loss，及时发现过拟合或发散

## 训练流程全景检查清单

| 阶段 | 检查项 | 关键指标 |
|------|---------|----------|
| **数据准备** | 去重/清洗/分词/配比 | 数据量、多样性、质量分 |
| **环境搭建** | GPU 驱动/CUDA/NCCL/分布式 | 通信带宽、GPU 利用率 |
| **预训练** | LR调度/梯度裁剪/mixed precision | loss 收敛、GPU MFU |
| **SFT** | 指令数据质量/对话格式 | eval loss、人工评估 |
| **RLHF/DPO** | 奖励模型/偏好数据 | win rate、安全性 |
| **评估** | 多维度 benchmark + 人工 | MMLU/GSM8K/HumanEval |
| **发布** | 量化/安全过滤/文档 | 推理速度、安全分 |

## 常见训练问题排查

| 问题 | 可能原因 | 解决方案 |
|------|---------|----------|
| Loss 发散 | LR 过高 / 数据异常 | 降低 LR、检查数据 |
| Loss 不降 | LR 过低 / 数据质量差 | 提高 LR、清洗数据 |
| 显存 OOM | batch 过大 / 序列过长 | 梯度累积、序列并行 |
| 训练变慢 | 通信瓶颈 / IO 瓶颈 | 检查 NCCL、数据加载 |
| 过拟合 | 数据不足 / 正则化不够 | 增加数据、dropout |

## 延伸阅读

- [[概念/LLM/large-language-model|大语言模型]] — LLM 基础概念
- [[概念/LLM/llm-production-pipeline|生产流水线]] — 从训练到部署
- [[概念/Training/distributed-training|分布式训练]] — 并行策略详解
- [[概念/LLM/llm-quantization|LLM 量化]] — 训练后量化发布

## 训练成本估算参考

| 模型规模 | GPU | 时间 | 估算成本 |
|---------|-----|------|----------|
| 7B SFT | 8×A100 | 4-8h | ~$200 |
| 70B SFT | 64×A100 | 2-4天 | ~$5K |
| 7B 预训练 | 64×A100 | 2-4周 | ~$50K |
| 70B 预训练 | 512×H100 | 1-3月 | ~$2M |

> ℹ️ 实际成本取决于数据量、序列长度、并行策略等因素，以上为粗略估算。
建议从小规模实验开始，验证效果后再扩大训练规模。
训练前务必检查数据质量，垃圾数据会严重影响模型效果。
定期保存 checkpoint 并验证可恢复性，避免训练中断后无法续训。
