import { toCategory, toDate } from "@/features/poll";
import type { PollSummaryResponse } from "@/shared/api/generated/model";

import type { FeedItem } from "../model/feed-item";

/** 쓸 수 없는 항목(id·질문 없음)은 null. 값 보정 규칙은 poll 과 같은 것을 쓴다. */
export function toFeedItem(dto: PollSummaryResponse): FeedItem | null {
  if (!dto.id || !dto.question) return null;

  return {
    id: dto.id,
    category: toCategory(dto.category),
    question: dto.question,
    participantCount: dto.participantCount ?? 0,
    closed: dto.closed ?? false,
    closesAt: toDate(dto.closesAt),
    joined: false, // 목록 응답에 참여 여부가 없다 (FeedItem.joined 참고)
  };
}
