---
title: AI 职业指南 (AI Career Guide)
category: 06-learning
tags: ["career", "job-roles", "skills", "learning-path", "salary"]
summary: "AI 职业完整指南：2026 热门岗位（ML工程师/LLM工程师/Agent开发者/MLOps）、技能树、学习路径、薪资数据、转型建议。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# AI 职业指南 (AI Career Guide)

## 1. 2026 AI 岗位全景

```
热门岗位 (按需求排序):

1. LLM/AI 应用工程师
   - 职责: 基于 LLM API 构建应用 (RAG/Agent/Chatbot)
   - 技能: Python + LangChain/LlamaIndex + Prompt Engineering
   - 门槛: 中 (不需要训练模型)
   - 薪资: 30-80万 (中国) / $120-200K (美国)

2. ML 工程师
   - 职责: 模型训练/微调/部署/优化
   - 技能: PyTorch + 分布式训练 + MLOps
   - 门槛: 高
   - 薪资: 40-100万 / $150-300K

3. Agent 开发者
   - 职责: 设计和构建 AI Agent 系统
   - 技能: LLM + 工具调用 + 状态管理 + 评估
   - 门槛: 中高
   - 薪资: 35-90万 / $130-250K

4. MLOps/平台工程师
   - 职责: AI 基础设施/训练平台/推理服务
   - 技能: K8s + GPU + 分布式系统
   - 门槛: 高
   - 薪资: 40-100万 / $150-280K

5. AI 产品经理
   - 职责: AI 产品规划/需求/落地
   - 技能: 产品思维 + AI 理解 + 行业知识
   - 门槛: 中
   - 薪资: 30-70万 / $120-200K

6. 数据工程师/标注管理
   - 职责: 数据管道/标注质量/数据治理
   - 门槛: 中低
   - 薪资: 20-50万 / $80-150K
```

## 2. 技能树

```python
AI_SKILL_TREE = {
    "基础 (所有岗位)": [
        "Python 编程",
        "线性代数/概率/统计",
        "机器学习基础",
        "深度学习基础 (Transformer)",
    ],
    "LLM 应用工程师": [
        "Prompt Engineering",
        "RAG 架构 (向量数据库/检索)",
        "Agent 框架 (LangChain/CrewAI)",
        "API 集成/后端开发",
        "评估与测试",
    ],
    "ML 工程师": [
        "PyTorch 深入",
        "分布式训练 (FSDP/DeepSpeed)",
        "模型微调 (LoRA/RLHF)",
        "推理优化 (量化/vLLM)",
        "实验管理 (W&B)",
    ],
    "MLOps 工程师": [
        "Kubernetes/Docker",
        "GPU 集群管理",
        "CI/CD for ML",
        "监控/可观测性",
        "云平台 (AWS/GCP/Azure)",
    ],
}
```

## 3. 学习路径

```python
LEARNING_PATHS = {
    "零基础 → LLM 应用 (6个月)": [
        "月1-2: Python + ML 基础 (吴恩达课程)",
        "月3: 深度学习 + Transformer",
        "月4: LLM API + Prompt Engineering",
        "月5: RAG + Agent 实战项目",
        "月6: 完整项目 + 面试准备",
    ],
    "程序员 → AI 工程师 (3个月)": [
        "月1: ML/DL 基础 + PyTorch",
        "月2: LLM 微调 + RAG + Agent",
        "月3: 部署 + 项目 + 面试",
    ],
    "传统 ML → LLM (2个月)": [
        "月1: Transformer + LLM 架构 + 微调",
        "月2: RAG/Agent + 推理优化 + 项目",
    ],
}
```

## 4. 交叉引用

- [[入门/|入门]]
- [[学习/|学习]]
- [[面试岗位/|面试岗位]]
- [[面试岗位/Interview_Preparation/|面试准备]]
- [[入门/AI_Tools_Landscape/|AI 工具全景]]
