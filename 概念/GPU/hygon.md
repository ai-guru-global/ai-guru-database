---
title: "海光 CPU (Hygon CPU)"
category: -concepts
tags: ["hygon", "cpu", "x86", "chinese-cpu", "ai-stack", "hardware"]
relationships:
  - target: "概念/apg-gpu"
    type: related_to
  - target: "概念/ascend-npu"
    type: related_to
  - target: "概念/apsara-stack"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "海光（Hygon）是国产 x86 服务器 CPU，基于 AMD Zen 架构授权。AI Stack 一体机服务器底层运行海光 CPU，提供国产化算力基座。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.75
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
---

# 海光 CPU (Hygon)

> **一句话理解**: 海光是"国产 x86 CPU"——基于 AMD Zen 架构授权，为国产服务器提供 CPU 算力，是 AI Stack 一体机的底层硬件基座之一。

---

## 1. 公司背景

| 维度 | 信息 |
|------|------|
| **公司名** | 海光信息技术股份有限公司 |
| **上市** | 科创板 (688041.SH) |
| **技术来源** | AMD Zen 架构授权（2016 年合资协议） |
| **产品线** | 海光 CPU (服务器) + 深算 DCU (AI 加速卡) |
| **定位** | 国产 x86 服务器 CPU |

---

## 2. 产品系列

| 产品 | 类型 | 说明 |
|------|------|------|
| **海光 7000 系列** | 服务器 CPU | 高端双路，32-64 核心 |
| **海光 5000 系列** | 服务器 CPU | 中端，16-32 核心 |
| **海光 3000 系列** | 工作站/边缘 | 入门级 |
| **深算 DCU** | AI 加速卡 | 类 AMD CDNA，对标 MI250 |

---

## 3. 与 AI Stack 的关系

```
AI Stack 一体机硬件架构
│
├── CPU 层
│   ├── 海光 Hygon（国产 x86）← 本文
│   └── Intel Xeon（国际 x86）
│
├── GPU 层
│   ├── APG 自研加速卡（首选）
│   ├── NVIDIA A800/H20（合规版）
│   └── 华为昇腾 910B/C（国产替代）
│
└── 互联层
    └── 卡间互联（PCIE/CXL/NVLink）
```

### 国产化适配意义

| 维度 | 说明 |
|------|------|
| **自主可控** | 减少对美国 CPU 的依赖 |
| **信创合规** | 满足政府/央企国产化要求 |
| **生态兼容** | x86 指令集，无需迁移应用 |
| **性能对标** | 接近 AMD EPYC 一代/二代水平 |

---

## 4. 国产 CPU 对比

| 维度 | 海光 Hygon | 飞腾 Phytium | 鲲鹏 Kunpeng | 龙芯 Loongson |
|------|-----------|-------------|-------------|-------------|
| **架构** | x86 (AMD Zen) | ARM v8 | ARM v8 (华为) | 自主 LoongArch |
| **生态** | x86 兼容 | ARM 生态 | 华为生态 | 自主生态 |
| **迁移成本** | 极低 | 中 | 中 | 高 |
| **性能** | 中高 | 中 | 中高 | 中 |
| **适用场景** | 服务器 | 嵌入式/服务器 | 服务器 | 桌面/嵌入式 |

---

## Related

- [[概念/apg-gpu]] — APG 自研加速卡
- [[概念/ascend-npu]] — 华为昇腾 NPU
- [[概念/apsara-stack]] — 飞天企业版
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析

---

## 2026 海光生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **海光 DCU** | 国产 GPU，CUDA 兼容 | GA |
| **海光 CPU** | x86 架构国产 CPU | GA |
| **DCU 训练** | 支持大模型训练 | GA |
| **DCU 推理** | 支持 LLM 推理 | GA |
| **AI Stack 集成** | 阿里云 AI Stack 支持 | GA |

## 生产最佳实践

1. **国产替代**：信创场景考虑海光 DCU
2. **CUDA 兼容**：海光 DCU 兼容 CUDA，迁移成本低
3. **性能验证**：生产前验证海光 DCU 性能
4. **驱动支持**：确保海光驱动与框架兼容
5. **与 NVIDIA 对比**：对比海光与 NVIDIA 的性能和成本

## 2026 海光生态

| 产品 | 说明 | 状态 |
|------|------|------|
| **深算一号** | AI 训练 GPU | GA |
| **DCU** | 计算单元 | GA |
| **ROCm 兼容** | AMD ROCm 兼容 | GA |

## 延伸阅读

- [[概念/GPU/gpu|GPU]] — GPU 基础
- [[概念/GPU/mthreads|摩尔线程]] — 国产 GPU
- [[概念/GPU/cambricon|寒武纪]] — 国产 AI 芯片

> ℹ️ 海光是国产 GPU 厂商，提供 AI 训练和推理 GPU，兼容 ROCm 生态。

## 海光产品线

| 产品 | 架构 | 算力 | 适用 |
|------|------|------|------|
| **深算一号** | GPGPU | 高 | AI 训练 |
| **DCU** | 计算单元 | 中 | AI 推理 |

## ROCm 兼容

```
海光 DCU 兼容 ROCm 生态:
    ├── ROCm Driver (驱动)
    ├── ROCm Runtime (运行时)
    ├── rocBLAS (线性代数)
    ├── MIOpen (深度学习)
    └── PyTorch/TensorFlow 支持
```

## 生产最佳实践

1. **驱动验证**：生产前验证驱动稳定性
2. **框架兼容**：确认 PyTorch/TensorFlow 兼容
3. **性能测试**：对比 NVIDIA 性能
4. **异构部署**：支持混合部署
5. **技术支持**：建立技术支持渠道

## 检查清单

- [ ] 驱动已安装验证
- [ ] 框架兼容性已确认
- [ ] 性能已测试
- [ ] 技术支持已建立

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| ROCm 算子缺失 | 自定义算子未适配 | 使用 hipBLAS/hipDNN 开发 |
| 性能低于预期 | 未优化内存访问 | 使用共享内存 + 合并访问 |
| 驱动不兼容 | 内核版本不匹配 | 使用官方推荐的 OS 内核 |
| 多卡通信慢 | 未配置 xGMI | 启用 xGMI 互联 + RCCL |
| 精度异常 | FP16 实现差异 | 对比 CUDA 结果，调整精度策略 |

## 延伸阅读

- [[概念/GPU/nvidia-gpu|NVIDIA GPU]] — 主要竞争对手
- [[概念/GPU/cuda|CUDA]] — ROCm 对标的编程模型
- [[概念/GPU/cambricon|寒武纪]] — 国产 AI 芯片对比
- [[概念/GPU/mthreads|摩尔线程]] — 国产 GPU 对比
- [[概念/Training/distributed-training|分布式训练]] — 多卡训练策略

> ℹ️ 海光 DCU 是国产 GPU 中 ROCm 生态兼容性最好的方案，2026年深算一号在推理场景已可替代 A100，适合对 CUDA 生态依赖较重的迁移场景。

## 2026 海光 DCU 生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| ROCm 兼容性 | ✅ 成熟 | hipBLAS/hipDNN/RCCL |
| PyTorch 支持 | ✅ 成熟 | 官方适配 |
| 推理部署 | ✅ 成熟 | vLLM 已适配 |
| 大模型训练 | 🟡 发展中 | 千卡级验证中 |
| xGMI 互联 | ✅ 成熟 | 多卡高速互联 |
| 容器化 | ✅ 成熟 | 官方 ROCm 镜像 |
