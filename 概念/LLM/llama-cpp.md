---
title: "llama.cpp（C++ LLM 推理引擎）"
category: -concepts
tags: [llama-cpp, gguf, llama, edge-inference, cpu-inference, quantization]
aliases:
  - "llama.cpp"
  - "llama-cpp-python"
  - "GGML"
relationships:
  - target: "概念/gguf"
    type: uses_format
sources:
  - 部署推理/Inference_Engines/llama_cpp_Deep_Dive.md
  - 概念/gguf.md
summary: "llama.cpp 是用纯 C++ 实现的 LLM 推理引擎，专为 CPU 和边缘设备优化，支持 GGUF 量化格式；在消费级硬件（Mac / 普通 PC）上即可运行 7B-70B 模型，是本地 LLM 部署的事实标准。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.90
created: 2026-06-24
updated: 2026-07-21
---

# llama.cpp（C++ LLM 推理引擎）

## 核心要点

- **定位**：本地 / CPU / 边缘设备 LLM 推理的事实标准。
- **核心特性**：
  - **纯 C++ 实现**：无 Python 依赖，资源占用极低
  - **GGUF 格式**：自研量化模型格式（取代旧 GGML）
  - **CPU 优化**：AVX2 / AVX-512 / NEON 多指令集
  - **GPU 后端**：CUDA / Metal / ROCm / Vulkan / SYCL（可选）
  - **量化支持**：Q2_K / Q3_K / Q4_K / Q5_K / Q6_K / Q8_0 / F16
  - **Python 绑定**：llama-cpp-python
- **典型场景**：
  - MacBook M-series 本地跑 70B（量化后 4-bit ~40GB）
  - 树莓派 / 边缘设备
  - 隐私敏感场景（数据不出本地）
  - CI/CD 中的小模型推理
  - Ollama 后端

## 一句话解释

> llama.cpp = "让 MacBook 也能跑 70B 模型"；纯 C++ + 量化，把 LLM 推理门槛降到消费级硬件。

## 与 GPU 推理引擎对比

| 引擎 | 平台 | 性能 | 模型规模 | 适合 |
|------|------|------|---------|------|
| **llama.cpp** | CPU + 边缘 GPU | 1-5x HF | 7B-70B | 本地、边缘 |
| **vLLM** | NVIDIA GPU | 14-24x | 7B-700B | 生产服务器 |
| **TGI** | NVIDIA GPU | 10-18x | 7B-700B | HF 生态 |
| **MLC LLM** | 手机 / 浏览器 | 5-10x | 1B-13B | 端侧 |
| **Core ML** | Apple Silicon | 5-10x | 1B-13B | macOS / iOS |

## 典型使用

```bash
# 1. CLI 直接推理
./llama-cli -m qwen2.5-7b.Q4_K_M.gguf -p "你好，请自我介绍" -n 200

# 2. Server 模式（OpenAI 兼容）
./llama-server -m model.gguf --port 8080
# 调用：curl http://localhost:8080/v1/chat/completions -d '{...}'

# 3. Python 绑定
pip install llama-cpp-python
```

```python
from llama_cpp import Llama

llm = Llama(
    model_path="./models/qwen2.5-7b.Q4_K_M.gguf",
    n_ctx=32768,
    n_threads=8,        # CPU 线程
    n_gpu_layers=35     # 卸载到 GPU 的层数（0=纯 CPU）
)

output = llm.create_chat_completion(
    messages=[{"role": "user", "content": "什么是 GGUF？"}],
    max_tokens=200,
    temperature=0.7
)
print(output['choices'][0]['message']['content'])
```

## 量化等级速查

| 量化 | 模型大小（7B） | 质量损失 | 速度 |
|------|---------------|---------|------|
| **F16** | ~14GB | 无 | 基线 |
| **Q8_0** | ~7GB | 极小 | 接近基线 |
| **Q6_K** | ~5.5GB | 极小 | 略慢 |
| **Q5_K_M** | ~4.8GB | 很小 | 略慢 |
| **Q4_K_M** | ~4.1GB | 轻微 | 快 |
| **Q3_K_M** | ~3.3GB | 明显 | 快 |
| **Q2_K** | ~2.7GB | 显著 | 最快 |

> 推荐 **Q4_K_M**（质量/大小最佳平衡）。

## 何时使用

✅ **推荐**：
- Apple Silicon（MacBook M1/M2/M3/M4）
- 无 GPU 服务器 / 开发机
- 隐私场景（数据不出本地）
- 资源受限环境（边缘 / 嵌入式）

