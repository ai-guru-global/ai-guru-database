---
title: "构建低代码 AI 应用程序"
category: "18-ai-applications-industry"
tags: ["microsoft-genai-course", "low-code", "power-platform", "copilot", "ai-builder", "dataverse"]
summary: "学习使用微软Power Platform和Copilot构建低代码AI应用，涵盖Power Apps、Power Automate、Dataverse和AI Builder的完整实践指南。"
created: "2026-06-12"
updated: "2026-06-12"
source_url: "https://raw.githubusercontent.com/microsoft/generative-ai-for-beginners/main/translations/zh-CN/10-building-low-code-ai-applications/README.md"
course: "Microsoft Generative AI for Beginners"
lesson_number: 10
tier: supporting
aliases:
  - "Genai L10 Building Low Code Ai Applications"
  - "GenAI L10 Building Low Code AI Applications"
  - GenAI_L10_Building_Low_Code_AI_Applications

---
## 学习目标

完成本课后，你将能够：

- 了解 Copilot 在 Power Platform 中的工作原理
- 为我们的教育初创公司构建一个学生作业跟踪应用程序
- 构建一个使用 AI 从发票中提取信息的发票处理流程
- 在使用 GPT AI 模型生成文本时应用最佳实践
- 理解 Power Platform 五大核心产品的功能定位

## 本课前置知识

在开始本课之前，你应该已经了解：

- 前几课中关于生成式 AI 和 LLM 的基础概念
- 基本的应用程序开发概念
- 对工作流自动化的基本理解
- 无需编程经验，这正是低代码的优势

## 什么是低代码开发

生成式 AI 可以应用于许多不同领域，包括低代码开发。低代码开发平台允许用户通过极少甚至无需编写代码来构建应用程序和解决方案。这是通过提供一个可视化开发环境实现的，用户可以通过拖放组件来构建应用程序和解决方案。这使得构建应用程序和解决方案的速度更快，资源需求更少。

### Power Platform 概述

Power Platform 为组织提供了一个直观的低代码或无代码环境，使团队能够自主构建解决方案。这个环境简化了构建解决方案的过程。使用 Power Platform，解决方案可以在几天或几周内完成，而不是几个月或几年。

Power Platform 包括五个核心产品：

| 产品 | 功能 | 适用场景 |
|------|------|---------|
| **Power Apps** | 构建自定义业务应用 | 数据管理、表单处理、移动应用 |
| **Power Automate** | 创建自动化工作流 | 流程自动化、通知、数据同步 |
| **Power BI** | 数据分析和可视化 | 仪表板、报表、商业智能 |
| **Power Pages** | 构建外部面向的网站 | 客户门户、自助服务网站 |
| **Copilot Studio** | 构建自定义 Copilot | 聊天机器人、虚拟助手 |

本课中你将使用的工具和技术包括：

- **Power Apps**：用于学生作业跟踪应用程序，提供一个低代码开发环境
- **Dataverse**：用于存储学生作业跟踪应用程序的数据，提供一个低代码数据平台
- **Power Automate**：用于发票处理流程，提供一个低代码开发环境，用于构建工作流
- **AI Builder**：用于发票处理 AI 模型，使用预构建的 AI 模型来处理发票

## Power Platform 中的生成式 AI

通过生成式 AI 增强低代码开发和应用程序是 Power Platform 的一个关键关注领域。目标是让每个人都能构建 AI 驱动的应用程序、网站、仪表板，并通过 AI 自动化流程，无需任何数据科学专业知识。

### Copilot AI 助手

Copilot 是一个 AI 助手，允许你通过自然语言描述需求，在一系列对话步骤中构建 Power Platform 解决方案。例如，你可以指示 AI 助手说明应用程序将使用哪些字段，它将根据你的描述创建应用程序和底层数据模型，或者你可以指定如何在 Power Automate 中设置流程。

你可以在应用程序屏幕中使用 Copilot 驱动的功能，通过对话交互帮助用户发现洞察。

