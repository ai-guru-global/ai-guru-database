---
title: 多 Agent Harness 设计模式
category: 15-agent-production-agent-harness
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 当单个 Agent 无法高效完成复杂任务时，需要将任务拆分给多个协作 Agent。本文档详解多 Agent Harness 的核心设计模式：状态共享、通信协议、Handoff 机制与冲突解决。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Multi Agent Harness Design"
  - Multi_Agent_Harness_Design
sources: []

---
# 多 Agent Harness 设计模式

> 当单个 Agent 无法高效完成复杂任务时，需要将任务拆分给多个协作 Agent。本文档详解多 Agent Harness 的核心设计模式：状态共享、通信协议、Handoff 机制与冲突解决。

---

## 一、为什么需要多 Agent

### 1.1 单 Agent 的瓶颈

| 瓶颈 | 表现 | 多 Agent 解法 |
|------|------|--------------|
| **能力超载** | 一个 Agent 同时处理设计+编码+测试 | 分角色专精 |
| **上下文爆炸** | 长任务填满上下文窗口 | 分工后每个 Agent 上下文更聚焦 |
| **并行效率** | 串行执行耗时过长 | 子任务并行 |
| **冲突避免** | 同一 Agent 既写代码又审代码 | 分离执行者与审查者 |

### 1.2 适用场景

```
适合多 Agent：
  ✅ 端到端软件开发（产品 → 设计 → 前端 → 后端 → 测试 → 部署）
  ✅ 复杂数据分析（提取 → 清洗 → 建模 → 可视化 → 报告）
  ✅ 安全审计（扫描 → 分析 → 修复建议 → 验证）
  ✅ 内容创作（研究 → 写作 → 编辑 → 发布）

不适合多 Agent：
  ❌ 简单问答（单轮即可）
  ❌ 单一技能任务（如只生成一段代码）
  ❌ 上下文强依赖的连续任务（拆分会丢失上下文）
```

---

## 二、核心设计模式

### 2.1 模式一：流水线（Pipeline）

```
Agent A (提取) → Agent B (清洗) → Agent C (分析) → Agent D (报告)
     │                │                │               │
     └─ 输出文件 ─────┘                └─ 输出文件 ────┘
```

**特点**：单向数据流，每个 Agent 完成一个阶段，输出作为下一个的输入。

**实现要点**：
- 定义标准文件格式作为阶段间接口
- 每个阶段结束后做验证，失败则回滚
- 使用共享文件系统作为数据总线

```python
class PipelineHarness:
    def __init__(self, agents: List[Agent]):
        self.agents = agents
        self.workspace = "/tmp/pipeline"
    
    def run(self, input_data: str) -> str:
        current = input_data
        
        for i, agent in enumerate(self.agents):
            output_path = f"{self.workspace}/stage_{i}.json"
            
            # 执行当前阶段
            agent.run(f"Process: {current}\nOutput to: {output_path}")
            
            # 验证输出
            if not self._validate_stage(output_path):
                raise StageValidationError(f"Stage {i} failed")
            
            current = self._read_output(output_path)
        
        return current
```

**适用**：数据处理、内容生产、CI/CD 流程。

---

### 2.2 模式二：圆桌讨论（Roundtable）

```
        ┌─────────────┐
        │  Coordinator │
        └──────┬──────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
┌──────┐  ┌──────┐  ┌──────┐
│Agent A│  │Agent B│  │Agent C│
│(架构) │  │(编码) │  │(测试) │
└──┬───┘  └──┬───┘  └──┬───┘
   │         │         │
   └─────────┼─────────┘
             │
        ┌────┴────┐
        │ Consensus│
        └─────────┘
```

**特点**：Coordinator 主持讨论，各 Agent 发表意见，达成共识后执行。

**实现要点**：
- Coordinator 负责话题管理和回合控制
- 每个 Agent 有明确的角色定义（System Prompt）
- 设置最大讨论轮数，避免无限循环

