---
title: "GPU Programming & CUDA Basics"
tags: [gpu, cuda, parallel-computing, ai-hardware, performance]
status: complete
last_updated: 2026-07-02
sources: []
---

# GPU Programming & CUDA Basics

## Why GPU Programming Matters for AI

Modern AI training and inference are fundamentally **parallel computation** problems. Understanding GPU architecture and programming models is essential for:
- Writing custom CUDA kernels for novel operations
- Profiling and optimizing training/inference pipelines
- Debugging GPU memory issues and performance bottlenecks
- Making informed hardware selection decisions

## GPU Architecture Fundamentals

### NVIDIA GPU Hierarchy

```
GPU
├── Graphics Processing Cluster (GPC)
│   ├── Texture Processing Cluster (TPC)
│   │   ├── Streaming Multiprocessor (SM)
│   │   │   ├── CUDA Cores (FP32/INT32)
│   │   │   ├── Tensor Cores (Matrix operations)
│   │   │   ├── RT Cores (Ray tracing)
│   │   │   ├── Shared Memory / L1 Cache
│   │   │   ├── Warp Scheduler
│   │   │   └── Register File
│   │   └── ...
│   └── ...
├── L2 Cache
├── HBM / GDDR Memory
└── NVLink / PCIe Interconnect
```

### Key Hardware Specs (2025-2026)

| GPU | Architecture | FP32 TFLOPS | Memory | Bandwidth | Tensor Cores |
|-----|-------------|-------------|--------|-----------|-------------|
| H100 SXM | Hopper | 67 | 80GB HBM3 | 3.35 TB/s | 4th gen |
| H200 | Hopper | 67 | 141GB HBM3e | 4.8 TB/s | 4th gen |
| B200 | Blackwell | 90 | 192GB HBM3e | 8.0 TB/s | 5th gen |
| RTX 5090 | Blackwell | 104.8 | 32GB GDDR7 | 1.79 TB/s | 5th gen |
| AMD MI300X | CDNA 3 | 163 | 192GB HBM3 | 5.3 TB/s | N/A (Matrix Core) |
| Ascend 910B | Da Vinci | N/A | 64GB HBM2e | 1.6 TB/s | Cube Unit |

### Execution Model

```
Host (CPU)                    Device (GPU)
┌─────────────┐              ┌─────────────────────────┐
│ Thread 1    │   Kernel     │ Grid                     │
│ Thread 2    │ ──────────►  │ ┌─────────┬─────────┐   │
│ Thread 3    │   Launch     │ │ Block 0 │ Block 1 │   │
│ ...         │              │ │ ┌─┬─┬─┐ │ ┌─┬─┬─┐ │   │
│ Thread N    │              │ │ │T│T│T│ │ │T│T│T│ │   │
└─────────────┘              │ │ │0│1│2│ │ │0│1│2│ │   │
                             │ │ └─┴─┘ │ │ └─┴─┘ │   │
                             │ │ Shared │ │ Shared │   │
                             │ │ Memory │ │ Memory │   │
                             │ └─────────┴─────────┘   │
                             │      Global Memory       │
                             └─────────────────────────┘
```

**Key Concepts:**
- **Thread**: Smallest execution unit
- **Warp**: 32 threads executed in lockstep (SIMT)
- **Block**: Group of threads sharing shared memory
- **Grid**: Collection of blocks for one kernel launch

## CUDA Programming Basics

### Hello World: Vector Addition

```cuda
// kernel.cu
__global__ void vectorAdd(const float* A, const float* B, float* C, int N) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < N) {
        C[idx] = A[idx] + B[idx];
    }
}

int main() {
    int N = 1 << 20;  // 1M elements
    size_t bytes = N * sizeof(float);
    
    // Host memory
    float *h_A = (float*)malloc(bytes);
    float *h_B = (float*)malloc(bytes);
    float *h_C = (float*)malloc(bytes);
    
    // Device memory
    float *d_A, *d_B, *d_C;
    cudaMalloc(&d_A, bytes);
    cudaMalloc(&d_B, bytes);
    cudaMalloc(&d_C, bytes);
    
    // Copy to device
    cudaMemcpy(d_A, h_A, bytes, cudaMemcpyHostToDevice);
    cudaMemcpy(d_B, h_B, bytes, cudaMemcpyHostToDevice);
    
    // Launch kernel
    int blockSize = 256;
    int gridSize = (N + blockSize - 1) / blockSize;
    vectorAdd<<<gridSize, blockSize>>>(d_A, d_B, d_C, N);
    
    // Copy result back
    cudaMemcpy(h_C, d_C, bytes, cudaMemcpyDeviceToHost);
    
    // Cleanup
    cudaFree(d_A); cudaFree(d_B); cudaFree(d_C);
    free(h_A); free(h_B); free(h_C);
    return 0;
}
```

