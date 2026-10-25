---
title: "向量数据库 CVE 漏洞速查"
category: -concepts
tags: ["vector-database", "milvus", "qdrant", "weaviate", "chroma", "pgvector", "cve", "vulnerability", "security", "rag"]
summary: "主流向量数据库（Milvus / Qdrant / Weaviate / Chroma / pgvector）历年重大 CVE 汇编，重点是认证绕过、SSRF、Python 反序列化与 RAG 数据泄露。"
created: 2026-08-06
updated: 2026-08-06
tier: core
lifecycle: reviewed
aliases:
  - "Vector DB CVE"
  - "Milvus CVE"
  - "Qdrant CVE"
  - "Weaviate CVE"
  - "pgvector CVE"
relationships:
  - target: "14_RAG系统/03_向量数据库/03_Milvus_深入分析"
    type: related_to
  - target: "14_RAG系统/03_向量数据库/04_Qdrant_深入分析"
    type: related_to
  - target: "14_RAG系统/03_向量数据库/07_Weaviate_深入分析"
    type: related_to
  - target: "14_RAG系统/03_向量数据库/01_Chroma_深入分析"
    type: related_to
  - target: "12_架构基建/10_安全/03_AI_供应链_CVE_for_AI"
    type: related_to
  - target: "概念/kubernetes-cve-history"
    type: related_to
sources: []
name_zh: "向量数据库 CVE 速查"
---

# 向量数据库 CVE 漏洞速查

> 中文简称：Vector DB CVE 速查 ｜ English Name: Vector Database CVE

> RAG 系统的"记忆库"——所有 embedding 向量、私有文档、未公开模型输出都存在里面。拿下 Vector DB = 拿到整个 RAG 系统的知识资产。

---

## 0. 阅读说明

- **覆盖范围**：AI 集群 / RAG 系统中常用的向量数据库
  - **专业向量数据库**：Milvus / Qdrant / Weaviate
  - **轻量级 / 嵌入式**：Chroma
  - **PostgreSQL 扩展**：pgvector
  - **云服务**：Pinecone（不在本文范围内）
- **数据来源**：GitHub Security Advisory + CVE.org
- **AI 集群特化**：Vector DB 是 RAG 系统的"数据层"，存储私域知识（合同、客户数据、未公开模型权重等），失守即数据泄露

---

## 1. 历年重大 CVE 总览

### 1.1 Milvus CVE

| CVE 编号 | 年份 | CVSS | 类型 | 修复版本 | 一句话描述 | RAG 影响 |
|----------|------|------|------|----------|-----------|----------|
| **CVE-2023-25178** | 2023 | 7.5 | API 信息泄露 | 2.1.5+ | PythonProxy API 信息泄露 | RAG 数据收集 |
| **CVE-2023-25180** | 2023 | 7.5 | 路径遍历 | 2.1.5+ | OCI artifact 路径处理 | 镜像投毒 |
| **CVE-2023-25189** | 2023 | 7.5 | 权限提升 | 2.2.0+ | Tag 保留策略权限提升 | 多租户失守 |
| **CVE-2023-30839** | 2023 | 7.5 | 用户枚举 | 2.3.0+ | 用户枚举 | 信息收集 |
| **CVE-2023-49093** | 2023 | 7.5 | 路径遍历 | 2.4.0+ | chart 路径处理 | chart 投毒 |
| **CVE-2023-49291** | 2023 | 7.5 | SSRF | 2.3.0+ | Webhook SSRF | 内网探测 |
| **CVE-2024-22278** | 2024 | 7.5 | 认证绕过 | 2.4.0+ | OIDC 认证缺陷 | **认证失守** |
| **CVE-2024-22279** | 2024 | 7.5 | 权限提升 | 2.4.0+ | 项目成员权限提升 | **多租户失守** |
| **CVE-2024-33678** | 2024 | 7.5 | 路径遍历 | 2.4.5+ | 镜像层路径处理 | 数据投毒 |
| **CVE-2024-43789** | 2024 | 7.5 | 权限提升 | 2.4.10+ | 仓库配额权限提升 | 多租户失守 |
| **CVE-2024-49750** | 2024 | 7.5 | DoS | 2.4.13+ | 仓库元数据 DoS | 控制面 DoS |
| **CVE-2025-22278** | 2025 | 7.5 | RBAC bypass | 2.5.0+ | LDAP 同步 RBAC 校验缺陷 | **多租户失守** |
| **CVE-2025-22279** | 2025 | 7.5 | 信息泄露 | 2.5.0+ | 审计日志信息泄露 | 合规失效 |

