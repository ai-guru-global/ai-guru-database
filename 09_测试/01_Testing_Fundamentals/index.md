---
title: Testing Fundamentals
type: index
created: 2026-07-02
updated: 2026-07-25
sources: []
tags: [auto-index]
---

# Testing Fundamentals

测试基础（Testing Fundamentals）— AI 系统测试的核心概念、方法论（methodology）与最佳实践（best practices）。

## 文件导航

| 文件 | 说明 | 适用人群 |
|------|------|----------|
| [[09_测试/01_Testing_Fundamentals/AI_Testing_for_dummy|AI Testing for dummy]] | AI testing beginner guide: from unit testing to evaluation benchmarks | beginners / QA engineers |
| [[09_测试/01_Testing_Fundamentals/AI_Test_Framework_2026|AI Test Framework 2026]] | AI testing framework landscape 2026: toolchain and methodology overview | QA engineers / test architects |
| [[09_测试/01_Testing_Fundamentals/AI-Testing-in-nutshell|AI-Testing-in-nutshell]] | AI testing in a nutshell: core concepts quick reference | all practitioners |
| [[09_测试/01_Testing_Fundamentals/LLM_Unit_Testing|LLM 单元测试 (LLM Unit Testing)]] | LLM 应用单元测试完整指南：非确定性输出测试策略、断言设计、快照测试、Mock 策略、评估驱动测试与 2026 工具链。 | - | - |
| [[09_测试/01_Testing_Fundamentals/Test_Data_Management|测试数据管理 (Test Data Management)]] | 测试数据管理是 AI 系统测试的"后勤保障"——系统化地创建、维护、版本化测试数据，确保测试可重复、结果可信、回归高效。 | - | - |
| [[09_测试/01_Testing_Fundamentals/Test_Data_index|Test Data]] |  | - | - |

## Related

- [[09_测试/index|测试首页]]
- [[09_测试/01_Testing_Fundamentals/Contract_Testing_index|Contract Testing]]
- [[08_模型评估/index|模型评估]]

## 核心概念

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| 单元测试 | 验证最小可测试单元 | 函数/方法逻辑 |
| 集成测试 | 验证组件间交互 | API 调用链 |
| 评估测试 | 验证模型输出质量 | LLM 生成内容 |
| 回归测试 | 确保更新不退化 | 模型/Prompt 变更 |
| 安全测试 | 检测有害输出 | 生产环境 |

## AI 测试 vs 传统测试

| 维度 | 传统测试 | AI 测试 |
|------|----------|----------|
| 输出确定性 | 确定性 | 非确定性 |
| 断言方式 | 精确匹配 | 语义/统计 |
| 测试数据 | 固定输入 | 多样化输入 |
| 通过标准 | 二元 | 分数/阈值 |
| 回归检测 | 精确对比 | 统计显著性 |

## AI 测试金字塔

| 层级 | 测试类型 | 占比 | 速度 |
|------|----------|------|------|
| 底层 | 单元测试 | 60% | 快 |
| 中层 | 集成/契约测试 | 25% | 中 |
| 顶层 | E2E/评估测试 | 15% | 慢 |

## 学习路径建议

| 阶段 | 推荐内容 | 目标 |
|------|----------|------|
| 入门 | AI Testing for dummy | 建立测试认知 |
| 实践 | AI Test Framework 2026 | 掌握工具链 |
| 进阶 | AI-Testing-in-nutshell | 快速参考 |

## 常见问题

| 问题 | 解答 |
|------|------|
| AI 系统需要测试吗？ | 必须，非确定性更需要测试 |
| 如何定义测试通过？ | 设定指标阈值 + 统计显著性 |
| 测试覆盖率如何衡量？ | 场景覆盖 + 指标覆盖 |
| 初学者从哪开始？ | 从 AI Testing for dummy 开始 |

## 统计

| 指标 | 数值 |
|------|------|
| 子域文件数 | 3 |
| 测试层级 | 3 层金字塔 |
| 核心方法论 | 5+ |
| 适用人群 | 所有 AI 从业者 |

> 💡 测试基础是所有 AI 测试实践的根基，理解测试金字塔和 AI 测试特殊性是第一步。

## 附录：AI 测试方法论全景

