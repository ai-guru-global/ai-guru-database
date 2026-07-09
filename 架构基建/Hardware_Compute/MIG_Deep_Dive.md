---
title: "MIG (Multi-Instance GPU): GPU 空间分片与多租户隔离深度解析"
category: "12-architecture-infrastructure"
tags: ["mig", "multi-instance-gpu", "gpu-partitioning", "nvidia", "a100", "h100", "kubernetes", "multi-tenant", "gpu", "ppu"]
summary: "> **一句话理解**: MIG 是 GPU 的「硬件级刀片」——把一张 A100/H100 在硅片层面切成最多 7 个互相隔离的实例（GI/CI），每个实例独享显存与算力、故障互不影响，是大模型推理做多租户细粒度切分、榨干单卡利用率的事实标准。"
created: "2026-06-17"
updated: "2026-06-17"
tier: supporting
aliases:
  - "Mig Deep Dive"
  - "MIG Deep Dive"
  - MIG_Deep_Dive
sources: []

---
# MIG (Multi-Instance GPU): GPU 空间分片与多租户隔离深度解析

> **一句话理解**: MIG 是 GPU 的「硬件级刀片」——把一张 A100/H100 在硅片层面切成最多 7 个互相隔离的实例（GI/CI），每个实例独享显存与算力、故障互不影响，是大模型推理做多租户细粒度切分、榨干单卡利用率的事实标准。

> **硬件支持**: NVIDIA A100 / A30 / H100 / H200 / B200；国产侧阿里云 PPU、摩尔线程、沐曦、海光等亦提供 MIG 兼容语义（`ppu-smi` 等工具对齐 `nvidia-smi`）。
> **信源**: 本文操作部分蒸馏自阿里云《MIG 使用指南 v2.1》〔[[_sources/aliyun/MIG使用指南_v2.1]]〕，并补齐 NVIDIA 原生 profile 与 K8s 生产实践。

---

## 目录

