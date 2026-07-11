---
title: "LeMix 训推统一调度 (LeMix Unified Training-Inference Scheduling)"
category: -concepts
tags: ["lemix", "training-inference", "gpu-scheduling", "resource-management", "ai-stack"]
relationships:
  - target: "概念/training-inference-unification"
    type: related_to
  - target: "概念/heterogeneous-gpu"
    type: related_to
  - target: "概念/continuous-batching"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "LeMix 是面向多 GPU 系统的训推统一调度框架，在同一 GPU 集群上同时运行训练和推理任务，通过智能调度最大化 GPU 利用率。AI Stack 参考资料中的重要前沿研究。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.75
lifecycle: reviewed
tier: supporting
---

# LeMix 训推统一调度

> **一句话理解**: LeMix 是"GPU 的时间管理大师"——让训练和推理任务共享 GPU 集群，通过智能调度消除资源浪费，利用率提升 30-50%。

---

## 1. 核心问题

GPU 集群中训练和推理的资源利用矛盾：

| 问题 | 说明 |
|------|------|
| **训练占满 GPU** | 训练任务独占 GPU，推理无法使用 |
| **推理 GPU 闲置** | 低峰期推理 GPU 空闲，训练无法借用 |
| **调度割裂** | 训练和推理由不同系统管理 |
| **资源浪费** | 总体 GPU 利用率仅 30-50% |

---

## 2. LeMix 解决方案

| 特性 | 说明 |
|------|------|
| **统一调度** | 训练和推理任务在同一集群调度 |
| **时间片共享** | GPU 时间片动态分配给训练/推理 |
| **优先级管理** | 推理延迟敏感优先，训练吞吐优先 |
| **弹性伸缩** | 任务可动态增减 GPU 数量 |
| **无干扰保证** | 推理 SLO 不受训练影响 |

---

## 3. 调度策略

```
LeMix 统一调度架构
│
├── 任务队列
│   ├── 训练任务（高吞吐、可中断）
│   └── 推理任务（低延迟、不可中断）
│
├── 调度器
│   ├── 推理优先：保证推理 SLO
│   ├── 训练填空：推理空闲时调度训练
│   └── 弹性伸缩：动态调整 GPU 分配
│
└── GPU 集群
    ├── GPU 0-3: 推理 + 训练混合
    └── GPU 4-7: 训练专用（可弹性伸缩）
```

---

## 4. 与 AI Stack 训推一体的关系

| 维度 | AI Stack 训推一体 | LeMix |
|------|-----------------|-------|
| **层级** | 产品级方案 | 学术研究 |
| **调度粒度** | 节点级（部分节点训练，部分推理） | GPU 级（同 GPU 时分复用） |
| **成熟度** | 生产就绪 | 研究阶段 |
| **适用场景** | AI Stack 一体机 | 大规模 GPU 集群 |

---

## Related

- [[概念/training-inference-unification]] — 训推一体架构
- [[概念/heterogeneous-gpu]] — 异构 GPU 集群纳管
- [[概念/continuous-batching]] — Continuous Batching
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
