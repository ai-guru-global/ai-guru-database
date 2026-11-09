#!/usr/bin/env python3
"""生成「AI 行业分层目录树」：根目录 01..05 五层 → NN-节点目录 → 叶子学习页。

源与产物的关系（内容源不动，树是渲染产物，可重复再生）：
  - 骨架与拆解卡：console/chain.js（71 节点）
  - 六层解释：console/explain-l*.js
  - 深度结论：console/deep-l*.js
  - 叶子学习页：证据层/<主题>/<线索>.md（概述/分析/关键锚点提炼，不按时间线）

规则：
  - 节点 _index.md 每次重新生成（它是装配产物；手工增补请写进叶子或上游源）
  - 叶子学习页只在不存在时生成（--force 才覆盖）——落地后即手工维护
  - 叶子归属：按 chain keywords 对线索 name+topic+quote+body 的命中数取最高分节点
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONSOLE = ROOT / "console"
EVID = ROOT / "证据层"
LAYER_PREFIX = {"L1": "01", "L2": "02", "L3": "03", "L4": "04", "L5": "05"}

# 线索 → 节点 显式归属：跨领域卡的叶子落位由策展决定，不被关键词大节点吸走
OVERRIDES = {
    "GPU高速网络": "network",
    "平头哥": "asic",
    "云厂商自研芯片": "asic",
    "华为昇腾": "asic",
    "寒武纪": "asic",
    "摩尔线程": "asic",
    "HBM与先进存储": "memory",
    "台积电与先进制程": "fab",
    "AI数据中心与能源": "datacenter",
    "液冷与散热": "datacenter",
    "主权AI": "sovereign",
    "AI的IPO窗口": "funding",
    "智能体安全与攻防": "secops",
    "京北方": "delivery",
}

DUMP_JS = r"""
global.DB = {};
const fs = require('fs');
for (const f of ["chain.js","explain.js","deep.js"]) eval(fs.readFileSync('console/'+f,'utf8'));
for (let i=1;i<=5;i++){
  eval(fs.readFileSync('console/explain-l'+i+'.js','utf8'));
  eval(fs.readFileSync('console/deep-l'+i+'.js','utf8'));
}
const out = { layers: [], explain: DB.explain, deep: DB.deep };
for (const ly of DB.chain.layers) {
  out.layers.push({
    key: ly.key, name: ly.name, en: ly.en, desc: ly.desc,
    nodes: ly.nodes.map(n => ({
      id: n.id, name: n.name, def: n.def, keywords: n.keywords || [],
      upstream: n.upstream || [], downstream: n.downstream || [],
      maturity: n.maturity || "", why: n.why || "", moat: n.moat || "",
      bottleneck: n.bottleneck || "", signals: n.signals || [], sub: n.sub || []
    }))
  });
}
console.log(JSON.stringify(out));
"""


def load_sources() -> dict:
    r = subprocess.run(["node", "-e", DUMP_JS], cwd=ROOT, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit("node dump 失败：" + r.stderr[:500])
    return json.loads(r.stdout)


# ------------------------------------------------------------ 线索卡解析
FM = re.compile(r"^---\n(.*?)\n---\n", re.S)


def parse_clue(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    fm = {}
    m = FM.match(text)
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, _, v = line.partition(":")
                fm[k.strip()] = v.strip()
    body = text[m.end():] if m else text
    quote = ""
    for line in body.splitlines():
        if line.startswith("> "):
            quote = line[2:].strip()
            break
    # 分节
    secs = re.split(r"^## ", body, flags=re.M)
    overview, analysis, related = "", "", ""
    anchors, in_tl = [], True
    for sec in secs[1:]:
        title, _, content = sec.partition("\n")
        t = title.strip()
        if t == "概述":
            overview = content.strip()
        elif t == "分析":
            in_tl = False
            analysis = content.strip()
        elif t == "关联线索":
            related = content.strip()
    # 时间线条目（## 分析 之前的 - **日期** 行，按文档序即新→旧）
    for line in body.split("## 分析")[0].splitlines():
        mm = re.match(r"^- \*\*(\d{4}[^\*]*)\*\* · (.+)$", line.strip())
        if mm:
            anchors.append((mm.group(1).strip(), mm.group(2).strip()))
    rel_links = re.findall(r"\[\[([^\]]+)\]\]", related)
    return {
        "name": fm.get("线索", path.stem), "topic": fm.get("主题", path.parent.name),
        "status": fm.get("状态", ""), "updated": fm.get("更新", ""),
        "quote": quote, "overview": overview, "analysis": analysis,
        "anchors": anchors[:4], "rel": rel_links, "src": path,
    }


def best_node(clue: dict, nodes: list):
    """返回 (节点, 命中分)；无命中返回 (None, 0)——零分线索不强行挂载。"""
    hay = (clue["name"] + " " + clue["topic"] + " " + clue["quote"] + " " +
           clue["overview"] + " " + clue["analysis"]).lower()
    best, best_n = None, 0
    for n in nodes:
        score = sum(1 for k in n["keywords"] if k.lower() in hay)
        if score > best_n:
            best, best_n = n, score
    return best, best_n


# ------------------------------------------------------------ 页面装配
def node_dir_name(idx: int, node: dict) -> str:
    return f"{idx:02d}-{node['name']}"


def leaf_md(clue: dict, layer_dir: str, node_dir: str) -> str:
    src_rel = "../../../证据层/" + clue["src"].relative_to(EVID).as_posix()
    rel = "\n".join(
        f"- [{t}](../../../证据层/{t.split('/')[0]}/{t.split('/', 1)[1]}.md)" for t in clue["rel"]
    )
    anchors = "\n".join(
        f"- **{d}** · {t}" for d, t in clue["anchors"]
    ) or "（证据卡时间线待补）"
    analysis = clue["analysis"] or "（分析待沉淀——见证据卡）"
    overview = clue["overview"] or "（概述待补）"
    return f"""---
