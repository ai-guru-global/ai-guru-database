---
title: "Model Parallelism"
category: -concepts
tags: ["distributed-training", "llm", "gpu", "alibaba-cloud"]
summary: "Model Parallelism（模型并行）是将单个模型切分到多张 GPU 上并行训练或推理的分布式策略，包括张量并行和流水线并行。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "模型并行"
relationships:
  - target: "概念/distributed-training"
    type: part_of
  - target: "概念/tensor-parallelism"
    type: is_a
  - target: "概念/pipeline-parallelism"
    type: is_a
sources: []
---

# Model Parallelism

> **一句话理解**: 模型并行就是「模型太大，一张 GPU 装不下，把模型拆开分到多张卡上跑」。

## 核心要点

- **解决单卡显存不足**: 当模型参数量超过单卡显存时使用。
- **两种主要形式**:
  - **张量并行（Tensor Parallelism）**: 层内切分。
  - **流水线并行（Pipeline Parallelism）**: 层间切分。
- **常与数据并行结合**: 形成 3D 并行。
- **框架支持**: Megatron-LM、DeepSpeed、FSDP、Colossal-AI。

## 与 Data Parallelism 对比

| 并行方式 | 切分对象 | 解决什么问题 |
|----------|---------|-------------|
| Data Parallelism | 数据 | 加速训练 |
| Model Parallelism | 模型 | 单卡放不下大模型 |
| Pipeline Parallelism | 模型层 | 跨节点大模型 |

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，大模型训练常使用 Megatron-LM 或 DeepSpeed 的模型并行能力，部署在神龙 GPU 集群上。

## Related

- [[概念/tensor-parallelism|Tensor Parallelism]]
- [[概念/pipeline-parallelism|Pipeline Parallelism]]
- [[概念/distributed-training|分布式训练]]
- [[概念/megatron-lm|Megatron-LM]]
- [[概念/deepspeed|DeepSpeed]]

---

## 2026 模型并行生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Tensor Parallelism** | 层内切分，适合大层 | GA |
| **Pipeline Parallelism** | 层间切分，适合深层网络 | GA |
| **Expert Parallelism** | MoE 专家分布到不同 GPU | GA |
| **Sequence Parallelism** | 序列维度切分，降低激活内存 | GA |
| **3D/4D/5D 并行** | 多维度组合并行策略 | GA |

## 生产最佳实践

1. **大模型必用**：>10B 参数模型必须用模型并行
2. **TP 适合层内**：Tensor Parallelism 适合大层（如 Attention）
3. **PP 适合层间**：Pipeline Parallelism 适合深层网络
4. **MoE 用 EP**：MoE 模型用 Expert Parallelism 分布专家
5. **组合策略**：生产环境用 3D/4D 并行组合策略

## 2026 模型并行生态

| 框架 | 说明 | 状态 |
|------|------|------|
| **Megatron-LM** | NVIDIA 并行训练 | GA |
| **DeepSpeed** | 微软并行训练 | GA |
| **FSDP** | PyTorch 原生 | GA |
| **Alpa** | 自动并行 | GA |

## 延伸阅读

- [[概念/GPU/tensor-parallelism|Tensor Parallelism]] — 张量并行
- [[概念/GPU/pipeline-parallelism|Pipeline Parallelism]] — 流水线并行
- [[概念/GPU/expert-parallelism|Expert Parallelism]] — 专家并行

> ℹ️ 模型并行是将模型分布到多个 GPU 的技术，用于训练超大模型。

## 并行策略对比

| 策略 | 说明 | 适用场景 | 通信开销 |
|------|------|------|------|
| **数据并行 (DP)** | 复制模型，分数据 | 小模型 | 低 |
| **张量并行 (TP)** | 分层切分 | 大模型 | 高 |
| **流水线并行 (PP)** | 分层分布 | 超大模型 | 中 |
| **专家并行 (EP)** | 分布专家 | MoE 模型 | 中 |

## 3D/4D 并行组合

```
4D 并行 = DP + TP + PP + EP

示例: 训练 1T 参数 MoE 模型
    ├── DP=8 (8 个数据并行组)
    ├── TP=8 (每组 8 GPU 张量并行)
    ├── PP=4 (4 级流水线)
    └── EP=8 (8 个专家并行)
    总计: 8×8×4 = 256 GPU
```

