---
title: "Chinese AI Chips"
category: -concepts
tags: ["ai-chip", "chinese-chip", "ascend", "cambricon", "hygon", "mthreads", "alibaba-cloud"]
summary: "国产 AI 芯片是中国自主研发的 AI 加速器，主要厂商包括华为昇腾、寒武纪、海光、摩尔线程等，用于替代或补充 NVIDIA GPU。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "国产 AI 芯片"
  - "Chinese AI Chip"
relationships:
  - target: "_concepts/ascend-npu"
    type: includes
  - target: "_concepts/cambricon"
    type: includes
  - target: "_concepts/hygon"
    type: includes
  - target: "_concepts/mthreads"
    type: includes
---

# Chinese AI Chips

> **一句话理解**: 国产 AI 芯片是中国自己做的 AI 算力芯片，主要在国产化、自主可控场景替代 NVIDIA。

## 核心要点

- **主要厂商**: 华为昇腾、寒武纪、海光、摩尔线程、天数智芯、壁仞、燧原等。
- **驱动因素**: 国际出口管制、自主可控需求、信创政策。
- **核心挑战**: 软件生态、CUDA 迁移、互联带宽、大规模训练验证。
- **主流场景**: 推理优先，训练逐步突破。

## 梯队

| 梯队 | 厂商 |
|------|------|
| T1 | 华为昇腾、寒武纪、海光 |
| T2 | 壁仞、燧原、摩尔线程、天数智芯、沐曦、平头哥 |
| T3 | 百度昆仑芯、算能、地平线、景嘉微 |

## 阿里云专有云关联

在阿里云专有云环境中，国产 AI 芯片可作为异构算力节点接入 ACK，用于信创场景或混合算力调度。

## Related

- [[_concepts/ascend-npu|Ascend NPU]]
- [[_concepts/cambricon|Cambricon]]
- [[_concepts/hygon|Hygon]]
- [[_concepts/mthreads|Moore Threads]]
- [[部署推理/Hardware/Chinese_AI_Chip_Inference_Matrix|国产芯片推理矩阵]]
- [[数学基础/AI_Hardware/Chinese_AI_Chips_Deep_Dive|国产 AI 芯片深度解析]]
