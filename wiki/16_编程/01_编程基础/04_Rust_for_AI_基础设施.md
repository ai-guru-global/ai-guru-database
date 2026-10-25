---
title: "Rust for AI 基础设施"
category: "16-ai-coding"
tags: ["rust", "ai-infrastructure", "candle", "burn", "pyo3", "safetensors", "performance", "systems-programming"]
summary: "Rust for AI 基础设施全景：为什么 AI Infra 需要 Rust(性能/安全/并发)、核心框架(candle/burn/tch-rs/tokenizers)、HuggingFace 生态中的 Rust、Python 绑定(PyO3/maturin)、与 C++/CUDA 对比、2026 采用趋势、入门路径。"
created: 2026-07-19
updated: 2026-07-19
tier: supporting
aliases:
  - "Rust for AI Infrastructure"
  - Rust_for_AI_Infrastructure
sources: []

name_zh: "Rust for AI 基础设施"
---
# Rust for AI 基础设施

> 中文简称：Rust for AI 基础设施

> **一句话理解**: Rust 正在成为 AI 基础设施的核心系统语言——从 HuggingFace 的 tokenizers/safetensors 到推理引擎 TGI，Rust 提供了 C++ 级性能 + 内存安全 + 无畏并发。

---

## 一、概述

### 1.1 为什么 AI Infra 需要 Rust

```
AI 基础设施的痛点:
═══════════════════

C++ 的问题:                    Python 的问题:
┌─────────────────────┐       ┌─────────────────────┐
│ 内存安全漏洞         │       │ 性能不足 (GIL)      │
│ 未定义行为           │       │ 部署复杂            │
│ 编译慢 (模板地狱)    │       │ 并发困难            │
│ 构建系统混乱         │       │ 类型不安全          │
│ 并发编程危险         │       │ 依赖地狱            │
│ 人才稀缺            │       │ 不适合系统编程       │
└─────────────────────┘       └─────────────────────┘

Rust 的解决方案:
┌─────────────────────────────────────────────────┐
│ ✓ 编译期内存安全 (无 GC)                         │
│ ✓ 零成本抽象 (性能 = C++)                       │
│ ✓ 无畏并发 (Send/Sync trait)                    │
│ ✓ 现代工具链 (cargo)                            │
│ ✓ 优秀的错误处理 (Result/Option)                 │
│ ✓ Python 互操作 (PyO3)                         │
│ ✓ WASM 支持 (浏览器/边缘推理)                    │
└─────────────────────────────────────────────────┘
```

### 1.2 Rust 在 AI 生态中的位置 (2026)

| 层级 | Rust 项目 | 替代的 | 用户 |
|------|----------|--------|------|
| Tokenization | tokenizers | Python BPE | 所有 NLP |
| 模型格式 | safetensors | pickle (不安全) | HuggingFace |
| 推理引擎 | TGI / candle | C++ 引擎 | 生产部署 |
| 训练框架 | burn | PyTorch (部分) | 研究/生产 |
| 数据加载 | hf-transfer | Python 下载 | 模型下载 |
| 向量数据库 | Qdrant / LanceDB | C++ 引擎 | RAG |
| 编排 | 新兴 | Python 编排 | Agent |

---

## 二、核心框架

### 2.1 candle: HuggingFace 的 Rust ML 框架

