# AI GURU Console

**Anatomy of the AI industry, layer by layer.**

[中文](README.md) · English

AI GURU Console is an open, machine-readable map of the AI industry — **not a news site**. News is only evidence: every item is attached to a coordinate in an industry structure that can be drilled down from five value-chain layers to 69 nodes and 207 sub-segments.

The product is the decomposition itself: **structure × evidence × verification**.

## What is inside

| Layer | Contents |
|---|---|
| Industry chain | 5 layers (`L1 compute & hardware → L2 data & models → L3 platforms & tools → L4 applications → L5 business & ecosystem`), 69 nodes, 207 sub-segments |
| Cross-cutting topics | 18 topic domains (foundation models, agents, inference & infra, robotics, world models, …) |
| Evidence | 95 clue timelines, 169 chronicle events, 154 six-state verification items |
| Supply side | 14 frontier models, 139 tracked players, 62 glossary terms |
| Explanation | Six-level explanations and industry/company maps for every node; deep dives for every node |

Facts and opinions are kept apart. `clues / chronicle / verify` are the evidence layer; `maturity / why / moat / bottleneck / signals` and `deep` are the opinion layer, revisable by evidence.

## Machine-readable dataset

`data/` is the same content as a machine-readable export — built for agents, RAG pipelines, dashboards and research tools:

| File | Contents |
|---|---|
| [`data/chain.json`](data/chain.json) | 5 layers, 69 nodes, 207 sub-segments, tech-stack view |
| [`data/clues.json`](data/clues.json) | Clue timelines with metadata, body and analysis |
| [`data/chronicle.json`](data/chronicle.json) | Chronicle events with categories and links |
| [`data/verify.json`](data/verify.json) | Six-state verification ledger |
| [`data/models.json`](data/models.json) | Frontier model registry |
| [`data/players.json`](data/players.json) | Player graph |
| [`data/glossary.json`](data/glossary.json) | Glossary |
| [`data/explain.json`](data/explain.json) / [`data/deep.json`](data/deep.json) | Node explanations and deep dives |
| [`data/index.json`](data/index.json) | Version, `asOf`, counts, license |

Every node also carries `nameEn` / `defEn`, and every topic carries `defEn`, so the skeleton is usable in English even though the evidence layer is primarily Chinese.

Every entity has a stable ID that can be cited:

```
ai-guru:chain/L1/gpu          # node: GPU & AI accelerators
ai-guru:chain/L1/gpu/infer    # sub-segment: inference cards
ai-guru:clue/基础模型/Claude    # clue: Claude
ai-guru:term/moe              # term: MoE
```

See [`CITATION.md`](CITATION.md) for citation formats and [`data/README.md`](data/README.md) for the data dictionary.

For agents: a zero-dependency MCP server is included at `tools/mcp/aiguru_mcp.py`. It exposes nodes, clues, events and verification state to Claude Desktop, Cursor and Cline. See [`tools/mcp/README.md`](tools/mcp/README.md).

For JS/TS: the `ai-industry-graph` npm package lives in [`packages/ai-industry-graph`](packages/ai-industry-graph).

```js
import { node, searchNodes, verification } from "ai-industry-graph";
const gpu = node("chain/L1/gpu");
```

## Quick start

```bash
git clone https://github.com/ai-guru-global/ai-guru-console.git
cd ai-guru-console

# 1) Open the static workbench (no build step, works over file://)
open console/index.html

# 2) Rebuild the embedded console data from the Markdown corpus
make console

# 3) Rebuild the machine-readable dataset and validate it
make dataset
```

Requirements: Python 3.10+ and Node 20+ (Node is used only to evaluate the curated `console/*.js` skeletons).

## How it is different

1. **Decomposition to the finest useful dimension** — a hand-curated 5-layer × 69-node skeleton; every node has a page and automatically aggregates the whole evidence base. Zero aggregation is shown as a collection gap, not hidden.
2. **Evidence separated from opinion** — facts live in clue timelines and the chronicle; opinions live in node cards and deep dives. The two are never mixed.
3. **A truth gate** — evidence enters only with an official first-party source plus at least two independent cross-checks; disputed items go to a public six-state verification ledger.
4. **Plain Markdown + git + zero-build static console** — human-readable, forkable, openable over `file://`, and consumable by tools.

## Contributing

The lowest-friction contribution is **fixing one number with one source**. See [`CONTRIBUTING.md`](CONTRIBUTING.md) and the [open-source plan](docs/2026-11-开源发布计划.md) (Chinese).

Contribution ladder: fix a typo → register a verification item → add a source → write a clue timeline → propose a node.

## License

- **Data and content**: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- **Code and tools**: [MIT](LICENSE)

Please attribute "AI GURU 工作台（ai-guru-console）" and share alike.