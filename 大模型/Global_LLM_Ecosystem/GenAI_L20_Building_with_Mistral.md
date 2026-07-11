---
title: "使用Mistral模型构建应用"
category: "05-nlp-llms-global-llm-ecosystem"
tags: ["microsoft-genai-course", "mistral", "rag", "function-calling", "tokenizer", "mistral-large", "mistral-small", "mistral-nemo"]
summary: "深入探讨Mistral AI的三款主力模型：旗舰级Mistral Large 2、高性价比Mistral Small、开源Mistral NeMo，包含RAG、函数调用和分词器对比的完整代码示例。"
created: "2026-06-12"
updated: "2026-06-12"
source_url: "https://raw.githubusercontent.com/microsoft/generative-ai-for-beginners/main/translations/zh-CN/20-mistral/README.md"
course: "Microsoft Generative AI for Beginners"
lesson_number: 20
tier: supporting
aliases:
  - "Genai L20 Building With Mistral"
  - "GenAI L20 Building with Mistral"
  - GenAI_L20_Building_with_Mistral
sources: []

---
## 学习目标

本课程将涵盖以下内容：

- 探索不同的 Mistral 模型及其特点
- 理解每个模型的使用场景和适用情况
- 通过代码示例展示每个模型的独特功能
- 学习如何在实际项目中选择合适的 Mistral 模型

## 本课前置知识

学习本课之前，建议你已经了解：

- 大型语言模型（LLM）的基本概念
- RAG（检索增强生成）的基本原理
- 函数调用（Function Calling）的概念
- Python 编程基础
- Azure AI Inference SDK 的基本使用方法
- 向量嵌入（Embeddings）和向量搜索的基本概念

## Mistral 模型概览

在本课中，我们将探索 3 种不同的 Mistral 模型：**Mistral Large**、**Mistral Small** 和 **Mistral NeMo**。

这些模型均可在 GitHub 模型市场上免费获得，本课中的代码将使用这些模型来运行。GitHub 模型提供了便捷的 API 端点，适合原型设计和开发测试。

## Mistral Large 2 (2407)

Mistral Large 2 是目前 Mistral 的旗舰模型，专为企业使用设计。

### 核心升级

该模型是对原始 Mistral Large 的全面升级，提供以下改进：

| 特性 | Mistral Large 2 | 原始 Mistral Large |
|------|-----------------|-------------------|
| 上下文窗口 | 128K token | 32K token |
| 数学/编码准确率 | 76.9% | 60.4% |
| 多语言支持 | 13种语言 | 有限 |

### 多语言支持

Mistral Large 2 增强了多语言性能，支持的语言包括：

- 英语、法语、德语、西班牙语、意大利语
- 葡萄牙语、荷兰语、俄语
- 中文、日语、韩语
- 阿拉伯语、印地语

### 核心应用场景

凭借这些功能，Mistral Large 在以下方面表现出色：

**1. 检索增强生成（RAG）**

由于更大的上下文窗口（128K token），Mistral Large 2 能够处理更长的文档和更复杂的检索场景。这意味着：
- 可以在一次推理中处理更长的文档
- 检索到的上下文块可以包含更多相关信息
- 减少了因上下文截断导致的信息丢失

**2. 函数调用（Function Calling）**

该模型具有原生函数调用功能，允许与外部工具和 API 集成。关键特性：
- 支持并行函数调用：一次推理中可调用多个函数
- 支持顺序函数调用：函数可以按特定顺序依次执行
- 函数调用结果可以自动融入后续推理

**3. 代码生成**

在代码生成方面表现卓越，支持的语言包括：
- Python
- Java
- TypeScript
- C++

### 使用 Mistral Large 2 的 RAG 示例

以下示例展示如何使用 Mistral Large 2 对文本文件运行 RAG 模式。问题以韩语书写，询问作者大学前的活动。

该示例使用 Cohere Embeddings 模型对文本文件和问题分别创建嵌入，使用 faiss Python 包作为向量存储。

**安装依赖：**

```python
pip install faiss-cpu
```

**完整 RAG 示例代码：**