```rust
// candle: 轻量级 ML 框架，无需 Python 依赖
use candle_core::{Device, Tensor, DType};
use candle_nn::{Module, VarBuilder, Linear};
use candle_transformers::models::llama::{Llama, LlamaConfig};

fn main() -> anyhow::Result<()> {
    // 1. 加载模型 (safetensors 格式)
    let device = Device::new_cuda(0)?;  // 或 Device::Cpu
    
    let config = LlamaConfig {
        hidden_size: 4096,
        intermediate_size: 11008,
        num_hidden_layers: 32,
        num_attention_heads: 32,
        num_key_value_heads: 8,  // GQA
        vocab_size: 128256,
        ..Default::default()
    };
    
    // 从 safetensors 加载权重
    let weights = std::path::Path::new("model.safetensors");
    let vb = unsafe {
        VarBuilder::from_mmaped_safetensors(&[weights], DType::F16, &device)?
    };
    
    let model = Llama::load(vb, &config)?;
    
    // 2. 推理
    let input_ids = Tensor::new(&[1u32, 1576, 263, 3367], &device)?;  // "The cat sat"
    let logits = model.forward(&input_ids.unsqueeze(0)?, 0)?;
    
    // 3. 采样
    let next_token = logits
        .get(0)?
        .get(logits.dim(1)? - 1)?
        .argmax(0)?
        .to_scalar::<u32>()?;
    
    println!("Next token ID: {}", next_token);
    Ok(())
}
```

```toml
# Cargo.toml
[dependencies]
candle-core = { version = "0.8", features = ["cuda"] }
candle-nn = "0.8"
candle-transformers = "0.8"
tokenizers = "0.21"
anyhow = "1.0"
tracing = "0.1"
```

### 2.2 burn: 纯 Rust 深度学习框架

```rust
// burn: 类似 PyTorch 的 Rust 深度学习框架
use burn::prelude::*;
use burn::nn::{Linear, LinearConfig, ReLU};
use burn::tensor::backend::AutodiffBackend;

// 定义模型 (类似 PyTorch nn.Module)
#[derive(Module, Debug)]
struct TransformerBlock<B: Backend> {
    attention: MultiHeadAttention<B>,
    ffn: FeedForward<B>,
    norm1: LayerNorm<B>,
    norm2: LayerNorm<B>,
}

#[derive(Module, Debug)]
struct FeedForward<B: Backend> {
    linear1: Linear<B>,
    linear2: Linear<B>,
    activation: ReLU,
}

impl<B: Backend> FeedForward<B> {
    fn new(channels: usize, device: &B::Device) -> Self {
        let config1 = LinearConfig::new(channels, channels * 4);
        let config2 = LinearConfig::new(channels * 4, channels);
        Self {
            linear1: config1.init(device),
            linear2: config2.init(device),
            activation: ReLU::new(),
        }
    }
}

impl<B: Backend> Module<B> for FeedForward<B> {
    fn forward(&self, input: Tensor<B, 2>) -> Tensor<B, 2> {
        let x = self.linear1.forward(input);
        let x = self.activation.forward(x);
        self.linear2.forward(x)
    }
}

// 训练循环
fn train<B: AutodiffBackend>(model: &mut MyModel<B>, device: &B::Device) {
    let optim = AdamConfig::new().init();
    
    for epoch in 0..100 {
        let input = Tensor::<B, 2>::random([32, 784], Distribution::Normal(0.0, 1.0), device);
        let target = Tensor::<B, 2>::random([32, 10], Distribution::Normal(0.0, 1.0), device);
        
        let output = model.forward(input);
        let loss = mse_loss(output, target);
        
        // 自动微分
        let grads = loss.backward();
        let optim = optim.step(0.001, model, grads);
    }
}
```

### 2.3 tch-rs: PyTorch C++ API 的 Rust 绑定

```rust
// tch-rs: 直接绑定 libtorch
use tch::{nn, nn::Module, nn::OptimizerConfig, Device, Kind, Tensor};

fn main() -> anyhow::Result<()> {
    let device = Device::Cuda(0);
    
    // 加载预训练模型
    let mut vs = nn::VarStore::new(device);
    let model = tch::CModule::load("model.pt")?;
    
    // 推理
    let input = Tensor::randn(&[1, 3, 224, 224], (Kind::Float, device));
    let output = model.forward_ts(&[input])?;
    
    // 训练 (使用 nn 模块)
    let net = nn::seq()
        .add(nn::linear(vs.root(), 784, 256, Default::default()))
        .add_fn(|xs| xs.relu())
        .add(nn::linear(vs.root(), 256, 10, Default::default()));
    
    let opt = nn::Adam::default().build(&vs, 1e-3)?;
    
    for epoch in 1..=100 {
        let loss = net.forward(&input).mse_loss(&target, tch::Reduction::Mean);
        opt.backward_step(&loss);
    }
    
    Ok(())
}
```

