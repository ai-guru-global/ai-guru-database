---
title: "GPU"
category: -concepts
tags: ["hardware", "gpu", "nvidia", "training", "inference", "alibaba-cloud"]
summary: "GPU（Graphics Processing Unit）是适合大规模并行计算的处理器，是现代 AI 训练与推理的主要算力来源。"
created: 2026-06-26
updated: 2026-07-21
tier: core
aliases:
  - "Graphics Processing Unit"
  - "图形处理器"
relationships:
  - target: "概念/nvidia-gpu"
    type: related_to
  - target: "概念/ascend-npu"
    type: related_to
  - target: "概念/gpu-oom"
    type: related_to
sources: []
---

# GPU

> **一句话理解**: GPU 是 AI 算力的「发动机」，擅长同时做大量简单计算，训练大模型和跑推理都离不开它。

## 核心要点

- **并行计算**: 拥有数千个 CUDA Core，适合矩阵运算。
- **显存**: 用于存放模型参数、激活值、KV Cache。
- **主流厂商**: NVIDIA、AMD、Intel、以及国产昇腾/寒武纪/海光/摩尔线程。
- **关键指标**: 算力（TFLOPS）、显存容量/带宽、功耗。
- **软件栈**: CUDA、ROCm、oneAPI、CANN。

## 选型对比

| 场景 | 推荐 |
|------|------|
| 大模型训练 | NVIDIA A100/H100/H200 |
| 推理服务 | NVIDIA A10/L4/T4 或国产推理卡 |
| 边缘推理 | Jetson 或 NPU |

## 阿里云专有云关联

在阿里云专有云环境中，GPU 实例主要为神龙弹性裸金属或 ECS GPU 型实例，配合 ACK 运行 AI 训练/推理工作负载。

## Related

- [[概念/nvidia-gpu|NVIDIA GPU]]
- [[概念/ascend-npu|Ascend NPU]]
- [[概念/mig|MIG]]
- [[概念/hami|HAMi]]
- [[概念/gpu-oom|GPU OOM]]

---

## 2026 GPU 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **NVIDIA H100/H200** | Hopper 架构，FP8 训练/推理 | GA |
| **NVIDIA B100/B200** | Blackwell 架构，性能翻倍 | GA |
| **AMD MI300X** | CDNA 3 架构，192GB HBM3 | GA |
| **Intel Gaudi 3** | 专用 AI 训练芯片 | GA |
| **国产 GPU** | 华为 Ascend/寒武纪/海光 DCU | GA |

## 生产最佳实践

1. **训练用 H100/H200**：大模型训练首选 NVIDIA H100/H200
2. **推理用 L40S/A10**：推理场景用 L40S/A10，成本更低
3. **显存规划**：根据模型大小选择显存，避免 OOM
4. **多卡互联**：多卡训练用 NVLink，多节点用 InfiniBand
5. **监控利用率**：实时监控 GPU 利用率，发现瓶颈

## 2026 GPU 生态

| 厂商 | 产品 | 特点 |
|------|------|------|
| **NVIDIA** | H100/B200 | AI 训练标准 |
| **AMD** | MI300X | 性价比 |
| **Intel** | Gaudi 3 | AI 加速 |
| **华为** | 昇腾 910B | 国产替代 |

## GPU 架构

```
GPU 芯片
    ├── SM (Streaming Multiprocessor) x N
    │       ├── CUDA Cores
    │       ├── Tensor Cores
    │       └── RT Cores
    ├── HBM 显存
    ├── NVLink 接口
    └── PCIe 接口
```

## 延伸阅读

- [[概念/GPU/nvidia-gpu|NVIDIA GPU]] — NVIDIA GPU
- [[概念/GPU/cuda|CUDA]] — CUDA 计算平台
- [[概念/GPU/nvlink|NVLink]] — GPU 互联

> ℹ️ GPU 是并行计算处理器，是 AI 训练和推理的核心硬件。

## GPU vs CPU

