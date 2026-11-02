const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/** 마감임박 표시 문구. 피드 pill 과 상세 메타가 같은 문구를 쓴다. */
export const CLOSING_SOON_LABEL = "곧 마감";

/** 마감까지 1시간 이내면 "마감임박"으로 본다. */
const SOON_THRESHOLD_MS = HOUR_MS;

/** 마감 시각이 지났는지는 서버가 판단한다(closed). 이 함수는 표시용 남은 시간만 다룬다. */
const remainingMs = (closesAt: Date | null, now: Date): number | null =>
  closesAt ? closesAt.getTime() - now.getTime() : null;

export function isClosingSoon(closesAt: Date | null, now: Date): boolean {
  const ms = remainingMs(closesAt, now);
  return ms !== null && ms > 0 && ms <= SOON_THRESHOLD_MS;
}

/**
 * 상세 메타에 붙는 남은 시간. 마감이 없거나 이미 지났으면 null.
 *   1시간 이내 → "곧 마감" / 24시간 미만 → "N시간 남음" / 그 이상 → "N일 남음"
 */
export function formatRemaining(closesAt: Date | null, now: Date): string | null {
  const ms = remainingMs(closesAt, now);
  if (ms === null || ms <= 0) return null;
  if (ms <= SOON_THRESHOLD_MS) return CLOSING_SOON_LABEL;
  if (ms < DAY_MS) return `${Math.floor(ms / HOUR_MS)}시간 남음`;
  return `${Math.floor(ms / DAY_MS)}일 남음`;
}
