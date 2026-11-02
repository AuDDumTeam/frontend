import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout, withdraw } from "@/shared/api/generated/auddum";
import { getErrorMessage } from "@/shared/lib/error-messages";
import { MESSAGES } from "@/shared/lib/messages";
import { toast } from "@/shared/ui/toast/toast-store";

import { clearAccountCache } from "../api/account-cache";
import { endSession } from "../api/session";

/** 세션이 끝났음을 반영한다: 계정에 묶인 캐시를 비우고 비회원으로 돌린다. */
function useResetAccount() {
  const queryClient = useQueryClient();
  return () => {
    endSession();
    clearAccountCache(queryClient);
  };
}

/** 로그아웃. 확인 없이 바로 처리한다. */
export function useLogout() {
  const reset = useResetAccount();
  const mutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      reset();
      toast(MESSAGES.account.loggedOut);
    },
    onError: (error) => toast(getErrorMessage(error, "account")),
  });
  return { logout: mutation.mutate, isPending: mutation.isPending };
}

/** 탈퇴. 정지 중에도 할 수 있다. 확인 시트는 호출하는 쪽이 띄운다. */
export function useWithdraw(onDone: () => void) {
  const reset = useResetAccount();
  const mutation = useMutation({
    mutationFn: () => withdraw(),
    onSuccess: () => {
      reset();
      toast(MESSAGES.account.withdrawn);
      onDone();
    },
    onError: (error) => toast(getErrorMessage(error, "account")),
  });
  return { withdraw: mutation.mutate, isPending: mutation.isPending };
}
