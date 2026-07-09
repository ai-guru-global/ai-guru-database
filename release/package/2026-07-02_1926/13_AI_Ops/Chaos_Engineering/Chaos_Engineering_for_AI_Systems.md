---
title: "AI 系统混沌工程"
category: 13-ai-ops
subcategory: chaos-engineering
tags: ["chaos-engineering", "reliability", "sre", "ai", "resilience", "alibaba-cloud"]
summary: "面向 AI 训练与推理平台的混沌工程方法：设计故障注入实验，验证系统在面对 GPU 故障、网络抖动、节点宕机时的韧性。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

# AI 系统混沌工程

> **一句话理解**: 混沌工程就是「主动搞破坏」来验证系统能不能扛住——在 AI 场景里，可能是杀个 Pod、断个网、让 GPU 报错。

## 目录

- [1. 为什么 AI 需要混沌工程](#1-为什么-ai-需要混沌工程)
- [2. 实验设计原则](#2-实验设计原则)
- [3. AI 场景故障注入](#3-ai-场景故障注入)
- [4. 工具](#4-工具)
- [5. 实验清单](#5-实验清单)
- [Related](#related)

---

## 1. 为什么 AI 需要混沌工程

- **训练任务长**: 中间任何故障都可能导致数天损失
- **资源昂贵**: GPU 空闲成本高
- **多租户复杂**: 单点故障影响面广
- **网络敏感**: RDMA/NCCL 对抖动敏感

## 2. 实验设计原则

1. **定义稳态**: 正常情况下系统行为是什么
2. **假设**: 注入故障后系统应如何表现
3. **注入**: 在可控范围内引入真实故障
4. **观察**: 监控指标、日志、告警
5. **恢复与复盘**: 自动恢复了吗？人工干预是什么？

## 3. AI 场景故障注入

| 故障类型 | 注入方式 |
|----------|---------|
| GPU 故障 | `nvidia-smi -g 0 -r`、GPU 温度异常模拟 |
| 网络抖动 | tc 限速、丢包、延迟 |
| 节点宕机 | kubectl drain / 关机 |
| Pod 删除 | kubectl delete pod |
| 存储慢 | ioping 限制、挂载点延迟 |
| 服务依赖故障 | 关闭 MLflow/模型仓库 |

## 4. 工具

- **Chaos Mesh**: K8s 原生混沌工程平台
- **Litmus**: CNCF 项目
- **Gremlin**: 商业化
- **PowerfulSeal**: K8s 故障注入

## 5. 实验清单

| 实验 | 目标 | 通过标准 |
|------|------|---------|
| 随机删除推理 Pod | 验证 HPA/自愈 | 服务自动恢复，SLO 不违反 |
| 模拟 NCCL 超时 | 验证训练容错 | checkpoint 恢复，不 hang |
| 注入 GPU OOM | 验证资源隔离 | 只影响单个任务 |
| 断开 RDMA 链路 | 验证网络冗余 | 自动切换到备用链路 |

---

## Related

- [[_concepts/chaos-engineering|Chaos Engineering]]
- [[_concepts/resilience|Resilience]]
- [[AI运维/Incident_Response/AI_Incident_Response_Framework|AI 事故响应框架]]

- [[AI运维/README|AI 运维与可观测性 (AI Ops)]]
