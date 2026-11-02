import type {
  PollDetailResponse,
  PollResultResponse,
  VoteCastResponse,
} from "@/shared/api/generated/model";

import { toCategory, toDate, toPollStatus } from "../model/parse";
import type { Poll, PollOption, PollResult } from "../model/poll";

/**
 * API 응답은 모든 필드가 optional 이다(명세에 required 가 없음).
 * 여기서 한 번 검증해 필수 값이 보장된 도메인 모델로 바꾸고, 화면에는 도메인 모델만 넘긴다.
 * 쓸 수 없는 응답은 null 을 돌려 호출자가 오류로 다루게 한다.
 */

export function toPollResult(
  dto: PollResultResponse | null | undefined,
): PollResult | null {
  if (!dto || typeof dto.total !== "number") return null;
  const counts: Record<number, number> = {};
  for (const option of dto.options ?? []) {
    if (typeof option.position === "number" && typeof option.count === "number") {
      counts[option.position] = option.count;
    }
  }
  return { total: dto.total, counts };
}

export function toPoll(dto: PollDetailResponse): Poll | null {
  if (!dto.id || !dto.question) return null;

  const options: PollOption[] = (dto.options ?? [])
    .flatMap((o) =>
      typeof o.position === "number" && o.content
        ? [{ position: o.position, content: o.content }]
        : [],
    )
    .sort((a, b) => a.position - b.position);
  // 선택지가 2개 미만이면 고민으로 성립하지 않는다.
  if (options.length < 2) return null;

  const status = toPollStatus(dto.status);
  if (!status) return null;

  const closed = dto.closed ?? false;
  const myChoice = typeof dto.myChoice === "number" ? dto.myChoice : null;
  const result = toPollResult(dto.result);
  // 결과를 보여줘야 하는 상태(마감·참여)인데 결과가 없으면 빈 화면이 되므로 오류로 다룬다.
  if ((closed || myChoice !== null) && !result) return null;

  return {
    id: dto.id,
    category: toCategory(dto.category),
    question: dto.question,
    participantCount: dto.participantCount ?? 0,
    closed,
    closesAt: toDate(dto.closesAt),
    status,
    options,
    myChoice,
    result,
  };
}

export function toVote(
  dto: VoteCastResponse,
): { myChoice: number; result: PollResult } | null {
  const result = toPollResult(dto.result);
  if (typeof dto.myChoice !== "number" || !result) return null;
  return { myChoice: dto.myChoice, result };
}
