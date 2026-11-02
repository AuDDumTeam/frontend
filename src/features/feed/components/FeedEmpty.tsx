import { CATEGORY_LABEL, type PollCategory } from "@/features/poll";
import { Button } from "@/shared/ui/Button";
import { Yolk } from "@/shared/ui/Yolk";

import { emptyWithCategory, FEED_COPY } from "../copy";

/** 필터 결과가 0일 때: "아직 {카테고리} 고민이 없어요" + 전체 보기. 필터가 없으면 문구만 보여준다. */
export function FeedEmpty({
  category,
  onClear,
}: {
  category: PollCategory | null;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 pt-11 pb-5 text-center">
      <Yolk name="wonder" size={120} />
      <div className="tracking-title text-[18px] font-extrabold">
        {category ? emptyWithCategory(CATEGORY_LABEL[category]) : FEED_COPY.empty}
      </div>
      {category && (
        <Button size="pill-sm" variant="soft" className="mt-2" onClick={onClear}>
          {FEED_COPY.showAll}
        </Button>
      )}
    </div>
  );
}
