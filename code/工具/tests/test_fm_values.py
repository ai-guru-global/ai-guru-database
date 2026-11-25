"""P1-3 fixture：frontmatter 值校验（tier 枚举 / 日期合法性 / created≤updated /
tags 列表形态 / name_zh 与正文中文简称一致）。"""
import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "link_gate.py"
spec = importlib.util.spec_from_file_location("link_gate_under_test", SCRIPT)
lg = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lg)


def page(fm_body: str, body: str = "# T\n\n> 中文简称：测试页\n\n正文。\n") -> str:
    return f"---\n{fm_body}\n---\n{body}"


def problems(fm_body, body=None):
    return lg.validate_fm_values(page(fm_body, body) if body else page(fm_body))


def test_valid_page_passes():
    fm = ('title: T\nname_zh: "测试页"\ntier: core\ncategory: root\n'
          'tags: ["a", "b"]\nsummary: "s"\ncreated: 2026-01-01\n'
          'updated: 2026-11-25')
    assert problems(fm) == []


def test_iso_datetime_dates_accepted():
    fm = ('title: T\nname_zh: "测试页"\ntier: supporting\ncategory: root\n'
          'tags: [a]\nsummary: "s"\n'
          'created: 2026-05-31T21:30:00+08:00\nupdated: 2026-05-31T21:30:00+08:00')
    assert problems(fm) == []


def test_illegal_tier_flagged():
    fm = ('title: T\nname_zh: "测试页"\ntier: synthesis\ncategory: root\n'
          'tags: [a]\nsummary: "s"\ncreated: 2026-01-01\nupdated: 2026-01-02')
    ps = problems(fm)
    assert any('tier 值非法: synthesis' in p for p in ps)


def test_bad_date_format_flagged():
    fm = ('title: T\nname_zh: "测试页"\ntier: core\ncategory: root\n'
          'tags: [a]\nsummary: "s"\ncreated: 2026/01/01\nupdated: 2026-01-02')
    ps = problems(fm)
    assert any('created 非合法日期' in p for p in ps)


def test_created_after_updated_flagged():
    fm = ('title: T\nname_zh: "测试页"\ntier: core\ncategory: root\n'
          'tags: [a]\nsummary: "s"\ncreated: 2026-02-01\nupdated: 2026-01-02')
    ps = problems(fm)
    assert any('晚于 updated' in p for p in ps)


def test_tags_scalar_flagged_block_list_ok():
    scalar = ('title: T\nname_zh: "测试页"\ntier: core\ncategory: root\n'
              'tags: ai, llm\nsummary: "s"\ncreated: 2026-01-01\n'
              'updated: 2026-01-02')
    assert any('tags 非列表' in p for p in problems(scalar))
    block = ('title: T\nname_zh: "测试页"\ntier: core\ncategory: root\n'
             'tags:\n  - ai\n  - llm\nsummary: "s"\ncreated: 2026-01-01\n'
             'updated: 2026-01-02')
    assert problems(block) == []


def test_name_zh_mismatch_flagged_and_missing_body_skipped():
    fm = ('title: T\nname_zh: "测试页"\ntier: core\ncategory: root\n'
          'tags: [a]\nsummary: "s"\ncreated: 2026-01-01\nupdated: 2026-01-02')
    mismatch = problems(fm, body="# T\n\n> 中文简称：别的名字\n\n正文。\n")
    assert any('不一致' in p for p in mismatch)
    no_blockquote = problems(fm, body="# T\n\n正文，无中文简称块。\n")
    assert not any('不一致' in p for p in no_blockquote)  # 无块不比对（P1-5 口径）


def test_missing_frontmatter_returns_empty():
    assert lg.validate_fm_values("无 frontmatter 的文本") == []
