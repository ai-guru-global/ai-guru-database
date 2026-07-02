---
title: "OpenClaw 从入门到精通：完整运维与使用指南"
category: "15-agent-production-openclaw-ecosystem"
tags: ["openclaw", "ai-agents", "agent-framework", "production", "configuration", "multi-agent", "automation", "ops-security"]
summary: "从《OpenClaw 从入门到精通》第一、二部分（Ch1-8）提炼的实操指南：涵盖 OpenClaw 核心概念、安装部署、配置体系与模型治理、工具系统与技能、会话/上下文/记忆管理、多渠道分发与多智能体协作、自动化运维与安全基线。"
source: "yeasy/openclaw_guide (Ch1-8)"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Openclaw Complete Guide"
  - "OpenClaw Complete Guide"
  - OpenClaw_Complete_Guide

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# OpenClaw 完整指南：从入门到进阶

> 本页提炼自《OpenClaw 从入门到精通》第一、二部分（第 1-8 章），聚焦实操运维知识。底层原理与工程实现详见 [[OpenClaw_Internals]]。

相关：[[Agentic_AI_Complete_Guide]]、[[Harness_Engineering_Complete_Guide]]、[[OpenClaw_Ecosystem]]、[[OpenClaw_Technical_Deep_Dive]]

---

## 1. OpenClaw 是什么

OpenClaw 是**本地优先的个人 AI 助手系统**，由 Peter Steinberger 创建。它不是单纯的开发框架或 SDK，而是一套可直接运行、可持续交互、可连接真实工具的智能体运行时产品。

### 核心价值：为 AI 构建可控运行环境

OpenClaw 解决三个核心问题：

| 问题 | OpenClaw 方案 |
|------|-------------|
| **孤立的 AI 能力**：一问一答，无记忆、无手脚、无边界 | 持久化 Session + Tool 系统 + 访问控制黑白名单 |
| **多渠道接入与身份混乱** | Gateway 统一接收消息 + pairing/allowlist 建立可信关系 |
| **可靠性与可审计性缺失** | 故障恢复 + 用量观测 + HITL 门控 + 完整审计日志 |

### 五大核心概念

| 概念 | 职责 |
|------|------|
| **Gateway** | 系统的"门"：接受消息、验证身份、维护连接、路由请求 |
| **Agent** | "干活"单元：调用 LLM 思考，决定工具使用，整理结果回复 |
| **Tool** | Agent 的"手"：执行操作（读文件、打开网页、调 API） |
| **Session** | Agent 的"记忆本"：多轮对话历史持久化 |
| **Node** | 通过 WebSocket 接入的设备/执行端点（可选） |

核心链路：**Gateway -> Agent -> Tool / Session（Node 按需接入）**

### 选型建议

| 场景 | 推荐工具 |
|------|---------|
| 个人学习、通用问答 | ChatGPT / Claude |
| 编程助手 | Cursor |
| 自有服务器上构建可连接真实工具、可控权限、多渠道接入的智能体 | **OpenClaw** |
| 逻辑固定的简单自动化 | Zapier / n8n |
| 零运维的托管服务 | Dify / Coze |

---

## 2. 环境准备与安装部署

### 2.1 系统要求

| 依赖项 | 最低要求 |
|--------|---------|
| 操作系统 | macOS、Linux（推荐 Ubuntu 24.04 LTS）、Windows（WSL2 更稳定） |
| Node.js | **Node.js 24**（推荐）或 Node.js 22 LTS（22.19+） |
| 内存 | 最低 4 GB；运行浏览器工具推荐 8 GB+ |
| 模型认证 | 至少一种可用的 API Key / OAuth / setup-token |

### 2.2 安装方式

**推荐：一键安装脚本**

