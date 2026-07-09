---
title: "Cloud Cost"
category: -concepts
tags: ["cloud", "cost", "finops", "alibaba-cloud"]
summary: "Cloud Cost（云成本）是指使用云服务产生的费用，包括计算、存储、网络、数据库等资源消耗，需要通过 FinOps 实践进行优化和治理。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "云成本"
relationships:
  - target: "_concepts/finops"
    type: managed_by
  - target: "_concepts/alibaba-cloud"
    type: incurred_on
sources: []
---

# Cloud Cost

> **一句话理解**: 云成本就是你用云服务花的钱，包括服务器、存储、流量、数据库等，需要监控和优化。

## 核心要点

- **计算成本**: CPU/GPU 实例费用
- **存储成本**: 对象存储、块存储、文件存储
- **网络成本**: 公网出口、跨区流量
- **数据库成本**: RDS、NoSQL、缓存
- **优化方向**: 预留实例、Spot、自动关机、资源右调优

## FinOps 生命周期

```text
Inform → Optimize → Operate
```

## 阿里云专有云关联

在阿里云专有云环境中，云成本管理通过 ASCM 资源计量、配额和成本分摊实现。

## Related

- [[_concepts/finops|FinOps]]
- [[_concepts/gpu-sharing|GPU Sharing]]
- [[AI运维/Cost_Management/GPU_Cost_Optimization|GPU 成本优化]]