### 2.4 tokenizers: HuggingFace 分词器

```rust
// tokenizers: 高性能分词 (比 Python 快 10x+)
use tokenizers::Tokenizer;
use tokenizers::models::bpe::BPE;

fn main() -> anyhow::Result<()> {
    // 从文件加载
    let tokenizer = Tokenizer::from_file("tokenizer.json")?;
    
    // 编码
    let encoding = tokenizer.encode("Hello, world! 你好世界", true)?;
    println!("Token IDs: {:?}", encoding.get_ids());
    println!("Tokens: {:?}", encoding.get_tokens());
    
    // 批量编码 (并行)
    let sentences = vec![
        "First sentence",
        "Second sentence",
        "Third sentence",
    ];
    let encodings = tokenizer.encode_batch(sentences, true)?;
    
    // 解码
    let decoded = tokenizer.decode(encoding.get_ids(), true)?;
    println!("Decoded: {}", decoded);
    
    Ok(())
}
```

---

## 三、HuggingFace 生态中的 Rust

### 3.1 safetensors: 安全的模型序列化

```rust
// safetensors: 替代不安全的 pickle 格式
use safetensors::tensor::{Dtype, TensorView, SafeTensors};
use std::collections::HashMap;

fn load_model_weights(path: &str) -> anyhow::Result<HashMap<String, TensorView>> {
    let data = std::fs::read(path)?;
    let tensors = SafeTensors::deserialize(&data)?;
    
    let mut weights = HashMap::new();
    for (name, view) in tensors.tensors() {
        println!(
            "Tensor: {} | Shape: {:?} | Dtype: {:?}",
            name,
            view.shape(),
            view.dtype()
        );
        weights.insert(name.to_string(), view);
    }
    
    Ok(weights)
}

// 为什么 safetensors 比 pickle 好:
// 1. 无代码执行风险 (pickle 可以执行任意代码)
// 2. 零拷贝加载 (mmap)
// 3. 支持部分加载 (只读取需要的 tensor)
// 4. 跨语言 (Rust/Python/JS/C++)
```

### 3.2 text-generation-inference (TGI)

```rust
// TGI 核心架构 (简化)
// 文件: router/src/main.rs

use axum::{Router, routing::post};
use tokio::sync::mpsc;

// TGI 的核心设计:
// 1. Router (Rust): 请求路由、批处理、流式响应
// 2. Server (Python): 模型推理 (PyTorch/vLLM)
// 3. 通过 gRPC 通信

#[derive(Debug)]
struct GenerateRequest {
    inputs: String,
    parameters: GenerateParameters,
}

#[derive(Debug)]
struct GenerateParameters {
    max_new_tokens: u32,
    temperature: f32,
    top_p: f32,
    repetition_penalty: f32,
}

// Continuous Batching 调度器
struct BatchScheduler {
    max_batch_size: usize,
    max_waiting_tokens: usize,
    pending_requests: Vec<Request>,
    running_batch: Option<Batch>,
}

impl BatchScheduler {
    /// 动态批处理: 新请求可以在生成过程中加入
    fn schedule(&mut self) -> Option<Batch> {
        // 1. 检查是否有空间加入新请求
        // 2. 合并 prefill 和 decode 请求
        // 3. 管理 KV Cache 分配
        todo!()
    }
}
```

### 3.3 hf-transfer: 高速下载

