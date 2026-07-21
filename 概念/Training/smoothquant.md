---
title: "SmoothQuant"
category: -concepts
tags: ["smoothquant", "quantization", "int8", "inference", "llm", "optimization"]
relationships:
  - target: "概念/quantization"
    type: belongs_to
  - target: "概念/model-compression"
    type: belongs_to
  - target: "概念/model-precision"
    type: related_to
  - target: "概念/tensorrt-llm"
    type: used_by
sources:
  - 部署推理/Quantization/Quantization_Techniques_2026.md
  - 部署推理/Quantization/Quantization_Precision_Deep_Dive.md
  - 部署推理/Inference_Engines/TensorRT_LLM_Deep_Dive.md
summary: "SmoothQuant 是一种让大模型 INT8 量化更稳定的技术。它通过把权重和激活值之间的‘波动’重新分配，让两者都更容易用 8 位整数表示，从而在几乎不损失精度的情况下把推理速度提升 1.5-2 倍。"
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.8
lifecycle: reviewed
lifecycle_changed: 2026-06-16
updated: 2026-07-21
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Smoothquant

---
# SmoothQuant

## 核心要点

- **SmoothQuant 是 MIT 提出的 LLM INT8 量化方法**。
- **核心问题**：权重分布比较均匀，容易量化；但激活值（activation）中存在一些‘离群大值’，直接量化会丢精度。
- **核心思想**：把激活值上的大值‘挪’一部分到权重上，让激活值更平坦、权重稍微波动一点，两者都好量化了。
- **效果**：在保持模型效果的同时，把矩阵乘法从 FP16 降到 INT8，推理更快、更省显存。

## 一句话理解

SmoothQuant 就像搬家具：一个房间太挤（激活值有大值），另一个房间很空（权重很平），把一些东西挪过去，两个房间都好收拾了。

## 详细内容

### 量化的痛点

8-bit 整数只能表示 -128 到 127 这 256 个值。如果一组数里大部分很小、但有几个极大值，那小数就被压缩得几乎一样，精度全丢了。

在 Transformer 中：
- **权重 W**：分布通常比较均匀，好量化。
- **激活 X**：经常有离群值（outliers），直接 INT8 量化效果差。

### SmoothQuant 怎么做

它引入一个缩放向量 s，把激活除以 s，权重乘以 s：

```
Y = X · W
Y = (X / s) · (W × s)
```

- 新的激活 X/s 变小了、更平坦，好量化。
- 新的权重 W×s 虽然波动变大，但仍可接受。
- s 根据统计值离线计算好，推理时无额外开销。

### 为什么叫 Smooth

因为它让激活值的分布更‘平滑’，消除了尖峰，所以叫 SmoothQuant。

### 收益与局限

| 方面 | 说明 |
|------|------|
| **速度提升** | 矩阵乘法用 INT8，通常快 1.5-2 倍 |
| **显存节省** | 权重和激活都更小 |
| **精度损失** | 通常 < 1% |
| **局限** | 主要优化 Linear/FC 层；对 Attention Softmax 等仍需特殊处理 |

### 与 AWQ、GPTQ 的关系

| 方法 | 量化对象 | 特点 |
|------|----------|------|
| **SmoothQuant** | 权重 + 激活 | 训练后量化，关注激活离群值 |
| **AWQ** | 权重 | 保护 1% 的重要权重通道 |
| **GPTQ** | 权重 | 逐层补偿量化误差 |

## 开放问题

- SmoothQuant 与 FP8、INT4 更低精度量化的结合。
- 在长上下文、MoE 模型上的效果稳定性。
- 与 TensorRT-LLM、vLLM、SGLang 等推理引擎的深度集成。

## Related

- [[概念/quantization]] — 量化
- [[概念/model-compression]] — 模型压缩
- [[概念/model-precision]] — 模型精度
- [[概念/tensorrt-llm]] — TensorRT-LLM
- [[概念/awq]] — AWQ 激活感知量化
- [[部署推理/Quantization/Quantization_Techniques_2026]] — 量化技术 2026
- [[部署推理/Inference_Engines/TensorRT_LLM_Deep_Dive]] — TensorRT-LLM 深度解析

---

## 2026 SmoothQuant 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **TensorRT-LLM 集成** | 原生支持 SmoothQuant INT8 | GA |
| **vLLM 支持** | 推理引擎集成 | GA |
| **与 FP8 结合** | H100/H200 上的混合精度 | 实验性 |
| **MoE 支持** | 专家模型量化 | 研究前沿 |

## 生产最佳实践

1. **alpha 调优**：从 0.5 开始，根据模型调整迁移强度
2. **校准数据**：使用代表性校准集（128-512 样本）计算缩放因子
3. **精度验证**：量化后必须验证下游任务精度损失 <2%
4. **与 GPTQ/AWQ 对比**：SmoothQuant 适合 INT8，GPTQ/AWQ 适合 INT4
5. **推理引擎**：优先使用 TensorRT-LLM/vLLM 获得最佳性能
