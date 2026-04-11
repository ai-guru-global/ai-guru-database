# 概念入门路径 (Concept Learning Path) — 设计文档

## 1. 需求场景

AI Guru 知识库目前包含 **290+ 文档、70+ 技术领域**，内容体量巨大。虽然已有：
- 根目录 `README_for_dummy.md`（新手导航，按章节列表式展示）
- 各章节的 `README_for_dummy.md`（章节内入门导航）
- `Notes/AI_Concept_Knowledge_Graph.md`（800+ 概念的知识图谱）

但**缺少一个独立的、以"概念递进"为核心的学习路径系统**。用户需要一个 `learn/` 目录，提供：

1. **按认知层次组织的概念学习路线**（而非按技术领域组织）
2. **不同角色的定制路径**（零基础、开发者、研究者、产品经理等）
3. **概念之间的依赖关系指引**（学A之前必须先懂B）
4. **每个概念的快速入口**（链接到对应的 `_for_dummy` 文档或核心文档）
5. **可操作的里程碑检查点**

## 2. 技术方案

### 2.1 目录结构

```
learn/
├── README.md                          # 总览：所有路径的入口与选择指南
├── pathways/                          # 分角色学习路径
│   ├── absolute-beginner.md           # 路径0: 零基础通识路径（面向完全不了解AI的人）
│   ├── ml-practitioner.md             # 路径1: ML从业者路径（有编程基础，想系统学习AI）
│   ├── llm-engineer.md                # 路径2: LLM工程师路径（聚焦大模型与Agent工程）
│   ├── ai-researcher.md               # 路径3: AI研究者的路径（聚焦前沿论文与理论）
│   └── product-manager.md             # 路径4: AI产品经理路径（聚焦应用与落地）
├── concepts/                          # 核心概念卡片（按层次组织）
│   ├── stage-0-awakening.md           # 第0层：AI觉醒（什么是AI、能做什么）
│   ├── stage1-foundation.md           # 第1层：基础概念（数据、模型、训练）
│   ├── stage2-core-tech.md            # 第2层：核心技术（神经网络、Transformer、LLM）
│   ├── stage3-engineering.md          # 第3层：工程实践（部署、RAG、评估）
│   └── stage4-frontier.md             # 第4层：前沿方向（Agent、多模态、世界模型）
└── milestones.md                      # 学习里程碑与自测检查点
```

### 2.2 设计原则

| 原则 | 说明 |
|------|------|
| **概念驱动** | 以"理解一个概念"为最小学习单元，而非"读完一篇文档" |
| **渐进式** | 每个阶段只依赖前一阶段的概念，不跨级引用 |
| **多入口** | 不同背景的用户可以从不同路径进入 |
| **可追踪** | 每个阶段有明确的"学会标志"和自测问题 |
| **轻量引用** | 概念卡片不重复已有内容，而是链接到现有文档 |

### 2.3 与现有内容的关系

本路径系统是对现有内容的**索引与重组**，不创建新的知识内容。所有详细解释都链接到已有的：
- `*_for_dummy.md` → 入门级解释
- `*.md` → 完整版文档
- `-in-nutshell.md` → 速查版

## 3. 影响范围

### 新增文件（6个）

| 文件 | 类型 | 说明 |
|------|------|------|
| `learn/README.md` | 新建 | 总览页，路径选择器 |
| `learn/pathways/absolute-beginner.md` | 新建 | 零基础通识路径 |
| `learn/pathways/ml-practitioner.md` | 新建 | ML从业者路径 |
| `learn/pathways/llm-engineer.md` | 新建 | LLM工程师路径 |
| `learn/pathways/ai-researcher.md` | 新建 | AI研究者路径 |
| `learn/pathways/product-manager.md` | 新建 | AI产品经理路径 |
| `learn/concepts/stage-0-awakening.md` | 新建 | 第0层概念卡片 |
| `learn/concepts/stage1-foundation.md` | 新建 | 第1层概念卡片 |
| `learn/concepts/stage2-core-tech.md` | 新建 | 第2层概念卡片 |
| `learn/concepts/stage3-engineering.md` | 新建 | 第3层概念卡片 |
| `learn/concepts/stage4-frontier.md` | 新建 | 第4层概念卡片 |
| `learn/milestones.md` | 新建 | 里程碑与自测 |

### 修改文件（无）

本任务**不修改任何现有文件**。

## 4. 实现细节

### 4.1 learn/README.md — 总览页

- 项目定位说明
- 5条路径的对比表（目标人群、前置要求、预计时间、核心产出）
- 路径选择决策树（问答式引导用户选择）
- 概念层次总览图（stage 0-4 的关系）
- 快速开始按钮

### 4.2 路径文件格式（每条路径统一结构）

```markdown
# {路径名称}

## 路径概况
- 目标人群: ...
- 前置要求: ...
- 预计时间: ...
- 核心产出: ...

## 学习阶段
### Phase N: {阶段名}
- 🎯 目标: ...
- 📚 核心概念: [链接到 concepts/]
- 🔗 深入阅读: [链接到对应 _for_dummy 或完整文档]
- ✅ 学会标志: ...

## 完整路线图
[Mermaid 流程图或 ASCII 图]
```

### 4.3 概念卡片格式（每层统一结构）

```markdown
# Stage N: {层级名称}

## 本层概要
- 包含概念数: ...
- 预计学习时间: ...
- 前置依赖: Stage N-1

## 概念列表

### {概念名}
- **一句话定义**: ...
- **为什么重要**: ...
- **通俗类比**: ...
- **🔗 入门阅读**: [链接]
- **📖 深入学习**: [链接]
- **⚡ 速查**: [链接，如有]
- **关联概念**: ...

## 层间过渡
学完本层后，下一步可以进入: ...
```

### 4.4 milestones.md 格式

- 按 Stage 组织
- 每个 Stage 有 3-5 个自测问题
- 通过标准说明
- 未通过时的补救建议

## 5. 边界条件与异常处理

- **链接有效性**: 所有相对路径需指向实际存在的文件，使用 `../XX_YY/file.md` 格式
- **循环依赖**: 概念之间不允许循环引用，Stage 编号严格递增
- **内容更新**: 当知识库新增文档时，路径文件需要手动更新（本次不在范围内）
- **语言**: 中文为主，保留英文技术术语

## 6. 数据流

```
用户进入 learn/README.md
    ↓ 选择路径
pathways/{role}.md
    ↓ 按阶段学习
concepts/stage-N.md  ←→  现有 *_for_dummy.md / *.md
    ↓ 自测
milestones.md
```
