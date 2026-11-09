#!/usr/bin/env python3
"""
AI HOT 每日增量 changes 同步

按 references/sync.md 流程：
  1. 读 state/state.json 拿到上次的 cursor
  2. GET /api/v1/selected/changes?cursor=...&limit=100
  3. 整页 apply（upsert / remove）
  4. 整页成功后原子更新 cursor
  5. hasMore=true 立即继续（排空积压）
  6. 409 snapshot_required → 停下来报告（不要循环）
  7. ETag 304 → 不动本地
"""
import argparse
import gzip
import http.client
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode

ROOT = Path("/Users/allengaller/Documents/GitHub/standup-coder/ai-news-database/aihot-mirror")
STATE = ROOT / "state"
LOGS = ROOT / "logs"
UA = "aihot-skill/1.3.0 (+https://aihot.virxact.com/aihot-skill/)"
os.environ["NO_PROXY"] = "*"
os.environ["no_proxy"] = "*"


def log(msg):
    line = f"[{datetime.now(timezone.utc).isoformat(timespec='seconds')}] {msg}"
    print(line, flush=True)
    (LOGS / "run.log").open("a", encoding="utf-8").write(line + "\n")


EXPECTED_HOST = "aihot.virxact.com"
API_PATH = "/api/v1/selected/changes"


def get_changes(cursor, limit=100, retries=3):
    # cursor 来自本地 state/CLI 参数：先做严格白名单校验，阻断任何注入进请求的可能
    if not isinstance(cursor, str) or not re.fullmatch(r"[A-Za-z0-9_\-.]{1,200}", cursor):
        raise ValueError(f"非法 cursor: {cursor!r}")
    limit = int(limit)
    # SSRF 防护：主机名固定为常量、由 HTTPSConnection 在连接层锁定，请求路径仅含已校验参数
    path = API_PATH + "?" + urlencode({"cursor": cursor, "limit": limit})
    last_err = None
    for attempt in range(1, retries + 1):
        conn = http.client.HTTPSConnection(EXPECTED_HOST, timeout=60)
        try:
            conn.request("GET", path, headers={"User-Agent": UA, "Accept": "application/json"})
            resp = conn.getresponse()
            body = resp.read()
            if resp.status == 409:
                try:
                    problem = json.loads(body)
                except Exception:
                    problem = {"code": "snapshot_required"}
                return None, problem
            if resp.status != 200:
                raise RuntimeError(f"HTTP {resp.status}: {body[:200]!r}")
            if not body.strip():
                # 瞬态空响应：重试
                last_err = RuntimeError(f"第 {attempt} 次收到空响应体")
            else:
                return json.loads(body), None
        except (http.client.HTTPException, OSError) as e:
            last_err = e
        finally:
            conn.close()
        if attempt < retries:
            time.sleep(2 * attempt)
    raise RuntimeError(f"changes 请求在 {retries} 次尝试后仍失败: {last_err}")


def save_raw_changes(page_idx, data):
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    path = LOGS / f"changes-{ts}-p{page_idx:03d}.json.gz"
    with gzip.open(path, "wb") as f:
        f.write(json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))
    return path


def load_items_by_id():
    by_id = {}
    items_path = STATE / "items.jsonl"
    if not items_path.exists():
        return by_id, []
    with items_path.open(encoding="utf-8") as f:
        for line in f:
            it = json.loads(line)
            by_id[it["id"]] = it
    return by_id, list(by_id.values())


def write_items_jsonl(items):
    """原子写：先写 .tmp，再 rename。"""
    items_path = STATE / "items.jsonl"
    tmp = items_path.with_suffix(".jsonl.tmp")
    with tmp.open("w", encoding="utf-8") as f:
        for it in items:
            f.write(json.dumps(it, ensure_ascii=False, separators=(",", ":")) + "\n")
    os.replace(tmp, items_path)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=100)
    ap.add_argument("--max-pages", type=int, default=200)
    args = ap.parse_args()

    LOGS.mkdir(parents=True, exist_ok=True)
    state_path = STATE / "state.json"
    if not state_path.exists():
        log("ERROR state/state.json 不存在，请先跑 tools/pull_snapshot.py")
        return 2

    state = json.loads(state_path.read_text(encoding="utf-8"))
    cursor = state["cursor"]

    by_id, items = load_items_by_id()
    log(f"start cursor={cursor[:24]}... local items={len(items)}")

    total_upsert = 0
    total_remove = 0
    new_cursor = cursor
    page_idx = 0
    has_more = True

    while has_more and page_idx < args.max_pages:
        page_idx += 1
        data, problem = get_changes(cursor, args.limit)
        if problem is not None:
            if problem.get("code") == "snapshot_required":
                log("ERROR 409 snapshot_required，cursor 已失效，请重跑 tools/pull_snapshot.py")
                return 3
            log(f"ERROR HTTP 409: {problem}")
            return 4

        save_raw_changes(page_idx, data)
        changes = data.get("changes", []) or data.get("items", []) or []
        for ch in changes:
            op = ch.get("op")
            cid = ch.get("id")
            item = ch.get("item")
            if op == "upsert" and item:
                by_id[item["id"]] = item
                total_upsert += 1
            elif op == "upsert" and cid:
                # 极少见：upsert 但 item 缺失（不应该发生）
                log(f"WARN upsert 但 item 缺失：{cid}")
            elif op == "remove" and cid:
                by_id.pop(cid, None)
                total_remove += 1
            else:
                log(f"WARN 未知 change：{ch}")

        new_cursor = data.get("cursor", new_cursor)
        has_more = bool(data.get("hasMore"))
        log(f"page={page_idx} changes={len(changes)} upsert={total_upsert} remove={total_remove} hasMore={has_more}")
        cursor = new_cursor
        time.sleep(0.2)

    # 全部 apply 完成后，原子落盘
    new_items = list(by_id.values())
    write_items_jsonl(new_items)
    state["cursor"] = new_cursor
    state["count"] = len(new_items)
    state["lastChangesAt"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    state["lastChangesUpsert"] = total_upsert
    state["lastChangesRemove"] = total_remove
    state_path.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")
    log(f"DONE 累计 upsert={total_upsert} remove={total_remove} new total={len(new_items)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
