/**
 * 개발·E2E 용 인메모리 목 데이터. 백엔드의 규칙을 흉내 낸다.
 *   - 결과(득표)는 참여했거나 마감된 고민에만 내려준다.
 *   - 마감 임박 고민(p5)은 투표하는 순간 마감된다 (마감 레이스).
 * 페이지를 새로고침하면 처음 상태로 돌아간다.
 */

export type MockCategory =
  | "SOME"
  | "BLIND_DATE"
  | "CONTACT"
  | "IN_RELATIONSHIP"
  | "BREAKUP"
  | "LOVE_VALUES"
  | "ETC";

export type MockPoll = {
  id: string;
  category: MockCategory;
  question: string;
  options: string[];
  votes: number[];
  closed: boolean;
  /** 투표하면 그 순간 마감되는 고민 (마감 레이스 재현용) */
  closesOnVote?: boolean;
  closesAt: string | null;
  createdAt: string;
  /** 관리자가 숨긴 고민은 피드에 나오지 않고 작성자만 본다. 기본은 공개 */
  status?: "PUBLIC" | "HIDDEN" | "DELETED";
  /** 작성자 id. 신고 상세에서 작성자를 정지하는 데 쓴다 (백엔드가 추가하기로 한 필드의 가정) */
  authorId?: number;
  /** 내가 올린 고민 */
  mine?: boolean;
};

const MIN = 60_000;
const HOUR = 60 * MIN;

const iso = (offsetMs: number) => new Date(Date.now() + offsetMs).toISOString();

const SEED: Omit<MockPoll, "createdAt">[] = [
  {
    id: "p7",
    category: "CONTACT",
    question: "답장이 늦는 건 관심이 없다는 뜻일까요?",
    options: ["그런 편이에요", "바빠서일 수도 있어요", "직접 물어봐요"],
    votes: [88, 140, 64],
    closed: false,
    closesAt: null,
  },
  {
    id: "p6",
    category: "LOVE_VALUES",
    question: "연락은 하루 한 번이면 충분할까요?",
    options: ["충분해요", "부족해요", "사람마다 달라요"],
    votes: [77, 190, 50],
    closed: true,
    mine: true,
    closesAt: null,
  },
  {
    id: "p5",
    category: "BLIND_DATE",
    question: "첫 만남 카페비, 더치페이 어때요?",
    options: ["더치페이", "번갈아 계산", "먼저 제안한 사람이 계산"],
    votes: [120, 88, 45],
    closed: false,
    closesOnVote: true,
    closesAt: iso(30 * MIN),
  },
  {
    id: "p4",
    category: "IN_RELATIONSHIP",
    question: "기념일 선물 예산, 얼마가 적당해요?",
    options: ["5만원 이하", "10만원 안팎", "마음이 중요, 금액 무관"],
    votes: [98, 321, 140],
    authorId: 103,
    closed: false,
    closesAt: iso(3 * HOUR),
  },
  {
    id: "p3",
    category: "BREAKUP",
    question: "헤어진 지 한 달 된 전애인이 “잘 지내?” 하고 연락 왔어요.",
    options: ["답장한다", "읽고 무시", "차단"],
    votes: [154, 389, 97],
    closed: false,
    mine: true,
    closesAt: null,
  },
  {
    id: "p2",
    category: "IN_RELATIONSHIP",
    question: "남친이 휴대폰 비밀번호를 알려달라는데, 줘도 될까요?",
    options: ["연인이면 공유 OK", "각자의 영역, 비공개", "서로 합의하면 OK"],
    votes: [201, 356, 302],
    authorId: 101,
    closed: false,
    closesAt: null,
  },
  {
    id: "p1",
    category: "SOME",
    question: "썸남이 읽씹하고 6시간 뒤에 ‘자다 깼어ㅋㅋ’라고 답장했어요. 어떰?",
    options: ["그냥 자연스럽게 답장", "나도 6시간 뒤에 답장", "관심 없는 거임, 정리"],
    votes: [412, 268, 187],
    authorId: 102,
    closed: false,
    closesAt: null,
  },
];

