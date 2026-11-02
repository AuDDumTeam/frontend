import { describe, expect, it } from "vitest";

import { formatHandledAt, historyLine, isPending, statusLabel } from "./status";

describe("statusLabel", () => {
  it("대기·기각은 신고 상태로 정한다", () => {
    expect(statusLabel({ status: "PENDING", pollState: "PUBLIC" })).toBe("대기");
    expect(statusLabel({ status: "DISMISSED", pollState: "PUBLIC" })).toBe("기각");
  });

  it("처리 완료는 대상 고민의 상태로 숨김·삭제를 가른다", () => {
    expect(statusLabel({ status: "RESOLVED", pollState: "HIDDEN" })).toBe("숨김 처리");
    expect(statusLabel({ status: "RESOLVED", pollState: "DELETED" })).toBe("삭제 처리");
    expect(statusLabel({ status: "RESOLVED", pollState: "PUBLIC" })).toBe("처리 완료");
  });

  it("대기 상태만 조치할 수 있다", () => {
    expect(isPending({ status: "PENDING" })).toBe(true);
    expect(isPending({ status: "RESOLVED" })).toBe(false);
  });
});

describe("formatHandledAt", () => {
  const now = new Date("2026-11-02T12:00:00+09:00");
  const ago = (ms: number) => new Date(now.getTime() - ms);

  it("처리 전이면 null", () => {
    expect(formatHandledAt(null, now)).toBeNull();
  });

  it("1분 안은 방금, 1시간 안은 분, 하루 안은 시간, 그 뒤는 날짜", () => {
    expect(formatHandledAt(ago(30_000), now)).toBe("방금");
    expect(formatHandledAt(ago(5 * 60_000), now)).toBe("5분 전");
    expect(formatHandledAt(ago(3 * 3_600_000), now)).toBe("3시간 전");
    expect(formatHandledAt(new Date("2026-10-20T09:00:00+09:00"), now)).toBe("10월 20일");
  });
});

describe("historyLine", () => {
  const now = new Date("2026-11-02T12:00:00+09:00");

  it("처리 내용 · 처리자 · 시각 순서로 잇는다", () => {
    expect(
      historyLine(
        { status: "DISMISSED", pollState: "PUBLIC", handledAt: new Date(now) },
        now,
      ),
    ).toBe("기각 · 투표 유지 · 처리자 관리자 · 방금");
  });

  it("시각을 모르면 뺀다", () => {
    expect(
      historyLine({ status: "RESOLVED", pollState: "HIDDEN", handledAt: null }, now),
    ).toBe("숨김 처리 · 처리자 관리자");
  });
});
