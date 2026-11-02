import { cn } from "@/shared/lib/cn";

// 24 viewBox 라인 아이콘. 프로토타입의 path 를 그대로 옮겼다. 이모지는 쓰지 않는다.
const PATHS = {
  home: "M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z",
  mine: "M5 5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M8.5 11.5l2.5 2.5 4.5-5",
  posted: "M6 3h8l5 5v13H6z M14 3v5h5 M9 13h7 M9 17h5",
  profile: "M8 8a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M4 21c0-4 3.6-6 8-6s8 2 8 6",
  plus: "M12 5v14M5 12h14",
  back: "m15 5-7 7 7 7",
  next: "m9 5 7 7-7 7",
  check: "m5 12.5 4.5 4.5L19 7.5",
  close: "M6 6l12 12M18 6 6 18",
} as const;

export type IconName = keyof typeof PATHS | "more";

type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export function Icon({ name, size = 24, strokeWidth = 2, className }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    className: cn("block flex-none", className),
  };

  // 더보기(⋯)는 선이 아니라 채운 점 세 개
  if (name === "more") {
    return (
      <svg {...common} fill="currentColor">
        <circle cx="5" cy="12" r="1.8" />
        <circle cx="12" cy="12" r="1.8" />
        <circle cx="19" cy="12" r="1.8" />
      </svg>
    );
  }

  return (
    <svg
      {...common}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
