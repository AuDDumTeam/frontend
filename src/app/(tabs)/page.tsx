import { Header } from "@/shared/ui/Header";
import { Screen } from "@/shared/ui/AppShell";

// 2단계에서 홈 화면(features/feed)으로 교체한다.
export default function HomePage() {
  return (
    <>
      <Header />
      <Screen>
        <h1 className="tracking-head text-[28px] leading-[1.35] font-extrabold">
          오늘은 어떤 고민에
          <br />
          답장해볼까요?
        </h1>
      </Screen>
    </>
  );
}
