#!/usr/bin/env python3
"""ai-guru-database 目录结构重构迁移脚本（2026-06）。

子命令：
  restructure_2026.py dry-run          # 预检：输出 rename_plan.csv，不做任何写操作
  restructure_2026.py rename           # git mv 重命名目录（保留历史）
  restructure_2026.py rewrite-links    # 全量重写 wikilink 与 markdown 内链
  restructure_2026.py verify           # 校验断链数，生成验证报告

详见 docs/superpowers/specs/2026-06-19-directory-restructure-design.md
    docs/superpowers/plans/2026-06-19-directory-restructure.md
"""
import argparse
import csv
import json
import os
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

# === 单一事实源：映射表 ===

# 顶层章节重编号（00-21 连续无缺口；00/01/02/03/06/07/08/12 不变）
TOP_LEVEL_RENAME = {
    "00_AI_Introduction":              "00_AI_Introduction",
    "01_Fundamentals":                 "01_Fundamentals",
    "02_Machine_Learning":             "02_Machine_Learning",
    "03_Deep_Learning":                "03_Deep_Learning",
    "05_Computer_Vision":              "04_Computer_Vision",   # 05→04
    "04_NLP_LLMs":                     "05_NLP_LLMs",          # 04→05
    "06_Reinforcement_Learning":       "06_Reinforcement_Learning",
    "07_Model_Training":               "07_Model_Training",
    "08_Model_Evaluation":             "08_Model_Evaluation",
    "15_Testing":                      "09_Testing",           # 15→09
    "09_Deployment_Inference":         "10_Deployment_Inference",  # 09→10
    "10_MLOps_Pipeline":               "11_MLOps_Pipeline",    # 10→11
    "12_Architecture_Infrastructure":  "12_Architecture_Infrastructure",
    "16_AI_Ops":                       "13_AI_Ops",            # 16→13
    "11_RAG_Systems":                  "14_RAG_Systems",       # 11→14
    "13_Agent_Production":             "15_Agent_Production",  # 13→15
    "17_AI_Coding":                    "16_AI_Coding",         # 17→16
    "19_Ethics_Safety":                "17_Ethics_Safety",     # 19→17
    "20_AI_Applications_Industry":     "18_AI_Applications_Industry",  # 20→18
    "21_Talks":                        "19_Talks",             # 21→19
    "22_Papers":                       "20_Papers",            # 22→20
    "23_Interviews":                   "21_Interviews",        # 23→21
}

# 知识图谱层加 _ 前缀
KG_RENAME = {
    "concepts":   "_concepts",
    "synthesis":  "_synthesis",
    "references": "_references",
}

# 嵌套子目录去编号前缀（旧全路径 → 新全路径）
NESTED_RENAME = {
    "13_Agent_Production/16_Agent_Evaluation":   "15_Agent_Production/Agent_Evaluation",
    "13_Agent_Production/23_OpenClaw_Ecosystem": "15_Agent_Production/OpenClaw_Ecosystem",
    "17_AI_Coding/01_Theory":                    "16_AI_Coding/Theory",
    "17_AI_Coding/02_Tools":                     "16_AI_Coding/Tools",
    "17_AI_Coding/03_Practice":                  "16_AI_Coding/Practice",
    "17_AI_Coding/04_Methodology":               "16_AI_Coding/Methodology",
}

# 顶层遍历排除目录（供 _count_refs / rewrite_links 使用）
_EXCLUDE_DIRS = {'.git', 'Web', 'node_modules', '.venv', '.qoder',
                 '.obsidian', '.github', '__pycache__'}


# === 重写规则构造 ===

def build_rewrite_rules():
    """构造 wikilink/内链重写规则列表 [(old, new), ...]，最长前缀优先。

    顺序：NESTED_RENAME → KG_RENAME → TOP_LEVEL_RENAME，每组内按长度降序。
    嵌套路径必须先于其父级顶层路径替换，避免短前缀截断长路径。
    """
    rules = []
    for mapping in (NESTED_RENAME, KG_RENAME, TOP_LEVEL_RENAME):
        group = sorted(mapping.items(), key=lambda kv: len(kv[0]), reverse=True)
        rules.extend(group)
    return rules


# === git 封装 ===

def _git(args, cwd=REPO_ROOT):
    """运行 git 命令，失败则抛错。"""
    result = subprocess.run(["git"] + args, cwd=str(cwd),
                            capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} 失败:\n{result.stderr}")
    return result.stdout.strip()