| 维度 | GPU | CPU |
|------|------|------|
| **核心数** | 数千个小核心 | 几个大核心 |
| **擅长** | 并行计算 | 串行计算 |
| **内存** | HBM/GDDR | DDR |
| **带宽** | 高 | 低 |
| **适用** | AI/图形 | 通用计算 |

## GPU 选型指南

| 场景 | 推荐 GPU | 原因 |
|------|------|------|
| **大模型训练** | H100/B200 | 高算力、大显存 |
| **大模型推理** | L40S/A100 | 性价比高 |
| **小模型训练** | A100/RTX 4090 | 够用 |
| **边缘推理** | T4/Jetson | 低功耗 |

## 生产最佳实践

1. **显存规划**：根据模型大小选择显存
2. **多卡互联**：多卡训练用 NVLink
3. **监控利用率**：实时监控 GPU 利用率
4. **温度管理**：监控 GPU 温度
5. **驱动管理**：固定驱动版本
6. **ECC 内存**：生产环境启用 ECC

## 检查清单

- [ ] GPU 型号已选择
- [ ] 显存已规划
- [ ] 互联已配置
- [ ] 监控已配置
- [ ] 驱动已固定

## 常见问题

| 问题 | 解决方案 |
|------|------|
| 显存不足 | 减小批大小/用模型并行 |
| 利用率低 | 增大批大小/优化数据加载 |
| 温度过高 | 检查散热/降低负载 |
| 驱动问题 | 更新/回滚驱动 |

## GPU 监控命令

```bash
# 查看 GPU 状态
nvidia-smi

# 持续监控
nvidia-smi -l 1

# 查看进程
nvidia-smi --query-compute-apps=pid,process_name,used_memory --format=csv

# 查看拓扑
nvidia-smi topo -m
```

## 生产最佳实践

1. **选型匹配**：训练选 H100/B200，推理选 L40S/T4，边缘选 Jetson
2. **散热设计**：数据中心 GPU 必须配套液冷或高效风冷
3. **ECC 启用**：生产环境必须开启 ECC 防止位翻转
4. **固件统一**：集群内所有 GPU 固件版本保持一致
5. **健康检查**：部署前运行 `nvidia-smi -q` + `dcgmi diag` 全量检查

## 延伸阅读

- [[概念/GPU/nvidia-gpu|NVIDIA GPU]] — NVIDIA 产品线详解
- [[概念/GPU/cuda|CUDA]] — GPU 编程平台
- [[概念/GPU/mig|MIG]] — GPU 虚拟化
- [[概念/GPU/gpu-oom|GPU OOM]] — 显存溢出处理
- [[概念/GPU/flops|FLOPS]] — 算力衡量

> ℹ️ GPU 是 AI 计算的核心硬件，2026年 NVIDIA Blackwell、AMD MI400、国产芯片三足鼎立，选择需综合考虑算力、显存、生态和供应链安全。

## 2026 GPU 市场格局

| 厂商 | 代表产品 | 定位 | 生态成熟度 |
|------|------|------|------|
| NVIDIA | B200/B300 | 训练+推理 | ⭐⭐⭐⭐⭐ |
| AMD | MI400 | 训练+推理 | ⭐⭐⭐⭐ |
| 华为 | Atlas 900T A3 | 训练+推理 | ⭐⭐⭐⭐ |
| 海光 | 深算一号 | 推理为主 | ⭐⭐⭐ |
| 寒武纪 | 思元 590 | 推理+边缘 | ⭐⭐⭐ |
| 摩尔线程 | MTT S4000 | 推理+图形 | ⭐⭐⭐ |

## 检查清单

- [ ] GPU 型号与任务类型匹配
- [ ] 驱动版本已固定
- [ ] ECC 已启用
- [ ] 散热方案已确认
- [ ] NVLink/PCIe 拓扑已验证
- [ ] 监控已接入（DCGM/Prometheus）
- [ ] 固件版本已统一
