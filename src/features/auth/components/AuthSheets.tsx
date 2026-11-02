"use client";

import { LoginSheet } from "./LoginSheet";
import { TermsSheet } from "./TermsSheet";

/** 로그인·약관 시트를 앱 전체에서 한 번만 띄워 둔다. (루트 레이아웃에 둔다) */
export function AuthSheets() {
  return (
    <>
      <LoginSheet />
      <TermsSheet />
    </>
  );
}
