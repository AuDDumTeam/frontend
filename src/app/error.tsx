"use client";

import { Screen } from "@/shared/ui/AppShell";
import { ErrorState } from "@/shared/ui/ErrorState";

/** 렌더링 중 예상하지 못한 오류가 나도 앱 틀은 유지하고 다시 시도할 수 있게 한다. */
export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Screen>
      <ErrorState onRetry={reset} />
    </Screen>
  );
}
