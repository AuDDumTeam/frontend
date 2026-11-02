import type { Ref } from "react";

import { cn } from "@/shared/lib/cn";

import { POLL_COPY, resultHeading } from "../copy";
import type { ResultRow } from "../model/result";

const BAR_STAGGER_MS = 90;

type ResultListProps = {
  rows: ResultRow[];
  total: number;
  /** 투표 직후 키보드·스크린리더 포커스를 결과로 옮기기 위해 제목을 가리킨다 */
  headingRef?: Ref<HTMLHeadingElement>;
};

/** 선택지별 퍼센트와 막대. 막대는 위에서부터 90ms 간격으로 차오른다. */
export function ResultList({ rows, total, headingRef }: ResultListProps) {
  return (
    <section className="mt-7.5 flex flex-col gap-5.5">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="tracking-heading text-[18px] font-extrabold outline-none"
      >
        {resultHeading(total)}
      </h2>

      {rows.map((row, index) => (
        <div key={row.position} className="flex flex-col gap-2.25">
          <div className="flex min-w-0 items-baseline gap-2">
            <span
              className={cn(
                "min-w-0 flex-1 text-[15px] leading-[1.4]",
                row.isMine ? "font-extrabold" : "font-bold",
              )}
            >
              {row.content}
            </span>
            {row.isMine && (
              <span className="text-accent-text flex-none text-[11px] font-extrabold whitespace-nowrap">
                {POLL_COPY.myAnswer}
              </span>
            )}
            <span
              className={cn(
                "tracking-heading flex-none text-[22px] font-extrabold",
                row.isMine ? "text-accent-text" : "text-ink",
              )}
            >
              {row.percent}
              <span className="text-[13px] font-bold">%</span>
            </span>
          </div>

          <div className="bg-track rounded-bar h-2.5 overflow-hidden">
            <div
              className={cn(
                "animate-grow rounded-bar h-full origin-left",
                row.isMine ? "bg-accent" : "bg-bar",
              )}
              style={{
                width: `${row.percent}%`,
                animationDelay: `${index * BAR_STAGGER_MS}ms`,
              }}
            />
          </div>
        </div>
      ))}

      <p className="text-faint text-[12px]">{POLL_COPY.immutableNote}</p>
    </section>
  );
}
