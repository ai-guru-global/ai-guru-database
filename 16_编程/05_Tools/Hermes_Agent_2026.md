---
title: Hermes Agent 2026年专业指南
category: 16-ai-coding-tools
tags: ["ai-coding", "code-generation", "cursor", "github-copilot", "ai-agents"]
summary: "> **一句话理解**: Hermes Agent是Nous Research推出的开源、多平台、多模型AI代理——它不只是一个CLI编码工具，而是一个跨终端、消息平台、浏览器、语音的全能型自主助手。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Hermes Agent 2026"
  - Hermes_Agent_2026
sources: []

---
# Hermes Agent 2026 年专业指南

> **一句话理解**: Hermes Agent 是 Nous Research 推出的开源、多平台、多模型 AI 代理——它不只是一个 CLI 编码工具，而是一个跨终端、消息平台、浏览器、语音的全能型自主助手。

---

## 1. 概述 (Overview)

### 什么是Hermes Agent?

```
Hermes Agent 定位:
├── 开源 (MIT License)
├── 多平台: CLI / Telegram / Discord / Slack / WhatsApp / Signal / Email
├── 多模型: 支持 17+ Provider，无锁定
├── 全能型代理: 编码 + 自动化 + 浏览器 + 语音 + 定时任务
└── 由 Nous Research (https://nousresearch.com) 构建

核心差异化:
├── 不绑定特定LLM — 支持自由切换Provider
├── Skills系统 — 按需加载知识文档，节省Token
├── 消息平台集成 — 从Telegram到Discord全覆盖
├── 语音模式 — 麦克风对话 + TTS语音回复
├── 定时任务 (Cron) — 自然语言设置自动化任务
├── 子代理委托 — 最多3个并行子代理
└── 浏览器自动化 — 云端/本地多种后端
```

### 安装与快速开始

```bash
# 一行安装 (Linux / macOS / WSL2)
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# 配置模型
hermes model

# 开始对话
hermes
```

### 支持的LLM Provider (17+)

| Provider | 类型 | 设置方式 |
|----------|------|----------|
| **Nous Portal** | 订阅制，零配置 | OAuth登录 |
| **OpenAI Codex** | ChatGPT OAuth | 设备码认证 |
| **Anthropic** | Claude模型 | API Key / Claude Code认证 |
| **OpenRouter** | 多模型路由 | API Key |
| **Z.AI (智谱)** | GLM系列 | `ZAI_API_KEY` |
| **Kimi / Moonshot** | 月之暗面模型 | `KIMI_API_KEY` |
| **MiniMax** | MiniMax国际/国内 | API Key |
| **Alibaba Cloud** | 通义千问 | `DASHSCOPE_API_KEY` |
| **Hugging Face** | 20+开源模型 | `HF_TOKEN` |
| **DeepSeek** | DeepSeek直连 | `DEEPSEEK_API_KEY` |
| **GitHub Copilot** | Copilot订阅 | OAuth |
| **Custom Endpoint** | VLLM/SGLang/Ollama | Base URL + API Key |

---

## 2. 核心特性深度解析

### 2.1 工具与工具集 (Tools & Toolsets)

```
内置工具类别:
├── Web: web_search, web_extract
├── 终端与文件: terminal, process, read_file, patch
├── 浏览器: browser_navigate, browser_snapshot, browser_vision
├── 媒体: vision_analyze, image_generate, text_to_speech
├── Agent编排: todo, clarify, execute_code, delegate_task
├── 记忆: memory, session_search
├── 自动化: cronjob, send_message
└── 集成: ha_* (Home Assistant), MCP, RL训练

按需启用:
hermes chat --toolsets "web,terminal,skills"
hermes tools  # 交互式配置
```

### 2.2 终端后端 (Terminal Backends)

| 后端 | 描述 | 适用场景 |
|------|------|----------|
| `local` | 本地执行 (默认) | 开发、可信任务 |
| `docker` | Docker 容器隔离 | 安全、可复现 |
| `ssh` | 远程服务器 | 沙箱、隔离 Agent 自身代码 |
| `singularity` | HPC 容器 | 集群计算 |
| `modal` | 云端 Serverless | 弹性扩展 |
| `daytona` | 云沙箱工作区 | 持久远程开发环境 |

