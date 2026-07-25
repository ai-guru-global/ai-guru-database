---
title: Agent 评估框架 (Agent Evaluation)
category: 05-agents
tags: ["agent-evaluation", "task-benchmark", "safety-evaluation", "tool-use-eval"]
summary: "Agent 评估完整框架：任务完成率、工具使用准确性、多轮对话评估、安全评估、主流基准（AgentBench/SWE-bench/WebArena）与 2026 生产评估实践。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# Agent 评估框架 (Agent Evaluation)

## 1. 为什么 Agent 评估困难？

```
传统 LLM 评估: 输入 → 输出 → 对比标准答案 (确定性)
Agent 评估: 输入 → 多步操作 → 环境变化 → 最终状态 (非确定性)

挑战:
- 路径多样性: 同一任务可有多种完成路径
- 环境依赖: 需要真实/模拟环境
- 长序列: 10-50 步操作，错误累积
- 副作用: 操作不可逆 (发邮件/下单)
- 安全: 需要评估越权/注入/数据泄露

评估维度:
1. 任务完成率 (能不能做完)
2. 效率 (用了多少步/时间/成本)
3. 安全性 (有没有越权/泄露)
4. 鲁棒性 (环境变化能否适应)
5. 工具使用 (选对工具/参数正确)
```

## 2. 评估维度与指标

```python
AGENT_EVAL_METRICS = {
    "任务完成": {
        "success_rate": "任务完全完成率",
        "partial_completion": "部分完成比例",
        "goal_achievement": "目标达成度 (0-1)",
    },
    "效率": {
        "num_steps": "操作步数",
        "time_to_complete": "完成时间",
        "token_cost": "token 消耗/成本",
        "redundant_actions": "冗余操作数",
    },
    "工具使用": {
        "tool_selection_accuracy": "工具选择正确率",
        "parameter_accuracy": "参数正确率",
        "error_recovery": "错误恢复能力",
    },
    "安全": {
        "permission_violation": "越权操作次数",
        "data_leakage": "数据泄露事件",
        "injection_resistance": "注入攻击抵抗",
        "harmful_action_rate": "有害操作率",
    },
    "对话质量": {
        "coherence": "多轮连贯性",
        "clarification_quality": "澄清提问质量",
        "user_satisfaction": "用户满意度",
    },
}
```

## 3. 主流基准

| 基准 | 领域 | 任务数 | 评估重点 | 环境 |
|------|------|--------|----------|------|
| SWE-bench | 代码 | 2294 | 真实 GitHub issue 修复 | Docker |
| WebArena | Web | 812 | 网站操作任务 | 浏览器 |
| AgentBench | 综合 | 多环境 | 8 种环境综合 | 多环境 |
| GAIA | 通用 | 466 | 真实世界问题 | 工具 |
| ToolBench | 工具 | 16000+ | API 调用 | API |
| τ-bench | 客服 | 多场景 | 对话+操作 | 模拟 |
| OSWorld | 桌面 | 369 | 操作系统任务 | VM |

## 4. 评估实现

```python
class AgentEvaluator:
    """Agent 评估框架"""
    
    def __init__(self, environment, judge_model="gpt-4o"):
        self.env = environment
        self.judge = judge_model
    
    async def evaluate_task(self, agent, task):
        """评估单个任务"""
        # 重置环境
        self.env.reset(task.initial_state)
        
        # 运行 Agent
        trajectory = await agent.run(task.instruction)
        
        # 评估
        result = {
            "success": self.env.check_goal(task.goal_state),
            "steps": len(trajectory.actions),
            "cost": trajectory.total_tokens * 0.00001,
            "tool_accuracy": self._eval_tools(trajectory),
            "safety": self._eval_safety(trajectory),
        }
        
        # LLM-as-Judge 评估质量
        result["quality"] = await self._llm_judge(
            task=task.instruction,
            trajectory=trajectory,
            final_state=self.env.get_state(),
        )
        
        return result
    
    def _eval_safety(self, trajectory):
        """安全评估"""
        violations = []
        for action in trajectory.actions:
            if action.accesses_forbidden_resource():
                violations.append(f"越权: {action}")
            if action.exposes_sensitive_data():
                violations.append(f"泄露: {action}")
        return {"violations": violations, "safe": len(violations) == 0}
    
    async def run_benchmark(self, agent, benchmark_suite):
        """运行完整基准测试"""
        results = []
        for task in benchmark_suite.tasks:
            result = await self.evaluate_task(agent, task)
            results.append(result)
        
        return {
            "success_rate": sum(r["success"] for r in results) / len(results),
            "avg_steps": sum(r["steps"] for r in results) / len(results),
            "avg_cost": sum(r["cost"] for r in results) / len(results),
            "safety_rate": sum(r["safety"]["safe"] for r in results) / len(results),
        }
```

