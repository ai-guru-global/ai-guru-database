---
title: "BentoML:  AI 模型服务框架"
category: "09-deployment-inference"
tags: ["deployment", "inference", "serving", "vllm"]
summary: "> **一句话理解**: BentoML 是 AI 模型服务框架——一键打包模型为生产级 API、支持多框架、自动扩缩容，本地到生产的无缝迁移。"
created: "2026-05-31"
updated: "2026-05-31"
---

# BentoML: AI 模型服务框架

> **一句话理解**: BentoML 是 AI 模型服务框架——一键打包模型为生产级 API、支持多框架、自动扩缩容，本地到生产的无缝迁移。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级特性](#5-高级特性)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
BentoML: AI 模型服务框架
═══════════════════════════════════════════════════════════════════

定位: 开源模型服务框架，一键打包任意模型为生产级 API

核心理念:
───────────────────────────────────────────────────────────────────
• 框架无关: 支持任意 ML 框架
• 一键部署: 模型到 API
• 自动扩缩: Kubernetes 原生
• 多模型: 单一端点多版本
• 流式: 原生 SSE 支持
• 可观测: 内置监控
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **多框架** | PyTorch/TensorFlow/ONNX |
| **一键部署** | CLI 部署 |
| **版本管理** | 模型版本控制 |
| **自动扩缩** | K8s HPA |
| **批量推理** | 异步批处理 |
| **流式输出** | Server-Sent Events |

### 1.3 支持框架

| 框架 | 支持 |
|------|------|
| PyTorch | ⭐⭐⭐⭐⭐ |
| TensorFlow | ⭐⭐⭐⭐⭐ |
| JAX | ⭐⭐⭐⭐⭐ |
| ONNX | ⭐⭐⭐⭐⭐ |
| XGBoost | ⭐⭐⭐⭐⭐ |
| LangChain | ⭐⭐⭐⭐ |

---

## 2. 核心概念

### 2.1 Bento 概念

```
BentoML 核心概念
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        核心概念                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Service:                                                       │
│  ├── Python 函数定义为服务                                      │
│  ├── @bentoml.service 装饰器                                   │
│  └── 输入/输出 runner                                          │
│                                                                   │
│  Bento:                                                         │
│  ├── 打包的模型服务                                            │
│  ├── 包含模型 + 代码 + 依赖                                    │
│  └── 可部署的单元                                              │
│                                                                   │
│  Runner:                                                        │
│  ├── 模型推理单元                                              │
│  ├── GPU/CPU 分配                                             │
│  └── 批量/在线推理                                             │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 部署流程

```
部署流程
═══════════════════════════════════════════════════════════════════

1. 定义 Service
   ┌─────────────────────────────────────────────────────────────┐
   │ @bentoml.service                                           │
   │ class ImageClassifier:                                     │
   │     def classify(self, image):                             │
   │         ...                                                 │
   └─────────────────────────────────────────────────────────────┘

2. 构建 Bento
   $ bentoml build

3. 部署
   $ bentoml serve --production
```

---

## 3. 架构设计

### 3.1 系统架构

```
BentoML 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        BentoML 架构                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Python SDK                                     │   │
│   │  • @service 装饰器                                       │   │
│   │  • Runner API                                            │   │
│   │  • 批量/在线推理                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              BentoML Server                                │   │
│   │  • HTTP/REST API                                         │   │
│   │  • gRPC                                                  │   │
│   │  • WebSocket (streaming)                                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Runner Pool                                   │   │
│   │  • GPU Runner                                            │   │
│   │  • CPU Runner                                           │   │
│   │  • Batch Runner                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install bentoml
```

### 4.2 定义服务

```python
import bentoml
from PIL import Image
import torch

@bentoml.service(
    resources={"gpu": 1, "memory": "4Gi"},
    max_batch_size=10,
    batch_timeout=1000
)
class ImageClassifier:
    def __init__(self):
        from torchvision import models
        self.model = models.resnet50(pretrained=True)
        self.model.eval()

    @bentoml.api(input_spec=Image(), batchable=True)
    def classify(self, image: Image.Image) -> str:
        with torch.no_grad():
            tensor = self.preprocess(image)
            output = self.model(tensor)
            return self.postprocess(output)

    def preprocess(self, image):
        # 图片预处理
        transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
        ])
        return transform(image).unsqueeze(0)

    def postprocess(self, output):
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        return probabilities.argmax().item()
```

### 4.3 构建和运行

```bash
# 构建 Bento
bentoml build

# 本地运行
bentoml serve ImageClassifier:latest

# 或 Docker 运行
bentoml containerize ImageClassifier:latest
docker run -p 3000:3000 image_classifier:latest
```

### 4.4 客户端调用

```python
import requests

# REST 调用
response = requests.post(
    "http://localhost:3000/classify",
    files={"image": open("test.jpg", "rb")}
)
print(response.json())

# 批量调用
batch_response = requests.post(
    "http://localhost:3000/classify_batch",
    files=[("images", open(f"img_{i}.jpg", "rb")) for i in range(5)]
)
```

---

## 5. 高级特性

### 5.1 流式输出

```python
import bentoml
from bentoml.io import TextIO

@bentoml.service
class TextGenerator:
    def __init__(self):
        from transformers import pipeline
        self.generator = pipeline("text-generation", model="gpt2")

    @bentoml.api(input_spec=TextIO(), output_spec=TextIO(), streaming=True)
    def generate_stream(self, prompt: str) -> str:
        for chunk in self.generator(prompt, do_sample=True, max_length=100):
            yield chunk["generated_text"]
```

### 5.2 异步批处理

```python
@bentoml.service
class AsyncProcessor:
    @bentoml.api(input_spec=JSON(), batchable=True, max_batch_size=100, batch_timeout=5000)
    async def process_batch(self, items: list[dict]) -> list[dict]:
        # 异步批量处理
        results = await self.model.abatch_predict(items)
        return results
```

### 5.3 多模型服务

```python
@bentoml.service
class MultiModelService:
    def __init__(self):
        self.models = {
            "sentiment": self.load_sentiment(),
            "ner": self.load_ner(),
        }

    @bentoml.api(input_spec=JSON())
    def predict(self, input_data: dict) -> dict:
        task_type = input_data.get("task")
        model = self.models.get(task_type)
        return model.predict(input_data["text"])
```

---

## 6. 对比与选择

### 6.1 模型服务框架对比

| 维度 | BentoML | Ray Serve | Triton |
|------|----------|-----------|--------|
| **易用性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **框架支持** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **K8s 原生** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **性能** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 快速部署 | BentoML |
| 复杂编排 | Ray Serve |
|极致性能 | Triton |
| 原型验证 | BentoML |

---

## 参考资源

- [BentoML GitHub](https://github.com/bentoml/bentoml)
- [BentoML 文档](https://docs.bentoml.org/)
- [BentoML Gallery](https://gallery.bentoml.org/)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[09_Deployment_Inference/Deployment_Inference.md|Deployment_Inference]]
- [[09_Deployment_Inference/Deployment_Inference_2026.md|Deployment_Inference_2026]]
- [[09_Deployment_Inference/Deployment_Inference_for_dummy.md|Deployment_Inference_for_dummy]]
- [[09_Deployment_Inference/Inference-in-nutshell.md|Inference-in-nutshell]]
- [[09_Deployment_Inference/JVM_AI_Deployment.md|JVM_AI_Deployment]]
