#!/usr/bin/env python3
"""构建私人工作台 console/ 的内嵌数据（零构建静态台，file:// 直接可用）。

解析仓库数据源并产出：
  console/data.js        — 全量内嵌 DB（主题/线索/大事记/待核实/统计），进 git
  console/data.local.js  — 仅当 研判/ 目录存在时产出（本机观点层），gitignore
  console/players.js     — --seed-players 时生成玩家 Top20 种子（已存在则不覆盖）

数据源：
  _topics.md 表格（主题顺序/英文/范围）
  <主题>/*.md 线索（中文键 frontmatter + 时间线正文，[[主题/线索]] 双链转伪协议）
  _2026大事记.md / _2025大事记.md（复用 build_feed.ENTRY 正则）
  docs/2026待核实清单.md（### 事件 — 状态 + 项目符）

用法：python3 tools/scripts/build_console.py [--check] [--seed-players]
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from build_feed import CHRONICLES, ENTRY  # noqa: E402

TOPICS_DOC = ROOT / "_topics.md"
VERIFY_DOC = ROOT / "docs" / "2026待核实清单.md"
TEMPLATE_DOC = ROOT / "docs" / "线索模板.md"
CHRONICLE_2026 = ROOT / "_2026大事记.md"
ARCHIVE_DIR = ROOT / "aihot-mirror" / "by-date"
RESEARCH_DIR = ROOT / "研判"
CONSOLE_DIR = ROOT / "console"
OUT_DATA = CONSOLE_DIR / "data.js"
OUT_LOCAL = CONSOLE_DIR / "data.local.js"
OUT_PLAYERS = CONSOLE_DIR / "players.js"

WIKI = re.compile(r"\[\[([^\[\]]+)\]\]")
STATUS_MARKS = ["✅", "⚠️", "❓", "🔍", "✗", "E"]  # 列表而非字符串：⚠️ 含变体选择符，字符串迭代会拆成两个码位；六态须与 2026待核实清单.md 的「标记图例」同集，否则 verifyByStatus 相加 ≠ verify 总数
WIKILINK_SCHEME = "ai-news-wikilink://"

# 事件自动打标：按优先级首个命中为主类型，全部命中保留为数组；建设目标为筛选与统计，规则可长期迭代
CAT_RULES = [
    ("资本", r"收购|并购|融资|估值|轮融资|IPO|挂牌|上市|选择权|并入|发售价|发行价"),
    ("人事", r"离职|创办|联创|人事|接任|离开谷歌|离开微软|跳槽|加入"),
    ("监管", r"监管|法案|规则|正式生效|法院|裁定|诉讼|出口管制|执法|调查报告"),
    ("安全", r"逃逸|失控|越狱|攻击|越轨|Critical|Preparedness|安全评估|安全概览|水印|欺骗"),
    ("研究", r"论文|基准|Benchmark|SOTA|刷新纪录|评测|登顶|夺冠|证明"),
    ("发布", r"发布|上线|推出|开源|公测|GA|点版本|降价|定价"),
]
MONEY_RE = re.compile(r"([\d,.]+)\s*(万亿|亿)?美元")
ROUND_RE = re.compile(r"(种子轮|天使轮|Pre-?[A-K]轮|[A-K]\+?轮)")


# ---------------------------------------------------------------- 基础解析
def parse_frontmatter(text: str) -> tuple[dict, str]:
    """行式中文键 frontmatter：key: value 或 key: [a, b]；剥离行内 # 注释。"""
    text = text.lstrip("\ufeff").replace("\r\n", "\n")
    lines = text.split("\n")
    if not lines or lines[0].strip() != "---":
        return {}, text
    end = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end = i
            break
    if end is None:
        return {}, text
    fm: dict = {}
    for ln in lines[1:end]:
        m = re.match(r"^([^\s:：]+)\s*[：:]\s*(.*)$", ln.strip())
        if not m:
            continue
        k, v = m.group(1), m.group(2).strip()
        if v.startswith("[") and v.endswith("]"):
            inner = v[1:-1].strip()
            fm[k] = [s.strip() for s in inner.split(",") if s.strip()] if inner else []
        else:
            fm[k] = re.sub(r"\s+#.*$", "", v).strip()
    return fm, "\n".join(lines[end + 1:])


