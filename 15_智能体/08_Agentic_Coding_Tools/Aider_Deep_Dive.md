---
title: "Aider: AI 代码编辑工具"
category: "15-agent-production-agentic-coding-tools"
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> **一句话理解**: Aider 是开源 AI 代码编辑 CLI——终端内直接编辑代码、Git 集成、多文件重构、快速迭代，程序员爱用的命令行 AI 助手。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Aider Deep Dive"
  - Aider_Deep_Dive
sources: []

---
# Aider: AI 代码编辑工具

> **一句话理解**: Aider 是开源 AI 代码编辑 CLI——终端内直接编辑代码、Git 集成、多文件重构、快速迭代，程序员爱用的命令行 AI 助手。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级用法](#5-高级用法)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Aider: AI 代码编辑工具
═══════════════════════════════════════════════════════════════════

定位: 开源命令行 AI 代码编辑工具，深度集成 Git 实现精准修改

核心理念:
───────────────────────────────────────────────────────────────────
• 终端优先: 纯命令行操作
• Git 原生: 自动 commit 修改
• 多文件: 支持跨文件重构
• 模型多样: 支持 GPT-4o/Claude/本地
• 上下文: 智能选择相关代码
• 开源: 完全免费
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **终端编辑** | CLI 操作，无需 IDE |
| **Git 集成** | 自动 commit/diff |
| **多文件** | 跨文件修改 |
| **心智图** | 理解代码关系 |
| **多模型** | OpenAI/Claude/本地 |
| **上下文** | 自动选择相关代码 |

### 1.3 支持模型

| 类别 | 模型 |
|------|------|
| **OpenAI** | GPT-4o/4-turbo/3.5 |
| **Anthropic** | Claude 3.5/3 |
| **开源** | Llama 3.1/Mixtral |
| **本地** | 通过 Ollama |

---

## 2. 核心概念

### 2.1 工作流程

```
Aider 工作流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Aider 工作流                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. 启动: aider <files>                                         │
│       │                                                          │
│       ▼                                                          │
│  2. 编辑请求: /edit 添加用户认证功能                              │
│       │                                                          │
│       ▼                                                          │
│  3. AI 分析:                                                      │
│       • 读取文件内容                                              │
│       • 理解代码结构                                              │
│       • 生成修改方案                                              │
│       │                                                          │
│       ▼                                                          │
│  4. 应用修改:                                                      │
│       • 编辑文件                                                  │
│       • Git add + commit                                         │
│       │                                                          │
│       ▼                                                          │
│  5. 验证: ask 是否正确                                            │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 命令系统

| 命令 | 说明 |
|------|------|
| `/add` | 添加文件到聊天 |
| `/drop` | 移除文件 |
| `/edit` | 编辑代码 |
| `/diff` | 查看修改 |
| `/commit` | 提交修改 |
| `/undo` | 撤销修改 |
| `/git` | 执行 git 命令 |
| `/ask` | 提问 |
| `/search` | 代码搜索 |
| `/map` | 显示代码地图 |

---

## 3. 架构设计

### 3.1 系统架构

```
Aider 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Aider 架构                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              CLI Interface                               │   │
│   │  • 命令解析                                             │   │
│   │  • 输出格式化                                          │   │
│   │  • Readline 交互                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Code Graph                                  │   │
│   │  • AST 解析                                            │   │
│   │  • 依赖分析                                            │   │
│   │  • 上下文选择                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              LLM Adapter                                 │   │
│   │  • OpenAI / Anthropic / 本地                           │   │
│   │  • Chat format                                         │   │
│   │  • Token 管理                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Git Integration                             │   │
│   │  • 自动 commit                                          │   │
│   │  • Diff 生成                                           │   │
│   │  • Undo 支持                                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 使用 pip
pip install aider

# 或使用 brew
brew install aider
```

### 4.2 配置

```bash
# 设置 API key
export OPENAI_API_KEY="sk-xxxx"
# 或
export ANTHROPIC_API_KEY="sk-ant-xxxx"

# 可选: 使用本地模型
export AIDER_MODEL=claude-3-5-sonnet
```

### 4.3 基本使用

```bash
# 启动 aider
aider

# 添加文件并编辑
aider app.py

# 多文件编辑
aider src/main.py src/utils.py

# 在 aider 内
/add src/app.py
/edit 添加路由功能
/diff
/commit
```

### 4.4 编辑示例

```
$ aider auth.py

Welcome to Aider. Ask me to edit code in auth.py, then use /commit to save.

添加登录函数:

/edit 添加一个 login 函数，要求用户名密码验证，成功返回 token

Aider: 正在编辑 auth.py...
已添加 login 函数:
```python
def login(username: str, password: str) -> str:
    user = db.get_user(username)
    if not user or not verify_password(password, user.password_hash):
        raise AuthError("Invalid credentials")
    return generate_token(user.id)
```

/commit -m "添加 login 函数"
[main 5e3f2a1] 添加 login 函数
```

---

## 5. 高级用法

### 5.1 多文件重构

```
$ aider src/models/user.py

添加用户模块，使用 repository 模式:

/edit 重构为 repository 模式:
- 添加 UserRepository 类
- 添加 UserService 类
- 解耦数据访问

Aider:
- 编辑 src/models/user.py
- 创建 src/repositories/user_repository.py
- 创建 src/services/user_service.py

影响文件:
- src/models/user.py
- src/repositories/user_repository.py
- src/services/user_service.py
- tests/test_user.py (更新测试)

/commit -m "重构为 repository 模式"
```

### 5.2 代码地图

```
$ aider src/

显示代码结构:

/map

src/
├── models/
│   ├── user.py
│   └── product.py
├── repositories/
│   ├── user_repository.py
│   └── product_repository.py
├── services/
│   ├── user_service.py
│   └── product_service.py
└── main.py

当前编辑: user.py
相关文件: user_repository.py, user_service.py, test_user.py
```

### 5.3 Git 操作

```bash
# 查看未提交的修改
/git diff

# 查看历史
/git log --oneline -10

# 切换分支
/git checkout feature-branch

# 强制撤销
/undo 3
```

---

## 6. 对比与选择

### 6.1 AI 编程工具对比

| 维度 | Aider | Claude Code | Cursor |
|------|-------|-------------|--------|
| **交互方式** | CLI | CLI | GUI |
| **多文件** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Git 集成** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **开源** | ⭐⭐⭐⭐⭐ | ❌ | ❌ |
| **跨平台** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 终端用户 | Aider |
| 快速原型 | Claude Code |
| 图形界面 | Cursor |
| 开源偏好 | Aider |

---

## 参考资源

- [Aider GitHub](https://github.com/paul-gauthier/aider)
- [Aider 文档](https://aider.chat/docs/)
- [Aider 教程](https://aider.chat/docs/quick-start.html)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## 相关链接

- [[15_智能体/08_Agentic_Coding_Tools/Agentic_Coding_Tools_Overview|Agentic Coding 工具概览]] — 工具全景对比
- [[15_智能体/08_Agentic_Coding_Tools/Claude_Code_Deep_Dive|Claude Code 深度解析]] — 同类 CLI 工具对比
- [[15_智能体/08_Agentic_Coding_Tools/Continue_Deep_Dive|Continue 深度解析]] — IDE 插件类工具对比
- [[15_智能体/08_Agentic_Coding_Tools/index|Agentic Coding 索引]] — 工具主题导览
- [[16_编程/index|编程索引]] — AI 编程主题导览
- [[18_行业应用/18_Code_Generation/Code_Generation_index|代码生成索引]] — 代码生成应用
