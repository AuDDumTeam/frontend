import { isPollCategory, type PollCategory } from "./category";

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
