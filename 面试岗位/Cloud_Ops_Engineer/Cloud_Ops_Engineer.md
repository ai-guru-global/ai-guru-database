---
title: "Cloud Ops Engineer 面试指南"
category: "21-interviews-cloud-ops-engineer"
tags: ["interviews", "career", "cloud-ops", "kubernetes", "ai", "infrastructure", "sre"]
summary: "Cloud Ops Engineer 面试题库，面向 AI/LLM 平台的运维与工单处理岗位，覆盖 K8s、GPU、网络、存储、SRE、事故响应与云原生可观测性。"
created: 2026-06-26
updated: 2026-07-01
tier: supporting
aliases:
  - "Cloud Ops Engineer"
  - "Cloud_Ops_Engineer Interview Guide"
sources: []
---

# Cloud Ops Engineer 题库

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

---

## K8s 基础与调度 (12 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 解释 Kubernetes 的控制平面组件及其高可用设计 | ⭐⭐ | 🔴 |
| 2 | kube-scheduler 的调度流程是什么？如何自定义调度策略？ | ⭐⭐ | 🔴 |
| 3 | Pod 一直处于 Pending 状态，排查思路是什么？ | ⭐⭐ | 🔴 |
| 4 | Deployment 滚动更新失败，如何回滚？ | ⭐⭐ | 🔴 |
| 5 | K8s 中 GPU 调度的完整链路：Device Plugin → kube-scheduler → Pod | ⭐⭐ | 🔴 |
| 6 | NetworkPolicy 如何限制 AI 推理服务的跨命名空间访问？ | ⭐⭐ | 🟡 |
| 7 | StatefulSet 与 Deployment 在模型服务场景下如何选择？ | ⭐⭐ | 🟡 |
| 8 | K8s 中如何实现有状态服务（如 MLflow DB）的持久化存储？ | ⭐⭐ | 🟡 |
| 9 | ResourceQuota 和 LimitRange 在多租户集群中如何配合使用？ | ⭐⭐⭐ | 🟡 |
| 10 | 解释 K8s 中的抢占（Preemption）与优先级（PriorityClass） | ⭐⭐⭐ | 🟢 |
| 11 | K8s 控制平面出现脑裂怎么办？etcd 如何恢复？ | ⭐⭐⭐ | 🟢 |
| 12 | 如何设计一个多租户的 AI K8s 集群命名空间与资源隔离方案？ | ⭐⭐⭐ | 🟡 |

## GPU 与 AI 工作负载 (10 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | nvidia-smi 输出中哪些指标最重要？如何解读？ | ⭐ | 🔴 |
| 2 | GPU 利用率低但显存满了，可能是什么原因？ | ⭐⭐ | 🔴 |
| 3 | 区分 host OOM、container OOM、CUDA OOM、HAMi vGPU oversell | ⭐⭐ | 🔴 |
| 4 | MIG、Time Slicing、HAMi 三种 GPU 共享方案如何选择？ | ⭐⭐ | 🔴 |
| 5 | 训练任务 NCCL timeout / hang，排查总线是什么？ | ⭐⭐⭐ | 🔴 |
| 6 | 如何监控多节点 GPU 集群的 RDMA/RoCE 网络健康？ | ⭐⭐⭐ | 🟡 |
| 7 | GPU 驱动升级导致 Pod 无法调度，如何回滚？ | ⭐⭐ | 🟡 |
| 8 | PyTorchJob 失败，如何快速定位是代码、数据还是资源问题？ | ⭐⭐ | 🔴 |
| 9 | 推理服务 HPA 基于什么指标最有效？为什么 CPU 利用率不适用？ | ⭐⭐ | 🟡 |
| 10 | 国产 GPU/NPU（昇腾/寒武纪/海光/摩尔线程）接入 K8s 的关键差异？ | ⭐⭐⭐ | 🟢 |

