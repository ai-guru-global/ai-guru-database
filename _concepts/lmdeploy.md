---
title: "LMDeploy"
category: -concepts
tags: ["lmdeploy", "inference", "llm", "turbomind", "pytorch", "quantization", "awq", "chinese-llm", "deployment"]
relationships:
  - target: "_concepts/model-serving"
    type: belongs_to
  - target: "_concepts/vllm"
    type: related_to
  - target: "_concepts/hami"
    type: related_to
  - target: "_concepts/quantization"
    type: uses
sources:
  - 10_Deployment_Inference/Inference_Engines/LMDeploy_Deep_Dive.md
summary: "LMDeploy 是 OpenMMLab 开源的国产 LLM 推理部署工具，提供 TurboMind 高性能引擎与 PyTorch 后端，支持 AWQ/GPTQ 量化、多模态、国产芯片和 OpenAI 兼容 API，在中文场景应用广泛。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# LMDeploy

> 国产 LLM 推理的「双引擎跑车」——TurboMind 高性能 + PyTorch 灵活，中文场景友好。

---

## 1. 一句话定义

**LMDeploy** 是 OpenMMLab 开源的 LLM 推理与服务部署工具，支持 **TurboMind**（C++/CUDA 高性能引擎）和 **PyTorch** 双后端，提供量化、多模态、服务化、OpenAI 兼容 API 等能力，对 InternLM、Qwen、ChatGLM 等中文模型支持较好。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **TurboMind 引擎** | C++/CUDA 实现，高吞吐低延迟 |
| **PyTorch 后端** | 灵活易扩展，支持新模型快速接入 |
| **量化支持** | AWQ、GPTQ、SmoothQuant、KV Cache 量化 |
| **多模态推理** | 支持 VLM（如 InternVL、Qwen-VL） |
| **国产芯片** | 适配昇腾、寒武纪、海光等 |
| **OpenAI API** | 兼容 `/v1/chat/completions` |
| **Pipeline 并行** | 多卡多节点部署 |

---

## 3. 架构组件

```
Client Request
    │
    ▼
API Server (Python)
    │
    ├────── TurboMind Backend (C++)
    │         └── Continuous Batching + PagedAttention-like KV Cache
    │
    └────── PyTorch Backend
              └── Transformers + 量化
```

---

## 4. 典型场景

1. **中文模型生产部署**：InternLM、Qwen、ChatGLM 等。
2. **多模态服务**：图文理解、视觉问答。
3. **国产算力适配**：昇腾 / 寒武纪 / 海光环境。
4. **低显存推理**：AWQ/GPTQ 量化后在消费级 GPU 运行。

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **vLLM** | 功能最接近的竞品，LMDeploy 对中文模型和国产芯片支持更好 |
| **TensorRT-LLM** | NVIDIA 专用，LMDeploy 跨厂商更通用 |
| **SGLang** | 都是高性能推理引擎，SGLang 强在前缀缓存 |
| **TGI** | HuggingFace 生态，LMDeploy 更偏中文/国产 |
| **HAMi** | LMDeploy 服务可申请 HAMi vGPU |

---

## 6. 优势与局限

### 优势
- 中文模型适配快，社区活跃。
- TurboMind 引擎性能接近 vLLM。
- 支持国产芯片和多模态。
- 量化方案丰富，部署门槛低。

### 局限
- 国际模型生态不如 vLLM/TGI 全面。
- 文档以中文为主，英文资料相对较少。

---

## Related

- [[10_Deployment_Inference/Inference_Engines/LMDeploy_Deep_Dive]] — LMDeploy 深度解析
- [[_concepts/model-serving]] — 模型服务
- [[_concepts/vllm]] — vLLM 推理引擎
- [[_concepts/hami]] — HAMi GPU 虚拟化
- [[_concepts/quantization]] — 量化
