---
title: "Deployment"
category: -concepts
tags: ["kubernetes", "k8s", "deployment", "cloud-native", "alibaba-cloud"]
summary: "Kubernetes Deployment 是管理无状态应用负载的声明式控制器，负责 Pod 的创建、滚动更新、扩缩容和自愈，是 K8s 上部署 AI 推理与业务服务的最常用工作负载。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "Deployment"
  - "K8s Deployment"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/helm"
    type: related_to
  - target: "概念/kustomize"
    type: related_to
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# Deployment

> **一句话理解**: Deployment 是 K8s 上管理无状态应用的「自动运维器」——你声明要跑几个 Pod、用什么镜像，它负责创建、更新、扩缩和自动恢复。

## 核心要点

- **声明式控制器**：通过 YAML 描述期望状态（镜像版本、副本数、更新策略等），Deployment Controller 持续 reconcile 实际状态与期望状态。
- **管理 ReplicaSet**：Deployment 不直接管理 Pod，而是创建并滚动更新 ReplicaSet，由 ReplicaSet 保证指定数量的 Pod 副本运行。
- **滚动更新与回滚**：支持 `RollingUpdate`（零停机更新）和 `Recreate`（先删后建）；更新失败可随时 `kubectl rollout undo` 回滚到上一版本。
- **水平扩缩容**：可手动 `kubectl scale` 或通过 HPA 根据 CPU/内存/自定义指标自动扩缩副本数。
- **自愈能力**：节点故障或 Pod 被误删时，Deployment 会自动重新调度并补齐副本。
- **适用场景**：无状态服务（如 AI 推理 API、Web 服务、消息处理 worker），不适合需要稳定网络标识或持久存储的有状态应用。

## 典型 YAML / 命令示例

### 基础 Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-inference-svc
  namespace: default
  labels:
    app: llm-inference
spec:
  replicas: 3
  selector:
    matchLabels:
      app: llm-inference
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: llm-inference
    spec:
      containers:
        - name: vllm
          image: registry.example.com/llm/vllm:0.4.2
          ports:
            - containerPort: 8000
          resources:
            requests:
              cpu: "4"
              memory: "16Gi"
              nvidia.com/gpu: "1"
            limits:
              cpu: "8"
              memory: "32Gi"
              nvidia.com/gpu: "1"
          env:
            - name: MODEL_NAME
              value: "Qwen2-7B-Instruct"
```

### 常用运维命令

```bash
# 创建或更新 Deployment
kubectl apply -f deployment.yaml

# 查看 Deployment 状态
kubectl get deploy llm-inference-svc
kubectl describe deploy llm-inference-svc

# 手动扩容到 5 个副本
kubectl scale deploy llm-inference-svc --replicas=5

# 滚动更新镜像
kubectl set image deploy/llm-inference-svc vllm=registry.example.com/llm/vllm:0.5.0

# 查看滚动更新进度
kubectl rollout status deploy/llm-inference-svc

