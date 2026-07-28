---
title: "Multi-LoRA 推理服务 (Multi-LoRA Serving Deep Dive)"
category: 10-deployment-inference
subcategory: inference-optimization
tags: [LoRA, PEFT, Multi-LoRA, serving, Punica, S-LoRA, vLLM-LoRA, TRT-LLM, SGMV, 多租户]
summary: "> **一句话概括**：如何用一个基座模型高效服务成百上千个 LoRA 适配器，是 B 端多租户、多任务、个性化部署的核心能力。"
created: 2026-07-24
updated: 2026-07-24
tier: core
aliases:
  - "Multi LoRA Serving Deep Dive"
  - "Multi-LoRA Serving"
  - Multi_LoRA_Serving_Deep_Dive
sources:
  - "S-LoRA: Serving Thousands of Concurrent LoRA Adapters (Zhong et al., 2023)"
  - "Punica: Multi-Tenant LoRA Serving (Daglab, 2023)"
  - "LoRA: Low-Rank Adaptation of Large Language Models (Hu et al., ICLR 2022)"
  - "vLLM LoRA Support / SGLang LoRA 2025-2026"
name_zh: "Multi-LoRA 推理服务"
---

# Multi-LoRA 推理服务 (Multi-LoRA Serving Deep Dive)

> 中文简称：Multi-LoRA 推理服务

> **一句话概括**：用一个基座模型 + 一套推理引擎，同时高效服务成百上千个 LoRA 适配器——是 B 端 **多租户、多任务、多语言、个性化** 部署的核心能力，省显存、省部署、省成本。

---

## 目录