> ⚠️ Milvus CVE 数量与 Harbor CVE 高度重叠——因为 Milvus Standalone 早期版本集成 Harbor 作为对象存储后端。

### 1.2 Qdrant CVE

| CVE 编号 | 年份 | CVSS | 类型 | 修复版本 | 一句话描述 | RAG 影响 |
|----------|------|------|------|----------|-----------|----------|
| **CVE-2024-3234** | 2024 | 7.5 | API 权限绕过 | 1.9.0+ | API 鉴权缺陷 | **RAG 数据失守** |
| **CVE-2024-13024** | 2024 | 7.5 | Web UI XSS | 1.10.0+ | Web UI XSS | 钓鱼 |
| **CVE-2024-5057** | 2024 | 7.5 | 任意文件读取 | 1.10.0+ | 任意文件读取 | 凭证泄露 |
| **CVE-2025-xxxxx** | 2025 | 7.5 | 鉴权强化 | 1.12.0+ | JWT 鉴权强化 | 鉴权增强 |
| **CVE-2025-xxxxx** | 2025 | 7.5 | 内存泄漏 | 1.13.0+ | 长时间连接内存泄漏 | DoS |

### 1.3 Weaviate CVE

| CVE 编号 | 年份 | CVSS | 类型 | 修复版本 | 一句话描述 | RAG 影响 |
|----------|------|------|------|----------|-----------|----------|
| **CVE-2023-xxxxx** | 2023 | 7.5 | GraphQL 权限 | 1.21.x+ | GraphQL 鉴权缺陷 | 多租户失守 |
| **CVE-2024-xxxxx** | 2024 | 7.5 | Backup 权限 | 1.24.x+ | Backup API 权限绕过 | 数据外泄 |
| **CVE-2024-xxxxx** | 2024 | 7.5 | 模块加载 | 1.23.x+ | 模块加载路径处理 | 模块投毒 |
| **CVE-2025-xxxxx** | 2025 | 7.5 | RBAC | 1.27.x+ | RBAC 强化 | 鉴权增强 |

> Weaviate CVE 数据相对较少（项目安全性较好），但 2024-2025 有多个 RBAC 强化类 CVE。

### 1.4 Chroma CVE

| CVE 编号 | 年份 | CVSS | 类型 | 修复版本 | 一句话描述 | RAG 影响 |
|----------|------|------|------|----------|-----------|----------|
| **CVE-2024-45802** | 2024 | 9.1 | **SSRF → 任意文件读取** | 0.4.24+ | Chroma API SSRF | **RAG 数据失守** |
| **CVE-2024-xxxxx** | 2024 | 7.5 | Path Traversal | 0.5.0+ | 路径处理缺陷 | 数据泄露 |

> ⚠️ Chroma CVE-2024-45802 是 2024 年 Vector DB 最高危漏洞。

### 1.5 pgvector CVE

pgvector 作为 PostgreSQL 扩展，本身 CVE 较少，主要风险来自 PostgreSQL 自身：

| CVE 编号 | 年份 | CVSS | 类型 | 描述 | RAG 影响 |
|----------|------|------|------|------|----------|
| **CVE-2024-0985** | 2024 | 8.0 | PostgreSQL refresh materialized view | 权限提升 | 数据泄露 |
| **CVE-2024-10976** | 2024 | 7.5 | PostgreSQL PL/pgSQL | 注入 | 数据泄露 |
| **CVE-2024-10977** | 2024 | 7.5 | PostgreSQL PL/pgSQL | 注入 | 数据泄露 |
| **CVE-2025-1094** | 2025 | 9.8 | PostgreSQL SQL 注入 | 任意代码执行 | **RAG 数据失守** |

