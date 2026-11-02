import { expect, test, type Page } from "@playwright/test";

// 목 서버(MSW) 기준. 목 상태는 문서를 새로 열면 초기화되므로 화면 이동은 링크로 한다.
async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

const toast = (page: Page, text: string) =>
  page.getByRole("status").filter({ hasText: text });

test("남의 고민을 신고하면 접수되고, 같은 고민을 다시 신고하면 안내가 나온다", async ({
  page,
}) => {
  await open(page, "/p/p7");
  await page.getByRole("button", { name: "메뉴" }).click();
  await page.getByRole("button", { name: "이 고민 신고하기" }).click();

  const sheet = page.getByRole("dialog");
  await expect(sheet.getByText("신고 사유를 골라주세요")).toBeVisible();
  // 시트가 올라오는 동안(translateY)에는 힘으로 누르는 클릭이 화면 밖을 때리므로, 멈출 때까지 기다린다.
  await sheet.getByRole("radio", { name: "성희롱" }).hover();
  // 사유를 고르기 전에는 비활성처럼 보이지만 눌림은 받고 안내를 준다.
  await sheet.getByRole("button", { name: "신고하기" }).click({ force: true });
  await expect(toast(page, "신고 사유를 골라주세요")).toBeVisible();

  await sheet.getByRole("radio", { name: "기타" }).click();
  await sheet.getByRole("button", { name: "신고하기" }).click({ force: true });
  await expect(toast(page, "신고 내용을 짧게 적어주세요")).toBeVisible();

  await sheet.getByRole("radio", { name: "광고·도배" }).click();
  await expect(sheet.getByPlaceholder("짧게 적어주세요 (100자)")).toHaveCount(0);
  await sheet.getByRole("button", { name: "신고하기" }).click();
  await expect(toast(page, "신고가 접수됐어요 · 관리자가 검토해요")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.getByRole("button", { name: "메뉴" }).click();
  await page.getByRole("button", { name: "이 고민 신고하기" }).click();
  await page.getByRole("radio", { name: "성희롱" }).click();
  await page.getByRole("button", { name: "신고하기" }).click();
  await expect(toast(page, "이미 신고한 고민이에요")).toBeVisible();
});

test("정지 계정은 신고할 수 없다는 안내를 받는다", async ({ page }) => {
  await open(page, "/p/p7?mockRole=suspended");
  await expect(
    page.getByText("이용이 정지된 계정이에요. 조회만 할 수 있어요"),
  ).toBeVisible();
  await page.getByRole("button", { name: "메뉴" }).click();
  await page.getByRole("button", { name: "이 고민 신고하기" }).click();
  await expect(toast(page, "이용이 정지된 계정은 신고할 수 없어요")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("내 고민은 메뉴에서 삭제하고, 삭제하면 피드에서 사라진다", async ({ page }) => {
  await open(page, "/p/p3");
  await page.getByRole("button", { name: "메뉴" }).click();
  await expect(page.getByRole("button", { name: "이 고민 신고하기" })).toHaveCount(0);
  await page.getByRole("button", { name: "내 고민 삭제하기" }).click();

  const sheet = page.getByRole("dialog");
  await expect(sheet.getByText("이 고민을 삭제할까요?")).toBeVisible();
  await sheet.getByRole("button", { name: "삭제" }).click();

  await expect(toast(page, "삭제했어요 · 복구할 수 없어요")).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("link", { name: /헤어진 지 한 달/ })).toHaveCount(0);
});

test("관리자는 신고를 검토해 기각·숨김 처리하고 처리 이력을 본다", async ({ page }) => {
  await open(page, "/me?mockRole=admin");
  await expect(page.getByText("관리자 권한")).toBeVisible();
  await page.getByRole("link", { name: /관리자 · 신고 검토/ }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("link", { name: /남친이 휴대폰 비밀번호/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /썸남이 읽씹하고/ })).toBeVisible();
  // 이미 기각된 신고는 대기 목록에 나오지 않는다.
  await expect(page.getByRole("link", { name: /기념일 선물 예산/ })).toHaveCount(0);

  await page.getByRole("link", { name: /썸남이 읽씹하고/ }).click();
  await expect(page.getByText("신고 사유 · 기타")).toBeVisible();
  await expect(page.getByText("“광고 같아요”")).toBeVisible();

  await page.getByRole("button", { name: "숨김 (복구 가능)" }).click();
  await expect(toast(page, "처리 사유를 적어주세요")).toBeVisible();

  await page.getByLabel("처리 사유").fill("광고성 글이라 숨김");
  await page.getByRole("checkbox", { name: "작성자 이용 정지도 함께" }).click();
  await page.getByRole("button", { name: "숨김 (복구 가능)" }).click();

  await expect(toast(page, "처리했어요 · 이력이 남았어요")).toBeVisible();
  await expect(
    page.getByText(/이미 처리된 신고예요\. 숨김 처리 · 처리자 관리자/),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "숨김 (복구 가능)" })).toHaveCount(0);

  await page.getByRole("link", { name: "뒤로가기" }).click();
  await expect(page.getByRole("link", { name: /썸남이 읽씹하고/ })).toHaveCount(0);
});

test("관리자가 아니면 신고 검토 화면에서 홈으로 돌아간다", async ({ page }) => {
  await open(page, "/admin?mockRole=member");
  await expect(page).toHaveURL(/\/$/);
});