## 网络与存储 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | AI 集群为什么需要 RDMA/RoCE/InfiniBand？与 TCP/IP 有什么区别？ | ⭐⭐ | 🔴 |
| 2 | K8s 中如何给 Pod 配置多网卡（管理面 + RDMA 数据面）？ | ⭐⭐⭐ | 🟡 |
| 3 | 训练数据放在 NAS vs 并行文件系统 vs OSS，各有什么优劣？ | ⭐⭐ | 🔴 |
| 4 | Checkpoint 写入慢导致 GPU 空闲，如何优化？ | ⭐⭐⭐ | 🟡 |
| 5 | PVC 处于 Pending，可能有哪些原因？ | ⭐⭐ | 🔴 |
| 6 | 如何设计 AI 集群的存储分层策略？ | ⭐⭐⭐ | 🟡 |
| 7 | 什么是 PFC/ECN？在 RoCE 网络中为什么重要？ | ⭐⭐⭐ | 🟢 |
| 8 | 分布式训练对网络收敛比有什么要求？ | ⭐⭐⭐ | 🟢 |

## SRE 与事故响应 (10 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 什么是 SLO/SLI/Error Budget？在 AI 推理服务中如何定义？ | ⭐⭐ | 🔴 |
| 2 | 设计一个 LLM 推理服务的监控 Dashboard，你会放哪些面板？ | ⭐⭐ | 🔴 |
| 3 | 收到 P0 告警后的前 5 分钟应该做什么？ | ⭐⭐ | 🔴 |
| 4 | 如何组织一次有效的事故复盘（Postmortem）？ | ⭐⭐ | 🔴 |
| 5 | 混沌工程在 AI 平台中有哪些典型实验？ | ⭐⭐⭐ | 🟡 |
| 6 | 值班 On-Call 交接应该包含哪些内容？ | ⭐ | 🟡 |
| 7 | AI 系统与 Web 系统在事故响应上有什么不同？ | ⭐⭐ | 🟡 |
| 8 | 如何设计告警降噪，避免告警疲劳？ | ⭐⭐ | 🟡 |
| 9 | 模型回滚与代码回滚有什么区别？ | ⭐⭐ | 🔴 |
| 10 | 推理服务 SLO 违反但错误预算还有，是否暂停发布？为什么？ | ⭐⭐⭐ | 🟢 |

## 可观测性 (6 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | Prometheus 采集 vLLM 推理指标，关键指标有哪些？ | ⭐⭐ | 🔴 |
| 2 | 如何使用 Grafana 发现 GPU 利用率异常？ | ⭐ | 🔴 |
| 3 | 分布式训练中的日志如何集中收集与分析？ | ⭐⭐ | 🟡 |
| 4 | 链路追踪在 LLM 推理服务中的作用是什么？ | ⭐⭐ | 🟡 |
| 5 | 如何设置合理的告警阈值，避免误报和漏报？ | ⭐⭐ | 🟡 |
| 6 | 日志、指标、追踪在 AI 平台中如何协同？ | ⭐⭐⭐ | 🟢 |

## 安全与多租户 (5 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | AI 容器镜像安全应该关注哪些方面？ | ⭐⭐ | 🟡 |
| 2 | 多租户 AI 集群如何防止一个用户拖垮整个集群？ | ⭐⭐⭐ | 🔴 |
| 3 | 模型仓库如何防止未授权访问和篡改？ | ⭐⭐ | 🟡 |
| 4 | K8s 中如何保护训练数据不被其他 Pod 访问？ | ⭐⭐ | 🟡 |
| 5 | 什么是 AI 供应链安全？如何防范？ | ⭐⭐⭐ | 🟢 |

## 实战与系统设计 (5 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 设计一个 GPU 集群的监控告警方案 | ⭐⭐⭐ | 🔴 |
| 2 | 设计一个 LLM 推理服务的自动扩缩容方案 | ⭐⭐⭐ | 🔴 |
| 3 | 如何为一个新上线的 AI 平台制定 On-Call Runbook？ | ⭐⭐ | 🟡 |
| 4 | 设计一个多租户 AI 训练平台的资源配额与优先级方案 | ⭐⭐⭐ | 🟡 |
| 5 | 遇到「训练任务大规模 hang」的事故，你的处理流程是什么？ | ⭐⭐⭐ | 🔴 |

---

## Related

- [[面试岗位/AI_Infrastructure_Engineer/question_bank|AI Infrastructure Engineer 题库]]
- [[面试岗位/README|AI 面试准备 (Interviews)]]
- [[运维/SRE_Reliability/SRE_for_AI_Systems|SRE for AI Systems]]
- [[运维/Incident_Response/AI_Incident_Response_Framework|AI 事故响应框架]]
