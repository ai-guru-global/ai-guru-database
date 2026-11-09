#!/usr/bin/env python3
"""从 data/ 生成可抓取的静态站点（节点页 / 主题页 / 大事记 / sitemap / JSON-LD）。

为什么单独做一层：
  console 是哈希路由的单页应用，爬虫只看到一个 URL；本脚本把 69 个节点、18 个主题
  与大事记预渲染成独立静态页，作为“可被发现”的公开层。交互仍回 console。

产出（默认 site/）：
  index.html                          首页：统计 + 五层 + 主题
  nodes/<layer>/<node>/index.html     节点页（拆解卡 / 六层解释 / 深度拆解 / 证据）
  topics/<topic>/index.html           主题页（线索列表）
  chronicle.html                      大事记
  console/                            交互式工作台副本（file:// 与 Pages 均可用）
  style.css / sitemap.xml / robots.txt / 404.html

用法：
  python3 tools/scripts/build_pages.py [--site-url https://.../] [--out-dir site]
"""

from __future__ import annotations

import argparse
import html
import json
import re
import shutil
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
CONSOLE = ROOT / "console"
REPO_URL = "https://github.com/ai-guru-global/ai-guru-console"
DEFAULT_SITE_URL = "https://ai-guru-global.github.io/ai-guru-console/"


