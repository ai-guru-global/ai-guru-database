---
title: "Model Pruning（模型剪枝）"
category: -concepts
tags: [pruning, model-compression, neural-network, knowledge-distillation, quantization]
aliases:
  - "Pruning"
  - "Model Pruning"
  - "剪枝"
  - "模型剪枝"
relationships:
  - target: "_concepts/model-compression"
    type: belongs_to
  - target: "_concepts/quantization"
    type: complementary
  - target: "_concepts/knowledge-distillation"
    type: complementary
sources:
  - 10_Deployment_Inference/Quantization/
  - 07_Model_Training/Compression/
summary: "Model Pruning（模型剪枝）通过移除神经网络中不重要的权重 / 通道 / 层来压缩模型，与量化、知识蒸馏并列为模型压缩三大技术；2026 年 LLM 剪枝重点是结构化剪枝（如 SliceGPT、SparseGPT）。"
lifecycle: stable
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.88
created: 2026-06-24
updated: 2026-06-24
---

# Model Pruning（模型剪枝）

## 核心要点

- **核心思想**：神经网络多数权重对最终输出贡献微小，**移除后可显著减少计算量而不损失精度**。
- **核心假设**（Lottery Ticket Hypothesis）：大网络中存在"中奖子网络"，可独立训练到原性能。
- **三种粒度**：
  - **Unstructured（非结构化）**：移除单个权重 → 稀疏权重
  - **Structured（结构化）**：移除整个神经元 / 通道 / 层 → 小密集模型
  - **Semi-structured**：2:4 sparsity（NVIDIA 优化）
- **LLM 时代重点**：结构化剪枝（兼容 GPU 推理）

## 一句话解释

> Pruning = "剪掉神经网络中没用的枝叶"；模型变小变快，精度尽量不变。

## 剪枝分类

### 按粒度

| 类型 | 移除对象 | 压缩率 | 推理加速 | 硬件友好 |
|------|---------|--------|---------|---------|
| **Unstructured** | 单个权重 | 高 | ❌（需稀疏库）| 差 |
| **Structured（Channel）** | 整个 channel | 中 | ✅ | **好** |
| **Structured（Layer）** | 整个层 | 高 | ✅ | 极好 |
| **2:4 Sparsity** | 每 4 个权重保留 2 | 中（2x）| ✅（NVIDIA 优化）| **极好** |

### 按时机

| 阶段 | 描述 |
|------|------|
| **训练前** | Lottery Ticket 假设，从随机初始化剪枝 |
| **训练中** | Dynamic Sparse Training（持续演化稀疏性）|
| **训练后** | Post-Training Pruning（最常用）|

## 主流方法

### LLM 结构化剪枝

| 方法 | 机构 | 核心思想 |
|------|------|---------|
| **SparseGPT** | IST Austria | GPTQ 思路用于剪枝（一次性）|
| **SliceGPT** | Microsoft | 切片 + 旋转矩阵，去除整列 |
| **LLM-Pruner** | Microsoft | 结构化剪枝 + LoRA 恢复 |
| **Pruner-Zero** | MBZUAI | 零成本剪枝评估 |
| **FLAP** | - | 重要性分数自适应剪枝 |

### 传统网络剪枝

| 方法 | 特点 |
|------|------|
| **Magnitude Pruning** | 按权重绝对值剪枝（简单）|
| **Lottery Ticket** | 找到"中奖"子网络 |
| **Movement Pruning** | 训练中动态剪枝 |
| **SNIP** | 连接敏感性（训练前）|
| **GraSP** | 梯度信号保留 |

## LLM 剪枝典型工作流

```python
# SparseGPT 示例（一次性 GPTQ 风格剪枝）
from sparseml.transformers import SparseGPTModifier

# 1. 加载模型
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-7b-hf")

# 2. 配置剪枝（2:4 sparsity 50%）
recipe = """
sparsity_proportion:
  - apply: 0.5
    scope: [model.layers.0, ..., model.layers.31]
    target: weight
    pattern: 2:4
"""

# 3. 校准数据剪枝
modifier = SparseGPTModifier(recipe, calibration_data=calib_data)
modifier.apply(model)

# 4. 可选：恢复训练（LoRA 微调补偿精度损失）
```

## 何时使用

✅ **推荐**：
- 部署到边缘 / 移动端
- 推理加速（结构化剪枝）
- 模型太大（70B → 7B）
- 多模型并发（单卡跑多个稀疏模型）

⚠️ **不推荐**：
- 训练任务（剪枝会损失可塑性）
- 极致精度要求（量化保留更多精度）
- 非结构化剪枝但无稀疏库（无效）

## 与其他压缩技术对比

| 技术 | 压缩率 | 精度损失 | 推理加速 | 适用 |
|------|--------|---------|---------|------|
| **Pruning（结构化）** | 2-4x | 1-3% | ✅ | 边缘 |
| **Pruning（非结构化）** | 5-10x | 1-5% | ❌（需库）| 研究 |
| **Quantization（INT4）** | 3-4x | <1% | ✅ | **生产首选** |
| **Knowledge Distillation** | 5-10x | 1-3% | ✅ | 任务特定 |
| **Low-Rank Factorization** | 2-3x | 1-2% | ✅ | LLM |

## 与量化的协同

```
最大压缩 = Pruning + Quantization + Distillation
  ↓
50% 剪枝 + INT4 量化 + 蒸馏
  ↓
原始 100% 模型 → 6-8x 压缩
  ↓
典型应用：移动端 / 嵌入式 LLM
```

## Related

- [[_concepts/model-compression]] — 模型压缩总览
- [[_concepts/quantization]] — 量化
- [[_concepts/awq]] / [[_concepts/gptq]] / [[_concepts/nf4]] — 量化方法
- [[_concepts/knowledge-distillation]] — 知识蒸馏
- [[10_Deployment_Inference/Quantization]] — 量化章节
- [[07_Model_Training/Compression/README]] — 压缩章节