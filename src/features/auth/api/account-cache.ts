import type { QueryClient } from "@tanstack/react-query";

import { FEED_KEY_PREFIX, MY_KEY_PREFIX, POLL_KEY_PREFIX } from "@/shared/api/query-keys";

import { meKey } from "../hooks/useMe";

/** 계정마다 다른 값이 들어 있는 캐시. 세션이 바뀌면 이전 계정의 것을 보여주지 않도록 비운다. */
const ACCOUNT_BOUND_PREFIXES = [MY_KEY_PREFIX, POLL_KEY_PREFIX, FEED_KEY_PREFIX] as const;

/**
 * 로그아웃·탈퇴 직후 호출한다. 계정에 묶인 캐시를 비우고, 내 정보는 곧바로 비회원으로 바꾼다.
 * (재조회를 기다리는 동안 이전 계정이 남아 화면이 회원으로 보이는 일을 막는다)
 */
export function clearAccountCache(queryClient: QueryClient) {
  for (const queryKey of ACCOUNT_BOUND_PREFIXES) queryClient.removeQueries({ queryKey });
  queryClient.setQueryData(meKey, null);
  void queryClient.invalidateQueries({ queryKey: meKey });
}
