import { CATEGORY_LABEL, POLL_CATEGORIES, type PollCategory } from "@/features/poll";
import { Chip } from "@/shared/ui/Chip";

import { FEED_COPY } from "../copy";

type CategoryChipsProps = {
  /** null 이면 "전체" */
  selected: PollCategory | null;
  onSelect: (category: PollCategory | null) => void;
};

/** 가로로 스크롤되는 카테고리 필터. */
export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  return (
    <div
      role="group"
      aria-label={FEED_COPY.categoryGroup}
      className="-mx-5 flex scrollbar-none gap-2 overflow-x-auto px-5 pb-2"
    >
      <Chip selected={selected === null} onClick={() => onSelect(null)}>
        {FEED_COPY.all}
      </Chip>
      {POLL_CATEGORIES.map((category) => (
        <Chip
          key={category}
          selected={selected === category}
          onClick={() => onSelect(category)}
        >
          {CATEGORY_LABEL[category]}
        </Chip>
      ))}
    </div>
  );
}
