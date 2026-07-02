---
title: "vLLM + PagedAttention 架构链路图"
category: "10-deployment-inference"
tags: ["vllm", "paged-attention", "kv-cache", "architecture", "diagram"]
summary: "> **一句话秒懂**: 一张图看懂 vLLM 怎么用 PagedAttention 把 GPU 显存榨干，从而同时服务更多请求、生成更快。"
created: "2026-06-15"
updated: "2026-06-15"
tier: supporting
aliases:
  - "Vllm Pagedattention Architecture"
  - "vLLM PagedAttention 架构"

---

# vLLM + PagedAttention 架构链路图

> **一句话秒懂**: 一张图看懂 vLLM 怎么用 PagedAttention 把 GPU 显存榨干，从而同时服务更多请求、生成更快。

---

## 核心链路

```mermaid
flowchart LR
    A[多个用户同时提问] --> B[vLLM 推理服务]
    B --> C[Continuous Batching<br/>动态把请求拼成 batch]
    C --> D[PagedAttention]
    D --> E[把 KV Cache 切成小页]
    E --> F[按需分配<br/>前缀共享<br/>减少碎片]
    F --> G[显存利用率从 60% → 95%+]
    G --> H[同一 GPU 同时服务更多请求]
    H --> I[排队少了，生成更快]

    style D fill:#e3f2fd,stroke:#1565c0
    style G fill:#fff3e0,stroke:#f57c00
    style I fill:#e8f5e9,stroke:#2e7d32
```

---

## 链路大白话

```text
1. 很多人同时问问题
        ↓
2. vLLM 不一个个排队处理，而是把大家"拼桌"
        ↓
3. PagedAttention 把每个人的"记忆"（KV Cache）切成小块
        ↓
4. 用多少切多少，共同记得的部分还共用同一块
        ↓
5. 原来空着的显存被填满了
        ↓
6. 所以同一张 GPU 能同时服务更多人，速度也就更快
```

---

## 对比：传统连续分配 vs PagedAttention

```text
传统连续分配：
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│ Request A    │ │  空洞    │ │ Request B    │  ← 中间空着用不了
└──────────────┘ └──────────┘ └──────────────┘

PagedAttention 分页分配：
Block Table: A→[1,5,8]  B→[2,6]  C→[3,7]
物理显存: [A1][B1][C1][A2][B2][C2][A3][...]
         ↑ 所有小块都填满，没有浪费
```

---

## 关键角色

| 组件 | 角色 | 类比 |
|------|------|------|
| **Attention** | 计算当前 token 应该关注哪些前面的 token | 厨师炒菜 |
| **KV Cache** | 已经算过的 Key/Value 记忆 | 食材 |
| **PagedAttention** | 把 KV Cache 分页管理，按需分配、共享、复用 | 仓库管理员 |
| **Continuous Batching** | 动态把请求拼成 batch，随时上下车 | 餐厅拼桌 |

---

## 一句话总结

> **vLLM 用 PagedAttention 把 KV Cache 从"大套房"改成"小单间"，按需入住、共享客厅，于是同样的 GPU 能塞进更多请求，大家排队时间少了，生成速度就更快。**

---

*Last updated: 2026-06-15*

## Related

- [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive|vLLM 深度解析]]
- [[10_Deployment_Inference/Inference_Engines/vLLM_for_dummy|vLLM 大白话解释]]
- [[10_Deployment_Inference/Inference_Engines/LLM_Inference_Engine_Selection_Guide|LLM 推理引擎选型指南]]
- [[_concepts/paged-attention|PagedAttention 概念卡片]]
- [[_concepts/kv-cache|KV Cache 概念卡片]]
- [[_concepts/continuous-batching|Continuous Batching 概念卡片]]

- [[10_Deployment_Inference/README|模型部署与推理]]
