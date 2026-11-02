import localFont from "next/font/local";

/**
 * NanumSquareRound 자체 호스팅. 굵기는 400 / 700 / 800 세 가지만 쓴다.
 * 외부 CDN 없이 같은 도메인에서 내려주고, next/font 가 preload 와 font-display 를 처리한다.
 */
export const nanumSquareRound = localFont({
  src: [
    { path: "./fonts/NanumSquareRoundR.woff2", weight: "400", style: "normal" },
    { path: "./fonts/NanumSquareRoundB.woff2", weight: "700", style: "normal" },
    { path: "./fonts/NanumSquareRoundEB.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-nanum",
  display: "swap",
});
