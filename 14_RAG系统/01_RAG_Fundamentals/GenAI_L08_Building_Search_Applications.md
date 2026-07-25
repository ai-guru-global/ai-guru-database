---
title: "构建搜索应用程序"
category: "14-rag-systems"
tags: ["microsoft-genai-course", "semantic-search", "embeddings", "vector-database", "cosine-similarity", "text-embedding"]
summary: "学习使用文本嵌入构建语义搜索应用，掌握嵌入索引创建、余弦相似度计算和向量数据库使用的完整流程。"
created: "2026-06-12"
updated: "2026-06-12"
source_url: "https://raw.githubusercontent.com/microsoft/generative-ai-for-beginners/main/translations/zh-CN/08-building-search-applications/README.md"
course: "Microsoft Generative AI for Beginners"
lesson_number: 8
tier: supporting
aliases:
  - "Genai L08 Building Search Applications"
  - "GenAI L08 Building Search Applications"
  - GenAI_L08_Building_Search_Applications
sources: []

---
## 学习目标

完成本课后，你将能够：

- 区分语义搜索和关键词搜索，理解各自的工作原理和适用场景
- 解释什么是文本嵌入（Embeddings），以及它们如何将文本转换为数值向量
- 使用嵌入创建一个数据搜索应用程序
- 理解余弦相似度的数学原理及其在搜索中的应用
- 了解向量数据库的选择和使用

## 本课前置知识

在开始本课之前，你应该已经了解：

- 基本的 Python 编程知识
- 前几课中关于 LLM 和 API 使用的基础概念
- 对向量和矩阵的基础数学理解
- Azure OpenAI 服务的基本使用方法

## 为什么要构建搜索应用程序

大型语言模型（LLMs）不仅仅用于聊天机器人和文本生成。通过使用嵌入（Embeddings），还可以构建搜索应用程序。嵌入是数据的数值表示，也称为向量，可用于数据的语义搜索。

### 实际场景：教育初创公司

本课将为我们的教育初创公司构建一个搜索应用程序。我们的初创公司是一家非营利组织，致力于为发展中国家的学生提供免费教育。公司拥有大量的 YouTube 视频，学生可以通过这些视频学习 AI 知识。公司希望构建一个搜索应用程序，允许学生通过输入问题来搜索相关的 YouTube 视频。

例如，学生可能会输入"什么是 Jupyter Notebooks？"或"什么是 Azure ML"，搜索应用程序将返回与问题相关的 YouTube 视频列表，更棒的是，搜索应用程序还会返回视频中回答问题的具体时间点链接。

本课包含一个 Microsoft AI Show YouTube 频道的转录嵌入索引。AI Show 是一个教授 AI 和机器学习的 YouTube 频道。嵌入索引包含截至 2023 年 10 月的所有 YouTube 转录嵌入。

以下是一个关于问题"可以在 Azure ML 中使用 RStudio 吗？"的语义查询示例。查看 YouTube URL，你会发现 URL 包含一个时间戳，直接跳转到视频中回答问题的具体时间点。

## 什么是语义搜索

你可能会问，什么是语义搜索？语义搜索是一种搜索技术，它利用查询中单词的语义或含义来返回相关结果。

### 语义搜索 vs 关键词搜索

以下是一个语义搜索的示例。假设你想买一辆车，你可能会搜索"我的梦想之车"，语义搜索能够理解你并不是在"做梦"关于一辆车，而是想要购买你"理想的"车。语义搜索能够理解你的意图并返回相关结果。

而关键词搜索则会字面搜索关于车的梦，通常会返回不相关的结果。

| 搜索类型 | 工作方式 | 优势 | 劣势 |
|---------|---------|------|------|
| 关键词搜索 | 基于词语的字面匹配 | 简单、快速、可预测 | 无法理解同义词和意图 |
| 语义搜索 | 基于语义和含义的匹配 | 理解意图、处理同义词 | 需要嵌入模型、计算成本较高 |

### 语义搜索的应用场景

语义搜索在以下场景中特别有用：

