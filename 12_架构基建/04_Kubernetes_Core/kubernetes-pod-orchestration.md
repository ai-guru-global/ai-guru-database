---
title: "Kubernetes x Pod: 集群编排与工作负载生命周期的协同全景"
category: synthesis
tags: [kubernetes, pod, orchestration, scheduling, hpa, vpa, rollout, gpu, ai-inference, cloud-native]
sources: [概念/kubernetes.md, 概念/pod.md]
summary: "Kubernetes 从集群视角编排资源，Pod 从工作负载视角承载容器——两者构成云原生 AI 基础设施的上下层：调度、伸缩、发布策略和资源管理的完整闭环。"
created: 2026-07-02
updated: 2026-07-02
tier: core
lifecycle: draft
---

# Kubernetes x Pod: 集群编排与工作负载生命周期的协同全景

## The Connection

Kubernetes 和 Pod 之间的关系，本质上是**控制器与被控对象**的关系。Kubernetes 是集群层面的"大脑"，负责决策"哪个 Pod 应该跑在哪个节点上、跑几个、什么时候更新"；Pod 是工作负载层面的"执行体"，承载实际运行的容器进程。

很多使用者把 Kubernetes 等同于"容器运行平台"，但更准确的类比是：**Kubernetes 是操作系统内核，Pod 是进程**。内核不直接执行业务逻辑，但进程离不开内核的调度、内存管理和进程间通信。理解这层关系，才能从"会用 kubectl 部署一个 Pod"升级到"能设计一个高可用、弹性伸缩的 AI 推理集群"。

## Where They Co-occur

- 几乎所有 AI 推理服务（vLLM、TGI、Triton）都以 Pod 为单位运行在 Kubernetes 上
- 分布式训练（PyTorchJob、MPIJob）为每个 worker 创建独立 Pod，由 Kubernetes 协调通信
- KServe 的 `InferenceService` CRD 最终落地为一组 Pod（Predictor + Transformer + Explainer）
- GPU 共享方案（HAMi、NVIDIA Device Plugin）在 Pod 级别注入 GPU 资源，由 Kubernetes Scheduler 调度到对应节点
- K8s 的 HPA/VPA 以 Pod 的 CPU/GPU/内存指标为输入，驱动 Pod 副本数的自动伸缩

## Key Connections

### 1. 调度链路：从声明到运行

```
用户提交 Deployment YAML
    |
    v
API Server 写入 etcd
    |
    v
Deployment Controller 创建 ReplicaSet
    |
    v
ReplicaSet Controller 创建 Pod 对象（Pending 状态）
    |
    v
Scheduler 执行调度算法：
  ├── 过滤阶段（Filtering）：排除不满足约束的节点
  │   ├── 资源不足（CPU/内存/GPU requests > 节点可用）
  │   ├── 亲和性/反亲和性（nodeSelector, nodeAffinity）
  │   ├── 污点容忍（taints & tolerations）
  │   └── 拓扑约束（topologySpreadConstraints）
  └── 评分阶段（Scoring）：对候选节点打分
      ├── 负载均衡（LeastAllocated）
      ├── 数据局部性（有 PV 的节点优先）
      └── 自定义评分插件
    |
    v
kubelet 拉取镜像 → 启动容器 → Pod 进入 Running
    |
    v
探针就绪（readinessProbe 通过）→ Pod 加入 Service 端点
```

这条链路中，Kubernetes 的调度器和 Pod 的资源声明必须精确配合。`resources.requests` 决定调度准入，`resources.limits` 决定运行时约束。两者不匹配会导致 Pod 被 OOM Kill 或驱逐（Eviction）。

### 2. 伸缩体系：三层联动

Kubernetes 提供三层伸缩机制，每层作用在不同粒度：

| 层级 | 机制 | 作用对象 | 触发指标 | AI 场景示例 |
|------|------|---------|---------|------------|
| **集群级** | Cluster Autoscaler | 节点数量 | Pending Pod 数量 | GPU 节点池自动扩容 |
| **工作负载级** | HPA（水平） | Pod 副本数 | CPU/GPU/自定义指标 | 推理服务按 QPS 扩缩 |
| **容器级** | VPA（垂直） | Pod 资源请求 | 历史资源使用 | 自动调整单 Pod GPU 配额 |

