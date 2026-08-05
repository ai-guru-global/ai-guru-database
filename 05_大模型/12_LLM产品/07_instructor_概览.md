---
title: "Instructor 结构化输出库概览"
category: "05-nlp-llms"
tags: ["tool", "structured-output", "pydantic", "instructor", "json"]
summary: "最流行的 LLM 结构化输出库,通过 Pydantic 模型定义输出 schema,自动重试确保输出可靠,支持 OpenAI/Anthropic/Gemini 等多家 API。"
sources:
  - "https://python.useinstructor.com/"
created: 2026-06-12
updated: 2026-07-10
lifecycle: reviewed
tier: supporting
aliases:
  - "Instructor Overview"
  - "instructor overview"
  - instructor_overview

name_zh: "Instructor 结构化输出库概览"
---
# Instructor 结构化输出库概览

> 中文简称：Instructor 结构化输出库概览

> 📌 **本篇为产品视角的快速概览**。Instructor 的完整技术深度分析（架构原理、重试机制、模式对比、生产实践）见 [[05_大模型/07_提示工程/10_Instructor_深入分析|Instructor 深入分析]]，结构化输出方法论见 [[05_大模型/15_约束生成/03_Structured_输出_指南|结构化输出完全指南]]。

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

| 场景 | 说明 | 示例 |
|------|------|------|
| 信息提取 | 从文本中提取结构化数据 | 简历解析、合同提取 |
| 数据标注 | 自动化数据标注 | 情感分类、NER |
| API 集成 | 确保 LLM 输出符合 API 格式 | 工具调用参数 |
| 表单填写 | 自然语言 -> 结构化表单 | 智能客服 |
| 数据清洗 | 非结构化 -> 结构化 | 日志解析 |

## 高级用法

```python
import instructor
from pydantic import BaseModel, Field, field_validator
from typing import Optional
from openai import OpenAI

# 1. 复杂嵌套结构
class Address(BaseModel):
    city: str
    country: str

class Person(BaseModel):
    name: str
    age: int = Field(gt=0, lt=150)
    address: Optional[Address] = None
    hobbies: list[str] = Field(default_factory=list)
    
    @field_validator('name')
    @classmethod
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

# 2. 流式结构化输出
client = instructor.from_openai(OpenAI(), mode=instructor.Mode.TOOLS_STRICT)

stream = client.chat.completions.create_partial(
    model="gpt-4o",
    response_model=Person,
    messages=[{"role": "user", "content": "Allen, 30, 北京, 中国, 爱好编程和阅读"}]
)

for partial in stream:
    print(partial)  # 逐步填充的 Person 对象

# 3. 多 provider 支持
import anthropic
client_anthropic = instructor.from_anthropic(anthropic.Anthropic())

# 4. 批量提取
class ExtractedData(BaseModel):
    items: list[Person]

result = client.chat.completions.create(
    model="gpt-4o",
    response_model=ExtractedData,
    messages=[{"role": "user", "content": "提取所有人员信息: Allen 30岁, Bob 25岁"}]
)
```

## 2026 Instructor 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **Instructor 1.x** | 核心结构化输出 | GA |
| **Pydantic v2** | 高性能验证 | GA |
| **TOOLS_STRICT 模式** | 严格工具调用 | GA |
| **多 Provider** | OpenAI/Anthropic/Gemini/Mistral | GA |
| **流式输出** | create_partial | GA |
| **JS/TS 版本** | instructor-js | GA |
| **Hub** | 社区 Schema 分享 | 预览 |

## 与 Outlines 对比

| 维度 | Instructor | Outlines |
|------|----------|----------|
| 适用模型 | API 模型 | 本地模型 |
| 约束方式 | 重试机制 | FSM 底层约束 |
| 精度 | 高（但非100%） | 100% 格式正确 |
| 速度 | 中（可能重试） | 快（无需重试） |
| 依赖 | 只需 API | 需要 GPU |
| 易用性 | 非常简单 | 中等 |

## 生产最佳实践

1. **Schema 设计**：使用 Field 添加约束（gt, lt, pattern）
2. **验证器**：用 field_validator 实现业务规则
3. **重试配置**：设置 max_retries=3 平衡可靠性和速度
4. **错误处理**：捕获 ValidationError 实现优雅降级
5. **测试**：对每种 Schema 编写单元测试

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 重试次数多 | Schema 太复杂 | 简化结构 + 添加示例 |
| 输出质量低 | 模型能力不足 | 使用 GPT-4o 级别模型 |
| 流式输出慢 | 网络延迟 | 使用异步流式 |
| 嵌套解析失败 | 层级太深 | 拆分为多次调用 |
| 验证失败 | 约束太严格 | 调整 Field 约束 |

## 版本兼容性

| 组件 | 版本 | 特性 | 备注 |
|------|------|------|------|
| Instructor | 1.3+ | 核心库 | pip install instructor |
| Pydantic | 2.7+ | 验证引擎 | 高性能 |
| OpenAI SDK | 1.30+ | API 客户端 | 兼容 |
| Anthropic SDK | 0.28+ | Claude 支持 | 兼容 |
| Python | 3.10+ | 运行环境 | 推荐 3.11+ |

## 生产检查清单

1. ✅ 使用 Field 添加约束（gt, lt, pattern）
2. ✅ 用 field_validator 实现业务规则
3. ✅ 设置 max_retries=3 平衡可靠性和速度
4. ✅ 捕获 ValidationError 实现优雅降级
5. ✅ 对每种 Schema 编写单元测试
6. ✅ 监控重试率和成功率
7. ✅ 实现缓存减少重复调用
8. ✅ 记录 Schema 版本变更

## 相关概念

- [[05_大模型/15_约束生成/Structured_Output_Guide|结构化输出指南]]
- [[05_大模型/README|NLP & LLMs]]
- [[概念/LLM/structured-output|结构化输出]]
- [[概念/LLM/structured-output|Pydantic 数据验证]]
- [[05_大模型/12_LLM产品/08_outlines_概览|Outlines 概览]]
- [[05_大模型/12_LLM产品/01_chatgpt_概览|ChatGPT 概览]]

## 总结

Instructor 是 LLM 结构化输出的事实标准，通过 Pydantic 定义输出结构，自动重试确保可靠性。它是将 LLM 输出从"文本"变为"数据"的关键工具。2026 年，Instructor 已支持所有主流 LLM API，成为构建可靠 AI 应用的必备组件。

> 💡 Instructor 的核心价值：让 LLM 输出变成类型安全的 Python 对象——不再需要手动解析 JSON，不再担心格式错误。在 2026 年，结构化输出已成为 AI 应用的标准实践。

## 附录：Instructor 模式选择

| 模式 | 说明 | 适用场景 |
|------|------|------|
| TOOLS | 工具调用模式 | 默认模式，兼容性好 |
| TOOLS_STRICT | 严格工具调用 | 需要 100% 格式正确 |
| JSON | JSON 模式 | 简单结构化输出 |
| MD_JSON | Markdown JSON | 需要可读性 |
| FUNCTIONS | 函数调用 | 旧版 API |

> 💡 Instructor 的核心价值：让 LLM 输出可靠的结构化数据，是构建生产级 AI 应用的基础设施。
