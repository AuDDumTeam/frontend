import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

/**
 * closed 마감 / joined 참여 완료 / soon 마감임박(테두리만)
 * 어떤 상태를 보여줄지의 우선순위(마감 > 참여 완료 > 마감임박)는 feed 의 model 에서 정한다.
 */
export type PillTone = "closed" | "joined" | "soon";

const TONE: Record<PillTone, string> = {
  closed: "bg-track text-muted",
  joined: "bg-peach-2 text-ink",
  soon: "bg-transparent text-accent-text ring-[1.5px] ring-accent ring-inset",
};

export function Pill({ tone, children }: { tone: PillTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-pill inline-flex h-6 flex-none items-center px-2.5 text-[11.5px] font-extrabold",
        TONE[tone],
      )}
    >
      {children}
    </span>
  );
}
