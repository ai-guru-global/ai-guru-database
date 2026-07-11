---
title: "检索增强生成(RAG)与向量数据库"
category: "14-rag-systems"
tags: ["microsoft-genai-course", "rag", "vector-database", "embeddings", "semantic-search"]
summary: "详解RAG架构原理与实现流程：知识库构建、文本嵌入、向量搜索、检索增强生成，以及向量数据库的选择与使用。"
created: "2026-06-12"
updated: "2026-06-12"
source_url: "https://raw.githubusercontent.com/microsoft/generative-ai-for-beginners/main/translations/zh-CN/15-rag-and-vector-databases/README.md"
course: "Microsoft Generative AI for Beginners"
lesson_number: 15
tier: supporting
aliases:
  - "Genai L15 Rag And Vector Databases"
  - "GenAI L15 RAG and Vector Databases"
  - GenAI_L15_RAG_and_Vector_Databases
sources: []

---
## 学习目标

完成本课后，你将能够：

- 解释RAG在数据检索和处理中的重要性，理解其工作原理和适用场景
- 设置RAG应用并将你的数据绑定到LLM，掌握从文本到嵌入的完整流程
- 在LLM应用中有效集成RAG和向量数据库，实现高质量的问答系统

## 本课前置知识

建议先了解大型语言模型（LLM）的基本概念，以及搜索引擎的工作原理。在搜索应用课程中，我们简要学习了如何将自己的数据整合到LLM中。本课程将深入探讨这一主题。

## 引言：为什么需要RAG

一个由LLM驱动的聊天机器人处理用户提示以生成响应。它被设计为交互式，能够与用户就各种主题进行交流。然而，它的回答受到以下两个限制：

1. **知识截止**：例如GPT-4的知识截止时间为2021年9月，意味着它不了解此日期之后发生的事件
2. **训练数据范围**：训练LLM使用的数据不包括个人笔记或公司产品手册等机密信息

本课程中，我们将使用以下技术栈构建场景：

- **Azure OpenAI**：用来创建聊天机器人的大型语言模型
- **AI for beginners' lesson on Neural Networks**：用来绑定LLM的数据
- **Azure AI Search**和**Azure Cosmos DB**：用于存储数据和创建搜索索引的向量数据库

用户将能够从笔记中创建练习测验、复习闪卡，并将其总结为简明概述。

## 一、检索增强生成（RAG）详解

### RAG是什么

**检索增强生成（Retrieval Augmented Generation，简称RAG）**是一种将外部知识检索与LLM生成能力相结合的技术框架。RAG允许LLM访问和利用其训练数据之外的最新信息。

### RAG的工作流程

RAG的运作流程如下：

#### 步骤1：知识库构建

在检索之前，文档需要被导入和预处理：

1. 将大型文档拆解成更小的块（chunks）
2. 将文本块转换为向量嵌入（embeddings）
3. 将嵌入存储在向量数据库中

#### 步骤2：用户查询

用户提出问题。这是整个RAG流程的触发点。

#### 步骤3：检索

当用户提问时，嵌入模型从知识库中检索相关信息：

1. 将用户问题转换为向量嵌入
2. 在向量数据库中搜索与问题最相似的文档嵌入
3. 返回最相关的文档块作为上下文

#### 步骤4：增强生成

LLM根据检索到的数据增强其回答：

1. 将检索到的上下文与用户问题一起传递给LLM
2. LLM基于检索到的上下文生成回答
3. 生成的回答不仅基于预训练数据，还包含来自附加上下文的相关信息

### RAG的架构原理

RAG的架构采用Transformer实现，由**编码器（Encoder）**和**解码器（Decoder）**两部分组成：

- **编码器**：当用户提出问题时，输入文本被"编码"为捕捉单词含义的向量
- **解码器**：向量被"解码"到文档索引，并基于用户查询生成新文本

### RAG的两种实现方法

