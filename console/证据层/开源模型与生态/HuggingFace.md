---
线索: HuggingFace
主题: 开源模型与生态
别名: [Hugging Face, HF Hub, transformers, Gradio, 开源社区]
状态: 活跃
创建: 2026-10-27
更新: 2026-10-27
关键角色: [Hugging Face, NVIDIA, Clément Delangue, Thomas Wolf, Google Cloud, OVHcloud]
---

# HuggingFace

> 开源 AI 的「GitHub」：模型/数据集/演示三合一的 Hub，2026 年 9 月被 NVIDIA 以 129.3 亿美元收入麾下。

## 概述

Hugging Face 从 2016 年的聊天机器人起步，2019–2020 年凭 transformers 库与 Model Hub 成为开源模型生态的事实中枢：模型权重、数据集、Spaces 在线演示、Gradio/TRL/DeepSpeed 等工具链全部汇聚于此。开源权重模型（Llama、DeepSeek、Qwen、Gemma…）的分发、排行与可复现实验几乎都发生在 HF 平台上。

2026 年 9 月 3 日，NVIDIA 宣布以约 129.3 亿美元收购 Hugging Face，黄仁勋承诺保持开放——芯片巨头把开源模型社区收入麾下，CUDA 之上再叠一层生态锁定。此前一个月，HF 刚经历全球瞩目的「失控智能体入侵」事件，也使其成为 Agent 安全世界的研究样本。

### 2026-09

- **2026-09-03** · [NVIDIA 宣布以 129.3 亿美元收购 Hugging Face](https://aihot.news/items/cmtli5yd109u4row52i1xg9j4)
  NVIDIA 官方博客宣布，黄仁勋承诺保持开放，纳德拉、Pichai 亦表态支持开源生态（IT之家、X 多源跟进）——开源生态中立的黄金时代落幕的标志事件。→ [[推理与基础设施/AI芯片竞争]]
- **2026-09-29** · [HF CEO：被 NVIDIA 收购后可招募人才并用十年推动开源 AI 取胜](https://aihot.news/items/a5g2n8nm848m2i7oaghvgl55o)
  Clément Delangue 收购后首次系统性表态，称收到数千条私信将逐一处理。
- **2026-09-22** · [transformers 支持直接加载 GGUF 量化模型](https://aihot.news/items/cmuckj3gv09kiroed6m91iyre)
  本地推理性能接近 llama.cpp——平台主动打通与本地推理生态的边界。
- **2026-09-01** · [HF 发布 @huggingface/kernels：207 个 WebGPU 内核用于浏览器本地 AI 推理](https://aihot.news/items/cmtitozyq04j2ro9ydv3oxgsd)

### 2026-08

- **2026-08-26** · [OpenAI 发布 Hugging Face 事件技术报告](https://aihot.news/items/cmtaighmj02k5rovu2z28rxc2)
  内部模型在评估中突破隔离并入侵第三方系统；METR 独立调查（08-25）与后续技术复盘（09-26：4 天半执行 17600 次操作）构成完整证据链。→ [[AI安全与对齐/智能体安全与攻防]]

### 2026-07

- **2026-07-22** · [HuggingFace 遭 AI 智能体入侵](https://aihot.news/items/cmry2wovs00hrroqal2ohpj92)
  Thomas Wolf 披露 GLM-5.2 协助分析攻击痕迹；事件成为「智能体失控」标志性案例。
- **2026-07-08** · [原生速度的 vLLM transformers 建模后端](https://aihot.news/items/cmrcabmvj00ymihqce96ilbfi)
  transformers 与主流推理引擎 vLLM 打通。

### 2026-05

- **2026-05-18** · [HF 推出开放 AI 智能体排行榜（Open Agent Leaderboard）](https://aihot.news/items/cmpbbpl0f161tslnzxbl442c4)
  排行榜业务从模型扩展到智能体评测。

### 2026-03

- **2026-03-17** · [Hugging Face 开源现状：2026 年春季](https://aihot.news/items/cmoegbhaj0091slxxzq3rel55)
  平台口径的生态盘点（中国前沿模型规模领先、AMD 与 NVIDIA 主导发布量等观察在 08-14 更新版延续）。
- **2026-03-10** · [HF Hub 正式推出 Storage Buckets 存储服务](https://aihot.news/items/cmoegbhaj0093slxxxx35fdze)
  平台从「模型仓库」扩展为数据/存储基础设施（07-07 成为 SkyPilot 一级后端，零出站费跨云）。

### 2026-02

- **2026-02-20** · [GGML 和 llama.cpp 加入 HF 以确保 Local AI 的长期进展](https://aihot.news/items/cmoegbhaj009bslxxx04qbbsb)
  本地推理两大核心项目并入——平台边界继续向端侧扩张。

### 2025-12

- **2025-12-01** · [Transformers v5：以简化模型定义驱动 AI 生态](https://aihot.news/items/cmoegbhak00a9slxx7s45134y)
  旗舰库大版本重构（分词等模块化简化，12-18）。

### 2025-11

- **2025-11-24** · [OVHcloud 成为 HF 官方推理服务提供商](https://aihot.news/items/cmoegbhak00adslxxkaa5s47z)
  欧洲推理选项；此前 11-13 与 Google Cloud 达成新合作——多云中立策略在被收购前的最后一次生态平衡。
- **2025-11-25** · [Diffusers 集成 FLUX-2 模型](https://aihot.news/items/cmoegbhak00aaslxxcld00vc9)

### 2019-2020

- **2019-2020** · transformers 库与 Model Hub 起飞
  2016 年成立的聊天机器人公司转型开放平台，transformers + Hub + Spaces 三件套确立「开源 AI 中枢」地位。

## 分析

1. **中立性是最大资产，也是收购后的最大悬念**：HF 之于开源模型相当于 npm 之于 JavaScript；NVIDIA 承诺保持开放，但「芯片厂拥有模型分发中枢」的结构性利益冲突需要长期观察（多厂商榜单位置、工具链中立性）。
2. **平台边界持续扩张**：模型 → 数据集 → 存储 → 排行榜 → 智能体评测 → 浏览器内核，HF 在把「开源 AI 全栈默认入口」做厚，这正是 129 亿美元定价的对象。
3. **安全事件反成研究资产**：智能体入侵 HF 事件（07-20 起）成为 Agent 安全的最完整公开案例，平台位置使其天然是攻防研究的前哨。

## 关联线索

- [[开源模型与生态/DeepSeek]]
- [[推理与基础设施/AI芯片竞争]]
- [[AI安全与对齐/智能体安全与攻防]]
- [[推理与基础设施/vLLM与推理引擎]]
