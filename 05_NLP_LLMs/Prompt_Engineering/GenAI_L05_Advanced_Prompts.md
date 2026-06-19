---
title: "高级提示技术"
category: "course"
tags: ["microsoft-genai-course", "prompt-engineering", "advanced-prompting", "chain-of-thought", "self-refine", "temperature"]
summary: "深入讲解七种高级提示技术：零样本、少样本、思维链、生成知识、从少到多、自我优化、助产式提示，以及温度参数对输出确定性的控制，含完整代码示例。"
created: "2026-06-12"
updated: "2026-06-12"
source_url: "https://raw.githubusercontent.com/microsoft/generative-ai-for-beginners/main/translations/zh-CN/05-advanced-prompts/README.md"
course: "Microsoft Generative AI for Beginners"
lesson_number: 5
---

## 学习目标

完成本课后，你将能够：

- 应用提示工程技术以改善提示的结果
- 执行多样化或确定性的提示
- 理解和运用七种核心高级提示技术
- 使用温度参数控制输出的确定性
- 将提示技术组合应用于实际问题

## 本课前置知识

- 已完成第 4 课（L04：提示工程基础）
- 了解分词、基础模型与指令调优模型的区别
- 了解提示构建的基本模式（指令、主要内容、次要内容）
- 有使用 OpenAI 或 Azure OpenAI API 的基本经验

## 提示工程回顾

让我们回顾一下上一章的学习内容：

> 提示工程是通过提供更有用的指令或上下文来**引导模型生成更相关的响应**的过程。

编写提示有两个步骤：
1. **构建提示**：通过提供相关的上下文
2. **优化提示**：逐步改进提示

到目前为止，我们已经对如何编写提示有了一些基本的了解，但我们需要更深入地学习。在本章中，你将从尝试各种提示到理解为什么一个提示比另一个提示更好。

## 提示技术概述

提示工程不仅仅是编写一个文本提示，它更像是一组技术，你可以应用这些技术来获得所需的结果。

### 一个基本提示的分析

让我们来看一个基本的提示示例：

> 生成 10 个关于地理的问题。

在这个提示中，你实际上应用了一组不同的提示技术：

- **上下文**：你指定了它应该是关于"地理"的
- **限制输出**：你希望不超过 10 个问题

### 简单提示的局限性

你可能会或可能不会得到所需的结果。你会得到生成的问题，但地理是一个很大的主题，你可能无法得到你想要的结果，原因如下：

- **主题广泛**：你不知道它会是关于国家、首都、河流等
- **格式**：如果你希望问题以某种特定格式呈现怎么办？

正如你所看到的，创建提示时需要考虑很多因素。接下来让我们探索一些基本技术。

## 技术一：零样本提示（Zero-shot Prompting）

### 定义

零样本提示是最基本的提示形式。它是一个单一的提示，仅基于 LLM 的训练数据请求响应，不提供任何示例。

### 示例

**提示**：什么是代数？

**回答**：代数是数学的一个分支，研究数学符号及其操作规则。

### 特点

- 最简单的提示方式
- 完全依赖模型的预训练知识
- 适合简单、通用的查询
- 对于复杂或特定领域的任务可能不够准确

### 适用场景

- 事实性问答
- 简单的定义解释
- 通用知识的查询

## 技术二：少样本提示（Few-shot Prompting）

### 定义

少样本提示通过提供一些示例来帮助模型完成请求。它由一个单一的提示和额外的任务特定数据组成。

### 示例

**提示**：

```
用莎士比亚的风格写一首诗。以下是一些莎士比亚十四行诗的示例：

十四行诗 18："我是否应将你比作夏日？你更可爱更温和……"
十四行诗 116："我不承认真心结合的婚姻有障碍。爱不是爱，当它发现变化时会改变……"
十四行诗 132："我爱你的眼睛，它们怜悯我，知道你的心折磨我，带着轻蔑……"

现在，写一首关于月亮美丽的十四行诗。
```

**回答**：

```
在天空中，月亮柔和地闪耀，
银色的光芒投射出温柔的优雅……
```

### 特点

- 示例为 LLM 提供了所需输出的上下文、格式或风格
- 帮助模型理解具体任务并生成更准确和相关的响应
- 示例数量越多，模型理解越准确

### 示例数量对比

