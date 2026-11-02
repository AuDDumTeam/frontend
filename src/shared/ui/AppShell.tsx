import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

/**
 * 앱 바깥(#ebe3d3) 위에 최대 440px 폭으로 중앙 정렬되는 앱 영역.
 * 화면은 [Header] [Screen(스크롤)] [하단 고정] 세로 구조로 이 안에 쌓는다.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bg-outer">
      <div className="bg-bg relative mx-auto flex h-dvh max-w-110 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/** 헤더와 하단 영역 사이의 스크롤 영역. 스크롤바는 숨기고 진입 시 아래에서 올라온다. */
export function Screen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "animate-up flex-1 scrollbar-none overflow-y-auto px-5 pt-1 pb-7",
        className,
      )}
    >
      {children}
    </main>
  );
}
