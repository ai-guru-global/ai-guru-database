---
title: "构建图像生成应用程序"
category: "course"
tags: ["microsoft-genai-course", "image-generation", "dall-e", "multimodal", "meta-prompt", "temperature"]
summary: "学习使用DALL-E和Midjourney构建图像生成应用，掌握元提示、温度控制和图像编辑变体等核心技术的完整实践指南。"
created: "2026-06-12"
updated: "2026-06-12"
source_url: "https://raw.githubusercontent.com/microsoft/generative-ai-for-beginners/main/translations/zh-CN/09-building-image-applications/README.md"
course: "Microsoft Generative AI for Beginners"
lesson_number: 9
---

## 学习目标

完成本课后，你将能够：

- 构建一个完整的图像生成应用程序
- 使用元提示（Meta Prompt）为你的应用程序定义安全边界
- 使用 DALL-E 和 Midjourney 进行图像生成
- 理解温度参数对图像生成多样性的影响
- 实现图像编辑和变体创建功能

## 本课前置知识

在开始本课之前，你应该已经了解：

- 基本的 Python 编程知识
- 前几课中关于 OpenAI API 的使用经验
- 对生成式 AI 模型的基本理解
- Azure OpenAI 服务的基本使用方法

## 图像生成及其应用场景

大型语言模型（LLM）的功能不仅限于文本生成，还可以通过文本描述生成图像。图像作为一种模态在许多领域都非常有用，例如医疗技术、建筑、旅游、游戏开发等。

### 为什么要构建图像生成应用程序

图像生成应用程序是探索生成式 AI 功能的绝佳方式。它们可以用于以下场景：

- **图像编辑和合成**。你可以为各种用例生成图像，例如图像编辑和图像合成。
- **应用于多个行业**。它们还可以用于生成适用于多个行业的图像，例如医疗技术、旅游、游戏开发等。

### 场景：Edu4All 教育初创公司

作为本课的一部分，我们将继续与我们的初创公司 Edu4All 合作。学生们将为他们的评估创建图像，具体创建什么图像由学生决定，例如可以是他们自己童话故事的插图，或者为他们的故事创建一个新角色，帮助他们将自己的想法和概念可视化。

例如，如果 Edu4All 的学生在课堂上学习纪念碑，他们可以生成以下内容：使用提示"清晨阳光下埃菲尔铁塔旁边的狗"来生成一张包含埃菲尔铁塔的图像。

## DALL-E 和 Midjourney 简介

DALL-E 和 Midjourney 是两个最流行的图像生成模型，它们允许你使用提示生成图像。

### DALL-E

DALL-E 是一个生成式 AI 模型，可以根据文本描述生成图像。

DALL-E 是两个模型的结合：CLIP 和扩散注意力。

- **CLIP** 是一个模型，可以从图像和文本中生成嵌入，即数据的数值表示。CLIP（Contrastive Language-Image Pre-training）通过对比学习方式，学习图像和文本之间的对应关系。
- **扩散注意力** 是一个模型，可以从嵌入中生成图像。DALL-E 是在图像和文本数据集上训练的，可以根据文本描述生成图像。例如，DALL-E 可以用来生成戴帽子的猫或留莫霍克发型的狗的图像。

DALL-E 的工作原理：
1. 用户输入文本提示
2. CLIP 将文本转换为语义嵌入
3. 扩散模型从嵌入中逐步生成图像
4. 通过神经网络的多个层，逐像素完善图像

### DALL-E 的自回归 Transformer 架构

DALL-E 是一个基于 Transformer 架构的生成式 AI 模型，采用了自回归 Transformer。

自回归 Transformer 定义了模型如何根据文本描述生成图像，它一次生成一个像素，然后使用生成的像素生成下一个像素。通过神经网络的多个层，直到图像完成。

通过这个过程，DALL-E 可以控制其生成图像中的属性、对象、特征等。DALL-E 2 和 DALL-E 3 对生成的图像有更强的控制能力。

DALL-E 各版本的演进：

