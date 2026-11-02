import type { PollCategory } from "@/features/poll";

import { WRITE_ERRORS } from "../copy";

export const QUESTION_MAX = 500;
export const OPTION_MAX = 50;
export const OPTIONS_MIN = 2;
export const OPTIONS_LIMIT = 5;

export const DEADLINES = [
  { value: "none", label: "없음", ms: null },
  { value: "1h", label: "1시간", ms: 60 * 60_000 },
  { value: "24h", label: "24시간", ms: 24 * 60 * 60_000 },
  { value: "3d", label: "3일", ms: 3 * 24 * 60 * 60_000 },
] as const;

export type Deadline = (typeof DEADLINES)[number]["value"];

export type WriteFormValues = {
  question: string;
  category: PollCategory | null;
  options: string[];
  deadline: Deadline;
};

export const initialWriteForm = (): WriteFormValues => ({
  question: "",
  category: null,
  options: ["", ""],
  deadline: "none",
});

/** 서버는 줄바꿈을 받지 않는다. 입력 단계에서 바로 지운다. */
export const stripLineBreaks = (text: string): string => text.replace(/[\r\n]+/g, "");

const filledOptions = (options: readonly string[]) =>
  options.map((option) => option.trim()).filter((option) => option.length > 0);

/**
 * 제출 시도 후 보여줄 오류 문구들. 순서는 화면 순서(본문 → 카테고리 → 선택지)와 같다.
 * 비어 있는 선택지 칸은 "없는 것"으로 본다. (서버가 받는 값은 채워진 선택지뿐이다)
 */
export function validateWriteForm(values: WriteFormValues): string[] {
  const errors: string[] = [];
  const question = values.question.trim();
  if (question.length < 1 || question.length > QUESTION_MAX) {
    errors.push(WRITE_ERRORS.question);
  }
  if (values.category === null) errors.push(WRITE_ERRORS.category);

  const options = filledOptions(values.options);
  if (options.length < OPTIONS_MIN) errors.push(WRITE_ERRORS.optionsMin);
  if (new Set(options).size !== options.length)
    errors.push(WRITE_ERRORS.optionsDuplicate);
  return errors;
}

export type CreatePollInput = {
  category: PollCategory;
  question: string;
  options: string[];
  closesAt?: string;
};

/**
 * 검증을 통과한 폼을 서버 요청으로 바꾼다. 검증을 통과하지 못했으면 null.
 * 마감은 "지금 + 기간"으로 계산한다. (now 를 받아 테스트에서 고정할 수 있게 한다)
 */
export function toCreateInput(
  values: WriteFormValues,
  now: Date,
): CreatePollInput | null {
  if (validateWriteForm(values).length > 0 || values.category === null) return null;

  const deadline = DEADLINES.find((d) => d.value === values.deadline);
  return {
    category: values.category,
    question: values.question.trim(),
    options: filledOptions(values.options),
    ...(deadline?.ms
      ? { closesAt: new Date(now.getTime() + deadline.ms).toISOString() }
      : {}),
  };
}
