/**
 * 신고 검토 화면(S-07·S-08)에 보이는 문구. design_handoff_auddum_app/README.md 와 App v4 의 문구를 그대로 옮겼다.
 * 토스트 문구는 shared/lib/messages.ts 에 있다.
 */
export const ADMIN_COPY = {
  listTitle: "신고 검토",
  detailTitle: "신고 상세",
  empty: "접수된 신고가 없어요",
  profileBar: "관리자 · 신고 검토",
  reasonPrefix: "신고 사유 · ",
  targetPrefix: "대상 고민",
  autoNote: "신고 건수만으로 자동 처리되지 않아요. 상태",
  banAuthor: "작성자 이용 정지도 함께",
  actions: {
    dismiss: "기각 · 투표 유지",
    hide: "숨김 (복구 가능)",
    delete: "삭제 (복구 불가)",
  },
  handledPrefix: "이미 처리된 신고예요. ",
  status: {
    pending: "대기",
    dismissed: "기각",
    hidden: "숨김 처리",
    deleted: "삭제 처리",
    /** README 에 없음: 처리됐지만 어떤 조치인지 알 수 없을 때 */
    resolved: "처리 완료",
  },
  history: {
    dismissed: "기각 · 투표 유지",
    hidden: "숨김 처리",
    deleted: "삭제 처리",
    resolved: "처리 완료",
    handler: "처리자 관리자",
  },
  /** README 에 없음: 서버가 조치마다 사유(최대 200자)를 필수로 요구한다 */
  reasonLabel: "처리 사유",
  reasonPlaceholder: "처리 사유를 적어주세요 (200자)",
  reasonRequired: "처리 사유를 적어주세요",
  /** README 에 없음: 작성자 정지만 실패했을 때(조치는 이미 끝남) */
  banFailed: "조치는 끝났지만 작성자 정지에는 실패했어요",
  loadFailed: "신고를 불러오지 못했어요",
} as const;

export const pendingCountLabel = (count: number, more: boolean) =>
  `${count}${more ? "+" : ""}건 대기 ›`;
