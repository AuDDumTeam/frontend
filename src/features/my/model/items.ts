import type { PollCategory, PollStatus } from "@/features/poll";

/** 참여한 고민 한 줄 */
export type MyVoteItem = {
  id: string;
  question: string;
  /** 내가 고른 선택지 내용 */
  choice: string;
  /** 내 선택의 득표율(%). 서버가 주지 않으면 null 이고 화면에 표시하지 않는다 */
  percent: number | null;
};

/** 내가 올린 고민 한 줄 */
export type MyPostItem = {
  id: string;
  category: PollCategory;
  question: string;
  participantCount: number;
  closed: boolean;
  status: PollStatus;
};

export type MyPage<T> = { items: T[]; nextCursor: string | null; totalCount: number };
