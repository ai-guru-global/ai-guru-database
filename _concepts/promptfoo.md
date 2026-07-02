---
title: "Promptfoo Prompt 测试框架 (Promptfoo LLM Testing)"
category: -concepts
tags: ["promptfoo", "prompt-testing", "llm-evaluation", "ci-cd", "red-teaming"]
relationships:
  - target: "_concepts/ragas"
    type: related_to
  - target: "_concepts/deepeval"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "Promptfoo 是开源的 LLM 测试框架——以 YAML 配置驱动，支持 Prompt A/B 测试、多模型对比、红队测试和 CI/CD 集成。是 Prompt Engineering 团队的标配测试工具。"
provenance:
  extracted: 0.15
  inferred: 0.75
  ambiguous: 0.10
base_confidence: 0.83
lifecycle: reviewed
tier: supporting
---

# Promptfoo Prompt 测试框架

> **一句话理解**: Promptfoo 是"LLM Prompt 的单元测试"——用 YAML 定义测试用例，自动跑多模型 A/B 对比，找到最好的 Prompt。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **类型** | LLM 测试与评估 CLI 工具 |
| **开源协议** | MIT |
| **GitHub** | 5K+ ⭐ |
| **核心价值** | Prompt 测试 + 多模型对比 + 红队测试 |
| **配置方式** | YAML 文件驱动 |

---

## 2. 核心用法

### 2.1 YAML 配置测试

```yaml
# promptfooconfig.yaml
prompts:
  - prompts/v1.txt
  - prompts/v2.txt

providers:
  - openai:gpt-4
  - openai:gpt-3.5-turbo
  - anthropic:claude-3-sonnet

tests:
  - vars:
      question: "什么是 vLLM？"
    assert:
      - type: contains
        value: "推理引擎"
      - type: llm-rubric
        value: "回答应该提到 PagedAttention"
  
  - vars:
      question: "解释 MoE 架构"
    assert:
      - type: contains-any
        value: ["专家", "路由", "混合"]
      - type: not-contains
        value: "不相关信息"
      - type: llm-rubric
        value: "应该解释 MoE 的效率优势"
```

```bash
# 运行测试
npx promptfoo eval

# 查看结果（Web UI）
npx promptfoo view
```

### 2.2 评估类型

| 类型 | 说明 |
|------|------|
| **contains** | 输出包含指定文本 |
| **llm-rubric** | LLM 作为评审打分 |
| **javascript** | 自定义 JS 函数评估 |
| **python** | 自定义 Python 函数评估 |
| **similar** | 语义相似度 |
| **cost** | 成本约束 |
| **latency** | 延迟约束 |
| **is-json** | 输出是否为 JSON |

---

## 3. 红队测试

```yaml
# 内置红队测试策略
redteam:
  purpose: "AI 客服助手，回答产品问题"
  plugins:
    - harmful      # 有害内容
    - hijacking    # Prompt 劫持
    - pii          # 个人信息泄露
    - overreliance # 过度依赖
    - contracts    # 承诺约束
  strategies:
    - jailbreak    # 越狱攻击
    - prompt-injection # 注入攻击
```

```bash
# 运行红队测试
npx promptfoo redteam run
```

---

## 4. CI/CD 集成

```yaml
# .github/workflows/prompt-test.yml
name: Prompt Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx promptfoo eval --no-progress-bar
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

---

## 5. 与其他工具对比

| 特性 | Promptfoo | DeepEval | Ragas |
|------|-----------|----------|-------|
| **配置方式** | YAML | Python 代码 | Python 代码 |
| **多模型对比** | ★★★★★ | ★★★☆☆ | ★★★☆☆ |
| **Prompt A/B** | ★★★★★ | ❌ | ❌ |
| **红队测试** | ✅ 内置 | ❌ | ❌ |
| **RAG 评估** | 有限 | ★★★★☆ | ★★★★★ |
| **学习曲线** | 低 (YAML) | 低 (PyTest) | 中等 |
| **适合谁** | Prompt 工程师 | ML 工程师 | ML 工程师 |

---

## 6. 关键要点

1. **YAML 驱动**：非程序员也能写测试用例，Prompt 工程师友好
2. **多模型 A/B**：同一 Prompt 跑多个模型，直接对比结果
3. **红队测试**：内置越狱、注入等安全测试，自动化安全审计
4. **Web UI**：可视化展示测试结果矩阵（Prompt × Model × Test）
5. **CI/CD 集成**：Prompt 修改自动触发测试，防止回归
6. **开源 MIT**：完全免费，社区活跃
