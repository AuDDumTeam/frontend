"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useMe } from "@/features/auth";
import { FALLBACK_MESSAGES } from "@/shared/lib/messages";
import { useHydrated } from "@/shared/lib/use-hydrated";
import { Header } from "@/shared/ui/Header";
import { Screen } from "@/shared/ui/AppShell";

/**
 * 관리자 화면 가드. 관리자가 아니면 홈으로 돌려보낸다.
 * (최종 권한 검증은 서버가 한다. 이 가드는 쓸모없는 화면과 403 요청을 막는 용도다)
 */
export function AdminGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { role } = useMe();
  // 이 화면은 서버에서 늦게 스트리밍되어, 하이드레이트될 때 이미 계정 조회가 끝나 있을 수 있다.
  // 서버가 그린 대기 화면과 어긋나지 않도록 하이드레이션이 끝난 뒤에 판단한다.
  const hydrated = useHydrated();

  useEffect(() => {
    if (role !== undefined && role !== "admin") router.replace("/");
  }, [role, router]);

  if (!hydrated || role !== "admin") {
    return (
      <>
        <Header />
        <Screen>
          <div
            role="status"
            aria-busy="true"
            aria-label={FALLBACK_MESSAGES.loading}
            className="bg-track rounded-control h-7 w-full"
          />
        </Screen>
      </>
    );
  }
  return <>{children}</>;
}
