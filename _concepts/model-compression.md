---
title: 模型压缩
category: concepts
tags:
- - - ai-hardware
- pruning
- distillation
- compression
- int4
- int8
- gptq
- awq
- knowledge-distillation
relationships:
- target: 'concepts/model-deployment'
  type: enables
- target: 'concepts/model-serving'
  type: benefits_from
- target: 'concepts/fine-tuning-techniques'
  type: related_to
- target: 'concepts/model-precision'
  type: related_to
- target: 'concepts/gguf'
  type: exemplified_by
- target: 'concepts/smoothquant'
  type: exemplified_by
sources:
- 09_model-deployment_Inference/Deployment_Inference.md
- 09_Deployment_Inference/Deployment_Inference_2026.md
- 09_Deployment_Inference/vLLM_Deep_Dive.md
- 09_Deployment_Inference/llama_cpp_Deep_Dive.md
- 07_Model_Training/Fine_fine-tuning-techniques_Strategies.md
summary: 模型压缩通过量化（INT4/INT8/FP8）、剪枝和知识蒸馏将大模型缩减为更小更快但不显著损失精度的版本。2026年主流量化方案为GPTQ和AWQ，支持4-bit推理保持95%+原始精度；知识蒸馏用大模型指导小模型训练；结构化剪枝移除整个注意力头或FFN层。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.75
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: core
created: 2026-05-31 00:00:00+00:00
updated: 2026-05-31 00:00:00+00:00
---

# 模型压缩

## 核心要点

- **量化（Quantization）**将模型权重从FP16/BF16压缩到INT8/INT4/FP8，INT4量化后70B模型从140GB降至~35GB，精度损失通常<2%
- **GPTQ**基于近似二阶信息的后训练量化，**AWQ**通过激活感知保护重要权重通道，两者是2026年INT4量化的主流方案
- **知识蒸馏（Knowledge Distillation）**用大模型（教师）的软标签训练小模型（学生），传递暗知识
- **剪枝（Pruning）**移除不重要的权重或结构，非结构化剪枝产生稀疏矩阵需专用硬件支持，结构化剪枝移除整个层/头更实用

## 详细内容

### 量化技术

量化的核心是将连续的浮点权重映射到有限的离散值集合。对于均匀量化：

$$x_q = \text{round}\left(\frac{x}{\Delta}\right) + z, \quad \Delta = \frac{x_{\max} - x_{\min}}{2^b - 1}$$

其中$\Delta$为缩放因子，$z$为零点，$b$为位宽。

**量化分类**：

| 类型 | 说明 | 精度损失 | 硬件要求 |
|------|------|---------|---------|
| **PTQ**（后训练量化） | 无需重新训练 | 1-3% | 通用 |
| **QAT**（量化感知训练） | 训练时模拟量化 | <1% | 训练环境 |
| **Weight-Only** | 仅量化权重，激活保持高精度 | 低 | 通用 |
| **Weight+Activation** | 权重和激活同时量化 | 中高 | 专用硬件 |

**GPTQ**利用Hessian矩阵的近似逆对权重逐列量化，校准数据集仅需128-512个样本。速度快（70B模型约4小时），适合大批量部署。量化后精度：INT4约97-99%保留。

**AWQ（Activation-Aware Weight Quantization）**观察到仅约1%的权重通道对量化误差影响巨大（激活值大的通道），对这些"salient channels"保持FP16精度。在等价位宽下通常比GPTQ精度更高。

**GGUF格式**（llama.cpp使用）支持从Q2_K到Q8_0的多种量化等级，Q4_K_M是推荐起点。GGUF将权重按重要性分块量化，重要层用更高精度。

**FP8量化**（Hopper架构）使用E4M3（前向）和E5M2（反向）格式，通过Transformer Engine实现延迟缩放，训练和推理均可用。

### 知识蒸馏

将教师模型的知识传递给学生模型：

**软标签蒸馏**：学生同时学习硬标签（ground truth）和教师的软标签（softmax输出）。温度参数$T$控制软标签的平滑度：

$$\mathcal{L} = \alpha \cdot \mathcal{L}_{\text{hard}} + (1-\alpha) \cdot \mathcal{L}_{\text{KL}}(p_T \| p_S)$$

**特征蒸馏**：学生模仿教师中间层的特征表示，适合同架构模型。

**LLM蒸馏实践**：用GPT-4级别模型生成高质量数据，训练小模型模仿其输出。MiniLLM提出KL散度的反向变体（sequence-level KL），在白盒蒸馏中效果更好。

### 剪枝

| 方法 | 粒度 | 压缩率 | 硬件加速 | 实用性 |
|------|------|--------|---------|--------|
| 非结构化剪枝 | 单个权重 | 高（90%+） | 需稀疏硬件 | 低 |
| 结构化剪枝 | 注意力头/FFN/层 | 中（30-50%） | 直接加速 | 高 |
| 矩阵剪枝 | 行/列 | 中 | 直接加速 | 中 |

**LLM Pruning**：SparseGPT将剪枝与量化联合优化，一步完成70B模型50%稀疏+4-bit量化。Wanda按权重×激活幅值选择剪枝目标，无需重训练。

### 压缩效果对比

| 方法 | 70B模型大小 | 精度保持 | 推理加速 | 难度 |
|------|-----------|---------|---------|------|
| 原始FP16 | 140 GB | 100% | 基准 | — |
| INT8量化 | 70 GB | ~99% | 1.5-2× | 低 |
| INT4 GPTQ | 35 GB | ~97% | 2-3× | 低 |
| INT4 AWQ | 35 GB | ~98% | 2-3× | 低 |
| 50%稀疏+INT4 | ~20 GB | ~95% | 2-4× | 高 |
| 蒸馏到7B | 14 GB | ~90% | 10× | 高 |

## 开放问题

- 1-2 bit量化（二值化/三值化网络）的实用化仍在研究中
- 量化和剪枝的联合优化缺乏统一理论框架
- MoE模型的压缩需要考虑专家冗余性，尚无成熟方案

## 来源

- Frantar et al., "GPTQ: Accurate Post-Training Quantization for generative-vision-models Pre-trained Transformers," ICLR 2023
- Lin et al., "AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration," 2024
- Hinton et al., "Distilling the Knowledge in a Neural Network," 2015
- Sun et al., "A Simple and Effective Pruning Approach for Large Language world-models-jepa," ICLR 2024

## Related

- [[concepts/quantization]] — 量化
- [[concepts/gguf]] — GGUF
- [[concepts/smoothquant]] — SmoothQuant
- [[concepts/knowledge-distillation]] — 知识蒸馏
- [[09_Deployment_Inference/Quantization_Techniques_2026]] — 量化技术 2026
