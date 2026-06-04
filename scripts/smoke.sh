#!/usr/bin/env bash
#
# Smoke-tests a running stack: waits for health, then checks that the public API
# actually returns the Home Page the challenge asks for.
#
#   docker compose up --build -d && bash scripts/smoke.sh
#
# Exits non-zero on the first failure, so it is usable as a CI gate. The output of
# this script is what the README's "Captured output" section shows.

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8270}"
TIMEOUT="${TIMEOUT:-180}"

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }
fail() { printf '\033[31mFAIL\033[0m %s\n' "$*" >&2; exit 1; }
pass() { printf '\033[32m  ok\033[0m %s\n' "$*"; }

say "Waiting for $BASE_URL/_health (up to ${TIMEOUT}s)"
deadline=$(( $(date +%s) + TIMEOUT ))
until curl -fsS -o /dev/null "$BASE_URL/_health" 2>/dev/null; do
  [ "$(date +%s)" -lt "$deadline" ] || fail "CMS did not become healthy in ${TIMEOUT}s"
  sleep 3
done
pass "healthy"

say "GET /api/home-page"
rest="$(curl -fsS "$BASE_URL/api/home-page")" || fail "REST request failed"
echo "$rest" | head -c 600
echo

python3 - "$rest" <<'PY' || fail "REST payload did not match the brief"
import json, sys
from collections import Counter

payload = json.loads(sys.argv[1])
sections = payload["data"]["attributes"]["sections"]
counts = Counter(s["__component"] for s in sections)

expected = {
    "common.two-column-block": 2,
    "common.header": 1,
    "common.carousel": 1,
}
assert counts == Counter(expected), f"got {dict(counts)}, expected {expected}"

carousel = next(s for s in sections if s["__component"] == "common.carousel")
assert len(carousel["Item"]) >= 3, "carousel has no items"

two_col = [s for s in sections if s["__component"] == "common.two-column-block"]
assert all(s.get("Image", {}).get("data") for s in two_col), "a block is missing its image"
print(f"  sections: {dict(counts)}  carousel items: {len(carousel['Item'])}")
PY
pass "2 two-column blocks, 1 header, 1 carousel — populated, with media"

say "Cache-Control on an anonymous content read"
cache_header="$(curl -fsS -D - -o /dev/null "$BASE_URL/api/home-page" | tr -d '\r' | grep -i '^cache-control:' || true)"
[ -n "$cache_header" ] || fail "no Cache-Control header"
echo "  $cache_header"
pass "public content reads are cacheable"

say "POST /graphql — the front-end's homePage query"
graphql="$(curl -fsS -X POST "$BASE_URL/graphql" \
  -H 'Content-Type: application/json' \
  --data '{"query":"{ homePage { data { attributes { sections { __typename ... on ComponentCommonHeader { Text ButtonText ButtonLink } ... on ComponentCommonTwoColumnBlock { TitleText ImagePosition Image { data { attributes { url } } } } ... on ComponentCommonCarousel { Item { TitleText } } } } } } }"}')" \
  || fail "GraphQL request failed"
echo "$graphql" | head -c 600
echo

python3 - "$graphql" <<'PY' || fail "GraphQL payload did not match the contract"
import json, sys

payload = json.loads(sys.argv[1])
assert "errors" not in payload, payload["errors"]
sections = payload["data"]["homePage"]["data"]["attributes"]["sections"]
typenames = [s["__typename"] for s in sections]
for expected in ("ComponentCommonHeader", "ComponentCommonTwoColumnBlock", "ComponentCommonCarousel"):
    assert expected in typenames, f"{expected} missing from {typenames}"
print(f"  __typenames: {typenames}")
PY
pass "GraphQL contract satisfied"

say "Query depth limit rejects an over-deep query"
deep='{"query":"{ homePage { data { attributes { sections { ... on ComponentCommonCarousel { Item { Image { data { attributes { related { ... on ComponentCommonTwoColumnBlock { Image { data { attributes { related { __typename } } } } } } } } } } } } } } } }"}'
# No -f here: the whole point is that the server answers 400, which -f turns into
# an empty body and a non-zero exit.
depth_response="$(curl -sS -X POST "$BASE_URL/graphql" -H 'Content-Type: application/json' --data "$deep" || true)"
echo "$depth_response" | grep -q 'exceeds maximum operation depth' \
  || fail "an over-deep query was accepted: $(echo "$depth_response" | head -c 200)"
echo "  $(echo "$depth_response" | python3 -c 'import json,sys; print(json.load(sys.stdin)["errors"][0]["message"])')"
pass "depth limit enforced"

say "All smoke checks passed against $BASE_URL"
