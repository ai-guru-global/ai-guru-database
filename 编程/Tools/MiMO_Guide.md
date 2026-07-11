---
title: MiMO 使用指南
category: 16-ai-coding-tools
tags: ["ai-coding", "code-generation", "cursor", "github-copilot"]
summary: "> **一句话**: MiMO 是高性价比的 AI 模型平台，年度 Standard 套餐 ¥1,045，与 Hermes Agent 搭配是极速优质编程组合，但年度额度已消耗三分之一需控制节奏。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Mimo Guide"
  - "MiMO Guide"
  - MiMO_Guide
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# MiMO 使用指南

> **一句话**: MiMO 是高性价比的 AI 模型平台，年度 Standard 套餐 ¥1,045，与 Hermes Agent 搭配是极速优质编程组合，但年度额度已消耗三分之一需控制节奏。

---

## 1. 概述

### 定位

| 维度 | 说明 |
|------|------|
| **类型** | AI 模型 API 平台 |
| **订阅等级** | 年度 Standard 套餐 |
| **核心组合** | Claude + MiMO / Hermes + MiMO |
| **适用** | 全量数据库、高并发模型调用 |
| **官网** | https://platform.xiaomimimo.com |

### 核心能力

```
MiMO 生态:
├── MiMO 模型平台
│   ├── 高速推理
│   ├── 优质输出
│   └── 大折扣套餐
├── 接入组合
│   ├── Claude + MiMO — 通过 Claude 接入 MiMO
│   └── Hermes + MiMO — 通过 Hermes Agent 接入
└── 套餐优势
    └── 折扣大，高速优质，与 Hermes 绝配
```

---

## 2. 账户与额度

| 项目 | 详情 |
|------|------|
| **管理页面** | https://platform.xiaomimimo.com/console/plan-manage |
| **套餐** | 年度 Standard |
| **费用** | ¥1,045/年 |
| **订阅日期** | 2026-05-18 |
| **消耗状态** | 已用 1/3 |
| **状态** | 需控制使用节奏 |

---

## 3. 快速开始

### 3.1 获取 API Key

1. 访问 https://platform.xiaomimimo.com
2. 订阅年度 Standard 套餐
3. 创建 API Key

### 3.2 Hermes + MiMO 配置

```bash
# Hermes Agent 配置 MiMO
# 编辑 hermes 配置

hermes config set provider custom
hermes config set base-url https://api.xiaomimimo.com/v1
hermes config set api-key your-mimo-api-key
hermes config set model mimo-standard
```

### 3.3 Claude + MiMO 配置

```bash
# 在 Claude 或其他支持 OpenAI 兼容 API 的工具中
# Base URL: https://api.xiaomimimo.com/v1
# API Key: your-mimo-api-key
```

---

## 4. 使用场景与输出

| 输出项目 | 说明 | 使用组合 |
|----------|------|----------|
| **all-db** | 全量数据库构建 | Hermes + MiMO |

---

## 5. 最佳实践

- **额度节奏控制**: 年度额度已消耗 1/3（约 2 周内），需放慢使用频率
- **与 Hermes 绝配**: MiMO 的高速优质推理与 Hermes 的 Agent 能力形成最佳组合
- **折扣优势**: ¥1,045/年 的价格极具竞争力
- **优先级使用**: 将 MiMO 留给最重要的任务，日常使用其他工具

---

## 6. 注意事项

- **关键**: 年度套餐已用 1/3，需控制节奏，避免过早耗尽
- 年度套餐不按月刷新，用完即止
- 建议制定月度使用预算，确保全年均衡使用
- 高优先级任务使用 MiMO，低优先级切换到其他模型

---

## 7. 额度消耗规划

| 时间段 | 建议使用量 | 说明 |
|--------|-----------|------|
| 第 1-3 月 | 25% | 当前已用 33%，需减速 |
| 第 4-6 月 | 25% | 稳定使用 |
| 第 7-9 月 | 25% | 稳定使用 |
| 第 10-12 月 | 25% | 年末冲刺 |

---

*最后更新: 2026-05*

## Related

- [[编程/Theory/AI_Coding_Theory]] — AI 辅助编程理论基础 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[编程/Tools/CodeBuddy_Guide]] — CodeBuddy / WorkBuddy 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[编程/Tools/Comate_Guide]] — Comate 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[编程/Tools/Coze_Guide]] — Coze 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
