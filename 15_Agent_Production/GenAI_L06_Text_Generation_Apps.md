---
title: "构建文本生成应用程序"
category: "course"
tags: ["microsoft-genai-course", "text-generation", "prompt-engineering", "openai-api", "temperature", "tokens"]
summary: "学习使用OpenAI库构建文本生成应用，掌握提示词、温度和令牌等核心概念，通过食谱生成器案例实现从简单提示到多轮交互的完整开发流程。"
created: "2026-06-12"
updated: "2026-06-12"
source_url: "https://raw.githubusercontent.com/microsoft/generative-ai-for-beginners/main/translations/zh-CN/06-text-generation-apps/README.md"
course: "Microsoft Generative AI for Beginners"
lesson_number: 6
---

## 学习目标

完成本课后，你将能够：

- 解释什么是文本生成应用程序，以及它与传统的命令行或图形界面应用程序的区别
- 使用 `openai` Python 库构建一个完整的文本生成应用程序
- 配置应用程序以使用更多或更少的令牌（tokens），并调整温度（temperature）参数以获得不同的输出效果
- 理解提示词（prompts）、完成（completions）等核心概念
- 将文本生成能力集成到实际应用场景中，如食谱生成器、学习助手等

## 本课前置知识

在开始本课之前，你应该已经了解：

- 基本的 Python 编程知识
- 提示词工程（Prompt Engineering）的基础概念
- 对大型语言模型（LLM）的基本理解
- 拥有 Azure 账户或 OpenAI API 密钥

## 什么是文本生成应用程序

通常，当你构建一个应用程序时，它会有某种界面，例如：

- **基于命令的界面**。控制台应用程序是典型的应用程序，你输入一个命令，它就会执行一个任务。例如，`git` 是一个基于命令的应用程序。
- **用户界面（UI）**。一些应用程序有图形用户界面（GUI），你可以点击按钮、输入文本、选择选项等。

### 控制台和用户界面应用程序的局限性

与基于命令的应用程序相比，它们有以下局限性：

- **有限性**。你不能随意输入任何命令，只能输入应用程序支持的命令。
- **语言特定性**。有些应用程序支持多种语言，但默认情况下，应用程序是为特定语言构建的，即使你可以添加更多语言支持。

### 文本生成应用程序的优势

在文本生成应用程序中，你有更多的灵活性，不受限于一组命令或特定的输入语言。相反，你可以使用自然语言与应用程序交互。另一个好处是，你已经在与一个经过大量信息训练的数据源交互，而传统应用程序可能仅限于数据库中的内容。

### 我可以用文本生成应用程序构建什么

你可以构建许多东西，例如：

- **聊天机器人**。一个回答关于公司及其产品问题的聊天机器人可能是一个不错的选择。
- **助手**。大型语言模型（LLM）在总结文本、从文本中获取见解、生成简历等方面表现出色。
- **代码助手**。根据你使用的语言模型，你可以构建一个帮助你编写代码的代码助手。例如，你可以使用 GitHub Copilot 或 ChatGPT 来帮助你编写代码。

## 如何开始使用 LLM

你需要找到一种与 LLM 集成的方法，通常包括以下两种方式：

- **使用 API**。通过构建网络请求发送提示词并获取生成的文本。
- **使用库**。库可以封装 API 调用，使其更易于使用。

### 常用的库和 SDK

以下是一些知名的用于处理 LLM 的库：

- **openai**，这个库使连接到模型并发送提示词变得容易。它是 OpenAI 官方提供的 Python 库，支持 Completion 和 ChatCompletion 等核心 API。

还有一些操作层次更高的库，例如：

- **LangChain**。LangChain 是一个知名库，支持 Python 和 JavaScript，提供了链式调用、记忆管理、工具集成等高级功能。
- **Semantic Kernel**。Semantic Kernel 是微软开发的库，支持 C#、Python 和 Java，提供了规划器、记忆、连接器等企业级功能。

## 使用 openai 构建第一个应用程序

让我们看看如何构建第一个应用程序，需要哪些库以及具体步骤。

### 安装 openai

有许多库可以与 OpenAI 或 Azure OpenAI 交互。可以使用多种编程语言，例如 C#、Python、JavaScript、Java 等。我们选择使用 `openai` Python 库，因此我们将使用 `pip` 来安装它。

