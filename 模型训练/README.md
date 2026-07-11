---
title: '模型训练 (Model Training)'
category: '07-model-training'
tags: ["model-training", "distributed-training", "optimization", "fsdp"]
summary: '> **一句话理解**: 模型训练是 AI 系统的"锻造车间"——将海量数据通过分布式计算、优化算法和工程技巧，转化为具有智能的模型参数。'
created: '2026-05-31'
updated: '2026-06-16'
tier: supporting
sources: []

---
# 模型训练 (Model Training)

> **一句话理解**: 模型训练是 AI 系统的"锻造车间"——将海量数据通过分布式计算、优化算法和工程技巧，转化为具有智能的模型参数。

---

## 本章内容

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [Model-Training-in-nutshell](模型训练/Model-Training-in-nutshell.md) | 30 分钟速览：训练循环、超参数、监控工具 | 快速入门 |
| [**模型问题排查手册**](模型训练/Monitoring/Model_Troubleshooting_Guide.md) | 预训练/微调/推理全链路故障诊断，14 个常见问题 + 解决方案 | 实战排查 |
| [**LLM 微调任务 K8s 失败排障**](模型训练/Monitoring/LLM_Fine_Tuning_Job_Failure_Runbook_on_K8s.md) | 把训练失败模式与 K8s Pod 事件/日志结合，面向阿里云专有云 | K8s 训练运维 |
| [**训练任务诊断工作流**](模型训练/Monitoring/Training_Job_Diagnosis_Workflow.md) | 从告警到根因的可落地排查总线与命令 | 训练 SRE |
| [**分布式训练 Hang 排障**](模型训练/Distributed_Training/Distributed_Training_Hang_Runbook.md) | NCCL/RDMA/InfiniBand/NVLink 诊断流程 | 分布式训练 SRE |
| [**Scaler Laws 与训练动力学**](模型训练/Optimization/Scaling_Laws_and_Training_Dynamics.md) | Kaplan/Chinchilla/涌现能力/推理时 Scaling | 理论研究 |
| [**Tokenizer 设计 2026**](模型训练/Data/Tokenizer_Design_2026.md) | BPE/SentencePiece/tiktoken/Unigram 全解析 | 预训练基础 |
| [**优化器进阶 2026**](模型训练/Optimization/Optimizer_Advanced_2026.md) | AdamW/Lion/Muon/Sophia/Shampoo + 学习率调度 | 训练优化 |
| [**数据策展与配比 2026**](模型训练/Data/Data_Curation_and_Mixture_2026.md) | 数据清洗/去重/配比/合成数据/多语言 | 数据工程 |
| [数据集文档模板 (Datasheet)](模型训练/Data/Datasheet_Template.md) | 记录数据集来源、构成、偏差与使用限制的标准模板 | 数据工程师 / 合规 |
| [**GRPO 与新对齐方法**](模型训练/Alignment/GRPO_and_New_Alignment_Methods.md) | PPO/DPO/KTO/GRPO/RLOO/Reasoning RL | 对齐训练 |
| [**剪枝与知识蒸馏**](模型训练/Compression/Pruning_and_Knowledge_Distillation.md) | Wanda/SparseGPT/LLM-Pruner/SFT 蒸馏 | 模型压缩 |
| [**训练成本优化与 FinOps 2026**](模型训练/Training_Cost_Optimization_and_FinOps_2026.md) | GPU 利用率、Spot 实例、Checkpoint、成本归因与预算告警 | 训练 FinOps |
| [**Ray Deep Dive**](模型训练/Distributed_Training/Ray_Deep_Dive.md) | 分布式 AI 计算框架：Train/Serve/Data/Tune | 分布式训练与推理 |
| [**DeepSpeed Deep Dive**](模型训练/Distributed_Training/DeepSpeed_Deep_Dive.md) | 微软大模型训练与推理优化：ZeRO / Offload / MoE | 大模型训练优化 |
| [**Megatron-LM Deep Dive**](模型训练/Distributed_Training/Megatron_LM_Deep_Dive.md) | NVIDIA 大规模 Transformer 训练：TP / PP / 3D 并行 | 超大规模预训练 |
| [**FSDP Deep Dive**](模型训练/Distributed_Training/FSDP_Deep_Dive.md) | PyTorch 全分片数据并行：ZeRO-3 原生实现 | PyTorch 大模型训练 |
| [**Colossal-AI Deep Dive**](模型训练/Distributed_Training/Colossal_AI_Deep_Dive.md) | 统一分布式 AI 系统：Gemini 内存管理、多维并行 | 低成本大模型训练 |
| [**ms-swift Deep Dive**](模型训练/Distributed_Training/ms_swift_Deep_Dive.md) | 魔搭大模型训练推理全链路框架 | 框架实战 |
| [**ms-swift 命令行参数参考**](模型训练/Distributed_Training/ms_swift_Command_Line_Parameters.md) | 200+ 命令行参数全量速查 | 参数手册 |
| [**数据增强完全指南**](模型训练/Data/Data_Augmentation.md) | 图像/文本/音频增强、MixUp/CutMix/Mosaic、合成数据生成 | 数据工程师 |
| [**超参数优化完全指南**](模型训练/Optimization/Hyperparameter_Tuning.md) | 网格搜索、贝叶斯优化、Optuna/W&B、LLM 训练超参数 | 训练工程师 |
| [**数据与微调大白话**](模型训练/Data_and_FineTuning_for_dummy.md) | 数据清洗 Pipeline、DoRA、RS-LoRA 大白话解释 | 初学者 |