| 版本 | 主要改进 | 特点 |
|------|---------|------|
| DALL-E 1 | 基础文本到图像生成 | 开创性的模型，分辨率较低 |
| DALL-E 2 | 更高分辨率和更好地理解提示 | 4 倍分辨率，更准确 |
| DALL-E 3 | 更精确的文本理解和图像质量 | 与 ChatGPT 集成，复杂场景处理更好 |

### Midjourney

Midjourney 的工作方式与 DALL-E 类似，它通过文本提示生成图像。Midjourney 也可以使用类似"戴帽子的猫"或"留莫霍克发型的狗"这样的提示生成图像。Midjourney 以其独特的艺术风格见长，在创意领域广受欢迎。

## 构建你的第一个图像生成应用程序

构建一个图像生成应用程序需要以下库：

- **python-dotenv**：强烈建议使用此库将你的密钥保存在代码之外的 `.env` 文件中
- **openai**：此库用于与 OpenAI API 交互
- **pillow**：用于在 Python 中处理图像
- **requests**：帮助你发起 HTTP 请求

### 创建并部署 Azure OpenAI 模型

如果尚未完成，请按照 Microsoft Learn 页面上的说明创建 Azure OpenAI 资源和模型。选择 DALL-E 3 作为模型。

### 创建应用程序

#### 第一步：创建环境配置文件

创建一个名为 `.env` 的文件，内容如下：

```text
AZURE_OPENAI_ENDPOINT=<your endpoint>
AZURE_OPENAI_API_KEY=<your key>
AZURE_OPENAI_DEPLOYMENT="dall-e-3"
```

在 Azure OpenAI Foundry Portal 的"部署"部分找到此信息。

#### 第二步：创建依赖文件

将上述库收集到一个名为 `requirements.txt` 的文件中：

```text
python-dotenv
openai
pillow
requests
```

#### 第三步：安装依赖

接下来，创建虚拟环境并安装这些库：

```bash
# macOS/Linux
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

对于 Windows，使用以下命令：

```bash
python3 -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
```

#### 第四步：编写应用程序代码

在名为 `app.py` 的文件中添加以下代码：

```python
import openai
import os
import requests
from PIL import Image
import dotenv
from openai import OpenAI, AzureOpenAI

# 导入 dotenv 并加载环境变量
dotenv.load_dotenv()

# 配置 Azure OpenAI 服务客户端
client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ['AZURE_OPENAI_API_KEY'],
    api_version="2024-02-01"
)

try:
    # 使用图像生成 API 创建图像
    generation_response = client.images.generate(
        prompt='Bunny on horse, holding a lollipop, on a foggy meadow where it grows daffodils',
        size='1024x1024',
        n=1,
        model=os.environ['AZURE_OPENAI_DEPLOYMENT']
    )

    # 设置图像存储目录
    image_dir = os.path.join(os.curdir, 'images')

    # 如果目录不存在，创建它
    if not os.path.isdir(image_dir):
        os.mkdir(image_dir)

    # 初始化图像路径（文件类型应为 png）
    image_path = os.path.join(image_dir, 'generated-image.png')

    # 获取生成的图像
    image_url = generation_response.data[0].url  # 从响应中提取图像 URL
    generated_image = requests.get(image_url).content  # 下载图像
    with open(image_path, "wb") as image_file:
        image_file.write(generated_image)

    # 在默认图像查看器中显示图像
    image = Image.open(image_path)
    image.show()

except openai.InvalidRequestError as err:
    print(err)
