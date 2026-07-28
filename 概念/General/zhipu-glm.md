---
title: "智谱 AI / GLM 模型系列 (Zhipu AI & GLM Model Family)"
category: -concepts
tags: ["zhipu", "glm", "chatglm", "chinese-llm", "tsinghua", "ai-stack"]
relationships:
  - target: "概念/llm-architectures"
    type: related_to
  - target: "概念/deepseek-models"
    type: related_to
  - target: "概念/moonshot-kimi"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "智谱 AI（ZhipuAI）是清华大学背景的 AI 公司，GLM 系列模型（ChatGLM 起家）是中国最早开源的大模型之一。AI Stack 预置 GLM-5.1/GLM5 系列。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
name_zh: "智谱 AI / GLM 模型系列"
---

# 智谱 AI / GLM 模型系列

> 中文简称：智谱 AI / GLM 模型系列

> **一句话理解**: 智谱 AI 是"学院派开源先锋"——背靠清华大学 NLP 实验室，ChatGLM 是中国最早开源的大模型之一，GLM-5.1 是最新旗舰。

---

## 1. 公司概况

| 维度 | 信息 |
|------|------|
| **公司名** | 智谱 AI (Zhipu AI) |
| **背景** | 清华大学 NLP 实验室孵化 |
| **核心人物** | 唐杰（清华大学教授） |
| **成立时间** | 2019 年 |
| **核心产品** | GLM 系列模型、BigModel 平台 |
| **开源贡献** | ChatGLM-6B（最早中文开源模型之一） |

---

## 2. GLM 模型演进

| 模型 | 时间 | 特点 |
|------|------|------|
| **ChatGLM-6B** | 2023.03 | 中国最早开源大模型之一 |
| **ChatGLM2-6B** | 2023.06 | 上下文 32K |
| **ChatGLM3-6B** | 2023.10 | 工具调用、代码生成 |
| **GLM-4** | 2024.01 | 128K 上下文、多模态 |
| **GLM-5** | 2024.xx | 新一代架构 |
| **GLM-5.1** | 2025.xx | 最新旗舰版 |

---

## 3. AI Stack 预置模型

| 模型 | 精度 | 说明 |
|------|------|------|
| **GLM-5.1-INT8** | INT8 | GLM-5.1 量化版 |
| **GLM5-INT8** | INT8 | GLM5 量化版 |
| **GLM-5.1-W4A8** | W4A8 | 4-bit 权重 + 8-bit 激活 |

### W4A8 量化说明

| 标记 | 含义 |
|------|------|
| W4 | 权重 4-bit 量化 |
| A8 | 激活值 8-bit 量化 |
| 效果 | 显存约为 BF16 的 25%，精度退化 ~2% |

---

## 4. GLM 架构特点

| 特点 | 说明 |
|------|------|
| **GLM 架构** | General Language Model，自回归填空预训练 |
| **Prefix LM** | 前缀语言模型，双向编码 + 自回归解码 |
| **中文优化** | 清华中文语料训练，中文能力强 |
| **工具调用** | 原生支持 Function Calling |

---

## 5. 在中国大模型生态的位置

| 维度 | GLM (智谱) | Qwen (阿里) | DeepSeek | Kimi (Moonshot) |
|------|-----------|------------|----------|----------------|
| **学术根基** | 清华 NLP | 阿里达摩院 | 幻方量化 | 清华交叉 |
| **开源时间** | 2023.03（最早） | 2023.08 | 2024.01 | 部分开源 |
| **核心优势** | 学术+开源平衡 | 全能生态 | 高效开源 | 超长上下文 |
| **商业平台** | BigModel.cn | 百炼平台 | API 服务 | Kimi Chat |

---

## Related

- [[概念/llm-architectures]] — LLM 架构
- [[概念/deepseek-models]] — DeepSeek 系列
- [[概念/moonshot-kimi]] — Moonshot/Kimi 系列
- [[概念/llm-data-engineering]] — LLM 数据工程
- [[12_架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析

---

## 2026 智谱 GLM 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **GLM-4** | 智谱最新大模型 | GA |
| **ChatGLM** | 对话模型 | GA |
| **CodeGeeX** | 代码生成模型 | GA |
| **开源模型** | 开源模型生态 | GA |
| **API 服务** | 模型 API 服务 | GA |

## 生产最佳实践

1. **国产模型**：国产场景考虑智谱 GLM
2. **开源优势**：开源模型可自托管
3. **CodeGeeX**：代码生成用 CodeGeeX
4. **与 DeepSeek 对比**：根据场景选择 GLM 或 DeepSeek
5. **API 调用**：用 API 调用 GLM 模型

## API 调用示例

```python
from zhipuai import ZhipuAI

client = ZhipuAI(api_key="your-key")
response = client.chat.completions.create(
    model="glm-4",
    messages=[{"role": "user", "content": "解释量子计算"}],
    temperature=0.7
)
print(response.choices[0].message.content)
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 中文效果一般 | 模型版本旧 | 升级 GLM-4 |
| API 调用失败 | Key/网络问题 | 检查配置和代理 |
| 开源模型效果差 | 未用指令微调版 | 用 Chat 版本 |
| 显存不足 | 模型太大 | 量化/小模型 |
| 合规问题 | 数据出境 | 自托管部署 |

## 版本兼容性

| 模型 | 状态 | 说明 |
|------|------|------|
| GLM-4 | GA | 最新旗舰 |
| ChatGLM4-9B | GA | 开源 |
| CodeGeeX4 | GA | 代码生成 |
| CogVLM2 | GA | 多模态 |

## 生产检查清单

1. 选择与场景匹配的模型版本
2. 开源模型自托管确保数据安全
3. 监控 API 调用成本和延迟
4. 与 Qwen/DeepSeek 对比评测
5. 配置内容安全过滤
6. 建立模型版本回滚机制

## 总结

智谱 GLM 是国产大模型的重要代表，其开源生态和 CodeGeeX 代码能力是独特优势。对于需要国产化合规和自托管的场景，GLM 是重要选择。

> 💡 智谱 GLM 的定位：国产开源大模型的重要一极，与 Qwen、DeepSeek 共同构成国产 LLM 三强格局。

## GLM 模型系列对比

| 模型 | 参数 | 特色 | 适用场景 |
|------|------|------|----------|
| GLM-4-Plus | 超大 | 旗舰能力 | 复杂任务 |
| GLM-4-Air | 中等 | 性价比 | 日常应用 |
| GLM-4-Flash | 轻量 | 极速 | 高频调用 |
| GLM-4V | 多模态 | 图文理解 | 视觉任务 |
| CodeGeeX | 代码 | 编程助手 | 代码生成 |

## 生产检查清单

1. ✅ 评估 GLM vs Qwen/DeepSeek 场景适配
2. ✅ 使用智谱开放平台 API 或私有化部署
3. ✅ 配置用量限制 + 成本监控
4. ✅ 输入/输出安全护栏
5. ✅ 评估开源版本 vs API 成本效益
6. ✅ 关注国产化合规要求

## 版本兼容性

| 组件 | 版本 | 状态 |
|------|------|------|
| zhipuai SDK | ≥ 2.1 | GA |
| GLM-4 API | v4 | GA |
| ChatGLM 开源 | 4.x | GA |