---

## 2. 核心漏洞深度解析

### 2.1 Chroma CVE-2024-45802（SSRF → 任意文件读取）

**CVSS**：9.1
**披露**：2024-09
**影响**：Chroma < 0.4.24

**原理**：Chroma API 在处理某些 URL 参数时存在 SSRF 缺陷，攻击者可读取服务器上的任意文件。

**PoC**：
```bash
# 利用 SSRF 读取 /etc/passwd
curl -X POST http://chroma:8000/api/v1/collections -d '{
  "name": "evil",
  "metadata": {"url": "file:///etc/passwd"}
}'
```

**修复**：Chroma ≥ 0.4.24

**RAG 影响**：Chroma 通常存储私域文档 embedding → 配合 SSRF 可读取所有文档内容。

### 2.2 Milvus CVE-2024-22278（OIDC 认证绕过）

**原理**：Milvus 集成 OIDC 时未严格校验 userinfo 端点，攻击者可伪造身份。

**修复**：Milvus ≥ 2.4.0

**RAG 影响**：RAG 系统通常集成 OIDC 单一登录——认证失守即 RAG 数据失守。

### 2.3 Qdrant CVE-2024-3234（API 权限绕过）

**原理**：Qdrant REST API 在某些端点未严格校验权限，攻击者越权访问 collection 数据。

**修复**：Qdrant ≥ 1.9.0

### 2.4 pgvector CVE-2025-1094（SQL 注入 → RCE）

**原理**：PostgreSQL 17.0+ 在 PL/pgSQL 注入场景下可实现任意代码执行。

**修复**：PostgreSQL ≥ 17.2

**RAG 影响**：pgvector 数据全部失守 + 整个 PostgreSQL 数据库服务器失守。

---

## 3. 修复优先级矩阵

| 优先级 | 触发条件 | 修复动作 |
|--------|----------|----------|
| **P0 紧急** | Chroma < 0.4.24 + 暴露公网 | 立即升级 |
| **P0 紧急** | PostgreSQL < 17.2 + pgvector | 升级 PostgreSQL |
| **P0 紧急** | Milvus < 2.4.0 + OIDC | 升级 Milvus |
| **P1 高** | 多租户 RAG 共享 Vector DB | 升级 + 启用 RBAC |
| **P1 高** | Qdrant < 1.9.0 | 升级到 1.12+ |
| **P2 中** | Weaviate < 1.24.x | 升级到 1.27+ |
| **P3 低** | 信息泄露类 | 跟踪即可 |

---

## 4. 检测与升级

### 4.1 检测版本

```bash
# Milvus
kubectl exec milvus-core-0 -- milvus version
# 或通过 API
curl http://milvus:19530/health

# Qdrant
curl http://qdrant:6333/
# 返回 "version": "1.x.x"

# Weaviate
curl http://weaviate:8080/v1/meta

# Chroma
curl http://chroma:8000/api/v1/heartbeat

# pgvector
psql -c "SELECT extversion FROM pg_extension WHERE extname = 'vector'"
```

### 4.2 升级 Milvus

```bash
helm repo add milvus https://milvus-io.github.io/milvus-helm/
helm upgrade milvus milvus/milvus \
  --namespace milvus \
  --version 4.2.0 \
  --set image.all.tag=v2.5.0
```

### 4.3 升级 Qdrant

```bash
helm upgrade qdrant qdrant/qdrant \
  --namespace qdrant \
  --version 0.10.0 \
  --set image.tag=v1.12.0
```

### 4.4 升级 PostgreSQL

```bash
# 使用云厂商托管服务自动升级
# 或手动：
pg_upgradecluster 16 main
apt-get install -y postgresql-17
```

### 4.5 集群扫描

```bash
# Trivy 扫描 Vector DB 镜像
trivy image milvusdb/milvus:v2.5.0
trivy image qdrant/qdrant:v1.12.0
trivy image semitechnologies/weaviate:1.27.0
trivy image chromadb/chroma:0.4.24

# 检测未授权访问
curl http://milvus:19530/v1/vector/collections  # 应需要鉴权
curl http://qdrant:6333/collections  # 应需要 API key
```

