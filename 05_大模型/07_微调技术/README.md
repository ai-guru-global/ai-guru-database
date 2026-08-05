---
title: 微调技术 (Fine-tuning Techniques)
category: 05-nlp-llms-fine-tuning-techniques
tags: ["nlp", "llm", "transformer", "gpt", "bert"]
summary: "| 文档 | 内容 | 适用读者 |"
created: 2026-05-31
updated: 2026-06-16
tier: supporting
sources: []

name_zh: "微调技术"
---
# 微调技术 (Fine-tuning Techniques)

> 中文简称：微调技术

## 文档导航

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [07_LoRA_QLoRA_SFT_RLHF_DPO_in_Detail.md](./07_LoRA_QLoRA_SFT_RLHF_DPO_in_Detail.md) | LoRA/QLoRA/SFT/RLHF/DPO 大白话详解与实战 | 系统理解 |
| [03_微调技术.md](./03_微调技术.md) | 微调技术详解（入门） | 初学者→进阶 |
| [PEFT_2026](./09_PEFT_2026.md) | PEFT 2026 最佳实践 | 实战学习 |
| [Unsloth Deep Dive](./12_Unsloth_深入分析.md) | 高速微调框架：2x 加速、24GB 单卡 | 快速实验 |
| [Axolotl Deep Dive](./01_Axolotl_深入分析.md) | 开源微调工具：全参数/LoRA/QLoRA 支持 | 生产微调 |
| [**ms-swift Deep Dive**](07_模型训练/04_分布式训练/11_ms_swift_深入分析.md) | 魔搭全链路框架：SFT/GRPO/RLHF/Megatron/部署/评测 | 全链路实战 |
| [**ms-swift 命令行参数**](07_模型训练/04_分布式训练/10_ms_swift_命令_Line_Parameters.md) | 200+参数全量速查手册 | 参数手册 |

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

- [[05_大模型/07_微调技术/07_LoRA_QLoRA_SFT_RLHF_DPO_in_Detail]] — LoRA / QLoRA / SFT / RLHF / DPO 大白话详解与实战
- [[概念/lora-qlora-sft-rlhf-dpo]] — 概念卡片：LoRA / QLoRA / SFT / RLHF / DPO 大白话串讲
- [[05_大模型/07_微调技术/09_PEFT_2026]] — PEFT 2026 (参数高效微调) (共享: bert, gpt, llm, nlp, transformer)
- [[05_大模型/01_LLM基础/05_LLM_基础]] — 大语言模型基础速成指南 (共享: bert, gpt, llm, nlp, transformer)
- [[05_大模型/10_多模态模型/06_多模态_架构_2026]] — 多模态模型架构 2026：从 GPT-4V 到原生多模态 AGI (共享: bert, gpt, llm, nlp, transformer)
- [[05_大模型/08_提示工程/16_Prompt工程]] — Prompt Engineering 速成指南 (共享: bert, gpt, llm, nlp, transformer)
- [[05_大模型/07_微调技术/09_PEFT_2026]] — PEFT_2026
- [[07_模型训练/04_分布式训练/11_ms_swift_深入分析|ms-swift 深度解析：魔搭大模型训练推理全链路框架]]
- [[07_模型训练/04_分布式训练/ms_swift_Command_Line_Parameters|ms-swift 命令行参数完全参考手册]]
- [[05_大模型/README|README_for_dummy]]
- [[05_大模型/02_序列模型/02_序列模型.md|Sequence_Models]]

## 微调方法对比

| 方法 | 说明 | 适用 |
|------|------|------|
| SFT | 监督微调 | 指令跟随 |
| RLHF | 人类反馈强化 | 对齐 |
| DPO | 直接偏好优化 | 对齐 |
| LoRA | 低秩适配 | 高效微调 |
| QLoRA | 量化 LoRA | 资源受限 |

## 工具对比

| 工具 | 特点 | 适用 |
|------|------|------|
| Unsloth | 2x 加速 | 快速实验 |
| Axolotl | 全功能 | 生产 |
| ms-swift | 全链路 | 企业 |
| PEFT | HuggingFace | 通用 |

## 学习路径

| 阶段 | 内容 | 目标 |
|------|------|------|
| 入门 | 微调概念 | 理解原理 |
| 基础 | LoRA/QLoRA | 高效微调 |
| 进阶 | RLHF/DPO | 对齐技术 |
| 实践 | Unsloth/Axolotl | 工具使用 |

## 常见问题

| 问题 | 解答 |
|------|------|
| 微调 vs RAG？ | 风格用微调，知识用 RAG |
| 需要多少数据？ | 1000-10000 条 |
| 显存需求？ | QLoRA 6GB 起 |
| 过拟合？ | 早停+正则化 |

## 统计

| 指标 | 数值 |
|------|------|
| 文件数 | 26 |
| 最后更新 | 2026-07-21 |

> 💡 微调是让大模型“专业化”的关键技术，从通用到特定任务的转变。

## 附录：数据格式

| 格式 | 说明 | 示例 |
|------|------|------|
| Alpaca | 指令格式 | instruction/input/output |
| ShareGPT | 对话格式 | conversations |
| DPO | 偏好对 | chosen/rejected |

## 附录：超参数推荐

| 参数 | 推荐值 | 说明 |
|------|------|------|
| 学习率 | 1e-4 到 2e-5 | LoRA |
| Batch Size | 4-16 | 根据显存 |
| Epochs | 3-5 | 防过拟合 |
| Rank | 8-64 | LoRA 秩 |

## 附录：2026 趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| 高效微调 | LoRA/QLoRA | 降低门槛 |
| 自动优化 | 超参搜索 | 简化流程 |
| 多任务 | 一次微调 | 效率提升 |
| 端侧微调 | 手机本地 | 隐私保护 |

## 附录：显存估算

| 模型 | 全参数 | LoRA | QLoRA |
|------|------|------|------|
| 7B | 60GB | 16GB | 6GB |
| 13B | 100GB | 24GB | 10GB |
| 70B | 500GB | 80GB | 24GB |

## 附录：评估方法

| 方法 | 说明 | 工具 |
|------|------|------|
| 损失曲线 | 训练监控 | TensorBoard |
| 验证集 | 泛化能力 | 自定义 |
| 基准测试 | 标准评估 | lm-eval |
| 人工评估 | 质量检查 | 标注 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 微调 | Fine-tuning | 领域适配 |
| 对齐 | Alignment | 人类偏好 |
| 低秩 | Low-Rank | 矩阵分解 |
| 量化 | Quantization | 降低精度 |
| 适配器 | Adapter | 可训练模块 |

## Related

- [[05_大模型/06_LLM数据工程/index|LLM Data Engineering]]
- [[07_模型训练/index|模型训练]]
- [[05_大模型/index|大模型首页]]

## 附录：微调检查清单

| 步骤 | 说明 |
|------|------|
| 数据准备 | 清洗+格式化 |
| 参数设置 | 学习率/批次 |
| 训练监控 | 损失曲线 |
| 评估验证 | 基准测试 |
| 部署上线 | 量化+推理 |

> 💡 微调是 LLM 应用开发的核心技能，掌握它可以让你事半功倍。

## 附录：资源链接

| 资源 | 说明 |
|------|------|
| HuggingFace PEFT | 官方文档 |
| Unsloth | 快速微调 |

---
*Last updated: 2026-07-21*
