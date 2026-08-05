---
title: "GPTQ（Post-Training Quantization for GPT）"
category: -concepts
tags: [gptq, quantization, llm-inference, post-training, low-bit, model-compression]
aliases:
  - "GPTQ"
  - "GPT Quantization"
  - "Generative Pre-trained Transformer Quantization"
relationships:
  - target: "概念/quantization"
    type: belongs_to
  - target: "概念/model-compression"
    type: belongs_to
  - target: "概念/awq"
    type: alternative
sources:
  - 10_部署推理/04_模型量化/
summary: "GPTQ 是 2022 年提出的 LLM INT4 训练后量化方法，基于二阶信息（Hessian）的逐层优化实现高精度量化；与 AWQ 一起是 LLM 4-bit 量化的两大主流方案。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.88
created: 2026-06-24
updated: 2026-07-21
name_zh: "GPT 训练后量化"
---

# GPTQ（Post-Training Quantization for GPT）

> 中文简称：GPT 训练后量化

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

- [[概念/awq]] — AWQ（GPTQ 主要替代）
- [[概念/quantization]] — 量化总览
- [[概念/model-compression]] — 模型压缩
- [[10_部署推理/05_模型量化]] — 量化章节- [[概念/pruning]] — 剪枝

---

## 2026 GPTQ 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **GPTQ 4-bit** | 最常用量化精度，质量损失 <2% | GA |
| **AutoGPTQ** | 官方量化工具，支持 CUDA 加速 | GA |
| **GPTQ + ExLlamaV2** | 推理加速，吐吐量提升 2-3x | GA |
| **GPTQ 8-bit** | 更高精度，质量损失 <1% | GA |
| **GPTQ 3-bit** | 极端压缩，质量损失较大 | 实验 |

## 生产最佳实践

1. **精度选择**：生产用 4-bit，质量敏感场景用 8-bit
2. **校准数据集**：用目标领域数据校准，提高量化质量
3. **与 AWQ 对比**：GPTQ 适合 NVIDIA GPU，AWQ 适合边缘设备
4. **推理框架配合**：GPTQ 模型用 vLLM/TGI/ExLlamaV2 推理
5. **质量验证**：量化后必须验证输出质量，避免过度压缩
6. **group_size 选择**：group_size=128 是常用配置，平衡质量与速度
7. **预量化模型**：优先使用 HuggingFace 上的预量化模型，节省时间

## GPTQ vs AWQ vs GGUF

| 格式 | 适用场景 | 优势 | 劣势 |
|------|----------|------|------|
| **GPTQ** | NVIDIA GPU 服务器 | 速度快，生态成熟 | 仅支持 NVIDIA |
| **AWQ** | 边缘设备/移动端 | 激活感知，质量好 | 生态较新 |
| **GGUF** | CPU/混合推理 | 跨平台，llama.cpp | 速度较慢 |
| **EXL2** | 单用户极速 | 混合精度，质量最优 | 仅 ExLlamaV2 |

## 延伸阅读

- [[概念/LLM/llm-quantization|LLM 量化]]
- [[概念/LLM/exllama|ExLlamaV2]]
- [[概念/LLM/vllm|vLLM]]
- [[10_部署推理/04_模型量化/04_量化_技术_2026|GPTQ vs AWQ 对比]]

## 量化配置示例

```python
# AutoGPTQ 量化配置
quantize_config = {
    "bits": 4,              # 4-bit 量化
    "group_size": 128,      # 分组大小
    "desc_act": True,       # 按激活值降序处理
    "sym": True,            # 对称量化
    "damp_percent": 0.01    # 阻尼系数
}
```