### Memory Hierarchy

| Memory | Scope | Latency | Size | Use Case |
|--------|-------|---------|------|----------|
| Registers | Per-thread | 1 cycle | ~256 KB/SM | Local variables |
| Shared Memory | Per-block | ~5 cycles | 48-228 KB/SM | Block cooperation |
| L1 Cache | Per-SM | ~30 cycles | 128 KB+ | Frequently accessed |
| L2 Cache | Per-GPU | ~200 cycles | 6-96 MB | Cross-block reuse |
| Global (HBM) | All | ~400 cycles | 16-192 GB | Main data storage |
| Constant | All | ~4 cycles (cached) | 64 KB | Read-only parameters |
| Texture | All | ~4 cycles (cached) | Large | Spatial locality |

### Shared Memory Optimization

```cuda
// Matrix multiplication with shared memory tiling
__global__ void matmulShared(const float* A, const float* B, float* C, int M, int N, int K) {
    __shared__ float sA[TILE_SIZE][TILE_SIZE];
    __shared__ float sB[TILE_SIZE][TILE_SIZE];
    
    int row = blockIdx.y * TILE_SIZE + threadIdx.y;
    int col = blockIdx.x * TILE_SIZE + threadIdx.x;
    float sum = 0.0f;
    
    for (int t = 0; t < (K + TILE_SIZE - 1) / TILE_SIZE; t++) {
        // Collaborative loading into shared memory
        if (row < M && t * TILE_SIZE + threadIdx.x < K)
            sA[threadIdx.y][threadIdx.x] = A[row * K + t * TILE_SIZE + threadIdx.x];
        else
            sA[threadIdx.y][threadIdx.x] = 0.0f;
            
        if (t * TILE_SIZE + threadIdx.y < K && col < N)
            sB[threadIdx.y][threadIdx.x] = B[(t * TILE_SIZE + threadIdx.y) * N + col];
        else
            sB[threadIdx.y][threadIdx.x] = 0.0f;
        
        __syncthreads();
        
        for (int k = 0; k < TILE_SIZE; k++)
            sum += sA[threadIdx.y][k] * sB[k][threadIdx.x];
        
        __syncthreads();
    }
    
    if (row < M && col < N)
        C[row * N + col] = sum;
}
```

## PyTorch CUDA Extensions

### Custom CUDA Kernel in PyTorch

```python
# my_extension.cpp
#include <torch/extension.h>
torch::Tensor my_op(torch::Tensor input);

# my_kernel.cu
__global__ void my_kernel(float* input, float* output, int n) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < n) {
        output[idx] = input[idx] * input[idx];  // Square
    }
}

torch::Tensor my_op(torch::Tensor input) {
    auto output = torch::empty_like(input);
    int n = input.numel();
    int blockSize = 256;
    int gridSize = (n + blockSize - 1) / blockSize;
    my_kernel<<<gridSize, blockSize>>>(
        input.data_ptr<float>(), output.data_ptr<float>(), n);
    return output;
}

# setup.py
from setuptools import setup
from torch.utils.cpp_extension import BuildExtension, CUDAExtension
setup(
    ext_modules=[CUDAExtension('my_extension', ['my_extension.cpp', 'my_kernel.cu'])],
    cmdclass={'build_ext': BuildExtension}
)
```

### Triton (Python-Based GPU Programming)