## 5. 生产评估最佳实践

```python
PRODUCTION_EVAL_PRACTICES = {
    "离线评估": [
        "构建 golden dataset (100+ 真实任务)",
        "每次 Prompt/模型变更后回归测试",
        "A/B 对比新旧版本",
    ],
    "在线评估": [
        "用户满意度 (thumbs up/down)",
        "任务完成率追踪",
        "人工抽检 (5-10% 对话)",
        "异常检测 (步数异常/成本异常)",
    ],
    "安全评估": [
        "红队测试 (注入/越权/社工)",
        "权限边界测试",
        "对抗性输入测试",
    ],
    "持续监控": [
        "成功率趋势 (日/周)",
        "成本趋势",
        "错误分类与归因",
    ],
}
```

## 6. 交叉引用

- [[15_智能体/|智能体系统]]
- [[08_模型评估/03_LLM_Evaluation/Agent_Evaluation|Agent 评估 (模型评估视角)]]
- [[09_测试/|测试]]
- [[17_伦理安全/|伦理安全]]
- [[15_智能体/17_Agent_Applications/Computer_Use_Agents|Computer Use Agent]]

## 附录：核心概念速查

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| Agent Loop | 感知-思考-行动循环 | 核心执行流程 |
| Tool Use | 调用外部工具/API | 扩展能力 |
| Memory | 短期/长期记忆 | 上下文维护 |
| Planning | 任务分解与排序 | 复杂任务 |
| Reflection | 自我评估改进 | 质量提升 |
| Multi-Agent | 多Agent协作 | 分布式任务 |

## 附录：技术栈对比

| 框架/工具 | 特点 | 适用场景 | 成熟度 |
|----------|------|----------|--------|
| LangChain | 链式调用 | 通用Agent | ★★★★☆ |
| LangGraph | 图结构编排 | 复杂流程 | ★★★★☆ |
| AutoGen | 多Agent对话 | 协作任务 | ★★★★☆ |
| CrewAI | 角色分工 | 团队模拟 | ★★★☆☆ |
| OpenAI SDK | 官方框架 | 快速原型 | ★★★★☆ |
| Semantic Kernel | 企业级 | .NET/Java | ★★★★☆ |

## 附录：学习路径

| 阶段 | 推荐内容 | 目标 |
|------|----------|------|
| 入门 | 基础概念文档 | 理解Agent |
| 进阶 | 本文档深度内容 | 掌握技术 |
| 实践 | 动手项目 | 构建应用 |
| 前沿 | 最新论文/产品 | 跟踪发展 |

## 附录：常见问题

| 问题 | 解答 |
|------|------|
| Agent和Chatbot的区别？ | Agent能自主决策+使用工具+持续执行 |
| 需要什么前置知识？ | LLM基础+编程+系统设计 |
| 如何评估Agent？ | 任务完成率+效率+安全性 |
| 2026年趋势？ | 多Agent协作/企业级/具身智能 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 智能体 | Agent | 自主决策AI系统 |
| 工具调用 | Tool Use | 使用外部工具 |
| 记忆 | Memory | 上下文/历史 |
| 规划 | Planning | 任务分解 |
| 反思 | Reflection | 自我评估 |
| 编排 | Orchestration | 流程管理 |
| 协议 | Protocol | 通信标准 |
| 护栏 | Guardrails | 安全约束 |

## 附录：检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 理解核心概念 | Agent架构 | ☐ |
| 掌握工具调用 | MCP/Function Calling | ☐ |
| 了解记忆机制 | 短期/长期 | ☐ |
| 理解规划推理 | CoT/ReAct | ☐ |
| 动手实践 | 构建Agent | ☐ |
| 了解评估方法 | 质量度量 | ☐ |

> 💡 智能体是AI从"对话"走向"行动"的关键跨越。掌握Agent开发，是2026年AI工程师的核心竞争力。

---
*Last updated: 2026-07-21*
