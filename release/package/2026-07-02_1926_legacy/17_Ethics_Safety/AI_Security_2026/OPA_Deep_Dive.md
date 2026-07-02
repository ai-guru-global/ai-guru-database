---
tier: supporting
title: "OPA / Gatekeeper 深度解析: 云原生策略即代码"
category: "17-ethics-safety"
tags: ["opa", "open-policy-agent", "gatekeeper", "policy", "security", "kubernetes", "rego", "authorization"]
summary: "> **一句话理解**: OPA 是 CNCF Graduated 的通用策略引擎，使用 Rego 语言定义策略；Gatekeeper 是 OPA 在 Kubernetes 中的准入控制器实现，用于强制集群安全基线与合规。"
created: "2026-06-16"
updated: "2026-06-16"
---

# OPA / Gatekeeper 深度解析：云原生策略即代码

> **一句话理解**: OPA 是 CNCF Graduated 的通用策略引擎，使用 Rego 语言定义策略；Gatekeeper 是 OPA 在 Kubernetes 中的准入控制器实现，用于强制集群安全基线与合规。

> **官方站点**: https://www.openpolicyagent.org

---

## 目录

1. [核心概念](#1-核心概念)
2. [OPA 架构](#2-opa-架构)
3. [Rego 语言基础](#3-rego-语言基础)
4. [Gatekeeper 在 K8s 中的应用](#4-gatekeeper-在-k8s-中的应用)
5. [AI 场景中的策略示例](#5-ai-场景中的策略示例)
6. [生产最佳实践](#6-生产最佳实践)
7. [常见问题](#7-常见问题)
8. [官方资源](#8-官方资源)

---

## 1. 核心概念

| 概念 | 说明 |
|------|------|
| **OPA** | 通用策略引擎，可脱离应用运行 |
| **Rego** | OPA 的声明式策略语言 |
| **Gatekeeper** | OPA 的 K8s 准入控制器 |
| **Constraint** | K8s CRD，定义要检查的资源类型 |
| **ConstraintTemplate** | 模板，包含 Rego 逻辑 |

---

## 2. OPA 架构

```
Application / K8s API
    │
    ▼  HTTP Query
OPA Server
    ├── Policy (Rego)
    └── Data (JSON)
    │
    ▼  Decision: allow / deny
Application
```

---

## 3. Rego 语言基础

```rego
package example

default allow := false

allow {
    input.method == "GET"
    input.path == "/public"
}
```

---

## 4. Gatekeeper 在 K8s 中的应用

### 4.1 禁止 Privileged 容器

```yaml
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: k8spspprivilegedcontainer
spec:
  crd:
    spec:
      names:
        kind: K8sPSPPrivilegedContainer
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8spspprivilegedcontainer
        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          container.securityContext.privileged
          msg := sprintf("Privileged container is not allowed: %v", [container.name])
        }
```

### 4.2 应用 Constraint

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sPSPPrivilegedContainer
metadata:
  name: psp-privileged-container
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
```

---

## 5. AI 场景中的策略示例

- 禁止没有资源限制的 AI 训练 Pod。
- 限制模型服务只能使用指定镜像仓库。
- 要求 RAG 应用必须挂载只读卷。
- 限制 GPU 命名空间配额。

---

## 6. 生产最佳实践

1. 先 `dry-run` 模式运行，观察影响。
2. 使用 `excludedNamespaces` 排除系统命名空间。
3. 为策略编写单元测试。
4. 与 CI/CD 集成，在部署前验证。
5. 使用 OPA Bundle 分发策略。

---

## 7. 常见问题

### Q1: OPA 与 Kyverno 怎么选？

**A**: 需要跨平台/复杂策略选 OPA；纯 K8s 简单场景选 Kyverno。

### Q2: Gatekeeper 会拒绝所有不合规资源吗？

**A**: 默认会拒绝，可配置 enforcementAction 为 warn/dryrun。

### Q3: 如何调试 Rego？

**A**: 使用 `opa test` 和 `opa eval` 命令行工具。

---

## 8. 官方资源

- **OPA 官网**: https://www.openpolicyagent.org
- **Gatekeeper GitHub**: https://github.com/open-policy-agent/gatekeeper
- **Rego 文档**: https://www.openpolicyagent.org/docs/latest/policy-language/

---

## Related

- [[_concepts/opa]] — OPA 概念卡片
- [[_concepts/kyverno]] — Kyverno
- [[_concepts/falco]] — Falco
- [[_concepts/kubernetes]] — Kubernetes
- [[17_Ethics_Safety/AI_Security_2026/AI_Security_2026]] — AI 安全 2026
