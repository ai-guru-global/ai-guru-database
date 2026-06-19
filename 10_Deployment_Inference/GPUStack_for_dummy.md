---
title: 'GPUStack 入门指南 🚀'
category: '09-deployment-inference'
tags: ["deployment", "inference", "serving", "gpustack", "maas", "for-dummy"]
summary: '> **一句话秒懂**: GPUStack 就像一个"AI 模型应用商店 + 机房管家"——把各种 GPU 统一管理起来, 点几下就能部署大模型, 还能用 OpenAI 一样的 API 调用。'
created: '2026-06-15'
updated: '2026-06-15'
---

# GPUStack 入门指南 🚀

> **一句话秒懂**: GPUStack 就像一个"AI 模型应用商店 + 机房管家"——把各种 GPU 统一管理起来, 点几下就能部署大模型, 还能用 OpenAI 一样的 API 调用。

---

## 为什么需要 GPUStack?

想象一下这些场景:

- 😫 公司买了几块 NVIDIA、几块 AMD、还有昇腾 NPU, 怎么统一管理?
- 😫 想在本地跑 DeepSeek / Qwen, 但命令行太复杂?
- 😫 做了一个 RAG 应用, 需要同时调用 LLM + Embedding + Reranker, 接口不统一?
- 😫 想让团队像调用 OpenAI API 一样调用内部模型?

**GPUStack 就是解决这些问题的工具。**

---

## GPUStack 是什么?

```
GPUStack = GPU 集群管家 + 私有模型商店 + OpenAI 风格 API
═══════════════════════════════════════════════════════════════════

传统方式:
┌─────────────────────────────────────────────────────────────────┐
│  买 GPU → 装驱动 → 配 CUDA → 下模型 → 写启动脚本 → 调参数 → 写 API │
│  每一步都可能踩坑 😭                                              │
└─────────────────────────────────────────────────────────────────┘

用 GPUStack:
┌─────────────────────────────────────────────────────────────────┐
│  装 GPUStack → 点"添加 Worker" → 在模型目录点"部署" → 直接调用 API │
│  全程图形化, 像用云平台一样简单 😊                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 它能做什么?

### 1. 统一管理异构 GPU

```
你的 GPU 可能是:
├── NVIDIA 显卡 (游戏卡 / 计算卡)
├── AMD 显卡
├── 苹果 Mac 的 M 系列芯片
├── 昇腾 NPU (国产)
├── 海光 DCU (国产)
└── 摩尔线程 GPU (国产)

GPUStack 把它们全部变成一个"大资源池", 统一调度。
```

### 2. 部署多种 AI 模型

| 模型类型 | 例子 | 用途 |
|----------|------|------|
| 大语言模型 (LLM) | Qwen、DeepSeek、Llama | 聊天、问答、Agent |
| 视觉模型 (VLM) | Qwen2.5-VL、LLaVA | 看图说话 |
| 向量模型 (Embedding) | BGE、Jina | 文本转向量, RAG 用 |
| 重排序模型 (Reranker) | BGE-Reranker | 搜索结果排序 |
| 图像生成 | Stable Diffusion、FLUX | 文生图、图生图 |
| 语音模型 | Whisper、CosyVoice | 语音转文字、文字转语音 |

### 3. 提供 OpenAI 兼容 API

```
部署完模型后, 你可以这样调用:

POST http://你的服务器/v1/chat/completions
Authorization: Bearer 你的API密钥

请求内容和调用 OpenAI 一模一样!
```

---

## 核心概念 (用大白话解释)

### Server (大脑)

```
Server = 控制面板 + 调度中心

它负责:
✓ 展示 Web 界面
✓ 决定模型跑在哪块 GPU 上
✓ 管理用户和 API Key
✓ 把请求转发给合适的 Worker
```

### Worker (干活的机器)

```
Worker = 插了 GPU 的服务器

它负责:
✓ 实际运行模型
✓ 把 GPU 信息汇报给 Server
✓ 处理推理请求

一个 GPUStack 集群 = 1 个 Server + N 个 Worker
```

### 模型目录 (Catalog)

```
模型目录 = GPUStack 官方帮你验证过的"模型应用商店"

好处:
✓ 不用自己找模型
✓ 参数已经调好了
✓ 点一下就能部署
```

### 推理后端 (Backend)

```
推理后端 = 真正执行推理的引擎

GPUStack 支持多个引擎:
├── vLLM      → 生产环境常用, 吞吐高
├── SGLang    → 性能更强, 前缀缓存快
├── llama-box → 基于 llama.cpp, 跨平台好, 支持 GGUF
├── vox-box   → 专门跑语音模型
└── MindIE    → 昇腾 NPU 专用

