# Pipeline Parallelism for Long Context

## Why Pipeline Parallelism?

As Large Language Models (LLMs) scale toward trillion-parameter architectures and "infinite" context windows, the underlying serving infrastructure must evolve toward more granular, cross-node parallelization strategies. While KV cache techniques effectively mitigate redundant computation, they cannot circumvent the prohibitive Time to First Token (TTFT) inherent in ultra-long sequences with extremely large initial Input Token Length (ITL). Although Tensor Parallelism (TP) remains the conventional approach for intra-node scaling, it frequently encounters communication bottlenecks during multi-node deployments. On the other hand, pipeline parallelism only requires cross-node communication at the boundaries of each pipeline stage, which can achieve better computation-communication overlap compared to a large TP. Therefore, it is also a promising parallelization strategy for improving throughput.

Detailed analysis can be found in this [blog](https://lmsys.org/blog/2026-01-15-chunked-pipeline/).

## Implementation Refactoring based on Async Communication
With Dynamic Chunked Prefill, pipeline parallelism has the potential to reduce the TTFT of long-context inputs. For each request, its input tokens can be partitioned into multiple chunks, each no longer than the chunked prefill size. Different chunks of the same request can be processed simultaneously by different nodes, thus parallelizing the processing and reducing TTFT. SGLang has supported Pipeline Parallelism (#5724) for some time and made it compatible with the PD Disaggregation feature (#8846), but the implementation was not perfect and had significant room for performance improvements.

To eliminate this performance hazard, SGLang implements a Micro-batching Event Loop with non-blocking asynchronous peer-to-peer (P2P) communication to overlap GPU computation with CPU metadata processing and PP communication. This ensures that while one micro-batch is being computed on the GPU, the next one is already being prepared and moved into position effectively, ensuring the pipeline remains as saturated as possible. This approach was first proposed in #7979 and has been redesigned and included in #11852.

The key mechanisms of the implementation include:

* **Decoupled Sync/Async Logic in the Event Loop:** The scheduler uses `async_send` in `_pp_send_pyobj_to_next_stage`. Instead of waiting for a transfer to complete, it returns a `P2PWork` handle. The actual synchronization (`P2PWork.work.wait()`) is deferred until `_pp_commit_comm_work` is called, allowing the CPU to perform other work—like scheduling the next batch or processing metadata—while data is in flight.
* **Multi-Stream Execution:** In addition to the main `default_stream`, which serves as the synchronization stream, SGLang utilizes dedicated `forward_stream` and `copy_stream` to execute forward pass GPU computation and Data-to-Host (D2H) memory transfers separately for better overlapping. While `_pp_launch_batch` is executing the current micro-batch on the GPU for the current stage, the CPU processes the previous micro-batch's results using `_pp_process_batch_result`.

## Guidance about Dynamic Chunking

### Why Dynamic Chunking
Chunked prefill with a fixed size can cause bubbles in the pipeline, especially when the pp size is large. The main reason behind this phenomenon is that the model has a non-uniform running time, even though each chunk size is identical (brought by the Transformer structure). The larger the prefix sequence length, the longer the running time of the chunk. And these bubbles will be propagated to the next stage, and will significantly degrade the scale efficiency of larger pp ranks.

To address this issue, SGLang introduces a dynamic chunking mechanism to predict the optimal size for the next chunk such that it satisfies this condition:

Runtime(L + Next Chunk Size) - Runtime(L) = Runtime(Initial Chunk Size)

where ***L*** denotes the Prefix Sequence Length. By profiling a series of requests with different ITLs, we model the cumulative runtime as a quadratic function of sequence length. Using this model, we solve the optimal next chunk size for any given prefix length ***L***. Since the computation complexity of the Attention mechanism scales with ***L***, the next chunk size will be progressively reduced as ***L*** grows to maintain an aligned chunk execution time across pipeline stages.

Based on this method, the scheduler can predict and dynamically reduce the chunk size during runtime to minimize the bubbles caused by the stage misalignment. To be noticed, the scheduler does not use the raw predicted value. To facilitate efficient KVCache memory management and ensure affinity with hardware execution efficiency, the value is aligned downward to the nearest multiple of max(`--page-size`, 64).


### Chunked Prefill Size and Smoothing Factor

When `--enable-dynamic-chunking` is enabled, each chunk size of a sequence is determined dynamically based on the quadratic model that predicts the next chunk size based on the estimated runtime of the initial chunk length. In this case, we use `--chunked-prefill-size` to set up the initial chunk size. When switching to the dynamic chunking mode, the initial chunk size (`--chunked-prefill-size`) should be set to a larger value comparable to the original chunked prefill size, so that there won't be too many chunks.

**`SGLANG_DYNAMIC_CHUNKING_SMOOTH_FACTOR`** is an environmental variable that controls the smoothing factor for the dynamic chunking algorithm, defaulting to 0.75. It determines how much the chunk size can change during the prefill phase. A larger value means a more aggressive chunk size change, which may lead to better performance but also to greater chunk size changes (the chunk size at the end may become very small, which could lead to performance degradation) and more total chunks. When it is set to 1, the chunk size will be adjusted strictly based on the aforementioned quadratic model that predicts the next chunk size. A smaller value means a more conservative chunk size change, which may lead to smaller chunk size changes and fewer total chunks. When it is set to 0, the chunk size will not be adjusted dynamically, so it is identical to the traditional way with a fixed chunked prefill size.

Due to the variation in hardware, models, and target workloads, a static configuration is seldom optimal across all scenarios. Consequently, achieving peak performance necessitates a degree of hyperparameter tuning when switching to the dynamic chunking mode.

**Tuning Guidance for Dynamic Chunked Prefill**

* **Step 1 \- Iterate to find the optimal fixed chunked prefill size for the targeted PP size**: Different PP sizes for targeted ITL may have different optimal chunked prefill sizes. Therefore, users should iterate to obtain the baseline according to the available resources for scaling.
* **Step 2 \- Initial Chunk Size Selection for Dynamic Chunking**: Set the initial size to 2× or 3× the optimal fixed chunked prefill size. This reduces the total number of chunks and prevents "tail chunks" from underutilizing hardware. To maintain efficiency for extremely large Input Token Lengths (ITL), the dynamic predictor automatically ensures subsequent chunks are at least 1/4 of this initial size. In addition, it is recommended to use a larger initial chunk size (e.g., 4× the optimal fixed chunked prefill size) for such cases as well.
* **Step 3 \- Smooth Factor Adjustment**: This factor controls how strictly the chunk size adjusts the prediction given by the quadratic performance fitting model.
  * 1.0: Follows the model strictly.
  * **0.6 – 0.85 (Recommended)**: Typical range for the best balance between dynamic scaling and hardware stability. Through experiments, we find that a range between 0.6 and 0.85 typically yields the best performance for dynamic chunking.
  * 0: Disables dynamic adjustment, reverting to traditional fixed-size chunking.
* **Another small optimization tip:** Put the larger partition in the higher PP rank when the layers are not evenly divisible across ranks. It can increase the GPU utilization when a larger PP rank is waiting for the previous stage’s result, hence reducing the bubbles on higher PP ranks. If we take DeepSeek-V3.1 as an example, `SGLANG_PP_LAYER_PARTITION=15,15,15,16` usually performs better than `16,15,15,15`.

## Best Practice for Long Context

### Tuning the Chunked Prefill Size
Optimizing the chunked prefill size is crucial for balancing pipeline efficiency and resource utilization. The ideal size depends on factors including model architecture, hardware configuration, and typical input lengths. We recommend starting with a small chunk size, such as 4K, and gradually increasing it until you find the optimal size for your specific use case (Different targeted ITL and PP Sizes may have different optimal chunked prefill sizes. Therefore, users should iterate to obtain the baseline according to the available resources for scaling). Alternatively, you can analyze the hardware capacity and determine the optimal chunk size based on the roofline model.

### Enable Dynamic Chunking and Adjust Smoothing Factor for Ultra-long ITL
SGLang also offers a dynamic chunking solution that could further improve performance. This feature is currently an experimental feature that requires a certain amount of tuning experimentation and may not be suitable for all workloads. In addition, fine-tuning the smoothing factor can help optimize performance for specific workloads and model characteristics.

### Case Study on NVIDIA H20

When evaluating pipeline parallelism with fixed chunked prefill sizes from 2K to 16K, experiment results show that a 4K chunk size delivered optimal prefill TTFT performance for the DeepSeek-V3.1, and a 6K chunk size delivered optimal prefill TTFT performance for the Qwen3-235B-A22B-FP8.

When enabling dynamic chunking, we first scale the optimal fixed chunked prefill size by a factor of 3 as the initial chunk size. Through experimentation, we found that a multiplier of 2-3 provides an appropriate balance—avoiding excessive initial pipeline bubbles while ensuring that subsequent chunks don't become too small as context length increases. With the default dynamic chunking smoothing factor of 0.75, we performed parameter tuning and determined that a value of 0.65 works optimally with the 12K initial chunk size for the DeepSeek-V3.1, while a value of 0.8 works optimally with the 18K initial chunk size for the Qwen3-235B-A22B-FP8.

#### DeepSeek-V3.1 with 128K Input Token Length
```bash
# prefill node 0 (fixed chunked prefill size)
python3 -m sglang.launch_server \
  --model-path deepseek-ai/DeepSeek-V3.1 --trust-remote-code \
  --nnodes 4 --node-rank 0 --tp 8 --pp-size 4 \
  --port 30000 --dist-init-addr <MASTER_NODE_IP> \
  --disable-radix-cache --mem-fraction-static 0.8  \
  --attention-backend fa3 --host 0.0.0.0 --watchdog-timeout 3600 \
  --max-running-requests 128 --chunked-prefill-size 4096
```

```bash
# prefill node 0 (with dynamic chunking)
export SGLANG_DYNAMIC_CHUNKING_SMOOTH_FACTOR=0.65
python3 -m sglang.launch_server \
  --model-path deepseek-ai/DeepSeek-V3.1 --trust-remote-code \
  --nnodes 4 --node-rank 0 --tp 8 --pp-size 4 \
  --port 30000 --dist-init-addr <MASTER_NODE_IP> \
  --disable-radix-cache --mem-fraction-static 0.8  \
  --attention-backend fa3 --host 0.0.0.0 --watchdog-timeout 3600 \
  --max-running-requests 128 --chunked-prefill-size 12288 --enable-dynamic-chunking
```

#### Qwen3-235B-A22B-FP8 with 128K Input Token Length
```bash
# prefill node 0 (fixed chunked prefill size)
python3 -m sglang.launch_server \
  --model-path Qwen/Qwen3-235B-A22B-FP8 --trust-remote-code \
  --nnodes 4 --node-rank 0 --tp 4 --pp-size 8 \
  --port 30000 --dist-init-addr <MASTER_NODE_IP> \
  --disable-radix-cache --mem-fraction-static 0.8  \
  --attention-backend fa3 --host 0.0.0.0 --watchdog-timeout 3600 \
  --max-running-requests 128 --chunked-prefill-size 6144
```

```bash
# prefill node 0 (with dynamic chunking)
export SGLANG_DYNAMIC_CHUNKING_SMOOTH_FACTOR=0.8
python3 -m sglang.launch_server \
  --model-path Qwen/Qwen3-235B-A22B-FP8 --trust-remote-code \
  --nnodes 4 --node-rank 0 --tp 4 --pp-size 8 \
  --port 30000 --dist-init-addr <MASTER_NODE_IP> \
  --disable-radix-cache --mem-fraction-static 0.8  \
  --attention-backend fa3 --host 0.0.0.0 --watchdog-timeout 3600 \
  --max-running-requests 128 --chunked-prefill-size 18432 --enable-dynamic-chunking
```

Note: `--disable-radix-cache` is enabled only for reproducible benchmarking purposes. It is not recommended to use it in production.

## Best Practice for Pipeline Parallelism with PD Disaggregation
To be added. Stay tuned for the latest updates on Pipeline Parallelism with PD Disaggregation.

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

## 进阶内容补充

| 主题 | 深度解析 | 实践要点 | 参考资源 |
|------|----------|----------|----------|
| 原理深入 | 底层机制剖析 | 源码阅读+实验验证 | 官方文档+论文 |
| 工程实现 | 生产级代码实践 | 设计模式+测试覆盖 | 开源项目 |
| 性能调优 | 瓶颈定位+优化 | Profiling+基准测试 | 性能工具 |
| 安全加固 | 威胁建模+防护 | 安全审计+渗透测试 | 安全框架 |
| 架构演进 | 系统设计与重构 | 渐进式改造+验证 | 架构书籍 |

## 实践操作指南

| 步骤 | 操作 | 验证方法 | 常见问题 |
|------|------|----------|----------|
| 环境搭建 | 安装依赖+配置 | 运行hello world | 版本冲突 |
| 基础使用 | 核心API调用 | 单元测试通过 | 参数错误 |
| 功能开发 | 业务逻辑实现 | 集成测试通过 | 边界条件 |
| 性能优化 | 热点优化+缓存 | 压测达标 | 内存泄漏 |
| 部署上线 | 容器化+CI/CD | 灰度验证通过 | 配置差异 |

## 技术选型决策

| 考量因素 | 权重 | 评估方法 | 决策标准 |
|----------|------|----------|----------|
| 功能匹配 | 30% | 需求清单对比 | 覆盖核心需求 |
| 性能表现 | 25% | 基准测试 | 满足SLA |
| 社区生态 | 20% | Star/Issue/更新频率 | 活跃维护 |
| 学习成本 | 15% | 文档质量+上手时间 | 团队可接受 |
| 长期维护 | 10% | 路线图+兼容性 | 可持续发展 |

## 故障排查流程

| 阶段 | 动作 | 工具 | 产出 |
|------|------|------|------|
| 复现 | 稳定复现问题 | 日志+断点 | 复现步骤 |
| 定位 | 缩小问题范围 | 二分法+排除法 | 问题模块 |
| 分析 | 找到根本原因 | 源码+文档 | 根因报告 |
| 修复 | 实施修复方案 | 代码修改+测试 | 修复PR |
| 验证 | 确认问题消除 | 回归测试 | 验证报告 |
| 预防 | 防止再次发生 | 监控+文档 | 改进措施 |

## 知识关联图谱

| 关联领域 | 关系 | 学习顺序 |
|----------|------|----------|
| 前置基础 | 必须先掌握 | 先学 |
| 并行技能 | 相互增强 | 同步 |
| 进阶方向 | 深入发展 | 后学 |
| 应用场景 | 价值体现 | 实践 |
| 工具支撑 | 效率提升 | 随时 |

## 持续改进清单

- [ ] 定期回顾和更新知识
- [ ] 实践验证理论认知
- [ ] 关注社区最新动态
- [ ] 参与技术讨论和分享
- [ ] 将经验沉淀为文档
- [ ] 持续优化工作流程
