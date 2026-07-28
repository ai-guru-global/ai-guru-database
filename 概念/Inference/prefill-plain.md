---
title: Prefill 大白话解释
category: -concepts
tags: [inference, prefill, decode, kv-cache, beginner, ttft]
relationships:
  - target: "概念/prefill-decode"
    type: simplified_version_of
  - target: "概念/kv-cache-plain"
    type: builds_on
  - target: "概念/ttft"
    type: determines
  - target: "概念/continuous-batching"
    type: related_to
summary: 用生活化的类比解释 Prefill：大模型回答前先把你输入的内容"读懂"、把关键信息存进 KV Cache 的过程。它决定你等多久才看到第一个字。
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
aliases:
  - "Prefill Plain"
  - "prefill plain"
  - "预填充 大白话"
sources: []
name_zh: "Prefill 大白话解释"
---

# Prefill 大白话解释

> 中文简称：Prefill 大白话解释

> 一句话：Prefill 就是 AI **"读题"** 的阶段——把你输入的内容从头过一遍、读懂，存成一组记忆（KV Cache），准备开始回答。

---

## 直接类比

你问老师一个问题，老师开口回答前，得先把你的话从头到尾过一遍、理解清楚——这个"理解输入"的过程，就是 **prefill**。

| 场景 | 对应 prefill |
|------|-------------|
| 你发一篇 5000 字的文章让 AI 总结 | AI 先把这篇 5000 字从头读一遍 → 这就是 prefill |
| 你问"1+1=" | AI 先读这 4 个字符 → 也是 prefill |

**prefill 阶段做的事**：把你输入的每一个字，依次喂给模型，算出一组"记忆"（叫 [[概念/kv-cache-plain|KV Cache]]），存下来备用。

---

## 为什么要单独拎出来讲？

因为"读题"和"回答"是两个**性质完全不同**的阶段，得用不同方式优化：

| | Prefill（预填充 / 读题） | Decode（解码 / 回答） |
|---|---|---|
| 干啥 | 读懂你的输入 | 一个字一个字往外蹦答案 |
| 特点 | 一次性读完，**费算力** | 逐字生成，**费显存**（要反复读那组记忆） |
| 你感受到的 | 决定"多久才出第一个字"（[[概念/ttft\|TTFT]]） | 决定"回答得多快" |

**一句话总结**：prefill 就是 AI **"读题"**——读得越快，你等第一个字的时间越短；题越长（你输入的字越多），prefill 越久。

---

## 为什么这很重要

工程上很多优化就是专门为了"让读题别卡住回答"而设计的：

- **Chunked Prefill**（分块读题）：题太长时，把读题拆成小块，和回答交替着做，避免一道长题把后面排队的人全堵住 → 详见 [[概念/chunked-prefill-plain|Chunked Prefill 大白话]]
- **PD 分离**：干脆把"读题"和"回答"放到不同的机器上——读题的机器专心读题，回答的机器专心回答，互不干扰 → 详见 [[概念/pd-disaggregation-plain|PD 分离大白话]]

> 这些进阶内容见 [[概念/prefill-decode|Prefill/Decode 技术概念卡]] 和 [[10_部署推理/04_Inference_Performance/Disaggregated_Serving_2026|2026 PD 分离前沿]]。

---

## 和 KV Cache 的关系

prefill 干完活，产出物就是 [[概念/kv-cache-plain|KV Cache]]：

```text
你输入的内容
    ↓  prefill（读题）
KV Cache（一组"记忆"存进显存）
    ↓  decode（回答，反复读这组记忆）
AI 的回答，一个字一个字蹦出来
```

所以 prefill 的速度，直接影响你等多久看到**第一个字**；而 decode 的速度，影响第一个字之后**蹦字有多快**。

---

## 相关概念

- [[概念/prefill-decode|Prefill/Decode 技术概念卡]] — 完整技术版
- [[概念/kv-cache-plain|KV Cache 大白话]] — prefill 产出物的大白话
- [[概念/kv-cache|KV Cache 技术卡]]
- [[概念/ttft|TTFT]] — prefill 决定的核心指标
- [[概念/continuous-batching|Continuous Batching]] — 调度如何处理 prefill/decode
- [[10_部署推理/04_Inference_Performance/Inference_Performance_Fundamentals|推理性能基础]]
- [[10_部署推理/04_Inference_Performance/Disaggregated_Serving_2026|2026 PD 分离前沿]]
