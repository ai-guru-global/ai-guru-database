---
title: "Pipeline Parallelism（流水线并行）"
category: -concepts
tags: [pipeline-parallelism, distributed-training, megatron-lm, llm, gpu, gpipes]
aliases:
  - "Pipeline Parallelism"
  - "PP"
  - "流水线并行"
relationships:
  - target: "_concepts/distributed-training"
    type: belongs_to
  - target: "_concepts/megatron-lm"
    type: implemented_by
  - target: "_concepts/tensor-parallelism"
    type: complementary
sources:
  - 模型训练/Distributed_Training/Megatron_LM_Deep_Dive.md
summary: "流水线并行（PP）把模型按层切分到多张 GPU 形成"流水线"，不同卡负责不同层段，代价是流水线 bubble（部分卡空闲等待）与较复杂的调度（GPipe / 1F1B / Interleaved）。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.88
created: 2026-06-24
updated: 2026-06-24
---

# Pipeline Parallelism（流水线并行）

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

- [[_concepts/distributed-training]] — 分布式训练总览
- [[_concepts/tensor-parallelism]] — 张量并行（互补）
- [[_concepts/megatron-lm]] — Megatron-LM（PP 代表实现）
- [[模型训练/Distributed_Training/Megatron_LM_Deep_Dive]] — 深度解析