| 类型 | 示例数量 | 效果 |
|------|----------|------|
| 零样本 | 0 | 完全依赖指令和模型能力 |
| 一次样本 | 1 | 提供基本格式参考 |
| 多样本 | 3-5+ | 提供丰富的模式参考，输出最准确 |

## 技术三：思维链（Chain of Thought）

### 定义

思维链是一种非常有趣的技术，它通过一系列步骤引导 LLM，以让 LLM 理解如何完成任务的方式进行指令。

### 没有思维链的问题

**提示**：爱丽丝有 5 个苹果，扔掉了 3 个苹果，给了鲍勃 2 个苹果，鲍勃又还了一个，爱丽丝还有多少个苹果？

**LLM 回答**：5

这个答案是错误的。正确答案是 1 个苹果：(5 - 3 - 2 + 1 = 1)。

### 应用思维链的方法

1. 给 LLM 一个类似的示例
2. 显示计算过程，以及如何正确计算
3. 提供原始提示

### 思维链的具体操作

**提示**：

```
丽莎有 7 个苹果，扔掉了 1 个苹果，给了巴特 4 个苹果，巴特又还了一个：
  7 - 1 = 6
  6 - 4 = 2
  2 + 1 = 3

爱丽丝有 5 个苹果，扔掉了 3 个苹果，给了鲍勃 2 个苹果，鲍勃又还了一个，
爱丽丝还有多少个苹果？
```

**回答**：1

### 解析

注意我们如何通过另一个示例、计算过程以及原始提示来编写更长的提示，最终得到了正确答案 1。

思维链的关键在于：
- **展示推理过程**：不只是给出答案，而是展示如何一步步推导
- **提供类似示例**：让模型学习推理模式
- **分解复杂问题**：将多步骤问题拆解为可管理的子步骤

### 适用场景

- 数学计算和逻辑推理
- 多步骤问题解决
- 需要推理过程的任务
- 复杂决策问题

## 技术四：生成知识（Generated Knowledge）

### 定义

为了改善提示的响应，你可以在提示中额外提供生成的事实或知识。这特别适用于你需要将公司特定数据纳入提示的场景。

### 模板化方法

如果你从事保险业务，你的提示可能如下所示：

```text
{{company}}: {{company_name}}
{{products}}:
{{products_list}}
Please suggest an insurance given the following budget and requirements:
Budget: {{budget}}
Requirements: {{requirements}}
```

上面可以看到提示是如何使用模板构建的。在模板中，有一些变量，用 `{{variable}}` 表示，这些变量将被公司 API 的实际值替换。

### 替换变量后的提示示例

```text
Insurance company: ACME Insurance
Insurance products (cost per month):
- Car, cheap, 500 USD
- Car, expensive, 1100 USD
- Home, cheap, 600 USD
- Home, expensive, 1200 USD
- Life, cheap, 100 USD

Please suggest an insurance given the following budget and requirements:
Budget: $1000
Requirements: Car, Home, and Life insurance
```

### 初次响应

```output
Given the budget and requirements, we suggest the following insurance package from ACME Insurance:
- Car, cheap, 500 USD
- Home, cheap, 600 USD
- Life, cheap, 100 USD
Total cost: $1,200 USD
```

如你所见，它还建议了人寿保险，总费用超出了预算。这表明我们需要通过更清晰地表达提示来优化它。

### 优化后的提示

```text
Insurance company: ACME Insurance
Insurance products (cost per month):
- type: Car, cheap, cost: 500 USD
- type: Car, expensive, cost: 1100 USD
- type: Home, cheap, cost: 600 USD
- type: Home, expensive, cost: 1200 USD
- type: Life, cheap, cost: 100 USD

Please suggest an insurance given the following budget and requirements:
Budget: $1000 restrict choice to types: Car, Home
```

注意添加了 `type` 和 `cost` 标签，并使用了关键字 `restrict`，这有助于 LLM 理解我们的需求。

### 优化后的响应

```output
Given the budget and requirements, we suggest the Car, Cheap insurance product which costs 500 USD per month.
```

### 关键启示

这个示例的重点是展示即使我们使用了像生成知识这样的基本技术，在大多数情况下我们仍然需要**优化提示**以获得所需的结果。提示工程本质上是一个迭代过程。

## 技术五：从少到多（Least to Most）

### 定义

从少到多提示的理念是将一个较大的问题分解为子问题。这样，你可以帮助指导 LLM 如何"攻克"更大的问题。

