---
title: "Gemma / Google DeepMind 开源模型系列 (Gemma 1 → Gemma 2 → Gemma 3)"
category: concepts
tags:
  - llm
  - gemma
  - google
  - deepmind
  - open-source
  - multimodal
  - vision-language-model
  - shieldgemma
  - palm
aliases:
  - Gemma Series
  - Gemma 1 / 2 / 3
  - PaliGemma
  - CodeGemma
  - ShieldGemma
  - Google Gemma
relationships:
  - target: "概念/gemini"
    type: extends
  - target: "概念/multimodal-llm"
    type: related_to
  - target: "概念/llama-series"
    type: related_to
  - target: "概念/edge-llm"
    type: related_to
summary: "Gemma 是 Google DeepMind 推出的开源模型家族,作为闭源 Gemini 的"学术/工业开放对应版",2025-03 发布的 Gemma 3 提供 1B~27B 多尺寸、原生多模态、128K 上下文,首次将"局部-全局 5:1 注意力"等 SOTA 技术下放给开源社区。是当前 Google 生态(Search/Colab/Vertex AI/Android)的事实标准开源模型。"
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources: []
---

# Gemma / Google DeepMind 开源模型系列

> **一句话理解**:Google 把"造 Gemini 的方法论"下放给开源社区——Gemma 不是 Gemini 的开源版,而是用同样的研究规范(Responsible AI、数据治理、严格评估)训练出的"开放权重"对应物,让研究者和企业能用上"Google 品质的底座"。

---

## 一、团队与研究背景

