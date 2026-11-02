"use client";

import { useEffect, useState, type ReactNode } from "react";

const MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

// 워커는 앱 전체에서 한 번만 시작한다.
// (React 개발 모드는 effect 를 두 번 실행하는데, 두 번째 start() 는 오류를 던진다)
let started: Promise<unknown> | undefined;
function startMocking() {
  started ??= import("./browser").then(({ worker }) =>
    worker.start({ onUnhandledFrame: "bypass" }),
  );
  return started;
}

/**
 * NEXT_PUBLIC_API_MOCKING=enabled 일 때만 MSW 워커를 시작하고, 준비되기 전에는 화면을 그리지 않는다.
 * (워커보다 먼저 요청이 나가면 실제 서버로 가버리기 때문)
 */
export function MockProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!MOCKING_ENABLED);

  useEffect(() => {
    if (!MOCKING_ENABLED) return;
    let alive = true;
    startMocking().then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  return ready ? <>{children}</> : null;
}
