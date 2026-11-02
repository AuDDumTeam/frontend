"use client";

import { onlineManager } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";

const MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

// 워커가 준비되기 전에 나가는 요청이 실제 서버로 새지 않도록, 준비될 때까지 쿼리를 대기시킨다.
// 화면을 비우지 않으므로 서버 렌더링과 로딩 UI는 그대로 동작한다.
if (MOCKING_ENABLED && typeof window !== "undefined") {
  onlineManager.setOnline(false);
}

// 워커는 앱 전체에서 한 번만 시작한다.
// (React 개발 모드는 effect 를 두 번 실행하는데, 두 번째 start() 는 오류를 던진다)
let started: Promise<unknown> | undefined;
function startMocking() {
  started ??= import("./browser").then(({ worker }) =>
    worker.start({ onUnhandledFrame: "bypass" }),
  );
  return started;
}

/** NEXT_PUBLIC_API_MOCKING=enabled 일 때만 MSW 워커를 시작한다. */
export function MockProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!MOCKING_ENABLED) return;
    void startMocking().then(() => onlineManager.setOnline(true));
  }, []);

  return <>{children}</>;
}
