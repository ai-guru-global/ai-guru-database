"""迁移脚本 restructure_2026 的单元测试。

覆盖 Task 1-5：映射表完备性、dry-run、rename（含 04↔05 对调）、
rewrite-links（边界安全）、verify（基线比对）。
"""
import importlib.util
import json
import shutil
from pathlib import Path

# 直接从文件加载模块（脚本不在包内，避免 import 路径问题）
SCRIPT = Path(__file__).resolve().parent.parent / "restructure_2026.py"
spec = importlib.util.spec_from_file_location("restructure_2026", SCRIPT)
rs = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rs)


# === Task 1: 映射表完备性 ===

def test_top_level_rename_covers_all_main_chapters():
    """映射表必须覆盖全部现有主章节（00-23，排除 90-94 拓展目录）。"""
    actual_dirs = {
        d.name for d in Path(rs.REPO_ROOT).iterdir()
        if d.is_dir() and len(d.name) > 3 and d.name[:2].isdigit()
        and not d.name.startswith("9")
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


# === Task 2: dry-run 重写规则 ===

def test_build_rewrite_rules_grouped_longest_first_within_group():
    """每组（NESTED→KG→TOP_LEVEL）内部按长度降序，跨组保持优先级。

    嵌套组必须在顶层组之前（嵌套路径需整体替换，不能被父级先截断）。
    组内长度降序避免短前缀误伤同组长前缀。
    """
    rules = rs.build_rewrite_rules()
    # 定位三组边界
    nested_end = next(i for i, (o, _) in enumerate(rules)
                      if o in rs.NESTED_RENAME and i >= len(rs.NESTED_RENAME) - 1)
    # 校验每组内部长度降序
    groups = [
        [(o, n) for o, n in rules if o in rs.NESTED_RENAME],
        [(o, n) for o, n in rules if o in rs.KG_RENAME],
        [(o, n) for o, n in rules if o in rs.TOP_LEVEL_RENAME],
    ]
    for gi, group in enumerate(groups):
        lens = [len(o) for o, _ in group]
        assert lens == sorted(lens, reverse=True), \
            f"组 {gi} 未按长度降序: {lens}"


def test_build_rewrite_rules_nested_before_top_level():
    """嵌套规则必须排在顶层规则之前。"""
    rules = rs.build_rewrite_rules()
    old_patterns = [old for old, _ in rules]
    nested_idx = old_patterns.index("13_Agent_Production/16_Agent_Evaluation")
    top_idx = old_patterns.index("13_Agent_Production")
    assert nested_idx < top_idx


def test_build_rewrite_rules_old_values_unique():
    """旧值（规则键）必须唯一，避免同一旧路径被多条规则匹配。"""
    rules = rs.build_rewrite_rules()
    old_vals = [old for old, _ in rules]
    assert len(old_vals) == len(set(old_vals)), \
        f"存在重复的旧路径键: {old_vals}"


# === Task 3: rename（含 04↔05 对调） ===

def _setup_mock_repo(tmp_path, dirs):
    """在 tmp_path 下创建一组目录，模拟仓库结构。"""
    for d in dirs:
        (tmp_path / d).mkdir(parents=True, exist_ok=True)


def test_plan_swap_04_05_no_filename_conflict(tmp_path, monkeypatch):
    """04↔05 对调：目录名后缀不同（NLP vs Computer_Vision），无文件名冲突，
    应为 2 个独立改名，无需 tmp 中转。三步法仅在完全同名对调时才需要。"""
    monkeypatch.setattr(rs, "REPO_ROOT", tmp_path)
    _setup_mock_repo(tmp_path, ["04_NLP_LLMs", "05_Computer_Vision"])

    calls = []
    monkeypatch.setattr(rs, "_git",
                        lambda args, cwd=None: calls.append(args) or "")

    rs.rename(commit=False)
    mvs = [(a[1], a[2]) for a in calls if a[:1] == ["mv"]]
    swap_mvs = [(s, d) for s, d in mvs
                if "NLP_LLMs" in s or "Computer_Vision" in s]
    assert swap_mvs == [
        ("05_Computer_Vision", "04_Computer_Vision"),
        ("04_NLP_LLMs", "05_NLP_LLMs"),
    ], f"对调应为 2 个独立改名: {swap_mvs}"


def test_plan_swap_same_name_uses_three_steps(tmp_path, monkeypatch):
    """真正的同名对调（04_X↔05_X）才需要三步法 tmp 中转。
    构造一个临时映射验证三步逻辑触发。"""
    monkeypatch.setattr(rs, "REPO_ROOT", tmp_path)
    _setup_mock_repo(tmp_path, ["04_Foo", "05_Foo"])
    # 临时注入同名对调映射
    monkeypatch.setattr(rs, "TOP_LEVEL_RENAME", {
        "04_Foo": "05_Foo", "05_Foo": "04_Foo",
    })

    calls = []
    monkeypatch.setattr(rs, "_git",
                        lambda args, cwd=None: calls.append(args) or "")

    rs.rename(commit=False)
    mvs = [(a[1], a[2]) for a in calls if a[:1] == ["mv"]]
    assert len(mvs) == 3, f"同名对调应为 3 步（含 tmp）: {mvs}"
    assert mvs[0][1].startswith("__tmp"), f"第1步应为 A→tmp: {mvs[0]}"


def test_rename_skips_noop_entries(tmp_path, monkeypatch):
    """old==new 的映射不应产生 git mv。"""
    monkeypatch.setattr(rs, "REPO_ROOT", tmp_path)
    _setup_mock_repo(tmp_path, ["00_AI_Introduction"])
    calls = []
    monkeypatch.setattr(rs, "_git",
                        lambda args, cwd=None: calls.append(args) or "")
    rs.rename(commit=False)
    mvs = [(a[1], a[2]) for a in calls if a[:1] == ["mv"]]
    noop = [m for m in mvs if m[0] == m[1]]
    assert noop == [], f"产生 no-op mv: {noop}"


# === Task 4: rewrite-links 边界安全 ===

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
    assert "104_NLP_LLMs/x" in doc.read_text("utf-8")


# === Task 5: verify 基线比对 ===

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
