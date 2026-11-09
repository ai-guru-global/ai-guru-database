# AI GURU Industry Graph · MCP server

零依赖的 MCP（Model Context Protocol）服务端：让 Claude Desktop、Cursor、Cline 等客户端直接查询 AI 行业坐标系。

## 启动

```bash
python3 tools/mcp/aiguru_mcp.py
```

只依赖 Python 3.10+ 标准库与仓库内 `data/*.json`。

## 客户端配置

### Claude Desktop

编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`（macOS）：

```json
{
  "mcpServers": {
    "ai-guru": {
      "command": "python3",
      "args": ["/absolute/path/to/ai-guru-console/tools/mcp/aiguru_mcp.py"]
    }
  }
}
```

### Cursor

在 `~/.cursor/mcp.json` 或项目 `.cursor/mcp.json` 加入同样的 `mcpServers` 配置。

## 工具

| 工具 | 作用 |
|---|---|
| `dataset_info` | 版本、asOf、计数、许可证、稳定 ID 规则 |
| `search_nodes` | 按关键词 / 层搜索节点 |
| `get_node` | 节点拆解卡、六层解释、深度拆解摘要、关联节点与证据 |
| `get_node_evidence` | 节点相关线索与大事（关键词近似口径） |
| `list_topics` | 18 个主题域 |
| `list_clues` | 线索列表（按主题 / 关键词） |
| `get_clue` | 线索元数据 + 正文 + 分析 |
| `search_events` | 大事记搜索（可按起始日期） |
| `list_verify` | 六态核验台账 |
| `search_terms` | 术语库 |

## 示例提问

- 「GPU 与 AI 加速卡这个节点，当前的瓶颈和领先指标是什么？」
- 「列出所有 ⚠️ 状态的待核实条目，优先找和 Anthropic 相关的。」
- 「基础模型主题下有哪些线索，最近更新的是哪条？」
- 「哪些节点的证据最薄？」

## 测试

```bash
python3 tools/mcp/test_client.py
```

会依次验证 `initialize` / `tools/list` / `search_nodes` / `get_node` / `list_clues` / `list_verify` / `dataset_info`。