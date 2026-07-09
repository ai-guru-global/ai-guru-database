---
title: Agent Harness 实现指南
category: 15-agent-production-agent-harness
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 目标：从零开始，用 Python 搭建一个生产级 Agent Harness。包含文件系统、Docker 沙箱、工具执行、验证回路、上下文压缩。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Harness Implementation Guide"
  - Harness_Implementation_Guide
sources: []

---
# Agent Harness 实现指南

> 目标：从零开始，用 Python 搭建一个生产级 Agent Harness。包含文件系统、Docker 沙箱、工具执行、验证回路、上下文压缩。

---

## 一、最小可运行 Harness

### 1.1 项目结构

```
my-harness/
├── harness/
│   ├── __init__.py
│   ├── core.py          # 核心 Harness 类
│   ├── sandbox.py       # Docker 沙箱管理
│   ├── tools.py         # 工具定义与执行
│   ├── memory.py        # 记忆管理
│   └── hooks.py         # 钩子与中间件
├── tests/
│   └── test_harness.py
├── workspace/           # Agent 工作区
├── requirements.txt
└── main.py
```

### 1.2 核心代码

```python
# harness/core.py
import os
import json
from typing import List, Dict, Optional, Callable
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class HarnessConfig:
    model: str = "gpt-4o"
    max_steps: int = 50
    timeout: int = 600
    compaction_threshold: float = 0.8
    context_window: int = 128000
    workspace_dir: str = "./workspace"
    sandbox_enabled: bool = True
    audit_log: bool = True
    max_cost: float = 10.0

@dataclass
class Step:
    id: int
    thought: str
    action: str
    observation: str
    timestamp: datetime = field(default_factory=datetime.now)
    tokens_used: int = 0

class AgentHarness:
    """生产级 Agent Harness"""
    
    def __init__(self, config: HarnessConfig = None, llm_client=None):
        self.config = config or HarnessConfig()
        self.llm = llm_client
        self.steps: List[Step] = []
        self.tools: Dict[str, Callable] = {}
        self.memory = {}
        self.audit_log = []
        
        os.makedirs(self.config.workspace_dir, exist_ok=True)
        self._register_default_tools()
    
    def register_tool(self, name: str, func: Callable, description: str, schema: dict):
        """注册工具"""
        self.tools[name] = {
            "func": func,
            "description": description,
            "schema": schema
        }
    
    def run(self, task: str) -> str:
        """执行任务"""
        messages = self._build_context(task)
        total_cost = 0.0
        
        for step_num in range(self.config.max_steps):
            # 1. 检查上下文是否需要压缩
            if self._context_usage(messages) > self.config.compaction_threshold:
                messages = self._compact_context(messages)
            
            # 2. 调用模型
            response = self._call_llm(messages)
            total_cost += response.get("cost", 0)
            
            if total_cost > self.config.max_cost:
                return f"Error: Cost exceeded limit ${self.config.max_cost}"
            
            # 3. 解析响应
            content = response["content"]
            tool_calls = response.get("tool_calls", [])
            
            # 4. 记录审计日志
            self._audit(f"Step {step_num}: {content[:200]}")
            
            # 5. 如果没有工具调用，任务完成
            if not tool_calls:
                self.steps.append(Step(
                    id=step_num,
                    thought=content,
                    action="complete",
                    observation="Task finished",
                    tokens_used=response.get("tokens", 0)
                ))
                return content
            
            # 6. 执行工具
            observations = []
            for tc in tool_calls:
                tool_name = tc["function"]["name"]
                tool_args = json.loads(tc["function"]["arguments"])
                
                observation = self._execute_tool(tool_name, tool_args)
                observations.append({
                    "tool_call_id": tc["id"],
                    "content": observation
                })
                
                self.steps.append(Step(
                    id=step_num,
                    thought=content,
                    action=f"{tool_name}({tool_args})",
                    observation=observation[:500]
                ))
            
            # 7. 更新消息历史
            messages.append({"role": "assistant", "content": content, "tool_calls": tool_calls})
            for obs in observations:
                messages.append({
                    "role": "tool",
                    "tool_call_id": obs["tool_call_id"],
                    "content": obs["content"]
                })
        
        return f"Error: Max steps ({self.config.max_steps}) reached"
    
    def _build_context(self, task: str) -> List[Dict]:
        """构建初始上下文"""
        system_prompt = f"""You are an autonomous agent running in a harness.
Workspace: {self.config.workspace_dir}
You have access to tools. Use them to complete tasks.
Always verify your work when possible.
"""
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": task}
        ]
        
        # 注入记忆
        if self.memory:
            memory_str = json.dumps(self.memory, indent=2)
            messages.insert(1, {"role": "system", "content": f"Memory: {memory_str}"})
        
        return messages
    
    def _call_llm(self, messages: List[Dict]) -> Dict:
        """调用 LLM（抽象接口，需接入具体模型）"""
        # 这里接入 OpenAI / Anthropic / 本地模型
        # 示例使用 OpenAI 格式
        from openai import OpenAI
        client = OpenAI()
        
        tools_spec = [
            {
                "type": "function",
                "function": {
                    "name": name,
                    "description": info["description"],
                    "parameters": info["schema"]
                }
            }
            for name, info in self.tools.items()
        ]
        
        response = client.chat.completions.create(
            model=self.config.model,
            messages=messages,
            tools=tools_spec if tools_spec else None,
            temperature=0.0
        )
        
        msg = response.choices[0].message
        return {
            "content": msg.content or "",
            "tool_calls": [
                {
                    "id": tc.id,
                    "function": {
                        "name": tc.function.name,
                        "arguments": tc.function.arguments
                    }
                }
                for tc in (msg.tool_calls or [])
            ],
            "tokens": response.usage.total_tokens if response.usage else 0,
            "cost": self._estimate_cost(response.usage)
        }
    
    def _execute_tool(self, name: str, args: Dict) -> str:
        """执行工具"""
        if name not in self.tools:
            return f"Error: Unknown tool '{name}'"
        
        try:
            result = self.tools[name]["func"](**args)
            return str(result)
        except Exception as e:
            return f"Error executing {name}: {str(e)}"
    
    def _context_usage(self, messages: List[Dict]) -> float:
        """计算上下文使用率"""
        total_chars = sum(len(m.get("content", "")) for m in messages)
        estimated_tokens = total_chars / 4
        return estimated_tokens / self.config.context_window
    
    def _compact_context(self, messages: List[Dict]) -> List[Dict]:
        """压缩上下文：摘要前半部分"""
        # 保留 system prompt 和最近的消息
        system_msgs = [m for m in messages if m["role"] == "system"]
        non_system = [m for m in messages if m["role"] != "system"]
        
        # 对前半部分做摘要
        mid = len(non_system) // 2
        to_summarize = non_system[:mid]
        keep = non_system[mid:]
        
        summary = f"[Summary of {len(to_summarize)} previous messages]"
        
        return system_msgs + [{"role": "system", "content": summary}] + keep
    
    def _audit(self, message: str):
        """记录审计日志"""
        if self.config.audit_log:
            self.audit_log.append({
                "timestamp": datetime.now().isoformat(),
                "message": message
            })
    
    def _estimate_cost(self, usage) -> float:
        """估算成本"""
        if not usage:
            return 0.0
        # gpt-4o: $5/1M input, $15/1M output
        input_cost = usage.prompt_tokens * 5 / 1_000_000
        output_cost = usage.completion_tokens * 15 / 1_000_000
        return input_cost + output_cost
    
    def _register_default_tools(self):
        """注册默认工具"""
        self.register_tool(
            "bash",
            self._bash,
            "Execute bash commands in the workspace",
            {
                "type": "object",
                "properties": {
                    "command": {"type": "string", "description": "Bash command to execute"}
                },
                "required": ["command"]
            }
        )
        
        self.register_tool(
            "read_file",
            self._read_file,
            "Read a file from the workspace",
            {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "File path relative to workspace"}
                },
                "required": ["path"]
            }
        )
        
        self.register_tool(
            "write_file",
            self._write_file,
            "Write content to a file in the workspace",
            {
                "type": "object",
                "properties": {
                    "path": {"type": "string"},
                    "content": {"type": "string"}
                },
                "required": ["path", "content"]
            }
        )
    
    def _bash(self, command: str) -> str:
        import subprocess
        result = subprocess.run(
            command,
            shell=True,
            cwd=self.config.workspace_dir,
            capture_output=True,
            text=True,
            timeout=60
        )
        output = result.stdout
        if result.stderr:
            output += f"\n[stderr] {result.stderr}"
        return output
    
    def _read_file(self, path: str) -> str:
        full_path = os.path.join(self.config.workspace_dir, path)
        with open(full_path, "r") as f:
            return f.read()
    
    def _write_file(self, path: str, content: str) -> str:
        full_path = os.path.join(self.config.workspace_dir, path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w") as f:
            f.write(content)
        return f"File written: {path}"
```

