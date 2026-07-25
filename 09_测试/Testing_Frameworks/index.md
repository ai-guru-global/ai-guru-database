---
title: Testing Frameworks
type: index
created: 2026-07-02
updated: 2026-07-11
sources: []
---

# Testing Frameworks

测试框架 — DeepEval、Promptfoo 等 AI 系统专用测试工具与框架。

## 文件导航

| 文件 | 说明 |
|------|------|
| [[测试/Testing_Frameworks/DeepEval_Deep_Dive|DeepEval]] | LLM 评估测试框架深度指南 |
| [[测试/Testing_Frameworks/Promptfoo_Deep_Dive|Promptfoo]] | Prompt 测试与评估工具 |
| [[测试/Testing_Frameworks/LLM_Safety_Testing_Deep_Dive|LLM 安全测试]] | 大模型安全测试方法论 |
| [[测试/Testing_Frameworks/Regression_Testing_LLM_Deep_Dive|LLM 回归测试]] | 大模型回归测试策略 |
| [[测试/Testing_Frameworks/Java_AI_Testing|Java AI 测试]] | Java 生态 AI 测试实践 |

## Related

- [[测试/Testing_Fundamentals/index|Testing Fundamentals]]
- [[测试/RAGAS_index|RAGAS]]

## 框架全景

| 框架 | 核心能力 | 语言 | 适用场景 |
|------|----------|------|----------|
| DeepEval | 全面 LLM 评估指标 | Python | 通用 LLM 测试 |
| Promptfoo | Prompt 测试与对比 | Node.js | Prompt 工程 |
| RAGAS | RAG 评估指标 | Python | RAG 系统 |
| LangSmith | 追踪与评估 | Python/JS | LangChain 生态 |
| Braintrust | 评估+日志 | Python/JS | 生产监控 |

## 框架选择决策

| 需求 | 推荐框架 | 理由 |
|------|----------|------|
| 快速 Prompt 测试 | Promptfoo | 配置简单、快速迭代 |
| 全面质量评估 | DeepEval | 14+ 内置指标 |
| RAG 系统评估 | RAGAS | 专为 RAG 设计 |
| 安全测试 | Garak/PyRIT | 红队测试专用 |
| 回归测试 | DeepEval + CI | 自动化回归检测 |
| Java 生态 | Testcontainers + 自定义 | Java 原生支持 |

## 测试框架对比矩阵

| 特性 | DeepEval | Promptfoo | RAGAS | LangSmith |
|------|----------|-----------|-------|----------|
| 开源 | ✓ | ✓ | ✓ | 部分 |
| CI/CD 集成 | ✓ | ✓ | ✓ | ✓ |
| 自定义指标 | ✓ | ✓ | ✓ | ✓ |
| 无参考评估 | ✓ | 部分 | ✓ | ✓ |
| 多模型对比 | ✓ | ✓ | ✗ | ✓ |
| 生产监控 | ✗ | ✗ | ✗ | ✓ |

## 学习路径建议

| 阶段 | 推荐内容 | 目标 |
|------|----------|------|
| 入门 | AI Testing for dummy | 理解测试基础 |
| 实践 | DeepEval/Promptfoo Deep Dive | 掌握工具使用 |
| 进阶 | Safety Testing + Regression | 全面测试体系 |
| 精通 | 自定义框架 + CI/CD | 工程化实践 |

## 常见问题

| 问题 | 解答 |
|------|------|
| 应该用哪个框架？ | 根据场景选择，可组合使用 |
| 框架能替代人工评估吗？ | 不能，复杂场景仍需人工 |
| 如何集成到 CI/CD？ | pytest + GitHub Actions |
| 评估成本如何控制？ | 采样评估 + 分层策略 |

## 统计

| 指标 | 数值 |
|------|------|
| 子域文件数 | 5 |
| 主流框架 | 8+ |
| 核心语言 | Python, Node.js |
| CI/CD 支持 | 全部支持 |

