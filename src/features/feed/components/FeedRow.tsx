import Link from "next/link";

import { CATEGORY_LABEL, participantsLabel } from "@/features/poll";
import { Pill } from "@/shared/ui/Pill";

import type { FeedItem } from "../model/feed-item";
import { pickPillState } from "../model/pill";

/** 피드의 한 줄. 누르면 고민 상세로 간다. */
export function FeedRow({ item, now }: { item: FeedItem; now: Date }) {
  const pill = pickPillState(item, now);

  return (
    <Link
      href={`/p/${item.id}`}
      className="press border-line flex w-full flex-col gap-2.5 border-b py-5 text-left"
    >
      <span className="flex w-full items-center gap-1.75">
        <span className="text-accent-text text-[13px] font-extrabold whitespace-nowrap">
          {CATEGORY_LABEL[item.category]}
        </span>
        <span className="text-muted text-[13px] whitespace-nowrap">
          · {participantsLabel(item.participantCount)}
        </span>
        <span className="flex-1" />
        {pill && <Pill tone={pill.tone}>{pill.label}</Pill>}
      </span>
      <span className="tracking-heading text-[18px] leading-[1.45] font-extrabold">
        {item.question}
      </span>
    </Link>
  );
}
