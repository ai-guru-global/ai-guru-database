#!/usr/bin/env python3
"""导出 AI GURU 工作台的机器可读数据集（Open Industry Graph）。

设计目标：
  - 与 console/data.js 同源：复用 build_console.py 的解析器，避免两套口径；
  - 稳定 ID：每个实体带 uid，可作为引用单元（见根目录 CITATION.md）；
  - 可校验：随包产出 JSON Schema；
  - 可复现：默认不写时间戳，asOf 由数据本身推导。

用法：
  python3 tools/scripts/build_dataset.py [--version 2026.10] [--out-dir data] [--check] [--stamp]

产出：
  data/chain.json       五层产业链 + 节点 + 技术栈视图
  data/topics.json      18 个主题域
  data/clues.json       线索（元数据 + 正文 + 分析）
  data/chronicle.json   年度大事记
  data/verify.json      六态待核实台账
  data/models.json      模型登记册
  data/players.json     玩家图谱
  data/glossary.json    术语库
  data/explain.json     节点六层解释 + 行业与企业版图
  data/deep.json        节点深度拆解
  data/index.json       版本 / asOf / 计数 / 许可证 / 引用格式
  schema/*.json         JSON Schema
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

THIS = Path(__file__).resolve()
ROOT = THIS.parents[2]
sys.path.insert(0, str(THIS.parent))

import build_console as bc  # noqa: E402

CONSOLE = ROOT / "console"
DEFAULT_OUT = ROOT / "data"
SCHEMA_OUT = ROOT / "schema"

CHAIN_JS = [CONSOLE / "chain.js"]
I18N_JS = [CONSOLE / "i18n-en.js"]
EXPLAIN_JS = [CONSOLE / "explain.js"] + [CONSOLE / f"explain-l{i}.js" for i in range(1, 6)]
DEEP_JS = [CONSOLE / "deep.js"] + [CONSOLE / f"deep-l{i}.js" for i in range(1, 6)]
SINGLE_JS = {
    "models": CONSOLE / "models.js",
    "players": CONSOLE / "players.js",
    "glossary": CONSOLE / "glossary.js",
}


# ---------------------------------------------------------------- 基础工具
def load_js(paths: list[Path], expr: str):
    """在 Node 里按浏览器语义串行 eval，取出 DB.<expr>。"""
    missing = [str(p) for p in paths if not p.exists()]
    if missing:
        raise SystemExit(f"缺少源文件：{', '.join(missing)}")
    script = (
        "const fs=require('fs');global.DB={};"
        "for(const p of process.argv.slice(1)){eval(fs.readFileSync(p,'utf8'))};"
        f"process.stdout.write(JSON.stringify(DB[{json.dumps(expr)}] ?? null));"
    )
    proc = subprocess.run(
        ["node", "-e", script, *map(str, paths)],
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        raise SystemExit(f"Node 解析失败（{expr}）：\n{proc.stderr.strip()}")
    data = json.loads(proc.stdout)
    if data is None:
        raise SystemExit(f"DB.{expr} 为空，检查脚本顺序")
    return data


def slugify(text: str) -> str:
    """ASCII slug；中文保留原字，避免把 ID 变成空串。"""
    text = text.strip().lower()
    text = re.sub(r"[^\w一-鿿]+", "-", text, flags=re.UNICODE)
    return text.strip("-") or "untitled"


def short_hash(*parts: str, n: int = 12) -> str:
    h = hashlib.sha1("\x1f".join(parts).encode("utf-8")).hexdigest()
    return h[:n]


def dump(path: Path, obj, *, pretty: bool = True) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if pretty:
        text = json.dumps(obj, ensure_ascii=False, indent=2, sort_keys=False)
    else:
        text = json.dumps(obj, ensure_ascii=False, separators=(",", ":"), sort_keys=False)
    path.write_text(text + "\n", encoding="utf-8")


# ---------------------------------------------------------------- 数据装配
def build_chain(i18n: dict) -> dict:
    chain = load_js(CHAIN_JS, "chain")
    node_total = 0
    sub_total = 0
    translations = i18n.get("nodes") or {}
    for layer in chain.get("layers", []):
        layer_key = layer.get("key", "")
        for node in layer.get("nodes", []):
            node_total += 1
            node["uid"] = f"chain/{layer_key}/{node['id']}"
            node["layer"] = layer_key
            node["layerName"] = layer.get("name", "")
            node["url"] = f"#/chain/{layer_key}/{node['id']}"
            tr = translations.get(node["id"]) or {}
            if tr.get("name"):
                node["nameEn"] = tr["name"]
            if tr.get("def"):
                node["defEn"] = tr["def"]
            for sub in node.get("sub", []) or []:
                sub_total += 1
                sub["uid"] = f"chain/{layer_key}/{node['id']}/{sub['id']}"
    chain["nodeCount"] = node_total
    chain["subNodeCount"] = sub_total
    chain["i18n"] = {
        "nodesTranslated": sum(1 for n in (node for layer in chain.get("layers", []) for node in layer.get("nodes", [])) if n.get("nameEn")),
        "topicsTranslated": len(i18n.get("topics") or {}),
    }
    return chain


def build_topics(topics: list[dict], clues: list[dict], i18n: dict) -> dict:
    items = []
    translations = i18n.get("topics") or {}
    for t in topics:
        ids = [c["id"] for c in clues if c["topic"] == t["key"]]
        tr = translations.get(t["key"]) or {}
        items.append({
            "uid": f"topic/{t['key']}",
            "key": t["key"],
            "name": t["key"],
            "en": t.get("en", ""),
            "def": t.get("def", ""),
            "defEn": tr.get("def", ""),
            "count": len(ids),
            "clues": ids,
            "url": f"#/topics/{t['key']}",
        })
    return {"count": len(items), "items": items}


def build_clues() -> list[dict]:
    topics = bc.parse_topics()
    clues: list[dict] = []
    for t in topics:
        tdir = ROOT / "证据层" / t["key"]
        if not tdir.is_dir():
            continue
        for p in sorted(tdir.glob("*.md")):
            if p.name == "_index.md":
                continue
            c = bc.parse_clue(p, t["key"])
            c["uid"] = f"clue/{c['id']}"
            c["url"] = f"#/clue/{c['topic']}/{c['name']}"
            clues.append(c)
    clues.sort(key=lambda c: (c["updated"], c["id"]), reverse=True)
    return clues


def build_chronicle() -> list[dict]:
    events = bc.parse_events()
    bc.classify_events(events)
    for e in events:
        e["uid"] = f"event/{e['date']}/{short_hash(e['date'], e['title'], e.get('url', ''))}"
    return events


def build_verify() -> list[dict]:
    items = bc.parse_verify()
    for v in items:
        v["uid"] = f"verify/{v['date'] or 'undated'}/{short_hash(v['title'], v.get('sec', ''))}"
    return items


def build_models() -> dict:
    models = load_js([SINGLE_JS["models"]], "models")
    for m in models:
        m["uid"] = f"model/{slugify(m.get('name', ''))}"
    return {"count": len(models), "items": models}


def build_players() -> dict:
    players = load_js([SINGLE_JS["players"]], "players")
    for p in players:
        p["uid"] = f"player/{slugify(p.get('name', ''))}"
    return {"count": len(players), "items": players}


def build_glossary() -> dict:
    g = load_js([SINGLE_JS["glossary"]], "glossary")
    for item in g.get("items", []):
        item["uid"] = f"term/{item.get('k', slugify(item.get('t', '')))}"
    return g


def build_explain() -> dict:
    data = load_js(EXPLAIN_JS, "explain")
    for node_id, entry in data.items():
        entry["uid"] = f"explain/{node_id}"
        entry["node"] = node_id
    return {"count": len(data), "items": data}


def build_deep() -> dict:
    data = load_js(DEEP_JS, "deep")
    for node_id, entry in data.items():
        entry["uid"] = f"deep/{node_id}"
        entry["node"] = node_id
    return {"count": len(data), "items": data}


def derive_as_of(clues: list[dict], events: list[dict]) -> str:
    dates = [c["updated"] for c in clues if c.get("updated")]
    dates += [e["date"] for e in events if len(e.get("date", "")) == 10]
    return max(dates) if dates else datetime.now().strftime("%Y-%m-%d")


# ---------------------------------------------------------------- Schema
SCHEMAS = {
    "chain.schema.json": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://ai-guru.global/schema/chain.schema.json",
        "title": "AI GURU Industry Chain",
        "type": "object",
        "required": ["layers", "nodeCount"],
        "properties": {
            "nodeCount": {"type": "integer"},
            "subNodeCount": {"type": "integer"},
            "i18n": {"type": "object"},
            "layers": {
                "type": "array",
                "items": {
                    "type": "object",
                    "required": ["key", "name", "nodes"],
                    "properties": {
                        "key": {"type": "string", "pattern": "^L[1-5]$"},
                        "name": {"type": "string"},
                        "en": {"type": "string"},
                        "desc": {"type": "string"},
                        "nodes": {"type": "array", "items": {"$ref": "#/$defs/node"}},
                    },
                },
            },
            "stack": {"type": "object"},
        },
        "$defs": {
            "node": {
                "type": "object",
                "required": ["uid", "id", "name", "def", "layer"],
                "properties": {
                    "uid": {"type": "string", "pattern": "^chain/L[1-5]/"},
                    "id": {"type": "string"},
                    "name": {"type": "string"},
                    "def": {"type": "string"},
                    "nameEn": {"type": "string"},
                    "defEn": {"type": "string"},
                    "layer": {"type": "string"},
                    "layerName": {"type": "string"},
                    "keywords": {"type": "array", "items": {"type": "string"}},
                    "upstream": {"type": "array", "items": {"type": "string"}},
                    "downstream": {"type": "array", "items": {"type": "string"}},
                    "maturity": {"type": "string"},
                    "why": {"type": "string"},
                    "moat": {"type": "string"},
                    "bottleneck": {"type": "string"},
                    "signals": {"type": "array", "items": {"type": "string"}},
                    "url": {"type": "string"},
                    "sub": {"type": "array", "items": {"type": "object"}},
                },
            }
        },
    },
    "clue.schema.json": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://ai-guru.global/schema/clue.schema.json",
        "title": "AI GURU Clue",
        "type": "object",
        "required": ["uid", "id", "topic", "name", "updated", "body"],
        "properties": {
            "uid": {"type": "string", "pattern": "^clue/"},
            "id": {"type": "string"},
            "topic": {"type": "string"},
            "name": {"type": "string"},
            "alias": {"type": "array", "items": {"type": "string"}},
            "status": {"type": "string"},
            "created": {"type": "string"},
            "updated": {"type": "string"},
            "roles": {"type": "array", "items": {"type": "string"}},
            "quote": {"type": "string"},
            "body": {"type": "string"},
            "analysis": {"type": "string"},
            "nAnalysis": {"type": "integer"},
            "nEvents": {"type": "integer"},
            "lastEvent": {"type": "string"},
            "months": {"type": "integer"},
            "verified": {"type": "integer"},
            "pending": {"type": "integer"},
            "related": {"type": "array", "items": {"type": "string"}},
            "url": {"type": "string"},
            "src": {"type": "string"},
        },
    },
    "chronicle.schema.json": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://ai-guru.global/schema/chronicle.schema.json",
        "title": "AI GURU Chronicle Event",
        "type": "object",
        "required": ["uid", "date", "title"],
        "properties": {
            "uid": {"type": "string", "pattern": "^event/"},
            "date": {"type": "string", "pattern": r"^\d{4}-\d{2}(-\d{2})?$"},
            "title": {"type": "string"},
            "url": {"type": "string"},
            "summary": {"type": "string"},
            "links": {"type": "array", "items": {"type": "string"}},
            "year": {"type": "string"},
            "cat": {"type": "string"},
            "cats": {"type": "array", "items": {"type": "string"}},
            "meta": {"type": "object"},
        },
    },
    "verify.schema.json": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://ai-guru.global/schema/verify.schema.json",
        "title": "AI GURU Verification Item",
        "type": "object",
        "required": ["uid", "title", "status"],
        "properties": {
            "uid": {"type": "string", "pattern": "^verify/"},
            "sec": {"type": "string"},
            "title": {"type": "string"},
            "status": {"enum": ["✅", "⚠️", "❓", "🔍", "✗", "E", ""]},
            "date": {"type": "string"},
            "lines": {"type": "array"},
            "into": {"type": "array", "items": {"type": "string"}},
        },
    },
    "dataset.schema.json": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://ai-guru.global/schema/dataset.schema.json",
        "title": "AI GURU Dataset Manifest",
        "type": "object",
        "required": ["name", "version", "asOf", "license", "counts"],
        "properties": {
            "name": {"type": "string"},
            "nameZh": {"type": "string"},
            "version": {"type": "string"},
            "asOf": {"type": "string", "pattern": r"^\d{4}-\d{2}-\d{2}$"},
            "license": {"type": "object"},
            "citation": {"type": "string"},
            "counts": {"type": "object"},
            "files": {"type": "object"},
        },
    },
}


# ---------------------------------------------------------------- 主流程
def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--version", default="", help="数据集版本，默认按 asOf 推导为 YYYY.MM")
    ap.add_argument("--out-dir", default=str(DEFAULT_OUT), help="输出目录，默认 data/")
    ap.add_argument("--check", action="store_true", help="只解析并打印统计，不写盘")
    ap.add_argument("--stamp", action="store_true", help="在 index.json 写入 generatedAt")
    args = ap.parse_args()

    i18n = load_js(I18N_JS, "i18nEn")
    chain = build_chain(i18n)
    clues = build_clues()
    topics = build_topics(bc.parse_topics(), clues, i18n)
    events = build_chronicle()
    verify = build_verify()
    models = build_models()
    players = build_players()
    glossary = build_glossary()
    explain = build_explain()
    deep = build_deep()

    as_of = derive_as_of(clues, events)
    version = args.version or as_of[:7].replace("-", ".")

    counts = {
        "layers": len(chain.get("layers", [])),
        "nodes": chain["nodeCount"],
        "subNodes": chain["subNodeCount"],
        "topics": topics["count"],
        "clues": len(clues),
        "events": len(events),
        "verify": len(verify),
        "models": models["count"],
        "players": players["count"],
        "terms": len(glossary.get("items", [])),
        "explainNodes": explain["count"],
        "deepNodes": deep["count"],
    }

    index = {
        "name": "AI GURU Industry Graph",
        "nameZh": "AI GURU 工作台 · AI 行业坐标系",
        "version": version,
        "asOf": as_of,
        "license": {
            "data": "CC BY-SA 4.0",
            "code": "MIT",
            "attribution": "AI GURU 工作台（ai-guru-console）",
        },
        "citation": f"AI GURU 工作台（ai-guru-console），{version}，ai-guru:chain/L1/gpu",
        "counts": counts,
        "files": {
            "chain": "chain.json",
            "topics": "topics.json",
            "clues": "clues.json",
            "chronicle": "chronicle.json",
            "verify": "verify.json",
            "models": "models.json",
            "players": "players.json",
            "glossary": "glossary.json",
            "explain": "explain.json",
            "deep": "deep.json",
        },
    }
    if args.stamp:
        index["generatedAt"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    print(
        f"版本 {version} / asOf {as_of}："
        f"{counts['layers']} 层 {counts['nodes']} 节点（{counts['subNodes']} 细分）/ "
        f"{counts['topics']} 主题 / {counts['clues']} 线索 / {counts['events']} 大事 / "
        f"{counts['verify']} 待核实 / {counts['models']} 模型 / {counts['players']} 玩家 / "
        f"{counts['terms']} 术语 / {counts['explainNodes']} 解释 / {counts['deepNodes']} 深拆"
    )

    if args.check:
        print("✓ check 通过（未写盘）")
        return

    out = Path(args.out_dir).resolve()
    dump(out / "chain.json", chain)
    dump(out / "topics.json", topics)
    dump(out / "clues.json", {"count": len(clues), "items": clues}, pretty=False)
    dump(out / "chronicle.json", {"count": len(events), "items": events}, pretty=False)
    dump(out / "verify.json", {"count": len(verify), "items": verify}, pretty=False)
    dump(out / "models.json", models)
    dump(out / "players.json", players)
    dump(out / "glossary.json", glossary)
    dump(out / "explain.json", explain, pretty=False)
    dump(out / "deep.json", deep, pretty=False)
    dump(out / "index.json", index)

    for name, schema in SCHEMAS.items():
        dump(SCHEMA_OUT / name, schema)

    total = sum(p.stat().st_size for p in out.glob("*.json"))
    print(f"✓ data/*.json 已生成（{total / 1024:.0f} KB，{len(list(out.glob('*.json')))} 个文件）")
    print(f"✓ schema/*.json 已生成（{len(SCHEMAS)} 个文件）")


if __name__ == "__main__":
    main()