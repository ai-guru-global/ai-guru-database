---
title: "代码生成工作流"
category: -concepts
tags: ["code-generation", "ai-coding", "workflow", "agent", "ci-cd", "software-engineering"]
relationships:
  - target: "_concepts/code-generation"
    type: belongs_to
  - target: "_concepts/ai-agents"
    type: uses
  - target: "_concepts/ci-cd"
    type: integrates_with
  - target: "_concepts/mlops"
    type: related_to
sources:
  - AI编程/README.md
  - Agent/Agent_Workflow/README.md
  - MLOps/CI_CD/CI_CD_Pipeline_AI_2026.md
summary: "代码生成工作流是把 AI 代码能力嵌入软件开发全流程的工程方法。它不只是让模型写一段代码，而是把需求理解、代码生成、静态检查、测试、审查、合并、部署串联成可重复、可审计的流水线。"
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.8
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - "Code Generation Workflow"
  - "code generation workflow"

---
# 代码生成工作流

## 核心要点

- **代码生成 ≠ 代码补全**：补全只是写一行或一段，工作流覆盖从需求到部署的全过程。
- **典型环节**：需求解析 → 设计/规划 → 代码生成 → 静态检查 → 单元测试 → 代码审查 → 合并 → 部署监控。
- **AI 在每个环节都能参与**：写代码、改 bug、生成测试、解释代码、review PR、写文档。
- **关键风险**：AI 生成的代码可能有 bug、安全漏洞、许可证问题，必须通过工程手段兜底。

## 一句话理解

代码生成工作流就像一条‘AI 辅助的流水线’：从你想做什么，到代码上线运行，每一步都有 AI 帮忙，但每一步也都有自动化检查把关。

## 详细内容

### 为什么需要工作流？

直接让 AI 生成代码的问题：
- 可能不符合项目规范。
- 可能没考虑边界条件。
- 可能引入安全漏洞。
- 难以追溯和复现。

工作流通过自动化检查把这些问题挡在上线前。

### 典型工作流

```
需求/任务描述
  ↓
AI 规划（拆分步骤、选技术方案）
  ↓
AI 生成代码 + 单元测试
  ↓
静态检查（lint、类型检查、安全扫描）
  ↓
自动化测试（单元/集成/E2E）
  ↓
AI 代码审查（或人工 review）
  ↓
合并到主分支
  ↓
CI/CD 构建、部署
  ↓
运行时监控与回滚
```

### AI 代码工具角色

| 环节 | 工具/能力 | 示例 |
|------|-----------|------|
| 需求理解 | 自然语言解析、Jira/飞书接入 | Cursor、GitHub Copilot Chat |
| 代码生成 | 续写、函数生成、重构 | GitHub Copilot、Codeium |
| 测试生成 | 自动生成单元测试 | CodiumAI、CoverAgent |
| 代码审查 | AI Reviewer | CodeRabbit、PR-Agent |
| 文档生成 | 自动生成注释/文档 | Mintlify、AI doc tools |
| 部署 | CI/CD 集成 | GitHub Actions、Jenkins |

### 安全与治理

- **沙箱执行**：AI 生成的代码先在隔离环境运行。
- **依赖审查**：检查是否有恶意依赖、许可证冲突。
- **人工把关**：关键模块必须人工 review。
- **审计日志**：记录 AI 生成、修改、部署的全过程。

## 开放问题

- 如何量化 AI 辅助对工作流效率的真实提升。
- AI 生成代码的知识产权归属。
- 长上下文/多文件项目中的规划能力边界。

## Related

- [[_concepts/code-generation]] — 代码生成
- [[_concepts/ai-agents]] — AI Agent
- [[_concepts/ci-cd]] — CI/CD
- [[_concepts/mlops]] — MLOps
- [[编程/README]] — AI 编程工具
- [[MLOps/CI_CD/CI_CD_Pipeline_AI_2026]] — AI CI/CD 流水线 2026
