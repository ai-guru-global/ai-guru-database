# 知识库目录结构重构 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 ai-guru-database 知识库顶层结构重构为分层架构式连续编号（00–21）、知识图谱层 `_` 前缀统一、去重归位，同时安全重写全部 9,101 个 wikilink 与内链。

**Architecture:** 以一个幂等的 Python 迁移脚本 `_tools/restructure_2026.py` 为核心，分 4 阶段（dry-run 预检 → git mv 重命名 → wikilink 全量重写 → 校验）执行。映射表作为单一事实源驱动所有阶段。每个顶层章节的 git mv 对应一个独立 commit，可精确回滚。04↔05 对调用三步法规避文件名冲突。

**Tech Stack:** Python 3（迁移脚本与测试，标准库 `re`/`pathlib`/`os`/`json`/`argparse`）、pytest（迁移脚本单元测试）、git（`git mv` 保留历史、分章 commit）、bash（流水线编排）。

**Spec:** `docs/superpowers/specs/2026-06-19-directory-restructure-design.md`

---

## 文件结构总览

### 新建文件

| 路径 | 职责 |
|------|------|
| `_tools/restructure_2026.py` | 迁移脚本：dry-run / rename / rewrite-links / verify 四子命令 |
| `_tools/tests/test_restructure_2026.py` | 迁移脚本单元测试（映射表、对调冲突、wikilink 正则、断言校验） |
| `_tools/tests/__init__.py` | 空文件，使 tests 成为可导入包 |
| `_meta/cheatsheets/` | 新目录，承接 `_meta/cheatsheet-*.md` 归位 |
| `_meta/_post-restructure-2026-06-19.md` | 重构后验证报告（由 verify 阶段生成） |
| `requirements-dev.txt` | 开发依赖（pytest） |

### 修改文件（脚本自动 / 半自动）

| 路径 | 改动 |
|------|------|
| `_tools/check_links.py` | exclude 集合 `synthesis/concepts/references` → `_synthesis/_concepts/_references` |
| `_tools/fix_links.py` | FIXES 字典路径前缀 + exclude 集合同步 |
| `Web/src/data/docMap.ts` | 章节路径键重映射 |
| `Web/src/data/k8sEvalData.ts` | 章节路径键重映射 |
| `Web/src/features/docs/TopicTagPanel.test.tsx` | 章节路径键重映射 |
| `README.md` | 章节导航表、统计表、内链 |
| `ROADMAP.md` | 引用的章节路径 |
| `hot.md` | 内部链接前缀 |
| `_meta/_directory-conventions.md` | 重写第二、三、四节 |
| `.manifest.json` | 由脚本重生成 |

### 删除文件

| 路径 | 原因 |
|------|------|
| `_evaluation-2026-06-15.md`（根） | 与 `_meta/_evaluation-2026-06-15.md` 完全重复（10046B） |
| `_staging/hot.md` | 与根 `hot.md` 不同步的过期副本 |

---

## 映射表（单一事实源）

所有任务引用此表。脚本以 Python 字典形式实现，键为旧路径片段，值为新路径片段。

```python
# 顶层章节重编号（14 项变更；00/01/02/03/06/07/08/12 不变）
TOP_LEVEL_RENAME = {
    # 不变章节省略，脚本以「实际存在的旧目录 → 新目录」显式列出全部 22 项
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

# 知识图谱层 _ 前缀
KG_RENAME = {
    "concepts":   "_concepts",
    "synthesis":  "_synthesis",
    "references": "_references",
}

# 嵌套子目录去编号前缀（旧章节前缀/旧子目录 → 新章节前缀/新子目录）
# 注意：用「旧全路径」作键，避免被顶层替换误伤
NESTED_RENAME = {
    "13_Agent_Production/16_Agent_Evaluation":   "15_Agent_Production/Agent_Evaluation",
    "13_Agent_Production/23_OpenClaw_Ecosystem": "15_Agent_Production/OpenClaw_Ecosystem",
    "17_AI_Coding/01_Theory":                    "16_AI_Coding/Theory",
    "17_AI_Coding/02_Tools":                     "16_AI_Coding/Tools",
    "17_AI_Coding/03_Practice":                  "16_AI_Coding/Practice",
    "17_AI_Coding/04_Methodology":               "16_AI_Coding/Methodology",
}

# 04↔05 对调冲突：rename 阶段需三步法
SWAP_PAIRS = [("04_NLP_LLMs", "05_NLP_LLMs", "04_Computer_Vision")]  # (旧A, 新A, 旧B=新A的目标名)
```

**重写顺序约束（脚本必须按此序应用，最长前缀优先）**：NESTED_RENAME → KG_RENAME → TOP_LEVEL_RENAME。这样 `13_Agent_Production/16_Agent_Evaluation` 先被整体替换，不会被顶层 `13_Agent_Production→15_Agent_Production` 截断成错误路径。

---

## Task 0: 准备工作与基线快照

**Files:**
- Create: `requirements-dev.txt`
- Create: `_tools/tests/__init__.py`
- Create: `_tools/_baseline-2026-06-19.json`（基线断链计数，供后续比对）

- [ ] **Step 1: 确认工作区干净且在 main 分支**

Run:
```bash
cd /Users/ai-guru/Documents/GitHub/ai-guru-global/ai-guru-database
git status --short
git branch --show-current
```
Expected: `git status` 无未跟踪文件（或仅 docs/ 下已提交内容）；分支为 `main`。若有未提交改动，先 stash 或提交。

- [ ] **Step 2: 创建重构工作分支**

Run:
```bash
git checkout -b refactor/directory-restructure-2026
```
Expected: 切到新分支。

- [ ] **Step 3: 写入开发依赖**

Create `requirements-dev.txt`:
```
pytest>=7.0
```

- [ ] **Step 4: 安装依赖并建测试包**

Run:
```bash
python3 -m pip install -r requirements-dev.txt --quiet
mkdir -p _tools/tests
touch _tools/tests/__init__.py
```

- [ ] **Step 5: 生成基线断链计数**

Run:
```bash
python3 _tools/check_links.py . > /tmp/baseline_links.txt 2>&1
head -1 /tmp/baseline_links.txt
```
Expected: 类似 `Checked 1216 files, 9101 internal links`（数字以实际为准）。记下这个数，作为重构后断链数不得超出的基线。

