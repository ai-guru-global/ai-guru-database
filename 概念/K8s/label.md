---
title: "Label"
category: -concepts
tags: ["kubernetes", "k8s", "label", "metadata", "cloud-native", "alibaba-cloud"]
summary: "Label 是 Kubernetes 中附加在资源上的键值对元数据，通过 Label Selector 实现 Pod、Service、Deployment 等对象的关联、筛选与调度，是 K8s 资源管理的核心机制。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "Label"
  - "Kubernetes Label"
  - "K8s Label"
  - "标签"
relationships:
  - target: "概念/kubernetes"
    type: part_of
  - target: "概念/pod"
    type: related_to
  - target: "概念/deployment"
    type: related_to
  - target: "概念/service"
    type: related_to
sources: []
---

# Label

> **一句话理解**: Label 是 Kubernetes 里贴在资源上的「键值对标签」——让 Service、Deployment、调度器和运维工具能够快速找到并管理一群资源。

## 核心要点

- **键值对元数据**：Label 是附加在 K8s 对象（Pod、Node、Deployment、Service 等）上的 `key=value` 元数据，key 和 value 都是用户自定义字符串。
- **资源分组与选择的核心机制**：通过 Label Selector（`=`、`!=`、`in`、`notin`、exists）把零散资源聚合成逻辑集合，是 K8s 实现服务发现、调度、滚动更新的基础。
- **与 Annotation 区分**：Label 用于标识和选择资源，参与 K8s 核心逻辑；Annotation 用于记录描述性信息（如版本、负责人、构建号），不用于选择。
- **常见使用方**：Service 通过 `selector` 关联 Pod；Deployment 通过 `matchLabels` 管理 ReplicaSet；调度器通过 `nodeSelector` / `affinity` 选择节点；kubectl 通过 `-l` 过滤资源。
- **命名规范**：key 可选由前缀（DNS 子域名 + `/`）和名称组成，名称不超过 63 字符；value 不超过 63 字符，允许字母、数字、`-`、`_`、`.`。
- **动态可改**：可通过 YAML 声明或 `kubectl label` 命令增删改，变更会实时影响被 Selector 关联的控制器行为。

## 典型 YAML / 命令示例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ai-inference-pod
  labels:
    app: model-serving
    tier: inference
    env: prod
    team: nlp
spec:
  containers:
    - name: vllm
      image: registry.local/vllm/vllm-openai:v0.5.0
      ports:
        - containerPort: 8000
---
apiVersion: v1
kind: Service
metadata:
  name: model-svc
spec:
  selector:
    app: model-serving
    tier: inference
  ports:
    - port: 80
      targetPort: 8000
```

```bash
# 为 Pod 添加/修改 Label
kubectl label pod ai-inference-pod version=v2

# 删除 Label
kubectl label pod ai-inference-pod version-

# 按 Label 查询 Pod
kubectl get pods -l app=model-serving

# 按多条件过滤
kubectl get pods -l 'app in (model-serving, data-pipeline), env=prod'

# 查看节点 Label
kubectl get nodes --show-labels

# 为节点打 Label（供 nodeSelector 使用）
kubectl label node node-01 accelerator=nvidia-a100
```

## 常见场景

| 场景 | 典型 Label | 说明 |
|------|------------|------|
| **Service 关联 Pod** | `app=web`, `tier=frontend` | Service 通过 selector 把流量转发到匹配 Label 的 Pod。 |
| **Deployment 管理副本** | `app=llm-inference` | Deployment 的 `matchLabels` 决定哪些 Pod 属于该工作负载。 |
| **节点定向调度** | `accelerator=nvidia-a100`, `zone=cn-hangzhou-g` | 通过 `nodeSelector` 或 `affinity` 让 GPU Pod 跑在指定节点。 |
| **环境/租户隔离** | `env=prod`, `team=nlp`, `project=aigc` | 配合 RBAC 与 NetworkPolicy 实现逻辑隔离与成本分摊。 |
| **批量运维过滤** | `canary=true`, `debug=yes` | 用 `-l` 快速选中目标资源进行日志、删除、扩缩容。 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 敏捷版 / 专有版中，Label 同样是多租户资源管理、调度与运维排障的基础元数据。平台通常要求租户在创建 Deployment、Service 时填写业务标签（如 `project`、`department`、`cost-center`），并通过 ASCM 控制台或 Tianji 运维体系按 Label 聚合资源用量、告警与工单。专有云中常见的 Label 相关工单包括：Service selector 与 Pod Label 不匹配导致 Endpoint 为空、nodeSelector 选不到满足条件的 X-Dragon 节点、以及误改 Label 后 Deployment 新建 ReplicaSet 引发服务漂移等。

## Related

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/pod|Pod]] — K8s 最小调度单元
- [[概念/deployment|Deployment]] — 通过 Label 管理 Pod 副本
- [[概念/service|Service]] — 通过 Label Selector 暴露 Pod
- [[概念/selector|Selector]] — 标签选择器
- [[概念/kubectl|kubectl]] — 操作 Label 的命令行工具

---

## 2026 Label 最佳实践

| 场景 | 典型 Label | 说明 |
|------|------------|------|
| Service 关联 | app, tier | 服务发现 |
| 节点调度 | accelerator, zone | GPU 节点选择 |
| 环境隔离 | env, team | 多租户管理 |

## 生产最佳实践

1. **命名规范**：使用有意义的 key，如 app.kubernetes.io/name
2. **一致性**：相同含义的 Label 在整个集群保持一致
3. **与 Annotation 区分**：Label 用于选择，Annotation 用于描述
4. **节点 Label**：GPU 节点打上 accelerator 标签便于调度
