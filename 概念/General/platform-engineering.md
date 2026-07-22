---
title: "Platform Engineering"
category: -concepts
tags: ["kubernetes", "k8s", "platform-engineering", "developer-experience", "idp", "cloud-native", "alibaba-cloud"]
summary: "Platform Engineering（平台工程）是通过构建内部开发者平台（IDP），把基础设施、工具链和最佳实践产品化，降低应用团队的认知负担。"
created: 2026-06-26
updated: 2026-07-21
tier: core
aliases:
  - "平台工程"
  - "Internal Developer Platform"
  - "IDP"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/backstage"
    type: related_to
  - target: "概念/gitops"
    type: related_to
sources: []
---

# Platform Engineering

> **一句话理解**: 平台工程就是把「运维能力」封装成「自助服务产品」，让开发团队能像用云产品一样快速、安全地使用 K8s、数据库、流水线等资源。

## 核心要点

- **降低认知负担**: 开发者无需精通 K8s、Terraform、CI/CD 细节即可交付应用。
- **黄金路径**: 提供经过安全、性能、合规验证的默认模板和工作流。
- **内部开发者平台（IDP）**: 统一入口，整合服务目录、环境管理、发布流水线、可观测性。
- **产品化运维**: 平台团队像产品经理一样运营平台，关注用户体验和 SLI/SLO。
- **自助服务**: 通过 Backstage、Port、Cortex 等门户实现资源自助申请。

## 典型 IDP 能力栈

| 能力 | 工具示例 |
|------|---------|
| 服务目录 | Backstage |
| GitOps | ArgoCD / Flux |
| 基础设施即代码 | Terraform / Crossplane |
| CI/CD | Tekton / Jenkins |
| 可观测性 | Prometheus / Grafana / Loki |
| 成本管理 | Kubecost / OpenCost |

## 阿里云专有云关联

在阿里云专有云环境中，平台工程通常基于 ACK + ASCM + 天基 + Backstage 构建 IDP，为集团内各业务单元提供自助容器服务。工单中「资源申请」、「环境开通」、「发布权限」等问题都可通过 IDP 自助化减少人工工单。

## Related

- [[概念/backstage|Backstage]] — 开发者门户
- [[概念/gitops|GitOps]] — 交付入口
- [[概念/kubernetes|Kubernetes]] — 平台底座

---

## 2026 平台工程生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Backstage** | 开发者门户 | GA |
| **内部开发者平台** | IDP 平台建设 | GA |
| **自助服务** | 开发者自助服务 | GA |
| **Golden Path** | 标准化开发路径 | GA |
| **平台即产品** | 平台产品化思维 | GA |

## 生产最佳实践

1. **开发者门户**：用 Backstage 建设开发者门户
2. **自助服务**：提供开发者自助服务
3. **Golden Path**：定义标准化开发路径
4. **平台即产品**：用产品思维运营平台
5. **与 GitOps 配合**：平台工程 + GitOps 交付

## IDP 架构分层

| 层级 | 组件 | 职责 |
|------|------|------|
| 门户层 | Backstage / Port | 开发者自助入口 |
| 编排层 | ArgoCD / Tekton | CI/CD 流水线 |
| 抽象层 | Crossplane / Terraform | 基础设施抽象 |
| 平台层 | K8s / ACK | 容器编排底座 |
| 基础设施 | 云/裸机 | 计算/存储/网络 |

## Golden Path 模板示例

```yaml
# 服务模板 (Backstage scaffolder)
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: ai-service-template
  title: AI 推理服务模板
spec:
  parameters:
    - title: 服务信息
      properties:
        name:
          type: string
          title: 服务名称
        model:
          type: string
          title: 模型名称
        gpu:
          type: integer
          title: GPU 数量
          default: 1
  steps:
    - id: fetch
      name: 拉取模板
      action: fetch:template
      input:
        url: ./skeleton
        values:
          name: ${{ parameters.name }}
    - id: publish
      name: 创建仓库
      action: publish:github
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 开发者不用平台 | 体验差 | 产品化思维运营 |
| 平台过于复杂 | 功能堆砌 | 简化 + 渐进式披露 |
| 缺乏标准化 | 无 Golden Path | 定义标准模板 |
| 运维负担重 | 自动化不足 | 自助服务 + 自动化 |

## 相关概念

- [[概念/backstage|Backstage]] — 开发者门户
- [[概念/gitops|GitOps]] — 交付入口
- [[概念/kubernetes|Kubernetes]] — 平台底座
- [[概念/General/sre|SRE]] — 站点可靠性工程

## 总结

平台工程是通过构建内部开发者平台，把基础设施、工具链和最佳实践产品化，降低应用团队的认知负担。核心是自助服务、Golden Path 和平台即产品。

---

> 💡 平台工程就是把「运维能力」封装成「自助服务产品」，让开发团队能像用云产品一样快速、安全地使用资源。

## 平台成熟度模型

| 级别 | 特征 | 典型表现 |
|------|------|----------|
| L1 临时 | 手动运维 | 工单驱动、无标准化 |
| L2 标准化 | 有模板和流程 | 基本自助、有文档 |
| L3 自助化 | IDP 门户 | 开发者自助服务 |
| L4 产品化 | 平台即产品 | SLI/SLO、用户反馈 |
| L5 智能化 | AI 驱动 | 智能推荐、自动优化 |

## 工具对比

| 工具 | 定位 | 特点 | 适用场景 |
|------|------|------|----------|
| **Backstage** | 开发者门户 | CNCF、插件丰富 | 服务目录 + 模板 |
| **Port** | IDP 平台 | 可视化、低代码 | 快速搭建 IDP |
| **Cortex** | 服务目录 | 服务评分 | 服务治理 |
| **Humanitec** | 平台编排 | 动态配置 | 复杂环境管理 |
| **自研** | 定制化 | 完全控制 | 大型企业 |

## 平台指标 (KPI)

| 指标 | 计算方式 | 目标 |
|------|----------|------|
| 开发者满意度 | NPS/CSAT | > 4.0/5 |
| 自助率 | 自助操作/总操作 | > 80% |
| 环境开通时间 | 从申请到可用 | < 10min |
| 部署频率 | 每周部署次数 | 按需 |
| 平台可用性 | 平台 SLO | 99.9% |

## 版本兼容性

| 工具 | 版本 | 状态 |
|------|------|------|
| Backstage | 1.30+ | 稳定 |
| ArgoCD | 2.12+ | 稳定 |
| Crossplane | 1.17+ | 稳定 |
| Tekton | 0.60+ | 稳定 |

## AI 平台工程最佳实践

1. **GPU 自助申请**：开发者自助申请 GPU 资源
2. **模型模板**：提供推理服务标准模板
3. **训练流水线**：标准化训练任务提交流程
4. **模型仓库**：统一模型版本管理
5. **监控集成**：GPU/推理指标自动接入监控

## 相关概念

- [[概念/backstage|Backstage]] — 开发者门户
- [[概念/gitops|GitOps]] — 交付入口
- [[概念/kubernetes|Kubernetes]] — 平台底座
- [[概念/ack|ACK]] — 阿里云容器服务

> 💡 平台工程的终极目标是让开发者专注业务逻辑，基础设施复杂性由平台团队封装和消化。
