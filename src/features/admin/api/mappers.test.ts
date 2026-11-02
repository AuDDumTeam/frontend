import { describe, expect, it } from "vitest";

import { toReportDetail, toReportRow } from "./mappers";

const summary = {
  id: 7,
  reason: "SPAM",
  status: "PENDING",
  poll: { id: "abc", question: "q", status: "PUBLIC" },
} as const;

describe("toReportRow", () => {
  it("신고 한 줄로 바꾼다", () => {
    expect(toReportRow(summary)).toEqual({
      id: 7,
      reason: "SPAM",
      status: "PENDING",
      pollState: "PUBLIC",
      question: "q",
    });
  });

  it("모르는 사유는 기타로 보정한다", () => {
    expect(toReportRow({ ...summary, reason: "NEW" as never })?.reason).toBe("ETC");
  });

  it("id·상태·대상 고민이 없거나 모르는 상태면 거른다", () => {
    expect(toReportRow({ ...summary, id: undefined })).toBeNull();
    expect(toReportRow({ ...summary, status: "WEIRD" as never })).toBeNull();
    expect(toReportRow({ ...summary, poll: undefined })).toBeNull();
  });
});

describe("toReportDetail", () => {
  it("작성자 id 가 있으면 담고, 없으면 null", () => {
    const withAuthor = toReportDetail({
      ...summary,
      poll: { ...summary.poll, authorId: 9 },
    });
    expect(withAuthor?.authorId).toBe(9);
    expect(toReportDetail(summary)?.authorId).toBeNull();
  });

  it("비어 있는 내용은 null, 처리 시각은 날짜로", () => {
    const detail = toReportDetail({
      ...summary,
      detail: "  ",
      handledAt: "2026-11-02T12:00:00+09:00",
    });
    expect(detail?.detail).toBeNull();
    expect(detail?.handledAt).toBeInstanceOf(Date);
  });

  it("대상 고민의 공개 id 가 없으면 거른다", () => {
    expect(toReportDetail({ ...summary, poll: { question: "q" } })).toBeNull();
  });
});
