---
title: "AI 安全基础"
category: 12-architecture-infrastructure
subcategory: security
tags: ["security", "ai", "model-security", "supply-chain", "kubernetes", "k8s", "alibaba-cloud"]
summary: "面向 AI 系统的安全基础：模型安全、数据安全、基础设施安全、供应链安全，以及 K8s 环境中的最佳实践。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

# AI 安全基础

> **一句话理解**: AI 系统不仅要防外部攻击，还要防模型被偷、数据泄露、训练数据投毒，以及镜像里有后门。

## 目录

- [1. AI 安全威胁面](#1-ai-安全威胁面)
- [2. 模型安全](#2-模型安全)
- [3. 数据安全](#3-数据安全)
- [4. 基础设施安全](#4-基础设施安全)
- [5. 供应链安全](#5-供应链安全)
- [Related](#related)

---

## 1. AI 安全威胁面

```text
AI 系统威胁面
├── 输入层：提示注入、对抗样本、数据投毒
├── 模型层：模型窃取、模型逆向、后门攻击
├── 训练层：训练数据泄露、供应链污染
├── 推理层：API 滥用、模型服务 DDoS
└── 基础设施层：容器逃逸、镜像漏洞、权限滥用
```

## 2. 模型安全

- **模型加密**: 静态与传输中加密
- **访问控制**: 模型仓库 RBAC
- **水印**: 追踪模型泄露来源
- **输出过滤**: 毒性、PII、敏感内容过滤

## 3. 数据安全

- **数据脱敏**: 训练前去除 PII
- **差分隐私**: 保护个体数据
- **联邦学习**: 数据不出本地
- **数据血缘**: 追踪数据来源与使用

## 4. 基础设施安全

- **Pod Security**: 非 root、只读 rootfs、drop capabilities
- **Network Policy**: 限制 Pod 间通信
- **Secret 管理**: 使用 KMS/SealedSecret
- **镜像扫描**: Trivy/Clair 扫描漏洞

## 5. 供应链安全

- **依赖审计**: pip/conda 依赖漏洞扫描
- **模型来源验证**: 校验模型 hash、签名
- **镜像签名**: cosign/notary
- **SBOM**: 软件物料清单

---

## Related

- [[_concepts/model-security|Model Security]]
- [[_concepts/supply-chain-security|Supply Chain Security]]
- [[伦理安全/AI_Security_2026|AI Security 2026]]
- [[伦理安全/AI_Supply_Chain_Security|AI Supply Chain Security]]
