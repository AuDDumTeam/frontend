import type { ReportReason } from "@/features/report";

export type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";
export type PollState = "PUBLIC" | "HIDDEN" | "DELETED";

/** 신고 목록 한 줄 */
export type ReportRow = {
  id: number;
  reason: ReportReason;
  status: ReportStatus;
  /** 대상 고민이 숨김·삭제된 뒤의 상태. 조치 내용을 보여주는 데 쓴다 */
  pollState: PollState;
  question: string;
};

/** 신고 상세 */
export type ReportDetail = ReportRow & {
  /** 기타 사유일 때 신고자가 적은 내용 */
  detail: string | null;
  handledAt: Date | null;
  /** 작성자 이용 정지에 쓰는 id. 백엔드가 내려줄 때만 있고, 없으면 정지 체크박스를 숨긴다 */
  authorId: number | null;
  pollId: string;
};

export type ActionKind = "dismiss" | "hide" | "delete";
