import { expect, test } from "@playwright/test";

// 스모크: 홈이 열린다. 이후 단계에서 투표·작성·신고 흐름을 추가한다.
test("홈이 열린다", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.ok()).toBe(true);
});
