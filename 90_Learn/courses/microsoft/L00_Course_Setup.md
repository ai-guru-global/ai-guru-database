---
title: "L00 - 课程环境设置"
category: "90-learn"
tags: ["microsoft-ai-course", "course-setup", "jupyter", "pytorch", "tensorflow"]
summary: "介绍如何开始使用 Microsoft AI For Beginners（微软 AI 入门）课程：不同学习者的起步方式、Jupyter Notebook（Jupyter 交互式笔记本）的运行路径、课程教学方法与离线访问方案。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/0-course-setup/setup.md"
created: "2026-06-12"
updated: "2026-06-12"
---

# L00 - 课程环境设置

> **一句话理解**：本课不是讲 AI 算法，而是告诉你如何“进入”这门 12 周课程——学生如何利用微软资源、自学者如何 fork（复刻/分叉）仓库并运行 Jupyter Notebook（Jupyter 交互式笔记本）、教师如何备课，以及没有网络时怎样离线阅读全部材料。

## 本课概览

Microsoft AI For Beginners（微软 AI 入门）的“第 0 课”聚焦**学习路径与环境准备**。它不提供具体的神经网络代码，而是说明课程的组织方式、推荐的学习流程，以及运行后续 24 课 Jupyter Notebook 所需的环境入口。

本课在课程表中的定位是“启航页”。如果你是学生，它会指引你到微软学生中心与大使计划；如果你是自学者，它给出一套可复现的自学节奏；如果你要离线阅读，它也提供了 Docsify（轻量级文档站点生成器）与 PDF（便携式文档格式）两种方案。理解这些内容后，才能高效地进入后续的算法主题。

学习目标：

- 明确学生、自学者、教师三种角色的起步动作。
- 掌握课程 Jupyter Notebook 的推荐运行方式。
- 理解“项目驱动 + 频繁测验”的教学设计。
- 知道离线访问与课程讨论区的入口。

## 核心概念

- **课程即仓库（Curriculum as a Repo）**：整个课程就是一个 GitHub（代码托管平台）仓库。理论文本、可运行代码、测验、实验都在仓库里，阅读与运行一体化。
- **双框架 Notebook**：多数课时同时提供 PyTorch（基于 Python 的开源深度学习框架）与 TensorFlow / Keras（谷歌深度学习框架及其高层 API）两个版本的 Jupyter Notebook。初学者不必两个都跑，选一个最熟悉的框架深入即可。
- **课前/课后测验（Pre/Post Quiz）**：每课通常包含 3 道题的轻量测验。课前测验用于设定学习意图，课后测验用于巩固记忆。
- **项目驱动学习（Project-based Learning）**：课程从小项目开始，逐步过渡到更复杂的综合实验，鼓励在修改代码和完成挑战的过程中学习。
- **Docsify 离线阅读**：Docsify（轻量级文档站点生成器）可以在本地把 Markdown 课程渲染成可浏览的网站，适合无网络或内网环境。

## 关键知识点

- 学生可以先访问 [Microsoft Learn 学生中心](https://docs.microsoft.com/learn/student-hub?WT.mc_id=academic-77998-cacaste) 与 [学生大使计划](https://studentambassadors.microsoft.com?WT.mc_id=academic-77998-cacaste)，获取免费资源与社群支持。
- 自学者建议 fork（复刻/分叉）官方仓库到自己的 GitHub（代码托管平台）账号，再按“课前测验 → 阅读理论 → 运行 Jupyter Notebook → 课后测验 → 完成实验 → 参与讨论”的顺序推进。
- 运行 Jupyter Notebook 前，先阅读官方 [`how-to-run.md`](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/0-course-setup/how-to-run.md)；也可参考博客 [How to execute notebooks from GitHub](https://soshnikov.com/education/how-to-execute-notebooks-from-github/)。
- 课程推荐的扩展学习路径在 [Microsoft Learn 集合](https://docs.microsoft.com/en-us/users/dmitrysoshnikov-9132/collections/31zgizg2p418yo/?WT.mc_id=academic-77998-cacaste)。
- 教师可查看官方 [`for-teachers.md`](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/0-course-setup/for-teachers.md) 获取授课建议。
- 全部 50 个测验（每课 3 题）既可[在线访问](https://red-field-0a6ddfd03.1.azurestaticapps.net/)，也能在本地运行 `etc/quiz-app`。

## 代码/实验说明

本课本身没有独立的 Jupyter Notebook，但它是后续所有实验的“入口说明书”。

### 如何运行课程 Notebook

官方推荐两种主要方式：

1. **在 GitHub（代码托管平台）上直接阅读**：如果只是想看代码和说明，可以直接在仓库中浏览 `.ipynb` 文件。但这种方式无法交互执行。
2. **本地或云端执行**：
   - Fork/Clone 仓库：
     ```bash
     git clone https://github.com/microsoft/AI-For-Beginners.git
     cd AI-For-Beginners
     ```
   - 根据 `how-to-run.md` 安装 Python 依赖（通常包括 PyTorch 或 TensorFlow、Jupyter、NumPy、Matplotlib 等）。
   - 启动 Jupyter：
     ```bash
     jupyter notebook
     ```
   - 进入对应课时的 Notebook 文件夹，选择 PyTorch 或 TensorFlow 版本运行。

### 框架选择建议

- **PyTorch（基于 Python 的开源深度学习框架）**：动态图、调试直观，研究和快速实验更常见。
- **TensorFlow / Keras（谷歌深度学习框架及其高层 API）**：静态/动态图兼具，生产部署生态成熟。

对于自学者，建议先选定一个框架跑通全部课程，再视需要补充另一个。

## 本课不覆盖与延伸

- **不覆盖**：本课不讲解 Python 基础、Git 使用、深度学习数学原理，也不会部署模型到云端。这些内容可分别参考本库 [[01_Fundamentals/AI_Development_Environment_Setup]] 与相关基础章节。
- **延伸**：
  - 想系统了解课程全貌 → [[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
  - 想准备本地开发环境 → [[01_Fundamentals/AI_Development_Environment_Setup]]
  - 想学习如何运行 GitHub 上的 Notebook → 官方 [`how-to-run.md`](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/0-course-setup/how-to-run.md)

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：[[01_Fundamentals/AI_Development_Environment_Setup]]
- 官方运行说明：[how-to-run.md](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/0-course-setup/how-to-run.md)
- 教师指南：[for-teachers.md](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/0-course-setup/for-teachers.md)
