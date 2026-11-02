import type { Poll } from "./poll";

/** README: Math.round(votes / total * 100). 합이 100이 아닐 수 있고 그대로 허용한다. */
export const percentOf = (count: number, total: number): number =>
  total > 0 ? Math.round((count / total) * 100) : 0;

export type ResultRow = {
  position: number;
  content: string;
  count: number;
  percent: number;
  isMine: boolean;
};

/**
 * 결과 화면의 선택지별 행. 선택지 순서(position 오름차순)를 유지한다.
 * 결과가 없으면(미참여·진행 중) null — 퍼센트를 임의로 만들지 않는다.
 */
export function buildResultRows(
  poll: Pick<Poll, "options" | "result" | "myChoice">,
): ResultRow[] | null {
  const { result } = poll;
  if (!result) return null;

  return poll.options.map((option) => {
    const count = result.counts[option.position] ?? 0;
    return {
      position: option.position,
      content: option.content,
      count,
      percent: percentOf(count, result.total),
      isMine: poll.myChoice === option.position,
    };
  });
}
