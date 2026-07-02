---
title: Agent Harness 速览
category: 15-agent-production-agent-harness
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 一句话：**Agent = Model + Harness**。Harness 是模型之外的一切——让裸模型变成可工作的 Agent 的工程系统。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Harness In Nutshell"
  - "Harness in nutshell"

---
# Agent Harness 速览

> 一句话：**Agent = Model + Harness**。Harness 是模型之外的一切——让裸模型变成可工作的 Agent 的工程系统。

---

## TL;DR（30 秒速查）

```
Agent = Model（智能） + Harness（工程系统）
```

**Harness 包含 5 层**：

| 层 | 职责 | 关键组件 |
|----|------|---------|
| **上下文层** | 组装模型输入 | System Prompt、Memory、Skills、Tools |
| **编排层** | 决定怎么干 | 模型路由、子 Agent 派生、Handoff |
| **执行层** | 安全执行 | Docker 沙箱、Bash、文件系统、浏览器 |
| **钩子层** | 防止跑偏 | 上下文压缩、工具输出裁剪、Ralph Loop 续写 |
| **观测层** | 监控一切 | Traces、Metrics、成本追踪、告警 |

**快速启动**（Python 最小 Harness）：

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class MinimalHarness:
    def __init__(self, model="gpt-4o"):
        self.model = model
        self.messages = []
        self.workspace = "/tmp/agent_workspace"
        os.makedirs(self.workspace, exist_ok=True)
    
    def run(self, task: str, max_steps: int = 10):
        self.messages.append({"role": "user", "content": task})
        
        for step in range(max_steps):
            response = client.chat.completions.create(
                model=self.model,
                messages=self.messages,
                tools=[self._bash_tool()]
            )
            msg = response.choices[0].message
            self.messages.append(msg)
            
            if not msg.tool_calls:
                return msg.content
            
            for tc in msg.tool_calls:
                result = self._execute_bash(tc.function.arguments)
                self.messages.append({
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": result
                })
        
        return "达到最大步数限制"
    
    def _bash_tool(self):
        return {
            "type": "function",
            "function": {
                "name": "bash",
                "description": "Execute bash commands in the workspace",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "command": {"type": "string"}
                    },
                    "required": ["command"]
                }
            }
        }
    
    def _execute_bash(self, arguments: str):
        import json, subprocess
        cmd = json.loads(arguments)["command"]
        try:
            result = subprocess.run(
                cmd, shell=True, cwd=self.workspace,
                capture_output=True, text=True, timeout=60
            )
            return f"stdout: {result.stdout}\nstderr: {result.stderr}"
        except Exception as e:
            return str(e)

# 使用
harness = MinimalHarness()
result = harness.run("Create a hello.py that prints 'Hello Harness' and run it")
print(result)
```

---

## 一、核心公式

$$
\text{Agent} = \text{Model} + \text{Harness}
$$

**如果你不是 Model，你就是 Harness。**

裸模型只能接收文本/图像并输出文本。它不能：
- ❌ 记住跨会话的状态
- ❌ 执行代码或访问文件
- ❌ 获取实时知识
- ❌ 安装依赖或设置环境

**Harness 把这些能力赋予模型**，让它成为真正的 Agent。

---

## 二、Harness 核心组件

### 2.1 文件系统（最基础的原语）

为什么文件系统最重要？

- **工作区**：读取数据、代码、文档
- **增量卸载**：不必把一切都塞在上下文里
- **协作表面**：多个 Agent 和人类通过共享文件协作
- **版本控制**：Git 追踪工作、回滚、分支实验

```python
class FilesystemHarness:
    def __init__(self, workspace_dir: str):
        self.workspace = workspace_dir
        os.makedirs(workspace_dir, exist_ok=True)
    
    def read(self, path: str) -> str:
        with open(f"{self.workspace}/{path}") as f:
            return f.read()
    
    def write(self, path: str, content: str):
        with open(f"{self.workspace}/{path}", "w") as f:
            f.write(content)
    
    def checkpoint(self, message: str):
        # git add + commit
        pass
```

### 2.2 Bash + 代码执行（通用工具）

与其为每个操作预定义工具，不如给 Agent 一个计算机：

```python
# Agent 自己写代码解决新问题
harness.run("""
I need to analyze a CSV file. 
Write a Python script to count rows and columns,
then run it on data.csv.
""")
```

### 2.3 沙箱（安全执行环境）

| 沙箱类型 | 启动时间 | 适用场景 |
|---------|---------|---------|
| Docker 容器 | 1-5s | 通用代码执行 |
| MicroVM (Firecracker) | <1s | 高安全场景 |
| gVisor | <1s | 平衡安全与性能 |
| WebAssembly | <100ms | 轻量工具执行 |
| 远程沙箱 (E2B) | 2-10s | 云端大规模评测 |

### 2.4 上下文工程（Context Engineering）

Harness 本质上是**好的上下文工程的交付机制**：

| 策略 | 解决问题 | 实现方式 |
|------|---------|---------|
| **Compaction** | 上下文快满了 | 智能摘要 + 卸载历史到文件 |
| **Tool Output Offload** | 大输出污染上下文 | 保留头尾，完整输出存文件 |
| **Skills** | 太多工具降低启动性能 | 渐进式加载，按需激活 |
| **Memory Injection** | 跨会话记忆 | AGENTS.md 注入、向量检索 |

### 2.5 验证回路（Verification Loop）

```
Plan → Execute → Verify
              ↓ Fail
         Fix → Execute → Verify
              ↓ Pass
         Next Step
