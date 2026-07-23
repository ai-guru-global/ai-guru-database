# Llama4 Usage

[Llama 4](https://github.com/meta-llama/llama-models/blob/main/models/llama4/MODEL_CARD.md) is Meta's latest generation of open-source LLM model with industry-leading performance.

SGLang has supported Llama 4 Scout (109B) and Llama 4 Maverick (400B) since [v0.4.5](https://github.com/sgl-project/sglang/releases/tag/v0.4.5).

Ongoing optimizations are tracked in the [Roadmap](https://github.com/sgl-project/sglang/issues/5118).

## Launch Llama 4 with SGLang

To serve Llama 4 models on 8xH100/H200 GPUs:

```bash
python3 -m sglang.launch_server \
  --model-path meta-llama/Llama-4-Scout-17B-16E-Instruct \
  --tp 8 \
  --context-length 1000000
```

### Configuration Tips

- **OOM Mitigation**: Adjust `--context-length` to avoid a GPU out-of-memory issue. For the Scout model, we recommend setting this value up to 1M on 8\*H100 and up to 2.5M on 8\*H200. For the Maverick model, we don't need to set context length on 8\*H200. When hybrid kv cache is enabled, `--context-length` can be set up to 5M on 8\*H100 and up to 10M on 8\*H200 for the Scout model.

- **Attention Backend Auto-Selection**: SGLang automatically selects the optimal attention backend for Llama 4 based on your hardware. You typically don't need to specify `--attention-backend` manually:
  - **Blackwell GPUs (B200/GB200)**: `trtllm_mha`
  - **Hopper GPUs (H100/H200)**: `fa3`
  - **AMD GPUs**: `aiter`
  - **Intel XPU**: `intel_xpu`
  - **Other platforms**: `triton` (fallback)

  To override the auto-selection, explicitly specify `--attention-backend` with one of the supported backends: `fa3`, `aiter`, `triton`, `trtllm_mha`, or `intel_xpu`.

- **Chat Template**: Add `--chat-template llama-4` for chat completion tasks.
- **Enable Multi-Modal**: Add `--enable-multimodal` for multi-modal capabilities.
- **Enable Hybrid-KVCache**: Set `--swa-full-tokens-ratio` to adjust the ratio of SWA layer (for Llama4, it's local attention layer) KV tokens / full layer KV tokens. (default: 0.8, range: 0-1)


### EAGLE Speculative Decoding
**Description**: SGLang has supported Llama 4 Maverick (400B) with [EAGLE speculative decoding](https://docs.sglang.io/advanced_features/speculative_decoding.html#EAGLE-Decoding).

**Usage**:
Add arguments `--speculative-draft-model-path`, `--speculative-algorithm`, `--speculative-num-steps`, `--speculative-eagle-topk` and `--speculative-num-draft-tokens` to enable this feature. For example:
```
python3 -m sglang.launch_server \
  --model-path meta-llama/Llama-4-Maverick-17B-128E-Instruct \
  --speculative-algorithm EAGLE3 \
  --speculative-draft-model-path nvidia/Llama-4-Maverick-17B-128E-Eagle3 \
  --speculative-num-steps 3 \
  --speculative-eagle-topk 1 \
  --speculative-num-draft-tokens 4 \
  --trust-remote-code \
  --tp 8 \
  --context-length 1000000
```

- **Note** The Llama 4 draft model *nvidia/Llama-4-Maverick-17B-128E-Eagle3* can only recognize conversations in chat mode.

## Benchmarking Results

### Accuracy Test with `lm_eval`

The accuracy on SGLang for both Llama4 Scout and Llama4 Maverick can match the [official benchmark numbers](https://ai.meta.com/blog/llama-4-multimodal-intelligence/).

Benchmark results on MMLU Pro dataset with 8*H100:
|                    | Llama-4-Scout-17B-16E-Instruct | Llama-4-Maverick-17B-128E-Instruct  |
|--------------------|--------------------------------|-------------------------------------|
| Official Benchmark | 74.3                           | 80.5                                |
| SGLang             | 75.2                           | 80.7                                |

Commands:

```bash
# Llama-4-Scout-17B-16E-Instruct model
python -m sglang.launch_server \
  --model-path meta-llama/Llama-4-Scout-17B-16E-Instruct \
  --port 30000 \
  --tp 8 \
  --mem-fraction-static 0.8 \
  --context-length 65536
lm_eval --model local-chat-completions --model_args model=meta-llama/Llama-4-Scout-17B-16E-Instruct,base_url=http://localhost:30000/v1/chat/completions,num_concurrent=128,timeout=999999,max_gen_toks=2048 --tasks mmlu_pro --batch_size 128 --apply_chat_template --num_fewshot 0

# Llama-4-Maverick-17B-128E-Instruct
python -m sglang.launch_server \
  --model-path meta-llama/Llama-4-Maverick-17B-128E-Instruct \
  --port 30000 \
  --tp 8 \
  --mem-fraction-static 0.8 \
  --context-length 65536
lm_eval --model local-chat-completions --model_args model=meta-llama/Llama-4-Maverick-17B-128E-Instruct,base_url=http://localhost:30000/v1/chat/completions,num_concurrent=128,timeout=999999,max_gen_toks=2048 --tasks mmlu_pro --batch_size 128 --apply_chat_template --num_fewshot 0
```

Details can be seen in [this PR](https://github.com/sgl-project/sglang/pull/5092).

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