```bash
# macOS / Linux
curl -fsSL https://openclaw.ai/install.sh | bash

# 跳过 onboarding（先装 CLI）
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard

# Windows PowerShell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

**验证安装**

```bash
openclaw --version
openclaw --help
```

**替代方式决策树**：一键脚本 -> Docker -> npm/pnpm -> 源码构建。首次部署只选一条路径跑通。

### 2.3 初始化向导

```bash
openclaw onboard --install-daemon
```

**黄金路径**（对排错压力最小）：
1. Onboarding mode 选 `QuickStart`
2. 模型 Auth 绑定 Anthropic 或 OpenAI API Key
3. 搜索引擎、技能、渠道全部选 `Skip for now`
4. 工作区保持默认 `~/.openclaw/workspace`

**关键区别**：
- 带 `--install-daemon`：写配置 + 注册后台服务（macOS LaunchAgent / Linux systemd）
- 不带：仅写配置，不安装后台服务

### 2.4 工作区产物

```text
~/.openclaw/workspace/
├── AGENTS.md        # 工作区常驻指令
├── SOUL.md          # 人格/风格文件
├── IDENTITY.md      # 智能体身份信息
├── USER.md          # 用户档案与偏好
├── TOOLS.md         # 工具注册与配置
├── HEARTBEAT.md     # 心跳巡检清单
├── MEMORY.md        # 长期记忆索引（可选）
├── BOOTSTRAP.md     # 首跑仪式文件（完成后删除）
├── skills/          # 技能目录
└── memory/          # 记忆文件目录
```

### 2.5 守护进程与可用性验收

**最小验证清单**：

```bash
openclaw --version            # CLI 可用性
openclaw doctor               # 配置与依赖检查
openclaw health --json        # 进程健康
openclaw gateway status       # 后台服务运行
openclaw dashboard            # 控制台可访问
# 在 Dashboard Chat 输入 "你好"  # 模型响应能力
openclaw logs --limit 10      # 无 ERROR 级日志
```

**分层排障**：环境配置层 -> 控制平面层 -> 执行链路层 -> 外部网络层。

---

## 3. 快速上手与首轮对话

### 3.1 Dashboard 导航结构

Dashboard（Control UI）分为四组：
- **Chat**：对话交互入口
- **Control**：Overview（网关总览）、Sessions（会话管理）、Usage、Cron Jobs
- **Agent**：Agents 配置、Skills 管理、Nodes 设备、Dreaming
- **Settings**：Config 编辑器、Channels、Logs、Debug

首次跑通只需 3 个页面：**Chat**（交互验证）、**Overview**（健康检查）、**Logs**（排障对比）。

### 3.2 四层诊断顺序

| 层级 | 命令 | 检查目标 |
|------|------|---------|
| 进程与网关 | `openclaw doctor` | 配置、依赖、进程 |
| 渠道 | `openclaw channels status --probe` | 渠道运行状态与 live probe |
| 模型 | `openclaw models status / --probe` | 认证状态与 live 探针 |
| 日志 | `openclaw logs --follow --json` | 定位具体错误 |

### 3.3 初始指令模板

在 `AGENTS.md` 中写入最小指令：

```text
你是 [角色名称]。遵守以下规则：
1. 只处理与 [领域] 相关的问题，其他问题回复"超出职责范围"
2. 输出必须包含：结论（一句话）→ 具体内容 → 验证方式
3. 不确定时明确说明，不编造信息
```

好指令三要素：**目标收敛** + **边界声明** + **格式约束**。安全边界必须由工具策略兜底，不能只写在提示词里。

### 3.4 设备批准机制

OpenClaw 默认对新设备采用"先拦截、后批准"策略。本地 loopback 通常自动批准；Tailnet/局域网新设备需手动批准。

```bash
openclaw devices list                # 列出待批准设备
openclaw devices approve <ID>        # 批准
openclaw devices remove <DEVICE_ID>  # 撤销
```

---

## 4. 配置体系与模型治理

### 4.1 openclaw.json 结构与优先级

**配置优先级**（越接近运行时，优先级越高）：

1. 默认值（程序内置）
2. 文件配置（`~/.openclaw/openclaw.json`）
3. 环境注入（`${VAR_NAME}` 占位符）
4. 运行覆盖（命令行参数）

**作用域四层**：Gateway 级 > Agent 级 > 渠道级 > 工具级。很多"配置不生效"是写错了作用域。

**环境变量加载顺序**：进程环境 > 当前目录 `.env` > `~/.openclaw/.env` > 兼容回退 > `openclaw.json` 的 `env` 块。

### 4.2 模型供应商接入

**三条路径**：

1. **内置供应商**（推荐）：通过 `openclaw onboard` 认证，密钥写入 `auth-profiles.json`，无需手写 `models.providers`
2. **自定义/代理供应商**：需要显式写 `models.providers`（baseUrl + models + api）
3. **OpenRouter**：使用 `openrouter/<provider>/<model>` 标识

模型标识统一使用 `provider/model` 格式：
- `openai/gpt-5.5`、`anthropic/claude-sonnet-4-6`
- `anthropic-vertex/claude-sonnet-4-6`（Vertex AI）
- `ollama/mistral`（本地 Ollama，注意不要用 `/v1` 路径）

**密钥注入**：
- 基本：`${VAR_NAME}` 环境变量插值
- 高阶：`SecretRef` 对象（支持 env/file/exec 三种 source）
- 生产环境不要明文密钥写进配置文件

### 4.3 模型选择策略

**四维决策**：质量 + 成本 + 延迟 + 可靠性

| 业务场景 | 推荐策略 |
|---------|---------|
| 客服系统 | 低延迟模型为主，大模型兜底 |
| 数据分析助手 | 大模型为主，关注上下文窗口 |
| 定时巡检报告 | 大模型为主，失败后重试而非降级 |

```jsonc
{
  agents: {
    defaults: {
      model: {
        primary: "openai/gpt-5.4",
        fallbacks: ["anthropic/claude-sonnet-4-6"]
      }
    }
  }
}
```

### 4.4 故障转移与回退链路

**错误分三类**：
1. **配置/鉴权类**（快速失败）：401/403、密钥缺失
2. **瞬时故障类**（有界重试）：短暂超时、偶发 5xx
3. **持续不可用类**（触发回退）：持续限流 429、供应商不可用

**Auth-profile 级冷却**（同供应商多账号轮转）：

| 失败次数 | 冷却时长 |
|---------|---------|
| 1 | 30 秒 |
| 2 | 1 分钟 |
| 3+ | 5 分钟（上限） |

billing 相关禁用：5 小时起步，每次翻倍，上限 24 小时。

---

## 5. 工具系统与技能

### 5.1 工具分类与风险分级

| 类别 | 典型工具 | 风险 | 默认策略 |
|------|---------|------|---------|
| 只读查询 | `group:web`、`read`、`memory_search` | 低 | 默认允许 |
| 有副作用写入 | `write`、`edit`、`group:messaging` | 中 | 默认拒绝，按需放开 |
| 执行/命令类 | `group:runtime`（exec、process） | 高 | 默认拒绝，最小范围放开 |
| 交互自动化 | `group:ui`（browser、canvas） | 高 | 默认拒绝 |

**工具调用生命周期**：模型推理 -> 提议工具调用 -> 策略校验 -> 执行 -> 结果回注 -> 模型继续推理

### 5.2 工具策略配置

**四个核心块**：
- `tools.profile`：默认场景模板（`minimal` / `coding` / `messaging` / `full`）
- `tools.allow`：全局允许列表
- `tools.deny`：全局拒绝列表（**优先级高于 allow**）
- 渠道分层策略：按群组/房间/peer 维度限制

**策略流水线**：profile -> provider profile -> 全局策略 -> provider 策略 -> agent 策略 -> agent provider 策略 -> 渠道/群组策略 -> sandbox/subagent 策略。每层内部 deny 优先。

```jsonc
{
  tools: {
    profile: "coding",
    deny: ["group:runtime", "write", "edit"],
    // 按渠道分层
    subagents: {
      tools: { deny: ["gateway", "cron"], allow: ["read", "exec"] }
    }
  }
}
```

### 5.3 技能与插件

**定位分工**：
- **插件（Plugins）**：TypeScript/JavaScript 扩展模块，新增工具/渠道/运行时能力
- **技能（Skills）**：Markdown 文件 + 资源包，固化执行方法论，教导模型如何使用已有工具

**技能安装**：

```bash
openclaw skills search "daily report"   # 搜索
openclaw skills install daily-report     # 安装
openclaw skills update --all             # 更新全部
```

**安全警告**：公共技能仓库存在供应链风险。引入第三方技能前必须 review `SKILL.md`，检查是否包含明文凭据、shell 命令诱导、敏感文件读取等恶意指令。

---

## 6. 会话、上下文与记忆

### 6.1 会话模型

**会话作用域**：
- 主会话（main）：私聊最常见的归并目标
- 渠道/线程隔离：群聊、线程按独立 session key 拆分
- DM 隔离：默认偏向共享主会话，需显式配置 `session.dmScope` 才按用户拆分

**重置策略**：支持按时间窗或空闲时长重置，`/new` 命令主动切断历史。

**消息队列模式**：`steer`（注入当前运行）、`followup`（排队后续）、`collect`（合并后处理）、`interrupt`（中断当前运行）。

**双层存储**：
- Session Store（`sessions.json`）：元数据，轻量可重建
- Transcript（`<sessionId>.jsonl`）：追加式对话历史

### 6.2 上下文构建与窗口预算

**四层信息源**：

| 层级 | 来源 | 预算占比 |
|------|------|---------|
| 1. 系统身份 | AGENTS.md / SOUL.md / TOOLS.md 等 | 10-15% |
| 2. 工作区知识 | MEMORY.md / 检索结果 | 5-10% |
| 3. 对话历史 | 用户消息与助手回复 | 75-85% |
| 4. 工具回执 | 工具调用原始返回 | 最先被裁剪 |

**裁剪优先级**：旧工具回执 -> 早期对话轮次 -> 工作区知识 -> 系统身份（不可牺牲）

### 6.3 记忆机制

**双层记忆结构**：
- **长期记忆**（`MEMORY.md`）：持久化偏好、决策、经验
- **每日日志**（`memory/YYYY-MM-DD.md`）：阶段性进展、当天细节

**写入规则**：只记录**稳定**（跨会话复用）、**可追溯**（来自工具回执）、**可纠错**的事实。

**检索机制**：
- `memory_search`：混合搜索（BM25 + 向量相似度），400 token/分块
- `memory_get`：精确读取特定行

**注意**：`memory_search` 的语义检索需要独立的 embedding 供应商（OpenAI/Gemini/Voyage），与主对话模型密钥独立。缺少 embedding 时退化为关键词检索。

---

## 7. 多渠道分发与多智能体协作

### 7.1 渠道接入

**入口治理第一原则**：私聊（`dmPolicy`）与群聊（`groupPolicy`）分开配置。

**Telegram 接入**：

```jsonc
{
  channels: {
    telegram: {
      botToken: "${TELEGRAM_BOT_TOKEN}",
      dmPolicy: "pairing",
      groupPolicy: "allowlist",
      groups: { "*": { requireMention: true } }
    }
  }
}
```

**飞书接入时序**（极易出错）：
1. 飞书侧：创建应用 -> 配置权限 -> 开启机器人
2. OpenClaw 侧：`openclaw channels add` 选 Feishu
3. OpenClaw 侧：启动 Gateway
4. 飞书侧：开启事件订阅（长连接）-> 添加 `im.message.receive_v1`
5. 飞书侧：创建版本并发布

**血的教训**：不要在 OpenClaw 没配置 Feishu 渠道、Gateway 没跑起来时就去飞书后台开启长连接，会保存失败。

### 7.2 多智能体路由

**路由决策链**：先匹配路由绑定（bindings），未命中再进入路由器。

```jsonc
{
  // bindings 是顶层数组，不嵌套在 agents 内！
  bindings: [
    {
      agentId: "devops",
      match: { channel: "telegram", peer: { kind: "group", id: "-1001234567890" } }
    }
  ],
  agents: {
    list: [
      { id: "assistant", default: true },
      { id: "devops", workspace: "~/.openclaw/workspace-devops" }
    ]
  }
}
```

**绑定优先级**：Peer match > parentPeer > guildId+roles > accountId > Channel-level > Fallback

### 7.3 子智能体与广播组

**子智能体**（`sessions_spawn`）：在隔离会话中启动子任务，完成后回告。

```jsonc
{
  agents: {
    defaults: { subagents: { archiveAfterMinutes: 60, runTimeoutSeconds: 120 } },
    list: [
      { id: "assistant", default: true, subagents: { allowAgents: ["reviewer", "writer"] } }
    ]
  }
}
```

**广播组**（`broadcast`）：同一入口同时触发多个智能体（WhatsApp/飞书）。

**消息队列**：`messages.queue.mode` 控制同一会话内多条消息排队方式。默认 `steer`。

---

## 8. 自动化与运维安全

### 8.1 Hooks 生命周期

Hook 是 Gateway 内部事件上的目录式扩展点，包含 `HOOK.md` + `handler.ts`。

**当前内部事件**：`command:new`、`command:reset`、`session:compact:before/after`、`agent:bootstrap`、`gateway:startup/shutdown`、`message:received/transcribed/sent` 等。

**稳定性约束**：
- 每个 Hook 独立超时
- 内部 Hook 返回 void，不阻断后续
- 重试情况下不得产生重复外部副作用

### 8.2 Cron 定时作业

**内建 Cron**（Gateway 原生调度，零外部依赖）：

```bash
# 主会话任务：工作日 9:00
openclaw cron add --name "daily_standup" \
  --cron "0 9 * * 1-5" --session main \
  --system-event "拉取昨日进展，生成站会摘要"

