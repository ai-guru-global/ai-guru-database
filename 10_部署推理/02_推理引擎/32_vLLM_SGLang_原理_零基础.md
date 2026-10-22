---
title: "vLLM 与 SGLang 原理：从零讲起"
category: "10-deployment-inference"
tags: ["inference", "vllm", "sglang", "kv-cache", "paged-attention", "radix-attention", "prefix-caching", "beginner"]
summary: "> **一句话理解**: 从「模型一个字一个字往外蹦」讲起，层层推导出 KV Cache、PagedAttention、continuous batching、前缀缓存与 RadixAttention——看懂 vLLM 和 SGLang 各自到底解决了什么问题。"
created: 2026-10-22
updated: 2026-10-22
tier: supporting
aliases:
  - "推理引擎原理零基础"
  - "vLLM SGLang 原理入门"
  - "vLLM SGLang Principles From Scratch"
sources: []

name_zh: "vLLM 与 SGLang 原理：从零讲起"
---

# vLLM 与 SGLang 原理：从零讲起

> 中文简称：vLLM 与 SGLang 原理：从零讲起

> **一句话理解**: 从「模型一个字一个字往外蹦」讲起，层层推导出 KV Cache、PagedAttention、continuous batching、前缀缓存与 RadixAttention——看懂 vLLM 和 SGLang 各自到底解决了什么问题。

---

## 0. 主线：先记住一句话

LLM 推理慢、贵，根本原因就两条：

1. **KV Cache 占显存**——并发一多、对话一长，显存先爆。
2. **重复计算**——一样的输入算了一遍又一遍。

[[概念/LLM/vllm|vLLM]] 和 [[概念/Inference/sglang|SGLang]] 都是 LLM 推理引擎（把模型部署成 API 服务的软件），基本功几乎一样，区别在于各自的「招牌创新」攻的是不同的问题。下面一层一层铺，每一步都建立在上一步之上。

---

## 1. 第一步：大模型是怎么生成文字的

1. 模型一次只生成**一个 token**（词元，可以理解成「一个字或词的碎片」）。
2. 想生成一句话，就得一个字一个字往外蹦：算出「你」→ 拼回输入 → 算出「好」→ 再拼回去 → 算「吗」……这叫**自回归**（自己生成的结果，变成下一步的输入）。
3. 关键点：**每算一个新字，都要「看一遍」前面所有的字**。回答越长，后面每一步越重。

延伸：[[概念/LLM/autoregressive-generation|自回归生成]]。

---

## 2. 第二步：KV Cache——给「看过的内容」记笔记

1. 「看前面所有字」的计算里，有一部分中间结果（每个字的 Key、Value 两组向量）是**固定不变的**——前面的字又不会变。
2. 那就没必要每次重算，存下来反复用就行。这份笔记就是 **KV Cache**（Key-Value 缓存）。
3. 类比：做阅读理解时在草稿纸上记要点，后面每答一题看笔记就行，不用重读全文。

> 注意：**所有推理引擎都有 KV Cache，它不是 vLLM 发明的**——vLLM 是解决了它的「存放」问题。

延伸：[[概念/LLM/kv-cache|KV Cache]] · [[概念/LLM/kv-cache-plain|KV Cache 通俗版]]。

---

## 3. 第三步：新问题——KV Cache 把显存吃光了

1. 每个请求、每个字都要存一份 KV Cache，聊天越长、人越多，显存越爆。
2. 早期做法更糟：给每个请求**提前预留一大块连续显存**（按「最长可能输出」预留），实际浪费 60%～80%。
3. 类比：客人只住 2 间房，你却把酒店一整层全包下来还不让别人住。GPU 看着显存满，其实大半在空转。

---

## 4. 第四步：vLLM 的招牌——PagedAttention

1. 借鉴操作系统管理内存的「分页」思想：把 KV Cache 切成一个个固定大小的小格子（block），**用多少拿多少**，不要求连续。
2. 逻辑上请求以为自己占着一整块，实际被拆在显存各处，靠一张映射表找——就像电脑内存不够时用硬盘「虚拟内存」拼凑一样。
3. 效果：浪费从 60%～80% 降到 4% 以内 → **同一张卡能同时接待的请求数翻好几倍** → 总吞吐量暴涨。这是 vLLM 的奠基性创新。

延伸：[[概念/LLM/paged-attention|Paged Attention]] · [[10_部署推理/02_推理引擎/30_vLLM_Paged注意力_架构|一张图看懂 PagedAttention 架构]]。

---

## 5. 第五步：Batching——让 GPU 别一次只干一个人的活

1. GPU 最擅长并行：算 1 个请求和算 32 个请求耗时差不多（只要显存装得下），所以要把多个请求**拼成一批一起算**（batching）。
2. 老办法的毛病：一批 32 个必须**全部完成**才能换下一批——30 个短请求干等 2 个长请求，GPU 空转。
3. **Continuous Batching**（连续批处理）：每生成一个字的间隙，就让完成的请求退场、新请求插进来，流水线不停车。**vLLM 和 SGLang 都有这个，属于基本功。**

延伸：[[概念/Inference/continuous-batching|Continuous Batching]]。

---

## 6. 第六步：前缀缓存——很多请求的开头一模一样

1. 现实中大量请求共享相同开头：同一个 system prompt、同一份 RAG 文档、多轮对话的历史。
2. 这些公共前缀的 KV Cache 算出来完全相同，却每个请求各算一遍——纯浪费。
3. 把公共前缀的 KV Cache 存下来共享，命中就直接复用：省计算、首字更快（TTFT 更低）。这就是**前缀缓存（Prefix Caching）**，vLLM 也支持。

