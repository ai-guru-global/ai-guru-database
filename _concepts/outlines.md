---
title: "Outlines 结构化 LLM 生成 (Outlines Structured Generation)"
category: -concepts
tags: ["outlines", "structured-generation", "json-schema", "regex", "constrained-decoding"]
relationships:
  - target: "_concepts/guidance"
    type: related_to
  - target: "_concepts/lm-format-enforcer"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Outlines 是结构化 LLM 生成的开源库——通过正则表达式和 JSON Schema 约束 LLM 输出，保证生成结果严格符合指定格式。是 LLM 应用工程化的关键工具。"
provenance:
  extracted: 0.15
  inferred: 0.75
  ambiguous: 0.10
base_confidence: 0.83
lifecycle: reviewed
tier: supporting
---

# Outlines 结构化 LLM 生成

> **一句话理解**: Outlines 是"LLM 输出的围栏"——让 LLM 只能生成符合 JSON Schema / 正则 / Pydantic 模型的内容，告别输出格式不稳定。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **开发商** | .txt (原 Normal Computing) |
| **开源协议** | Apache 2.0 |
| **GitHub** | 9K+ ⭐ |
| **核心价值** | 保证 LLM 输出严格符合指定格式 |
| **技术** | Constrained Decoding (约束解码) |

---

## 2. 核心原理

```
┌─────────────────────────────────────────┐
│      Constrained Decoding 原理          │
├─────────────────────────────────────────┤
│                                         │
│  标准 LLM 生成:                         │
│    每步从 vocabulary 中选 top-k token    │
│    → 输出不可控                         │
│                                         │
│  Outlines 约束生成:                     │
│    1. 将 JSON Schema/正则 转为 FSM      │
│    2. 每步只允许 FSM 当前状态合法的 token│
│    3. 非法 token 的 logit 设为 -∞        │
│    → 输出 100% 符合格式                 │
│                                         │
│  结果:                                  │
│    ✅ JSON 格式完美                      │
│    ✅ 字段名准确                         │
│    ✅ 类型正确                           │
│    ✅ 枚举值约束                         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3. 核心用法

### 3.1 Pydantic 模型约束

```python
from pydantic import BaseModel
import outlines

class UserProfile(BaseModel):
    name: str
    age: int
    email: str
    skills: list[str]

# 生成严格符合模型的 JSON
generator = outlines.generate.json(model, UserProfile)
result = generator("为一个 AI 工程师创建个人资料")
# {"name": "张三", "age": 28, "email": "zhang@ai.com", "skills": ["Python", "PyTorch"]}
```

### 3.2 JSON Schema 约束

```python
schema = {
    "type": "object",
    "properties": {
        "sentiment": {"enum": ["positive", "negative", "neutral"]},
        "confidence": {"type": "number", "minimum": 0, "maximum": 1},
        "explanation": {"type": "string"},
    },
    "required": ["sentiment", "confidence", "explanation"]
}

generator = outlines.generate.json(model, schema)
result = generator("分析这段文本的情感: '这个产品太棒了！'")
# {"sentiment": "positive", "confidence": 0.95, "explanation": "..."}
```

### 3.3 正则约束

```python
# 强制输出特定格式
generator = outlines.generate.regex(
    model, 
    r"\d{4}-\d{2}-\d{2}"  # 只能生成日期格式
)
result = generator("今天的日期是：")
# "2026-06-03"
```

---

## 4. 支持的约束类型

| 约束类型 | 使用场景 |
|---------|---------|
| **Pydantic Model** | 复杂结构化输出 |
| **JSON Schema** | API 响应格式 |
| **正则表达式** | 特定格式字符串 |
| **Enum** | 分类/选择任务 |
| **Multi-Choice** | 选择题 |
| **Grammar** | 自定义语法 |

---

## 5. 与其他结构化生成工具对比

| 特性 | Outlines | Guidance | Instructor | LM Format Enforcer |
|------|----------|----------|------------|-------------------|
| **约束方式** | FSM/CFG | 模板 | Pydantic | CFG |
| **Pydantic** | ✅ | ❌ | ✅ | ✅ |
| **正则** | ✅ | ❌ | ❌ | ✅ |
| **多模型** | vLLM/HF/Ollama | 多 | OpenAI 为主 | vLLM |
| **性能** | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★☆ |
| **灵活度** | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★☆☆ |

---

## 6. 关键要点

1. **格式保证**：输出 100% 符合指定格式，不需要重试或后处理
2. **FSM 驱动**：将 Schema 转为有限状态机，在 token 级别约束
3. **零开销**：约束在 logits 层面实现，不增加生成步数
4. **多后端**：支持 vLLM、HuggingFace Transformers、Ollama 等
5. **工程化必备**：LLM 应用的 API 响应需要稳定格式，Outlines 是解决方案
6. **vs Instructor**：Outlines 更底层更灵活，Instructor 更面向 OpenAI API
