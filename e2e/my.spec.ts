import { expect, test, type Page } from "@playwright/test";

// 목 서버(MSW) 기준. 계정 상태는 ?mockRole= 로 바꾼다.
// goto 직후 하이드레이션 전 클릭을 피하려고 네트워크가 잠잠해질 때까지 기다린다.
async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

test("참여한 고민이 없으면 안내가 보인다", async ({ page }) => {
  await open(page, "/mine");
  await expect(page.getByText("내가 답장한 0개")).toBeVisible();
  await expect(page.getByText("아직 답장한 고민이 없어요")).toBeVisible();
  await expect(page.getByText("홈에서 하나 골라볼까요?")).toBeVisible();
});

test("투표하면 참여한 고민 탭에 내 답장과 퍼센트가 보인다", async ({ page }) => {
  // 목 상태는 문서를 새로 열면 초기화되므로, 화면 이동은 탭·뒤로가기(클라이언트 이동)로 한다.
  await open(page, "/");
  await page
    .getByRole("link", { name: /답장이 늦는 건 관심이 없다는 뜻일까요\?/ })
    .click();
  await page.getByRole("button", { name: "바빠서일 수도 있어요" }).click();
  await page.getByRole("button", { name: "이 답장 보내기" }).click();
  await expect(page.getByText("293명은 이렇게 답했어요")).toBeVisible();

  await page.goBack();
  await page.getByRole("link", { name: "참여", exact: true }).click();
  await expect(page.getByText("내가 답장한 1개")).toBeVisible();
  const row = page.getByRole("link", { name: /답장이 늦는 건 관심이 없다는 뜻일까요\?/ });
  await expect(row.getByText("바빠서일 수도 있어요")).toBeVisible();
  await expect(row.getByText(/\d+%/)).toBeVisible();
});

test("비회원은 참여한 고민에 안내가 보이고, 내 고민에서는 로그인을 권한다", async ({
  page,
}) => {
  await open(page, "/mine?mockRole=guest");
  await expect(
    page.getByText("로그인하지 않으면 이 브라우저에서 한 참여만 보여요"),
  ).toBeVisible();

  await page.getByRole("link", { name: "내 고민" }).click();
  await expect(page.getByText("로그인이 필요해요")).toBeVisible();
  await page.getByRole("button", { name: "카카오로 시작하기" }).click();
  await expect(page.getByRole("dialog").getByText("내 고민을 올려봐요")).toBeVisible();
});

test("내가 올린 고민은 공개·마감·숨김 상태와 함께 보인다", async ({ page }) => {
  await open(page, "/posted");
  const hidden = page.getByRole("link", { name: /숨김 처리된 내 고민 예시/ });
  await expect(hidden.getByText("숨김", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /연락은 하루 한 번이면/ }).getByText("마감"),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /헤어진 지 한 달/ }).getByText("공개"),
  ).toBeVisible();
});

test("프로필에서 통계를 보고 로그아웃·탈퇴하면 비회원이 된다", async ({ page }) => {
  await open(page, "/me");
  await expect(page.getByText("말랑한 노른자")).toBeVisible();
  await expect(page.getByText("카카오 계정으로 로그인됨")).toBeVisible();
  // 시드: 내가 올린 고민 3개(공개·마감·숨김), 참여 0개
  await expect(page.getByText("올린 고민").locator("..").getByText("3")).toBeVisible();

  await page.getByRole("button", { name: "로그아웃" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "로그아웃했어요" }),
  ).toBeVisible();
  await expect(page.getByText("로그인하지 않았어요")).toBeVisible();

  await open(page, "/me?mockRole=member");
  // 주소의 mockRole 이 남아 있으면 세션 값보다 우선하므로 지운다.
  await page.evaluate(() => history.replaceState(null, "", "/me"));
  await page.getByRole("button", { name: "탈퇴하기" }).click();
  const sheet = page.getByRole("dialog");
  await expect(sheet.getByText("정말 탈퇴할까요?")).toBeVisible();
  await sheet.getByRole("button", { name: "탈퇴" }).click();
  await expect(page.getByRole("status").filter({ hasText: "탈퇴했어요" })).toBeVisible();
  await expect(page.getByText("로그인하지 않았어요")).toBeVisible();
});
