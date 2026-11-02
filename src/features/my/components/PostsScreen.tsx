"use client";

import Link from "next/link";

import { LoginButton, useMe } from "@/features/auth";
import { CATEGORY_LABEL, participantsLabel } from "@/features/poll";
import { getErrorMessage } from "@/shared/lib/error-messages";
import { Screen } from "@/shared/ui/AppShell";
import { EmptyState } from "@/shared/ui/EmptyState";
import { ErrorState } from "@/shared/ui/ErrorState";
import { Header } from "@/shared/ui/Header";
import { LoadMore } from "@/shared/ui/LoadMore";
import { ScreenTitle } from "@/shared/ui/ScreenTitle";
import { SuspendBanner } from "@/shared/ui/SuspendBanner";
import { toast } from "@/shared/ui/toast/toast-store";

import { useMyPosts } from "../api/queries";
import { MY_COPY } from "../copy";
import type { MyPostItem } from "../model/items";
import { pickPostState } from "../model/post-state";
import { MyListSkeleton } from "./MyListSkeleton";

function PostRow({ item }: { item: MyPostItem }) {
  return (
    <Link
      href={`/p/${item.id}`}
      className="press border-line flex w-full flex-col gap-2.5 border-b py-5 text-left"
    >
      <span className="flex w-full items-center gap-1.75">
        <span className="text-accent-text text-[13px] font-extrabold whitespace-nowrap">
          {CATEGORY_LABEL[item.category]}
        </span>
        <span className="text-muted text-[13px] whitespace-nowrap">
          · {participantsLabel(item.participantCount)}
        </span>
        <span className="flex-1" />
        <span className="text-muted text-[12px] font-extrabold whitespace-nowrap">
          {MY_COPY.posts.state[pickPostState(item)]}
        </span>
      </span>
      <span className="tracking-heading text-[17px] leading-[1.45] font-extrabold text-pretty">
        {item.question}
      </span>
    </Link>
  );
}

/** 내가 올린 고민 탭. 비회원에게는 로그인 안내를 보여준다. */
export function PostsScreen() {
  const { role } = useMe();
  const isGuest = role === "guest";
  const query = useMyPosts(role !== undefined && !isGuest);
  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  const loadMore = async () => {
    const result = await query.fetchNextPage();
    if (result.isError) toast(getErrorMessage(result.error, "read"));
  };

  return (
    <>
      <Header />
      {role === "suspended" && <SuspendBanner />}
      <Screen>
        <ScreenTitle title={MY_COPY.posts.title} />
        {isGuest ? (
          <EmptyState
            title={
              <>
                {MY_COPY.posts.guest.titleLines[0]}
                <br />
                {MY_COPY.posts.guest.titleLines[1]}
              </>
            }
          >
            <LoginButton size="md" className="mt-2.5 w-55" />
          </EmptyState>
        ) : role === undefined || query.isPending ? (
          <MyListSkeleton />
        ) : query.isError && !query.data ? (
          <ErrorState onRetry={() => void query.refetch()} />
        ) : items.length === 0 ? (
          <EmptyState {...MY_COPY.posts.empty} />
        ) : (
          <>
            <div className="flex flex-col">
              {items.map((item) => (
                <PostRow key={item.id} item={item} />
              ))}
            </div>
            {query.hasNextPage && (
              <LoadMore
                loading={query.isFetchingNextPage}
                onClick={() => void loadMore()}
              />
            )}
          </>
        )}
      </Screen>
    </>
  );
}