```yaml
# ~/.hermes/config.yaml
terminal:
  backend: docker
  docker_image: python:3.11-slim
  container_cpu: 1
  container_memory: 5120
  container_disk: 51200
  container_persistent: true
```

### 2.3 Skills 系统

```
Skills = 按需加载的知识文档
├── 遵循渐进式披露模式，最小化Token使用
├── 兼容 agentskills.io 开放标准
├── 已安装的Skill自动成为斜杠命令
└── 支持搜索和安装社区Skills

安装Skills:
hermes skills search kubernetes
hermes skills search react --source skills-sh
hermes skills install openai/skills/k8s

启动时预加载:
hermes -s hermes-agent-dev,github-auth
```

### 2.4 持久化记忆 (Persistent Memory)

```
记忆系统:
├── MEMORY.md — 跨会话的项目和环境记忆
├── USER.md — 用户偏好和个人信息
├── 上下文文件自动发现:
│   ├── .hermes.md
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── SOUL.md
│   └── .cursorrules
├── 外部记忆Provider:
│   ├── Honcho
│   ├── Mem0
│   ├── RetainDB
│   └── ByteRover 等
└── @引用: 注入文件、文件夹、Git Diff、URL
```

### 2.5 自动化能力

```
定时任务 (Cron):
├── 自然语言设置: "每天早上9点检查Hacker News"
├── 支持标准Cron表达式
├── 可附加Skills、发送结果到任意平台
└── 支持暂停/恢复/编辑

子代理委托 (Delegation):
├── delegate_task 生成隔离子代理实例
├── 受限工具集 + 独立终端会话
├── 最多3个并发子代理
└── 并行工作流

代码执行:
├── execute_code 工具编写Python脚本
├── 可编程调用Hermes工具
├── 沙箱化RPC执行
└── 多步骤工作流压缩为单次LLM调用

后台会话:
/background 分析 /var/log 日志中的错误
├── 完全独立的Agent会话
├── 非阻塞 — 前台保持交互
└── 完成后结果面板显示
```

### 2.6 媒体与浏览器

```
语音模式:
├── CLI麦克风对话
├── TTS语音回复 (5种Provider)
├── Discord语音频道实时对话
└── 支持 Edge TTS (免费) / ElevenLabs / OpenAI TTS / MiniMax / NeuTTS

浏览器自动化:
├── Browserbase (云端)
├── Browser Use (云端)
├── 本地Chrome (CDP)
├── 本地Chromium
└── 导航、表单填写、信息提取

视觉与图像:
├── 剪贴板粘贴图片 (Alt+V)
├── 多模态视觉分析
├── FAL.ai FLUX 2 Pro图像生成
└── 自动2x超分辨率
```

### 2.7 集成生态

```
MCP集成:
├── stdio / HTTP传输
├── 访问GitHub、数据库、文件系统等外部工具
├── 每服务器工具过滤 + Sampling支持
└── 无需编写原生Hermes工具

API Server:
├── OpenAI兼容HTTP端点
├── 连接 Open WebUI / LobeChat / LibreChat
└── 任何支持OpenAI格式的前端

IDE集成 (ACP):
├── VS Code / Zed / JetBrains
├── 聊天、工具活动、文件Diff、终端命令
└── 编辑器内渲染

消息平台:
├── Telegram
├── Discord (含语音频道)
├── Slack
├── WhatsApp
├── Signal
├── Email
└── Home Assistant
```

---

## 3. CLI界面详解

### 状态栏

```
 ⚕ claude-sonnet-4-20250514 │ 12.4K/200K │ [██████░░░░] 6% │ $0.06 │ 15m
   ↑ 模型名称              ↑ Token用量   ↑ 上下文占用度     ↑ 费用  ↑ 时长
```

### 常用快捷键

| 快捷键 | 功能 |
|--------|------|
| `Enter` | 发送消息 |
| `Alt+Enter` / `Ctrl+J` | 多行输入 |
| `Alt+V` | 粘贴图片 |
| `Ctrl+C` | 中断Agent |
| `Ctrl+Z` | 挂起到后台 (`fg`恢复) |
| `Ctrl+B` | 开始/停止语音录制 |

### 常用命令

