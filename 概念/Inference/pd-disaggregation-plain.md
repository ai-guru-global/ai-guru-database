---
title: PD 分离 大白话解释
category: -concepts
tags: [inference, prefill, decode, disaggregation, serving, architecture, beginner]
relationships:
  - target: "概念/prefill-plain"
    type: builds_on
  - target: "概念/prefill-decode-disaggregation"
    type: simplified_version_of
  - target: "概念/chunked-prefill-plain"
    type: alternative_to
  - target: "概念/kv-cache-plain"
    type: depends_on
summary: 用生活化的类比解释 PD 分离：把"读题"(Prefill)和"回答"(Decode)放到两批不同机器上，避免互相打架。关键澄清——它是系统架构层面的决定，不是会话级或用户级。
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
aliases:
  - "PD Disaggregation Plain"
  - "pd disaggregation plain"
  - "PD分离 大白话"
sources: []
---

# PD 分离 大白话解释

> 一句话：PD 分离 = 把"读题"和"回答"分到两批机器上各干各的，免得它们挤在一起互相打架。

---

## 先懂痛点：读题和回答脾气相反

[[概念/prefill-plain|Prefill（读题）]]和 Decode（回答）干活方式完全不一样：

| | Prefill（读题） | Decode（回答） |
|---|---|---|
| 干活方式 | 一口气读完，吃算力 | 一个字一个字蹦，吃显存 |
| 体型 | 重活（像搬大箱子） | 轻活但磨叽（像数硬币）|

**麻烦**：挤在一台机器上轮流干——你正一个字一个字蹦答案，突然来了个新人要读一篇 1 万字的文章，这台机器得停下帮你读题，**你的回答就卡住**，等他读完才继续蹦。反过来也一样。这就是"互相打架"。

---

## PD 分离的解法：分两个柜台

**大白话：读题的归读题柜台，回答的归回答柜台。**

```text
传统（挤一起）：              PD 分离（分柜台）：
┌─────────────────┐         ┌────────────┐  ┌────────────┐
│ 一台机器         │         │ Prefill 柜台│  │ Decode 柜台 │
│ 读题又蹦答案     │   →     │ 专门读题    │→ │ 专门蹦答案  │
│ 互相打架         │         │ (重活堆这)  │  │ (轻活堆这)  │
└─────────────────┘         └────────────┘  └────────────┘
```

- **读题柜台**（Prefill 池）：强算力机器，专门一口气读长文章
- **回答柜台**（Decode 池）：能塞很多人，因为蹦字这活儿轻，可高密度打包

**关键动作**：读题柜台读完题，把那份"记忆"（[[概念/kv-cache-plain|KV Cache]]）**快递给**回答柜台，回答柜台拿着记忆开始蹦字。

**代价**：快递记忆（KV Cache 跨机器传输）要花时间，所以只有当"打架损失 > 快递成本"时才划算——也就是**人多、题长**的场景。

---

## ⚠️ 关键澄清：PD 分离在哪个层面生效？

> 这是新手最容易误解的地方。PD 分离**不是**会话级、**也不是**用户级的东西。

```text
你可能会误以为的层面        PD 分离到底在哪？
──────────────────────────────────────────
会话级（一次对话）           ✗ 不是
用户级（某用户的配置）       ✗ 不是
模型级（某个模型）           ✗ 也不是
┌──────────────────────────────────────────┐
│ 系统架构级（推理服务怎么部署机房）  ✓ 是这个 │  ← 比上面都底层
└──────────────────────────────────────────┘
```

**通俗讲**：PD 分离是**提供 AI 服务的公司（OpenAI、硅基流动等）在机房里怎么摆机器**的决定，跟终端用户、跟你某一次聊天完全无关。

| 打个比方 | 对应 |
|---|---|
| 你去银行取钱 | = 你用 AI |
| 银行把"开户"和"取款"分两个柜台 | = 推理服务做 PD 分离 |
| 这是**银行总部**的决定，不是你或某个柜员临时定的 | = 系统架构层面 |

**所以**：
- ❌ 不是"这个会话开启 PD 分离，下个会话关掉"（会话级）
- ❌ 不是"你这个用户配置了 PD 分离"（用户级）
- ✓ 是"**这家服务商的推理集群**整体采用 PD 分离架构"——作为用户你感知不到，只感觉到"回答变快了"

### 只有"部署者"才会碰到它

只有当你**自己部署推理服务**（用 vLLM/SGLang 起集群服务别人）时，PD 分离才是你要决定的事。那时它影响"整个集群怎么调度"，仍不是按会话/按用户切换的开关。

---

## 和 Chunked Prefill 的关系

PD 分离有个"省事版表亲"——[[概念/chunked-prefill-plain|Chunked Prefill]]：

| | PD 分离 | Chunked Prefill |
|---|---|---|
| 思路 | **硬件分开**（两个柜台） | **时间切片**（一个柜台轮流） |
| 适合 | 人多、题长、要极致吞吐 | 中小规模、图省事 |
| 代价 | 要传记忆（KV Cache 迁移） | 单机天花板有限 |

现实里两者经常**一起用**：先用 Chunked Prefill 解决基本打架，规模再大就上 PD 分离。

---

## 相关概念

- [[概念/prefill-plain|Prefill 大白话]] — 先理解读题是啥
- [[概念/chunked-prefill-plain|Chunked Prefill 大白话]] — 另一种解法
- [[概念/kv-cache-plain|KV Cache 大白话]] — 要被"快递"的那个记忆
- [[概念/prefill-decode-disaggregation|PD 分离技术卡]] — 完整技术版
- [[概念/prefill-decode|Prefill/Decode 技术卡]]
- [[10_部署推理/04_Inference_Performance/Disaggregated_Serving_2026|2026 PD 分离前沿]]
- [[概念/model-serving|模型服务]] — 系统架构层面的概念
