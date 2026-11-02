"use client";

import { Button } from "@/shared/ui/Button";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Yolk } from "@/shared/ui/Yolk";

import { startKakaoLogin } from "../api/session";
import { AUTH_COPY } from "../copy";
import { useAuthSheetStore } from "../store/auth-sheet-store";

/** 비회원이 로그인이 필요한 동작을 눌렀을 때 뜨는 시트. */
export function LoginSheet() {
  const open = useAuthSheetStore((s) => s.sheet === "login");
  const openSheet = useAuthSheetStore((s) => s.open);
  const close = useAuthSheetStore((s) => s.close);
  const { titleLines, hint, kakao, later } = AUTH_COPY.login;

  const start = () => {
    // 목 모드에는 카카오가 없어 곧바로 신규 가입(약관) 단계로 넘어간다.
    if (startKakaoLogin() === "mock-signup") openSheet("terms");
  };

  return (
    <BottomSheet
      open={open}
      onOpenChange={(next) => !next && close()}
      titleSize="lg"
      title={
        <>
          <Yolk name="wonder" size={96} className="mx-auto mb-2 block" />
          <span className="block text-center">
            {titleLines[0]}
            <br />
            {titleLines[1]}
          </span>
        </>
      }
    >
      <p className="text-muted mt-2 mb-5.5 text-center text-[14px] leading-[1.6]">
        {hint}
      </p>
      <div className="flex flex-col gap-1.5">
        <Button variant="kakao" size="cta" fullWidth onClick={start}>
          {kakao}
        </Button>
        <button
          type="button"
          onClick={close}
          className="press text-muted h-11.5 cursor-pointer text-[14px] font-bold"
        >
          {later}
        </button>
      </div>
    </BottomSheet>
  );
}
