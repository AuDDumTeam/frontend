"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type BottomSheetProps = {
  open: boolean;
  /** 딤 탭, ESC, 닫기 동작 모두 이 콜백으로 들어온다 */
  onOpenChange: (open: boolean) => void;
  /** 스크린리더용 제목. 시각적으로 보이게 하려면 title 을 넘긴다 */
  title: ReactNode;
  titleSize?: "md" | "lg";
  children: ReactNode;
};

/**
 * 하단 시트. focus trap, ESC 닫기, 포커스 복귀, 스크롤 잠금은 Radix Dialog 가 처리하고
 * 모양과 모션(딤 fade .2s, 시트 translateY .3s)만 우리 토큰으로 입힌다.
 */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  titleSize = "md",
  children,
}: BottomSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-ink/42 animate-fade fixed inset-0 z-40" />
        <Dialog.Content
          aria-describedby={undefined}
          className="rounded-t-sheet bg-bg animate-sheet fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88dvh] w-full max-w-110 overflow-y-auto px-6 pt-3 pb-8.5 outline-none"
        >
          <div
            className="bg-handle rounded-pill mx-auto mb-4.5 h-1.25 w-10"
            aria-hidden
          />
          <Dialog.Title
            className={cn(
              "tracking-title leading-[1.4] font-extrabold",
              titleSize === "lg" ? "text-[24px]" : "text-[22px]",
            )}
          >
            {title}
          </Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
