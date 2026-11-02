type ClassValue = string | false | null | undefined;

/** 조건부 클래스를 이어 붙인다. */
export const cn = (...values: ClassValue[]): string => values.filter(Boolean).join(" ");
