import { delay, http, HttpResponse } from "msw";

import type { MockPoll, MockReport, MockState } from "./db";
import type { MockRole } from "./handlers";

const error = (status: number, code: string, message: string) =>
  HttpResponse.json({ code, message }, { status });

const ADMIN_ID = 1;

/**
 * 관리자 API 목. 백엔드(openapi.json)의 신고 검토 규칙을 흉내 낸다.
 *   - 비로그인 401, 관리자가 아니면 403
 *   - 조치(기각·숨김·삭제)는 사유가 필수이고, 같은 고민의 대기 신고를 함께 종료한다
 *   - 이미 처리된 신고는 409
 */
export function createAdminHandlers(
  state: MockState,
  getRole: () => MockRole,
  latencyMs: number,
) {
  const guard = () => {
    const role = getRole();
    if (role === "guest") return error(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
    if (role !== "admin") return error(403, "FORBIDDEN", "권한이 없습니다.");
    return null;
  };

  const pollOf = (report: MockReport) => state.polls.find((p) => p.id === report.pollId);
  const pollInfo = (poll: MockPoll | undefined, withAuthor = false) => ({
    id: poll?.id,
    question: poll?.question,
    status: poll?.status ?? "PUBLIC",
    ...(withAuthor ? { authorId: poll?.authorId } : {}),
  });
  const reportCount = (pollId: string) =>
    state.reports.filter((r) => r.pollId === pollId).length;

  const reasonOf = async (request: Request) => {
    const body = (await request.json().catch(() => null)) as { reason?: string } | null;
    const reason = body?.reason?.trim();
    return reason && reason.length <= 200 ? reason : null;
  };

  /** 같은 고민의 대기 신고를 모두 종료하고 이력을 남긴다. */
  const close = (
    pollId: string,
    status: "RESOLVED" | "DISMISSED",
    actionType: string,
    reason: string,
  ) => {
    for (const report of state.reports) {
      if (report.pollId !== pollId || report.status !== "PENDING") continue;
      report.status = status;
      report.handledAt = new Date().toISOString();
      report.handledBy = ADMIN_ID;
      report.actions.push({
        id: report.actions.length + 1,
        actionType,
        adminId: ADMIN_ID,
        createdAt: new Date().toISOString(),
        reason,
      });
    }
  };

  return [
    http.get("/api/v1/admin/reports", async ({ request }) => {
      await delay(latencyMs);
      const denied = guard();
      if (denied) return denied;

      const url = new URL(request.url);
      const status = url.searchParams.get("status") ?? "PENDING";
      const size = Math.min(Math.max(Number(url.searchParams.get("size")) || 20, 1), 50);
      const offset = Number(url.searchParams.get("cursor")) || 0;
      const all = state.reports.filter((r) => r.status === status);
      const next = offset + size;
      return HttpResponse.json({
        items: all.slice(offset, next).map((r) => ({
          id: r.id,
          createdAt: r.createdAt,
          poll: pollInfo(pollOf(r)),
          pollReportCount: reportCount(r.pollId),
          reason: r.reason,
          status: r.status,
        })),
        nextCursor: next < all.length ? String(next) : null,
      });
    }),

    http.get("/api/v1/admin/reports/:reportId", async ({ params }) => {
      await delay(latencyMs);
      const denied = guard();
      if (denied) return denied;
      const report = state.reports.find((r) => String(r.id) === params.reportId);
      if (!report) return error(404, "REPORT_NOT_FOUND", "존재하지 않는 신고입니다.");
      return HttpResponse.json({
        id: report.id,
        createdAt: report.createdAt,
        detail: report.detail,
        handledAt: report.handledAt,
        handledBy: report.handledBy,
        reason: report.reason,
        status: report.status,
        poll: pollInfo(pollOf(report), true),
        actions: report.actions,
        otherReports: state.reports
          .filter((r) => r.pollId === report.pollId && r.id !== report.id)
          .map(({ id, createdAt, detail, reason, status }) => ({
            id,
            createdAt,
            detail,
            reason,
            status,
          })),
      });
    }),

    http.post("/api/v1/admin/reports/:reportId/dismiss", async ({ params, request }) => {
      await delay(latencyMs);
      const denied = guard();
      if (denied) return denied;
      const reason = await reasonOf(request);
      if (!reason) return error(400, "VALIDATION_FAILED", "요청 값이 올바르지 않습니다.");
      const report = state.reports.find((r) => String(r.id) === params.reportId);
      if (!report) return error(404, "REPORT_NOT_FOUND", "존재하지 않는 신고입니다.");
      if (report.status !== "PENDING") {
        return error(409, "REPORT_ALREADY_HANDLED", "이미 처리된 신고입니다.");
      }
      close(report.pollId, "DISMISSED", "DISMISS", reason);
      return new HttpResponse(null, { status: 204 });
    }),

    http.patch("/api/v1/admin/polls/:pollId/status", async ({ params, request }) => {
      await delay(latencyMs);
      const denied = guard();
      if (denied) return denied;
      const body = (await request.json().catch(() => null)) as {
        status?: string;
        reason?: string;
      } | null;
      const reason = body?.reason?.trim();
      if (
        !reason ||
        reason.length > 200 ||
        (body?.status !== "HIDDEN" && body?.status !== "DELETED")
      ) {
        return error(400, "VALIDATION_FAILED", "요청 값이 올바르지 않습니다.");
      }
      const poll = state.polls.find((p) => p.id === params.pollId);
      if (!poll || poll.status === "DELETED") {
        return error(404, "POLL_NOT_FOUND", "존재하지 않는 투표입니다.");
      }
      if (body.status === "HIDDEN" && (poll.status ?? "PUBLIC") !== "PUBLIC") {
        return error(409, "POLL_NOT_PUBLIC", "공개 상태의 투표가 아닙니다.");
      }
      poll.status = body.status;
      close(poll.id, "RESOLVED", body.status === "HIDDEN" ? "HIDE" : "DELETE", reason);
      return new HttpResponse(null, { status: 204 });
    }),

    http.post("/api/v1/admin/members/:memberId/suspend", async ({ params, request }) => {
      await delay(latencyMs);
      const denied = guard();
      if (denied) return denied;
      if (!(await reasonOf(request))) {
        return error(400, "VALIDATION_FAILED", "요청 값이 올바르지 않습니다.");
      }
      const memberId = Number(params.memberId);
      if (state.suspendedAuthors.includes(memberId)) {
        return error(409, "MEMBER_NOT_ACTIVE", "정상 상태의 회원이 아닙니다.");
      }
      state.suspendedAuthors.push(memberId);
      return new HttpResponse(null, { status: 204 });
    }),
  ];
}
