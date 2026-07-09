---
title: "Instructor 结构化输出库概览"
category: "05-nlp-llms"
tags: ["tool", "structured-output", "pydantic", "instructor", "json"]
summary: "最流行的 LLM 结构化输出库,通过 Pydantic 模型定义输出 schema,自动重试确保输出可靠,支持 OpenAI/Anthropic/Gemini 等多家 API。"
sources:
  - "https://python.useinstructor.com/"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: supporting
aliases:
  - "Instructor Overview"
  - "instructor overview"
  - instructor_overview

---
# Instructor 结构化输出库概览

> **一句话理解**: 最流行的 LLM 结构化输出库,用 Pydantic 定义输出 schema,自动重试确保可靠。

## 核心特性

- **Pydantic 集成**: 用 Python 类定义输出结构
- **自动重试**: 输出不符合 schema 时自动重试
- **多 provider**: 支持 OpenAI、Anthropic、Gemini、Mistral 等
- **流式支持**: 支持流式结构化输出
- **验证器**: 利用 Pydantic 验证器确保数据质量

## 快速开始

```python
import instructor
from pydantic import BaseModel, Field
from openai import OpenAI

class UserInfo(BaseModel):
    name: str
    age: int = Field(gt=0, lt=150)
    occupation: str

client = instructor.from_openai(OpenAI())
user = client.chat.completions.create(
    model="gpt-4o",
    response_model=UserInfo,
    messages=[{"role": "user", "content": "Allen, 30, 工程师"}]
)
# user.name == "Allen", user.age == 30
```

## 适用场景

| 场景 | 说明 |
|------|------|
| 信息提取 | 从文本中提取结构化数据 |
| 数据标注 | 自动化数据标注 |
| API 集成 | 确保 LLM 输出符合 API 格式 |
| 表单填写 | 自然语言 -> 结构化表单 |

> **关联**: -> [[大模型/Structured_Output_Guide|结构化输出指南]] | [[90_Learn/guides/ai_engineering_roadmap_2026|AI 工程路线图]]

## Related

- [[大模型/README|04 自然语言处理与大模型 (NLP & LLMs)]]
