---
title: "LLM 推理调优速查表"
category: 10-deployment-inference
subcategory: inference-performance
tags: ["inference", "llm", "vllm", "sglang", "tgi", "trt-llm", "cheat-sheet", "alibaba-cloud"]
summary: "面向 LLM 推理服务的调优速查表：覆盖 vLLM/SGLang/TGI/TRT-LLM 的关键参数、常见场景配置与性能诊断命令。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# LLM 推理调优速查表

> **使用方式**: 根据场景选择启动参数，根据指标调整关键参数。

---

## 1. vLLM 常用启动参数

```bash
python -m vllm.entrypoints.openai.api_server \
  --model /models/Qwen2-7B \
  --tensor-parallel-size 2 \
  --pipeline-parallel-size 1 \
  --max-num-seqs 256 \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.9 \
  --dtype float16 \
  --kv-cache-dtype fp8 \
  --enable-prefix-caching \
  --port 8000
```

| 参数 | 说明 | 调优建议 |
|------|------|---------|
| `--tensor-parallel-size` | 张量并行数 | 单节点内 GPU 数 |
| `--max-num-seqs` | 最大并发序列 | 提高吞吐，但会增加显存 |
| `--gpu-memory-utilization` | GPU 显存使用上限 | 0.85-0.95 |
| `--kv-cache-dtype` | KV Cache 精度 | fp8/int8 降低显存 |
| `--enable-prefix-caching` | 前缀缓存 | RAG/多轮对话建议开启 |
| `--enforce-eager` | 禁用 CUDA graph | 调试时开启 |

---

## 2. SGLang 常用启动参数

```bash
python -m sglang.launch_server \
  --model-path /models/Qwen2-7B \
  --tp-size 2 \
  --mem-fraction-static 0.85 \
  --max-running-requests 256 \
  --port 30000
```

---

## 3. TGI 常用启动参数

```bash
docker run --gpus all -p 8080:80 \
  -v /models:/models \
  ghcr.io/huggingface/text-generation-inference:latest \
  --model-id /models/Qwen2-7B \
  --num-shard 2 \
  --max-input-length 4096 \
  --max-total-tokens 8192 \
  --max-batch-prefill-tokens 16384
```

---

## 4. 性能诊断命令

```bash
# vLLM metrics
curl http://localhost:8000/metrics

# 关键指标
# vllm:time_to_first_token_seconds
# vllm:time_per_output_token_seconds
# vllm:num_requests_waiting
# vllm:gpu_cache_usage_perc

# 压测
python benchmark_throughput.py \
  --model /models/Qwen2-7B \
  --dataset ShareGPT_V3_unfiltered_cleaned_split.json \
  --num-prompts 1000
```

---

## 5. 场景配置建议

| 场景 | 推荐参数 |
|------|---------|
| 高吞吐离线批处理 | 大 batch、关闭流式、前缀缓存 |
| 低延迟在线服务 | 小 batch、开启 CUDA graph、量化 |
| 长上下文 | 增大 max-model-len、GQA、MQA |
| RAG | 开启 prefix caching、控制 max-num-seqs |
| 多模态 | 注意 vision encoder 显存占用 |

---

## 6. 常见问题速查

| 问题 | 检查 | 处理 |
|------|------|------|
| TTFT 高 | 队列长度、GPU 利用率 | 增加 GPU/减少并发 |
| TPOT 高 | batch size、KV Cache 命中率 | 调 max-num-seqs、开 prefix cache |
| 显存不足 | gpu-memory-utilization | 降低 max-model-len、量化 |
| 输出不一致 | temperature/top_p | 固定采样参数 |

---

## Related

- [[_concepts/vllm|vLLM]]
- [[_concepts/sglang|SGLang]]
- [[_concepts/tensorrt-llm|TensorRT-LLM]]
- [[运维/SRE_Reliability/LLM_Inference_Slow_Unavailable_Runbook|LLM 推理延迟/不可用 Runbook]]
