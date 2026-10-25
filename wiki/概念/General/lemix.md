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
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "LeMix 是面向多 GPU 系统的训推统一调度框架，在同一 GPU 集群上同时运行训练和推理任务，通过智能调度最大化 GPU 利用率。AI Stack 参考资料中的重要前沿研究。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.75
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
name_zh: "LeMix 训推统一调度"
---

# LeMix 训推统一调度

> 中文简称：LeMix 训推统一调度

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
- [[12_架构基建/03_AI技术栈/02_AI技术栈_深入分析]] — AI Stack 深度解析

---

## 2026 LeMix 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **LeMix** | 训推一体调度系统 | GA |
| **训推一体** | 训练推理统一调度 | GA |
| **异构 GPU** | 异构 GPU 集群纳管 | GA |
| **Continuous Batching** | 连续批处理 | GA |
| **资源优化** | GPU 资源优化 | GA |

## 生产最佳实践

1. **训推一体**：训练推理统一调度用 LeMix
2. **异构 GPU**：异构 GPU 集群用 LeMix 纳管
3. **Continuous Batching**：推理用 Continuous Batching
4. **资源优化**：GPU 资源优化提高利用率
5. **与 AI Stack 配合**：LeMix + AI Stack

## 训推统一调度配置示例

```yaml
# LeMix 调度策略配置
scheduler:
  mode: unified  # 训推统一模式
  priority:
    inference: high      # 推理优先
    training: normal     # 训练填空
  slo:
    inference_p99_latency: 200ms
    training_throughput_min: 80%
  elasticity:
    enabled: true
    scale_up_threshold: 0.8   # GPU 利用率 > 80% 扩容
    scale_down_threshold: 0.3  # GPU 利用率 < 30% 缩容
  gpu_sharing:
    mode: time_slice
    slice_duration: 100ms
    preemption: true  # 推理可抢占训练
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 推理延迟超标 | 训练任务抢占 GPU | 提高推理优先级/预留 GPU |
| 训练吐量下降 | GPU 被推理占用 | 设置训练最低 GPU 保障 |
| 调度抖动 | 任务频繁迁移 | 增大调度间隔/粘性调度 |
| 显存不足 | 训推共享显存 | 显存分区/MPS |
| 利用率仍低 | 任务量不足 | 引入更多任务/弹性缩容 |

## 版本兼容性

| 组件 | 状态 | 说明 |
|------|------|------|
| LeMix | 研究 | 学术原型 |
| KubeRay | GA | K8s 训推调度 |
| Volcano | GA | K8s 批调度 |
| NVIDIA MPS | GA | GPU 共享 |
| HAMi | GA | 异构 GPU 纳管 |

## 生产检查清单

1. 明确推理 SLO 和训练吐量目标
2. 配置推理优先级和抢占策略
3. 设置 GPU 弹性伸缩阈值
4. 监控 GPU 利用率和任务等待时间
5. 定期评估训推比例是否合理
6. 建立资源争用升级处理流程

## 总结

LeMix 代表了 GPU 集群训推统一调度的前沿方向，通过时间片共享和智能调度将 GPU 利用率从 30-50% 提升到 70-90%。虽然目前仍处于研究阶段，但其理念已影响生产级调度系统设计。

> 💡 训推统一调度的核心价值：GPU 是最昂贵的计算资源，任何空闲都是浪费——训推统一调度让每一块 GPU 每一秒都在工作。

## 训推统一调度架构

```yaml
# LeMix 训推统一调度配置
lemix_scheduler:
  resource_pool:
    gpu_type: [A100, H100]
    total_gpus: 128
  training_jobs:
    priority: high
    preemptible: false
    gang_scheduling: true
    min_gpus: 8
  inference_jobs:
    priority: medium
    preemptible: true
    auto_scaling:
      min_replicas: 2
      max_replicas: 16
      target_utilization: 70%
  scheduling_policy:
    - time_sharing: true        # 分时复用
    - priority_preemption: true  # 优先级抢占
    - fair_share: true           # 公平共享
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 训练被推理抢占 | 优先级配置不当 | 训练设为不可抢占 |
| 推理延迟波动 | 训练任务占用 | 推理预留资源 + QoS |
| GPU 碎片化 | 调度不合理 | Gang Scheduling + 整理 |
| 资源利用率低 | 任务间隙空闲 | 分时复用 + 背填任务 |

## 生产检查清单

1. ✅ 训练任务设为不可抢占
2. ✅ 推理服务预留最小资源
3. ✅ 配置优先级和公平共享策略
4. ✅ 监控 GPU 利用率 + 空闲告警
5. ✅ 定期评估训推资源分配比例
6. ✅ 配置自动扩缩容适应流量波动

## 总结

LeMix 训推统一调度是 2026 年 GPU 资源优化的核心实践，通过分时复用、优先级抢占和自动扩缩容，将 GPU 利用率从 40% 提升到 80%+。其核心是“让每一块 GPU 每一秒都在工作”。

> 💡 训推统一调度的核心：“GPU 空闲就是浪费”——通过智能调度消除每一秒空闲。
