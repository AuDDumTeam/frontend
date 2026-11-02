import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type Variant = "primary" | "secondary" | "peach" | "danger" | "kakao";

/**
 * cta     58px · radius 20 · 하단 고정 CTA, 시트 주 버튼
 * lg      54px · radius 18 · 시트 취소/확인, 관리자 처리 버튼
 * md      52px · radius 18 · 카카오 버튼(내 고민), 투표 못 찾음 "홈으로"
 * pill    46px · pill      · "더 보기"
 * pill-sm 44px · pill      · "전체 보기"
 */
type Size = "cta" | "lg" | "md" | "pill" | "pill-sm";

const VARIANT: Record<Variant, string> = {
  primary: "bg-ink text-bg",
  secondary: "bg-surface text-ink",
  peach: "bg-peach-2 text-ink",
  danger: "bg-danger text-surface",
  kakao: "bg-kakao text-ink",
};

const SIZE: Record<Size, string> = {
  cta: "h-14.5 rounded-cta text-[16px]",
  lg: "h-13.5 rounded-control text-[15px]",
  md: "h-13 rounded-control text-[15px]",
  pill: "h-11.5 rounded-pill px-6 text-[13.5px]",
  "pill-sm": "h-11 rounded-pill px-6 text-[13.5px]",
};

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  /**
   * 비활성처럼 보이지만 눌림은 받는다. (예: 선택 전 "이 답장 보내기" → 눌러도 안내 토스트)
   * 실제로 막아야 하면 HTML disabled 를 쓴다.
   */
  inactive?: boolean;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  size = "cta",
  inactive = false,
  fullWidth = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      aria-disabled={inactive || undefined}
      className={cn(
        "press inline-flex cursor-pointer items-center justify-center font-extrabold",
        "disabled:cursor-not-allowed",
        SIZE[size],
        inactive ? "bg-track text-muted" : VARIANT[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
}
