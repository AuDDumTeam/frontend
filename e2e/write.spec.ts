import { expect, test, type Page } from "@playwright/test";

// goto 직후에는 아직 하이드레이션 전일 수 있어 누른 클릭이 무시된다.
// 계정 조회(/members/me)까지 끝나 네트워크가 잠잠해지면 + 버튼이 동작한다.
async function openHome(page: Page, path = "/") {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

// 목 서버(MSW) 기준. 계정 상태는 ?mockRole= 로 바꾼다. (src/shared/api/mocks/role.ts)

test("회원이 고민을 작성하면 상세로 이동하고 토스트가 뜬다", async ({ page }) => {
  await openHome(page);
  await page.getByRole("button", { name: "고민 쓰기" }).click();
  await expect(page).toHaveURL(/\/write$/);

  // 제출 시도 전에는 오류가 보이지 않고, 시도 후에 화면 순서대로 나온다.
  await expect(page.getByText("고민을 적어주세요 (1~500자)")).toHaveCount(0);
  // 폼이 올바르지 않으면 aria-disabled 지만 눌림은 받는 것이 디자인이라 force 로 누른다.
  await page.getByRole("button", { name: "고민 올리기" }).click({ force: true });
  await expect(page.getByText("· 고민을 적어주세요 (1~500자)")).toBeVisible();
  await expect(page.getByText("· 카테고리를 하나 골라주세요")).toBeVisible();
  await expect(page.getByText("· 선택지는 2개 이상 필요해요")).toBeVisible();

  await page.getByLabel("고민 내용").fill("주말에 먼저 연락해도 될까요?");
  await page.getByRole("button", { name: "썸", exact: true }).click();
  await page.getByLabel("선택지 A", { exact: true }).fill("같음");
  await page.getByLabel("선택지 B", { exact: true }).fill("같음");
  await page.getByRole("button", { name: "고민 올리기" }).click({ force: true });
  await expect(page.getByText("· 같은 선택지가 있어요")).toBeVisible();

  await page.getByLabel("선택지 B", { exact: true }).fill("다름");
  await page.getByRole("button", { name: "24시간" }).click();
  await page.getByRole("button", { name: "고민 올리기" }).click();

  await expect(page).toHaveURL(/\/p\/n\d+$/);
  await expect(
    page.getByRole("heading", { name: "주말에 먼저 연락해도 될까요?" }),
  ).toBeVisible();
  await expect(
    page.getByRole("status").filter({ hasText: "올렸어요 · 바로 공개됐어요" }),
  ).toBeVisible();
});

test("비회원은 + 버튼에서 로그인 시트를 보고, 약관에 동의하면 가입된다", async ({
  page,
}) => {
  await openHome(page, "/?mockRole=guest");
  await page.getByRole("button", { name: "고민 쓰기" }).click();

  const login = page.getByRole("dialog");
  await expect(login.getByText("내 고민을 올려봐요")).toBeVisible();
  await login.getByRole("button", { name: "카카오로 시작하기" }).click();

  const terms = page.getByRole("dialog");
  await expect(terms.getByText("약관만 확인할게요")).toBeVisible();
  // 하나만 체크하면 아직 가입할 수 없다. (aria-disabled 지만 눌림은 받는다)
  await terms.getByRole("checkbox", { name: "(필수) 이용약관" }).click();
  await terms.getByRole("button", { name: "동의하고 시작하기" }).click({ force: true });
  await expect(terms).toBeVisible();

  await terms.getByRole("checkbox", { name: "(필수) 개인정보 수집·이용" }).click();
  await terms.getByRole("button", { name: "동의하고 시작하기" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "가입했어요 · 환영해요!" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("비회원이 /write 로 바로 들어오면 홈으로 보내고 로그인 시트를 연다", async ({
  page,
}) => {
  await page.goto("/write?mockRole=guest");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("dialog").getByText("내 고민을 올려봐요")).toBeVisible();
});

test("정지 계정은 올릴 수 없다는 안내를 받는다", async ({ page }) => {
  await page.goto("/write?mockRole=suspended");
  // 계정 확인이 끝나 정지 배너가 보인 뒤에 누른다.
  await expect(
    page.getByText("이용이 정지된 계정이에요. 조회만 할 수 있어요"),
  ).toBeVisible();
  await page.getByRole("button", { name: "고민 올리기" }).click({ force: true });
  await expect(
    page.getByRole("status").filter({ hasText: "이용이 정지된 계정이라 올릴 수 없어요" }),
  ).toBeVisible();
});
