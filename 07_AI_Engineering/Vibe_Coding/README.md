# Vibe Coding 方法论 (Vibe Coding Methodology)

> **一句话理解**: Vibe Coding 是用自然语言驱动 AI 生成代码、以人类判断力保障质量的软件开发方法论——程序员从"打字员"变成"架构师+审计师"。

## 文档导航

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [Vibe_Coding_for_dummy.md](./Vibe_Coding_for_dummy.md) | 5分钟入门指南+实战练习 | 完全新手 |
| [Vibe_Coding_Methodology_2026.md](./Vibe_Coding_Methodology_2026.md) | 完整方法论: 原则/能力模型/提示工程/工作流/质量体系 | 方法论学习者 |
| [Vibe_Coding_Production_Practices.md](./Vibe_Coding_Production_Practices.md) | 生产环境实战: 安全/CI-CD/案例分析/组织变革 | 工程Leader/团队负责人 |

## 核心概念速览

```
Vibe Coding = 自然语言描述意图 → AI生成代码 → 人类审查验证

三大核心原则:
├── P1: 意图先于实现 — 说"做什么"不说"怎么写"
├── P2: 验证胜于信任 — 永远审查AI生成代码
└── P3: 渐进式构建 — 分步生成，逐步验证

DGRV 循环:
├── Describe (描述) → Generate (生成) → Review (审查) → Verify (验证)
└── 每一轮循环都产出可验证的代码
```

## 能力等级

| 等级 | 名称 | 核心能力 | 学习时间 |
|------|------|----------|----------|
| L1 | 基础实践者 | 描述需求、审查代码 | 1-2周 |
| L2 | 效率专家 | 提示工程、上下文管理 | 1-2月 |
| L3 | 流程工程师 | CI/CD集成、测试策略 | 3-6月 |
| L4 | 质量守护者 | 安全审计、性能优化 | 6-12月 |
| L5 | 系统架构师 | 多Agent编排、架构设计 | 12月+ |

## 适用场景

| 适合度 | 场景 | 处理方式 |
|--------|------|----------|
| A (完全AI) | CRUD、测试、文档 | AI生成 → 自动测试 → 1人审查 |
| B (AI+强化审查) | 支付回调、权限系统 | AI生成 → 强化测试 → 2人审查 |
| C (AI辅助) | 重构、脚本 | 人工设计 → AI实现 → 标准审查 |
| D (人工为主) | 加密、核心算法 | 人工编写 → AI辅助审查 |

## 关键数据

```
效率提升:
├── 开发速度: +50-200%
├── 测试覆盖: +60%
├── 新人上手: +70%
├── Bug修复: +40-80%
└── 文档生成: +90%

投入:
├── 工具成本: $20-50/人/月
├── 学习曲线: 1-2周基础
└── 回本周期: 2-4月
```

## 相关资源

- [AI编程助手对比](../AI_Coding_Assistants/AI_Coding_Assistants_2026.md) - 工具选型
- [Agent生产部署](../Agent_Production/Agent_Production_2026.md) - Agent架构
- [Claude Code深度指南](../Agent_Production/Claude_Code_Deep_Dive.md) - 工具详解

## 参考

- Andrej Karpathy, "Vibe Coding" (2025年2月)
- [Cursor](https://cursor.sh/) / [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) / [Windsurf](https://codeium.com/windsurf)

---

*Last updated: 2026-04-11*
