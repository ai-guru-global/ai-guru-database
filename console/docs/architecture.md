# 架构设计文档

> 本文档描述 AI News Database的整体架构：内容库的组织模型、Go CLI 工具的分层设计、关键技术决策及其权衡。面向希望深入理解或参与开发的贡献者。

## 1. 系统总览

项目采用「内容库为主干、工具为辅助」的双层架构：

```
ai-news-database/
├── <主题文件夹>/          ← 内容层：静态 Markdown 知识库（Git 即数据库）
│   ├── _index.md          ← 主题索引
│   └── <线索>.md          ← 时间线文档
├── _topics.md             ← 中心主题索引
├── _2026大事记.md          ← 年度重点事件
└── tools/cmd/             ← 工具层：自包含 Go module
    ├── cmd/               ← CLI 命令（cobra）
    ├── internal/          ← 业务模块（19 个包）
    ├── web/               ← 本地 Web 控制台（静态页面）
    └── browser-extension/ ← Chrome 扩展（Manifest V3）
```

**核心原则**：

1. **本地优先（Local-first）**：所有数据存储在用户设备（`~/.ai-news-database/`），零遥测，可完全离线阅读
2. **内容即代码（Content as Code）**：内容库用 Git 管理，Markdown 纯文本可被任何编辑器/工具消费，无平台锁定
3. **工具不改变内容本质**：CLI 只负责采集、增强、检索，最终沉淀到内容库的线索由人工整理保证质量

## 2. 内容层架构

### 2.1 信息模型

内容库的信息模型为三级结构：**主题（Topic）→ 线索（Thread）→ 时间线条目（Entry）**。

| 层级 | 载体 | 粒度 | 示例 |
|---|---|---|---|
| 主题 | 文件夹 + `_index.md` | AI 领域的一个稳定分支 | `智能体平台/` |
| 线索 | `<线索>.md` | 值得长期跟踪的产品/技术/公司 | `智能体平台/OpenAI-Agents.md` |
| 条目 | 时间线中的一行 | 一条具体新闻事件 | `- 01-15 · 标题 · URL · 摘要` |

设计要点：

- **时间线倒序**（最新在上），按 `### YYYY-MM` 分组，符合新闻消费习惯
- **事实与观点严格分离**：「概述」段只写可验证事实，「分析」段才允许观点，两者不得混写
- **双链** `[[主题/线索名]]` 表达线索间关联，形成知识图谱雏形
- **专有名词保留英文**（Claude / GPT / Sora），避免翻译歧义

### 2.2 为什么不用数据库存内容？

| 考量 | Markdown + Git | SQLite/服务端数据库 |
|---|---|---|
| 可移植性 | 任意编辑器可读写 | 需专用工具 |
| 版本历史 | Git 天然提供 diff/blame | 需自建审计 |
| 协作评审 | PR 流程即内容评审 | 需自建权限系统 |
| 全文检索 | 依赖 grep/编辑器 | 强（FTS5） |

结论：**内容沉淀用 Markdown，采集缓冲用 SQLite**——工具层数据库中的文章是"原材料"，人工筛选后进入内容库成为"成品"。两层各取所长。

## 3. 工具层架构

### 3.1 分层与依赖方向

```
┌────────────────────────────────────────────┐
│ cmd/（31 个命令：sync/enrich/curate/ask/…） │  CLI 表现层
├────────────────────────────────────────────┤
│ internal/tui  internal/i18n                │  交互与呈现
├────────────────────────────────────────────┤
│ curator  enricher  rag  deep_research      │  业务编排层
│ dedup    subscription                      │
├────────────────────────────────────────────┤
│ crawler  official  search  llm             │  外部能力适配层
├────────────────────────────────────────────┤
│ db（SQLite+FTS5） storage  config  logger  │  基础设施层
└────────────────────────────────────────────┘
```

依赖方向严格自上而下；下层不得引用上层。跨层协作通过接口注入（`NewWithDeps` 模式），使业务编排层可在测试中用 `internal/mocks` 替换外部依赖。

### 3.2 关键模块设计

#### db：存储与全文检索

- 单表 `articles` 承载文章全生命周期，`read_status` 五态流转：`unread → read / starred / archived / discarded`
- **FTS5 独立索引表** `articles_fts`：由 Go 写入路径同步（`SaveArticle` / `UpdateEnrichment` / `DeleteArticlesByStatus` 内联调用 `reindexArticle`），而非触发器同步
- **中文分词方案**（`fts.go`）：写入前对汉字做单字切分（每字两侧插空格），查询时将中文关键词转为 FTS5 短语查询（`"人 工 智 能"`，短语要求 token 相邻 ≈ 子串匹配）。该方案零外部依赖，召回率优先；若未来需要更高精度可替换为 jieba 类分词器，只需改动 `segmentCJK` 一处
- 迁移策略：`migrate()` 幂等执行；`migrateFTS()` 检测到旧版外部内容表（`content='articles'`）时自动删除触发器并全量重建索引

