import { describe, expect, it } from "vitest";

import { parseBody } from "./fetcher";

describe("parseBody", () => {
  it("JSON 응답은 객체로 읽는다", () => {
    expect(parseBody('{"code":"X"}', "application/json")).toEqual({ code: "X" });
  });

  it("JSON 이 아닌 응답은 숫자처럼 보여도 문자열로 둔다", () => {
    expect(parseBody("12345678", "text/plain")).toBe("12345678");
    expect(parseBody("aB3dE5fG7hJk", "text/plain;charset=UTF-8")).toBe("aB3dE5fG7hJk");
  });

  it("빈 본문은 undefined", () => {
    expect(parseBody("", "application/json")).toBeUndefined();
  });

  it("JSON 이라 했지만 깨진 본문, HTML 오류 본문은 원문을 돌려준다", () => {
    expect(parseBody("<html>", "application/json")).toBe("<html>");
    expect(parseBody("<html>502</html>", "text/html")).toBe("<html>502</html>");
  });
});
