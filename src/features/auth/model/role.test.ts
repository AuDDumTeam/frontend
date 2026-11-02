import { describe, expect, it } from "vitest";

import { deriveRole } from "./role";

describe("deriveRole", () => {
  it("내 정보가 없으면 비회원", () => {
    expect(deriveRole(null)).toBe("guest");
    expect(deriveRole(undefined)).toBe("guest");
  });

  it("회원과 관리자", () => {
    expect(deriveRole({ role: "MEMBER", status: "ACTIVE" })).toBe("member");
    expect(deriveRole({ role: "ADMIN", status: "ACTIVE" })).toBe("admin");
  });

  it("정지는 관리자보다 우선한다", () => {
    expect(deriveRole({ role: "MEMBER", status: "SUSPENDED" })).toBe("suspended");
    expect(deriveRole({ role: "ADMIN", status: "SUSPENDED" })).toBe("suspended");
  });

  it("탈퇴한 계정은 비회원으로 본다", () => {
    expect(deriveRole({ role: "MEMBER", status: "WITHDRAWN" })).toBe("guest");
  });
});
