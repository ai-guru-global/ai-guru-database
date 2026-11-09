# AI GURU Industry Graph · 数据字典

> 机器可读的 AI 产业结构数据集。与 `console/data.js` 同源，由 `tools/scripts/build_dataset.py` 生成。
> 版本与 `asOf` 见 [`index.json`](index.json)。

## 这是什么

这不是新闻数据，而是一张**产业结构图**的机器可读出口：

- **骨架**：5 层产业链、69 个节点、207 个二级细分；
- **证据**：95 条线索时间线、169 条年度大事、154 条六态待核实；
- **供给面**：14 个前沿模型、139 个玩家、62 个术语；
- **解释层**：69 个节点的六层解释与行业版图、69 个节点的深度拆解。

事实层与观点层严格分离：`chain` 的 `maturity / why / moat / bottleneck / signals` 与 `deep` 是观点层，可被证据整段修订；`clues / chronicle / verify` 是证据层。

英文骨架：`chain.json` 的每个节点带 `nameEn` / `defEn`，`topics.json` 的每个主题带 `defEn`；正文与证据仍以中文为主，英文层用于检索、引用与海外分发。

## 文件

| 文件 | 内容 | 主键 |
|---|---|---|
| `chain.json` | 五层产业链、节点、技术栈视图 | `uid` = `chain/L1/gpu` |
| `topics.json` | 18 个横向主题域 | `uid` = `topic/基础模型` |
| `clues.json` | 线索元数据 + 正文 + 分析 | `uid` = `clue/基础模型/Claude` |
| `chronicle.json` | 年度大事记 | `uid` = `event/2026-10-02/<hash>` |
| `verify.json` | 六态待核实台账 | `uid` = `verify/2026-09-04/<hash>` |
| `models.json` | 模型登记册 | `uid` = `model/gpt-6-astra` |
| `players.json` | 玩家图谱 | `uid` = `player/openai` |
| `glossary.json` | 术语库 | `uid` = `term/moe` |
| `explain.json` | 节点六层解释 + 行业与企业版图 | key = 节点 id |
| `deep.json` | 节点深度拆解 | key = 节点 id |
| `index.json` | 版本、asOf、计数、许可证、文件清单 | — |

## 稳定 ID 与引用

每个实体都有稳定 `uid`，可直接作为引用单元：

```
ai-guru:chain/L1/gpu           # 节点：GPU 与 AI 加速卡
ai-guru:chain/L1/gpu/infer     # 二级细分：推理与性价比卡
ai-guru:clue/基础模型/Claude    # 线索：Claude
ai-guru:term/moe               # 术语：MoE
```

完整引用格式见根目录 [`CITATION.md`](../CITATION.md)。

## 给 Agent 用

仓库自带零依赖 MCP server，Claude Desktop / Cursor / Cline 可直接查询节点、线索、大事与核验状态：

```bash
python3 tools/mcp/aiguru_mcp.py
```

配置与工具列表见 [`tools/mcp/README.md`](../tools/mcp/README.md)。

## 六态标记

`verify.json` 的 `status` 与仓库核验图例同集：

| 标记 | 含义 |
|---|---|
| ✅ | 已核验 |
| ⚠️ | 部分可取 / 存疑 |
| ❓ | 未核验 |
| 🔍 | 检索缺口 |
| ✗ | 已证伪 / 不可达 |
| E | 证据不足，仅登记存在 |

## 版本与新鲜度

- `version`：数据集版本，默认取 `asOf` 的年月（如 `2026.10`）；
- `asOf`：数据本身的最新日期，不是构建时间；
- 每次内容更新后重跑 `make dataset`，`data/` 与 `console/data.js` 同步再生；
- 引用时请带版本号：`AI GURU Industry Graph v2026.10`。

## 重新生成

```bash
make dataset
# 等价于
python3 tools/scripts/build_dataset.py
```

只检查不写盘：

```bash
python3 tools/scripts/build_dataset.py --check
```

## 校验

`schema/` 下是 JSON Schema（Draft 2020-12）。CI 可用任意 JSON Schema 校验器逐项校验。

## 许可

- **数据与内容**：CC BY-SA 4.0；
- **代码与工具**：MIT。

转载或再分发请署名「AI GURU 工作台（ai-guru-console）」并以相同方式共享。