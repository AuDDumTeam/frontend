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
- 생성된 DTO는 모든 필드가 optional이다. 화면은 DTO를 직접 쓰지 않고 `features/*/api/mappers.ts`에서 검증·변환한 도메인 타입만 쓴다. 쓸 수 없는 응답은 `null`로 걸러 오류 화면으로 보낸다. 모르는 카테고리는 기타로, 모르는 공개 상태는 거른다(모를 땐 비공개 쪽이 안전).
- 브라우저는 같은 출처 `/api/*`만 부른다. `next.config.ts`의 `rewrites`가 `API_PROXY_TARGET`(기본 `localhost:8080`)으로 넘긴다. 그래서 CORS 설정이 필요 없다.
- 목 모드에서 계정 상태는 주소에 `?mockRole=guest|member|suspended|admin`을 붙여 바꾼다(sessionStorage 유지). 개발·E2E 전용이다.
- 선택지 `position`은 0일 수 있다. 존재 여부는 `=== null`/`typeof`로 판단하고 `!position`으로 판단하지 않는다.
- 같은 규칙을 두 곳에 쓰지 않는다. API 값 보정(`toCategory`, `toDate`)은 `poll/model/parse.ts`가 소유하고 다른 feature는 `index.ts`로 가져다 쓴다. 여러 feature가 함께 아는 쿼리 키 접두사는 `shared/api/query-keys.ts`에 둔다.
- 오류는 `ApiError`(서버가 거절), `NetworkError`(서버에 닿지 못함)로 구분한다. 일반 `TypeError`는 코드 버그이므로 네트워크 문구로 안내하지 않는다.

## Next 16 규칙 (cacheComponents 사용 중)

- 동적 경로(`p/[id]`)의 `await params`와 `useSearchParams()`는 `<Suspense>` 안에서 읽는다. 아니면 빌드가 막힌다. (예: `app/p/[id]/page.tsx`, `app/(tabs)/page.tsx`)
- `aria-disabled`지만 눌림을 받는 버튼("이 답장 보내기")은 Playwright에서 `click({ force: true })`로 누른다.

## 백엔드 계약 대기 (화면은 현재 값으로 대체)

- 목록 응답에 내 참여 여부(`myChoice`) 없음 → 피드의 "참여 완료" pill이 뜨지 않는다 (`FeedItem.joined`는 항상 false).
- 상세 응답에 작성자 여부(`mine`) 없음 → `⋯` 메뉴(삭제/신고 구분)는 4단계에서 연결한다.
- 모든 응답 필드에 `required` 없음 → 매퍼가 방어한다. 서버가 required를 명시하면 `pnpm api:sync` 후 매퍼를 단순화한다.

## 스타일 규칙

- 색·라운드·간격은 `@theme` 토큰만 사용한다. hex 값 직접 사용 금지.
- 폰트 굵기는 800/700/400만. 아이콘은 라인 아이콘, 이모지 금지.
- 모션은 README 값을 따르고 `prefers-reduced-motion`에서 translate/scale을 제거한다.
- 접근성: 실제 `<button>`, 시트 focus trap + ESC, 토스트 `aria-live="polite"`. 화면이 바뀌며 누른 요소가 사라지면(예: 투표 후 선택지) 포커스를 새 영역의 제목으로 옮긴다.
- 화면에 보이는 문구는 컴포넌트에 직접 쓰지 않는다. 토스트·오류는 `shared/lib/messages.ts`, 화면 문구는 각 feature의 `copy.ts`에 두고 README 원문과 글자 단위로 맞춘다. README에 없는 문구는 표시해 두고 보고한다.

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
- 단계가 끝나면 `/stage-review <단계 이름>`을 실행한다. verify·build 확인 후 `code-reviewer`(결합도·응집도·가독성·성능·장애 대응)와, UI가 바뀐 경우 `design-fidelity-checker`(README 토큰·치수·모션·문구 대조)를 호출하고, 종합 보고 후 멈춘다.
- 에이전트·스킬 파일은 세션 시작 시 로드된다. 새로 만들었거나 고친 직후에는 새 세션에서 쓴다.
- 생성된 API 타입은 필드가 모두 optional이다(명세에 required 없음). 값을 쓰기 전에 없을 수 있음을 처리하고, 백엔드가 required를 명시하면 `pnpm api:sync` 후 정리한다.
