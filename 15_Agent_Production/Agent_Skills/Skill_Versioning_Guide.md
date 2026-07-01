---
title: Skill 版本管理与团队治理
category: 15-agent-production-agent-skills
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 当团队有 5 个以上的 Agent Skills 时，就需要建立版本管理、评审流程和治理规范。本文档提供一套可直接落地的团队 Skill 库治理方案。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Skill Versioning Guide"
  - Skill_Versioning_Guide

---
# Skill 版本管理与团队治理

> 当团队有 5 个以上的 Agent Skills 时，就需要建立版本管理、评审流程和治理规范。本文档提供一套可直接落地的团队 Skill 库治理方案。

---

## 一、Git 工作流

### 1.1 仓库结构

```
company-agent-skills/
├── README.md
├── .github/
│   └── workflows/
│       └── skill-eval.yml    # CI 自动评估
├── skills/                    # 所有 Skill 目录
│   ├── csv-analyzer/
│   ├── pdf-processing/
│   └── internal-deploy/
└── policies/
    ├── naming-convention.md   # 命名规范
    └── review-checklist.md    # 评审清单
```

### 1.2 分支策略

| 分支 | 用途 | 保护规则 |
|------|------|---------|
| `main` | 生产级 Skills | 需 PR + 1 人审批 + CI 通过 |
| `staging` | 预发布 Skills | 需 PR + CI 通过 |
| `feat/<skill-name>` | 新 Skill 开发 | 无保护，自由推送 |
| `fix/<skill-name>` | Skill 修复 | 无保护，自由推送 |

### 1.3 提交规范

```
feat(csv-analyzer): add chunked reading for large files
fix(pdf-processing): correct encoding fallback order
docs(internal-deploy): update allowed-tools list
test(incident-response): add edge case for empty metrics
deprecate(old-linter): mark for removal in v2.0
```

### 1.4 PR 模板

```markdown
## Skill 变更

- [ ] 新建 Skill
- [ ] 功能增强
- [ ] Bug 修复
- [ ] 文档更新

## 检查清单

- [ ] `skills-ref validate` 通过
- [ ] 触发测试：20 查询 × 3 次运行
- [ ] 功能测试：with/without 对比
- [ ] SKILL.md < 500 行
- [ ] 脚本非交互式 + 有 `--help`

## 影响范围

- [ ] 不影响现有 Skill
- [ ] 可能影响以下 Skill（请列出）：
```

---

## 二、语义化版本

### 2.1 版本号规则

Skill 版本采用 `MAJOR.MINOR.PATCH` 格式，记录在 `SKILL.md` 的 `metadata` 中：

```yaml
---
name: csv-analyzer
metadata:
  version: "1.2.3"
---
```

| 版本变化 | 触发条件 | 示例 |
|---------|---------|------|
| **MAJOR** | 破坏性变更（触发逻辑改变、输出格式不兼容） | 输出表格格式从 Markdown 改为 JSON |
| **MINOR** | 功能增强（向后兼容） | 新增图表生成功能 |
| **PATCH** | 修复（向后兼容） | 修正编码检测逻辑 |

### 2.2 版本迁移指南

当发布 MAJOR 版本时，需在 `_references/` 中保留迁移说明：

```markdown
# Migration Guide: v1 → v2

## Breaking Changes

- 输出格式从 Markdown 表格改为 JSON
- 脚本参数 `--format` 默认值从 `table` 改为 `json`

## Migration Steps

1. 更新调用方解析逻辑
2. 显式指定 `--format table` 以保持旧行为
```

---

## 三、团队 Skill 库组织

### 3.1 命名空间策略

| 前缀 | 归属 | 示例 |
|------|------|------|
| 无前缀 | 团队共享通用 Skill | `csv-analyzer`, `pdf-processing` |
| `team-<name>-` | 特定团队专用 | `team-sre-incident-response` |
| `proj-<name>-` | 项目特定 Skill | `proj-xyz-onboarding` |
| `internal-` | 内部工具/流程 | `internal-deploy-checklist` |
| `legacy-` | 即将废弃 | `legacy-v1-linter` |

### 3.2 分类与标签

在 `metadata` 中增加分类标签，便于检索：

```yaml
metadata:
  category: "data-processing"
  tags: ["csv", "analysis", "visualization"]
  owner: "data-platform-team"
  maturity: "stable"  # experimental / beta / stable / deprecated
```

### 3.3 废弃流程

```
1. 在 SKILL.md 顶部添加 deprecation notice
2. metadata.maturity 改为 "deprecated"
3. 发布最终 PATCH 版本（含迁移指南）
4. 保留 2 个 MAJOR 版本周期后移除
```

