"use client";

import { useRouter } from "next/navigation";

import { useRequireLogin } from "@/features/auth";
import { TabBar } from "@/shared/ui/TabBar";

/** + 버튼: 비회원이면 로그인 시트, 아니면 고민 쓰기로 이동한다. */
export function TabBarContainer() {
  const router = useRouter();
  const requireLogin = useRequireLogin();
  return <TabBar onPlus={() => requireLogin(() => router.push("/write"))} />;
}
