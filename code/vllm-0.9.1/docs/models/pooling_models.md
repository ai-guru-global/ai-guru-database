---
title: Pooling Models
---
[](){ #pooling-models }

vLLM also supports pooling models, including embedding, reranking and reward models.

In vLLM, pooling models implement the [VllmModelForPooling][vllm.model_executor.models.VllmModelForPooling] interface.
These models use a [Pooler][vllm.model_executor.layers.Pooler] to extract the final hidden states of the input
before returning them.

!!! note
    We currently support pooling models primarily as a matter of convenience.
    As shown in the [Compatibility Matrix][compatibility-matrix], most vLLM features are not applicable to
    pooling models as they only work on the generation or decode stage, so performance may not improve as much.

For pooling models, we support the following `--task` options.
The selected option sets the default pooler used to extract the final hidden states:

| Task                            | Pooling Type   | Normalization   | Softmax   |
|---------------------------------|----------------|-----------------|-----------|
| Embedding (`embed`)             | `LAST`         | ✅︎              | ❌         |
| Classification (`classify`)     | `LAST`         | ❌               | ✅︎        |
| Sentence Pair Scoring (`score`) | \*             | \*              | \*        |

\*The default pooler is always defined by the model.

!!! note
    If the model's implementation in vLLM defines its own pooler, the default pooler is set to that instead of the one specified in this table.

When loading [Sentence Transformers](https://huggingface.co/sentence-transformers) models,
we attempt to override the default pooler based on its Sentence Transformers configuration file (`modules.json`).

!!! tip
    You can customize the model's pooling method via the `--override-pooler-config` option,
    which takes priority over both the model's and Sentence Transformers's defaults.

## Offline Inference

The [LLM][vllm.LLM] class provides various methods for offline inference.
See [configuration][configuration] for a list of options when initializing the model.

### `LLM.encode`

The [encode][vllm.LLM.encode] method is available to all pooling models in vLLM.
It returns the extracted hidden states directly, which is useful for reward models.

```python
from vllm import LLM

llm = LLM(model="Qwen/Qwen2.5-Math-RM-72B", task="reward")
(output,) = llm.encode("Hello, my name is")

data = output.outputs.data
print(f"Data: {data!r}")
```

### `LLM.embed`

The [embed][vllm.LLM.embed] method outputs an embedding vector for each prompt.
It is primarily designed for embedding models.

```python
from vllm import LLM

llm = LLM(model="intfloat/e5-mistral-7b-instruct", task="embed")
(output,) = llm.embed("Hello, my name is")

embeds = output.outputs.embedding
print(f"Embeddings: {embeds!r} (size={len(embeds)})")
```

A code example can be found here: <gh-file:examples/offline_inference/basic/embed.py>

### `LLM.classify`

The [classify][vllm.LLM.classify] method outputs a probability vector for each prompt.
It is primarily designed for classification models.

```python
from vllm import LLM

llm = LLM(model="jason9693/Qwen2.5-1.5B-apeach", task="classify")
(output,) = llm.classify("Hello, my name is")

probs = output.outputs.probs
print(f"Class Probabilities: {probs!r} (size={len(probs)})")
```

A code example can be found here: <gh-file:examples/offline_inference/basic/classify.py>

### `LLM.score`

The [score][vllm.LLM.score] method outputs similarity scores between sentence pairs.
It is designed for embedding models and cross encoder models. Embedding models use cosine similarity, and [cross-encoder models](https://www.sbert.net/examples/applications/cross-encoder/README.html) serve as rerankers between candidate query-document pairs in RAG systems.

!!! note
    vLLM can only perform the model inference component (e.g. embedding, reranking) of RAG.
    To handle RAG at a higher level, you should use integration frameworks such as [LangChain](https://github.com/langchain-ai/langchain).

```python
from vllm import LLM

llm = LLM(model="BAAI/bge-reranker-v2-m3", task="score")
(output,) = llm.score("What is the capital of France?",
                      "The capital of Brazil is Brasilia.")

score = output.outputs.score
print(f"Score: {score}")
```

A code example can be found here: <gh-file:examples/offline_inference/basic/score.py>

## Online Serving

Our [OpenAI-Compatible Server][openai-compatible-server] provides endpoints that correspond to the offline APIs:

- [Pooling API][pooling-api] is similar to `LLM.encode`, being applicable to all types of pooling models.
- [Embeddings API][embeddings-api] is similar to `LLM.embed`, accepting both text and [multi-modal inputs][multimodal-inputs] for embedding models.
- [Classification API][classification-api] is similar to `LLM.classify` and is applicable to sequence classification models.
- [Score API][score-api] is similar to `LLM.score` for cross-encoder models.

## Matryoshka Embeddings

[Matryoshka Embeddings](https://sbert.net/examples/sentence_transformer/training/matryoshka/README.html#matryoshka-embeddings) or [Matryoshka Representation Learning (MRL)](https://arxiv.org/abs/2205.13147) is a technique used in training embedding models. It allows user to trade off between performance and cost.

!!! warning
    Not all embedding models are trained using Matryoshka Representation Learning. To avoid misuse of the `dimensions` parameter, vLLM returns an error for requests that attempt to change the output dimension of models that do not support Matryoshka Embeddings.

    For example, setting `dimensions` parameter while using the `BAAI/bge-m3` model will result in the following error.

    ```json
    {"object":"error","message":"Model \"BAAI/bge-m3\" does not support matryoshka representation, changing output dimensions will lead to poor results.","type":"BadRequestError","param":null,"code":400}
    ```

### Manually enable Matryoshka Embeddings

There is currently no official interface for specifying support for Matryoshka Embeddings. In vLLM, if `is_matryoshka` is `True` in `config.json,` it is allowed to change the output to arbitrary dimensions. Using `matryoshka_dimensions` can control the allowed output dimensions.

For models that support Matryoshka Embeddings but not recognized by vLLM, please manually override the config using `hf_overrides={"is_matryoshka": True}`, `hf_overrides={"matryoshka_dimensions": [<allowed output dimensions>]}` (offline) or `--hf_overrides '{"is_matryoshka": true}'`,  `--hf_overrides '{"matryoshka_dimensions": [<allowed output dimensions>]}'`(online).

Here is an example to serve a model with Matryoshka Embeddings enabled.

```text
vllm serve Snowflake/snowflake-arctic-embed-m-v1.5 --hf_overrides '{"matryoshka_dimensions":[256]}'
```

### Offline Inference

You can change the output dimensions of embedding models that support Matryoshka Embeddings by using the dimensions parameter in [PoolingParams][vllm.PoolingParams].

```python
from vllm import LLM, PoolingParams

model = LLM(model="jinaai/jina-embeddings-v3", 
            task="embed", 
            trust_remote_code=True)
outputs = model.embed(["Follow the white rabbit."], 
                      pooling_params=PoolingParams(dimensions=32))
print(outputs[0].outputs)
```

A code example can be found here: <gh-file:examples/offline_inference/embed_matryoshka_fy.py>

### Online Inference

Use the following command to start vllm server.

```text
vllm serve jinaai/jina-embeddings-v3 --trust-remote-code
```

You can change the output dimensions of embedding models that support Matryoshka Embeddings by using the dimensions parameter.

```text
curl http://127.0.0.1:8000/v1/embeddings \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "input": "Follow the white rabbit.",
    "model": "jinaai/jina-embeddings-v3",
    "encoding_format": "float",
    "dimensions": 32
  }'
```

Expected output:

```json
{"id":"embd-5c21fc9a5c9d4384a1b021daccaf9f64","object":"list","created":1745476417,"model":"jinaai/jina-embeddings-v3","data":[{"index":0,"object":"embedding","embedding":[-0.3828125,-0.1357421875,0.03759765625,0.125,0.21875,0.09521484375,-0.003662109375,0.1591796875,-0.130859375,-0.0869140625,-0.1982421875,0.1689453125,-0.220703125,0.1728515625,-0.2275390625,-0.0712890625,-0.162109375,-0.283203125,-0.055419921875,-0.0693359375,0.031982421875,-0.04052734375,-0.2734375,0.1826171875,-0.091796875,0.220703125,0.37890625,-0.0888671875,-0.12890625,-0.021484375,-0.0091552734375,0.23046875]}],"usage":{"prompt_tokens":8,"total_tokens":8,"completion_tokens":0,"prompt_tokens_details":null}}
```

A openai client example can be found here: <gh-file:examples/online_serving/openai_embedding_matryoshka_fy.py>

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
