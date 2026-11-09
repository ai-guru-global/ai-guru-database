# ai-industry-graph

Machine-readable map of the AI industry: **5 value-chain layers, 69 nodes, 207 sub-segments, 18 topic domains**, plus clue timelines, a chronicle and a six-state verification ledger.

> Not a news feed. A coordinate system.

## Install

```bash
npm install ai-industry-graph
```

## Usage

```js
import { node, searchNodes, nodeDetail, clues, verification } from "ai-industry-graph";

const gpu = node("chain/L1/gpu");
console.log(gpu.name, gpu.def, gpu.moat);

const infra = searchNodes("光模块", { layer: "L1", limit: 5 });
const detail = nodeDetail("gpu");          // 拆解卡 + 六层解释 + 深度拆解
const pending = verification("⚠️");         // 待核实台账
```

## What you get

| Export | Contents |
|---|---|
| `index` | version, `asOf`, counts, license, citation |
| `chain` | 5 layers, 69 nodes, 207 sub-segments, tech-stack view |
| `nodes` | flattened nodes with `layer` / `layerName` |
| `topics` | 18 cross-cutting topic domains |
| `clues` | 95 clue timelines with body and analysis |
| `chronicle` | 169 chronicle events |
| `verify` | 154 six-state verification items |
| `models` / `players` / `glossary` | model registry, player graph, glossary |
| `explain` / `deep` | node explanations and deep dives |

Stable IDs look like `ai-guru:chain/L1/gpu`. See the repo's `CITATION.md`.

## API

- `node(uidOrId)` — resolve a node
- `clue(idOrUid)` — resolve a clue
- `searchNodes(query, { layer, limit })`
- `searchEvents(query, { since, limit })`
- `searchTerms(query, { limit })`
- `verification(status?)`
- `nodeDetail(uidOrId)` — node + six-level explanation + industries + deep dive

## Data license

Data and content: **CC BY-SA 4.0**. Code: **MIT**.

Please attribute "AI GURU 工作台（ai-guru-console）" and share alike.

## Source

https://github.com/ai-guru-global/ai-guru-console