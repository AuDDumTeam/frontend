import { Button } from "./Button";

/** 목록 아래 "더 보기" 버튼. 다음 페이지가 있을 때만 호출하는 쪽이 렌더한다. */
export function LoadMore({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <div className="mt-5 flex justify-center">
      <Button size="pill" variant="soft" disabled={loading} onClick={onClick}>
        더 보기
      </Button>
    </div>
  );
}
