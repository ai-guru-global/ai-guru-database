---
title: "课程设置与环境配置"
category: "01-fundamentals"
tags: ["microsoft-genai-course", "development-environment", "python-setup", "azure-openai", "github-codespaces"]
summary: "Microsoft 生成式 AI 初学者课程的完整开发环境设置指南，涵盖 GitHub Codespaces、本地环境配置、Miniconda、容器化开发、Azure OpenAI 服务和密钥管理。"
created: "2026-06-12"
updated: "2026-06-12"
source_url: "https://raw.githubusercontent.com/microsoft/generative-ai-for-beginners/main/translations/zh-CN/00-course-setup/README.md"
course: "Microsoft Generative AI for Beginners"
lesson_number: 0
tier: supporting
aliases:
  - "Genai L00 Course Setup"
  - "GenAI L00 Course Setup"
  - GenAI_L00_Course_Setup
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
## 学习目标

完成本课后，你将能够：

- 成功 Fork 课程仓库并设置开发环境
- 使用 GitHub Codespaces 创建云端开发环境
- 配置 API 密钥和环境变量以安全访问 AI 服务
- 在本地电脑上搭建完整的 Python 开发环境
- 安装和配置 Miniconda 管理虚拟环境
- 使用 VS Code 和 Jupyter 运行课程代码
- 配置 Azure OpenAI 服务和 OpenAI API
- 识别并排除常见环境问题

## 本课前置知识

本课是整个课程的起点，不需要任何 AI 或机器学习的前置知识。但以下基础知识将帮助你更顺利地完成环境设置：

- 基本的命令行/终端操作能力
- GitHub 账号及基本的 Git 操作（如 Fork、Clone）
- 对 Python 编程语言的基础了解（编程课时需要）
- 对 API 和密钥概念的基本理解

## 课程概述

本课程（Microsoft Generative AI for Beginners）共包含 **21 节课**，分为两大类：

| 类型 | 数量 | 说明 |
|------|------|------|
| Learn（理念课） | 12 节 | 介绍生成式 AI 的核心概念、原理和最佳实践 |
| Build（编程课） | 9 节 | 通过实际代码演示如何构建生成式 AI 应用 |

编程课使用 **Azure OpenAI 服务** 和 **OpenAI API**。运行编程课代码需要相应的 API 密钥。在等待 Azure OpenAI 访问权限审批期间，每节编程课的 `README.md` 文件中都包含了可查看的代码和输出内容，方便你先学习理解。

## 设置步骤

### 步骤一：Fork 课程仓库

首先需要将整个课程仓库 Fork 到你自己的 GitHub 账号中。Fork 操作会创建一份属于你的仓库副本，使你可以自由修改代码、完成练习和挑战。

**操作方法**：

1. 访问课程仓库页面：`https://github.com/microsoft/generative-ai-for-beginners`
2. 点击页面右上角的 **Fork** 按钮
3. 在弹出的对话框中确认 Fork 设置，点击 **Create fork**
4. 等待 Fork 完成，你将拥有一个完整的仓库副本

**额外建议**：你也可以为本仓库 **加星标（Star）**，方便后续快速找到它。点击仓库页面上的星标按钮即可。星标功能相当于书签，帮助你管理感兴趣的开源项目。

### 步骤二：创建 GitHub Codespace

为了避免在本地运行代码时可能出现的依赖冲突和版本不兼容问题，课程**强烈推荐**使用 GitHub Codespaces 作为开发环境。Codespaces 提供了一个预配置的云端开发环境，所有必要的依赖都已预先安装。

**什么是 GitHub Codespaces？**

GitHub Codespaces 是 GitHub 提供的云端开发环境服务。它在云端运行一个完整的 VS Code 编辑器实例，预装了项目所需的所有工具和依赖。你可以直接在浏览器中使用，无需在本地安装任何软件。

**创建 Codespace 的步骤**：

1. 进入你 Fork 后的仓库页面
2. 点击绿色的 **Code** 按钮
3. 选择 **Codespaces** 标签页
4. 点击 **Create codespace on main**

创建过程可能需要几分钟时间，因为 GitHub 需要根据仓库中的 `.devcontainer` 配置文件来构建开发容器。

**创建 Codespace 的界面说明**：

当你点击 Code → Codespaces 后，会看到一个对话框，显示创建新 Codespace 的按钮。点击后，GitHub 会自动开始构建容器，并在浏览器中打开一个完整的 VS Code 编辑器界面。

#### 添加 API 密钥到 Codespace

创建好 Codespace 后，需要将你的 OpenAI API 密钥添加为安全密钥，以便代码能够正常调用 API。

