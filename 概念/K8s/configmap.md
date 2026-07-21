---
title: "ConfigMap"
category: -concepts
tags: ["kubernetes", "k8s", "configmap", "cloud-native", "alibaba-cloud"]
summary: "ConfigMap 是 Kubernetes 中用于存储非敏感配置数据的 API 对象，以键值对形式将配置与容器镜像解耦，支持以环境变量、命令行参数或挂载卷的方式注入 Pod。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "ConfigMap"
  - "configmap"
relationships:
  - target: "概念/kubernetes"
    type: part_of
  - target: "概念/kubectl"
    type: related_to
  - target: "概念/helm"
    type: related_to
  - target: "概念/apsara-stack"
    type: related_to
sources: []
---

# ConfigMap

> **一句话理解**: ConfigMap 是 Kubernetes 的「配置外挂」——把应用配置从容器镜像里抽出来，单独管理并注入到 Pod 中使用。

## 核心要点

- **配置解耦**：将应用配置（如数据库地址、日志级别、特性开关）与容器镜像分离，同一镜像可在开发、测试、生产环境复用。
- **键值对存储**：本质是一个键值对集合，支持普通字符串、多行文本或整个文件内容（如 JSON、properties、nginx.conf）。
- **三种消费方式**：可作为容器的环境变量、命令行参数，或以 Volume 形式挂载为文件/目录供应用读取。
- **非敏感数据专用**：不适合存放密码、Token、证书等敏感信息；敏感配置应使用 Secret 或外部密钥管理系统。
- **大小限制**：受 etcd 默认请求大小限制，单个 ConfigMap 建议不超过 1 MiB；大文件配置应考虑对象存储或配置中心。
- **不变性支持**：可设置 `immutable: true` 防止误改，提升读取性能并降低 apiserver 压力。
- **不会自动热加载**：挂载为 Volume 时文件会随 ConfigMap 更新而更新，但应用通常需要自行监听文件变化或配合 sidecar 重载。

## 典型 YAML / 命令示例

```yaml
# configmap-app.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: default
data:
  DATABASE_HOST: "mysql.default.svc.cluster.local"
  LOG_LEVEL: "info"
  app.properties: |
    server.port=8080
    feature.flag=true
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
        - name: web
          image: registry.example.com/web:v1
          envFrom:
            - configMapRef:
                name: app-config
          volumeMounts:
            - name: config-vol
              mountPath: /etc/app
      volumes:
        - name: config-vol
          configMap:
            name: app-config
```

常用 kubectl 命令：

```bash
# 从文件或字面量创建 ConfigMap
kubectl create configmap app-config \
  --from-literal=LOG_LEVEL=info \
  --from-file=app.properties

# 查看 ConfigMap 内容
kubectl get configmap app-config -o yaml

# 修改后让 Deployment 滚动更新以重新加载环境变量
kubectl rollout restart deployment/web-app
```

## 常见场景

| 场景 | 用法 | 注意事项 |
|------|------|----------|
| **环境差异化配置** | 不同命名空间或集群使用同名 ConfigMap，注入不同值 | 结合 Helm/Kustomize 管理多环境 |
| **配置文件挂载** | 将 nginx.conf、logback.xml 等作为文件挂载到指定路径 | 注意挂载路径会覆盖原目录，可单独挂载子路径 |
| **动态特性开关** | 通过 ConfigMap 键值控制功能开关 | 应用需监听文件变化或使用 sidecar 触发重载 |
| **启动参数传递** | 作为命令行参数 `$(KEY)` 注入 | 仅在容器启动时解析，更新后需重启 Pod |
| **共享静态数据** | 多个 Pod 共享同一套业务配置 | 避免存储敏感数据，控制单个对象大小 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 敏捷版 / 专有版中，ConfigMap 沿用原生 Kubernetes API，可通过 ASCM 控制台、OpenAPI 或 kubectl 进行管理。控制面基于 X-Dragon 服务器与自研网络/存储底座构建，配置数据由 etcd 统一持久化。实际运维工单中，ConfigMap 常见问题包括：键值更新后应用未生效（需确认注入方式是环境变量还是 Volume）、单 ConfigMap 过大导致同步失败，以及多租户场景下命名空间权限配置错误。建议敏感配置结合专有云密钥管理服务，普通配置则通过 GitOps 或 Helm 进行版本化交付。

## Related

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/kubectl|kubectl]] — K8s 命令行工具
- [[概念/helm|Helm]] — K8s 包管理与配置模板
- [[概念/secret|Secret]] — 敏感配置管理
- [[概念/pod|Pod]] — 配置消费方

---

## 2026 ConfigMap 最佳实践

| 场景 | 用法 | 说明 |
|------|------|------|
| 环境变量 | envFrom | 简单配置 |
| 配置文件 | Volume 挂载 | 复杂配置 |
| 动态开关 | Volume + 监听 | 需应用支持 |

## 生产最佳实践

1. **与 Secret 区分**：敏感数据用 Secret，非敏感用 ConfigMap
2. **大小限制**：单个 ConfigMap 不超过 1MiB
3. **不可变性**：生产环境设置 immutable: true
4. **版本管理**：配合 Helm/Kustomize 管理多环境配置
