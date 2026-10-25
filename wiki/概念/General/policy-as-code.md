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
updated: 2026-07-21
name_zh: "策略即代码"
---

# Policy as Code（策略即代码）

> 中文简称：策略即代码

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

---

## 2026 Policy-as-Code 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **OPA/Gatekeeper** | 通用策略引擎 + K8s 准入控制 | GA |
| **Kyverno** | K8s 原生 YAML 策略，无需学习新语言 | GA |
| **AI 模型治理策略** | 模型上线审批、数据合规、输出审核策略 | GA |
| **Supply Chain 策略** | SBOM 验证、镜像签名、来源证明 | GA |
| **FinOps 策略** | GPU 资源配额、成本上限自动执行 | GA |

## 生产最佳实践

1. **左移执行**：在 CI 阶段就执行策略检查，而非等到部署时才发现违规
2. **渐进式强制**：新策略先 audit 模式观察，确认无误报后再切换 enforce
3. **策略版本化**：策略文件纳入 Git 管理，变更走 PR 审核流程
4. **例外机制**：提供明确的豁免流程，避免策略阻塞紧急发布
5. **可观测性**：策略违规事件接入告警系统，定期审计合规率

## OPA/Rego 策略示例

```rego
# AI 模型部署策略 - 禁止未审批模型上线
package ai_model_governance

deny[msg] {
    input.kind == "ModelDeployment"
    not input.metadata.annotations["approval.ai-platform/approved"]
    msg := sprintf("模型 %s 未经审批不得部署到生产环境", [input.metadata.name])
}

deny[msg] {
    input.kind == "ModelDeployment"
    input.spec.gpu_count > 8
    not input.metadata.annotations["finops/budget-approved"]
    msg := sprintf("模型 %s 申请 %d GPU 超出配额，需 FinOps 审批", [input.metadata.name, input.spec.gpu_count])
}

deny[msg] {
    input.kind == "ModelDeployment"
    not input.spec.guardrails.enabled
    msg := sprintf("模型 %s 必须启用安全护栏", [input.metadata.name])
}
```

## Policy-as-Code 工具对比

| 工具 | 语言 | 适用场景 | 学习曲线 | K8s 集成 |
|------|------|----------|----------|----------|
| OPA/Gatekeeper | Rego | 通用策略 | 高 | 原生 |
| Kyverno | YAML | K8s 策略 | 低 | 原生 |
| Conftest | Rego | CI 阶段检查 | 中 | 间接 |
| Cedar | Cedar | AWS 权限 | 中 | 间接 |
| Sentinel | HCL | Terraform | 中 | 无 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 策略阻塞紧急发布 | 无例外机制 | 配置豁免流程 + 审批链 |
| 误报率高 | 策略规则过严 | 先 audit 模式观察再 enforce |
| 策略冲突 | 多策略重叠 | 统一策略库 + 优先级排序 |
| 团队抵触 | 缺乏培训 | 策略文档化 + 自助查询 |

## 生产检查清单

1. ✅ 策略文件纳入 Git 版本管理
2. ✅ 新策略先 audit 模式观察 1-2 周
3. ✅ CI 阶段执行策略检查（左移）
4. ✅ 提供明确的豁免/例外流程
5. ✅ 策略违规事件接入告警系统
6. ✅ 定期审计合规率 + 策略有效性

## 总结

Policy-as-Code 是将组织治理规则转化为可执行代码的实践，2026 年已扩展到 AI 模型治理、FinOps 成本控制和供应链安全等领域。其核心价值是将“人为约定”变为“自动执行”，确保合规性不依赖个人记忆。

> 💡 Policy-as-Code 的核心原则：“策略即代码，代码即策略”——所有治理规则都应该可版本化、可测试、可审计。