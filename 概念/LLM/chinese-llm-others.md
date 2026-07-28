---
title: "国产次主流大模型合并卡 (百度文心 / 华为盘古 / 昆仑天工 / 智源悟道 / CodeGeeX)"
category: concepts
tags:
  - llm
  - chinese-llm
  - ernie
  - wenxin
  - baidu
  - huawei
  - pangu
  - tiankong
  - wudao
  - codegeex
  - bge
aliases:
  - Chinese LLM Others
  - 百度文心 / ERNIE 4.5 / X1
  - 华为盘古 / Pangu
  - 昆仑天工 / Skywork
  - 智源悟道 / WuDao
  - CodeGeeX
  - BGE 嵌入
relationships:
  - target: "概念/qwen-series"
    type: related_to
  - target: "概念/glm-4-5-series"
    type: related_to
  - target: "概念/deepseek-series"
    type: related_to
  - target: "概念/yi-series"
    type: related_to
summary: "国产大模型生态"二线主力"综合卡——百度文心 4.5(2025-03)/ X1 深度思考、华为盘古 5.0 NLP/多模态/科学计算、昆仑天工 Skywork 4(11 个 100B+ 任务专家)、智源悟道 3.0(全球最大 1.8T MoE)、CodeGeeX4(代码多语言)。这些模型覆盖了 Qwen/DeepSeek/GLM/Doubao 之外的关键生态位。"
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources: []
name_zh: "国产次主流大模型合并卡"
---

# 国产次主流大模型合并卡

> 中文简称：国产次主流大模型合并卡

> **一句话理解**:除"五虎"(Qwen / DeepSeek / GLM / Doubao / Hunyuan)之外的国产 LLM 重要玩家——百度文心(国内首个对标 GPT-4 的闭源旗舰 + 2025-03 全面开源)、华为盘古(政企 + 行业大模型)、昆仑天工(天工 Skywork 多任务专家矩阵)、智源悟道(超大规模 MoE 先行者)、CodeGeeX(代码 + 智谱家族)。理解它们就理解了国产 LLM 生态的"全光谱"。

---

## 一、本卡覆盖范围

| 家族 | 公司 | 关键特征 |
|---|---|---|
| **百度文心 ERNIE** | 百度(Baidu) | 国内首个对标 GPT-4 闭源旗舰;2025-03 4.5 + X1 深度思考版开源 |
| **华为盘古 Pangu** | 华为(Huawei) | 政企 + 行业(矿山大模型、气象大模型、药物大模型) |
| **昆仑天工 Skywork** | 昆仑万维(Kunlun Inc.) | 11 个 100B+ 任务专家矩阵;开源 Skywork-OR1 推理模型 |
| **智源悟道 WuDao** | 智源研究院(BAAI) | 全球首个 1.75T 参数 MoE(悟道 2.0);悟道 3.0 多模态 |
| **CodeGeeX** | 智谱 + 浦育 | 智谱家族代码版;多语言代码生成/补全 |
| **BGE 嵌入** | 智源研究院 | 中文最强开源嵌入(Embedding)系列 |

---

## 二、百度文心 / ERNIE 系列

### 2.1 公司与团队背景

