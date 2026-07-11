---
title: "BentoML: AI 模型服务框架"
category: "10-deployment-inference"
tags: ["deployment", "inference", "serving", "bentoml", "model-serving", "kubernetes", "mlops"]
summary: "> **一句话理解**: BentoML 是开源 AI 模型服务框架——一键将任意模型打包为生产级 API，支持多框架、自动扩缩容、A/B 测试，并能与 vLLM/TGI/TensorRT-LLM 等推理引擎无缝集成。"
created: "2026-05-31"
updated: "2026-06-15"
tier: supporting
aliases:
  - "Bentoml Deep Dive"
  - "BentoML Deep Dive"
  - BentoML_Deep_Dive
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# BentoML: AI 模型服务框架

> **一句话理解**: BentoML 是开源 AI 模型服务框架——一键将任意模型打包为生产级 API，支持多框架、自动扩缩容、A/B 测试，并能与 vLLM/TGI/TensorRT-LLM 等推理引擎无缝集成。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [LLM 服务实战](#5-llm-服务实战)
6. [生产部署](#6-生产部署)
7. [高级特性](#7-高级特性)
8. [对比与选择](#8-对比与选择)

---

## 1. 概述

### 1.1 定位

```
BentoML: AI 模型服务框架
═══════════════════════════════════════════════════════════════════

定位: 开源模型服务框架，将任意 ML/LLM 模型打包为生产级 API

核心理念:
───────────────────────────────────────────────────────────────────
• 框架无关: 支持 PyTorch / TensorFlow / JAX / ONNX / Transformers
• 推理引擎集成: 与 vLLM、TGI、TensorRT-LLM、llama.cpp 无缝对接
• 一键打包: Service → Bento → Container → K8s
• 自动扩缩: K8s HPA / VPA / 自定义指标
• 多模型组合: 单一端点编排多个模型
• 流式输出: 原生 SSE / WebSocket 支持
• 可观测性: OpenTelemetry / Prometheus 内置
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **多框架** | PyTorch / TensorFlow / JAX / ONNX / XGBoost |
| **推理引擎集成** | vLLM / TGI / TensorRT-LLM / llama.cpp |
| **Service 抽象** | Python 装饰器定义服务 |
| **Bento 打包** | 模型 + 代码 + 依赖 一体化 |
| **自动扩缩** | K8s HPA / GPU 自动扩缩 |
| **批量推理** | 异步批处理 (Adaptive Batching) |
| **流式输出** | Server-Sent Events |
| **A/B 测试** | 多版本流量分配 |
| **可观测性** | OpenTelemetry、Prometheus |

### 1.3 支持框架与引擎

| 框架/引擎 | 支持程度 | 说明 |
|------|----------|------|
| PyTorch | ⭐⭐⭐⭐⭐ | 原生支持 |
| TensorFlow | ⭐⭐⭐⭐⭐ | 原生支持 |
| JAX | ⭐⭐⭐⭐⭐ | 原生支持 |
| ONNX | ⭐⭐⭐⭐⭐ | 原生支持 |
| Transformers | ⭐⭐⭐⭐⭐ | 与 Hugging Face 集成 |
| vLLM | ⭐⭐⭐⭐⭐ | 推荐 LLM 推理后端 |
| TGI | ⭐⭐⭐⭐ | Docker 集成 |
| TensorRT-LLM | ⭐⭐⭐⭐ | Triton backend 集成 |
| llama.cpp | ⭐⭐⭐ | 自定义 Runner |
| LangChain | ⭐⭐⭐⭐ | Agent / RAG 编排 |

---

## 2. 核心概念

### 2.1 核心抽象

```
BentoML 核心概念
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        核心概念                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Service:                                                       │
│  ├── Python 类定义服务                                          │
│  ├── @bentoml.service 装饰器                                   │
│  ├── @bentoml.api 装饰器定义接口                               │
│  └── 声明资源 (GPU/内存) 和批处理策略                          │
│                                                                   │
│  Bento:                                                         │
│  ├── 打包的模型服务单元                                         │
│  ├── 包含模型文件 + 服务代码 + 依赖 + Dockerfile               │
│  └── 可复现、可版本化、可部署                                  │
│                                                                   │
│  Runner:                                                        │
│  ├── 模型推理执行单元                                           │
│  ├── 负责 GPU/CPU 分配                                          │
│  ├── 处理在线 / 批量推理                                        │
│  └── 可与外部推理引擎集成                                       │
│                                                                   │
│  Deployment:                                                    │
│  ├── Bento 的运行实例                                           │
│  ├── K8s / Docker / BentoCloud                                 │
│  └── 支持 A/B、灰度、自动扩缩                                  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 部署流程

```
BentoML 部署流程
═══════════════════════════════════════════════════════════════════

1. 定义 Service
   ┌─────────────────────────────────────────────────────────────┐
   │ @bentoml.service(resources={"gpu": 1})                     │
   │ class LLMService:                                          │
   │     def __init__(self): ...                                │
   │     @bentoml.api                                           │
   │     def generate(self, prompt: str) -> str: ...             │
   └─────────────────────────────────────────────────────────────┘

2. 本地验证
   $ bentoml serve service.py:LLMService

3. 构建 Bento
   $ bentoml build

4. 容器化
   $ bentoml containerize llm_service:latest

5. 生产部署
   $ bentoml deploy llm_service:latest --cluster k8s
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
│   Client Layer                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  HTTP/REST API    │    gRPC    │    WebSocket         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              API Server / Gateway                        │   │
│   │  • 路由 / 负载均衡                                       │   │
│   │  • 流量分配 (A/B 测试)                                   │   │
│   │  • 认证 / 限流                                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              BentoML Service                             │   │
│   │  • @bentoml.service 装饰的业务逻辑                       │   │
│   │  • 输入输出校验                                          │   │
│   │  • 编排多个 Runner                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Runner Pool                                 │   │
│   │  ├── vLLM Runner                                        │   │
│   │  ├── TGI Runner                                         │   │
│   │  ├── TensorRT-LLM Runner                                │   │
│   │  ├── Transformers Runner                                │   │
│   │  └── Custom Model Runner                                │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Infrastructure                              │   │
│   │  ├── Docker / Kubernetes                                │   │
│   │  ├── GPU / CPU                                          │   │
│   │  └── BentoCloud (托管)                                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 与推理引擎的集成方式

```
BentoML + 推理引擎集成
═══════════════════════════════════════════════════════════════════

方式 1: 内嵌 vLLM (推荐)
───────────────────────────────────────────────────────────────────
直接在 Service 中启动 vLLM LLMEngine
优点: 资源管理统一，延迟最低
缺点: 需要处理 vLLM 生命周期

方式 2: 外部推理服务作为 Runner
───────────────────────────────────────────────────────────────────
Service 通过 HTTP/gRPC 调用外部 vLLM / TGI / TensorRT-LLM 服务
优点: 推理引擎独立升级
缺点: 多一层网络跳转

方式 3: 通过 BentoCloud / bentoctl 部署
───────────────────────────────────────────────────────────────────
使用 BentoML 生态的部署工具
优点: 一站式托管
缺点: 绑定 BentoML 生态
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install bentoml

# LLM 支持
pip install "bentoml[llm]"

# vLLM 集成
pip install vllm bentoml
```

### 4.2 定义基础服务

```python
import bentoml
from PIL import Image
import torch
from torchvision import transforms, models

@bentoml.service(
    resources={"gpu": 1, "memory": "4Gi"},
    traffic={"timeout": 60}
)
class ImageClassifier:
    def __init__(self):
        self.model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
        self.model.eval()
        if torch.cuda.is_available():
            self.model = self.model.cuda()
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225])
        ])

    @bentoml.api(input_spec=bentoml.io.Image(), batchable=True, max_batch_size=16)
    def classify(self, images: list[Image.Image]) -> list[str]:
        tensors = torch.stack([self.transform(img) for img in images])
        if torch.cuda.is_available():
            tensors = tensors.cuda()
        with torch.no_grad():
            outputs = self.model(tensors)
            _, predicted = outputs.max(1)
        return [str(p.item()) for p in predicted]
