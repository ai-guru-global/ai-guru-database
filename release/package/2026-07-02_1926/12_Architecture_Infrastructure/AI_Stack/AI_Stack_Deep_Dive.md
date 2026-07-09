---
title: "阿里云 AI Stack: 企业级软硬一体 AI 推理平台"
category: "12-architecture-infrastructure"
tags: ["alibaba-cloud", "ai-stack", "inference", "private-deployment", "deepseek", "qwen", "appliance", "a-speed"]
summary: "> **一句话理解**: 阿里云 AI Stack 是面向政企的软硬一体 AI 推理一体机——开箱即用部署 Qwen/DeepSeek 满血大模型，支持 APG/Ascend/Nvidia 三种 GPU，提供 A-Speed 加速推理、模型网关、RAG 应用等全链路能力。"
created: "2026-06-03"
updated: "2026-06-16"
tier: core
aliases:
  - "Ai Stack Deep Dive"
  - "AI Stack Deep Dive"
  - AI_Stack_Deep_Dive
sources: []

---
# 阿里云 AI Stack: 企业级软硬一体 AI 推理平台

> **一句话理解**: 阿里云 AI Stack 是面向政企的软硬一体 AI 推理一体机——开箱即用部署 Qwen/DeepSeek 满血大模型，支持 APG/Ascend/Nvidia 三种 GPU，提供 A-Speed 加速推理、模型网关、RAG 应用等全链路能力。

> **产品版本**: V2.14.0（文档版本 20260529） | **产品形态**: 专有云软硬一体机

---

## 目录

