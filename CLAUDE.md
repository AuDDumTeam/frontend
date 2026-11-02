# 어떰? (AuDDum) 프론트엔드

20–30대 연애 고민 투표 앱의 모바일 웹. 고민을 올리면 다른 사람이 선택지 하나로 "답장"하고, 투표 후 결과(%)를 본다.
백엔드는 별도 저장소(`../AuDDum`)이며 이 저장소는 프론트만 다룬다.

## 스택

Next.js (App Router) · TypeScript(strict) · Tailwind CSS v4 · TanStack Query · Zustand · React Hook Form + Zod
Orval(API 생성) · MSW(목 서버) · Vitest + Testing Library · Playwright · ESLint · pnpm

- **TypeScript는 6.0.x에 고정**한다. 7.x는 typescript-eslint가 아직 지원하지 않아 린트가 깨진다(지원 범위 `<6.1`). 올리기 전에 `pnpm lint`가 도는지 확인한다.
- ESLint 10 + `eslint-config-next`는 peer 경고가 나지만 동작을 확인했다.

## 명령어

- `pnpm dev` 개발 서버 / `pnpm build` 빌드
- `pnpm verify` = `typecheck` + `lint`(경계 규칙 포함) + `test`. **작업 종료 전 반드시 통과**
- `pnpm typecheck` / `pnpm lint` / `pnpm test` / `pnpm test:e2e`(Playwright, 목 API 사용)
- `pnpm format` Prettier 적용 (`.claude/`, `CLAUDE.md`는 제외)
- `pnpm api:sync` 백엔드 openapi.json에서 Orval로 클라이언트·목 핸들러 재생성 (명세는 복사하지 않고 직접 읽음)
- 환경변수는 `.env.example` 참고: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_API_MOCKING=enabled`(MSW)

## 먼저 읽을 것 (충돌 시 우선순위: 위가 높음)

1. `design_handoff_auddum_app/reference/AuDDum App v4.dc.html` 동작 기준
2. `design_handoff_auddum_app/README.md` 토큰·문구·규칙
3. 백엔드 계약: `../AuDDum/docs/generated/openapi.json`, 오류 코드는 `../AuDDum/docs/generated/오류-코드.md`

`design_handoff_auddum_app/`은 읽기 전용이다. 레퍼런스 HTML을 복사하지 말고 새로 구현한다.

## 폴더 구조와 의존 규칙

```
src/app/              URL↔화면 연결만. 로직·데이터 가공 금지
src/features/<기능>/    components · hooks · model(순수 비즈니스 규칙) · api · index.ts
src/shared/           ui · lib · styles(토큰) · 에러 처리
```

- 의존 방향은 `shared ← features ← app` 한 방향뿐이다. 역방향 금지.
- feature 끼리는 서로의 `index.ts`로만 접근한다. 내부 파일 직접 import 금지(린트가 검사).
- 비즈니스 규칙(퍼센트 계산, 결과 노출 조건, 상태 pill 우선순위 등)은 컴포넌트 밖 `model/`의 순수 함수로 두고 단위 테스트를 단다.
- 서버 컴포넌트가 기본이다. 상호작용·상태가 필요한 파일만 `'use client'`.

## API 규칙

- 명세는 백엔드가 생성한 `openapi.json`이며 **프론트에서 수정하지 않는다.** 바꿔야 하면 백엔드를 고친 뒤 `pnpm api:sync`. 서버 주소로 읽으려면 `OPENAPI_SPEC=<URL> pnpm api:sync`.
- 생성된 코드(`src/shared/api/generated`)는 커밋하되 수정하지 않는다. 훅은 `auddum.ts`, 목 핸들러는 `auddum.msw.ts`, 타입은 `model/`.
- 목(MSW)은 `NEXT_PUBLIC_API_MOCKING=enabled`일 때만 켜진다(`shared/api/mocks`). 서버 번들에서 `msw/browser`는 `next.config.ts`의 alias 스텁으로 대체된다 — 지우지 않는다.
- MSW는 3.x라 옵션명이 다르다(`onUnhandledRequest` 대신 `onUnhandledFrame`).
- 서버 오류는 `code`를 문구로 매핑하는 한 곳(`shared/lib/error-messages.ts`)에서 처리한다. 화면에 코드(`POLL_CLOSED` 등)를 노출하지 않는다.
- 퍼센트·득표수는 서버가 내려줄 때만 표시한다(미참여·진행 중에는 응답에 없음).

## 스타일 규칙

- 색·라운드·간격은 `@theme` 토큰만 사용한다. hex 값 직접 사용 금지.
- 폰트 굵기는 800/700/400만. 아이콘은 라인 아이콘, 이모지 금지.
- 모션은 README 값을 따르고 `prefers-reduced-motion`에서 translate/scale을 제거한다.
- 접근성: 실제 `<button>`, 시트 focus trap + ESC, 토스트 `aria-live="polite"`.

## MVP 범위

- 포함: 홈 피드(+카테고리 필터), 상세·투표·결과, 고민 작성, 카카오 로그인·약관, 신고,
  참여한 고민 탭, 내가 올린 고민 탭, 프로필(닉네임·통계 2열), 관리자 신고 검토
- 제외: 지금 인기 Top3, 프로필의 "연속 참여" 통계
- 백엔드 추가 예정 (추가 전에는 목으로 개발, `openapi.json` 갱신 후 연결):
  - `GET /polls`의 `category` 파라미터
  - 참여한 투표 목록 API, 내가 올린 투표 목록 API (응답에 `totalCount` 포함 요청)
  - `GET /members/me`의 닉네임 필드
- 프로필 통계 "내 답장 / 올린 고민"은 위 두 목록의 `totalCount`로 만든다.

## 작업 방식

- 단계 순서: 토큰·공통 → 홈·상세·투표 → 작성·로그인 → 참여·내 고민·프로필 → 관리자·신고. 단계마다 `pnpm verify` 통과 후 보고하고 멈춘다.
- 새 의존성, 폴더 구조 변경, 백엔드 계약과 다른 가정은 먼저 묻는다.
- 단계가 끝나면 리뷰어 에이전트(`.claude/agents/code-reviewer`)로 결합도·응집도·가독성·성능·장애 대응을 점검한다.
