---
title: "Moore Threads"
category: -concepts
tags: ["ai-chip", "mthreads", "chinese-chip", "inference", "gpu", "domestic-gpu", "musa"]
summary: "摩尔线程（Moore Threads）是中国 GPU 芯片公司，产品覆盖图形渲染和 AI 推理，代表产品为 MTT S4000/S3000。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "摩尔线程"
  - "Moore Threads GPU"
  - "MTT"
relationships:
  - target: "概念/chinese-ai-chips"
    type: part_of
  - target: "概念/musa"
    type: uses
sources: []
---

# Moore Threads（摩尔线程）

> **一句话理解**: 摩尔线程是国产 GPU 厂商，既做游戏/图形卡，也做 AI 推理卡，特点是图形和 AI 算力能兼顾。

## 定义

摩尔线程（Moore Threads）由前 NVIDIA 中国区总经理张建中创立，是国内少数同时覆盖图形渲染和 AI 计算的 GPU 设计公司，采用自研 MUSA 架构。

## 产品线（2026）

| 产品 | 定位 | AI 算力 | 显存 | 典型场景 |
|------|------|---------|------|----------|
| **MTT S4000** | 云端 AI + 图形 | 100 TFLOPS FP16 | 48GB GDDR6 | LLM 推理、数字人 |
| **MTT S3000** | 云端推理 | 80 TFLOPS FP16 | 32GB | CV/NLP 推理 |
| **MTT S80** | 桌面 GPU | 14 TFLOPS | 16GB | 游戏 + 轻量 AI |
| **MTT S2000** | 边缘推理 | 32 TFLOPS | 16GB | 边缘一体机 |

## 软件栈

| 组件 | 功能 | 对标 |
|------|------|------|
| **MUSA** | 统一计算架构 | CUDA |
| **MUSIFY** | CUDA 代码迁移工具 | hipify (AMD) |
| **MT Transformer** | LLM 推理加速 | TensorRT-LLM |
| **MCCL** | 集合通信 | NCCL |
| **DirectX/Vulkan** | 图形渲染 | 同 NVIDIA |

## 2026 年生态现状

| 方面 | 状态 |
|------|------|
| **LLM 推理** | MT Transformer 支持 Llama/Qwen/ChatGLM |
| **CUDA 迁移** | MUSIFY 可自动转换部分 CUDA 代码 |
| **图形能力** | 国内唯一同时支持 DirectX 12 的 GPU |
| **主要场景** | 数字人、AIGC、云游戏、边缘推理 |
| **市场定位** | 图形+AI 融合场景差异化竞争 |

## 生产注意事项

1. **CUDA 迁移成本**：MUSIFY 自动转换率有限，复杂算子需手动适配
2. **图形+AI 融合**：数字人、AIGC 场景是独特优势
3. **驱动稳定性**：建议锁定驱动版本，避免升级引入不兼容
4. **性能对标**：AI 推理性能约为同规格 NVIDIA 的 50-70%

## Related

- [[概念/chinese-ai-chips|Chinese AI Chips]]
- [[概念/ascend-npu|Ascend NPU]]
- [[概念/hygon|Hygon]]
- [[概念/GPU/cambricon|Cambricon]] — 国产 AI 芯片对比
- [[部署推理/Hardware/Chinese_AI_Chip_Inference_Matrix|国产芯片推理矩阵]]
