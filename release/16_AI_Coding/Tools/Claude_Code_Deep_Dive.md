---
title: "Claude Code 深度解析：CLI、SDK、IDE 与自动化工作流"
tags: [claude, anthropic, ai-coding, claude-code, agent, sdk]
source: yeasy/claude_guide
created: 2026-06-16
tier: peripheral
aliases:
  - "Claude Code Deep Dive"
  - Claude_Code_Deep_Dive

---
# Claude Code 深度解析：CLI、SDK、IDE 与自动化工作流

> 本页面提炼自《Claude 技术指南》第七章，覆盖 Claude Code 的安装运维、SDK 集成、IDE 工作流、自主编码实践、高阶特性、Routines 和 Cowork。

---

## 一、Claude Code 概述

Claude Code 是 Anthropic 推出的具有 **Agentic Capabilities** 的终端编程助手——可以直接读取文件系统、运行终端命令、自动提交 Git commit。它不仅是 API 包装器，而是一个完整的自主编程系统。

**核心能力矩阵**：

| 角色 | 能力 | 适用场景 |
|------|------|---------|
| **Polyglot Coder** | 精通 Python, TS, Go, Rust 等 | 新项目、遗留代码维护 |
| **Refactoring Expert** | 理解依赖关系，执行重构 | 代码坏味道清理、架构升级 |
| **Debugger** | 根据 Traceback 精准定位 Bug | 线上故障排查 |
| **Quality Engineer** | 编写测试，生成用例 | TDD、回归测试 |
| **Tech Writer** | Docstring、API 文档 | 文档补全 |

---

## 二、CLI 入门与基础运维

### 2.1 安装与认证

```bash
# 推荐：原生安装器（macOS/Linux/WSL）
curl -fsSL https://claude.ai/install.sh | bash

# 或 Homebrew
brew install --cask claude-code

# 兼容路径：npm
npm install -g @anthropic-ai/claude-code
```

认证需要 Pro、Max、Team、Enterprise 或 Console 账号。脚本和 CI 场景使用长期 token：

```bash
claude setup-token
```

### 2.2 运行模式

| 模式 | 用途 | 典型场景 |
|------|------|---------|
| **TUI 交互** | 终端富文本界面 | 日常开发 |
| **Headless** | 非交互式，输出文本或 JSON | CI/CD 流水线 |
| **Bridge** | 外部程序远程接管 | 跨端协作 |
| **SDK** | 程序化调用 | 应用集成 |
| **IDE 插件** | 编辑器集成 | IDE 内编码 |

### 2.3 核心命令

```bash
# 交互模式
claude

# 单次任务
claude "generate a commit message for the current changes"

# Unix 管道
tail -f app.log | claude -p "Slack me if you see any anomalies"
git diff main --name-only | claude -p "review these changed files for security issues"
```

### 2.4 权限模式

| 模式 | 适用场景 | 关键边界 |
|------|---------|---------|
| `default` | 日常开发 | 需用户确认写入 |
| `acceptEdits` | 连续编辑 | 文件编辑自动批准 |
| `plan` | 先审方案再动手 | 高风险重构 |
| `auto` | 自动执行 | 依赖分类器判断 |
| `dontAsk` | CI 脚本 | 未预批准的操作自动拒绝 |
| `bypassPermissions` | 容器/VM 沙箱 | 跳过所有确认，仅限隔离环境 |

---

## 三、CLAUDE.md 项目记忆系统

### 3.1 文件层级

| 位置 | 作用域 | 用途 |
|------|--------|------|
| `~/.claude/CLAUDE.md` | 用户级 | 个人偏好、通用习惯 |
| 项目根目录 `CLAUDE.md` | 项目级 | 架构、命令、规范 |
| `CLAUDE.local.md` | 本地覆盖 | 不提交的本机配置 |
| `.claude/rules/*.md` | 项目规则 | 按路径/文件类型组织 |

### 3.2 最佳实践

**自动记忆与出错即学**：

```text
# 每次 Claude 犯错时追加一句
Update CLAUDE.md so you do not repeat this.
```

Claude 会自己把经验提炼成规则。几周后回看 CLAUDE.md，能直接看到团队踩过的坑被沉淀。

**筛选原则**："如果删除这一行，Claude 还会不会再犯这个错？" 答案是会，就留下；不会，就删除。CLAUDE.md 不该比一屏内容更长。

**上下文喂养**：Reference，不要 Describe

| 反模式 | 推荐做法 |
|--------|---------|
| "看看 auth 模块" | `@src/auth/login.py` |
| 粘贴错误日志 | `cat error.log \| claude` |
| "我们项目用 FastAPI" | 写进 `CLAUDE.md` |

