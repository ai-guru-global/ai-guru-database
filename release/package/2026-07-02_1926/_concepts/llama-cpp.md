---
title: "llama.cpp（C++ LLM 推理引擎）"
category: -concepts
tags: [llama-cpp, gguf, llama, edge-inference, cpu-inference, quantization]
aliases:
  - "llama.cpp"
  - "llama-cpp-python"
  - "GGML"
relationships:
  - target: "_concepts/gguf"
    type: uses_format
sources:
  - 部署推理/Inference_Engines/llama_cpp_Deep_Dive.md
  - _concepts/gguf.md
summary: "llama.cpp 是用纯 C++ 实现的 LLM 推理引擎，专为 CPU 和边缘设备优化，支持 GGUF 量化格式；在消费级硬件（Mac / 普通 PC）上即可运行 7B-70B 模型，是本地 LLM 部署的事实标准。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.90
created: 2026-06-24
updated: 2026-06-24
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

## Related

- [[_concepts/gguf]] — GGUF 格式
- [[_concepts/vllm]] — vLLM（GPU 生产）
- [[部署推理/Inference_Engines/llama_cpp_Deep_Dive]] — llama.cpp 深度
- [[_concepts/serverless]] — Serverless 推理- [[_concepts/inference-performance-gaps]] — Inference Performance Gaps
