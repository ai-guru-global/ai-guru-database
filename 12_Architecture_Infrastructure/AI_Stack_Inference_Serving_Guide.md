---
title: "AI Stack 推理服务指南"
category: "12-architecture-infrastructure"
tags: ["ai-stack", "inference", "vllm", "sglang", "ollama", "llama-cpp", "serving"]
summary: "> **一句话理解**: AI Stack 推理层提供 vLLM、SGLang、Ollama、llama.cpp 四种典型服务方式，分别覆盖生产高并发、极致性能、本地一键运行和边缘轻量部署场景。"
created: "2026-06-16"
updated: "2026-06-16"
---

# AI Stack 推理服务指南

> **一句话理解**: AI Stack 推理层提供 `vLLM`、`SGLang`、`Ollama`、`llama.cpp` 四种典型服务方式，分别覆盖生产高并发、极致性能、本地一键运行和边缘轻量部署场景。

---

## 1. 工具选型矩阵

| 工具 | 用途 | 推荐场景 | 协议兼容 |
|------|------|----------|----------|
| **vllm serve** | vLLM 推理引擎 | 生产高并发、长上下文、Continuous Batching | OpenAI API、TGI |
| **sglang.launch_server** | SGLang 推理引擎 | 极致吞吐、多轮对话前缀缓存 | OpenAI API |
| **ollama** | 本地模型一键运行 | 开发验证、个人桌面、快速 PoC | Ollama API |
| **llama-server** | llama.cpp 推理服务 | 边缘/CPU/低资源场景、GGUF 量化 | OpenAI API、llama.cpp |

---

## 2. 常用命令

### 2.1 vllm serve

```bash
# 基础启动
vllm serve Qwen/Qwen3-8B --port 8000

# 生产级启动（多 GPU、张量并行、API key、量化）
vllm serve Qwen/Qwen3-8B \
  --tensor-parallel-size 2 \
  --max-model-len 32768 \
  --gpu-memory-utilization 0.9 \
  --quantization awq \
  --api-key ${VLLM_API_KEY} \
  --port 8000

# 查看服务状态
curl http://localhost:8000/health

# 测试对话
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen3-8B",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

### 2.2 sglang.launch_server

```bash
# 基础启动
python -m sglang.launch_server \
  --model-path /data/models/Qwen3-8B \
  --port 30000

# 多卡服务
python -m sglang.launch_server \
  --model-path /data/models/Qwen3-8B \
  --tp 2 \
  --port 30000

# 查看模型列表
curl http://localhost:30000/v1/models
```

### 2.3 ollama

```bash
# 启动守护进程
ollama serve

# 拉取并运行模型
ollama pull qwen3:8b
ollama run qwen3:8b

# 列出本地模型
ollama list

# 创建自定义 Modelfile
ollama create my-qwen3 -f Modelfile
```

### 2.4 llama-server

```bash
# 启动 GGUF 模型服务
llama-server -m /data/models/Qwen3-8B-FP16.gguf --port 8080

# 多线程、上下文长度
llama-server -m /data/models/Qwen3-8B-Q4_K_M.gguf \
  --port 8080 \
  -c 8192 \
  -t 16 \
  --host 0.0.0.0
```

---

## 3. 生产环境 Checklist

- [ ] 服务启动前确认模型权重路径、tokenizer、config 文件完整且版本一致。
- [ ] 配置 `--max-model-len` 与业务需求匹配，避免超长请求导致 OOM。
- [ ] 生产环境开启 API Key 或 mTLS，避免未授权访问。
- [ ] 配置监控探针：`/health` 用于存活，`/v1/models` 用于就绪检查。
- [ ] 开启日志采样与请求 ID 透传，便于问题追踪。
- [ ] vLLM/SGLang 多卡场景使用 Tensor Parallelism，并验证 NVLink/卡间互联带宽。
- [ ] 设置合理的 `gpu-memory-utilization`（通常 0.85-0.9），预留显存给 KV Cache 增长。
- [ ] 对并发、TPOT、TTFT 设置 SLO 告警。

---

## 4. 故障排查速查

| 现象 | 排查命令 | 常见原因 |
|------|----------|----------|
| 服务启动 OOM | `nvidia-smi` | max-model-len 过大、量化未生效、并发过高 |
| TTFT 过高 | 日志/Metrics | 模型未预热、PD 未分离、网络延迟 |
| 吞吐量低于预期 | `nvidia-smi dmon` | batch size 小、GPU 利用率低、KV Cache 限制 |
| API 返回 503/429 | `curl /health` | 队列堆积、并发限制、显存耗尽 |
| SGLang 前缀缓存未命中 | 启用 `--disable-radix-cache` 对比 | 请求前缀差异大、缓存被驱逐 |
| Ollama 模型加载慢 | `ollama list` | 首次下载/转换、模型格式未量化 |
| llama-server CPU 占用高 | `htop` + `llama-bench` | 线程数设置不当、模型未 offload 到 GPU |

---

## 5. 选型决策树

```
是否需要极致吞吐/多轮对话前缀缓存？
  ├─ 是 → SGLang
  └─ 否 → 是否需要生产级高并发/长上下文？
      ├─ 是 → vLLM
      └─ 否 → 是否资源受限/边缘/CPU？
          ├─ 是 → llama.cpp (llama-server)
          └─ 否 → Ollama（快速原型）
```

---

## Related

- [[12_Architecture_Infrastructure/AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[12_Architecture_Infrastructure/AI_Stack_GPU_Monitoring_Guide|AI Stack GPU 监控指南]]
- [[12_Architecture_Infrastructure/AI_Stack_Model_Management_Guide|AI Stack 模型下载与管理指南]]
- [[12_Architecture_Infrastructure/AI_Stack_K8s_Operations_Guide|AI Stack K8s 编排指南]]
- [[10_Deployment_Inference/Inference_Engines/LLM_Inference_Engine_Selection_Guide|LLM 推理引擎选型指南]]
- [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive|vLLM 深度解析]]
- [[10_Deployment_Inference/Inference_Engines/SGLang_Deep_Dive|SGLang 深度解析]]
- [[10_Deployment_Inference/Inference_Engines/Ollama_Deep_Dive|Ollama 深度解析]]
- [[10_Deployment_Inference/Inference_Engines/llama_cpp_Deep_Dive|llama.cpp 深度解析]]
