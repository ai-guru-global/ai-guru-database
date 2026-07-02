---
title: "GPTQ（Post-Training Quantization for GPT）"
category: -concepts
tags: [gptq, quantization, llm-inference, post-training, low-bit, model-compression]
aliases:
  - "GPTQ"
  - "GPT Quantization"
  - "Generative Pre-trained Transformer Quantization"
relationships:
  - target: "_concepts/quantization"
    type: belongs_to
  - target: "_concepts/model-compression"
    type: belongs_to
  - target: "_concepts/awq"
    type: alternative
sources:
  - 10_Deployment_Inference/Quantization/
summary: "GPTQ 是 2022 年提出的 LLM INT4 训练后量化方法，基于二阶信息（Hessian）的逐层优化实现高精度量化；与 AWQ 一起是 LLM 4-bit 量化的两大主流方案。"
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

# GPTQ（Post-Training Quantization for GPT）

## 核心要点

- **提出**：Frantar et al., 2022-10（论文 "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers"）
- **核心思想**：
  - **逐层量化** + **二阶优化**（基于 Hessian 矩阵）
  - 每个权重量化时考虑对其他权重的补偿
  - 显著优于简单 round-to-nearest 量化
- **优势**：
  - INT4 量化下保持高精度（接近 FP16）
  - 一次量化，可重复使用
  - 已被广泛支持（vLLM、TGI、TensorRT-LLM）
- **劣势**：
  - 校准数据需求（典型 128 个样本）
  - 量化过程较慢（逐层优化）
  - AWQ 出现后部分场景被替代

## 一句话解释

> GPTQ = "用二阶信息做最精准的 INT4 量化"；慢但精度高，是 LLM 量化的经典方法。

## 与 AWQ 对比

| 维度 | GPTQ | AWQ |
|------|------|-----|
| 提出时间 | 2022-10 | 2023-06 |
| 核心方法 | Hessian-based 逐层优化 | 激活感知 + 缩放保护 |
| 校准数据 | 需要（典型 128 条）| 需要 |
| 校准时间 | 慢（分钟到小时）| 快（秒到分钟）|
| 精度（INT4）| ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 推理速度 | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 显存节省 | 3-4x | 3-4x |
| 推荐 | 极致精度 | 通用首选 |

## 工作原理

```
For each transformer layer:
  1. 用校准数据前向，收集每层输入 X 和激活
  2. 计算 Hessian: H = 2 * X^T * X（输入的协方差矩阵）
  3. 按列顺序逐个量化权重：
     for col in range(in_features):
        量化当前权重 w[col] 到 4-bit
        计算量化误差 e
        将误差 e 按 Cholesky 分解补偿到未量化权重上
  4. 输出量化后的 layer
```

## 典型使用

```python
# AutoGPTQ（最常用实现）
from auto_gptq import AutoGPTQForCausalLM, BaseQuantizeConfig
from transformers import AutoTokenizer

model_path = "Qwen/Qwen2.5-7B-Instruct"
quant_path = "qwen2.5-7b-gptq"

# 加载
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoGPTQForCausalLM.from_pretrained(model_path, quantize_config=BaseQuantizeConfig(bits=4, group_size=128))

# 准备校准数据
import json
calib_data = []
with open("calib.json") as f:
    for line in f:
        calib_data.append(json.loads(line)["text"][:512])

# 量化
model.quantize(calib_data, batch_size=4)

# 保存
model.save_quantized(quant_path)
```

```python
# vLLM 加载
from vllm import LLM
llm = LLM(model="qwen2.5-7b-gptq", quantization="gptq")
```

## 关键参数

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| `bits` | 4 | 目标比特（3/4/8）|
| `group_size` | 128 | group size（-1=per-output）|
| `damp_percent` | 0.01 | Hessian 阻尼，防止数值不稳定 |
| `desc_act` | False | 列序量化（True=激活序，更精确但慢）|
| `sym` | True | 对称量化 |

## 何时使用

✅ **推荐**：
- 需要极致量化精度
- 已有 GPTQ 校准数据
- 旧项目依赖（GPTQ 是事实标准）
- 学术研究（论文对比基线）

⚠️ **不推荐**：
- 新项目（AWQ 更优）
- 校准数据不可得
- 量化时间敏感

## 主流生态支持

- **AutoGPTQ**：参考实现（IST Austria）
- **vLLM**：原生支持
- **TGI**：支持
- **TensorRT-LLM**：支持
- **llama.cpp**：支持 GPTQ 格式
- **HuggingFace Optimum**：集成

## Related

- [[_concepts/awq]] — AWQ（GPTQ 主要替代）
- [[_concepts/quantization]] — 量化总览
- [[_concepts/model-compression]] — 模型压缩
- Quantization — 量化章节- [[_concepts/pruning]] — 剪枝
