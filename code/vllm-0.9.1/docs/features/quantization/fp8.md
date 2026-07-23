---
title: FP8 W8A8
---
[](){ #fp8 }

vLLM supports FP8 (8-bit floating point) weight and activation quantization using hardware acceleration on GPUs such as Nvidia H100 and AMD MI300x.
Currently, only Hopper and Ada Lovelace GPUs are officially supported for W8A8.
Ampere GPUs are supported for W8A16 (weight-only FP8) utilizing Marlin kernels.
Quantization of models with FP8 allows for a 2x reduction in model memory requirements and up to a 1.6x improvement in throughput with minimal impact on accuracy.

Please visit the HF collection of [quantized FP8 checkpoints of popular LLMs ready to use with vLLM](https://huggingface.co/collections/neuralmagic/fp8-llms-for-vllm-666742ed2b78b7ac8df13127).

The FP8 types typically supported in hardware have two distinct representations, each useful in different scenarios:

- **E4M3**: Consists of 1 sign bit, 4 exponent bits, and 3 bits of mantissa. It can store values up to +/-448 and `nan`.
- **E5M2**: Consists of 1 sign bit, 5 exponent bits, and 2 bits of mantissa. It can store values up to +/-57344, +/- `inf`, and `nan`. The tradeoff for the increased dynamic range is lower precision of the stored values.

!!! note
    FP8 computation is supported on NVIDIA GPUs with compute capability > 8.9 (Ada Lovelace, Hopper).
    FP8 models will run on compute capability > 8.0 (Ampere) as weight-only W8A16, utilizing FP8 Marlin.

## Installation

To produce performant FP8 quantized models with vLLM, you'll need to install the [llm-compressor](https://github.com/vllm-project/llm-compressor/) library:

```console
pip install llmcompressor
```

## Quantization Process

The quantization process involves three main steps:

1. Loading the model
2. Applying quantization
3. Evaluating accuracy in vLLM

### 1. Loading the Model

Load your model and tokenizer using the standard `transformers` AutoModel classes:

```python
from transformers import AutoTokenizer, AutoModelForCausalLM

MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"
model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID, device_map="auto", torch_dtype="auto",
)
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
```

### 2. Applying Quantization

For FP8 quantization, we can recover accuracy with simple RTN quantization. We recommend targeting all `Linear` layers using the `FP8_DYNAMIC` scheme, which uses:

- Static, per-channel quantization on the weights
- Dynamic, per-token quantization on the activations

Since simple RTN does not require data for weight quantization and the activations are quantized dynamically, we do not need any calibration data for this quantization flow.

```python
from llmcompressor.transformers import oneshot
from llmcompressor.modifiers.quantization import QuantizationModifier

# Configure the simple PTQ quantization
recipe = QuantizationModifier(
  targets="Linear", scheme="FP8_DYNAMIC", ignore=["lm_head"])

# Apply the quantization algorithm.
oneshot(model=model, recipe=recipe)

# Save the model: Meta-Llama-3-8B-Instruct-FP8-Dynamic
SAVE_DIR = MODEL_ID.split("/")[1] + "-FP8-Dynamic"
model.save_pretrained(SAVE_DIR)
tokenizer.save_pretrained(SAVE_DIR)
```

### 3. Evaluating Accuracy

Install `vllm` and `lm-evaluation-harness` for evaluation:

```console
pip install vllm lm-eval==0.4.4
```

Load and run the model in `vllm`:

```python
from vllm import LLM
model = LLM("./Meta-Llama-3-8B-Instruct-FP8-Dynamic")
result = model.generate("Hello my name is")
print(result[0].outputs[0].text)
```

Evaluate accuracy with `lm_eval` (for example on 250 samples of `gsm8k`):

!!! note
    Quantized models can be sensitive to the presence of the `bos` token. `lm_eval` does not add a `bos` token by default, so make sure to include the `add_bos_token=True` argument when running your evaluations.

```console
$ MODEL=$PWD/Meta-Llama-3-8B-Instruct-FP8-Dynamic
$ lm_eval \
  --model vllm \
  --model_args pretrained=$MODEL,add_bos_token=True \
  --tasks gsm8k  --num_fewshot 5 --batch_size auto --limit 250
```

Here's an example of the resulting scores:

```text
|Tasks|Version|     Filter     |n-shot|  Metric   |   |Value|   |Stderr|
|-----|------:|----------------|-----:|-----------|---|----:|---|-----:|
|gsm8k|      3|flexible-extract|     5|exact_match|↑  |0.768|±  |0.0268|
|     |       |strict-match    |     5|exact_match|↑  |0.768|±  |0.0268|
```

## Troubleshooting and Support

If you encounter any issues or have feature requests, please open an issue on the [vllm-project/llm-compressor](https://github.com/vllm-project/llm-compressor/issues) GitHub repository.

## Online Dynamic Quantization

Dynamic quantization of an original precision BF16/FP16 model to FP8 can be achieved with vLLM without any calibration data required. You can enable the feature by specifying `--quantization="fp8"` in the command line or setting `quantization="fp8"` in the LLM constructor.

In this mode, all Linear modules (except for the final `lm_head`) have their weights quantized down to FP8_E4M3 precision with a per-tensor scale. Activations have their minimum and maximum values calculated during each forward pass to provide a dynamic per-tensor scale for high accuracy. As a result, latency improvements are limited in this mode.

```python
from vllm import LLM
model = LLM("facebook/opt-125m", quantization="fp8")
# INFO 06-10 17:55:42 model_runner.py:157] Loading model weights took 0.1550 GB
result = model.generate("Hello, my name is")
print(result[0].outputs[0].text)
```

!!! warning
    Currently, we load the model at original precision before quantizing down to 8-bits, so you need enough memory to load the whole model.

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
