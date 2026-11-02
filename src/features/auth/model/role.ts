/** 화면이 구분하는 계정 상태. 서버의 role·status 조합을 한 값으로 줄인다. */
export type Role = "guest" | "member" | "suspended" | "admin";

type MemberLike = { role?: string; status?: string };

/**
 * 우선순위: 비로그인·탈퇴 → 정지 → 관리자 → 회원.
 * 정지된 관리자는 정지로 본다. (쓰기가 모두 막히므로 정지 UI가 맞다)
 */
export function deriveRole(me: MemberLike | null | undefined): Role {
  if (!me) return "guest";
  if (me.status === "WITHDRAWN") return "guest";
  if (me.status === "SUSPENDED") return "suspended";
  if (me.role === "ADMIN") return "admin";
  return "member";
}
