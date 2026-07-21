---
title: "Cambricon"
category: -concepts
tags: ["ai-chip", "cambricon", "chinese-chip", "inference", "mlu", "domestic-gpu"]
summary: "寒武纪（Cambricon）是中国领先的 AI 芯片设计公司，产品覆盖云端训练/推理和终端推理，代表产品包括 MLU370、MLU590 等。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "寒武纪"
  - "Cambricon MLU"
  - "MLU"
relationships:
  - target: "概念/chinese-ai-chips"
    type: part_of
  - target: "概念/magicmind"
    type: uses
sources: []
---

# Cambricon（寒武纪）

> **一句话理解**: 寒武纪是国内最早做 AI 芯片的公司之一，MLU 系列主打云端高密度推理。

## 定义

寒武纪（Cambricon，上交所: 688256）是中国 AI 芯片设计先驱，产品覆盖云端训练/推理、边缘推理和终端 IP，采用自研指令集架构。

## 产品线（2026）

| 产品 | 定位 | 算力 | 显存 | 典型场景 |
|------|------|------|------|----------|
| **MLU590-M9** | 云端训练+推理 | 512 TOPS INT8 | 48GB HBM | 大模型训练 |
| **MLU370-X8** | 云端推理 | 256 TOPS INT8 | 24GB | NLP/CV 推理 |
| **MLU370-S4** | 密集推理 | 256 TOPS | 24GB | 推荐/搜索 |
| **MLU220** | 边缘推理 | 16 TOPS | 4GB | 边缘一体机 |

## 软件栈

```
应用层:  Cambricon PyTorch / MagicMind 推理
框架层:  CNToolkit (BANG C, CNCL, CNRT)
驱动层:  MLU Driver + Firmware
硬件层:  MLU590 / MLU370
```

| 组件 | 功能 | 对标 |
|------|------|------|
| **BANG C** | 算子开发语言 | CUDA C |
| **MagicMind** | 推理引擎 | TensorRT |
| **CNCL** | 集合通信库 | NCCL |
| **Cambricon PyTorch** | 框架适配 | PyTorch CUDA |

## 2026 年生态现状

| 方面 | 状态 |
|------|------|
| **大模型支持** | MagicMind 支持 Llama/Qwen/ChatGLM 推理 |
| **训练能力** | MLU590 支持千亿参数训练，但生态成熟度待提升 |
| **市场份额** | 国内 AI 芯片第二梯队（华为昇腾领先） |
| **主要客户** | 运营商、政务云、智慧城市 |

## 生产注意事项

1. **软件成熟度**：部分算子需手动适配，建议先验证目标模型
2. **容器部署**：使用官方 CNToolkit 镜像，避免版本不匹配
3. **性能对标**：同算力下实际吐量通常为 NVIDIA 的 60-80%
4. **多卡通信**：CNCL 成熟度不及 NCCL，大规模训练需谨慎评估

## Related

- [[概念/chinese-ai-chips|Chinese AI Chips]]
- [[概念/ascend-npu|Ascend NPU]]
- [[概念/hygon|Hygon]]
- [[概念/GPU/cann|CANN]] — 华为昇腾对标软件栈
- [[部署推理/Hardware/Chinese_AI_Chip_Inference_Matrix|国产芯片推理矩阵]]
