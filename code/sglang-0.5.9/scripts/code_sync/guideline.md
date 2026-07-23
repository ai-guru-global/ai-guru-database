### Sync Code Between OSS and Private Fork

You can use the following principles and tools to sync the code between a private fork and the OSS repo [sgl-project/sglang](https://github.com/sgl-project/sglang/tree/main).
It learns from [Copybara](https://github.com/google/copybara), a tool used at Google for maintaining open-source code synchronization.

## Principals

- The core folders (e.g., `python/sglang/srt`) are 100% mirrored between the private fork and OSS repo.
- The OSS repo is the single source of truth. If one commit changes `python/sglang/srt` in the private repo, the change should be synced to the OSS repo as soon as possible with the action B below.
- The common code (e.g., base classes, well-known techniques in the industry without private secrets) goes to `python/sglang/srt`. The private-specific code (e.g., with private-specific features, confidential info) goes to `python/sglang/private` .
- Anytime you want to make private changes to a file or class under `python/sglang/srt`, duplicate the file and move it under `python/sglang/private`. You can achieve code reuse by importing and inheriting.

## How to sync the code bidirectionally
### Action A: Copy code from OSS to private

- We can run this action: [Open A PR to Copy Code From OSS](https://github.com/sgl-project/sglang/tree/main/.github/workflows/open-pr-copy-from-oss.yml)
    - It opens a PR to copy all files under certain folders (e.g., `python/sglang/srt` , `test/srt` , `sgl-kernel` ) from the OSS main branch to the private fork.
    - Since the OSS repo is the single source of truth, this action copies files and overwrites any changes in the private fork. To prevent the private changes from being overwritten, you need to ensure all private changes are merged into the OSS repo before running this action.
- This action will be run automatically every day and can also be triggered manually.

### Action B: Copy diff from private to OSS

- We can run this action: [Open A PR to Copy Code To OSS](https://github.com/sgl-project/sglang/tree/main/.github/workflows/open-pr-copy-to-oss.yml)
    - It opens a PR to apply the diff of one specific commit of the private fork to the OSS main branch. It will only pick the changes under certain folders (e.g., `python/sglang/srt` , `test/srt` , `sgl-kernel` ) and ignore changes under private folders (e.g., `python/sglang/private` )
    - For example, you can have a PR that changes both `python/sglang/srt` and `python/sglang/private/srt`. Once you merge the PR into the private repo, `python/sglang/srt` becomes desynced between the two repos. You need to run this action on your merge commit immediately to open a PR to send your diff to the OSS repo. Then, we need to merge the OSS PR as soon as possible. Once your OSS PR is merged, we can run action A again.
    - Action A copies files directly, but Action B applies diff. This is because OSS is the source of truth; action A can just copy files. Action B cannot copy, so it uses diff instead.
- This action currently needs a manual trigger in order to prevent incidental code leaks. One can also consider making it automatic.

## Examples
- If you want to have some private server arguments, you can create a new file `python/sglang/private/server_args.py`. It defines a class that inherits the oss ServerArgs.
    ```python
    from sglang.srt.server_args import ServerArgs as ServerArgsOSS

    @dataclasses.dataclass
    class ServerArgs(ServerArgsOSS):
        private_flag: str = "foo"

        @staticmethod
        def add_cli_args(parser: argparse.ArgumentParser):
            # Get all public args
            ServerArgsOSS.add_cli_args(parser)

            # Add your private flags
            parser.add_argument(
                "--private-flag",
                type=str,
                default=ServerArgs.private_flag,
            )
    ```
- Similarly, you can inherit `Engine` and override its fields. You can override `server_args_class` to use your own ServerArgs,
  override `init_tokenizer_manager_func` to use your own TokenizerManager, override `run_scheduler_process_func` to use your own scheduler.

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

## 深度技术参考

| 技术领域 | 核心内容 | 关键技术 | 应用场景 |
|----------|----------|----------|----------|
| 算法与数据结构 | 基础算法原理 | 排序/搜索/图/DP | 通用编程 |
| 系统设计 | 架构设计方法 | 分布式/微服务/缓存 | 大型系统 |
| 编程语言 | 语言特性与范式 | OOP/FP/并发 | 软件开发 |
| 数据库 | 存储与查询 | SQL/NoSQL/向量库 | 数据管理 |
| 网络与通信 | 协议与架构 | HTTP/gRPC/WebSocket | 分布式系统 |
| 安全与隐私 | 安全机制 | 加密/认证/授权 | 所有系统 |

## 代码质量保障

| 质量维度 | 标准 | 工具 | 实践 |
|----------|------|------|------|
| 正确性 | 功能符合需求 | 单元测试+集成测试 | TDD/BDD |
| 可读性 | 代码清晰易懂 | Linter+格式化 | Code Review |
| 可维护性 | 易于修改扩展 | 复杂度分析 | 重构+SOLID |
| 性能 | 满足性能要求 | Profiler+压测 | 性能测试 |
| 安全性 | 无安全漏洞 | SAST/DAST | 安全审计 |
| 可靠性 | 稳定运行 | 混沌工程+监控 | 容错设计 |

## 开发流程最佳实践

| 阶段 | 活动 | 产出 | 质量门禁 |
|------|------|------|----------|
| 需求分析 | 理解需求+技术方案 | 设计文档 | 方案评审 |
| 编码实现 | 编写代码+单元测试 | 功能代码 | 测试通过 |
| 代码审查 | Peer Review | 审查意见 | 审查通过 |
| 集成测试 | 系统集成验证 | 测试报告 | 全部通过 |
| 部署发布 | 灰度+全量 | 上线完成 | 监控正常 |
| 运维监控 | 持续监控+告警 | 运行报告 | SLA达标 |

## 技术债务管理

| 债务类型 | 表现 | 影响 | 偿还策略 |
|----------|------|------|----------|
| 代码债务 | 重复/复杂/过时代码 | 维护成本高 | 定期重构 |
| 架构债务 | 设计不合理/耦合高 | 扩展困难 | 渐进重构 |
| 测试债务 | 覆盖率低/用例缺失 | 质量风险 | 补充测试 |
| 文档债务 | 文档缺失/过时 | 上手困难 | 持续更新 |
| 依赖债务 | 过时/不安全依赖 | 安全风险 | 定期升级 |

## 学习资源推荐

| 级别 | 资源 | 用途 | 时间 |
|------|------|------|------|
| 入门 | 官方教程/视频 | 快速上手 | 1-2天 |
| 基础 | 经典书籍/课程 | 系统学习 | 2-4周 |
| 进阶 | 源码/论文/博客 | 深入理解 | 1-3月 |
| 实战 | 开源项目/工作 | 经验积累 | 持续 |
| 精通 | 架构设计/创新 | 技术领导 | 持续 |

## 最终检查清单

- [ ] 核心知识体系已建立
- [ ] 编码能力达到要求
- [ ] 工程实践已掌握
- [ ] 质量意识已建立
- [ ] 持续学习习惯已养成
- [ ] 技术视野持续拓展
