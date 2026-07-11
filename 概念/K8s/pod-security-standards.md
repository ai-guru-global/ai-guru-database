---
title: "Pod Security Standards"
category: -concepts
tags: ["kubernetes", "k8s", "security", "pod-security", "psa", "admission", "cloud-native", "alibaba-cloud"]
summary: "Pod Security Standards 是 Kubernetes 官方定义的 Pod 安全策略集合，分为 Privileged、Baseline、Restricted 三级，用于限制危险容器配置。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
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
