#!/usr/bin/env python3
"""Export the ai-guru-database wiki as a self-contained AgentScope corpus.

Single canonical exporter with two scopes:

  --scope full     every non-excluded .md in the vault (transitive closure
                   from the diagnosis hub is computed for reachability stats)
  --scope subset   only K8s / GPU / ops-relevant directories (token-budget
                   subset); everything else is link-rewritten away

Both scopes:
  * Resolve [[wikilinks]] with a robust resolver (exact path → space/underscore
    variant → directory→README → relative walk-up → unique basename).
  * REWRITE unresolved links to plain display text so the agent never follows
    a dead link (disable with --no-rewrite).
  * Generate corpus_manifest.json, index.md, hot.md, README.md.

Usage:
    python3 _tools/export_corpus.py --scope full   --output release --clean
    python3 _tools/export_corpus.py --scope subset --output release --clean
    python3 _tools/export_corpus.py --scope full --dry-run
"""
import os, re, sys, json, shutil, argparse
from pathlib import Path
from datetime import datetime
from collections import deque, Counter, defaultdict

BASE_DIR = Path(__file__).resolve().parent.parent

# ── Scope: full ─────────────────────────────────────────────────────
# Directory names never exported (tooling / hidden / caches / raw sources)
EXCLUDE_DIR_NAMES = {
    "_raw", "_sources", "_archives", "_tools",
    "Web", "node_modules", "release",
    ".git", ".obsidian", ".claude", ".venv", ".qoder", ".qwen",
    ".comate", ".crush", ".pytest_cache", "__pycache__", ".github",
    ".githooks", "dist", "site", "test-results", ".lighthouseci",
}

# Root-level meta files always included in full scope
EXTRA_ROOT_FILES = [
    "README.md", "README_EN.md", "README_for_dummy.md",
    "ROADMAP.md", "KNOWN_ISSUES.md", "CONTRIBUTING.md",
]

# ── Scope: subset ───────────────────────────────────────────────────
CORPUS_DIRS = [
    "_concepts", "_synthesis",
    "12_Architecture_Infrastructure", "13_AI_Ops",
    "07_Model_Training", "10_Deployment_Inference",
    "11_MLOps_Pipeline", "14_RAG_Systems",
    "15_Agent_Production/Agent_Evaluation",
    "15_Agent_Production/Agent_Harness",
    "15_Agent_Production/Agent_Foundations",
    "_projects/Cloud_Ops_Agent",
]
TIER_FILTER = {"core", "supporting"}
# segment names excluded even inside CORPUS_DIRS
EXCLUDE_SEGMENTS = {
    "_raw", "_sources", "_archives", "_tools", "Web", "node_modules",
    ".git", ".obsidian", ".claude", ".venv", ".qoder", ".qwen",
    ".comate", ".crush", ".pytest_cache", "__pycache__", ".github",
    "dist", "site", "test-results", ".lighthouseci", "assets", "demo",
}

ENTRY = "_synthesis/diagnosis-work-order-hub.md"

LINK_RE = re.compile(r"\[\[([^\[\]]+)\]\]")
FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---", re.DOTALL)
FIELD_RE = re.compile(r"^([A-Za-z_][\w-]*)\s*:\s*(.+)$", re.MULTILINE)


# ── Frontmatter / wikilink parsing ──────────────────────────────────

def parse_frontmatter(text):
    m = FRONTMATTER_RE.match(text)
    if not m:
        return {}
    fm = {}
    for mm in FIELD_RE.finditer(m.group(1)):
        fm[mm.group(1)] = mm.group(2).strip().strip("\"'")
    return fm

def extract_wikilinks(text):
    out = []
    for m in LINK_RE.finditer(text):
        raw = m.group(1)
        t = raw.split("|")[0].split("#")[0].strip()
        if t and not t.startswith("http"):
            out.append(t)
    return out


# ── Exclusion helpers ───────────────────────────────────────────────

def is_macos_dup(name):
    return bool(re.search(r"\s[2345]\.md$", name))

def exclude_full_dir(name):
    return name in EXCLUDE_DIR_NAMES or name.startswith(".")

def exclude_full_file(name):
    if not name.endswith(".md") or name.startswith(".") or is_macos_dup(name):
        return True
    return False