```rust
// hf-transfer: 多线程并行下载 (比 Python requests 快 5x)
// 使用 Rust 的并发优势

use tokio::task::JoinSet;
use reqwest::Client;

async fn download_model(
    repo_id: &str,
    revision: &str,
    target_dir: &Path,
) -> anyhow::Result<()> {
    let client = Client::builder()
        .pool_max_idle_per_host(16)
        .build()?;
    
    // 获取文件列表
    let files = list_repo_files(&client, repo_id, revision).await?;
    
    // 并行下载 (每个文件分块并行)
    let mut tasks = JoinSet::new();
    for file in files {
        let client = client.clone();
        let target = target_dir.join(&file.path);
        
        tasks.spawn(async move {
            download_file_chunked(&client, &file.url, &target, 8).await
            // 8 个并行 chunk 下载
        });
    }
    
    while let Some(result) = tasks.join_next().await {
        result??;
    }
    
    Ok(())
}
```

---

## 四、Python 绑定 (PyO3/maturin)

### 4.1 PyO3: Rust → Python 扩展

```rust
// src/lib.rs - 用 Rust 编写 Python 扩展
use pyo3::prelude::*;
use pyo3::types::PyList;

/// 高性能 BPE 分词 (Rust 实现，Python 调用)
#[pyclass]
struct FastTokenizer {
    inner: tokenizers::Tokenizer,
}

#[pymethods]
impl FastTokenizer {
    #[new]
    fn new(path: &str) -> PyResult<Self> {
        let inner = tokenizers::Tokenizer::from_file(path)
            .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(e.to_string()))?;
        Ok(Self { inner })
    }
    
    /// 编码单个文本
    fn encode(&self, text: &str) -> PyResult<Vec<u32>> {
        let encoding = self.inner.encode(text, true)
            .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(e.to_string()))?;
        Ok(encoding.get_ids().to_vec())
    }
    
    /// 批量编码 (利用 Rust 并行)
    fn encode_batch(&self, texts: Vec<String>) -> PyResult<Vec<Vec<u32>>> {
        let encodings = self.inner.encode_batch(texts, true)
            .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(e.to_string()))?;
        Ok(encodings.iter().map(|e| e.get_ids().to_vec()).collect())
    }
    
    /// 解码
    fn decode(&self, ids: Vec<u32>) -> PyResult<String> {
        self.inner.decode(&ids, true)
            .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(e.to_string()))
    }
}

/// 高性能余弦相似度计算
#[pyfunction]
fn cosine_similarity(a: Vec<f32>, b: Vec<f32>) -> f32 {
    let dot: f32 = a.iter().zip(b.iter()).map(|(x, y)| x * y).sum();
    let norm_a: f32 = a.iter().map(|x| x * x).sum::<f32>().sqrt();
    let norm_b: f32 = b.iter().map(|x| x * x).sum::<f32>().sqrt();
    dot / (norm_a * norm_b)
}

/// Python 模块定义
#[pymodule]
fn fast_ai_utils(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_class::<FastTokenizer>()?;
    m.add_function(wrap_pyfunction!(cosine_similarity, m)?)?;
    Ok(())
}
```

### 4.2 maturin: 构建与发布

```toml
# Cargo.toml
[package]
name = "fast-ai-utils"
version = "0.1.0"
edition = "2021"

[lib]
name = "fast_ai_utils"
crate-type = ["cdylib"]  # Python 扩展

[dependencies]
pyo3 = { version = "0.23", features = ["extension-module"] }
tokenizers = "0.21"
rayon = "1.10"
```

```toml
# pyproject.toml
[build-system]
requires = ["maturin>=1.7,<2.0"]
build-backend = "maturin"

[project]
name = "fast-ai-utils"
version = "0.1.0"
requires-python = ">=3.12"

[tool.maturin]
features = ["pyo3/extension-module"]
python-source = "python"
module-name = "fast_ai_utils"
```

```bash
# 构建与安装
maturin develop          # 开发模式 (编译 + 安装到 venv)
maturin build --release  # 生产构建
maturin publish          # 发布到 PyPI

# 使用
uv add fast-ai-utils
python -c "from fast_ai_utils import FastTokenizer; t = FastTokenizer('tokenizer.json')"
```

### 4.3 Python 侧使用

