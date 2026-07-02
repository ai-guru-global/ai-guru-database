---
title: "OpenClaw 内部机制与生产优化深度指南"
category: "15-agent-production-openclaw-ecosystem"
tags: ["openclaw", "internals", "gateway", "agent-loop", "reliability", "security", "plugin", "performance", "troubleshooting", "mcp", "claude"]
summary: "从《OpenClaw 从入门到精通》第三、四部分（Ch9-16）提炼的深度技术指南：涵盖 Gateway 五平面架构与协议机制、Agent Loop 运行内核、可靠性与安全机制、插件扩展体系、生产实战案例、性能与成本优化、故障诊断决策树、Claude/MCP 生态集成。"
source: "yeasy/openclaw_guide (Ch9-16)"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Openclaw Internals"
  - "OpenClaw Internals"
  - OpenClaw_Internals

---
# OpenClaw 内部机制与生产优化

> 本页提炼自《OpenClaw 从入门到精通》第三、四部分（第 9-16 章），聚焦底层原理与生产实战。基础使用与配置详见 [[OpenClaw_Complete_Guide]]。

相关：[[Agentic_AI_Complete_Guide]]、[[Harness_Engineering_Complete_Guide]]、[[OpenClaw_Ecosystem]]、[[OpenClaw_Technical_Deep_Dive]]

---

## 1. Gateway 控制平面与协议机制（Ch9）

### 1.1 五平面架构框架

OpenClaw 的运行时架构可从五个正交平面理解（本书分析框架，非官方术语）：

| 平面 | 职责 | 核心机制 |
|------|------|---------|
| **控制平面**（Control） | 请求编排、重试超时、步骤调度、HITL 门控 | 策略配置、故障决策、权限检查 |
| **数据平面**（Data） | 工具执行、沙箱隔离、连接器、I/O 管理 | 副作用隔离、异步执行、流式传输 |
| **上下文平面**（Context） | 会话状态、记忆机制、压缩总结、制品日志 | 生命周期管理、存储策略 |
| **信任平面**（Trust） | 认证/授权、用户同意、审计日志、策略执行 | 密钥治理、访问控制、问责链 |
| **可观测性平面**（Visibility） | 链路追踪、指标采集、评估量化、调试工具 | 遥测数据、性能分析、根因分析 |

**控制平面**是 Gateway 的"大脑"，负责：
1. 请求入口治理：认证连接、归属校验、路由决策
2. 编排与调度：步骤执行顺序、并发度、重试策略
3. 故障恢复：超时、回退、熔断
4. HITL（人在回路）：高风险操作前暂停等待人工审批
5. 权限与策略检查

控制面拥有执行入口的编排权，但模型调用、工具副作用和节点侧执行仍由 runner/插件/node host 等运行时处理。

### 1.2 WebSocket 握手与认证

Gateway 通过 WebSocket 长连接与远端设备通信。当前 Control UI 握手流程：

1. WebSocket Upgrade 建立传输层
2. Gateway 发出 `connect.challenge` 事件携带 `nonce`
3. 客户端生成/读取设备身份
4. 客户端用 `nonce` 签名后发送 `connect` RPC
5. 控制平面校验 token / allowedOrigins / 设备签名
6. Gateway 响应连接成功（`hello-ok`）
7. 客户端发送业务请求

**关键认知**：WebSocket Upgrade 只是传输层建立，真正认证发生在 challenge 之后的 `connect` RPC。

**五类认证材料协同**：

| 材料 | 生命周期 | 用途 |
|------|---------|------|
| Gateway Token/Password | 可轮换 | 证明控制面访问权 |
| 已签发 `deviceToken` | 已配对设备可复用 | 重连时复用设备信任 |
| `bootstrapToken` | 短生命周期 | 首次配对过渡材料 |
| 设备身份（deviceId + key pair） | 本地长期保存 | 证明"同一设备" |
| Challenge Nonce | 单次握手有效 | 防重放攻击 |

**常见拒绝原因**：`CONTROL_UI_ORIGIN_NOT_ALLOWED`、`CONTROL_UI_DEVICE_IDENTITY_REQUIRED`

**心跳保活**：服务端发送 WebSocket ping + `tick` 广播；客户端按 `hello-ok.policy.tickIntervalMs` 维护活性。空闲超过 `2 * tickIntervalMs` 无活动时，客户端以 `4000 "tick timeout"` 关闭并触发重连。

