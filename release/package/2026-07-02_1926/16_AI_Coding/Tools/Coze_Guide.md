---
title: Coze 使用指南
category: 16-ai-coding-tools
tags: ["ai-coding", "code-generation", "cursor", "github-copilot", "coze"]
summary: "> **一句话**: Coze 是字节跳动推出的 AI Bot 构建平台，支持基于公众号和知识库进行深度课题研究。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Coze Guide"
  - Coze_Guide
sources: []

---
# Coze 使用指南

> **一句话**: Coze 是字节跳动推出的 AI Bot 构建平台，支持基于公众号和知识库进行深度课题研究。

---

## 1. 概述

### 定位

| 维度 | 说明 |
|------|------|
| **类型** | AI Bot / Agent 构建平台 |
| **开发商** | 字节跳动 (ByteDance) |
| **适用** | 深度课题研究、知识库问答、自动化工作流 |
| **官网** | https://www.coze.cn (国内) / https://www.coze.com (国际) |

### 核心能力

```
Coze 平台:
├── Bot 构建
│   ├── 可视化工作流编排
│   ├── 多模型选择
│   └── 插件市场
├── 知识库
│   ├── 文档上传与索引
│   ├── 公众号内容接入
│   ├── 数据库连接
│   └── 自动知识更新
├── 研究模式
│   ├── 深度课题研究
│   ├── 多轮对话分析
│   └── 引用溯源
└── 发布渠道
    ├── 网页 Bot
    ├── API 接口
    └── 多平台集成
```

---

## 2. 账户与额度

| 项目 | 详情 |
|------|------|
| **管理页面** | Coze 平台后台 |
| **额度** | 按平台规则 |
| **状态** | 活跃 |

---

## 3. 快速开始

### 3.1 创建研究 Bot

1. 登录 https://www.coze.cn
2. 点击 **创建 Bot**
3. 选择 **研究模式** 或 **对话模式**
4. 配置知识库源（公众号 / 文档 / DB）

### 3.2 知识库配置

1. 进入 Bot 设置 → **知识库**
2. 添加数据源:
   - 公众号文章（RSS/API 接入）
   - 文档上传（PDF / Word / Markdown）
   - 数据库连接（MySQL / PostgreSQL）
3. 设置索引策略和更新频率

### 3.3 深度研究工作流

```
研究流程:
1. 定义研究课题 → 输入 Bot
2. Bot 自动检索知识库 → 获取相关材料
3. 多轮对话深入分析 → 逐步细化
4. 生成结构化报告 → 输出结果
```

---

## 4. 使用场景与输出

| 使用场景 | 说明 |
|----------|------|
| **深度课题研究** | 基于知识库的深度分析 |
| **公众号 + DB 深度研究** | 结合公众号内容和数据库进行综合研究 |

---

## 5. 最佳实践

- 知识库是 Coze 的核心竞争力，投入时间构建高质量知识库
- 公众号内容定期同步更新，保持知识库时效性
- 复杂研究课题拆分为子课题，分别创建 Bot 处理
- 利用 Coze 的工作流编排实现自动化研究流程

---

## 6. 注意事项

- 国内版 (coze.cn) 和国际版 (coze.com) 功能和模型有差异
- 知识库文档建议使用 UTF-8 编码
- 大型知识库可能需要较长的索引时间

---

*最后更新: 2026-05*

## Related

- [[16_AI_Coding/Theory/AI_Coding_Theory]] — AI辅助编程理论基础 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[16_AI_Coding/Tools/CodeBuddy_Guide]] — CodeBuddy / WorkBuddy 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[16_AI_Coding/Tools/Comate_Guide]] — Comate 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[16_AI_Coding/Tools/Cursor_Guide]] — Cursor 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[16_AI_Coding/Tools/Hermes_Agent_2026.md|Hermes_Agent_2026]]
