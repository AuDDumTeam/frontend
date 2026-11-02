"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { ApiError } from "@/shared/api/fetcher";
import { MockProvider } from "@/shared/api/mocks/MockProvider";

const MAX_RETRIES = 2;

/** 4xx 는 요청이 잘못된 것이라 다시 보내도 같다. 네트워크·5xx 만 재시도한다. */
const shouldRetry = (failureCount: number, error: unknown) =>
  !(error instanceof ApiError && error.status < 500) && failureCount < MAX_RETRIES;

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: shouldRetry },
        },
      }),
  );

  return (
    <MockProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MockProvider>
  );
}