def should_exclude_subset(rel):
    if is_macos_dup(rel) or not rel.endswith(".md"):
        return True
    if os.path.basename(rel).startswith("."):
        return True
    segments = {s.lower() for s in re.split(r"[\\/]", rel)}
    return any(p.lower() in segments for p in EXCLUDE_SEGMENTS)


# ── Scanning / selection ────────────────────────────────────────────

def _page(rel, abs_p, text=None, tier_override=None):
    text = text if text is not None else abs_p.read_text(encoding="utf-8", errors="ignore")
    fm = parse_frontmatter(text)
    return {
        "path": rel,
        "abs_path": str(abs_p),
        "title": fm.get("title", Path(rel).stem),
        "tier": tier_override or fm.get("tier", "supporting"),
        "summary": (fm.get("summary") or "")[:240],
        "size": abs_p.stat().st_size,
        "links": extract_wikilinks(text),
    }

def select_full(root):
    pages = {}
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if not exclude_full_dir(d)]
        for fn in filenames:
            if exclude_full_file(fn):
                continue
            abs_p = Path(dirpath) / fn
            rel = abs_p.relative_to(root).as_posix()
            pages[rel] = _page(rel, abs_p)
    for extra in EXTRA_ROOT_FILES:
        fp = root / extra
        if fp.exists() and fp.is_file():
            pages[extra] = _page(extra, fp)
    return list(pages.values())

def select_subset(base):
    pages = {}
    for corpus_dir in CORPUS_DIRS:
        full_dir = base / corpus_dir
        if not full_dir.exists():
            continue
        for fp in sorted(full_dir.rglob("*.md")):
            rel = fp.relative_to(base).as_posix()
            if should_exclude_subset(rel):
                continue
            text = fp.read_text(encoding="utf-8", errors="ignore")
            tier = parse_frontmatter(text).get("tier", "supporting")
            if tier not in TIER_FILTER:
                continue
            pages[rel] = _page(rel, fp, text, tier_override=tier)
    return list(pages.values())


# ── Robust resolver (shared by stats + rewriting) ───────────────────

def build_index(pages):
    all_paths = {p["path"] for p in pages}
    basename_index = defaultdict(set)
    for p in pages:
        basename_index[Path(p["path"]).stem].add(p["path"])
    return all_paths, basename_index

def resolve_target(target, all_paths, basename_index, source_path=""):
    """Resolve a wikilink target to a real path, or None.

    Order: exact path → space/underscore variant → dir→README →
    relative-to-source walk-up → unique basename.
    """
    if not target or target.startswith("http"):
        return target  # external / empty: treat as resolved (leave untouched)
    raw = target.rstrip("/").lstrip("./")
    cand = raw if raw.endswith(".md") else raw + ".md"

    if cand in all_paths:
        return cand
    for v in (cand.replace(" ", "_"), cand.replace("_", " ")):
        if v in all_paths:
            return v
    for d in (raw, raw.replace(" ", "_"), raw.replace("_", " ")):
        if f"{d}/README.md" in all_paths:
            return f"{d}/README.md"
    if source_path:
        src_dir = Path(source_path).parent
        for ancestor in (src_dir, *src_dir.parents):
            pre = "" if str(ancestor) == "." else f"{ancestor}/"
            for d in (raw, raw.replace(" ", "_"), raw.replace("_", " ")):
                c = f"{pre}{d if d.endswith('.md') else d+'.md'}"
                if c in all_paths:
                    return c
                r = f"{pre}{d}/README.md"
                if r in all_paths:
                    return r
    stem = Path(cand).stem
    hits = basename_index.get(stem)
    if hits and len(hits) == 1:
        return next(iter(hits))
    return None


# ── Link rewriting ──────────────────────────────────────────────────

def rewrite_wikilinks(text, all_paths, basename_index, source_path):
    """Keep resolved links; convert unresolved ones to plain display text."""
    rewritten = 0

    def repl(m):
        nonlocal rewritten
        inner = m.group(1)
        parts = inner.split("|", 1)
        target = parts[0].split("#")[0].strip()
        alias = parts[1].split("#")[0].strip() if len(parts) > 1 else ""
        resolved = resolve_target(target, all_paths, basename_index, source_path)
        if resolved is not None:
            return m.group(0)
        rewritten += 1
        if alias:
            return alias
        stem = os.path.splitext(os.path.basename(target))[0]
        return stem.replace("-", " ").replace("_", " ")

    new_text = LINK_RE.sub(repl, text)
    return new_text, rewritten


