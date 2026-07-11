---
title: "HuggingFace CLI 命令行工具 (HuggingFace Command Line Interface)"
category: -concepts
tags: ["huggingface-cli", "huggingface", "model-download", "model-management", "ai-stack-ops"]
relationships:
  - target: "概念/huggingface"
    type: builds_on
  - target: "概念/model-registry"
    type: related_to
  - target: "概念/modelscope"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "huggingface-cli 是 Hugging Face Hub 的官方命令行工具，用于模型/数据集下载、上传、管理。AI Stack 模型下载工具链中作为获取开源模型的标准方式。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: supporting
---

# HuggingFace CLI 命令行工具

> **一句话理解**: huggingface-cli 是"模型界的 npm"——一行命令从 Hugging Face Hub 下载/上传/管理模型和数据集。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **全称** | Hugging Face Hub CLI |
| **安装** | `pip install huggingface_hub` |
| **功能** | 模型/数据集/空间的下载、上传、管理 |
| **后端** | Hugging Face Hub (huggingface.co) |
| **认证** | Access Token 或 `huggingface-cli login` |

---

## 2. 核心命令

### 2.1 认证与配置

```bash
# 登录
huggingface-cli login --token hf_xxxxx

# 查看当前登录用户
huggingface-cli whoami

# 退出登录
huggingface-cli logout
```

### 2.2 模型下载

```bash
# 下载完整模型
huggingface-cli download meta-llama/Llama-3-8B-Instruct

# 下载指定文件
huggingface-cli download meta-llama/Llama-3-8B-Instruct \
  --include "*.safetensors" "*.json"

# 下载到指定目录
huggingface-cli download meta-llama/Llama-3-8B-Instruct \
  --local-dir ./models/llama3-8b

# 排除大文件
huggingface-cli download meta-llama/Llama-3-8B-Instruct \
  --exclude "*.bin" "*.pt"
```

### 2.3 模型上传

```bash
# 上传本地模型到 Hub
huggingface-cli upload my-org/my-model ./local-model-path

# 上传指定文件
huggingface-cli upload my-org/my-model ./path \
  --include "*.safetensors" "*.json"
```

### 2.4 仓库管理

```bash
# 列出 Hub 上的模型
huggingface-cli repo-info meta-llama/Llama-3-8B-Instruct

# 列出数据集
huggingface-cli repo-info --dataset wikitext

# 创建新仓库
huggingface-cli repo create my-new-model --type model
```

---

## 3. 环境变量配置

| 变量 | 说明 | 示例 |
|------|------|------|
| `HF_TOKEN` | Access Token | `hf_xxxxx` |
| `HF_HOME` | 缓存目录 | `~/.cache/huggingface` |
| `HF_ENDPOINT` | 镜像源 | `https://hf-mirror.com` |
| `HF_HUB_ENABLE_HF_TRANSFER` | 高速传输 | `1` |

### 国内镜像加速

```bash
# 使用 hf-mirror 镜像（中国大陆）
export HF_ENDPOINT=https://hf-mirror.com
huggingface-cli download meta-llama/Llama-3-8B-Instruct
```

---

## 4. Python API

```python
from huggingface_hub import snapshot_download, HfApi

# 下载模型
snapshot_download(
    repo_id="meta-llama/Llama-3-8B-Instruct",
    local_dir="./models/llama3-8b",
    ignore_patterns=["*.bin", "*.pt"]
)

# API 操作
api = HfApi()
models = api.list_models(search="llama", sort="downloads", direction=-1)
```

---

## 5. 在 AI Stack 中的角色

AI Stack 模型下载与管理指南中，huggingface-cli 是获取开源模型的标准方式：

| 工具 | 来源 | 适用场景 |
|------|------|----------|
| **huggingface-cli** | HuggingFace Hub | 国际开源模型下载 |
| **modelscope** | ModelScope 魔搭 | 国内模型下载（更快） |
| **git-lfs** | Git LFS | 大文件版本管理 |

### 模型下载流程

```
AI Stack 模型获取流程
│
├── 1. 国际模型 → huggingface-cli download
├── 2. 国内模型 → modelscope download
├── 3. 大文件管理 → git lfs clone
└── 4. 导入 AI Stack → 模型仓库上传
```

---

## Related

- [[概念/huggingface]] — Hugging Face 平台
- [[概念/model-registry]] — 模型仓库
- [[概念/modelscope]] — ModelScope 魔搭
- [[概念/git-lfs]] — Git LFS 大文件存储
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
