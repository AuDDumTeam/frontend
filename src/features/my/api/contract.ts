import type { PollSummaryResponse } from "@/shared/api/generated/model";
import { customFetch } from "@/shared/api/fetcher";

/**
 * 백엔드에 아직 없는 목록 API 의 가정 계약. (CLAUDE.md "백엔드 추가 예정")
 * openapi.json 에 추가되고 `pnpm api:sync` 하면 생성 코드로 바꾸고 이 파일을 지운다.
 * 목(shared/api/mocks/handlers.ts)이 같은 모양을 내려준다.
 *
 * 가정:
 *  - 두 목록 모두 { items, nextCursor, totalCount } 이고, totalCount 는 전체 개수다.
 *  - 참여한 고민은 비회원도 부를 수 있다(이 브라우저의 익명 참여 기록). 내가 올린 고민은 회원만(비회원 401).
 *    백엔드가 비회원에게 401 을 주면 참여한 고민 탭이 오류 화면이 되므로, 계약이 정해지면 확인한다.
 */
export type MyListPage<T> = {
  items?: T[];
  nextCursor?: string | null;
  totalCount?: number;
};

/** GET /members/me/votes: 내가 참여한 고민. 내 선택과 그 선택의 득표율을 함께 준다. */
export type MyVoteDto = PollSummaryResponse & {
  myChoice?: { position?: number; content?: string; percent?: number | null };
};

/** GET /members/me/polls: 내가 올린 고민. 숨김 처리된 것도 포함한다. */
export type MyPostDto = PollSummaryResponse & { status?: string };

type ListParams = { cursor?: string; size: number };

const list = <T>(path: string, { cursor, size }: ListParams, signal?: AbortSignal) => {
  const query = new URLSearchParams({ size: String(size) });
  if (cursor) query.set("cursor", cursor);
  return customFetch<{ data: MyListPage<T>; status: number }>(
    `/api/v1/members/me/${path}?${query}`,
    { signal },
  );
};

export const getMyVotes = (params: ListParams, signal?: AbortSignal) =>
  list<MyVoteDto>("votes", params, signal);

export const getMyPosts = (params: ListParams, signal?: AbortSignal) =>
  list<MyPostDto>("polls", params, signal);
