# Guidance: 结构化生成控制语言

> **一句话理解**: Guidance 是微软的引导式生成框架——用标签控制 LLM 输出格式，实现结构化 JSON、角色扮演、多路径分支，比 Jinja2 更强大。

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
Guidance: 引导式生成框架
═══════════════════════════════════════════════════════════════════

定位: 微软的开源引导式生成框架，控制 LLM 输出格式和内容

核心理念:
───────────────────────────────────────────────────────────────────
• 结构化输出: 原生支持 JSON/代码/模板
• 令牌控制: 精确控制生成过程
• 分支控制: 支持多路径生成
• 缓存优化: 减少 token 浪费
• 速度提升: 比传统方法快 2-5x
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **结构化输出** | JSON、XML、代码块 |
| **角色前缀** | `# person` 等角色控制 |
| **分支/循环** | `{{#if}}` `{{#each}}` |
| **工具调用** | 结构化 function calling |
| **令牌缓存** | 减少 API 调用 |
| **多模型** | OpenAI/Claude/本地 |

---

## 2. 核心概念

### 2.1 Guidance 语法

```
Guidance 语法示例
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Guidance 程序                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  {{#user}}生成一篇科技新闻{{/user}}                               │
│  {{#assistant}}                                                   │
│  {                                                               │
│    "title": "{{gen 'title' max_tokens=20}}",                  │
│    "content": "{{gen 'content' max_tokens=200}}",                │
│    "tags": ["{{#each 'tags'~}}                                   │
│              "{{this}}"{{~#unless @last}},{{/each}}"]            │
│  }                                                               │
│  {{/assistant}}                                                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

解析:
• {{#user}} / {{#assistant}}: 角色标签
• {{gen 'name'}}: 生成文本
• {{#each}}: 循环
• {{#if}}: 条件
```

### 2.2 与模板引擎的区别

| 功能 | Guidance | Jinja2 | Prompt |
|------|----------|--------|--------|
| 控制生成 | ✅ | ❌ | 模糊 |
| 精确格式 | ✅ | ❌ | 不可靠 |
| 令牌控制 | ✅ | ❌ | ❌ |
| 推理加速 | ✅ | ❌ | ❌ |
| 复杂结构 | ✅ | 部分 | ❌ |

---

## 3. 架构设计

### 3.1 生成流程

```
Guidance 生成流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Guidance 生成流程                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Guidance 程序:                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ {"title": "{{gen 'title'}}", "content": "{{gen 'body'}}"}│   │
│  └────────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Step 1: 解析 Guidance 程序                               │   │
│  │ • 识别静态文本和动态生成点                                  │   │
│  │ • 计算各部分的 token 长度                                  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Step 2: 前缀缓存 (Token Caching)                           │   │
│  │ • 静态部分只需计算一次                                      │   │
│  │ • 减少 API 调用次数                                        │   │
│  └────────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Step 3: 约束解码 (Constrained Decoding)                    │   │
│  │ • 限制下一个 token 的范围                                   │   │
│  │ • 确保输出符合 JSON 语法                                    │   │
│  └────────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│  输出: {"title": "AI 新突破", "content": "..."}                │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install guidance
```

### 4.2 基础使用

```python
import guidance

# 定义程序
generate_story = guidance("""
{{#system}}你是一个创意写作助手{{/system}}
{{#user}}写一个关于{{topic}}的短故事{{/user}}
{{#assistant}}
标题: {{gen 'title' temperature=0.8}}
内容: {{gen 'story' max_tokens=200}}
{{/assistant}}
""")

# 执行
result = generate_story(topic="时间旅行")
print(result['title'])
print(result['story'])
```

### 4.3 JSON 输出

```python
import guidance

generate_news = guidance("""
{{#system}}你是一个新闻编辑{{/system}}
{{#user}}生成一篇科技新闻的 JSON{{/user}}
{{#assistant}}
{
    "title": "{{gen 'title' max_tokens=30}}",
    "category": "{{#select 'category'}}科技|商业|社会{{/select}}",
    "summary": "{{gen 'summary' max_tokens=100}}",
    "tags": {{#each 'tags'~}}
        "{{this}}"{{~#unless @last}}, {{/unless}}
    {{~/each}}
}
{{/assistant}}
""")

result = generate_news()
print(result)
```

### 4.4 条件分支

```python
generate_response = guidance("""
{{#system}}你是一个客服助手{{/system}}
{{#user}}用户的问题是: {{question}}{{/user}}
{{#assistant}}
{{#if (contains question "退款")}}
{
    "intent": "refund",
    "action": "处理退款请求",
    "response": "{{gen 'response' max_tokens=100}}"
}
{{elseif (contains question "投诉")}}
{
    "intent": "complaint",
    "action": "记录投诉并升级",
    "response": "{{gen 'response' max_tokens=100}}"
}
{{else}}
{
    "intent": "general",
    "action": "提供一般性回答",
    "response": "{{gen 'response' max_tokens=100}}"
}
{{/if}}
{{/assistant}}
""")

result = generate_response(question="我想申请退款")
```

---

## 5. 高级用法

### 5.1 函数调用

```python
generate_with_function = guidance("""
{{#system}}你是一个助手{{/system}}
{{#user}}帮助用户完成任务{{/user}}
{{#assistant}}
{{gen 'functions' stop='}}'}}
{{/assistant}}
""")

# 结合 function calling
result = generate_with_function(
    functions=[
        {"name": "search", "description": "搜索信息"},
        {"name": "calculate", "description": "计算"}
    ]
)
```

### 5.2 多示例 Few-shot

```python
generate_with_examples = guidance("""
{{#system}}你是一个情感分析助手{{/system}}
{{#user}}分析以下评论的情感:{{/user}}

{{#each examples}}
评论: {{this.text}}
情感: {{this.sentiment}}
{{/each}}

评论: {{input}}
情感: {{gen 'sentiment'}}
{{#assistant}}
{{sentiment}}
{{/assistant}}
""")

result = generate_with_examples(
    input="这个产品太棒了！",
    examples=[
        {"text": "非常好用，推荐！", "sentiment": "positive"},
        {"text": "一般般，勉强能用", "sentiment": "neutral"},
    ]
)
```

---

## 6. 对比与选择

### 6.1 与其他方案对比

| 方案 | 结构化输出 | 速度 | 灵活性 |
|------|------------|------|--------|
| **Guidance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Outlines** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **JSON Mode** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ |
| **Regex** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 结构化 JSON | Guidance / Outlines |
| 角色扮演 | Guidance |
| 精确格式控制 | Guidance / Outlines |
| 简单调用 | JSON Mode |

---

## 参考资源

- [Guidance GitHub](https://github.com/microsoft/guidance)
- [Guidance 文档](https://guidance.readthedocs.io/)
- [Guidance 示例](https://github.com/microsoft/guidance/tree/main/notebooks)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*