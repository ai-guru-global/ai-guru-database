---
title: "OpenAI Codex 概览"
category: "16-ai-coding-tools"
tags: ["tool", "ai-coding", "agent", "openai", "codex", "cli"]
summary: "OpenAI 出品的轻量级编程 Agent,可在终端本地运行,也可在云端异步执行代码任务,支持 ChatGPT 订阅直接使用。"
sources:
  - "https://github.com/openai/codex"
  - "https://chatgpt.com/codex"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: supporting
aliases:
  - "Codex Openai Overview"
  - "codex openai overview"
  - codex-openai_overview

name_zh: "OpenAI Codex 概览"
---
# OpenAI Codex 概览

> 中文简称：OpenAI Codex 概览

> **一句话理解**: OpenAI 出品的轻量级编程 Agent,可在终端本地运行,也可在云端异步执行代码任务。

## 产品形态

| 形态 | 说明 | 使用方式 |
|------|------|---------|
| **Codex CLI** | 终端本地运行的编程 Agent | codex 命令 |
| **Codex App** | 桌面应用 | codex app 或网页 |
| **Codex Web** | 云端异步 Agent | chatgpt.com/codex |
| **IDE 集成** | VS Code / Cursor / Windsurf 插件 | IDE 内使用 |

## 核心特性

- **本地执行**: CLI 版本完全在本地运行,代码不离开你的机器
- **沙箱安全**: 在沙箱环境中执行代码,防止意外修改
- **多模型支持**: 使用 OpenAI 最新模型(o3、o4-mini 等)
- **ChatGPT 集成**: 可直接使用 ChatGPT Plus/Pro/Business 订阅
- **异步任务**: Codex Web 支持后台异步执行长时间任务

## 安装

```bash
# macOS / Linux
curl -fsSL https://chatgpt.com/codex/install.sh | sh

# Windows
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"

# npm
npm install -g @openai/codex

# Homebrew
brew install --cask codex
```

## 与其他工具对比

| 维度 | Codex CLI | Claude Code | Gemini CLI |
|------|-----------|-------------|------------|
| 厂商 | OpenAI | Anthropic | Google |
| 运行方式 | 本地终端 | 本地终端 | 本地终端 |
| 语言 | Rust | TypeScript | TypeScript |
| 云执行 | Codex Web | 无 | 无 |
| 定价 | ChatGPT 订阅/API | 按 token | 免费额度大 |

> **关联**: -> [[16_编程/README|AI 编程]] | [[16_编程/01_编程基础/01_AI编程2026指南|AI 编程 2026 全景指南]]

## Related

- [[16_编程/README|编程 (AI Coding)]]