- **问答系统**：用户用自然语言提问，系统返回最相关的答案
- **文档检索**：在海量文档中找到与查询语义最相关的内容
- **推荐系统**：基于用户兴趣推荐语义相关的内容
- **客户支持**：将客户问题匹配到最相关的知识库文章

## 什么是文本嵌入

文本嵌入是一种用于自然语言处理的文本表示技术。文本嵌入是文本的语义数值表示。嵌入用于以机器易于理解的方式表示数据。有许多构建文本嵌入的模型，在本课中，我们将重点使用 OpenAI 嵌入模型生成嵌入。

### 嵌入的工作原理

举个例子，假设以下文本来自 AI Show YouTube 频道某一集的转录：

```
Today we are going to learn about Azure Machine Learning.
```

我们将文本传递给 OpenAI 嵌入 API，它会返回一个由 1536 个数字组成的嵌入，也就是一个向量。向量中的每个数字代表文本的不同方面。为了简洁，这里是向量中的前 10 个数字：

```python
[-0.006655829958617687, 0.0026128944009542465, 0.008792596869170666,
 -0.02446001023054123, -0.008540431968867779, 0.022071078419685364,
 -0.010703742504119873, 0.003311325330287218, -0.011632772162556648,
 -0.02187200076878071, ...]
```

### 嵌入的关键特性

1. **维度**：OpenAI 的 text-embedding-ada-002 模型生成 1536 维的向量。每个维度捕获文本语义的不同方面。
2. **语义相似性**：语义相近的文本在向量空间中距离较近。例如，"汽车"和"轿车"的嵌入向量会比"汽车"和"苹果"更接近。
3. **固定长度**：无论输入文本多长，嵌入向量的维度都是固定的（1536 维），这使得比较和存储变得简单。
4. **稠密表示**：与传统的独热编码（one-hot encoding）不同，嵌入是稠密向量，包含丰富的语义信息。

## 嵌入索引是如何创建的

本课的嵌入索引是通过一系列 Python 脚本创建的。你可以在本课的"scripts"文件夹中找到这些脚本及其使用说明。完成本课不需要运行这些脚本，因为嵌入索引已经为你提供。

### 创建流程详解

这些脚本执行以下操作：

#### 第一步：下载转录

下载 AI Show 播放列表中每个 YouTube 视频的转录。每个视频的完整转录文本将被保存下来，作为后续处理的基础数据。

#### 第二步：提取演讲者信息

使用 OpenAI Functions，尝试从 YouTube 转录的前 3 分钟中提取演讲者姓名。每个视频的演讲者姓名存储在嵌入索引 `embedding_index_3m.json` 中。这一步利用 LLM 的理解能力从非结构化文本中提取结构化信息。

#### 第三步：文本分块

将转录文本分块为**3 分钟的文本片段**。每个片段包括大约 20 个与下一个片段重叠的单词，以确保片段的嵌入不会被截断，并提供更好的搜索上下文。

分块策略的关键考虑：
- **片段大小**：3 分钟的片段大约包含 300-500 个词，适合嵌入模型处理
- **重叠量**：20 个词的重叠确保不会丢失片段边界的语义信息
- **时间对齐**：每个片段与视频的时间戳对应，便于返回精确的时间点

#### 第四步：生成摘要

每个文本片段传递给 OpenAI Chat API，将文本总结为 60 个单词。总结也存储在嵌入索引 `embedding_index_3m.json` 中。摘要的作用是提供文本的紧凑表示，便于快速浏览和匹配。

#### 第五步：生成嵌入向量

将片段文本传递给 OpenAI 嵌入 API。嵌入 API 返回一个由 1536 个数字组成的向量，表示片段的语义含义。片段及其 OpenAI 嵌入向量存储在嵌入索引 `embedding_index_3m.json` 中。

### 嵌入索引的数据结构

最终的嵌入索引 JSON 文件包含以下信息：

```json
{
  "title": "视频标题",
  "speaker": "演讲者",
  "chunk_text": "3分钟的文本片段...",
  "summary": "60词摘要...",
  "embedding": [0.001, -0.002, ...],
  "start_time": "00:03:00",
  "end_time": "00:06:00",
  "video_url": "https://youtube.com/watch?v=..."
}
```

