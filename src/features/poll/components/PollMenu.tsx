"use client";

import { useState } from "react";

import type { Role } from "@/features/auth";
import { ReportSheet } from "@/features/report";
import { MESSAGES } from "@/shared/lib/messages";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { toast } from "@/shared/ui/toast/toast-store";

import { useDeletePoll } from "../api/queries";
import { MENU_COPY } from "../copy";

type Sheet = "menu" | "delete" | "report" | null;

const MENU_ITEM =
  "press bg-surface rounded-control h-14.5 w-full cursor-pointer text-center text-[15.5px] font-bold";

type PollMenuProps = {
  pollId: string;
  mine: boolean;
  role: Role | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** ⋯ 메뉴: 내 글이면 삭제, 남의 글이면 신고. 삭제는 확인 시트를, 신고는 사유 시트를 거친다. */
export function PollMenu({ pollId, mine, role, open, onOpenChange }: PollMenuProps) {
  const [next, setNext] = useState<Exclude<Sheet, "menu" | null> | null>(null);
  const sheet: Sheet = open ? "menu" : next;
  const { remove, isPending } = useDeletePoll(pollId, () => setNext(null));

  // 메뉴를 닫으면서 다음 시트로 넘어간다. (시트 두 개가 동시에 열리지 않게)
  const go = (target: Exclude<Sheet, "menu" | null>) => {
    onOpenChange(false);
    setNext(target);
  };

  const askDelete = () => {
    if (role === "suspended") {
      onOpenChange(false);
      return toast(MESSAGES.account.suspended);
    }
    go("delete");
  };
  const askReport = () => {
    if (role === "suspended") {
      onOpenChange(false);
      return toast(MESSAGES.report.suspended);
    }
    go("report");
  };

  return (
    <>
      <BottomSheet
        open={sheet === "menu"}
        onOpenChange={onOpenChange}
        title={<span className="sr-only">{MENU_COPY.title}</span>}
      >
        {mine ? (
          <button
            type="button"
            className={`${MENU_ITEM} text-danger`}
            onClick={askDelete}
          >
            {MENU_COPY.delete}
          </button>
        ) : (
          <button type="button" className={MENU_ITEM} onClick={askReport}>
            {MENU_COPY.report}
          </button>
        )}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="press text-muted mt-1.5 h-11.5 w-full cursor-pointer text-center text-[14px] font-bold"
        >
          {MENU_COPY.close}
        </button>
      </BottomSheet>

      <BottomSheet
        open={sheet === "delete"}
        onOpenChange={(o) => !o && !isPending && setNext(null)}
        title={MENU_COPY.confirm.title}
      >
        <p className="text-muted mt-2 text-[14px] leading-[1.65]">
          {MENU_COPY.confirm.body}
        </p>
        <div className="mt-5 flex gap-2.5">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            disabled={isPending}
            onClick={() => setNext(null)}
          >
            {MENU_COPY.confirm.cancel}
          </Button>
          <Button
            variant="danger"
            size="lg"
            className="flex-1"
            disabled={isPending}
            onClick={() => remove()}
          >
            {MENU_COPY.confirm.confirm}
          </Button>
        </div>
      </BottomSheet>

      <ReportSheet
        pollId={pollId}
        open={sheet === "report"}
        onOpenChange={(o) => !o && setNext(null)}
      />
    </>
  );
}
