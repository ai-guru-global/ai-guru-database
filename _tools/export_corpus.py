#!/usr/bin/env python3
"""Export work-order agent corpus for AgentScope NAS mount.

Selects the relevant subset of the LLM-Wiki, cleans duplicates,
preserves wikilink structure, and outputs a self-contained corpus
directory that an AgentScope agent can load as its knowledge base.

Usage:
    python3 _tools/export_corpus.py --output /nas/agent-corpus
    python3 _tools/export_corpus.py --output /nas/agent-corpus --clean  # remove existing first
    python3 _tools/export_corpus.py --output /nas/agent-corpus --dry-run  # preview only
"""
import os, re, sys, json, shutil, hashlib, argparse
from pathlib import Path
from datetime import datetime

# ── Corpus selection rules ──────────────────────────────────────────

# Directories whose content is relevant to the work-order agent
CORPUS_DIRS = [
    "_concepts",
    "_synthesis",
    "12_Architecture_Infrastructure",
    "13_AI_Ops",
    "07_Model_Training",
    "10_Deployment_Inference",
    "11_MLOps_Pipeline",
    "14_RAG_Systems",
    "15_Agent_Production/Agent_Evaluation",
    "15_Agent_Production/Agent_Harness",
    "15_Agent_Production/Agent_Foundations",
    "_projects/Cloud_Ops_Agent",
]

# Specific files outside CORPUS_DIRS that are needed
EXTRA_FILES = [
    "index.md",
    "hot.md",
    "README.md",
]

# Directories to always exclude (even if inside a CORPUS_DIR)
EXCLUDE_PATTERNS = [
    "_raw", "_sources", "_archives", "_tools", "Web", "node_modules",
    ".git", ".obsidian", ".claude", ".venv", ".qoder", ".qwen",
    ".comate", ".crush", ".pytest_cache", "__pycache__", ".github",
    "dist", "site", "test-results", ".lighthouseci", "assets",
    "demo", "__pycache__",
]

# File patterns to exclude
def should_exclude(filepath):
    """Return True if file should be excluded from export."""
    # macOS duplicates
    if " 2.md" in filepath or " 3.md" in filepath:
        return True
    # Hidden files
    if os.path.basename(filepath).startswith("."):
        return True
    # Non-md files (we only export markdown)
    if not filepath.endswith(".md"):
        return True
    # Exclude test/template files
    lower = filepath.lower()
    if any(p in lower for p in EXCLUDE_PATTERNS):
        return True
    return False

# Tier filter: only export core + supporting (skip peripheral for token budget)
TIER_FILTER = {"core", "supporting"}

def parse_frontmatter(content):
    """Extract frontmatter fields."""
    fm = {}
    m = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not m:
        return fm
    block = m.group(1)
    for field in ["title", "summary", "tier", "category", "tags", "created", "updated"]:
        m2 = re.search(rf'^{field}\s*:\s*(.+)$', block, re.MULTILINE)
        if m2:
            val = m2.group(1).strip().strip('"').strip("'")
            fm[field] = val
    # Parse aliases
    alias_m = re.search(r'^aliases?\s*:\s*\n((?:^\s+-\s+.+\n)+)', block, re.MULTILINE)
    if alias_m:
        aliases = re.findall(r'-\s+"?([^"\n]+?)"?\s*$', alias_m.group(1), re.MULTILINE)
        fm["aliases"] = aliases
    return fm

def extract_wikilinks(content):
    """Extract all [[wikilink]] targets."""
    targets = set()
    for m in re.finditer(r'\[\[([^\]]+)\]\]', content):
        t = m.group(1).split("|")[0].split("#")[0].strip()
        if t and not t.startswith("http"):
            targets.add(t)
    return targets

def select_corpus(base_dir):
    """Select the files to export."""
    base = Path(base_dir)
    selected = []
    stats = {"total_scanned": 0, "selected": 0, "excluded_dup": 0,
             "excluded_pattern": 0, "excluded_tier": 0, "excluded_dir": 0}

    # Scan CORPUS_DIRS
    for corpus_dir in CORPUS_DIRS:
        full_dir = base / corpus_dir
        if not full_dir.exists():
            continue
        for filepath in sorted(full_dir.rglob("*.md")):
            stats["total_scanned"] += 1
            rel = filepath.relative_to(base)
            rel_str = str(rel)

            if should_exclude(rel_str):
                if " 2.md" in rel_str:
                    stats["excluded_dup"] += 1
                else:
                    stats["excluded_pattern"] += 1
                continue

            # Read and check tier
            try:
                content = filepath.read_text(encoding="utf-8", errors="ignore")
            except:
                continue
            fm = parse_frontmatter(content)
            tier = fm.get("tier", "supporting")
            if tier not in TIER_FILTER:
                stats["excluded_tier"] += 1
                continue

            selected.append({
                "path": rel_str,
                "abs_path": str(filepath),
                "tier": tier,
                "title": fm.get("title", filepath.stem),
                "summary": fm.get("summary", "")[:200],
                "tags": fm.get("tags", ""),
                "size": filepath.stat().st_size,
                "wikilinks": list(extract_wikilinks(content)),
            })
            stats["selected"] += 1

    # Add EXTRA_FILES from root
    for extra in EXTRA_FILES:
        fp = base / extra
        if fp.exists() and not should_exclude(extra):
            try:
                content = fp.read_text(encoding="utf-8", errors="ignore")
            except:
                continue
            fm = parse_frontmatter(content)
            selected.append({
                "path": extra,
                "abs_path": str(fp),
                "tier": fm.get("tier", "supporting"),
                "title": fm.get("title", extra),
                "summary": fm.get("summary", "")[:200],
                "tags": fm.get("tags", ""),
                "size": fp.stat().st_size,
                "wikilinks": list(extract_wikilinks(content)),
            })
            stats["selected"] += 1

    return selected, stats

