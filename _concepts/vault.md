---
title: "Vault"
category: -concepts
tags: ["kubernetes", "k8s", "security", "secrets-management", "hashicorp", "cloud-native", "alibaba-cloud"]
summary: "Vault 是 HashiCorp 开源的 secrets 管理与数据保护平台，提供动态凭据、加密即服务、K8s 集成等能力。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "HashiCorp Vault"
  - "K8s 密钥管理"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/secret"
    type: related_to
  - target: "_concepts/cert-manager"
    type: related_to
---

# Vault

> **一句话理解**: Vault 是企业级的「密钥保险箱」，帮 K8s 应用安全地管理密码、Token、证书，并实现自动轮换和细粒度访问控制。

## 核心要点

- **Secrets 集中管理**: 统一存储数据库密码、API Key、TLS 证书等敏感数据。
- **动态凭据**: 可按需为应用生成临时数据库账号密码，用完后自动回收。
- **K8s 集成**: 通过 Vault Agent Sidecar Injector 或 CSI Provider 把 Secret 注入 Pod。
- **加密即服务**: 提供 Transit 引擎，支持应用层数据的加解密。
- **细粒度 ACL**: 基于 Path 和 Token 策略控制访问。

## K8s 集成方式

```text
方式 1: Vault Agent Sidecar Injector
Pod → init-container 登录 Vault → sidecar 注入 Secret 文件

方式 2: Vault CSI Provider
Pod → CSI Driver → 从 Vault 读取 Secret → 挂载为 Volume
```

## 阿里云专有云关联

在阿里云专有云环境中，Vault 常作为统一的 secrets 管理平台，替代原生 K8s Secret 明文存储。工单中「应用启动报数据库密码错误」时，需检查 Vault 服务可用性、AppRole 或 K8s Auth 配置、Secret 路径与版本。

## Related

- [[_concepts/secret|Secret]] — K8s 原生 Secret
- [[_concepts/cert-manager|cert-manager]] — 自动证书管理
- [[_concepts/external-secrets-operator|External Secrets Operator]] — 将外部 Secret 同步到 K8s
- [[_concepts/kubernetes|Kubernetes]] — 容器编排