> ⚠️ **注意**: 本章内容正在全面扩充中。当前仅包含速览指南，深度专题（分布式训练、混合精度、训练优化）即将上线。

---

## 学习路径

- **快速入门** → [Model-Training-in-nutshell](模型训练/Model-Training-in-nutshell.md)（30 分钟）
- **遇到问题?** → [模型问题排查手册](模型训练/Monitoring/Model_Troubleshooting_Guide.md)（实战故障诊断）
- **系统学习** → [Scaling Laws](模型训练/Optimization/Scaling_Laws_and_Training_Dynamics.md) → [Tokenizer](模型训练/Data/Tokenizer_Design_2026.md) → [优化器](模型训练/Optimization/Optimizer_Advanced_2026.md) → [数据策展](模型训练/Data/Data_Curation_and_Mixture_2026.md) → [GRPO 对齐](模型训练/Alignment/GRPO_and_New_Alignment_Methods.md) → [剪枝蒸馏](模型训练/Compression/Pruning_and_Knowledge_Distillation.md) → [分布式训练](模型训练/Distributed_Training/Ray_Deep_Dive.md) → [训练优化](模型训练/Distributed_Training/DeepSpeed_Deep_Dive.md) → [并行框架](模型训练/Distributed_Training/Megatron_LM_Deep_Dive.md)
- **简化版** → [Model_Training_for_dummy](模型训练/Model_Training_for_dummy.md)

## AI Stack 训练启动器

> 如果你正在使用阿里云 AI Stack 一体机，以下页面提供训练启动、GPU 监控与模型管理的生产级指南：

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI Stack 生产工具链总览](../架构基建/AI_Stack/AI_Stack_Production_Toolchain.md) | AI Stack 工具全景与生命周期 | 所有 AI Stack 用户 |
| [AI Stack 训练启动器](../架构基建/AI_Stack/AI_Stack_Training_Launchers_Guide.md) | torchrun / accelerate / deepspeed / swift | 训练工程师 |
| [AI Stack GPU 监控](../架构基建/AI_Stack/AI_Stack_GPU_Monitoring_Guide.md) | nvidia-smi / ppu-smi 训练监控 | 运维、训练工程师 |
| [AI Stack 模型管理](../架构基建/AI_Stack/AI_Stack_Model_Management_Guide.md) | 模型下载与版本组织 | 模型工程师 |

---

## 与其他章节的关联

### 前置知识
- [深度学习基础](../深度学习/README.md) — 神经网络原理、反向传播
- [机器学习](../机器学习/README.md) — 监督/无监督学习基础
- [概率统计](数学基础/Probability_Statistics/Probability_Statistics.md) — 损失函数、优化器的数学基础

### 进阶方向
- [模型评估](../模型评估/) — 训练后如何评估模型质量
- [部署推理](../部署推理/README.md) — 训练好的模型如何上线
- [MLOps 流水线](../模型运维/) — 自动化训练与持续交付
- [RAG 系统](../RAG系统/) — 检索增强生成的训练策略

---

## 规划中的内容

