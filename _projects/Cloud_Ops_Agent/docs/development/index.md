---
title: 云产品运维 Agent 研发指南 (Development)
category: 18-cloud-ops-agent-docs-development
tags: ["cloud-ops", "devops", "sre", "automation", "ai-agents"]
summary: "> 🎯 **目标**: 为研发工程师提供从环境搭建、工具开发、Agent 实现、调试测试到部署上线的完整开发指南，确保代码质量与研发效率。"
created: 2026-05-31
updated: 2026-05-31
---

# 云产品运维 Agent 研发指南 (Development)

> 🎯 **目标**: 为研发工程师提供从环境搭建、工具开发、Agent 实现、调试测试到部署上线的完整开发指南，确保代码质量与研发效率。

---

## 1. 开发环境

### 1.1 环境要求

| 组件 | 版本要求 | 说明 |
|-----|---------|------|
| **Python** | ≥ 3.11 | 主力开发语言 |
| **Node.js** | ≥ 20 | 前端/CLI 工具 |
| **Docker** | ≥ 24 | 本地容器化 |
| **kubectl** | ≥ 1.28 | K8s 集群管理 |
| **Helm** | ≥ 3.14 | K8s 包管理 |
| **Redis** | ≥ 7.0 | 本地缓存/状态 |
| **PostgreSQL** | ≥ 15 | 本地数据库 |

### 1.2 本地开发环境搭建

```bash
# 1. 克隆代码仓库
git clone https://github.com/your-org/cloud-ops-agent.git
cd cloud-ops-agent

# 2. 安装依赖
make setup

# 3. 启动基础服务 (Docker Compose)
docker-compose up -d redis postgres kafka

# 4. 配置环境变量
cp .env.example .env.local

# 5. 启动本地开发服务
make dev

# 6. 验证安装
make doctor
```

### 1.3 开发工具链

| 工具 | 用途 | 配置 |
|-----|------|------|
| **VSCode** | IDE | `.vscode/settings.json` |
| **Black** | 代码格式化 | `pyproject.toml` |
| **ruff** | Lint | `pyproject.toml` |
| **mypy** | 类型检查 | `pyproject.toml` |
| **pytest** | 单元测试 | `pytest.ini` |
| **pre-commit** | Git Hook | `.pre-commit-config.yaml` |

---

## 2. 代码架构

### 2.1 项目结构

```
cloud-ops-agent/
├── src/
│   ├── agent/                 # Agent 核心
│   │   ├── __init__.py
│   │   ├── orchestrator.py   # 任务编排器
│   │   ├── agents/           # 子 Agent 实现
│   │   │   ├── __init__.py
│   │   │   ├── monitor.py    # 监控 Agent
│   │   │   ├── diagnose.py   # 诊断 Agent
│   │   │   ├── action.py     # 操作 Agent
│   │   │   └── plan.py       # 规划 Agent
│   │   ├── harness/          # Agent Harness
│   │   │   ├── __init__.py
│   │   │   ├── runner.py     # 测试运行器
│   │   │   ├── evaluator.py  # 评估器
│   │   │   └── tracer.py     # 追踪器
│   │   └── tools/            # 工具实现
│   │       ├── __init__.py
│   │       ├── base.py      # 工具基类
│   │       ├── registry.py  # 工具注册表
│   │       └── impl/         # 具体工具实现
│   │
│   ├── gateway/              # API 网关
│   │   ├── __init__.py
│   │   ├── server.py        # HTTP 服务器
│   │   ├── auth.py          # 认证授权
│   │   ├── router.py        # 请求路由
│   │   └── middleware.py    # 中间件
│   │
│   ├── services/            # 公共服务
│   │   ├── audit.py         # 审计服务
│   │   ├── notification.py  # 通知服务
│   │   ├── backup.py        # 备份服务
│   │   └── metrics.py       # 指标服务
│   │
│   ├── integrations/        # 云平台集成
│   │   ├── base.py          # 集成基类
│   │   ├── aws/             # AWS 集成
│   │   ├── aliyun/          # 阿里云集成
│   │   ├── azure/           # Azure 集成
│   │   └── gcp/             # GCP 集成
│   │
│   └── utils/               # 工具函数
│       ├── __init__.py
│       ├── logging.py       # 日志
│       ├── config.py        # 配置
│       └── exceptions.py    # 异常
│
├── tests/                    # 测试代码
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── scripts/                  # 脚本
│   ├── generate_doc.sh
│   └── quality_gate.sh
│
├── docs/                     # 文档
├── configs/                  # 配置
├── deployments/              # 部署配置
├── Makefile
├── pyproject.toml
└── README.md
```

