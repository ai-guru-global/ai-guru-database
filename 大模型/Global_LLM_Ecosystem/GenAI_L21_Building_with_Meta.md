---
title: "使用Meta家族模型构建应用"
category: "05-nlp-llms-global-llm-ecosystem"
tags: ["microsoft-genai-course", "meta-llama", "multimodal", "function-calling", "llama-3.1", "llama-3.2", "vision-model"]
summary: "全面介绍Meta Llama 3.1和Llama 3.2系列模型，涵盖原生函数调用、多模态视觉支持、边缘部署能力，包含完整的Python代码示例。"
created: "2026-06-12"
updated: "2026-06-12"
source_url: "https://raw.githubusercontent.com/microsoft/generative-ai-for-beginners/main/translations/zh-CN/21-meta/README.md"
course: "Microsoft Generative AI for Beginners"
lesson_number: 21
tier: supporting
aliases:
  - "Genai L21 Building With Meta"
  - "GenAI L21 Building with Meta"
  - GenAI_L21_Building_with_Meta
sources: []

---
## 学习目标

本课程将涵盖以下内容：

- 探索两个主要的 Meta 家族模型——Llama 3.1 和 Llama 3.2
- 理解每个模型的使用案例和场景
- 通过代码示例展示每个模型的独特功能
- 学习如何在实际项目中选择合适的 Llama 模型

## 本课前置知识

学习本课之前，建议你已经了解：

- 大型语言模型（LLM）的基本概念
- 函数调用（Function Calling）的工作原理
- 多模态模型的基本概念（文本 + 图像）
- Python 编程基础
- Azure AI Inference SDK 的使用方法
- GitHub Token 的获取和配置

## Meta 家族模型概览

在本课中，我们将探索来自 Meta 家族或"Llama 群"的两个模型——Llama 3.1 和 Llama 3.2。

这些模型有不同的变体，并可在 GitHub 模型市场获得。

### 模型变体一览

| 模型 | 变体 | 参数量 | 主要能力 |
|------|------|--------|----------|
| Llama 3.1 | 70B Instruct | 700 亿 | 文本推理、函数调用 |
| Llama 3.1 | 405B Instruct | 4050 亿 | 复杂推理、函数调用、合成数据 |
| Llama 3.2 | 11B Vision Instruct | 110 亿 | 视觉理解、文本推理 |
| Llama 3.2 | 90B Vision Instruct | 900 亿 | 视觉理解、复杂推理 |

此外，Llama 3.2 还提供了纯文本的轻量变体：
- **1B**：10 亿参数，适合边缘/移动部署
- **3B**：30 亿参数，适合资源受限环境

> 注意：Llama 3 也在 GitHub 模型上可用，但本课不涵盖此内容。

## Llama 3.1

Llama 3.1 拥有 4050 亿参数，属于开源大语言模型（LLM）类别。

### 核心升级

该模型是之前发布的 Llama 3 的升级版，提供了多项重要改进：

| 特性 | Llama 3.1 | 前代 Llama 3 |
|------|-----------|--------------|
| 上下文窗口 | 128K token | 8K token |
| 最大输出 token | 4096 | 2048 |
| 多语言支持 | 增强（更多训练 token） | 基础 |
| 函数调用 | 原生支持 | 有限 |

### 支持的复杂生成式 AI 应用场景

这些改进使 Llama 3.1 能够处理更复杂的生成式 AI 应用场景：

**1. 原生函数调用**

Llama 3.1 已进行了微调，更有效地执行函数或工具调用。它内置了两个工具，模型能基于用户提示识别需要使用的工具：

- **Brave Search**：可用于通过网络搜索获取最新信息，如天气查询、新闻检索
- **Wolfram Alpha**：用于更复杂的数学计算，无需自己编写函数

你也可以创建自己的**自定义工具**供 LLM 调用，极大地扩展了模型的能力边界。

**2. 更好的 RAG 性能**

基于更大的上下文窗口（128K token），Llama 3.1 能够：
- 一次处理更长的文档
- 在检索增强生成中容纳更多上下文块
- 减少因上下文截断导致的信息丢失

**3. 合成数据生成**

Llama 3.1 具备为微调等任务创建有效合成数据的能力：
- 生成高质量的训练样本
- 为特定领域创建标注数据
- 通过数据增强提升下游任务性能

### 原生函数调用代码示例

以下代码展示如何使用 Llama 3.1 405B 进行函数调用：

