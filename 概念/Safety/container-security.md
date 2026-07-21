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
