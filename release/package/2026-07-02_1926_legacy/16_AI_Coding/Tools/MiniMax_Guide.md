---
title: MiniMax / MiniClaw 使用指南
category: 16-ai-coding-tools
tags: ["ai-coding", "code-generation", "cursor", "github-copilot"]
summary: "> **一句话**: MiniMax 提供高性价比的模型 API 和编程辅助，MiniClaw（VS Code + Cline + MiniMax）是稳定的 AI 编程组合。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Minimax Guide"
  - "MiniMax Guide"
  - MiniMax_Guide

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# MiniMax / MiniClaw 使用指南

> **一句话**: MiniMax 提供高性价比的模型 API 和编程辅助，MiniClaw（VS Code + Cline + MiniMax）是稳定的 AI 编程组合。

---

## 1. 概述

### 定位

| 维度 | 说明 |
|------|------|
| **类型** | AI 模型平台 + 编程辅助 |
| **开发商** | MiniMax（稀宇科技） |
| **组合方式** | VS Code + Cline + MiniMax API |
| **适用** | 全栈项目开发、数据库构建、技能训练 |
| **官网** | https://platform.minimaxi.com |

### 核心能力

```
MiniMax 生态:
├── MiniMax 模型平台
│   ├── 文本生成模型
│   ├── 语音合成（TTS）
│   ├── 视频生成
│   └── 高性价比推理
├── MiniClaw 工作流
│   ├── VS Code（IDE）
│   ├── Cline（AI 编程插件）
│   └── MiniMax API（模型后端）
└── 订阅方案
    └── Plus-极速版月度套餐
```

---

## 2. 账户与额度

| 项目 | 详情 |
|------|------|
| **管理页面** | https://platform.minimaxi.com/user-center/payment/token-plan |
| **套餐** | Plus-极速版月度套餐 |
| **月费** | ¥98/月 |
| **额度** | 1,500 次模型调用 / 5 小时 |
| **状态** | 活跃 |

---

## 3. 快速开始

### 3.1 获取 API Key

1. 注册并登录 https://platform.minimaxi.com
2. 进入 **Token Plan** 页面
3. 订阅 Plus-极速版月度套餐
4. 在 API Keys 页面创建密钥

### 3.2 配置 VS Code + Cline + MiniMax

```bash
# 1. 安装 VS Code（如未安装）
# https://code.visualstudio.com

# 2. 安装 Cline 插件
# VS Code 扩展商店搜索 "Cline" 并安装

# 3. 配置 Cline 使用 MiniMax
# Cline 设置 → API Provider → Custom / OpenAI Compatible
# Base URL: https://api.minimaxi.com/v1
# API Key: 你的 MiniMax API Key
# Model: 选择 MiniMax 模型
```

### 3.3 开发流程

1. 在 VS Code 中打开项目
2. 打开 Cline 侧边栏
3. 描述编程需求
4. Cline 调用 MiniMax API 生成代码
5. 审核并应用修改

---

## 4. 使用场景与输出

| 输出项目 | 说明 | 使用组合 |
|----------|------|----------|
| **ALL-DB** | 全量数据库项目 | MiniClaw |
| **meos** | 管理系统 | MiniClaw |
| **skills4coder** | 编程技能训练 | MiniClaw |

---

## 5. 最佳实践

- 1,500 次/月调用额度，平均每天约 50 次，合理规划使用
- MiniMax 模型中文能力强，适合中文场景项目
- 配合 Cline 的 Auto-approve 模式可加速开发，但需注意代码审查
- ¥98/月的价格极具性价比，适合日常开发使用

---

## 6. 注意事项

- 套餐额度按周期重置，注意监控用量
- 极速版有 5 小时使用时长限制
- MiniMax 模型在英文代码生成方面表现优秀，中文理解能力突出
- API 调用建议做好错误处理和重试机制

---

*最后更新: 2026-05*

## Related

- [[AI编程/Theory/AI_Coding_Theory]] — AI辅助编程理论基础 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[AI编程/Tools/CodeBuddy_Guide]] — CodeBuddy / WorkBuddy 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[AI编程/Tools/Comate_Guide]] — Comate 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[AI编程/Tools/Coze_Guide]] — Coze 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
