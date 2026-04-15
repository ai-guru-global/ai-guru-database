# AI Coding 文件夹重构 — 规格文档

## 1. 现状审计

### 1.1 当前文件清单

| 文件 | 行数 | 大小 | 核心主题 |
|------|------|------|----------|
| `README.md` | 48 | 1.7KB | 导航索引 + 选型排名 |
| `AI_Coding_Assistants_2026.md` | 496 | 12.9KB | 6大工具全景对比 (Cursor/Claude Code/Hermes/Windsurf/Copilot/Devin) |
| `Hermes_Agent_2026.md` | 478 | 14.3KB | Hermes Agent 深度指南 + 与其他工具的对比矩阵 |
| `Vibe_Coding_for_dummy.md` | 319 | 8.3KB | Vibe Coding 入门指南 (5分钟上手、4步安全法、练习) |
| `Vibe_Coding_Methodology_2026.md` | 1270 | 46.5KB | Vibe Coding 完整方法论 (DGRV/能力模型/提示工程/工作流/质量/团队/成熟度) |
| `Vibe_Coding_Production_Practices.md` | 1183 | 45KB | Vibe Coding 生产实践 (质量门禁/场景实战/安全/指标/案例/合规/应急) |

### 1.2 冗余识别

#### 重叠1: Hermes Agent 对比表 (高冗余)
- `AI_Coding_Assistants_2026.md` §2.6 包含 Hermes Agent 概述 + 核心特性表
- `Hermes_Agent_2026.md` §4.2-4.4 包含 **完整的** Hermes vs Claude Code vs Cursor vs Windsurf 对比矩阵
- **处理**: 保留 Hermes 文件中的深度对比（更详细），从 AI_Coding_Assistants_2026.md 中精简 Hermes 概述为简要摘要+链接

#### 重叠2: 质量保障内容 (中冗余)
- `Vibe_Coding_Methodology_2026.md` §6: 四重验证框架、代码审查、测试策略
- `Vibe_Coding_Production_Practices.md` §1-2: 质量门禁流水线、部署流水线
- **处理**: Methodology 保留**框架性**内容（原则、模型），Production Practices 保留**工程化落地**（CI/CD配置、流水线、工具），删除交叉重复

#### 重叠3: 团队协作与组织变革 (中冗余)
- `Vibe_Coding_Methodology_2026.md` §8: 团队角色、协作流程、知识库
- `Vibe_Coding_Production_Practices.md` §9: 推广路线图、阻力应对、培训体系
- **处理**: Methodology 保留**角色定义和协作模型**，Production Practices 保留**组织推广和变革管理**

#### 重叠4: 反模式与风险 (低冗余)
- `Vibe_Coding_Methodology_2026.md` §9: 七大反模式 + 风险矩阵
- `Vibe_Coding_Production_Practices.md` §6: AI代码技术债分类 (5种类型) + 清理策略
- **处理**: Methodology 保留反模式（行为层面），Production Practices 保留技术债管理（代码层面），两者角度不同，保留各自

#### 重叠5: Vibe Coding 定义与入门 (低冗余)
- `Vibe_Coding_for_dummy.md` §"什么是Vibe Coding": 简化版定义
- `Vibe_Coding_Methodology_2026.md` §1: 完整版定义 + 演进 + 对比 + 原则
- **处理**: for_dummy 保持简化版，Methodology 保持完整版，两者定位不同

### 1.3 缺失识别

按四个维度评估：

| 维度 | 现有覆盖 | 缺失内容 |
|------|----------|----------|
| **理论** | 极弱 | AI代码生成的底层原理 (LLM如何理解代码、Context Window机制、Tokenization对代码的影响、代码幻觉成因) |
| **工具** | 充分 | 缺少 Aider、OpenCode、Augment 等新兴工具；缺少工具配置模板合集 |
| **实战** | 中等 | 缺少独立 Prompt 模板库；实战案例散落在多个文件中；缺少从0到1的完整项目实战 walkthrough |
| **方法论** | 充分 | Agentic Coding 方法论 (多Agent协作开发) 尚为空白；规则文件 (.cursorrules/AGENTS.md) 模板库缺失 |

---

## 2. 目标结构

