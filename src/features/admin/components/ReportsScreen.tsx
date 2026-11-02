"use client";

import Link from "next/link";

import { reasonLabel } from "@/features/report";
import { getErrorMessage } from "@/shared/lib/error-messages";
import { cn } from "@/shared/lib/cn";
import { Screen } from "@/shared/ui/AppShell";
import { ErrorState } from "@/shared/ui/ErrorState";
import { Header } from "@/shared/ui/Header";
import { LoadMore } from "@/shared/ui/LoadMore";
import { ScreenTitle } from "@/shared/ui/ScreenTitle";
import { toast } from "@/shared/ui/toast/toast-store";

import { useReports } from "../api/queries";
import { ADMIN_COPY } from "../copy";
import type { ReportRow } from "../model/report";
import { isPending, statusLabel } from "../model/status";
import { AdminGate } from "./AdminGate";
import { ReportsSkeleton } from "./ReportsSkeleton";

function Row({ report }: { report: ReportRow }) {
  return (
    <Link
      href={`/admin/${report.id}`}
      className="press border-line flex w-full flex-col gap-2 border-b py-5 text-left"
    >
      <span className="flex w-full text-[13px] font-extrabold">
        <span className="text-accent-text">{reasonLabel(report.reason)}</span>
        <span className="flex-1" />
        <span className={cn(isPending(report) ? "text-danger" : "text-muted")}>
          {statusLabel(report)}
        </span>
      </span>
      <span className="tracking-heading text-[16px] leading-normal font-extrabold">
        {report.question}
      </span>
    </Link>
  );
}

/** 신고 검토 목록(관리자). 처리 대기 신고를 접수 순으로 보여준다. */
export function ReportsScreen() {
  return (
    <AdminGate>
      <ReportsList />
    </AdminGate>
  );
}

function ReportsList() {
  const query = useReports(true);
  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  const loadMore = async () => {
    const result = await query.fetchNextPage();
    if (result.isError) toast(getErrorMessage(result.error, "admin"));
  };

  return (
    <>
      <Header />
      <Screen>
        <ScreenTitle title={ADMIN_COPY.listTitle} />
        {query.isPending ? (
          <ReportsSkeleton />
        ) : query.isError && !query.data ? (
          <ErrorState onRetry={() => void query.refetch()} />
        ) : items.length === 0 ? (
          <p className="text-muted pt-10 text-center text-[15px] font-bold">
            {ADMIN_COPY.empty}
          </p>
        ) : (
          <>
            <div className="flex flex-col">
              {items.map((report) => (
                <Row key={report.id} report={report} />
              ))}
            </div>
            {query.hasNextPage && (
              <LoadMore
                loading={query.isFetchingNextPage}
                onClick={() => void loadMore()}
              />
            )}
          </>
        )}
      </Screen>
    </>
  );
}