def build_link_index(selected):
    """Build a wikilink resolution index for the exported corpus."""
    # basename -> exported path
    basename_map = {}
    for item in selected:
        bn = Path(item["path"]).stem
        basename_map[bn] = item["path"]
        # Also map aliases
        # (parse from frontmatter in the actual file)
    return basename_map

def export_corpus(selected, output_dir, base_dir, dry_run=False):
    """Copy selected files to output directory."""
    out = Path(output_dir)
    base = Path(base_dir)

    if not dry_run:
        # Create output directory
        out.mkdir(parents=True, exist_ok=True)

    exported = []
    total_size = 0

    for item in selected:
        src = Path(item["abs_path"])
        dst = out / item["path"]

        if not dry_run:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)

        exported.append({
            "path": item["path"],
            "tier": item["tier"],
            "title": item["title"],
            "size": item["size"],
        })
        total_size += item["size"]

    return exported, total_size

def write_corpus_manifest(selected, output_dir, stats):
    """Write a corpus_manifest.json for AgentScope to load."""
    manifest = {
        "name": "k8s-work-order-agent-corpus",
        "description": "阿里云专有云 K8s 工单智能体远程诊断语料",
        "version": "1.0.0",
        "exported_at": datetime.now().isoformat(),
        "source_repo": "ai-guru-global/ai-guru-database",
        "usage": {
            "mode": "llm-wiki",
            "description": "智能体通过 wiki-query / wiki-context-pack 方式使用本语料，非 RAG 向量检索",
            "entry_point": "_synthesis/diagnosis-work-order-hub.md",
            "tier_priority": ["core", "supporting"],
        },
        "stats": {
            "total_pages": len(selected),
            "total_size_bytes": sum(item["size"] for item in selected),
            "total_size_mb": round(sum(item["size"] for item in selected) / 1024 / 1024, 2),
            "by_tier": {},
        },
        "categories": {
            "diagnosis_hub": "_synthesis/diagnosis-work-order-hub.md",
            "pod_failure": "_synthesis/diagnosis-k8s-pod-failure.md",
            "network_failure": "_synthesis/diagnosis-k8s-network-failure.md",
            "storage_failure": "_synthesis/diagnosis-k8s-storage-failure.md",
            "gpu_failure": "_synthesis/diagnosis-gpu-ai-workload-failure.md",
            "troubleshooting": "13_AI_Ops/Kubernetes_Troubleshooting_Playbook.md",
            "alicloud_context": "12_Architecture_Infrastructure/Alibaba_Cloud_Proprietary_K8s_Context.md",
        },
        "pages": [],
    }

    # Stats by tier
    tier_stats = {}
    for item in selected:
        t = item["tier"]
        if t not in tier_stats:
            tier_stats[t] = {"count": 0, "size": 0}
        tier_stats[t]["count"] += 1
        tier_stats[t]["size"] += item["size"]
    manifest["stats"]["by_tier"] = tier_stats

    # Page list
    for item in selected:
        manifest["pages"].append({
            "path": item["path"],
            "title": item["title"],
            "tier": item["tier"],
            "summary": item["summary"],
            "size_bytes": item["size"],
        })

    out_path = Path(output_dir) / "corpus_manifest.json"
    out_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    return manifest

