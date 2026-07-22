---
title: "NVIDIA GPU"
category: -concepts
tags: ["hardware", "gpu", "nvidia", "cuda", "training", "inference", "alibaba-cloud"]
summary: "NVIDIA GPU 是目前 AI 训练与推理最主流的加速器，配合 CUDA 生态提供从消费级到数据中心级的完整算力方案。"
created: 2026-06-26
updated: 2026-07-21
tier: core
aliases:
  - "NVIDIA Graphics Processing Unit"
  - "英伟达 GPU"
relationships:
  - target: "概念/gpu"
    type: is_a
  - target: "概念/cuda"
    type: uses
  - target: "概念/nvidia-smi"
    type: managed_by
sources: []
---

# NVIDIA GPU

> **一句话理解**: NVIDIA GPU 是 AI 领域最主流的算力卡，从游戏卡 RTX 到数据中心 A100/H100，配合 CUDA 生态几乎统治了深度学习训练市场。

## 核心要点

- **CUDA 生态**: NVIDIA 的并行计算平台和编程模型，是深度学习框架的主要后端。
- **数据中心卡**: A100、H100、H200，支持大模型训练和推理。
- **推理卡**: A10、L4、T4，针对推理优化。
- **关键技术**: Tensor Core、NVLink、NVSwitch、MIG、Multi-Instance GPU。
- **管理软件**: NVIDIA Driver、CUDA Toolkit、cuDNN、TensorRT、NVIDIA Container Toolkit。

## 常见产品线

| 系列 | 定位 |
|------|------|
| GeForce RTX | 消费级 / 开发测试 |
| RTX A 系列 | 专业工作站 |
| Tesla / Data Center | 数据中心训练/推理 |
| DGX / HGX | 整机 AI 超级计算机 |

## 阿里云专有云关联

在阿里云专有云环境中，神龙 GPU 实例和 ECS GPU 实例主要使用 NVIDIA A100/V100/T4 等数据中心 GPU，配合 ACK 运行 AI 工作负载。

## Related

- [[概念/gpu|GPU]]
- [[概念/cuda|CUDA]]
- [[概念/nvidia-smi|nvidia-smi]]
- [[概念/mig|MIG]]
- [[概念/tensorrt|TensorRT]]

---

## 2026 NVIDIA GPU 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **H100/H200** | Hopper 架构，FP8 训练/推理 | GA |
| **B100/B200** | Blackwell 架构，性能翻倍 | GA |
| **L40S** | Ada 架构，推理/图形通用 | GA |
| **A100/A800** | Ampere 架构，上一代旗舰 | GA |
| **NVIDIA AI Enterprise** | 企业级 AI 软件套件 | GA |

## 生产最佳实践

1. **训练用 H100/H200**：大模型训练首选 H100/H200
2. **推理用 L40S**：推理场景用 L40S，成本更低
3. **FP8 量化**：H100+ 启用 FP8，速度提升 2x
4. **MIG 切分**：多租户场景用 MIG 切分 GPU
5. **驱动更新**：定期更新 NVIDIA 驱动，获取性能优化

## 2026 NVIDIA GPU 产品线

| 产品 | 架构 | 显存 | 适用 |
|------|------|------|------|
| **B200** | Blackwell | 192GB HBM3e | AI 训练 |
| **H100** | Hopper | 80GB HBM3 | AI 训练 |
| **L40S** | Ada | 48GB GDDR6 | AI 推理 |
| **A100** | Ampere | 80GB HBM2e | 通用 |

## 延伸阅读

- [[概念/GPU/cuda|CUDA]] — CUDA 计算平台
- [[概念/GPU/nvlink|NVLink]] — GPU 互联
- [[概念/GPU/mig|MIG]] — 多实例 GPU

> ℹ️ NVIDIA GPU 是 AI 训练和推理的标准硬件，提供完整的软件生态。

## NVIDIA GPU 架构演进

| 架构 | 代表产品 | 年份 | 特点 |
|------|------|------|------|
| **Blackwell** | B200 | 2024 | FP8/FP4, 192GB |
| **Hopper** | H100 | 2022 | Transformer Engine |
| **Ampere** | A100 | 2020 | MIG, TF32 |
| **Turing** | T4 | 2018 | RT Core |
| **Volta** | V100 | 2017 | Tensor Core |

## NVIDIA 软件生态

