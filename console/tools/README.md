# tools/ — AI News Database 辅助工具

本目录统一管理 AI News Database 的所有辅助工具。仓库主体是根目录的 Markdown 新闻内容库（手动整理为主），这里的工具均为**可选辅助**，不是使用本数据库的前提。

## 目录说明

| 路径 | 说明 |
|---|---|
| [`cmd/`](cmd/) | Go CLI（`ai-news-database`），自包含 Go module，含阅读、筛选、LLM 增强、导出等能力 |
| [`cmd/web/`](cmd/web/) | 本地 Web 界面（工作台/灵感页），由 CLI 的 `web` 子命令提供服务 |
| [`cmd/browser-extension/`](cmd/browser-extension/) | 浏览器剪藏扩展（AI News Database Clipper） |

## 构建

```bash
cd cmd
make build     # 产物: cmd/ai-news-database
make test
```

或在仓库根目录使用转发 Makefile：`make build` / `make test`。

## 约定

- 新增工具一律放在本目录下，保持仓库根目录只有内容库与顶层文档。
- 工具产生的数据存放在 `~/.ai-news-database/`，不写入仓库。
