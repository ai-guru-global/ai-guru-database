---
title: "国产 AI 芯片深度解析 2026"
category: "01-fundamentals-ai-hardware"
tags: ["ai-chip", "chinese-chip", "huawei-ascend", "cambricon", "mthreads", "t-head", "pingtouge", "ppu", "inference", "training", "hardware"]
summary: "全面解析中国 12 家国产 AI 芯片厂商的技术架构、产品规格、软件生态和训练验证状态，覆盖华为昇腾、寒武纪、海光、摩尔线程、平头哥等头部厂商，含横向对比矩阵和选型决策树。"
sources:
  - "https://www.hiascend.com/"
  - "https://www.cambricon.com/"
  - "https://www.mthreads.com/"
  - "https://www.hgon.com/"
  - "https://www.iluvatar.com/"
  - "https://www.metax-tech.com/"
  - "https://www.t-head.cn/"
  - "https://www.caixin.com/2026-01-22/102406926.html"
  - "https://www.caixin.com/2026-01-29/102409321.html"
  - "https://www.cls.cn/detail/2273750"
created: 2026-06-12
updated: 2026-06-15
lifecycle: reviewed
tier: supporting
aliases:
  - "Chinese Ai Chips Deep Dive"
  - "Chinese AI Chips Deep Dive"
  - Chinese_AI_Chips_Deep_Dive

name_zh: "国产 AI 芯片深度解析 2026"
---
# 国产 AI 芯片深度解析 2026

> 中文简称：国产 AI 芯片深度解析 2026

> **一句话理解**: 全面解析中国 12 家国产 AI 芯片厂商——从华为昇腾到摩尔线程，覆盖技术架构、软件生态、训练验证和选型决策。

---

## 目录

