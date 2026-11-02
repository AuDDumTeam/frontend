import { ApiError, NetworkError } from "@/shared/api/fetcher";

import { FALLBACK_MESSAGES, MESSAGES } from "./messages";

/** 같은 서버 코드라도 어떤 동작에서 났는지에 따라 문구가 다르다. (예: MEMBER_SUSPENDED) */
export type ErrorContext = "read" | "vote" | "write" | "delete" | "report";

const BY_CONTEXT: Record<ErrorContext, Partial<Record<string, string>>> = {
  read: {},
  vote: {
    MEMBER_SUSPENDED: MESSAGES.vote.suspended,
    POLL_CLOSED: MESSAGES.vote.closed,
  },
  write: {
    MEMBER_SUSPENDED: MESSAGES.write.suspended,
    POLL_RATE_LIMITED: MESSAGES.write.rateLimited,
    DUPLICATE_POLL: MESSAGES.write.duplicate,
  },
  delete: {
    MEMBER_SUSPENDED: MESSAGES.account.suspended,
  },
  report: {
    MEMBER_SUSPENDED: MESSAGES.report.suspended,
    REPORT_ALREADY_SUBMITTED: MESSAGES.report.alreadyReported,
  },
};

/**
 * 서버 오류를 사용자 문구로 바꾼다. 화면에 코드(POLL_CLOSED 등)를 노출하지 않는다.
 * 순서: README 문구 → 서버가 내려준 메시지(사용자에게 그대로 보여도 되는 문장) → 공통 문구
 */
export function getErrorMessage(error: unknown, context: ErrorContext): string {
  if (error instanceof ApiError) {
    return (
      BY_CONTEXT[context][error.code] ?? (error.message || FALLBACK_MESSAGES.generic)
    );
  }
  // 서버에 닿지 못한 경우만 네트워크 문구. 코드 버그(TypeError 등)는 공통 문구로 둔다.
  if (error instanceof NetworkError) return FALLBACK_MESSAGES.network;
  return FALLBACK_MESSAGES.generic;
}

export const hasErrorCode = (error: unknown, ...codes: string[]): boolean =>
  error instanceof ApiError && codes.includes(error.code);
