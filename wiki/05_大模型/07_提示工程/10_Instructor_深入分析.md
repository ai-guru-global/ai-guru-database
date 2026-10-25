---
title: "Instructor: 结构化输出框架"
category: "05-nlp-llms-prompt-engineering"
tags: ["nlp", "llm", "transformer", "gpt", "bert"]
summary: "> **一句话理解**: Instructor 是 Python 原生的结构化输出框架——基于 Pydantic 定义输出结构、验证清晰、支持多种 LLM，简单可靠的结构化生成。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Instructor Deep Dive"
  - Instructor_Deep_Dive
sources: []

name_zh: "Instructor: 结构化输出框架"
---
# Instructor: 结构化输出框架

> 中文简称：Instructor: 结构化输出框架

> **一句话理解**: Instructor 是 Python 原生的结构化输出框架——基于 Pydantic 定义输出结构、验证清晰、支持多种 LLM，简单可靠的结构化生成。

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
Instructor: 结构化输出框架
═══════════════════════════════════════════════════════════════════

定位: Python 原生的结构化输出框架，用 Pydantic 定义输出结构

核心理念:
───────────────────────────────────────────────────────────────────
• Python 原生: Pydantic 模型定义
• 类型安全: 完整的类型检查
• 验证清晰: 自动验证输出
• 多模型: OpenAI/Claude/本地
• 可扩展: 自定义验证器
• 简单: 比 Guidance 更易用
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **Pydantic 模型** | 声明式定义 |
| **自动验证** | 输出结构验证 |
| **重试机制** | 自动修复失败 |
| **多模型** | OpenAI/Claude/本地 |
| **流式支持** | Streaming responses |
| **完整类型** | 静态类型检查 |

### 1.3 与其他方案对比

| 特性 | Instructor | Guidance | Outlines |
|------|-------------|-----------|----------|
| **易用性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Python 原生** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **类型安全** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ |
| **验证** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **性能** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 2. 核心概念

### 2.1 Pydantic 模型定义

```python
from pydantic import BaseModel, Field
from instructor import OpenAISchema

# 定义输出结构
class UserExtract(BaseModel):
    """从文本中提取用户信息"""
    name: str = Field(description="用户姓名")
    age: int = Field(description="用户年龄")
    email: str = Field(description="用户邮箱")
    interests: list[str] = Field(
        description="用户兴趣列表",
        default_factory=list
    )
```

### 2.2 工作流程

```
Instructor 工作流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Instructor 流程                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. 定义 Pydantic 模型                                            │
│  ───────────────────────────────────────────────────────────   │
│  class UserExtract(BaseModel):                                   │
│      name: str                                                   │
│      age: int                                                    │
│                                                                   │
│  2. 调用 LLM                                                     │
│  ───────────────────────────────────────────────────────────   │
│  user = UserExtract.from_response(response)                      │
│                                                                   │
│  3. 验证输出                                                      │
│  ───────────────────────────────────────────────────────────   │
│  if not user.validate():                                         │
│      # 重试或报错                                                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. 架构设计

### 3.1 系统架构

```
Instructor 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Instructor 架构                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Pydantic Model                               │   │
│   │  • Field descriptions                                   │   │
│   │  • Validation rules                                     │   │
│   │  • Type hints                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Instructor Client                             │   │
│   │  • Response parsing                                    │   │
│   │  • Validation                                          │   │
│   │  • Retry logic                                        │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              LLM Provider                                 │   │
│   │  • OpenAI                                             │   │
│   │  • Anthropic                                          │   │
│   │  • Local models                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install instructor
```

### 4.2 基础使用

```python
from pydantic import BaseModel, Field
import instructor
from openai import OpenAI

# 初始化客户端
client = instructor.from_openai(OpenAI())

# 定义输出模型
class UserInfo(BaseModel):
    name: str = Field(description="用户姓名")
    age: int = Field(description="用户年龄")
    occupation: str = Field(description="用户职业")

# 调用
user = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "张三，35岁，软件工程师"}
    ],
    response_model=UserInfo
)

