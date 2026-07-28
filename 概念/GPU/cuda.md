---
title: "CUDA"
category: -concepts
tags: ["gpu", "nvidia", "programming", "parallel-computing", "training", "inference", "alibaba-cloud"]
aliases:
  - "Compute Unified Device Architecture"
  - "CUDA 并行计算"
  - "CUDA"
summary: "此页面已合并至主卡片。"
sources: []
name_zh: "CUDA 并行计算平台"
---

# CUDA

> 中文简称：CUDA 并行计算平台

> 此页面已合并至 [[概念/GPU/cuda-platform|CUDA 计算平台]] 主卡片。请前往查看完整内容。

## Related
- [[概念/GPU/cuda-platform|CUDA 计算平台]]

## 2026 CUDA 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **CUDA 12.x** | 最新 CUDA 版本 | GA |
| **cuDNN** | 深度学习加速库 | GA |
| **cuBLAS** | 线性代数加速 | GA |
| **NCCL** | 多 GPU 通信 | GA |
| **TensorRT** | 推理优化 | GA |

## CUDA 架构

```
CPU 代码 (Host)
    ↓
CUDA Runtime API
    ↓
GPU 代码 (Device) → Kernel 函数
    ↓
GPU 硬件执行
```

## 代码示例

```cuda
// vector_add.cu
#include <cuda_runtime.h>
#include <stdio.h>

__global__ void vectorAdd(float *a, float *b, float *c, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) {
        c[i] = a[i] + b[i];
    }
}

int main() {
    int n = 1000000;
    float *d_a, *d_b, *d_c;
    
    // 分配 GPU 内存
    cudaMalloc(&d_a, n * sizeof(float));
    cudaMalloc(&d_b, n * sizeof(float));
    cudaMalloc(&d_c, n * sizeof(float));
    
    // 启动 Kernel
    int threads = 256;
    int blocks = (n + threads - 1) / threads;
    vectorAdd<<<blocks, threads>>>(d_a, d_b, d_c, n);
    
    // 同步
    cudaDeviceSynchronize();
    
    // 释放内存
    cudaFree(d_a);
    cudaFree(d_b);
    cudaFree(d_c);
    return 0;
}
```

## 延伸阅读

- [[概念/GPU/cuda-platform|CUDA Platform]] — CUDA 计算平台
- [[概念/GPU/cudnn|cuDNN]] — 深度学习加速
- [[概念/GPU/nccl|NCCL]] — 多 GPU 通信

> ℹ️ CUDA 是 NVIDIA 的并行计算平台，是 GPU 加速计算的基础。

## CUDA 内存层次

| 内存类型 | 大小 | 延迟 | 作用域 |
|------|------|------|------|
| **寄存器** | ~256KB/SM | 1 cycle | 线程 |
| **共享内存** | ~228KB/SM | ~20 cycles | 线程块 |
| **L1 缓存** | 与共享内存共享 | ~30 cycles | SM |
| **L2 缓存** | ~50MB | ~200 cycles | 全局 |
| **全局内存** | 80GB (H100) | ~400 cycles | 全局 |

## CUDA 编程模型

```
Grid (网格)
    ├── Block 0 (线程块)
    │       ├── Thread 0
    │       ├── Thread 1
    │       └── ... (最多 1024 线程)
    ├── Block 1
    └── ...
```

## 生产最佳实践

1. **内存合并访问**：连续线程访问连续内存
2. **共享内存优化**：用共享内存减少全局内存访问
3. **占用率优化**：调整线程块大小提高占用率
4. **流并行**：用 CUDA Stream 实现计算和传输重叠
5. **错误检查**：所有 CUDA API 调用检查错误
6. **性能分析**：用 Nsight 分析性能瓶颈
7. **版本管理**：固定 CUDA 版本保证可复现
8. **驱动兼容**：确保驱动与 CUDA 版本兼容

## 检查清单

- [ ] CUDA 版本已固定
- [ ] 驱动版本已确认
- [ ] 内存访问已优化
- [ ] 性能已分析
- [ ] 错误检查已添加

## CUDA 工具链

| 工具 | 说明 | 用途 |
|------|------|------|
| **nvcc** | CUDA 编译器 | 编译 CUDA 代码 |
| **Nsight** | 性能分析器 | 分析性能瓶颈 |
| **cuda-gdb** | 调试器 | 调试 CUDA 程序 |
| **cuda-memcheck** | 内存检查 | 检测内存错误 |
| **nvprof** | 性能剖析 | 分析 Kernel 性能 |

## CUDA 版本兼容性

| CUDA | 驱动最低版本 | 支持 GPU |
|------|------|------|
| **12.x** | 525+ | Kepler+ |
| **11.x** | 450+ | Kepler+ |
| **10.x** | 410+ | Kepler+ |

## 常见问题

| 问题 | 解决方案 |
|------|------|
| 编译失败 | 检查 CUDA 版本和编译器 |
| 性能低 | 用 Nsight 分析瓶颈 |
| 内存错误 | 用 cuda-memcheck 检测 |
| 驱动不兼容 | 更新驱动或降级 CUDA |

## 生产最佳实践

1. **版本固定**：使用容器固定 CUDA 版本，避免环境漂移
2. **Nsight 分析**：每次优化前后用 Nsight Compute 对比 kernel 性能
3. **内存池**：使用 `cudaMallocAsync` 内存池减少分配开销
4. **流并发**：利用多 stream 实现计算与传输重叠
5. **错误检查**：生产代码必须检查每个 CUDA API 返回值

## 检查清单

- [ ] CUDA 版本与驱动兼容
- [ ] 已使用 Nsight 分析确认无瓶颈
- [ ] 内存分配已使用池化
- [ ] 多 stream 已正确同步
- [ ] 错误处理已完善

## 延伸阅读

- [[概念/GPU/cudnn|cuDNN]] — 深度学习加速库
- [[概念/GPU/cuda-graph|CUDA Graph]] — 图执行优化
- [[概念/GPU/nccl|NCCL]] — 集合通信库
- [[概念/GPU/nvidia-gpu|NVIDIA GPU]] — 硬件架构
- [[概念/GPU/flops|FLOPS]] — 算力衡量

> ℹ️ CUDA 是 GPU 计算的基石，2026年 CUDA 13.x 支持 Blackwell 架构、分布式内存编程、FP4 原生算子，生态覆盖 4000+ 加速库，是 AI 计算不可替代的底座。

## 2026 CUDA 生态现状

| 组件 | 版本 | 说明 |
|------|------|------|
| CUDA Toolkit | 13.x | Blackwell 架构支持 |
| cuDNN | 9.x | FP8/FP4 算子 |
| TensorRT | 10.x | 推理优化引擎 |
| NCCL | 2.2x | SHARP 网内计算 |
| cuBLAS | 12.x | FP4 GEMM |
| Nsight | 2026.1 | 全链路分析 |

## 检查清单

- [ ] CUDA Toolkit 版本与驱动匹配
- [ ] cuDNN/TensorRT 版本已固定
- [ ] 已使用 Nsight 分析确认无瓶颈
- [ ] 内存池已启用
- [ ] 多 stream 已正确同步
- [ ] 错误处理已完善
- [ ] 容器镜像已固定版本