### 3.3 @import 导入

```markdown
@docs/coding-standards.md
@.claude/shared-rules.md
```

支持递归导入，最大深度 4 跳。

---

## 四、SDK 集成

### 4.1 CLI vs SDK

| 维度 | CLI | SDK |
|------|-----|-----|
| 使用方式 | 终端交互，人在回路 | 程序化调用，可全自动 |
| 适用场景 | 日常开发辅助 | CI/CD、IDE 插件、自动化平台 |
| 输出控制 | 实时输出到终端 | 返回结构化对象 |
| 并发能力 | 单任务 | 可并行多实例 |

### 4.2 安装

```bash
# Python（注意：用 claude-agent-sdk，非旧版 claude-code-sdk）
pip install claude-agent-sdk

# TypeScript
npm install @anthropic-ai/claude-agent-sdk
```

### 4.3 Python SDK 示例

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for event in query(
        prompt="将项目中所有的 var 声明改为 const 或 let",
        options=ClaudeAgentOptions(
            model="claude-sonnet-4-6",
            allowed_tools=["Read", "Edit", "Bash"],
            permission_mode="dontAsk",
            cwd="/path/to/project",
            max_turns=20
        ),
    ):
        print({"type": type(event).__name__})

asyncio.run(main())
```

### 4.4 权限控制

`allowed_tools` 是自动批准列表，不是工具可见性白名单。遵循最小权限原则：

| 工具 | 风险等级 |
|------|---------|
| `Read` / `Glob` / `Grep` | 低 |
| `Edit` / `Write` | 中 |
| `Bash` | 高 |

### 4.5 企业级集成场景

- **CI/CD 自动审查**：GitHub Actions 中集成，自动审查每个 PR
- **IDE 插件后端**：VS Code 扩展"一键修复"
- **批量代码迁移**：遍历目录逐文件处理（如 Python 2 → 3）

---

## 五、IDE 集成与工作流

### 5.1 官方集成

| 编辑器 | 集成方式 | 核心功能 |
|--------|---------|---------|
| **VS Code** | 官方扩展 | 内联 Diff、终端集成、代码操作 |
| **JetBrains** | 官方插件 | IntelliJ、PyCharm 等全系列 |
| **Cursor** | 兼容 VS Code 扩展 | Composer、Tab 补全属 Cursor 自身能力 |

### 5.2 Zed + 终端分屏模式

Zed 占屏幕一半，终端运行 Claude Code 占另一半。配合 Zed 500ms 自动保存，实现类 Google Docs 的实时协作体验：

```json
{
  "autosave": {
    "after_delay": { "milliseconds": 500 }
  }
}
```

### 5.3 TDD 2.0 工作流

1. **Human**：创建空测试文件，写下函数名和注释
2. **Claude**：自动生成测试代码 + 实现代码
3. **Claude**：自动运行测试，修复至通过
4. **Human**：审查 Diff，提交

---

## 六、自主编码实践

### 6.1 全栈功能实现

Claude Agent 执行流：侦察（读取技术栈） → 后端改动 → 前端改动 → 验证（运行测试、自动修复）

### 6.2 遗留代码大规模重构

按依赖顺序处理，先底层后上层。自动处理 str/bytes 编码、导入路径变化等兼容问题。

### 6.3 从零构建测试套件

遍历路由文件 → 创建 conftest.py → 生成测试 → 运行修复（如发现需要 Token，自动添加认证 fixture）

### 6.4 成功要素

- **显性上下文**：不要让 Agent 猜，直接喂 Schema 和文件
- **增量反馈**：不要一次生成整个系统，分步实现
- **即时审查**：Trust, but Verify。永远不在不看 Diff 的情况下 commit

---

## 七、高阶特性

### 7.1 多端无缝衔接

- **Desktop App**：多任务视图、后台执行、实时日志
- **Web 版**（`claude.ai/code`）：远程下发任务，云端沙箱执行
- **Slack 集成**：@Claude 发截图 → 自动分析 → 创建修复 PR

### 7.2 跨端会话

| 命令 | 用途 |
|------|------|
| `/desktop` | 在桌面应用中继续 |
| `/remote-control` | 从 claude.ai 远程控制 CLI 会话 |
| `/remote-env` | 配置 Web 端默认远程环境 |

### 7.3 plan.md 驱动开发

核心理念："80% 规划 + 20% 执行"。计划文件是**跨会话的持久化检查点**——窗口关闭或上下文膨胀后，指向 plan.md 即可从断点继续。

### 7.4 并行会话

高效用户同时运行 **4-6 个 Claude Code 会话**，每个处理不同任务。

### 7.5 语音驱动开发

转录不需完美——Claude Code 理解上下文，能猜出麦克风听错了什么。配合自动保存实现"说话即编程"。

---

## 八、Hooks 系统

### 8.1 事件驱动配置

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/check-safe-bash.sh"
      }]
    }],
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/run-tests-async.sh",
        "async": true,
        "timeout": 300
      }]
    }],
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "afplay /System/Library/Sounds/Blow.aiff"
      }]
    }]
  }
}
```

