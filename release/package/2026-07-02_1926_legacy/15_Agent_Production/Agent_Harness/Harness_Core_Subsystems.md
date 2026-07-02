---
title: "Harness Core Subsystems Deep Dive"
created: 2025-06-16
tags:
  - agent-harness
  - runtime-engine
  - tool-layer
  - memory-system
  - model-integration
source: "_sources/yeasy/harness_engineering_guide/"
tier: peripheral
aliases:
  - "Harness Core Subsystems"
  - Harness_Core_Subsystems

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Harness Core Subsystems (Harness 核心子系统深度解析)

> 本文从《智能体 Harness 工程指南》Part 2（第 4-7 章）提炼运行时引擎、工具层、记忆子系统和模型集成四大核心子系统的工程实现细节。

Related: [[Harness_Engineering_Complete_Guide]] | [[Harness_Production_Security]] | [[Agentic_AI_Complete_Guide]] | [[AgentOps_Production_Guide]]

---

## 1. 运行时引擎 (Runtime Engine)

运行时引擎是 Harness 的心脏，驱动智能体的"感知-推理-行动"循环。

### 1.1 智能体循环的工程实现

#### 经典模型：思考-行动-观察循环

1. **思考 (Think)**：基于当前上下文推理，生成意图和下一步行动计划
2. **行动 (Act)**：执行工具调用或 API 请求，改变外部世界状态
3. **观察 (Observe)**：获得工具执行结果，更新内部认知模型

为什么是循环而非链式：循环设计允许逐步细化目标，在每个迭代中获得反馈，动态调整策略。

#### 两种工程实现模式

**Claude Code 的异步生成器模式**

```
submitMessage(userInput)
  -> yield agent_start
  -> while hasWorkToDo:
       yield turn_start
       -> Build & Validate Context (考虑缓存边界)
       -> Stream Model Response (yield text_delta / tool_use)
       -> StreamingToolExecutor.execute() (并发执行工具)
       -> yield message_end
  -> yield agent_end, result
```

特点：
- 异步生成器，客户端逐个处理事件
- 流式响应实时推送 (text_delta)
- StreamingToolExecutor 支持工具并发执行
- 上下文构建考虑缓存边界 (SYSTEM_PROMPT_DYNAMIC_BOUNDARY)
- AppState 管理会话状态（150+ 字段）

**OpenClaw 的线性流水线模式**

```
Session Loop (单线程):
  Intake(user msg) -> Context Assembly -> Inference(Claude)
  -> Response Streaming + Tool Detection -> Tool Execution Loop(顺序)
  -> Persistence(会话存储) -> 继续下一轮
```

特点：
- 每轮循环独立阶段化：input -> assembly -> inference -> execution -> persist
- 单线程执行，一次一个会话
- 错误作为 ToolResultBlock 反馈回消息流

**Codex 的 JSON-RPC 三层通信原语**

- **Item**：最小原子通信单元（item/started -> item/delta -> item/completed）
- **Turn**：由用户输入发起的工作单位（turn/start -> Items -> turn/completed）
- **Thread**：持久化会话容器，支持创建/恢复/分叉/归档

关键设计：**前缀一致性**——每轮推理的输入都是上轮输出的精确前缀，直接启用提示词缓存 (Prompt Caching)，多轮对话成本从二次方降至线性。

### 1.2 消息类型系统与状态管理

执行循环的六个步骤：
1. **感知 (Perceive)**：收集上下文（用户输入 + 短期记忆 + 长期记忆向量检索）
2. **推理 (Reasoning)**：组装 LLM 输入，调用模型
3. **决策 (Decision)**：解析输出，提取工具调用，验证合法性
4. **执行 (Execution)**：工具层隔离执行，超时限制，容错继续
5. **学习 (Learning)**：写入记忆系统（短期总是写入，高价值同步长期）
6. **判断 (Judgment)**：终止条件检查（最终答案/最大步数/总超时）

