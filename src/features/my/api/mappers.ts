import { toCategory, toPollStatus } from "@/features/poll";

import type { MyListPage, MyPostDto, MyVoteDto } from "./contract";
import type { MyPage, MyPostItem, MyVoteItem } from "../model/items";

/** 쓸 수 없는 항목(id·질문·내 선택 없음)은 null. */
export function toMyVoteItem(dto: MyVoteDto): MyVoteItem | null {
  const choice = dto.myChoice?.content;
  if (!dto.id || !dto.question || !choice) return null;
  const percent = dto.myChoice?.percent;
  return {
    id: dto.id,
    question: dto.question,
    choice,
    percent: typeof percent === "number" ? percent : null,
  };
}

/** 모르는 공개 상태는 거른다. (모를 땐 비공개 쪽이 안전하다) */
export function toMyPostItem(dto: MyPostDto): MyPostItem | null {
  if (!dto.id || !dto.question) return null;
  const status = toPollStatus(dto.status);
  if (!status || status === "DELETED") return null;
  return {
    id: dto.id,
    category: toCategory(dto.category),
    question: dto.question,
    participantCount: dto.participantCount ?? 0,
    closed: dto.closed ?? false,
    status,
  };
}

/** totalCount 가 없으면 읽어 온 개수로 대신한다. (통계가 비어 보이는 것보다 낫다) */
export function toMyPage<D, T>(
  page: MyListPage<D>,
  toItem: (dto: D) => T | null,
): MyPage<T> {
  const items = (page.items ?? []).flatMap((dto) => toItem(dto) ?? []);
  return {
    items,
    nextCursor: page.nextCursor ?? null,
    totalCount: typeof page.totalCount === "number" ? page.totalCount : items.length,
  };
}