> 💡 测试框架是 AI 质量保障的工具化基础，选择框架应以场景需求为导向，而非追求功能全面。

## 附录：框架集成示例

```python
# DeepEval 示例
from deepeval import evaluate
from deepeval.test_case import LLMTestCase
from deepeval.metrics import AnswerRelevancyMetric

test_case = LLMTestCase(
    input="什么是 AI?",
    actual_output="人工智能是...",
)
metric = AnswerRelevancyMetric(threshold=0.7)
evaluate([test_case], [metric])
```

## 附录：CI/CD 集成配置

```yaml
# GitHub Actions 示例
name: LLM Eval
on: [push]
jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install deepeval
      - run: deepeval test run test_eval.py
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

## 附录：框架选型决策树

| 判断条件 | 推荐框架 |
|----------|----------|
| 需要快速 Prompt 迭代？ | Promptfoo |
| 需要全面质量指标？ | DeepEval |
| 评估 RAG 系统？ | RAGAS |
| 需要安全测试？ | Garak/PyRIT |
| 需要生产监控？ | LangSmith |
| Java 技术栈？ | Testcontainers + 自定义 |

## 附录：测试框架成熟度评估

| 框架 | 社区活跃度 | 文档质量 | 企业采用 | 更新频率 |
|------|------------|----------|----------|----------|
| DeepEval | 高 | 优秀 | 中 | 周更 |
| Promptfoo | 高 | 优秀 | 中 | 周更 |
| RAGAS | 高 | 良好 | 高 | 月更 |
| LangSmith | 高 | 优秀 | 高 | 持续 |
| Garak | 中 | 良好 | 低 | 月更 |

## 附录：2026 年测试框架趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| 框架融合 | 多功能一体化 | 工具链简化 |
| AI 原生 | 专为 LLM 设计 | 更贴合场景 |
| 开源主导 | 社区驱动创新 | 快速迭代 |
| 标准化 API | 统一评估接口 | 互操作性 |

## 附录：测试框架术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 指标 | Metric | 量化评估标准 |
| 断言 | Assertion | 验证条件 |
| 测试用例 | Test Case | 输入+期望 |
| 阈值 | Threshold | 通过分数线 |
| 回归 | Regression | 能力退化检测 |
| 红队 | Red Team | 对抗性测试 |

## 附录：框架检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 框架选型合理 | 匹配场景需求 | ☐ |
| CI/CD 已集成 | 自动化触发 | ☐ |
| 指标阈值设定 | 明确达标线 | ☐ |
| 测试数据准备 | 多样化覆盖 | ☐ |
| 结果可追溯 | 日志与报告 | ☐ |
| 定期回顾优化 | 持续改进 | ☐ |

## 附录：框架快速导航

| 我想... | 去看 | 难度 |
|---------|------|------|
| 快速 Prompt 测试 | Promptfoo Deep Dive | ★☆☆ |
| 全面质量评估 | DeepEval Deep Dive | ★★☆ |
| RAG 系统评估 | RAGAS Deep Dive | ★★☆ |
| 安全测试 | LLM Safety Testing | ★★★ |
| 回归测试 | Regression Testing | ★★☆ |
| Java 测试 | Java AI Testing | ★★☆ |

## 附录：框架资源

| 资源 | 类型 | 特点 |
|------|------|------|
| DeepEval GitHub | 代码 | 开源框架 |
| Promptfoo 文档 | 文档 | 快速上手 |
| RAGAS 论文 | 论文 | 理论基础 |
| 本文档 | 知识库 | 中文体系化 |

## 附录：框架统计

| 指标 | 数值 |
|------|------|
| 主流框架 | 8+ |
| 核心语言 | Python, Node.js |
| CI/CD 支持 | 全部支持 |
| 开源比例 | 80%+ |

---
*Last updated: 2026-07-21*