```bash
pip install openai
```

### 创建资源

你需要完成以下步骤：

1. 在 Azure 上创建一个账户，访问 https://azure.microsoft.com/free/
2. 获取 Azure OpenAI 的访问权限，访问 https://learn.microsoft.com/azure/ai-services/openai/overview#how-do-i-get-access-to-azure-openai 并申请访问权限
3. 安装 Python，访问 https://www.python.org/
4. 创建一个 Azure OpenAI 服务资源。请参阅 Microsoft Learn 指南了解如何创建资源

> 注意：在撰写本文时，你需要申请访问 Azure OpenAI。

### 找到 API 密钥和端点

此时，你需要告诉 `openai` 库使用哪个 API 密钥。要找到你的 API 密钥，请转到 Azure OpenAI 资源的"密钥和端点"部分，并复制"密钥 1"的值。端点（Endpoint）也可以在同一页面找到。

现在你已经复制了这些信息，让我们告诉库如何使用它。

> 重要提示：将 API 密钥与代码分离是值得的。你可以通过使用环境变量来实现。
>
> - 设置环境变量 `OPENAI_API_KEY` 为你的 API 密钥。
>   `export OPENAI_API_KEY='sk-...'`

### 配置 Azure OpenAI 设置

如果你使用的是 Azure OpenAI，以下是设置配置的方法：

```python
import openai
import os

openai.api_type = 'azure'
openai.api_key = os.environ["OPENAI_API_KEY"]
openai.api_version = '2023-05-15'
openai.api_base = os.getenv("API_BASE")
```

以上我们设置了以下内容：

- `api_type` 为 `azure`。这告诉库使用 Azure OpenAI 而不是 OpenAI。
- `api_key`，这是你在 Azure 门户中找到的 API 密钥。
- `api_version`，这是你想使用的 API 版本。在撰写本文时，最新版本是 `2023-05-15`。
- `api_base`，这是 API 的端点。你可以在 Azure 门户中找到它，就在你的 API 密钥旁边。

> `os.getenv` 是一个读取环境变量的函数。你可以使用它读取像 `OPENAI_API_KEY` 和 `API_BASE` 这样的环境变量。在终端中设置这些环境变量，或者使用像 `dotenv` 这样的库从 `.env` 文件中加载。

## 生成文本：Completion API

生成文本的方法是使用 `Completion` 类。以下是一个示例：

```python
prompt = "Complete the following: Once upon a time there was a"

completion = openai.Completion.create(model="davinci-002", prompt=prompt)
print(completion.choices[0].text)
```

在上述代码中，我们创建了一个完成对象，并传入我们想使用的模型和提示词。然后我们打印生成的文本。`Completion` API 适用于纯文本补全任务，例如续写故事、完成句子等。

### 聊天完成：ChatCompletion API

到目前为止，你已经看到我们如何使用 `Completion` 来生成文本。但还有另一个类叫 `ChatCompletion`，它更适合聊天机器人。以下是一个使用它的示例：

```python
import openai

openai.api_key = "sk-..."

completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Hello world"}]
)
print(completion.choices[0].message.content)
```

`ChatCompletion` 与 `Completion` 的关键区别在于：

- **消息格式**：使用 `messages` 数组而非单个 `prompt` 字符串，每条消息有 `role`（角色）和 `content`（内容）
- **角色区分**：支持 `system`（系统指令）、`assistant`（AI 回复）和 `user`（用户消息）三种角色
- **对话上下文**：可以维护多轮对话的上下文，让模型理解完整的对话历史

更多关于此功能的内容将在后续章节中介绍。

## 练习 - 构建你的第一个文本生成应用程序

现在我们已经学习了如何设置和配置 openai，是时候构建你的第一个文本生成应用程序了。按照以下步骤构建你的应用程序：

### 第一步：创建虚拟环境并安装依赖

```bash
python -m venv venv
source venv/bin/activate
pip install openai
```

> 如果你使用的是 Windows，请输入 `venv\Scripts\activate` 而不是 `source venv/bin/activate`。

> 通过访问 https://portal.azure.com/ 找到你的 Azure OpenAI 密钥，搜索 `Open AI` 并选择 `Open AI 资源`，然后选择 `密钥和端点` 并复制 `密钥 1` 的值。

