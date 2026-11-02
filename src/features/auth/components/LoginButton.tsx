"use client";

import type { ComponentProps } from "react";

import { Button } from "@/shared/ui/Button";

import { AUTH_COPY } from "../copy";
import { useAuthSheetStore } from "../store/auth-sheet-store";

/** 비회원 안내(내 고민 탭, 프로필)에 놓는 카카오 버튼. 누르면 로그인 시트가 열린다. */
export function LoginButton(
  props: Omit<ComponentProps<typeof Button>, "variant" | "onClick">,
) {
  const open = useAuthSheetStore((s) => s.open);
  return (
    <Button {...props} variant="kakao" onClick={() => open("login")}>
      {AUTH_COPY.login.kakao}
    </Button>
  );
}
