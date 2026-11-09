# AI News Database 项目全面评估与改进报告

> 评估日期: 2026-05-18
> 评估人: Hermes Agent
> 项目路径: /Users/allengaller/Documents/GitHub/standup-coder/ai-news-database

---

## 一、项目概览

| 项目 | 详情 |
|------|------|
| 项目名称 | AI News Database — 程序员个人信息终端 |
| 定位 | 本地优先 (Local-First) 的技术资讯 CLI 工具 |
| 语言 | Go 1.25+ |
| 代码规模 | 8,120 行 Go 代码 (59 源文件 + 16 测试文件) |
| Git 历史 | 4 次提交 (早期阶段) |
| 许可证 | MIT |
| 核心理念 | "你的数据永远属于你" |

---

## 二、技术架构评估 (评分: 8/10)

架构分层清晰，遵循标准 Go 项目布局:

```
cmd/         → CLI 命令层 (Cobra)
internal/
  crawler/   → 采集层 (HN/Reddit/V2EX/Generic/JinaReader)
  db/        → 存储层 (SQLite + FTS5)
  enricher/  → LLM 增强层
  curator/   → 智能策展
  rag/       → RAG 问答
  tui/       → TUI 交互 (Bubble Tea)
  llm/       → LLM 统一客户端
  search/    → 全文搜索
```

**优点:**
- 模块职责单一，依赖方向清晰
- 依赖注入模式 (NewWithDeps) 便于测试
- 数据库迁移机制支持旧版本升级
- FTS5 虚拟表 + 触发器自动同步索引
- 采集器工厂模式，易扩展新源

**不足:**
- cmd/web.go (677行) 过大，应拆分为独立 handler ✅ 已修复
- cmd/burst.go (417行) 同样偏大
- 没有统一的错误处理中间件
- 缺少 HTTP 请求的重试/限流机制 ✅ 已修复

---

## 三、功能完整度 (评分: 7.5/10)

### 已实现 (Phase 0 范围)

- [x] 8 个官方源采集 (HN/Reddit/V2EX/Lobsters/GitHub/Ruanyf/Coolshell/InfoQ)
- [x] LLM 内容增强 (摘要/标签/质量评分)
- [x] 智能策展推荐
- [x] TUI 收件箱 (Bubble Tea)
- [x] RAG 知识库问答
- [x] 全文搜索 (FTS5)
- [x] 阅读状态五态流
- [x] Markdown 导出
- [x] 一键安装脚本
- [x] 浏览器插件 MVP (Chrome MV3)
- [x] Web Dashboard (静态页面)

### 待完善

- [ ] 自定义源配置可视化
- [ ] 自动同步调度器
- [ ] 向量搜索 (当前仅 FTS + LIKE fallback)
- [ ] 离线阅读模式
- [ ] 数据导入 (OPML 等)

---

## 四、代码质量 (评分: 7/10 → 8/10 改进后)

**优点:**
- 中文注释清晰，命名规范
- Go 惯用法基本到位 (error wrapping, defer close)
- 空值处理使用 sql.Null* 类型
- 配置支持 OpenAI 兼容接口 + Ollama

**原始问题 (已修复):**
- ~~SQL 注入风险~~ ✅ 已修复为参数化查询
- ~~API Key 明文存储~~ ✅ 已修复为 AES-256-GCM 加密
- ~~部分错误被静默忽略~~ ✅ 已修复为结构化日志
- ~~缺少 context.Context 传递~~ ✅ 已修复
- ~~没有结构化日志~~ ✅ 已集成 slog

---

## 五、测试覆盖 (评分: 7.5/10 → 8.5/10 改进后)

### 原始测试

- 测试文件: 16 个 `_test.go` 文件
- 测试结果: 全部 18 个包通过 (含 race detector)

### 新增集成测试

新增 `internal/integration/integration_test.go`，包含 7 个端到端测试:

| 测试 | 覆盖范围 |
|------|---------|
| TestIntegration_SaveSearchCleanup | 保存→搜索→状态→笔记→标签→统计→URL去重 |
| TestIntegration_CuratorPipeline | 策展评分排序 |
| TestIntegration_DedupPipeline | 语义去重管道 |
| TestIntegration_SearchEngine | DuckDuckGo 搜索引擎 |
| TestIntegration_RAGWithMock | RAG 问答 + Mock LLM |
| TestIntegration_EnricherWithMock | LLM 增强 + Mock |
| TestIntegration_ConfigCrypto | 配置加密往返验证 |

