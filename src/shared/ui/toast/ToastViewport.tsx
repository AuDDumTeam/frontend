"use client";

import { Icon } from "../Icon";
import { useToastStore } from "./toast-store";

/**
 * 앱 루트에 한 번만 둔다. 안내용 영역(aria-live)은 비어 있을 때도 항상 렌더링해야
 * 스크린리더가 나중에 들어오는 문구를 읽는다.
 */
export function ToastViewport() {
  const { message, id } = useToastStore();

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-28 z-60 mx-auto max-w-110 px-5"
    >
      {message && (
        <div
          key={id}
          className="animate-toast bg-ink text-bg rounded-control flex items-center gap-3 px-5 py-3.75 text-[14px] leading-normal font-bold"
        >
          <span className="bg-accent text-ink rounded-pill flex size-5.5 flex-none items-center justify-center">
            <Icon name="check" size={13} strokeWidth={3} />
          </span>
          {message}
        </div>
      )}
    </div>
  );
}