```python
"""使用 Rust 扩展的 Python 代码"""
from fast_ai_utils import FastTokenizer, cosine_similarity

# 分词 (Rust 速度，Python 接口)
tokenizer = FastTokenizer("tokenizer.json")
ids = tokenizer.encode("Hello, world! 你好世界")
text = tokenizer.decode(ids)

# 批量编码 (内部使用 Rayon 并行)
texts = ["text 1", "text 2", "text 3"] * 1000
all_ids = tokenizer.encode_batch(texts)  # 比纯 Python 快 10x+

# 向量计算
sim = cosine_similarity([1.0, 2.0, 3.0], [4.0, 5.0, 6.0])
```

---

## 五、与 C++/CUDA 对比

### 5.1 语言特性对比

| 维度 | Rust | C++ | CUDA C++ |
|------|------|-----|----------|
| 内存安全 | 编译期保证 | 手动管理 | 手动管理 |
| 并发安全 | 类型系统保证 | 程序员负责 | N/A |
| 学习曲线 | 陡峭 (所有权) | 陡峭 (未定义行为) | 中等 |
| 编译速度 | 中 | 慢 (模板) | 慢 |
| 工具链 | cargo (优秀) | CMake (复杂) | nvcc + CMake |
| 错误处理 | Result/Option | 异常/错误码 | cudaError_t |
| 包管理 | crates.io | 无标准 | 无标准 |
| 跨平台 | 优秀 | 良好 | NVIDIA only |
| WASM | 原生支持 | Emscripten | 不支持 |
| Python 绑定 | PyO3 (优秀) | pybind11 | 复杂 |

### 5.2 性能对比 (实际基准)

```
任务: BPE Tokenization (1M 句子)
═══════════════════════════════════
Python (纯):     45.2s
Python (regex):  38.7s
Rust (tokenizers): 2.1s   ← 21x faster
C++ (SentencePiece): 3.4s

任务: safetensors 加载 (7B 模型, 14GB)
═══════════════════════════════════
pickle (Python):  12.3s  ← 还有安全风险
safetensors (Rust mmap): 0.8s  ← 15x faster, 零拷贝

任务: 向量相似度搜索 (1M vectors, dim=1536)
═══════════════════════════════════
Python (numpy):   8.7s
Rust (Qdrant):    0.3s   ← 29x faster
C++ (Faiss):      0.2s
```

### 5.3 何时选择 Rust vs C++ vs Python

```
决策树:
│
├── 需要 GPU kernel?
│   ├── 是 → CUDA C++ / Triton (Python DSL)
│   └── 否 ↓
│
├── 需要极致性能 + 内存安全?
│   ├── 是 → Rust
│   └── 否 ↓
│
├── 需要快速原型/研究?
│   ├── 是 → Python (PyTorch/JAX)
│   └── 否 ↓
│
├── 需要系统级基础设施?
│   ├── 是 → Rust (推理引擎/数据管道/网络)
│   └── 否 ↓
│
└── 遗留代码库?
    ├── C++ → 继续 C++ (或逐步迁移 Rust)
    └── Python → 性能热点用 Rust 重写
```

---

## 六、2026 采用趋势

### 6.1 主要采用者

| 公司/项目 | Rust 用途 | 规模 |
|----------|----------|------|
| HuggingFace | tokenizers, safetensors, TGI, candle | 核心基础设施 |
| Meta | 内部 AI 工具链 | 大规模 |
| Microsoft | ONNX Runtime 部分组件 | 生产 |
| Apple | Core ML 工具链 | 生产 |
| Qdrant | 向量数据库 | 核心引擎 |
| LanceDB | 向量数据库 | 核心引擎 |
| Burn | 深度学习框架 | 社区 |
| Mistral | 推理优化 | 生产 |
| 各 startups | AI Infra 全栈 | 新项目首选 |

### 6.2 2026 趋势预测

