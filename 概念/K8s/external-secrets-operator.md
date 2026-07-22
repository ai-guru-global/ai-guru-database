---
title: "External Secrets Operator"
category: -concepts
tags: ["kubernetes", "k8s", "security", "secrets-management", "vault", "cloud-native", "alibaba-cloud"]
summary: "External Secrets Operator（ESO）将 Vault、云 KMS、参数仓库等外部 Secrets 自动同步到 Kubernetes Secret，避免在 Git 中泄露敏感数据。"
created: 2026-06-26
updated: 2026-07-21
tier: archived
lifecycle: reviewed
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
- [[概念/gitops|GitOps]] — GitOps 实践

---

## 2026 ESO 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **CNCF 孵化** | 社区活跃 | GA |
| **多 Provider** | Vault/AWS/GCP/阿里云 | GA |
| **Push Secrets** | 反向同步 | Beta |
| **Webhook 验证** | 安全增强 | GA |

## 支持的 Provider

| Provider | 场景 | 认证方式 |
|----------|------|----------|
| **HashiCorp Vault** | 自建密钥管理 | K8s Auth/AppRole/Token |
| **AWS Secrets Manager** | AWS 云 | IRSA/AccessKey |
| **Azure Key Vault** | Azure 云 | Managed Identity |
| **GCP Secret Manager** | GCP 云 | Workload Identity |
| **阿里云 KMS** | 阿里云 | RRSA/AccessKey |
| **GitLab** | CI/CD 变量 | Token |
| **Kubernetes** | 跨集群同步 | ServiceAccount |

## 核心 CRD

| CRD | 作用 | 范围 |
|-----|------|------|
| **SecretStore** | 定义外部密钥源连接 | Namespace 级 |
| **ClusterSecretStore** | 集群级密钥源 | 集群级 |
| **ExternalSecret** | 声明要同步的 Secret | Namespace 级 |
| **ClusterExternalSecret** | 集群级同步 | 集群级 |
| **PushSecret** | 反向推送 K8s Secret 到外部 | Beta |

## AI 场景应用

| 场景 | 说明 |
|------|------|
| **模型 API Key** | 从 Vault 同步 OpenAI/模型服务密钥 |
| **数据库凭证** | 动态轮换训练数据库密码 |
| **云存储访问** | 同步 S3/OSS 访问密钥 |
| **多租户隔离** | 每个团队独立 SecretStore |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Secret 未同步 | 认证失败 | 检查 SecretStore 配置和权限 |
| 同步延迟 | refreshInterval 过长 | 调整刷新间隔 |
| 权限不足 | Provider 端 RBAC | 检查外部系统权限配置 |
| Pod 未获取新值 | Secret 更新后未重启 | 配置 reloader 或滚动更新 |

## 生产最佳实践

1. **权限最小化**：SecretStore 使用最小权限的 ServiceAccount
2. **刷新间隔**：根据业务需求设置合理的 refreshInterval
3. **监控告警**：监控 ExternalSecret 同步状态
4. **与 Sealed Secrets 对比**：需要动态轮换用 ESO，简单场景用 Sealed Secrets
5. **审计日志**：启用 Provider 端审计，跟踪 Secret 访问记录

## 相关概念

- [[概念/vault|Vault]] — 密钥管理平台
- [[概念/secret|Secret]] — K8s Secret
- [[概念/sealed-secrets|Sealed Secrets]] — Git 加密 Secret

## 监控指标

| 指标 | 说明 | 告警阈值 |
|------|------|----------|
| `externalsecret_sync_calls_total` | 同步调用总数 | - |
| `externalsecret_sync_calls_errors_total` | 同步错误数 | > 0 |
| `externalsecret_status_condition` | Secret 状态 | Ready=False |

## 总结

ESO 是企业级 Secret 管理的标准方案，将密钥管理职责留给专业系统（Vault/KMS），K8s 只负责消费。支持自动同步、动态轮换和多租户隔离。

---

> 💡 ESO 是企业级 Secret 管理的标准方案，将密钥管理职责留给专业系统，K8s 只负责消费。

## 版本兼容性

| ESO 版本 | K8s 兼容 | 状态 |
|----------|---------|------|
| v0.11.x | 1.28+ | 稳定 |
| v0.10.x | 1.27+ | 维护 |
| v0.9.x | 1.25+ | EOL |

## 常用命令

| 命令 | 说明 |
|------|------|
| `kubectl get externalsecrets` | 查看 ExternalSecret 状态 |
| `kubectl get secretstores` | 查看 SecretStore |
| `kubectl get clustersecretstores` | 查看集群级 Store |
| `kubectl describe externalsecret <name>` | 查看同步详情 |

## 生产检查清单

1. **RBAC 最小权限**：ServiceAccount 只授予必要 Secret 读取权限
2. **同步间隔**：根据密钥轮换频率设置 `refreshInterval`
3. **删除策略**：设置 `deletionPolicy: Delete` 避免 Secret 残留
4. **监控告警**：对 `externalsecret_sync_calls_errors_total` 设置告警
5. **多租户隔离**：每个 Namespace 使用独立 SecretStore

## 相关概念

- [[概念/sealed-secrets|Sealed Secrets]] — Git 加密 Secret
- [[概念/vault|Vault]] — 密钥管理系统
- [[概念/kubernetes|Kubernetes]] — 容器编排平台
- [[概念/pod-security-standards|Pod Security Standards]] — Pod 安全标准
