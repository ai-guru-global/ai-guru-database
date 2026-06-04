---
title: '模型训练 (Model Training)'
category: '07-model-training'
tags: ["model-training", "distributed-training", "optimization", "fsdp"]
summary: '> **一句话理解**: 模型训练是 AI 系统的"锻造车间"——将海量数据通过分布式计算、优化算法和工程技巧，转化为具有智能的模型参数。'
created: '2026-05-31'
updated: '2026-05-31'
---

# 模型训练 (Model Training)

> **一句话理解**: 模型训练是 AI 系统的"锻造车间"——将海量数据通过分布式计算、优化算法和工程技巧，转化为具有智能的模型参数。

---

## 本章内容

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [Model-Training-in-nutshell](./Model-Training-in-nutshell.md) | 30 分钟速览：训练循环、超参数、监控工具 | 快速入门 |
| [**ms-swift Deep Dive**](./ms_swift_Deep_Dive.md) | 魔搭大模型训练推理全链路框架：600+模型SFT/GRPO/RLHF/Megatron/推理部署/评测 | 框架实战 |
| [**ms-swift 命令行参数参考**](./ms_swift_Command_Line_Parameters.md) | 200+命令行参数全量速查：基本/训练/RLHF/GRPO/推理/部署/导出/采样参数 | 参数手册 |

> ⚠️ **注意**: 本章内容正在全面扩充中。当前仅包含速览指南，深度专题（分布式训练、混合精度、训练优化）即将上线。

---

## 学习路径

- **快速入门** → [Model-Training-in-nutshell](./Model-Training-in-nutshell.md)（30 分钟）
- **系统学习** → 待补充：分布式训练、混合精度、Fine-tuning 策略
- **简化版** → 待补充：Model_Training_for_dummy.md

---

## 与其他章节的关联

### 前置知识
- [深度学习基础](../03_Deep_Learning/README.md) — 神经网络原理、反向传播
- [机器学习](../02_Machine_Learning/README.md) — 监督/无监督学习基础
- [概率统计](../01_Fundamentals/Probability_Statistics/Probability_Statistics.md) — 损失函数、优化器的数学基础

### 进阶方向
- [模型评估](../08_Model_Evaluation/) — 训练后如何评估模型质量
- [部署推理](../09_Deployment_Inference/README.md) — 训练好的模型如何上线
- [MLOps 流水线](../10_MLOps_Pipeline/) — 自动化训练与持续交付
- [RAG 系统](../11_RAG_Systems/) — 检索增强生成的训练策略

---

## 规划中的内容

- [ ] 分布式训练 2026（DDP / FSDP / DeepSpeed / Megatron-LM）
- [ ] 混合精度训练（FP16 / BF16 / 梯度缩放）
- [ ] 训练加速技术（FlashAttention / Gradient Checkpointing）
- [ ] Fine-tuning 策略（全参数 / LoRA / QLoRA / DoRA）
- [ ] 训练监控与实验跟踪（TensorBoard / W&B / MLflow）

---

*本章内容持续建设中，预计 2026-Q2 完成全面扩充。*

## Related
- [[07_Model_Training/GRPO_and_New_Alignment_Methods|GRPO 与新一代对齐方法 (GRPO and New Alignment Methods)]]
- [[07_Model_Training/Tokenizer_Design_2026|Tokenizer Design for LLMs]]
- [[07_Model_Training/Data_Curation_and_Mixture_2026|Data Curation and Mixture for LLM Pretraining 2026]]
- [[07_Model_Training/Pruning_and_Knowledge_Distillation|Pruning 与知识蒸馏：LLM 压缩实战 (Pruning and Knowledge Distillation for LLMs)]]
- [[07_Model_Training/Scaling_Laws_and_Training_Dynamics|Scaling Laws and Training Dynamics (LLM 缩放法则与训练动态)]]
- [[07_Model_Training/Optimizer_Advanced_2026|Advanced Optimizers for LLM Training 2026]]
- [[07_Model_Training/README|模型训练 (Model Training)]]
- [[07_Model_Training/Training_Monitoring_2026|Training Monitoring & Experiment Tracking 2026]]
- [[07_Model_Training/Fine_tuning_Strategies|微调策略完全指南 (Fine-tuning Strategies)]]
- [[07_Model_Training/README_for_dummy|07 模型训练 — 小白版 🏋️]]
- [[07_Model_Training/ms_swift_Deep_Dive|ms-swift 深度解析：魔搭大模型训练推理全链路框架]]
- [[07_Model_Training/ms_swift_Command_Line_Parameters|ms-swift 命令行参数完全参考手册]]

- [[concepts/model-training]] — 模型训练
- [[concepts/distributed-systems]] — 分布式系统
- [[concepts/optimization-regularization]] — 优化与正则化