- [ ] **Step 6: 保存基线到文件**

Create `_tools/_baseline-2026-06-19.json`:
```json
{
  "captured_at": "2026-06-19",
  "source": "check_links.py",
  "files_checked": 1216,
  "internal_links": 9101,
  "broken_links_before": 0
}
```
（files_checked / internal_links 用 Step 5 实际数字替换；broken_links_before 用 `/tmp/baseline_links.txt` 中 "Found N broken" 的 N）

- [ ] **Step 7: Commit**

```bash
git add requirements-dev.txt _tools/tests/__init__.py _tools/_baseline-2026-06-19.json
git commit -m "chore(restructure): 准备工作分支与基线快照"
```

---

## Task 1: 编写迁移脚本骨架与映射表（TDD）

**Files:**
- Create: `_tools/restructure_2026.py`
- Test: `_tools/tests/test_restructure_2026.py`

- [ ] **Step 1: 写失败测试 — 映射表完备性**

Create `_tools/tests/test_restructure_2026.py`:
```python
"""迁移脚本 restructure_2026 的单元测试。"""
import importlib.util
from pathlib import Path

# 直接从文件加载模块（脚本不在包内，避免 import 路径问题）
SCRIPT = Path(__file__).resolve().parent.parent / "restructure_2026.py"
spec = importlib.util.spec_from_file_location("restructure_2026", SCRIPT)
rs = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rs)


def test_top_level_rename_covers_22_chapters():
    """映射表必须覆盖全部 22 个现有主章节（不增不减）。"""
    actual_dirs = {
        d.name for d in Path(rs.REPO_ROOT).iterdir()
        if d.is_dir() and len(d.name) > 3 and d.name[:2].isdigit()
        and not d.name.startswith("9")  # 排除 90-94 拓展目录
    }
    assert set(rs.TOP_LEVEL_RENAME.keys()) == actual_dirs, (
        f"映射表键与实际主章节目录不一致。\n"
        f"缺少: {actual_dirs - set(rs.TOP_LEVEL_RENAME.keys())}\n"
        f"多余: {set(rs.TOP_LEVEL_RENAME.keys()) - actual_dirs}"
    )


def test_top_level_rename_produces_contiguous_00_to_21():
    """新编号必须连续 00-21，无缺口。"""
    new_numbers = sorted(int(new.split("_")[0]) for new in rs.TOP_LEVEL_RENAME.values())
    assert new_numbers == list(range(0, 22)), f"新编号不连续: {new_numbers}"


def test_top_level_rename_has_no_duplicate_new_names():
    """新目录名必须唯一（无两个旧目录映射到同一新名）。"""
    new_names = list(rs.TOP_LEVEL_RENAME.values())
    assert len(new_names) == len(set(new_names)), "存在重复的新目录名"


def test_kg_rename_prefix_underscore():
    """知识图谱层新名必须以 _ 开头。"""
    for old, new in rs.KG_RENAME.items():
        assert new.startswith("_"), f"{new} 缺少 _ 前缀"
```

- [ ] **Step 2: 运行测试确认失败**

Run: `cd /Users/ai-guru/Documents/GitHub/ai-guru-global/ai-guru-database && python3 -m pytest _tools/tests/test_restructure_2026.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'restructure_2026'`

- [ ] **Step 3: 写最小骨架让映射表测试通过**

Create `_tools/restructure_2026.py`:
```python
#!/usr/bin/env python3
"""ai-guru-database 目录结构重构迁移脚本（2026-06）。

子命令：
  restructure_2026.py dry-run     # 预检：输出 rename_plan.csv，不做任何写操作
  restructure_2026.py rename      # git mv 重命名目录（保留历史）
  restructure_2026.py rewrite-links   # 全量重写 wikilink 与 markdown 内链
  restructure_2026.py verify      # 校验断链数，重生成 manifest
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

# === 单一事实源：映射表（详见实施计划「映射表」节） ===
TOP_LEVEL_RENAME = {
    "00_AI_Introduction":              "00_AI_Introduction",
    "01_Fundamentals":                 "01_Fundamentals",
    "02_Machine_Learning":             "02_Machine_Learning",
    "03_Deep_Learning":                "03_Deep_Learning",
    "05_Computer_Vision":              "04_Computer_Vision",
    "04_NLP_LLMs":                     "05_NLP_LLMs",
    "06_Reinforcement_Learning":       "06_Reinforcement_Learning",
    "07_Model_Training":               "07_Model_Training",
    "08_Model_Evaluation":             "08_Model_Evaluation",
    "15_Testing":                      "09_Testing",
    "09_Deployment_Inference":         "10_Deployment_Inference",
    "10_MLOps_Pipeline":               "11_MLOps_Pipeline",
    "12_Architecture_Infrastructure":  "12_Architecture_Infrastructure",
    "16_AI_Ops":                       "13_AI_Ops",
    "11_RAG_Systems":                  "14_RAG_Systems",
    "13_Agent_Production":             "15_Agent_Production",
    "17_AI_Coding":                    "16_AI_Coding",
    "19_Ethics_Safety":                "17_Ethics_Safety",
    "20_AI_Applications_Industry":     "18_AI_Applications_Industry",
    "21_Talks":                        "19_Talks",
    "22_Papers":                       "20_Papers",
    "23_Interviews":                   "21_Interviews",
}

KG_RENAME = {
    "concepts":   "_concepts",
    "synthesis":  "_synthesis",
    "references": "_references",
}

NESTED_RENAME = {
    "13_Agent_Production/16_Agent_Evaluation":   "15_Agent_Production/Agent_Evaluation",
    "13_Agent_Production/23_OpenClaw_Ecosystem": "15_Agent_Production/OpenClaw_Ecosystem",
    "17_AI_Coding/01_Theory":                    "16_AI_Coding/Theory",
    "17_AI_Coding/02_Tools":                     "16_AI_Coding/Tools",
    "17_AI_Coding/03_Practice":                  "16_AI_Coding/Practice",
    "17_AI_Coding/04_Methodology":               "16_AI_Coding/Methodology",
}

# 04↔05 对调：(旧名A, 新名A, 占位中间名) —— 新名A 与另一旧名冲突，需中转
SWAP_PAIRS = [
    ("04_NLP_LLMs", "05_NLP_LLMs", "__tmp_04_swap"),
]

# 知识图谱层 exclude 列表（供 check_links.py / fix_links.py 同步）
KG_NEW_DIRS = sorted(KG_RENAME.values())
```

