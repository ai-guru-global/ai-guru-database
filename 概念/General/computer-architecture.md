---
title: "计算机体系结构 (Computer Architecture)"
category: -concepts
tags: ["computer-architecture", "gpu", "cpu", "tpu", "ai-hardware"]
summary: "计算机体系结构是 AI 训练与推理的物理基础——从 CPU 到 GPU 到 TPU，硬件架构决定了 AI 系统的性能天花板。"
created: 2026-06-12
updated: 2026-07-21
tier: core
aliases:
  - "Computer Architecture"
  - "computer architecture"
lifecycle: reviewed
provenance:
  extracted: 0.70
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.75
sources:
  - 数学基础/AI_Hardware/AI_Hardware_2026.md
  - 架构基建/Architecture_Overview/AI_Infrastructure_2026
relationships:
  - target: "概念/ai-hardware"
    type: related_to
---
# 计算机体系结构 (Computer Architecture)

> 计算机体系结构是 AI 训练与推理的物理基础——从 CPU 到 GPU 到 TPU，硬件架构决定了 AI 系统的性能天花板。

## AI 硬件演进

```
CPU (通用计算) → GPU (并行矩阵运算) → TPU (张量专用) → NPU (神经网络专用)
                                                           → 光子计算 (光矩阵乘法)
```

## 关键概念

- **FLOPS**: 每秒浮点运算次数（H100: 989 TFLOPS FP16）
- **显存带宽**: 数据搬运速度（H100: 3.35 TB/s HBM3）
- **互联拓扑**: NVLink、NVSwitch、InfiniBand 决定多卡通信效率
- **量化**: FP32 → FP16 → INT8 → INT4，用精度换速度

## 2026 主流硬件

| 芯片 | 厂商 | FP16 算力 | 显存 | 适用场景 |
|------|------|----------|------|----------|
| H100 | NVIDIA | 989 TF | 80GB HBM3 | 训练+推理 |
| H200 | NVIDIA | 989 TF | 141GB HBM3e | 大模型推理 |
| B200 | NVIDIA | 2.5 PF | 192GB HBM3e | 超大规模训练 |
| MI300X | AMD | 1.3 PF | 192GB HBM3 | 训练+推理 |
| TPU v5p | Google | 459 TF | 95GB HBM | GCP 训练 |

## 相关阅读

- [[数学基础/AI_Hardware/AI_Hardware_2026]] — AI 硬件 2026
- [[部署推理/Inference_Performance/Inference_Performance_Fundamentals]] — 量化技术
- [[架构基建/Architecture_Overview/AI_Infrastructure_2026]] — AI 基础设施 2026

---

## 2026 计算机架构生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **GPU 架构** | NVIDIA Hopper/Blackwell | GA |
| **CPU 架构** | x86/ARM/RISC-V | GA |
| **内存层次** | HBM/DDR5/CXL | GA |
| **互联技术** | NVLink/InfiniBand | GA |
| **AI 加速器** | TPU/NPU/ASIC | GA |

## 生产最佳实践

1. **GPU 选择**：AI 训练选择合适 GPU 架构
2. **内存带宽**：关注内存带宽瓶颈
3. **互联优化**：分布式训练优化互联
4. **AI 加速器**：特定场景用 AI 加速器
5. **架构理解**：理解架构优化性能
