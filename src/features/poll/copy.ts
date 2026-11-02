/**
 * 고민 상세·투표 화면에 보이는 문구. design_handoff_auddum_app/README.md S-02 의 문구를 그대로 옮겼다.
 * 토스트 문구는 shared/lib/messages.ts 에 있다.
 */
export const POLL_COPY = {
  voteHint: "하나 골라 답장하면 결과가 보여요",
  submit: "이 답장 보내기",
  /** 투표 화면 하단과 결과 화면 끝에서 같은 문구를 쓴다 */
  immutableNote: "제출한 답장은 바꿀 수 없어요",
  closedNotice: "마감된 고민이에요. 새로 참여할 수 없고 결과는 누구나 볼 수 있어요",
  myAnswer: "내 답장",
  notFound: {
    title: "없거나 삭제된 고민이에요",
    hint: "다른 고민에 답장해볼까요?",
    home: "홈으로",
  },
} as const;

export const resultHeading = (total: number) => `${total}명은 이렇게 답했어요`;

/** 피드 행과 상세 메타가 같은 표기를 쓴다 */
export const participantsLabel = (count: number) => `${count}명 참여`;