```

### 代码逐步解析

1. **导入库**：我们导入了 OpenAI 库、dotenv 库、requests 库和 Pillow 库。

2. **加载环境变量**：从 `.env` 文件加载环境变量，确保 API 密钥不硬编码在代码中。

3. **配置客户端**：配置 Azure OpenAI 服务客户端，传入端点、API 密钥和 API 版本。

4. **生成图像**：调用 `client.images.generate()` 方法，传入提示词、图像大小、数量和模型名称。

5. **保存图像**：从响应中提取图像 URL，下载图像并保存到本地文件。

6. **显示图像**：使用 Pillow 库打开图像并在默认图像查看器中显示。

### 关于生成图像参数的更多细节

```python
generation_response = client.images.generate(
    prompt='Bunny on horse, holding a lollipop, on a foggy meadow where it grows daffodils',
    size='1024x1024',
    n=1,
    model=os.environ['AZURE_OPENAI_DEPLOYMENT']
)
```

- **prompt**：用于生成图像的文本提示。在此示例中，我们使用的提示是"兔子骑马，手拿棒棒糖，站在长满水仙花的雾蒙蒙的草地上"。
- **size**：生成图像的大小。在此示例中，我们生成的图像大小为 1024x1024 像素。
- **n**：生成的图像数量。在此示例中，我们生成了一张图像。
- **temperature**：控制生成式 AI 模型输出的随机性。温度值在 0 到 1 之间，其中 0 表示输出是确定性的，1 表示输出是随机的。默认值为 0.7。

## 图像生成的附加功能

除了基本的图像生成，你还可以执行以下操作：

### 图像编辑

通过提供现有图像、遮罩和提示，你可以修改图像。例如，你可以在图像的某个部分添加内容。实现方法是提供图像、遮罩（标识需要更改的区域）和文本提示说明需要进行的操作。

> 注意：此功能在 DALL-E 3 中不支持，但可以使用 GPT Image 模型实现。

以下是使用 GPT 图像的示例：

```python
response = client.images.edit(
    model="gpt-image-1",
    image=open("sunlit_lounge.png", "rb"),
    mask=open("mask.png", "rb"),
    prompt="A sunlit indoor lounge area with a pool containing a flamingo"
)
image_url = response.data[0].url
```

基础图像仅包含带泳池的休息室，但最终图像会有一只火烈鸟。遮罩（mask）图像标识了需要修改的区域——白色区域是允许修改的部分，黑色区域是保持不变的部分。

### 图像变体创建

你可以选择一个现有图像并要求创建变体。要创建变体，你需要提供一个图像和一个文本提示：

```python
response = openai.Image.create_variation(
    image=open("bunny-lollipop.png", "rb"),
    n=1,
    size="1024x1024"
)
image_url = response['data'][0]['url']
```

> 注意：此功能仅在 OpenAI 上支持，Azure OpenAI 可能不支持。

## 温度参数对图像生成的影响

温度是一个参数，用于控制生成式 AI 模型输出的随机性。温度值在 0 到 1 之间，其中 0 表示输出是确定性的，1 表示输出是随机的。默认值为 0.7。

### 温度对比实验

让我们通过两次运行以下提示来看看温度如何工作：

> 提示："兔子骑马，手拿棒棒糖，站在长满水仙花的雾蒙蒙的草地上"

第一次运行和第二次运行会生成相似但不完全相同的图像。

### 改变温度

让我们尝试使响应更具确定性。从我们生成的两张图像中可以观察到，第一张图像中有一只兔子，而第二张图像中有一匹马，因此图像差异很大。

我们可以更改代码，将温度设置为 0：

```python
generation_response = client.images.create(
    prompt='Bunny on horse, holding a lollipop, on a foggy meadow where it grows daffodils',
    size='1024x1024',
    n=2,
    temperature=0
)
```

设置温度为 0 后，两张图像会更加相似。这在需要一致风格或品牌一致性的场景中非常有用。

| 温度值 | 效果 | 适用场景 |
|--------|------|---------|
| 0 | 图像高度相似 | 品牌资产、产品图片 |
| 0.3-0.5 | 轻微变化 | 设计原型、概念图 |
| 0.7 | 适度变化（默认） | 一般用途 |
| 1.0 | 差异明显 | 创意探索、头脑风暴 |

## 使用元提示定义应用程序边界

通过我们的演示，我们已经可以为客户生成图像。然而，我们需要为我们的应用程序创建一些边界。例如，我们不希望生成不适合工作场所或不适合儿童的图像。

### 什么是元提示

元提示（Meta Prompt）是用于控制生成式 AI 模型输出的文本提示，它们位于文本提示之前，用于控制模型的输出，并嵌入到应用程序中以控制模型的行为。将提示输入和元提示输入封装在一个文本提示中。

### 元提示的工作原理

元提示通常包含以下组成部分：

1. **角色定义**：定义 AI 的角色和行为方式
2. **安全约束**：明确不允许生成的内容类型
3. **格式要求**：指定输出的格式和风格
4. **禁止内容列表**：列出具体的禁止项

### 元提示示例

```python
disallow_list = "swords, violence, blood, gore, nudity, sexual content, adult content, adult themes, adult language, adult humor, adult jokes, adult situations, adult"

