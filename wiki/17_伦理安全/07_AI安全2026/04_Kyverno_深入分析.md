---
tier: supporting
title: "Kyverno 深度解析: Kubernetes 原生策略引擎"
category: "17-ethics-safety"
tags: ["kyverno", "kubernetes", "policy", "security", "admission-control", "yaml", "compliance"]
summary: "> **一句话理解**: Kyverno 是专为 Kubernetes 设计的策略引擎，使用原生 YAML 定义验证、变更、生成和镜像验证策略，无需学习 Rego，是 K8s 安全基线和资源合规的轻量选择。"
created: "2026-06-16"
updated: "2026-06-16"
sources: []
name_zh: "Kyverno 深度解析: Kubernetes 原生策略引擎"
---

# Kyverno 深度解析：Kubernetes 原生策略引擎

> 中文简称：Kyverno 深度解析: Kubernetes 原生策略引擎

> **一句话理解**: Kyverno 是专为 Kubernetes 设计的策略引擎，使用原生 YAML 定义验证、变更、生成和镜像验证策略，无需学习 Rego，是 K8s 安全基线和资源合规的轻量选择。

> **官方站点**: https://kyverno.io

---

## 目录

1. [核心能力](#1-核心能力)
2. [策略类型](#2-策略类型)
3. [典型策略示例](#3-典型策略示例)
4. [AI 场景应用](#4-ai-场景应用)
5. [生产最佳实践](#5-生产最佳实践)
6. [常见问题](#6-常见问题)
7. [官方资源](#7-官方资源)

---

## 1. 核心能力

| 能力 | 说明 |
|------|------|
| **Validate** | 拒绝不合规资源 |
| **Mutate** | 自动修改资源 |
| **Generate** | 自动创建关联资源 |
| **Verify Images** | 验证镜像签名 |
| **Policy Reports** | 展示集群合规状态 |

---

## 2. 策略类型

| 类型 | 用途 |
|------|------|
| **ClusterPolicy** | 集群级策略 |
| **Policy** | 命名空间级策略 |

---

## 3. 典型策略示例

### 3.1 禁止 Privileged 容器

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-privileged
spec:
  validationFailureAction: Enforce
  rules:
    - name: check-privileged
      match:
        resources:
          kinds:
            - Pod
      validate:
        message: "Privileged containers are not allowed"
        pattern:
          spec:
            containers:
              - securityContext:
                  privileged: "false"
```

### 3.2 强制资源限制

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-resources-limits
spec:
  validationFailureAction: Enforce
  rules:
    - name: check-limits
      match:
        resources:
          kinds:
            - Pod
      validate:
        message: "CPU and memory limits are required"
        pattern:
          spec:
            containers:
              - resources:
                  limits:
                    memory: "?*"
                    cpu: "?*"
```

---

## 4. AI 场景应用

- 要求所有 GPU Pod 使用指定 toleration。
- 自动为 AI 命名空间添加成本中心标签。
- 禁止模型服务镜像来自公共仓库。
- 强制训练 Job 设置 activeDeadlineSeconds。

---

## 5. 生产最佳实践

1. 先用 `Audit` 模式观察，再切 `Enforce`。
2. 使用 `exclude` 排除 kube-system 等系统命名空间。
3. 定期查看 Policy Reports。
4. 与 ArgoCD/Flux 集成做 GitOps 策略管理。

---

## 6. 常见问题

### Q1: Kyverno 与 OPA 怎么选？

**A**: K8s 原生简单场景选 Kyverno；复杂跨平台策略选 OPA。

### Q2: Kyverno 会拖慢 API Server 吗？

**A**: 通常影响很小，可通过副本数和资源请求调优。

### Q3: 如何验证策略？

**A**: 使用 `kyverno test` 命令或 Kyverno CLI。

---

## 7. 官方资源

- **官网**: https://kyverno.io
- **GitHub**: https://github.com/kyverno/kyverno
- **文档**: https://kyverno.io/docs/

---

## Related

- [[概念/kyverno]] — Kyverno 概念卡片
- [[概念/opa]] — OPA
- [[概念/falco]] — Falco
- [[概念/kubernetes]] — Kubernetes