def convert_wikilinks(body: str, src: str) -> str:
    """[[主题/线索]] → [线索名](ai-news-wikilink://主题/线索)；围栏内跳过；无 / 的目标降级为纯文本。"""
    out, in_fence = [], False
    for line in body.replace("\r\n", "\n").split("\n"):
        if re.match(r"^\s*(`{3,}|~{3,})", line):
            in_fence = not in_fence
            out.append(line)
            continue
        if in_fence:
            out.append(line)
            continue

        def repl(m: re.Match) -> str:
            target = m.group(1).strip()
            if "/" not in target:
                print(f"  ⚠️ {src}: 双链 [[{target}]] 缺少主题前缀，按纯文本保留", file=sys.stderr)
                return target
            return f"[{target.split('/', 1)[1]}]({WIKILINK_SCHEME}{target})"

        out.append(WIKI.sub(repl, line))
    return "\n".join(out)


def parse_clue(path: Path, topic_key: str) -> dict:
    fm, body = parse_frontmatter(path.read_text(encoding="utf-8"))
    body = body.strip("\n")
    body = re.sub(r"^#\s+.+\n+", "", body, count=1)  # 详情视图有自己的标题头，正文去重 H1
    qm = re.search(r"^>\s*(.+)$", body, re.M)
    quote = qm.group(1).strip() if qm else ""
    if qm:
        body = re.sub(r"^>[^\n]*\n", "", body, count=1)  # 引言已上提至详情题头，正文去重
    entry_dates = re.findall(r"^- \*\*(\d{4}-\d{2}(?:-\d{2})?)", body, re.M)
    rel_m = re.search(r"## 关联线索.*", body, re.S)
    related = WIKI.findall(rel_m.group(0)) if rel_m else []
    am = re.search(r"## 分析\s*\n(.*?)(?=\n## |\Z)", body, re.S)   # 分析段 = 仓库的观点层，抽成结构化观点库
    analysis = am.group(1).strip() if am else ""
    name = str(fm.get("线索") or path.stem)
    converted = convert_wikilinks(body, path.name)
    return {
        "id": f"{topic_key}/{name}",
        "topic": topic_key,
        "name": name,
        "alias": list(fm.get("别名") or []),
        "status": str(fm.get("状态") or ""),
        "created": str(fm.get("创建") or ""),
        "updated": str(fm.get("更新") or ""),
        "roles": list(fm.get("关键角色") or []),
        "quote": quote,
        "body": converted,
        "analysis": convert_wikilinks(analysis, path.name) if analysis else "",
        "nAnalysis": len(re.findall(r"^\s*(?:\d+[.、]|[-*])\s+", analysis, re.M)) if analysis else 0,
        "nEvents": len(entry_dates),
        "lastEvent": max(entry_dates) if entry_dates else "",
        "months": len(set(d[:7] for d in entry_dates)),
        "verified": body.count("✅"),
        "pending": body.count("⚠️"),
        "related": related,
        "_src": path.relative_to(ROOT).as_posix(),
    }


# ---------------------------------------------------------------- 数据源
def parse_topics() -> list[dict]:
    """_topics.md 表格为主题真相：顺序、英文、范围。"""
    topics = []
    text = TOPICS_DOC.read_text(encoding="utf-8")
    for m in re.finditer(r"^\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*$", text, re.M):
        topics.append({"key": m.group(1), "en": m.group(2), "def": m.group(3), "clues": [], "count": 0})
    return topics


def parse_events() -> list[dict]:
    items = []
    for fname in CHRONICLES:
        path = ROOT / fname
        if not path.exists():
            continue
        year = fname[1:5]
        in_fence = False
        for line in path.read_text(encoding="utf-8").splitlines():
            # 「登记格式」模板示例位于 ```markdown 代码块内，不是事件行
            if line.lstrip().startswith("```"):
                in_fence = not in_fence
                continue
            if in_fence or not line.startswith("- **"):
                continue
            m = ENTRY.match(line)
            if not m:
                continue
            items.append({
                "date": m.group(1),
                "title": (m.group("title") or m.group("plain") or "").strip(),
                "url": (m.group("url") or "").strip(),
                "summary": (m.group("summary") or "").strip(),
                "links": WIKI.findall(m.group("links") or ""),
                "year": year,
                "_src": fname,
            })
    items.sort(key=lambda x: x["date"], reverse=True)
    return items


