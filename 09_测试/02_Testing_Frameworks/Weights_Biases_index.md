---
title: Weights & Biases
type: index
created: 2026-07-02
updated: 2026-07-11
sources: []
tags: [auto-index]
---

# Weights & Biases

Weights & Biases — 实验跟踪（experiment tracking）、模型注册（model registry）与可视化平台在 AI 测试中的应用。

## 文件导航

| 文件 | 说明 | 适用人群 |
|------|------|----------|
| [[09_测试/02_Testing_Frameworks/Weights_Biases_Deep_Dive|Weights Biases Deep Dive]] | W&B deep dive: experiment management, Sweeps and Model Registry workflow | ML engineers / MLOps practitioners |

## Related

- [[09_测试/index|测试首页]]
- [[94_可视化/Training_Viz/index|Training Viz]]
- [[11_模型运维/13_Evaluation/Evaluation_index|Evaluation]]

## 核心概念

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| Experiment Tracking | 记录训练/测试指标 | 模型迭代 |
| Model Registry | 模型版本管理 | 生产部署 |
| Sweeps | 超参搜索 | 性能优化 |
| Reports | 可视化报告 | 团队协作 |
| Artifacts | 数据/模型版本 | 可复现性 |

## W&B 在 AI 测试中的应用

| 应用场景 | 功能 | 价值 |
|----------|------|------|
| 评估指标追踪 | 记录每次评估结果 | 趋势分析 |
| 模型对比 | 多版本指标对比 | 选型决策 |
| 回归检测 | 指标下降告警 | 质量保障 |
| 实验复现 | 完整环境记录 | 可复现性 |
| 团队协作 | 共享报告与看板 | 沟通效率 |

## W&B vs 其他实验跟踪工具

| 工具 | 优势 | 局限 | 适用场景 |
|------|------|------|----------|
| W&B | 功能全面、UI优秀 | 付费 | 团队/企业 |
| MLflow | 开源、自托管 | UI 较弱 | 私有化部署 |
| Neptune | 灵活元数据 | 生态较小 | 研究实验 |
| TensorBoard | 免费、TF原生 | 功能有限 | TensorFlow |
| ClearML | 开源全功能 | 学习曲线 | MLOps |

## 学习路径建议

| 阶段 | 推荐内容 | 目标 |
|------|----------|------|
| 入门 | W&B Deep Dive 主文档 | 理解平台功能 |
| 实践 | 跟踪一个评估实验 | 掌握基本操作 |
| 进阶 | Sweeps + Registry | 自动化工作流 |

## 常见问题

| 问题 | 解答 |
|------|------|
| W&B 免费吗？ | 个人版免费，团队版付费 |
| 支持哪些框架？ | PyTorch, TF, JAX, HuggingFace 等 |
| 数据安全如何保障？ | 支持私有化部署 |
| 与 CI/CD 如何集成？ | API + GitHub Actions |

## 统计

| 指标 | 数值 |
|------|------|
| 子域文件数 | 1 |
| 支持框架 | 20+ |
| 用户规模 | 100万+ |
| 核心功能 | 5 大模块 |

> 💡 W&B 是 AI 实验管理的事实标准，将测试评估纳入实验跟踪可实现全生命周期可观测。

## 附录：W&B 核心功能详解

| 功能 | 说明 | 测试应用 |
|------|------|----------|
| Runs | 单次实验记录 | 每次评估一个 Run |
| Groups | 实验分组 | 按模型/Prompt 分组 |
| Sweeps | 超参搜索 | 最优 Prompt 搜索 |
| Reports | 可视化报告 | 评估结果分享 |
| Registry | 模型注册 | 评估通过模型入库 |
| Alerts | 告警规则 | 指标下降通知 |

## 附录：W&B 评估工作流

```python
import wandb

# 初始化评估实验
wandb.init(project="llm-eval", name="gpt4-faithfulness")

# 记录评估指标
wandb.log({
    "faithfulness": 0.85,
    "answer_relevancy": 0.78,
    "context_precision": 0.72,
    "latency_p99": 2.3,
})

# 记录评估样本
wandb.log({"samples": wandb.Table(
    columns=["input", "output", "score"],
    data=[["...", "...", 0.9]]
)})

wandb.finish()
```

## 附录：W&B vs MLflow 对比

| 维度 | W&B | MLflow |
|------|-----|--------|
| 部署 | SaaS/私有 | 开源自托管 |
| UI | 优秀 | 基础 |
| 协作 | 强 | 中 |
| 成本 | 付费 | 免费 |
| 生态 | 广泛 | 广泛 |
| 学习曲线 | 低 | 中 |

## 附录：W&B 最佳实践

| 实践 | 说明 | 价值 |
|------|------|------|
| 命名规范 | 项目/实验统一命名 | 可查找性 |
| 标签管理 | 用 tag 分类实验 | 筛选效率 |
| 自动日志 | CI/CD 自动记录 | 可追溯 |
| 报告模板 | 标准化评估报告 | 团队沟通 |
| 告警配置 | 指标阈值告警 | 主动发现 |

## 附录：2026 年实验跟踪趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| 评估即实验 | 测试纳入实验管理 | 可追溯性 |
| 自动化报告 | AI 生成评估摘要 | 效率提升 |
| 实时监控 | 生产指标持续追踪 | 主动运维 |
| 成本追踪 | Token 消耗可视化 | 成本优化 |

## 附录：W&B 术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| Run | Run | 单次实验记录 |
| Sweep | Sweep | 超参搜索任务 |
| Artifact | Artifact | 数据/模型版本 |
| Report | Report | 可视化报告 |
| Registry | Registry | 模型注册中心 |
| Alert | Alert | 指标告警规则 |

## 附录：W&B 检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 项目命名规范 | 统一命名规则 | ☐ |
| 实验标签完整 | 可筛选分类 | ☐ |
| 指标自动记录 | CI/CD 集成 | ☐ |
| 报告定期生成 | 团队分享 | ☐ |
| 告警规则配置 | 主动发现 | ☐ |
| 成本追踪开启 | Token 监控 | ☐ |

## 附录：W&B 快速导航

| 我想... | 去看 | 难度 |
|---------|------|------|
| 了解 W&B 基础 | 本文档核心概念 | ★☆☆ |
| 跟踪评估实验 | 评估工作流 | ★★☆ |
| 配置告警 | 最佳实践 | ★★☆ |
| 对比 MLflow | 对比表 | ★☆☆ |

## 附录：W&B 资源

| 资源 | 类型 | 特点 |
|------|------|------|
| W&B 官方文档 | 文档 | 全面指南 |
| W&B 课程 | 视频 | 免费学习 |
| W&B GitHub | 代码 | 示例项目 |
| 本文档 | 知识库 | 中文体系化 |

## 附录：W&B 统计

| 指标 | 数值 |
|------|------|
| 支持框架 | 20+ |
| 用户规模 | 100万+ |
| 核心功能 | 5 大模块 |
| 部署方式 | SaaS/私有化 |

---
*Last updated: 2026-07-21*
