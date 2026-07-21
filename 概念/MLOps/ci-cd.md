---
title: "CI/CD（持续集成 / 持续部署）"
category: -concepts
tags: [ci-cd, devops, github-actions, jenkins, gitlab-ci, argocd, deployment]
aliases:
  - "CI/CD"
  - "Continuous Integration"
  - "Continuous Deployment"
  - "持续集成"
relationships:
  - target: "概念/argocd"
    type: implemented_by
  - target: "概念/code-generation-workflow"
    type: applied_in
  - target: "概念/policy-as-code"
    type: integrates_with
sources:
  - MLOps/CI_CD/
  - 概念/argocd.md
summary: "CI/CD（持续集成 / 持续部署）是通过自动化流水线快速、可靠地构建、测试、部署软件的工程实践，是 DevOps 文化的核心；2026 年 LLMOps 中的 CI/CD 需要扩展以支持 Prompt 回归测试、模型评估与灰度发布。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.92
created: 2026-06-24
updated: 2026-07-21
---

# CI/CD（持续集成 / 持续部署）

## 核心要点

- **CI（Continuous Integration）**：开发者频繁合并代码到主干，每次合并触发自动化构建和测试。
- **CD（Continuous Deployment）**：通过自动化流水线把通过测试的代码部署到生产环境。
- **核心价值**：
  - 快速反馈（分钟级 vs 天级）
  - 降低发布风险（小批量、可回滚）
  - 提高质量（自动化测试覆盖率）
  - 提升效率（消除手工操作）

## 一句话解释

> CI/CD = "代码改完自动跑测试、自动部署"；让发布从"大爆炸"变成"细水长流"。

## 主流工具

| 类别 | 工具 | 强项 |
|------|------|------|
| **源码托管 + CI** | GitHub Actions、GitLab CI、Bitbucket Pipelines | 一站式 |
| **独立 CI** | Jenkins、CircleCI、Buildkite、Drone | 灵活、可自托管 |
| **CD（GitOps）** | ArgoCD、Flux | K8s 原生 GitOps |
| **CD（应用）** | Spinnaker、Octopus Deploy | 多云、灰度 |
| **构建产物** | Docker Registry、Harbor、Artifactory | 镜像仓库 |

## 标准流水线阶段

```
1. Code → Git Push
        ↓
2. Build → 编译 + 单元测试
        ↓
3. Test → 集成测试 + 覆盖率
        ↓
4. Scan → SAST / SCA / Secret 扫描
        ↓
5. Package → 镜像 / 二进制打包
        ↓
6. Deploy Staging → 预发环境
        ↓
7. Integration Test → 端到端测试
        ↓
8. Deploy Prod (灰度) → 1% → 10% → 50% → 100%
        ↓
9. Monitor → SLO 监控、告警
```

## GitOps（K8s 时代的最佳实践）

```
Git 仓库（声明式配置）
   ↓
ArgoCD / Flux（监听变化）
   ↓
自动同步到 K8s 集群
```

**优势**：
- 版本化的环境配置
- 审计可追溯
- 一键回滚
- PR 即发布

## LLMOps 中的 CI/CD 扩展

传统 CI/CD + LLM 特有步骤：

```
代码 / Prompt / 配置变更
        ↓
[Unit Test] + [Prompt 解析测试]
        ↓
[Golden Set Test] ← LLM 黄金集回归
        ↓
[RAGAS Eval] ← RAG 指标 ≥ 阈值
        ↓
[Safety Test] ← 越狱 / PII 检测
        ↓
[Load Test] ← P99 延迟 + 成本
        ↓
[Deploy Staging]
        ↓
[Online A/B] ← 真实流量
        ↓
[Full Deploy]
```

## 何时使用

✅ **推荐**：
- 任何团队级项目（≥ 2 个开发者）
- LLM 应用上线（必须经过回归测试）
- K8s 多环境管理（GitOps）

⚠️ **不推荐**：
- 个人一次性脚本（用 git push + 手动部署即可）

## Related

- [[概念/argocd]] — ArgoCD（GitOps 工具）
- [[概念/policy-as-code]] — Policy as Code 集成
- [[概念/code-generation-workflow]] — AI 代码生成工作流
- [[模型运维/CI_CD/index]] — MLOps CI/CD 章节
- [[治理/cheatsheets/cheatsheet-mlops]] — LLMOps 速查表

---

## 2026 CI/CD 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **GitHub Actions** | GitHub 原生 CI/CD | GA |
| **GitLab CI** | GitLab 原生 CI/CD | GA |
| **Jenkins** | 老牌 CI/CD 工具 | GA |
| **Tekton** | K8s 原生 CI/CD | GA |
| **Argo Workflows** | K8s 工作流引擎 | GA |

## 生产最佳实践

1. **自动化必用**：所有构建/测试/部署必须自动化
2. **快速反馈**：CI 流水线尽快反馈，<10分钟
3. **测试覆盖**：单元测试 + 集成测试 + E2E 测试
4. **GitOps 部署**：用 ArgoCD 实现 GitOps 部署
5. **安全扫描**：CI/CD 中集成安全扫描