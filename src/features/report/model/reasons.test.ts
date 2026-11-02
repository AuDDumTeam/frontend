import { describe, expect, it } from "vitest";

import { checkReport, reasonLabel, toReportReason, toReportRequest } from "./reasons";

describe("checkReport", () => {
  it("사유를 고르지 않으면 막는다", () => {
    expect(checkReport({ reason: null, detail: "" })).toBe("pick-reason");
  });

  it("기타는 내용이 있어야 한다", () => {
    expect(checkReport({ reason: "ETC", detail: "  " })).toBe("need-detail");
    expect(checkReport({ reason: "ETC", detail: "광고예요" })).toBeNull();
  });

  it("기타가 아니면 내용 없이 통과한다", () => {
    expect(checkReport({ reason: "SPAM", detail: "" })).toBeNull();
  });
});

describe("toReportRequest", () => {
  it("기타만 내용을 보내고, 앞뒤 공백을 지운다", () => {
    expect(toReportRequest({ reason: "ETC", detail: " 광고 " })).toEqual({
      reason: "ETC",
      detail: "광고",
    });
  });

  it("다른 사유는 남아 있는 내용을 보내지 않는다", () => {
    expect(toReportRequest({ reason: "SPAM", detail: "예전에 쓴 글" })).toEqual({
      reason: "SPAM",
    });
  });
});

describe("toReportReason / reasonLabel", () => {
  it("모르는 사유는 기타", () => {
    expect(toReportReason("NEW")).toBe("ETC");
    expect(reasonLabel(toReportReason("SPAM"))).toBe("광고·도배");
  });
});
