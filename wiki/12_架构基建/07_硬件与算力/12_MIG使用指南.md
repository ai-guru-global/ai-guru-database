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
> 中文简称：MIG使用指南

**名称解释**

<table><thead><tr><td rowspan="1" colspan="1"><p><b>Abbreviation</b></p></td><td rowspan="1" colspan="1"><p><b>Meaning</b></p></td></tr></thead></table>

<table><tbody><tr><td rowspan="1" colspan="1"><p><b>Abbreviation</b></p></td><td rowspan="1" colspan="1"><p><b>Meaning</b></p></td></tr><tr><td rowspan="1" colspan="1"><p><b>MIG</b></p></td><td rowspan="1" colspan="1"><p>Multiple Instance GPU. The unified name for the GI/CI feature. It makes a single PPU device could be split to multiple resource unit (GI) and multiple compute unit(CI).</p></td></tr><tr><td rowspan="1" colspan="1"><p><b>GI</b></p></td><td rowspan="1" colspan="1"><p>GPU Instance, it’s the basic resource unit of PPU which could be used to create more Compute Instances.</p></td></tr><tr><td rowspan="1" colspan="1"><p><b>CI</b></p></td><td rowspan="1" colspan="1"><p>Compute Instance, it’s the basic schedulable unit of PPU for compute tasks.</p></td></tr><tr><td rowspan="1" colspan="1"><p><b>CE</b></p></td><td rowspan="1" colspan="1"><p>Compute Engine</p></td></tr><tr><td rowspan="1" colspan="1"><p><b>CU</b></p></td><td rowspan="1" colspan="1"><p>Compute Unit, One CE have four CU</p></td></tr></tbody></table>

## 1\. MIG 介绍

MIG代表的是Multiple Instance GPU，这个技术最近因为英伟达在其最新一代的A100显卡设备上的应用而受到广泛的关注。它代表了一种更为宽裕的GPU共享方式，而有别于传统使用的分时共享的方式。当更多的计算资源，以更高密度容纳进入一块GPU设备中时，通过空间分片的方式实现更为高效的多任务间的并行性。MIG在分片粒度上提供了一定的灵活性，可以让不同的实例占有不同数量的计算资源。更大密度的并行运算，更为可控的算力分配，在本地和平台虚拟化场景下，都有更好的用户体验。每个MIG实例可以独立地进行工作，数据和算力双隔离。

为了能够支持MIG功能，硬件在设计的时候，让计算单元CE和内存单元（LLC、HBM）可以按照一定的规则进行切分，GPU Instance的最大数量被设计成8份。

![image.png](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/8706138771/p1071186.png)

### 1.1 GPU Instance

GPU Instance(GI)表示PPU更细粒度的分片，拥有独立的计算单元，内存，DMA以及VIDEO资源。GI可以更细粒度的划分出CI，CI拥有独立的计算单元和VIDEO资源，共享GI中的内存单元和DMA。GI之间支持故障隔离，多个GI并行跑任务时不相互影响，GI发生故障时可以单独复位。

### 1.2 Compute Instance

PPU MIG的支持是以Compute Instance为粒度（多个CI共享GI），CI是GI更细粒度的分片。APP的必须运行在CI上，CI不支持独立复位。

## 2\. MIG的使用

MIG的使用方式和Nvidia A100 MIG的使用方式一致，首先需要通过ppu-smi工具创建MIG。

### 2.2 开启/关闭PPU的MIG模式

只有当PPU当前没有其他进程占用时，才能开启和关闭MIG模式，否则该步骤会失败，开启和关闭的命令如下:

```bash
ppu-smi -i ${ppuId} -mig 1
```

```bash
ppu-smi -i ${ppuId} -mig 0
```

可以通过ppu-smi查询当前PPU是否开启MIG模式，如下图所示，PPU0开启了MIG mode；PPU1关闭MIG mode

![image.png](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/8706138771/p1071176.png)

**注意：关闭MIG模式前需要确认当前PPU上没有其他GPU Instance和Compute Instance(MIG)，否则关闭操作会失败，GPU Instance的查询参考2.2.3，Compute Instance的查询参考2.3.3**

### 2.2 创建、查询、复位和销毁GPU Instance

#### 2.2.1 查询GPU Instance profile

查询支持的GPU Instance profile，命令如下:

```bash
ppu-smi mig -i ${ppuId} -lgip
```

查询结果如下:

![image.png](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/8706138771/p1071174.png)

PPU1.0 机型支持4种GPU Instance Profile，ID 分别为3,2,1,0

PPU1.1 机型，目前只支持二切片的规格， ID 分别为3,2

以Profile ID 2为例说明:

- `0` 表示当前查询设备是PPU0
- `MIG 4g24gb` 表示当前Profile 的名字，4g表示4个slice，24gb表示24GByte Memory
- `*2*` 表示当前Profile ID
- `2/2` Free:当前还可以创建2个GI， Total：最多创建2个GI
- `24.00` 表示当前Profile GI的内存大小
- `*No*` 表示当前GPU instance 不支持P2P, PPU MIG模式下不支持P2P
- `*32*` 表示32个compute unit
- `*2*` 表示2个decoder engine
- `*2*` 表示2个encoder engine
- `2` 表示2个dma engine
- `2` 表示2个jpeg engine
- `*0*` 表示 0个OFA，PPU不支持OFA

