/** 정지 계정일 때 헤더 아래에 보여주는 안내. */
export function SuspendBanner() {
  return (
    <div
      role="status"
      className="bg-suspend-bg text-suspend-fg rounded-banner mx-5 mt-1 px-4 py-3 text-[12.5px] font-bold"
    >
      이용이 정지된 계정이에요. 조회만 할 수 있어요
    </div>
  );
}
