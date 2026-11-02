import type { ReactNode } from "react";

import { Yolk } from "./Yolk";

/** 비어 있는 목록·로그인 안내. 어떰이(wonder) + 제목 + 보조 문구 + 선택적 버튼. */
export function EmptyState({
  title,
  hint,
  children,
}: {
  title: ReactNode;
  hint?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mt-12.5 flex flex-col items-center gap-2 text-center">
      <Yolk name="wonder" size={120} />
      <p className="tracking-heading text-[18px] leading-normal font-extrabold">
        {title}
      </p>
      {hint && <p className="text-muted text-[14px]">{hint}</p>}
      {children}
    </div>
  );
}
