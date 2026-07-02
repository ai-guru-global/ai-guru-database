---
title: "百炼专属版 (Bailian Exclusive Edition)"
category: -concepts
tags: ["bailian", "ai-stack", "rag", "agent-platform", "alibaba-cloud", "workflow"]
relationships:
  - target: "_concepts/ai-architecture"
    type: related_to
  - target: "_concepts/rag-systems"
    type: related_to
  - target: "_concepts/ai-agents"
    type: related_to
  - target: "_concepts/a-speed"
    type: related_to
  - target: "_concepts/apsara-stack"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "百炼专属版是阿里云 AI Stack 配套的独立生态方案，提供 MINI/Lite/标准版三个层级，覆盖 RAG 应用、智能体平台、全栈 AI 平台。"
provenance:
  extracted: 0.65
  inferred: 0.25
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: stable
tier: core
---

# 百炼专属版 (Bailian Exclusive Edition)

> **一句话理解**: 百炼专属版是 AI Stack 的"上层建筑"——在推理一体机之上叠加 RAG、智能体、工作流编排等应用能力。

---

## 1. 定位与关系

百炼专属版**不是 AI Stack 内置功能**，而是与 AI Stack 配套的独立生态方案：

```
阿里云 AI Stack 产品体系
│
├── AI Stack 推理一体机（底层基座）
│   ├── A-Speed 加速推理
│   ├── 模型网关 (Synapse)
│   └── 模型仓库 & 推理服务
│
├── 百炼专属版（上层应用）← 本文
│   ├── MINI — 开箱即用 RAG
│   ├── Lite — 轻量智能体平台
│   └── 标准版 — 全栈 AI 平台
│
└── 飞天企业版 Apsara Stack（可选纳管）
    └── 全栈私有云平台
```

---

## 2. 三个版本对比

| 维度 | MINI | Lite | 标准版 |
|------|------|------|--------|
| **定位** | 开箱即用 RAG 应用 | 轻量智能体平台 | 全栈 AI 平台 |
| **核心功能** | 深度思考 + 联网搜索 + 文档 RAG + 多模态问答 | 多模态多智能体 + 知识数据中心 + 工作流编排 | 大模型全栈工具 + 异构 GPU 集群 + 训推加速 |
| **RAG 能力** | 内置文档 RAG | 知识数据中心 | 完整 RAG 流水线 |
| **智能体** | 无 | 多模态多智能体 | 完整 Agent 框架 |
| **工作流** | 无 | 可视化编排 | 复杂工作流引擎 |
| **训练能力** | 无 | 无 | 训推加速 |
| **部署复杂度** | 最低 | 中等 | 最高 |
| **适用规模** | 小型团队 | 中型企业 | 大型企业 |

---

## 3. MINI 版：开箱即用 RAG

### 3.1 四合一能力

| 能力 | 说明 |
|------|------|
| **深度思考** | 基于大模型的推理增强回答 |
| **联网搜索** | 实时互联网信息检索 |
| **文档 RAG** | 企业私有文档检索增强生成 |
| **多模态问答** | 支持图文混合输入输出 |

### 3.2 适用场景

- 快速 PoC 验证：30 分钟内搭建 RAG 应用
- 企业知识库：导入 doc/docx/pdf/txt 文档
- 智能客服：基于文档的问答系统
- 内部搜索：企业信息检索

---

## 4. Lite 版：轻量智能体平台

### 4.1 三大核心

| 模块 | 说明 |
|------|------|
| **多模态多智能体** | 支持多个 AI 智能体协同工作 |
| **知识数据中心** | 集中管理企业知识资产 |
| **工作流编排** | 可视化拖拽式流程设计 |

### 4.2 智能体能力

```
百炼专属版 Lite 智能体架构
│
├── 智能体类型
│   ├── 对话型 — 多轮对话、意图识别
│   ├── 任务型 — 流程执行、API 调用
│   └── 分析型 — 数据分析、报告生成
│
├── 协作模式
│   ├── 串行 — A → B → C 流水线
│   ├── 并行 — A + B 同时执行
│   └── 路由 — 按条件分发到不同智能体
│
└── 知识源
    ├── 结构化数据 — 数据库、表格
    ├── 非结构化文档 — PDF、Word、TXT
    └── API 数据 — 外部系统接口
```

---

## 5. 标准版：全栈 AI 平台

### 5.1 完整能力栈

| 层次 | 能力 |
|------|------|
| **模型层** | 模型管理、多精度推理、训推加速 |
| **工具层** | Prompt 工程、微调、评测、部署 |
| **应用层** | 智能体、RAG、工作流、多模态 |
| **基础设施** | 异构 GPU 集群、算力调度、监控 |

### 5.2 与 AI Stack 的集成

| 集成点 | 说明 |
|--------|------|
| 模型部署 | 通过 AI Stack A-Speed 加速部署 |
| 模型网关 | 复用 Synapse 负载均衡 |
| GPU 资源 | 共享 AI Stack GPU 集群 |
| 用户管理 | 统一 RBAC 权限体系 |

---

## 6. 与公有云百炼的关系

| 维度 | 百炼（公有云） | 百炼专属版（私有化） |
|------|---------------|---------------------|
| **部署环境** | 阿里云公有云 | 企业私有环境 |
| **数据安全** | 云端处理 | 数据不出企业 |
| **模型选择** | 全量模型市场 | 精选预置模型 |
| **定价模式** | 按量计费 | 一体机打包 |
| **适用客户** | 中小企业、开发者 | 政企、金融、医疗 |
| **网络要求** | 公网访问 | 内网隔离 |

---

## 7. 行业落地案例

| 行业 | 方案 | 效果 |
|------|------|------|
| **医疗** | AI Stack + 百炼专属版 Lite | 三甲医院 AI 中台，"智能问数"场景落地 |
| **政务** | AI Stack + 百炼 MINI | 卫健委数据治理与决策智能化 |
| **制造** | 钉钉 + AI Stack 场景化一体机 | 生产/销售/研发/管理数智化 |
| **金融** | AI Stack + 百炼标准版 | 智能编码、AI 金融服务融合 |

---

## 8. 选型决策树

```
百炼专属版选型
│
├── 只需要文档问答？ → MINI
│   └── 预算有限、快速上线
│
├── 需要智能体 + 工作流？ → Lite
│   └── 多场景应用、中等复杂度
│
└── 需要全栈 AI 能力？ → 标准版
    └── 大规模部署、训推一体、完整工具链
```

---

## Related

- [[_concepts/ai-architecture]] — AI 系统架构
- [[_concepts/rag-systems]] — RAG 系统
- [[_concepts/ai-agents]] — AI 智能体
- [[_concepts/a-speed]] — A-Speed 加速推理
- [[_concepts/apsara-stack]] — 飞天企业版
- [[_concepts/model-gateway]] — 模型网关
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack 深度解析