def load(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def esc(s) -> str:
    return html.escape(str(s if s is not None else ""), quote=True)


def rel(depth: int) -> str:
    return "../" * depth


def url_for(site_url: str, path: str) -> str:
    return site_url.rstrip("/") + "/" + path.lstrip("/")


def page(title: str, description: str, body: str, *, depth: int, canonical: str,
         jsonld: dict | None = None) -> str:
    r = rel(depth)
    ld = ""
    if jsonld:
        ld = '<script type="application/ld+json">' + json.dumps(
            jsonld, ensure_ascii=False, separators=(",", ":")
        ).replace("</", "<\\/") + "</script>\n"
    return f"""<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(description)}">
<link rel="canonical" href="{esc(canonical)}">
<link rel="stylesheet" href="{r}style.css">
{ld}</head>
<body>
<header class="site-header">
  <a class="brand" href="{r}index.html">AI GURU <span>Industry Graph</span></a>
  <nav>
    <a href="{r}index.html#layers">产业链</a>
    <a href="{r}index.html#topics">主题</a>
    <a href="{r}chronicle.html">大事记</a>
    <a href="{r}console/index.html">工作台</a>
    <a href="{REPO_URL}">GitHub</a>
  </nav>
</header>
<main>
{body}
</main>
<footer class="site-footer">
  <p>AI GURU 工作台（ai-guru-console）· 数据 CC BY-SA 4.0 · 代码 MIT</p>
  <p>引用格式见 <a href="{REPO_URL}/blob/main/CITATION.md">CITATION.md</a> · 数据集版本见 <a href="{r}data/index.json">data/index.json</a></p>
</footer>
</body>
</html>
"""


# ---------------------------------------------------------------- 通用片段
def kv_table(items: list[tuple[str, str]], headers=("字段", "内容")) -> str:
    rows = "".join(
        f"<tr><th>{esc(k)}</th><td>{esc(v)}</td></tr>" for k, v in items if v
    )
    if not rows:
        return ""
    return f'<table class="kv"><thead><tr><th>{esc(headers[0])}</th><th>{esc(headers[1])}</th></tr></thead><tbody>{rows}</tbody></table>'


def list_table(headers: list[str], rows: list[list[str]]) -> str:
    if not rows:
        return ""
    head = "".join(f"<th>{esc(h)}</th>" for h in headers)
    body = "".join(
        "<tr>" + "".join(f"<td>{esc(c)}</td>" for c in row) + "</tr>" for row in rows
    )
    return f'<table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>'


def section(title: str, content: str, anchor: str = "") -> str:
    if not content.strip():
        return ""
    aid = f' id="{esc(anchor)}"' if anchor else ""
    return f'<section{aid}><h2>{esc(title)}</h2>{content}</section>'


# ---------------------------------------------------------------- 首页
def build_index(chain: dict, topics: dict, clues: dict, chronicle: dict,
                verify: dict, explain: dict, deep: dict, site_url: str) -> str:
    counts = {
        "nodes": chain["nodeCount"],
        "subNodes": chain["subNodeCount"],
        "topics": topics["count"],
        "clues": clues["count"],
        "events": chronicle["count"],
        "verify": verify["count"],
        "terms": 0,
    }
    layer_cards = []
    for layer in chain["layers"]:
        nodes = "".join(
            f'<li><a href="nodes/{quote(layer["key"])}/{quote(n["id"])}/index.html" title="{esc(n.get("nameEn", ""))}">{esc(n["name"])}</a></li>'
            for n in layer["nodes"]
        )
        layer_cards.append(
            f'<article class="layer"><h3><span class="tag">{esc(layer["key"])}</span> {esc(layer["name"])}</h3>'
            f'<p class="en">{esc(layer.get("en", ""))}</p><p>{esc(layer.get("desc", ""))}</p>'
            f'<ul class="node-list">{nodes}</ul></article>'
        )
    topic_cards = "".join(
        f'<li><a href="topics/{quote(t["key"])}/index.html">{esc(t["name"])}</a>'
        f'<span class="dim">{t["count"]} 条线索</span></li>'
        for t in topics["items"]
    )
    body = f"""
<div class="hero">
  <p class="kicker">AI Industry Anatomy · Layer by Layer</p>
  <h1>用最细的维度，<br>一层层拆解 AI 全行业。</h1>
  <p class="lead">不是又一个 AI 新闻站，而是一张可被引用、可被机器消费、可被社区修订的 AI 产业结构图。</p>
  <p class="stats"><b>{counts["nodes"]}</b> 节点 · <b>{counts["subNodes"]}</b> 细分 · <b>{counts["topics"]}</b> 主题 · <b>{counts["clues"]}</b> 线索 · <b>{counts["events"]}</b> 大事</p>
  <p class="cta"><a class="btn" href="console/index.html">打开交互工作台</a>
  <a class="btn ghost" href="data/chain.json">下载 chain.json</a></p>
</div>
<section id="layers"><h2>五层产业链</h2><div class="layers">{"".join(layer_cards)}</div></section>
<section id="topics"><h2>18 个横向主题域</h2><ul class="topics">{topic_cards}</ul></section>
<section id="data"><h2>机器可读数据</h2>
<p>每个实体带稳定 ID（如 <code>ai-guru:chain/L1/gpu</code>）。数据文件：</p>
<ul class="files">
<li><a href="data/chain.json">chain.json</a> — 五层产业链与节点骨架</li>
<li><a href="data/clues.json">clues.json</a> — 线索时间线</li>
<li><a href="data/chronicle.json">chronicle.json</a> — 年度大事记</li>
<li><a href="data/verify.json">verify.json</a> — 六态核验台账</li>
<li><a href="data/index.json">index.json</a> — 版本、asOf、计数、许可证</li>
</ul></section>
"""
    jsonld = {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": "AI GURU Industry Graph",
        "description": "A machine-readable map of the AI industry: 5 value-chain layers, 69 nodes, 18 topics, clue timelines and a six-state verification ledger.",
        "url": url_for(site_url, "index.html"),
        "license": "https://creativecommons.org/licenses/by-sa/4.0/",
        "creator": {"@type": "Organization", "name": "AI GURU Console", "url": REPO_URL},
        "variableMeasured": ["industry structure", "evidence", "verification"],
    }
    return page(
        "AI GURU Industry Graph · AI 行业开源坐标系",
        "用最细的维度一层层拆解 AI 全行业：五层产业链、69 个节点、18 个主题域、线索时间线与六态核验台账。",
        body, depth=0, canonical=url_for(site_url, "index.html"), jsonld=jsonld,
    )


# ---------------------------------------------------------------- 节点页
def match_evidence(node: dict, clue_items: list[dict], event_items: list[dict]):
    kws = [k.lower() for k in node.get("keywords", []) if k]
    if not kws:
        return [], []
    clues = []
    for c in clue_items:
        hay = " ".join([c.get("name", ""), c.get("quote", ""), c.get("body", "")]).lower()
        if any(k in hay for k in kws):
            clues.append(c)
    events = []
    for e in event_items:
        hay = (e.get("title", "") + " " + e.get("summary", "")).lower()
        if any(k in hay for k in kws):
            events.append(e)
    clues.sort(key=lambda c: (c.get("nEvents", 0), c.get("updated", "")), reverse=True)
    events.sort(key=lambda e: e.get("date", ""), reverse=True)
    return clues, events


def build_node(node: dict, layer: dict, chain: dict, explain: dict, deep: dict,
               clue_items: list[dict], event_items: list[dict], site_url: str,
               version: str) -> str:
    node_id = node["id"]
    path = f"nodes/{layer['key']}/{node_id}/index.html"
    ex = explain.get("items", {}).get(node_id) or {}
    dp = deep.get("items", {}).get(node_id) or {}

    # 拆解卡
    card = kv_table([
        ("成熟度", node.get("maturity", "")),
        ("价值来源", node.get("why", "")),
        ("护城河", node.get("moat", "")),
        ("瓶颈", node.get("bottleneck", "")),
        ("领先指标", "；".join(node.get("signals", []) or [])),
    ])

    # 六层解释
    levels = ex.get("levels") or []
    levels_html = ""
    if levels:
        levels_html = "".join(
            f'<div class="level"><h3>{esc(label)}</h3><p>{esc(text)}</p></div>'
            for label, text in levels
        )

    # 行业与企业版图
    industries_html = ""
    for ind in ex.get("industries") or []:
        comps = ind.get("companies") or []
        rows = [[c.get("name", ""), c.get("role", ""), c.get("products", ""),
                 c.get("tech", ""), c.get("scenes", "")] for c in comps]
        industries_html += (
            f'<div class="industry"><h3>{esc(ind.get("name", ""))}</h3>'
            f'<p>{esc(ind.get("desc", ""))}</p>'
            + list_table(["公司", "角色", "产品", "技术", "场景"], rows)
            + "</div>"
        )

    # 深度拆解
    deep_html = ""
    if dp:
        market = dp.get("market") or {}
        market_rows = [
            ("TAM", market.get("tam", "")), ("SAM", market.get("sam", "")),
            ("SOM", market.get("som", "")), ("CAGR", market.get("cagr", "")),
            ("渗透率", market.get("pen", "")), ("需求", market.get("demand", "")),
            ("预算", market.get("budget", "")),
        ]
        chain_rows = dp.get("chain") or []
        landscape = dp.get("landscape") or {}
        shares = landscape.get("shares") or []
        forces = dp.get("forces") or []
        econ = dp.get("economics") or {}
        tech = dp.get("tech") or {}
        policy = dp.get("policy") or {}
        thesis = dp.get("thesis") or {}
        verdict = dp.get("verdict") or {}
        deep_html = (
            (f'<p class="boundary">{esc(dp.get("boundary", ""))}</p>' if dp.get("boundary") else "")
            + f'<h3>市场与需求</h3>' + kv_table(market_rows)
            + (f'<h3>价值链与利润池</h3>' + list_table(["环节", "代表玩家", "毛利带", "议价力", "价值占比"], chain_rows) if chain_rows else "")
            + f'<h3>竞争格局</h3>' + kv_table([
                ("结构", landscape.get("structure", "")),
                ("集中度", landscape.get("cr", "")),
                ("竞争基础", landscape.get("basis", "")),
            ])
            + (list_table(["玩家 / 阵营", "份额带", "备注"], shares) if shares else "")
            + (f'<h3>五力与壁垒</h3>' + list_table(["力量", "强度", "判断"], forces) if forces else "")
            + f'<h3>成本与单位经济</h3>' + kv_table([
                ("成本", econ.get("cost", "")), ("曲线", econ.get("curve", "")), ("价格", econ.get("price", "")),
            ])
            + f'<h3>技术与路线</h3>' + kv_table([
                ("代际", tech.get("gen", "")), ("阶段", tech.get("stage", "")), ("拐点", tech.get("inflection", "")),
            ])
            + f'<h3>政策与地缘</h3>' + kv_table([
                ("立场", policy.get("stance", "")), ("风险", policy.get("risk", "")), ("地缘", policy.get("geo", "")),
            ])
            + f'<h3>多空与证伪</h3>' + kv_table([
                ("多", thesis.get("bull", "")), ("空", thesis.get("bear", "")), ("证伪条件", thesis.get("falsify", "")),
            ])
            + f'<h3>结论</h3>' + kv_table([
                ("判断", verdict.get("stance", "")), ("置信度", verdict.get("confidence", "")),
                ("期限", verdict.get("horizon", "")), ("备注", verdict.get("note", "")),
            ])
        )

    # 证据
    clues, events = match_evidence(node, clue_items, event_items)
    clue_rows = [[c["name"], c["topic"], str(c.get("nEvents", 0)), c.get("lastEvent", ""),
                  c.get("updated", "")] for c in clues[:12]]
    event_rows = [[e.get("date", ""), e.get("title", ""), e.get("cat", "")] for e in events[:8]]
    evidence_html = (
        f'<p class="dim">关键词聚合（近似口径）：{len(clues)} 条线索、{len(events)} 条大事与本节相关。</p>'
        + list_table(["线索", "主题", "条目", "最近事件", "更新"], clue_rows)
        + list_table(["日期", "事件", "类型"], event_rows)
    )

    # 关联节点
    node_by_id = {n["id"]: n for lay in chain["layers"] for n in lay["nodes"]}
    rel_links = []
    for direction, label in (("upstream", "上游"), ("downstream", "下游")):
        for target in node.get(direction, []) or []:
            t = node_by_id.get(target)
            if t:
                ter = next((lay["key"] for lay in chain["layers"] if t in lay["nodes"]), "")
                rel_links.append(
                    f'<li>{label}：<a href="../../{quote(ter)}/{quote(target)}/index.html">{esc(t["name"])}</a></li>'
                )
    related_html = f'<ul class="related">{"".join(rel_links)}</ul>' if rel_links else ""

    body = f"""
<nav class="crumbs"><a href="{rel(3)}index.html">产业链</a> / <a href="{rel(3)}index.html#layers">{esc(layer["key"])} {esc(layer["name"])}</a> / {esc(node["name"])}</nav>
<article class="node">
  <p class="kicker">{esc(layer["key"])} · {esc(layer.get("en", ""))}</p>
  <h1>{esc(node["name"])}</h1>
  {('<p class="en-name">' + esc(node["nameEn"]) + '</p>') if node.get("nameEn") else ''}
  <p class="lead">{esc(node.get("def", ""))}</p>
  {('<p class="lead-en">' + esc(node["defEn"]) + '</p>') if node.get("defEn") else ''}
  <p class="badges"><span class="badge">{esc(node.get("maturity", ""))}</span>
  <span class="badge ghost">ai-guru:{esc(node["uid"])}</span></p>
  <p class="cta"><a class="btn" href="{rel(3)}console/index.html#/chain/{quote(layer['key'])}/{quote(node_id)}">在拆解台中打开</a>
  <a class="btn ghost" href="{REPO_URL}/blob/main/console/chain.js">查看源文件</a></p>
  {section("拆解卡", card, "card")}
  {section("六层解释", levels_html, "explain")}
  {section("行业与企业版图", industries_html, "industries")}
  {section("深度拆解", deep_html, "deep")}
  {section("证据", evidence_html, "evidence")}
  {section("关联节点", related_html, "related")}
  <p class="citation">引用：AI GURU 工作台（ai-guru-console），<code>ai-guru:{esc(node["uid"])}</code>，{esc(version)}。</p>
</article>
"""
    jsonld = {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "name": node["name"],
        "alternateName": node.get("nameEn", ""),
        "description": node.get("def", ""),
        "termCode": node["uid"],
        "url": url_for(site_url, path),
        "inDefinedTermSet": {
            "@type": "DefinedTermSet",
            "name": "AI GURU Industry Graph",
            "url": url_for(site_url, "index.html"),
        },
    }
    return page(
        f'{node["name"]} · AI GURU Industry Graph',
        node.get("def", "")[:160],
        body, depth=3, canonical=url_for(site_url, path), jsonld=jsonld,
    )


# ---------------------------------------------------------------- 主题页
def build_topic(topic: dict, clue_items: list[dict], site_url: str) -> str:
    path = f"topics/{topic['key']}/index.html"
    rows = []
    for cid in topic.get("clues", []):
        c = next((x for x in clue_items if x["id"] == cid), None)
        if not c:
            continue
        rows.append([
            c["name"], c.get("status", ""), str(c.get("nEvents", 0)),
            c.get("lastEvent", ""), c.get("updated", ""),
        ])
    body = f"""
<nav class="crumbs"><a href="{rel(2)}index.html">主题</a> / {esc(topic["name"])}</nav>
<article class="topic">
  <p class="kicker">{esc(topic.get("en", ""))}</p>
  <h1>{esc(topic["name"])}</h1>
  <p class="en-name">{esc(topic.get("en", ""))}</p>
  <p class="lead">{esc(topic.get("def", ""))}</p>
  {('<p class="lead-en">' + esc(topic["defEn"]) + '</p>') if topic.get("defEn") else ''}
  <p class="badges"><span class="badge">{topic["count"]} 条线索</span>
  <span class="badge ghost">ai-guru:{esc(topic["uid"])}</span></p>
  <h2>线索</h2>
  {list_table(["线索", "状态", "条目", "最近事件", "更新"], rows)}
</article>
"""
    return page(
        f'{topic["name"]} · AI GURU Industry Graph',
        topic.get("def", "")[:160],
        body, depth=2, canonical=url_for(site_url, path),
    )


# ---------------------------------------------------------------- 大事记
def build_chronicle(events: list[dict], site_url: str) -> str:
    rows = "".join(
        f'<li><span class="date">{esc(e.get("date", ""))}</span>'
        f'<a href="{esc(e.get("url") or REPO_URL)}">{esc(e.get("title", ""))}</a>'
        f'<span class="cat">{esc(e.get("cat", ""))}</span>'
        f'<p>{esc(e.get("summary", ""))}</p></li>'
        for e in events
    )
    body = f"""
<nav class="crumbs"><a href="index.html">首页</a> / 大事记</nav>
<article>
<h1>年度大事记</h1>
<p class="lead">按官方一手源 + 至少两家独立媒体交叉印证收录；存疑事件进入六态核验台账，不在此处冒充事实。</p>
<ol class="chronicle">{rows}</ol>
</article>
"""
    return page(
        "年度大事记 · AI GURU Industry Graph",
        "AI 行业年度重点事件索引，按官方一手源与交叉印证收录。",
        body, depth=0, canonical=url_for(site_url, "chronicle.html"),
    )


# ---------------------------------------------------------------- 样式
CSS = """
:root{--paper:#fbfaf7;--ink:#151515;--ink2:#4a4a46;--ink3:#7c7c74;--line:#e5e2da;--accent:#1d4ed8;--card:#fff}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.7 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Noto Sans CJK SC",sans-serif}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
.site-header{display:flex;flex-wrap:wrap;gap:12px 24px;align-items:center;justify-content:space-between;padding:18px max(20px,calc((100vw - 1080px)/2));border-bottom:1px solid var(--line);background:rgba(251,250,247,.92);position:sticky;top:0;backdrop-filter:blur(8px);z-index:10}
.brand{font-weight:700;letter-spacing:.02em;color:var(--ink)}.brand span{color:var(--ink3);font-weight:500}
.site-header nav{display:flex;flex-wrap:wrap;gap:16px;font-size:14px}
main{max-width:1080px;margin:0 auto;padding:36px 20px 80px}
.hero{padding:40px 0 28px;border-bottom:1px solid var(--line);margin-bottom:32px}
.kicker{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink3);margin:0 0 10px}
h1{font-size:clamp(30px,5vw,52px);line-height:1.15;letter-spacing:-.02em;margin:0 0 16px}
h2{font-size:24px;margin:40px 0 14px;padding-bottom:8px;border-bottom:1px solid var(--line)}
h3{font-size:18px;margin:26px 0 8px}
.lead{font-size:18px;color:var(--ink2);max-width:760px}
.en-name{font-size:14px;letter-spacing:.06em;color:var(--ink3);margin:-8px 0 10px;text-transform:uppercase}
.lead-en{font-size:15px;color:var(--ink3);max-width:760px;margin-top:-4px}
.stats{font-size:15px;color:var(--ink2);margin:18px 0}.stats b{color:var(--ink);font-size:18px}
.cta{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0}
.btn{display:inline-block;padding:9px 16px;border-radius:999px;background:var(--ink);color:#fff;font-size:14px;font-weight:600}
.btn:hover{text-decoration:none;opacity:.88}.btn.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}
.layers{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px}
.layer{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px}
.layer h3{margin:0 0 4px}.layer .en{font-size:12px;color:var(--ink3);margin:0 0 10px}
.tag{display:inline-block;padding:2px 7px;border-radius:5px;background:var(--ink);color:#fff;font-size:12px;margin-right:6px}
.node-list{columns:2;column-gap:18px;list-style:none;padding:0;margin:12px 0 0;font-size:14px}
.node-list li{break-inside:avoid;margin:0 0 5px}
.topics,.files{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px 18px}
.topics li,.files li{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px dotted var(--line)}
.dim{color:var(--ink3);font-size:13px}
.crumbs{font-size:13px;color:var(--ink3);margin-bottom:18px}
.badges{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}
.badge{display:inline-block;padding:3px 9px;border-radius:999px;background:#eef2ff;color:#1e3a8a;font-size:12px}
.badge.ghost{background:transparent;border:1px solid var(--line);color:var(--ink3);font-family:ui-monospace,Menlo,monospace}
table{width:100%;border-collapse:collapse;margin:12px 0 20px;font-size:14px}
th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--line)}
th{background:#f4f2ec;font-weight:600;white-space:nowrap}
.kv th{width:150px;white-space:normal}
.level{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin:10px 0}
.level h3{margin:0 0 6px;font-size:15px;color:var(--ink2)}.level p{margin:0}
.industry{margin:18px 0 28px}
.boundary{font-size:13px;color:var(--ink3);border-left:3px solid var(--line);padding-left:12px}
.related{list-style:none;padding:0}.related li{margin:6px 0}
.citation{font-size:13px;color:var(--ink3);margin-top:36px;padding-top:14px;border-top:1px solid var(--line)}
.chronicle{list-style:none;padding:0}.chronicle li{padding:14px 0;border-bottom:1px solid var(--line)}
.chronicle .date{font-variant-numeric:tabular-nums;color:var(--ink3);margin-right:10px}
.chronicle .cat{font-size:12px;color:var(--ink3);margin-left:8px}
.chronicle p{margin:4px 0 0;color:var(--ink2);font-size:14px}
.site-footer{max-width:1080px;margin:0 auto;padding:24px 20px 48px;border-top:1px solid var(--line);color:var(--ink3);font-size:13px}
code{font-family:ui-monospace,Menlo,monospace;font-size:.92em;background:#f1efe8;padding:1px 5px;border-radius:4px}
@media(max-width:720px){table{display:block;overflow-x:auto}.node-list{columns:1}main{padding-top:24px}}
"""


def build_sitemap(paths: list[str], site_url: str) -> str:
    urls = "".join(
        f"<url><loc>{esc(url_for(site_url, p))}</loc></url>" for p in paths
    )
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n'


def build_404(site_url: str) -> str:
    body = """
<article><h1>404</h1><p class="lead">这个坐标不存在。回<a href="index.html">产业链全景</a>，或在<a href="console/index.html">工作台</a>里搜索。</p></article>
"""
    return page("404 · AI GURU Industry Graph", "页面不存在", body, depth=0,
                canonical=url_for(site_url, "404.html"))


# ---------------------------------------------------------------- 主流程
def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--site-url", default=DEFAULT_SITE_URL)
    ap.add_argument("--out-dir", default=str(ROOT / "site"))
    args = ap.parse_args()

    out = Path(args.out_dir).resolve()
    out.mkdir(parents=True, exist_ok=True)

    chain = load("chain.json")
    topics = load("topics.json")
    clues = load("clues.json")
    chronicle = load("chronicle.json")
    verify = load("verify.json")
    explain = load("explain.json")
    deep = load("deep.json")
    version = load("index.json").get("version", "")

    # 数据副本：静态站直接可下载
    data_out = out / "data"
    data_out.mkdir(exist_ok=True)
    for p in DATA.glob("*.json"):
        shutil.copy2(p, data_out / p.name)

    # 首页 / 大事记 / 404 / 样式
    (out / "index.html").write_text(
        build_index(chain, topics, clues, chronicle, verify, explain, deep, args.site_url),
        encoding="utf-8",
    )
    (out / "chronicle.html").write_text(build_chronicle(chronicle["items"], args.site_url), encoding="utf-8")
    (out / "404.html").write_text(build_404(args.site_url), encoding="utf-8")
    (out / "style.css").write_text(CSS, encoding="utf-8")

    paths = ["index.html", "chronicle.html"]

    # 节点页
    for layer in chain["layers"]:
        for node in layer["nodes"]:
            p = out / "nodes" / layer["key"] / node["id"] / "index.html"
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(
                build_node(node, layer, chain, explain, deep, clues["items"], chronicle["items"], args.site_url, version),
                encoding="utf-8",
            )
            paths.append(f"nodes/{layer['key']}/{node['id']}/index.html")

    # 主题页
    for t in topics["items"]:
        p = out / "topics" / t["key"] / "index.html"
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(build_topic(t, clues["items"], args.site_url), encoding="utf-8")
        paths.append(f"topics/{t['key']}/index.html")

    # 交互工作台副本（file:// 与 Pages 均可用）
    console_out = out / "console"
    if console_out.exists():
        shutil.rmtree(console_out)
    shutil.copytree(
        CONSOLE, console_out,
        ignore=shutil.ignore_patterns("*.local.js", "*.map", ".DS_Store"),
    )
    # 公开站不携带本机研判层；写空桩避免浏览器 404。
    (console_out / "data.local.js").write_text("/* 公开站：无本机研判层 */\n", encoding="utf-8")
    (console_out / "ops.local.js").write_text("/* 公开站：无本机运营台账 */\n", encoding="utf-8")

    (out / "sitemap.xml").write_text(build_sitemap(paths, args.site_url), encoding="utf-8")
    (out / "robots.txt").write_text(
        f"User-agent: *\nAllow: /\nSitemap: {url_for(args.site_url, 'sitemap.xml')}\n",
        encoding="utf-8",
    )

    print(f"✓ site/ 已生成：{len(chain['layers'])*0 + chain['nodeCount']} 节点页 + "
          f"{topics['count']} 主题页 + 首页 / 大事记 / sitemap（{len(paths)} 个可索引 URL）")


if __name__ == "__main__":
    main()