## 生产最佳实践

1. **TP 优先**：单节点内用 TP（NVLink 高带宽）
2. **PP 跨节点**：跨节点用 PP（减少通信）
3. **DP 扩展**：用 DP 扩展吞吐量
4. **MoE 用 EP**：MoE 模型用 EP 分布专家
5. **组合策略**：生产环境用 3D/4D 并行组合
6. **通信优化**：用 NCCL 优化通信
7. **负载均衡**：确保各 GPU 负载均衡
8. **监控利用率**：监控 GPU 利用率

## 检查清单

- [ ] 并行策略已选择
- [ ] 通信优化已配置
- [ ] 负载均衡已验证
- [ ] GPU 利用率已监控

## 并行策略选择指南

| 模型大小 | 推荐策略 | 说明 |
|------|------|------|
| **< 1B** | DP | 数据并行足够 |
| **1B-10B** | DP + TP | 张量并行加速 |
| **10B-100B** | DP + TP + PP | 3D 并行 |
| **> 100B** | DP + TP + PP + EP | 4D 并行 |

## 常见问题

| 问题 | 解决方案 |
|------|------|
| 通信开销大 | 用 NVLink/InfiniBand |
| 负载不均衡 | 调整切分方式 |
| 扩展性差 | 调整并行策略 |
| 显存不足 | 增加并行度数 |

## 生产最佳实践

1. **分层并行设计**：节点内 TP + 节点间 PP + DP 组合，最小化跨节点通信
2. **切分均衡**：确保每个 stage 计算量接近，避免气泡时间
3. **通信重叠**：利用异步通信掩盖 AllReduce/AllGather 延迟
4. **显存预算**：每卡显存 = 参数分片 + 梯度 + 优化器状态 + 激活值
5. **回退策略**：并行度配置失败时自动降级到 DP

## 检查清单

- [ ] 并行策略已根据模型大小和集群拓扑确定
- [ ] 节点内使用 NVLink 高速互联
- [ ] 通信与计算已重叠
- [ ] 显存分配已均衡
- [ ] 故障恢复机制已配置

## 延伸阅读

- [[概念/GPU/tensor-parallelism|张量并行]] — TP 层内切分详解
- [[概念/GPU/pipeline-parallelism|流水线并行]] — PP 层间切分详解
- [[概念/GPU/expert-parallelism|专家并行]] — MoE 模型专用并行
- [[概念/Training/distributed-training|分布式训练]] — 全局训练策略
- [[概念/GPU/nccl|NCCL]] — 集合通信库

> ℹ️ 模型并行是万卡训练的基础，2026年主流框架（Megatron-LM、DeepSpeed、FSDP2）均支持 3D/4D/5D 混合并行，根据模型规模和集群拓扑自动选择最优并行组合。

## 2026 并行策略组合示例

| 模型规模 | TP | PP | DP | EP | 总卡数 |
|------|------|------|------|------|------|
| 7B | 1 | 1 | 64 | — | 64 |
| 70B | 8 | 4 | 32 | — | 1024 |
| 405B | 8 | 16 | 16 | — | 2048 |
| 671B MoE | 8 | 8 | 16 | 8 | 8192 |
| 1T+ MoE | 8 | 16 | 32 | 16 | 65536 |

## 检查清单

- [ ] 并行策略已根据模型大小和集群拓扑确定
- [ ] 节点内使用 NVLink 高速互联
- [ ] 通信与计算已重叠
- [ ] 显存分配已均衡
- [ ] 故障恢复机制已配置
- [ ] 并行度数已优化
- [ ] MFU 已监控（目标 > 40%）
- [ ] checkpoint 策略已配置

> ℹ️ 并行策略选择需综合考虑模型规模、集群拓扑和通信带宽，2026年自动并行搜索工具已成熟。

## 并行策略选择指南

- **< 10B**：DP 或 FSDP 即可
- **10B-100B**：TP + DP 组合
- **100B-1T**：TP + PP + DP 3D 并行
- **> 1T MoE**：TP + PP + DP + EP 4D/5D 并行
