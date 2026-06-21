---
title: "Kyverno"
category: concept
tags: ["kyverno", "kubernetes", "policy", "security", "admission-control", "yaml", "cncf"]
relationships:
  - target: "_concepts/policy-as-code"
    type: implements
  - target: "_concepts/kubernetes"
    type: extends
  - target: "_concepts/opa"
    type: related_to
  - target: "_concepts/falco"
    type: related_to
sources:
  - 17_Ethics_Safety/LLM_Security_Complete_Guide.md
summary: "Kyverno 是专为 Kubernetes 设计的策略引擎，使用原生 YAML 定义策略，无需学习新语言，广泛应用于 K8s 安全基线、资源合规和最佳实践强制。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# Kyverno

> Kubernetes 的「YAML 策略守门员」——用 K8s 原生方式写策略，无需学 Rego。

---

## 1. 一句话定义

**Kyverno** 是专为 Kubernetes 设计的开源策略引擎，使用**原生 YAML** 定义策略规则。它通过动态准入控制拦截或修改不合规的 K8s 资源，广泛应用于安全基线、资源合规、最佳实践强制和多租户治理。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **YAML 策略** | 与 K8s 资源格式一致 |
| **验证（Validate）** | 拒绝不合规资源 |
| **变更（Mutate）** | 自动修改资源（如加标签） |
| **生成（Generate）** | 自动创建关联资源 |
| **镜像验证** | 验证镜像签名 |
| **策略报告** | 展示集群合规状态 |
| **治理即代码** | 策略可版本化管理 |

---

## 3. 典型场景

1. **禁止 privileged 容器**：防止容器逃逸。
2. **强制资源限制**：要求 Pod 设置 CPU/内存 limit。
3. **镜像白名单**：只允许指定仓库的镜像。
4. **自动加标签**：按命名空间自动加团队标签。
5. **AI 模型部署治理**：限制模型服务副本数、强制安全上下文。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **OPA/Gatekeeper** | 更通用但需要学 Rego；Kyverno 更易用 |
| **Falco** | Falco 检测运行时异常，Kyverno 做准入控制 |
| **Kubernetes** | Kyverno 是 K8s 原生策略引擎 |

---

## 5. 优势与局限

### 优势
- YAML 策略，K8s 用户上手快。
- 安装简单，与 kubectl 集成好。
- 策略报告直观。

### 局限
- 只适用于 Kubernetes。
- 复杂策略表达能力不如 OPA/Rego。

---

## Related

- [[_concepts/policy-as-code]] — 策略即代码
- [[_concepts/opa]] — OPA
- [[_concepts/falco]] — Falco
- [[_concepts/kubernetes]] — Kubernetes
- [[17_Ethics_Safety/LLM_Security_Complete_Guide]] — LLM 安全完整指南
