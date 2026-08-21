---
title: "Ollama: 本地大模型部署平台"
category: "10-deployment-inference"
tags: ["deployment", "inference", "serving", "ollama", "llama.cpp", "local", "gguf", "modelfile"]
summary: "> **一句话理解**: Ollama 让在本地运行大模型变得超级简单——一条命令就能跑 Llama、Mistral、Qwen 等模型，是开发者和个人用户本地原型与轻量生产的首选。"
created: "2026-05-31"
updated: "2026-06-15"
tier: core
aliases:
  - "Ollama Deep Dive"
  - Ollama_Deep_Dive
sources: []

name_zh: "Ollama: 本地大模型部署平台"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Ollama: 本地大模型部署平台

> 中文简称：Ollama: 本地大模型部署平台

> **一句话理解**: Ollama 让在本地运行大模型变得超级简单——一条命令就能跑 Llama、Mistral、Qwen 等模型，是开发者和个人用户本地原型与轻量生产的首选。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [模型管理](#5-模型管理)
6. [API 与集成](#6-api-与集成)
7. [生产部署](#7-生产部署)
8. [高级特性](#8-高级特性)
9. [对比与选择](#9-对比与选择)

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
• 跨平台: Mac / Linux / Windows / Docker
• 资源高效: 自动优化显存使用
• OpenAI 兼容: 内置 REST API 服务
• 可扩展: 支持 Modelfile 自定义、多模态、工具调用
```

### 1.2 与 llama.cpp 的关系

```
Ollama vs llama.cpp
═══════════════════════════════════════════════════════════════════

llama.cpp:
───────────────────────────────────────────────────────────────────
• 底层推理引擎
• 纯 C/C++ 实现
• 提供最基础的模型加载、推理、API 能力
• 需要手动处理模型下载、配置、启动

Ollama:
───────────────────────────────────────────────────────────────────
• 基于 llama.cpp 构建的上层封装
• 提供模型管理、用户友好的 CLI、预配置模型库
• 自动下载模型、管理版本、提供 REST API
• 适合不想处理底层细节的用户

关系: Ollama = llama.cpp + 模型仓库 + 管理工具 + 简化 API
```

### 1.3 核心特性

| 特性 | 说明 |
|------|------|
| **模型库** | 预构建模型，一键 `ollama pull` |
| **Modelfile** | 模型配置 DSL，定制化行为 |
| **REST API** | 标准 API 接口，OpenAI 兼容 |
| **多模态** | 支持 LLaVA、BakLLaVA 等视觉模型 |
| **Tool Calling** | 原生函数调用，支持 Agent |
| **Context Window** | 支持 128K 长上下文 |
| **并发请求** | 多请求并行处理 |
| **GPU 加速** | 自动检测 CUDA / Metal / ROCm |
| **量化管理** | 自动选择合适量化版本 |

### 1.4 支持模型 (2026)

| 模型 | 参数量 | 适用场景 | 最低内存 |
|------|--------|----------|----------|
| **Llama 3.3** | 8B/70B | 通用对话 | 8GB/64GB |
| **Llama 3.2 Vision** | 11B/90B | 视觉理解 | 12GB/80GB |
| **Mistral** | 7B/24B/123B | 平衡性能 | 8GB/48GB/160GB |
| **Qwen2.5** | 7B/14B/32B/72B | 中文优化 | 8GB/32GB/64GB |
| **DeepSeek** | 7B/67B/236B | 代码/推理 | 8GB/48GB/160GB |
| **Phi-4** | 14B | 轻量强推理 | 16GB |
| **Gemma 2** | 2B/7B/27B | 轻量级 | 4GB/8GB/32GB |
| **Codellama** | 7B/34B | 代码生成 | 8GB/32GB |
| **LLaVA** | 7B/13B | 多模态 | 8GB/16GB |

### 1.5 发展历程

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| v0.1 | 2023.7 | 首个版本，Mac 支持 |
| v0.1.20 | 2023.10 | Linux/Windows 支持 |
| v0.1.30 | 2024.2 | 模型库扩展，API 完善 |
| v0.1.40 | 2024.8 | GPU 加速优化 |
| v0.3 | 2024.12 | OpenAI 兼容 API |
| v0.5 | 2025.6 | 多模态支持，WebUI |
| v0.6 | 2025.12 | Tool Calling，Agent 集成 |
| v0.7 | 2026.x | 企业功能，模型热加载 |

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
│   CLI / API                                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  ollama run llama3          # 命令行运行                 │   │
│   │  ollama serve               # 启动 API 服务              │   │
│   │  curl localhost:11434/api   # REST API                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    模型管理层                           │   │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │   │
│   │  │ Registry │  │  Pull   │  │  Create │  │  Push   │  │   │
│   │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    模型运行时 (llama.cpp)               │   │
│   │  ┌─────────┐  ┌─────────────────┐  ┌─────────────┐   │   │
│   │  │ Llama.cpp│  │ Flash Attention │  │Quantization │   │   │
│   │  └─────────┘  └─────────────────┘  └─────────────┘   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                      硬件抽象层                         │   │
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
| **Concurrent** | 并发请求 | 多用户共享 |

### 2.3 运行模式

```bash
# 交互式对话
ollama run llama3.2

# 单次预测
ollama run llama3.2 "解释量子纠缠"

# API 服务模式
ollama serve  # 启动 API 服务器

# 后台服务 (常驻)
ollama start
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
│  ollama pull llama3.2                                           │
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
│  ├── 初始化 llama.cpp 推理引擎                                  │
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
│       └── registry.ollama.ai/
│           └── library/
│               ├── llama3.2/
│               │   └── latest  # 指向具体 blob
│               └── ...
│   └── blobs/                 # 实际模型数据 (GGUF-like)
├── logs/                      # 运行日志
└── ollama.env                # 环境配置
```

---

## 4. 快速开始

### 4.1 安装

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows (WSL2 recommended)
winget install Ollama.Ollama

# Docker
docker pull ollama/ollama:latest
```

### 4.2 基本使用

```bash
# 拉取模型
ollama pull llama3.2          # 8B 模型 (~4.9GB)
ollama pull llama3.2:70b      # 70B 模型 (~43GB)
ollama pull mistral           # 7B 模型 (~4.1GB)
ollama pull qwen2.5:72b       # Qwen2.5 72B
ollama pull llava:13b         # 多模态模型

# 运行对话
$ ollama run llama3.2
>>> 你好，请介绍一下量子计算
# 模型输出回答...

# 中文模式
ollama run qwen2.5:7b "用中文解释什么是深度学习"
```

### 4.3 GPU 配置

```bash
# 查看 GPU 检测
ollama ps

# 输出示例:
# NAME            ID              SIZE      PROCESSOR    UNTIL
# llama3.2:latest    xxx...xxx    5.5 GB    100% GPU     Forever

# 多 GPU 配置 (环境变量)
OLLAMA_GPU_OVERHEAD=0.9 ollama run llama3.2  # 使用 90% GPU 显存

# 强制 CPU
OLLAMA_NO_GPU=1 ollama run llama3.2
```

---

## 5. 模型管理

### 5.1 Modelfile 配置

```dockerfile
# Modelfile 示例: 自定义 Llama3.2
FROM llama3.2

# 设置参数
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER num_ctx 4096
PARAMETER num_predict 1024

# 系统提示
SYSTEM """
你是一个专业的技术写作助手。
请用简洁清晰的语言解释复杂概念。
"""

# 聊天模板 (可选)
TEMPLATE """{{ if .System }}<|start_header_id|>system<|end_header_id|>
{{ .System }}<|eot_id|>{{ end }}{{ if .Prompt }}<|start_header_id|>user<|end_header_id|>
{{ .Prompt }}<|eot_id|>{{ end }}<|start_header_id|>assistant<|end_header_id|>
{{ .Response }}<|eot_id|>"""

# 许可证
LICENSE "MIT"
```

### 5.2 模型创建

```bash
# 从 Modelfile 创建自定义模型
ollama create my-llama -f Modelfile

# 运行自定义模型
ollama run my-llama

# 推送自定义模型到 registry
ollama push username/my-llama
```

### 5.3 模型导入

```bash
# 导入本地 GGUF 模型
ollama create codellama:custom -f ./codellama.Modelfile

# Modelfile 内容
# FROM ./codellama-34b.Q4_K_M.gguf
# PARAMETER temperature 0.5
# SYSTEM "You are a coding assistant."

# 查看本地模型
ollama list

# 删除模型
ollama rm llama3.2

# 复制模型
ollama cp llama3.2 my-llama3.2
```

### 5.4 多模态模型配置

```dockerfile
# Modelfile for LLaVA
FROM ./llava-13b-v1.6-vicuna-Q4_K_M.gguf
FROM ./llava-13b-v1.6-mmproj-Q4_0.gguf

TEMPLATE """{{ .System }}USER: {{ .Prompt }}
ASSISTANT: """

PARAMETER num_ctx 4096
SYSTEM "You are a helpful vision assistant."
```

---

## 6. API 与集成

### 6.1 REST API

```bash
# 启动 API 服务
ollama serve

# 聊天 API
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [
    {"role": "user", "content": "解释什么是 RAG"}
  ],
  "stream": false,
  "options": {
    "temperature": 0.7,
    "num_ctx": 4096
  }
}'

# 生成 API
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "写一首关于春天的诗",
  "stream": false
}'

# 列出已加载模型
curl http://localhost:11434/api/ps
```

### 6.2 OpenAI 兼容 API

```python
from openai import OpenAI

# Ollama 作为 OpenAI API 使用
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="not-needed"
)

response = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "你好"}],
    temperature=0.7,
    max_tokens=256
)
print(response.choices[0].message.content)
```

### 6.3 Tool Calling

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:11434/v1", api_key="not-needed")

response = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "北京今天天气怎么样？"}],
    tools=[{
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市天气",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string"}
                },
                "required": ["city"]
            }
        }
    }],
    tool_choice="auto"
)

