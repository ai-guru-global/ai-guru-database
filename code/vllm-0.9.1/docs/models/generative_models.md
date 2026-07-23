---
title: Generative Models
---
[](){ #generative-models }

vLLM provides first-class support for generative models, which covers most of LLMs.

In vLLM, generative models implement the [VllmModelForTextGeneration][vllm.model_executor.models.VllmModelForTextGeneration] interface.
Based on the final hidden states of the input, these models output log probabilities of the tokens to generate,
which are then passed through [Sampler][vllm.model_executor.layers.Sampler] to obtain the final text.

For generative models, the only supported `--task` option is `"generate"`.
Usually, this is automatically inferred so you don't have to specify it.

## Offline Inference

The [LLM][vllm.LLM] class provides various methods for offline inference.
See [configuration][configuration] for a list of options when initializing the model.

### `LLM.generate`

The [generate][vllm.LLM.generate] method is available to all generative models in vLLM.
It is similar to [its counterpart in HF Transformers](https://huggingface.co/docs/transformers/main/en/main_classes/text_generation#transformers.GenerationMixin.generate),
except that tokenization and detokenization are also performed automatically.

```python
from vllm import LLM

llm = LLM(model="facebook/opt-125m")
outputs = llm.generate("Hello, my name is")

for output in outputs:
    prompt = output.prompt
    generated_text = output.outputs[0].text
    print(f"Prompt: {prompt!r}, Generated text: {generated_text!r}")
```

You can optionally control the language generation by passing [SamplingParams][vllm.SamplingParams].
For example, you can use greedy sampling by setting `temperature=0`:

```python
from vllm import LLM, SamplingParams

llm = LLM(model="facebook/opt-125m")
params = SamplingParams(temperature=0)
outputs = llm.generate("Hello, my name is", params)

for output in outputs:
    prompt = output.prompt
    generated_text = output.outputs[0].text
    print(f"Prompt: {prompt!r}, Generated text: {generated_text!r}")
```

!!! warning
    By default, vLLM will use sampling parameters recommended by model creator by applying the `generation_config.json` from the huggingface model repository if it exists. In most cases, this will provide you with the best results by default if [SamplingParams][vllm.SamplingParams] is not specified.

    However, if vLLM's default sampling parameters are preferred, please pass `generation_config="vllm"` when creating the [LLM][vllm.LLM] instance.
A code example can be found here: <gh-file:examples/offline_inference/basic/basic.py>

### `LLM.beam_search`

The [beam_search][vllm.LLM.beam_search] method implements [beam search](https://huggingface.co/docs/transformers/en/generation_strategies#beam-search) on top of [generate][vllm.LLM.generate].
For example, to search using 5 beams and output at most 50 tokens:

```python
from vllm import LLM
from vllm.sampling_params import BeamSearchParams

llm = LLM(model="facebook/opt-125m")
params = BeamSearchParams(beam_width=5, max_tokens=50)
outputs = llm.beam_search([{"prompt": "Hello, my name is "}], params)

for output in outputs:
    generated_text = output.sequences[0].text
    print(f"Generated text: {generated_text!r}")
```

### `LLM.chat`

The [chat][vllm.LLM.chat] method implements chat functionality on top of [generate][vllm.LLM.generate].
In particular, it accepts input similar to [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat)
and automatically applies the model's [chat template](https://huggingface.co/docs/transformers/en/chat_templating) to format the prompt.

!!! warning
    In general, only instruction-tuned models have a chat template.
    Base models may perform poorly as they are not trained to respond to the chat conversation.

```python
from vllm import LLM

llm = LLM(model="meta-llama/Meta-Llama-3-8B-Instruct")
conversation = [
    {
        "role": "system",
        "content": "You are a helpful assistant"
    },
    {
        "role": "user",
        "content": "Hello"
    },
    {
        "role": "assistant",
        "content": "Hello! How can I assist you today?"
    },
    {
        "role": "user",
        "content": "Write an essay about the importance of higher education.",
    },
]
outputs = llm.chat(conversation)

for output in outputs:
    prompt = output.prompt
    generated_text = output.outputs[0].text
    print(f"Prompt: {prompt!r}, Generated text: {generated_text!r}")
```

A code example can be found here: <gh-file:examples/offline_inference/basic/chat.py>

If the model doesn't have a chat template or you want to specify another one,
you can explicitly pass a chat template:

```python
from vllm.entrypoints.chat_utils import load_chat_template

# You can find a list of existing chat templates under `examples/`
custom_template = load_chat_template(chat_template="<path_to_template>")
print("Loaded chat template:", custom_template)

outputs = llm.chat(conversation, chat_template=custom_template)
```

## Online Serving

Our [OpenAI-Compatible Server][openai-compatible-server] provides endpoints that correspond to the offline APIs:

- [Completions API][completions-api] is similar to `LLM.generate` but only accepts text.
- [Chat API][chat-api]  is similar to `LLM.chat`, accepting both text and [multi-modal inputs][multimodal-inputs] for models with a chat template.

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
