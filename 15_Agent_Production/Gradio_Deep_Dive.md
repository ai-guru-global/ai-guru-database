---
title: "Gradio: 机器学习 Demo 框架"
category: "13-agent-production"
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> **一句话理解**: Gradio 是机器学习 Demo 框架——几行代码构建 Web 界面、输入输出组件丰富、分享链接即用，ML 模型的交互界面神器。"
created: "2026-05-31"
updated: "2026-05-31"
---

# Gradio: 机器学习 Demo 框架

> **一句话理解**: Gradio 是机器学习 Demo 框架——几行代码构建 Web 界面、输入输出组件丰富、分享链接即用，ML 模型的交互界面神器。

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
Gradio: 机器学习 Demo 框架
═══════════════════════════════════════════════════════════════════

定位: 开源机器学习 Web Demo 框架，几行代码构建交互界面

核心理念:
───────────────────────────────────────────────────────────────────
• 简单: 几行代码即可
• 分享: 一键生成分享链接
• 组件丰富: 文本/图像/音频/视频
• HuggingFace 原生: 零部署
• 实时交互: 即时反馈
• 免费托管: Spaces 平台
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **组件库** | 20+ 输入输出组件 |
| **实时反馈** | 即时交互 |
| **分享链接** | 一键生成公链 |
| **HuggingFace** | Spaces 原生支持 |
| **API** | 自动生成 API |
| **主题** | 自定义外观 |

### 1.3 支持任务

| 任务 | 组件 |
|------|------|
| 文本生成 | Textbox |
| 图像分类 | Image |
| 语音识别 | Audio |
| 聊天机器人 | Chatbot |
| 对象检测 | Image + 绘制 |
| 文本分类 | Textbox + Label |

---

## 2. 核心概念

### 2.1 Interface 模式

```
Gradio Interface
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Gradio Interface                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  gr.Interface(                                                  │
│      fn=your_function,     # 推理函数                             │
│      inputs=...,           # 输入组件                             │
│      outputs=...,          # 输出组件                             │
│      examples=...           # 示例数据                             │
│  )                                                                   │
│                                                                   │
│  简单三步:                                                       │
│  1. 定义推理函数                                                 │
│  2. 指定输入组件                                                 │
│  3. 指定输出组件                                                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Blocks 模式

```
Gradio Blocks
═══════════════════════════════════════════════════════════════════

Blocks 模式提供更灵活的控制:

with gr.Blocks() as demo:
    with gr.Tab("推理"):
        # 推理界面
        pass
    with gr.Tab("文档"):
        # 文档说明
        pass

    btn = gr.Button("运行")
    btn.click(fn, inputs, outputs)
```

---

## 3. 架构设计

### 3.1 系统架构

```
Gradio 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Gradio 架构                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Python Application                             │   │
│   │  • Interface / Blocks                                    │   │
│   │  • Event Handlers                                       │   │
│   │  • Component Layout                                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Frontend (React)                              │   │
│   │  • WebSocket                                             │   │
│   │  • Real-time Updates                                    │   │
│   │  • Theme Engine                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Backend (Python)                              │   │
│   │  • Inference Function                                    │   │
│   │  • Model Loading                                        │   │
│   │  • Post-processing                                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install gradio
```

### 4.2 基础 Interface

```python
import gradio as gr

def sentiment_classifier(text):
    """情感分类"""
    if "好" in text or "棒" in text:
        return "positive", 0.95
    elif "差" in text or "烂" in text:
        return "negative", 0.90
    return "neutral", 0.50

# 简单三行代码
demo = gr.Interface(
    fn=sentiment_classifier,
    inputs=gr.Textbox(label="输入文本"),
    outputs=[gr.Label(label="情感"), gr.Number(label="置信度")],
    examples=[["这个产品太棒了！"], ["太差了，不推荐"]]
)

demo.launch()
```

### 4.3 Blocks 自定义布局

```python
import gradio as gr

with gr.Blocks() as demo:
    gr.Markdown("# 🤖 AI 助手 Demo")

    with gr.Row():
        with gr.Column():
            input_text = gr.Textbox(label="输入", lines=5)
            submit_btn = gr.Button("提交", variant="primary")

        with gr.Column():
            output_text = gr.Textbox(label="输出", lines=5)

    # 事件绑定
    submit_btn.click(
        fn=my_model.predict,
        inputs=input_text,
        outputs=output_text
    )

    # 示例
    gr.Examples(
        examples=`[ ["你好，请介绍一下自己"] ]`,
        inputs=input_text
    )

demo.launch()
```

### 4.4 图像处理 Demo

```python
import gradio as gr
from PIL import Image
import torch

def image_classifier(image):
    """图像分类"""
    model = torch.load("model.pkl")
    predictions = model.predict(image)
    return {label: float(prob) for label, prob in predictions.items()}

demo = gr.Interface(
    fn=image_classifier,
    inputs=gr.Image(type="pil", label="上传图片"),
    outputs=gr.Label(num_top_classes=5, label="预测结果"),
    examples=[["example1.jpg"], ["example2.jpg"]]
)

demo.launch()
```

---

## 5. 高级用法

### 5.1 Chatbot

```python
import gradio as gr

def chat(message, history):
    """对话函数"""
    response = llm.chat(message)
    return response

demo = gr.ChatInterface(
    fn=chat,
    textbox=gr.Textbox(placeholder="输入问题..."),
    chatbot=gr.Chatbot(height=400),
    title="AI 助手"
)

demo.launch()
```

### 5.2 实时语音

```python
import gradio as gr

def speech_to_text(audio):
    """语音转文字"""
    result = asr_model.transcribe(audio)
    return result["text"]

demo = gr.Interface(
    fn=speech_to_text,
    inputs=gr.Audio(source="microphone", type="filepath"),
    outputs=gr.Textbox(label="识别结果"),
    title="语音识别 Demo"
)

demo.launch()
```

### 5.3 主题定制

```python
demo = gr.Blocks(
    theme=gr.themes.Soft(
        primary_hue="blue",
        secondary_hue="gray",
    ),
    title="自定义主题 Demo"
)

with demo:
    # ...
```

---

## 6. 对比与选择

### 6.1 ML Demo 工具对比

| 维度 | Gradio | Streamlit | Flask |
|------|---------|-----------|-------|
| **易用性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **组件** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| **交互性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **灵活性** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **HuggingFace** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| ML 模型 Demo | Gradio |
| 数据应用 | Streamlit |
| 完全自定义 | Flask/FastAPI |
| HuggingFace 集成 | Gradio |

---

## 参考资源

- [Gradio GitHub](https://github.com/gradio-app/gradio)
- [Gradio 文档](https://gradio.app/docs/)
- [HuggingFace Spaces](https://huggingface.co/spaces)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026.md|Agent_Harness_Complete_2026]]
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026.md|Agent_Red_Teaming_2026]]
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow.md|Evaluation_Workflow]]
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment.md|Production_Assessment]]
- [[15_Agent_Production/Agent_Evaluation/Benchmarking/Benchmarking_Criteria.md|Benchmarking_Criteria]]
