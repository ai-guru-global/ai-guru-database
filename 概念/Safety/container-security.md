---
title: "Container Security"
category: -concepts
tags: ["security", "container", "kubernetes", "k8s", "alibaba-cloud"]
summary: "Container Security（容器安全）是保护容器镜像、运行时、网络和供应链免受攻击的安全实践。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "容器安全"
relationships:
  - target: "概念/runtime-security"
    type: part_of
  - target: "概念/supply-chain-security"
    type: related_to
sources: []
---

# Container Security

> **一句话理解**: 容器安全就是确保你的 Docker/K8s 镜像没漏洞、运行时跑在非 root、网络只开放必要的端口。

## 核心要点

- **镜像安全**: 最小化基础镜像、漏洞扫描、签名
- **运行时安全**: 非 root、只读 rootfs、capabilities 限制
- **网络安全**: NetworkPolicy、Ingress 控制
- **Secret 安全**: KMS、SealedSecret、外部 secret 管理
- **监控**: 异常行为检测

## 最佳实践

```yaml
securityContext:
  runAsNonRoot: true
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
```

## 工具

- Trivy、Clair、Snyk（镜像扫描）
- Falco（运行时检测）
- OPA/Gatekeeper（策略执行）

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，容器安全可通过镜像扫描、Pod Security Standards、NetworkPolicy 和 OPA Gatekeeper 实现。

## Related

- [[概念/kubernetes|Kubernetes]]
- [[概念/supply-chain-security|Supply Chain Security]]
- [[架构基建/Security/Container_and_Supply_Chain_Security_for_AI|容器与供应链安 全 for AI]]

---

## 2026 容器安全生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Trivy** | 容器漏洞扫描 | GA |
| **Falco** | 运行时安全监控 | GA |
| **OPA/Gatekeeper** | 策略即代码 | GA |
| **Sigstore** | 容器镜像签名 | GA |
| **gVisor/Kata** | 容器沙箱隔离 | GA |

## 生产最佳实践

1. **镜像扫描**：CI/CD 中集成 Trivy 扫描镜像漏洞
2. **最小权限**：容器以非 root 运行，最小权限原则
3. **镜像签名**：用 Sigstore 签名镜像，防止篡改
4. **运行时监控**：用 Falco 监控容器运行时行为
5. **策略即代码**：用 OPA/Gatekeeper  enforce 安全策略

## 容器安全架构图

```
容器安全分层防护:
┌─────────────────────────────────────────┐
│  镜像层: 最小化基础镜像 + 漏洞扫描    │
├─────────────────────────────────────────┤
│  构建层: 多阶段构建 + 无 root + 签名  │
├─────────────────────────────────────────┤
│  编排层: Pod Security + NetworkPolicy  │
├─────────────────────────────────────────┤
│  运行时: 只读 rootfs + 最小权限 + 监控 │
├─────────────────────────────────────────┤
│  网络层: 零信任 + mTLS + 微分段      │
└─────────────────────────────────────────┘
```

## Pod Security Standards

| 级别 | 说明 | 适用场景 |
|------|------|----------|
| **Privileged** | 无限制 | 系统组件 |
| **Baseline** | 基本限制 | 通用应用 |
| **Restricted** | 严格限制 | 生产环境 |

```yaml
# Restricted Pod Security 配置
apiVersion: v1
kind: Pod
metadata:
  labels:
    pod-security.kubernetes.io/enforce: restricted
spec:
  securityContext:
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]
```

## NetworkPolicy 示例

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  # 默认拒绝所有入站流量
```

## 2026 容器安全工具链

| 工具 | 功能 | 类型 | 状态 |
|------|------|------|------|
| **Trivy** | 镜像/依赖漏洞扫描 | 开源 | GA |
| **Falco** | 运行时威胁检测 | 开源 | GA |
| **OPA/Gatekeeper** | 策略即代码 | 开源 | GA |
| **Cosign** | 镜像签名 | 开源 | GA |
| **gVisor** | 容器沙箱 | 开源 | GA |
| **Kata Containers** | 轻量级 VM 隔离 | 开源 | GA |
| **KubeArmor** | 运行时防护 | 开源 | GA |

## AI 工作负载容器安全

| 场景 | 风险 | 防护 |
|------|------|------|
| **GPU 容器** | 驱动漏洞/资源滥用 | 驱动更新 + 资源配额 |
| **模型服务** | 模型权重泄露 | 只读挂载 + 网络隔离 |
| **训练任务** | 数据泄露 | 网络策略 + 审计 |
| **Notebook** | 代码执行风险 | 沙箱隔离 + 资源限制 |

## 容器安全检查清单

- [ ] 基础镜像最小化（Distroless/Alpine）
- [ ] 镜像漏洞扫描已通过
- [ ] 容器以非 root 运行
- [ ] rootfs 只读
- [ ] capabilities 已限制
- [ ] NetworkPolicy 已配置
- [ ] Secret 用外部管理（Vault/KMS）
- [ ] 运行时监控已启用
- [ ] 镜像已签名并验证

## 多阶段构建安全示例

```dockerfile
# 构建阶段
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# 运行阶段 - 最小化镜像
FROM gcr.io/distroless/python3-debian12:nonroot
COPY --from=builder /install /usr/local
COPY --from=builder /app /app
USER nonroot:nonroot
ENTRYPOINT ["python", "/app/main.py"]
```

## 延伸阅读

- [[概念/Safety/supply-chain-security|供应链安全]] — 镜像与依赖安全
- [[概念/Safety/runtime-security|运行时安全]] — 运行时威胁检测
- [[概念/K8s/kubernetes|Kubernetes]] — 容器编排基础
- [[概念/Safety/model-security|模型安全]] — AI 模型保护

> ℹ️ 容器安全是云原生 AI 部署的基础，必须多层防护协同工作。
> 生产环境建议采用 Distroless 基础镜像 + Restricted Pod Security + Falco 运行时监控。
> GPU 容器需特别注意驱动版本管理和资源配额，防止资源滥用。
> 定期更新基础镜像和依赖，及时修复已知漏洞。
> 多租户环境必须启用 NetworkPolicy 和 Pod Security Standards。