# === Phase A: dry-run ===

def _count_refs(path_fragment):
    """统计含 path_fragment 的 .md 文件数（粗略，用于 dry-run 报告）。"""
    count = 0
    for root, dirs, files in os.walk(REPO_ROOT):
        dirs[:] = [d for d in dirs if d not in _EXCLUDE_DIRS
                   and not d.startswith('.')]
        for fn in files:
            if not fn.endswith('.md'):
                continue
            try:
                if path_fragment in open(os.path.join(root, fn),
                                         encoding='utf-8', errors='ignore').read():
                    count += 1
            except OSError:
                pass
    return count


def dry_run(out_csv=REPO_ROOT / "_tools" / "rename_plan.csv"):
    """Phase A：输出重命名计划表，不做写操作。"""
    rules = build_rewrite_rules()
    rows = []
    for old, new in rules:
        old_abs = REPO_ROOT / old
        exists = old_abs.exists()
        ref_count = _count_refs(old) if exists else 0
        rows.append({"old": old, "new": new, "exists": exists,
                     "referenced_files": ref_count, "needs_change": old != new})

    out_csv.parent.mkdir(parents=True, exist_ok=True)
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["old", "new", "exists",
                                          "referenced_files", "needs_change"])
        w.writeheader()
        w.writerows(rows)

    changes = sum(1 for r in rows if r["needs_change"])
    print(f"dry-run 完成：{len(rows)} 条规则，{changes} 条需变更")
    print(f"计划表已写入：{out_csv}")
    return rows


# === Phase B: rename ===

def rename(commit=True):
    """Phase B：git mv 重命名目录，保留历史。

    顺序：
      1) 顶层章节（13→15 等，含 04↔05 对调）—— 先改父目录
      2) 知识图谱层加 _ 前缀
      3) 嵌套子目录去编号（此时父目录已是新名，旧路径需用新父前缀）

    每个顶层章节一个 commit（当 commit=True）。
    """
    # 1) 顶层章节重命名（必须最先，嵌套依赖新父前缀）
    pending = [(o, n) for o, n in TOP_LEVEL_RENAME.items() if o != n]
    done = set()
    for old, new in pending:
        if old in done:
            continue
        # 双向冲突：目标 new 是另一个待处理项的旧名（典型 04↔05 对调）
        other_old = next((o for o, _ in pending if o == new), None)
        if other_old is not None and other_old != old:
            # 三步法（old→tmp, other_old→new, tmp→other_new）
            other_new = next(n for o, n in pending if o == other_old)
            tmp = f"__tmp_swap_{old.split('_')[0]}"
            _git(["mv", old, tmp])
            _git(["mv", other_old, new])
            _git(["mv", tmp, other_new])
            done.update({old, other_old})
        else:
            _git(["mv", old, new])
            done.add(old)
        if commit:
            _git(["add", "-A"]); _git(["commit", "-m",
                f"refactor(restructure): 重命名 {old} → {new}"])

    # 2) 知识图谱层加 _ 前缀
    for old, new in KG_RENAME.items():
        if (REPO_ROOT / old).exists():
            _git(["mv", old, new])
    if commit:
        _git(["add", "-A"]); _git(["commit", "-m",
            "refactor(restructure): 知识图谱层加 _ 前缀"])

    # 3) 嵌套子目录去编号前缀
    #    顶层已改名，NESTED_RENAME 的旧路径用旧编号，需替换为当前实际路径。
    #    构造 old_top→new_top 反查，把嵌套旧路径的父前缀换成新名。
    for old_nested, new_nested in NESTED_RENAME.items():
        # old_nested 如 "13_Agent_Production/16_Agent_Evaluation"，但 13 已变 15
        # 用 new_nested 的父前缀（15_Agent_Production）+ old_nested 的子名重构实际旧路径
        new_parent = new_nested.rsplit("/", 1)[0]  # 15_Agent_Production
        old_child = old_nested.rsplit("/", 1)[1]   # 16_Agent_Evaluation
        actual_old = f"{new_parent}/{old_child}"    # 15_Agent_Production/16_Agent_Evaluation
        if (REPO_ROOT / actual_old).exists():
            _git(["mv", actual_old, new_nested])
    if commit:
        _git(["add", "-A"]); _git(["commit", "-m",
            "refactor(restructure): 嵌套子目录去编号前缀（13/17）"])


# === Phase C: rewrite-links ===

