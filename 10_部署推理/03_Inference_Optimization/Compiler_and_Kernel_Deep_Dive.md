---
title: "推理编译器与算子优化 (Compiler and Kernel Deep Dive)"
category: "10-deployment-inference-inference-optimization"
tags: ["compiler", "kernel", "torch.compile", "inductor", "triton", "cutlass", "operator-fusion", "flashattention", "kv-cache", "roofline", "autotuning"]
summary: "> **一句话概括**: 通用框架的 eager 模式有 kernel launch、框架开销、访存浪费——编译器（torch.compile/Inductor）、定制算子（Triton/CUTLASS）和算子融合把访存密集的推理瓶颈榨干。"
created: "2026-07-24"
updated: "2026-07-24"
tier: core
aliases:
  - "Compiler and Kernel Deep Dive"
  - "推理编译器与算子优化"
  - "torch.compile 与 Triton"
  - Compiler_and_Kernel_Deep_Dive
sources: []
name_zh: "推理编译器与算子优化"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# 推理编译器与算子优化 (Compiler and Kernel Deep Dive)

> 中文简称：推理编译器与算子优化

> **一句话概括**: 通用框架的 eager 模式有 kernel launch、框架开销、访存浪费——编译器（torch.compile/Inductor）、定制算子（Triton/CUTLASS）和算子融合把访存密集的推理瓶颈榨干。

---

## 目录

