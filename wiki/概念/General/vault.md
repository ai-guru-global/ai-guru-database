---
title: "Vault"
category: -concepts
tags: ["kubernetes", "k8s", "security", "secrets-management", "hashicorp", "cloud-native", "alibaba-cloud"]
summary: "Vault 是 HashiCorp 开源的 secrets 管理与数据保护平台，提供动态凭据、加密即服务、K8s 集成等能力。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "HashiCorp Vault"
  - "K8s 密钥管理"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/secret"
    type: related_to
  - target: "概念/cert-manager"
    type: related_to
sources: []
name_zh: "Vault 密钥管理"
---

# Vault

> 中文简称：Vault 密钥管理

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

- [[概念/secret|Secret]] — K8s 原生 Secret
- [[概念/cert-manager|cert-manager]] — 自动证书管理
- [[概念/external-secrets-operator|External Secrets Operator]] — 将外部 Secret 同步到 K8s
- [[概念/kubernetes|Kubernetes]] — 容器编排

---

## 2026 Vault 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **HashiCorp Vault** | 密钥管理系统 | GA |
| **动态 Secret** | 动态生成临时凭证 | GA |
| **加密即服务** | Encryption as a Service | GA |
| **K8s 集成** | K8s 原生集成 | GA |
| **自动轮换** | 凭证自动轮换 | GA |

## 生产最佳实践

1. **密钥管理**：敏感信息用 Vault 管理
2. **动态 Secret**：用动态 Secret 降低泄露风险
3. **自动轮换**：凭证自动轮换
4. **与 K8s 集成**：K8s 环境用 Vault 集成
5. **审计日志**：开启 Vault 审计日志

## 架构与组件

| 组件 | 职责 | 说明 |
|------|------|------|
| **Vault Server** | 核心服务 | 密钥存储和管理 |
| **Storage Backend** | 持久化 | Raft/Consul/MySQL |
| **Auth Methods** | 身份认证 | K8s/AppRole/LDAP |
| **Secret Engines** | 密钥引擎 | KV/Database/Transit |
| **Audit Devices** | 审计日志 | 操作记录 |
| **Agent** | 客户端代理 | Sidecar/CSI |

## 配置示例

```yaml
# K8s Auth 配置
apiVersion: v1
kind: Pod
metadata:
  name: app
  annotations:
    vault.hashicorp.com/agent-inject: "true"
    vault.hashicorp.com/role: "app-role"
    vault.hashicorp.com/agent-inject-secret-db: "database/creds/app"
spec:
  containers:
    - name: app
      image: myapp:latest
      # Secret 自动挂载到 /vault/secrets/db
---
# Vault 策略
path "database/creds/app" {
  capabilities = ["read"]
}
path "secret/data/app/*" {
  capabilities = ["read", "list"]
}
```

## Secret 引擎对比

| 引擎 | 用途 | 特点 |
|------|------|------|
| KV v2 | 静态密钥 | 版本控制 |
| Database | 数据库凭证 | 动态生成 |
| Transit | 加密即服务 | 应用层加密 |
| PKI | 证书管理 | 自动签发 |
| SSH | SSH 密钥 | 临时凭证 |
| Token | 访问令牌 | 细粒度控制 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Secret 注入失败 | Auth 配置错误 | 检查 K8s Auth 配置 |
| 凭证过期 | TTL 设置过短 | 调整 TTL + 自动续期 |
| 性能问题 | 请求量大 | 启用缓存 + 批量读取 |
| 高可用 | 单点故障 | Raft 集群部署 |

## 相关概念

- [[概念/secret|Secret]] — K8s 原生 Secret
- [[概念/cert-manager|cert-manager]] — 自动证书管理
- [[概念/external-secrets-operator|External Secrets Operator]] — 外部 Secret 同步
- [[概念/kubernetes|Kubernetes]] — 容器编排

## 总结

Vault 是企业级密钥管理平台，提供动态凭据、加密即服务和细粒度访问控制。在 K8s 环境中通过 Agent Sidecar 或 CSI Provider 集成。

---

> 💡 Vault 是企业级的「密钥保险箱」，帮 K8s 应用安全地管理密码、Token、证书。

## 部署架构

| 组件 | 部署方式 | 资源需求 |
|------|----------|----------|
| Vault Server | StatefulSet (3 副本) | 2C4G |
| Raft Storage | PVC | 10Gi SSD |
| Vault Agent | DaemonSet / Sidecar | 0.5C256M |
| CSI Provider | DaemonSet | 0.5C256M |

## 认证方式对比

| 方式 | 适用场景 | 特点 |
|------|----------|------|
| K8s Auth | K8s Pod | ServiceAccount 验证 |
| AppRole | 应用/CI | 角色 + Secret ID |
| LDAP | 企业用户 | 对接企业目录 |
| OIDC | SSO | 对接身份提供商 |
| Token | API 调用 | 直接令牌 |

## 常用命令

| 命令 | 说明 |
|------|------|
| `vault status` | 查看 Vault 状态 |
| `vault kv get secret/app` | 读取 Secret |
| `vault kv put secret/app key=val` | 写入 Secret |
| `vault policy write app policy.hcl` | 创建策略 |
| `vault token create -policy=app` | 创建令牌 |
| `vault audit enable file file_path=/var/log/audit.log` | 启用审计 |

## 安全加固清单

1. **高可用部署**：生产环境至少 3 节点 Raft 集群
2. **TLS 加密**：所有通信使用 TLS
3. **最小权限**：策略只授予必要权限
4. **审计日志**：开启所有操作的审计日志
5. **自动轮换**：凭证设置 TTL 自动轮换
6. **备份恢复**：定期备份 Raft 快照
7. **版本更新**：及时更新 Vault 版本

## 版本兼容性

| Vault 版本 | K8s 兼容 | 状态 |
|------------|---------|------|
| 1.18+ | 1.28+ | 稳定 |
| 1.17+ | 1.27+ | 维护 |
| 1.16+ | 1.26+ | EOL |

## 相关概念

- [[概念/external-secrets-operator|External Secrets Operator]] — K8s Secret 管理
- [[概念/Safety/zero-trust|Zero Trust]] — 零信任安全架构

> 💡 Vault 的核心价值是将 Secret 从代码和配置中解耦，实现动态生成、自动轮换、审计追踪。

