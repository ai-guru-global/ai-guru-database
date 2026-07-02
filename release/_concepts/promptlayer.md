---
title: "Promptlayer (Prompt 版本管理与测试平台)"
category: -concepts
tags: ["prompt-engineering", "versioning", "testing", "llm-ops", "tracking"]
relationships:
  - target: "_concepts/humanloop"
    type: related_to
  - target: "_concepts/langsmith"
    type: related_to
  - target: "_concepts/promptfoo"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "Prompt 版本管理与测试平台，提供 Prompt 的 Git-like 版本控制、自动追踪 LLM 调用和结构化评估，是 Prompt 工程的标准工具之一。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: stable
tier: supporting
---

# Promptlayer

[Promptlayer](https://promptlayer.com/) 是一个 **Prompt 版本管理与测试平台**，提供类似 Git 的 Prompt 版本控制、LLM 调用自动追踪和结构化评估能力。它的核心理念是：**Prompt 就是代码**——需要版本控制、测试、审查和协作，Promptlayer 将软件工程的最佳实践应用到 Prompt 工程中。

## 核心特性

### 1. Prompt 版本管理

```python
from promptlayer import PromptLayer

pl = PromptLayer(api_key="your-key")

# 注册 Prompt 模板
pl.templates.publish(
    prompt_template={
        "prompt_name": "summarize",
        "prompt_template": "Summarize: {text}",
        "prompt_version": 1,
        "llm_kwargs": {"model": "gpt-4", "temperature": 0.3}
    }
)

# 获取最新版本
template = pl.templates.get("summarize")
response = openai.chat.completions.create(
    model=template["llm_kwargs"]["model"],
    messages=[{"role": "user", "content": template["prompt_template"].format(text="...")}],
    **{k: v for k, v in template["llm_kwargs"].items() if k != "model"}
)
```

### 2. LLM 调用自动追踪

```python
# 装饰器自动追踪 OpenAI 调用
from promptlayer import PromptLayer

pl = PromptLayer(api_key="your-key")

# 自动记录每次 LLM 调用的:
# - 输入/输出
# - 延迟
# - 成本
# - 模型版本
# - Prompt 版本

# 支持 OpenAI, Anthropic, Azure, 本地模型
pl.track.openai(openai.chat.completions.create, ...)(model="gpt-4", ...)
```

### 3. 评估与评分

```python
# 为 LLM 输出打分
pl.track.score(
    request_id=request_id,
    score_name="relevance",
    score=0.95
)

# 在 Dashboard 中查看:
# - 每个 Prompt 版本的平均分数
# - 分数趋势图
# - 异常检测
```

## 典型应用场景

- **Prompt 版本控制**: 追踪 Prompt 的每次修改
- **性能监控**: 追踪不同 Prompt 版本的输出质量
- **A/B 测试**: 对比 Prompt 变体的效果
- **团队协作**: 多人共享和管理 Prompt 模板

## 安装

```bash
pip install promptlayer
```

## 参考资源

- [Promptlayer 官网](https://promptlayer.com/)
- [Promptlayer 文档](https://docs.promptlayer.com/)

## 相关概念

- [[_concepts/humanloop]] — Humanloop Prompt 工程与评估平台
- [[_concepts/promptfoo]] — Promptfoo Prompt 测试框架
- [[_concepts/langsmith]] — LangSmith LLM 可观测性
