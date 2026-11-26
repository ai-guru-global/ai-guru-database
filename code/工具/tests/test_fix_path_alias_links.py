"""ISS-111 fixture：带路径别名 wikilink 改写（fix_path_alias_links）。

锁定：路径别名→现行路径、显示文本/表格转义/锚点保留、裸别名合法不动、
basename 可解析跳过（ISS-112 族群）、存量 NUL 文件整只跳过、输出零 NUL。
"""
import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "fix_path_alias_links.py"
spec = importlib.util.spec_from_file_location("fpal_under_test", SCRIPT)
fp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fp)

REL_INDEX = {
    "00_入门/01_基础入门/04_AI历史时间线",
    "概念/Agent/a2a-protocol",
    "21_面试岗位/10_AI安全工程师/01_AI安全工程师_2026",
}
ALIAS_INDEX = {
    "ai_history_timeline": ["00_入门/01_基础入门/04_AI历史时间线"],
    "ai_safety_engineer_2026": ["21_面试岗位/10_AI安全工程师/01_AI安全工程师_2026"],
}
NAME_INDEX = {"a2a-protocol": ["概念/Agent/a2a-protocol"]}  # basename 可解析族群


def rw(text):
    return fp.rewrite_text(text, REL_INDEX, ALIAS_INDEX, NAME_INDEX)


def test_path_alias_rewritten_canonical():
    text = "详见 [[00_入门/01_基础入门/AI_History_Timeline]]。\n"
    out, n, _ = rw(text)
    assert n == 1
    assert "[[00_入门/01_基础入门/04_AI历史时间线]]" in out


def test_display_and_anchor_preserved():
    text = "- [[00_入门/01_基础入门/AI_History_Timeline|时间线页]] 与 [[00_入门/01_基础入门/AI_History_Timeline#里程碑]]\n"
    out, n, _ = rw(text)
    assert n == 2
    assert "[[00_入门/01_基础入门/04_AI历史时间线|时间线页]]" in out
    assert "[[00_入门/01_基础入门/04_AI历史时间线#里程碑]]" in out


def test_table_escaped_pipe_preserved():
    text = "| a | [[00_入门/01_基础入门/AI_History_Timeline\\|时间线]] |\n"
    out, n, _ = rw(text)
    assert n == 1
    assert "04_AI历史时间线\\|时间线]]" in out  # 转义竖线原样


def test_bare_alias_and_real_path_untouched():
    text = "[[AI_Safety_Engineer_2026]] 与 [[00_入门/01_基础入门/04_AI历史时间线]]\n"
    out, n, _ = rw(text)
    assert n == 0
    assert out == text  # 裸别名合法保留；真实路径不动


def test_basename_resolvable_skipped():
    """跨目录路径+唯一 basename：Obsidian 可用，属 ISS-112 族群，不改写。"""
    text = "[[概念/a2a-protocol]]\n"
    out, n, _ = rw(text)
    assert n == 0 and out == text


def test_nul_file_skipped_entirely():
    text = "语料 \x00 残留 [[00_入门/01_基础入门/AI_History_Timeline]]\n"
    out, n, samples = rw(text)
    assert n == 0 and samples == [("SKIP: 存量 NUL", "")]


def test_output_has_no_nul_and_mask_restored():
    text = ("代码 ```x = 1``` 与 `内联` 之间 [[00_入门/01_基础入门/AI_History_Timeline]]。\n")
    out, n, _ = rw(text)
    assert n == 1
    assert "\x00" not in out
    assert "```x = 1```" in out and "`内联`" in out
