---
title: "Annotation"
category: -concepts
tags: ["kubernetes", "k8s", "annotation", "cloud-native", "alibaba-cloud"]
summary: "Annotation 是 Kubernetes 对象 metadata 中的非标识性键值对，用于存储描述性、工具或控制器所需的元信息，不能用于选择器过滤。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "Annotation"
  - "K8s Annotation"
  - "注解"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/pod"
    type: related_to
  - target: "概念/deployment"
    type: related_to
  - target: "概念/service"
    type: related_to
  - target: "概念/ingress"
    type: related_to
sources: []
name_zh: "K8s 注解"
---

# Annotation

> 中文简称：K8s 注解

> **一句话理解**: Annotation 是 K8s 对象上的「便签纸」——可以写任意说明或给控制器看的配置提示，但不能像 Label 那样用来筛选对象。

## 核心要点

- **定义**: Annotation 是附加在 Kubernetes 对象 `metadata.annotations` 下的键值对，用于携带非标识性元信息。
- **与 Label 的区别**: Label 用于识别和选择对象（可被 `selector` 匹配），Annotation 只能存储描述、工具、控制器或审计信息。
- **典型用途**: 记录责任人、版本号、CI/CD 信息、配置提示、负载均衡/存储插件参数、kubelet/调度器扩展行为等。
- **容量与格式**: 单个 Annotation 键值总长度受 etcd 请求限制（整个对象通常不超过 1 MiB），值可以是任意 UTF-8 字符串，也常放 JSON 片段。
- **不可用于选择器**: `kubectl label` 与 `labelSelector` 对 Annotation 无效；筛选需用 `--field-selector` 或导出后用 `jq`/`grep` 处理。
- **控制器依赖**: 很多云厂商控制器（如负载均衡、存储 CSI、调度扩展）通过 Annotation 读取额外配置。

## 典型 YAML / 命令示例

```yaml
apiVersion: v1
kind: Service
metadata:
  name: model-serving-svc
  namespace: aio-system
  annotations:
    # 描述性信息
    app.aiguru/owner: "platform-team"
    app.aiguru/version: "v2.3.1"
    # 负载均衡控制器参数（仅示意，具体 key 依赖平台实现）
    service.beta.kubernetes.io/alibaba-cloud-load-balancer-spec: "slb.s1.small"
    # 审计/CICD 信息
    cicd.aiguru/last-deployed-by: "deploy-bot"
    cicd.aiguru/commit-sha: "abc1234"
spec:
  type: LoadBalancer
  selector:
    app: model-serving
  ports:
    - port: 80
      targetPort: 8080
```

```bash
# 查看对象的 annotations
kubectl get pod <pod-name> -n <namespace> -o jsonpath='{.metadata.annotations}'

# 添加/更新 annotation
kubectl annotate deployment model-serving app.aiguru/owner="sre-team" -n aio-system

# 覆盖已有 annotation
kubectl annotate deployment model-serving app.aiguru/owner="sre-team" --overwrite -n aio-system

# 删除 annotation
kubectl annotate deployment model-serving app.aiguru/owner- -n aio-system

# 批量查看含某 annotation 的对象（注意：不能用 label selector 过滤 annotation）
kubectl get pods -n aio-system -o json | \
  jq '.items[] | select(.metadata.annotations["app.aiguru/owner"]) | .metadata.name'
```

## 常见场景

| 场景 | 示例 Annotation 作用 | 备注 |
|------|---------------------|------|
| **负载均衡配置** | 指定 SLB 规格、监听端口、带宽包等 | 由云厂商控制器读取 |
| **存储挂载参数** | 传递 PVC/StorageClass 的额外快照、加密、QoS 参数 | CSI 驱动常见用法 |
| **CI/CD 元信息** | 记录构建版本、提交 SHA、部署人 | 便于审计与回滚 |
| **调度提示** | kube-scheduler 扩展或 Descheduler 策略参数 | 不替代 spec 字段 |
| **成本/归属标记** | 记录部门、项目、成本中心 | 仅信息性，不参与配额 |
| **网关/入口配置** | Ingress 控制器读取重写、TLS、限速规则 | 不同控制器 key 不同 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 专有版 / 敏捷版环境中，Annotation 同样被平台控制器用来传递集群外部资源参数，例如负载均衡（SLB/LVS）规格、存储后端类型或节点扩展策略。运维工单中常见场景包括：用户误把应写在 Annotation 里的配置写成 Label 导致控制器无法识别，或 Annotation 内容过长触发 etcd 写入限制。处理此类工单时，可通过 `kubectl describe` 与 `kubectl get -o yaml` 比对 `metadata.annotations` 与控制器文档要求的 key，确认是否符合平台控制器预期。

