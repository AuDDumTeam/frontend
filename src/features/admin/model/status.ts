import { ADMIN_COPY } from "../copy";
import type { ReportRow } from "./report";

type StatusKey = keyof typeof ADMIN_COPY.status;

/** 처리된 신고가 어떤 조치였는지. 기각은 신고 상태로, 숨김·삭제는 대상 고민의 상태로 안다. */
export function statusKey(report: Pick<ReportRow, "status" | "pollState">): StatusKey {
  if (report.status === "PENDING") return "pending";
  if (report.status === "DISMISSED") return "dismissed";
  if (report.pollState === "HIDDEN") return "hidden";
  if (report.pollState === "DELETED") return "deleted";
  return "resolved";
}

export const statusLabel = (report: Pick<ReportRow, "status" | "pollState">): string =>
  ADMIN_COPY.status[statusKey(report)];

export const isPending = (report: Pick<ReportRow, "status">): boolean =>
  report.status === "PENDING";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

/** 처리 시각: 1분 안이면 "방금", 하루 안이면 "N분 전/N시간 전", 그 뒤는 날짜. */
export function formatHandledAt(handledAt: Date | null, now: Date): string | null {
  if (!handledAt) return null;
  const diff = now.getTime() - handledAt.getTime();
  if (diff < MINUTE) return "방금";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}분 전`;
  if (diff < 24 * HOUR) return `${Math.floor(diff / HOUR)}시간 전`;
  return `${handledAt.getMonth() + 1}월 ${handledAt.getDate()}일`;
}

/** "이미 처리된 신고예요." 뒤에 붙는 문장: 처리 내용 · 처리자 · 시각 */
export function historyLine(
  report: Pick<ReportRow, "status" | "pollState"> & { handledAt: Date | null },
  now: Date,
): string {
  const key = statusKey(report);
  const what = key === "pending" ? ADMIN_COPY.history.resolved : ADMIN_COPY.history[key];
  return [what, ADMIN_COPY.history.handler, formatHandledAt(report.handledAt, now)]
    .filter(Boolean)
    .join(" · ");
}