```python
import requests
import numpy as np
import faiss
import os

from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
from azure.ai.inference import EmbeddingsClient

endpoint = "https://models.inference.ai.azure.com"
model_name = "Mistral-large"
token = os.environ["GITHUB_TOKEN"]

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)

response = requests.get('https://raw.githubusercontent.com/run-llama/llama_index/main/docs/docs/examples/data/paul_graham/paul_graham_essay.txt')
text = response.text

chunk_size = 2048
chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]
len(chunks)

embed_model_name = "cohere-embed-v3-multilingual"

embed_client = EmbeddingsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token)
)

embed_response = embed_client.embed(
    input=chunks,
    model=embed_model_name
)

text_embeddings = []
for item in embed_response.data:
    length = len(item.embedding)
    text_embeddings.append(item.embedding)
text_embeddings = np.array(text_embeddings)

d = text_embeddings.shape[1]
index = faiss.IndexFlatL2(d)
index.add(text_embeddings)

question = "저자가 대학에 오기 전에 주로 했던 두 가지 일은 무엇이었나요?"

question_embedding = embed_client.embed(
    input=[question],
    model=embed_model_name
)

question_embeddings = np.array(question_embedding.data[0].embedding)

D, I = index.search(question_embeddings.reshape(1, -1), k=2)
retrieved_chunks = [chunks[i] for i in I.tolist()[0]]

prompt = f"""
Context information is below.
---------------------
{retrieved_chunks}
---------------------
Given the context information and not prior knowledge, answer the query.
Query: {question}
Answer:
"""

chat_response = client.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant."),
        UserMessage(content=prompt),
    ],
    temperature=1.0,
    top_p=1.0,
    max_tokens=1000,
    model=model_name
)

print(chat_response.choices[0].message.content)
```

**代码解析：**

1. **数据获取与分块**：从网络获取文本文件，按 2048 字符大小分块
2. **向量化**：使用 Cohere 多语言嵌入模型将文本块转换为向量
3. **索引构建**：使用 FAISS 构建向量索引，支持高效相似度搜索
4. **查询处理**：将韩语问题同样转化为向量，在索引中搜索最相关的文本块
5. **RAG 推理**：将检索到的文本块作为上下文，连同问题一起发送给 Mistral Large 2，获得自然语言回答

## Mistral Small

Mistral Small 是 Mistral 家族中另一款位于高级/企业类别的模型。顾名思义，这是一款小型语言模型（SLM）。

### 核心优势

使用 Mistral Small 的优势：

- **成本节省**：与 Mistral LLM（如 Mistral Large 和 NeMo）相比，价格下降约 80%
- **低延迟**：相对于 Mistral 的大型语言模型响应更快
- **灵活部署**：可以在不同环境中部署，对所需资源的限制较少

### 适用场景

Mistral Small 适合以下任务：

- 基于文本的任务，如**摘要**、**情感分析**和**翻译**
- **频繁请求**的应用场景，因其成本效益突出
- 低延迟**代码任务**，如代码审查和建议

### 比较 Mistral Small 和 Mistral Large

以下代码展示两模型在延迟上的差异。你将看到响应时间差异约为 3 到 5 秒，也请注意同一提示下的响应长度和风格差异。

**Mistral Small 示例：**

```python
import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

endpoint = "https://models.inference.ai.azure.com"
model_name = "Mistral-small"
token = os.environ["GITHUB_TOKEN"]

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)

response = client.complete(
    messages=[
        SystemMessage(content="You are a helpful coding assistant."),
        UserMessage(content="Can you write a Python function to the fizz buzz test?"),
    ],
    temperature=1.0,
    top_p=1.0,
    max_tokens=1000,
    model=model_name
)

print(response.choices[0].message.content)
```

**Mistral Large 示例：**

```python
import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

endpoint = "https://models.inference.ai.azure.com"
model_name = "Mistral-large"
token = os.environ["GITHUB_TOKEN"]

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)

response = client.complete(
    messages=[
        SystemMessage(content="You are a helpful coding assistant."),
        UserMessage(content="Can you write a Python function to the fizz buzz test?"),
    ],
    temperature=1.0,
    top_p=1.0,
    max_tokens=1000,
    model=model_name
)

print(response.choices[0].message.content)
```

**对比要点：**

