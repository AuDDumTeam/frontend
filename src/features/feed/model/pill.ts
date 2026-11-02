import { CLOSING_SOON_LABEL, isClosingSoon } from "@/features/poll";
import type { PillTone } from "@/shared/ui/Pill";

import type { FeedItem } from "./feed-item";

export type PillState = { tone: PillTone; label: string };

/**
 * 피드 행의 상태 pill. 하나만 보여주며 우선순위는 마감 > 참여 완료 > 마감임박.
 * 아무 것도 해당하지 않으면 null (pill 없음).
 */
export function pickPillState(
  item: Pick<FeedItem, "closed" | "joined" | "closesAt">,
  now: Date,
): PillState | null {
  if (item.closed) return { tone: "closed", label: "마감" };
  if (item.joined) return { tone: "joined", label: "참여 완료" };
  if (isClosingSoon(item.closesAt, now))
    return { tone: "soon", label: CLOSING_SOON_LABEL };
  return null;
}
