import { describe, expect, it } from "vitest";

// 테스트 환경 동작 확인용. 실제 비즈니스 규칙 테스트는 각 feature 의 model/ 에 둔다.
describe("test setup", () => {
  it("vitest 가 실행된다", () => {
    expect(1 + 1).toBe(2);
  });
});
