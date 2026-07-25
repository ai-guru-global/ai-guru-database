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
  - 17_伦理安全/LLM_Security_Complete_Guide.md
summary: "OPA 是 CNCF Graduated 的开源策略引擎，使用 Rego 语言定义策略，可用于 K8s 准入控制、API 授权、微服务访问控制等场景，是策略即代码（Policy as Code）的代表工具。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
tier: archived
created: 2026-06-16
updated: 2026-07-21
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
- [[概念/pod-security-standards]] — Pod 安全标准
- [[17_伦理安全/LLM_Security_Complete_Guide]] — LLM 安全完整指南

---

## 2026 OPA 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **CNCF 毕业** | 成熟稳定 | GA |
| **Gatekeeper** | K8s 准入控制 | GA |
| **Rego v1** | 语法简化 | GA |
| **Conftest** | CI/CD 策略测试 | GA |

## 生产最佳实践

1. **与 Kyverno 对比**：K8s 场景优先 Kyverno，通用场景用 OPA
2. **策略测试**：使用 conftest 在 CI/CD 中测试策略
3. **渐进式采用**：先 audit 模式，再 enforce
4. **策略库复用**：使用社区策略库减少重复工作

## OPA 核心概念

| 概念 | 说明 |
|------|------|
| Rego | OPA 策略语言 |
| Policy | 策略规则 |
| Data | 策略数据 |
| Input | 输入文档 |
| Decision | 策略决策 |

## OPA/Gatekeeper 架构

| 组件 | 功能 |
|------|------|
| OPA | 策略引擎 |
| Gatekeeper | K8s 集成 |
| ConstraintTemplate | 策略模板 |
| Constraint | 策略实例 |

## Rego 策略示例

```rego
# 禁止特权容器
package k8spspprivilegedcontainer

violation[{"msg": msg}] {
    container := input.review.object.spec.containers[_]
    container.securityContext.privileged
    msg := sprintf("容器 %v 不允许特权模式", [container.name])
}

# 要求 GPU limits
violation[{"msg": msg}] {
    container := input.review.object.spec.containers[_]
    not container.resources.limits["nvidia.com/gpu"]
    msg := sprintf("容器 %v 必须设置 GPU limits", [container.name])
}
```

## OPA vs Kyverno

| 特性 | OPA/Gatekeeper | Kyverno |
|------|------|------|
| 策略语言 | Rego | YAML |
| 学习曲线 | 高 | 低 |
| 通用性 | 高 (非 K8s 也可用) | K8s 专用 |
| 变更请求 | ❌ | ✅ |
| 适用场景 | 复杂策略/多系统 | K8s 策略 |

## AI 场景策略

| 策略 | 说明 |
|------|------|
| GPU 资源管控 | 强制 GPU limits |
| 镜像安全 | 受信仓库验证 |
| 网络隔离 | 命名空间隔离 |
| 资源配额 | 防止资源耗尽 |

> 💡 OPA 是通用策略引擎，2026 年 K8s 场景推荐 Kyverno (简单) 或 OPA/Gatekeeper (复杂策略)。

## 常用命令

| 命令 | 用途 |
|------|------|
| `kubectl get constrainttemplates` | 查看策略模板 |
| `kubectl get constraints` | 查看策略实例 |
| `opa eval -d policy.rego -i input.json` | 测试策略 |
| `conftest test deployment.yaml` | CI/CD 测试 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 策略不生效 | Rego 语法错误 | opa eval 调试 |
| 性能问题 | 策略复杂 | 优化 Rego 规则 |
| 误拦截 | 规则过严 | 调整规则/排除 |
| Gatekeeper 崩溃 | 资源不足 | 增加资源限制 |

## 最佳实践

| 实践 | 说明 |
|------|------|
| 先 Audit 后 Enforce | 渐进式采用 |
| 使用 conftest 测试 | CI/CD 集成 |
| 策略库复用 | 社区策略库 |
| 定期审查 | 清理过时策略 |