**操作步骤**：

1. 在 Codespace 界面中，点击左下角的 **齿轮图标（Settings）**
2. 打开 **命令面板（Command Palette）**
3. 搜索并选择 **Codespaces: Manage User Secrets**
4. 点击 **Add new secret**（添加新密钥）
5. 在名称字段输入 `OPENAI_API_KEY`
6. 在值字段粘贴你的 OpenAI API 密钥
7. 点击 **Save**（保存）

密钥添加后，Codespace 中的代码即可通过环境变量访问该密钥。

### 步骤三：下一步行动

完成环境设置后，你可以根据自身需求选择不同的学习路径：

| 我想... | 跳转到... |
|---------|-----------|
| 开始第 1 课 | `01-introduction-to-genai` |
| 离线工作 | 本文档的本地环境搭建章节 |
| 设置大型语言模型提供商 | `providers.md` |
| 认识其他学习者 | 加入官方 Discord 服务器 |

## 本地环境搭建

如果你更倾向于在本地电脑上运行课程代码，以下是完整的本地环境搭建指南。

### 安装 Python

在本地运行代码需要先安装 Python。推荐使用 Python 3.8 或更高版本。

**下载地址**：访问 Python 官网 `https://www.python.org/downloads/` 下载适合你操作系统的版本。

**安装注意事项**：
- 在 Windows 上安装时，勾选 "Add Python to PATH" 选项
- 在 macOS 上，可以使用 Homebrew 安装：`brew install python3`
- 在 Linux 上，通常已预装 Python，可通过 `python3 --version` 检查版本

### 克隆仓库

安装好 Python 后，需要将课程仓库克隆到本地：

```shell
git clone https://github.com/microsoft/generative-ai-for-beginners
cd generative-ai-for-beginners
```

如果你已经 Fork 了仓库，建议克隆你自己 Fork 的版本，这样可以直接推送修改：

```shell
git clone https://github.com/你的用户名/generative-ai-for-beginners
cd generative-ai-for-beginners
```

### 配置本地环境变量

在本地运行代码需要通过 `.env` 文件管理 API 密钥等敏感信息。

**创建 .env 文件**：

在基于 Unix 的系统（macOS、Linux）上：

```bash
touch .env
```

在 Windows 系统上：

```cmd
echo . > .env
```

**编辑 .env 文件**：

使用文本编辑器（如 VS Code、Notepad++ 或任何其他编辑器）打开 `.env` 文件，添加以下内容：

```env
GITHUB_TOKEN=your_github_token_here
OPENAI_API_KEY=your_openai_api_key_here
```

将 `your_github_token_here` 和 `your_openai_api_key_here` 替换为你的实际令牌和密钥值。保存文件并关闭编辑器。

**安装 python-dotenv**：

`python-dotenv` 是一个 Python 包，用于将 `.env` 文件中的环境变量加载到 Python 应用中。使用 pip 安装：

```bash
pip install python-dotenv
```

**在 Python 脚本中加载环境变量**：

以下代码展示了如何在 Python 脚本中加载和使用 `.env` 文件中的环境变量：

```python
from dotenv import load_dotenv
import os

# 从 .env 文件加载环境变量到系统环境
load_dotenv()

# 访问 GITHUB_TOKEN 变量
github_token = os.getenv("GITHUB_TOKEN")

# 访问 OPENAI_API_KEY 变量
openai_api_key = os.getenv("OPENAI_API_KEY")

# 验证密钥是否成功加载
if openai_api_key:
    print("API 密钥已成功加载")
else:
    print("警告：API 密钥未找到，请检查 .env 文件")
```

**重要提示**：`.env` 文件包含敏感信息，**绝不应提交到 Git 仓库**。确保 `.env` 已添加到 `.gitignore` 文件中。

## 安装 Miniconda（可选但推荐）

Miniconda 是一个轻量级的 Python 环境管理工具，基于 Conda 包管理器。它可以帮助你创建和管理隔离的 Python 虚拟环境，避免不同项目之间的依赖冲突。

### 什么是 Miniconda？

Miniconda 是 Anaconda 的精简版本，只包含 Conda 包管理器和 Python。相比完整的 Anaconda 发行版，Miniconda 的安装体积更小，适合只需要基本 Python 环境管理的开发者。

Conda 的核心优势包括：
- 轻松创建和切换不同的 Python 虚拟环境
- 安装 pip 无法获取的科学计算和数据处理包
- 管理不同版本的 Python 和依赖包
- 跨平台支持（Windows、macOS、Linux）

