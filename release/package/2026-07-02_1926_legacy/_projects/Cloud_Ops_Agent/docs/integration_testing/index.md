---
title: 云产品运维 Agent 集成测试指南 (Integration Testing)
category: 18-cloud-ops-agent-docs-integration-testing
tags: ["cloud-ops", "devops", "sre", "automation", "ai-agents", "testing"]
summary: "> 🎯 **目标**: 为测试工程师提供 Cloud Ops Agent 的端到端集成测试、跨组件测试、灰度发布测试、混沌工程测试的完整测试体系，确保系统在生产环境下稳定可靠。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
---

# 云产品运维 Agent 集成测试指南 (Integration Testing)

> 🎯 **目标**: 为测试工程师提供 Cloud Ops Agent 的端到端集成测试、跨组件测试、灰度发布测试、混沌工程测试的完整测试体系，确保系统在生产环境下稳定可靠。

---

## 1. 集成测试概述

### 1.1 测试分层架构

```
Cloud Ops Agent 测试金字塔
═══════════════════════════════════════════════════════════════════════

                              ▲
                             ╱ ╲
                            ╱   ╲
                           ╱     ╲
                          ╱  E2E  ╲         ← 少量，验证完整流程
                         ╱──────────╲
                        ╱            ╲
                       ╱  Integration ╲        ← 中量，跨组件验证
                      ╱────────────────╲
                     ╱                  ╲
                    ╱    Component      ╲       ← 大量，单组件测试
                   ╱────────────────────╲
                  ╱                      ╲
                 ╱       Unit            ╲      ← 最多，单元测试
                ╱────────────────────────╲

测试数量:     1          10         100        1000
执行速度:     小时        分钟        秒         毫秒
隔离程度:     最低        中等        高         最高
```

### 1.2 测试类型矩阵

| 测试类型 | 目标 | 覆盖范围 | 执行频率 | 工具/框架 |
|---------|-----|---------|---------|----------|
| **单元测试** | 单个函数/类 | 函数逻辑 | 每次提交 | pytest, JUnit |
| **组件测试** | 单个 Agent 模块 | 模块行为 | 每次提交 | Mock + Harness |
| **集成测试** | 多组件协作 | 接口协议 | 每日 | Testcontainers |
| **E2E 测试** | 完整用户场景 | 端到端流程 | 每周/发布前 | Selenium, Playwright |
| **性能测试** | 系统性能指标 | 负载能力 | 每周/发布前 | k6, Locust, JMeter |
| **安全测试** | 安全漏洞检测 | 攻击面 | 每月/发布前 | OWASP ZAP, Burp |
| **混沌测试** | 系统韧性 | 故障场景 | 每月 | Chaos Monkey, Gremlin |
| **回归测试** | 功能完整性 | 历史功能 | 每次发布前 | Agent Harness |

---

## 2. 集成测试框架

### 2.1 测试框架架构

```python
"""集成测试框架"""

import pytest
import asyncio
from typing import Dict, List, Any
from dataclasses import dataclass, field
from enum import Enum

class TestEnvironment(Enum):
    """测试环境"""
    LOCAL = "local"           # 本地开发环境
    DEV = "dev"               # 开发环境
    STAGING = "staging"       # 预发环境
    PRODUCTION = "production"  # 生产环境 (只读)

class TestSeverity(Enum):
    """测试严重性"""
    BLOCKER = "blocker"       # 阻塞性问题
    CRITICAL = "critical"      # 严重问题
    MAJOR = "major"           # 主要问题
    MINOR = "minor"           # 次要问题
    TRIVIAL = "trivial"       # 轻微问题

@dataclass
class IntegrationTestCase:
    """集成测试用例"""
    test_id: str
    name: str
    description: str
    components: List[str]           # 涉及组件
    dependencies: List[str]         # 外部依赖
    severity: TestSeverity
    environment: TestEnvironment
    timeout_seconds: int = 300

    # 测试数据
    setup_data: Dict[str, Any] = field(default_factory=dict)
    test_input: Dict[str, Any] = field(default_factory=dict)
    expected_output: Dict[str, Any] = field(default_factory=dict)

    # Mock 配置
    mock_services: List[str] = field(default_factory=list)
    mock_responses: Dict[str, Any] = field(default_factory=dict)

@dataclass
class TestExecutionResult:
    """测试执行结果"""
    test_id: str
    passed: bool
    duration_seconds: float
    actual_output: Dict[str, Any]
    assertions_passed: List[str]
    assertions_failed: List[str]
    errors: List[str]
    traces: List[Dict]

class CloudOpsIntegrationTestSuite:
    """Cloud Ops Agent 集成测试套件"""

    def __init__(self, environment: TestEnvironment):
        self.environment = environment
        self.test_cases: Dict[str, IntegrationTestCase] = {}
        self.mock_registry = MockServiceRegistry()
        self.tracer = DistributedTracer()
        self.metrics_collector = MetricsCollector()

    def register_test(self, test_case: IntegrationTestCase):
        """注册测试用例"""
        self.test_cases[test_case.test_id] = test_case

    async def setup_environment(self, test_case: IntegrationTestCase):
        """设置测试环境"""
        # 1. 部署必要的组件
        await self._deploy_components(test_case.components)

        # 2. 配置 Mock 服务
        for mock_service in test_case.mock_services:
            await self.mock_registry.setup(
                mock_service,
                test_case.mock_responses.get(mock_service, {})
            )

        # 3. 准备测试数据
        await self._prepare_test_data(test_case.setup_data)

        # 4. 启动追踪
        self.tracer.start_trace(test_case.test_id)

    async def teardown_environment(self, test_case: IntegrationTestCase):
        """清理测试环境"""
        # 停止追踪
        self.tracer.end_trace(test_case.test_id)

        # 清理 Mock
        await self.mock_registry.cleanup()

        # 清理测试数据
        await self._cleanup_test_data()

        # 释放资源
        await self._release_resources(test_case.components)

    async def execute_test(
        self,
        test_id: str
    ) -> TestExecutionResult:
        """执行单个集成测试"""

        test_case = self.test_cases.get(test_id)
        if not test_case:
            raise TestNotFoundError(f"Test {test_id} not found")

        start_time = asyncio.get_event_loop().time()

        try:
            # Setup
            await self.setup_environment(test_case)

            # Execute
            actual_output = await self._execute_test_flow(test_case)

            # Assert
            assertions_passed, assertions_failed = await self._run_assertions(
                test_case.expected_output,
                actual_output
            )

            # Collect traces
            traces = self.tracer.get_traces(test_id)

            # Collect metrics
            metrics = self.metrics_collector.collect(test_id)

            passed = len(assertions_failed) == 0

            return TestExecutionResult(
                test_id=test_id,
                passed=passed,
                duration_seconds=asyncio.get_event_loop().time() - start_time,
                actual_output=actual_output,
                assertions_passed=assertions_passed,
                assertions_failed=assertions_failed,
                errors=[],
                traces=traces
            )

        except Exception as e:
            return TestExecutionResult(
                test_id=test_id,
                passed=False,
                duration_seconds=asyncio.get_event_loop().time() - start_time,
                actual_output={},
                assertions_passed=[],
                assertions_failed=[],
                errors=[str(e)],
                traces=self.tracer.get_traces(test_id)
            )

        finally:
            await self.teardown_environment(test_case)
```