核心接口：
- `initialize(agent, task)` - 初始化
- `step()` - 单步循环（测试和调试主入口）
- `run(task, max_steps, timeout)` - 完整执行
- `pause()` / `resume()` - 长时任务中断续行
- `get_state()` - 可观测性接口

### 1.3 流式处理与事件驱动架构

流式事件类型：
- `content_block_start`：新内容块开始（文本或工具使用）
- `content_block_delta`：增量累积（text_delta / input_json_delta）
- `content_block_stop`：当前块完成，定稿
- `message_delta`：顶层增量（stop_reason + 累计 usage）
- `message_stop`：消息终止信号，此时可执行工具

MessageAssembler 负责按 Anthropic 流式协议增量累积内容块，在消息终止时才执行工具。

### 1.4 错误处理与故障恢复

循环终止条件类型：
1. **工具调用耗尽**：最后一条消息无工具调用，直接回复
2. **最大轮数限制**：通常 10-30 轮
3. **Token 预算耗尽**：上下文溢出无法继续
4. **显式停止信号**：用户取消、超时、停止标记
5. **目标达成**：高层目标追踪（自驱型）

容错继续策略：工具执行过程中的异常不终止循环，被捕获并记录为错误结果反馈给 LLM。

### 1.5 漂移检测与纠正

**目标漂移 (Goal Drift)** 的四种表现：目标遗忘、目标替代、范围蠕变、方向漂移。

#### 检测方法

**基于关键词的启发式检测**：
- 提取目标关键词，检查最近 N 轮行动的关键词匹配频率
- drift_score = keyword_matches / len(actions)
- 阈值 < 0.3 表示漂移

**语义漂移检测**：
- 对原始目标和最近消息分别计算 embedding
- 余弦相似度 < 0.6 表示可能漂移

**范围蠕变检测**：工具调用总数 > 50 次触发

**局部最优检测**：小窗口内同一工具被调用 > 2 次

#### 纠正策略

1. **强制反思步骤**：每 5 轮插入反思提示，要求评估是否偏离原始目标
2. **检查点恢复**：每 5 轮保存检查点，漂移时回滚到最近正确状态
3. **约束验证**：在每轮推理前验证硬约束（Token 数、时间、工具调用数）
4. **上下文重置**：当其他方法失效时，清空积累上下文，保留关键检查点重新开始
   - 保存：原始目标、已验证进展、学到的约束、失败模式
   - 清空：所有失败尝试、中间推理、无关状态
   - 重载：从检查点恢复 + 注入学到的规则到系统提示

### 1.6 Token 预算与上下文动态管理

#### 预算组成

| 项目 | 分配 |
|------|------|
| 系统提示词 | ~500 |
| 消息历史 | ~50,000 |
| 工具 Schema | ~5,000 |
| 用户输入 | ~2,000 |
| 推理预留 | 100,000 |

#### 三级预算控制体系

| 层级 | 粒度 | 典型阈值 | 超限策略 |
|------|------|---------|---------|
| Per-Request | 单次 API 调用 | 4k-100k output tokens | 截断输出、降级模型 |
| Per-Task | 完整任务（多轮） | 50-200 次调用 / 累计 1M tokens | 强制总结、终止循环 |
| Per-Day/Month | 账期全局 | $50/天、$1000/月 | 排队、降级、拒绝服务 |

#### 压缩策略

- **前向估计**：发送前预估 Token，防止超限
- **自动压缩**：使用到 80% 时触发，保留最重要信息（按重要性评分：recency * 0.5 + content * 0.3 + initial * 0.2）
- **历史片段化**：保留最后 N 条 + 第一条，移除中间消息
- **OpenClaw 70% 触发**：更激进的提前记忆整合
- **摘要压缩**：对长响应进行 LLM 摘要，压缩到原文 50%

---

## 2. 工具层 (Tool Layer)

工具层是智能体与外部世界的桥梁，将文本形式的"意图"转化为真实系统操作。

### 2.1 工具抽象接口设计

#### 设计目标平衡

通用性、类型安全、可观测性、可扩展性、性能、安全性。

#### 泛型 Tool 接口

