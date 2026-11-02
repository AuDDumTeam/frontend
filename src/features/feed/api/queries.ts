import { useInfiniteQuery } from "@tanstack/react-query";

import type { PollCategory } from "@/features/poll";
import { getPolls } from "@/shared/api/generated/auddum";
import type { GetPollsParams } from "@/shared/api/generated/model";
import { FEED_KEY_PREFIX } from "@/shared/api/query-keys";

import type { FeedItem } from "../model/feed-item";
import { toFeedItem } from "./mappers";

export const FEED_PAGE_SIZE = 20;

/**
 * category 필터는 백엔드가 GetPollsParams 에 추가하기로 한 파라미터다. (아직 openapi.json 에 없음)
 * 추가되고 `pnpm api:sync` 하면 이 확장은 필요 없어진다.
 */
type FeedParams = GetPollsParams & { category?: PollCategory };

/** 접두사(FEED_KEY_PREFIX)는 투표 후 피드 무효화에도 쓰인다. 바꾸면 poll 쪽 무효화도 함께 따라간다. */
export const feedKey = (category: PollCategory | null) =>
  [...FEED_KEY_PREFIX, category] as const;

export type FeedPage = { items: FeedItem[]; nextCursor: string | null };

export function useFeed(category: PollCategory | null) {
  return useInfiniteQuery({
    queryKey: feedKey(category),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam, signal }): Promise<FeedPage> => {
      const params: FeedParams = {
        size: FEED_PAGE_SIZE,
        ...(pageParam ? { cursor: pageParam } : {}),
        ...(category ? { category } : {}),
      };
      const { data } = await getPolls(params, { signal });
      return {
        items: (data.items ?? []).flatMap((dto) => toFeedItem(dto) ?? []),
        nextCursor: data.nextCursor ?? null,
      };
    },
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}