print(response.choices[0].message.tool_calls)
```

### 6.4 多模态

```python
import base64

# 读取图片
with open("image.jpg", "rb") as f:
    image_base64 = base64.b64encode(f.read()).decode("utf-8")

response = client.chat.completions.create(
    model="llava:13b",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "描述这张图片"},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
        ]
    }]
)

print(response.choices[0].message.content)
```

### 6.5 LangChain 集成

```python
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage

# 初始化
llm = ChatOllama(model="llama3.2", base_url="http://localhost:11434")

# 使用
response = llm.invoke([HumanMessage(content="解释什么是 RAG")])
print(response.content)

# 流式
for chunk in llm.stream([HumanMessage(content="写一首诗")]):
    print(chunk.content, end="")
```

---

## 7. 生产部署

### 7.1 Docker 部署

```bash
# 基础 Docker 运行
docker run -d \
  -v ollama:/root/.ollama \
  -p 11434:11434 \
  --name ollama \
  ollama/ollama

# 带 GPU 的 Docker
docker run -d \
  --gpus all \
  -v ollama:/root/.ollama \
  -p 11434:11434 \
  --name ollama \
  ollama/ollama

# 拉取并运行模型
docker exec -it ollama ollama pull llama3.2
docker exec -it ollama ollama run llama3.2
```

### 7.2 Kubernetes 部署

```yaml
# ollama-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ollama
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ollama
  template:
    metadata:
      labels:
        app: ollama
    spec:
      containers:
      - name: ollama
        image: ollama/ollama:latest
        ports:
        - containerPort: 11434
        resources:
          limits:
            nvidia.com/gpu: "1"
        volumeMounts:
        - name: ollama-storage
          mountPath: /root/.ollama
      volumes:
      - name: ollama-storage
        persistentVolumeClaim:
          claimName: ollama-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: ollama