```

### 4.3 构建和运行

```bash
# 本地运行
bentoml serve service.py:ImageClassifier

# 构建 Bento
bentoml build

# 查看 Bentos
bentoml list

# 容器化
bentoml containerize image_classifier:latest

# 运行容器
docker run -p 3000:3000 image_classifier:latest
```

### 4.4 客户端调用

```python
import requests

# 单张图片
response = requests.post(
    "http://localhost:3000/classify",
    files={"images": open("test.jpg", "rb")}
)
print(response.json())

# 批量图片
files = [("images", open(f"img_{i}.jpg", "rb")) for i in range(5)]
response = requests.post(
    "http://localhost:3000/classify",
    files=files
)
print(response.json())
```

---

## 5. LLM 服务实战

### 5.1 BentoML + vLLM

```python
import bentoml
from vllm import LLM, SamplingParams

@bentoml.service(
    resources={"gpu": 1, "memory": "24Gi"},
    traffic={"timeout": 300}
)
class VLLMService:
    def __init__(self):
        self.llm = LLM(
            model="meta-llama/Llama-3.1-8B-Instruct",
            tensor_parallel_size=1,
            gpu_memory_utilization=0.9
        )
        self.sampling_params = SamplingParams(
            temperature=0.7,
            top_p=0.9,
            max_tokens=512
        )

    @bentoml.api
    def generate(self, prompt: str) -> str:
        outputs = self.llm.generate(prompt, self.sampling_params)
        return outputs[0].outputs[0].text

    @bentoml.api
    def chat(self, messages: list[dict]) -> str:
        # 使用 chat template
        from transformers import AutoTokenizer
        tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.1-8B-Instruct")
        prompt = tokenizer.apply_chat_template(messages, tokenize=False)
        outputs = self.llm.generate(prompt, self.sampling_params)
        return outputs[0].outputs[0].text
