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
- [[12_架构基建/10_Security/Container_and_Supply_Chain_Security_for_AI|容器与供应链安全 for AI]]

## 供应链安全架构图

```
AI 供应链安全架构:
┌─────────────────────────────────────────────────┐
│  开发环境: 依赖扫描 + 代码审计 + Secret 检测  │
├─────────────────────────────────────────────────┤
│  CI/CD: 构建隔离 + 镜像签名 + SBOM 生成      │
├─────────────────────────────────────────────────┤
│  镜像仓库: 漏洞扫描 + 签名验证 + 访问控制  │
├─────────────────────────────────────────────────┤
│  模型仓库: Hash 校验 + 来源审计 + 后门检测  │
├─────────────────────────────────────────────────┤
│  运行时: 只读镜像 + 最小权限 + 行为监控    │
└─────────────────────────────────────────────────┘
```

## SBOM 生成与审计

```bash
# 使用 Syft 生成 SBOM
syft packages dir:/app -o cyclonedx-json > sbom.json

# 使用 Grype 扫描漏洞
grype sbom:sbom.json -o table

# 使用 Cosign 签名镜像
cosign sign --key cosign.key registry.example.com/ai-model:v1

# 验证签名
cosign verify --key cosign.pub registry.example.com/ai-model:v1
```

## 模型供应链安全

| 环节 | 风险 | 防护 |
|------|------|------|
| **模型下载** | 恶意模型/权重篡改 | SHA256 校验 + GPG 签名 |
| **模型格式** | Pickle 反序列化漏洞 | 使用 SafeTensors |
| **依赖库** | transformers/torch 漏洞 | 定期更新 + 扫描 |
| **训练数据** | 数据投毒 | 数据源审计 + 异常检测 |

## 2026 供应链安全工具链

| 工具 | 功能 | 类型 | 状态 |
|------|------|------|------|
| **Trivy** | 容器/依赖漏洞扫描 | 开源 | GA |
| **Syft** | SBOM 生成 | 开源 | GA |
| **Grype** | 漏洞扫描器 | 开源 | GA |
| **Cosign** | 容器签名 | 开源 | GA |
| **Sigstore** | 软件签名基建 | 开源 | GA |
| **SLSA** | 供应链级别框架 | 标准 | GA |
| **in-toto** | 供应链完整性 | 开源 | GA |

## CI/CD 安全配置示例

```yaml
# GitHub Actions 供应链安全流水线
name: Secure Build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      id-token: write  # Sigstore keyless
      contents: read
    steps:
      - uses: actions/checkout@v4
      - name: Dependency Scan
        run: trivy fs --severity HIGH,CRITICAL .
      - name: Build Image
        run: docker build -t registry/app:${{ github.sha }} .
      - name: Sign Image
        run: cosign sign registry/app:${{ github.sha }}
      - name: Generate SBOM
        run: syft registry/app:${{ github.sha }} -o cyclonedx-json > sbom.json
```

## SLSA 供应链级别

| 级别 | 要求 | 说明 |
|------|------|------|
| **SLSA 1** | 构建过程文档化 | 基础透明度 |
| **SLSA 2** | 托管构建 + 签名 | 防篡改 |
| **SLSA 3** | 强化构建平台 | 防交叉污染 |
| **SLSA 4** | 两人审查 + 密封构建 | 最高安全 |

## 依赖安全最佳实践

```python
# requirements.txt 安全锁定
# 使用 pip-compile 生成锁定文件
# pip-compile --generate-hashes requirements.in

# 验证依赖 Hash
pip install --require-hashes -r requirements.txt

# 定期扫描依赖漏洞
# pip-audit -r requirements.txt
```

## 供应链安全检查清单

- [ ] 所有依赖已锁定版本 + Hash
- [ ] 镜像已签名并验证
- [ ] SBOM 已生成并存档
- [ ] 模型文件 Hash 已校验
- [ ] CI/CD 流水线已加固
- [ ] 私有仓库已配置
- [ ] 定期漏洞扫描已启用
- [ ] 应急响应流程已制定

## 常见供应链攻击案例

| 事件 | 时间 | 影响 | 教训 |
|------|------|------|------|
| **SolarWinds** | 2020 | 构建系统被入侵 | 构建隔离 |
| **Log4Shell** | 2021 | 依赖库漏洞 | 依赖扫描 |
| **PyPI 恶意包** | 持续 | typosquatting | 私有仓库 |
| **HuggingFace 恶意模型** | 2024 | Pickle 反序列化 | SafeTensors |

## 延伸阅读

- [[概念/Safety/container-security|容器安全]] — 容器镜像与运行时安全
- [[概念/Safety/model-security|模型安全]] — 模型层安全防护
- [[概念/Safety/runtime-security|运行时安全]] — 运行时威胁检测
- [[概念/Inference/safetensors|SafeTensors]] — 安全模型格式

> ℹ️ 供应链安全是 AI 系统安全的基础，从模型下载到部署全链路都需验证。
