---
title: 中国开源大模型生态 Top 100 项目全景 (2026 最新)
category: 05-nlp-llms-chinese-llm-ecosystem
tags: [chinese-llm, open-source, ecosystem, foundation, top100, 2026]
created: 2026-06-15
updated: 2026-06-15
lifecycle: active
tier: supporting
aliases:
  - "Chinese Open Source Top100"
  - Chinese_Open_Source_Top100
sources: []

---
# 中国开源大模型生态 Top 100 项目全景 (2026 最新)

> **一句话理解**: 2026 年中国 AI 开源生态进入"四代同堂"阶段——DeepSeek-V4/Qwen3.6/GLM-5/Kimi-K2.7 四大旗舰同台竞技，Any-to-Any 全模态模型成为新战场，视频生成与语音克隆领跑全球，GitHub 星标总量突破 200 万。

---

## 生态架构总览 (2026 版)

```
中国开源大模型生态架构 2026
│
├──━━ 开源基金会与研究机构
│   ├── 开放原子开源基金会 (OpenAtom) — 工信部主管
│   ├── 北京智源研究院 (BAAI) — FlagOpen 生态
│   ├── 上海人工智能实验室 — OpenGVLab 全栈
│   ├── 鹏城实验室 / 之江实验室
│   ├── 中国科学院体系 (CASIA/ICT)
│   └── 高校实验室 (清华KEG/复旦NLP/哈工大HFL)
│
├──━━ 模型层 — 2026 四大旗舰
│   ├── DeepSeek-V4-Pro/Flash (862B/158B) — 6月最新
│   ├── Qwen3.6 (27B/35B-A3B) — 混合思考+全模态
│   ├── GLM-5/5.1 (435B/382B) — 智谱最新旗舰
│   └── Kimi-K2.7-Code (1.1T) — 月之暗面代码特化
│
├──━━ 新兴赛道 (2025-2026)
│   ├── Any-to-Any 全模态 — Qwen3-Omni / GLM-4.5V
│   ├── 视频生成 — Open-Sora / HunyuanVideo
│   ├── 线性注意力 — Kimi-Linear-48B
│   ├── 投机解码 — Eagle3 (Kimi/DeepSeek 加速)
│   └── OCR 专用 — DeepSeek-OCR-2
│
└──━━ 工具链与平台
    ├── 训练 → 推理 → 微调 → 评测 全栈覆盖
    ├── RAG/Agent 工程化全球领先
    └── 端侧部署生态成熟 (MiniCPM/Qwen3-0.6B)
```

---

## 一、开源基金会与研究机构

### 1. 开放原子开源基金会 (OpenAtom Foundation)

| 项目 | 说明 |
|------|------|
| **全称** | 开放原子开源基金会 (OpenAtom Foundation) |
| **成立** | 2020 年 6 月，民政部注册 |
| **主管** | 中华人民共和国工业和信息化部 (MIIT) |
| **定位** | 中国唯一国家级开源基金会，类似 Linux Foundation 在中国的角色 |
| **核心孵化** | |
| · OpenHarmony | 华为捐赠的物联网/设备操作系统 |
| · openEuler | 华为捐赠的服务器操作系统 |
| · PaddlePaddle (飞桨) | 百度捐赠的深度学习框架（基金会最重要 AI 项目） |
| · OceanBase | 蚂蚁集团捐赠的分布式数据库 |
| **2026 动态** | 新增孵化 3 个 AI 大模型相关项目（待官方公布） |
| **官网** | https://openatom.org |

### 2. 北京智源研究院 (BAAI)

| 项目 | 说明 |
|------|------|
| **全称** | 北京智源人工智能研究院 (Beijing Academy of Artificial Intelligence) |
| **成立** | 2018 年 11 月 |
| **核心项目** | |
| · Aquila | 开源大语言模型系列 |
| · FlagEmbedding (BGE) | 检索增强向量模型 (11.8K ⭐)，MTEB 中文长期领先 |
| · FlagScale | 分布式训练框架 |
| · FlagEval | 大模型评测平台 |
| · FlagOpen | 智源开源社区门户 https://flagopen.baai.ac.cn |
| **2026 动态** | 重点关注 AI Safety 与对齐研究，发布 FlagEval-MM 多模态评测 |
| **官网** | https://www.baai.ac.cn |

### 3. 上海人工智能实验室 (Shanghai AI Lab)

