"""fix_root_relative_links.py 回归：NUL 掩码必须还原（752a2850f 事故锁死）。

历史事故：rewrite_text 曾返回掩码文本本身，被保护区域（围栏代码块/行内
代码）以等长 NUL 字节形态落盘——全库 22k NUL 腐蚀，752a2850f 回退修复。
本测试锁死：改写后输出零 NUL、被保护区字节不变。
"""
import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "fix_root_relative_links.py"
spec = importlib.util.spec_from_file_location("frrl_under_test", SCRIPT)
fr = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fr)

NL = "\n"
FENCE = "`" * 3


def test_masked_regions_restored_no_nul(tmp_path, monkeypatch):
    text = NL.join([
        "---",
        'summary: "> 前置 [`内联代码.md`](内联代码.md) 引用。"',
        "---",
        "正文 [目标](01_数学基础/11_Java生态与AI/x.md) 之后。",
        FENCE + "python",
        'code_block = "原样保留 <never-touch>"',
        FENCE,
        "行内 `保留我.md` 结束。",
        "",
    ])
    (tmp_path / "01_数学基础" / "11_Java生态与AI").mkdir(parents=True)
    (tmp_path / "01_数学基础" / "11_Java生态与AI" / "x.md").write_text("# x")
    monkeypatch.setattr(fr, "CONTENT", tmp_path)

    new_text, n, _ = fr.rewrite_text(text, tmp_path / "sub" / "src.md")

    assert n == 1
    assert "\x00" not in new_text                                 # 零 NUL 残留
    assert 'code_block = "原样保留 <never-touch>"' in new_text      # 围栏区字节不变
    assert "`内联代码.md`" in new_text                              # 行内代码区不变
    assert "](../01_数学基础/11_Java生态与AI/x.md)" in new_text  # 链接已改写
    assert "`保留我.md`" in new_text