```python
import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import AssistantMessage, SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

token = os.environ["GITHUB_TOKEN"]
endpoint = "https://models.inference.ai.azure.com"
model_name = "meta-llama-3.1-405b-instruct"

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)

tool_prompt = f"""
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

Environment: ipython
Tools: brave_search, wolfram_alpha
Cutting Knowledge Date: December 2023
Today Date: 23 July 2024

You are a helpful assistant<|eot_id|>
"""

messages = [
    SystemMessage(content=tool_prompt),
    UserMessage(content="What is the weather in Stockholm?"),
]

response = client.complete(messages=messages, model=model_name)

print(response.choices[0].message.content)
```

**代码解析：**

1. **环境配置**：设置 API 端点和认证信息，使用 GitHub Token 访问模型
2. **工具声明**：在系统提示中通过特殊标记声明可用的工具（`brave_search`, `wolfram_alpha`）
3. **提示格式**：使用 Llama 3.1 特有的提示模板格式：
   - `<|begin_of_text|>`：文本开始标记
   - `<|start_header_id|>system<|end_header_id|>`：系统消息头
   - `<|eot_id|>`：消息结束标记
4. **工具调用**：模型会自动识别用户意图，调用 `brave_search.call(query="Stockholm weather")` 等形式的工具调用

> 注意：该示例仅展示了工具调用指令的生成。若需获得实际结果，需在 Brave API 页面创建免费账户并定义调用函数本身。

### Llama 3.1 函数调用的工作流程

1. 用户发送包含问题的消息
2. 模型分析问题，判断是否需要调用工具
3. 如果需要，模型生成工具调用指令（如 `<|python_tag|>brave_search.call(query="...")`）
4. 应用层执行工具调用，获取结果
5. 将工具结果返回给模型，模型生成最终回答

## Llama 3.2

尽管 Llama 3.1 是大语言模型，但其缺乏**多模态能力**——即无法使用图像等不同类型的输入作为提示并给出响应。Llama 3.2 填补了这一空白。

### 核心特性

**1. 多模态能力**

Llama 3.2 能够同时评估文本和图像提示，这代表了开源模型领域的重大进步：
- 可以理解和描述图像内容
- 可以基于图像回答问题
- 可以分析图表、文档截图等视觉内容

**2. 多种规模变体**

| 变体 | 参数量 | 类型 | 适用场景 |
|------|--------|------|----------|
| 90B Vision | 900 亿 | 多模态 | 复杂视觉理解任务 |
| 11B Vision | 110 亿 | 多模态 | 中等复杂度视觉任务 |
| 3B | 30 亿 | 纯文本 | 边缘/移动设备部署 |
| 1B | 10 亿 | 纯文本 | 极低资源环境部署 |

**3. 边缘部署支持**

纯文本变体（1B 和 3B）允许模型部署于边缘/移动设备，并支持低延迟推理，使 AI 能力延伸到手机和 IoT 设备。

### Llama 3.2 多模态代码示例

以下代码展示如何使用 Llama 3.2 90B Vision 对图像进行分析：

```python
import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import (
    SystemMessage,
    UserMessage,
    TextContentItem,
    ImageContentItem,
    ImageUrl,
    ImageDetailLevel,
)
from azure.core.credentials import AzureKeyCredential

token = os.environ["GITHUB_TOKEN"]
endpoint = "https://models.inference.ai.azure.com"
model_name = "Llama-3.2-90B-Vision-Instruct"

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)

response = client.complete(
    messages=[
        SystemMessage(
            content="You are a helpful assistant that describes images in details."
        ),
        UserMessage(
            content=[
                TextContentItem(text="What's in this image?"),
                ImageContentItem(
                    image_url=ImageUrl.load(
                        image_file="sample.jpg",
                        image_format="jpg",
                        detail=ImageDetailLevel.LOW)
                ),
            ],
        ),
    ],
    model=model_name,
)

print(response.choices[0].message.content)
```

**代码解析：**

1. **多模态消息构造**：
   - `TextContentItem`：文本提示，询问图像内容
   - `ImageContentItem`：图像输入，从本地文件加载
   - `ImageUrl.load()`：支持从本地文件或 URL 加载图像
   - `ImageDetailLevel.LOW`：设置图像处理精度（LOW/HIGH），LOW 速度快，HIGH 更详细

2. **系统提示**：指定模型的角色为"详细描述图像的助手"

3. **模型调用**：使用 `Llama-3.2-90B-Vision-Instruct` 模型处理多模态输入

