---
title: "Ollama: 本地大模型部署平台"
category: "09-deployment-inference"
tags: ["deployment", "inference", "serving", "vllm", "llama"]
summary: "> **一句话理解**: Ollama 让在本地运行大模型变得超级简单——一条命令就能跑 Llama、Mistral 等模型，告别复杂配置和云服务依赖。"
created: "2026-05-31"
updated: "2026-05-31"
---

# Ollama: 本地大模型部署平台

> **一句话理解**: Ollama 让在本地运行大模型变得超级简单——一条命令就能跑 Llama、Mistral 等模型，告别复杂配置和云服务依赖。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [API 与集成](#5-api-与集成)
6. [模型管理](#6-模型管理)
7. [对比与选择](#7-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Ollama: 本地 LLM 运行平台
═══════════════════════════════════════════════════════════════════

定位: 简化大模型本地部署，让每个人都能在个人设备上运行开源 LLM

核心理念:
───────────────────────────────────────────────────────────────────
• 零配置: 下载即运行，无需复杂设置
• 模型库: 预构建的模型，一键下载
• 跨平台: Mac/Linux/Windows/容器
• 资源高效: 自动优化显存使用
```

### 1.2 支持模型

| 模型 | 参数量 | 适用场景 | 最低内存 |
|------|--------|----------|----------|
| **Llama 3** | 8B/70B | 通用对话 | 8GB/64GB |
| **Mistral** | 7B | 平衡性能 | 8GB |
| **Qwen2** | 7B/14B/72B | 中文优化 | 8GB/32GB/64GB |
| **DeepSeek** | 7B/67B | 代码/推理 | 8GB/48GB |
| **Phi-3** | 3.8B | 轻量级 | 4GB |
| **Gemma** | 2B/7B | 轻量级 | 4GB/8GB |
| **Codellama** | 7B/34B | 代码生成 | 8GB/32GB |

### 1.3 发展历程

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| v0.1 | 2023.7 | 首个版本，Mac 支持 |
| v0.1.20 | 2023.10 | Linux/Windows 支持 |
| v0.1.30 | 2024.2 | 模型库扩展，API 完善 |
| v0.1.40 | 2024.8 | GPU 加速优化 |
| v0.5 | 2025.1 | 多模态支持，WebUI |
| v0.6 | 2025.8 | Agent 集成，工具调用 |

---

## 2. 核心概念

### 2.1 核心组件

```
Ollama 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                         Ollama 架构                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   CLI / API                                                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  ollama run llama3          # 命令行运行                 │   │
│   │  curl localhost:11434/api  # REST API                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    模型运行时 (LLM Runtime)             │   │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │   │
│   │  │ Llama.cpp│  │ Flash Attention │  │Quantization │  │   │
│   │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                      硬件抽象层                           │   │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │   │
│   │  │   CPU   │  │   GPU   │  │  Apple  │  │   ROCm  │  │   │
│   │  │         │  │ (CUDA) │  │  Silicon│  │         │  │   │
│   │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 关键特性

| 特性 | 说明 | 优势 |
|------|------|------|
| **Model Library** | 预构建模型库 | 一键下载运行 |
| **Modelfile** | 模型配置 DSL | 定制化模型行为 |
| **REST API** | 标准 API 接口 | 易于集成 |
| **Multi-modal** | 图像理解 | 支持视觉模型 |
| **Tool Calling** | 工具调用 | Agent 能力 |
| **Context Window** | 长上下文 | 128K 支持 |

### 2.3 运行模式

```bash
# 交互式对话
ollama run llama3

# 单次预测
ollama run llama3 "解释量子纠缠"

# API 服务模式
ollama serve  # 启动 API 服务器
```

---

## 3. 架构设计

### 3.1 工作流程

```
Ollama 运行流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│ 1. 模型下载                                                      │
│ ───────────────────────────────────────────────────────────────  │
│  ollama pull llama3                                             │
│  ├── 检查本地缓存                                                │
│  ├── 下载模型文件 (到 ~/.ollama/models)                         │
│  └── 验证完整性                                                  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ 2. 模型加载                                                      │
│ ───────────────────────────────────────────────────────────────  │
│  ├── 读取 Modelfile 配置                                        │
│  ├── 分配显存 (自动检测可用 GPU)                                │
│  ├── 初始化推理引擎                                             │
│  └── 准备 KV Cache                                              │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ 3. 推理执行                                                      │
│ ───────────────────────────────────────────────────────────────  │
│  Token → Model → Token → Model → ...                           │
│  └── Streaming 输出                                             │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 存储结构

```
~/.ollama/
├── models/                    # 模型文件存储
│   └── manifests/             # 模型清单
│       ├── registry/
│       │   └── llama3/
│       │       └── 6b/
│       │           └── ...    # GGUF 格式模型
├── logs/                      # 运行日志
└── ollama.env                # 环境配置
```

---

## 4. 快速开始

### 4.1 安装

```bash
# macOS
curl -fsSL https://ollama.com/install.sh | sh

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows (WSL2 recommended)
winget install Ollama.Ollama
```

### 4.2 基本使用

```bash
# 拉取模型
ollama pull llama3          # 8B 模型 (~4.7GB)
ollama pull llama3:70b      # 70B 模型 (~40GB)
ollama pull mistral         # 7B 模型 (~4.1GB)
ollama pull qwen2:72b       # Qwen2 72B

# 运行对话
$ ollama run llama3
>>> 你好，请介绍一下量子计算
# 模型输出回答...

# 中文模式
ollama run qwen2:7b "用中文解释什么是深度学习"
```

### 4.3 GPU 配置

```bash
# 查看 GPU 检测
ollama info

# 输出示例:
# CUDA Capable: true
# Memory: 24GB
# Models: 2 loaded

# 多 GPU 配置
OLLAMA_GPU_OVERHEAD=0.9 ollama run llama3  # 使用 90% GPU 显存
```

---

## 5. API 与集成

### 5.1 REST API

```bash
# 启动 API 服务
ollama serve

# 聊天 API
curl http://localhost:11434/api/chat -d '{
  "model": "llama3",
  "messages": [
    {"role": "user", "content": "解释什么是 RAG"}
  ],
  "stream": false
}'

# 生成 API
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "写一首关于春天的诗",
  "stream": false
}'
```

### 5.2 Python SDK

```python
from ollama import chat, generate

# 聊天
response = chat(model='llama3', messages=[
    {'role': 'user', 'content': '你好'}
])
print(response['message']['content'])

# 生成
response = generate(model='qwen2:7b', prompt='解释量子计算')
print(response['response'])
```

### 5.3 LangChain 集成

```python
from langchain_community.chat_models import ChatOllama
from langchain_core.messages import HumanMessage

# 初始化
llm = ChatOllama(model="llama3", base_url="http://localhost:11434")

# 使用
response = llm.invoke([HumanMessage(content="解释什么是 RAG")])
print(response.content)
```

### 5.4 OpenAI 兼容

```python
from openai import OpenAI

# Ollama 作为 OpenAI API 使用
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="not-needed"
)

