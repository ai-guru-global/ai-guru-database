---
title: "Cloud Cost"
category: -concepts
tags: ["cloud", "cost", "finops", "gpu-cost", "optimization"]
summary: "Cloud Cost（云成本）是指使用云服务产生的费用，包括计算、存储、网络、数据库等资源消耗，需要通过 FinOps 实践进行优化和治理。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "云成本"
  - "GPU Cost"
relationships:
  - target: "概念/finops"
    type: managed_by
  - target: "概念/alibaba-cloud"
    type: incurred_on
sources: []
---

# Cloud Cost（云成本）

> **一句话理解**: 云成本 = 用云服务花的钱。AI 时代 GPU 实例占大头，FinOps 是必备技能。

## 定义

Cloud Cost 是使用云服务产生的全部费用，包括计算、存储、网络、数据库、AI 服务等资源消耗。AI/LLM 时代，GPU 实例成本通常占总云支出 60-80%。

## AI 云成本构成

| 成本项 | 占比（AI 项目） | 优化方向 |
|---------|----------------|----------|
| **GPU 实例** | 60-80% | 量化、Spot、共享 |
| **存储** | 5-15% | 生命周期、压缩 |
| **网络** | 5-10% | 同区部署、CDN |
| **API 调用** | 5-15% | 缓存、小模型分流 |
| **其他** | 5% | 监控、日志 |

## GPU 成本优化策略

| 策略 | 节省 | 风险 |
|------|------|------|
| **Spot/抢占式实例** | 60-90% | 可能被回收 |
| **量化推理** | 30-50% | 精度略降 |
| **GPU 共享** | 40-60% | 调度复杂度 |
| **预留实例** | 30-50% | 灵活性低 |
| **自动缩容** | 20-40% | 冷启动延迟 |
| **小模型分流** | 50-70% | 质量分层 |

## FinOps 生命周期

```
Inform（可视化）→ Optimize（优化）→ Operate（运营）
     ↑                                        |
     └────────────────────────────────────────┘
```

| 阶段 | 关键动作 |
|------|----------|
| **Inform** | 成本分配、标签、报表、趋势分析 |
| **Optimize** | 右调优、Spot、预留、架构优化 |
| **Operate** | 预算告警、审批流程、持续改进 |

## 2026 年 AI 成本趋势

| 趋势 | 影响 |
|------|------|
| **推理成本下降** | 每年降 50-70%（硬件+算法） |
| **小模型崛起** | 7B-14B 覆盖 80% 场景 |
| **Serverless GPU** | 按 token 计费，无闲置浪费 |
| **国产芯片** | 价格低 30-50%，性能待提升 |

## 生产最佳实践

1. **打标签**：每个资源必须标记项目/团队/环境
2. **设预算告警**：超支 80% 即告警
3. **GPU 利用率监控**：< 30% 考虑缩容或共享
4. **混合计费**：基线用预留，峰值用 Spot
5. **定期审计**：每月清理闲置资源

## Related

- [[概念/finops|FinOps]]
- [[概念/gpu-sharing|GPU Sharing]]
- [[概念/GPU/flops|FLOPS]] — 算力与成本的关系
- [[运维/Cost_Management/GPU_Cost_Optimization|GPU 成本优化]]