- [ ] **Step 4: 运行测试确认通过**

Run: `cd /Users/ai-guru/Documents/GitHub/ai-guru-global/ai-guru-database && python3 -m pytest _tools/tests/test_restructure_2026.py -v`
Expected: PASS — 4 个测试通过。

- [ ] **Step 5: Commit**

```bash
git add _tools/restructure_2026.py _tools/tests/test_restructure_2026.py
git commit -m "feat(restructure): 迁移脚本骨架与映射表（含完备性测试）"
```

---

## Task 2: 实现 dry-run 预检（输出计划表）

**Files:**
- Modify: `_tools/restructure_2026.py`（新增 `dry_run()` 与 `build_rewrite_rules()`）
- Test: `_tools/tests/test_restructure_2026.py`（新增测试）

- [ ] **Step 1: 写失败测试 — rewrite 规则有序且边界正确**

Append to `_tools/tests/test_restructure_2026.py`:
```python
def test_build_rewrite_rules_longest_prefix_first():
    """重写规则必须按「旧路径长度降序」排列，避免短前缀误伤长前缀。"""
    rules = rs.build_rewrite_rules()
    old_lens = [len(old) for old, _ in rules]
    assert old_lens == sorted(old_lens, reverse=True), \
        f"规则未按长度降序: {old_lens}"


def test_build_rewrite_rules_nested_before_top_level():
    """嵌套规则必须排在顶层规则之前。"""
    rules = rs.build_rewrite_rules()
    old_patterns = [old for old, _ in rules]
    # 13_Agent_Production/16_Agent_Evaluation 必须在 13_Agent_Production 之前
    nested_idx = old_patterns.index("13_Agent_Production/16_Agent_Evaluation")
    top_idx = old_patterns.index("13_Agent_Production")
    assert nested_idx < top_idx


def test_build_rewrite_rules_no_target_is_prefix_of_another_target():
    """新值不会成为另一新值的前缀（避免链式误伤）。"""
    rules = rs.build_rewrite_rules()
    new_vals = sorted(new for _, new in rules)
    for i, a in enumerate(new_vals):
        for b in new_vals[i+1:]:
            assert not b.startswith(a), f"'{a}' 是 '{b}' 的前缀，可能链式误伤"
```

- [ ] **Step 2: 运行测试确认失败**

Run: `python3 -m pytest _tools/tests/test_restructure_2026.py -v`
Expected: FAIL — `AttributeError: module has no attribute 'build_rewrite_rules'`

- [ ] **Step 3: 实现 build_rewrite_rules 与 dry_run**

Append to `_tools/restructure_2026.py`:
```python
def build_rewrite_rules():
    """构造 wikilink/内链重写规则列表 [(old, new), ...]，最长前缀优先。

    顺序：NESTED_RENAME → KG_RENAME → TOP_LEVEL_RENAME，每组内按长度降序。
    """
    rules = []
    for mapping in (NESTED_RENAME, KG_RENAME, TOP_LEVEL_RENAME):
        group = sorted(mapping.items(), key=lambda kv: len(kv[0]), reverse=True)
        rules.extend(group)
    return rules


def _git(args, cwd=REPO_ROOT):
    """运行 git 命令，失败则抛错。"""
    result = subprocess.run(["git"] + args, cwd=str(cwd),
                            capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} 失败:\n{result.stderr}")
    return result.stdout.strip()


def dry_run(out_csv=REPO_ROOT / "_tools" / "rename_plan.csv"):
    """Phase A：输出重命名计划表，不做写操作。"""
    rules = build_rewrite_rules()
    rows = []
    for old, new in rules:
        old_abs = REPO_ROOT / old
        exists = old_abs.exists()
        # 统计含该旧路径的文件数（wikilink + md link）
        ref_count = 0
        if exists:
            ref_count = _count_refs(old)
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


def _count_refs(path_fragment):
    """统计含 path_fragment 的 .md 文件数（粗略，用于 dry-run 报告）。"""
    count = 0
    for root, dirs, files in os.walk(REPO_ROOT):
        dirs[:] = [d for d in dirs if d not in
                   {'.git', 'Web', 'node_modules', '.venv'} and not d.startswith('.')]
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
```

- [ ] **Step 4: 运行测试确认通过**

Run: `python3 -m pytest _tools/tests/test_restructure_2026.py -v`
Expected: PASS — 7 个测试。

- [ ] **Step 5: 手动跑一次 dry-run 并人工 review**

Run: `python3 _tools/restructure_2026.py dry-run`
Expected: 输出 `dry-run 完成：31 条规则，NN 条需变更`（31 = 22 顶层 + 3 KG + 6 嵌套）。打开 `_tools/rename_plan.csv` 检查每条 `old→new` 与映射表一致、`exists=True`。

- [ ] **Step 6: Commit**

```bash
git add _tools/restructure_2026.py _tools/tests/test_restructure_2026.py _tools/rename_plan.csv
git commit -m "feat(restructure): dry-run 预检与有序重写规则"
```

---

## Task 3: 实现 rename 阶段（git mv，含 04↔05 对调）

**Files:**
- Modify: `_tools/restructure_2026.py`（新增 `rename()`）
- Test: `_tools/tests/test_restructure_2026.py`

- [ ] **Step 1: 写失败测试 — 对调三步法顺序**

