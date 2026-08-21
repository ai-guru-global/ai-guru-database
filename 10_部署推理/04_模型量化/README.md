---
title: 模型量化
category: 10-deployment-inference-quantization
tags: [quantization, int8, int4, gptq, awq, gguf, fp8, model-compression]
summary: "> 把高精度浮点权重压缩成低精度整数：GPTQ/AWQ/SmoothQuant/GGUF/FP8 的技术全景。"
created: 2026-07-02
updated: 2026-08-05
tier: core
sources: []

name_zh: "模型量化"
---
# 模型量化

> 中文简称：模型量化 ｜ English: Quantization

## 本文件夹定位

本目录聚焦 **量化（Quantization）** 这一最有效的推理压缩手段——把 LLM 的 FP16 权重压缩为 INT8/INT4/FP8，以显存换吞吐、以微小精度损失换大幅部署成本下降。覆盖技术全景（PTQ/QAT/二值化）、精度失效机制、以及 HuggingFace 量化生态的工程实践。

与相邻目录的边界：量化是 [03_推理优化](../03_推理优化/README) 中"计算优化"的深度展开；模型压缩的其他维度（剪枝/蒸馏/低秩）见 [03_推理优化/04_模型压缩](../03_推理优化/04_模型压缩)。

---

## 内容索引

| 序号 | 文档 | 主题 | 适用读者 |
|------|------|------|----------|
| 04 | [[10_部署推理/04_模型量化/04_量化_技术_2026|LLM 量化技术深度解析 2026]] | PTQ/QAT/二值化全景，GPTQ、AWQ、SmoothQuant、GGUF、FP8 完整方法论 | 部署工程师、模型压缩 |
| 03 | [[10_部署推理/04_模型量化/03_量化精度深入分析|量化精度深度解析]] | 失效机制、层敏感度、校准数据、PPL 评估、混合精度 | 量化调优、质量保障 |
| 01 | [[10_部署推理/04_模型量化/01_HF量化生态|Hugging Face 量化生态]] | BitsAndBytes、AWQ、GPTQ、GGUF 的统一 `quantization_config` 实践 | LLM 工程师、HF 用户 |

> 💡 序号 02 缺位（原索引文件已并入本 README）。

---

## 量化方法速查

| 方法 | 位宽 | 特点 | 适用场景 |
|------|------|------|----------|
| **GPTQ** | 4/8 bit | 训练后量化，逐层最小化输出误差 | GPU 服务、追求吞吐 |
| **AWQ** | 4 bit | 激活感知，保留重要权重精度 | 通用生产、显存敏感 |
| **SmoothQuant** | 8 bit | 激活平滑，易部署 | 高吞吐 INT8 |
| **GGUF** | 2–8 bit | llama.cpp 格式，CPU/混合 | 边缘/本地/CPU |
| **FP8** | 8 bit | 硬件原生（H100），精度高 | H100 部署 |
| **BitsAndBytes** | 4/8 bit | HF 原生，NF4/双量化 | 快速加载、实验 |

## 关联目录

- [[10_部署推理/README|模型部署与推理 总览]]
- [[10_部署推理/03_推理优化/README|推理优化]] — 量化的性能上下文
- [[10_部署推理/03_推理优化/04_模型压缩|模型压缩统一视角]] — 剪枝/蒸馏/量化对比
- [[07_模型训练/05_模型压缩/README|模型压缩（训练侧）]]