1. [为什么需要编译器和定制算子](#1-为什么需要编译器和定制算子)
2. [torch.compile / Inductor](#2-torchcompile--inductor)
3. [Triton：Pythonic 的 GPU 编程](#3-tritonpythonic-的-gpu-编程)
4. [CUTLASS：高性能 GEMM 库](#4-cutlass高性能-gemm-库)
5. [算子融合 Operator Fusion](#5-算子融合-operator-fusion)
6. [FlashAttention 原理](#6-flashattention-原理)
7. [KV Cache 算子](#7-kv-cache-算子)
8. [kernel autotuning](#8-kernel-autotuning)
9. [编译器对比](#9-编译器对比)
10. [性能优化案例](#10-性能优化案例)
11. [总结](#11-总结)

---

## 1. 为什么需要编译器和定制算子

### 1.1 Eager 模式的隐性开销

PyTorch 默认的 eager 模式逐算子执行，每次调用都有开销。对于 LLM 推理，这些"隐性税"在 decode 阶段（每个 token 都要跑一遍全模型）被放大：

| 开销来源 | 说明 | 影响 |
|----------|------|------|
| kernel launch | 每个 op 单独启动 GPU kernel（每次 ~5-10µs） | 小算子时 launch 开销占比可达 30%+ |
| 框架调度 | Python 解释器 + PyTorch dispatcher | CPU 端开销，decode 单步可能 CPU bound |
| 中间结果落盘 | 每个 op 结果写回 HBM 再读 | 访存密集场景致命 |
| 无全局优化 | 无法跨算子优化 | 错失融合机会 |

### 1.2 推理为何更依赖算子优化（Roofline）

推理（尤其 decode）是**访存密集**：

```
Decode 每步:
  读取全部权重 + KV Cache → 只算 1 个 token 的输出
  算术强度(FLOPs/字节) 极低 → 带宽瓶颈

Roofline 模型:
  性能 = min(峰值算力, 峰值带宽 × 算术强度)
  算术强度 = FLOPs / 字节

  decode 算术强度 << 拐点 → 性能 = 带宽 × 算术强度
  → 减少访存字节 = 直接提速 (无需更快算力)
```

$$
\text{Arithmetic Intensity}_{\text{decode}} = \frac{2 \cdot \text{params}}{\text{params} \cdot \text{bytes/param}} \approx \frac{2}{\text{bytes/param}}
$$

FP16 下算术强度约 1 FLOP/byte，远低于 H100 的拐点（~150 FLOP/byte），所以 decode 是纯带宽瓶颈。因此推理优化的核心是**减少访存**——算子融合（少读写）、定制算子（高效访存模式），比堆算力更有效。参见 [[10_部署推理/04_Inference_Performance/Inference_Performance_Fundamentals|推理性能基础]] 的 Roofline 分析。

### 1.3 编译器与算子的分工

```
优化手段谱系:
─────────────────────────────────────────────
通用优化 (编译器自动):
  torch.compile / Inductor  → 图捕获 + 算子融合 + 代码生成
        │
        ▼
半自动 (模板库):
  CUTLASS / cuBLAS          → 模板化高性能 GEMM
        │
        ▼
手写极致 (定制 kernel):
  Triton / CUDA C++         → FlashAttention, PagedAttention
─────────────────────────────────────────────
越往下: 控制力越强、性能越高、开发成本越大
```

---

## 2. torch.compile / Inductor

**torch.compile**（PyTorch 2.0+）是 PyTorch 官方的编译加速方案，底层由 **Inductor** 后端实现。一行代码即可加速，是通用优化的首选。

### 2.1 架构：Dynamo + Inductor

```
torch.compile 流程:
─────────────────────────────────────────────
  Python 代码 (eager)
        │
        ▼
  TorchDynamo  (图捕获: 从 Python 字节码/帧提取计算图)
        │       遇到不支持/动态控制流 → graph break
        ▼
  AOTAutograd  (自动微分图变换, 推理时生成前向图)
        │
        ▼
  Inductor     (后端: 融合 + 代码生成)
        │
        ├──► Triton kernel (GPU)
        └──► C++ / OpenMP (CPU)
─────────────────────────────────────────────
```

### 2.2 图捕获 vs Eager

| 维度 | Eager | torch.compile |
|------|-------|---------------|
| 执行方式 | 逐算子解释执行 | 编译成融合 kernel |
| kernel launch | 每算子一次 | 融合后大幅减少 |
| 中间结果 | 写回 HBM | 留在寄存器/共享内存 |
| 优化范围 | 单算子 | 跨算子全局 |
| 灵活性 | 高（动态控制流） | 受限（graph break） |

### 2.3 关键能力

| 能力 | 说明 |
|------|------|
| 图捕获（Dynamo） | 从字节码提取计算图，无需改代码 |
| 算子融合 | Inductor 自动融合相邻算子（pointwise + reduction） |
| 代码生成 | 生成优化后的 Triton/C++ kernel |
| dynamic shapes | 支持动态形状（推理 batch/seq 变化） |
| CUDA Graphs | `reduce-overhead` 模式用 CUDA graphs 消除 launch 开销 |
| max-autotune | 尝试更多 kernel 变体（含 Triton autotune）选最优 |

### 2.4 使用与模式

```python
# 🟢 低风险: 一行编译
model = torch.compile(model, mode="reduce-overhead")
# mode:
#   default         平衡的优化
#   reduce-overhead 用 CUDA graphs 消除 launch 开销 (decode 友好)
#   max-autotune    激进调优 (含 autotune, 首次编译慢)
```

### 2.5 限制与 graph break

- **动态控制流**（data-dependent if/while）会触发 **graph break**，回退到 eager，破坏融合。
- **部分自定义算子**未注册 TorchDynamo 支持，也会 graph break。
- **dynamic shapes**：虽然支持，但固定 shape 编译性能更好；推理可用 static shapes 提示。
- **首次编译慢**：JIT 编译有一次性开销，生产需 warmup；或用 AOT 提前编译缓存。

> 实践：推理服务用 `reduce-overhead`（CUDA graphs 对 decode 单步延迟优化显著），并固定常见 batch/seq 做 warmup。

---

## 3. Triton：Pythonic 的 GPU 编程

**Triton** 是 OpenAI 开源的 GPU kernel 编程语言/编译器，用 Pythonic 语法编写高性能 GPU kernel，是当前编写 LLM 定制算子的事实标准（FlashAttention、vLLM 等大量使用 Triton）。

### 3.1 为什么 Triton 重要

| 对比维度 | CUDA C++ | Triton |
|----------|----------|--------|
| 语言 | C++ + CUDA 扩展 | Python |
| 开发效率 | 低（手动管理线程/共享内存/warp） | 高（block-level 抽象） |
| 性能 | 最高（完全控制） | 接近手写 CUDA（90%+） |
| 门槛 | 高 | 中 |
| 生态 | 成熟 | 快速增长（PyTorch/OpenAI 背书） |

### 3.2 Block-level 编程

Triton 的核心抽象是 **block**——程序员在 block 级别编程，编译器自动处理线程映射、共享内存分配、内存合并、warp 调度：

```python
# Triton 示例：向量加法（block 级抽象）
@triton.jit
def add_kernel(x_ptr, y_ptr, out_ptr, N, BLOCK: tl.constexpr):
    pid = tl.program_id(0)           # block id
    offs = pid * BLOCK + tl.arange(0, BLOCK)
    mask = offs < N
    x = tl.load(x_ptr + offs, mask=mask)
    y = tl.load(y_ptr + offs, mask=mask)
    tl.store(out_ptr + offs, x + y, mask=mask)
```

对比 CUDA C++ 需要手写 `__global__` kernel、`threadIdx`、共享内存 `__shared__`、`__syncthreads()`，Triton 让程序员只描述 block 级逻辑，编译器生成高效的线程级代码。

### 3.3 Triton 的 GEMM 示例（LLM 核心）

LLM 推理大量是矩阵乘（GEMM）。Triton 的分块 GEMM 教程是入门标准：

```python
# 简化: 分块 GEMM 思路
@triton.jit
def matmul_kernel(a_ptr, b_ptr, c_ptr, M, N, K, ...):
    pid_m = tl.program_id(0)   # 行分块
    pid_n = tl.program_id(1)   # 列分块
    # 沿 K 维分块累加, 每次加载 a_block, b_block 到 SRAM
    # 在 SRAM 内做矩阵乘并累加到寄存器
    # 最后写回 c_block
```

关键：沿 K 维分块累加（类似 FlashAttention 的 tiling），让中间结果不落 HBM。

### 3.4 Triton 在 LLM 中的应用

| 应用 | 说明 |
|------|------|
| **FlashAttention** | 分块注意力的 Triton 实现（FlashAttention-2/3） |
| **vLLM PagedAttention** | KV Cache 分页 kernel，处理非连续 page |
| **torch.compile 后端** | Inductor 生成的就是 Triton kernel |
| **量化 kernel** | INT8/FP8 GEMM 的 Triton 实现 |
| **RMSNorm / RoPE** | 融合的归一化 + 旋转位置编码 |

---

## 4. CUTLASS：高性能 GEMM 库

**CUTLASS（CUDA Templates for Linear Algebra Subroutines）** 是 NVIDIA 开源的高性能矩阵运算库，提供模板化的 GEMM（矩阵乘）实现，是 cuBLAS 之外的可定制选择。

### 4.1 CUTLASS 的价值

| 维度 | 说明 |
|------|------|
| 性能 | 接近 cuBLAS 峰值，可针对特定 shape 定制 |
| 模板化 | 通过模板参数组合（tile/warp/stage）适配不同 shape |
| MoE GEMM | 支持 Grouped GEMM，MoE 推理关键 |
| 精度 | 支持 FP16/BF16/TF32/FP8/INT8 |
| 透明度 | 源码开放，可学习 GEMM 优化细节 |

### 4.2 模板化矩阵乘

CUTLASS 把 GEMM 分解为可组合的层次：

```
GEMM 层次 (CUTLASS):
─────────────────────────────────────────────
Threadblock level:  把输出矩阵切成 tile, 每 tile 一个 block
   │
Warp level:         每 tile 内, 多个 warp 各算一个 fragment
   │
Thread level:       每 warp 内, 线程做 MMA (Matrix Multiply-Accumulate)
   │
Pipeline:           多缓冲 (multi-stage) 隐藏访存延迟
─────────────────────────────────────────────
模板参数: tile_m, tile_n, tile_k, warp_count, stages...
不同 shape 选不同模板 → 接近最优
```

### 4.3 Grouped GEMM 与 MoE

MoE 推理中，每个专家处理不同数量的 token，需要 **Grouped GEMM**（一次处理多个不同大小的矩阵乘）。CUTLASS 的 Grouped GEMM 把多个专家的 GEMM 打包成一次 kernel 启动，避免逐专家单独 GEMM 的 kernel launch 开销，显著提升 MoE 吞吐。关联 [[10_部署推理/04_Inference_Performance/MoE_Inference_Optimization|MoE 推理优化]]。

### 4.4 FP8 GEMM

H100 的 FP8 Tensor Core 算力是 FP16 的 2 倍。CUTLASS 提供 FP8 GEMM 模板，是 FP8 量化推理（如 TensorRT-LLM 的 FP8 路径）的底层。参见 [[10_部署推理/05_Quantization/index|量化]]。

---

## 5. 算子融合 Operator Fusion

**算子融合（Operator Fusion）** 是推理优化最有效的手段之一：把多个相邻算子合并成一个 kernel，避免中间结果写回 HBM 再读取。

### 5.1 为什么融合省访存（Roofline 分析）

```
未融合 (eager):
  读 A,B → 算 matmul → 写 C 到 HBM
                       读 C,bias → 算 add → 写 D
                                        读 D → 算 act → 写 E
  (3 次中间结果读写 HBM, 访存量大)

融合后:
  读 A,B,bias → 算 matmul+add+act（在寄存器/共享内存） → 写 E
  (只读写一次 HBM)
```

对于访存密集的 decode，中间结果落盘是纯浪费——融合直接减少访存字节。从 Roofline 看，融合后算子的**算术强度提升**（同样字节读取做更多计算），在 Roofline 图上向右移动，更接近计算瓶颈而非带宽瓶颈。

### 5.2 典型融合模式

| 融合 | 前提 | 收益 |
|------|------|------|
| matmul + bias + activation | 线性层后接激活 | 减少 1-2 次 HBM 读写 |
| RMSNorm + 残差连接 | Transformer 块 | 减少 norm 中间结果落盘 |
| Attention（QKV + softmax + AV） | FlashAttention | 大幅减少 N×N 中间矩阵读写 |
| RoPE + QKV 投影 | 旋转位置编码 | 减少旋转后中间结果 |
| 多 LoRA 适配器 | Multi-LoRA | 批量 ΔWx 计算 |

### 5.3 融合的边界

并非所有算子都能融合：
- **_reduction 跨大维度**（如对整序列 softmax）需要特殊处理（online softmax）。
- **数据依赖的控制流**（如 top-k 选择）通常不融合。
- Inductor 自动融合 pointwise + reduction，复杂模式需手写 Triton。

### 5.4 融合的数学表达

未融合访存量（3 个算子）：

$$
\text{Bytes}_{\text{unfused}} = 3 \times |C| \times \text{bytes} \quad (\text{读}+\text{写各} |C|)
$$

融合后：

$$
\text{Bytes}_{\text{fused}} = 1 \times |C| \times \text{bytes} \quad (\text{仅最终读写})
$$

访存减少 3×，在带宽瓶颈下速度近 3× 提升。

---

## 6. FlashAttention 原理

**FlashAttention** 是 LLM 推理/训练最重要的算子优化之一，通过分块（tiling）和在线 softmax 避免实例化完整 attention 矩阵。这里讲清原理，完整 kernel 族见 [[10_部署推理/04_Inference_Performance/Flash_Kernels_Deep_Dive|Flash Kernels]]。

### 6.1 标准 Attention 的问题

```
标准 Attention:
  S = Q @ K^T          # [N, N] 矩阵, N=序列长度
  P = softmax(S)       # [N, N]
  O = P @ V            # [N, d]
  问题: S 和 P 是 [N,N], 长序列时 O(N²) 显存, 且要写回 HBM
```

显存 $O(N^2)$，HBM 读写 $O(N^2 + Nd)$。100K 上下文时 $N^2 = 10^{10}$，单是中间矩阵就数十 GB。

### 6.2 FlashAttention 的解法：Tiling + Online Softmax

FlashAttention 分块计算，**不实例化完整 N×N 矩阵**：

1. **Tiling**：把 Q/K/V 分块加载到 SRAM（共享内存）。
2. **Online Softmax**：逐块计算 softmax（用 running max/sum 修正）。
3. **融合**：QK + softmax + AV 融合成一个 kernel，中间结果不出 SRAM。

```
FlashAttention:
─────────────────────────────────────────────
for each Q block:
    初始化 running max m = -∞, running sum l = 0
    for each K,V block:
      在 SRAM 内算 S_block = Q_block @ K_block^T
      在 SRAM 内用 online softmax 更新 m, l:
        m_new = max(m_old, m_block)
        l_new = exp(m_old - m_new) * l_old
              + exp(m_block - m_new) * sum(exp(S_block - m_block))
      在 SRAM 内累加 O_block += P_block @ V_block (按 l 归一)
    写 O_block 到 HBM
─────────────────────────────────────────────
从不实例化完整 N×N, O(N) 显存
```

### 6.3 Online Softmax 数学

标准 softmax 需看到全部分母：$\text{softmax}(x_i) = e^{x_i} / \sum_j e^{x_j}$。分块时用 running 统计量增量更新：

$$
m_{\text{new}} = \max(m_{\text{old}}, m_{\text{block}}), \quad
l_{\text{new}} = e^{m_{\text{old}} - m_{\text{new}}} l_{\text{old}} + e^{m_{\text{block}} - m_{\text{new}}} l_{\text{block}}
$$

其中 $m$ 是 running max，$l$ 是 running sum。这样不用存整个 $N \times N$ 矩阵即可得到正确的 softmax。

### 6.4 收益

| 维度 | 标准 Attention | FlashAttention |
|------|---------------|----------------|
| 显存 | $O(N^2)$ | $O(N)$ |
| HBM 读写 | $O(N^2 + Nd)$ | $O(Nd)$ |
| 速度 | 慢（访存瓶颈） | 快 2-4×（计算密集化） |
| 反向传播 | 存 $N \2 N$ 重算 | 用 forward 的统计量重算 |

FlashAttention 把 attention 从访存密集变成计算密集，是长上下文推理/训练能跑起来的前提。详见 [[10_部署推理/04_Inference_Performance/Flash_Kernels_Deep_Dive|Flash Kernels]]（含 FlashDecoding/FlashInfer/FlashMLA 变体）。

---

## 7. KV Cache 算子

KV Cache 是自回归推理的核心，其算子优化直接影响 decode 性能。详见 [[10_部署推理/03_Inference_Optimization/kv-cache-inference-optimization|KV Cache 优化]]，这里聚焦 kernel 层面。

### 7.1 PagedAttention kernel

vLLM 的 PagedAttention 把 KV Cache 分页存储（类似 OS 虚拟内存），需要定制 kernel 实现"从分散的 page 读取 KV 并算 attention"。这种**非连续访存**模式用标准 cuBLAS 无法高效完成，必须定制 Triton/CUDA kernel：

```
PagedAttention 访存:
─────────────────────────────────────────────
KV Cache 按 block 存储在非连续物理块:
  [block0] [block2] [block5] [block1] ...  (逻辑连续, 物理分散)

Kernel 通过 block_table 间接寻址:
  for each block in sequence:
    通过 block_table[block_id] 找到物理地址
    加载 KV block 到 SRAM
    算 attention (融合进 FlashAttention 流程)
─────────────────────────────────────────────
关键: 间接寻址 + 融合, 标准 cuBLAS 做不到
```

### 7.2 split-kv（decode 并行化）

decode 阶段单 token 要与全部 KV 做 attention，是纯带宽瓶颈且并行度低。**split-kv**（FlashDecoding 思路）把 KV 沿序列维切分到多 GPU 或多 thread block，各自算 partial attention，最后归约：

```
split-kv / FlashDecoding:
─────────────────────────────────────────────
KV 切成 G 组:
  组0 算 partial softmax(O_0, l_0, m_0)
  组1 算 partial softmax(O_1, l_1, m_1)
  ...
  最后 across groups 归约 (online softmax 合并) → 完整 O
─────────────────────────────────────────────
增加 decode 并行度, 提升带宽利用率, 降低 TPOT
```

详见 [[10_部署推理/04_Inference_Performance/Flash_Kernels_Deep_Dive|Flash Kernels]] 的 FlashDecoding 章节。

### 7.3 KV Cache append 融合

每生成一个新 token，要把它对应的 K/V 追加到 cache 并立即做 attention。融合 kernel（如 FlashInfer 的 `AppendKVCache`）把 append + attention 合成一个 kernel，避免单独写回再读。

---

## 8. kernel autotuning

不同输入 shape（batch size、seq len、hidden dim）下，最优 kernel 配置不同。**Autotuning** 自动为每种 shape 选择最优 kernel。

### 8.1 为什么需要 autotuning

GPU kernel 性能高度依赖 shape：
- 小 batch：需高并行度 kernel（split-k）。
- 大 batch：需高占用率 kernel。
- 长 seq：需大 tile。
没有"一刀切"的最优 kernel，必须按 shape 选。

### 8.2 调优维度

| 维度 | 选项 | 影响 |
|------|------|------|
| Tile size | block_m / block_n / block_k | 占用率 vs 并行度 |
| Warp 数 | 每 block 的 warp 数 | 占用率 |
| Pipeline stage | 软件流水级数（multi-stage） | 隐藏访存延迟 |
| 算法变体 | split-k、流水化 | 并行度 vs 同步开销 |
| 数据布局 | row-major / col-major | 内存合并 |

### 8.3 实践

- **Triton 内置 `@triton.autotune`**：声明配置列表，首次运行遍历选最优。
- **cuBLAS/CUTLASS** 内部按 shape 选 kernel（有启发式表）。
- **首次运行慢**（遍历配置），后续命中缓存。
- **生产环境需 warmup**：预热各常见 shape，避免首请求慢。

```python
# Triton autotune 示例
@triton.autotune(
    configs=[
        triton.Config({'BLOCK_M': 128, 'BLOCK_N': 128, 'BLOCK_K': 32}, num_warps=8),
        triton.Config({'BLOCK_M': 64, 'BLOCK_N': 128, 'BLOCK_K': 64}, num_warps=4),
        # ... 更多配置
    ],
    key=['M', 'N', 'K'],   # 按 shape 选缓存
)
@triton.jit
def matmul_kernel(...):
    ...
```

---

## 9. 编译器对比

| 编译器/后端 | 来源 | 特点 | 典型场景 |
|------------|------|------|----------|
| **torch.compile / Inductor** | PyTorch | 通用、易用、生成 Triton | 通用 PyTorch 模型 |
| **XLA (PJRT/TPU/JAX)** | Google | 图编译、TPU 原生、JIT | JAX/TPU、TensorFlow |
| **TensorRT** | NVIDIA | 推理专用、极致优化、plugin | 生产推理（非 LLM 专用） |
| **TensorRT-LLM** | NVIDIA | LLM 专用编译 + kernel | LLM 推理旗舰 |
| **vLLM 定制 kernel** | 社区 | PagedAttention、FlashInfer 集成 | 高吞吐 LLM 服务 |
| **DeepSpeed / JIT** | 微软 | 训练+推理 kernel | DeepSpeed 生态 |
| **MLC-LLM** | 社区 | TVM 编译、跨平台 | 边缘/移动部署 |

### 9.1 选型考量

| 场景 | 推荐 |
|------|------|
| 快速验证、零代码改动 | torch.compile |
| 极致 LLM 推理性能 | TensorRT-LLM / vLLM（定制 kernel + 编译） |
| TPU 平台 | XLA (JAX) |
| 高可控性、定制算子 | Triton 手写 + autotune |
| 边缘/移动 | MLC-LLM (TVM) |

### 9.2 torch.compile vs TensorRT-LLM

| 维度 | torch.compile | TensorRT-LLM |
|------|---------------|--------------|
| 易用性 | 一行编译 | 需转换模型、调 plugin |
| 性能 | 良好（1.5-2× vs eager） | 极致（定制 kernel + FP8） |
| 灵活性 | 高（任意 PyTorch） | 中（支持列表内模型） |
| 部署 | 与训练同栈 | 独立推理引擎 |
| 适用 | 研究、快速上线 | 生产极致延迟 |

---

## 10. 性能优化案例

### 10.1 用 ncu 找瓶颈

**Nsight Compute (ncu)** 分析单个 kernel 的 Roofline，判断是访存还是计算瓶颈：

```bash
# 🔶 中风险: ncu 会大幅拖慢运行 (10-100x), 仅离线 profile
ncu --set roofline --kernel-name "regex:attn|matmul" \
    python inference.py
# 输出每个 kernel 的:
#   - 算术强度 (FLOPs/byte)
#   - 达到的带宽 (vs 峰值)
#   - 达到的算力 (vs 峰值)
#   - 在 Roofline 图上的位置
```

### 10.2 用 nsys 找最耗时 kernel

**Nsight Systems (nsys)** 生成时间线，找最耗时和通信占比：

```bash
# 🟢 低风险: 仅采样 profile
nsys profile -t cuda,nvtx -o infer_profile python inference.py
# 在 GUI 中看:
#   - 哪些 kernel 占时最多
#   - kernel launch 间隙 (CPU bound?)
#   - 通信与计算重叠情况
```

### 10.3 典型优化路径

```
性能优化闭环:
─────────────────────────────────────────────
1. profiling (nsys)    → 找最耗时 kernel
2. roofline (ncu)      → 判断访存 vs 计算瓶颈
3a. 访存瓶颈 → 融合    → torch.compile 自动融合
3b. 仍不足 → 定制 kernel → Triton 重写关键路径
                         (如 attention → FlashAttention)
4. autotune            → 对目标 shape 调优 tile/warp
5. 验证 (nsys/ncu)     → 回到 1, 看新瓶颈
─────────────────────────────────────────────
```

### 10.4 融合前后访存量变化（示意）

| 优化 | 访存字节（相对） | 速度（相对） | 说明 |
|------|------------------|-------------|------|
| eager（未融合） | 1.0× | 1.0× | 基线 |
| torch.compile（融合） | ~0.6× | ~1.5× | 自动融合 pointwise+reduction |
| FlashAttention（定制） | ~0.2× | ~2-4× | attention 访存从 $O(N^2)$ 降到 $O(N)$ |
| FP8 量化（权重） | ~0.5× | ~1.5-2× | 权重字节减半，带宽翻倍利用 |

> 数字随模型/硬件变化，趋势明确：定制算子和融合大幅减少访存，访存密集场景提速显著。

### 10.5 常见性能反模式

- **decode 时 CPU bound**：kernel launch 太频繁，用 CUDA graphs（torch.compile `reduce-overhead`）。
- **attention 占 60%+ 时间**：未用 FlashAttention，换 FlashInfer/vLLM 默认 kernel。
- **小算子碎裂**：未融合，开 torch.compile。
- **shape 不匹配最优 kernel**：未 autotune，warmup 各 shape。

---

## 11. 总结

### 11.1 优化层次总结

```
减少访存 (最有效 for decode):
  算子融合 (torch.compile 自动)
  FlashAttention (定制, O(N²)→O(N))
  KV Cache 分页融合 (PagedAttention)

减少开销:
  CUDA graphs (消除 kernel launch)
  Grouped GEMM (减少 MoE launch)

提升算力利用:
  FP8 Tensor Core (CUTLASS)
  autotune (shape 感知选 kernel)
```

### 11.2 优化优先级 checklist

- [ ] 用 nsys 找最耗时 kernel
- [ ] decode CPU bound → torch.compile `reduce-overhead`（CUDA graphs）
- [ ] attention 慢 → 启用 FlashAttention/FlashInfer
- [ ] 线性层碎裂 → torch.compile 融合 matmul+bias+act
- [ ] MoE 慢 → Grouped GEMM（CUTLASS）
- [ ] 关键 kernel → Triton 重写 + autotune
- [ ] 带宽瓶颈 → FP8 量化（权重字节减半）

### 11.3 一句话总结

> LLM 推理（尤其 decode）是访存密集型，优化的核心是**减少 HBM 访问**：编译器（torch.compile/Inductor）自动融合相邻算子，定制算子（FlashAttention/PagedAttention）把 $O(N^2)$ 访存降到 $O(N)$，Triton/CUTLASS 提供 Pythonic 的高性能 kernel 编写能力，autotuning 按 shape 选最优配置。配合 ncu/nsys 的 Roofline 分析定位瓶颈，能在不改硬件的前提下把推理速度提升数倍。

---

## Related

- [[10_部署推理/04_Inference_Performance/Flash_Kernels_Deep_Dive|Flash Kernels]]
- [[10_部署推理/04_Inference_Performance/Communication_Systems_Deep_Dive|通信系统]]（通信与算子的边界）
- [[10_部署推理/03_Inference_Optimization/kv-cache-inference-optimization|KV Cache 优化]]
- [[10_部署推理/03_Inference_Optimization/kv-cache-paged-attention|PagedAttention]]
- [[10_部署推理/05_Quantization/index|量化]]
- [[10_部署推理/index|部署推理]]
- [[03_深度学习/index|深度学习]]
- [[12_架构基建/index|架构基建]]
- [[12_架构基建/07_Hardware_Compute/index|硬件计算]]
- [[10_部署推理/04_Inference_Performance/MoE_Inference_Optimization|MoE 推理优化]]
- [[10_部署推理/02_Inference_Engines/vLLM_Deep_Dive|vLLM]]
- [[10_部署推理/02_Inference_Engines/TensorRT_LLM_Deep_Dive|TensorRT-LLM]]
- [[10_部署推理/README|模型部署与推理]]

## 术语速查表

| 术语 | 含义 |
|------|------|
| torch.compile | PyTorch 编译加速（Dynamo + Inductor） |
| Dynamo | torch.compile 的图捕获层（从字节码） |
| Inductor | torch.compile 默认后端，生成 Triton/C++ |
| Triton | OpenAI 的 Pythonic GPU kernel 语言 |
| CUTLASS | NVIDIA 高性能模板化 GEMM 库 |
| GEMM | 通用矩阵乘 |
| Grouped GEMM | 分组矩阵乘（MoE 关键） |
| Operator Fusion | 算子融合（合并相邻算子减少访存） |
| Tiling | 分块（FlashAttention/CUTLASS 核心） |
| Online Softmax | 在线 softmax（逐块累积） |
| Autotuning | 自动选择最优 kernel 配置 |
| Roofline | 性能模型（算力 vs 带宽） |
| CUDA Graphs | 预录制的 kernel 序列，消除 launch 开销 |
| PagedAttention | KV Cache 分页 + 定制 attention kernel |
| split-kv | KV 沿序列切分并行（FlashDecoding） |