Append to `_tools/tests/test_restructure_2026.py`:
```python
import tempfile, shutil

def test_plan_swap_steps_for_04_05(tmp_path, monkeypatch):
    """04↔05 对调必须产生三步：A→tmp, B→new_A, tmp→new_B。"""
    monkeypatch.setattr(rs, "REPO_ROOT", tmp_path)
    (tmp_path / "04_NLP_LLMs").mkdir()
    (tmp_path / "05_Computer_Vision").mkdir()

    calls = []
    monkeypatch.setattr(rs, "_git",
                        lambda args, cwd=None: calls.append(args) or "")

    rs.rename(commit=False)
    # 提取所有 mv 调用的 (src, dst)
    mvs = [(a[1], a[2]) for a in calls if a[:1] == ["mv"]]
    swap_mvs = [(s, d) for s, d in mvs
                if "NLP_LLMs" in s or "Computer_Vision" in s]
    assert len(swap_mvs) == 3, f"对调应为 3 步，实际 {len(swap_mvs)}: {swap_mvs}"
    assert swap_mvs[0][1].startswith("__tmp"), f"第1步应为 A→tmp: {swap_mvs[0]}"
    assert swap_mvs[1] == ("05_Computer_Vision", "05_NLP_LLMs"), \
        f"第2步应为 B→新A位: {swap_mvs[1]}"
    assert swap_mvs[2][1] == "04_Computer_Vision", \
        f"第3步应为 tmp→新B位: {swap_mvs[2]}"


def test_rename_skips_noop_entries(tmp_path, monkeypatch):
    """old==new 的映射不应产生 git mv。"""
    monkeypatch.setattr(rs, "REPO_ROOT", tmp_path)
    (tmp_path / "00_AI_Introduction").mkdir()
    calls = []
    monkeypatch.setattr(rs, "_git",
                        lambda args, cwd=None: calls.append(args) or "")
    rs.rename(commit=False)
    mvs = [(a[1], a[2]) for a in calls if a[:1] == ["mv"]]
    noop = [m for m in mvs if m[0] == m[1]]
    assert noop == [], f"产生 no-op mv: {noop}"
```

- [ ] **Step 2: 运行测试确认失败**

Run: `python3 -m pytest _tools/tests/test_restructure_2026.py -v`
Expected: FAIL — `AttributeError: module has no attribute 'rename'`

- [ ] **Step 3: 实现 rename()**

Append to `_tools/restructure_2026.py`:
```python
def rename(commit=True):
    """Phase B：git mv 重命名目录，保留历史。

    顺序：先 NESTED（子目录），再 KG，再 TOP_LEVEL（处理 04↔05 对调）。
    每个顶层章节一个 commit（当 commit=True）。
    """
    # 1) 嵌套子目录（必须先于父目录改名，否则路径失效）
    for old, new in NESTED_RENAME.items():
        if (REPO_ROOT / old).exists():
            _git(["mv", old, new])
    if commit:
        _git(["add", "-A"]); _git(["commit", "-m",
            "refactor(restructure): 嵌套子目录去编号前缀（13/17）"])

    # 2) 知识图谱层加 _ 前缀
    for old, new in KG_RENAME.items():
        if (REPO_ROOT / old).exists():
            _git(["mv", old, new])
    if commit:
        _git(["add", "-A"]); _git(["commit", "-m",
            "refactor(restructure): 知识图谱层加 _ 前缀"])

    # 3) 顶层章节重命名
    # 3a) 收集需变更的 (old, new) 对（排除 old==new 的 no-op）
    pending = [(o, n) for o, n in TOP_LEVEL_RENAME.items() if o != n]
    # 3b) 检测双向冲突：A 的新名 == B 的旧名（典型 04↔05 对调）
    new_to_old = {n: o for o, n in pending}
    done = set()
    for old, new in pending:
        if old in done:
            continue
        if new in new_to_old and new_to_old[new] != old:
            # 双向冲突：三步法（old→tmp, other_old→new, tmp→other_new）
            other_old = new_to_old[new]
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
```

**对调逻辑说明**（04↔05 为例）：
- `old=04_NLP_LLMs, new=05_NLP_LLMs`；检测到 `05_NLP_LLMs` 是 `other_old=05_Computer_Vision` 的旧名 → 触发三步法
- Step i: `git mv 04_NLP_LLMs __tmp_swap_04`（腾位）
- Step ii: `git mv 05_Computer_Vision 05_NLP_LLMs`（CV 占用新 05 位）
- Step iii: `git mv __tmp_swap_04 04_Computer_Vision`（NLP 落到新 04 位——即 other_new）

- [ ] **Step 4: 运行测试确认通过**

Run: `python3 -m pytest _tools/tests/test_restructure_2026.py -v`
Expected: PASS — 9 个测试。

- [ ] **Step 5: Commit（仅脚本与测试，尚未执行 rename）**

```bash
git add _tools/restructure_2026.py _tools/tests/test_restructure_2026.py
git commit -m "feat(restructure): rename 阶段（git mv + 04↔05 对调三步法）"
```

---

## Task 4: 实现 rewrite-links 阶段（wikilink + md 内链全量重写）

**Files:**
- Modify: `_tools/restructure_2026.py`（新增 `rewrite_links()`）
- Test: `_tools/tests/test_restructure_2026.py`

- [ ] **Step 1: 写失败测试 — wikilink 与 md link 都被重写，正文不误伤**

Append to `_tools/tests/test_restructure_2026.py`:
```python
def test_rewrite_links_handles_wikilink_and_mdlink(tmp_path, monkeypatch):
    """wikilink [[04_NLP_LLMs/x]] 与 md link ](04_NLP_LLMs/x) 都要改，正文不改。"""
    monkeypatch.setattr(rs, "REPO_ROOT", tmp_path)
    doc = tmp_path / "doc.md"
    doc.write_text(
        "见 [[04_NLP_LLMs/LLM_Fundamentals]] 和 "
        "[链接](04_NLP_LLMs/README.md)。\n"
        "正文提及 04_NLP_LLMs 不应被改。\n", encoding="utf-8")

    rs.rewrite_links_in_file(doc)

    text = doc.read_text(encoding="utf-8")
    assert "05_NLP_LLMs/LLM_Fundamentals" in text  # wikilink 改了
    assert "05_NLP_LLMs/README.md" in text          # md link 改了
    assert "正文提及 04_NLP_LLMs 不应被改" in text  # 正文未动


def test_rewrite_links_nested_before_top_level(tmp_path, monkeypatch):
    """嵌套路径必须在顶层路径之前替换。"""
    monkeypatch.setattr(rs, "REPO_ROOT", tmp_path)
    doc = tmp_path / "doc.md"
    doc.write_text("[[13_Agent_Production/16_Agent_Evaluation/x]]",
                   encoding="utf-8")
    rs.rewrite_links_in_file(doc)
    assert "15_Agent_Production/Agent_Evaluation/x" in doc.read_text("utf-8")


def test_rewrite_links_boundary_no_partial_match(tmp_path, monkeypatch):
    """104_NLP_LLMs（假设）不应被 04_NLP_LLMs 规则误伤。"""
    monkeypatch.setattr(rs, "REPO_ROOT", tmp_path)
    doc = tmp_path / "doc.md"
    doc.write_text("[[104_NLP_LLMs/x]]", encoding="utf-8")
    rs.rewrite_links_in_file(doc)
    # 104_ 不应变成 105_（边界匹配）
    assert "104_NLP_LLMs/x" in doc.read_text("utf-8")
```

