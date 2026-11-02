import { delay, http, HttpResponse } from "msw";

import type { MockPoll, MockState } from "./db";

/** 백엔드 규칙: 직전 생성 후 30초 미만이면 429 */
const CREATE_INTERVAL_MS = 30_000;

export type MockRole = "guest" | "member" | "suspended" | "admin";

const error = (status: number, code: string, message: string) =>
  HttpResponse.json({ code, message }, { status });

const participantCount = (poll: MockPoll) => poll.votes.reduce((sum, n) => sum + n, 0);

const toSummary = (poll: MockPoll) => ({
  id: poll.id,
  category: poll.category,
  question: poll.question,
  participantCount: participantCount(poll),
  closed: poll.closed,
  closesAt: poll.closesAt,
  createdAt: poll.createdAt,
});

/** 결과는 참여했거나 마감된 고민에만 내려준다. (백엔드 규칙: 미참여·진행 중에는 득표를 숨긴다) */
const toResult = (poll: MockPoll) => ({
  total: participantCount(poll),
  options: poll.votes.map((count, position) => ({ position, count })),
});

/** 커서(=오프셋) 페이지네이션과 전체 개수(totalCount)를 붙여 내려준다. */
function pageOf<T>(request: Request, all: MockPoll[], toItem: (poll: MockPoll) => T) {
  const url = new URL(request.url);
  const size = Math.min(Math.max(Number(url.searchParams.get("size")) || 20, 1), 50);
  const offset = Number(url.searchParams.get("cursor")) || 0;
  const next = offset + size;
  return HttpResponse.json({
    items: all.slice(offset, next).map(toItem),
    nextCursor: next < all.length ? String(next) : null,
    totalCount: all.length,
  });
}

/**
 * 백엔드(openapi.json)의 읽기·투표 규칙을 흉내 내는 핸들러.
 * 그 외 엔드포인트는 Orval 이 만든 기본 핸들러가 맡는다. (browser.ts 에서 뒤에 붙임)
 * 선택지 position 은 0부터 시작한다. (0 이 "없음"으로 취급되는 버그를 일찍 드러내려는 의도)
 */
