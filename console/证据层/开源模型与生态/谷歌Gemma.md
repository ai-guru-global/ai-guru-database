---
线索: 谷歌Gemma
主题: 开源模型与生态
别名: [Gemma, Gemma 3, Gemma 3n, Gemma 4, MedGemma, DiffusionGemma]
状态: 活跃
创建: 2026-10-27
更新: 2026-10-27
关键角色: [Google DeepMind, Google]
---

# 谷歌Gemma

> Google 的开放权重副线：从 Gemini 技术下放的轻量模型到设备端多模态主力，开源生态里「大厂出品」的基准选项。

## 概述

Gemma 是 Google 基于 Gemini 技术打造的开放权重模型系列（2024-02 首发即以 Llama 级开放生态对手定位），主打小尺寸高性能与端侧/边缘部署。系列含主线 Gemma 1/2/3/4、移动优先的 3n、领域版（MedGemma 等）与实验线（DiffusionGemma 扩散语言模型）。

2026-04 Gemma 4 发布后，该系列成为「设备端多模态」事实标准之一：150M+ 下载量级（官方口径）、16GB VRAM 可跑 12B、配套 QAT 量化与 LiteRT 端侧部署链路；Google 同时以 Antigravity SDK 把 Gemma 4 送入本地开发工具链。

### 2026-09

- **2026-09-23** · [Antigravity SDK 支持本地模型，首发 Gemma 4 26B A4B 配合 LiteRT](https://aihot.news/items/cmued0oy602x2rommk0l8lw6q)
- **2026-09-15** · [Google 发布 TranslateGemma 等多语言 AI 成果](https://aihot.news/items/cmu2vlgqe03sxrowkkyx8bc1s)
  语言技术覆盖 300 多种语言——Gemma 系向多语言领域版扩展。

### 2026-07

- **2026-07-14** · [DiffusionGemma 发布：文本扩散模型实现 4 倍加速推理](https://aihot.news/items/cms3dqexj0aviro3fuu5mxbg)
  非自回归路线进入 Gemma 家族；07-31 技术报告、07-16 开发者指南跟进。
- **2026-07-29** · [开源引擎可在任何 M 系列 Mac 上以 2 GB 内存运行 Gemma 4 26B](https://aihot.news/items/cms6arrc700rbrotzo1wseql3)

### 2026-06

- **2026-06-05** · [谷歌发布 Gemma 4 QAT 检查点，支持消费级 GPU 和移动设备本地运行](https://aihot.news/items/cmq166ise0cu5sltrv7a12syq)
- **2026-06-02** · [Google DeepMind 发布 Gemma 4 12B：统一的无编码器多模态模型](https://aihot.news/items/cmq6qqqbp0axhsl5i2ow5j5co)
  6-03 Pichai/Hassabis 通报：150M+ 下载量里程碑、16GB VRAM 本地运行；vLLM 同步原生支持 DiffusionGemma。

### 2026-04

- **2026-04-02** · [Gemma 4 发布](https://aihot.news/items/cmnw1ypby00ocslc36i8pvvx8)
  多模态开放模型系列，官方口径「各尺寸最强的开源模型」；Hugging Face 同日欢迎页、开发者指南与边缘智能体能力解读齐发。→ [[基础模型/Gemini]]

### 2025-10

- **2025-10-23** · [Gemma 3 270M 发布：专为超高效 AI 打造的轻量模型](https://aihot.news/items/cmnwsdqam004tslagc6a4oqn0)
- **2025-10-25** · [MedGemma：健康 AI 开发领域最强的开源多模态模型](https://aihot.news/items/cmnwsdqal004aslagyidixbx4)

### 2025-05

- **2025-05-20** · [Gemma 3n 预览版发布：强大、高效、移动优先的 AI](https://aihot.news/items/cmnwsdqam0058slag3bk1lna4)

### 2024

- **2024-02** · Gemma 首发开放权重
  Gemma 7B/2B 发布，Google 正式入场开放权重生态；2024-06 Gemma 2、2025-03 Gemma 3（多模态、128K 上下文）相继迭代，确立与 Llama/Qwen 并列的开源三强格局。

## 分析

1. **Gemma 的战略位置是「入口」而非「声望」**：Google 用 Gemma 占领端侧与开发者默认选项（LiteRT/QAT/Antigravity 全链路），与 Gemini 闭源旗舰形成「开放引流、闭源变现」的分层——对照 Meta 的 Llama 曾以开源换生态霸权，Google 的目标更偏工具链渗透。
2. **下载量成为大厂开源的新军备**：150M+ 下载、AA 榜单、HF 欢迎页——开放权重的度量竞争从跑分扩展到分发规模。
3. **DiffusionGemma 是路线试探**：扩散语言模型若被验证为可量产，Gemma 系列可能率先把「非自回归」带出实验室。

## 关联线索

- [[基础模型/Gemini]]
- [[开源模型与生态/Llama]]
- [[开源模型与生态/HuggingFace]]
