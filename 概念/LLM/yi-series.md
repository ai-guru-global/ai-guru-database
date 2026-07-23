---
title: "Yi / 零一万物模型系列 (Yi-6B/9B/34B → Yi-VL → Yi-Lightning)"
category: concepts
tags:
  - llm
  - yi
  - zero-one-ai
  - 01-ai
  - chinese-llm
  - multimodal
  - bilingual
  - long-context
  - kai-fu-lee
aliases:
  - Yi Series
  - Yi-6B / 9B / 34B
  - Yi-VL
  - Yi-Lightning
  - 零一万物
  - 01.AI
relationships:
  - target: "概念/qwen-series"
    type: related_to
  - target: "概念/llama-series"
    type: related_to
  - target: "概念/multimodal-llm"
    type: related_to
  - target: "概念/long-context-llm"
    type: related_to
summary: "Yi 是李开复创办的 01.AI(零一万物)推出的开源大模型系列,以"高质量中英双语 + 200K 长上下文 + Apache 2.0 全栈开源"为特色,Yi-34B 在 2023-11 一举成为 Hugging Face Open LLM Leaderboard 第一名,Yi-Lightning(2024-10)以 200K 上下文 + MoE 在中文榜单稳居前三。"
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources: []
---

# Yi / 零一万物模型系列

> **一句话理解**:李开复带着 Google/微软/Sinovation 班底,在 2023 年中"千模大战"中以"中文底座 SOTA"姿态杀出的开源系列——Yi-34B 曾登顶 Hugging Face 全球榜,Yi-Lightning 至今仍是中文企业级落地的"高性价比"代表。

---

## 一、公司与团队背景