```

### 5.2 BentoML + TGI

```python
import bentoml
from transformers import AutoTokenizer

@bentoml.service(
    resources={"cpu": 4, "memory": "8Gi"},
    traffic={"timeout": 120}
)
class TGIService:
    def __init__(self):
        # TGI 作为外部服务运行
        self.tgi_url = "http://tgi-service:8080"
        self.tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.1-8B-Instruct")

    @bentoml.api
    async def generate(self, prompt: str) -> str:
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.tgi_url}/generate",
                json={
                    "inputs": prompt,
                    "parameters": {
                        "max_new_tokens": 256,
                        "temperature": 0.7
                    }
                },
                timeout=120
            )
            return response.json()["generated_text"]
```

### 5.3 BentoML + OpenAI 兼容服务

```python
import bentoml
from openai import AsyncOpenAI

@bentoml.service(
    resources={"cpu": 2, "memory": "4Gi"}
)
class OpenAICompatibleService:
    def __init__(self):
        # 可路由到任意 OpenAI 兼容后端
        self.client = AsyncOpenAI(
            base_url="http://vllm-service:8000/v1",
            api_key="not-needed"
        )

    @bentoml.api
    async def chat(self, messages: list[dict], model: str = "default") -> str:
        response = await self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.7,
            max_tokens=256
        )
        return response.choices[0].message.content

    @bentoml.api
    async def chat_stream(self, messages: list[dict]) -> bentoml.io.Text:
        stream = await self.client.chat.completions.create(
            model="default",
            messages=messages,
            stream=True
        )
        async for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield content
