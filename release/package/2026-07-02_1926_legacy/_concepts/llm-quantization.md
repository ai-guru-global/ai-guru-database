---
title: LLM Quantization
category: concepts
tags: ["llm", "quantization", "model-compression", "inference", "edge-deployment"]
summary: 将大语言模型权重和/或激活值从高精度浮点数映射到低精度整数或更窄浮点格式的技术，以降低显存占用、提升推理吞吐并支持边缘部署。
created: 2026-07-02T00:00:00Z
updated: 2026-07-02T00:00:00Z
---

# LLM Quantization

LLM 量化（Quantization）是将大语言模型中的张量（主要是权重，有时也包括激活值、KV Cache 和梯度）从高精度数据类型（如 FP32、FP16/BF16）转换为低精度表示（如 INT8、INT4、FP8、FP4）的模型压缩与加速技术。其目标是在尽量保持模型能力的前提下，显著降低显存占用、提升推理吞吐、减少能耗，使大模型能够在消费级 GPU、边缘设备和移动端部署。

## 核心原理

量化本质上是一个**数值离散化**过程：将连续或高精度的数值映射到有限精度的离散值集合，并配套缩放（scale）、零点（zero-point）和量化分组（group/block）策略来缩小表示误差。

- **线性量化**：$x_q = \text{round}(x / s) + z$，其中 $s$ 为缩放因子，$z$ 为零点。对称量化省略 $z$，非对称量化适用于分布不均的激活值。
- **仅权重量化（Weight-Only）**：推理时临时反量化权重到 FP16/BF16 计算，典型代表 GPTQ、AWQ，可把 70B 模型从 140GB 压缩到约 40GB。
- **权重-激活同时量化（Weight-Activation）**：如 SmoothQuant、LLM.int8()，将两者都量化为 INT8，进一步加速矩阵乘法。
- **低比特浮点**：FP8（E4M3/E5M2）已在 NVIDIA H100/H200、Blackwell 上硬件原生支持，几乎无损；FP4 正在随 B200 等新一代芯片进入实用阶段。
- **训练后量化（PTQ）vs 量化感知训练（QAT）**：PTQ 直接对训练好的模型量化，成本低；QAT 在训练中模拟低精度前向传播，精度更高但开销大。

## 典型精度与效果

| 精度 | 每参数位数 | 显存缩减 | 速度提升 | 质量保持 |
|------|-----------|---------|---------|---------|
| FP16/BF16 | 16 bit | 基准 | 基准 | ~100% |
| FP8 | 8 bit | 2× | 1.5–2× | ~99%+ |
| INT8 | 8 bit | 2× | ~2× | 95–99% |
| INT4/GPTQ/AWQ | 4 bit | 4× | ~3× | 90–95%+ |
| FP4 | 4 bit | 4× | 3–4× | 任务相关 |

## 典型用例

1. **单卡大模型推理**：将 70B 参数模型量化为 4 bit，可在单张 48GB 显存的消费级 GPU 上运行。
2. **长上下文服务**：KV Cache 量化（如 KV4/FP8）能显著降低长序列下的显存峰值，提升并发能力。
3. **边缘与端侧部署**：在手机、IoT、机器人等受限设备上运行 1B–7B 量化模型。
4. **降低云推理成本**：相同集群下更高吞吐、更低显存，使单位 token 成本下降。

## 与相关概念的区别与联系

- **模型压缩（Model Compression）**：量化是模型压缩的子集，剪枝、蒸馏、低秩分解等也是其成员。
- **剪枝（Pruning）**：剪枝移除不重要参数或结构来稀疏化模型，量化则保留结构但降低精度；二者常结合使用。
- **知识蒸馏（Distillation）**：蒸馏用小模型学习大模型行为，量化不改变模型结构，通常与蒸馏互补。
- **KV Cache 压缩**：专门压缩推理过程中的键值缓存，常与权重量化一起配置以最大化显存节省。

## Related

- [[_concepts/quantization.md|量化]]
- [[_concepts/model-compression.md|模型压缩]]
- [[_concepts/model-compression-methods.md|模型压缩方法]]
- [[_concepts/llm-inference-engine.md|LLM 推理引擎]]
- [[_concepts/llm-inference-cost-optimization.md|LLM 推理成本优化]]
- [[_concepts/kv-cache-compression.md|KV Cache 压缩]]
- [[_concepts/edge-llm.md|边缘 LLM]]
- [[_concepts/ai-hardware.md|AI 硬件]]
