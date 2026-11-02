"use client";

import Link from "next/link";

import { useMe } from "@/features/auth";
import { getErrorMessage } from "@/shared/lib/error-messages";
import { Screen } from "@/shared/ui/AppShell";
import { EmptyState } from "@/shared/ui/EmptyState";
import { ErrorState } from "@/shared/ui/ErrorState";
import { Header } from "@/shared/ui/Header";
import { ScreenTitle } from "@/shared/ui/ScreenTitle";
import { SuspendBanner } from "@/shared/ui/SuspendBanner";
import { toast } from "@/shared/ui/toast/toast-store";

import { useMyVotes } from "../api/queries";
import { MY_COPY, percentLabel, votesSubtitle } from "../copy";
import type { MyVoteItem } from "../model/items";
import { LoadMore } from "./LoadMore";
import { MyListSkeleton } from "./MyListSkeleton";

function VoteRow({ item }: { item: MyVoteItem }) {
  return (
    <Link
      href={`/p/${item.id}`}
      className="press border-line flex w-full flex-col gap-3 border-b py-5 text-left"
    >
      <span className="tracking-heading text-[17px] leading-[1.45] font-extrabold text-pretty">
        {item.question}
      </span>
      <span className="flex w-full min-w-0 items-center gap-2">
        <span className="text-muted flex-none text-[12px] whitespace-nowrap">
          {MY_COPY.votes.myAnswer}
        </span>
        <span className="bg-ink text-bg rounded-pill h-7.5 min-w-0 truncate px-3.5 text-[13px] leading-7.5 font-bold">
          {item.choice}
        </span>
        <span className="flex-1" />
        {item.percent !== null && (
          <span className="tracking-heading text-accent-text flex-none text-[18px] font-extrabold">
            {percentLabel(item.percent)}
          </span>
        )}
      </span>
    </Link>
  );
}

/** 참여한 고민 탭. 비회원도 이 브라우저에서 한 참여는 볼 수 있다. */
export function VotesScreen() {
  const { role } = useMe();
  const query = useMyVotes();
  const items = query.data?.pages.flatMap((page) => page.items) ?? [];
  const total = query.data?.pages[0]?.totalCount ?? 0;

  const loadMore = async () => {
    const result = await query.fetchNextPage();
    if (result.isError) toast(getErrorMessage(result.error, "read"));
  };

  return (
    <>
      <Header />
      {role === "suspended" && <SuspendBanner />}
      <Screen>
        <ScreenTitle
          title={MY_COPY.votes.title}
          subtitle={query.data ? votesSubtitle(total) : undefined}
        />
        {role === "guest" && (
          <p className="bg-sand text-muted rounded-control mb-3 px-4.5 py-3.5 text-[13px] leading-[1.6] font-bold">
            {MY_COPY.votes.guestNotice}
          </p>
        )}
        {query.isPending ? (
          <MyListSkeleton />
        ) : query.isError && !query.data ? (
          <ErrorState onRetry={() => void query.refetch()} />
        ) : items.length === 0 ? (
          <EmptyState {...MY_COPY.votes.empty} />
        ) : (
          <>
            <div className="flex flex-col">
              {items.map((item) => (
                <VoteRow key={item.id} item={item} />
              ))}
            </div>
            <LoadMore
              hasNext={query.hasNextPage}
              loading={query.isFetchingNextPage}
              onClick={() => void loadMore()}
            />
          </>
        )}
      </Screen>
    </>
  );
}