```python
class RoundtableHarness:
    def __init__(self, coordinator: Agent, experts: List[Agent], max_rounds: int = 5):
        self.coordinator = coordinator
        self.experts = experts
        self.max_rounds = max_rounds
    
    def discuss(self, topic: str) -> str:
        discussion_log = []
        
        for round_num in range(self.max_rounds):
            round_opinions = []
            
            # 每个 Expert 发表意见
            for expert in self.experts:
                opinion = expert.run(f"""
Topic: {topic}
Discussion so far: {discussion_log}
Your role: {expert.role}
Give your opinion and reasoning.
""")
                round_opinions.append({"expert": expert.name, "opinion": opinion})
            
            discussion_log.append({"round": round_num, "opinions": round_opinions})
            
            # Coordinator 判断是否达成共识
            consensus = self.coordinator.run(f"""
Topic: {topic}
Round {round_num} opinions:
{json.dumps(round_opinions, indent=2)}

Have we reached consensus? If yes, summarize the decision.
If no, identify disagreements and suggest next focus.
""")
            
            if "CONSENSUS_REACHED" in consensus:
                return consensus
        
        # 未达成共识，Coordinator 做最终决定
        return self.coordinator.run(f"Max rounds reached. Make a decision based on:\n{discussion_log}")
```

**适用**：架构设计、方案评审、复杂决策。

---

### 2.3 模式三：派生-合并（Fork-Join）

```
         ┌─────────┐
         │  Planner │
         └────┬────┘
              │
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
┌──────┐ ┌──────┐ ┌──────┐
│Task 1│ │Task 2│ │Task 3│
└──┬───┘ └──┬───┘ └──┬───┘
   │        │        │
   └────────┼────────┘
            │
            ▼
       ┌─────────┐
       │  Merger  │
       └─────────┘
```

**特点**：Planner 拆分任务，多个 Worker 并行执行，Merger 汇总结果。

**实现要点**：
- Planner 输出结构化任务列表（JSON/YAML）
- Worker Agent 独立执行，互不干扰
- Merger 负责冲突检测和结果整合

```python
class ForkJoinHarness:
    def __init__(self, planner: Agent, workers: List[Agent], merger: Agent):
        self.planner = planner
        self.workers = workers
        self.merger = merger
    
    def run(self, task: str) -> str:
        # 1. Plan
        plan = self.planner.run(f"Break down this task into parallel subtasks: {task}")
        subtasks = self._parse_plan(plan)
        
        # 2. Fork - 并行执行
        results = {}
        with ThreadPoolExecutor(max_workers=len(self.workers)) as executor:
            futures = {
                executor.submit(self._execute_subtask, worker, subtask): subtask_id
                for worker, (subtask_id, subtask) in zip(self.workers, subtasks.items())
            }
            
            for future in futures:
                subtask_id = futures[future]
                results[subtask_id] = future.result()
        
        # 3. Join - 合并结果
        merged = self.merger.run(f"""
Original task: {task}
Subtask results:
{json.dumps(results, indent=2)}

Merge these results into a coherent final output. Resolve any conflicts.
""")
        
        return merged
    
    def _parse_plan(self, plan: str) -> dict:
        # 解析 Planner 输出的任务列表
        # 期望格式：{"task_1": "description", "task_2": "description", ...}
        try:
            return json.loads(plan)
        except:
            # 回退：按行解析
            lines = plan.strip().split("\n")
            return {f"task_{i}": line for i, line in enumerate(lines) if line.strip()}
    
    def _execute_subtask(self, worker: Agent, subtask: str) -> str:
        return worker.run(f"Complete this subtask independently: {subtask}")
```

**适用**：大规模数据处理、批量代码生成、多维度分析。

---

### 2.4 模式四：层级指挥链（Chain of Command）

```
┌─────────────┐
│   Manager   │  (战略层：决定做什么)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Lead      │  (战术层：决定怎么做)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Worker    │  (执行层：实际执行)
└─────────────┘
```

