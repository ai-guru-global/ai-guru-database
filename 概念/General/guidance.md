---
title: "Guidance (Microsoft Guidance)"
category: -concepts
tags: ["structured-generation", "prompt-engineering", "microsoft", "llm", "template"]
relationships:
  - target: "概念/outlines"
    type: related_to
  - target: "概念/lm-format-enforcer"
    type: related_to
  - target: "概念/promptfoo"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Microsoft 开源的 LLM 结构化生成库，通过模板语法将 Prompt 工程与输出约束融合，支持条件分支、循环与工具调用编排。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
---

# Guidance

[Guidance](https://github.com/microsoft/guidance) 是 Microsoft Research 开源的 LLM 结构化生成库，通过类 Handlebars 的模板语法将 Prompt 编写、输出约束与逻辑控制融合在一个统一的编程范式中。与 Outlines 侧重"输出格式约束"不同，Guidance 更关注**生成过程的可编程性**——开发者可以在 Prompt 中嵌入条件分支、循环、函数调用等控制流，让 LLM 的交互行为像程序一样可预测。

## 核心特性

### 模板语法

```python
from guidance import models, gen, select, system, user, assistant

lm = models.OpenAI("gpt-4")

# 角色化的对话模板
lm += system("你是一个代码审查专家。")
lm += user("请审查以下代码：{{code}}")
lm += assistant(gen("review", max_tokens=500))
```

### 选择约束（Select）

```python
# 强制 LLM 在给定选项中选择
lm += "这个 Bug 的严重级别是：" + select(
    ["critical", "major", "minor", "trivial"],
    name="severity"
)
```

### 条件生成

```python
# 根据前一步结果动态调整后续 Prompt
lm += gen("analysis")
if lm["analysis"].contains("security"):
    lm += "请详细展开安全风险：" + gen("security_detail")
```

### 工具调用编排

```python
# 在生成过程中嵌入工具调用
@guidance
def search_and_summarize(lm, query):
    lm += f"搜索: {query}\n"
    results = search_api(query)  # 外部工具
    lm += f"结果: {results}\n"
    lm += "摘要: " + gen("summary")
    return lm
```

## 与同类工具对比

| 维度 | Guidance | Outlines | LMQL |
|------|----------|----------|------|
| **定位** | 可编程 Prompt 模板 | 输出格式约束 | 查询语言 |
| **约束方式** | 模板 + Token masking | CFG + Token masking | 声明式约束 |
| **控制流** | 条件/循环/函数 | 无（纯约束） | 查询内 |
| **模型支持** | OpenAI/本地/Transformers | 本地为主 | 多后端 |
| **学习曲线** | 中（Pythonic） | 低 | 高（新语言） |
| **生产就绪** | 高 | 高 | 中 |
| **微软背书** | ✅ | ❌ | ❌ |

## 核心优势

1. **过程可控**: 生成过程中嵌入逻辑，不只是约束输出格式
2. **Token 级流式**: 生成过程中实时应用约束，减少无效 Token
3. **角色化对话**: 原生支持 system/user/assistant 角色管理
4. **成本优化**: 通过精确的 Token 控制降低 API 费用
5. **可组合**: `@guidance` 装饰器支持函数复用与组合

## 典型应用场景

- **多轮对话编排**: 复杂 Agent 对话流程控制
- **结构化数据提取**: 从非结构化文本中提取 JSON/XML
- **RAG Pipeline**: 检索→生成→验证的自动化流程
- **评估 Pipeline**: 批量生成测试用例并收集结构化结果
- **代码生成**: 多步代码生成与自审查流程

## 与 AI Stack 的集成

在 AI Stack 中，Guidance 主要应用于：

1. **vLLM/SGLang** — 结合推理引擎的 Token 流式输出，在生成过程中施加模板约束
2. **Agent 框架** — 作为 LangGraph/AutoGen 等 Agent 框架的底层 Prompt 编排层
3. **评估系统** — 与 ragas/deepeval 配合，生成结构化的评估结果
4. **Guardrails** — 与 Guardrails AI 配合，在生成过程中嵌入安全检查逻辑

## 安装与快速开始

```bash
pip install guidance
```

```python
import guidance
from guidance import models, gen, select

# 本地模型
lm = models.LlamaCpp("path/to/model.gguf")

# 或 OpenAI
lm = models.OpenAI("gpt-4")

# 简单模板
lm += "分类以下文本的情感：\n"
lm += "文本: '这个产品太棒了'\n"
lm += "情感: " + select(["正面", "负面", "中性"], name="sentiment")
print(lm["sentiment"])  # "正面"
```

## 在 K8s 生产环境中的注意事项

- **无状态服务**: Guidance 本身是无状态的模板引擎，可水平扩展
- **模型加载**: 本地模型需挂载到 Pod 的 PVC 或使用 Init Container 下载
- **GPU 资源**: 本地推理需分配 GPU（nvidia.com/gpu: 1）
- **API Key 管理**: OpenAI 等云端模型通过 K8s Secret 管理

## 参考资源

- [Guidance GitHub](https://github.com/microsoft/guidance)
- [Guidance 文档](https://guidance.readthedocs.io/)
- [示例 Notebooks](https://github.com/microsoft/guidance/tree/main/notebooks)

## 相关概念

- [[概念/outlines]] — Outlines 结构化 LLM 生成
- [[概念/lm-format-enforcer]] — LLM 输出格式约束
- [[概念/promptfoo]] — Promptfoo Prompt 测试框架
- [[概念/guardrails-ai]] — Guardrails AI 安全防护框架

---

## 2026 Guidance 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **模板语法** | Handlebars 风格 Prompt 模板 + 逻辑控制 | GA |
| **结构化输出** | 强制 LLM 输出符合 JSON Schema | GA |
| **多轮对话管理** | 内置角色切换与上下文管理 | GA |
| **Token 级控制** | 逐 token 约束生成空间 | GA |
| **多后端支持** | OpenAI/HF/vLLM/Ollama 统一接口 | GA |

## 生产最佳实践

1. **模板复用**：将常用 Prompt 封装为 Guidance 模板，避免重复编写
2. **约束优先**：用结构化输出约束代替自由生成，提高可靠性
3. **版本管理**：模板纳入 Git 管理，变更走审核流程
4. **测试覆盖**：为每个模板编写测试用例，验证输出格式正确性
5. **性能监控**：跟踪模板渲染延迟和 token 消耗，优化成本

## Guidance vs Outlines vs LMQL 对比

| 维度 | Guidance | Outlines | LMQL |
|------|----------|----------|------|
| 定位 | 模板引擎 | 约束解码 | 查询语言 |
| 语法 | Handlebars | Python API | 类 SQL |
| 约束类型 | 语法/正则 | 有限状态机 | 多类型 |
| 性能 | 中 | 高 | 中 |
| 学习曲线 | 低 | 中 | 中 |
| 适用场景 | 结构化输出 | JSON/枚举 | 复杂查询 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 输出不符合约束 | 模板设计不当 | 简化约束 + 分步生成 |
| 生成速度慢 | 约束检查开销 | 使用 Outlines 加速 |
| 与模型不兼容 | 分词器差异 | 确认模型支持 |
| 调试困难 | 黑盒生成 | 启用详细日志 |

## 生产检查清单

1. ✅ 约束设计简洁明确
2. ✅ 输出格式验证
3. ✅ 性能监控（延迟/token）
4. ✅ 与推理引擎集成测试
5. ✅ 错误处理和重试逻辑
6. ✅ 定期评估约束覆盖率