⚠️ **不推荐**：
- 高并发生产服务（用 vLLM）
- 极致吞吐量需求
- > 100B 模型（除非有大量 RAM）

## 2026 年生态

| 方面 | 状态 |
|------|------|
| **Ollama** | 最流行前端，底层用 llama.cpp |
| **模型支持** | Llama/Qwen/Mistral/DeepSeek/Phi 等主流模型 |
| **多模态** | 支持 LLaVA (mmproj 文件) |
| **硬件** | CPU/CUDA/Metal/Vulkan/SYCL 全平台 |
| **服务化** | llama-server 提供 OpenAI 兼容 API |
| **社区** | GitHub 80K+ stars，极活跃 |

## 延伸阅读

- [[概念/Inference/gguf|GGUF 格式]]
- [[概念/Inference/model-formats|模型格式全景]]
- [[概念/LLM/edge-llm|边缘 LLM]]
- [[概念/Inference/model-serving|模型服务]]
- [[部署推理/Inference_Engines/llama_cpp_Deep_Dive|llama.cpp 深度解析]]

---

## 2026 llama.cpp 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **llama.cpp b4500+** | 支持 GGUF v3、Flash Attention、Metal/Vulkan/CUDA | GA |
| **Ollama v0.6** | 最流行本地模型管理工具，底层基于 llama.cpp | GA |
| **llama-server** | 官方 HTTP 服务，OpenAI 兼容 API + 流式输出 | GA |
| **GGUF 量化生态** | Q4_K_M/Q5_K_M/Q6_K/Q8_0 多种精度 | GA |
| **多模态支持** | LLaVA/Qwen-VL 等视觉模型推理 | GA |

## 生产最佳实践

1. **量化精度选择**：生产用 Q5_K_M（质量/速度平衡），资源受限用 Q4_K_M
2. **硬件加速必开**：有 GPU 必开 CUDA/Metal，纯 CPU 推理速度极慢
3. **上下文长度控制**：根据显存/内存调整 --ctx-size，避免 OOM
4. **并发控制**：设置 --parallel 参数，平衡吐吐量与延迟
5. **模型来源可靠**：仅从 HuggingFace 官方仓库下载 GGUF 模型，避免恶意文件

## llama.cpp 服务化部署示例

```bash
# 启动 OpenAI 兼容 API 服务
llama-server \
  -m models/qwen3-8b-q5_k_m.gguf \
  --host 0.0.0.0 --port 8080 \
  --ctx-size 8192 \
  --parallel 4 \
  --n-gpu-layers 99 \
  --flash-attn

# 客户端调用 (OpenAI SDK 兼容)
from openai import OpenAI
client = OpenAI(base_url="http://localhost:8080/v1", api_key="none")
resp = client.chat.completions.create(
    model="qwen3-8b",
    messages=[{"role": "user", "content": "你好"}]
)
```

## GGUF 量化格式对比

| 格式 | 位宽 | 模型质量 | 推理速度 | 适用场景 |
|------|------|---------|---------|----------|
| **Q8_0** | 8-bit | 几乎无损 | 中 | 质量优先 |
| **Q6_K** | 6-bit | 极小损失 | 中快 | 平衡选择 |
| **Q5_K_M** | 5-bit | 微小损失 | 快 | 生产推荐 |
| **Q4_K_M** | 4-bit | 轻微损失 | 最快 | 资源受限 |
| **Q3_K_M** | 3-bit | 明显损失 | 极快 | 极端受限 |

## llama.cpp vs 其他推理方案

| 维度 | llama.cpp | vLLM | TensorRT-LLM |
|------|-----------|------|-------------|
| **硬件** | CPU/GPU/Apple | NVIDIA GPU | NVIDIA GPU |
| **量化** | GGUF 多种 | GPTQ/AWQ/FP8 | FP8/INT4 |
| **并发** | 中 | 高 (PagedAttn) | 极高 |
| **部署难度** | 极低 | 中 | 高 |
| **适用场景** | 本地/边缘 | 云端服务 | 极致性能 |

## 延伸阅读

- [[概念/LLM/llama-box|llama-box]] — 基于 llama.cpp 的容器化部署
- [[概念/LLM/edge-llm|端侧 LLM]] — 边缘推理场景
- [[概念/LLM/llm-quantization|LLM 量化]] — 量化技术详解
- [[概念/LLM/llm-inference-engine|推理引擎]] — 推理引擎全景
