import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { meKey } from "@/features/auth";
import { castVote, getPoll } from "@/shared/api/generated/auddum";
import { FEED_KEY_PREFIX } from "@/shared/api/query-keys";
import { getErrorMessage, hasErrorCode } from "@/shared/lib/error-messages";
import { MESSAGES } from "@/shared/lib/messages";
import { toast } from "@/shared/ui/toast/toast-store";

import { applyVote } from "../model/apply-vote";
import type { Poll } from "../model/poll";
import { toPoll, toVote } from "./mappers";

export const pollKeys = {
  detail: (pollId: string) => ["poll", pollId] as const,
  /** 피드 목록은 feed 가 관리한다. 투표하면 참여 인원이 달라지므로 무효화만 한다. */
  feed: FEED_KEY_PREFIX,
};

/** 쓸 수 없는 응답은 오류로 던져, 화면이 잘못된 데이터를 그리지 않게 한다. */
export class MalformedResponseError extends Error {
  constructor(what: string) {
    super(`${what} 응답을 해석할 수 없어요`);
    this.name = "MalformedResponseError";
  }
}

export function usePoll(pollId: string) {
  return useQuery({
    queryKey: pollKeys.detail(pollId),
    queryFn: async ({ signal }): Promise<Poll> => {
      const res = await getPoll(pollId, { signal });
      const poll = toPoll(res.data);
      if (!poll) throw new MalformedResponseError("고민");
      return poll;
    },
  });
}

/**
 * 투표 제출. 성공하면 받은 결과를 바로 반영하고,
 * 마감됐거나 이미 참여한 경우에는 서버 상태를 다시 불러와 화면을 맞춘다.
 */
export function usePollVote(pollId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (position: number) => {
      const res = await castVote(pollId, { position });
      return toVote(res.data);
    },
    onSuccess: (vote) => {
      toast(MESSAGES.vote.sent);
      if (vote) {
        queryClient.setQueryData<Poll>(
          pollKeys.detail(pollId),
          (old) => old && applyVote(old, vote),
        );
      } else {
        void queryClient.invalidateQueries({ queryKey: pollKeys.detail(pollId) });
      }
      void queryClient.invalidateQueries({ queryKey: pollKeys.feed });
    },
    onError: (error) => {
      toast(getErrorMessage(error, "vote"));
      // 세션 중에 정지된 계정이면 배너·흐림 처리가 바로 반영되도록 내 정보를 다시 읽는다.
      if (hasErrorCode(error, "MEMBER_SUSPENDED")) {
        void queryClient.invalidateQueries({ queryKey: meKey });
      }
      if (hasErrorCode(error, "POLL_CLOSED", "ALREADY_VOTED")) {
        void queryClient.invalidateQueries({ queryKey: pollKeys.detail(pollId) });
      }
    },
  });

  return { vote: mutation.mutate, isPending: mutation.isPending };
}