### 示例

**提示**：如何用 5 个步骤进行数据科学？

**AI 助手回答**：

```
1. 收集数据 — 从各种来源获取原始数据
2. 清理数据 — 处理缺失值、异常值和格式问题
3. 分析数据 — 探索性数据分析，发现模式和趋势
4. 绘制数据 — 可视化分析结果，便于理解
5. 展示数据 — 向利益相关者传达发现和见解
```

### 特点

- 将复杂任务分解为可管理的步骤
- 每个步骤相对简单，模型更容易正确完成
- 步骤之间有逻辑顺序
- 类似于思维链，但更侧重于任务分解而非推理过程

### 适用场景

- 项目规划和管理
- 复杂流程的指导
- 教程和教学内容创建
- 多阶段任务执行

## 技术六：自我优化（Self-Refine）

### 定义

对于生成式 AI 和 LLM，你不能完全信任其输出。自我优化技术是要求 LLM 批评自己并改进输出的方法。

### 工作流程

1. **初始提示**：要求 LLM 解决问题
2. **初始回答**：LLM 给出第一版答案
3. **批评**：你对答案进行批评并要求 AI 改进
4. **改进回答**：LLM 再次回答，考虑了批评并提出了改进建议

你可以根据需要多次重复此过程。

### 完整示例

**第一轮：初始提示**

> 提示："创建一个带有产品和客户路由的 Python Web API"

**AI 初始回答**：

```python
import flask
app = Flask(__name__)

@app.route('/products')
def products():
    return 'Products'

@app.route('/customers')
def customers():
    return 'Customers'
```

**第二轮：要求改进**

> 提示：建议上述代码的 3 个改进

**AI 改进建议**：

```
以下是三个改进建议：

1. 修正导入语句：第一行应该导入 Flask 而不是 flask。
   正确的导入语句应该是 from flask import Flask。

2. 添加主函数：在文件末尾添加 if __name__ == '__main__': 块，
   以便在执行文件时运行应用。

3. 使用 f-strings：在路由函数中使用 f-strings 格式化返回语句。
   例如，将 return 'Products' 改为 return f'This is the {request.path} page'。
```

**改进后的代码**：

```python
from flask import Flask, request

app = Flask(__name__)

@app.route('/products')
def products():
    return f'This is the {request.path} page'

@app.route('/customers')
def customers():
    return f'This is the {request.path} page'

if __name__ == '__main__':
    app.run()
```

### 自我优化的关键要点

- 你可以指定改进的方向（如架构、性能、安全性）
- 限制改进的数量有助于获得更聚焦的建议
- 可以多轮迭代，逐步完善
- 最终结果通常比初始回答质量高得多

## 技术七：助产式提示（Maieutic Prompting）

### 定义

助产式提示是一种类似于自我优化的技术，但它更多是关于要求 LLM **解释自己**。其目标是减少 LLM 输出中的不一致性，确保其得出正确答案。

### 工作流程

1. 要求 LLM 回答一个问题
2. 对答案的每个部分要求 LLM 进行更深入的解释
3. 如果有不一致的地方，舍弃不一致的部分
4. 重复步骤 2 和 3，直到你对答案满意

### 完整示例

**第一轮：初始问题**

> 提示：如何通过 5 个步骤创建一个危机计划以应对疫情？

**LLM 回答**：

```
1. 识别风险（Identify the risks）
2. 识别利益相关者（Identify the stakeholders）
3. 识别资源（Identify the resources）
4. 识别行动（Identify the actions）
5. 识别沟通渠道（Identify the communication channels）
```

**第二轮：深入解释第一步**

> 提示：详细解释第一步，疫情的详细风险是什么？

**LLM 回答**：

```
风险包括以下方面：
- 生命损失（Loss of life）
- 业务损失（Loss of business）
- 声誉损失（Loss of reputation）
- 客户流失（Loss of customers）
- 员工流失（Loss of employees）
```

**第三轮：验证一致性**

> 提示：在疫情中，最大的风险是什么，为什么？

**LLM 回答**：

```
最大的风险是生命损失，因为这是最重要的需要保护的东西。
```

**第四轮：进一步验证**

> 提示：疫情中最大的两个风险是什么？

**LLM 回答**：

```
最大的两个风险是生命损失和业务损失。
```

