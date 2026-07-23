# How to reproduce the benchmark results of SGLang

## Prerequisite

### Install the latest SGLang

```bash
git clone https://github.com/sgl-project/sglang.git
cd sglang
git checkout v0.2.7

pip install --upgrade pip
pip install -e "python[all]"

pip install flashinfer -i https://flashinfer.ai/whl/cu121/torch2.3/
```

### Set up ulimit and HF_TOKEN

```bash
ulimit -n 65535
# Change the token to a real and usable one, with access permissions for the Llama 3 models.
export HF_TOKEN=hf_token
```

### Launch the server

```bash
# Meta-Llama-3.1-8B-Instruct
python -m sglang.launch_server --model-path meta-llama/Llama-3.1-8B-Instruct --enable-torch-compile --disable-radix-cache

# Meta-Llama-3.1-70B-Instruct
python -m sglang.launch_server --model-path meta-llama/Llama-3.1-70B-Instruct --disable-radix-cache --tp 8

# Meta-Llama-3-70B-Instruct-FP8
python -m sglang.launch_server --model-path neuralmagic/Meta-Llama-3-70B-Instruct-FP8 --disable-radix-cache --tp 8
```

## Benchmark

### Hardware Requirements

- 8B models: Single NVIDIA A100 80GB GPU
- 70B models: 8 x NVIDIA A100 80GB GPUs with Tensor Parallelism (TP) 8
- 70B FP8 models: 8 x NVIDIA H100 GPUs with Tensor Parallelism (TP) 8

Please ensure you have the appropriate hardware before running the benchmarks.

#### Offline benchmark

```bash
python3 -m sglang.bench_serving --backend sglang --dataset-name random --num-prompts 4000 --random-input 1024 --random-output 1024 --output-file offline.jsonl
python3 -m sglang.bench_serving --backend sglang --dataset-name random --num-prompts 5000 --random-input 1024 --random-output 512 --output-file offline.jsonl
python3 -m sglang.bench_serving --backend sglang --dataset-name random --num-prompts 1000 --random-input 4096 --random-output 2048 --output-file offline.jsonl
python3 -m sglang.bench_serving --backend sglang --dataset-name random --num-prompts 2000 --random-input 4096 --random-output 1024 --output-file offline.jsonl
python3 -m sglang.bench_serving --backend sglang --dataset-name random --num-prompts 6000 --random-input 256 --random-output 512 --output-file offline.jsonl
python3 -m sglang.bench_serving --backend sglang --dataset-name sharegpt --num-prompts 3000 --output-file offline.jsonl
cat offline.jsonl | cut -d':' -f12 | cut -d',' -f1
```

#### Online benchmark

```bash
python3 -m sglang.bench_serving --backend sglang --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 300 --request-rate 1 --output-file online.jsonl
python3 -m sglang.bench_serving --backend sglang --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 600 --request-rate 2 --output-file online.jsonl
python3 -m sglang.bench_serving --backend sglang --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 1200 --request-rate 4 --output-file online.jsonl
python3 -m sglang.bench_serving --backend sglang --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 2400 --request-rate 8 --output-file online.jsonl
python3 -m sglang.bench_serving --backend sglang --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 3200 --request-rate 16 --output-file online.jsonl
cat online.jsonl | cut -d':' -f9 | cut -d',' -f1
```

## Other

We tried using vLLM 0.5.3.post1, but it often crashes under high loads, and it seems to have similar or worse performance compared to vLLM 0.5.2 from our partial benchmarking, so we are using the older version, vLLM 0.5.2.

Preparation for TensorRT LLM can refer to https://github.com/sgl-project/tensorrt-demo. Specifically, we used a batch size of 512, a max input length of 8192, and a max number of tokens of 8192. The instance count for preprocessing and postprocessing in Triton Server is 16.

```bash
# vLLM
pip install vllm==0.5.2
pip install jsonschema==4.21.1

# Meta-Llama-3-8B-Instruct
python -m vllm.entrypoints.openai.api_server --model meta-llama/Meta-Llama-3-8B-Instruct --disable-log-requests

# meta-llama/Meta-Llama-3-70B-Instruct
python -m vllm.entrypoints.openai.api_server --model meta-llama/Meta-Llama-3-70B-Instruct --disable-log-requests --tensor 8

# neuralmagic/Meta-Llama-3-70B-Instruct-FP8
python -m vllm.entrypoints.openai.api_server --model neuralmagic/Meta-Llama-3-70B-Instruct-FP8 --disable-log-requests --tensor 8
```

```bash
wget https://raw.githubusercontent.com/sgl-project/sglang/main/python/sglang/bench_serving.py
```

