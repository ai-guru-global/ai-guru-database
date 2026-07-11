---
title: "MIG 使用指南（v2.1）— 原始信源归档"
category: source
tags: [mig, gpu-partitioning, ppu, aliyun, multi-instance-gpu, source]
sources:
  - "https://help.aliyun.com/zh/document_detail/3031169.html"
source_url: "https://help.aliyun.com/zh/document_detail/3031169.html"
source_type: vendor-doc
publisher: "阿里云帮助文档"
captured_at: "2026-06-17T00:00:00Z"
summary: "阿里云关于 PPU（国产加速器，兼容 NVIDIA A100 MIG 语义）Multi-Instance GPU 的使用指南 v2.1。涵盖 MIG 概念（GI/CI/CE/CU）、ppu-smi 开启/创建/查询/复位/销毁 GI 与 CI、Host 与容器中使用 MIG 设备、CUDA_VISIBLE_DEVICES 注意事项。本文档为原始信源；知识库蒸馏版见 12_Architecture_Infrastructure/Hardware_Compute/MIG_Deep_Dive.md。"
related_pages:
  - "12_Architecture_Infrastructure/Hardware_Compute/MIG_Deep_Dive.md"
  - "12_Architecture_Infrastructure/Hardware_Compute/CDI_Deep_Dive.md"
---

> 本文件是原始 web clipping 归档，保留原文（含 HTML 表与图片占位）以保证信源可追溯。**生产使用请阅读蒸馏版**：[[12_Architecture_Infrastructure/Hardware_Compute/MIG_Deep_Dive]]。

**名称解释**

| Abbreviation | Meaning |
|---|---|
| **MIG** | Multiple Instance GPU. The unified name for the GI/CI feature. It makes a single PPU device could be split to multiple resource unit (GI) and multiple compute unit(CI). |
| **GI** | GPU Instance, it's the basic resource unit of PPU which could be used to create more Compute Instances. |
| **CI** | Compute Instance, it's the basic schedulable unit of PPU for compute tasks. |
| **CE** | Compute Engine |
| **CU** | Compute Unit, One CE have four CU |

## 1. MIG 介绍

MIG 代表的是 Multiple Instance GPU，这个技术最近因为英伟达在其最新一代的 A100 显卡设备上的应用而受到广泛的关注。它代表了一种更为宽裕的 GPU 共享方式，而有别于传统使用的分时共享的方式。当更多的计算资源，以更高密度容纳进入一块 GPU 设备中时，通过空间分片的方式实现更为高效的多任务间的并行性。MIG 在分片粒度上提供了一定的灵活性，可以让不同的实例占有不同数量的计算资源。更大密度的并行运算，更为可控的算力分配，在本地和平台虚拟化场景下，都有更好的用户体验。每个 MIG 实例可以独立地进行工作，数据和算力双隔离。

为了能够支持 MIG 功能，硬件在设计的时候，让计算单元 CE 和内存单元（LLC、HBM）可以按照一定的规则进行切分，GPU Instance 的最大数量被设计成 8 份。

![image.png](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/8706138771/p1071186.png)

### 1.1 GPU Instance

GPU Instance(GI) 表示 PPU 更细粒度的分片，拥有独立的计算单元，内存，DMA 以及 VIDEO 资源。GI 可以更细粒度的划分出 CI，CI 拥有独立的计算单元和 VIDEO 资源，共享 GI 中的内存单元和 DMA。GI 之间支持故障隔离，多个 GI 并行跑任务时不相互影响，GI 发生故障时可以单独复位。

### 1.2 Compute Instance

PPU MIG 的支持是以 Compute Instance 为粒度（多个 CI 共享 GI），CI 是 GI 更细粒度的分片。APP 的必须运行在 CI 上，CI 不支持独立复位。

## 2. MIG 的使用

MIG 的使用方式和 Nvidia A100 MIG 的使用方式一致，首先需要通过 ppu-smi 工具创建 MIG。

### 2.2 开启/关闭 PPU 的 MIG 模式

只有当 PPU 当前没有其他进程占用时，才能开启和关闭 MIG 模式，否则该步骤会失败，开启和关闭的命令如下:

```bash
ppu-smi -i ${ppuId} -mig 1
```

```bash
ppu-smi -i ${ppuId} -mig 0
```

可以通过 ppu-smi 查询当前 PPU 是否开启 MIG 模式。**注意：关闭 MIG 模式前需要确认当前 PPU 上没有其他 GPU Instance 和 Compute Instance(MIG)，否则关闭操作会失败。**