```python
class Tool(ABC, Generic[InputType, OutputType]):
    async def call(self, input_data: InputType) -> OutputType  # 核心执行
    def name(self) -> str                                       # 工具名称
    def description(self) -> str                                # LLM 理解的描述
    def input_schema(self) -> Dict[str, Any]                    # JSON Schema
    def check_permissions(self, context) -> bool                # 权限检查
    async def get_progress(self) -> Optional[ToolProgress]      # 进度报告
    def supports_streaming(self) -> bool                        # 流式支持
    async def stream_output(self, input_data)                   # 流式输出
```

关键设计：工具描述的质量直接影响 LLM 的工具选择准确率——描述是供 LLM 理解工具能力和使用方式的"自我介绍"。

#### 工具实现模式

- **简单工具**（Bash 执行）：命令白名单、超时保护、错误隔离
- **进度报告工具**（文件复制）：chunk 级进度更新，ToolProgress(step, total_steps, status)
- **流式输出工具**（数据库查询）：async generator 逐行 yield，处理大结果集

### 2.2 工具执行流水线

完整流水线五步：

1. **查找工具**：从注册表获取定义和执行器，找不到立即返回错误
2. **权限检查**：安全层第一道防线，无权限则拒绝
3. **参数验证**：JSON Schema 验证类型和取值范围，拦截 LLM 生成的格式错误
4. **隔离执行**：超时限制内执行，粒度从低到高：异常捕获 -> 进程隔离 -> 容器隔离 -> 系统级沙箱
5. **结果标准化**：统一 `ToolResult`（状态码、输出、错误信息）

### 2.3 工具类型体系

#### 工具注册中心

核心是"名称 -> 定义 + 执行器"的映射。

关键设计决策：
- **定义与执行器分离**：同一工具定义可对应不同环境执行器（测试 mock / 生产真实 API）
- **LLM 友好导出**：`list_for_llm()` 转换为各 LLM API 要求的格式（tool_use / function_calling）

```python
class ToolRegistry:
    tools: Dict[str, Tool]       # 工具实例
    tool_cache: Dict[str, Dict]  # Schema 缓存

    def register(self, tool)           # 注册 + 缓存 Schema
    def get(self, name) -> Tool        # 获取工具
    def list_tools(self) -> List[Dict] # 列出所有 Schema
```

#### 工厂函数 buildTool()

支持动态工具构造和参数化配置。custom 类型仅允许从受信任命名空间加载。

### 2.4 动态发现与加载

#### 工具策略模型 (OpenClaw)

```python
class ToolStrategy(Enum):
    ALLOW = "allow"                       # 允许使用
    DENY = "deny"                         # 禁止使用
    REQUIRE_APPROVAL = "require_approval" # 需要审批

class ToolPolicy:
    policies: Dict[agent_id, Dict[tool_name, ToolStrategy]]
    def can_use_tool(agent_id, tool_name) -> bool
    def requires_approval(agent_id, tool_name) -> bool
```

---

## 3. 记忆子系统 (Memory System)

让智能体跨步骤、跨会话保持上下文，支持学习和改进。

### 3.1 记忆架构设计

#### 分层动机

LLM 上下文窗口有限——即使数十万 Token 也无法装下所有执行历史和领域知识。记忆子系统的核心任务：**在有限的上下文预算内，为当前任务提供最相关的信息**。

#### 三层架构

| 层级 | 生命周期 | 容量 | 延迟 | 实现方式 |
|------|---------|------|------|---------|
| 短期记忆 | 当前会话 | 小 | 极低 | 内存双端队列 |
| 长期记忆 | 跨会话持久化 | 大 | 中等 | 数据库/文件系统 |
| 向量检索层 | 随长期记忆同步 | 大 | 较高 | 向量数据库 |

#### Harness 三层记忆架构

```
当前对话消息 -> [窗口溢出] -> 工作记忆(LLM上下文窗口)
  -> [自动整合] -> 短期记忆(SESSION.md)
    -> [触发条件x3, 定期整合] -> 长期记忆
      -> MEMORY.md(用户档案、学习、决策)
      -> embedding_index(语义检索)
      -> session_logs/(按日期分片)
```