层: {layer_dir}
节点: {node_dir}
类型: 学习页
状态: {clue['status']}
更新: {clue['updated'] or '2026-11-03'}
证据: 证据层/{clue['src'].relative_to(EVID).as_posix()}
---

# {clue['name']}

> {clue['quote']}

## 是什么

{overview}

## 怎么看

{analysis}

## 关键锚点

{anchors}

## 下钻

- [证据时间线（原始线索卡）]({src_rel})
{rel}
"""


def node_index_md(layer, node, idx, leaves, node_path_of, sublib="") -> str:
    ex = EXPLAIN.get(node["id"]) or {}
    levels = dict((l[0], l[1]) for l in ex.get("levels", []))
    dp = DEEP.get(node["id"]) or {}
    verdict = dp.get("verdict", {})
    tam = (dp.get("market") or {}).get("tam", "")
    cur_ldir = f"{LAYER_PREFIX[layer['key']]}-{layer['name']}"

    def nlink(uid: str) -> str:
        t = node_path_of[uid]
        prefix = ".." if t["ldir"] == cur_ldir else "../.."
        return f"[{t['name']}]({prefix}/{t['ldir']}/{t['dir']}/_index.md)"

    ups = " · ".join(nlink(u) for u in node["upstream"] if u in node_path_of)
    downs = " · ".join(nlink(d) for d in node["downstream"] if d in node_path_of)
    subs = "\n".join(f"- **{s['name']}** — {s['def']}" for s in node["sub"])
    lf = "\n".join(f"- [{c['name']}]({c['name']}.md) — {c['status']}" for c in leaves) or "（叶子待挂）"
    sec6 = f"""
## 六层速览

{levels.get('一句话', node['def'])}

**打个比方**：{levels.get('打个比方', '—')}

**拆开看**：{levels.get('拆开看', '—')}

**怎么运转**：{levels.get('怎么运转', '—')}

**格局与博弈**：{levels.get('格局与博弈', '—')}

**边界与走向**：{levels.get('边界与走向', '—')}
""" if levels else ""
    verdict_md = ""
    if verdict:
        verdict_md = f"""
## 关键判断

{verdict.get('stance', '')}（置信度 {verdict.get('confidence', '—')}，展望 {verdict.get('horizon', '—')}）——{verdict.get('note', '')}
""" + (f"\n规模口径：{tam}\n" if tam else "")
    return f"""---
层: {layer['name']}（{layer['key']}）
节点: {node['name']}
成熟度: {node['maturity']}
更新: 2026-11-03
生成: tools/scripts/build_tree.py（源：console/chain.js · explain-l*.js · deep-l*.js · 证据层/）
---

# {node['name']}

> {node['def']}

## 拆解卡

- **价值来源**：{node['why']}
- **护城河**：{node['moat']}
- **瓶颈**：{node['bottleneck']}
- **领先指标**：{'；'.join(node['signals'])}
{sec6}{verdict_md}
## 二级细分

