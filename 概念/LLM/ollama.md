---
title: "Ollama 本地 LLM 运行工具 (Ollama Local LLM Runtime)"
category: -concepts
tags: ["ollama", "local-llm", "gguf", "quantization", "llama-cpp", "ai-stack-ops"]
relationships:
  - target: "概念/llm-inference-engine"
    type: related_to
  - target: "概念/edge-llm"
    type: related_to
  - target: "概念/gguf"
    type: related_to
  - target: "概念/llama-cpp"
    type: related_to
  - target: "概念/model-serving"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "Ollama 是面向开发者的本地 LLM 运行工具，一行命令下载、运行、管理大语言模型，支持 GGUF 量化格式，提供 OpenAI 兼容 API。AI Stack 推理服务指南中列为备选推理方案。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
name_zh: "Ollama 本地 LLM 运行工具"
---

# Ollama 本地 LLM 运行工具

> 中文简称：Ollama 本地 LLM 运行工具

> **一句话理解**: Ollama 是"本地版 Docker for LLM"——一行命令 `ollama run llama3` 就能在自己电脑上跑大模型，零配置开箱即用。

---

## 1. 核心定位

| 维度 | 信息 |
|------|------|
| **类型** | 本地 LLM 运行工具 |
| **开源** | MIT License |
| **平台** | macOS / Linux / Windows |
| **底层** | 基于 llama.cpp |
| **格式** | GGUF 量化格式 |
| **API** | OpenAI 兼容 REST API |
| **安装** | `curl -fsSL https://ollama.com/install.sh \| sh` |

---

## 2. 核心命令

### 2.1 基础操作

```bash
# 运行模型（自动下载）
ollama run llama3

# 列出已安装模型
ollama list

# 拉取模型
ollama pull llama3

# 删除模型
ollama rm llama3

# 查看模型信息
ollama show llama3

# 启动 API 服务（默认 11434 端口）
ollama serve
```

### 2.2 常用模型

| 模型 | 大小 | 说明 |
|------|------|------|
| `llama3` | 4.7 GB | Meta Llama 3 8B |
| `llama3:70b` | 39 GB | Meta Llama 3 70B |
| `qwen2.5` | 4.7 GB | 通义千问 2.5 7B |
| `qwen2.5:72b` | 41 GB | 通义千问 2.5 72B |
| `deepseek-r1` | 4.7 GB | DeepSeek R1 蒸馏 8B |
| `deepseek-r1:70b` | 39 GB | DeepSeek R1 蒸馏 70B |
| `codellama` | 3.8 GB | 代码专用 |
| `mistral` | 4.1 GB | Mistral 7B |
| `phi3` | 2.3 GB | 微软 Phi-3 Mini |

---

## 3. OpenAI 兼容 API

### 3.1 使用示例

```bash
# OpenAI 兼容的 Chat Completions API
curl http://localhost:11434/api/chat -d '{
  "model": "llama3",
  "messages": [
    {"role": "user", "content": "什么是 KV Cache？"}
  ],
  "stream": false
}'
```

### 3.2 Python 客户端

```python
import openai

client = openai.OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # 任意值
)

response = client.chat.completions.create(
    model="llama3",
    messages=[
        {"role": "user", "content": "解释 Transformer 架构"}
    ]
)
print(response.choices[0].message.content)
```

---

## 4. 与专业推理框架对比

| 维度 | Ollama | vLLM | SGLang | llama.cpp |
|------|--------|------|--------|-----------|
| **定位** | 开发者本地体验 | 生产级推理服务 | 生产级推理服务 | 底层推理引擎 |
| **安装难度** | 极低（一行命令） | 中 | 中 | 低 |
| **性能** | 中等 | 高 | 高 | 中高 |
| **并发** | 低（单用户） | 高（生产级） | 高 | 低 |
| **量化** | GGUF | AWQ/GPTQ/FP8 | AWQ/GPTQ/FP8 | GGUF |
| **API** | OpenAI 兼容 | OpenAI 兼容 | OpenAI 兼容 | HTTP API |
| **KV Cache** | 基础 | PagedAttention | RadixAttention | 基础 |
| **适用场景** | 开发测试、个人使用 | 生产部署 | 生产部署 | 嵌入式/边缘 |

