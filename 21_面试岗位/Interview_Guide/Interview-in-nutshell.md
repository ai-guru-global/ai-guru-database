---
title: "面试岗位速览 (AI Interview in a Nutshell)"
category: 21-interviews
tags: [interview, career, job-roles, system-design, question-bank, preparation]
summary: "AI 求职全景速览：24 类岗位地图、能力矩阵、面试流程拆解、系统设计与题库入口，以及 3 个月备战计划。"
created: 2026-07-27
updated: 2026-07-27
tier: supporting
aliases:
  - "AI Interview in nutshell"
  - "面试岗位速览"
sources: []

name_zh: "面试岗位速览"
---
# 面试岗位速览 (AI Interview in a Nutshell)

> 中文简称：面试岗位速览

> **一句话理解**: AI 面试的本质是"岗位匹配"——先搞清楚目标岗位考什么，再针对性补短板，比盲刷一千道题有效得多。

---

## TL;DR

- **24 类岗位**: 从算法研究到平台工程，本章按岗位建目录，每个岗位有独立题库
- **四大能力轴**: 算法/模型能力、工程/系统能力、数据能力、业务/沟通能力——岗位不同权重不同
- **面试四轮标配**: 编程题 → ML/LLM 基础 → 系统设计 → 行为面（BQ）
- **2026 新趋势**: Agent 工程师、AI 评估工程师等新岗位崛起；LLM 应用经验成为通用加分项
- **备战节奏**: 3 个月足够——第 1 月补基础，第 2 月刷题+项目包装，第 3 月模拟面试
- **选岗策略**: 研究岗看论文，工程岗看系统，应用岗看产品 sense

```mermaid
flowchart TB
    subgraph 研究线
        RS[Research Scientist] --> RE[Research Engineer]
    end
    subgraph 工程线
        MLE[ML Engineer] --> LLMP[LLM Platform Engineer]
        MLE --> MLOPS[MLOps Engineer]
    end
    subgraph 应用线
        AGE[Agent Engineer] --> PE[Prompt Engineer]
        AGE --> PM[AI Product Manager]
    end
    subgraph 保障线
        EVAL[AI Evaluation Engineer] --> SAFE[AI Safety Engineer]
        SRE[AI Reliability Engineer] --> SEC[AI Security Engineer]
    end
    研究线 -.论文/数学.-> 工程线
    工程线 -.系统/部署.-> 应用线
```

---

## 1. 岗位地图速查

| 赛道 | 岗位 | 核心考察 | 入口 |
|------|------|----------|------|
| 研究 | Research Scientist / Applied Scientist | 论文、数学推导、实验设计 | [[21_面试岗位/Research_Scientist\|研究科学家]] |
| 算法工程 | Machine Learning Engineer | ML 基础 + 编程 + 系统设计 | [[21_面试岗位/Machine_Learning_Engineer/index\|MLE]] |
| LLM 平台 | LLM Platform Engineer | 推理优化、分布式、GPU | [[21_面试岗位/LLM_Platform_Engineer\|LLM 平台工程师]] |
| 智能体 | Agent Engineer | Agent 架构、工具调用、RAG | [[21_面试岗位/Agent_Engineer/Agent_Engineer_2026\|Agent 工程师]] |
| 运维 | MLOps Engineer / Cloud Ops | 流水线、监控、成本 | [[21_面试岗位/MLOps_Engineer\|MLOps]] |
| 数据 | Data Engineer / Data Scientist | SQL、管道、统计与实验 | [[21_面试岗位/Data_Scientist\|数据科学家]] |
| 评估安全 | Evaluation / Safety / Security | 评测体系、红队、对齐 | [[21_面试岗位/AI_Evaluation_Engineer\|评估工程师]] |
| 产品 | AI Product Manager | 产品 sense、AI 能力边界 | [[21_面试岗位/AI_Product_Manager\|AI 产品经理]] |

> 完整 24 岗位列表见 [[21_面试岗位/index|章节首页]]。