def rewrite_links_in_file(filepath):
    """对单个 .md 文件应用重写规则，仅作用于 [[...]] 与 ](... ) 内的路径。

    使用边界匹配 (?<![A-Za-z0-9_]) 和 (?![A-Za-z0-9_]) 防止部分匹配。
    按规则表（最长前缀优先）依次替换。
    返回是否发生了修改。
    """
    rules = build_rewrite_rules()
    path_obj = Path(filepath)
    text = path_obj.read_text(encoding="utf-8", errors="ignore")
    original = text

    for old, new in rules:
        if old == new:
            continue
        # 边界：旧路径左侧/右侧不能是 [A-Za-z0-9_]，避免误伤 104_NLP_LLMs 等
        pattern = re.compile(
            r"(?<![A-Za-z0-9_])" + re.escape(old) + r"(?![A-Za-z0-9_])"
        )

        def _replace_in_links(m, _pat=pattern, _new=new):
            return _pat.sub(_new, m.group(0))

        # [[wiki links]]
        text = re.sub(r"\[\[[^\]]+\]\]", _replace_in_links, text)
        # [text](link) —— 只替换括号内
        text = re.sub(r"\]\([^)]+\)", _replace_in_links, text)

    if text != original:
        path_obj.write_text(text, encoding="utf-8")
        return True
    return False


def rewrite_links():
    """Phase C：遍历全库 .md 文件，重写 wikilink 与 md 内链。"""
    changed_files = 0
    for root, dirs, files in os.walk(REPO_ROOT):
        dirs[:] = [d for d in dirs if d not in _EXCLUDE_DIRS
                   and not d.startswith('.')]
        for fn in files:
            if not fn.endswith('.md'):
                continue
            fp = Path(root) / fn
            if rewrite_links_in_file(fp):
                changed_files += 1
    print(f"rewrite-links 完成：{changed_files} 个文件被修改")
    return changed_files


# === Phase D: verify ===

def _run_check_links():
    """调用 check_links.py 并解析输出，返回 dict。"""
    script = REPO_ROOT / "_tools" / "check_links.py"
    r = subprocess.run([sys.executable, str(script), str(REPO_ROOT)],
                       capture_output=True, text=True)
    out = r.stdout
    files = total = broken = 0
    m = re.search(r"Checked (\d+) files, (\d+) internal links", out)
    if m:
        files, total = int(m.group(1)), int(m.group(2))
    m = re.search(r"Found (\d+) broken links", out)
    if m:
        broken = int(m.group(1))
    return {"files": files, "total": total, "broken": broken}


def verify():
    """Phase D：校验断链数，生成验证报告。"""
    baseline_path = REPO_ROOT / "_tools" / "_baseline-2026-06-19.json"
    baseline = json.loads(baseline_path.read_text(encoding="utf-8"))
    before = baseline.get("broken_links_before", 0)

    result = _run_check_links()
    after = result["broken"]
    ok = after <= before

    report = REPO_ROOT / "_meta" / "_post-restructure-2026-06-19.md"
    report.parent.mkdir(parents=True, exist_ok=True)
    status = "断链未恶化" if ok else "断链恶化（需排查）"
    report.write_text(
        f"---\ntitle: 目录重构后验证报告\ndate: 2026-06-19\n---\n\n"
        f"# 目录重构验证报告\n\n"
        f"| 指标 | 基线 | 重构后 |\n|------|------|--------|\n"
        f"| 文件数 | {baseline.get('files_checked')} | {result['files']} |\n"
        f"| 内链数 | {baseline.get('internal_links')} | {result['total']} |\n"
        f"| 断链数 | {before} | {after} |\n\n"
        f"**结论**：{status}（{after} ≤ {before}）。\n",
        encoding="utf-8")
    print(f"verify 完成：断链 {after}（基线 {before}）→ {'OK' if ok else 'FAIL'}")
    print(f"报告：{report}")
    return report


# === CLI ===

def main():
    p = argparse.ArgumentParser(description="ai-guru-database 目录重构迁移")
    p.add_argument("cmd", choices=["dry-run", "rename", "rewrite-links", "verify"])
    p.add_argument("--no-commit", action="store_true", help="rename 时不自动 commit")
    args = p.parse_args()

    if args.cmd == "dry-run":
        dry_run()
    elif args.cmd == "rename":
        rename(commit=not args.no_commit)
    elif args.cmd == "rewrite-links":
        rewrite_links()
    elif args.cmd == "verify":
        verify()


if __name__ == "__main__":
    main()
