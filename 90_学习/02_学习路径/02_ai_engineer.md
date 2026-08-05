---
title: "AI 工程师学习路径 (AI Engineer Learning Path)"
category: 90-learn-pathways
tags: ["learning", "ai-engineer", "career", "roadmap", "skills"]
summary: "AI 工程师是 2026 年最热门的职业之一——从基础技能到高级实践，系统规划 AI 工程师的成长路径。"
created: 2026-07-02
updated: 2026-07-02
tier: core
aliases:
  - "AI Engineer Path"
  - "AI Engineer Learning Path"
  - ai-engineer-path
sources: []

name_zh: "AI 工程师学习路径"
---
# AI 工程师学习路径 (AI Engineer Learning Path)

> 中文简称：AI 工程师学习路径

> AI 工程师是 2026 年最热门的职业之一——从基础技能到高级实践，系统规划 AI 工程师的成长路径。

---

## 1. 概述 (Overview)

AI 工程师（AI Engineer）是介于 ML 研究员和软件工程师之间的角色——不需要从零训练模型，但需要将 AI 模型集成到生产系统中。2025-2026 年，随着 LLM 和 Agent 的普及，AI 工程师成为需求增长最快的技术岗位。

### AI 工程师 vs 相关角色

| 角色 | 核心工作 | 技能重点 | 代表公司 |
|------|---------|---------|---------|
| **ML 研究员** | 算法创新 | 数学、论文 | DeepMind, OpenAI |
| **ML 工程师** | 模型训练 | 训练框架、分布式 | Google, Meta |
| **AI 工程师** | 应用集成 | API、框架、部署 | 创业公司、企业 |
| **数据工程师** | 数据管道 | ETL、数据仓库 | 所有公司 |
| **MLOps 工程师** | 模型运维 | CI/CD、监控 | 大型公司 |

### AI 工程师的核心能力

```
1. LLM 应用开发
   - Prompt Engineering
   - RAG 系统
   - Agent 开发
   - 工具调用

2. 工程能力
   - API 集成
   - 系统设计
   - 性能优化
   - 生产部署

3. 领域知识
   - 理解 AI 能力边界
   - 知道何时用 AI，何时不用
   - 评估 AI 输出质量
```

---

## 2. 学习路径 (Learning Path)

### 阶段 1: 基础入门 (1-2 个月)

```
目标: 理解 AI 基本概念，能使用 AI API

学习内容:
├── Python 编程基础
│   ├── 变量、函数、类
│   ├── 文件操作
│   └── 常用库 (requests, json, os)
│
├── AI 基本概念
│   ├── 什么是 LLM
│   ├── 什么是 Prompt
│   ├── 什么是 Embedding
│   └── 什么是 RAG
│
├── API 使用
│   ├── OpenAI API
│   ├── Claude API
│   └── 国产模型 API (DeepSeek, Qwen)
│
└── Prompt Engineering
    ├── 基础提示技巧
    ├── Few-shot 学习
    └── 输出格式控制

推荐资源:
  - [[00_入门/AI_Fundamentals_for_dummy]]
  - [[01_数学基础/Python_for_AI_Basics]]
  - [[05_大模型/08_提示工程/Prompt_Engineering_for_dummy]]
  - DeepLearning.AI 短课程
```

### 阶段 2: 核心技能 (2-3 个月)

```
目标: 掌握 RAG 和 Agent 开发

学习内容:
├── RAG 系统
│   ├── 向量数据库 (Chroma, Pinecone)
│   ├── Embedding 模型
│   ├── 检索策略
│   └── 评估方法 (RAGAS)
│
├── Agent 开发
│   ├── LangChain 基础
│   ├── 工具调用
│   ├── 记忆系统
│   └── 多 Agent 协作
│
├── 模型微调
│   ├── LoRA/QLoRA
│   ├── 数据准备
│   └── 评估方法
│
└── 项目实践
    ├── 构建一个 RAG 应用
    ├── 构建一个 Agent
    └── 部署到生产环境

推荐资源:
  - [[14_RAG系统/RAG_Systems_for_dummy]]
  - [[15_智能体/01_Agent基础/Agent_Foundations]]
  - [[15_智能体/02_Agent框架/Agent_Frameworks]]
  - [[05_大模型/07_微调技术/Fine_tuning_Techniques_for_dummy]]
```

### 阶段 3: 工程深化 (3-6 个月)

