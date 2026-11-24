"""fix_spacing.py 回归测试：链接目标零改动，正文间距仍生效（ISS-108）。

历史事故：全库运行曾把 [[03_RL_基础]]、[x](02_RL应用_指南.md) 等链接目标改坏，
断链 0 → 1,173。本测试锁定"链接目标完全不变、正文间距照常"的契约。
"""
import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "fix_spacing.py"
spec = importlib.util.spec_from_file_location("fix_spacing_under_test", SCRIPT)
fs = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fs)


def test_wikilink_target_untouched():
    """wikilink 目标内的 CJK-Latin 边界不得插入空格。"""
    text = "详见[[03_RL_基础]]与[[概念/rlhf|RLHF 页面]]，以及[[dir/03_RL基础]]。"
    out = fs.fix_spacing(text)
    assert "[[03_RL_基础]]" in out
    assert "[[概念/rlhf|RLHF 页面]]" in out
    assert "[[dir/03_RL基础]]" in out
    assert "03_RL 基础" not in out


def test_md_link_target_untouched():
    """md 链接目标与显示文本整体保护，路径不得被改写。"""
    text = "先读[RL 应用指南](02_RL应用_指南.md)，再看[性能调优GPU版](perf_gpu.md)。"
    out = fs.fix_spacing(text)
    assert "[RL 应用指南](02_RL应用_指南.md)" in out
    assert "[性能调优GPU版](perf_gpu.md)" in out
    assert "02_RL应用_指南.md" in out
    assert "02_RL应用_指南 .md" not in out and "RL应用_指南" not in out.replace(
        "02_RL应用_指南.md", ""
    )


def test_md_link_with_inline_code_display_text():
    """显示文本含行内代码的链接：先链接后代码的保护顺序，目标零改动。

    实证案例：07_模型训练/04_分布式训练/03_分布式训练_2026.md 曾被把
    (11_模型运维/01_MLOps基础/…) 目标改成 (01_MLOps 基础/…) 造成断链。
    """
    text = (
        "- MLOps 训练流水线，请参阅 "
        "[`11_模型运维/01_MLOps基础/05_MLOps_流水线.md`]"
        "(11_模型运维/01_MLOps基础/05_MLOps_流水线.md)"
    )
    assert fs.fix_spacing(text) == text


def test_body_spacing_still_applied():
    """链接保护不殃及正文：CJK-Latin 间距照常插入。"""
    text = "使用Python训练模型，基于PyTorch实现。"
    out = fs.fix_spacing(text)
    assert out == "使用 Python 训练模型，基于 PyTorch 实现。"


def test_spacing_around_protected_regions():
    """占位符外的正文照常修间距，还原后链接字节不变。"""
    text = "在[[概念/rlhf]]中使用PPO算法训练。"
    out = fs.fix_spacing(text)
    assert out == "在[[概念/rlhf]]中使用 PPO 算法训练。"


def test_code_block_and_yaml_untouched():
    text = (
        "---\n"
        "title: TestPage\n"
        "name_zh: \"测试页\"\n"
        "---\n"
        "```python\n"
        "x = load_model(\"模型V2\")\n"
        "```\n"
        "正文里写配置`lr=0.01学习率`即可。"
    )
    out = fs.fix_spacing(text)
    assert 'x = load_model("模型V2")' in out
    assert '`lr=0.01学习率`' in out
    assert out.startswith("---\ntitle: TestPage\n")


def test_double_backtick_span_then_inline_codes():
    """双反引号代码段 + md 链接混排时，后续行内代码不得被配对错位改写。

    实证：KNOWN_ISSUES.md 撰写时曾用 `` [`p.md`](p.md) `` 双反引号写法，
    行内代码配对整体偏移，路径 `01_MLOps基础` 被插入空格。
    """
    text = (
        "否则 `` [`p.md`](p.md) `` 这类写法会错位，（`03_训练_2026.md` 实证，"
        "`01_MLOps基础` 被改成 `01_MLOps 基础`），正文使用Python训练。"
    )
    out = fs.fix_spacing(text)
    assert "`01_MLOps基础` 被改成 `01_MLOps 基础`" in out
    assert "`03_训练_2026.md`" in out
    assert "使用 Python 训练" in out


def test_idempotent():
    """修复结果幂等，无振荡。"""
    text = "使用Python训练，见[[03_RL_基础]]与[指南](02_RL应用_指南.md)。"
    once = fs.fix_spacing(text)
    assert fs.fix_spacing(once) == once
