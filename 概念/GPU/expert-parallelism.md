--
title: Expert Parallelism
category: -concepts
tags: [moe, expert-parallelism, distributed-inference, all-to-all, performance, deepseek, mixtral]
relationships:
  - target: "概念/mixture-of-experts"
    type: builds_on
  - target: "概念/distributed-parallelism"
    type: related_to
  - target: "部署推理/Inference_Performance/MoE_Inference_Optimization"
    type: deepened_by
sources:
  - 部署推理/Inference_Performance/MoE_Inference_Optimization.md
summary: Expert Parallelism 把 MoE 模型的不同专家分布到不同 GPU，以减少单卡显存压力；代价是引入 All-to-All 通信，需要与负载均衡策略配合。
lifecycle: reviewed
tier: core
created: 2026-06-15
updated: 2026-07-21
aliases:
  - "Expert Parallelism"
  - "expert parallelism"
  - "EP"
  - "专家并行"

---
# Expert Parallelism（专家并行）

> **一句话理解**: EP = "一个专家住一个 GPU"，token 按路由结果跨卡串门，用 All-to-All 通信换显存空间。

## 定义

Expert Parallelism（EP）是 MoE（Mixture-of-Experts）模型专用的并行策略：将不同专家（Expert FFN）分配到不同 GPU 上，每个 token 经 Router 路由后通过 All-to-All 集合通信到达目标专家所在设备，计算完成后再聚合回原设备。

## 核心机制

```
Token → Router(Gate) → Top-K 选择
  ↓
All-to-All Dispatch（token 发往对应专家 GPU）
  ↓
Expert FFN 计算（各 GPU 独立）
  ↓
All-to-All Combine（结果聚合回原 GPU）
  ↓
残差连接 → 下一层
```

## 关键权衡

| 维度 | EP 度低（EP=2） | EP 度高（EP=64） |
|------|----------------|------------------|
| **单卡显存** | 仍较大 | 极小（仅存 1/N 专家） |
| **通信量** | 少（节点内 NVLink） | 大（跨节点 RDMA） |
| **负载均衡难度** | 低 | 高（热点专家问题） |
| **适用场景** | 小 MoE（8 专家） | 大 MoE（64-256 专家） |

## 负载均衡策略

| 策略 | 原理 | 代表 |
|------|------|------|
| **Auxiliary Loss** | 训练时加 load-balancing loss 惩罚不均 | Switch Transformer |
| **Expert Capacity** | 每专家设 token 容量上限，溢出 drop | GShard |
| **Token Dropping** | 超限 token 走 residual 跳过 | DeepSeek-V2 |
| **动态路由** | 运行时重分配热点专家 | Megablocks |
| **Shared Expert** | 公共专家本地计算，减少通信 | DeepSeek-V3 |

## 2026 年 MoE 生态与 EP 实践

| 模型 | 专家数 | 激活专家 | EP 策略 | 硬件 |
|------|--------|----------|---------|------|
| **DeepSeek-V3** | 256 | 8 | EP=64 + Shared Expert | 8×H800 |
| **Mixtral 8x22B** | 8 | 2 | EP=8（节点内） | 8×A100 |
| **Qwen3-235B** | 128 | 8 | EP=16 + DP | 16×H100 |
| **Grok-3** | 160 | 8 | EP=32 跨节点 | 256×H100 |
| **Llama-4-Maverick** | 128 | 1 | EP=128 | 大规模集群 |

## 与其他并行策略的组合

```
3D 并行 + EP:
  TP（张量并行）→ 层内切分 Attention/FFN
  PP（流水线并行）→ 层间切分
  EP（专家并行）→ MoE 层专家切分
  DP（数据并行）→ 多副本吞吐
```

典型配置（DeepSeek-V3 推理）：
- TP=8（节点内 NVLink）
- EP=8（MoE 层专家分布）
- DP=N（多节点副本）

## 通信优化

| 技术 | 效果 |
|------|------|
| **计算-通信重叠** | Expert 计算与 All-to-All 流水线化，隐藏延迟 |
| **FP8 通信量化** | 通信量减半，H100 原生支持 |
| **分组 All-to-All** | 节点内先聚合再跨节点，减少跨节点流量 |
| **Expert 亲和调度** | 将高频共现专家放同节点 |

## 生产最佳实践

1. **EP 度 ≤ 节点内 GPU 数**（优先 NVLink，避免跨节点 All-to-All）
2. **监控 Expert 利用率**：理想 > 80%，< 50% 需调整路由
3. **Shared Expert 本地化**：公共专家不参与 All-to-All
4. **推理时 EP + TP 组合**：vLLM/SGLang 已原生支持 `--expert-parallel-size`
5. **大 EP 场景用 RDMA**：RoCE/InfiniBand 必备，TCP 不可接受

## Related

- [[概念/mixture-of-experts]] — 混合专家模型
- [[概念/distributed-parallelism]] — 分布式并行策略
- [[部署推理/Inference_Performance/MoE_Inference_Optimization|MoE 推理优化]]
- [[概念/GPU/flops|FLOPS 计算]] — 并行效率度量
- [[概念/Inference/vllm|vLLM]] — 原生 EP 支持的推理引擎
