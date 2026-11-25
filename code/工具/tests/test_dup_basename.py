"""P1-4 fixture：重复 basename 分组、导航/内容分类、歧义裸名检测。"""
import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "dup_basename_report.py"
spec = importlib.util.spec_from_file_location("dup_report_under_test", SCRIPT)
dr = importlib.util.module_from_spec(spec)
spec.loader.exec_module(dr)

GATE = Path(__file__).resolve().parent.parent / "link_gate.py"
gspec = importlib.util.spec_from_file_location("link_gate_under_test", GATE)
lg = importlib.util.module_from_spec(gspec)
gspec.loader.exec_module(lg)


def test_collect_dup_groups_sorted():
    mds = ["19_业界观点/01_关于.md", "21_面试岗位/01_关于.md",
           "05_大模型/README.md", "06_强化学习/README.md", "唯一名.md"]
    groups = dr.collect_dup_groups(mds)
    assert groups["01_关于"] == ["19_业界观点/01_关于", "21_面试岗位/01_关于"]
    assert groups["readme"] == ["05_大模型/README", "06_强化学习/README"]
    assert "唯一名" not in groups


def test_split_nav_by_group_key():
    groups = {
        "readme": ["a/README", "b/README"],                # 导航名 → 导航类
        "01_关于": ["19_业界观点/01_关于", "21_面试岗位/01_关于"],
        "index": ["a/index", "b/index"],
    }
    nav, content = dr.split_nav(groups)
    assert set(nav) == {"readme", "index"}
    assert set(content) == {"01_关于"}


def test_resolve_target_reports_ambiguity():
    rel_index = {"a/notes", "b/notes"}
    name_index = {"notes": ["a/notes", "b/notes"]}
    resolve = lambda t: lg.resolve_target(
        t, rel_index, name_index, {}, set(), lambda t, idx: [])
    resolved, broken, scope, amb = resolve("notes")       # 裸名 → 歧义
    assert resolved == "a/notes" and amb is True
    resolved, broken, scope, amb = resolve("b/notes")     # 全路径 → 无歧义
    assert resolved == "b/notes" and amb is False
    resolved, broken, scope, amb = resolve("ghost")       # 断链不算歧义
    assert broken is True and amb is False


def test_gate_batch_metrics_has_ambiguity():
    assert "ambiguous_basename_links" in lg.BATCH_METRICS
