"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useMe } from "@/features/auth";
import { isPollCategory, type PollCategory } from "@/features/poll";
import { getErrorMessage } from "@/shared/lib/error-messages";
import { Screen } from "@/shared/ui/AppShell";
import { ErrorState } from "@/shared/ui/ErrorState";
import { Header } from "@/shared/ui/Header";
import { LoadMore } from "@/shared/ui/LoadMore";
import { SuspendBanner } from "@/shared/ui/SuspendBanner";
import { toast } from "@/shared/ui/toast/toast-store";

import { useFeed } from "../api/queries";
import { FEED_COPY } from "../copy";
import { CategoryChips } from "./CategoryChips";
import { FeedEmpty } from "./FeedEmpty";
import { FeedRow } from "./FeedRow";
import { FeedSkeleton } from "./FeedSkeleton";

/** 홈: 카테고리 필터 + 최신순 피드 + 더 보기. 선택한 카테고리는 URL(?category=)에 둔다. */
export function FeedScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { role } = useMe();

  const raw = searchParams.get("category");
  const category: PollCategory | null = isPollCategory(raw) ? raw : null;

  const selectCategory = (next: PollCategory | null) => {
    router.replace(next ? `${pathname}?category=${next}` : pathname, { scroll: false });
  };

  const feed = useFeed(category);
  const [now] = useState(() => new Date());
  const items = feed.data?.pages.flatMap((page) => page.items) ?? [];

  const loadMore = async () => {
    const result = await feed.fetchNextPage();
    if (result.isError) toast(getErrorMessage(result.error, "read"));
  };

  return (
    <>
      <Header />
      {role === "suspended" && <SuspendBanner />}
      <Screen>
        <h1 className="tracking-head pt-0.5 pb-5.5 text-[28px] leading-[1.35] font-extrabold">
          {FEED_COPY.titleLines[0]}
          <br />
          {FEED_COPY.titleLines[1]}
        </h1>

        <h2 className="tracking-heading pb-3 text-[16px] font-extrabold">
          {FEED_COPY.section}{" "}
          <span className="text-muted text-[12.5px] font-normal tracking-normal">
            {FEED_COPY.sort}
          </span>
        </h2>
        <CategoryChips selected={category} onSelect={selectCategory} />

        {feed.isPending ? (
          <FeedSkeleton />
        ) : feed.isError && !feed.data ? (
          <ErrorState onRetry={() => void feed.refetch()} />
        ) : items.length === 0 ? (
          <FeedEmpty category={category} onClear={() => selectCategory(null)} />
        ) : (
          <>
            <div className="flex flex-col">
              {items.map((item) => (
                <FeedRow key={item.id} item={item} now={now} />
              ))}
            </div>
            {feed.hasNextPage ? (
              <LoadMore
                loading={feed.isFetchingNextPage}
                onClick={() => void loadMore()}
              />
            ) : (
              <p className="text-faint mt-5 text-center text-[12.5px]">{FEED_COPY.end}</p>
            )}
          </>
        )}
      </Screen>
    </>
  );
}
