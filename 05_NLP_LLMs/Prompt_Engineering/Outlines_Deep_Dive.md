---
title: "Outlines: 结构化输出框架"
category: "04-nlp-llms-prompt-engineering"
tags: ["nlp", "llm", "transformer", "gpt", "bert"]
summary: "> **一句话理解**: Outlines 是 Joshi 团队的结构化生成框架——结合上下文无关文法 (CFG) 和有限状态机实现精确的格式控制，比 regex 引导更可靠。"
created: "2026-05-31"
updated: "2026-05-31"
---

# Outlines: 结构化输出框架

> **一句话理解**: Outlines 是 Joshi 团队的结构化生成框架——结合上下文无关文法 (CFG) 和有限状态机实现精确的格式控制，比 regex 引导更可靠。

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
Outlines: 结构化输出框架
═══════════════════════════════════════════════════════════════════

定位: 基于文法约束的结构化输出框架，精确控制 LLM 输出格式

核心理念:
───────────────────────────────────────────────────────────────────
• 文法约束: 用 CFG 定义输出格式
• 确定性: 有限状态机确保格式正确
• 多格式: JSON Schema、正则、枚举
• 速度: 比 guidance 更快
• 开源: 完全免费
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **JSON Schema** | 直接使用 Schema 约束 |
| **Regex 约束** | 用正则表达式约束 |
| **Choice 约束** | 枚举类型 |
| **链式结构** | 复杂嵌套结构 |
| **不确定性检测** | 检测冲突约束 |

---

## 2. 核心概念

### 2.1 约束类型

```
Outlines 约束类型
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        约束类型                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. JSON Schema                                                   │
│  ───────────────────────────────────────────────────────────   │
│  schema = {"type": "object", "properties": {                    │
│      "name": {"type": "string"},                               │
│      "age": {"type": "integer"}                                │
│  }}                                                             │
│                                                                   │
│  2. Regex                                                        │
│  ───────────────────────────────────────────────────────────   │
│  pattern = r"用户: .*\n助手: .*"                               │
│                                                                   │
│  3. Choice (枚举)                                                 │
│  ───────────────────────────────────────────────────────────   │
│  choices = ["positive", "negative", "neutral"]                   │
│                                                                   │
│  4. 链式结构                                                      │
│  ───────────────────────────────────────────────────────────   │
│  chain = schema1 >> schema2 >> schema3                           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. 架构设计

### 3.1 生成流程

```
Outlines 生成流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Outlines 生成流程                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  输入: JSON Schema                                                │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ FSM (有限状态机) 生成                                        │ │
│  │ • 解析 Schema                                                │ │
│  │ • 生成状态转换图                                              │ │
│  │ • 约束 token 生成                                            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ 约束解码                                                      │ │
│  │ • 预测下一个合法 token                                        │ │
│  │ • mask 非法 token                                            │ │
│  │ • 采样                                                        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│       │                                                           │
│       ▼                                                           │
│  输出: 符合 Schema 的 JSON                                        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install outlines
```

### 4.2 JSON Schema 约束

```python
import outlines

# 定义 Schema
schema = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "age": {"type": "integer"},
        "email": {"type": "string", "format": "email"}
    },
    "required": ["name", "age"]
}

# 创建模型
model = outlines.from_openai("gpt-4o")

# 生成
generator = outlines.generate.json(schema)
result = generator(model, "生成一个用户信息 JSON")

print(result)
# {'name': '张三', 'age': 30, 'email': 'zhang@example.com'}
```

### 4.3 Regex 约束

```python
import outlines

model = outlines.from_openai("gpt-4o")

# Regex 约束
pattern = r"用户: .*\n助手: .*"
generator = outlines.generate.regex(pattern)

result = generator(model, "用户: 你好\n助手:")
print(result)
# 助手: 你好，有什么可以帮你的？
```

### 4.4 Choice 约束

```python
import outlines

model = outlines.from_openai("gpt-4o")

# 枚举约束
choices = ["positive", "negative", "neutral"]
generator = outlines.generate.choice(choices)

result = generator(model, "这个产品太棒了！")
print(result)  # "positive"
```

### 4.5 链式生成

```python
import outlines

model = outlines.from_openai("gpt-4o")

# 链式结构
summary_schema = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "summary": {"type": "string"}
    }
}

detail_schema = {
    "type": "object",
    "properties": {
        "details": {"type": "string"},
        "sources": {"type": "array", "items": {"type": "string"}}
    }
}

# 先生成摘要
gen_summary = outlines.generate.json(summary_schema)
summary = gen_summary(model, "关于量子计算的文章")

# 再生成详情
gen_detail = outlines.generate.json(detail_schema)
detail = gen_detail(model, f"基于 {summary['title']} 生成详情")
```

---

## 5. 高级用法

### 5.1 Pydantic 模型

```python
from pydantic import BaseModel
import outlines

class User(BaseModel):
    name: str
    age: int
    email: str

model = outlines.from_openai("gpt-4o")
generator = outlines.generate.pydantic(User)

result = generator(model, "生成一个用户信息")
print(result.name, result.age)
```

### 5.2 复杂嵌套

```python
schema = {
    "type": "object",
    "properties": {
        "people": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "role": {"type": "string", "enum": ["工程师", "设计师", "产品经理"]}
                }
            }
        }
    }
}

generator = outlines.generate.json(schema)
result = generator(model, "生成团队成员列表")
```

---

## 6. 对比与选择

### 6.1 与 Guidance 对比

| 维度 | Outlines | Guidance |
|------|----------|----------|
| **格式控制** | CFG/FSM | AST/模板 |
| **速度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **JSON Schema** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **灵活性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **学习曲线** | ⭐⭐⭐ | ⭐⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 精确 JSON Schema | Outlines |
| 复杂模板控制 | Guidance |
| 简单枚举 | Outlines / Guidance |

---

## 参考资源

- [Outlines GitHub](https://github.com/Joshua-Anderson/outlines)
- [Outlines 文档](https://outlines.readthedocs.io/)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[04_NLP_LLMs/Prompt_Engineering/README.md|README]]
