import { Button } from "@/shared/ui/Button";

import { MY_COPY } from "../copy";

/** 다음 페이지가 있을 때만 "더 보기"를 보여준다. */
export function LoadMore({
  hasNext,
  loading,
  onClick,
}: {
  hasNext: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  if (!hasNext) return null;
  return (
    <div className="mt-5 flex justify-center">
      <Button size="pill" variant="soft" disabled={loading} onClick={onClick}>
        {MY_COPY.more}
      </Button>
    </div>
  );
}
