---
title: Fine Tuning Techniques
type: index
created: 2026-07-02
updated: 2026-07-21
sources: []
name_zh: "微调技术"
name_en: "Fine tuning Techniques"
---

# Fine Tuning Techniques

> 中文简称：微调技术 ｜ English Name: Fine tuning Techniques

微调技术索引，覆盖 LoRA/QLoRA、SFT、RLHF、DPO 等参数高效微调方法。

## 子域简介

本子域聚焦 LLM 微调技术：

- **PEFT**: 参数高效微调 (LoRA, QLoRA, DoRA)
- **对齐技术**: SFT, RLHF, DPO
- **工具**: LLaMA-Factory, Axolotl, Unsloth, ms-swift
- **高级**: 模型合并、Agent 微调

## Files

- [[05_大模型/07_Fine_tuning_Techniques/Axolotl_Deep_Dive|Axolotl Deep Dive]]
- [[05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Strategies|Fine Tuning Strategies]]
- [[05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Techniques|Fine Tuning Techniques]]
- [[05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Techniques_for_dummy|Fine Tuning Techniques For Dummy]]
- [[05_大模型/07_Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs|Genai L18 Fine Tuning Llms]]
- [[05_大模型/07_Fine_tuning_Techniques/LLaMA_Factory_Deep_Dive|LLaMA-Factory Deep Dive]]
- [[05_大模型/07_Fine_tuning_Techniques/LoRA_QLoRA_SFT_RLHF_DPO_in_Detail|Lora Qlora SFT RLHF DPO In Detail]]
- [[05_大模型/07_Fine_tuning_Techniques/Model_Merging_2026|Model Merging 2026]]
- [[05_大模型/07_Fine_tuning_Techniques/PEFT_2026|PEFT 2026]]
- [[05_大模型/07_Fine_tuning_Techniques/PEFT_Advanced_2026|PEFT Advanced 2026]]
- [[05_大模型/07_Fine_tuning_Techniques/README|README]]
- [[05_大模型/07_Fine_tuning_Techniques/Tool_Use_and_Agent_Fine_Tuning|Tool Use And Agent Fine Tuning]]
- [[05_大模型/07_Fine_tuning_Techniques/Unsloth_Deep_Dive|Unsloth Deep Dive]]

## 核心概念速查

| 概念 | 说明 | 代表方法 |
|------|------|------|
| PEFT | 参数高效微调 | LoRA, QLoRA |
| SFT | 监督微调 | 指令微调 |
| RLHF | 人类反馈强化学习 | PPO |
| DPO | 直接偏好优化 | 无需奖励模型 |
| 模型合并 | 多模型融合 | TIES, DARE |

## 微调方法对比

| 方法 | 显存需求 | 训练速度 | 质量 | 适用场景 |
|------|------|------|------|------|
| 全参数 | 极高 | 慢 | 最佳 | 基础能力改变 |
| LoRA | 中 | 中 | 高 | 通用微调 |
| QLoRA | 低 | 中 | 高 | 资源受限 |
| DoRA | 中 | 中 | 高 | 质量优先 |

## 学习路径建议

| 阶段 | 推荐文档 | 目标 |
|------|------|------|
| 入门 | Fine_tuning_Techniques_for_dummy | 理解微调概念 |
| 进阶 | LoRA_QLoRA_SFT_RLHF_DPO_in_Detail | 掌握 PEFT |
| 实践 | PEFT_2026 | 实战微调 |
| 工具 | Unsloth_Deep_Dive | 高效训练 |

## 常见问题

| 问题 | 解答 |
|------|------|
| LoRA rank 选多少？ | 8-64，越大表达能力越强 |
| QLoRA 影响质量吗？ | 影响极小 |
| 需要多少数据？ | 数千到数万条 |
| 训练多久？ | 数小时到数天 |

## 相关概念

- [[05_大模型/index|大模型首页]]
- [[概念/lora-qlora-sft-rlhf-dpo|微调概念卡片]]
- [[07_模型训练/04_Distributed_Training/index|分布式训练]]

## 统计