### 3.2 可写入式智能体记忆

#### autoDream 系统：记忆整合管道

**三门触发机制**（满足至少一个即激活）：
1. 时间门槛（24 小时未整合）
2. 会话计数门槛（5 个新会话）
3. 显式触发（用户或系统主动 API 调用）

**四阶段整合管道**：
1. **Orient**：分析会话目标和上下文（LLM 辅助提取核心目标、关键决策、新模式）
2. **Gather**：从对话历史提取结构化事实（用户偏好、任务成果、技术发现、系统约束）
3. **Consolidate**：合并到长期记忆（去重 + 更新 MEMORY.md + 向量索引 + 日志追加）
4. **Prune**：删除过期/低价值信息（6 个月过期、相似度 > 0.95 去重、相关性 < 0.6 过滤）

### 3.3 上下文组装引擎与缓存策略

#### 检索策略

- **时间优先**：最近 N 条记录（"刚才发生了什么"）
- **语义优先**：向量余弦相似度排序（"以前遇到过类似问题吗"）
- **混合检索**：先时间窗口缩候选集，再语义排序（最常用）

#### 统一接口设计

```python
class MemoryManager:
    async def store_step(self, record: StepRecord, importance: float = 0.5)
    async def retrieve(self, query: str = None, recent_only: bool = False, top_k: int = 5)
```

"写入时分层、读取时统一"——运行时引擎只需调 store_step 和 retrieve，分层逻辑封装在内部。

#### 短期记忆缓存

JSONL 格式存储最近 10 个会话摘要，秒级访问。每个摘要含：workflow_id, timestamp, user_input, key_outputs, decisions_made, errors_encountered。

### 3.4 记忆整合与自动化维护

#### 向量索引选型

| 向量库 | 许可证 | 适用规模 | 特点 |
|--------|--------|---------|------|
| Hnswlib | Apache 2.0 | <1M 向量 | 稳定内存索引、C++ 优化 |
| Qdrant | Apache 2.0/商业 | 1M-10M | 高性能 Rust、K8s 部署 |
| pgvector | PostgreSQL 许可 | <5M | HNSW、深度 SQL 集成 |
| Weaviate | BSD-3/商业 | 10M+ | 多模态、GraphQL API |

关键：embedding 维度必须与模型匹配（text-embedding-3-small=1536, text-embedding-3-large=3072, voyage-3-large=1024）。

#### 与 Claude Code 7 层架构的对比

| 维度 | Harness 3 层 | Claude Code 7 层 |
|------|-------------|-----------------|
| 触发精度 | 三门机制 | 七层独立阈值 |
| 压缩策略 | 统一 autoDream | 渐进微压缩 -> 完整压缩 |
| 存储媒介 | 集中式 | 分散式（工具冻结 + 笔记 + 梦想） |
| 成本结构 | 整合时一次性较高 | 前 3 层几乎无成本 |
| 跨会话恢复 | 向量搜索 | 预构建摘要注入，零查询成本 |

---

## 4. 模型集成与输出治理 (Model Integration & Output Governance)

管理与 LLM 的交互，控制和验证模型输出中最不确定的部分。

### 4.1 模型抽象层设计

#### 设计权衡

- **单模型绑定**（Claude Code）：深度集成、版本管理、特性利用，适合最佳性能
- **多模型支持**（OpenClaw）：供应商多元化、成本优化、灰度迁移，适合成熟产品

#### Provider 接口

```python
class ModelProvider(Protocol):
    def complete(self, messages, temperature, max_tokens) -> ProviderResponse
    def stream(self, messages, temperature, max_tokens)  # 流式
    def estimate_tokens(self, text) -> int                # Token 估算
    def validate_config(self) -> bool                     # 配置验证
```

#### 故障转移链路

```
应用请求 -> Primary Model -> [失败/超时/配额] -> Fallback-1
  -> [失败] -> Fallback-2 -> [失败] -> Circuit Breaker(返回错误)
```