| 维度 | 信息 |
|---|---|
| **公司** | 01.AI / 零一万物(2023-07 成立,北京/硅谷双总部) |
| **创始人** | 李开复(Kai-Fu Lee,前 Google 大中华区总裁、创新工场 CEO) |
| **核心团队** | Google、Microsoft、Apple、Baidu、Meta 等大厂资深 ML 工程师 |
| **核心理念** | "中英双 SOTA"——同时做中国和海外市场的开源基座 |
| **2024 估值** | 10 亿美元+(独角兽) |
| **2026 状态** | 转型为"模型 + 应用"双轮,API 与 Yi Platform 同步运营 |
| **官方仓库** | [github.com/01-ai](https://github.com/01-ai) |
| **模型托管** | [huggingface.co/01-ai](https://huggingface.co/01-ai) |
| **许可证** | **Yi License 2.0**(类似 Llama 社区许可,允许商用但有 MAU 限制) |

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 中英双语 | Bilingual(Chinese-English) | 中英文能力平衡,中文不掉队 |
| 长上下文 | Long Context | 通常指 32K+ 上下文窗口 |
| 位置编码扩展 | RoPE Extension | 通过 NTK-aware 缩放扩展上下文窗口 |
| 多模态 | Multimodal | 同时处理文本、图像等多种模态 |
| 视觉编码器 | Vision Encoder | 将图像转为 token 的 CNN/ViT 网络 |
| 知识蒸馏 | Knowledge Distillation | 用大模型输出训练小模型 |
| 滑动窗口注意力 | Sliding Window Attention(SWA) | 每个 token 只关注局部窗口 |
| 分组查询注意力 | Grouped-Query Attention(GQA) | 减少 KV 显存 |
| 微调 | Fine-Tuning | 在预训练模型上继续训练 |
| 智能体 | AI Agent | 能自主规划/调用工具完成任务的 LLM 应用 |

---

## 三、模型代际演进

### 3.1 Yi 系列首发(2023-11)

- **Yi-6B / Yi-6B-Chat / Yi-6B-200K** 三档。
- **Yi-34B / Yi-34B-Chat / Yi-34B-200K** 三档。
- 训练数据 3T tokens,中英文混合,2K/4K 默认上下文,200K 上下文为可选项。
- 在 Hugging Face Open LLM Leaderboard 中 **Yi-34B 排名第一**,力压 Llama 2 70B、Qwen 72B。
- 关键架构:
  - RoPE 旋转位置编码
  - SwiGLU 激活函数
  - GQA 分组查询注意力
  - 200K 上下文通过 NTK-aware RoPE 缩放实现
- 论文:[arXiv:2403.04652](https://arxiv.org/abs/2403.04652)(Yi Technical Report)。

### 3.2 Yi-VL 多模态(2024-01)

- **Yi-VL-6B / Yi-VL-34B** 双版本,基于 Yi 文本底座 + LLaVA 视觉编码器改造。
- 支持中英图文问答、图表理解、文档解析。
- 在 MMMU(35.7% 6B / 41.6% 34B)、MMBench 等基准超越同尺寸开源对手。
- 论文:[arXiv:2403.04652](https://arxiv.org/abs/2403.04652) 多模态扩展。

### 3.3 Yi-1.5(2024-05)

- **Yi-1.5 9B / 34B**(开源)+ **Yi-1.5 6B / 9B / 34B -Chat**(对话)。
- 关键升级:
  1. 训练数据从 3T → **3.6T tokens**。
  2. 上下文窗口原生支持 4K/32K,200K 通过外推实现。
  3. **中英文 SOTA 持续保持**;在 MMLU、C-Eval、CMMLU 多个榜单进入 Top 5。
  4. 引入更多代码与数学数据,HumanEval 提升 5-7 个百分点。
- 论文:[arXiv:2405.04560](https://arxiv.org/abs/2405.04560)(Yi-1.5)。

### 3.4 Yi-Coder(2024-08)

- **Yi-Coder 1.5B / 9B** 专注代码补全与生成。
- HumanEval 1.5B 达 55.5%,9B 达 78.2%(对照同期同尺寸 SOTA)。
- 支持 128K 上下文,FIM 补全。

### 3.5 Yi-Lightning(2024-10,闭源旗舰)

- 全新架构,定位"中文 SOTA 闭源旗舰"。
- 200K 上下文,MoE 架构(具体规模未公开)。
- 在 SuperCLUE 中文榜、LMSys 中文榜进入前 3。
- 价格亲民($0.99 / $1.99 per 1M tokens),冲击 Kimi/MiniMax 价格区间。
- 通过 01.AI API 与阿里云、火山引擎上架。

### 3.6 Yi-Lightning-Large / Yi-Reasoning(2025-02)

- 升级到"推理优化"版,采用类似 o1 的长时 CoT + PRM(过程奖励模型)。
- 在 AIME、CMATH、CMMLU 多项中文推理基准 SOTA。

### 3.7 Yi-200K 200K 长上下文版本(2025-04)

- 工业级长上下文旗舰,在 "Needle-in-a-Haystack" 200K 测试中 99%+ 准确率。
- 商业 API($2.5 / $5 per 1M tokens),与 Kimi 128K、月之暗面、Anthropic 200K 正面竞争。

### 3.8 Yi 3 / Yi-3 Multimodal(2026 路线图)

- 据 2026 Q1 路线图,Yi 3 将推 **30B / 100B MoE 双旗舰**,原生 200K 上下文,原生多模态(图像、视频、音频),与 Qwen 3 / DeepSeek V3 同台竞争。

---

## 四、模型矩阵对比(2026-02 快照)

| 模型 | 参数量 | 上下文 | 模态 | 许可证 | 定位 | 旗舰基准 |
|---|---|---|---|---|---|---|
| **Yi-6B-Chat** | 6B | 200K | 文本 | Yi 2.0 | 中文基座 | MMLU 64.0%,C-Eval 77.4% |
| **Yi-9B / 1.5** | 9B | 32K | 文本 | Yi 2.0 | 主力中杯 | MMLU 70.8%,C-Eval 81.7% |
| **Yi-34B / 1.5** | 34B | 200K | 文本 | Yi 2.0 | 开源大杯(经典) | MMLU 76.8%,C-Eval 85.7% |
| **Yi-VL-6B** | 6B | 4K | 文本+图像 | Yi 2.0 | 多模态小杯 | MMMU 35.7% |
| **Yi-VL-34B** | 34B | 4K | 文本+图像 | Yi 2.0 | 多模态大杯 | MMMU 41.6% |
| **Yi-Coder 9B** | 9B | 128K | 代码 | Yi 2.0 | 代码补全 | HumanEval 78.2% |
| **Yi-Lightning** | 未公开 MoE | 200K | 文本 | 闭源 | 闭源旗舰 | LMSys 中文榜 Top 3 |
| **Yi-Reasoning** | 未公开 | 200K | 文本+推理 | 闭源 | 长时推理 | AIME 80%+ |

---

## 五、关键能力与生态

### 5.1 200K 长上下文方案

- **默认 4K-32K**,200K 通过 **NTK-aware RoPE 缩放** + **Dynamic NTK** 双重外推实现。
- 在 "Needle-in-a-Haystack" 200K 全长测试中保持 95%+ 准确率,中段检索(100K-150K)准确率 93%。
- 与 Kimi(月之暗面)、Claude(Anthropic)、GPT-4(OpenAI)同属"200K 俱乐部"。

### 5.2 中英双语 SOTA

- 训练数据中英文比例约 **45:55**,中文不掉队。
- 在 C-Eval、CMMLU、GAOKAR-Bench 多个中文榜单常年 Top 5。
- Yi-34B 在 MMLU(英文)76.8% / C-Eval(中文)85.7% 的"双语双高"是早期国产模型罕见指标。

### 5.3 Yi Platform 商业化

- **01.AI API**:Yi-Lightning、Yi-200K、Yi-Vision 多档计费。
- **阿里云/火山引擎**:上架通义/豆包生态。
- **企业内部部署**:Yi-34B 是金融、医疗、政务"中文私有化"前三选择。

### 5.4 工具链

- **官方**:Hugging Face Transformers、vLLM、llama.cpp、Ollama 全支持。
- **微调**:LoRA、QLoRA、DeepSpeed 均有官方 notebook。
- **多模态**:Yi-VL 可与 LLaVA 生态兼容(模型架构相似)。

### 5.5 中文生态整合

- 集成在 LangChain-Chatchat、QAnything、FastGPT、DB-GPT 等中文 RAG 框架。
- 在中文 Function Call / 工具调用 / 智能体场景中是事实标准之一。

---

## 六、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **开源策略** | 2024-2025 主力开源;2025-2026 闭源旗舰 + 开源基座双线 |
| **企业私有化** | 中文/繁体/粤语场景首选,Yi-34B 是政企"信创+大模型"高频选项 |
| **海外市场** | HuggingFace 上 Yi 系列海外月下载量稳定 30 万+ |
| **2026 战略** | "模型 + 应用"双轮,模型层面对标 Qwen 3 / DeepSeek V3 |
| **创始人动向** | 李开复 2026 公开强调"通用大模型是巨头游戏,Yi 走垂直化 + 长上下文 + 多模态"差异化 |
| **主要竞品** | Qwen 3(阿里)、DeepSeek V3(深度求索)、Kimi(月之暗面)、Doubao(字节) |

---

## 七、生产最佳实践

1. **中文场景选 Yi-34B / 1.5**:C-Eval 85.7% 是中文开源第一梯队,中英双语不掉队。
2. **200K 长文档用 Yi-34B-200K**:年报、合同、代码库整库分析准确率 95%+。
3. **闭源选 Yi-Lightning**:中文对话质量与 Kimi/Doubao 同梯队,价格更低($0.99/$1.99)。
4. **多模态选 Yi-VL-34B**:中文图文问答场景(文档解析、合同审核)首选。
5. **代码选 Yi-Coder 9B**:128K 上下文 + HumanEval 78.2%,FIM 补全强。
6. **企业私有化注意许可证**:> 1 亿 MAU 需联系 01.AI 单独授权。
7. **混合部署**:Yi-1.5-9B(轻量) + Yi-34B(主力) + Yi-Lightning API(复杂),综合成本最优。

---

## 八、See Also(官方源)

- 01.AI 主页 [01.ai](https://www.01.ai/)
- 官方 GitHub [github.com/01-ai](https://github.com/01-ai)
- Hugging Face [huggingface.co/01-ai](https://huggingface.co/01-ai)
- Yi Technical Report [arxiv.org/abs/2403.04652](https://arxiv.org/abs/2403.04652)
- Yi-1.5 论文 [arxiv.org/abs/2405.04560](https://arxiv.org/abs/2405.04560)
- Yi-VL 论文 [arxiv.org/abs/2403.04652](https://arxiv.org/abs/2403.04652)
- Yi Platform 文档 [platform.01.ai](https://platform.01.ai/)
- SuperCLUE 中文榜 [superclueai.com](https://www.superclueai.com/)

---

## 九、相关概念卡

- [[概念/qwen-series|Qwen Series]]
- [[概念/deepseek-series|Deepseek Series]]
- [[概念/glm-4-5-series|Glm 4 5 Series]]
- [[概念/doubao-series|Doubao Series]]
- [[概念/llama-series|Llama Series]]
- [[概念/multimodal-llm|Multimodal Llm]]
- [[概念/long-context-llm|Long Context Llm]]
- [[概念/edge-llm|Edge Llm]]
