#!/bin/bash
# 종료 직전 pnpm verify. 실패하면 Claude가 계속 고치게 한다.
set -u
input=$(cat)

# 이미 훅 때문에 이어서 작업 중이면 다시 막지 않는다 (무한 루프 방지)
[[ "$(jq -r '.stop_hook_active // false' <<<"$input")" == "true" ]] && exit 0

[[ -f "$CLAUDE_PROJECT_DIR/package.json" ]] || exit 0   # 세팅 전에는 건너뜀
cd "$CLAUDE_PROJECT_DIR" || exit 0

# 코드 변경이 없으면 검증하지 않는다
git diff --quiet HEAD -- src 2>/dev/null && [[ -z "$(git ls-files --others --exclude-standard src 2>/dev/null)" ]] && exit 0

out=$(pnpm verify 2>&1) || {
  jq -n --arg r "pnpm verify 실패. 아래를 고친 뒤 다시 확인하세요:
$(echo "$out" | tail -40)" '{decision:"block", reason:$r}'
  exit 0
}
exit 0
