---
title: "LLM 推理调优速查表"
category: 10-deployment-inference
subcategory: inference-performance
tags: ["inference", "llm", "vllm", "sglang", "tgi", "trt-llm", "cheat-sheet", "alibaba-cloud"]
summary: "面向 LLM 推理服务的调优速查表：覆盖 vLLM/SGLang/TGI/TRT-LLM 的关键参数、常见场景配置与性能诊断命令。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
name_zh: "LLM 推理调优速查表"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# LLM 推理调优速查表

> 中文简称：LLM 推理调优速查表

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

- [[概念/vllm|vLLM]]
- [[概念/sglang|SGLang]]
- [[概念/tensorrt-llm|TensorRT-LLM]]
- [[13_运维/02_SRE_Reliability/LLM_Inference_Slow_Unavailable_Runbook|LLM 推理延迟/不可用 Runbook]]

## 核心知识体系

| 知识域 | 核心内容 | 重要程度 | 学习优先级 |
|--------|----------|----------|------------|
| 基础理论 | 核心概念/原理/方法论 | 最高 | P0 |
| 技术实践 | 工具/框架/最佳实践 | 高 | P0 |
| 工程方法 | 设计模式/架构/流程 | 高 | P1 |
| 前沿趋势 | 新技术/新方向/研究 | 中 | P2 |
| 行业应用 | 实际案例/落地经验 | 中 | P1 |

## 技术对比与选型

| 维度 | 方案A | 方案B | 方案C | 选型建议 |
|------|-------|-------|-------|----------|
| 性能 | 高吞吐 | 低延迟 | 均衡 | 按场景选择 |
| 复杂度 | 简单 | 中等 | 复杂 | 按团队能力 |
| 成本 | 低 | 中 | 高 | 按预算约束 |
| 生态 | 成熟 | 发展中 | 新兴 | 按稳定性需求 |
| 扩展性 | 有限 | 良好 | 优秀 | 按增长预期 |

## 最佳实践清单

| 实践 | 说明 | 优先级 | 预期收益 |
|------|------|--------|----------|
| 标准化流程 | 统一规范和流程 | P0 | 减少错误+提升效率 |
| 自动化 | 重复工作自动化 | P0 | 节省时间+降低风险 |
| 持续监控 | 关键指标实时监控 | P1 | 及时发现问题 |
| 定期回顾 | 周期性复盘改进 | P1 | 持续优化 |
| 知识沉淀 | 文档化经验教训 | P2 | 团队能力提升 |
| 安全优先 | 安全贯穿全流程 | P0 | 降低风险 |

## 常见问题与解决方案

| 问题 | 根因分析 | 解决方案 | 预防措施 |
|------|----------|----------|----------|
| 效率低下 | 流程不规范/工具不当 | 优化流程+引入工具 | 标准化+培训 |
| 质量不稳定 | 缺乏检查机制 | 引入质量门禁 | 自动化测试 |
| 协作困难 | 职责不清/沟通不畅 | 明确分工+定期同步 | 文档化+工具 |
| 技术债务 | 赶工忽略质量 | 定期重构+代码审查 | 质量优先文化 |
| 安全风险 | 意识不足/措施缺失 | 安全培训+工具扫描 | 安全左移 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 理解基本框架 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立完成基础任务 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能处理复杂问题 |
| 实战 | 生产级应用+优化 | 4-6周 | 独立负责项目 |
| 精通 | 架构设计+前沿探索 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业公认的最佳做法 |
| Anti-pattern | 反模式(应避免的做法) |
| Technical Debt | 技术债务(为速度牺牲质量) |
| CI/CD | 持续集成/持续部署 |
| SLA | 服务等级协议 |
| KPI | 关键绩效指标 |
| ROI | 投资回报率 |
| TCO | 总拥有成本 |

## 检查清单

- [ ] 核心概念和原理已理解
- [ ] 主流工具和框架已掌握
- [ ] 最佳实践已应用到工作中
- [ ] 常见问题能独立解决
- [ ] 持续关注前沿趋势
- [ ] 知识已文档化沉淀