### 安装步骤

**下载地址**：访问 Miniconda 官方页面 `https://docs.anaconda.com/free/miniconda/` 获取安装指南。

**快速安装命令**（根据你的操作系统选择）：

macOS（Intel 芯片）：
```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh
bash Miniconda3-latest-MacOSX-x86_64.sh
```

macOS（Apple Silicon 芯片）：
```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh
bash Miniconda3-latest-MacOSX-arm64.sh
```

Linux：
```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
```

### 创建 Conda 虚拟环境

安装 Miniconda 后，需要为课程创建一个专用的虚拟环境。

**创建环境文件**：

在项目目录下创建 `environment.yml` 文件（如果使用 Codespaces，则在 `.devcontainer/` 目录下创建 `.devcontainer/environment.yml`）：

```yaml
name: ai4beg
channels:
  - defaults
  - microsoft
dependencies:
  - python=3
  - openai
  - python-dotenv
  - pip
  - pip:
      - azure-ai-ml
```

这个环境文件定义了：
- **name**：环境名称为 `ai4beg`（AI for Beginners 的缩写）
- **channels**：从默认频道和 Microsoft 频道获取包
- **dependencies**：包括 Python 3、OpenAI SDK、python-dotenv 和 Azure AI ML 库

**注意**：如果在安装 Microsoft AI 库时遇到错误，可以在终端手动运行以下命令：

```bash
conda install -c microsoft azure-ai-ml
```

**创建和激活环境**：

```bash
# 使用环境文件创建 Conda 环境
conda env create --name ai4beg --file .devcontainer/environment.yml

# 激活创建的环境
conda activate ai4beg
```

激活环境后，终端提示符前面会出现 `(ai4beg)` 标识，表示你已在虚拟环境中。所有后续的 Python 操作都将使用该环境中的依赖包。

**环境管理参考**：

```bash
# 查看所有已创建的 Conda 环境
conda env list

# 删除某个环境
conda env remove --name ai4beg

# 更新环境（修改 environment.yml 后）
conda env update --name ai4beg --file environment.yml
```

更多详细操作请参考 [Conda 环境管理指南](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html)。

## 使用 Visual Studio Code

### 安装 VS Code 和 Python 扩展

本课程推荐使用安装了 **Python 支持扩展** 的 **Visual Studio Code (VS Code)** 编辑器。VS Code 是微软开发的免费开源代码编辑器，配合 Python 扩展可以提供代码补全、调试、Linting 等功能。

**安装步骤**：

1. 从官网下载并安装 VS Code：`https://code.visualstudio.com/`
2. 安装 Python 扩展：打开 VS Code → 扩展面板（Ctrl+Shift+X）→ 搜索 "Python" → 安装微软官方的 Python 扩展

**重要提示**：
- 打开课程仓库目录时，VS Code 可能会提示你在容器中重新打开（因为仓库包含 `.devcontainer` 配置）。如果你使用本地 Python 环境，请**拒绝此请求**
- VS Code 可能会自动提示你安装 Python 扩展，点击安装即可
- 如果同时安装了 Miniconda，VS Code 会自动检测 Conda 环境，可以在底部状态栏选择 Python 解释器

## 使用 Jupyter Notebook

### 在浏览器中运行 Jupyter

Jupyter Notebook 是一种交互式编程环境，非常适合数据科学和 AI 开发。课程中的许多练习都以 Jupyter Notebook（`.ipynb` 文件）的形式提供。

**安装 Jupyter**：

```bash
pip install jupyter
```

**启动 Jupyter Notebook**：

打开终端，导航到课程目录后执行：

```bash
jupyter notebook
```

或者使用 JupyterHub（适合多用户场景）：

```bash
jupyterhub
```

命令执行后，终端会显示一个本地 URL（通常是 `http://localhost:8888/`）。在浏览器中访问该 URL 即可打开 Jupyter 界面。

**使用说明**：
- 在 Jupyter 界面中可以浏览课程目录结构
- 点击任意 `.ipynb` 文件即可打开 Notebook
- 每个代码单元可以独立运行，方便逐步学习和实验
- 例如，可以打开 `08-building-search-applications/python/oai-solution.ipynb` 查看搜索应用的代码示例

### 选择 Notebook 内核

打开 Notebook 后，需要确保选择了正确的 Python 内核：

1. 点击 Notebook 菜单栏的 **内核（Kernel）** 菜单
2. 选择 **选择内核（Select Kernel）**
3. 选择 **Python 3**（如果使用 Conda 环境，选择对应的 Conda 环境）

## 容器化运行

