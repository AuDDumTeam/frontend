#!/bin/bash
# 수정한 파일 하나만 ESLint 자동 수정 후, 남은 오류를 Claude에게 알린다.
set -u
input=$(cat)
file=$(jq -r '.tool_input.file_path // empty' <<<"$input")

[[ -z "$file" ]] && exit 0
[[ "$file" =~ \.(ts|tsx)$ ]] || exit 0                  # ts/tsx만 대상
[[ -f "$CLAUDE_PROJECT_DIR/package.json" ]] || exit 0   # 세팅 전에는 건너뜀
cd "$CLAUDE_PROJECT_DIR" || exit 0

out=$(pnpm exec eslint --fix "$file" 2>&1) || {
  echo "ESLint 오류 (규칙 위반 포함):" >&2
  echo "$out" >&2
  exit 2          # PostToolUse: stderr가 Claude에게 전달됨
}
exit 0