| 趋势 | 说明 | 时间线 |
|------|------|--------|
| Rust 成为 AI Infra 默认 | 新项目优先选 Rust | 已发生 |
| candle 生态成熟 | 更多模型支持 | 2026 |
| Rust CUDA 后端 | 替代部分 CUDA C++ | 2026-2027 |
| PyO3 生态爆发 | 更多 Python 库用 Rust 重写 | 已发生 |
| Rust in Linux Kernel | GPU 驱动可能用 Rust | 2027+ |
| burn 生产就绪 | 替代部分 PyTorch 场景 | 2027 |
| WASM 推理 | 浏览器/边缘 Rust 推理 | 2026 |

---

## 七、入门路径

### 7.1 学习路线图

```
Phase 1: Rust 基础 (4-6 周)
═══════════════════════════
├── The Rust Book (官方教程)
├── 所有权/借用/生命周期
├── Trait 系统
├── 错误处理 (Result/Option/?)
├── 异步 (tokio)
└── 练习: 实现一个简单的 CLI 工具

Phase 2: AI 相关 Rust (4-6 周)
═══════════════════════════════
├── candle 教程 (推理)
├── tokenizers 库使用
├── safetensors 读写
├── PyO3 Python 绑定
└── 练习: 用 Rust 实现一个 tokenizer wrapper

Phase 3: 系统编程 (4-6 周)
═══════════════════════════
├── tokio 异步运行时
├── gRPC (tonic)
├── 性能优化 (flamegraph/criterion)
├── FFI (与 C/CUDA 交互)
└── 练习: 实现一个推理服务

Phase 4: 生产实践 (持续)
═══════════════════════════
├── 阅读 TGI 源码
├── 阅读 candle 源码
├── 贡献开源项目
└── 构建自己的 AI Infra 组件
```

### 7.2 推荐资源