### 1.3 运行示例

```python
# main.py
from harness.core import AgentHarness, HarnessConfig

config = HarnessConfig(
    model="gpt-4o",
    max_steps=20,
    workspace_dir="./workspace"
)

harness = AgentHarness(config)

# 示例任务
result = harness.run("""
Create a Python script that calculates the first 10 Fibonacci numbers,
save it as fib.py, run it, and verify the output is correct.
""")

print("=" * 50)
print("RESULT:")
print(result)
print("=" * 50)
print(f"Steps: {len(harness.steps)}")
print(f"Total cost: ${sum(s.tokens_used for s in harness.steps) * 0.00001:.4f}")
```

---

## 二、添加 Docker 沙箱

```python
# harness/sandbox.py
import docker
import uuid
import os

class DockerSandbox:
    """Docker 沙箱执行环境"""
    
    def __init__(self, image="python:3.11-slim", workspace_host="./workspace"):
        self.client = docker.from_env()
        self.image = image
        self.workspace_host = os.path.abspath(workspace_host)
        self.container = None
        self.container_id = str(uuid.uuid4())[:8]
    
    def start(self):
        """启动沙箱容器"""
        self.container = self.client.containers.run(
            self.image,
            name=f"agent-sandbox-{self.container_id}",
            command="sleep infinity",
            volumes={
                self.workspace_host: {"bind": "/workspace", "mode": "rw"}
            },
            working_dir="/workspace",
            network_mode="none",  # 默认无网络
            detach=True,
            mem_limit="1g",
            cpu_quota=100000  # 1 CPU
        )
        return self
    
    def execute(self, command: str, timeout: int = 60) -> str:
        """在沙箱中执行命令"""
        if not self.container:
            raise RuntimeError("Sandbox not started")
        
        result = self.container.exec_run(
            cmd=["bash", "-c", command],
            timeout=timeout
        )
        
        stdout = result.output.decode("utf-8") if result.output else ""
        if result.exit_code != 0:
            return f"Exit code {result.exit_code}: {stdout}"
        return stdout
    
    def install(self, packages: List[str]):
        """安装依赖"""
        pkg_str = " ".join(packages)
        self.execute(f"pip install {pkg_str}")
    
    def stop(self):
        """停止并清理沙箱"""
        if self.container:
            self.container.stop()
            self.container.remove()
            self.container = None
    
    def __enter__(self):
        return self.start()
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.stop()
```