print(user.name)      # "张三"
print(user.age)       # 35
print(user.occupation)  # "软件工程师"
```

### 4.3 列表输出

```python
class NewsItem(BaseModel):
    title: str = Field(description="新闻标题")
    summary: str = Field(description="新闻摘要")
    category: str = Field(description="新闻分类")

class NewsList(BaseModel):
    items: list[NewsItem] = Field(description="新闻列表")

# 提取多条新闻
news = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "提取以下文本中的新闻事件..."}
    ],
    response_model=NewsList
)

for item in news.items:
    print(item.title)
```

### 4.4 嵌套结构

```python
class Address(BaseModel):
    city: str
    street: str
    zip_code: str

class Company(BaseModel):
    name: str
    headquarters: Address
    employees: int

# 提取公司信息
company = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "苹果公司总部位于加州库比蒂诺，邮编95014，员工约16万人。"}
    ],
    response_model=Company
)

print(company.name)              # "苹果公司"
print(company.headquarters.city) # "加州库比蒂诺"
```

---

## 5. 高级用法

### 5.1 自定义验证

```python
from pydantic import field_validator

class AgeInfo(BaseModel):
    age: int = Field(description="用户年龄")
    age_group: str  # 自动计算

    @field_validator('age')
    @classmethod
    def validate_age(cls, v):
        if v < 0 or v > 150:
            raise ValueError("年龄必须在 0-150 之间")
        return v

    @property
    def age_group(self):
        if self.age < 18:
            return "未成年"
        elif self.age < 65:
            return "成年人"
        return "老年人"
```

### 5.2 重试机制

```python
from instructor import Instructor

client = instructor.from_openai(
    OpenAI(),
    max_retries=3,  # 最多重试 3 次
    validation_context={"required_fields": ["name", "age"]}
)

# 自动重试验证失败的请求
user = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "提取信息..."}],
    response_model=UserInfo
)
```

### 5.3 多种 LLM

```python
import instructor
from anthropic import Anthropic

# Claude
client = instructor.from_anthropic(Anthropic())

user = client.messages.create(
    model="claude-3-5-sonnet",
    messages=[{"role": "user", "content": "提取信息..."}],
    response_model=UserInfo
)

# 本地模型 (通过 Ollama)
from openai import OpenAI

client = instructor.from_openai(
    OpenAI(base_url="http://localhost:11434/v1"),
    model="llama3.1"
)
```

### 5.4 流式输出

```python
class TokenCount(BaseModel):
    count: int
    word: str

# 流式处理
stream = client.chat.completions.create_partial(
    model="gpt-4o",
    messages=[{"role": "user", "content": "数一数 'hello' 出现了几次"}],
    response_model=TokenCount,
    stream=True
)

for partial in stream:
    print(partial.partial_object)  # 实时输出
```

---

## 6. 对比与选择

### 6.1 结构化输出方案对比

| 维度 | Instructor | Guidance | Outlines |
|------|-------------|-----------|----------|
| **Python 原生** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ |
| **类型安全** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ |
| **学习曲线** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **性能** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **验证能力** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| Python 项目 | Instructor |
| 复杂模板 | Guidance |
| 极致性能 | Outlines |
| 快速原型 | Instructor |

---

## 参考资源

- [Instructor GitHub](https://github.com/jxnl/instructor)
- [Instructor 文档](https://python.useinstructor.com/)
- [Instructor 示例](https://jxnl.github.io/instructor/examples/)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[05_大模型/07_提示工程/11_Outlines_深入分析.md|Outlines_Deep_Dive]]
- [[05_大模型/07_提示工程/17_Prompt_工程_简明指南.md|Prompt-Engineering-in-nutshell]]
- [[05_大模型/07_提示工程/16_Prompt工程.md|Prompt_Engineering]]
- [[05_大模型/07_提示工程/16_Prompt工程|Prompt_Engineering_for_dummy]]
- [[05_大模型/06_微调技术/01_Axolotl_深入分析.md|Axolotl_Deep_Dive]]
