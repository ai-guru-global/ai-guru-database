---
title: "Trivy"
category: -concepts
tags: ["kubernetes", "k8s", "security", "vulnerability", "container", "scanning", "cloud-native", "alibaba-cloud"]
summary: "Trivy 是 Aqua Security 开源的轻量级安全扫描器，支持容器镜像、文件系统、Git 仓库、IaC 配置和 K8s 集群的漏洞与错误配置检测。"
created: 2026-06-26
updated: 2026-07-21
tier: archived
lifecycle: reviewed
aliases:
  - "镜像漏洞扫描"
  - "容器安全扫描"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/kyverno"
    type: related_to
  - target: "概念/falco"
    type: related_to
sources: []
name_zh: "Trivy 安全扫描器"
---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

# Trivy

> 中文简称：Trivy 安全扫描器

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

- [[概念/kyverno|Kyverno]] — K8s 策略引擎
- [[概念/falco|Falco]] — 运行时威胁检测
- [[概念/kubernetes|Kubernetes]] — 容器编排
- [[概念/opa|OPA]] — 策略引擎

---

## 2026 Trivy 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **Aqua 维护** | CNCF 项目 | GA |
| **SBOM 生成** | CycloneDX/SPDX | GA |
| **VM 扫描** | 虚拟机镜像 | GA |
| **K8s Operator** | 集群内扫描 | GA |

## 扫描类型详解

| 扫描类型 | 命令 | 检测内容 |
|----------|------|----------|
| **镜像扫描** | `trivy image` | OS 包 + 应用依赖 CVE |
| **文件系统** | `trivy fs` | 代码依赖 + IaC 配置 |
| **Git 仓库** | `trivy repo` | 同 fs，远程扫描 |
| **K8s 集群** | `trivy k8s` | 集群资源漏洞 + 错配 |
| **IaC 配置** | `trivy config` | Terraform/Dockerfile/K8s YAML |
| **密钥泄露** | `trivy secret` | 代码中的密钥/Token |
| **SBOM** | `trivy sbom` | 软件物料清单分析 |

## CI/CD 集成示例

```yaml
# GitHub Actions 集成
name: Security Scan
on: [push]
jobs:
  trivy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build image
        run: docker build -t app:${{ github.sha }} .
      - name: Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: app:${{ github.sha }}
          format: sarif
          output: trivy-results.sarif
          severity: CRITICAL,HIGH
          exit-code: 1  # 发现高危漏洞则失败
```

## 输出格式

| 格式 | 用途 |
|------|------|
| `table` | 终端查看（默认） |
| `json` | 程序化处理 |
| `sarif` | GitHub Security Tab |
| `cyclonedx` | SBOM 合规 |
| `spdx` | SBOM 合规 |

## AI 场景应用

| 场景 | 说明 |
|------|------|
| **模型镜像扫描** | 确保推理服务镜像无高危 CVE |
| **基础镜像合规** | 扫描 CUDA/PyTorch 基础镜像 |
| **供应链安全** | 生成 SBOM 满足合规要求 |
| **集群安全审计** | 定期扫描 K8s 集群配置风险 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 扫描慢 | 首次下载漏洞库 | 预加载 DB 或离线模式 |
| 误报多 | 版本匹配不精确 | 使用 `.trivyignore` 过滤 |
| 私有镜像拉取失败 | 缺少认证 | 配置 `TRIVY_USERNAME/PASSWORD` |
| K8s 扫描权限不足 | RBAC 限制 | 配置 ClusterReader 角色 |

## 生产最佳实践

1. **CI/CD 集成**：在镜像构建后自动扫描，阻断高危漏洞
2. **定期扫描**：生产集群定期执行 trivy k8s 扫描
3. **漏洞修复**：关注 CRITICAL/HIGH 级别漏洞，及时升级基础镜像
4. **与 Harbor 集成**：镜像仓库内置 Trivy 扫描策略
5. **SBOM 合规**：生成 CycloneDX/SPDX 满足供应链安全要求

## 忽略规则配置

```yaml
# .trivyignore 文件示例
# 忽略特定 CVE
CVE-2023-1234
CVE-2023-5678

# 忽略特定包
# 格式: <package> <version> <vulnerability>
openssl 1.1.1 CVE-2023-9999
```

```yaml
# trivy.yaml 配置示例
severity:
  - CRITICAL
  - HIGH
exit-code: 1
ignore-unfixed: true
vulnerability:
  type:
    - os
    - library
```

## 与 Harbor 集成

| 功能 | 说明 |
|------|------|
| 自动扫描 | 镜像推送后自动触发 |
| 策略阻断 | 高危漏洞镜像禁止拉取 |
| 报告查看 | Harbor UI 查看扫描结果 |
| 定期重扫 | 漏洞库更新后重新扫描 |

## 相关概念

- [[概念/kyverno|Kyverno]] — K8s 策略引擎
- [[概念/falco|Falco]] — 运行时威胁检测
- [[概念/pod-security-standards|Pod Security Standards]] — Pod 安全标准

## 总结

Trivy 是云原生安全的「瑞士军刀」，一个工具覆盖镜像、代码、IaC、集群全链路安全扫描。集成到 CI/CD 流水线，确保上线前发现并修复高危漏洞。

> 💡 Trivy 是云原生安全的「瑞士军刀」，一个工具覆盖镜像、代码、IaC、集群全链路安全扫描。
