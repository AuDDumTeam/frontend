import { Suspense, type ReactNode } from "react";

import { TabBarContainer } from "./TabBarContainer";

/** 홈 · 참여 · 내 고민 · 프로필 탭 화면은 하단 탭바를 공유한다. (상세·작성에서는 숨김) */
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      {/* 탭바가 현재 경로(usePathname)를 읽는다. 동적 경로(admin/[reportId])에서는 Suspense 안에 있어야 한다 */}
      <Suspense>
        <TabBarContainer />
      </Suspense>
    </>
  );
}
