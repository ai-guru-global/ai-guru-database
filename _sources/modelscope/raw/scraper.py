#!/usr/bin/env python3
"""ModelScope organization model scraper.

Fetches all official models for each LLM vendor organization via the
PUT /api/v1/dolphin/models search endpoint, filtering results to those whose
Path matches the official org namespace. Saves raw JSON per org.
"""
import urllib.request
import json
import time
import os
import sys

API = "https://modelscope.cn/api/v1/dolphin/models"
HERE = os.path.dirname(os.path.abspath(__file__))

# (label, namespace, [search terms to maximize recall])
# namespace is the authoritative Path filter; search terms find candidate pages.
ORGS = [
    ("Qwen", "qwen", ["qwen"]),
    ("DeepSeek", "deepseek-ai", ["deepseek-ai", "deepseek"]),
    ("ZhipuAI", "ZhipuAI", ["ZhipuAI", "glm"]),
    ("01.AI", "01ai", ["01ai"]),
    ("Baichuan", "baichuan-inc", ["baichuan-inc", "baichuan"]),
    ("StepFun", "stepfun-ai", ["stepfun-ai", "stepfun"]),
    ("Tencent_Hunyuan", "Tencent-Hunyuan", ["Tencent-Hunyuan", "hunyuan"]),
    ("InternLM", "Shanghai_AI_Laboratory", ["Shanghai_AI_Laboratory", "internlm"]),
    ("SenseNova", "SenseNova", ["SenseNova"]),
    ("Skywork", "Skywork", ["Skywork"]),
    ("Moonshot", "moonshotai", ["moonshot-ai", "kimi", "moonshotai"]),
    ("MiniMax", "MiniMax", ["MiniMax"]),
    ("iFLYTEK", "iflytek", ["iflytek"]),
    ("ByteDance_Seed", "bytedance-community", ["bytedance-community", "ByteDance"]),
    ("Qihoo_360", "qihoo360", ["qihoo360", "360zhinao"]),
]

PAGE_SIZE = 100
MAX_PAGES = 300            # hard safety cap per search term
EMPTY_STREAK_BREAK = 12    # consecutive pages w/ 0 official -> stop that term


def query(term, page, size=PAGE_SIZE, retries=5):
    body = json.dumps(
        {"Name": term, "PageSize": size, "PageNumber": page, "SortBy": "Default"}
    ).encode()
    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                API, data=body,
                headers={"Content-Type": "application/json",
                         "User-Agent": "Mozilla/5.0"},
                method="PUT",
            )
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.loads(r.read())
        except Exception as e:
            last_err = e
            # transient SSL/connection errors: back off and retry
            time.sleep(2.0 * (attempt + 1))
    raise last_err


def slim_model(m):
    """Reduce a model record to the fields we care about."""
    tasks = []
    for t in (m.get("Tasks") or []):
        if isinstance(t, dict):
            tasks.append({"Name": t.get("Name"), "ChineseName": t.get("ChineseName")})
    return {
        "id": "{}/{}".format(m.get("Path", ""), m.get("Name", "")),
        "Name": m.get("Name"),
        "Path": m.get("Path"),
        "ChineseName": m.get("ChineseName"),
        "NickName": m.get("NickName"),
        "Description": m.get("Description"),
        "Downloads": m.get("Downloads"),
        "Stars": m.get("Stars"),
        "StorageSize": m.get("StorageSize"),
        "License": m.get("License"),
        "Libraries": m.get("Libraries"),
        "Frameworks": m.get("Frameworks"),
        "ModelType": m.get("ModelType"),
        "Architectures": m.get("Architectures"),
        "Tasks": tasks,
        "Tags": m.get("Tags"),
        "CreatedTime": m.get("CreatedTime"),
        "LastUpdatedTime": m.get("LastUpdatedTime"),
        "Visibility": m.get("Visibility"),
        "ModelSource": m.get("ModelSource"),
        "url": "https://modelscope.cn/models/{}/{}".format(m.get("Path", ""), m.get("Name", "")),
    }


def scrape_org(label, namespace, terms):
    collected = {}   # id -> slim_model
    org_meta = None
    stats = {"total_counts": [], "pages_fetched": 0, "candidates": 0}

    for term in terms:
        empty_streak = 0
        for page in range(1, MAX_PAGES + 1):
            d = query(term, page)
            stats["pages_fetched"] += 1
            model_data = d.get("Data", {}).get("Model", {})
            total = model_data.get("TotalCount", 0)
            models = model_data.get("Models", []) or []
            if page == 1:
                stats["total_counts"].append({"term": term, "TotalCount": total})

            official = [m for m in models if (m.get("Path") or "").lower() == namespace.lower()]
            for m in official:
                if org_meta is None and m.get("Organization"):
                    org_meta = m["Organization"]
                s = slim_model(m)
                collected[s["id"].lower()] = s

            stats["candidates"] += len(official)
            if official:
                empty_streak = 0
            else:
                empty_streak += 1

            # stop conditions
            if len(models) < PAGE_SIZE:
                break
            if empty_streak >= EMPTY_STREAK_BREAK and page > 20:
                break
            time.sleep(0.25)

    models_list = sorted(collected.values(),
                         key=lambda x: (x.get("Downloads") or 0), reverse=True)
    result = {
        "label": label,
        "namespace": namespace,
        "organization": org_meta,
        "model_count": len(models_list),
        "stats": stats,
        "models": models_list,
    }
    out = os.path.join(HERE, "{}.json".format(label))
    with open(out, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    total_dl = sum(m.get("Downloads") or 0 for m in models_list)
    print("  [OK] {:18s} {:4d} models, {:,} total downloads -> {}".format(
        label, len(models_list), total_dl, os.path.basename(out)))
    return result


def main():
    targets = sys.argv[1:] if len(sys.argv) > 1 else None
    print("Scraping ModelScope organizations...")
    summary = []
    for label, ns, terms in ORGS:
        if targets and label not in targets:
            continue
        print(">> {}".format(label))
        try:
            r = scrape_org(label, ns, terms)
            summary.append({"label": label, "namespace": ns,
                            "model_count": r["model_count"]})
        except Exception as e:
            print("  [FAIL] {}: {}".format(label, e))
            summary.append({"label": label, "namespace": ns,
                            "model_count": "ERROR: {}".format(e)})
    with open(os.path.join(HERE, "_summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print("\n=== SUMMARY ===")
    total = 0
    for s in summary:
        c = s["model_count"] if isinstance(s["model_count"], int) else 0
        total += c
        print("  {:18s} {}".format(s["label"], s["model_count"]))
    print("  TOTAL: {}".format(total))


if __name__ == "__main__":
    main()