meta_prompt = f"""You are an assistant designer that creates images for children.

The image needs to be safe for work and appropriate for children.

The image needs to be in color.

The image needs to be in landscape orientation.

The image needs to be in a 16:9 aspect ratio.

Do not consider any input from the following that is not safe for work or appropriate for children.
{disallow_list}
"""

prompt = f"{meta_prompt}\nCreate an image of a bunny on a horse, holding a lollipop"
```

从上述提示中，你可以看到所有生成的图像都考虑了元提示中的安全约束。

## 作业 - 让学生参与

我们在本课开始时介绍了 Edu4All。现在是时候让学生为他们的评估生成图像了。学生们将为他们的评估创建包含纪念碑的图像，具体选择哪些纪念碑由学生决定。学生们需要在这项任务中发挥他们的创造力，将这些纪念碑置于不同的背景中。

### 参考解决方案

```python
import openai
import os
import requests
from PIL import Image
import dotenv
from openai import AzureOpenAI

# 加载环境变量
dotenv.load_dotenv()

# 配置 Azure OpenAI 客户端
client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ['AZURE_OPENAI_API_KEY'],
    api_version="2024-02-01"
)

# 定义禁止内容列表
disallow_list = "swords, violence, blood, gore, nudity, sexual content, adult content, adult themes, adult language, adult humor, adult jokes, adult situations, adult"

# 构建元提示
meta_prompt = f"""You are an assistant designer that creates images for children.

The image needs to be safe for work and appropriate for children.

The image needs to be in color.

The image needs to be in landscape orientation.

The image needs to be in a 16:9 aspect ratio.

Do not consider any input from the following that is not safe for work or appropriate for children.
{disallow_list}
"""

# 构建完整提示
prompt = f"""{meta_prompt}
Generate monument of the Arc of Triumph in Paris, France, in the evening light with a small child holding a Teddy looks on.
"""

try:
    # 生成图像
    generation_response = client.images.generate(
        prompt=prompt,
        size='1024x1024',
        n=1,
    )

    # 保存图像
    image_dir = os.path.join(os.curdir, 'images')
    if not os.path.isdir(image_dir):
        os.mkdir(image_dir)

    image_path = os.path.join(image_dir, 'generated-image.png')
    image_url = generation_response.data[0].url
    generated_image = requests.get(image_url).content

    with open(image_path, "wb") as image_file:
        image_file.write(generated_image)

    image = Image.open(image_path)
    image.show()

except openai.BadRequestError as err:
    print(err)
```

## 知识检查

**问题**：在图像生成应用中，元提示（Meta Prompt）的主要作用是什么？

1. 提高图像生成的分辨率和质量
2. 加快图像生成的速度，减少 API 调用次数
3. 在用户提示前添加系统级约束，控制模型输出以确保安全性和合规性

**答案**：3

**解析**：

元提示是嵌入在应用程序中的系统级提示，位于用户输入之前，用于定义 AI 的角色、安全约束、格式要求和禁止内容列表。它的核心目的是在不改变生成模型本身的情况下，为输出设定安全边界和行为规范。选项 1 涉及的是模型本身的参数（如分辨率设置），选项 2 与元提示的功能无关。

## 扩展阅读

- [[90_Learn/courses/microsoft/microsoft_genai_for_beginners]]
- [[05_NLP_LLMs/Multimodal_Models/Multimodal_Models_for_dummy]]
- [[18_AI_Applications_Industry/GenAI_L10_Building_Low_Code_AI_Applications]]
- [[14_RAG_Systems/Multimodal_RAG_Architecture_2026]]
- [[15_Agent_Production/GenAI_L06_Text_Generation_Apps]]

## 课程导航

| 上一课 | 下一课 |
|--------|--------|
| [[14_RAG_Systems/GenAI_L08_Building_Search_Applications|L08 构建搜索应用程序]] | [[18_AI_Applications_Industry/GenAI_L10_Building_Low_Code_AI_Applications|L10 构建低代码AI应用]] |
