---
title: Quantized KV Cache
---
[](){ #quantized-kvcache }

## FP8 KV Cache

Quantizing the KV cache to FP8 reduces its memory footprint. This increases the number of tokens that can be stored in the cache, improving throughput.

### FP8 Formats

[OCP (Open Compute Project)](https://www.opencompute.org) specifies two common 8-bit floating point data formats:

- E5M2 (5 exponent bits and 2 mantissa bits)
- E4M3FN (4 exponent bits and 3 mantissa bits, often shortened as E4M3)

The E4M3 format offers higher precision compared to E5M2. However, due to its small dynamic range (±240.0), E4M3 typically requires a higher-precision (FP32) scaling factor alongside each quantized tensor.

### Current Limitations

For now, only per-tensor (scalar) scaling factors are supported. Development is ongoing to support scaling factors of a finer granularity (e.g. per-channel).

### Performance Impact

The current FP8 KV cache implementation primarily benefits throughput by allowing approximately double the amount of space for KV cache allocation. This enables either:

- Processing longer context lengths for individual requests, or
- Handling more concurrent request batches

However, there are currently no latency improvements as the implementation does not yet include fused dequantization and attention operations. Future releases will support quantized attention with hardware acceleration, which should provide additional performance benefits. While the most recent silicon offerings (e.g. AMD MI300, NVIDIA Hopper or later) support native hardware conversion between FP8 and other formats (fp32, fp16, bf16), this benefit is not yet fully realized.

Studies have shown that FP8 E4M3 quantization typically only minimally degrades inference accuracy, making it a practical choice for throughput optimization.

## Usage Example

Here is an example of how to enable FP8 quantization:

```python
# To calculate kv cache scales on the fly enable the calculate_kv_scales
# parameter

from vllm import LLM, SamplingParams

sampling_params = SamplingParams(temperature=0.7, top_p=0.8)
llm = LLM(model="meta-llama/Llama-2-7b-chat-hf",
          kv_cache_dtype="fp8",
          calculate_kv_scales=True)
prompt = "London is the capital of"
out = llm.generate(prompt, sampling_params)[0].outputs[0].text
print(out)
```

The `kv_cache_dtype` argument specifies the data type for KV cache storage:
- `"auto"`: Uses the model's default "unquantized" data type
- `"fp8"` or `"fp8_e4m3"`: Supported on CUDA 11.8+ and ROCm (AMD GPU)
- `"fp8_e5m2"`: Supported on CUDA 11.8+

## Calibrated Scales for Better Accuracy

For optimal model quality when using FP8 KV Cache, we recommend using calibrated scales tuned to representative inference data. [LLM Compressor](https://github.com/vllm-project/llm-compressor/) is the recommended tool for this process.

### Installation

First, install the required dependencies:

```console
pip install llmcompressor
```

### Example Usage

Here's a complete example using `meta-llama/Llama-3.1-8B-Instruct` (most models can use this same pattern):

```python
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer
from llmcompressor.transformers import oneshot

# Select model and load it
MODEL_ID = "meta-llama/Llama-3.1-8B-Instruct"
model = AutoModelForCausalLM.from_pretrained(MODEL_ID, device_map="auto", torch_dtype="auto")
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)

# Select calibration dataset
DATASET_ID = "HuggingFaceH4/ultrachat_200k"
DATASET_SPLIT = "train_sft"

# Configure calibration parameters
NUM_CALIBRATION_SAMPLES = 512  # 512 samples is a good starting point
MAX_SEQUENCE_LENGTH = 2048

# Load and preprocess dataset
ds = load_dataset(DATASET_ID, split=DATASET_SPLIT)
ds = ds.shuffle(seed=42).select(range(NUM_CALIBRATION_SAMPLES))

def process_and_tokenize(example):
    text = tokenizer.apply_chat_template(example["messages"], tokenize=False)
    return tokenizer(
        text,
        padding=False,
        max_length=MAX_SEQUENCE_LENGTH,
        truncation=True,
        add_special_tokens=False,
    )

ds = ds.map(process_and_tokenize, remove_columns=ds.column_names)

# Configure quantization settings
recipe = """
quant_stage:
    quant_modifiers:
        QuantizationModifier:
            kv_cache_scheme:
                num_bits: 8
                type: float
                strategy: tensor
                dynamic: false
                symmetric: true
"""

# Apply quantization
oneshot(
    model=model,
    dataset=ds,
    recipe=recipe,
    max_seq_length=MAX_SEQUENCE_LENGTH,
    num_calibration_samples=NUM_CALIBRATION_SAMPLES,
)

# Save quantized model: Llama-3.1-8B-Instruct-FP8-KV
SAVE_DIR = MODEL_ID.split("/")[1] + "-FP8-KV"
model.save_pretrained(SAVE_DIR, save_compressed=True)
tokenizer.save_pretrained(SAVE_DIR)
```

The above script will create a folder in your current directory containing your quantized model (e.g., `Llama-3.1-8B-Instruct-FP8-KV`) with calibrated scales.

When running the model you must specify `kv_cache_dtype="fp8"` in order to enable the kv cache quantization and use the scales.

```python
from vllm import LLM, SamplingParams

sampling_params = SamplingParams(temperature=0.7, top_p=0.8)
llm = LLM(model="Llama-3.1-8B-Instruct-FP8-KV", kv_cache_dtype="fp8")
prompt = "London is the capital of"
out = llm.generate(prompt, sampling_params)[0].outputs[0].text
print(out)
```

## 核心知识框架

| 知识层 | 内容 | 深度要求 | 优先级 |
|--------|------|----------|--------|
| 基础概念 | 定义/原理/分类 | 理解并能解释 | P0 |
| 核心方法 | 算法/技术/工具 | 掌握并能应用 | P0 |
| 工程实践 | 设计/实现/优化 | 独立完成项目 | P1 |
| 前沿进展 | 最新研究/趋势 | 了解并跟踪 | P2 |
| 应用案例 | 实际场景/经验 | 参考并借鉴 | P1 |

## 技术要点速查

| 要点 | 说明 | 注意事项 |
|------|------|----------|
| 核心原理 | 理解底层机制 | 不要死记硬背 |
| 实践方法 | 动手验证理论 | 从简单开始 |
| 性能优化 | 瓶颈分析+调优 | 数据驱动 |
| 错误排查 | 系统化定位问题 | 日志+复现 |
| 最佳实践 | 遵循行业标准 | 因地制宜 |
| 持续学习 | 跟踪技术发展 | 选择性深入 |

## 对比分析表

| 维度 | 方案一 | 方案二 | 方案三 | 推荐 |
|------|--------|--------|--------|------|
| 复杂度 | 低 | 中 | 高 | 按需选择 |
| 性能 | 基础 | 良好 | 优秀 | 按需求 |
| 可维护性 | 高 | 中 | 低 | 优先高 |
| 学习曲线 | 平缓 | 中等 | 陡峭 | 按团队 |
| 社区支持 | 广泛 | 一般 | 有限 | 优先广泛 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何快速入门? | 先理解核心概念，再通过实践加深理解 |
| 如何选择技术方案? | 根据场景需求、团队能力、成本约束综合评估 |
| 遇到问题如何排查? | 复现问题→定位范围→分析原因→验证修复 |
| 如何持续提升? | 系统学习+项目实践+社区交流+定期复盘 |
| 如何评估效果? | 设定明确指标→对比基线→持续监控 |

## 学习路径

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 基本理解 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立操作 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能解决问题 |
| 实战 | 生产级应用 | 4-6周 | 独立负责 |
| 精通 | 架构+创新 | 持续 | 技术领导 |

## 术语表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业最佳实践 |
| Trade-off | 权衡取舍 |
| Scalability | 可扩展性 |
| Maintainability | 可维护性 |
| Observability | 可观测性 |
| Reliability | 可靠性 |

## 检查清单

- [ ] 核心概念已理解
- [ ] 基本操作已掌握
- [ ] 实践项目已完成
- [ ] 常见问题能解决
- [ ] 前沿趋势有关注
- [ ] 知识已沉淀文档化