```bash
# vLLM Offline

python3 bench_serving.py --backend vllm --dataset-name random --num-prompts 4000 --random-input 1024 --random-output 1024 --output-file offline_vllm.jsonl
python3 bench_serving.py --backend vllm --dataset-name random --num-prompts 5000 --random-input 1024 --random-output 512 --output-file offline_vllm.jsonl
python3 bench_serving.py --backend vllm --dataset-name random --num-prompts 1000 --random-input 4096 --random-output 2048 --output-file offline_vllm.jsonl
python3 bench_serving.py --backend vllm --dataset-name random --num-prompts 2000 --random-input 4096 --random-output 1024 --output-file offline_vllm.jsonl
python3 bench_serving.py --backend vllm --dataset-name random --num-prompts 6000 --random-input 256 --random-output 512 --output-file offline_vllm.jsonl
python3 bench_serving.py --backend vllm --dataset-name sharegpt --num-prompts 3000 --output-file offline_vllm.jsonl
cat offline_vllm.jsonl | cut -d':' -f12 | cut -d',' -f1
```

```bash
# vLLM Online

python3 bench_serving.py --backend vllm --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 300 --request-rate 1 --output-file online_vllm.jsonl
python3 bench_serving.py --backend vllm --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 600 --request-rate 2 --output-file online_vllm.jsonl
python3 bench_serving.py --backend vllm --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 1200 --request-rate 4 --output-file online_vllm.jsonl
python3 bench_serving.py --backend vllm --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 2400 --request-rate 8 --output-file online_vllm.jsonl
python3 bench_serving.py --backend vllm --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 3200 --request-rate 16 --output-file online_vllm.jsonl
cat online_vllm.jsonl | cut -d':' -f9 | cut -d',' -f1
```

```bash
# TensorRT LLM Offline 8B

python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-8B-Instruct --dataset-name random --num-prompts 4000 --random-input 1024 --random-output 1024 --output-file offline_trt_8b.jsonl
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-8B-Instruct --dataset-name random --num-prompts 5000 --random-input 1024 --random-output 512 --output-file offline_trt_8b.jsonl
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-8B-Instruct --dataset-name random --num-prompts 1000 --random-input 4096 --random-output 2048 --output-file offline_trt_8b.jsonl
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-8B-Instruct --dataset-name random --num-prompts 2000 --random-input 4096 --random-output 1024 --output-file offline_trt_8b.jsonl
python3 bench_serving.py --backend trt --dataset-name random --num-prompts 6000 --random-input 256 --random-output 512 --output-file offline_trt_8b.jsonl --model meta-llama/Meta-Llama-3-8B-Instruct
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-8B-Instruct --dataset-name sharegpt --num-prompts 3000 --output-file offline_trt_8b.jsonl
cat offline_trt_8b.jsonl | cut -d':' -f12 | cut -d',' -f1
```

```bash
# TensorRT LLM Online 8B

python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-8B-Instruct --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 300 --request-rate 1 --output-file online_trt_8b.jsonl
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-8B-Instruct --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 600 --request-rate 2 --output-file online_trt_8b.jsonl
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-8B-Instruct --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 1200 --request-rate 4 --output-file online_trt_8b.jsonl
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-8B-Instruct --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 2400 --request-rate 8 --output-file online_trt_8b.jsonl
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-8B-Instruct --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 3200 --request-rate 16 --output-file online_trt_8b.jsonl
cat online_trt_8b.jsonl | cut -d':' -f9 | cut -d',' -f1
```

```bash
# TensorRT LLM Offline 70B

python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-70B-Instruct --dataset-name random --num-prompts 4000 --random-input 1024 --random-output 1024 --output-file offline_trt_70b.jsonl
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-70B-Instruct --dataset-name random --num-prompts 5000 --random-input 1024 --random-output 512 --output-file offline_trt_70b.jsonl
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-70B-Instruct --dataset-name random --num-prompts 1000 --random-input 4096 --random-output 2048 --output-file offline_trt_70b.jsonl
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-70B-Instruct --dataset-name random --num-prompts 2000 --random-input 4096 --random-output 1024 --output-file offline_trt_70b.jsonl
python3 bench_serving.py --backend trt --dataset-name random --num-prompts 6000 --random-input 256 --random-output 512 --output-file offline_trt_70b.jsonl --model meta-llama/Meta-Llama-3-70B-Instruct
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-70B-Instruct --dataset-name sharegpt --num-prompts 3000 --output-file offline_trt_70b.jsonl
cat offline_trt_70b.jsonl | cut -d':' -f12 | cut -d',' -f1
```

```bash
# TensorRT LLM Online 70B

python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-70B-Instruct --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 300 --request-rate 1 --output-file online_trt_70b.jsonl
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-70B-Instruct --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 600 --request-rate 2 --output-file online_trt_70b.jsonl
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-70B-Instruct --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 1200 --request-rate 4 --output-file online_trt_70b.jsonl
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-70B-Instruct --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 2400 --request-rate 8 --output-file online_trt_70b.jsonl
python3 bench_serving.py --backend trt --model meta-llama/Meta-Llama-3-70B-Instruct --dataset-name random --random-input 1024 --random-output 1024 --num-prompts 3200 --request-rate 16 --output-file online_trt_70b.jsonl
cat online_trt_70b.jsonl | cut -d':' -f9 | cut -d',' -f1
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
