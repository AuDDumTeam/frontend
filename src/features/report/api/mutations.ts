import { useMutation, useQueryClient } from "@tanstack/react-query";

import { meKey } from "@/features/auth";
import { submitReport } from "@/shared/api/generated/auddum";
import { getErrorMessage, hasErrorCode } from "@/shared/lib/error-messages";
import { MESSAGES } from "@/shared/lib/messages";
import { toast } from "@/shared/ui/toast/toast-store";

import { toReportRequest, type ReportReason } from "../model/reasons";

/** 신고 접수. 성공하면 토스트, 이미 신고했거나 정지된 계정이면 해당 문구를 보여준다. */
export function useSubmitReport(pollId: string, onDone: () => void) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (draft: { reason: ReportReason; detail: string }) =>
      submitReport(pollId, toReportRequest(draft)),
    onSuccess: () => {
      toast(MESSAGES.report.sent);
      onDone();
    },
    onError: (error) => {
      toast(getErrorMessage(error, "report"));
      if (hasErrorCode(error, "MEMBER_SUSPENDED")) {
        void queryClient.invalidateQueries({ queryKey: meKey });
      }
      // 이미 신고한 고민이면 다시 시도할 일이 없으므로 시트를 닫는다.
      if (hasErrorCode(error, "REPORT_ALREADY_SUBMITTED")) onDone();
    },
  });
  return { submit: mutation.mutate, isPending: mutation.isPending };
}