| 资源 | 类型 | 适合阶段 |
|------|------|---------|
| The Rust Book | 书籍 | 入门 |
| Rust by Example | 在线 | 入门 |
| Programming Rust (O'Reilly) | 书籍 | 进阶 |
| candle 文档 + 示例 | 代码 | AI 相关 |
| PyO3 User Guide | 文档 | Python 绑定 |
| TGI 源码 | 代码 | 系统设计 |
| Rust for Rustaceans | 书籍 | 高级 |
| Zero to Production in Rust | 书籍 | 生产实践 |

### 7.3 第一个项目: Rust 推理 CLI

```rust
// 一个完整的 Rust 推理 CLI 示例
use anyhow::Result;
use clap::Parser;
use candle_core::Device;
use tokenizers::Tokenizer;

#[derive(Parser)]
#[command(name = "rust-infer", about = "Rust LLM 推理 CLI")]
struct Args {
    /// 模型路径 (safetensors)
    #[arg(short, long)]
    model: String,
    
    /// Tokenizer 路径
    #[arg(short, long)]
    tokenizer: String,
    
    /// 输入 prompt
    #[arg(short, long)]
    prompt: String,
    
    /// 最大生成 Token 数
    #[arg(short, long, default_value = "256")]
    max_tokens: usize,
    
    /// 温度
    #[arg(short, long, default_value = "0.7")]
    temperature: f64,
    
    /// 设备 (cpu/cuda)
    #[arg(short, long, default_value = "cuda")]
    device: String,
}

fn main() -> Result<()> {
    let args = Args::parse();
    
    // 初始化
    let device = match args.device.as_str() {
        "cuda" => Device::new_cuda(0)?,
        _ => Device::Cpu,
    };
    
    let tokenizer = Tokenizer::from_file(&args.tokenizer)?;
    
    // Tokenize
    let encoding = tokenizer.encode(args.prompt.as_str(), true)?;
    let input_ids = encoding.get_ids();
    
    println!("Input tokens: {}", input_ids.len());
    println!("Generating...");
    
    // 生成 (简化)
    // let output = model.generate(input_ids, args.max_tokens, args.temperature)?;
    // let text = tokenizer.decode(&output, true)?;
    // println!("{}", text);
    
    Ok(())
}
```

---

## 八、工具对比表

### Rust AI 框架全景

| 框架 | 定位 | GPU 支持 | 模型支持 | 成熟度 | 适用场景 |
|------|------|---------|---------|--------|---------|
| candle | 推理框架 | CUDA/Metal | LLM 为主 | 中 | 轻量推理 |
| burn | 训练+推理 | CUDA/Metal/WGPU | 通用 | 中 | 研究/生产 |
| tch-rs | PyTorch 绑定 | CUDA (libtorch) | 所有 PyTorch | 高 | 需要 PyTorch 生态 |
| tokenizers | 分词 | N/A | N/A | 高 | 分词 |
| safetensors | 序列化 | N/A | N/A | 高 | 模型存储 |
| ort (ONNX) | ONNX 推理 | CUDA/DirectML | ONNX 模型 | 高 | 跨框架推理 |
| rust-bert | NLP 模型 | 通过 tch | Transformer | 中 | NLP 任务 |
| dfdx | 深度学习 | CUDA | 通用 | 低 | 实验 |

### Python 绑定工具对比

| 工具 | 方向 | 性能 | 易用性 | 适用场景 |
|------|------|------|--------|---------|
| PyO3 + maturin | Rust → Python | 极高 | 高 | 2026 首选 |
| pybind11 | C++ → Python | 极高 | 中 | C++ 项目 |
| cffi | C → Python | 高 | 中 | 简单 C 库 |
| ctypes | C → Python | 中 | 低 | 快速原型 |
| Cython | Python → C | 高 | 中 | Python 加速 |

---

## 九、最佳实践

### 9.1 Rust AI 项目规范

1. **错误处理用 anyhow + thiserror** — 库用 thiserror，应用用 anyhow
2. **异步用 tokio** — AI 服务必须异步
3. **日志用 tracing** — 结构化、span 支持
4. **测试用 criterion** — 性能回归测试
5. **CI 用 cargo-nextest** — 更快的测试运行
6. **文档用 rustdoc** — 公共 API 必须有文档
7. **unsafe 最小化** — 只在 FFI 边界使用
8. **Clippy 零警告** — `cargo clippy -- -D warnings`

### 9.2 与 Python 协作模式

```
推荐架构:
┌─────────────────────────────────────────┐
│  Python 层 (用户接口/研究/训练)          │
│  PyTorch / Transformers / FastAPI       │
├─────────────────────────────────────────┤
│  PyO3 绑定层                            │
│  fast_ai_utils (Rust 编译的 .so)        │
├─────────────────────────────────────────┤
│  Rust 核心层 (性能关键路径)              │
│  Tokenization / 数据管道 / 推理引擎     │
└─────────────────────────────────────────┘

原则: Python 做胶水，Rust 做引擎
```

---

## 十、2026 趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| Rust 成为 AI Infra 标准语言 | 新项目默认 Rust | 招聘需求增加 |
| candle 替代部分 PyTorch 推理 | 无 Python 依赖部署 | 简化部署 |
| Rust CUDA (rustc_codegen_nvptx) | Rust 写 GPU kernel | 替代部分 CUDA C++ |
| PyO3 0.23+ 改进 | 更好的 GIL 处理 | Python 绑定更流畅 |
| burn 1.0 发布 | 生产就绪的训练框架 | Rust 全栈 AI |
| WASM 边缘推理 | 浏览器/IoT 运行模型 | 新部署场景 |
| Rust in HuggingFace 扩展 | 更多组件 Rust 化 | 生态统一 |
| AI 辅助 Rust 编程 | Copilot/Claude 写 Rust | 降低入门门槛 |

---

## 十一、相关概念

- [[16_编程/01_编程基础/03_Python_for_AI_2026]] — Python for AI 2026
- [[16_编程/04_实践指南/04_MLOps_编程_模式]] — MLOps 编码模式
- [[16_编程/01_编程基础/01_AI编程2026指南]] — AI 编程工具全景
- [[GPU_Cluster_Operations_2026]] — GPU 集群运维
- [[13_运维/02_SRE与可靠性/20_模型服务_SLA_Management]] — 模型服务 SLA 管理
