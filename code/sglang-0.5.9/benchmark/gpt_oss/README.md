# How to reproduce the result of GPT-OSS with SGLang

### Install the latest SGLang

```bash
git clone https://github.com/sgl-project/sglang.git
cd sglang
git checkout v0.5.1.post3

pip install --upgrade pip
pip install -e "python[all]"
```

### Reproduce the benchmark throughput result (Batch Size 1)

Launch Command

```bash
# MXFP4 120B on H100
python3 -m sglang.launch_server --model openai/gpt-oss-120b --tp 8 --attention-backend triton

# BF16 120B on H100
python3 -m sglang.launch_server --model lmsys/gpt-oss-120b-bf16 --tp 8 --attention-backend triton

# MXFP4 120B on B200
python3 -m sglang.launch_server --model openai/gpt-oss-120b --tp 4

# BF16 120B on B200
python3 -m sglang.launch_server --model lmsys/gpt-oss-120b-bf16 --tp 4
```

Benchmark Command

```bash

# MXFP4 120B on H100
python3 -m sglang.bench_one_batch_server --model openai/gpt-oss-120b --base-url http://localhost:30000 --batch-size 1 --input-len 1024 --output-len 512 --show-report
```

### Reproduce the benchmark throughput result (Batch Size 32)

Launch Command

```bash
# MXFP4 120B on H100
python3 -m sglang.launch_server --model openai/gpt-oss-120b --tp 8

# BF16 120B on H100
python3 -m sglang.launch_server --model lmsys/gpt-oss-120b-bf16 --tp 8

# MXFP4 120B on B200
python3 -m sglang.launch_server --model openai/gpt-oss-120b --tp 4

# BF16 120B on B200
python3 -m sglang.launch_server --model lmsys/gpt-oss-120b-bf16 --tp 4
```

Benchmark Command

```bash
python3 -m sglang.bench_one_batch_server --model openai/gpt-oss-120b --base-url http://localhost:30000 --batch-size 32 --input-len 1024 8192 --output-len 512 --show-report
```

### Reproduce the evaluation result

Install gpt-oss

```bash
git clone https://github.com/openai/gpt-oss.git
cd gpt-oss
pip install -e .
```

Evaluation Command

```bash
DATASET=gpqa
BASE_URL=YOUR_BASE_URL
OPENAI_API_KEY=dummy python -m gpt_oss.evals \
    --base-url ${BASE_URL}/v1 \
    --model dummy \
    --reasoning-effort low,medium,high \
    --eval $DATASET \
    --n-threads 1000
```

### Reproduce the benchmark result of acceptance length
> Note: On B200, if top k is 1, set `--attention-backend trtllm_mha`
```bash
git clone https://github.com/sgl-project/SpecForge.git
cd SpecForge/benchmarks
config_list=(
    "1,0,0,0"
    "1,3,1,4"
    "1,5,4,8"
)
python3 bench_model_speedup.py \
    --model-path openai/gpt-oss-120b \
    --speculative-draft-model-path lmsys/EAGLE3-gpt-oss-120b-bf16 \
    --port 20001 \
    --trust-remote-code \
    --mem-fraction-static 0.8 \
    --tp-size 4 \
    --attention-backend fa3 \
    --config-list "${config_list[@]}" \
    --benchmark-list mtbench:80 gsm8k:200 humaneval:200 math500:200 \
    --output lmsys_gpt-oss-120b_Eagle3_result.jsonl

python3 bench_model_speedup.py \
    --model-path openai/gpt-oss-120b \
    --speculative-draft-model-path nvidia/gpt-oss-120b-Eagle3 \
    --port 20001 \
    --trust-remote-code \
    --mem-fraction-static 0.8 \
    --tp-size 4 \
    --attention-backend fa3 \
    --config-list "${config_list[@]}" \
    --benchmark-list mtbench:80 gsm8k:200 humaneval:200 math500:200 \
    --output nv_gpt-oss-120b_Eagle3_result.jsonl
```

### Reproduce the result of speculative decoding speedup

Launch Command

```bash
# On Hopper:
# - Tree decoding (topk > 1) and chain decoding (topk = 1) are supported on both FA3 and Triton backends.
python3 -m sglang.launch_server --model openai/gpt-oss-120b --speculative-algorithm EAGLE3 --speculative-draft-model-path lmsys/EAGLE3-gpt-oss-120b-bf16 --speculative-num-steps 3 --speculative-eagle-topk 1 --speculative-num-draft-tokens 4 --tp 4
python3 -m sglang.launch_server --model openai/gpt-oss-120b --speculative-algorithm EAGLE3 --speculative-draft-model-path lmsys/EAGLE3-gpt-oss-120b-bf16 --speculative-num-steps 5 --speculative-eagle-topk 4 --speculative-num-draft-tokens 8 --tp 4

# On Blackwell:
# - Chain decoding (topk = 1) is supported on TRTLLM-MHA backend. Tree decoding (topk > 1) is in progress, stay tuned!
# - Both tree decoding (topk > 1) and chain decoding (topk = 1) are supported on the Triton backend.
python3 -m sglang.launch_server --model openai/gpt-oss-120b --speculative-algo EAGLE3 --speculative-draft-model-path lmsys/EAGLE3-gpt-oss-120b-bf16 --speculative-num-steps 3 --speculative-eagle-topk 1 --speculative-num-draft-tokens 4 --tp 4
python3 -m sglang.launch_server --model openai/gpt-oss-120b --speculative-algo EAGLE3 --speculative-draft-model-path lmsys/EAGLE3-gpt-oss-120b-bf16 --speculative-num-steps 5 --speculative-eagle-topk 4 --speculative-num-draft-tokens 8 --attention-backend triton --tp 4
```

Benchmark Command

```bash
config_list=(
    "1,0,0,0"
    "1,3,1,4"
    "1,5,4,8"
)
python3 bench_model_speedup.py \
    --model-path openai/gpt-oss-120b \
    --speculative-draft-model-path lmsys/EAGLE3-gpt-oss-120b-bf16 \
    --port 20001 \
    --trust-remote-code \
    --mem-fraction-static 0.8 \
    --tp-size 4 \
    --attention-backend fa3 \
    --config-list "${config_list[@]}" \
    --benchmark-list gsm8k:200 humaneval:200 math500:200 \
    --output lmsys_gpt-oss-120b_Eagle3_result.jsonl
```

We can gain the best speedup with the following settings:

- **1.39x** speedup with the `--speculative-num-steps 3 --speculative-eagle-topk 1 --speculative-num-draft-tokens 4` setting.
- **1.52x** speedup with the `--speculative-num-steps 5 --speculative-eagle-topk 4 --speculative-num-draft-tokens 8` setting.

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
