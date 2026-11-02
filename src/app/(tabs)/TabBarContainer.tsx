"use client";

import { useRouter } from "next/navigation";

import { TabBar } from "@/shared/ui/TabBar";

// 3단계에서 비회원이면 로그인 시트를 띄우도록 features/auth 가드로 바꾼다.
export function TabBarContainer() {
  const router = useRouter();
  return <TabBar onPlus={() => router.push("/write")} />;
}