#### crawler / official：采集器工厂

- `crawler.Factory` 按源类型（HN / Reddit / V2EX / Generic / JinaReader）返回采集器实现，新增源只需实现 `Crawler` 接口并注册
- `official.Registry` 维护 8 个内置官方源的元信息与别名；root 命令的未知子命令会尝试解析为官方源别名（`ai-news-database hn` ≈ `ai-news-database sync hn`）
- `DEMO_MODE` 环境变量提供无网络演示数据，用于 CI 与录屏

#### llm：统一 LLM 客户端

- 兼容 OpenAI Chat Completions 协议，同时支持 Ollama 本地推理（零数据外传）
- 内置指数退避重试；所有调用要求传入 `context.Context` 以支持取消
- API Key 以 AES-256-GCM 加密存储，密钥从机器特征（hostname+username+OS）派生——密文即使被拷走也无法在他机解密（迁移注意事项见 `SECURITY.md`）

#### deep_research：深度研究引擎

按职责拆分为 7 个文件：

| 文件 | 职责 |
|---|---|
| `researcher.go` | 引擎入口、阶段编排、缓存键 |
| `model.go` | 全部数据结构与默认配置 |
| `phases.go` | 规划 → 检索 → 取证 → 分析 → 综合 五阶段实现 |
| `websearch.go` | 本地/Web 检索（带重试）、域名可信度评分 |
| `report.go` | Markdown / 详细版 / JSON 三种报告渲染 |
| `cache.go` | TTL 缓存、滑动窗口限流、指标计数 |
| `jsonutil.go` | 容错的 LLM JSON 输出提取 |

设计特点：每个研究阶段记录 `PhaseTrace`（起止时间/条目数/错误），失败阶段不中断整体流程而是降级；证据（Evidence）与来源（Source）通过 ID 关联，报告可溯源。

#### rag：本地问答

`ask` 命令的实现：FTS 检索 top-N 相关文章 → 组装上下文（含标题与来源）→ LLM 生成回答并附引用编号。上下文长度受控，避免超出模型窗口。

### 3.3 Web 控制台与浏览器扩展

- `web` 命令启动本地 HTTP 服务（默认 8080）：静态页面（dashboard / inspire）+ JSON API（`/api/stats`、`/api/sync`、`/api/ask` 等），API 与 CLI 复用同一套 internal 模块，无重复业务逻辑
- 浏览器扩展通过扩展 API 服务（8081）把网页元数据写入本地库；`host_permissions` 收窄至 8080/8081 两个固定端口

## 4. 质量与工程保障

| 手段 | 配置 | 说明 |
|---|---|---|
| 单元测试 | `go test -race`，覆盖率门禁 60% | 核心模块（db/llm/rag/crawler/curator）优先覆盖 |
| e2e 测试 | `e2e_test.go` | 构建真实二进制，子进程驱动命令链路，HOME 隔离 |
| Lint | `.golangci.yml`（14 linters） | 含 gosec 安全扫描 |
| CI | GitHub Actions 七道关卡 | format / build / 三平台测试 / lint / security / coverage / vet |
| 发布 | tag 触发 | 5 平台交叉编译 + checksum |
| 提交前 | pre-commit | go-fmt / go-vet / golangci-lint / misspell |

## 5. 性能与可用性设计

- **无 CGO**：`modernc.org/sqlite` 纯 Go 实现，交叉编译零门槛，二进制单文件分发
- **索引策略**：`read_status` / `source_alias` / `fetched_at` 三个 B-tree 索引覆盖高频查询；FTS 仅索引标题+摘要（不含 `raw_content`），控制索引体积
- **降级路径**：FTS 查询失败或无结果时可回退 `SearchByKeyword`（LIKE）；LLM 不可用时采集/阅读功能完全可用（增强类功能优雅降级）
- **限流与缓存**：deep_research 内置滑动窗口限流（10 req/min）与 30 分钟结果缓存，避免打爆外部搜索与 LLM 配额

## 6. 已知取舍与演进方向

| 取舍 | 现状 | 演进方向 |
|---|---|---|
| 中文分词 | 单字切分（召回优先） | 可插拔分词器（jieba/词典） |
| 语义检索 | 仅 FTS 关键词 | 向量索引 + 混合检索 |
| 同步调度 | 手动 `sync` | 内置定时调度器 / launchd 模板 |
| 数据导入 | 手动 add | OPML / RSS 批量导入 |
| 协作 | 单机 | 端到端加密同步（远期） |

## 7. 相关文档

- 内容规范与模板：[docs/线索模板.md](线索模板.md)、[CONTRIBUTING.md](../CONTRIBUTING.md)
- 最佳实践：[docs/best-practices.md](best-practices.md)
- 使用示例：[docs/examples.md](examples.md)
- 商业规划：[docs/business.md](business.md)
