import type { MyPostItem } from "./items";

export type PostState = "hidden" | "closed" | "public";

/** 내가 올린 고민의 상태. 우선순위는 숨김 > 마감 > 공개. (화면 문구는 copy.ts) */
export function pickPostState(post: Pick<MyPostItem, "status" | "closed">): PostState {
  if (post.status === "HIDDEN") return "hidden";
  if (post.closed) return "closed";
  return "public";
}
