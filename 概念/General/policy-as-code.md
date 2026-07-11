---
title: "Policy as Code（策略即代码）"
category: -concepts
tags: [policy-as-code, opa, kyverno, kubernetes, security, governance]
aliases:
  - "Policy as Code"
  - "PaC"
  - "策略即代码"
relationships:
  - target: "概念/opa"
    type: implemented_by
  - target: "概念/kyverno"
    type: implemented_by
  - target: "概念/runtime-security"
    type: complementary
sources:
  - 概念/opa.md
  - 概念/kyverno.md
summary: "Policy as Code（策略即代码）把安全、合规、运维策略以代码形式声明（Rego / YAML / CEL），版本化管理、可测试、可审计，是 Kubernetes 和云原生时代治理的标准范式。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-06-24
---

# Policy as Code（策略即代码）

## 核心要点

- **核心思想**：把"什么能做 / 什么不能做"的规则用代码声明，而非文档/口头约定。
- **主要场景**：
  - K8s 准入控制（Admission Control）
  - IaC 扫描（Terraform / CloudFormation / Pulumi）
  - API 授权（OPA / Cedar）
  - 数据合规（GDPR / HIPAA 数据流控制）
  - AI Agent 工具调用白名单
- **主流工具**：
  - **OPA（Open Policy Agent）+ Rego**：通用、与 K8s/IaC 深度集成
  - **Kyverno**：K8s 原生 YAML 策略
  - **Cedar**（AWS）：简洁、专为授权设计
  - **Sentinel**（HashiCorp）：Terraform 内置
  - **Conftest**：用 OPA 测试配置文件

## 一句话解释

> PaC = "你说允许什么 / 拒绝什么"，但写在代码里、能进 CI、能版本管理、能审计。

## 三种策略类型

| 类型 | 时机 | 代表工具 |
|------|------|---------|
| **准入策略**（Admission） | K8s API 请求时 | Kyverno、OPA/Gatekeeper |
| **执行策略**（Execution） | 资源运行时 | Falco、Tetragon |
| **审计策略**（Audit） | 周期扫描 | Polaris、kube-bench |

## OPA Rego 示例

```rego
# OPA 策略：禁止 privileged 容器
package kubernetes.admission

deny[msg] {
    input.request.kind.kind == "Pod"
    input.request.object.spec.containers[_].securityContext.privileged == true
    msg := "Privileged containers are not allowed"
}

deny[msg] {
    input.request.object.metadata.labels["app"] == "prod"
    not input.request.object.metadata.labels["owner"]
    msg := "Production pods must have an 'owner' label"
}
```

## Kyverno YAML 示例

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-labels
spec:
  validationFailureAction: Enforce
  rules:
  - name: check-owner
    match:
      any:
      - resources:
          kinds: ["Pod"]
    validate:
      message: "Production pods must have 'owner' label."
      pattern:
        metadata:
          labels:
            owner: "?*"
```

## 在 AI/LLM 系统中的新角色

- **Agent 工具白名单**：哪些 API Agent 可以调用、哪些不能
- **Prompt 注入防御**：检测输入中的可疑模式
- **输出过滤**：确保 LLM 输出不含 PII / 有害内容
- **审计追溯**：所有 LLM 调用必须带 policy 决策日志

## 何时使用

✅ **推荐**：
- K8s 多租户环境（强约束）
- 合规要求高的行业（金融 / 医疗 / 政府）
- 复杂 IaC（Terraform / Helm）管理
- AI Agent 工具调用治理

⚠️ **不推荐**：
- 极简 K8s 集群（无策略需求）
- 策略本身是动态业务规则（应放入业务代码）

## Related

- [[概念/opa]] — Open Policy Agent
- [[概念/kyverno]] — Kyverno（K8s 原生）
- [[概念/runtime-security]] — 运行时安全
- [[概念/ci-cd]] — CI/CD 流水线中的策略集成