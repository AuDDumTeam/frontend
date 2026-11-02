/**
 * POST /polls 의 본문은 만든 고민의 공개 ID 문자열이다.
 * 따옴표로 감싸 내려와도(JSON 문자열) 같은 값으로 읽는다. 쓸 수 없으면 null.
 */
export function toCreatedPollId(data: unknown): string | null {
  if (typeof data !== "string") return null;
  const id = data.trim().replace(/^"|"$/g, "");
  return /^[A-Za-z0-9_-]+$/.test(id) ? id : null;
}