- [x] ✅ [Scaling Laws 与训练动力学](模型训练/Optimization/Scaling_Laws_and_Training_Dynamics.md) — Kaplan/Chinchilla/涌现能力
- [x] ✅ [Tokenizer 设计 2026](模型训练/Data/Tokenizer_Design_2026.md) — BPE/SentencePiece/tiktoken
- [x] ✅ [优化器进阶 2026](模型训练/Optimization/Optimizer_Advanced_2026.md) — AdamW/Lion/Muon/Sophia
- [x] ✅ [数据策展与配比 2026](模型训练/Data/Data_Curation_and_Mixture_2026.md) — 数据清洗/去重/配比/合成数据
- [x] ✅ [GRPO 与新对齐方法](模型训练/Alignment/GRPO_and_New_Alignment_Methods.md) — PPO/DPO/KTO/GRPO/RLOO
- [x] ✅ [剪枝与知识蒸馏](模型训练/Compression/Pruning_and_Knowledge_Distillation.md) — Wanda/SparseGPT/蒸馏
- [x] ✅ [模型问题排查手册](模型训练/Monitoring/Model_Troubleshooting_Guide.md) — 全链路故障诊断
- [ ] 分布式训练 2026（DDP / FSDP / DeepSpeed / Megatron-LM）
- [ ] 混合精度训练（FP16 / BF16 / 梯度缩放）
- [ ] 训练加速技术（FlashAttention / Gradient Checkpointing）
- [ ] Fine-tuning 策略（全参数 / LoRA / QLoRA / DoRA）
- [ ] 训练监控与实验跟踪（TensorBoard / W&B / MLflow）

---

*本章内容持续建设中，预计 2026-Q2 完成全面扩充。*

## Related
- [[模型训练/Monitoring/Model_Troubleshooting_Guide.md|模型问题排查手册 — 预训练/微调/推理全链路故障诊断]]
- [[模型训练/Alignment/GRPO_and_New_Alignment_Methods.md|GRPO 与新一代对齐方法 (GRPO and New Alignment Methods)]]
- [[模型训练/Data/Tokenizer_Design_2026.md|Tokenizer Design for LLMs]]
- [[模型训练/Data/Data_Curation_and_Mixture_2026.md|Data Curation and Mixture for LLM Pretraining 2026]]
- [[模型训练/Compression/Pruning_and_Knowledge_Distillation.md|Pruning 与知识蒸馏：LLM 压缩实战 (Pruning and Knowledge Distillation for LLMs)]]
- [[模型训练/Optimization/Scaling_Laws_and_Training_Dynamics.md|Scaling Laws and Training Dynamics (LLM 缩放法则与训练动态)]]
- [[模型训练/Optimization/Optimizer_Advanced_2026.md|Advanced Optimizers for LLM Training 2026]]
- [[模型训练/README|模型训练 (Model Training)]]
- [[模型训练/Monitoring/Training_Monitoring_2026.md|Training Monitoring & Experiment Tracking 2026]]
- [[大模型/Fine_tuning_Techniques/Fine_tuning_Strategies.md|微调策略完全指南 (Fine-tuning Strategies)]]
- [[模型训练/README_for_dummy|07 模型训练 — 小白版 🏋️]]
- [[模型训练/Distributed_Training/ms_swift_Deep_Dive.md|ms-swift 深度解析：魔搭大模型训练推理全链路框架]]
- [[模型训练/Distributed_Training/ms_swift_Command_Line_Parameters.md|ms-swift 命令行参数完全参考手册]]
- [[AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[AI_Stack_Training_Launchers_Guide|AI Stack 训练启动器指南]]
- [[AI_Stack_GPU_Monitoring_Guide|AI Stack GPU 监控指南]]
- [[AI_Stack_Model_Management_Guide|AI Stack 模型下载与管理指南]]
- [[模型训练/Data_and_FineTuning_for_dummy.md|数据与微调大白话]]
- [[概念/data-cleaning-pipeline.md|数据清洗 Pipeline]]
- [[概念/dora.md|DoRA]]
- [[概念/rs-lora.md|RS-LoRA]]

- [[概念/model-training.md]] — 模型训练
- [[概念/distributed-systems.md]] — 分布式系统
- [[概念/optimization-regularization.md]] — 优化与正则化



- [[模型训练/Distributed_Training/DeepSpeed_for_dummy|DeepSpeed 入门：用更少的 GPU 训练更大的模型]]
