---
title: "OPA (Open Policy Agent)"
category: -concepts
tags: ["opa", "open-policy-agent", "policy", "security", "authorization", "admission-control", "rego", "cncf"]
relationships:
  - target: "概念/policy-as-code"
    type: implements
  - target: "概念/kubernetes"
    type: used_by
  - target: "概念/kyverno"
    type: related_to
  - target: "概念/falco"
    type: related_to
sources:
  - 伦理安全/LLM_Security_Complete_Guide.md
summary: "OPA 是 CNCF Graduated 的开源策略引擎，使用 Rego 语言定义策略，可用于 K8s 准入控制、API 授权、微服务访问控制等场景，是策略即代码（Policy as Code）的代表工具。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
tier: archived
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Opa

---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

# OPA (Open Policy Agent)

> 云原生世界的「策略大脑」——用 Rego 语言统一管理谁能做什么。

---

## 1. 一句话定义

**OPA**（Open Policy Agent）是 CNCF Graduated 的开源通用策略引擎，使用 **Rego** 声明式语言定义策略。它可以脱离具体应用运行，为 Kubernetes 准入控制、微服务 API 授权、服务网格访问控制等提供统一的策略决策。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **Rego 语言** | 声明式策略语言 |
| **策略即代码** | 策略可版本化、测试、复用 |
| **解耦决策** | 应用只需询问 OPA，不内嵌策略逻辑 |
| **K8s 准入控制** | 通过 Gatekeeper 拦截不合规资源 |
| **API 授权** | 为 REST/gRPC API 做访问控制 |
| **数据上下文** | 可注入外部数据做动态决策 |

---

## 3. 典型场景

1. **K8s 安全基线**：禁止 privileged Pod、限制镜像来源。
2. **API 访问控制**：判断用户是否有权调用某个接口。
3. **微服务授权**：服务间调用权限判断。
4. **AI 模型治理**：限制敏感模型部署、控制推理请求参数。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Gatekeeper** | OPA 在 K8s 中的准入控制器实现 |
| **Kyverno** | 另一个 K8s 策略引擎，比 OPA 更易用但灵活度低 |
| **Falco** | 运行时安全检测，OPA 是策略决策 |
| **Istio/Envoy** | 可调用 OPA 做访问控制 |

---

## 5. 优势与局限

### 优势
- 通用性强，不限于 K8s。
- Rego 表达能力强，适合复杂策略。
- CNCF Graduated，生态成熟。

### 局限
- Rego 学习曲线陡峭。
- K8s 场景下配置比 Kyverno 复杂。

---

## Related

- [[概念/policy-as-code]] — 策略即代码
- [[概念/kyverno]] — Kyverno
- [[概念/falco]] — Falco
- [[概念/kubernetes]] — Kubernetes
- [[伦理安全/LLM_Security_Complete_Guide]] — LLM 安全完整指南
