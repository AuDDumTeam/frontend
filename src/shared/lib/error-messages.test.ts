import { describe, expect, it } from "vitest";

import { ApiError, NetworkError } from "@/shared/api/fetcher";

import { getErrorMessage, hasErrorCode } from "./error-messages";
import { FALLBACK_MESSAGES } from "./messages";

const apiError = (code: string, message = "서버 메시지") =>
  new ApiError(409, code, message);

describe("getErrorMessage", () => {
  it("같은 코드도 동작에 따라 다른 문구를 준다", () => {
    const suspended = apiError("MEMBER_SUSPENDED");
    expect(getErrorMessage(suspended, "vote")).toBe(
      "이용이 정지된 계정이라 참여할 수 없어요",
    );
    expect(getErrorMessage(suspended, "write")).toBe(
      "이용이 정지된 계정이라 올릴 수 없어요",
    );
    expect(getErrorMessage(suspended, "report")).toBe(
      "이용이 정지된 계정은 신고할 수 없어요",
    );
  });

  it("README 문구에는 서버 코드가 섞이지 않는다", () => {
    const messages = [
      getErrorMessage(apiError("POLL_CLOSED"), "vote"),
      getErrorMessage(apiError("POLL_RATE_LIMITED"), "write"),
      getErrorMessage(apiError("DUPLICATE_POLL"), "write"),
      getErrorMessage(apiError("REPORT_ALREADY_SUBMITTED"), "report"),
    ];
    for (const m of messages) expect(m).not.toMatch(/[A-Z_]{5,}|\(\d{3}\)/);
  });

  it("README 에 없는 코드는 서버 메시지를 그대로 쓴다", () => {
    expect(
      getErrorMessage(apiError("ALREADY_VOTED", "이미 참여한 투표입니다."), "vote"),
    ).toBe("이미 참여한 투표입니다.");
  });

  it("서버 메시지도 없으면 공통 문구", () => {
    expect(getErrorMessage(apiError("UNKNOWN", ""), "vote")).toBe(
      FALLBACK_MESSAGES.generic,
    );
  });

  it("서버에 닿지 못한 경우만 네트워크 문구", () => {
    expect(
      getErrorMessage(new NetworkError(new TypeError("Failed to fetch")), "vote"),
    ).toBe(FALLBACK_MESSAGES.network);
  });

  it("코드 버그로 난 TypeError 는 네트워크 문제로 안내하지 않는다", () => {
    expect(getErrorMessage(new TypeError("x is undefined"), "vote")).toBe(
      FALLBACK_MESSAGES.generic,
    );
  });
});

describe("hasErrorCode", () => {
  it("ApiError 의 code 만 비교한다", () => {
    expect(hasErrorCode(apiError("POLL_CLOSED"), "POLL_CLOSED", "ALREADY_VOTED")).toBe(
      true,
    );
    expect(hasErrorCode(apiError("POLL_CLOSED"), "ALREADY_VOTED")).toBe(false);
    expect(hasErrorCode(new Error("POLL_CLOSED"), "POLL_CLOSED")).toBe(false);
  });
});
