#!/usr/bin/env python3
"""P1 数据管线：为统一入口页（design/统一入口）生成检索索引与阅读分片。

产物（默认 --out ../design/统一入口/data）：
  index.json          跨面检索索引（≤3MB 预算；超预算会失败提示分片）
  pages/<shard>.json  md → HTML 阅读分片，按顶层目录分片、读取时按需加载
  golden.json         检索回归集（配合 --check 使用）

记录字段（P2 前端按此约定消费）：
  t 标题 · p 仓库相对路径 · s 面（发布站/拆解台/文档站/前端应用/数据集）
  d 更新日期 · x 摘要（frontmatter summary 或首段，≤200 字） · k kind（doc/entity）

打分（P2 JS 必须与此一致）：
  q 按空白切分为 tokens，全部命中才计分（AND）；
  score = Σ token: 标题精确等于记 8，标题包含记 3，路径包含记 2，摘要包含记 1；取 top5。

用法：
  ../.venv/bin/python tools/scripts/build_portal.py [--out DIR] [--check]
运行目录：console/
依赖：markdown（.venv，随 code/工具/requirements.txt 的 mkdocs-material 带入）
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
WIKI = REPO / "wiki"
CONSOLE = REPO / "console"
DOCMAP = REPO / "code/前端应用/src/data/docMap.ts"

# 与 mkdocs.yml 的 exclude_docs 保持一致：门户只索引“发布面”内容
WIKI_EXCLUDE_DIRS = {
    "治理", "原始", "来源", "归档", "docs", "GTM", "reports", "assistant",
}
WIKI_EXCLUDE_FILES = {"index.md", "README_EN.md"}

FM_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n", re.S)
H1_RE = re.compile(r"^#\s+(.+)$", re.M)
WIKILINK_RE = re.compile(r"!?\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]")
MD_NOISE_RE = re.compile(r"!\[[^\]]*\]\([^)]*\)|\[[^\]]*\]\([^)]*\)|`{1,3}[^`]*`{1,3}|[*_>#~-]+")

DATE_KEYS = ("updated", "更新", "created", "创建")
TITLE_KEYS = ("title", "name_zh")
SUMMARY_KEYS = ("summary", "摘要")


def fm_get(fm: str, keys: tuple[str, ...]) -> str:
    for key in keys:
        m = re.search(rf"^{re.escape(key)}:\s*[\"']?(.+?)[\"']?\s*$", fm, re.M)
        if m:
            return m.group(1).strip().strip("\"'")
    return ""


def first_paragraph(body: str) -> str:
    for para in body.split("\n\n"):
        p = para.strip()
        if not p or p.startswith("#") or p.startswith("---") or p.startswith("```"):
            continue
        p = MD_NOISE_RE.sub("", p)
        p = re.sub(r"\s+", " ", p).strip()
        if len(p) >= 8:
            return p[:200]
    return ""


def load_doc(path: Path, rel: str, surface: str) -> dict | None:
    try:
        text = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return None
    m = FM_RE.match(text)
    fm, body = (m.group(1), text[m.end():]) if m else ("", text)
    title = fm_get(fm, TITLE_KEYS) or (H1_RE.search(body).group(1).strip() if H1_RE.search(body) else path.stem)
    summary = fm_get(fm, SUMMARY_KEYS) or first_paragraph(body)
    updated = ""
    for k in DATE_KEYS:
        v = fm_get(fm, (k,))
        if re.fullmatch(r"\d{4}-\d{2}(-\d{2})?", v):
            updated = v
            break
    return {"t": title, "p": rel, "s": surface, "d": updated, "x": summary, "k": "doc"}


def wiki_docs() -> list[dict]:
    out = []
    for md in sorted(WIKI.rglob("*.md")):
        rel_path = md.relative_to(WIKI)
        parts = rel_path.parts
        if any(p.startswith(".") for p in parts):
            continue
        if parts[0] in WIKI_EXCLUDE_DIRS or parts[0] in WIKI_EXCLUDE_FILES:
            continue
        if "_ppt_workspace" in parts:
            continue
        rec = load_doc(md, rel_path.as_posix(), "文档站")
        if rec:
            out.append(rec)
    return out


def console_docs() -> list[dict]:
    out = []
    for md in sorted(CONSOLE.rglob("*.md")):
        rel = md.relative_to(CONSOLE)
        parts = rel.parts
        if parts[0] in {"site", "console", "tools", "docs", "研判", "aihot-mirror",
                        "buffer", "local", "publish-meoo", "data", ".hallmark", ".github"}:
            continue
        if any(p.startswith(".") for p in parts):
            continue
        if parts[0] == "证据层":
            surface = "拆解台"
        elif re.match(r"^0[1-5]-", parts[0]) or rel.name in {"_2026大事记.md", "_topics.md", "README.md"}:
            surface = "发布站"
        else:
            continue
        rec = load_doc(md, f"console/{rel.as_posix()}", surface)
        if rec:
            out.append(rec)
    return out


def docmap_paths() -> set[str]:
    if not DOCMAP.exists():
        return set()
    text = DOCMAP.read_text(encoding="utf-8")
    return set(re.findall(r'filePath:\s*"([^"]+)"', text))


def entities() -> list[dict]:
    out = []
    models = json.loads((CONSOLE / "data/models.json").read_text(encoding="utf-8"))
    for it in models.get("items", []):
        x = "，".join(v for v in (it.get("note"), it.get("bench")) if v)
        out.append({"t": it["name"], "p": f"console/data/models.json#{it['uid']}",
                    "s": "数据集", "d": it.get("date", ""), "x": x[:200], "k": "entity"})
    players = json.loads((CONSOLE / "data/players.json").read_text(encoding="utf-8"))
    for it in players.get("items", []):
        x = "，".join(v for v in (it.get("type"), it.get("positioning")) if v)
        out.append({"t": it["name"], "p": f"console/data/players.json#{it['uid']}",
                    "s": "数据集", "d": "", "x": x[:200], "k": "entity"})
    return out


def score(rec: dict, tokens: list[str]) -> int:
    t, x, p = rec["t"].lower(), rec["x"].lower(), rec["p"].lower()
    total = 0
    for tok in tokens:
        if t == tok:
            total += 8
        elif tok in t:
            total += 3
        elif tok in p:
            total += 2
        elif tok in x:
            total += 1
        else:
            return 0
    return total


def top_k(records: list[dict], q: str, k: int = 5) -> list[dict]:
    tokens = [t for t in q.lower().split() if t]
    if not tokens:
        return []
    scored = [(score(r, tokens), i, r) for i, r in enumerate(records)]
    scored = [s for s in scored if s[0] > 0]
    scored.sort(key=lambda s: (-s[0], s[1]))
    return [r for _, _, r in scored[:k]]


def shard_of(rec: dict) -> str:
    p = rec["p"]
    if p.startswith("console/"):
        rest = p[len("console/"):]
        top = rest.split("/")[0]
        if top == "证据层" or re.match(r"^0[1-5]-", top):
            return f"console/{top}"
        return "console/_root"
    return f"wiki/{p.split('/')[0]}"


def build_wikilink_resolver(records: list[dict]) -> dict[str, str]:
    by_base: dict[str, str] = {}
    for r in records:
        if r["k"] != "doc":
            continue
        by_base.setdefault(Path(r["p"]).stem, r["p"])
    return by_base


def md_to_html(md_text: str, resolver: dict[str, str]) -> str:
    import markdown

    def repl(m: re.Match) -> str:
        target = m.group(1).strip()
        label = (m.group(2) or target).strip()
        base = Path(target.replace("\\", "/")).stem
        hit = resolver.get(base) or resolver.get(target)
        if hit:
            return f'<a class="wikilink" href="#read={hit}" data-read="{hit}">{label}</a>'
        return f'<span class="wikilink wikilink-miss" title="未解析：{target}">{label}</span>'

    body = WIKILINK_RE.sub(repl, md_text)
    return markdown.markdown(
        body,
        extensions=["tables", "fenced_code", "attr_list", "md_in_html"],
        output_format="html5",
    )


def build_pages(records: list[dict], out_dir: Path, resolver: dict[str, str]) -> dict[str, int]:
    pages_dir = out_dir / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)
    for old in pages_dir.glob("*.json"):
        old.unlink()
    shards: dict[str, dict[str, str]] = {}
    for r in records:
        if r["k"] != "doc":
            continue
        src = (WIKI / r["p"]) if not r["p"].startswith("console/") else (CONSOLE / r["p"][len("console/"):])
        if not src.exists():
            continue
        try:
            text = src.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        m = FM_RE.match(text)
        body = text[m.end():] if m else text
        shards.setdefault(shard_of(r), {})[r["p"]] = md_to_html(body, resolver)
    counts = {}
    for name, pages in sorted(shards.items()):
        safe = name.replace("/", "__") + ".json"
        (pages_dir / safe).write_text(
            json.dumps(pages, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
        )
        counts[name] = len(pages)
    return counts


GOLDEN = [
    {"q": "Qwen4-Max", "must_any": ["console/02-数据与模型层/03-前沿闭源模型/Qwen4-Max.md"]},
    {"q": "Qwen", "must_any": ["console/证据层/开源模型与生态/Qwen.md"]},
    {"q": "涂鸦智能", "must_any": ["机构深度研究/AIoT平台/涂鸦智能/README.md"]},
    {"q": "MCP协议", "must_any": ["console/证据层/智能体平台/MCP协议.md"]},
    {"q": "FDE", "must_any": [
        "22-FDE/01_FDE基础/01_FDE概述与定义.md",
        "console/05-商业与生态层/05-交付与实施（FDE）/FDE前沿部署工程师.md",
    ]},
    {"q": "大事记", "must_any": ["console/_2026大事记.md"]},
    {"q": "Manus", "must_any": [
        "console/data/players.json#player/manus",
        "console/03-平台与工具层/01-智能体框架与编排/Manus.md",
    ]},
    {"q": "GPT-6 Astra", "must_any": ["console/data/models.json#model/gpt-6-astra"]},
    {"q": "RAG系统", "any_p_contains": "14_RAG系统/"},
    {"q": "多模态模型", "any_p_contains": "09_多模态模型"},
]


def run_check(index: dict) -> int:
    records = index["records"]
    failed = 0
    for g in GOLDEN:
        top = top_k(records, g["q"])
        paths = [r["p"] for r in top]
        if "must_any" in g:
            ok = any(p in paths for p in g["must_any"])
        else:
            ok = any(g["any_p_contains"] in p for p in paths)
        mark = "ok " if ok else "FAIL"
        if not ok:
            failed += 1
        print(f"  [{mark}] {g['q']!r} -> top5={paths[:3]}{'…' if len(paths) > 3 else ''}")
    print(f"golden: {len(GOLDEN) - failed}/{len(GOLDEN)} passed")
    return 1 if failed else 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(CONSOLE.parent / "design/统一入口/data"))
    ap.add_argument("--check", action="store_true", help="只跑 golden 回归（读取已有 index.json）")
    args = ap.parse_args()
    out_dir = Path(args.out)

    if args.check:
        idx_path = out_dir / "index.json"
        if not idx_path.exists():
            print(f"✗ {idx_path} 不存在，先运行 build_portal.py", file=sys.stderr)
            return 2
        return run_check(json.loads(idx_path.read_text(encoding="utf-8")))

    try:
        import markdown  # noqa: F401
    except ImportError:
        print("✗ 缺 markdown 库：请用 ../.venv/bin/python 运行（.venv 由 P0 创建）", file=sys.stderr)
        return 2

    records: list[dict] = []
    records += wiki_docs()
    docmap = docmap_paths()
    for r in records:
        if r["p"] in docmap:
            r["s"] = "前端应用"  # docMap 收录的文档在前端应用文档中心露出
    records += console_docs()
    records += entities()

    by_surface: dict[str, int] = {}
    for r in records:
        by_surface[r["s"]] = by_surface.get(r["s"], 0) + 1

    index = {
        "asOf": date.today().isoformat(),
        "count": len(records),
        "bySurface": by_surface,
        "scoring": "q split by whitespace, AND; exact-t=8 t=3 p=2 x=1; top5",
        "records": records,
    }
    out_dir.mkdir(parents=True, exist_ok=True)
    idx_path = out_dir / "index.json"
    idx_path.write_text(json.dumps(index, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    size = idx_path.stat().st_size
    print(f"index.json: {len(records)} records, {size / 1024 / 1024:.2f} MB, bySurface={by_surface}")
    if size > 3 * 1024 * 1024:
        print("✗ 超出 3MB 预算：按面分片 index（P1 预案），先精简 x 字段", file=sys.stderr)
        return 1

    resolver = build_wikilink_resolver(records)
    shard_counts = build_pages(records, out_dir, resolver)
    total_pages = sum(shard_counts.values())
    pages_size = sum(f.stat().st_size for f in (out_dir / "pages").glob("*.json"))
    print(f"pages/: {len(shard_counts)} shards, {total_pages} pages, {pages_size / 1024 / 1024:.1f} MB")

    (out_dir / "golden.json").write_text(
        json.dumps(GOLDEN, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    return run_check(index)


if __name__ == "__main__":
    sys.exit(main())
