# AI Coding 文件夹重构 — 任务计划

- [x] Task 1: 创建目标目录结构
    - 1.1: 创建 `01_Theory/` 子文件夹
    - 1.2: 创建 `02_Tools/` 子文件夹
    - 1.3: 创建 `03_Practice/` 子文件夹
    - 1.4: 创建 `04_Methodology/` 子文件夹

- [x] Task 2: 迁移现有文件到新目录
    - 2.1: 移动 `AI_Coding_Assistants_2026.md` → `02_Tools/`
    - 2.2: 移动 `Hermes_Agent_2026.md` → `02_Tools/`
    - 2.3: 移动并重命名 `Vibe_Coding_for_dummy.md` → `03_Practice/Vibe_Coding_Getting_Started.md`，更新内部链接路径
    - 2.4: 移动 `Vibe_Coding_Methodology_2026.md` → `04_Methodology/Vibe_Coding_Methodology.md`
    - 2.5: 移动 `Vibe_Coding_Production_Practices.md` → `04_Methodology/`

- [x] Task 3: 精简 `02_Tools/AI_Coding_Assistants_2026.md`
    - 3.1: §2.6 Hermes Agent 概述精简为 5-10 行摘要 + 链接到 `Hermes_Agent_2026.md`
    - 3.2: §5 最佳实践中的 Cursor 提示工程技巧移除（将迁入 Prompt_Templates.md）
    - 3.3: §9 "从工具到方法论" 更新链接路径指向新目录结构

- [x] Task 4: 精简 `02_Tools/Hermes_Agent_2026.md`
    - 4.1: 删除 §4.1 中与 `AI_Coding_Assistants_2026.md` §1 重复的工具分层图
    - 4.2: 更新文件内的交叉引用链接路径

- [x] Task 5: 去重叠 `04_Methodology/Vibe_Coding_Methodology.md`
    - 5.1: §4 "提示工程体系" 精简：保留框架概述，具体模板/技巧替换为链接指向 `Prompt_Templates.md`
    - 5.2: §6 "质量保障体系" 精简为框架性描述，详细流水线配置替换为链接指向 `Production_Practices.md`
    - 5.3: §7 "工具链集成" 精简 CI/CD 详细配置，替换为链接指向 `Production_Practices.md`
    - 5.4: §8 "团队协作" 精简组织推广内容，保留角色定义和协作模型
    - 5.5: 更新文件内所有交叉引用链接路径

- [x] Task 6: 去重叠并提取 `04_Methodology/Vibe_Coding_Production_Practices.md`
    - 6.1: 提取 §3 "场景化实战方案" 内容（标记为待迁入 Real_World_Cases.md）
    - 6.2: 提取 §8 "真实案例分析" 内容（标记为待迁入 Real_World_Cases.md）
    - 6.3: 从 Production Practices 中删除已提取的 §3 和 §8 内容，替换为链接指向 `Real_World_Cases.md`
    - 6.4: 更新文件内所有交叉引用链接路径

- [x] Task 7: 新建 `03_Practice/Vibe_Coding_Real_World_Cases.md`
    - 7.1: 整合从 Production Practices 提取的场景化实战方案和真实案例分析
    - 7.2: 补充案例间的过渡说明和导航结构
    - 7.3: 添加指向相关方法论文档的链接

- [x] Task 8: 新建 `03_Practice/Vibe_Coding_Prompt_Templates.md`
    - 8.1: 从 Methodology §4.1 提取 STAR 模板框架
    - 8.2: 从 Methodology §4.4 提取高级技巧（渐进式细化/示例驱动/约束优先/思维链/反例驱动）
    - 8.3: 从 Methodology §4.3 提取规则文件模板 (.cursorrules/AGENTS.md/CLAUDE.md)
    - 8.4: 新建按场景分类的提示模板（API开发/前端组件/数据库/测试/Bug修复/代码审查/重构/文档生成）
    - 8.5: 新建反面教材章节（合并 for_dummy 和 Methodology 中的差提示示例）

- [x] Task 9: 新建 `01_Theory/AI_Coding_Theory.md`
    - 9.1: 编写 §1 编程范式演进（复用 Methodology §1.2 的演进图并扩展）
    - 9.2: 编写 §2 LLM与代码生成（Tokenization/Context Window/代码幻觉成因与类型）
    - 9.3: 编写 §3 Agentic Coding 架构原理（从补全到代理/Function Calling/多Agent编排）
    - 9.4: 编写 §4 AI编程的能力边界（擅长/不擅长/安全边界/风险评估框架）

- [x] Task 10: 新建 `04_Methodology/Agentic_Coding_Methodology.md`
    - 10.1: 编写占位文件框架：概述/多Agent协作架构/编排模式/工具框架/质量保障/最佳实践
    - 10.2: 各章节补充大纲要点（待后续填充）

- [x] Task 11: 重写 `README.md` 导航索引
    - 11.1: 编写四维导航结构（理论/工具/实战/方法论）
    - 11.2: 编写每个维度的文档清单与简介
    - 11.3: 编写快速选路指南（"我想做什么 → 看哪个文档"）

- [x] Task 12: 全局链接校验与最终检查
    - 12.1: 校验所有文件间的交叉引用链接路径正确
    - 12.2: 检查无残留的冗余内容
    - 12.3: 确认目录结构符合四维分类要求
    - 12.4: 删除根目录下的旧文件（已迁移的原始文件）