### 2.2 核心模块依赖

```
模块依赖关系
═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│                        Gateway (API 层)                              │
│   接收用户请求，认证授权，限流，路由转发                                │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ 调用
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Orchestrator (编排层)                             │
│   任务分解，状态管理，执行协调                                        │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ 调用
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Sub Agents (能力层)                             │
│   Monitor Agent | Diagnose Agent | Action Agent | Plan Agent         │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ 调用
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Tool Registry (工具层)                            │
│   工具注册，执行，安全管理                                             │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ 调用
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 Cloud Connectors (集成层)                            │
│   AWS | 阿里云 | Azure | GCP                                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. 工具开发

### 3.1 工具定义

```python
"""工具定义"""

from typing import Callable, Dict, Any, List, Optional
from dataclasses import dataclass, field
from enum import Enum
import json

class ToolCategory(Enum):
    """工具类别"""
    COMPUTE = "compute"
    STORAGE = "storage"
    NETWORK = "network"
    DATABASE = "database"
    CACHE = "cache"
    MESSAGE = "message"
    MONITORING = "monitoring"
    SECURITY = "security"
    CONFIG = "config"

class RiskLevel(Enum):
    """风险等级"""
    LOW = "low"           # 查询、只读
    MEDIUM = "medium"    # 修改配置
    HIGH = "high"        # 删除、重启
    CRITICAL = "critical"  # 数据删除、不可逆操作

@dataclass
class ToolParameter:
    """工具参数定义"""
    name: str
    type: str              # string, integer, boolean, array, object
    description: str
    required: bool = True
    default: Any = None
    enum: List[str] = field(default_factory=list)
    minimum: float = None
    maximum: float = None

@dataclass
class ToolDefinition:
    """工具定义"""
    name: str                    # 唯一标识 "ecs.scale"
    version: str = "1.0"
    category: ToolCategory
    description: str             # 用于 LLM 理解的能力描述
    parameters: List[ToolParameter]
    return_schema: Dict          # 返回值 JSON Schema
    required_permissions: List[str]
    risk_level: RiskLevel
    timeout_seconds: int = 60
    retryable: bool = True
    idempotent: bool = True       # 幂等性
    handler: Callable = None      # 实现函数

    def to_schema(self) -> Dict:
        """转换为 JSON Schema"""
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    p.name: {
                        "type": p.type,
                        "description": p.description,
                        "enum": p.enum,
                        "minimum": p.minimum,
                        "maximum": p.maximum
                    } for p in self.parameters
                },
                "required": [p.name for p in self.parameters if p.required]
            }
        }
```

### 3.2 工具实现模板

```python
"""工具实现模板"""

from typing import Dict, Any
from .base import BaseTool, ToolResult