**重连策略**：指数退避（base=1s, factor=2, max=30s），重连后重新握手并刷新快照。

### 1.3 事件幂等与配对信任

**事件幂等**：Gateway 通过事件序列号（`seq`）和状态版本（`stateVersion`）保证一致性。客户端重连后根据这些标识判断本地视图是否需要重取。

**配对信任建立**：
- 渠道配对（pairing）用于建立可信发送者关系
- 设备配对用于 Control UI / Node 接入
- 两者是独立的信任链路，不应混淆

---

## 2. Agent Loop 运行内核（Ch10）

### 2.1 请求完整生命周期

一条消息从进入到回复的完整流转：

```
用户消息 -> Gateway（权限校验 + 路由）-> Agent（唤起）
  -> Session（提取历史上下文）
  -> 提示词装配 -> 提交模型
  -> 模型决定调用工具 -> 工具执行 -> 结果回注
  -> 模型生成最终回答 -> 写入 Session -> 原路返回用户
```

**三个关键约束点**：
1. **权限约束点**：Gateway 验证身份与配对检查
2. **预算容错点**：超时与重试控制
3. **故障降级点**：无额度时回退到备选模型

### 2.2 四层排障模型

| 层级 | 核心职责 | 典型故障 |
|------|---------|---------|
| 入口层（Channels） | 协议适配、事件统一 | 日志无流入记录、连接断开 |
| 控制层（Gateway） | 鉴权、路由、排队 | 请求被秒拒（Unauthorized） |
| 执行层（Agent/Session） | 记忆拼接、推理、重试 | 推理超时、回答脱离上下文 |
| 能力层（Tool/Model） | 外部执行、模型补全 | 429 限流、工具调用失败 |

**快速定位**：
- "间歇性回答缓慢且越来越离谱" -> 执行/能力层（上下文过长、模型降级）
- "发消息完全没反应" -> 入口/控制层（鉴权失败、路由错误）

### 2.3 Pi 运行底座

OpenClaw 通过嵌入式集成 Pi 运行底座，将极简执行骨架转化为企业级智能体运行时。Pi 提供：
- Agent 循环的执行引擎
- 工具调用的调度与隔离
- 流式输出的管道管理

### 2.4 提示词装配与注入防护

**四层装配结构**（分层注入，非字符串拼接）：

| 层级 | 内容 | 角色 |
|------|------|------|
| 系统约束层 | 核心规则、禁止操作、角色设定 | `system` |
| 工具描述层 | 经策略过滤的工具 schema | 自动注入 |
| 上下文环境层 | 会话历史 + 记忆 + 工具回执 | 动态信息 |
| 用户输入层 | 外部任务描述和附带数据 | **不可信，须隔离** |

**Token 预算裁剪策略**：
1. 预估总量
2. 按优先级标定梯队：
   - 梯队 0（不可删减）：系统约束层
   - 梯队 1（压缩后保留）：会话历史摘要、工具结构化回执
   - 梯队 2（优先丢弃）：工具原始大段输出、低相关性检索文本
3. 从梯队 2 开始逐级淘汰

**注入防御双保险**：
1. **结构化隔离**：外部不可信内容用 `EXTERNAL_UNTRUSTED_CONTENT` 标签包裹 + 安全声明
2. **工具策略兜底**：即使模型被"误导"，`tools.deny` 和沙箱在执行层物理拦截

### 2.5 工具执行与结果回注

**工具执行链路**：模型输出工具调用意图 -> 策略校验（allow/deny）-> 执行 -> 结果回注

**三段式回注原则**：
1. **结论摘要**：关键结论（可直接用于回复）
2. **证据引用**：关键字段、时间戳、来源标识
3. **原始输出**：仅在需要时保留，避免上下文爆炸

**链式编排的工程原则**：
- 中间态持久化：每步结构化输出写入会话
- 失败隔离：工具 A 失败不丢弃已收集的上下文
- 状态传递：跨步骤共享状态（如浏览器登录态）需在工具契约中明确

### 2.6 流式输出、重试与提前终止

- 流式输出与持久化交错推进，不是"全部完成后一次性返回"
- 重试必须有预算（次数与总耗时上限）
- 支持提前终止长运行任务

---

## 3. 可靠性与安全机制（Ch11）

### 3.1 多密钥治理：认证档案体系

**认证对象模型四层**：