| 项目 | 说明 |
|------|------|
| **全称** | 上海人工智能实验室 (Shanghai AI Lab) |
| **成立** | 2020 年 |
| **核心项目** | |
| · InternLM3 (书生浦语) | 开源大语言模型 (8B)，超长上下文 |
| · InternVL2.5 | 视觉语言多模态模型 (10K ⭐)，开源 VLM 性能领先 |
| · OpenCompass | 大模型评测框架 (7K ⭐)，支持 100+ 数据集 |
| · LMDeploy | 高效推理部署框架 (7.9K ⭐)，吞吐量行业顶尖 |
| · XTuner | 微调工具箱 (5.2K ⭐) |
| · InternEvo | 分布式训练框架 |
| **特色** | 全栈开源：训练(InternEvo) → 模型(InternLM) → 部署(LMDeploy) → 评测(OpenCompass) |
| **官网** | https://www.shlab.org.cn |

### 4. 其他重要研究机构

| 机构 | 关键开源贡献 |
|------|-------------|
| **中国科学院自动化所** | 紫东太初多模态模型 |
| **鹏城实验室** | 鹏城云脑 AI 算力平台 + 开源社区 |
| **之江实验室** | 天枢视觉平台 |
| **清华大学 KEG** | OpenBMB 生态、OpenPrompt、ChatDev |
| **复旦 NLP 实验室** | MOSS 对话模型（中国最早开源对话模型之一）、C-Eval |
| **哈工大讯飞联合实验室** | 中文 RoBERTa、中文 NER |
| **OpenBMB (面壁+清华)** | MiniCPM 系列、CPM 模型、BMTrain |

---

## 二、Top 100 项目完整清单

> GitHub 星标数据截至 2026 年 6 月。⚠️ 标记为高增长项目。🆕 标记为 2025-2026 新增项目。

### A. 基础大模型 LLM (#1-16)

| # | 项目 | 组织 | GitHub ⭐ | 说明 |
|---|------|------|----------|------|
| 1 | **DeepSeek-V3/R4** | 深度求索 | 103.8K ⭐⚠️ | 671B MoE，37B 激活。V3 系列 GitHub 星标王 |
| 2 | **DeepSeek-R1** | 深度求索 | 92K ⭐⚠️ | 推理模型，纯 RL (GRPO) 训练对齐 GPT-o1 |
| 3 | **DeepSeek-V4-Pro** 🆕 | 深度求索 | HF 3.1M 下载 | 862B MoE 旗舰，2026 年 6 月发布，性能对标 GPT-4.5 |
| 4 | **DeepSeek-V4-Flash** 🆕 | 深度求索 | HF 2.1M 下载 | 158B 轻量旗舰，推理成本降低 5× |
| 5 | **Qwen3 系列** | 阿里通义 | 27.3K+ ⭐ | 全尺寸 (0.6B-32B)，HF 下载量超 1.7 亿 |
| 6 | **Qwen3.5/3.6** 🆕 | 阿里通义 | HF 6.4M 下载/版本 | 混合思考模式 + 原生多模态，2026 年 3-4 月发布 |
| 7 | **GLM-4.7/5** 🆕 | 智谱 AI (zai-org) | HF 1M+ 下载 | 358B MoE → GLM-5 (435B)，2026 年最新旗舰 |
| 8 | **ChatGLM 全系列** | 智谱 AI | 40K+ ⭐ | ChatGLM V1/V2/V3，中国最早开源对话模型 |
| 9 | **Kimi-K2 系列** 🆕 | 月之暗面 | HF 2M+ 下载 | K2.7-Code (1.1T)，2026 年 6 月最新 |
| 10 | **Yi-1.5** | 零一万物 | 7.8K ⭐ | 6B/9B/34B，34B 曾登顶 HuggingFace 排行榜 |
| 11 | **InternLM3** | 上海 AI Lab | 7.2K ⭐ | 8B 参数，深度思考模式 |
| 12 | **MiniCPM** | 面壁智能 | 9.4K ⭐ | 端侧 2B/4B 模型，性能媲美 7B |
| 13 | **Baichuan2** | 百川智能 | 4.1K ⭐ | 7B/13B，中文搜索增强 |
| 14 | **Chinese-LLaMA-Alpaca** | CUI Yifan | 19K ⭐ | 最早的中文 LLaMA 适配，社区影响力巨大 |
| 15 | **MOSS** | 复旦 NLP | 12.1K ⭐ | 中国首个开源对话模型，学术意义深远 |
| 16 | **TeleChat** | 中国电信 | 0.8K ⭐ | 央企首个开源 LLM |

