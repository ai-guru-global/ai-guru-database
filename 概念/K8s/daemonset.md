---
title: "DaemonSet"
category: -concepts
tags: ["kubernetes", "k8s", "daemonset", "cloud-native", "alibaba-cloud"]
summary: "DaemonSet 确保每个（或指定）节点运行一份 Pod 副本，常用于日志采集、监控 Agent、网络/存储插件等节点级基础设施组件。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "DaemonSet"
  - "DS"
  - "守护进程集"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/containerd"
    type: related_to
  - target: "概念/apsara-stack"
    type: runs_on
sources: []
---

# DaemonSet

> **一句话理解**: DaemonSet 让指定 Pod 在集群每个节点上自动跑一份，专门负责日志、监控、网络/存储插件这类"每个节点都需要"的基础设施。

## 核心要点

- **节点级部署抽象**：与 Deployment 保证"副本数"不同，DaemonSet 保证"每个符合条件节点一份 Pod"，随节点增删自动扩缩。
- **典型用途**：日志采集（Fluent Bit/Logtail）、监控 Agent（node-exporter）、CNI/Terway 网络插件、CSI 存储插件、安全审计 Agent。
- **调度方式**：默认由 DaemonSet Controller 调度；K8s 1.12+ 支持 `ScheduleDaemonSetPods`，让默认 Scheduler 通过亲和性参与调度。
- **节点选择**：通过 `nodeSelector`、`nodeAffinity`、Toleration/Taint 控制运行节点，常用于 Master/GPU 节点差异化部署。
- **更新策略**：支持 `RollingUpdate`（默认，按节点滚动更新）和 `OnDelete`（手动删除 Pod 才重建），适合基础设施灰度发布。
- **资源与优先级**：DaemonSet Pod 常占用固定节点资源，建议设置较高 `priorityClassName`（如 system-node-critical），避免被业务 Pod 抢占。
- **排查入口**：`kubectl get/describe ds`、节点事件、DaemonSet Controller 日志是日常排障关键。

## 典型 YAML / 命令示例

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-log-agent
  namespace: kube-system
  labels:
    app: node-log-agent
spec:
  selector:
    matchLabels:
      app: node-log-agent
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 10%
  template:
    metadata:
      labels:
        app: node-log-agent
    spec:
      hostNetwork: true
      dnsPolicy: ClusterFirstWithHostNet
      tolerations:
        - operator: Exists
          effect: NoSchedule
      containers:
        - name: fluent-bit
          image: fluent/fluent-bit:3.0
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 256Mi
          volumeMounts:
            - name: varlog
              mountPath: /var/log
            - name: varlibdockercontainers
              mountPath: /var/lib/docker/containers
              readOnly: true
      volumes:
        - name: varlog
          hostPath:
            path: /var/log
        - name: varlibdockercontainers
          hostPath:
            path: /var/lib/docker/containers
```

```bash
# 查看所有 DaemonSet
kubectl get ds -A

# 查看指定 DaemonSet 详情及事件
kubectl describe ds node-log-agent -n kube-system

# 查看 DaemonSet 控制的 Pod 分布
kubectl get pods -n kube-system -l app=node-log-agent -o wide

# 滚动更新（修改镜像后自动触发）
kubectl set image ds/node-log-agent fluent-bit=fluent/fluent-bit:3.1 -n kube-system

# 临时驱逐某节点上的 DaemonSet Pod（调试时用）
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data
```

## 常见场景

| 场景 | 说明 | 示例组件 |
|------|------|----------|
| **日志采集** | 每个节点收集容器/系统日志 | Fluent Bit、Logtail、Filebeat |
| **监控探针** | 暴露节点级指标给监控系统 | node-exporter、ARMS Prometheus Agent |
| **网络插件** | 为每个节点配置容器网络 | Terway、Flannel、Calico Node |
| **存储插件** | 节点侧挂载/卸载云盘或 NAS | CSI-Plugin、FlexVolume |
| **安全审计** | 节点入侵检测、基线检查 | Falco、云安全中心 Agent |
| **GPU/NPU 设备插件** | 暴露异构算力资源给 Scheduler | NVIDIA Device Plugin、Ascend NPU Plugin |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的容器服务 ACK 专有版/敏捷版中，DaemonSet 是部署节点级组件的标准方式：Terway/Luoshen 网络插件、盘古 CSI-Plugin、Logtail、ARMS Prometheus node-exporter 以及 X-Dragon 硬件监控 Agent 通常都以 DaemonSet 运行，并通过 ASCM 统一管控。Tianji 运维体系会监控这些 DaemonSet 健康状态，确保节点加入/下线时 Pod 自动扩缩与驱逐，保障政企私有化环境中基础设施服务的节点级一致性。

## Related

- [[概念/kubernetes]] — Kubernetes 编排
- [[概念/containerd]] — containerd 容器运行时
- [[概念/cri]] — CRI 容器运行时接口
- [[概念/apsara-stack]] — 飞天企业版 Apsara Stack
- [[概念/kubectl]] — kubectl 命令行工具
- [[概念/cni]] — CNI 容器网络接口

---

## 2026 DaemonSet 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **MaxSurge for DaemonSet** | 滚动更新时允许先启新 Pod 再停旧 Pod，实现零中断更新 | GA |
| **DaemonSet 原生支持 TopologySpread** | 结合拓扑约束控制节点分布均匀性 | GA |
| **eBPF 节点 Agent** | 基于 eBPF 的新一代网络/安全/可观测 DaemonSet，替代 iptables | GA |
| **GPU Device Plugin DaemonSet** | NVIDIA/AMD/华为 NPU 设备插件以 DaemonSet 暴露异构算力 | GA |
| **system-node-critical PriorityClass** | 保证基础设施 DaemonSet 不被业务 Pod 抢占 | GA |

## 生产最佳实践

1. **设置资源限制**：为 DaemonSet Pod 配置 requests/limits，避免节点级组件耗尽节点资源
2. **高优先级保护**：使用 `priorityClassName: system-node-critical` 确保关键基础设施不被驱逐
3. **滚动更新策略**：生产环境使用 `maxUnavailable: 10%` 控制更新节奏，避免大规模同时重启
4. **Toleration 全覆盖**：为需要在 Master/特殊节点运行的 DaemonSet 添加对应 Toleration
5. **健康检查必配**：配置 liveness/readiness Probe，确保节点级服务异常时自动重启