### 使用 Docker 容器

除了直接在电脑上安装环境或使用 Codespaces 外，还可以使用容器技术来运行课程代码。容器化是一种轻量级的虚拟化技术，它将应用及其所有依赖打包在一起，确保在任何环境中都能一致运行。

**前提条件**：
- 安装 Docker Desktop：`https://www.docker.com/products/docker-desktop/`
- 具备基本的 Docker 使用经验

**课程仓库中的容器支持**：

课程仓库包含一个特殊的 `.devcontainer` 文件夹，其中包含了 VS Code 开发容器的配置。这意味着：

1. VS Code 可以自动检测到该配置并提示你在容器中打开项目
2. 容器会预装所有必要的 Python 包和工具
3. 开发环境完全隔离，不会影响你的本地系统

**注意**：容器化方式操作稍复杂，建议有容器经验的开发者使用。如果你是 Docker 新手，推荐先使用 GitHub Codespaces 或本地 Python 环境。

### 密钥安全最佳实践

使用 GitHub Codespaces 时，为了保证 API 密钥的安全，最推荐使用 **Codespaces Secrets** 功能。详细操作请参考 GitHub 官方的 [Codespaces 密钥管理指南](https://docs.github.com/en/codespaces/managing-your-codespaces/managing-secrets-for-your-codespaces)。

**密钥管理原则**：
- 永远不要将 API 密钥硬编码在代码中
- 不要将包含密钥的文件提交到 Git 仓库
- 使用环境变量或密钥管理服务存储敏感信息
- 定期轮换 API 密钥

## Azure OpenAI 服务设置

### 首次使用 Azure OpenAI

编程课使用 Azure OpenAI 服务来调用大型语言模型。如果你是第一次使用 Azure OpenAI 服务，需要完成以下步骤：

**1. 申请访问权限**：

访问 Azure OpenAI 服务页面 `https://azure.microsoft.com/products/ai-services/openai-service`，提交访问申请。由于 Azure OpenAI 服务目前需要审批，申请后可能需要等待一段时间。

**2. 创建 Azure OpenAI 资源**：

申请批准后，按照官方指南创建和部署 Azure OpenAI 资源：
`https://learn.microsoft.com/azure/ai-services/openai/how-to/create-resource`

具体步骤包括：
- 登录 Azure 门户
- 创建新的 Azure OpenAI 资源
- 选择合适的定价层和区域
- 部署所需的模型（如 GPT-3.5、GPT-4 等）
- 获取终端点 URL 和 API 密钥

**3. 配置连接信息**：

将获取的 Azure OpenAI 终端点和密钥添加到 `.env` 文件中：

```env
AZURE_OPENAI_API_KEY=你的Azure_OpenAI密钥
AZURE_OPENAI_ENDPOINT=https://你的资源名.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=你的模型部署名称
```

## OpenAI API 设置

### 首次使用 OpenAI API

如果你选择直接使用 OpenAI 的 API（而非通过 Azure），需要完成以下设置：

**1. 注册 OpenAI 账号**：

访问 OpenAI 官网 `https://platform.openai.com/` 注册账号。

**2. 获取 API 密钥**：

按照 OpenAI 快速入门指南操作：`https://platform.openai.com/docs/quickstart`

步骤包括：
- 登录 OpenAI 账号
- 进入 API Keys 页面
- 点击 "Create new secret key" 创建新的 API 密钥
- 复制并安全保存密钥（密钥只会显示一次）

**3. 配置密钥**：

将 API 密钥添加到 `.env` 文件中：

```env
OPENAI_API_KEY=sk-你的OpenAI密钥
```

## 故障排查

在环境设置过程中，你可能会遇到以下常见问题。下面列出了常见症状和对应的解决方法：

| 症状 | 解决方法 |
|------|----------|
| 容器构建卡住超过 10 分钟 | 点击 Codespaces 菜单 → 选择 **重新构建容器（Rebuild Container）** |
| 终端显示 `python: command not found` | 终端未正确连接。点击终端面板右上角的 **+** 号 → 选择 **bash** |
| OpenAI 返回 `401 Unauthorized` 错误 | `OPENAI_API_KEY` 配置错误或密钥已过期，请重新检查密钥值 |
| VS Code 显示"开发容器挂载中..." | 刷新浏览器标签页。Codespaces 有时会断开连接，刷新通常可以恢复 |
| Notebook 内核丢失 | 点击 Notebook 菜单 → **内核（Kernel）** → **选择内核（Select Kernel）** → **Python 3** |
| pip 安装包时权限不足 | 在命令前加 `--user` 参数：`pip install --user 包名`，或使用虚拟环境 |
| Git 推送时认证失败 | 确保你已配置 GitHub 认证（Personal Access Token 或 SSH 密钥） |
| Conda 环境创建失败 | 检查 `environment.yml` 文件格式是否正确，尝试逐个安装依赖 |
| API 调用超时 | 检查网络连接，确认 API 终端点 URL 是否正确，可能需要配置代理 |

## 社区与贡献

### 认识其他学习者

课程团队在官方 **AI 社区 Discord 服务器** 上开设了专门的频道，方便学习者互相交流和获取帮助。这是一个与志同道合的创业者、开发者、学生交流的好地方。

**加入方式**：访问 `https://aka.ms/genai-discord` 加入 Discord 服务器。

项目团队也会在该 Discord 服务器中提供帮助，解答课程相关的问题。

### 贡献代码

本课程是一个开源项目，欢迎所有形式的贡献：

- 发现错误或有改进建议：提交 Pull Request 到 `https://github.com/microsoft/generative-ai-for-beginners/pulls`
- 报告问题：创建 GitHub Issue 到 `https://github.com/microsoft/generative-ai-for-beginners/issues`

**贡献者许可协议（CLA）**：

大多数贡献需要你同意贡献者许可协议（CLA），声明你有权并授予使用你贡献内容的权限。提交 PR 时，CLA-bot 会自动判断你是否需要提交 CLA，并在 PR 上做相应标注。你只需按照机器人指示操作即可，在所有签署 CLA 的仓库中只需执行一次。

**翻译贡献特别说明**：

翻译本仓库内容时，请确保不要使用机器翻译。项目通过社区审查翻译质量，因此请仅对自己熟练掌握的语言参与翻译。

**行为准则**：

本项目采用微软开源行为准则。详情请参阅 `https://opensource.microsoft.com/codeofconduct/` 或通过邮件 opencode@microsoft.com 联系。

## 课程导航

完成环境设置后，你已经准备好开始学习之旅了。以下是完整的课程路径：

| 课次 | 主题 | 类型 |
|------|------|------|
| L00 | 课程设置与环境配置（本课） | 设置 |
| L01 | 生成式 AI 和大型语言模型简介 | Learn |
| L02 | 探索和比较不同的 LLM | Learn |
| L03 | 负责任地使用生成式 AI | Learn |
| L04 | 提示工程基础 | Learn |
| L05 | 高级提示技术 | Learn |
| L06 | 构建文本生成应用 | Build |
| L07 | 构建聊天应用 | Build |
| L08 | 构建搜索和向量数据库应用 | Build |
| L09 | 构建图像生成应用 | Build |
| L10 | 构建低代码 AI 应用 | Build |
| L11 | 使用函数调用集成外部应用 | Build |
| L12 | 设计 AI 应用的用户体验 | Learn |
| L13 | 保障生成式 AI 应用安全 | Learn |
| L14 | 生成式 AI 应用生命周期 | Learn |
| L15 | 检索增强生成（RAG）与向量数据库 | Build |
| L16 | 开源模型与 Hugging Face | Build |
| L17 | AI 代理 | Build |
| L18 | 微调大型语言模型 | Learn |
| L19 | 使用小型语言模型构建 | Learn |
| L20 | 使用 Mistral 模型构建 | Learn |
| L21 | 使用 Meta 模型构建 | Learn |

建议按顺序学习，因为后续课程会基于前面课程的知识。

## 知识检查

1. 运行课程代码最推荐的方式是什么？
   - 答案：GitHub Codespaces，因为它预配置了所有依赖，避免了本地环境冲突

2. API 密钥应该存储在哪里？
   - 答案：使用 Codespaces Secrets 或 `.env` 文件（不提交到 Git 仓库）

3. 课程包含多少节课？分别是什么类型？
   - 答案：共 21 节课，12 节 Learn（理念课）+ 9 节 Build（编程课）

4. 如果容器构建卡住了怎么办？
   - 答案：使用 Codespaces 的"重新构建容器"功能

## 扩展阅读

- [[90_Learn/courses/microsoft/microsoft_genai_for_beginners]] — 课程总览与章节映射
- [[AI入门/GenAI_L01_Intro_to_GenAI_and_LLMs]] — 第 1 课：生成式 AI 与 LLM 简介
- [[数学基础/AI_Development_Environment_Setup]] — AI 开发环境搭建深度指南
- [[数学基础/Python_for_AI_Basics]] — Python AI 编程基础
- [[AI入门/AI_Tools_Practical_Guide]] — AI 工具实践指南