# ── Reachability (BFS from entry) ───────────────────────────────────

def compute_reachable(pages, all_paths, basename_index):
    by_path = {p["path"]: p for p in pages}
    if ENTRY not in by_path:
        return set()
    seen = {ENTRY}
    queue = deque([ENTRY])
    while queue:
        cur = queue.popleft()
        for t in by_path[cur]["links"]:
            r = resolve_target(t, all_paths, basename_index, source_path=cur)
            if r in by_path and r not in seen:
                seen.add(r)
                queue.append(r)
    return seen


# ── Export (write with rewriting) ───────────────────────────────────

def export_files(pages, output_dir, all_paths, basename_index, rewrite, dry_run):
    out = Path(output_dir)
    if not dry_run:
        out.mkdir(parents=True, exist_ok=True)
    total_size = 0
    total_rewritten = 0
    resolved_count = 0
    broken_count = 0
    per_page_status = {}  # path -> (resolved_links, broken_links)

    for p in pages:
        text = Path(p["abs_path"]).read_text(encoding="utf-8", errors="ignore")
        res, brk = [], []
        for t in p["links"]:
            r = resolve_target(t, all_paths, basename_index, source_path=p["path"])
            (res if r else brk).append(t)
        resolved_count += len(res)
        broken_count += len(brk)
        per_page_status[p["path"]] = (res, brk)

        if rewrite:
            text, rw = rewrite_wikilinks(text, all_paths, basename_index, p["path"])
            total_rewritten += rw

        if not dry_run:
            dst = out / p["path"]
            dst.parent.mkdir(parents=True, exist_ok=True)
            dst.write_text(text, encoding="utf-8")
        total_size += p["size"]

    stats = {
        "total_internal_links": resolved_count + broken_count,
        "resolved_internal_links": resolved_count,
        "broken_internal_links": broken_count,
        "unique_broken_targets": len({t for _, (r, b) in per_page_status.items() for t in b}),
        "links_rewritten": total_rewritten,
    }
    return total_size, stats, per_page_status


# ── Manifest / index / hot / README ─────────────────────────────────