### 2.2 测试数据管理

```python
"""测试数据管理"""

class TestDataManager:
    """测试数据管理器"""

    def __init__(self):
        self.data_pool: Dict[str, Any] = {}
        self.isolation_level = "transaction"  # or "schema"

    async def create_test_data(
        self,
        data_template: Dict[str, Any]
    ) -> Dict[str, Any]:
        """创建测试数据"""
        test_data = {}

        for key, template in data_template.items():
            if template["type"] == "cloud_resource":
                # 创建测试用云资源
                resource = await self._create_cloud_resource(
                    template["provider"],
                    template["service"],
                    template["config"]
                )
                test_data[key] = resource

            elif template["type"] == "user_data":
                # 创建测试用户
                user = await self._create_test_user(
                    template["role"],
                    template["permissions"]
                )
                test_data[key] = user

            elif template["type"] == "time_series":
                # 创建时序测试数据
                ts_data = await self._generate_time_series(
                    template["metrics"],
                    template["duration"]
                )
                test_data[key] = ts_data

        return test_data

    async def cleanup_test_data(self, test_data: Dict[str, Any]):
        """清理测试数据"""
        for key, resource in test_data.items():
            if resource.get("type") == "cloud_resource":
                await self._delete_cloud_resource(resource["id"])
            elif resource.get("type") == "user":
                await self._delete_test_user(resource["id"])
```

---

## 3. 核心集成测试用例

### 3.1 跨组件集成测试

```python
"""跨组件集成测试用例"""

# 测试用例 #1: Agent Gateway → Orchestrator → 子 Agent 链路
test_gateway_to_orchestrator = IntegrationTestCase(
    test_id="INT-001",
    name="Gateway 到 Orchestrator 请求路由",
    description="验证请求从 Gateway 正确路由到 Orchestrator",
    components=["agent_gateway", "orchestrator", "message_queue"],
    dependencies=["redis", "kafka"],
    severity=TestSeverity.CRITICAL,
    environment=TestEnvironment.STAGING,
    timeout_seconds=60,
    mock_services=["cloud_api", "iam_service"],
    setup_data={
        "tenant": {
            "type": "user_data",
            "role": "operator",
            "permissions": ["ecs:scale", "rds:describe"]
        },
        "resources": {
            "type": "cloud_resource",
            "provider": "aliyun",
            "service": "ecs",
            "config": {"instance_type": "ecs.c5.large", "count": 2}
        }
    },
    test_input={
        "request": {
            "tenant_id": "tenant-test-001",
            "operation": "scale",
            "target": "ecs-test-cluster",
            "desired_replicas": 4
        }
    },
    expected_output={
        "status_code": 202,
        "task_id": "task-.*",
        "orchestrator_received": True,
        "sub_agent_invoked": True
    }
)

# 测试用例 #2: Orchestrator → Monitor Agent → Tool Registry
test_monitor_agent_flow = IntegrationTestCase(
    test_id="INT-002",
    name="监控诊断完整流程",
    description="验证从监控数据收集到诊断分析的完整链路",
    components=["orchestrator", "monitor_agent", "diagnose_agent", "tool_registry"],
    dependencies=["monitoring_service", "time_series_db"],
    severity=TestSeverity.CRITICAL,
    environment=TestEnvironment.STAGING,
    timeout_seconds=120,
    mock_services=["cloudwatch_api"],
    setup_data={
        "monitoring_data": {
            "type": "time_series",
            "metrics": ["cpu_utilization", "memory_utilization"],
            "duration": "1h",
            "anomaly_points": [
                {"timestamp": "2026-04-15T10:30:00Z", "cpu": 95},
                {"timestamp": "2026-04-15T10:35:00Z", "cpu": 98}
            ]
        }
    },
    test_input={
        "symptom": "服务响应变慢，P99 延迟超过 2 秒",
        "time_range": "2026-04-15T10:00:00Z/2026-04-15T11:00:00Z"
    },
    expected_output={
        "diagnosis_completed": True,
        "root_cause_identified": True,
        "confidence": "> 0.8",
        "tool_calls_recorded": True
    }
)

# 测试用例 #3: Action Agent 执行高风险操作
test_high_risk_action = IntegrationTestCase(
    test_id="INT-003",
    name="高风险操作执行与审批",
    description="验证高风险操作需要正确审批流程",
    components=["orchestrator", "action_agent", "approval_service", "audit_logger"],
    dependencies=["notification_service"],
    severity=TestSeverity.BLOCKER,
    environment=TestEnvironment.STAGING,
    timeout_seconds=60,
    mock_services=[],
    setup_data={
        "high_risk_operation": {
            "operation": "delete_rds_instance",
            "risk_level": "critical",
            "requires_approval": True
        }
    },
    test_input={
        "operation": "delete_rds_instance",
        "instance_id": "rds-test-001",
        "tenant_id": "tenant-test-001",
        "approval_status": "pending"
    },
    expected_output={
        "operation_blocked": True,
        "approval_requested": True,
        "notification_sent": True,
        "audit_logged": True
    }
)

# 测试用例 #4: 跨云平台集成
test_multi_cloud_integration = IntegrationTestCase(
    test_id="INT-004",
    name="多云统一监控",
    description="验证跨 AWS 和阿里云的统一监控能力",
    components=["orchestrator", "monitor_agent", "aws_connector", "aliyun_connector"],
    dependencies=["aws_cloudwatch", "aliyun_cloudmonitor"],
    severity=TestSeverity.MAJOR,
    environment=TestEnvironment.STAGING,
    timeout_seconds=180,
    mock_services=["aws_api", "aliyun_api"],
    setup_data={
        "aws_resources": {
            "type": "cloud_resource",
            "provider": "aws",
            "service": "ec2",
            "config": {"instance_type": "t3.medium", "count": 2}
        },
        "aliyun_resources": {
            "type": "cloud_resource",
            "provider": "aliyun",
            "service": "ecs",
            "config": {"instance_type": "ecs.c5.large", "count": 2}
        }
    },
    test_input={
        "query": "所有云平台 CPU 利用率 > 80% 的实例"
    },
    expected_output={
        "aws_results": True,
        "aliyun_results": True,
        "total_count": 4,
        "unified_format": True
    }
)
```