### AI Builder

AI Builder 是 Power Platform 中的一项低代码 AI 功能，允许你使用 AI 模型来帮助自动化流程和预测结果。通过 AI Builder，你可以将 AI 引入连接到 Dataverse 或各种云数据源（如 SharePoint、OneDrive 或 Azure）的应用程序和流程中。

### 产品可用性

Copilot 在 Power Platform 的所有产品中均可用：Power Apps、Power Automate、Power BI、Power Pages 和 Copilot Studio。而 AI Builder 在 Power Apps 和 Power Automate 中可用。

## Power Apps 中的 Copilot

Power Apps 提供了一个低代码开发环境，用于构建应用程序以跟踪、管理和与数据交互。它是一套应用程序开发服务，具有可扩展的数据平台，并能够连接到云服务和本地数据。Power Apps 允许你构建可在浏览器、平板电脑和手机上运行的应用程序，并与同事共享。

### 使用 Copilot 构建应用程序

Power Apps 中的 Copilot AI 助手功能允许你描述所需的应用程序类型以及应用程序需要跟踪、收集或显示的信息。Copilot 会根据你的描述生成一个响应式 Canvas 应用程序。然后，你可以根据需要自定义应用程序。

AI Copilot 还会生成并建议一个包含所需字段的 Dataverse 表，用于存储你想要跟踪的数据，并提供一些示例数据。你可以通过对话步骤使用 AI Copilot 助手功能进一步自定义表格。

### Power Apps 开发流程

使用 Copilot 构建 Power Apps 的步骤：

1. **描述需求**：在 Power Apps 主屏幕使用自然语言描述想要构建的应用程序
2. **AI 生成表结构**：Copilot 建议包含所需字段的 Dataverse 表
3. **自定义表结构**：通过对话添加或修改字段
4. **生成应用**：点击"创建应用程序"按钮生成 Canvas 应用
5. **添加功能**：通过对话添加新屏幕和功能

## Power Automate 中的 Copilot

Power Automate 允许用户在应用程序和服务之间创建自动化工作流。它帮助自动化重复的业务流程，例如通信、数据收集和决策审批。

### 使用 Copilot 构建流程

Power Automate 中的 Copilot AI 助手功能允许你描述所需的流程类型以及流程需要执行的操作。Copilot 会根据你的描述生成一个流程。然后，你可以根据需要自定义流程。AI Copilot 还会生成并建议执行任务所需的操作。

## Dataverse 数据平台

Dataverse 是 Power Platform 的底层数据平台。它是一个低代码数据平台，用于存储应用程序的数据。它是一个完全托管的服务，安全地将数据存储在 Microsoft 云中，并在你的 Power Platform 环境中进行配置。

### 为什么使用 Dataverse

Dataverse 的核心优势：

- **易于管理**：元数据和数据都存储在云中，因此你无需担心它们的存储或管理细节。你可以专注于构建应用程序和解决方案。
- **安全性**：Dataverse 为你的数据提供了安全的云存储选项。你可以通过基于角色的安全性控制谁可以访问表中的数据以及如何访问。
- **丰富的元数据**：数据类型和关系可以直接在 Power Apps 中使用。
- **逻辑和验证**：你可以使用业务规则、计算字段和验证规则来强制执行业务逻辑并保持数据的准确性。

### 在 Dataverse 中使用 Copilot 创建表

使用 Copilot 在 Dataverse 中创建表的步骤：

1. 进入 Power Apps 的主页
2. 在左侧导航栏中，选择 **Tables**，然后点击 **Describe the new Table**
3. 在文本区域描述你想要创建的表
4. AI Copilot 将建议一个包含字段的表和示例数据
5. 通过对话步骤自定义表格
6. 点击 **Create** 按钮创建表格

## AI Builder 模型

AI Builder 是 Power Platform 中的一种低代码 AI 功能，它使你能够使用 AI 模型来帮助自动化流程和预测结果。

