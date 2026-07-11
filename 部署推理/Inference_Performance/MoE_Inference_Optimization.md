---
title: MoE 推理优化
category: 10-deployment-inference-inference-performance
tags: [inference, moe, mixture-of-experts, expert-parallelism, all-to-all, performance]
summary: "> MoE 模型用稀疏激活降低推理成本，但 All-to-All 通信和负载不均衡成为新的性能瓶颈。"
created: 2026-06-15
updated: 2026-06-15
tier: supporting
aliases:
  - "Moe Inference Optimization"
  - "MoE Inference Optimization"
  - MoE_Inference_Optimization
sources: []

---
# MoE 推理优化

> MoE（Mixture of Experts）让大模型“看着很大，用着很小”，但推理时要搞定 All-to-All 通信和专家负载均衡。

---

## 1. MoE 推理的基本特点

MoE 模型（如 DeepSeek-V3、Mixtral 8x22B、Qwen-MoE）的核心思想：

- **参数很多**：总参数量可以是同性能 Dense 模型的 5-10 倍。
- **激活很少**：每个 token 只激活少数几个专家（如 2/8 或 1/16）。
- **推理成本低**：每次前向传播的 FLOPs 接近小模型，但显存要放下全部专家参数。

### 1.1 为什么 MoE 推理快却不简单

虽然激活参数少，但 MoE 引入了两个新问题：

1. **All-to-All 通信**：每个 token 要路由到不同专家，跨卡/跨节点搬数据。
2. **负载不均衡**：某些专家可能被大量 token 选中，形成热点，其他专家空闲。

这两个问题处理不好，MoE 的实际吞吐可能反而不如 Dense 模型。

---

## 2. 核心瓶颈：All-to-All 通信

### 2.1 通信是怎么发生的

在一个 MoE 层中：

1. Router 决定每个 token 要发送给哪几个专家。
2. Token 被分发（dispatch）到对应专家所在的 GPU/节点。
3. 专家计算完后，结果再收集（combine）回来。

这个分发+收集就是 **All-to-All 通信**。

```
[Token 0] ──┐
[Token 1] ──┼──► Router ──► All-to-All Dispatch ──► [Expert 0] [Expert 1] ... [Expert N]
[Token 2] ──┘                                              │
                                                           ▼
                                                 All-to-All Combine ──► 输出
```

### 2.2 通信开销来源

| 因素 | 影响 |
|------|------|
| **专家数量** | 越多，路由越复杂 |
| **激活专家数** | Top-K 越大，通信量越大 |
| **卡间/节点间带宽** | NVLink > InfiniBand > 以太网 |
| **Batch size** | Batch 越大，每次 All-to-All 数据量越大 |
| **序列长度** | 长上下文增加 hidden states 体积 |

### 2.3 优化方向

| 技术 | 作用 |
|------|------|
| **Expert Parallelism (EP)** | 把不同专家放到不同 GPU，减少单卡显存 |
| **Token 分组与合并** | 减少细粒度通信次数 |
| **通信与计算重叠** | 用 pipeline 隐藏 All-to-All 延迟 |
| **受限路由 / Top-1** | 减少激活专家数，降低通信量 |
| **FP8/INT8 通信** | 压缩传输数据 |

---

## 3. 专家并行（Expert Parallelism, EP）

### 3.1 EP 的基本思想

把专家参数分散到多张 GPU 上，每张卡只存一部分专家。

```
GPU 0: Expert 0, 1, 2, 3
GPU 1: Expert 4, 5, 6, 7
GPU 2: Expert 8, 9, 10, 11
GPU 3: Expert 12, 13, 14, 15
```

每个 token 根据自己的路由结果，被发到存有所需专家的 GPU。

### 3.2 EP 的通信模式

- **All-to-All**：token 在 GPU 间交换。
- **All-Reduce/All-Gather**：非专家部分（如 self-attention）需要聚合梯度/激活。

### 3.3 EP 度选择

| EP 度 | 含义 | 适用场景 |
|--------|------|----------|
| EP=1 | 所有专家在一卡上 | 小模型、单卡能放下 |
| EP=8 | 专家分到 8 卡 | 常见生产配置 |
| EP=16/32 | 专家分到更多卡 | 超大 MoE、多节点 |

> EP 度越高，单卡显存压力越小，但 All-to-All 跨卡/跨节点通信越多。

---

## 4. 负载均衡

### 4.1 为什么负载会不均衡

- 某些专家因为语义相似性被频繁选中（例如代码专家、数学专家）。
- 长尾分布导致少数专家成为瓶颈。

### 4.2 负载均衡优化

| 技术 | 作用 |
|------|------|
| **Auxiliary Loss** | 训练时鼓励 token 均匀分布到各专家 |
| **Expert Capacity** | 限制每个专家处理的 token 数，超出部分 overflow |
| **Load Balancing Router** | 推理时根据专家负载动态调整路由 |
| **冗余专家 / 热专家复制** | 把热点专家复制到多张卡 |
| **Dynamic Routing** | 根据运行时负载选择专家 |

### 4.3 实际影响

- 负载不均衡时，系统吞吐由最忙的专家决定。
- 好的负载均衡可以让 GPU 利用率从 50% 提升到 85%+。

---

## 5. DeepSeek-V3 / Mixtral 实践要点

### 5.1 DeepSeek-V3

- **参数**：总参 671B，激活 37B。
- **专家配置**：256 个专家，每 token 激活 8 个（Top-8）。
- **优化**：
  - MLA 压缩 KV Cache，减少显存占用。
  - FP8 训练与推理，降低通信和计算量。
  - Expert Parallelism + Pipeline Parallelism 组合。
  - 高效的 All-to-All 内核实现。

### 5.2 Mixtral 8x22B

- **参数**：8 个专家，总参 141B，激活 39B。
- **专家配置**：每 token 激活 2 个专家（Top-2）。
- **优化**：
  - EP=8 是常见配置，每张卡一个专家。
  - 需要优化 Top-2 路由的 All-to-All。

---

## 6. 部署建议

| 场景 | 建议 |
|------|------|
| 单卡能放下模型 | EP=1，避免通信 |
| 多卡同节点 | EP=8，用 NVLink 做 All-to-All |
| 多节点 | EP 跨节点，注意 IB 带宽，考虑 EP+DP 组合 |
| 高并发在线 | 增大 batch size，提升 EP 效率；做好负载均衡 |
| 长上下文 | 先用 MLA/GQA 压缩 KV，再优化 All-to-All |

---

## 7. 一句话总结

> MoE 推理优化的核心就是：**让 token 快速找到专家、让专家之间不打架、让 All-to-All 通信尽量不拖后腿。**

---

## Related

- [[概念/mixture-of-experts]] — MoE 概念
- [[概念/expert-parallelism]] — 专家并行
- [[概念/kv-cache]] — KV Cache 优化
- [[部署推理/Inference_Performance/README|推理性能专题]]
- [[部署推理/Inference_Performance/Inference_Performance_Fundamentals|推理性能基础]]
- [[部署推理/Inference_Performance/Prefill_Decode_Disaggregation|Prefill-Decode 分离]]

- [[部署推理/README|模型部署与推理]]
