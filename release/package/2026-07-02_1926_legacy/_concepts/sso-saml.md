---
title: "SSO 与 SAML2 企业身份认证"
category: -concepts
tags: ["sso", "saml2", "oauth2", "azure-ad", "enterprise-auth", "identity-provider"]
relationships:
  - target: "_concepts/rbac"
    type: complements
  - target: "_concepts/single-tenant-architecture"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "SSO 单点登录让用户使用企业身份（如 Azure AD）一次登录即可访问 AI Stack，无需单独管理账户密码。SAML2 是最广泛的企业 SSO 协议标准。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# SSO 与 SAML2 企业身份认证 (Enterprise SSO)

> 一次登录，处处通行——企业身份管理的终极目标。

---

## 1. 定义

**SSO**（Single Sign-On，单点登录）允许用户使用一组凭证登录多个应用系统，无需为每个系统维护独立的账户密码。企业 AI 平台通过 SSO 集成到现有身份管理体系（如 Azure AD、Okta），简化用户管理并增强安全性。

---

## 2. 主要 SSO 协议对比

| 协议 | 年份 | 特点 | 适用场景 |
|------|------|------|----------|
| **SAML 2.0** | 2005 | XML-based，成熟稳定 | 企业 Web 应用、AI Stack |
| **OAuth 2.0** | 2012 | 授权委托（非认证） | API 授权、第三方登录 |
| **OpenID Connect** | 2014 | 基于 OAuth 2.0 的身份层 | 现代 Web/移动应用 |
| **Kerberos** | 1988 | 票据协议，内网认证 | Windows 域环境 |
| **LDAP** | 1993 | 目录服务 | 企业内部用户目录 |

---

## 3. SAML2 工作流程

```
SAML2 SSO 登录流程
│
├── 1. 用户访问 AI Stack → 未登录
├── 2. AI Stack (SP) 生成 AuthnRequest → 重定向到 IdP (Azure AD)
├── 3. 用户在 IdP 登录（企业账号密码/MFA）
├── 4. IdP 验证通过 → 生成 SAML Response（含 Assertion）
├── 5. IdP 将 Response POST 回 AI Stack (SP)
├── 6. AI Stack 验证签名 → 创建本地会话
└── 7. 用户获得 AI Stack 访问权限
```

### 核心概念

| 术语 | 角色 | 说明 |
|------|------|------|
| **SP** (Service Provider) | AI Stack | 提供服务的系统 |
| **IdP** (Identity Provider) | Azure AD / Okta | 验证用户身份的权威机构 |
| **Assertion** | 身份声明 | 包含用户身份信息的 XML 文档 |
| **Metadata** | 元数据交换 | SP 和 IdP 的配置信息交换 |

---

## 4. AI Stack 的 SSO 集成

AI Stack 支持通过 **AzureAD + SAML2** 实现企业 SSO：

| 特性 | 说明 |
|------|------|
| **协议** | SAML 2.0 |
| **IdP** | Azure Active Directory (Azure AD) |
| **认证方式** | 企业账户密码 + 可选 MFA |
| **会话管理** | 基于 SAML Assertion 的会话 |
| **权限映射** | SSO 用户映射到 AI Stack RBAC 角色 |

---

## 5. SSO vs 传统登录

| 维度 | 传统登录 | SSO |
|------|----------|-----|
| **密码数量** | 每系统一个 | 统一一个 |
| **安全风险** | 密码疲劳→弱密码 | 集中管理+MFA |
| **离职管控** | 需逐一禁用 | IdP 一键禁用 |
| **合规审计** | 分散日志 | 集中审计 |
| **用户体验** | 多次登录 | 一次登录 |
| **管理成本** | 高 | 低 |

---

## 6. 企业 SSO 最佳实践

| 关注点 | 建议 |
|--------|------|
| **MFA 强制** | 所有管理员角色必须启用多因素认证 |
| **会话超时** | SSO 会话设置合理超时（如 8 小时） |
| **权限映射** | SSO 组属性映射到 RBAC 角色 |
| **IdP 高可用** | IdP 故障时所有系统无法登录，需高可用部署 |
| **回退机制** | 保留本地管理员账户作为 IdP 故障时的应急通道 |

---

## 7. 局限与开放问题

1. **IdP 单点故障**：IdP 不可用时所有系统无法登录
2. **协议碎片化**：SAML/OAuth/OIDC 各有优劣，集成复杂
3. **零信任趋势**：SSO + 持续验证（MFA 步进认证）成为新范式
4. **国内 IdP**：国内企业常用的 IdP 方案（如 LDAP/统一认证）兼容性需验证

---

## Related

- [[_concepts/rbac]] — RBAC 访问控制（SSO 用户角色映射）
- [[_concepts/single-tenant-architecture]] — 单租户架构（安全体系）
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack（AzureAD SSO）
