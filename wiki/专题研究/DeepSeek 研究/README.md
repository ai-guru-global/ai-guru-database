# DeepSeek 官方文档语料库

> 自动抓取自 [api-docs.deepseek.com](https://api-docs.deepseek.com/)
> 抓取时间：2026-06-26 02:25 (Asia/Shanghai)
> 总页数：**124** (62 en × 1 + 62 zh-cn × 1)

## 统计

| 指标 | 英文 en | 中文 zh-cn |
|---|---|---|
| 页数 | 62 | 62 |
| 总词数 | 20,206 | 11,191 |
| 总字节 | 163,907 | 177,559 |
| 平均每页词数 | 325 | 180 |

## 分类（按英文版结构）

| 分类 | 数量 | 英文目录 | 中文目录 |
|---|---|---|---|
| api | 5 | `en/api/create-chat-completion.md`<br>`en/api/create-completion.md`<br>`en/api/deepseek-api.md`<br>... +2 | `zh-cn/api/create-chat-completion.md`<br>`zh-cn/api/create-completion.md`<br>`zh-cn/api/deepseek-api.md`<br>... +2 |
| api_samples | 7 | `en/api_samples/chat_curl.md`<br>`en/api_samples/chat_nodejs.md`<br>`en/api_samples/chat_python.md`<br>... +4 | `zh-cn/api_samples/chat_curl.md`<br>`zh-cn/api_samples/chat_nodejs.md`<br>`zh-cn/api_samples/chat_python.md`<br>... +4 |
| guides | 9 | `en/guides/anthropic_api.md`<br>`en/guides/chat_prefix_completion.md`<br>`en/guides/coding_agents.md`<br>... +6 | `zh-cn/guides/anthropic_api.md`<br>`zh-cn/guides/chat_prefix_completion.md`<br>`zh-cn/guides/coding_agents.md`<br>... +6 |
| news | 15 | `en/news/news0725.md`<br>`en/news/news0802.md`<br>`en/news/news0905.md`<br>... +12 | `zh-cn/news/news0725.md`<br>`zh-cn/news/news0802.md`<br>`zh-cn/news/news0905.md`<br>... +12 |
| quick_start | 20 | `en/quick_start/agent_integrations/astrbot.md`<br>`en/quick_start/agent_integrations/claude_code.md`<br>`en/quick_start/agent_integrations/copilot_cli.md`<br>... +17 | `zh-cn/quick_start/agent_integrations/astrbot.md`<br>`zh-cn/quick_start/agent_integrations/claude_code.md`<br>`zh-cn/quick_start/agent_integrations/copilot_cli.md`<br>... +17 |
| root | 6 | `en/PromptLibrary.md`<br>`en/faq.md`<br>`en/home.md`<br>... +3 | `zh-cn/PromptLibrary.md`<br>`zh-cn/faq.md`<br>`zh-cn/home.md`<br>... +3 |

## 目录结构

```
corpus/deepseek-docs/
├── README.md           # 本文件
├── index.json          # 全量元数据 (含所有页面的 url/title/words/...)
├── stats.json          # 抓取过程的原始统计
├── en/                 # 英文版 (62 个 .md 文件)
│   ├── home.md
│   ├── faq.md
│   ├── updates.md
│   ├── api/            # 5 个 API 参考
│   ├── api_samples/    # 7 个代码示例
│   ├── guides/         # 9 个 API 指南
│   ├── news/           # 15 个新闻/公告
│   └── quick_start/
│       ├── pricing.md  # 模型 & 价格
│       ├── token_usage.md
│       ├── rate_limit.md
│       ├── error_codes.md
│       └── agent_integrations/  # 16 个 Agent 集成
└── zh-cn/              # 中文版 (62 个 .md 文件，结构同 en/)
```

## 使用

### 1. 喂给 LLM / RAG

每个 .md 文件顶部都有 metadata：

```markdown
# Tool Calls

*Tool Calls allows the model to call external tools...*

**Path:** API Guides > Tool Calls

---

**Source:** https://api-docs.deepseek.com/guides/tool_calls

...
```

可以直接切片灌进 RAG / 微调 pipeline。

### 2. JSONL（每行一页）

```bash
# 拼接成单文件 JSONL
python3 -c "
import json, pathlib
idx = json.loads(pathlib.Path('index.json').read_text())
for p in idx['pages']:
    content = pathlib.Path(p['path']).read_text()
    p['content'] = content
    print(json.dumps(p, ensure_ascii=False))
" > all.jsonl
```

### 3. 训练 / 检索

- **Embedding 推荐：** 用 nomic-embed-text / bge-m3 把每页转成向量
- **RAG 切片建议：** 按二级标题 `## ...` 切，每页 1-5 个 chunk
- **关键词索引：** 按 category + 标题建倒排索引

## 抓取说明

- **方法：** `curl` + BeautifulSoup 解析 Docusaurus HTML
- **URL 源：** sitemap.xml（62 个唯一路径） × 2 语言 = 124 个请求
- **输出：** 纯 markdown，保留表格、代码块、链接、内联格式
- **不含：** 导航 / 侧边栏 / 页脚 / script / 样式
- **限制：** 表格跨行单元格用 `^(N)` 表示原始 `<sup>` 标签；锚点链接被规范化

## 重抓

```bash
python3 /tmp/build_corpus.py   # 重新拉所有页
python3 /tmp/build_index.py    # 重建 index + README
```
