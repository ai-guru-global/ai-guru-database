---
title: "Mistral 模型系列 (Mistral 7B → Mixtral 8x7B → Mistral Large 3 675B MoE)"
category: concepts
tags:
  - llm
  - mistral
  - moe
  - mixtral
  - open-source
  - mixture-of-experts
  - european-llm
  - codestral
aliases:
  - Mistral Series
  - Mistral 7B
  - Mixtral 8x7B / 8x22B
  - Mistral Large 3
  - Codestral
relationships:
  - target: "概念/moe"
    type: extends
  - target: "概念/mixture-of-experts"
    type: related_to
  - target: "概念/llama-series"
    type: related_to
  - target: "概念/edge-llm"
    type: related_to
summary: "Mistral AI(法国巴黎,2023-04 成立)是欧洲最具影响力的开源大模型公司,以"小而强"的开放权重路线闻名。Mixtral 8x7B 是首个开源 SOTA MoE,Mistral Large 3 (675B / 41B active) 在 2026-02 推至顶级闭源水平。Codestral 系列是当前最强开源代码模型之一。"
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources: []
name_zh: "Mistral 模型系列"
---

# Mistral 模型系列

> 中文简称：Mistral 模型系列

> **一句话理解**:欧洲"开源反击"的核心旗手——以"高参数效率 MoE"和"Apache 2.0 / 宽松商业许可"为武器,从 7B 小模型一路打到 675B MoE,是 Llama 系列之外最被工业界采纳的开源家族。

---

## 一、公司与团队背景

