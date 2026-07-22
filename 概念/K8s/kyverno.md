---
title: "Kyverno"
category: -concepts
tags: ["kyverno", "kubernetes", "policy", "security", "admission-control", "yaml", "cncf"]
relationships:
  - target: "概念/policy-as-code"
    type: implements
  - target: "概念/kubernetes"
    type: extends
  - target: "概念/opa"
    type: related_to
  - target: "概念/falco"
    type: related_to
sources:
  - 伦理安全/LLM_Security_Complete_Guide.md
summary: "Kyverno 是专为 Kubernetes 设计的策略引擎，使用原生 YAML 定义策略，无需学习新语言，广泛应用于 K8s 安全基线、资源合规和最佳实践强制。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
tier: archived
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Kyverno

---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

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

- [[概念/policy-as-code]] — 策略即代码
- [[概念/opa]] — OPA
- [[概念/falco]] — Falco
- [[概念/kubernetes]] — Kubernetes
- [[概念/pod-security-standards]] — Pod 安全标准
- [[伦理安全/LLM_Security_Complete_Guide]] — LLM 安全完整指南

---

## 2026 Kyverno 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **CNCF 孵化** | 社区活跃 | GA |
| **策略报告** | 合规状态可视化 | GA |
| **镜像验证** | Cosign 集成 | GA |
| **CEL 支持** | 表达式增强 | Beta |

## 生产最佳实践

1. **与 PSA 配合**：PSA 管基础，Kyverno 管企业策略
2. **策略库**：使用 Kyverno Policies 官方库
3. **渐进式采用**：先 audit，再 enforce
4. **镜像签名**：启用镜像签名验证

## Kyverno vs OPA/Gatekeeper

| 特性 | Kyverno | OPA/Gatekeeper |
|------|------|------|
| 策略语言 | YAML | Rego |
| 学习曲线 | 低 | 高 |
| K8s 原生 | ✅ | 部分 |
| 变更请求 | ✅ | ❌ |
| 镜像验证 | ✅ | 插件 |
| 适用场景 | K8s 策略 | 通用策略 |

## Kyverno 策略类型

| 类型 | 说明 |
|------|------|
| Validate | 验证资源是否符合规则 |
| Mutate | 修改资源 |
| Generate | 自动生成资源 |
| VerifyImages | 验证镜像签名 |

## Kyverno 策略示例

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-gpu-limits
spec:
  validationFailureAction: Enforce
  rules:
  - name: check-gpu-limits
    match:
      any:
      - resources:
          kinds:
          - Pod
    validate:
      message: "GPU Pod 必须设置 nvidia.com/gpu limits"
      pattern:
        spec:
          containers:
          - resources:
              limits:
                nvidia.com/gpu: "?*"
```

## AI 场景策略

| 策略 | 说明 |
|------|------|
| GPU 资源限制 | 强制设置 GPU limits |
| 镜像来源 | 只允许受信仓库 |
| 资源配额 | 限制最大资源 |
| 标签要求 | 强制添加团队标签 |
| 安全上下文 | 禁止特权容器 |

## 常用命令

| 命令 | 用途 |
|------|------|
| `kubectl get clusterpolicy` | 查看策略 |
| `kubectl get policy -A` | 查看命名空间策略 |
| `kubectl get policyreport -A` | 查看策略报告 |

> 💡 Kyverno 是 K8s 策略管理的云原生方案，2026 年 AI 平台推荐 Kyverno 实现 GPU 资源管控和安全合规。

## 策略验证模式

| 模式 | 说明 | 适用场景 |
|------|------|------|
| Audit | 仅记录违规 | 初期观察 |
| Enforce | 阻止违规资源 | 生产环境 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 策略不生效 | 未正确匹配 | 检查 match 规则 |
| 误拦截 | 规则过严 | 调整规则/排除 |
| 性能影响 | 策略过多 | 优化规则数量 |
| 变更失败 | Enforce 模式 | 检查违规原因 |

## 最佳实践

| 实践 | 说明 |
|------|------|
| 先 Audit 后 Enforce | 渐进式采用 |
| 使用官方策略库 | Kyverno Policies |
| 定期审查策略 | 清理过时规则 |
| 配合 CI/CD | 部署前验证 |
