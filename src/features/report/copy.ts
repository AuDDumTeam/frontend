/**
 * 신고 시트에 보이는 문구. design_handoff_auddum_app/README.md 바텀시트 5 의 문구를 그대로 옮겼다.
 * 토스트 문구는 shared/lib/messages.ts 에 있다.
 */
export const REPORT_COPY = {
  title: "신고 사유를 골라주세요",
  etcPlaceholder: "짧게 적어주세요 (100자)",
  submit: "신고하기",
  note: "관리자가 검토해요. 처리 결과는 따로 알려드리지 않아요",
  /** README 에 없음: 기타를 골랐는데 내용이 비어 있을 때(서버가 기타에는 내용을 필수로 요구한다) */
  etcRequired: "신고 내용을 짧게 적어주세요",
} as const;
