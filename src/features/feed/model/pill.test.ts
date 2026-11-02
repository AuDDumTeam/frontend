import { describe, expect, it } from "vitest";

import { pickPillState } from "./pill";

const now = new Date("2026-11-02T12:00:00Z");
const in30min = new Date(now.getTime() + 30 * 60_000);

describe("pickPillState", () => {
  it("아무 것도 해당하지 않으면 pill 이 없다", () => {
    expect(
      pickPillState({ closed: false, joined: false, closesAt: null }, now),
    ).toBeNull();
  });

  it("마감 > 참여 완료 > 마감임박 순으로 하나만 고른다", () => {
    const all = { closed: true, joined: true, closesAt: in30min };
    expect(pickPillState(all, now)).toEqual({ tone: "closed", label: "마감" });

    expect(pickPillState({ ...all, closed: false }, now)).toEqual({
      tone: "joined",
      label: "참여 완료",
    });

    expect(pickPillState({ ...all, closed: false, joined: false }, now)).toEqual({
      tone: "soon",
      label: "곧 마감",
    });
  });

  it("마감까지 1시간을 넘으면 임박이 아니다", () => {
    const later = new Date(now.getTime() + 2 * 60 * 60_000);
    expect(
      pickPillState({ closed: false, joined: false, closesAt: later }, now),
    ).toBeNull();
  });
});
