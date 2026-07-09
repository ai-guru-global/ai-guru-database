---
title: "容器与供应链安全 for AI"
category: 12-architecture-infrastructure
subcategory: security
tags: ["security", "container", "supply-chain", "ai", "kubernetes", "k8s", "alibaba-cloud"]
summary: "聚焦 AI 工作负载的容器安全与供应链安全：镜像构建、漏洞扫描、SBOM、签名验证、运行时防护。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# 容器与供应链安全 for AI

> **一句话理解**: AI 镜像通常又大又复杂（CUDA/cuDNN/框架/模型），任何一个组件有漏洞都可能被利用，必须从构建到运行全流程防护。

## 目录

- [1. AI 容器特点](#1-ai-容器特点)
- [2. 镜像安全](#2-镜像安全)
- [3. 运行时安全](#3-运行时安全)
- [4. 供应链安全](#4-供应链安全)
- [5. 最佳实践清单](#5-最佳实践清单)
- [Related](#related)

---

## 1. AI 容器特点

- **体积大**: 基础镜像可达数 GB
- **依赖多**: CUDA、cudnn、Python 包、模型文件
- **特权需求**: 有时需要访问 /dev/nvidiactl
- **来源复杂**: 基础镜像、模型、数据集来自多处

## 2. 镜像安全

### 2.1 最小化镜像

```dockerfile
FROM nvidia/cuda:12.1.0-base-ubuntu22.04
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
```

### 2.2 漏洞扫描

```bash
trivy image my-ai-image:latest
```

### 2.3 镜像签名

```bash
cosign sign --key cosign.key my-registry/my-ai-image:latest
```

## 3. 运行时安全

- **非 root 运行**
- **只读 rootfs**
- **drop 不必要 capabilities**
- **NetworkPolicy 限制出口**
- ** seccomp / AppArmor / SELinux **

```yaml
securityContext:
  runAsNonRoot: true
  readOnlyRootFilesystem: true
  capabilities:
    drop:
      - ALL
```

## 4. 供应链安全

- **SBOM**: 生成软件物料清单
- **依赖锁定**: requirements.txt + hash
- **私有 PyPI/Conda 仓库**: 避免公网依赖
- **模型校验**: hash + GPG 签名

## 5. 最佳实践清单

| 阶段 | 措施 |
|------|------|
| 构建 | 多阶段构建、最小化基础镜像、锁定依赖 |
| 推送 | 镜像扫描、签名 |
| 拉取 | 验证签名、镜像拉取策略 |
| 运行 | 安全上下文、NetworkPolicy、运行时监控 |
| 退役 | 漏洞补丁、镜像更新 |

---

## Related

- [[_concepts/supply-chain-security|Supply Chain Security]]
- [[_concepts/container-security|Container Security]]
- [[架构基建/Security/AI_Security_Fundamentals|AI 安全基础]]

- [[架构基建/README|架构与基础设施 (Architecture & Infrastructure)]]