| 指标 | 数值 |
|------|------|
| 文件数 | 12 |
| 最后更新 | 2026-07-21 |

> 💡 微调让大模型“专业化”——从通用能力到特定任务的转变。

## 附录：工具对比

| 工具 | 特点 | 适用场景 |
|------|------|------|
| Axolotl | 配置简单 | 快速实验 |
| Unsloth | 2x 加速 | 高效训练 |
| ms-swift | 全链路 | 生产微调 |
| PEFT | HuggingFace | 灵活定制 |

## 附录：数据格式

| 格式 | 说明 | 适用 |
|------|------|------|
| Alpaca | instruction/input/output | 指令微调 |
| ShareGPT | 多轮对话 | 对话模型 |
| DPO | chosen/rejected | 偏好对齐 |

## 附录：评估指标

| 指标 | 说明 | 测量方法 |
|------|------|------|
| Loss | 训练损失 | 监控曲线 |
| Perplexity | 困惑度 | 语言模型质量 |
| 任务准确率 | 下游任务 | 基准测试 |
| 人类评估 | 主观质量 | A/B 测试 |

## 附录：常见问题解答

| 问题 | 解答 |
|------|------|
| 过拟合怎么办？ | 早停、dropout、数据增强 |
| 显存不足？ | QLoRA、梯度累积 |
| 质量不佳？ | 调整 rank、alpha、数据质量 |
| 灾难性遗忘？ | 控制学习率、混合数据 |

## 附录：2026 趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| DPO 普及 | 无需奖励模型 | 简化对齐 |
| 模型合并 | 多模型融合 | 能力组合 |
| Agent 微调 | 工具调用能力 | 自主执行 |
| 自动化 | AutoML 微调 | 降低门槛 |

## 附录：微调流程

```
准备数据 →
├── 数据收集 → 指令/对话数据
├── 数据清洗 → 质量筛选
├── 格式化 → Alpaca/ShareGPT
└── 分割 → 训练/验证/测试
→ 训练模型 →
├── 选择基座 → Llama/Qwen/Mistral
├── 配置参数 → rank/alpha/lr
├── 训练监控 → loss/eval
└── 早停 → 防止过拟合
→ 评估部署 →
├── 基准测试 → MMLU/C-Eval
├── 人类评估 → A/B 测试
└── 部署 → vLLM/TGI
```

## 附录：超参数推荐

| 参数 | 推荐值 | 说明 |
|------|------|------|
| rank (r) | 8-64 | 越大表达能力越强 |
| alpha | 2×rank | 缩放因子 |
| dropout | 0.05-0.1 | 防止过拟合 |
| lr | 1e-4 - 2e-4 | 学习率 |
| batch_size | 4-16 | 根据显存调整 |
| epochs | 3-5 | 早停防过拟合 |

## 附录：显存估算

| 模型 | 全参数 | LoRA | QLoRA |
|------|------|------|------|
| 7B | 120GB | 16GB | 6GB |
| 13B | 200GB | 24GB | 10GB |
| 70B | 1TB+ | 80GB | 24GB |

## 附录：数据质量检查

1. ✅ 指令清晰明确
2. ✅ 输出质量高
3. ✅ 格式一致
4. ✅ 无重复数据
5. ✅ 覆盖多样场景
6. ✅ 无有害内容
7. ✅ 长度适中
8. ✅ 语言正确

## 附录：相关论文

| 论文 | 年份 | 贡献 |
|------|------|------|
| LoRA | 2021 | 低秩适应 |
| QLoRA | 2023 | 量化 LoRA |
| DPO | 2023 | 直接偏好优化 |
| DoRA | 2024 | 权重分解 |
| TIES | 2023 | 模型合并 |

## 附录：学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| HuggingFace PEFT | 文档 | 官方教程 |
| Axolotl | 开源 | 微调工具 |
| Unsloth | 开源 | 加速训练 |
| 微调实战博客 | 博客 | 经验分享 |

> 💡 微调的核心：高质量数据 + 合适参数 + 充分评估 = 专业化模型。
