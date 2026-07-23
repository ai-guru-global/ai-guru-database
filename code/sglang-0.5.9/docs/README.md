# SGLang Documentation

This is the documentation website for the SGLang project (https://github.com/sgl-project/sglang).

We recommend new contributors start from writing documentation, which helps you quickly understand SGLang codebase.
Most documentation files are located under the `docs/` folder.

## Docs Workflow

### Install Dependency

```bash
apt-get update && apt-get install -y pandoc parallel retry
pip install -r requirements.txt
```

### Update Documentation

Update your Jupyter notebooks in the appropriate subdirectories under `docs/`. If you add new files, remember to update `index.rst` (or relevant `.rst` files) accordingly.

- **`pre-commit run --all-files`** manually runs all configured checks, applying fixes if possible. If it fails the first time, re-run it to ensure lint errors are fully resolved. Make sure your code passes all checks **before** creating a Pull Request.

```bash
# 1) Compile all Jupyter notebooks
make compile  # This step can take a long time (10+ mins). You can consider skipping this step if you can make sure your added files are correct.
make html

# 2) Compile and Preview documentation locally with auto-build
# This will automatically rebuild docs when files change
# Open your browser at the displayed port to view the docs
bash serve.sh

# 2a) Alternative ways to serve documentation
# Directly use make serve
make serve
# With custom port
PORT=8080 make serve

# 3) Clean notebook outputs
# nbstripout removes notebook outputs so your PR stays clean
pip install nbstripout
find . -name '*.ipynb' -exec nbstripout {} \;

# 4) Pre-commit checks and create a PR
# After these checks pass, push your changes and open a PR on your branch
pre-commit run --all-files
```

## Documentation Style Guidelines

- For common functionalities, we prefer **Jupyter Notebooks** over Markdown so that all examples can be executed and validated by our docs CI pipeline. For complex features (e.g., distributed serving), Markdown is preferred.
- Keep in mind the documentation execution time when writing interactive Jupyter notebooks. Each interactive notebook will be run and compiled against every commit to ensure they are runnable, so it is important to apply some tips to reduce the documentation compilation time:
  - Use small models (e.g., `qwen/qwen2.5-0.5b-instruct`) for most cases to reduce server launch time.
  - Reuse the launched server as much as possible to reduce server launch time.
- Do not use absolute links (e.g., `https://docs.sglang.io/get_started/install.html`). Always prefer relative links (e.g., `../get_started/install.md`).
- Follow the existing examples to learn how to launch a server, send a query and other common styles.

## Documentation Build, Deployment, and CI

The SGLang documentation pipeline is based on **Sphinx** and supports rendering Jupyter notebooks (`.ipynb`) into HTML/Markdown for web display. Detailed logits can be found in the [Makefile](./Makefile).

### Notebook Execution (`make compile`)

The `make compile` target is responsible for executing notebooks before rendering:

* Finds all `.ipynb` files under `docs/` (excluding `_build/`)
* Executes notebooks in parallel using GNU Parallel, with a relatively small `--mem-fraction-static`
* Wraps execution with `retry` to reduce flaky failures
* Executes notebooks via `jupyter nbconvert --execute --inplace`
* Records execution timing in `logs/timing.log`

This step ensures notebooks contain up-to-date outputs with each commit in the main branch before rendering.

### Web Rendering (`make html`)

After compilation, Sphinx builds the website:

* Reads Markdown, reStructuredText, and Jupyter notebooks
* Renders them into HTML pages
* Outputs the website into:

```
docs/_build/html/
```

This directory is the source for online documentation hosting.

### Markdown Export (`make markdown`)

To support downstream consumers, we add a **new Makefile target**:

```bash
make markdown
```

This target:

* Does **not modify** `make compile`
* Scans all `.ipynb` files (excluding `_build/`)
* Converts notebooks directly to Markdown using `jupyter nbconvert --to markdown`
* Writes Markdown artifacts into the existing build directory:

```
docs/_build/html/markdown/<relative-path>.md
```

Example:

```
docs/advanced_features/lora.ipynb
→ docs/_build/html/markdown/advanced_features/lora.md
```

### CI Execution

In our [CI](https://github.com/sgl-project/sglang/blob/main/.github/workflows/release-docs.yml), the documentation pipeline first gets all the executed results and renders HTML and Markdown by:

```bash
make compile    # execute notebooks (ensure outputs are up to date)
make html       # build website as usual
make markdown   # export markdown artifacts into _build/html/markdown
```

Then, the compiled results are forced pushed to [sgl-project.io](https://github.com/sgl-project/sgl-project.github.io) for rendering. In other words, sgl-project.io is push-only. All the changes of SGLang docs should be made directly in SGLang main repo, then push to the sgl-project.io.

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