4. **输出**：模型返回对图像的详细描述和分析

### 多模态应用场景

Llama 3.2 的视觉能力可应用于多种场景：

- **文档分析**：识别和提取文档截图中的文字和结构
- **图表理解**：解读数据图表、饼图、折线图等
- **产品描述**：基于商品图片自动生成描述文案
- **场景理解**：分析照片中的场景、物体和人物活动
- **OCR 增强**：结合文本理解能力，提供更准确的文字识别

## Llama 3.1 vs Llama 3.2 对比

| 特性 | Llama 3.1 | Llama 3.2 |
|------|-----------|-----------|
| **多模态** | 仅文本 | 文本 + 图像 |
| **最大参数** | 405B | 90B Vision |
| **上下文窗口** | 128K | 128K |
| **函数调用** | 原生支持 | 支持 |
| **边缘部署** | 不适合 | 1B/3B 变体支持 |
| **主要优势** | 复杂推理、函数调用 | 视觉理解、边缘部署 |
| **最佳场景** | 文本密集型任务 | 多模态任务 |

## 模型选型指南

根据你的具体需求，选择合适的模型：

| 需求场景 | 推荐模型 | 理由 |
|----------|----------|------|
| 复杂文本推理 | Llama 3.1 405B | 最大参数量，最强推理能力 |
| 函数调用工作流 | Llama 3.1 405B | 原生函数调用支持 |
| 图像理解和分析 | Llama 3.2 90B Vision | 多模态能力 |
| 图表/文档 OCR | Llama 3.2 90B Vision | 视觉推理 |
| 高性价比文本任务 | Llama 3.1 70B | 较小规模但能力强劲 |
| 移动/边缘部署 | Llama 3.2 1B/3B | 极小体积，低延迟 |
| 合成数据生成 | Llama 3.1 405B | 最佳生成质量 |

### 选型决策流程

1. **需要图像处理？** → 是 → 选择 Llama 3.2 Vision 变体
2. **需要边缘部署？** → 是 → 选择 Llama 3.2 1B/3B
3. **需要函数调用？** → 是 → 选择 Llama 3.1 405B
4. **需要最强推理？** → 是 → 选择 Llama 3.1 405B
5. **成本敏感？** → 是 → 选择 Llama 3.1 70B 或 Llama 3.2 11B

## 作业 / 练习

请完成以下练习来巩固你的学习：

1. **基础练习**：使用 Llama 3.1 70B Instruct 模型构建一个简单的问答系统，测试其文本推理能力
2. **函数调用练习**：按照本课的函数调用示例，定义一个自定义工具（如获取股票价格），让 Llama 3.1 405B 调用该工具
3. **多模态练习**：使用 Llama 3.2 90B Vision 分析一张包含图表的图片，要求模型解释图表中的数据趋势
4. **对比练习**：对相同的文本问题，分别使用 Llama 3.1 70B 和 405B，比较响应质量和延迟差异

## 知识检查

**问题**：Llama 3.2 相比 Llama 3.1 的核心突破是什么？

1. Llama 3.2 的参数量比 Llama 3.1 更大，文本推理能力更强
2. Llama 3.2 引入了多模态能力（文本+图像），并提供了适合边缘部署的轻量变体
3. Llama 3.2 取消了函数调用功能，专注于纯文本生成

**答案**：2

**解析**：

Llama 3.2 的核心突破在于引入了多模态视觉能力，弥补了 Llama 3.1 只能处理文本的不足。同时，Llama 3.2 提供了 1B 和 3B 的轻量纯文本变体，支持在边缘和移动设备上部署，实现了 AI 能力向资源受限设备的延伸。

## 扩展阅读

- [[大模型/Global_LLM_Ecosystem/Meta_LLaMA_Deep_Dive|Meta LLaMA 深度指南]]
- [[大模型/Edge_LLM/Edge_LLM_Deep_Dive|边缘LLM深度指南]]
- [[大模型/Fine_tuning_Techniques/Fine_tuning_Techniques|微调技术综述]]
- [[大模型/Global_LLM_Ecosystem/Mistral_AI_Deep_Dive|Mistral AI 深度指南]]
- [[90_Learn/courses/microsoft/microsoft_genai_for_beginners|Microsoft GenAI 入门课程]]

## 课程导航

| 上一课 | 下一课 |
|--------|--------|
| [[大模型/Global_LLM_Ecosystem/GenAI_L20_Building_with_Mistral|L20 使用Mistral模型构建]] | 课程完结 |