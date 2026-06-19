---
title: "ModelScope 模型目录全景 (ModelScope Model Catalog)"
category: 04-nlp-llms-chinese-llm
tags: ["modelscope", "chinese-llm", "model-hub", "qwen", "deepseek", "glm", "open-source", "catalog"]
summary: "基于 ModelScope 官方 API 全量抓取的 15 家中国大模型厂商模型目录：每家的组织信息、模型矩阵、下载量统计、Top 模型精选与许可证分布。共 1,621 个官方模型、197,281,034 次累计下载。"
created: 2026-06-19
updated: 2026-06-19
source: https://modelscope.cn/
---

# ModelScope 模型目录全景 (ModelScope Model Catalog)

> **一句话理解**: ModelScope 魔搭社区上 15 家中国大模型厂商的**全量官方模型目录**——从 Qwen 的 437 个模型舰队到 DeepSeek 的 88 个开源模型，一张图看清各家在国产模型托管平台上的真实家底。

## 总览 (Overview)

| 指标 | 数值 |
|------|------|
| 覆盖厂商 | 15 家 |
| 官方模型总数 | **1,621** |
| 累计下载量 | **197,281,034** |
| 累计收藏量 | 39,008 |
| 数据来源 | [ModelScope 官方 API](https://modelscope.cn/) |
| 抓取时间 | 2026-06-19 |

## 厂商排名 (Vendor Ranking)

按 ModelScope 累计下载量排序：

| # | 厂商 | Namespace | 模型数 | 累计下载 | 人均下载 | 主力任务 | 深度文档 |
|---|------|-----------|--------|---------|---------|---------|---------|
| 1 | **阿里 · 通义千问** | `qwen` | 437 | 145,674,435 | 333.4K | text-generation(296), image-text-to-text(82), any-to-any(7) | [[Qwen_Deep_Dive]] |
| 2 | **深度求索** | `deepseek-ai` | 88 | 21,270,975 | 241.7K | text-generation(67), image-text-to-text(7), any-to-any(4) | [[DeepSeek_Deep_Dive]] |
| 3 | **智谱 AI** | `ZhipuAI` | 168 | 15,099,715 | 89.9K | text-generation(81), image-text-to-text(18), text-to-video-synthesis(5) | [[GLM_Zhipu_Deep_Dive]] |
| 4 | **阶跃星辰** | `stepfun-ai` | 57 | 5,815,831 | 102.0K | image-text-to-text(12), text-generation(6), text-to-speech(5) | [[StepFun_Deep_Dive]] |
| 5 | **月之暗面** | `moonshotai` | 18 | 3,506,128 | 194.8K | text-generation(8), image-text-to-text(6), text-to-speech(2) | [[Kimi_Moonshot_Deep_Dive]] |
| 6 | **腾讯混元** | `Tencent-Hunyuan` | 84 | 1,636,101 | 19.5K | text-generation(31), translation(18), image-to-3D(10) | [[Tencent_Hunyuan_Deep_Dive]] |
| 7 | **百川智能** | `baichuan-inc` | 24 | 1,504,011 | 62.7K | text-generation(17), image-text-to-text(2) | [[Baichuan_Deep_Dive]] |
| 8 | **MiniMax** | `MiniMax` | 18 | 1,279,001 | 71.1K | text-generation(12), image-text-to-text(3) | [[MiniMax_Deep_Dive]] |
| 9 | **上海 AI 实验室 · 书生** | `Shanghai_AI_Laboratory` | 443 | 768,670 | 1.7K | image-text-to-text(198), text-generation(73), image-classification(19) | [[InternLM_Deep_Dive]] |
| 10 | **昆仑万维 · 天工** | `Skywork` | 74 | 360,947 | 4.9K | image-to-video(13), text-to-video-synthesis(11), text-classification(10) | — |
| 11 | **零一万物** | `01ai` | 28 | 255,688 | 9.1K | text-generation(19), text2text-generation(4), text-classification(3) | [[Yi_01AI_Deep_Dive]] |
| 12 | **科大讯飞** | `iflytek` | 4 | 75,130 | 18.8K | text-generation(3) | [[iFlytek_Spark_Deep_Dive]] |
| 13 | **商汤日日新** | `SenseNova` | 30 | 29,078 | 969 | image-text-to-text(15), any-to-any(7), feature-extraction(2) | [[SenseTime_SenseNova_Deep_Dive]] |
| 14 | **字节跳动 Seed** | `bytedance-community` | 141 | 2,728 | 19 | text-generation(31), image-text-to-text(22), text-to-image-synthesis(11) | [[ByteDance_Doubao_Deep_Dive]] |
| 15 | **360 智脑** | `qihoo360` | 7 | 2,596 | 370 | — | — |

---

## 各厂商模型目录 (Per-Vendor Catalog)

### 阿里 · 通义千问 (Qwen)（详见 [[Qwen_Deep_Dive]]）

| 维度 | 详情 |
|------|------|
| **ModelScope 主页** | [https://modelscope.cn/organization/qwen](https://modelscope.cn/organization/qwen) |
| **官方 namespace** | `qwen` |
| **组织全称** | 千问 |
| **GitHub** | https://github.com/QwenLM |
| **组织创建时间** | 2023-08-02 |
| **模型总数** | 437 |
| **累计下载** | 145,674,435 |
| **累计收藏** | 20,434 |
| **总存储** | 26.5 TB |
| **许可证分布** | apache-2.0 (296); other (123); 未标注 (16); Apache License 2.0 (2) |
| **主要模型类型** | qwen2 (149), qwen3 (58), qwen3_moe (27), qwen (21), qwen3_vl (20) |
| **主要任务** | text-generation (296), image-text-to-text (82), any-to-any (7), sentence-embedding (6), text-ranking (5) |
| **主要架构** | Qwen2ForCausalLM (144), Qwen3ForCausalLM (58), Qwen3MoeForCausalLM (27), QWenLMHeadModel (21), Qwen3VLForConditionalGeneration (20) |

> 📝 **组织简介**: 欢迎来到 Qwen 👋 这是 Qwen 的组织，阿里云构建的大型语言模型家族。在这个组织中，我们不断发布大型语言模型 (LLM)、大型多模态模型 (LMM) 和其他 AGI 相关项目。快来查看并享受吧！

**Top 15 模型（按下载量）**:

| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |
|---|------|------|------|------|------|------|------|------|
| 1 | [Qwen2.5-0.5B-Instruct](https://modelscope.cn/models/Qwen/Qwen2.5-0.5B-Instruct) | qwen2 | text-generation | apache-2.0 | 8,821,438 | 234 | 953.3 MB | 2025-02-26 |
| 2 | [Qwen2.5-7B-Instruct](https://modelscope.cn/models/Qwen/Qwen2.5-7B-Instruct) | qwen2 | text-generation | apache-2.0 | 7,002,284 | 477 | 14.2 GB | 2025-03-07 |
| 3 | [Qwen3-VL-8B-Instruct](https://modelscope.cn/models/Qwen/Qwen3-VL-8B-Instruct) | qwen3_vl | image-text-to-text | apache-2.0 | 6,914,444 | 328 | 16.3 GB | 2026-03-02 |
| 4 | [Qwen3-8B](https://modelscope.cn/models/Qwen/Qwen3-8B) | qwen3 | text-generation | apache-2.0 | 6,534,070 | 300 | 15.3 GB | 2025-07-26 |
| 5 | [Qwen3-0.6B](https://modelscope.cn/models/Qwen/Qwen3-0.6B) | qwen3 | text-generation | apache-2.0 | 5,162,158 | 231 | 1.4 GB | 2025-07-26 |
| 6 | [Qwen2.5-VL-7B-Instruct](https://modelscope.cn/models/Qwen/Qwen2.5-VL-7B-Instruct) | qwen2_5_vl | image-text-to-text | apache-2.0 | 4,976,315 | 425 | 15.5 GB | 2025-04-06 |
| 7 | [Qwen2.5-72B-Instruct](https://modelscope.cn/models/Qwen/Qwen2.5-72B-Instruct) | qwen2 | text-generation | other | 4,614,356 | 219 | 135.4 GB | 2025-03-07 |
| 8 | [Qwen3-32B](https://modelscope.cn/models/Qwen/Qwen3-32B) | qwen3 | text-generation | apache-2.0 | 4,030,448 | 328 | 61.0 GB | 2025-07-26 |
| 9 | [Qwen2.5-14B-Instruct](https://modelscope.cn/models/Qwen/Qwen2.5-14B-Instruct) | qwen2 | text-generation | apache-2.0 | 3,996,259 | 98 | 27.5 GB | 2025-03-07 |
| 10 | [Qwen3-4B](https://modelscope.cn/models/Qwen/Qwen3-4B) | qwen3 | text-generation | apache-2.0 | 3,444,346 | 136 | 7.5 GB | 2025-07-26 |
| 11 | [Qwen3-Reranker-8B](https://modelscope.cn/models/Qwen/Qwen3-Reranker-8B) | qwen3 | text-ranking | apache-2.0 | 3,205,304 | 64 | 15.3 GB | 2025-06-09 |
| 12 | [Qwen3-Embedding-0.6B](https://modelscope.cn/models/Qwen/Qwen3-Embedding-0.6B) | qwen3 | sentence-embedding | apache-2.0 | 3,188,978 | 118 | 1.1 GB | 2025-06-22 |
| 13 | [Qwen3.5-35B-A3B](https://modelscope.cn/models/Qwen/Qwen3.5-35B-A3B) | qwen3_5_moe | image-text-to-text | apache-2.0 | 3,113,537 | 146 | 67.0 GB | 2026-04-23 |
| 14 | [Qwen-Image](https://modelscope.cn/models/Qwen/Qwen-Image) | — | text-to-image-synthesis | apache-2.0 | 2,762,257 | 450 | 53.7 GB | 2025-08-18 |
| 15 | [Qwen3-Next-80B-A3B-Instruct](https://modelscope.cn/models/Qwen/Qwen3-Next-80B-A3B-Instruct) | qwen3_next | text-generation | apache-2.0 | 2,185,735 | 164 | 151.5 GB | 2025-09-17 |

> 📋 完整 437 个模型清单见 [[ModelScope_Model_Index]]。

---

### 深度求索 (DeepSeek)（详见 [[DeepSeek_Deep_Dive]]）

| 维度 | 详情 |
|------|------|
| **ModelScope 主页** | [https://modelscope.cn/organization/deepseek-ai](https://modelscope.cn/organization/deepseek-ai) |
| **官方 namespace** | `deepseek-ai` |
| **组织全称** | DeepSeek |
| **GitHub** | https://www.deepseek.com/ |
| **组织创建时间** | 2023-11-02 |
| **模型总数** | 88 |
| **累计下载** | 21,270,975 |
| **累计收藏** | 6,540 |
| **总存储** | 16.2 TB |
| **许可证分布** | other (41); mit (22); 未标注 (20); apache-2.0 (2) |
| **主要模型类型** | deepseek_v2 (25), llama (24), deepseek_v3 (10), multi_modality (8), deepseek_v32 (5) |
| **主要任务** | text-generation (67), image-text-to-text (7), any-to-any (4) |
| **主要架构** | DeepseekV2ForCausalLM (27), LlamaForCausalLM (24), DeepseekV3ForCausalLM (10), MultiModalityCausalLM (6), DeepseekV32ForCausalLM (5) |

**Top 15 模型（按下载量）**:

| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |
|---|------|------|------|------|------|------|------|------|
| 1 | [DeepSeek-R1-Distill-Qwen-32B](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B) | qwen2 | text-generation | mit | 2,691,813 | 258 | 61.0 GB | 2025-02-24 |
| 2 | [DeepSeek-R1-Distill-Llama-70B](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-Distill-Llama-70B) | llama | text-generation | mit | 2,109,015 | 114 | 131.4 GB | 2025-02-24 |
| 3 | [DeepSeek-R1-Distill-Qwen-1.5B](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B) | qwen2 | text-generation | mit | 1,934,828 | 326 | 3.3 GB | 2025-03-07 |
| 4 | [DeepSeek-V3.1-Terminus](https://modelscope.cn/models/deepseek-ai/DeepSeek-V3.1-Terminus) | deepseek_v3 | text-generation | mit | 1,881,594 | 68 | 641.3 GB | 2025-09-22 |
| 5 | [DeepSeek-V3.2-Exp](https://modelscope.cn/models/deepseek-ai/DeepSeek-V3.2-Exp) | deepseek_v32 | — | mit | 1,828,145 | 146 | 642.1 GB | 2025-11-18 |
| 6 | [DeepSeek-OCR](https://modelscope.cn/models/deepseek-ai/DeepSeek-OCR) | deepseek_vl_v2 | image-text-to-text | mit | 1,673,233 | 273 | 6.2 GB | 2025-11-16 |
| 7 | [DeepSeek-R1](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1) | deepseek_v3 | — | mit | 925,008 | 1352 | 641.3 GB | 2025-03-07 |
| 8 | [DeepSeek-R1-Distill-Qwen-7B](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B) | qwen2 | text-generation | mit | 909,392 | 422 | 14.2 GB | 2025-02-24 |
| 9 | [DeepSeek-V2-Lite-Chat](https://modelscope.cn/models/deepseek-ai/DeepSeek-V2-Lite-Chat) | deepseek_v2 | text-generation | other | 789,573 | 17 | 29.3 GB | 2024-07-26 |
| 10 | [DeepSeek-Coder-V2-Lite-Instruct](https://modelscope.cn/models/deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct) | deepseek_v2 | text-generation | other | 667,837 | 31 | 29.3 GB | 2024-12-25 |
| 11 | [DeepSeek-V2-Chat](https://modelscope.cn/models/deepseek-ai/DeepSeek-V2-Chat) | deepseek_v2 | text-generation | other | 622,050 | 42 | 439.1 GB | 2025-02-26 |
| 12 | [DeepSeek-R1-0528](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-0528) | deepseek_v3 | text-generation | mit | 579,518 | 324 | 641.3 GB | 2025-05-29 |
| 13 | [DeepSeek-V4-Flash](https://modelscope.cn/models/deepseek-ai/DeepSeek-V4-Flash) | deepseek_v4 | text-generation | mit | 550,197 | 268 | 148.7 GB | 2026-06-08 |
| 14 | [DeepSeek-R1-Distill-Qwen-14B](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-14B) | qwen2 | text-generation | mit | 465,606 | 173 | 27.5 GB | 2025-02-24 |
| 15 | [DeepSeek-V3.2](https://modelscope.cn/models/deepseek-ai/DeepSeek-V3.2) | deepseek_v32 | text-generation | — | 368,509 | 443 | 642.2 GB | 2025-12-01 |

> 📋 完整 88 个模型清单见 [[ModelScope_Model_Index]]。

---

### 智谱 AI (ZhipuAI)（详见 [[GLM_Zhipu_Deep_Dive]]）

| 维度 | 详情 |
|------|------|
| **ModelScope 主页** | [https://modelscope.cn/organization/ZhipuAI](https://modelscope.cn/organization/ZhipuAI) |
| **官方 namespace** | `ZhipuAI` |
| **组织全称** | 智谱.AI |
| **GitHub** | https://www.zhipu.ai |
| **组织创建时间** | 2022-10-22 |
| **模型总数** | 168 |
| **累计下载** | 15,099,715 |
| **累计收藏** | 6,342 |
| **总存储** | 14.7 TB |
| **许可证分布** | 未标注 (53); mit (47); other (42); apache-2.0 (21) |
| **主要模型类型** | chatglm (29), glm (18), llama (17), glm4_moe (10), glm4v (8) |
| **主要任务** | text-generation (81), image-text-to-text (18), text-to-video-synthesis (5), text-to-image-synthesis (4), nli (3) |
| **主要架构** | ChatGLMModel (19), LlamaForCausalLM (17), CogVLMForCausalLM (16), ChatGLMForConditionalGeneration (10), Glm4MoeForCausalLM (10) |

> 📝 **组织简介**: 智谱AI由清华大学计算机系的技术成果转化而来。公司主导研发了多语言千亿级超大规模预训练模型，构建了高精度通用知识图谱，并把两者有机融合打造了数据与知识双轮驱动的认知引擎。公司核心技术获得国家科学进步二等奖、北京市发明专利一等奖。智谱提出全新Model as a Service（MaaS）的市场理念，打造了认知大模型平台以及数字人和科技情报产品，应用单位包括：中国科协、北京市科委、华为、腾讯等1000余家企事业单位。智谱AI也秉承着肩负企业社会责任，研发了面向疫情的知识疫图、面向无障碍沟通的手语数字人技术等，促进社会平等和进步。

**Top 15 模型（按下载量）**:

| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |
|---|------|------|------|------|------|------|------|------|
| 1 | [glm-4-9b-chat-1m](https://modelscope.cn/models/ZhipuAI/glm-4-9b-chat-1m) | chatglm | nli | other | 4,671,476 | 62 | 17.7 GB | 2026-01-20 |
| 2 | [chatglm3-6b](https://modelscope.cn/models/ZhipuAI/chatglm3-6b) | chatglm | — | — | 1,588,398 | 825 | 23.3 GB | 2026-01-20 |
| 3 | [glm-4-voice-9b](https://modelscope.cn/models/ZhipuAI/glm-4-voice-9b) | chatglm | chatbot | — | 817,987 | 50 | 17.8 GB | 2024-10-25 |
| 4 | [glm-4-voice-tokenizer](https://modelscope.cn/models/ZhipuAI/glm-4-voice-tokenizer) | whisper | auto-speech-recognition | — | 738,117 | 33 | 1.4 GB | 2024-10-25 |
| 5 | [glm-4-voice-decoder](https://modelscope.cn/models/ZhipuAI/glm-4-voice-decoder) | — | text-to-speech | — | 736,578 | 9 | 502.7 MB | 2024-10-25 |
| 6 | [AutoGLM-Phone-9B-Multilingual](https://modelscope.cn/models/ZhipuAI/AutoGLM-Phone-9B-Multilingual) | glm4v | image-text-to-text | mit | 707,879 | 72 | 19.2 GB | 2026-01-20 |
| 7 | [GLM-4.7-Flash](https://modelscope.cn/models/ZhipuAI/GLM-4.7-Flash) | glm4_moe_lite | text-generation | mit | 695,404 | 153 | 58.2 GB | 2026-01-29 |
| 8 | [GLM-5](https://modelscope.cn/models/ZhipuAI/GLM-5) | glm_moe_dsa | text-generation | mit | 539,379 | 378 | 1.4 TB | 2026-04-05 |
| 9 | [GLM-OCR](https://modelscope.cn/models/ZhipuAI/GLM-OCR) | glm_ocr | image-text-to-text | mit | 522,263 | 96 | 2.5 GB | 2026-05-21 |
| 10 | [glm-4-9b-chat](https://modelscope.cn/models/ZhipuAI/glm-4-9b-chat) | chatglm | nli | other | 411,394 | 248 | 17.5 GB | 2026-01-20 |
| 11 | [GLM-4.7](https://modelscope.cn/models/ZhipuAI/GLM-4.7) | glm4_moe | text-generation | mit | 343,356 | 200 | 667.5 GB | 2026-01-29 |
| 12 | [GLM-4.1V-9B-Thinking](https://modelscope.cn/models/ZhipuAI/GLM-4.1V-9B-Thinking) | glm4v | image-text-to-text | mit | 278,292 | 79 | 19.2 GB | 2026-06-16 |
| 13 | [chatglm3-6b-32k](https://modelscope.cn/models/ZhipuAI/chatglm3-6b-32k) | chatglm | chatbot | — | 262,217 | 174 | 11.6 GB | 2026-01-20 |
| 14 | [GLM-Z1-9B-0414](https://modelscope.cn/models/ZhipuAI/GLM-Z1-9B-0414) | glm4 | text-generation | mit | 254,444 | 5 | 17.5 GB | 2026-01-20 |
| 15 | [CogVideoX1.5-5B-SAT](https://modelscope.cn/models/ZhipuAI/CogVideoX1.5-5B-SAT) | — | image-to-video | other | 249,724 | 28 | 38.1 GB | 2026-01-20 |

> 📋 完整 168 个模型清单见 [[ModelScope_Model_Index]]。

---

### 零一万物 (01.AI)（详见 [[Yi_01AI_Deep_Dive]]）

| 维度 | 详情 |
|------|------|
| **ModelScope 主页** | [https://modelscope.cn/organization/01ai](https://modelscope.cn/organization/01ai) |
| **官方 namespace** | `01ai` |
| **组织全称** | 01-ai |
| **GitHub** | https://01.ai |
| **组织创建时间** | 2023-10-27 |
| **模型总数** | 28 |
| **累计下载** | 255,688 |
| **累计收藏** | 681 |
| **总存储** | 811.3 GB |
| **许可证分布** | apache-2.0 (16); Apache License 2.0 (12) |
| **主要模型类型** | llama (26), llava (2) |
| **主要任务** | text-generation (19), text2text-generation (4), text-classification (3), visual-question-answering (2) |
| **主要架构** | LlamaForCausalLM (26), LlavaLlamaForCausalLM (2) |

> 📝 **组织简介**: 零一万物由创新工场人工智能工程院塔尖孵化，李开复博士亲自领军筹组，是一家致力打造 AI 2.0 时代的前沿大模型技术及软件应用的全球化公司，平台业务核心首重建构行业领先的通用大语言模型，之后推出结合图片、语音、视频等能力的多模态模型，同时逐步发布完善的平台中间件和开发者工具。消费级应用业务着重在研发新型态个人知识工作者及社交互动的应用软件，探索 AI 2.0的新交互、新入口级的未来超级应用；商务级应用层面，零一万物也积极与企业客户合作探索商务级2B应用层面的落地场景。  零一万物团队深信，以基础大模型为突破的 AI 2.0 正在掀起技术、平台到应用多个层面的革命。如同 Windows 带动了 

**Top 15 模型（按下载量）**:

| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |
|---|------|------|------|------|------|------|------|------|
| 1 | [Yi-6B-Chat](https://modelscope.cn/models/01ai/Yi-6B-Chat) | llama | text-generation | apache-2.0 | 48,061 | 22 | 11.3 GB | 2024-06-26 |
| 2 | [Yi-1.5-34B-Chat](https://modelscope.cn/models/01ai/Yi-1.5-34B-Chat) | llama | text-generation | Apache License 2.0 | 20,851 | 18 | 64.1 GB | 2024-06-27 |
| 3 | [Yi-6B-Chat-4bits](https://modelscope.cn/models/01ai/Yi-6B-Chat-4bits) | llama | text-generation | apache-2.0 | 18,073 | 3 | 3.7 GB | 2024-06-26 |
| 4 | [Yi-1.5-6B-Chat](https://modelscope.cn/models/01ai/Yi-1.5-6B-Chat) | llama | text-generation | Apache License 2.0 | 18,006 | 18 | 11.3 GB | 2024-06-27 |
| 5 | [Yi-34B-Chat-4bits](https://modelscope.cn/models/01ai/Yi-34B-Chat-4bits) | llama | text-generation | apache-2.0 | 17,055 | 38 | 35.8 GB | 2024-06-26 |
| 6 | [Yi-6B](https://modelscope.cn/models/01ai/Yi-6B) | llama | text-generation | apache-2.0 | 14,688 | 121 | 11.3 GB | 2024-06-26 |
| 7 | [Yi-34B-Chat](https://modelscope.cn/models/01ai/Yi-34B-Chat) | llama | text-generation | apache-2.0 | 14,134 | 42 | 64.1 GB | 2024-06-26 |
| 8 | [Yi-VL-6B](https://modelscope.cn/models/01ai/Yi-VL-6B) | llava | visual-question-answering | Apache License 2.0 | 13,669 | 15 | 18.5 GB | 2024-06-27 |
| 9 | [Yi-1.5-6B](https://modelscope.cn/models/01ai/Yi-1.5-6B) | llama | text-generation | Apache License 2.0 | 13,371 | 5 | 11.3 GB | 2024-06-26 |
| 10 | [Yi-1.5-9B-Chat](https://modelscope.cn/models/01ai/Yi-1.5-9B-Chat) | llama | text-generation | Apache License 2.0 | 12,000 | 21 | 16.5 GB | 2024-06-27 |
| 11 | [Yi-34B-200K](https://modelscope.cn/models/01ai/Yi-34B-200K) | llama | text-generation | apache-2.0 | 11,025 | 42 | 64.1 GB | 2024-06-26 |
| 12 | [Yi-VL-34B](https://modelscope.cn/models/01ai/Yi-VL-34B) | llava | visual-question-answering | Apache License 2.0 | 10,076 | 34 | 71.4 GB | 2024-06-27 |
| 13 | [Yi-9B](https://modelscope.cn/models/01ai/Yi-9B) | llama | text-generation | apache-2.0 | 8,701 | 22 | 16.5 GB | 2025-02-26 |
| 14 | [Yi-34B](https://modelscope.cn/models/01ai/Yi-34B) | llama | text-generation | apache-2.0 | 7,141 | 168 | 64.1 GB | 2024-06-26 |
| 15 | [Yi-6B-Chat-8bits](https://modelscope.cn/models/01ai/Yi-6B-Chat-8bits) | llama | text-generation | apache-2.0 | 5,587 | 5 | 6.3 GB | 2025-02-26 |

> 📋 完整 28 个模型清单见 [[ModelScope_Model_Index]]。

---

### 百川智能 (Baichuan)（详见 [[Baichuan_Deep_Dive]]）

| 维度 | 详情 |
|------|------|
| **ModelScope 主页** | [https://modelscope.cn/organization/baichuan-inc](https://modelscope.cn/organization/baichuan-inc) |
| **官方 namespace** | `baichuan-inc` |
| **组织全称** | 百川智能 |
| **GitHub** | https://github.com/baichuan-inc |
| **组织创建时间** | 2023-06-13 |
| **模型总数** | 24 |
| **累计下载** | 1,504,011 |
| **累计收藏** | 932 |
| **总存储** | 1.4 TB |
| **许可证分布** | apache-2.0 (11); other (7); 未标注 (6) |
| **主要模型类型** | baichuan (9), omni (4), qwen3_moe (3), qwen2 (2), baichuan_m1 (2) |
| **主要任务** | text-generation (17), image-text-to-text (2) |
| **主要架构** | BaichuanForCausalLM (8), OmniForCausalLM (4), Qwen3MoeForCausalLM (3), Qwen2ForCausalLM (2), BaichuanM1ForCausalLM (2) |

> 📝 **组织简介**: 集百川之智，共赴山海，欢迎对AI充满激情与梦想的每一位同仁加入，共创美好未来

**Top 15 模型（按下载量）**:

| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |
|---|------|------|------|------|------|------|------|------|
| 1 | [Baichuan2-7B-Chat-4bits](https://modelscope.cn/models/baichuan-inc/Baichuan2-7B-Chat-4bits) | baichuan | text-generation | other | 365,748 | 35 | 5.0 GB | 2025-02-26 |
| 2 | [Baichuan2-7B-Chat](https://modelscope.cn/models/baichuan-inc/Baichuan2-7B-Chat) | baichuan | text-generation | — | 358,199 | 93 | 14.0 GB | 2025-02-26 |
| 3 | [Baichuan2-13B-Chat](https://modelscope.cn/models/baichuan-inc/Baichuan2-13B-Chat) | baichuan | text-generation | other | 263,382 | 251 | 25.9 GB | 2025-02-26 |
| 4 | [Baichuan-M2-32B-GPTQ-Int4](https://modelscope.cn/models/baichuan-inc/Baichuan-M2-32B-GPTQ-Int4) | qwen2 | text-generation | apache-2.0 | 189,675 | 9 | 19.5 GB | 2025-09-03 |
| 5 | [Baichuan2-13B-Chat-4bits](https://modelscope.cn/models/baichuan-inc/Baichuan2-13B-Chat-4bits) | baichuan | text-generation | other | 87,011 | 61 | 8.5 GB | 2025-02-26 |
| 6 | [Baichuan2-7B-Base](https://modelscope.cn/models/baichuan-inc/Baichuan2-7B-Base) | baichuan | text-generation | other | 44,725 | 31 | 14.0 GB | 2025-02-26 |
| 7 | [baichuan-7B](https://modelscope.cn/models/baichuan-inc/baichuan-7B) | baichuan | text-generation | — | 40,789 | 123 | 13.0 GB | 2025-02-26 |
| 8 | [Baichuan2-13B-Base](https://modelscope.cn/models/baichuan-inc/Baichuan2-13B-Base) | baichuan | text-generation | other | 39,416 | 36 | 25.9 GB | 2025-02-26 |
| 9 | [Baichuan-13B-Chat](https://modelscope.cn/models/baichuan-inc/Baichuan-13B-Chat) | baichuan | text-generation | — | 39,235 | 129 | 24.7 GB | 2025-02-26 |
| 10 | [Baichuan-13B-Base](https://modelscope.cn/models/baichuan-inc/Baichuan-13B-Base) | baichuan | text-generation | — | 30,440 | 78 | 24.7 GB | 2025-02-26 |
| 11 | [Baichuan-M2-32B](https://modelscope.cn/models/baichuan-inc/Baichuan-M2-32B) | qwen2 | text-generation | apache-2.0 | 25,194 | 34 | 62.5 GB | 2025-12-24 |
| 12 | [Baichuan-M1-14B-Instruct](https://modelscope.cn/models/baichuan-inc/Baichuan-M1-14B-Instruct) | baichuan_m1 | text-generation | — | 5,269 | 23 | 27.0 GB | 2025-02-20 |
| 13 | [Baichuan-M3-235B](https://modelscope.cn/models/baichuan-inc/Baichuan-M3-235B) | qwen3_moe | text-generation | apache-2.0 | 4,009 | 14 | 439.1 GB | 2026-02-09 |
| 14 | [Baichuan-Audio-Instruct](https://modelscope.cn/models/baichuan-inc/Baichuan-Audio-Instruct) | omni | — | apache-2.0 | 2,674 | 2 | 19.7 GB | 2025-02-25 |
| 15 | [Baichuan-Omni-1d5](https://modelscope.cn/models/baichuan-inc/Baichuan-Omni-1d5) | omni | — | apache-2.0 | 1,621 | 2 | 20.9 GB | 2025-02-08 |

> 📋 完整 24 个模型清单见 [[ModelScope_Model_Index]]。

---

### 阶跃星辰 (StepFun)（详见 [[StepFun_Deep_Dive]]）

| 维度 | 详情 |
|------|------|
| **ModelScope 主页** | [https://modelscope.cn/organization/stepfun-ai](https://modelscope.cn/organization/stepfun-ai) |
| **官方 namespace** | `stepfun-ai` |
| **组织全称** | 阶跃星辰 |
| **组织创建时间** | 2024-09-23 |
| **模型总数** | 57 |
| **累计下载** | 5,815,831 |
| **累计收藏** | 625 |
| **总存储** | 6.2 TB |
| **许可证分布** | apache-2.0 (47); mit (7); 未标注 (2); Apache License 2.0 (1) |
| **主要模型类型** | step3p5 (6), nextstep (6), step_audio_2 (5), qwen2 (5), step1 (4) |
| **主要任务** | image-text-to-text (12), text-generation (6), text-to-speech (5), text-to-image-synthesis (5), image-to-image (4) |
| **主要架构** | Step3p5ForCausalLM (6), LlamaForCausalLM (6), StepAudio2ForCausalLM (5), Qwen2ForCausalLM (5), Step1ForCausalLM (4) |

> 📝 **组织简介**: 欢迎来到 StepFun 🙋 StepFun 成立于 2023 年 4 月，其使命是“为每个人扩大可能性”，它汇集了来自国内外的人工智能顶尖人才，致力于向 AGI 迈进。该公司已经推出了 Step 系列基础模型，其中包括 Step-2（一种尖端的万亿参数混合专家 (MoE) 语言模型）、Step-1.5V（一种强大的多模态大型模型）和 Step-1X（一种创新的图像生成模型）等。

**Top 15 模型（按下载量）**:

| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |
|---|------|------|------|------|------|------|------|------|
| 1 | [Step-3.5-Flash](https://modelscope.cn/models/stepfun-ai/Step-3.5-Flash) | step3p5 | — | apache-2.0 | 3,924,322 | 37 | 371.4 GB | 2026-03-17 |
| 2 | [Step3-VL-10B](https://modelscope.cn/models/stepfun-ai/Step3-VL-10B) | step_robotics | image-text-to-text | apache-2.0 | 1,061,434 | 54 | 0.0 B | 2026-02-04 |
| 3 | [GOT-OCR2_0](https://modelscope.cn/models/stepfun-ai/GOT-OCR2_0) | GOT | image-text-to-text | apache-2.0 | 615,805 | 119 | 1.3 GB | 2025-02-26 |
| 4 | [GOT-OCR-2.0-hf](https://modelscope.cn/models/stepfun-ai/GOT-OCR-2.0-hf) | got_ocr2 | image-text-to-text | apache-2.0 | 38,345 | 9 | 1.1 GB | 2025-02-05 |
| 5 | [Step-Audio-R1](https://modelscope.cn/models/stepfun-ai/Step-Audio-R1) | step_audio_2 | — | apache-2.0 | 22,646 | 6 | 62.4 GB | 2025-12-02 |
| 6 | [stepvideo-t2v](https://modelscope.cn/models/stepfun-ai/stepvideo-t2v) | — | text-to-video-synthesis | mit | 21,015 | 73 | 97.6 GB | 2025-02-26 |
| 7 | [Step-Audio-2-mini](https://modelscope.cn/models/stepfun-ai/Step-Audio-2-mini) | step_audio_2 | any-to-any | apache-2.0 | 18,726 | 35 | 16.7 GB | 2026-02-14 |
| 8 | [Step-3.5-Flash-Base](https://modelscope.cn/models/stepfun-ai/Step-3.5-Flash-Base) | step3p5 | — | apache-2.0 | 18,351 | 4 | 368.4 GB | 2026-03-09 |
| 9 | [Step-Audio-Chat](https://modelscope.cn/models/stepfun-ai/Step-Audio-Chat) | step1 | — | apache-2.0 | 16,095 | 33 | 245.9 GB | 2025-04-23 |
| 10 | [Step-3.7-Flash](https://modelscope.cn/models/stepfun-ai/Step-3.7-Flash) | step3p7 | image-text-to-text | apache-2.0 | 9,279 | 29 | 375.1 GB | 2026-06-03 |
| 11 | [step3](https://modelscope.cn/models/stepfun-ai/step3) | step3_vl | image-text-to-text | apache-2.0 | 8,005 | 19 | 597.9 GB | 2026-01-29 |
| 12 | [Step-Audio-TTS-3B](https://modelscope.cn/models/stepfun-ai/Step-Audio-TTS-3B) | step1 | text-to-speech | apache-2.0 | 6,179 | 44 | 8.6 GB | 2025-04-23 |
| 13 | [Step-Audio-Tokenizer](https://modelscope.cn/models/stepfun-ai/Step-Audio-Tokenizer) | — | text-to-speech | apache-2.0 | 6,057 | 12 | 1.3 GB | 2025-02-18 |
| 14 | [Step1X-Edit](https://modelscope.cn/models/stepfun-ai/Step1X-Edit) | — | image-to-image | apache-2.0 | 4,864 | 24 | 48.9 GB | 2025-07-09 |
| 15 | [GELab-Zero-4B-preview](https://modelscope.cn/models/stepfun-ai/GELab-Zero-4B-preview) | qwen3_vl | image-text-to-text | apache-2.0 | 4,778 | 16 | 8.3 GB | 2025-12-19 |

> 📋 完整 57 个模型清单见 [[ModelScope_Model_Index]]。

---

### 腾讯混元 (Tencent Hunyuan)（详见 [[Tencent_Hunyuan_Deep_Dive]]）

| 维度 | 详情 |
|------|------|
| **ModelScope 主页** | [https://modelscope.cn/organization/Tencent-Hunyuan](https://modelscope.cn/organization/Tencent-Hunyuan) |
| **官方 namespace** | `Tencent-Hunyuan` |
| **组织全称** | 腾讯混元 |
| **组织创建时间** | 2025-06-25 |
| **模型总数** | 84 |
| **累计下载** | 1,636,101 |
| **累计收藏** | 885 |
| **总存储** | 6.5 TB |
| **许可证分布** | 未标注 (42); other (30); apache-2.0 (12) |
| **主要模型类型** | hunyuan_v1_dense (35), hunyuan (6), hy_v3 (4), hunyuan_image_3_moe (3), hunyuan_vl (1) |
| **主要任务** | text-generation (31), translation (18), image-to-3D (10), image-to-video (8), text-to-video-synthesis (3) |
| **主要架构** | HunYuanDenseV1ForCausalLM (35), HunYuanMoEV1ForCausalLM (4), HYV3ForCausalLM (4), HunyuanImage3ForCausalMM (3), HunYuanForCausalLM (2) |

**Top 15 模型（按下载量）**:

| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |
|---|------|------|------|------|------|------|------|------|
| 1 | [HunyuanOCR](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanOCR) | hunyuan_vl | image-text-to-text | other | 1,189,339 | 89 | 1.9 GB | 2025-11-25 |
| 2 | [Hunyuan-A13B-Instruct-FP8](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-A13B-Instruct-FP8) | hunyuan | text-generation | — | 67,850 | 1 | 75.4 GB | 2025-07-08 |
| 3 | [Hunyuan-A13B-Instruct](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-A13B-Instruct) | hunyuan | text-generation | — | 51,037 | 31 | 149.8 GB | 2025-07-08 |
| 4 | [HY-Embodied-0.5](https://modelscope.cn/models/Tencent-Hunyuan/HY-Embodied-0.5) | hunyuan_vl_mot | image-text-to-text | other | 47,559 | 18 | 7.1 GB | 2026-06-16 |
| 5 | [Tencent-Hunyuan-Large](https://modelscope.cn/models/Tencent-Hunyuan/Tencent-Hunyuan-Large) | — | text-generation | other | 43,277 | 6 | 1.8 TB | 2025-06-25 |
| 6 | [HY-World-2.0](https://modelscope.cn/models/Tencent-Hunyuan/HY-World-2.0) | — | image-to-3D | other | 32,131 | 74 | 162.7 GB | 2026-06-17 |
| 7 | [Hunyuan-MT-7B](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-MT-7B) | hunyuan_v1_dense | translation | — | 22,023 | 62 | 15.0 GB | 2025-09-03 |
| 8 | [HY-MT1.5-1.8B](https://modelscope.cn/models/Tencent-Hunyuan/HY-MT1.5-1.8B) | hunyuan_v1_dense | translation | — | 14,248 | 37 | 3.8 GB | 2025-12-30 |
| 9 | [HunyuanVideo-Foley](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanVideo-Foley) | — | audio-generation/text-to-speech | other | 12,414 | 28 | 17.3 GB | 2025-09-29 |
| 10 | [HunyuanVideo-1.5](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanVideo-1.5) | — | text-to-video-synthesis | other | 12,202 | 43 | 346.2 GB | 2026-06-18 |
| 11 | [HunyuanVideo](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanVideo) | — | text-to-video-synthesis | other | 11,147 | 39 | 37.1 GB | 2025-06-25 |
| 12 | [HY-OmniWeaving](https://modelscope.cn/models/Tencent-Hunyuan/HY-OmniWeaving) | — | image-to-video | other | 10,190 | 21 | 51.5 GB | 2026-06-17 |
| 13 | [Hunyuan-MT-Chimera-7B-fp8](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan-MT-Chimera-7B-fp8) | hunyuan_v1_dense | translation | — | 9,153 | 1 | 7.5 GB | 2025-09-03 |
| 14 | [HunyuanWorld-Voyager](https://modelscope.cn/models/Tencent-Hunyuan/HunyuanWorld-Voyager) | — | image-to-video | other | 6,968 | 13 | 80.2 GB | 2026-06-17 |
| 15 | [Hunyuan3D-2](https://modelscope.cn/models/Tencent-Hunyuan/Hunyuan3D-2) | — | image-to-3D | other | 6,609 | 35 | 69.7 GB | 2025-10-17 |

> 📋 完整 84 个模型清单见 [[ModelScope_Model_Index]]。

---

### 上海 AI 实验室 · 书生 (InternLM)（详见 [[InternLM_Deep_Dive]]）

| 维度 | 详情 |
|------|------|
| **ModelScope 主页** | [https://modelscope.cn/brand/view/internlm](https://modelscope.cn/brand/view/internlm) |
| **官方 namespace** | `Shanghai_AI_Laboratory` |
| **组织全称** | 上海人工智能实验室 |
| **GitHub** | https://www.shlab.org.cn/ |
| **组织创建时间** | 2023-08-29 |
| **模型总数** | 443 |
| **累计下载** | 768,670 |
| **累计收藏** | 630 |
| **总存储** | 16.3 TB |
| **许可证分布** | apache-2.0 (205); mit (125); other (65); 未标注 (38) |
| **主要模型类型** | internvl_chat (150), internlm2 (45), internvl (21), qwen2 (16), qwen2_5_vl (13) |
| **主要任务** | image-text-to-text (198), text-generation (73), image-classification (19), text-classification (16), text-to-video-synthesis (11) |
| **主要架构** | InternVLChatModel (146), InternLM2ForCausalLM (35), InternVLForConditionalGeneration (19), LlavaLlamaForCausalLM (15), Qwen2_5_VLForConditionalGeneration (14) |

**Top 15 模型（按下载量）**:

| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |
|---|------|------|------|------|------|------|------|------|
| 1 | [internlm2_5-7b-chat](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm2_5-7b-chat) | internlm2 | text-generation | other | 81,894 | 34 | 14.4 GB | 2025-03-13 |
| 2 | [internlm3-8b-instruct](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm3-8b-instruct) | internlm3 | text-generation | apache-2.0 | 52,811 | 21 | 16.4 GB | 2025-02-26 |
| 3 | [internlm2-chat-20b](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm2-chat-20b) | internlm2 | text-generation | other | 49,690 | 24 | 37.0 GB | 2025-03-13 |
| 4 | [internlm2-chat-20b-sft](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm2-chat-20b-sft) | internlm2 | text-generation | other | 34,502 | 2 | 37.0 GB | 2025-02-26 |
| 5 | [internlm2-chat-7b](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm2-chat-7b) | internlm2 | text-generation | other | 34,039 | 25 | 14.4 GB | 2025-03-13 |
| 6 | [internlm-xcomposer2d5-7b](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-xcomposer2d5-7b) | internlm2 | visual-question-answering | other | 20,428 | 9 | 20.7 GB | 2025-02-26 |
| 7 | [internlm-chat-20b-4bit](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-chat-20b-4bit) | internlm | text-generation | apache-2.0 | 19,361 | 6 | 11.2 GB | 2025-02-26 |
| 8 | [internlm-xcomposer2-vl-7b](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-xcomposer2-vl-7b) | internlmxcomposer2 | visual-question-answering | other | 15,135 | 16 | 16.1 GB | 2025-02-26 |
| 9 | [internlm-20b](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-20b) | internlm | text-generation | apache-2.0 | 14,794 | 74 | 37.4 GB | 2025-02-26 |
| 10 | [EndoCoT](https://modelscope.cn/models/Shanghai_AI_Laboratory/EndoCoT) | — | image-to-image | mit | 14,183 | 0 | 61.2 GB | 2026-04-14 |
| 11 | [internlm-xcomposer2d5-clip](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-xcomposer2d5-clip) | clip_vision_model | — | — | 10,747 | 1 | 1.1 GB | 2025-01-15 |
| 12 | [internlm-chat-7b](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-chat-7b) | internlm | text-generation | — | 9,647 | 10 | 13.6 GB | 2025-02-26 |
| 13 | [internlm-xcomposer-7b-4bit](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-xcomposer-7b-4bit) | InternLMXComposer | text-generation | — | 9,502 | 6 | 6.8 GB | 2025-02-26 |
| 14 | [internlm-xcomposer2-7b](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm-xcomposer2-7b) | internlmxcomposer2 | text-generation | other | 8,341 | 8 | 16.1 GB | 2025-02-26 |
| 15 | [internlm2-chat-1_8b](https://modelscope.cn/models/Shanghai_AI_Laboratory/internlm2-chat-1_8b) | internlm2 | text-generation | other | 8,063 | 14 | 3.5 GB | 2025-03-13 |

> 📋 完整 443 个模型清单见 [[ModelScope_Model_Index]]。

> ℹ️ 书生浦语模型归属上海 AI 实验室 `Shanghai_AI_Laboratory` namespace（品牌页 `internlm`）。

---

### 商汤日日新 (SenseNova)（详见 [[SenseTime_SenseNova_Deep_Dive]]）

| 维度 | 详情 |
|------|------|
| **ModelScope 主页** | [https://modelscope.cn/organization/SenseNova](https://modelscope.cn/organization/SenseNova) |
| **官方 namespace** | `SenseNova` |
| **组织全称** | 商汤日日新 |
| **组织创建时间** | 2025-11-12 |
| **模型总数** | 30 |
| **累计下载** | 29,078 |
| **累计收藏** | 54 |
| **总存储** | 598.1 GB |
| **许可证分布** | apache-2.0 (23); mit (4); 未标注 (3) |
| **主要模型类型** | internvl_chat (9), neo_chat (7), qwen3_vl (4), bert (3), interactiveomni (2) |
| **主要任务** | image-text-to-text (15), any-to-any (7), feature-extraction (2) |
| **主要架构** | InternVLChatModel (9), NEOChatModel (7), Qwen3VLForConditionalGeneration (4), BertModel (3), InteractiveOmniModel (2) |

**Top 15 模型（按下载量）**:

| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |
|---|------|------|------|------|------|------|------|------|
| 1 | [SenseNova-U1-8B-MoT](https://modelscope.cn/models/SenseNova/SenseNova-U1-8B-MoT) | neo_chat | any-to-any | apache-2.0 | 20,740 | 30 | 32.8 GB | 2026-05-16 |
| 2 | [SenseNova-SI-InternVL3-8B](https://modelscope.cn/models/SenseNova/SenseNova-SI-InternVL3-8B) | internvl_chat | image-text-to-text | apache-2.0 | 4,100 | 6 | 14.8 GB | 2025-12-12 |
| 3 | [SenseNova-U1-8B-MoT-Infographic](https://modelscope.cn/models/SenseNova/SenseNova-U1-8B-MoT-Infographic) | neo_chat | any-to-any | apache-2.0 | 668 | 5 | 32.7 GB | 2026-05-16 |
| 4 | [SenseNova-U1-8B-MoT-SFT](https://modelscope.cn/models/SenseNova/SenseNova-U1-8B-MoT-SFT) | neo_chat | any-to-any | apache-2.0 | 427 | 7 | 32.8 GB | 2026-05-15 |
| 5 | [piccolo-base-zh](https://modelscope.cn/models/SenseNova/piccolo-base-zh) | bert | feature-extraction | — | 375 | 0 | 195.7 MB | 2025-11-12 |
| 6 | [SenseNova-U1-8B-MoT-8step-preview](https://modelscope.cn/models/SenseNova/SenseNova-U1-8B-MoT-8step-preview) | neo_chat | any-to-any | apache-2.0 | 267 | 1 | 32.8 GB | 2026-05-15 |
| 7 | [SenseNova-SI-1.1-InternVL3-8B](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.1-InternVL3-8B) | internvl_chat | image-text-to-text | apache-2.0 | 238 | 0 | 14.8 GB | 2026-05-13 |
| 8 | [piccolo-large-zh-v2](https://modelscope.cn/models/SenseNova/piccolo-large-zh-v2) | bert | — | — | 197 | 0 | 4.1 MB | 2025-11-12 |
| 9 | [SenseNova-U1-8B-MoT-LoRAs](https://modelscope.cn/models/SenseNova/SenseNova-U1-8B-MoT-LoRAs) | — | — | apache-2.0 | 196 | 0 | 3.1 GB | 2026-06-16 |
| 10 | [SenseNova-SI-1.1-Qwen3-VL-8B](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.1-Qwen3-VL-8B) | qwen3_vl | image-text-to-text | apache-2.0 | 153 | 0 | 16.3 GB | 2026-05-13 |
| 11 | [SenseNova-SI-1.1-InternVL3-2B](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.1-InternVL3-2B) | internvl_chat | image-text-to-text | apache-2.0 | 145 | 1 | 3.9 GB | 2026-05-13 |
| 12 | [SenseNova-MARS-32B](https://modelscope.cn/models/SenseNova/SenseNova-MARS-32B) | qwen3_vl | image-text-to-text | mit | 127 | 2 | 62.1 GB | 2026-01-29 |
| 13 | [SenseNova-SI-1.2-InternVL3-8B](https://modelscope.cn/models/SenseNova/SenseNova-SI-1.2-InternVL3-8B) | internvl_chat | image-text-to-text | apache-2.0 | 116 | 1 | 14.8 GB | 2026-05-13 |
| 14 | [SenseNova-SI-InternVL3-2B](https://modelscope.cn/models/SenseNova/SenseNova-SI-InternVL3-2B) | internvl_chat | image-text-to-text | apache-2.0 | 115 | 0 | 3.9 GB | 2025-11-24 |
| 15 | [SenseNova-MARS-8B](https://modelscope.cn/models/SenseNova/SenseNova-MARS-8B) | qwen3_vl | image-text-to-text | mit | 113 | 0 | 16.3 GB | 2026-01-29 |

> 📋 完整 30 个模型清单见 [[ModelScope_Model_Index]]。

---

### 昆仑万维 · 天工 (Skywork)

| 维度 | 详情 |
|------|------|
| **ModelScope 主页** | [https://modelscope.cn/organization/Skywork](https://modelscope.cn/organization/Skywork) |
| **官方 namespace** | `Skywork` |
| **组织全称** | 昆仑天工 |
| **GitHub** | https://github.com/SkyworkAI |
| **组织创建时间** | 2023-10-08 |
| **模型总数** | 74 |
| **累计下载** | 360,947 |
| **累计收藏** | 252 |
| **总存储** | 3.2 TB |
| **许可证分布** | mit (22); other (20); apache-2.0 (14); 未标注 (14) |
| **主要模型类型** | qwen2 (7), skywork (6), t2v (5), qwen3 (5), llama (5) |
| **主要任务** | image-to-video (13), text-to-video-synthesis (11), text-classification (10), image-text-to-text (10), any-to-any (10) |
| **主要架构** | SkyworkForCausalLM (7), Qwen2ForCausalLM (7), LlamaForSequenceClassification (5), Qwen3ForSequenceClassification (4), SkyworkR1VChatModel (3) |

**Top 15 模型（按下载量）**:

| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |
|---|------|------|------|------|------|------|------|------|
| 1 | [SkyReels-V2-T2V-14B-720P](https://modelscope.cn/models/Skywork/SkyReels-V2-T2V-14B-720P) | t2v | text-to-video-synthesis | other | 83,987 | 10 | 64.3 GB | 2025-04-25 |
| 2 | [SkyReels-V2-DF-14B-720P](https://modelscope.cn/models/Skywork/SkyReels-V2-DF-14B-720P) | t2v | text-to-video-synthesis | other | 83,797 | 4 | 64.3 GB | 2025-04-25 |
| 3 | [SkyReels-V2-I2V-14B-720P](https://modelscope.cn/models/Skywork/SkyReels-V2-I2V-14B-720P) | i2v | image-to-video | other | 83,675 | 5 | 76.6 GB | 2025-04-25 |
| 4 | [Skywork-Reward-V2-Qwen3-0.6B](https://modelscope.cn/models/Skywork/Skywork-Reward-V2-Qwen3-0.6B) | qwen3 | text-classification | apache-2.0 | 29,438 | 1 | 1.1 GB | 2025-07-07 |
| 5 | [Skywork-R1V-38B](https://modelscope.cn/models/Skywork/Skywork-R1V-38B) | skywork_chat | image-text-to-text | mit | 28,321 | 14 | 71.5 GB | 2025-08-13 |
| 6 | [SkyReels-V2-DF-1.3B-540P](https://modelscope.cn/models/Skywork/SkyReels-V2-DF-1.3B-540P) | t2v | text-to-video-synthesis | other | 6,415 | 6 | 16.4 GB | 2025-04-25 |
| 7 | [Skywork-Reward-V2-Llama-3.1-8B](https://modelscope.cn/models/Skywork/Skywork-Reward-V2-Llama-3.1-8B) | llama | text-classification | llama3.1 | 3,421 | 1 | 14.0 GB | 2025-07-07 |
| 8 | [Skywork-Reward-V2-Qwen3-8B](https://modelscope.cn/models/Skywork/Skywork-Reward-V2-Qwen3-8B) | qwen3 | text-classification | apache-2.0 | 2,916 | 5 | 14.1 GB | 2025-07-07 |
| 9 | [Skywork-13B-base](https://modelscope.cn/models/Skywork/Skywork-13B-base) | skywork | — | — | 2,162 | 63 | 25.8 GB | 2023-11-05 |
| 10 | [SkyReels-V3-R2V-14B](https://modelscope.cn/models/Skywork/SkyReels-V3-R2V-14B) | — | image-to-video | other | 2,123 | 10 | 48.3 GB | 2026-01-28 |
| 11 | [Skywork-VL-Reward-7B](https://modelscope.cn/models/Skywork/Skywork-VL-Reward-7B) | qwen2_5_vl | image-text-to-text | mit | 1,391 | 5 | 15.5 GB | 2025-06-24 |
| 12 | [Skywork-R1V2-38B](https://modelscope.cn/models/Skywork/Skywork-R1V2-38B) | internvl_chat | image-text-to-text | mit | 1,361 | 13 | 71.5 GB | 2025-06-10 |
| 13 | [SkyReels-V2-T2V-14B-540P](https://modelscope.cn/models/Skywork/SkyReels-V2-T2V-14B-540P) | t2v | text-to-video-synthesis | other | 1,278 | 3 | 64.3 GB | 2025-04-25 |
| 14 | [SkyReels-V2-I2V-1.3B-540P](https://modelscope.cn/models/Skywork/SkyReels-V2-I2V-1.3B-540P) | i2v | image-to-video | other | 1,226 | 5 | 21.4 GB | 2025-04-25 |
| 15 | [SkyReels-A1](https://modelscope.cn/models/Skywork/SkyReels-A1) | — | image-to-video | apache-2.0 | 1,169 | 3 | 25.1 GB | 2025-03-04 |

> 📋 完整 74 个模型清单见 [[ModelScope_Model_Index]]。

---

### 月之暗面 (Moonshot AI)（详见 [[Kimi_Moonshot_Deep_Dive]]）

| 维度 | 详情 |
|------|------|
| **ModelScope 主页** | [https://modelscope.cn/organization/moonshotai](https://modelscope.cn/organization/moonshotai) |
| **官方 namespace** | `moonshotai` |
| **组织全称** | Moonshot AI |
| **GitHub** | https://www.moonshot.cn/ |
| **组织创建时间** | 2025-02-23 |
| **模型总数** | 18 |
| **累计下载** | 3,506,128 |
| **累计收藏** | 911 |
| **总存储** | 5.5 TB |
| **许可证分布** | mit (11); other (7) |
| **主要模型类型** | kimi_k2 (4), kimi_vl (3), kimi_k25 (3), deepseek_v3 (2), kimi_linear (2) |
| **主要任务** | text-generation (8), image-text-to-text (6), text-to-speech (2) |
| **主要架构** | DeepseekV3ForCausalLM (6), KimiVLForConditionalGeneration (3), KimiK25ForConditionalGeneration (3), MoonshotKimiaForCausalLM (2), KimiLinearForCausalLM (2) |

**Top 15 模型（按下载量）**:

| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |
|---|------|------|------|------|------|------|------|------|
| 1 | [Kimi-K2-Thinking](https://modelscope.cn/models/moonshotai/Kimi-K2-Thinking) | kimi_k2 | text-generation | other | 1,808,210 | 90 | 553.4 GB | 2026-01-30 |
| 2 | [Kimi-VL-A3B-Thinking](https://modelscope.cn/models/moonshotai/Kimi-VL-A3B-Thinking) | kimi_vl | image-text-to-text | mit | 1,061,843 | 54 | 30.6 GB | 2026-01-30 |
| 3 | [Kimi-K2.6](https://modelscope.cn/models/moonshotai/Kimi-K2.6) | kimi_k25 | image-text-to-text | other | 204,969 | 94 | 554.3 GB | 2026-05-21 |
| 4 | [Kimi-K2.5](https://modelscope.cn/models/moonshotai/Kimi-K2.5) | kimi_k25 | image-text-to-text | other | 146,628 | 279 | 554.3 GB | 2026-04-30 |
| 5 | [Kimi-K2-Instruct](https://modelscope.cn/models/moonshotai/Kimi-K2-Instruct) | kimi_k2 | text-generation | other | 102,560 | 179 | 958.5 GB | 2026-04-23 |
| 6 | [Kimi-VL-A3B-Instruct](https://modelscope.cn/models/moonshotai/Kimi-VL-A3B-Instruct) | kimi_vl | image-text-to-text | mit | 92,800 | 16 | 30.6 GB | 2026-01-30 |
| 7 | [Kimi-Audio-7B-Instruct](https://modelscope.cn/models/moonshotai/Kimi-Audio-7B-Instruct) | — | text-to-speech | mit | 24,162 | 34 | 39.7 GB | 2025-05-29 |
| 8 | [Kimi-Dev-72B](https://modelscope.cn/models/moonshotai/Kimi-Dev-72B) | qwen2 | — | mit | 12,555 | 10 | 135.4 GB | 2025-06-17 |
| 9 | [Kimi-K2-Instruct-0905](https://modelscope.cn/models/moonshotai/Kimi-K2-Instruct-0905) | kimi_k2 | text-generation | other | 12,303 | 81 | 958.5 GB | 2026-01-30 |
| 10 | [Kimi-VL-A3B-Thinking-2506](https://modelscope.cn/models/moonshotai/Kimi-VL-A3B-Thinking-2506) | kimi_vl | image-text-to-text | mit | 7,410 | 13 | 30.6 GB | 2026-01-30 |
| 11 | [Moonlight-16B-A3B-Instruct](https://modelscope.cn/models/moonshotai/Moonlight-16B-A3B-Instruct) | deepseek_v3 | text-generation | mit | 7,259 | 12 | 29.7 GB | 2026-01-30 |
| 12 | [Kimi-K2-Base](https://modelscope.cn/models/moonshotai/Kimi-K2-Base) | kimi_k2 | text-generation | other | 6,737 | 3 | 958.5 GB | 2026-01-30 |
| 13 | [Kimi-Linear-48B-A3B-Instruct](https://modelscope.cn/models/moonshotai/Kimi-Linear-48B-A3B-Instruct) | kimi_linear | text-generation | mit | 6,200 | 20 | 91.5 GB | 2026-01-08 |
| 14 | [Kimi-Audio-7B](https://modelscope.cn/models/moonshotai/Kimi-Audio-7B) | — | text-to-speech | mit | 4,803 | 7 | 39.7 GB | 2025-05-29 |
| 15 | [Kimi-K2.7-Code](https://modelscope.cn/models/moonshotai/Kimi-K2.7-Code) | kimi_k25 | image-text-to-text | other | 4,499 | 17 | 554.3 GB | 2026-06-15 |

> 📋 完整 18 个模型清单见 [[ModelScope_Model_Index]]。

---

### MiniMax (MiniMax)（详见 [[MiniMax_Deep_Dive]]）

| 维度 | 详情 |
|------|------|
| **ModelScope 主页** | [https://modelscope.cn/organization/MiniMax](https://modelscope.cn/organization/MiniMax) |
| **官方 namespace** | `MiniMax` |
| **组织全称** | MiniMax |
| **GitHub** | https://github.com/MiniMax-AI |
| **组织创建时间** | 2025-03-10 |
| **模型总数** | 18 |
| **累计下载** | 1,279,001 |
| **累计收藏** | 680 |
| **总存储** | 7.1 TB |
| **许可证分布** | other (9); apache-2.0 (4); mit (3); 未标注 (2) |
| **主要模型类型** | minimax_m2 (4), qwen2 (3), vtp (3), minimax_m1 (2), minimax_m3_vl (2) |
| **主要任务** | text-generation (12), image-text-to-text (3) |
| **主要架构** | MiniMaxM2ForCausalLM (4), Qwen2ForCausalLM (3), VTPModel (3), MiniMaxM1ForCausalLM (2), MiniMaxM3SparseForConditionalGeneration (2) |

> 📝 **组织简介**: 👋 欢迎来到 MiniMax 的开源组织。在这里，我们与所有人一起构建 AGI，让 AI 对每个人都是可访问的，并负责任地应对未来的挑战。从这里探索我们的最新模型 ➡️➡️➡️➡️   • MiniMax 官方网站： https://www.minimaxi.com/  • MiniMax API 平台：https://www.minimaxi.com/platform_overview  • MiniMax Chat（Text-01 / VL-01）: https://chat.minimaxi.com/

**Top 15 模型（按下载量）**:

| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |
|---|------|------|------|------|------|------|------|------|
| 1 | [MiniMax-M1-80k](https://modelscope.cn/models/MiniMax/MiniMax-M1-80k) | minimax_m1 | text-generation | apache-2.0 | 476,440 | 61 | 849.6 GB | 2025-07-07 |
| 2 | [MiniMax-M2.5](https://modelscope.cn/models/MiniMax/MiniMax-M2.5) | minimax_m2 | text-generation | other | 344,014 | 218 | 214.4 GB | 2026-03-11 |
| 3 | [MiniMax-M2.7](https://modelscope.cn/models/MiniMax/MiniMax-M2.7) | minimax_m2 | text-generation | other | 270,208 | 134 | 214.4 GB | 2026-06-18 |
| 4 | [MiniMax-M2.1](https://modelscope.cn/models/MiniMax/MiniMax-M2.1) | minimax_m2 | text-generation | other | 52,115 | 84 | 214.4 GB | 2026-02-13 |
| 5 | [MiniMax-VL-01](https://modelscope.cn/models/MiniMax/MiniMax-VL-01) | minimax_vl_01 | image-text-to-text | — | 33,604 | 6 | 852.5 GB | 2025-10-27 |
| 6 | [MiniMax-Text-01](https://modelscope.cn/models/MiniMax/MiniMax-Text-01) | minimax_text_01 | text-generation | — | 30,218 | 12 | 851.9 GB | 2025-10-27 |
| 7 | [MiniMax-M3-MXFP8](https://modelscope.cn/models/MiniMax/MiniMax-M3-MXFP8) | minimax_m3_vl | image-text-to-text | other | 25,227 | 2 | 413.3 GB | 2026-06-15 |
| 8 | [MiniMax-M1-40k](https://modelscope.cn/models/MiniMax/MiniMax-M1-40k) | minimax_m1 | text-generation | apache-2.0 | 23,243 | 3 | 849.6 GB | 2025-07-07 |
| 9 | [MiniMax-M2](https://modelscope.cn/models/MiniMax/MiniMax-M2) | minimax_m2 | text-generation | other | 14,881 | 144 | 214.4 GB | 2025-12-23 |
| 10 | [MiniMax-M1-80k-hf](https://modelscope.cn/models/MiniMax/MiniMax-M1-80k-hf) | minimax | text-generation | apache-2.0 | 2,966 | 0 | 849.6 GB | 2025-10-27 |
| 11 | [MiniMax-M1-40k-hf](https://modelscope.cn/models/MiniMax/MiniMax-M1-40k-hf) | minimax | text-generation | apache-2.0 | 2,782 | 0 | 849.6 GB | 2025-10-27 |
| 12 | [MiniMax-M3](https://modelscope.cn/models/MiniMax/MiniMax-M3) | minimax_m3_vl | image-text-to-text | other | 1,476 | 15 | 795.5 GB | 2026-06-16 |
| 13 | [SynLogic-32B](https://modelscope.cn/models/MiniMax/SynLogic-32B) | qwen2 | text-generation | mit | 522 | 1 | 61.0 GB | 2025-06-10 |
| 14 | [SynLogic-7B](https://modelscope.cn/models/MiniMax/SynLogic-7B) | qwen2 | text-generation | mit | 503 | 0 | 14.2 GB | 2025-06-10 |
| 15 | [SynLogic-Mix-3-32B](https://modelscope.cn/models/MiniMax/SynLogic-Mix-3-32B) | qwen2 | text-generation | mit | 438 | 0 | 61.0 GB | 2025-06-10 |

> 📋 完整 18 个模型清单见 [[ModelScope_Model_Index]]。

---

### 科大讯飞 (iFLYTEK)（详见 [[iFlytek_Spark_Deep_Dive]]）

| 维度 | 详情 |
|------|------|
| **ModelScope 主页** | [https://modelscope.cn/organization/iflytek](https://modelscope.cn/organization/iflytek) |
| **官方 namespace** | `iflytek` |
| **组织全称** | 科大讯飞 |
| **GitHub** | https://github.com/iflytek |
| **组织创建时间** | 2025-09-12 |
| **模型总数** | 4 |
| **累计下载** | 75,130 |
| **累计收藏** | 32 |
| **总存储** | 134.6 GB |
| **许可证分布** | Apache License 2.0 (4) |
| **主要模型类型** | spark (3) |
| **主要任务** | text-generation (3) |
| **主要架构** | SparkModel (3) |

> 📝 **组织简介**: 科大讯飞开源工作组，主要将核心框架、工具或数据等项目以商业化友好的License进行开源，加入讯飞开源请大胆联系我们。

**Top 4 模型（按下载量）**:

| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |
|---|------|------|------|------|------|------|------|------|
| 1 | [Spark-Chemistry-X1-13B](https://modelscope.cn/models/iflytek/Spark-Chemistry-X1-13B) | spark | text-generation | Apache License 2.0 | 30,408 | 8 | 49.4 GB | 2025-10-20 |
| 2 | [Spark-Scilit-X1-13B](https://modelscope.cn/models/iflytek/Spark-Scilit-X1-13B) | spark | text-generation | Apache License 2.0 | 24,469 | 8 | 49.4 GB | 2025-10-20 |
| 3 | [AudioFly](https://modelscope.cn/models/iflytek/AudioFly) | — | — | Apache License 2.0 | 20,171 | 16 | 7.7 GB | 2025-09-19 |
| 4 | [Spark-Formalizer-X1-7B](https://modelscope.cn/models/iflytek/Spark-Formalizer-X1-7B) | spark | text-generation | Apache License 2.0 | 82 | 0 | 28.0 GB | 2025-12-08 |

---

### 字节跳动 Seed (ByteDance)（详见 [[ByteDance_Doubao_Deep_Dive]]）

| 维度 | 详情 |
|------|------|
| **ModelScope 主页** | [https://modelscope.cn/organization/ByteDance-Seed](https://modelscope.cn/organization/ByteDance-Seed) |
| **官方 namespace** | `bytedance-community` |
| **组织全称** | bytedance-community |
| **组织创建时间** | 2026-06-05 |
| **模型总数** | 141 |
| **累计下载** | 2,728 |
| **累计收藏** | 3 |
| **总存储** | 5.7 TB |
| **许可证分布** | apache-2.0 (89); mit (12); other (10); openrail++ (9) |
| **主要模型类型** | qwen2 (16), sa2va_chat (11), llama (6), mistral (6), qwen2_vl (5) |
| **主要任务** | text-generation (31), image-text-to-text (22), text-to-image-synthesis (11), image-to-video (8), translation (5) |
| **主要架构** | Qwen2ForCausalLM (14), Sa2VAChatModel (7), Qwen2VLForConditionalGeneration (5), MistralForCausalLM (5), Qwen2_5_VLForConditionalGeneration (4) |

> 📝 **组织简介**: This organization was created as a community mirror to host open artifacts including models and datasets from various organizations eatablished by bytedance on hugging-face.

**Top 15 模型（按下载量）**:

| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |
|---|------|------|------|------|------|------|------|------|
| 1 | [BAGEL-7B-MoT](https://modelscope.cn/models/bytedance-community/BAGEL-7B-MoT) | bagel | any-to-any | apache-2.0 | 948 | 0 | 27.5 GB | 2026-06-05 |
| 2 | [AffineQuant](https://modelscope.cn/models/bytedance-community/AffineQuant) | — | — | apache-2.0 | 147 | 0 | 1.9 TB | 2026-06-06 |
| 3 | [Bernini-Diffusers](https://modelscope.cn/models/bytedance-community/Bernini-Diffusers) | bernini | — | apache-2.0 | 63 | 0 | 179.2 GB | 2026-06-11 |
| 4 | [Bernini-R-Diffusers](https://modelscope.cn/models/bytedance-community/Bernini-R-Diffusers) | bernini_renderer | — | apache-2.0 | 58 | 1 | 117.5 GB | 2026-06-05 |
| 5 | [Bernini-R-1.3B-Diffusers](https://modelscope.cn/models/bytedance-community/Bernini-R-1.3B-Diffusers) | bernini_renderer | — | apache-2.0 | 55 | 0 | 26.9 GB | 2026-06-10 |
| 6 | [UI-TARS-2B-SFT](https://modelscope.cn/models/bytedance-community/UI-TARS-2B-SFT) | qwen2_vl | image-text-to-text | apache-2.0 | 43 | 0 | 9.1 GB | 2026-06-16 |
| 7 | [LatentSync-1.6](https://modelscope.cn/models/bytedance-community/LatentSync-1.6) | — | — | openrail++ | 42 | 1 | 9.0 GB | 2026-06-05 |
| 8 | [UI-TARS-1.5-7B](https://modelscope.cn/models/bytedance-community/UI-TARS-1.5-7B) | qwen2_5_vl | image-text-to-text | apache-2.0 | 41 | 0 | 30.9 GB | 2026-06-05 |
| 9 | [Ouro-2.6B](https://modelscope.cn/models/bytedance-community/Ouro-2.6B) | ouro | text-generation | apache-2.0 | 40 | 0 | 5.0 GB | 2026-06-05 |
| 10 | [Ouro-2.6B-Thinking](https://modelscope.cn/models/bytedance-community/Ouro-2.6B-Thinking) | ouro | text-generation | apache-2.0 | 40 | 0 | 5.0 GB | 2026-06-05 |
| 11 | [ListConRanker](https://modelscope.cn/models/bytedance-community/ListConRanker) | bert | text-ranking | — | 39 | 0 | 1.5 GB | 2026-06-17 |
| 12 | [Hyper-SD](https://modelscope.cn/models/bytedance-community/Hyper-SD) | — | text-to-image-synthesis | — | 38 | 0 | 25.8 GB | 2026-06-05 |
| 13 | [Ouro-1.4B-Thinking](https://modelscope.cn/models/bytedance-community/Ouro-1.4B-Thinking) | ouro | text-generation | apache-2.0 | 38 | 0 | 2.7 GB | 2026-06-05 |
| 14 | [Ouro-1.4B](https://modelscope.cn/models/bytedance-community/Ouro-1.4B) | ouro | text-generation | apache-2.0 | 38 | 0 | 2.7 GB | 2026-06-05 |
| 15 | [Timer-S1](https://modelscope.cn/models/bytedance-community/Timer-S1) | Timer-S1 | — | apache-2.0 | 31 | 0 | 15.5 GB | 2026-06-05 |

> 📋 完整 141 个模型清单见 [[ModelScope_Model_Index]]。

> ⚠️ **注意**: 字节跳动提供的组织主页 `ByteDance-Seed` 下无公开模型；ModelScope 上字节系模型实际发布于 `bytedance-community` namespace，本目录以该 namespace 为准。

---

### 360 智脑 (Qihoo 360)

| 维度 | 详情 |
|------|------|
| **ModelScope 主页** | [https://modelscope.cn/profile/qihoo360](https://modelscope.cn/profile/qihoo360) |
| **官方 namespace** | `qihoo360` |
| **模型总数** | 7 |
| **累计下载** | 2,596 |
| **累计收藏** | 7 |
| **总存储** | 74.6 GB |
| **许可证分布** | apache-2.0 (6); Apache License 2.0 (1) |
| **主要模型类型** | zhinao (7) |
| **主要架构** | ZhinaoForCausalLM (7) |

**Top 7 模型（按下载量）**:

| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |
|---|------|------|------|------|------|------|------|------|
| 1 | [360Zhinao-7B-Chat-360K](https://modelscope.cn/models/qihoo360/360Zhinao-7B-Chat-360K) | zhinao | — | apache-2.0 | 918 | 6 | 14.5 GB | 2024-04-12 |
| 2 | [360Zhinao-7B-Chat-4K](https://modelscope.cn/models/qihoo360/360Zhinao-7B-Chat-4K) | zhinao | — | apache-2.0 | 732 | 0 | 14.5 GB | 2024-04-16 |
| 3 | [360Zhinao-7B-Base](https://modelscope.cn/models/qihoo360/360Zhinao-7B-Base) | zhinao | — | apache-2.0 | 345 | 0 | 14.5 GB | 2024-04-12 |
| 4 | [360Zhinao-7B-Chat-32K](https://modelscope.cn/models/qihoo360/360Zhinao-7B-Chat-32K) | zhinao | — | apache-2.0 | 273 | 0 | 14.5 GB | 2024-04-12 |
| 5 | [360Zhinao-7B-Chat-360K-Int4](https://modelscope.cn/models/qihoo360/360Zhinao-7B-Chat-360K-Int4) | zhinao | — | apache-2.0 | 124 | 0 | 5.6 GB | 2024-04-26 |
| 6 | [360Zhinao-7B-Chat-4K-Int4](https://modelscope.cn/models/qihoo360/360Zhinao-7B-Chat-4K-Int4) | zhinao | — | Apache License 2.0 | 113 | 0 | 5.6 GB | 2024-04-26 |
| 7 | [360Zhinao-7B-Chat-32K-Int4](https://modelscope.cn/models/qihoo360/360Zhinao-7B-Chat-32K-Int4) | zhinao | — | apache-2.0 | 91 | 1 | 5.6 GB | 2024-04-26 |

---

## 跨厂商统计 (Cross-Vendor Stats)

### 许可证分布 (License Distribution)

| 许可证 | 模型数 | 占比 |
|--------|--------|------|
| apache-2.0 | 746 | 46.0% |
| other | 354 | 21.8% |
| mit | 253 | 15.6% |
| 未标注 | 204 | 12.6% |
| Apache License 2.0 | 28 | 1.7% |
| cc-by-nc-4.0 | 10 | 0.6% |
| openrail++ | 9 | 0.6% |
| llama3.1 | 3 | 0.2% |
| MIT License | 2 | 0.1% |
| llama3 | 2 | 0.1% |
| llama3.2 | 2 | 0.1% |
| creativeml-openrail-m | 2 | 0.1% |

### 任务类型分布 (Task Distribution)

| 任务 | 模型数 |
|------|--------|
| text-generation | 653 |
| image-text-to-text | 377 |
| any-to-any | 35 |
| text-classification | 34 |
| text-to-video-synthesis | 34 |
| image-to-video | 33 |
| text-to-image-synthesis | 25 |
| translation | 23 |
| image-classification | 19 |
| text-to-speech | 16 |
| image-to-image | 15 |
| visual-question-answering | 15 |

## 数据说明 (Data Notes)

- 本目录数据抓取自 ModelScope 官方 API（`PUT /api/v1/dolphin/models`），仅含各厂商**官方 namespace** 下发布的模型，已剔除社区量化/微调版本。
- 下载量、收藏量为抓取时点 (2026-06-19) 的累计值，会随时间变化。
- 原始完整数据见 `_sources/modelscope/raw/`。
- 抓取脚本可复跑：`python3 _sources/modelscope/raw/scraper.py`

## 相关文档 (Related)

- [[ModelScope_Model_Index]] — 全量 1,621 个模型的完整索引表
- [[README|中国大模型生态全景]] — 15 家厂商技术路线总览
- [[Chinese_LLM_Comparison_Matrix]] — 全厂商技术/Benchmark 横向对比
- [[Chinese_Open_Source_Top100]] — 中国开源大模型 Top 100

*Data source: [ModelScope](https://modelscope.cn/) · Scraped: 2026-06-19 · Models: 1,621*