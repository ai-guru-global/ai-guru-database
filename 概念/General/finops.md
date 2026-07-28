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
name_zh: "云财务管理"
---

# FinOps

> 中文简称：云财务管理

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
- [[13_运维/05_Cost_Management/FinOps_for_AI|AI 场景 FinOps]]

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

## FinOps 成熟度模型

| 阶段 | 特征 | 典型表现 |
|------|------|----------|
| Inform | 成本可见 | 有账单但无分析 |
| Optimize | 成本优化 | 定期优化资源 |
| Operate | 持续运营 | 自动化成本管理 |

## AI 成本优化策略

| 策略 | 说明 | 节省比例 |
|------|------|----------|
| GPU 共享 | 多任务共享 GPU | 30-50% |
| 抢占实例 | Spot 实例训练 | 60-80% |
| 模型量化 | INT8/INT4 推理 | 20-40% |
| 批量推理 | 合并请求 | 10-30% |
| 自动关机 | 空闲资源关机 | 20-40% |
| 错峰调度 | 低峰期训练 | 10-20% |

## 配置示例

```yaml
# K8s 资源配额 - 团队 GPU 预算
apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-a-gpu-quota
  namespace: team-a
spec:
  hard:
    nvidia.com/gpu: "8"
    requests.cpu: "64"
    requests.memory: 256Gi
    limits.cpu: "128"
    limits.memory: 512Gi
---
# 空闲资源自动关机 (KEDA)
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: inference-autoscaler
spec:
  scaleTargetRef:
    name: llm-inference
  minReplicaCount: 0
  maxReplicaCount: 4
  triggers:
    - type: prometheus
      metadata:
        serverAddress: http://prometheus:9090
        metricName: http_requests_total
        threshold: "10"
        query: sum(rate(http_requests_total{job="llm"}[5m]))
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| GPU 利用率低 | 任务调度不合理 | GPU 共享 + 队列管理 |
| 成本超预算 | 缺乏配额管理 | ResourceQuota + 告警 |
| 资源浪费 | 空闲资源未回收 | 自动关机 + TTL |
| 账单不透明 | 缺乏标签 | 统一标签体系 |

## 相关概念

- [[概念/cloud-cost|Cloud Cost]] — 云成本
- [[概念/gpu-sharing|GPU Sharing]] — GPU 共享
- [[概念/General/sre|SRE]] — 站点可靠性工程
- [[概念/General/platform-engineering|Platform Engineering]] — 平台工程

## 总结

FinOps 是云成本管理的实践框架，通过技术、业务和财务的协作实现云资源的可见性、优化与治理。在 AI 场景中，GPU 成本优化是核心。

---

> 💡 FinOps 就是「让云钱花得明白、花得值」，技术、财务、业务一起管成本。

## FinOps 工具对比

| 工具 | 定位 | 特点 | 适用场景 |
|------|------|------|----------|
| **Kubecost** | K8s 成本 | 容器级成本分析 | K8s 环境 |
| **OpenCost** | 开源成本 | CNCF 项目 | 自建成本分析 |
| **云厂商账单** | 云账单 | 原生集成 | 云资源成本 |
| **Grafana** | 可视化 | 自定义 Dashboard | 成本可视化 |
| **自研平台** | 企业级 | 定制化 | 大型企业 |

## 成本分摊模型

| 维度 | 分摊方式 | 说明 |
|------|----------|------|
| 团队 | Namespace 标签 | 按团队分摊 |
| 项目 | 项目标签 | 按项目分摊 |
| 环境 | 环境标签 | dev/staging/prod |
| GPU 类型 | 资源标签 | A100/H100/V100 |
| 时间 | 使用时长 | 按小时/天/月 |

## 治理框架

| 层级 | 措施 | 负责人 |
|------|------|--------|
| 预算 | 月度/季度预算 | 财务 + 工程 |
| 配额 | 团队 GPU 配额 | 平台工程 |
| 告警 | 成本超支告警 | SRE |
| 审计 | 资源使用审计 | 财务 |
| 优化 | 定期优化审查 | FinOps 团队 |

## 版本兼容性

| 工具 | 版本 | 状态 |
|------|------|------|
| Kubecost | 2.5+ | 稳定 |
| OpenCost | 1.108+ | 稳定 |
| KEDA | 2.14+ | 稳定 |

## AI 团队 FinOps 检查清单

1. 每个团队有明确的 GPU 配额
2. 训练任务使用抢占实例降低成本
3. 推理服务配置自动扩缩容
4. 空闲 GPU 资源自动回收
5. 月度成本报告审视

> 💡 FinOps 的核心是让每一分钱的云资源花费都可追踪、可归因、可优化。