class ECSScaleTool(BaseTool):
    """ECS 扩容工具"""

    NAME = "ecs.scale"
    VERSION = "1.0.0"
    CATEGORY = ToolCategory.COMPUTE
    RISK_LEVEL = RiskLevel.HIGH  # 高风险操作

    PARAMETERS = [
        ToolParameter(
            name="instance_id",
            type="string",
            description="ECS 实例 ID",
            required=True
        ),
        ToolParameter(
            name="target_replicas",
            type="integer",
            description="目标副本数",
            required=True,
            minimum=1,
            maximum=100
        ),
        ToolParameter(
            name="force",
            type="boolean",
            description="是否强制扩容",
            required=False,
            default=False
        )
    ]

    REQUIRED_PERMISSIONS = [
        "ecs:ScaleInstance",
        "ecs:DescribeInstances"
    ]

    TIMEOUT_SECONDS = 300
    RETRYABLE = False  # 高风险操作不重试
    IDEMPOTENT = True  # 扩容到相同目标是幂等的

    async def execute(self, params: Dict[str, Any], context: Dict) -> ToolResult:
        """执行工具"""

        instance_id = params["instance_id"]
        target_replicas = params["target_replicas"]
        force = params.get("force", False)

        try:
            # 1. 获取当前状态
            current = await self.cloud_api.describe_instance(instance_id)

            # 2. 权限检查
            if not context.get("permissions", []):
                return ToolResult(
                    success=False,
                    error="Insufficient permissions",
                    error_code="PERMISSION_DENIED"
                )

            # 3. 风险检查
            if target_replicas > current["replicas"] * 2 and not force:
                return ToolResult(
                    success=False,
                    error="Scale factor exceeds 2x without force flag",
                    error_code="RISK_THRESHOLD_EXCEEDED"
                )

            # 4. 扩容前备份状态
            await self.backup_service.create_backup(
                resource_id=instance_id,
                snapshot_name=f"pre-scale-{instance_id}"
            )

            # 5. 执行扩容
            result = await self.cloud_api.scale_instance(
                instance_id=instance_id,
                target_replicas=target_replicas
            )

            # 6. 验证结果
            verified = await self._verify_scale(instance_id, target_replicas)

            return ToolResult(
                success=True,
                data={
                    "instance_id": instance_id,
                    "previous_replicas": current["replicas"],
                    "current_replicas": target_replicas,
                    "task_id": result["task_id"],
                    "backup_id": result["backup_id"]
                }
            )

        except Exception as e:
            # 失败时尝试回滚
            await self._rollback(instance_id)
            return ToolResult(
                success=False,
                error=str(e),
                error_code="EXECUTION_FAILED"
            )

    async def _verify_scale(self, instance_id: str, target: int) -> bool:
        """验证扩容结果"""
        max_attempts = 30
        for _ in range(max_attempts):
            state = await self.cloud_api.describe_instance(instance_id)
            if state["replicas"] == target and state["healthy_replicas"] == target:
                return True
            await asyncio.sleep(2)
        return False
```

### 3.3 工具注册

```python
"""工具注册"""

class ToolRegistry:
    """工具注册表"""

    def __init__(self):
        self.tools: Dict[str, ToolDefinition] = {}
        self.categories: Dict[ToolCategory, List[str]] = {}
        self._register_builtin_tools()

    def register(self, tool: ToolDefinition):
        """注册工具"""
        # 验证
        self._validate_tool(tool)

        # 注册
        self.tools[tool.name] = tool

        # 更新类别索引
        if tool.category not in self.categories:
            self.categories[tool.category] = []
        self.categories[tool.category].append(tool.name)

        # 注册权限
        for permission in tool.required_permissions:
            self.permission_manager.register_tool_permission(
                tool.name, permission
            )

    def _validate_tool(self, tool: ToolDefinition):
        """验证工具定义"""
        if tool.name in self.tools:
            raise ToolAlreadyExistsError(f"Tool {tool.name} already registered")

        if not tool.name.replace(".", "_").isidentifier():
            raise InvalidToolNameError(f"Invalid tool name: {tool.name}")

    def get_tool(self, name: str) -> Optional[ToolDefinition]:
        """获取工具"""
        return self.tools.get(name)

    def list_tools(self, category: ToolCategory = None) -> List[ToolDefinition]:
        """列出工具"""
        if category:
            return [self.tools[name] for name in self.categories.get(category, [])]
        return list(self.tools.values())

    async def execute(
        self,
        tool_name: str,
        params: Dict,
        context: Dict
    ) -> ToolResult:
        """执行工具"""
        tool = self.get_tool(tool_name)
        if not tool:
            return ToolResult(success=False, error=f"Tool {tool_name} not found")

        # 权限检查
        if not self._check_permissions(context, tool):
            return ToolResult(
                success=False,
                error="Permission denied"
            )

        # 熔断检查
        if not await self.circuit_breaker.try_call(tool_name):
            return ToolResult(
                success=False,
                error="Service temporarily unavailable"
            )

        # 执行
        return await tool.execute(params, context)
