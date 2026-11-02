import { FALLBACK_MESSAGES } from "@/shared/lib/messages";

/** 첫 목록을 불러오는 동안 자리를 잡아 둔다. (움직임 없음) */
export function MyListSkeleton() {
  return (
    <div aria-busy="true" aria-label={FALLBACK_MESSAGES.loading} role="status">
      {[0, 1, 2].map((i) => (
        <div key={i} className="border-line flex flex-col gap-3 border-b py-5">
          <div className="bg-track rounded-control h-4.5 w-full" />
          <div className="bg-track rounded-pill h-7.5 w-40" />
        </div>
      ))}
    </div>
  );
}
