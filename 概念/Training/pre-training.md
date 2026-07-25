---
title: 大模型预训练（Pre-training）
category: concepts
tags:
  - llm
  - training
  - pre-training
  - next-token-prediction
  - self-supervised
  - foundation-model
aliases:
  - Pre-training
  - 预训练
  - 自监督预训练
  - Foundation Model Training
relationships:
  - target: "概念/sft"
    type: precedes
  - target: "概念/rlhf"
    type: precedes
  - target: "概念/distributed-training"
    type: depends_on
  - target: "概念/mixed-precision"
    type: uses
  - target: "概念/transformer-architecture"
    type: built_on
summary: 大模型预训练是在大规模无标注文本上进行自监督学习的过程，目标是让模型掌握语言结构、世界知识和推理能力，是后续 SFT、RLHF 等对齐阶段的基础。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-07-25
sources: []
---

# 大模型预训练（Pre-training）

## 一句话总结

预训练是在海量无标注文本上通过“预测下一个 token”任务学习通用语言表示和世界知识的过程，是整个 LLM 训练流程的**第一阶段和基础**。

---

## 核心任务

预训练的标准任务是**自回归语言建模（Autoregressive Language Modeling）**：

```
L = - sum_t log P(t_t | t_1, t_2, ..., t_{t-1}; θ)
```

给定前面的 token，预测下一个 token。模型通过最大化训练数据的似然来学习参数 `θ`。

---

## 三要素

### 1. 数据

| 方面 | 说明 |
|---|---|
| **规模** | 通常数千亿到数万亿 token |
| **来源** | 网页、书籍、代码、论文、对话、科学文献等 |
| **质量** | 去重、过滤低质/有害内容、版权合规 |
| **配比** | 代码、百科、网页、书籍的比例显著影响模型能力 |

#### 数据配比的影响

- **代码数据比例高**：提升推理、数学、结构化思维能力。
- **书籍/论文比例高**：提升知识深度和语言表达。
- **网页数据比例高**：增加多样性但噪声也多。

### 2. 算力

| 指标 | 说明 |
|---|---|
| **GPU/TPU 数量** | 数千张高端 GPU/TPU |
| **训练时间** | 数周到数月 |
| **成本** | 数百万到数千万美元 |
| **能耗** | 非常高 |

### 3. 算法

| 组件 | 常见选择 |
|---|---|
| **架构** | Decoder-only Transformer（GPT 风格）|
| **优化器** | AdamW |
| **学习率调度** | Warmup + Cosine Decay |
| ** batch size** | 大 batch（百万级 token）|
| **精度** | FP16/BF16 混合精度 |
| **分布式** | 数据并行 + 张量并行 + 流水线并行 |

---

## 预训练的目标

预训练让模型获得以下能力：

| 能力 | 来源 |
|---|---|
| **语法与语义** | 大量文本中的统计规律 |
| **世界知识** | 百科、书籍、网页中的事实 |
| **推理能力** | 代码、数学、科学文献 |
| **上下文学习** | 长序列中的模式匹配 |
| **多语言/多领域** | 多语言、多领域数据分布 |

---

## 预训练 vs 微调

| 维度 | 预训练 | 微调（SFT）|
|---|---|---|
| **数据** | 无标注、大规模 | 有标注、相对小规模 |
| **任务** | 下一个 token 预测 | 指令跟随、特定任务 |
| **计算成本** | 极高 | 较低 |
| **目标** | 学习通用能力 | 学习特定格式和行为 |
| **参数更新** | 全部参数 | 全部或部分（如 LoRA）|

---

## 训练稳定性挑战

| 问题 | 解决方案 |
|---|---|
| **Loss 尖峰** | 学习率回滚、梯度裁剪、检查点恢复 |
| **梯度爆炸** | 梯度裁剪（gradient clipping）|
| **显存不足** | 混合精度、Gradient Checkpointing、ZeRO |
| **训练崩溃** | 小学习率、稳定初始化、数据清洗 |
| **数据重复** | 严格去重、控制数据 epoch 数 |

---

## 评估指标

