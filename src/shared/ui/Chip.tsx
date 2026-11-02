import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type ChipProps = ComponentProps<"button"> & {
  selected?: boolean;
  /** md 36px(홈 필터) / lg 38px(작성 카테고리) */
  size?: "md" | "lg";
};

export function Chip({
  selected = false,
  size = "md",
  className,
  type = "button",
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        "press rounded-pill flex-none cursor-pointer px-3.75 text-[13.5px] font-bold whitespace-nowrap",
        size === "md" ? "h-9" : "h-9.5",
        selected ? "bg-ink text-bg" : "bg-surface text-ink",
        className,
      )}
      {...props}
    />
  );
}