### B. 多模态与 Any-to-Any 模型 (#17-24)

| # | 项目 | 组织 | GitHub ⭐ | 说明 |
|---|------|------|----------|------|
| 17 | **Qwen3-VL** 🆕 | 阿里通义 | HF 5.7M 下载 | 2B/4B/8B/32B 全尺寸视觉语言模型 |
| 18 | **MiniCPM-V** | 面壁智能 | 25.6K ⭐⚠️ | 端侧多模态，2B 参数 OCR-Bench 超越 GPT-4V |
| 19 | **InternVL2.5** | 上海 AI Lab | 10.1K ⭐ | 开源 VLM 性能领先，26B 版对标 GPT-4V |
| 20 | **Qwen3-Omni** 🆕 | 阿里通义 | HF 1.3M 下载 | Any-to-Any 全模态：文本+图像+语音+视频统一 |
| 21 | **GLM-4.5V/4.6V** 🆕 | 智谱 AI | HF 95K+ 下载 | 108B 多模态，视觉理解+Flash 轻量版 |
| 22 | **CogVLM/CogAgent** | 智谱 AI | 6.7K ⭐ | 视觉理解与 GUI 智能体 |
| 23 | **Kimi-VL-A3B** 🆕 | 月之暗面 | HF 193K 下载 | 16B MoE 多模态，3B 激活 |
| 24 | **DeepSeek-OCR-2** 🆕 | 深度求索 | HF 1.3M 下载 | 3B 专用 OCR 模型，文档理解能力顶尖 |

### C. 视频生成 (#25-29)

| # | 项目 | 组织 | GitHub ⭐ | 说明 |
|---|------|------|----------|------|
| 25 | **Open-Sora** | ColossalAI/港大 | 29.1K ⭐⚠️ | 开源 Sora 替代方案，文生视频 |
| 26 | **HunyuanVideo** 🆕 | 腾讯 | 12.2K ⭐ | 腾讯开源视频生成模型，质量对标 Sora |
| 27 | **LivePortrait** 🆕 | 快手 (Kwai) | 18.6K ⭐⚠️ | 实时肖像动画生成 |
| 28 | **AnimateDiff** | 上海 AI Lab 等 | 12.1K ⭐ | 基于 Stable Diffusion 的动画生成框架 |
| 29 | **Latte** | 上海 AI Lab | 1.9K ⭐ | 潜在扩散视频生成 |

### D. 图像生成与编辑 (#30-34)

| # | 项目 | 组织 | GitHub ⭐ | 说明 |
|---|------|------|----------|------|
| 30 | **InstantID** 🆕 | InstantX 团队 | 12K ⭐⚠️ | 零样本身份保持图像生成 |
| 31 | **PhotoMaker** 🆕 | 腾讯 ARC | 10.1K ⭐ | 可定制人像生成 |
| 32 | **IP-Adapter** | 上海 AI Lab | 6.6K ⭐ | 图像提示适配器 |
| 33 | **PixArt** 🆕 | 华为诺亚 | 5K+ ⭐ | 高质量文生图扩散模型 |
| 34 | **EVA** | 智源研究院 | 2.7K ⭐ | 视觉基础模型 |

### E. 端侧与边缘模型 (#35-38)

| # | 项目 | 组织 | GitHub ⭐ | 说明 |
|---|------|------|----------|------|
| 35 | **MiniCPM3-4B** | 面壁智能 | 9.4K ⭐ | 4B 参数媲美 GPT-3.5，手机可运行 |
| 36 | **Qwen3-0.6B/1.7B** | 阿里通义 | HF 17.4M 下载 | 超小模型，IoT 和端侧设计 |
| 37 | **MiMo-7B** | 小米 | 2.5K ⭐ | 小米开源推理模型，端侧 RL 验证 |
| 38 | **Kimi-Linear-48B** 🆕 | 月之暗面 | HF 45K 下载 | 线性注意力实验模型，推理复杂度 O(n) |

### F. 训练框架 (#39-45)

