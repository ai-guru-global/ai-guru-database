# vLLM CLI Guide

The vllm command-line tool is used to run and manage vLLM models. You can start by viewing the help message with:

```
vllm --help
```

Available Commands:

```
vllm {chat,complete,serve,bench,collect-env,run-batch}
```

## serve

Start the vLLM OpenAI Compatible API server.

Examples:

```bash
# Start with a model
vllm serve meta-llama/Llama-2-7b-hf

# Specify the port
vllm serve meta-llama/Llama-2-7b-hf --port 8100

# Check with --help for more options
# To list all groups
vllm serve --help=listgroup

# To view a argument group
vllm serve --help=ModelConfig

# To view a single argument
vllm serve --help=max-num-seqs

# To search by keyword
vllm serve --help=max
```

## chat

Generate chat completions via the running API server.

Examples:

```bash
# Directly connect to localhost API without arguments
vllm chat

# Specify API url
vllm chat --url http://{vllm-serve-host}:{vllm-serve-port}/v1

# Quick chat with a single prompt
vllm chat --quick "hi"
```

## complete

Generate text completions based on the given prompt via the running API server.

Examples:

```bash
# Directly connect to localhost API without arguments
vllm complete

# Specify API url
vllm complete --url http://{vllm-serve-host}:{vllm-serve-port}/v1

# Quick complete with a single prompt
vllm complete --quick "The future of AI is"
```

## bench

Run benchmark tests for latency online serving throughput and offline inference throughput.

To use benchmark commands, please install with extra dependencies using `pip install vllm[bench]`.

Available Commands:

```bash
vllm bench {latency, serve, throughput}
```

### latency

Benchmark the latency of a single batch of requests.

Example:

```bash
vllm bench latency \
    --model meta-llama/Llama-3.2-1B-Instruct \
    --input-len 32 \
    --output-len 1 \
    --enforce-eager \
    --load-format dummy
```

### serve

Benchmark the online serving throughput.

Example:

```bash
vllm bench serve \
    --model meta-llama/Llama-3.2-1B-Instruct \
    --host server-host \
    --port server-port \
    --random-input-len 32 \
    --random-output-len 4  \
    --num-prompts  5
```

### throughput

Benchmark offline inference throughput.

Example:

```bash
vllm bench throughput \
    --model meta-llama/Llama-3.2-1B-Instruct \
    --input-len 32 \
    --output-len 1 \
    --enforce-eager \
    --load-format dummy
```

## collect-env

Start collecting environment information.

```bash
vllm collect-env
```

## run-batch

Run batch prompts and write results to file.

Examples:

```bash
# Running with a local file
vllm run-batch \
    -i offline_inference/openai_batch/openai_example_batch.jsonl \
    -o results.jsonl \
    --model meta-llama/Meta-Llama-3-8B-Instruct

# Using remote file
vllm run-batch \
    -i https://raw.githubusercontent.com/vllm-project/vllm/main/examples/offline_inference/openai_batch/openai_example_batch.jsonl \
    -o results.jsonl \
    --model meta-llama/Meta-Llama-3-8B-Instruct
```

## More Help

For detailed options of any subcommand, use:

```bash
vllm <subcommand> --help
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