### 3.2 接口协议测试

```python
"""API 接口协议测试"""

class APIVersion(Enum):
    """API 版本"""
    V1 = "v1"
    V2 = "v2"

@dataclass
class APIEndpoint:
    """API 端点"""
    method: str
    path: str
    version: APIVersion
    request_schema: Dict
    response_schema: Dict
    auth_required: bool
    rate_limit: int  # requests per minute

API_ENDPOINTS = [
    APIEndpoint(
        method="POST",
        path="/api/v1/tasks",
        version=APIVersion.V1,
        request_schema={
            "type": "object",
            "required": ["operation", "tenant_id"],
            "properties": {
                "operation": {"type": "string", "enum": ["scale", "restart", "deploy"]},
                "tenant_id": {"type": "string"},
                "target_resources": {"type": "array", "items": {"type": "string"}},
                "parameters": {"type": "object"}
            }
        },
        response_schema={
            "type": "object",
            "properties": {
                "task_id": {"type": "string"},
                "status": {"type": "string"},
                "created_at": {"type": "string", "format": "date-time"}
            }
        },
        auth_required=True,
        rate_limit=100
    ),

    APIEndpoint(
        method="GET",
        path="/api/v1/tasks/{task_id}",
        version=APIVersion.V1,
        request_schema={},
        response_schema={
            "type": "object",
            "properties": {
                "task_id": {"type": "string"},
                "status": {"type": "string"},
                "progress": {"type": "number"},
                "result": {"type": "object"}
            }
        },
        auth_required=True,
        rate_limit=200
    ),

    APIEndpoint(
        method="POST",
        path="/api/v1/approvals",
        version=APIVersion.V1,
        request_schema={
            "type": "object",
            "required": ["task_id", "decision"],
            "properties": {
                "task_id": {"type": "string"},
                "decision": {"type": "string", "enum": ["approve", "reject"]},
                "comment": {"type": "string"}
            }
        },
        response_schema={
            "type": "object",
            "properties": {
                "approval_id": {"type": "string"},
                "status": {"type": "string"}
            }
        },
        auth_required=True,
        rate_limit=50
    )
]

# 接口测试用例
class APIProtocolTests:
    """API 协议测试"""

    def test_request_validation(self):
        """请求体验证测试"""
        test_cases = [
            {
                "name": "缺少必需字段",
                "request": {"tenant_id": "test-001"},  # 缺少 operation
                "expected_status": 400,
                "expected_error": "operation is required"
            },
            {
                "name": "无效的操作类型",
                "request": {"operation": "invalid_op", "tenant_id": "test-001"},
                "expected_status": 400,
                "expected_error": "operation must be one of"
            },
            {
                "name": "未授权请求",
                "request": {"operation": "scale", "tenant_id": "test-001"},
                "auth": None,  # 无认证
                "expected_status": 401
            },
            {
                "name": "有效请求",
                "request": {"operation": "scale", "tenant_id": "test-001", "target_resources": ["res-1"]},
                "expected_status": 202
            }
        ]

    def test_rate_limiting(self):
        """限流测试"""
        # 发送超过限流的请求
        # 验证返回 429 Too Many Requests
        # 验证 Retry-After header
        pass

    def test_version_compatibility(self):
        """版本兼容性测试"""
        # 测试 v1 API 在 v2 环境中的兼容性
        # 测试向后兼容性
        pass
```

---

## 4. 端到端 (E2E) 测试

### 4.1 E2E 测试场景