| 维度 | 信息 |
|---|---|
| **公司** | 百度(Baidu,中国北京) |
| **核心团队** | 百度 NLP 部门(王海峰领衔) |
| **首发时间** | ERNIE 1.0(2019-04,中文 BERT-style 预训练) |
| **关键里程碑** | 2023-03 ERNIE Bot(文心一言)对标 GPT-3.5/4 |
| **2025-03 重大变革** | 4.5 + X1 全面开源(Apache 2.0 试点) |
| **API/平台** | [qianfan.cloud.baidu.com](https://qianfan.cloud.baidu.com/)(千帆大模型平台) |
| **2026 估值影响** | 百度文心生态接入客户 10 万+ |

### 2.2 关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 知识增强 | Knowledge-Enhanced | 用知识图谱/实体信息增强预训练 |
| 持续学习 | Continual Learning | 持续吸收新数据,避免灾难性遗忘 |
| 检索增强 | Retrieval-Augmented | 外挂知识库,典型 RAG 范式 |
| 深度思考 | Deep Thinking | 类 o1 模式的强化学习推理 |
| 异构专家 | Heterogeneous MoE | 不同专家使用不同结构(Attention/SSM/Dense) |
| 动态注意力掩码 | FlashMask | 百度自研稀疏注意力,4.5 引入 |
| 多模态 | Multimodal | 文本/图像/视频/音频联合处理 |
| 内容审核 | Content Moderation | 符合国内合规的安全过滤 |

### 2.3 文心代际演进

- **ERNIE 1.0/2.0/3.0**(2019-2021):中文 BERT/RoBERTa 时代,引入知识掩码。
- **ERNIE-ViL**(2021):视觉语言预训练。
- **ERNIE 3.0 Titan**(2022-12):260B 参数,中文 SOTA。
- **ERNIE Bot / 文心一言**(2023-03):对标 ChatGPT,国内首个。
- **ERNIE 4.0 Turbo**(2024-04):长上下文 + 工具调用 + 闭源旗舰。
- **ERNIE 4.5 / X1**(2025-03,关键转折点):
  - **ERNIE 4.5**:多模态异构 MoE,文本/视觉/音频联合训练。
    - **旗舰参数 424B 总参 / 47B active MoE**;**开源 Apache 2.0**。
    - **FlashMask 动态注意力掩码**:长上下文推理显存降 40%。
    - 在中文 C-Eval 89.3%、CMMLU 88.7% 登顶;数学 MATH 86.0% 超 GPT-4o。
  - **ERNIE X1**:类 o1 深度思考模型,**RL + 过程奖励** 训练,长 CoT。
    - 与 4.5 同级别性能,但 token 消耗高 3-5 倍,适合复杂推理。
    - 同步开源 + 闭源双轨。
  - 论文/技术报告:[yiyan.baidu.com/blog](https://yiyan.baidu.com/blog) 公开。
- **ERNIE 5.0**(2025-12,路线图):据 2026 Q1 内部消息,将推 **1T MoE**,原生 1M 上下文,聚焦"超级智能体"。

### 2.4 模型矩阵(2026-02 快照)

| 模型 | 总/激活参数 | 上下文 | 模态 | 许可证 | 定位 |
|---|---|---|---|---|---|
| **ERNIE-4.5-300B-A47B** | 424B / 47B | 128K | 文本+图像+音频 | Apache 2.0 | 开源旗舰 |
| **ERNIE-4.5-21B-A3B** | 21B / 3B | 128K | 文本+图像 | Apache 2.0 | 端侧大杯 |
| **ERNIE-X1** | 未公开 | 128K | 文本+多模态 | 闭源 + 有限开源 | 深度思考 |
| **ERNIE 4.0 Turbo** | 未公开 | 128K | 文本 | 闭源 | 闭源旗舰 |
| **ERNIE Speed/Lite/Tiny** | 8B/70B/未公开 | 8K-32K | 文本 | 闭源 | 端侧/快速 |

### 2.5 关键能力

- **FlashMask**:动态注意力掩码,长文本推理显存降 40%,吞吐量提升 2-3 倍。
- **异构 MoE**:不同模态/任务专家使用不同架构(Dense/Attention/SSM),总参数 1T 但激活 47B。
- **中文 SOTA**:在 C-Eval、CMMLU、GAOKAR 等中文榜单长期 Top 3。
- **深度思考 X1**:类 o1,数学/代码/规划任务 SOTA。

---

## 三、华为盘古 / Pangu 系列

### 3.1 公司与团队背景

| 维度 | 信息 |
|---|---|
| **公司** | 华为(Huawei,中国深圳) |
| **核心团队** | 2012 实验室(田奇领衔) + 诺亚方舟 |
| **2021-04** | 盘古大模型首次发布(中文 NLP) |
| **2023-07** | 盘古 3.0:五大行业模型(NLP/视觉/多模态/科学计算/预测) |
| **2024-06** | 盘古 5.0:多模态 + 科学计算 + 政务专网 |
| **2026 战略** | 行业大模型(矿山/气象/药物/金融) + 昇腾生态深度绑定 |
| **平台** | [pangu.huaweicloud.com](https://pangu.huaweicloud.com/) |

### 3.2 关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 行业大模型 | Industry-Specific LLM | 针对特定行业(矿山/气象)微调的垂直模型 |
| 多模态 | Multimodal | 文本/图像/视频/传感器联合处理 |
| 科学计算 | Scientific Computing | 物理/化学/生物模拟,如气象预报 |
| 盘古气象 | Pangu-Weather | 3D 高分辨率全球气象预报模型 |
| 盘古药物 | Pangu-Drug | 分子生成与蛋白结合预测 |
| 昇腾 | Ascend | 华为自研 NPU 芯片 |
| 国产化 | Domestic Substitution | 信创要求下的全国产化方案 |
| 知识图谱 | Knowledge Graph | 实体关系结构化表示 |
| 智能体 | AI Agent | 自主规划/调用工具完成任务的 LLM |

### 3.3 盘古代际演进

- **盘古 α**(2021-04):首个中文 200B+ 大模型,中文 NLP 基准 SOTA。
- **盘古 2.0**(2021-11):千亿级,多模态(视觉/语音/文本)。
- **盘古 3.0**(2023-07):五大行业 + L0/L1/L2 三层架构(L0 基础/L1 行业/L2 场景)。
- **盘古 5.0**(2024-06):升级到 100B+ 总参,100+ 行业模型矩阵。
  - 盘古 NLP(通用)
  - 盘古视觉(图像/视频)
  - 盘古多模态(图文)
  - 盘古科学计算(气象/生物/材料)
  - 盘古预测(行业时序)
- **盘古 6.0**(2026 路线图):据 2026 Q1 消息,将推 200B 通用 + 50+ 行业大模型,深度融合昇腾 Atlas 9000 集群。

### 3.4 模型矩阵(2026-02 快照)

| 模型 | 参数量 | 模态 | 定位 |
|---|---|---|---|
| **盘古 NLP 5.0** | 100B+ | 文本 | 通用语言 |
| **盘古视觉 5.0** | 100B+ | 图像/视频 | 视觉理解 |
| **盘古多模态 5.0** | 100B+ | 图文 | 多模态对话 |
| **盘古气象** | 256M(单独) | 3D 大气 | 全球天气预报 |
| **盘古药物** | 100M+ | 分子 | 药物设计 |
| **盘古矿山大模型** | 行业版 | 文本+传感器 | 矿山安全/调度 |
| **盘古政务大模型** | 行业版 | 文本 | 政务问答/文书 |

### 3.5 关键能力

- **行业纵深**:覆盖矿山、气象、药物、金融、政务、制造等 20+ 行业模型。
- **昇腾原生**:与华为 Atlas 9000 / 昇腾 910C 深度优化,国产化算力首选。
- **政企信创**:国务院/省级政府/央企采购首选,符合"自主可控"要求。
- **科学计算 SOTA**:盘古气象在 ECMWF 基准上首次超越 IFS-HRES。

---

## 四、昆仑天工 / Skywork 系列

### 4.1 公司与团队背景

| 维度 | 信息 |
|---|---|
| **公司** | 昆仑万维(Kunlun Inc.,2023 港股上市) |
| **核心团队** | AI 实验室(颜水成领衔) |
| **2023-04** | "天工" Skywork-13B 开源(中文底座) |
| **2024-08** | Skywork-MoE(146B 总/22B 激活)开源 |
| **2024-12** | Skywork OR1(类 o1 推理)开源 |
| **2025-12** | Skywork 4 系列:11 个 100B+ 任务专家矩阵 |
| **平台** | [neural.tech](https://neural.tech/) / [api.tiangong.cn](https://api.tiangong.cn/) |

### 4.2 关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 任务专家 | Task-Specific Experts | 每个专家专攻特定任务(对话/代码/数学/翻译) |
| 混合专家 | Mixture of Experts(MoE) | 每层多个专家,按需激活 |
| 开源推理模型 | Open-Source Reasoning | 类 o1 模式的推理过程透明 |
| 多语言 | Multilingual | 跨语言能力 |
| 长文本 | Long-Context | 100K+ 上下文支持 |
| 视频生成 | Video Generation | 文本生成视频(SkyReels) |
| 图像生成 | Image Generation | 文本生成图像(SkyPaint) |
| 智能体 | AI Agent | 自主任务执行 |

### 4.3 天工代际演进

- **Skywork-13B**(2023-04):中文基座开源,采用 SwiGLU + RoPE。
- **Skywork-MoE**(2024-08):146B 总参,激活 22B,开源 MoE。
- **Skywork OR1**(2024-12):类 o1 推理模型,开源训练数据。
- **Skywork 4**(2025-12,旗舰):
  - **11 个 100B+ 任务专家**:
    1. Skywork-4-Chat(对话)
    2. Skywork-4-Code(代码)
    3. Skywork-4-Math(数学)
    4. Skywork-4-Multimodal(多模态)
    5. Skywork-4-Reasoning(推理)
    6. Skywork-4-Agent(智能体)
    7. Skywork-4-Search(搜索)
    8. Skywork-4-Translation(翻译)
    9. Skywork-4-Robotics(机器人)
    10. Skywork-4-Video(视频,100B+)
    11. Skywork-4-Image(图像,100B+)
  - 全部商用许可(部分开源 Apache 2.0)。
  - 与昆仑万维"AI 应用矩阵"(Opera AI、Starpets、Talkie 等)深度整合。

### 4.4 关键能力

- **任务专家矩阵**:11 个 100B+ 任务专家,各自独立路由,综合调用比单一旗舰更高效。
- **开源 + 商用双轨**:核心模型 Apache 2.0,行业大模型商用授权。
- **AI 应用矩阵**:昆仑万维旗下 Opera、星野、Talkie、Starpets 全部接入,日活过亿。

---

## 五、智源悟道 / WuDao + CodeGeeX + BGE

### 5.1 智源研究院(BAAI)总览

| 维度 | 信息 |
|---|---|
| **机构** | 北京智源人工智能研究院(BAAI,2018 成立) |
| **核心团队** | 张钹、唐杰领衔,清华/北大人工智能教授为主 |
| **特色** | 学术派 + 开源先驱;悟道 2.0 是全球首个 1.75T MoE |
| **平台** | [baai.ac.cn](https://www.baai.ac.cn/) |
| **代码仓库** | [github.com/baai-lz](https://github.com/baai-lz) |

### 5.2 悟道代际演进

- **悟道 1.0 / GLM**(2021):26B 参数,中英双语基座。
- **悟道 2.0**(2021-06):**1.75T 参数 MoE**,全球首个突破万亿的开源大模型,FastMoE 训练框架。
- **悟道 3.0**(2022):"4+2 矩阵"——图文、文生图、对话、代码、跨模态生成、视频生成。
- **悟道 4.0 / Aquila**(2023+):转向轻量化开源(7B/33B),与 GLM 路线整合。
- **BGE 嵌入系列**(2023+):
  - **BGE-M3**:多语言、多粒度、多功能(稠密/稀疏/多向量)统一嵌入。
  - **BGE-reranker-v2-m3**:重排序模型,中文 RAG 标配。
  - **BGE-en-icl**:In-Context Learning 增强嵌入。
  - 是当前中文 RAG / 检索的事实标准。

### 5.3 CodeGeeX 系列

| 维度 | 信息 |
|---|---|
| **团队** | 智谱 AI + 浦育国际 |
| **首发** | CodeGeeX 2022-09(13B 多语言代码模型) |
| **CodeGeeX2**(2023-07) | 6B,HumanEval 36%,支持 20+ 语言 |
| **CodeGeeX3**(2023-10) | 33B 改版,接入智谱 GLM |
| **CodeGeeX4**(2024-07) | 9B,128K 上下文,HumanEval 82%,全栈研发助手 |
| **核心特色** | 国产开源代码模型代表;VSCode/JetBrains/Visual Studio 全插件支持 |
| **技术报告** | [arxiv.org/abs/2303.17568](https://arxiv.org/abs/2303.17568)(CodeGeeX 1.0) |

### 5.4 关键能力

- **悟道 2.0 万亿 MoE**:FastMoE 训练框架,被 DeepSeek 等多家公司参考。
- **BGE 嵌入**:中文 RAG 检索 SOTA,被 LangChain / LlamaIndex / Hugging Face 列为默认嵌入选项。
- **CodeGeeX 国产代码**:国产代码模型事实标准,VSCode 国内开发者高频使用。

---

## 六、模型矩阵总览(2026-02 快照)

| 模型 | 参数量 | 上下文 | 模态 | 许可证 | 核心场景 |
|---|---|---|---|---|---|
| **ERNIE 4.5 旗舰** | 424B/47B | 128K | 文本+图像+音频 | Apache 2.0 | 中文 SOTA |
| **ERNIE X1** | 未公开 | 128K | 文本+多模态 | 闭源+有限开源 | 深度思考 |
| **盘古 NLP 5.0** | 100B+ | 8K-32K | 文本 | 闭源 | 政企信创 |
| **盘古气象** | 256M | - | 3D 大气 | 闭源 | 全球天气预报 |
| **Skywork-4-Chat** | 100B+ | 200K | 文本 | 部分开源 | 通用对话 |
| **Skywork-OR1** | 7B/13B | 32K | 文本 | Apache 2.0 | 推理模型开源 |
| **悟道 2.0** | 1.75T | 2K | 文本 | 研究 | 万亿 MoE 先行者 |
| **BGE-M3** | 568M | 8K | 嵌入 | MIT | 中文嵌入 SOTA |
| **CodeGeeX4** | 9B | 128K | 代码 | 开源 | 国产代码模型 |

---

## 七、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **国产开源** | 5 大开源家族(文心 / Qwen / DeepSeek / GLM / Yi)+ 5+ 垂直家族(Skywork / 悟道 / CodeGeeX) |
| **闭源服务** | 文心 / 盘古 / 腾讯混元 / 字节豆包 / 阿里通义 形成"五虎 + 2 行业"格局 |
| **政企信创** | 盘古(华为)+ 文心(百度)+ 混元(腾讯) 是三大政企首选 |
| **中长尾** | Skywork / 悟道 / CodeGeeX / 书生(上海 AI Lab)/ 元乘象(电信)/ 360 智脑 等占据垂直生态位 |
| **国际化** | 文心、Qwen、Yi、Skywork 走向海外(Yi/Skywork 在 HF 月下载 30 万+) |
| **主要竞品** | OpenAI GPT-5 / Anthropic Claude Opus 4.5 / Google Gemini 2.5 / Meta Llama 4 / Mistral Large 3 |

---

## 八、生产最佳实践

1. **政企信创首选盘古**:与昇腾 + 华为云深度绑定,符合自主可控要求。
2. **中文 SOTA 选 ERNIE 4.5**:开源 + 中文最强 + 异构 MoE,综合最优。
3. **深度推理选 ERNIE X1**:类 o1 模式,数学/代码/规划任务表现优异。
4. **开源嵌入选 BGE-M3**:中文 RAG 检索 SOTA,LangChain 默认选项。
5. **国产代码选 CodeGeeX4**:VSCode/JetBrains 插件完善,本地化支持好。
6. **行业模型选盘古**:矿山/气象/药物等垂直场景,行业微调成本最低。
7. **多模态选 ERNIE 4.5**:图文音三模态原生,异构 MoE 效率高。
8. **应用集成选 Skywork-4**:与昆仑万维 AI 应用矩阵(Opera/Talkie/Starpets)协同好。

---

## 九、See Also(官方源)

### 百度文心

- [yiyan.baidu.com](https://yiyan.baidu.com/) / [qianfan.cloud.baidu.com](https://qianfan.cloud.baidu.com/)
- ERNIE 4.5 技术报告 [yiyan.baidu.com/blog/ernie-4-5](https://yiyan.baidu.com/blog/ernie-4-5)
- [huggingface.co/baidu](https://huggingface.co/baidu)

### 华为盘古

- [pangu.huaweicloud.com](https://pangu.huaweicloud.com/)
- 盘古气象论文 [nature.com/articles/s41586-023-06585-9](https://www.nature.com/articles/s41586-023-06585-9)(Nature 2023)
- 盘古药物论文 [nature.com/articles/s41587-023-02062-w](https://www.nature.com/articles/s41587-023-02062-w)

### 昆仑天工

- [neural.tech](https://neural.tech/) / [api.tiangong.cn](https://api.tiangong.cn/)
- [github.com/SkyworkAI](https://github.com/SkyworkAI)
- [huggingface.co/Skywork](https://huggingface.co/Skywork)
- Skywork-MoE 论文 [arxiv.org/abs/2406.06563](https://arxiv.org/abs/2406.06563)
- Skywork-OR1 论文 [arxiv.org/abs/2502.10841](https://arxiv.org/abs/2502.10841)

### 智源悟道 + CodeGeeX + BGE

- [baai.ac.cn](https://www.baai.ac.cn/)
- 悟道 2.0 论文 [arxiv.org/abs/2201.11990](https://arxiv.org/abs/2201.11990)
- CodeGeeX 论文 [arxiv.org/abs/2303.17568](https://arxiv.org/abs/2303.17568)
- BGE 仓库 [github.com/FlagOpen/FlagEmbedding](https://github.com/FlagOpen/FlagEmbedding)
- [huggingface.co/BAAI](https://huggingface.co/BAAI)

---

## 十、相关概念卡

- [[概念/qwen-series|Qwen Series]]
- [[概念/deepseek-series|Deepseek Series]]
- [[概念/glm-4-5-series|Glm 4 5 Series]]
- [[概念/doubao-series|Doubao Series]]
- [[概念/hunyuan-series|Hunyuan Series]]
- [[概念/yi-series|Yi Series]]
- [[概念/stepfun-series|Stepfun Series]]
- [[概念/internlm-3-series|Internlm 3 Series]]
- [[概念/General/mixture-of-experts|Moe]]
- [[概念/rag|Rag]]
