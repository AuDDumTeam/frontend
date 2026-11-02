import { describe, expect, it } from "vitest";

import { toCategory, toDate } from "./parse";

describe("toCategory", () => {
  it("알려진 카테고리는 그대로, 모르는 값은 기타", () => {
    expect(toCategory("BREAKUP")).toBe("BREAKUP");
    expect(toCategory("NEW_ONE")).toBe("ETC");
    expect(toCategory(undefined)).toBe("ETC");
  });
});

describe("toDate", () => {
  it("올바른 날짜를 Date 로 바꾼다", () => {
    expect(toDate("2026-11-02T12:00:00Z")?.toISOString()).toBe(
      "2026-11-02T12:00:00.000Z",
    );
  });

  it("없거나 잘못된 날짜는 null", () => {
    expect(toDate(null)).toBeNull();
    expect(toDate(undefined)).toBeNull();
    expect(toDate("not-a-date")).toBeNull();
  });
});
