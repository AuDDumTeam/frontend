import type { PollCategory } from "./category";

/** 화면이 다루는 고민 모델. API 응답(모든 필드 optional)은 api/mappers 에서 이 모양으로 확정한다. */

export type PollOption = {
  /** 서버가 정한 선택지 식별 값. 투표 요청과 결과 매칭에 쓴다. 배열 순서가 아니다. */
  position: number;
  content: string;
};

/** 결과는 참여했거나 마감된 고민에만 내려온다. 그 외에는 null. */
export type PollResult = {
  total: number;
  /** position → 득표수 */
  counts: Record<number, number>;
};

export type PollStatus = "PUBLIC" | "HIDDEN" | "DELETED";

export type Poll = {
  id: string;
  category: PollCategory;
  question: string;
  participantCount: number;
  closed: boolean;
  closesAt: Date | null;
  status: PollStatus;
  options: PollOption[];
  /** 내가 고른 선택지의 position. 미참여면 null */
  myChoice: number | null;
  result: PollResult | null;
};
