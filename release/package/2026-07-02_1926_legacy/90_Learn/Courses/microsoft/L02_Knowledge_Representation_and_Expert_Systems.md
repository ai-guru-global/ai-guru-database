---
title: "L02 - 知识表示与专家系统"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "symbolic-ai", "knowledge-representation", "expert-systems", "semantic-web", "ontology"]
summary: "本课介绍符号 AI 的核心：如何将人类知识编码为计算机可处理的结构，并用专家系统进行推理，以及语义网与本体的现代延续。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/2-Symbolic/README.md"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "L02 Knowledge Representation And Expert Systems"
  - "L02 Knowledge Representation and Expert Systems"
  - L02_Knowledge_Representation_and_Expert_Systems

---
# L02 - 知识表示与专家系统

> **一句话理解**：AI 不仅要靠数据学习，也可以把人类已经总结好的知识显式表示出来，让计算机像专家一样推理、解释和决策。

## 本课概览

在神经网络和深度学习流行之前，人工智能的主流思路是**自顶向下**的符号 AI（Symbolic AI）：先从人类专家脑中抽取出知识，再用计算机可理解的形式表示，最后通过推理机制自动求解问题。本课聚焦这一范式的两大支柱——**知识表示（Knowledge Representation）**与**推理（Reasoning）**，并以**专家系统（Expert Systems）**作为典型实现。

在 Microsoft AI For Beginners 课程中，本课属于**符号 AI**模块。它为后续神经网络课程提供历史视角：现代 AI 虽然以机器学习为主流，但符号推理在需要可解释性、可控修改和显式知识的场景中仍有重要价值。

**学习目标**：
- 区分数据、信息、知识与智慧，理解 DIKW 金字塔。
- 掌握主要的计算机知识表示方法：语义网络、框架、产生式规则、逻辑。
- 理解专家系统的结构、推理机制（正向推理与反向推理）。
- 了解语义网、本体（Ontology）以及 Microsoft Concept Graph 等现代知识工程实践。

## 核心概念

### 1. DIKW 金字塔：数据 → 信息 → 知识 → 智慧

| 层级 | 含义 | 示例 |
|------|------|------|
| **数据（Data）** | 物理介质上的符号，可独立传递 | 书中文字、数据库字段 |
| **信息（Information）** | 人对数据的解释 | 读到"计算机"一词时产生的理解 |
| **知识（Knowledge）** | 信息被整合进世界观，形成相互关联的概念网络 | 知道计算机的工作原理、成本、用途 |
| **智慧（Wisdom）** | 元知识，知道何时、如何使用知识 | 判断何时该用本地服务器而非云服务 |

> ✅ **关键洞见**：书籍存储的是**数据**，只有经过主动学习整合进心智模型后，才变成**知识**。知识表示的目标，就是找到在计算机内部也能被自动使用的表示形式。

### 2. 知识表示谱系

知识表示是一个从"计算机易用但表达能力弱"到"表达能力强但难以自动推理"的连续光谱：

- **算法/程序**：最易执行，但不灵活。
- **结构化表示**（语义网络、框架、规则）：平衡表达与推理。
- **自然语言**：表达能力最强，但机器难以直接推理。

### 3. 主要知识表示方法

#### 3.1 网络表示：语义网络（Semantic Networks）
用图来模拟人脑中的概念网络，节点是概念，边是关系。可进一步编码为**对象-属性-值三元组（Object-Attribute-Value, OAV）**。

| Object | Attribute | Value |
|--------|-----------|-------|
| Python | is | Untyped-Language |
| Python | invented-by | Guido van Rossum |
| Python | block-syntax | indentation |
| Untyped-Language | doesn't have | type definitions |

#### 3.2 层次表示：框架（Frames）与脚本（Scripts）
- **框架**：每个对象或类用一个包含若干**槽（Slot）**的结构表示，槽可以有默认值、取值范围或获取过程。框架之间形成继承层次，类似面向对象编程。
- **脚本**：特殊的框架，用于表示随时间展开的复杂情境。

| Slot | Value | Default | Interval |
|------|-------|---------|----------|
| Name | Python | | |
| Is-A | Untyped-Language | | |
| Variable Case | | CamelCase | |
| Program Length | | | 5–5000 lines |
| Block Syntax | Indent | | |

#### 3.3 过程式表示：产生式规则（Production Rules）
用 "IF...THEN..." 形式表示可执行知识。例如医疗诊断规则：

```text
IF 患者高烧 OR 血液 C-反应蛋白水平高
THEN 患者存在炎症
```

规则左侧（LHS）是前提，右侧（RHS）是结论。多个规则可串联推理。

#### 3.4 逻辑表示
- **谓词逻辑（Predicate Logic）**：形式能力强，但完整谓词逻辑不可计算。
- **Horn 子句**：Prolog 等语言使用的可计算子集。
- **描述逻辑（Description Logic, DL）**：语义网和本体的理论基础，在表达力与推理复杂度之间取得平衡。

### 4. 专家系统（Expert Systems）

专家系统 = **知识库（Knowledge Base）** + **推理机（Inference Engine）**，外加与问题相关的**工作记忆（Working Memory / Problem Memory）**。

| 组件 | 类比人脑 | 作用 |
|------|---------|------|
| **问题记忆 / 工作记忆** | 短期记忆 | 记录当前问题的已知事实（静态知识） |
| **知识库** | 长期记忆 | 存储领域专家的长期知识（动态知识，驱动状态转移） |
| **推理机** | 思维过程 | 搜索问题状态空间，必要时向用户提问，选择并应用规则 |

