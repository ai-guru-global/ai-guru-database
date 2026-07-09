---
title: "Supply Chain Security"
category: -concepts
tags: ["security", "supply-chain", "ai", "container", "alibaba-cloud"]
summary: "Supply Chain Security（供应链安全）是指保护软件、模型、数据从开发到部署全链路不被篡改或植入恶意组件的安全实践。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "软件供应链安全"
relationships:
  - target: "_concepts/security"
    type: part_of
  - target: "_concepts/container-security"
    type: related_to
---

# Supply Chain Security

> **一句话理解**: 供应链安全就是确保你用的代码、模型、镜像、依赖都是「干净的」，没被坏人动过手脚。

## 核心要点

- **依赖安全**: 扫描 PyPI/Conda/npm 依赖漏洞
- **镜像安全**: 基础镜像扫描、最小化镜像
- **代码签名**: commit 签名、镜像签名
- **SBOM**: 软件物料清单
- **模型来源**: 校验模型 hash、签名

## 常见威胁

| 威胁 | 说明 |
|------|------|
| 依赖混淆 | 恶意包冒充常用包 |
| 镜像投毒 | 基础镜像被植入后门 |
| 模型篡改 | 预训练模型权重被修改 |
| CI/CD 劫持 | 构建流程被攻击 |

## 阿里云专有云关联

在阿里云专有云环境中，供应链安全可通过私有镜像仓库、依赖审计、镜像扫描和 SBOM 管理实现。

## Related

- [[_concepts/container-security|Container Security]]
- [[_concepts/model-security|Model Security]]
- [[架构基建/Security/Container_and_Supply_Chain_Security_for_AI|容器与供应链安全 for AI]]