| 维度 | 信息 |
|---|---|
| **团队** | Google DeepMind(Gemma 团队由 Tris Warkentin、Jeanine Banks 等领衔) |
| **训练基础设施** | Google TPU v5e / v6(TPUv5p) |
| **许可证** | Gemma License(允许商用,但有"使用限制条款",> 700M MAU 需单独授权) |
| **官方仓库** | [github.com/google-deepmind/gemma](https://github.com/google-deepmind/gemma) |
| **模型托管** | [huggingface.co/google](https://huggingface.co/google) / Kaggle Models / Vertex AI Model Garden |
| **Kaggle** | [kaggle.com/models](https://www.kaggle.com/models) 提供 5B/2B 免费 GPU 微调 |
| **核心理念** | "Open weights with responsibility"——开放权重 + 严格 Responsible AI 治理 |
| **2026 估值/影响** | 月下载量超 1 亿次,是 HuggingFace Top 3 开源家族 |

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 开放权重 | Open Weights | 权重可下载,但许可可能限制特定使用场景 |
| 责任 AI | Responsible AI | Google 内部的 AI 安全/公平/隐私治理框架 |
| 多模态 | Multimodal | 同时处理文本、图像、音频等模态 |
| 视觉语言模型 | Vision-Language Model(VLM) | 文本 + 图像联合建模 |
| 局部-全局注意力 | Local-Global Attention | 每 5 个局部层 + 1 个全局层,长上下文效率优化 |
| 知识蒸馏 | Knowledge Distillation | 用大模型输出训练小模型 |
| 旋转位置编码 | Rotary Position Embedding(RoPE) | 相对位置编码,Gemma 全系使用 |
| 分组查询注意力 | Grouped-Query Attention(GQA) | 减少 KV 显存 |
| 函数调用 | Function Calling | 让模型按 JSON Schema 调外部 API |
| 提示工程 | Prompt Engineering | 通过指令设计引导模型输出 |

---

## 三、模型代际演进

### 3.1 Gemma 1(2024-02)

- **Gemma 2B / 7B** 双版本开源。
- 训练数据约 6T tokens(主要英语),2B 模型在 MMLU 42.3%,7B 在 MMLU 64.3%。
- 采用 RoPE + GQA + Multi-Query Attention(MQA),7B 模型推理 8K 上下文。
- 同期发布 **CodeGemma 2B/7B**(代码补全)、**PaliGemma 3B**(视觉语言)。
- 论文:[arXiv:2403.08295](https://arxiv.org/abs/2403.08295)(Gemma Technical Report)。

### 3.2 Gemma 1.1(2024-04)

- 1.1 微调,RLHF 增强,7B 在 MMLU 推至 64.3%。
- 全系支持 8K 上下文。

### 3.3 RecurrentGemma(2024-04)

- 探索 Griffin 架构(状态空间模型 + 局部注意力),为后续 Mamba/混合架构铺路。
- 论文:[arXiv:2403.08295](https://arxiv.org/abs/2403.08295) 同源。

### 3.4 Gemma 2(2024-07)

- **Gemma 2 2B / 9B / 27B** 三档,**27B 是开源 SOTA 之一**。
- 引入 **5:1 局部-全局注意力**(每 5 个局部层穿插 1 个全局层),长上下文效率大幅提升。
- 软注意力 + 知识蒸馏,27B 在 MMLU 75.7%、HumanEval 51.8%。
- 训练数据 13T tokens(多语言扩展),6K → 8K 上下文。
- Gemma 2 2B 在 LMSys Chatbot Arena 排名超过同尺寸所有开源模型。
- 论文:[arXiv:2408.00118](https://arxiv.org/abs/2408.00118)(Gemma 2 Technical Report)。

### 3.5 CodeGemma 1.5 / 2(2024-07/2024-09)

- **CodeGemma 2B**(补全) + **CodeGemma 7B**(补全 + 生成)。
- 7B 版本在 HumanEval 56.1%、MBPP 67.7%,与 CodeLlama 7B/34B 同台竞争。
- 支持 FIM(Fill-in-Middle)补全。

### 3.6 PaliGemma 2(2024-12)

- 升级到 PaliGemma 2(3B/10B/28B),基于 Gemma 2 改造。
- 视觉编码器:**SigLIP**(Google 自研) + Gemma 2 文本。
- 在 VQA、OCR、文档理解、图表问答多项基准 SOTA。

### 3.7 ShieldGemma 2(2024-12)

- **安全分类器**,专门检测有害内容(仇恨、骚扰、危险、色情)。
- 2B / 9B / 27B 三档,可与 Gemma 2 配合做输出安全过滤。
- 论文:[arXiv:2408.16718](https://arxiv.org/abs/2408.16718)(ShieldGemma)。

### 3.8 Gemma 3(2025-03,当前主版本)

- **Gemma 3 1B / 4B / 12B / 27B** 多尺寸全多模态(SigLIP 视觉编码)。
- 关键升级:
  1. **128K 上下文**(全部尺寸,远超 Gemma 2 的 8K)。
  2. **5:1 局部-全局注意力保留**,27B 长上下文推理显存 28GB。
  3. **多模态原生**:图像输入与文本统一处理,支持图表、截图、文档。
  4. **多语言**:支持 140+ 语言(2025-12 统计)。
  5. **函数调用**:原生 JSON Schema 工具调用。
  6. **量化**:官方提供 INT4/INT8 GGUF、AWQ、BF16 权重。
- 在 MMLU-Pro 67.5%(27B)、MATH 65%(27B)、MMMU 56.1%(27B)。
- 论文:[arXiv:2503.19786](https://arxiv.org/abs/2503.19786)(Gemma 3 Technical Report)。

### 3.9 Gemma 3n(2025-06,端侧专项)

- 专为手机/嵌入式设计的"n"版本(2B/4B effective 参数量),用 **MatFormer** 架构(嵌套子模型可按需激活)。
- 单 2GB 内存即可跑 4B 模型,iPhone 15 Pro 实测 60 token/s。

### 3.10 Gemma 4 路线图(2026 预期)

- 据 Google 2026 Q1 路线图,Gemma 4 将推 **52B / 100B 双旗舰**,引入原生 Mamba-2 混合层,长上下文效率对标 Gemini 2.5 Flash。
- 全系原生 1M 上下文。

---

## 四、模型矩阵对比(2026-02 快照)

| 模型 | 参数量 | 上下文 | 模态 | 许可证 | 定位 | 旗舰基准 |
|---|---|---|---|---|---|---|
| **Gemma 2 2B** | 2.6B | 8K | 文本 | Gemma | 端侧入门 | MMLU 56.1% |
| **Gemma 2 27B** | 27B | 8K | 文本 | Gemma | 开源 SOTA | MMLU 75.7% |
| **Gemma 3 1B** | 1B | 128K | 文本 | Gemma | 极致轻量 | MMLU 38.2% |
| **Gemma 3 4B** | 4B | 128K | 文本+图像 | Gemma | 主力中杯 | MMLU-Pro 55.2% |
| **Gemma 3 12B** | 12B | 128K | 文本+图像 | Gemma | 通用大杯 | MMLU-Pro 62.5% |
| **Gemma 3 27B** | 27B | 128K | 文本+图像 | Gemma | 开源旗舰 | MMLU-Pro 67.5%,MMMU 56.1% |
| **Gemma 3n 4B** | 4B(effective) | 32K | 文本+图像+音频 | Gemma | 端侧 SOTA | MMLU 58.4% |
| **CodeGemma 7B** | 7B | 8K | 代码 | Gemma | 代码补全 | HumanEval 56.1% |
| **PaliGemma 2 10B** | 10B | 1K | 视觉语言 | Gemma | VLM 基础 | VQA-v2 86.0% |
| **ShieldGemma 2 9B** | 9B | 8K | 安全分类 | Gemma | 内容审核 | 89%+ F1 |

---

## 五、关键能力与生态

### 5.1 5:1 局部-全局注意力(Gemma 2 引入,Gemma 3 沿用)

- **原理**:5 个 Sliding Window 层(每个 token 只看邻近 1024) + 1 个全局层(全上下文)。
- **优势**:长上下文下 KV 显存节省 4-5 倍,推理速度提升 2-3 倍。
- **论文**:[arXiv:2408.00118](https://arxiv.org/abs/2408.00118) 详细描述。

### 5.2 多模态原生架构

- **视觉编码器**:SigLIP(Sigmoid Loss for Language-Image Pre-training),Google 自研。
- **融合方式**:视觉 token 拼接在文本前,经 Gemma 文本模型统一处理。
- **能力**:OCR、图表理解、文档解析、屏幕截图问答。

### 5.3 Google 生态整合

- **Vertex AI Model Garden**:一键部署到 Vertex AI Endpoint。
- **Colab**:免费 GPU(T4/L4)即可微调 2B/7B。
- **Android AICore**:Pixel 8+ / Android 14+ 原生 API,Gemma 3n 直接调用。
- **Search / Workspace**:Gemma 驱动 Google 内部部分辅助功能。

### 5.4 训练基础设施

- **TPU v5e / v6(Trillium)**:Gemma 3 27B 训练用 2048 块 TPUv5p,训练时间约 21 天。
- **JAX / Flax**:训练栈基于 JAX,易复现。

### 5.5 工具链

- **官方**:Hugging Face Transformers、vLLM、TensorRT-LLM、llama.cpp、Ollama 全部支持。
- **微调**:LoRA / QLoRA / Full FT 均有官方 notebook。
- **量化**:BF16 / INT8 / INT4 GGUF / AWQ,显存与速度可灵活取舍。

---

## 六、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **Hugging Face 排名** | Gemma 系列月下载量 Top 3(与 Llama、Qwen 并列) |
| **企业采用** | 金融、医疗、政务"私域大模型"前三选择(合规 + 质量) |
| **Android 集成** | Android 15+ AICore 默认 SLM 选项 |
| **Google 搜索集成** | Search Generative Experience(SGE)部分子任务 |
| **多模态生态** | PaliGemma 3 在 2026-01 发布,VLM 社区主流基座 |
| **主要竞品** | Llama 3.2/4(Meta)、Qwen 2.5/3(阿里)、Phi-4(MS)、Mistral 3 |

---

## 七、生产最佳实践

1. **首选 Gemma 3 系列**:除非极小算力(选 1B),Gemma 3 4B/12B/27B 是 Google 生态的事实标准。
2. **多模态必上 Gemma 3 4B+**:1B 没有视觉,4B 起才有图像理解。
3. **5:1 注意力是黑科技**:长文档/代码仓场景,务必用 27B 启用全上下文,Kaggle 4 张 T4 即可跑。
4. **端侧选 Gemma 3n**:iPhone / 高通 / MediaTek 嵌入式首选,MatFormer 架构允许按需激活子模型。
5. **Kaggle 免费微调**:中小团队用 Kaggle 16GB GPU 即可微调 Gemma 3 4B 全参,QLoRA 4GB 显存起步。
6. **安全过滤用 ShieldGemma 2**:与 Gemma 2/3 串联,实时过滤有害输入输出,延迟 < 50ms。
7. **许可证红线**:**> 700M MAU 产品需单独申请商业授权**,中小应用无虞。

---

## 八、See Also(官方源)

- 官方主页 [ai.google.dev/gemma](https://ai.google.dev/gemma)
- DeepMind 仓库 [github.com/google-deepmind/gemma](https://github.com/google-deepmind/gemma)
- Gemma 1 论文 [arxiv.org/abs/2403.08295](https://arxiv.org/abs/2403.08295)
- Gemma 2 论文 [arxiv.org/abs/2408.00118](https://arxiv.org/abs/2408.00118)
- Gemma 3 论文 [arxiv.org/abs/2503.19786](https://arxiv.org/abs/2503.19786)
- Hugging Face [huggingface.co/google](https://huggingface.co/google)
- Kaggle Models [kaggle.com/models?query=gemma](https://www.kaggle.com/models?query=gemma)
- Vertex AI [cloud.google.com/vertex-ai](https://cloud.google.com/vertex-ai)

---

## 九、相关概念卡

- [[概念/gemini|Gemini]]
- [[概念/llama-series|Llama Series]]
- [[概念/qwen-series|Qwen Series]]
- [[概念/phi-series|Phi Series]]
- [[概念/multimodal-llm|Multimodal Llm]]
- [[概念/vision-language-model|Vision Language Model]]
- [[概念/edge-llm|Edge Llm]]
- [[概念/llm-as-judge|Llm As Judge]]