def write_corpus_readme(selected, output_dir):
    """Write a README for the exported corpus."""
    core_pages = [p for p in selected if p["tier"] == "core"]
    readme = f"""# K8s 工单智能体远程诊断语料

> 本语料库为阿里云专有云 K8s 工单智能体的知识库，采用 LLM-Wiki 模式使用。

## 语料结构

```
corpus/
├── corpus_manifest.json          ← 语料清单（AgentScope 加载入口）
├── README.md                     ← 本文件
├── _synthesis/                   ← 诊断决策树（智能体入口）
│   ├── diagnosis-work-order-hub.md       ← 工单诊断总入口
│   ├── diagnosis-k8s-pod-failure.md      ← Pod 故障决策树
│   ├── diagnosis-k8s-network-failure.md  ← 网络故障决策树
│   ├── diagnosis-k8s-storage-failure.md  ← 存储故障决策树
│   └── diagnosis-gpu-ai-workload-failure.md ← GPU/AI 负载决策树
├── _concepts/                    ← K8s/GPU/云 原子概念页
├── 12_Architecture_Infrastructure/ ← K8s 深度页 + 专有云上下文
├── 13_AI_Ops/                    ← 排障 Playbook + Runbook
├── 07_Model_Training/            ← 训练故障 Runbook
├── 10_Deployment_Inference/      ← 推理部署 Runbook
├── 11_MLOps_Pipeline/            ← MLOps 排障
├── 14_RAG_Systems/               ← RAG 系统
├── 15_Agent_Production/          ← Agent 评估与 Harness
└── _projects/Cloud_Ops_Agent/    ← 云运维 Agent 项目
```

## 使用方式

### AgentScope 加载

```python
import json

# 加载语料清单
with open("corpus_manifest.json") as f:
    manifest = json.load(f)

# 诊断入口（智能体应从此页开始）
entry = manifest["categories"]["diagnosis_hub"]
# → _synthesis/diagnosis-work-order-hub.md

# 按工单类型路由
categories = manifest["categories"]
# categories["pod_failure"] → Pod 故障决策树
# categories["network_failure"] → 网络故障决策树
# categories["storage_failure"] → 存储故障决策树
# categories["gpu_failure"] → GPU 故障决策树
```

### 智能体工作流

1. 收到工单 → 读取 `diagnosis-work-order-hub.md`
2. 按工单现象分类 → 进入对应诊断决策树
3. 沿 wikilink 遍历 → 读取关联 Runbook + 概念页
4. 给出远程排查建议（含安全分级）

## 统计

- 总页面数: {len(selected)}
- Core 页面: {len(core_pages)}
- 总大小: {round(sum(p['size'] for p in selected) / 1024 / 1024, 2)} MB

## 来源

- 源仓库: ai-guru-global/ai-guru-database
- 导出时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}
- 使用 LLM-Wiki 模式（非 RAG 向量检索）
"""
    out_path = Path(output_dir) / "README.md"
    out_path.write_text(readme, encoding="utf-8")

def main():
    parser = argparse.ArgumentParser(description="Export work-order agent corpus")
    parser.add_argument("--output", "-o", required=True, help="Output directory (NAS mount)")
    parser.add_argument("--clean", action="store_true", help="Remove existing output first")
    parser.add_argument("--dry-run", action="store_true", help="Preview without copying")
    args = parser.parse_args()

    base_dir = os.getcwd()

    print(f"Selecting corpus from {base_dir}...")
    selected, stats = select_corpus(base_dir)

    print(f"\nSelection stats:")
    print(f"  Scanned:      {stats['total_scanned']}")
    print(f"  Selected:     {stats['selected']}")
    print(f"  Excluded dup: {stats['excluded_dup']}")
    print(f"  Excluded pat: {stats['excluded_pattern']}")
    print(f"  Excluded tier:{stats['excluded_tier']}")

    total_size = sum(item["size"] for item in selected)
    print(f"  Total size:   {total_size / 1024 / 1024:.2f} MB")

    # Tier breakdown
    tier_counts = {}
    for item in selected:
        tier_counts[item["tier"]] = tier_counts.get(item["tier"], 0) + 1
    print(f"  By tier:      {tier_counts}")

    if args.dry_run:
        print(f"\n[DRY RUN] Would export {len(selected)} files to {args.output}")
        print("\nSample files:")
        for item in selected[:15]:
            print(f"  [{item['tier']:10s}] {item['path']}")
        if len(selected) > 15:
            print(f"  ... +{len(selected)-15} more")
        return

    # Clean if requested
    if args.clean and os.path.exists(args.output):
        print(f"\nCleaning {args.output}...")
        shutil.rmtree(args.output)

    # Export
    print(f"\nExporting to {args.output}...")
    exported, total_exported = export_corpus(selected, args.output, base_dir)
    print(f"  Exported {len(exported)} files ({total_exported / 1024 / 1024:.2f} MB)")

    # Write manifest and README
    manifest = write_corpus_manifest(selected, args.output, stats)
    write_corpus_readme(selected, args.output)

    print(f"\n✅ Export complete:")
    print(f"   {len(exported)} pages, {total_exported / 1024 / 1024:.2f} MB")
    print(f"   Manifest: {args.output}/corpus_manifest.json")
    print(f"   README:   {args.output}/README.md")
    print(f"   Entry:    {args.output}/{manifest['categories']['diagnosis_hub']}")

if __name__ == "__main__":
    main()