### 预构建 AI 模型

预构建 AI 模型是由 Microsoft 训练并在 Power Platform 中可用的现成 AI 模型。这些模型帮助你为应用程序和流程添加智能，而无需收集数据然后构建、训练和发布自己的模型。

Power Platform 中的一些预构建 AI 模型包括：

| 模型 | 功能 | 典型应用场景 |
|------|------|------------|
| **关键短语提取** | 从文本中提取关键短语 | 文档摘要、主题分析 |
| **语言检测** | 检测文本的语言 | 多语言内容处理 |
| **情感分析** | 检测文本中的积极、消极、中性或混合情感 | 客户反馈分析、社交媒体监控 |
| **名片读取器** | 从名片中提取信息 | 联系人管理 |
| **文本识别** | 从图像中提取文本 | 文档数字化 |
| **对象检测** | 检测并从图像中提取对象 | 库存管理、质量控制 |
| **文档处理** | 从表单中提取信息 | 表单自动化 |
| **发票处理** | 从发票中提取信息 | 财务自动化 |

### 自定义 AI 模型

通过自定义 AI 模型，你可以将自己的模型引入 AI Builder，使其像任何 AI Builder 自定义模型一样工作，允许你使用自己的数据训练模型。你可以在 Power Apps 和 Power Automate 中使用这些模型来自动化流程和预测结果。使用自定义模型时有一些限制，例如对模型格式和大小的限制。

## 作业 #1：构建学生作业跟踪应用程序

我们初创公司的教育工作者一直在努力跟踪学生作业。他们一直使用电子表格来跟踪作业，但随着学生数量的增加，这种方式变得难以管理。他们要求你构建一个应用程序，帮助他们跟踪和管理学生作业。

### 步骤指南

1. 进入 Power Apps 主屏幕

2. 使用主屏幕上的文本区域描述你想要构建的应用程序：

   **我想构建一个应用程序来跟踪和管理学生作业**

   点击 **发送** 按钮将提示发送给 AI Copilot。

3. AI Copilot 会建议一个包含所需字段的 Dataverse 表，用于存储你想要跟踪的数据，并提供一些示例数据。你可以通过对话步骤使用 AI Copilot 助手功能进一步自定义表格。

4. 教育工作者希望向提交作业的学生发送电子邮件。使用以下提示向表中添加一个新字段：

   **我想添加一个列来存储学生电子邮件**

5. 完成表格后，点击 **创建应用程序** 按钮以创建应用程序。

6. AI Copilot 会根据你的描述生成一个响应式 Canvas 应用程序。

7. 为了让教育工作者向学生发送电子邮件，使用以下提示向应用程序添加一个新屏幕：

   **我想添加一个屏幕来向学生发送电子邮件**

8. 完成应用程序后，点击 **保存** 按钮保存应用程序。

9. 要与教育工作者共享应用程序，点击 **共享** 按钮，然后通过输入教育工作者的电子邮件地址与他们共享。

> 进阶挑战：你刚刚构建的应用程序是一个良好的开端，但可以进一步改进。通过电子邮件功能，教育工作者只能手动输入学生的电子邮件来发送邮件。你能否使用 Copilot 构建一个自动化功能，使教育工作者在学生提交作业时自动向他们发送电子邮件？提示：通过正确的提示，你可以使用 Power Automate 中的 Copilot 来实现这一点。

## 作业 #2：构建发票信息表和发票处理流程

### 创建发票信息表

1. 进入 Power Apps 的主页
2. 在左侧导航栏中，选择 **Tables**，然后点击 **Describe the new Table**
3. 描述表：**我想创建一个表来存储发票信息**
4. 添加供应商电子邮件字段：**我想添加一个列来存储供应商电子邮件**
5. 点击 **Create** 按钮创建表格

### 构建发票处理流程

使用 AI Builder 中的发票处理 AI 模型构建工作流程：