### 集成到 Harness

```python
# 在 harness/core.py 中修改 bash 工具

def _bash_sandbox(self, command: str) -> str:
    """在 Docker 沙箱中执行命令"""
    from harness.sandbox import DockerSandbox
    
    with DockerSandbox(workspace_host=self.config.workspace_dir) as sandbox:
        return sandbox.execute(command)
```

---

## 三、添加验证回路

```python
# harness/hooks.py
import subprocess
from typing import Callable, List

class VerificationHook:
    """验证回路钩子"""
    
    def __init__(self, workspace_dir: str):
        self.workspace_dir = workspace_dir
        self.verifiers: List[Callable] = []
    
    def add_verifier(self, verifier: Callable):
        """添加验证器"""
        self.verifiers.append(verifier)
    
    def verify(self) -> dict:
        """运行所有验证器"""
        results = []
        all_passed = True
        
        for verifier in self.verifiers:
            try:
                result = verifier(self.workspace_dir)
                results.append({
                    "name": verifier.__name__,
                    "passed": result["passed"],
                    "message": result.get("message", "")
                })
                if not result["passed"]:
                    all_passed = False
            except Exception as e:
                results.append({
                    "name": verifier.__name__,
                    "passed": False,
                    "message": str(e)
                })
                all_passed = False
        
        return {"passed": all_passed, "checks": results}

# 内置验证器

def python_syntax_check(workspace: str) -> dict:
    """检查 Python 文件语法"""
    import os, py_compile
    errors = []
    
    for root, _, files in os.walk(workspace):
        for f in files:
            if f.endswith(".py"):
                path = os.path.join(root, f)
                try:
                    py_compile.compile(path, doraise=True)
                except py_compile.PyCompileError as e:
                    errors.append(f"{f}: {e}")
    
    return {
        "passed": len(errors) == 0,
        "message": "\n".join(errors) if errors else "All Python files valid"
    }

def tests_pass(workspace: str) -> dict:
    """运行测试套件"""
    result = subprocess.run(
        ["python", "-m", "pytest", "-v"],
        cwd=workspace,
        capture_output=True,
        text=True
    )
    return {
        "passed": result.returncode == 0,
        "message": result.stdout if result.returncode == 0 else result.stderr
    }
```

### 在 Harness 中使用验证

