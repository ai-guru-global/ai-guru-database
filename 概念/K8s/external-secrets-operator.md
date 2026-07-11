---
title: "External Secrets Operator"
category: -concepts
tags: ["kubernetes", "k8s", "security", "secrets-management", "vault", "cloud-native", "alibaba-cloud"]
summary: "External Secrets Operator（ESO）将 Vault、云 KMS、参数仓库等外部 Secrets 自动同步到 Kubernetes Secret，避免在 Git 中泄露敏感数据。"
created: 2026-06-26
updated: 2026-06-26
tier: archived
aliases:
  - "ESO"
  - "External Secrets"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/secret"
    type: related_to
  - target: "概念/vault"
    type: related_to
sources: []
---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

# External Secrets Operator

> **一句话理解**: ESO 是 K8s 与外部密钥库之间的「同步器」，让 Secret 继续由 Vault/KMS 管理，同时让 Pod 以原生 Secret 方式使用。

## 核心要点

- **外部 Secret 源**: HashiCorp Vault、AWS Secrets Manager、Azure Key Vault、GCP Secret Manager、阿里云 KMS、GitLab CI/CD variables 等。
- **自动同步**: 外部 Secret 更新后，自动刷新 K8s Secret。
- **GitOps 友好**: Git 仓库只保留非敏感的 `ExternalSecret` 资源，真正的密钥在外部系统。
- **多租户**: 通过 `SecretStore`（Namespace 级）和 `ClusterSecretStore`（集群级）管理权限。

## 典型配置

```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: vault-backend
  namespace: prod
spec:
  provider:
    vault:
      server: "https://vault.internal:8200"
      path: "secret"
      version: "v2"
      auth:
        kubernetes:
          mountPath: "kubernetes"
          role: "prod-role"
          serviceAccountRef:
            name: external-secrets-sa
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-creds
  namespace: prod
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    name: db-secret
  data:
    - secretKey: password
      remoteRef:
        key: secret/data/prod/db
        property: password
```

## 阿里云专有云关联

在专有云环境中，ESO 可对接自建的 Vault 或阿里云 KMS 私有化版本，实现 Secret 的集中管理。工单中「Secret 未同步」时，检查 ESO Pod 日志、SecretStore 认证、远程路径与权限。

## Related

- [[概念/vault|Vault]] — 密钥管理平台
- [[概念/secret|Secret]] — K8s Secret
- [[概念/sealed-secrets|Sealed Secrets]] — Git 加密 Secret
- [[概念/kubernetes|Kubernetes]] — 容器编排
