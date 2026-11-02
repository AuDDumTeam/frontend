import { describe, expect, it } from "vitest";

import type { PollSummaryResponse } from "@/shared/api/generated/model";

import { toFeedItem } from "./mappers";

const dto: PollSummaryResponse = {
  id: "p1",
  category: "CONTACT",
  question: "답장이 늦는 건 관심이 없다는 뜻일까요?",
  participantCount: 292,
  closed: false,
  closesAt: null,
  createdAt: "2026-11-02T00:00:00Z",
};

describe("toFeedItem", () => {
  it("필요한 값을 그대로 옮긴다", () => {
    expect(toFeedItem(dto)).toMatchObject({
      id: "p1",
      category: "CONTACT",
      participantCount: 292,
      closed: false,
      closesAt: null,
    });
  });

  it("목록에는 참여 여부가 없어 joined 는 false", () => {
    expect(toFeedItem(dto)?.joined).toBe(false);
  });

  it("id·질문이 없으면 걸러낸다", () => {
    expect(toFeedItem({ ...dto, id: undefined })).toBeNull();
    expect(toFeedItem({ ...dto, question: undefined })).toBeNull();
  });

  it("모르는 카테고리는 기타, 값이 비어 있으면 안전한 기본값", () => {
    const item = toFeedItem({ id: "p2", question: "q", category: "NEW" as never });
    expect(item).toMatchObject({ category: "ETC", participantCount: 0, closed: false });
  });
});
