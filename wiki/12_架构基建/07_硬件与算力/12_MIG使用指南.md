---
title: "MIG使用指南（v2.1）"
source: "https://help.aliyun.com/zh/document_detail/3031169.html"
author:
published:
created: 2026-06-17
description: "名称解释AbbreviationMeaningMIGMultiple Instance GPU. The unified name for the GI/CI feature. It makes a single PPU device could be split to multiple resou..."
tags:
  - "clippings"
name_zh: "MIG使用指南"
---
> 中文简称：MIG 使用指南

**名称解释**

<table><thead><tr><td rowspan="1" colspan="1"><p><b>Abbreviation</b></p></td><td rowspan="1" colspan="1"><p><b>Meaning</b></p></td></tr></thead></table>

<table><tbody><tr><td rowspan="1" colspan="1"><p><b>Abbreviation</b></p></td><td rowspan="1" colspan="1"><p><b>Meaning</b></p></td></tr><tr><td rowspan="1" colspan="1"><p><b>MIG</b></p></td><td rowspan="1" colspan="1"><p>Multiple Instance GPU. The unified name for the GI/CI feature. It makes a single PPU device could be split to multiple resource unit (GI) and multiple compute unit(CI).</p></td></tr><tr><td rowspan="1" colspan="1"><p><b>GI</b></p></td><td rowspan="1" colspan="1"><p>GPU Instance, it’s the basic resource unit of PPU which could be used to create more Compute Instances.</p></td></tr><tr><td rowspan="1" colspan="1"><p><b>CI</b></p></td><td rowspan="1" colspan="1"><p>Compute Instance, it’s the basic schedulable unit of PPU for compute tasks.</p></td></tr><tr><td rowspan="1" colspan="1"><p><b>CE</b></p></td><td rowspan="1" colspan="1"><p>Compute Engine</p></td></tr><tr><td rowspan="1" colspan="1"><p><b>CU</b></p></td><td rowspan="1" colspan="1"><p>Compute Unit, One CE have four CU</p></td></tr></tbody></table>

## 1\. MIG 介绍

MIG 代表的是 Multiple Instance GPU，这个技术最近因为英伟达在其最新一代的 A100 显卡设备上的应用而受到广泛的关注。它代表了一种更为宽裕的 GPU 共享方式，而有别于传统使用的分时共享的方式。当更多的计算资源，以更高密度容纳进入一块 GPU 设备中时，通过空间分片的方式实现更为高效的多任务间的并行性。MIG 在分片粒度上提供了一定的灵活性，可以让不同的实例占有不同数量的计算资源。更大密度的并行运算，更为可控的算力分配，在本地和平台虚拟化场景下，都有更好的用户体验。每个 MIG 实例可以独立地进行工作，数据和算力双隔离。

为了能够支持 MIG 功能，硬件在设计的时候，让计算单元 CE 和内存单元（LLC、HBM）可以按照一定的规则进行切分，GPU Instance 的最大数量被设计成 8 份。

![image.png](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/8706138771/p1071186.png)

### 1.1 GPU Instance

GPU Instance(GI)表示 PPU 更细粒度的分片，拥有独立的计算单元，内存，DMA 以及 VIDEO 资源。GI 可以更细粒度的划分出 CI，CI 拥有独立的计算单元和 VIDEO 资源，共享 GI 中的内存单元和 DMA。GI 之间支持故障隔离，多个 GI 并行跑任务时不相互影响，GI 发生故障时可以单独复位。

### 1.2 Compute Instance

PPU MIG 的支持是以 Compute Instance 为粒度（多个 CI 共享 GI），CI 是 GI 更细粒度的分片。APP 的必须运行在 CI 上，CI 不支持独立复位。

## 2\. MIG 的使用

MIG 的使用方式和 Nvidia A100 MIG 的使用方式一致，首先需要通过 ppu-smi 工具创建 MIG。

### 2.2 开启/关闭 PPU 的 MIG 模式

