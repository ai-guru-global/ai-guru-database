---
title: Kimi Code / Kimi Chat 使用指南
category: 16-ai-coding-tools
tags: ["ai-coding", "code-generation", "cursor", "github-copilot"]
summary: "> **一句话**: 月之暗面 Kimi 提供 Code（编程）和 Chat（对话）两种模式，Allegretto 套餐 ¥159/月，是稳定的国产 AI 编程辅助工具。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Kimi Guide"
  - Kimi_Guide
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Kimi Code / Kimi Chat 使用指南

> **一句话**: 月之暗面 Kimi 提供 Code（编程）和 Chat（对话）两种模式，Allegretto 套餐 ¥159/月，是稳定的国产 AI 编程辅助工具。

---

## 1. 概述

### 定位

| 维度 | 说明 |
|------|------|
| **类型** | AI 编程助手 + 通用对话 |
| **开发商** | 月之暗面 (Moonshot AI) |
| **产品线** | Kimi Code（编程）、Kimi Chat（通用对话） |
| **接入方式** | Kimi CLI / Web |
| **适用** | 数据库构建、管理系统、技能开发 |
| **官网** | https://kimi.moonshot.cn |

### 核心能力

```
Kimi 生态:
├── Kimi Chat — 通用 AI 对话
│   ├── 长文档分析（200万字上下文）
│   ├── 联网搜索
│   └── 文件处理
├── Kimi Code — 编程专用
│   ├── 代码生成与调试
│   ├── 项目理解
│   └── 多语言支持
└── Kimi CLI — 命令行工具
    ├── 终端集成
    ├── 项目级操作
    └── 自动化脚本
```

---

## 2. 账户与额度

| 项目 | 详情 |
|------|------|
| **套餐** | Allegretto → 调整为 ¥159/月 |
| **年付** | ¥1,908/年 |
| **额度周期** | 周额度制 |
| **刷新时间** | 每周恢复（06 月恢复） |
| **状态** | 活跃（年付套餐已恢复 0524） |

---

## 3. 快速开始

### 3.1 Web 使用

1. 访问 https://kimi.moonshot.cn
2. 登录账户
3. Kimi Chat: 直接对话
4. Kimi Code: 切换到 Code 模式

### 3.2 Kimi CLI 安装与配置

```bash
# 安装 Kimi CLI（如有）
npm install -g kimi-cli
# 或
pip install kimi-cli

# 配置
kimi config set api-key your-api-key
```

---

## 4. 使用场景与输出

| 输出项目 | 说明 | 使用组合 |
|----------|------|----------|
| **all-db** | 全量数据库构建 | Kimi CLI |
| **meos** | 管理系统 | Kimi CLI |
| **skills4coder** | 编程技能训练 | Kimi CLI |

---

## 5. 最佳实践

- **年付套餐更划算**: ¥1,908/年 vs ¥159×12=¥1,908/年（等价，但年付通常有额外权益）
- **周额度管理**: 注意额度刷新时间，避免关键任务中断
- **Kimi Chat 的长上下文**: 利用 200 万字上下文窗口处理大型文档分析
- **Kimi CLI + all-db**: CLI 模式适合批量数据库操作

---

## 6. 注意事项

- 周额度用尽后需等待恢复（近期 0527 已恢复，06 月恢复正常周期）
- 年付套餐已恢复（0524），额度应更稳定
- Kimi 的长上下文能力是区别于其他工具的核心优势
- CLI 工具适合自动化场景，Web 适合交互式对话

---

*最后更新: 2026-05*

## Related

- [[AI编程/Theory/AI_Coding_Theory]] — AI辅助编程理论基础 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[AI编程/Tools/CodeBuddy_Guide]] — CodeBuddy / WorkBuddy 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[AI编程/Tools/Comate_Guide]] — Comate 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[AI编程/Tools/Coze_Guide]] — Coze 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[AI编程/Practice/Vibe_Coding_Real_World_Cases.md|Vibe_Coding_Real_World_Cases]]
