# 接入 Agent 工具

*本文介绍如何将 DeepSeek 模型接入到 Claude Code、OpenCode、OpenClaw 等主流 AI 工具中。*

---

**Source:** https://api-docs.deepseek.com/zh-cn/guides/coding_agents

# 接入 Agent 工具

本文介绍如何将 DeepSeek 模型接入到 Claude Code、OpenCode、OpenClaw 等主流 AI 工具中。

## 接入 Claude Code ​

Claude Code 是一个运行在终端内的 AI 编程助手。

#### 1. 安装 Claude Code ​

- 安装 [Node.js](https://nodejs.org/zh-cn/download/) 18+。
- Windows 用户需安装 [Git for Windows](https://git-scm.com/download/win)。
- 在命令行界面，执行以下命令安装 Claude Code：

```
npm install -g @anthropic-ai/claude-code
```

- 安装结束后，执行以下命令，若显示版本号则安装成功：

```
claude --version
```

#### 2. 配置环境变量 ​

Linux / Mac 用户执行以下命令配置 [DeepSeek Anthropic API](https://api.deepseek.com/anthropic) 环境变量，其中 API Key 在 [DeepSeek Platform](https://platform.deepseek.com/api_keys) 获取：

```
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropicexport ANTHROPIC_AUTH_TOKEN=<你的 DeepSeek API Key>export ANTHROPIC_MODEL=deepseek-v4-pro[1m]export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m]export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m]export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flashexport CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flashexport CLAUDE_CODE_EFFORT_LEVEL=max
```

Windows 用户执行：

```
$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"$env:ANTHROPIC_AUTH_TOKEN="<你的 DeepSeek API Key>"$env:ANTHROPIC_MODEL="deepseek-v4-pro[1m]"$env:ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro[1m]"$env:ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro[1m]"$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"$env:CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"$env:CLAUDE_CODE_EFFORT_LEVEL="max"
```

#### 3. 进入项目目录，执行 claude 命令，即可开始使用了。 ​

```
cd /path/to/my-projectclaude
```

---

## 接入 OpenCode ​

OpenCode 是一个开源 AI 编程助手，提供终端、网页等运行形式。

#### 1. 安装 OpenCode ​

前往官方下载页面安装或升级：[OpenCode 下载](https://opencode.ai/zh/download)

为避免兼容性问题，强烈建议您升级为 OpenCode 为最新版本，确保版本号 >= v1.14.24。

#### 2. 运行与配置 ​

- 执行 `opencode` 命令
- 输入框中输入 `/connect`，然后输入 `deepseek` 并选择供应商
- 填入 [DeepSeek API Key](https://platform.deepseek.com/api_keys)
- 选择 DeepSeek-V4-Pro 模型

---

## 接入 OpenClaw ​

OpenClaw 是一个开源的个人 AI 助手，可以接入飞书、微信等常用聊天工具，可以通过 Skill 扩展能力。

#### 1. 安装 OpenClaw ​

Linux / Mac 用户执行以下命令，从 [OpenClaw 安装脚本](https://openclaw.ai/install.ps1) 安装：

```
curl -fsSL https://openclaw.ai/install.sh | bash
```

Windows 用户执行以下命令，从 [OpenClaw 安装脚本](https://openclaw.ai/install.ps1) 安装：

```
iwr -useb https://openclaw.ai/install.ps1 | iex
```

#### 2. 配置 OpenClaw 中的默认模型 ​

首次安装完成后，会自动进入 setup（配置）阶段；已经安装过 OpenClaw 的用户可以通过 `openclaw onboard --install-daemon` 命令进入配置阶段。

- 遇到提示：`I understand this is personal-by-default and shared/multi-user use requires lock-down. Continue?` 请选择 **Yes**。
- 遇到提示：`Setup mode` 推荐选择 **QuickStart**。
- 遇到提示：`Model/auth provider` 请选择 **DeepSeek**。
- 遇到提示：`Enter DeepSeek API key` 请填入你的 [DeepSeek API Key](https://platform.deepseek.com/api_keys)。
- 遇到提示：`Default model` 请将光标指向 **Enter model**，填写模型名称（`deepseek-v4-pro` 或 `deepseek-v4-flash`）。
- 后续的其余配置（消息频道、Skill 等）请根据需求配置，新手可以先选择 **Skip for now**。

#### 3. 开始使用 ​

打开 Web UI，在 Chat 页面进行交互：

```
openclaw dashboard
```

在终端中打开 TUI：

```
openclaw tui
```

在终端中与 Openclaw 对话：

```
openclaw terminal
```