只有当 PPU 当前没有其他进程占用时，才能开启和关闭 MIG 模式，否则该步骤会失败，开启和关闭的命令如下:

```bash
ppu-smi -i ${ppuId} -mig 1
```

```bash
ppu-smi -i ${ppuId} -mig 0
```

可以通过 ppu-smi 查询当前 PPU 是否开启 MIG 模式，如下图所示，PPU0 开启了 MIG mode；PPU1 关闭 MIG mode

![image.png](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/8706138771/p1071176.png)

**注意：关闭 MIG 模式前需要确认当前 PPU 上没有其他 GPU Instance 和 Compute Instance(MIG)，否则关闭操作会失败，GPU Instance 的查询参考 2.2.3，Compute Instance 的查询参考 2.3.3**

### 2.2 创建、查询、复位和销毁 GPU Instance

#### 2.2.1 查询 GPU Instance profile

查询支持的 GPU Instance profile，命令如下:

```bash
ppu-smi mig -i ${ppuId} -lgip
```

查询结果如下:

![image.png](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/8706138771/p1071174.png)

PPU1.0 机型支持 4 种 GPU Instance Profile，ID 分别为 3,2,1,0

PPU1.1 机型，目前只支持二切片的规格， ID 分别为 3,2

以 Profile ID 2 为例说明:

- `0` 表示当前查询设备是 PPU0
- `MIG 4g24gb` 表示当前 Profile 的名字，4g 表示 4 个 slice，24gb 表示 24GByte Memory
- `*2*` 表示当前 Profile ID
- `2/2` Free:当前还可以创建 2 个 GI， Total：最多创建 2 个 GI
- `24.00` 表示当前 Profile GI 的内存大小
- `*No*` 表示当前 GPU instance 不支持 P2P, PPU MIG 模式下不支持 P2P
- `*32*` 表示 32 个 compute unit
- `*2*` 表示 2 个 decoder engine
- `*2*` 表示 2 个 encoder engine
- `2` 表示 2 个 dma engine
- `2` 表示 2 个 jpeg engine
- `*0*` 表示 0 个 OFA，PPU 不支持 OFA

#### 2.2.2 创建 GPU Instance

创建 Profile 2 的 GPU Instance，命令如下:

```bash
ppu-smi mig -i ${ppuId} -cgi ${profileId}
```

创建结果如下:

![image.png](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/8706138771/p1071177.png)

#### 2.2.3 查询 GPU Instance

```bash
ppu-smi mig -i ${ppuId} -lgi
```

输出如下:

![image.png](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/8706138771/p1071179.png)

Instance ID 0 表示当前 GI 在 PPU0 的序号，0:4 Start 0 表示 0 slot，4 表示 4 个 slice，如下图红框：

#### 2.2.4 复位 GPU Instance

重置 GPU Instance 前需要确保当前 GPU Instance 下的所有 Compute Instance 都是空闲状态。

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -r
```

输出结果如下:

#### 2.2.5 销毁 GPU Instance

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -dgi
```

输出如下:

### 2.3 创建、查询和销毁 Compute Instance

#### 2.3.1 查询 Compute Instance profile

查询支持的 Compute Instance profile，命令如下:

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -lcip
```

输入结果如下:

PPU1.0 机型支持 Compute Instance Profile 比较多，最多 19 种 Profile

PPU1.1 机型，目前只支持二切片的规格

以 Profile 2 为例说明：

- 0 表示当前查询设备是 PPU0。
- 0 表示当前查询 GPU Instance 设备是 0。
- MIG 3u4g24gb 表示当前 Profile 的名字，3u 表示 3 个 compute unit，4g24gb 表示 GPU Instance Profile 名字。
- ***2*** 表示当前 Profile ID。
- 8/8 Free:当前还可以创建 8 个 CI， Total：最多创建 8 个 CI。
- 3 表示当前 Profile CI 具有 3 个 compute unit。
- 剩余参考 GPU Instance Profile 说明。

#### 2.3.2 创建 Compute Instance

创建 Profile 3 的 Compute Instance，命令如下：

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -cci ${profileId}
```

