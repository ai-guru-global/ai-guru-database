"""check_links.py 回归测试：别名解析与全量断链输出。"""
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "check_links.py"
spec = importlib.util.spec_from_file_location("check_links_under_test", SCRIPT)
cl = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cl)


def test_parse_aliases_singular_and_plural():
    assert cl.parse_aliases("---\nalias:\n  - SglAlias\n---\n") == ["SglAlias"]
    assert cl.parse_aliases("---\naliases:\n  - BlockAlias\n---\n") == ["BlockAlias"]
    assert cl.parse_aliases('---\nalias: InlineAlias\n---\n') == ["InlineAlias"]
    assert cl.parse_aliases('---\naliases: [One, "Two Words"] # comment\n---\n') == [
        "One",
        "Two Words",
    ]


def test_singular_alias_resolves_in_both_styles(tmp_path):
    (tmp_path / "block.md").write_text(
        "---\nalias:\n  - BlockAlias\n---\n# Block\n", encoding="utf-8"
    )
    (tmp_path / "inline.md").write_text(
        "---\nalias: InlineAlias\n---\n# Inline\n", encoding="utf-8"
    )
    (tmp_path / "src.md").write_text(
        "[[BlockAlias]]\n[[InlineAlias]]\n", encoding="utf-8"
    )

    report = cl.find_all_links(str(tmp_path))

    assert report["total_broken"] == 0
    assert report["broken_list"] == []


def test_bare_relative_md_link_resolves_against_source_dir(tmp_path):
    """ISS-109：裸相对链接按源文件目录解析，不再误报 vault 根断链。"""
    sub = tmp_path / "sub"
    sub.mkdir()
    (sub / "ROADMAP.md").write_text("# Roadmap\n", encoding="utf-8")
    (tmp_path / "PARENT.md").write_text("# Parent\n", encoding="utf-8")
    (sub / "src.md").write_text(
        "[ROADMAP](ROADMAP.md)\n[Up](../PARENT.md)\n", encoding="utf-8"
    )

    report = cl.find_all_links(str(tmp_path))

    assert report["total_mdlinks_internal"] == 2
    assert report["total_broken"] == 0
    assert report["broken_list"] == []


def test_missing_bare_relative_md_link_still_flagged(tmp_path):
    """修复不得掩盖真断链：同目录确无目标文件时仍须报告。"""
    (tmp_path / "src.md").write_text("[ghost](GHOST.md)\n", encoding="utf-8")

    report = cl.find_all_links(str(tmp_path))

    assert report["total_broken"] == 1
    assert report["broken_list"][0]["link_type"] == "markdown"
    assert report["broken_list"][0]["target"] == "GHOST.md"


def test_root_absolute_md_link_keeps_vault_root_semantics(tmp_path):
    """/ 开头的 md 链接仍按 vault 根解析，不受源文件目录影响。"""
    (tmp_path / "ROADMAP.md").write_text("# Roadmap\n", encoding="utf-8")
    sub = tmp_path / "sub"
    sub.mkdir()
    (sub / "src.md").write_text("[Roadmap](/ROADMAP.md)\n", encoding="utf-8")

    report = cl.find_all_links(str(tmp_path))

    assert report["total_broken"] == 0


def test_root_relative_bare_link_classified_separately(tmp_path):
    """根相对裸写（源目录不存在、vault 根存在）单列 root_relative_bare，
    不与 missing_file 真断链混淆。"""
    (tmp_path / "15_智能体").mkdir()
    (tmp_path / "15_智能体" / "foo.md").write_text("# Foo\n", encoding="utf-8")
    sub = tmp_path / "sub"
    sub.mkdir()
    (sub / "src.md").write_text("[Foo](15_智能体/foo.md)\n", encoding="utf-8")

    report = cl.find_all_links(str(tmp_path))

    assert report["total_broken"] == 1
    assert report["broken_list"][0]["category"] == "root_relative_bare"
    assert report["broken_by_category"] == {"root_relative_bare": 1}


def test_broken_list_and_json_are_not_truncated(tmp_path):
    total = 1200
    (tmp_path / "src.md").write_text(
        "\n".join(f"[[missing_{i}]]" for i in range(total)), encoding="utf-8"
    )

    report = cl.find_all_links(str(tmp_path))
    assert report["total_broken"] == total
    assert len(report["broken_list"]) == total
    assert report["broken_by_source"]["src.md"] == total

    out = tmp_path / "report.json"
    subprocess.run(
        [sys.executable, str(SCRIPT), str(tmp_path), "--json", str(out)],
        check=True,
        capture_output=True,
        text=True,
    )
    data = json.loads(out.read_text(encoding="utf-8"))
    assert len(data["broken_list"]) == total
    assert data["broken_by_source"]["src.md"] == total
