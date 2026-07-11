---
title: "Vertical Pod Autoscaler（VPA）"
category: -concepts
tags: ["kubernetes", "k8s", "autoscaling", "cloud-native", "alibaba-cloud"]
summary: "VPA 是 Kubernetes 生态中的 Pod 纵向自动扩缩容组件，依据历史与实时资源用量自动调整容器 CPU/内存 requests/limits，减少资源浪费并降低 OOM 风险。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "VPA"
  - "Vertical Pod Autoscaler"
  - "垂直 Pod 自动扩缩容"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/horizontal-pod-autoscaler"
    type: related_to
  - target: "概念/deployment"
    type: part_of
sources: []
---

# Vertical Pod Autoscaler（VPA）

> **一句话理解**: VPA 是 K8s 的「自动调规格」机制——根据 Pod 实际资源用量，动态建议或修改容器的 CPU/内存 requests 与 limits。

## 核心要点

- **作用对象**: VPA 作用于 **Deployment、StatefulSet、DaemonSet、ReplicaSet** 等控制器下的 Pod，通过调整其容器资源请求实现纵向扩缩。
- **核心组件**: VPA 由三个可选组件协作运行：
  - **Recommender**：读取 Metrics Server / Prometheus 数据，计算推荐值；
  - **Updater**：在 `updateMode: Auto` 或 `Recreate` 下驱逐旧 Pod，触发重建以应用新资源；
  - **Admission Controller**：在 Pod 创建时自动注入推荐资源，避免直接修改控制器模板。
- **运行模式**:
  - `Off`：仅计算并展示推荐值，不修改 Pod；
  - `Initial`：仅对新创建 Pod 注入推荐资源；
  - `Recreate`：主动驱逐旧 Pod 重建以应用推荐值（会造成短暂中断）；
  - `Auto`：等同于 `Recreate`（默认行为，视版本实现而定）。
- **关键依赖**: 需要集群已安装 **Metrics Server** 或接入 Prometheus 以获取资源用量；容器必须声明初始 `resources.requests`，否则 VPA 难以给出合理推荐。
- **与 HPA 的关系**: VPA 调单 Pod 资源规格，HPA 调 Pod 副本数。二者一般不建议同时对同一工作负载基于 CPU 进行自动扩缩，否则容易互相冲突。
- **注意事项**: VPA 推荐值基于历史统计，存在滞后性；`Recreate/Auto` 模式会重启 Pod，不适合对中断极度敏感的有状态服务；Job 类一次性任务通常也不适用。

## 典型 YAML / 命令示例

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: ai-inference-vpa
  namespace: default
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: llm-serving
  updatePolicy:
    updateMode: "Auto"          # Off / Initial / Recreate / Auto
  resourcePolicy:
    containerPolicies:
      - containerName: "*"
        minAllowed:
          cpu: "100m"
          memory: "256Mi"
        maxAllowed:
          cpu: "8"
          memory: "32Gi"
        controlledResources: ["cpu", "memory"]
        controlledValues: RequestsAndLimits
```

```bash
# 查看 VPA 推荐状态
kubectl get vpa ai-inference-vpa -o yaml

# 关注推荐值与当前值差异
kubectl describe vpa ai-inference-vpa

# 查看 VPA 各组件日志
kubectl logs -n kube-system -l app=vpa-recommender
kubectl logs -n kube-system -l app=vpa-updater
```

## 选型对比

| 维度 | VPA | HPA | 手动调整 requests |
|------|-----|-----|-------------------|
| **扩缩对象** | 单个 Pod 的 CPU/内存 requests/limits | Pod 副本数 | 控制器模板中的资源声明 |
| **触发依据** | 历史/实时资源用量 | CPU/内存/自定义指标 | 人工经验 |
| **生效方式** | 驱逐重建或仅对新 Pod 注入 | 修改 replicas | 滚动更新或重建 Pod |
| **适用场景** | 资源规格长期不合理、内存波动大、避免 OOM | 流量波动、Web/API/推理服务 | 一次性治理、已知基线 |
| **主要风险** | 重建导致中断、与 HPA 冲突 | 副本数抖动 | 配置固化、难以及时跟进 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）ACK 敏捷版 / 专用版中，VPA 通常以集群组件或市场插件形式提供，用户可通过企业版控制台（ASCM）查看推荐结果并选择是否自动生效。专有云环境强调稳定性与合规性，因此生产集群多采用 `Off` 或 `Initial` 模式先收集推荐，再由运维人员审核后调整工作负载模板；对延迟不敏感的批处理或开发测试负载，可考虑 `Auto` 模式。与 **天基（Tianji）运维体系** 联动后，可将 VPA 推荐值、OOM 事件与告警统一纳入运维视图；底层节点若基于 X-Dragon 服务器或弹性裸金属实例，纵向调整资源规格也有助于提升单机资源利用率。实际部署前需确认专有云中 Metrics Server / Prometheus 插件已就绪，并评估重建 Pod 对业务 SLA 的影响。

## Related

- [[概念/kubernetes]] — Kubernetes 编排
- [[概念/horizontal-pod-autoscaler]] — Horizontal Pod Autoscaler（HPA）
- [[概念/deployment]] — Deployment 工作负载
- [[概念/kubectl]] — kubectl 命令行工具
