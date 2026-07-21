---
title: "Alibaba Cloud"
category: -concepts
tags: ["cloud", "alibaba-cloud", "paas", "iaas", "ai", "alibaba-cloud"]
summary: "阿里云（Alibaba Cloud）是阿里巴巴集团旗下的云计算及人工智能科技公司，提供 IaaS、PaaS、SaaS 及 AI 全栈云服务。"
created: 2026-06-26
updated: 2026-07-21
tier: core
aliases:
  - "阿里云"
  - "Aliyun"
relationships:
  - target: "概念/ack"
    type: provides
  - target: "概念/pai"
    type: provides
  - target: "概念/apsara-stack"
    type: provides
sources: []
---

# Alibaba Cloud

> **一句话理解**: 阿里云是中国最大的公有云服务商之一，提供计算、存储、网络、数据库、大数据、AI 等全栈云产品。

## 核心要点

- **公有云**: 覆盖全球多个 Region 和可用区。
- **专有云**: Apsara Stack（飞天企业版）支持私有化部署。
- **AI 产品**: PAI（AI 平台）、百炼（大模型服务平台）、通义系列模型。
- **容器服务**: ACK（容器服务 Kubernetes 版）。
- **存储网络**: 盘古存储、洛神网络、神龙计算。

## 主要产品

| 产品 | 说明 |
|------|------|
| ECS | 弹性计算服务 |
| OSS | 对象存储 |
| RDS | 关系型数据库 |
| ACK | 容器服务 Kubernetes 版 |
| PAI | 人工智能平台 |
| SLS | 日志服务 |
| ARMS | 应用实时监控服务 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）环境中，阿里云公有云能力被部署到企业本地数据中心，由天基 Tianji 统一运维管理。

## Related

- [[概念/ack|ACK]]
- [[概念/pai|PAI]]
- [[概念/apsara-stack|Apsara Stack]]
- [[架构基建/Cloud_Providers/Alibaba_PAI_Deep_Dive|阿里云 PAI 深度解析]]

---

## 2026 阿里云生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **PAI** | AI 平台 | GA |
| **ACK** | 容器服务 K8s | GA |
| **OSS** | 对象存储 | GA |
| **AI Stack** | 软硬一体 AI 平台 | GA |
| **百炼** | 大模型服务平台 | GA |

## 生产最佳实践

1. **AI 平台**：AI 项目用 PAI 平台
2. **容器编排**：K8s 用 ACK 托管
3. **数据存储**：训练数据用 OSS 存储
4. **专有云**：政企场景用 Apsara Stack
5. **大模型服务**：大模型用百炼平台