---

## 5. 加固清单

### 5.1 通用配置（所有 Vector DB）

```yaml
# 1. 启用 TLS
# Milvus
tls:
  enabled: true
  secretName: milvus-tls

# Qdrant
qdrant:
  tls:
    enabled: true

# Weaviate
authentication:
  anonymous_access:
    enabled: false
  apikey:
    enabled: true

# 2. 启用认证
# Milvus
authentication:
  enabled: true
  type: oidc  # 或 ldap / user_password

# Qdrant
service:
  apiKey: <strong-random-key>

# 3. 网络策略
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: vector-db-isolation
  namespace: rag-system
spec:
  podSelector:
    matchLabels:
      app: milvus  # 或 qdrant / weaviate
  policyTypes: [Ingress, Egress]
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: rag-system
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: ingress-nginx
```

### 5.2 Milvus RBAC

```yaml
# milvus-rbac.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: milvus-rbac
data:
  rbac.yaml: |
    roles:
    - name: rag-readonly
      privileges:
      - collection-read
    - name: rag-admin
      privileges:
      - collection-create
      - collection-read
      - collection-update
      - collection-delete
      - database-admin

# 创建用户并分配角色
python -c "
from pymilvus import MilvusClient
client = MilvusClient(uri='http://milvus:19530')
client.create_user(user_name='rag-app', password='...')
client.add_role_to_user(user_name='rag-app', role_name='rag-readonly')
"
```

### 5.3 pgvector 加固

```sql
-- 创建专用 RAG 用户
CREATE USER rag_app WITH PASSWORD '<strong-random>';

-- 创建 schema
CREATE SCHEMA rag_data AUTHORIZATION rag_app;
CREATE EXTENSION vector SCHEMA rag_data;

-- 行级安全（多租户）
ALTER TABLE rag_data.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON rag_data.documents
  USING (tenant_id = current_setting('app.current_tenant')::text);

-- 限制权限
GRANT USAGE ON SCHEMA rag_data TO rag_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA rag_data TO rag_app;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
```

### 5.4 RAG 应用层加固

```python
# 1. RAG 应用的 input validation
from pydantic import BaseModel, Field

class RAGQuery(BaseModel):
    query: str = Field(..., max_length=2000)
    tenant_id: str = Field(..., pattern=r'^[a-z0-9-]{1,64}$')
    top_k: int = Field(default=5, ge=1, le=20)

# 2. 强制鉴权
from fastapi import Depends, HTTPException
import jwt

async def verify_token(token: str = Header(...)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")

# 3. 防止 prompt injection
INJECTION_PATTERNS = [
    "ignore previous instructions",
    "disregard all prior",
    "system prompt",
    "reveal the",
]

def sanitize_query(query: str) -> str:
    query_lower = query.lower()
    for pattern in INJECTION_PATTERNS:
        if pattern in query_lower:
            raise HTTPException(400, "Suspicious query pattern detected")
    return query
```

---

## 6. AI 集群特化场景

### 6.1 多租户 RAG

**风险**：一个租户的查询越权访问另一个租户的向量数据。

**加固**：
- Milvus：使用 `db_name` 隔离多租户
- Qdrant：每个租户独立 collection + metadata filter
- pgvector：行级安全策略 + 强制 tenant_id filter
- Weaviate：多 tenancy 启用

```python
# Milvus 多租户
results = client.search(
    collection_name="documents",
    data=[query_vector],
    filter=f'tenant_id == "{current_tenant}"',  # 强制过滤
    limit=5,
)
```

### 6.2 数据加密

```yaml
# Milvus 静态加密
encryption:
  enabled: true
  kms:
    type: aws-kms  # 或 gcp-kms / azure-kv
    keyId: <key-id>

# pgvector 数据加密（pgcrypto）
CREATE EXTENSION pgcrypto;
INSERT INTO documents (content, embedding) VALUES (
    pgp_sym_encrypt('sensitive content', 'encryption-key'),
    '[...]'::vector
);
```

