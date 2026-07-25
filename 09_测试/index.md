---
title: 测试
type: index
created: 2026-07-02
updated: 2026-07-11
sources: []
tags: [auto-index]
---

# 测试

AI 测试知识体系（Testing Knowledge Base）— 涵盖测试方法论、评估框架、A/B 测试、Agent 评估、RAGAS 与实验跟踪工具。

## 文件导航

| 文件 | 说明 | 适用人群 |
|------|------|----------|
| [[测试/README|README]] | Testing module overview and knowledge map | all readers |
| [[测试/README_for_dummy|README for dummy]] | Testing beginner guide and quick start | newcomers / beginners |

## Related

- [[测试/Testing_Fundamentals/index|Testing Fundamentals]]
- [[测试/Agent_Evaluation_index|Agent Evaluation]]
- [[测试/AB_Testing_index|AB Testing]]
- [[测试/RAGAS_index|RAGAS]]
- [[测试/Weights_Biases_index|Weights & Biases]]
- [[测试/Test_Data_index|Test Data]]
- [[测试/Contract_Testing_index|Contract Testing]]
- [[模型评估/index|模型评估]]

## 子域简介

| 子域 | 核心主题 | 文件数 |
|------|----------|--------|
| Testing Fundamentals | 测试基础与方法论 | 3 |
| Testing Frameworks | 测试工具与框架 | 5 |
| Agent Evaluation | 智能体评估 | 1 |
| AB Testing | 在线实验设计 | 1 |
| RAGAS | RAG 评估框架 | 1 |
| Weights & Biases | 实验跟踪平台 | 1 |
| Test Data | 测试数据管理 | 1 |
| Contract Testing | 契约测试 | 1 |
| LLM Unit Testing | LLM 单元测试 | 1 |

## AI 测试核心概念速查

| 概念 | 说明 | 关联子域 |
|------|------|----------|
| 非确定性测试 | LLM 输出每次不同 | Fundamentals |
| 评估指标 | Faithfulness/Relevancy | RAGAS |
| 回归测试 | 确保更新不退化 | Frameworks |
| 安全测试 | 红队/越狱检测 | Frameworks |
| 实验设计 | A/B 测试统计方法 | AB Testing |
| 轨迹评估 | Agent 决策路径质量 | Agent Evaluation |

## 测试工具全景

| 工具 | 类型 | 适用场景 |
|------|------|----------|
| DeepEval | 评估框架 | 通用 LLM 测试 |
| Promptfoo | Prompt 测试 | Prompt 工程 |
| RAGAS | RAG 评估 | RAG 系统 |
| LangSmith | 追踪评估 | LangChain 生态 |
| W&B | 实验跟踪 | 模型迭代 |
| Pact | 契约测试 | 微服务 API |
| Garak | 安全测试 | 红队测试 |

## 学习路径建议

| 阶段 | 推荐文档 | 目标 |
|------|----------|------|
| 入门 | Testing Fundamentals | 建立测试认知 |
| 实践 | Testing Frameworks | 掌握工具使用 |
| 进阶 | Agent Evaluation + RAGAS | 专项评估 |
| 精通 | AB Testing + W&B | 生产级测试体系 |

## 常见问题

| 问题 | 解答 |
|------|------|
| AI 测试与传统测试有何不同？ | 非确定性输出需语义/统计断言 |
| 应该先学什么？ | 从 Testing Fundamentals 开始 |
| 测试需要多少成本？ | 采样评估可控制成本 |
| 如何构建测试体系？ | 金字塔模型 + CI/CD 集成 |

## 统计

| 指标 | 数值 |
|------|------|
| 子域总数 | 9 |
| 文件总数 | 15+ |
| 核心工具 | 10+ |
| 覆盖场景 | 单元/集成/E2E/安全/性能 |

> 💡 AI 测试是保障 AI 系统可靠性的核心实践，从基础方法论到工具化实践，构建全面质量保障体系。

## 附录：测试域知识图谱