| 指标 | 说明 |
|---|---|
| **Perplexity（PPL）** | 困惑度，越低越好 |
| **Loss 曲线** | 训练/验证损失是否平稳下降 |
| **下游任务** | 在标准基准上零样本/少样本测试 |
| **语料内评估** | 语言建模能力、代码能力等 |

---

## 持续预训练（Continued Pre-training）

在通用预训练基础上，继续在某些领域数据上训练：

- **用途**：医疗、法律、金融等垂直领域。
- **注意**：学习率通常比预训练低 10~100 倍，避免灾难性遗忘。
- **数据**：领域书籍、论文、对话、代码等。

---

## 延伸阅读

- [[概念/llm-training-checklist|训练检查清单]]
- [[概念/next-token-prediction|下一个 Token 预测]]
- [[概念/causal-mask|因果掩码]]
- [[概念/perplexity|困惑度 PPL]]
- [[概念/sft|监督微调 SFT]]
- [[概念/rlhf|RLHF]]
- [[概念/dpo|DPO]]
- [[概念/distributed-training|分布式训练]]
- [[概念/mixed-precision|混合精度训练]]
- [[概念/transformer-architecture|Transformer 架构]]
- [[概念/model-training|模型训练]]

---

## 2026 预训练技术栈

| 层次 | 技术 | 说明 |
|------|------|------|
| **数据** | 高质量语料 + 去重 + 过滤 | 数据质量决定上限 |
| **并行** | FSDP + TP + PP | 主流分布式方案 |
| **精度** | BF16 / FP8 | 默认训练精度 |
| **优化** | FlashAttention + 梯度检查点 | 显存与速度优化 |
| **评估** | PPL + 下游任务 | 多维度评估 |

## 生产最佳实践

1. **数据质量**：高质量数据 > 数据数量，严格清洗去重
2. **学习率调度**：使用 cosine 调度 + warmup
3. **监控指标**：关注 loss 曲线、PPL、MFU、显存峰值
4. **Checkpoint**：高频保存，支持断点续训
5. **评估体系**：定期在下游任务上评估，避免过拟合

## 2026 预训练生态现状

| 框架/工具 | 规模 | 特色 | 状态 |
|------|------|------|------|
| Megatron-LM | 万亿参数 | 3D 并行、NVIDIA | ✅ 成熟 |
| DeepSpeed | 千亿参数 | ZeRO、微软 | ✅ 成熟 |
| Colossal-AI | 千亿参数 | 易用、开源 | ✅ 主流 |
| NeMo | 万亿参数 | NVIDIA 全栈 | ✅ 主流 |
| LLaMA-Factory | 百亿参数 | 易用、开源 | ✅ 主流 |

## 延伸阅读

- [[概念/Training/megatron-lm|Megatron-LM]] — 分布式训练框架
- [[概念/Training/deepspeed|DeepSpeed]] — 微软训练框架
- [[概念/Training/mixed-precision|Mixed Precision]] — 混合精度
- [[概念/Training/gradient-checkpointing|Gradient Checkpointing]] — 梯度检查点
- [[概念/Training/fsdp|FSDP]] — 全分片数据并行

> ℹ️ 预训练是 LLM 能力的基石，2026年趋势：数据质量 > 数据数量，MoE 架构成主流，FP8 训练加速普及。

## 源码级洞察（预训练技术栈实现证据）

- **FP8 训练已有一等公民实现**：Megatron core_v0.18.2 内置 `megatron/core/fp8_utils.py` 甚至 `fp4_utils.py`，配合 Transformer Engine 在 Hopper/Blackwell 上生效。
- **数据管道工程化**：NeMo v2.7.3 的 `PreTrainingDataModule`（`collections/llm/gpt/data/pre_training.py`）封装 Megatron bin-idx mmap 数据集，按并行拓扑切分样本；预训练超参直接取自官方 Recipe（`collections/llm/recipes/`，100+ 模型规格）。
- **显存预算的三条技术路线**在源码层面清晰可对照：Megatron 靠并行切分（TP/PP/CP）、DeepSpeed 靠 ZeRO 分片+Offload、ColossalAI 靠 Chunk 异构内存，详见 [[07_模型训练/04_Distributed_Training/NeMo_Deep_Dive|NeMo 深度解析]] 与各框架 Deep Dive 源码章节。
