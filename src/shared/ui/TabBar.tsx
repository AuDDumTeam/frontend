"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/cn";

import { Icon, type IconName } from "./Icon";

const TABS = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/mine", label: "참여", icon: "mine" },
  { href: "/posted", label: "내 고민", icon: "posted" },
  { href: "/me", label: "프로필", icon: "profile" },
] as const satisfies readonly { href: string; label: string; icon: IconName }[];

function TabLink({ tab, active }: { tab: (typeof TABS)[number]; active: boolean }) {
  return (
    <Link
      href={tab.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "press flex h-full flex-col items-center justify-center gap-0.5",
        active ? "text-ink" : "text-faint",
      )}
    >
      <Icon name={tab.icon} strokeWidth={active ? 2 : 1.7} />
      <span className="text-[11px] font-bold">{tab.label}</span>
    </Link>
  );
}

/**
 * 하단 탭바: 홈 · 참여 · (+) · 내 고민 · 프로필.
 * + 버튼은 이동 대신 onPlus 를 호출한다 (비회원이면 로그인 시트를 띄워야 하기 때문).
 */
export function TabBar({ onPlus }: { onPlus: () => void }) {
  const pathname = usePathname();
  // 경로 구간 단위로 비교한다. ("/me" 가 "/memo" 에서 활성으로 잡히지 않도록)
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  const [home, mine, posted, profile] = TABS;

  return (
    <nav
      aria-label="하단 탭"
      className="animate-cta flex-none px-3.5 pt-1.5 pb-[max(1.125rem,env(safe-area-inset-bottom))]"
    >
      <div className="rounded-tabbar bg-surface shadow-tabbar grid h-17 grid-cols-5 items-center">
        <TabLink tab={home} active={isActive(home.href)} />
        <TabLink tab={mine} active={isActive(mine.href)} />
        <button
          type="button"
          onClick={onPlus}
          aria-label="고민 쓰기"
          className="press bg-accent border-bg text-ink rounded-pill -mt-5 flex size-14.5 cursor-pointer items-center justify-center justify-self-center border-[5px]"
        >
          <Icon name="plus" size={26} strokeWidth={2.4} />
        </button>
        <TabLink tab={posted} active={isActive(posted.href)} />
        <TabLink tab={profile} active={isActive(profile.href)} />
      </div>
    </nav>
  );
}
