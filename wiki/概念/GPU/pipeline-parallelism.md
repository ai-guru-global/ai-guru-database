---
title: "Pipeline Parallelism（流水线并行）"
category: -concepts
tags: [pipeline-parallelism, distributed-training, megatron-lm, llm, gpu, gpipes]
aliases:
  - "Pipeline Parallelism"
  - "PP"
  - "流水线并行"
relationships:
  - target: "概念/distributed-training"
    type: belongs_to
  - target: "概念/megatron-lm"
    type: implemented_by
  - target: "概念/tensor-parallelism"
    type: complementary
sources:
  - 07_模型训练/04_分布式训练/Megatron_LM_Deep_Dive.md
summary: "流水线并行（PP）把模型按层切分到多张 GPU 形成"流水线"，不同卡负责不同层段，代价是流水线 bubble（部分卡空闲等待）与较复杂的调度（GPipe / 1F1B / Interleaved）。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.88
created: 2026-06-24
updated: 2026-07-21
name_zh: "流水线并行"
---

# Pipeline Parallelism（流水线并行）

> 中文简称：流水线并行

## 核心要点

- **目的**：把整模型按层切到多卡，突破单卡显存限制。
- **机制**：GPU0 跑 L0-7，GPU1 跑 L8-15，GPU2 跑 L16-23...；micro-batch 依次流过。
- **代价**：流水线 bubble（部分卡空闲等待）；需要细粒度 micro-batch。
- **代表实现**：GPipe（同步）、PipeDream-1F1B（异步）、Interleaved PP、MindSpore。
- **常见组合**：TP × PP × DP 三维并行。

## 一句话解释

> PP 把"模型层"分给多卡接力算；GPU 像工厂流水线，但启动和收尾有空档（bubble）。

## 工作示意

```
GPU0: [Layer 0-7]   ──►  GPU1: [Layer 8-15]  ──►  GPU2: [Layer 16-23]
            micro_batch_0   │          micro_batch_0   │        micro_batch_0
            micro_batch_1   │          micro_batch_1   │        micro_batch_1
            ...             │          ...             │        ...

时序（GPipe 同步）：
  GPU0: [m0][m1][m2][m3]  ──warmup──► [back-prop]
  GPU1:                    [m0][m1][m2][m3] ──warmup──► [back-prop]
  GPU2:                                       [m0][m1][m2][m3] ──warmup──► [back-prop]
                                           ↑ bubble ↑
```

## 调度算法对比

| 调度 | bubble | 通信 | 适用 |
|------|--------|------|------|
| **GPipe** | 大 | 同步 | 简单、同步训练 |
| **1F1B (PipeDream)** | 小 | 同步 | **大模型主流** |
| **Interleaved 1F1B** | 更小 | 同步 | 进一步压减 bubble |
| **ZB-H1 / PipeDream-Async** | 最小 | 异步 | 极端大规模、容许不一致 |

## 何时使用

✅ **推荐**：
- 模型超大（> 30B），单卡放不下整模型
- 与 TP/DP 组合成 3D 并行
- 跨节点 PP（节点间用 IB / RoCE）

⚠️ **不推荐**：
- 模型小（< 7B），单卡能放下
- 对延迟极敏感（PP 引入额外通信与 bubble）

## Related

- [[概念/distributed-training]] — 分布式训练总览
- [[概念/tensor-parallelism]] — 张量并行（互补）
- [[概念/megatron-lm]] — Megatron-LM（PP 代表实现）
- [[07_模型训练/04_分布式训练/08_Megatron_LM_深入分析]] — 深度解析

---

## 2026 Pipeline Parallelism 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Megatron-LM PP** | NVIDIA 官方流水线并行 | GA |
| **DeepSpeed PP** | DeepSpeed 流水线并行 | GA |
| **GPipe** | Google 流水线并行 | GA |
| **PipeDream** | 异步流水线并行 | GA |
| **Interleaved Schedule** | 交错调度，降低气泡 | GA |

## 生产最佳实践

1. **层间切分**：PP 适合切分深层网络的不同层
2. **气泡优化**：用 Interleaved Schedule 降低气泡
3. **与 TP 组合**：大模型用 PP + TP 组合策略
4. **微批次选择**：微批次数通常为 PP 度数的 2-4x
5. **负载均衡**：确保各阶段计算量均衡