| 层 | 文件/配置 | 职责 |
|----|---------|------|
| 长期认证材料 | `auth-profiles.json` | 定义可用认证档案集合 |
| 默认选择策略 | `auth.order` | 定义 profile 优先尝试顺序 |
| 会话覆盖 | session-level auth override | 临时固定某个 profile |
| 运行状态 | `auth-state.json` | 记录冷却、禁用、路由选择 |

**密钥隔离策略**：
- 按环境切分（开发/预发/生产）
- 按智能体切分（高风险写操作 vs 低风险只读）
- 按供应商/计费域切分

**正常生命周期**：生成 -> 注入 -> 保留旧 key -> 探针验证 -> 灰度调整 -> 观察 -> 吊销旧 key -> 审计记录

**关键原则**：先新增、再验证、后切换、最后吊销。反过来会引入脏窗口。

### 3.2 冷却与禁用机制

**Auth-profile 冷却梯度**：

| 错误类型 | 冷却策略 |
|---------|---------|
| 限流/过载 | 30s -> 60s -> 5min（上限） |
| Billing（402） | 5h 起步，每次翻倍，上限 24h |

**运行时状态**保存在 `auth-state.json`，与 `auth-profiles.json` 分离。

**聚合型供应商旁路**：OpenRouter 等聚合供应商默认跳过 auth 冷却检查（它们自身有内部轮转）。

### 3.3 模型回退链路与错误分流

**回退决策逻辑**：

```
primary: openai/gpt-5.4
  |-- 成功 -> 正常返回
  |-- 限流/失败 -> fallback 1: anthropic/claude-sonnet-4-6
                    |-- 成功 -> 正常返回
                    |-- 失败 -> fallback 2: 本地/其他模型
                                  |-- 全部耗尽 -> 降级响应 + 告警
```

**关键回退行为**：
- **上下文溢出不触发回退**：`request_too_large` / `context_window_exceeded` 直接抛错，应触发压缩而非换模型
- **冷却期探针**：冷却到期前进行受限探针，实现类似断路器"半开"状态的渐进恢复
- **计费错误指数退避**：`baseMs * 2^(min(disableCount-1, 10))`，上限 24h
- **错误原因归因**：`auth_permanent > auth > billing > format > overloaded > timeout > rate_limit > ...`

**两层机制关系**：auth profile 冷却优先在同一 provider 内轮换 profile；模型 fallback 才是跨模型切换。同 provider 的 `overloadedProfileRotations` / `rateLimitedProfileRotations` 预算耗尽后才进入模型级 fallback。

### 3.4 防护栏：工具策略、沙箱、审批与审计

**纵深防御体系**：
1. 结构化隔离（提示词层，概率性防御）
2. 工具策略 `tools.deny`（确定性物理兜底）
3. 沙箱隔离（`agents.defaults.sandbox`）
4. HITL 审批门控
5. 审计日志

**沙箱关键配置**：
- `sandbox.mode`：`all` 表示所有工具执行都进沙箱
- `sandbox.scope`：`agent` / `session` / `shared`
- 沙箱默认不是"每个工具调用一个容器"

---

## 4. 插件扩展架构（Ch12）

### 4.1 原生插件体系

**插件本质**：运行在 Gateway 进程内的 TypeScript/JavaScript 扩展模块，通过 `openclaw.plugin.json` 清单文件声明元数据。

**插件加载生命周期**：

```
发现候选插件 -> 读取 Manifest / Schema 校验 -> 加载入口
  -> register(api) 注册工具/钩子/渠道
  -> 构建 PluginRegistry -> 初始化 Hook Runner -> 运行期调度
```

**配置与启用**：

```jsonc
{
  plugins: {
    enabled: true,
    allow: ["my-plugin"],          // 白名单
    deny: ["untrusted-plugin"],    // 黑名单（deny 优先）
    entries: {
      "my-plugin": { enabled: true, config: { /* ... */ } }
    }
  }
}
```

**安全灰度上线流程**（以 Jira 插件为例）：
1. 阶段一：白名单准入 + 仅允许查询工具
2. 阶段二：`toolsBySender` 小范围放开写入
3. 阶段三：验证后全量放开，保留审计

### 4.2 Hook 系统

**五种执行模式**：

