---
title: "LLM 推理引擎迁移指南"
category: "10-deployment-inference"
tags: ["deployment", "inference", "migration", "llm", "vllm", "sglang", "tgi", "tensorrt-llm"]
summary: "> **一句话理解**: LLM 推理引擎迁移指南——覆盖 vLLM、SGLang、TGI、TensorRT-LLM 之间的 API、配置、量化、部署迁移方法，以及自建到云 API 的切换策略。"
created: "2026-06-15"
updated: "2026-06-15"
tier: supporting
aliases:
  - "Llm Inference Engine Migration Guide"
  - "LLM Inference Engine Migration Guide"
  - LLM_Inference_Engine_Migration_Guide
sources: []

name_zh: "LLM 推理引擎迁移指南"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# LLM 推理引擎迁移指南

> 中文简称：LLM 推理引擎迁移指南

> **一句话理解**: LLM 推理引擎迁移指南——覆盖 vLLM、SGLang、TGI、TensorRT-LLM 之间的 API、配置、量化、部署迁移方法，以及自建到云 API 的切换策略。

---

## 目录

1. [迁移评估](#1-迁移评估)
2. [API 兼容层](#2-api-兼容层)
3. [vLLM ↔ SGLang](#3-vllm--sglang)
4. [vLLM ↔ TGI](#4-vllm--tgi)
5. [vLLM ↔ TensorRT-LLM](#5-vllm--tensorrt-llm)
6. [自建 → 云 API](#6-自建--云-api)
7. [量化模型迁移](#7-量化模型迁移)
8. [生产切换策略](#8-生产切换策略)

---

## 1. 迁移评估

### 1.1 迁移成本矩阵

| 迁移方向 | 难度 | 风险 | 主要工作 |
|----------|------|------|----------|
| vLLM → SGLang | 低 | 低 | 改 base_url，调 prefix caching |
| SGLang → vLLM | 低 | 低 | 改 base_url，开 APC |
| vLLM → TGI | 低 | 低 | 改 base_url，换 Docker 镜像 |
| TGI → vLLM | 低 | 低 | 改 base_url |
| vLLM → TensorRT-LLM | 高 | 中 | 重新编译 engine，调整量化 |
| TensorRT-LLM → vLLM | 中 | 低 | 用原生 HF 模型重新部署 |
| 自建 → Groq | 低 | 低 | 改 base_url，评估隐私 |
| 自建 → Together | 低 | 低 | 改 base_url，换模型名 |
| 云 API → 自建 | 中 | 中 | 硬件采购、部署、监控 |

### 1.2 迁移前检查清单

```
迁移前检查清单
═══════════════════════════════════════════════════════════════════

□ 目标引擎是否支持当前模型架构?
□ 目标引擎是否支持当前量化格式?
□ API 接口是否兼容 (OpenAI / TGI / 自定义)?
□ 输入输出格式是否需要转换?
□ 性能指标是否满足要求 (TTFT/TPOT/吞吐)?
□ 监控和日志是否需要重新配置?
□ 是否需要更新 K8s / Docker 配置?
□ 是否有回滚方案?
□ 数据隐私是否允许迁移到云 API?
```

---

## 2. API 兼容层

### 2.1 OpenAI 兼容接口

```
OpenAI 兼容接口覆盖
═══════════════════════════════════════════════════════════════════

支持 OpenAI 兼容的引擎:
───────────────────────────────────────────────────────────────────
• vLLM
• SGLang
• TGI (新版本)
• Groq
• Together AI
• Fireworks AI
• LMDeploy
• llama.cpp (llama-server)
• Ollama

统一调用方式:
───────────────────────────────────────────────────────────────────
from openai import OpenAI

client = OpenAI(base_url="http://engine:port/v1", api_key="dummy")
response = client.chat.completions.create(...)
```

### 2.2 LiteLLM 统一代理

```python
# 使用 LiteLLM 统一路由到不同引擎
import litellm

# vLLM
response = litellm.completion(
    model="openai/meta-llama/Llama-3.1-8B-Instruct",
    messages=[{"role": "user", "content": "Hello"}],
    api_base="http://localhost:8000",
    api_key="not-needed"
)

# SGLang
response = litellm.completion(
    model="openai/meta-llama/Llama-3.1-8B-Instruct",
    messages=[{"role": "user", "content": "Hello"}],
    api_base="http://localhost:30000/v1",
    api_key="not-needed"
)

# Groq
response = litellm.completion(
    model="groq/llama-3.1-70b-versatile",
    messages=[{"role": "user", "content": "Hello"}],
    api_key="gsk_xxx"
)
```

### 2.3 参数映射

| 参数 | OpenAI | vLLM | SGLang | TGI | TensorRT-LLM |
|------|--------|------|--------|-----|--------------|
| 模型名 | model | model | model | model | model |
| 消息 | messages | messages | messages | messages | messages |
| 温度 | temperature | temperature | temperature | temperature | temperature |
| Max tokens | max_tokens | max_tokens | max_tokens | max_new_tokens | max_tokens |
| Top-p | top_p | top_p | top_p | top_p | top_p |
| Top-k | 不支持 | top_k | top_k | top_k | top_k |
| Stream | stream | stream | stream | stream | stream |
| Stop | stop | stop | stop | stop_sequences | stop_words |

---

## 3. vLLM ↔ SGLang

### 3.1 vLLM → SGLang

```bash
# vLLM 启动
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --port 8000

# SGLang 启动
python -m sglang.launch_server \
  --model-path meta-llama/Llama-3.1-8B-Instruct \
  --port 30000 \
  --enable-radix-attn  # 前缀缓存
```

```python
# 代码只需改 base_url
from openai import OpenAI

# vLLM
# client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")

# SGLang
client = OpenAI(base_url="http://localhost:30000/v1", api_key="not-needed")

response = client.chat.completions.create(
    model="default",
    messages=[{"role": "user", "content": "你好"}]
)
```

### 3.2 配置差异

| 配置项 | vLLM | SGLang | 说明 |
|--------|------|--------|------|
| 前缀缓存 | `--enable-prefix-caching` | `--enable-radix-attn` | 默认不同 |
| 张量并行 | `--tensor-parallel-size` | `--tensor-parallel-size` | 相同 |
| 显存比例 | `--gpu-memory-utilization` | `--mem-fraction-static` | 参数名不同 |
| 最大并发 | `--max-num-seqs` | `--max-running-requests` | 参数名不同 |
| 上下文 | `--max-model-len` | `--max-total-tokens` | 参数名不同 |

### 3.3 性能差异预期

```
vLLM → SGLang 性能变化
═══════════════════════════════════════════════════════════════════

多轮/RAG 场景:
• 前缀缓存命中率提升 30-70%
• TTFT 降低 30-50%
• 吞吐提升 20-40%

通用场景:
• 吞吐相近或 SGLang 略高
• 延迟差异 < 10%
```

---

## 4. vLLM ↔ TGI

### 4.1 vLLM → TGI

```bash
# vLLM
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --port 8000

# TGI Docker
docker run --gpus all --shm-size 1g -p 8080:80 \
  -v $PWD/data:/data \
  ghcr.io/huggingface/text-generation-inference:latest \
  --model-id meta-llama/Meta-Llama-3-1-8B-Instruct
```

```python
from openai import OpenAI

# vLLM
# client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")

# TGI
client = OpenAI(base_url="http://localhost:8080/v1", api_key="dummy")

response = client.chat.completions.create(
    model="tgi",
    messages=[{"role": "user", "content": "你好"}]
)
```

### 4.2 配置差异

| 配置项 | vLLM | TGI | 说明 |
|--------|------|-----|------|
| 模型 ID | `--model` | `--model-id` | 参数名不同 |
| 张量并行 | `--tensor-parallel-size` | `--num-shard` | 参数名不同 |
| 量化 | `--quantization` | `--quantize` | 参数名不同 |
| 最大输入 | `--max-model-len` | `--max-input-tokens` | TGI 分 input/output |
| 最大总长度 | `--max-model-len` | `--max-total-tokens` | |

### 4.3 监控差异

```
vLLM 监控:
• /metrics (Prometheus)
• vllm:gpu_cache_usage_perc
• vllm:num_requests_running

TGI 监控:
• /metrics (Prometheus)
• tgi_request_count
• tgi_batch_current_size
• tgi_kv_cache_usage
```

---

## 5. vLLM ↔ TensorRT-LLM

### 5.1 vLLM → TensorRT-LLM

```bash
# Step 1: 准备 TensorRT-LLM 环境
docker pull nvcr.io/nvidia/tritonserver:25.03-trtllm-python-py3

# Step 2: 转换模型为 checkpoint
python3 convert_checkpoint.py \
  --model_dir ./models/llama-3.1-8b \
  --output_dir ./checkpoints/llama-3.1-8b \
  --dtype float16

# Step 3: 编译 engine
trtllm-build \
  --checkpoint_dir ./checkpoints/llama-3.1-8b \
  --output_dir ./engines/llama-3.1-8b \
  --gemm_plugin float16 \
  --max_batch_size 64 \
  --max_input_len 4096 \
  --max_output_len 1024

# Step 4: 启动 Triton
tritonserver --model-repository ./engines
```

### 5.2 量化迁移

```
vLLM 量化 → TensorRT-LLM 量化
═══════════════════════════════════════════════════════════════════

vLLM AWQ:
• vLLM: --quantization awq
• TRT-LLM: 需用 ModelOpt 重新量化，--quantization int4_awq

vLLM GPTQ:
• vLLM: --quantization gptq
• TRT-LLM: --quantization int4_gptq

vLLM FP8:
• vLLM: --quantization fp8
• TRT-LLM: --quantization fp8

注意: 量化参数不一定 1:1 兼容，需要验证精度
```

### 5.3 API 迁移

```python
# vLLM OpenAI 兼容
client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")

# TensorRT-LLM 通过 Triton backend 通常提供 OpenAI 兼容接口
client = OpenAI(base_url="http://localhost:8000/v2/models/tensorrt_llm/generate", api_key="not-needed")

# 或使用 Triton 原生格式
import tritonclient.http as httpclient
client = httpclient.InferenceServerClient(url="localhost:8000")
```

### 5.4 回滚策略

```
TensorRT-LLM → vLLM 回滚
═══════════════════════════════════════════════════════════════════

1. 保留原始 HuggingFace 模型
2. 保留 vLLM 启动脚本
3. 使用同一模型仓库
4. 通过 AI Gateway 切换流量
5. 保留 TensorRT-LLM engine 文件 (便于再次切换)
```

---

## 6. 自建 → 云 API

### 6.1 迁移步骤

```
自建 → 云 API 迁移
═══════════════════════════════════════════════════════════════════

Step 1: 评估
───────────────────────────────────────────────────────────────────
• 数据是否允许出域?
• 月 token 消耗量?
• 延迟 SLO?
• 模型是否云 API 支持?

Step 2: 选择云厂商
───────────────────────────────────────────────────────────────────
• 低延迟: Groq
• 模型多: Together AI
• 批量便宜: Fireworks AI
• 闭源模型: OpenAI

Step 3: 代码修改
───────────────────────────────────────────────────────────────────
• 改 base_url
• 改 api_key
• 调整 model 名称
• 处理 rate limit

Step 4: 灰度切换
───────────────────────────────────────────────────────────────────
• 5% → 20% → 50% → 100%
• 对比延迟、成本、错误率

Step 5: 下线自建
───────────────────────────────────────────────────────────────────
• 保留自建作为 fallback
• 监控云 API 稳定性
```

### 6.2 代码修改示例

```python
from openai import OpenAI

# 自建 vLLM
# client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")

# Groq
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key="gsk_xxx"
)

response = client.chat.completions.create(
    model="llama-3.1-70b-versatile",  # 改为云 API 模型名
    messages=[{"role": "user", "content": "你好"}]
)
```

### 6.3 Fallback 配置

```python
import litellm

# 主: Groq, 备: 自建 vLLM
response = litellm.completion(
    model="groq/llama-3.1-70b-versatile",
    messages=[{"role": "user", "content": "Hello"}],
    fallback_dict={
        "groq/llama-3.1-70b-versatile": ["openai/meta-llama/Llama-3.1-70B-Instruct"]
    },
    api_base="http://localhost:8000/v1"
)
```

---

## 7. 量化模型迁移

### 7.1 量化格式兼容性

| 源引擎 | 量化格式 | 目标引擎 | 兼容性 | 处理方式 |
|--------|----------|----------|--------|----------|
| vLLM | AWQ | TensorRT-LLM | ⚠️ | 需重新量化 |
| vLLM | GPTQ | TensorRT-LLM | ⚠️ | 需重新量化 |
| vLLM | FP8 | TensorRT-LLM | ✅ | 直接支持 |
| vLLM | AWQ | SGLang | ✅ | 直接加载 |
| vLLM | GPTQ | SGLang | ✅ | 直接加载 |
| TGI | AWQ | vLLM | ✅ | 直接加载 |
| llama.cpp | GGUF | vLLM | ❌ | 需转 HF |

### 7.2 重新量化流程

```bash
# AWQ → TensorRT-LLM
python3 quantize.py \
  --model_dir ./awq_model \
  --output_dir ./checkpoints_awq \
  --dtype int4_awq

trtllm-build \
  --checkpoint_dir ./checkpoints_awq \
  --output_dir ./engines_awq \
  --gemm_plugin int4_awq

# GGUF → HF → vLLM
# Step 1: 用 llama.cpp 或其他工具转回 HF
# Step 2: vLLM 直接加载 HF 模型并重新量化
```

---

## 8. 生产切换策略

### 8.1 金丝雀发布

```
金丝雀发布流程
═══════════════════════════════════════════════════════════════════

阶段 1: 并行运行
───────────────────────────────────────────────────────────────────
• 旧引擎 100% 流量
• 新引擎 0% 流量，只接收测试流量
• 对比指标: TTFT/TPOT/吞吐/错误率

阶段 2: 小流量验证
───────────────────────────────────────────────────────────────────
• 旧引擎 95%
• 新引擎 5%
• 观察 1-2 小时

阶段 3: 逐步放大
───────────────────────────────────────────────────────────────────
• 旧引擎 80% → 50% → 20%
• 新引擎 20% → 50% → 80%
• 每步观察 30 分钟

阶段 4: 全量切换
───────────────────────────────────────────────────────────────────
• 新引擎 100%
• 旧引擎保持热备
```

### 8.2 回滚触发条件

| 指标 | 阈值 | 动作 |
|------|------|------|
| P99 TTFT | > 2x baseline | 回滚 |
| P99 TPOT | > 2x baseline | 回滚 |
| 错误率 | > 1% | 回滚 |
| OOM | > 0.1% | 回滚 |
| 用户投诉 | 明显增加 | 回滚 |

### 8.3 统一网关路由

```yaml
# LiteLLM config.yaml
model_list:
  - model_name: llama-3.1-8b
    litellm_params:
      model: openai/meta-llama/Llama-3.1-8B-Instruct
      api_base: http://sglang:30000/v1
      api_key: not-needed
      rpm: 1000
    model_info:
      mode: chat

  - model_name: llama-3.1-8b-fallback
    litellm_params:
      model: openai/meta-llama/Llama-3.1-8B-Instruct
      api_base: http://vllm:8000/v1
      api_key: not-needed

router_settings:
  fallback_dict:
    llama-3.1-8b: ["llama-3.1-8b-fallback"]
```

---

## 参考资源

- [LiteLLM Router](https://docs.litellm.ai/docs/proxy/reliability)
- [vLLM 文档](https://docs.vllm.ai/)
- [SGLang 文档](https://docs.sglang.ai/)
- [TGI 文档](https://huggingface.co/docs/text-generation-inference/)
- [TensorRT-LLM 文档](https://nvidia.github.io/TensorRT-LLM/)

---

*Last updated: 2026-06-15*
*Version: 1.0.0*

## Related

- [[10_部署推理/02_推理引擎/17_LLM_推理引擎_选型_指南|LLM_Inference_Engine_Selection_Guide]]
- [[10_部署推理/02_推理引擎/15_LLM推理_基准测试_指南|LLM_Inference_Benchmarking_Guide]]
- [[10_部署推理/02_推理引擎/29_vLLM_深入分析|vLLM_Deep_Dive]]
- [[10_部署推理/02_推理引擎/23_SGLang_深入分析|SGLang_Deep_Dive]]
- [[10_部署推理/02_推理引擎/26_TGI_深入分析|TGI_Deep_Dive]]
- [[10_部署推理/02_推理引擎/25_TensorRT_LLM_深入分析|TensorRT_LLM_Deep_Dive]]
- [[10_部署推理/02_推理引擎/07_Groq_深入分析|Groq_Deep_Dive]]
- [[12_架构基建/11_AI网关/09_LiteLLM_深入分析|LiteLLM_Deep_Dive]]