### 一致性验证

此时，LLM 是一致的——它提到了"生命"和"业务"是两个最大的风险，这与之前的解释一致。我们现在可以继续下一步，并感到相当有信心。

### 重要提醒

我们不应该盲目信任 LLM，应该始终验证其输出。助产式提示的价值在于通过多轮追问来揭示和修正不一致之处。

## 改变输出：温度参数

### LLM 的非确定性

LLM 本质上是非确定性的，这意味着每次运行相同的提示时，你都会得到不同的结果。

**实验演示**：

第一次运行提示"生成一个 Python Web API 的代码"：

```python
import flask
from flask import request, jsonify

app = flask.Flask(__name__)

@app.route('/api', methods=['GET'])
def api():
    data = request.args
    result = process_data(data)
    return jsonify(result)

def process_data(data):
    result = data + 1
    return result

if __name__ == '__main__':
    app.run()
```

第二次运行同样的提示：

```python
import flask
from flask import request, jsonify

app = flask.Flask(__name__)
app.config["DEBUG"] = True

books = [
    {'id': 0, 'title': 'A Fire Upon the Deep', 'author': 'Vernor Vinge',
     'first_sentence': 'The coldsleep itself was dreamless.', 'year_published': '1992'},
    {'id': 1, 'title': 'The Ones Who Walk Away From Omelas', 'author': 'Ursula K. Le Guin',
     'first_sentence': 'With a clamor of bells...', 'published': '1973'},
    {'id': 2, 'title': 'Dhalgren', 'author': 'Samuel R. Delany',
     'first_sentence': 'to wound the autumnal city.', 'published': '1975'}
]

@app.route('/', methods=['GET'])
def home():
    return '''<h1>Books API</h1><p>A prototype API for retrieving books.</p>'''

@app.route('/api/v1/resources/books/all', methods=['GET'])
def api_all():
    return jsonify(books)

app.run()
```

如你所见，两次运行产生了完全不同的代码——一次是通用 API，一次是图书管理 API。

### 输出的变化是问题吗？

这取决于你想要实现的目标：

- **需要特定响应**：这就是一个问题，你需要使用温度参数来控制
- **接受变化输出**：如"生成关于地理的任意 3 个问题"，这就不是问题

### 温度参数详解

温度是一个介于 0 和 1 之间的值：

| 温度值 | 行为 | 适用场景 |
|--------|------|----------|
| 0.0 | 最确定，几乎总是选择最高概率的 token | 代码生成、事实问答、数据提取 |
| 0.1 | 非常确定，输出高度一致 | 需要稳定输出的场景 |
| 0.7（默认） | 适中的随机性 | 通用对话、文本生成 |
| 0.9 | 较高随机性 | 创意写作、头脑风暴 |
| 1.0 | 最高随机性 | 最大创造性的场景 |

### 低温度示例（0.1）

第一次运行：

```python
import flask
from flask import request, jsonify

app = flask.Flask(__name__)

@app.route('/api/v1/endpoint', methods=['GET'])
def api_endpoint():
    data = request.get_json()
    result = process_data(data)
    return jsonify(result)

def process_data(data):
    result = {'result': 'success'}
    return result

if __name__ == '__main__':
    app.run()
```

第二次运行（温度 0.1）：

```python
import flask
from flask import request, jsonify

app = flask.Flask(__name__)

@app.route('/api', methods=['GET'])
def api_call():
    data = request.get_json()
    result = process_data(data)
    return jsonify(result)

def process_data(data):
    result = data + 1
    return result

if __name__ == '__main__':
    app.run()
```

这两个输出之间只有很小的差异——结构基本相同，只是函数名和细节略有不同。

### 高温度示例（0.9）

第一次运行（温度 0.9）：

```python
import flask
from flask import request, jsonify

app = flask.Flask(__name__)

@app.route('/api', methods=['GET'])
def api_call():
    data = request.args
    result = process_data(data)
    return jsonify(result)

def process_data(data):
    result = data + 1
    return result

if __name__ == '__main__':
    app.run()
```

第二次运行（温度 0.9）：

```python
import flask
from flask import request, jsonify

app = flask.Flask(__name__)
app.config['DEBUG'] = True

books = [
    {'id': 0, 'title': 'A Fire Upon The Deep', ...},
    {'id': 1, 'title': 'The Ones Who Walk Away From Omelas', ...},
    {'id': 2, 'title': 'Dhalgren', ...}
]

@app.route('/', methods=['GET'])
def home():
    return '''<h1>Welcome to our book API!</h1>'''

@app.route('/api/v1/resources/books
```

