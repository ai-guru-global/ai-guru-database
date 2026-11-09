# AI News Database - 程序员个人信息终端

> 你的高质量技术资讯大本营，兼顾断舍离与极速查询。  
> **本地优先 · 数据主权** —— 你的数据永远属于你。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Go Version](https://img.shields.io/badge/Go-1.25+-00ADD8?style=flat&logo=go)](https://golang.org)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat&logo=sqlite)](https://sqlite.org)

一个优雅、简单、强大的 Go 语言命令行工具，专为程序员设计。采用 **LLM-Native** 架构和**本地优先**理念，支持多源 API 采集、智能网页抓取、LLM 内容增强、深度研究分析和本地知识库 RAG 问答。

---

## 目录

- [为什么选择 AI News Database？](#为什么选择-ai-news-database)
- [功能特性](#功能特性)
- [官方信息源](#官方信息源)
- [快速开始](#快速开始)
- [深度研究](#深度研究)
- [AI TUI 阅读器](#ai-tui-阅读器)
- [完整使用指南](#完整使用指南)
- [命令参考](#命令参考)
- [技术架构](#技术架构)
- [开发指南](#开发指南)
- [质量保证](#质量保证)
- [故障排除](#故障排除)
- [许可证](#许可证)

---

## 为什么选择 AI News Database？

| 特性 | AI News Database | 云端阅读器 |
|------|------------|-----------|
| **数据存储** | 本地 SQLite | 云端服务器 |
| **账号注册** | 不需要 | 必需 |
| **隐私保护** | 数据不上传 | 服务商可查看 |
| **服务可用性** | 永久可用 | 依赖服务商 |
| **离线使用** | 完全支持 | 有限支持 |
| **数据导出** | 完全自由 | 受限 |
| **AI 能力** | 本地 RAG + 深度研究 | 依赖云端 |

---

## 功能特性

### 核心功能

- ✅ **本地优先**: 所有数据存储在本地 SQLite，无需云端账号
- 🔒 **数据主权**: 你的阅读记录、收藏、笔记完全属于你
- 🌐 **多源智能采集**: 直接调用 HN/Reddit/V2EX API + Jina AI Reader
- 🤖 **LLM 内容增强**: 自动生成摘要、技术标签、质量评分（0-10）
- 🎯 **智能策展**: 基于质量评分和阅读偏好，自动生成「今日必读」
- 💬 **RAG 问答**: 基于本地知识库回答，标注引用来源
- 🔍 **极速搜索**: 本地 FTS5 全文检索，秒级响应

### 深度研究（新增）

- 🔬 **Deep Research**: 遵循专业研究方法论的深度分析
  - 规划阶段：自动生成研究假设和搜索计划
  - 多源采集：本地知识库 + 网络搜索并行
  - 内容获取：Jina Reader 抓取完整页面内容
  - 证据提取：关键声明、事实、引用自动提取
  - 交叉验证：证据关联分析，计算可信度
  - 信息缺口识别：发现研究中的薄弱环节

### AI TUI（新增）

- 📺 **AI 阅读器**: 分栏显示文章列表和正文预览
  - 左侧：文章列表（上下键选择）
  - 右侧：文章预览（标题、URL、摘要、标签）
  - 支持快捷操作：标记已读、收藏、丢弃

### 现有功能

- 📖 **阅读状态流**: unread / read / starred / archived / discarded
- 🧹 **断舍离支持**: 批量归档、自动清理、语义去重
- 📝 **快速输入**: 笔记、标签、Markdown 导出
- 🎨 **优雅输出**: 彩色终端输出，清晰易读
- 🚀 **快速启动**: 单二进制文件，无需额外依赖
- 🌐 **浏览器插件**: 一键保存网页到本地知识库

---

## 官方信息源

ai-news-database 内置 9 个精选高质量技术源，覆盖中英文：

| 别名 | 名称 | 采集方式 | 说明 |
|------|------|----------|------|
| `hn` | Hacker News | Algolia API | YC 技术新闻聚合 |
| `github` | GitHub Blog | Jina Reader | GitHub 官方博客 |
| `lobsters` | lobste.rs | HTML 解析 | 友好程序员社区 |
| `reddit` | Reddit r/programming | JSON API | Reddit 编程热门 |
| `ruanyf` | 阮一峰的网络日志 | Jina Reader | 中文技术博客标杆 |
| `coolshell` | 酷壳 CoolShell | Jina Reader | 左耳朵耗子的技术博客 |
| `v2ex` | V2EX | API | 中文技术社区 |
| `infoq` | InfoQ 中文站热点清单 | 专用抓取器 | 抓取热点文章列表 |
| `ai` | InfoQ AI Briefs | 专用抓取器 | AI 大模型即时资讯 |

使用 `ai-news-database sources` 查看完整列表，也可以直接用别名获取内容，如 `ai-news-database hn`。

---

## 快速开始

### 安装

#### 方式一：一键安装脚本（推荐）

```bash
curl -sSL https://get.ai-news-database.dev | bash
```

#### 方式二：从源码构建

确保已安装 Go 1.25 或更高版本：

```bash
git clone https://github.com/standup-coder/ai-news-database.git
cd ai-news-database
make build
```

#### 方式三：go install

```bash
go install github.com/standup-coder/ai-news-database@latest
```

#### 创建快捷别名

```bash
# 添加 shell 别名（推荐）
echo "alias nn='ai-news-database'" >> ~/.zshrc
source ~/.zshrc
```

### 配置 LLM（可选但推荐）

编辑 `~/.ai-news-database/config.json`，填入你的 LLM API 信息：

```json
{
  "llm": {
    "base_url": "https://api.openai.com/v1",
    "api_key": "sk-xxxxxxxx",
    "model": "gpt-4o-mini",
    "embedding_model": "text-embedding-3-small",
    "enrich_max_tokens": 2000,
    "ask_max_tokens": 4000
  }
}
```

> 支持任何 OpenAI 兼容接口，包括 Ollama 本地服务（`http://localhost:11434/v1`）。

### 首次运行

```bash
# 查看帮助
ai-news-database --help

# 查看可用官方源
ai-news-database sources

# 同步所有官方源
ai-news-database sync

# 查看已同步文章
ai-news-database list --articles
```

---

## 深度研究

ai-news-database 的深度研究功能遵循专业研究方法论，模拟 Qwen/DeepSeek Deep Research 的研究流程。

### 研究流程

```
┌─────────────────────────────────────────────────────┐
│  1. 规划阶段 - 分析主题，生成研究假设和搜索计划      │
├─────────────────────────────────────────────────────┤
│  2. 搜索阶段 - 并行搜索本地知识库 + 网络             │
├─────────────────────────────────────────────────────┤
│  3. 内容获取 - Jina Reader 抓取重要页面全文          │
├─────────────────────────────────────────────────────┤
│  4. 证据提取 - 提取关键声明、事实、引用               │
├─────────────────────────────────────────────────────┤
│  5. 分析阶段 - 交叉验证、识别模式、分析缺口           │
├─────────────────────────────────────────────────────┤
│  6. 综合阶段 - 生成结构化报告                        │
└─────────────────────────────────────────────────────┘
```

### 使用示例

```bash
# 基本研究
ai-news-database research "AI coding tools"

# 指定参数
ai-news-database research "Rust vs Go" --sub-queries 8 --limit 30

# 仅本地知识库（不进行网络搜索）
ai-news-database research "WebAssembly" --no-web

# 详细报告（含研究追踪）
ai-news-database research "Kubernetes trends" --detailed

# JSON 输出
ai-news-database research "微服务架构" --json
```

### 报告内容

- **执行摘要**: 2-3 句话概括核心趋势和发现
- **关键发现**: 带证据引用和置信度
- **多角度分析**: 主流观点、争议焦点、新兴趋势
- **信息缺口分析**: 未覆盖方面、弱证据
- **参考来源**: 带可信度评分和来源类型

### CLI 参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `--days` | 30 | 搜索时间范围 |
| `--limit` | 20 | 最大来源数量 |
| `--sub-queries` | 5 | 子查询数量 |
| `--no-web` | false | 仅使用本地知识库 |
| `--json` | false | JSON 格式输出 |
| `--detailed` | false | 详细报告（含研究追踪） |

---

## AI TUI 阅读器

分栏显示文章列表和正文预览，提供更高效的阅读体验。

### 使用方式

```bash
ai-news-database ai tui

# 或使用别名
nn ai tui
```

### 界面布局

```
┌─────────────────────┬─────────────────────────────┐
│  Articles (42) [Unread]  │  Content Preview           │
├─────────────────────┼─────────────────────────────┤
│ ○ [8.5] Article 1... │  Article Title              │
│ ✓ [9.0] Article 2... │  https://example.com      │
│ ★ [7.5] Article 3... │                           │
│ ○ [6.5] Article 4... │  Source: Hacker News       │
│                       │  Tags: golang, rust       │
│                       │  Score: 8.5/10           │
│                       │                           │
│                       │  LLM Summary or content...│
├─────────────────────┴─────────────────────────────┤
│  j/k:↑↓ Navigate | Enter:Select | r:Read | q:Quit │
└──────────────────────────────────────────────────┘
```

### 快捷键

| 键 | 功能 |
|-----|------|
| `j` / `↓` | 下移 |
| `k` / `↑` | 上移 |
| `K` / `PgUp` | 向上翻页 |
| `J` / `PgDn` | 向下翻页 |
| `r` | 标记已读 |
| `s` | 收藏 |
| `d` | 丢弃 |
| `1` | 显示全部 |
| `2` | 仅显示未读 |
| `3` | 仅显示收藏 |
| `q` | 退出 |

---

## 完整使用指南

### 场景 1: 早晨资讯同步（5分钟）

```bash
# 1. 同步所有官方源
ai-news-database sync

# 2. 对新文章进行 LLM 增强
ai-news-database enrich --limit 20

# 3. 查看智能策展的今日必读
ai-news-database curate --top 10
```

### 场景 2: 深度研究

```bash
# 对某个技术主题进行深度研究
ai-news-database research "AI coding tools evolution"

# 生成详细报告（含研究过程追踪）
ai-news-database research "Rust in 2025" --detailed
```

### 场景 3: AI TUI 阅读

```bash
# 启动 AI 阅读器
ai-news-database ai tui

# 在 TUI 中浏览、标记、收藏文章
```

### 场景 4: 知识库问答

```bash
ai-news-database ask "Go 和 Rust 在并发模型上有什么差异？"
```

### 场景 5: 深度阅读工作流

```bash
# 1. AI TUI 浏览文章
ai-news-database ai tui

# 2. 为重要文章添加笔记
ai-news-database note <article-id> "核心观点记录..."

# 3. 添加自定义标签
ai-news-database tag <article-id> "golang,concurrency"
```

---

## 命令参考

### 核心工作流

| 命令 | 说明 | 示例 |
|------|------|------|
| `sync` | 同步官方源到本地数据库 | `ai-news-database sync --source hn` |
| `enrich` | LLM 内容增强 | `ai-news-database enrich --limit 10` |
| `curate` | 智能策展 | `ai-news-database curate --top 10` |
| `ask` | RAG 问答 | `ai-news-database ask "问题"` |
| `research` | 深度研究 | `ai-news-database research "主题"` |
| `ai tui` | AI 阅读器 | `ai-news-database ai tui` |
| `inbox` | TUI 收件箱 | `ai-news-database inbox` |

### 文章管理

| 命令 | 说明 | 示例 |
|------|------|------|
| `list` | 列出订阅/文章 | `ai-news-database list -a --status unread` |
| `read` | 标记已读 | `ai-news-database read 1 2 3` |
| `star` | 收藏 | `ai-news-database star 42` |
| `discard` | 丢弃 | `ai-news-database discard 5 6` |
| `archive` | 批量归档 | `ai-news-database archive` |
| `note` | 添加笔记 | `ai-news-database note 42 "笔记"` |
| `tag` | 添加标签 | `ai-news-database tag 42 "tag1,tag2"` |

### 搜索与导出

| 命令 | 说明 | 示例 |
|------|------|------|
| `search` | 全文搜索 | `ai-news-database search "golang"` |
| `stats` | 订阅健康度 | `ai-news-database stats` |
| `export` | 导出文章 | `ai-news-database export --status starred` |
| `cleanup` | 清理旧文章 | `ai-news-database cleanup` |

### 快捷别名命令

| 命令 | 说明 |
|------|------|
| `hn` | 直接获取 Hacker News |
| `infoq` | 直接获取 InfoQ 热点 |
| `v2ex` | 直接获取 V2EX 热门 |
| `github` | 直接获取 GitHub Blog |
| `reddit` | 直接获取 Reddit 热门 |
| `inspire` | HN 新产品灵感 |

---

## 技术架构

### 项目目录结构

```
ai-news-database/
├── cmd/                          # CLI 命令定义（Cobra）
│   ├── root.go                   # 根命令 + 官方源别名处理
│   ├── sync.go                   # 同步文章
│   ├── enrich.go                 # LLM 内容增强
│   ├── curate.go                 # 智能策展
│   ├── ask.go                    # RAG 问答
│   ├── research.go                # 深度研究
│   ├── ai.go                     # AI TUI 命令
│   ├── inbox.go                  # TUI 收件箱
│   └── ...
├── internal/                     # 内部模块
│   ├── article/                  # 文章模型
│   ├── config/                   # 配置管理
│   ├── crawler/                  # 多源内容采集器
│   ├── curator/                  # 智能策展
│   ├── db/                       # SQLite + FTS5
│   ├── deep_research/             # 深度研究引擎
│   ├── dedup/                    # 语义去重
│   ├── enricher/                 # LLM 内容增强
│   ├── llm/                      # LLM 统一客户端
│   ├── official/                  # 官方信息源注册表
│   ├── rag/                      # RAG 问答
│   ├── search/                   # DuckDuckGo 搜索
│   ├── tui/                     # TUI 组件
│   │   ├── split_reader.go       # 分栏阅读器
│   │   └── ...
│   └── i18n/                    # 国际化
├── browser-extension/             # 浏览器插件
│   ├── manifest.json             # Chrome Extension Manifest V3
│   ├── popup.html/js/css        # 弹窗界面
│   ├── background.js             # Service Worker
│   └── content.js               # 内容脚本
├── web/                          # Web 宣传页面
├── main.go                       # 程序入口
├── go.mod                        # 依赖管理
├── Makefile                      # 构建脚本
├── .golangci.yml               # Linter 配置
├── .editorconfig                # 编辑器配置
├── .pre-commit-config.yaml      # Pre-commit 钩子
└── .github/workflows/           # CI/CD 配置
```

### 核心数据流

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   官方源    │────▶│  Crawler/   │────▶│   SQLite    │
│ (HN/V2EX等) │     │   Fetcher   │     │    (db)     │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                 │
                        ┌────────────────────────┘
                        ▼
               ┌─────────────────┐
               │   Enricher      │
               │ (LLM 摘要/标签)  │
               └────────┬────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
     ┌─────────┐   ┌─────────┐   ┌─────────┐
     │ Curator │   │  RAG    │   │ Deep    │
     │(智能推荐)│   │(知识问答)│   │ Research│
     └────┬────┘   └────┬────┘   └────┬────┘
          │             │             │
          └─────────────┴─────────────┘
                        │
                        ▼
                 ┌─────────────┐
                 │  TUI / CLI  │
                 │  (用户交互)  │
                 └─────────────┘
```

---

## 开发指南

### 构建

```bash
# 编译
make build

# 跨平台编译
make release

# 运行测试
make test

# 代码质量检查
make quality
```

### 质量保证

项目包含完整的质量检查流程：

| 检查项 | 命令 | 说明 |
|--------|------|------|
| 格式化 | `make fmt` | gofmt 检查 |
| 静态分析 | `make vet` | go vet 检查 |
| Lint | `make lint` | golangci-lint 检查 |
| 单元测试 | `make test` | go test -race |
| 覆盖率 | `make test-coverage` | 覆盖率 ≥60% |
| 安全扫描 | `make security` | gosec 检查 |

### Pre-commit 钩子

安装 pre-commit 后，每次提交会自动运行质量检查：

```bash
pip install pre-commit
pre-commit install
```

### 添加新命令

1. 在 `cmd/` 下新建 `xxx.go`
2. 定义 `xxxCmd` 并使用 `rootCmd.AddCommand(xxxCmd)`
3. 在 `init()` 中注册 Flag

### 添加新采集源

1. 在 `internal/official/registry.go` 的 `registerDefaultSources()` 中注册
2. 如需专用采集器，在 `internal/crawler/factory.go` 的 `NewCrawler()` 中实现分支

---

## 质量保证

### CI/CD 流程

项目使用 GitHub Actions 进行持续集成：

- **Format Check**: gofmt 格式化检查
- **Build**: 多平台编译验证
- **Test**: 跨平台测试（Ubuntu/macOS/Windows × Go 1.25/1.26）
- **Lint**: golangci-lint 静态检查
- **Security**: gosec 安全扫描
- **Coverage**: 覆盖率门槛检查（≥60%）

### 代码规范

- 遵循 [Effective Go](https://go.dev/doc/effective_go) 规范
- 使用 `gofmt` 格式化代码
- 启用 golangci-lint 规则：errcheck, gosec, gosimple, govet, ineffassign, staticcheck, typecheck, unused, golint, misspell, nakedret, prealloc, exportloopref

### 依赖管理

- 使用 Go Modules 管理依赖
- 通过 Dependabot 自动更新依赖
- 工具依赖声明在 `go.mod` 的 `tool` 指令中

---

## 故障排除

### Q: 为什么数据要存储在本地？

**A**: AI News Database 坚持「本地优先」和「数据主权」理念：

- ✅ **隐私**: 无需账号，数据不上传云端
- ✅ **永久可用**: 不受服务商倒闭影响
- ✅ **可导出**: 随时备份或迁移
- ✅ **离线使用**: 没有网络也能访问已同步内容

### Q: 不配置 LLM 能用吗？

**A**: 可以。不配置 LLM 也能：
- 同步和阅读文章
- 管理阅读状态
- 搜索本地文章
- 使用 AI TUI 阅读器

但无法使用：
- `enrich` - 自动生成摘要和标签
- `curate` - 智能策展
- `ask` - RAG 问答
- `research` - 深度研究

### Q: 数据库会占用多大空间？

**A**: 取决于同步的文章数量。通常：
- 1000 篇文章约 10-20 MB
- 包含全文索引，支持快速搜索

### Q: `sync` 时某些源报错怎么办？

**A**: 
1. 检查网络连接
2. 尝试单独同步该源：`ai-news-database sync --source <alias>`
3. 对于 API 源，可能是 rate limit，稍后再试

---

## 浏览器插件

AI News Database 提供 Chrome 浏览器插件，支持一键保存网页到本地知识库。

### 安装方式

1. **Chrome Web Store**（即将上线）
2. **开发者模式本地加载**：
   - 打开 `chrome://extensions/`
   - 开启右上角「开发者模式」
   - 点击「加载已解压的扩展程序」
   - 选择 `browser-extension/` 目录

### 功能

- 一键保存当前网页到本地数据库
- 右键菜单保存页面或链接
- 快捷键 `Ctrl+Shift+N` 快速保存
- 自定义本地 API 地址

### 发布到 Chrome Web Store

项目包含自动化发布工作流（`.github/workflows/publish-extension.yml`）。配置 GitHub Secrets 后即可使用。

---

## 相关文档

- [`CONTRIBUTING.md`](CONTRIBUTING.md) - 贡献指南
- [`CHANGELOG.md`](CHANGELOG.md) - 版本变更记录
- [`SECURITY.md`](SECURITY.md) - 安全政策
- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) - 社区行为准则

---

## 许可证

MIT License

---

**享受你的本地优先技术阅读体验！** 🚀  
*你的数据，永远属于你。*