**特点**：层级管理，上层做决策，下层执行，信息逐级过滤。

**实现要点**：
- 每层有明确的决策权限边界
- 下层遇到超出权限的问题时上报
- 使用共享状态文件保持层级间同步

```python
class ChainOfCommandHarness:
    def __init__(self, manager: Agent, lead: Agent, workers: List[Agent]):
        self.manager = manager
        self.lead = lead
        self.workers = workers
        self.state_file = "/tmp/harness/state.json"
    
    def run(self, goal: str) -> str:
        # Manager 制定战略
        strategy = self.manager.run(f"As Manager, define strategy for: {goal}")
        self._update_state("strategy", strategy)
        
        # Lead 制定战术计划
        plan = self.lead.run(f"""
Strategy: {strategy}
As Lead, create a detailed execution plan.
""")
        self._update_state("plan", plan)
        
        # Workers 执行
        results = []
        for worker in self.workers:
            result = worker.run(f"""
Plan: {plan}
Your assignment: [specific part from plan]
Execute and report progress.
""")
            results.append(result)
            self._update_state(f"worker_{worker.id}", result)
        
        # Lead 验收
        final = self.lead.run(f"Review worker results and produce final output: {results}")
        return final
```

**适用**：企业级工作流、需要审批链的场景。

---

## 三、状态共享与同步

### 3.1 共享状态模式

| 模式 | 实现 | 优点 | 缺点 |
|------|------|------|------|
| **文件系统** | 共享目录读写 | 简单、持久化 | 冲突风险、需要锁 |
| **状态数据库** | Redis / PostgreSQL | 结构化、事务支持 | 增加复杂度 |
| **消息队列** | RabbitMQ / Kafka | 异步解耦 | 延迟、需要消费者 |
| **事件总线** | 内存事件分发 | 低延迟 | 易丢失、难持久 |

### 3.2 文件系统共享（推荐）

```python
class SharedFilesystem:
    """基于文件系统的状态共享，带乐观锁"""
    
    def __init__(self, workspace: str):
        self.workspace = workspace
        os.makedirs(workspace, exist_ok=True)
    
    def write(self, agent_id: str, key: str, value: str):
        """Agent 写入状态"""
        path = f"{self.workspace}/{key}.json"
        
        # 乐观锁：检查是否有其他 Agent 在修改
        lock_path = f"{path}.lock"
        if os.path.exists(lock_path):
            raise ConflictError(f"Key {key} is being modified by another agent")
        
        # 写入锁文件
        with open(lock_path, "w") as f:
            f.write(agent_id)
        
        try:
            # 读取现有状态（如果有）
            state = {}
            if os.path.exists(path):
                with open(path) as f:
                    state = json.load(f)
            
            # 更新状态
            state[agent_id] = {
                "value": value,
                "timestamp": datetime.now().isoformat()
            }
            
            with open(path, "w") as f:
                json.dump(state, f, indent=2)
        finally:
            os.remove(lock_path)
    
    def read(self, key: str) -> dict:
        path = f"{self.workspace}/{key}.json"
        if not os.path.exists(path):
            return {}
        with open(path) as f:
            return json.load(f)
```

### 3.3 事件驱动同步

```python
from dataclasses import dataclass
from typing import Callable
from datetime import datetime

@dataclass
class AgentEvent:
    source: str
    event_type: str  # "started", "completed", "failed", "updated"
    payload: dict
    timestamp: datetime

class EventBus:
    """Agent 间事件总线"""
    
    def __init__(self):
        self.subscribers: dict[str, List[Callable]] = {}
        self.event_log: List[AgentEvent] = []
    
    def subscribe(self, event_type: str, handler: Callable):
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(handler)
    
    def publish(self, event: AgentEvent):
        self.event_log.append(event)
        
        handlers = self.subscribers.get(event.event_type, [])
        for handler in handlers:
            try:
                handler(event)
            except Exception as e:
                print(f"Event handler error: {e}")
    
    def get_history(self, source: str = None, event_type: str = None) -> List[AgentEvent]:
        events = self.event_log
        if source:
            events = [e for e in events if e.source == source]
        if event_type:
            events = [e for e in events if e.event_type == event_type]
        return events
```

