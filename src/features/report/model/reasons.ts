export const REPORT_REASONS = [
  { value: "ABUSE_HATE", label: "욕설·혐오 표현" },
  { value: "SEXUAL_HARASSMENT", label: "성희롱" },
  { value: "PERSONAL_INFO", label: "개인정보 노출" },
  { value: "SPAM", label: "광고·도배" },
  { value: "ETC", label: "기타" },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]["value"];

export const ETC_DETAIL_MAX = 100;

/** 서버가 새 사유를 추가해도 화면이 깨지지 않게, 모르는 값은 기타로 본다. */
export const toReportReason = (value: unknown): ReportReason =>
  REPORT_REASONS.find((r) => r.value === value)?.value ?? "ETC";

export const reasonLabel = (reason: ReportReason): string =>
  REPORT_REASONS.find((r) => r.value === reason)?.label ?? "기타";

export type ReportDraft = { reason: ReportReason | null; detail: string };

export type ReportCheck = "pick-reason" | "need-detail" | null;

/** 제출 전 확인. 사유를 안 골랐거나, 기타인데 내용이 비어 있으면 막는다. */
export function checkReport(draft: ReportDraft): ReportCheck {
  if (draft.reason === null) return "pick-reason";
  if (draft.reason === "ETC" && draft.detail.trim() === "") return "need-detail";
  return null;
}

/** 기타가 아닐 때는 내용을 보내지 않는다. (입력해 둔 기타 내용이 남아 가지 않게) */
export function toReportRequest(draft: ReportDraft & { reason: ReportReason }) {
  return draft.reason === "ETC"
    ? { reason: draft.reason, detail: draft.detail.trim() }
    : { reason: draft.reason };
}