```

| 验证方式 | 适用场景 |
|---------|---------|
| 测试套件 | 代码修改后验证 |
| Lint/类型检查 | 代码质量保证 |
| 截图比对 | UI 修改验证 |
| 日志检查 | 部署后验证 |
| LLM 自评 | 开放域任务 |

### 2.6 长程执行（Long-Horizon）

| 模式 | 关键技术 |
|------|---------|
| **Ralph Loop** | 拦截退出 → 注入原 Prompt 到新上下文 |
| **Plan File** | 计划写入文件，每次迭代读取更新 |
| **Git Checkpoint** | 每步自动 commit |
| **子 Agent 分工** | 大任务拆分给并行 Agent |

---

## 三、5 层架构速览

```
┌─────────────────────────────────────────┐
│  Context Layer（上下文层）               │
│  System Prompt + Memory + Skills + Tools │
├─────────────────────────────────────────┤
│  Orchestration Layer（编排层）           │
│  Model 路由 + 子 Agent + Handoff        │
├─────────────────────────────────────────┤
│  Execution Layer（执行层）               │
│  Docker 沙箱 + Bash + 文件系统 + 浏览器  │
├─────────────────────────────────────────┤
│  Hooks & Middleware（钩子层）            │
│  压缩 + 续写 + Lint + 审计              │
├─────────────────────────────────────────┤
│  Observability Layer（观测层）           │
│  Traces + Metrics + 成本 + 告警         │
└─────────────────────────────────────────┘
```

---

## 四、关键配置速查

### 运行时

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `max_steps` | 50 | 单任务最大步数 |
| `timeout` | 600s | 任务超时 |
| `compaction_threshold` | 0.8 | 上下文使用率触发压缩 |
| `temperature` | 0.0 | 模型温度（Agent 任务建议 0） |

### 沙箱

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `sandbox_type` | docker | docker / microvm / gvisor |
| `network_access` | false | 是否允许网络 |
| `command_allowlist` | [] | 命令白名单 |

### 安全

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `require_human_approval` | [rm, drop, delete] | 需人工确认的关键词 |
| `max_cost_per_task` | $10.0 | 单任务成本上限 |
| `audit_log_enabled` | true | 审计日志 |

---

## 五、性能基线（2026-04）

| 指标 | 基线目标 | 优秀标准 |
|------|---------|---------|
| 任务成功率 | ≥ 80% | ≥ 95% |
| 平均完成步数 | ≤ 15 | ≤ 8 |
| 首次成功率 | ≥ 60% | ≥ 85% |
| P95 延迟 | ≤ 120s | ≤ 60s |
| 单任务成本 | ≤ $0.50 | ≤ $0.10 |
| 安全违规率 | **0%** | **0%** |

**Harness 设计对性能的影响**：

| 特性 | 影响 |
|------|------|
| 好的 System Prompt | +5-15% 成功率 |
| 文件系统访问 | +10-20% 成功率 |
| 验证回路 | +15-25% 成功率 |
| Ralph Loop 续写 | +20-30% 长任务成功率 |
| 子 Agent 并行 | 2-5x 效率提升 |

---

## 六、Harness 与 Agent Skills 的关系

```
┌─────────────────────────────────────────┐
│           Agent（完整系统）              │
├─────────────────────────────────────────┤
│  Harness（工程基础设施）                 │
│  ├── 上下文层 ←── Agent Skills 注入此处  │
│  ├── 编排层                              │
│  ├── 执行层                              │
│  ├── 钩子层                              │
│  └── 观测层                              │
├─────────────────────────────────────────┤
│  Model（大语言模型）                     │
└─────────────────────────────────────────┘
```

**一句话关系**：
- **Harness** = 运行 Agent 的"操作系统"（怎么运行、怎么编排、怎么约束）
- **Agent Skills** = 注入 Harness 上下文层的"专业知识包"（告诉 Agent 特定任务怎么做）

两者协同：Harness 提供运行时，Skills 提供领域知识。

---

## 七、常见陷阱与解决方案

| 陷阱 | 症状 | 解决方案 |
|------|------|---------|
| **上下文溢出** | 一次性加载所有工具描述 | Skills 渐进式加载 |
| **无限循环** | Agent 陷入重试循环 | `max_steps` + 降级策略 |
| **沙箱逃逸** | Agent 执行危险操作 | 命令白名单 + 网络隔离 |
| **成本失控** | 长链路 Token 消耗过大 | 成本上限 + 实时监控 |
| **单点故障** | 依赖单一模型或 API | 多模型 fallback + 熔断 |
| **幻觉传播** | 错误中间结果后续使用 | 每步验证 + 事实检查 |
| **Context Rot** | 上下文窗口填满后推理质量下降 | 压缩 + 工具输出裁剪 |
| **过早停止** | 复杂任务没做完就退出 | Ralph Loop 续写 |

---

## 八、调试排错

### Harness 启动失败？

1. **检查沙箱可用性**：`docker ps` 确认 Docker 守护进程运行
2. **检查工作区权限**：Agent 是否有读写工作区目录的权限
3. **检查模型 API Key**：环境变量是否正确设置
4. **检查工具 Schema**：工具定义的 JSON Schema 是否有效

### Agent 陷入无限循环？

| 症状 | 根因 | 修复 |
|------|------|------|
| 重复执行相同命令 | 工具输出无变化，Agent 认为没完成 | 添加状态检查，输出变化时才继续 |
| 反复修改同一文件 | 没有验证回路 | 添加 Lint/测试验证 |
| 步数耗尽仍未完成 | 任务过于复杂 | 拆分为子任务，使用 Plan File |

### 工具调用失败？

```python
# 1. 检查工具 Schema
print(json.dumps(tool_schema, indent=2))