| # | 项目 | 组织 | GitHub ⭐ | 说明 |
|---|------|------|----------|------|
| 39 | **PaddlePaddle (飞桨)** | 百度 → 开放原子 | 22K ⭐ | 中国首个开源深度学习框架，适配 30+ 芯片 |
| 40 | **ColossalAI** | 港大/智慧芽 | 41.4K ⭐⚠️ | 大模型并行训练系统 |
| 41 | **DeepSpeed (中文贡献)** | 微软 (30%+ 中国贡献) | 35K+ ⭐ | ZeRO 系列优化核心 |
| 42 | **PaddleNLP** | 百度 | 13K ⭐ | NLP 开发套件，文心系列训练框架 |
| 43 | **MindSpore (昇思)** | 华为 | 4.7K ⭐ | 昇腾原生 AI 框架 |
| 44 | **InternEvo** | 上海 AI Lab | 420 ⭐ | InternLM 训练框架，千卡训练验证 |
| 45 | **BMTrain** | 面壁/清华 | 624 ⭐ | 单机大模型训练系统 |

### G. 推理部署引擎 (#46-53)

| # | 项目 | 组织 | GitHub ⭐ | 说明 |
|---|------|------|----------|------|
| 46 | **vLLM** | UCB (中国贡献者众多) | 30K+ ⭐⚠️ | PagedAttention 核心 |
| 47 | **SGLang** 🆕 | UCB + 中国研究者 | 15K+ ⭐⚠️ | RadixAttention，DeepSeek 团队深度参与 |
| 48 | **LMDeploy** | 上海 AI Lab | 7.9K ⭐ | H100 吞吐量 16K tok/s |
| 49 | **ncnn** | 腾讯 | 20.5K ⭐ | 移动端推理框架（老牌旗舰） |
| 50 | **MNN** | 阿里 | 9K+ ⭐ | 移动端推理框架 |
| 51 | **TensorRT-LLM** | NVIDIA (中国团队) | 12K+ ⭐ | 官方推理加速 |
| 52 | **Paddle-Lite** | 百度 | 7.5K ⭐ | 飞桨轻量化推理引擎 |
| 53 | **Xinference** | 篝火智能 | 6K+ ⭐ | 分布式多模型推理平台 |

### H. 微调工具 (#54-58)

| # | 项目 | 组织 | GitHub ⭐ | 说明 |
|---|------|------|----------|------|
| 54 | **LLaMA-Factory** | hiyouga | 72.2K ⭐⚠️⚠️ | 最流行 LLM 微调工具，零代码微调 100+ 模型 |
| 55 | **ms-swift** | ModelScope | 14.5K ⭐ | 魔搭官方微调+推理一体化 |
| 56 | **XTuner** | 上海 AI Lab | 5.2K ⭐ | 支持 InternLM/GLM/Qwen 全系列 |
| 57 | **OpenPrompt** | 清华 KEG | 4.9K ⭐ | 提示学习工具包 |
| 58 | **firefly** | Yeung Ngo | 3.8K ⭐ | 中文 LLM 微调方案 |

### I. RAG 与知识增强 (#59-68)

| # | 项目 | 组织 | GitHub ⭐ | 说明 |
|---|------|------|----------|------|
| 59 | **Dify** | LangGenius | 95K+ ⭐⚠️⚠️ | LLM 应用开发平台，GitHub 星标第一 |
| 60 | **RAGFlow** | InfiniFlow | 82.7K ⭐⚠️⚠️ | 开源 RAG 引擎，深度文档理解 |
| 61 | **Langchain-Chatchat** | timqian | 32K ⭐ | 中文 Langchain 本地问答 |
| 62 | **QAnything** | 网易有道 | 14K ⭐ | 有道问答系统 |
| 63 | **MaxKB** | 1Panel | 12K+ ⭐ | 知识库问答系统 |
| 64 | **bisheng (毕昇)** | 数据元素 | 11.5K ⭐ | 企业级 LLM 应用开发平台 |
| 65 | **FlagEmbedding (BGE)** | 智源研究院 | 11.8K ⭐ | 中文检索增强向量模型，MTEB 长期领先 |
| 66 | **Chinese-Word-Vectors** | 中文 NLP 社区 | 8K+ ⭐ | 中文词向量预训练 |
| 67 | **Text2Vec** | shibing624 | 5K ⭐ | 中文文本向量化 |
| 68 | **BCEmbedding** | 网易有道 | 1.9K ⭐ | 中英双语 Embedding |

### J. Agent 框架 (#69-75)

