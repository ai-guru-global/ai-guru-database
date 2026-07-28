---
title: "TensorRT-LLM"
category: -concepts
tags: ["tensorrt-llm", "nvidia", "inference", "serving", "optimization", "quantization"]
relationships:
  - target: "概念/model-serving"
    type: belongs_to
  - target: "概念/tensorrt"
    type: implements
  - target: "概念/quantization"
    type: uses
  - target: "概念/continuous-batching"
    type: uses
sources:
  - 10_部署推理/02_Inference_Engines/TensorRT_LLM_Deep_Dive.md
  - 10_部署推理/02_Inference_Engines/LLM_Inference_Engine_Selection_Guide.md
  - 12_架构基建/AI_Stack_Inference_Serving_Guide.md
summary: "TensorRT-LLM 是 NVIDIA 推出的 LLM 推理优化引擎。它把模型编译成高度优化的 GPU 执行图，支持 FP8/INT8 量化、Continuous Batching、PagedAttention、多 GPU 并行，是 NVIDIA GPU 上追求极致性能的首选。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - "Tensorrt Llm"
  - "tensorrt llm"
  - "TRT-LLM"

name_zh: "TensorRT 大模型推理引擎"
---
# TensorRT-LLM

> 中文简称：TensorRT 大模型推理引擎

> **一句话理解**: TensorRT-LLM 就像给 NVIDIA GPU 请了一位“赛车调校师”：把普通模型重新拆解、组装、轻量化，榨干显卡的每一滴性能。

## 核心要点

- **TensorRT-LLM 是 NVIDIA 的 LLM 推理 SDK**，基于 TensorRT 编译器
- **“端到端”含义**：从 HuggingFace/PyTorch 模型 → 编译优化 → 高吞吐服务，一站式完成
- **核心优化**：算子融合、FP8/INT8 量化、Continuous Batching、PagedAttention、TP/PP 并行
- **最佳场景**：NVIDIA GPU（尤其是 H100/B200）上的生产级高吞吐推理

## 为什么需要编译优化？

PyTorch 推理是“解释执行”，每个算子单独跑，中间有很多数据搬运和 kernel 启动开销。

TensorRT-LLM 会：
1. **融合算子**：把多个小操作合并成一个大 kernel
2. **选择最优 kernel**：根据 GPU 架构挑最快的实现
3. **量化权重/激活**：FP16 → FP8/INT8，减少计算和显存
4. **显存优化**：PagedAttention 管理 KV Cache，Continuous Batching 动态调度

## 主要特性

| 特性 | 说明 |
|------|------|
| **FP8 量化** | H100/B200 原生支持，速度极快 |
| **INT8/INT4 AWQ/GPTQ** | 在 A100/RTX 上平衡速度与精度 |
| **Continuous Batching** | 动态 batch 调度 |
| **PagedAttention** | 虚拟内存式 KV Cache |
| **Tensor Parallelism** | 多 GPU 张量并行 |
| **Pipeline Parallelism** | 多 GPU 流水线并行 |
| **In-flight Batching** | 请求级动态插入/移除 |
| **Triton Integration** | 包装成 Triton Inference Server 后端 |

## 使用流程

```bash
# 1. 转换模型
python convert_checkpoint.py \
    --model_dir ./Qwen2.5-72B \
    --output_dir ./tllm_ckpt \
    --dtype float16 \
    --tp_size 4

# 2. 编译引擎
trtllm-build \
    --checkpoint_dir ./tllm_ckpt \
    --output_dir ./engine \
    --gemm_plugin float16 \
    --max_batch_size 64

# 3. 启动服务
mpirun -n 4 trtllm-serve ./engine \
    --hostname 0.0.0.0 --port 8000
```

## 引擎对比 (2026)

| 维度 | TensorRT-LLM | vLLM | SGLang |
|------|--------------|------|--------|
| 厂商 | NVIDIA | Berkeley | LMSYS |
| 最佳硬件 | NVIDIA H100/B200 | 通用 NVIDIA/AMD | 通用 NVIDIA/AMD |
| 编译 | 需要编译 (10-60min) | 即开即用 | 即开即用 |
| 灵活性 | 高（可定制） | 中 | 中 |
| 吞吐 | 极高 | 高 | 高 |
| 多模态 | ✅ 支持 | ✅ 支持 | ✅ 支持 |
| MoE 支持 | ✅ | ✅ | ✅ |
| 生态 | NVIDIA 封闭 | 开源社区 | 开源社区 |

## 适用场景

| 场景 | 推荐度 | 理由 |
|------|:------:|------|
| NVIDIA GPU 生产环境 | ⭐⭐⭐⭐⭐ | 极致性能 + 企业支持 |
| 快速迭代/实验 | ⭐⭐ | 编译时间长，不适合频繁换模型 |
| 非 NVIDIA 硬件 | ⭐ | 不支持 AMD/国产芯片 |
| 高并发 SaaS | ⭐⭐⭐⭐⭐ | In-flight Batching + Triton |
| Agent/多轮场景 | ⭐⭐⭐ | 缺少 RadixAttention 等优化 |