在 AI 推理场景中，典型配置是：

```yaml
# HPA 基于 GPU 利用率伸缩 vLLM Pod
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: vllm-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vllm-inference
  minReplicas: 1
  maxReplicas: 8
  metrics:
    - type: Pods
      pods:
        metric:
          name: gpu_utilization
        target:
          type: AverageValue
          averageValue: "70"
```

**关键约束**：HPA 扩容速度受限于 GPU 节点可用性。如果节点池没有预热节点，新 Pod 需等待节点创建（云厂商通常 3-5 分钟），这构成了伸缩延迟的下限。

### 3. 发布策略：零停机更新

Kubernetes 通过 Deployment 的 `strategy` 字段控制 Pod 的更新方式：

| 策略 | 机制 | 风险 | AI 场景适用性 |
|------|------|------|-------------|
| **RollingUpdate** | 逐步替换旧 Pod | 新旧版本共存，需兼容 | 模型版本更新（推荐） |
| **Recreate** | 先删后建，短暂停机 | 服务中断 | 不兼容的 API 变更 |
| **蓝绿部署** | 新旧两套 Pod 并行，切换流量 | 资源翻倍 | 重大模型升级 |
| **金丝雀发布** | 少量流量导入新 Pod | 需要流量管理 | 新模型效果验证 |

KServe 在 Kubernetes 之上封装了蓝绿和金丝雀发布：通过 `InferenceService` 的 `canaryTrafficPercent` 字段，可以声明式地将 10% 流量导向新版本 Pod，观察指标后再全量切换。

### 4. 资源管理：GPU 的特殊性

Pod 对 GPU 资源的管理与普通 CPU/内存有本质差异：

| 维度 | CPU/内存 | GPU |
|------|---------|-----|
| **共享** | 天然支持（cgroups 隔离） | 需要专门方案（HAMi、MIG） |
| **调度** | 按 millicore 精度 | 按整卡或 vGPU 分配 |
| **超卖** | 可行（requests < limits） | 不可行（GPU 不可超卖） |
| **热迁移** | 可行（live migration） | 不可行（GPU 状态不可迁移） |
| **驱逐** | 可驱逐低优先级 Pod | GPU Pod 驱逐成本高（模型重加载） |

这意味着 Kubernetes 调度 AI Pod 时需要考虑额外的约束：

- **GPU 亲和性**：通过 `nodeSelector` 或 `nodeAffinity` 确保 Pod 调度到有 GPU 的节点
- **拓扑感知**：多 GPU 训练时，NVLink 连接的 GPU 应调度到同一节点（`topologySpreadConstraints`）
- **优先级与抢占**：训练任务（低优先级）可被推理任务（高优先级）抢占 GPU

## Decision Framework

### 何时需要关注 Kubernetes-Pod 协同设计？

```
决策树：
├── 单 Pod 部署（原型/开发）
│   └── 只需基本 YAML，不需要复杂调度
├── 多副本部署（生产推理）
│   ├── 需要 HPA → 配置自定义指标（GPU 利用率/QPS）
│   ├── 需要 PDB（PodDisruptionBudget） → 保护最小可用副本数
│   └── 需要反亲和性 → 避免所有 Pod 在同一节点
├── 多模型部署（模型市场）
│   ├── 需要命名空间隔离 → 每个模型一个 namespace
│   ├── 需要资源配额 → ResourceQuota 限制每 namespace GPU 数
│   └── 需要优先级 → PriorityClass 区分在线/离线任务
└── 分布式训练（大规模）
    ├── 需要 Operator（PyTorchJob/MPIJob） → 管理多 Pod 协同
    ├── 需要拓扑感知调度 → GPU 间通信优化
    └── 需要检查点 + 恢复 → PVC 挂载共享存储
```

### AI Pod 资源声明最佳实践

