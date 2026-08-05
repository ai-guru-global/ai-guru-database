---
title: "单租户架构 (Single-Tenant Architecture)"
category: -concepts
tags: ["single-tenant", "multi-tenant", "isolation", "security", "private-deployment", "saas"]
relationships:
  - target: "概念/rbac"
    type: related_to
  - target: "概念/ai-architecture"
    type: belongs_to
  - target: "概念/model-gateway"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "单租户架构将所有硬件资源与软件服务栈归属单一用户，提供物理级隔离。AI Stack 采用此架构保障政企数据安全，与 SaaS 多租户架构形成对比。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
name_zh: "单租户架构"
---

# 单租户架构 (Single-Tenant Architecture)

> 中文简称：单租户架构

> 独门独院 vs 合租公寓——数据安全的第一道防线。

---

## 1. 定义

**单租户架构**（Single-Tenant）是将整套软硬件资源完全归属单一用户/组织的设计模式。与之对应的**多租户架构**（Multi-Tenant）在同一套基础设施上服务多个独立用户，通过逻辑隔离实现资源复用。

---

## 2. 单租户 vs 多租户对比

| 维度 | 单租户 (Single-Tenant) | 多租户 (Multi-Tenant) |
|------|----------------------|---------------------|
| **资源隔离** | 物理隔离（独享） | 逻辑隔离（共享） |
| **数据安全** | 最高（数据不共硬件） | 中（依赖隔离实现质量） |
| **成本** | 高（资源不可复用） | 低（资源共享摊薄） |
| **定制化** | 完全可控 | 受限（需兼容多租户） |
| **运维复杂度** | 低（单用户管理） | 高（多用户隔离管理） |
| **弹性扩展** | 有限（物理上限） | 高（动态分配） |
| **部署周期** | 天/周级 | 分钟级 |
| **合规性** | 易满足（数据完全隔离） | 需额外证明（隔离有效性） |

---

## 3. AI Stack 单租户架构

AI Stack 采用单租户架构，所有硬件资源与软件服务栈归属单一用户：

```
AI Stack 单租户架构
│
├── 硬件层：独享 GPU/CPU/存储/网络（不与其他用户共享）
├── 数据层：数据完全本地化（不出物理边界）
├── 服务层：独立的管理平面、API 网关、模型服务
└── 管理层：RBAC 四角色权限体系（三权分立）
```

**设计考量**：
- 面向**政企客户**，数据安全是第一优先级
- 部署在**物理隔离内网**，不暴露互联网
- 满足行业**数据主权和隐私监管**要求
- 客户对资源有**完全控制权**

---

## 4. 架构选型场景

| 场景 | 推荐架构 | 原因 |
|------|----------|------|
| **政务/军工** | 单租户 | 数据主权、合规要求 |
| **金融核心系统** | 单租户 | 数据隔离、性能可预测 |
| **医疗数据** | 单租户 | 隐私法规（HIPAA 等） |
| **企业内部 AI 平台** | 单租户或多租户 | 取决于安全要求 |
| **SaaS AI 服务** | 多租户 | 成本效率、弹性扩展 |
| **公有云 AI 推理** | 多租户 | 大规模资源池化 |

---

## 5. 单租户架构中的内部多用户

单租户 ≠ 单用户。AI Stack 在单租户内部通过 RBAC 实现多用户管理：

| 角色 | 权限范围 |
|------|----------|
| **管理员** | 系统管理、部署服务 |
| **安全管理员** | 用户管理、安全策略 |
| **审计管理员** | 日志审计、操作追踪 |
| **应用管理员** | 使用服务、查看模型 |

---

## 6. 局限与开放问题

1. **资源利用率**：低峰期 GPU 闲置率高（~13%）
2. **成本**：每用户一套完整硬件，TCO 高
3. **弹性受限**：无法动态借用其他租户的闲置算力
4. **运维分散**：每个租户实例需独立运维和升级
5. **混合趋势**：部分场景采用"单租户数据 + 多租户算力"混合架构

---

## Related