### 第二步：创建应用程序文件

创建一个 `app.py` 文件，并添加以下代码：

```python
import openai

openai.api_key = "<replace this value with your open ai key or Azure OpenAI key>"

openai.api_type = 'azure'
openai.api_version = '2023-05-15'
openai.api_base = "<endpoint found in Azure Portal where your API key is>"
deployment_name = "<deployment name>"

# 添加你的完成代码
prompt = "Complete the following: Once upon a time there was a"
messages = [{"role": "user", "content": prompt}]

# 生成完成
completion = openai.chat.completions.create(model=deployment_name, messages=messages)

# 打印响应
print(completion.choices[0].message.content)
```

> 如果你使用的是 Azure OpenAI，你需要将 `api_type` 设置为 `azure`，并将 `api_key` 设置为你的 Azure OpenAI 密钥。

你应该会看到如下输出：

```
very unhappy _____.

Once upon a time there was a very unhappy mermaid.
```

## 不同类型的提示词，用于不同的任务

现在你已经了解了如何使用提示词生成文本。你甚至已经有一个可以修改和更改的程序来生成不同类型的文本。

提示词可以用于各种任务。例如：

- **生成某种类型的文本**。例如，你可以生成一首诗、测验问题等。
- **查找信息**。你可以使用提示词查找信息，例如"在 Web 开发中，CORS 是什么意思？"。
- **生成代码**。你可以使用提示词生成代码，例如开发用于验证电子邮件的正则表达式，或者生成整个程序，比如一个 Web 应用程序。

## 一个更实用的案例：食谱生成器

想象一下，你家里有一些食材，你想做点什么。为此，你需要一个食谱。找到食谱的一种方法是使用搜索引擎，或者你可以使用 LLM 来完成。

### 基本提示词

你可以写一个这样的提示词：

> "给我展示 5 个使用以下食材的菜肴的食谱：鸡肉、土豆和胡萝卜。每个食谱列出所有使用的食材。"

根据上述提示词，你可能会得到类似以下的回复：

```
1. 烤鸡和蔬菜：
食材：
- 4 个鸡腿
- 2 个土豆，切块
- 2 根胡萝卜，切块
- 2 汤匙橄榄油
- 2 瓣大蒜，切碎
- 1 茶匙干百里香
- 1 茶匙干牛至
- 盐和胡椒，适量

2. 鸡肉土豆炖菜：
食材：
- 2 汤匙橄榄油
- 1 个洋葱，切丁
- 2 瓣大蒜，切碎
- 2 块鸡胸肉，切块
- 2 个土豆，切块
- 2 根胡萝卜，切块
- 1 茶匙干牛至
- 1 茶匙干百里香
- 1 杯鸡汤
- 盐和胡椒，适量
```

### 添加过滤和购物清单

这个结果很棒，我知道该做什么菜了。此时，可能有一些有用的改进：

- 过滤掉我不喜欢或过敏的食材
- 生成一个购物清单，以防我家里没有所有的食材

对于上述情况，让我们添加一个额外的提示词：

> "请移除含有大蒜的食谱，因为我对大蒜过敏，并用其他东西替代。同时，请根据我家里已有的鸡肉、土豆和胡萝卜，为食谱生成一个购物清单。"

现在你会得到一个新的结果：五个不含大蒜的食谱，以及一个考虑了家里已有食材的购物清单：

```
购物清单：
- 橄榄油
- 洋葱
- 百里香
- 牛至
- 盐
- 胡椒
```

## 练习 - 构建一个食谱生成器

现在我们已经演示了一个场景，让我们编写代码来匹配演示的场景。按照以下步骤操作：

### 基础版本

1. 使用现有的 `app.py` 文件作为起点。
2. 找到 `prompt` 变量，并将其代码更改为以下内容：

```python
prompt = "Show me 5 recipes for a dish with the following ingredients: chicken, potatoes, and carrots. Per recipe, list all the ingredients used"
```

如果你现在运行代码，你应该会看到类似以下的输出（注意 LLM 是非确定性的，每次运行结果可能不同）：

```
-Chicken Stew with Potatoes and Carrots: 3 tablespoons oil, 1 onion, chopped, 2 cloves garlic, minced...
-Oven-Roasted Chicken with Potatoes and Carrots: 3 tablespoons extra-virgin olive oil...
-Chicken, Potato, and Carrot Casserole: cooking spray, 1 large onion, chopped...
```

