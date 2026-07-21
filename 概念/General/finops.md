---
title: "FinOps"
category: -concepts
tags: ["finops", "cost-optimization", "cloud", "ai", "gpu", "alibaba-cloud"]
summary: "FinOps 是云成本管理的实践框架，通过技术、业务和财务的协作，实现云资源的可见性、优化与治理。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "云成本管理"
  - "Cloud Financial Management"
relationships:
  - target: "概念/cloud-cost"
    type: related_to
  - target: "概念/gpu-sharing"
    type: related_to
sources: []
---

# FinOps

> **一句话理解**: FinOps 就是「让云钱花得明白、花得值」，技术、财务、业务一起管成本。

## 核心要点

- **可见性**: 知道钱花在哪、谁花的
- **优化**: 提升利用率、按需扩缩容
- **治理**: 预算、配额、告警、审计
- **协作**: 工程、财务、业务共同决策

## 生命周期

```text
Inform → Optimize → Operate
```

## AI 场景重点

- GPU 利用率监控
- 训练/推理错峰调度
- Spot/抢占实例
- 模型压缩降低推理成本
- 自动关机空闲资源

## 阿里云专有云关联

在阿里云专有云环境中，FinOps 可通过 ASCM 资源计量、配额管理与成本分摊实现。

## Related

- [[概念/cloud-cost|Cloud Cost]]
- [[概念/gpu-sharing|GPU Sharing]]
- [[运维/Cost_Management/FinOps_for_AI|AI 场景 FinOps]]

---

## 2026 FinOps 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **成本可视化** | 云成本可视化分析 | GA |
| **资源优化** | 资源利用率优化 | GA |
| **GPU 共享** | GPU 资源共享调度 | GA |
| **预留实例** | 预留实例降低成本 | GA |
| **AI 成本优化** | LLM 推理成本优化 | GA |

## 生产最佳实践

1. **成本可视化**：建立成本可视化体系
2. **资源优化**：定期优化资源利用率
3. **GPU 共享**：GPU 资源共享提高利用率
4. **预留实例**：稳定负载用预留实例
5. **AI 成本**：LLM 推理成本优化
