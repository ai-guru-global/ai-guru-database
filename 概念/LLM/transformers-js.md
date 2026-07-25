---
title: "Transformers.js (浏览器端 AI 推理库)"
category: -concepts
tags: ["huggingface", "browser", "webassembly", "onnx", "edge-ai", "client-side"]
relationships:
  - target: "概念/onnx"
    type: related_to
  - target: "概念/huggingface-hub"
    type: related_to
  - target: "概念/safetensors"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "Hugging Face 出品的浏览器端 AI 推理库，基于 ONNX Runtime Web 在浏览器/Node.js/Edge Runtime 中直接运行 Transformer 模型，无需后端服务器。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: reviewed
tier: supporting
created: 2026-06-12
updated: 2026-07-21
---

# Transformers.js

[Transformers.js](https://github.com/huggingface/transformers.js) 是 Hugging Face 推出的**浏览器端 AI 推理库**，是 Python 版 `transformers` 库的 JavaScript/TypeScript 等价物。它基于 **ONNX Runtime Web**，让开发者能在浏览器、Node.js、Cloudflare Workers、Deno 等 JavaScript 运行时中**直接运行 Transformer 模型**，无需后端服务器——真正实现"AI 到边缘"。

## 核心架构

```
Transformers.js 架构:

┌──────────────────────────────┐
│     JavaScript Runtime        │
│  (Browser / Node.js / Edge)  │
│                              │
│  ┌──────────────────────┐    │
│  │   Transformers.js    │    │
│  │   (Pipeline API)     │    │
│  ├──────────────────────┤    │
│  │   Tokenizers.js      │    │
│  │   (Rust → WASM)      │    │
│  ├──────────────────────┤    │
│  │   ONNX Runtime Web   │    │
│  │   (WASM / WebGPU)    │    │
│  └──────────────────────┘    │
│                              │
│  Models cached in Cache API  │
└──────────────────────────────┘
```

## 核心特性

### 1. Pipeline API (与 Python 版一致)

```javascript
import { pipeline } from '@huggingface/transformers';

// 文本分类
const classifier = await pipeline('sentiment-analysis');
const result = await classifier('I love Transformers.js!');
// [{ label: 'POSITIVE', score: 0.9998 }]

// 文本生成
const generator = await pipeline('text-generation', 'Xenova/gpt2');
const output = await generator('Once upon a time', { max_new_tokens: 50 });

// 图像分类
const imageClassifier = await pipeline('image-classification', 'Xenova/vit-base-patch16-224');
const imgResult = await imageClassifier('https://example.com/cat.jpg');

// 零样本分类
const zeroShot = await pipeline('zero-shot-classification', 'Xenova/bart-large-mnli');
const result = await zeroShot(
    'I love programming',
    ['technology', 'sports', 'politics']
);
```

### 2. 支持的模型架构

| 架构 | 任务 | 典型模型 |
|------|------|----------|
| **BERT** | 分类/NER/QA | bert-base |
| **GPT-2** | 文本生成 | gpt2 |
| **T5** | 翻译/摘要 | t5-small |
| **Whisper** | 语音识别 | whisper-tiny |
| **CLIP** | 图像-文本匹配 | clip-vit-base |
| **ViT** | 图像分类 | vit-base |
| **SAM** | 图像分割 | sam-vit-base |
| **Llama** | 文本生成 | llama-3.2-1b |

### 3. WebGPU 加速

```javascript
import { pipeline, env } from '@huggingface/transformers';

// 启用 WebGPU (实验性, Chrome 113+)
env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.webgpu.enabled = true;

const model = await pipeline('text-generation', 'Xenova/Llama-3.2-1B');
// WebGPU 加速推理
```

### 4. 模型缓存

```javascript
// 模型自动缓存到浏览器 Cache API
// 首次加载: 从 HuggingFace Hub 下载
// 后续加载: 从 Cache 读取 (毫秒级)

// 自定义缓存配置
import { env } from '@huggingface/transformers';
env.cacheDir = '/custom/cache/path';  // Node.js
env.allowLocalModels = true;          // 允许本地模型
```

### 5. 多运行时支持

```javascript
// 浏览器
import { pipeline } from '@huggingface/transformers';

// Node.js
import { pipeline } from '@huggingface/transformers';

// Cloudflare Workers
import { pipeline } from '@huggingface/transformers';

// Deno
import { pipeline } from 'npm:@huggingface/transformers';

// Bun
import { pipeline } from '@huggingface/transformers';
```

## 与 Python Transformers 对比

| 维度 | Transformers (Python) | Transformers.js |
|------|----------------------|-----------------|
| **运行时** | Python | JavaScript/TS |
| **后端** | PyTorch/TF/JAX | ONNX Runtime Web |
| **硬件** | GPU (CUDA) | WASM/WebGPU |
| **模型大小** | 无限制 | ~数百MB (受限于浏览器) |
| **速度** | 快 | 中等 (WASM约原生60%) |
| **部署** | 服务器 | 客户端/边缘 |
| **API 兼容性** | 参考 | 高度兼容 |

## 典型应用场景

- **隐私优先应用**: 数据不离开用户浏览器
- **离线应用**: PWA 离线 AI 功能
- **边缘推理**: Cloudflare Workers 等边缘计算
- **快速原型**: 无需后端即可测试 AI 功能
- **教育/演示**: 纯前端的 AI Demo

## 与 AI Stack 的集成

在 AI Stack 中，Transformers.js 的角色：

1. **前端应用** — React/Next.js 中嵌入 AI 功能
2. **Cloudflare Workers** — 边缘 AI 推理
3. **Web 应用** — 浏览器端实时 NLP/CV
4. **混合架构** — 前端轻量推理 + 后端大模型

## 安装

```bash
npm install @huggingface/transformers
# 或
yarn add @huggingface/transformers
```

## 参考资源

- [Transformers.js GitHub](https://github.com/huggingface/transformers.js)
- [Transformers.js 文档](https://huggingface.co/docs/transformers.js)
- [ONNX Runtime Web](https://onnxruntime.ai/docs/api/javascript/)

## 相关概念

- [[概念/onnx]] — ONNX 开放神经网络交换格式
- [[概念/huggingface-hub]] — Hugging Face Hub 模型平台
- [[概念/safetensors]] — Safetensors 安全张量格式
- [[概念/openvino]] — OpenVINO Intel 推理优化

---

## 2026 Transformers.js 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Transformers.js v3** | 支持 WebGPU 加速，性能提升 10x | GA |
| **ONNX Runtime Web** | 浏览器端 ONNX 推理引擎 | GA |
| **WebGPU 后端** | GPU 加速推理，支持大模型 | GA |
| **Node.js 支持** | 服务器端运行，支持 Edge Runtime | GA |
| **量化模型** | 支持 INT8/INT4 量化模型 | GA |

## 生产最佳实践

1. **WebGPU 优先**：支持 WebGPU 的浏览器优先使用，性能提升 10x
2. **模型量化**：浏览器端用 INT8/INT4 量化模型，减少加载时间
3. **CDN 缓存**：模型文件用 CDN 缓存，避免重复下载
4. **渐进式加载**：大模型分块加载，改善用户体验
5. **离线支持**：用 Service Worker 缓存模型，支持离线使用