```
17_AI_Coding/
├── README.md                                    # 全局导航索引（重写）
├── 01_Theory/                                   # 理论
│   └── AI_Coding_Theory.md                      # 新建：AI辅助编程理论基础
├── 02_Tools/                                    # 工具
│   ├── AI_Coding_Assistants_2026.md             # 保留（精简Hermes概述）
│   └── Hermes_Agent_2026.md                     # 保留（移除重复对比表）
├── 03_Practice/                                 # 实战
│   ├── Vibe_Coding_Getting_Started.md           # 重命名自 Vibe_Coding_for_dummy.md
│   ├── Vibe_Coding_Prompt_Templates.md          # 新建：提示词模板库
│   └── Vibe_Coding_Real_World_Cases.md          # 新建：实战案例集（提取自Production Practices §3, §8）
├── 04_Methodology/                              # 方法论
│   ├── Vibe_Coding_Methodology.md               # 重命名（去重叠，保留框架性内容）
│   ├── Vibe_Coding_Production_Practices.md      # 保留（去重叠，保留工程化落地）
│   └── Agentic_Coding_Methodology.md            # 新建：Agentic Coding 方法论（占位+大纲）
```

---

## 3. 各文件详细变更

### 3.1 README.md — 重写

**变更类型**: 重写

**内容规划**:
- 四维导航（理论/工具/实战/方法论）
- 每个维度的文档清单与简介
- 快速选路指南（"我想做什么 → 看哪个文档"）

### 3.2 01_Theory/AI_Coding_Theory.md — 新建

**变更类型**: 新建

**内容规划**:
```
# AI辅助编程理论基础

## 1. 编程范式演进
   - 从机器语言到自然语言驱动 (复用 Methodology §1.2 的演进图)
   
## 2. LLM与代码生成
   - 大语言模型如何理解代码 (Tokenization、AST隐式理解)
   - Context Window 机制与限制
   - 代码幻觉 (Hallucination) 成因与类型
   
## 3. Agentic Coding 架构原理
   - 从补全到代理的架构跃迁
   - 工具调用 (Function Calling / Tool Use) 原理
   - 多Agent编排架构
   
## 4. AI编程的能力边界
   - 擅长领域 vs 不擅长领域
   - 安全边界与风险评估框架
```

### 3.3 02_Tools/AI_Coding_Assistants_2026.md — 精简

**变更类型**: 编辑

**变更点**:
- §2.6 Hermes Agent 概述精简为 5-10 行摘要 + 链接到 `Hermes_Agent_2026.md`
- §5 最佳实践中的 Cursor 提示工程技巧移至 `03_Practice/Vibe_Coding_Prompt_Templates.md`
- §9 "从工具到方法论" 部分更新链接路径
- 其余内容保持不变（工具对比、选型树、生产力数据、安全合规、快速开始均为独特内容）

### 3.4 02_Tools/Hermes_Agent_2026.md — 精简

**变更类型**: 编辑

**变更点**:
- §4.1 核心定位对比：删除与 `AI_Coding_Assistants_2026.md` 重复的工具分层图，保留 Hermes 独有的定位分析
- §4.2 功能矩阵对比：这是 Hermes 文件的核心价值（最详细的功能对比），**保留**
- §4.3 编码能力对比：**保留**（视角独特）
- §4.4 适用场景分析：**保留**
- §5 最佳实践中的 Skills 推荐：**保留**
- 整体结构不变，仅删除 §4.1 中与 AI_Coding_Assistants_2026.md §1 "2026年市场格局" 重复的分层图

### 3.5 03_Practice/Vibe_Coding_Getting_Started.md — 重命名

**变更类型**: 重命名（从 `Vibe_Coding_for_dummy.md`）+ 微调

**变更点**:
- 文件名改为 `Vibe_Coding_Getting_Started.md`（标准化命名）
- 内容基本保留，仅更新内部链接路径
- §"进阶学习路线" 中的推荐阅读链接更新为新路径

### 3.6 03_Practice/Vibe_Coding_Prompt_Templates.md — 新建

**变更类型**: 新建

**内容规划**:
```
# Vibe Coding 提示词模板库

## 1. 提示工程框架
   - STAR 模板详解 (提取自 Methodology §4.1)
   
## 2. 按场景分类的提示模板
   - API 开发模板
   - 前端组件模板
   - 数据库操作模板
   - 测试生成模板
   - Bug 修复模板
   - 代码审查模板
   - 重构模板
   - 文档生成模板
   
## 3. 高级技巧
   - 渐进式细化 (提取自 Methodology §4.4)
   - 示例驱动
   - 约束优先
   - 思维链引导
   - 反例驱动
   
## 4. 规则文件模板
   - .cursorrules 模板 (提取自 Methodology §4.3)
   - AGENTS.md 模板
   - CLAUDE.md 模板
   
## 5. 反面教材
   - 常见差提示示例与改进 (提取自 for_dummy + Methodology)
```

