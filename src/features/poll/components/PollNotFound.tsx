import Link from "next/link";

import { buttonStyles } from "@/shared/ui/Button";
import { Yolk } from "@/shared/ui/Yolk";

import { POLL_COPY } from "../copy";

/** 없거나 삭제된 고민(숨김 처리된 타인의 글 포함). */
export function PollNotFound() {
  return (
    <div className="animate-up mt-17.5 flex flex-col items-center gap-2.5 text-center">
      <Yolk name="sad" size={150} />
      <h1 className="tracking-title text-[22px] font-extrabold">
        {POLL_COPY.notFound.title}
      </h1>
      <p className="text-muted text-[14px]">{POLL_COPY.notFound.hint}</p>
      <Link href="/" className={buttonStyles({ size: "md", className: "mt-3 w-42.5" })}>
        {POLL_COPY.notFound.home}
      </Link>
    </div>
  );
}
