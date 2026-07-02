---
title: "Trivy"
category: -concepts
tags: ["kubernetes", "k8s", "security", "vulnerability", "container", "scanning", "cloud-native", "alibaba-cloud"]
summary: "Trivy 是 Aqua Security 开源的轻量级安全扫描器，支持容器镜像、文件系统、Git 仓库、IaC 配置和 K8s 集群的漏洞与错误配置检测。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "镜像漏洞扫描"
  - "容器安全扫描"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/kyverno"
    type: related_to
  - target: "_concepts/falco"
    type: related_to
---

# Trivy

> **一句话理解**: Trivy 是 K8s 安全领域的「体检仪」，能扫镜像漏洞、错误配置、敏感信息和密钥泄露。

## 核心要点

- **一站式扫描**: 镜像 OS 包漏洞、应用依赖漏洞、IaC 配置错误、密钥泄露。
- **速度快、易于集成**: CLI 单二进制，可集成到 CI/CD、Admission Controller。
- **多种输出格式**: Table、JSON、SARIF、CycloneDX。
- **K8s 集群扫描**: `trivy k8s` 可扫描整个集群资源风险。
- **漏洞数据库**: 自动更新 CVE、NVD、GitHub Advisory 等源。

## 常用命令

```bash
# 扫描镜像
trivy image nginx:1.25

# 扫描本地文件系统
trivy fs .

# 扫描 K8s 集群
trivy k8s --report summary cluster

# 扫描 K8s 某个 namespace
trivy k8s --namespace prod --report all
```

## 选型对比

| 工具 | 侧重点 | 扫描对象 | CI/CD 集成 |
|------|--------|---------|-----------|
| **Trivy** | 全能、轻量 | 镜像/FS/IaC/K8s | 极易 |
| **Snyk** | 应用依赖 | 代码/容器/IaC | 易 |
| **Clair** | 镜像漏洞 | 容器镜像 | 中等 |
| **Kube-bench** | CIS 基线 | K8s 节点配置 | 易 |

## 阿里云专有云关联

在专有云环境中，Trivy 常与 Harbor 镜像仓库或 ACK 镜像扫描策略集成，用于在镜像推送到生产仓库前阻断高危漏洞。工单中「镜像有 CVE 被要求修复」时，可通过 Trivy 报告定位具体包版本并升级。

## Related

- [[_concepts/kyverno|Kyverno]] — K8s 策略引擎
- [[_concepts/falco|Falco]] — 运行时威胁检测
- [[_concepts/kubernetes|Kubernetes]] — 容器编排
