"""P1-5① fixture：正文契约四项（中文简称块 / 一句话理解 / 页脚 / 出链≥2）。"""
import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "link_gate.py"
spec = importlib.util.spec_from_file_location("link_gate_under_test", SCRIPT)
lg = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lg)


def full_page(links: int = 2) -> str:
    link_lines = "\n".join(f"[[关联页{i}]]" for i in range(links))
    return ("# 测试页\n\n> 中文简称：测试页\n\n> **一句话理解**: 一句话说明。\n\n"
            "---\n\n" + link_lines + "\n\n---\n\n*Last updated: 2026-11-25*\n")


def test_full_contract_passes():
    assert lg.validate_body_contract(full_page(), 2) == []


def test_each_missing_element_flagged():
    text = "# 只有标题\n\n一段正文，没有契约元素。\n"
    ps = lg.validate_body_contract(text, 0)
    assert any('中文简称' in p for p in ps)
    assert any('一句话理解' in p for p in ps)
    assert any('页脚' in p for p in ps)
    assert any('出链不足 2' in p for p in ps)


def test_one_link_is_insufficient_two_is_ok():
    one = ("# T\n\n> 中文简称：T\n\n> **一句话理解**: x。\n\n"
           "[[唯一链接]]\n\n*Last updated: 2026-11-25*\n")
    assert any('出链不足 2（当前 1' in p for p in lg.validate_body_contract(one, 1))
    assert lg.validate_body_contract(full_page(links=3), 3) == []


def test_footer_must_be_near_end():
    body = ("# T\n\n> 中文简称：T\n\n> **一句话理解**: x。\n\n[[a]]\n[[b]]\n\n"
            "*Last updated: 2026-01-01*\n\n" + "后续大量内容\n" * 80)
    assert any('页脚' in p for p in lg.validate_body_contract(body, 2))


def test_batch_metrics_has_contract():
    assert 'body_contract_violations' in lg.BATCH_METRICS