根据论文[Retrieval-Augmented Generation for Knowledge intensive NLP Tasks](https://arxiv.org/pdf/2005.11401.pdf?WT.mc_id=academic-105485-koreyst)，实现RAG有两种方法：

| 方法 | 描述 | 工作方式 |
|------|------|----------|
| **RAG-Sequence** | 使用检索到的文档预测用户查询的最佳答案 | 对每个检索到的文档单独生成完整答案，然后选择最佳答案 |
| **RAG-Token** | 使用文档生成下一个token，再检索它们来回答查询 | 在生成每个token时都可以参考不同的检索文档，更灵活 |

### 为什么要使用RAG

RAG相比其他方法（如微调）有以下三大优势：

#### 1. 信息丰富性

- 确保文本响应是最新和当前的
- 通过访问内部知识库提高特定领域任务的性能
- 无需重新训练模型即可更新知识

#### 2. 减少幻觉

- 使用知识库中的**可验证数据**为用户查询提供上下文
- 模型的回答有明确的来源依据
- 用户可以验证信息的准确性

#### 3. 成本效益

- 相较于微调LLM，RAG更加经济实惠
- 无需GPU资源和大量标注数据
- 知识更新只需更新数据库，不需要重新训练模型

## 二、向量数据库详解

### 什么是向量数据库

向量数据库与传统数据库不同，是一种专门设计用来存储、管理和搜索嵌入向量的数据库。它存储文档的**数值表示**。将数据拆解为数值嵌入，使AI系统更容易理解和处理数据。

### 为什么需要向量数据库

我们将嵌入存储在向量数据库中，主要原因是：

- **LLM输入限制**：LLM对输入符号数（token数）有限制，无法将整个文档嵌入传递给LLM
- **高效检索**：需要将文档拆分成多个块，当用户提问时只返回最相关的嵌入
- **成本优化**：分块减少了通过LLM传递的token数量，从而降低成本

### 流行的向量数据库

| 数据库 | 特点 | 适用场景 |
|--------|------|----------|
| **Azure Cosmos DB** | 云原生、全球分布、自动缩放 | 企业级应用 |
| **Pinecone** | 全托管、低延迟 | 快速原型和生产 |
| **ChromaDB** | 开源、轻量级 | 开发和实验 |
| **Qdrant** | 高性能、Rust编写 | 需要高性能的场景 |
| **DeepLake** | 多模态支持 | 图像+文本混合搜索 |
| **ScaNN** | Google开发、高效 | 大规模向量搜索 |
| **Clarifyai** | 易于集成 | 快速部署 |

### 创建Azure Cosmos DB

使用Azure CLI通过以下命令创建Azure Cosmos DB：

```bash
az login
az group create -n <resource-group-name> -l <location>
az cosmosdb create -n <cosmos-db-name> -r <resource-group-name>
az cosmosdb list-keys -n <cosmos-db-name> -g <resource-group-name>
```

## 三、从文本到嵌入

### 文本分块策略

在存储数据之前，需要将文本转换为向量嵌入。处理大型文档或长文本时，分块策略至关重要。

#### 分块的层次

- **句子层面**：按句子拆分，粒度最细
- **段落层面**：按段落拆分，保留更多上下文
- **固定长度**：按字符或token数拆分，简单但可能截断语义

#### 添加上下文信息

由于分块从周围单词中提取含义，可以为分块添加其他上下文：

- 文档标题
- 分块之前或之后的文本
- 章节标题和层级信息
- 元数据（作者、日期、来源等）

#### 分块代码实现

```python
def split_text(text, max_length, min_length):
    words = text.split()
    chunks = []
    current_chunk = []

    for word in words:
        current_chunk.append(word)
        if len(' '.join(current_chunk)) < max_length and len(' '.join(current_chunk)) > min_length:
            chunks.append(' '.join(current_chunk))
            current_chunk = []

    if current_chunk:
        chunks.append(' '.join(current_chunk))

    return chunks
```

### 嵌入模型选择

分块完成后，可以使用不同的嵌入模型对文本进行嵌入：

| 模型 | 提供者 | 特点 | 适用场景 |
|------|--------|------|----------|
| **word2vec** | Google | 经典模型、轻量 | 简单文本任务 |
| **text-embedding-ada-002** | OpenAI | 高质量、多语言 | 通用文本嵌入 |
| **Azure计算机视觉** | Microsoft | 多模态 | 图像+文本 |
| **BGE embeddings** | BAAI | 开源、高性能 | 中文场景 |
| **Cohere embeddings** | Cohere | 多语言 | 跨语言搜索 |

选择模型取决于：

- 使用的语言
- 编码内容的类型（文本/图像/音频）
- 输入大小限制
- 嵌入输出维度和长度
- 成本预算

**嵌入示例**：使用OpenAI的`text-embedding-ada-002`模型嵌入"cat"一词，会生成一个高维向量（如1536维），其中每个维度捕捉"cat"这个概念的不同语义方面。

## 四、检索和向量搜索

### 检索过程详解

当用户提问时，检索器执行以下步骤：

1. 使用查询编码器将提问转为向量
2. 在文档搜索索引中搜索与输入相关的向量
3. 找到最相关的文档向量
4. 将输入向量和文档向量转换为文本
5. 传递给LLM生成最终回答

### 三种检索方式

#### 1. 关键词搜索

- 用于文本搜索
- 基于精确或模糊的词汇匹配
- 速度快，但无法理解语义

#### 2. 向量搜索（语义搜索）

- 使用嵌入模型将文档从文本转换为向量表示
- 允许基于单词**含义**的语义搜索
- 通过查询与用户问题向量最接近的文档向量来检索
- 可以找到表达方式不同但含义相似的文本

#### 3. 混合搜索

- 关键词搜索和向量搜索的组合
- 结合两种方法的优势
- 提高检索的准确性和召回率

### 检索的挑战与应对

检索面临的主要挑战是：当数据库中不存在与查询相似的响应时，系统将返回最佳可用信息。

**应对策略**：
- 设定最大相关距离阈值
- 使用结合关键词和向量搜索的混合搜索
- 当检索结果质量不够时，返回默认回答或请求用户澄清

### 向量相似度度量

检索器会在知识库中搜索彼此接近的嵌入，即**最近邻（Nearest Neighbor）**，因为这些文本相似。

#### 余弦相似度（Cosine Similarity）

最常用的相似度度量方法，基于两个向量之间的角度：

- 值范围：-1到1
- 1表示方向完全相同（最相似）
- 0表示正交（无关联）
- -1表示方向完全相反

#### 欧氏距离（Euclidean Distance）

向量端点间的直线距离：

- 值越小表示越相似
- 对向量的幅度敏感
- 适合维度较低的场景

#### 点积（Dot Product）

对应元素乘积之和：

- 考虑了向量的方向和幅度
- 值越大表示越相似
- 计算效率高

### 构建搜索索引

执行检索前，需要为知识库构建搜索索引。索引存储嵌入，即使在大型数据库中也能快速检索最相似的分块。

```python
from sklearn.neighbors import NearestNeighbors

embeddings = flattened_df['embeddings'].to_list()

nbrs = NearestNeighbors(n_neighbors=5, algorithm='ball_tree').fit(embeddings)

distances, indices = nbrs.kneighbors(embeddings)
```

### 重新排序（Re-ranking）

查询数据库后，可能需要将结果按相关性排序。重新排序利用机器学习技术提升搜索结果的准确度。

使用Azure AI Search时，语义重新排序器会自动完成此工作。以下是基于最近邻的重新排序示例：

```python
distances, indices = nbrs.kneighbors([query_vector])

index = []
for i in range(3):
    index = indices[0][i]
    for index in indices[0]:
        print(flattened_df['chunks'].iloc[index])
        print(flattened_df['path'].iloc[index])
        print(flattened_df['distances'].iloc[index])
    else:
        print(f"Index {index} not found in DataFrame")
```

## 五、综合应用：完整RAG系统实现

### 端到端代码实现

最后一步是将LLM整合进来，生成基于数据的响应：

```python
user_input = "what is a perceptron?"

def chatbot(user_input):
    query_vector = create_embeddings(user_input)

    distances, indices = nbrs.kneighbors([query_vector])

    history = []
    for index in indices[0]:
        history.append(flattened_df['chunks'].iloc[index])

    history.append(user_input)

    messages=[
        {"role": "system", "content": "You are an AI assistant that helps with AI questions."},
        {"role": "user", "content": "\n\n".join(history) }
    ]

    response = openai.chat.completions.create(
        model="gpt-4",
        temperature=0.7,
        max_tokens=800,
        messages=messages
    )

    return response.choices[0].message

chatbot(user_input)
```

### 代码解析

这个完整的RAG系统包含以下步骤：

1. **用户输入处理**：接收用户的问题
2. **向量化查询**：将问题转换为查询向量
3. **相似文档检索**：使用最近邻算法找到最相似的文档
4. **上下文组装**：将检索到的文档块和用户问题组合成消息
5. **LLM生成**：使用GPT-4基于检索到的上下文生成回答
6. **返回结果**：返回生成的回答

### 关键参数说明

| 参数 | 值 | 说明 |
|------|-----|------|
| `n_neighbors` | 5 | 检索最相似的5个文档块 |
| `temperature` | 0.7 | 控制生成的随机性 |
| `max_tokens` | 800 | 最大生成token数 |
| `algorithm` | ball_tree | 用于最近邻搜索的算法 |

## 六、评估RAG应用

### 四大评估指标

| 指标 | 描述 | 评估方法 |
|------|------|----------|
| **回答质量** | 回答是否自然、流畅且类似人类语言 | 人工评估 + 自动化流畅度评分 |
| **数据绑定度** | 回答是否来源于提供的文档 | 事实性检查 + 来源追溯 |
| **相关性** | 回答是否与提问匹配且相关 | 语义相似度 + 人工评估 |
| **流畅性** | 回答在语法上的合理性 | 语法检查 + 可读性评分 |

### 评估最佳实践

- 使用人工评估作为金标准
- 建立评估数据集进行自动化测试
- 跟踪指标变化趋势
- 收集和分析用户反馈

## 七、RAG应用场景

RAG和向量数据库可以应用于多种场景：

| 场景 | 描述 | 实现方式 |
|------|------|----------|
| **问答系统** | 将公司数据绑定到聊天机器人 | 企业知识库 + RAG |
| **推荐系统** | 匹配最相似值（电影、餐厅等） | 向量相似度搜索 |
| **聊天机器人** | 存储聊天历史，个性化对话 | 会话历史嵌入 |
| **图像搜索** | 基于向量嵌入的图像检索 | 多模态嵌入模型 |
| **文档分析** | 从大量文档中提取信息 | 文档分块 + RAG |
| **代码助手** | 基于代码库回答问题 | 代码嵌入 + RAG |

## 八、RAG框架推荐

为了简化RAG的创建，可以使用以下框架：

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| **Semantic Kernel** | 微软出品、.NET/Python支持 | 企业级应用 |
| **LangChain** | 生态丰富、社区活跃 | 通用RAG应用 |
| **AutoGen** | 多代理协作 | 复杂任务场景 |
| **LlamaIndex** | 专注数据索引 | 文档密集型应用 |

## 作业

### 实践任务

继续学习检索增强生成（RAG），你可以：

1. **前端开发**：使用你选择的框架为应用构建前端
2. **框架实践**：使用LangChain或Semantic Kernel框架重新创建你的应用
3. **评估优化**：为你的RAG应用建立评估数据集，优化检索参数

## 知识检查

**问题**：在RAG系统中，向量搜索相比关键词搜索的核心优势是什么？

1. 检索速度更快，适合大规模数据
2. 能够基于语义含义进行匹配，找到表达方式不同但含义相似的文本
3. 不需要嵌入模型，部署成本更低

**答案**：2

**解析**：

向量搜索（语义搜索）使用嵌入模型将文档转换为向量表示，允许基于单词含义的语义搜索，能够找到表达方式不同但含义相似的文本。选项1错误，向量搜索不一定比关键词搜索更快；选项3错误，向量搜索需要嵌入模型来生成向量表示。

## 扩展阅读

- [[学习/courses/microsoft/microsoft_genai_for_beginners]] - 课程总览
- [[RAG系统/RAG-in-nutshell]] - RAG核心概念
- [[RAG系统/Vector_Database_for_dummy]] - 向量数据库入门
- [[RAG系统/RAG_Frameworks/LlamaIndex_Deep_Dive]] - LlamaIndex框架
- [[RAG系统/Vector_Databases/Chroma_Deep_Dive]] - Chroma向量数据库
- [[模型运维/GenAI_L14_GenAI_Application_Lifecycle]] - AI应用生命周期

## 课程导航

| 上一课 | 下一课 |
|--------|--------|
| [[模型运维/GenAI_L14_GenAI_Application_Lifecycle|L14 GenAI应用生命周期]] | [[大模型/GenAI_L16_Open_Source_Models_and_Hugging_Face|L16 开源模型与Hugging Face]] |

## Related

- [[治理/finetuning-rag-decision|微调 × RAG: LLM 应用知识注入的两条路径]]