```python
import triton
import triton.language as tl

@triton.jit
def vector_add_kernel(
    a_ptr, b_ptr, c_ptr,
    n_elements,
    BLOCK_SIZE: tl.constexpr,
):
    pid = tl.program_id(axis=0)
    block_start = pid * BLOCK_SIZE
    offsets = block_start + tl.arange(0, BLOCK_SIZE)
    mask = offsets < n_elements
    
    a = tl.load(a_ptr + offsets, mask=mask)
    b = tl.load(b_ptr + offsets, mask=mask)
    c = a + b
    tl.store(c_ptr + offsets, c, mask=mask)

def vector_add(a, b):
    c = torch.empty_like(a)
    n_elements = a.numel()
    grid = lambda meta: (triton.cdiv(n_elements, meta['BLOCK_SIZE']),)
    vector_add_kernel[grid](a, b, c, n_elements, BLOCK_SIZE=1024)
    return c
```

## Performance Profiling

### Nsight Systems & Compute

```bash
# Profile with Nsight Systems
nsys profile --trace=cuda,nvtx --output=report python train.py

# Profile with Nsight Compute
ncu --set full --output=kernel_report python train.py

# PyTorch profiler
with torch.profiler.profile(
    activities=[torch.profiler.ProfilerActivity.CUDA],
    schedule=torch.profiler.schedule(wait=1, warmup=1, active=3),
    on_trace_ready=torch.profiler.tensorboard_trace_handler('./log'),
    record_shapes=True,
    profile_memory=True,
    with_stack=True
) as prof:
    for step, batch in enumerate(dataloader):
        if step >= 5: break
        model(batch)
        prof.step()
```

### Common Performance Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| Low SM occupancy | Few warps per SM | Increase block size, reduce register usage |
| Memory bandwidth bound | High memory traffic | Use shared memory, coalesce access |
| Warp divergence | Threads in warp take different paths | Minimize branching within warps |
| Kernel launch overhead | Many small kernels | Fuse kernels, use CUDA streams |
| Global memory bottleneck | HBM bandwidth saturated | Use Tensor Cores, mixed precision |

## Multi-GPU Programming

### NCCL Collective Operations

```python
import torch.distributed as dist

# Initialize process group
dist.init_process_group(backend='nccl')

# All-reduce gradients
dist.all_reduce(tensor, op=dist.ReduceOp.SUM)

# All-gather for tensor parallelism
dist.all_gather(tensor_list, tensor)

# Reduce-scatter for ZeRO-style parallelism
dist.reduce_scatter(output, input_list, op=dist.ReduceOp.SUM)
```

### CUDA Streams for Overlap

```python
stream1 = torch.cuda.Stream()
stream2 = torch.cuda.Stream()

# Overlap computation and data transfer
with torch.cuda.stream(stream1):
    output1 = model1(input1)
with torch.cuda.stream(stream2):
    output2 = model2(input2)

torch.cuda.current_stream().wait_stream(stream1)
torch.cuda.current_stream().wait_stream(stream2)
```

## AI-Specific GPU Optimizations

### Tensor Core Utilization

```python
# Enable TF32 for A100/H100 (faster, slight precision loss)
torch.backends.cuda.matmul.allow_tf32 = True
torch.backends.cudnn.allow_tf32 = True

# Mixed precision training
from torch.cuda.amp import autocast, GradScaler
scaler = GradScaler()

for data, target in dataloader:
    optimizer.zero_grad()
    with autocast():
        output = model(data)
        loss = criterion(output, target)
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
```

### Flash Attention (GPU-Optimized)

```python
# PyTorch 2.0+ native SDPA
with torch.backends.cuda.sdp_kernel(
    enable_flash=True, enable_math=False, enable_mem_efficient=False
):
    output = torch.nn.functional.scaled_dot_product_attention(
        query, key, value, attn_mask=None, dropout_p=0.0
    )
```

## Cross-Platform GPU Programming

| Platform | Language | Ecosystem |
|----------|---------|-----------|
| NVIDIA CUDA | C/C++/Python | cuDNN, cuBLAS, NCCL, TensorRT |
| AMD ROCm | HIP (C++ dialect) | MIOpen, rocBLAS, RCCL |
| Intel oneAPI | SYCL/DPC++ | oneMKL, oneDNN |
| Apple Metal | Metal Shading Language | Metal Performance Shaders |
| Huawei CANN | Ascend C | CANN toolkit, HCCL |

## Related Topics

- [[AI_Hardware_2026]]: Hardware landscape overview
- [[Mixed_Precision_Training]]: FP16/BF16 training techniques
- [[Distributed_Training_2026]]: Multi-GPU training strategies
- [[Flash_Kernels_Deep_Dive]]: Attention kernel optimization
