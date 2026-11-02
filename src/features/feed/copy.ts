/**
 * 홈 피드 화면에 보이는 문구. design_handoff_auddum_app/README.md S-01 의 문구를 그대로 옮겼다.
 * (README 에 없는 문구는 표시한다.)
 */
export const FEED_COPY = {
  titleLines: ["오늘은 어떤 고민에", "답장해볼까요?"],
  section: "새 고민",
  sort: "최신순",
  categoryGroup: "카테고리",
  all: "전체",
  end: "마지막 고민이에요",
  showAll: "전체 보기",
  /** README 에 없음: 필터 없이 비어 있는 경우 */
  empty: "아직 올라온 고민이 없어요",
} as const;

export const emptyWithCategory = (label: string) => `아직 ${label} 고민이 없어요`;