| 资源 | requests | limits | 说明 |
|------|----------|--------|------|
| CPU | 模型推理线程数 | requests x 2 | 避免 CPU 节流 |
| 内存 | 模型大小 + KV Cache | requests x 1.5 | 留出 GC 和 buffer 空间 |
| GPU | 所需 GPU 数 | = requests | GPU 不可超卖 |
| 临时存储 | 模型文件大小 | requests x 2 | 镜像层 + 模型缓存 |

## Practical Guide

### 生产环境 AI 推理 Pod 的典型配置

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-inference
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0  # 保证零停机
  template:
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
          image: vllm/vllm-openai:v0.5.0
          resources:
            requests:
              cpu: "4"
              memory: "32Gi"
              nvidia.com/gpu: "1"
            limits:
              cpu: "8"
              memory: "48Gi"
              nvidia.com/gpu: "1"
          readinessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 60  # 模型加载需要时间
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 120
            periodSeconds: 30
          startupProbe:
            httpGet:
              path: /health
              port: 8000
            failureThreshold: 30  # 最多等 5 分钟
            periodSeconds: 10
      priorityClassName: inference-high
      terminationGracePeriodSeconds: 120  # 等请求处理完再终止
```

### 常见故障排查

| 症状 | 可能原因 | 排查命令 |
|------|---------|---------|
| Pod 一直 Pending | GPU 资源不足 / 亲和性不满足 | `kubectl describe pod <name>` |
| Pod 频繁 OOMKilled | limits 设置过低 | `kubectl top pod <name>` |
| Pod 被驱逐（Evicted） | 节点磁盘/内存压力 | `kubectl get events --field-selector reason=Evicted` |
| Pod CrashLoopBackOff | 启动探针失败 / 镜像错误 | `kubectl logs <name> --previous` |
| Pod 调度到错误节点 | 缺少 GPU nodeSelector | `kubectl get nodes --show-labels` |

## Tensions and Trade-offs

- **调度精度 vs 调度速度**：复杂的亲和性和拓扑约束提高调度质量，但增加调度延迟（尤其在大规模集群中）
- **弹性伸缩 vs 成本可控**：HPA 自动扩容可能因突发流量创建大量 GPU Pod，需要 `maxReplicas` 和 ResourceQuota 兜底
- **零停机 vs 资源浪费**：`maxUnavailable: 0` 保证零停机但需要额外资源做 maxSurge，GPU 场景成本较高
- **GPU 独占 vs 共享**：独占 GPU 保证性能隔离，但小模型浪费算力；共享（HAMi/MIG）提高利用率但增加复杂度
- **快速伸缩 vs 模型加载延迟**：LLM 模型加载到 GPU 显存通常需要 30-120 秒，这意味着 Pod 的"就绪"延迟远高于普通 Web 服务

## Open Questions

- Kubernetes 的 GPU 调度器能否感知 GPU 拓扑（NVLink/NVSwitch 连接），实现自动最优调度？
- Pod 的 live migration 能否扩展到 GPU 工作负载，实现无感知的节点维护？
- KServe 的 scale-to-zero 在 LLM 场景是否实际可行？（冷启动 2+ 分钟的用户体验如何缓解）
- Kubernetes 原生的 AI 工作负载调度器（如 Volcano、Kueue）能否替代传统 Scheduler 的不足？

## Related

- [[概念/kubernetes]] -- Kubernetes 编排平台
- [[概念/pod]] -- Pod 工作负载单元
- [[概念/deployment]] -- Deployment 控制器
- [[概念/kserve]] -- KServe 模型服务平台
- [[概念/hami]] -- HAMi GPU 虚拟化
- [[概念/helm]] -- Helm 包管理器
- [[治理/serving-deployment]] -- 模型服务 x 模型部署
- [[架构基建/Kubernetes_Core_Components_Deep_Dive]] -- K8s 核心组件深度解析
- [[运维/Kubernetes_Troubleshooting_Playbook]] -- K8s 运维排障 Playbook
- [[概念/model-deployment]] -- 模型部署全景