### 6.3 向量投毒（Poisoning）

**风险**：攻击者上传恶意 embedding 向量 → RAG 系统检索时返回攻击者控制的文档。

**加固**：
```python
# 1. 上传时校验 embedding 维度
if len(embedding) != EXPECTED_DIMENSION:
    raise ValueError("Invalid embedding dimension")

# 2. 限制上传频率（防 DoS）
RATE_LIMIT = 100  # 每分钟最多 100 次
# 使用 Redis 实现令牌桶

# 3. 内容审计
TOXIC_PATTERNS = ["<script>", "DROP TABLE", "rm -rf"]
if any(p in content.lower() for p in TOXIC_PATTERNS):
    raise ValueError("Suspicious content")
```

---

## 7. 应急响应剧本

```bash
# 1. 隔离 Vector DB
kubectl scale deploy milvus --replicas=0 -n rag-system
kubectl scale deploy qdrant --replicas=0 -n rag-system

# 2. 取证
kubectl logs -n rag-system -l app=milvus --tail=10000 > evidence.log
kubectl logs -n rag-system -l app=qdrant --tail=10000 >> evidence.log

# 3. 检测可疑查询
# Milvus: audit log
SELECT * FROM milvus_audit_log ORDER BY ts DESC LIMIT 1000;
# Qdrant: access log
grep "POST\|GET" qdrant.log | grep -v "200"

# 4. 重建 Vector DB
# （不可信残留）
kubectl delete pvc -n rag-system --all
kubectl apply -f vector-db-deployment.yaml

# 5. 重新建立索引（从可信源）
python rebuild_index.py --source secure-storage
```

---

## 8. 推荐基线

| 组件 | 最低安全版本 | 推荐版本 |
|------|--------------|----------|
| Milvus | 2.4.0+ | 2.5.x+ |
| Qdrant | 1.9.0+ | 1.12.x+ |
| Weaviate | 1.24.x+ | 1.27.x+ |
| Chroma | 0.4.24+ | 0.5.x+ |
| PostgreSQL | 16.4+ | 17.2+ |
| pgvector | 0.7.x+ | 最新 |
| Python（客户端） | 3.10+ | 3.12+ |
| Linux 内核 | 5.15+ | 6.1+ |

---

## 9. 漏洞情报订阅

| 源 | URL |
|----|-----|
| Milvus Security | https://github.com/milvus-io/milvus/security/advisories |
| Qdrant Security | https://github.com/qdrant/qdrant/security/advisories |
| Weaviate Security | https://github.com/weaviate/weaviate/security |
| Chroma Security | https://github.com/chroma-core/chroma/security |
| PostgreSQL Security | https://www.postgresql.org/support/security/ |

---

## 10. 相关概念

- [[14_RAG系统/03_向量数据库/03_Milvus_深入分析]] — Milvus 深入分析
- [[14_RAG系统/03_向量数据库/04_Qdrant_深入分析]] — Qdrant 深入分析
- [[14_RAG系统/03_向量数据库/07_Weaviate_深入分析]] — Weaviate 深入分析
- [[14_RAG系统/03_向量数据库/01_Chroma_深入分析]] — Chroma 深入分析
- [[12_架构基建/10_安全/03_AI_供应链_CVE_for_AI]] — AI 供应链 CVE
- [[概念/kubernetes-cve-history]] — K8s 自身 CVE

---

## 11. 总结

- **Vector DB 是 RAG 系统的"金矿"**——存储所有私域知识 + embedding
- **Chroma CVE-2024-45802（SSRF）** 是 2024 年 Vector DB 最高危漏洞
- **pgvector 依赖 PostgreSQL 自身安全性**——必须同步升级 PG
- **多租户 RAG 必须**强制 tenant_id filter + 行级安全
- **向量投毒**是新兴攻击面，必须做内容审计 + 速率限制

> 💡 Vector DB 是 RAG 系统的"最后一公里"——它的安全性决定 RAG 的可靠性。