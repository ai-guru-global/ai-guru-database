---
title: "ServiceAccount"
category: -concepts
tags: ["kubernetes", "k8s", "serviceaccount", "cloud-native", "alibaba-cloud"]
summary: "ServiceAccount 为 Kubernetes Pod 提供身份标识，使其以受控权限访问 kube-apiserver 及其他服务，是 K8s RBAC 权限体系的核心载体。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "ServiceAccount"
  - "SA"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/rbac"
    type: related_to
  - target: "概念/pod"
    type: part_of
sources: []
name_zh: "K8s 服务账户"
---

# ServiceAccount

> 中文简称：K8s 服务账户

> **一句话理解**: ServiceAccount 是 Pod 在 Kubernetes 集群里的「工作证」——让应用以受控身份访问 API Server 或其他服务，而不是使用普通用户账号。

## 核心要点

- **Pod 的身份标识**：每个 Pod 都必须关联一个 ServiceAccount；不指定时，默认使用所在 namespace 的 `default` ServiceAccount。
- **API Server 鉴权入口**：ServiceAccount 是 K8s RBAC 的授权对象，通过 RoleBinding / ClusterRoleBinding 与 Role / ClusterRole 绑定，决定 Pod 能调用哪些 API。
- **Token 分发机制**：K8s 1.24 之前会自动创建包含长期 token 的 Secret；1.24+ 默认通过 `BoundServiceAccountTokenVolume` 注入短期、绑定 Pod 的投影 token，提升安全性。
- **最小权限原则**：应为不同工作负载创建独立 ServiceAccount，避免共享 `default` 账号导致权限扩散。
- **集群外同样可用**：ServiceAccount token 可被 CI/CD、外部控制器用于认证 K8s API，但需妥善保管并定期轮换。
- **与 IAM / RAM 解耦**：ServiceAccount 是 K8s 内部身份，访问云资源（OSS、SLB 等）通常还需通过云凭证或 OIDC 映射到云上身份。

## 典型 YAML / 命令示例

### 创建一个最小权限 ServiceAccount 并绑定 Role

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ai-inference-sa
  namespace: model-serving
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: config-reader
  namespace: model-serving
rules:
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: ai-inference-config-binding
  namespace: model-serving
subjects:
  - kind: ServiceAccount
    name: ai-inference-sa
    namespace: model-serving
roleRef:
  kind: Role
  name: config-reader
  apiGroup: rbac.authorization.k8s.io
```

### 在 Deployment 中显式指定 ServiceAccount

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-serving
  namespace: model-serving
spec:
  replicas: 2
  selector:
    matchLabels:
      app: llm-serving
  template:
    metadata:
      labels:
        app: llm-serving
    spec:
      serviceAccountName: ai-inference-sa   # 关键字段
      containers:
        - name: vllm
          image: registry.example.com/vllm:v0.5
```

### 常用命令

```bash
# 查看 namespace 下的 ServiceAccount
kubectl get serviceaccount -n model-serving

# 查看 Pod 使用的 ServiceAccount
kubectl get pod <pod-name> -n model-serving -o jsonpath='{.spec.serviceAccountName}'

# 查看 ServiceAccount 关联的 Secret / token
kubectl describe serviceaccount ai-inference-sa -n model-serving

# 临时生成 token（仅测试使用）
kubectl create token ai-inference-sa -n model-serving --duration=1h
```

## 常见场景

