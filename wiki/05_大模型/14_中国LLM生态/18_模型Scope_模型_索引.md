---
title: "ModelScope 全量模型索引 (ModelScope Model Index)"
category: 05-nlp-llms-chinese-llm-ecosystem
tags: ["modelscope", "chinese-llm", "model-hub", "index", "reference"]
summary: "ModelScope 上 15 家中国大模型厂商全部 1,621 个官方模型的完整索引表（按厂商分组、按下载量排序），含模型 ID、类型、任务、许可、下载量与链接。为可检索的全量参考资料。"
created: 2026-06-19
updated: 2026-06-23
source: https://modelscope.cn/
tier: supporting
aliases:
  - "Modelscope Model Index"
  - "ModelScope Model Index"
  - ModelScope_Model_Index
sources: []

name_zh: "ModelScope 全量模型索引"
---
# ModelScope 全量模型索引 (ModelScope Model Index)

> 中文简称：ModelScope 全量模型索引

> **一句话理解**: 本页是 ModelScope 魔搭社区上 15 家中国大模型厂商全部 **1,621 个官方模型** 的完整索引——按厂商分组、按下载量排序，便于检索与选型。

- 数据来源: [ModelScope 官方 API](https://modelscope.cn/) · 抓取时间: 2026-06-19
- 统计口径: 仅官方 namespace 下模型，已剔除社区量化/微调版
- 统计精选见 [[概念/General/modelscope]]

---

## 阿里 · 通义千问 (Qwen)

Namespace: `qwen` · 组织主页: [https://modelscope.cn/organization/qwen](https://modelscope.cn/organization/qwen) · 模型数: **437**


> 通义千问 Qwen模型较多，完整 437 个模型索引已拆分至 [[ModelScope_Model_Index_Qwen|独立页面]]。
> 下方仅保留下载量 Top 20 精选：

| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |
|---|---------|------|------|------|------|------|------|------|------|
| 1 | `Qwen/Qwen2.5-0.5B-Instruct` | qwen2 | text-generation | apache-2.0 | 8,821,438 | 234 | 953.3 MB | 2025-02-26 | [↗](https://modelscope.cn/models/Qwen/Qwen2.5-0.5B-Instruct) |
| 2 | `Qwen/Qwen2.5-7B-Instruct` | qwen2 | text-generation | apache-2.0 | 7,002,284 | 477 | 14.2 GB | 2025-03-07 | [↗](https://modelscope.cn/models/Qwen/Qwen2.5-7B-Instruct) |
| 3 | `Qwen/Qwen3-VL-8B-Instruct` | qwen3_vl | image-text-to-text | apache-2.0 | 6,914,444 | 328 | 16.3 GB | 2026-03-02 | [↗](https://modelscope.cn/models/Qwen/Qwen3-VL-8B-Instruct) |
| 4 | `Qwen/Qwen3-8B` | qwen3 | text-generation | apache-2.0 | 6,534,070 | 300 | 15.3 GB | 2025-07-26 | [↗](https://modelscope.cn/models/Qwen/Qwen3-8B) |
| 5 | `Qwen/Qwen3-0.6B` | qwen3 | text-generation | apache-2.0 | 5,162,158 | 231 | 1.4 GB | 2025-07-26 | [↗](https://modelscope.cn/models/Qwen/Qwen3-0.6B) |
| 6 | `Qwen/Qwen2.5-VL-7B-Instruct` | qwen2_5_vl | image-text-to-text | apache-2.0 | 4,976,315 | 425 | 15.5 GB | 2025-04-06 | [↗](https://modelscope.cn/models/Qwen/Qwen2.5-VL-7B-Instruct) |
| 7 | `Qwen/Qwen2.5-72B-Instruct` | qwen2 | text-generation | other | 4,614,356 | 219 | 135.4 GB | 2025-03-07 | [↗](https://modelscope.cn/models/Qwen/Qwen2.5-72B-Instruct) |
| 8 | `Qwen/Qwen3-32B` | qwen3 | text-generation | apache-2.0 | 4,030,448 | 328 | 61.0 GB | 2025-07-26 | [↗](https://modelscope.cn/models/Qwen/Qwen3-32B) |
| 9 | `Qwen/Qwen2.5-14B-Instruct` | qwen2 | text-generation | apache-2.0 | 3,996,259 | 98 | 27.5 GB | 2025-03-07 | [↗](https://modelscope.cn/models/Qwen/Qwen2.5-14B-Instruct) |
| 10 | `Qwen/Qwen3-4B` | qwen3 | text-generation | apache-2.0 | 3,444,346 | 136 | 7.5 GB | 2025-07-26 | [↗](https://modelscope.cn/models/Qwen/Qwen3-4B) |
| 11 | `Qwen/Qwen3-Reranker-8B` | qwen3 | text-ranking | apache-2.0 | 3,205,304 | 64 | 15.3 GB | 2025-06-09 | [↗](https://modelscope.cn/models/Qwen/Qwen3-Reranker-8B) |
| 12 | `Qwen/Qwen3-Embedding-0.6B` | qwen3 | sentence-embedding | apache-2.0 | 3,188,978 | 118 | 1.1 GB | 2025-06-22 | [↗](https://modelscope.cn/models/Qwen/Qwen3-Embedding-0.6B) |
| 13 | `Qwen/Qwen3.5-35B-A3B` | qwen3_5_moe | image-text-to-text | apache-2.0 | 3,113,537 | 146 | 67.0 GB | 2026-04-23 | [↗](https://modelscope.cn/models/Qwen/Qwen3.5-35B-A3B) |
| 14 | `Qwen/Qwen-Image` | — | text-to-image-synthesis | apache-2.0 | 2,762,257 | 450 | 53.7 GB | 2025-08-18 | [↗](https://modelscope.cn/models/Qwen/Qwen-Image) |
| 15 | `Qwen/Qwen3-Next-80B-A3B-Instruct` | qwen3_next | text-generation | apache-2.0 | 2,185,735 | 164 | 151.5 GB | 2025-09-17 | [↗](https://modelscope.cn/models/Qwen/Qwen3-Next-80B-A3B-Instruct) |
| 16 | `Qwen/Qwen3-30B-A3B` | qwen3_moe | text-generation | apache-2.0 | 2,088,473 | 81 | 56.9 GB | 2025-07-26 | [↗](https://modelscope.cn/models/Qwen/Qwen3-30B-A3B) |
| 17 | `Qwen/Qwen3.5-9B` | qwen3_5 | image-text-to-text | apache-2.0 | 1,984,083 | 148 | 18.0 GB | 2026-06-16 | [↗](https://modelscope.cn/models/Qwen/Qwen3.5-9B) |
| 18 | `Qwen/Qwen-14B-Chat` | qwen | text-generation | — | 1,947,526 | 370 | 26.4 GB | 2025-02-26 | [↗](https://modelscope.cn/models/Qwen/Qwen-14B-Chat) |
| 19 | `Qwen/Qwen3-Reranker-0.6B` | qwen3 | text-ranking | apache-2.0 | 1,846,538 | 45 | 1.1 GB | 2025-06-10 | [↗](https://modelscope.cn/models/Qwen/Qwen3-Reranker-0.6B) |
| 20 | `Qwen/Qwen2.5-Omni-7B` | qwen2_5_omni | any-to-any | other | 1,844,215 | 502 | 20.8 GB | 2025-04-30 | [↗](https://modelscope.cn/models/Qwen/Qwen2.5-Omni-7B) |

> 完整列表（含全部模型）见 [[ModelScope_Model_Index_Qwen]]。
## 深度求索 (DeepSeek)

Namespace: `deepseek-ai` · 组织主页: [https://modelscope.cn/organization/deepseek-ai](https://modelscope.cn/organization/deepseek-ai) · 模型数: **88**

| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |
|---|---------|------|------|------|------|------|------|------|------|
| 1 | `deepseek-ai/DeepSeek-R1-Distill-Qwen-32B` | qwen2 | text-generation | mit | 2,691,813 | 258 | 61.0 GB | 2025-02-24 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B) |
| 2 | `deepseek-ai/DeepSeek-R1-Distill-Llama-70B` | llama | text-generation | mit | 2,109,015 | 114 | 131.4 GB | 2025-02-24 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-Distill-Llama-70B) |
| 3 | `deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B` | qwen2 | text-generation | mit | 1,934,828 | 326 | 3.3 GB | 2025-03-07 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B) |
| 4 | `deepseek-ai/DeepSeek-V3.1-Terminus` | deepseek_v3 | text-generation | mit | 1,881,594 | 68 | 641.3 GB | 2025-09-22 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V3.1-Terminus) |
| 5 | `deepseek-ai/DeepSeek-V3.2-Exp` | deepseek_v32 | — | mit | 1,828,145 | 146 | 642.1 GB | 2025-11-18 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V3.2-Exp) |
| 6 | `deepseek-ai/DeepSeek-OCR` | deepseek_vl_v2 | image-text-to-text | mit | 1,673,233 | 273 | 6.2 GB | 2025-11-16 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-OCR) |
| 7 | `deepseek-ai/DeepSeek-R1` | deepseek_v3 | — | mit | 925,008 | 1352 | 641.3 GB | 2025-03-07 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1) |
| 8 | `deepseek-ai/DeepSeek-R1-Distill-Qwen-7B` | qwen2 | text-generation | mit | 909,392 | 422 | 14.2 GB | 2025-02-24 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B) |
| 9 | `deepseek-ai/DeepSeek-V2-Lite-Chat` | deepseek_v2 | text-generation | other | 789,573 | 17 | 29.3 GB | 2024-07-26 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V2-Lite-Chat) |
| 10 | `deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct` | deepseek_v2 | text-generation | other | 667,837 | 31 | 29.3 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct) |
| 11 | `deepseek-ai/DeepSeek-V2-Chat` | deepseek_v2 | text-generation | other | 622,050 | 42 | 439.1 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V2-Chat) |
| 12 | `deepseek-ai/DeepSeek-R1-0528` | deepseek_v3 | text-generation | mit | 579,518 | 324 | 641.3 GB | 2025-05-29 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-0528) |
| 13 | `deepseek-ai/DeepSeek-V4-Flash` | deepseek_v4 | text-generation | mit | 550,197 | 268 | 148.7 GB | 2026-06-08 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V4-Flash) |
| 14 | `deepseek-ai/DeepSeek-R1-Distill-Qwen-14B` | qwen2 | text-generation | mit | 465,606 | 173 | 27.5 GB | 2025-02-24 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-14B) |
| 15 | `deepseek-ai/DeepSeek-V3.2` | deepseek_v32 | text-generation | — | 368,509 | 443 | 642.2 GB | 2025-12-01 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V3.2) |
| 16 | `deepseek-ai/DeepSeek-V3` | deepseek_v3 | text-generation | — | 330,117 | 255 | 641.3 GB | 2025-02-24 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V3) |
| 17 | `deepseek-ai/DeepSeek-Coder-V2-Base` | deepseek_v2 | — | other | 310,782 | 0 | 439.1 GB | 2024-07-26 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-Coder-V2-Base) |
| 18 | `deepseek-ai/DeepSeek-Coder-V2-Instruct` | deepseek_v2 | text-generation | other | 289,065 | 7 | 439.1 GB | 2024-08-21 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-Coder-V2-Instruct) |
| 19 | `deepseek-ai/deepseek-coder-6.7b-instruct` | llama | text-generation | other | 253,743 | 30 | 25.1 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-coder-6.7b-instruct) |
| 20 | `deepseek-ai/DeepSeek-V4-Pro` | deepseek_v4 | text-generation | mit | 227,591 | 419 | 805.4 GB | 2026-06-08 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V4-Pro) |
| 21 | `deepseek-ai/DeepSeek-R1-0528-Qwen3-8B` | qwen3 | text-generation | mit | 199,879 | 122 | 15.3 GB | 2025-05-29 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-0528-Qwen3-8B) |
| 22 | `deepseek-ai/DeepSeek-OCR-2` | deepseek_vl_v2 | image-text-to-text | apache-2.0 | 170,616 | 81 | 6.3 GB | 2026-02-03 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-OCR-2) |
| 23 | `deepseek-ai/DeepSeek-R1-Distill-Llama-8B` | llama | text-generation | mit | 152,761 | 78 | 15.0 GB | 2025-02-24 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-Distill-Llama-8B) |
| 24 | `deepseek-ai/DeepSeek-V2-Lite` | deepseek_v2 | text-generation | other | 134,306 | 5 | 29.3 GB | 2024-07-26 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V2-Lite) |
| 25 | `deepseek-ai/deepseek-moe-16b-chat` | deepseek | text-generation | other | 128,480 | 8 | 30.5 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-moe-16b-chat) |
| 26 | `deepseek-ai/Janus-Pro-7B` | multi_modality | any-to-any | mit | 125,630 | 150 | 13.8 GB | 2025-02-01 | [↗](https://modelscope.cn/models/deepseek-ai/Janus-Pro-7B) |
| 27 | `deepseek-ai/deepseek-llm-67b-chat` | llama | text-generation | other | 108,944 | 5 | 125.6 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-llm-67b-chat) |
| 28 | `deepseek-ai/deepseek-vl2-tiny` | deepseek_vl_v2 | image-text-to-text | other | 99,227 | 19 | 6.3 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-vl2-tiny) |
| 29 | `deepseek-ai/Janus-Pro-1B` | multi_modality | any-to-any | mit | 78,002 | 35 | 3.9 GB | 2025-02-01 | [↗](https://modelscope.cn/models/deepseek-ai/Janus-Pro-1B) |
| 30 | `deepseek-ai/deepseek-llm-7b-chat` | llama | text-generation | other | 66,745 | 27 | 12.9 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-llm-7b-chat) |
| 31 | `deepseek-ai/deepseek-vl2-small` | deepseek_vl_v2 | image-text-to-text | other | 65,077 | 13 | 30.1 GB | 2024-12-18 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-vl2-small) |
| 32 | `deepseek-ai/deepseek-vl-7b-chat` | multi_modality | image-text-to-text | other | 64,790 | 36 | 13.7 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-vl-7b-chat) |
| 33 | `deepseek-ai/DeepSeek-V3.1` | deepseek_v3 | text-generation | mit | 56,041 | 253 | 641.3 GB | 2025-08-26 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V3.1) |
| 34 | `deepseek-ai/DeepSeek-V2.5` | deepseek_v2 | — | other | 52,556 | 11 | 439.1 GB | 2024-12-11 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V2.5) |
| 35 | `deepseek-ai/deepseek-math-7b-rl` | llama | — | other | 36,503 | 5 | 27.6 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-math-7b-rl) |
| 36 | `deepseek-ai/DeepSeek-V3-Base` | deepseek_v3 | text-generation | — | 34,967 | 43 | 641.3 GB | 2025-02-24 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V3-Base) |
| 37 | `deepseek-ai/DeepSeek-V3-0324` | deepseek_v3 | text-generation | mit | 32,061 | 296 | 641.3 GB | 2025-03-25 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V3-0324) |
| 38 | `deepseek-ai/deepseek-vl2` | deepseek_vl_v2 | image-text-to-text | other | 27,869 | 44 | 51.2 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-vl2) |
| 39 | `deepseek-ai/DeepSeek-V2` | deepseek_v2 | text-generation | other | 15,837 | 5 | 439.1 GB | 2024-07-26 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V2) |
| 40 | `deepseek-ai/deepseek-vl-1.3b-chat` | multi_modality | image-text-to-text | other | 15,199 | 11 | 3.7 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-vl-1.3b-chat) |
| 41 | `deepseek-ai/DeepSeek-V3.2-Speciale` | deepseek_v32 | text-generation | — | 14,069 | 100 | 642.2 GB | 2025-12-01 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V3.2-Speciale) |
| 42 | `deepseek-ai/DeepSeek-V4-Flash-Base` | deepseek_v4 | text-generation | MIT License | 13,520 | 11 | 274.5 GB | 2026-04-27 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V4-Flash-Base) |
| 43 | `deepseek-ai/deepseek-llm-7b-base` | llama | text-generation | other | 10,779 | 8 | 12.9 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-llm-7b-base) |
| 44 | `deepseek-ai/Janus-1.3B` | multi_modality | any-to-any | mit | 10,688 | 2 | 3.9 GB | 2025-01-27 | [↗](https://modelscope.cn/models/deepseek-ai/Janus-1.3B) |
| 45 | `deepseek-ai/deepseek-coder-1.3b-instruct` | llama | text-generation | other | 10,415 | 9 | 5.0 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-coder-1.3b-instruct) |
| 46 | `deepseek-ai/deepseek-math-7b-instruct` | llama | — | other | 10,329 | 6 | 12.9 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-math-7b-instruct) |
| 47 | `deepseek-ai/deepseek-coder-33b-instruct` | llama | text-generation | other | 9,675 | 11 | 124.2 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-coder-33b-instruct) |
| 48 | `deepseek-ai/deepseek-moe-16b-base` | deepseek | text-generation | other | 9,583 | 2 | 30.5 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-moe-16b-base) |
| 49 | `deepseek-ai/deepseek-coder-5.7bmqa-instruct` | llama | text-generation | other | 9,283 | 0 | 10.6 GB | 2023-11-03 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-coder-5.7bmqa-instruct) |
| 50 | `deepseek-ai/deepseek-coder-6.7b-base` | llama | text-generation | other | 7,933 | 8 | 25.1 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-coder-6.7b-base) |
| 51 | `deepseek-ai/DeepSeek-V4-Pro-Base` | deepseek_v4 | text-generation | MIT License | 7,497 | 16 | 1.5 TB | 2026-04-27 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V4-Pro-Base) |
| 52 | `deepseek-ai/deepseek-vl-7b-base` | multi_modality | text-generation | other | 6,757 | 5 | 13.7 GB | 2024-03-15 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-vl-7b-base) |
| 53 | `deepseek-ai/deepseek-coder-33b-base` | llama | text-generation | other | 6,327 | 8 | 124.2 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-coder-33b-base) |
| 54 | `deepseek-ai/deepseek-vl-1.3b-base` | multi_modality | text-generation | other | 6,326 | 4 | 3.7 GB | 2024-03-15 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-vl-1.3b-base) |
| 55 | `deepseek-ai/deepseek-coder-1.3b-base` | llama | text-generation | other | 6,274 | 7 | 2.5 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-coder-1.3b-base) |
| 56 | `deepseek-ai/DeepSeek-Coder-V2-Lite-Base` | deepseek_v2 | text-generation | other | 5,128 | 1 | 29.3 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-Coder-V2-Lite-Base) |
| 57 | `deepseek-ai/DeepSeek-V2.5-1210` | deepseek_v2 | text-generation | other | 4,474 | 6 | 439.1 GB | 2024-12-11 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V2.5-1210) |
| 58 | `deepseek-ai/DeepSeek-V2-Chat-0628` | deepseek_v2 | text-generation | — | 4,095 | 3 | 439.1 GB | 2024-07-26 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V2-Chat-0628) |
| 59 | `deepseek-ai/DeepSeek-Coder-V2-Instruct-0724` | deepseek_v2 | — | other | 4,094 | 4 | 439.1 GB | 2024-10-08 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-Coder-V2-Instruct-0724) |
| 60 | `deepseek-ai/deepseek-math-7b-base` | llama | — | other | 3,655 | 2 | 12.9 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-math-7b-base) |
| 61 | `deepseek-ai/DeepSeek-Math-V2` | deepseek_v32 | text-generation | apache-2.0 | 3,275 | 35 | 3.4 KB | 2025-11-27 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-Math-V2) |
| 62 | `deepseek-ai/DeepSeek-Prover-V1.5-RL` | llama | text-generation | other | 2,620 | 2 | 12.9 GB | 2024-08-29 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-Prover-V1.5-RL) |
| 63 | `deepseek-ai/deepseek-coder-7b-instruct-v1.5` | llama | text-generation | other | 2,492 | 4 | 12.9 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-coder-7b-instruct-v1.5) |
| 64 | `deepseek-ai/deepseek-llm-67b-base` | llama | text-generation | other | 2,066 | 5 | 125.6 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-llm-67b-base) |
| 65 | `deepseek-ai/deepseek-coder-7b-base-v1.5` | llama | text-generation | other | 1,925 | 0 | 12.9 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-coder-7b-base-v1.5) |
| 66 | `deepseek-ai/DeepSeek-Prover-V1.5-Base` | llama | text-generation | other | 1,723 | 0 | 12.9 GB | 2024-08-29 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-Prover-V1.5-Base) |
| 67 | `deepseek-ai/DeepSeek-Prover-V1.5-SFT` | llama | text-generation | other | 1,697 | 0 | 12.9 GB | 2024-08-29 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-Prover-V1.5-SFT) |
| 68 | `deepseek-ai/DeepSeek-R1-Zero` | deepseek_v3 | — | mit | 1,692 | 21 | 641.3 GB | 2025-02-24 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-Zero) |
| 69 | `deepseek-ai/ESFT-vanilla-lite` | deepseek_v2 | text-generation | — | 1,650 | 0 | 29.3 GB | 2024-11-21 | [↗](https://modelscope.cn/models/deepseek-ai/ESFT-vanilla-lite) |
| 70 | `deepseek-ai/DeepSeek-V3.1-Base` | deepseek_v3 | text-generation | mit | 1,648 | 21 | 641.3 GB | 2025-08-26 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V3.1-Base) |
| 71 | `deepseek-ai/DeepSeek-Prover-V1` | llama | text-generation | other | 1,628 | 0 | 12.9 GB | 2024-08-29 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-Prover-V1) |
| 72 | `deepseek-ai/deepseek-coder-5.7bmqa-base` | llama | text-generation | other | 1,627 | 0 | 10.6 GB | 2025-02-26 | [↗](https://modelscope.cn/models/deepseek-ai/deepseek-coder-5.7bmqa-base) |
| 73 | `deepseek-ai/JanusFlow-1.3B` | multi_modality | any-to-any | mit | 1,574 | 6 | 3.8 GB | 2025-01-27 | [↗](https://modelscope.cn/models/deepseek-ai/JanusFlow-1.3B) |
| 74 | `deepseek-ai/DeepSeek-Prover-V2-7B` | llama | text-generation | — | 1,199 | 4 | 12.9 GB | 2025-05-10 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-Prover-V2-7B) |
| 75 | `deepseek-ai/DeepSeek-Prover-V2-671B` | deepseek_v3 | text-generation | — | 1,085 | 11 | 641.3 GB | 2025-05-10 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-Prover-V2-671B) |
| 76 | `deepseek-ai/DeepSeek-V3.2-Exp-Base` | deepseek_v32 | — | Apache License 2.0 | 988 | 3 | 642.1 GB | 2025-09-29 | [↗](https://modelscope.cn/models/deepseek-ai/DeepSeek-V3.2-Exp-Base) |
| 77 | `deepseek-ai/ESFT-gate-translation-lite` | deepseek_v2 | text-generation | — | 693 | 0 | 2.0 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/ESFT-gate-translation-lite) |
| 78 | `deepseek-ai/ESFT-token-translation-lite` | deepseek_v2 | text-generation | — | 687 | 0 | 1.6 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/ESFT-token-translation-lite) |
| 79 | `deepseek-ai/ESFT-token-law-lite` | deepseek_v2 | text-generation | — | 684 | 0 | 2.8 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/ESFT-token-law-lite) |
| 80 | `deepseek-ai/ESFT-gate-math-lite` | deepseek_v2 | text-generation | — | 677 | 0 | 3.0 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/ESFT-gate-math-lite) |
| 81 | `deepseek-ai/ESFT-token-code-lite` | deepseek_v2 | text-generation | — | 676 | 0 | 3.6 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/ESFT-token-code-lite) |
| 82 | `deepseek-ai/ESFT-token-math-lite` | deepseek_v2 | text-generation | — | 676 | 0 | 2.6 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/ESFT-token-math-lite) |
| 83 | `deepseek-ai/ESFT-gate-code-lite` | deepseek_v2 | text-generation | — | 673 | 0 | 4.4 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/ESFT-gate-code-lite) |
| 84 | `deepseek-ai/ESFT-token-summary-lite` | deepseek_v2 | text-generation | — | 670 | 0 | 2.2 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/ESFT-token-summary-lite) |
| 85 | `deepseek-ai/ESFT-gate-intent-lite` | deepseek_v2 | text-generation | — | 664 | 0 | 4.0 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/ESFT-gate-intent-lite) |
| 86 | `deepseek-ai/ESFT-gate-law-lite` | deepseek_v2 | text-generation | — | 662 | 0 | 3.1 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/ESFT-gate-law-lite) |
| 87 | `deepseek-ai/ESFT-gate-summary-lite` | deepseek_v2 | text-generation | — | 659 | 0 | 3.2 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/ESFT-gate-summary-lite) |
| 88 | `deepseek-ai/ESFT-token-intent-lite` | deepseek_v2 | text-generation | — | 658 | 0 | 3.0 GB | 2024-12-25 | [↗](https://modelscope.cn/models/deepseek-ai/ESFT-token-intent-lite) |

---

## 智谱 AI (ZhipuAI)

Namespace: `ZhipuAI` · 组织主页: [https://modelscope.cn/organization/ZhipuAI](https://modelscope.cn/organization/ZhipuAI) · 模型数: **168**

| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |
|---|---------|------|------|------|------|------|------|------|------|
| 1 | `ZhipuAI/glm-4-9b-chat-1m` | chatglm | nli | other | 4,671,476 | 62 | 17.7 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-4-9b-chat-1m) |
| 2 | `ZhipuAI/chatglm3-6b` | chatglm | — | — | 1,588,398 | 825 | 23.3 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/chatglm3-6b) |
| 3 | `ZhipuAI/glm-4-voice-9b` | chatglm | chatbot | — | 817,987 | 50 | 17.8 GB | 2024-10-25 | [↗](https://modelscope.cn/models/ZhipuAI/glm-4-voice-9b) |
| 4 | `ZhipuAI/glm-4-voice-tokenizer` | whisper | auto-speech-recognition | — | 738,117 | 33 | 1.4 GB | 2024-10-25 | [↗](https://modelscope.cn/models/ZhipuAI/glm-4-voice-tokenizer) |
| 5 | `ZhipuAI/glm-4-voice-decoder` | — | text-to-speech | — | 736,578 | 9 | 502.7 MB | 2024-10-25 | [↗](https://modelscope.cn/models/ZhipuAI/glm-4-voice-decoder) |
| 6 | `ZhipuAI/AutoGLM-Phone-9B-Multilingual` | glm4v | image-text-to-text | mit | 707,879 | 72 | 19.2 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/AutoGLM-Phone-9B-Multilingual) |
| 7 | `ZhipuAI/GLM-4.7-Flash` | glm4_moe_lite | text-generation | mit | 695,404 | 153 | 58.2 GB | 2026-01-29 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.7-Flash) |
| 8 | `ZhipuAI/GLM-5` | glm_moe_dsa | text-generation | mit | 539,379 | 378 | 1.4 TB | 2026-04-05 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-5) |
| 9 | `ZhipuAI/GLM-OCR` | glm_ocr | image-text-to-text | mit | 522,263 | 96 | 2.5 GB | 2026-05-21 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-OCR) |
| 10 | `ZhipuAI/glm-4-9b-chat` | chatglm | nli | other | 411,394 | 248 | 17.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-4-9b-chat) |
| 11 | `ZhipuAI/GLM-4.7` | glm4_moe | text-generation | mit | 343,356 | 200 | 667.5 GB | 2026-01-29 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.7) |
| 12 | `ZhipuAI/GLM-4.1V-9B-Thinking` | glm4v | image-text-to-text | mit | 278,292 | 79 | 19.2 GB | 2026-06-16 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.1V-9B-Thinking) |
| 13 | `ZhipuAI/chatglm3-6b-32k` | chatglm | chatbot | — | 262,217 | 174 | 11.6 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/chatglm3-6b-32k) |
| 14 | `ZhipuAI/GLM-Z1-9B-0414` | glm4 | text-generation | mit | 254,444 | 5 | 17.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-Z1-9B-0414) |
| 15 | `ZhipuAI/CogVideoX1.5-5B-SAT` | — | image-to-video | other | 249,724 | 28 | 38.1 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/CogVideoX1.5-5B-SAT) |
| 16 | `ZhipuAI/glm-4v-9b` | chatglm | nli | other | 234,007 | 96 | 25.9 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-4v-9b) |
| 17 | `ZhipuAI/GLM-Z1-32B-0414` | glm4 | text-generation | mit | 173,116 | 36 | 60.7 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-Z1-32B-0414) |
| 18 | `ZhipuAI/GLM-4.7-FP8` | glm4_moe | text-generation | mit | 150,206 | 9 | 337.2 GB | 2025-12-23 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.7-FP8) |
| 19 | `ZhipuAI/GLM-4.5V` | glm4v_moe | image-text-to-text | mit | 139,159 | 98 | 200.7 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.5V) |
| 20 | `ZhipuAI/chatglm2-6b` | chatglm | — | — | 119,595 | 331 | 11.6 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/chatglm2-6b) |
| 21 | `ZhipuAI/GLM-4.6` | glm4_moe | text-generation | mit | 110,864 | 286 | 664.6 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.6) |
| 22 | `ZhipuAI/chatglm3-6b-base` | chatglm | text-generation | — | 109,192 | 71 | 11.6 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/chatglm3-6b-base) |
| 23 | `ZhipuAI/GLM-4-9B-0414` | glm4 | text-generation | mit | 105,670 | 20 | 17.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4-9B-0414) |
| 24 | `ZhipuAI/GLM-5.1` | glm_moe_dsa | text-generation | mit | 101,224 | 202 | 1.4 TB | 2026-05-13 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-5.1) |
| 25 | `ZhipuAI/GLM-4.5V-FP8` | glm4v_moe | image-text-to-text | mit | 61,735 | 8 | 102.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.5V-FP8) |
| 26 | `ZhipuAI/GLM-ASR-Nano-2512` | glmasr | — | mit | 56,890 | 70 | 4.2 GB | 2026-04-08 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-ASR-Nano-2512) |
| 27 | `ZhipuAI/AutoGLM-Phone-9B` | glm4v | image-text-to-text | mit | 54,144 | 324 | 19.2 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/AutoGLM-Phone-9B) |
| 28 | `ZhipuAI/ChatGLM-6B` | chatglm | — | — | 50,686 | 299 | 12.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/ChatGLM-6B) |
| 29 | `ZhipuAI/GLM-5-FP8` | glm_moe_dsa | text-generation | mit | 50,135 | 10 | 704.3 GB | 2026-04-05 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-5-FP8) |
| 30 | `ZhipuAI/GLM-5.1-FP8` | glm_moe_dsa | text-generation | mit | 37,567 | 27 | 704.3 GB | 2026-04-16 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-5.1-FP8) |
| 31 | `ZhipuAI/GLM-4.6-FP8` | glm4_moe | text-generation | mit | 33,113 | 4 | 336.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.6-FP8) |
| 32 | `ZhipuAI/GLM-4.5-Air-FP8` | glm4_moe | text-generation | mit | 32,674 | 8 | 104.9 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.5-Air-FP8) |
| 33 | `ZhipuAI/glm-4-9b-chat-hf` | glm | text-generation | other | 31,256 | 22 | 17.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-4-9b-chat-hf) |
| 34 | `ZhipuAI/GLM-4.5-Air` | glm4_moe | text-generation | mit | 30,958 | 16 | 205.8 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.5-Air) |
| 35 | `ZhipuAI/codegeex4-all-9b` | chatglm | text-generation | other | 30,517 | 33 | 17.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/codegeex4-all-9b) |
| 36 | `ZhipuAI/GLM-4.5` | glm4_moe | text-generation | mit | 30,062 | 403 | 667.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.5) |
| 37 | `ZhipuAI/cogvlm2-llama3-chinese-chat-19B-int4` | — | text-generation | other | 28,243 | 16 | 11.7 GB | 2024-05-24 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm2-llama3-chinese-chat-19B-int4) |
| 38 | `ZhipuAI/chatglm3-6b-128k` | chatglm | — | — | 23,388 | 20 | 11.6 GB | 2024-12-09 | [↗](https://modelscope.cn/models/ZhipuAI/chatglm3-6b-128k) |
| 39 | `ZhipuAI/cogvlm2-llama3-chinese-chat-19B` | — | text-generation | other | 22,497 | 78 | 36.3 GB | 2026-06-17 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm2-llama3-chinese-chat-19B) |
| 40 | `ZhipuAI/GLM-4.6V-Flash` | glm4v | image-text-to-text | mit | 21,910 | 33 | 19.2 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.6V-Flash) |
| 41 | `ZhipuAI/glm-4-9b` | chatglm | text-generation | other | 21,895 | 53 | 17.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-4-9b) |
| 42 | `ZhipuAI/CogVideoX-2b` | — | text-to-video-synthesis | apache-2.0 | 21,547 | 27 | 12.8 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/CogVideoX-2b) |
| 43 | `ZhipuAI/GLM-4-32B-0414` | glm4 | text-generation | mit | 21,432 | 21 | 60.7 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4-32B-0414) |
| 44 | `ZhipuAI/GLM-5.2` | glm_moe_dsa | text-generation | mit | 20,452 | 35 | 1.4 TB | 2026-06-16 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-5.2) |
| 45 | `ZhipuAI/CogVideoX-5b` | — | text-to-video-synthesis | other | 19,840 | 61 | 20.1 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/CogVideoX-5b) |
| 46 | `ZhipuAI/chatglm2-6b-int4` | chatglm | — | — | 19,656 | 45 | 3.7 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/chatglm2-6b-int4) |
| 47 | `ZhipuAI/GLM-Image` | — | text-to-image-synthesis | mit | 18,733 | 57 | 33.3 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-Image) |
| 48 | `ZhipuAI/codegeex2-6b` | chatglm | text-generation | — | 15,632 | 69 | 11.6 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/codegeex2-6b) |
| 49 | `ZhipuAI/ChatGLM-6B-Int4` | chatglm | — | — | 13,865 | 55 | 3.6 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/ChatGLM-6B-Int4) |
| 50 | `ZhipuAI/GLM-5.2-FP8` | glm_moe_dsa | text-generation | mit | 12,212 | 16 | 703.8 GB | 2026-06-16 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-5.2-FP8) |
| 51 | `ZhipuAI/chatglm2-6b-32k` | chatglm | — | — | 10,458 | 65 | 11.6 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/chatglm2-6b-32k) |
| 52 | `ZhipuAI/Multilingual-GLM-Summarization-zh` | glm | text-summarization | — | 9,488 | 80 | 2.0 GB | 2022-12-29 | [↗](https://modelscope.cn/models/ZhipuAI/Multilingual-GLM-Summarization-zh) |
| 53 | `ZhipuAI/GLM-4.6V-FP8` | glm4v_moe | image-text-to-text | mit | 8,666 | 5 | 102.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.6V-FP8) |
| 54 | `ZhipuAI/cogagent-chat` | — | visual-question-answering | Apache License 2.0 | 8,598 | 37 | 34.1 GB | 2024-01-04 | [↗](https://modelscope.cn/models/ZhipuAI/cogagent-chat) |
| 55 | `ZhipuAI/cogvlm2-llama3-chat-19B` | — | text-generation | other | 8,337 | 11 | 36.3 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm2-llama3-chat-19B) |
| 56 | `ZhipuAI/CogVideoX1.5-5B-I2V` | — | — | other | 8,070 | 8 | 28.9 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/CogVideoX1.5-5B-I2V) |
| 57 | `ZhipuAI/CogView4-6B` | — | text-to-image-synthesis | apache-2.0 | 7,710 | 37 | 29.0 GB | 2026-02-03 | [↗](https://modelscope.cn/models/ZhipuAI/CogView4-6B) |
| 58 | `ZhipuAI/MathGLM` | — | text-generation | afl-3.0 | 7,355 | 27 | 18.4 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/MathGLM) |
| 59 | `ZhipuAI/CogVideoX-5b-I2V` | — | image-to-video | other | 7,062 | 29 | 20.2 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/CogVideoX-5b-I2V) |
| 60 | `ZhipuAI/cogvlm2-video-llama3-chat` | — | text-generation | other | 6,414 | 30 | 23.3 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm2-video-llama3-chat) |
| 61 | `ZhipuAI/GLM-4.6V` | glm4v_moe | image-text-to-text | mit | 6,020 | 29 | 200.7 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.6V) |
| 62 | `ZhipuAI/agentlm-13b` | llama | text-generation | — | 5,994 | 14 | 24.3 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/agentlm-13b) |
| 63 | `ZhipuAI/SCAIL-2` | — | image-to-video | mit | 5,687 | 2 | 75.7 GB | 2026-06-16 | [↗](https://modelscope.cn/models/ZhipuAI/SCAIL-2) |
| 64 | `ZhipuAI/visualglm-6b` | chatglm | — | — | 5,681 | 56 | 16.6 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/visualglm-6b) |
| 65 | `ZhipuAI/GLM-Z1-Rumination-32B-0414` | glm4 | text-generation | mit | 5,661 | 10 | 61.8 GB | 2026-06-16 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-Z1-Rumination-32B-0414) |
| 66 | `ZhipuAI/glm-edge-4b-chat` | glm | text-generation | other | 5,583 | 7 | 8.1 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-edge-4b-chat) |
| 67 | `ZhipuAI/Glyph` | glm4v | image-text-to-text | mit | 5,547 | 10 | 19.2 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/Glyph) |
| 68 | `ZhipuAI/LongWriter-glm4-9b` | chatglm | text-generation | — | 5,503 | 28 | 17.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/LongWriter-glm4-9b) |
| 69 | `ZhipuAI/cogvlm-chat` | — | multimodal-dialogue | apache-2.0 | 5,148 | 14 | 32.9 GB | 2024-01-04 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm-chat) |
| 70 | `ZhipuAI/LongAlign-13B-64k` | llama | text-generation | apache-2.0 | 5,059 | 0 | 24.3 GB | 2024-03-07 | [↗](https://modelscope.cn/models/ZhipuAI/LongAlign-13B-64k) |
| 71 | `ZhipuAI/LongAlign-6B-64k-base` | chatglm | text-generation | apache-2.0 | 5,019 | 0 | 11.6 GB | 2024-03-07 | [↗](https://modelscope.cn/models/ZhipuAI/LongAlign-6B-64k-base) |
| 72 | `ZhipuAI/cogagent-9b-20241220` | chatglm | image-text-to-text | other | 4,979 | 27 | 25.9 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/cogagent-9b-20241220) |
| 73 | `ZhipuAI/LongAlign-6B-64k` | chatglm | text-generation | apache-2.0 | 4,977 | 0 | 11.6 GB | 2024-03-07 | [↗](https://modelscope.cn/models/ZhipuAI/LongAlign-6B-64k) |
| 74 | `ZhipuAI/LongAlign-13B-64k-base` | llama | text-generation | apache-2.0 | 4,975 | 0 | 24.3 GB | 2024-03-07 | [↗](https://modelscope.cn/models/ZhipuAI/LongAlign-13B-64k-base) |
| 75 | `ZhipuAI/LongAlign-7B-64k` | llama | text-generation | apache-2.0 | 4,918 | 0 | 12.6 GB | 2024-03-07 | [↗](https://modelscope.cn/models/ZhipuAI/LongAlign-7B-64k) |
| 76 | `ZhipuAI/LongAlign-7B-64k-base` | llama | text-generation | apache-2.0 | 4,910 | 0 | 12.6 GB | 2024-03-07 | [↗](https://modelscope.cn/models/ZhipuAI/LongAlign-7B-64k-base) |
| 77 | `ZhipuAI/CogVLM` | — | text-generation | apache-2.0 | 4,828 | 62 | 130.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/CogVLM) |
| 78 | `ZhipuAI/GLM-4.1V-9B-Base` | glm4v | image-text-to-text | mit | 4,566 | 2 | 19.2 GB | 2026-06-16 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.1V-9B-Base) |
| 79 | `ZhipuAI/GLM-TTS` | — | text-to-speech | mit | 4,516 | 54 | 8.3 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-TTS) |
| 80 | `ZhipuAI/cogvlm2-llama3-chat-19B-int4` | — | text-generation | other | 4,355 | 3 | 11.7 GB | 2024-05-24 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm2-llama3-chat-19B-int4) |
| 81 | `ZhipuAI/ChatGLM-6B-int8` | chatglm | text-generation | — | 4,317 | 10 | 6.3 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/ChatGLM-6B-int8) |
| 82 | `ZhipuAI/ImageReward` | — | text-to-image-synthesis | apache-2.0 | 3,870 | 3 | 5.1 GB | 2024-01-08 | [↗](https://modelscope.cn/models/ZhipuAI/ImageReward) |
| 83 | `ZhipuAI/CogVideoX1.5-5B` | — | text-to-video-synthesis | other | 3,373 | 10 | 28.9 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/CogVideoX1.5-5B) |
| 84 | `ZhipuAI/cogvlm2-video-llama3-base` | — | text-generation | other | 3,135 | 3 | 23.3 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm2-video-llama3-base) |
| 85 | `ZhipuAI/CodeGeeX-Code-Generation-13B` | gpt | — | — | 2,765 | 63 | 24.5 GB | 2022-12-29 | [↗](https://modelscope.cn/models/ZhipuAI/CodeGeeX-Code-Generation-13B) |
| 86 | `ZhipuAI/BPO` | llama | text-generation | — | 2,640 | 1 | 12.6 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/BPO) |
| 87 | `ZhipuAI/GLM-4.5-FP8` | glm4_moe | text-generation | mit | 2,503 | 1 | 336.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.5-FP8) |
| 88 | `ZhipuAI/glm-4-9b-hf` | glm | text-generation | other | 2,458 | 0 | 17.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-4-9b-hf) |
| 89 | `ZhipuAI/codegeex4-all-9b-GGUF` | — | text-generation | other | 2,331 | 15 | 37.9 GB | 2026-06-18 | [↗](https://modelscope.cn/models/ZhipuAI/codegeex4-all-9b-GGUF) |
| 90 | `ZhipuAI/GLM130B` | glm | — | other | 2,198 | 41 | 62.6 GB | 2023-03-23 | [↗](https://modelscope.cn/models/ZhipuAI/GLM130B) |
| 91 | `ZhipuAI/glm-edge-1.5b-chat` | glm | text-generation | other | 2,109 | 4 | 3.0 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-edge-1.5b-chat) |
| 92 | `ZhipuAI/cogagent-vqa` | — | visual-question-answering | Apache License 2.0 | 2,031 | 2 | 34.1 GB | 2024-01-03 | [↗](https://modelscope.cn/models/ZhipuAI/cogagent-vqa) |
| 93 | `ZhipuAI/CodeGeeX2-6B-int4` | chatglm | — | — | 1,993 | 13 | 3.7 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/CodeGeeX2-6B-int4) |
| 94 | `ZhipuAI/ChatGLM2-6B-32k-int4` | chatglm | — | — | 1,945 | 2 | 3.7 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/ChatGLM2-6B-32k-int4) |
| 95 | `ZhipuAI/GLM-4.5-Air-Base` | glm4_moe | text-generation | mit | 1,807 | 1 | 205.8 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.5-Air-Base) |
| 96 | `ZhipuAI/cogvlm-grounding-generalist` | — | visual-grounding | — | 1,741 | 1 | 32.9 GB | 2024-01-08 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm-grounding-generalist) |
| 97 | `ZhipuAI/glm-edge-v-2b` | glm | image-text-to-text | other | 1,618 | 5 | 3.9 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-edge-v-2b) |
| 98 | `ZhipuAI/glm-edge-v-5b-gguf` | — | image-text-to-text | other | 1,572 | 2 | 43.1 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-edge-v-5b-gguf) |
| 99 | `ZhipuAI/LongCite-glm4-9b` | chatglm | text-generation | — | 1,522 | 2 | 19.6 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/LongCite-glm4-9b) |
| 100 | `ZhipuAI/glm-edge-v-2b-gguf` | — | image-text-to-text | other | 1,318 | 0 | 16.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-edge-v-2b-gguf) |
| 101 | `ZhipuAI/glm-edge-v-5b` | glm | image-text-to-text | other | 1,221 | 12 | 9.1 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-edge-v-5b) |
| 102 | `ZhipuAI/glm-edge-1.5b-chat-gguf` | — | text-generation | other | 1,212 | 1 | 15.6 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-edge-1.5b-chat-gguf) |
| 103 | `ZhipuAI/glm-4-9b-chat-1m-hf` | glm | text-generation | other | 1,179 | 3 | 17.7 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-4-9b-chat-1m-hf) |
| 104 | `ZhipuAI/CogView3-Plus-3B` | — | text-to-image-synthesis | apache-2.0 | 1,119 | 8 | 23.8 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/CogView3-Plus-3B) |
| 105 | `ZhipuAI/Multilingual-GLM-Summarization-en` | glm | text-summarization | — | 1,065 | 5 | 2.0 GB | 2022-12-29 | [↗](https://modelscope.cn/models/ZhipuAI/Multilingual-GLM-Summarization-en) |
| 106 | `ZhipuAI/agentlm-7b` | llama | text-generation | — | 1,065 | 9 | 12.6 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/agentlm-7b) |
| 107 | `ZhipuAI/cogvlm2-llama3-caption` | — | — | other | 1,052 | 4 | 23.3 GB | 2026-06-18 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm2-llama3-caption) |
| 108 | `ZhipuAI/glm-edge-4b-chat-gguf` | — | text-generation | other | 957 | 0 | 42.1 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-edge-4b-chat-gguf) |
| 109 | `ZhipuAI/LongWriter-llama3.1-8b` | llama | — | llama3.1 | 947 | 2 | 15.0 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/LongWriter-llama3.1-8b) |
| 110 | `ZhipuAI/CodeGeeX-Code-Translation-13B` | gpt | — | — | 855 | 39 | 24.0 GB | 2022-12-29 | [↗](https://modelscope.cn/models/ZhipuAI/CodeGeeX-Code-Translation-13B) |
| 111 | `ZhipuAI/GLM-4-32B-Base-0414` | glm4 | text-generation | mit | 804 | 1 | 60.7 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4-32B-Base-0414) |
| 112 | `ZhipuAI/MathGLM-ChatGLM2-6B` | — | — | — | 801 | 1 | 11.6 GB | 2023-10-01 | [↗](https://modelscope.cn/models/ZhipuAI/MathGLM-ChatGLM2-6B) |
| 113 | `ZhipuAI/GLM-4.5-Base` | glm4_moe | text-generation | mit | 769 | 2 | 667.5 GB | 2026-06-16 | [↗](https://modelscope.cn/models/ZhipuAI/GLM-4.5-Base) |
| 114 | `ZhipuAI/chatglm-6b-int4-qe` | chatglm | text-generation | — | 621 | 2 | 3.1 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/chatglm-6b-int4-qe) |
| 115 | `ZhipuAI/cogvlm2-llama3-chinese-chat-19B-tgi` | cogvlm2 | text-generation | other | 504 | 3 | 36.3 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm2-llama3-chinese-chat-19B-tgi) |
| 116 | `ZhipuAI/cogvlm-base-490` | — | image-captioning | apache-2.0 | 502 | 0 | 32.9 GB | 2023-11-22 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm-base-490) |
| 117 | `ZhipuAI/VisionReward-Image` | — | text-generation | other | 481 | 1 | 72.7 GB | 2025-03-15 | [↗](https://modelscope.cn/models/ZhipuAI/VisionReward-Image) |
| 118 | `ZhipuAI/VisionReward-Video` | — | text-generation | other | 423 | 0 | 23.3 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/VisionReward-Video) |
| 119 | `ZhipuAI/cogvlm2-llama3-chat-19B-tgi` | cogvlm2 | text-generation | other | 412 | 1 | 36.3 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm2-llama3-chat-19B-tgi) |
| 120 | `ZhipuAI/agentlm-70b` | llama | — | — | 399 | 7 | 128.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/agentlm-70b) |
| 121 | `ZhipuAI/cogvlm-base-224` | — | image-captioning | apache-2.0 | 390 | 0 | 32.9 GB | 2023-11-22 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm-base-224) |
| 122 | `ZhipuAI/glm-2b` | glm | text-generation | — | 365 | 2 | 3.6 GB | 2024-01-09 | [↗](https://modelscope.cn/models/ZhipuAI/glm-2b) |
| 123 | `ZhipuAI/cogvlm-grounding-base` | — | visual-grounding | — | 360 | 3 | 32.9 GB | 2023-11-22 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm-grounding-base) |
| 124 | `ZhipuAI/glm-10b-chinese` | glm | text-generation | — | 357 | 1 | 18.4 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/glm-10b-chinese) |
| 125 | `ZhipuAI/VisionReward-Image-bf16` | — | — | — | 353 | 0 | 36.3 GB | 2025-02-13 | [↗](https://modelscope.cn/models/ZhipuAI/VisionReward-Image-bf16) |
| 126 | `ZhipuAI/cogvlm-chat-hf` | — | text-generation | apache-2.0 | 315 | 0 | 32.9 GB | 2026-06-18 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm-chat-hf) |
| 127 | `ZhipuAI/CogAgent` | — | text-generation | apache-2.0 | 313 | 4 | 54.1 GB | 2024-01-04 | [↗](https://modelscope.cn/models/ZhipuAI/CogAgent) |
| 128 | `ZhipuAI/glm-large-chinese` | glm | text-generation | — | 284 | 0 | 679.5 MB | 2024-01-09 | [↗](https://modelscope.cn/models/ZhipuAI/glm-large-chinese) |
| 129 | `ZhipuAI/WebVIA-Agent` | glm4v | image-text-to-text | mit | 278 | 0 | 19.2 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/WebVIA-Agent) |
| 130 | `ZhipuAI/cogvlm-grounding-generalist-hf` | — | text-generation | — | 275 | 0 | 32.9 GB | 2026-06-17 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm-grounding-generalist-hf) |
| 131 | `ZhipuAI/RealVideo` | — | any-to-any | mit | 272 | 1 | 60.7 GB | 2025-12-12 | [↗](https://modelscope.cn/models/ZhipuAI/RealVideo) |
| 132 | `ZhipuAI/cogvlm-grounding-base-hf` | — | text-generation | — | 272 | 0 | 32.9 GB | 2026-02-03 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm-grounding-base-hf) |
| 133 | `ZhipuAI/SCAIL-Preview` | — | multi-modal-embedding | mit | 270 | 9 | 44.0 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/SCAIL-Preview) |
| 134 | `ZhipuAI/cogagent-vqa-hf` | — | text-generation | apache-2.0 | 262 | 1 | 34.1 GB | 2026-06-18 | [↗](https://modelscope.cn/models/ZhipuAI/cogagent-vqa-hf) |
| 135 | `ZhipuAI/LongCite-llama3.1-8b` | llama | text-generation | — | 259 | 0 | 15.0 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/LongCite-llama3.1-8b) |
| 136 | `ZhipuAI/cogvlm-base-490-hf` | — | text-generation | apache-2.0 | 256 | 0 | 32.9 GB | 2026-06-18 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm-base-490-hf) |
| 137 | `ZhipuAI/cogagent-chat-hf` | — | text-generation | apache-2.0 | 238 | 0 | 34.1 GB | 2026-06-18 | [↗](https://modelscope.cn/models/ZhipuAI/cogagent-chat-hf) |
| 138 | `ZhipuAI/cogvlm-base-224-hf` | — | text-generation | — | 237 | 0 | 32.9 GB | 2026-06-18 | [↗](https://modelscope.cn/models/ZhipuAI/cogvlm-base-224-hf) |
| 139 | `ZhipuAI/CogVideo` | — | text-to-video-synthesis | Apache License 2.0 | 234 | 6 | 26.5 GB | 2024-03-28 | [↗](https://modelscope.cn/models/ZhipuAI/CogVideo) |
| 140 | `ZhipuAI/CogView2` | — | text-to-video-synthesis | apache-2.0 | 216 | 1 | 33.5 GB | 2024-01-09 | [↗](https://modelscope.cn/models/ZhipuAI/CogView2) |
| 141 | `ZhipuAI/glm-10b` | glm | text-generation | — | 215 | 1 | 18.4 GB | 2024-01-09 | [↗](https://modelscope.cn/models/ZhipuAI/glm-10b) |
| 142 | `ZhipuAI/LongReward-glm4-9b-DPO` | glm | text-generation | other | 187 | 0 | 17.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/LongReward-glm4-9b-DPO) |
| 143 | `ZhipuAI/MathGLM-2B` | — | — | — | 167 | 0 | 4.0 GB | 2023-10-01 | [↗](https://modelscope.cn/models/ZhipuAI/MathGLM-2B) |
| 144 | `ZhipuAI/LongReward-llama3.1-8b-dpo` | llama | text-generation | — | 160 | 0 | 15.0 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/LongReward-llama3.1-8b-dpo) |
| 145 | `ZhipuAI/Kaleido-14B-S2V` | — | — | mit | 153 | 1 | 64.3 GB | 2025-12-11 | [↗](https://modelscope.cn/models/ZhipuAI/Kaleido-14B-S2V) |
| 146 | `ZhipuAI/WebGLM-2B` | glm | text-generation | — | 150 | 1 | 3.6 GB | 2024-01-08 | [↗](https://modelscope.cn/models/ZhipuAI/WebGLM-2B) |
| 147 | `ZhipuAI/TransformerXL-Fast-Poem` | TransformerXL | — | — | 143 | 7 | 5.3 GB | 2022-12-29 | [↗](https://modelscope.cn/models/ZhipuAI/TransformerXL-Fast-Poem) |
| 148 | `ZhipuAI/glm-roberta-large` | glm | text-generation | — | 143 | 0 | 1.3 GB | 2024-01-08 | [↗](https://modelscope.cn/models/ZhipuAI/glm-roberta-large) |
| 149 | `ZhipuAI/WebGLM` | glm | text-generation | — | 140 | 0 | 36.8 GB | 2024-01-08 | [↗](https://modelscope.cn/models/ZhipuAI/WebGLM) |
| 150 | `ZhipuAI/MathGLM-ChatGLM-6B` | — | — | — | 129 | 1 | 12.5 GB | 2023-10-01 | [↗](https://modelscope.cn/models/ZhipuAI/MathGLM-ChatGLM-6B) |
| 151 | `ZhipuAI/UI2Code_N` | glm4v | image-text-to-text | mit | 127 | 0 | 19.2 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/UI2Code_N) |
| 152 | `ZhipuAI/MathGLM-500M` | — | — | — | 123 | 1 | 1.1 GB | 2023-10-01 | [↗](https://modelscope.cn/models/ZhipuAI/MathGLM-500M) |
| 153 | `ZhipuAI/androidgen-glm-4-9b` | chatglm | — | other | 97 | 2 | 17.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/androidgen-glm-4-9b) |
| 154 | `ZhipuAI/webrl-llama-3.1-70b` | llama | — | other | 94 | 0 | 262.8 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/webrl-llama-3.1-70b) |
| 155 | `ZhipuAI/MathGLM-100M` | — | — | — | 93 | 0 | 271.8 MB | 2023-10-01 | [↗](https://modelscope.cn/models/ZhipuAI/MathGLM-100M) |
| 156 | `ZhipuAI/SWE-Dev-9B` | chatglm | — | mit | 92 | 1 | 17.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/SWE-Dev-9B) |
| 157 | `ZhipuAI/SSVAE` | — | multi-modal-embedding | mit | 91 | 0 | 1.3 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/SSVAE) |
| 158 | `ZhipuAI/androidgen-llama-3-70b` | llama | — | other | 91 | 0 | 131.4 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/androidgen-llama-3-70b) |
| 159 | `ZhipuAI/SWE-Dev-32B` | qwen2 | text-generation | mit | 91 | 0 | 61.0 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/SWE-Dev-32B) |
| 160 | `ZhipuAI/webrl-glm-4-9b` | chatglm | — | other | 88 | 0 | 52.5 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/webrl-glm-4-9b) |
| 161 | `ZhipuAI/MathGLM-Large-335M` | — | — | — | 88 | 0 | 678.5 MB | 2023-10-01 | [↗](https://modelscope.cn/models/ZhipuAI/MathGLM-Large-335M) |
| 162 | `ZhipuAI/SWE-Dev-7B` | qwen2 | — | mit | 84 | 0 | 14.2 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/SWE-Dev-7B) |
| 163 | `ZhipuAI/webrl-orm-llama-3.1-8b` | llama | — | other | 84 | 0 | 15.0 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/webrl-orm-llama-3.1-8b) |
| 164 | `ZhipuAI/webrl-llama-3.1-8b` | llama | — | other | 83 | 0 | 59.8 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/webrl-llama-3.1-8b) |
| 165 | `ZhipuAI/apar-7b` | llama | text-generation | — | 83 | 0 | 13.1 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/apar-7b) |
| 166 | `ZhipuAI/apar-13b` | llama | text-generation | — | 81 | 0 | 25.0 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/apar-13b) |
| 167 | `ZhipuAI/MSAGPT` | — | — | apache-2.0 | 79 | 0 | 16.0 GB | 2026-01-20 | [↗](https://modelscope.cn/models/ZhipuAI/MSAGPT) |
| 168 | `ZhipuAI/RelayDiffusion` | — | — | — | 55 | 1 | 31.9 KB | 2024-03-29 | [↗](https://modelscope.cn/models/ZhipuAI/RelayDiffusion) |

---

## 零一万物 (01.AI)

Namespace: `01ai` · 组织主页: [https://modelscope.cn/organization/01ai](https://modelscope.cn/organization/01ai) · 模型数: **28**

| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |
|---|---------|------|------|------|------|------|------|------|------|
| 1 | `01ai/Yi-6B-Chat` | llama | text-generation | apache-2.0 | 48,061 | 22 | 11.3 GB | 2024-06-26 | [↗](https://modelscope.cn/models/01ai/Yi-6B-Chat) |
| 2 | `01ai/Yi-1.5-34B-Chat` | llama | text-generation | Apache License 2.0 | 20,851 | 18 | 64.1 GB | 2024-06-27 | [↗](https://modelscope.cn/models/01ai/Yi-1.5-34B-Chat) |
| 3 | `01ai/Yi-6B-Chat-4bits` | llama | text-generation | apache-2.0 | 18,073 | 3 | 3.7 GB | 2024-06-26 | [↗](https://modelscope.cn/models/01ai/Yi-6B-Chat-4bits) |
| 4 | `01ai/Yi-1.5-6B-Chat` | llama | text-generation | Apache License 2.0 | 18,006 | 18 | 11.3 GB | 2024-06-27 | [↗](https://modelscope.cn/models/01ai/Yi-1.5-6B-Chat) |
| 5 | `01ai/Yi-34B-Chat-4bits` | llama | text-generation | apache-2.0 | 17,055 | 38 | 35.8 GB | 2024-06-26 | [↗](https://modelscope.cn/models/01ai/Yi-34B-Chat-4bits) |
| 6 | `01ai/Yi-6B` | llama | text-generation | apache-2.0 | 14,688 | 121 | 11.3 GB | 2024-06-26 | [↗](https://modelscope.cn/models/01ai/Yi-6B) |
| 7 | `01ai/Yi-34B-Chat` | llama | text-generation | apache-2.0 | 14,134 | 42 | 64.1 GB | 2024-06-26 | [↗](https://modelscope.cn/models/01ai/Yi-34B-Chat) |
| 8 | `01ai/Yi-VL-6B` | llava | visual-question-answering | Apache License 2.0 | 13,669 | 15 | 18.5 GB | 2024-06-27 | [↗](https://modelscope.cn/models/01ai/Yi-VL-6B) |
| 9 | `01ai/Yi-1.5-6B` | llama | text-generation | Apache License 2.0 | 13,371 | 5 | 11.3 GB | 2024-06-26 | [↗](https://modelscope.cn/models/01ai/Yi-1.5-6B) |
| 10 | `01ai/Yi-1.5-9B-Chat` | llama | text-generation | Apache License 2.0 | 12,000 | 21 | 16.5 GB | 2024-06-27 | [↗](https://modelscope.cn/models/01ai/Yi-1.5-9B-Chat) |
| 11 | `01ai/Yi-34B-200K` | llama | text-generation | apache-2.0 | 11,025 | 42 | 64.1 GB | 2024-06-26 | [↗](https://modelscope.cn/models/01ai/Yi-34B-200K) |
| 12 | `01ai/Yi-VL-34B` | llava | visual-question-answering | Apache License 2.0 | 10,076 | 34 | 71.4 GB | 2024-06-27 | [↗](https://modelscope.cn/models/01ai/Yi-VL-34B) |
| 13 | `01ai/Yi-9B` | llama | text-generation | apache-2.0 | 8,701 | 22 | 16.5 GB | 2025-02-26 | [↗](https://modelscope.cn/models/01ai/Yi-9B) |
| 14 | `01ai/Yi-34B` | llama | text-generation | apache-2.0 | 7,141 | 168 | 64.1 GB | 2024-06-26 | [↗](https://modelscope.cn/models/01ai/Yi-34B) |
| 15 | `01ai/Yi-6B-Chat-8bits` | llama | text-generation | apache-2.0 | 5,587 | 5 | 6.3 GB | 2025-02-26 | [↗](https://modelscope.cn/models/01ai/Yi-6B-Chat-8bits) |
| 16 | `01ai/Yi-6B-200K` | llama | text-generation | apache-2.0 | 5,397 | 45 | 11.3 GB | 2024-06-26 | [↗](https://modelscope.cn/models/01ai/Yi-6B-200K) |
| 17 | `01ai/Yi-1.5-34B-Chat-16K` | llama | text-classification | Apache License 2.0 | 4,053 | 10 | 64.1 GB | 2024-06-27 | [↗](https://modelscope.cn/models/01ai/Yi-1.5-34B-Chat-16K) |
| 18 | `01ai/Yi-34B-Chat-8bits` | llama | text-generation | apache-2.0 | 4,033 | 10 | 33.6 GB | 2024-06-26 | [↗](https://modelscope.cn/models/01ai/Yi-34B-Chat-8bits) |
| 19 | `01ai/Yi-1.5-9B-Chat-16K` | llama | text-generation | Apache License 2.0 | 1,871 | 4 | 16.5 GB | 2024-06-27 | [↗](https://modelscope.cn/models/01ai/Yi-1.5-9B-Chat-16K) |
| 20 | `01ai/Yi-1.5-9B` | llama | text-classification | Apache License 2.0 | 1,429 | 7 | 16.5 GB | 2024-06-27 | [↗](https://modelscope.cn/models/01ai/Yi-1.5-9B) |
| 21 | `01ai/Yi-Coder-9B-Chat` | llama | text2text-generation | apache-2.0 | 1,427 | 13 | 16.4 GB | 2024-09-05 | [↗](https://modelscope.cn/models/01ai/Yi-Coder-9B-Chat) |
| 22 | `01ai/Yi-1.5-34B` | llama | text-classification | Apache License 2.0 | 1,330 | 3 | 64.1 GB | 2024-06-27 | [↗](https://modelscope.cn/models/01ai/Yi-1.5-34B) |
| 23 | `01ai/Yi-9B-200K` | llama | text-generation | apache-2.0 | 1,183 | 2 | 16.5 GB | 2024-06-26 | [↗](https://modelscope.cn/models/01ai/Yi-9B-200K) |
| 24 | `01ai/Yi-1.5-9B-32K` | llama | text-generation | Apache License 2.0 | 745 | 3 | 16.5 GB | 2024-06-26 | [↗](https://modelscope.cn/models/01ai/Yi-1.5-9B-32K) |
| 25 | `01ai/Yi-1.5-34B-32K` | llama | text-generation | Apache License 2.0 | 734 | 2 | 64.1 GB | 2024-06-26 | [↗](https://modelscope.cn/models/01ai/Yi-1.5-34B-32K) |
| 26 | `01ai/Yi-Coder-1.5B-Chat` | llama | text2text-generation | apache-2.0 | 436 | 3 | 2.8 GB | 2024-09-05 | [↗](https://modelscope.cn/models/01ai/Yi-Coder-1.5B-Chat) |
| 27 | `01ai/Yi-Coder-1.5B` | llama | text2text-generation | apache-2.0 | 336 | 2 | 2.8 GB | 2024-09-04 | [↗](https://modelscope.cn/models/01ai/Yi-Coder-1.5B) |
| 28 | `01ai/Yi-Coder-9B` | llama | text2text-generation | apache-2.0 | 276 | 3 | 16.5 GB | 2024-09-04 | [↗](https://modelscope.cn/models/01ai/Yi-Coder-9B) |

---

## 百川智能 (Baichuan)

Namespace: `baichuan-inc` · 组织主页: [https://modelscope.cn/organization/baichuan-inc](https://modelscope.cn/organization/baichuan-inc) · 模型数: **24**

| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |
|---|---------|------|------|------|------|------|------|------|------|
| 1 | `baichuan-inc/Baichuan2-7B-Chat-4bits` | baichuan | text-generation | other | 365,748 | 35 | 5.0 GB | 2025-02-26 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan2-7B-Chat-4bits) |
| 2 | `baichuan-inc/Baichuan2-7B-Chat` | baichuan | text-generation | — | 358,199 | 93 | 14.0 GB | 2025-02-26 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan2-7B-Chat) |
| 3 | `baichuan-inc/Baichuan2-13B-Chat` | baichuan | text-generation | other | 263,382 | 251 | 25.9 GB | 2025-02-26 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan2-13B-Chat) |
| 4 | `baichuan-inc/Baichuan-M2-32B-GPTQ-Int4` | qwen2 | text-generation | apache-2.0 | 189,675 | 9 | 19.5 GB | 2025-09-03 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan-M2-32B-GPTQ-Int4) |
| 5 | `baichuan-inc/Baichuan2-13B-Chat-4bits` | baichuan | text-generation | other | 87,011 | 61 | 8.5 GB | 2025-02-26 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan2-13B-Chat-4bits) |
| 6 | `baichuan-inc/Baichuan2-7B-Base` | baichuan | text-generation | other | 44,725 | 31 | 14.0 GB | 2025-02-26 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan2-7B-Base) |
| 7 | `baichuan-inc/baichuan-7B` | baichuan | text-generation | — | 40,789 | 123 | 13.0 GB | 2025-02-26 | [↗](https://modelscope.cn/models/baichuan-inc/baichuan-7B) |
| 8 | `baichuan-inc/Baichuan2-13B-Base` | baichuan | text-generation | other | 39,416 | 36 | 25.9 GB | 2025-02-26 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan2-13B-Base) |
| 9 | `baichuan-inc/Baichuan-13B-Chat` | baichuan | text-generation | — | 39,235 | 129 | 24.7 GB | 2025-02-26 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan-13B-Chat) |
| 10 | `baichuan-inc/Baichuan-13B-Base` | baichuan | text-generation | — | 30,440 | 78 | 24.7 GB | 2025-02-26 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan-13B-Base) |
| 11 | `baichuan-inc/Baichuan-M2-32B` | qwen2 | text-generation | apache-2.0 | 25,194 | 34 | 62.5 GB | 2025-12-24 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan-M2-32B) |
| 12 | `baichuan-inc/Baichuan-M1-14B-Instruct` | baichuan_m1 | text-generation | — | 5,269 | 23 | 27.0 GB | 2025-02-20 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan-M1-14B-Instruct) |
| 13 | `baichuan-inc/Baichuan-M3-235B` | qwen3_moe | text-generation | apache-2.0 | 4,009 | 14 | 439.1 GB | 2026-02-09 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan-M3-235B) |
| 14 | `baichuan-inc/Baichuan-Audio-Instruct` | omni | — | apache-2.0 | 2,674 | 2 | 19.7 GB | 2025-02-25 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan-Audio-Instruct) |
| 15 | `baichuan-inc/Baichuan-Omni-1d5` | omni | — | apache-2.0 | 1,621 | 2 | 20.9 GB | 2025-02-08 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan-Omni-1d5) |
| 16 | `baichuan-inc/BaichuanMed-OCR-7B` | qwen2_5_vl | image-text-to-text | other | 1,392 | 2 | 15.5 GB | 2025-04-07 | [↗](https://modelscope.cn/models/baichuan-inc/BaichuanMed-OCR-7B) |
| 17 | `baichuan-inc/Baichuan-M1-14B-Base` | baichuan_m1 | text-generation | — | 1,265 | 2 | 27.0 GB | 2025-02-20 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan-M1-14B-Base) |
| 18 | `baichuan-inc/Baichuan-Omni-1d5-Base` | omni | — | apache-2.0 | 982 | 0 | 20.9 GB | 2025-02-08 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan-Omni-1d5-Base) |
| 19 | `baichuan-inc/Baichuan-Audio-Base` | omni | — | apache-2.0 | 796 | 0 | 19.7 GB | 2025-02-25 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan-Audio-Base) |
| 20 | `baichuan-inc/BaichuanMed-OCR-72B` | qwen2_5_vl | image-text-to-text | other | 677 | 2 | 136.8 GB | 2025-04-07 | [↗](https://modelscope.cn/models/baichuan-inc/BaichuanMed-OCR-72B) |
| 21 | `baichuan-inc/Baichuan-M3-235B-GPTQ-INT4` | qwen3_moe | text-generation | apache-2.0 | 629 | 2 | 116.0 GB | 2026-02-09 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan-M3-235B-GPTQ-INT4) |
| 22 | `baichuan-inc/Baichuan-M3-235B-Q4_K_M-GGUF` | — | text-generation | apache-2.0 | 510 | 0 | 133.9 GB | 2026-02-09 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan-M3-235B-Q4_K_M-GGUF) |
| 23 | `baichuan-inc/Baichuan-M3-235B-FP8` | qwen3_moe | — | apache-2.0 | 193 | 2 | 221.4 GB | 2026-02-09 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan-M3-235B-FP8) |
| 24 | `baichuan-inc/Baichuan-M2-32B-Q4_K_M-GGUF` | — | text-generation | apache-2.0 | 180 | 1 | 20.4 GB | 2026-02-09 | [↗](https://modelscope.cn/models/baichuan-inc/Baichuan-M2-32B-Q4_K_M-GGUF) |

---

## 阶跃星辰 (StepFun)

Namespace: `stepfun-ai` · 组织主页: [https://modelscope.cn/organization/stepfun-ai](https://modelscope.cn/organization/stepfun-ai) · 模型数: **57**

| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |
|---|---------|------|------|------|------|------|------|------|------|
| 1 | `stepfun-ai/Step-3.5-Flash` | step3p5 | — | apache-2.0 | 3,924,322 | 37 | 371.4 GB | 2026-03-17 | [↗](https://modelscope.cn/models/stepfun-ai/Step-3.5-Flash) |
| 2 | `stepfun-ai/Step3-VL-10B` | step_robotics | image-text-to-text | apache-2.0 | 1,061,434 | 54 | 0.0 B | 2026-02-04 | [↗](https://modelscope.cn/models/stepfun-ai/Step3-VL-10B) |
| 3 | `stepfun-ai/GOT-OCR2_0` | GOT | image-text-to-text | apache-2.0 | 615,805 | 119 | 1.3 GB | 2025-02-26 | [↗](https://modelscope.cn/models/stepfun-ai/GOT-OCR2_0) |
| 4 | `stepfun-ai/GOT-OCR-2.0-hf` | got_ocr2 | image-text-to-text | apache-2.0 | 38,345 | 9 | 1.1 GB | 2025-02-05 | [↗](https://modelscope.cn/models/stepfun-ai/GOT-OCR-2.0-hf) |
| 5 | `stepfun-ai/Step-Audio-R1` | step_audio_2 | — | apache-2.0 | 22,646 | 6 | 62.4 GB | 2025-12-02 | [↗](https://modelscope.cn/models/stepfun-ai/Step-Audio-R1) |
| 6 | `stepfun-ai/stepvideo-t2v` | — | text-to-video-synthesis | mit | 21,015 | 73 | 97.6 GB | 2025-02-26 | [↗](https://modelscope.cn/models/stepfun-ai/stepvideo-t2v) |
| 7 | `stepfun-ai/Step-Audio-2-mini` | step_audio_2 | any-to-any | apache-2.0 | 18,726 | 35 | 16.7 GB | 2026-02-14 | [↗](https://modelscope.cn/models/stepfun-ai/Step-Audio-2-mini) |
| 8 | `stepfun-ai/Step-3.5-Flash-Base` | step3p5 | — | apache-2.0 | 18,351 | 4 | 368.4 GB | 2026-03-09 | [↗](https://modelscope.cn/models/stepfun-ai/Step-3.5-Flash-Base) |
| 9 | `stepfun-ai/Step-Audio-Chat` | step1 | — | apache-2.0 | 16,095 | 33 | 245.9 GB | 2025-04-23 | [↗](https://modelscope.cn/models/stepfun-ai/Step-Audio-Chat) |
| 10 | `stepfun-ai/Step-3.7-Flash` | step3p7 | image-text-to-text | apache-2.0 | 9,279 | 29 | 375.1 GB | 2026-06-03 | [↗](https://modelscope.cn/models/stepfun-ai/Step-3.7-Flash) |
| 11 | `stepfun-ai/step3` | step3_vl | image-text-to-text | apache-2.0 | 8,005 | 19 | 597.9 GB | 2026-01-29 | [↗](https://modelscope.cn/models/stepfun-ai/step3) |
| 12 | `stepfun-ai/Step-Audio-TTS-3B` | step1 | text-to-speech | apache-2.0 | 6,179 | 44 | 8.6 GB | 2025-04-23 | [↗](https://modelscope.cn/models/stepfun-ai/Step-Audio-TTS-3B) |
| 13 | `stepfun-ai/Step-Audio-Tokenizer` | — | text-to-speech | apache-2.0 | 6,057 | 12 | 1.3 GB | 2025-02-18 | [↗](https://modelscope.cn/models/stepfun-ai/Step-Audio-Tokenizer) |
| 14 | `stepfun-ai/Step1X-Edit` | — | image-to-image | apache-2.0 | 4,864 | 24 | 48.9 GB | 2025-07-09 | [↗](https://modelscope.cn/models/stepfun-ai/Step1X-Edit) |
| 15 | `stepfun-ai/GELab-Zero-4B-preview` | qwen3_vl | image-text-to-text | apache-2.0 | 4,778 | 16 | 8.3 GB | 2025-12-19 | [↗](https://modelscope.cn/models/stepfun-ai/GELab-Zero-4B-preview) |
| 16 | `stepfun-ai/Step-3.5-Flash-FP8` | step3p5 | — | apache-2.0 | 4,136 | 5 | 194.2 GB | 2026-03-09 | [↗](https://modelscope.cn/models/stepfun-ai/Step-3.5-Flash-FP8) |
| 17 | `stepfun-ai/stepvideo-t2v-turbo` | — | text-to-video-synthesis | mit | 3,684 | 13 | 54.7 GB | 2025-02-17 | [↗](https://modelscope.cn/models/stepfun-ai/stepvideo-t2v-turbo) |
| 18 | `stepfun-ai/Step-Audio-EditX` | step1 | text-to-speech | — | 3,412 | 25 | 7.7 GB | 2026-02-14 | [↗](https://modelscope.cn/models/stepfun-ai/Step-Audio-EditX) |
| 19 | `stepfun-ai/step3-fp8` | step3_vl | image-text-to-text | apache-2.0 | 3,230 | 1 | 305.1 GB | 2025-08-02 | [↗](https://modelscope.cn/models/stepfun-ai/step3-fp8) |
| 20 | `stepfun-ai/Step-3.5-Flash-GGUF-Q4_K_S` | step3p5 | — | apache-2.0 | 3,049 | 1 | 103.8 GB | 2026-02-13 | [↗](https://modelscope.cn/models/stepfun-ai/Step-3.5-Flash-GGUF-Q4_K_S) |
| 21 | `stepfun-ai/Step3-VL-10B-FP8` | — | image-text-to-text | apache-2.0 | 3,047 | 2 | 0.0 B | 2026-02-04 | [↗](https://modelscope.cn/models/stepfun-ai/Step3-VL-10B-FP8) |
| 22 | `stepfun-ai/Step-3.5-Flash-Int4` | step3p5 | — | apache-2.0 | 2,576 | 4 | 207.7 GB | 2026-02-13 | [↗](https://modelscope.cn/models/stepfun-ai/Step-3.5-Flash-Int4) |
| 23 | `stepfun-ai/Step3-VL-10B-Base` | step_robotics | image-text-to-text | apache-2.0 | 1,804 | 3 | 19.0 GB | 2026-01-20 | [↗](https://modelscope.cn/models/stepfun-ai/Step3-VL-10B-Base) |
| 24 | `stepfun-ai/Step-3.7-Flash-FP8` | step3p7 | image-text-to-text | apache-2.0 | 1,722 | 0 | 197.9 GB | 2026-06-01 | [↗](https://modelscope.cn/models/stepfun-ai/Step-3.7-Flash-FP8) |
| 25 | `stepfun-ai/Step-Audio-R1.1` | step_audio_2 | — | apache-2.0 | 1,597 | 9 | 62.4 GB | 2026-02-14 | [↗](https://modelscope.cn/models/stepfun-ai/Step-Audio-R1.1) |
| 26 | `stepfun-ai/Step-3.7-Flash-GGUF` | — | image-text-to-text | apache-2.0 | 1,318 | 1 | 1.0 TB | 2026-06-03 | [↗](https://modelscope.cn/models/stepfun-ai/Step-3.7-Flash-GGUF) |
| 27 | `stepfun-ai/stepvideo-ti2v` | — | image-to-video | mit | 1,119 | 18 | 97.7 GB | 2025-03-20 | [↗](https://modelscope.cn/models/stepfun-ai/stepvideo-ti2v) |
| 28 | `stepfun-ai/Step-3.5-Flash-GGUF-Q8_0` | — | — | apache-2.0 | 1,004 | 1 | 195.0 GB | 2026-02-14 | [↗](https://modelscope.cn/models/stepfun-ai/Step-3.5-Flash-GGUF-Q8_0) |
| 29 | `stepfun-ai/Step-3.7-Flash-NVFP4` | step3p7 | image-text-to-text | apache-2.0 | 789 | 4 | 120.4 GB | 2026-06-01 | [↗](https://modelscope.cn/models/stepfun-ai/Step-3.7-Flash-NVFP4) |
| 30 | `stepfun-ai/Step-3.5-Flash-Base-Midtrain` | step3p5 | — | apache-2.0 | 755 | 1 | 368.4 GB | 2026-03-09 | [↗](https://modelscope.cn/models/stepfun-ai/Step-3.5-Flash-Base-Midtrain) |
| 31 | `stepfun-ai/Step1X-3D` | — | — | apache-2.0 | 721 | 10 | 18.3 GB | 2025-05-13 | [↗](https://modelscope.cn/models/stepfun-ai/Step1X-3D) |
| 32 | `stepfun-ai/Step-Audio-AQAA` | mmgpt_step1_v2 | text-to-speech | apache-2.0 | 694 | 2 | 254.6 GB | 2025-06-19 | [↗](https://modelscope.cn/models/stepfun-ai/Step-Audio-AQAA) |
| 33 | `stepfun-ai/Step-Audio-2-mini-Base` | step_audio_2 | audio-generation | apache-2.0 | 530 | 1 | 16.7 GB | 2025-09-02 | [↗](https://modelscope.cn/models/stepfun-ai/Step-Audio-2-mini-Base) |
| 34 | `stepfun-ai/Step1X-Edit-v1p2-preview` | — | image-to-image | apache-2.0 | 399 | 2 | 39.0 GB | 2025-09-08 | [↗](https://modelscope.cn/models/stepfun-ai/Step1X-Edit-v1p2-preview) |
| 35 | `stepfun-ai/Step-Audio-2-mini-Think` | step_audio_2 | — | apache-2.0 | 353 | 0 | 16.7 GB | 2025-09-11 | [↗](https://modelscope.cn/models/stepfun-ai/Step-Audio-2-mini-Think) |
| 36 | `stepfun-ai/NextStep-1-Large-Edit` | nextstep | image-to-image | apache-2.0 | 336 | 2 | 54.6 GB | 2025-08-20 | [↗](https://modelscope.cn/models/stepfun-ai/NextStep-1-Large-Edit) |
| 37 | `stepfun-ai/Qwen2.5-32B-DialogueReason` | qwen2 | — | apache-2.0 | 319 | 0 | 61.0 GB | 2025-06-19 | [↗](https://modelscope.cn/models/stepfun-ai/Qwen2.5-32B-DialogueReason) |
| 38 | `stepfun-ai/Step-3.5-Flash-Int8` | — | — | apache-2.0 | 251 | 0 | 195.0 GB | 2026-02-14 | [↗](https://modelscope.cn/models/stepfun-ai/Step-3.5-Flash-Int8) |
| 39 | `stepfun-ai/Step1X-Edit-v1p1-diffusers` | — | image-to-image | apache-2.0 | 249 | 0 | 38.9 GB | 2025-09-01 | [↗](https://modelscope.cn/models/stepfun-ai/Step1X-Edit-v1p1-diffusers) |
| 40 | `stepfun-ai/StepFun-Formalizer-7B` | qwen2 | text-generation | apache-2.0 | 242 | 0 | 14.2 GB | 2025-10-16 | [↗](https://modelscope.cn/models/stepfun-ai/StepFun-Formalizer-7B) |
| 41 | `stepfun-ai/PaCoRe-8B` | qwen3 | text-generation | mit | 241 | 2 | 15.3 GB | 2026-01-14 | [↗](https://modelscope.cn/models/stepfun-ai/PaCoRe-8B) |
| 42 | `stepfun-ai/NextStep-1-Large-Pretrain` | nextstep | text-to-image-synthesis | apache-2.0 | 231 | 0 | 28.2 GB | 2025-10-10 | [↗](https://modelscope.cn/models/stepfun-ai/NextStep-1-Large-Pretrain) |
| 43 | `stepfun-ai/StepFun-Formalizer-32B` | qwen2 | text-generation | apache-2.0 | 203 | 0 | 61.0 GB | 2025-10-16 | [↗](https://modelscope.cn/models/stepfun-ai/StepFun-Formalizer-32B) |
| 44 | `stepfun-ai/NextStep-1-Large` | nextstep | text-to-image-synthesis | apache-2.0 | 201 | 0 | 54.6 GB | 2025-08-20 | [↗](https://modelscope.cn/models/stepfun-ai/NextStep-1-Large) |
| 45 | `stepfun-ai/StepFun-Prover-Preview-7B` | qwen2 | text-generation | apache-2.0 | 198 | 0 | 14.2 GB | 2025-08-13 | [↗](https://modelscope.cn/models/stepfun-ai/StepFun-Prover-Preview-7B) |
| 46 | `stepfun-ai/NextStep-1-f8ch16-Tokenizer` | — | — | apache-2.0 | 188 | 0 | 327.6 MB | 2025-08-14 | [↗](https://modelscope.cn/models/stepfun-ai/NextStep-1-f8ch16-Tokenizer) |
| 47 | `stepfun-ai/Step-Audio-EditX-AWQ-4bit` | step1 | text-to-speech | — | 183 | 3 | 3.5 GB | 2026-01-24 | [↗](https://modelscope.cn/models/stepfun-ai/Step-Audio-EditX-AWQ-4bit) |
| 48 | `stepfun-ai/NextStep-1.1-Pretrain` | nextstep | text-to-image-synthesis | apache-2.0 | 168 | 0 | 28.2 GB | 2025-12-25 | [↗](https://modelscope.cn/models/stepfun-ai/NextStep-1.1-Pretrain) |
| 49 | `stepfun-ai/NextStep-1.1` | nextstep | text-to-image-synthesis | apache-2.0 | 156 | 1 | 56.0 GB | 2025-12-25 | [↗](https://modelscope.cn/models/stepfun-ai/NextStep-1.1) |
| 50 | `stepfun-ai/StepFun-Prover-Preview-32B` | qwen2 | text-generation | apache-2.0 | 146 | 0 | 61.0 GB | 2025-08-13 | [↗](https://modelscope.cn/models/stepfun-ai/StepFun-Prover-Preview-32B) |
| 51 | `stepfun-ai/RLVR-8B-0926` | qwen3 | text-generation | mit | 143 | 0 | 15.3 GB | 2026-01-14 | [↗](https://modelscope.cn/models/stepfun-ai/RLVR-8B-0926) |
| 52 | `stepfun-ai/stepvideo-t2v-v1` | — | — | mit | 100 | 0 | 7.1 GB | 2025-11-20 | [↗](https://modelscope.cn/models/stepfun-ai/stepvideo-t2v-v1) |
| 53 | `stepfun-ai/M-DocSum-7B` | qwen2_vl | — | apache-2.0 | 96 | 0 | 15.5 GB | 2025-11-19 | [↗](https://modelscope.cn/models/stepfun-ai/M-DocSum-7B) |
| 54 | `stepfun-ai/stepvideo-minute` | — | — | mit | 96 | 0 | 33.8 GB | 2025-11-19 | [↗](https://modelscope.cn/models/stepfun-ai/stepvideo-minute) |
| 55 | `stepfun-ai/stepvideo-ti2v-4b` | — | — | apache-2.0 | 94 | 0 | 7.1 GB | 2025-11-19 | [↗](https://modelscope.cn/models/stepfun-ai/stepvideo-ti2v-4b) |
| 56 | `stepfun-ai/Step-Audio-Examples` | — | — | Apache License 2.0 | 78 | 0 | 5.2 MB | 2025-10-20 | [↗](https://modelscope.cn/models/stepfun-ai/Step-Audio-Examples) |
| 57 | `stepfun-ai/NextStep-1.1-Pretrain-256px` | nextstep | text-to-image-synthesis | apache-2.0 | 72 | 0 | 28.2 GB | 2026-02-16 | [↗](https://modelscope.cn/models/stepfun-ai/NextStep-1.1-Pretrain-256px) |

---

## 腾讯混元 (Tencent Hunyuan)

Namespace: `Tencent-Hunyuan` · 组织主页: [https://modelscope.cn/organization/Tencent-Hunyuan](https://modelscope.cn/organization/Tencent-Hunyuan) · 模型数: **84**

| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |
|---|---------|------|------|------|------|------|------|------|------|
| 1 | `Tencent-Hunyuan/HunyuanOCR` | hunyuan_vl | image-text-to-text | other | 1,189,339 | 89 | 1.9 GB | 2025-11-25 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanOCR) |
| 2 | `Tencent-Hunyuan/Hunyuan-A13B-Instruct-FP8` | hunyuan | text-generation | — | 67,850 | 1 | 75.4 GB | 2025-07-08 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-A13B-Instruct-FP8) |
| 3 | `Tencent-Hunyuan/Hunyuan-A13B-Instruct` | hunyuan | text-generation | — | 51,037 | 31 | 149.8 GB | 2025-07-08 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-A13B-Instruct) |
| 4 | `Tencent-Hunyuan/HY-Embodied-0.5` | hunyuan_vl_mot | image-text-to-text | other | 47,559 | 18 | 7.1 GB | 2026-06-16 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HY-Embodied-0.5) |
| 5 | `Tencent-Hunyuan/Tencent-Hunyuan-Large` | — | text-generation | other | 43,277 | 6 | 1.8 TB | 2025-06-25 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Tencent-Hunyuan-Large) |
| 6 | `Tencent-Hunyuan/HY-World-2.0` | — | image-to-3D | other | 32,131 | 74 | 162.7 GB | 2026-06-17 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HY-World-2.0) |
| 7 | `Tencent-Hunyuan/Hunyuan-MT-7B` | hunyuan_v1_dense | translation | — | 22,023 | 62 | 15.0 GB | 2025-09-03 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-MT-7B) |
| 8 | `Tencent-Hunyuan/HY-MT1.5-1.8B` | hunyuan_v1_dense | translation | — | 14,248 | 37 | 3.8 GB | 2025-12-30 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HY-MT1.5-1.8B) |
| 9 | `Tencent-Hunyuan/HunyuanVideo-Foley` | — | audio-generation/text-to-speech | other | 12,414 | 28 | 17.3 GB | 2025-09-29 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanVideo-Foley) |
| 10 | `Tencent-Hunyuan/HunyuanVideo-1.5` | — | text-to-video-synthesis | other | 12,202 | 43 | 346.2 GB | 2026-06-18 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanVideo-1.5) |
| 11 | `Tencent-Hunyuan/HunyuanVideo` | — | text-to-video-synthesis | other | 11,147 | 39 | 37.1 GB | 2025-06-25 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanVideo) |
| 12 | `Tencent-Hunyuan/HY-OmniWeaving` | — | image-to-video | other | 10,190 | 21 | 51.5 GB | 2026-06-17 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HY-OmniWeaving) |
| 13 | `Tencent-Hunyuan/Hunyuan-MT-Chimera-7B-fp8` | hunyuan_v1_dense | translation | — | 9,153 | 1 | 7.5 GB | 2025-09-03 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-MT-Chimera-7B-fp8) |
| 14 | `Tencent-Hunyuan/HunyuanWorld-Voyager` | — | image-to-video | other | 6,968 | 13 | 80.2 GB | 2026-06-17 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanWorld-Voyager) |
| 15 | `Tencent-Hunyuan/Hunyuan3D-2` | — | image-to-3D | other | 6,609 | 35 | 69.7 GB | 2025-10-17 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan3D-2) |
| 16 | `Tencent-Hunyuan/Hunyuan3D-2.1` | — | image-to-3D | other | 5,953 | 35 | 13.9 GB | 2025-10-17 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan3D-2.1) |
| 17 | `Tencent-Hunyuan/HunyuanImage-3.0` | hunyuan_image_3_moe | text-to-image-synthesis | other | 5,320 | 33 | 157.1 GB | 2026-01-28 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanImage-3.0) |
| 18 | `Tencent-Hunyuan/HY-MT1.5-7B` | hunyuan_v1_dense | translation | — | 4,666 | 17 | 15.0 GB | 2025-12-30 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HY-MT1.5-7B) |
| 19 | `Tencent-Hunyuan/HunyuanImage-2.1` | — | text-to-image-synthesis | other | 4,380 | 22 | 161.3 GB | 2026-06-18 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanImage-2.1) |
| 20 | `Tencent-Hunyuan/HY-WorldPlay` | — | image-to-video | other | 4,215 | 11 | 176.3 GB | 2026-06-18 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HY-WorldPlay) |
| 21 | `Tencent-Hunyuan/Hunyuan-1.8B-Instruct` | hunyuan_v1_dense | text-generation | — | 4,109 | 11 | 3.3 GB | 2025-08-07 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-1.8B-Instruct) |
| 22 | `Tencent-Hunyuan/HunyuanImage-3.0-Instruct` | hunyuan_image_3_moe | image-to-image | other | 3,882 | 18 | 157.1 GB | 2026-02-04 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanImage-3.0-Instruct) |
| 23 | `Tencent-Hunyuan/HY-MT1.5-1.8B-GGUF` | — | translation | — | 3,759 | 17 | 4.2 GB | 2025-12-31 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HY-MT1.5-1.8B-GGUF) |
| 24 | `Tencent-Hunyuan/HunyuanCustom` | — | image-to-video | — | 3,742 | 14 | 178.0 GB | 2025-06-25 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanCustom) |
| 25 | `Tencent-Hunyuan/HunyuanWorld-Mirror` | — | image-to-3D | other | 3,402 | 19 | 4.7 GB | 2025-10-22 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanWorld-Mirror) |
| 26 | `Tencent-Hunyuan/HY-MT1.5-1.8B-FP8` | hunyuan_v1_dense | translation | — | 3,391 | 3 | 1.9 GB | 2025-12-30 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HY-MT1.5-1.8B-FP8) |
| 27 | `Tencent-Hunyuan/Hunyuan-GameCraft-1.0` | — | image-to-video | — | 3,211 | 15 | 83.9 GB | 2026-06-17 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-GameCraft-1.0) |
| 28 | `Tencent-Hunyuan/Hunyuan-0.5B-Instruct` | hunyuan_v1_dense | text-generation | — | 2,761 | 6 | 1.0 GB | 2025-08-06 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-0.5B-Instruct) |
| 29 | `Tencent-Hunyuan/Hy-MT2-7B` | hunyuan_v1_dense | translation | apache-2.0 | 2,543 | 4 | 15.0 GB | 2026-05-26 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hy-MT2-7B) |
| 30 | `Tencent-Hunyuan/HY-MT1.5-1.8B-GPTQ-Int4` | hunyuan_v1_dense | translation | — | 2,523 | 9 | 1.2 GB | 2025-12-30 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HY-MT1.5-1.8B-GPTQ-Int4) |
| 31 | `Tencent-Hunyuan/HunyuanWorld-1` | — | — | other | 2,416 | 12 | 1.5 GB | 2025-07-27 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanWorld-1) |
| 32 | `Tencent-Hunyuan/Hunyuan-MT-7B-fp8` | hunyuan_v1_dense | translation | — | 2,378 | 2 | 7.5 GB | 2025-09-03 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-MT-7B-fp8) |
| 33 | `Tencent-Hunyuan/Hunyuan-7B-Instruct` | hunyuan_v1_dense | text-generation | — | 2,326 | 7 | 14.0 GB | 2025-09-02 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-7B-Instruct) |
| 34 | `Tencent-Hunyuan/Hunyuan-7B-Instruct-0124` | hunyuan_v1_dense | text-generation | other | 2,091 | 1 | 14.0 GB | 2025-07-30 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-7B-Instruct-0124) |
| 35 | `Tencent-Hunyuan/Hunyuan3D-1` | — | image-to-3D | other | 2,043 | 4 | 15.0 GB | 2025-10-17 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan3D-1) |
| 36 | `Tencent-Hunyuan/Hy-MT2-1.8B` | hunyuan_v1_dense | translation | apache-2.0 | 1,816 | 10 | 3.8 GB | 2026-05-26 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hy-MT2-1.8B) |
| 37 | `Tencent-Hunyuan/HY-MT1.5-7B-GGUF` | — | translation | — | 1,807 | 12 | 17.5 GB | 2025-12-31 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HY-MT1.5-7B-GGUF) |
| 38 | `Tencent-Hunyuan/HunyuanVideo-Avatar` | — | image-to-video | — | 1,753 | 8 | 75.2 GB | 2025-06-25 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanVideo-Avatar) |
| 39 | `Tencent-Hunyuan/HY-MT1.5-7B-FP8` | hunyuan_v1_dense | translation | — | 1,718 | 4 | 7.5 GB | 2025-12-30 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HY-MT1.5-7B-FP8) |
| 40 | `Tencent-Hunyuan/Hunyuan-MT-Chimera-7B` | hunyuan_v1_dense | translation | — | 1,636 | 7 | 15.0 GB | 2025-09-03 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-MT-Chimera-7B) |
| 41 | `Tencent-Hunyuan/HunyuanVideo-PromptRewrite` | hunyuan | — | other | 1,584 | 0 | 725.6 GB | 2025-06-25 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanVideo-PromptRewrite) |
| 42 | `Tencent-Hunyuan/Hy-MT2-1.8B-GGUF` | — | text-generation | apache-2.0 | 1,561 | 1 | 4.2 GB | 2026-05-26 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hy-MT2-1.8B-GGUF) |
| 43 | `Tencent-Hunyuan/Hy-MT2-7B-FP8` | hunyuan_v1_dense | translation | apache-2.0 | 1,549 | 5 | 7.5 GB | 2026-05-26 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hy-MT2-7B-FP8) |
| 44 | `Tencent-Hunyuan/HunyuanVideo-I2V` | — | image-to-video | other | 1,420 | 14 | 28.1 GB | 2025-06-25 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanVideo-I2V) |
| 45 | `Tencent-Hunyuan/Hunyuan3D-2mv` | — | image-to-3D | other | 1,407 | 5 | 27.5 GB | 2025-10-17 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan3D-2mv) |
| 46 | `Tencent-Hunyuan/Hunyuan-A13B-Instruct-GPTQ-Int4` | hunyuan | text-generation | other | 1,364 | 2 | 207.0 GB | 2025-07-15 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-A13B-Instruct-GPTQ-Int4) |
| 47 | `Tencent-Hunyuan/Hunyuan3D-2mini` | — | image-to-3D | other | 1,174 | 8 | 23.5 GB | 2025-10-17 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan3D-2mini) |
| 48 | `Tencent-Hunyuan/Hy3-preview` | hy_v3 | text-generation | — | 1,106 | 13 | 556.6 GB | 2026-04-23 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hy3-preview) |
| 49 | `Tencent-Hunyuan/Hunyuan-7B-Pretrain-0124` | hunyuan | text-generation | other | 832 | 0 | 14.0 GB | 2025-07-28 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-7B-Pretrain-0124) |
| 50 | `Tencent-Hunyuan/Hy-MT2-30B-A3B` | hy_v3 | translation | apache-2.0 | 815 | 2 | 56.0 GB | 2026-05-26 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hy-MT2-30B-A3B) |
| 51 | `Tencent-Hunyuan/Hy-MT2-7B-GGUF` | — | text-generation | apache-2.0 | 768 | 2 | 17.5 GB | 2026-05-26 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hy-MT2-7B-GGUF) |
| 52 | `Tencent-Hunyuan/Hunyuan-4B-Instruct` | hunyuan_v1_dense | text-generation | — | 705 | 0 | 7.9 GB | 2025-08-07 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-4B-Instruct) |
| 53 | `Tencent-Hunyuan/HunyuanPortrait` | — | image-to-video | — | 656 | 0 | 6.8 GB | 2025-06-25 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanPortrait) |
| 54 | `Tencent-Hunyuan/HY-MT1.5-7B-GPTQ-Int4` | hunyuan_v1_dense | translation | — | 630 | 1 | 4.5 GB | 2025-12-30 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HY-MT1.5-7B-GPTQ-Int4) |
| 55 | `Tencent-Hunyuan/Hunyuan-7B-Pretrain` | hunyuan_v1_dense | text-generation | — | 570 | 0 | 14.0 GB | 2025-09-02 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-7B-Pretrain) |
| 56 | `Tencent-Hunyuan/Hy-MT2-1.8B-FP8` | hunyuan_v1_dense | translation | apache-2.0 | 481 | 3 | 1.9 GB | 2026-05-26 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hy-MT2-1.8B-FP8) |
| 57 | `Tencent-Hunyuan/HY-Motion-1.0` | — | — | other | 447 | 11 | 5.6 GB | 2026-06-17 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HY-Motion-1.0) |
| 58 | `Tencent-Hunyuan/Hunyuan-7B-Instruct-AWQ-Int4` | hunyuan_v1_dense | text-generation | — | 444 | 0 | 4.4 GB | 2025-09-01 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-7B-Instruct-AWQ-Int4) |
| 59 | `Tencent-Hunyuan/HunyuanImage-3.0-Instruct-Distil` | hunyuan_image_3_moe | image-to-image | other | 419 | 1 | 157.1 GB | 2026-02-04 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanImage-3.0-Instruct-Distil) |
| 60 | `Tencent-Hunyuan/Hunyuan-0.5B-Pretrain` | hunyuan_v1_dense | text-generation | — | 410 | 0 | 1.0 GB | 2025-08-07 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-0.5B-Pretrain) |
| 61 | `Tencent-Hunyuan/Hy-MT2-30B-A3B-FP8` | hy_v3 | translation | apache-2.0 | 294 | 2 | 28.5 GB | 2026-05-26 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hy-MT2-30B-A3B-FP8) |
| 62 | `Tencent-Hunyuan/Hunyuan3D-Part` | — | image-to-3D | — | 293 | 4 | 8.8 GB | 2025-10-17 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan3D-Part) |
| 63 | `Tencent-Hunyuan/Hunyuan-4B-Instruct-FP8` | hunyuan_v1_dense | text-generation | — | 264 | 1 | 4.3 GB | 2025-08-07 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-4B-Instruct-FP8) |
| 64 | `Tencent-Hunyuan/Hunyuan-7B-Instruct-FP8` | hunyuan_v1_dense | text-generation | — | 253 | 0 | 7.5 GB | 2025-09-01 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-7B-Instruct-FP8) |
| 65 | `Tencent-Hunyuan/Hy-MT2-1.8B-1.25Bit-GGUF` | — | text-generation | apache-2.0 | 233 | 0 | 444.5 MB | 2026-06-11 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hy-MT2-1.8B-1.25Bit-GGUF) |
| 66 | `Tencent-Hunyuan/Hy3-preview-Base` | hy_v3 | — | other | 209 | 2 | 556.6 GB | 2026-06-16 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hy3-preview-Base) |
| 67 | `Tencent-Hunyuan/Hunyuan-1.8B-Pretrain` | hunyuan_v1_dense | text-generation | — | 203 | 1 | 3.3 GB | 2025-08-07 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-1.8B-Pretrain) |
| 68 | `Tencent-Hunyuan/Hy-MT2-1.8B-2Bit-GGUF` | — | text-generation | apache-2.0 | 196 | 0 | 576.7 MB | 2026-05-26 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hy-MT2-1.8B-2Bit-GGUF) |
| 69 | `Tencent-Hunyuan/Hunyuan-0.5B-Instruct-AWQ-Int4` | hunyuan_v1_dense | text-generation | — | 178 | 0 | 451.2 MB | 2025-08-07 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-0.5B-Instruct-AWQ-Int4) |
| 70 | `Tencent-Hunyuan/Hunyuan3D-Omni` | — | image-to-3D | other | 169 | 4 | 24.0 GB | 2025-09-28 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan3D-Omni) |
| 71 | `Tencent-Hunyuan/Hunyuan-7B-Instruct-GPTQ-Int4` | hunyuan_v1_dense | — | — | 147 | 1 | 4.4 GB | 2025-09-01 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-7B-Instruct-GPTQ-Int4) |
| 72 | `Tencent-Hunyuan/Hunyuan-0.5B-Instruct-FP8` | hunyuan_v1_dense | text-generation | — | 143 | 0 | 641.5 MB | 2025-08-07 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-0.5B-Instruct-FP8) |
| 73 | `Tencent-Hunyuan/Hunyuan-A13B-Pretrain` | hunyuan | text-generation | — | 138 | 0 | 149.8 GB | 2025-07-28 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-A13B-Pretrain) |
| 74 | `Tencent-Hunyuan/Hunyuan-4B-Pretrain` | hunyuan_v1_dense | text-generation | — | 122 | 0 | 7.9 GB | 2025-08-07 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-4B-Pretrain) |
| 75 | `Tencent-Hunyuan/Hunyuan-0.5B-Instruct-GPTQ-Int4` | hunyuan_v1_dense | text-generation | — | 121 | 0 | 452.2 MB | 2025-08-07 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-0.5B-Instruct-GPTQ-Int4) |
| 76 | `Tencent-Hunyuan/Hunyuan-1.8B-Instruct-FP8` | hunyuan_v1_dense | text-generation | — | 121 | 0 | 1.9 GB | 2025-08-07 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-1.8B-Instruct-FP8) |
| 77 | `Tencent-Hunyuan/Hunyuan-4B-Instruct-AWQ-Int4` | hunyuan_v1_dense | text-generation | — | 111 | 1 | 2.6 GB | 2025-08-07 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-4B-Instruct-AWQ-Int4) |
| 78 | `Tencent-Hunyuan/Hunyuan-4B-Instruct-GPTQ-Int4` | hunyuan_v1_dense | text-generation | — | 109 | 0 | 2.6 GB | 2025-08-07 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-4B-Instruct-GPTQ-Int4) |
| 79 | `Tencent-Hunyuan/Hunyuan-1.8B-Instruct-GPTQ-Int4` | hunyuan_v1_dense | text-generation | — | 92 | 0 | 1.2 GB | 2025-08-07 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-1.8B-Instruct-GPTQ-Int4) |
| 80 | `Tencent-Hunyuan/Hunyuan-1.8B-Instruct-AWQ-Int4` | hunyuan_v1_dense | text-generation | — | 90 | 0 | 1.2 GB | 2025-08-07 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-1.8B-Instruct-AWQ-Int4) |
| 81 | `Tencent-Hunyuan/HY3D-Bench` | — | image-to-3D | other | 76 | 0 | 8.6 GB | 2026-02-06 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HY3D-Bench) |
| 82 | `Tencent-Hunyuan/HY-Video-PRFL` | — | text-to-video-synthesis | — | 76 | 0 | 28.4 MB | 2026-01-13 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/HY-Video-PRFL) |
| 83 | `Tencent-Hunyuan/Hy-Embodied-0.5-VLA-UMI` | — | — | apache-2.0 | 71 | 1 | 8.4 GB | 2026-06-15 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hy-Embodied-0.5-VLA-UMI) |
| 84 | `Tencent-Hunyuan/Hy-Embodied-0.5-VLA-RoboTwin` | — | — | apache-2.0 | 62 | 1 | 8.4 GB | 2026-06-15 | [↗](https://modelscope.cn/models/Tencent-Hunyuan/Hy-Embodied-0.5-VLA-RoboTwin) |

---

## 上海 AI 实验室 · 书生 (InternLM)

Namespace: `Shanghai_AI_Laboratory` · 组织主页: [https://modelscope.cn/brand/view/internlm](https://modelscope.cn/brand/view/internlm) · 模型数: **443**


> 书生 InternLM模型较多，完整 443 个模型索引已拆分至 [[ModelScope_Model_Index_InternLM|独立页面]]。
> 下方仅保留下载量 Top 20 精选：

| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |
|---|---------|------|------|------|------|------|------|------|------|
| 1 | `Shanghai_AI_Laboratory/internlm2_5-7b-chat` | internlm2 | text-generation | other | 81,894 | 34 | 14.4 GB | 2025-03-13 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm2_5-7b-chat) |
| 2 | `Shanghai_AI_Laboratory/internlm3-8b-instruct` | internlm3 | text-generation | apache-2.0 | 52,811 | 21 | 16.4 GB | 2025-02-26 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm3-8b-instruct) |
| 3 | `Shanghai_AI_Laboratory/internlm2-chat-20b` | internlm2 | text-generation | other | 49,690 | 24 | 37.0 GB | 2025-03-13 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm2-chat-20b) |
| 4 | `Shanghai_AI_Laboratory/internlm2-chat-20b-sft` | internlm2 | text-generation | other | 34,502 | 2 | 37.0 GB | 2025-02-26 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm2-chat-20b-sft) |
| 5 | `Shanghai_AI_Laboratory/internlm2-chat-7b` | internlm2 | text-generation | other | 34,039 | 25 | 14.4 GB | 2025-03-13 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm2-chat-7b) |
| 6 | `Shanghai_AI_Laboratory/internlm-xcomposer2d5-7b` | internlm2 | visual-question-answering | other | 20,428 | 9 | 20.7 GB | 2025-02-26 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-xcomposer2d5-7b) |
| 7 | `Shanghai_AI_Laboratory/internlm-chat-20b-4bit` | internlm | text-generation | apache-2.0 | 19,361 | 6 | 11.2 GB | 2025-02-26 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-chat-20b-4bit) |
| 8 | `Shanghai_AI_Laboratory/internlm-xcomposer2-vl-7b` | internlmxcomposer2 | visual-question-answering | other | 15,135 | 16 | 16.1 GB | 2025-02-26 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-xcomposer2-vl-7b) |
| 9 | `Shanghai_AI_Laboratory/internlm-20b` | internlm | text-generation | apache-2.0 | 14,794 | 74 | 37.4 GB | 2025-02-26 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-20b) |
| 10 | `Shanghai_AI_Laboratory/EndoCoT` | — | image-to-image | mit | 14,183 | 0 | 61.2 GB | 2026-04-14 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/EndoCoT) |
| 11 | `Shanghai_AI_Laboratory/internlm-xcomposer2d5-clip` | clip_vision_model | — | — | 10,747 | 1 | 1.1 GB | 2025-01-15 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-xcomposer2d5-clip) |
| 12 | `Shanghai_AI_Laboratory/internlm-chat-7b` | internlm | text-generation | — | 9,647 | 10 | 13.6 GB | 2025-02-26 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-chat-7b) |
| 13 | `Shanghai_AI_Laboratory/internlm-xcomposer-7b-4bit` | InternLMXComposer | text-generation | — | 9,502 | 6 | 6.8 GB | 2025-02-26 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-xcomposer-7b-4bit) |
| 14 | `Shanghai_AI_Laboratory/internlm-xcomposer2-7b` | internlmxcomposer2 | text-generation | other | 8,341 | 8 | 16.1 GB | 2025-02-26 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-xcomposer2-7b) |
| 15 | `Shanghai_AI_Laboratory/internlm2-chat-1_8b` | internlm2 | text-generation | other | 8,063 | 14 | 3.5 GB | 2025-03-13 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm2-chat-1_8b) |
| 16 | `Shanghai_AI_Laboratory/Intern-S1-mini` | interns1 | image-text-to-text | apache-2.0 | 7,301 | 12 | 15.9 GB | 2026-03-30 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/Intern-S1-mini) |
| 17 | `Shanghai_AI_Laboratory/internlm-chat-20b` | internlm | text-generation | apache-2.0 | 7,245 | 63 | 37.4 GB | 2025-02-26 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-chat-20b) |
| 18 | `Shanghai_AI_Laboratory/internlm2-1_8b-reward` | internlm2 | text-classification | other | 5,845 | 9 | 3.2 GB | 2025-03-13 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm2-1_8b-reward) |
| 19 | `Shanghai_AI_Laboratory/internlm2-7b` | internlm2 | text-generation | other | 4,857 | 31 | 14.4 GB | 2025-03-13 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm2-7b) |
| 20 | `Shanghai_AI_Laboratory/animatediff` | — | text-to-image-synthesis | apache-2.0 | 4,791 | 17 | 11.6 GB | 2023-12-18 | [↗](https://modelscope.cn/models/Shanghai_AI_Laboratory/animatediff) |

> 完整列表（含全部模型）见 [[ModelScope_Model_Index_InternLM]]。
## 商汤日日新 (SenseNova)

Namespace: `SenseNova` · 组织主页: [https://modelscope.cn/organization/SenseNova](https://modelscope.cn/organization/SenseNova) · 模型数: **30**

| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |
|---|---------|------|------|------|------|------|------|------|------|
| 1 | `SenseNova/SenseNova-U1-8B-MoT` | neo_chat | any-to-any | apache-2.0 | 20,740 | 30 | 32.8 GB | 2026-05-16 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-U1-8B-MoT) |
| 2 | `SenseNova/SenseNova-SI-InternVL3-8B` | internvl_chat | image-text-to-text | apache-2.0 | 4,100 | 6 | 14.8 GB | 2025-12-12 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-SI-InternVL3-8B) |
| 3 | `SenseNova/SenseNova-U1-8B-MoT-Infographic` | neo_chat | any-to-any | apache-2.0 | 668 | 5 | 32.7 GB | 2026-05-16 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-U1-8B-MoT-Infographic) |
| 4 | `SenseNova/SenseNova-U1-8B-MoT-SFT` | neo_chat | any-to-any | apache-2.0 | 427 | 7 | 32.8 GB | 2026-05-15 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-U1-8B-MoT-SFT) |
| 5 | `SenseNova/piccolo-base-zh` | bert | feature-extraction | — | 375 | 0 | 195.7 MB | 2025-11-12 | [↗](https://modelscope.cn/models/SenseNova/piccolo-base-zh) |
| 6 | `SenseNova/SenseNova-U1-8B-MoT-8step-preview` | neo_chat | any-to-any | apache-2.0 | 267 | 1 | 32.8 GB | 2026-05-15 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-U1-8B-MoT-8step-preview) |
| 7 | `SenseNova/SenseNova-SI-1.1-InternVL3-8B` | internvl_chat | image-text-to-text | apache-2.0 | 238 | 0 | 14.8 GB | 2026-05-13 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.1-InternVL3-8B) |
| 8 | `SenseNova/piccolo-large-zh-v2` | bert | — | — | 197 | 0 | 4.1 MB | 2025-11-12 | [↗](https://modelscope.cn/models/SenseNova/piccolo-large-zh-v2) |
| 9 | `SenseNova/SenseNova-U1-8B-MoT-LoRAs` | — | — | apache-2.0 | 196 | 0 | 3.1 GB | 2026-06-16 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-U1-8B-MoT-LoRAs) |
| 10 | `SenseNova/SenseNova-SI-1.1-Qwen3-VL-8B` | qwen3_vl | image-text-to-text | apache-2.0 | 153 | 0 | 16.3 GB | 2026-05-13 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.1-Qwen3-VL-8B) |
| 11 | `SenseNova/SenseNova-SI-1.1-InternVL3-2B` | internvl_chat | image-text-to-text | apache-2.0 | 145 | 1 | 3.9 GB | 2026-05-13 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.1-InternVL3-2B) |
| 12 | `SenseNova/SenseNova-MARS-32B` | qwen3_vl | image-text-to-text | mit | 127 | 2 | 62.1 GB | 2026-01-29 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-MARS-32B) |
| 13 | `SenseNova/SenseNova-SI-1.2-InternVL3-8B` | internvl_chat | image-text-to-text | apache-2.0 | 116 | 1 | 14.8 GB | 2026-05-13 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.2-InternVL3-8B) |
| 14 | `SenseNova/SenseNova-SI-InternVL3-2B` | internvl_chat | image-text-to-text | apache-2.0 | 115 | 0 | 3.9 GB | 2025-11-24 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-SI-InternVL3-2B) |
| 15 | `SenseNova/SenseNova-MARS-8B` | qwen3_vl | image-text-to-text | mit | 113 | 0 | 16.3 GB | 2026-01-29 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-MARS-8B) |
| 16 | `SenseNova/SenseNova-SI-1.1-BAGEL-7B-MoT` | bagel | image-text-to-text | apache-2.0 | 110 | 0 | 27.5 GB | 2026-05-13 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.1-BAGEL-7B-MoT) |
| 17 | `SenseNova/InteractiveOmni-8B` | interactiveomni | any-to-any | mit | 109 | 0 | 0.0 B | 2025-12-03 | [↗](https://modelscope.cn/models/SenseNova/InteractiveOmni-8B) |
| 18 | `SenseNova/SenseNova-SI-1.3-InternVL3-8B` | internvl_chat | image-text-to-text | apache-2.0 | 108 | 0 | 14.8 GB | 2026-05-13 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.3-InternVL3-8B) |
| 19 | `SenseNova/SenseNova-U1-A3B-MoT` | neo_chat | — | apache-2.0 | 99 | 0 | 72.2 GB | 2026-05-15 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-U1-A3B-MoT) |
| 20 | `SenseNova/InteractiveOmni-4B` | interactiveomni | any-to-any | mit | 98 | 0 | 0.0 B | 2025-12-03 | [↗](https://modelscope.cn/models/SenseNova/InteractiveOmni-4B) |
| 21 | `SenseNova/piccolo-large-zh` | bert | feature-extraction | — | 83 | 0 | 621.5 MB | 2025-11-12 | [↗](https://modelscope.cn/models/SenseNova/piccolo-large-zh) |
| 22 | `SenseNova/SenseNova-SI-1.1-Qwen2.5-VL-3B` | qwen2_5_vl | image-text-to-text | apache-2.0 | 80 | 0 | 7.6 GB | 2026-05-13 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.1-Qwen2.5-VL-3B) |
| 23 | `SenseNova/SenseNova-U1-A3B-MoT-SFT` | neo_chat | — | apache-2.0 | 79 | 1 | 72.3 GB | 2026-05-15 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-U1-A3B-MoT-SFT) |
| 24 | `SenseNova/SenseNova-SI-1.1-Qwen2.5-VL-7B` | qwen2_5_vl | — | apache-2.0 | 77 | 0 | 15.5 GB | 2026-05-13 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.1-Qwen2.5-VL-7B) |
| 25 | `SenseNova/SenseNova-SI-1.1-InternVL3-8B-800K` | internvl_chat | image-text-to-text | apache-2.0 | 75 | 0 | 0.0 B | 2025-12-23 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.1-InternVL3-8B-800K) |
| 26 | `SenseNova/ConsistCompose-BAGEL-7B-MoT` | — | — | apache-2.0 | 54 | 0 | 27.5 GB | 2026-04-28 | [↗](https://modelscope.cn/models/SenseNova/ConsistCompose-BAGEL-7B-MoT) |
| 27 | `SenseNova/SenseNova-SI-1.3-Qwen3-VL-8B` | qwen3_vl | image-text-to-text | apache-2.0 | 49 | 0 | 16.3 GB | 2026-04-16 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.3-Qwen3-VL-8B) |
| 28 | `SenseNova/SenseNova-SI-1.4-InternVL3-8B` | internvl_chat | image-text-to-text | apache-2.0 | 29 | 0 | 14.8 GB | 2026-05-13 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.4-InternVL3-8B) |
| 29 | `SenseNova/SenseNova-SI-1.5-InternVL3-8B` | internvl_chat | image-text-to-text | apache-2.0 | 28 | 0 | 14.8 GB | 2026-05-13 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.5-InternVL3-8B) |
| 30 | `SenseNova/SenseNova-U1-8B-MoT-Interleaved` | neo_chat | any-to-any | apache-2.0 | 23 | 0 | 32.7 GB | 2026-06-12 | [↗](https://modelscope.cn/models/SenseNova/SenseNova-U1-8B-MoT-Interleaved) |

---

## 昆仑万维 · 天工 (Skywork)

Namespace: `Skywork` · 组织主页: [https://modelscope.cn/organization/Skywork](https://modelscope.cn/organization/Skywork) · 模型数: **74**

| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |
|---|---------|------|------|------|------|------|------|------|------|
| 1 | `Skywork/SkyReels-V2-T2V-14B-720P` | t2v | text-to-video-synthesis | other | 83,987 | 10 | 64.3 GB | 2025-04-25 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-T2V-14B-720P) |
| 2 | `Skywork/SkyReels-V2-DF-14B-720P` | t2v | text-to-video-synthesis | other | 83,797 | 4 | 64.3 GB | 2025-04-25 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-DF-14B-720P) |
| 3 | `Skywork/SkyReels-V2-I2V-14B-720P` | i2v | image-to-video | other | 83,675 | 5 | 76.6 GB | 2025-04-25 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-I2V-14B-720P) |
| 4 | `Skywork/Skywork-Reward-V2-Qwen3-0.6B` | qwen3 | text-classification | apache-2.0 | 29,438 | 1 | 1.1 GB | 2025-07-07 | [↗](https://modelscope.cn/models/Skywork/Skywork-Reward-V2-Qwen3-0.6B) |
| 5 | `Skywork/Skywork-R1V-38B` | skywork_chat | image-text-to-text | mit | 28,321 | 14 | 71.5 GB | 2025-08-13 | [↗](https://modelscope.cn/models/Skywork/Skywork-R1V-38B) |
| 6 | `Skywork/SkyReels-V2-DF-1.3B-540P` | t2v | text-to-video-synthesis | other | 6,415 | 6 | 16.4 GB | 2025-04-25 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-DF-1.3B-540P) |
| 7 | `Skywork/Skywork-Reward-V2-Llama-3.1-8B` | llama | text-classification | llama3.1 | 3,421 | 1 | 14.0 GB | 2025-07-07 | [↗](https://modelscope.cn/models/Skywork/Skywork-Reward-V2-Llama-3.1-8B) |
| 8 | `Skywork/Skywork-Reward-V2-Qwen3-8B` | qwen3 | text-classification | apache-2.0 | 2,916 | 5 | 14.1 GB | 2025-07-07 | [↗](https://modelscope.cn/models/Skywork/Skywork-Reward-V2-Qwen3-8B) |
| 9 | `Skywork/Skywork-13B-base` | skywork | — | — | 2,162 | 63 | 25.8 GB | 2023-11-05 | [↗](https://modelscope.cn/models/Skywork/Skywork-13B-base) |
| 10 | `Skywork/SkyReels-V3-R2V-14B` | — | image-to-video | other | 2,123 | 10 | 48.3 GB | 2026-01-28 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V3-R2V-14B) |
| 11 | `Skywork/Skywork-VL-Reward-7B` | qwen2_5_vl | image-text-to-text | mit | 1,391 | 5 | 15.5 GB | 2025-06-24 | [↗](https://modelscope.cn/models/Skywork/Skywork-VL-Reward-7B) |
| 12 | `Skywork/Skywork-R1V2-38B` | internvl_chat | image-text-to-text | mit | 1,361 | 13 | 71.5 GB | 2025-06-10 | [↗](https://modelscope.cn/models/Skywork/Skywork-R1V2-38B) |
| 13 | `Skywork/SkyReels-V2-T2V-14B-540P` | t2v | text-to-video-synthesis | other | 1,278 | 3 | 64.3 GB | 2025-04-25 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-T2V-14B-540P) |
| 14 | `Skywork/SkyReels-V2-I2V-1.3B-540P` | i2v | image-to-video | other | 1,226 | 5 | 21.4 GB | 2025-04-25 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-I2V-1.3B-540P) |
| 15 | `Skywork/SkyReels-A1` | — | image-to-video | apache-2.0 | 1,169 | 3 | 25.1 GB | 2025-03-04 | [↗](https://modelscope.cn/models/Skywork/SkyReels-A1) |
| 16 | `Skywork/SkyReels-V1-Hunyuan-I2V` | — | image-to-video | — | 1,060 | 4 | 23.9 GB | 2025-02-24 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V1-Hunyuan-I2V) |
| 17 | `Skywork/SkyReels-V2-DF-14B-540P` | t2v | text-to-video-synthesis | other | 1,022 | 0 | 64.3 GB | 2025-04-25 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-DF-14B-540P) |
| 18 | `Skywork/SkyReels-V1-Hunyuan-T2V` | — | text-to-video-synthesis | apache-2.0 | 1,021 | 0 | 23.9 GB | 2025-02-24 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V1-Hunyuan-T2V) |
| 19 | `Skywork/Skywork-13B-Base-8bits` | skywork | — | — | 1,001 | 13 | 13.5 GB | 2023-11-05 | [↗](https://modelscope.cn/models/Skywork/Skywork-13B-Base-8bits) |
| 20 | `Skywork/Skywork-OR1-32B-Preview` | qwen2 | text-generation | — | 991 | 5 | 61.0 GB | 2025-05-29 | [↗](https://modelscope.cn/models/Skywork/Skywork-OR1-32B-Preview) |
| 21 | `Skywork/Skywork-Reward-V2-Qwen3-4B` | qwen3 | text-classification | apache-2.0 | 953 | 1 | 7.5 GB | 2025-07-07 | [↗](https://modelscope.cn/models/Skywork/Skywork-Reward-V2-Qwen3-4B) |
| 22 | `Skywork/Skywork-Reward-Models` | llama | text-classification | — | 896 | 1 | 14.0 GB | 2024-09-05 | [↗](https://modelscope.cn/models/Skywork/Skywork-Reward-Models) |
| 23 | `Skywork/SkyReels-V2-I2V-14B-540P` | i2v | image-to-video | other | 894 | 1 | 76.6 GB | 2025-04-25 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-I2V-14B-540P) |
| 24 | `Skywork/Skywork-Reward-V2-Qwen3-1.7B` | qwen3 | text-classification | apache-2.0 | 873 | 0 | 3.2 GB | 2025-07-07 | [↗](https://modelscope.cn/models/Skywork/Skywork-Reward-V2-Qwen3-1.7B) |
| 25 | `Skywork/Unipic3-Consistency-Model` | — | any-to-any | mit | 860 | 0 | 76.1 GB | 2026-02-07 | [↗](https://modelscope.cn/models/Skywork/Unipic3-Consistency-Model) |
| 26 | `Skywork/Skywork-13B-Math` | skywork | — | — | 804 | 16 | 25.8 GB | 2023-10-31 | [↗](https://modelscope.cn/models/Skywork/Skywork-13B-Math) |
| 27 | `Skywork/Skywork-OR1-Math-7B` | qwen2 | text-generation | — | 765 | 2 | 14.2 GB | 2025-05-29 | [↗](https://modelscope.cn/models/Skywork/Skywork-OR1-Math-7B) |
| 28 | `Skywork/Matrix-Game-2.0` | — | image-to-video | mit | 711 | 1 | 26.0 GB | 2026-04-13 | [↗](https://modelscope.cn/models/Skywork/Matrix-Game-2.0) |
| 29 | `Skywork/Skywork-OR1-7B-Preview` | qwen2 | text-generation | — | 636 | 1 | 14.2 GB | 2025-05-29 | [↗](https://modelscope.cn/models/Skywork/Skywork-OR1-7B-Preview) |
| 30 | `Skywork/SkyReels-A2` | — | image-to-video | apache-2.0 | 607 | 0 | 53.4 GB | 2025-04-08 | [↗](https://modelscope.cn/models/Skywork/SkyReels-A2) |
| 31 | `Skywork/Skywork-R1V-38B-AWQ` | internvl_chat | image-text-to-text | mit | 604 | 2 | 28.6 GB | 2025-07-23 | [↗](https://modelscope.cn/models/Skywork/Skywork-R1V-38B-AWQ) |
| 32 | `Skywork/Skywork-R1V3-38B-AWQ` | — | image-text-to-text | mit | 599 | 0 | 28.6 GB | 2025-07-17 | [↗](https://modelscope.cn/models/Skywork/Skywork-R1V3-38B-AWQ) |
| 33 | `Skywork/SkyCaptioner-V1` | qwen2_5_vl | — | apache-2.0 | 582 | 1 | 29.6 GB | 2025-04-25 | [↗](https://modelscope.cn/models/Skywork/SkyCaptioner-V1) |
| 34 | `Skywork/Skywork-SWE-32B` | qwen2 | text-generation | apache-2.0 | 567 | 5 | 61.0 GB | 2025-06-27 | [↗](https://modelscope.cn/models/Skywork/Skywork-SWE-32B) |
| 35 | `Skywork/Skywork-Reward-V2-Llama-3.2-3B` | llama | text-classification | llama3.2 | 538 | 1 | 6.0 GB | 2025-07-07 | [↗](https://modelscope.cn/models/Skywork/Skywork-Reward-V2-Llama-3.2-3B) |
| 36 | `Skywork/Skywork-MoE-Base-FP8` | skywork | text-generation | — | 536 | 1 | 136.9 GB | 2024-06-03 | [↗](https://modelscope.cn/models/Skywork/Skywork-MoE-Base-FP8) |
| 37 | `Skywork/Skywork-R1V3-38B` | skywork_chat | image-text-to-text | mit | 528 | 4 | 71.5 GB | 2025-07-14 | [↗](https://modelscope.cn/models/Skywork/Skywork-R1V3-38B) |
| 38 | `Skywork/Skywork-13B-Math-8bits` | skywork | — | — | 491 | 8 | 13.5 GB | 2023-10-31 | [↗](https://modelscope.cn/models/Skywork/Skywork-13B-Math-8bits) |
| 39 | `Skywork/Skywork-R1V2-38B-AWQ` | internvl_chat | image-text-to-text | mit | 486 | 0 | 28.6 GB | 2025-04-28 | [↗](https://modelscope.cn/models/Skywork/Skywork-R1V2-38B-AWQ) |
| 40 | `Skywork/Skywork-Reward-V2-Llama-3.1-8B-40M` | llama | text-classification | llama3.1 | 483 | 2 | 14.0 GB | 2025-07-07 | [↗](https://modelscope.cn/models/Skywork/Skywork-Reward-V2-Llama-3.1-8B-40M) |
| 41 | `Skywork/Skywork-OR1-32B` | qwen2 | — | — | 466 | 0 | 61.0 GB | 2025-05-29 | [↗](https://modelscope.cn/models/Skywork/Skywork-OR1-32B) |
| 42 | `Skywork/Skywork-OR1-7B` | qwen2 | — | — | 465 | 1 | 14.2 GB | 2025-05-29 | [↗](https://modelscope.cn/models/Skywork/Skywork-OR1-7B) |
| 43 | `Skywork/Skywork-Reward-V2-Llama-3.2-1B` | llama | text-classification | llama3.2 | 461 | 1 | 2.3 GB | 2025-07-07 | [↗](https://modelscope.cn/models/Skywork/Skywork-Reward-V2-Llama-3.2-1B) |
| 44 | `Skywork/Matrix-Game` | — | image-to-video | mit | 440 | 0 | 81.1 GB | 2025-06-26 | [↗](https://modelscope.cn/models/Skywork/Matrix-Game) |
| 45 | `Skywork/Skywork-UniPic-1.5B` | — | any-to-any | mit | 432 | 3 | 18.3 GB | 2025-09-08 | [↗](https://modelscope.cn/models/Skywork/Skywork-UniPic-1.5B) |
| 46 | `Skywork/SkyReels-V3-A2V-19B` | i2v | image-to-video | other | 427 | 4 | 52.1 GB | 2026-01-28 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V3-A2V-19B) |
| 47 | `Skywork/SkyReels-V2-DF-1.3B-540P-Diffusers` | — | text-to-video-synthesis | other | 419 | 0 | 27.0 GB | 2025-08-11 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-DF-1.3B-540P-Diffusers) |
| 48 | `Skywork/SkyReels-V2-I2V-1.3B-540P-Diffusers` | — | image-to-video | other | 417 | 0 | 29.8 GB | 2025-08-11 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-I2V-1.3B-540P-Diffusers) |
| 49 | `Skywork/Matrix-Game-3.0` | — | — | apache-2.0 | 405 | 3 | 52.7 GB | 2026-04-28 | [↗](https://modelscope.cn/models/Skywork/Matrix-Game-3.0) |
| 50 | `Skywork/UniPic2-Metaquery-Flash` | — | any-to-any | mit | 346 | 0 | 12.9 GB | 2025-09-08 | [↗](https://modelscope.cn/models/Skywork/UniPic2-Metaquery-Flash) |
| 51 | `Skywork/SkyReels-V2-T2V-14B-720P-Diffusers` | — | text-to-video-synthesis | other | 341 | 0 | 74.9 GB | 2025-08-11 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-T2V-14B-720P-Diffusers) |
| 52 | `Skywork/SkyReels-V2-DF-14B-720P-Diffusers` | — | text-to-video-synthesis | other | 336 | 0 | 74.9 GB | 2025-08-11 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-DF-14B-720P-Diffusers) |
| 53 | `Skywork/SkyReels-V2-I2V-14B-540P-Diffusers` | — | image-to-video | other | 335 | 0 | 85.1 GB | 2025-08-11 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-I2V-14B-540P-Diffusers) |
| 54 | `Skywork/SkyReels-V2-I2V-14B-720P-Diffusers` | — | image-to-video | other | 330 | 1 | 85.1 GB | 2025-08-11 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-I2V-14B-720P-Diffusers) |
| 55 | `Skywork/SkyReels-V2-DF-14B-540P-Diffusers` | — | text-to-video-synthesis | other | 324 | 0 | 74.9 GB | 2025-08-11 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-DF-14B-540P-Diffusers) |
| 56 | `Skywork/SkyReels-V2-T2V-14B-540P-Diffusers` | — | text-to-video-synthesis | other | 316 | 0 | 74.9 GB | 2025-08-11 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V2-T2V-14B-540P-Diffusers) |
| 57 | `Skywork/MindLink-72B-0801` | qwen2 | text-generation | apache-2.0 | 273 | 3 | 135.4 GB | 2025-08-02 | [↗](https://modelscope.cn/models/Skywork/MindLink-72B-0801) |
| 58 | `Skywork/Skywork-MoE-base` | skywork_moe | text-generation | — | 272 | 6 | 272.6 GB | 2024-07-31 | [↗](https://modelscope.cn/models/Skywork/Skywork-MoE-base) |
| 59 | `Skywork/Skywork-R1V3-38B-GGUF` | — | — | mit | 271 | 0 | 77.5 GB | 2025-07-23 | [↗](https://modelscope.cn/models/Skywork/Skywork-R1V3-38B-GGUF) |
| 60 | `Skywork/UniPic2-SD3.5M-Kontext-2B` | — | any-to-any | mit | 266 | 1 | 17.0 GB | 2025-09-08 | [↗](https://modelscope.cn/models/Skywork/UniPic2-SD3.5M-Kontext-2B) |
| 61 | `Skywork/SkyReels-V3-V2V-14B` | — | — | other | 248 | 2 | 64.3 GB | 2026-01-28 | [↗](https://modelscope.cn/models/Skywork/SkyReels-V3-V2V-14B) |
| 62 | `Skywork/MindLink-32B-0801` | qwen3 | text-generation | apache-2.0 | 243 | 2 | 61.0 GB | 2025-08-05 | [↗](https://modelscope.cn/models/Skywork/MindLink-32B-0801) |
| 63 | `Skywork/Skywork-27B-Reward-Models` | gemma2 | text-classification | — | 211 | 2 | 50.7 GB | 2024-09-05 | [↗](https://modelscope.cn/models/Skywork/Skywork-27B-Reward-Models) |
| 64 | `Skywork/UniPic2-SD3.5M-Kontext-GRPO-2B` | — | any-to-any | mit | 211 | 1 | 25.6 GB | 2025-09-08 | [↗](https://modelscope.cn/models/Skywork/UniPic2-SD3.5M-Kontext-GRPO-2B) |
| 65 | `Skywork/UniPic2-Metaquery-GRPO-9B` | — | any-to-any | mit | 209 | 0 | 6.4 GB | 2025-09-08 | [↗](https://modelscope.cn/models/Skywork/UniPic2-Metaquery-GRPO-9B) |
| 66 | `Skywork/UniPic2-Metaquery-GRPO-Flash` | — | any-to-any | mit | 201 | 1 | 12.9 GB | 2025-09-08 | [↗](https://modelscope.cn/models/Skywork/UniPic2-Metaquery-GRPO-Flash) |
| 67 | `Skywork/Matrix-3D` | — | — | mit | 201 | 1 | 325.8 MB | 2025-06-25 | [↗](https://modelscope.cn/models/Skywork/Matrix-3D) |
| 68 | `Skywork/UniPic2-Metaquery-9B` | — | any-to-any | mit | 194 | 2 | 6.4 GB | 2025-09-08 | [↗](https://modelscope.cn/models/Skywork/UniPic2-Metaquery-9B) |
| 69 | `Skywork/Unipic3` | — | any-to-any | mit | 183 | 0 | 53.8 GB | 2026-02-07 | [↗](https://modelscope.cn/models/Skywork/Unipic3) |
| 70 | `Skywork/SkyworkVL-2B` | skywork_chat | image-text-to-text | apache-2.0 | 140 | 0 | 4.1 GB | 2025-03-18 | [↗](https://modelscope.cn/models/Skywork/SkyworkVL-2B) |
| 71 | `Skywork/R1V4` | — | image-text-to-text | mit | 112 | 0 | 0.0 B | 2025-12-03 | [↗](https://modelscope.cn/models/Skywork/R1V4) |
| 72 | `Skywork/Unipic3-DMD` | — | any-to-any | mit | 100 | 0 | 91.8 GB | 2026-02-07 | [↗](https://modelscope.cn/models/Skywork/Unipic3-DMD) |
| 73 | `Skywork/Skywork-13B-Base-3.1TB` | skywork | text-generation | other | 85 | 1 | 25.8 GB | 2026-01-12 | [↗](https://modelscope.cn/models/Skywork/Skywork-13B-Base-3.1TB) |
| 74 | `Skywork/SkyworkVL-38B` | skywork_chat | image-text-to-text | apache-2.0 | 79 | 0 | 71.5 GB | 2025-03-18 | [↗](https://modelscope.cn/models/Skywork/SkyworkVL-38B) |

---

## 月之暗面 (Moonshot AI)

Namespace: `moonshotai` · 组织主页: [https://modelscope.cn/organization/moonshotai](https://modelscope.cn/organization/moonshotai) · 模型数: **18**

| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |
|---|---------|------|------|------|------|------|------|------|------|
| 1 | `moonshotai/Kimi-K2-Thinking` | kimi_k2 | text-generation | other | 1,808,210 | 90 | 553.4 GB | 2026-01-30 | [↗](https://modelscope.cn/models/moonshotai/Kimi-K2-Thinking) |
| 2 | `moonshotai/Kimi-VL-A3B-Thinking` | kimi_vl | image-text-to-text | mit | 1,061,843 | 54 | 30.6 GB | 2026-01-30 | [↗](https://modelscope.cn/models/moonshotai/Kimi-VL-A3B-Thinking) |
| 3 | `moonshotai/Kimi-K2.6` | kimi_k25 | image-text-to-text | other | 204,969 | 94 | 554.3 GB | 2026-05-21 | [↗](https://modelscope.cn/models/moonshotai/Kimi-K2.6) |
| 4 | `moonshotai/Kimi-K2.5` | kimi_k25 | image-text-to-text | other | 146,628 | 279 | 554.3 GB | 2026-04-30 | [↗](https://modelscope.cn/models/moonshotai/Kimi-K2.5) |
| 5 | `moonshotai/Kimi-K2-Instruct` | kimi_k2 | text-generation | other | 102,560 | 179 | 958.5 GB | 2026-04-23 | [↗](https://modelscope.cn/models/moonshotai/Kimi-K2-Instruct) |
| 6 | `moonshotai/Kimi-VL-A3B-Instruct` | kimi_vl | image-text-to-text | mit | 92,800 | 16 | 30.6 GB | 2026-01-30 | [↗](https://modelscope.cn/models/moonshotai/Kimi-VL-A3B-Instruct) |
| 7 | `moonshotai/Kimi-Audio-7B-Instruct` | — | text-to-speech | mit | 24,162 | 34 | 39.7 GB | 2025-05-29 | [↗](https://modelscope.cn/models/moonshotai/Kimi-Audio-7B-Instruct) |
| 8 | `moonshotai/Kimi-Dev-72B` | qwen2 | — | mit | 12,555 | 10 | 135.4 GB | 2025-06-17 | [↗](https://modelscope.cn/models/moonshotai/Kimi-Dev-72B) |
| 9 | `moonshotai/Kimi-K2-Instruct-0905` | kimi_k2 | text-generation | other | 12,303 | 81 | 958.5 GB | 2026-01-30 | [↗](https://modelscope.cn/models/moonshotai/Kimi-K2-Instruct-0905) |
| 10 | `moonshotai/Kimi-VL-A3B-Thinking-2506` | kimi_vl | image-text-to-text | mit | 7,410 | 13 | 30.6 GB | 2026-01-30 | [↗](https://modelscope.cn/models/moonshotai/Kimi-VL-A3B-Thinking-2506) |
| 11 | `moonshotai/Moonlight-16B-A3B-Instruct` | deepseek_v3 | text-generation | mit | 7,259 | 12 | 29.7 GB | 2026-01-30 | [↗](https://modelscope.cn/models/moonshotai/Moonlight-16B-A3B-Instruct) |
| 12 | `moonshotai/Kimi-K2-Base` | kimi_k2 | text-generation | other | 6,737 | 3 | 958.5 GB | 2026-01-30 | [↗](https://modelscope.cn/models/moonshotai/Kimi-K2-Base) |
| 13 | `moonshotai/Kimi-Linear-48B-A3B-Instruct` | kimi_linear | text-generation | mit | 6,200 | 20 | 91.5 GB | 2026-01-08 | [↗](https://modelscope.cn/models/moonshotai/Kimi-Linear-48B-A3B-Instruct) |
| 14 | `moonshotai/Kimi-Audio-7B` | — | text-to-speech | mit | 4,803 | 7 | 39.7 GB | 2025-05-29 | [↗](https://modelscope.cn/models/moonshotai/Kimi-Audio-7B) |
| 15 | `moonshotai/Kimi-K2.7-Code` | kimi_k25 | image-text-to-text | other | 4,499 | 17 | 554.3 GB | 2026-06-15 | [↗](https://modelscope.cn/models/moonshotai/Kimi-K2.7-Code) |
| 16 | `moonshotai/Moonlight-16B-A3B` | deepseek_v3 | text-generation | mit | 2,382 | 0 | 29.7 GB | 2026-01-30 | [↗](https://modelscope.cn/models/moonshotai/Moonlight-16B-A3B) |
| 17 | `moonshotai/MoonViT-SO-400M` | moonvit | — | mit | 572 | 2 | 795.7 MB | 2025-04-17 | [↗](https://modelscope.cn/models/moonshotai/MoonViT-SO-400M) |
| 18 | `moonshotai/Kimi-Linear-48B-A3B-Base` | kimi_linear | text-generation | mit | 236 | 0 | 91.5 GB | 2026-01-30 | [↗](https://modelscope.cn/models/moonshotai/Kimi-Linear-48B-A3B-Base) |

---

## MiniMax (MiniMax)

Namespace: `MiniMax` · 组织主页: [https://modelscope.cn/organization/MiniMax](https://modelscope.cn/organization/MiniMax) · 模型数: **18**

| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |
|---|---------|------|------|------|------|------|------|------|------|
| 1 | `MiniMax/MiniMax-M1-80k` | minimax_m1 | text-generation | apache-2.0 | 476,440 | 61 | 849.6 GB | 2025-07-07 | [↗](https://modelscope.cn/models/MiniMax/MiniMax-M1-80k) |
| 2 | `MiniMax/MiniMax-M2.5` | minimax_m2 | text-generation | other | 344,014 | 218 | 214.4 GB | 2026-03-11 | [↗](https://modelscope.cn/models/MiniMax/MiniMax-M2.5) |
| 3 | `MiniMax/MiniMax-M2.7` | minimax_m2 | text-generation | other | 270,208 | 134 | 214.4 GB | 2026-06-18 | [↗](https://modelscope.cn/models/MiniMax/MiniMax-M2.7) |
| 4 | `MiniMax/MiniMax-M2.1` | minimax_m2 | text-generation | other | 52,115 | 84 | 214.4 GB | 2026-02-13 | [↗](https://modelscope.cn/models/MiniMax/MiniMax-M2.1) |
| 5 | `MiniMax/MiniMax-VL-01` | minimax_vl_01 | image-text-to-text | — | 33,604 | 6 | 852.5 GB | 2025-10-27 | [↗](https://modelscope.cn/models/MiniMax/MiniMax-VL-01) |
| 6 | `MiniMax/MiniMax-Text-01` | minimax_text_01 | text-generation | — | 30,218 | 12 | 851.9 GB | 2025-10-27 | [↗](https://modelscope.cn/models/MiniMax/MiniMax-Text-01) |
| 7 | `MiniMax/MiniMax-M3-MXFP8` | minimax_m3_vl | image-text-to-text | other | 25,227 | 2 | 413.3 GB | 2026-06-15 | [↗](https://modelscope.cn/models/MiniMax/MiniMax-M3-MXFP8) |
| 8 | `MiniMax/MiniMax-M1-40k` | minimax_m1 | text-generation | apache-2.0 | 23,243 | 3 | 849.6 GB | 2025-07-07 | [↗](https://modelscope.cn/models/MiniMax/MiniMax-M1-40k) |
| 9 | `MiniMax/MiniMax-M2` | minimax_m2 | text-generation | other | 14,881 | 144 | 214.4 GB | 2025-12-23 | [↗](https://modelscope.cn/models/MiniMax/MiniMax-M2) |
| 10 | `MiniMax/MiniMax-M1-80k-hf` | minimax | text-generation | apache-2.0 | 2,966 | 0 | 849.6 GB | 2025-10-27 | [↗](https://modelscope.cn/models/MiniMax/MiniMax-M1-80k-hf) |
| 11 | `MiniMax/MiniMax-M1-40k-hf` | minimax | text-generation | apache-2.0 | 2,782 | 0 | 849.6 GB | 2025-10-27 | [↗](https://modelscope.cn/models/MiniMax/MiniMax-M1-40k-hf) |
| 12 | `MiniMax/MiniMax-M3` | minimax_m3_vl | image-text-to-text | other | 1,476 | 15 | 795.5 GB | 2026-06-16 | [↗](https://modelscope.cn/models/MiniMax/MiniMax-M3) |
| 13 | `MiniMax/SynLogic-32B` | qwen2 | text-generation | mit | 522 | 1 | 61.0 GB | 2025-06-10 | [↗](https://modelscope.cn/models/MiniMax/SynLogic-32B) |
| 14 | `MiniMax/SynLogic-7B` | qwen2 | text-generation | mit | 503 | 0 | 14.2 GB | 2025-06-10 | [↗](https://modelscope.cn/models/MiniMax/SynLogic-7B) |
| 15 | `MiniMax/SynLogic-Mix-3-32B` | qwen2 | text-generation | mit | 438 | 0 | 61.0 GB | 2025-06-10 | [↗](https://modelscope.cn/models/MiniMax/SynLogic-Mix-3-32B) |
| 16 | `MiniMax/VTP-Small-f16d64` | vtp | — | other | 126 | 0 | 640.0 MB | 2025-12-19 | [↗](https://modelscope.cn/models/MiniMax/VTP-Small-f16d64) |
| 17 | `MiniMax/VTP-Large-f16d64` | vtp | — | other | 122 | 0 | 0.0 B | 2025-12-16 | [↗](https://modelscope.cn/models/MiniMax/VTP-Large-f16d64) |
| 18 | `MiniMax/VTP-Base-f16d64` | vtp | — | other | 116 | 0 | 0.0 B | 2025-12-16 | [↗](https://modelscope.cn/models/MiniMax/VTP-Base-f16d64) |

---

## 科大讯飞 (iFLYTEK)

Namespace: `iflytek` · 组织主页: [https://modelscope.cn/organization/iflytek](https://modelscope.cn/organization/iflytek) · 模型数: **4**

| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |
|---|---------|------|------|------|------|------|------|------|------|
| 1 | `iflytek/Spark-Chemistry-X1-13B` | spark | text-generation | Apache License 2.0 | 30,408 | 8 | 49.4 GB | 2025-10-20 | [↗](https://modelscope.cn/models/iflytek/Spark-Chemistry-X1-13B) |
| 2 | `iflytek/Spark-Scilit-X1-13B` | spark | text-generation | Apache License 2.0 | 24,469 | 8 | 49.4 GB | 2025-10-20 | [↗](https://modelscope.cn/models/iflytek/Spark-Scilit-X1-13B) |
| 3 | `iflytek/AudioFly` | — | — | Apache License 2.0 | 20,171 | 16 | 7.7 GB | 2025-09-19 | [↗](https://modelscope.cn/models/iflytek/AudioFly) |
| 4 | `iflytek/Spark-Formalizer-X1-7B` | spark | text-generation | Apache License 2.0 | 82 | 0 | 28.0 GB | 2025-12-08 | [↗](https://modelscope.cn/models/iflytek/Spark-Formalizer-X1-7B) |

---

## 字节跳动 Seed (ByteDance)

Namespace: `bytedance-community` · 组织主页: [https://modelscope.cn/organization/ByteDance-Seed](https://modelscope.cn/organization/ByteDance-Seed) · 模型数: **141**

| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |
|---|---------|------|------|------|------|------|------|------|------|
| 1 | `bytedance-community/BAGEL-7B-MoT` | bagel | any-to-any | apache-2.0 | 948 | 0 | 27.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/BAGEL-7B-MoT) |
| 2 | `bytedance-community/AffineQuant` | — | — | apache-2.0 | 147 | 0 | 1.9 TB | 2026-06-06 | [↗](https://modelscope.cn/models/bytedance-community/AffineQuant) |
| 3 | `bytedance-community/Bernini-Diffusers` | bernini | — | apache-2.0 | 63 | 0 | 179.2 GB | 2026-06-11 | [↗](https://modelscope.cn/models/bytedance-community/Bernini-Diffusers) |
| 4 | `bytedance-community/Bernini-R-Diffusers` | bernini_renderer | — | apache-2.0 | 58 | 1 | 117.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Bernini-R-Diffusers) |
| 5 | `bytedance-community/Bernini-R-1.3B-Diffusers` | bernini_renderer | — | apache-2.0 | 55 | 0 | 26.9 GB | 2026-06-10 | [↗](https://modelscope.cn/models/bytedance-community/Bernini-R-1.3B-Diffusers) |
| 6 | `bytedance-community/UI-TARS-2B-SFT` | qwen2_vl | image-text-to-text | apache-2.0 | 43 | 0 | 9.1 GB | 2026-06-16 | [↗](https://modelscope.cn/models/bytedance-community/UI-TARS-2B-SFT) |
| 7 | `bytedance-community/LatentSync-1.6` | — | — | openrail++ | 42 | 1 | 9.0 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/LatentSync-1.6) |
| 8 | `bytedance-community/UI-TARS-1.5-7B` | qwen2_5_vl | image-text-to-text | apache-2.0 | 41 | 0 | 30.9 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/UI-TARS-1.5-7B) |
| 9 | `bytedance-community/Ouro-2.6B` | ouro | text-generation | apache-2.0 | 40 | 0 | 5.0 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Ouro-2.6B) |
| 10 | `bytedance-community/Ouro-2.6B-Thinking` | ouro | text-generation | apache-2.0 | 40 | 0 | 5.0 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Ouro-2.6B-Thinking) |
| 11 | `bytedance-community/ListConRanker` | bert | text-ranking | — | 39 | 0 | 1.5 GB | 2026-06-17 | [↗](https://modelscope.cn/models/bytedance-community/ListConRanker) |
| 12 | `bytedance-community/Hyper-SD` | — | text-to-image-synthesis | — | 38 | 0 | 25.8 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Hyper-SD) |
| 13 | `bytedance-community/Ouro-1.4B-Thinking` | ouro | text-generation | apache-2.0 | 38 | 0 | 2.7 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Ouro-1.4B-Thinking) |
| 14 | `bytedance-community/Ouro-1.4B` | ouro | text-generation | apache-2.0 | 38 | 0 | 2.7 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Ouro-1.4B) |
| 15 | `bytedance-community/Timer-S1` | Timer-S1 | — | apache-2.0 | 31 | 0 | 15.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Timer-S1) |
| 16 | `bytedance-community/Sa2VA-Qwen2_5-VL-7B` | sa2va_chat | image-text-to-text | apache-2.0 | 29 | 0 | 31.8 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Sa2VA-Qwen2_5-VL-7B) |
| 17 | `bytedance-community/DreamO` | — | — | apache-2.0 | 28 | 0 | 5.1 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/DreamO) |
| 18 | `bytedance-community/AnimateDiff-Lightning` | — | text-to-video-synthesis | creativeml-openrail-m | 26 | 0 | 6.8 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/AnimateDiff-Lightning) |
| 19 | `bytedance-community/SDXL-Lightning` | — | text-to-image-synthesis | openrail++ | 25 | 0 | 46.1 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/SDXL-Lightning) |
| 20 | `bytedance-community/Lance` | — | any-to-any | apache-2.0 | 24 | 1 | 28.7 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Lance) |
| 21 | `bytedance-community/Bernini-R` | bernini_renderer | — | apache-2.0 | 23 | 0 | 156.6 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Bernini-R) |
| 22 | `bytedance-community/Seed-Coder-8B-Reasoning-bf16` | llama | text-generation | mit | 22 | 0 | 15.4 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Seed-Coder-8B-Reasoning-bf16) |
| 23 | `bytedance-community/Stable-DiffCoder-8B-Base` | llama | text-generation | mit | 22 | 0 | 15.4 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Stable-DiffCoder-8B-Base) |
| 24 | `bytedance-community/EvoQuality` | qwen2_5_vl | image-text-to-text | apache-2.0 | 19 | 0 | 15.5 GB | 2026-06-10 | [↗](https://modelscope.cn/models/bytedance-community/EvoQuality) |
| 25 | `bytedance-community/M3-Agent-Memorization` | qwen2_5_omni_thinker | — | apache-2.0 | 18 | 0 | 16.7 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/M3-Agent-Memorization) |
| 26 | `bytedance-community/UI-TARS-7B-DPO` | qwen2_vl | image-text-to-text | apache-2.0 | 18 | 0 | 15.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/UI-TARS-7B-DPO) |
| 27 | `bytedance-community/InfiniteYou` | — | text-to-image-synthesis | cc-by-nc-4.0 | 17 | 0 | 40.2 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/InfiniteYou) |
| 28 | `bytedance-community/Sa2VA-Qwen3-VL-4B` | sa2va_chat | image-text-to-text | apache-2.0 | 16 | 0 | 18.9 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Sa2VA-Qwen3-VL-4B) |
| 29 | `bytedance-community/Sa2VA-1B` | sa2va_chat | image-text-to-text | apache-2.0 | 16 | 0 | 3.8 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Sa2VA-1B) |
| 30 | `bytedance-community/Sa2VA-4B` | sa2va_chat | image-text-to-text | apache-2.0 | 16 | 0 | 14.1 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Sa2VA-4B) |
| 31 | `bytedance-community/Valley3-8B-Instruct` | valley_omni | — | apache-2.0 | 16 | 0 | 17.8 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Valley3-8B-Instruct) |
| 32 | `bytedance-community/Valley2.5` | valley | — | apache-2.0 | 16 | 0 | 17.6 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Valley2.5) |
| 33 | `bytedance-community/Seed-X-PPO-7B-GPTQ-Int8` | mistral | translation | other | 15 | 0 | 7.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Seed-X-PPO-7B-GPTQ-Int8) |
| 34 | `bytedance-community/Stable-DiffCoder-8B-Instruct` | llama | text-generation | mit | 15 | 0 | 15.4 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Stable-DiffCoder-8B-Instruct) |
| 35 | `bytedance-community/Sa2VA-8B` | sa2va_chat | image-text-to-text | apache-2.0 | 14 | 0 | 30.4 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Sa2VA-8B) |
| 36 | `bytedance-community/Seed-X-PPO-7B` | mistral | translation | other | 14 | 0 | 14.0 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Seed-X-PPO-7B) |
| 37 | `bytedance-community/Seed-X-RM-7B` | mistral | translation | other | 14 | 0 | 13.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Seed-X-RM-7B) |
| 38 | `bytedance-community/Dolphin-v2` | qwen2_5_vl | image-text-to-text | — | 14 | 0 | 7.0 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Dolphin-v2) |
| 39 | `bytedance-community/Tar-1.5B` | qwen2 | any-to-any | apache-2.0 | 14 | 0 | 4.8 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Tar-1.5B) |
| 40 | `bytedance-community/pasa-7b-selector` | qwen2 | text-generation | cc-by-nc-sa-4.0 | 14 | 0 | 28.4 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/pasa-7b-selector) |
| 41 | `bytedance-community/Q-Insight` | — | — | apache-2.0 | 14 | 0 | 80.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Q-Insight) |
| 42 | `bytedance-community/Vidi1.5-9B` | dattn_gemma2 | — | cc-by-nc-4.0 | 14 | 0 | 19.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Vidi1.5-9B) |
| 43 | `bytedance-community/Valley2-DPO` | valley | — | apache-2.0 | 14 | 0 | 16.6 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Valley2-DPO) |
| 44 | `bytedance-community/Valley3-8B-Think` | valley_omni | — | apache-2.0 | 14 | 0 | 17.8 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Valley3-8B-Think) |
| 45 | `bytedance-community/Vidi-7B` | dattn_mistral | — | cc-by-nc-4.0 | 14 | 0 | 15.9 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Vidi-7B) |
| 46 | `bytedance-community/Sa2VA-InternVL3-14B` | sa2va_chat | image-text-to-text | apache-2.0 | 14 | 0 | 56.7 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Sa2VA-InternVL3-14B) |
| 47 | `bytedance-community/Valley-Eagle-7B` | valley | — | apache-2.0 | 14 | 0 | 16.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Valley-Eagle-7B) |
| 48 | `bytedance-community/Valley3-32B-Think` | valley_omni | — | apache-2.0 | 14 | 0 | 63.6 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Valley3-32B-Think) |
| 49 | `bytedance-community/Seed-Coder-8B-Instruct` | llama | text-generation | mit | 13 | 0 | 15.4 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Seed-Coder-8B-Instruct) |
| 50 | `bytedance-community/Tar-7B` | qwen2 | any-to-any | apache-2.0 | 12 | 0 | 16.2 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Tar-7B) |
| 51 | `bytedance-community/pasa-7b-crawler` | qwen2 | — | cc-by-nc-sa-4.0 | 12 | 0 | 14.2 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/pasa-7b-crawler) |
| 52 | `bytedance-community/BFS-Prover-V1-7B` | qwen2 | text-generation | apache-2.0 | 12 | 0 | 14.2 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/BFS-Prover-V1-7B) |
| 53 | `bytedance-community/Seed-X-PPO-7B-AWQ-Int4` | mistral | translation | other | 12 | 0 | 4.4 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Seed-X-PPO-7B-AWQ-Int4) |
| 54 | `bytedance-community/BFS-Prover-V2-7B` | qwen2 | text-generation | apache-2.0 | 12 | 0 | 14.2 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/BFS-Prover-V2-7B) |
| 55 | `bytedance-community/Sa2VA-26B` | sa2va_chat | image-text-to-text | apache-2.0 | 12 | 0 | 85.7 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Sa2VA-26B) |
| 56 | `bytedance-community/Seed-OSS-36B-Instruct` | seed_oss | text-generation | apache-2.0 | 11 | 0 | 67.3 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Seed-OSS-36B-Instruct) |
| 57 | `bytedance-community/Sa2VA-InternVL3-8B` | sa2va_chat | image-text-to-text | apache-2.0 | 11 | 0 | 29.9 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Sa2VA-InternVL3-8B) |
| 58 | `bytedance-community/Sa2VA-Qwen3-VL-2B` | sa2va_chat | image-text-to-text | apache-2.0 | 11 | 0 | 10.0 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Sa2VA-Qwen3-VL-2B) |
| 59 | `bytedance-community/TaskMem` | qwen3_vl_moe | — | apache-2.0 | 11 | 0 | 57.9 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/TaskMem) |
| 60 | `bytedance-community/Video-As-Prompt-Wan2.1-14B` | — | image-to-video | apache-2.0 | 10 | 0 | 61.3 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Video-As-Prompt-Wan2.1-14B) |
| 61 | `bytedance-community/Seed-Coder-8B-Base` | llama | text-generation | mit | 10 | 0 | 15.4 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Seed-Coder-8B-Base) |
| 62 | `bytedance-community/Seed-OSS-36B-Base` | seed_oss | text-generation | apache-2.0 | 10 | 0 | 67.3 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Seed-OSS-36B-Base) |
| 63 | `bytedance-community/Seed-Coder-8B-Reasoning` | llama | text-generation | mit | 10 | 0 | 30.7 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Seed-Coder-8B-Reasoning) |
| 64 | `bytedance-community/academic-ds-9B` | deepseek_v3 | text-generation | apache-2.0 | 10 | 0 | 17.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/academic-ds-9B) |
| 65 | `bytedance-community/ContentV-8B` | — | text-to-video-synthesis | apache-2.0 | 10 | 0 | 25.9 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/ContentV-8B) |
| 66 | `bytedance-community/AHN-GDN-for-Qwen-2.5-Instruct-14B` | qwen2 | text-generation | apache-2.0 | 10 | 0 | 116.3 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/AHN-GDN-for-Qwen-2.5-Instruct-14B) |
| 67 | `bytedance-community/lynx` | — | image-to-video | apache-2.0 | 10 | 0 | 17.8 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/lynx) |
| 68 | `bytedance-community/DynamicCoT` | qwen2_5_vl | — | — | 10 | 0 | 15.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/DynamicCoT) |
| 69 | `bytedance-community/Sa2VA-Qwen2_5-VL-3B` | sa2va_chat | image-text-to-text | apache-2.0 | 10 | 0 | 16.0 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Sa2VA-Qwen2_5-VL-3B) |
| 70 | `bytedance-community/HyperLoRA` | — | — | cc-by-nc-4.0 | 8 | 0 | 5.8 GB | 2026-06-16 | [↗](https://modelscope.cn/models/bytedance-community/HyperLoRA) |
| 71 | `bytedance-community/SeedVR2-7B` | — | — | apache-2.0 | 8 | 0 | 62.3 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/SeedVR2-7B) |
| 72 | `bytedance-community/Cola-DLM` | — | text-generation | apache-2.0 | 8 | 0 | 8.7 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Cola-DLM) |
| 73 | `bytedance-community/M3-Agent-Control` | qwen3 | — | apache-2.0 | 8 | 0 | 61.0 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/M3-Agent-Control) |
| 74 | `bytedance-community/AHN-Mamba2-for-Qwen-2.5-Instruct-3B` | qwen2 | text-generation | other | 8 | 0 | 22.7 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/AHN-Mamba2-for-Qwen-2.5-Instruct-3B) |
| 75 | `bytedance-community/UI-TARS-7B-SFT` | qwen2_vl | image-text-to-text | apache-2.0 | 8 | 0 | 30.9 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/UI-TARS-7B-SFT) |
| 76 | `bytedance-community/AHN-Mamba2-for-Qwen-2.5-Instruct-14B` | qwen2 | text-generation | apache-2.0 | 8 | 0 | 98.0 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/AHN-Mamba2-for-Qwen-2.5-Instruct-14B) |
| 77 | `bytedance-community/AHN-GDN-for-Qwen-2.5-Instruct-3B` | qwen2 | text-generation | other | 8 | 0 | 24.8 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/AHN-GDN-for-Qwen-2.5-Instruct-3B) |
| 78 | `bytedance-community/Seed-X-Instruct-7B` | mistral | translation | other | 8 | 0 | 14.0 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Seed-X-Instruct-7B) |
| 79 | `bytedance-community/AHN-GDN-for-Qwen-2.5-Instruct-7B` | qwen2 | text-generation | apache-2.0 | 8 | 0 | 40.6 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/AHN-GDN-for-Qwen-2.5-Instruct-7B) |
| 80 | `bytedance-community/AHN-DN-for-Qwen-2.5-Instruct-7B` | qwen2 | text-generation | apache-2.0 | 8 | 0 | 35.3 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/AHN-DN-for-Qwen-2.5-Instruct-7B) |
| 81 | `bytedance-community/AHN-Mamba2-for-Qwen-2.5-Instruct-7B` | qwen2 | text-generation | apache-2.0 | 8 | 0 | 35.5 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/AHN-Mamba2-for-Qwen-2.5-Instruct-7B) |
| 82 | `bytedance-community/AHN-DN-for-Qwen-2.5-Instruct-14B` | qwen2 | text-generation | apache-2.0 | 8 | 0 | 97.5 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/AHN-DN-for-Qwen-2.5-Instruct-14B) |
| 83 | `bytedance-community/AHN-DN-for-Qwen-2.5-Instruct-3B` | qwen2 | text-generation | other | 8 | 0 | 22.5 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/AHN-DN-for-Qwen-2.5-Instruct-3B) |
| 84 | `bytedance-community/Seed-OSS-36B-Base-woSyn` | seed_oss | text-generation | apache-2.0 | 8 | 0 | 67.3 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Seed-OSS-36B-Base-woSyn) |
| 85 | `bytedance-community/Valley3-32B-Instruct` | valley_omni | — | apache-2.0 | 8 | 0 | 63.6 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Valley3-32B-Instruct) |
| 86 | `bytedance-community/MammothModa2-Preview` | mammothmoda2 | — | — | 8 | 0 | 34.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/MammothModa2-Preview) |
| 87 | `bytedance-community/GRN` | — | — | mit | 7 | 0 | 42.8 GB | 2026-06-08 | [↗](https://modelscope.cn/models/bytedance-community/GRN) |
| 88 | `bytedance-community/SeedVR2-3B` | — | — | apache-2.0 | 7 | 0 | 13.6 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/SeedVR2-3B) |
| 89 | `bytedance-community/UI-TARS-72B-SFT` | qwen2_vl | image-text-to-text | apache-2.0 | 7 | 0 | 273.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/UI-TARS-72B-SFT) |
| 90 | `bytedance-community/cudaLLM-8B` | qwen3 | text-generation | apache-2.0 | 7 | 0 | 30.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/cudaLLM-8B) |
| 91 | `bytedance-community/MammothModa2-Dev` | mammothmoda2 | — | — | 7 | 0 | 47.6 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/MammothModa2-Dev) |
| 92 | `bytedance-community/cryofm-v2` | — | — | apache-2.0 | 6 | 0 | 1.9 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/cryofm-v2) |
| 93 | `bytedance-community/LatentSync-1.5` | — | — | openrail++ | 5 | 0 | 9.1 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/LatentSync-1.5) |
| 94 | `bytedance-community/USO` | — | text-to-image-synthesis | apache-2.0 | 5 | 0 | 478.2 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/USO) |
| 95 | `bytedance-community/OneReward` | — | image-to-image | cc-by-nc-4.0 | 5 | 0 | 44.6 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/OneReward) |
| 96 | `bytedance-community/Video-As-Prompt-CogVideoX-5B` | — | image-to-video | apache-2.0 | 5 | 0 | 30.4 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Video-As-Prompt-CogVideoX-5B) |
| 97 | `bytedance-community/UI-TARS-72B-DPO` | qwen2_vl | image-text-to-text | apache-2.0 | 5 | 0 | 136.7 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/UI-TARS-72B-DPO) |
| 98 | `bytedance-community/BFS-Prover-V2-32B` | qwen2 | text-generation | apache-2.0 | 5 | 0 | 122.1 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/BFS-Prover-V2-32B) |
| 99 | `bytedance-community/Sa2VA-InternVL3-2B` | sa2va_chat | image-text-to-text | apache-2.0 | 4 | 0 | 8.1 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Sa2VA-InternVL3-2B) |
| 100 | `bytedance-community/Dolphin-1.5` | vision-encoder-decoder | image-text-to-text | mit | 4 | 0 | 770.3 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Dolphin-1.5) |
| 101 | `bytedance-community/Dolphin` | vision-encoder-decoder | image-text-to-text | mit | 4 | 0 | 770.3 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Dolphin) |
| 102 | `bytedance-community/cryofm-v1` | — | — | apache-2.0 | 4 | 0 | 2.4 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/cryofm-v1) |
| 103 | `bytedance-community/UMO` | — | text-to-image-synthesis | apache-2.0 | 4 | 0 | 2.4 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/UMO) |
| 104 | `bytedance-community/XVerse` | — | text-to-image-synthesis | apache-2.0 | 4 | 0 | 2.8 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/XVerse) |
| 105 | `bytedance-community/MegaTTS3` | — | text-to-speech | apache-2.0 | 3 | 0 | 4.0 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/MegaTTS3) |
| 106 | `bytedance-community/EchoVideo` | — | image-to-video | other | 3 | 0 | 10.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/EchoVideo) |
| 107 | `bytedance-community/SimArt` | — | — | apache-2.0 | 3 | 0 | 17.8 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/SimArt) |
| 108 | `bytedance-community/Phantom` | — | image-to-video | apache-2.0 | 2 | 0 | 58.7 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Phantom) |
| 109 | `bytedance-community/BM-Model` | — | image-to-image | other | 2 | 0 | 22.2 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/BM-Model) |
| 110 | `bytedance-community/BindWeave` | — | image-to-video | apache-2.0 | 2 | 0 | 61.2 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/BindWeave) |
| 111 | `bytedance-community/sd2.1-base-zsnr-laionaes6-perceptual` | — | text-to-image-synthesis | openrail++ | 2 | 0 | 4.8 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/sd2.1-base-zsnr-laionaes6-perceptual) |
| 112 | `bytedance-community/Adversarial-Flow-Models` | — | — | mit | 2 | 0 | 126.6 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Adversarial-Flow-Models) |
| 113 | `bytedance-community/UNO` | — | image-to-image | apache-2.0 | 2 | 0 | 1.8 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/UNO) |
| 114 | `bytedance-community/ID-Patch` | — | — | openrail++ | 2 | 0 | 5.3 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/ID-Patch) |
| 115 | `bytedance-community/Attention2Probability` | — | — | apache-2.0 | 2 | 0 | 16.6 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Attention2Probability) |
| 116 | `bytedance-community/LVFace` | — | — | mit | 1 | 0 | 3.9 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/LVFace) |
| 117 | `bytedance-community/SeedVR-7B` | — | — | apache-2.0 | 1 | 0 | 31.6 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/SeedVR-7B) |
| 118 | `bytedance-community/Dreamfit` | — | — | — | 1 | 0 | 5.7 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Dreamfit) |
| 119 | `bytedance-community/HuMo` | — | image-to-video | apache-2.0 | 1 | 0 | 70.2 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/HuMo) |
| 120 | `bytedance-community/ATI` | i2v | image-to-video | apache-2.0 | 1 | 0 | 61.1 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/ATI) |
| 121 | `bytedance-community/Make-An-Audio-2` | — | — | mit | 0 | 0 | 6.8 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Make-An-Audio-2) |
| 122 | `bytedance-community/VINCIE-7B` | — | — | apache-2.0 | 0 | 0 | 61.8 GB | 2026-06-16 | [↗](https://modelscope.cn/models/bytedance-community/VINCIE-7B) |
| 123 | `bytedance-community/bamboo_mixer` | — | — | cc-by-4.0 | 0 | 0 | 280.7 MB | 2026-06-16 | [↗](https://modelscope.cn/models/bytedance-community/bamboo_mixer) |
| 124 | `bytedance-community/ChatTS-14B` | chatts | text-generation | apache-2.0 | 0 | 0 | 27.7 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/ChatTS-14B) |
| 125 | `bytedance-community/RealCustom` | — | text-to-image-synthesis | cc-by-nc-nd-4.0 | 0 | 0 | 20.4 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/RealCustom) |
| 126 | `bytedance-community/sd2.1-base-zsnr-laionaes6` | — | text-to-image-synthesis | openrail++ | 0 | 0 | 4.8 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/sd2.1-base-zsnr-laionaes6) |
| 127 | `bytedance-community/LatentSync` | — | — | openrail++ | 0 | 0 | 7.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/LatentSync) |
| 128 | `bytedance-community/ChatTS-8B` | qwen3ts | text-generation | apache-2.0 | 0 | 0 | 15.4 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/ChatTS-8B) |
| 129 | `bytedance-community/FaceCLIP` | — | text-to-image-synthesis | cc-by-nc-4.0 | 0 | 0 | 41.6 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/FaceCLIP) |
| 130 | `bytedance-community/VINCIE-3B` | — | image-to-image | apache-2.0 | 0 | 0 | 40.0 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/VINCIE-3B) |
| 131 | `bytedance-community/sd2.1-base-zsnr-laionaes5` | — | text-to-image-synthesis | openrail++ | 0 | 0 | 4.8 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/sd2.1-base-zsnr-laionaes5) |
| 132 | `bytedance-community/SeedVR-3B` | — | — | apache-2.0 | 0 | 0 | 13.6 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/SeedVR-3B) |
| 133 | `bytedance-community/HLLM` | — | — | apache-2.0 | 0 | 0 | 127.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/HLLM) |
| 134 | `bytedance-community/ConfRover-base-20M-v1.0` | — | — | apache-2.0 | 0 | 0 | 75.1 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/ConfRover-base-20M-v1.0) |
| 135 | `bytedance-community/Tar-TA-Tok` | — | — | apache-2.0 | 0 | 0 | 9.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/Tar-TA-Tok) |
| 136 | `bytedance-community/shot2story` | — | visual-question-answering | — | 0 | 0 | 5.6 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/shot2story) |
| 137 | `bytedance-community/feature-preserve-portrait-editing` | — | — | creativeml-openrail-m | 0 | 0 | 6.4 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/feature-preserve-portrait-editing) |
| 138 | `bytedance-community/CascadeV` | — | — | openrail++ | 0 | 0 | 870.1 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/CascadeV) |
| 139 | `bytedance-community/NEVC1.0` | — | — | bsd-3-clause-clear | 0 | 0 | 197.3 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/NEVC1.0) |
| 140 | `bytedance-community/ConfRover-interp-20M-v1.0` | — | — | apache-2.0 | 0 | 0 | 74.9 MB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/ConfRover-interp-20M-v1.0) |
| 141 | `bytedance-community/SAIL-7B` | mistral | image-text-to-text | apache-2.0 | 0 | 0 | 13.5 GB | 2026-06-05 | [↗](https://modelscope.cn/models/bytedance-community/SAIL-7B) |

---

## 360 智脑 (Qihoo 360)

Namespace: `qihoo360` · 组织主页: [https://modelscope.cn/profile/qihoo360](https://modelscope.cn/profile/qihoo360) · 模型数: **7**

| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |
|---|---------|------|------|------|------|------|------|------|------|
| 1 | `qihoo360/360Zhinao-7B-Chat-360K` | zhinao | — | apache-2.0 | 918 | 6 | 14.5 GB | 2024-04-12 | [↗](https://modelscope.cn/models/qihoo360/360Zhinao-7B-Chat-360K) |
| 2 | `qihoo360/360Zhinao-7B-Chat-4K` | zhinao | — | apache-2.0 | 732 | 0 | 14.5 GB | 2024-04-16 | [↗](https://modelscope.cn/models/qihoo360/360Zhinao-7B-Chat-4K) |
| 3 | `qihoo360/360Zhinao-7B-Base` | zhinao | — | apache-2.0 | 345 | 0 | 14.5 GB | 2024-04-12 | [↗](https://modelscope.cn/models/qihoo360/360Zhinao-7B-Base) |
| 4 | `qihoo360/360Zhinao-7B-Chat-32K` | zhinao | — | apache-2.0 | 273 | 0 | 14.5 GB | 2024-04-12 | [↗](https://modelscope.cn/models/qihoo360/360Zhinao-7B-Chat-32K) |
| 5 | `qihoo360/360Zhinao-7B-Chat-360K-Int4` | zhinao | — | apache-2.0 | 124 | 0 | 5.6 GB | 2024-04-26 | [↗](https://modelscope.cn/models/qihoo360/360Zhinao-7B-Chat-360K-Int4) |
| 6 | `qihoo360/360Zhinao-7B-Chat-4K-Int4` | zhinao | — | Apache License 2.0 | 113 | 0 | 5.6 GB | 2024-04-26 | [↗](https://modelscope.cn/models/qihoo360/360Zhinao-7B-Chat-4K-Int4) |
| 7 | `qihoo360/360Zhinao-7B-Chat-32K-Int4` | zhinao | — | apache-2.0 | 91 | 1 | 5.6 GB | 2024-04-26 | [↗](https://modelscope.cn/models/qihoo360/360Zhinao-7B-Chat-32K-Int4) |

---

## 统计汇总 (Summary)

| 厂商 | 模型数 |
|------|--------|
| 阿里 · 通义千问 | 437 |
| 深度求索 | 88 |
| 智谱 AI | 168 |
| 零一万物 | 28 |
| 百川智能 | 24 |
| 阶跃星辰 | 57 |
| 腾讯混元 | 84 |
| 上海 AI 实验室 · 书生 | 443 |
| 商汤日日新 | 30 |
| 昆仑万维 · 天工 | 74 |
| 月之暗面 | 18 |
| MiniMax | 18 |
| 科大讯飞 | 4 |
| 字节跳动 Seed | 141 |
| 360 智脑 | 7 |
| **合计** | **1,621** |

*Full data: `来源/modelscope/raw/` · Scraped: 2026-06-19*