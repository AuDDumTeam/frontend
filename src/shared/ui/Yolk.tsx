import Image from "next/image";

export type YolkName =
  | "base"
  | "happy" // 헤더·프로필
  | "wonder" // 빈 상태·로그인
  | "sad" // 없는 글
  | "love"
  | "shy"
  | "surprise"
  | "think"
  | "duo"
  | "duo-love";

/** 캐릭터 "어떰이". 장식용이라 대체 텍스트는 비워 둔다. */
export function Yolk({
  name,
  size,
  className,
}: {
  name: YolkName;
  size: number;
  className?: string;
}) {
  return (
    <Image
      src={`/yolk/yolk-${name}.svg`}
      alt=""
      width={size}
      height={size}
      unoptimized
      className={className}
    />
  );
}
