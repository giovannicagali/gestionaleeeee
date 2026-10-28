#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
for pkg in shared rules-engine sync; do
 echo "==> Test: $pkg"
 node --experimental-strip-types --test "packages/$pkg/src/"*.test.ts
done
