# Hyperparameter Tuning

## Achieving high throughput for offline batch inference

Achieving a large batch size is the most important thing for attaining high throughput in offline batch inference.
When the server is running at full load in a steady state, look for the following in the log:

```Decode batch. #running-req: 233, #token: 370959, token usage: 0.82, cuda graph: True, gen throughput (token/s): 4594.01, #queue-req: 317```

### Adjust the request submission speed to control `#queue-req`

`#queue-req` indicates the number of requests in the queue.
If you frequently see `#queue-req: 0`, it suggests that your client code is submitting requests too slowly.
A healthy range for `#queue-req` is `100 - 2000`.
However, avoid making `#queue-req` too large, as this will increase the scheduling overhead on the server.

### Achieve a high `token usage`

`token usage` indicates the KV cache memory utilization of the server. `token usage > 0.9` means good utilization.

If you frequently see `token usage < 0.9` and `#queue-req > 0`, it means the server is too conservative about taking in new requests. You can decrease `--schedule-conservativeness` to a value like 0.3.
The case of a server being too conservative can happen when users send many requests with a large `max_new_tokens` but the requests stop very early due to EOS or stop strings.

On the other hand, if you see `token usage` very high and you frequently see warnings like
`KV cache pool is full. Retract requests. #retracted_reqs: 1, #new_token_ratio: 0.9998 -> 1.0000`, you can increase `--schedule-conservativeness` to a value like 1.3.
If you see `KV cache pool is full. Retract requests.` occasionally but not frequently (~1 time per minute), it is okay.

### Tune `--mem-fraction-static` to increase KV cache pool capacity
SGLang allocates memory as follows:

Total memory usage = model weights + KV cache pool + CUDA graph buffers + activations

The `--mem-fraction-static` parameter determines how much memory is allocated to the first two components:

mem_fraction_static = (model weights + KV cache pool) / GPU memory capacity

To support higher concurrency, you should maximize the KV cache pool capacity by setting `--mem-fraction-static` as high as possible while still reserving enough memory for activations and CUDA graph buffers.

SGLang uses simple heuristics to set the default value of `--mem-fraction-static`, but you can optimize it for your use cases.
As a rule of thumb, reserving 5–8 GB of memory for activations is typically sufficient. You can check this by inspecting the logs just before the server is ready.
Look for log entries like this:

```
[2025-08-11 17:17:03] max_total_num_tokens=665690, chunked_prefill_size=8192, max_prefill_tokens=16384, max_running_requests=4096, context_len=65536, available_gpu_mem=13.50 GB
```

Check the `available_gpu_mem` value.
- If it is between 5–8 GB, the setting is good.
- If it is too high (e.g., 10 - 20 GB), increase `--mem-fraction-static` to allocate more memory to the KV cache.
- If it is too low, you risk out-of-memory (OOM) errors later, so decrease `--mem-fraction-static`.

Another straightforward approach is to increase `--mem-fraction-static` in increments of 0.01 until you encounter OOM errors for your workloads.

### Avoid out-of-memory errors by tuning `--chunked-prefill-size`, `--mem-fraction-static`, and `--max-running-requests`

If you encounter out-of-memory (OOM) errors, you can adjust the following parameters:

- If OOM occurs during prefill, try reducing `--chunked-prefill-size` to `4096` or `2048`. This saves memory but slows down the prefill speed for long prompts.
- If OOM occurs during decoding, try lowering `--max-running-requests`.
- You can also reduce `--mem-fraction-static` to a smaller value, such as 0.8 or 0.7. This decreases the memory usage of the KV cache memory pool and helps prevent OOM errors during both prefill and decoding. However, it limits maximum concurrency and reduces peak throughput.

### Tune `--cuda-graph-max-bs`
By default, CUDA graph is enabled only for small batch sizes (e.g., less than 160 or 256).
However, for some models, especially at large tensor parallelism sizes, CUDA graph can be useful for batch sizes up to 512 or 768.
Therefore, it may be beneficial to increase `--cuda-graph-max-bs` to a larger value.
Note that CUDA graph consumes more memory, so you may need to reduce `--mem-fraction-static` at the same time.

### Tune `--dp-size` and `--tp-size`

Data parallelism is better for throughput. When there is enough GPU memory, always favor data parallelism for throughput. Refer to [SGLang Model Gateway (former Router)](../advanced_features/sgl_model_gateway.md) for a better data parallelism rather than using `dp_size` parameter.

### Try other options

- `torch.compile` accelerates small models on small batch sizes. You can enable it with `--enable-torch-compile`.
- Try other quantization (e.g. FP8 quantization with `--quantization fp8`)
- Try other parallelism strategies (e.g. [expert parallelism](https://lmsys.org/blog/2025-05-05-large-scale-ep/)) or DP attention for deepseek models (with `--enable-dp-attention --dp-size 8`).
- If the workload has many shared prefixes, try `--schedule-policy lpm`. Here, `lpm` stands for longest prefix match. It reorders requests to encourage more cache hits but introduces more scheduling overhead.

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