1. [产品定位与价值主张](#1-产品定位与价值主张)
2. [产品形态与版本](#2-产品形态与版本)
3. [硬件规格](#3-硬件规格)
4. [核心技术能力](#4-核心技术能力)（含 A-Speed/Qwen3-Pro/模型网关/安全架构 + 通用推理技术背景）
5. [功能架构](#5-功能架构)
6. [模型生态](#6-模型生态)
7. [百炼专属版生态方案](#7-百炼专属版生态方案)
8. [权威认证与行业落地](#8-权威认证与行业落地)
9. [与飞天企业版的关系](#9-与飞天企业版的关系)
10. [竞品对比与选型](#10-竞品对比与选型)

---

## 1. 产品定位与价值主张

### 1.1 定位

阿里云 AI Stack 是面向企业级客户的**轻量化、极致性价比、软硬一体 AI 推理平台**，以一体机形态提供大模型推理与应用的全栈能力。核心目标：让企业在私有化环境中，实现大模型的**开箱即用**。

### 1.2 核心价值

| 维度 | 价值 |
|------|------|
| **数据安全** | 本地化私有部署，敏感数据无需上云，满足行业数据主权和隐私监管要求 |
| **成本效率** | 软硬一体交付，省去自建算力集群的高昂实施与运维成本 |
| **快速部署** | 预置模型与全栈工具链，部署周期从数周缩短至小时级 |
| **合规保障** | 通过多项国家级权威认证，满足政企合规要求 |
| **生态集成** | 可集成钉钉、通义灵码、百炼专属版等阿里生态应用 |

### 1.3 适用客户

- 需要大模型推理及应用的**政企客户**
- 有强个性化行业大模型应用需求的**大型机构**
- 数据敏感行业：**政务、金融、医疗、能源、教育、制造**
- 需要私有化部署且追求高性价比的**中型企业**

---

## 2. 产品形态与版本

### 2.1 版本体系

```
AI Stack 产品体系
│
├── 单机版（Standalone）
│   ├── 2卡版 — 入门级，轻量起步
│   ├── 4卡版 — 标准推理（2025.08 上市）
│   ├── 8卡版 — 高性能推理（2025.08 上市）
│   └── 16卡版 — 旗舰级，满血 DeepSeek 单机部署
│
└── 集群版（Cluster）
    ├── 百炼专属版 MINI — 开箱即用 RAG 应用
    ├── 百炼专属版 Lite — 轻量智能体平台
    └── 百炼专属版 标准版 — 全栈 AI 平台
```

### 2.2 单机版 vs 集群版

| 特性 | 单机版 | 集群版 |
|------|--------|--------|
| **部署规模** | 单台服务器 | 多台 GPU 服务器横向扩展 |
| **最大节点** | 1 台 | 最多 48 台 GPU 服务器 |
| **核心能力** | 模型推理、在线服务 | 算力池调度 + 多机推理 + 跨节点推理 |
| **扩展方式** | 无中心化横向扩展 | 由单机版组成集群 |
| **并发能力** | 单机并发 | 高并发大规模推理 |
| **飞天纳管** | 可被飞天企业版纳管 | 可被飞天企业版纳管 |
| **适用场景** | 轻量推理、PoC 验证 | 生产级大规模部署 |

### 2.3 百炼专属版对比

| 版本 | 定位 | 核心功能 |
|------|------|----------|
| **MINI** | 开箱即用 RAG 应用 | 深度思考 + 联网搜索 + 文档 RAG + 多模态问答四合一 |
| **Lite** | 轻量智能体平台 | 多模态多智能体 + 知识数据中心 + 工作流编排 |
| **标准版** | 全栈 AI 平台 | 大模型全栈工具 + 异构 GPU 集群 + 训推加速 |

---

## 3. 硬件规格

### 3.1 APG 服务器 16 卡版（旗舰）

| 模块 | 规格 |
|------|------|
| **GPU 数量** | 16 卡 |
| **形态** | 14U AI 服务器（机头 2U + 机尾 6U×2） |
| **CPU** | 2× Intel Xeon Scalable 或 2× 海光 7490 |
| **内存** | 32 个 DDR5 插槽，最高 5600 MT/s |
| **显存** | 1.5+ TB 超大显存 |
| **卡间互联** | 700 GB/s |
| **本地存储** | 240G SATA SSD ×1 + 3840G NVMe SSD ×4 |
| **网络** | 双口 200G 以太网卡 ×5 + 双口 25GE ×1 |
| **机间带宽** | 1.6T 通信带宽，低时延无拥塞 |
| **电源** | 机头 2×2000W (1+1)，机尾 4×4000W (N+N) |
| **散热** | 风冷 |

### 3.2 APG 服务器 4 卡/8 卡版

| 模块 | 规格 |
|------|------|
| **GPU 数量** | 4 卡 / 8 卡 |
| **规格** | 4U 机架式 |
| **处理器** | 2× 海光 C86-4G 系列（7470，最大 TDP 400W） |
| **内存** | 双路最大 24 DIMM，1DPC @4800MHz RDIMM |
| **存储** | 前面板最大 12 块 3.5" 硬盘（SAS/SATA/NVMe） |
| **网络** | 1Gb/10Gb/25Gb/100Gb/400Gb + OCP 3.0 |
| **I/O** | 最大 13 个 PCIe 5.0 + 1 个 PCIe 4.0 |
| **系统管理** | 独立 BMC 管理网口（IPMI） |
| **上市时间** | 2025.08 |

### 3.3 APG 服务器 2 卡版（入门）

| 模块 | 规格 |
|------|------|
| **GPU 数量** | 2 卡 |
| **规格** | 2U 机架式 |
| **处理器** | 2× 海光 C86-4G 系列 |
| **存储** | 前面板最大 12 块 3.5" 或 25 块 2.5" |
| **网络** | 1Gb/10Gb/25Gb/100Gb + 2× OCP 3.0 |
| **I/O** | 最大 10 个 PCIe 5.0 |
| **电源** | 1+1 冗余 |
| **上市时间** | 2024.07 |

---

## 4. 核心技术能力

> **重要纠偏**: 根据官方用户指南（V2.14.0），AI Stack 的实际推理框架为 **A-Speed 加速套件**，而非下文所述的 ASLLM。官方文档中未出现 ASLLM/vLLM/SGLang/OpenTrek-LLM 等名称。下文 MLA/FlashMLA/FlashInfer/MTP/KV Cache 等是通用 LLM 推理技术知识，非 AI Stack 特有功能。

### 4.1 A-Speed 加速推理框架（官方确认）

AI Stack 的核心推理能力基于 **A-Speed 加速套件**，提供深度优化的加速镜像：

| 能力 | 说明 |
|------|------|
| **A-Speed 高性能部署** | 基于阿里云 AI Stack A-Speed 加速套件，提供深度优化的加速镜像 |
| **自定义配置部署** | 灵活配置 CPU、内存、GPU 数量、显存、共享内存等 |
| **GPU 虚拟化** | 支持 GPU 共享模式（算力/显存隔离）和 GPU 独享模式 |
| **多厂商 GPU** | 支持 **APG、Ascend、Nvidia** 三种 GPU 厂商 |
| **KVCache 加速** | Qwen3-235B 模型支持 KVCache 加速和 APFS 存储 |

**性能数据**（官方用户指南）：
- 单机即可运行 DeepSeek 无损精度满血版
- 推理性能较开源社区版本提升 **50%**

### 4.1a Qwen3-Pro 专属优化模型

AI Stack V2.14.0 新增 **Qwen3-Pro** 专有优化模型：

| 对比项 | Qwen3-Pro | Qwen3-VL-235B（开源版） |
|---------|-----------|----------------------|
| **整机总吞吐（1K/1K）** | 34200 Token/秒 | 17900 Token/秒 |
| **支持并发（1K/1K）** | 2048 并发 | 1024 并发 |
| **整机总吞吐（2K/2K）** | 27300 Token/秒 | 13900 Token/秒 |
| **支持并发（2K/2K）** | 1600 并发 | 800 并发 |
| **单机/集群推理性能** | **Qwen3-VL-235B 的 1.9 倍** | 基准线 |

Qwen3-Pro 效果与 Qwen3-VL-235B 持平，性能翻倍。原生支持 256K 上下文，可扩展至 1M。提供 Instruct 和 Thinking 版本。仅支持在专有云 APG 上输出。

### 4.1b 模型网关（Synapse）

AI Stack 内置模型网关，提供推理服务负载均衡和流量调度：

| 功能 | 说明 |
|------|------|
| **负载均衡策略** | 轮询、IP 哈希、最少连接、随机 |
| **API-Key 鉴权** | Synapse 网关 API-Key 鉴权，创建后不可关闭 |
| **单机/多机隔离** | 单机版和多机版网关信息互相不可见 |

### 4.1c 安全与权限架构

AI Stack 采用**单租户架构**，所有硬件资源与软件服务栈归属单一用户。基于 RBAC 的权限访问控制，遵循三权分立原则：

| 角色 | 数量 | 权限 |
|------|------|------|
| **管理员** | 1 个 | 远程登录、提交镜像、部署在线服务、创建/管理用户 |
| **安全管理员** | 1 个 | 禁用管理员、创建/管理用户，一经创建无法删除 |
| **审计管理员** | 1 个 | 审计日志权限，一经创建无法删除 |
| **应用管理员** | 多个 | 查看模型/镜像列表、使用运行中的服务、修改自身密码 |

---

> 以下内容为通用 LLM 推理技术知识（MLA/FlashMLA/FlashInfer/MTP/KV Cache），属于行业通用知识背景，非 AI Stack 产品特有功能。AI Stack 的实际推理框架为上述 A-Speed 加速套件。

### 4.2 MLA：Multi-head Latent Attention 深度解析

> **核心概念**：MLA 是 DeepSeek 提出的注意力压缩架构，通过低秩 KV 联合压缩将 KV Cache 显存占用降低 **7-28×**，是 DeepSeek V2/V3/R1 系列模型能经济化部署 128K-1M 上下文的关键技术。

#### 4.2.1 问题背景：KV Cache 显存墙

标准 Multi-Head Attention (MHA) 在长上下文推理时面临严峻的显存挑战。以 DeepSeek-V3 为例（61 层、7168 维嵌入、128K 上下文窗口）：

```
KV Cache 显存 = 128K tokens × 61 layers × 2 vectors/layer × 7168 values/vector × 2 bytes/FP16
             ≈ 213.5 GB  ← 超过模型参数本身！
```

业界演进路线：

| 架构 | 压缩比 | 质量退化 | 代表模型 |
|------|--------|----------|----------|
| **MHA** (Multi-Head Attention) | 1× 基线 | 无 | GPT-4、早期 LLaMA |
| **MQA** (Multi-Query Attention) | ~32× | -1~3 pts | Falcon-40B |
| **GQA** (Grouped-Query Attention) | 4-8× | <0.5 pt | Llama 3.x、Qwen 2.x、Mistral |
| **MLA** (Multi-head Latent Attention) | **7-28×** | **<0.2 pt** | **DeepSeek V2/V3/R1/V4** |
| **SWA** (Sliding-Window Attention) | 恒定 | 丢失长程 | Mistral 7B (4K window) |

#### 4.2.2 MLA 技术原理

MLA 的核心创新是**低秩 KV 联合压缩**（Low-Rank Joint KV Compression），类似 LoRA 的降维-升维思路：

```
标准 MHA：  x → W_k → Key,  x → W_v → Value    (缓存完整 K、V)
MLA：       x → W_dkv → c_latent (512维)          (仅缓存压缩后的潜在向量)
                     ↓
            c_latent → W_uk → Key    (推理时按需重建)
            c_latent → W_uv → Value  (推理时按需重建)
```

**关键设计**：
- **共享降维矩阵** `W_dkv`：Key 和 Value 共用同一个压缩矩阵，将 token 嵌入从 7168 维压缩到 512 维
- **独立升维矩阵** `W_uk`、`W_uv`：分别将潜在向量重建为 Key 和 Value
- **RoPE 解耦**：位置编码（RoPE）部分不做压缩，单独存储 64 维 BF16（128 字节），保证位置信息精度

**DeepSeek-V3 KV Cache 对比**：

| 方案 | 每 token 每层存储 | 128K 上下文总 KV Cache |
|------|-------------------|----------------------|
| 标准 MHA | 14,336 values (28.7 KB) | **213.5 GB** |
| MLA (仅 latent) | 512 values (1.0 KB) | **7.6 GB** |
| MLA + FP8 KV Cache | ~576 bytes | **~3.8 GB** |
| **压缩比** | — | **28× (纯 MLA) / 56× (MLA+FP8)** |

#### 4.2.3 MLA 在推理框架中的应用（通用知识）

FlashMLA 算子库针对 MLA 架构提供全链路优化（通用技术，非 AI Stack 特有）：

- **Prefill 阶段**：Token-level Sparse Attention，prefill 峰值达 **640 TFLOPS**（H800 SXM5）
- **Decode 阶段**：Dense MLA Decoding，内存带宽达 **3000 GB/s**，计算峰值 **660 TFLOPS**
- **FP8 KV Cache**：每 token KV Cache 仅 656 字节（512B 量化 NoPE + 16B 缩放因子 + 128B RoPE），精度退化 <0.3 pt

### 4.3 FlashMLA 算子库

FlashMLA 是 DeepSeek 开源的高效注意力算子库（[GitHub](https://github.com/deepseek-ai/FlashMLA)），为 DeepSeek V3/V3.2 系列模型提供推理加速内核。

#### 4.3.1 算子矩阵

| 算子类型 | 适用阶段 | GPU 架构 | KV Cache 格式 | 性能峰值 |
|----------|----------|----------|--------------|----------|
| Dense MLA Decoding | Decode | SM90 (H800) | BF16 | 3000 GB/s 带宽, 660 TFLOPS |
| Sparse MLA Decoding | Decode | SM90 + SM100 | FP8 | 410 TFLOPS (H800), 350 TFLOPS (B200) |
| Dense MHA Prefill | Prefill | SM100 (B200) | BF16 | 1460 TFLOPS (fwd), 1000 TFLOPS (bwd) |
| Sparse MLA Prefill | Prefill | SM90 + SM100 | BF16 | 640 TFLOPS (H800), 1450 TFLOPS (B200) |

#### 4.3.2 国产算力适配（通用生态）

FlashMLA 已被多个国产芯片平台移植，形成广泛的异构算力生态（行业通用，非 AI Stack 特有）：

| 芯片平台 | 适配方 | 项目 |
|----------|--------|------|
| **海光 DCU** | Hygon | OpenDAS/MLAttention |
| **摩尔线程** | Moore Threads | MooreThreads/MT-flashMLA |
| **沐曦 MetaX** | MetaX | MetaX-MACA/FlashMLA |
| **燧原** | Intellifusion | Intellifusion/tyllm |
| **天数智芯** | Iluvatar Corex | Deep-Spark/FlashMLA |
| **AMD Instinct** | AMD | AITER/MLA |

> **AI Stack 关联说明**：AI Stack 支持 APG、Ascend、Nvidia 三种 GPU 厂商，但上述 FlashMLA 国产适配是行业生态，非 AI Stack 特有功能。

### 4.4 FlashInfer：通用注意力推理引擎

FlashInfer 是面向 LLM Serving 的可定制注意力引擎（[GitHub](https://github.com/flashinfer-ai/flashinfer)），获得 **MLSys 2025 最佳论文**，由 NVIDIA 主导开发并开源。

**核心能力**：

| 特性 | 说明 |
|------|------|
| **Block-Sparse KV Cache** | 支持分页式 KV Cache 存储，兼容 vLLM PagedAttention 和 SGLang RadixAttention |
| **多注意力变体** | 统一 API 支持 MHA/GQA/MQA/MLA/SWA 等全部注意力架构 |
| **Prefill/Decode/Append 三阶段** | 针对推理不同阶段分别优化的内核 |
| **多硬件支持** | NVIDIA (SM80-SM100)、AMD、Intel 等多架构 |

**Prefill vs Decode vs Append 性能分析**：
- **Prefill**（处理输入 prompt）：计算密集型，大矩阵运算，FlashInfer 通过 Tiling + Shared Memory 优化
- **Decode**（逐 token 生成）：内存带宽受限型，FlashInfer 通过合并读写、减少 HBM 访问优化
- **Append**（KV Cache 写入）：Append 与 Attention 融合执行，减少中间结果写回

> **与 FlashMLA 的关系**：FlashMLA 专门优化 MLA 架构（DeepSeek 系列），FlashInfer 是通用注意力引擎支持所有架构。两者均为行业开源项目，非 AI Stack 特有。

### 4.5 MTP：Multi-Token Prediction 投机解码

MTP 是 DeepSeek-V3 提出的训练目标创新，同时在推理阶段可作为**投机解码**（Speculative Decoding）的加速手段。

#### 4.5.1 训练阶段 MTP

标准 Transformer 训练只预测 next token（NTP），MTP 增加辅助预测头同时预测 next + next-next token：

```
标准 NTP：  h_t → predict(t+1)                 # 每 token 1 个训练信号
DeepSeek MTP：h_t → predict(t+1) + predict(t+2)  # 每 token 2 个训练信号
```

**价值**：从训练数据中提取更多信息 per token，提升训练效率和模型质量。

#### 4.5.2 推理阶段 MTP 投机解码

MTP 训练的辅助头在推理时可作为 draft model，实现无需外部小模型的投机解码：

```
1. MTP 辅助头快速生成 k 个候选 token（draft）
2. 主模型一次前向传播并行验证所有候选（verify）
3. Rejection Sampling 决定接受/拒绝
   - 贪心策略：完全匹配则接受
   - 概率策略：P_target / P_draft ≥ U(0,1) 则接受
4. 接受的 token 直接输出，被拒绝的位置重新采样
```

**性能收益**：
- 接受率通常 >85%，每步可输出 1+k 个 token
- 相比标准自回归解码，**吞吐提升 2-3×**，且不改变输出分布
- DeepSeek-V3 原生支持 MTP=1（单 token 投机），可扩展到 MTP>1

**vLLM 集成配置**：
```bash
# 启用 MTP 投机解码
--speculative_config '{
  "method": "mtp",
  "num_speculative_tokens": 1,
  "disable_padded_drafter_batch": false
}'
```

> **限制**：DeepSeek 仅暴露单层 MTP 权重，MTP≥3 时精度和性能保障不足；当前算子限制 MTP 最大值为 15。

### 4.6 KV Cache 优化技术全景

> **核心认知**：2026 年生产环境推理中，KV Cache 是最大的成本变量。超过 128K 上下文时，KV Cache 显存占用超过模型参数本身。

#### 4.6.1 KV Cache 显存增长规律

| 模型 · 上下文 · 注意力 · 精度 | KV Cache 大小 | 备注 |
|------|------|------|
| Llama 70B · 8K · MHA · FP16 | 1.0 GB | 标准短上下文 |
| Llama 70B · 32K · MHA · FP16 | 4.3 GB | 生产常见上下文 |
| Llama 70B · 128K · MHA · FP16 | 17.3 GB | 长上下文生产上限 |
| Llama 70B · 1M · MHA · FP16 | **135 GB** | 超过参数本身（140GB） |
| Llama 70B · 1M · GQA · FP8 | 17 GB | -87% |
| DeepSeek V4-Pro · 1M · MLA · FP8 | **8 GB** | **-94%** |

#### 4.6.2 五大优化技术族

```
KV Cache 优化技术全景
│
├── 1. PagedAttention（底层基础，必选）
│   └── 将 KV Cache 按 page block 分页管理，消除显存碎片
│       显存利用率从 50-65% → 95%+
│       vLLM / SGLang / TensorRT-LLM 均已默认启用
│
├── 2. 前缀缓存（应用层最高杠杆）
│   ├── vLLM Automatic Prefix Caching (APC)
│   │   └── 基于哈希的精确前缀匹配，缓存命中率 60-85%
│   ├── SGLang RadixAttention
│   │   └── 基数树结构，支持分支前缀匹配，多轮对话/Agent 场景最优
│   └── 命中率 60-85% 时，每次调用成本降低 5-12×
│
├── 3. 注意力架构压缩（模型选择决定）
│   ├── MQA: 32× 压缩，质量退化 1-3 pt
│   ├── GQA: 4-8× 压缩，2026 默认架构
│   └── MLA: 7-14× 压缩，<0.2 pt 退化，2026 SOTA
│
├── 4. KV Cache 量化（免费午餐，必开）
│   ├── FP8 KV Cache: 50% 内存减少，精度退化 0.3-0.7 pt
│   └── INT8 KV Cache: 50% 内存减少，精度退化 1.5-3 pt
│
└── 5. 滑动窗口注意力（特定场景）
    └── 仅关注最近 W 个 token，KV 内存恒定
        适合局部推理，不适合长文档 Q&A
```

**叠加效应**：MLA + FP8 + Prefix Cache 三者叠加可实现 **4-40×** 的长上下文推理成本压缩。

#### 4.6.3 场景化选型建议

| 场景 | 推荐技术栈 |
|------|------------|
| 长文档 Q&A（静态参考） | Paged + Prefix Cache (24h TTL) + FP8 KV + GQA/MLA |
| 多租户 SaaS 知识库 | SGLang RadixAttention + Per-tenant Cache Markers + FP8 KV |
| 长时间 Agent 循环 | Paged + Re-anchored Prefix Cache (30-50 turns) + FP8 KV |
| 高动态短上下文 | Paged + FP8 KV only（跳过 Prefix Cache） |

### 4.7 模型量化精度对比

AI Stack 支持多种精度推理（BF16/INT8/INT4），不同量化方案的权衡直接影响部署效率和模型质量。

#### 4.7.1 量化方案全景对比

| 方案 | 精度 | 显存占用 | 质量退化 | 适用场景 | 硬件要求 |
|------|------|----------|----------|----------|----------|
| **BF16** | 16-bit 浮点 | 100% 基线 | 无 | 精度敏感场景、PoC 验证 | 通用 GPU |
| **FP8 (E4M3)** | 8-bit 浮点 | ~50% | <1% | **2026 生产默认**，H100/H200/B200 原生支持 | Hopper/Blackwell |
| **INT8 (W8A8)** | 8-bit 整数 | ~50% | 1-2% | 无 FP8 硬件时的替代方案 | 通用 GPU |
| **INT4 (GPTQ)** | 4-bit 整数 | ~25% | 2-5% | 消费级 GPU 部署 | 通用 GPU |
| **INT4 (AWQ)** | 4-bit 激活感知 | ~25% | 1-3% | 比 GPTQ 更好的质量 | 通用 GPU |
| **NF4 (QLoRA)** | 4-bit 正态浮点 | ~25% | 1-2% | 训练时量化（QLoRA） | 通用 GPU |

#### 4.7.2 AI Stack 量化推理策略

```
AI Stack 量化推理决策树
│
├── 精度优先 → BF16（满血推理，16 卡旗舰版首选）
│
├── 均衡推荐 → FP8（H800 原生支持，几乎无损，2× 吞吐提升）
│   └── FlashMLA FP8 KV Cache：每 token 仅 656 Bytes
│
├── 极致性价比 → INT4 AWQ（4× 内存压缩，适合 2/4 卡入门版）
│
└── 训练微调 → NF4 QLoRA（4-bit 量化 + LoRA 适配器，最小显存训练）
```

### 4.8 训推一体架构（行业趋势参考）

> **纠偏说明**: 官方用户指南（V2.14.0）中 AI Stack 主要定位为**推理平台**，提供模型部署、在线服务、模型体验等功能。未明确提及 LoRA/QLoRA/全参数微调、模型蒸馏等训练能力。以下内容更多是行业趋势参考，非 AI Stack 官方确认功能。

```
AI Stack 训推统一资源池
│
├── 训练模式
│   ├── 模型微调（LoRA/QLoRA/全参数微调）
│   ├── 模型蒸馏（大模型 → 小模型知识迁移）
│   └── 模型性能评估测试
│
├── 推理模式
│   ├── 一键模型部署拉起
│   ├── 支持第三方模型镜像
│   └── 多种精度推理（BF16/INT8/INT4）
│
└── 资源管理
    ├── 用户 - 空间 - 资源池 三级管理
    ├── 训推统一资源池，秒级切换
    └── 企业级 GPU 资源管理
```

#### 4.8.1 训推一体的业界背景

传统方案将训练和推理分配到**独立的 GPU 集群**，导致双重低效：

| 问题 | 独立部署（Separate） | 训推一体（Unified） |
|------|---------------------|---------------------|
| **推理空闲** | 低峰期 GPU 利用率 ~13%（LMSYS 实测） | 空闲算力自动转为训练 |
| **训练气泡** | 流水线并行产生 pipeline bubble ~30% | 气泡期填充推理请求 |
| **模型同步** | 周期性跨集群同步，延迟数分钟 | 训练更新即时生效（on-the-fly） |
| **资源总量** | 需两套独立集群 | 统一资源池，总体节省 30-50% |

**学术前沿**：LeMix（UC Riverside, 2025）提出细粒度训推共置调度框架，在 8×A100 集群上实现：
- 吞吐量提升 **3.53×**
- 推理 loss 降低 **0.61×**
- SLO 达标率提升 **2.12×**

#### 4.8.2 AI Stack 实际能力（基于官方指南）

AI Stack 的实际核心功能是**推理服务部署与管理**：

- **在线服务**：支持一键部署模型，多种精度（BF16/INT8/INT4）
- **模型仓库**：管理模型文件，支持系统模型和自定义模型
- **镜像库**：管理容器镜像，支持系统镜像和自定义镜像
- **模型网关**：负载均衡、流量调度、API-Key 鉴权
- **模型体验**：文本模型、视觉模型、知识库、RAG 应用
- **多机集群**：支持创建/扩容/缩容多机集群

### 4.9 CUDA 兼容性与异构算力（待确认）

> **纠偏说明**: 以下关于 CUDA 兼容性和异构算力适配的具体数据（训练+30%、推理+80%）来源于营销材料，官方用户指南中未提供具体验证数据。AI Stack 官方确认支持 APG、Ascend、Nvidia 三种 GPU 厂商。

#### 4.9.1 CUDA 兼容性

- **高度兼容 CUDA API**，CUDA 应用代码无需修改
- 可直接使用 CUDA API 和 NVCC 编译命令行
- 降低从 NVIDIA 生态迁移的技术门槛

#### 4.9.2 国产异构算力适配

AI Stack 的核心差异化能力之一是**异构 GPU 集群**的统一纳管与优化：

| 优化层次 | 技术手段 | 效果 |
|----------|----------|------|
| **训推 I/O 调度** | 数据预取、流水线重叠、内存池化 | 减少 I/O 瓶颈 |
| **训推框架** | A-Speed 加速套件（适配国产芯片） | 推理性能接近 NVIDIA |
| **模型量化** | 针对国产芯片特性的量化策略 | 推理精度补偿 |
| **联合优化** | 三层协同，全局搜索最优配置 | **训练 +30%、推理 +80%** |

**异构集群调度最佳实践**：

```
异构 GPU 集群架构
│
├── 统一调度层
│   ├── GPU 能力画像：算力(TFLOPS)、显存(GB)、互联带宽
│   ├── 任务画像：计算密集/内存密集/通信密集
│   └── 智能匹配：按任务类型调度到最优 GPU 型号
│
├── 通信优化层
│   ├── 同构卡间：NVLink/HCCS 高速直连（700 GB/s）
│   ├── 异构卡间：RDMA over Converged Ethernet (RoCE)
│   └── 跨节点：1.6T 无拥塞网络 + 拓扑感知路由
│
└── 容错层
    ├── GPU 故障自动检测与隔离
    ├── Checkpoint 定期持久化（防故障丢失）
    └── 故障节点自动替换 + 任务重调度
```

> **关键指标**：AI Stack 16 卡版机间通信带宽达 **1.6T**，采用低时延无拥塞网络设计，支撑多机多卡训练与跨节点分布式推理。

---

## 5. 功能架构（基于官方用户指南）

> **纠偏说明**: 官方用户指南中未出现“百炼专属版”作为 AI Stack 内置功能。百炼专属版是独立的生态方案。本节描述 AI Stack 实际功能架构。

AI Stack 功能架构从上至下分为三层：

```
AI Stack 功能架构
│
├── 上层：控制台页面
│   ├── 可视化操作界面，用户管理、告警、节点监控、模型部署
│   └── 通过 API 与中层交互，轻量化设计
│
├── 中层：管控层
│   ├── 鉴权、监控告警、数据库管理、服务生命周期调度
│   └── 承上启下：用户请求 → 可执行指令，底层状态 → 用户反馈
│
└── 下层：资源层
    ├── GPU 资源分配、模型存储、容器实例启停
    ├── 单租户架构，所有资源归属单一用户
    └── 所有模型服务以 containerd 容器形式部署
```

### 5.1 推理服务

| 功能模块 | 说明 |
|----------|------|
| **模型网关** | 负载均衡、流量调度、API-Key 鉴权（Synapse） |
| **模型仓库** | 管理模型文件，预置系统模型，支持自定义模型 |
| **镜像库** | 管理容器镜像，预置深度优化镜像，支持自定义 |
| **在线服务** | 大模型在线部署，支持 A-Speed 高性能/自定义配置 |
| **模型观测** | Token 消耗、首 Token 延时、并发数据监控 |

### 5.2 模型体验

| 功能 | 说明 |
|------|------|
| **文本模型** | 文本问答，支持多模型对比（最多 3 个） |
| **视觉模型** | 多模态视觉问答（如 Qwen2.5-VL-72B） |
| **知识库** | 支持 doc/docx/pdf/txt，智能切分，Embedding + 排序 |
| **RAG 应用** | 基于知识库的检索增强生成应用 |

### 5.3 应用中心

| 功能 | 说明 |
|------|------|
| **应用商店** | 预置应用模板 |
| **我的应用** | 用户自建应用管理 |
| **容器集群管理** | 底层 K8s 集群管理 |
| **授权信息** | License 和授权管理 |

### 5.4 系统管理

- **用户管理**：RBAC 四角色（管理员/安全管理员/审计管理员/应用管理员）
- **操作日志**：完整操作审计
- **API Token / 网关 API Key 管理**
- **支持 AzureAD 登录**（通过 SAML2 SSO）
- **多语言**：简体中文 / English / 繁体中文

### 5.5 监控运维

| 功能模块 | 说明 |
|----------|------|
| **节点监控** | CPU 使用率、内存使用率、负载等基础信息监控 |
| **GPU 监控** | GPU 使用率、温度、功率等实时数据 |
| **告警管理** | P1-P4 四级告警，支持告警列表和告警通知 |
| **安全规则** | 网络安全规则配置，控制主机最小粒度暴露和访问 |
| **CPN 监控** | 多机集群网络监控 |
| **SYSLOG 日志** | 系统日志管理 |

### 5.6 网络安全架构

AI Stack 应运行于物理隔离的内部局域网，不支持直接/间接暴露在互联网。默认访问矩阵：

| 方向 | 端口范围 | 用途 | 安全控制 |
|------|----------|------|----------|
| 从外到内 | 30000-35000 | 模型服务运行端口 | 开启 Token 认证，建议信任网络使用 |
| 从外到内 | 80 | 控制台访问 | 应用平台账户密码认证，严格限制暴露 |
| 从外到内 | 22 | SSH 访问 | 系统主机账户密码，严格限制暴露 |
| 从内到外 | 默认拒绝所有 | 防止被反向控制 | 多机场景需额外开放 80/22/30000-35000 |

### 5.7 日志体系

| 日志类型 | 存储路径 | 限制 |
|----------|----------|------|
| **管控与监控日志** | `/usr/bin/aioController/log` | 单文件 100MB，最多 40 个文件（4GB），滚动覆盖 |
| **系统安装日志** | `/usr/local/aio_clonescripts/aio_clone.log` | 记录部署/安装/配置操作 |
| **运行日志** | 执行 `aio-ops start` 时目录 | 支持 GPU/OS/内存/磁盘/硬件健康检查 |

---

## 6. 模型生态（基于官方用户指南 V2.14.0）

> **纠偏说明**: 以下模型列表基于官方用户指南附录，替换原来不完整的营销版本信息。

### 6.1 Qwen 系列

| 模型 | 说明 |
|------|------|
| **Qwen3-Pro-Instruct-INT8** | 专有优化，性能为开源版 1.9 倍 |
| **Qwen3-Pro-VL-Instruct-INT8** | 专有优化多模态版本 |
| Qwen3.6-27B / Qwen3.6-35B-A3B / Qwen3.6-Plus-INT8 | 最新版本 |
| Qwen3.5-122B-A10B / Qwen3.5-397B-A17B | MoE 架构 |
| Qwen3-235B-A22B / INT8 / Instruct-2507 | 235B 大模型 |
| Qwen3-32B | 中等规模 |
| Qwen3-Coder-480B-A35B-Instruct / INT8 | 代码专用 |
| Qwen3-Embedding-8B | 嵌入模型 |
| Qwen2.5-32B / Qwen2.5-72B | 上一版本 |
| QwQ-32B | 推理模型 |
| Qwen-Image | 图像模型 |

### 6.2 DeepSeek 系列

| 模型 | 说明 |
|------|------|
| DeepSeek-R1-0528-BF16 / INT8 | 最新 R1 版本 |
| DeepSeek-V3.2-BF16 / INT8 | 最新 V3 版本 |
| DeepSeek-V3.1-INT8 | V3.1 |
| DeepSeek-V3-0324-BF16 / INT8 | V3 基础版 |
| DeepSeek-V4-Flash-INT8 | V4 Flash 版本 |
| DeepSeek-R1-Distill-Qwen-32B | R1 蒸馏版 |

### 6.3 其他厂商模型

| 厂商 | 模型 |
|------|------|
| **Moonshot** | Kimi-K2.5、Kimi-K2.6 |
| **ZhipuAI** | GLM-5.1-INT8、GLM5-INT8、GLM-5.1-W4A8 |
| **MiniMax** | MiniMax-M2.7-INT8 |
| **BAAI** | bge-reranker-v2-m3（重排序模型） |

### 6.4 星河计划

阿里云通过 AI 大模型**“星河计划”**，与深耕行业多年的合作伙伴一起，为企业提供个性化的 AI 交付与服务。

---

## 7. 百炼专属版生态方案

> **纠偏说明**: 百炼专属版不是 AI Stack 内置功能，而是与 AI Stack 配套的独立生态方案。以下信息来源于营销材料，非官方用户指南内容。

| 版本 | 定位 | 核心功能 |
|------|------|----------|
| **MINI** | 开箱即用 RAG 应用 | 深度思考 + 联网搜索 + 文档 RAG + 多模态问答 |
| **Lite** | 轻量智能体平台 | 多模态多智能体 + 知识数据中心 + 工作流编排 |
| **标准版** | 全栈 AI 平台 | 大模型全栈工具 + 异构 GPU 集群 + 训推加速 |

---

## 8. 权威认证与行业落地

> **纠偏说明**: 以下认证和案例信息来源于营销材料，非官方用户指南内容。

### 8.1 IDC 六项满分（2025）

IDC 发布《中国 AI 训推一体机技术能力评估，2025》报告，阿里云在 6 项评估维度获得满分。

> **注意**: 该评测中的“推理能力”维度提到了“ASLLM 自研推理框架”，但官方用户指南中实际产品名称为 A-Speed 加速套件。

### 8.2 国家级认证

| 认证机构 | 认证项目 |
|----------|----------|
| **中国电子技术标准研究院** | "云上部署 DeepSeek 验证测试"（首批通过） |
| **中国信通院** | 《AI 大模型一体机技术能力要求》测评 |
| **中国信通院** | 《面向大模型的智算一体化解决方案评估》 |
| **中国信通院** | 《大模型一体机安全能力要求》评估 |

---

### 8.3 行业落地案例

| 行业 | 案例 | 效果 |
|------|------|------|
| **政务** | 某省卫健委 | 单机本地化部署大模型，实现医疗数据治理与公共卫生决策智能化 |
| **金融** | 多个头部金融机构 | 本地部署模型，探索智能编码、AI 与金融服务融合等创新应用 |
| **制造** | 合作伙伴 | 基于钉钉·AI Stack 场景化一体机，加速生产/销售/研发/管理数智化 |
| **医疗** | 某综合三甲医院 | AI Stack + 百炼专属版 Lite 建设 AI 中台，落地"智能问数"场景 |
| **能源** | 能源行业客户 | Qwen/DeepSeek 等模型测试部署和服务上线 |
| **教育** | 教育机构 | 大模型开箱即用，服务教学科研 |

---

## 9. 与飞天企业版的关系

### 9.1 定位区分

```
阿里云全栈 AI 体系
│
├── AI Stack（轻量级 AI 推理一体机）
│   ├── 定位：私有化大模型推理一体机
│   ├── 特点：轻量化、高性价比、开箱即用
│   ├── 规模：单机 ~ 多机集群
│   └── 场景：快速部署大模型推理/RAG/模型体验/应用中心
│
├── 飞天企业版 Apsara Stack（全栈云平台）
│   ├── 定位：企业级私有云平台
│   ├── 特点：完整云服务能力（计算/存储/网络/安全/大数据/AI）
│   ├── 规模：数百 ~ 数千节点
│   └── 场景：全面数字化转型、大规模业务支撑
│
└── 云边一体
    └── AI Stack + Apsara Stack = 完整云边一体解决方案
        AI Stack 可被飞天企业版纳管，形成边缘 AI 能力
```

### 9.2 协同关系

- AI Stack 可以**独立部署**，作为轻量级 AI 推理一体机使用
- AI Stack 可以**被飞天企业版纳管**，作为云平台的 AI 能力延伸
- Qwen3-Pro 支持 AI Stack 与飞天企业版平台承载

---

## 10. 竞品对比与选型

### 10.1 AI 推理一体机市场对比

| 维度 | 阿里云 AI Stack | 华为昇腾一体机 | 浪潮 AI 一体机 | 曙光 AI 一体机 |
|------|----------------|---------------|---------------|---------------|
| **核心优势** | 软硬一体 + 阿里生态 | 全栈自研（昇腾芯片） | 硬件制造经验 | 高性能计算积累 |
| **推理框架** | A-Speed 加速套件 | MindSpore Serving | 通用框架 | 通用框架 |
| **CUDA 兼容** | 高度兼容 | 需迁移适配 | 取决于 GPU | 取决于 GPU |
| **生态集成** | 钉钉/通义灵码/百炼 | 华为云生态 | 有限 | 有限 |
| **权威认证** | IDC 六项满分 | 多项认证 | 多项认证 | 多项认证 |
| **部署难度** | 开箱即用（小时级） | 天级 | 天级 | 天级 |

### 10.2 选型建议

| 场景 | 推荐方案 |
|------|----------|
| 轻量 PoC 验证 | AI Stack 2 卡版 |
| 中小企业推理 | AI Stack 4/8 卡版 |
| 大型企业推理 | AI Stack 16 卡版 + 集群扩展 |
| RAG 应用 | AI Stack + 百炼专属版 MINI |
| 智能体平台 | AI Stack + 百炼专属版 Lite/标准版 |
| 全栈云平台 | AI Stack + 飞天企业版 Apsara Stack |

---

## 11. 生产运维工具链

AI Stack 一体机交付后，日常生产环境涉及容器运行时、GPU 监控、模型管理、推理服务、训练启动、K8s 编排以及 AI Stack 专属工具。完整工具链已整理为专题：

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI Stack 生产工具链总览](./AI_Stack_Production_Toolchain.md) | 工具全景速查与生命周期流程图 | 所有 AI Stack 用户 |
| [容器与运行时](./AI_Stack_Container_Runtime_Guide.md) | nerdctl / crictl / ctr / docker / podman | SRE、平台工程师 |
| [GPU 监控](./AI_Stack_GPU_Monitoring_Guide.md) | nvidia-smi / ppu-smi / rocm-smi / pmon | 运维、性能工程师 |
| [模型下载与管理](./AI_Stack_Model_Management_Guide.md) | huggingface-cli / modelscope / git-lfs | 模型工程师 |
| [推理服务](./AI_Stack_Inference_Serving_Guide.md) | vLLM / SGLang / Ollama / llama-server | 推理工程师 |
| [训练启动器](./AI_Stack_Training_Launchers_Guide.md) | torchrun / accelerate / deepspeed / swift | 训练工程师 |
| [K8s 编排](./AI_Stack_K8s_Operations_Guide.md) | kubectl / helm | K8s 工程师 |
| [AI Stack 专属工具](./AI_Stack_Exclusive_Tools_Guide.md) | stackops / aioController | AI Stack 运维 |

---

## 参考资料

- [阿里云 AI Stack 产品页](https://www.aliyun.com/product/ai-stack)
- [百炼专属版 AI Stack 一体机方案](https://www.aliyun.com/solution/tech-solution/bailian-aistack/)
- [IDC《中国 AI 训推一体机技术能力评估，2025》](https://www.aliyun.com/analyst-reports/idc-aistack-2025)
- [AI Stack 加速大模型创新应用](https://ue.aliyun.com/news/20250401)
- [飞天企业版上新 AI Stack](https://ue.aliyun.com/news/20250303)
- [阿里云 AI Stack 选型与定价](https://www.aliyun.com/product/ai-stack/pricing)
- [FlashMLA: Efficient Multi-head Latent Attention Kernels (DeepSeek)](https://github.com/deepseek-ai/FlashMLA)
- [FlashInfer: Kernel Library for LLM Serving (MLSys 2025 Best Paper)](https://github.com/flashinfer-ai/flashinfer)
- [DeepSeek-V3 Technical Report](https://arxiv.org/abs/2412.19437)
- [KV Cache Optimization for LLMs 2026: Engineering Guide](https://www.digitalapplied.com/blog/kv-cache-optimization-techniques-2026-engineering-guide)
- [LeMix: Unified Scheduling for LLM Training and Inference on Multi-GPU Systems](https://arxiv.org/abs/2507.21276)
- [SGLang vs vLLM: Multi-Turn Conversations and KV Cache Reuse](https://www.runpod.io/blog/sglang-vs-vllm-kv-cache)
- [Multi Token Prediction (MTP) in vLLM](https://docs.vllm.ai/projects/ascend/zh-cn/v0.11.0/developer_guide/feature_guide/Multi_Token_Prediction.html)
- [IDC 发布 AI 大模型一体机市场分析与品牌推荐报告](https://my.idc.com/getdoc.jsp?containerId=prCHC53414025)

---

## Related

- [[架构基建/Architecture_Overview/AI_Infrastructure_2026]] — AI 基础设施全景
- [[部署推理/Inference_Engines/vLLM_Deep_Dive]] — vLLM 推理框架
- [[部署推理/Inference_Engines/SGLang_Deep_Dive]] — SGLang 推理框架
- [[大模型/Fine_tuning_Techniques/Fine_tuning_Strategies]] — 模型微调策略
- [[RAG系统/Advanced_RAG/RAG_Advanced_2026]] — RAG 高级技术
- [[大模型/Chinese_LLM_Ecosystem/README]] — 中国大模型生态
- [[部署推理/Caching/Speculative_Decoding_Advanced_2026]] — 投机解码高级技术（MTP 相关）
- [[部署推理/Caching/Prompt_Caching_and_KV_Cache_Optimization]] — KV Cache 优化全景

- [[_concepts/ai-hardware|AI 基础设施]] — AI 基础设施
- [[_concepts/model-deployment|LLM 部署]] — LLM 部署
- [[_concepts/multi-head-latent-attention]] — Multi-head Latent Attention (MLA)
- [[_concepts/model-deployment]] — 模型部署（KV Cache/PagedAttention/推测解码）
- [[_concepts/llm-infrastructure]] — LLM 基础设施（推理引擎全景）
- [[_concepts/kv-cache]] — KV Cache 显存墙与五大优化技术族
- [[_concepts/paged-attention]] — PagedAttention 虚拟内存式 KV 管理
- [[_concepts/radix-attention]] — RadixAttention 基数树前缀缓存
- [[_concepts/speculative-decoding]] — 投机解码（Draft-Verify / MTP）
- [[_concepts/continuous-batching]] — Continuous Batching 动态调度
- [[_concepts/prefix-caching]] — 前缀缓存复用
- [[_concepts/attention-variants]] — GQA/MQA/SWA 注意力变体
- [[_concepts/training-inference-unification]] — 训推一体架构
- [[_concepts/heterogeneous-gpu]] — 异构 GPU 集群纳管
- [[_concepts/flash-attention-kernels]] — FlashMLA / FlashInfer 算子引擎
- [[_concepts/rdma-roce]] — RDMA/RoCE 高速 GPU 网络
- [[_concepts/model-gateway]] — 模型网关（Synapse / LiteLLM / Kong AI）
- [[_concepts/rope]] — RoPE 旋转位置编码与长度外推
- [[_concepts/mixture-of-experts]] — MoE 混合专家模型（稀疏激活）
- [[_concepts/distributed-parallelism]] — 分布式并行策略（TP/PP/DP/EP）
- [[_concepts/gpu-virtualization]] — GPU 虚拟化（MIG/算力隔离）
- [[_concepts/tokenization]] — 分词与 Tokenization（BPE/SentencePiece）
- [[_concepts/embedding-models]] — 嵌入模型（GTE/bge/MTEB，RAG 检索基础）
- [[_concepts/rbac]] — RBAC 三权分立访问控制
- [[_concepts/prefill-decode]] — Prefill/Decode 推理阶段（TTFT/TPS）
- [[_concepts/knowledge-distillation]] — 知识蒸馏（Teacher-Student，DeepSeek-R1 蒸馏链）
- [[_concepts/mixed-precision]] — 混合精度（BF16/FP8/AMP）
- [[_concepts/gpu-interconnect]] — NVLink/GPU 互联（NVSwitch/HCCS）
- [[_concepts/lora-peft]] — LoRA/PEFT 参数高效微调
- [[_concepts/cuda-platform]] — CUDA 计算平台（Tensor Core/NVCC/cuDNN）
- [[_concepts/checkpoint]] — Checkpoint 检查点（分布式训练容错）
- [[_concepts/single-tenant-architecture]] — 单租户架构（物理级隔离）
- [[_concepts/sso-saml]] — SSO/SAML2 企业身份认证（AzureAD）
- [[_concepts/apsara-stack]] — 飞天企业版 Apsara Stack（全栈私有云）
- [[_concepts/model-registry]] — 模型仓库（版本管理、一键部署）
- [[_concepts/modelscope]] — ModelScope 魔搭（中文模型社区、SWIFT 微调）
- [[架构基建/AI_Stack_Production_Toolchain]] — AI Stack 生产工具链总览
- [[架构基建/AI_Stack_Container_Runtime_Guide]] — AI Stack 容器与运行时指南
- [[架构基建/AI_Stack_GPU_Monitoring_Guide]] — AI Stack GPU 监控指南
- [[架构基建/AI_Stack_Model_Management_Guide]] — AI Stack 模型下载与管理指南
- [[架构基建/AI_Stack_Inference_Serving_Guide]] — AI Stack 推理服务指南
- [[架构基建/AI_Stack_Training_Launchers_Guide]] — AI Stack 训练启动器指南
- [[架构基建/AI_Stack_K8s_Operations_Guide]] — AI Stack K8s 编排指南
- [[架构基建/AI_Stack_Exclusive_Tools_Guide]] — AI Stack 专属运维工具指南

- [[架构基建/README|架构与基础设施 (Architecture & Infrastructure)]]