### 使应用程序更灵活

让我们以以下方式更改代码，使食谱数量和食材可以根据用户输入动态变化：

```python
no_recipes = input("No of recipes (for example, 5): ")
ingredients = input("List of ingredients (for example, chicken, potatoes, and carrots): ")

# 将食谱数量和食材插入提示词
prompt = f"Show me {no_recipes} recipes for a dish with the following ingredients: {ingredients}. Per recipe, list all the ingredients used"
```

测试运行代码可能会如下所示：

```
No of recipes (for example, 5): 3
List of ingredients (for example, chicken, potatoes, and carrots): milk,strawberries

-Strawberry milk shake: milk, strawberries, sugar, vanilla extract, ice cubes
-Strawberry shortcake: milk, flour, baking powder, sugar, salt, unsalted butter, strawberries, whipped cream
-Strawberry milk: milk, strawberries, sugar, vanilla extract
```

### 添加过滤器功能

为了进一步改进，我们希望添加过滤掉不想要食材的功能：

```python
filter = input("Filter (for example, vegetarian, vegan, or gluten-free): ")

prompt = f"Show me {no_recipes} recipes for a dish with the following ingredients: {ingredients}. Per recipe, list all the ingredients used, no {filter}"
```

上述代码中，我们在提示词末尾添加了 `{filter}`，同时我们也从用户那里获取过滤值。

### 添加购物清单功能

对于购物清单功能，我们可以将其分成两个提示词。这里建议添加一个额外的提示词，但为使其工作，我们需要将前一个提示词的结果作为上下文添加到后一个提示词中。

找到代码中打印第一个提示词结果的部分，并在其下方添加以下代码：

```python
old_prompt_result = completion.choices[0].message.content
prompt = "Produce a shopping list for the generated recipes and please don't include ingredients that I already have."

new_prompt = f"{old_prompt_result} {prompt}"
messages = [{"role": "user", "content": new_prompt}]
completion = openai.ChatCompletion.create(engine=deployment_name, messages=messages, max_tokens=1200)

# 打印响应
print("Shopping list:")
print(completion.choices[0].message.content)
```

请注意以下几点：

1. 我们通过将第一个提示的结果添加到新的提示中来构建一个新的提示：

```python
new_prompt = f"{old_prompt_result} {prompt}"
```

2. 我们发出一个新的请求，同时考虑到我们在第一个提示中请求的令牌数量，因此这次我们将 `max_tokens` 设置为 1200。

```python
completion = openai.ChatCompletion.create(engine=deployment_name, messages=[{"role": "user", "content": new_prompt}], max_tokens=1200)
```

运行这段代码后，我们得到了如下输出：

```
No of recipes (for example, 5): 2
List of ingredients (for example, chicken, potatoes, and carrots): apple,flour
Filter (for example, vegetarian, vegan, or gluten-free): sugar

-Apple and flour pancakes: 1 cup flour, 1/2 tsp baking powder...
-Apple fritters: 1-1/2 cups flour, 1 tsp baking powder...
Shopping list:
-Flour, baking powder, baking soda, salt, sugar, egg, buttermilk, butter, apple, nutmeg, cinnamon, allspice
```

## 改进你的设置

目前我们有一个可以运行的代码，但还有一些调整可以进一步优化。我们应该做的一些事情包括：

### 将敏感信息与代码分离

敏感信息如 API 密钥不应该直接写在代码中，而应该存储在安全的位置。为了将敏感信息与代码分离，我们可以使用环境变量和 `python-dotenv` 库从文件中加载它们。

1. 创建一个 `.env` 文件，内容如下：

```bash
OPENAI_API_KEY=sk-...
```

对于 Azure，你需要设置以下环境变量：

```bash
OPENAI_API_TYPE=azure
OPENAI_API_VERSION=2023-05-15
OPENAI_API_BASE=<replace>
```

2. 在代码中加载环境变量：

```python
from dotenv import load_dotenv
import os

load_dotenv()
openai.api_key = os.environ["OPENAI_API_KEY"]
```

### 关于令牌长度的建议

