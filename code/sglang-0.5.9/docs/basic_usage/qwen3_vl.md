# Qwen3-VL Usage

[Qwen3-VL](https://huggingface.co/collections/Qwen/qwen3-vl)
is Alibaba’s latest multimodal large language model with strong text, vision, and reasoning capabilities.
SGLang supports Qwen3-VL Family of models with Image and Video input support.

## Launch commands for SGLang

Below are suggested launch commands tailored for different hardware / precision modes

### FP8 (quantised) mode
For high memory-efficiency and latency optimized deployments (e.g., on H100, H200) where FP8 checkpoint is supported:
```bash
python3 -m sglang.launch_server \
  --model-path Qwen/Qwen3-VL-235B-A22B-Instruct-FP8 \
  --tp 8 \
  --ep 8 \
  --host 0.0.0.0 \
  --port 30000 \
  --keep-mm-feature-on-device
```

### Non-FP8 (BF16 / full precision) mode
For deployments on A100/H100 where BF16 is used (or FP8 snapshot not used):
```bash
python3 -m sglang.launch_server \
  --model-path Qwen/Qwen3-VL-235B-A22B-Instruct \
  --tp 8 \
  --ep 8 \
  --host 0.0.0.0 \
  --port 30000 \
```

## Hardware-specific notes / recommendations

- On H100 with FP8: Use the FP8 checkpoint for best memory efficiency.
- On A100 / H100 with BF16 (non-FP8): It’s recommended to use `--mm-max-concurrent-calls` to control parallel throughput and GPU memory usage during image/video inference.
- On H200 & B200: The model can be run “out of the box”, supporting full context length plus concurrent image + video processing.

## Sending Image/Video Requests

### Image input:

```python
import requests

url = f"http://localhost:30000/v1/chat/completions"

data = {
    "model": "Qwen/Qwen3-VL-30B-A3B-Instruct",
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What’s in this image?"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://github.com/sgl-project/sglang/blob/main/examples/assets/example_image.png?raw=true"
                    },
                },
            ],
        }
    ],
    "max_tokens": 300,
}

response = requests.post(url, json=data)
print(response.text)
```

### Video Input:

```python
import requests

url = f"http://localhost:30000/v1/chat/completions"

data = {
    "model": "Qwen/Qwen3-VL-30B-A3B-Instruct",
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What’s happening in this video?"},
                {
                    "type": "video_url",
                    "video_url": {
                        "url": "https://github.com/sgl-project/sgl-test-files/raw/refs/heads/main/videos/jobs_presenting_ipod.mp4"
                    },
                },
            ],
        }
    ],
    "max_tokens": 300,
}

response = requests.post(url, json=data)
print(response.text)
```

## Important Server Parameters and Flags

When launching the model server for **multimodal support**, you can use the following command-line arguments to fine-tune performance and behavior:

- `--mm-attention-backend`: Specify multimodal attention backend. Eg. `fa3`(Flash Attention 3)
- `--mm-max-concurrent-calls <value>`: Specifies the **maximum number of concurrent asynchronous multimodal data processing calls** allowed on the server. Use this to control parallel throughput and GPU memory usage during image/video inference.
- `--mm-per-request-timeout <seconds>`: Defines the **timeout duration (in seconds)** for each multimodal request. If a request exceeds this time limit (e.g., for very large video inputs), it will be automatically terminated.
- `--keep-mm-feature-on-device`: Instructs the server to **retain multimodal feature tensors on the GPU** after processing. This avoids device-to-host (D2H) memory copies and improves performance for repeated or high-frequency inference workloads.
- `SGLANG_USE_CUDA_IPC_TRANSPORT=1`: Shared memory pool based CUDA IPC for multi-modal data transport. For significantly improving e2e latency.

### Example usage with the above optimizations:
```bash
SGLANG_USE_CUDA_IPC_TRANSPORT=1 \
SGLANG_VLM_CACHE_SIZE_MB=0 \
python -m sglang.launch_server \
  --model-path Qwen/Qwen3-VL-235B-A22B-Instruct \
  --host 0.0.0.0 \
  --port 30000 \
  --trust-remote-code \
  --tp-size 8 \
  --enable-cache-report \
  --log-level info \
  --max-running-requests 64 \
  --mem-fraction-static 0.65 \
  --chunked-prefill-size 8192 \
  --attention-backend fa3 \
  --mm-attention-backend fa3 \
  --enable-metrics
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