| # | 项目 | 组织 | GitHub ⭐ | 说明 |
|---|------|------|----------|------|
| 69 | **MetaGPT** | DeepWisdom | 68.8K ⭐⚠️ | 多智能体框架，模拟软件公司协作 |
| 70 | **ChatDev** | 面壁/清华 | 33.4K ⭐ | 沟通式开发，多 Agent 合作编程 |
| 71 | **Qwen-Agent** | 阿里通义 | 16.5K ⭐ | 通义千问官方 Agent 框架 |
| 72 | **XAgent** | 清华 KEG | 8K+ ⭐ | 自动 Agent 系统 |
| 73 | **AgentVerse** | 清华 | 1.8K ⭐ | 多智能体仿真平台 |
| 74 | **camel (中文贡献)** | KAUST | 12K+ ⭐ | 角色扮演 Agent |
| 75 | **Eagle3** 🆕 | lightseekorg | HF 46K 下载 | 投机解码框架，Kimi-K2.6/DeepSeek 推理加速 3× |

### K. 语音 AI (#76-81)

| # | 项目 | 组织 | GitHub ⭐ | 说明 |
|---|------|------|----------|------|
| 76 | **GPT-SoVITS** | RVC-Boss | 58.7K ⭐⚠️⚠️ | 少样本语音克隆，全球最火开源 TTS |
| 77 | **ChatTTS** | 2noise | 39.5K ⭐⚠️ | 对话场景 TTS，自然度极高 |
| 78 | **FunASR** | 阿里达摩院 | 18K ⭐ | 中文 ASR 最佳工具包 |
| 79 | **CosyVoice** | 阿里 | 5K+ ⭐ | 多语言 TTS，支持情感控制 |
| 80 | **Kimi-Audio-7B** 🆕 | 月之暗面 | HF 53K 下载 | 语音理解+生成统一模型 |
| 81 | **Qwen3-TTS** 🆕 | 阿里通义 | HF 1.4M 下载 | Qwen 系列原生 TTS，支持自定义音色 |

### L. 数据与评测 (#82-89)

| # | 项目 | 组织 | GitHub ⭐ | 说明 |
|---|------|------|----------|------|
| 82 | **OpenCompass** | 上海 AI Lab | 7.1K ⭐ | 全面的大模型评测框架，支持 100+ 数据集 |
| 83 | **C-Eval** | 上交/清华/爱丁堡 | 7K+ ⭐ | 中文评测基准，覆盖 52 个学科 |
| 84 | **BELLE** | 袁行舟 | 8K+ ⭐ | 中文指令微调数据集 |
| 85 | **CMMLU** | 上交 | 2K+ ⭐ | 中文多任务语言理解 |
| 86 | **COIG** | 智源/社区 | 1K+ ⭐ | 中文开源指令数据集 |
| 87 | **LongBench** | 智谱 AI | 1.2K ⭐ | 长文本理解评测 |
| 88 | **FlagEval** | 智源研究院 | 1.5K ⭐ | 多维度评测平台 |
| 89 | **AGIEval** | 微软研究院 | 1.5K ⭐ | 人类级别任务评测 |

### M. 平台与社区 (#90-100)

| # | 项目 | 组织 | 说明 |
|---|------|------|------|
| 90 | **ModelScope (魔搭)** | 阿里达摩院 | 9K ⭐ — 中国版 Hugging Face，模型+数据集+Pipeline |
| 91 | **OpenI (启智社区)** | 鹏城实验室 | 国产 AI 开源社区 + 免费 GPU 算力 |
| 92 | **FlagOpen** | 智源研究院 | 智源开源社区门户 |
| 93 | **hf-mirror** | 社区 | 3K+ ⭐ — Hugging Face 中国镜像站 |
| 94 | **Gitee AI** | 开源中国 | 国产 Git 托管 + 模型托管 |
| 95 | **awesome-chinese-llm** | 社区 | 15K+ ⭐⚠️ — 中国大模型资源精选列表 |
| 96 | **Chinese-NLP-Resources** | 社区 | 5K+ ⭐ — 中文 NLP 资源汇总 |
| 97 | **Qwen3-Embedding** 🆕 | 阿里通义 | HF 6.6M 下载 — 0.6B/4B/8B 三档向量模型 |
| 98 | **Qwen3-Coder** 🆕 | 阿里通义 | HF 1.4M 下载 — 30B-A3B MoE 代码模型 |
| 99 | **DeepSeek-Coder-V2** | 深度求索 | 734K HF 下载 — 代码生成专用 |
| 100 | **CodeGeeX** | 智谱 AI | 7.6K ⭐ — 代码补全与生成 |

---

