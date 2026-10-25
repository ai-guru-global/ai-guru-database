---
title: "Harbor"
category: -concepts
tags: ["harbor", "registry", "image-registry", "artifact-registry", "kubernetes", "cncf", "supply-chain-security", "ai-supply-chain"]
relationships:
  - target: "概念/K8s/containerd"
    type: related_to
  - target: "概念/K8s/cri"
    type: related_to
  - target: "概念/K8s/harbor-cve-history"
    type: includes
sources:
  - 概念/K8s/harbor-cve-history
summary: "Harbor 是 CNCF Graduated 的云原生制品（镜像）仓库，提供镜像存储分发、漏洞扫描、内容签名与可信、多租户 RBAC 和跨数据中心复制，是 K8s 与 AI 供应链安全的关键基础设施。"
lifecycle: reviewed
tier: supporting
created: 2026-10-14
updated: 2026-10-14
aliases:
  - 云原生镜像仓库
  - Harbor Registry
  - 制品仓库

name_zh: "云原生制品仓库"
---
# Harbor

> 中文简称：云原生制品仓库

> Kubernetes 与 AI 集群的「制品管家」——集中存放、扫描、签名并分发容器镜像与 AI 模型制品。

---

## 1. 一句话定义

**Harbor** 是 CNCF Graduated 的开源云原生制品仓库（registry），以 Docker Registry API 兼容协议存储分发 **OCI 镜像、Helm Chart、OPA 策略乃至 AI 模型权重**等制品，并内置漏洞扫描、内容信任（签名）、RBAC 多租户与跨仓库复制，是镜像供应链安全的行业标准组件。

---

## 2. 核心能力

| 能力 | 说明 | 典型场景 |
|------|------|----------|
| **镜像/制品存储** | OCI 兼容 registry，支持镜像、Chart、模型制品 | 企业统一制品入口 |
| **漏洞扫描** | 集成 Trivy 等，推镜像/定时扫描 CVE | 阻断带高危漏洞的镜像上线 |
| **内容信任与签名** | Notary/cosign 签名，只允许拉取已签名镜像 | 供应链防篡改 |
| **多租户 RBAC** | 项目级权限、机器人账号、配额 | 多团队共享、CI 机器人拉推 |
| **跨数据中心复制** | 基于策略的 push/pull 复制 | 多集群、多地域分发 |
| **制品保留策略** | 按 tag/数量/时间自动清理 | 控制存储成本 |

---

## 3. 在 K8s / AI 供应链中的位置

```
CI 构建镜像 ──push──▶ Harbor（扫描/签名/留存）──pull──▶ K8s 节点(containerd)
                        │
                        ├─ 漏洞扫描: 拦截高危 CVE 镜像
                        ├─ 签名校验: Admission 只放行已签名镜像
                        └─ 复制策略: 同步到边缘/多集群仓库
```

- K8s 侧配合运行时：镜像最终由节点上的 [[概念/K8s/containerd|containerd]] 通过 [[概念/K8s/cri|CRI]] 拉取执行，Harbor 是拉取源之一；
- AI 场景中，大模型镜像（含 CUDA/驱动层，常超 20GB）依赖 Harbor 的分片与 P2P 分发（配合 dragonfly 等）加速；
- Harbor 自身 CVE 的历史风险与升级基线，见 [[概念/K8s/harbor-cve-history|Harbor CVE 历史]]。

---

## 4. 与同类方案对比

| 方案 | 定位 | 特点 |
|------|------|------|
| **Harbor** | 企业级私有 registry | 扫描/签名/RBAC/复制全家桶，CNCF 毕业 |
| Docker Registry | 纯存储 | 轻量，无企业能力 |
| GHCR / ECR / ACR | 云托管 | 免运维，与云账号体系绑定 |
| Zot / Distribution | 轻量 OCI registry | 边缘/嵌入式场景 |

---

## 5. 常见问题

| 问题 | 要点 |
|------|------|
| 镜像拉取慢？ | 启用 P2P 分发（Dragonfly）、就近复制规则 |
| 如何强制只跑签名镜像？ | cosign/Notary 签名 + Kyverno/签名 Admission 校验 |
| 扫描误报多？ | 只阻断 High/Critical 且有 fix 的 CVE，其余观察 |
| 大模型制品放哪？ | OCI Artifact 形态（模型权重 layer）可入 Harbor，超大模型建议对象存储 + 元数据入 registry |

---
*Last updated: 2026-10-14*
