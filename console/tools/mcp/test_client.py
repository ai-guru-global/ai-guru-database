#!/usr/bin/env python3
"""最小 MCP 客户端：验证 aiguru_mcp.py 的 initialize / tools/list / tools/call。

用法：python3 tools/mcp/test_client.py
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

SERVER = Path(__file__).with_name("aiguru_mcp.py")


def send(proc: subprocess.Popen, payload: dict) -> dict:
    proc.stdin.write(json.dumps(payload, ensure_ascii=False) + "\n")
    proc.stdin.flush()
    line = proc.stdout.readline()
    if not line:
        raise SystemExit(f"server 无响应，stderr={proc.stderr.read()}")
    return json.loads(line)


def main() -> int:
    proc = subprocess.Popen(
        [sys.executable, str(SERVER)],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
    )
    assert proc.stdin and proc.stdout

    init = send(proc, {
        "jsonrpc": "2.0", "id": 1, "method": "initialize",
        "params": {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "test", "version": "0"}},
    })
    assert init["result"]["serverInfo"]["name"] == "ai-guru-industry-graph", init
    print("✓ initialize", init["result"]["protocolVersion"])

    # notification：不应有回复
    proc.stdin.write(json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized"}) + "\n")
    proc.stdin.flush()

    tools = send(proc, {"jsonrpc": "2.0", "id": 2, "method": "tools/list"})
    names = [t["name"] for t in tools["result"]["tools"]]
    assert "search_nodes" in names and "get_node" in names, names
    print(f"✓ tools/list {len(names)} tools: {', '.join(names)}")

    search = send(proc, {
        "jsonrpc": "2.0", "id": 3, "method": "tools/call",
        "params": {"name": "search_nodes", "arguments": {"query": "GPU", "limit": 3}},
    })
    text = search["result"]["content"][0]["text"]
    assert "chain/L1/gpu" in text, text[:200]
    print("✓ search_nodes GPU →", text.splitlines()[0][:80])

    node = send(proc, {
        "jsonrpc": "2.0", "id": 4, "method": "tools/call",
        "params": {"name": "get_node", "arguments": {"node": "chain/L1/gpu"}},
    })
    payload = json.loads(node["result"]["content"][0]["text"])
    assert payload["name"] == "GPU 与 AI 加速卡", payload
    assert payload["levels"], payload
    print("✓ get_node chain/L1/gpu →", payload["name"], f"({len(payload['levels'])} levels)")

    clues = send(proc, {
        "jsonrpc": "2.0", "id": 5, "method": "tools/call",
        "params": {"name": "list_clues", "arguments": {"topic": "基础模型", "limit": 3}},
    })
    payload = json.loads(clues["result"]["content"][0]["text"])
    assert payload["count"] >= 1, payload
    print("✓ list_clues 基础模型 →", payload["count"])

    verify = send(proc, {
        "jsonrpc": "2.0", "id": 6, "method": "tools/call",
        "params": {"name": "list_verify", "arguments": {"status": "⚠️", "limit": 2}},
    })
    payload = json.loads(verify["result"]["content"][0]["text"])
    assert payload["count"] >= 1, payload
    print("✓ list_verify ⚠️ →", payload["count"])

    info = send(proc, {"jsonrpc": "2.0", "id": 7, "method": "tools/call",
                       "params": {"name": "dataset_info", "arguments": {}}})
    payload = json.loads(info["result"]["content"][0]["text"])
    assert payload["counts"]["nodes"] >= 60, payload
    print("✓ dataset_info →", payload["version"], payload["counts"]["nodes"], "nodes")

    proc.stdin.close()
    proc.wait(timeout=5)
    print("✓ MCP server OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())