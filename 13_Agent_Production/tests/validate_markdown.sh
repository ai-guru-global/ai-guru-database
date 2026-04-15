#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

npm exec --yes --package markdownlint-cli@0.44.0 -- markdownlint \
  --disable=MD013 \
  "${root_dir}/README.md" \
  "${root_dir}/Agent_Harness/The_Anatomy_of_an_Agent_Harness.md"