大部分情况 GPUStack 会自动选择, 你不用管。
```

---

## 快速开始

### 第一步: 准备一台机器

最低要求:
- 一台有 NVIDIA GPU 的 Linux 服务器 (新手推荐)
- 或者苹果 Mac (M 系列芯片)
- 或者 Windows 电脑

### 第二步: 一键安装

**Linux / Mac 用户:**

```bash
curl -sfL https://get.gpustack.ai | sh -s -
```

**Windows 用户 (管理员 PowerShell):**

```powershell
Invoke-Expression (Invoke-WebRequest -Uri "https://get.gpustack.ai" -UseBasicParsing).Content
```

装好后, 打开浏览器访问 `http://你的服务器IP`。

### 第三步: 登录

```
用户名: admin
密码:   安装时自动生成的初始密码
        (Linux 在 /var/lib/gpustack/initial_admin_password)
```

### 第四步: 部署第一个模型

```
1. 点顶部菜单 "Catalog" (模型目录)
2. 找到一个模型, 比如 Qwen3-0.6B
3. 点模型卡片
4. 看看兼容性检查是否通过
5. 点 "Save" (保存/部署)
6. 等状态变成 "Running" (运行中)
```

### 第五步: 在 Playground 聊天

```
1. 点 "Playground - Chat"
2. 右上角选择刚部署的模型
3. 输入: "你好, 介绍一下自己"
4. 看到回复, 成功! 🎉
```

### 第六步: 用 API 调用

```bash
export GPUSTACK_API_KEY="你的API密钥"
export GPUSTACK_SERVER="http://你的服务器IP"

curl $GPUSTACK_SERVER/v1/chat/completions \
  -H "Authorization: Bearer $GPUSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3-0.6b",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

---

## 常见使用场景

### 场景 1: 公司内部私有 ChatGPT

```
目的: 让员工不用把数据发到公网

做法:
1. 在公司内网部署 GPUStack
2. 部署 Qwen / DeepSeek 等开源模型
3. 给员工发 API Key
4. 内部应用全部调用私有 API
```

### 场景 2: RAG 知识库

```
目的: 让 AI 基于公司文档回答问题

需要同时部署:
├── Embedding 模型 (把文档变成向量)
├── Reranker 模型 (排序搜索结果)
└── LLM (生成最终回答)

GPUStack 可以同时提供这 3 种服务。
```

### 场景 3: 多 GPU 集群共享

```
目的: 实验室/公司多人共享 GPU

做法:
1. 每台 GPU 机器装 GPUStack Worker
2. 大家通过 Web UI 申请部署模型
3. GPUStack 自动分配 GPU, 避免冲突
```

---

## GPUStack vs 其他工具

| 工具 | 特点 | 适合谁 |
|------|------|--------|
| **GPUStack** | 集群管理 + 多模型 + 多硬件 | 团队/企业 |
| **Ollama** | 单机本地, 最简单 | 个人开发者 |
| **vLLM** | 纯推理引擎, 高性能 | 工程师 |
| **BentoML** | 模型打包成服务 | 微服务架构 |

**如果你只是想在自己电脑上快速试一个大模型 → 用 Ollama。**

**如果你要管理多台机器、多种 GPU、多种模型 → 用 GPUStack。**

---

## 注意事项

| ⚠️ 注意 | 说明 |
|----------|------|
| **先改密码** | 首次登录后立即修改 admin 默认密码 |
| **Worker 系统** | 生产环境的 GPU Worker 最好用 Linux |
| **显存要够** | 部署前看看模型需要多少显存 |
| **网络通畅** | 默认从 Hugging Face / ModelScope 下载模型 |
| **共享存储** | 多节点分布式推理需要模型文件在所有机器上可访问 |

---

## 下一步

- 想深入了解? → [[10_Deployment_Inference/GPUStack_Deep_Dive|GPUStack 深度解析]]
- 想对比推理引擎? → [[10_Deployment_Inference/README|模型部署与推理目录]]
- 想学 RAG? → [[14_RAG_Systems/README_for_dummy|RAG 系统小白版]]

---

*本文是 [[10_Deployment_Inference/GPUStack_Deep_Dive|GPUStack 深度解析]] 的简化版, 适合零基础读者。*

## Related
- [[10_Deployment_Inference/GPUStack_Deep_Dive|GPUStack: 开源 GPU 集群管理与模型服务平台]]
- [[10_Deployment_Inference/Ollama_Deep_Dive|Ollama: 本地大模型部署平台]]
- [[10_Deployment_Inference/vLLM_Deep_Dive|vLLM: 生产级 LLM 推理引擎]]
- [[14_RAG_Systems/README_for_dummy|RAG 系统 — 小白版]]