| 场景 | 做法 | 注意事项 |
|------|------|----------|
| **Pod 读取 ConfigMap / Secret** | 创建仅含 `get/list` 权限的 Role，绑定到 ServiceAccount | 避免直接挂载 `default` 账号 |
| **Operator / Controller 监听资源** | 使用 ClusterRoleBinding + ServiceAccount，授予跨 namespace 权限 | 使用 Lease 进行选主时还需 `coordination.k8s.io` 权限 |
| **CI/CD 部署到 K8s** | 创建专用 ServiceAccount，导出 kubeconfig 或 token 给流水线 | 优先使用短期 token，避免长期 Secret 泄漏 |
| **服务网格 Sidecar 注入** | ServiceAccount 同时作为工作负载身份，供 Istio / Envoy 生成 mTLS 证书 | 一个服务一个 ServiceAccount，便于细粒度策略 |
| **访问云上资源（OSS、日志）** | 结合云厂商凭证方案，将云上 IAM/RAM 权限映射到 Pod | ServiceAccount 本身不直接代表云账号 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 专有版 / 敏捷版中，ServiceAccount 是 namespace 级工作负载权限管理的基础单元。ASCM 负责上层账号与项目权限，集群内部仍通过 ServiceAccount + RBAC 完成 Pod 对 API Server 的细粒度授权。ACK 节点通过 RAM 角色访问底层 IaaS（X-Dragon、Luoshen、Pangu），这与 Pod 内部 ServiceAccount 彼此独立；业务 Pod 访问 OSS、SLS 等云服务时，建议通过阿里云组件完成云身份映射，避免节点级云凭证暴露给容器。

## Related

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/rbac|RBAC]] — 基于角色的访问控制
- [[概念/pod|Pod]] — K8s 最小调度单元
- [[概念/kubectl|kubectl]] — K8s 命令行工具

---

## 2026 ServiceAccount 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Projected Token (BoundSAToken)** | 短期、绑定 Pod 的投影 Token，默认 1h 自动轮换 | GA |
| **TokenRequest API** | 按需生成指定受众/时长的 Token，无需创建 Secret | GA |
| **Workload Identity (云厂商)** | 将 SA 映射到云上 IAM 角色，免节点凭证访问云资源 | GA |
| **automountServiceAccountToken: false** | 禁止自动挂载 Token，减少攻击面 | GA |
| **SPIFFE/SPIRE 集成** | 为 SA 颁发 SVID 证书，实现跨集群工作负载身份互信 | GA |

## 生产最佳实践

1. **一应用一 SA**：为每个工作负载创建独立 ServiceAccount，禁止使用 default SA
2. **关闭自动挂载**：不需要 API 访问的 Pod 设置 `automountServiceAccountToken: false`
3. **短期 Token 优先**：使用 TokenRequest API 生成临时 Token，避免创建长期 Secret
4. **云身份映射**：访问云资源时通过 Workload Identity / RRSA 映射，不在 Pod 内存储云 AK/SK
5. **定期审计 SA 权限**：扫描集群中所有 SA 的 RoleBinding，清理不再使用的账号和 过度授权

## ServiceAccount 核心概念

| 概念 | 说明 |
|------|------|
| ServiceAccount | Pod 的身份标识 |
| Token | API 访问凭证 |
| RoleBinding | 权限绑定 |
| ImagePullSecret | 镜像拉取凭证 |
| automountToken | 自动挂载控制 |

## SA Token 类型对比

| 类型 | 有效期 | 用途 | 安全性 |
|------|------|------|------|
| Secret Token | 永久 | 传统方式 | 低 |
| TokenRequest | 可配置 | 推荐方式 | 高 |
| Projected Token | 可配置 | 多受众 | 高 |
| OIDC Token | 短期 | 云身份映射 | 最高 |

## 配置示例

```yaml
# 创建 ServiceAccount
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-sa
  namespace: default
automountServiceAccountToken: false
---
# Pod 中使用
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: app-sa
  automountServiceAccountToken: true
  containers:
  - name: app
    image: my-app:latest
```

## 云身份映射方案

| 云商 | 方案 | 说明 |
|------|------|------|
| AWS | IRSA/RRSA | IAM Role for SA |
| GCP | Workload Identity | GCP SA 映射 |
| Azure | Workload Identity | Azure AD 映射 |
| 阿里云 | RRSA | RAM Role for SA |

> 💡 ServiceAccount 是 K8s Pod 身份的核心，2026 年生产环境必须禁用 default SA + 使用短期 Token + 云身份映射。
