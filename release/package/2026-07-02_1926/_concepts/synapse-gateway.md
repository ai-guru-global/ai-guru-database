---
title: "Synapse 模型网关 (Synapse Model Gateway)"
category: -concepts
tags: ["synapse", "model-gateway", "ai-stack", "load-balancing", "api-key", "traffic-routing"]
relationships:
  - target: "_concepts/model-gateway"
    type: builds_on
  - target: "_concepts/a-speed"
    type: related_to
  - target: "_concepts/rbac"
    type: related_to
  - target: "_concepts/single-tenant-architecture"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Synapse 是 AI Stack 内置模型网关的代号，提供推理服务负载均衡（轮询/IP哈希/最少连接/随机）和 API-Key 鉴权，是 AI Stack 流量调度的核心组件。"
provenance:
  extracted: 0.75
  inferred: 0.20
  ambiguous: 0.05
base_confidence: 0.90
lifecycle: reviewed
tier: core
---

# Synapse 模型网关

> **一句话理解**: Synapse 是 AI Stack 的"流量调度员"——所有推理请求都经过它分发到后端模型实例，提供负载均衡和 API 鉴权。

---

## 1. 定位

Synapse 是 AI Stack **内置模型网关**的产品代号（非开源项目），位于用户请求和推理服务之间：

```
用户请求流
│
├── 控制台 UI / API 调用
│
├── Synapse 模型网关 ← 本文
│   ├── 负载均衡
│   ├── API-Key 鉴权
│   └── 流量路由
│
└── 推理服务实例
    ├── A-Speed 加速实例 1
    ├── A-Speed 加速实例 2
    └── A-Speed 加速实例 N
```

---

## 2. 核心功能

### 2.1 负载均衡策略

| 策略 | 原理 | 适用场景 |
|------|------|----------|
| **轮询 (Round Robin)** | 依次分配请求到各实例 | 实例性能均匀时默认选择 |
| **IP 哈希 (IP Hash)** | 根据客户端 IP 固定分配 | 需要会话粘性时 |
| **最少连接 (Least Connections)** | 分配给当前连接最少的实例 | 请求处理时间差异大时 |
| **随机 (Random)** | 随机选择实例 | 简单场景 |

### 2.2 API-Key 鉴权

| 特性 | 说明 |
|------|------|
| **创建** | 通过控制台创建 API-Key |
| **不可逆** | 创建后不可关闭鉴权 |
| **权限范围** | 绑定到特定用户/空间 |
| **安全策略** | 建议仅在信任网络中使用 |

### 2.3 单机/多机隔离

| 特性 | 说明 |
|------|------|
| **单机版网关** | 仅管理本机推理服务 |
| **多机版网关** | 管理集群内所有节点的推理服务 |
| **互不可见** | 单机版和多机版网关信息隔离 |

---

## 3. 与通用模型网关的关系

Synapse 是 AI Stack 专属实现，与通用模型网关的关系：

| 维度 | Synapse (AI Stack) | LiteLLM | Kong AI Gateway |
|------|-------------------|---------|-----------------|
| **定位** | AI Stack 内置 | 通用 LLM 代理 | API 网关 + AI 插件 |
| **部署** | AI Stack 自带 | 独立部署 | 独立部署 |
| **模型支持** | AI Stack 预置模型 | 100+ LLM 提供商 | 通用 |
| **负载均衡** | 4 种策略 | 多策略 | 高级路由 |
| **鉴权** | API-Key | API-Key / OAuth | 完整鉴权 |
| **可观测性** | AI Stack 控制台 | LiteLLM 仪表盘 | Kong 仪表盘 |
| **开源** | 否（专有） | MIT | Apache 2.0 |

> 详见 [[_concepts/model-gateway]]

---

## 4. 在 AI Stack 功能架构中的位置

```
AI Stack 功能架构
│
├── 控制台页面（上层）
│   └── 用户操作入口
│
├── 管控层（中层）
│   ├── Synapse 模型网关 ← 流量入口
│   ├── 鉴权服务
│   ├── 监控告警
│   └── 服务生命周期调度
│
└── 资源层（下层）
    ├── GPU 资源池
    ├── 模型存储
    └── containerd 容器实例
```

---

## 5. API 调用示例

```bash
# 通过 Synapse 网关调用推理服务
curl -X POST http://<ai-stack-ip>:<gateway-port>/v1/chat/completions \
  -H "Authorization: Bearer <api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3-pro-instruct",
    "messages": [{"role": "user", "content": "你好"}],
    "max_tokens": 512
  }'
```

---

## 6. 运维要点

| 关注点 | 说明 |
|--------|------|
| **端口范围** | 30000-35000（从外到内） |
| **安全控制** | 开启 Token 认证，建议信任网络使用 |
| **监控** | 通过 AI Stack 模型观测查看 Token 消耗、首 Token 延时、并发数据 |
| **扩容** | 新增推理实例后网关自动纳管 |

---

## Related

- [[_concepts/model-gateway]] — 模型网关全景（LiteLLM/Kong AI/Synapse）
- [[_concepts/a-speed]] — A-Speed 加速推理
- [[_concepts/rbac]] — RBAC 访问控制
- [[_concepts/single-tenant-architecture]] — 单租户架构
- [[_concepts/model-serving]] — 模型服务
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