| 模式 | 行为 | 典型钩子 |
|------|------|---------|
| 观测型（Void） | 并行执行，不改状态 | `llm_input`、`message_sent` |
| 修改型（Modifying） | 按优先级顺序执行 | `before_tool_call`、`before_prompt_build` |
| claim 型 | 首个 `handled: true` 获胜短路 | `inbound_claim`、`before_agent_reply` |
| 顺序型 | 链式执行，子智能体路由专用 | `subagent_spawning` |
| 同步型 | 热路径同步执行 | `tool_result_persist`、`before_message_write` |

**核心钩子分类**：

- **智能体生命周期**：`before_model_resolve`、`agent_turn_prepare`、`before_prompt_build`、`before_agent_reply`、`llm_input`、`llm_output`
- **消息处理**：`message_received`、`inbound_claim`、`message_sending`、`message_sent`
- **工具调用**：`before_tool_call`、`after_tool_call`、`tool_result_persist`
- **网关生命周期**：`gateway_start`、`gateway_stop`

### 4.3 自定义工具

自定义工具通过插件 `api.registerTool()` 注册。工具必须有明确的：
- **输入契约**：参数结构、必填项、合法值范围
- **输出契约**：结构化字段、关键结论
- **失败语义**：可重试 vs 致命错误
- **副作用声明**：是否写入外部系统、回滚路径

### 4.4 框架互操作

OpenClaw 可发现并安装兼容的 Codex、Claude、Cursor bundle。映射是"尽力兼容"而非"逐字段等价"：
- 技能文件（`SKILL.md`）最容易映射
- 涉及特定框架 API 或运行时命令模型的部分可能只被部分加载

**插件诊断命令集**：

```bash
openclaw plugins list
openclaw plugins inspect my-plugin
openclaw plugins inspect my-plugin --runtime --json
openclaw plugins doctor
openclaw gateway status --deep --require-rpc
```

---

## 5. 生产实战案例（Ch13）

### 5.1 企业飞书群工作助手

**架构要点**：
- 飞书群绑定到特定 Agent（通过 bindings）
- 使用 `lightContext` 心跳监控工作项
- Cron 定时生成日报/周报
- 工具策略按群组收敛：外部群仅允许查询，内部群允许受限写入

**关键配置模式**：
- 入口层：飞书渠道 + pairing 策略 + 群组 allowlist
- 路由层：按群 peer ID 绑定到工作助手 Agent
- 工具层：按 `toolsBySender` 对管理员放开高风险工具
- 数据层：API Key 走 SecretRef，日志脱敏

### 5.2 客户支持智能体

**架构要点**：
- 多渠道入口（WhatsApp 外部客服 + Telegram 内部运维）
- 多账号隔离（support 账号 vs ops 账号）
- 子智能体分工：入口助手理解意图，子智能体执行专长任务
- Fallback 链路保证高可用

**成本优化**：
- 简单问题（80%）用低延迟模型
- 复杂问题（15%）用均衡模型
- 高难问题（5%）用强推理模型

### 5.3 垂直行业应用

不同行业的关键差异：

| 行业 | 核心关注 | 特殊要求 |
|------|---------|---------|
| 金融 | 审计合规 | 完整决策日志、人工审批门控 |
| 医疗 | 数据安全 | 严格沙箱、最小权限 |
| 电商 | 高并发 | 低延迟模型、成本控制 |
| 运维 | 工具权限 | 分层工具策略、爆炸半径控制 |

---

## 6. 性能与成本优化（Ch14）

### 6.1 Token 成本优化

**Token 消耗三阶段**：输入 Token（系统提示 + 上下文 + 用户消息）-> 输出 Token -> 写入下一轮历史（成本加速效应：第 10 轮输入往往是第 1 轮的 5-10 倍）。

**六大优化手段**：

| 优化项 | 方法 | 预期收益 |
|--------|------|---------|
| 系统提示精简 | 2000 字 -> 25 字 | 49 万 Token/月（千轮场景） |
| 工具定义差异化 | 按 Agent 分配工具，不是全部挂载 | 减少每轮工具定义开销 |
| 上下文预算控制 | `contextTokens: 10000` + `contextPruning` | 15K -> 8K Token |
| 输出长度限制 | 按模型设 `maxTokens` | 减少不必要输出 |
| 结构化输出 | JSON 替代自由文本 | 150 Token -> 30 Token |
| 模型分层选择 | Haiku/Sonnet/Opus 按比例 | 平均成本降 50-70% |

