---
title: INT4 W4A16
---
[](){ #int4 }

vLLM supports quantizing weights to INT4 for memory savings and inference acceleration. This quantization method is particularly useful for reducing model size and maintaining low latency in workloads with low queries per second (QPS).

Please visit the HF collection of [quantized INT4 checkpoints of popular LLMs ready to use with vLLM](https://huggingface.co/collections/neuralmagic/int4-llms-for-vllm-668ec34bf3c9fa45f857df2c).

!!! note
    INT4 computation is supported on NVIDIA GPUs with compute capability > 8.0 (Ampere, Ada Lovelace, Hopper, Blackwell).

## Prerequisites

To use INT4 quantization with vLLM, you'll need to install the [llm-compressor](https://github.com/vllm-project/llm-compressor/) library:

```console
pip install llmcompressor
```

Additionally, install `vllm` and `lm-evaluation-harness` for evaluation:

```console
pip install vllm lm-eval==0.4.4
```

## Quantization Process

The quantization process involves four main steps:

1. Loading the model
2. Preparing calibration data
3. Applying quantization
4. Evaluating accuracy in vLLM

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

### 2. Preparing Calibration Data

When quantizing weights to INT4, you need sample data to estimate the weight updates and calibrated scales.
It's best to use calibration data that closely matches your deployment data.
For a general-purpose instruction-tuned model, you can use a dataset like `ultrachat`:

```python
from datasets import load_dataset

NUM_CALIBRATION_SAMPLES = 512
MAX_SEQUENCE_LENGTH = 2048

# Load and preprocess the dataset
ds = load_dataset("HuggingFaceH4/ultrachat_200k", split="train_sft")
ds = ds.shuffle(seed=42).select(range(NUM_CALIBRATION_SAMPLES))

def preprocess(example):
    return {"text": tokenizer.apply_chat_template(example["messages"], tokenize=False)}
ds = ds.map(preprocess)

def tokenize(sample):
    return tokenizer(sample["text"], padding=False, max_length=MAX_SEQUENCE_LENGTH, truncation=True, add_special_tokens=False)
ds = ds.map(tokenize, remove_columns=ds.column_names)
```

### 3. Applying Quantization

Now, apply the quantization algorithms:

```python
from llmcompressor.transformers import oneshot
from llmcompressor.modifiers.quantization import GPTQModifier
from llmcompressor.modifiers.smoothquant import SmoothQuantModifier

# Configure the quantization algorithms
recipe = GPTQModifier(targets="Linear", scheme="W4A16", ignore=["lm_head"])

# Apply quantization
oneshot(
    model=model,
    dataset=ds,
    recipe=recipe,
    max_seq_length=MAX_SEQUENCE_LENGTH,
    num_calibration_samples=NUM_CALIBRATION_SAMPLES,
)

# Save the compressed model: Meta-Llama-3-8B-Instruct-W4A16-G128
SAVE_DIR = MODEL_ID.split("/")[1] + "-W4A16-G128"
model.save_pretrained(SAVE_DIR, save_compressed=True)
tokenizer.save_pretrained(SAVE_DIR)
```

This process creates a W4A16 model with weights quantized to 4-bit integers.

### 4. Evaluating Accuracy

After quantization, you can load and run the model in vLLM:

```python
from vllm import LLM
model = LLM("./Meta-Llama-3-8B-Instruct-W4A16-G128")
```

To evaluate accuracy, you can use `lm_eval`:

```console
$ lm_eval --model vllm \
  --model_args pretrained="./Meta-Llama-3-8B-Instruct-W4A16-G128",add_bos_token=true \
  --tasks gsm8k \
  --num_fewshot 5 \
  --limit 250 \
  --batch_size 'auto'
```

!!! note
    Quantized models can be sensitive to the presence of the `bos` token. Make sure to include the `add_bos_token=True` argument when running evaluations.

## Best Practices

- Start with 512 samples for calibration data, and increase if accuracy drops
- Ensure the calibration data contains a high variety of samples to prevent overfitting towards a specific use case
- Use a sequence length of 2048 as a starting point
- Employ the chat template or instruction template that the model was trained with
- If you've fine-tuned a model, consider using a sample of your training data for calibration
- Tune key hyperparameters to the quantization algorithm:
  - `dampening_frac` sets how much influence the GPTQ algorithm has. Lower values can improve accuracy, but can lead to numerical instabilities that cause the algorithm to fail.
  - `actorder` sets the activation ordering. When compressing the weights of a layer weight, the order in which channels are quantized matters. Setting `actorder="weight"` can improve accuracy without added latency.

The following is an example of an expanded quantization recipe you can tune to your own use case:

```python
from compressed_tensors.quantization import (
    QuantizationArgs,
    QuantizationScheme,
    QuantizationStrategy,
    QuantizationType,
) 
recipe = GPTQModifier(
    targets="Linear",
    config_groups={
        "config_group": QuantizationScheme(
            targets=["Linear"],
            weights=QuantizationArgs(
                num_bits=4,
                type=QuantizationType.INT,
                strategy=QuantizationStrategy.GROUP,
                group_size=128,
                symmetric=True,
                dynamic=False,
                actorder="weight",
            ),
        ),
    },
    ignore=["lm_head"],
    update_size=NUM_CALIBRATION_SAMPLES,
    dampening_frac=0.01
)
```

## Troubleshooting and Support

If you encounter any issues or have feature requests, please open an issue on the [vllm-project/llm-compressor](https://github.com/vllm-project/llm-compressor/issues) GitHub repository. The full INT4 quantization example in `llm-compressor` is available [here](https://github.com/vllm-project/llm-compressor/blob/main/examples/quantization_w4a16/llama3_example.py).

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
