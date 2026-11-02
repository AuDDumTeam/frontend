import { defineConfig } from "orval";

// 백엔드 OpenAPI 명세에서 타입·호출 함수·TanStack Query 훅·MSW 목 핸들러를 생성한다.
// 명세는 복사하지 않고 직접 읽는다. 기본값은 옆 저장소의 생성 파일이고,
// 서버 주소를 쓰려면 OPENAPI_SPEC=http://localhost:8080/v3/api-docs pnpm api:sync
// 생성 결과(src/shared/api/generated)는 직접 수정하지 않는다. 바꾸려면 백엔드 또는 이 설정을 고친다.
const SPEC = process.env.OPENAPI_SPEC ?? "../AuDDum/docs/generated/openapi.json";

export default defineConfig({
  auddum: {
    input: SPEC,
    output: {
      // 백엔드 태그가 한글이라 tags-split 은 한글 파일명을 만든다 → 영문 단일 파일로 생성
      mode: "split",
      target: "src/shared/api/generated/auddum.ts",
      schemas: "src/shared/api/generated/model",
      client: "react-query",
      httpClient: "fetch",
      mock: true,
      clean: true,
      override: {
        mutator: {
          path: "src/shared/api/fetcher.ts",
          name: "customFetch",
        },
      },
    },
  },
});