**成本优化检查清单**：
1. 系统提示 < 100 字？
2. 工具列表 < 5 个/Agent？
3. 上下文预算 < 10K Token？
4. 消息历史 < 20 条？
5. 输出限制已配置？
6. 模型选择有分层？

### 6.2 上下文压缩策略

**Compaction（消息合并）**：

```jsonc
{
  agents: {
    defaults: {
      compaction: {
        mode: "safeguard",
        keepRecentTokens: 5000,
        model: "<provider/low-cost-model>",
        truncateAfterCompaction: true
      }
    }
  }
}
```

**Pruning（优先级裁剪）**：保留最近 5 条、保留重要标签消息、删除 7 天前调试日志。

### 6.3 延迟与吞吐优化

- 启用流式输出减少首字延迟
- 合理配置超时（复杂查询需更长 `timeoutSeconds`）
- 使用就近 API 端点减少网络延迟
- 对高并发场景使用低延迟模型

### 6.4 用量观测与预算控制

```bash
/status                           # 当前会话 Token/缓存/成本摘要
/usage cost                       # 会话成本摘要
openclaw gateway usage-cost       # transcript-backed CLI 成本摘要
openclaw status --usage           # provider 侧配额/窗口快照
```

### 6.5 不同规模部署预算模板

| 规模 | 月预算参考 | 策略重点 |
|------|----------|---------|
| 个人/开发 | $10-50 | 低成本模型为主，严格上下文裁剪 |
| 小团队 | $50-200 | 模型分层 + 定时任务合并 |
| 中型部署 | $200-1000 | 多供应商 Fallback + 精细预算告警 |

---

## 7. 故障诊断决策树（Ch15）

### 7.1 六层诊断框架

**核心原则**：前一层没通过，不要跳到后一层。

```
启动层 -> 消息入口层 -> 模型调用层 -> 工具执行层 -> 会话与记忆层 -> 性能层
```

| 层级 | 优先证据 | 排除假设 |
|------|---------|---------|
| 启动层 | `openclaw doctor` + 启动日志 | 进程没起来、配置损坏、依赖缺失 |
| 消息入口层 | `channels status --probe` + 渠道日志 | 消息未进入 Gateway、门控未命中 |
| 模型调用层 | `models status / --probe` | 凭据过期、配额耗尽、供应商故障 |
| 工具执行层 | 结构化日志 + 工具报错 | 工具被拒绝、参数不合法、下游异常 |
| 会话与记忆层 | 会话日志 + 压缩/记忆痕迹 | 串话、上下文丢失、记忆污染 |
| 性能层 | 延迟、资源、队列指标 | CPU/内存/IO 瓶颈或级联退化 |

### 7.2 启动层决策树

关键分支：
- 进程启动失败 -> 检查错误日志 -> 端口占用/配置错误/权限不足/缺少依赖
- 无错误日志 -> `openclaw doctor` -> 系统资源 -> 环境变量 -> debug 模式

### 7.3 模型调用层决策树

按错误类型分流：
- **401/403**：密钥有效？-> `models status --probe` -> 环境变量已设？-> 权限范围
- **429**：查看速率限制日志 -> 账户级 vs IP 级 -> 申请提升或分散
- **500/502/503**：检查供应商状态页 -> 等待恢复 / 配置 fallback
- **Timeout**：超时值合理？-> API 慢 vs 网络慢 -> 流式输出 / 就近端点

### 7.4 跨层故障判断

当沿当前树走不通时，回到总框架判断是否跨层：
- 能证明"消息没进入系统" -> 留在入口层
- 能证明"消息进了但模型没回" -> 切到模型层
- 能证明"模型回了但动作不对" -> 切到工具层或会话层
- 能证明"功能没坏只是变慢" -> 切到性能层

### 7.5 高并发故障诊断

高并发场景特有问题：
- 队列堆积 -> 检查 `messages.queue` 配置
- 并发工具冲突 -> 检查沙箱 scope 和防重入
- 内存飙升 -> 检查会话文件膨胀和 GC 压力

---

## 8. Claude/MCP 生态集成（Ch16）

### 8.1 Claude 模型家族