---

## 六、工程基础设施 (评分: 8/10)

**CI/CD:**
- GitHub Actions 多平台 (Ubuntu/macOS/Windows)
- Go 1.25 + 1.26 双版本矩阵
- golangci-lint 集成
- Release 自动构建 (5 平台交叉编译)

**文档体系:**
- README.md (1031行) 非常详尽
- BUSINESS.md 商业战略规划完整
- PROMOTION.md 推广方案
- CONTRIBUTING.md / CHANGELOG.md / SECURITY.md / CODE_OF_CONDUCT.md

**安装:**
- 一键 curl|bash 安装脚本
- go install 支持
- Makefile 完整 (build/test/lint/release)

---

## 七、商业模式评估 (评分: 6.5/10)

BUSINESS.md 规划了完整的 4 阶段路线图:

| 阶段 | 目标 | 时间线 |
|------|------|--------|
| Phase 0 | 工具验证期 | 当前 |
| Phase 1 | 个人效率平台 | v1.0-v1.5 |
| Phase 2 | 团队协作 | v2.0-v2.5 |
| Phase 3 | 生态平台 | v3.0+ |

定价策略: Free → Pro ($6/月) → Team ($8/人/月) → Enterprise (按需)

**风险:**
- 3 年 $220K 收入预测偏乐观
- CLI 工具 → 付费转化路径较长
- 开源分叉风险需要社区运营能力
- 当前仅 4 次 commit，社区基础薄弱

---

## 八、依赖管理 (评分: 8/10)

核心依赖选型优秀:
- `modernc.org/sqlite` — 纯 Go SQLite，无 CGO 依赖 (交叉编译友好)
- `spf13/cobra` — 行业标准 CLI 框架
- `charmbracelet/bubbletea` — 最佳 TUI 框架
- `PuerkitoBio/goquery` — HTML 解析
- `fatih/color` — 终端着色

依赖数量: 7 直接 + 28 间接

---

## 九、安全评估

### 已修复

| 问题 | 状态 | 修复方式 |
|------|------|---------|
| SQL 注入 (DeleteArticlesByStatus) | ✅ 已修复 | 参数化查询 + time 计算 |
| API Key 明文存储 | ✅ 已修复 | AES-256-GCM 加密，密钥绑定机器特征 |
| 配置文件权限过宽 | ✅ 已修复 | 0644 → 0600 |

### 待关注

- 浏览器插件 host_permissions 过宽 (localhost:*)
- 向量搜索引入后需评估 embedding 数据存储安全

---

## 十、综合评分

| 维度 | 改进前 | 改进后 |
|------|--------|--------|
| 技术架构 | 8.0 | 8.5 |
| 功能完整度 | 7.5 | 7.5 |
| 代码质量 | 7.0 | 8.0 |
| 测试覆盖 | 7.5 | 8.5 |
| 工程基础设施 | 8.0 | 8.0 |
| 文档质量 | 8.5 | 8.5 |
| 商业可行性 | 6.5 | 6.5 |
| 安全性 | 6.5 | 8.5 |
| **综合评分** | **7.4** | **8.0** |

---

## 十一、执行变更清单

### P0 — 紧急安全修复

#### 1. SQL 注入修复
- **文件**: `internal/db/db.go`
- **变更**: `DeleteArticlesByStatus` 从 `fmt.Sprintf` SQL 拼接改为参数化查询
- **方式**: 预计算截止时间 `time.Now().AddDate(0,0,-beforeDays)` 传入参数

#### 2. API Key 加密存储
- **新增文件**: `internal/config/crypto.go`
  - `deriveKey()` — 从 hostname + username + OS 派生 AES-256 密钥
  - `EncryptString()` — AES-GCM 加密，返回 base64 密文
  - `DecryptString()` — 解密，向后兼容旧明文配置
- **修改文件**: `internal/config/config.go`
  - `Load()` — 读取后自动解密 API Key
  - `Save()` — 深拷贝配置后加密写入，不修改原始对象
  - 文件权限 0644 → 0600