1. [产业背景与格局](#1-产业背景与格局)
2. [T1 梯队: 训练+推理双强](#2-t1-梯队-训练推理双强)
3. [T2 梯队: 训推一体/全功能](#3-t2-梯队-训推一体全功能)
4. [T3 梯队: 推理专用/边缘/车载](#4-t3-梯队-推理专用边缘车载)
5. [全厂商横向对比](#5-全厂商横向对比)
6. [软件生态对比](#6-软件生态对比)
7. [训练能力验证](#7-训练能力验证)
8. [选型决策树](#8-选型决策树)
9. [信息来源](#9-信息来源)

---

## 1. 产业背景与格局

### 为什么需要国产 AI 芯片?

2022 年 10 月起，美国对华实施多轮 AI 芯片出口管制，NVIDIA A100/H100/H800 等高端 GPU 被限制出口。这直接催生了国产 AI 芯片的加速发展。

### 产业格局

```
                    国产 AI 芯片梯队图
┌─────────────────────────────────────────────────┐
│  T1 训练+推理双强                                │
│  华为昇腾 · 寒武纪 · 海光信息                    │
├─────────────────────────────────────────────────┤
│  T2 训推一体/全功能                              │
│  壁仞科技 · 燧原科技 · 摩尔线程 · 天数智芯 · 沐曦 · 平头哥 │
├─────────────────────────────────────────────────┤
│  T3 推理专用/边缘/车载                           │
│  百度昆仑芯 · 算能 · 地平线 · 景嘉微             │
└─────────────────────────────────────────────────┘
```

### 核心挑战

| 挑战 | 现状 |
|------|------|
| 制程工艺 | 受限于代工能力，多数使用 7nm/12nm |
| HBM 供应 | HBM 获取受限，影响显存带宽 |
| 软件生态 | CUDA 生态壁垒高，迁移成本大 |
| 训练验证 | 大规模训练案例少于 NVIDIA |
| 互联带宽 | 芯片间互联能力与 NVLink 有差距 |

---

## 2. T1 梯队: 训练+推理双强

### 2.1 华为昇腾 (Ascend)

**梯队定位**: 国产 AI 芯片第一梯队，训练+推理全覆盖，全栈自研程度最高

#### 2024-2025 芯片产品线 (最新规格)

| 芯片 | 制程 | FP16 算力 | INT8 算力 | 显存 | 带宽 | 互联 | TDP | 发布时间 |
|------|------|----------|----------|------|------|------|-----|---------|
| Ascend 910B | 7nm | 320 TFLOPS | 640 TOPS | 64GB HBM2e | 400GB/s | HCCS 3.0 | 310W | 2023 |
| Ascend 910C | 7nm+ | 400+ TFLOPS | 800+ TOPS | 96GB HBM2e | 600GB/s | HCCS 4.0 | 350W | 2024 |
| Ascend 310P | 12nm | 8 TFLOPS | 16 TOPS | 8GB LPDDR4x | 51GB/s | PCIe 4.0 | 55W | 2022 |
| Ascend 310B | 12nm | 16 TFLOPS | 32 TOPS | 16GB | 68GB/s | PCIe 5.0 | 75W | 2024 |

#### Atlas 900 A3 SuperPoD 超节点 (2024 年发布)

这是华为昇腾 2024 年发布的旗舰级集群产品，面向大规模智算数据中心：

**核心规格：**

| 参数 | 规格 |
|------|------|
| NPU 数量 | 最大 384 张昇腾 910 |
| 算力 | 307.2 PFLOPS FP16 / 288.7 PFLOPS FP16 (不同配置) |
| 片上内存 | 48TB 统一编址 |
| D2D 互联带宽 | 784GB/s 双向，1:1 无收敛 |
| 通信单跳时延 | 200ns |
| 逻辑超节点 | 支持 16/32/64/128/256/384 卡 |
| 散热 | 液冷，支持更优 PUE |
| 互联技术 | 灵衢 (HCCS) 高速互联 |

**架构特点：**
- 384 张 NPU 像一台计算机一样工作
- 48TB 片上内存统一编址，突破单卡显存限制
- 光电融合，全域无损互联
- 总线带宽 1:1 无收敛，保证通信效率

#### Atlas 800T A3 超节点服务器 (2024 年发布)

| 参数 | 规格 |
|------|------|
| NPU | 8 颗昇腾 910 处理器 |
| 算力 | 6.0 PFLOPS FP16 |
| 形态 | 10U 高度 |
| 互联 | 最大支持 384 NPU 高速互联 |
| 内存 | 支持 48TB 内存统一编址 |
| 互联带宽 | 784GB/s，1:1 无收敛 |
| 部署 | 通用风冷机房部署 |
| 场景 | 大模型预训练、后训练、微调、强化学习 |

#### Atlas 服务器完整产品线 (2024-2025)

| 产品 | 形态 | 芯片配置 | 适用场景 |
|------|------|---------|---------|
| Atlas 900 A3 SuperPoD | 集群 | 384x 910 | 超大规模训练集群 |
| Atlas 900 A2 PoD | 集群基础单元 | 256x 910B | 大规模训练集群 |
| Atlas 900 SuperCluster | AI 集群 | 可扩展 | 企业级 AI 集群 |
| Atlas 800T A3 | 超节点服务器 | 8x 910 | 训练+后训练+微调 |
| Atlas 800I A3 | 超节点推理服务器 | 8x 910 | 大模型推理 |
| Atlas 800T A2 | 训练服务器 | 8x 910B | 常规模型训练 |
| Atlas 800I A2 | 推理服务器 | 8x 310P | 高密度推理 |
| Atlas 300I A2 | 推理加速卡 | 4x 310P | PCIe 推理卡 |
| Atlas 300V Pro | 视频解析卡 | 4x 310P | 视频 AI |
| Atlas 500 Pro | 智能边缘服务器 | 1x 310P | 边缘部署 |
| Atlas 500 A2 | 智能小站 | 1x 310P | 边缘计算 |
| Atlas 200I A2 | 加速模块 | 1x 310 | 嵌入式 AI |

#### Da Vinci 架构深度解析

华为昇腾采用自研 **Da Vinci (达芬奇) 架构**，核心设计思路：

- **Cube 计算单元**: 专为矩阵运算设计的 3D Cube 单元，每个 Cube 可在一个周期内完成 16x16x16 的矩阵乘法
- **Vector 计算单元**: 处理向量运算，配合 Cube 完成完整的算子计算
- **Unified Buffer**: 统一缓存架构，减少数据搬运
- **AI Core**: 由 Cube + Vector + Scalar 组成的基本计算单元

```
Da Vinci AI Core 架构:

┌──────────────────────────────────────┐
│           AI Core                     │
│  ┌─────────┐  ┌─────────┐  ┌──────┐ │
│  │  Cube   │  │ Vector  │  │Scalar│ │
│  │ (矩阵)  │  │ (向量)  │  │(标量)│ │
│  └────┬────┘  └────┬────┘  └──┬───┘ │
│       └────────┬───┘          │      │
│          ┌─────▼─────┐        │      │
│          │Unified Buf│◄───────┘      │
│          └─────┬─────┘              │
│                │                     │
│         ┌──────▼──────┐             │
│         │  L1/L2 Cache │             │
│         └──────────────┘             │
└──────────────────────────────────────┘
```

**910B vs 910C 架构差异：**

| 维度 | 910B | 910C |
|------|------|------|
| Da Vinci 版本 | Da Vinci 2.0 | Da Vinci 2.0+ |
| AI Core 数量 | 32 | 32+ |
| Cube 单元 | 16x16x16 | 16x16x16 (优化) |
| HBM | HBM2e 64GB | HBM2e 96GB |
| 互联 | HCCS 3.0 | HCCS 4.0 |
| 制程 | 7nm (TSMC) | 7nm+ (TSMC) |

#### CANN 软件栈 (v9.0, 2025 年)

**CANN (Compute Architecture for Neural Networks)** 是华为昇腾的异构计算架构，向上支持多种 AI 框架，向下服务 AI 处理器编程：

| 层次 | 组件 | 说明 |
|------|------|------|
| **应用层** | MindSpore / PyTorch / TensorFlow | 深度学习框架 |
| **算子层** | Ascend C / TBE / AKG | 算子开发语言和工具 |
| **加速库** | ATB (Transformer Boost) / SiP | Transformer 和信号处理加速 |
| **编译层** | 毕昇编译器 / 图编译器 | CCE Intrinsic + AscendNPU IR |
| **通信层** | HCCL / HIXL | 集合通信 + 单边通信 |
| **运行时** | Runtime API / GE 图引擎 | 任务调度与内存管理 |
| **驱动层** | Driver | 硬件驱动 |

**CANN 9.0 核心特性：**

| 特性 | 说明 |
|------|------|
| **Ascend C 算子开发** | 新一代算子编程语言，支持基础 API 和高阶 API |
| **HCCL 集合通信库** | 单机多卡 + 多机多卡数据并行/模型并行 |
| **HIXL 单边通信库** | 集群间数据传输，构建大模型推理分离式框架 |
| **ATB 加速库** | Ascend Transformer Boost，提升 Transformer 训练/推理效率 |
| **LLM DataDist** | 大模型推理分离部署，提高吞吐性能 |
| **DataFlow** | C++/Python API 构建/修改/编译/执行计算图，支持 UDF |
| **AOE 调优工具** | 自动调优，充分利用硬件资源 |
| **AMCT 模型压缩** | 量化、张量分解等多种模型压缩特性 |
| **PyTorch 一键迁移** | 分析迁移工具，将 PyTorch 训练脚本迁移至昇腾 NPU |

#### 实际部署案例 (2024-2025)

| 客户/场景 | 规模 | 模型 | 效果 |
|-----------|------|------|------|
| **中国移动** | 2000+ 卡集群 | 千亿参数大模型 | 国产化替代标杆 |
| **科大讯飞** | 1000+ 卡集群 | 星火大模型 | 训练+推理全栈 |
| **百度文心** | 数千卡 | 文心大模型推理 | 推理加速 |
| **鹏城实验室** | 4096 卡 | 鹏程.盘古 | 国产最大规模训练之一 |
| **中国银行** | 数百卡 | 金融大模型 | 信创合规 |
| **国家电网** | 边缘部署 | 电力巡检 AI | Atlas 500 部署 |
| **华为云** | 万卡级 | 盘古大模型 | 全栈自研训练 |

#### FlashMLA 移植状态

华为昇腾已完成 DeepSeek FlashMLA 的移植：
- 仓库: Ascend/Ascend-Speed
- 支持 910B/910C
- 性能约为 NVIDIA A100 的 85%
- 支持 MLA (Multi-Latent Attention) 高效推理

#### 优劣势分析

| 优势 | 劣势 |
|------|------|
| 国产化程度最高(全栈自研) | 制程受限(7nm/7nm+) |
| 软件栈最成熟(CANN 9.0) | 与 CUDA 生态不兼容 |
| 大规模训练已验证(万卡级) | HBM 带宽低于 H100 |
| 政府/央企/运营商首选 | 社区生态弱于 NVIDIA |
| 全栈解决方案(含网络/液冷) | 单卡算力有差距 |
| 384 卡超节点架构 | 代工依赖 TSMC |
| 灵衢互联 784GB/s | 第三方软件适配需时间 |

> **官网**: [hiascend.com](https://www.hiascend.com/)
> **文档**: [CANN 9.0 开发文档](https://www.hiascend.com/document)
> **社区**: [昇腾社区](https://www.hiascend.com/zh)

---

### 2.2 寒武纪 (Cambricon)

**梯队定位**: 国产 AI 芯片专业厂商第一梯队，云端训练+推理，科创板上市

#### 2024-2025 芯片产品线 (最新规格)

| 芯片 | 架构 | FP16 算力 | INT8 算力 | 显存 | 带宽 | 互联 | TDP | 发布时间 |
|------|------|----------|----------|------|------|------|-----|---------|
| 思元 590 | MLUarch04 | 512 TFLOPS | 1024 TOPS | 96GB HBM3 | 800GB/s | MLU-Link v2 | 350W | 2024 |
| 思元 370 | MLUarch03 | 256 TFLOPS | 512 TOPS | 48GB HBM2e | 307GB/s | MLU-Link | 250W | 2022 |
| 思元 270 | MLUarch02 | 128 TFLOPS | 256 TOPS | 32GB DDR4 | 128GB/s | — | 150W | 2020 |
| 思元 220 | MLUarch01 | 16 TFLOPS | 32 TOPS | 16GB DDR4 | 51GB/s | — | 30W | 2019 |

#### 加速卡产品线

| 加速卡 | 芯片 | 形态 | 适用场景 |
|--------|------|------|---------|
| MLU370-X8 | 双芯 370 | OAM | 中高端训练 |
| MLU370-X4 | 单芯 370 | PCIe | 云端训推一体 |
| MLU370-S4/S8 | 单/双芯 370 | PCIe | 高密度推理 |
| MLU270-S4 | 单芯 270 | PCIe | 推理加速 |
| MLU270-F4 | 单芯 270 | PCIe | 推理加速 |
| MLU220-SOM | 单芯 220 | 模组 | 边缘计算 |
| MLU220-M.2 | 单芯 220 | M.2 | 边缘加速卡 |

#### MLUarch04 架构 (思元 590, 2024 年)

思元 590 采用最新的 **MLUarch04** 架构，是寒武纪第四代云端 AI 芯片：

**核心设计：**

| 特性 | 说明 |
|------|------|
| **Chiplet 封装** | 多芯片封装，提升良率和灵活性 |
| **MLU Core v4** | 新一代 AI 计算核心，矩阵运算能力翻倍 |
| **HBM3 显存** | 首次采用 HBM3，带宽提升至 800GB/s |
| **MLU-Link v2** | 自研互联，400GB/s 双向带宽 |
| **混合精度** | 支持 FP16/BF16/INT8/INT4 多精度 |
| **片上网络** | NoC (Network-on-Chip) 架构优化 |

```
思元 590 (MLUarch04) 架构概览:

┌─────────────────────────────────────────────┐
│                  思元 590                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │MLU Core 0│  │MLU Core 1│  │MLU Core N│  │
│  │(矩阵+向量)│  │(矩阵+向量)│  │(矩阵+向量)│  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       └─────────┬────┘            │         │
│          ┌──────▼──────┐          │         │
│          │ 片上网络 NoC │◄─────────┘         │
│          └──────┬──────┘                    │
│          ┌──────▼──────┐                    │
│          │ HBM3 控制器  │ 96GB, 800GB/s      │
│          └─────────────┘                    │
│          ┌──────┬──────┐                    │
│          │MLU-Link v2  │ 400GB/s 双向       │
│          └─────────────┘                    │
└─────────────────────────────────────────────┘
```

#### MLU-Link 互联技术

| 版本 | 带宽 | 对标 | 说明 |
|------|------|------|------|
| MLU-Link v1 | 200GB/s | NVLink 2.0 | 思元 370 支持 |
| MLU-Link v2 | 400GB/s | NVLink 3.0 | 思元 590 支持 |
| 机内互联 | 200-400GB/s | NVLink | 单机 8 卡直连 |
| 机间互联 | 100-200GB/s | InfiniBand | 通过 RoCE/IB |

#### Neuware 软件栈 (完整版)

| 组件 | 对标 NVIDIA | 说明 |
|------|------------|------|
| **CNToolkit** | CUDA Toolkit | 编程工具包，提供编译器、调试器、性能分析工具 |
| **CNNL** | cuDNN | 神经网络算子库，覆盖卷积/池化/归一化/注意力等 |
| **CNNL Extra** | cuDNN Extra | 扩展算子库，支持自定义算子 |
| **CNRT** | CUDA Runtime | 运行时库，管理设备内存和任务调度 |
| **CNCL** | NCCL | 集合通信库，支持多卡/多机通信 |
| **MagicMind** | TensorRT | 推理引擎，模型优化和部署 |
| **CNDrv** | CUDA Driver | 底层驱动 API |
| **PyTorch 插件** | — | Cambricon PyTorch 适配层 |
| **MindSpore 适配** | — | 华为 MindSpore 支持 |
| **FlashMLA-MLU** | FlashMLA | DeepSeek MLA 高效实现移植 |

#### MagicMind 推理引擎

MagicMind 是寒武纪的推理引擎，对标 NVIDIA TensorRT：

| 特性 | 说明 |
|------|------|
| **模型导入** | 支持 PyTorch/ONNX/TensorFlow 模型 |
| **图优化** | 算子融合、常量折叠、内存优化 |
| **混合精度** | FP16/INT8/INT4 自动量化 |
| **批处理** | 动态 batch，提升吞吐 |
| **多流并行** | 支持多 stream 并发推理 |

#### 实际部署案例 (2024-2025)

| 客户/场景 | 规模 | 芯片 | 模型 | 效果 |
|-----------|------|------|------|------|
| **中国移动** | 数百卡 | 思元 590 | 移动九天大模型 | 国产化训练 |
| **中国电信** | 数百卡 | 思元 370 | 星辰大模型 | 推理加速 |
| **浪潮信息** | 服务器集成 | 思元 370 | 通用 AI 服务器 | OEM 合作 |
| **中科曙光** | 服务器集成 | 思元 590 | 高端 AI 服务器 | OEM 合作 |
| **紫光集团** | 边缘部署 | 思元 220 | 边缘 AI 盒子 | 边缘推理 |
| **教育科研** | 高校集群 | 思元 370 | 科研大模型 | 教学+科研 |
| **智慧城市** | 城市级部署 | 思元 220/270 | 视频分析 | 城市治理 |

#### FlashMLA-MLU 移植

寒武纪已完成 DeepSeek FlashMLA 的 MLU 移植：
- GitHub: Cambricon/FlashMLA-MLU
- 支持思元 590 和 370
- 性能约为 NVIDIA A100 的 70%
- 支持 MLA (Multi-Latent Attention) 高效推理

#### MLPerf 提交记录

寒武纪是国产 AI 芯片中 MLPerf 提交最积极的厂商：

| 版本 | 训练 | 推理 | 提交模型 |
|------|------|------|---------|
| MLPerf v3.1 | ✅ | ✅ | ResNet, BERT, DLRM |
| MLPerf v3.0 | ✅ | ✅ | ResNet, BERT |
| MLPerf v2.1 | — | ✅ | ResNet, BERT |

#### 优劣势分析

| 优势 | 劣势 |
|------|------|
| 纯 AI 芯片公司，专注度最高 | 软件生态成熟度不如昇腾 |
| MLU-Link v2 互联能力(400GB/s) | 大规模训练案例少于昇腾 |
| Chiplet 封装技术成熟 | 市场份额较小(相比昇腾) |
| 上市公司(科创板 688256) | 客户基数较小 |
| 思元 590 HBM3 首发 | 品牌认知度不如华为 |
| MLPerf 积极提交 | 第三方软件适配有限 |
| MagicMind 推理引擎 | 生态合作伙伴少于昇腾 |

> **官网**: [cambricon.com](https://www.cambricon.com/)
> **开发者**: [developer.cambricon.com](https://developer.cambricon.com/)
> **文档**: [文档中心](https://developer.cambricon.com/index/document/index/classid/3.html)

---

### 2.3 海光信息 (Hygon)

**梯队定位**: x86 + DCU 双线布局，CUDA 兼容路线

#### 核心产品线

| 芯片 | 类型 | FP16 算力 | 显存 | 带宽 | TDP | 定位 |
|------|------|----------|------|------|-----|------|
| DCU Z100 | GPU | 148 TFLOPS | 32GB HBM2e | 1024GB/s | 300W | 通用 GPU 计算 |
| DCU K100 | GPU | 200+ TFLOPS | 64GB HBM3 | 1600GB/s | 350W | 高端训练 |

#### 技术路线

海光 DCU 采用 **类 AMD CDNA 架构**，与 AMD GPU 有技术渊源：

- **ROCm 兼容**: 基于 ROCm 生态，兼容 HIP 编程模型
- **DTK (DCU Toolkit)**: 海光的软件开发工具包
- **CUDA 迁移**: 通过 DTK 可较容易地从 CUDA 代码迁移

#### 软件生态

| 组件 | 对标 | 说明 |
|------|------|------|
| DTK | CUDA Toolkit | 开发工具包 |
| DNN | cuDNN | 深度学习库 |
| RCCL | NCCL | 集合通信库 |
| hipBLAS | cuBLAS | 线性代数库 |

#### 优劣势分析

| 优势 | 劣势 |
|------|------|
| CUDA 迁移成本最低 | 受 AMD 技术授权限制 |
| ROCm 生态兼容 | AI 专用优化不如昇腾 |
| x86 CPU + DCU 统一平台 | 独立创新能力受限 |
| 上市公司(科创板) | 高端产品迭代速度 |

> **官网**: [hgon.com](https://www.hgon.com/)

---

## 3. T2 梯队: 训推一体/全功能

### 3.1 壁仞科技 (Biren)

**产品**: 壁砺系列 (BR100/BR104)

| 规格 | 壁砺 166M | 壁砺 166L | 壁砺 166C |
|------|----------|----------|----------|
| FP16 算力 | 1000+ TFLOPS | 600+ TFLOPS | 400+ TFLOPS |
| 显存 | 64GB HBM2e | 48GB | 32GB |
| 封装 | OAM | OAM | PCIe |
| TDP | 550W | 300W | 250W |

**技术特色**:
- **OAM 标准**: 采用 Open Accelerator Module 标准封装
- **BIRENSUPA**: 壁仞统一编程架构
- **光互连**: 支持芯片间光互连技术

> **官网**: [birentech.com](https://www.birentech.com/)

### 3.2 燧原科技 (Enflame)

**产品**: 云燧系列

| 芯片 | FP16 算力 | 显存 | 定位 |
|------|----------|------|------|
| 云燧 T20 | 256 TFLOPS | 32GB HBM2e | 训练 |
| 云燧 I20 | 128 TFLOPS | 16GB | 推理 |

**软件栈**: TopsRider (对标 CUDA)

> **官网**: [enflame-tech.com](https://www.enflame-tech.com/)

### 3.3 摩尔线程 (Moore Threads)

**梯队定位**: 全功能 GPU 路线，兼顾图形渲染和 AI 计算

#### 核心产品线

| 芯片 | FP16 算力 | 显存 | 带宽 | TDP | 定位 |
|------|----------|------|------|-----|------|
| MTT S5000 | 200+ TFLOPS | 64GB HBM2e | 800GB/s | 300W | 训推一体 |
| MTT S4000 | 128 TFLOPS | 48GB HBM2e | 600GB/s | 250W | 大模型加速 |
| MTT S3000 | 50 TFLOPS | 16GB | 256GB/s | 150W | 通用计算 |
| MTT S80 | 20 TFLOPS | 16GB | 256GB/s | 150W | 游戏显卡 |

#### MUSA 软件栈

**MUSA (Moore Threads Unified System Architecture)** 是摩尔线程的全栈软件平台：

| 层次 | 组件 | 对标 |
|------|------|------|
| 编程模型 | MUSA SDK | CUDA Toolkit |
| AI 库 | MUSA DNN / BLAS | cuDNN / cuBLAS |
| 推理引擎 | MUSA Inference | TensorRT |
| 编译器 | MUSA Compiler | NVCC |
| 驱动 | MUSA Driver | NVIDIA Driver |

#### FlashMLA 移植

摩尔线程已完成 **FlashMLA** 的 MUSA 移植：
- GitHub: 开源 MUSA 版 FlashMLA
- 支持 MTT S5000/S4000
- 性能接近 NVIDIA A100 的 70-80%

#### 优劣势分析

| 优势 | 劣势 |
|------|------|
| 全功能 GPU(图形+AI+视频) | AI 专用性能不如昇腾 |
| MUSA 栈对标 CUDA | 生态成熟度差距较大 |
| 游戏/专业显卡市场 | 训练规模验证不足 |
| FlashMLA 移植 | HBM 带宽受限 |

> **官网**: [mthreads.com](https://www.mthreads.com/)

### 3.4 天数智芯 (Tianshu)

**产品**: BI-V150

| 规格 | 值 |
|------|-----|
| FP16 算力 | 200+ TFLOPS |
| 显存 | 32GB HBM2e |
| 架构 | Corex |
| CUDA 兼容 | 部分兼容 |

> **官网**: [tianshuzhi.com](https://www.tianshuzhi.com/)

### 3.5 沐曦 (MetaX)

**产品**: MXC500

| 规格 | 值 |
|------|-----|
| FP16 算力 | 200 TFLOPS |
| 显存 | 64GB HBM2e |
| 架构 | MACA |
| 定位 | 推理为主 |

> **官网**: [metax-tech.com](https://www.metax-tech.com/)

### 3.6 平头哥 (T-Head)

**梯队定位**: 阿里生态背书的训推一体 AI 芯片破局者，2025 年国产 GPU 出货量最高

#### 核心产品线

| 芯片 | 类型 | 显存 | 片间互联 | 功耗 | 定位 | 状态 |
|------|------|------|---------|------|------|------|
| 真武 810E | 训推一体 PPU | 96GB HBM2e | 700GB/s | ≤400W | 大模型训练/推理 | 2026.01 官网发布 |
| 真武 M890 | 训推一体 PPU | 144GB | 800GB/s | — | 高精度训练+全场景推理 | 2026.05 发布 |

#### 关键数据 (2026)

| 指标 | 数值 |
|------|------|
| 真武系列累计出货 | **47-60 万片**（不同统计口径） |
| 万卡集群部署 | 已在阿里云多个万卡集群部署 |
| 外部客户 | 400+ 家企业，覆盖 20+ 行业 |
| 外部算力占比 | 60% 以上 |

#### 技术特色

- **自研并行计算架构**：针对 AI 训练/推理优化
- **自研片间互联**：700-800GB/s 多卡互联带宽
- **全栈自研软件栈**：驱动、运行时、通信库、框架适配
- **CUDA 兼容**：降低迁移成本
- **云-芯-模协同**：与阿里云、通义大模型深度优化

#### 部署案例

| 客户/场景 | 规模 | 说明 |
|-----------|------|------|
| 中国联通三江源智算中心 | 16384 张卡 | 阿里云 1024 台设备，1945P 算力 |
| 新浪微博 / 小鹏汽车 / 中科院 | 规模化 | 外部商业化客户 |

#### 优劣势分析

| 优势 | 劣势 |
|------|------|
| 阿里生态与阿里云场景 | 制程与代工能力受限 |
| 规模化出货与万卡部署验证 | 单卡算力与 H100/B200 有差距 |
| CUDA 兼容，迁移成本低 | 自研软件生态仍需完善 |
| 云-芯-模全栈协同 | 信创市场面临华为昇腾竞争 |

> **官网**: [t-head.cn](https://www.t-head.cn/)  
> **详见**: [[01_数学基础/10_AI_Hardware/T_Head_PPU_Deep_Dive|平头哥真武 PPU 深度解析]]

---

## 4. T3 梯队: 推理专用/边缘/车载

### 4.1 百度昆仑芯 (Kunlun)

| 芯片 | FP16 算力 | 显存 | 定位 |
|------|----------|------|------|
| 昆仑 2 | 256 TFLOPS | 32GB HBM2e | 云端推理 |
| 昆仑 3 | 512 TFLOPS | 64GB HBM3 | 高端训推 |

**特色**: 搜索引擎 + 文心大模型推理优化，自研 XPU 架构

### 4.2 算能 (Sophgo)

| 芯片 | INT8 算力 | 定位 |
|------|----------|------|
| BM1684X | 32 TFLOPS | 边缘推理 |
| BM1688 | 16 TFLOPS | 边缘 TPU |

**特色**: RISC-V + TPU 架构，边缘部署

### 4.3 地平线 (Horizon Robotics)

| 芯片 | INT8 算力 | 定位 |
|------|----------|------|
| 征程 J6 | 400+ TFLOPS | 车载智驾 |
| 征程 5 | 128 TFLOPS | 车载智驾 |

**特色**: 车规级认证，自动驾驶专用

### 4.4 景嘉微 (Jingjiawei)

| 芯片 | 类型 | 定位 |
|------|------|------|
| JM9271 | GPU | 图形渲染为主 |

**特色**: 军工背景，国产 GPU 图形渲染

---

## 5. 全厂商横向对比

### 5.1 核心参数对比

| 厂商 | 芯片 | 制程 | FP16 算力 | 显存 | 带宽 | 互联 | TDP |
|------|------|------|----------|------|------|------|-----|
| 华为昇腾 | 910C | 7nm | 400+ TF | 96GB HBM2e | 600GB/s | HCCS | 350W |
| 寒武纪 | 思元 590 | 7nm | 512 TF | 96GB HBM3 | 800GB/s | MLU-Link | 350W |
| 海光 | DCU K100 | 7nm | 200+ TF | 64GB HBM3 | 1600GB/s | xGMI | 350W |
| 平头哥 | 真武 810E | — | — | 96GB HBM2e | 700GB/s | 自研 | ≤400W |
| 平头哥 | 真武 M890 | — | — | 144GB | 800GB/s | ICN Switch | — |
| 壁仞 | 壁砺 166M | 7nm | 1000+ TF | 64GB HBM2e | 800GB/s | OAM | 550W |
| 摩尔线程 | S5000 | 12nm | 200+ TF | 64GB HBM2e | 800GB/s | MUSA Link | 300W |
| 燧原 | T20 | 12nm | 256 TF | 32GB HBM2e | 400GB/s | — | 300W |
| 百度昆仑 | 昆仑 3 | 7nm | 512 TF | 64GB HBM3 | 800GB/s | XPU Link | 350W |

### 5.2 能力矩阵

| 厂商 | 训练 | 推理 | MoE 支持 | 多模态 | 信创认证 |
|------|------|------|---------|--------|---------|
| 华为昇腾 | ★★★★★ | ★★★★★ | ✅ | ✅ | ✅ |
| 寒武纪 | ★★★★☆ | ★★★★☆ | ✅ | ✅ | ✅ |
| 海光 | ★★★★☆ | ★★★★☆ | ✅ | ⚠️ | ✅ |
| 平头哥 | ★★★★☆ | ★★★★☆ | ✅ | ✅ | ⚠️ |
| 壁仞 | ★★★☆☆ | ★★★★☆ | ⚠️ | ⚠️ | ✅ |
| 摩尔线程 | ★★★☆☆ | ★★★☆☆ | ⚠️ | ⚠️ | ✅ |
| 燧原 | ★★★☆☆ | ★★★☆☆ | ⚠️ | ⚠️ | ✅ |
| 百度昆仑 | ★★★☆☆ | ★★★★☆ | ✅ | ✅ | ✅ |

> ✅ = 已验证 ⚠️ = 部分支持/待验证

---

## 6. 软件生态对比

### 6.1 编程模型与 CUDA 兼容度

| 厂商 | 软件栈 | 编程模型 | CUDA 兼容 | PyTorch 支持 | 迁移难度 |
|------|--------|---------|----------|-------------|---------|
| 华为昇腾 | CANN | AscendCL | ❌ 不兼容 | MindSpore + 适配层 | 中 |
| 寒武纪 | Neuware | CNToolkit | ❌ 不兼容 | Cambricon PyTorch | 中 |
| 海光 | DTK | HIP/ROCm | ⚠️ 高度兼容 | 原生 ROCm PyTorch | 低 |
| 平头哥 | 自研 PPU 栈 | PPU SDK | ⚠️ 兼容 | PyTorch 适配 | 低 |
| 壁仞 | BIRENSUPA | BANG | ❌ 不兼容 | 适配层 | 高 |
| 摩尔线程 | MUSA | MUSA SDK | ⚠️ 部分兼容 | MUSA PyTorch | 中 |
| 燧原 | TopsRider | DTUCC | ❌ 不兼容 | 适配层 | 高 |
| 百度昆仑 | XTDK | XPU | ❌ 不兼容 | PyTorch XPU | 中 |

### 6.2 FlashMLA 移植状态

FlashMLA 是 DeepSeek 开源的 MLA (Multi-Latent Attention) 高效实现，是国产芯片适配的重要指标：

| 厂商 | FlashMLA 移植 | GitHub 仓库 | 性能(相对 A100) |
|------|-------------|-------------|----------------|
| 华为昇腾 | ✅ 已完成 | Ascend/Ascend-Speed | ~85% |
| 摩尔线程 | ✅ 已完成 | MooreThreads/FlashMLA-MUSA | ~75% |
| 寒武纪 | ✅ 已完成 | Cambricon/FlashMLA-MLU | ~70% |
| 平头哥 | ⚠️ 推进中 | — | — |
| 海光 | ⚠️ 进行中 | — | — |
| 壁仞 | ⚠️ 进行中 | — | — |

---

## 7. 训练能力验证

### 7.1 已知验证案例

| 厂商 | 验证模型 | 参数规模 | 训练规模 | 状态 |
|------|---------|---------|---------|------|
| 华为昇腾 | LLaMA 65B | 650 亿 | 2048 卡 | ✅ 生产级 |
| 华为昇腾 | GPT-3 等效 | 1750 亿 | 4096 卡 | ✅ 已验证 |
| 华为昇腾 | 稠密模型 | 千亿级 | 大规模集群 | ✅ 成熟 |
| 寒武纪 | LLaMA 13B | 130 亿 | 256 卡 | ✅ 已验证 |
| 寒武纪 | 稠密模型 | 百亿级 | 中等规模 | ✅ 已验证 |
| 海光 | LLaMA 7B | 70 亿 | 64 卡 | ✅ 已验证 |
| 摩尔线程 | LLaMA 7B | 70 亿 | 64 卡 | ✅ 已验证 |
| 百度昆仑 | 文心大模型 | 千亿级 | 内部集群 | ✅ 生产级 |
| 平头哥 | 通义大模型 | 千亿级 | 万卡集群 | ✅ 生产级 |

### 7.2 MLPerf 提交记录

| 厂商 | MLPerf 训练 | MLPerf 推理 | 最新提交 |
|------|-----------|-----------|---------|
| 华为昇腾 | ✅ | ✅ | v4.0 |
| 寒武纪 | ✅ | ✅ | v3.1 |
| 海光 | ❌ | ✅ | v3.0 |

---

## 8. 选型决策树

```
你的需求是什么?
═══════════════════════════════════════════════════════════════

  大规模模型训练 (百亿-千亿参数):
  ├── 首选稳定性 → 华为昇腾 910B/910C (最成熟)
  ├── 高性价比 → 寒武纪 思元 590 (512 TFLOPS)
  ├── CUDA 迁移 → 海光 DCU K100 (ROCm 兼容)
  └── 阿里生态/云协同 → 平头哥 真武 810E/M890

  云端推理部署:
  ├── 高密度 → 华为 310P / 寒武纪 370-S4
  ├── 低延迟 → 海光 DCU Z100
  ├── 搜索/文心 → 百度昆仑 3
  └── 阿里云生态 → 平头哥 真武 PPU

  边缘推理:
  ├── 车载 → 地平线 征程 J6 (车规级)
  ├── 通用边缘 → 算能 BM1688 / 寒武纪 220
  └── 工业边缘 → 华为 310P

  信创合规:
  ├── 必选国产化 → 华为昇腾 (首选)
  ├── x86 兼容 → 海光 DCU
  ├── 全功能 GPU → 摩尔线程 S5000
  └── 阿里系/云厂商自研 → 平头哥 真武 PPU

  图形渲染 + AI:
  ├── 游戏/专业 → 摩尔线程 S80/S70
  └── 军工/专用 → 景嘉微 JM9271
```

---

## 9. 信息来源

### 官网

| 厂商 | 官网 |
|------|------|
| 华为昇腾 | [hiascend.com](https://www.hiascend.com/) |
| 寒武纪 | [cambricon.com](https://www.cambricon.com/) |
| 海光信息 | [hgon.com](https://www.hgon.com/) |
| 平头哥 | [t-head.cn](https://www.t-head.cn/) |
| 壁仞科技 | [birentech.com](https://www.birentech.com/) |
| 摩尔线程 | [mthreads.com](https://www.mthreads.com/) |
| 燧原科技 | [enflame-tech.com](https://www.enflame-tech.com/) |
| 百度昆仑芯 | [kunlun.baidu.com](https://kunlun.baidu.com/) |
| 天数智芯 | [tianshuzhi.com](https://www.tianshuzhi.com/) |
| 沐曦 | [metax-tech.com](https://www.metax-tech.com/) |
| 算能 | [sophgo.com](https://www.sophgo.com/) |
| 地平线 | [horizon.cc](https://www.horizon.cc/) |
| 景嘉微 | [jingjiamicro.com](https://www.jingjiamicro.com/) |

### GitHub 仓库

| 仓库 | 说明 |
|------|------|
| [Ascend/ascend-speed](https://github.com/Ascend/ascend-speed) | 昇腾加速库 |
| [Cambricon/cambricon-pytorch](https://github.com/Cambricon/cambricon-pytorch) | 寒武纪 PyTorch |
| [MooreThreads/FlashMLA-MUSA](https://github.com/MooreThreads/FlashMLA-MUSA) | 摩尔线程 FlashMLA |
| [MooreThreads/musa](https://github.com/MooreThreads/musa) | MUSA SDK |
| [brentp/biren-supa](https://github.com/brentp/biren-supa) | 壁仞 SUPA |
| [enflame-tech/topsrider](https://github.com/enflame-tech/topsrider) | 燧原 TopsRider |

### Wiki 内部链接

> **关联**: -> [[01_数学基础/README|数学基础]] | [[05_大模型/15_Chinese_LLM_Ecosystem/README|中国大模型生态]] | [[10_部署推理/README|部署推理]] | [[12_架构基建/README|架构基础设施]] | [[12_架构基建/07_Hardware_Compute/CDI_Deep_Dive|CDI 容器设备接口(异构芯片统一接入)]] | [[07_模型训练/README|模型训练]] | [[12_架构基建/11_AI_Gateway/README|AI 网关]] | [[90_学习/guides/ai_engineering_roadmap_2026|AI 工程路线图]] | [[20_论文精读/02_Architecture/Mixture_of_Experts_Deep_Dive|MoE 深度解读]] | [[01_数学基础/10_AI_Hardware/T_Head_PPU_Deep_Dive|平头哥真武 PPU 深度解析]] | [[01_数学基础/10_AI_Hardware/T_Head_PPU_for_dummy|平头哥 PPU 大白话解读]]

## Related

- [[治理/chinese-chips-inference|国产 AI 芯片 × 推理引擎: 硬件约束下的推理软件栈适配]]
