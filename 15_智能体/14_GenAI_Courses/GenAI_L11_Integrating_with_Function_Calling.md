---
title: "集成函数调用"
category: "15-agent-production"
tags: ["microsoft-genai-course", "function-calling", "azure-openai", "structured-output", "api-integration"]
summary: "学习使用Azure OpenAI函数调用功能实现结构化响应、外部API集成和工具调用，构建具备外部数据访问能力的完整AI应用。"
created: "2026-06-12"
updated: "2026-06-12"
source_url: "https://raw.githubusercontent.com/microsoft/generative-ai-for-beginners/main/translations/zh-CN/11-integrating-with-function-calling/README.md"
course: "Microsoft Generative AI for Beginners"
lesson_number: 11
tier: supporting
aliases:
  - "Genai L11 Integrating With Function Calling"
  - "GenAI L11 Integrating with Function Calling"
  - GenAI_L11_Integrating_with_Function_Calling
sources: []

---
## 学习目标

完成本课程后，你将能够：

- 解释使用函数调用的目的及其解决的问题
- 使用 Azure OpenAI 服务设置和实现函数调用
- 为你的应用场景设计有效的函数调用
- 将函数调用集成到完整的应用程序中
- 理解函数调用的三步流程：消息创建 → 响应处理 → 自然语言生成

## 本课前置知识

在开始本课之前，你应该已经了解：

- 前几课中关于 OpenAI API 和 Chat Completions 的使用经验
- 基本的 Python 编程知识
- JSON 数据格式的基础理解
- 对 REST API 的基本理解

## 为什么需要函数调用

在之前的课程中，你已经学到了不少内容。然而，我们仍然可以进一步改进。我们可以解决的一些问题包括如何获得更一致的响应格式，以便更容易在后续处理响应。此外，我们可能希望从其他来源添加数据，以进一步丰富我们的应用程序。

### LLM 响应的非结构化问题

在使用函数调用之前，LLM 的响应是非结构化且不一致的。开发人员需要编写复杂的验证代码，以确保能够处理每种响应的变化。用户无法获得像"斯德哥尔摩当前天气如何？"这样的答案，这是因为模型仅限于其训练数据的时间范围。

### 函数调用解决的两大限制

函数调用是 Azure OpenAI 服务的一项功能，用于克服以下限制：

- **一致的响应格式**。如果我们能够更好地控制响应格式，就可以更轻松地将响应集成到其他系统中。
- **外部数据**。能够在聊天上下文中使用应用程序的其他数据源。

### 重要概念：LLM 不直接执行函数

当使用函数调用时，LLM 实际上并不会调用或运行任何函数。相反，我们为 LLM 创建一个结构，以便其响应遵循该结构。然后我们使用这些结构化响应来确定在我们的应用程序中运行哪些函数。这种设计确保了安全性——AI 模型无法直接执行可能有害的操作。

## 通过场景说明问题

让我们通过一个具体的场景来说明函数调用如何解决格式化问题。

### 场景：学生数据提取

假设我们想创建一个学生数据的数据库，以便向他们推荐合适的课程。下面是两个学生描述，它们包含的数据非常相似。

#### 第一步：创建 Azure OpenAI 连接

```python
import os
import json
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AzureOpenAI(
    api_key=os.environ['AZURE_OPENAI_API_KEY'],
    api_version="2023-07-01-preview"
)

deployment = os.environ['AZURE_OPENAI_DEPLOYMENT']
```

#### 第二步：创建学生描述

```python
student_1_description = "Emily Johnson is a sophomore majoring in computer science at Duke University. She has a 3.7 GPA. Emily is an active member of the university's Chess Club and Debate Team. She hopes to pursue a career in software engineering after graduating."

student_2_description = "Michael Lee is a sophomore majoring in computer science at Stanford University. He has a 3.8 GPA. Michael is known for his programming skills and is an active member of the university's Robotics Club. He hopes to pursue a career in artificial intelligence after finishing his studies."
```

#### 第三步：创建提示词

我们希望将上述学生描述发送到 LLM 以解析数据。这些数据可以稍后用于我们的应用程序，并发送到 API 或存储到数据库中。

