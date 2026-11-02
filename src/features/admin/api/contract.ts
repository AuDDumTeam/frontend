import type { AdminReportDetailResponse } from "@/shared/api/generated/model";

/**
 * 신고 상세 응답에서 백엔드가 추가하기로 한 필드의 가정. (아직 openapi.json 에 없음)
 * 작성자 이용 정지(POST /admin/members/{memberId}/suspend)에 memberId 가 필요한데
 * 신고 상세의 poll 에 작성자 id 가 없다. 생기면 pnpm api:sync 후 이 확장을 지운다.
 * 없으면 "작성자 이용 정지도 함께" 체크박스를 보이지 않는다.
 */
export type ReportDetailDto = Omit<AdminReportDetailResponse, "poll"> & {
  poll?: NonNullable<AdminReportDetailResponse["poll"]> & { authorId?: number };
};
