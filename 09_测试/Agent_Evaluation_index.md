---
title: Agent Evaluation
type: index
created: 2026-07-02
updated: 2026-07-11
sources: []
tags: [auto-index]
---

# Agent Evaluation

Agent 评估（Agent Evaluation）— 智能体系统的端到端评估方法论（end-to-end evaluation）、工具链与 Benchmark。

## 文件导航

| 文件 | 说明 | 适用人群 |
|------|------|----------|
| [[09_测试/Agent_Evaluation_Deep_Dive|Agent Evaluation Deep Dive]] | Agent evaluation deep dive: trajectory evaluation, tool calling correctness and task completion | agent developers / evaluation engineers |

## Related

- [[09_测试/index|测试首页]]
- [[15_智能体/07_Agent_Evaluation/index|智能体 Agent Evaluation]]
- [[08_模型评估/index|模型评估]]

## 核心概念

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| 轨迹评估 | 评估 Agent 决策路径 | 多步骤任务 |
| 工具调用正确性 | 验证工具选择与参数 | 函数调用 |
| 任务完成率 | 端到端成功比例 | 整体效果 |
| 效率指标 | 步骤数/Token 消耗 | 成本优化 |
| 安全性 | 有害操作检测 | 生产环境 |

## Agent 评估维度

| 维度 | 指标 | 评估方法 |
|------|------|----------|
| 正确性 | 任务成功率 | 结果对比 |
| 效率 | 平均步骤数 | 轨迹分析 |
| 鲁棒性 | 异常恢复率 | 故障注入 |
| 安全性 | 有害操作率 | 红队测试 |
| 一致性 | 多次运行方差 | 重复实验 |

## 评估工具与 Benchmark

| 工具/Benchmark | 功能 | 特点 |
|----------------|------|------|
| AgentBench | 多任务评估 | 8 个环境 |
| WebArena | Web 任务 | 真实网站 |
| ToolBench | 工具调用 | 16K+ API |
| GAIA | 通用 AI 助手 | 多步骤推理 |
| LangSmith | 轨迹追踪 | 可视化调试 |

## 学习路径建议

| 阶段 | 推荐内容 | 目标 |
|------|----------|------|
| 入门 | Agent Evaluation 主文档 | 理解评估方法论 |
| 实践 | 构建评估管道 | 掌握工具使用 |
| 进阶 | 自定义 Benchmark | 场景化评估 |

## 常见问题

| 问题 | 解答 |
|------|------|
| Agent 评估与 LLM 评估的区别？ | Agent 关注多步骤决策，LLM 关注单次输出 |
| 如何评估开放式任务？ | LLM-as-Judge + 人工抽检 |
| 评估频率建议？ | 每次模型/Prompt 变更后 |
| 推荐工具？ | LangSmith, Braintrust, AgentBench |

## 统计

| 指标 | 数值 |
|------|------|
| 子域文件数 | 1 |
| 核心 Benchmark | 5+ |
| 评估维度 | 5 个 |
| 工具链 | LangSmith, Braintrust |

> 💡 Agent 评估是智能体系统可靠性的核心保障，需关注轨迹质量而非仅看最终结果。

## 附录：Agent 评估流程

| 步骤 | 操作 | 工具 |
|------|------|------|
| 1. 定义任务 | 明确评估场景与成功标准 | 需求文档 |
| 2. 构建环境 | 搭建测试沙箱/模拟环境 | Docker/Mock |
| 3. 运行 Agent | 执行多步骤任务 | Agent 框架 |
| 4. 轨迹记录 | 记录每步决策与工具调用 | LangSmith |
| 5. 指标计算 | 成功率/效率/安全性 | 自定义脚本 |
| 6. 分析报告 | 可视化轨迹与指标 | Dashboard |

## 附录：Agent 评估指标详解

| 指标 | 计算方式 | 达标标准 | 优化方向 |
|------|----------|----------|----------|
| 任务成功率 | 成功数/总数 | >80% | 优化规划能力 |
| 平均步骤数 | 总步骤/任务数 | <10步 | 减少冗余操作 |
| 工具调用准确率 | 正确调用/总调用 | >90% | 优化工具选择 |
| Token 效率 | 总 Token/任务 | 最小化 | 精简 Prompt |
| 异常恢复率 | 恢复数/异常数 | >70% | 增强容错 |

## 附录：Agent Benchmark 对比

| Benchmark | 任务类型 | 环境 | 规模 | 特点 |
|-----------|----------|------|------|------|
| AgentBench | 多任务 | 8个环境 | 1K+ | 全面评估 |
| WebArena | Web操作 | 真实网站 | 800+ | 实用性 |
| ToolBench | API调用 | 模拟 | 16K+ | 工具使用 |
| GAIA | 通用助手 | 多场景 | 466 | 多步推理 |
| SWE-bench | 代码修复 | GitHub | 2K+ | 编程能力 |

## 附录：Agent 评估代码示例

```python
# Agent 评估框架示例
class AgentEvaluator:
    def __init__(self, agent, env):
        self.agent = agent
        self.env = env
    
    def evaluate(self, tasks):
        results = []
        for task in tasks:
            trajectory = self.agent.run(task)
            score = self.score(trajectory, task)
            results.append(score)
        return self.aggregate(results)
    
    def score(self, trajectory, task):
        return {
            "success": trajectory.final_state == task.goal,
            "steps": len(trajectory.actions),
            "tool_accuracy": self.check_tools(trajectory),
        }
```

## 附录：2026 年 Agent 评估趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| 多 Agent 评估 | 协作/竞争场景 | 复杂度提升 |
| 实时评估 | 生产环境持续监控 | 主动发现问题 |
| 自动化红队 | AI 生成对抗任务 | 安全性提升 |
| 标准化 Benchmark | 行业统一评估标准 | 可比性增强 |

## 附录：Agent 评估术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 轨迹 | Trajectory | Agent 决策序列 |
| 工具调用 | Tool Call | 函数/API 调用 |
| 任务完成 | Task Completion | 目标达成 |
| 规划 | Planning | 多步骤策略 |
| 反思 | Reflection | 自我评估修正 |
| 沙箱 | Sandbox | 隔离测试环境 |

## 附录：Agent 评估检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 任务定义清晰 | 成功标准明确 | ☐ |
| 环境可复现 | 测试结果一致 | ☐ |
| 轨迹可追踪 | 每步可审计 | ☐ |
| 安全性验证 | 无有害操作 | ☐ |
| 效率指标 | Token/步骤合理 | ☐ |
| 异常处理 | 容错能力 | ☐ |

## 附录：Agent 评估快速导航

| 我想... | 去看 | 难度 |
|---------|------|------|
| 了解 Agent 评估基础 | 本文档核心概念 | ★☆☆ |
| 选择 Benchmark | Benchmark 对比表 | ★★☆ |
| 构建评估管道 | 评估流程 | ★★☆ |
| 自定义评估 | 代码示例 | ★★★ |

## 附录：Agent 评估资源

| 资源 | 类型 | 特点 |
|------|------|------|
| AgentBench | Benchmark | 多任务评估 |
| LangSmith | 工具 | 轨迹追踪 |
| Braintrust | 平台 | 评估+日志 |
| 本文档 | 知识库 | 中文体系化 |

## 附录：Agent 评估统计

| 指标 | 数值 |
|------|------|
| 核心 Benchmark | 5+ |
| 评估维度 | 5 个 |
| 工具链 | LangSmith, Braintrust |
| 适用场景 | 多步骤任务 |
| 评估频率 | 每次模型/Prompt 变更后 |

---
*Last updated: 2026-07-21*
