import { useInfiniteQuery } from "@tanstack/react-query";

import { MY_KEY_PREFIX } from "@/shared/api/query-keys";

import type { MyPage, MyPostItem, MyVoteItem } from "../model/items";
import { getMyPosts, getMyVotes } from "./contract";
import { toMyPage, toMyPostItem, toMyVoteItem } from "./mappers";

export const MY_PAGE_SIZE = 20;

export const myKeys = {
  votes: [...MY_KEY_PREFIX, "votes"] as const,
  posts: [...MY_KEY_PREFIX, "posts"] as const,
};

/** 참여한 고민. 비회원도 이 브라우저에서 한 참여는 볼 수 있다. */
export function useMyVotes() {
  return useInfiniteQuery({
    queryKey: myKeys.votes,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam, signal }): Promise<MyPage<MyVoteItem>> => {
      const res = await getMyVotes({ cursor: pageParam, size: MY_PAGE_SIZE }, signal);
      return toMyPage(res.data, toMyVoteItem);
    },
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}

/** 내가 올린 고민. 회원만 부를 수 있어 enabled 로 막는다. (비회원은 로그인 안내를 보여준다) */
export function useMyPosts(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: myKeys.posts,
    enabled,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam, signal }): Promise<MyPage<MyPostItem>> => {
      const res = await getMyPosts({ cursor: pageParam, size: MY_PAGE_SIZE }, signal);
      return toMyPage(res.data, toMyPostItem);
    },
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}
