import { expect, test } from "@playwright/test";

// 목 서버(MSW)의 시드 데이터 기준. src/shared/api/mocks/db.ts
// 페이지를 새로 열면(goto) 목 상태가 처음으로 돌아간다.

test("홈에서 카테고리를 거르고 고민을 열어 투표하면 결과가 보인다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /오늘은 어떤 고민에/ })).toBeVisible();

  await page.getByRole("button", { name: "연락", exact: true }).click();
  await expect(page).toHaveURL(/category=CONTACT/);

  await page
    .getByRole("link", { name: /답장이 늦는 건 관심이 없다는 뜻일까요\?/ })
    .click();
  await expect(page).toHaveURL(/\/p\/p7$/);
  await expect(page.getByText("하나 골라 답장하면 결과가 보여요")).toBeVisible();

  // 고르지 않고 보내면 안내만 나온다.
  // 이 버튼은 aria-disabled 지만 눌림을 받는 것이 디자인이라 force 로 누른다.
  await page.getByRole("button", { name: "이 답장 보내기" }).click({ force: true });
  await expect(
    page.getByRole("status").filter({ hasText: "답장을 하나 골라주세요" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "바빠서일 수도 있어요" }).click();
  await page.getByRole("button", { name: "이 답장 보내기" }).click();

  await expect(page.getByText("293명은 이렇게 답했어요")).toBeVisible();
  await expect(page.getByText("내 답장").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "이 답장 보내기" })).toHaveCount(0);
});

test("고르는 사이에 마감되면 안내 후 마감 화면으로 바뀐다", async ({ page }) => {
  await page.goto("/p/p5");
  await page.getByRole("button", { name: "더치페이" }).click();
  await page.getByRole("button", { name: "이 답장 보내기" }).click();

  await expect(page.getByText("방금 마감됐어요 · 새 참여는 막혀요")).toBeVisible();
  await expect(
    page.getByText("마감된 고민이에요. 새로 참여할 수 없고 결과는 누구나 볼 수 있어요"),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "이 답장 보내기" })).toHaveCount(0);
  // 서버 코드는 화면에 보이지 않는다
  await expect(page.getByText(/POLL_CLOSED|409/)).toHaveCount(0);
});

test("마감된 고민은 투표 없이 결과를 볼 수 있다", async ({ page }) => {
  await page.goto("/p/p6");
  await expect(page.getByText("317명은 이렇게 답했어요")).toBeVisible();
  await expect(page.getByText("내 답장")).toHaveCount(0);
});

test("정지 계정은 조회만 할 수 있다", async ({ page }) => {
  await page.goto("/p/p4?mockRole=suspended");
  await expect(
    page.getByText("이용이 정지된 계정이에요. 조회만 할 수 있어요"),
  ).toBeVisible();

  await page.getByRole("button", { name: "5만원 이하" }).click();
  // 정지 계정의 제출 버튼도 aria-disabled 이지만 눌러서 안내를 받는다.
  await page.getByRole("button", { name: "이 답장 보내기" }).click({ force: true });
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "이용이 정지된 계정이라 참여할 수 없어요" }),
  ).toBeVisible();
});

test("없는 고민은 안내 화면을 보여주고 홈으로 돌아갈 수 있다", async ({ page }) => {
  await page.goto("/p/nope");
  await expect(
    page.getByRole("heading", { name: "없거나 삭제된 고민이에요" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "홈으로" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("더 보기를 누르면 다음 고민이 붙고 끝에서는 안내가 나온다", async ({ page }) => {
  await page.goto("/");
  const rows = page.locator('a[href^="/p/"]');
  await expect(rows).toHaveCount(20);

  await page.getByRole("button", { name: "더 보기" }).click();
  await expect(rows).toHaveCount(31);
  await expect(page.getByText("마지막 고민이에요")).toBeVisible();
  await expect(page.getByRole("button", { name: "더 보기" })).toHaveCount(0);
});
