# Run benchmark

This benchmark is primarily intended to be used with reasoning models like `DeepSeek-R1` and its distilled models like `DeepSeek-R1-Distill-Qwen-1.5B`. Please use

```bash
pip install antlr4-python3-runtime
```

for `parse_latex` which we use for symbolic equality check.

## Benchmark sglang

1. Launch the Server
```bash
python3 -m sglang.launch_server --model-path deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B --port 30000
```

Note that depending on the GPU this benchmark will take quiet some time. To employ data parallelism please use:

```bash
python3 -m sglang_router.launch_server --model-path deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B --port 30000 --dp-size 4
```


2. Benchmarking

We use [suggested](https://github.com/deepseek-ai/DeepSeek-R1) parameters of `temperature=0.6`, `top_p=.95`, `max_new_tokens=32768`. The command line argument `num-tries` can be used to evaluate the model multiple times on the same question. We use the suggested `64` from the repo for AIME 2024. For LIMO, we use `8` as the number of tries due to the size of the dataset.

By default evaluate on LIMO dataset.

```bash
python3 bench_sglang.py --parallel 256 --num-tries 64 --port 30000
```

Evaluate on AIME 2024 dataset.

```bash
python3 bench_sglang.py --parallel 256 --port 30000 --data-path Maxwell-Jia/AIME_2024 --question-key Problem --answer-key Answer --num-tries 64
```

Evaluate on [AIME 2025 I dataset](https://huggingface.co/datasets/opencompass/AIME2025). For benchmark result see [here](https://matharena.ai/).

```bash
python3 bench_sglang.py --parallel 256 --port 30000 --data-path opencompass/AIME2025 --question-key question --answer-key answer --num-tries 64
```
## Results

### Evaluation Results
| Dataset    | Num Tries | Accuracy | Reference | Standard Error |
|------------|-----------|----------|-----------|-----------|
| LIMO       | 8         | 47.7%    | ?         | ?         |
| AIME 2024  | 64        | 33.2%    | 28.9%     | 3.4%       |
| AIME 2025 I| 64        | 29.9%    | 25.0%     |  ?        |

### Statistic Analysis Results
Set up SGLang engine for statistic analysis, for high efficiency we use `--dp-size 8` for data parallelism:
```bash
python3 -m sglang_router.launch_server --model-path deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B --port 30000 --dp-size 8
```
**Experiment 1**:
We fixed the number of attempts (num_tries) and conducted multiple runs to assess the consistency of the model's performance. The results show that all recorded accuracies lie within ± one standard error deviation from the mean. This suggests that **our metric serves as an effective upper bound for the deviation of reported accuracy**.

To collect the accuracy, run the following command 30 times:
```bash
python3 bench_sglang.py --parallel 64 --port 30000 --data-path Maxwell-Jia/AIME_2024 --question-key Problem --answer-key Answer --num-tries 64
```

![acc_hist](figure/Acc_histplot.png)


**Experiment 2**: We explored the relationship between the number of attempts (num_tries) and the standard error (SE) by varying num_tries across a range (e.g., 8, 16, 32, ..., 256) and performing a single run for each value. The results demonstrate that as the number of attempts increases, the standard error decreases, leading to **greater stability in answer accuracy**.

To reveal the relationship, run the command 6 times and adjust the parameter `--num-tries` for each run:
```bash
python3 bench_sglang.py --parallel 64 --port 30000 --data-path Maxwell-Jia/AIME_2024 --question-key Problem --answer-key Answer --num-tries <num_tries>
```
![SE_num_tries](figure/SE_numtries.png)

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