```python
# 在 AgentHarness.run() 中，每步后添加验证

# 每 3 步验证一次
if step_num > 0 and step_num % 3 == 0:
    verification = self.verification_hook.verify()
    if not verification["passed"]:
        # 将验证失败信息注入上下文，让 Agent 修复
        messages.append({
            "role": "system",
            "content": f"Verification failed:\n{json.dumps(verification, indent=2)}\nPlease fix the issues."
        })
```

---

## 四、添加记忆系统

```python
# harness/memory.py
import json
import os
from datetime import datetime

class MemoryManager:
    """Agent 记忆管理"""
    
    def __init__(self, memory_file: str = "AGENTS.md"):
        self.memory_file = memory_file
        self.short_term = []  # 当前会话记忆
        self.long_term = {}   # 持久记忆
        self._load()
    
    def _load(self):
        """从文件加载持久记忆"""
        if os.path.exists(self.memory_file):
            with open(self.memory_file, "r") as f:
                content = f.read()
                # 解析 AGENTS.md 格式
                self.long_term = self._parse_agents_md(content)
    
    def _parse_agents_md(self, content: str) -> dict:
        """解析 AGENTS.md 内容"""
        # 简单实现：按章节解析
        memory = {}
        current_section = None
        
        for line in content.split("\n"):
            if line.startswith("## "):
                current_section = line[3:].strip()
                memory[current_section] = []
            elif current_section and line.strip():
                memory[current_section].append(line.strip())
        
        return memory
    
    def remember(self, key: str, value: str, persistent: bool = False):
        """记录记忆"""
        self.short_term.append({
            "key": key,
            "value": value,
            "timestamp": datetime.now().isoformat()
        })
        
        if persistent:
            if "learnings" not in self.long_term:
                self.long_term["learnings"] = []
            self.long_term["learnings"].append(f"- {key}: {value}")
            self._save()
    
    def _save(self):
        """保存持久记忆"""
        with open(self.memory_file, "w") as f:
            f.write("# Agent Memory\n\n")
            for section, items in self.long_term.items():
                f.write(f"## {section}\n\n")
                for item in items:
                    f.write(f"{item}\n")
                f.write("\n")
    
    def get_context(self, max_tokens: int = 2000) -> str:
        """获取记忆上下文（用于注入 Prompt）"""
        parts = []
        
        # 持久记忆
        if self.long_term:
            parts.append("## Persistent Knowledge\n")
            for section, items in self.long_term.items():
                parts.append(f"### {section}\n")
                parts.extend(items[:5])  # 每类最多 5 条
        
        # 短期记忆（最近 5 条）
        if self.short_term:
            parts.append("\n## Recent Context\n")
            for m in self.short_term[-5:]:
                parts.append(f"- {m['key']}: {m['value']}")
        
        return "\n".join(parts)
```

---

## 五、完整使用示例

```python
# example.py
from harness.core import AgentHarness, HarnessConfig
from harness.sandbox import DockerSandbox
from harness.hooks import VerificationHook, python_syntax_check
from harness.memory import MemoryManager

# 配置
config = HarnessConfig(
    model="gpt-4o",
    max_steps=30,
    workspace_dir="./workspace",
    compaction_threshold=0.75
)

# 初始化 Harness
harness = AgentHarness(config)

# 添加验证
harness.verification_hook = VerificationHook(config.workspace_dir)
harness.verification_hook.add_verifier(python_syntax_check)

# 添加记忆
harness.memory_manager = MemoryManager("./workspace/AGENTS.md")

# 执行任务
result = harness.run("""
Build a simple REST API in Python using Flask with one endpoint:
GET /health returns {"status": "ok"}

Requirements:
1. Create app.py with the Flask app
2. Add a requirements.txt with dependencies
3. Verify the app can start (syntax check)
4. Create a test file test_app.py with one test
""")

print(result)
print(f"\nCompleted in {len(harness.steps)} steps")
```

---

## 六、进阶：Ralph Loop 续写