```python
prompt1 = f'''
Please extract the following information from the given text and return it as a JSON object:

name
major
school
grades
club

This is the body of text to extract the information from:
{student_1_description}
'''

prompt2 = f'''
Please extract the following information from the given text and return it as a JSON object:

name
major
school
grades
club

This is the body of text to extract the information from:
{student_2_description}
'''
```

#### 第四步：发送请求

```python
# 第一个提示的响应
openai_response1 = client.chat.completions.create(
    model=deployment,
    messages=[{'role': 'user', 'content': prompt1}]
)

# 第二个提示的响应
openai_response2 = client.chat.completions.create(
    model=deployment,
    messages=[{'role': 'user', 'content': prompt2}]
)
```

#### 第五步：解析响应

```python
# 将响应加载为 JSON 对象
json_response1 = json.loads(openai_response1.choices[0].message.content)
json_response2 = json.loads(openai_response2.choices[0].message.content)
```

响应 1：

```json
{
    "name": "Emily Johnson",
    "major": "computer science",
    "school": "Duke University",
    "grades": "3.7",
    "club": "Chess Club"
}
```

响应 2：

```json
{
    "name": "Michael Lee",
    "major": "computer science",
    "school": "Stanford University",
    "grades": "3.8 GPA",
    "club": "Robotics Club"
}
```

### 问题分析

尽管提示相同且描述相似，但我们看到 `grades` 属性的值格式不同，例如有时是 `3.7` 或 `3.8 GPA`。这是因为 LLM 接收的是非结构化数据（书面提示），返回的也是非结构化数据。我们需要一个结构化的格式，以便在存储或使用这些数据时知道该期待什么。

## 创建你的第一个函数调用

创建函数调用的过程包括三个主要步骤：

1. **调用** Chat Completions API，提供函数列表和用户消息
2. **读取**模型的响应以执行操作，例如运行函数或 API 调用
3. **再次调用** Chat Completions API，使用函数的响应生成用户的自然语言回复

### 第一步：创建消息

第一步是创建用户消息。`role` 可以是 `system`（创建规则）、`assistant`（模型）或 `user`（最终用户）。对于函数调用，我们将其分配为 `user` 并提供一个示例问题。

```python
messages = [{"role": "user", "content": "Find me a good course for a beginner student to learn Azure."}]
```

通过分配不同的角色，可以明确告诉 LLM 是系统在说话还是用户在说话，这有助于构建 LLM 可以基于的对话历史。

### 第二步：创建函数定义

接下来，我们将定义一个函数及其参数。我们将在这里使用一个名为 `search_courses` 的函数，但你可以创建多个函数。

> 重要提示：函数包含在发送给 LLM 的系统消息中，并会占用可用的 token 数量。

```python
functions = [
    {
        "name": "search_courses",
        "description": "Retrieves courses from the search index based on the parameters provided",
        "parameters": {
            "type": "object",
            "properties": {
                "role": {
                    "type": "string",
                    "description": "The role of the learner (i.e. developer, data scientist, student, etc.)"
                },
                "product": {
                    "type": "string",
                    "description": "The product that the lesson is covering (i.e. Azure, Power BI, etc.)"
                },
                "level": {
                    "type": "string",
                    "description": "The level of experience the learner has prior to taking the course (i.e. beginner, intermediate, advanced)"
                }
            },
            "required": ["role"]
        }
    }
]
```

函数定义的每个部分解释：

- **`name`**：我们希望调用的函数名称。这应该与实际 Python 函数的名称匹配。
- **`description`**：这是对函数如何工作的描述。这里需要具体和清晰，因为 LLM 使用这个描述来决定何时调用此函数。
- **`parameters`**：一个值列表和格式，指定模型在响应中生成的内容。`parameters` 数组由项目组成：
  - `type`：属性将存储的数据类型（如 `string`、`integer`、`array`）
  - `properties`：模型将在响应中使用的具体值列表
    - `name`：属性的键名，例如 `product`
    - `type`：属性的数据类型，例如 `string`
    - `description`：对具体属性的描述，帮助 LLM 正确提取值
- **`required`**（可选）：函数调用完成所需的必需属性列表

### 第三步：发起函数调用

定义函数后，我们需要在调用 Chat Completion API 时将其包含在请求中。