## 2026 年更新

- **B200 支持**: 原生 FP4 量化，吐量再提升 2×
- **多模态**: 支持 LLaVA、Qwen-VL 等视觉语言模型
- **MoE 优化**: DeepSeek-V3、Mixtral 等 MoE 模型专项优化
- **与 Triton 深度集成**: 支持多模型、多后端统一服务
- **FP8 训练**: 支持 FP8 量化训练，降低显存占用
- **推测解码**: 支持 Draft Model 和 Medusa 推测解码

## 部署架构示例

```yaml
# Triton Inference Server + TensorRT-LLM
apiVersion: apps/v1
kind: Deployment
metadata:
  name: trt-llm-server
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: triton
        image: nvcr.io/nvidia/tritonserver:24.12-trtllm-python-py3
        ports:
        - containerPort: 8000  # HTTP
        - containerPort: 8001  # gRPC
        - containerPort: 8002  # Metrics
        resources:
          limits:
            nvidia.com/gpu: 2
        volumeMounts:
        - name: model-repo
          mountPath: /models
        env:
        - name: CUDA_VISIBLE_DEVICES
          value: "0,1"
      volumes:
      - name: model-repo
        persistentVolumeClaim:
          claimName: model-repo-pvc
```

## 性能优化检查清单

| 优化项 | 配置 | 预期收益 |
|--------|------|----------|
| **FP8 量化** | `--quantization fp8` | 吐量 +50-100% |
| **In-flight Batching** | 默认启用 | 并发 +2-4x |
| **KV Cache INT8** | `--kv_cache_dtype int8` | 显存 -50% |
| **推测解码** | `--speculative_decoding_mode` | 延迟 -30-50% |
| **多 GPU 并行** | Tensor Parallel | 吐量线性扩展 |
| **CUDA Graph** | 默认启用 | 减少 kernel launch 开销 |

## 生产最佳实践

1. **编译时间规划**: TRT-LLM 编译耗时 10-60 分钟，CI/CD 中预留时间
2. **版本锁定**: TRT-LLM 与 CUDA/Driver 版本强绑定，升级前充分测试
3. **监控指标**: 跟踪 TTFT、TPOT、吐量、GPU 利用率
4. **回滚预案**: 保留上一版本 engine 文件，快速回滚
5. **与 vLLM 对比**: 简单场景 vLLM 更灵活，极致性能选 TRT-LLM
6. **Triton 集成**: 多模型服务用 Triton 统一管理

## 延伸阅读

- [[概念/Inference/model-serving|模型服务]]
- [[概念/Inference/quantization|量化]]
- [[概念/Inference/continuous-batching|Continuous Batching]]
- [[概念/Inference/sglang|SGLang]]
- [[10_部署推理/02_Inference_Engines/TensorRT_LLM_Deep_Dive|TensorRT-LLM 深度解析]]
- [[10_部署推理/02_Inference_Engines/LLM_Inference_Engine_Selection_Guide|推理引擎选型指南]]

## TensorRT-LLM vs vLLM vs SGLang

| 维度 | TensorRT-LLM | vLLM | SGLang |
|------|-------------|------|--------|
| **性能** | 极致 (编译优化) | 高 | 高 |
| **易用性** | 低 (需编译) | 高 | 高 |
| **硬件** | 仅 NVIDIA | NVIDIA/AMD/TPU | NVIDIA |
| **量化** | FP8/INT4/INT8 | GPTQ/AWQ/FP8 | FP8/INT4 |
| **动态批处理** | In-flight Batching | Continuous Batching | Continuous Batching |
| **适用场景** | 极致性能/生产 | 通用服务 | 结构化生成 |

## TensorRT-LLM 部署流程

```bash
# 1. 模型转换 (HuggingFace → TensorRT)
python convert_checkpoint.py \
  --model_dir ./llama-3-8b \
  --output_dir ./trt_ckpt \
  --dtype float16

# 2. 编译引擎
trtllm-build \
  --checkpoint_dir ./trt_ckpt \
  --output_dir ./trt_engine \
  --max_batch_size 64 \
  --max_input_len 4096 \
  --max_seq_len 8192

# 3. 启动服务
mpirun -n 1 python3 run.py --engine_dir ./trt_engine
```

## 生产最佳实践

1. **性能优先选 TRT-LLM**：吐吐量要求极高时选择 TensorRT-LLM
2. **编译时间预留**：引擎编译需 30min-2h，CI/CD 中缓存引擎
3. **FP8 必开**：H100+ 必开 FP8，性能翻倍且质量保留
4. **版本固定**：TensorRT-LLM 版本与 CUDA/驱动强绑定，固定版本
5. **回退方案**：开发/测试用 vLLM，生产切 TensorRT-LLM