#### 2.2.2 创建GPU Instance

创建Profile 2的GPU Instance，命令如下:

```bash
ppu-smi mig -i ${ppuId} -cgi ${profileId}
```

创建结果如下:

![image.png](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/8706138771/p1071177.png)

#### 2.2.3 查询GPU Instance

```bash
ppu-smi mig -i ${ppuId} -lgi
```

输出如下:

![image.png](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/8706138771/p1071179.png)

Instance ID 0表示当前GI在PPU0的序号，0:4 Start 0表示0 slot，4表示4个slice，如下图红框：

#### 2.2.4 复位GPU Instance

重置GPU Instance前需要确保当前GPU Instance下的所有Compute Instance都是空闲状态。

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -r
```

输出结果如下:

#### 2.2.5 销毁GPU Instance

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -dgi
```

输出如下:

### 2.3 创建、查询和销毁Compute Instance

#### 2.3.1 查询Compute Instance profile

查询支持的Compute Instance profile，命令如下:

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -lcip
```

输入结果如下:

PPU1.0 机型支持 Compute Instance Profile 比较多，最多 19 种 Profile

PPU1.1 机型，目前只支持二切片的规格

以Profile 2为例说明：

- 0 表示当前查询设备是PPU0。
- 0 表示当前查询GPU Instance设备是0。
- MIG 3u4g24gb 表示当前Profile 的名字，3u表示3个compute unit，4g24gb表示GPU Instance Profile名字。
- ***2*** 表示当前Profile ID。
- 8/8 Free:当前还可以创建8个CI， Total：最多创建8个CI。
- 3 表示当前Profile CI具有3个compute unit。
- 剩余参考GPU Instance Profile说明。

#### 2.3.2 创建Compute Instance

创建Profile 3的Compute Instance，命令如下：

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -cci ${profileId}
```

输出如下：

#### 2.3.3 查询Compute Instance

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -lci
```

输出如下：

成功创建Compute Instance后，ppu-smi也可以直接查询到Compute Instance，如下图：

PPU0卡上有一个Compute Instance(MIG)，属于GPU Instance 0，该Compute Instance具有4个compute unit

***查询Compute Instance UUID***

```bash
ppu-smi -L
```

输出结果如下， `MIG-4416c2c4-534e-4236-b26a-24692af597a1` 表示当前Compute Instance的UUID。

#### 2.3.4 销毁Compute Instance

```bash
ppu-smi mig -i ${ppuId} -gi ${giId} -ci ${ciId} -dci
```

输出如下：

### 2.4 Host使用MIG设备

在Host中使用MIG设备时，只需要使用CUDA\_VISIBLE\_DEVICES指定MIG的UUID即可，UUID的获取可以通过ppu-smi获取。

```bash
export CUDA_VISIBLE_DEVICES=MIG-4416c2c4-534e-4236-b26a-24692af597a1
./app
```

### 2.5 容器中使用MIG设备

我们可以将MIG设备透传到容器中使用。具体用法可以参考 [容器隔离使用指南](https://help.aliyun.com/zh/document_detail/3031170.html) 。

## 3\. 注意事项

### 3.1 PPU开启了MIG或只创建了GI时是不能使用的

如下图，此时通过 **CUDA\_VISIBLE\_DEVICES=0 运行程序会失败。**

### 3.2 多PPU存在CI时，app默认跑在第一个CI上

如下图：

- 未指定 CUDA\_VISIBLE\_DEVICES 时，app默认跑在PPU-1/GI-0/CI-0上。
- CUDA\_VISIBLE\_DEVICES=0 时，app运行在PPU0上。
- CUDA\_VISIBLE\_DEVICES=1 时，app运行在PPU-1/GI-0/CI-0上。
- CUDA\_VISIBLE\_DEVICES=MIG-UUID，app运行在指定CI上。

### 3.3 CUDA\_VISIBLE\_DEVICES可以同时指定多个PPU和单个CI

以下命令都是合法的：

```bash
CUDA_VISIBLE_DEVICES=3                    # 选择使用PPU3
CUDA_VISIBLE_DEVICES=3,PPU-${UUID},1      # 选择使用PPU3,PPUx,PPU1
CUDA_VISIBLE_DEVICES=MIG-${UUID}          # 选择使用单个CI
```

### 3.4 CUDA\_VISIBLE\_DEVICES同时指定PPU+CI

#### 3.4.1 如果第一个设备是MIG，那么只有该MIG生效，其他设备忽略。

```bash
CUDA_VISIBLE_DEVICES=MIG-${UUID},3,PPU-${UUID}          # 只有MIG-${UUID} 生效
```

#### 3.4.2 如果第一个设备不是MIG，那么只有第一个MIG前的所有PPU生效。

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
