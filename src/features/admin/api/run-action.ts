import {
  dismissReport,
  suspendMember,
  takedownPoll,
} from "@/shared/api/generated/auddum";

import type { ActionKind } from "../model/report";

export type RunActionInput = {
  kind: ActionKind;
  reason: string;
  /** 작성자도 정지할 때의 회원 id. 정지하지 않으면 null */
  banAuthorId: number | null;
};

/**
 * 신고 조치(기각·숨김·삭제) 뒤에 필요하면 작성자를 정지한다.
 * - 조치가 실패하면 그대로 던진다. (정지는 시도하지 않는다)
 * - 조치는 끝났는데 정지만 실패하면 던지지 않고 banFailed 로 알린다.
 *   이미 반영된 조치를 되돌릴 수 없으므로, 호출한 쪽이 "정지는 실패했다"고 알려야 한다.
 */
export async function runReportAction(
  report: { id: number; pollId: string },
  { kind, reason, banAuthorId }: RunActionInput,
): Promise<{ banFailed: boolean }> {
  if (kind === "dismiss") {
    await dismissReport(report.id, { reason });
  } else {
    await takedownPoll(report.pollId, {
      status: kind === "hide" ? "HIDDEN" : "DELETED",
      reason,
    });
  }

  if (banAuthorId === null) return { banFailed: false };
  try {
    await suspendMember(banAuthorId, { reason });
    return { banFailed: false };
  } catch {
    return { banFailed: true };
  }
}
