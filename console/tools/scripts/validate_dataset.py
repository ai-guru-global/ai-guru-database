#!/usr/bin/env python3
"""校验 data/ 数据集：唯一 ID、引用完整性、清单计数与 Schema 基本形状。

用法：
  python3 tools/scripts/validate_dataset.py [--strict]

退出码 1 表示有错误；warnings 默认不阻断（--strict 时阻断）。
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
SCHEMA = ROOT / "schema"


def load(name: str):
    path = DATA / name
    if not path.exists():
        raise SystemExit(f"缺少 {path.relative_to(ROOT)}，先运行 make dataset")
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--strict", action="store_true", help="warnings 也按错误处理")
    args = ap.parse_args()

    errors: list[str] = []
    warnings: list[str] = []

    index = load("index.json")
    chain = load("chain.json")
    topics = load("topics.json")
    clues = load("clues.json")
    chronicle = load("chronicle.json")
    verify = load("verify.json")
    models = load("models.json")
    players = load("players.json")
    glossary = load("glossary.json")
    explain = load("explain.json")
    deep = load("deep.json")

    # ---- 唯一 ID
    def uniq(items: list[dict], label: str) -> None:
        c = Counter(x.get("uid") for x in items)
        dup = [k for k, n in c.items() if n > 1]
        empty = [x for x in items if not x.get("uid")]
        if dup:
            errors.append(f"{label}: uid 重复 {dup[:5]}")
        if empty:
            errors.append(f"{label}: {len(empty)} 条缺 uid")

    node_items: list[dict] = []
    sub_items: list[dict] = []
    for layer in chain.get("layers", []):
        for node in layer.get("nodes", []):
            node_items.append(node)
            sub_items.extend(node.get("sub", []) or [])
    uniq(node_items, "chain.nodes")
    uniq(sub_items, "chain.subNodes")
    uniq(clues["items"], "clues")
    uniq(chronicle["items"], "chronicle")
    uniq(verify["items"], "verify")
    uniq(models["items"], "models")
    uniq(players["items"], "players")
    uniq(glossary.get("items", []), "glossary")

    # ---- 引用完整性
    node_ids = {n["id"] for n in node_items}
    clue_ids = {c["id"] for c in clues["items"]}
    # 双链允许指向主题、年度大事记等非线索目标；只对「看起来像线索」的悬空引用告警
    topic_ids = {t["key"] for t in topics["items"]}
    soft_targets = topic_ids | {"_2025大事记", "_2026大事记"}

    bad_edges: list[str] = []
    for n in node_items:
        for direction in ("upstream", "downstream"):
            for target in n.get(direction, []) or []:
                if target not in node_ids:
                    bad_edges.append(f"{n['uid']}.{direction} → {target}")
    if bad_edges:
        warnings.append(f"链边指向不存在的节点 {len(bad_edges)} 处：{bad_edges[:8]}")

    missing_en = [n["uid"] for n in node_items if not n.get("nameEn") or not n.get("defEn")]
    if missing_en:
        warnings.append(f"{len(missing_en)} 个节点缺英文 nameEn/defEn：{missing_en[:8]}")
    missing_topic_en = [t["uid"] for t in topics["items"] if not t.get("defEn")]
    if missing_topic_en:
        warnings.append(f"{len(missing_topic_en)} 个主题缺英文 defEn：{missing_topic_en[:8]}")

    bad_topic_clues: list[str] = []
    for t in topics["items"]:
        for cid in t.get("clues", []):
            if cid not in clue_ids:
                bad_topic_clues.append(f"{t['uid']} → {cid}")
        if t.get("count") != len(t.get("clues", [])):
            errors.append(f"{t['uid']}: count={t.get('count')} 但 clues={len(t.get('clues', []))}")
    if bad_topic_clues:
        errors.append(f"主题引用了不存在的线索：{bad_topic_clues[:8]}")
    topic_total = sum(t.get("count", 0) for t in topics["items"])
    if topic_total != len(clues["items"]):
        errors.append(f"主题线索计数合计 {topic_total} ≠ 线索总数 {len(clues['items'])}")

    bad_related: list[str] = []
    for c in clues["items"]:
        for rel in c.get("related", []) or []:
            if rel not in clue_ids and rel not in soft_targets:
                bad_related.append(f"{c['uid']} → {rel}")
    if bad_related:
        warnings.append(f"线索关联指向不存在的线索 {len(bad_related)} 处：{bad_related[:8]}")

    bad_event_links: list[str] = []
    for e in chronicle["items"]:
        for link in e.get("links", []) or []:
            if link not in clue_ids and link not in soft_targets:
                bad_event_links.append(f"{e['uid']} → {link}")
    if bad_event_links:
        warnings.append(f"事件链接指向不存在的线索 {len(bad_event_links)} 处：{bad_event_links[:8]}")

    bad_verify_into: list[str] = []
    for v in verify["items"]:
        for link in v.get("into", []) or []:
            if link not in clue_ids and link not in soft_targets:
                bad_verify_into.append(f"{v['uid']} → {link}")
    if bad_verify_into:
        warnings.append(f"核验入链指向不存在的线索 {len(bad_verify_into)} 处：{bad_verify_into[:8]}")

    explain_keys = set(explain["items"].keys())
    deep_keys = set(deep["items"].keys())
    if explain_keys - node_ids:
        warnings.append(f"explain 有 {len(explain_keys - node_ids)} 个键不在 chain 节点内：{sorted(explain_keys - node_ids)[:8]}")
    if deep_keys - node_ids:
        warnings.append(f"deep 有 {len(deep_keys - node_ids)} 个键不在 chain 节点内：{sorted(deep_keys - node_ids)[:8]}")
    if node_ids - explain_keys:
        warnings.append(f"{len(node_ids - explain_keys)} 个节点没有 explain 条目")
    if node_ids - deep_keys:
        warnings.append(f"{len(node_ids - deep_keys)} 个节点没有 deep 条目")

    # ---- 清单计数
    actual = {
        "layers": len(chain.get("layers", [])),
        "nodes": len(node_items),
        "subNodes": len(sub_items),
        "topics": topics["count"],
        "clues": clues["count"],
        "events": chronicle["count"],
        "verify": verify["count"],
        "models": models["count"],
        "players": players["count"],
        "terms": len(glossary.get("items", [])),
        "explainNodes": explain["count"],
        "deepNodes": deep["count"],
    }
    for key, value in actual.items():
        got = index.get("counts", {}).get(key)
        if got != value:
            errors.append(f"index.counts.{key} = {got}，实际 {value}")

    # ---- Schema 形状（不依赖第三方库）
    required = {
        "chain.schema.json": ["layers", "nodeCount"],
        "clue.schema.json": ["uid", "id", "topic", "name", "updated", "body"],
        "chronicle.schema.json": ["uid", "date", "title"],
        "verify.schema.json": ["uid", "title", "status"],
        "dataset.schema.json": ["name", "version", "asOf", "license", "counts"],
    }
    for name, fields in required.items():
        path = SCHEMA / name
        if not path.exists():
            errors.append(f"缺少 schema/{name}")
            continue
        try:
            schema = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            errors.append(f"schema/{name} JSON 解析失败：{exc}")
            continue
        if schema.get("type") != "object":
            errors.append(f"schema/{name} 顶层 type 不是 object")
        for field in fields:
            if field not in schema.get("required", []):
                errors.append(f"schema/{name} 缺少 required 字段 {field}")

    # ---- 输出
    print(
        f"数据集 v{index.get('version')}（asOf {index.get('asOf')}）："
        f"{actual['layers']} 层 / {actual['nodes']} 节点 / {actual['subNodes']} 细分 / "
        f"{actual['clues']} 线索 / {actual['events']} 大事 / {actual['verify']} 待核实"
    )
    for w in warnings:
        print(f"  ⚠️ {w}")
    if errors:
        print(f"✗ 校验失败，{len(errors)} 个错误：")
        for e in errors:
            print(f"  - {e}")
        return 1
    if warnings and args.strict:
        print(f"✗ --strict：{len(warnings)} 个 warning 按错误处理")
        return 1
    print(f"✓ 数据集校验通过（{len(warnings)} 个 warning）")
    return 0


if __name__ == "__main__":
    sys.exit(main())