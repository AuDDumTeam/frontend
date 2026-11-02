import { describe, expect, it } from "vitest";

import { FEED_KEY_PREFIX } from "@/shared/api/query-keys";

import { feedKey } from "./queries";

describe("feedKey", () => {
  it("카테고리별 키가 공유 접두사로 시작한다 (투표 후 무효화가 모든 필터에 걸리도록)", () => {
    expect(feedKey(null).slice(0, FEED_KEY_PREFIX.length)).toEqual([...FEED_KEY_PREFIX]);
    expect(feedKey("SOME").slice(0, FEED_KEY_PREFIX.length)).toEqual([
      ...FEED_KEY_PREFIX,
    ]);
  });

  it("카테고리마다 다른 키를 가진다", () => {
    expect(feedKey("SOME")).not.toEqual(feedKey("CONTACT"));
    expect(feedKey(null)).not.toEqual(feedKey("SOME"));
  });
});
