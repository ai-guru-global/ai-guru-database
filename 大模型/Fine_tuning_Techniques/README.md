---
title: 微调技术 (Fine-tuning Techniques)
category: 05-nlp-llms-fine-tuning-techniques
tags: ["nlp", "llm", "transformer", "gpt", "bert"]
summary: "| 文档 | 内容 | 适用读者 |"
created: 2026-05-31
updated: 2026-06-16
tier: supporting
sources: []

---
# 微调技术 (Fine-tuning Techniques)

## 文档导航

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [LoRA_QLoRA_SFT_RLHF_DPO_in_Detail.md](./LoRA_QLoRA_SFT_RLHF_DPO_in_Detail.md) | LoRA/QLoRA/SFT/RLHF/DPO 大白话详解与实战 | 系统理解 |
| [Fine_tuning_Techniques.md](./Fine_tuning_Techniques.md) | 微调技术详解 | 进阶学习 |
| [Fine_tuning_Techniques_for_dummy.md](./Fine_tuning_Techniques_for_dummy.md) | 微调入门 | 初学者 |
| [PEFT_2026](./PEFT_2026.md) | PEFT 2026 最佳实践 | 实战学习 |
| [Unsloth Deep Dive](./Unsloth_Deep_Dive.md) | 高速微调框架：2x 加速、24GB 单卡 | 快速实验 |
| [Axolotl Deep Dive](./Axolotl_Deep_Dive.md) | 开源微调工具：全参数/LoRA/QLoRA 支持 | 生产微调 |
| [**ms-swift Deep Dive**](../../07_Model_Training/Distributed_Training/ms_swift_Deep_Dive.md) | 魔搭全链路框架：SFT/GRPO/RLHF/Megatron/部署/评测 | 全链路实战 |
| [**ms-swift 命令行参数**](../../07_Model_Training/Distributed_Training/ms_swift_Command_Line_Parameters.md) | 200+参数全量速查手册 | 参数手册 |

## 内容概览

### 全参数微调 vs PEFT

```
全参数微调:
├── 训练100%参数
├── 需要8x A100 (70B模型)
├── 成本: $50,000+/次
└── 适用: 基础能力改变

PEFT (参数高效微调):
├── 训练<1%参数
├── 单卡消费级GPU可训70B
├── 成本: $100+/次
└── 适用: 大多数微调任务
```

### PEFT 方法对比

| 方法 | 显存需求 | 适用场景 |
|------|---------|----------|
| LoRA | 16GB (7B) | 通用微调 |
| QLoRA | 6GB (7B) | 资源受限 |
| DoRA | 16GB (7B) | 质量优先 |

## 一句话总结

> **微调让大模型"专业化"** — 从通用能力到特定任务的转变。

---

*Last updated: 2026-06-16*

## Related

- [[05_NLP_LLMs/Fine_tuning_Techniques/LoRA_QLoRA_SFT_RLHF_DPO_in_Detail]] — LoRA / QLoRA / SFT / RLHF / DPO 大白话详解与实战
- [[_concepts/lora-qlora-sft-rlhf-dpo]] — 概念卡片：LoRA / QLoRA / SFT / RLHF / DPO 大白话串讲
- [[05_NLP_LLMs/Fine_tuning_Techniques/PEFT_2026]] — PEFT 2026 (参数高效微调) (共享: bert, gpt, llm, nlp, transformer)
- [[05_NLP_LLMs/LLM_Architectures/LLM-Basics-in-nutshell]] — 大语言模型基础速成指南 (共享: bert, gpt, llm, nlp, transformer)
- [[05_NLP_LLMs/Multimodal_Models/Multimodal_Architectures_2026]] — 多模态模型架构 2026：从 GPT-4V 到原生多模态 AGI (共享: bert, gpt, llm, nlp, transformer)
- [[05_NLP_LLMs/Prompt_Engineering/Prompt-Engineering-in-nutshell]] — Prompt Engineering 速成指南 (共享: bert, gpt, llm, nlp, transformer)
- [[05_NLP_LLMs/Fine_tuning_Techniques/PEFT_2026]] — PEFT_2026
- [[07_Model_Training/Distributed_Training/ms_swift_Deep_Dive|ms-swift 深度解析：魔搭大模型训练推理全链路框架]]
- [[07_Model_Training/Distributed_Training/ms_swift_Command_Line_Parameters|ms-swift 命令行参数完全参考手册]]
- [[05_NLP_LLMs/README_for_dummy.md|README_for_dummy]]
- [[05_NLP_LLMs/Sequence_Models/Sequence_Models.md|Sequence_Models]]
