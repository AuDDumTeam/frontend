import { cn } from "@/shared/lib/cn";

type ChoiceBubbleProps = {
  content: string;
  selected: boolean;
  /** 정지 계정: 흐리게 보이고, 눌러도 안내 토스트만 뜬다 */
  dimmed?: boolean;
  onPick: () => void;
};

/** 선택지 말풍선(오른쪽 정렬). 선택하면 어두워지고 살짝 커진다. */
export function ChoiceBubble({
  content,
  selected,
  dimmed = false,
  onPick,
}: ChoiceBubbleProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onPick}
      className={cn(
        "bubble-motion rounded-bubble max-w-[88%] origin-right cursor-pointer px-5.5 py-3.75 text-left text-[15.5px] leading-[1.4] font-bold",
        selected ? "bg-ink text-bg scale-[1.03]" : "bg-peach text-ink",
        dimmed && "opacity-50",
      )}
    >
      {content}
    </button>
  );
}
