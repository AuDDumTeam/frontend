import type { Poll } from "./poll";

/**
 * 상세 화면이 보여줄 모드.
 *   vote   미참여 + 진행 중 → 선택지를 고르고 제출
 *   result 참여했거나 마감 → 결과. 마감이면 안내 박스를 함께 보인다.
 */
export type PollView = { kind: "vote" } | { kind: "result"; closed: boolean };

export function getPollView(poll: Pick<Poll, "closed" | "myChoice">): PollView {
  const voted = poll.myChoice !== null;
  if (poll.closed || voted) return { kind: "result", closed: poll.closed };
  return { kind: "vote" };
}