# 隔离任务：一次性提醒
openclaw cron add --name "review_reminder" \
  --at "2026-06-23T15:00:00" --session isolated \
  --message "提醒：下午 3 点代码评审" --announce
```

**会话模式**：
- `main`（通过系统事件注入主会话）
- `isolated`（独立 `cron:<jobId>` 会话，不继承主对话历史）
- `current` / `session:<id>`（绑定特定会话）

**四个工程约束**：幂等 + 防重入 + 可观测 + 可恢复

### 8.3 Heartbeat 心跳机制

系统按固定间隔（默认 30m，Anthropic OAuth 默认 1h）唤醒智能体，按 `HEARTBEAT.md` 清单项逐一扫描，只有有事时才通知。

**核心协议**：
- 无事发生 -> 回复 `HEARTBEAT_OK` -> 网关静默处理
- 有事需要关注 -> 回复告警文本 -> 按 target 投递到渠道

```jsonc
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "none",        // "none" | "last" | 具体渠道名
        lightContext: true,    // 仅注入 HEARTBEAT.md，节省 token
        activeHours: { start: "09:00", end: "22:00", timezone: "Asia/Shanghai" }
      }
    }
  }
}
```

**Cron vs Heartbeat 选型**：精确时间点 -> Cron；周期性巡检按需通知 -> Heartbeat。

### 8.4 安全基线

**纵深防御四层**：

| 层级 | 控制点 |
|------|--------|
| 入口层 | 渠道门控、allowlist、提及规则 |
| 路由层 | bindings 把高风险入口固定到受控智能体 |
| 工具层 | tools.profile + allow/deny，deny 优先 |
| 数据层 | SecretRef 环境注入、日志脱敏 |

**验证命令集**：

```bash
openclaw doctor
openclaw status --deep
openclaw channels capabilities
openclaw models status --probe
openclaw security audit --deep
```

**反面案例**：赋予智能体全局文件系统写权限后，它在故障时"自我修复"改错了 `openclaw.json`，导致无限报错循环。**防护**：运行 OpenClaw 的用户账号不应对配置文件目录有写入权限。

---

## 速查命令表

| 场景 | 命令 |
|------|------|
| 系统诊断 | `openclaw doctor` |
| 全局状态 | `openclaw status --deep` |
| 健康检查 | `openclaw health --json` |
| 渠道探针 | `openclaw channels status --probe` |
| 模型状态 | `openclaw models status / --probe` |
| 实时日志 | `openclaw logs --follow --json` |
| 设备管理 | `openclaw devices list / approve / remove` |
| 定时任务 | `openclaw cron list / status / add / run` |
| 技能管理 | `openclaw skills search / install / update` |
| 插件管理 | `openclaw plugins list / inspect / doctor` |
| 安全审计 | `openclaw security audit --deep` |
| 版本升级 | `openclaw update` |