## 向量数据库

为了简化课程，嵌入索引存储在名为 `embedding_index_3m.json` 的 JSON 文件中，并加载到 Pandas DataFrame 中。然而，在生产环境中，嵌入索引通常存储在向量数据库中。

### 常用的向量数据库

以下是几种常用的向量数据库：

| 数据库 | 特点 | 适用场景 |
|--------|------|---------|
| **Azure Cognitive Search** | 微软托管服务，与 Azure 生态集成 | 企业级搜索应用 |
| **Redis** | 高性能内存数据库，支持向量搜索 | 需要低延迟的应用 |
| **Pinecone** | 专门为向量搜索设计的托管服务 | 快速原型和中小规模应用 |
| **Weaviate** | 开源向量搜索引擎，支持多种嵌入模型 | 需要自定义部署的场景 |
| **Chroma** | 轻量级开源向量数据库 | 开发和测试环境 |
| **Milvus** | 高性能分布式向量数据库 | 大规模生产环境 |

### 选择向量数据库的考虑因素

- **数据规模**：小规模数据可以用 JSON 文件或 SQLite，大规模数据需要专用向量数据库
- **查询延迟**：实时应用需要低延迟，Redis 和 Pinecone 是好选择
- **部署方式**：托管服务（Azure Cognitive Search、Pinecone）vs 自托管（Milvus、Weaviate）
- **预算**：开源方案（Weaviate、Chroma）vs 商业方案
- **集成需求**：与现有技术栈的兼容性

## 理解余弦相似度

我们已经了解了文本嵌入，接下来需要学习如何使用文本嵌入来搜索数据，特别是通过余弦相似度找到与给定查询最相似的嵌入。

### 什么是余弦相似度

余弦相似度是两个向量之间相似度的度量，你也会听到它被称为"最近邻搜索"。要执行余弦相似度搜索，你需要使用 OpenAI 嵌入 API 对查询文本进行向量化。然后计算查询向量与嵌入索引中每个向量的余弦相似度。记住，嵌入索引中每个 YouTube 转录文本片段都有一个向量。最后，根据余弦相似度对结果进行排序，余弦相似度最高的文本片段与查询最相似。

### 数学原理

从数学角度来看，余弦相似度测量两个向量在多维空间中投影的角度的余弦值。这种测量很有用，因为即使两个文档由于大小不同而在欧几里得距离上相距较远，它们之间的角度可能较小，因此余弦相似度较高。

余弦相似度公式：

```
cosine_similarity(A, B) = (A · B) / (||A|| × ||B||)
```

其中：
- `A · B` 是向量 A 和 B 的点积
- `||A||` 和 `||B||` 是向量的模（长度）
- 结果值在 -1 到 1 之间，1 表示完全相同，0 表示无关，-1 表示完全相反

### 为什么使用余弦相似度而不是欧几里得距离

余弦相似度相比欧几里得距离的优势：

1. **不受向量长度影响**：长文档和短文档可以公平比较
2. **关注方向而非大小**：语义相似的文本在向量空间中方向相同
3. **归一化结果**：输出在 -1 到 1 之间，便于设置阈值

### Python 实现示例

```python
import numpy as np

def cosine_similarity(vector_a, vector_b):
    """
    计算两个向量的余弦相似度
    """
    dot_product = np.dot(vector_a, vector_b)
    norm_a = np.linalg.norm(vector_a)
    norm_b = np.linalg.norm(vector_b)
    return dot_product / (norm_a * norm_b)

# 示例使用
query_embedding = [0.1, 0.2, 0.3, ...]  # 查询的嵌入向量
doc_embedding = [0.15, 0.18, 0.32, ...]  # 文档的嵌入向量

similarity = cosine_similarity(query_embedding, doc_embedding)
print(f"余弦相似度: {similarity}")
```

## 构建你的第一个搜索应用程序

接下来，我们将学习如何使用嵌入构建一个搜索应用程序。该搜索应用程序将允许学生通过输入问题来搜索视频。搜索应用程序将返回与问题相关的视频列表，同时还会返回视频中回答问题的具体时间点链接。