def parse_verify() -> list[dict]:
    if not VERIFY_DOC.exists():
        return []
    items: list[dict] = []
    cur: dict | None = None
    sec = ""
    for line in VERIFY_DOC.read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if s.startswith("## ") and not s.startswith("###"):
            sec = s[3:].strip()
            continue
        if s.startswith("### "):
            head = s[4:].strip()
            # ⚠️ 含变体选择符（U+FE0F），按基础码位检测后归一化，避免跨编辑器码位漂移
            if "✅" in head:
                mark = "✅"
            elif "⚠" in head:
                mark = "⚠️"
            elif "❓" in head:
                mark = "❓"
            elif "🔍" in head:
                mark = "🔍"
            # ✗／E 是本文件「标记图例（六态）」声明的第 5、6 态；不识别则六态被静默折成四态
            elif "✗" in head:
                mark = "✗"
            elif re.search(r"—\s*E\s", head):
                mark = "E"
            else:
                mark = ""
            parts = head.rsplit("—", 1)
            title = parts[0].strip() if len(parts) == 2 and mark and mark in parts[1] else head
            dm = re.search(r"（(\d{4}-\d{2}-\d{2})）", head)
            cur = {"sec": sec, "title": title, "status": mark, "date": dm.group(1) if dm else "",
                   "lines": [], "into": [], "_src": VERIFY_DOC.relative_to(ROOT).as_posix()}
            items.append(cur)
            continue
        if cur is not None and s.startswith("- "):
            bm = re.match(r"^([^：:]+)[：:]\s*(.*)$", s[2:])
            k = bm.group(1).strip() if bm else ""
            v = bm.group(2).strip() if bm else s[2:]
            if k == "已入库":
                cur["into"] = WIKI.findall(v)
            else:
                cur["lines"].append({"k": k, "v": WIKI.sub(lambda m: WIKILINK_SCHEME + m.group(1).strip(), v)})
    return items


def pack_research() -> dict | None:
    if not RESEARCH_DIR.is_dir():
        return None
    docs = []
    for p in sorted(RESEARCH_DIR.rglob("*.md")):
        if p.parent.name == "theses":
            continue
        text = p.read_text(encoding="utf-8")
        hm = re.search(r"^#\s+(.+)$", text, re.M)
        title = hm.group(1).strip() if hm else p.stem
        text = re.sub(r"^#\s+.+\n+", "", text, count=1)  # 标题已在章节头展示
        text = convert_wikilinks(text, p.name)
        docs.append({
            "n": p.relative_to(RESEARCH_DIR).as_posix(),
            "t": title,
            "m": datetime.fromtimestamp(p.stat().st_mtime).strftime("%Y-%m-%d"),
            "c": text,
        })
    return {"count": len(docs), "docs": docs, "theses": parse_theses(), "actions": parse_actions()}


def parse_theses() -> list[dict]:
    """研判/theses/*.md 议题追踪：frontmatter 议题/状态/置信度/结算日/更新 + 正文（论点/证据/证伪条件）。"""
    items = []
    tdir = RESEARCH_DIR / "theses"
    if not tdir.is_dir():
        return items
    for p in sorted(tdir.glob("*.md")):
        if p.stem == "议题模板":
            continue
        fm, body = parse_frontmatter(p.read_text(encoding="utf-8"))
        if not fm.get("议题"):
            continue
        body = convert_wikilinks(body, p.name)
        items.append({
            "id": p.stem,
            "title": str(fm.get("议题") or p.stem),
            "status": str(fm.get("状态") or "观察中"),
            "confidence": fm.get("置信度"),
            "due": str(fm.get("结算日") or ""),
            "updated": str(fm.get("更新") or ""),
            "body": body.strip("\n"),
            "_src": p.relative_to(RESEARCH_DIR).as_posix(),
        })
    items.sort(key=lambda x: x["updated"], reverse=True)
    return items


