import { Suspense } from "react";

import { PollScreen } from "@/features/poll";
import { Header } from "@/shared/ui/Header";

// 동적 경로의 params 는 요청 시점에 정해지므로 Suspense 경계 안에서 읽는다.
// 기다리는 동안에도 헤더(뒤로가기)는 바로 보인다.
export default function PollPage({ params }: PageProps<"/p/[id]">) {
  return (
    <Suspense fallback={<Header backHref="/" />}>
      <PollContent params={params} />
    </Suspense>
  );
}

async function PollContent({ params }: Pick<PageProps<"/p/[id]">, "params">) {
  const { id } = await params;
  return <PollScreen pollId={id} />;
}