1. 进入 Power Automate 的主页

2. 描述工作流程：**当发票到达我的邮箱时处理发票**

3. AI Copilot 将建议你需要执行的操作。点击 **Next** 按钮查看下一步。

4. 设置流程所需的连接，然后点击 **Create flow** 按钮创建流程。

5. 更新流程的触发器：
   - 将 **Folder** 设置为存储发票的文件夹（如 **Inbox**）
   - 点击 **Show advanced options**
   - 将 **Only with Attachments** 设置为 **Yes**

6. 删除不需要的操作：**HTML to text**、**Compose**、**Compose 2**、**Compose 3** 和 **Compose 4** 以及 **Condition** 操作

7. 点击 **Add an action** 并搜索 **Dataverse**，选择 **Add a new row** 操作

8. 在 **Extract Information from invoices** 操作中，将 **Invoice File** 更新为指向电子邮件中的 **Attachment Content**

9. 选择之前创建的 **Invoice Information** 表，使用动态内容填充以下字段：
   - **ID**：从发票提取的 ID
   - **Amount**：发票金额
   - **Date**：发票日期
   - **Name**：发票名称
   - **Status**：设置为 **Pending**
   - **Supplier Email**：使用 **When a new email arrives** 触发器中的 **From** 动态内容

10. 保存流程

> 进阶挑战：你刚刚构建的流程是一个良好的开端，现在你需要思考如何构建一个自动化流程，使我们的财务团队能够向供应商发送电子邮件，更新他们的发票当前状态。提示：流程必须在发票状态更改时运行。

## 在 Power Automate 中使用文本生成 AI 模型

AI Builder 中的 Create Text with GPT AI 模型使你能够基于提示生成文本，并由 Microsoft Azure OpenAI 服务提供支持。通过此功能，你可以将 GPT 技术集成到你的应用程序和流程中。

### 应用场景

你可以构建流程来自动生成各种用途的文本：

- **电子邮件草稿**：自动生成回复邮件
- **产品描述**：从产品数据生成营销文案
- **客户服务**：自动回复常见客户问题
- **报告摘要**：从数据自动生成摘要报告

### 最佳实践

使用 GPT 文本生成模型时的最佳实践：

1. **清晰的提示**：提供明确、具体的指令，包括期望的格式和风格
2. **提供上下文**：在提示中包含足够的背景信息
3. **设置输出格式**：明确指定期望的输出格式（如列表、段落、表格）
4. **添加约束**：指定字数限制、语气要求等
5. **迭代优化**：根据输出结果不断调整提示

## 知识检查

**问题**：在 Power Platform 中，Dataverse 的核心作用是什么？

1. 提供可视化拖放界面来构建应用程序
2. 作为底层数据平台，提供安全的云存储、元数据管理和业务规则验证
3. 使用预构建 AI 模型自动处理发票和文档

**答案**：2

**解析**：

Dataverse 是 Power Platform 的底层数据平台，负责安全地存储应用数据到 Microsoft 云中。它提供基于角色的安全控制、丰富的元数据管理、业务规则和验证逻辑。选项 1 描述的是 Power Apps 的功能，选项 3 描述的是 AI Builder 的功能。Dataverse 专注于数据管理而非界面构建或 AI 处理。

## 扩展阅读

- [[90_Learn/courses/microsoft/microsoft_genai_for_beginners]]
- [[大模型/Multimodal_Models/GenAI_L09_Building_Image_Applications]]
- [[Agent/GenAI_L11_Integrating_with_Function_Calling]]
- [[Agent/Agent_Platforms/README]]
- [[行业应用/Education/AI_Education_2026]]

## 课程导航

| 上一课 | 下一课 |
|--------|--------|
| [[大模型/Multimodal_Models/GenAI_L09_Building_Image_Applications|L09 构建图像生成应用]] | [[Agent/GenAI_L11_Integrating_with_Function_Calling|L11 集成函数调用]] |
