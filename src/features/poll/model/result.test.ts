import { describe, expect, it } from "vitest";

import { buildResultRows, percentOf } from "./result";

describe("percentOf", () => {
  it("반올림한다", () => {
    expect(percentOf(1, 3)).toBe(33);
    expect(percentOf(2, 3)).toBe(67);
    expect(percentOf(1, 8)).toBe(13); // 12.5 → 13
  });

  it("합이 100이 아니어도 그대로 둔다 (README 허용)", () => {
    const sum = [1, 1, 1].map((c) => percentOf(c, 3)).reduce((a, b) => a + b, 0);
    expect(sum).toBe(99);
  });

  it("전체가 0이면 0%", () => {
    expect(percentOf(0, 0)).toBe(0);
  });
});

describe("buildResultRows", () => {
  const options = [
    { position: 1, content: "A" },
    { position: 2, content: "B" },
    { position: 3, content: "C" },
  ];

  it("결과가 없으면 null (미참여·진행 중에는 퍼센트를 만들지 않는다)", () => {
    expect(buildResultRows({ options, result: null, myChoice: null })).toBeNull();
  });

  it("선택지 순서를 유지하고 내 선택을 표시한다", () => {
    const rows = buildResultRows({
      options,
      result: { total: 10, counts: { 1: 2, 2: 5, 3: 3 } },
      myChoice: 2,
    });

    expect(rows?.map((r) => [r.content, r.percent, r.isMine])).toEqual([
      ["A", 20, false],
      ["B", 50, true],
      ["C", 30, false],
    ]);
  });

  it("득표가 없는 선택지는 0으로 본다", () => {
    const rows = buildResultRows({
      options,
      result: { total: 4, counts: { 1: 4 } },
      myChoice: 1,
    });
    expect(rows?.map((r) => r.count)).toEqual([4, 0, 0]);
  });
});
