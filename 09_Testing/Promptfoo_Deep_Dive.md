---
title: "Promptfoo: LLM Prompt 测试框架"
category: "09-testing"
tags: ["testing", "ai-testing", "prompt-testing", "evaluation", "llm"]
summary: "> **一句话理解**: Promptfoo 是 LLM Prompt 测试框架——批量测试、多模型对比、回归测试、自定义评分，Prompt 工程的 CI/CD。"
created: "2026-05-31"
updated: "2026-05-31"
---

# Promptfoo: LLM Prompt 测试框架

> **一句话理解**: Promptfoo 是 LLM Prompt 测试框架——批量测试、多模型对比、回归测试、自定义评分，Prompt 工程的 CI/CD。

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
Promptfoo: LLM Prompt 测试框架
═══════════════════════════════════════════════════════════════════

定位: 面向 LLM 应用的测试框架，批量测试 prompts 和模型，快速迭代

核心理念:
───────────────────────────────────────────────────────────────────
• 测试驱动: Prompt 开发测试先行
• 多模型: 对比多个模型效果
• 回归检测: 自动检测质量下降
• 自定义评分: 灵活的质量评估
• CI/CD 集成: 自动化测试流程
• 本地优先: 开源自托管
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **批量测试** | 一次测试多个 cases |
| **多模型对比** | 对比不同模型 |
| **变量替换** | 动态模板 |
| **自定义评分** | LLM-as-Judge |
| **回归测试** | 自动质量追踪 |
| **CI/CD** | GitHub Actions 集成 |

---

## 2. 核心概念

### 2.1 测试配置

```yaml
# promptfooconfig.yaml
prompts:
  - id: prompt_v1
    name: Customer Support v1
    file: prompts/support_v1.txt

  - id: prompt_v2
    name: Customer Support v2
    file: prompts/support_v2.txt

providers:
  - id: openai-gpt4
    name: GPT-4
    model: gpt-4o

  - id: anthropic-claude
    name: Claude 3.5
    model: claude-3-5-sonnet-20240620

testSets:
  - name: basic
    filepath: testsets/basic.csv

  - name: edge_cases
    filepath: testsets/edge_cases.csv
```

### 2.2 评分器类型

| 评分器 | 说明 |
|------|------|
| **llmJudge** | LLM 自动评分 |
| **contains** | 包含检查 |
| **containsAny** | 包含任一 |
| **similar** | 语义相似 |
| **regex** | 正则匹配 |
| **javaScript** | 自定义 JS |

---

## 3. 架构设计

### 3.1 系统架构

```
Promptfoo 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Promptfoo 架构                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Configuration Layer                          │   │
│   │  • YAML 配置                                            │   │
│   │  • Test Sets (CSV/JSON)                               │   │
│   │  • Prompts (文本文件)                                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Test Runner                                  │   │
│   │  • 并行执行                                            │   │
│   │  • 变量替换                                            │   │
│   │  • 评分计算                                            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Evaluators                                   │   │
│   │  • LLM Judge                                           │   │
│   │  • String Match                                        │   │
│   │  • Regex                                               │   │
│   │  • Custom JS                                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
npm install -g promptfoo
```

### 4.2 创建配置

```yaml
# promptfooconfig.yaml
prompts:
  - id: my_prompt
    file: ./prompt.txt

providers:
  - id: openai-chat
    name: GPT-4
    api-key: ${OPENAI_API_KEY}
    configuration:
      model: gpt-4o

testSets:
  - name: test_cases
    prompts:
      - vars:
          input: "Hello, how are you?"
          context: "User is greeting"

scenarios:
  - name: basic_test
    description: "Basic functionality test"
```

```text
# prompt.txt
你是一个人工智能助手。
用户输入: {{input}}
上下文: {{context}}
```

### 4.3 运行测试

```bash
# 运行测试
promptfoo eval

# 查看结果
promptfoo view

# 导出报告
promptfoo eval --output results.json
```

### 4.4 基本评分

```yaml
# promptfooconfig.yaml
prompts:
  - id: my_prompt
    file: ./prompt.txt

providers:
  - id: openai-chat
    model: gpt-4o

tests:
  - vars:
      input: "What is AI?"
    assert:
      - type: contains
        value: "artificial intelligence"
      - type: similar
        threshold: 0.7
        value: "AI stands for Artificial Intelligence"
```

---

## 5. 高级用法

### 5.1 LLM-as-Judge

```yaml
tests:
  - vars:
      input: "Explain quantum computing"
    assert:
      - type: llmJudge
        provider: openai-chat
        criteria:
          - name: accuracy
            prompt: "评价回答是否准确解释了量子计算的基本概念"
          - name: clarity
            prompt: "评价回答是否清晰易懂"
          - name: depth
            prompt: "评价回答的技术深度"
```

### 5.2 多模型对比

```yaml
providers:
  - id: gpt4
    name: GPT-4
    model: gpt-4o

  - id: claude
    name: Claude 3.5
    model: claude-3-5-sonnet-20240620

  - id: gemini
    name: Gemini Pro
    model: gemini-1.5-pro

tests:
  - vars:
      input: "翻译: Hello World"
    assert:
      - type: contains
        value: "你好"
```

### 5.3 CI/CD 集成

```yaml
# GitHub Actions
# .github/workflows/prompt-test.yml
name: Prompt Tests

on:
  push:
    paths:
      - 'prompts/**'
      - 'promptfooconfig.yaml'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install promptfoo
        run: npm install -g promptfoo

      - name: Run tests
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          promptfoo eval --no-cache
          promptfoo view --port 3000 &
          sleep 5

      - name: Check results
        run: |
          if promptfoo eval --expect-min-score 0.8; then
            echo "All tests passed"
          else
            echo "Tests failed"
            exit 1
          fi
```

---

## 6. 对比与选择

### 6.1 Prompt 测试工具对比

| 维度 | Promptfoo | LangSmith | RAGAS |
|------|-----------|-----------|-------|
| **专注** | Prompt 测试 | LLM 调试 | RAG 评估 |
| **多模型** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| **回归测试** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **CI/CD** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ |
| **免费** | ⭐⭐⭐⭐⭐ | 付费 | ⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| Prompt 迭代 | Promptfoo |
| RAG 评估 | RAGAS |
| LLM 调试 | LangSmith |
| 生产监控 | LangSmith |

---

## 参考资源

- [Promptfoo GitHub](https://github.com/promptfoo/promptfoo)
- [Promptfoo 文档](https://promptfoo.dev/)
- [Promptfoo API](https://promptfoo.dev/docs/api-reference/)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[09_Testing/AI-Testing-in-nutshell.md|AI-Testing-in-nutshell]]
- [[09_Testing/AI_Testing_for_dummy.md|AI_Testing_for_dummy]]
- [[09_Testing/Java_AI_Testing.md|Java_AI_Testing]]
- [[09_Testing/README.md|09_Testing README]]
- [[05_NLP_LLMs/Fine_tuning_Techniques/Axolotl_Deep_Dive.md|Axolotl_Deep_Dive]]
