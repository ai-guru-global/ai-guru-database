---
title: Chunked Prefill 大白话解释
category: -concepts
tags: [inference, prefill, chunked-prefill, scheduling, serving, beginner]
relationships:
  - target: "概念/prefill-plain"
    type: builds_on
  - target: "概念/pd-disaggregation-plain"
    type: alternative_to
  - target: "概念/continuous-batching"
    type: related_to
summary: 用生活化的类比解释 Chunked Prefill：不分机器，但规定"读题必须一口一口读，每读一小口就让正在蹦字的人蹦一个字"，轮流来避免互相打架。
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
aliases:
  - "Chunked Prefill Plain"
  - "chunked prefill plain"
  - "分块预填充 大白话"
sources: []
name_zh: "Chunked Prefill 大白话解释"
---

# Chunked Prefill 大白话解释

> 中文简称：Chunked Prefill 大白话解释

> 一句话：Chunked Prefill = 不分机器，但规定"读题一口一口读，每读一小口就插空让人家蹦一个字"，轮流来，谁都不用干等。

---

## 先懂痛点：和 PD 分离是同一个病

[[概念/prefill-plain|Prefill（读题）]]一口气读长文章时，会把正在一个字一个字蹦答案（Decode）的人**堵死**。这个痛点详见 [[概念/pd-disaggregation-plain|PD 分离大白话]]的开头——Chunked Prefill 和 PD 分离是**同一种病的两种治法**。

---

## Chunked Prefill 的解法：时间切片

**大白话：不分柜台，但规定"读题必须一口一口读，每读一小口就让人家蹦一个字，轮流来"。**

```text
传统（一口气读完再回答）：
  读1万字...读1万字...读1万字... [终于读完] → 蹦字蹦字蹦字
  ↑ 回答的人饿死了                    ↑ 读题的人早等完了

Chunked Prefill（一口一口读，交替进行）：
  读500字 → 蹦1个字 → 读500字 → 蹦1个字 → 读500字 → 蹦1个字...
  ↑ 两种活交替，谁都不用干等
```

- 把长文章切成小块（比如每块 512 / 1024 / 2048 token）
- 每读一小块，就**插空**让正在蹦字的人蹦一个字
- 这样没人会被完全堵住

---

## 和 PD 分离的对比

| | Chunked Prefill | [[概念/pd-disaggregation-plain\|PD 分离]] |
|---|---|---|
| 思路 | **时间切片**（一个柜台轮流） | **硬件分开**（两个柜台） |
| 硬件 | 单批机器 | 两批机器（Prefill 池 + Decode 池） |
| 适合 | 中小规模、图省事 | 人多、题长、要极致吞吐 |
| 代价 | 单机天花板有限 | 要跨机器传记忆（KV Cache 迁移） |
| 类比 | 一个窗口但"办一会儿让别人插个队" | 银行分"开户柜台"和"取款柜台" |

**现实里两者经常一起用**：先用 Chunked Prefill 解决基本打架，规模再大就上 PD 分离。

---

## 同样在"系统架构层面"

和 PD 分离一样，Chunked Prefill 也是**推理服务部署者**在系统架构层面决定的事，**不是**会话级或用户级的开关。作为终端用户你感知不到它，只感觉到"长文章输入时回答不会突然卡一下"。

---

## 相关概念

- [[概念/prefill-plain|Prefill 大白话]] — 先理解读题是啥
- [[概念/pd-disaggregation-plain|PD 分离大白话]] — 另一种解法（硬件分开）
- [[概念/continuous-batching|Continuous Batching]] — 同属调度家族
- [[概念/kv-cache-plain|KV Cache 大白话]]
- [[概念/prefill-decode|Prefill/Decode 技术卡]]
- [[10_部署推理/04_Inference_Performance/Disaggregated_Serving_2026|2026 PD 分离前沿]]（含 Chunked Prefill 对比）