| 命令 | 功能 |
|------|------|
| `hermes` | 启动交互式会话 |
| `hermes -c` | 恢复上次会话 |
| `hermes -w` | Git Worktree隔离模式 |
| `/model` | 切换模型 |
| `/tools` | 列出可用工具 |
| `/skills browse` | 浏览Skills Hub |
| `/background <prompt>` | 后台运行任务 |
| `/voice on` | 启用语音模式 |
| `/personality pirate` | 切换人格 |
| `/rollback` | 回滚文件变更 |

---

## 4. 与其他 Coding CLI 工具对比

### 4.1 核心定位对比

```
工具定位光谱:

纯IDE集成 ←————————————————————————————→ 纯终端CLI
  Cursor          Windsurf    Claude Code    Hermes    Aider
   |                |            |            |          |
  IDE内置          IDE内置      终端原生      全平台     终端原生
  闭源             闭源         闭源         开源MIT    开源

> 各工具的完整市场格局分层和核心能力对比，请参阅 [AI编程助手全景报告](./AI_Coding_Assistants_2026.md)
```

### 4.2 功能矩阵对比

| 维度 | Hermes | Claude Code | Cursor | Windsurf | Copilot | Devin |
|------|--------|-------------|--------|----------|---------|-------|
| **开源** | MIT | 否 | 否 | 否 | 否 | 否 |
| **定价** | 免费 (自带 API) | $20/月 | $20/月 | $15/月 | $10/月 | $500/月 |
| **模型锁定** | 无 (17+ Provider) | Anthropic 仅 | 多模型 | 多模型 | OpenAI 仅 | 自有 |
| **CLI 终端** | TUI 完整 | 原生 | 无 | 无 | 有限 | Web |
| **IDE 集成** | ACP (VS Code 等) | 无 | 内置 IDE | 内置 IDE | 内置 IDE | 无 |
| **消息平台** | 7 个 (TG/Discord 等) | 无 | 无 | 无 | 无 | 无 |
| **浏览器自动化** | 4 种后端 | 无 | 无 | 无 | 无 | 内置 |
| **语音模式** | STT+TTS | 无 | 无 | 无 | 无 | 无 |
| **定时任务** | Cron 原生 | 无 | 无 | 无 | 无 | 无 |
| **子代理** | 最多 3 并行 | 无 | 无 | 无 | 无 | 内置 |
| **MCP 支持** | stdio+HTTP | stdio | 无 | 无 | 无 | 无 |
| **记忆系统** | 持久化+外部 Provider | 会话级 | 项目级 | 项目级 | 无 | 无 |
| **Skills 系统** | 有 (开放标准) | 无 | .cursorrules | 无 | 无 | 无 |
| **Git Checkpoints** | 自动快照+回滚 | 无 | 无 | 无 | 无 | 有 |
| **上下文压缩** | 自动摘要 | 手动 | 无 | 无 | 无 | 自动 |
| **插件系统** | Python 插件 | 无 | 无 | 无 | 无 | 无 |
| **API Server** | OpenAI 兼容 | 无 | 无 | 无 | 无 | 无 |
| **容器隔离** | Docker/SSH/Modal | 无 | 无 | 无 | 无 | 沙箱 |
| **RL 训练数据** | 批量生成 | 无 | 无 | 无 | 无 | 无 |
| **人格定制** | 15+预设+自定义 | 无 | 无 | 无 | 无 | 无 |

### 4.3 编码能力对比

| 编码场景 | Hermes | Claude Code | Cursor | Windsurf | Copilot |
|----------|--------|-------------|--------|----------|---------|
| **代码补全** | 终端工具 | 无 (对话式) | 72% 接受率 | 65% 接受率 | 65% 接受率 |
| **多文件编辑** | patch 工具 | 优秀 | Composer | Cascade | 有限 |
| **终端执行** | 6 种后端 | 原生 Bash | 集成终端 | 集成终端 | 无 |
| **代码搜索** | 全局搜索+grep | ripgrep | 项目索引 | Riptide 索引 | 有限 |
| **项目理解** | 上下文文件+Skills | 全面分析 | 项目索引 | 项目索引 | 有限 |
| **调试辅助** | 终端执行+日志 | 运行+分析 | 集成调试 | 集成调试 | 解释代码 |

### 4.4 适用场景分析

