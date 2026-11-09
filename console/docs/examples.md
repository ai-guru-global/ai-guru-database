# AI News Database 使用示例

本文档展示了 ai-news-database 的常用使用场景和工作流。

> **核心理念**: AI News Database 坚持**本地优先**和**数据主权**。所有数据存储在本地 SQLite 数据库（`~/.ai-news-database/`），无需云端账号，你的数据永远属于你。

---

## 目录

- [快速开始](#快速开始)
- [日常使用工作流](#日常使用工作流)
- [LLM 配置](#llm-配置)
- [数据管理](#数据管理)
- [常见问题](#常见问题)

---

## 快速开始

### 1. 安装与配置

```bash
# 克隆仓库
git clone <repository-url>
cd ai-news-database

# 编译项目
go build -o ai-news-database

# 首次运行会自动创建配置目录 ~/.ai-news-database/
./ai-news-database --help
```

### 2. 配置 LLM（可选但推荐）

编辑 `~/.ai-news-database/config.json`：

```json
{
  "llm": {
    "base_url": "https://api.openai.com/v1",
    "api_key": "sk-your-api-key",
    "model": "gpt-4o-mini",
    "embedding_model": "text-embedding-3-small",
    "enrich_max_tokens": 2000,
    "ask_max_tokens": 4000
  }
}
```

> 💡 **提示**: 支持任何 OpenAI 兼容接口，包括 Ollama 本地服务（`http://localhost:11434/v1`）。

### 3. 同步官方源

```bash
# 查看可用的官方源
./ai-news-database sources

# 同步所有官方源到本地数据库
./ai-news-database sync
```

输出示例：
```
⟳ 正在同步 Hacker News ...
  ✓ 新增 30 条，更新 5 条重复
⟳ 正在同步 GitHub Blog ...
  ✓ 新增 5 条，更新 0 条重复
...
✓ 同步完成：新增 60 条，更新 10 条
💡 下一步建议: ai-news-database enrich  生成 LLM 摘要和标签
```

### 4. 查看已同步的文章

```bash
# 列出最近的文章
./ai-news-database list --articles

# 仅查看未读文章
./ai-news-database list --articles --status unread

# 查看收藏的文章
./ai-news-database list --articles --status starred
```

---

## 日常使用工作流

### 场景 1: 早晨资讯同步（5分钟）

```bash
# 1. 同步所有官方源
./ai-news-database sync

# 2. 对新文章进行 LLM 增强（生成摘要、标签、评分）
./ai-news-database enrich --limit 20

# 3. 查看智能策展的今日必读
./ai-news-database curate --top 10
```

### 场景 2: 深度阅读工作流

```bash
# 1. 进入 TUI 收件箱浏览文章
./ai-news-database inbox
```

在 TUI 中：
- `j/k` 或 `↓/↑` - 浏览文章
- `r` - 标记为已读
- `s` - 收藏
- `d` - 丢弃
- `a` - 归档
- `1/2/3` - 切换视图（全部/未读/收藏）
- `q` - 退出

```bash
# 2. 为重要文章添加笔记
./ai-news-database note <article-id> "核心观点记录..."

# 3. 添加自定义标签
./ai-news-database tag <article-id> "golang,concurrency"
```

### 场景 3: 知识库问答

```bash
# 基于本地知识库回答问题
./ai-news-database ask "Go 和 Rust 在并发模型上有什么差异？"

./ai-news-database ask "最近关于微服务架构有哪些最佳实践？"
```

输出示例：
```
⟳ 正在检索知识库并生成回答...

回答：
Go 和 Rust 在并发模型上有以下主要差异...

━━━ 引用来源 ━━━
[1] Go 并发模式详解 (Hacker News)
    https://...
[2] Rust 异步编程指南 (GitHub Blog)
    https://...

💡 提示: 知识库内容越丰富，回答质量越高。建议定期执行 sync + enrich。
```

### 场景 4: 全文搜索

```bash
# 搜索本地知识库
./ai-news-database search "kubernetes"

./ai-news-database search "微服务架构"
```

### 场景 5: 导出与备份

```bash
# 导出收藏的文章为 Markdown
./ai-news-database export --status starred --output my-favorites.md

# 导出已读文章
./ai-news-database export --status read --output read-articles.md
```

### 场景 6: 定期维护

```bash
# 查看订阅健康度
./ai-news-database stats

# 归档所有已读文章
./ai-news-database archive

# 清理过期文章（丢弃超过7天、归档超过30天）
./ai-news-database cleanup
```

---

## LLM 配置

### 使用 OpenAI

```json
{
  "llm": {
    "base_url": "https://api.openai.com/v1",
    "api_key": "sk-xxxxxxxx",
    "model": "gpt-4o-mini",
    "embedding_model": "text-embedding-3-small"
  }
}
```

### 使用 Ollama（本地 LLM）

```json
{
  "llm": {
    "base_url": "http://localhost:11434/v1",
    "api_key": "ollama",
    "model": "llama3.2",
    "embedding_model": "nomic-embed-text"
  }
}
```

### 使用其他服务商

```json
// DeepSeek
{
  "llm": {
    "base_url": "https://api.deepseek.com/v1",
    "api_key": "sk-xxxxxxxx",
    "model": "deepseek-chat"
  }
}

// 其他兼容 OpenAI API 的服务
{
  "llm": {
    "base_url": "https://your-api-endpoint/v1",
    "api_key": "your-key",
    "model": "your-model"
  }
}
```

---

## 数据管理

### 数据存储位置

所有数据存储在本地，默认位置：

| 平台 | 路径 |
|------|------|
| macOS | `~/.ai-news-database/` |
| Linux | `~/.ai-news-database/` |
| Windows | `C:\Users\<用户名>\.ai-news-database\` |

### 文件说明

```
~/.ai-news-database/
├── config.json          # LLM 配置
├── ai-news-database.db        # SQLite 数据库（文章、阅读状态、全文索引）
└── subscriptions.json   # 旧订阅配置（已弃用）
```

### 备份数据

```bash
# 直接备份数据库文件
cp ~/.ai-news-database/ai-news-database.db ~/backups/ai-news-database-$(date +%Y%m%d).db

# 或使用 export 导出 Markdown
./ai-news-database export --output backup.md
```

### 数据可移植性

SQLite 数据库是标准的单文件格式，可以：
- 在不同设备间复制
- 使用任何 SQLite 工具查看
- 导出为 SQL 或 CSV

---

## 常见问题

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
- 导出文章

但无法使用：
- `enrich` - 自动生成摘要和标签
- `curate` - 智能策展
- `ask` - RAG 问答

### Q: 如何添加自定义订阅源？

**A**: 目前主要支持内置的 8 个官方源。自定义源功能正在开发中。

### Q: 数据库会占用多大空间？

**A**: 取决于同步的文章数量。通常：
- 1000 篇文章约 10-20 MB
- 包含全文索引，支持快速搜索

### Q: 如何清理空间？

**A**: 定期执行：

```bash
# 清理旧文章
./ai-news-database cleanup

# 手动删除丢弃的文章
./ai-news-database list --articles --status discarded
# 然后使用 remove 命令（如支持）或手动删除数据库
```

### Q: 如何查看某个命令的帮助？

**A**: 使用 `--help` 参数：

```bash
./ai-news-database --help
./ai-news-database sync --help
./ai-news-database enrich --help
```

---

## 高级技巧

### 组合命令

```bash
# 同步后立即增强
./ai-news-database sync && ./ai-news-database enrich

# 策展后进入收件箱
./ai-news-database curate --top 10 && ./ai-news-database inbox
```

### 使用别名

在 `~/.bashrc` 或 `~/.zshrc` 中添加：

```bash
alias n4c='./ai-news-database'
alias n4c-sync='./ai-news-database sync'
alias n4c-inbox='./ai-news-database inbox'
alias n4c-ask='./ai-news-database ask'
```

### 定时自动同步

使用 cron（Linux/macOS）：

```bash
# 每天早上 8 点同步
0 8 * * * cd /path/to/ai-news-database && ./ai-news-database sync >> ~/.ai-news-database/sync.log 2>&1
```

---

## 完整命令参考

| 命令 | 说明 | 示例 |
|------|------|------|
| `sync` | 同步官方源 | `ai-news-database sync --source hn` |
| `enrich` | LLM 增强 | `ai-news-database enrich --limit 10` |
| `curate` | 智能策展 | `ai-news-database curate --top 10` |
| `ask` | RAG 问答 | `ai-news-database ask "问题"` |
| `inbox` | TUI 收件箱 | `ai-news-database inbox` |
| `list` | 列出文章 | `ai-news-database list -a --status unread` |
| `read` | 标记已读 | `ai-news-database read 1 2 3` |
| `star` | 收藏 | `ai-news-database star 42` |
| `discard` | 丢弃 | `ai-news-database discard 5 6` |
| `archive` | 批量归档 | `ai-news-database archive` |
| `search` | 全文搜索 | `ai-news-database search "golang"` |
| `stats` | 订阅健康度 | `ai-news-database stats` |
| `note` | 添加笔记 | `ai-news-database note 42 "笔记"` |
| `tag` | 添加标签 | `ai-news-database tag 42 "tag1,tag2"` |
| `export` | 导出文章 | `ai-news-database export --status starred` |
| `cleanup` | 清理旧文章 | `ai-news-database cleanup` |
| `sources` | 查看官方源 | `ai-news-database sources` |

---

**享受你的本地优先技术阅读体验！** 🚀