/** 내가 올렸지만 관리자가 숨긴 고민. 작성자 본인만 목록에서 "숨김"으로 본다. */
const HIDDEN_MINE: Omit<MockPoll, "createdAt"> = {
  id: "h1",
  category: "ETC",
  question: "숨김 처리된 내 고민 예시예요",
  options: ["하나", "둘"],
  votes: [3, 4],
  closed: false,
  closesAt: null,
  status: "HIDDEN",
  mine: true,
};

const FILLER_CATEGORIES: MockCategory[] = ["SOME", "CONTACT", "IN_RELATIONSHIP", "ETC"];

/** "더 보기"(페이지네이션)를 확인할 수 있도록 20개를 넘기는 채움 데이터. */
const FILLER: Omit<MockPoll, "createdAt">[] = Array.from({ length: 24 }, (_, i) => ({
  id: `f${i + 1}`,
  category: FILLER_CATEGORIES[i % FILLER_CATEGORIES.length] ?? "ETC",
  question: `예전 고민 ${i + 1}: 이럴 땐 어떻게 하는 게 좋을까요?`,
  options: ["그대로 둬요", "먼저 말해요"],
  votes: [10 + i, 20 + i],
  closed: false,
  closesAt: null,
}));

/** 최신순 정렬을 위해 앞에서부터 1분씩 과거로 간다. */
export const createInitialPolls = (): MockPoll[] =>
  [...SEED, HIDDEN_MINE, ...FILLER].map((poll, index) => ({
    ...poll,
    createdAt: iso(-index * MIN),
  }));

export type MockReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";
export type MockReason =
  "ABUSE_HATE" | "SEXUAL_HARASSMENT" | "PERSONAL_INFO" | "SPAM" | "ETC";

export type MockReport = {
  id: number;
  pollId: string;
  reason: MockReason;
  detail: string | null;
  status: MockReportStatus;
  createdAt: string;
  handledAt: string | null;
  handledBy: number | null;
  actions: {
    id: number;
    actionType: string;
    adminId: number;
    createdAt: string;
    reason: string;
  }[];
};

export type MockState = {
  polls: MockPoll[];
  /** pollId → 내가 고른 선택지의 position */
  myVotes: Record<string, number>;
  /** 마지막으로 고민을 올린 시각(ms). 연속 작성 간격 제한(429) 재현용 */
  lastCreatedAt: number | null;
  reports: MockReport[];
  /** 내가 신고한 고민(중복 신고 409 재현용) */
  reported: string[];
  /** 정지된 작성자 id */
  suspendedAuthors: number[];
};

export const createMockState = (): MockState => ({
  polls: createInitialPolls(),
  myVotes: {},
  lastCreatedAt: null,
  reports: createInitialReports(),
  reported: [],
  suspendedAuthors: [],
});

const seedReport = (
  id: number,
  pollId: string,
  reason: MockReason,
  detail: string | null,
  status: MockReportStatus,
): MockReport => ({
  id,
  pollId,
  reason,
  detail,
  status,
  createdAt: iso(-(id + 1) * 10 * MIN),
  handledAt: status === "PENDING" ? null : iso(-5 * MIN),
  handledBy: status === "PENDING" ? null : 1,
  actions:
    status === "PENDING"
      ? []
      : [
          {
            id: 1,
            actionType: "DISMISS",
            adminId: 1,
            createdAt: iso(-5 * MIN),
            reason: "문제 없음",
          },
        ],
});

/** 대기 2건 + 기각 1건. (작성자 id 는 db 의 authorId 와 맞춘다) */
const createInitialReports = (): MockReport[] => [
  seedReport(1, "p2", "ABUSE_HATE", null, "PENDING"),
  seedReport(2, "p1", "ETC", "광고 같아요", "PENDING"),
  seedReport(3, "p4", "SPAM", null, "DISMISSED"),
];
