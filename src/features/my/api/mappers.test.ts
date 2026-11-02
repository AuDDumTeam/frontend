import { describe, expect, it } from "vitest";

import { toMyPage, toMyPostItem, toMyVoteItem } from "./mappers";

describe("toMyVoteItem", () => {
  it("내 선택과 득표율을 담는다", () => {
    expect(
      toMyVoteItem({
        id: "a",
        question: "q",
        myChoice: { position: 0, content: "그대로", percent: 43 },
      }),
    ).toEqual({ id: "a", question: "q", choice: "그대로", percent: 43 });
  });

  it("득표율이 없으면 null 로 둔다(0% 로 꾸미지 않는다)", () => {
    expect(
      toMyVoteItem({ id: "a", question: "q", myChoice: { content: "x" } })?.percent,
    ).toBeNull();
  });

  it("id·질문·내 선택이 없으면 거른다", () => {
    expect(toMyVoteItem({ question: "q", myChoice: { content: "x" } })).toBeNull();
    expect(toMyVoteItem({ id: "a", myChoice: { content: "x" } })).toBeNull();
    expect(toMyVoteItem({ id: "a", question: "q" })).toBeNull();
  });
});

describe("toMyPostItem", () => {
  it("숨김 상태와 모르는 카테고리를 보정한다", () => {
    const item = toMyPostItem({
      id: "a",
      question: "q",
      category: "NEW" as never,
      status: "HIDDEN",
    });
    expect(item).toMatchObject({
      category: "ETC",
      status: "HIDDEN",
      participantCount: 0,
    });
  });

  it("모르는 상태나 삭제된 것은 거른다", () => {
    expect(toMyPostItem({ id: "a", question: "q", status: "WEIRD" })).toBeNull();
    expect(toMyPostItem({ id: "a", question: "q", status: "DELETED" })).toBeNull();
  });
});

describe("toMyPage", () => {
  it("쓸 수 없는 항목을 빼고, totalCount 가 없으면 항목 수로 대신한다", () => {
    const page = toMyPage(
      { items: [{ id: "a", question: "q", myChoice: { content: "x" } }, {}] },
      toMyVoteItem,
    );
    expect(page.items).toHaveLength(1);
    expect(page.totalCount).toBe(1);
    expect(page.nextCursor).toBeNull();
  });

  it("서버가 준 totalCount 를 우선한다", () => {
    expect(toMyPage({ items: [], totalCount: 7 }, toMyVoteItem).totalCount).toBe(7);
  });
});
