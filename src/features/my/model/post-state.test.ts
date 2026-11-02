import { describe, expect, it } from "vitest";

import { pickPostState } from "./post-state";

describe("pickPostState", () => {
  it("공개되어 진행 중이면 공개", () => {
    expect(pickPostState({ status: "PUBLIC", closed: false })).toBe("public");
  });

  it("마감되었으면 마감", () => {
    expect(pickPostState({ status: "PUBLIC", closed: true })).toBe("closed");
  });

  it("숨김은 마감보다 우선한다", () => {
    expect(pickPostState({ status: "HIDDEN", closed: true })).toBe("hidden");
  });
});