def write_manifest(pages, stats, reachable, per_page_status, scope, total_size, output_dir):
    tier_stats = {}
    for p in pages:
        tier_stats.setdefault(p["tier"], {"count": 0, "size": 0})
        tier_stats[p["tier"]]["count"] += 1
        tier_stats[p["tier"]]["size"] += p["size"]

    categories = {
        "diagnosis_hub": ENTRY,
        "pod_failure": "_synthesis/diagnosis-k8s-pod-failure.md",
        "network_failure": "_synthesis/diagnosis-k8s-network-failure.md",
        "storage_failure": "_synthesis/diagnosis-k8s-storage-failure.md",
        "gpu_failure": "_synthesis/diagnosis-gpu-ai-workload-failure.md",
    }
    present = {p["path"] for p in pages}
    categories = {k: (v if v in present else None) for k, v in categories.items()}

    manifest = {
        "name": f"ai-guru-corpus-{scope}",
        "description": "AI Guru 知识库语料（AgentScope 智能体 NAS 挂载，LLM-Wiki 模式）",
        "scope": scope,
        "version": "3.0.0",
        "exported_at": datetime.now().isoformat(timespec="seconds"),
        "source_repo": "ai-guru-global/ai-guru-database",
        "usage": {
            "mode": "llm-wiki",
            "entry_point": ENTRY,
            "link_resolution": "basename + relative path (spaces/underscores interchangeable); unresolved links rewritten to plain text",
        },
        "stats": {
            "total_pages": len(pages),
            "total_size_bytes": total_size,
            "total_size_mb": round(total_size / 1024 / 1024, 2),
            "reachable_from_entry": len(reachable),
            "total_internal_links": stats["total_internal_links"],
            "resolved_internal_links": stats["resolved_internal_links"],
            "broken_internal_links": stats["broken_internal_links"],
            "unique_broken_targets": stats["unique_broken_targets"],
            "links_rewritten": stats["links_rewritten"],
            "by_tier": tier_stats,
        },
        "categories": categories,
        "pages": [
            {
                "path": p["path"],
                "title": p["title"],
                "tier": p["tier"],
                "summary": p["summary"],
                "size_bytes": p["size"],
                "reachable_from_entry": p["path"] in reachable,
                "broken_links": per_page_status[p["path"]][1],
            }
            for p in pages
        ],
    }
    Path(output_dir, "corpus_manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    return manifest

def _wikilink_for(path, title, basename_index):
    """Unambiguous wikilink: path-form always resolves; bare stem only if unique."""
    stem = Path(path).stem
    if len(basename_index.get(stem, set())) == 1:
        return f"[[{stem}|{title}]]"
    return f"[[{Path(path).with_suffix('').as_posix()}|{title}]]"

def write_index(pages, output_dir, basename_index, reachable):
    indegree = Counter()
    all_paths, _ = build_index(pages)
    for p in pages:
        for t in p["links"]:
            r = resolve_target(t, all_paths, basename_index, source_path=p["path"])
            if r and r != p["path"]:
                indegree[r] += 1

    by_dir = defaultdict(list)
    for p in pages:
        by_dir[p["path"].split("/")[0]].append(p)
    order = sorted(by_dir, key=lambda d: (d.isdigit() is False, d))

    lines = [
        f"# AI Guru 语料 · 目录（{len(pages)} 页）",
        "",
        f"- 智能体入口：[[{Path(ENTRY).stem}|diagnosis-work-order-hub]]",
        "- 热点页：见 [hot.md](hot.md)",
        "",
    ]
    for top in order:
        items = sorted(by_dir[top], key=lambda x: x["path"])
        lines.append(f"## {top}（{len(items)}）\n")
        for it in items:
            star = "⭐ " if it["tier"] == "core" else ""
            deg = f" `{indegree[it['path']]}`" if indegree[it["path"]] else ""
            orb = " 🔒" if it["path"] not in reachable else ""
            lines.append(f"- {star}{_wikilink_for(it['path'], it['title'] or Path(it['path']).stem, basename_index)}{deg}{orb}")
        lines.append("")
    Path(output_dir, "index.md").write_text("\n".join(lines), encoding="utf-8")

def write_hot(pages, output_dir, basename_index, reachable):
    all_paths, _ = build_index(pages)
    indegree = Counter()
    for p in pages:
        for t in p["links"]:
            r = resolve_target(t, all_paths, basename_index, source_path=p["path"])
            if r and r != p["path"]:
                indegree[r] += 1

    GENERIC = {"README", "index", "INDEX", "Readme"}
    seen, ranked = set(), []
    for p in sorted(pages, key=lambda x: (-indegree[x["path"]], x["path"])):
        if p["tier"] != "core":
            continue
        stem = Path(p["path"]).stem
        if stem in GENERIC or p["path"] in seen:
            continue
        seen.add(p["path"])
        ranked.append(p)
        if len(ranked) >= 30:
            break

    core_n = sum(1 for p in pages if p["tier"] == "core")
    lines = [
        "# 语料热点页（Core，按语料内被引用排序）",
        "",
        f"> 共 {core_n} 个 Core 页，下表为被引用最多的前 {len(ranked)} 个。",
        "",
        "| # | 页面 | 被引用 |",
        "|---|------|-------|",
    ]
    for i, p in enumerate(ranked, 1):
        lines.append(f"| {i} | {_wikilink_for(p['path'], p['title'], basename_index)} | {indegree[p['path']]} |")
    lines += ["", "## 诊断决策树入口", ""]
    for hub in ["diagnosis-work-order-hub", "diagnosis-k8s-pod-failure",
                "diagnosis-k8s-network-failure", "diagnosis-k8s-storage-failure",
                "diagnosis-gpu-ai-workload-failure"]:
        hits = [p for p in pages if Path(p["path"]).stem == hub]
        if hits:
            lines.append(f"- [[{hub}]]")
    # Surface unreachable core pages (orphans) so they are not silently lost
    orphans = [p for p in pages if p["tier"] == "core" and p["path"] not in reachable]
    if orphans:
        lines += ["", f"## ⚠ 入口不可达的 Core 页（{len(orphans)}，需手动链入）", ""]
        for p in orphans[:25]:
            lines.append(f"- {_wikilink_for(p['path'], p['title'], basename_index)}")
    Path(output_dir, "hot.md").write_text("\n".join(lines), encoding="utf-8")

def write_readme(manifest, scope, output_dir):
    s = manifest["stats"]
    rate = s["resolved_internal_links"] / max(1, s["total_internal_links"]) * 100
    root_name = os.path.basename(os.path.abspath(output_dir)) or "corpus"
    scope_note = ("完整知识库（全量）" if scope == "full"
                  else "K8s/GPU/运维子集（token 预算优化）")
    readme = f"""# AI Guru 语料（{scope_note}）

> AgentScope 智能体 NAS 挂载语料。LLM-Wiki 模式：沿双括号 wikilink 遍历，非 RAG。
> scope = `{scope}` ｜ 导出脚本：`_tools/export_corpus.py`

## 统计

| 指标 | 值 |
| --- | --- |
| 总页面 | {s['total_pages']} |
| 入口可达 | {s['reachable_from_entry']} |
| Core / Supporting | {s['by_tier'].get('core', {}).get('count', 0)} / {s['by_tier'].get('supporting', {}).get('count', 0)} |
| 总大小 | {s['total_size_mb']} MB |
| 内部链接 | {s['total_internal_links']}（已解析 {s['resolved_internal_links']}，断链 {s['broken_internal_links']}） |
| 链接解析率 | {rate:.1f}% |
| 已重写为纯文本的死链 | {s['links_rewritten']} |

## 使用

```python
import json
from pathlib import Path
root = Path("{root_name}")
manifest = json.load(open(root / "corpus_manifest.json"))
entry = root / manifest["categories"]["diagnosis_hub"]   # 诊断总入口
# 按 basename 解析双括号 wikilink（空格/下划线可互换）；未解析链接已被改写为纯文本
```

## 智能体工作流
1. 收到工单 → 读 `diagnosis-work-order-hub.md`
2. 按现象分类 → Pod / Network / Storage / GPU 决策树
3. 沿双括号 wikilink 遍历 → Runbook + 概念页
4. 输出远程排查建议（含安全分级）

## 来源
- 源仓库: ai-guru-global/ai-guru-database
- 导出时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}
"""
    Path(output_dir, "README.md").write_text(readme, encoding="utf-8")


# ── Main ────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(description="Export ai-guru corpus (unified)")
    ap.add_argument("--scope", choices=["full", "subset"], default="full")
    ap.add_argument("--output", "-o", default="release")
    ap.add_argument("--clean", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--no-rewrite", action="store_true",
                    help="Do not rewrite unresolved links (ship verbatim)")
    args = ap.parse_args()

    root = BASE_DIR
    output_dir = (root / args.output).resolve() if not os.path.isabs(args.output) \
        else Path(args.output).resolve()

    # Safety guard: never allow --clean to wipe the repo root or a parent
    if args.clean and output_dir.resolve() in (root.resolve(), *root.resolve().parents):
        sys.exit(f"[abort] --clean target {output_dir} is the repo root or above; refusing.")

    print(f"[export] scope={args.scope}  base={root}  out={output_dir}")
    pages = select_full(root) if args.scope == "full" else select_subset(root)
    print(f"  selected: {len(pages)} pages")

    all_paths, basename_index = build_index(pages)
    reachable = compute_reachable(pages, all_paths, basename_index)
    print(f"  reachable from entry: {len(reachable)}")

    if not args.dry_run and args.clean and output_dir.exists():
        print(f"  cleaning {output_dir} ...")
        shutil.rmtree(output_dir)

    rewrite = not args.no_rewrite
    # NOTE: link stats are computed against the SOURCE (pre-rewrite) links so
    # the manifest faithfully reports original resolution quality.
    total_size, stats, per_page_status = export_files(
        pages, output_dir, all_paths, basename_index, rewrite, args.dry_run)

    print(f"  links: {stats['resolved_internal_links']}/{stats['total_internal_links']} "
          f"resolved ({stats['broken_internal_links']} broken)")
    if rewrite:
        print(f"  rewritten to plain text: {stats['links_rewritten']}")

    if args.dry_run:
        print("\n[DRY RUN] no files written.")
        return

    # Write manifest / index / hot / README (computed above, written now)
    manifest = write_manifest(pages, stats, reachable, per_page_status,
                              args.scope, total_size, output_dir)
    write_index(pages, output_dir, basename_index, reachable)
    write_hot(pages, output_dir, basename_index, reachable)
    write_readme(manifest, args.scope, output_dir)

    print(f"\n✅ Export complete → {output_dir}")
    print(f"   pages={len(pages)}  size={manifest['stats']['total_size_mb']} MB  "
          f"scope={args.scope}")


if __name__ == "__main__":
    main()
