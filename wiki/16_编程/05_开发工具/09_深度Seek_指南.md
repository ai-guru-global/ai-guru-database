---
title: DeepSeek 使用指南
category: 16-ai-coding-tools
tags: ["ai-coding", "code-generation", "cursor", "github-copilot"]
summary: "> **一句话**: DeepSeek 提供高性价比的 AI 编程辅助，余额 ¥68，月消费约 ¥36，通过 deepseek-tio 工具接入。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Deepseek Guide"
  - "DeepSeek Guide"
  - DeepSeek_Guide
sources: []

name_zh: "DeepSeek 使用指南"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# DeepSeek 使用指南

> 中文简称：DeepSeek 使用指南

> **一句话**: DeepSeek 提供高性价比的 AI 编程辅助，余额 ¥68，月消费约 ¥36，通过 deepseek-tio 工具接入。

---

## 1. 概述

### 定位

| 维度 | 说明 |
|------|------|
| **类型** | AI [[概念/ai-technology-landscape|大语言模型]] + 编程工具 |
| **开发商** | DeepSeek（深度求索） |
| **接入方式** | deepseek-tio |
| **适用** | 日常编程、代码生成 |
| **官网** | https://platform.deepseek.com |

### 核心能力

```
DeepSeek 生态:
├── DeepSeek 模型
│   ├── DeepSeek-V3（通用）
│   ├── DeepSeek-Coder（编程专用）
│   └── DeepSeek-R1（推理）
├── deepseek-tio
│   └── 终端集成工具
└── 计费
    └── 按量付费（余额制）
```

---

## 2. 账户与额度

| 项目 | 详情 |
|------|------|
| **当前余额** | ¥68 |
| **本月消费** | ¥36 |
| **计费模式** | 按量付费 |
| **状态** | 额度耗尽（余额可继续使用但需关注） |

---

## 3. 快速开始

### 3.1 获取 API Key

1. 访问 https://platform.deepseek.com
2. 注册/登录
3. 创建 API Key
4. 充值余额

### 3.2 deepseek-tio 配置

```bash
# deepseek-tio 配置
# 设置 API Key 和模型

export DEEPSEEK_API_KEY=your-api-key
deepseek-tio config set model deepseek-coder
```

---

## 4. 使用场景与输出

| 使用场景 | 说明 |
|----------|------|
| 日常编程辅助 | 通过 deepseek-tio 接入 |

---

## 5. 最佳实践

- 按量付费模式，注意控制单次调用消耗
- DeepSeek-Coder 模型在代码生成方面性价比极高
- 月消费 ¥36 左右，属于低成本工具
- 余额 ¥68 可支撑约 2 个月的正常使用

---

## 6. 注意事项

- 余额制计费，余额耗尽后服务暂停
- 建议设置余额预警，及时充值
- DeepSeek 的价格优势明显，适合高频日常使用

---

*最后更新: 2026-05*

## Related

- [[16_编程/02_理论基础/01_AI_编程_理论]] — AI辅助编程理论基础 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[16_编程/05_开发工具/04_CodeBuddy_指南]] — CodeBuddy / WorkBuddy 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[16_编程/05_开发工具/06_Comate_指南]] — Comate 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[16_编程/05_开发工具/07_Coze_指南]] — Coze 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