export function createHandlers(
  state: MockState,
  getRole: () => MockRole,
  latencyMs = 150,
) {
  const findPoll = (id: string | readonly string[] | undefined) =>
    state.polls.find((poll) => poll.id === id);

  return [
    http.get("/api/v1/members/me", async () => {
      await delay(latencyMs);
      const role = getRole();
      if (role === "guest") return error(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
      return HttpResponse.json({
        createdAt: new Date().toISOString(),
        role: role === "admin" ? "ADMIN" : "MEMBER",
        status: role === "suspended" ? "SUSPENDED" : "ACTIVE",
        nickname: "말랑한 노른자", // 백엔드가 추가하기로 한 필드
      });
    }),

    // 아래 두 목록은 백엔드에 아직 없는 API 의 가정 계약이다. (features/my/api/contract.ts)
    http.get("/api/v1/members/me/votes", async ({ request }) => {
      await delay(latencyMs);
      const mine = state.polls.filter((poll) => state.myVotes[poll.id] !== undefined);
      return pageOf(request, mine, (poll) => {
        const position = state.myVotes[poll.id] ?? 0;
        const total = participantCount(poll);
        return {
          ...toSummary(poll),
          myChoice: {
            position,
            content: poll.options[position],
            percent: total ? Math.round(((poll.votes[position] ?? 0) / total) * 100) : 0,
          },
        };
      });
    }),

    http.get("/api/v1/members/me/polls", async ({ request }) => {
      await delay(latencyMs);
      if (getRole() === "guest")
        return error(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
      const posted = state.polls.filter((poll) => poll.mine);
      return pageOf(request, posted, (poll) => ({
        ...toSummary(poll),
        status: poll.status ?? "PUBLIC",
      }));
    }),

    http.get("/api/v1/polls", async ({ request }) => {
      await delay(latencyMs);
      const category = new URL(request.url).searchParams.get("category");
      const visible = state.polls.filter(
        (poll) => poll.status !== "HIDDEN" && (!category || poll.category === category),
      );
      return pageOf(request, visible, toSummary);
    }),

    http.post("/api/v1/polls", async ({ request }) => {
      await delay(latencyMs);
      const role = getRole();
      if (role === "guest") return error(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
      if (role === "suspended") {
        return error(403, "MEMBER_SUSPENDED", "정지된 회원은 이 요청을 할 수 없습니다.");
      }

      const body = (await request.json().catch(() => null)) as {
        category?: MockPoll["category"];
        question?: string;
        options?: string[];
        closesAt?: string | null;
      } | null;
      const question = body?.question?.trim() ?? "";
      const options = (body?.options ?? []).map((option) => option.trim());
      const valid =
        body?.category &&
        question.length >= 1 &&
        question.length <= 500 &&
        !question.includes("\n") &&
        options.length >= 2 &&
        options.length <= 5 &&
        options.every((option) => option.length >= 1 && option.length <= 50) &&
        new Set(options).size === options.length;
      if (!body || !valid) {
        return error(400, "VALIDATION_FAILED", "요청 값이 올바르지 않습니다.");
      }

      if (state.polls[0]?.question === question) {
        return error(409, "DUPLICATE_POLL", "직전에 만든 투표와 같은 질문입니다.");
      }
      if (
        state.lastCreatedAt !== null &&
        Date.now() - state.lastCreatedAt < CREATE_INTERVAL_MS
      ) {
        return error(
          429,
          "POLL_RATE_LIMITED",
          "투표를 너무 자주 만들 수 없습니다. 잠시 후 다시 시도해 주세요.",
        );
      }

      const id = `n${state.polls.length + 1}`;
      state.polls.unshift({
        id,
        category: body.category as MockPoll["category"],
        question,
        options,
        votes: options.map(() => 0),
        closed: false,
        closesAt: body.closesAt ?? null,
        createdAt: new Date().toISOString(),
        mine: true,
      });
      state.lastCreatedAt = Date.now();
      // 실제 서버처럼 본문은 JSON 이 아닌 공개 ID 문자열이다.
      return new HttpResponse(id, {
        status: 201,
        headers: { "Content-Type": "text/plain", Location: `/api/v1/polls/${id}` },
      });
    }),

    http.get("/api/v1/polls/:pollId", async ({ params }) => {
      await delay(latencyMs);
      const poll = findPoll(params.pollId);
      if (!poll) return error(404, "POLL_NOT_FOUND", "존재하지 않는 투표입니다.");

      const myChoice = state.myVotes[poll.id] ?? null;
      const showResult = poll.closed || myChoice !== null;
      return HttpResponse.json({
        ...toSummary(poll),
        status: poll.status ?? "PUBLIC",
        options: poll.options.map((content, position) => ({ content, position })),
        myChoice,
        result: showResult ? toResult(poll) : null,
      });
    }),

    http.post("/api/v1/polls/:pollId/votes", async ({ params, request }) => {
      await delay(latencyMs);
      const body = (await request.json().catch(() => null)) as {
        position?: number;
      } | null;
      const position = body?.position;
      if (typeof position !== "number") {
        return error(400, "VALIDATION_FAILED", "요청 값이 올바르지 않습니다.");
      }

      const poll = findPoll(params.pollId);
      if (getRole() === "suspended") {
        return error(403, "MEMBER_SUSPENDED", "정지된 회원은 이 요청을 할 수 없습니다.");
      }
      if (!poll) return error(404, "POLL_NOT_FOUND", "존재하지 않는 투표입니다.");
      if (position < 0 || position >= poll.options.length) {
        return error(
          400,
          "INVALID_OPTION",
          "존재하지 않거나 이 투표에 속하지 않는 선택지입니다.",
        );
      }
      if (state.myVotes[poll.id] !== undefined) {
        return error(409, "ALREADY_VOTED", "이미 참여한 투표입니다.");
      }
      if (poll.closed) return error(409, "POLL_CLOSED", "마감된 투표입니다.");
      if (poll.closesOnVote) {
        poll.closed = true; // 사용자가 고르는 사이에 마감된 상황
        return error(409, "POLL_CLOSED", "마감된 투표입니다.");
      }

      poll.votes[position] = (poll.votes[position] ?? 0) + 1;
      state.myVotes[poll.id] = position;
      return HttpResponse.json(
        { myChoice: position, result: toResult(poll) },
        { status: 201 },
      );
    }),
  ];
}
