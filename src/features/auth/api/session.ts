import { MOCKING_ENABLED } from "@/shared/api/mocks/enabled";
import { writeMockRole } from "@/shared/api/mocks/role";

/**
 * 카카오 로그인을 시작한다.
 * 실제로는 스프링이 카카오 동의 화면으로 보내고, 끝나면 원래 페이지로 돌려보낸다.
 * 목 모드에는 카카오가 없으므로 신규 가입 흐름(약관 시트)으로 바로 넘어가게 알려 준다.
 * @returns 목 모드면 "mock-signup" (호출한 쪽이 약관 시트를 연다), 아니면 이동을 시작했으므로 null
 */
export function startKakaoLogin(): "mock-signup" | null {
  if (MOCKING_ENABLED) return "mock-signup";
  // 스프링이 처리하는 경로(Next 페이지가 아님)라 전체 페이지 이동이 맞다.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign("/oauth2/authorization/kakao");
  return null;
}

/**
 * 약관 동의를 마쳐 회원이 되었음을 반영한다.
 * 백엔드의 약관 동의 API 가 아직 없어(#24) 목 모드에서만 계정을 회원으로 바꾼다.
 * 서버 계약이 생기면 여기서 동의 저장을 호출한다.
 */
export function completeSignup() {
  if (MOCKING_ENABLED) writeMockRole("member");
}

/** 로그아웃·탈퇴로 세션이 끝났음을 반영한다. 실제로는 서버가 쿠키를 지우므로 목 모드에서만 비회원으로 바꾼다. */
export function endSession() {
  if (MOCKING_ENABLED) writeMockRole("guest");
}
