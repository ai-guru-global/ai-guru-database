---
title: "L00 - 课程环境设置"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "course-setup", "jupyter", "pytorch", "tensorflow"]
summary: "介绍如何开始使用 Microsoft AI For Beginners（微软 AI 入门）课程：不同学习者的起步方式、Jupyter Notebook（Jupyter 交互式笔记本）的运行路径、课程教学方法与离线访问方案。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/0-course-setup/setup.md"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "L00 Course Setup"
  - L00_Course_Setup
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../../治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# L00 - 课程环境设置

> **一句话理解**：本课不是讲 AI 算法，而是告诉你如何“进入”这门 12 周课程——学生如何利用微软资源、自学者如何 fork（复刻/分叉）仓库并运行 Jupyter Notebook（Jupyter 交互式笔记本）、教师如何备课，以及没有网络时怎样离线阅读全部材料。

## 本课概览

Microsoft AI For Beginners（微软 AI 入门）的“第 0 课”聚焦**学习路径与环境准备**。它不提供具体的神经网络代码，而是说明课程的组织方式、推荐的学习流程，以及运行后续 24 课 Jupyter Notebook 所需的环境入口。

本课在课程表中的定位是“启航页”。如果你是学生，它会指引你到微软学生中心与大使计划；如果你是自学者，它给出一套可复现的自学节奏；如果你要离线阅读，它也提供了 Docsify（轻量级文档站点生成器）与 PDF（便携式文档格式）两种方案。理解这些内容后，才能高效地进入后续的算法主题。

学习目标：

- 明确学生、自学者、教师三种角色的起步动作。
- 掌握课程 Jupyter Notebook 的推荐运行方式。
- 理解“项目驱动 + 频繁测验”的教学设计。
- 知道离线访问与课程讨论区的入口。

## 核心概念

- **课程即仓库（Curriculum as a Repo）**：整个课程就是一个 GitHub（代码托管平台）仓库。理论文本、可运行代码、测验、实验都在仓库里，阅读与运行一体化。
- **双框架 Notebook**：多数课时同时提供 PyTorch（基于 Python 的开源深度学习框架）与 TensorFlow / Keras（谷歌深度学习框架及其高层 API）两个版本的 Jupyter Notebook。初学者不必两个都跑，选一个最熟悉的框架深入即可。
- **课前/课后测验（Pre/Post Quiz）**：每课通常包含 3 道题的轻量测验。课前测验用于设定学习意图，课后测验用于巩固记忆。
- **项目驱动学习（Project-based Learning）**：课程从小项目开始，逐步过渡到更复杂的综合实验，鼓励在修改代码和完成挑战的过程中学习。
- **Docsify 离线阅读**：Docsify（轻量级文档站点生成器）可以在本地把 Markdown 课程渲染成可浏览的网站，适合无网络或内网环境。

## 关键知识点

- 学生可以先访问 [Microsoft Learn 学生中心](https://docs.microsoft.com/learn/student-hub?WT.mc_id=academic-77998-cacaste) 与 [学生大使计划](https://studentambassadors.microsoft.com?WT.mc_id=academic-77998-cacaste)，获取免费资源与社群支持。
- 自学者建议 fork（复刻/分叉）官方仓库到自己的 GitHub（代码托管平台）账号，再按“课前测验 → 阅读理论 → 运行 Jupyter Notebook → 课后测验 → 完成实验 → 参与讨论”的顺序推进。
- 运行 Jupyter Notebook 前，先阅读官方 [`how-to-run.md`](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/0-course-setup/how-to-run.md)；也可参考博客 [How to execute notebooks from GitHub](https://soshnikov.com/education/how-to-execute-notebooks-from-github/)。
- 课程推荐的扩展学习路径在 [Microsoft Learn 集合](https://docs.microsoft.com/en-us/users/dmitrysoshnikov-9132/collections/31zgizg2p418yo/?WT.mc_id=academic-77998-cacaste)。
- 教师可查看官方 [`for-teachers.md`](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/0-course-setup/for-teachers.md) 获取授课建议。
- 全部 50 个测验（每课 3 题）既可[在线访问](https://red-field-0a6ddfd03.1.azurestaticapps.net/)，也能在本地运行 `etc/quiz-app`。

## 代码/实验说明

本课本身没有独立的 Jupyter Notebook，但它是后续所有实验的“入口说明书”。

### 如何运行课程 Notebook

官方推荐两种主要方式：

1. **在 GitHub（代码托管平台）上直接阅读**：如果只是想看代码和说明，可以直接在仓库中浏览 `.ipynb` 文件。但这种方式无法交互执行。
2. **本地或云端执行**：
   - Fork/Clone 仓库：
     ```bash
     git clone https://github.com/microsoft/AI-For-Beginners.git
     cd AI-For-Beginners
     ```
   - 根据 `how-to-run.md` 安装 Python 依赖（通常包括 PyTorch 或 TensorFlow、Jupyter、NumPy、Matplotlib 等）。
   - 启动 Jupyter：
     ```bash
     jupyter notebook
     ```
   - 进入对应课时的 Notebook 文件夹，选择 PyTorch 或 TensorFlow 版本运行。

### 框架选择建议

- **PyTorch（基于 Python 的开源深度学习框架）**：动态图、调试直观，研究和快速实验更常见。
- **TensorFlow / Keras（谷歌深度学习框架及其高层 API）**：静态/动态图兼具，生产部署生态成熟。

对于自学者，建议先选定一个框架跑通全部课程，再视需要补充另一个。

## 本课不覆盖与延伸

- **不覆盖**：本课不讲解 Python 基础、Git 使用、深度学习数学原理，也不会部署模型到云端。这些内容可分别参考本库 [[数学基础/AI_Development_Environment_Setup]] 与相关基础章节。
- **延伸**：
  - 想系统了解课程全貌 → [[学习/courses/microsoft/microsoft_ai_for_beginners]]
  - 想准备本地开发环境 → [[数学基础/AI_Development_Environment_Setup]]
  - 想学习如何运行 GitHub 上的 Notebook → 官方 [`how-to-run.md`](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/0-course-setup/how-to-run.md)

## 相关阅读

- 课程索引：[[学习/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：[[数学基础/AI_Development_Environment_Setup]]
- 官方运行说明：[how-to-run.md](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/0-course-setup/how-to-run.md)
- 教师指南：[for-teachers.md](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/0-course-setup/for-teachers.md)

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