## Related

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/pod|Pod]] — K8s 最小调度单元
- [[概念/deployment|Deployment]] — 无状态工作负载
- [[概念/service|Service]] — 服务发现与负载均衡
- [[概念/ingress|Ingress]] — 七层入口路由
- [[概念/kubectl|kubectl]] — K8s 命令行工具

---

## 2026 Annotation 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **K8s Annotation** | K8s 资源注解 | GA |
| **元数据** | 资源元数据 | GA |
| **工具集成** | 工具集成注解 | GA |
| **与 Label 对比** | Annotation vs Label | GA |
| **Ingress 注解** | Ingress 配置注解 | GA |

## 生产最佳实践

1. **元数据记录**：用 Annotation 记录元数据
2. **与 Label 区分**：Label 用于选择，Annotation 用于元数据
3. **工具集成**：工具配置用 Annotation
4. **Ingress 配置**：Ingress 配置用 Annotation
5. **命名规范**：Annotation 命名规范

## Annotation vs Label

| 维度 | Label | Annotation |
|------|-------|------------|
| **用途** | 选择/过滤资源 | 附加元数据 |
| **查询** | 支持 kubectl -l | 不支持过滤 |
| **值限制** | 63 字符 | 256KB |
| **典型用法** | app=web, env=prod | 版本、描述、工具配置 |

## AI 场景 Annotation 示例

```yaml
# AI 推理服务 Pod Annotation
metadata:
  annotations:
    # 模型信息
    ai.model/name: "qwen2.5-72b"
    ai.model/version: "v2.1"
    # 推理配置
    ai.inference/gpu-count: "4"
    ai.inference/max-batch-size: "256"
    # 监控
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
    # Ingress 配置
    nginx.ingress.kubernetes.io/proxy-read-timeout: "300"
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Annotation 不生效 | 格式错误 | 检查 key/value 格式 |
| 与 Label 混淆 | 用途不清 | Label 选择，Annotation 元数据 |
| Ingress 配置失败 | Annotation 错误 | 检查 Ingress Controller 文档 |
| 元数据丢失 | 更新时覆盖 | 使用 kubectl annotate |

## 版本兼容性

| 组件 | 版本 | 说明 |
|------|------|------|
| Kubernetes | 1.28+ | 核心 API |
| Nginx Ingress | 1.10+ | Ingress Annotation |
| cert-manager | 1.14+ | 证书 Annotation |

## 生产检查清单

1. 建立 Annotation 命名规范
2. Label 用于选择，Annotation 用于元数据
3. Ingress 配置通过 Annotation 管理
4. 避免在 Annotation 中存储敏感信息
5. 定期清理无用 Annotation
6. 文档化团队 Annotation 约定

## 总结

Annotation 是 Kubernetes 资源的元数据扩展机制，用于存储非标识性信息。在 AI 场景中，Annotation 用于记录模型版本、推理配置、监控设置等关键元数据。

> 💡 Annotation 的核心价值：Label 告诉 K8s “这是什么”，Annotation 告诉工具和人类“这个资源的详细信息是什么”。

## AI 服务常用 Annotation

```yaml
# AI 推理服务 Pod Annotation 示例
metadata:
  annotations:
    # 模型信息
    ai-platform/model-name: "llama-3-70b-instruct"
    ai-platform/model-version: "v2.1.0"
    ai-platform/model-size: "70B"
    # 部署信息
    ai-platform/deployed-by: "argocd"
    ai-platform/deploy-time: "2026-01-15T10:30:00Z"
    # 运维信息
    ai-platform/oncall-team: "ml-platform"
    ai-platform/runbook: "https://wiki.example.com/runbook/inference"
    # 监控配置
    prometheus.io/scrape: "true"
    prometheus.io/port: "9090"
```

## Label vs Annotation 对比

| 维度 | Label | Annotation |
|------|-------|------------|
| 用途 | 选择器/分组 | 元数据/描述 |
| 可查询 | 是（kubectl -l） | 否 |
| 值限制 | 63 字符 | 256KB |
| 典型用途 | 环境/版本/组件 | 构建信息/文档链接 |
| AI 场景 | GPU 类型/工作负载 | 模型版本/部署信息 |

## 生产检查清单

1. ✅ 模型信息通过 Annotation 记录
2. ✅ 部署时间和责任人可追溯
3. ✅ 监控配置通过 Annotation 声明
4. ✅ Runbook 链接方便故障排查
5. ✅ 与 Label 配合使用（Label 选择，Annotation 描述）
6. ✅ 避免在 Annotation 中存储敏感信息

