"""P1-2 fixture：debt_report 的目录聚合与渲染（纯函数）。"""
import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "debt_report.py"
spec = importlib.util.spec_from_file_location("debt_report_under_test", SCRIPT)
dr = importlib.util.module_from_spec(spec)
spec.loader.exec_module(dr)


def sample_result():
    return {
        "broken": [{"source": "05_大模型/a.md"}, {"source": "05_大模型/b.md"},
                   {"source": "概念/c.md"}],
        "orphans": ["15_智能体/x.md"],
        "fm_incomplete": ["治理/_meta/note.md"],
        "spacing_bad": ["README.md"],
        "md_missing": [{"source": "11_模型运维/docs/INDEX.md"}],
        "md_root_bare": [],
    }


def test_top_dir_classification():
    assert dr.top_dir("05_大模型/a.md") == "05_大模型"
    assert dr.top_dir("README.md") == "(root)"
    assert dr.top_dir("治理/_meta/note.md") == "治理"


def test_aggregate_counts_by_top_dir():
    table = dr.aggregate(sample_result())
    assert table["05_大模型"]["broken"] == 2
    assert table["概念"]["broken"] == 1
    assert table["15_智能体"]["orphans"] == 1
    assert table["(root)"]["spacing_bad"] == 1
    assert table["(total)"]["broken"] == 3
    assert table["(total)"]["md_missing"] == 1
    assert table["(total)"]["md_root_bare"] == 0


def test_render_contains_targets_progress():
    table = dr.aggregate(sample_result())
    md = dr.render(table, {"deadline": "2027-03-31",
                           "frontmatter_incomplete": 300,
                           "orphan_count": 400,
                           "broken_rate_pct": 2.0,
                           "_total_links": 10000})
    assert "targets 进度" in md
    assert "2027-03-31" in md
    assert "`orphan_count`" in md  # 1 ≤ 400 应为达标
    assert "✅" in md


def test_render_without_targets():
    md = dr.render(dr.aggregate(sample_result()), None)
    assert "targets" not in md
    assert "| 概念 |" in md
