import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import { clearAccountCache } from "./account-cache";

describe("clearAccountCache", () => {
  it("계정에 묶인 캐시를 비우고 내 정보를 비회원(null)으로 바꾼다", () => {
    const client = new QueryClient();
    client.setQueryData(["poll", "p1"], { myChoice: 1 });
    client.setQueryData(["feed", null], { pages: [] });
    client.setQueryData(["my", "votes"], { pages: [] });
    client.setQueryData(["me"], { role: "MEMBER" });
    client.setQueryData(["unrelated"], 1);

    clearAccountCache(client);

    expect(client.getQueryData(["poll", "p1"])).toBeUndefined();
    expect(client.getQueryData(["feed", null])).toBeUndefined();
    expect(client.getQueryData(["my", "votes"])).toBeUndefined();
    expect(client.getQueryData(["me"])).toBeNull();
    expect(client.getQueryData(["unrelated"])).toBe(1);
  });
});
