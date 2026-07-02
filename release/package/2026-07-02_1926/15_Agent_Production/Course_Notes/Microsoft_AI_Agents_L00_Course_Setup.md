---
title: "L00 课程环境设置：Microsoft AI Agents for Beginners"
category: "15-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - course-setup
  - azure-ai-foundry
  - microsoft-agent-framework
sources:
  - "_raw/github-sources/ai-agents-for-beginners/00-course-setup/README.md"
summary: "Microsoft AI Agents 课程第0课：Python 3.12+ / .NET 10+ / Azure CLI 环境、Microsoft Foundry 项目配置、AzureCliCredential 无密钥认证与按课节扩展变量。"
provenance:
  extracted: 0.92
  inferred: 0.06
  ambiguous: 0.02
base_confidence: 0.88
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: supporting
created: 2026-06-15
updated: 2026-06-15
aliases:
  - "Microsoft Ai Agents L00 Course Setup"
  - "Microsoft AI Agents L00 Course Setup"
  - Microsoft_AI_Agents_L00_Course_Setup

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# L00 课程环境设置：Microsoft AI Agents for Beginners

> 来源：[Microsoft AI Agents for Beginners / 00-course-setup](https://github.com/microsoft/ai-agents-for-beginners/tree/main/00-course-setup)

## 学习目标

完成本课后，你将能够：

- 准备好运行本课程所有代码示例的本地或 Codespaces 环境
- 创建 Microsoft Foundry 项目并部署模型
- 使用 `AzureCliCredential` 实现无 API Key 的安全认证

---

## 基础运行环境

| 组件 | 要求 | 备注 |
|------|------|------|
| **Python** | 3.12+ | 创建 venv 时显式指定 `python3.12` 避免版本漂移 |
| **.NET** | 10 SDK+ | 仅为运行 .NET 示例所需 |
| **Azure CLI** | 最新版 | 认证入口，`az login` 完成身份获取 |
| **Azure 订阅** | 有效订阅 | 用于 Foundry 与 Azure AI Agent Service |
| **Foundry 项目** | 已部署模型（如 `gpt-4o`） | 提供推理端点 |

所有 Python 示例统一命名为 `*-python-agent-framework.ipynb`，依赖根目录 `requirements.txt`。建议在虚拟环境中安装：

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## 仓库克隆策略（关键技巧）

完整仓库含翻译与历史约 3 GB。课程推荐三种"瘦身克隆"方式：

| 方式 | 命令 | 适用场景 |
|------|------|----------|
| **浅克隆** | `git clone --depth 1 <fork-url>` | 只取最新提交，节省历史 |
| **稀疏克隆** | `git clone --depth 1 --filter=blob:none --sparse <url>` + `git sparse-checkout set 00-course-setup 01-intro-to-ai-agents` | 只下载指定 lesson 文件夹 |
| **Codespaces** | 在 GitHub Codespace 内部再执行上述命令 | 完全免本地下载 |

如不再需要 git 功能，可执行 `rm -rf .git` 释放空间（**不可逆**，会丢失所有提交/历史）。

---

## Microsoft Foundry 配置四步走

### Step 1 — 创建 Hub 与 Project

1. 登录 [ai.azure.com](https://ai.azure.com)
2. 新建或复用 **Hub**
3. 在 Hub 下创建 **Project**
4. 从 *Models + Endpoints → Deploy model* 部署一个模型（推荐 `gpt-4o`）

### Step 2 — 取两个关键值

| 变量 | 获取位置 |
|------|----------|
| `AZURE_AI_PROJECT_ENDPOINT` | Project → Overview 页面的 endpoint URL |
| `AZURE_AI_MODEL_DEPLOYMENT_NAME` | Models + Endpoints → 部署的模型 deployment name |

### Step 3 — `az login` 完成认证

```bash
az login
# 远程/Codespaces 无浏览器时：
az login --use-device-code
az account show   # 验证已登录
```

**核心设计**：notebook 使用 `AzureCliCredential`（来自 `azure-identity`）——Azure CLI 会话即提供凭据，**无需在 `.env` 中保存任何 API Key**。这是 Microsoft 推荐的 [keyless 连接最佳实践](https://learn.microsoft.com/azure/developer/ai/keyless-connections)。

### Step 4 — `.env` 文件

```bash
cp .env.example .env
```

最小可用 `.env` 只需两条变量：

```env
AZURE_AI_PROJECT_ENDPOINT=https://<your-project>.services.ai.azure.com/api/projects/<id>
AZURE_AI_MODEL_DEPLOYMENT_NAME=gpt-4o
```

---

## 按课节扩展的环境变量

不同 lesson 可能使用不同后端，按需追加：

| Lesson | 追加变量 | 用途 |
|--------|----------|------|
| **L05 Agentic RAG** | `AZURE_SEARCH_SERVICE_ENDPOINT`、`AZURE_SEARCH_API_KEY` | Azure AI Search 检索 |
| **L06 / L08** | `GITHUB_TOKEN`、`GITHUB_ENDPOINT`、`GITHUB_MODEL_ID` | GitHub Models 替代 Foundry |
| **L08 Bing Grounding** | `BING_CONNECTION_ID` | 条件工作流中的事实接地 |
| **可选 MiniMax** | `MINIMAX_API_KEY`、`MINIMAX_BASE_URL`、`MINIMAX_MODEL_ID` | OpenAI 兼容长上下文（204K）替代方案 |

---

## 常见坑：macOS SSL 证书

macOS 上首次运行可能出现 `ssl.SSLCertVerificationError`。三种解法（推荐 → 兜底）：

1. **运行 Python 自带的 Install Certificates 脚本**：`/Applications/Python\ 3.XX/Install\ Certificates.command`
2. **`pip install truststore`** + 在脚本顶部：
   ```python
   import truststore
   truststore.inject_into_ssl()
   ```
3. **(仅开发环境临时用)** 在 `ChatCompletionsClient` 中传 `connection_verify=False`——⚠️ 降低安全性，禁止用于生产

---

## 关联阅读

- [[90_Learn/courses/microsoft/microsoft_ai_agents_for_beginners]] — 课程总览与课表映射
- [[15_Agent_Production/Course_Notes/Microsoft_AI_Agents_L01_Intro]] — 下一课：AI Agent 简介
- [[15_Agent_Production/Course_Notes/Microsoft_AI_Agents_L02_Frameworks]] — MAF 与 Azure AI Agent Service 框架选型
- [[15_Agent_Production/Agent_Frameworks/README]] — 主流 Agent 框架概览
- [[12_Architecture_Infrastructure/Alibaba_Cloud_AI_Stack_Deep_Dive]] — 类比：国内厂商的 AI 集成栈