```
Hermes 最适合:
├── 需要多平台接入的团队 (Telegram/Discord工作流)
├── 需要自动化定时任务 (每日报告、监控)
├── 需要浏览器自动化 (爬取、测试)
├── 希望模型自由切换、不被锁定
├── 需要语音交互 (免提编码、Discord语音)
├── 开源需求 / 安全审计
└── 需要RL训练数据生成

Claude Code 最适合:
├── 纯终端工作流
├── 复杂代码库深度理解
├── 单一Anthropic模型即可满足
└── 不需要消息平台集成

Cursor 最适合:
├── IDE重度用户
├── 全栈开发
├── 大型代码库重构
└── 最高代码补全接受率需求

Windsurf 最适合:
├── 预算有限
├── 快速原型开发
└── 性价比优先

Copilot 最适合:
├── 企业合规需求
├── GitHub生态深度绑定
└── 团队标准化工具
```

---

## 5. 最佳实践

### 5.1 配置优化

```yaml
# ~/.hermes/config.yaml
terminal:
  backend: docker
  docker_image: python:3.11-slim
  container_persistent: true

compression:
  enabled: true
  threshold: 0.50

display:
  busy_input_mode: "queue"
  tool_preview_length: 80

# Provider路由优化
provider_routing:
  sort_by: cost
  whitelist:
    - anthropic
    - openrouter
```

### 5.2 项目配置

```markdown
<!-- .hermes.md 项目配置文件 -->
# 项目说明
- 技术栈: Python 3.12 + FastAPI + PostgreSQL
- 测试: pytest
- 部署: Docker Compose

# 编码规范
- 使用 type hints
- 函数最大长度 50 行
- 测试覆盖率 > 80%
```

### 5.3 Skills推荐

```bash
# 编码相关
hermes skills install github-auth
hermes skills install github-pr-workflow

# 运维相关
hermes skills search kubernetes
hermes skills search docker

# 前端相关
hermes skills search react
hermes skills search tailwind
```

---

## 6. 架构与技术亮点

```
Hermes Agent 架构:
├── 核心引擎
│   ├── 多Provider路由层 (Provider Routing)
│   ├── 上下文管理器 (自动压缩 + 检索)
│   ├── 工具注册表 (动态加载)
│   └── 会话管理 (SQLite持久化)
│
├── 执行层
│   ├── 终端后端 (6种)
│   ├── 浏览器后端 (4种)
│   ├── 语音引擎 (STT + TTS)
│   └── 子代理管理器
│
├── 平台层
│   ├── CLI (TUI)
│   ├── 消息网关 (7平台)
│   ├── API Server (OpenAI兼容)
│   ├── IDE集成 (ACP)
│   └── 插件系统
│
└── 持久化
    ├── 记忆系统 (MEMORY.md + 外部Provider)
    ├── 会话存储 (SQLite)
    ├── Skills库
    └── 检查点 (自动快照)
```

---

## 7. 安全特性

| 特性 | 描述 |
|------|------|
| 容器安全 | 只读根文件系统、丢弃所有Linux能力、禁止提权 |
| 命名空间隔离 | 完整的namespace隔离 |
| 进程限制 | PID限制 (256进程) |
| 凭证池 | 多Key自动轮换，限流时切换 |
| Fallback Provider | 主模型出错自动切换备用 |
| SSH后端 | Agent无法修改自身代码 |
| Git Checkpoints | 文件变更前自动快照，支持回滚 |

---

## 8. 参考资源

### 官方资源
- [Hermes Agent 文档](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
- [GitHub 仓库](https://github.com/NousResearch/hermes-agent)
- [Skills Hub](https://agentskills.io)
- [Discord 社区](https://discord.gg/NousResearch)

### 对比工具
- [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)
- [Cursor](https://cursor.sh/)
- [Windsurf](https://codeium.com/windsurf)
- [GitHub Copilot](https://docs.github.com/en/copilot)
- [Aider](https://aider.chat/)

---

*Last updated: 2026-04-11*

## Related

- [[16_编程/02_Theory/AI_Coding_Theory]] — AI辅助编程理论基础 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[16_编程/05_Tools/CodeBuddy_Guide]] — CodeBuddy / WorkBuddy 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[16_编程/05_Tools/Comate_Guide]] — Comate 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[16_编程/05_Tools/Coze_Guide]] — Coze 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
