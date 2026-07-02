---
title: "Platform Engineering"
category: -concepts
tags: ["kubernetes", "k8s", "platform-engineering", "developer-experience", "idp", "cloud-native", "alibaba-cloud"]
summary: "Platform Engineering（平台工程）是通过构建内部开发者平台（IDP），把基础设施、工具链和最佳实践产品化，降低应用团队的认知负担。"
created: 2026-06-26
updated: 2026-06-26
tier: core
aliases:
  - "平台工程"
  - "Internal Developer Platform"
  - "IDP"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/backstage"
    type: related_to
  - target: "_concepts/gitops"
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

- [[_concepts/backstage|Backstage]] — 开发者门户
- [[_concepts/gitops|GitOps]] — 交付入口
- [[_concepts/kubernetes|Kubernetes]] — 平台底座