### 系统要求

该解决方案已在 Windows 11、macOS 和 Ubuntu 22.04 上使用 Python 3.10 或更高版本进行构建和测试。你可以从 python.org 下载 Python。

### 创建 Azure 资源

在开始构建之前，你需要创建以下 Azure 资源：

#### 启动 Azure Cloud Shell

1. 登录 Azure 门户
2. 选择 Azure 门户右上角的 Cloud Shell 图标
3. 选择 **Bash** 作为环境类型

#### 创建资源组

```shell
az group create --name semantic-video-search --location eastus
```

你可以更改资源组的名称，但在更改资源位置时，请检查模型可用性表。

#### 创建 Azure OpenAI 服务资源

```shell
az cognitiveservices account create \
    --name semantic-video-openai \
    --resource-group semantic-video-search \
    --location eastus \
    --kind OpenAI \
    --sku s0
```

#### 获取端点和密钥

```shell
az cognitiveservices account show \
    --name semantic-video-openai \
    --resource-group semantic-video-search | jq -r .properties.endpoint

az cognitiveservices account keys list \
    --name semantic-video-openai \
    --resource-group semantic-video-search | jq -r .key1
```

#### 部署嵌入模型

```shell
az cognitiveservices account deployment create \
    --name semantic-video-openai \
    --resource-group semantic-video-search \
    --deployment-name text-embedding-ada-002 \
    --model-name text-embedding-ada-002 \
    --model-version "2" \
    --model-format OpenAI \
    --sku-capacity 100 \
    --sku-name "Standard"
```

## 作业 - 构建搜索应用程序

在 GitHub Codespaces 中打开解决方案笔记本，并按照 Jupyter Notebook 中的说明操作。运行笔记本时，系统会提示你输入查询。

### 搜索应用程序的核心逻辑

```python
import openai
import numpy as np
import pandas as pd

def create_embedding(text):
    """
    使用 OpenAI 嵌入 API 创建文本的嵌入向量
    """
    response = openai.Embedding.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response['data'][0]['embedding']

def search(query, embedding_index, top_k=5):
    """
    执行语义搜索，返回最相关的 top_k 个结果
    """
    query_embedding = create_embedding(query)
    
    results = []
    for item in embedding_index:
        similarity = cosine_similarity(query_embedding, item['embedding'])
        results.append({
            'title': item['title'],
            'speaker': item['speaker'],
            'summary': item['summary'],
            'start_time': item['start_time'],
            'video_url': item['video_url'],
            'similarity': similarity
        })
    
    # 按相似度排序
    results.sort(key=lambda x: x['similarity'], reverse=True)
    return results[:top_k]
```

## 知识检查

**问题**：在语义搜索中，余弦相似度相比欧几里得距离的主要优势是什么？

1. 计算速度更快，适合实时搜索场景
2. 不受向量长度影响，长文档和短文档可以公平比较
3. 能够直接返回搜索结果的排序分数

**答案**：2

**解析**：

余弦相似度测量的是两个向量在多维空间中方向的夹角，而非绝对距离。这意味着即使两个文档因长度差异很大导致欧几里得距离较远，只要语义方向一致，余弦相似度仍然较高。选项 1 不正确，余弦相似度的计算复杂度与欧几里得距离相当。选项 3 描述的是相似度计算的输出结果，而非相比欧几里得距离的核心优势。

## 扩展阅读

- [[90_学习/courses/microsoft/microsoft_genai_for_beginners]]
- [[14_RAG系统/RAG_Systems]]
- [[14_RAG系统/Vector_Database_for_dummy]]
- [[05_大模型/10_Multimodal_Models/GenAI_L09_Building_Image_Applications]]
- [[15_智能体/GenAI_L07_Building_Chat_Applications]]

## 课程导航

| 上一课 | 下一课 |
|--------|--------|
| [[15_智能体/GenAI_L07_Building_Chat_Applications|L07 构建聊天应用]] | [[05_大模型/10_Multimodal_Models/GenAI_L09_Building_Image_Applications|L09 构建图像生成应用]] |