我们应该考虑生成所需文本需要多少令牌。令牌是有成本的，因此我们应该尽量减少使用的令牌数量。例如，我们是否可以通过调整提示的措辞来减少令牌的使用？

要更改使用的令牌数量，可以使用 `max_tokens` 参数。例如，如果你想使用 100 个令牌，可以这样设置：

```python
completion = client.chat.completions.create(model=deployment, messages=messages, max_tokens=100)
```

令牌（Token）是 LLM 处理文本的基本单位。一个令牌大约对应 4 个英文字符或 0.75 个英文单词。对于中文，一个汉字通常对应 1-2 个令牌。`max_tokens` 参数控制模型生成的最大令牌数量，设置较小的值可以限制输出长度并降低成本，但可能导致输出被截断。

### 尝试调整温度

温度是我们尚未提到但对程序表现非常重要的一个参数。温度值越高，输出越随机；温度值越低，输出越可预测。考虑你是否希望输出具有变化。

要调整温度，可以使用 `temperature` 参数。例如，如果你想使用 0.5 的温度，可以这样设置：

```python
completion = client.chat.completions.create(model=deployment, messages=messages, temperature=0.5)
```

> 注意，温度越接近 1.0，输出越多样化；温度越接近 0，输出越确定和一致。

温度参数的典型使用场景：

| 温度值 | 适用场景 | 效果 |
|--------|---------|------|
| 0.0 | 代码生成、数据提取、事实性回答 | 输出确定性最高，每次结果几乎相同 |
| 0.3-0.5 | 技术写作、翻译、摘要 | 适度变化，保持准确性 |
| 0.7 | 通用对话、邮件撰写 | 平衡创造性和一致性（默认值） |
| 1.0 | 创意写作、头脑风暴、诗歌 | 输出多样性最高，每次结果差异大 |

## 作业

对于这个任务，你可以选择自己想要构建的内容。以下是一些建议：

- 调整食谱生成器应用以进一步优化。尝试不同的温度值和提示，看看能得到什么结果。
- 构建一个"学习助手"。这个应用应该能够回答关于某个主题的问题，例如 Python，你可以使用提示如"Python 中某个主题是什么？"或者"给我展示某个主题的代码"等。
- 历史机器人，让历史变得生动起来，指示机器人扮演某个历史人物，并向它询问关于其生活和时代的问题。

### 参考解决方案

**学习助手** 的初始提示：

```
- "You're an expert on the Python language

    Suggest a beginner lesson for Python in the following format:

    Format:
    - concepts:
    - brief explanation of the lesson:
    - exercise in code with solutions"
```

**历史机器人** 的提示示例：

```
- "You are Abe Lincoln, tell me about yourself in 3 sentences, and respond using grammar and words like Abe would have used"
- "You are Abe Lincoln, respond using grammar and words like Abe would have used:

   Tell me about your greatest accomplishments, in 300 words"
```

## 知识检查

**温度这个概念的作用是什么？**

1. 它控制输出的随机性。
2. 它控制响应的大小。
3. 它控制使用的令牌数量。

正确答案是 **1**。温度控制输出的随机性。值越高，输出越随机和多样化；值越低，输出越可预测和一致。

## 挑战

在完成任务时，尝试改变温度值，尝试设置为 0、0.5 和 1。记住，0 是最不变化的，1 是变化最大的。哪个值最适合你的应用？

思考以下问题：
- 对于食谱生成器，什么温度值最合适？
- 对于学习助手，什么温度值最合适？
- 对于历史机器人，什么温度值最合适？

## 扩展阅读

- [[90_Learn/courses/microsoft/microsoft_genai_for_beginners]]
- [[15_Agent_Production/GenAI_L07_Building_Chat_Applications]]
- [[15_Agent_Production/GenAI_L11_Integrating_with_Function_Calling]]
- [[15_Agent_Production/Agentic_Design_Patterns_AndrewNg]]
- [[05_NLP_LLMs/Multimodal_Models/Multimodal_Models_for_dummy]]

## 课程导航

| 上一课 | 下一课 |
|--------|--------|
| [[05_NLP_LLMs/Prompt_Engineering/GenAI_L05_Advanced_Prompts|L05 高级提示技术]] | [[15_Agent_Production/GenAI_L07_Building_Chat_Applications|L07 构建聊天应用]] |
