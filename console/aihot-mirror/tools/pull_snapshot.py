#!/usr/bin/env python3
"""
AI HOT selected snapshot 首次全量拉取

按 references/sync.md 流程：
  1. 调 /api/v1/selected/snapshot?fields=minimal&limit=500
  2. 累积本页 items；记下响应里的 cursor（翻页期间不变、翻完才用来调 changes）
  3. hasMore=true 时带 page=<nextPage> 继续翻页
  4. hasMore=false 时把累积完整集合 + 第一个 cursor 原子写入 state

输出：
  - state/items.jsonl : 每行一条 item（增量好处理，去重友好）
  - state/state.json  : {cursor, fetchedAt, count, asOf}
  - logs/snapshot-{ts}.json : 每页原始响应（审计用）
  - logs/run.log      : 人类可读日志
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

EXPECTED_HOST = "aihot.virxact.com"
ROOT = Path("/Users/allengaller/Documents/GitHub/standup-coder/ai-news-database/aihot-mirror")
STATE = ROOT / "state"
RAW = ROOT / "raw"
LOGS = ROOT / "logs"
UA = "aihot-skill/1.3.0 (+https://aihot.virxact.com/aihot-skill/)"

# 环境里有指向 127.0.0.1:7897 的代理会失败，强制直连
os.environ["NO_PROXY"] = "*"
os.environ["no_proxy"] = "*"


def log(msg: str) -> None:
    line = f"[{datetime.now(timezone.utc).isoformat(timespec='seconds')}] {msg}"
    print(line, flush=True)
    (LOGS / "run.log").open("a", encoding="utf-8").write(line + "\n")


API_PATH = "/api/v1/selected/snapshot"


def get(params: dict) -> dict:
    # 请求参数白名单校验：仅接受整数/受限字符集，阻断任何注入进请求的可能
    for k, v in params.items():
        if not re.fullmatch(r"[A-Za-z0-9_]{1,32}", str(k)):
            raise ValueError(f"非法参数名: {k!r}")
        if isinstance(v, bool) or not isinstance(v, (int, float)):
            if not (isinstance(v, str) and re.fullmatch(r"[A-Za-z0-9_\-]{1,128}", v)):
                raise ValueError(f"非法参数值: {k}={v!r}")
    # SSRF 防护：主机名固定为常量、由 HTTPSConnection 在连接层锁定，请求路径仅含已校验参数
    path = API_PATH + "?" + urlencode(params)
    conn = http.client.HTTPSConnection(EXPECTED_HOST, timeout=60)
    try:
        conn.request("GET", path, headers={"User-Agent": UA, "Accept": "application/json"})
        resp = conn.getresponse()
        body = resp.read()
        if resp.status != 200:
            raise RuntimeError(f"HTTP {resp.status}: {body[:200]!r}")
        # 保存 etag 用于诊断
        return json.loads(body), resp.getheader("ETag")
    finally:
        conn.close()


def save_raw_page(page_idx: int, data: dict) -> Path:
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    path = LOGS / f"snapshot-{ts}-p{page_idx:03d}.json.gz"
    with gzip.open(path, "wb") as f:
        f.write(json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))
    return path


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--fields", default="minimal", choices=["minimal", "default"])
    ap.add_argument("--limit", type=int, default=500)
    ap.add_argument("--max-pages", type=int, default=50, help="safety cap")
    args = ap.parse_args()

    LOGS.mkdir(parents=True, exist_ok=True)
    STATE.mkdir(parents=True, exist_ok=True)

    items_jsonl = STATE / "items.jsonl"
    state_json = STATE / "state.json"

    # 如果已经有完整 state，提示不要重复 bootstrap
    if state_json.exists():
        prev = json.loads(state_json.read_text(encoding="utf-8"))
        log(f"WARN state.json 已存在（{prev.get('count')} 条，fetchedAt={prev.get('fetchedAt')}）")
        log("  若确认重新 bootstrap，请先删除 state/state.json 和 state/items.jsonl")
        return 2

    items_jsonl.write_text("", encoding="utf-8")  # truncate

    cursor = None
    next_page = None
    total = 0
    as_of = None
    page_idx = 0

    while page_idx < args.max_pages:
        params = {"fields": args.fields, "limit": args.limit}
        if next_page:
            params["page"] = next_page
        data, etag = get(params)
        page_idx += 1
        page_items = data.get("items", [])
        if cursor is None:
            cursor = data.get("cursor")
            as_of = data.get("asOf")
        save_raw_page(page_idx, data)
        with items_jsonl.open("a", encoding="utf-8") as f:
            for it in page_items:
                f.write(json.dumps(it, ensure_ascii=False, separators=(",", ":")) + "\n")
        total += len(page_items)
        has_more = bool(data.get("hasMore"))
        log(f"page={page_idx} count={len(page_items)} total={total} hasMore={has_more} etag={etag}")
        if not has_more:
            break
        next_page = data.get("nextPage") or data.get("page", {}).get("nextCursor")
        if not next_page:
            log("ERROR hasMore=true 但没有 nextPage，停止")
            return 3
        time.sleep(0.2)  # 礼貌

    state = {
        "cursor": cursor,
        "asOf": as_of,
        "count": total,
        "fields": args.fields,
        "fetchedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "pages": page_idx,
    }
    state_json.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")
    log(f"DONE 累计 {total} 条，asOf={as_of}，pages={page_idx}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
