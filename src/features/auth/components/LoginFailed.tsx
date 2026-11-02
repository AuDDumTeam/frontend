import Link from "next/link";

import { buttonStyles } from "@/shared/ui/Button";
import { Yolk } from "@/shared/ui/Yolk";

import { AUTH_COPY } from "../copy";

/** 카카오 로그인이 실패해 서버가 돌려보낸 화면(/login/error). 오류 코드는 노출하지 않는다. */
export function LoginFailed() {
  const { title, hint, home } = AUTH_COPY.loginFailed;
  return (
    <div role="alert" className="flex flex-col items-center gap-2 pt-11 pb-5 text-center">
      <Yolk name="sad" size={120} />
      <h1 className="tracking-title text-[18px] font-extrabold">{title}</h1>
      <p className="text-muted text-[14px]">{hint}</p>
      <Link href="/" className={buttonStyles({ size: "md", className: "mt-3 w-42.5" })}>
        {home}
      </Link>
    </div>
  );
}
