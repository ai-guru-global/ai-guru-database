---
tier: peripheral
title: Claude 成本优化与性能调优
category: ai-coding
tags: [claude, cost-optimization, token, prompt-caching, context-management, routing]
source: yeasy/claude_guide/10_optimization
sources: []
name_zh: "Claude 成本优化与性能调优"
---

# Claude 成本优化与性能调优

> 中文简称：Claude 成本优化与性能调优

> 一句话理解：Token 是新的电力——理解计费公式、用好 Prompt Caching、管好上下文窗口，是让 AI 应用从"能用"到"划算"的关键。

## 1. Token 计费原理

### 什么是 Token

- 英文：~0.75 个单词 ≈ 1 token
- 中文：消耗高于直觉估计，以官方 tokenizer 为准
- 实战建议：用 `client.messages.count_tokens()` 在发送前精确统计

### 计费公式

```text
Total Cost = (Input Tokens × P_in) + (Output Tokens × P_out)
```

关键洞察：**输出单价通常高于输入**。读大量上下文未必最贵，写长答案/长思维链往往更贵。

### 模型家族分层

| 家族 | 定位 | 适合任务 |
|------|------|---------|
| **Haiku 类** | 极速轻量，成本最低 | 分类、提取、改写、简单问答 |
| **Sonnet 类** | 均衡主力 | 编程、分析、通用生产 |
| **Opus 类** | 高质量强推理 | 复杂规划、难例、深度推理 |

### 隐藏成本

1. **思考/推理开销**：开启 thinking 后，额外 Token 按输出计费
2. **错误重试**：Agent 失败触发额外轮次
3. **Context 膨胀**：多轮对话历史线性累积推高输入成本

### 批量处理 (Message Batches)

- 官方对所有用量按标准 API 的 **50% 计费**
- 异步打包处理，24 小时内未完成的不计费
- 适合：大规模文档抽取、翻译、评测批量评分

## 2. Prompt Caching 提示缓存

### 核心原理

"只要前缀（Prefix）不变，K/V 矩阵就不变" → 冻结 KV Cache 在显存中复用。

```text
无缓存：每次请求，GPU 重算所有 Token 的 K/V 矩阵
有缓存：首次计算后冻结，后续请求直接复用 → 省算力 + 降延迟
```

### 计费模型

| 状态 | 成本 | 说明 |
|------|------|------|
| Cache Write | 1.25x 普通输入 | 首次写入或过期后重写 |
| Cache Read | **0.1x 普通输入** | 命中缓存，便宜 90% |

盈亏平衡点：**1 次缓存读取后即回本**（5 分钟缓存）。

### 最佳实践：静态在前，动态在后

```text
[Cache 1] System Prompt + Tool Definition    ← 最稳定，所有用户共用
[Cache 2] 长文档 / 代码库                      ← 相对稳定
[Cache 3] 对话历史                             ← 逐步增长
[No Cache] 当前用户提问                        ← 完全动态
```

即使历史变了，前面的 System 和 Docs 依然命中缓存。

### TTL 选择

| 缓存类型 | TTL | 写入成本 | 读取成本 | 适用场景 |
|---------|-----|---------|---------|---------|
| 5 分钟 | 5 min | 1.25x | 0.1x | 高频对话、开发者迭代 |
| 1 小时 | 60 min | 2x | 0.1x | 低频长上下文回访 |

### 冷启动防羊群效应

```python
# ❌ 1000 并发同时未命中 → 全部 1.25x
results = await asyncio.gather(*[call_claude(q) for q in queries])

# ✅ 先预热，再放量
await call_claude(queries[0])  # 只有一次写入
results = await asyncio.gather(*[call_claude(q) for q in queries[1:]])  # 全部 0.1x
```

### 毁掉缓存的三条反模式

| 反模式 | 正确做法 |
|--------|---------|
| 会话中途增删工具 | 始终预加载全部工具定义 |
| 中途切换模型 | 一个会话绑定一个模型 |
| 为改状态修改前缀 | 在下一条用户消息中追加标签 |

### Claude Code 的缓存架构

系统提示词分三层：

```text
全局静态层 → 所有用户共享（命中率最高）
组织/用户层 → 同一组织内共享（CLAUDE.md, MCP 配置）
会话动态层 → 每次变化（Git 状态, 命令历史）
```

30 分钟编程会话：无缓存 ~$6.00 → 有缓存 ~$1.14（节省 ~81%）。

### 监控指标

```python
cache_efficiency = cache_read / (cache_read + cache_created + normal_input)
# 目标: >80%，低于此检查反模式
```

## 3. 上下文窗口管理

### 策略选择

| 策略 | 说明 | 适用 |
|------|------|------|
| **滑动窗口** | 只保留最近 N 轮 | 简单对话 |
| **摘要压缩** | 用 LLM 压缩历史为摘要 | 长会话 |
| **分层记忆** | 关键事实存独立记忆 | Agent 系统 |
| **选择性遗忘** | 删除低价值轮次 | 多工具调用场景 |

## 4. 模型路由

### 智能路由架构

```text
用户请求 → 分类器（Haiku，成本极低）
  ├→ 简单问题 → Haiku（最便宜）
  ├→ 通用任务 → Sonnet（均衡）
  └→ 复杂推理 → Opus（最强）
```

关键：用小模型分类，大模型只处理难题。80% 的请求用 Haiku 即可解决。

## 相关页面

- [[16_编程/05_开发工具/02_Claude_Code_深入分析]] — Claude Code 深入（含缓存架构详解）
- [[16_编程/05_开发工具/03_Claude_完整_指南]] — Claude 完整指南
- [[inference-performance]] — 推理性能概念
- [[kv-cache-compression]] — KV Cache 压缩

## Related

- [[16_编程/README|编程 (AI Coding)]]