```
目标: 掌握生产级 AI 系统开发

学习内容:
├── 系统设计
│   ├── AI 系统架构
│   ├── 可扩展性设计
│   └── 成本优化
│
├── 部署运维
│   ├── 模型服务 (vLLM, Triton)
│   ├── 容器化 (Docker, K8s)
│   ├── 监控告警
│   └── A/B 测试
│
├── 安全与合规
│   ├── 提示注入防护
│   ├── 输出过滤
│   ├── 数据隐私
│   └── 合规要求
│
└── 项目实践
    ├── 构建生产级 RAG 系统
    ├── 构建企业级 Agent
    └── 优化系统性能和成本

推荐资源:
  - [[10_部署推理/Deployment_Inference_for_dummy]]
  - [[11_模型运维/MLOps_Pipeline_for_dummy]]
  - [[17_伦理安全/Agent_Security_Ethics_AGI]]
  - [[12_架构基建/Architecture_Infrastructure_for_dummy]]
```

### 阶段 4: 高级专家 (6-12 个月)

```
目标: 成为 AI 架构师或技术负责人

学习内容:
├── 前沿技术
│   ├── 多模态 Agent
│   ├── 长上下文处理
│   ├── 推理优化
│   └── 自定义模型训练
│
├── 架构设计
│   ├── 企业 AI 平台
│   ├── 多模型编排
│   ├── 成本治理
│   └── 技术选型
│
├── 团队协作
│   ├── 技术方案设计
│   ├── 代码审查
│   └── 技术分享
│
└── 行业洞察
    ├── 跟踪最新论文
    ├── 评估新技术
    └── 技术趋势判断
```

---

## 3. 技能清单 (Skill Checklist)

### 必备技能

```
编程:
  [x] Python 熟练
  [x] JavaScript/TypeScript 基础
  [x] SQL 基础
  [x] Git 使用

AI 基础:
  [x] LLM 原理理解
  [x] Prompt Engineering
  [x] Embedding 和向量数据库
  [x] RAG 系统开发

工程能力:
  [x] API 开发 (FastAPI, Flask)
  [x] 容器化 (Docker)
  [x] 云服务 (AWS/GCP/Azure)
  [x] 版本控制 (Git)

框架:
  [x] LangChain / LangGraph
  [x] 向量数据库 (Chroma/Pinecone)
  [x] 模型 API (OpenAI/Claude/DeepSeek)
```

### 加分技能

```
高级:
  [ ] 模型微调 (LoRA/QLoRA)
  [ ] 分布式训练
  [ ] 模型优化 (量化、蒸馏)
  [ ] Kubernetes 运维

专业:
  [ ] 多模态 AI
  [ ] Agent 安全
  [ ] AI 产品设计
  [ ] 技术写作
```

---

## 4. 项目建议 (Project Ideas)

### 入门项目

```
1. 智能文档问答
   - 技术: RAG + 向量数据库
   - 功能: 上传文档，问答
   - 学习: Embedding、检索、生成

2. 个人 AI 助手
   - 技术: Agent + 工具调用
   - 功能: 日程管理、信息检索
   - 学习: Agent 设计、工具集成

3. 代码审查助手
   - 技术: LLM + Git 集成
   - 功能: 自动代码审查
   - 学习: 代码理解、提示设计
```

### 进阶项目

```
1. 企业知识库
   - 技术: RAG + 权限管理
   - 功能: 多文档检索、权限控制
   - 学习: 系统设计、安全

2. 多 Agent 协作系统
   - 技术: 多 Agent + 工作流
   - 功能: 复杂任务分解和协作
   - 学习: Agent 编排、状态管理

3. AI 应用平台
   - 技术: 全栈 + AI
   - 功能: 低代码 AI 应用构建
   - 学习: 产品设计、系统架构
```

---

## 5. 求职建议 (Job Hunting)

```
简历准备:
  - 突出 AI 项目经验
  - 量化项目成果
  - 展示技术深度

面试准备:
  - AI 基础概念
  - 系统设计题
  - 代码实现题
  - 项目经验讨论

持续学习:
  - 跟踪最新论文
  - 参与开源项目
  - 技术博客写作
  - 社区分享
```

---

## 相关阅读

- [[90_学习/02_学习路径/08_llm_engineer]] — LLM 工程师路径
- [[90_学习/02_学习路径/09_ml_practitioner]] — ML 实践者路径
- [[90_学习/04_实践指南/02_AI工程路线图2026]] — AI 工程路线图
- [[90_学习/04_实践指南/05_learning_paths_2026]] — 学习路径 2026
- [[21_面试岗位/AI_Product_Manager//index]] — AI 产品经理面试
- [[21_面试岗位/Machine_Learning_Engineer//index]] — ML 工程师面试