- [ ] **Step 2: 运行测试确认失败**

Run: `python3 -m pytest _tools/tests/test_restructure_2026.py -v`
Expected: FAIL — `AttributeError: module has no attribute 'rewrite_links_in_file'`

- [ ] **Step 3: 实现 rewrite_links_in_file 与 rewrite_links**

Append to `_tools/restructure_2026.py`:
```python
def rewrite_links_in_file(filepath):
    """对单个 .md 文件应用重写规则，仅作用于 [[...]] 与 ](... ) 内的路径。

    使用边界匹配 (?<![A-Za-z0-9_]) 和 (?![A-Za-z0-9_]) 防止部分匹配。
    按规则表（最长前缀优先）依次替换。
    返回替换次数。
    """
    rules = build_rewrite_rules()
    path_obj = Path(filepath)
    text = path_obj.read_text(encoding="utf-8", errors="ignore")
    original = text

    # 匹配 [[内容]] 或 ](内容) 中的路径段
    # 策略：对每条规则，用正则定位「链接上下文」内的旧路径并替换
    for old, new in rules:
        if old == new:
            continue
        # 边界：旧路径左侧不能是 [A-Za-z0-9_]，右侧同理
        pattern = re.compile(
            r"(?<![A-Za-z0-9_])" + re.escape(old) + r"(?![A-Za-z0-9_])"
        )
        # 只在 [[...]] 或 ](... ) 片段内替换
        def _replace_in_links(m, _pat=pattern, _old=old, _new=new):
            return _pat.sub(_new, m.group(0))

        # [[wiki links]]
        text = re.sub(r"\[\[[^\]]+\]\]", _replace_in_links, text)
        # [text](link)  —— 只替换括号内
        text = re.sub(r"\]\([^)]+\)", _replace_in_links, text)

    if text != original:
        path_obj.write_text(text, encoding="utf-8")
    return sum(1 for o, n in rules if o != n and o in original)
```

并新增顶层入口 `rewrite_links()`:
```python
EXCLUDE_DIRS = {'.git', 'Web', 'node_modules', '.venv', '.qoder',
                '.obsidian', '.github', '__pycache__'}


def rewrite_links():
    """Phase C：遍历全库 .md 文件，重写 wikilink 与 md 内链。"""
    changed_files = 0
    for root, dirs, files in os.walk(REPO_ROOT):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS
                   and not d.startswith('.')]
        for fn in files:
            if not fn.endswith('.md'):
                continue
            fp = Path(root) / fn
            n = rewrite_links_in_file(fp)
            if n:
                changed_files += 1
    print(f"rewrite-links 完成：{changed_files} 个文件被修改")
    return changed_files
```

- [ ] **Step 4: 运行测试确认通过**

Run: `python3 -m pytest _tools/tests/test_restructure_2026.py -v`
Expected: PASS — 12 个测试。

- [ ] **Step 5: Commit**

```bash
git add _tools/restructure_2026.py _tools/tests/test_restructure_2026.py
git commit -m "feat(restructure): rewrite-links 阶段（wikilink+内链边界安全替换）"
```

---

## Task 5: 实现 verify 阶段与 CLI 入口

**Files:**
- Modify: `_tools/restructure_2026.py`（新增 `verify()` 与 `main()`）
- Test: `_tools/tests/test_restructure_2026.py`

- [ ] **Step 1: 写失败测试 — verify 比对基线断链数**

在 `_tools/tests/test_restructure_2026.py` 顶部确认有 `import json`，然后在文件末尾追加：
```python
def _baseline_json(broken):
    """构造基线 JSON 字符串供 verify 测试使用。"""
    return json.dumps({
        "broken_links_before": broken,
        "files_checked": 1216,
        "internal_links": 9101,
    })


def test_verify_reads_baseline_and_compares(tmp_path, monkeypatch):
    """verify 应读取基线并报告断链数是否恶化。"""
    monkeypatch.setattr(rs, "REPO_ROOT", tmp_path)
    baseline = tmp_path / "_tools" / "_baseline-2026-06-19.json"
    baseline.parent.mkdir(parents=True, exist_ok=True)
    baseline.write_text(_baseline_json(broken=3), encoding="utf-8")

    # mock check_links 返回 broken=2（≤ 基线 3，应判定 OK）
    monkeypatch.setattr(rs, "_run_check_links",
                        lambda: {"broken": 2, "total": 9101, "files": 1216})

    report_path = rs.verify()
    assert report_path.exists()
    content = report_path.read_text(encoding="utf-8")
    assert "断链未恶化" in content  # 2 <= 3


def test_verify_reports_worsening(tmp_path, monkeypatch):
    """断链恶化时报告应标记需排查。"""
    monkeypatch.setattr(rs, "REPO_ROOT", tmp_path)
    baseline = tmp_path / "_tools" / "_baseline-2026-06-19.json"
    baseline.parent.mkdir(parents=True, exist_ok=True)
    baseline.write_text(_baseline_json(broken=1), encoding="utf-8")

    monkeypatch.setattr(rs, "_run_check_links",
                        lambda: {"broken": 5, "total": 9101, "files": 1216})

    report_path = rs.verify()
    content = report_path.read_text(encoding="utf-8")
    assert "断链恶化" in content  # 5 > 1
```

- [ ] **Step 2: 运行测试确认失败**

Run: `python3 -m pytest _tools/tests/test_restructure_2026.py -v`
Expected: FAIL — `AttributeError: module has no attribute 'verify' or '_run_check_links'`

