---
title: "GPUStack: 开源 GPU 集群管理与模型服务平台"
category: "10-deployment-inference"
tags: ["deployment", "inference", "serving", "gpustack", "gpu-cluster", "maas", "vllm", "llama.cpp"]
summary: "GPUStack 是面向企业级 AI 模型部署的开源 GPU 集群管理器（MaaS 平台），支持 NVIDIA/AMD/昇腾/摩尔线程等异构 GPU，通过 vLLM、SGLang、llama-box 等可插拔推理引擎提供 OpenAI 兼容的模型服务。"
created: "2026-06-15"
updated: "2026-06-25"
tier: supporting
aliases:
  - "Gpustack Deep Dive"
  - "GPUStack Deep Dive"
  - GPUStack_Deep_Dive
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# GPUStack: 开源 GPU 集群管理与模型服务平台

> **一句话理解**: GPUStack 是一个开源的 GPU 集群管理器 / 模型即服务（MaaS）平台，让你像使用 OpenAI API 一样，在私有或异构 GPU 集群上一键部署和运行 LLM、VLM、Embedding、Reranker、文生图、语音等 AI 模型。

---

## 目录

1. [概述](#1-概述)
2. [核心定位与适用场景](#2-核心定位与适用场景)
3. [架构设计](#3-架构设计)
4. [支持的硬件与运行环境](#4-支持的硬件与运行环境)
5. [支持的模型与模型目录](#5-支持的模型与模型目录)
6. [推理后端详解](#6-推理后端详解)
7. [安装与部署](#7-安装与部署)
8. [模型部署流程](#8-模型部署流程)
9. [调度与资源管理](#9-调度与资源管理)
10. [性能优化](#10-性能优化)
11. [企业级运维特性](#11-企业级运维特性)
12. [生态集成](#12-生态集成)
13. [对比与选型](#13-对比与选型)
14. [最佳实践与注意事项](#14-最佳实践与注意事项)

---

## 1. 概述

### 1.1 项目简介

```
GPUStack: Open-Source GPU Cluster Manager for AI Models
═══════════════════════════════════════════════════════════════════

定位: 开源 GPU 集群管理器 + 私有模型即服务 (MaaS) 平台

核心目标:
───────────────────────────────────────────────────────────────────
• 统一管理异构 GPU 资源 (NVIDIA / AMD / Apple / 昇腾 / 摩尔线程 ...)
• 一键部署多种 AI 模型 (LLM / VLM / Embedding / Reranker / 图像 / 语音)
• 自动选择并调优推理引擎 (vLLM / SGLang / llama-box / vox-box / MindIE)
• 提供 OpenAI 兼容 API, 无缝对接上层应用与 Agent 框架
• 支持从单卡桌面到多节点生产集群的弹性扩展
```

GPUStack 由 [gpustack/gpustack](https://github.com/gpustack/gpustack) 开源维护, 采用 **Apache-2.0** 许可证, 截至 2026 年 6 月在 GitHub 上已获得超过 5,000 stars, 用户覆盖 100 多个国家和地区。

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **异构 GPU 支持** | NVIDIA CUDA、AMD ROCm、Apple Metal、昇腾 CANN、海光 DTK、摩尔线程 MUSA、天数智芯 Corex、寒武纪 MLU 等 |
| **多推理引擎** | vLLM、SGLang、llama-box (llama.cpp + stable-diffusion.cpp)、vox-box、昇腾 MindIE, 并支持自定义后端 |
| **多版本后端共存** | 同一集群可运行同一推理引擎的多个版本, 满足新旧模型兼容性需求 |
| **Day-0 模型支持** | 新模型发布当天即可通过 Hugging Face / ModelScope / 本地路径部署 |
| **模型目录 (Model Catalog)** | 内置经 GPUStack 调优的验证模型集合, 按延迟 / 吞吐 / 标准模式预配置参数 |
| **分布式推理** | 单节点多卡、多节点多卡 (vLLM via Ray、llama-box 异构分布式) |
| **智能调度** | 自动评估模型兼容性、资源需求、OS 环境, 动态分配 GPU |
| **OpenAI 兼容 API** | 提供 Chat Completions、Embeddings、Images、Audio 等标准接口 |
| **企业级运维** | 用户 / API Key 管理、认证鉴权、负载均衡、自动故障恢复、Prometheus/Grafana 监控 |

---

## 2. 核心定位与适用场景

### 2.1 目标用户

```
GPUStack 用户画像
───────────────────────────────────────────────────────────────────
🏢 企业 IT / MLOps 团队      →  构建私有 MaaS, 替代公有模型 API
🔬 AI 研究团队               →  在异构 GPU 机群上共享推理资源
🤖 Agent / RAG 开发者        →  本地化部署 Embedding / LLM / Reranker
💻 个人开发者 / 极客          →  用 Mac + Windows PC + Linux 服务器组轻量集群
☁️ 云服务提供商               →  为客户提供 GPU 模型托管与多租户隔离
```

### 2.2 典型使用场景

| 场景 | 说明 |
|------|------|
| **私有 LLM 服务** | 在企业内网部署 Qwen、DeepSeek、Llama、Mistral 等, 替代调用外部 API |
| **RAG 与 Agent 底座** | 同时提供 LLM + Embedding + Reranker + TTS/STT 的统一推理入口 |
| **异构资源池化** | 将 Apple Silicon、NVIDIA、AMD、昇腾等不同芯片整合为单一可调度资源池 |
| **开发测试到生产过渡** | 开发阶段用 llama-box 快速验证, 生产阶段切换 vLLM / SGLang 高性能推理 |
| **多模态推理服务** | 部署 VLM (视觉语言模型)、Stable Diffusion / FLUX 图像生成、Whisper 语音 |

---

## 3. 架构设计

### 3.1 整体架构

GPUStack 采用 **Server-Worker** 分离架构, 管理面与推理面解耦:

```
GPUStack 架构概览
═══════════════════════════════════════════════════════════════════

                    ┌─────────────────────────────────────┐
                    │           客户端 / 应用层            │
                    │  Dify · LangChain · n8n · LlamaIndex │
                    │  OpenAI 兼容 API (HTTP/HTTPS)        │
                    └─────────────┬───────────────────────┘
                                  │
                    ┌─────────────▼───────────────────────┐
                    │         GPUStack Server             │
                    │  ┌─────────┐ ┌──────────┐          │
                    │  │API Server│ │ Scheduler│          │
                    │  └─────────┘ └──────────┘          │
                    │  ┌─────────┐ ┌──────────┐          │
                    │  │Controllers│ │AI Gateway│         │
                    │  └─────────┘ └──────────┘          │
                    │         ↕ SQL DB (PostgreSQL/MySQL) │
                    └─────────────┬───────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼────────┐      ┌─────────▼──────────┐    ┌────────▼───────┐
│  GPU Worker 1  │      │    GPU Worker 2    │    │  GPU Worker N  │
│ (NVIDIA/AMD/..)│      │   (昇腾/摩尔线程..)  │    │  (Apple Metal) │
│ ┌────────────┐ │      │ ┌────────────────┐ │    │ ┌────────────┐ │
│ │ GPUStack   │ │      │ │ GPUStack       │ │    │ │ GPUStack   │ │
│ │ Runtime    │ │      │ │ Runtime        │ │    │ │ Runtime    │ │
│ ├────────────┤ │      │ ├────────────────┤ │    │ ├────────────┤ │
│ │ Serving    │ │      │ │ Serving        │ │    │ │ Serving    │ │
│ │ Manager    │ │      │ │ Manager        │ │    │ │ Manager    │ │
│ ├────────────┤ │      │ ├────────────────┤ │    │ ├────────────┤ │
│ │ Inference  │ │      │ │ Inference      │ │    │ │ Inference  │ │
│ │ Server     │ │      │ │ Server         │ │    │ │ Server     │ │
│ │(vLLM/SGLang)│ │      │ │(MindIE/llama-box)│   │ │(llama-box) │ │
│ └────────────┘ │      │ └────────────────┘ │    │ └────────────┘ │
└────────────────┘      └────────────────────┘    └────────────────┘
```

### 3.2 核心组件

| 组件 | 部署位置 | 功能 |
|------|----------|------|
| **API Server** | Server | 提供 RESTful API、Web UI, 处理认证与鉴权 |
| **Scheduler** | Server | 根据资源、兼容性、策略为模型实例分配合适的 Worker/GPU |
| **Controllers** | Server | 管理模型实例的生命周期、扩缩容、滚动更新 |
| **AI Gateway** | Server | 基于 Higress 实现请求路由、负载均衡、限流 |
| **SQL Database** | Server | 默认嵌入式 PostgreSQL, 可外接 PostgreSQL/MySQL |
| **GPUStack Runtime** | Worker | 探测 GPU 设备、管理容器运行时、部署模型实例 |
| **Serving Manager** | Worker | 管理本节点上模型实例的启动、停止、健康检查 |
| **Metric Exporter** | Worker | 暴露 GPU 利用率、模型实例性能、Token 用量等指标 |
| **Inference Server** | Worker | 实际执行推理的后端进程 (vLLM / SGLang / llama-box 等) |
| **Ray** | Worker | 按需拉起 Ray 集群, 支撑 vLLM 多节点分布式推理 |

---

## 4. 支持的硬件与运行环境

### 4.1 操作系统与架构

| OS | 验证版本 | 说明 |
|----|----------|------|
| **Linux** | Ubuntu ≥20.04, Debian ≥11, RHEL/Rocky ≥8, Fedora ≥36, openSUSE ≥15.3, openEuler ≥22.03 | Worker 生产环境首选 |
| **macOS** | ≥ 14 | 主要用于 llama-box 推理, 可作为 Server 或 Worker |
| **Windows** | 10 / 11 | 可通过脚本安装, 部分后端 CPU-only 支持 |

架构支持 **AMD64** 与 **ARM64**。Linux Worker 要求 GLIBC ≥ 2.29, 否则建议使用 Docker 部署。

### 4.2 支持的加速器

| 加速器 | 运行时 | 典型后端 |
|--------|--------|----------|
| **NVIDIA GPU** | CUDA (Compute Capability ≥ 6.0) | vLLM, SGLang, TensorRT-LLM, llama-box |
| **AMD GPU** | ROCm | vLLM, llama-box |
| **Apple Silicon** | Metal (M-series) | llama-box |
| **昇腾 (Ascend) NPU** | CANN | MindIE |
| **海光 DCU** | DTK | vLLM, llama-box |
| **摩尔线程 GPU** | MUSA | vLLM, llama-box |
| **天数智芯 Corex** | Corex | llama-box |
| **寒武纪 MLU** | 寒武纪驱动 | llama-box |

---

## 5. 支持的模型与模型目录

### 5.1 模型类型

GPUStack 支持的模型类型覆盖了当前主流生成式 AI 任务:

| 模型类型 | 典型代表 | 说明 |
|----------|----------|------|
| **LLM** | Qwen, DeepSeek, Llama, Mistral, Phi, Gemma | 大语言模型, 支持文本生成、工具调用 |
| **VLM** | Llama 3.2-Vision, Pixtral, Qwen2.5-VL, LLaVA, InternVL3 | 视觉语言模型, 支持图文输入 |
| **Embedding** | BGE, BCE, Jina, Qwen3-Embedding | 文本向量化 |
| **Reranker** | BGE, BCE, Jina, Qwen3-Reranker | 重排序模型 |
| **文生图 / 图生图** | Stable Diffusion, FLUX | 基于 stable-diffusion.cpp |
| **语音 (STT)** | Whisper | 语音转文本, 通过 vox-box |
| **语音 (TTS)** | CosyVoice | 文本转语音, 通过 vox-box |

### 5.2 模型来源

1. **Hugging Face** — 默认海外模型源
2. **ModelScope** — 国内镜像源, GPUStack 会根据网络自动选择最优下载源
3. **本地路径** — 支持挂载本地模型目录, 适用于离线或私有化场景

### 5.3 模型目录 (Model Catalog)

```
模型目录设计
═══════════════════════════════════════════════════════════════════

├── model_sets          # 经 GPUStack 验证和调优的模型集合
│   ├── DeepSeek R1 0528
│   ├── Qwen3
│   ├── Llama 4
│   └── ...
│   每个模型集包含:
│   ├── mode: latency / throughput / standard
│   ├── quantization: FP16 / FP8 / INT8 / GGUF
│   ├── backend: vLLM / SGLang / llama-box
│   ├── backend_parameters: 预调参数
│   └── gpu_filters: 兼容 GPU 约束
│
└── draft_models        # 投机解码专用 draft 模型
    └── 如 EAGLE3 系列
```

模型目录可通过 `--model-catalog-file` 自定义, 在气隙环境中可配置为 `local_path` 来源。

---

## 6. 推理后端详解

GPUStack 的核心设计之一是 **可插拔推理引擎**。部署模型时, 系统会根据模型格式、平台能力和模型类型自动选择后端, 用户也可手动指定。

### 6.1 自动后端选择逻辑

```
自动后端选择
───────────────────────────────────────────────────────────────────
模型是 GGUF 格式?         →  llama-box
模型是 TTS/STT 语音模型?   →  vox-box
昇腾 NPU 环境?            →  Ascend MindIE
其他 HuggingFace 格式?     →  vLLM (默认) / SGLang / TensorRT-LLM (可选)
```

### 6.2 后端对比

| 后端 | 基础引擎 | 最佳场景 | 支持平台 |
|------|----------|----------|----------|
| **llama-box** | llama.cpp + stable-diffusion.cpp | GGUF 模型、多模态、图像生成、异构分布式、跨平台 | Linux / macOS / Windows |
| **vLLM** | vLLM | 生产级高吞吐 LLM/VLM、单节点 / 多节点分布式 | Linux (最佳) |
| **SGLang** | SGLang | 极致性能、前缀缓存、结构化输出 | Linux |
| **vox-box** | 语音推理引擎 | TTS / STT 语音模型 | Linux / macOS / Windows |
| **Ascend MindIE** | 昇腾 MindIE | 昇腾 910B / 310P 上的 LLM 推理 | Linux (昇腾) |
| **TensorRT-LLM** | TensorRT-LLM | NVIDIA 低延迟推理 | Linux (NVIDIA) |
| **Custom Backend** | 用户自定义 | 特定框架或私有引擎 | 依赖镜像 |

### 6.3 llama-box 后端

llama-box 是 GPUStack 内置的通用推理后端, 基于 llama.cpp 和 stable-diffusion.cpp:

- **GGUF 格式**: 支持 Q2_K 到 Q8_0 等多种量化等级
- **多模态**: 自动匹配 `*mmproj*.gguf` 投影文件, 支持 LLaVA、Qwen2-VL、MiniCPM-V 等
- **异构分布式**: 允许不同品牌 GPU、不同 OS 的节点共同运行一个模型实例, 适合开发测试
- **CPU Offloading**: GPU 显存不足时自动将部分层卸载到 CPU

### 6.4 vLLM 后端

vLLM 是 GPUStack 在生产环境的主力后端:

- 支持 PagedAttention、Continuous Batching
- 支持单节点多 GPU (Tensor Parallelism) 和多节点分布式 (via Ray)
- 多节点分布式要求: Linux、同构硬件、Python 版本一致、模型文件在所有 Worker 同路径可访问

### 6.5 SGLang 后端

SGLang 提供 GPUStack 上的高性能推理选项:

- RadixAttention 前缀缓存, 显著降低多轮对话 TTFT
- 结构化输出 (JSON/Schema 约束解码)
- 适合高并发、低延迟、需要确定性输出的场景

---

## 7. 安装与部署

### 7.1 快速安装 (脚本方式)

#### Linux / macOS (Server + 嵌入式 Worker)

```bash
curl -sfL https://get.gpustack.ai | sh -s -
```

#### 仅安装 Server (不带 Worker)

```bash
curl -sfL https://get.gpustack.ai | sh -s - --disable-worker
```

#### 安装 Worker 加入集群

```bash
curl -sfL https://get.gpustack.ai | sh -s - \
  --server-url http://<gpustack-server> \
  --token <worker-token>
```

#### Windows (PowerShell 管理员)

```powershell
Invoke-Expression (Invoke-WebRequest -Uri "https://get.gpustack.ai" -UseBasicParsing).Content
```

### 7.2 Docker 快速部署

#### 启动 Server

```bash
sudo docker run -d --name gpustack \
  --restart unless-stopped \
  -p 80:80 \
  --volume gpustack-data:/var/lib/gpustack \
  gpustack/gpustack
```

#### 获取默认管理员密码

```bash
sudo docker exec gpustack cat /var/lib/gpustack/initial_admin_password
```

#### 添加 GPU Worker (Docker)

```bash
sudo docker run -d --name gpustack-worker \
  --restart=unless-stopped \
  --privileged \
  --network=host \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --volume gpustack-data:/var/lib/gpustack \
  --runtime nvidia \
  gpustack/gpustack \
  --server-url http://<gpustack-server> \
  --token <worker-token> \
  --advertise-address <worker-ip>
```

### 7.3 安装包选择

| 包名 | 包含后端 | 适用场景 |
|------|----------|----------|
| `gpustack[all]` | llama-box + vLLM + vox-box | 默认推荐 |
| `gpustack[vllm]` | llama-box + vLLM | 纯文本/多模态 LLM |
| `gpustack[audio]` | llama-box + vox-box | 语音场景 |

### 7.4 端口与网络

| 方向 | 端口 | 说明 |
|------|------|------|
| Server | 80 / 443 | UI 与 API |
| Worker | 10150 / 10151 | Worker 通信与指标 |
| Worker | 40000-40063 | 推理服务端口 |
| Worker | 40064-40095 | llama-box RPC 端口 |
| Ray (可选) | 40096-40103, 8265, 52365 | vLLM 多节点分布式 |

关键网络要求:
- Server → Worker: 代理推理请求
- Worker → Server: 注册与心跳
- Worker → Worker: 分布式推理通信

---

## 8. 模型部署流程

### 8.1 从模型目录部署

1. 登录 GPUStack UI
2. 进入 **Catalog** 页面
3. 选择模型 (如 Qwen3-0.6B)
4. 选择部署规格 (mode / quantization / backend)
5. 等待兼容性检查通过, 点击 **Save**
6. GPUStack 自动下载模型镜像与权重, 启动实例
7. 实例状态变为 **Running** 后即可通过 API 调用

### 8.2 从 Hugging Face / ModelScope 部署

在 **Models → Deploy** 中:
- 选择模型源: Hugging Face 或 ModelScope
- 填写模型 ID
- 选择后端与参数
- 指定 GPU / Worker / 副本数

### 8.3 本地路径模型

适用于离线环境或自有微调模型:
- 将模型文件放在 Worker 可访问的本地目录
- 部署时 Source 选择 **Local Path**
- 填写绝对路径, GPUStack 会加载并运行

### 8.4 OpenAI 兼容 API 调用

部署后, GPUStack 提供标准 OpenAI 兼容端点:

```bash
curl http://<gpustack-server>/v1/chat/completions \
  -H "Authorization: Bearer $GPUSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3-0.6b",
    "messages": [{"role": "user", "content": "你好, GPUStack!"}],
    "stream": false
  }'
```

---

## 9. 调度与资源管理

### 9.1 调度优先级

GPUStack 的自动调度遵循以下优先级 (v0.5+):

```
单 GPU 推理  >  单节点多 GPU 推理  >  多节点分布式推理
             >  CPU & GPU 混合推理  >  纯 CPU 推理
```

该策略优先使用高性能资源, 在资源不足时才降级到 CPU 推理。

### 9.2 调度约束条件 (vLLM 分布式)

自动调度多节点 vLLM 时需满足:

- 所有参与 Worker 为 Linux, Python 版本一致
- 各 Worker GPU 数量相同
- GPU 显存满足 `gpu_memory_utilization` (默认 0.9)
- GPU 总数能被 attention heads 数量整除
- 总 VRAM 声明大于估算 VRAM 需求

若不满足, 可手动选择 Worker/GPU 进行调度。

### 9.3 手动资源选择

对于特殊需求, GPUStack 允许:
- 指定运行模型的 Worker
- 指定具体 GPU
- 配置副本数与资源预留
- 设置 `system-reserved` 保留系统资源

### 9.4 多租户与隔离

- 用户管理: 支持多用户、角色、API Key
- API 认证: 基于 Bearer Token 的访问控制
- 资源隔离: 不同模型实例运行在独立容器/进程中
- 计量: Token 用量、请求速率、GPU 利用率统计

---

## 10. 性能优化

### 10.1 预调模式

GPUStack 为每个模型提供多种部署模式:

| 模式 | 优化目标 | 适用场景 |
|------|----------|----------|
| **Latency** | 降低首 token 延迟 (TTFT) | 交互式聊天 |
| **Throughput** | 提高整体吞吐量 | 批量处理、高并发 |
| **Standard** | 平衡延迟与吞吐 | 通用场景 |

模型目录中的模型已针对各模式预设 backend parameters。

### 10.2 投机解码

GPUStack 内置对多种投机解码算法的支持:

- **EAGLE3** — 基于 draft 模型并行生成未来 token
- **MTP (Medusa)** — 多头 draft 模型
- **N-grams** — 从已有上下文获取 draft token

配置方式: 在模型部署时选择对应的 draft model 或启用相关参数。

### 10.3 KV Cache 扩展

为降低长上下文场景下的 TTFT, GPUStack 支持对接外部 KV Cache 系统:

- **LMCache**
- **HiCache**

这些扩展可缓存历史对话前缀, 在多轮对话和 RAG 场景中显著复用计算。

### 10.4 性能基准参考

GPUStack 官方 Inference Performance Lab 的数据显示, 在相同 vLLM 后端上, GPUStack 的自动参数调优相比默认配置可带来可观的吞吐提升 (具体数据随模型和硬件变化, 详见官方文档)。

---

## 11. 企业级运维特性

### 11.1 高可用与故障恢复

- **自动故障恢复**: 模型实例异常退出后自动重启
- **多实例冗余**: 同一模型可部署多个副本, AI Gateway 自动负载均衡
- **健康检查**: 持续监控实例状态, 不健康时触发重建

### 11.2 监控与可观测性

| 监控维度 | 说明 |
|----------|------|
| **GPU 指标** | 利用率、显存占用、温度、功耗 |
| **模型指标** | 请求 QPS、延迟 (TTFT / TPOT / 总延迟) |
| **Token 指标** | 输入 / 输出 token 数、Token 速率 |
| **API 指标** | 请求速率、错误率 |

GPUStack 内置 Prometheus 指标暴露, 并提供 Grafana Dashboard 模板。

### 11.3 用户与权限

- 内置用户管理, 支持 admin / user 角色
- API Key 分级管理
- 可配置访问控制策略

### 11.4 数据库与持久化

- 默认使用嵌入式 PostgreSQL
- 生产环境建议外接 PostgreSQL 或 MySQL
- 模型文件与数据卷持久化, 避免重启后重复下载

---

## 12. 生态集成

### 12.1 应用框架集成

GPUStack 的 OpenAI 兼容 API 使其可直接接入主流框架:

| 框架 | 集成方式 |
|------|----------|
| **Dify** | 官方 GPUStack Provider, 支持 LLM / Embedding / Reranker / STT / TTS |
| **RAGFlow** | 官方 GPUStack Provider |
| **FastGPT** | 通过 OneAPI 对接 |
| **LangChain** | 使用 OpenAI 兼容端点 |
| **LlamaIndex** | 使用 OpenAI 兼容端点 |
| **n8n** | 通过 HTTP 请求或 OpenAI 节点调用 |

### 12.2 构建 RAG 与 Agent

一个典型的私有 RAG + Agent 架构:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  RAG 应用    │────→│  GPUStack   │────→│  Embedding  │
│ (Dify/RAGFlow)│     │  LLM API    │     │  Model      │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                     │
       └─────────────────────────────────────┘
                    ↕ Vector DB
```

GPUStack 可同时提供 LLM、Embedding、Reranker、TTS、STT, 成为企业 AI 应用的统一推理底座。

---

## 13. 对比与选型

### 13.1 GPUStack vs 其他推理平台

| 平台 | 定位 | 异构 GPU | 多引擎 | 分布式 | 易用性 | 适用场景 |
|------|------|----------|--------|--------|--------|----------|
| **GPUStack** | GPU 集群管理 + MaaS | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 异构集群、私有 MaaS |
| **Ollama** | 本地 LLM 运行 | ⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ | 个人开发、桌面原型 |
| **vLLM** | 推理引擎 | ⭐⭐ | ⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 生产级 LLM 服务 |
| **BentoML** | 模型服务框架 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | 模型打包与微服务 |
| **TGI** | HuggingFace 推理服务 | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | HuggingFace 生态 |
| **SGLang** | 高性能推理引擎 | ⭐⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | 极致性能场景 |

### 13.2 何时选择 GPUStack?

✅ **选择 GPUStack 的场景**:
- 需要统一管理异构 GPU 资源
- 希望一站式部署 LLM / VLM / Embedding / Reranker / 语音 / 图像模型
- 需要 OpenAI 兼容 API 快速接入现有应用
- 需要从单卡桌面环境平滑扩展到多节点生产集群
- 需要国产化硬件支持 (昇腾、海光、摩尔线程等)

❌ **不选择 GPUStack 的场景**:
- 只需要在单台机器上快速跑一个模型原型 → Ollama 更简单
- 已经深度绑定 Kubernetes 且需要训练调度 → 考虑 Kubeflow / Volcano
- 只需要一个纯推理引擎, 不需要管理多节点 → 直接使用 vLLM / SGLang 更轻量

---

## 14. 最佳实践与注意事项

### 14.1 生产部署建议

1. **Server 与 Worker 分离**: 将 Server 部署在 CPU 节点, Worker 部署在 GPU 节点, 避免资源竞争
2. **外接数据库**: 生产环境使用外部 PostgreSQL/MySQL, 提升可靠性和可维护性
3. **共享文件系统**: 多节点 vLLM 需要模型文件在所有 Worker 同路径可访问, 建议使用 NFS / 对象存储挂载
4. **网络规划**: 确保 Worker 之间低延迟高带宽, RDMA/InfiniBand 可显著提升分布式推理性能
5. **资源预留**: 为系统进程预留部分 RAM 和 VRAM, 避免 OOM

### 14.2 安全注意事项

- 默认安装后及时修改 admin 密码
- 使用 TLS 保护 UI 和 API 通信
- API Key 定期轮换, 按用户/应用分发
- Docker Worker 以 `--privileged` 运行并挂载 `docker.sock`, 需确保节点安全可控
- 自定义推理后端可能涉及运行外部容器镜像, 需审查镜像来源

### 14.3 常见问题

| 问题 | 原因 / 解决方案 |
|------|----------------|
| 模型下载慢或失败 | 检查 Hugging Face / ModelScope 连通性, 或改用本地路径 |
| vLLM 分布式调度失败 | 检查 Worker 是否同构、Python 版本是否一致、模型路径是否一致 |
| llama-box 多模态模型无法加载 | 确认 `*mmproj*.gguf` 投影文件存在且匹配 |
| Windows Worker 无法使用 vLLM | vLLM 后端在 Windows 上受限, 改用 llama-box |
| GLIBC 版本过低 | 使用 Docker 方式部署 |

### 14.4 大白话 FAQ

#### Q1: GPUStack 是 Kubernetes 吗? 它的底座是 K8s 吗?

**不是。** GPUStack 的底座不是 Kubernetes, 它有自己的独立控制平面:

```
GPUStack 自身架构
═══════════════════════════════════════════════════════════════════
GPUStack Server ──→ 自己的 Scheduler / API Server / AI Gateway
         ↓
GPUStack Worker ──→ 自己的 Runtime / Serving Manager / Metric Exporter
         ↓
Inference Server ──→ vLLM / SGLang / llama-box / MindIE 等
```

它和 K8s 的关系:

| 关系 | 说明 |
|------|------|
| **可管理 K8s 集群** | GPUStack 可以把已有的 Kubernetes GPU 集群作为其中一个“集群”纳管进来 |
| **可在 K8s 上部署** | 可以用 K8s Deployment / Pod 来跑 GPUStack Server 或 Worker |
| **底座不依赖 K8s** | 即使不用 K8s, 直接在 Linux 裸机或 Docker 上也能跑完整 GPUStack |
| **不是 K8s Operator** | 它不像 Volcano、kube-scheduler 那样作为 K8s 插件存在 |

**一句话总结**: GPUStack 不是基于 K8s 构建的, 它有自己的底座; 但它可以把 K8s 集群当作被管理的 GPU 资源池之一。

#### Q2: GPUStack 如何纳管 PPU (玄铁 / T-Head)?

PPU 是 GPUStack 官方列出的**支持的加速器**之一。纳管方式靠 **驱动 + GPUStack 自己的 Runtime 探测**, 而不是 K8s 插件:

```
PPU 纳管流程
═══════════════════════════════════════════════════════════════════
1. 物理机上装好 PPU 驱动和运行时 (T-Head PPU SDK)
2. 在这台机器上安装 GPUStack Worker
3. Worker 启动后, GPUStack Runtime 扫描本机硬件
   → 识别出 PPU 的型号、显存、驱动版本
4. Worker 把信息上报给 GPUStack Server
5. Server 的 Scheduler 在部署模型时把任务调度到 PPU 上
```

PPU 上的推理通常由 **llama-box** 后端执行 (基于 llama.cpp), 因为 PPU 目前主要跑 GGUF 量化模型。

| 步骤 | 内容 |
|------|------|
| **1. 驱动/运行时** | 安装 T-Head PPU 的驱动和 SDK |
| **2. 装 GPUStack Worker** | 在 PPU 机器上执行安装脚本或 Docker 启动 Worker |
| **3. 连 Server** | Worker 用 `--server-url` 和 `--token` 加入集群 |
| **4. 部署模型** | 在 UI 选模型, 后端通常自动或手动指定为 llama-box |
| **5. 调参数** | 使用 GGUF 量化模型, 调整 CPU/GPU offloading 比例 |

与 K8s + Device Plugin 方案对比:

| 方案 | 说明 | 适合谁 |
|------|------|--------|
| **GPUStack 纳管 PPU** | 自己探测硬件、调度模型实例, 简单直接 | 想快速把 PPU 用起来跑模型 |
| **K8s + PPU Device Plugin** | 把 PPU 暴露成 K8s 资源, 自己写 Pod YAML 跑推理容器 | 已深度使用 K8s, 想统一基础设施 |

---

## 15. 相关资源

- **GitHub**: https://github.com/gpustack/gpustack
- **官方文档**: https://docs.gpustack.ai
- **模型目录**: 见 GPUStack UI 中的 Catalog 页面
- **Inference Performance Lab**: https://gpustack.ai/performance-lab

---

*Last updated: 2026-06-25*

## Related
- [[部署推理/README|模型部署与推理]]
- [[部署推理/Inference_Engines/vLLM_Deep_Dive|vLLM: 生产级 LLM 推理引擎]]
- [[部署推理/Inference_Engines/SGLang_Deep_Dive|SGLang: 高性能 LLM 推理框架]]
- [[部署推理/Inference_Engines/Ollama_Deep_Dive|Ollama: 本地大模型部署平台]]
- [[部署推理/Inference_Engines/BentoML_Deep_Dive|BentoML: AI 模型服务框架]]
- [[部署推理/Inference_Engines/llama_cpp_Deep_Dive|llama.cpp: 纯 C/C++ 本地 LLM 推理]]
- [[部署推理/Deployment_Inference_2026|部署推理 2026 趋势]]
- [[_concepts/gpustack|GPUStack 概念卡片]]
- [[架构基建/AI_Gateway/AI_Gateway_2026|AI Gateway 2026]]
- [[RAG系统/Advanced_RAG/Agentic_RAG_Guide|Agentic RAG 指南]]
