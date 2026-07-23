---
title: Agent 评估框架 (Agent Evaluation)
category: 08-evaluation
tags: ["agent-evaluation", "task-completion", "tool-use", "safety", "benchmark"]
summary: "AI Agent 评估完整框架：任务完成率、工具使用准确性、多轮交互、安全性评估、主流基准（AgentBench/SWE-bench/WebArena）与 2026 实践。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# Agent 评估框架

## 1. Agent 评估挑战

```
Agent vs 传统 LLM 评估:
- LLM: 输入 → 输出 (单次评估)
- Agent: 多步决策 + 工具调用 + 环境交互 (过程评估)

评估维度:
1. 任务完成率 (做没做到?)
2. 效率 (用了多少步?)
3. 工具使用 (调对了吗?)
4. 安全性 (有没有搞破坏?)
5. 鲁棒性 (环境变化还能行吗?)
6. 成本 (花了多少 token/钱?)
```

## 2. 评估维度

### 2.1 核心指标

```python
AGENT_METRICS = {
    "任务完成": {
        "success_rate": "任务完全完成的比例",
        "partial_completion": "部分完成的比例",
        "goal_accuracy": "目标达成精确度",
    },
    "效率": {
        "num_steps": "完成任务的步骤数",
        "token_usage": "总 token 消耗",
        "time_to_complete": "完成时间",
        "cost_per_task": "每任务成本 ($)",
    },
    "工具使用": {
        "tool_selection_accuracy": "选对工具的比例",
        "parameter_accuracy": "参数正确的比例",
        "unnecessary_calls": "多余调用次数",
        "error_recovery": "错误后恢复能力",
    },
    "安全": {
        "harmful_action_rate": "有害操作比例",
        "permission_violation": "越权操作次数",
        "data_leakage": "数据泄露风险",
        "prompt_injection_resistance": "注入攻击抵抗",
    },
}
```

### 2.2 评估实现

```python
class AgentEvaluator:
    """Agent 评估框架"""
    
    def __init__(self, agent, environment, tasks):
        self.agent = agent
        self.env = environment
        self.tasks = tasks
    
    async def evaluate(self):
        results = []
        for task in self.tasks:
            # 重置环境
            self.env.reset(task.initial_state)
            
            # 运行 Agent
            trajectory = await self.run_agent(task)
            
            # 评估
            result = {
                "task_id": task.id,
                "success": self.env.check_success(task.goal),
                "steps": len(trajectory.actions),
                "tokens": trajectory.total_tokens,
                "tool_calls": self.analyze_tool_calls(trajectory),
                "safety": self.check_safety(trajectory),
            }
            results.append(result)
        
        return self.aggregate(results)
    
    async def run_agent(self, task, max_steps=50):
        """运行 Agent 直到完成或超时"""
        trajectory = Trajectory()
        
        for step in range(max_steps):
            obs = self.env.get_observation()
            action = await self.agent.act(obs)
            
            if action.type == "finish":
                break
            
            result = self.env.step(action)
            trajectory.add(obs, action, result)
            
            if result.is_terminal:
                break
        
        return trajectory
    
    def analyze_tool_calls(self, trajectory):
        """分析工具调用质量"""
        calls = trajectory.get_tool_calls()
        return {
            "total_calls": len(calls),
            "unique_tools": len(set(c.tool for c in calls)),
            "failed_calls": sum(1 for c in calls if c.error),
            "redundant_calls": self.detect_redundancy(calls),
        }
```

## 3. 主流基准

### 3.1 基准对比

| 基准 | 领域 | 任务数 | 评估方式 | 2026 SOTA |
|------|------|--------|---------|-----------|
| SWE-bench Verified | 代码修复 | 500 | 测试通过 | ~60% |
| WebArena | 网页操作 | 812 | 任务完成 | ~40% |
| AgentBench | 多环境 | 3.4K | 综合 | ~55% |
| GAIA | 通用助手 | 466 | 答案正确 | ~50% |
| ToolBench | 工具使用 | 16K+ | API 调用 | ~70% |
| OSWorld | 桌面操作 | 369 | 任务完成 | ~30% |
| τ-bench | 客服对话 | 1.5K | 策略合规 | ~65% |

### 3.2 SWE-bench 详解

```python
# SWE-bench: 真实 GitHub Issue 修复
# 2026 最重要的 Agent 基准

SWE_BENCH_EVAL = {
    "任务": "给定 repo + issue description → 生成 patch",
    "评估": "运行 repo 的测试套件",
    "指标": {
        "resolved": "所有测试通过",
        "partially_resolved": "部分测试通过",
        "regression": "引入新 bug",
    },
    "2026 SOTA": {
        "Claude Code + Sonnet 4": "~62%",
        "OpenAI Codex": "~58%",
        "Devin": "~55%",
        "SWE-agent + GPT-4o": "~45%",
    },
}
```

## 4. 安全评估

```python
class AgentSafetyEvaluator:
    """Agent 安全性评估"""
    
    SAFETY_TESTS = {
        "权限边界": [
            "尝试访问未授权文件",
            "尝试执行危险命令 (rm -rf)",
            "尝试修改系统配置",
        ],
        "Prompt 注入": [
            "工具返回中注入指令",
            "网页内容中嵌入攻击",
            "间接注入 (通过数据)",
        ],
        "数据保护": [
            "尝试泄露系统 prompt",
            "尝试访问其他用户数据",
            "尝试绕过内容过滤",
        ],
        "资源滥用": [
            "无限循环调用",
            "大量 API 请求",
            "过度 token 消耗",
        ],
    }
    
    def run_safety_suite(self, agent):
        results = {}
        for category, tests in self.SAFETY_TESTS.items():
            passed = 0
            for test in tests:
                if agent.resists(test):
                    passed += 1
            results[category] = passed / len(tests)
        return results
```

## 5. 交叉引用

- [[模型评估/LLM_Evaluation/|LLM 评估]]
- [[模型评估/Benchmarks/|基准测试]]
- [[智能体/|智能体系统]]
- [[测试/|测试]]
- [[伦理安全/|伦理安全]]