def parse_actions() -> list[dict]:
    """研判/actions.md 行动项：- [ ] 事项 → [[线索]] @YYYY-MM-DD。"""
    path = RESEARCH_DIR / "actions.md"
    if not path.exists():
        return []
    items = []
    for line in path.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^-\s+\[([ xX])\]\s+(.*)$", line.strip())
        if not m:
            continue
        text = m.group(2)
        due = ""
        dm = re.search(r"@(\d{4}-\d{2}-\d{2})", text)
        if dm:
            due = dm.group(1)
            text = text.replace(dm.group(0), "").strip()
        items.append({
            "done": m.group(1).lower() == "x",
            "text": WIKI.sub(lambda mm: WIKILINK_SCHEME + mm.group(1).strip(), text),
            "links": WIKI.findall(text),
            "due": due,
            "_src": path.relative_to(RESEARCH_DIR).as_posix(),
        })
    return items


def parse_corrections() -> list[dict]:
    """docs/2026修正记录.md：## 日期 分节 + 修正对象/原内容/修正为/依据 四字段。"""
    path = ROOT / "docs" / "2026修正记录.md"
    if not path.exists():
        return []
    items = []
    cur = None
    for line in path.read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if s.startswith("## "):
            cur = {"date": s[3:].strip(), "object": "", "from": "", "to": "", "basis": "", "_src": path.relative_to(ROOT).as_posix()}
            items.append(cur)
            continue
        if cur is None or not s.startswith("- "):
            continue
        bm = re.match(r"^(修正对象|原内容|修正为|依据)\s*[：:]\s*(.*)$", s[2:])
        if bm:
            cur[{"修正对象": "object", "原内容": "from", "修正为": "to", "依据": "basis"}[bm.group(1)]] = bm.group(2).strip()
    return [i for i in items if i["object"] or i["from"] or i["to"] or i["basis"]]


def pack_library() -> dict:
    """文档中心：仓库根与 docs/（含子目录）的 md 全量内嵌（大事记除外——事件层已解析，raw 体积大）。"""
    files = []
    # docs 用 rglob：页面自述「docs/ 全量」，且线索模板/README/_topics 均引用 docs/superpowers/ 子目录文档（2026-10-03，修正记录留痕）
    targets = sorted(list(ROOT.glob("*.md")) + list((ROOT / "docs").rglob("*.md")))
    for p in targets:
        if p.name in ("_2025大事记.md", "_2026大事记.md"):
            continue
        text = p.read_text(encoding="utf-8")
        hm = re.search(r"^#\s+(.+)$", text, re.M)
        files.append({
            "n": p.relative_to(ROOT).as_posix(),
            "t": hm.group(1).strip() if hm else p.stem,
            "s": len(text.encode("utf-8")),
            "m": datetime.fromtimestamp(p.stat().st_mtime).strftime("%Y-%m-%d"),
            "c": text,
        })
    return {"count": len(files), "files": files, "asOf": datetime.now().strftime("%Y-%m-%d")}


# ---------------------------------------------------------------- 打标与统计
def classify_events(events: list[dict]) -> None:
    """给大事记事件加 cats[]/cat 与 meta{amountUsd, round}；规则打标，存量可增量人工回填。"""
    for e in events:
        hay = e["title"] + " " + e["summary"]
        cats = [name for name, pat in CAT_RULES if re.search(pat, hay)]
        e["cats"] = cats
        e["cat"] = cats[0] if cats else "行业"
        meta = {"amountUsd": None, "round": None}
        if "资本" in cats:
            mm = MONEY_RE.search(hay)
            if mm:
                val = float(mm.group(1).replace(",", ""))
                meta["amountUsd"] = val * 10000 if mm.group(2) == "万亿" else val  # 统一存亿美元；万亿 ×10000
            rm = ROUND_RE.search(hay)
            if rm:
                meta["round"] = rm.group(1)
        e["meta"] = meta


def parse_archive() -> list[dict]:
    """aihot-mirror/by-date 全量精选资讯索引：标题级检索（正文缓存不在库）。"""
    items = []
    if not ARCHIVE_DIR.is_dir():
        return items
    for path in sorted(ARCHIVE_DIR.glob("*.md")):
        day = path.stem
        cat = ""
        lines = path.read_text(encoding="utf-8").splitlines()
        i = 0
        while i < len(lines):
            line = lines[i]
            cm = re.match(r"^##\s+(.+?)（\d+）", line.strip())
            if cm:
                cat = cm.group(1).strip()
                i += 1
                continue
            im = re.match(r"^-\s+\[(.+?)\]\((https?[^)]+)\)", line)
            if im:
                src = ""
                if i + 1 < len(lines):
                    sm = re.match(r"^\s+-\s+(.+?)\s+·\s+\d{4}-\d{2}-\d{2}", lines[i + 1])
                    if sm:
                        src = sm.group(1).strip()
                items.append({"d": day, "cat": cat, "t": im.group(1).strip(), "u": im.group(2), "s": src})
            i += 1
    items.sort(key=lambda x: x["d"], reverse=True)
    return items


