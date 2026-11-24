"""P0-4 导入批次机制 fixture 测试：额度内通过、超额度失败、过期失效。

批次文件放 wiki/治理/_meta/import-batches/<batch>.json，由 link_gate.py
的 load_active_batches / evaluate_metrics 消费；额度只影响通过与否，
不抬高棘轮基线。
"""
import importlib.util
import json
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "link_gate.py"
spec = importlib.util.spec_from_file_location("link_gate_under_test", SCRIPT)
lg = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lg)


def _write_batch(tmp_path, name, expires, delta, batch=None):
    data = {
        "batch": batch or name,
        "created": "2026-11-24",
        "expires": expires,
        "allowed_delta": delta,
        "note": "fixture 批次",
    }
    path = tmp_path / f"{name}.json"
    path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    return path


def test_active_batch_counts_into_deltas(tmp_path):
    _write_batch(tmp_path, "a4-robotics-1", "2027-02-28",
                 {"orphan_count": 60, "frontmatter_incomplete": 120})
    deltas, active, expired = lg.load_active_batches(tmp_path, today=None)
    assert deltas == {"orphan_count": 60, "frontmatter_incomplete": 120}
    assert active == ["a4-robotics-1"]
    assert expired == []


def test_multiple_batches_sum(tmp_path):
    _write_batch(tmp_path, "batch-1", "2027-02-28", {"orphan_count": 60})
    _write_batch(tmp_path, "batch-2", "2027-03-31", {"orphan_count": 40})
    deltas, active, _ = lg.load_active_batches(tmp_path)
    assert deltas == {"orphan_count": 100}
    assert sorted(active) == ["batch-1", "batch-2"]


def test_expired_batch_excluded(tmp_path):
    _write_batch(tmp_path, "stale-batch", "2026-11-23", {"orphan_count": 60})
    deltas, active, expired = lg.load_active_batches(tmp_path)
    assert deltas == {}
    assert active == []
    assert expired == ["stale-batch"]


def test_invalid_batch_ignored(tmp_path):
    (tmp_path / "broken.json").write_text("{ not json", encoding="utf-8")
    _write_batch(tmp_path, "missing-fields", "2027-02-28", {"orphan_count": 5})
    (tmp_path / "missing-fields.json").unlink()
    (tmp_path / "missing-fields.json").write_text(
        json.dumps({"batch": "x"}), encoding="utf-8")
    deltas, active, _ = lg.load_active_batches(tmp_path)
    assert deltas == {}
    assert active == []


def test_non_batch_metric_delta_ignored(tmp_path):
    _write_batch(tmp_path, "weird", "2027-02-28",
                 {"orphan_count": 10, "made_up_metric": 999})
    deltas, _, _ = lg.load_active_batches(tmp_path)
    assert deltas == {"orphan_count": 10}


def test_evaluate_within_quota_passes_without_raising_baseline():
    baseline = {"orphan_count": 257}
    failed, new_baseline, adopted = lg.evaluate_metrics(
        {"orphan_count": 310}, baseline, {"orphan_count": 60})
    assert failed == []
    assert adopted == []
    assert new_baseline["orphan_count"] == 257  # 批次额度不抬高基线


def test_evaluate_over_quota_fails():
    failed, _, _ = lg.evaluate_metrics(
        {"orphan_count": 320}, {"orphan_count": 257}, {"orphan_count": 60})
    assert failed == ["orphan_count"]


def test_evaluate_over_baseline_without_batch_fails():
    failed, _, _ = lg.evaluate_metrics(
        {"orphan_count": 258}, {"orphan_count": 257}, {})
    assert failed == ["orphan_count"]


def test_evaluate_improvement_tightens_baseline():
    failed, new_baseline, adopted = lg.evaluate_metrics(
        {"spacing_violations": 1040}, {"spacing_violations": 1046}, {})
    assert failed == []
    assert adopted == []
    assert new_baseline["spacing_violations"] == 1040


def test_evaluate_adopts_missing_key():
    failed, new_baseline, adopted = lg.evaluate_metrics(
        {"staging_spacing_violations": 6}, {}, {})
    assert failed == []
    assert adopted == ["staging_spacing_violations"]
    assert new_baseline["staging_spacing_violations"] == 6


def test_batches_dir_exists_with_readme():
    """批次目录与说明页已入库（审计轨迹入口）。"""
    readme = lg.BATCH_DIR / "README.md"
    assert lg.BATCH_DIR.is_dir()
    assert readme.is_file()
    assert "import-batches" in readme.read_text(encoding="utf-8")
