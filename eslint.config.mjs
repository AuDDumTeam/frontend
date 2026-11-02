import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

/**
 * 의존 규칙 (CLAUDE.md "폴더 구조와 의존 규칙")
 *   shared ← features ← app  (한 방향)
 *   feature 끼리는 서로의 index.ts 로만 접근한다.
 */
const boundaryConfig = {
  files: ["src/**/*.{ts,tsx}"],
  plugins: { boundaries },
  settings: {
    "import/resolver": { typescript: { alwaysTryTypes: true } },
    "boundaries/elements": [
      { type: "app", pattern: "src/app" },
      { type: "feature", pattern: "src/features/*", capture: ["featureName"] },
      { type: "shared", pattern: "src/shared" },
    ],
  },
  rules: {
    "boundaries/dependencies": [
      2,
      {
        default: "disallow",
        policies: [
          // app: 같은 app, shared, feature 의 공개 API(index.ts)
          {
            from: { element: { type: "app" } },
            allow: {
              to: { element: { types: { anyOf: ["app", "shared"] } } },
            },
          },
          {
            from: { element: { type: "app" } },
            allow: {
              to: { element: { type: "feature", fileInternalPath: "index.ts" } },
            },
            message: "app 은 feature 의 index.ts 로만 접근할 수 있어요",
          },
          // feature: shared, 자기 자신, 다른 feature 의 공개 API
          {
            from: { element: { type: "feature" } },
            allow: { to: { element: { type: "shared" } } },
          },
          {
            from: { element: { type: "feature" } },
            allow: {
              to: {
                element: {
                  type: "feature",
                  captured: {
                    featureName: "{{from.element.captured.featureName}}",
                  },
                },
              },
            },
          },
          {
            from: { element: { type: "feature" } },
            allow: {
              to: { element: { type: "feature", fileInternalPath: "index.ts" } },
            },
            message: "다른 feature 는 index.ts 로만 접근할 수 있어요",
          },
          // shared: shared 안에서만 (feature·app 을 알면 안 된다)
          {
            from: { element: { type: "shared" } },
            allow: { to: { element: { type: "shared" } } },
          },
        ],
      },
    ],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  boundaryConfig,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 디자인 레퍼런스는 읽기 전용이며 검사 대상이 아니다
    "design_handoff_auddum_app/**",
    // MSW 가 복사해 둔 워커 스크립트 (수정 금지)
    "public/mockServiceWorker.js",
    // 자동 생성 코드
    "src/shared/api/generated/**",
  ]),
]);

export default eslintConfig;