| 系列 | 定位 | 上下文 | 关键特性 |
|------|------|--------|---------|
| Haiku 4.5 | 低延迟低成本 | 200K | Extended Thinking（非 Adaptive） |
| Sonnet 4.6 | 均衡性价比 | 1M（需 `params.context1m: true`） | 默认 adaptive thinking |
| Opus 4.6 | 强推理 | 1M | Adaptive thinking |
| Opus 4.7 | 前代强推理 | 1M 默认 | 新 tokenizer（1.0-1.35x tokens） |
| Opus 4.8 | 最强 Opus 档 | 1M | 默认 `effort=high` |
| Fable 5 | 新一代旗舰 | 1M/128K 输出 | Adaptive Thinking 常开 |

**Claude 特有能力**：
- **扩展上下文窗口**：Sonnet 4.6 / Opus 4.6 属 1M context window，OpenClaw 需 `params.context1m: true` 显式请求
- **自适应思考**：Claude 4.6 系列未显式指定 thinking level 时默认走 adaptive thinking
- **工具调用对齐**：Claude 以结构化 JSON 返回工具调用请求，与 OpenClaw 工具系统天然兼容

### 8.2 MCP 服务器集成

MCP（Model Context Protocol）是 Anthropic 主导的开放协议，标准化 AI 模型与外部数据源/工具的通信。

**接入方式**：

| 方式 | 通信 | 适用场景 |
|------|------|---------|
| stdio | 标准输入/输出 | 本地 MCP 服务器（文件系统、Git） |
| Streamable HTTP | HTTP 请求/响应+流式 | 新远程 MCP 服务 |
| SSE（旧兼容） | Server-Sent Events | 兼容旧版远程 MCP |

**配置示例**：

```jsonc
{
  mcp: {
    servers: {
      github: {
        command: "docker",
        args: ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",
               "ghcr.io/github/github-mcp-server"],
        env: { GITHUB_PERSONAL_ACCESS_TOKEN: "${GITHUB_PAT}" }
      },
      "custom-api": {
        url: "https://api-gateway.internal/mcp",
        transport: "streamable-http",
        headers: { Authorization: "Bearer ${CUSTOM_API_TOKEN}" }
      }
    }
  }
}
```

**MCP 工具 vs 内置工具**：
- **内置工具**：Agent Runtime 直接执行，受 Tool Policy + 沙箱约束，延迟最低
- **MCP 工具**：通过协议与外部进程通信，适合接入第三方服务
- 两者可在同一智能体中共存，模型同时看到两套工具列表

### 8.3 多供应商混合部署

| 策略 | 主模型 | Fallback | 场景 |
|------|--------|----------|------|
| Claude 主力 | `anthropic/claude-sonnet-4-6` | `openai/gpt-5.5` | 重视推理质量 |
| 成本优先 | 低延迟模型 | `anthropic/claude-sonnet-4-6` | 高并发低成本 |
| 跨供应商冗余 | `anthropic/claude-sonnet-4-6` | `anthropic-vertex/claude-sonnet-4-6` | 同模型跨区容灾 |

### 8.4 OpenAI 与本地模型集成

**OpenAI 集成**：使用 `openai/*` 模型标识，ChatGPT/Codex 订阅 OAuth 通过 auth profile 表达，历史 `openai-codex/*` 应通过 `openclaw doctor --fix` 迁移。

**本地 Ollama**：

```jsonc
{
  models: {
    providers: {
      ollama: {
        baseUrl: "http://localhost:11434",  // 注意：不要用 /v1 路径！
        apiKey: "ollama-local",
        api: "ollama",
        models: [{ id: "mistral", name: "Mistral", input: ["text"],
                   cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                   contextWindow: 8192, maxTokens: 8192 }]
      }
    }
  }
}
```

---

## 速查：诊断命令参考

```bash
# 系统级
openclaw doctor                     # 完整诊断
openclaw doctor --repair            # 引导式修复
openclaw status --deep              # 全局状态 + 渠道 live probe
openclaw health --json              # 进程健康快照

# 渠道
openclaw channels status --probe    # 渠道运行状态
openclaw channels capabilities      # 渠道能力与权限

# 模型
openclaw models status              # 认证状态
openclaw models status --probe      # live provider 探针
openclaw models list                # 可用模型列表

# 日志
openclaw logs --follow --json       # 实时结构化日志
openclaw logs --json --limit 500    # 有界快照

# 安全
openclaw security audit --deep      # 安全审计（含 live probes）
openclaw secrets audit              # 凭据审计

# 插件
openclaw plugins list               # 插件列表
openclaw plugins doctor             # 插件诊断
openclaw plugins inspect <id> --runtime --json  # 运行时检查
```