```

---

## 4. Agent 开发

### 4.1 Agent 基类

```python
"""Agent 基类"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from abc import ABC, abstractmethod
import asyncio

@dataclass
class AgentCapability:
    """Agent 能力"""
    name: str
    description: str
    input_types: List[str]
    output_types: List[str]

@dataclass
class AgentResult:
    """Agent 执行结果"""
    success: bool
    data: Any = None
    error: str = None
    traces: List[Dict] = field(default_factory=list)
    confidence: float = 1.0

class BaseAgent(ABC):
    """Agent 基类"""

    def __init__(self, agent_id: str, name: str):
        self.agent_id = agent_id
        self.name = name
        self.capabilities: List[AgentCapability] = []
        self.tool_registry = ToolRegistry.get_instance()
        self.audit_logger = AuditLogger.get_instance()
        self.metrics = AgentMetrics.get_instance()

    @abstractmethod
    async def process(
        self,
        input_data: Dict[str, Any],
        context: Dict[str, Any]
    ) -> AgentResult:
        """处理输入"""
        pass

    async def execute_tool(
        self,
        tool_name: str,
        params: Dict,
        context: Dict
    ) -> ToolResult:
        """执行工具"""
        start_time = asyncio.get_event_loop().time()

        try:
            result = await self.tool_registry.execute(tool_name, params, context)

            # 记录指标
            self.metrics.record_tool_call(
                tool_name=tool_name,
                success=result.success,
                duration=asyncio.get_event_loop().time() - start_time
            )

            return result

        except Exception as e:
            self.metrics.record_error(tool_name=tool_name, error=str(e))
            raise

    async def _log_trace(
        self,
        action: str,
        data: Dict,
        agent_id: str = None
    ):
        """记录追踪"""
        trace = {
            "timestamp": time.time(),
            "agent_id": agent_id or self.agent_id,
            "action": action,
            "data": data
        }
        self.audit_logger.log_trace(trace)
```

### 4.2 Monitor Agent 实现

```python
"""Monitor Agent"""

class MonitorAgent(BaseAgent):
    """监控 Agent"""

    def __init__(self):
        super().__init__("monitor", "Monitor Agent")
        self._register_capabilities()

    def _register_capabilities(self):
        """注册能力"""
        self.capabilities = [
            AgentCapability(
                name="collect_metrics",
                description="收集云资源监控指标",
                input_types=["resource_id", "metric_names"],
                output_types=["metrics_data"]
            ),
            AgentCapability(
                name="detect_anomaly",
                description="检测指标异常",
                input_types=["metrics_data"],
                output_types=["anomalies"]
            ),
            AgentCapability(
                name="aggregate_alerts",
                description="聚合重复告警",
                input_types=["alerts"],
                output_types=["aggregated_alerts"]
            )
        ]

    async def process(
        self,
        input_data: Dict[str, Any],
        context: Dict[str, Any]
    ) -> AgentResult:
        """处理监控请求"""

        operation = input_data.get("operation")

        if operation == "collect_metrics":
            return await self._collect_metrics(input_data, context)
        elif operation == "detect_anomaly":
            return await self._detect_anomaly(input_data, context)
        elif operation == "aggregate_alerts":
            return await self._aggregate_alerts(input_data, context)
        else:
            return AgentResult(
                success=False,
                error=f"Unknown operation: {operation}"
            )

    async def _collect_metrics(
        self,
        input_data: Dict,
        context: Dict
    ) -> AgentResult:
        """收集指标"""

        resource_id = input_data["resource_id"]
        metric_names = input_data.get("metric_names", [])

        # 收集指标
        metrics = {}
        for metric_name in metric_names:
            tool_name = f"{context['cloud_provider']}.get_metric"
            result = await self.execute_tool(
                tool_name,
                {
                    "resource_id": resource_id,
                    "metric_name": metric_name,
                    "period": input_data.get("period", 60)
                },
                context
            )
            metrics[metric_name] = result.data

        return AgentResult(
            success=True,
            data={
                "resource_id": resource_id,
                "metrics": metrics,
                "timestamp": time.time()
            }
        )
```

### 4.3 Diagnose Agent 实现

```python
"""Diagnose Agent"""

class DiagnoseAgent(BaseAgent):
    """诊断 Agent"""

    def __init__(self):
        super().__init__("diagnose", "Diagnose Agent")
        self.knowledge_graph = KnowledgeGraph()
        self.rule_engine = DiagnosticRuleEngine()
        self._register_capabilities()

    def _register_capabilities(self):
        """注册能力"""
        self.capabilities = [
            AgentCapability(
                name="root_cause_analysis",
                description="根因分析",
                input_types=["symptoms", "metrics"],
                output_types=["causes", "confidence"]
            ),
            AgentCapability(
                name="performance_diagnosis",
                description="性能诊断",
                input_types=["resource_id", "time_range"],
                output_types=["bottlenecks"]
            ),
            AgentCapability(
                name="log_analysis",
                description="日志分析",
                input_types=["log_patterns"],
                output_types=["findings"]
            )
        ]

    async def process(
        self,
        input_data: Dict[str, Any],
        context: Dict[str, Any]
    ) -> AgentResult:
        """处理诊断请求"""

        operation = input_data.get("operation")

        if operation == "root_cause_analysis":
            return await self._analyze_root_cause(input_data, context)
        elif operation == "performance_diagnosis":
            return await self._diagnose_performance(input_data, context)
        else:
            return AgentResult(success=False, error=f"Unknown operation: {operation}")

    async def _analyze_root_cause(
        self,
        input_data: Dict,
        context: Dict
    ) -> AgentResult:
        """根因分析"""

        symptoms = input_data["symptoms"]
        metrics = input_data.get("metrics", {})

        # 1. 知识图谱推理
        kg_causes = await self.knowledge_graph.query(symptoms)

        # 2. 规则引擎分析
        rule_causes = await self.rule_engine.analyze(symptoms, metrics)

        # 3. 合并结果
        all_causes = kg_causes + rule_causes

        # 4. 排序和置信度计算
        ranked_causes = self._rank_causes(all_causes)

        # 5. 生成建议
        recommendations = self._generate_recommendations(ranked_causes[0])

        return AgentResult(
            success=True,
            data={
                "causes": ranked_causes,
                "confidence": ranked_causes[0]["confidence"] if ranked_causes else 0,
                "recommendations": recommendations,
                "analysis_method": "knowledge_graph + rule_engine"
            },
            confidence=ranked_causes[0]["confidence"] if ranked_causes else 0
        )

    def _rank_causes(self, causes: List[Dict]) -> List[Dict]:
        """排序根因"""
        # 综合置信度、可能性、影响力排序
        for cause in causes:
            cause["score"] = (
                cause.get("confidence", 0) * 0.4 +
                cause.get("probability", 0) * 0.3 +
                cause.get("impact", 0) * 0.3
            )
        return sorted(causes, key=lambda c: c["score"], reverse=True)
```

---

## 5. 测试驱动开发

### 5.1 单元测试

```python
"""工具单元测试"""

import pytest
from unittest.mock import AsyncMock, MagicMock

class TestECSScaleTool:
    """ECS 扩容工具测试"""

    @pytest.fixture
    def tool(self):
        """创建工具实例"""
        return ECSScaleTool()

    @pytest.fixture
    def mock_cloud_api(self):
        """Mock 云 API"""
        api = AsyncMock()
        api.describe_instance = AsyncMock(return_value={
            "instance_id": "ecs-001",
            "replicas": 2,
            "status": "Running"
        })
        api.scale_instance = AsyncMock(return_value={
            "task_id": "task-001",
            "backup_id": "backup-001"
        })
        return api

    @pytest.mark.asyncio
    async def test_scale_success(self, tool, mock_cloud_api):
        """测试成功扩容"""
        tool.cloud_api = mock_cloud_api

        result = await tool.execute(
            params={
                "instance_id": "ecs-001",
                "target_replicas": 4
            },
            context={
                "permissions": ["ecs:ScaleInstance"]
            }
        )

        assert result.success is True
        assert result.data["current_replicas"] == 4
        assert mock_cloud_api.scale_instance.called

    @pytest.mark.asyncio
    async def test_permission_denied(self, tool, mock_cloud_api):
        """测试权限不足"""
        tool.cloud_api = mock_cloud_api

        result = await tool.execute(
            params={
                "instance_id": "ecs-001",
                "target_replicas": 4
            },
            context={
                "permissions": []  # 无权限
            }
        )

        assert result.success is False
        assert result.error_code == "PERMISSION_DENIED"

    @pytest.mark.asyncio
    async def test_risk_threshold(self, tool, mock_cloud_api):
        """测试风险阈值"""
        tool.cloud_api = mock_cloud_api

        result = await tool.execute(
            params={
                "instance_id": "ecs-001",
                "target_replicas": 10  # 超过 2x
            },
            context={
                "permissions": ["ecs:ScaleInstance"]
            }
        )

        assert result.success is False
        assert result.error_code == "RISK_THRESHOLD_EXCEEDED"
```

### 5.2 集成测试

```python
"""Agent 集成测试"""

class TestMonitorAgentIntegration:
    """Monitor Agent 集成测试"""

    @pytest.fixture
    async def agent(self):
        """创建 Agent"""
        agent = MonitorAgent()
        await agent.initialize()
        return agent

    @pytest.fixture
    async def mock_environment(self):
        """创建 Mock 环境"""
        env = MockCloudEnvironment()
        await env.setup()
        yield env
        await env.cleanup()

    @pytest.mark.asyncio
    async def test_collect_metrics_flow(self, agent, mock_environment):
        """测试指标收集流程"""

        result = await agent.process(
            input_data={
                "operation": "collect_metrics",
                "resource_id": "ecs-001",
                "metric_names": ["cpu_utilization", "memory_utilization"]
            },
            context={
                "cloud_provider": "aliyun",
                "tenant_id": "tenant-001"
            }
        )

        assert result.success is True
        assert "cpu_utilization" in result.data["metrics"]
        assert "memory_utilization" in result.data["metrics"]
```

### 5.3 Harness 测试

```python
"""Agent Harness 测试"""

class TestCloudOpsAgentHarness:
    """Cloud Ops Agent Harness 测试"""

    @pytest.fixture
    def harness(self):
        """创建 Harness"""
        return CloudOpsAgentHarness()

    def test_harness_creation(self, harness):
        """测试 Harness 创建"""
        assert harness is not None
        assert harness.test_cases == {}

    def test_register_test_case(self, harness):
        """测试注册测试用例"""
        test_case = TestCase(
            test_id="test-001",
            name="测试用例",
            test_type=TestType.FUNCTIONAL
        )
        harness.register_test(test_case)
        assert "test-001" in harness.test_cases
```

---

## 6. 调试与排障

### 6.1 本地调试

```bash
# 1. 启用调试模式
export DEBUG=true
export LOG_LEVEL=DEBUG

# 2. 启动服务
make dev

# 3. 查看日志
kubectl logs -f -l app=cloud-ops-agent -c agent

# 4. 调试端口
# VSCode launch.json 配置
{
    "name": "Python: Remote Debug",
    "type": "python",
    "request": "attach",
    "connect": {
        "host": "localhost",
        "port": 5678
    },
    "justMyCode": false
}
```

### 6.2 常见问题排查

| 问题 | 排查方法 | 解决方案 |
|-----|---------|---------|
| Agent 不响应 | 检查 health endpoint | 重启 Agent Pod |
| 工具调用失败 | 查看工具日志 | 检查权限/配额 |
| 任务卡住 | 检查任务状态 | 强制取消重试 |
| 内存泄漏 | 查看 Pod 内存 | 增加 limit 或重启 |
| 网络超时 | 检查网络策略 | 调整 timeout |

### 6.3 日志分析

```bash
# 查看最近 100 条错误日志
kubectl logs -f -l app=cloud-ops-agent --tail=100 | grep ERROR

# 查看特定请求的日志
kubectl logs -f -l app=cloud-ops-agent | grep "request_id=abc123"

# 统计分析日志
cat agent.log | jq '.level | if . == "ERROR" then . end' | sort | uniq -c
```

---

## 7. 部署上线

### 7.1 构建镜像

```bash
# 构建生产镜像
make build VERSION=2.0.0

# 推送到镜像仓库
make push VERSION=2.0.0

# 验证镜像
docker inspect cloud-ops-agent:2.0.0
```

### 7.2 部署流程

```bash
# 1. 更新 Helm values
vim deployments/values-production.yaml

# 2. 部署到 Staging
helm upgrade --install cloud-ops-agent-staging \
    deployments/cloud-ops-agent \
    -f deployments/values-staging.yaml \
    --namespace cloud-ops \
    --set image.tag=2.0.0-staging

# 3. 验证部署
kubectl rollout status deployment/cloud-ops-agent-staging

# 4. 运行冒烟测试
make smoke-test ENV=staging

# 5. 部署到 Production
helm upgrade --install cloud-ops-agent \
    deployments/cloud-ops-agent \
    -f deployments/values-production.yaml \
    --namespace cloud-ops \
    --set image.tag=2.0.0
```

### 7.3 回滚

```bash
# 回滚到上一个版本
kubectl rollout undo deployment/cloud-ops-agent

# 回滚到指定版本
kubectl rollout undo deployment/cloud-ops-agent --to-revision=3
```

---

## 8. 最佳实践

### 8.1 代码规范

- [ ] **类型注解**: 所有公共接口必须添加类型注解
- [ ] **Docstring**: 所有类和公共方法必须编写 Docstring
- [ ] **单元测试**: 新代码必须有单元测试，覆盖率 ≥ 80%
- [ ] **Code Review**: 所有代码必须经过 Review 才能合并
- [ ] **版本管理**: 遵循 Semantic Versioning

### 8.2 安全规范

- [ ] **敏感信息**: 禁止在代码中硬编码密钥，使用 Vault/KMS
- [ ] **权限检查**: 所有工具执行前必须检查权限
- [ ] **输入验证**: 所有外部输入必须验证
- [ ] **审计日志**: 所有操作必须记录审计日志

### 8.3 性能规范

- [ ] **异步优先**: IO 操作必须异步化
- [ ] **连接池**: 使用连接池管理外部依赖
- [ ] **超时控制**: 所有外部调用必须设置超时
- [ ] **限流**: 对外部 API 调用必须限流

---

## 9. 交叉引用

| 相关文档 | 说明 |
|---------|------|
| [架构设计](../architecture/index.md) | 了解系统架构 |
| [测试指南](../testing/index.md) | 了解测试框架 |
| [运维指南](../operations/index.md) | 了解运维实践 |
| [语料指南](./corpus/index.md) | 了解语料工程 |
| [产品指南](./product/index.md) | 了解产品需求 |
| [集成测试](./integration_testing/index.md) | 了解集成测试 |

---

*最后更新: 2026-04-15*
*版本: 2.0.0*
*维护者: 研发团队*

## Related

- [[18_Cloud_Ops_Agent/CloudOps-in-nutshell]] — 云产品运维 Agent 速成指南 (共享: ai-agents, automation, cloud-ops, devops, sre)
- [[18_Cloud_Ops_Agent/Cloud_Product_Ops_for_dummy]] — 云产品运维 Agent 入门指南 (for Dummies) (共享: ai-agents, automation, cloud-ops, devops, sre)
- [[18_Cloud_Ops_Agent/docs/architecture/index]] — 云产品运维 Agent 架构设计指南 (Architecture) (共享: ai-agents, automation, cloud-ops, devops, sre)
- [[18_Cloud_Ops_Agent/docs/corpus/index]] — 云产品运维 Agent 语料工程指南 (Corpus Engineering) (共享: ai-agents, automation, cloud-ops, devops, sre)
- [[18_Cloud_Ops_Agent/docs/templates/dev_template.md|dev_template]]