{subs or '—'}

## 本节点页面

{lf}
{sublib}
## 价值流

- 上游：{ups or '—'}
- 下游：{downs or '—'}
"""


def layer_index_md(layer, entries) -> str:
    rows = "\n".join(
        f"| [{n:02d} {e['node']['name']}]({e['dir']}/_index.md) | {e['node']['def']} | {len(e['leaves'])} |"
        for n, e in enumerate(entries, 1)
    )
    return f"""---
层: {layer['name']}（{layer['key']} · {layer['en']}）
更新: 2026-11-03
生成: tools/scripts/build_tree.py
---

# {layer['name']} · {layer['en']}

> {layer['desc']}

| 节点 | 一句话 | 叶子 |
|---|---|---|
{rows}

> 目录即课程：从上往下按序读是价值流方向（上游 → 下游）；每个节点目录里的 `_index.md` 是这一格的学习页，叶子是该节点的厂家与专题。
"""


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="覆盖已存在的叶子学习页")
    args = ap.parse_args()

    global EXPLAIN, DEEP
    src = load_sources()
    EXPLAIN, DEEP = src["explain"], src["deep"]

    clues = []
    for tdir in sorted(EVID.iterdir()):
        if not tdir.is_dir():
            continue
        for p in sorted(tdir.glob("*.md")):
            if p.name != "_index.md":
                clues.append(parse_clue(p))

    all_nodes = [(ly, n) for ly in src["layers"] for n in ly["nodes"]]
    flat = [n for _, n in all_nodes]
    node_path_of = {}
    for ly in src["layers"]:
        ldir = f"{LAYER_PREFIX[ly['key']]}-{ly['name']}"
        for i, n in enumerate(ly["nodes"], 1):
            node_path_of[n["id"]] = {"name": n["name"], "dir": node_dir_name(i, n), "ldir": ldir}

    # 线索 → 最佳节点：显式归属优先，其余按关键词一次性分配，零分不挂
    assign: dict = {}
    unassigned = []
    overridden = 0
    by_id = {n["id"]: n for n in flat}
    for c in clues:
        if c["name"] in OVERRIDES and OVERRIDES[c["name"]] in by_id:
            assign[c["src"]] = OVERRIDES[c["name"]]
            overridden += 1
            continue
        n, score = best_node(c, flat)
        if n:
            assign[c["src"]] = n["id"]
        else:
            unassigned.append(c["name"])

    n_leaf = 0
    for ly in src["layers"]:
        ldir = ROOT / f"{LAYER_PREFIX[ly['key']]}-{ly['name']}"
        entries = []
        for i, node in enumerate(ly["nodes"], 1):
            ndir_name = node_dir_name(i, node)
            ndir = ldir / ndir_name
            ndir.mkdir(parents=True, exist_ok=True)
            leaves = [c for c in clues if assign.get(c["src"]) == node["id"]]
            for c in leaves:
                fp = ndir / f"{c['name']}.md"
                if fp.exists() and not args.force:
                    continue
                fp.write_text(leaf_md(c, f"{LAYER_PREFIX[ly['key']]}-{ly['name']}", ndir_name), encoding="utf-8")
                n_leaf += 1
            sublib = ""
            if node["id"] == "network" and (ndir / "高网设计").is_dir():
                sublib = "\n## 深潜子库\n\n- [GPU高网设计知识库](./高网设计/README.md) — 知识点 59 / 厂家 18 / 角度 8\n- [高网行业拆解](./高网设计/行业拆解.md) — 深度拆解总览枢纽（市场/价值链/格局/路线/多空，17 篇展开）\n"
            (ndir / "_index.md").write_text(
                node_index_md(ly, node, i, leaves, node_path_of, sublib), encoding="utf-8")
            entries.append({"node": node, "dir": ndir_name, "leaves": leaves})
        (ldir / "_index.md").write_text(layer_index_md(ly, entries), encoding="utf-8")

    total_nodes = sum(len(ly["nodes"]) for ly in src["layers"])
    print(f"✓ 行业分层树已生成：5 层 / {total_nodes} 节点 / 新写叶子 {n_leaf} 张（已存在跳过）")
    if overridden:
        print(f"✓ 显式归属 {overridden} 张（OVERRIDES 表）")
    if unassigned:
        print(f"⚠ 零分未挂载线索 {len(unassigned)} 条：{'、'.join(unassigned)}")


if __name__ == "__main__":
    main()
