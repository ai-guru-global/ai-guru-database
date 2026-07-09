---
title: "Moore Threads"
category: -concepts
tags: ["ai-chip", "mthreads", "chinese-chip", "inference", "gpu", "alibaba-cloud"]
summary: "摩尔线程（Moore Threads）是中国 GPU 芯片公司，产品覆盖图形渲染和 AI 推理，代表产品为 MTT S4000/S3000。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "摩尔线程"
  - "Moore Threads GPU"
relationships:
  - target: "_concepts/chinese-ai-chips"
    type: part_of
  - target: "_concepts/musa"
    type: uses
sources: []
---

# Moore Threads

> **一句话理解**: 摩尔线程是国产 GPU 厂商，既做游戏/图形卡，也做 AI 推理卡，特点是图形和 AI 算力能兼顾。

## 核心要点

- **代表产品**: MTT S4000、MTT S3000
- **软件栈**: MUSA、MT Transformer、DirectX/Vulkan
- **定位**: 推理 + 图形渲染
- **典型场景**: 数字人、AIGC、边缘推理一体机

## 阿里云专有云关联

在阿里云专有云环境中，摩尔线程 GPU 可作为异构算力节点接入 ACK，适合需要图形+AI 的 AIGC 场景。

## Related

- [[_concepts/chinese-ai-chips|Chinese AI Chips]]
- [[_concepts/ascend-npu|Ascend NPU]]
- [[_concepts/hygon|Hygon]]
- [[部署推理/Hardware/Chinese_AI_Chip_Inference_Matrix|国产芯片推理矩阵]]
