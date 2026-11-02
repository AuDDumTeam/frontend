import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // 브라우저는 같은 출처(/api/*)로만 요청하고 Next 가 백엔드로 넘긴다.
  // 그래서 CORS 설정이 필요 없고, 비회원 익명 쿠키·로그인 쿠키가 같은 출처 쿠키로 다뤄진다.
  async rewrites() {
    const target = process.env.API_PROXY_TARGET ?? "http://localhost:8080";
    return [
      { source: "/api/:path*", destination: `${target}/api/:path*` },
      // 카카오 로그인은 스프링 시큐리티 경로라 /api 밖에 있다. (시작 → 카카오 → 콜백)
      // /login/error 는 프론트 화면이므로 넘기지 않는다.
      {
        source: "/oauth2/authorization/:provider",
        destination: `${target}/oauth2/authorization/:provider`,
      },
      {
        source: "/login/oauth2/code/:provider",
        destination: `${target}/login/oauth2/code/:provider`,
      },
    ];
  },
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
