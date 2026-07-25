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
  - 01_数学基础/10_AI_Hardware/AI_Hardware_2026.md
  - 12_架构基建/02_Architecture_Overview/AI_Infrastructure_2026
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

- [[01_数学基础/10_AI_Hardware/AI_Hardware_2026]] — AI 硬件 2026
- [[10_部署推理/04_Inference_Performance/Inference_Performance_Fundamentals]] — 量化技术
- [[12_架构基建/02_Architecture_Overview/AI_Infrastructure_2026]] — AI 基础设施 2026

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

## 内存层次结构

| 层级 | 容量 | 带宽 | 延迟 | 示例 |
|------|------|------|------|------|
| 寄存器 | KB | 极高 | <1ns | SRAM |
| L1 Cache | 64-256KB | 极高 | ~1ns | SRAM |
| L2 Cache | 1-8MB | 高 | ~5ns | SRAM |
| L3 Cache | 32-128MB | 中高 | ~15ns | SRAM |
| HBM | 80-192GB | 3.35 TB/s | ~100ns | H100 |
| DDR5 | 1-4TB | 100 GB/s | ~200ns | 主存 |
| NVMe SSD | TB级 | 7 GB/s | ~10μs | 存储 |

## 互联架构对比

| 互联 | 带宽 | 延迟 | 范围 | 用途 |
|------|------|------|------|------|
| NVLink 5.0 | 1.8 TB/s | 低 | 卡间 | GPU-GPU |
| NVSwitch | 1.8 TB/s | 低 | 节点内 | 多 GPU 互联 |
| InfiniBand NDR | 400 Gbps | 中 | 节点间 | 集群通信 |
| RoCE v2 | 200 Gbps | 中 | 节点间 | 以太网 RDMA |
| PCIe 5.0 | 64 GB/s | 中 | 卡-CPU | 设备连接 |

## AI 加速器架构对比

| 架构 | 代表 | 优势 | 劣势 |
|------|------|------|------|
| GPU | NVIDIA H100 | 通用并行、生态完善 | 功耗高、价格贵 |
| TPU | Google v5p | 张量专用、性价比高 | 仅 GCP |
| NPU | 华为昇腾 | 国产自主 | 生态较封闭 |
| ASIC | Groq/Cerebras | 极致性能 | 不灵活 |
| FPGA | Intel/Xilinx | 可重配置 | 开发难度大 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| GPU 利用率低 | 数据加载瓶颈 | 增加 DataLoader workers |
| 显存 OOM | 模型/batch 太大 | 梯度累积/混合精度 |
| 多卡通信慢 | 互联带宽不足 | NVLink/IB、减少通信量 |
| CPU 瓶颈 | 预处理复杂 | GPU 预处理/异步加载 |
| 功耗过高 | 满载运行 | 功率限制/动态调频 |

## 相关概念

- [[概念/gpu-sharing|GPU Sharing]] — GPU 共享调度
- [[概念/chinese-ai-chips|Chinese AI Chips]] — 国产 AI 芯片
- [[概念/infiniBand|InfiniBand]] — 高速互联网络

> 💡 理解计算机体系结构是优化 AI 系统的基础——知道瓶颈在哪里（计算/内存/互联），才能针对性优化。

## Roofline 模型

| 工作负载 | 计算强度 | 瓶颈 | 优化方向 |
|------|------|------|------|
| 矩阵乘法 | 高 | 计算受限 | Tensor Core/量化 |
| Attention | 中 | 内存受限 | FlashAttention |
| Embedding | 低 | 内存受限 | 缓存/压缩 |
| 卷积 | 高 | 计算受限 | im2col/Winograd |
| 归一化 | 低 | 内存受限 | 算子融合 |

## 版本兼容性

| 硬件 | 驱动 | CUDA | 状态 |
|------|------|------|------|
| H100/H200 | 535+ | 12.x | GA |
| B200 | 560+ | 12.8+ | GA |
| A100 | 525+ | 11.8+ | GA |
| MI300X | ROCm 6.0+ | 无 | GA |
| 昇腾 910C | CANN 8.0+ | 无 | GA |

## 生产检查清单

1. 确认 GPU 型号与任务类型匹配（训练/推理）
2. 检查 NVLink/IB 互联拓扑是否合理
3. 监控 GPU 利用率、显存、温度
4. 配置功率限制防止过热
5. 使用混合精度训练提升性能
6. 优化数据加载避免 CPU 瓶颈
7. 定期更新驱动和 CUDA 版本
8. 建立硬件故障自动迁移机制

## 总结

计算机体系结构是 AI 系统的物理基础。从 CPU 到 GPU 到 TPU/NPU，硬件架构的演进决定了 AI 的性能天花板。理解内存层次、互联拓扑和计算范式是优化 AI 系统的前提。

> 💡 AI 硬件的核心矛盾是“计算快、搬数慢”——内存带宽而非算力才是大多数 AI 工作负载的真正瓶颈。

## 精度格式对比

| 格式 | 位数 | 范围 | 适用场景 |
|------|------|------|------|
| FP32 | 32 | 大 | 训练默认 |
| TF32 | 19 | 中 | Ampere+ 训练 |
| FP16 | 16 | 中 | 混合精度训练 |
| BF16 | 16 | 大 | 大模型训练 |
| INT8 | 8 | 小 | 推理量化 |
| INT4 | 4 | 极小 | 极致压缩 |
| FP8 | 8 | 中 | H100+ 训练/推理 |

## 学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| NVIDIA 架构白皮书 | 文档 | Hopper/Blackwell 架构 |
| CSAPP | 书籍 | 计算机系统基础 |
| GPU Programming | 课程 | CUDA 编程 |
| nvidia-smi | 工具 | GPU 状态监控 |

## 常用命令

| 命令 | 说明 |
|------|------|
| `nvidia-smi` | 查看 GPU 状态 |
| `nvidia-smi -q -d TEMPERATURE` | 查看温度 |
| `nvidia-smi topo -m` | 查看 GPU 拓扑 |
| `nvcc --version` | 查看 CUDA 版本 |
| `lspci | grep -i nvidia` | 查看 GPU 硬件信息 |

## 总结

计算机体系结构是 AI 系统的物理基础。从 CPU 到 GPU 到 TPU/NPU，硬件架构的演进决定了 AI 的性能天花板。理解内存层次、互联拓扑和计算范式是优化 AI 系统的前提。

> 💡 AI 硬件的核心矛盾是“计算快、搬数慢”——内存带宽而非算力才是大多数 AI 工作负载的真正瓶颈。