## 三、2026 模型代际对比

### 3.1 四大旗舰模型演进路线

```
中国开源大模型代际演进 (2023→2026)

DeepSeek 路线:
  V2 (2024.05) → V3 (2024.12) → R1 (2025.01) → V3.1 (2025.09)
    → V3.2 (2025.12) → V4-Pro/Flash (2026.06) ← 当前
  技术特征: MLA + MoE + FP8 训练 → GRPO 纯 RL 对齐

Qwen 路线:
  Qwen1 (2023.11) → Qwen2 (2024.06) → Qwen2.5 (2024.09)
    → Qwen3 (2025.07) → Qwen3.5 (2026.03) → Qwen3.6 (2026.04) ← 当前
  技术特征: 全尺寸覆盖 → 混合思考 → 原生多模态 (Omni)

GLM 路线:
  ChatGLM (2023.03) → GLM-4 (2024.01) → GLM-4.5 (2025.08)
    → GLM-4.7 (2026.01) → GLM-5 (2026.04) → GLM-5.1 (2026.05) ← 当前
  技术特征: GLM 框架 → MoE → 多模态 → 全模态 Agent

Kimi 路线:
  Moonshot-v1 (2023.10) → Kimi-VL (2025.01) → K2-Instruct (2025.04)
    → K2.5 (2026.04) → K2.6 (2026.05) → K2.7-Code (2026.06) ← 当前
  技术特征: 长上下文 → MuonClip → 线性注意力实验
```

### 3.2 GitHub 星标 Top 20 (2026 年 6 月)

```
 #   项目                  ⭐         类别
━━━ ━━━━━━━━━━━━━━━━━━━━ ━━━━━━━━━ ━━━━━━━━━━
 1   Dify                  95K+      应用平台
 2   DeepSeek-V3/R4        103.8K    基础模型
 3   DeepSeek-R1           92K       推理模型
 4   RAGFlow               82.7K     RAG引擎
 5   LLaMA-Factory         72.2K     微调工具
 6   MetaGPT               68.8K     Agent框架
 7   GPT-SoVITS            58.7K     语音克隆
 8   ChatDev               33.4K     Agent框架
 9   Langchain-Chatchat    32K       RAG问答
10   Open-Sora             29.1K     视频生成
11   vLLM                  30K+      推理引擎
12   Qwen3                 27.3K+    基础模型
13   MiniCPM-V             25.6K     多模态
14   Chinese-LLaMA-Alpaca  19K       中文适配
15   LivePortrait          18.6K     肖像动画
16   FunASR                18K       语音识别
17   Qwen-Agent            16.5K     Agent框架
18   Qwen3-Coder           16.6K     代码模型
19   SGLang                15K+      推理引擎
20   ms-swift              14.5K     微调框架
```

---

## 四、2026 年新兴技术趋势

### 4.1 Any-to-Any 全模态模型

```
2026 年最重要的架构转变: 从"多模态理解"到"全模态交互"

传统多模态 (2024):
  输入: 图像 + 文本 → 输出: 文本
  模型: MiniCPM-V, InternVL, Qwen2-VL

Any-to-Any (2026):
  输入: 文本 + 图像 + 语音 + 视频 + 代码
  输出: 文本 + 图像 + 语音 + 视频 + 代码
  模型: Qwen3-Omni, GLM-5, Kimi-K2.7

代表项目:
  ├── Qwen3-Omni-30B (阿里) — 全模态统一编码器
  │   HF 下载: 1.3M+
  ├── GLM-5 (智谱) — Agent 优先的全模态设计
  │   参数: 435B MoE
  ├── Kimi-K2.7-Code — 代码+多模态融合
  │   参数: 1.1T MoE
  └── DeepSeek-OCR-2 — 文档理解专用
      HF 下载: 1.3M+
```

### 4.2 投机解码 (Speculative Decoding)

| 项目 | 说明 |
|------|------|
| **Eagle3** | lightseekorg 开源，为 Kimi-K2.6/K2.5 和 DeepSeek 提供投机解码 |
| **原理** | 小模型（Draft Model）快速生成候选 token，大模型批量验证 |
| **效果** | Kimi-K2.6 推理速度提升 3×，吞吐量增加 2.5× |
| **HF 下载** | Eagle3 系列累计 46 万+ |

### 4.3 线性注意力实验