response = client.chat.completions.create(
    model="llama3",
    messages=[{"role": "user", "content": "你好"}]
)
print(response.choices[0].message.content)
```

---

## 6. 模型管理

### 6.1 Modelfile 配置

```dockerfile
# Modelfile 示例: 自定义 Llama3
FROM llama3

# 设置参数
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_ctx 4096

# 系统提示
SYSTEM """
你是一个专业的技术写作助手。
请用简洁清晰的语言解释复杂概念。
"""

# 模板
TEMPLATE """
{{ if .System }}<|im_start|>system
{{ .System }}<|im_end|>
{{ end }}
{{ if .Prompt }}<|im_start|>user
{{ .Prompt }}<|im_end|>
{{ end }}
<|im_start|>assistant
"""
```

### 6.2 模型创建

```bash
# 从 Modelfile 创建自定义模型
ollama create my-llama -f Modelfile

# 运行自定义模型
ollama run my-llama
```

### 6.3 模型导入

```bash
# 导入 GGUF 格式模型
ollama create codellama:custom -f ./codellama.Modelfile

# 从 HuggingFace 导入
# 需要先转换格式 (使用 llm/export)
```

---

## 7. 对比与选择

### 7.1 与其他本地部署方案对比

| 维度 | Ollama | llama.cpp | LM Studio |
|------|---------|------------|------------|
| **易用性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **API 支持** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **模型支持** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **跨平台** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **工具集成** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **资源占用** | 中等 | 最低 | 中等 |

### 7.2 使用场景

**✅ Ollama 最佳场景:**
- 快速原型和实验
- 个人开发和小规模使用
- 需要标准 API 的集成
- 跨平台部署
- CI/CD 中的模型测试

**❌ 不适合场景:**
- 大规模生产部署 (用 vLLM/SGLang)
- 极致性能要求
- 多模型联合服务

### 7.3 性能基准

```
Ollama 性能参考 (Llama3 8B, M2 Pro, 32GB RAM)
═══════════════════════════════════════════════════════════════════

吞吐量: ~30 tokens/s (CPU) / ~150 tokens/s (GPU)
首批延迟: ~500ms (GPU)
内存占用: ~6GB (8B 模型)
```

---

## 参考资源

- [Ollama 官网](https://ollama.com/)
- [Ollama GitHub](https://github.com/ollama/ollama)
- [Ollama Model Library](https://ollama.com/library)
- [Ollama Python SDK](https://github.com/ollama/ollama-python)

---

*Last updated: 2026-04-24*
*Version: 1.0.0*

## Related

- [[09_Deployment_Inference/Deployment_Inference.md|Deployment_Inference]]
- [[09_Deployment_Inference/Deployment_Inference_2026.md|Deployment_Inference_2026]]
- [[09_Deployment_Inference/Deployment_Inference_for_dummy.md|Deployment_Inference_for_dummy]]
- [[09_Deployment_Inference/Inference-in-nutshell.md|Inference-in-nutshell]]
- [[09_Deployment_Inference/JVM_AI_Deployment.md|JVM_AI_Deployment]]
