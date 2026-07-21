---
title: "LMDeploy"
category: -concepts
tags: ["lmdeploy", "inference", "llm", "turbomind", "pytorch", "quantization", "awq", "chinese-llm", "deployment", "multimodal"]
relationships:
  - target: "概念/Inference/model-serving"
    type: belongs_to
  - target: "概念/Inference/vllm"
    type: related_to
  - target: "概念/Inference/quantization"
    type: uses
  - target: "概念/Inference/continuous-batching"
    type: implements
sources:
  - 部署推理/Inference_Engines/LMDeploy_Deep_Dive.md
  - "https://github.com/InternLM/lmdeploy"
summary: "LMDeploy 是 OpenMMLab 开源的国产 LLM 推理部署工具，提供 TurboMind（C++/CUDA）高性能引擎与 PyTorch 双后端，支持 W4A16/W8A8 量化、多模态 VLM、国产芯片适配和 OpenAI 兼容 API。2026 年在中文模型部署和国产算力场景占据主导地位。"
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Lmdeploy
  - "LMDeploy 推理引擎"
  - "TurboMind"

---
# LMDeploy

> 国产 LLM 推理的「双引擎跑车」——TurboMind 高性能 + PyTorch 灵活，中文场景首选。

## 核心要点

- **双后端架构**：TurboMind（C++/CUDA 极致性能）+ PyTorch（灵活易扩展），同一 API 切换
- **中文模型优先**：InternLM、Qwen、ChatGLM、Baichuan 等国产模型第一时间支持
- **国产芯片适配**：昇腾、寒武纪、海光 DCU 等国产算力原生支持
- **量化丰富**：W4A16 (AWQ)、W8A8 (SmoothQuant)、KV Cache INT8/INT4

## 架构组件

```
Client Request (OpenAI API / gRPC / Python SDK)
    │
    ▼
API Server (FastAPI, /v1/chat/completions)
    │
    ├──── TurboMind Backend (C++/CUDA)
    │       ├── Persistent Batch (Continuous Batching)
    │       ├── Paged KV Cache
    │       ├── Fused Attention Kernel
    │       └── W4A16 / W8A8 量化 GEMM
    │
    └──── PyTorch Backend
            ├── Transformers 模型加载
            ├── DeepSpeed 集成
            └── 新模型快速接入
```

## 核心能力矩阵

| 能力 | 说明 | 状态 |
|------|------|:---:|
| **TurboMind 引擎** | C++/CUDA，高吞吐低延迟 | ✅ 稳定 |
| **PyTorch 后端** | 灵活易扩展，新模型快速接入 | ✅ 稳定 |
| **W4A16 量化** | AWQ/GPTQ，显存降 60% | ✅ |
| **W8A8 量化** | SmoothQuant，精度损失 <1% | ✅ |
| **KV Cache 量化** | INT8/INT4，长上下文显存优化 | ✅ |
| **多模态 VLM** | InternVL、Qwen-VL、LLaVA | ✅ |
| **国产芯片** | 昇腾 / 寒武纪 / 海光 DCU | ✅ |
| **OpenAI API** | `/v1/chat/completions` 兼容 | ✅ |
| **多卡并行** | TP + PP 多节点部署 | ✅ |
| **Prefix Caching** | 前缀缓存加速 | ✅ v0.6+ |

## 部署示例

### 快速启动

```bash
# 安装
pip install lmdeploy

# 启动 OpenAI 兼容服务 (TurboMind 后端)
lmdeploy serve api_server \
    Qwen/Qwen2.5-72B-Instruct \
    --backend turbomind \
    --tp 4 \
    --quant-policy 4 \
    --cache-max-entry-count 0.9 \
    --server-port 23333

# AWQ 量化模型部署
lmdeploy serve api_server \
    internlm/internlm2_5-20b-chat-4bit-awq \
    --backend turbomind \
    --tp 2
```

### Python Pipeline 推理

