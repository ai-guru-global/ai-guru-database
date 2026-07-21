---
title: 提示词工程师 (Prompt Engineer)
category: 06-career
tags: ["prompt-engineer", "job-role", "skills", "salary", "career"]
summary: "提示词工程师岗位完整解析：职责定义、核心技能（Prompt设计/评估/优化）、2026 薪资数据、面试要点、职业发展路径。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 提示词工程师 (Prompt Engineer)

## 1. 岗位定义

```
提示词工程师 = 设计/优化/评估 LLM 输入的专业人员

2026 现状:
- 独立岗位减少，能力融入 AI 工程师/产品经理
- 但 Prompt 技能仍是 AI 从业者的核心能力
- 高端: AI 对齐/安全方向仍需 Prompt 专家

核心职责:
1. 设计: 为业务场景设计最优 Prompt
2. 优化: 迭代改进 Prompt 提升效果
3. 评估: 建立评估体系量化 Prompt 质量
4. 管理: Prompt 版本管理/A/B 测试
5. 培训: 培训团队 Prompt 技巧
```

## 2. 核心技能

```python
PROMPT_ENGINEER_SKILLS = {
    "必备": [
        "LLM 原理理解 (Transformer/注意力/采样)",
        "Prompt 设计模式 (CoT/Few-shot/Role-play)",
        "评估方法 (人工/自动/LLM-as-Judge)",
        "Python 编程 (自动化测试)",
    ],
    "进阶": [
        "RAG 架构 (检索增强生成)",
        "Agent 设计 (工具调用/多步推理)",
        "微调基础 (何时用 Prompt vs 微调)",
        "安全 (注入防御/输出控制)",
    ],
    "软技能": [
        "业务理解 (将需求转化为 Prompt)",
        "实验思维 (假设→验证→迭代)",
        "沟通 (向非技术人员解释 AI 限制)",
    ],
}
```

## 3. 薪资与需求

| 地区 | 初级 | 中级 | 高级 | 需求趋势 |
|------|------|------|------|----------|
| 中国一线 | 15-25万 | 25-50万 | 50-80万 | 融入AI工程师 |
| 美国 | $80-120K | $120-180K | $180-300K | 稳定 |
| 远程 | $60-100K | $100-150K | $150-250K | 增长 |

## 4. 面试要点

```python
INTERVIEW_TOPICS = {
    "设计题": [
        "设计一个客服 Prompt (含角色/约束/格式)",
        "如何让 LLM 稳定输出 JSON?",
        "多轮对话中如何保持上下文?",
    ],
    "优化题": [
        "回答太啰嗦怎么优化?",
        "幻觉率太高怎么解决?",
        "如何让输出更一致 (降低随机性)?",
    ],
    "评估题": [
        "如何评估 Prompt 效果?",
        "如何设计 A/B 测试?",
        "LLM-as-Judge 的局限性?",
    ],
    "安全题": [
        "如何防御 Prompt 注入?",
        "如何限制输出范围?",
        "敏感信息如何脱敏?",
    ],
}
```

## 5. 交叉引用

- [[面试岗位/|面试岗位]]
- [[大模型/Prompt_Engineering/|Prompt Engineering]]
- [[入门/AI_Career_Guide/AI_Career_Guide|AI 职业指南]]
- [[面试岗位/Interview_Preparation/|面试准备]]
- [[测试/|测试 (Prompt 评估)]]