```
Kimi-Linear-48B — 2025年12月发布

传统 Transformer 注意力: O(n²) 复杂度
线性注意力: O(n) 复杂度

意义:
  ├── 超长序列 (>1M tokens) 推理成本大幅下降
  ├── KV Cache 从 GB 级降至 MB 级
  └── 为下一代万亿参数模型铺路

状态: 实验性质，性能接近同规模标准模型
```

### 4.4 FP4 量化成为标准

```
2026 量化精度演进:

2024: FP16 → FP8 (DeepSeek-V3 验证)
2025: FP8 → INT4 (AWQ/GPTQ)
2026: INT4 → FP4 (NVFP4/MXFP4)

代表:
  ├── nvidia/DeepSeek-R1-NVFP4 (394B → 1/2 显存)
  ├── nvidia/GLM-5-NVFP4 (435B → 可单机部署)
  ├── nvidia/Kimi-K2.6-NVFP4 (无损质量)
  └── amd/Kimi-K2.5-MXFP4 (AMD 平台适配)
```

### 4.5 中国开源 AI 独特优势 (2026 更新)

```
┌─────────────────────────────────────────────────────────┐
│  1. 工程效率碾压                                         │
│     DeepSeek-V4 训练成本 < $10M (GPT-4 估 $100M+)     │
│     MoE 架构被全球模仿 (Mistral/Llama/Xai)              │
│                                                          │
│  2. 端侧部署全球领先                                     │
│     MiniCPM 2B → 手机原生运行                            │
│     Qwen3-0.6B → IoT 设备嵌入                            │
│     ncnn/MNN → 移动端推理标准                            │
│                                                          │
│  3. RAG/Agent 工程化                                     │
│     Dify (95K⭐) + RAGFlow (83K⭐) 超越 Langchain       │
│     MetaGPT (69K⭐) 定义多 Agent 协作范式               │
│                                                          │
│  4. 语音 AI 全球霸主                                     │
│     GPT-SoVITS — 全球最火开源 TTS                       │
│     FunASR — 中文 ASR 准确率最高                         │
│                                                          │
│  5. 视频生成快速追赶                                     │
│     Open-Sora + HunyuanVideo → 对标 Sora               │
│     LivePortrait → 肖像动画标杆                          │
└─────────────────────────────────────────────────────────┘
```

### 4.6 国产芯片开源适配 (2026 更新)

| 框架/工具 | 昇腾 910B/C | 海光 DCU | 寒武纪 | 壁仞 | 摩尔线程 |
|-----------|-------------|----------|--------|------|----------|
| **PaddlePaddle** | ✅ 原生 | ✅ | ✅ | ✅ | ✅ |
| **MindSpore** | ✅ 原生 | ❌ | ❌ | ❌ | ❌ |
| **PyTorch** | ✅ 适配层 | ✅ ROCm | ✅ | ✅ | ✅ |
| **vLLM** | ⚡ 移植中 | ✅ | ❌ | ❌ | ❌ |
| **SGLang** | ❌ | ✅ | ❌ | ❌ | ❌ |
| **FlashMLA** | ❌ | ✅ 移植 | ❌ | ❌ | ❌ |

> 详细芯片对比参见 [[01_数学基础/10_AI_Hardware/Chinese_AI_Chips_Deep_Dive]]

---

## 五、开发者参与指南

### 5.1 2026 版选型决策树

