# Classification API

This document describes the `/v1/classify` API endpoint implementation in SGLang, which is compatible with vLLM's classification API format.

## Overview

The classification API allows you to classify text inputs using classification models. This implementation follows the same format as vLLM's 0.7.0 classification API.

## API Endpoint

```
POST /v1/classify
```

## Request Format

```json
{
  "model": "model_name",
  "input": "text to classify"
}
```

### Parameters

- `model` (string, required): The name of the classification model to use
- `input` (string, required): The text to classify
- `user` (string, optional): User identifier for tracking
- `rid` (string, optional): Request ID for tracking
- `priority` (integer, optional): Request priority

## Response Format

```json
{
  "id": "classify-9bf17f2847b046c7b2d5495f4b4f9682",
  "object": "list",
  "created": 1745383213,
  "model": "jason9693/Qwen2.5-1.5B-apeach",
  "data": [
    {
      "index": 0,
      "label": "Default",
      "probs": [0.565970778465271, 0.4340292513370514],
      "num_classes": 2
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "total_tokens": 10,
    "completion_tokens": 0,
    "prompt_tokens_details": null
  }
}
```

### Response Fields

- `id`: Unique identifier for the classification request
- `object`: Always "list"
- `created`: Unix timestamp when the request was created
- `model`: The model used for classification
- `data`: Array of classification results
  - `index`: Index of the result
  - `label`: Predicted class label
  - `probs`: Array of probabilities for each class
  - `num_classes`: Total number of classes
- `usage`: Token usage information
  - `prompt_tokens`: Number of input tokens
  - `total_tokens`: Total number of tokens
  - `completion_tokens`: Number of completion tokens (always 0 for classification)
  - `prompt_tokens_details`: Additional token details (optional)

## Example Usage

### Using curl

```bash
curl -v "http://127.0.0.1:8000/v1/classify" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "jason9693/Qwen2.5-1.5B-apeach",
    "input": "Loved the new café—coffee was great."
  }'
```

### Using Python

```python
import requests
import json

# Make classification request
response = requests.post(
    "http://127.0.0.1:8000/v1/classify",
    headers={"Content-Type": "application/json"},
    json={
        "model": "jason9693/Qwen2.5-1.5B-apeach",
        "input": "Loved the new café—coffee was great."
    }
)

# Parse response
result = response.json()
print(json.dumps(result, indent=2))
```

## Supported Models

The classification API works with any classification model supported by SGLang, including:

### Classification Models (Multi-class)
- `LlamaForSequenceClassification` - Multi-class classification
- `Qwen2ForSequenceClassification` - Multi-class classification
- `Qwen3ForSequenceClassification` - Multi-class classification
- `BertForSequenceClassification` - Multi-class classification
- `Gemma2ForSequenceClassification` - Multi-class classification

**Label Mapping**: The API automatically uses the `id2label` mapping from the model's `config.json` file to provide meaningful label names instead of generic class names. If `id2label` is not available, it falls back to `LABEL_0`, `LABEL_1`, etc., or `Class_0`, `Class_1` as a last resort.

### Reward Models (Single score)
- `InternLM2ForRewardModel` - Single reward score
- `Qwen2ForRewardModel` - Single reward score
- `LlamaForSequenceClassificationWithNormal_Weights` - Special reward model

**Note**: The `/classify` endpoint in SGLang was originally designed for reward models but now supports all non-generative models. Our `/v1/classify` endpoint provides a standardized vLLM-compatible interface for classification tasks.

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid request format or missing required fields
- `500 Internal Server Error`: Server-side processing error

Error response format:
```json
{
  "error": "Error message",
  "type": "error_type",
  "code": 400
}
```

## Implementation Details

The classification API is implemented using:

1. **Rust Model Gateway**: Handles routing and request/response models in `sgl-model-gateway/src/protocols/spec.rs`
2. **Python HTTP Server**: Implements the actual endpoint in `python/sglang/srt/entrypoints/http_server.py`
3. **Classification Service**: Handles the classification logic in `python/sglang/srt/entrypoints/openai/serving_classify.py`

## Testing

Use the provided test script to verify the implementation:

```bash
python test_classify_api.py
```

## Compatibility

This implementation is compatible with vLLM's classification API format, allowing seamless migration from vLLM to SGLang for classification tasks.

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