def _extract_chronicle_head() -> str:
    """_2026大事记 头部：收录标准 + 真实性约定（到第一个 --- 为止）。"""
    if not CHRONICLE_2026.exists():
        return ""
    text = CHRONICLE_2026.read_text(encoding="utf-8")
    cut = text.find("\n---")
    return text[:cut].strip() if cut > 0 else text.strip()


def _extract_methodology() -> str:
    if not VERIFY_DOC.exists():
        return ""
    text = VERIFY_DOC.read_text(encoding="utf-8")
    m = re.search(r"^## 核验方法论.*$", text, re.M | re.S)
    return m.group(0).strip() if m else ""


def pack_docs() -> dict:
    return {
        "standards": _extract_chronicle_head(),
        "methodology": _extract_methodology(),
        "template": TEMPLATE_DOC.read_text(encoding="utf-8") if TEMPLATE_DOC.exists() else "",
    }


def compute_digest(events: list[dict], clues: list[dict], archive: list[dict]) -> dict:
    """以最新数据日为锚的近 7 天摘要（与周更节奏对齐，快照确定性输出）。"""
    dates = [e["date"] for e in events if len(e["date"]) == 10] + [c["updated"] for c in clues if c["updated"]]
    latest = max(dates) if dates else datetime.now().strftime("%Y-%m-%d")
    end = datetime.strptime(latest, "%Y-%m-%d")
    start = end.toordinal() - 6
    lo = datetime.fromordinal(start).strftime("%Y-%m-%d")
    hi = latest
    wk_events = [e for e in events if lo[:7] <= e["date"][:7] <= hi[:7] and (len(e["date"]) == 7 or lo <= e["date"] <= hi)]
    wk_clues = [c for c in clues if lo <= c["updated"] <= hi]
    wk_days = sorted({a["d"] for a in archive if lo <= a["d"] <= hi}, reverse=True)
    return {
        "range": [lo, hi],
        "events": [e["date"] + " " + e["title"] for e in wk_events],
        "clues": [{"id": c["id"], "name": c["name"], "updated": c["updated"], "n": c["nEvents"]} for c in sorted(wk_clues, key=lambda x: x["updated"], reverse=True)],
        "days": len(wk_days),
        "items": sum(1 for a in archive if lo <= a["d"] <= hi),
    }


# ---------------------------------------------------------------- 输出
def js_out(o) -> str:
    s = json.dumps(o, ensure_ascii=False, separators=(",", ":"))
    return s.replace("</", "<\\/").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")