---

## 5. Modelfile 自定义模型

```dockerfile
# Modelfile 示例
FROM llama3

# 系统提示
SYSTEM "你是一个专业的 AI 架构师，擅长解释复杂的技术概念。"

# 参数设置
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_ctx 8192

# 模板
TEMPLATE """{{ .System }}
{{ .Prompt }}
"""
```

```bash
# 创建自定义模型
ollama create my-architect -f Modelfile

# 运行自定义模型
ollama run my-architect
```

---

## 6. 在 AI Stack 中的角色

Ollama 在 AI Stack 推理服务指南中作为备选推理方案：

| 层级 | 工具 | 适用场景 |
|------|------|----------|
| **生产级** | A-Speed (AI Stack 内置) | 生产环境，高并发 |
| **生产级** | vLLM / SGLang | 自建生产推理服务 |
| **开发级** | Ollama | 开发测试、PoC 验证 |
| **底层** | llama.cpp (llama-server) | 嵌入式/边缘场景 |

### 典型工作流

```
AI Stack 模型开发流程
│
├── 1. 本地探索 → Ollama 快速体验模型效果
├── 2. 性能测试 → vLLM/SGLang benchmark
├── 3. 生产部署 → A-Speed 加速部署到 AI Stack
└── 4. 运维监控 → AI Stack 控制台 + nvidia-smi
```

---

## 7. 硬件要求

| 模型大小 | 最低 RAM | 推荐 RAM | 速度参考 |
|----------|---------|---------|----------|
| 7B Q4 | 4 GB | 8 GB | ~20 tok/s (CPU) |
| 13B Q4 | 8 GB | 16 GB | ~10 tok/s (CPU) |
| 34B Q4 | 20 GB | 32 GB | ~5 tok/s (CPU) |
| 70B Q4 | 40 GB | 64 GB | ~2 tok/s (CPU) |

> GPU 加速可显著提升速度：Apple Silicon M系列 ~60-100 tok/s (7B)，NVIDIA GPU ~100+ tok/s (7B)

---

## 8. 常见问题

| 问题 | 解决 |
|------|------|
| 模型下载慢 | 使用镜像源或 `ollama pull` 重试 |
| 内存不足 | 使用更小的量化版本（Q4_K_M） |
| API 超时 | 增大 `num_ctx` 或减小生成长度 |
| GPU 未使用 | 检查 CUDA/Metal 支持，`OLLAMA_GPU_LAYERS` |

---

## Related

- [[概念/llm-inference-engine]] — LLM 推理引擎
- [[概念/edge-llm]] — 端侧 LLM
- [[概念/gguf]] — GGUF 量化格式
- [[概念/llama-cpp]] — llama.cpp 推理引擎
- [[概念/model-serving]] — 模型服务
- [[概念/a-speed]] — A-Speed 加速推理
- [[12_架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析

---

## 2026 Ollama 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Ollama 0.6+** | 本地 LLM 运行工具 | GA |
| **模型库** | 一键拉取运行开源模型 | GA |
| **OpenAI 兼容** | 兼容 OpenAI API 格式 | GA |
| **多平台** | macOS/Linux/Windows 全支持 | GA |
| **GPU 加速** | 自动检测并使用 GPU | GA |

## 生产最佳实践

1. **开发环境**：本地开发/测试用 Ollama，生产用 vLLM/TRT-LLM
2. **模型选择**：根据硬件选择合适大小的模型
3. **量化版本**：显存不足时用 Q4 量化版本
4. **API 服务**：用 Ollama 的 OpenAI 兼容 API 快速集成
5. **资源限制**：设置 OLLAMA_MAX_LOADED_MODELS 限制并发模型数
