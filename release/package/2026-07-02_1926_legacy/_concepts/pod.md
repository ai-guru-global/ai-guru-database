---
title: "Pod"
category: -concepts
tags: ["kubernetes", "k8s", "pod", "workload", "container", "cloud-native", "alibaba-cloud"]
summary: "Pod 是 Kubernetes 的最小可部署单元，封装一个或多个紧密耦合的容器，共享网络、存储与生命周期，是 AI 推理与训练服务运行的基本载体。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Pod"
  - "Kubernetes Pod"
  - "容器组"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/kubectl"
    type: related_to
  - target: "_concepts/cri"
    type: uses
  - target: "_concepts/containerd"
    type: runs_on
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

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[_concepts/kubectl|kubectl]] — K8s 命令行工具
- [[_concepts/cri|CRI]] — 容器运行时接口
- [[_concepts/containerd|containerd]] — 主流 CRI 实现
- [[_concepts/deployment|Deployment]] — Pod 控制器
- [[_concepts/service|Service]] — Pod 服务发现与负载均衡