| 维度 | Mistral Small | Mistral Large |
|------|---------------|---------------|
| 响应延迟 | 较低（约 1-2 秒） | 较高（约 3-5 秒） |
| 输出详细度 | 简洁直接 | 更详细丰富 |
| 成本 | 低（约为 Large 的 20%） | 高 |
| 代码质量 | 适合常见任务 | 适合复杂算法和架构 |

## Mistral NeMo

与本课讨论的其它两款模型相比，Mistral NeMo 是唯一带有 **Apache 2 许可证**的免费模型。

它被视为 Mistral 早期开源大型语言模型 Mistral 7B 的升级版。

### NeMo 模型的核心特点

**1. 更高效的分词**

该模型采用 **Tekken 分词器**，而非常用的 tiktoken。这使其在更多语言和代码上的表现更好：

- 对多语言文本的分词效率更高
- 对代码的分词更准确
- 在相同文本下产生的 token 数量更少，降低推理成本

**2. 微调支持**

基础模型支持微调，允许针对可能需要微调的用例增加灵活性。这意味着你可以：
- 使用领域特定数据对模型进行定制
- 调整模型以适应特定的输出格式
- 在特定任务上优化模型性能

**3. 原生函数调用**

与 Mistral Large 一样，该模型经过函数调用训练。它是首批开源支持此功能的模型之一，具有独特性：
- 支持定义和调用外部函数
- 支持并行和顺序函数调用
- 函数调用结果可以自动融入对话上下文

### 分词器比较

在此示例中，我们将查看 Mistral NeMo 在分词处理上与 Mistral Large 的区别。两个示例均使用相同提示，但你应会看到 NeMo 返回的标记数少于 Mistral Large。

**安装依赖：**

```bash
pip install mistral-common
```

**Mistral NeMo 分词示例：**

```python
from mistral_common.protocol.instruct.messages import UserMessage
from mistral_common.protocol.instruct.request import ChatCompletionRequest
from mistral_common.protocol.instruct.tool_calls import Function, Tool
from mistral_common.tokens.tokenizers.mistral import MistralTokenizer

model_name = "open-mistral-nemo"
tokenizer = MistralTokenizer.from_model(model_name)

tokenized = tokenizer.encode_chat_completion(
    ChatCompletionRequest(
        tools=[
            Tool(
                function=Function(
                    name="get_current_weather",
                    description="Get the current weather",
                    parameters={
                        "type": "object",
                        "properties": {
                            "location": {
                                "type": "string",
                                "description": "The city and state, e.g. San Francisco, CA",
                            },
                            "format": {
                                "type": "string",
                                "enum": ["celsius", "fahrenheit"],
                                "description": "The temperature unit to use.",
                            },
                        },
                        "required": ["location", "format"],
                    },
                )
            )
        ],
        messages=[
            UserMessage(content="What's the weather like today in Paris"),
        ],
        model=model_name,
    )
)
tokens, text = tokenized.tokens, tokenized.text
print(len(tokens))
```

**Mistral Large 分词示例：**

```python
from mistral_common.protocol.instruct.messages import UserMessage
from mistral_common.protocol.instruct.request import ChatCompletionRequest
from mistral_common.protocol.instruct.tool_calls import Function, Tool
from mistral_common.tokens.tokenizers.mistral import MistralTokenizer

model_name = "mistral-large-latest"
tokenizer = MistralTokenizer.from_model(model_name)

tokenized = tokenizer.encode_chat_completion(
    ChatCompletionRequest(
        tools=[
            Tool(
                function=Function(
                    name="get_current_weather",
                    description="Get the current weather",
                    parameters={
                        "type": "object",
                        "properties": {
                            "location": {
                                "type": "string",
                                "description": "The city and state, e.g. San Francisco, CA",
                            },
                            "format": {
                                "type": "string",
                                "enum": ["celsius", "fahrenheit"],
                                "description": "The temperature unit to use.",
                            },
                        },
                        "required": ["location", "format"],
                    },
                )
            )
        ],
        messages=[
            UserMessage(content="What's the weather like today in Paris"),
        ],
        model=model_name,
    )
)
tokens, text = tokenized.tokens, tokenized.text
print(len(tokens))
```

