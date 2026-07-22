---
title: "LimitRange"
category: -concepts
tags: ["kubernetes", "k8s", "limit-range", "cloud-native", "alibaba-cloud", "resource-management"]
summary: "LimitRange 是 Kubernetes 命名空间级策略，用于为 Pod、容器或 PVC 设置默认资源请求/限制及最小/最大值，防止资源滥用并简化 YAML 配置。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "LimitRange"
  - "Limit Range"
  - "资源限制范围"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/resource-quota"
    type: related_to
  - target: "概念/pod"
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

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/resource-quota|ResourceQuota]] — 命名空间级资源配额
- [[概念/pod|Pod]] — LimitRange 的主要作用对象
- [[概念/namespace|Namespace]] — 作用范围
- [[概念/kubectl|kubectl]] — 管理 LimitRange 的 CLI 工具

---

## 2026 LimitRange 最佳实践

| 场景 | 配置 | 说明 |
|------|------|------|
| 默认资源 | default/defaultRequest | 简化 YAML |
| 防止滥用 | min/max | 限制资源边界 |
| 控制超售 | maxLimitRequestRatio | 限制超售比例 |

## 生产最佳实践

1. **与 ResourceQuota 配合**：LimitRange 管单对象，Quota 管总量
2. **设置默认值**：为未声明资源的 Pod 提供默认值
3. **限制最大值**：防止单个容器占用过多资源
4. **多租户模板**：按 Namespace 模板化下发 LimitRange

## LimitRange vs ResourceQuota

| 特性 | LimitRange | ResourceQuota |
|------|------|------|
| 作用对象 | 单个容器/Pod | Namespace 总量 |
| 功能 | 默认值/最大最小值 | 总配额限制 |
| 粒度 | 细粒度 | 粗粒度 |
| 配合使用 | ✅ 推荐 | ✅ 推荐 |

## LimitRange 配置示例

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: ml-limits
  namespace: ml-team
spec:
  limits:
  # 容器级限制
  - type: Container
    default:           # 默认 limits
      cpu: "2"
      memory: 4Gi
    defaultRequest:    # 默认 requests
      cpu: 500m
      memory: 1Gi
    max:               # 最大值
      cpu: "16"
      memory: 64Gi
      nvidia.com/gpu: "8"
    min:               # 最小值
      cpu: 100m
      memory: 128Mi
  # Pod 级限制
  - type: Pod
    max:
      cpu: "32"
      memory: 128Gi
      nvidia.com/gpu: "8"
```

## AI 场景 LimitRange 模板

| 场景 | CPU | 内存 | GPU |
|------|------|------|------|
| 开发测试 | 100m-4 | 256Mi-8Gi | 0-1 |
| 训练任务 | 1-16 | 4Gi-64Gi | 1-8 |
| 推理服务 | 500m-8 | 1Gi-32Gi | 1-4 |
| 数据处理 | 100m-8 | 256Mi-16Gi | 0 |

## 默认值注入流程

| 步骤 | 说明 |
|------|------|
| 1 | 用户创建 Pod (未声明资源) |
| 2 | LimitRange 注入默认 requests |
| 3 | LimitRange 注入默认 limits |
| 4 | 验证是否在 max/min 范围内 |
| 5 | Pod 创建成功 |

> 💡 LimitRange 是 K8s 资源默认值管理工具，2026 年 AI 平台推荐 LimitRange + ResourceQuota 组合实现精细化资源管理。

## 常用命令

| 命令 | 用途 |
|------|------|
| `kubectl get limitrange -n <ns>` | 查看 LimitRange |
| `kubectl describe limitrange <name> -n <ns>` | 详情 |
| `kubectl delete limitrange <name> -n <ns>` | 删除 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| Pod 创建失败 | 超出 max 限制 | 调整资源请求 |
| 默认值不生效 | LimitRange 未创建 | 检查 Namespace |
| GPU 限制无效 | 未配置 GPU 限制 | 添加 nvidia.com/gpu |