- [ ] **Step 3: 实现 verify 与 main**

Append to `_tools/restructure_2026.py`:
```python
def _run_check_links():
    """调用 check_links.py 并解析输出，返回 dict。"""
    script = REPO_ROOT / "_tools" / "check_links.py"
    r = subprocess.run([sys.executable, str(script), str(REPO_ROOT)],
                       capture_output=True, text=True)
    out = r.stdout
    # 解析 "Checked N files, M internal links" 与 "Found K broken links"
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
```

- [ ] **Step 4: 运行测试确认通过**

Run: `python3 -m pytest _tools/tests/test_restructure_2026.py -v`
Expected: PASS — 14 个测试。

- [ ] **Step 5: Commit**

```bash
git add _tools/restructure_2026.py _tools/tests/test_restructure_2026.py
git commit -m "feat(restructure): verify 阶段与 CLI 入口"
```

---

## Task 6: 同步更新 _tools 现有脚本的 exclude 列表

**Files:**
- Modify: `_tools/check_links.py:8`
- Modify: `_tools/fix_links.py:88-91`
- Modify: `_tools/fix_links.py:9-26`（FIXES 字典路径前缀）

- [ ] **Step 1: 更新 check_links.py exclude 集合**

Edit `_tools/check_links.py` line 8, replace:
```python
    exclude = {'.git', 'Web', 'synthesis', '_archives', '_raw', '_staging',
               'node_modules', '.venv', '.qoder', '.obsidian', '.github'}
```
with:
```python
    exclude = {'.git', 'Web', '_synthesis', '_archives', '_raw', '_staging',
               'node_modules', '.venv', '.qoder', '.obsidian', '.github'}
```

- [ ] **Step 2: 更新 fix_links.py exclude 集合**

Edit `_tools/fix_links.py` lines 88-91, replace:
```python
    exclude = {'.git', 'Web', 'synthesis', '_archives', '_raw', '_staging',
               'node_modules', '.venv', '.qoder', '.obsidian', '.github',
               'concepts', 'entities', 'journal', 'projects',
               'references', 'skills'}
```
with:
```python
    exclude = {'.git', 'Web', '_synthesis', '_archives', '_raw', '_staging',
               'node_modules', '.venv', '.qoder', '.obsidian', '.github',
               '_concepts', 'entities', 'journal', 'projects',
               '_references', 'skills'}
```

- [ ] **Step 3: 说明 FIXES 字典处理策略**

`fix_links.py` 的 `FIXES` 字典（第 9-26 行）含旧章节前缀如 `04_NLP_LLMs/...`、`09_Deployment_Inference/...`。这些路径在 rename 后会失效。

**策略**：在 Task 8 执行 rewrite-links 后，FIXES 字典内的路径会被脚本连同文档一起重写——但 fix_links.py 是脚本不是 .md，不会被 rewrite_links 处理。因此需要**手动**更新 FIXES 键，或更稳妥地：**清空 FIXES 字典**（这些是历史一次性修复，重构后路径已变，保留过时映射有害无益）。

Edit `_tools/fix_links.py` lines 9-26, replace the entire `FIXES = { ... }` block with:
```python
# 历史修复映射已于 2026-06 重构后清空（章节重编号使旧路径失效）。
# 新增修复请在确认新路径后单独添加。
FIXES = {}
```

- [ ] **Step 4: Commit**

```bash
git add _tools/check_links.py _tools/fix_links.py
git commit -m "fix(restructure): 同步 _tools 脚本 exclude 列表与 FIXES 字典"
```

---

## Task 7: 执行 dry-run 最终预检（人工 review 关卡）

**Files:** Read-only，产出 `_tools/rename_plan.csv`

- [ ] **Step 1: 运行 dry-run**

Run: `python3 _tools/restructure_2026.py dry-run`
Expected: `dry-run 完成：31 条规则，NN 条需变更`。

- [ ] **Step 2: 人工 review rename_plan.csv**

Open `_tools/rename_plan.csv`，逐行核对：
- 每条 `old` 在仓库中 `exists=True`
- `old→new` 与实施计划映射表一致
- `04_NLP_LLMs→05_NLP_LLMs` 与 `05_Computer_Vision→04_Computer_Vision` 同时存在（对调）
- `referenced_files` 列无异常为 0 的需变更项（可能说明路径写错）

- [ ] **Step 3: 确认无误后继续；若有问题，回 Task 1-2 修映射表**

**这是执行 rename 前的最后一道人工关卡。未通过不得进入 Task 8。**

---

## Task 8: 执行 rename 阶段（分章 commit）

**Files:** 全部顶层章节目录（git mv）

- [ ] **Step 1: 执行 rename**

Run: `python3 _tools/restructure_2026.py rename`
Expected: 脚本按「嵌套 → KG → 顶层（含对调三步法）」顺序执行 git mv，每章一个 commit。

- [ ] **Step 2: 验证目录结构**

Run:
```bash
ls -d [0-9][0-9]_* | sort
ls -d _concepts _synthesis _references
```
Expected:
- 顶层章节为 `00_AI_Introduction ... 21_Interviews` 连续无缺口
- `_concepts`、`_synthesis`、`_references` 存在；旧 `concepts/`、`synthesis/`、`references/` 不存在

- [ ] **Step 3: 验证嵌套子目录已去编号**

Run:
```bash
ls 15_Agent_Production/ | grep -E '^[0-9]+_'   # 应无输出
ls 16_AI_Coding/ | grep -E '^[0-9]+_'          # 应无输出
```
Expected: 两条 grep 均无输出（子目录已改为 `Agent_Evaluation`/`OpenClaw_Ecosystem`/`Theory`/`Tools`/`Practice`/`Methodology`）。

- [ ] **Step 4: 验证 git 历史可追溯**

Run:
```bash
git log --oneline -5
git log --follow --oneline 05_NLP_LLMs/README.md | head -3
```
Expected: 能看到 rename commit；`--follow` 跨重命名追踪到历史。

- [ ] **Step 5: 暂不 commit（rename 阶段内部已 commit）**

如发现问题，单章回滚：`git revert <commit-sha>`。

---

## Task 9: 执行 rewrite-links 阶段（全量重写 wikilink/内链）

**Files:** 全库 ~1,216 个 .md 文件