延伸：[[概念/Inference/prefix-caching|Prefix Caching]]。

---

## 7. 第七步：SGLang 的招牌——RadixAttention

### 7.1 vLLM 式缓存的天花板

vLLM 的前缀缓存按「块哈希」匹配**从头开始完全相同**的请求。但现实中前缀往往不是「整段一样」，而是「某一截一样」：两个用户问不同问题，但共享同一段超长的 system prompt；多轮对话是上一个请求的延续，只多了尾巴。简单缓存对这类「部分公共」的场景，复用得不够彻底。

### 7.2 RadixAttention：把所有 KV Cache 挂到一棵树上

SGLang 用**基数树（Radix Tree，一种前缀树）**统一管理全局 KV Cache：每段公共前缀只算一次，成为树上的一个节点；所有请求按前缀挂到树上，谁和谁有公共开头，树的结构就自动把它们的路拼在一起。

```
（根）
 └─ system prompt（2000 token）…… 只算 1 次，所有请求共享
     ├─ 「退货政策是什么？」+ 模型回答
     │   └─ 「北京也能退吗？」……        ← 多轮对话挂在祖先下面，历史不用重算
     └─ 「怎么开发票？」+ 模型回答
         └─ 「电子发票呢？」……
```

1. **自动发现公共前缀**：不用人工配置哪些前缀值得缓存，任何请求之间只要有一段公共开头，就会落在同一个节点上被自动复用。
2. **分支共享**：一个请求 fork 出多个候选（比如多轮对话、tree search），公共祖先只算一次，各分支只算分叉之后的差异。
3. **优雅淘汰**：显存吃紧时从叶子往上淘汰最近没用的分支，热门的公共祖先（比如那个 2000 token 的 system prompt）留在树上继续服务大家。

### 7.3 另一个加分项：低开销调度

SGLang 的 Overlap Scheduler 会**把 CPU 的准备工作（排班、采样）和 GPU 的计算重叠起来**，几乎不浪费空隙——所以它在小并发、多轮对话场景的延迟通常更低。

延伸：[[10_部署推理/02_推理引擎/23_SGLang_深入分析|SGLang 深入分析]] · [[10_部署推理/02_推理引擎/34_前缀缓存与_RadixAttention|34 前缀缓存与 RadixAttention 专题]]（本节的展开版，含面试快问快答）。

---

## 8. 汇总对比与面试口径

| | vLLM | SGLang |
|---|---|---|
| 招牌创新 | PagedAttention（显存分页，省显存） | RadixAttention（前缀树，复用计算） |
| 强项 | 生态最大、模型支持最全，通用部署首选 | 前缀重复多的场景：多轮对话、Agent、结构化输出 |
| 共同点 | continuous batching、前缀缓存、投机解码、量化、多卡并行、OpenAI 兼容 API，一样不少 | |

**面试一句话**：「LLM 推理的瓶颈在 KV Cache 的显存和重复计算；vLLM 用 PagedAttention 解决显存浪费，SGLang 用 RadixAttention 解决前缀重复计算，两者都工作在 continuous batching 之上。」

---

## 9. 术语速查表

| 术语 | 大白话 |
|---|---|
| token（词元） | 模型眼里的「字/词碎片」，生成的基本单位 |
| 自回归 | 一个字一个字往外蹦，生成的结果拼回去当下一步的输入 |
| KV Cache | 给「看过的内容」记的笔记，免得每个新字都重看全文 |
| PagedAttention | 像操作系统分页那样管理 KV Cache 显存，用多少拿多少 |
| Batching | 多个请求拼一批一起算，吃满 GPU 并行能力 |
| Continuous Batching | 一批不必全跑完，字与字之间就能换人进出 |
| 前缀缓存 | 公共开头的笔记只记一次，大家共用 |
| RadixAttention | 用前缀树把所有公共前缀自动串起来共享，vLLM 式缓存的进化版 |
| TTFT | 首 token 延迟，用户按下回车到第一个字蹦出来的时间 |
| 投机解码 | 用小模型先猜、大模型验，一步出多个字 |

延伸：[[概念/LLM/speculative-decoding|投机解码]] · [[概念/Inference/ttft|TTFT]]。

---

## 相关页面

- [[10_部署推理/02_推理引擎/29_vLLM_深入分析|29 vLLM 深入分析]] — vLLM 生产级全景
- [[10_部署推理/02_推理引擎/23_SGLang_深入分析|23 SGLang 深入分析]] — SGLang 生产级全景
- [[10_部署推理/02_推理引擎/30_vLLM_Paged注意力_架构|30 vLLM + PagedAttention 架构图]] — 本篇第四步的图解版
- [[10_部署推理/02_推理引擎/33_注意力机制演进_MLA_DSA_混合注意力|33 注意力机制演进：MLA、DSA 与混合注意力]] — 「存」的维度继续深挖
- [[10_部署推理/02_推理引擎/34_前缀缓存与_RadixAttention|34 前缀缓存与 RadixAttention：从比喻到生产]] — 本篇第七步（前缀缓存 + RadixAttention）的专题展开版
- [[10_部署推理/02_推理引擎/17_LLM_推理引擎_选型_指南|17 推理引擎选型指南]] — 看懂原理后的下一步：选型
- [[概念/LLM/kv-cache|KV Cache 概念卡]] · [[概念/Inference/prefix-caching|Prefix Caching 概念卡]]

---

*Last updated: 2026-10-22*
