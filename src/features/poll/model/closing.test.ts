import { describe, expect, it } from "vitest";

import { formatRemaining, isClosingSoon } from "./closing";

const now = new Date("2026-11-02T12:00:00Z");
const after = (ms: number) => new Date(now.getTime() + ms);
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe("isClosingSoon", () => {
  it("마감이 없으면 임박이 아니다", () => {
    expect(isClosingSoon(null, now)).toBe(false);
  });

  it("1시간 이내만 임박이다", () => {
    expect(isClosingSoon(after(30 * MIN), now)).toBe(true);
    expect(isClosingSoon(after(HOUR), now)).toBe(true);
    expect(isClosingSoon(after(HOUR + 1), now)).toBe(false);
  });

  it("이미 지났으면 임박이 아니다 (마감 여부는 서버가 판단)", () => {
    expect(isClosingSoon(after(-1), now)).toBe(false);
  });
});

describe("formatRemaining", () => {
  it("마감이 없거나 지났으면 null", () => {
    expect(formatRemaining(null, now)).toBeNull();
    expect(formatRemaining(after(-MIN), now)).toBeNull();
  });

  it("1시간 이내는 '곧 마감'", () => {
    expect(formatRemaining(after(59 * MIN), now)).toBe("곧 마감");
  });

  it("24시간 미만은 시간 단위", () => {
    expect(formatRemaining(after(2 * HOUR + 30 * MIN), now)).toBe("2시간 남음");
    expect(formatRemaining(after(DAY - MIN), now)).toBe("23시간 남음");
  });

  it("그 이상은 일 단위", () => {
    expect(formatRemaining(after(DAY), now)).toBe("1일 남음");
    expect(formatRemaining(after(3 * DAY - HOUR), now)).toBe("2일 남음");
  });
});