- [ ] **Step 1: 执行 rewrite-links**

Run: `python3 _tools/restructure_2026.py rewrite-links`
Expected: `rewrite-links 完成：NNN 个文件被修改`（NNN 应为数百量级）。

- [ ] **Step 2: 抽样验证 wikilink 已更新**

Run:
```bash
# 任意文档中不应再出现旧顶层编号（04_NLP_LLMs 等，注意排除 04_Computer_Vision 新名）
rg '\[\[04_NLP_LLMs' --type md -l | head   # 应无输出
rg '\[\[05_Computer_Vision' --type md -l | head  # 应无输出
rg '\[\[13_Agent_Production/16_' --type md -l    # 应无输出
# 新路径应大量出现
rg '\[\[05_NLP_LLMs' --type md -c | head -3
```
Expected: 旧前缀 wikilink 为 0；新前缀 wikilink 大量存在。

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor(restructure): 全量重写 wikilink 与 md 内链（~9000 链接）

按映射表对 [[...]] 与 ](...) 内的路径前缀做边界安全替换，
正文文本不受影响。"
```

---

## Task 10: 去重与归位（手动文件操作）

**Files:**
- Delete: `_evaluation-2026-06-15.md`（根）
- Delete: `_staging/hot.md`
- Move: `_meta/synthesis-*.md`（4 个）→ `_synthesis/`
- Move: `_meta/cheatsheet-*.md`（3 个）→ `_meta/cheatsheets/`

- [ ] **Step 1: 确认根 _evaluation 与 _meta 副本完全相同**

Run:
```bash
diff _evaluation-2026-06-15.md _meta/_evaluation-2026-06-15.md && echo "IDENTICAL" || echo "DIFFER"
```
Expected: `IDENTICAL`。若 DIFFER，停止并人工核对保留哪个。

- [ ] **Step 2: 删除根目录重复 _evaluation**

Run: `git rm _evaluation-2026-06-15.md`

- [ ] **Step 3: 删除 _staging 过期 hot.md**

Run:
```bash
diff hot.md _staging/hot.md >/dev/null && echo "SAME" || echo "DIFFER"
git rm _staging/hot.md
```
Expected: `DIFFER`（已知不同步），删除 `_staging/hot.md`，保留根 `hot.md` 作为入口。

- [ ] **Step 4: 归位 _meta 内 synthesis-*.md**

Run:
```bash
mkdir -p _synthesis
for f in _meta/synthesis-*.md; do git mv "$f" "_synthesis/$(basename $f)"; done
```

- [ ] **Step 5: 归位 _meta 内 cheatsheet-*.md**

Run:
```bash
mkdir -p _meta/cheatsheets
for f in _meta/cheatsheet-*.md; do git mv "$f" "_meta/cheatsheets/$(basename $f)"; done
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor(restructure): 去重（根 _evaluation / _staging hot.md）与 _meta 错位文件归位"
```

---

## Task 11: 更新 Web/src 源码硬编码路径

**Files:**
- Modify: `Web/src/data/docMap.ts`
- Modify: `Web/src/data/k8sEvalData.ts`
- Modify: `Web/src/features/docs/TopicTagPanel.test.tsx`

- [ ] **Step 1: 定位全部硬编码章节路径**

Run:
```bash
rg -n '[0-9]{2}_[A-Z][a-zA-Z_]+' Web/src/ | head -40
```
Review 输出，记录每个旧路径出现位置。

- [ ] **Step 2: 用脚本统一替换 Web/src 内路径**

由于 Web/src 是 TypeScript，wikilink 脚本不覆盖。手动或用 sed 按映射表替换。示例（对 docMap.ts）：
```bash
# 按映射表逐条替换（在 Web/src/ 下，路径作为字符串值出现）
python3 - <<'PY'
import re, pathlib
mapping = {
  "04_NLP_LLMs":"05_NLP_LLMs", "05_Computer_Vision":"04_Computer_Vision",
  "15_Testing":"09_Testing", "09_Deployment_Inference":"10_Deployment_Inference",
  "10_MLOps_Pipeline":"11_MLOps_Pipeline", "16_AI_Ops":"13_AI_Ops",
  "11_RAG_Systems":"14_RAG_Systems", "13_Agent_Production":"15_Agent_Production",
  "17_AI_Coding":"16_AI_Coding", "19_Ethics_Safety":"17_Ethics_Safety",
  "20_AI_Applications_Industry":"18_AI_Applications_Industry",
  "21_Talks":"19_Talks", "22_Papers":"20_Papers", "23_Interviews":"21_Interviews",
}
# 最长键优先，边界匹配
rules = sorted(mapping.items(), key=lambda kv: len(kv[0]), reverse=True)
for fp in pathlib.Path("Web/src").rglob("*.ts*"):
    t = fp.read_text(encoding="utf-8")
    o = t
    for old, new in rules:
        t = re.sub(r"(?<![A-Za-z0-9_])"+re.escape(old)+r"(?![A-Za-z0-9_])", new, t)
    if t != o:
        fp.write_text(t, encoding="utf-8")
        print("updated", fp)