### P1 — 架构改进

#### 3. context.Context 传递
- **修改文件**: `internal/llm/client.go`, `internal/enricher/enricher.go`, `internal/rag/rag.go`
- **变更**: `LLMClient` 接口所有方法新增 `ctx context.Context` 参数
- **调用方**: `cmd/ask.go`, `cmd/enrich.go`, `cmd/burst.go`, `cmd/web_handlers.go`, `cmd/web_inspire.go` 传递 `context.Background()` 或 `r.Context()`

#### 4. 请求重试 + 指数退避
- **修改文件**: `internal/llm/client.go`
- **新增**: `retryWithBackoff()` 函数
  - 最大 3 次重试，1s/2s/4s 退避
  - `isRetryable()` 仅对网络错误/429/502/503 重试
  - 支持 context 取消
- **新增**: `doRequest()` 统一 HTTP 请求方法，集成重试逻辑

#### 5. 结构化日志 (slog)
- **新增文件**: `internal/logger/logger.go` — 全局 slog 配置
- **修改文件**:
  - `cmd/root.go` — 新增 `--debug` 全局 flag，PersistentPreRun 配置日志级别
  - `internal/db/db.go` — 迁移错误改为 `slog.Debug`，数据初始化错误返回 `error`

#### 6. web.go 拆分
- **拆分前**: `cmd/web.go` (677行)
- **拆分后**:
  - `cmd/web.go` — 命令定义 + 类型 + 静态文件 + 路由注册 (120行)
  - `cmd/web_handlers.go` — 核心 API handlers (stats/sync/enrich/curate/ask/articles/sources) (330行)
  - `cmd/web_inspire.go` — 灵感 API handlers (inspire/burst/mark-all-read/star/deep-dive/history) (230行)

### P2 — 质量提升

#### 7. 端到端集成测试
- **新增文件**: `internal/integration/integration_test.go`
- **7 个测试**:
  - `TestIntegration_SaveSearchCleanup` — 完整文章生命周期
  - `TestIntegration_CuratorPipeline` — 策展评分排序
  - `TestIntegration_DedupPipeline` — 语义去重
  - `TestIntegration_SearchEngine` — 搜索引擎
  - `TestIntegration_RAGWithMock` — RAG + Mock LLM
  - `TestIntegration_EnricherWithMock` — 增强 + Mock
  - `TestIntegration_ConfigCrypto` — 配置加密往返

#### 8. 浏览器插件图标补全
- **新增目录**: `browser-extension/icons/`
- **新增文件**: `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`

#### 9. 静默错误处理改进
- **修改文件**: `internal/db/db.go`
  - ALTER TABLE 错误记录到 `slog.Debug`
  - UPDATE 初始化错误返回 `error` 而非 `_, _` 丢弃

---

## 十二、验证结果

```
$ go vet ./...
✅ 0 errors

$ go test ./... -short -count=1 -race
✅ 20/20 packages pass

新增文件: 5 个
  - internal/config/crypto.go
  - internal/logger/logger.go
  - internal/integration/integration_test.go
  - cmd/web_handlers.go
  - cmd/web_inspire.go

修改文件: 12 个
  - internal/db/db.go
  - internal/config/config.go
  - internal/llm/client.go
  - internal/enricher/enricher.go
  - internal/rag/rag.go
  - internal/mocks/mocks.go
  - cmd/root.go
  - cmd/ask.go
  - cmd/enrich.go
  - cmd/burst.go
  - cmd/web.go
  - cmd/web_inspire.go

浏览器插件图标: 4 个 PNG 文件
```

---

## 十三、后续建议

### 短期 (1-2 周)

1. 补充 `cmd/burst.go` 的拆分 (417行)
2. 为 logger 包编写单元测试
3. 考虑将 FTS5 tokenizer 改为 `unicode61` 以支持中文分词
4. 浏览器插件 host_permissions 收窄为特定端口

### 中期 (1-2 月)

5. 实现自动同步 cron 调度器
6. 添加向量搜索 (配合 embedding model)
7. 实现 OPML 导入
8. Web Dashboard 完善交互功能

### 长期 (3-6 月)

9. 端到端加密同步
10. 团队协作功能
11. 插件市场
