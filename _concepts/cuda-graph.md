---
title: "CUDA Graph"
category: -concepts
tags: [inference, cuda, performance, gpu, kernel-optimization, vllm, sglang]
relationships:
  - target: "_concepts/paged-attention"
    type: complements
  - target: "_concepts/continuous-batching"
    type: complements
  - target: "_concepts/kv-cache"
    type: related
  - target: "01_Fundamentals/AI_Hardware/T_Head_PPU_Deep_Dive"
    type: applies_to
  - target: "12_Architecture_Infrastructure/AI_Stack_Deep_Dive"
    type: applies_to
  - target: "10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive"
    type: used_by
sources:
  - https://docs.nvidia.com/cuda/cuda-runtime-api/group__CUDART__GRAPH.html
  - https://help.aliyun.com/zh/document_detail/2879820.html
  - https://help.aliyun.com/zh/document_detail/3032967.html
  - https://github.com/vllm-project/vllm/issues/40969
summary: CUDA Graph 是 NVIDIA CUDA 提供的算子图捕获与重放优化技术，将一系列 GPU kernel 执行序列"录制"为图后反复"回放"，消除 CPU 逐条调度开销。在 LLM 推理 Decode 阶段可提升吞吐 20-50%。vLLM/SGLang 默认启用，但非 NVIDIA 硬件（如 PPU）的兼容性仍在完善中。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.8
lifecycle: reviewed
lifecycle_changed: 2026-06-17
tier: core
created: 2026-06-17 00:00:00+00:00
updated: 2026-06-17 00:00:00+00:00
aliases:
  - "Cuda Graph"
  - "cuda graph"

---
# CUDA Graph

> **一句话理解**: CUDA Graph 把一连串 GPU 操作"录制"成一张图，之后每次执行只需"回放"这张图，CPU 不用逐个下发指令，GPU 几乎零等待，推理速度可提升 20-50%。

---

## 核心要点

- **CPU 调度瓶颈消除**：传统模式下 CPU 逐个下发 kernel，GPU 经常空等。CUDA Graph 将完整 kernel 序列一次性 Capture 为图，后续 Replay 时 CPU 开销降到最低。
- **Decode 阶段最佳搭档**：LLM 推理的 Decode（逐 token 生成）每步操作高度重复，是 CUDA Graph 最理想的加速场景。
- **主流推理引擎默认启用**：vLLM 和 SGLang 均默认开启 CUDA Graph（`cudagraph_mode=FULL_AND_PIECEWISE`），启动时自动进行 warmup/capture。
- **首次启动有编译开销**：CUDA Graph 的 Capture 阶段需要时间，模型越复杂、batch size 越多，warmup 越久。

---

## 工作原理

```
传统推理流程（每步都要 CPU 调度）：
  CPU 下发 kernel₁ → GPU 执行 → CPU 下发 kernel₂ → GPU 执行 → ...
  （CPU 调度开销大，GPU 经常等 CPU）

CUDA Graph 优化后：
  第一次（Capture）：CPU 把一整套 kernel 执行序列"录制"成一张图
  之后  （Replay） ：CPU 一次"回放"整张图，GPU 连续执行所有 kernel
  （CPU 开销降到最低，GPU 几乎不停）
```

### 三个阶段

| 阶段 | 说明 | 耗时 |
|------|------|------|
| **Capture（捕获）** | 录制 GPU kernel 执行序列到 graph 对象 | 首次启动时，可能数秒到数十秒 |
| **Replay（回放）** | 重复执行已捕获的 graph | 极低开销，微秒级 |
| **Update（更新）** | 更新 graph 中的参数（如 batch size 变化时） | 按需，通常很快 |

### vLLM 中的 CUDA Graph 模式

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| `FULL_AND_PIECEWISE` | 先捕获完整 graph，再对无法整体捕获的部分做分段捕获 | 默认模式，覆盖最广 |
| `PIECEWISE` | 只对部分子图做 graph 捕获 | 兼容性好，但加速幅度较小 |
| `NONE`（`--enforce-eager`） | 完全关闭 CUDA Graph | 调试、非 NVIDIA 硬件兼容问题排查 |

---

## 在 PPU（平头哥真武）上的支持情况

PPU 通过自研软件栈 T-Head SAIL 提供 CUDA 兼容层，CUDA Graph 支持在逐步完善中：

| PPU SDK 版本 | CUDA Graph 相关更新 |
|:---|:---|
| **v1.5.1** | 新增 graph management API（edge data、batch memory op node）；修复 cooperative kernel node 不兼容问题 |
| **v1.5.3** | 修复 `int8_gemm` 在 CUDA Graph Capture 时崩溃 |
| **v2.1.0+** | DeepSeek-V4-Flash 模型推理支持（配合 CUDA 13.0 / PyTorch 2.10.0） |

**PPU 上的注意事项**：

- 基础 Graph 构建和 Capture/Replay 流程**已可用**
- 部分算子在 Capture 阶段可能出问题（如 int8_gemm 在 v1.5.3 才修复）
- cooperative kernel 等高级特性是逐步修复的
- **建议至少使用 SDK v1.5.3+**

