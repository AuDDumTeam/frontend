import { FALLBACK_MESSAGES } from "@/shared/lib/messages";

import { Button } from "./Button";
import { Yolk } from "./Yolk";

/** 목록·상세를 불러오지 못했을 때. 다시 시도하면 같은 요청을 다시 보낸다. (문구는 README 에 없음) */
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 pt-11 pb-5 text-center">
      <Yolk name="sad" size={120} />
      <div className="tracking-title text-[18px] font-extrabold">
        {FALLBACK_MESSAGES.loadFailed}
      </div>
      <p className="text-muted text-[14px]">{FALLBACK_MESSAGES.generic}</p>
      <Button size="pill-sm" variant="soft" className="mt-2" onClick={onRetry}>
        {FALLBACK_MESSAGES.retry}
      </Button>
    </div>
  );
}
