---
title: "AI 场景 FinOps"
category: 13-ai-ops
subcategory: cost-management
tags: ["finops", "cost-optimization", "gpu", "ai", "sre", "alibaba-cloud"]
summary: "面向 AI 训练与推理的成本治理方法：成本分摊、利用率监控、Spot/抢占实例、弹性伸缩、预算与告警。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

# AI 场景 FinOps

> **一句话理解**: FinOps for AI 就是「搞清楚 GPU 钱花哪了、谁花的、能不能少花」，并且让技术和财务用同一套语言沟通。

## 目录

- [1. AI 成本构成](#1-ai-成本构成)
- [2. 成本分摊](#2-成本分摊)
- [3. 利用率监控](#3-利用率监控)
- [4. 优化策略](#4-优化策略)
- [5. 预算与告警](#5-预算与告警)
- [Related](#related)

---

## 1. AI 成本构成

| 类别 | 占比 | 说明 |
|------|------|------|
| **GPU 计算** | 60-80% | 训练/推理主力 |
| **存储** | 10-20% | 模型、数据、Checkpoint |
| **网络** | 5-10% | RDMA/RoCE、公网出口 |
| **人力/软件** | 其余 | 平台、运维、许可证 |

## 2. 成本分摊

- **按团队/项目**: Namespace/Project 标签
- **按任务**: Training Job / Inference Service 标签
- **按模型**: 模型维度成本追踪
- **按环境**: dev/staging/prod

## 3. 利用率监控

| 指标 | 目标 |
|------|------|
| GPU 利用率 | > 70% |
| 显存利用率 | > 60% |
| 平均训练时间利用率 | > 85% |
| 推理请求密度 | 按容量规划 |

## 4. 优化策略

| 策略 | 说明 |
|------|------|
| **弹性伸缩** | HPA/KEDA 按需扩缩 |
| **Spot/抢占实例** | 非关键训练使用 |
| **混合调度** | 训练与推理错峰使用 |
| **模型压缩** | 量化、蒸馏、剪枝 |
| **请求合并** | Continuous Batching、Dynamic Batching |
| **自动关机** | 空闲开发环境自动关闭 |

## 5. 预算与告警

- **预算**: 按团队/项目设置月度 GPU 预算
- **告警**: 单日成本突增 50% 触发告警
- **报告**: 每周/每月成本与利用率报告

---

## Related

- [[_concepts/finops|FinOps]]
- [[_concepts/gpu-sharing|GPU Sharing]]
- [[_concepts/hami|HAMi]]
- [[AI运维/Cost_Management/GPU_Cost_Optimization|GPU 成本优化]]
