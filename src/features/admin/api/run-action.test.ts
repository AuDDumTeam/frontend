import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  dismissReport: vi.fn(),
  takedownPoll: vi.fn(),
  suspendMember: vi.fn(),
}));
vi.mock("@/shared/api/generated/auddum", () => api);

import { runReportAction } from "./run-action";

const report = { id: 7, pollId: "abc" };

beforeEach(() => {
  for (const fn of Object.values(api)) fn.mockReset().mockResolvedValue({});
});

describe("runReportAction", () => {
  it("기각은 신고 기각 API 만 부른다", async () => {
    await expect(
      runReportAction(report, {
        kind: "dismiss",
        reason: "문제 없음",
        banAuthorId: null,
      }),
    ).resolves.toEqual({ banFailed: false });
    expect(api.dismissReport).toHaveBeenCalledWith(7, { reason: "문제 없음" });
    expect(api.takedownPoll).not.toHaveBeenCalled();
  });

  it("숨김·삭제는 고민 상태를 바꾸는 API 를 부른다", async () => {
    await runReportAction(report, { kind: "hide", reason: "r", banAuthorId: null });
    await runReportAction(report, { kind: "delete", reason: "r", banAuthorId: null });
    expect(api.takedownPoll).toHaveBeenNthCalledWith(1, "abc", {
      status: "HIDDEN",
      reason: "r",
    });
    expect(api.takedownPoll).toHaveBeenNthCalledWith(2, "abc", {
      status: "DELETED",
      reason: "r",
    });
  });

  it("조치 뒤에 작성자를 정지한다", async () => {
    await runReportAction(report, { kind: "hide", reason: "r", banAuthorId: 9 });
    expect(api.suspendMember).toHaveBeenCalledWith(9, { reason: "r" });
  });

  it("조치가 실패하면 던지고 정지는 시도하지 않는다", async () => {
    api.takedownPoll.mockRejectedValue(new Error("409"));
    await expect(
      runReportAction(report, { kind: "hide", reason: "r", banAuthorId: 9 }),
    ).rejects.toThrow("409");
    expect(api.suspendMember).not.toHaveBeenCalled();
  });

  it("정지만 실패하면 던지지 않고 banFailed 로 알린다", async () => {
    api.suspendMember.mockRejectedValue(new Error("409"));
    await expect(
      runReportAction(report, { kind: "delete", reason: "r", banAuthorId: 9 }),
    ).resolves.toEqual({ banFailed: true });
  });
});
