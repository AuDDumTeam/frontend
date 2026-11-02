"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { MY_KEY_PREFIX } from "@/shared/api/query-keys";
import { cn } from "@/shared/lib/cn";
import { MESSAGES } from "@/shared/lib/messages";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";
import { toast } from "@/shared/ui/toast/toast-store";

import { completeSignup } from "../api/session";
import { AUTH_COPY } from "../copy";
import { meKey } from "../hooks/useMe";
import {
  canJoin,
  emptyTermsChecks,
  type TermsChecks,
  type TermsId,
} from "../model/terms";
import { useAuthSheetStore } from "../store/auth-sheet-store";

/** 처음 로그인한 사람이 필수 약관 두 개에 동의하면 가입이 끝난다. */
export function TermsSheet() {
  const open = useAuthSheetStore((s) => s.sheet === "terms");
  const close = useAuthSheetStore((s) => s.close);
  const { titleLines, required, submit } = AUTH_COPY.terms;

  return (
    <BottomSheet
      open={open}
      onOpenChange={(next) => !next && close()}
      titleSize="lg"
      title={
        <>
          {titleLines[0]}
          <br />
          {titleLines[1]}
        </>
      }
    >
      {/* 시트가 닫힐 때 체크 상태가 남지 않도록, 열려 있는 동안만 내용을 마운트한다 */}
      {open && <TermsForm required={required} submitLabel={submit} onDone={close} />}
    </BottomSheet>
  );
}

type TermsFormProps = {
  required: readonly { id: TermsId; label: string }[];
  submitLabel: string;
  onDone: () => void;
};

function TermsForm({ required, submitLabel, onDone }: TermsFormProps) {
  const queryClient = useQueryClient();
  const [checks, setChecks] = useState<TermsChecks>(emptyTermsChecks);
  const ready = canJoin(checks);

  const toggle = (id: TermsId) => setChecks((prev) => ({ ...prev, [id]: !prev[id] }));

  const join = () => {
    if (!ready) return;
    completeSignup();
    void queryClient.invalidateQueries({ queryKey: meKey });
    // 비회원일 때 보던 참여 목록이 회원 화면에 남지 않게 한다. (서버가 기록을 옮길 수도 있다)
    void queryClient.invalidateQueries({ queryKey: MY_KEY_PREFIX });
    toast(MESSAGES.account.joined);
    onDone();
  };

  return (
    <>
      <ul className="mt-4.5 mb-5 flex flex-col gap-2">
        {required.map(({ id, label }) => (
          <li key={id}>
            <button
              type="button"
              role="checkbox"
              aria-checked={checks[id]}
              onClick={() => toggle(id)}
              className="press bg-surface rounded-control flex h-14 w-full cursor-pointer items-center gap-3 px-5 text-left text-[15px] font-bold"
            >
              <span
                aria-hidden
                className={cn(
                  "rounded-pill text-surface flex size-5.5 flex-none items-center justify-center transition-colors",
                  checks[id] ? "bg-accent" : "bg-track",
                )}
              >
                <Icon name="check" size={13} strokeWidth={3} />
              </span>
              {label}
            </button>
          </li>
        ))}
      </ul>
      <Button fullWidth inactive={!ready} onClick={join}>
        {submitLabel}
      </Button>
    </>
  );
}
