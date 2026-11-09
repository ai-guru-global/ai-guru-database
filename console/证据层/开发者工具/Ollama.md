---
线索: Ollama
主题: 开发者工具
别名: [ollama]
状态: 活跃
创建: 2026-07-30
更新: 2026-09-04
关键角色: [Ollama, Meta, llama.cpp 社区]
---

# Ollama

> 本地大模型运行工具的事实标准：一条命令跑开源模型，成为开发者接触开源 LLM 的第一入口。

## 概述

Ollama 2023 年由前 Docker 员工创立，以「Docker 式体验跑本地大模型」为定位：`ollama run llama3` 一条命令完成模型下载、量化加载与服务暴露，底层基于 llama.cpp 推理。它把开源模型的使用门槛从「会编译、懂量化」降到「会敲命令」，配合 OpenAI 兼容 API 成为本地开发、隐私敏感场景与边缘部署的默认选择。2026 年 7 月，Ollama 完成 8800 万美元融资。

该线索追踪 Ollama 的产品演进与本地推理生态（llama.cpp、量化格式、桌面端应用）的发展。

### 2026-09

- **2026-09-01** · [Hugging Face 发布 @huggingface/kernels，提供 207 个 WebGPU 内核用于浏览器本地 AI 推理](https://aihot.virxact.com/items/cmtitozyq04j2ro9ydv3oxgsd)
  HF 官方博客发布 kernels 库，207 个 WebGPU 内核让浏览器成为零安装的本地推理运行时，本地 AI 的使用入口从命令行进一步下沉到网页端。

### 2026-07

- **2026-07-20** · [Ollama 获 8800 万美元融资](https://aihot.virxact.com/items/cmrsl3weh0a3pbiwmdqtrjycc)
  Hacker News 报道 Ollama 获 8800 万美元融资以加速开放模型生态；此前 Tomer Tunguz 的 VC 分析披露本轮为 Theory 领投的 B 轮，开发者数已达 890 万。

### 2026-02

- **2026-02-20** · [GGML 与 llama.cpp 加入 Hugging Face](https://aihot.virxact.com/items/cmoegbhaj009bslxxx04qbbsb)
  Hugging Face 官方博客宣布 GGML/llama.cpp 项目加入 HF「以确保 Local AI 的长期进展」，Ollama 赖以构建的底层推理引擎获得长期组织与资金保障。

### 2025-07

- **2025-07** · Ollama 发布桌面 GUI 应用
  在 CLI 之外推出 macOS/Windows 图形界面，支持多模态输入与文档拖拽，从开发者工具向普通用户产品延伸。

### 2025-01

- **2025-01** · DeepSeek-R1 引爆本地部署潮
  R1 蒸馏版发布后 Ollama 下载量激增，「本地跑推理模型」成为现象级需求，Ollama 是绝大多数教程的默认工具。

### 2024-07

- **2024-07** · 支持 Llama 3.1 与工具调用
  405B 级模型日发布即支持，同期加入 function calling 能力，本地模型开始接入 Agent 工作流。

### 2024-02

- **2024-02** · 提供 OpenAI 兼容 API
  本地服务暴露 `/v1/chat/completions` 接口，任何基于 OpenAI SDK 的应用改一行 base_url 即可切换本地模型——极大扩展了生态兼容面。

### 2023-07

- **2023-07** · Ollama 开源发布
  伴随 Llama 2 开放商用的时间窗口发布，Modelfile（类 Dockerfile 的模型定制格式）与模型库设计确立了「模型即镜像」的产品隐喻。

## 分析

1. **体验即壁垒**：Ollama 的核心技术（推理引擎）来自 llama.cpp，其价值在于封装——安装、量化选择、显存管理、API 服务全部隐藏。开发者工具的胜负经常不在底层技术而在体验完整度。

2. **开源模型的分发渠道**：Ollama 模型库事实上成为开源模型触达开发者的关键渠道，模型厂商发布日适配 Ollama 已成惯例——它在开源生态中扮演类似 npm/Docker Hub 的基础设施角色。

3. **商业化悬念**：免费开源 + 无明确收入模式，长期依赖融资。企业版、托管服务或与硬件厂商（本地 AI PC）的合作是可能路径，其商业化选择将影响本地推理生态的中立性。

## 关联线索

- [[开源模型与生态/Llama]]
- [[开源模型与生态/DeepSeek]]
- [[推理与基础设施/vLLM与推理引擎]]
