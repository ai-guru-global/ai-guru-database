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
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: 训推一体将 LLM 训练和推理共置于同一 GPU 集群，利用推理空闲和训练气泡的互补性提升 GPU 利用率。LeMix (2025) 实现吞吐提升 3.53×、SLO 达标率提升 2.12×。2026 年 IDC 数据显示 >35% 头部企业已将训推一体能力作为选型核心指标。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.80
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: supporting
created: 2026-06-03 00:00:00+00:00
updated: 2026-07-21
aliases:
  - "Training Inference Unification"
  - "training inference unification"

name_zh: "训推一体"
---
# 训推一体 (Training-Inference Unification)

> 中文简称：训推一体

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
- [[概念/distributed-training]] — 分布式训练
- [[12_架构基建/AI_Stack_Deep_Dive]] — 阿里云 AI Stack

---

## 2026 训推一体生态

| 方案 | 核心机制 | 适用场景 |
|------|---------|----------|
| **LeMix** | 细粒度训推共置调度 | 学术研究、原型验证 |
| **Kubernetes + Volcano** | 任务队列 + 优先级调度 | 生产集群 |
| **阿里云 PAI** | 训推一体平台 | 企业级托管 |
| **Ray + KubeRay** | 弹性资源池 | 云原生场景 |

## 生产最佳实践

1. **SLO 优先**：推理 SLO 优先级高于训练，训练可暂停/降级
2. **内存隔离**：使用 MIG/MPS 或显存配额隔离训推任务
3. **热替换**：LoRA adapter 热替换无需重启，Full model 滚动更新
4. **监控指标**：关注 GPU 利用率、推理延迟、训练吞吐、资源切换频率
5. **渐进式采用**：先从低峰时段训练开始，逐步扩大训推共置比例

## 2026 训推一体生态现状

| 方案 | 特色 | 适用 | 状态 |
|------|------|------|------|
| K8s + GPU 共享 | 资源池化 | 通用 | ✅ 主流 |
| Ray Serve | 统一框架 | 训推共置 | ✅ 主流 |
| KServe | 模型服务 | 推理为主 | ✅ 成熟 |
| Triton | 高性能推理 | 生产部署 | ✅ 成熟 |
| vLLM | LLM 推理 | 大模型 | ✅ 主流 |

## 检查清单

- [ ] GPU 资源池已配置
- [ ] 训推切换策略已定义
- [ ] 监控已接入（GPU 利用率/延迟）
- [ ] 热替换已配置（LoRA adapter）
- [ ] 渐进式采用计划已制定

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 资源冲突 | 训推同时运行 | 时间片轮转或资源隔离 |
| 切换延迟 | 模型加载慢 | 预热 + 缓存 |
| 利用率低 | 调度不当 | 优化调度策略 |
| 成本高 | 资源浪费 | Spot + 弹性伸缩 |

## 延伸阅读

- [[概念/Training/model-training|Model Training]] — 模型训练
- [[概念/Inference/model-serving|Model Serving]] — 模型服务化
- [[概念/K8s/gpu-operator|GPU Operator]] — GPU 管理
- [[概念/MLOps/mlops|MLOps]] — 机器学习运维
- [[12_架构基建/AI_Stack_Deep_Dive|AI Stack]] — AI 技术栈

> ℹ️ 训推一体是 2026 年 AI 基础设施的重要趋势，GPU 资源池化 + 时间片轮转是核心， 可提升 30-50% 利用率。

## 训推一体架构模式

| 模式 | 原理 | 优势 | 劣势 |
|------|------|------|------|
| 时间片轮转 | GPU 分时复用 | 利用率高 | 切换开销 |
| 资源池化 | 统一 GPU 池 | 灵活调度 | 复杂度高 |
| 弹性伸缩 | 按需扩缩容 | 成本优化 | 冷启动延迟 |
| 混合部署 | 训推同节点 | 减少数据传输 | 资源竞争 |
| Serverless | 无服务器推理 | 零闲置 | 冷启动 |

## 资源调度策略

| 策略 | 说明 | 适用场景 |
|------|------|------|
| 优先级抢占 | 推理优先，训练填充 | 在线服务 + 离线训练 |
| 时间窗口 | 白天推理，夜间训练 | 业务有明显波谷 |
| 资源配额 | 固定比例分配 | 多团队共享 |
| 动态均衡 | 根据负载实时调整 | 通用场景 |
| Gang Scheduling | 训练任务整体调度 | 分布式训练 |

## 典型平台对比

| 平台 | 训推一体支持 | 调度器 | 特点 |
|------|------|------|------|
| Kubernetes + Volcano | ✅ | Volcano | Gang 调度 |
| Run:ai | ✅ | 自研 | GPU 池化 |
| Anyscale Ray | ✅ | Ray | 分布式计算 |
| Slurm + K8s | 部分 | Slurm | HPC 传统 |
| 阿里云 PAI | ✅ | 自研 | 云原生 |

## 实施路线图

| 阶段 | 目标 | 关键动作 |
|------|------|------|
| Phase 1 | GPU 可视化 | 部署监控，识别闲置 GPU |
| Phase 2 | 资源池化 | 统一 GPU 池，实现共享 |
| Phase 3 | 训推混合 | 时间片轮转，动态调度 |
| Phase 4 | 智能调度 | AI 驱动的资源预测与调度 |

## 成本效益分析

| 指标 | 传统模式 | 训推一体 | 提升 |
|------|------|------|------|
| GPU 利用率 | 30-40% | 70-85% | +100% |
| 资源浪费 | 60% | 15-30% | -50% |
| 成本/请求 | 基线 | -40% | 显著 |
| 响应延迟 | 基线 | +10% | 可接受 |

> 💡 训推一体的核心是「让 GPU 永不空闲」，通过智能调度将闲置算力转化为训练产能。