```python
response = client.chat.completions.create(
    model=deployment,
    messages=messages,
    functions=functions,
    function_call="auto"
)

print(response.choices[0].message)
```

注意我们如何设置 `functions=functions` 和 `function_call="auto"`，从而让 LLM 自行决定何时调用我们提供的函数。

现在返回的响应如下所示：

```json
{
    "role": "assistant",
    "function_call": {
        "name": "search_courses",
        "arguments": "{\n  \"role\": \"student\",\n  \"product\": \"Azure\",\n  \"level\": \"beginner\"\n}"
    }
}
```

我们可以看到函数 `search_courses` 被调用，并且在 JSON 响应中的 `arguments` 属性中列出了调用的参数。

LLM 能够从提供给 `messages` 参数的值中提取数据以匹配函数的参数。回顾 `messages` 的值：

```python
messages = [{"role": "user", "content": "Find me a good course for a beginner student to learn Azure."}]
```

如你所见，`student`、`Azure` 和 `beginner` 是从 `messages` 中提取的，并作为函数的输入。以这种方式使用函数是从提示中提取信息的好方法，同时也为 LLM 提供结构化数据并实现可重用功能。

## 将函数调用集成到应用程序中

在测试了 LLM 的格式化响应后，我们现在可以将其集成到应用程序中。

### 管理流程

为了将其集成到我们的应用程序中，让我们采取以下步骤：

#### 保存响应消息

首先，调用 OpenAI 服务并将消息存储在一个变量中：

```python
response_message = response.choices[0].message
```

#### 定义实际函数

现在我们将定义一个函数，该函数将调用 Microsoft Learn API 以获取课程列表：

```python
import requests

def search_courses(role, product, level):
    """
    调用 Microsoft Learn Catalog API 搜索课程
    """
    url = "https://learn.microsoft.com/api/catalog/"
    params = {
        "role": role,
        "product": product,
        "level": level
    }
    response = requests.get(url, params=params)
    modules = response.json()["modules"]
    results = []
    for module in modules[:5]:
        title = module["title"]
        url = module["url"]
        results.append({"title": title, "url": url})
    return str(results)
```

注意我们现在创建了一个实际的 Python 函数，该函数映射到 `functions` 变量中引入的函数名称。我们还进行了真正的外部 API 调用以获取所需的数据。

#### 检查并执行函数调用

要查看是否需要调用 Python 函数，我们需要检查 LLM 响应中是否包含 `function_call`，并调用指定的函数：

```python
# 检查模型是否想要调用函数
if response_message.function_call.name:
    print("Recommended Function call:")
    print(response_message.function_call.name)
    print()

    # 调用函数
    function_name = response_message.function_call.name

    available_functions = {
        "search_courses": search_courses,
    }
    function_to_call = available_functions[function_name]

    function_args = json.loads(response_message.function_call.arguments)
    function_response = function_to_call(**function_args)

    print("Output of function call:")
    print(function_response)
    print(type(function_response))

    # 将助手响应和函数响应添加到消息中
    messages.append(
        {
            "role": response_message.role,
            "function_call": {
                "name": function_name,
                "arguments": response_message.function_call.arguments,
            },
            "content": None
        }
    )
    messages.append(
        {
            "role": "function",
            "name": function_name,
            "content": function_response,
        }
    )
```

以下三行代码确保我们提取函数名称、参数并进行调用：

```python
function_to_call = available_functions[function_name]
function_args = json.loads(response_message.function_call.arguments)
function_response = function_to_call(**function_args)
```

运行代码后的输出示例：

```
Recommended Function call:
search_courses

Output of function call:
[{'title': 'Describe concepts of cryptography', 'url': 'https://learn.microsoft.com/training/modules/describe-concepts-of-cryptography/?WT.mc_id=api_CatalogApi'}, {'title': 'Introduction to audio classification with TensorFlow', 'url': 'https://learn.microsoft.com/en-us/training/modules/intro-audio-classification-tensorflow/?WT.mc_id=api_CatalogApi'}, ...]
<class 'str'>
```

#### 生成自然语言回复

现在我们将更新后的消息发送给 LLM，以便我们可以接收到自然语言响应：

