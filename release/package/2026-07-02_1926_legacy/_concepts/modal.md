---
title: "Modal"
category: -concepts
tags: ["modal", "serverless", "gpu", "cloud", "inference", "python", "deployment"]
relationships:
  - target: "_concepts/model-serving"
    type: extends
  - target: "_concepts/serverless"
    type: implements
  - target: "_concepts/gpu-cloud"
    type: related_to
  - target: "_concepts/vllm"
    type: related_to
sources:
  - 部署推理/Inference_Engines/Modal_Deep_Dive.md
summary: "Modal 是无服务器 GPU 云平台，允许开发者用 Python 装饰器将函数部署为弹性 GPU/CPU 服务，按秒计费，适合快速原型、异步任务和弹性推理服务。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Modal

---
# Modal

> Python 开发者的「无服务器 GPU 云」——用装饰器把函数变成弹性 GPU 服务。

---

## 1. 一句话定义

**Modal** 是无服务器 GPU/CPU 云平台，允许开发者用 Python 装饰器将本地函数部署为云端弹性服务。它按秒计费、自动扩缩容，支持容器化环境、持久化存储和自定义 GPU，适合快速原型、异步任务和弹性推理服务。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **Python 装饰器部署** | `@stub.function(gpu="A100")` 一键部署 |
| **自动扩缩容** | 从零扩展到数千并发 |
| **按秒计费** | 只按实际运行时间付费 |
| **持久化存储** | Volumes 存储模型权重和数据 |
| **容器镜像** | 自动构建和缓存容器镜像 |
| **异步任务** | 支持队列和定时任务 |
| **Web 端点** | 自动生成 HTTP/gRPC 服务 |

---

## 3. 典型用法

```python
import modal

stub = modal.Stub("llm-inference")

@stub.function(gpu="A100", image=modal.Image.debian_slim().pip_install("vllm"))
def generate(prompt: str):
    from vllm import LLM
    llm = LLM("meta-llama/Llama-2-7b-hf")
    return llm.generate(prompt)

@stub.local_entrypoint()
def main():
    print(generate.remote("Hello"))
```

---

## 4. 典型场景

1. **快速 LLM 原型**：几行代码部署 vLLM 服务。
2. **异步批处理**：视频生成、数据预处理。
3. **弹性推理 API**：流量波动大的模型服务。
4. **AI Agent 后端**：低成本运行 Agent 工具。

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **AWS Lambda** | Modal 类似，但支持 GPU 和长时间运行 |
| **Replicate** | 都是无服务器 AI 平台，Modal 更偏开发者 |
| **vLLM / TGI** | 可作为 Modal 容器内推理引擎 |
| **HuggingFace Inference API** | Modal 更灵活、可定制 |

---

## 6. 优势与局限

### 优势
- 开发体验极佳，Python 原生。
- 冷启动快，镜像缓存智能。
- 按需付费，适合初创和实验。

### 局限
- 供应商锁定风险。
- 长连接/低延迟场景不如自托管稳定。
- 企业级合规和网络隔离能力有限。

---

## Related

- [[部署推理/Inference_Engines/Modal_Deep_Dive]] — Modal 深度解析
- [[_concepts/model-serving]] — 模型服务
- [[_concepts/serverless]] — 无服务器
- [[_concepts/vllm]] — vLLM
- [[_concepts/replicate]] — Replicate