PY
```

- [ ] **Step 3: 验证替换结果**

Run: `rg -n '04_NLP_LLMs|09_Deployment_Inference|13_Agent_Production' Web/src/`
Expected: 无输出（旧路径全消失）。

- [ ] **Step 4: 运行前端测试确认未破坏**

Run:
```bash
cd Web && npm test -- --run TopicTagPanel 2>&1 | tail -20
```
Expected: TopicTagPanel 测试通过（若测试本身含旧路径断言，已在 Step 2 一并更新）。

- [ ] **Step 5: Commit**

```bash
git add Web/src/
git commit -m "refactor(restructure): 更新 Web/src 硬编码章节路径"
```

---

## Task 12: 更新 README / ROADMAP / hot.md / 规范文档

**Files:**
- Modify: `README.md`（章节导航表 L296-334、统计表 L107-135、内链）
- Modify: `ROADMAP.md`
- Modify: `hot.md`
- Modify: `_meta/_directory-conventions.md`（重写第二、三、四节）

- [ ] **Step 1: rewrite_links 已处理 wikilink，但检查 README 表格内的纯文本旧编号**

Run:
```bash
rg -n '^\| \*\*[0-9]{2}\*\*' README.md | head
```
Review 章节导航表，确认行内编号与目录名是否需手动更新（表格是纯文本，wikilink 脚本不改）。

- [ ] **Step 2: 重写 README 章节导航表（L296-334）**

将表格按新映射表更新。示例替换 `| **05** [计算机视觉](./05_Computer_Vision/)` → `| **04** [计算机视觉](./04_Computer_Vision/)`，依此类推全部 22 行。注意 04↔05 对调、Testing 15→09、各章新编号。

- [ ] **Step 3: 更新 README 统计表（L107-135）**

表格左列目录名按新名更新，行序按新编号重排。

- [ ] **Step 4: 更新 ROADMAP.md**

Run: `rg -n '[0-9]{2}_[A-Z]' ROADMAP.md`
逐处更新为新路径。

- [ ] **Step 5: 更新 hot.md 内部链接**

Run:
```bash
rg -n '\]\([0-9]{2}_[A-Z]' hot.md
rg -n '\[\[[0-9]{2}_[A-Z]' hot.md
```
若仍有旧前缀（rewrite_links 应已处理 wikilink，但 markdown link `](./04_...)` 也已处理），确认无残留。

- [ ] **Step 6: 重写 _directory-conventions.md 第二、三、四节**

Edit `_meta/_directory-conventions.md`:
- 第二节「主知识章节（00-23）」改为「主知识章节（00-21，6 层架构）」，表格按新映射表重写，增加「层级」列（基础/模型/工程/平台/应用/治理/资源）
- 第三节辅助章节 90-94 不变
- 第四节「知识图谱层」：concepts/synthesis/references → `_concepts/_synthesis/_references`
- 新增说明：`_meta/cheatsheets/` 子目录用途；`hot.md` 为正式入口（非暂存）

- [ ] **Step 7: Commit**

```bash
git add README.md ROADMAP.md hot.md _meta/_directory-conventions.md
git commit -m "docs(restructure): 更新 README/ROADMAP/hot/规范文档反映新结构"
```

---

## Task 13: 重生成 manifest 与 index，Web 重建，最终校验

**Files:**
- Regenerate: `.manifest.json`、`index.md`
- Regenerate: `Web/public/mkdocs/`（481 HTML）

- [ ] **Step 1: 重生成 .manifest.json（若有生成脚本）**

Run:
```bash
ls _tools/ | grep -i manifest    # 查找 manifest 生成脚本
# 若有 generate_manifest.py:
python3 _tools/generate_manifest.py 2>/dev/null || echo "无 manifest 生成脚本，手动确认 .manifest.json 路径键"
rg -o '"[0-9]{2}_[A-Za-z_]+' .manifest.json | sort -u
```
若 .manifest.json 仍含旧路径键，用与 Task 11 相同的 Python 替换逻辑更新 `.manifest.json`（JSON 文件，正则边界替换安全）。

- [ ] **Step 2: 重生成 index.md**

Run:
```bash
ls _tools/ | grep -iE 'index|wiki'
# 若有 wiki 索引生成脚本，运行它；否则用 rewrite_links 同源逻辑更新 index.md 内的 [[...]]
python3 _tools/restructure_2026.py rewrite-links  # 已包含 index.md
```
确认 index.md 内路径已更新（`rg '04_NLP_LLMs' index.md` 应无输出）。

- [ ] **Step 3: Web 重建**

Run:
```bash
cd Web && npm install --silent && npm run build 2>&1 | tail -10
```
Expected: 构建成功，`Web/public/mkdocs/` 下 HTML 按新路径重新生成。

- [ ] **Step 4: 运行 verify 阶段**

Run: `python3 _tools/restructure_2026.py verify`
Expected: `verify 完成：断链 N（基线 M）→ OK`，N ≤ M。报告写入 `_meta/_post-restructure-2026-06-19.md`。

- [ ] **Step 5: 跑 check_links 最终确认**

Run: `python3 _tools/check_links.py . | head -2`
Expected: `Checked N files, M internal links` 且 `Found K broken links` 中 K ≤ 基线。

- [ ] **Step 6: 验收清单逐项核对**

逐条检查 spec 第 6 节验收标准：
1. 顶层章节连续 00–21：`ls -d [0-9][0-9]_* | grep -v '^9' | sort`
2. 规范文档反映新结构：`head -60 _meta/_directory-conventions.md`
3. 无重复文件：`ls _evaluation*.md 2>/dev/null`（根应无）、`ls _staging/hot.md 2>/dev/null`（应无）
4. 13/17 内部无编号前缀：`ls 15_Agent_Production/ 16_AI_Coding/ | grep -E '^[0-9]+_'`（应无）
5. KG 加 _ 前缀：`ls -d _concepts _synthesis _references`
6. 断链 ≤ 基线：见 Step 5
7. manifest/index 路径正确：`rg '04_NLP_LLMs' .manifest.json index.md`（应无）
8. Web/src 路径键更新：`rg '04_NLP_LLMs' Web/src/`（应无）
9. README 导航表一致：肉眼比对
10. 每章独立 commit：`git log --oneline | grep restructure`

- [ ] **Step 7: Commit 剩余产物**

```bash
git add -A
git commit -m "chore(restructure): 重生成 manifest/index，Web 重建，验证通过"
```

- [ ] **Step 8: 合并到 main（可选，等用户确认）**

```bash
git checkout main
git merge --no-ff refactor/directory-restructure-2026 -m "merge: 知识库目录结构重构（分层架构式重编号 00-21）"
```
**此步需用户确认后执行。**

---

## 回滚预案

| 阶段 | 回滚方式 |
|------|----------|
| rename 单章出错 | `git revert <该章 commit-sha>` |
| rewrite-links 引入错误 | `git revert <rewrite commit-sha>` 或 `git checkout HEAD~1 -- <file>` |
| 整体重构放弃 | `git checkout main && git branch -D refactor/directory-restructure-2026` |
| dry-run 发现代码问题 | 仅脚本与测试，`git reset --hard HEAD~N` 回到 Task 0 |

**关键原则**：每个 Task 一个 commit，rename 内部每章一个 commit，任何阶段失败都可精确回滚到上一检查点，不影响已完成的正确部分。