```python
"""E2E 测试场景"""

class E2ETestScenario:
    """E2E 测试场景"""

    def __init__(
        self,
        scenario_id: str,
        name: str,
        description: str,
        user_persona: str,
        steps: List[str],
        success_criteria: Dict
    ):
        self.scenario_id = scenario_id
        self.name = name
        self.description = description
        self.user_persona = user_persona
        self.steps = steps
        self.success_criteria = success_criteria

E2E_SCENARIOS = [
    # 场景 #1: 弹性扩容 E2E
    E2ETestScenario(
        scenario_id="E2E-001",
        name="弹性扩容完整流程",
        description="用户发起扩容请求，Agent 自动完成从检测到验证的完整流程",
        user_persona="运维工程师",
        steps=[
            "1. 用户通过控制台发起扩容请求 (当前 2 实例 → 4 实例)",
            "2. Gateway 接收请求，进行认证授权",
            "3. Orchestrator 接收任务，开始编排",
            "4. Monitor Agent 收集当前指标 (CPU 85%)",
            "5. Diagnose Agent 分析确认需要扩容",
            "6. Action Agent 执行扩容操作",
            "7. Tool Executor 调用云 API 扩容",
            "8. Monitor Agent 验证新实例健康",
            "9. 系统通知用户扩容完成",
            "10. 审计日志记录完整流程"
        ],
        success_criteria={
            "total_duration": "< 5 分钟",
            "final_state": "4 个健康实例",
            "user_notification": "已发送",
            "audit_complete": True
        }
    ),

    # 场景 #2: 故障自愈 E2E
    E2ETestScenario(
        scenario_id="E2E-002",
        name="故障自愈完整流程",
        description="检测到服务异常，Agent 自动完成诊断→决策→修复→验证",
        user_persona="值班工程师",
        steps=[
            "1. Monitor Agent 检测到健康检查失败",
            "2. Monitor Agent 触发告警通知",
            "3. Diagnose Agent 自动启动诊断",
            "4. 收集日志、指标、网络状态",
            "5. 识别根因: 内存不足导致 OOM",
            "6. Action Agent 生成修复方案",
            "7. 执行前备份当前状态",
            "8. 执行内存扩容",
            "9. 重启服务",
            "10. 验证服务恢复",
            "11. 如失败则回滚",
            "12. 生成事故报告"
        ],
        success_criteria={
            "detection_to_recovery": "< 10 分钟",
            "MTTR": "< 10 分钟",
            "user_impact": "0",
            "auto_recovery": True
        }
    ),

    # 场景 #3: 变更发布 E2E
    E2ETestScenario(
        scenario_id="E2E-003",
        name="灰度发布完整流程",
        description="新版本发布通过 Agent 自动化灰度发布流程",
        user_persona="DevOps 工程师",
        steps=[
            "1. 用户提交发布请求 (新版本 v2.0)",
            "2. Agent 进行变更风险评估",
            "3. 高风险操作发送审批请求",
            "4. 审批通过后开始灰度发布",
            "5. 先将 10% 流量切换到新版本",
            "6. Monitor Agent 监控新版本指标",
            "7. 指标异常则自动回滚",
            "8. 指标正常则逐步扩量 (10% → 50% → 100%)",
            "9. 发布完成通知",
            "10. 审计日志记录"
        ],
        success_criteria={
            "risk_assessment_done": True,
            "approval_recorded": True,
            "gradual_rollout": True,
            "auto_rollback_triggered": False,
            "total_duration": "< 30 分钟"
        }
    ),

    # 场景 #4: 安全审计 E2E
    E2ETestScenario(
        scenario_id="E2E-004",
        name="安全合规审计完整流程",
        description="定期安全扫描，Agent 自动完成扫描→报告→修复建议",
        user_persona="安全工程师",
        steps=[
            "1. 定时触发安全扫描任务",
            "2. Security Agent 执行漏洞扫描",
            "3. 扫描云资源安全配置",
            "4. 扫描 IAM 权限配置",
            "5. 扫描网络访问策略",
            "6. 汇总漏洞和风险点",
            "7. 评估风险等级",
            "8. 生成安全报告",
            "9. 高风险问题发送告警",
            "10. 提供修复建议"
        ],
        success_criteria={
            "scan_coverage": "100% 云资源",
            "vulnerabilities_found": True,
            "report_generated": True,
            "high_risk_alerted": True
        }
    )
]
```

### 4.2 E2E 测试执行框架

```python
"""E2E 测试执行器"""

class E2ETestExecutor:
    """E2E 测试执行器"""

    def __init__(self):
        self.browser = BrowserManager()  # Playwright/Selenium
        self.api_client = APIClient()
        self.test_data_manager = TestDataManager()
        self.screenshot_capture = ScreenshotCapture()

    async def execute_scenario(
        self,
        scenario: E2ETestScenario,
        environment: TestEnvironment
    ) -> E2EResult:
        """执行 E2E 场景"""

        # 创建测试数据
        test_data = await self.test_data_manager.create_test_data({
            "tenant": {"type": "user_data", "role": "operator"},
            "resources": {"type": "cloud_resource", "count": 4}
        })

        # 初始化浏览器 (如果是 UI 测试)
        await self.browser.initialize()

        execution_log = []

        try:
            for step in scenario.steps:
                step_start = time.time()

                # 执行步骤
                result = await self._execute_step(step, test_data)

                # 截图 (如果是 UI 操作)
                screenshot = await self.screenshot_capture.capture()

                execution_log.append({
                    "step": step,
                    "result": result,
                    "duration": time.time() - step_start,
                    "screenshot": screenshot
                })

                # 验证步骤结果
                if not result["success"]:
                    return E2EResult(
                        scenario_id=scenario.scenario_id,
                        passed=False,
                        failed_at_step=step,
                        execution_log=execution_log,
                        error=result["error"]
                    )

            # 验证最终状态
            final_state = await self._verify_final_state(scenario)

            return E2EResult(
                scenario_id=scenario.scenario_id,
                passed=True,
                execution_log=execution_log,
                final_state=final_state
            )

        finally:
            await self.browser.cleanup()
            await self.test_data_manager.cleanup_test_data(test_data)
```