高温度下，输出差异显著——甚至生成了完全不同的应用概念。

### 其他输出控制参数

除了温度，还有更多参数可以调整以改变输出：

| 参数 | 作用 | 说明 |
|------|------|------|
| top_k | 限制候选 token 数量 | 只从前 k 个最可能的 token 中选择 |
| top_p | 核采样 | 从累积概率达到 p 的最小 token 集合中选择 |
| 重复惩罚 | 减少重复内容 | 惩罚已经出现过的 token |
| 长度惩罚 | 控制输出长度 | 奖励或惩罚较长的输出 |
| 多样性惩罚 | 增加多样性 | 惩罚高频 token，鼓励使用低频 token |

## 良好实践总结

除了我们已经讨论过的技术之外，还有一些在提示 LLM 时需要考虑的良好实践：

### 五大核心实践

1. **指定上下文**：上下文很重要，越能具体说明领域、主题等，效果越好

2. **限制输出**：如果你需要特定数量的项目或特定长度，请明确说明
   ```
   请列出 5 个关键要点，每个要点不超过 20 个字。
   ```

3. **明确说明内容和方式**：记得同时说明你想要什么以及如何实现
   ```
   创建一个包含产品和客户路由的 Python Web API，并将其分为三个文件。
   ```

4. **使用模板**：通常你会希望用公司数据来丰富你的提示。可以使用模板来实现这一点
   ```python
   template = """
   公司：{{company_name}}
   产品列表：{{products}}
   请根据以下预算和要求推荐产品：
   预算：{{budget}}
   要求：{{requirements}}
   """
   ```

5. **拼写正确**：虽然 LLM 可能会提供正确的响应，但如果拼写正确，你会得到更好的响应

## 作业

### 任务描述

以下是使用 Flask 构建简单 API 的 Python 代码：

```python
from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def hello():
    name = request.args.get('name', 'World')
    return f'Hello, {name}!'

if __name__ == '__main__':
    app.run()
```

### 要求

使用像 GitHub Copilot 或 ChatGPT 这样的 AI 助手，并应用**自我优化**技术来改进代码。

### 提示

- 提出一个提示来要求改进，限制改进的数量是个好主意
- 你也可以要求以某种方式改进，例如架构、性能、安全性等

### 可能的改进方向

1. **安全性**：添加输入验证和清理
2. **错误处理**：添加适当的异常处理
3. **可扩展性**：使用蓝图（Blueprints）组织路由
4. **文档**：添加 API 文档和类型注解
5. **测试**：建议添加单元测试

## 知识检查

**问题**：为什么要使用链式思维提示？

1. 教 LLM 如何解决问题
2. 教 LLM 找出代码中的错误
3. 指示 LLM 提出不同的解决方案

**答案**：1

**解析**：

链式思维提示的核心目的是通过提供一系列步骤以及类似问题及其解决方法，向 LLM 展示如何解决问题。它不是用于找代码错误（选项 2），也不是用于提出不同解决方案（选项 3）。链式思维的关键价值在于"展示推理过程"，让模型学会如何一步步地思考和解决问题。

## 挑战

选择你构建的任何程序，考虑你想对其进行哪些改进。现在使用自我优化技术来应用这些建议的更改。你认为结果如何，是更好还是更差？

## 扩展阅读

- [[90_Learn/courses/microsoft/microsoft_genai_for_beginners]] — 课程总览与章节映射
- [[04_NLP_LLMs/Prompt_Engineering/GenAI_L04_Prompt_Engineering_Fundamentals]] — 第 4 课：提示工程基础
- [[04_NLP_LLMs/Prompt_Engineering/Prompt_Engineering]] — 提示工程深度指南
- [[04_NLP_LLMs/god-tier-prompts_overview]] — 高级提示模式概览

## 课程导航

| 上一课 | 下一课 |
|--------|--------|
| [[04_NLP_LLMs/Prompt_Engineering/GenAI_L04_Prompt_Engineering_Fundamentals|L04 提示工程基础]] | [[13_Agent_Production/GenAI_L06_Text_Generation_Apps|L06 构建文本生成应用]] |