```python
print("Messages in next request:")
print(messages)
print()

second_response = client.chat.completions.create(
    messages=messages,
    model=deployment,
    function_call="auto",
    functions=functions,
    temperature=0
)

print(second_response.choices[0].message)
```

最终输出：

```
I found some good courses for beginner students to learn Azure:

1. [Describe concepts of cryptography] (https://learn.microsoft.com/training/modules/describe-concepts-of-cryptography/?WT.mc_id=api_CatalogApi)
2. [Introduction to audio classification with TensorFlow](https://learn.microsoft.com/training/modules/intro-audio-classification-tensorflow/?WT.mc_id=api_CatalogApi)
3. [Design a Performant Data Model in Azure SQL Database with Azure Data Studio](https://learn.microsoft.com/training/modules/design-a-data-model-with-ads/?WT.mc_id=api_CatalogApi)
4. [Getting started with the Microsoft Cloud Adoption Framework for Azure](https://learn.microsoft.com/training/modules/cloud-adoption-framework-getting-started/?WT.mc_id=api_CatalogApi)
5. [Set up the Rust development environment](https://learn.microsoft.com/training/modules/rust-set-up-environment/?WT.mc_id=api_CatalogApi)

You can click on the links to access the courses.
```

## 函数调用的典型应用场景

函数调用可以在许多不同的场景中改进你的应用程序：

### 调用外部工具

聊天机器人非常擅长回答用户的问题。通过使用函数调用，聊天机器人可以使用用户的消息完成某些任务。例如，学生可以要求聊天机器人"发送一封邮件给我的导师，说我需要更多关于这个主题的帮助"。这可以调用一个函数 `send_email(to: string, body: string)`。

### 创建 API 或数据库查询

用户可以使用自然语言查找信息，这些信息会被转换为格式化的查询或 API 请求。例如，老师可以请求"哪些学生完成了最后的作业"，这可以调用一个名为 `get_completed(student_name: string, assignment: int, current_status: string)` 的函数。

### 创建结构化数据

用户可以从文本块或 CSV 中提取重要信息。例如，学生可以将关于和平协议的维基百科文章转换为 AI 闪卡。这可以通过使用一个名为 `get_important_facts(agreement_name: string, date_signed: string, parties_involved: list)` 的函数来完成。

## 作业

为了继续学习 Azure OpenAI 函数调用，你可以尝试：

1. **为函数添加更多参数**，以帮助学习者找到更多课程。例如，添加语言偏好、学习时长等参数。

2. **创建另一个函数调用**，获取学习者的更多信息，例如他们的母语、地理位置等。

3. **创建错误处理机制**，当函数调用和/或 API 调用未返回任何合适的课程时提供友好的反馈。

提示：请参考 Learn API 参考文档页面，了解这些数据的获取方式和位置。

## 知识检查

**问题**：在使用 Azure OpenAI 函数调用时，关于 LLM 和函数执行的关系，以下哪项描述是正确的？

1. LLM 直接执行函数并返回执行结果给用户
2. LLM 生成结构化响应指导应用层执行函数，自身不直接调用任何函数
3. 函数必须预先在 Azure 门户中注册，LLM 通过 Azure 服务间接执行

**答案**：2

**解析**：

函数调用的核心设计原则是 LLM 不直接执行任何函数。LLM 的角色是根据用户消息和函数定义，生成结构化的响应（包含函数名称和参数），由应用层代码负责实际调用和执行。这种设计确保了安全性——AI 模型无法直接执行可能有害的操作。选项 1 错误地将执行权限赋予了 LLM，选项 3 描述了一种不存在的 Azure 注册机制。

## 扩展阅读

- [[学习/courses/microsoft/microsoft_genai_for_beginners]]
- [[智能体/GenAI_L06_Text_Generation_Apps]]
- [[智能体/GenAI_L07_Building_Chat_Applications]]
- [[智能体/Agentic_Design_Patterns_AndrewNg]]
- [[智能体/Agent_Frameworks/README]]

## 课程导航

| 上一课 | 下一课 |
|--------|--------|
| [[行业应用/GenAI_L10_Building_Low_Code_AI_Applications|L10 构建低代码AI应用]] | [[智能体/GenAI_L12_Designing_UX_for_AI_Applications|L12 为AI应用设计用户体验]] |
