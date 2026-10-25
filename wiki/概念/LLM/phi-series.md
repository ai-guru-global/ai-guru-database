---
title: "Phi / Microsoft Research 小模型系列 (Phi-1 → Phi-3 → Phi-4 / Phi-4 Multimodal)"
category: concepts
tags:
  - llm
  - phi
  - microsoft
  - small-language-model
  - slm
  - synthetic-data
  - reasoning
  - multimodal
  - textbook-quality
aliases:
  - Phi Series
  - Phi-1 / Phi-1.5 / Phi-2
  - Phi-3 mini / small / medium
  - Phi-4 / Phi-4 multimodal
  - Microsoft Phi
relationships:
  - target: "概念/slm"
    type: extends
  - target: "概念/edge-llm"
    type: related_to
  - target: "概念/distillation"
    type: related_to
  - target: "概念/synthetic-data"
    type: related_to
summary: "Phi 是 Microsoft Research 推出的"小而强"SLM 旗舰系列——以"教科书级训练数据 + 合成数据 + 严格 RLHF"为方法论,从 Phi-1(1.3B)开始用小参数不断刷新同尺寸 SOTA,Phi-4 14B 在多项推理基准上超过 GPT-4o mini、Llama 3.1 8B、Qwen 2.5 14B 等同尺寸对手,是端侧 / 离线 / 隐私场景的首选。"
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources: []
name_zh: "Phi / Microsoft Research 小模型系列"
---

# Phi / Microsoft Research 小模型系列

> 中文简称：Phi / Microsoft Research 小模型系列

> **一句话理解**:Microsoft 用"数据质量 > 数据数量"的哲学,在 1.3B~14B 区间做出了让闭源巨头汗颜的小模型——Phi-4 14B 在 STEM 推理上甚至超过自家 GPT-4o mini,是端侧推理/隐私敏感/成本敏感场景的"性价比之王"。

---

## 一、团队与研究理念