---

## 2. 四轮面试拆解

| 轮次 | 考什么 | 准备要点 |
|------|--------|----------|
| 编程题 | LeetCode 中等为主 + ML 场景编码 | 数组/哈希/DP 高频；会手写 attention 加分 |
| ML/LLM 基础 | 过拟合、Transformer、RLHF、RAG | 能画图讲清反向传播和 KV Cache |
| 系统设计 | 设计推荐系统/RAG 服务/训练平台 | 套路：需求澄清→容量估算→架构→瓶颈→演进 |
| 行为面 (BQ) | 项目深挖、冲突处理、失败复盘 | STAR 法则；每个项目准备"三层追问"答案 |

系统设计专项: [[21_面试岗位/Interview_Guide/System_Design_for_AI|AI 系统设计指南]]

---

## 3. 能力权重矩阵

| 岗位 | 算法/模型 | 工程/系统 | 数据 | 业务/沟通 |
|------|-----------|-----------|------|-----------|
| Research Scientist | ★★★★★ | ★★ | ★★★ | ★★ |
| ML Engineer | ★★★★ | ★★★★ | ★★★ | ★★ |
| LLM Platform Engineer | ★★★ | ★★★★★ | ★★ | ★★ |
| Agent Engineer | ★★★ | ★★★★ | ★★ | ★★★ |
| MLOps Engineer | ★★ | ★★★★★ | ★★★ | ★★ |
| AI Product Manager | ★★ | ★★ | ★★★ | ★★★★★ |

> 用法：对照目标岗位，把最弱的一轴补到"不拖后腿"，把最强的一轴打磨成"记忆点"。

---

## 4. 3 个月备战计划

| 月份 | 目标 | 关键动作 |
|------|------|----------|
| 第 1 月 | 补基础 | ML/DL 核心概念过一遍 + 每天 2 道编程题 |
| 第 2 月 | 项目 + 题库 | 包装 1-2 个 LLM/Agent 项目 + 刷目标岗位题库 |
| 第 3 月 | 模拟实战 | 每周 2 次 mock interview + 复盘错题 + 投递 |

- 完整准备指南: [[21_面试岗位/Interview_Guide/Interview_Preparation|面试准备指南]]
- 面经与真题记录: [[21_面试岗位/Interview_Guide/career-interviews|求职面经]]
- 笔记模板: [[21_面试岗位/Interview_Guide/interview_notes_template|面试笔记模板]]

---

## 5. 2026 求职趋势

1. **Agent 经验通吃**: 有 Agent/RAG 生产项目的候选人在所有应用岗都占优
2. **评估能力稀缺**: AI Evaluation Engineer 供需缺口最大，转岗窗口期
3. **全栈化**: 纯调参岗萎缩，"模型 + 工程 + 产品"复合型吃香
4. **开源作品 > 刷题记录**: 高质量 GitHub 仓库/技术博客成为简历硬通货
5. **岗位市场全景**: [[21_面试岗位/Interview_Guide/jobs|岗位与市场观察]]

---

## 延伸阅读 (Further Reading)

| 主题 | 说明 | 入口 |
|------|------|------|
| 岗位全表 | 24 类岗位完整导航 | [[21_面试岗位/index|面试岗位首页]] |
| 零基础版 | 小白求职指引 | [[21_面试岗位/Interview_Guide/Interviews_for_dummy|面试小白指南]] |
| 系统设计 | AI 系统设计专项 | [[21_面试岗位/Interview_Guide/System_Design_for_AI|System Design for AI]] |

---

*Last updated: 2026-07-27*

## 相关链接

- [[21_面试岗位/index|面试岗位首页]] — 章节总览
- [[21_面试岗位/README_for_dummy|面试岗位小白指南]] — 零基础版
- [[90_学习/index|学习中心]] — 备战学习路径
- [[15_智能体/index|智能体]] — Agent 岗位技术栈
- [[05_大模型/index|大模型]] — LLM 岗位技术栈
