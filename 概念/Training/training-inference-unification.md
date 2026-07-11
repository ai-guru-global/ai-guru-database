---
title: 训推一体 (Training-Inference Unification)
category: -concepts
tags: [infrastructure, gpu-scheduling, training, inference, unified]
relationships:
  - target: "概念/ai-architecture"
    type: extends
  - target: "概念/heterogeneous-gpu"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: 训推一体将 LLM 训练和推理共置于同一 GPU 集群，利用推理空闲和训练气泡的互补性提升 GPU 利用率。LeMix (2025) 实现吞吐提升 3.53×、SLO 达标率提升 2.12×。2026 年 IDC 数据显示 >35% 头部企业已将训推一体能力作为选型核心指标。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.80
lifecycle: draft
lifecycle_changed: 2026-06-03
tier: supporting
created: 2026-06-03 00:00:00+00:00
updated: 2026-06-03 00:00:00+00:00
aliases:
  - "Training Inference Unification"
  - "training inference unification"

---
# 训推一体 (Training-Inference Unification)

## 核心要点

- **互补性利用**：推理空闲期（低峰流量）和训练气泡（pipeline bubble）互相填充，GPU 利用率从 ~13% 提升至 ~55%
- **模型即时更新**：训练产出的 checkpoint 直接加载为推理模型，无需跨集群同步
- **资源节省 30-50%**：统一资源池替代两套独立集群
- **2026 趋势**：IDC 报告 >35% 头部企业将训推一体能力作为选型核心评估指标

## 详细内容

### Separate vs Unified 对比

| 问题 | 独立部署 (Separate) | 训推一体 (Unified) |
|------|-------------------|-------------------|
| **推理空闲** | 低峰 GPU 利用率 ~13% | 空闲算力自动转为训练 |
| **训练气泡** | Pipeline bubble ~30% | 气泡期填充推理请求 |
| **模型同步** | 跨集群同步延迟数分钟 | 训练更新即时生效 |
| **资源总量** | 两套独立集群 | 统一池化，节省 30-50% |

### 学术前沿：LeMix

LeMix（UC Riverside, 2025）提出细粒度训推共置调度框架：

- **离线 Profiler**：收集每个硬件的延迟和内存系数
- **任务预测**：推测在线任务的执行行为和系统影响
- **资源分配**：根据实时负载（请求率、训练量）动态分配节点
- **运行时调度**：细粒度 task-level 调度，优先保障推理 SLO

**结果**（8×A100, Llama-8B）：吞吐 3.53×↑，推理 loss 0.61×↓，SLO 达标 2.12×↑

### 调度策略

```
训推统一资源池调度
│
├── 高流量期 → 优先推理
│   ├── 扩容推理实例
│   └── 训练任务暂停/降级
│
├── 低流量期 → 释放训练
│   ├── 缩容推理实例
│   └── 释放 GPU 给训练任务
│
└── 模型更新 → 热替换
    ├── LoRA adapter 热替换（无需重启）
    └── Full model checkpoint 滚动更新
```

### 挑战

1. **内存竞争**：训练和推理共享 GPU 显存，需精细的内存隔离
2. **SLO 保障**：训练 backward pass 可能延迟推理请求
3. **调度复杂性**：需要 workload-aware 的智能调度器

## 来源

- Li et al., "LeMix: Unified Scheduling for LLM Training and Inference on Multi-GPU Systems", 2025
- IDC《中国 AI 训推一体机技术能力评估，2025》

## Related

- [[概念/ai-architecture]] — AI 系统架构
- [[概念/heterogeneous-gpu]] — 异构 GPU 集群
- [[概念/continuous-batching]] — Continuous Batching
- [[架构基建/AI_Stack_Deep_Dive]] — 阿里云 AI Stack
