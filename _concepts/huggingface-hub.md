---
title: "Hugging Face Hub (AI 模型与数据集托管平台)"
category: -concepts
tags: ["huggingface", "model-hub", "dataset", "git-lfs", "community", "open-source"]
relationships:
  - target: "_concepts/peft"
    type: related_to
  - target: "_concepts/safetensors"
    type: related_to
  - target: "_concepts/onnx"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "Hugging Face 运营的 AI 模型与数据集托管平台，被誉为'AI 领域的 GitHub'，提供模型存储、版本管理、推理 API 和社区协作等一站式服务。"
provenance:
  extracted: 0.60
  inferred: 0.30
  ambiguous: 0.10
base_confidence: 0.92
lifecycle: reviewed
tier: core
---

# Hugging Face Hub

[Hugging Face Hub](https://huggingface.co/) 是 Hugging Face 运营的 AI 模型与数据集托管平台，被业界称为 **"AI 领域的 GitHub"**。它提供模型权重存储、数据集托管、Spaces 应用部署、推理 API 和社区协作等一站式服务。几乎所有开源 LLM（Llama、Mistral、Qwen 等）都首发在 HF Hub 上，是 AI 开发生态的**核心基础设施**。

## 核心组件

### Hub 生态全景

```
Hugging Face Hub
├── Models (模型仓库)
│   ├── 模型权重 (safetensors, PyTorch, ONNX)
│   ├── 模型卡片 (README.md / model card)
│   ├── 配置文件 (config.json, tokenizer)
│   └── 版本管理 (Git + Git LFS)
│
├── Datasets (数据集仓库)
│   ├── Parquet/CSV/JSON 文件
│   ├── 数据集卡片
│   └── 预览与探索
│
├── Spaces (应用部署)
│   ├── Gradio 应用
│   ├── Streamlit 应用
│   ├── Docker 应用
│   └── 静态页面
│
├── Inference API (推理接口)
│   ├── Serverless (免费层)
│   ├── Dedicated (专属实例)
│   └── Inference Endpoints
│
└── Community (社区)
    ├── Discussions
    ├── Organizations
    └── Papers (论文关联)
```

## 核心特性

### 1. 模型仓库 (Model Repository)

```python
from huggingface_hub import HfApi, login

# 登录
login(token="hf_xxxxxxxxxxxxxxxx")

api = HfApi()

# 创建模型仓库
api.create_repo("my-org/my-model", private=True)

# 上传模型
api.upload_folder(
    folder_path="./model/",
    repo_id="my-org/my-model",
    repo_type="model"
)

# 下载模型
api.snapshot_download(
    repo_id="meta-llama/Llama-3-8B",
    local_dir="./llama-3-8b"
)
```

### 2. huggingface-cli

```bash
# 安装
pip install huggingface_hub

# 登录
huggingface-cli login

# 上传文件
huggingface-cli upload my-org/my-model ./model/ .

# 下载
huggingface-cli download meta-llama/Llama-3-8B --local-dir ./model

# 仓库管理
huggingface-cli repo create my-model --type model
huggingface-cli whoami
```

### 3. Model Card (模型卡片)

```markdown
---
license: apache-2.0
library_name: transformers
pipeline_tag: text-generation
base_model: meta-llama/Llama-3-8B
tags:
- llama
- fine-tuned
---

# My Fine-tuned Model

## 模型描述
基于 Llama-3-8B 在领域数据上微调...

## 使用方式
```python
from transformers import AutoModelForCausalLM
model = AutoModelForCausalLM.from_pretrained("my-org/my-model")
```

## 评估结果
| Benchmark | Score |
|-----------|-------|
| MMLU | 65.2% |
```

### 4. Inference Endpoints

```python
from huggingface_hub import InferenceClient

# Serverless (免费, 有速率限制)
client = InferenceClient()
response = client.chat_completion(
    model="meta-llama/Llama-3-8B-Instruct",
    messages=[{"role": "user", "content": "Hello"}],
    max_tokens=100
)

# Dedicated Endpoint (付费, 高吞吐)
client = InferenceClient(
    base_url="https://my-endpoint.us-east-1.aws.endpoints.huggingface.cloud"
)
response = client.chat_completion(
    model="tgi",
    messages=[{"role": "user", "content": "Hello"}]
)
```

### 5. Dataset Hub

```python
from datasets import load_dataset

# 从 Hub 加载数据集
dataset = load_dataset("my-org/my-dataset")

# 流式加载（大数据集）
dataset = load_dataset("common-crawl", streaming=True)

# 上传数据集
from datasets import Dataset
dataset = Dataset.from_dict({"text": ["Hello", "World"]})
dataset.push_to_hub("my-org/my-dataset")
```

### 6. Spaces (应用部署)

```bash
# 创建 Gradio Space
# 1. 在 huggingface.co 创建 Space
# 2. 推送代码
git clone https://huggingface.co/spaces/my-org/my-app
cd my-app
# 编写 app.py (Gradio)
git add . && git commit -m "init" && git push
```

## Hub 数据规模 (2026)

| 指标 | 数量 |
|------|------|
| **模型仓库** | 100 万+ |
| **数据集** | 20 万+ |
| **Spaces** | 50 万+ |
| **日下载量** | 数亿次 |
| **组织** | 5 万+ |

## 与 AI Stack 的集成

在 AI Stack 中，Hugging Face Hub 的角色：

1. **模型分发** — vLLM/SGLang/Triton 从 Hub 下载模型权重
2. **模型管理** — MLflow 记录 Hub 模型版本
3. **微调上传** — PEFT/LoRA 微调后上传到私有仓库
4. **评估基准** — lm-eval-harness 从 Hub 加载基准测试
5. **数据集** — 训练和评估数据从 Hub 加载

## K8s 模型加载

```yaml
# Init Container 从 Hub 下载模型
apiVersion: v1
kind: Pod
spec:
  initContainers:
  - name: model-download
    image: python:3.11-slim
    command: ["bash", "-c"]
    args:
    - |
      pip install huggingface_hub
      huggingface-cli download meta-llama/Llama-3-8B \
        --local-dir /models/llama-3-8b
    env:
    - name: HF_TOKEN
      valueFrom:
        secretKeyRef:
          name: hf-secret
          key: token
    volumeMounts:
    - name: models
      mountPath: /models
  containers:
  - name: vllm
    volumeMounts:
    - name: models
      mountPath: /models
```

## 参考资源

- [Hugging Face Hub](https://huggingface.co/)
- [huggingface_hub 文档](https://huggingface.co/docs/huggingface_hub)
- [Model Card 规范](https://huggingface.co/docs/hub/model-cards)
- [Inference Endpoints](https://huggingface.co/inference-endpoints)

## 相关概念

- [[_concepts/peft]] — PEFT 参数高效微调库
- [[_concepts/safetensors]] — Safetensors 安全张量格式
- [[_concepts/onnx]] — ONNX 开放神经网络交换格式
- [[_concepts/lm-eval-harness]] — LM Evaluation Harness 标准化评估
