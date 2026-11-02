import { LoginFailed } from "@/features/auth";
import { Screen } from "@/shared/ui/AppShell";
import { Header } from "@/shared/ui/Header";

// 카카오 로그인이 실패하면 서버가 /login/error?code=... 로 보낸다. 코드는 화면에 보이지 않는다.
export default function LoginErrorPage() {
  return (
    <>
      <Header backHref="/" />
      <Screen>
        <LoginFailed />
      </Screen>
    </>
  );
}