```python
from lmdeploy import pipeline, TurbomindEngineConfig, GenerationConfig

pipe = pipeline(
    "Qwen/Qwen2.5-72B-Instruct",
    backend_config=TurbomindEngineConfig(
        tp=4,
        cache_max_entry_count=0.9,
        quant_policy=4  # KV Cache INT4
    )
)

gen_config = GenerationConfig(
    max_new_tokens=1024,
    temperature=0.7,
    top_p=0.9
)

response = pipe(["请解释量子计算的基本原理"], gen_config=gen_config)
print(response[0].text)
```

## 量化方案对比

| 方案 | 精度 | 显存节省 | 速度影响 | 适用场景 |
|------|------|:------:|:------:|----------|
| **W4A16 (AWQ)** | 权重 4-bit | ~60% | +20% | 显存受限，推荐默认 |
| **W8A8 (SmoothQuant)** | 全 8-bit | ~45% | +10% | 精度敏感场景 |
| **KV Cache INT8** | KV 8-bit | ~30% KV | 微小 | 长上下文 |
| **KV Cache INT4** | KV 4-bit | ~50% KV | 微小 | 超长上下文 |
| **GPTQ** | 权重 4/3-bit | ~65% | +15% | 极致压缩 |

## 与竞品对比 (2026)

| 维度 | LMDeploy | vLLM | SGLang | TGI |
|------|----------|------|--------|-----|
| 中文模型支持 | **最佳** | 良好 | 良好 | 一般 |
| 国产芯片 | **原生支持** | 仅 NVIDIA | 仅 NVIDIA | 仅 NVIDIA |
| 性能 (NVIDIA) | 接近 vLLM | 标杆 | 略高 | 中 |
| 多模态 | ✅ VLM | ✅ | ✅ | ✅ |
| 量化方案 | **最丰富** | 丰富 | 中等 | 中等 |
| 易用性 | 高 | 高 | 高 | 极高 |
| 社区语言 | 中文为主 | 英文 | 英文 | 英文 |

## 典型场景

| 场景 | 配置建议 | 说明 |
|------|----------|------|
| 中文模型生产 | TurboMind + TP + W4A16 | InternLM/Qwen 首选 |
| 多模态服务 | PyTorch + VLM | InternVL、Qwen-VL |
| 国产算力 | 对应芯片后端 | 昇腾/寒武纪/海光 |
| 低显存推理 | AWQ 4-bit + KV INT4 | 消费级 GPU |
| 长上下文 | KV Cache INT4 + 大 cache | 128K+ tokens |

## 生产最佳实践

1. **优先 TurboMind 后端**：性能比 PyTorch 后端高 30-50%，除非需要最新模型快速接入
2. **开启 KV Cache 量化**：`quant_policy=4` 在长上下文场景显著降低显存压力
3. **合理设置 cache-max-entry-count**：默认 0.9，多并发场景可降至 0.8 避免 OOM
4. **中文模型用 AWQ**：InternLM/Qwen 官方提供 AWQ 版本，质量损失极小
5. **监控 TurboMind 指标**：通过 `/metrics` 端点监控吐吐量、延迟、KV Cache 使用率
6. **国产芯片提前验证**：不同芯片算子覆盖度不同，部署前跑完整回归测试

## 2026 生态进展

| 版本/特性 | 状态 | 说明 |
|-----------|------|------|
| LMDeploy v0.6+ | ✅ 稳定 | Prefix Caching + 调度优化 |
| InternLM3 支持 | ✅ | 第一时间适配 |
| Qwen2.5 全系列 | ✅ | 含 MoE、VLM |
| 昇腾 910B | ✅ 稳定 | 生产可用 |
| Speculative Decoding | ✅ 实验 | EAGLE 集成 |
| DP Attention | ✅ 实验 | 数据并行注意力 |

## Related

- [[部署推理/Inference_Engines/LMDeploy_Deep_Dive]] — LMDeploy 深度解析
- [[概念/Inference/model-serving]] — 模型服务
- [[概念/Inference/vllm]] — vLLM 推理引擎
- [[概念/Inference/quantization]] — 量化
- [[概念/Inference/continuous-batching]] — Continuous Batching
- [[概念/Inference/sglang]] — SGLang 推理引擎
