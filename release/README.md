# AI Guru 语料（完整知识库（全量））

> AgentScope 智能体 NAS 挂载语料。LLM-Wiki 模式：沿双括号 wikilink 遍历，非 RAG。
> scope = `full` ｜ 导出脚本：`_tools/export_corpus.py`

## 统计

| 指标 | 值 |
| --- | --- |
| 总页面 | 2147 |
| 入口可达 | 1742 |
| Core / Supporting | 455 / 1604 |
| 总大小 | 20.79 MB |
| 内部链接 | 14800（已解析 13850，断链 950） |
| 链接解析率 | 93.6% |
| 已重写为纯文本的死链 | 950 |

## 使用

```python
import json
from pathlib import Path
root = Path("release")
manifest = json.load(open(root / "corpus_manifest.json"))
entry = root / manifest["categories"]["diagnosis_hub"]   # 诊断总入口
# 按 basename 解析双括号 wikilink（空格/下划线可互换）；未解析链接已被改写为纯文本
```

## 智能体工作流
1. 收到工单 → 读 `diagnosis-work-order-hub.md`
2. 按现象分类 → Pod / Network / Storage / GPU 决策树
3. 沿双括号 wikilink 遍历 → Runbook + 概念页
4. 输出远程排查建议（含安全分级）

## 来源
- 源仓库: ai-guru-global/ai-guru-database
- 导出时间: 2026-07-02 14:54