**分词比较结论：**

- NeMo 的 Tekken 分词器在处理相同提示时产生的 token 数量通常更少
- 更少的 token 意味着更低的推理成本和更快的处理速度
- 对于包含函数调用定义的复杂提示，差异更为明显

## 三款模型综合对比

| 特性 | Mistral Large 2 | Mistral Small | Mistral NeMo |
|------|-----------------|---------------|--------------|
| **定位** | 企业旗舰 | 高性价比 | 开源免费 |
| **许可证** | 商业许可 | 商业许可 | Apache 2.0 |
| **上下文窗口** | 128K | 适中 | 适中 |
| **函数调用** | 原生支持 | 支持 | 原生支持 |
| **分词器** | tiktoken | tiktoken | Tekken |
| **微调支持** | 有限 | 有限 | 完全支持 |
| **成本** | 高 | 低（约省 80%） | 免费 |
| **延迟** | 较高 | 低 | 中等 |
| **最佳场景** | 复杂 RAG、函数调用、代码生成 | 高频低成本任务、代码审查 | 开源项目、自定义微调 |

## 模型选型指南

| 需求场景 | 推荐模型 | 理由 |
|----------|----------|------|
| 复杂 RAG 应用 | Mistral Large 2 | 128K 上下文窗口，最佳 RAG 性能 |
| 需要函数调用的工作流 | Mistral Large 2 或 NeMo | 原生函数调用支持 |
| 高频低延迟文本任务 | Mistral Small | 低成本、低延迟 |
| 开源项目部署 | Mistral NeMo | Apache 2 许可，完全免费 |
| 自定义微调 | Mistral NeMo | 支持完整微调 |
| 多语言 RAG | Mistral Large 2 | 13 种语言支持 |
| 代码审查和建议 | Mistral Small | 低延迟、高性价比 |

## 作业 / 练习

请完成以下练习来巩固你的学习：

1. **基础练习**：使用 Mistral Small 编写一个简单的聊天程序，测试其文本生成能力
2. **RAG 练习**：按照本课的 RAG 示例，使用自己的文本文件构建一个 RAG 系统，尝试用中文提问
3. **分词器练习**：使用 `mistral-common` 包比较 NeMo 和 Large 在处理中文文本时的 token 数量差异
4. **对比练习**：对同一组问题分别使用 Small 和 Large 模型，记录响应时间、质量和成本差异

## 知识检查

**问题**：Mistral NeMo 与 Mistral Large 2 的主要区别是什么？

1. Mistral NeMo 是闭源商业模型，而 Mistral Large 2 是开源免费的
2. Mistral NeMo 采用 Apache 2.0 许可证且使用 Tekken 分词器，而 Mistral Large 2 是商业许可的旗舰模型，上下文窗口达 128K
3. Mistral NeMo 的参数量比 Mistral Large 2 更大，性能更强

**答案**：2

**解析**：

Mistral NeMo 是唯一带有 Apache 2.0 许可证的免费模型，采用 Tekken 分词器，在多语言和代码分词上效率更高。Mistral Large 2 则是 Mistral 的旗舰商业模型，拥有 128K 的上下文窗口，在 RAG 和复杂推理场景中表现最佳。两者在许可证、定位和适用场景上有本质区别。

## 扩展阅读

- [[大模型/Global_LLM_Ecosystem/Mistral_AI_Deep_Dive|Mistral AI 深度指南]]
- [[大模型/Fine_tuning_Techniques/Fine_tuning_Techniques|微调技术综述]]
- [[大模型/Edge_LLM/Edge_LLM_Deep_Dive|边缘LLM深度指南]]
- [[大模型/Global_LLM_Ecosystem/Meta_LLaMA_Deep_Dive|Meta LLaMA 深度指南]]
- [[学习/courses/microsoft/microsoft_genai_for_beginners|Microsoft GenAI 入门课程]]

## 课程导航

| 上一课 | 下一课 |
|--------|--------|
| [[大模型/Edge_LLM/GenAI_L19_Building_with_SLMs|L19 使用小型语言模型构建]] | [[大模型/Global_LLM_Ecosystem/GenAI_L21_Building_with_Meta|L21 使用Meta家族模型构建]] |
