---
title: "OpenClaw Technical Deep Dive: Architecture, Internals & Implementation"
category: "15-agent-production-openclaw-ecosystem"
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "This document provides an in-depth technical analysis of OpenClaw's architecture, internal mechanisms, and implementation details. It is intended for software architects, developer"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Openclaw Technical Deep Dive"
  - "OpenClaw Technical Deep Dive"
  - OpenClaw_Technical_Deep_Dive
sources: []

---
# OpenClaw Technical Deep Dive: Architecture, Internals & Implementation

## Overview

This document provides an in-depth technical analysis of OpenClaw's architecture, internal mechanisms, and implementation details. It is intended for software architects, developers, and engineers who need to understand how OpenClaw works under the hood for customization, integration, or security hardening.

**Version Covered**: OpenClaw 2026.x 
**Last Updated**: March 2026

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Three-Layer Architecture](#three-layer-architecture)
3. [Gateway Layer Deep Dive](#gateway-layer-deep-dive)
4. [Channel Layer Implementation](#channel-layer-implementation)
5. [Agent Runtime & Loop](#agent-runtime--loop)
6. [LLM Layer & Provider System](#llm-layer--provider-system)
7. [Memory System Architecture](#memory-system-architecture)
8. [Tool Execution & Sandboxing](#tool-execution--sandboxing)
9. [Skill System Specification](#skill-system-specification)
10. [Security Architecture](#security-architecture)
11. [Source Code Structure](#source-code-structure)
12. [Configuration & Bootstrap](#configuration--bootstrap)

---

## Executive Summary

OpenClaw is an open-source, self-hosted AI agent framework that transforms large language models into persistent, tool-using assistants with real-world integrations. Unlike simple chatbot wrappers that proxy API calls, OpenClaw implements a **full agent runtime** with:

- Session management and state persistence
- Memory systems (short-term, long-term, working)
- Context window optimization and compaction
- Multi-channel messaging (WhatsApp, Telegram, Discord, Slack, etc.)
- Sandboxed tool execution
- Event-driven extensibility via hooks

### Core Design Philosophy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     OPENCLAW DESIGN PRINCIPLES                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. WORKSPACE-FIRST: Configuration files are source of truth           │
│     - SOUL.md defines agent purpose and behavior                        │
│     - TOOLS.md specifies capabilities                                   │
│     - Version controllable, portable, reproducible                      │
│                                                                         │
│  2. LOCAL-FIRST PRIVACY: Data stays on YOUR machine                    │
│     - Memory stored as plain Markdown files                             │
│     - No cloud dependency for core functionality                        │
│     - Full data ownership and portability                               │
│                                                                         │
│  3. MODULAR EXTENSIBILITY: Layers operate independently                │
│     - Add platforms without touching core logic                         │
│     - Swap LLM providers transparently                                  │
│     - Skills extend capabilities without code changes                   │
│                                                                         │
│  4. SECURITY BY DEFAULT: Treat all execution as untrusted             │
│     - Sandboxed tool execution                                          │
│     - Explicit permission model                                         │
│     - Audit logging for all actions                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Three-Layer Architecture

OpenClaw's architecture is divided into three distinct layers, each with well-defined responsibilities:

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MESSAGING SURFACES                              │
│   WhatsApp · Telegram · Discord · Slack · Signal · iMessage · Web      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ WebSocket / HTTP
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      GATEWAY LAYER (Daemon)                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────────┐ │
│  │   Channel   │ │   Session   │ │   Command   │ │      Plugin       │ │
│  │   Bridges   │ │   Manager   │ │    Queue    │ │      System       │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────────────┘ │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────────┐ │
│  │    Hooks    │ │    Cron     │ │  Heartbeat  │ │   Auth + Trust    │ │
│  │   Engine    │ │  Scheduler  │ │   System    │ │     Manager       │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────────────┘ │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      AGENT RUNTIME (pi-mono)                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────────┐ │
│  │   Prompt    │ │    Tool     │ │ Compaction  │ │      Memory       │ │
│  │  Assembly   │ │  Execution  │ │  Pipeline   │ │      Search       │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────────────┘ │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────────┐ │
│  │  Streaming  │ │  Sub-Agent  │ │    Skill    │ │     Sandbox       │ │
│  │   Engine    │ │   Spawner   │ │   Loader    │ │     Manager       │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────────────┘ │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         LLM PROVIDERS                                   │
│      Anthropic · OpenAI · AWS Bedrock · Google · DeepSeek · Local      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Primary Responsibility | Key Components |
|-------|------------------------|----------------|
| **Gateway** | Session management, message routing | Channel Bridges, Session Manager, Command Queue, Auth |
| **Agent Runtime** | AI inference, tool execution | Prompt Assembly, Tool Execution, Memory, Sandbox |
| **LLM Providers** | Model inference | Provider adapters, streaming, fallback chains |

---

## Gateway Layer Deep Dive

The Gateway is a single long-lived Node.js daemon that owns all state and connections. It's the **central nervous system** of OpenClaw.

### WebSocket-First Protocol

The Gateway exposes a typed WebSocket API on a configurable port (default: `127.0.0.1:18789`). All clients—macOS app, CLI, web UI, mobile nodes, automations—connect over this single WebSocket.

#### Wire Protocol Specification

```
Transport: WebSocket, text frames with JSON payloads

First frame MUST be a connect handshake

Message Types:
├── Request:  { type: "req", id, method, params }
│              → Response: { type: "res", id, ok, payload|error }
│
├── Event:    { type: "event", event, payload, seq?, stateVersion? }
│
└── Idempotency: Required for side-effecting methods (send, agent)
```

#### Connection Lifecycle

```
Client                         Gateway
   │                              │
   │──── req:connect ────────────►│
   │                              │
   │◄──── res (hello-ok) ─────────│  (presence + health snapshot)
   │                              │
   │◄──── event:presence ─────────│
   │                              │
   │◄──── event:tick ─────────────│
   │                              │
   │──── req:agent ──────────────►│
   │                              │
   │◄──── res:agent (ack) ────────│  (runId, status:"accepted")
   │                              │
   │◄──── event:agent ────────────│  (streaming deltas)
   │◄──── event:agent ────────────│
   │◄──── event:agent ────────────│
   │                              │
   │◄──── res:agent (final) ──────│  (runId, status, summary)
   │                              │
```

### Device Pairing & Trust Model

```typescript
// Trust model implementation
interface DeviceTrust {
  // Local connects (loopback/same-host Tailnet) can be auto-approved
  localAutoApprove: boolean;
  
  // Non-local connects must sign challenge nonce
  challengeRequired: boolean;
  
  // Device tokens issued after pairing
  deviceToken: string;
  
  // Gateway auth token applies to all connections
  gatewayToken: string; // OPENCLAW_GATEWAY_TOKEN env var
}

// Connection authentication flow
async function authenticate(connection: WebSocket): Promise<boolean> {
  const { isLocal, deviceId, signature } = await connection.handshake();
  
  if (isLocal && config.localAutoApprove) {
    return true;
  }
  
  // Verify challenge signature
  const challenge = generateChallenge();
  const valid = verifySignature(challenge, signature, deviceId);
  
  if (valid) {
    issueDeviceToken(deviceId);
    return true;
  }
  
  return requireExplicitApproval(deviceId);
}
```

### Session Manager

The Session Manager maintains conversation state across channels and restarts.

#### Session Object Structure

```typescript
interface Session {
  // Unique session identifier
  sessionId: string;
  
  // Session isolation key (based on dmScope)
  sessionKey: string;
  
  // Conversation history (last N messages)
  conversationHistory: Message[];
  
  // Context variables (user settings, temporary data)
  context: Record<string, any>;
  
  // Current state
  state: 'idle' | 'processing' | 'waiting' | 'error';
  
  // Source platform information
  channelInfo: {
    channelId: string;
    platform: 'whatsapp' | 'telegram' | 'discord' | 'slack' | ...;
    userId: string;
  };
  
  // Timestamps
  createdAt: number;
  lastActiveAt: number;
}
```

#### Session Isolation Modes (dmScope)

| Mode | Description | Use Case |
|------|-------------|----------|
| `main` | All DMs share single session | Personal assistant (continuity across devices) |
| `per-peer` | Isolated by sender ID | Multi-user bot |
| `per-channel-peer` | Isolated by channel + sender | Recommended for multi-user, multi-platform |

```typescript
// Session key derivation
function deriveSessionKey(dmScope: DmScope, channelId: string, userId: string): string {
  switch (dmScope) {
    case 'main':
      return 'main';
    case 'per-peer':
      return `peer:${userId}`;
    case 'per-channel-peer':
      return `channel:${channelId}:peer:${userId}`;
  }
}
```

### Command Queue Architecture

The Command Queue prevents concurrent agent runs from colliding using a **lane-aware FIFO queue**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        COMMAND QUEUE ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                    Global Lane (main)                             │ │
│  │                    maxConcurrent: 4 (configurable)                │ │
│  │                                                                   │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │  Session Lane (per session key)                             │ │ │
│  │  │  concurrency: 1 (strict serial)                             │ │ │
│  │  │  [msg1] → [msg2] → [msg3]                                   │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  │                                                                   │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │  Sub-agent Lane                                             │ │ │
│  │  │  concurrency: 8                                             │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  │                                                                   │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │  Cron Lane                                                  │ │ │
│  │  │  parallel with main                                         │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Queue Interaction Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| `collect` | Coalesce queued messages into single followup turn | Default behavior |
| `steer` | Inject into current run, cancel pending tool calls | Urgent interruption |
| `followup` | Wait for current run to end, then start new turn | Sequential tasks |
| `steer-backlog` | Steer now AND preserve for followup | Complex workflows |

```typescript
class MessageQueue {
  private activeJobs: number = 0;
  private maxConcurrency: number = 4;
  private waitingQueue: QueueItem[] = [];
  
  async enqueue(session: Session, message: Message): Promise<void> {
    if (this.activeJobs >= this.maxConcurrency) {
      this.waitingQueue.push({ session, message });
      return;
    }
    
    this.activeJobs++;
    try {
      await this.process(session, message);
    } catch (error) {
      await this.retryWithBackoff(session, message);
    } finally {
      this.activeJobs--;
      this.processNext();
    }
  }
  
  private async retryWithBackoff(session: Session, message: Message, attempt = 1): Promise<void> {
    const delays = [1000, 2000, 4000]; // Exponential backoff
    if (attempt > delays.length) throw new Error('Max retries exceeded');
    
    await sleep(delays[attempt - 1]);
    return this.process(session, message);
  }
}
```

---

## Channel Layer Implementation

The Channel layer adapts different messaging platform formats to a standardized internal representation using the **Adapter Pattern**.

### Standardized Message Interface

```typescript
interface StandardMessage {
  // Unified identifiers
  messageId: string;
  userId: string;
  channelId: string;
  
  // Content
  content: string;
  contentType: 'text' | 'image' | 'audio' | 'video' | 'file';
  attachments?: Attachment[];
  
  // Context
  threadId?: string;
  replyTo?: string;
  mentions?: string[];
  
  // Metadata
  timestamp: number;
  platform: Platform;
  raw: any; // Original platform message
}

interface Attachment {
  type: 'image' | 'audio' | 'video' | 'file';
  url: string;
  filename?: string;
  mimeType?: string;
  size?: number;
}
```

### Channel Adapter Implementation

```typescript
// Base Channel interface
interface Channel {
  // Lifecycle
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  
  // Message handling
  adaptMessage(rawMessage: any): StandardMessage;
  sendMessage(channelId: string, content: string, options?: SendOptions): Promise<void>;
  
  // Routing
  shouldRespond(message: StandardMessage): boolean;
}

// WhatsApp Channel implementation (via Baileys)
class WhatsAppChannel implements Channel {
  private client: WAClient;
  
  adaptMessage(raw: WAMessage): StandardMessage {
    return {
      messageId: raw.key.id,
      userId: raw.key.remoteJid.split('@')[0],
      channelId: raw.key.remoteJid,
      content: raw.message?.conversation || raw.message?.extendedTextMessage?.text || '',
      contentType: this.detectContentType(raw),
      timestamp: raw.messageTimestamp * 1000,
      platform: 'whatsapp',
      raw
    };
  }
  
  shouldRespond(message: StandardMessage): boolean {
    const isDM = !message.channelId.endsWith('@g.us');
    
    if (isDM) {
      return this.checkDmPolicy(message.userId);
    }
    
    // Group chat: check if bot was mentioned
    return message.mentions?.includes(this.botId) ?? false;
  }
}

// Telegram Channel implementation (via grammY)
class TelegramChannel implements Channel {
  private bot: Bot;
  
  adaptMessage(ctx: Context): StandardMessage {
    const msg = ctx.message;
    return {
      messageId: String(msg.message_id),
      userId: String(msg.from.id),
      channelId: String(msg.chat.id),
      content: msg.text || '',
      contentType: 'text',
      timestamp: msg.date * 1000,
      platform: 'telegram',
      raw: msg
    };
  }
}
```

### Routing Rules Configuration

```yaml
# Channel routing configuration
channels:
  whatsapp:
    enabled: true
    dmPolicy: allowlist      # pairing | allowlist | open | disabled
    mentionGating: true      # Only respond when @mentioned in groups
    allowlist:
      - "+1234567890"
      - "+0987654321"
      
  telegram:
    enabled: true
    dmPolicy: open
    mentionGating: true
    
  discord:
    enabled: true
    dmPolicy: pairing
    mentionGating: true
    guildIds:
      - "123456789012345678"
```

---

## Agent Runtime & Loop

The Agent Runtime is the core execution engine that processes messages and orchestrates tool execution.

### The Agentic Loop

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         AGENT LOOP LIFECYCLE                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────┐                                                     │
│   │   PERCEIVE   │◄─────────────────────────────────────────┐          │
│   │  (Input)     │                                          │          │
│   └──────┬───────┘                                          │          │
│          │                                                   │          │
│          ▼                                                   │          │
│   ┌──────────────┐                                          │          │
│   │    PLAN      │                                          │          │
│   │ (LLM Think)  │                                          │          │
│   └──────┬───────┘                                          │          │
│          │                                                   │          │
│          ▼                                                   │          │
│   ┌──────────────┐     ┌──────────────┐                     │          │
│   │     ACT      │────►│    TOOL      │                     │          │
│   │  (Execute)   │     │  EXECUTION   │                     │          │
│   └──────┬───────┘     └──────┬───────┘                     │          │
│          │                    │                              │          │
│          │◄───────────────────┘                              │          │
│          ▼                                                   │          │
│   ┌──────────────┐                                          │          │
│   │   OBSERVE    │──────────────────────────────────────────┘          │
│   │  (Results)   │         (Loop until task complete                   │
│   └──────┬───────┘          or max iterations)                         │
│          │                                                              │
│          ▼                                                              │
│   ┌──────────────┐                                                     │
│   │ COMMUNICATE  │                                                     │
│   │  (Response)  │                                                     │
│   └──────────────┘                                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Prompt Assembly System

OpenClaw builds custom system prompts for every agent run. This is not a static string—it's dynamically assembled from multiple sources:

```typescript
interface PromptComponents {
  // Core identity
  soul: string;              // From SOUL.md
  identity: string;          // From IDENTITY.md
  
  // Capabilities
  tools: ToolDefinition[];   // Available tools + descriptions
  skills: SkillManifest[];   // Available skills with file paths
  
  // Safety & constraints
  safety: string;            // Guardrails and restrictions
  replyTags: string;         // Output format requirements
  
  // Context
  workspace: WorkspaceInfo;  // Workspace structure info
  datetime: string;          // Current date/time (timezone-aware)
  
  // Runtime metadata
  heartbeat: HeartbeatConfig; // Execution contract
  documentation: string[];    // Relevant doc pointers
}

function assembleSystemPrompt(components: PromptComponents): string {
  return `
${components.soul}

## Identity
${components.identity}

## Available Tools
${formatTools(components.tools)}

## Available Skills
${formatSkills(components.skills)}

## Safety Guidelines
${components.safety}

## Workspace
${formatWorkspace(components.workspace)}

## Current Time
${components.datetime}

## Response Format
${components.replyTags}

## Heartbeat Contract
${components.heartbeat}
`.trim();
}
```

### Streaming Response Engine

```typescript
class StreamingEngine {
  async *streamResponse(
    provider: LLMProvider,
    messages: Message[],
    tools: Tool[]
  ): AsyncGenerator<StreamDelta> {
    const stream = provider.createStream({
      messages,
      tools: tools.map(t => t.definition),
      stream: true
    });
    
    let buffer = '';
    let toolCalls: ToolCall[] = [];
    
    for await (const chunk of stream) {
      if (chunk.type === 'text') {
        buffer += chunk.content;
        yield { type: 'text', content: chunk.content };
      }
      
      if (chunk.type === 'tool_call') {
        toolCalls.push(chunk.toolCall);
        yield { type: 'tool_call', toolCall: chunk.toolCall };
      }
      
      if (chunk.type === 'tool_result') {
        yield { type: 'tool_result', result: chunk.result };
      }
    }
    
    yield { type: 'complete', text: buffer, toolCalls };
  }
}
```

---

## LLM Layer & Provider System

The LLM Layer implements a **plugin-based Provider system** for model abstraction.

### Provider Interface

```typescript
interface LLMProvider {
  // Identification
  name: string;
  supportedModels: string[];
  
  // Capabilities
  supportsStreaming: boolean;
  supportsTools: boolean;
  supportsVision: boolean;
  
  // Core methods
  complete(request: CompletionRequest): Promise<CompletionResponse>;
  createStream(request: CompletionRequest): AsyncGenerator<StreamChunk>;
  
  // Token management
  countTokens(text: string): number;
  getContextLimit(model: string): number;
}

interface CompletionRequest {
  model: string;
  messages: Message[];
  tools?: ToolDefinition[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}
```

### Provider Registration

```typescript
// Provider registry
class ProviderRegistry {
  private providers: Map<string, LLMProvider> = new Map();
  
  register(provider: LLMProvider): void {
    this.providers.set(provider.name, provider);
  }
  
  get(name: string): LLMProvider {
    const provider = this.providers.get(name);
    if (!provider) throw new Error(`Provider ${name} not found`);
    return provider;
  }
  
  // Fallback chain support
  async completeWithFallback(
    request: CompletionRequest,
    providerChain: string[]
  ): Promise<CompletionResponse> {
    for (const providerName of providerChain) {
      try {
        const provider = this.get(providerName);
        return await provider.complete(request);
      } catch (error) {
        console.warn(`Provider ${providerName} failed, trying next...`);
        continue;
      }
    }
    throw new Error('All providers failed');
  }
}

// Built-in providers
registry.register(new AnthropicProvider());
registry.register(new OpenAIProvider());
registry.register(new BedrockProvider());
registry.register(new GoogleProvider());
registry.register(new OllamaProvider());  // Local models
```

### Provider Configuration

```yaml
# LLM provider configuration
llm:
  defaultProvider: anthropic
  defaultModel: claude-sonnet-4-20250514
  
  providers:
    anthropic:
      apiKey: ${ANTHROPIC_API_KEY}
      models:
        - claude-sonnet-4-20250514
        - claude-3-5-sonnet-20241022
        
    openai:
      apiKey: ${OPENAI_API_KEY}
      baseUrl: https://api.openai.com/v1
      models:
        - gpt-4o
        - gpt-4-turbo
        
    ollama:
      baseUrl: http://localhost:11434
      models:
        - llama3.2:latest
        - qwen2.5:7b
        
  fallbackChain:
    - anthropic
    - openai
    - ollama
```

---

## Memory System Architecture

OpenClaw's memory system is built on the principle: **"If it hasn't been written down, the agent doesn't remember it."**

### Memory Tiers

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MEMORY ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  WORKING MEMORY (Context Window)                                  │ │
│  │  • Current conversation messages                                  │ │
│  │  • Active task state                                              │ │
│  │  • Fast but limited (model context window)                        │ │
│  │  • ~128K-200K tokens depending on model                           │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                              │                                          │
│                              ▼                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  SHORT-TERM MEMORY (Daily Logs)                                   │ │
│  │  • memory/YYYY-MM-DD.md files                                     │ │
│  │  • Recent interaction summaries                                   │ │
│  │  • Auto-compacted conversation history                            │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                              │                                          │
│                              ▼                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  LONG-TERM MEMORY (MEMORY.md)                                     │ │
│  │  • User preferences and facts                                     │ │
│  │  • Persistent across sessions                                     │ │
│  │  • Manually or automatically curated                              │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                              │                                          │
│                              ▼                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  RETRIEVAL INDEX (Hybrid Search)                                  │ │
│  │  • SQLite FTS for full-text search                                │ │
│  │  • Vector embeddings for semantic search                          │ │
│  │  • Chunked and indexed memory files                               │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### File-Based Memory Structure

```
~/.openclaw/agents/<agentId>/
├── MEMORY.md                    # Long-term facts and preferences
├── memory/
│   ├── 2026-03-18.md           # Daily log
│   ├── 2026-03-17.md
│   └── ...
├── sessions/
│   ├── <sessionKey>/
│   │   ├── history.jsonl       # Full conversation history
│   │   └── context.json        # Session context
│   └── ...
├── skills/
│   └── <installed-skills>/
└── .index/
    ├── fts.db                   # Full-text search index
    └── vectors.db               # Vector embeddings
```

### Context Compaction Pipeline

When the context window fills up, OpenClaw compacts older messages into summaries:

```typescript
interface CompactionPipeline {
  // Configuration
  contextLimit: number;          // Model's context window
  compactionThreshold: number;   // When to trigger (e.g., 0.8 = 80%)
  reserveTokens: number;         // Tokens to keep for new messages
  
  // Process
  async compact(messages: Message[]): Promise<CompactedContext> {
    const totalTokens = this.countTokens(messages);
    
    if (totalTokens < this.contextLimit * this.compactionThreshold) {
      return { messages, summary: null };
    }
    
    // Split messages: keep recent, compact old
    const splitPoint = this.findSplitPoint(messages, this.reserveTokens);
    const toCompact = messages.slice(0, splitPoint);
    const toKeep = messages.slice(splitPoint);
    
    // Generate summary of old messages
    const summary = await this.summarize(toCompact);
    
    // Write to daily log
    await this.persistToLog(summary);
    
    return {
      messages: toKeep,
      summary
    };
  }
}
```

### Memory Search Implementation

```typescript
class MemorySearch {
  private fts: SQLiteIndex;
  private vectors: VectorIndex;
  
  async search(query: string, options: SearchOptions = {}): Promise<MemoryChunk[]> {
    const { maxResults = 10, hybridWeight = 0.5 } = options;
    
    // Full-text search
    const ftsResults = await this.fts.search(query, maxResults);
    
    // Vector semantic search
    const embedding = await this.embed(query);
    const vectorResults = await this.vectors.search(embedding, maxResults);
    
    // Hybrid ranking
    const combined = this.hybridRank(ftsResults, vectorResults, hybridWeight);
    
    return combined.slice(0, maxResults);
  }
  
  private hybridRank(
    fts: SearchResult[],
    vectors: SearchResult[],
    weight: number
  ): SearchResult[] {
    const scores = new Map<string, number>();
    
    for (const result of fts) {
      scores.set(result.id, (scores.get(result.id) || 0) + (1 - weight) * result.score);
    }
    
    for (const result of vectors) {
      scores.set(result.id, (scores.get(result.id) || 0) + weight * result.score);
    }
    
    return Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id, score]) => ({ id, score }));
  }
}
```

---

## Tool Execution & Sandboxing

OpenClaw implements a multi-layered security model for tool execution.

### Tool Policy System

```yaml
# Tool policy configuration
tools:
  # Global allowlist
  allow:
    - read
    - write
    - web_search
    - shell:ls
    - shell:cat
    
  # Global denylist (takes precedence)
  deny:
    - shell:rm
    - shell:sudo
    
  # Sandbox configuration
  sandbox:
    mode: non-main    # off | non-main | all
    docker:
      image: openclaw/sandbox:latest
      mountWorkspace: readonly  # readonly | readwrite | none
      networkAccess: false
      
  # Elevated tools (always run on host)
  elevated:
    - shell:brew
    - shell:pip
```

### Sandbox Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      SANDBOX EXECUTION MODEL                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Sandbox Modes:                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  OFF: All tools run directly on host                            │   │
│  │       ⚠️ Maximum risk, full host access                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  NON-MAIN: Secondary sessions sandboxed, main on host           │   │
│  │       ✅ Recommended default                                     │   │
│  │       • Group chats → Docker container                           │   │
│  │       • Secondary threads → Docker container                     │   │
│  │       • Primary DM session → Host (trusted)                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ALL: Every tool call runs in container                         │   │
│  │       🔒 Maximum isolation                                       │   │
│  │       • Workspace mounted as read-only                           │   │
│  │       • Network access disabled by default                       │   │
│  │       • Clean container per session                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Elevated Mode (escape hatch):                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Tools flagged as "elevated" ALWAYS run on host                 │   │
│  │  • Still subject to tool policy allowlist                        │   │
│  │  • Use for tools requiring direct host access                    │   │
│  │  • Examples: brew install, system config                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Tool Execution Flow

```typescript
class ToolExecutor {
  async execute(tool: Tool, args: any, context: ExecutionContext): Promise<ToolResult> {
    // 1. Check tool policy
    if (!this.isAllowed(tool.name, context)) {
      return { error: `Tool ${tool.name} not allowed by policy` };
    }
    
    // 2. Determine execution environment
    const usesSandbox = this.shouldSandbox(tool, context);
    
    // 3. Execute
    if (usesSandbox) {
      return this.executeInSandbox(tool, args, context);
    } else if (this.isElevated(tool.name)) {
      return this.executeOnHost(tool, args, context);
    } else {
      return this.executeOnHost(tool, args, context);
    }
  }
  
  private async executeInSandbox(
    tool: Tool,
    args: any,
    context: ExecutionContext
  ): Promise<ToolResult> {
    const container = await this.docker.create({
      image: this.config.sandbox.docker.image,
      mounts: this.getMounts(context),
      network: this.config.sandbox.docker.networkAccess ? 'bridge' : 'none',
      timeout: 300000 // 5 minutes
    });
    
    try {
      const result = await container.exec(tool.command, args);
      return { output: result.stdout, error: result.stderr };
    } finally {
      await container.remove();
    }
  }
}
```

---

## Skill System Specification

Skills are versioned capability bundles that extend agent functionality.

### Skill File Format

```
skill-name/
├── SKILL.md              # Required: Instructions + metadata
├── skill.py              # Optional: Python tools
├── tools/                # Optional: Additional tools
│   ├── tool1.py
│   └── tool2.js
├── prompts/              # Optional: Prompt templates
│   └── template.md
├── requirements.txt      # Optional: Python dependencies
├── package.json          # Optional: Node.js dependencies
├── .clawhubignore        # Optional: Files to exclude from publish
└── README.md             # Optional: Human documentation
```

### SKILL.md Specification

```markdown
---
# Required metadata
name: todoist-cli
description: Manage Todoist tasks, projects, and labels from the command line.
version: 1.2.0

# Runtime requirements
metadata:
  openclaw:
    requires:
      env:
        - TODOIST_API_KEY      # Required environment variables
      bins:
        - curl                 # Required CLI binaries
      anyBins:
        - jq                   # At least one must exist
      config:
        - ~/.todoistrc         # Config files skill reads
    
    # Primary credential for this skill
    primaryEnv: TODOIST_API_KEY
    
    # Display options
    emoji: "✅"
    homepage: https://github.com/example/todoist-cli
    
    # OS restrictions
    os: ["macos", "linux"]
    
    # Skill always active (no explicit install needed)
    always: false
    
    # Install specs for dependencies
    install:
      - kind: brew
        formula: jq
        bins: [jq]
      - kind: node
        package: typescript
        bins: [tsc]
---

# Todoist CLI Skill

## Purpose
You are a Todoist task management assistant. Help users manage their tasks,
projects, and labels through natural conversation.

## Capabilities
- Create, update, and complete tasks
- Organize tasks into projects
- Add labels and due dates
- Search and filter tasks

## When to Use
Use this skill when the user wants to:
- Add a task or todo item
- Check their task list
- Mark tasks as complete
- Organize their projects

## Process
1. Parse user intent (create, read, update, delete)
2. Extract task details (title, project, due date, labels)
3. Execute appropriate Todoist API call
4. Confirm action to user

## API Usage
Use curl to interact with Todoist REST API:
```bash
curl -X POST "https://api.todoist.com/rest/v2/tasks" \
 -H "Authorization: Bearer $TODOIST_API_KEY" \
 -H "Content-Type: application/json" \
 -d '{"content": "Task title", "project_id": "123"}'
```

## Important Rules
- Always confirm destructive actions before executing
- Handle API errors gracefully
- Respect rate limits (450 requests/15 minutes)
```

### Skill Loader Implementation

```typescript
class SkillLoader {
  private skills: Map<string, Skill> = new Map();
  
  async loadFromWorkspace(workspacePath: string): Promise<void> {
    const skillsDir = path.join(workspacePath, 'skills');
    const skillFolders = await fs.readdir(skillsDir);
    
    for (const folder of skillFolders) {
      const skillPath = path.join(skillsDir, folder);
      const skill = await this.loadSkill(skillPath);
      if (skill) {
        this.skills.set(skill.name, skill);
      }
    }
  }
  
  private async loadSkill(skillPath: string): Promise<Skill | null> {
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    
    if (!await fs.exists(skillMdPath)) {
      return null;
    }
    
    const content = await fs.readFile(skillMdPath, 'utf-8');
    const { frontmatter, body } = this.parseFrontmatter(content);
    
    // Validate requirements
    await this.validateRequirements(frontmatter.metadata?.openclaw?.requires);
    
    return {
      name: frontmatter.name,
      version: frontmatter.version,
      description: frontmatter.description,
      instructions: body,
      metadata: frontmatter.metadata?.openclaw,
      path: skillPath
    };
  }
  
  private async validateRequirements(requires: Requirements): Promise<void> {
    if (requires?.env) {
      for (const envVar of requires.env) {
        if (!process.env[envVar]) {
          console.warn(`Skill requires ${envVar} but it's not set`);
        }
      }
    }
    
    if (requires?.bins) {
      for (const bin of requires.bins) {
        if (!await this.binExists(bin)) {
          throw new Error(`Required binary ${bin} not found`);
        }
      }
    }
  }
}
```

---

## Security Architecture

### Threat Model Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        OPENCLAW THREAT MODEL                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Trust Boundaries:                                                      │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  UNTRUSTED                                                     │    │
│  │  • User input (prompt injection)                               │    │
│  │  • ClawHub skills (arbitrary code)                             │    │
│  │  • External API responses                                      │    │
│  │  • Network traffic                                             │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              │                                          │
│                              ▼                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  VALIDATION LAYER                                              │    │
│  │  • Input sanitization                                          │    │
│  │  • Tool policy enforcement                                     │    │
│  │  • Skill verification                                          │    │
│  │  • Sandbox isolation                                           │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              │                                          │
│                              ▼                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  TRUSTED                                                       │    │
│  │  • Gateway process                                             │    │
│  │  • Host filesystem (workspace only)                            │    │
│  │  • Configured credentials                                      │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Security Controls Matrix

| Threat | Control | Implementation |
|--------|---------|----------------|
| Prompt injection | Input validation | Sanitize user input, separate data from instructions |
| Malicious skills | Skill audit | VirusTotal integration, metadata verification |
| Credential theft | Secret management | Environment variables, encrypted storage |
| Unauthorized access | Authentication | Gateway token, device pairing |
| Data exfiltration | Network policy | Sandbox network isolation |
| Privilege escalation | Tool policy | Allowlist, sandbox, elevated mode |
| Session hijacking | Session isolation | Per-channel-peer sessions, encrypted tokens |

### Hardening Checklist

```yaml
# Production hardening configuration
security:
  # Gateway authentication
  gateway:
    token: ${OPENCLAW_GATEWAY_TOKEN}  # Required in production
    bindAddress: 127.0.0.1            # Don't expose externally
    
  # Tool execution
  tools:
    sandbox:
      mode: all                       # Maximum isolation
      docker:
        networkAccess: false
        mountWorkspace: readonly
    elevated: []                      # Minimize elevated tools
    
  # Skill management
  skills:
    allowRemoteInstall: false         # Disable remote skill install
    auditOnInstall: true              # VirusTotal scan
    
  # Logging
  audit:
    enabled: true
    logAllToolCalls: true
    logAllLLMCalls: true
    retentionDays: 90
```

---

## Source Code Structure

### Repository Layout

```
openclaw/
├── packages/
│   ├── gateway/              # Gateway daemon
│   │   ├── src/
│   │   │   ├── channels/     # Channel adapters
│   │   │   ├── session/      # Session management
│   │   │   ├── queue/        # Command queue
│   │   │   ├── hooks/        # Hook engine
│   │   │   └── auth/         # Authentication
│   │   └── package.json
│   │
│   ├── runtime/              # Agent runtime (pi-mono)
│   │   ├── src/
│   │   │   ├── agent/        # Agent loop
│   │   │   ├── prompt/       # Prompt assembly
│   │   │   ├── tools/        # Tool execution
│   │   │   ├── memory/       # Memory system
│   │   │   └── sandbox/      # Sandboxing
│   │   └── package.json
│   │
│   ├── providers/            # LLM providers
│   │   ├── anthropic/
│   │   ├── openai/
│   │   ├── bedrock/
│   │   └── ollama/
│   │
│   ├── cli/                  # CLI tool
│   ├── desktop/              # Desktop app (Electron)
│   ├── web/                  # Web UI
│   └── schema/               # Shared types and schemas
│
├── skills/                   # Built-in skills
│   ├── web-search/
│   ├── file-manager/
│   └── ...
│
├── docs/
├── docker/
└── package.json
```

---

## Configuration & Bootstrap

### Workspace Kernel Files

```
~/.openclaw/
├── config.yaml              # Main configuration
├── agents/
│   └── <agentId>/
│       ├── SOUL.md          # Agent purpose and behavior
│       ├── IDENTITY.md      # Personalization
│       ├── TOOLS.md         # Tool capabilities
│       ├── HEARTBEAT.md     # Execution config
│       └── ...
└── ...
```

### SOUL.md (Agent Identity)

```markdown
# Agent Soul

You are a helpful AI assistant. Your purpose is to assist users with
their daily tasks, answer questions, and help them be more productive.

## Core Values
- Be helpful, harmless, and honest
- Respect user privacy
- Ask clarifying questions when needed
- Admit when you don't know something

## Behavioral Guidelines
- Use casual but professional tone
- Be concise but thorough
- Proactively offer relevant suggestions
- Remember user preferences

## Constraints
- Never share user data with third parties
- Always ask before executing destructive actions
- Respect rate limits and API quotas
```

### HEARTBEAT.md (Execution Config)

```markdown
# Heartbeat Configuration

## Execution Limits
- Maximum iterations per run: 20
- Tool call timeout: 300 seconds
- Maximum tool calls per run: 50

## Checkpoints
- Save state every 5 iterations
- Persist memory after each session

## Recovery
- On error: retry with exponential backoff
- On timeout: save state and notify user
- On crash: restore from last checkpoint
```

---

## References

- [OpenClaw GitHub Repository](https://github.com/openclaw/openclaw)
- [ClawHub Skill Registry](https://github.com/openclaw/clawhub)
- [OpenClaw Security Guide](https://nebius.com/blog/posts/openclaw-security)
- [Architecture Deep Dive (Opus 4.6)](https://gist.github.com/royosherove/971c7b4a350a30ac8a8dad41604a95a0)
- [OpenClaw Design Patterns](https://kenhuangus.substack.com/p/openclaw-design-patterns-part-1-of)

---

*Last Updated: March 2026*

## Related

- [[15_智能体/07_Agent_Evaluation/Agent_Harness_Complete_2026.md|Agent_Harness_Complete_2026]]
- [[15_智能体/07_Agent_Evaluation/Agent_Red_Teaming_2026.md|Agent_Red_Teaming_2026]]
- [[15_智能体/07_Agent_Evaluation/Assessment/Evaluation_Workflow.md|Evaluation_Workflow]]
- [[15_智能体/07_Agent_Evaluation/Assessment/Production_Assessment.md|Production_Assessment]]
- [[15_智能体/07_Agent_Evaluation/Benchmarking/Benchmarking_Criteria.md|Benchmarking_Criteria]]