---

## 四、Handoff 协议

### 4.1 Handoff 定义

Handoff 是一个 Agent 将任务/控制权转移给另一个 Agent 的机制。

```
Agent A ──handoff──> Agent B
   │                    │
   │  1. 打包上下文      │  2. 接收上下文
   │  3. 标记完成        │  4. 继续执行
```

### 4.2 Handoff 数据包

```python
@dataclass
class HandoffPackage:
    """Handoff 时传递的数据包"""
    source_agent: str
    target_agent: str
    task_description: str
    context_summary: str
    files_modified: List[str]
    key_decisions: List[str]
    open_issues: List[str]
    checkpoint_ref: str  # Git commit hash or snapshot ID
```

### 4.3 Handoff 实现

```python
class HandoffManager:
    def __init__(self, workspace: str):
        self.workspace = workspace
    
    def handoff(self, source: Agent, target: Agent, reason: str) -> str:
        """执行 Handoff"""
        
        # 1. 源 Agent 生成 Handoff 包
        package = source.run(f"""
You are handing off to {target.name}.
Reason: {reason}

Generate a handoff package including:
1. What was accomplished
2. Current state of work
3. Files modified
4. Key decisions made
5. Open issues / blockers
6. Next steps for the receiving agent

Format as structured JSON.
""")
        
        # 2. 创建 Git checkpoint
        checkpoint = self._create_checkpoint(source.name)
        
        # 3. 写入 Handoff 文件
        handoff_file = f"{self.workspace}/HANDOFF.md"
        with open(handoff_file, "w") as f:
            f.write(f"""# Handoff: {source.name} → {target.name}

**Reason**: {reason}
**Checkpoint**: {checkpoint}
**Time**: {datetime.now().isoformat()}

{package}
""")
        
        # 4. 目标 Agent 接收
        result = target.run(f"""
You are receiving a handoff from {source.name}.

Read {handoff_file} for full context.

Continue the work from where {source.name} left off.
""")
        
        return result
    
    def _create_checkpoint(self, agent_name: str) -> str:
        import subprocess
        result = subprocess.run(
            ["git", "add", "."],
            cwd=self.workspace,
            capture_output=True
        )
        result = subprocess.run(
            ["git", "commit", "-m", f"Handoff checkpoint from {agent_name}"],
            cwd=self.workspace,
            capture_output=True
        )
        result = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            cwd=self.workspace,
            capture_output=True,
            text=True
        )
        return result.stdout.strip()
```

---

## 五、冲突检测与解决

### 5.1 常见冲突类型

| 冲突类型 | 场景 | 检测方式 | 解决策略 |
|---------|------|---------|---------|
| **文件冲突** | 两个 Agent 修改同一文件 | Git diff / 文件锁 | 最后写入者胜 / 合并 / 人工裁决 |
| **决策冲突** | 两个 Agent 做出矛盾决策 | 状态对比 | 投票 / 升级仲裁 / 回溯 |
| **资源冲突** | 争夺有限资源（API 配额、GPU） | 配额监控 | 优先级队列 / 熔断 |
| **循环依赖** | A 等 B，B 等 A | 依赖图检测 | 超时回退 / 协调者介入 |

### 5.2 冲突解决器