| 维度 | 信息 |
|---|---|
| **团队** | Microsoft Research(由 Sébastien Bubeck、Suriya Gunasekar 等领衔) |
| **核心论文** | "Textbooks Are All You Need"(2023-06)开创"高质量小数据"范式 |
| **核心理念** | 1) 数据质量 >> 数据数量;2) 合成数据 + 严格筛选;3) 小参数极致优化 |
| **许可证** | MIT(早期)→ 2025 起部分模型采用 **Microsoft Research License**(允许商用但有使用规模限制) |
| **官方仓库** | [github.com/microsoft/PhiCookBook](https://github.com/microsoft/PhiCookBook) |
| **模型托管** | [huggingface.co/microsoft](https://huggingface.co/microsoft) |
| **Azure 部署** | Azure AI Foundry 模型目录(原生支持) |
| **2026 定位** | 微软 SLM 战略旗舰,与 OpenAI 大模型形成"云边端"互补 |

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 小型语言模型 | Small Language Model(SLM) | 参数量通常 < 20B,可在端侧/CPU 推理 |
| 合成数据 | Synthetic Data | 用 LLM 生成/筛选的训练数据,非真人标注 |
| 教科书质量 | Textbook Quality | 像教科书一样严谨、清晰、去重的训练数据风格 |
| 指令微调 | Instruction Tuning | 用 (指令, 回答) 对训练模型遵循指令 |
| 直接偏好优化 | Direct Preference Optimization(DPO) | 无需 RL,用偏好对比直接对齐模型 |
| 组相对策略优化 | Group Relative Policy Optimization(GRPO) | DeepSeek 提出,Phi-4 推理训练采用 |
| 模型融合 | Model Merging | 多个微调模型权重平均获得新能力 |
| 函数调用 | Function Calling | 让模型按 JSON Schema 调外部 API |
| 视觉语言模型 | Vision-Language Model(VLM) | 同时处理图像与文本的模型 |
| 多模态 | Multimodal | 支持图像、音频、视频等多种模态输入/输出 |

---

## 三、模型代际演进

### 3.1 Phi-1 / Phi-1.5(2023-06/2023-09)

- **Phi-1 1.3B**:专攻代码,"Textbooks Are All You Need" 论文证明小模型+高质量代码语料可超越 Llama 2 7B。
- **Phi-1.5 1.3B**:通用版本,自然语言推理对标 Llama 2 7B,只用了 ~100B tokens 训练。
- 论文:[arXiv:2306.11644](https://arxiv.org/abs/2306.11644)(Textbooks Are All You Need)。

### 3.2 Phi-2(2023-12)

- 2.7B 参数,在常识推理、数学、代码多基准超过 Mistral 7B、Llama 2 13B。
- 训练数据大幅扩展(1.4T tokens),引入"代码+教科书"多阶段训练。
- 不开源,仅 Hugging Face 权重下载,引发社区"开放权重"讨论。

### 3.3 Phi-3 系列(2024-04)

- **Phi-3 mini 3.8B**:对标 Mixtral 8x7B、GPT-3.5,MMLU 69%,MIT 许可证。
- **Phi-3 small 7B**:多任务能力更强,引入分组查询注意力(GQA)。
- **Phi-3 medium 14B**:与 Llama 3 70B、Mixtral 8x22B 在多项基准正面竞争。
- 论文:[arXiv:2404.14219](https://arxiv.org/abs/2404.14219)(Phi-3 Technical Report)。
- 全部支持 4K/128K 上下文,完全开源(MIT)。

### 3.4 Phi-3.5 / Phi-3.5-MoE(2024-08)

- **Phi-3.5 mini 3.8B**:扩展多语言、128K 上下文,刷新同尺寸 SOTA。
- **Phi-3.5 MoE 16×3.8B**:61B 总参,激活 6.6B,效率对齐 Mixtral 8x22B。
- **Phi-3.5 Vision 4.2B**:多模态版本,支持图像理解、OCR、图表问答。

### 3.5 Phi-4 14B(2024-12)

- **核心突破**:在 MATH、HumanEval、MGSM 等 STEM 基准上**超过 GPT-4o mini**,与 Llama 3.1 70B 持平。
- 训练数据:1) 合成"教科书级"数据;2) 严格去重/过滤;3) 多阶段 DPO + GRPO。
- 论文:[arXiv:2412.08905](https://arxiv.org/abs/2412.08905)(Phi-4 Technical Report)。
- 14B 单卡 A100/H100 可推理,iPhone 15 Pro 量化后可跑(Apple Foundation Models 框架)。

### 3.6 Phi-4 Multimodal / Phi-4 Reasoning(2025-05)

- **Phi-4 Multimodal**:图像、音频、视频三模态原生,17B 参数。
- **Phi-4 Reasoning 14B**:专为"长时推理"优化,采用 GRPO + 推理时搜索,接近 o1-mini 水平。
- **Phi-4 mini Reasoning 3.8B**:端侧推理 SOTA,断网可用。

### 3.7 Phi-5 / Phi-5 家族(2026-02 路线图)

- 据 Microsoft 2026 路线图,Phi-5 将推出 **18B/30B 双版本**,在 reasoning 维度对标 DeepSeek R1。
- 进一步降低显存:30B 模型 INT4 量化后单卡 RTX 5090(32GB)可全速推理。

---

## 四、模型矩阵对比(2026-02 快照)

| 模型 | 参数量 | 上下文 | 许可证 | 定位 | 旗舰基准 |
|---|---|---|---|---|---|
| **Phi-1.5** | 1.3B | 2K | 研究 | 早期 SLM 验证 | MMLU 41.4% |
| **Phi-2** | 2.7B | 2K | 研究 | 代码+推理 | MMLU 56.3% |
| **Phi-3 mini** | 3.8B | 4K/128K | MIT | 端侧 SOTA | MMLU 69% |
| **Phi-3 small** | 7B | 128K | MIT | 主力中尺寸 | MMLU 75.3% |
| **Phi-3 medium** | 14B | 128K | MIT | 通用大杯 | MMLU 78.0% |
| **Phi-3.5 MoE** | 61B/6.6B | 128K | MIT | MoE 路线 | MMLU 78.5% |
| **Phi-3.5 Vision** | 4.2B | 128K | MIT | 视觉多模态 | MMMU 43.9% |
| **Phi-4** | 14B | 16K/64K | MIT | STEM 推理 SOTA | MATH 80.4%,MMLU 84.5% |
| **Phi-4 Reasoning** | 14B | 16K | MIT | 长时推理 | AIME 79.3% |
| **Phi-4 Multimodal** | 17B | 128K | MIT | 多模态旗舰 | MMMU 65.8% |

---

## 五、关键能力与生态

### 5.1 训练方法论创新

- **数据流水线**:
  1. 用 GPT-4 生成"教科书级"种子内容;
  2. 严格去重、过滤低质/重复;
  3. 代码 + 数学 + 自然语言多阶段混合;
  4. 引入"代码执行反馈"作为质量信号。
- **对齐技术**:SFT → DPO → GRPO(2025 起推理模型采用)。
- **模型融合**:Phi-4 使用 5 个不同微调模型权重平均。

### 5.2 端侧部署

- **Apple Foundation Models**:Phi-3 / Phi-4 在 iPhone/iPad/Mac 原生框架上可跑(INT4 量化)。
- **高通骁龙 NPU**:Phi-3 mini 3.8B 在 Snapdragon 8 Gen 3 上推理速度 > 200 token/s。
- **ONNX / Olive**:Microsoft Olive 工具链一键转 ONNX,跨平台部署。
- **llama.cpp / Ollama**:Phi 系列在开源社区推理框架中均有 GGUF 量化版本。

### 5.3 Azure / 微软生态整合

- **Azure AI Foundry**:Phi 系列原生支持,一键部署到 Azure Kubernetes / App Service。
- **Copilot+ PC**:Windows 11 24H2 起,系统级 Copilot 默认调用 Phi-3.5/Phi-4。
- **Office 集成**:Phi 辅助 Word/Excel 公式补全、Outlook 邮件草稿。

### 5.4 多模态

- **Phi-3.5 Vision 4.2B**:CLIP ViT 视觉编码器 + Phi-3 文本,支持图表理解、文档 OCR、屏幕截图问答。
- **Phi-4 Multimodal**:音频、视频、图像统一处理,17B 单模型覆盖 4 模态。

---

## 六、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **Azure 部署** | Azure AI Foundry 部署量 Top 3 家族(与 Llama、Qwen 并列) |
| **企业私有化** | Phi-3.5 MoE 是金融/医疗最常采用的 SLM |
| **Copilot+ PC** | Windows Copilot+ 装机量破 5000 万,默认 SLM 即 Phi 系列 |
| **Apple Intelligence** | 部分功能由 Phi-3.5 驱动(iOS 18+) |
| **许可证争议** | Phi-4 部分企业级版本仍受 MS Research License 限制(>700M MAU 需联系) |
| **主要竞品** | Qwen 2.5 / Qwen 3(阿里)、Gemma 2/3(Google)、Llama 3.2(Light/Mid,Meta) |

---

## 七、生产最佳实践

1. **端侧 SLM 优先 Phi-3.5 mini / Phi-4 mini**:3.8B 量化后在 iPhone 15、Mac M2 上流畅运行,断网可用,隐私零泄露。
2. **STEM 推理选 Phi-4 14B**:数学/物理/代码基准单卡 80GB 显存可跑,质量逼近 70B 级别。
3. **多模态选 Phi-4 Multimodal 17B**:图像/音频/视频一站式,INT4 后单卡 24GB 显存可跑。
4. **Microsoft Olive 一键部署**:`olive auto-opt` 直接产出 ONNX + DirectML + TensorRT-LLM 多端格式。
5. **DPO + GRPO 二次微调**:在企业垂直数据上 Phi-3.5 mini 用 DPO 即可,推理任务用 GRPO。
6. **规避许可证雷区**:> 700M MAU 产品需联系微软获取商业授权;中小应用可放心用 MIT 版本。
7. **Ollama / llama.cpp 离线部署**:在隔离网络/工厂/医疗场景,Phi-3.5 mini GGUF Q4 量化版是首选。

---

## 八、See Also(官方源)

- Phi 官方仓库 [github.com/microsoft/PhiCookBook](https://github.com/microsoft/PhiCookBook)
- Hugging Face 组织 [huggingface.co/microsoft](https://huggingface.co/microsoft)
- Textbooks Are All You Need 论文 [arxiv.org/abs/2306.11644](https://arxiv.org/abs/2306.11644)
- Phi-3 Technical Report [arxiv.org/abs/2404.14219](https://arxiv.org/abs/2404.14219)
- Phi-4 Technical Report [arxiv.org/abs/2412.08905](https://arxiv.org/abs/2412.08905)
- Azure AI Foundry 模型目录 [ai.azure.com](https://ai.azure.com/)
- Phi-4 官方博客 [azure.microsoft.com/en-us/blog/phi-4](https://azure.microsoft.com/en-us/blog/phi-4/)
- Olive 部署工具 [github.com/microsoft/Olive](https://github.com/microsoft/Olive)

---

## 九、相关概念卡

- [[概念/LLM/small-language-models|Slm]]
- [[概念/edge-llm|Edge Llm]]
- [[概念/llama-series|Llama Series]]
- [[概念/qwen-series|Qwen Series]]
- [[概念/gemma-series|Gemma Series]]
- [[概念/Training/knowledge-distillation|Distillation]]
- [[概念/dpo|Dpo]]
- [[概念/grpo|Grpo]]
