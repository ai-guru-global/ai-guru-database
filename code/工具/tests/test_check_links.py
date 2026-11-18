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
