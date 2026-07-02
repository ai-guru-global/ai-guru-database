#!/usr/bin/env bash
# AI Guru Corpus Export — production wrapper
# Usage:
#   release/scripts/export.sh full      # full vault export
#   release/scripts/export.sh subset    # K8s/GPU/ops subset (token-budget)
#   release/scripts/export.sh full --dry-run
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${REPO_ROOT}/_tools/export_corpus.py"
PKG_DIR="${REPO_ROOT}/release/package"

SCOPE="${1:-full}"
DRY_RUN=""
if [[ "${2:-}" == "--dry-run" ]]; then
    DRY_RUN="--dry-run"
fi

TAG="$(date '+%Y-%m-%d_%H%M')"
OUT="${PKG_DIR}/${TAG}"

if [[ -z "$DRY_RUN" ]]; then
    mkdir -p "$OUT"
fi

echo "╔══════════════════════════════════════════════╗"
echo "║  AI Guru Corpus Export                      ║"
echo "║  scope:   ${SCOPE}                           "
echo "║  output:  release/package/${TAG}/            "
echo "╚══════════════════════════════════════════════╝"
echo ""

python3 "$SCRIPT" \
    --scope "$SCOPE" \
    --output "$OUT" \
    --clean \
    --allow-dirty \
    $DRY_RUN

echo ""
if [[ -z "$DRY_RUN" ]]; then
    echo "✅ Package ready: release/package/${TAG}/"
    echo "   Manifest:      release/package/${TAG}/corpus_manifest.json"
    echo "   Index:         release/package/${TAG}/index.md"
    echo "   Entry point:   release/package/${TAG}/_synthesis/diagnosis-work-order-hub.md"
fi
