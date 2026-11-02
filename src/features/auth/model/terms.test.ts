import { describe, expect, it } from "vitest";

import { canJoin, emptyTermsChecks } from "./terms";

describe("canJoin", () => {
  it("아무것도 체크하지 않으면 가입할 수 없다", () => {
    expect(canJoin(emptyTermsChecks())).toBe(false);
  });

  it("하나만 체크해도 가입할 수 없다", () => {
    expect(canJoin({ service: true, privacy: false })).toBe(false);
    expect(canJoin({ service: false, privacy: true })).toBe(false);
  });

  it("둘 다 체크하면 가입할 수 있다", () => {
    expect(canJoin({ service: true, privacy: true })).toBe(true);
  });
});
