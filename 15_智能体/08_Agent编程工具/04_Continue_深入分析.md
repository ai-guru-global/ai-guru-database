---
title: "Continue: 开源 AI 代码助手"
category: "15-agent-production-agentic-coding-tools"
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> **一句话理解**: Continue 是开源 AI 代码助手——VS Code/JetBrains 插件、多模型支持、代码补全/搜索/生成，IDE 内置的 AI 编程工具。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Continue Deep Dive"
  - Continue_Deep_Dive
sources: []

name_zh: "Continue: 开源 AI 代码助手"
---
# Continue: 开源 AI 代码助手

> 中文简称：Continue: 开源 AI 代码助手

> **一句话理解**: Continue 是开源 AI 代码助手——VS Code/JetBrains 插件、多模型支持、代码补全/搜索/生成，IDE 内置的 AI 编程工具。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级用法](#5-高级用法)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Continue: 开源 AI 代码助手
═══════════════════════════════════════════════════════════════════

定位: 开源 AI 代码助手 IDE 插件，支持 VS Code/JetBrains，多模型支持

核心理念:
───────────────────────────────────────────────────────────────────
• 开源: Apache 2.0，完全免费
• 多 IDE: VS Code/JetBrains
• 多模型: OpenAI/Claude/本地
• 上下文: 代码库语义理解
• 自定义: 灵活配置
• 隐私: 本地优先
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **代码补全** | 行级/函数级补全 |
| **代码搜索** | 语义代码搜索 |
| **代码生成** | 多行生成 |
| **问答** | 代码库问答 |
| **多模型** | 20+ 模型支持 |
| **自定义** | 提示词/快捷键 |

### 1.3 支持模型

| 类别 | 模型 |
|------|------|
| **OpenAI** | GPT-4o/4-turbo |
| **Anthropic** | Claude 3.5/3 |
| **本地** | Ollama 模型 |
| **自定义** | Any OpenAI compatible |

---

## 2. 核心概念

### 2.1 工作模式

```
Continue 工作模式
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Continue 工作模式                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. 补全模式 (Tab)                                                │
│  ───────────────────────────────────────────────────────────   │
│  输入: def calculate_                                             │
│  输出: def calculate_metrics(data: list) -> dict:                │
│                                                                   │
│  2. 聊天模式 (@)                                                 │
│  ───────────────────────────────────────────────────────────   │
│  @codebase 解释这段代码逻辑                                       │
│  @file src/main.py 显示文件内容                                   │
│  @web 搜索最新 React 文档                                         │
│                                                                   │
│  3. 操作模式 (/)                                                  │
│  ───────────────────────────────────────────────────────────   │
│  /edit 重写函数                                                  │
│  /test 生成测试                                                  │
│  /comment 添加文档                                                │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 上下文引用

```
@ 引用系统
═══════════════════════════════════════════════════════════════════

@codebase - 搜索整个代码库
@file - 引用特定文件
@git - Git diff/历史
@docs - 项目文档
@web - 网络搜索
@problems - LSP 错误
@terminal - 终端输出
```

---

## 3. 架构设计

### 3.1 系统架构

```
Continue 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Continue 架构                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              IDE Plugin (VS Code / JetBrains)            │   │
│   │  • 补全 UI                                              │   │
│   │  • 聊天面板                                             │   │
│   │  • 快捷键绑定                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Continue Core                                │   │
│   │  • Context Manager (代码库索引)                        │   │
│   │  • Prompt Builder (上下文组装)                          │   │
│   │  • LLM Adapter (模型适配)                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Model Providers                             │   │
│   │  • OpenAI                                             │   │
│   │  • Anthropic                                         │   │
│   │  • Ollama (本地)                                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# VS Code: 在扩展商店搜索 "Continue"
# JetBrains: 在插件市场搜索 "Continue"

# 或使用手动安装
git clone https://github.com/continuedev/continue
cd continue
npm install && npm run build
```

### 4.2 配置

```json
// ~/.continue/config.json
{
  "models": [
    {
      "title": "Claude 3.5",
      "provider": "anthropic",
      "model": "claude-3-5-sonnet-20240620",
      "api_key": "sk-ant-xxxx"
    },
    {
      "title": "GPT-4o",
      "provider": "openai",
      "model": "gpt-4o",
      "api_key": "sk-xxxx"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Starcoder",
    "provider": "ollama",
    "model": "starcoder"
  }
}
```

### 4.3 基本使用

```bash
# 打开项目
code my-project

# 快捷键
# Cmd/Ctrl + L: 打开聊天
# Cmd/Ctrl + K: 编辑选中的代码
# Tab: 接受补全
```

### 4.4 代码问答

```
# 在 Continue 聊天中输入:
@codebase 这个模块的架构是怎样的？

# 回答:
根据代码分析，main.py 包含以下模块:
- App: 主应用类，处理请求路由
- Database: 数据库连接管理
- Cache: Redis 缓存层
- Logger: 日志记录
...
```

---

## 5. 高级用法

### 5.1 自定义快捷键

```json
// VS Code keybindings.json
[
  {
    "key": "cmd+shift+g",
    "command": "continue.chatWithSelection",
    "when": "editorTextFocus"
  }
]
```

### 5.2 自定义提示词

```python
# ~/.continue/config.py
from continuedev.src.continuedev.core.main import (
    IDEFmts,
    Prompts,
)

custom_prompts = Prompts(
    model_prompt_override=(
        "You are a senior code reviewer with 20 years of experience. "
        "Always provide detailed, actionable feedback. "
        "Format your responses with code examples when helpful."
    ),
    system_message=(
        "你是一个专业的代码审查助手，"
        "专注于代码质量和性能优化。"
    )
)
```

### 5.3 本地模型配置

```json
// 配置 Ollama 本地模型
{
  "models": [
    {
      "title": "Llama 3.1 本地",
      "provider": "ollama",
      "model": "llama3.1",
      "api_base": "http://localhost:11434"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Codellama",
    "provider": "ollama",
    "model": "codellama",
    "api_base": "http://localhost:11434"
  }
}
```

---

## 6. 对比与选择

### 6.1 AI 编程插件对比

| 维度 | Continue | GitHub Copilot | Cursor |
|------|----------|----------------|--------|
| **开源** | ⭐⭐⭐⭐⭐ | ❌ | 部分 |
| **多 IDE** | ⭐⭐⭐⭐⭐ | VS Code | 专用 |
| **多模型** | ⭐⭐⭐⭐⭐ | 绑定 | 绑定 |
| **自定义** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **免费** | ⭐⭐⭐⭐⭐ | 付费 | 免费/Pro |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 开源用户 | Continue |
| VS Code 用户 | Copilot/Continue |
| 跨 IDE | Continue |
| JetBrains 用户 | Continue |

---

## 参考资源

- [Continue GitHub](https://github.com/continuedev/continue)
- [Continue 文档](https://docs.continue.dev/)
- [Continue Marketplace](https://continue.dev/docs/welcome)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## 相关链接

- [[15_智能体/08_Agent编程工具/Agentic_Coding_Tools_Overview|Agentic Coding 工具概览]] — 工具全景对比
- [[15_智能体/08_Agent编程工具/03_Claude_Code_深入分析|Claude Code 深度解析]] — 同类编程工具对比
- [[15_智能体/08_Agent编程工具/07_OpenCode_深入分析|OpenCode 深度解析]] — 同类开源工具对比
- [[15_智能体/08_Agent编程工具/index|Agentic Coding 索引]] — 工具主题导览
- [[16_编程/index|编程索引]] — AI 编程主题导览
- [[18_行业应用/18_代码生成/Code_Generation_index|代码生成索引]] — 代码生成应用
