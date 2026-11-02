"use client";

import { useWithdraw } from "@/features/auth";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";

import { MY_COPY } from "../copy";

/** 탈퇴 확인 시트. 탈퇴하면 비회원이 되고, 처리 중에는 닫기·중복 제출을 막는다. */
export function WithdrawSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { withdraw, isPending } = useWithdraw(() => onOpenChange(false));
  const { title, body, cancel, confirm } = MY_COPY.withdraw;

  return (
    <BottomSheet
      open={open}
      onOpenChange={(next) => !isPending && onOpenChange(next)}
      title={title}
    >
      <p className="text-muted mt-2 text-[14px] leading-[1.7]">{body}</p>
      <div className="mt-5 flex gap-2.5">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          disabled={isPending}
          onClick={() => onOpenChange(false)}
        >
          {cancel}
        </Button>
        <Button
          variant="danger"
          size="lg"
          className="flex-1"
          disabled={isPending}
          onClick={() => withdraw()}
        >
          {confirm}
        </Button>
      </div>
    </BottomSheet>
  );
}