输出如下：

#### 2.3.3 查询 Compute Instance

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -lci
```

输出如下：

成功创建 Compute Instance 后，ppu-smi 也可以直接查询到 Compute Instance，如下图：

PPU0 卡上有一个 Compute Instance(MIG)，属于 GPU Instance 0，该 Compute Instance 具有 4 个 compute unit

***查询 Compute Instance UUID***

```bash
ppu-smi -L
```

输出结果如下， `MIG-4416c2c4-534e-4236-b26a-24692af597a1` 表示当前 Compute Instance 的 UUID。

#### 2.3.4 销毁 Compute Instance

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -ci ${ciId} -dci
```

输出如下：

### 2.4 Host 使用 MIG 设备

在 Host 中使用 MIG 设备时，只需要使用 CUDA\_VISIBLE\_DEVICES 指定 MIG 的 UUID 即可，UUID 的获取可以通过 ppu-smi 获取。

```bash
export CUDA_VISIBLE_DEVICES=MIG-4416c2c4-534e-4236-b26a-24692af597a1
./app
```

### 2.5 容器中使用 MIG 设备

我们可以将 MIG 设备透传到容器中使用。具体用法可以参考 [容器隔离使用指南](https://help.aliyun.com/zh/document_detail/3031170.html) 。

## 3\. 注意事项

### 3.1 PPU 开启了 MIG 或只创建了 GI 时是不能使用的

如下图，此时通过 **CUDA\_VISIBLE\_DEVICES=0 运行程序会失败。**

### 3.2 多 PPU 存在 CI 时，app 默认跑在第一个 CI 上

如下图：

- 未指定 CUDA\_VISIBLE\_DEVICES 时，app 默认跑在 PPU-1/GI-0/CI-0 上。
- CUDA\_VISIBLE\_DEVICES=0 时，app 运行在 PPU0 上。
- CUDA\_VISIBLE\_DEVICES=1 时，app 运行在 PPU-1/GI-0/CI-0 上。
- CUDA\_VISIBLE\_DEVICES=MIG-UUID，app 运行在指定 CI 上。

### 3.3 CUDA\_VISIBLE\_DEVICES 可以同时指定多个 PPU 和单个 CI

以下命令都是合法的：

```bash
CUDA_VISIBLE_DEVICES=3                    # 选择使用PPU3
CUDA_VISIBLE_DEVICES=3,PPU-${UUID},1      # 选择使用PPU3,PPUx,PPU1
CUDA_VISIBLE_DEVICES=MIG-${UUID}          # 选择使用单个CI
```

### 3.4 CUDA\_VISIBLE\_DEVICES 同时指定 PPU+CI

#### 3.4.1 如果第一个设备是 MIG，那么只有该 MIG 生效，其他设备忽略。

```bash
CUDA_VISIBLE_DEVICES=MIG-${UUID},3,PPU-${UUID}          # 只有MIG-${UUID} 生效
```

#### 3.4.2 如果第一个设备不是 MIG，那么只有第一个 MIG 前的所有 PPU 生效。

```bash
CUDA_VISIBLE_DEVICES=4,2,MIG-${UUID},3,PPU-${UUID}          # 选择使用PPU4,PPU2
```
## 相关链接

- [[12_架构基建/07_硬件与算力/11_MIG_深入分析|MIG 深度解析]] — MIG 技术深度剖析
- [[12_架构基建/07_硬件与算力/index|硬件算力索引]] — 硬件主题导览
- [[概念/GPU/mig|MIG]] — MIG 概念卡片
- [[概念/K8s/gpu-sharing|GPU 共享]] — MIG 的共享机制
- [[概念/GPU/nvidia-gpu|NVIDIA GPU]] — MIG 支持的硬件
- [[概念/K8s/gpu-operator|GPU Operator]] — K8s 上的 GPU 管理
