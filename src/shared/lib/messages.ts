/**
 * 사용자에게 보이는 토스트·안내 문구. design_handoff_auddum_app/README.md "토스트·에러 문구"를 그대로 옮겼다.
 * 괄호 속 코드(POLL_CLOSED, 429, 409, MEMBER_SUSPENDED)는 프로토타입 설명용이라 뺐다.
 * 새 문구가 필요하면 README 에 없다는 점을 보고하고 여기에 추가한다.
 */
export const MESSAGES = {
  vote: {
    sent: "답장이 전달됐어요",
    pick: "답장을 하나 골라주세요",
    suspended: "이용이 정지된 계정이라 참여할 수 없어요",
    closed: "방금 마감됐어요 · 새 참여는 막혀요",
  },
  write: {
    posted: "올렸어요 · 바로 공개됐어요",
    suspended: "이용이 정지된 계정이라 올릴 수 없어요",
    rateLimited: "조금 있다가 올려주세요 · 연속 작성 간격 제한",
    duplicate: "직전과 같은 고민이에요",
  },
  delete: {
    done: "삭제했어요 · 복구할 수 없어요",
  },
  report: {
    sent: "신고가 접수됐어요 · 관리자가 검토해요",
    pickReason: "신고 사유를 골라주세요",
    alreadyReported: "이미 신고한 고민이에요",
    suspended: "이용이 정지된 계정은 신고할 수 없어요",
  },
  account: {
    loggedOut: "로그아웃했어요",
    withdrawn: "탈퇴했어요",
    joined: "가입했어요 · 환영해요!",
    suspended: "이용이 정지된 계정이에요",
  },
  admin: {
    handled: "처리했어요 · 이력이 남았어요",
  },
} as const;

/** README 에 없는 공통 문구. 서버 메시지도 없을 때만 쓴다. */
export const FALLBACK_MESSAGES = {
  generic: "잠시 후 다시 시도해주세요",
  network: "네트워크 연결을 확인해주세요",
  loadFailed: "불러오지 못했어요",
  retry: "다시 시도",
  /** 스크린리더용 로딩 안내(화면에는 보이지 않음) */
  loading: "불러오는 중",
} as const;
