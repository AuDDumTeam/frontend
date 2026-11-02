import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    // msw/browser 는 node 조건이 null 이라 SSR 번들에서 해석에 실패한다 → 서버에서는 스텁으로 대체
    resolveAlias: {
      "msw/browser": {
        browser: "msw/browser",
        default: "./src/shared/api/mocks/msw-browser-stub.ts",
      },
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