spec:
  selector:
    app: ollama
  ports:
  - port: 11434
    targetPort: 11434
```

### 7.3 环境变量配置

| 环境变量 | 说明 | 示例 |
|------|------|------|
| `OLLAMA_HOST` | 监听地址 | `0.0.0.0:11434` |
| `OLLAMA_MODELS` | 模型存储路径 | `/data/models` |
| `OLLAMA_NUM_PARALLEL` | 并发请求数 | `4` |
| `OLLAMA_MAX_LOADED_MODELS` | 最大同时加载模型数 | `2` |
| `OLLAMA_FLASH_ATTENTION` | 启用 Flash Attention | `1` |
| `OLLAMA_KV_CACHE_TYPE` | KV Cache 类型 | `q8_0` |
| `OLLAMA_NO_GPU` | 禁用 GPU | `1` |
| `CUDA_VISIBLE_DEVICES` | 指定 GPU | `0,1` |

---

## 8. 高级特性

### 8.1 并发与多模型

```bash
# 设置并发数
OLLAMA_NUM_PARALLEL=4 ollama serve

# 设置最大加载模型数
OLLAMA_MAX_LOADED_MODELS=2 ollama serve

# 查看运行中的模型
ollama ps
```

### 8.2 长上下文

```bash
# 通过 API 设置上下文窗口
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "总结以下长文档...",
  "options": {
    "num_ctx": 131072
  }
}'
```

### 8.3 性能调优

```bash
# 启用 Flash Attention
OLLAMA_FLASH_ATTENTION=1 ollama serve

