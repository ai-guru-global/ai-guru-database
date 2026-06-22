---
title: 模型训练
category: -concepts
tags:
- training
- - - distributed-systems
- mixed-precision
- - - optimization-regularization
- - - fine-tuning-techniques
- lora
- deepspeed
- fsdp
relationships:
- target: '_concepts/neural-networks'
  type: built_on
- target: '_concepts/fine-tuning-techniques'
  type: related_to
- target: '_concepts/model-evaluation'
  type: followed_by
sources:
- 07_Model_Training/Distributed_Training_2026.md
- 07_Model_Training/Mixed_Precision_Training.md
- 07_Model_Training/Training_Optimization_2026.md
- 07_Model_Training/Training_Monitoring_2026.md
- 07_Model_Training/Fine_tuning_Strategies.md
summary: 模型训练涵盖从分布式并行策略（DDP/FSDP/DeepSpeed/Megatron-LM）到混合精度（BF16/FP8）、训练优化（FlashAttention/梯度检查点/内核融合）以及微调策略（LoRA/QLoRA/DoRA）的全栈技术体系。2026年BF16成为默认精度格式，FSDP+TP成为主流分布式方案，FlashAttention v3将注意力显存从O(n²)降至O(n)。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.8
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: core
created: 2026-05-31 00:00:00+00:00
updated: 2026-05-31 00:00:00+00:00
---

# 模型训练

## 核心要点

- **分布式训练**是训练百亿到万亿参数模型的基础设施，核心并行策略包括数据并行（DDP/FSDP）、张量并行（Megatron-LM TP）、流水线并行（1F1B）和序列并行
- **混合精度训练**以BF16为2026年默认格式，无需Loss Scaling、训练稳定；Hopper架构支持FP8通过Transformer Engine实现2倍吞吐
- **训练优化技术栈**：FlashAttention将注意力显存从O(n²)降至O(n)、梯度检查点用计算换空间、torch.compile实现自动内核融合
- **微调策略**从全参数发展到PEFT：LoRA仅训练0.2%参数保持97%效果，QLoRA在4-bit量化下单卡微调70B模型

## 详细内容

### 分布式训练策略

训练大规模模型需要将计算分布到多个GPU/节点。三种基本并行策略的适用场景不同：

| 并行类型 | 切分对象 | 通信模式 | 适用规模 |
|---------|---------|---------|---------|
| 数据并行 (DDP/FSDP) | 数据批次 | 梯度AllReduce | 模型可放入单卡 |
| 张量并行 (TP) | 模型层内参数 | 激活值AllReduce | 单层超单卡显存 |
| 流水线并行 (PP) | 模型层序列 | 点对点通信 | 模型极深 |

**PyTorch FSDP**通过ZeRO策略将参数、梯度、优化器状态分片到各GPU。ZeRO-3下70B模型在8×H100上每卡仅占~18GB。**DeepSpeed**提供更成熟的CPU/NVMe Offload能力，适合超大模型。**Megatron-LM**实现张量并行，将QKV投影和MLP按列/行切分到不同GPU。

2026年推荐组合：**FSDP + TP**，节点内TP利用NVLink低延迟，跨节点FSDP简单稳健。对于MoE架构需加入专家并行（EP），构成4D并行。

### 混合精度训练

核心思想是在保持精度的前提下用低精度格式存储和计算张量，降低显存、提升吞吐。

| 格式 | 位宽 | 动态范围 | Loss Scaling | 2026推荐 |
|------|------|---------|-------------|---------|
| FP32 | 32bit | ±3.4e38 | 不需要 | 仅调试 |
| BF16 | 16bit | ±3.4e38 | 不需要 | **默认** |
| FP16 | 16bit | ±65504 | 必须 | 旧GPU |
| FP8 | 8bit | ±448/±57344 | 不需要 | Hopper+ |

BF16指数位与FP32相同，天然避免梯度下溢。FP8训练通过NVIDIA transformer-architecture Engine在前向使用E4M3、反向使用E5M2，H100上实现1979 TFLOPS峰值。PyTorch `autocast`自动将线性/卷积转为低精度，Softmax/LayerNorm保持FP32。

### 训练优化技术

**FlashAttention**通过IO感知的分块计算和在线Softmax，将HBM访问从5+次降至1次，显存从O(n²)降至O(n)。v3支持FP8和Warp-specialization，在H100上比v2再快1.5-2倍。

**梯度检查点**在反向传播时重计算中间激活而非存储，激活显存从O(L)降至O(√L)，代价是额外30-40%计算。

**梯度累积**模拟大批量训练：有效batch = micro_batch × accumulation_steps，需配合学习率线性/平方根缩放。

**torch.compile**自动融合CUDA内核，`mode="default"`即可获得1.2-1.5倍加速。

**8-bit Adam**（bitsandbytes）将优化器状态从12×参数降至6×参数，与FSDP组合进一步分片。

### 训练监控

核心监控指标包括Loss曲线、梯度范数、学习率Schedule、吞吐量（tokens/s）、GPU利用率（目标>70%）。主流工具：**TensorBoard**（零配置本地可视化）、**W&B**（云端协作+Artifact管理+贝叶斯超参搜索）、**MLflow**（自托管+Model Registry）。关键实践：记录完整配置（代码版本+随机种子+环境依赖）、分布式训练中仅rank0写日志、设置Loss NaN自动告警。

## 开放问题

- FP8训练在非Transformer架构上的收敛稳定性仍在研究中
- 超万亿参数模型的5D并行策略通信开销优化是前沿课题
- 长上下文训练（1M+ tokens）的序列并行与Ring long-context-models可扩展性有待验证

## 来源

- Rajbhandari et al., "ZeRO: Memory Optimizations Toward Training Trillion Parameter Models," SC 2020
- Dao, "FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning," 2023
- Hu et al., "LoRA: Low-Rank Adaptation of Large Language Models," ICLR 2022
- Dettmers et al., "QLoRA: Efficient Finetuning of Quantized LLMs," 2023

## 大白话解读

> **一句话理解**:模型训练就像教小孩做 10 万道数学题,做完对答案、记错题、慢慢变强。

### 训练三步循环

1. **猜**:把题目丢进模型,先随便输出一个答案
2. **批**:跟标准答案比,看错得有多离谱(算"损失 / loss")
3. **改**:从错误往回推,微调几十亿个参数(权重),让下次猜得更准

整个数据集反复过几遍,**每完整过一遍叫一个 epoch**。

### 什么是"参数 / 权重"

模型里那些**数字旋钮**(可能有几百亿个)。训练就是**调旋钮**——调到某个位置,模型刚好能算出正确答案。训练完,这些数字就"定型"了,这就是你下载到的模型文件。

### 直觉类比

> 小学生做 10 万道数学题 → 对答案 → 错的下次改正 → 错的越来越少
> 模型训练:数据 → forward → loss → backward → 调权重 → 重复

## Related

- [[_synthesis/training-fine-tuning]] — 模型训练 × 微调技术 (共享: deepspeed, fsdp, lora, training)
- [[_concepts/distributed-systems]] — 分布式系统 (共享: fsdp, training)