# 2. 检查参数传递
print(f"Tool: {tool_name}, Args: {arguments}")

# 3. 沙箱内手动复现
subprocess.run(["docker", "exec", container_id, "bash", "-c", command])

# 4. 检查权限
# 沙箱内运行 `whoami && ls -la workspace/`
```

### 上下文窗口溢出？

```python
# 监控上下文使用率
context_tokens = sum(len(m["content"]) for m in messages) / 4
window_size = 128000
usage_ratio = context_tokens / window_size

if usage_ratio > 0.8:
    # 触发压缩：摘要历史消息
    summary = model.summarize(messages[:len(messages)//2])
    messages = [{"role": "system", "content": summary}] + messages[len(messages)//2:]
```

### 成本异常飙升？

```bash
# 查看每步 Token 用量
for step in trace.steps:
    print(f"Step {step.id}: prompt={step.prompt_tokens}, completion={step.completion_tokens}")

# 检查是否有重复工具调用
from collections import Counter
tool_counts = Counter([tc.function.name for tc in all_tool_calls])
print(tool_counts.most_common(5))
```

---

## 九、框架选型速查

| 场景 | 推荐 | 理由 |
|------|------|------|
| 快速原型 | CrewAI | 最低学习曲线 |
| 复杂状态机 | LangGraph | 状态图建模 |
| 多 Agent 对话 | AutoGen | Group Chat 原生支持 |
| 大规模并发 | AgentScope | 100+ Agent 并发 |
| 极致可控 | 自建 Harness | 完全定制 |
| 企业级生产 | Hermes Agent + 自建 | 安全合规 + 定制编排 |

---

## 十、上线检查清单

- [ ] 核心任务成功率 ≥ 90%
- [ ] 安全严重问题 = 0
- [ ] 单任务成本回归 < 10%
- [ ] P95 延迟回归 < 15%
- [ ] 审计日志完整
- [ ] 回滚方案验证通过
- [ ] 监控告警配置就绪
- [ ] 红队测试通过

---

## 🔗 相关主题

- [The Anatomy of an Agent Harness](./The_Anatomy_of_an_Agent_Harness.md) — Harness 定义与核心组件推导
- [Agent Harness 技术架构 2026](./Agent_Harness_Architecture_2026.md) — 完整架构、配置、性能、角色指南
- [Harness Implementation Guide](./Harness_Implementation_Guide.md) — 从零搭建生产级 Harness
- [Harness Security Guide](./Harness_Security_Guide.md) — 安全深度指南
- [Harness Deployment Guide](./Harness_Deployment_Guide.md) — 容器化与 K8s 部署
- [Harness Testing Guide](./Harness_Testing_Guide.md) — 测试策略与 CI/CD
- [Harness Ecosystem Catalog](./Harness_Ecosystem_Catalog.md) — 平台与框架选型
- [Multi Agent Harness Design](./Multi_Agent_Harness_Design.md) — 多 Agent 设计模式
- [Agent Skills 书写速览](../Agent_Skills/Skills-in-nutshell.md) — 为 Harness 注入领域知识
- [Agent_Evaluation](../Agent_Evaluation/) — Agent 评估体系

---

> 📅 **最后更新**：2026-05-07

## Related

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Harness/README.md|README]]
