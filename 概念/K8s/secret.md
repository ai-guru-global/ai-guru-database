---
title: "Secret"
category: -concepts
tags: ["kubernetes", "k8s", "secret", "security", "cloud-native", "alibaba-cloud"]
summary: "Kubernetes Secret 用于安全地存储和管理敏感数据（如密码、Token、证书），避免直接写入镜像或 Pod 规格，并支持以卷或环境变量方式注入容器。"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/rbac"
    type: related_to
  - target: "概念/etcd"
    type: part_of
  - target: "概念/apsara-stack"
    type: related_to
lifecycle: reviewed
tier: supporting
created: 2026-06-26
updated: 2026-07-21
aliases:
  - "Secret"
  - "K8s Secret"
  - "Kubernetes Secret"
sources: []
---

# Secret

> **一句话理解**: Secret 是 Kubernetes 用来存放密码、Token、证书等敏感数据的「保密信封」，让 Pod 能安全使用这些信息而无需写进镜像或 YAML 明文。

## 核心要点

- **定义**: Secret 是 K8s 的一种原生资源对象，用于存储 Base64 编码的敏感小数据（默认上限 1 MiB），例如 TLS 证书、镜像拉取密钥、数据库密码、API Token 等。
- **为什么重要**: 将敏感数据与镜像、应用代码解耦，避免密钥泄露到镜像仓库或 Git 仓库；配合 RBAC 可实现「谁能看、谁能用」的细粒度控制。
- **默认并不加密**: Secret 数据以 Base64 编码存储在 etcd 中，**不是加密**；生产环境必须开启 etcd 加密（EncryptionConfiguration）或接入外部 KMS 才能满足合规要求。
- **两种主要用法**:
  - 以文件形式挂载到容器卷（`volumeMounts`），适合证书、配置文件；
  - 以环境变量注入容器（`env` / `envFrom`），适合简单键值如密码。
- **常见类型**: `Opaque`（通用）、`kubernetes.io/tls`（TLS 证书）、`kubernetes.io/dockerconfigjson`（镜像仓库认证）、`kubernetes.io/service-account-token`（ServiceAccount 自动挂载）。
- **安全最佳实践**: 最小权限 RBAC、关闭自动 ServiceAccount Token 挂载、启用 etcd 加密、优先使用外部 Secret 存储（如 Vault、阿里云 KMS），并定期轮换。

## 典型 YAML / 命令示例

### 创建通用 Secret

```bash
# 命令行创建（值自动 Base64）
kubectl create secret generic db-password \
  --from-literal=username=admin \
  --from-literal=password='S3cr3t!2026'
```

### YAML 声明 Secret 并挂载到 Pod

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-password
  namespace: default
type: Opaque
stringData:
  username: admin
  password: S3cr3t!2026
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: model-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: model-api
  template:
    metadata:
      labels:
        app: model-api
    spec:
      containers:
        - name: api
          image: registry.local/model-api:v1.2
          env:
            - name: DB_USERNAME
              valueFrom:
                secretKeyRef:
                  name: db-password
                  key: username
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db-password
                  key: password
          volumeMounts:
            - name: secret-vol
              mountPath: /etc/secrets
              readOnly: true
      volumes:
        - name: secret-vol
          secret:
            secretName: db-password
```

### 镜像拉取 Secret 示例

```bash
# 创建镜像仓库认证 Secret
kubectl create secret docker-registry regcred \
  --docker-server=registry.local \
  --docker-username=robot \
  --docker-password='p@ssw0rd'
```

## 常见场景

| 场景 | 推荐类型 | 说明 |
|------|----------|------|
| 数据库账号密码 | `Opaque` | 通过环境变量或挂载卷注入 |
| TLS 证书/私钥 | `kubernetes.io/tls` | 供 Ingress、Service Mesh 使用 |
| 私有镜像仓库认证 | `kubernetes.io/dockerconfigjson` | 解决镜像拉取权限问题 |
| ServiceAccount Token | `kubernetes.io/service-account-token` | 旧版默认挂载，建议关闭 |
| 大文件/超过 1 MiB | 不建议用 Secret | 改用 ConfigMap 或外部 Vault |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 专有云版中，Secret 同样是应用访问敏感凭据的核心机制。平台通常提供基于阿里云 KMS 的 Secret 管理能力，可将密钥明文托管在专有云的 KMS 服务中，K8s 中只保留加密引用；结合 ASCM 的账号与权限体系，能够实现租户级、命名空间级的 Secret 访问隔离。对于金融、政务类专有云场景，建议开启 etcd 数据加密，并与天基（Tianji）运维体系联动审计 Secret 的创建与使用事件。

## Related

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/rbac|RBAC]] — 基于角色的访问控制
- [[概念/etcd|etcd]] — K8s 配置与 Secret 持久化存储
- [[概念/apsara-stack|阿里云专有云 Apsara Stack]] — 专有云 K8s 环境

---

## 2026 Secret 管理生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **KMS v2 Provider** | etcd 加密集成外部 KMS，信封加密 + 自动轮换，性能优于 v1 | GA |
| **External Secrets Operator (ESO)** | 从 Vault/AWS SM/阿里云 KMS 同步 Secret，支持自动轮换 | GA |
| **Secrets Store CSI Driver** | 以 CSI 卷方式挂载外部 Secret，支持多 Provider 插件 | GA |
| **BoundServiceAccountTokenVolume** | 短期投影 Token 替代长期 Secret，降低泄露风险 | GA |
| **kubectl create secret --dry-run=client** | 生成 YAML 而不实际创建，配合 GitOps 安全审计 | GA |

## 生产最佳实践

1. **启用 etcd 加密**：配置 EncryptionConfiguration + KMS v2 Provider，确保静态数据加密而非仅 Base64
2. **优先外部 Secret 存储**：使用 ESO 或 Secrets Store CSI Driver 将密钥托管在 Vault/KMS，K8s 中仅保留引用
3. **最小权限 RBAC**：严格限制 Secret 的 get/list 权限，避免 default ServiceAccount 自动挂载
4. **自动轮换策略**：配合 cert-manager、ESO 的 rotationPolicy 实现证书/密码定期轮换
5. **审计与告警**：开启 API Server 审计日志，监控 Secret 的创建/读取/删除事件，异常访问实时告警