1. [为什么需要 MIG：vGPU 与分时共享的短板](#1-为什么需要-migvgpu-与分时共享的短板)
2. [核心概念：GI / CI / CE / CU 与硬件隔离](#2-核心概念gi--ci--ce--cu-与硬件隔离)
3. [Profile 体系：A100 / H100 切片规格全表](#3-profile-体系a100--h100-切片规格全表)
4. [操作手册：开启、创建、查询、复位、销毁](#4-操作手册开启创建查询复位销毁)
5. [在 Host 与容器中使用 MIG 设备](#5-在-host-与容器中使用-mig-设备)
6. [K8s 生产实践：GPU Operator MIG 策略](#6-k8s-生产实践gpu-operator-mig-策略)
7. [CUDA_VISIBLE_DEVICES 易错点与隔离语义](#7-cuda_visible_devices-易错点与隔离语义)
8. [MIG vs 分时共享 vs vGPU vs HAMi：选型矩阵](#8-mig-vs-分时共享-vs-vgpu-vs-hami选型矩阵)
9. [与本项目其他章节的关联](#9-与本项目其他章节的关联)

---

## 1. 为什么需要 MIG：vGPU 与分时共享的短板

大模型推理场景里，**一张 H100 跑一个 7B 模型常常只用满 20~30% 算力**。让一张卡服务多个租户/多个模型有三种共享方式，前两种都有硬伤：

```
共享方式            隔离强度   性能干扰   粒度        典型问题
═══════════════════════════════════════════════════════════════════
分时共享(time-slice)  弱         大         进程级       一个租户跑满→其他人卡顿
  (MPS/默认共享)                                       无故障隔离，OOM 影响全卡
vGPU(虚拟化)          中         中         固定规格     需 license，开销大，规格固定
MIG(空间分片)         强(硬件)   无         硬件切片     需要支持的卡(A100/H100/...)
                                                       切片后单实例规格不可动态调
```

**MIG 的核心价值**：在**硬件层面**把一张 GPU 的计算引擎（CE）、显存（HBM）、二级缓存（LLC）、解码器（DEC/ENC/JPEG）按规则切给多个实例，每个实例走自己的地址空间，**数据和算力双隔离、故障可单独复位**。这是唯一能做到「零性能干扰 + 强隔离」的共享方式，是合规/金融/多租户推理平台的首选。

---

## 2. 核心概念：GI / CI / CU 与硬件隔离

| 缩写 | 全称 | 含义 |
|------|------|------|
| **MIG** | Multiple Instance GPU | GI/CI 特性的统称，把一张 PPU/GPU 切成多个资源单元（GI）和计算单元（CI） |
| **GI** | GPU Instance | 资源单元，拥有**独立**的计算单元、显存、DMA、VIDEO 资源；可在其下继续划分 CI |
| **CI** | Compute Instance | 调度单元，APP 必须跑在 CI 上；拥有独立计算/VIDEO，**共享**所属 GI 的显存与 DMA；不支持独立复位 |
| **CE** | Compute Engine | 计算引擎，MIG 切分的基本对象 |
| **CU** | Compute Unit | 一个 CE 含 4 个 CU |

```
一张 GPU（以 A100 80GB 为例，最多 7 个 GI）
═══════════════════════════════════════════════════════════════════
┌─────────────────────────────────────────────────────────────┐
│  GI-0 (7g.80gb 整卡)        │  GI-1 (1g.10gb) │ ... │ GI-6  │
│  ┌─────────┬─────────┐      │  ┌────┬────┐    │     │       │
│  │  CI-0   │  CI-1   │      │  │CI-0│CI-1│    │     │       │
│  │ 独立 CE │ 独立 CE │      │  │CE │CE │    │     │       │
│  └────┬────┴────┬────┘      │  └─┬──┴─┬──┘    │     │       │
│       │共享显存/DMA          │    │共享│        │     │       │
│  独立 HBM/LLC/DEC/ENC       │  独立HBM切片    │     │       │
└─────────────────────────────────────────────────────────────┘
   每个 GI/CI: 独立地址空间、独立故障域、可单独复位（GI 级）
```

**关键性质**：
- **GI 间故障隔离**：一个 GI 崩溃不影响其他 GI，可单独复位。
- **CI 必须依附 GI**：APP 跑在 CI 上；CI 共享所属 GI 的显存，故同 GI 内多个 CI 是「算力隔离、显存共享」。
- **最大 7 份**：A100/H100 最多切成 7 个 GI（受硬件 CE 数量约束）。
- **不支持 P2P**：MIG 实例之间不能直接 P2P 通信（NCCL 多卡通信需走非 MIG 的整卡或跨卡）。

---

## 3. Profile 体系：A100 / H100 切片规格全表

MIG 通过 **Profile** 描述切片规格，命名规则 `<切片数>g.<显存>`（`g` = GPU slice）。

### 3.1 NVIDIA A100 80GB（GI Profile）

| Profile ID | 名称 | slice | 显存 | 典型用途 |
|---|---|---|---|---|
| 0 | `7g.80gb` | 7/7 | 80GB | 整卡（大模型，70B+） |
| 1 | `4g.40gb` | 4/7 | 40GB | 中型模型（13B~33B） |
| 2 | `2g.40gb` | 2/7 | 40GB | — |
| 3 | `1g.40gb` | 1/7 | 40GB | — |
| 9 | `3g.40gb` | 3/7 | 40GB | — |
| 14 | `2g.20gb` | 2/7 | 20GB | — |
| 15 | `1g.20gb` | 1/7 | 20GB | 小模型（7B 量化） |
| 19 | `1g.10gb` | 1/7 | 10GB | 轻量推理/Embedding |

> H100 80GB / H200 的 profile 体系与 A100 80GB 类似（7-way），B200 因 Blackwell 架构切分粒度更细。A30 仅支持 4-way（最多 4 个 GI）。

### 3.2 国产 PPU（阿里云 PPU1.0 / PPU1.1）

| 机型 | 切片能力 | GI Profile ID |
|------|---------|--------------|
| **PPU1.0** | 最多 8 份，4 种 GI 规格 | 3, 2, 1, 0（如 `4g24gb` = 4 slice / 24GB） |
| **PPU1.1** | 仅二切片规格 | 3, 2 |

> PPU 的 `ppu-smi` 工具与 `nvidia-smi` MIG 子命令语义一致，命令可直接对仗迁移（见下节）。CI Profile 在 PPU1.0 上最多 19 种。

---

## 4. 操作手册：开启、创建、查询、复位、销毁

> 以下命令同时给出 **NVIDIA (`nvidia-smi`)** 与 **国产 PPU (`ppu-smi`)** 两套，二者 MIG 语义对齐，仅工具名不同。

### 4.1 开启/关闭 MIG 模式

**前提**：当前 GPU/PPU 上没有其他进程占用，否则会失败。

```bash
# NVIDIA
sudo nvidia-smi -i ${gpuId} -mig 1        # 开启
sudo nvidia-smi -i ${gpuId} -mig 0        # 关闭

# 国产 PPU（阿里云）
ppu-smi -i ${ppuId} -mig 1
ppu-smi -i ${ppuId} -mig 0
```

> ⚠️ **关闭 MIG 前**必须先销毁所有 GI/CI，否则关闭失败。

### 4.2 GPU Instance（GI）生命周期

```bash
# ① 查询支持的 GI profile
nvidia-smi mig -i ${gpuId} -lgip          # PPU: ppu-smi mig -i ${ppuId} -lgip

# ② 创建 GI（指定 profile id）
sudo nvidia-smi mig -i ${gpuId} -cgi ${profileId}     # PPU: ppu-smi mig -i ${ppuId} -cgi ${profileId}

# ③ 查询已创建的 GI
nvidia-smi mig -i ${gpuId} -lgi            # PPU: ppu-smi mig -i ${ppuId} -lgi

# ④ 复位 GI（需确保其下所有 CI 空闲）
sudo nvidia-smi mig -i ${gpuId} -gi ${giId} -r

# ⑤ 销毁 GI
sudo nvidia-smi mig -i ${gpuId} -gi ${giId} -dgi
```

`-lgip` 输出解读（以 Profile 2 `MIG 4g24gb` 为例）：`4g` = 4 slice；`24gb` = 显存；`2/2 Free` = 还可/总共创建 2 个；`32` = 32 compute unit；`No` = 不支持 P2P；decoder/encoder/dma/jpeg engine 数量依次列出。

### 4.3 Compute Instance（CI）生命周期

```bash
# ① 查询支持的 CI profile（在某个 GI 下）
nvidia-smi mig -i ${gpuId} -gi ${giId} -lcip    # PPU: ppu-smi mig -i ${ppuId} -gi ${giId} -lcip

# ② 创建 CI
sudo nvidia-smi mig -i ${gpuId} -gi ${giId} -cci ${profileId}

# ③ 查询 CI
nvidia-smi mig -i ${gpuId} -gi ${giId} -lci

# ④ 销毁 CI
sudo nvidia-smi mig -i ${gpuId} -gi ${giId} -ci ${ciId} -dci
```

### 4.4 查询 MIG UUID（关键）

```bash
nvidia-smi -L            # PPU: ppu-smi -L
# GPU 0: ... (ID 0)
#   MIG 1g.10gb     Device  0: (UUID) MIG-4416c2c4-534e-4236-b26a-24692af597a1
```

`MIG-<uuid>` 即 CI 的全局唯一标识，后续 Host/容器/`CUDA_VISIBLE_DEVICES` 都用它寻址。

---

## 5. 在 Host 与容器中使用 MIG 设备

### 5.1 Host 上运行

只需用 `CUDA_VISIBLE_DEVICES` 指定 MIG UUID：

```bash
export CUDA_VISIBLE_DEVICES=MIG-4416c2c4-534e-4236-b26a-24692af597a1
./app          # 该进程只能看到这一个 CI 的算力与显存
```

### 5.2 容器中运行（透传 MIG）

把单个 MIG 设备透传到容器，本质是把 `/dev/nvidia<id>` + 对应 CDI Spec 注入容器。**推荐走 CDI**（见 [[12_Architecture_Infrastructure/Hardware_Compute/CDI_Deep_Dive]] §6）：

```bash
# containerd / nerdctl via CDI（最现代、最干净）
nerdctl run --rm --device nvidia.com/gpu=mig-1g.10gb \
  -e CUDA_VISIBLE_DEVICES=MIG-4416c2c4-... \
  vllm/vllm-openai:latest \
  --model Qwen2.5-7B-Instruct
```

或用 NVIDIA Container Toolkit（`--gpus` 在 MIG 下需用 `"mig-uuid://MIG-xxx"` 形式）：

```bash
docker run --rm --gpus '"device=mig-uuid://MIG-4416c2c4-..."' \
  -e CUDA_VISIBLE_DEVICES=0 vllm/vllm-openai:latest --model Qwen2.5-1.5B
```

> 阿里云 PPU 容器隔离细节见[容器隔离使用指南](https://help.aliyun.com/zh/document_detail/3031170.html)；CDI 如何统一描述 MIG/国产加速器设备见 [[_concepts/cdi]]。

---

## 6. K8s 生产实践：GPU Operator MIG 策略

裸 `nvidia-smi` 切 MIG 适合单机调试；**生产 K8s 集群应交给 [NVIDIA GPU Operator](https://github.com/NVIDIA/gpu-operator) 统一管理**（国产卡用对应厂商 operator / [[_concepts/gpu-operator]]）。

### 6.1 两种 MIG 策略

| 策略 | 含义 | 适用 |
|------|------|------|
| **single** | 所有 GPU 用**同一种** MIG 配置（如全卡都切 1g.10gb） | 同质推理池（一个集群只服务 7B 模型） |
| **mixed** | 每张 GPU 可有**不同** MIG 配置（卡 A 切 7×1g，卡 B 切 2×3g） | 异构推理池（混跑 7B/33B/Embedding） |

GPU Operator ConfigMap：

```yaml
# gpu-operator values.yaml 片段
mig:
  strategy: mixed                 # single | mixed
devicePlugin:
  config:
    name: mig-config              # 指向一个 ConfigMap，描述每张卡的切分方式
    default: "all-1g.10gb"
```

`mig-parted` 配置示例（定义切分方案）：

```yaml
version: v1
mig-configs:
  all-1g.10gb:                    # 名字 → 后续作为 extended resource
    - devices: all
      mig-enabled: true
      mig-devices:
        1g.10gb: 7                # 每张卡切 7 个 1g.10gb
  mixed-example:
    - device: 0
      mig-enabled: true
      mig-devices: { 3g.40gb: 1, 2g.20gb: 1 }   # 卡 0：1 个 3g + 1 个 2g
    - device: 1
      mig-enabled: false           # 卡 1：整卡
```

### 6.2 在 Pod 里请求 MIG 切片

GPU Operator 会把每个 profile 注册为 **extended resource**，Pod 直接按名字申请：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: llm-7b-on-mig
spec:
  containers:
  - name: vllm
    image: vllm/vllm-openai:latest
    args: ["--model", "Qwen2.5-7B-Instruct"]
    resources:
      limits:
        nvidia.com/mig-1g.10gb: 1   # ← 申请 1 个 1g.10gb 切片
```

调度器只会把 Pod 放到还有该切片余量的节点。`mig-1g.10gb` 这种命名让 K8s 天然实现按规格排队与配额。

> DRA（Dynamic Resource Allocation）是 MIG 在 K8s 上的未来形态——DRA 可表达「我要一张卡的某切片并声明其拓扑诉求」，比 device-plugin 的整数 extended resource 更灵活。见 [[12_Architecture_Infrastructure/Hardware_Compute/DRA_Deep_Dive]]。

---

## 7. CUDA_VISIBLE_DEVICES 易错点与隔离语义

这部分是 MIG 落地最容易踩坑的地方（蒸馏自原始信源 §3）：

### 7.1 只开 MIG 或只建 GI 时不能直接用

`CUDA_VISIBLE_DEVICES=0` 在「仅开启 MIG」或「只创建了 GI 没建 CI」时会**失败**——APP 必须挂在 CI 上。

### 7.2 多 GPU 存在 CI 时，默认挂在第一个 CI

| 设置 | 实际运行位置 |
|------|-------------|
| 未指定 | 默认跑到 GPU-1/GI-0/CI-0 |
| `CUDA_VISIBLE_DEVICES=0` | GPU0（若 GPU0 开了 MIG 但没指定 CI，会失败） |
| `CUDA_VISIBLE_DEVICES=1` | GPU-1/GI-0/CI-0 |
| `CUDA_VISIBLE_DEVICES=MIG-<uuid>` | **推荐**：精确到指定 CI |

### 7.3 混合指定规则（关键）

```bash
# 合法：纯 GPU 或单个 CI
CUDA_VISIBLE_DEVICES=3
CUDA_VISIBLE_DEVICES=3,PPU-${UUID},1     # 多张整卡
CUDA_VISIBLE_DEVICES=MIG-${UUID}         # 单个 CI

# 规则 1：第一个设备是 MIG → 只该 MIG 生效，其余忽略
CUDA_VISIBLE_DEVICES=MIG-${UUID},3,PPU-${UUID}      # 只有 MIG-${UUID} 生效

# 规则 2：第一个设备不是 MIG → 只有第一个 MIG 之前的 GPU 生效
CUDA_VISIBLE_DEVICES=4,2,MIG-${UUID},3,PPU-${UUID}  # 生效：GPU4,GPU2
```

> 结论：**生产环境强烈建议显式用 `MIG-<uuid>`**，不要依赖默认行为，避免「以为跑在整卡实际跑在某 CI」的错位。

---

## 8. MIG vs 分时共享 vs vGPU vs HAMi：选型矩阵

| 维度 | MIG | 分时共享 (MPS/默认) | vGPU | HAMi (oversubscribe) |
|------|-----|---------------------|------|----------------------|
| 隔离层级 | **硬件** | 软件进程级 | 虚拟化 | 软件劫持 |
| 性能干扰 | **无** | 大 | 中 | 中（超卖时） |
| 故障隔离 | **强（可单独复位）** | 弱（OOM 影响全卡） | 中 | 弱 |
| 显存隔离 | **硬隔离** | 共享 | 软隔离 | 可超卖（核心卖点） |
| 粒度 | 固定 profile（1/2/3/4/7 slice） | 进程 | 固定规格 | 任意（按 % 或 MB） |
| 是否超卖 | 否 | 否 | 否 | **是**（利用率提升利器） |
| 硬件要求 | A100/A30/H100/H200/B200 | 任意 | 特定卡 + license | 任意（NVIDIA/昇腾/海光） |
| 典型场景 | 多租户强隔离推理、合规 | 内部团队共享 | 传统虚拟化 | 开发测试、提高 GPU 利用率 |

**选型一句话**：**要强隔离 + 合规 → MIG；要超卖提利用率 → HAMi；要细粒度配额 → 两者可叠加（HAMi 在 MIG 切片之上再做多租户配额）。** HAMi 深度见 [[12_Architecture_Infrastructure/AI_Stack/HAMi_Deep_Dive]]。

---

## 9. 与本项目其他章节的关联

| 关联文档 | 关联点 |
|---------|-------|
| [[12_Architecture_Infrastructure/Hardware_Compute/CDI_Deep_Dive]] | CDI 是把 MIG 切片透传进容器的标准 JSON 接口（§6 专讲 MIG 切片） |
| [[12_Architecture_Infrastructure/Hardware_Compute/DRA_Deep_Dive]] | DRA 是 MIG 在 K8s 的未来声明式分配方式 |
| [[12_Architecture_Infrastructure/AI_Stack/HAMi_Deep_Dive]] | HAMi 可在 MIG 之上做多租户 oversubscribe，互补 |
| [[_concepts/gpu-virtualization]] | MIG 在 GPU 虚拟化全景中的定位 |
| [[_concepts/cdi]] / [[_concepts/dra]] / [[_concepts/gpu-operator]] | MIG 落地 K8s 的概念链 |
| [[_synthesis/hami-cdi-dra]] | HAMi + CDI + DRA + MIG 的综合选型 |
| [[12_Architecture_Infrastructure/Multi_Tenant_Architecture]] | MIG 作为多租户推理的硬件隔离底座 |
| [[01_Fundamentals/AI_Hardware/NVIDIA_AMD_GPU_Deep_Dive]] | A100/H100 硬件基础 |
| [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive]] | vLLM 跑在 MIG 切片上的部署实践 |

---

## Related

- [[12_Architecture_Infrastructure/Hardware_Compute/CDI_Deep_Dive]] — MIG 切片如何被容器消费
- [[12_Architecture_Infrastructure/Hardware_Compute/DRA_Deep_Dive]] — K8s 设备分配的未来（含 MIG）
- [[12_Architecture_Infrastructure/AI_Stack/HAMi_Deep_Dive]] — GPU 超卖与多租户（与 MIG 互补）
- [[_concepts/gpu-virtualization]] — GPU 虚拟化全景
- [[_synthesis/hami-cdi-dra]] — GPU 共享技术栈综合
- [[_sources/aliyun/MIG使用指南_v2.1]] — 原始信源归档（阿里云 PPU MIG 指南 v2.1）
- [[README]] — 知识库总索引