---

## 5. 性能测试

### 5.1 性能测试场景

```python
"""性能测试场景"""

class PerformanceTestScenario:
    """性能测试场景"""

    def __init__(
        self,
        name: str,
        load_profile: Dict,
        targets: Dict,
        duration_seconds: int
    ):
        self.name = name
        self.load_profile = load_profile
        self.targets = targets
        self.duration_seconds = duration_seconds

PERFORMANCE_TEST_SCENARIOS = [
    PerformanceTestScenario(
        name="正常负载测试",
        load_profile={
            "users": 100,
            "ramp_up_seconds": 60,
            "pattern": "steady"
        },
        targets={
            "p50_latency": "< 500ms",
            "p95_latency": "< 1s",
            "p99_latency": "< 2s",
            "error_rate": "< 1%",
            "throughput": "> 1000 req/s"
        },
        duration_seconds=300
    ),

    PerformanceTestScenario(
        name="峰值负载测试",
        load_profile={
            "users": 500,
            "ramp_up_seconds": 120,
            "pattern": "spike"  # 突发
        },
        targets={
            "p50_latency": "< 1s",
            "p95_latency": "< 3s",
            "p99_latency": "< 5s",
            "error_rate": "< 5%",
            "throughput": "> 3000 req/s"
        },
        duration_seconds=180
    ),

    PerformanceTestScenario(
        name="长时间稳定性测试",
        load_profile={
            "users": 50,
            "ramp_up_seconds": 30,
            "pattern": "steady"
        },
        targets={
            "memory_leak": "0",
            "cpu_growth": "< 5%",
            "error_rate": "< 0.5%",
            "sustained_throughput": "> 500 req/s"
        },
        duration_seconds=3600  # 1 小时
    ),

    PerformanceTestScenario(
        name="扩容性能测试",
        load_profile={
            "users": 200,
            "ramp_up_seconds": 0,  # 瞬时
            "pattern": "step"  # 阶梯
        },
        targets={
            "scale_up_time": "< 2 分钟",
            "scale_down_time": "< 3 分钟",
            "throughput_during_scale": "> 80% baseline",
            "error_rate_during_scale": "< 2%"
        },
        duration_seconds=600
    )
]
```

### 5.2 性能测试脚本 (k6)

```javascript
// k6 性能测试脚本
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// 自定义指标
const latency = new Trend('latency');
const errorRate = new Rate('errors');
const taskSuccess = new Rate('task_success');

export const options = {
  stages: [
    { duration: '1m', target: 100 },   // 预热
    { duration: '5m', target: 100 },     // 正常负载
    { duration: '2m', target: 500 },    // 峰值
    { duration: '5m', target: 500 },    // 持续峰值
    { duration: '2m', target: 0 },      // 冷却
  ],
  thresholds: {
    'latency': ['p(95)<2000'],         // P95 < 2s
    'errors': ['rate<0.01'],           // 错误率 < 1%
    'task_success': ['rate>0.95']      // 成功率 > 95%
  }
};

export default function() {
  // 1. 创建运维任务
  const createTaskRes = http.post(
    'https://api.cloudops.example/api/v1/tasks',
    JSON.stringify({
      operation: 'scale',
      tenant_id: 'tenant-test-001',
      target_resources: ['ecs-' + Math.floor(Math.random() * 10)],
      parameters: { replicas: 4 }
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + __ENV.API_TOKEN
      }
    }
  );

  latency.add(createTaskRes.timings.duration);

  check(createTaskRes, {
    'task created': (r) => r.status === 202,
    'has task_id': (r) => JSON.parse(r.body).task_id !== undefined
  }) || errorRate.add(1);

  const taskId = JSON.parse(createTaskRes.body).task_id;

  // 2. 查询任务状态 (轮询直到完成)
  let attempts = 0;
  let taskCompleted = false;

  while (attempts < 30 && !taskCompleted) {
    const statusRes = http.get(
      `https://api.cloudops.example/api/v1/tasks/${taskId}`,
      {
        headers: { 'Authorization': 'Bearer ' + __ENV.API_TOKEN }
      }
    );

    const status = JSON.parse(statusRes.body).status;

    if (status === 'completed') {
      taskCompleted = true;
      taskSuccess.add(1);
    } else if (status === 'failed') {
      taskSuccess.add(0);
      break;
    }

    attempts++;
    sleep(2);  // 等待 2 秒
  }

  // 3. 监控指标查询
  const metricsRes = http.get(
    'https://api.cloudops.example/api/v1/metrics/query',
    {
      params: {
        'namespace': 'ecs',
        'metric_names': 'cpu_utilization',
        'period': '60s'
      },
      headers: { 'Authorization': 'Bearer ' + __ENV.API_TOKEN }
    }
  );

  check(metricsRes, {
    'metrics retrieved': (r) => r.status === 200
  }) || errorRate.add(1);

  sleep(1);
}
```

---

## 6. 混沌工程测试

### 6.1 混沌测试场景

```python
"""混沌工程测试场景"""

class ChaosScenario:
    """混沌测试场景"""

    def __init__(
        self,
        scenario_id: str,
        name: str,
        target_component: str,
        injection_type: str,
        expected_behavior: Dict,
        severity: str
    ):
        self.scenario_id = scenario_id
        self.name = name
        self.target_component = target_component
        self.injection_type = injection_type
        self.expected_behavior = expected_behavior
        self.severity = severity

