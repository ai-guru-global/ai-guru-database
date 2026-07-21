---
title: AI 面试准备 (Interview Preparation)
category: 06-career
tags: ["interview", "algorithm", "system-design", "behavioral", "preparation"]
summary: "AI 面试准备完整指南：算法题（ML相关）、系统设计（LLM系统/RAG/Agent）、行为面试、2026 真实面试题、准备策略。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# AI 面试准备 (Interview Preparation)

## 1. 面试流程

```
AI 工程师典型面试流程:

1. 简历筛选 → 2. 技术电话面 (30min)
→ 3. 编码面 (算法/ML实现, 60min)
→ 4. 系统设计面 (AI系统, 60min)
→ 5. 专业面 (ML/DL/LLM 深度, 60min)
→ 6. 行为面 (文化匹配, 45min)
→ 7. 终面 (总监/VP)

准备时间: 4-8 周 (有基础) / 3-6 月 (转行)
```

## 2. 算法与编码

```python
CODING_INTERVIEW_TOPICS = {
    "ML 实现": [
        "手写 K-Means / KNN / 线性回归",
        "实现 Softmax / Cross-Entropy",
        "实现简单的神经网络前向/反向传播",
        "实现 Beam Search / Top-k 采样",
    ],
    "数据结构": [
        "数组/链表/树/图 (基础)",
        "堆 (Top-k 问题)",
        "哈希表 (去重/计数)",
        "动态规划 (序列对齐/编辑距离)",
    ],
    "Python 技巧": [
        "生成器/迭代器 (数据流处理)",
        "装饰器 (日志/缓存)",
        "并发 (asyncio/threading)",
    ],
}
```

## 3. 系统设计

```python
SYSTEM_DESIGN_QUESTIONS = [
    "设计一个 RAG 系统 (百万文档)",
    "设计一个 LLM 推理服务 (高并发/低延迟)",
    "设计一个 AI 客服系统 (多轮/多语言)",
    "设计一个推荐系统 (实时/个性化)",
    "设计一个模型训练平台 (分布式/多租户)",
    "设计一个 Agent 编排系统",
]

# 回答框架:
SYSTEM_DESIGN_FRAMEWORK = {
    "1. 需求澄清": "用户量/QPS/延迟/可用性",
    "2. 高层设计": "核心组件 + 数据流",
    "3. 详细设计": "每个组件的技术选型",
    "4. 扩展性": "如何从 1K → 1M 用户",
    "5. 权衡": "一致性 vs 可用性 / 成本 vs 性能",
}
```

## 4. ML/DL/LLM 专业题

```python
TECHNICAL_QUESTIONS = {
    "ML 基础": [
        "偏差-方差权衡? 如何诊断?",
        "L1 vs L2 正则化? 为什么 L1 产生稀疏?",
        "决策树 vs 随机森林 vs GBDT?",
    ],
    "深度学习": [
        "Transformer 自注意力机制? 为什么除以 √d?",
        "BatchNorm vs LayerNorm? 为什么 LLM 用 LayerNorm?",
        "梯度消失/爆炸? 如何解决?",
    ],
    "LLM": [
        "KV Cache 原理? 为什么能加速推理?",
        "LoRA 原理? 为什么低秩有效?",
        "RLHF vs DPO? 各自优劣?",
        "RAG vs 微调? 如何选择?",
        "幻觉的原因和缓解方法?",
    ],
    "2026 新题": [
        "MoE 架构的负载均衡问题?",
        "推理模型 (o3/R1) 的训练方法?",
        "Agent 的评估方法?",
        "多模态模型的架构设计?",
    ],
}
```

## 5. 准备策略

```python
PREP_STRATEGY = {
    "4 周计划": {
        "第1周": "算法刷题 (LeetCode Medium, 每天2题)",
        "第2周": "ML/DL 理论复习 + 论文精读",
        "第3周": "系统设计练习 (每天1题)",
        "第4周": "模拟面试 + 行为面准备",
    },
    "资源": [
        "算法: LeetCode / 剑指 Offer",
        "ML: 吴恩达课程 / 统计学习方法",
        "LLM: 本知识库大模型章节",
        "系统设计: 本知识库架构基建章节",
        "行为面: STAR 方法准备 5-8 个故事",
    ],
}
```

## 6. 交叉引用

- [[面试岗位/|面试岗位]]
- [[面试岗位/Prompt_Engineer/Prompt_Engineer|提示词工程师]]
- [[入门/AI_Career_Guide/AI_Career_Guide|AI 职业指南]]
- [[大模型/|大模型 (LLM 面试题)]]
- [[架构基建/|架构基建 (系统设计)]]
