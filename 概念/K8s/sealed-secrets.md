---
title: "Sealed Secrets"
category: -concepts
tags: ["kubernetes", "k8s", "security", "secrets-management", "gitops", "cloud-native", "alibaba-cloud"]
summary: "Sealed Secrets 允许将 Kubernetes Secret 加密后安全地存储在 Git 中，由集群内的 Sealed Secrets Controller 解密为原生 Secret。"
created: 2026-06-26
updated: 2026-07-21
tier: archived
lifecycle: reviewed
aliases:
  - "Bitnami Sealed Secrets"
  - "Git 加密 Secret"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/secret"
    type: related_to
  - target: "概念/gitops"
    type: related_to
sources: []
---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

# Sealed Secrets

> **一句话理解**: Sealed Secrets 让 Secret 能「加密地躺在 Git 里」，只有目标 K8s 集群能解密，解决 GitOps 中敏感数据版本化的问题。

## 核心要点

- **非对称加密**: 用集群公钥加密（`kubeseal`），集群私钥解密（Controller）。
- **不可反解**: 加密后的 SealedSecret 资源离开集群后无法被第三方解密。
- **与原生 Secret 对应**: Controller 把 SealedSecret 解密为普通的 K8s Secret。
- **GitOps 友好**: 适合 ArgoCD、Flux 等基于 Git 的交付流程。
- **Namespace 绑定**: 默认 SealedSecret 只能解密到创建时指定的 Namespace。

## 常用命令

```bash
# 1. 安装 controller
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# 2. 将普通 Secret 加密为 SealedSecret
kubeseal --format=yaml < mysecret.yaml > mysealedsecret.yaml

# 3. 应用加密后的资源
kubectl apply -f mysealedsecret.yaml

# 4. 查看生成的原生 Secret
kubectl get secret my-secret -n default
```

## 选型对比

| 方案 | 加密位置 | Git 友好 | 动态轮换 | 适用场景 |
|------|---------|---------|---------|---------|
| **Sealed Secrets** | 客户端 | 是 | 需重新加密 | 中小规模 GitOps |
| **External Secrets** | 外部密钥库 | 是 | 自动 | 企业级、需动态轮换 |
| **SOPS** | 客户端 | 是 | 手动 | 多文件加密 |

## 阿里云专有云关联

在阿里云专有云 GitOps 场景中，Sealed Secrets 是轻量方案，适合不想引入 Vault 的中小团队。工单中「SealedSecret 解密失败」通常是因为用了错误集群的公钥加密，或 Namespace 不匹配。

## Related

- [[概念/external-secrets-operator|External Secrets Operator]]
- [[概念/secret|Secret]]
- [[概念/argocd|ArgoCD]]
- [[概念/kubernetes|Kubernetes]]
- [[概念/gitops|GitOps]]

---

## 2026 Sealed Secrets 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **Bitnami 维护** | 社区活跃 | GA |
| **kubeseal CLI** | 客户端加密 | GA |
| **多集群支持** | 每集群独立密钥 | GA |

## 工作原理

```
加密流程:
1. 用户创建普通 Secret YAML
2. kubeseal 用集群公钥加密 → SealedSecret
3. SealedSecret 提交到 Git
4. Controller 监听到 SealedSecret
5. Controller 用私钥解密 → 创建原生 Secret
6. Pod 挂载原生 Secret
```

## 加密范围选项

| 范围 | 说明 | 适用场景 |
|------|------|----------|
| **Strict** | 绑定 Namespace + Name | 默认，最安全 |
| **Namespace-wide** | 仅绑定 Namespace | 同 NS 内可重命名 |
| **Cluster-wide** | 不绑定 | 跨 NS 复用（谨慎） |

## 配置示例

```yaml
# SealedSecret 示例
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: model-api-key
  namespace: ai-inference
spec:
  encryptedData:
    api-key: AgBy3i4OJkK4V2b+Mz8x...加密数据...
  template:
    metadata:
      name: model-api-key
      namespace: ai-inference
    type: Opaque
```

```bash
# 加密命令示例
# Strict 模式（默认）
kubeseal --format=yaml < secret.yaml > sealed.yaml

# Namespace-wide 模式
kubeseal --scope namespace-wide --format=yaml < secret.yaml > sealed.yaml

# 指定控制器命名空间
kubeseal --controller-namespace kube-system --format=yaml < secret.yaml > sealed.yaml
```

## 密钥管理

| 操作 | 命令 |
|------|------|
| 查看当前密钥 | `kubectl get secret -n kube-system -l sealedsecrets.bitnami.com/sealed-secrets-key` |
| 备份私钥 | `kubectl get secret -n kube-system <key-name> -o yaml > backup.yaml` |
| 强制轮换 | 删除旧密钥，Controller 自动生成新密钥 |
| 重新加密 | 轮换后需重新 `kubeseal` 所有 SealedSecret |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 解密失败 | 公钥不匹配 | 确认使用正确集群的公钥 |
| Namespace 错误 | Strict 模式绑定 | 加密时指定正确 NS |
| Controller 未运行 | Pod 异常 | 检查 Controller 状态 |
| 密钥丢失 | 未备份 | 从备份恢复或重新加密 |

## 生产最佳实践

1. **密钥备份**：定期备份集群私钥，防止数据丢失
2. **Namespace 匹配**：确保加密时指定正确的 Namespace
3. **与 ESO 对比**：需要动态轮换用 External Secrets Operator
4. **密钥轮换**：定期轮换加密密钥，重新加密 Secret
5. **审计跟踪**：SealedSecret 变更通过 Git 历史可追溯

## 与 GitOps 集成

```yaml
# ArgoCD Application 中使用 SealedSecret
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: ai-secrets
spec:
  source:
    repoURL: https://gitlab.example.com/ai/secrets.git
    path: sealed-secrets/
  destination:
    server: https://kubernetes.default.svc
    namespace: ai-inference
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## 多集群管理

| 场景 | 方案 | 说明 |
|------|------|------|
| 每集群独立密钥 | 默认行为 | 最安全，需每集群加密 |
| 共享密钥 | 导出/导入密钥 | 简化管理，降低安全性 |
| 分环境密钥 | dev/staging/prod 分离 | 推荐做法 |

## 相关概念

- [[概念/external-secrets-operator|External Secrets Operator]] — 外部 Secret 同步
- [[概念/secret|Secret]] — K8s Secret
- [[概念/gitops|GitOps]] — GitOps 实践

## 总结

Sealed Secrets 是 GitOps 场景下最轻量的 Secret 管理方案，通过非对称加密确保 Secret 安全存储在 Git 中。适合不想引入 Vault 的中小团队。

---

> 💡 Sealed Secrets 是 GitOps 场景下最轻量的 Secret 管理方案，适合不想引入 Vault 的中小团队。
