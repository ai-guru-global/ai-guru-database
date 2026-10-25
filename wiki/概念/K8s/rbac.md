---
title: "RBAC 基于角色的访问控制"
category: -concepts
tags: ["rbac", "access-control", "security", "authentication", "authorization", "multi-tenant"]
relationships:
  - target: "概念/ai-architecture"
    type: related_to
  - target: "概念/model-gateway"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "RBAC 通过角色-权限映射实现访问控制，遵循最小权限原则。AI Stack 采用三权分立（管理员/安全管理员/审计管理员）的 RBAC 架构。"
provenance:
  extracted: 0.60
  inferred: 0.30
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-04
updated: 2026-07-21
aliases:
  - Rbac

name_zh: "RBAC 基于角色的访问控制"
---
# RBAC 基于角色的访问控制 (Role-Based Access Control)

> 中文简称：RBAC 基于角色的访问控制

> 不给任何人多余的权限——安全架构的基石。

---

## 1. 定义

**RBAC**（Role-Based Access Control）是一种访问控制模型，通过**角色**作为用户和权限之间的中间层，将权限授予角色而非直接授予用户。

```
传统 DAC: 用户 → 权限（直接关联，难以管理）
RBAC:    用户 → 角色 → 权限（通过角色间接关联，易管理）
```

---

## 2. RBAC 核心模型

| 级别 | 名称 | 特点 |
|------|------|------|
| **RBAC0** | 基础 RBAC | 用户-角色-权限基本模型 |
| **RBAC1** | 角色层次 | 角色可继承（管理员 > 操作员 > 用户） |
| **RBAC2** | 约束 RBAC | 职责分离（SoD）、基数约束 |
| **RBAC3** | 完整 RBAC | RBAC1 + RBAC2 的组合 |

### RBAC vs 其他模型

| 模型 | 粒度 | 管理复杂度 | 适用场景 |
|------|------|-----------|----------|
| **DAC** (自主访问控制) | 对象级 | 低 | 个人文件系统 |
| **MAC** (强制访问控制) | 安全标签级 | 高 | 军事/政府 |
| **RBAC** | 角色级 | 中 | 企业应用 |
| **ABAC** (属性访问控制) | 属性级 | 高 | 动态策略（AWS IAM） |

---

## 3. AI Stack 的 RBAC 架构

AI Stack 采用**单租户 + 三权分立**的 RBAC 设计：

### 3.1 三权分立原则

| 角色 | 职责 | 制衡关系 |
|------|------|----------|
| **管理员** | 系统管理、服务部署 | 可被安全管理员禁用 |
| **安全管理员** | 用户管理、安全策略 | 不可被管理员删除 |
| **审计管理员** | 日志审计、操作追踪 | 不可被删除，独立监督 |
| **应用管理员** | 使用服务、查看模型 | 受限访问 |

### 3.2 权限矩阵

| 操作 | 管理员 | 安全管理员 | 审计管理员 | 应用管理员 |
|------|--------|-----------|-----------|-----------|
| 远程登录 | ✅ | ❌ | ❌ | ❌ |
| 提交镜像 | ✅ | ❌ | ❌ | ❌ |
| 部署在线服务 | ✅ | ❌ | ❌ | ❌ |
| 创建/管理用户 | ✅ | ✅ | ❌ | ❌ |
| 禁用管理员 | ❌ | ✅ | ❌ | ❌ |
| 查看审计日志 | ❌ | ❌ | ✅ | ❌ |
| 使用运行中服务 | ✅ | ❌ | ❌ | ✅ |

---

## 4. AI Stack 安全架构全景

