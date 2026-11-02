import { describe, expect, it } from "vitest";

import { applyVote } from "./apply-vote";
import type { Poll } from "./poll";
import { getPollView } from "./view-state";

describe("getPollView", () => {
  it("미참여 + 진행 중이면 투표 화면", () => {
    expect(getPollView({ closed: false, myChoice: null })).toEqual({ kind: "vote" });
  });

  it("참여했으면 결과 화면", () => {
    expect(getPollView({ closed: false, myChoice: 2 })).toEqual({
      kind: "result",
      closed: false,
    });
  });

  it("마감됐으면 미참여여도 결과 화면 (마감 안내 포함)", () => {
    expect(getPollView({ closed: true, myChoice: null })).toEqual({
      kind: "result",
      closed: true,
    });
  });

  it("선택지 position 이 0이어도 참여한 것으로 본다", () => {
    expect(getPollView({ closed: false, myChoice: 0 }).kind).toBe("result");
  });
});

describe("applyVote", () => {
  const poll: Poll = {
    id: "p1",
    category: "SOME",
    question: "q",
    participantCount: 9,
    closed: false,
    closesAt: null,
    status: "PUBLIC",
    options: [
      { position: 1, content: "A" },
      { position: 2, content: "B" },
    ],
    myChoice: null,
    result: null,
  };

  it("내 선택과 결과를 반영하고 참여 인원을 맞춘다", () => {
    const next = applyVote(poll, {
      myChoice: 2,
      result: { total: 10, counts: { 1: 4, 2: 6 } },
    });
    expect(next.myChoice).toBe(2);
    expect(next.participantCount).toBe(10);
    expect(getPollView(next).kind).toBe("result");
  });

  it("원본을 바꾸지 않는다", () => {
    applyVote(poll, { myChoice: 1, result: { total: 10, counts: {} } });
    expect(poll.myChoice).toBeNull();
  });
});
