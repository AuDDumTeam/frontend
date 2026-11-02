/**
 * 참여한 고민·내가 올린 고민·프로필 화면의 문구.
 * design_handoff_auddum_app/README.md S-04~S-06 과 바텀시트 6(탈퇴)을 그대로 옮겼다.
 * 비어 있는 화면의 "고민을 올리려면 로그인이 필요해요" 줄바꿈은 프로토타입을 따른다.
 */
export const MY_COPY = {
  votes: {
    title: "참여한 고민",
    guestNotice: "로그인하지 않으면 이 브라우저에서 한 참여만 보여요",
    myAnswer: "내 답장",
    empty: { title: "아직 답장한 고민이 없어요", hint: "홈에서 하나 골라볼까요?" },
  },
  posts: {
    title: "내가 올린 고민",
    state: { hidden: "숨김", closed: "마감", public: "공개" },
    guest: { titleLines: ["고민을 올리려면", "로그인이 필요해요"] },
    empty: {
      title: "아직 올린 고민이 없어요",
      hint: "가운데 + 버튼으로 첫 고민을 올려봐요",
    },
  },
  profile: {
    title: "프로필",
    guestNickname: "비회원",
    roleLine: {
      guest: "로그인하지 않았어요",
      member: "카카오 계정으로 로그인됨",
      suspended: "이용 정지 · 조회만 가능",
      admin: "관리자 권한",
    },
    guestCard: {
      titleLines: ["로그인하면 내 고민을", "올릴 수 있어요"],
      hint: "투표는 로그인 없이도 할 수 있어요",
    },
    stats: { votes: "내 답장", posts: "올린 고민" },
    logout: "로그아웃",
    withdraw: "탈퇴하기",
    /** README 에 없음: 닉네임 필드가 아직 없는 서버 응답일 때 대신 보여준다 */
    fallbackNickname: "회원",
    /** README 에 없음: 통계를 아직 못 불러왔을 때 숫자 자리에 */
    statsUnknown: "–",
  },
  withdraw: {
    title: "정말 탈퇴할까요?",
    body: "올린 고민은 작성자 없이 남고, 투표 기록은 보존돼요. 같은 카카오 계정으로 다시 가입하면 새 계정으로 시작해요.",
    cancel: "취소",
    confirm: "탈퇴",
  },
} as const;

export const votesSubtitle = (count: number) => `내가 답장한 ${count}개`;
export const percentLabel = (percent: number) => `${percent}%`;