```python
class ConflictResolver:
    def __init__(self, arbitrator: Agent = None):
        self.arbitrator = arbitrator
    
    def resolve_file_conflict(self, path: str, versions: List[dict]) -> str:
        """解决文件修改冲突"""
        
        if len(versions) == 1:
            return versions[0]["content"]
        
        # 尝试自动合并（基于行）
        merged = self._attempt_merge(versions)
        if merged:
            return merged
        
        # 无法自动合并，交给仲裁 Agent
        if self.arbitrator:
            return self.arbitrator.run(f"""
File conflict in {path}.
Versions:
{json.dumps(versions, indent=2)}

Please merge these versions intelligently, preserving all valuable changes.
""")
        
        # 回退策略：最后写入者
        return versions[-1]["content"]
    
    def resolve_decision_conflict(self, decisions: List[dict]) -> dict:
        """解决决策冲突"""
        
        # 统计投票
        vote_count = {}
        for d in decisions:
            key = json.dumps(d, sort_keys=True)
            vote_count[key] = vote_count.get(key, 0) + 1
        
        # 多数决
        if vote_count:
            winner = max(vote_count, key=vote_count.get)
            return json.loads(winner)
        
        return decisions[0]  # 回退：第一个决策
    
    def _attempt_merge(self, versions: List[dict]) -> str:
        """尝试基于行的三路合并"""
        # 简化实现：找共同行，拼接差异行
        all_lines = set()
        for v in versions:
            all_lines.update(v["content"].split("\n"))
        
        # 如果差异太大，返回 None（需要人工/仲裁）
        if len(all_lines) > len(versions[0]["content"].split("\n")) * 1.5:
            return None
        
        return "\n".join(sorted(all_lines))
```

---

## 六、设计检查清单

构建多 Agent Harness 时，检查以下要点：

### 架构设计

- [ ] 选择了合适的设计模式（Pipeline / Roundtable / Fork-Join / Chain）
- [ ] 每个 Agent 有明确的角色定义和权限边界
- [ ] 定义了 Agent 间通信协议（文件 / 事件 / API）
- [ ] 定义了标准数据交换格式

### 状态管理

- [ ] 选择了状态共享方案
- [ ] 实现了乐观锁或事务机制
- [ ] 有状态持久化和恢复方案
- [ ] 定义了状态清理策略（防止无限增长）

### 容错设计

- [ ] 有 Handoff 超时机制
- [ ] 有子 Agent 失败时的回退策略
- [ ] 有循环依赖检测
- [ ] 有全局超时控制

### 观测性

- [ ] 每个 Agent 的执行有独立 Trace
- [ ] Agent 间通信有日志记录
- [ ] 冲突事件有告警
- [ ] 整体任务进度可追踪

---

## 七、反模式

| 反模式 | 问题 | 正确做法 |
|--------|------|---------|
| **Agent 过多** | 管理复杂度指数增长 | 保持 2-5 个核心 Agent，超过则用子 Harness |
| **过度通信** | Agent 间频繁闲聊，效率低下 | 批量传递信息，减少往返 |
| **上下文膨胀** | 每个 Agent 加载全部上下文 | 只传递相关子集 |
| **单点瓶颈** | Coordinator 成为性能瓶颈 | 扁平化结构或使用事件驱动 |
| **缺乏退出条件** | 讨论/循环永不结束 | 严格设置最大轮数和时间上限 |

---

## 🔗 相关主题

- [Agent Harness 速览](./Harness-in-nutshell.md) — 核心概念速查
- [Harness Implementation Guide](./Harness_Implementation_Guide.md) — 单 Agent Harness 实现
- [Agent Harness 技术架构 2026](./Agent_Harness_Architecture_2026.md) — 框架选型与性能基线
- [Harness Security Guide](./Harness_Security_Guide.md) — 多 Agent 安全隔离
- [Harness Testing Guide](./Harness_Testing_Guide.md) — 多 Agent 测试策略
- [Agent Skills 书写速览](../Agent_Skills/Skills-in-nutshell.md) — 为 Agent 注入领域知识
- [Agent_Evaluation](../Agent_Evaluation/) — 多 Agent 评估方法

---

> 📅 **最后更新**：2026-05-07

## Related

- [[Agent/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
