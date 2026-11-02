"use client";

import { useState } from "react";

import { reasonLabel } from "@/features/report";
import { cn } from "@/shared/lib/cn";
import { Screen } from "@/shared/ui/AppShell";
import { ErrorState } from "@/shared/ui/ErrorState";
import { Header } from "@/shared/ui/Header";
import { Icon } from "@/shared/ui/Icon";
import { ScreenTitle } from "@/shared/ui/ScreenTitle";
import { toast } from "@/shared/ui/toast/toast-store";

import { useHandleReport, useReport } from "../api/queries";
import { ADMIN_COPY } from "../copy";
import type { ActionKind, ReportDetail } from "../model/report";
import { historyLine, isPending, statusLabel } from "../model/status";
import { AdminGate } from "./AdminGate";
import { ReportsSkeleton } from "./ReportsSkeleton";

const REASON_MAX = 200;

/** 신고 상세·처리(관리자). reportId 가 숫자가 아니면 없는 신고로 본다. */
export function ReportDetailScreen({ reportId }: { reportId: string }) {
  return (
    <AdminGate>
      <Detail reportId={Number(reportId)} />
    </AdminGate>
  );
}

function Detail({ reportId }: { reportId: number }) {
  const valid = Number.isInteger(reportId) && reportId > 0;
  const query = useReport(reportId, valid);
  const report = query.data;

  return (
    <>
      <Header backHref="/admin" />
      <Screen>
        <ScreenTitle title={ADMIN_COPY.detailTitle} />
        {!valid || (query.isError && !report) ? (
          <ErrorState onRetry={() => void query.refetch()} />
        ) : !report ? (
          <ReportsSkeleton />
        ) : (
          <Body report={report} />
        )}
      </Screen>
    </>
  );
}

const ACTIONS: { kind: ActionKind; label: string; style: string }[] = [
  { kind: "dismiss", label: ADMIN_COPY.actions.dismiss, style: "bg-surface text-ink" },
  { kind: "hide", label: ADMIN_COPY.actions.hide, style: "bg-peach-2 text-ink" },
  { kind: "delete", label: ADMIN_COPY.actions.delete, style: "bg-ink text-bg" },
];

function Body({ report }: { report: ReportDetail }) {
  const [now] = useState(() => new Date());
  const [ban, setBan] = useState(false);
  const [reason, setReason] = useState("");
  const { handle, isPending: handling } = useHandleReport(report);
  const pending = isPending(report);

  const run = (kind: ActionKind) => {
    if (reason.trim() === "") return toast(ADMIN_COPY.reasonRequired);
    handle({
      kind,
      reason: reason.trim(),
      banAuthorId: ban ? report.authorId : null,
    });
  };

  return (
    <>
      <div className="bg-surface rounded-card px-5.5 py-5">
        <p className="text-accent-text text-[13px] font-extrabold">
          {ADMIN_COPY.reasonPrefix}
          {reasonLabel(report.reason)}
        </p>
        {report.detail && (
          <p className="text-muted mt-1 text-[13px]">“{report.detail}”</p>
        )}
        <p className="text-muted mt-3 text-[12.5px]">{ADMIN_COPY.targetPrefix}</p>
        <p className="tracking-heading mt-1.5 text-[17px] leading-normal font-extrabold">
          {report.question}
        </p>
      </div>

      <p className="text-muted mt-3.5 text-[12.5px] leading-[1.6]">
        {ADMIN_COPY.autoNote}{" "}
        <b className="text-ink font-extrabold">{statusLabel(report)}</b>
      </p>

      {pending && (
        <>
          {report.authorId !== null && (
            <button
              type="button"
              role="checkbox"
              aria-checked={ban}
              onClick={() => setBan((prev) => !prev)}
              className="press mt-3.5 flex cursor-pointer items-center gap-2.5 text-[13.5px] font-bold"
            >
              <span
                aria-hidden
                className={cn(
                  "ring-handle flex size-6 items-center justify-center rounded-[8px] ring-[1.5px] ring-inset",
                  ban ? "bg-accent text-ink" : "bg-surface text-transparent",
                )}
              >
                <Icon name="check" size={14} strokeWidth={3} />
              </span>
              {ADMIN_COPY.banAuthor}
            </button>
          )}

          <input
            aria-label={ADMIN_COPY.reasonLabel}
            value={reason}
            maxLength={REASON_MAX}
            placeholder={ADMIN_COPY.reasonPlaceholder}
            onChange={(e) => setReason(e.target.value)}
            className="bg-surface rounded-control placeholder:text-faint mt-4 h-13.5 w-full px-5 text-[15px] font-bold outline-none"
          />

          <div className="mt-2.5 flex flex-col gap-2">
            {ACTIONS.map(({ kind, label, style }) => (
              <button
                key={kind}
                type="button"
                disabled={handling}
                onClick={() => run(kind)}
                className={cn(
                  "press rounded-control h-13.5 cursor-pointer text-[14.5px] font-extrabold disabled:cursor-not-allowed",
                  style,
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      {!pending && (
        <p className="bg-sand text-muted rounded-control mt-3.5 px-4.5 py-3.5 text-[13px] leading-[1.6] font-bold">
          {ADMIN_COPY.handledPrefix}
          {historyLine(report, now)}
        </p>
      )}
    </>
  );
}
