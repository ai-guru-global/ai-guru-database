---
title: Grok / Grok Code 使用指南
category: 17-ai-coding-02-tools
tags: ["ai-coding", "code-generation", "cursor", "github-copilot"]
summary: "> **一句话**: xAI 的 Grok 搭配 X Premium+ 订阅，通过龙虾（Lobechat/第三方客户端）接入可实现无限制 Credit 的高频会话，是性价比极高的编程辅助工具。"
created: 2026-05-31
updated: 2026-05-31
---

# Grok / Grok Code 使用指南

> **一句话**: xAI 的 Grok 搭配 X Premium+ 订阅，通过龙虾（Lobechat/第三方客户端）接入可实现无限制 Credit 的高频会话，是性价比极高的编程辅助工具。

---

## 1. 概述

### 定位

| 维度 | 说明 |
|------|------|
| **类型** | AI 聊天 + 编程助手 |
| **开发商** | xAI (Elon Musk) |
| **订阅等级** | X Premium+ |
| **模型** | Grok 4.2-beta 等 |
| **适用** | 数据库构建、小说生成、多项目并行开发 |
| **官网** | https://x.ai |

### 核心能力

```
Grok 生态:
├── Grok Chat — 通用 AI 对话
│   ├── 实时信息获取（X 平台数据）
│   ├── 长上下文对话
│   └── 多模态理解
├── Grok Code — 编程专用模式
│   ├── 代码生成与调试
│   ├── 多语言支持
│   └── 项目级代码理解
└── 接入方式
    ├── 官方 Web/App
    └── 龙虾 (第三方客户端) — 无限制会话
```

---

## 2. 账户与额度

| 项目 | 详情 |
|------|------|
| **订阅** | X Premium+ |
| **接入方式** | 龙虾客户端 |
| **会话限制** | 2 小时 50 次会话（龙虾接入） |
| **Credit 限制** | 无限制 |
| **状态** | 活跃 |

---

## 3. 快速开始

### 3.1 订阅 X Premium+

1. 访问 https://x.com/settings/account 订阅 Premium+
2. 确认订阅生效

### 3.2 通过龙虾接入

1. 配置龙虾客户端连接 xAI API
2. 使用 X Premium+ 账户认证
3. 选择 Grok 模型开始对话

### 3.3 Grok Code 使用

1. 在龙虾或官方界面选择 Grok Code 模式
2. 描述编程需求
3. 获取代码生成结果
4. 迭代修改直到满意

---

## 4. 使用场景与输出

| 输出项目 | 说明 | 推荐模式 |
|----------|------|----------|
| **x-db** | 数据库项目 | Grok Code |
| **saull-db** | 数据库项目 | Grok Code |
| **fintech-db** | 金融数据库 | Grok Code |
| **novels** | 小说生成 | Grok Chat |
| **all-db** (配合 Hermes) | 全量数据库构建 | Grok 4.2-beta + Hermes |

---

## 5. 最佳实践

- 龙虾接入 2 小时 50 次会话，合理规划会话频率
- 利用 Grok 无限制 Credit 的优势处理高消耗任务（如大量代码生成、数据库设计）
- 配合 Hermes Agent + Grok 4.2-beta 实现自动化编程工作流
- 数据库构建项目可直接用 Grok Code 生成 schema + seed data
- 小说类创意项目利用 Grok Chat 的长上下文能力

---

## 6. 注意事项

- 龙虾接入有 2 小时窗口限制，建议集中处理高优先级任务
- Premium+ 订阅费用需持续关注
- Grok 的实时 X 数据可辅助信息收集类任务
- 无限制 Credit 是相比其他工具的最大优势，应充分利用

---

## 7. 组合推荐

| 组合 | 说明 |
|------|------|
| **Hermes + Grok** | 通过 Hermes Agent 接入 Grok API，实现自动化 Agent 编程 |
| **Grok + MiMO** | Grok 4.2-beta + MiMO 模型互为补充 |
| **龙虾 + Grok** | 通过龙虾客户端绕过官方限制，最大化利用率 |

---

*最后更新: 2026-05*

## Related

- [[16_AI_Coding/Theory/AI_Coding_Theory]] — AI 辅助编程理论基础 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[16_AI_Coding/Tools/CodeBuddy_Guide]] — CodeBuddy / WorkBuddy 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[16_AI_Coding/Tools/Comate_Guide]] — Comate 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[16_AI_Coding/Tools/Coze_Guide]] — Coze 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[16_AI_Coding/Tools/Monica_Guide.md|Monica_Guide]]