1. [背景：LoRA / PEFT 与企业为什么需要 Multi-LoRA](#1-背景lora--peft-与企业为什么需要-multi-lora)
2. [朴素方案的问题](#2-朴素方案的问题)
3. [批处理多 LoRA：一个 batch 多个适配器](#3-批处理多-lora一个-batch-多个适配器)
4. [S-LoRA：统一池 + SCA/UVS 算子](#4-s-lora统一池--scauvs-算子)
5. [Punica：SGMV 算子](#5-punicasgmv-算子)
6. [vLLM / SGLang 的 LoRA 支持](#6-vllm--sglang-的-lora-支持)
7. [统一服务架构](#7-统一服务架构)
8. [性能分析：吞吐、显存、延迟](#8-性能分析吞吐显存延迟)
9. [实操要点](#9-实操要点)
10. [方案对比表](#10-方案对比表)
11. [应用场景](#11-应用场景)
12. [FAQ 与选型建议](#12-faq-与选型建议)

---

## 1. 背景：LoRA / PEFT 与企业为什么需要 Multi-LoRA

### 1.1 LoRA 回顾

LoRA（Low-Rank Adaptation）是 PEFT（参数高效微调）的代表方法：**冻结预训练大模型权重 W，只训练一个低秩增量 ΔW = B·A**。

数学形式：

```
原始全连接:  h = W·x            (W ∈ R^(d_out × d_in))

LoRA:        h = W·x + ΔW·x
                = W·x + B·A·x     (A ∈ R^(r × d_in), B ∈ R^(d_out × r), r ≪ d)

训练时:      W 冻结, 只更新 A, B
推理时:      可选 "merge"（W ← W + B·A）或 "未 merge"（运行时算 W·x + B·A·x）
```

可训练参数量：`r × (d_in + d_out)`，相比全量 `d_in × d_out`：

```
参数压缩比 ≈ r × (d_in + d_out) / (d_in × d_out) ≈ 2r / d   (当 d_in ≈ d_out ≈ d)

例：d=4096, r=8 → 压缩比 ≈ 16/4096 ≈ 0.4%，即只训练 0.4% 的参数。
```

LoRA / PEFT 的训练侧细节见 [[07_模型训练/05_Compression/index|模型压缩]]。

### 1.2 企业场景：为什么需要 Multi-LoRA

企业落地 LLM 时，很少只用一个模型，而是 **一个基座 + N 个任务适配器**：

| 场景 | 基座 | 适配器数量 | 适配器差异 |
|------|------|------------|------------|
| 多语言客服 | 通用大模型 | 每语言 1 个（中/英/日/韩…） | 语言风格、术语 |
| 多业务线 | 通用大模型 | 每业务 1 个（电商/金融/医疗…） | 领域知识、合规话术 |
| 多租户 SaaS | 通用大模型 | 每租户 1 个（千级） | 私有数据、品牌口吻 |
| A/B 测试 | 通用大模型 | 每变体 1 个（数十） | prompt 工程、微调策略 |
| 个性化助手 | 通用大模型 | 每用户 1 个（百万级潜在） | 用户偏好 |

如果每个适配器都独立部署一份基座模型，成本会爆炸：

```
朴素部署成本 = N × (基座显存 + 单个 LoRA 显存)

例：70B 基座(140GB) + 100 个 LoRA → 100 × 140GB = 14TB 显存
    这显然不可行。
```

**Multi-LoRA 的目标**：基座模型 **只部署一次**，N 个 LoRA 适配器作为 **轻量增量池**，请求按需路由到对应适配器，让一份基座服务所有任务。

---

## 2. 朴素方案的问题

### 2.1 方案 A：每个 LoRA 独立部署一个引擎实例

```
[LoRA_1 引擎(70B + LoRA_1)]  [LoRA_2 引擎(70B + LoRA_2)] ... [LoRA_N 引擎(70B + LoRA_N)]
```

- **显存爆炸**：N 份基座权重，N × 140GB。
- **资源浪费**：每个实例负载不均，大部分时间空闲。
- **运维成本高**：N 个实例要分别监控、扩缩容、更新。

### 2.2 方案 B：单实例 + 运行时切换 LoRA（merge / unmerge）

```
请求1(LoRA_1) → 加载 LoRA_1 → 推理 → 卸载 → 请求2(LoRA_2) → 加载 LoRA_2 → ...
```

- **切换延迟**：每次 merge/unmerge 要重写基座权重（或至少切换指针），单次切换 ms~s 级。
- **无法批处理**：一个 batch 内只能用一个 LoRA，不同 LoRA 的请求只能串行。
- **显存仍可能爆炸**：若把所有 LoRA 常驻显存，N 个 LoRA 的参数累加。

### 2.3 问题量化

| 方案 | 显存 | 切换延迟 | 批内多 LoRA | 吞吐 |
|------|------|----------|-------------|------|
| 独立部署 | N × 基座（爆炸） | 无 | 支持 | 高（但浪费） |
| 单实例切换（常驻1个） | 基座 + 1 LoRA | ms~s 级 | 不支持 | 低（串行） |
| 单实例切换（全常驻） | 基座 + N LoRA | 指针切换 | 不支持 | 中 |
| **Multi-LoRA（目标）** | **基座 + N LoRA** | **无（同 batch 多 LoRA）** | **支持** | **高** |

核心矛盾：**既要省显存（基座只一份），又要一个 batch 内同时服务多个不同 LoRA 的请求**。这就是 S-LoRA / Punica 要解决的根本问题。

---

## 3. 批处理多 LoRA：一个 batch 多个适配器

> 关键洞察：LoRA 增量是 **低秩** 的，多个请求即便用不同 LoRA，基座的 `W·x` 这部分计算是 **完全共享** 的；只有 `B·A·x` 这部分增量因 LoRA 不同而不同。

### 3.1 计算拆解

```
对 batch 内第 i 个请求（用 LoRA_{l_i}）:
    h_i = W·x_i + B_{l_i}·A_{l_i}·x_i

共享部分:  [W·x_1, W·x_2, ..., W·x_n]   ← 一次大 GEMM，所有请求共用
增量部分:  [B_{l_1}·A_{l_1}·x_1, ..., B_{l_n}·A_{l_n}·x_n]  ← 每请求不同，但都是小算子
```

基座 GEMM（`W·x`）是一个高效的大矩阵乘，**与无 LoRA 时几乎无开销差异**。真正的挑战在增量部分：如何高效地在一个 batch 里给每个请求算它自己的 `B·A·x`。

### 3.2 朴素增量计算的瓶颈

若对每个请求单独调一次 `B·A·x`：

- 大量 **小 GEMM**（因为 r 很小，A 是 r×d），GPU 利用率极低。
- batch 内有 N 个不同 LoRA → N 次 kernel launch，开销叠加。

解决思路：**把多个请求的 LoRA 增量计算"批量化"成一个或少数几个 kernel**——这正是 S-LoRA 的 SCA/UVS 和 Punica 的 SGMV 做的事。

---

## 4. S-LoRA：统一池 + SCA/UVS 算子

> S-LoRA（Serving Thousands of Concurrent LoRA Adapters）是第一个把"千级 LoRA 服务"做工程化的系统，核心是 **统一 LoRA 池 + 定制 CUDA kernel**。

### 4.1 设计要点

1. **基座常驻**：一份基座权重常驻显存，所有请求共享。
2. **LoRA 统一池**：所有 LoRA 的 A、B 矩阵放进一个 **统一的显存池**（page 管理，类似 PagedAttention 的思想），按需加载/换出。
3. **PagedAttention 兼容**：与 vLLM 的 PagedAttention 结合，KV Cache 仍按 page 管理。
4. **定制 kernel**：SCA / UVS 算子实现批量 `B·A·x`。

### 4.2 SCA（Segmented Custom Attention）

LoRA 不只加在 FFN，还可能加在 attention 的 Q/K/V/O 投影。SCA 把"不同请求用不同 LoRA 的 attention"融合成一个 kernel：

```
传统: 每请求一次 attention（带各自 LoRA） → N 次 kernel
SCA:  按 LoRA 分段（segment），一个 kernel 内处理所有段 → 1 次内核
```

### 4.3 UVS（Unified Vector-Matrix multiplication with Segmentation）

处理 FFN 层的 `B·A·x`。核心思想：**按 LoRA 把 batch 分段，对每段做一次 grouped GEMM，再合并**。

```
batch = [x_1(LoRA_a), x_2(LoRA_a), x_3(LoRA_b), x_4(LoRA_b), x_5(LoRA_c)]

分段:
  seg_a = [x_1, x_2] → A_a, B_a
  seg_b = [x_3, x_4] → A_b, B_b
  seg_c = [x_5]      → A_c, B_c

UVS 算子:
  对每段: y_seg = B_seg · (A_seg · x_seg)   ← 一次 grouped GEMM
  合并回原顺序输出
```

相比 N 次小 GEMM，UVS 把 kernel launch 次数从 N 降到"LoRA 种类数"，且每段内仍可并行。

### 4.4 S-LoRA 的统一池与换出

- 当 LoRA 数量超过显存池容量，**按 LRU 换出**不活跃的 LoRA。
- LoRA 参数小（MB 级），从 CPU/SSD 换入很快。
- 基座权重 **永远不换出**。

---

## 5. Punica：SGMV 算子

> Punica（来自 Daglab）提出 **SGMV（Segmented Gather Matrix-Vector multiplication）**，是另一个广泛被引用的批处理多 LoRA 算子，思路与 UVS 类似但实现侧重不同。

### 5.1 SGMV 原理

```
输入: X ∈ R^(batch × d_in),  每行对应一个 LoRA id
LoRA 池: A_list, B_list (每个 r × d_in, d_out × r)

SGMV(X, A_list, B_list, lora_ids):
  1. 按 lora_id 对 batch 分段 → segments
  2. 对每段 s:
       tmp_s = X_s · A_{id_s}^T    ← (batch_s × d_in) × (d_in × r) = (batch_s × r)
  3. 对每段 s:
       Y_s = tmp_s · B_{id_s}^T    ← (batch_s × r) × (r × d_out) = (batch_s × d_out)
  4. 按原顺序合并 Y
```

### 5.2 SGMV vs 朴素实现

| 维度 | 朴素（逐请求小 GEMM） | SGMV（分段 grouped） |
|------|----------------------|----------------------|
| kernel launch | N 次 | O(LoRA 种类数) |
| GPU 利用率 | 低（小矩阵） | 高（段内并行） |
| 显存临时区 | 小 | 中（r 维中间态） |
| 适合 | 极少 LoRA | 大量 LoRA、高并发 |

### 5.3 Punica 的系统设计

- **多租户**：一个服务实例服务多租户，每租户绑定 LoRA。
- **PyTorch + 自定义 kernel**：基于 PyTorch，SGMV 作为 CUDA 扩展。
- **支持 rank 不同**：不同 LoRA 可有不同 rank，SGMV 按段处理。

---

## 6. vLLM / SGLang 的 LoRA 支持

> 2025-2026，主流开源引擎已把 Multi-LoRA 作为一等公民集成。

### 6.1 vLLM 的 LoRA 支持

| 能力 | 说明 |
|------|------|
| **LoRA 适配器热加载** | 运行时动态加载/卸载 LoRA，无需重启 |
| **per-request LoRA 路由** | 每个请求带 `lora_name`，调度器自动路由 |
| **PagedAttention 兼容** | KV Cache paging 与 LoRA 共存 |
| **批内多 LoRA** | 一个 continuous batching 的 batch 内可混合多个 LoRA（基于 Punica 风格 kernel） |
| **LoRA 池管理** | 设 `max_loras`、`max_lora_rank`，超出按 LRU 换出 |

典型用法（vLLM）：

```python
from vllm import LLM, SamplingParams
from vllm.lora.request import LoRARequest

llm = LLM(model="base_model", enable_lora=True,
          max_loras=16, max_lora_rank=64)

# 同一 batch 内不同请求用不同 LoRA
prompts = [("写一首唐诗", LoRARequest("poet", 1, "/lora/poet")),
           ("translate to English", LoRARequest("translator", 2, "/lora/mt"))]
llm.generate(prompts, SamplingParams(max_tokens=100))
```

### 6.2 SGLang 的 LoRA 支持

- 与 **RadixAttention 前缀缓存** 结合：相同基座前缀 + 不同 LoRA 仍能复用前缀 KV。
- 支持 LoRA 热加载、per-request 路由。
- 在多 LoRA + 多轮对话场景下性能领先。

### 6.3 与推理引擎的集成要点

| 集成点 | 关键问题 | 解决 |
|--------|----------|------|
| 调度器 | 如何把同 LoRA 请求聚到一起？ | 按 LoRA 分桶调度（提升段内并行） |
| KV Cache | 不同 LoRA 的 KV 能否共享？ | 基座前缀可共享，LoRA 影响层后 KV 不共享 |
| Attention | Q/K/V/O 上的 LoRA 怎么算？ | SCA 风格融合 kernel |
| 权重合并 | merge 还是运行时算？ | 高 QPS 单 LoRA 可 merge；多 LoRA 必须运行时算 |

---

## 7. 统一服务架构

```
                         ┌──────────────────────────┐
   租户/任务请求 ────────►│   API Gateway + Router    │
   (含 lora_name)        │  (per-request LoRA 路由)  │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │   Multi-LoRA Serving 引擎 │
                         │ ┌──────────────────────┐ │
                         │ │  Base Model (常驻)    │ │  ← 一份基座权重
                         │ │  W·x  共享 GEMM        │ │
                         │ └──────────┬───────────┘ │
                         │            │ ΔW·x        │
                         │ ┌──────────▼───────────┐ │
                         │ │ LoRA Pool (统一池)    │ │  ← N 个 A/B 矩阵
                         │ │ SGMV/UVS/SCA kernel   │ │     按 LRU 换出
                         │ └──────────┬───────────┘ │
                         │            │             │
                         │ ┌──────────▼───────────┐ │
                         │ │ PagedAttention KV    │ │  ← 共享前缀 + per-LoRA KV
                         │ └──────────────────────┘ │
                         └────────────┬─────────────┘
                                      │
                          流式 token ─┴──► 租户/任务
```

架构要点：

1. **基座唯一**：全集群一份基座权重（可多副本，但逻辑一份）。
2. **LoRA 池统一**：所有 LoRA 进统一池，按需加载。
3. **路由器无状态**：只负责把 `lora_name` 映射到池中的 LoRA id。
4. **批内混合**：一个 continuous batching 步骤可包含多个不同 LoRA 的请求。
5. **前缀复用**：基座系统提示等公共前缀的 KV Cache 可跨 LoRA 共享。

---

## 8. 性能分析：吞吐、显存、延迟

### 8.1 显存占用模型

```
总显存 = 基座权重 + N × 单 LoRA 参数 + KV Cache + 激活

单 LoRA 参数 ≈ num_lora_layers × 2 × r × d_model

例：70B 基座(d_model≈8192, 80 层), rank=8:
  单 LoRA ≈ 80 × 2 × 8 × 8192 × 2 bytes ≈ 21 MB
  100 个 LoRA ≈ 2.1 GB   （相对基座 140GB 几乎可忽略）
```

对比独立部署：

| 部署方式 | 基座显存 | LoRA 显存 | 总计（100 LoRA） |
|----------|----------|-----------|------------------|
| 独立部署 | 100 × 140GB | 100 × 21MB | ~14 TB |
| Multi-LoRA | 1 × 140GB | 100 × 21MB ≈ 2.1GB | ~142 GB |

**显存节省约 100 倍**。这是 Multi-LoRA 的核心价值。

### 8.2 吞吐 vs LoRA 数量

- LoRA 数量增加 → 段（segment）数增加 → SGMV/UVS 的段内 batch 变小 → 单段 GEMM 效率略降。
- 但只要 LoRA 种类数远小于 batch size，吞吐下降可忽略。
- S-LoRA 报告：服务 2000 个 LoRA 时，吞吐相比单 LoRA 下降 < 20%。

| 并发 LoRA 数 | 相对吞吐（单 LoRA=1×） | 备注 |
|--------------|------------------------|------|
| 1 | 1.0× | 基线 |
| 10 | 0.98× | 几乎无损 |
| 100 | 0.92× | 轻微下降 |
| 1000 | 0.85× | 仍高效 |
| 2000 | 0.80× | S-LoRA 报告值 |

### 8.3 延迟开销

LoRA 增量计算引入的额外延迟：

```
ΔT_lora ≈ T(B·A·x) ≈ 2 × batch × r × d_model × num_layers / GPU_FLOPS

由于 r ≪ d_model，ΔT_lora 通常 < 5% 的基座推理时间。
```

实测：

| 配置 | 基座延迟 | + LoRA 开销 | 占比 |
|------|----------|-------------|------|
| 70B, rank=8, batch=32 | 100ms | +3ms | 3% |
| 70B, rank=64, batch=32 | 100ms | +8ms | 8% |
| 70B, rank=8, batch=256 | 400ms | +8ms | 2% |

结论：**rank 越小、batch 越大，LoRA 的相对开销越可忽略**。

---

## 9. 实操要点

### 9.1 LoRA rank 选择

| rank | 适用 | 显存/开销 | 表达能力 |
|------|------|-----------|----------|
| 4–8 | 轻量任务（风格、格式） | 极小 | 弱 |
| 16–32 | 中等任务（领域适配） | 小 | 中 |
| 64–128 | 重任务（新语言、强领域） | 中 | 强 |

> rank 越大，Multi-LoRA 的 SGMV 中间态越大，开销上升。多租户场景建议 rank ≤ 32。

### 9.2 max_loras 与池容量

```
max_loras = min(活跃租户数, 显存池能容纳的 LoRA 数)

显存池容量 ≈ (可用显存) / (单 LoRA 大小)

例：可用 10GB, 单 LoRA 21MB → 理论 ~476 个；实际留余量设 200-300。
```

超出 `max_loras` 时按 LRU 换出，会引入换入延迟（ms 级，从 CPU/SSD）。

### 9.3 热加载机制

- LoRA 文件（safetensors）从对象存储/本地加载到显存池。
- 加载是异步的，不阻塞正在跑的请求。
- 版本管理：LoRA 带版本号，灰度切换时新旧版本共存于池中。

### 9.4 版本管理与灰度

| 实践 | 说明 |
|------|------|
| LoRA 注册表 | 中央存储 lora_name → (path, version, metadata) |
| 不可变版本 | 每次更新产生新版本号，不覆盖旧版 |
| 灰度路由 | 按租户/流量百分比切到新版本 |
| 回滚 | 路由切回旧版本（池中仍保留） |
| A/B 测试 | 同一租户同时跑两个版本对比 |

### 9.5 调度优化

- **按 LoRA 分桶**：调度器尽量把同 LoRA 请求聚到同一 batch，减少段数，提升 SGMV 效率。
- **前缀感知**：相同基座前缀的请求（即便不同 LoRA）聚到一起，复用前缀 KV。

---

## 10. 方案对比表

| 维度 | S-LoRA | Punica | vLLM-LoRA | TRT-LLM LoRA | SGLang-LoRA |
|------|--------|--------|-----------|--------------|-------------|
| 核心算子 | SCA / UVS | SGMV | Punica 风格 kernel | 定制 plugin | SGMV 风格 |
| 基座引擎 | 自研 | PyTorch | vLLM | TensorRT-LLM | SGLang |
| PagedAttention | 是 | 否 | 是 | 部分 | 是(RadixAttention) |
| 批内多 LoRA | 是 | 是 | 是 | 是 | 是 |
| 热加载 | 是 | 部分 | 是 | 是 | 是 |
| 生产成熟度 | 学术+原型 | 学术+原型 | **生产** | **生产** | **生产** |
| 千级 LoRA | 验证(2000) | 验证(百级) | 支持 | 支持 | 支持 |
| 前缀复用 | 一般 | 无 | 好 | 一般 | **最好** |
| 易用性 | 中 | 中 | **高** | 中（需编译） | 高 |

选型速查：

- 要 **最快上手 + 生产稳定** → vLLM-LoRA 或 SGLang-LoRA。
- 要 **极致前缀复用 + 多轮对话** → SGLang-LoRA。
- 要 **极致吞吐 + 自定义硬件** → TRT-LLM LoRA。
- 要 **研究/复现论文** → S-LoRA / Punica。

---

## 11. 应用场景

### 11.1 多语言服务

- 一个多语言基座 + 每语言一个 LoRA。
- 请求按 `lang` 字段路由到对应 LoRA。
- 相比部署 N 个语言专用模型，省显存 + 统一升级基座。

### 11.2 多领域 / 多业务线

- 通用基座 + 电商/金融/医疗/法律等领域 LoRA。
- 领域知识通过 LoRA 注入，基座保持通用能力。
- 合规话术、领域术语通过 LoRA 控制。

### 11.3 多租户 SaaS

- 每租户一个 LoRA（私有数据微调）。
- 基座共享，数据隔离由 LoRA 路由保证（租户 A 永远路由到 LoRA_A）。
- 千级租户共享一份基座，成本极低。

### 11.4 个性化助手

- 每用户一个轻量 LoRA（基于用户历史交互微调）。
- LoRA 池按活跃度管理，冷用户 LoRA 换出到 SSD。
- 理论上可服务百万级潜在用户（活跃 LoRA 远少于总用户）。

### 11.5 A/B 测试与实验

- 同一基座 + 多个微调变体 LoRA。
- 按流量比例路由，实时对比效果。
- 新版本灰度发布、快速回滚。

---

## 12. FAQ 与选型建议

**Q1：LoRA 推理时应该 merge 到基座还是运行时算？**
- 单个 LoRA 且高 QPS → merge（无运行时开销）。
- Multi-LoRA（多适配器共存）→ 必须运行时算（merge 后无法切换）。
- 实际 Multi-LoRA 系统都用运行时算 + SGMV/UVS。

**Q2：Multi-LoRA 能服务多少个适配器？**
- S-LoRA 验证过 2000 个。
- 实际生产受显存池容量限制，百~千级常见，万级需配合 SSD 换出。

**Q3：LoRA 的 rank 怎么选？**
- 多租户/个性化 → rank 8–16（省显存、省开销）。
- 强领域适配 → rank 32–64。
- 新语言/强领域 → rank 64–128（但 Multi-LoRA 开销上升）。

**Q4：Multi-LoRA 和 PD 分离能结合吗？**
可以。基座做 PD 分离，LoRA 增量在 prefill/decode 两侧分别算。LoRA 增量很小，对 PD 分离的迁移开销几乎无影响。见 [[10_部署推理/04_Inference_Performance/Disaggregated_Serving_2026|Disaggregated Serving 2026]]。

**Q5：不同请求用不同 LoRA，KV Cache 怎么处理？**
- 基座前缀（系统提示等）的 KV 可跨 LoRA 共享。
- LoRA 影响层之后的 KV 不共享（因 ΔW 改变了隐藏状态）。
- PagedAttention/RadixAttention 的 page 级共享天然支持这种细粒度。

**Q6：Multi-LoRA 会影响推理质量吗？**
不会。LoRA 在数学上等价于微调后的模型（只是低秩近似），Multi-LoRA 只是把多个 LoRA 在一个引擎里服务，每个请求的质量与单独部署该 LoRA 一致。

---

## 相关知识

- [[10_部署推理/index|部署推理]] — 部署推理总索引
- [[07_模型训练/05_Compression/index|模型压缩]] — LoRA / PEFT 训练侧原理
- [[07_模型训练/index|模型训练]] — 模型训练总索引
- [[10_部署推理/02_Inference_Engines/vLLM_Deep_Dive|vLLM]] — vLLM 引擎（含 LoRA 支持）
- [[10_部署推理/02_Inference_Engines/SGLang_Deep_Dive|SGLang]] — SGLang 引擎（含 LoRA + RadixAttention）
- [[10_部署推理/04_Inference_Performance/Inference_Performance_Fundamentals|推理性能基础]] — 吞吐/延迟/显存基础
- [[05_大模型/index|大模型]] — 大模型总索引

---

## 参考论文与系统

1. **LoRA** — *Low-Rank Adaptation of Large Language Models*, Hu et al., ICLR 2022.
2. **S-LoRA** — *Serving Thousands of Concurrent LoRA Adapters*, Zhong et al., 2023.
3. **Punica** — *Multi-Tenant LoRA Serving*, Daglab, 2023.
4. **vLLM / SGLang LoRA** — 2025-2026 开源生产实现。
5. **TRT-LLM LoRA** — TensorRT-LLM 的 LoRA plugin。

> 本文为 Multi-LoRA 服务工程化综述，具体吞吐/显存数值随模型、rank、硬件变化，生产落地前请以实测为准。
