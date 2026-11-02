import { describe, expect, it } from "vitest";

import { toCreatedPollId } from "./mappers";

describe("toCreatedPollId", () => {
  it("공개 ID 문자열을 그대로 돌려준다", () => {
    expect(toCreatedPollId("aB3dE5fG7hJk")).toBe("aB3dE5fG7hJk");
  });

  it("따옴표나 공백이 붙어 있어도 벗겨낸다", () => {
    expect(toCreatedPollId(' "aB3dE5fG7hJk"\n')).toBe("aB3dE5fG7hJk");
  });

  it.each([undefined, null, 12, {}, "", "a/b", "../x"])("%j 는 null", (value) => {
    expect(toCreatedPollId(value)).toBeNull();
  });
});