```
你的需求是什么?
│
├── 通用对话 LLM
│   ├── 旗舰级 → DeepSeek-V4-Pro / Qwen3.6-27B / GLM-5
│   ├── 性价比 → DeepSeek-V4-Flash / Qwen3.6-35B-A3B
│   └── 中文专精 → GLM-4.7-Flash / Baichuan2
│
├── 推理模型
│   └── DeepSeek-R1 (纯 RL 对齐，性能对标 o1)
│
├── 代码生成
│   ├── 旗舰 → Kimi-K2.7-Code (1.1T) / Qwen3-Coder-30B
│   └── 轻量 → DeepSeek-Coder-V2-Lite / CodeGeeX
│
├── 多模态
│   ├── 全模态 → Qwen3-Omni (Any-to-Any)
│   ├── 视觉理解 → Qwen3-VL / InternVL2.5 / MiniCPM-V
│   └── OCR → DeepSeek-OCR-2
│
├── 视频生成
│   ├── 文生视频 → Open-Sora / HunyuanVideo
│   └── 肖像动画 → LivePortrait
│
├── 语音 AI
│   ├── 语音克隆 → GPT-SoVITS (1分钟克隆)
│   ├── 对话 TTS → ChatTTS / Qwen3-TTS
│   ├── 语音识别 → FunASR / SenseVoice
│   └── 统一模型 → Kimi-Audio-7B
│
├── 微调
│   ├── 零代码 → LLaMA-Factory (72K⭐)
│   ├── 代码级 → ms-swift / XTuner
│   └── 提示学习 → OpenPrompt
│
├── 推理部署
│   ├── 高吞吐 → vLLM / SGLang / LMDeploy
│   ├── 加速 → Eagle3 (投机解码 3×)
│   ├── 移动端 → ncnn / MNN
│   └── 多模型 → Xinference
│
├── RAG 应用
│   ├── 全栈平台 → Dify (95K⭐) / Bisheng / MaxKB
│   ├── RAG 引擎 → RAGFlow (83K⭐) / QAnything
│   └── Embedding → FlagEmbedding / Qwen3-Embedding
│
├── Agent 开发
│   ├── 多智能体 → MetaGPT (69K⭐) / ChatDev
│   └── 官方框架 → Qwen-Agent
│
└── 端侧部署
    ├── 2B 级 → MiniCPM3 (媲美 GPT-3.5)
    ├── 1B 级 → Qwen3-1.7B
    └── 亚 1B → Qwen3-0.6B (IoT 可用)
```

### 5.2 社区贡献入口

| 社区/平台 | 定位 | 2026 新特性 |
|-----------|------|------------|
| **ModelScope (魔搭)** | 模型托管 + 数据集 | 支持 Qwen3 全系列托管和在线体验 |
| **OpenI (启智)** | 算力+开源协作 | 免费昇腾算力申请 |
| **FlagOpen (智源)** | 基础研究开源 | BGE 系列持续更新 |
| **HuggingFace** | 国际化展示 | DeepSeek/Qwen/GLM/Kimi 均在 HF 发布 |
| **hf-mirror** | HF 中国镜像 | 下载加速 10× |

---

## 六、信息来源

### 开源基金会
- 开放原子开源基金会: https://openatom.org
- 智源研究院 FlagOpen: https://flagopen.baai.ac.cn
- 上海 AI Lab OpenGVLab: https://github.com/OpenGVLab

### 主要社区
- ModelScope 魔搭社区: https://modelscope.cn
- 启智社区: https://openi.org.cn

### GitHub / HuggingFace 组织
- DeepSeek: https://github.com/deepseek-ai / https://huggingface.co/deepseek-ai
- Qwen: https://github.com/QwenLM / https://huggingface.co/Qwen
- GLM (智谱): https://github.com/THUDM / https://huggingface.co/zai-org
- Kimi (月之暗面): https://huggingface.co/moonshotai
- InternLM: https://github.com/InternLM
- OpenBMB (面壁): https://github.com/OpenBMB
- OpenMOSS (复旦): https://github.com/OpenMOSS

### Wiki 内部参考
- [[05_大模型/15_Chinese_LLM_Ecosystem/README]] — 中国大模型生态全景
- [[05_大模型/15_Chinese_LLM_Ecosystem/Chinese_LLM_Comparison_Matrix]] — 全厂商对比矩阵
- [[05_大模型/15_Chinese_LLM_Ecosystem/DeepSeek_Deep_Dive]] — DeepSeek 深度解析
- [[05_大模型/15_Chinese_LLM_Ecosystem/Qwen_Deep_Dive]] — 通义千问深度解析
- [[05_大模型/15_Chinese_LLM_Ecosystem/GLM_Zhipu_Deep_Dive]] — 智谱 GLM 深度解析
- [[05_大模型/15_Chinese_LLM_Ecosystem/Kimi_Moonshot_Deep_Dive]] — Kimi 深度解析
- [[05_大模型/15_Chinese_LLM_Ecosystem/InternLM_Deep_Dive]] — 书生浦语深度解析
- [[05_大模型/15_Chinese_LLM_Ecosystem/Chinese_LLM_Training_Inference_Platforms]] — 训推平台实战
- [[05_大模型/GenAI_L16_Open_Source_Models_and_Hugging_Face]] — 开源模型与 Hugging Face
- [[01_数学基础/10_AI_Hardware/Chinese_AI_Chips_Deep_Dive]] — 国产 AI 芯片

---

*Last updated: 2026-06-15* (Updated with DeepSeek-V4, Qwen3.6, GLM-5, Kimi-K2.7 and new categories)