- [[概念/rbac]] — RBAC 访问控制（单租户内部权限管理）
- [[概念/ai-architecture]] — AI 架构（架构选型）
- [[概念/model-gateway]] — 模型网关（单租户 API 管理）
- [[12_架构基建/03_AI技术栈/02_AI技术栈_深入分析]] — AI Stack（单租户实现）

---

## 2026 单租户架构生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **专属 GPU 集群** | 客户独占 GPU 资源，数据不出域 | GA |
| **VPC 私有部署** | 在客户 VPC 内部署完整 AI 栈 | GA |
| **模型隔离** | 每个租户独立模型实例，避免资源争抢 | GA |
| **合规审计** | 满足金融/医疗/政务行业数据主权要求 | GA |
| **混合云单租** | 公有云控制面 + 私有数据面混合架构 | 研究 |

## 生产最佳实践

1. **资源隔离**：使用 Kubernetes Namespace + ResourceQuota 实现硬隔离
2. **网络策略**：NetworkPolicy 限制租户间网络通信，默认拒绝所有跨租户流量
3. **密钥管理**：每个租户独立加密密钥，使用 Vault/KMS 管理
4. **成本透明**：按租户维度计量 GPU/存储/网络资源，提供账单明细
5. **运维自动化**：单租户不代表手动运维，仍需 GitOps + 自动化巡检

## 单租户部署架构示例

```yaml
# Kubernetes 单租户命名空间配置
apiVersion: v1
kind: Namespace
metadata:
  name: tenant-acme-corp
  labels:
    tenant: acme-corp
    isolation: dedicated
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: acme-quota
  namespace: tenant-acme-corp
spec:
  hard:
    nvidia.com/gpu: "8"
    memory: 128Gi
    cpu: "64"
    persistentvolumeclaims: "10"
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-cross-tenant
  namespace: tenant-acme-corp
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              tenant: acme-corp
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              tenant: acme-corp
```

## 单租户 vs 多租户 vs 混合模式对比

| 维度 | 单租户 | 多租户 | 混合模式 |
|------|--------|--------|----------|
| 数据隔离 | 物理隔离 | 逻辑隔离 | 分层隔离 |
| 资源利用率 | 低（30-50%） | 高（70-90%） | 中（50-70%） |
| 合规性 | 最强 | 需额外措施 | 强 |
| 成本 | 高 | 低 | 中 |
| 运维复杂度 | 高（N套环境） | 低 | 中 |
| 适用客户 | 金融/医疗/政务 | SaaS/中小企业 | 大型企业 |
| 定制化 | 完全自定义 | 受限 | 部分自定义 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| GPU 利用率低 | 专属资源无法共享 | 分时复用 + 弹性池化 |
| 运维成本高 | 每租户独立环境 | GitOps 统一编排 + 自动化巡检 |
| 版本升级困难 | 多环境并行维护 | 蓝绿部署 + 统一镜像仓库 |
| 成本不透明 | 缺乏计量体系 | 按租户维度资源计量 + 账单系统 |
| 安全审计复杂 | 分散的日志和配置 | 统一审计平台 + 合规扫描 |

## 生产检查清单

1. ✅ 租户间网络完全隔离（NetworkPolicy 默认拒绝）
2. ✅ 独立加密密钥（KMS/Vault 每租户独立）
3. ✅ 资源配额硬限制（ResourceQuota + LimitRange）
4. ✅ 数据不出域（存储加密 + 传输 TLS 1.3）
5. ✅ 审计日志完整（操作日志保留 ≥ 180 天）
6. ✅ 自动化备份和灾难恢复（RPO < 1h, RTO < 4h）
7. ✅ 定期合规扫描（CIS Benchmark + 行业规范）

## 总结

单租户架构是金融、医疗、政务等强监管行业的必然选择，通过物理隔离、专属资源和独立密钥管理满足最严格的数据主权要求。代价是资源利用率低和运维复杂度高，需要通过自动化和标准化来缓解。

> 💡 单租户不等于“手工运维”——恰恰相反，多套环境的并行维护更需要 GitOps、自动化测试和统一编排来保证一致性。