| 方法 | 原理 | 适用场景 | 工具 |
|------|------|----------|------|
| 基于断言 | 精确/模糊匹配 | 结构化输出 | pytest |
| 基于指标 | 语义/统计分数 | 开放式生成 | DeepEval |
| 基于对比 | A/B 版本对比 | 模型选型 | Promptfoo |
| 基于红队 | 对抗性输入 | 安全测试 | Garak |
| 基于监控 | 生产环境追踪 | 持续质量 | LangSmith |

## 附录：测试策略设计

| 项目阶段 | 测试重点 | 频率 | 工具 |
|----------|----------|------|------|
| 开发期 | 单元+集成测试 | 每次提交 | pytest |
| 评估期 | 质量指标评估 | 每日 | DeepEval |
| 发布前 | 回归+安全测试 | 每次发布 | CI/CD |
| 生产期 | 监控+A/B测试 | 持续 | W&B/LangSmith |

## 附录：AI 测试挑战与应对

| 挑战 | 说明 | 应对策略 |
|------|------|----------|
| 非确定性 | 相同输入不同输出 | 多次采样+统计 |
| 评估主观性 | 质量难量化 | LLM-as-Judge |
| 数据污染 | 测试集泄露到训练 | 相似度检测 |
| 成本高昂 | LLM 调用费用 | 采样+分层 |
| 快速迭代 | 模型更新频繁 | 自动化 CI/CD |

## 附录：测试覆盖率框架

| 覆盖维度 | 说明 | 衡量方式 |
|----------|------|----------|
| 功能覆盖 | 场景完整性 | 场景清单 |
| 指标覆盖 | 评估维度全面性 | 指标矩阵 |
| 数据覆盖 | 输入多样性 | 分布分析 |
| 边界覆盖 | 极端情况 | 边界用例 |
| 安全覆盖 | 攻击向量 | 红队清单 |

## 附录：2026 年 AI 测试趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| AI 测试 AI | 用 LLM 生成测试用例 | 效率提升 |
| 持续评估 | 生产环境实时监控 | 主动发现 |
| 标准化 | 行业测试标准建立 | 规范化 |
| 自动化红队 | AI 驱动安全测试 | 安全性提升 |

## 附录：测试基础代码示例

```python
# AI 测试基础示例
import pytest
from deepeval import evaluate
from deepeval.test_case import LLMTestCase
from deepeval.metrics import (
    AnswerRelevancyMetric,
    FaithfulnessMetric,
)

def test_llm_output():
    """LLM 输出质量测试"""
    test_case = LLMTestCase(
        input="解释什么是机器学习",
        actual_output=llm.generate("解释什么是机器学习"),
        retrieval_context=["机器学习是..."],
    )
    metrics = [
        AnswerRelevancyMetric(threshold=0.7),
        FaithfulnessMetric(threshold=0.8),
    ]
    evaluate([test_case], metrics)
```

## 附录：测试基础检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 测试目标明确 | 知道要验证什么 | ☐ |
| 测试数据准备 | 多样化输入覆盖 | ☐ |
| 评估指标定义 | 量化质量标准 | ☐ |
| 通过阈值设定 | 明确达标线 | ☐ |
| 自动化集成 | CI/CD 触发 | ☐ |
| 结果可追溯 | 日志与报告 | ☐ |

## 附录：测试基础术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 断言 | Assertion | 验证条件是否满足 |
| 测试用例 | Test Case | 输入+期望输出 |
| 测试套件 | Test Suite | 测试用例集合 |
| 覆盖率 | Coverage | 测试完整程度 |
| 回归 | Regression | 更新后能力退化 |
| 假阳性 | False Positive | 错误通过 |
| 假阴性 | False Negative | 错误失败 |

## 附录：测试基础快速导航

| 我想... | 去看 | 难度 |
|---------|------|------|
| 零基础入门 | AI Testing for dummy | ★☆☆ |
| 了解工具链 | AI Test Framework 2026 | ★★☆ |
| 快速参考 | AI-Testing-in-nutshell | ★☆☆ |

## 附录：测试基础资源

| 资源 | 类型 | 特点 |
|------|------|------|
| AI Testing for dummy | 教程 | 零基础友好 |
| AI Test Framework 2026 | 指南 | 工具全景 |
| AI-Testing-in-nutshell | 参考 | 快速查阅 |
| 本文档 | 知识库 | 中文体系化 |

## 附录：测试基础统计

| 指标 | 数值 |
|------|------|
| 测试层级 | 3 层金字塔 |
| 核心方法论 | 5+ |
| 适用人群 | 所有 AI 从业者 |
| 入门难度 | 低 |

---
*Last updated: 2026-07-21*
