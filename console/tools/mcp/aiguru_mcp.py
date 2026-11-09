#!/usr/bin/env python3
"""AI GURU Industry Graph · 零依赖 MCP server（stdio / JSON-RPC 2.0）。

让 Claude Desktop、Cursor、Cline 等 MCP 客户端直接查询：
  - 产业链节点（5 层 / 69 节点 / 207 细分）
  - 线索时间线（95 条）
  - 大事记（169 条）
  - 六态核验台账（154 条）
  - 主题域、模型、玩家、术语

不需要安装任何 SDK：只依赖 Python 3.10+ 标准库与仓库内的 data/*.json。

启动：
  python3 tools/mcp/aiguru_mcp.py

MCP 客户端配置（Claude Desktop / Cursor）：
  {
    "mcpServers": {
      "ai-guru": {
        "command": "python3",
        "args": ["/absolute/path/to/tools/mcp/aiguru_mcp.py"]
      }
    }
  }

协议版本：2025-06-18（同时兼容 2024-11-05 客户端）。
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
PROTOCOL_VERSION = "2025-06-18"
SERVER_INFO = {"name": "ai-guru-industry-graph", "version": "0.1.0"}


def load(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


INDEX = load("index.json")
CHAIN = load("chain.json")
TOPICS = load("topics.json")
CLUES = load("clues.json")
CHRONICLE = load("chronicle.json")
VERIFY = load("verify.json")
MODELS = load("models.json")
PLAYERS = load("players.json")
GLOSSARY = load("glossary.json")
EXPLAIN = load("explain.json")
DEEP = load("deep.json")

NODES = []
for _layer in CHAIN["layers"]:
    for _node in _layer["nodes"]:
        _node["_layer"] = _layer["key"]
        _node["_layerName"] = _layer.get("name", "")
        NODES.append(_node)
NODE_BY_UID = {n["uid"]: n for n in NODES}
NODE_BY_ID = {n["id"]: n for n in NODES}
CLUE_BY_ID = {c["id"]: c for c in CLUES["items"]}
CLUE_BY_UID = {c["uid"]: c for c in CLUES["items"]}
TOPIC_BY_KEY = {t["key"]: t for t in TOPICS["items"]}


# ---------------------------------------------------------------- 工具函数
def _node_brief(node: dict) -> dict:
    return {
        "uid": node["uid"],
        "id": node["id"],
        "name": node["name"],
        "layer": node["_layer"],
        "layerName": node["_layerName"],
        "def": node.get("def", ""),
        "maturity": node.get("maturity", ""),
        "url": node.get("url", ""),
    }


def _match_node(query: str | None = None, layer: str | None = None, limit: int = 20) -> list[dict]:
    q = (query or "").strip().lower()
    out = []
    for n in NODES:
        if layer and n["_layer"].lower() != layer.lower():
            continue
        hay = " ".join([n["name"], n.get("def", ""), " ".join(n.get("keywords", []) or [])]).lower()
        if q and q not in hay:
            continue
        out.append(_node_brief(n))
    return out[: max(1, min(limit, 100))]


def _evidence_for(node: dict) -> dict:
    kws = [k.lower() for k in node.get("keywords", []) if k]
    clues = []
    for c in CLUES["items"]:
        hay = " ".join([c.get("name", ""), c.get("quote", ""), c.get("body", "")]).lower()
        if any(k in hay for k in kws):
            clues.append({
                "id": c["id"], "name": c["name"], "topic": c["topic"],
                "nEvents": c.get("nEvents", 0), "lastEvent": c.get("lastEvent", ""),
                "updated": c.get("updated", ""),
            })
    events = []
    for e in CHRONICLE["items"]:
        hay = (e.get("title", "") + " " + e.get("summary", "")).lower()
        if any(k in hay for k in kws):
            events.append({"date": e["date"], "title": e["title"], "cat": e.get("cat", "")})
    clues.sort(key=lambda x: (x["nEvents"], x["updated"]), reverse=True)
    events.sort(key=lambda x: x["date"], reverse=True)
    return {"clues": clues[:20], "events": events[:20]}


def tool_result(payload) -> dict:
    text = payload if isinstance(payload, str) else json.dumps(payload, ensure_ascii=False, indent=2)
    return {"content": [{"type": "text", "text": text}], "isError": False}


def tool_error(message: str) -> dict:
    return {"content": [{"type": "text", "text": message}], "isError": True}


# ---------------------------------------------------------------- 工具定义
TOOLS = [
    {
        "name": "dataset_info",
        "description": "返回数据集版本、asOf、计数、许可证与稳定 ID 规则。",
        "inputSchema": {"type": "object", "properties": {}, "additionalProperties": False},
    },
    {
        "name": "search_nodes",
        "description": "按关键词搜索产业链节点；可按层 L1–L5 过滤。",
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "关键词，如 GPU、光模块、agent"},
                "layer": {"type": "string", "description": "可选：L1 / L2 / L3 / L4 / L5"},
                "limit": {"type": "integer", "minimum": 1, "maximum": 100, "default": 20},
            },
            "additionalProperties": False,
        },
    },
    {
        "name": "get_node",
        "description": "按 uid（chain/L1/gpu）或 id（gpu）获取节点：拆解卡、六层解释、深度拆解摘要、关联节点与证据。",
        "inputSchema": {
            "type": "object",
            "properties": {"node": {"type": "string", "description": "uid 或 id"}},
            "required": ["node"],
            "additionalProperties": False,
        },
    },
    {
        "name": "get_node_evidence",
        "description": "按节点 uid/id 聚合相关线索与大事（关键词近似口径）。",
        "inputSchema": {
            "type": "object",
            "properties": {"node": {"type": "string"}},
            "required": ["node"],
            "additionalProperties": False,
        },
    },
    {
        "name": "list_topics",
        "description": "列出 18 个横向主题域及其线索数。",
        "inputSchema": {"type": "object", "properties": {}, "additionalProperties": False},
    },
    {
        "name": "list_clues",
        "description": "列出线索；可按主题或关键词过滤。",
        "inputSchema": {
            "type": "object",
            "properties": {
                "topic": {"type": "string", "description": "主题名，如 基础模型"},
                "query": {"type": "string", "description": "关键词"},
                "limit": {"type": "integer", "minimum": 1, "maximum": 100, "default": 20},
            },
            "additionalProperties": False,
        },
    },
    {
        "name": "get_clue",
        "description": "按线索 id（基础模型/Claude）或 uid（clue/基础模型/Claude）获取元数据、正文与分析。",
        "inputSchema": {
            "type": "object",
            "properties": {"clue": {"type": "string"}},
            "required": ["clue"],
            "additionalProperties": False,
        },
    },
    {
        "name": "search_events",
        "description": "搜索年度大事记；可按起始日期过滤。",
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "since": {"type": "string", "description": "YYYY-MM-DD"},
                "limit": {"type": "integer", "minimum": 1, "maximum": 100, "default": 20},
            },
            "additionalProperties": False,
        },
    },
    {
        "name": "list_verify",
        "description": "列出六态核验台账；可按状态过滤（✅⚠️❓🔍✗E）。",
        "inputSchema": {
            "type": "object",
            "properties": {
                "status": {"type": "string", "description": "✅ / ⚠️ / ❓ / 🔍 / ✗ / E"},
                "limit": {"type": "integer", "minimum": 1, "maximum": 200, "default": 30},
            },
            "additionalProperties": False,
        },
    },
    {
        "name": "search_terms",
        "description": "搜索术语库。",
        "inputSchema": {
            "type": "object",
            "properties": {"query": {"type": "string"}, "limit": {"type": "integer", "minimum": 1, "maximum": 100, "default": 20}},
            "additionalProperties": False,
        },
    },
]


# ---------------------------------------------------------------- 工具实现
def call_tool(name: str, args: dict) -> dict:
    if name == "dataset_info":
        return tool_result({
            "name": INDEX["name"],
            "nameZh": INDEX["nameZh"],
            "version": INDEX["version"],
            "asOf": INDEX["asOf"],
            "counts": INDEX["counts"],
            "license": INDEX["license"],
            "citation": INDEX["citation"],
            "stableIds": [
                "ai-guru:chain/<layer>/<node>",
                "ai-guru:clue/<topic>/<clue>",
                "ai-guru:term/<key>",
                "ai-guru:event/<date>/<hash>",
            ],
        })

    if name == "search_nodes":
        rows = _match_node(args.get("query"), args.get("layer"), args.get("limit", 20))
        return tool_result({"count": len(rows), "nodes": rows})

    if name == "get_node":
        key = str(args.get("node", "")).strip()
        node = NODE_BY_UID.get(key) or NODE_BY_ID.get(key) or NODE_BY_UID.get(f"chain/{key}")
        if not node:
            return tool_error(f"未找到节点：{key}")
        ex = EXPLAIN["items"].get(node["id"], {})
        dp = DEEP["items"].get(node["id"], {})
        return tool_result({
            "uid": node["uid"],
            "id": node["id"],
            "name": node["name"],
            "layer": node["_layer"],
            "layerName": node["_layerName"],
            "def": node.get("def", ""),
            "maturity": node.get("maturity", ""),
            "why": node.get("why", ""),
            "moat": node.get("moat", ""),
            "bottleneck": node.get("bottleneck", ""),
            "signals": node.get("signals", []),
            "upstream": node.get("upstream", []),
            "downstream": node.get("downstream", []),
            "sub": node.get("sub", []),
            "levels": ex.get("levels", []),
            "industries": ex.get("industries", []),
            "deep": {
                "boundary": dp.get("boundary", ""),
                "market": dp.get("market", {}),
                "landscape": dp.get("landscape", {}),
                "thesis": dp.get("thesis", {}),
                "verdict": dp.get("verdict", {}),
            },
            "evidence": _evidence_for(node),
            "url": node.get("url", ""),
        })

    if name == "get_node_evidence":
        key = str(args.get("node", "")).strip()
        node = NODE_BY_UID.get(key) or NODE_BY_ID.get(key) or NODE_BY_UID.get(f"chain/{key}")
        if not node:
            return tool_error(f"未找到节点：{key}")
        return tool_result({"node": _node_brief(node), **_evidence_for(node)})

    if name == "list_topics":
        return tool_result({"count": TOPICS["count"], "topics": [
            {"uid": t["uid"], "key": t["key"], "en": t["en"], "def": t["def"], "count": t["count"]}
            for t in TOPICS["items"]
        ]})

    if name == "list_clues":
        topic = args.get("topic")
        q = (args.get("query") or "").lower()
        limit = max(1, min(int(args.get("limit", 20)), 100))
        rows = []
        for c in CLUES["items"]:
            if topic and c["topic"] != topic:
                continue
            if q and q not in (c["name"] + " " + c.get("quote", "")).lower():
                continue
            rows.append({
                "uid": c["uid"], "id": c["id"], "name": c["name"], "topic": c["topic"],
                "status": c.get("status", ""), "nEvents": c.get("nEvents", 0),
                "lastEvent": c.get("lastEvent", ""), "updated": c.get("updated", ""),
            })
        rows.sort(key=lambda x: (x["updated"], x["nEvents"]), reverse=True)
        return tool_result({"count": len(rows[:limit]), "clues": rows[:limit]})

    if name == "get_clue":
        key = str(args.get("clue", "")).strip()
        c = CLUE_BY_UID.get(key) or CLUE_BY_ID.get(key)
        if not c:
            return tool_error(f"未找到线索：{key}")
        return tool_result(c)

    if name == "search_events":
        q = (args.get("query") or "").lower()
        since = args.get("since", "")
        limit = max(1, min(int(args.get("limit", 20)), 100))
        rows = []
        for e in CHRONICLE["items"]:
            if since and e["date"] < since:
                continue
            if q and q not in (e.get("title", "") + " " + e.get("summary", "")).lower():
                continue
            rows.append({"uid": e["uid"], "date": e["date"], "title": e["title"],
                         "url": e.get("url", ""), "cat": e.get("cat", ""), "summary": e.get("summary", "")})
        rows.sort(key=lambda x: x["date"], reverse=True)
        return tool_result({"count": len(rows[:limit]), "events": rows[:limit]})

    if name == "list_verify":
        status = args.get("status", "")
        limit = max(1, min(int(args.get("limit", 30)), 200))
        rows = [v for v in VERIFY["items"] if not status or v.get("status") == status]
        rows.sort(key=lambda v: v.get("date", ""), reverse=True)
        return tool_result({"count": len(rows[:limit]), "items": rows[:limit]})

    if name == "search_terms":
        q = (args.get("query") or "").lower()
        limit = max(1, min(int(args.get("limit", 20)), 100))
        rows = []
        for item in GLOSSARY.get("items", []):
            hay = " ".join([item.get("t", ""), item.get("b", ""), " ".join(item.get("a", []) or [])]).lower()
            if q and q not in hay:
                continue
            rows.append(item)
        return tool_result({"count": len(rows[:limit]), "terms": rows[:limit]})

    return tool_error(f"未知工具：{name}")


# ---------------------------------------------------------------- JSON-RPC
def reply(msg_id, result=None, error=None) -> None:
    payload = {"jsonrpc": "2.0", "id": msg_id}
    if error is not None:
        payload["error"] = error
    else:
        payload["result"] = result if result is not None else {}
    sys.stdout.write(json.dumps(payload, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def handle(msg: dict) -> None:
    method = msg.get("method")
    msg_id = msg.get("id")

    # notifications 不需要回复
    if msg_id is None:
        return

    if method == "initialize":
        requested = (msg.get("params") or {}).get("protocolVersion") or PROTOCOL_VERSION
        reply(msg_id, {
            "protocolVersion": requested if requested in ("2024-11-05", "2025-03-26", "2025-06-18") else PROTOCOL_VERSION,
            "capabilities": {"tools": {}},
            "serverInfo": SERVER_INFO,
        })
        return

    if method == "ping":
        reply(msg_id, {})
        return

    if method == "tools/list":
        reply(msg_id, {"tools": TOOLS})
        return

    if method == "tools/call":
        params = msg.get("params") or {}
        name = params.get("name", "")
        args = params.get("arguments") or {}
        try:
            reply(msg_id, call_tool(name, args))
        except Exception as exc:  # noqa: BLE001
            print(f"[aiguru-mcp] tool error: {exc}", file=sys.stderr)
            reply(msg_id, error={"code": -32603, "message": f"工具执行失败：{exc}"})
        return

    reply(msg_id, error={"code": -32601, "message": f"Method not found: {method}"})


def main() -> None:
    print(f"[aiguru-mcp] ready · {INDEX['name']} v{INDEX['version']} · {len(NODES)} nodes",
          file=sys.stderr, flush=True)
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            msg = json.loads(line)
        except json.JSONDecodeError:
            reply(None, error={"code": -32700, "message": "Parse error"})
            continue
        if isinstance(msg, list):
            for item in msg:
                handle(item)
        else:
            handle(msg)


if __name__ == "__main__":
    main()