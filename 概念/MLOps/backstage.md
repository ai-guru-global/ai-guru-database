---
title: "Backstage"
category: -concepts
tags: ["kubernetes", "k8s", "platform-engineering", "developer-experience", "idp", "cloud-native", "alibaba-cloud"]
summary: "Backstage 是 Spotify 开源的开发者门户平台，用于构建企业内部开发者平台（IDP），统一管理服务目录、文档、工具和工程标准。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Backstage IDP"
  - "开发者门户"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/gitops"
    type: related_to
  - target: "概念/platform-engineering"
    type: related_to
sources: []
---

# Backstage

> **一句话理解**: Backstage 是企业内部的「工程操作系统」，把服务目录、文档、脚手架、监控、发布入口整合到一个门户里。

## 核心要点

- **软件目录**: 统一管理微服务、组件、API、资源的所有权、依赖和生命周期。
- **软件模板**: 一键生成符合企业标准的新服务脚手架。
- **技术文档**: 把 Markdown 文档与服务绑定，解决文档分散问题。
- **插件生态**: 集成 Kubernetes、ArgoCD、SonarQube、PagerDuty、Jenkins 等。
- **平台工程基石**: 是构建 Internal Developer Platform（IDP）的首选框架。

## 核心模型

| 实体 | 含义 |
|------|------|
| `Component` | 服务、库、应用 |
| `API` | 接口定义 |
| `Resource` | 数据库、S3 桶、K8s 集群 |
| `System` | 系统边界 |
| `Domain` | 业务域 |
| `User` / `Group` | 所有权 |

## 阿里云专有云关联

在阿里云专有云环境中，Backstage 可作为内部开发者平台入口，聚合 ACK 集群、ASCM 资源、ARMS 监控、GitOps 流水线等插件。工单中「找不到服务负责人」或「文档过期」时，Backstage 软件目录是重要信息源。

## Related

- [[概念/kubernetes|Kubernetes]] — 平台资源
- [[概念/gitops|GitOps]] — 交付入口
- [[概念/platform-engineering|Platform Engineering]] — 平台工程