### 2.2 创建、查询、复位和销毁 GPU Instance

#### 2.2.1 查询 GPU Instance profile

```bash
ppu-smi mig -i ${ppuId} -lgip
```

PPU1.0 机型支持 4 种 GPU Instance Profile，ID 分别为 3,2,1,0。PPU1.1 机型，目前只支持二切片的规格，ID 分别为 3,2。

以 Profile ID 2 为例说明：`0` 当前设备 PPU0；`MIG 4g24gb` Profile 名（4g=4 slice，24gb=24G Memory）；`*2*` Profile ID；`2/2 Free` 还可创建 2 个 GI，Total 最多 2 个；`24.00` 内存大小；`No` 不支持 P2P；`32` 个 compute unit；`2/2/2/2` decoder/encoder/dma/jpeg engine；`0` 个 OFA。

#### 2.2.2 创建 GPU Instance

```bash
ppu-smi mig -i ${ppuId} -cgi ${profileId}
```

#### 2.2.3 查询 GPU Instance

```bash
ppu-smi mig -i ${ppuId} -lgi
```

#### 2.2.4 复位 GPU Instance

重置前需确保当前 GI 下所有 CI 都空闲。

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -r
```

#### 2.2.5 销毁 GPU Instance

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -dgi
```

### 2.3 创建、查询和销毁 Compute Instance

#### 2.3.1 查询 Compute Instance profile

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -lcip
```

PPU1.0 机型最多 19 种 CI Profile。以 Profile 2 为例：`MIG 3u4g24gb`（3u=3 compute unit，4g24gb=GI Profile 名）；`*2*` Profile ID；`8/8 Free` 还可创建 8 个 CI。

#### 2.3.2 创建 Compute Instance

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -cci ${profileId}
```

#### 2.3.3 查询 Compute Instance

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -lci
```

查询 Compute Instance UUID：

```bash
ppu-smi -L
```

输出 `MIG-4416c2c4-534e-4236-b26a-24692af597a1` 即当前 CI 的 UUID。

#### 2.3.4 销毁 Compute Instance

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -ci ${ciId} -dci
```

### 2.4 Host 使用 MIG 设备

在 Host 中使用 MIG 设备时，只需要使用 CUDA_VISIBLE_DEVICES 指定 MIG 的 UUID 即可：

```bash
export CUDA_VISIBLE_DEVICES=MIG-4416c2c4-534e-4236-b26a-24692af597a1
./app
```

### 2.5 容器中使用 MIG 设备

可以将 MIG 设备透传到容器中使用。具体用法参考[容器隔离使用指南](https://help.aliyun.com/zh/document_detail/3031170.html)。

## 3. 注意事项

### 3.1 PPU 开启了 MIG 或只创建了 GI 时是不能使用的

此时通过 `CUDA_VISIBLE_DEVICES=0` 运行程序会失败。

### 3.2 多 PPU 存在 CI 时，app 默认跑在第一个 CI 上

- 未指定 CUDA_VISIBLE_DEVICES 时，app 默认跑在 PPU-1/GI-0/CI-0 上。
- `CUDA_VISIBLE_DEVICES=0` 时，app 运行在 PPU0 上。
- `CUDA_VISIBLE_DEVICES=1` 时，app 运行在 PPU-1/GI-0/CI-0 上。
- `CUDA_VISIBLE_DEVICES=MIG-UUID`，app 运行在指定 CI 上。

### 3.3 CUDA_VISIBLE_DEVICES 可以同时指定多个 PPU 和单个 CI

```bash
CUDA_VISIBLE_DEVICES=3                    # 选择使用 PPU3
CUDA_VISIBLE_DEVICES=3,PPU-${UUID},1      # 选择使用 PPU3,PPUx,PPU1
CUDA_VISIBLE_DEVICES=MIG-${UUID}          # 选择使用单个 CI
```

### 3.4 CUDA_VISIBLE_DEVICES 同时指定 PPU+CI

**3.4.1** 如果第一个设备是 MIG，那么只有该 MIG 生效，其他设备忽略：

```bash
CUDA_VISIBLE_DEVICES=MIG-${UUID},3,PPU-${UUID}          # 只有 MIG-${UUID} 生效
```

**3.4.2** 如果第一个设备不是 MIG，那么只有第一个 MIG 前的所有 PPU 生效：

```bash
CUDA_VISIBLE_DEVICES=4,2,MIG-${UUID},3,PPU-${UUID}      # 选择使用 PPU4,PPU2
```
