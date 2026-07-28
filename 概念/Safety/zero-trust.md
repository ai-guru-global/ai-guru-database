---
title: "零信任架构 (Zero Trust)"
category: -concepts
tags: ["zero-trust", "security", "identity", "mtls", "least-privilege"]
relationships:
  - target: "概念/Safety/model-security"
    type: complements
  - target: "概念/Safety/runtime-security"
    type: related_to
sources:
  - 12_架构基建/10_Security/
  - 17_伦理安全/06_Security/
summary: "零信任以'永不默认信任、始终验证'为原则，取消基于网络边界的信任假设，对每次访问做身份认证、设备校验与最小权限授权，是 AI 基础设施与 Agent 系统安全的基础架构范式。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-07-27
updated: 2026-07-27
aliases:
  - "Zero Trust"
  - "零信任"
  - "Zero Trust Architecture"
name_zh: "零信任架构"
---
# 零信任架构 (Zero Trust)

> 中文简称：零信任架构

> 内网不等于安全区——每一次访问都要重新证明"你是谁、凭什么"。

---

## 1. 定义

**零信任**（Zero Trust，Forrester 2010 提出，NIST SP 800-207 标准化）否定"边界内可信"的城堡-护城河模型，核心原则：

1. **永不默认信任**：不因位置（内网/VPN）授予信任
2. **持续验证**：每次请求验证身份、设备、上下文
3. **最小权限**：只授予完成任务所需的最小访问
4. **假设已被攻破**：微分段限制横向移动，全量审计

---

## 2. 核心组件

| 组件 | 作用 | 代表实现 |
|------|------|----------|
| **身份提供方 (IdP)** | 人/服务的统一身份 | OIDC、SPIFFE/SPIRE |
| **策略引擎 (PDP)** | 访问决策 | OPA、Cedar |
| **策略执行点 (PEP)** | 拦截与放行 | API 网关、Sidecar |
| **mTLS** | 服务间双向认证加密 | Istio、Linkerd |
| **微分段** | 工作负载级隔离 | NetworkPolicy、Cilium |

---

## 3. AI 场景的零信任

| 场景 | 实践 |
|------|------|
| **模型 API** | 每请求鉴权 + 细粒度配额，杜绝"内网免鉴权"模型端点 |
| **训练集群** | 数据/模型仓库按项目最小授权，GPU 节点工作负载身份（SPIFFE） |
| **Agent 系统** | 工具调用按 Agent 身份授权、审计；MCP 服务端最小权限 |
| **RAG** | 检索结果按调用者权限过滤（document-level ACL） |
| **供应链** | 模型权重/依赖签名校验（Sigstore） |

---

## 4. 落地路径

1. 盘点资产与数据流 → 2. 统一身份（人+服务）→ 3. 关键系统 PEP 前置 → 4. mTLS 全覆盖 → 5. 微分段与持续监控

---

## Related

- [[概念/Safety/model-security]] — 模型安全
- [[概念/Safety/runtime-security]] — 运行时安全
- [[概念/Safety/container-security]] — 容器安全
- [[概念/Safety/supply-chain-security]] — 供应链安全
- [[概念/Agent/tool-calling-safety]] — 工具调用安全

> ℹ️ 2026 年趋势：Agent 大规模接入企业系统后，"给 Agent 发身份、按零信任管控工具权限"成为企业 AI 安全的第一课。
