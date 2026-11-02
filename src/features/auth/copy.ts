/**
 * 로그인·약관 시트와 로그인 오류 화면의 문구.
 * design_handoff_auddum_app/README.md "바텀시트 (SH) 1·2" 의 문구를 그대로 옮겼다.
 */
export const AUTH_COPY = {
  login: {
    titleLines: ["로그인하고", "내 고민을 올려봐요"],
    hint: "투표와 결과 보기는 로그인 없이도 할 수 있어요",
    kakao: "카카오로 시작하기",
    later: "나중에 할게요",
  },
  terms: {
    titleLines: ["처음이시네요!", "약관만 확인할게요"],
    required: [
      { id: "service", label: "(필수) 이용약관" },
      { id: "privacy", label: "(필수) 개인정보 수집·이용" },
    ],
    /** README 에는 "CTA 활성"만 있고, 문구는 App v4 프로토타입에 있다 */
    submit: "동의하고 시작하기",
  },
  /** README 에 없음: 카카오 로그인이 실패해 돌아왔을 때(/login/error) */
  loginFailed: {
    title: "로그인하지 못했어요",
    hint: "잠시 후 다시 시도해주세요",
    home: "홈으로",
  },
} as const;