CHAOS_SCENARIOS = [
    ChaosScenario(
        scenario_id="CHAOS-001",
        name="云 API 超时模拟",
        target_component="cloud_api_gateway",
        injection_type="network_latency",
        injection_params={
            "delay_ms": 5000,
            "percentage": 50  # 50% 请求受影响
        },
        expected_behavior={
            "circuit_breaker_triggered": True,
            "fallback_executed": True,
            "error_logged": True,
            "user_notification": "degraded"  # 用户感知降级
        },
        severity="medium"
    ),

    ChaosScenario(
        scenario_id="CHAOS-002",
        name="数据库连接池耗尽",
        target_component="rds_connection_pool",
        injection_type="connection_exhaustion",
        injection_params={
            "max_connections": 0,  # 耗尽所有连接
            "duration_seconds": 60
        },
        expected_behavior={
            "timeout_triggered": True,
            "retry_executed": True,
            "deadlock_detected": True,
            "auto_recovery": "connection_pool_reset"
        },
        severity="high"
    ),

    ChaosScenario(
        scenario_id="CHAOS-003",
        name="监控服务不可用",
        target_component="monitoring_service",
        injection_type="service_down",
        injection_params={
            "kill_service": True,
            "duration_seconds": 300
        },
        expected_behavior={
            "local_fallback": True,
            "stale_data_tolerated": True,
            "operation_allowed_with_warning": True,
            "recovery_on_service_restore": True
        },
        severity="medium"
    ),

    ChaosScenario(
        scenario_id="CHAOS-004",
        name="Agent 实例故障",
        target_component="agent_instance",
        injection_type="process_kill",
        injection_params={
            "instance_id": "agent-pod-3",
            "force": True
        },
        expected_behavior={
            "load_balancer_detected": True,
            "traffic_redirected": True,
            "task_resumed_by_other_agent": True,
            "no_task_loss": True
        },
        severity="high"
    ),

    ChaosScenario(
        scenario_id="CHAOS-005",
        name="Redis 缓存失效",
        target_component="redis_cache",
        injection_type="cache_invalidation",
        injection_params={
            "flush_all": True
        },
        expected_behavior={
            "cache_miss_handled": True,
            "database_load_increased": True,
            "fallback_to_database": True,
            "cache_warmed": True,
            "operation_latency_increased": "< 2x"
        },
        severity="low"
    ),

    ChaosScenario(
        scenario_id="CHAOS-006",
        name="消息队列积压",
        target_component="message_queue",
        injection_type="consumer_slowdown",
        injection_params={
            "consumer_count": 0,  # 停止所有消费者
            "producer_rate": 1000,  # 持续生产
            "duration_seconds": 120
        },
        expected_behavior={
            "queue_depth_alert": True,
            "backpressure_triggered": True,
            "producer_rate_limited": True,
            "system_stable": True,
            "gradual_recovery": True
        },
        severity="high"
    )
]
```

### 6.2 混沌测试执行

```python
"""混沌测试执行器"""

class ChaosEngine:
    """混沌工程引擎"""

    def __init__(self):
        self.experiment_runner = ExperimentRunner()
        self.monitor = RealTimeMonitor()
        self.safe_guard = SafeGuard()

    async def run_experiment(
        self,
        scenario: ChaosScenario,
        environment: TestEnvironment
    ) -> ChaosExperimentResult:
        """执行混沌实验"""

        # 1. 前置检查
        pre_check = await self._pre_experiment_check(scenario)
        if not pre_check.passed:
            return ChaosExperimentResult(
                experiment_id=scenario.scenario_id,
                status="skipped",
                reason=pre_check.failure_reason
            )

        # 2. 启动监控
        await self.monitor.start({
            "metrics": ["latency", "error_rate", "availability"],
            "alert_threshold": scenario.expected_behavior
        })

        # 3. 注入故障
        await self.experiment_runner.inject(
            scenario.target_component,
            scenario.injection_type,
            scenario.injection_params
        )

        # 4. 观察系统行为
        observations = await self._observe_behavior(scenario.duration)

        # 5. 停止故障注入
        await self.experiment_runner.stop()

        # 6. 恢复观察
        recovery_observations = await self._observe_recovery()

        # 7. 验证预期行为
        validation = self._validate_expected_behavior(
            scenario.expected_behavior,
            observations,
            recovery_observations
        )

        return ChaosExperimentResult(
            experiment_id=scenario.scenario_id,
            status="passed" if validation.all_matched else "failed",
            observations=observations,
            recovery_observations=recovery_observations,
            validation=validation
        )

class SafeGuard:
    """安全防护机制"""

    async def check_experiment_safety(
        self,
        scenario: ChaosScenario
    ) -> SafetyCheckResult:
        """检查实验安全性"""

        # 1. 不得影响生产
        if scenario.environment == TestEnvironment.PRODUCTION:
            # 允许的最大影响
            max_impact = {
                "error_rate": 0.05,  # 5%
                "latency_increase": 0.5,  # 50%
                "duration": 60  # 1 分钟
            }

        # 2. 备份检查
        if scenario.severity in ["high", "critical"]:
            backup_status = await self._check_backup_status()
            if not backup_status.available:
                return SafetyCheckResult(
                    safe=False,
                    reason="No recent backup available"
                )

        # 3. 回滚计划
        rollback_plan = await self._prepare_rollback_plan(scenario)

        return SafetyCheckResult(safe=True)
```

---

## 7. 灰度发布测试

### 7.1 灰度策略

```python
"""灰度发布策略"""

class ReleaseStrategy:
    """发布策略"""

    def __init__(
        self,
        name: str,
        stages: List[Dict],
        rollback_threshold: Dict
    ):
        self.name = name
        self.stages = stages
        self.rollback_threshold = rollback_threshold

