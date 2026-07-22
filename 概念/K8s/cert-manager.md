---
title: "cert-manager"
category: -concepts
tags: ["kubernetes", "k8s", "security", "tls", "certificate", "cloud-native", "alibaba-cloud"]
summary: "cert-manager 是 Kubernetes 上自动化 TLS 证书生命周期管理的 CNCF 项目，支持 ACME、Vault、自签及云厂商私有 CA。"
created: 2026-06-26
updated: 2026-07-21
tier: archived
lifecycle: reviewed
aliases:
  - "certmanager"
  - "K8s 证书管理"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/ingress"
    type: related_to
  - target: "概念/vault"
    type: related_to
sources: []
---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

# cert-manager

> **一句话理解**: cert-manager 是 K8s 上的「自动证书管家」，能自动申请、续期、注入 TLS 证书到 Ingress、Service 或工作负载。

## 核心要点

- **CRD 驱动**: 通过 `Issuer` / `ClusterIssuer` / `Certificate` 三个 CRD 管理证书。
- **多种签发源**: ACME（Let's Encrypt）、HashiCorp Vault、自签 CA、云厂商 CA。
- **自动续期**: 证书到期前自动续期并更新 Secret。
- **与 Ingress 集成**: 给 Ingress 加 `cert-manager.io/cluster-issuer` 注解即可自动签发。
- **私钥管理**: 证书和私钥以 K8s Secret 形式存储。

## 典型使用

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ops@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
    - hosts:
        - web.example.com
      secretName: web-tls
  rules:
    - host: web.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web
                port:
                  number: 80
```

## 阿里云专有云关联

在阿里云专有云环境中，cert-manager 可对接企业内部的私有 CA 或 Vault 实例，为 Ingress、Istio Gateway、应用服务自动签发证书。工单中常见「证书过期导致 HTTPS 无法访问」，可通过 `kubectl get certificate` 查看 cert-manager 状态。

## Related

- [[概念/ingress|Ingress]] — 七层入口
- [[概念/vault|Vault]] — 密钥管理
- [[概念/kubernetes|Kubernetes]] — 容器编排
- [[概念/istio|Istio]] — 服务网格

---

## 2026 cert-manager 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **CNCF 毕业** | 成熟稳定 | GA |
| **Gateway API** | 支持 Gateway TLS | GA |
| **ACME DNS-01** | 通配符证书 | GA |
| **csi-driver** | 证书注入 CSI | GA |

## 核心 CRD

| CRD | 作用 | 范围 |
|-----|------|------|
| **Issuer** | 定义证书签发源 | Namespace 级 |
| **ClusterIssuer** | 集群级证书签发源 | 集群级 |
| **Certificate** | 声明需要的证书 | Namespace 级 |
| **CertificateRequest** | 证书请求 | Namespace 级 |
| **Order** | ACME 订单 | Namespace 级 |
| **Challenge** | ACME 验证挑战 | Namespace 级 |

## 签发源对比

| 签发源 | 适用场景 | 说明 |
|--------|----------|------|
| **ACME (Let's Encrypt)** | 公网服务 | 免费、自动续期 |
| **Vault** | 企业内网 | 对接私有 PKI |
| **自签 CA** | 开发测试 | 简单快速 |
| **云厂商 CA** | 云上服务 | AWS ACM/GCP CA |

## 配置示例

```yaml
# 自签 CA Issuer
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: selfsigned-ca
  namespace: ai-inference
spec:
  selfSigned: {}
---
# Certificate 声明
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: inference-tls
  namespace: ai-inference
spec:
  secretName: inference-tls-secret
  duration: 2160h  # 90 天
  renewBefore: 360h  # 15 天前续期
  dnsNames:
    - inference.example.com
    - inference.ai-inference.svc.cluster.local
  issuerRef:
    name: selfsigned-ca
    kind: Issuer
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Certificate 不就绪 | ACME 验证失败 | 检查 DNS/HTTP 可达性 |
| 证书未续期 | Issuer 配置错误 | 检查 Issuer 状态 |
| Secret 未创建 | Certificate 未匹配 | 检查 dnsNames 和 issuerRef |
| 证书过期 | renewBefore 太短 | 调整续期时间 |

## 相关概念

- [[概念/ingress|Ingress]] — 七层入口
- [[概念/vault|Vault]] — 密钥管理
- [[概念/istio|Istio]] — 服务网格 mTLS

## 生产最佳实践

1. **ClusterIssuer 复用**：集群级 Issuer 减少重复配置
2. **自动续期**：确保证书到期前自动续期
3. **监控告警**：监控 Certificate Ready 状态
4. **私有 CA**：内网环境对接企业私有 CA
5. **Gateway API**：新集群使用 Gateway API 替代 Ingress

## 相关概念

- [[概念/ingress|Ingress]] — 七层入口
- [[概念/vault|Vault]] — 密钥管理
- [[概念/istio|Istio]] — 服务网格 mTLS

## 总结

cert-manager 是 K8s 上 TLS 证书自动化管理的标准方案，支持 ACME、Vault、自签 CA 等多种签发源。确保服务间通信始终加密，证书到期前自动续期。

---

> 💡 cert-manager 是 K8s 上 TLS 证书自动化管理的标准方案，确保服务间通信始终加密。

## 版本兼容性

| cert-manager 版本 | K8s 兼容 | 状态 |
|-------------------|---------|------|
| v1.16.x | 1.29+ | 稳定 |
| v1.15.x | 1.28+ | 维护 |
| v1.14.x | 1.27+ | EOL |

## 常用命令

| 命令 | 说明 |
|------|------|
| `kubectl get certificates` | 查看证书状态 |
| `kubectl get certificaterequests` | 查看证书请求 |
| `kubectl describe issuer` | 查看签发源详情 |
| `cmctl check api` | 检查 API 可用性 |






