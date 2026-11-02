import { useCallback } from "react";

import { useAuthSheetStore } from "../store/auth-sheet-store";
import { useMe } from "./useMe";

/**
 * 로그인이 필요한 동작을 감싼다. 비회원이면 로그인 시트를 열고, 아니면 동작을 실행한다.
 * 계정을 아직 확인 중이면 동작을 그대로 실행한다. 누른 것이 조용히 무시되는 것보다 낫고,
 * 비회원이면 서버가 401 로 거절하므로 동작 쪽에서 로그인 시트를 연다. (예: 고민 쓰기 화면)
 */
export function useRequireLogin() {
  const { role } = useMe();
  const openSheet = useAuthSheetStore((s) => s.open);

  return useCallback(
    (action: () => void) => {
      if (role === "guest") return openSheet("login");
      action();
    },
    [role, openSheet],
  );
}
