---
title: "Supply Chain Security"
category: -concepts
tags: ["security", "supply-chain", "ai", "container", "sbom", "model-security"]
summary: "Supply Chain Security（供应链安全）是指保护软件、模型、数据从开发到部署全链路不被篡改或植入恶意组件的安全实践。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "软件供应链安全"
  - "AI Supply Chain Security"
relationships:
  - target: "概念/runtime-security"
    type: part_of
  - target: "概念/container-security"
    type: related_to
sources: []
---

# Supply Chain Security（供应链安全）

> **一句话理解**: 供应链安全 = 确保你用的代码、模型、镜像、依赖都是「干净的」，没被动过手脚。

## 定义

Supply Chain Security 是保护软件、模型、数据从开发到部署全链路不被篡改或植入恶意组件的安全实践。AI 时代，模型权重、训练数据、推理框架都成为攻击面。

## AI 供应链攻击面

| 环节 | 威胁 | 典型攻击 |
|------|------|----------|
| **依赖** | PyPI/npm 恶意包 | 依赖混淆、typosquatting |
| **基础镜像** | 后门植入 | 镜像投毒 |
| **模型权重** | 权重篡改 | HuggingFace 恶意模型 |
| **训练数据** | 数据投毒 | 后门触发器 |
| **CI/CD** | 构建劫持 | GitHub Actions 注入 |
| **推理框架** | 漏洞利用 | vLLM/TGI CVE |

## 防护措施

| 措施 | 说明 | 工具 |
|------|------|------|
| **依赖扫描** | 检测已知漏洞 | Snyk, Trivy, Dependabot |
| **镜像签名** | 确保镜像未被篡改 | Cosign, Notary |
| **SBOM** | 软件物料清单 | Syft, CycloneDX |
| **模型校验** | Hash/签名验证 | SHA256, GPG |
| **私有仓库** | 控制依赖来源 | 私有 PyPI/Registry |
| **最小化镜像** | 减少攻击面 | Distroless, Alpine |

## 2026 年 AI 供应链安全现状

| 方面 | 状态 |
|------|------|
| **模型来源验证** | HuggingFace 支持 Gated Models + 签名 |
| **SBOM 强制** | 美国 EO 14028 要求联邦软件提供 SBOM |
| **模型投毒研究** | 后门攻击检测工具成熟化 |
| **容器安全** | 运行时扫描成为标配 |

## 生产最佳实践

1. **模型下载必须校验 Hash**：不要盲信第三方模型
2. **私有镜像仓库**：所有生产镜像从私有仓库拉取
3. **CI/CD 最小权限**：构建环境不接触生产凭证
4. **定期 SBOM 审计**：每次发布生成并存档
5. **训练数据源审计**：确认数据来源可信、无污染

## Related

- [[概念/container-security|Container Security]]
- [[概念/model-security|Model Security]]
- [[概念/Safety/adversarial-attack|Adversarial Attack]] — 模型层攻击
- [[架构基建/Security/Container_and_Supply_Chain_Security_for_AI|容器与供应链安全 for AI]]
