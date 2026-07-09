---
title: Qwen (通义千问) 使用指南
category: 16-ai-coding-tools
tags: ["ai-coding", "code-generation", "cursor", "github-copilot"]
summary: "> **一句话**: 阿里通义千问提供 Token Plan 团队版，¥198/座席/月，25,000 Credits，通过 OpenClaw + Qwen 组合进行 AI 编程。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Qwen Guide"
  - Qwen_Guide

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Qwen (通义千问) 使用指南

> **一句话**: 阿里通义千问提供 Token Plan 团队版，¥198/座席/月，25,000 Credits，通过 OpenClaw + Qwen 组合进行 AI 编程。

---

## 1. 概述

### 定位

| 维度 | 说明 |
|------|------|
| **类型** | AI [[_concepts/ai-technology-landscape|大语言模型]] + API 平台 |
| **开发商** | 阿里云 (Alibaba Cloud) |
| **接入方式** | OpenClaw + Qwen Token Plan |
| **适用** | 认知系统开发、深度编程 |
| **官网** | https://platform.qianwenai.com |

### 核心能力

```
Qwen 生态:
├── 通义千问模型
│   ├── Qwen-Max（旗舰）
│   ├── Qwen-Plus（平衡）
│   ├── Qwen-Turbo（快速）
│   └── Qwen-Coder（代码专用）
├── Token Plan
│   └── 团队版 — 标准席位
└── 接入组合
    └── OpenClaw + Qwen API
```

---

## 2. 账户与额度

| 项目 | 详情 |
|------|------|
| **管理页面** | https://platform.qianwenai.com/home/billing/subscription/token-plan |
| **套餐** | Token Plan 团队版 |
| **月费** | ¥198.00/座席/月 |
| **月度 Credits** | 25,000 |
| **刷新日期** | 0620 |
| **状态** | 额度耗尽，等待刷新 |

---

## 3. 快速开始

### 3.1 获取 API Key

1. 访问 https://platform.qianwenai.com
2. 订阅 Token Plan 团队版
3. 在 API Keys 页面创建密钥

### 3.2 OpenClaw + Qwen 配置

```bash
# OpenClaw 配置 Qwen Provider
# 编辑配置文件

{
  "provider": "qwen",
  "apiKey": "your-qwen-api-key",
  "model": "qwen-coder-plus"
}
```

### 3.3 开发流程

1. 在 OpenClaw 中打开项目
2. 配置 Qwen 作为后端模型
3. 通过 Agent 模式进行编程

---

## 4. 使用场景与输出

| 输出项目 | 说明 | 使用组合 |
|----------|------|----------|
| **open-cognition** | 认知系统开发 | OpenClaw + Qwen Token Plan |

---

## 5. 最佳实践

- 25,000 Credits/月，按任务复杂度合理分配
- Qwen-Coder 模型在代码生成上表现更优，编程场景优先选择
- ¥198/座席/月的成本中等，需评估性价比
- OpenClaw 的 Agent 模式可最大化 Qwen 的编程能力

---

## 6. 注意事项

- Token Plan 额度不累积，月底清零
- 团队版支持多座席，可按需扩展
- Qwen API 的中文能力在国产模型中表现优秀

---

*最后更新: 2026-05*

## Related

- [[AI编程/Theory/AI_Coding_Theory]] — AI辅助编程理论基础 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[AI编程/Tools/CodeBuddy_Guide]] — CodeBuddy / WorkBuddy 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[AI编程/Tools/Comate_Guide]] — Comate 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[AI编程/Tools/Coze_Guide]] — Coze 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
