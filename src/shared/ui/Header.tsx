import Link from "next/link";

import { Icon } from "./Icon";
import { Yolk } from "./Yolk";

type HeaderProps = {
  /** 있으면 뒤로가기 버튼, 없으면 홈 로고 "어떰?" */
  backHref?: string;
  /** 있으면 우측에 ⋯ 메뉴 버튼 (상세 화면) */
  onMenu?: () => void;
};

export function Header({ backHref, onMenu }: HeaderProps) {
  return (
    <header className="mt-1.5 flex h-13 flex-none items-center px-3.5">
      {backHref ? (
        <Link
          href={backHref}
          aria-label="뒤로가기"
          className="press flex size-11 items-center justify-center"
        >
          <Icon name="back" size={26} />
        </Link>
      ) : (
        <span className="tracking-logo pl-1.5 text-[24px] font-extrabold">어떰?</span>
      )}

      <div className="ml-auto flex items-center">
        {onMenu && (
          <button
            type="button"
            onClick={onMenu}
            aria-label="메뉴"
            className="press flex size-11 cursor-pointer items-center justify-center"
          >
            <Icon name="more" />
          </button>
        )}
        <Yolk name="happy" size={34} className="mr-1.5" />
      </div>
    </header>
  );
}
