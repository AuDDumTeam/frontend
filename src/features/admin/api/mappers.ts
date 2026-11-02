import { toPollStatus, toDate } from "@/features/poll";
import { toReportReason } from "@/features/report";
import type { AdminReportSummaryResponse } from "@/shared/api/generated/model";

import type { ReportDetailDto } from "./contract";
import type { PollState, ReportDetail, ReportRow, ReportStatus } from "../model/report";

const STATUSES: readonly ReportStatus[] = ["PENDING", "RESOLVED", "DISMISSED"];

/** 모르는 신고 상태는 거른다. 대기로 잘못 보면 이미 처리된 신고를 또 처리하려 하게 된다. */
const toReportStatus = (value: unknown): ReportStatus | null =>
  STATUSES.find((s) => s === value) ?? null;

/** 대상 고민의 상태. 모르면 공개로 두되 조치 문구에는 쓰이지 않는다. */
const toPollState = (value: string | undefined): PollState =>
  toPollStatus(value) ?? "PUBLIC";

type Common = {
  id?: number;
  reason?: string;
  status?: string;
  poll?: { id?: string; question?: string; status?: string };
};

function toRow(dto: Common): ReportRow | null {
  const status = toReportStatus(dto.status);
  if (typeof dto.id !== "number" || !status || !dto.poll?.question) return null;
  return {
    id: dto.id,
    reason: toReportReason(dto.reason),
    status,
    pollState: toPollState(dto.poll.status),
    question: dto.poll.question,
  };
}

export const toReportRow = (dto: AdminReportSummaryResponse): ReportRow | null =>
  toRow(dto);

export function toReportDetail(dto: ReportDetailDto): ReportDetail | null {
  const row = toRow(dto);
  if (!row || !dto.poll?.id) return null;
  return {
    ...row,
    pollId: dto.poll.id,
    detail: dto.detail?.trim() ? dto.detail.trim() : null,
    handledAt: toDate(dto.handledAt),
    authorId: typeof dto.poll.authorId === "number" ? dto.poll.authorId : null,
  };
}