**熔断器**：failure_threshold=5, reset_timeout=60s，三态转换：
- Closed（正常）-> 失败达阈值 -> Open（拒绝请求）
- Open -> 超时后 -> Half-Open（允许试探）
- Half-Open -> 成功 -> Closed / 失败 -> Open

#### 模型选择引擎

```python
class ModelSelectionEngine:
    policy: ModelSelectionPolicy  # primary + fallback_chain + cost/latency threshold
    breakers: Dict[model_id, CircuitBreaker]

    def select_model(self) -> ModelProvider  # 按健康状态选择
    def mark_failure(self, model_id)         # 记录故障
    def mark_success(self, model_id)         # 记录成功
```

配置驱动：JSON 配置文件定义 primary、fallback_chain、cost_threshold、latency_threshold。

### 4.2 结构化输出解析与校验

LLM 的输出不可预测——即使要求 JSON 也可能返回 Markdown、多余解释或格式不完整。

#### 四步防御流程

```python
class OutputGovernance:
    async def validate_and_fix(self, llm_output: str) -> ParsedOutput:
        # 1. 尝试 JSON 解析
        # 2. 解析失败 -> LLM 自愈修复（把出错输出发回 LLM 要求修正格式）
        # 3. 语义验证（工具是否存在？参数是否合理？）
        # 4. 安全检查（是否包含危险命令？）
```

### 4.3 输出质量门控与过滤

核心能力：
- **格式校正**：LLM 未返回期望 JSON 格式时尝试修复
- **语义验证**：检查工具调用参数合理性（不存在的工具、明显不合理的参数值）
- **安全检查**：有害内容或违反约束的检测
- **置信度评估**：低置信度触发重试或人工审批

### 4.4 幻觉检测与工具调用验证

关键防御：
- 验证 LLM 是否调用了系统中不存在的工具
- 检查参数值是否在合理范围内（如文件大小不为负数）
- 检测 LLM 是否试图执行危险命令（如 `rm -rf /`）
- 工具调用结果与预期的偏差检测

### 4.5 推理预算与思考过程管理

**推理预算的"三明治"分配 (Reasoning Sandwich)**：
- 规划与验证阶段：高推理预算
- 中间机械执行阶段：低推理预算
- 把思考集中在最需要判断力的环节，而非平均分摊

配套中间件：
- **PreCompletionChecklistMiddleware**：Agent 试图退出时拦截，强制走验证清单
- **LocalContextMiddleware**：启动时绘制目录结构、发现可用工具
- **LoopDetectionMiddleware**：跟踪文件编辑次数，同一文件被反复无效修改时提示重新考虑

---

## 5. 子系统间的协作模式

### 5.1 星型拓扑协作

运行时引擎是唯一协调者，一步执行的协作流程：
1. 记忆 -> 运行时引擎：检索上下文，组装 LLM 输入
2. 运行时引擎 -> LLM：发送上下文，获取推理结果
3. 运行时引擎 -> 工具层：转交工具调用请求，完成验证和隔离执行
4. 工具层 -> 运行时引擎 -> 记忆：结果返回，写入完整步骤记录

### 5.2 重要性评估

运行时引擎为每条记录评估"重要性"，决定是否写入长期记忆。常见信号：
- 工具调用是否失败（失败经验更值得记住）
- 用户是否给出明确反馈
- 当前任务是否是新类型

### 5.3 工程优势

- **可追踪性**：所有数据流经运行时引擎，构建完整执行轨迹
- **可测试性**：每个子系统可独立 mock
- **可替换性**：更换记忆后端不影响工具层实现

---

## See also

- [[Harness_Engineering_Complete_Guide]] - Harness 总体架构和设计原则
- [[Harness_Production_Security]] - 编排引擎、MCP 集成、生产加固、安全体系
- [[Agentic_AI_Complete_Guide]] - 智能体 AI 理论基础
- [[AgentOps_Production_Guide]] - Agent 运维与生产部署