| 维度 | 信息 |
|---|---|
| **公司** | Mistral AI(法国巴黎,2023-04 成立) |
| **创始人** | Arthur Mensch(CEO,前 DeepMind)、Guillaume Lample、Timothée Lacroix(均前 Meta FAIR) |
| **核心理念** | "Frontier AI in Open Source"——前沿能力优先以开源/开放权重形式发布 |
| **融资** | 2024 估值 60 亿欧元(2024-06),2026 估值约 110 亿欧元 |
| **云合作** | AWS Bedrock / Azure AI / GCP Vertex AI 三大云均上架 |
| **平台** | [chat.mistral.ai](https://chat.mistral.ai/)(Le Chat) / [mistral.ai](https://mistral.ai/) |
| **许可证** | Apache 2.0(Mistral 7B)、MRL(Mistral Research License) → 2025 起逐步转 Apache 2.0 |
| **关键差异化** | 欧洲合规(GDPR/AI Act)、低延迟、企业可私有部署 |

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 混合专家 | Mixture of Experts(MoE) | 每层多个"专家"网络,每次只激活其中若干个 |
| 开放权重 | Open Weights | 权重可下载,允许微调/再分发,但许可可能附加商业限制 |
| 滑动窗口注意力 | Sliding Window Attention(SWA) | 每个 token 只关注局部窗口,降低显存与计算量 |
| 分组查询注意力 | Grouped-Query Attention(GQA) | 多 Q 头共享 K/V 头,KV 显存压缩 |
| 字节回退 | Byte-Fallback BPE | 字符级回退的分词器,对多语言/代码更鲁棒 |
| 指令微调 | Instruction Tuning(IT) | 用指令-响应对微调,提升对话/任务遵循 |
| 偏好对齐 | Preference Alignment | DPO/RLHF 等使输出更符合人类偏好 |
| 检索增强生成 | Retrieval-Augmented Generation(RAG) | 模型外挂知识库,典型范式 |
| 代码专用模型 | Code LLM | 专攻代码生成/补全的模型族 |
| 边缘部署 | Edge Deployment | 在终端/边缘设备上运行的轻量推理 |

---

## 三、模型代际演进

### 3.1 Mistral 7B(2023-09,首个开源发布)

- Apache 2.0 许可证,首个对标 Llama 2 13B 的 7B 模型。
- 引入 **GQA(分组查询注意力)** + **SWA(滑动窗口注意力)**,在长上下文下显存占用显著降低。
- 在 MMLU、HellaSwag、HumanEval 等基准上击败 Llama 2 13B。
- 论文:[arXiv:2310.06825](https://arxiv.org/abs/2310.06825)(Mistral 7B)。

### 3.2 Mixtral 8x7B(2023-12,首个开源 SOTA MoE)

- **8 个专家 / 每 token 激活 2 个**,总参 46.7B,激活 12.9B。
- 推理速度与 7B 模型相当(因为只激活 12.9B),但基准对标 Llama 2 70B、GPT-3.5。
- Apache 2.0 许可证,引爆开源 MoE 浪潮。
- 论文:[arXiv:2401.04088](https://arxiv.org/abs/2401.04088)(Mixtral of Experts)。

### 3.3 Mixtral 8x22B(2024-04)

- 升级到 22B × 8 = 141B 总参,激活 39B。
- 多语言大幅增强,原生支持英/法/德/西/意/葡/俄/中/日/韩等 11+ 语言。
- 在 Commonsense Reasoning、世界知识、数学、代码多维度对齐 Llama 3 70B 级别。

### 3.4 Mistral Large / Mistral Large 2(2024-02/2024-07)

- 首个**闭源旗舰**,通过 API 提供,Mistral Large 2(123B)在 MMLU、代码、推理超越 Llama 3 70B、Claude 3 Sonnet。
- 支持 32K 上下文、强大的函数调用 / JSON 模式。
- 商业许可(Mistral Research License 过渡期)。

### 3.5 Codestral 系列(2024 起,代码专用)

- **Codestral 22B**(2024-05):首个 Mistral 开源代码模型,支持 80+ 语言,32K 上下文,HumanEval 81%。
- **Codestral Mamba 7B**(2024-07):基于 Mamba SSM 架构的代码模型,支持无限上下文(理论上),Apache 2.0。
- **Codestral 25**(2025-01):256K 上下文,80B MoE 激活 25B,在 RepoBench、SWE-bench 拿下 SOTA。
- **Devstral**(2025-05):Agent 化代码模型,SWE-bench Verified 46.8%。

### 3.6 Mistral Large 3 / Mistral Medium 3(2026-02)

- **Mistral Large 3**:675B 总参数,**41B active MoE**;200K 上下文;在 MMLU-Pro(85.3%)、SWE-bench Verified(72.4%)逼近 GPT-5 / Claude Opus 4.5。
- **Mistral Medium 3**:更小体积(140B / 14B active)主打"性价比"路线,$0.4 / $2 per 1M tokens。
- **Mistral Small 4**:~22B 激活,适合本地/边缘部署。
- 全面采用 **MMLU-Pro / GPQA / MATH-500** 等新基准,不再使用旧 MMLU。

---

## 四、模型矩阵对比(2026-02 快照)

| 模型 | 总/激活参数 | 上下文 | 许可证 | 主要定位 | 旗舰基准 |
|---|---|---|---|---|---|
| **Mistral 7B v0.3** | 7B / 7B | 32K | Apache 2.0 | 边缘 / 微调基座 | MMLU 62.5% |
| **Mixtral 8x7B** | 47B / 13B | 32K | Apache 2.0 | 经典开源 MoE | MMLU 70.6% |
| **Mixtral 8x22B** | 141B / 39B | 64K | Apache 2.0 | 多语言 MoE | MMLU 77.75% |
| **Mistral Large 2** | 123B / 123B | 32K | MRL | 闭源旗舰(已 EOL) | MMLU 84.0% |
| **Codestral 25** | 80B / 25B | 256K | Apache 2.0 | 开源代码 | SWE-bench 53.6% |
| **Mistral Medium 3** | 140B / 14B | 128K | 商业 | 性价比旗舰 | MMLU-Pro 80.1% |
| **Mistral Large 3** | 675B / 41B | 200K | 商业 | 顶级闭源旗舰 | MMLU-Pro 85.3%,SWE-bench 72.4% |

---

## 五、关键能力与生态

### 5.1 MoE 架构创新

- **Top-2 Routing**:Mixtral 8x7B 每个 token 选 2 个专家,负载均衡采用 auxiliary loss。
- **专家可拆分推理**:可在 2 张 A100 上跑 Mixtral 8x7B,激活部分仅 12.9B。
- **2026 演进**:Mistral Large 3 引入 **专家分组 + 动态容量因子**,平均激活 41B(峰值 60B),在质量与成本间取得更优平衡。

### 5.2 工具调用与函数调用

- 原生支持 JSON Schema / Tool Use,**Force Tool Use** 模式可强制模型选择某工具。
- 兼容 OpenAI Function Calling 规范,迁移成本低。

### 5.3 部署与生态

- **官方**:vLLM、TensorRT-LLM、MLX、llama.cpp 均有官方支持。
- **云**:AWS Bedrock / Azure AI Foundry / GCP Vertex AI / OVHcloud / Scaleway 全支持。
- **企业**:SAP、BNP Paribas、Axel Springer、ASML、Veolia 等是公开客户。

### 5.4 Codestral / Devstral(代码)

- **Codestral 25** 是 2025-2026 年最强开源代码模型之一,256K 上下文、FIM 补全、Repo 级理解。
- **Devstral**(2025-05)针对 SWE-Agent 优化,每张 H100 跑 4 路并发仍可低延迟。

### 5.5 Le Chat(Mistral 官方 Chat)

- 多模态(图像/PDF/语音)、实时联网、Canvas 协作、Projects 项目隔离。
- 企业版 Le Chat Enterprise 支持 SSO、审计、私有化。

---

## 六、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **估值** | 110 亿欧元(2026 Q1 融资) |
| **企业 ARR** | ~5 亿欧元(2026 估) |
| **欧洲合规** | 首家通过 EU AI Act 高风险系统合规的开源模型公司 |
| **主权 AI** | 与法国、德国、意大利政府签订主权模型部署合同 |
| **开源策略** | 2025 起逐步从 MRL 转向 Apache 2.0,与 Llama 生态争夺"开放权重"心智 |
| **主要竞品** | Llama 4(Meta)、Qwen 3(阿里)、DeepSeek V3(深度求索)、GPT-OSS(OpenAI) |

---

## 七、生产最佳实践

1. **MoE 部署注意**:虽然激活参数小,但**总显存必须够装全部专家**。Mixtral 8x7B 需要 2×80GB;A100/H100 集群是首选。
2. **专家拆分推理**:用 vLLM `num_experts_per_tok` 调参,在延迟与吞吐间找平衡。
3. **滑动窗口调优**:长上下文场景(SWA)务必设 `sliding_window` 配合 `cache_layout` 配置,显存可降 40%。
4. **代码场景优先 Codestral 25 / Devstral**:通用模型写代码不如专用,HumanEval 差距 15-20 分。
5. **多语言场景选 Mixtral 8x22B**:英/法/德/意/西/葡/俄/中/日/韩原生支持,翻译质量优于 Llama 3。
6. **欧洲合规场景**:GDPR / EU AI Act 强制私有化时,Mistral 是为数不多同时满足"主权可控 + 顶级能力"的方案。
7. **混合部署**:轻量路由(Mistral 7B/Small)→ 主力(Mistral Medium 3)→ 复杂任务(Mistral Large 3),综合成本可降 50%。

---

## 八、See Also(官方源)

- 官方主页 [mistral.ai](https://mistral.ai/)
- 模型发布博客 [mistral.ai/news](https://mistral.ai/news/)
- Mistral 7B 论文 [arxiv.org/abs/2310.06825](https://arxiv.org/abs/2310.06825)
- Mixtral 8x7B 论文 [arxiv.org/abs/2401.04088](https://arxiv.org/abs/2401.04088)
- 文档(API/SDK/部署) [docs.mistral.ai](https://docs.mistral.ai/)
- La Plateforme(API 平台) [console.mistral.ai](https://console.mistral.ai/)
- 开源仓库 [github.com/mistralai](https://github.com/mistralai)
- Hugging Face 组织 [huggingface.co/mistralai](https://huggingface.co/mistralai)

---

## 九、相关概念卡

- [[概念/General/mixture-of-experts|Moe]]
- [[概念/mixture-of-experts|Mixture Of Experts]]
- [[概念/llama-series|Llama Series]]
- [[概念/edge-llm|Edge Llm]]
- [[概念/llama-cpp|Llama Cpp]]
- [[概念/vllm|Vllm]]
- [[概念/qwen-series|Qwen Series]]
- [[概念/deepseek-series|Deepseek Series]]