**常见事件**：`SessionStart`、`UserPromptSubmit`、`PreToolUse`、`PostToolUse`、`Notification`、`Stop`、`SubagentStop`

### 8.2 JSON 反向影响 Claude

Hook 不只能拦截，还能**改写工具入参、自动放行、注入上下文**。

**关键**：事件相关字段必须包在 `hookSpecificOutput` 里，否则被静默忽略。

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "只读命令"
  }
}
```

| 事件 | 可返回字段 | 作用 |
|------|-----------|------|
| `PreToolUse` | `permissionDecision` | 不弹窗直接放行/拒绝 |
| `PreToolUse` | `updatedInput` | 执行前改写工具入参 |
| `SessionStart` | `additionalContext` | 向会话注入上下文 |
| `PostToolUse` | `updatedToolOutput` | 改写 Claude 看到的工具返回 |

### 8.3 进阶配置

- **`asyncRewake: true`**：后台异步执行，退出码 2 时唤醒模型（事后提醒纠偏）
- **`shell`**：指定 `bash` 或 `powershell`

---

## 九、本地自动化原语

### 9.1 `/goal`：目标驱动多回合循环

```bash
/goal all tests in test/auth pass and lint step is clean
```

设计原则：**可验证**（Claude 能自己检查）、**确定性**（"测试通过"而非"代码更好"）、**绑定命令或文件状态**。

### 9.2 `/loop`：间隔或自定步调重复

```bash
/loop 5m check if the deploy finished
```

### 9.3 `/batch`：扇出到独立 worktree 并行执行

```bash
/batch migrate src/ from Solid to React
```

自动拆解成 5-30 个独立单元，每个在独立 git worktree 中运行。

### 9.4 `/branch`：分叉当前对话

```bash
/branch try-redis-instead
```

### 9.5 夜间自动化三件套

```bash
$ claude --permission-mode auto
> /goal all tests pass and lint is clean
> <离开半小时>
```

`/goal` + Auto 模式 + Stop hook = 完整的自动化工作流。

### 9.6 辅助命令

| 命令 | 用途 |
|------|------|
| `/insights` | 分析会话，给出项目摩擦点报告 |
| `/btw <question>` | 边角问题，不进入对话历史 |
| `/rewind` | 回滚对话和/或代码到检查点 |
| `/compact [instructions]` | 带提示的有损压缩 |

---

## 十、Memory 与长会话治理

### 10.1 Memory 系统容量阈值

每次会话开始时，只加载 `MEMORY.md` 的**前 200 行或前 25 KB**（以先到为准）。这是**加载阈值**而非截断——超出部分不删除，只是不自动进上下文。

**最佳实践**：
- `MEMORY.md` 保持精简如目录索引
- 长内容拆进主题文件（`debugging.md`、`patterns.md`）
- 必须每轮在场的规则写进 `CLAUDE.md`（整文件加载，不受限制）

### 10.2 7 层递进式记忆架构

| 层 | 名称 | 职责 |
|----|------|------|
| 1 | 工具结果存储 | 超过阈值持久化到磁盘，仅留 ~2KB 预览 |
| 2 | 微型压缩 | 时间清理 + 缓存微压缩 + API 级管理 |
| 3 | 会话记忆 | 结构化笔记（目标、状态、学习），零额外 API 调用 |
| 4 | 完整压缩 | 紧急机制，分支 Agent 生成摘要 |
| 5 | 自动记忆提取 | 任务结束提取到 MEMORY.md |
| 6 | 梦想机制 | 跨会话记忆整合（研究预览） |
| 7 | 跨 Agent 通信 | 分支 Agent，Haiku 生成进度快照 |

### 10.3 沙箱化

两个正交维度确保安全：
1. **文件系统隔离**：限制可访问目录（OS 内核强制）
2. **网络隔离**：代理服务器维护允许列表

**实现**：Linux 用 `bubblewrap`，macOS 用 `seatbelt`。

---

## 十一、内部架构揭秘

> 基于社区对 Claude Code 源代码的逆向分析（HitCC 项目，CC BY 4.0）。

### 11.1 5 层架构

```
Entry Layer        → 入口路由（REPL、SDK、HTTP Bridge）
Command Layer      → 命令解析、Slash 命令处理
Core Engine        → 对话管理、状态机、事件循环
Tools & Services   → 文件操作、终端执行、Git、MCP
Infrastructure     → 存储、缓存、认证、日志
```

### 11.2 QueryEngine

1,295 行的核心类管理整个会话生命周期：消息归一化 → 令牌预算管理 → 对话流控制 → 缓存整合。

### 11.3 系统提示词缓存策略

```
System Prompt = Base（~13,500 tokens） + Dynamic Boundary + Dynamic（~1,200 tokens）
```

Base 部分缓存命中，仅 Dynamic 部分每次更新。减少缓存写入成本 **75%**。

### 11.4 推测执行引擎

等待 API 响应时预执行可能的下一步操作：
- 写入操作重定向到 overlay 文件系统
- Bash 命令禁止推测执行（不可逆副作用）
- 用户确认 → 合并 overlay；拒绝 → 丢弃

### 11.5 隐藏实验特性

| 特性 | 说明 |
|------|------|
| **KAIROS** | 持久后台助手，维护日志，15 秒阻塞预算 |
| **BUDDY** | 虚拟宠物伴侣，18 物种 5 级稀有度 |
| **ULTRAPLAN** | 远程规划会话，最多 30 分钟思考 |

---

## 十二、Routines 自动化任务

Routines 是 Claude Code 的云端自动化能力扩展（2026-04-14 研究预览）。

### 12.1 三种触发模式

| 模式 | 触发方式 | 典型场景 |
|------|---------|---------|
| **Scheduled** | Cron 表达式 | 每晚扫描 Backlog |
| **API** | HTTP POST | 告警关联分析、CI 回调 |
| **Webhook** | GitHub 事件 | PR 自动审查、Release 摘要 |

### 12.2 本地 vs 云端

| 维度 | 本地 `/goal` + `/loop` | 云端 Routines |
|------|----------------------|--------------|
| 触发 | 当前会话内驱动 | Cron / HTTP / Webhook |
| 持续 | 终端关闭即结束 | 笔记本关机仍继续 |
| 适合 | "离开半小时跑完测试" | "每晚扫积压、PR 自动审" |

### 12.3 最佳实践

- 明确定义"完成"标准，避免无限循环
- 确保幂等性（多次执行无副作用）
- 结果推送到 Slack/GitHub
- 对连续失败设置告警

---

## 十三、Cowork：面向全员的 Agent 工具

Cowork 将 Agent 能力扩展到非程序员（2026-04-09 GA，macOS/Windows Desktop）。

### 13.1 Claude Code vs Cowork

| 维度 | Claude Code | Cowork |
|------|-----------|--------|
| 目标用户 | 开发者 | 所有知识工作者 |
| 界面 | 终端 CLI / IDE | 桌面应用 GUI |
| 编程要求 | 需要 | 不需要 |
| 文件操作 | 代码仓库 | 任意文件夹 |

### 13.2 核心能力

- **智能文件操作**：批量整理、截图生成报表、跨文件查找替换
- **Skills 集成**：创建 Word、PPT、PDF 等专业产出
- **Connectors**：安全连接 Slack、Google Drive、Salesforce 等
- **全局/文件夹指令**：跨会话偏好和上下文提示

### 13.3 企业版特性

角色与权限管理、团队级成本控制、数据治理与 DLP、审计日志、SCIM 集成。

---

## 十四、高效工作流配置模板

### 14.1 受控权限配置

```json
{
  "permissions": {
    "allow": ["Read", "Write", "Edit", "Glob", "Grep",
              "Bash(git status:*)", "Bash(npm test:*)"],
    "deny": ["Read(.env*)", "Read(**/secrets/**)", "Bash(rm -rf:*)"],
    "defaultMode": "acceptEdits",
    "disableBypassPermissionsMode": "disable"
  },
  "cleanupPeriodDays": 30
}
```

### 14.2 Auto 模式分类器定制

```json
{
  "autoMode": {
    "allow": ["$defaults", "可以自动运行本地测试、lint 和只读检查"],
    "soft_deny": ["$defaults", "涉及 git push、删除文件时要求确认"],
    "environment": [
      "这是本地开发机，没有生产数据库访问权限",
      "测试套件可反复安全运行"
    ]
  }
}
```

---

## 相关页面

- [[Claude_Complete_Guide]] - Claude 模型家族、提示工程与工具协议
- [[Claude_Agent_Architecture]] - Agent 设计模式与多智能体协作
- [[Context_Engineering_Guide]] - 从提示词工程到上下文工程
- [[LLM_Fundamentals]] - 大语言模型基础知识