```
AI Stack 安全分层
│
├── 网络层
│   ├── 物理隔离内网（不暴露互联网）
│   ├── 端口范围控制（30000-35000 服务端口）
│   └── 网络安全规则（最小暴露原则）
│
├── 认证层
│   ├── RBAC 四角色权限体系
│   ├── API-Key 鉴权（模型网关）
│   ├── SAML2 SSO（AzureAD 集成）
│   └── 操作日志审计
│
├── 数据层
│   ├── 单租户架构（数据完全隔离）
│   ├── 本地化存储（数据不出域）
│   └── 加密传输（HTTPS/TLS）
│
└── 应用层
    ├── 内容审核（模型输入输出安全检查）
    ├── PII 过滤（个人身份信息脱敏）
    └── 安全规则（主机暴露最小化）
```

---

## 5. 企业 AI 平台 RBAC 最佳实践

| 原则 | 说明 |
|------|------|
| **最小权限** | 每个角色只拥有完成工作所需的最少权限 |
| **职责分离** | 关键操作需要多角色协作 |
| **不可删除角色** | 安全和审计角色一经创建无法删除 |
| **定期审计** | 审计管理员定期检查权限分配和操作日志 |
| **SSO 集成** | 支持 AzureAD/SAML2 等企业级认证 |
| **API-Key 管理** | 密钥创建后不可查看，仅能重新生成 |

---

## 6. 局限与开放问题

1. **角色爆炸**：角色过多导致管理复杂，需定期清理
2. **临时权限**：RBAC 不擅长处理临时提权需求（需 ABAC 补充）
3. **细粒度控制**：行级/列级数据权限超出 RBAC 能力范围
4. **多租户**：SaaS 场景需要租户级隔离 + RBAC 双层模型

---

## Related

- [[概念/ai-architecture]] — AI 架构（安全架构）
- [[概念/model-gateway]] — 模型网关（API-Key 鉴权）
- [[12_架构基建/03_AI技术栈/02_AI技术栈_深入分析]] — AI Stack（RBAC 实现）
- [[概念/model-serving]] — 模型服务（多租户安全）

---

## 2026 RBAC 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **ValidatingAdmissionPolicy (CEL)** | 用 CEL 表达式在准入阶段校验 RBAC 配置合规性 | GA |
| **SSZ (Static Authorization)** | K8s 1.31+ 静态授权策略文件，无需 API Server 重启 | Beta |
| **kubectl auth can-i --list** | 一键列出 Subject 全部有效权限，审计利器 | GA |
| **Kyverno/OPA 策略审计** | 自动检测过度授权的 RoleBinding/ClusterRoleBinding | GA |
| **Workload Identity** | 将 K8s SA 映射到云 IAM，统一身份管理 | GA |

## 生产最佳实践

1. **最小权限原则**：仅授予完成工作所需的 verbs/resources，避免 `*` 通配符
2. **三权分立**：管理员/安全管理员/审计管理员角色分离，相互制衡
3. **定期权限审计**：使用 `kubectl auth can-i --list` 或 Kyverno 策略定期扫描过度授权
4. **SSO 集成**：企业环境集成 AzureAD/SAML2/OIDC，避免本地账号管理
5. **API-Key 安全**：密钥创建后不可查看，仅能重新生成，定期轮换

## RBAC 核心对象

| 对象 | 作用域 | 说明 |
|------|------|------|
| Role | Namespace | 命名空间内权限 |
| ClusterRole | Cluster | 集群级权限 |
| RoleBinding | Namespace | 绑定 Role 到用户 |
| ClusterRoleBinding | Cluster | 绑定 ClusterRole |
| ServiceAccount | Namespace | Pod 身份标识 |

## 常见 RBAC 配置示例

```yaml
# 只读 Pod 权限
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: jane
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

## 权限审计命令

| 命令 | 用途 |
|------|------|
| `kubectl auth can-i --list` | 查看当前用户权限 |
| `kubectl auth can-i create pods` | 检查特定权限 |
| `kubectl get clusterrolebindings` | 查看集群绑定 |
| `kubectl get rolebindings -A` | 查看所有命名空间绑定 |

> 💡 RBAC 是 K8s 安全的基石，2026 年生产环境必须启用 RBAC + 最小权限 + 定期审计。
