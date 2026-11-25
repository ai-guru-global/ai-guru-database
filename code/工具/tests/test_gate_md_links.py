"""P0-2B fixture：link_gate 的 md 内部链接检查（真断链 / 根相对裸写 / 显式路径）。

inspect_text 为全文模式与 changed-only 共用入口；md 断链独立指标（不混入
wikilink broken_instances），resolved 并入孤立页入链统计（P1-4）。
"""
import importlib.util
import re
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "link_gate.py"
spec = importlib.util.spec_from_file_location("link_gate_under_test", SCRIPT)
lg = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lg)

SPEC_CW = Path(__file__).resolve().parent.parent / "check_wikilinks.py"
spec_cw = importlib.util.spec_from_file_location("cw_under_test", SPEC_CW)
cw = importlib.util.module_from_spec(spec_cw)
spec_cw.loader.exec_module(cw)

SPEC_FS = Path(__file__).resolve().parent.parent / "fix_spacing.py"
spec_fs = importlib.util.spec_from_file_location("fs_under_test", SPEC_FS)
fs = importlib.util.module_from_spec(spec_fs)
spec_fs.loader.exec_module(fs)


def make_chk(content_root):
    return {
        'CONTENT': str(content_root),
        'WIKILINK': cw.WIKILINK,
        'INLINE_CODE': cw.INLINE_CODE,
        'FENCED_CODE': cw.FENCED_CODE,
        'normalize_target': cw.normalize_target,
        'classify': cw.classify,
        'alias_candidates': cw.alias_candidates,
    }


def inspect(tmp_path, rel, text, rel_index=None, name_index=None):
    chk = make_chk(tmp_path)
    return lg.inspect_text(
        text, chk, fs.fix_spacing,
        rel_index or {}, name_index or {}, {}, set(), rel)


def test_md_missing_flagged(tmp_path):
    (tmp_path / "src.md").write_text("[ghost](GHOST.md)\n", encoding="utf-8")
    info = inspect(tmp_path, "src.md", "[ghost](GHOST.md)\n")
    assert len(info["md_missing"]) == 1
    assert info["md_missing"][0]["target"] == "GHOST.md"
    assert info["md_root_bare"] == []


def test_md_source_relative_resolves_and_counts_as_inlink(tmp_path):
    sub = tmp_path / "sub"
    sub.mkdir()
    (sub / "b.md").write_text("# b\n", encoding="utf-8")
    text = "[b](sub/b.md)\n"
    (tmp_path / "src.md").write_text(text, encoding="utf-8")
    info = inspect(tmp_path, "src.md", text)
    assert info["md_missing"] == []
    assert info["resolved"] == ["sub/b"]  # 孤立页入链统计口径：去 .md 的 wiki 相对路径


def test_md_root_bare_detected(tmp_path):
    d = tmp_path / "d"
    d.mkdir()
    (tmp_path / "b.md").write_text("# b\n", encoding="utf-8")
    (d / "src.md").write_text("[b](b.md)\n", encoding="utf-8")
    info = inspect(tmp_path, "d/src.md", "[b](b.md)\n")
    assert info["md_missing"] == []
    assert len(info["md_root_bare"]) == 1
    assert info["md_root_bare"][0]["target"] == "b.md"


def test_md_explicit_paths_preferred_over_root(tmp_path):
    """./ ../ / 开头：源目录可解析即通过，不判 root_bare。"""
    (tmp_path / "b.md").write_text("# b\n", encoding="utf-8")
    d = tmp_path / "d"
    d.mkdir()
    (d / "b.md").write_text("# b\n", encoding="utf-8")
    (d / "src.md").write_text("[b](./b.md)\n[abs](/b.md)\n", encoding="utf-8")
    info = inspect(tmp_path, "d/src.md", "[b](./b.md)\n[abs](/b.md)\n")
    assert info["md_missing"] == [] and info["md_root_bare"] == []
    assert "d/b" in info["resolved"] and "b" in info["resolved"]


def test_non_md_and_external_links_skipped(tmp_path):
    (tmp_path / "src.md").write_text(
        "[web](https://example.com/x.md) [txt](notes.txt) [sec](#head)\n",
        encoding="utf-8")
    info = inspect(tmp_path, "src.md",
                   "[web](https://example.com/x.md) [txt](notes.txt) [sec](#head)\n")
    assert info["md_missing"] == [] and info["md_root_bare"] == []
    assert info["link_count"] == 0  # 外链/非 .md 不计入内部链接


def test_md_broken_in_own_metric_not_wikilink_broken(tmp_path):
    """md 断链不得混入 wikilink 的 broken 列表（避免双重计数）。"""
    (tmp_path / "src.md").write_text("[g](G.md) [[也断]]\n", encoding="utf-8")
    info = inspect(tmp_path, "src.md", "[g](G.md) [[也断]]\n")
    assert len(info["md_missing"]) == 1          # md 指标
    assert len(info["broken"]) == 1              # wikilink 指标
    assert info["broken"][0]["target"] == "也断"


def test_batch_metrics_contains_md_keys():
    for key in ("md_broken", "md_root_relative_bare"):
        assert key in lg.BATCH_METRICS
