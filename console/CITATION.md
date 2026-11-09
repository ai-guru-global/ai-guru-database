# 引用格式（Citation）

> 本仓库的节点、线索、术语与事件都有稳定 ID，可作为引用单元。
> 数据集版本见 [`data/index.json`](data/index.json) 的 `version` 与 `asOf`。

## 稳定 ID

| 类型 | 格式 | 示例 |
|---|---|---|
| 产业链节点 | `ai-guru:chain/<层>/<节点>` | `ai-guru:chain/L1/gpu` |
| 二级细分 | `ai-guru:chain/<层>/<节点>/<细分>` | `ai-guru:chain/L1/gpu/infer` |
| 线索 | `ai-guru:clue/<主题>/<线索>` | `ai-guru:clue/基础模型/Claude` |
| 术语 | `ai-guru:term/<key>` | `ai-guru:term/moe` |
| 大事 | `ai-guru:event/<日期>/<hash>` | `ai-guru:event/2026-10-02/2afeb230b2f4` |

节点与线索的网页入口：

- 节点：`#/chain/L1/gpu`
- 线索：`#/clue/基础模型/Claude`

## 推荐引用

### 中文

> AI GURU 工作台（ai-guru-console）. *AI GURU Industry Graph*, v2026.10, 2026-10-27. `ai-guru:chain/L1/gpu`. https://github.com/ai-guru-global/ai-guru-console

### English

> AI GURU Console. *AI GURU Industry Graph*, v2026.10, 2026-10-27. `ai-guru:chain/L1/gpu`. https://github.com/ai-guru-global/ai-guru-console

### BibTeX

```bibtex
@misc{aiguru2026graph,
  title        = {AI GURU Industry Graph},
  author       = {{AI GURU Console}},
  year         = {2026},
  version      = {2026.10},
  note         = {asOf 2026-10-27; node ai-guru:chain/L1/gpu},
  howpublished = {\url{https://github.com/ai-guru-global/ai-guru-console}}
}
```

## 版本口径

- **引用节点或术语**：可只带 `uid`；建议同时写数据集版本。
- **引用数字或判断**：必须带 `uid` + 版本 + `asOf`，因为节点判断会随证据修订。
- **引用证据**：用 `clue/` 或 `event/` 的 `uid`，并保留原始来源链接（`url` 字段）。

## 许可

数据与内容为 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh)；代码为 MIT。
转载请署名「AI GURU 工作台（ai-guru-console）」并以相同方式共享。