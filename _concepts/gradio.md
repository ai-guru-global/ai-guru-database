---
title: "Gradio ML 应用框架 (Gradio ML Application Framework)"
category: -concepts
tags: ["gradio", "demo", "web-ui", "ml-application", "huggingface", "ai-stack"]
relationships:
  - target: "_concepts/ollama"
    type: related_to
  - target: "_concepts/modelscope"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "Gradio 是 HuggingFace 旗下的开源 ML 应用框架，几行 Python 代码即可为模型创建 Web UI。AI Stack 应用中心和百炼专属版均可使用 Gradio 构建模型体验界面。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: stable
tier: supporting
---

# Gradio ML 应用框架

> **一句话理解**: Gradio 是"模型的 Web UI 生成器"——几行 Python 代码就能为任何 ML 模型创建交互式 Web 界面，HuggingFace Spaces 的默认框架。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **项目** | Gradio |
| **来源** | HuggingFace 收购 |
| **功能** | ML 模型 Web UI 快速构建 |
| **语言** | Python |
| **开源** | Apache 2.0 |
| **GitHub** | github.com/gradio-app/gradio |

---

## 2. 快速使用

```python
import gradio as gr

# 最简单的示例
def greet(name):
    return f"Hello, {name}!"

demo = gr.Interface(fn=greet, inputs="text", outputs="text")
demo.launch()  # → http://localhost:7860

# LLM 聊天界面
import gradio as gr
from transformers import pipeline

chat = pipeline("text-generation", model="Qwen/Qwen3-8B")

def chat_fn(message, history):
    prompt = history + [{"role": "user", "content": message}]
    response = chat(prompt)
    return response[0]["generated_text"]

demo = gr.ChatInterface(fn=chat_fn, type="messages")
demo.launch()
```

---

## 3. 核心组件

| 组件 | 功能 |
|------|------|
| **gr.Interface** | 基础输入-输出界面 |
| **gr.ChatInterface** | 聊天对话界面 |
| **gr.Blocks** | 自定义布局（高级） |
| **gr.Dataframe** | 表格展示 |
| **gr.Image** | 图片上传/展示 |
| **gr.Audio** | 音频处理 |
| **gr.Plot** | 图表展示 |

---

## 4. 与同类框架对比

| 维度 | Gradio | Streamlit | Panel | Dash |
|------|--------|-----------|-------|------|
| **来源** | HuggingFace | Snowflake | Anaconda | Plotly |
| **定位** | ML Demo/体验 | 数据应用 | 科学计算 | 数据仪表盘 |
| **上手难度** | ⭐ 极低 | ⭐⭐ 低 | ⭐⭐ 低 | ⭐⭐⭐ 中 |
| **聊天界面** | ✅ 原生 | 需插件 | 需手写 | 需手写 |
| **HF 集成** | ✅ 原生 Spaces | 社区 | 有限 | 有限 |
| **模型展示** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |

---

## 5. 在 AI Stack 中的应用

| 场景 | 说明 |
|------|------|
| **模型体验中心** | AI Stack 应用中心的模型试用 UI |
| **PoC 演示** | 快速搭建模型效果演示 |
| **内部工具** | 为团队构建 AI 工具界面 |
| **RAG 问答** | 知识库问答的前端界面 |

---

## Related

- [[_concepts/ollama]] — Ollama 本地推理
- [[_concepts/modelscope]] — ModelScope 魔搭社区
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack 深度解析
