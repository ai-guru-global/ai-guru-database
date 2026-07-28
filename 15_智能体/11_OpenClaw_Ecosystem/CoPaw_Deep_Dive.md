---
title: 'CoPaw Deep Dive: Alibaba''s Personal AI Agent Workstation'
category: '15-agent-production-openclaw-ecosystem'
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: '**CoPaw** ("Works for you, grows with you") is Alibaba''s flagship open-source AI agent implementation built on the **AgentScope** framework. It represents one of the most sophistic'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Copaw Deep Dive"
  - "CoPaw Deep Dive"
  - CoPaw_Deep_Dive
sources: []

name_zh: "CoPaw 深度解析"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# CoPaw Deep Dive: Alibaba's Personal AI Agent Workstation

> 中文简称：CoPaw 深度解析

## Overview

**CoPaw** ("Works for you, grows with you") is Alibaba's flagship open-source AI agent implementation built on the **AgentScope** framework. It represents one of the most sophisticated personal AI assistant platforms available, featuring advanced memory management, multi-channel communication, and extensible skill systems.

**Website**: [copaw.agentscope.io](https://copaw.agentscope.io/) 
**GitHub**: [github.com/agentscope-ai/CoPaw](https://github.com/agentscope-ai/CoPaw) 
**Current Version**: v0.0.7 (March 2026)

---

## Table of Contents

1. [Core Philosophy](#core-philosophy)
2. [Architecture](#architecture)
3. [ReMe Memory System](#reme-memory-system)
4. [Channel Integrations](#channel-integrations)
5. [Skills & Extensions](#skills--extensions)
6. [Installation & Setup](#installation--setup)
7. [Advanced Configuration](#advanced-configuration)
8. [Use Case Gallery](#use-case-gallery)
9. [Security Features](#security-features)
10. [Troubleshooting](#troubleshooting)

---

## Core Philosophy

CoPaw is built on three foundational principles:

### 1. Local-First Privacy
Your data stays on YOUR machine. Unlike cloud-based assistants:
- All conversations stored locally in readable Markdown files
- Memory files are directly editable and portable
- No vendor lock-in—copy your `working_dir/` to migrate

### 2. Channel Agnosticism
One agent, any communication platform:
- Connect via DingTalk, Feishu, QQ, Discord, Slack, Telegram, iMessage
- Unified experience across all channels
- Switch channels without losing context

### 3. Extensible by Design
- Python-based skill system
- Built-in cron scheduling for automation
- Community skill marketplace via ClawHub

---

## Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                           CoPaw Workstation                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐              │
│  │   Console    │   │   Desktop    │   │    CLI       │              │
│  │  (Web UI)    │   │    App       │   │  Interface   │              │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘              │
│         │                  │                  │                       │
│         └──────────────────┼──────────────────┘                       │
│                            │                                          │
│                   ┌────────▼────────┐                                 │
│                   │  Agent Runtime  │                                 │
│                   │  (AgentScope)   │                                 │
│                   └────────┬────────┘                                 │
│                            │                                          │
│    ┌───────────┬───────────┼───────────┬───────────┐                 │
│    │           │           │           │           │                 │
│    ▼           ▼           ▼           ▼           ▼                 │
│ ┌──────┐  ┌──────┐  ┌───────────┐  ┌──────┐  ┌──────────┐           │
│ │ ReMe │  │ LLM  │  │  Channel  │  │Skills│  │  Cron    │           │
│ │Memory│  │Router│  │  Manager  │  │Engine│  │Scheduler │           │
│ └──────┘  └──────┘  └───────────┘  └──────┘  └──────────┘           │
│                            │                                          │
│         ┌──────────────────┼──────────────────┐                       │
│         │                  │                  │                       │
│         ▼                  ▼                  ▼                       │
│    ┌─────────┐      ┌─────────┐      ┌─────────────┐                 │
│    │DingTalk │      │ Discord │      │   Feishu    │  ...            │
│    │ Channel │      │ Channel │      │   Channel   │                 │
│    └─────────┘      └─────────┘      └─────────────┘                 │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| **Agent Runtime** | Orchestrates reasoning and action | AgentScope Framework |
| **ReMe Memory** | Long-term memory management | File-based + Vector DB |
| **LLM Router** | Routes to configured AI models | Multi-provider support |
| **Channel Manager** | Handles messaging platforms | Adapter pattern |
| **Skills Engine** | Loads and executes skills | Python modules |
| **Cron Scheduler** | Time-based task automation | Built-in scheduler |

---

## ReMe Memory System

ReMe (Remember Me, Refine Me) is CoPaw's revolutionary memory management framework that solves two critical problems:

1. **Limited Context Window**: Early information gets truncated in long conversations
2. **Stateless Sessions**: New sessions can't inherit history

### Memory Architecture

```
working_dir/
├── MEMORY.md              # Long-term memory (preferences, facts)
├── memory/
│   └── YYYY-MM-DD.md      # Daily journal entries
├── dialog/
│   └── YYYY-MM-DD.jsonl   # Raw conversation records
└── tool_result/
    └── <uuid>.txt         # Cached tool outputs
```

### File-Based Memory (ReMeLight)

| Traditional Memory | File-Based ReMe |
|-------------------|-----------------|
| 🗄️ Database storage | 📝 Markdown files |
| 🔒 Opaque to users | 👀 Always readable |
| ❌ Hard to modify | ✏️ Directly editable |
| 🚫 Hard to migrate | 📦 Copy to migrate |

### Core Memory Capabilities

| Capability | Method | Description |
|------------|--------|-------------|
| **Context Check** | `check_context()` | Token counting, determines if compaction needed |
| **Memory Compaction** | `compact_memory()` | Compresses history into structured summaries |
| **Tool Compaction** | `compact_tool_result()` | Prevents tool results from blowing up context |
| **Memory Persistence** | `summary_memory()` | Writes important info to `memory/*.md` |
| **Memory Search** | `memory_search()` | Hybrid retrieval (vectors + BM25) |
| **Pre-Reasoning Hook** | `pre_reasoning_hook()` | Automatic context management before each step |

### Memory Compaction Flow

```
                    ┌─────────────────────────────────────┐
                    │        Before Each Reasoning        │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │     compact_tool_result()           │
                    │     (Truncate long outputs)         │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │     check_context()                 │
                    │     (Token counting)                │
                    └─────────────────┬───────────────────┘
                                      │
                         ┌────────────┴────────────┐
                         │                         │
              ┌──────────▼──────────┐   ┌─────────▼─────────┐
              │   Under Threshold   │   │  Exceeds Threshold│
              │   (Continue)        │   │   (Compact)       │
              └─────────────────────┘   └─────────┬─────────┘
                                                  │
                    ┌─────────────────────────────┼─────────────────────────┐
                    │                             │                         │
                    ▼                             ▼                         ▼
        ┌───────────────────┐      ┌──────────────────────┐   ┌────────────────────┐
        │  compact_memory() │      │   summary_memory()   │   │mark_compressed()   │
        │  (Gen summary)    │      │   (Async persist)    │   │(Save raw dialog)   │
        └───────────────────┘      └──────────────────────┘   └────────────────────┘
```

### Structured Summary Format

When conversations are compacted, ReMe generates structured checkpoints:

```markdown
## Goal
User's primary objectives

## Constraints
Preferences and limitations

## Progress
Task completion status

## Key Decisions
Important choices made

## Next Steps
Planned actions

## Critical Context
File paths, function names, error messages, etc.
```

### Memory Compression Performance

Real-world example from CoPaw testing:
- **Input**: 223,838 tokens
- **Output**: 1,105 tokens
- **Compression Ratio**: 99.5%

---

## Channel Integrations

### Supported Channels (v0.0.7)

| Channel | Status | Features |
|---------|--------|----------|
| **DingTalk** | ✅ Full | Auth, @mention filtering, rich text |
| **Feishu** | ✅ Full | Emoji reactions, rich text media |
| **QQ** | ✅ Full | Image sending, group support |
| **Discord** | ✅ Full | 2000-char message splitting |
| **Telegram** | ✅ Full | Markdown rendering |
| **Slack** | ✅ Full | Thread support |
| **iMessage** | ✅ Full | macOS integration |
| **Mattermost** | ✅ New | Enterprise messaging |
| **Matrix** | ✅ New | Decentralized protocol |
| **MQTT** | ✅ New | IoT integration |

### Channel Configuration

Configure channels through the Console (Web UI):

1. Open `http://127.0.0.1:8088`
2. Navigate to Settings → Channels
3. Select channel type
4. Enter credentials/tokens
5. Enable @mention filtering (optional)

---

## Skills & Extensions

### Skill Structure

```
my-skill/
├── SKILL.md          # Natural language instructions for AI
├── skill.py          # Python implementation (optional)
├── requirements.txt  # Dependencies
└── config.yaml       # Configuration
```

### Built-in Skills

| Skill | Category | Description |
|-------|----------|-------------|
| `file_manager` | System | Read, write, organize files |
| `web_browser` | Web | Browse, scrape, interact with websites |
| `email_client` | Communication | Send, receive, manage emails |
| `calendar` | Productivity | Manage events, check availability |
| `code_executor` | Development | Run Python, shell commands |
| `himalaya_email` | Communication | Advanced email via Himalaya |

### Creating Custom Skills

```python
# my_skill/skill.py
from copaw.skills import BaseSkill

class MyCustomSkill(BaseSkill):
    name = "my_custom_skill"
    description = "Does something useful"
    
    async def execute(self, context: dict) -> str:
        # Your skill logic
        return "Task completed!"
```

### Skill Auto-Loading

Place skills in your workspace directory:
```
~/.copaw/workspace/skills/
├── my-skill-1/
├── my-skill-2/
└── ...
```

CoPaw automatically discovers and loads skills on startup.

---

## Installation & Setup

### Method 1: pip Install (Recommended)

```bash
# Install CoPaw
pip install copaw

# Initialize with defaults
copaw init --defaults

# Start the application
copaw app

# Open browser to http://127.0.0.1:8088
```

### Method 2: Script Install (No Python Required)

**macOS / Linux:**
```bash
curl -fsSL https://copaw.agentscope.io/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://copaw.agentscope.io/install.ps1 | iex
```

**With Local Model Support:**
```bash
# Ollama support
curl -fsSL https://copaw.agentscope.io/install.sh | bash -s -- --extras ollama

# llama.cpp support
curl -fsSL https://copaw.agentscope.io/install.sh | bash -s -- --extras llamacpp

# MLX support (Apple Silicon)
curl -fsSL https://copaw.agentscope.io/install.sh | bash -s -- --extras mlx
```

### Method 3: Desktop Application (Beta)

Download from [GitHub Releases](https://github.com/agentscope-ai/CoPaw/releases):
- **Windows**: `CoPaw-Setup-<version>.exe`
- **macOS**: `CoPaw-<version>-macOS.zip`

> ⚠️ First launch may take 10-60 seconds for initialization.

---

## Advanced Configuration

### LLM Provider Configuration

CoPaw supports multiple LLM providers:

| Provider | Configuration |
|----------|---------------|
| **OpenAI** | API key + base URL |
| **Anthropic** | API key |
| **DeepSeek** | API key + base URL |
| **Qwen (Alibaba)** | DashScope API key |
| **Ollama** | Local server URL |
| **LM Studio** | Local server URL |
| **llama.cpp** | Model path |
| **MLX** | Model path (Apple Silicon) |

### Environment Variables

```bash
# LLM Configuration
export LLM_API_KEY="sk-xxx"
export LLM_BASE_URL="https://api.openai.com/v1"

# Embedding Configuration (for memory search)
export EMBEDDING_API_KEY="sk-xxx"
export EMBEDDING_BASE_URL="https://api.openai.com/v1"

# China Mirror (for faster downloads in China)
export COPAW_PYPI_MIRROR="https://pypi.tuna.tsinghua.edu.cn/simple"
```

### Token Usage Tracking

v0.0.7 includes a token usage dashboard:

```python
# View in Console → Settings → Token Usage
# Or programmatically:
from copaw import get_token_stats

stats = get_token_stats()
print(f"Total tokens: {stats['total']}")
print(f"Cost estimate: ${stats['cost_estimate']:.2f}")
```

---

## Use Case Gallery

### Social Media Digest

```
"Every morning at 8am, collect hot posts from 
Xiaohongshu and Zhihu, summarize them, and 
send to my DingTalk"
```

### Video Summarization

```
"Summarize this Bilibili video and extract key points:
https://www.bilibili.com/video/xxx"
```

### Research Assistant

```
"Monitor ArXiv for new papers on 'AI Agents'. 
Every week, create a summary of the top 10 
most cited papers and add to my knowledge base"
```

### Creative Writing

```
"I want to write a blog post about OpenClaw. 
Research the topic overnight and have a draft 
ready for me tomorrow morning"
```

### Desktop Automation

```
"Organize my Downloads folder:
- Move PDFs to Documents/Papers
- Move images to Pictures/Downloads
- Delete files older than 30 days"
```

### Contact Management

```
"Extract all contacts from my email signatures 
and calendar invites from the past month, 
then create a CSV file"
```

---

## Security Features

### Tool Guard (v0.0.7+)

Blocks risky tool calls until explicit user approval:

```
┌────────────────────────────────────────┐
│  Tool Guard Alert                      │
├────────────────────────────────────────┤
│  CoPaw wants to:                       │
│  • Delete file: ~/Documents/report.pdf │
│                                        │
│  [Always Allow] [Allow Once] [Deny]    │
└────────────────────────────────────────┘
```

### Permission Levels

| Level | Operations | Default |
|-------|------------|---------|
| 1 | Read files, fetch data | ✅ Allowed |
| 2 | Create files, send messages | ⚠️ Ask once |
| 3 | Modify files | ⚠️ Ask once |
| 4 | Execute commands | ❌ Always ask |
| 5 | System changes | ❌ Always ask |

### Audit Logging

All agent actions are logged:
```
~/.copaw/logs/
├── actions.log      # All tool executions
├── decisions.log    # Agent reasoning traces
└── errors.log       # Error records
```

---

## Troubleshooting

### Common Issues

**Q: First launch takes too long**
- Normal for first run (10-60 seconds)
- Check internet connection for model downloads
- Try `copaw init --defaults` to reset

**Q: Channel authentication fails**
- DingTalk: Check app credentials in DingTalk Open Platform
- Discord: Ensure bot token has required permissions
- WeChat: Use QClaw for WeChat integration (not directly supported)

**Q: Memory not persisting**
- Check `working_dir/` permissions
- Verify `MEMORY.md` exists
- Run `copaw init` to reinitialize

**Q: High memory usage**
- ReMe memory optimization is ongoing
- Consider reducing `memory_compact_threshold`
- Use `copaw config set memory.vector_enabled false` to disable vector search

### Getting Help

- **GitHub Issues**: [github.com/agentscope-ai/CoPaw/issues](https://github.com/agentscope-ai/CoPaw/issues)
- **Discord Community**: Join the AgentScope Discord
- **Documentation**: [copaw.agentscope.io/docs](https://copaw.agentscope.io/docs)

---

## Changelog Highlights (v0.0.7)

### New Features
- 🛡️ Tool Guard security layer
- 📊 Token usage tracking dashboard
- 🔌 Mattermost & Matrix integrations
- 🎯 @mention-only group filtering
- 🔄 LLM call auto-retry with exponential backoff
- 📁 Workspace file drag-and-drop
- 🤖 Agent language selector

### Improvements
- Provider connection test messages
- Async workspace operations
- Built-in skill documentation
- Memory docs reorganization

### Bug Fixes
- DingTalk auth failure cleanup
- Discord 2000-char message splitting
- Windows shell encoding issues
- Desktop SSL certificate handling

---

*Last Updated: March 2026*

## Related

- [[15_智能体/07_Agent_Evaluation/Agent_Harness_Complete_2026.md|Agent_Harness_Complete_2026]]
- [[15_智能体/07_Agent_Evaluation/Agent_Red_Teaming_2026.md|Agent_Red_Teaming_2026]]
- [[15_智能体/07_Agent_Evaluation/Assessment/Evaluation_Workflow.md|Evaluation_Workflow]]
- [[15_智能体/07_Agent_Evaluation/Assessment/Production_Assessment.md|Production_Assessment]]
- [[15_智能体/07_Agent_Evaluation/Benchmarking/Benchmarking_Criteria.md|Benchmarking_Criteria]]
