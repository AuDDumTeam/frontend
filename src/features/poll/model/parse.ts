import { isPollCategory, type PollCategory } from "./category";
import type { PollStatus } from "./poll";

/**
 * API 응답 값을 도메인 값으로 보정하는 규칙. 피드와 상세가 같은 규칙을 쓰도록 한 곳에 둔다.
 */

/** 알 수 없는 카테고리는 기타로 본다. (서버가 새 카테고리를 추가해도 화면이 깨지지 않게) */
export const toCategory = (value: unknown): PollCategory =>
  isPollCategory(value) ? value : "ETC";

/** 날짜가 없거나 해석할 수 없으면 null. */
export const toDate = (value: string | null | undefined): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const POLL_STATUSES: readonly PollStatus[] = ["PUBLIC", "HIDDEN", "DELETED"];

/**
 * 값이 없으면 공개로 본다. 모르는 값은 null — 공개 여부는 모를 때 비공개 쪽이 안전하다.
 * (카테고리와 달리 "기타" 같은 안전한 기본값이 없다)
 */
export const toPollStatus = (value: string | undefined): PollStatus | null => {
  if (value === undefined) return "PUBLIC";
  return POLL_STATUSES.find((s) => s === value) ?? null;
};
