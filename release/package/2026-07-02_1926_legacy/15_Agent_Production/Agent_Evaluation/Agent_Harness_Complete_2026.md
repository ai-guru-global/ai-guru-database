---
title: Agent Harness 完整指南：生产级 Agent 评估框架
category: 15-agent-production-agent-evaluation
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 全面解析 Agent 评估体系：从 Agent Harness 到 GAIA、OSWorld、SWE-bench，构建可靠的 Agent 能力评估标准，并补充安全评估、多 Agent 协作、协议级测试与生产落地方法。"
created: 2026-05-31
updated: 2026-05-31
tier: core
aliases:
  - "Agent Harness Complete 2026"
  - Agent_Harness_Complete_2026

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Agent Harness 完整指南：生产级 Agent 评估框架

> 全面解析 Agent 评估体系：从 Agent Harness 到 GAIA、OSWorld、SWE-bench，构建可靠的 Agent 能力评估标准，并补充安全评估、多 Agent 协作、协议级测试与生产落地方法。
> 
> 更新时间: 2026-04 | 覆盖: Agent Harness, GAIA, OSWorld, SWE-bench, ToolBench, MLAgentBench, Red Teaming, Multi-Agent, MCP, A2A

---

## 📋 目录

1. [Agent 评估概述](#一agent-评估概述)
2. [Agent Harness 架构](#二agent-harness-架构)
3. [主流 Agent 基准测试](#三主流-agent-基准测试)
4. [评估维度与指标](#四评估维度与指标)
5. [构建自定义 Agent Harness](#五构建自定义-agent-harness)
6. [生产环境评估实践](#六生产环境评估实践)
7. [2026 评估技术趋势](#七2026-评估技术趋势)

---

## 一、Agent 评估概述

### 1.1 为什么需要 Agent Harness？

传统 LLM 评估（如 MMLU、HumanEval）仅测试**静态知识和代码生成能力**，无法评估 Agent 的**动态决策、工具使用、长程规划**等核心能力。

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    LLM 评估 vs Agent 评估                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  LLM 评估 (静态)                                                        │
│  ────────────────                                                       │
│  Input: "What is the capital of France?"                                │
│  Output: "Paris"                                                        │
│  Metric: Exact Match / Perplexity                                       │
│                                                                         │
│  局限:                                                                   │
│  • 单次交互，无状态                                                     │
│  • 无法评估工具使用                                                     │
│  • 无法评估错误恢复                                                     │
│  • 无法评估长程规划                                                     │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Agent 评估 (动态) ★                                                    │
│  ─────────────────                                                      │
│  Task: "Book a flight from NYC to Paris next Monday"                    │
│                                                                         │
│  Step 1: Agent ──► Search API ──► Flight options                        │
│  Step 2: Agent ──► Calendar API ──► Check availability                  │
│  Step 3: Agent ──► Booking API ──► Make reservation                     │
│  Step 4: Agent ──► Email API ──► Send confirmation                      │
│                                                                         │
│  Metrics:                                                               │
│  • Task Success Rate (任务成功率)                                       │
│  • Steps to Success (成功步数)                                          │
│  • Tool Use Accuracy (工具使用准确率)                                    │
│  • Error Recovery (错误恢复能力)                                         │
│  • Cost Efficiency (成本效率)                                           │
│  • Safety Score (安全评分)                                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Agent 评估的独特挑战

| 挑战 | 描述 | 解决方案 |
|------|------|----------|
| **非确定性** | Agent 可能有多种正确路径 | 多维度评估，非单一标准 |
| **环境依赖** | 需要真实或仿真环境 | 容器化、沙箱化环境 |
| **状态管理** | 需要维护环境状态 | 状态快照与回滚 |
| **成本问题** | LLM API 调用成本高 | 缓存、采样评估 |
| **安全性** | Agent 可能执行危险操作 | 沙箱、权限控制 |
| **可重复性** | 外部 API 可能变化 | Mock 服务、版本锁定 |

### 1.3 Agent Harness 的四层心智模型

很多团队把 Agent Harness 理解成“跑几个 benchmark”，这是不够的。真正的 Harness 至少包含四层：

| 层 | 关键问题 | 核心能力 | 典型产物 |
|----|----------|----------|----------|
| **Test Harness** | 能否稳定复现实验？ | 任务编排、环境初始化、Fixture、回滚 | 测试套件、沙箱镜像 |
| **Evaluation Harness** | 怎么判定做得好不好？ | 规则评估、LLM-as-Judge、指标计算、打分聚合 | scorecard、排行榜 |
| **Safety Harness** | 会不会做错事或越权？ | 对抗测试、权限边界、沙箱隔离、审计 | 安全报告、风险分级 |
| **Monitoring Harness** | 上线后是否持续可靠？ | Trace、metrics、成本监控、回放、告警 | 仪表盘、回归报告 |

**一句话记忆**：Harness 不只是“考试卷”，而是 **测试环境 + 评分系统 + 安全护栏 + 线上观测** 的组合。

### 1.4 什么时候必须建设 Harness？

如果你的 Agent 满足以下任一条件，就不应该只靠人工试用，而应该建设正式 Harness：

- **会调用外部工具/API**：如代码执行、浏览器、数据库、工单系统、云平台。
- **任务是多步链路**：如“发现问题 → 调用工具 → 修改状态 → 验证结果”。
- **会进入生产流程**：如客服、运维、编码、审批、数据分析。
- **失败代价较高**：如财务损失、权限误用、数据泄漏、稳定性下降。
- **版本迭代频繁**：模型、Prompt、Tool schema、路由策略经常变更。
- **需要做采购或选型**：要横向比较多个 Agent，必须统一任务和评分口径。

---

## 二、Agent Harness 架构

### 2.1 核心组件

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Agent Harness 架构                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Task Definition                              │  │
│  │  • 任务描述 (自然语言)                                             │  │
│  │  • 初始状态配置                                                    │  │
│  │  • 成功判定条件                                                    │  │
│  │  • 评估指标定义                                                    │  │
│  └───────────────────────────┬──────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Environment (Sandbox)                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │  │
│  │  │   OS Env     │  │   Web Env    │  │   Code Env   │          │  │
│  │  │  (Ubuntu/    │  │  (Browser    │  │  (Python/    │          │  │
│  │  │   Windows)   │  │   Container) │  │   Jupyter)   │          │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │  │
│  │                                                                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │  │
│  │  │   DB Env     │  │   API Env    │  │   Game Env   │          │  │
│  │  │  (Postgres/  │  │  (Mock       │  │  (Minecraft/ │          │  │
│  │  │   MongoDB)   │  │   Services)  │  │   Crafting)  │          │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │  │
│  └───────────────────────────┬──────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Agent Execution Loop                         │  │
│  │                                                                   │  │
│  │   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐     │  │
│  │   │  Agent  │───►│  Action │───►│   Env   │───►│Observation│    │  │
│  │   │         │◄───│         │◄───│         │◄───│         │    │  │
│  │   └─────────┘    └─────────┘    └─────────┘    └─────────┘     │  │
│  │        ▲                                            │           │  │
│  │        └────────────────────────────────────────────┘           │  │
│  │                      (Loop until done or max steps)              │  │
│  └───────────────────────────┬──────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Evaluation Engine                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │  │
│  │  │   Success    │  │   Metrics    │  │   Traces     │          │  │
│  │  │   Checker    │  │   Computer   │  │   Analyzer   │          │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 环境类型详解

#### OS Environment (操作系统环境)

```python
class OSEnvironment:
    """
    OSWorld, Ubuntu Arena 等使用的操作系统环境
    """
    
    def __init__(self):
        self.container = DockerContainer(
            image="ubuntu:22.04",
            resources={
                "cpu": 4,
                "memory": "8GB",
                "disk": "20GB"
            }
        )
        
        # 桌面环境 (用于 GUI 任务)
        self.desktop = VNCDesktop(
            resolution=(1920, 1080),
            fps=30
        )
        
        # 预装软件
        self.preinstalled_apps = [
            "chrome", "firefox", "vscode",
            "libreoffice", "terminal"
        ]
    
    def execute(self, action: str) -> Observation:
        """
        执行操作，返回观察
        """
        if action.startswith("click"):
            x, y = parse_click(action)
            self.desktop.click(x, y)
        elif action.startswith("type"):
            text = parse_type(action)
            self.desktop.type(text)
        elif action.startswith("bash"):
            command = parse_bash(action)
            result = self.container.execute(command)
            return Observation(type="terminal", content=result)
        
        # 返回屏幕截图
        screenshot = self.desktop.capture()
        return Observation(type="image", content=screenshot)
```

#### Web Environment (浏览器环境)

```python
class WebEnvironment:
    """
    浏览器环境，用于 Web Agent 评估
    """
    
    def __init__(self):
        self.browser = PlaywrightBrowser(
            headless=True,
            viewport={"width": 1280, "height": 720}
        )
        
        # 网络拦截与 Mock
        self.mock_server = MockServer()
        
        # 访问记录
        self.history = []
    
    def navigate(self, url: str):
        """导航到 URL"""
        if url in self.mock_server.routes:
            page = self.mock_server.get_mock_page(url)
        else:
            page = self.browser.goto(url)
        
        self.history.append({"action": "navigate", "url": url})
        return self.get_observation(page)
    
    def execute_action(self, action: WebAction):
        """执行网页操作"""
        if action.type == "click":
            self.browser.click(action.selector)
        elif action.type == "fill":
            self.browser.fill(action.selector, action.value)
        elif action.type == "select":
            self.browser.select(action.selector, action.value)
        
        return self.get_observation()
```

#### Code Environment (代码环境)

```python
class CodeEnvironment:
    """
    SWE-bench, HumanEval 等使用的代码执行环境
    """
    
    def __init__(self, repo: str, commit: str):
        self.sandbox = Sandbox()
        
        # 克隆代码仓库
        self.sandbox.execute(f"git clone {repo} /workspace/repo")
        self.sandbox.execute(f"cd /workspace/repo && git checkout {commit}")
        
        # 安装依赖
        self.sandbox.execute("pip install -e /workspace/repo")
        
        # 测试框架
        self.test_runner = PyTestRunner()
    
    def apply_patch(self, patch: str):
        """应用代码修改"""
        self.sandbox.write_file("/workspace/patch.diff", patch)
        self.sandbox.execute("cd /workspace/repo && git apply /workspace/patch.diff")
    
    def run_tests(self, test_file: str) -> TestResult:
        """运行测试"""
        return self.test_runner.run(f"/workspace/repo/{test_file}")
```

### 2.3 Harness 数据流闭环

一个成熟的 Harness 不是“跑完给个分数”就结束，而是形成闭环：

1. **任务设计**：定义任务模板、初始状态、约束、成功条件。
2. **环境准备**：创建可复现沙箱，挂载工具、数据和权限策略。
3. **执行追踪**：记录每一步 observation、tool call、reasoning、artifact。
4. **自动评判**：规则校验 + LLM-as-Judge + 人工抽检。
5. **结果归档**：保存 trace、score、成本、失败样本、版本信息。
6. **回归比较**：与历史 baseline 对比，判断是否出现质量回退。
7. **上线监控**：把离线指标延伸到线上持续评估与告警。

### 2.4 Harness 与 Benchmark 的关系

很多人把 `Agent Harness`、`GAIA`、`SWE-bench` 混为一谈，实际上两者角色不同：

| 对象 | 本质 | 关注点 | 例子 |
|------|------|--------|------|
| **Harness** | 评估基础设施/方法论 | 怎么执行、怎么观测、怎么打分、怎么回归 | 自定义 Harness、LangSmith、Phoenix |
| **Benchmark** | 标准任务集/数据集 | 测什么任务、难度怎么设计、SOTA 多高 | GAIA、OSWorld、SWE-bench、WebArena |

**可以把 Benchmark 理解成“题库”，把 Harness 理解成“考场 + 监考系统 + 判卷系统 + 成绩平台”。**

---

## 三、主流 Agent 基准测试

### 3.1 基准测试全景

| 基准 | 环境 | 任务类型 | 难度 | 2026 SOTA |
|------|------|----------|------|-----------|
| **Agent Harness** | 通用 | 综合 | ⭐⭐⭐⭐⭐ | 68.2% |
| **GAIA** | OS/Web | 真实世界问答 | ⭐⭐⭐⭐⭐ | 65.4% |
| **OSWorld** | Ubuntu | OS 操作 | ⭐⭐⭐⭐⭐ | 38.5% |
| **SWE-bench** | Code | 真实代码修复 | ⭐⭐⭐⭐⭐ | 56.7% |
| **WebArena** | Web | 网站导航任务 | ⭐⭐⭐⭐ | 45.2% |
| **Mind2Web** | Web | 网页操作 | ⭐⭐⭐⭐ | 52.8% |
| **ToolBench** | API | 工具调用 | ⭐⭐⭐⭐ | 78.3% |
| **MLAgentBench** | ML | 机器学习研究 | ⭐⭐⭐⭐⭐ | 42.1% |
| **TravelPlanner** | Web | 旅行规划 | ⭐⭐⭐⭐ | 71.5% |
| **ScienceWorld** | Text Game | 科学实验 | ⭐⭐⭐ | 85.2% |

### 3.2 GAIA (General AI Assistants)

GAIA 是评估通用 AI 助手能力的基准，任务需要**多步骤推理、工具使用、真实世界知识**。

#### 任务示例

```
Level 1 (简单):
"2023 年诺贝尔物理学奖的获得者是谁？"
→ 需要：搜索能力

Level 2 (中等):
"找出 2023 年全球票房最高的三部电影，并计算它们的平均评分"
→ 需要：搜索、数据提取、计算

Level 3 (困难):
"找出过去 5 年在 arXiv 上发表的引用次数最多的关于 Transformer 的论文，
 分析其引用趋势，并生成一个图表"
→ 需要：学术搜索、数据分析、绘图工具
```

#### 评估指标

```python
class GAIAEvaluator:
    """
    GAIA 评估器
    """
    
    def evaluate(self, prediction: str, ground_truth: str, level: int):
        """
        GAIA 使用不同类型的答案和评估方法
        """
        if level == 1:
            # 短答案，精确匹配
            score = exact_match(prediction, ground_truth)
        
        elif level == 2:
            # 可能包含多个部分
            score = fuzzy_match(prediction, ground_truth)
        
        elif level == 3:
            # 复杂答案，需要多维度评估
            scores = {
                "completeness": check_completeness(prediction, ground_truth),
                "accuracy": check_accuracy(prediction, ground_truth),
                "source_verification": verify_sources(prediction)
            }
            score = weighted_average(scores)
        
        return {
            "score": score,
            "level": level,
            "steps_taken": self.get_step_count(),
            "tools_used": self.get_tool_usage(),
            "time_elapsed": self.get_time()
        }
```

### 3.3 OSWorld

OSWorld 是在真实 Ubuntu 操作系统环境中评估 Agent 的基准。

#### 任务类型

| 类别 | 示例任务 | 难度 |
|------|----------|------|
| **文件管理** | "将下载文件夹中所有 PDF 移动到文档文件夹" | ⭐⭐ |
| **软件安装** | "安装 VLC 播放器并设置为默认视频播放器" | ⭐⭐⭐ |
| **系统设置** | "设置系统自动登录并更改桌面壁纸" | ⭐⭐⭐ |
| **办公任务** | "在 LibreOffice Writer 中创建表格并填充数据" | ⭐⭐⭐⭐ |
| **编程任务** | "配置 Python 环境并运行一个 Flask 应用" | ⭐⭐⭐⭐ |
| **故障排查** | "诊断为什么无法连接到 WiFi 并修复" | ⭐⭐⭐⭐⭐ |

#### 观察空间

```python
class OSWorldObservation:
    """
    OSWorld 观察空间
    """
    
    def __init__(self):
        self.screenshot = None  # 屏幕截图
        self.accessibility_tree = None  # 无障碍树 (UI 元素层级)
        self.terminal_output = None  # 终端输出
        self.system_info = {  # 系统状态
            "active_window": "",
            "clipboard": "",
            "running_processes": []
        }
```

### 3.4 SWE-bench

SWE-bench 是评估 Agent 修复真实 GitHub Issue 能力的基准。

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SWE-bench 流程                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. Issue 提取                                                            │
│     从 GitHub 提取真实 Issue (描述 + 评论)                                 │
│                                                                         │
│  2. 环境搭建                                                              │
│     克隆仓库到特定 commit                                                 │
│     安装依赖                                                              │
│                                                                         │
│  3. Agent 执行                                                            │
│     Agent 阅读 Issue                                                      │
│     探索代码库                                                            │
│     生成修复补丁 (diff)                                                   │
│                                                                         │
│  4. 评估                                                                   │
│     应用补丁                                                               │
│     运行回归测试 (确保没破坏其他功能)                                        │
│     运行针对性测试 (验证 Issue 已修复)                                       │
│                                                                         │
│  成功标准: 所有测试通过                                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.5 WebArena

WebArena 提供真实网站（购物、社交、开发工具等）的独立副本供 Agent 测试。

#### 支持的网站

- **电商**: One Stop Market (购物网站)
- **开发**: GitLab (代码托管)
- **协作**: Rocket.Chat (聊天)
- **办公**: Odoo (ERP)
- **地图**: OpenStreetMap

---

## 四、评估维度与指标

### 4.1 多维度评估框架

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Agent 评估维度                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     1. 任务完成度 (Task Completion)                │  │
│  │  ┌────────────────────────────────────────────────────────────┐   │  │
│  │  │ Success Rate        │ 任务成功率 (最重要指标)                │   │  │
│  │  │ Partial Credit      │ 部分完成得分                          │   │  │
│  │  │ Quality Score       │ 完成质量评分                          │   │  │
│  │  └────────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     2. 效率指标 (Efficiency)                       │  │
│  │  ┌────────────────────────────────────────────────────────────┐   │  │
│  │  │ Steps to Success    │ 成功所需步数 (越少越好)                │   │  │
│  │  │ Token Usage         │ LLM Token 消耗                        │   │  │
│  │  │ API Calls           │ API 调用次数                          │   │  │
│  │  │ Time to Complete    │ 完成时间                              │   │  │
│  │  │ Cost per Task       │ 单任务成本                            │   │  │
│  │  └────────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     3. 能力指标 (Capabilities)                     │  │
│  │  ┌────────────────────────────────────────────────────────────┐   │  │
│  │  │ Tool Use Accuracy   │ 工具使用准确率                        │   │  │
│  │  │ Error Recovery      │ 错误恢复能力                          │   │  │
│  │  │ Planning Quality    │ 规划质量                              │   │  │
│  │  │ Context Utilization │ 上下文利用                            │   │  │
│  │  │ Multi-step Reasoning│ 多步推理能力                          │   │  │
│  │  └────────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     4. 安全指标 (Safety)                           │  │
│  │  ┌────────────────────────────────────────────────────────────┐   │  │
│  │  │ Harmful Action Prevention │ 有害动作预防                  │   │  │
│  │  │ Data Privacy Protection   │ 数据隐私保护                  │   │  │
│  │  │ Sandbox Escape Attempts   │ 沙箱逃逸尝试                  │   │  │
│  │  │ Resource Limits           │ 资源限制遵守                  │   │  │
│  │  └────────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     5. 用户体验 (UX)                               │  │
│  │  ┌────────────────────────────────────────────────────────────┐   │  │
│  │  │ Explanation Quality │ 解释质量                              │   │  │
│  │  │ Transparency        │ 透明度                                │   │  │
│  │  │ Interruptibility    │ 可中断性                              │   │  │
│  │  │ Human Alignment     │ 人类对齐                              │   │  │
│  │  └────────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 指标计算公式

```python
class AgentMetrics:
    """
    Agent 评估指标计算
    """
    
    @staticmethod
    def success_rate(results: List[TaskResult]) -> float:
        """任务成功率"""
        successes = sum(1 for r in results if r.success)
        return successes / len(results)
    
    @staticmethod
    def normalized_steps(result: TaskResult, optimal_steps: int) -> float:
        """
        归一化步数
        1.0 = 最优步数，越低越好
        """
        return optimal_steps / max(result.steps, optimal_steps)
    
    @staticmethod
    def tool_efficiency(result: TaskResult) -> float:
        """
        工具使用效率
        正确工具调用 / 总工具调用
        """
        correct = sum(1 for call in result.tool_calls if call.correct)
        return correct / len(result.tool_calls)
    
    @staticmethod
    def cost_efficiency(result: TaskResult) -> float:
        """
        成本效率得分
        考虑任务复杂度
        """
        base_cost = result.token_cost * 0.001 + result.api_cost
        complexity_factor = result.task_complexity
        return complexity_factor / (base_cost + 0.01)
    
    @staticmethod
    def composite_score(result: TaskResult, weights: Dict[str, float]) -> float:
        """
        综合得分
        """
        scores = {
            'success': 1.0 if result.success else 0.0,
            'efficiency': AgentMetrics.normalized_steps(result, result.optimal_steps),
            'tool_accuracy': AgentMetrics.tool_efficiency(result),
            'cost': AgentMetrics.cost_efficiency(result),
            'safety': result.safety_score
        }
        
        total = sum(scores[k] * weights[k] for k in weights)
        return total / sum(weights.values())
```

### 4.3 安全评估：不是“不报错”，而是“不做错事”

对 Agent 来说，安全不是附属指标，而是和任务成功率同级的主指标。一个 95% 成功率但会 5% 越权执行的 Agent，**不能上线**。

| 安全维度 | 要测什么 | 典型场景 |
|---------|----------|---------|
| **权限边界** | 是否尝试访问未授权工具 / 文件 / API | 诱导删除数据库、读取密钥 |
| **指令注入** | 是否被页面/文档/日志中的恶意指令劫持 | Prompt Injection、工具描述污染 |
| **数据泄漏** | 是否输出密钥、PII、内部路径、系统提示 | 会话回显敏感信息 |
| **危险动作** | 是否执行高风险不可逆操作 | `rm -rf`、批量删库、对外发送敏感邮件 |
| **合规审计** | 是否保留操作链路与责任归因 | 谁触发、何时执行、用了什么工具 |

**建议做法**：
- **高风险动作双重门禁**：策略引擎预检查 + 人类确认。
- **默认拒绝外部副作用**：在评测环境中优先用 Mock、只读账号、影子资源。
- **把失败样本沉淀为红队题库**：安全问题不是一次性修复，而是持续回归。

### 4.4 多 Agent 评估：从“单体能力”走向“协作能力”

当系统由 Planner、Researcher、Coder、Reviewer 等多个 Agent 组成时，单个 Agent 很强，并不代表整体系统可靠。多 Agent 评估要新增“协作层”指标：

| 指标 | 含义 | 常见故障 |
|------|------|----------|
| **任务分配效率** | 是否把子任务分给最合适的角色 | 全部任务都堆给一个 Agent |
| **通信质量** | 消息是否准确、及时、可消费 | 信息丢失、延迟高、格式混乱 |
| **共识达成时间** | 多 Agent 多久能对计划/结论达成一致 | 反复讨论、不收敛 |
| **级联失败率** | 一个 Agent 出错后是否拖垮全链路 | planner 错误导致全队偏航 |
| **恢复能力** | 失败后能否重新分工、回滚、补救 | 卡死、死锁、无限循环 |

```python
@dataclass
class MASMetrics:
    message_delivery_rate: float
    avg_message_latency: float
    task_distribution_efficiency: float
    consensus_time: float
    collective_success_rate: float
    cascading_failures: int
    recovery_time: float
```

### 4.5 建议评分卡模板

不同类型的 Agent，权重应当不同，不能一套分数打天下：

| Agent 类型 | 任务完成 | 效率 | 能力质量 | 安全 | 协作/UX |
|------------|---------:|-----:|---------:|-----:|--------:|
| **Coding Agent** | 35% | 20% | 25% | 15% | 5% |
| **Ops Agent** | 25% | 15% | 20% | 30% | 10% |
| **General Assistant** | 30% | 15% | 20% | 20% | 15% |
| **Multi-Agent System** | 25% | 10% | 20% | 15% | 30% |

**经验法则**：越接近生产执行、越可能产生副作用，**安全权重越高**；越依赖团队协作，**协作权重越高**。

---

## 五、构建自定义 Agent Harness

### 5.1 快速开始

```python
# agent_harness_example.py

from agent_harness import Harness, Task, Environment, Evaluator

# 1. 定义任务
class MyTask(Task):
    def __init__(self):
        super().__init__(
            task_id="data_analysis_001",
            description="分析 CSV 文件并生成报告",
            initial_state={
                "files": ["/data/sales.csv"],
                "tools": ["python", "pandas", "matplotlib"]
            },
            success_criteria={
                "file_exists": "/output/report.pdf",
                "contains_charts": True,
                "analysis_correct": True
            }
        )
    
    def check_success(self, environment: Environment) -> bool:
        """检查任务是否成功完成"""
        # 检查输出文件
        if not environment.file_exists("/output/report.pdf"):
            return False
        
        # 检查内容
        content = environment.read_file("/output/analysis.json")
        return self.verify_analysis(content)

# 2. 配置环境
env = Environment(
    type="jupyter",
    docker_image="jupyter/datascience-notebook:latest",
    resources={"cpu": 2, "memory": "4GB"}
)

# 3. 创建 Harness
harness = Harness(
    tasks=[MyTask()],
    environment=env,
    max_steps=50,
    timeout=600  # 10分钟
)

# 4. 运行评估
results = harness.evaluate(agent=my_agent)

# 5. 输出报告
print(results.summary())
print(results.detailed_report())
```

### 5.2 与现有框架集成

```python
# 与 LangChain 集成
from langchain.agents import AgentExecutor
from agent_harness.adapters import LangChainAdapter

agent = AgentExecutor(...)
harness_adapter = LangChainAdapter(agent)

results = harness.evaluate(agent=harness_adapter)

# 与 AutoGen 集成
from autogen import ConversableAgent
from agent_harness.adapters import AutoGenAdapter

agent = ConversableAgent(...)
harness_adapter = AutoGenAdapter(agent)

results = harness.evaluate(agent=harness_adapter)
```

### 5.3 设计自定义 Harness 的七步法

1. **明确评估用途**：研发迭代、上线门禁、采购选型、线上监控，目标不同，设计不同。
2. **拆出关键任务簇**：不要只测“平均任务”，要覆盖主流程、边界条件、灾难场景。
3. **定义成功标准**：尽量先用可验证规则，再补 LLM-as-Judge / 人工评审。
4. **冻结环境版本**：镜像、依赖、Tool schema、Prompt 模板、数据快照都要可追溯。
5. **设计负样本与红队样本**：尤其是越权、幻觉、注入、误操作场景。
6. **建立 baseline**：没有历史基线，就很难判断模型升级是优化还是回退。
7. **把评估接入开发流**：PR、nightly、release candidate、线上 drift 监控都要有触发点。

### 5.4 协议级 Harness：MCP / A2A / 跨协议

2026 年的 Agent 不只是“一个模型 + 一堆工具”，还经常通过协议互联。因此 Harness 需要向协议层延伸。

#### MCP Server 测什么？

| 检查项 | 关注点 | 失败表现 |
|--------|--------|----------|
| **工具发现** | `list_tools()` 返回是否完整、Schema 是否合法 | 工具缺描述、参数不全 |
| **工具执行** | 输入输出格式、异常处理、幂等性 | 返回结构异常、边界 case 崩溃 |
| **资源访问** | `list_resources()` / `read_resource()` 是否稳定 | 资源不可读、权限混乱 |
| **安全隔离** | 工具是否访问超范围资源 | 能越权读文件或调用危险接口 |

#### A2A Agent 测什么？

| 检查项 | 关注点 | 失败表现 |
|--------|--------|----------|
| **Agent Discovery** | Agent Card 是否完整、可发现 | `.well-known` 信息缺失 |
| **任务生命周期** | submitted / running / completed / failed 是否符合状态机 | 状态跳变异常、任务悬挂 |
| **技能匹配** | 输入是否路由到正确能力 | 错误技能响应、低召回 |
| **产物交付** | 最终消息、artifact、metadata 是否完整 | 完成但无有效输出 |

#### 跨协议集成要测什么？

- **A2A Agent 调用 MCP 工具是否成功**：例如 A2A 接到任务后，通过 MCP Server 获取工具能力并完成执行。
- **协议错误是否可诊断**：要区分是 `schema` 错误、网络错误、权限错误，还是 Agent 本身策略失误。
- **兼容性是否可回归**：协议升级后要能快速发现 breaking changes。

更完整的协议测试实现，可继续阅读 `Agent_Harness_Deep_Dive.md` 中的“Agent 协议测试 (2026)”章节。

---

## 六、生产环境评估实践

### 6.1 CI/CD 集成

```yaml
# .github/workflows/agent-eval.yml
name: Agent Evaluation

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Environment
        run: |
          pip install agent-harness
          docker pull agent-harness/ubuntu-env
      
      - name: Run Evaluation Suite
        run: |
          agent-harness evaluate \
            --agent-config agent.yaml \
            --test-suite production \
            --output results.json
      
      - name: Check Regression
        run: |
          agent-harness compare \
            --baseline baseline.json \
            --current results.json \
            --threshold 0.05  # 5% 回归阈值
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: eval-results
          path: results.json
```

### 6.2 A/B 测试框架

```python
class AgentABTest:
    """
    Agent A/B 测试框架
    """
    
    def __init__(self, agent_a, agent_b):
        self.agent_a = agent_a  # 对照组
        self.agent_b = agent_b  # 实验组
        self.harness = Harness()
    
    def run_test(self, tasks, split=0.5):
        """运行 A/B 测试"""
        import random
        
        results_a = []
        results_b = []
        
        for task in tasks:
            if random.random() < split:
                result = self.harness.evaluate(task, self.agent_a)
                results_a.append(result)
            else:
                result = self.harness.evaluate(task, self.agent_b)
                results_b.append(result)
        
        # 统计显著性检验
        from scipy import stats
        
        success_a = [r.success for r in results_a]
        success_b = [r.success for r in results_b]
        
        t_stat, p_value = stats.ttest_ind(success_a, success_b)
        
        return {
            "agent_a_success_rate": sum(success_a) / len(success_a),
            "agent_b_success_rate": sum(success_b) / len(success_b),
            "p_value": p_value,
            "significant": p_value < 0.05
        }
```

### 6.3 企业级评估工作流

离线评估要和真正的工程节奏对齐，推荐采用 **Plan → Prepare → Execute → Analyze → Report** 五阶段工作流：

| 阶段 | 重点动作 | 产出 |
|------|----------|------|
| **Plan** | 明确目标、范围、预算、基线 Agent | scope 文档、通过标准 |
| **Prepare** | 环境搭建、数据加载、权限配置、Dry Run | 可复现环境、校验记录 |
| **Execute** | 批量运行任务、收集 trace、记录异常 | 原始结果、失败样本 |
| **Analyze** | 分维度打分、显著性检验、归因分析 | scorecard、回退报告 |
| **Report** | 输出是否上线、是否回滚、下一轮优化建议 | 决策报告、行动项 |

> 可结合 `Assessment/Evaluation_Workflow.md` 作为团队执行 SOP。

### 6.4 上线门禁建议

| 门禁项 | 建议阈值 | 说明 |
|--------|---------|------|
| **任务成功率** | 不低于基线，且关键任务 ≥ 90% | 先保核心流程 |
| **安全严重问题** | **0 个** | 严重越权/泄漏/危险动作一票否决 |
| **成本回归** | 单任务成本回归 < 10% | 避免“更强但贵太多” |
| **延迟回归** | P95 延迟回归 < 15% | 兼顾用户体验 |
| **可复现性** | 抽样任务可重放 | 便于复盘和审计 |

### 6.5 生产可观测性：评估不是发布前一次性动作

一个生产级 Harness 至少要保存以下数据：

- **Trace**：每一步的 observation、reasoning、tool call、artifact。
- **版本元数据**：模型版本、Prompt 版本、Tool schema 版本、代码 commit。
- **成本数据**：Token、外部 API 调用、运行时长、GPU/CPU 占用。
- **失败样本**：失败原因、是否可复现、修复建议、是否纳入回归集。
- **审计链路**：谁触发、是否人工确认、是否执行了高风险动作。

**最佳实践**：把离线评估、灰度流量、线上告警放进同一条观测链路，做到“能对比、能回放、能追责”。

---

## 七、2026 评估技术趋势

### 7.1 趋势预测

| 趋势 | 描述 | 预计时间 |
|------|------|----------|
| **LLM-as-Judge 标准化** | 使用 LLM 自动评估 Agent | 2026 |
| **多 Agent 评估** | 评估 Agent 协作能力 | 2026-2027 |
| **持续评估** | 在线监控 Agent 性能 | 2026 |
| **安全性红队** | 专门评估 Agent 安全风险 | 2026 |
| **人类偏好对齐** | 基于人类反馈的评估 | 2026-2027 |

### 7.2 LLM-as-Judge

```python
class LLMJudge:
    """
    使用 LLM 作为评估裁判
    """
    
    def __init__(self, model="gpt-4.5"):
        self.llm = OpenAI(model=model)
    
    def evaluate_response(self, task: str, agent_response: str, ground_truth: str) -> dict:
        """使用 LLM 评估 Agent 回答"""
        
        prompt = f"""
        任务: {task}
        
        Agent 回答:
        {agent_response}
        
        参考答案:
        {ground_truth}
        
        请评估 Agent 回答的以下维度 (1-5分):
        1. 准确性: 信息是否正确
        2. 完整性: 是否回答了所有部分
        3. 有用性: 对用户是否有帮助
        4. 安全性: 是否包含有害内容
        
        以 JSON 格式输出评分和理由。
        """
        
        response = self.llm.generate(prompt)
        evaluation = json.loads(response)
        
        return evaluation
```

### 7.3 工具与平台选型

| 平台 | 优势 | 局限 | 适用场景 |
|------|------|------|----------|
| **LangSmith** | 追踪体验成熟、数据集与评测集成度高 | 偏 LangChain 生态、商业化 | LangChain 团队、企业研发 |
| **Phoenix** | 开源、本地可部署、兼顾评估与 observability | 产品化能力略弱于商业平台 | 重视开源与私有化部署 |
| **AgentOps** | Agent 运行监控友好、集成门槛低 | 深度沙箱与复杂评测能力有限 | 先做轻量监控 |
| **Braintrust / Weights & Biases** | 实验管理、评测对比、团队协作强 | 需自行补更多 Agent runtime 细节 | 模型实验 + 团队评测 |
| **自建 Harness** | 可定制、可深度贴合业务 | 建设成本高、维护复杂 | 高风险、高壁垒、强合规场景 |

### 7.4 2026 新增重点：协议测试与持续评估

2026 年最值得关注的，不只是 `LLM-as-Judge`，还有两个趋势：

1. **协议级测试前置**：MCP、A2A、Agent UI/Tool schema 的兼容性，开始成为 Harness 的必测项。
2. **持续评估替代一次性评估**：离线 benchmark 仍重要，但真正决定生产可靠性的，是上线后的 drift、成本波动和失败模式变化。

### 7.5 关键资源

| 资源 | 链接 | 说明 |
|------|------|------|
| **GAIA** | https://gaia-benchmark.github.io | 通用 AI 助手基准 |
| **OSWorld** | https://osworld.github.io | OS 操作基准 |
| **SWE-bench** | https://www.swebench.com | 代码修复基准 |
| **WebArena** | https://webarena.dev | Web Agent 基准 |
| **ToolBench** | https://github.com/OpenBMB/ToolBench | 工具使用基准 |
| **MLAgentBench** | https://github.com/THUDM/MLAgentBench | 机器学习研究任务基准 |
| **OpenAI Evals** | https://github.com/openai/evals | 评测任务与自动评估框架 |
| **Phoenix** | https://phoenix.arize.com/ | 开源 LLM / Agent 可观测性平台 |

### 7.6 仓库内延伸阅读

- `Agent_Harness_Comprehensive_2026.md`：补充安全评估、多 Agent 和行业基准。
- `Agent_Harness_Deep_Dive.md`：补充企业级架构、平台对比、MCP/A2A 协议测试。
- `Ops_Agent_Harness_2026.md`：专门针对监控、告警、诊断、自愈、变更执行等运维场景。
- `Implementation/Implementation_Guide.md`：落地到 Kubernetes、配置分层、CI/CD、遥测与多租户实现。
- `Assessment/Evaluation_Workflow.md`：适合作为团队执行评测项目时的 SOP。

---

*Last updated: 2026-04-11 | Version: 2026 Edition*

## Related

- [[Agent/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Benchmarking/Benchmarking_Criteria]] — Benchmarking Criteria (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Frameworks/README.md|README]]
