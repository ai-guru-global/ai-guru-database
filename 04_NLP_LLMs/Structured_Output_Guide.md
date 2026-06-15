---
title: "LLM 结构化输出完全指南"
category: "04-nlp-llms"
tags: ["llm", "structured-output", "pydantic", "instructor", "json", "function-calling"]
summary: "让 LLM 返回可靠结构化数据的技术全景:Function Calling、JSON Mode、Instructor、PydanticAI、Outlines 等方案对比与实践。"
sources:
  - "https://python.useinstructor.com/"
  - "https://ai.pydantic.dev/"
  - "https://github.com/dottxt-ai/outlines"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: core
---

# LLM 结构化输出完全指南

> **一句话理解**: 让 LLM 返回可靠结构化数据的技术全景:Function Calling、JSON Mode、Instructor、PydanticAI、Outlines 等方案对比与实践。

## 为什么需要结构化输出?

LLM 原生输出是自由文本,但生产应用需要可靠的数据结构(如 JSON、Pydantic 对象)。结构化输出是 LLM 从玩具到生产的关键桥梁。

## 技术方案对比

| 方案 | 原理 | 优势 | 劣势 |
|------|------|------|------|
| **Function Calling** | 模型原生支持函数参数输出 | API 原生、可靠 | 仅限主流 API |
| **JSON Mode** | API 强制 JSON 格式输出 | 简单直接 | 不保证 schema 合规 |
| **Instructor** | Pydantic + 重试机制 | 类型安全、自动重试 | 依赖 API |
| **PydanticAI** | Agent 框架内置结构化输出 | 完整 Agent 框架 | 学习曲线 |
| **Outlines** | 受控生成(正则/JSON Schema) | 本地模型支持 | 需要本地推理 |
| **Guidance** | 模板化受控生成 | 灵活 | 配置复杂 |

## Instructor 详解

[Instructor](https://python.useinstructor.com/) 是最流行的结构化输出库:

```python
import instructor
from pydantic import BaseModel
from openai import OpenAI

class UserInfo(BaseModel):
    name: str
    age: int
    occupation: str

client = instructor.from_openai(OpenAI())
user = client.chat.completions.create(
    model="gpt-4o",
    response_model=UserInfo,
    messages=[{"role": "user", "content": "Allen, 30岁, 工程师"}]
)
# user.name == "Allen", user.age == 30
```

### 核心特性
- **自动重试**: 输出不符合 schema 时自动重试
- **Pydantic 验证**: 利用 Pydantic 的验证器确保数据质量
- **流式支持**: 支持流式结构化输出
- **多 provider**: 支持 OpenAI、Anthropic、Gemini 等

## PydanticAI 详解

[PydanticAI](https://ai.pydantic.dev/) 是 Pydantic 团队构建的 Agent 框架:

- 结构化输出作为一等公民
- 内置依赖注入
- 流式支持
- 测试友好

## Outlines 详解

[Outlines](https://github.com/dottxt-ai/outlines) 通过受控生成实现结构化输出:

- 支持正则表达式约束
- 支持 JSON Schema 约束
- 适用于本地模型(Llama、Mistral 等)
- 基于有限状态机实现

## 最佳实践

1. **优先使用 Function Calling**: API 原生支持时最可靠
2. **Pydantic 定义 schema**: 类型安全 + 自动验证
3. **添加重试机制**: 网络和模型不稳定时的兜底
4. **宽松到严格**: 先用 JSON Mode 快速验证,再用 schema 严格约束
5. **测试边界值**: 用极端输入测试输出的鲁棒性

> **关联**: -> [[04_NLP_LLMs/Prompt_Engineering|提示词工程]] | [[13_Agent_Production/GenAI_L11_Integrating_with_Function_Calling|Function Calling]] | [[90_Learn/AI_Engineering_Roadmap_2026|AI 工程路线图]]