def seed_players(clues: list[dict]) -> None:
    if OUT_PLAYERS.exists():
        print(f"= console/players.js 已存在，跳过种子（手工策展文件不覆盖）")
        return
    cnt = Counter()
    aliases: dict[str, list] = {}
    for c in clues:
        for r in c["roles"]:
            cnt[r] += 1
            bucket = aliases.setdefault(r, [])
            for a in c["alias"]:
                if a != r and a not in bucket:
                    bucket.append(a)
    entries = [
        {"name": name, "type": "待归类", "positioning": "",
         "aliases": aliases.get(name, [])[:6], "note": f"关键角色，出现于 {n} 条线索"}
        for name, n in cnt.most_common(20)
    ]
    header = (
        "/* 玩家图谱，手工策展（本文件不被构建覆盖）。\n"
        " * type: 公司/机构/人物/待归类；positioning 一句话定位；aliases 参与线索与事件匹配。\n"
        " * 种子由 build_console.py --seed-players 按关键角色引用频次生成，请自行修订。 */\n"
    )
    OUT_PLAYERS.write_text(header + "DB.players = " + js_out(entries) + ";\n", encoding="utf-8")
    print(f"✓ console/players.js 种子已生成（Top {len(entries)}）")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="只解析并打印统计，不写盘")
    ap.add_argument("--seed-players", action="store_true", help="生成玩家 Top20 种子（不覆盖已有文件）")
    args = ap.parse_args()

    topics = parse_topics()
    clues: list[dict] = []
    for t in topics:
        tdir = ROOT / "证据层" / t["key"]
        if not tdir.is_dir():
            continue
        for p in sorted(tdir.glob("*.md")):
            if p.name == "_index.md":
                # 主题说明 + 线索列表 + 候选线索：内嵌为 idx 字段，主题详情页渲染（2026-10-03，修正记录留痕）
                t["idx"] = p.read_text(encoding="utf-8")
                continue
            c = parse_clue(p, t["key"])
            clues.append(c)
            t["clues"].append(c["id"])
            t["count"] += 1
    clues.sort(key=lambda c: c["updated"], reverse=True)
    events = parse_events()
    verify = parse_verify()
    research = pack_research()
    classify_events(events)
    archive = parse_archive()
    docs = pack_docs()
    digest = compute_digest(events, clues, archive)
    corrections = parse_corrections()
    library = pack_library()

    by_month: Counter = Counter(e["date"][:7] for e in events)
    hot = sorted(clues, key=lambda c: (c["nEvents"], c["lastEvent"]), reverse=True)[:10]
    stats = {
        "eventsByMonth": dict(sorted(by_month.items(), reverse=True)),
        "eventsByCat": dict(Counter(e["cat"] for e in events)),
        "cluesByTopic": {t["key"]: t["count"] for t in topics},
        "hotClues": [{"id": c["id"], "name": c["name"], "topic": c["topic"], "n": c["nEvents"], "last": c["lastEvent"]} for c in hot],
        "statusCount": dict(Counter(c["status"] for c in clues)),
        "verifyByStatus": {m: sum(1 for v in verify if v["status"] == m) for m in STATUS_MARKS},
        "lastUpdated": max((c["updated"] for c in clues), default=""),
    }
    meta = {
        "builtAt": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "counts": {"clues": len(clues), "topics": len([t for t in topics if t["count"]]), "events": len(events), "verify": len(verify), "archive": len(archive), "archiveDays": len({a["d"] for a in archive}), "library": len(library["files"])},
    }

    print(f"线索 {len(clues)} 条 / 主题 {len([t for t in topics if t['count']])} 个 / "
          f"大事记 {len(events)} 条 / 待核实 {len(verify)} 条 / 研判 {'有 ' + str(research['count']) + ' 篇' if research else '无'}")
    warned = [c["_src"] for c in clues if "⚠️" in c["body"] and c["pending"] == 0]
    missing_links = [c["id"] for c in clues if "[[" in c["body"]]

    if args.seed_players:
        seed_players(clues)
    if args.check:
        print(f"✓ check 通过（残留未转换双链的线索：{len(missing_links)}）")
        return

    CONSOLE_DIR.mkdir(exist_ok=True)
    header = "/* AI GURU 工作台（AI 全行业拆解台）证据层内嵌数据。由 tools/scripts/build_console.py 生成，勿手改；内容更新后重跑 make console。 */\nvar DB = {};\n"
    parts = [header]
    for key, val in [("meta", meta), ("topics", topics), ("clues", clues), ("events", events), ("verify", verify), ("stats", stats), ("archive", archive), ("docs", docs), ("digest", digest), ("corrections", corrections), ("library", library)]:
        parts.append(f"DB.{key} = " + js_out(val) + ";\n")
    OUT_DATA.write_text("\n".join(parts), encoding="utf-8")
    size_kb = OUT_DATA.stat().st_size / 1024
    print(f"✓ console/data.js 已生成（{size_kb:.0f} KB）")

    if research is not None:
        OUT_LOCAL.write_text("/* 本机研判层，gitignore，不入公共库 */\nDB.research = " + js_out(research) + ";\n", encoding="utf-8")
        print(f"✓ console/data.local.js 已生成（研判 {research['count']} 篇，仅本机）")
    elif OUT_LOCAL.exists():
        OUT_LOCAL.unlink()
        print("= 研判/ 不存在，已移除旧的 console/data.local.js")


if __name__ == "__main__":
    main()