```
NVIDIA 软件栈
    ├── CUDA (计算平台)
    ├── cuDNN (深度学习)
    ├── TensorRT (推理优化)
    ├── NCCL (多 GPU 通信)
    ├── Triton (推理服务)
    └── NGC (容器镜像)
```

## 生产最佳实践

1. **驱动管理**：固定驱动版本，定期更新
2. **CUDA 版本**：固定 CUDA 版本保证可复现
3. **MIG 切分**：多租户场景用 MIG
4. **监控利用率**：用 nvidia-smi 监控
5. **温度管理**：监控 GPU 温度，防止过热
6. **ECC 内存**：生产环境启用 ECC
7. **NVLink 拓扑**：优化 GPU 拓扑
8. **固件更新**：定期更新固件

## 检查清单

- [ ] 驱动版本已固定
- [ ] CUDA 版本已确认
- [ ] ECC 已启用
- [ ] 监控已配置
- [ ] 温度告警已设置

## 常见问题

| 问题 | 解决方案 |
|------|------|
| 驱动安装失败 | 检查内核版本和依赖 |
| CUDA 不兼容 | 确认 CUDA 和驱动版本 |
| GPU 掉卡 | 检查电源和散热 |
| 性能低 | 用 nvidia-smi 检查利用率 |

## 适用场景

| 场景 | 推荐 GPU | 说明 |
|------|------|------|
| **大模型训练** | H100/B200 | 高算力、大显存 |
| **大模型推理** | L40S/A100 | 性价比高 |
| **小模型训练** | A100/RTX 4090 | 够用 |
| **边缘推理** | T4/Jetson | 低功耗 |

## 生产最佳实践

1. **驱动管理**：使用 NVIDIA Data Center Driver，固定版本避免升级风险
2. **ECC 内存**：生产环境必须启用 ECC，牺牲少量显存换取稳定性
3. **温度监控**：设置 GPU 温度告警阈值 85°C，超过自动降频
4. **功耗限制**：使用 `nvidia-smi -pl` 设置功耗上限，平衡性能与电费
5. **固件更新**：定期更新 NVSwitch/IB 固件，修复已知问题

## 检查清单

- [ ] 驱动版本与 CUDA 版本匹配
- [ ] ECC 已启用
- [ ] NVLink/NVSwitch 拓扑已验证
- [ ] 散热方案已确认（风冷/液冷）
- [ ] 监控已接入（DCGM/Prometheus）

## 延伸阅读

- [[概念/GPU/cuda|CUDA]] — NVIDIA 并行计算平台
- [[概念/GPU/nvlink|NVLink]] — GPU 高速互联
- [[概念/GPU/mig|MIG]] — 多实例 GPU 虚拟化
- [[概念/GPU/gpustack|GPUStack]] — GPU 集群管理
- [[概念/GPU/heterogeneous-gpu|异构 GPU]] — 混合 GPU 管理

> ℹ️ NVIDIA GPU 是 AI 计算的绝对主导，2026年 Blackwell Ultra (B300) 提供 20 PFLOPS FP4 算力，配合 NVL72 机架级方案，是万卡集群训练的事实标准。

## 2026 NVIDIA 数据中心 GPU 产品线

| 型号 | 架构 | 显存 | FP8 算力 | 定位 |
|------|------|------|------|------|
| B300 | Blackwell Ultra | 288GB HBM3e | 10 PFLOPS | 旗舰训练 |
| B200 | Blackwell | 192GB HBM3e | 9 PFLOPS | 训练+推理 |
| H200 | Hopper | 141GB HBM3e | 4 PFLOPS | 训练+推理 |
| H100 SXM | Hopper | 80GB HBM3 | 4 PFLOPS | 主流训练 |
| L40S | Ada | 48GB GDDR6 | 1.5 PFLOPS | 推理专用 |
| T4 | Turing | 16GB GDDR6 | — | 边缘推理 |

## 检查清单

- [ ] GPU 型号与任务类型匹配
- [ ] 驱动版本与 CUDA 版本匹配
- [ ] ECC 已启用
- [ ] NVLink/NVSwitch 拓扑已验证
- [ ] 散热方案已确认（风冷/液冷）
- [ ] 监控已接入（DCGM/Prometheus）
- [ ] 固件版本已统一

> ℹ️ NVIDIA GPU 选型需综合考虑算力、显存、互联和生态，2026年 Blackwell 是训练首选。

## 选型决策树

- 训练 > 100B → B200/B300
- 训练 < 100B → H100/H200
- 推理 → L40S/T4
- 边缘 → Jetson Orin