```markdown
> ⚠️ **Deprecated**: This skill is deprecated as of v1.5.0.
> Please migrate to `new-csv-analyzer` (v2.0+).
> See [Migration Guide](_references/migration-v1-to-v2.md).
```

---

## 四、CI/CD 集成

### 4.1 自动评估流水线

```yaml
# .github/workflows/skill-eval.yml
name: Skill Evaluation

on:
  pull_request:
    paths:
      - 'skills/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Detect changed skills
        id: changed
        run: |
          echo "skills=$(git diff --name-only origin/main | grep '^skills/' | cut -d'/' -f2 | sort -u | jq -R . | jq -s .)" >> $GITHUB_OUTPUT
      
      - name: Install skills-ref
        run: npm install -g @agentskills/skills-ref
      
      - name: Validate format
        run: |
          for skill in ${{ steps.changed.outputs.skills }}; do
            skills-ref validate "skills/$skill"
          done
      
      - name: Trigger accuracy test
        run: |
          for skill in ${{ steps.changed.outputs.skills }}; do
            python scripts/test_trigger.py "skills/$skill" --runs 3
          done
      
      - name: Functional evaluation
        run: |
          for skill in ${{ steps.changed.outputs.skills }}; do
            python scripts/eval_skill.py "skills/$skill" --compare-baseline
          done
      
      - name: Post results
        uses: actions/github-script@v7
        with:
          script: |
            const results = require('./eval-results.json');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Skill Evaluation Results\n\n${JSON.stringify(results, null, 2)}`
            });
```

### 4.2 发布流程

```bash
# 1. 创建发布标签
git tag -a "csv-analyzer-v1.2.0" -m "Add chunked reading for large files"

# 2. 推送标签触发发布
git push origin "csv-analyzer-v1.2.0"

# 3. CI 自动：
#    - 运行完整评估套件
#    - 生成评估报告
#    - 打包 Skill 为 .zip
#    - 上传到内部 Skill 仓库
```

---

## 五、评审清单

### 5.1 Skill 评审 Checklist

```markdown
## Skill Review Checklist

### 基础合规
- [ ] `name` 匹配目录名，符合命名规范
- [ ] `description` ≤ 1024 字符，包含触发关键词
- [ ] `SKILL.md` < 500 行
- [ ] `skills-ref validate` 零错误

### 内容质量
- [ ] 有明确的 When to use 章节
- [ ] Workflow 步骤可执行、无歧义
- [ ] Gotchas 覆盖至少 2 个边缘情况
- [ ] 有输入/输出示例

### 脚本质量（如适用）
- [ ] 脚本非交互式
- [ ] 有 `--help` 输出
- [ ] 错误消息友好
- [ ] 依赖声明清晰（PEP 723 / package.json）

### 评估覆盖
- [ ] 有 evals.json（L3/L4 Skill）
- [ ] 每个核心能力至少 1 个测试用例
- [ ] 有 with/without 基线对比

### 安全
- [ ] 无硬编码密钥或敏感数据
- [ ] scripts/ 无破坏性操作（或已标注风险）
- [ ] 项目级 Skill 已标记信任状态
```

---

## 六、度量与监控

### 6.1 团队 Skill 健康度仪表盘

| 指标 | 目标值 | 数据来源 |
|------|--------|---------|
| Skill 触发成功率 | > 80% | 客户端日志 |
| 平均评估通过率 | > 75% | CI 评估报告 |
| Skill 平均响应时间 | < 60s | 执行轨迹 |
| 废弃 Skill 占比 | < 10% | 仓库统计 |
| 文档覆盖率 | 100% | 是否有 SKILL.md |

### 6.2 定期审查机制

| 频率 | 活动 | 负责人 |
|------|------|--------|
| 每周 | 查看 CI 失败 Skill，分配修复 | 研发工程师 |
| 每月 | 审查触发率低于 60% 的 Skill | 评估师 |
| 每季度 | 评估废弃候选，更新路线图 | 产品经理 |
| 每半年 | 全面技能库审计，更新分类 | 架构师 |

---

## 🔗 相关主题

- [Agent Skills 深度解析](./Agent_Skills_Deep_Dive.md) — 完整规范与最佳实践
- [Agent Skills 实战指南](./Agent_Skills_Practical_Guide.md) — 创建和优化 Skill
- [Agent Skills 多角色全景分析](./Agent_Skills_Multi_Role_Analysis.md) — 五角色协作框架
- [Agent Skills 书写速览](./Skills-in-nutshell.md) — 快速入门

---

> 📅 **最后更新**：2026-05-07

## Related

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
