---
title: "Backstage"
category: -concepts
tags: ["kubernetes", "k8s", "platform-engineering", "developer-experience", "idp", "cloud-native", "alibaba-cloud"]
summary: "Backstage 是 Spotify 开源的开发者门户平台，用于构建企业内部开发者平台（IDP），统一管理服务目录、文档、工具和工程标准。"
created: 2026-06-26
updated: 2026-07-21
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

---

## 2026 Backstage 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Backstage** | Spotify 开源开发者门户 | GA |
| **软件目录** | 统一服务/组件/API 目录 | GA |
| **插件系统** | 可扩展插件架构 | GA |
| **TechDocs** | 技术文档托管 | GA |
| **K8s 集成** | 原生 Kubernetes 集成 | GA |

## 生产最佳实践

1. **统一门户**：用 Backstage 作为开发者统一门户
2. **服务目录**：所有服务/API 注册到 Backstage 目录
3. **插件扩展**：根据需要开发自定义插件
4. **与 GitOps 集成**：Backstage + ArgoCD 实现自助部署
5. **文档托管**：用 TechDocs 托管技术文档

## 2026 Backstage 生态

| 插件 | 功能 | 状态 |
|------|------|------|
| **Kubernetes** | K8s 资源查看 | GA |
| **GitHub** | 仓库集成 | GA |
| **TechDocs** | 文档托管 | GA |
| **Scaffolder** | 模板创建 | GA |
| **Catalog** | 服务目录 | GA |
| **ArgoCD** | GitOps 集成 | GA |

## Backstage 架构

```
Backstage 架构:
┌─────────────────────────────────────────┐
│  前端: React + Material UI             │
├─────────────────────────────────────────┤
│  后端: Node.js + TypeScript            │
├─────────────────────────────────────────┤
│  插件系统: 可扩展插件架构            │
├─────────────────────────────────────────┤
│  集成: GitHub/GitLab/K8s/ArgoCD       │
└─────────────────────────────────────────┘
```

## Backstage 配置示例

```yaml
# app-config.yaml
app:
  title: AI Platform Portal
  baseUrl: http://localhost:3000

backend:
  baseUrl: http://localhost:7007
  database:
    client: better-sqlite3
    connection: ':memory:'

catalog:
  locations:
    - type: url
      target: https://github.com/org/repo/blob/main/catalog-info.yaml
```

## 延伸阅读

- [[概念/MLOps/mlops|MLOps]] — MLOps 总览
- [[概念/K8s/kubernetes|Kubernetes]] — 容器编排
- [[概念/MLOps/argo-rollouts|Argo Rollouts]] — 渐进式交付
- [[概念/架构基建/DevOps|DevOps]] — 开发运维

> ℹ️ Backstage 是开发者门户的标准，统一服务目录和自助服务。

## Backstage 核心功能

| 功能 | 说明 | 价值 |
|------|------|------|
| **服务目录** | 统一查看所有服务 | 发现性 |
| **模板** | 自助创建新项目 | 效率 |
| **文档** | TechDocs 托管 | 知识沉淀 |
| **集成** | GitHub/K8s/ArgoCD | 统一视图 |
| **插件** | 可扩展功能 | 灵活性 |

## Backstage 部署示例

```bash
# 创建 Backstage 应用
npx @backstage/create-app@latest

# 启动开发服务器
cd my-backstage-app
yarn dev

# 构建生产版本
yarn build

# Docker 部署
docker build -t backstage .
docker run -p 7007:7007 backstage
```

## Backstage 最佳实践

1. **服务目录先行**：先建立服务目录，再扩展功能
2. **模板标准化**：用模板标准化项目创建
3. **文档即代码**：TechDocs 与代码一起版本控制
4. **插件按需**：只安装需要的插件，避免膨胀
5. **与 GitOps 集成**：Backstage + ArgoCD 实现自助部署

## 延伸阅读

- [[概念/MLOps/mlops|MLOps]] — MLOps 总览
- [[概念/K8s/kubernetes|Kubernetes]] — 容器编排
- [[概念/MLOps/argo-rollouts|Argo Rollouts]] — 渐进式交付
- [[概念/架构基建/DevOps|DevOps]] — 开发运维

> ℹ️ Backstage 是开发者门户的标准，统一服务目录和自助服务。

## Backstage vs 其他门户

| 工具 | 特点 | 适用 |
|------|------|------|
| **Backstage** | 开源，插件丰富 | 通用 |
| **Port** | SaaS，易用 | 中小团队 |
| **Cortex** | 服务目录 + 评分 | 企业 |
| **OpsLevel** | 服务成熟度 | 企业 |

## Backstage 检查清单

- [ ] 服务目录已建立
- [ ] 核心服务已注册
- [ ] 模板已配置
- [ ] TechDocs 已启用
- [ ] GitHub/GitLab 已集成
- [ ] K8s 插件已配置
- [ ] 权限控制已配置

> 生产环境建议定期审查服务目录，清理已下线的服务。
> Backstage 是平台工程的核心组件，提升开发者体验。
> 插件开发遵循 Backstage 插件 API，确保兼容性。
> 与 ArgoCD 集成可实现自助式 GitOps 部署。
> 定期更新 Backstage 版本，获取最新功能和安全修复。
> 服务目录应包含所有 AI/ML 服务，方便团队发现和复用。

## 延伸阅读

- [[概念/MLOps/mlops|MLOps]] — MLOps 方法论
- [[概念/MLOps/observability|Observability]] — 可观测性
- [[概念/K8s/kubernetes|Kubernetes]] — 容器编排

> ℹ️ Backstage 是 Spotify 开源的开发者门户，提供服务目录、文档、插件等功能。
