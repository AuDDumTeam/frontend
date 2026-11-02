import type { MockRole } from "./handlers";

const STORAGE_KEY = "auddum:mock-role";
const ROLES: readonly MockRole[] = ["guest", "member", "suspended", "admin"];

const isMockRole = (value: string | null): value is MockRole =>
  ROLES.some((role) => role === value);

/**
 * 목 모드에서 보고 싶은 계정 상태. 주소에 ?mockRole=suspended 처럼 붙이면 바뀌고,
 * 이후 이동해도 유지된다(sessionStorage). 개발·E2E 전용이며 실제 앱에는 이런 전환이 없다.
 * 기본은 회원이다.
 */
export function readMockRole(): MockRole {
  const fromUrl = new URLSearchParams(window.location.search).get("mockRole");
  if (isMockRole(fromUrl)) {
    window.sessionStorage.setItem(STORAGE_KEY, fromUrl);
    return fromUrl;
  }
  const stored = window.sessionStorage.getItem(STORAGE_KEY);
  return isMockRole(stored) ? stored : "member";
}