# 查看历史版本并回滚
kubectl rollout history deploy/llm-inference-svc
kubectl rollout undo deploy/llm-inference-svc
```

## 选型对比

| 工作负载 | 是否 Stateful | 是否适合 Deployment | 说明 |
|----------|--------------|---------------------|------|
| **Deployment** | 否 | ✅ 首选 | 无状态服务、Web API、推理服务 |
| **StatefulSet** | 是 | ❌ 不适用 | 需要固定网络标识、持久存储，如数据库 |
| **DaemonSet** | 否 | ❌ 不适用 | 每个节点跑一个 Pod，如日志/监控 Agent |
| **Job / CronJob** | 否 | ❌ 不适用 | 一次性或定时任务，如批量推理、训练任务 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 敏捷版或专有版中，Deployment 是工作负载控制台和工单系统最常操作的 K8s 原生资源之一。用户通过 ASCM 控制台或 Tianji 运维体系下发应用部署/变更/扩缩容工单时，底层通常转化为 Deployment（或 StatefulSet）的创建与更新；X-Dragon 服务器与 Luoshen 网络为 Pod 提供计算与网络能力，Nüwa 平台则负责镜像构建与分发。工单 Agent 处理「应用无法滚动更新」「Pod 调度失败」「副本数扩缩异常」等问题时，核心排查对象就是 Deployment 的 Events、ReplicaSet 和 Pod 状态。

## Related

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/helm|Helm]] — K8s 包管理与 Deployment 模板化
- [[概念/kustomize|Kustomize]] — K8s 配置管理与 Deployment 变体
- [[概念/containerd|containerd]] — K8s 容器运行时
- [[概念/cri|CRI]] — 容器运行时接口
- [[概念/etcd|etcd]] — K8s 配置与状态存储
- [[概念/apsara-stack|Apsara Stack]] — 阿里云专有云

---

## 2026 K8s Deployment 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **滚动更新策略** | maxSurge/maxUnavailable 精细控制发布节奏 | GA |
| **Server-Side Apply** | 服务端声明式应用，解决冲突更智能 | GA |
| **ProgressDeadline** | 部署超时自动回滚保护 | GA |
| **AI 推理 Deployment** | GPU 资源声明 + 模型就绪探针 | GA |
| **KEDA 扩缩** | 基于请求队列/自定义指标的事件驱动扩缩 | GA |

## 生产最佳实践

1. **就绪探针必配**：模型加载慢，readinessProbe 设置足够的 initialDelaySeconds
2. **滚动更新保守**：maxUnavailable: 0 保证零停机，maxSurge: 1 控制资源开销
3. **资源限制**：必须设置 resources.limits 防止 GPU 内存泄漏影响邻居 Pod
4. **回滚策略**：保留 revisionHistoryLimit: 5，确保可快速回滚
5. **Pod 反亲和**：多副本分散到不同节点，避免单点故障

## AI 推理 Deployment 配置示例

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-inference
  labels:
    app: llm-inference
spec:
  replicas: 3
  revisionHistoryLimit: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: llm-inference
  template:
    metadata:
      labels:
        app: llm-inference
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchLabels:
                    app: llm-inference
                topologyKey: kubernetes.io/hostname
      containers:
        - name: vllm
          image: vllm/vllm-openai:latest
          resources:
            limits:
              nvidia.com/gpu: "1"
              memory: 32Gi
            requests:
              nvidia.com/gpu: "1"
              memory: 24Gi
          readinessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 120
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 180
            periodSeconds: 30
```

## 部署策略对比

| 策略 | 停机时间 | 资源开销 | 回滚速度 | 适用场景 |
|------|----------|----------|----------|----------|
| RollingUpdate | 零 | 中 | 快 | 推理服务 |
| Recreate | 有 | 低 | 慢 | 开发环境 |
| Blue-Green | 零 | 高 | 极快 | 关键服务 |
| Canary | 零 | 中 | 快 | 大版本更新 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Pod 启动慢 | 模型加载耗时 | 增大 initialDelaySeconds + 预热 |
| 滚动更新失败 | 资源不足 | 检查 maxSurge 资源预留 |
| OOMKilled | 内存限制过低 | 调整 resources.limits.memory |
| 回滚失败 | 历史版本不足 | 设置 revisionHistoryLimit ≥ 5 |

## 生产检查清单

1. ✅ readinessProbe 配置充分 initialDelaySeconds
2. ✅ maxUnavailable: 0 保证零停机
3. ✅ resources.limits 防止资源泄漏
4. ✅ revisionHistoryLimit ≥ 5 支持回滚
5. ✅ podAntiAffinity 分散多副本
6. ✅ progressDeadlineSeconds 超时自动回滚

## 总结

Kubernetes Deployment 是 AI 推理服务部署的核心资源类型，2026 年的最佳实践是结合滚动更新、就绪探针、资源限制和反亲和性，实现 GPU 推理服务的零停机发布和高可用部署。

> 💡 AI 推理 Deployment 的核心挑战是“模型加载慢”——所有探针和更新策略都必须围绕这个特性设计。
