---
title: "Pod Security Standards"
category: -concepts
tags: ["kubernetes", "k8s", "security", "pod-security", "psa", "admission", "cloud-native", "alibaba-cloud"]
summary: "Pod Security Standards 是 Kubernetes 官方定义的 Pod 安全策略集合，分为 Privileged、Baseline、Restricted 三级，用于限制危险容器配置。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "Pod 安全标准"
  - "PSA"
  - "Pod Security Admission"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/kyverno"
    type: related_to
  - target: "概念/opa"
    type: related_to
sources: []
---

# Pod Security Standards

> **一句话理解**: Pod Security Standards 是 K8s 官方给出的「Pod 安全配置红绿灯」，把 Pod 权限分为宽松、基线、严格三档，防止容器做过危险操作。

## 核心要点

- **三个级别**:
  - **Privileged**: 完全开放，仅用于系统级工作负载。
  - **Baseline**: 阻止已知危险配置，同时保证大多数应用可用。
  - **Restricted**: 遵循 Pod 加固最佳实践，建议用于生产应用。
- **内置 Admission 插件**: K8s 1.23+ 内置 Pod Security Admission，无需额外 OPA/Kyverno。
- **Namespace 级应用**: 通过 `pod-security.kubernetes.io/<level>` 标签在 Namespace 上启用。
- **三种动作**: enforce（拒绝）、audit（记录告警）、warn（用户告警）。

## Namespace 配置示例

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: prod
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

## Restricted 常见限制

| 配置 | 限制 | 原因 |
|------|------|------|
| `runAsNonRoot` | 必须 | 防止以 root 运行 |
| `allowPrivilegeEscalation: false` | 必须 | 禁止提权 |
| `readOnlyRootFilesystem` | 建议 | 防止运行时篡改 |
| `capabilities` | 仅允许 NET_BIND_SERVICE | 最小权限 |
| `hostPath` | 禁止 | 防止主机目录挂载 |
| `hostNetwork` / `hostPID` | 禁止 | 隔离主机命名空间 |

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，建议生产 Namespace 启用 `restricted` 级别审计，并通过 Kyverno/OPA 补充企业合规策略。工单中「Pod 创建被拒绝」时，需检查 Namespace 的 PSA 标签与 Pod 的 securityContext。

## Related

- [[概念/kyverno|Kyverno]] — K8s 策略引擎
- [[概念/opa|OPA]] — 通用策略引擎
- [[概念/pod|Pod]] — Pod 安全上下文
- [[概念/kubernetes|Kubernetes]] — 容器编排
- [[概念/network-policy|NetworkPolicy]] — 网络策略

---

## 2026 Pod Security 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **PSA 内置** | K8s 1.25+ 默认启用 | GA |
| **Restricted** | 生产推荐级别 | GA |
| **与 Kyverno 互补** | 企业级策略扩展 | GA |

## 三级对比

| 维度 | Privileged | Baseline | Restricted |
|------|-----------|----------|------------|
| 定位 | 系统组件 | 普通应用 | 安全敏感应用 |
| hostPath | 允许 | 禁止 | 禁止 |
| hostNetwork | 允许 | 禁止 | 禁止 |
| privileged | 允许 | 禁止 | 禁止 |
| runAsNonRoot | 不要求 | 不要求 | 必须 |
| capabilities | 不限制 | 限制危险 | 仅 NET_BIND_SERVICE |
| volume 类型 | 不限制 | 禁止 hostPath | 仅安全类型 |

## Pod 安全配置示例

```yaml
# 符合 Restricted 标准的 Pod
apiVersion: v1
kind: Pod
metadata:
  name: secure-inference
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: inference
      image: inference-app:v1
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop: ["ALL"]
      volumeMounts:
        - name: tmp
          mountPath: /tmp
  volumes:
    - name: tmp
      emptyDir: {}
```

## 迁移策略

| 阶段 | 动作 | 说明 |
|------|------|------|
| 1. 审计 | `audit: restricted` | 记录违规但不拒绝 |
| 2. 告警 | `warn: restricted` | 用户可见告警 |
| 3. 修复 | 修改 Pod 配置 | 根据审计日志修复 |
| 4. 强制 | `enforce: restricted` | 拒绝违规 Pod |

## AI 场景特殊考虑

| 场景 | 级别 | 原因 |
|------|------|------|
| GPU Operator | Privileged | 需要主机设备访问 |
| 训练任务 | Baseline | 需要部分权限 |
| 推理服务 | Restricted | 生产安全要求 |
| 监控 Agent | Privileged | 需要主机指标采集 |
| Jupyter Hub | Baseline | 用户代码执行 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Pod 被拒绝 | 不符合 enforce 级别 | 修改 securityContext |
| GPU Pod 失败 | Restricted 禁止特权 | GPU NS 用 Baseline |
| 审计日志多 | 未修复违规 | 逐步修复后启用 enforce |
| 版本不兼容 | K8s < 1.23 | 升级或使用 PSP |

## 生产最佳实践

1. **生产用 Restricted**：生产 Namespace 启用 restricted 级别
2. **渐进式迁移**：先 audit/warn，再 enforce
3. **系统组件豁免**：kube-system 用 privileged，业务用 restricted
4. **与 Kyverno 结合**：PSA 管基础，Kyverno 管企业策略
5. **GPU 场景特殊处理**：GPU 相关组件使用 Baseline 级别

## 审计与监控

```bash
# 查看 Namespace PSA 标签
kubectl get ns -o json | jq '.items[] | {name: .metadata.name, psa: .metadata.labels | with_entries(select(.key | startswith("pod-security")))}'

# 查看审计日志中的 PSA 违规
kubectl logs -n kube-system -l component=kube-apiserver | grep "pod-security"

# 检查 Pod 是否符合 Restricted
kubectl get pod <name> -o json | jq '.spec.securityContext'
```

## 与其他安全工具对比

| 工具 | 作用层级 | 适用场景 |
|------|----------|----------|
| **PSA** | Pod 安全配置 | 基础安全防线 |
| **Kyverno** | 任意资源策略 | 企业级策略 |
| **OPA/Gatekeeper** | 任意资源策略 | 通用策略引擎 |
| **NetworkPolicy** | 网络流量 | 网络隔离 |
| **Trivy** | 镜像/配置扫描 | 漏洞检测 |

## 相关概念

- [[概念/kyverno|Kyverno]] — K8s 策略引擎
- [[概念/opa|OPA]] — 通用策略引擎
- [[概念/network-policy|NetworkPolicy]] — 网络策略

## 总结

Pod Security Standards 是 K8s 安全的第一道防线，分为 Privileged、Baseline、Restricted 三级。生产环境应始终启用 Restricted 级别，GPU 相关组件使用 Baseline。

---

> 💡 Pod Security Standards 是 K8s 安全的第一道防线，生产环境应始终启用 Restricted 级别。


