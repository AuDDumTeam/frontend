import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { meKey, useAuthSheetStore } from "@/features/auth";
import { createPoll } from "@/shared/api/generated/auddum";
import { FEED_KEY_PREFIX, MY_KEY_PREFIX } from "@/shared/api/query-keys";
import { getErrorMessage, hasErrorCode } from "@/shared/lib/error-messages";
import { MESSAGES } from "@/shared/lib/messages";
import { toast } from "@/shared/ui/toast/toast-store";

import type { CreatePollInput } from "../model/form";
import { toCreatedPollId } from "./mappers";

/**
 * 고민 올리기. 성공하면 새 고민의 상세로 이동한다.
 * 공개 ID 를 읽지 못해도 고민은 이미 올라갔으므로 오류로 보지 않고 홈으로 보낸다.
 */
export function useCreatePoll() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const openAuthSheet = useAuthSheetStore((s) => s.open);

  const mutation = useMutation({
    mutationFn: async (input: CreatePollInput) =>
      toCreatedPollId((await createPoll(input)).data),
    onSuccess: (id) => {
      void queryClient.invalidateQueries({ queryKey: FEED_KEY_PREFIX });
      void queryClient.invalidateQueries({ queryKey: MY_KEY_PREFIX });
      toast(MESSAGES.write.posted);
      router.push(id ? `/p/${id}` : "/");
    },
    onError: (error) => {
      toast(getErrorMessage(error, "write"));
      // 세션 중에 정지된 계정이면 배너·흐림 처리가 바로 반영되도록 내 정보를 다시 읽는다.
      if (hasErrorCode(error, "MEMBER_SUSPENDED", "UNAUTHENTICATED")) {
        void queryClient.invalidateQueries({ queryKey: meKey });
      }
      if (hasErrorCode(error, "UNAUTHENTICATED")) openAuthSheet("login");
    },
  });

  return { create: mutation.mutate, isPending: mutation.isPending };
}