RELEASE_STRATEGIES = [
    ReleaseStrategy(
        name="金丝雀发布 (Canary)",
        stages=[
            {"stage": 1, "traffic": 5, "duration_minutes": 30, "criteria": {"error_rate": "< 1%"}},
            {"stage": 2, "traffic": 20, "duration_minutes": 60, "criteria": {"error_rate": "< 0.5%"}},
            {"stage": 3, "traffic": 50, "duration_minutes": 60, "criteria": {"latency_p99": "< 2s"}},
            {"stage": 4, "traffic": 100, "duration_minutes": 30, "criteria": {"success_rate": "> 99%"}}
        ],
        rollback_threshold={"error_rate": 0.05, "latency_p99": 5000}
    ),

    ReleaseStrategy(
        name="蓝绿发布 (Blue-Green)",
        stages=[
            {"stage": 1, "environment": "staging", "traffic": 0, "duration_minutes": 120, "full_test": True},
            {"stage": 2, "environment": "production", "traffic": 0, "duration_minutes": 30, "criteria": {"health_check": "passed"}},
            {"stage": 3, "environment": "production", "traffic": 100, "duration_minutes": 30, "criteria": {"success_rate": "> 99.9%"}}
        ],
        rollback_threshold={"switchover_time": 60}  # 60 秒内可回切
    ),

    ReleaseStrategy(
        name="特性开关发布 (Feature Flag)",
        stages=[
            {"stage": 1, "enabled_for": ["internal"], "percentage": 0, "duration_days": 7},
            {"stage": 2, "enabled_for": ["beta_users"], "percentage": 10, "duration_days": 7},
            {"stage": 3, "enabled_for": ["all_users"], "percentage": 50, "duration_days": 7},
            {"stage": 4, "enabled_for": ["all_users"], "percentage": 100, "duration_days": 1}
        ],
        rollback_threshold={"user_complaints_rate": 0.01}
    )
]
```

### 7.2 灰度测试检查清单

```markdown
## 灰度发布测试检查清单

### 发布前检查 (Pre-release)
- [ ] 所有 P0/P1 测试用例通过
- [ ] 性能基准测试达标
- [ ] 安全扫描无高危漏洞
- [ ] 代码 Review 通过
- [ ] 变更日志已更新
- [ ] 回滚方案已准备
- [ ] 监控告警已配置
- [ ] 值班人员已通知

### 灰度阶段检查 (Each Stage)
- [ ] 错误率在阈值内
- [ ] 延迟在阈值内
- [ ] 核心功能可用
- [ ] 日志无异常 ERROR
- [ ] 监控面板正常
- [ ] 用户反馈正常 (如有)

### 全量发布检查 (Full Release)
- [ ] 灰度阶段无回滚
- [ ] 性能无退化
- [ ] 文档已更新
- [ ] 客户成功团队已通知
- [ ] 营销已准备 (如有新功能)
```

---

## 8. 测试自动化与 CI/CD

### 8.1 测试自动化流水线

```yaml
# CI/CD 测试流水线
stages:
  - name: "commit_phase"
    jobs:
      - name: "unit_tests"
        trigger: "on commit"
        runner: "fast"
        tests:
          - "agent_unit_tests"
          - "tool_unit_tests"
          - "util_tests"
        coverage_threshold: 80%
        timeout: "5m"

      - name: "lint_and_format"
        trigger: "on commit"
        runner: "fast"
        checks:
          - "code_style"
          - "security_lint"
          - "dependency_audit"

  - name: "integration_phase"
    jobs:
      - name: "component_tests"
        trigger: "on PR merge to develop"
        runner: "medium"
        tests:
          - "agent_component_tests"
          - "tool_registry_tests"
          - "gateway_tests"
        coverage_threshold: 70%
        timeout: "20m"

      - name: "integration_tests"
        trigger: "on PR merge to develop"
        runner: "medium"
        tests:
          - "cross_component_tests"
          - "api_protocol_tests"
        parallel: 4
        timeout: "30m"

  - name: "e2e_phase"
    jobs:
      - name: "e2e_tests"
        trigger: "daily + on release candidate"
        runner: "slow"
        tests:
          - "critical_user_journeys"
          - "smoke_tests"
        environment: "staging"
        timeout: "60m"

      - name: "performance_tests"
        trigger: "weekly + on release candidate"
        runner: "slow"
        tests:
          - "load_tests"
          - "stress_tests"
          - "capacity_tests"
        environment: "dedicated_perf_env"
        timeout: "120m"

  - name: "release_phase"
    jobs:
      - name: "chaos_tests"
        trigger: "weekly"
        runner: "designated_chaos_env"
        tests:
          - "critical_failure_scenarios"
        timeout: "60m"

      - name: "final_validation"
        trigger: "on release"
        runner: "medium"
        checks:
          - "security_scan"
          - "compliance_check"
          - "documentation_review"
```

### 8.2 测试质量门禁

```python
"""测试质量门禁"""

