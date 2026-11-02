import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getReport, getReports } from "@/shared/api/generated/auddum";
import { FEED_KEY_PREFIX, MY_KEY_PREFIX, POLL_KEY_PREFIX } from "@/shared/api/query-keys";
import { getErrorMessage } from "@/shared/lib/error-messages";
import { MESSAGES } from "@/shared/lib/messages";
import { toast } from "@/shared/ui/toast/toast-store";

import { ADMIN_COPY } from "../copy";
import type { ReportDetail, ReportRow } from "../model/report";
import type { ReportDetailDto } from "./contract";
import { toReportDetail, toReportRow } from "./mappers";
import { runReportAction, type RunActionInput } from "./run-action";

export const ADMIN_PAGE_SIZE = 20;

const ADMIN_KEY = ["admin"] as const;
export const adminKeys = {
  reports: [...ADMIN_KEY, "reports"] as const,
  report: (id: number) => [...ADMIN_KEY, "report", id] as const,
};

/** 읽어 오지 못한 응답(쓸 수 없는 신고)은 오류로 던져 화면이 잘못된 내용을 그리지 않게 한다. */
class MalformedReportError extends Error {
  constructor() {
    super("신고 응답을 해석할 수 없어요");
    this.name = "MalformedReportError";
  }
}

/** 처리 대기 신고 목록(접수 순). 관리자만 부를 수 있어 enabled 로 막는다. */
export function useReports(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: adminKeys.reports,
    enabled,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam, signal }) => {
      const { data } = await getReports(
        {
          status: "PENDING",
          size: ADMIN_PAGE_SIZE,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
        { signal },
      );
      return {
        items: (data.items ?? []).flatMap((dto) => toReportRow(dto) ?? []) as ReportRow[],
        nextCursor: data.nextCursor ?? null,
      };
    },
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}

export function useReport(reportId: number, enabled: boolean) {
  return useQuery({
    queryKey: adminKeys.report(reportId),
    enabled,
    queryFn: async ({ signal }): Promise<ReportDetail> => {
      const { data } = await getReport(reportId, { signal });
      const detail = toReportDetail(data as ReportDetailDto);
      if (!detail) throw new MalformedReportError();
      return detail;
    },
  });
}

/** 프로필의 "N건 대기". 한 페이지만 읽으므로 더 있으면 "N+" 로 보여준다. */
export function usePendingCount(enabled: boolean) {
  const query = useReports(enabled);
  const first = query.data?.pages[0];
  return {
    count: first ? first.items.length : undefined,
    more: first ? first.nextCursor !== null : false,
  };
}

/**
 * 신고 처리: 기각 · 숨김 · 삭제(+ 작성자 정지).
 * 서버가 조치마다 사유를 필수로 요구한다. 숨김·삭제는 같은 고민의 대기 신고를 함께 종료한다.
 * 작성자 정지는 조치가 끝난 뒤에 따로 부르므로, 정지만 실패해도 조치 자체는 되돌리지 않고 알린다.
 */
export function useHandleReport(report: ReportDetail | undefined) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: RunActionInput) => {
      if (!report) throw new MalformedReportError();
      return runReportAction(report, input);
    },
    onSuccess: ({ banFailed }) => {
      toast(banFailed ? ADMIN_COPY.banFailed : MESSAGES.admin.handled);
    },
    onError: (error) => toast(getErrorMessage(error, "admin")),
    // 성공해도 실패(이미 처리됨 등)해도 서버 상태와 화면을 맞춘다.
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ADMIN_KEY });
      void queryClient.invalidateQueries({ queryKey: FEED_KEY_PREFIX });
      void queryClient.invalidateQueries({ queryKey: MY_KEY_PREFIX });
      void queryClient.invalidateQueries({ queryKey: POLL_KEY_PREFIX });
    },
  });

  return { handle: mutation.mutate, isPending: mutation.isPending };
}
