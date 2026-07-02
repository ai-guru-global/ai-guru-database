---
title: "LimitRange"
category: -concepts
tags: ["kubernetes", "k8s", "limit-range", "cloud-native", "alibaba-cloud", "resource-management"]
summary: "LimitRange 是 Kubernetes 命名空间级策略，用于为 Pod、容器或 PVC 设置默认资源请求/限制及最小/最大值，防止资源滥用并简化 YAML 配置。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "LimitRange"
  - "Limit Range"
  - "资源限制范围"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/resource-quota"
    type: related_to
  - target: "_concepts/pod"
    type: related_to
sources: []
---

# LimitRange

> **一句话理解**: LimitRange 是命名空间内的「资源护栏」，为 Pod/容器/PVC 自动设置或强制限制 CPU、内存、存储的上下界。

## 核心要点

- **命名空间级策略**：LimitRange 只对所在 Namespace 生效，是集群多租户治理的基础手段之一。
- **作用对象**：可约束 Container、Pod、PersistentVolumeClaim（PVC）三类资源。
- **三种控制维度**：
  - `default` / `defaultRequest`：未显式声明时自动填充 requests/limits；
  - `min` / `max`：拒绝低于最小值或超过最大值的资源声明；
  - `maxLimitRequestRatio`：限制 limit 与 request 的最大比例，防止过度超售。
- **准入控制生效**：由 kube-apiserver 的 `LimitRanger` admission plugin 在创建/更新资源时校验，违规请求会被直接拒绝。
- **与 ResourceQuota 互补**：LimitRange 控制单对象资源边界，ResourceQuota 控制整个 Namespace 的资源总量，两者通常配合使用。
- **QoS 影响**：合理设置 default requests/limits 可让 Pod 自动落入 Guaranteed 或 Burstable QoS 类，影响节点压力驱逐顺序。

## 典型 YAML / 命令示例

```yaml
# limit-range-example.yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: cpu-memory-defaults
  namespace: ai-workload
spec:
  limits:
    - type: Container
      default:
        cpu: "500m"
        memory: "512Mi"
      defaultRequest:
        cpu: "100m"
        memory: "128Mi"
      min:
        cpu: "50m"
        memory: "64Mi"
      max:
        cpu: "4"
        memory: "8Gi"
      maxLimitRequestRatio:
        cpu: "10"
        memory: "4"
    - type: PersistentVolumeClaim
      min:
        storage: "1Gi"
      max:
        storage: "100Gi"
```

```bash
# 创建 LimitRange
kubectl apply -f limit-range-example.yaml

# 查看当前命名空间下的 LimitRange
kubectl get limitrange -n ai-workload

# 查看详细约束规则
kubectl describe limitrange cpu-memory-defaults -n ai-workload

# 测试违反规则的 Pod 会被拒绝
kubectl run overload --image=nginx --requests='cpu=5' --limits='cpu=6' -n ai-workload
```

## 常见场景

| 场景 | 说明 | 推荐做法 |
|------|------|----------|
| **防止资源滥用** | 避免某个容器声明过高 CPU/内存，挤占节点资源 | 设置 `max` 上限 |
| **简化应用 YAML** | 业务 Pod 不填 requests/limits 也能有默认值 | 设置 `default` / `defaultRequest` |
| **控制超售比例** | 限制 limit/request 比例，降低节点过载风险 | 设置 `maxLimitRequestRatio` |
| **规范存储容量** | 防止 PVC 申请过大导致后端存储耗尽 | 对 PVC 设置 `min` / `max` storage |
| **多租户隔离** | 配合 ResourceQuota 为不同业务/团队划分资源基线 | 按 Namespace 模板化下发 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 敏捷版/专有版以及 ASCM 多租户管理体系中，LimitRange 通常作为「命名空间模板」的一部分下发：平台运营人员可在 ASCM 控制台或 Tianji 运维体系中为不同部门/项目预设 CPU、内存、存储的默认与上限规则，避免业务容器因未填写资源声明而在 X-Dragon/Luoshen 服务器节点上引发资源争抢。与 ResourceQuota 配合使用时，可在共享 K8s 集群上实现租户级资源基线治理，降低工单中因 OOMKilled、调度失败或存储超配导致的故障比例。

## Related

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[_concepts/resource-quota|ResourceQuota]] — 命名空间级资源配额
- [[_concepts/pod|Pod]] — LimitRange 的主要作用对象
- [[_concepts/kubectl|kubectl]] — 管理 LimitRange 的 CLI 工具