---

## DeepSeek-V4-Flash 在 PPU 上的 CUDA Graph 问题

### 适配状态

- 阿里云 `inference-xpu-pytorch 26.04` 镜像已通过 vLLM 0.20.1 / SGLang 0.5.12 正式支持 DeepSeek-V4-Flash
- 支持 `w8a8-int8` 量化，精度达基准（GU8TF）的 97.8%
- 通过 FlagOS 社区实现适配，**脱离 CUDA 算子依赖**，采用统一算子替换库

### 已知问题

| 问题 | 详情 |
|------|------|
| **NVIDIA 硬件上也有 hang** | `cudagraph_mode=FULL_AND_PIECEWISE` + chunked prefill 时，约 6 个请求后静默挂起（[vLLM #40969](https://github.com/vllm-project/vllm/issues/40969)） |
| **根因疑似 sparse attention** | mixed-batch 调度与 CUDA Graph 的 uniform query-length 约束冲突 |
| **PPU 上更突出** | SDK v1.5.x Release Note 只提到 V3/R1 适配，V4-Flash 的 CUDA Graph 未做专项验证 |
| **SGLang 810E 限制** | Prefill 阶段的 `flash_mla_sparse_fwd` 在真武 810E 上暂不支持 |

### 部署建议

```bash
# vLLM — 方案 1：关闭 CUDA Graph（最稳妥）
vllm serve deepseek-v4-flash --enforce-eager

# vLLM — 方案 2：降级 CUDA Graph 模式（可能有延迟问题）
vllm serve deepseek-v4-flash --cuda-graph-mode PIECEWISE

# vLLM — 超时与缓存配置
export VLLM_ENGINE_READY_TIMEOUT_S=6000     # DeepGemm warmup 超时（秒）
export DG_CACHE_DIR=<your_cache_path>        # 缓存编译产物，避免重复 JIT

# SGLang — PPU 专属环境变量
export SGLANG_SAIL_DSV4_USE_FLASH_MLA_SPARSE_FWD=0   # 关闭不支持的 sparse MLA
export SGLANG_ENABLE_SPEC_V2=0                        # MLA+MTP 时关闭 FA3 路径（810E 不支持）
# SGLang 启动参数追加
--watchdog-timeout 3600 --dist-timeout 3600            # 避免 DeepGemm warmup 触发看门狗超时
```

**结论**：PPU 上运行 DeepSeek-V4-Flash 建议先用 `--enforce-eager` 确保功能正确性，等 PPU SDK 后续版本完善 CUDA Graph 适配后再开启 graph 加速。

---

## 性能影响量化

| 场景 | 无 CUDA Graph | 有 CUDA Graph | 提升 |
|------|--------------|--------------|------|
| LLM Decode（batch=1） | CPU 调度占比可达 30-50% | CPU 调度接近 0 | **吞吐 +20-50%** |
| LLM Decode（batch=32） | CPU 调度被摊薄 | 仍有收益 | **吞吐 +10-20%** |
| LLM Prefill | 本身就是大矩阵运算，CPU 调度占比小 | 收益有限 | **+5% 左右** |
| 模型启动 | 无影响 | Capture 耗时数秒~数十秒 | **启动变慢** |

---

## 常见问题

### Q: 为什么有些场景要关闭 CUDA Graph？

1. **调试模式**：graph 捕获后 kernel 执行被优化掉，无法逐 kernel 调试
2. **非 NVIDIA 硬件兼容性**：PPU/Ascend 等硬件的 CUDA 兼容层可能不支持所有 graph 特性
3. **动态 shape**：batch size 变化时需要重新 capture，频繁变化反而降低效率
4. **DeepSeek-V4 系列已知 bug**：sparse attention 与 graph capture 冲突

### Q: CUDA Graph 和 Triton JIT 编译是一回事吗？

不是。CUDA Graph 是**录制和回放**已编译好的 kernel 序列；Triton JIT 是**运行时编译**自定义 kernel。两者都出现在模型启动阶段，warmup 时需要分别处理。

### Q: vLLM V1 Engine 对 CUDA Graph 有什么改进？

V1 Engine（vLLM 0.8+）将调度器从 Python 移到 C++ 层，减少了 CPU 调度瓶颈，使 CUDA Graph 的收益更加显著。V0 Engine 中 Python 调度器本身就可能成为高并发下的瓶颈。

---

## 关联概念

> **关联**: -> [[_concepts/paged-attention|PagedAttention]] | [[_concepts/continuous-batching|Continuous Batching]] | [[_concepts/kv-cache|KV Cache]] | [[_concepts/prefill-decode|Prefill/Decode 阶段]] | [[_concepts/flash-attention-kernels|Flash Attention 算子]] | [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive|vLLM 深度解析]] | [[01_Fundamentals/AI_Hardware/T_Head_PPU_Deep_Dive|平头哥 PPU 深度解析]] | [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive|AI Stack 深度解析]]
