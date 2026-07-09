---
title: GLM 使用指南
category: 16-ai-coding-tools
tags: ["ai-coding", "code-generation", "cursor", "github-copilot"]
summary: "> **一句话**: 智谱 GLM 系列模型通过 OpenCode 和 Crush 接入，是高性价比的国产编程辅助工具，需注意周额度刷新周期。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Glm Guide"
  - "GLM Guide"
  - GLM_Guide

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# GLM 使用指南

> **一句话**: 智谱 GLM 系列模型通过 OpenCode 和 Crush 接入，是高性价比的国产编程辅助工具，需注意周额度刷新周期。

---

## 1. 概述

### 定位

| 维度 | 说明 |
|------|------|
| **类型** | AI [[_concepts/ai-technology-landscape|大语言模型]]（国产） |
| **开发商** | 智谱 AI (Zhipu AI) |
| **接入方式** | OpenCode + GLM / Crush + GLM |
| **适用** | 日常编程、数据库构建、技能开发 |
| **官网** | https://bigmodel.cn |

### 核心能力

```
GLM 生态:
├── GLM 系列模型
│   ├── GLM-4（旗舰）
│   ├── GLM-4-Plus
│   └── 代码生成优化版本
├── 接入组合
│   ├── OpenCode + GLM — Agent CLI 编程
│   └── Crush + GLM — 终端编程辅助
└── 额度管理
    └── 周额度制（每周五零点刷新）
```

---

## 2. 账户与额度

| 项目 | 详情 |
|------|------|
| **额度周期** | 周额度制 |
| **刷新时间** | 每周五 00:00 |
| **消耗速度** | 本周内可能用尽 |
| **状态** | 活跃（需关注周额度） |

---

## 3. 快速开始

### 3.1 获取 API Key

1. 访问 https://bigmodel.cn 注册/登录
2. 进入 API Keys 管理页面
3. 创建新密钥

### 3.2 OpenCode + GLM 配置

```bash
# OpenCode 配置 GLM Provider
# 编辑 opencode.json 或通过 TUI 配置

{
  "provider": {
    "glm": {
      "apiKey": "your-glm-api-key",
      "baseURL": "https://open.bigmodel.cn/api/paas/v4"
    }
  },
  "model": {
    "default": "glm-4-plus"
  }
}
```

### 3.3 Crush + GLM 配置

```bash
# Crush 是轻量终端 AI 编程工具
# 配置 GLM 作为后端模型

crush config set provider glm
crush config set api-key your-glm-api-key
crush config set base-url https://open.bigmodel.cn/api/paas/v4
```

---

## 4. 使用场景与输出

| 输出项目 | 说明 | 使用组合 |
|----------|------|----------|
| **hackcore-db** | 核心数据库项目 | Crush + GLM |
| **skills4coder** | 编程技能训练 | OpenCode + GLM |

---

## 5. 最佳实践

- **周额度规划**: 每周五零点刷新，周一至周四集中使用，周五后额度恢复
- **模型选择**: 日常编程用 GLM-4，复杂任务用 GLM-4-Plus
- **组合使用**: OpenCode 用于大型 Agent 任务，Crush 用于快速问答和代码片段
- **额度耗尽应对**: 周额度用尽后切换到其他工具（如 Kimi、MiniMax）

---

## 6. 注意事项

- 周额度刷新机制特殊（非月度），需要更频繁的额度管理
- 额度通常在本周内耗尽，建议制定周使用计划
- 与 OpenCode 的集成需要正确的 API 配置
- GLM 的中文能力优秀，适合中文注释和文档生成

---

## 7. 与 OpenCode 集成详情

参见 [OpenCode 集成指南](./OpenCode/23-opencode-providers-models.md)

---

*最后更新: 2026-05*

## Related

- [[AI编程/Theory/AI_Coding_Theory]] — AI 辅助编程理论基础 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[AI编程/Tools/CodeBuddy_Guide]] — CodeBuddy / WorkBuddy 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[AI编程/Tools/Comate_Guide]] — Comate 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[AI编程/Tools/Coze_Guide]] — Coze 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[AI编程/Tools/DeepSeek_Guide.md|DeepSeek_Guide]]
