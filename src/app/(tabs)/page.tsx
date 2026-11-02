import { Suspense } from "react";

import { FeedScreen } from "@/features/feed";

// FeedScreen 이 URL 쿼리(?category=)를 읽으므로 Suspense 경계가 필요하다.
export default function HomePage() {
  return (
    <Suspense>
      <FeedScreen />
    </Suspense>
  );
}
