/** 탭 화면의 큰 제목(800 30)과 선택적 부제. 홈·상세를 제외한 화면이 쓴다. */
export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="pt-0.5 pb-3.5">
      <h1 className="tracking-head text-[30px] leading-[1.3] font-extrabold whitespace-nowrap">
        {title}
      </h1>
      {subtitle && <p className="text-muted mt-1.5 text-[14px]">{subtitle}</p>}
    </div>
  );
}