```python
class RalphLoopHarness(AgentHarness):
    """支持长程任务的 Harness（Ralph Loop 模式）"""
    
    def run_long_horizon(self, task: str, max_iterations: int = 10):
        """长程任务执行"""
        goal = task
        iteration = 0
        
        while iteration < max_iterations:
            # 每次迭代使用新鲜上下文
            messages = self._build_context(goal)
            
            # 添加进度文件内容
            progress = self._read_progress()
            if progress:
                messages.append({
                    "role": "system",
                    "content": f"Current progress:\n{progress}"
                })
            
            # 执行单轮
            response = self._call_llm(messages)
            content = response["content"]
            
            # 检查是否尝试退出
            if self._is_exit_attempt(content):
                # 拦截退出，强制继续
                messages.append({
                    "role": "system",
                    "content": f"The task is NOT complete. Original goal: {goal}\nContinue working."
                })
                response = self._call_llm(messages)
                content = response["content"]
            
            # 执行工具调用
            tool_calls = response.get("tool_calls", [])
            for tc in tool_calls:
                self._execute_tool(
                    tc["function"]["name"],
                    json.loads(tc["function"]["arguments"])
                )
            
            # 更新进度文件
            self._write_progress(f"Iteration {iteration}: {content[:200]}")
            
            # Git checkpoint
            self._git_checkpoint(f"Iteration {iteration}")
            
            iteration += 1
        
        return f"Completed after {iteration} iterations"
    
    def _is_exit_attempt(self, content: str) -> bool:
        """检测模型是否试图提前退出"""
        exit_phrases = [
            "task is complete", "i have finished", "done.",
            "completed successfully", "that's all"
        ]
        return any(p in content.lower() for p in exit_phrases)
    
    def _read_progress(self) -> str:
        """读取进度文件"""
        try:
            with open(f"{self.config.workspace_dir}/PROGRESS.md") as f:
                return f.read()
        except FileNotFoundError:
            return ""
    
    def _write_progress(self, content: str):
        """写入进度文件"""
        with open(f"{self.config.workspace_dir}/PROGRESS.md", "a") as f:
            f.write(f"\n{content}\n")
    
    def _git_checkpoint(self, message: str):
        """Git 检查点"""
        import subprocess
        subprocess.run(
            ["git", "add", "."],
            cwd=self.config.workspace_dir,
            capture_output=True
        )
        subprocess.run(
            ["git", "commit", "-m", message],
            cwd=self.config.workspace_dir,
            capture_output=True
        )
```

---

## 七、测试

```python
# tests/test_harness.py
import pytest
from harness.core import AgentHarness, HarnessConfig

@pytest.fixture
def harness():
    config = HarnessConfig(
        workspace_dir="./test_workspace",
        max_steps=5
    )
    return AgentHarness(config)

class TestFilesystem:
    def test_read_write(self, harness):
        harness._write_file("test.txt", "hello")
        content = harness._read_file("test.txt")
        assert content == "hello"
    
    def test_bash(self, harness):
        result = harness._bash("echo 'test'")
        assert "test" in result

class TestContext:
    def test_context_usage(self, harness):
        messages = [{"role": "user", "content": "x" * 4000}]
        usage = harness._context_usage(messages)
        assert 0 < usage < 1
    
    def test_compaction(self, harness):
        messages = [
            {"role": "system", "content": "sys"},
            {"role": "user", "content": "1"},
            {"role": "assistant", "content": "2"},
            {"role": "user", "content": "3"},
            {"role": "assistant", "content": "4"},
        ]
        compacted = harness._compact_context(messages)
        assert len(compacted) < len(messages)
```

---

## 八、生产部署检查清单

- [ ] 沙箱启用（Docker/Firecracker）
- [ ] 网络隔离（默认无网络，需要时显式开启）
- [ ] 命令白名单（限制危险操作）
- [ ] 成本上限配置
- [ ] 审计日志开启
- [ ] 敏感文件模式配置
- [ ] 模型 fallback（主模型失败时切换）
- [ ] 观测接入（OpenTelemetry / LangSmith）
- [ ] 健康检查端点
- [ ] 回滚方案（Git checkpoint / 状态快照）

---

## 🔗 相关主题

- [Agent Harness 速览](./Harness-in-nutshell.md) — 30 分钟快速入门
- [The Anatomy of an Agent Harness](./The_Anatomy_of_an_Agent_Harness.md) — Harness 定义与核心组件
- [Agent Harness 技术架构 2026](./Agent_Harness_Architecture_2026.md) — 完整架构、配置、性能基线
- [Harness Security Guide](./Harness_Security_Guide.md) — 安全深度指南
- [Harness Deployment Guide](./Harness_Deployment_Guide.md) — 容器化与 K8s 部署
- [Harness Testing Guide](./Harness_Testing_Guide.md) — 测试策略与 CI/CD
- [Multi Agent Harness Design](./Multi_Agent_Harness_Design.md) — 多 Agent 设计模式
- [Agent Skills 书写速览](../Agent_Skills/Skills-in-nutshell.md) — 为 Harness 注入领域知识

---

> 📅 **最后更新**：2026-05-07

## Related

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
