import { useQuery } from "@tanstack/react-query";

import { ApiError } from "@/shared/api/fetcher";
import { getMyInfo } from "@/shared/api/generated/auddum";

import { deriveRole, type Role } from "../model/role";

export const meKey = ["me"] as const;

const toNickname = (data: unknown): string | null => {
  if (typeof data !== "object" || data === null || !("nickname" in data)) return null;
  return typeof data.nickname === "string" && data.nickname ? data.nickname : null;
};

/**
 * 현재 계정의 역할. 확인 중이면 undefined.
 * nickname 은 백엔드가 추가하기로 한 필드라(아직 openapi.json 에 없음) 없으면 null 이다.
 * 비로그인(401)은 오류가 아니라 비회원이다. 그 외 오류가 나도 조회는 가능해야 하므로 비회원으로 본다.
 */
export function useMe(): { role: Role | undefined; nickname: string | null } {
  const query = useQuery({
    queryKey: meKey,
    queryFn: async ({ signal }) => {
      try {
        return (await getMyInfo({ signal })).data;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
      }
    },
    staleTime: 60_000,
  });

  return {
    role: query.isPending ? undefined : deriveRole(query.data),
    nickname: toNickname(query.data),
  };
}
