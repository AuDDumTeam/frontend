import type { Poll, PollResult } from "./poll";

/** 투표 응답을 이미 불러온 고민에 반영한다. 응답을 기다리지 않고 결과 화면으로 바꾸기 위한 순수 함수. */
export function applyVote(
  poll: Poll,
  vote: { myChoice: number; result: PollResult },
): Poll {
  return {
    ...poll,
    myChoice: vote.myChoice,
    result: vote.result,
    participantCount: vote.result.total,
  };
}
