/**
 * 고민 쓰기 화면에 보이는 문구. design_handoff_auddum_app/README.md S-03 의 문구를 그대로 옮겼다.
 * 토스트 문구는 shared/lib/messages.ts 에 있다.
 */
export const WRITE_COPY = {
  title: "고민 쓰기",
  submit: "고민 올리기",
  questionPlaceholder: "어떤 고민이에요? 한 줄로 적어요",
  /** README 에 없음: 스크린리더용 입력/섹션 이름 */
  questionLabel: "고민 내용",
  categoryGroup: "카테고리",
  optionsGroup: "선택지",
  deadlineGroup: "마감",
  addOption: "+ 선택지 추가",
  /** README 에 없음: 삭제 버튼의 스크린리더용 이름 */
  removeOption: "선택지 삭제",
  /** 섹션 제목 옆 보조 문구 (프로토타입) */
  categoryHint: "하나만",
  optionsHint: "2~5개 · 각 50자",
  deadlineHint: "선택 · 없으면 계속 참여할 수 있어요",
  notice: "올리면 바로 공개돼요. 올린 뒤에는 수정할 수 없고 삭제만 할 수 있어요.",
} as const;

export const WRITE_ERRORS = {
  question: "고민을 적어주세요 (1~500자)",
  category: "카테고리를 하나 골라주세요",
  optionsMin: "선택지는 2개 이상 필요해요",
  optionsDuplicate: "같은 선택지가 있어요",
} as const;

export const optionPlaceholder = (index: number) =>
  `선택지 ${String.fromCharCode(65 + index)}`;

export const questionCounter = (length: number, max: number) => `${length}/${max}`;
