---
title: "Pod"
category: -concepts
tags: ["kubernetes", "k8s", "pod", "workload", "container", "cloud-native", "alibaba-cloud"]
summary: "Pod 是 Kubernetes 的最小可部署单元，封装一个或多个紧密耦合的容器，共享网络、存储与生命周期，是 AI 推理与训练服务运行的基本载体。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "Pod"
  - "Kubernetes Pod"
  - "容器组"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/kubectl"
    type: related_to
  - target: "概念/cri"
    type: uses
  - target: "概念/containerd"
    type: runs_on
sources: []
---

# Pod

> **一句话理解**: Pod 是 Kubernetes 里「容器的最小组织单元」——一个 Pod 内的容器共享 IP、端口空间和存储卷，一起被调度、一起启停。

## 核心要点

- **最小调度单元**：Pod 是 K8s 创建、调度和管理的最小单位，而不是单个容器。
- **共享上下文**：同一 Pod 内的容器共享网络命名空间（IP 相同）、IPC、UTS，以及挂载的 Volume。
- **生命周期绑定**：Pod 内容器同生共死；只要还有一个容器运行，Pod 就是 Running，但不代表所有容器都健康。
- **Sidecar 模式**：常见用法是一个主容器 + 一个或多个辅助容器（日志采集、监控代理、配置重载、Istio proxy 等）。
- **重启策略**：`Always`（默认，适合长服务）、`OnFailure`（批处理）、`Never`（一次性任务）。
- **探针机制**：`livenessProbe` 决定容器是否重启，`readinessProbe` 决定 Pod 是否加入 Service 端点，`startupProbe` 保护启动缓慢的容器。

## 典型 YAML / 命令示例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ai-inference-pod
  labels:
    app: model-serving
    tier: inference
spec:
  containers:
    - name: vllm
      image: registry.local/vllm/vllm-openai:v0.5.0
      ports:
        - containerPort: 8000
      resources:
        limits:
          nvidia.com/gpu: "1"
          memory: "32Gi"
          cpu: "8"
        requests:
          memory: "16Gi"
          cpu: "4"
      env:
        - name: MODEL_NAME
          value: "Qwen2-7B-Instruct"
      volumeMounts:
        - name: model-cache
          mountPath: /models
    - name: log-agent
      image: registry.local/fluent-bit:latest
      volumeMounts:
        - name: model-cache
          mountPath: /models
          readOnly: true
  volumes:
    - name: model-cache
      persistentVolumeClaim:
        claimName: model-pvc
```

```bash
# 查看 Pod 状态
kubectl get pods -n default

# 查看 Pod 详情与事件
kubectl describe pod ai-inference-pod

# 查看主容器日志
kubectl logs ai-inference-pod -c vllm -f

# 进入容器调试
kubectl exec -it ai-inference-pod -c vllm -- /bin/bash
```

## 常见场景

| 场景 | 是否推荐单 Pod 多容器 | 说明 |
|------|----------------------|------|
| **AI 推理主服务 + 日志 Sidecar** | ✅ | 共享模型目录，日志采集与业务解耦。 |
| **模型服务 + 监控 Exporter** | ✅ | Prometheus 指标采集作为 Sidecar。 |
| **两个独立微服务** | ❌ | 应拆分为两个 Deployment，通过 Service 通信。 |
| **单 Pod 多 GPU 训练进程** | ⚠️ | 可用 initContainer 准备数据，主容器运行分布式训练。 |
| **一次性数据预处理任务** | ✅ | 使用 `restartPolicy: OnFailure` 或 `Never`。 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）ACK 敏捷版或专有云容器服务中，Pod 同样是工作负载的最小运行单元。专有云平台通常基于 X-Dragon 神龙架构与 Luoshen 网络实现 Pod 网络隔离和高性能转发，通过 ASCM（Apsara Stack Cloud Management）进行多租户权限与资源配额管理。专有云场景下，Pod 调度会结合 Tianji 运维体系的节点健康状态，并可能依赖 Pangu/Nüwa 提供后端分布式存储挂载。排查 Pod 问题时，运维人员通常先通过 kubectl 查看 Pod 事件与日志，再定位到 CRI 运行时（containerd）或节点网络/存储组件。

## Related

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/kubectl|kubectl]] — K8s 命令行工具
- [[概念/cri|CRI]] — 容器运行时接口
- [[概念/containerd|containerd]] — 主流 CRI 实现
- [[概念/deployment|Deployment]] — Pod 控制器
- [[概念/service|Service]] — Pod 服务发现与负载均衡
- [[概念/pod-security-standards|Pod Security Standards]] — Pod 安全标准

---

## 2026 Pod 最佳实践

| 场景 | 配置 | 说明 |
|------|------|------|
| AI 推理 | GPU + Sidecar | 主容器 + 日志/监控 |
| 批处理 | restartPolicy: OnFailure | 失败重试 |
| 长服务 | livenessProbe + readinessProbe | 健康检查 |

## 生产最佳实践

1. **资源限制**：设置合理的 requests/limits
2. **健康检查**：配置 liveness/readiness/startup 探针
3. **安全上下文**：设置 runAsNonRoot、readOnlyRootFilesystem
4. **日志采集**：使用 Sidecar 或 DaemonSet 采集日志

## Pod 生命周期状态

| 状态 | 说明 |
|------|------|
| Pending | 等待调度/拉取镜像 |
| Running | 至少一个容器运行 |
| Succeeded | 所有容器成功终止 |
| Failed | 至少一个容器失败 |
| Unknown | 状态无法获取 |

## Pod 重启策略

| 策略 | 说明 | 适用场景 |
|------|------|------|
| Always | 总是重启 | 长期服务 (默认) |
| OnFailure | 失败时重启 | Job/CronJob |
| Never | 从不重启 | 一次性任务 |

## Pod 探针类型

| 探针 | 作用 | 失败后果 |
|------|------|------|
| livenessProbe | 存活检查 | 重启容器 |
| readinessProbe | 就绪检查 | 从 Service 移除 |
| startupProbe | 启动检查 | 延迟其他探针 |

## Pod 配置示例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
  labels:
    app: my-app
spec:
  containers:
  - name: app
    image: my-app:latest
    resources:
      requests:
        cpu: 100m
        memory: 128Mi
      limits:
        cpu: 500m
        memory: 512Mi
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
```

## Pod 安全上下文

| 配置 | 说明 | 推荐值 |
|------|------|------|
| runAsNonRoot | 非 root 运行 | true |
| readOnlyRootFilesystem | 只读根文件 | true |
| allowPrivilegeEscalation | 禁止提权 | false |
| capabilities.drop | 移除权限 | ["ALL"] |

> 💡 Pod 是 K8s 最小调度单元，2026 年生产环境必须配置资源限制 + 健康检查 + 安全上下文。
