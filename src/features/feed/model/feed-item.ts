import type { PollCategory } from "@/features/poll";

/** 피드 한 줄. API 응답(모든 필드 optional)은 api/mappers 에서 이 모양으로 확정한다. */
export type FeedItem = {
  id: string;
  category: PollCategory;
  question: string;
  participantCount: number;
  closed: boolean;
  closesAt: Date | null;
  /**
   * 내가 참여했는지. 목록 응답에 참여 여부가 없어 지금은 항상 false 다.
   * 백엔드가 PollSummaryResponse 에 myChoice 를 추가하면 mappers 에서 채운다.
   */
  joined: boolean;
};
