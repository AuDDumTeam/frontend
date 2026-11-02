"use client";

import { useMe } from "@/features/auth";
import { ApiError } from "@/shared/api/fetcher";
import { FALLBACK_MESSAGES } from "@/shared/lib/messages";
import { Screen } from "@/shared/ui/AppShell";
import { ErrorState } from "@/shared/ui/ErrorState";
import { Header } from "@/shared/ui/Header";
import { SuspendBanner } from "@/shared/ui/SuspendBanner";

import { usePoll, usePollVote } from "../api/queries";
import { PollDetailView } from "./PollDetailView";
import { PollNotFound } from "./PollNotFound";

/** 400(잘못된 id)과 404 는 모두 "없는 고민"으로 보여준다. */
const isNotFound = (error: unknown) =>
  error instanceof ApiError && (error.status === 404 || error.status === 400);

/** 고민 상세 화면: 서버 상태를 읽어 로딩·없음·오류·상세 중 하나를 보여준다. */
export function PollScreen({ pollId }: { pollId: string }) {
  const { role } = useMe();
  const query = usePoll(pollId);
  const { vote, isPending } = usePollVote(pollId);

  const poll = query.data;

  return (
    <>
      <Header backHref="/" />
      {role === "suspended" && <SuspendBanner />}

      {poll && poll.status !== "DELETED" ? (
        <PollDetailView poll={poll} role={role} submitting={isPending} onVote={vote} />
      ) : (
        <Screen>
          {query.isPending ? (
            <div
              role="status"
              aria-busy="true"
              aria-label={FALLBACK_MESSAGES.loading}
              className="flex flex-col gap-3 pt-1"
            >
              <div className="bg-track rounded-pill h-3.5 w-32" />
              <div className="bg-track rounded-control h-7 w-full" />
              <div className="bg-track rounded-control h-7 w-3/4" />
            </div>
          ) : isNotFound(query.error) || poll?.status === "DELETED" ? (
            <PollNotFound />
          ) : (
            <ErrorState onRetry={() => void query.refetch()} />
          )}
        </Screen>
      )}
    </>
  );
}
