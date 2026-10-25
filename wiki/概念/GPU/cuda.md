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
