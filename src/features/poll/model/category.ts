/** 백엔드 카테고리 코드 → 화면 라벨. 순서는 홈 필터 칩 순서(전체 다음)와 같다. */
export const CATEGORY_LABEL = {
  SOME: "썸",
  BLIND_DATE: "소개팅",
  CONTACT: "연락",
  IN_RELATIONSHIP: "연애 중",
  BREAKUP: "이별",
  LOVE_VALUES: "연애 가치관",
  ETC: "기타",
} as const;

export type PollCategory = keyof typeof CATEGORY_LABEL;

export const POLL_CATEGORIES = Object.keys(CATEGORY_LABEL) as PollCategory[];

export const isPollCategory = (value: unknown): value is PollCategory =>
  typeof value === "string" && Object.hasOwn(CATEGORY_LABEL, value);
