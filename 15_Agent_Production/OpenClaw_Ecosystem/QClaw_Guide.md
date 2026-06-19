---
title: "QClaw Complete Guide: Tencent's WeChat-First AI Agent"
category: "13-agent-production-23-openclaw-ecosystem"
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "**QClaw** (龙虾/Lobster) is Tencent's OpenClaw implementation that brings AI agent capabilities to the masses through seamless WeChat integration. It's designed for consumers and pro"
created: "2026-05-31"
updated: "2026-05-31"
---

# QClaw Complete Guide: Tencent's WeChat-First AI Agent

## Overview

**QClaw** (龙虾/Lobster) is Tencent's OpenClaw implementation that brings AI agent capabilities to the masses through seamless WeChat integration. It's designed for consumers and professionals who want to control their computer remotely via China's most popular messaging app.

**Website**: [qclaw.qq.com](https://qclaw.qq.com/) 
**Alternative**: [claw.guanjia.qq.com](https://claw.guanjia.qq.com/) 
**Developed by**: Tencent (腾讯电脑管家) 
**Status**: Internal Testing (申请内测中)

---

## Table of Contents

1. [Why QClaw Matters](#why-qclaw-matters)
2. [Key Features](#key-features)
3. [How It Works](#how-it-works)
4. [Installation Guide](#installation-guide)
5. [WeChat Integration](#wechat-integration)
6. [Skills Ecosystem](#skills-ecosystem)
7. [Real-World Use Cases](#real-world-use-cases)
8. [Raising Your Lobster](#raising-your-lobster)
9. [Security & Privacy](#security--privacy)
10. [Comparison with Alternatives](#comparison-with-alternatives)

---

## Why QClaw Matters

### The WeChat Advantage

In China, WeChat isn't just a messaging app—it's the operating system of daily life:
- **1.3 billion** monthly active users
- Average user spends **4+ hours/day** on WeChat
- Integrated payments, mini-programs, social networking

QClaw leverages this by making WeChat your AI command center:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Before QClaw                                 │
├─────────────────────────────────────────────────────────────────┤
│  You're in a meeting, but need a file from your desktop...      │
│                                                                 │
│  Options:                                                       │
│  ❌ Remote desktop app (clunky, needs setup)                    │
│  ❌ Ask a colleague (awkward, privacy concerns)                 │
│  ❌ Wait until you get back (delays everything)                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     With QClaw                                  │
├─────────────────────────────────────────────────────────────────┤
│  WeChat message: "帮我打开桌面Q3报告.xlsx，发给我"              │
│                                                                 │
│  QClaw: "📂 已打开文件，正在发送..."                           │
│         [Q3报告.xlsx attached]                                  │
│                                                                 │
│  ✅ Done in 30 seconds, from your phone                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Features

### 1. 🔗 WeChat Direct Connection (微信直联)

- Zero configuration required
- Scan QR code to link
- Works from anywhere with internet
- Real-time bidirectional communication

### 2. 🖥️ Remote Computer Control (远程操控)

Control your computer without being physically present:
- File operations (open, move, delete, send)
- Application launching
- Browser automation
- System commands

### 3. 🦞 Persistent Memory (养虾记忆)

Your AI "lobster" learns and remembers:
- Communication preferences
- Frequently used files
- Common workflows
- Personal style (formal/casual)

### 4. 🛠️ 5,000+ Skills Ecosystem

Extensive pre-built capabilities:
- Office automation
- Research assistance
- Development tools
- Entertainment
- Health & lifestyle

### 5. 🧠 Domestic AI Models

Built-in high-quality Chinese LLMs:
- Optimized for Chinese language
- Fast response times
- Option to switch to custom models

---

## How It Works

### Architecture Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                         Your Phone                                 │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                      WeChat App                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │  Chat with QClaw                                        │ │ │
│  │  │  ──────────────────────────                             │ │ │
│  │  │  You: 帮我整理桌面文档                                   │ │ │
│  │  │  QClaw: 🦞 好的，正在处理...                            │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
                              │
                              │ WeChat Protocol
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                     Tencent Cloud                                  │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Message Router + AI Reasoning Engine                        │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
                              │
                              │ Secure Connection
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                     Your Computer                                  │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    QClaw Desktop App                          │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │ │
│  │  │  File   │  │ Browser │  │  Shell  │  │  Skills Engine  │ │ │
│  │  │ Manager │  │ Control │  │ Execute │  │  (5000+ skills) │ │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

### Three-Step Setup

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Download & Install                                     │
│  ─────────────────────────                                      │
│  📥 Download from qclaw.qq.com                                  │
│  🖥️ Supports Mac & Windows                                      │
│  ⚡ One-click install, no environment setup                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Scan QR Code                                           │
│  ────────────────────                                           │
│  📱 Open QClaw app on computer                                  │
│  🔲 Scan the QR code with WeChat                                │
│  ✅ Instant connection established                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Start Chatting                                         │
│  ─────────────────────                                          │
│  💬 Send commands via WeChat or desktop                         │
│  🦞 QClaw executes tasks autonomously                           │
│  📊 Get results instantly                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Installation Guide

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **OS** | Windows 10 / macOS 11 | Windows 11 / macOS 14 |
| **RAM** | 4GB | 8GB+ |
| **Storage** | 2GB | 10GB+ |
| **Network** | Stable internet | Broadband |

### Download Links

| Platform | Download |
|----------|----------|
| **macOS (Apple Silicon)** | [Download](https://qclaw.qq.com/) |
| **macOS (Intel)** | [Download](https://qclaw.qq.com/) |
| **Windows** | [Download](https://qclaw.qq.com/) |

### Getting Beta Access

QClaw is currently in internal testing:

1. Visit [qclaw.qq.com](https://qclaw.qq.com/)
2. Click "免费申请邀请码" (Apply for Invite Code)
3. Fill out the application form
4. Wait for approval (usually 1-3 days)

---

## WeChat Integration

### Linking Your Account

1. **Launch QClaw Desktop App**
2. **Click "Scan QR Code"** button
3. **Open WeChat** on your phone
4. **Scan the QR code** with WeChat scanner
5. **Confirm** the connection on your phone

### Chat Interface

Once linked, you can:

- **Direct Message**: Chat with QClaw as a contact
- **Mini Program**: Access via QClaw 小程序 (v2.0+)
- **Inspiration Square**: Pre-set tasks for common scenarios

### Message Types Supported

| Type | Example | Status |
|------|---------|--------|
| Text | "打开文件" | ✅ Supported |
| Voice | Voice-to-text command | ✅ Supported |
| Image | "识别这张图片" | ✅ Supported |
| File | Send file for processing | ✅ Supported |
| Location | Location-based reminders | 🔄 Coming Soon |

---

## Skills Ecosystem

### What are Skills?

Skills are AI capabilities packaged as "instruction manuals" that teach QClaw how to perform specific tasks. They transform the AI from "chat only" to "can actually do things."

### Skill Structure

```
skill-name/
├── SKILL.md          # Natural language instructions
├── tools/            # Tool definitions (optional)
└── examples/         # Usage examples (optional)
```

### Skills Sources

| Source | Skills Count | Description |
|--------|-------------|-------------|
| **ClawHub** | 3,500+ | Global official registry |
| **SkillHub** | 22,000+ | China-optimized mirror |
| **GitHub** | Unlimited | Community contributions |
| **Custom** | Your own | Personal workspace skills |

### Top Skills Categories

| Category | Examples |
|----------|----------|
| **办公提效** (Office) | Excel automation, email drafting, meeting scheduling |
| **深度研究** (Research) | Paper search, literature review, data analysis |
| **开发工具** (Dev Tools) | GitHub automation, code review, project setup |
| **娱乐游戏** (Entertainment) | Game info lookup, content recommendations |
| **自律生活** (Lifestyle) | Health tracking, habit formation, reminders |

### Installing Skills

**Via Desktop App:**
```
Settings → Skills → Browse ClawHub → Install
```

**Via Chat Command:**
```
You: 安装 file-organizer 技能
QClaw: 🦞 正在安装 file-organizer...
       ✅ 安装成功！现在我可以帮你整理文件了
```

---

## Real-World Use Cases

### 1. Remote File Operations

```
┌─────────────────────────────────────────────────────────────────┐
│  You (via WeChat):                                              │
│  "帮我打开桌面的Q3报告.xlsx，把第3列数据求和"                   │
├─────────────────────────────────────────────────────────────────┤
│  QClaw:                                                         │
│  📂 已打开文件                                                  │
│  ✅ Q3总销售额为 ¥2,847,600，已保存！                          │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Document Organization

```
┌─────────────────────────────────────────────────────────────────┐
│  You:                                                           │
│  "整理桌面上所有文档，按项目分类，每个项目提炼一页摘要"         │
├─────────────────────────────────────────────────────────────────┤
│  QClaw:                                                         │
│  📂 已扫描桌面 86 个文件                                        │
│  🗂 已按 5 个项目自动归类                                       │
│  📝 每个项目摘要已生成 → summary.pdf                           │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Smart Reminders

```
┌─────────────────────────────────────────────────────────────────┐
│  You:                                                           │
│  "帮我设置每天早上8点推送天气"                                  │
├─────────────────────────────────────────────────────────────────┤
│  QClaw:                                                         │
│  ✅ 已设置！明早 8 点准时播报                                   │
│  🌤 明天晴，23°C，建议穿薄外套~                                │
│  🌧 后天有雨，记得带伞哦                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Preference Learning

```
┌─────────────────────────────────────────────────────────────────┐
│  You:                                                           │
│  "以后帮我写的邮件都用正式语气，结尾加'此致敬礼'"               │
├─────────────────────────────────────────────────────────────────┤
│  QClaw:                                                         │
│  🦞 收到，已更新你的邮件风格偏好                                │
│  ✍️ 以后写邮件自动按这个风格来                                  │
│  📈 你的龙虾已学会 12 个偏好，持续进化中                        │
└─────────────────────────────────────────────────────────────────┘
```

### 5. Automated Development

```
┌─────────────────────────────────────────────────────────────────┐
│  You:                                                           │
│  "帮我创建一个Chrome插件项目，自动提交到GitHub"                 │
├─────────────────────────────────────────────────────────────────┤
│  QClaw:                                                         │
│  🛠 项目已创建：qclaw-chrome-ext                                │
│  📦 已 push 到 GitHub，自动生成 README                          │
│  ⭐ 已自动生成 README 和文档                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 6. Academic Research

```
┌─────────────────────────────────────────────────────────────────┐
│  You:                                                           │
│  "搜近3年LLM Agent综述论文，整理成文献综述"                     │
├─────────────────────────────────────────────────────────────────┤
│  QClaw:                                                         │
│  🔍 已检索到相关论文                                            │
│  📋 已按引用量筛选核心文献                                      │
│  📝 综述草稿已完成，引用格式：APA                               │
│  ✅ 已导出 PDF & LaTeX                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Raising Your Lobster (养虾)

### The "Lobster" Concept

QClaw uses the endearing metaphor of "raising a lobster" (养虾) for training your AI:

- 🦞 **Young Lobster**: Generic, learns basic tasks
- 🦞🦞 **Growing Lobster**: Remembers your preferences
- 🦞🦞🦞 **Mature Lobster**: Anticipates your needs

### How Memory Works

```
┌────────────────────────────────────────────────────────────────┐
│                    Memory Layers                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Layer 1: Conversation Memory                            │ │
│  │  ─────────────────────────────                           │ │
│  │  Current session context, recent interactions            │ │
│  └──────────────────────────────────────────────────────────┘ │
│                          │                                     │
│                          ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Layer 2: Preference Memory                              │ │
│  │  ────────────────────────────                            │ │
│  │  "喜欢正式邮件"、"常用文件夹"、"工作时间"                 │ │
│  └──────────────────────────────────────────────────────────┘ │
│                          │                                     │
│                          ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Layer 3: Behavioral Patterns                            │ │
│  │  ────────────────────────────                            │ │
│  │  "每周一整理文件"、"每天查看新闻"、"代码风格偏好"         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Training Your Lobster

**Explicit Teaching:**
```
You: "记住：我是产品经理，主要关注用户体验"
QClaw: 🦞 已记住！以后回答会考虑产品和用户视角
```

**Implicit Learning:**
QClaw observes your patterns:
- Time of day you work
- Types of files you access frequently
- Communication style you prefer
- Tasks you repeat often

---

## Security & Privacy

### Data Protection

| Data Type | Storage Location | Encryption |
|-----------|------------------|------------|
| Conversations | Local + Tencent Cloud | ✅ E2E Encrypted |
| Files | Your computer only | ✅ Local encryption |
| Preferences | Local | ✅ Encrypted |
| Credentials | Secure keychain | ✅ System-level security |

### Permission Controls

- **File Access**: Choose which folders QClaw can access
- **Network**: Control which sites/APIs can be reached
- **Applications**: Whitelist apps that can be controlled
- **Sensitive Actions**: Always require confirmation

### Enterprise Security (Coming Soon)

- SSO integration
- Audit logging
- Data loss prevention
- Compliance reporting

---

## Comparison with Alternatives

| Feature | QClaw | CoPaw | Manus |
|---------|-------|-------|-------|
| **Primary Interface** | WeChat | Multi-channel | Desktop app |
| **Target Market** | China consumers | Developers | Power users |
| **Language** | Chinese-first | Multi-language | Multi-language |
| **Deployment** | Hybrid | Local-first | Cloud + Local |
| **Skills Count** | 5,000+ | Unlimited | Varies |
| **Memory System** | Proprietary | ReMe | Manus Memory |
| **Price** | Free (beta) | Free | Subscription |

### When to Choose QClaw

✅ You live in China and use WeChat daily  
✅ You want the simplest possible setup  
✅ You need remote computer control from your phone  
✅ You prefer Chinese language interface  
✅ You want Tencent ecosystem integration

---

## Tips & Best Practices

### Getting the Most from QClaw

1. **Be Specific**: "把桌面的 excel 文件移动到工作文件夹" vs "整理文件"
2. **Teach Preferences Early**: Let your lobster know your style
3. **Use Scheduled Tasks**: Set up recurring automations
4. **Explore Skills**: Check the Inspiration Square for ideas
5. **Give Feedback**: Correct mistakes to improve learning

### Common Commands

| Task | Command |
|------|---------|
| Open file | "打开 [文件名]" |
| Send file | "把 [文件名] 发给我" |
| Search files | "找一下 [关键词] 相关的文件" |
| Summarize | "总结一下 [文件名]" |
| Schedule | "每天 [时间] 提醒我 [事项]" |
| Research | "帮我查一下 [主题]" |

---

## Future Roadmap

### Announced Features

- 📱 **WeChat Mini Program 2.0**: Enhanced interface
- 🎤 **Voice Commands**: Direct voice control
- 👥 **Team Collaboration**: Shared agents for teams
- 🤖 **Multi-Agent**: Coordinate multiple specialized agents

### Integration Plans

- 企业微信 (WeCom) support
- QQ integration (confirmed)
- Tencent Meeting integration
- Tencent Docs automation

---

## Resources

- **Official Site**: [qclaw.qq.com](https://qclaw.qq.com/)
- **SkillHub**: [skillhub.tencent.com](https://skillhub.tencent.com/)
- **Help Center**: [help.qclaw.qq.com](https://help.qclaw.qq.com/)
- **Community**: QClaw 官方微信群

---

*Last Updated: March 2026*

## Related

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026.md|Agent_Harness_Complete_2026]]
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026.md|Agent_Red_Teaming_2026]]
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow.md|Evaluation_Workflow]]
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment.md|Production_Assessment]]
- [[15_Agent_Production/Agent_Evaluation/Benchmarking/Benchmarking_Criteria.md|Benchmarking_Criteria]]
