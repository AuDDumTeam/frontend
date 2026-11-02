import { Suspense } from "react";

import { ReportDetailScreen } from "@/features/admin";
import { Header } from "@/shared/ui/Header";

// 동적 경로의 params 는 요청 시점에 정해지므로 Suspense 경계 안에서 읽는다.
export default function AdminReportPage({ params }: PageProps<"/admin/[reportId]">) {
  return (
    <Suspense fallback={<Header backHref="/admin" />}>
      <ReportContent params={params} />
    </Suspense>
  );
}

async function ReportContent({ params }: Pick<PageProps<"/admin/[reportId]">, "params">) {
  const { reportId } = await params;
  return <ReportDetailScreen reportId={reportId} />;
}