| 知识节点 | 前置依赖 | 后续延伸 |
|----------|----------|----------|
| 测试基础 | 无 | 所有测试子域 |
| 测试框架 | 测试基础 | CI/CD 集成 |
| RAGAS | 测试基础 + RAG | RAG 优化 |
| Agent 评估 | 测试基础 + Agent | 智能体优化 |
| A/B 测试 | 统计学 | 产品决策 |
| 实验跟踪 | 测试框架 | MLOps |
| 测试数据 | 数据工程 | 数据质量 |
| 契约测试 | API 设计 | 微服务 |

## 附录：测试成熟度模型

| 级别 | 特征 | 实践 |
|------|------|------|
| L1 初始 | 无系统测试 | 手动检查 |
| L2 基础 | 基本评估指标 | 定期评估 |
| L3 规范 | 自动化测试管道 | CI/CD 集成 |
| L4 量化 | 全面指标体系 | 数据驱动 |
| L5 优化 | 持续改进闭环 | 智能测试 |

## 附录：测试域文件统计

| 子域 | 文件数 | 核心主题 |
|------|--------|----------|
| Testing Fundamentals | 3 | 测试基础与方法论 |
| Testing Frameworks | 5 | 工具与框架实践 |
| Agent Evaluation | 1 | 智能体评估 |
| AB Testing | 1 | 在线实验 |
| RAGAS | 1 | RAG 评估 |
| Weights & Biases | 1 | 实验跟踪 |
| Test Data | 1 | 数据管理 |
| Contract Testing | 1 | 契约测试 |
| LLM Unit Testing | 1 | 单元测试 |

## 附录：2026 年 AI 测试趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| AI 测试 AI | 用 LLM 生成测试 | 效率 10x |
| 持续评估 | 生产实时监控 | 主动质量 |
| 标准化 | 行业测试规范 | 规范化 |
| 安全前置 | 安全测试左移 | 风险降低 |
| 成本优化 | 智能采样策略 | 成本降低 |

## 附录：测试域术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 评估 | Evaluation | 量化模型输出质量 |
| 回归测试 | Regression Testing | 确保更新不退化 |
| 红队测试 | Red Teaming | 对抗性安全测试 |
| 契约测试 | Contract Testing | API 兼容性验证 |
| 实验设计 | Experiment Design | A/B 测试方法 |
| 轨迹评估 | Trajectory Eval | Agent 决策路径评估 |
| 数据漂移 | Data Drift | 输入分布变化 |
| 测试覆盖率 | Test Coverage | 测试完整程度 |

## 附录：测试域学习资源

| 资源 | 类型 | 特点 |
|------|------|------|
| DeepEval 文档 | 官方文档 | 全面指标 |
| Promptfoo 指南 | 教程 | 快速上手 |
| RAGAS 论文 | 学术论文 | 理论基础 |
| W&B 课程 | 视频 | 实验管理 |
| 本知识库 | 综合 | 中文体系化 |

## 附录：测试域快速导航

| 我想... | 去看 | 难度 |
|---------|------|------|
| 了解 AI 测试基础 | Testing Fundamentals | ★☆☆ |
| 选择测试工具 | Testing Frameworks | ★☆☆ |
| 评估 RAG 系统 | RAGAS | ★★☆ |
| 评估 Agent | Agent Evaluation | ★★☆ |
| 做 A/B 测试 | AB Testing | ★★☆ |
| 管理实验 | Weights & Biases | ★★☆ |
| 管理测试数据 | Test Data | ★★☆ |
| 测试 API 契约 | Contract Testing | ★★★ |

## 附录：测试域贡献指南

| 贡献类型 | 说明 | 要求 |
|----------|------|------|
| 新增工具评测 | 新框架深度指南 | 200+ 行 |
| 更新指标 | 指标定义更新 | 来源引用 |
| 案例补充 | 实践案例 | 真实场景 |
| 错误修正 | 内容纠错 | 说明原因 |

## 附录：测试域统计

| 指标 | 数值 |
|------|------|
| 子域总数 | 9 |
| 文件总数 | 15+ |
| 核心工具 | 10+ |
| 覆盖场景 | 单元/集成/E2E/安全/性能 |

---
*Last updated: 2026-07-21*