## 2026 流水线并行生态

| 框架 | 说明 | 状态 |
|------|------|------|
| **GPipe** | Google PP 实现 | GA |
| **PipeDream** | 微软 PP 实现 | GA |
| **Megatron-LM** | NVIDIA PP 实现 | GA |
| **DeepSpeed** | 微软 PP 实现 | GA |

## 延伸阅读

- [[概念/GPU/model-parallelism|Model Parallelism]] — 模型并行
- [[概念/GPU/tensor-parallelism|Tensor Parallelism]] — 张量并行
- [[概念/GPU/nccl|NCCL]] — 多 GPU 通信

> ℹ️ 流水线并行是将模型层分布到多个 GPU 的技术，通过微批次减少气泡时间。

## PP 调度策略

| 策略 | 说明 | 气泡时间 |
|------|------|------|
| **GPipe** | 所有微批次前向后再反向 | 高 |
| **1F1B** | 交替前向/反向 | 中 |
| **Interleaved** | 交错调度 | 低 |

## PP 配置示例

```python
# Megatron-LM PP 配置
python pretrain_gpt.py \
    --pipeline-model-parallel-size 4 \
    --num-layers 96 \
    --micro-batch-size 1 \
    --global-batch-size 1024
```

## 生产最佳实践

1. **PP 度数**：PP 度数通常为 2/4/8
2. **微批次选择**：微批次数为 PP 度数的 2-4x
3. **负载均衡**：确保各阶段计算量均衡
4. **与 TP 组合**：大模型用 PP + TP 组合
5. **跨节点 PP**：PP 跨节点减少通信
6. **1F1B 调度**：用 1F1B 减少气泡

## 检查清单

- [ ] PP 度数已选择
- [ ] 微批次已配置
- [ ] 负载均衡已验证
- [ ] 调度策略已选择

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 气泡时间大 | 微批次数不足 | 增加 micro-batch 数量（≥ 4×PP度数） |
| 显存不均 | stage 切分不均 | 按参数量均衡切分 layer |
| 通信瓶颈 | 跨节点带宽不足 | 节点内 PP + 节点间 DP |
| 收敛慢 | 异步更新延迟 | 使用 1F1B 或 Interleaved 调度 |
| 故障恢复慢 | checkpoint 过大 | 异步保存 + 分布式 checkpoint |

## 延伸阅读

- [[概念/GPU/tensor-parallelism|张量并行]] — TP 层内切分
- [[概念/GPU/model-parallelism|模型并行]] — 并行策略总览
- [[概念/GPU/expert-parallelism|专家并行]] — MoE 专用并行
- [[概念/Training/distributed-training|分布式训练]] — 全局训练架构
- [[概念/GPU/nccl|NCCL]] — 通信库

> ℹ️ 流水线并行是大模型跨节点训练的核心策略，2026年 Interleaved 1F1B + Zero Bubble 调度已将气泡时间压缩至 < 5%，是万卡集群训练的必备组件。

## 2026 PP 调度策略对比

| 策略 | 气泡率 | 显存占用 | 适用场景 |
|------|------|------|------|
| GPipe | 高 | 高 | 原型验证 |
| 1F1B | 中 | 中 | 通用训练 |
| Interleaved 1F1B | 低 | 中 | 大模型训练 |
| Zero Bubble | 极低 | 中 | 万卡训练 |
| DualPipe | 极低 | 低 | 双向流水线 |
| Chimera | 低 | 低 | 显存受限 |

## 检查清单

- [ ] PP 度数与节点数匹配
- [ ] 微批次数 ≥ 4×PP 度数
- [ ] stage 切分已均衡
- [ ] 调度策略已选择（1F1B/Zero Bubble）
- [ ] 跨节点带宽已验证
- [ ] checkpoint 策略已配置
- [ ] 气泡时间已监控

> ℹ️ PP 度数选择需平衡气泡时间和通信开销，通常 PP 度数 = 节点数。

## 配置示例

```python
# Megatron-LM PP 配置
--pipeline-model-parallel-size 8
--num-layers-per-virtual-pipeline-stage 2
```