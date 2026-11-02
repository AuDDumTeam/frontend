"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/cn";
import { MESSAGES } from "@/shared/lib/messages";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { toast } from "@/shared/ui/toast/toast-store";

import { useSubmitReport } from "../api/mutations";
import { REPORT_COPY } from "../copy";
import {
  checkReport,
  ETC_DETAIL_MAX,
  REPORT_REASONS,
  type ReportDraft,
} from "../model/reasons";

type ReportSheetProps = {
  pollId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** 고민 신고 시트. 닫힐 때 입력이 남지 않도록 열려 있는 동안만 폼을 마운트한다. */
export function ReportSheet({ pollId, open, onOpenChange }: ReportSheetProps) {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title={REPORT_COPY.title}>
      {open && <ReportForm pollId={pollId} onDone={() => onOpenChange(false)} />}
    </BottomSheet>
  );
}

function ReportForm({ pollId, onDone }: { pollId: string; onDone: () => void }) {
  const [draft, setDraft] = useState<ReportDraft>({ reason: null, detail: "" });
  const { submit, isPending } = useSubmitReport(pollId, onDone);

  const send = () => {
    const problem = checkReport(draft);
    if (problem === "pick-reason") return toast(MESSAGES.report.pickReason);
    if (problem === "need-detail") return toast(REPORT_COPY.etcRequired);
    if (draft.reason) submit({ reason: draft.reason, detail: draft.detail });
  };

  return (
    <>
      <div
        role="radiogroup"
        aria-label={REPORT_COPY.title}
        className="mt-3.5 flex flex-col gap-2"
      >
        {REPORT_REASONS.map(({ value, label }) => {
          const selected = draft.reason === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setDraft((prev) => ({ ...prev, reason: value }))}
              className={cn(
                "press bg-surface rounded-control flex h-13.5 w-full cursor-pointer items-center gap-3 px-5 text-left text-[15px] font-bold",
                selected && "ring-accent ring-2 ring-inset",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "bg-surface size-5 flex-none rounded-full ring-inset",
                  selected ? "ring-accent ring-[6px]" : "ring-handle ring-2",
                )}
              />
              {label}
            </button>
          );
        })}
      </div>

      {draft.reason === "ETC" && (
        <input
          aria-label={REPORT_COPY.etcPlaceholder}
          value={draft.detail}
          maxLength={ETC_DETAIL_MAX}
          placeholder={REPORT_COPY.etcPlaceholder}
          onChange={(e) => setDraft((prev) => ({ ...prev, detail: e.target.value }))}
          className="bg-surface rounded-control placeholder:text-faint mt-2 h-13.5 w-full px-5 text-[15px] font-bold outline-none"
        />
      )}

      <Button
        fullWidth
        className="mt-4"
        inactive={checkReport(draft) !== null}
        disabled={isPending}
        onClick={send}
      >
        {REPORT_COPY.submit}
      </Button>
      <p className="text-faint mt-2.5 text-center text-[12.5px]">{REPORT_COPY.note}</p>
    </>
  );
}