```

### 5.4 多模型编排

```python
import bentoml

@bentoml.service(resources={"cpu": 4, "memory": "8Gi"})
class RAGService:
    def __init__(self):
        # 嵌入模型
        self.embedding_runner = bentoml.models.get("sentence-transformer:latest").to_runner()
        # 重排序模型
        self.rerank_runner = bentoml.models.get("cross-encoder:latest").to_runner()
        # LLM (vLLM)
        self.llm_client = AsyncOpenAI(base_url="http://vllm:8000/v1", api_key="not-needed")

    @bentoml.api
    async def query(self, question: str, context: list[str]) -> str:
        # 1. 嵌入检索
        embeddings = await self.embedding_runner.async_run([question])
        # 2. 重排序
        scores = await self.rerank_runner.async_run(question, context)
        # 3. 取 Top-K
        top_context = [context[i] for i in sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:3]]
        # 4. 生成答案
        prompt = f"Context: {' '.join(top_context)}\nQuestion: {question}\nAnswer:"
        response = await self.llm_client.chat.completions.create(
            model="default",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
```

---

## 6. 生产部署

### 6.1 Docker 部署

```bash
# 构建镜像
bentoml containerize llm_service:latest -t myregistry/llm_service:v1

# 推送
docker push myregistry/llm_service:v1

# 运行
docker run -d --gpus all -p 3000:3000 myregistry/llm_service:v1
```

### 6.2 Kubernetes 部署

```bash
# 生成 K8s manifests
bentoml deployment create llm_service:latest \
  --name llm-prod \
  --cluster k8s \
  --scaling min=2,max=10

# 或手动生成 YAML
bentoml deployment get llm-prod -o yaml
```

```yaml
# generated deployment.yaml (示意)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: llm-service
  template:
    spec:
      containers:
      - name: llm-service
        image: myregistry/llm_service:v1
        resources:
          limits:
            nvidia.com/gpu: "1"
            memory: "24Gi"
        ports:
        - containerPort: 3000
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: llm-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: llm-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Pods
    pods:
      metric:
        name: gpu_utilization
      target:
        type: AverageValue
        averageValue: "70"
```

### 6.3 BentoCloud 部署

```bash
# 登录 BentoCloud
bentoml cloud login

# 部署
bentoml deploy llm_service:latest \
  --name llm-prod \
  --scaling min=2,max=10 \
  --instance-type gpu-l4
```

---

## 7. 高级特性

### 7.1 流式输出

```python
import bentoml

@bentoml.service
class StreamingLLM:
    @bentoml.api(input_spec=bentoml.io.Text(), output_spec=bentoml.io.Text(), streaming=True)
    async def generate_stream(self, prompt: str) -> bentoml.io.Text:
        # 调用底层推理引擎的流式接口
        for i in range(10):
            yield f"token_{i} "
```

### 7.2 异步批处理 (Adaptive Batching)

```python
@bentoml.service
class BatchEmbedding:
    @bentoml.api(
        input_spec=bentoml.io.Text(),
        batchable=True,
        max_batch_size=64,
        batch_timeout=10
    )
    def embed(self, texts: list[str]) -> list[list[float]]:
        # 自动聚合多个请求为 batch
        return self.model.encode(texts).tolist()
```

### 7.3 A/B 测试与流量分配

```bash
# 部署两个版本
bentoml deploy llm_service:v1 --name llm-prod --traffic 80
bentoml deploy llm_service:v2 --name llm-prod --traffic 20

# 通过标签路由
# v1: 80% 流量
# v2: 20% 流量
```

### 7.4 灰度发布

```bash
# 金丝雀发布
bentoml deployment update llm-prod \
  --bento llm_service:v2 \
  --canary 5

# 观察指标后逐步提升
bentoml deployment update llm-prod --canary 50
bentoml deployment update llm-prod --canary 100
```

### 7.5 可观测性

```python
# 内置 OpenTelemetry
import bentoml

@bentoml.service(
    tracing={"exporter_type": "otlp", "endpoint": "http://otel-collector:4317"}
)
class ObservableService:
    @bentoml.api
    def predict(self, input_data: str) -> str:
        # 自动生成 trace 和 metrics
        return self.model.predict(input_data)
```

### 7.6 监控指标

| 指标 | 说明 |
|------|------|
| `bentoml_request_duration_seconds` | 请求耗时 |
| `bentoml_request_total` | 请求总数 |
| `bentoml_request_in_progress` | 进行中请求 |
| `bentoml_runner_batch_size` | 批处理大小 |
| `bentoml_runner_batch_latency_seconds` | 批处理延迟 |

---

## 8. 对比与选择

### 8.1 模型服务框架对比

| 维度 | BentoML | Ray Serve | Triton | Seldon | KServe |
|------|----------|-----------|--------|--------|--------|
| **易用性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **框架支持** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **K8s 原生** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **LLM 集成** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **自动扩缩** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **A/B 测试** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **社区生态** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **企业支持** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### 8.2 选型建议

| 场景 | 推荐 |
|------|------|
| 快速部署 LLM | BentoML + vLLM |
| 复杂多模型编排 | Ray Serve |
| 极致推理性能 | Triton + TensorRT-LLM |
| 企业级 K8s MLOps | KServe / Seldon |
| 原型验证 | BentoML |
| 多框架统一服务 | BentoML / Ray Serve |

### 8.3 适用场景

| 场景 | BentoML 优势 |
|------|--------------|
| 模型即服务 (MaaS) | 快速打包与部署 |
| LLM 应用后端 | 与 vLLM/TGI 原生集成 |
| RAG / Agent | 多模型编排 |
| A/B 测试 | 流量分配 |
| 自动扩缩 | K8s / BentoCloud 支持 |
| 多团队协作 | Bento 版本化管理 |

### 8.4 版本演进

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| v0.1 | 2019 | 首个版本 |
| v1.0 | 2021 | Bento 打包、K8s 部署 |
| v1.1 | 2022 | Adaptive Batching、A/B 测试 |
| v1.2 | 2023 | OpenLLM、LLM 支持 |
| v1.3 | 2024 | vLLM 集成、BentoCloud |
| v1.4 | 2025 | OpenTelemetry、多推理引擎 |
| v1.5 | 2026.x | 更强 K8s Operator、Serverless |

---

## 参考资源

- [BentoML GitHub](https://github.com/bentoml/bentoml)
- [BentoML 文档](https://docs.bentoml.org/)
- [BentoML Gallery](https://gallery.bentoml.org/)
- [BentoCloud](https://www.bentoml.com/)
- [BentoML + vLLM 示例](https://github.com/bentoml/BentoVLLM)

---

*Last updated: 2026-06-15*
*Version: 2.0.0*

## Related

- [[部署推理/Inference_Engines/vLLM_Deep_Dive.md|vLLM_Deep_Dive]]
- [[部署推理/Inference_Engines/TGI_Deep_Dive.md|TGI_Deep_Dive]]
- [[部署推理/Inference_Engines/TensorRT_LLM_Deep_Dive.md|TensorRT_LLM_Deep_Dive]]
- [[部署推理/Deployment_Inference.md|Deployment_Inference]]
- [[部署推理/Deployment_Inference_2026.md|Deployment_Inference_2026]]
- [[部署推理/Deployment_Inference_for_dummy.md|Deployment_Inference_for_dummy]]
- [[部署推理/Inference-in-nutshell.md|Inference-in-nutshell]]
- [[部署推理/Inference_Engines/LLM_Inference_Engine_Selection_Guide.md|LLM_Inference_Engine_Selection_Guide]]
- [[架构基建/AI_Gateway/LiteLLM_Deep_Dive|LiteLLM_Deep_Dive]]
