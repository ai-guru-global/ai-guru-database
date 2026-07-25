---
title: Expert Parallelism
category: -concepts
tags: [moe, expert-parallelism, distributed-inference, all-to-all, performance, deepseek, mixtral]
relationships:
  - target: "概念/mixture-of-experts"
    type: builds_on
  - target: "概念/distributed-parallelism"
    type: related_to
  - target: "10_部署推理/04_Inference_Performance/MoE_Inference_Optimization"
    type: deepened_by
sources:
  - 10_部署推理/04_Inference_Performance/MoE_Inference_Optimization.md
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
- [[10_部署推理/04_Inference_Performance/MoE_Inference_Optimization|MoE 推理优化]]
- [[概念/GPU/flops|FLOPS 计算]] — 并行效率度量
- [[概念/Inference/vllm|vLLM]] — 原生 EP 支持的推理引擎

## 2026 专家并行生态

| 框架 | 说明 | 状态 |
|------|------|------|
| **Megatron-LM** | NVIDIA MoE 支持 | GA |
| **DeepSpeed-MoE** | 微软 MoE 支持 | GA |
| **vLLM** | 推理 EP | GA |
| **Mixtral** | 开源 MoE 模型 | GA |

## 延伸阅读

- [[概念/GPU/model-parallelism|Model Parallelism]] — 模型并行
- [[概念/GPU/tensor-parallelism|Tensor Parallelism]] — 张量并行
- [[概念/LLM/moe|MoE]] — 混合专家模型

> ℹ️ 专家并行是将 MoE 模型的专家分布到多个 GPU 的技术，用于训练和推理 MoE 模型。

## EP 配置示例

```python
# Megatron-LM EP 配置
python pretrain_gpt.py \
    --expert-model-parallel-size 8 \
    --num-experts 64 \
    --moe-router-topk 2
```

## EP vs TP

| 维度 | EP | TP |
|------|------|------|
| **切分对象** | 专家 | 层内权重 |
| **通信模式** | All-to-All | AllReduce |
| **适用模型** | MoE | 通用 |
| **负载均衡** | 需路由均衡 | 自动均衡 |

## 生产最佳实践

1. **专家数量**：专家数通常为 EP 度数的倍数
2. **路由均衡**：确保路由负载均衡
3. **与 TP 组合**：MoE 用 EP + TP 组合
4. **All-to-All 优化**：优化 All-to-All 通信
5. **监控负载**：监控专家负载

## 检查清单

- [ ] EP 度数已选择
- [ ] 路由均衡已配置
- [ ] All-to-All 已优化
- [ ] 负载监控已配置

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 专家负载不均 | 路由崩塔 | 添加 load balancing loss + 容量因子 |
| All-to-All 慢 | 跨节点通信 | 节点内 EP + 节点间 DP |
| 显存浪费 | 专家分配不均 | 使用 Expert Choice 路由 |
| 精度下降 | 专家数不足 | 增加专家数 + 调整 top-k |
| 推理延迟高 | 动态路由开销 | 使用静态路由或专家缓存 |

## 延伸阅读

- [[概念/GPU/tensor-parallelism|张量并行]] — 专家内部 TP 切分
- [[概念/GPU/pipeline-parallelism|流水线并行]] — PP 与 EP 组合
- [[概念/GPU/model-parallelism|模型并行]] — 并行策略总览
- [[概念/GPU/nccl|NCCL]] — All-to-All 通信实现
- [[概念/Training/distributed-training|分布式训练]] — MoE 训练架构

> ℹ️ 专家并行是 MoE 模型的核心并行策略，2026年 DeepSeek-V3、Mixtral 8x22B 等模型均采用 EP + TP + DP 组合，配合 Expert Choice 路由实现万卡级 MoE 训练。

## 2026 EP 生态现状

| 框架/模型 | EP 支持 | 说明 |
|------|------|------|
| DeepSeek-V3 | ✅ 成熟 | 256 专家 EP + TP + DP |
| Megatron-LM | ✅ 成熟 | 官方 EP 支持 |
| Mixtral 8x22B | ✅ 成熟 | 8 专家 top-2 路由 |
| vLLM | ✅ 成熟 | MoE 推理 EP 支持 |
| FSDP2 | 🟡 发展中 | MoE 集成中 |
| Expert Choice | ✅ 新增 | 专家选择 token 路由 |

## 检查清单

- [ ] 专家数与 top-k 已确定
- [ ] EP 度数与节点拓扑匹配
- [ ] 路由均衡 loss 已配置
- [ ] All-to-All 通信已优化
- [ ] 专家负载监控已配置
