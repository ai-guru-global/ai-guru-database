---
title: "MindIE"
category: -concepts
tags: ["ascend", "huawei", "inference", "llm", "alibaba-cloud"]
summary: "MindIE（Mind Inference Engine）是华为昇腾自研的推理引擎，面向大模型推理提供静态图优化、量化、Continuous Batching 等能力。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Mind Inference Engine"
  - "昇腾 MindIE"
relationships:
  - target: "_concepts/ascend-npu"
    type: runs_on
  - target: "_concepts/cann"
    type: part_of
---

# MindIE

> **一句话理解**: MindIE 是昇腾上的「自研推理引擎」，类似 TensorRT-LLM 在 NVIDIA 上的角色。

## 核心要点

- **静态图优化**: 图融合、算子优化
- **量化**: INT8/FP16
- **Continuous Batching**: 提高吞吐
- **Prefix Caching**: 前缀缓存，适合 RAG/多轮对话
- **多卡并行**: 支持 TP/PP

## 阿里云专有云关联

在阿里云专有云昇腾环境中，MindIE 是生产级 LLM 推理的首选引擎之一，可部署为 K8s Deployment。

## Related

- [[_concepts/ascend-npu|Ascend NPU]]
- [[_concepts/cann|CANN]]
- [[部署推理/Hardware/Ascend_NPU_Inference_Guide|昇腾 NPU LLM 推理部署指南]]
