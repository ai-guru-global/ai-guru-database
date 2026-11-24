"""三区口径（P0-3）fixture 测试：zone_of 分区、扫描跳过集派生、门禁分级。

权威源 = wiki/治理/_meta/infra-dirs.json（dirs[].zone + zones 策略块）；
check_wikilinks.py 暴露 zone_of / ROOT_ONLY_SKIP，link_gate.py 经 runpy 复用。
"""
import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "check_wikilinks.py"
spec = importlib.util.spec_from_file_location("check_wikilinks_under_test", SCRIPT)
cw = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cw)


def test_zone_of_published_by_default():
    assert cw.zone_of("05_大模型/README.md") == "published"
    assert cw.zone_of("概念/rlhf.md") == "published"
    assert cw.zone_of("专题研究/GTM/x.md") == "published"  # GTM 不在 staging/archive


def test_zone_of_staging_paths():
    assert cw.zone_of("原始/draft.md") == "staging"
    assert cw.zone_of("资料与归档/来源/wechat/x.md") == "staging"
    assert cw.zone_of("资料与归档/docs/plan.md") == "staging"
    # 精确目录名本身也算命中（目录级引用归区）
    assert cw.zone_of("归档") == "archive"


def test_zone_of_archive_paths():
    assert cw.zone_of("归档/log.md") == "archive"
    assert cw.zone_of("归档/index.md") == "archive"


def test_zone_of_longest_prefix_wins():
    """资料与归档（published）之下的 来源/docs（staging）按更长前缀归区。"""
    assert cw.zone_of("资料与归档/reports/k8s-cve.md") == "published"
    assert cw.zone_of("资料与归档/assistant/README.md") == "published"


def test_root_only_skip_derived_from_zones():
    """断链扫描跳过集由 zones 派生：staging∪archive 的目录名全部在列。"""
    for name in ("原始", "来源", "docs", "归档"):
        assert name in cw.ROOT_ONLY_SKIP, f"{name} 不在 ROOT_ONLY_SKIP"


def test_zone_paths_fallback_without_infra():
    """infra-dirs.json 加载失败时回退 v1 默认（staging 不含 原始/）。"""
    saved = cw._INFRA
    try:
        cw._INFRA = None
        paths = cw._load_zone_paths()
        assert "资料与归档/来源" in paths["staging"]
        assert "归档" in paths["archive"]
        assert all("原始" not in p for p in paths.get("staging", []))
    finally:
        cw._INFRA = saved


def test_gate_zone_check_policy():
    """link_gate 三区分级：published 全量、staging 仅格式、archive 不检查。"""
    gate_script = Path(__file__).resolve().parent.parent / "link_gate.py"
    gspec = importlib.util.spec_from_file_location("link_gate_under_test", gate_script)
    lg = importlib.util.module_from_spec(gspec)
    gspec.loader.exec_module(lg)
    # 分级策略直接体现在 changed-only 的问题收集逻辑上：
    # staging/archive 的断链不进 problems，published 才检查。
    source = gate_script.read_text(encoding="utf-8")
    assert "zone == 'published'" in source
    assert "archive 冻结区" in source