# 使用 Q8 KV Cache 节省显存
OLLAMA_KV_CACHE_TYPE=q8_0 ollama serve

# 限制 GPU 显存使用
OLLAMA_GPU_OVERHEAD=0.8 ollama serve
```

### 8.4 监控

```bash
# 查看日志
ollama logs

# 通过 API 查看状态
curl http://localhost:11434/api/ps

#  Prometheus 指标 (需要额外配置)
# Ollama 本身不直接暴露 Prometheus，可通过 sidecar 或网关实现
```

---

## 9. 对比与选择

### 9.1 与其他本地部署方案对比

| 维度 | Ollama | llama.cpp | LM Studio | LocalAI |
|------|---------|------------|------------|----------|
| **易用性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **API 支持** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **模型支持** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **跨平台** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **工具集成** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **资源占用** | 中等 | 最低 | 中等 | 中等 |
| **与 llama.cpp 关系** | 上层封装 | 底层引擎 | 独立 | 兼容 GGUF |

### 9.2 使用场景

**✅ Ollama 最佳场景:**
- 快速原型和实验
- 个人开发和小规模使用
- 需要标准 API 的集成
- 跨平台部署
- CI/CD 中的模型测试
- 本地 Agent 和工具调用

**❌ 不适合场景:**
- 大规模生产部署 (用 vLLM/SGLang)
- 极致性能要求
- 多模型高并发联合服务
- 需要精细资源调度

### 9.3 性能基准

```
Ollama 性能参考 (Llama3.2 8B)
═══════════════════════════════════════════════════════════════════

Mac M4 Max, 36GB RAM:
• GPU: ~120 tokens/s
• CPU: ~25 tokens/s

RTX 4090, 24GB VRAM:
• GPU: ~140 tokens/s

首批延迟: ~50-200ms (GPU)
内存占用: ~6GB (8B Q4 模型)
```

### 9.4 与生产引擎的关系

```
Ollama 在推理栈中的位置
═══════════════════════════════════════════════════════════════════

开发阶段:
  Ollama → 本地快速验证模型效果

测试阶段:
  Ollama → CI/CD 中做集成测试

小规模生产:
  Ollama + Docker/K8s → 个人/小团队服务

大规模生产:
  vLLM / SGLang / TensorRT-LLM → 高吞吐低延迟

云 API:
  Groq / Together / Fireworks → 无需维护硬件
```

---

## 参考资源

- [Ollama 官网](https://ollama.com/)
- [Ollama GitHub](https://github.com/ollama/ollama)
- [Ollama Model Library](https://ollama.com/library)
- [Ollama Python SDK](https://github.com/ollama/ollama-python)
- [Ollama JavaScript SDK](https://github.com/ollama/ollama-js)
- [llama.cpp GitHub](https://github.com/ggerganov/llama.cpp)

---

*Last updated: 2026-06-15*
*Version: 2.0.0*

## Related

- [[10_部署推理/02_推理引擎/13_llama_cpp_深入分析|llama.cpp: 纯 C/C++ 本地 LLM 推理]]
- [[10_部署推理/02_推理引擎/29_vLLM_深入分析|vLLM: 生产级 LLM 推理引擎]]
- [[10_部署推理/02_推理引擎/23_SGLang_深入分析|SGLang: 高性能 LLM 推理框架]]
- [[10_部署推理/01_部署基础/03_部署推理.md|Deployment_Inference]]
- [[10_部署推理/01_部署基础/02_部署推理_2026.md|Deployment_Inference_2026]]
- [[10_部署推理/README.md|Deployment_Inference_for_dummy]]
- [[10_部署推理/01_部署基础/06_推理_简明指南.md|Inference-in-nutshell]]
- [[10_部署推理/02_推理引擎/17_LLM_推理引擎_选型_指南|LLM 推理引擎选型指南]]