class QualityGate:
    """质量门禁"""

    GATES = {
        "commit": {
            "unit_test_pass_rate": 1.0,      # 100% 必须通过
            "coverage": 0.80,
            "lint_errors": 0,
            "security_issues": 0
        },
        "integration": {
            "test_pass_rate": 0.95,           # 95% 必须通过
            "coverage": 0.70,
            "critical_bugs": 0,
            "high_priority_bugs": 0
        },
        "e2e": {
            "critical_path_pass_rate": 1.0,   # 关键路径 100%
            "smoke_test_pass_rate": 1.0,
            "p0_bugs": 0
        },
        "performance": {
            "p95_latency_regression": 0.10,  # 最多允许 10% 退化
            "throughput_regression": 0.10,
            "error_rate": 0.01
        },
        "release": {
            "all_previous_gates": True,
            "chaos_tests_passed": True,
            "security_approved": True,
            "documentation_complete": True
        }
    }

    def evaluate_gate(
        self,
        gate_name: str,
        metrics: Dict
    ) -> GateResult:
        """评估质量门禁"""

        thresholds = self.GATES.get(gate_name, {})

        failures = []
        for metric, threshold in thresholds.items():
            actual = metrics.get(metric)

            if metric.endswith("_rate") or metric.endswith("_pass_rate"):
                # 比率类指标
                if actual < threshold:
                    failures.append(f"{metric}: {actual} < {threshold}")
            elif metric.endswith("_regression"):
                # 回归类指标
                if actual > threshold:
                    failures.append(f"{metric}: {actual} > {threshold}")
            else:
                # 计数类指标
                if actual > threshold:
                    failures.append(f"{metric}: {actual} > {threshold}")

        return GateResult(
            gate=gate_name,
            passed=len(failures) == 0,
            failures=failures,
            blockers=self._identify_blockers(failures)
        )
```

---

## 9. 测试报告与监控

### 9.1 测试报告模板

```markdown
## Cloud Ops Agent 测试报告

### 基本信息
- **版本**: v2.0.0
- **测试日期**: 2026-04-15
- **测试环境**: Staging
- **执行人**: QA Team

### 测试摘要
| 类型 | 用例数 | 通过数 | 失败数 | 通过率 |
|------|--------|--------|--------|--------|
| 单元测试 | 1,234 | 1,234 | 0 | 100% |
| 组件测试 | 156 | 154 | 2 | 98.7% |
| 集成测试 | 45 | 44 | 1 | 97.8% |
| E2E 测试 | 12 | 12 | 0 | 100% |
| 性能测试 | 8 | 8 | 0 | 100% |
| 混沌测试 | 6 | 5 | 1 | 83.3% |
| **总计** | **1,461** | **1,457** | **4** | **99.7%** |

### 失败用例详情
1. **INT-042**: [组件] 跨云监控集成测试 - 阿里云连接超时
   - 原因: Mock 服务配置问题
   - 状态: 已修复，待回归

### 性能测试结果
| 指标 | 基线 | 当前 | 变化 | 阈值 |
|------|------|------|------|------|
| P50 延迟 | 180ms | 195ms | +8.3% | < 500ms ✅ |
| P95 延迟 | 850ms | 920ms | +8.2% | < 2s ✅ |
| P99 延迟 | 1.8s | 1.9s | +5.6% | < 3s ✅ |
| 吞吐量 | 1,200/s | 1,150/s | -4.2% | > 1000/s ✅ |

### 风险评估
- **高风险**: 0 项
- **中风险**: 1 项 (阿里云集成)
- **低风险**: 3 项 (非阻塞性问题)

### 发布建议
✅ **可以发布** - 所有 P0 测试通过，性能指标达标

### 下一步行动
- [ ] 修复 INT-042 并回归测试
- [ ] 监控阿里云集成在生产环境表现
```

---

## 10. 最佳实践清单

### 10.1 测试设计最佳实践

- [ ] **测试独立性**: 每个测试用例独立，不依赖其他测试的执行顺序
- [ ] **测试数据隔离**: 使用独立测试数据，避免测试间相互影响
- [ ] **Mock 合理使用**: 外部依赖使用 Mock，核心逻辑用真实实现
- [ ] **边界条件覆盖**: 覆盖边界值、异常情况、空输入等
- [ ] **测试可读性**: 测试用例命名清晰，步骤明确

### 10.2 测试执行最佳实践

- [ ] **自动化执行**: 尽可能自动化，减少人工干预
- [ ] **持续集成**: 每次代码提交触发相应测试
- [ ] **快速反馈**: 单元测试在 5 分钟内完成
- [ ] **并行执行**: 支持测试用例并行执行，加快速度
- [ ] **失败重试**: 偶发性失败允许重试 (最多 2 次)

### 10.3 混沌测试最佳实践

- [ ] **生产禁止**: 禁止在生产环境进行高风险混沌实验
- [ ] **安全网**: 始终准备立即回滚的能力
- [ ] **逐步升级**: 从低风险场景开始，逐步增加复杂度
- [ ] **定期执行**: 每月至少执行一次核心混沌场景
- [ ] **文档化**: 记录所有实验结果和发现

---

## 11. 交叉引用

| 相关文档 | 说明 |
|---------|------|
| [架构设计](../architecture/索引.md) | 了解系统架构，识别集成点 |
| [研发指南](../development/索引.md) | 了解组件接口，编写组件测试 |
| [测试指南](./testing/索引.md) | 了解 Agent 评估框架 |
| [运维指南](../operations/索引.md) | 了解生产环境监控 |
| [语料指南](./corpus/索引.md) | 了解评估数据集要求 |

---

*最后更新: 2026-04-15*
*版本: 1.0.0*
*维护者: 测试工程团队*

## Related

- index — 云产品运维 Agent 评测指南 (Testing & Evaluation) (共享: ai-agents, automation, cloud-ops, devops, sre, testing)
- [[18_Cloud_Ops_Agent/CloudOps-in-nutshell]] — 云产品运维 Agent 速成指南 (共享: ai-agents, automation, cloud-ops, devops, sre)
- [[18_Cloud_Ops_Agent/Cloud_Product_Ops_for_dummy]] — 云产品运维 Agent 入门指南 (for Dummies) (共享: ai-agents, automation, cloud-ops, devops, sre)
- index — 云产品运维 Agent 架构设计指南 (Architecture) (共享: ai-agents, automation, cloud-ops, devops, sre)
- [[18_Cloud_Ops_Agent/docs/templates/ops_template.md|ops_template]]
