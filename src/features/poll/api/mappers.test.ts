import { describe, expect, it } from "vitest";

import type { PollDetailResponse } from "@/shared/api/generated/model";

import { toPoll, toVote } from "./mappers";

const base: PollDetailResponse = {
  id: "p1",
  category: "SOME",
  question: "답장이 늦어요",
  participantCount: 12,
  closed: false,
  closesAt: null,
  status: "PUBLIC",
  myChoice: null,
  options: [
    { position: 2, content: "B" },
    { position: 1, content: "A" },
  ],
};

describe("toPoll", () => {
  it("작성자 여부(mine)가 없으면 내 글이 아닌 것으로 본다", () => {
    expect(toPoll(base)?.mine).toBe(false);
    expect(toPoll({ ...base, mine: true } as PollDetailResponse)?.mine).toBe(true);
    expect(toPoll({ ...base, mine: "yes" } as unknown as PollDetailResponse)?.mine).toBe(
      false,
    );
  });

  it("선택지를 position 순으로 정렬한다", () => {
    expect(toPoll(base)?.options.map((o) => o.content)).toEqual(["A", "B"]);
  });

  it("결과가 없으면 result 는 null", () => {
    expect(toPoll(base)?.result).toBeNull();
  });

  it("결과를 position → 득표수로 바꾼다", () => {
    const poll = toPoll({
      ...base,
      myChoice: 1,
      result: {
        total: 5,
        options: [
          { position: 1, count: 3 },
          { position: 2, count: 2 },
        ],
      },
    });
    expect(poll?.result).toEqual({ total: 5, counts: { 1: 3, 2: 2 } });
    expect(poll?.myChoice).toBe(1);
  });

  it("myChoice 가 0 이어도 참여로 읽는다", () => {
    const result = { total: 1, options: [{ position: 0, count: 1 }] };
    expect(toPoll({ ...base, myChoice: 0, result })?.myChoice).toBe(0);
  });

  it("결과를 보여줘야 하는 상태(참여·마감)인데 결과가 없으면 쓸 수 없는 응답이다", () => {
    expect(toPoll({ ...base, myChoice: 1 })).toBeNull();
    expect(toPoll({ ...base, closed: true })).toBeNull();
  });

  it("모르는 status 는 공개로 간주하지 않고 거른다", () => {
    expect(toPoll({ ...base, status: "UNDER_REVIEW" as never })).toBeNull();
    expect(toPoll({ ...base, status: undefined })?.status).toBe("PUBLIC");
    expect(toPoll({ ...base, status: "HIDDEN" })?.status).toBe("HIDDEN");
  });

  it("id·질문이 없거나 선택지가 2개 미만이면 쓸 수 없는 응답이다", () => {
    expect(toPoll({ ...base, id: undefined })).toBeNull();
    expect(toPoll({ ...base, question: "" })).toBeNull();
    expect(toPoll({ ...base, options: [{ position: 1, content: "A" }] })).toBeNull();
    expect(toPoll({ ...base, options: [{ position: 1 }, { content: "B" }] })).toBeNull();
  });
});

describe("toVote", () => {
  it("선택과 결과가 모두 있어야 한다", () => {
    expect(
      toVote({ myChoice: 1, result: { total: 1, options: [{ position: 1, count: 1 }] } }),
    ).toEqual({
      myChoice: 1,
      result: { total: 1, counts: { 1: 1 } },
    });
    expect(toVote({ myChoice: 1 })).toBeNull();
    expect(toVote({ result: { total: 1 } })).toBeNull();
  });
});