#### 4.1 正向推理（Forward Inference / 数据驱动）
从已知事实出发，循环执行：
1. 若目标属性已在工作记忆中，停止并输出结果。
2. 找出所有条件被满足的规则，形成**冲突集（Conflict Set）**。
3. 进行**冲突消解（Conflict Resolution）**：选择一条规则（如首条、随机、最具体）。
4. 应用规则，向工作记忆添加新事实。
5. 重复步骤 1。

#### 4.2 反向推理（Backward Inference / 目标驱动）
从目标结论出发，递归证明所需前提：
1. 找出 RHS 能得到目标的规则，形成冲突集。
2. 若无规则或规则要求询问用户，则提问获取值。
3. 用冲突消解选择一条规则作为**假设**。
4. 递归证明该规则 LHS 中的所有属性。
5. 若某条路径失败，回退并尝试其他规则。

> ✅ **适用场景**：正向推理适合已有完整数据、需要推导所有结论的场景；反向推理适合数据不完整、需要按需提问逐步诊断的场景（如医疗问诊）。

### 5. 语义网、本体与 Microsoft Concept Graph

#### 5.1 语义网（Semantic Web）
20 世纪末提出的设想：用知识表示标注互联网资源，使机器能回答精确查询。核心技术栈：
- **RDF**（Resource Description Framework）：基于三元组的资源描述。
- **RDFS / OWL**：基于描述逻辑的本体语言。
- **URI**：全球唯一标识符，支持跨站点的分布式知识图。

示例 RDF 三元组：
```text
<http://github.com/microsoft/ai-for-beginners> <http://purl.org/dc/elements/1.1/creator> <http://soshnikov.com>
```

#### 5.2 本体（Ontology）
用形式化语言对某个领域概念体系做出的显式规范。简单本体可能只是对象层次结构；复杂本体包含规则，可支持推理。

> 可视化编辑工具推荐：[Protégé](https://protege.stanford.edu/)。

#### 5.3 Microsoft Concept Graph
微软研究院从非结构化文本中**挖掘**的大规模 "is-a" 概念图。可回答"Microsoft 是什么"这类问题，返回概率化回答：
```text
Microsoft 是 company（概率 0.87），也是 brand（概率 0.75）。
```

## 关键知识点

- **知识 ≠ 数据**：数据是物理符号，知识是经过学习整合后的概念网络。
- **知识表示方法可按结构/过程/逻辑分类**：语义网络、框架、产生式规则、逻辑表示各有优劣。
- **专家系统的可解释性是其核心优势**：每条决策都可以通过应用的规则链条进行解释。
- **推理分正向与反向**：正向由数据驱动，反向由目标驱动；冲突消解策略影响推理路径。
- **语义网使用 RDF 三元组与 URI**：目标是让机器理解互联网资源之间的关系。
- **本体工程在现代仍有价值**：如 WikiData、DBpedia、生物医学本体等。

## 代码/实验说明

官方为本课提供了三个可运行的 Jupyter Notebook，建议结合阅读后动手运行。

### 1. Animals.ipynb —— 动物识别专家系统
- **官方链接**：[Animals.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/2-Symbolic/Animals.ipynb)
- **内容**：用 OAV 三元组表示动物特征，分别实现**正向推理**与**反向推理**，根据用户输入逐步推断动物类别。
- **运行方式**：下载 Notebook 后，在本地 Python 环境（如本库 [[数学基础/AI_Development_Environment_Setup]] 配置的环境）中运行即可；该示例无需 GPU。
- **核心结构概述**：
  - 定义规则库（IF-THEN 规则）。
  - 工作记忆初始化为用户提供的事实。
  - 推理机循环匹配规则、冲突消解、更新工作记忆。
  - 反向推理版从目标动物出发，递归询问所需特征。

### 2. FamilyOntology.ipynb —— 家族本体与语义网推理
- **官方链接**：[FamilyOntology.ipynb](https://github.com/Ezana135/AI-For-Beginners/blob/main/lessons/2-Symbolic/FamilyOntology.ipynb)
- **内容**：读取 GEDCOM 家族树格式，结合家族关系本体，构建并推理亲属关系图。
- **说明**：这是学习 RDF/OWL/本体推理的入门级实验。

### 3. MSConceptGraph.ipynb —— Microsoft Concept Graph 应用
- **官方链接**：[MSConceptGraph.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/2-Symbolic/MSConceptGraph.ipynb)
- **内容**：调用 Microsoft Concept Graph 将新闻文章自动归类到概念层级。
- **说明**：展示如何从大规模 "is-a" 知识图中获取文本的语义类别。

> **Note**：官方 Animals 示例较简单。当规则数量达到 200+ 时，系统才会显现出类似"智能"的行为；同时规则复杂性上升后，可解释性仍是其最大优势。

## 本课不覆盖与延伸

- **不覆盖**：
  - 神经网络与统计学习方法（本课为符号 AI，后续课程从感知器开始讲解连接主义方法）。
  - 现代知识图谱的分布式存储与大规模推理系统细节。
  - 神经-符号结合的前沿模型（如神经定理证明、LLM 与符号推理融合）。

- **延伸**：
  - 想理解符号推理的现代延续，阅读 [[大模型/Reasoning_Models/Neuro_Symbolic_and_Formal_Verification_2026]]。
  - 想了解 AI 的整体脉络，阅读 [[AI入门/AI_Fundamentals]]。
  - 想深入本体工程，可学习 OWL、RDF、SPARQL，并尝试 Protégé。
  - 想对比连接主义学习，继续学习本课程 L03「感知器」。

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：
  - [[AI入门/AI_Fundamentals]]
  - [[大模型/Reasoning_Models/Neuro_Symbolic_and_Formal_Verification_2026]]