### 3.7 03_Practice/Vibe_Coding_Real_World_Cases.md — 新建

**变更类型**: 新建（从 `Vibe_Coding_Production_Practices.md` 提取）

**内容来源**:
- Production Practices §3 "场景化实战方案" (REST API / 组件库 / DB迁移 / 微服务拆分)
- Production Practices §8 "真实案例分析" (SaaS创业 / 金融科技 / 开源项目)

### 3.8 04_Methodology/Vibe_Coding_Methodology.md — 去重叠

**变更类型**: 编辑（去重叠 + 重命名）

**变更点**:
- §1 "什么是Vibe Coding": **保留完整**（这是方法论的核心定义）
- §2 "核心方法论 DGRV": **保留完整**
- §3 "五层能力模型": **保留完整**
- §4 "提示工程体系": **保留框架**，具体模板和技巧移至 `Prompt_Templates.md`，此处保留概述+链接
- §5 "工作流模式": **保留完整**
- §6 "质量保障体系": 精简为框架性描述，详细工程化流水线移至 Production Practices
- §7 "工具链集成": 精简，CI/CD 详细配置移至 Production Practices
- §8 "团队协作": 保留角色定义和协作模型，组织推广内容移至 Production Practices
- §9 "反模式": **保留**（行为层面，与 Production Practices 技术债管理不重叠）
- §10 "成熟度评估": **保留完整**
- §11 "未来演进": **保留完整**

### 3.9 04_Methodology/Vibe_Coding_Production_Practices.md — 去重叠

**变更类型**: 编辑（去重叠 + 提取案例）

**变更点**:
- §3 "场景化实战方案" → 移至 `Real_World_Cases.md`
- §8 "真实案例分析" → 移至 `Real_World_Cases.md`
- §9 "组织变革管理" 保留（已在 Methodology 中移除组织推广重叠）
- 其余内容保留，确保不与 Methodology 重复
- 更新内部交叉引用链接

### 3.10 04_Methodology/Agentic_Coding_Methodology.md — 新建占位

**变更类型**: 新建（占位+大纲）

**内容规划**:
```
# Agentic Coding 方法论

> 本文档为占位文件，待补充完整内容

## 1. 概述
   - Agentic Coding 定义与演进
   
## 2. 多Agent协作架构
   - 架构师 Agent / 编码 Agent / 测试 Agent / 审查 Agent
   
## 3. Agent编排模式
   - 串行 / 并行 / 条件分支 / 人工审批节点
   
## 4. 工具与框架
   - Hermes Agent / OpenCode / Claude Code / CrewAI / AutoGen
   
## 5. 质量保障
   - Agent 输出验证 / 人工在环 / 回滚机制
   
## 6. 最佳实践与反模式
```

---

## 4. 数据流与引用关系

```
README.md
  ├── → 01_Theory/AI_Coding_Theory.md
  ├── → 02_Tools/AI_Coding_Assistants_2026.md
  │       └── → 02_Tools/Hermes_Agent_2026.md (深度链接)
  ├── → 03_Practice/Vibe_Coding_Getting_Started.md
  │       └── → 04_Methodology/Vibe_Coding_Methodology.md (进阶)
  ├── → 03_Practice/Vibe_Coding_Prompt_Templates.md
  ├── → 03_Practice/Vibe_Coding_Real_World_Cases.md
  ├── → 04_Methodology/Vibe_Coding_Methodology.md
  │       ├── → 03_Practice/Vibe_Coding_Prompt_Templates.md (模板详情)
  │       └── → 04_Methodology/Vibe_Coding_Production_Practices.md (工程落地)
  └── → 04_Methodology/Agentic_Coding_Methodology.md
```

---

## 5. 边界条件与约束

1. **不删除独特内容**: 所有现有文件的独特内容必须保留，只做合并或移动
2. **语言一致性**: 新建文件统一使用中文，保持原有风格
3. **Markdown 格式**: 所有文件使用 `.md` 格式，保持代码块和ASCII图的一致性
4. **链接更新**: 所有文件间的交叉引用必须更新为新路径
5. **文件命名**: 使用 `PascalCase` 或 `Snake_Case`，与现有风格保持一致 (现有风格为 `Snake_Case`)

---

## 6. 预期成果

1. 清晰的四维目录结构 (01_Theory / 02_Tools / 03_Practice / 04_Methodology)
2. 无高度冗余内容（所有已识别重叠均已处理）
3. 新增 3 个文件补齐关键缺失 (理论、模板库、Agentic Coding)
4. 实战案例独立成文，便于快速查阅
5. 所有内部链接路径正确
