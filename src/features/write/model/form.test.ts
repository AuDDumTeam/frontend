import { describe, expect, it } from "vitest";

import { WRITE_ERRORS } from "../copy";
import {
  initialWriteForm,
  stripLineBreaks,
  toCreateInput,
  validateWriteForm,
  type WriteFormValues,
} from "./form";

const valid = (patch: Partial<WriteFormValues> = {}): WriteFormValues => ({
  question: "읽씹 3시간 뒤 답장, 관심 없는 걸까요?",
  category: "SOME",
  options: ["관심 없음", "바빴을 수도"],
  deadline: "none",
  ...patch,
});

describe("validateWriteForm", () => {
  it("처음 상태는 본문·카테고리·선택지 오류를 화면 순서대로 낸다", () => {
    expect(validateWriteForm(initialWriteForm())).toEqual([
      WRITE_ERRORS.question,
      WRITE_ERRORS.category,
      WRITE_ERRORS.optionsMin,
    ]);
  });

  it("올바른 입력이면 오류가 없다", () => {
    expect(validateWriteForm(valid())).toEqual([]);
  });

  it("공백뿐인 본문은 비어 있는 것으로 본다", () => {
    expect(validateWriteForm(valid({ question: "   " }))).toEqual([
      WRITE_ERRORS.question,
    ]);
  });

  it("본문은 500자까지 허용하고 501자부터 오류다", () => {
    expect(validateWriteForm(valid({ question: "가".repeat(500) }))).toEqual([]);
    expect(validateWriteForm(valid({ question: "가".repeat(501) }))).toEqual([
      WRITE_ERRORS.question,
    ]);
  });

  it("비어 있는 선택지 칸은 개수에 세지 않는다", () => {
    expect(validateWriteForm(valid({ options: ["하나", " ", ""] }))).toEqual([
      WRITE_ERRORS.optionsMin,
    ]);
  });

  it("앞뒤 공백을 지운 뒤 같으면 중복이다", () => {
    expect(validateWriteForm(valid({ options: ["같음", " 같음 "] }))).toEqual([
      WRITE_ERRORS.optionsDuplicate,
    ]);
  });
});

describe("stripLineBreaks", () => {
  it("줄바꿈을 모두 지운다", () => {
    expect(stripLineBreaks("가\n나\r\n다")).toBe("가나다");
  });
});

describe("toCreateInput", () => {
  const now = new Date("2026-11-02T00:00:00.000Z");

  it("검증에 실패하면 null", () => {
    expect(toCreateInput(initialWriteForm(), now)).toBeNull();
  });

  it("마감 없음이면 closesAt 을 보내지 않는다", () => {
    expect(toCreateInput(valid(), now)).toEqual({
      category: "SOME",
      question: "읽씹 3시간 뒤 답장, 관심 없는 걸까요?",
      options: ["관심 없음", "바빴을 수도"],
    });
  });

  it("공백을 다듬고 빈 선택지를 뺀다", () => {
    const input = toCreateInput(
      valid({ question: "  질문  ", options: [" 가 ", "", "나"] }),
      now,
    );
    expect(input?.question).toBe("질문");
    expect(input?.options).toEqual(["가", "나"]);
  });

  it.each([
    ["1h", "2026-11-02T01:00:00.000Z"],
    ["24h", "2026-11-03T00:00:00.000Z"],
    ["3d", "2026-11-05T00:00:00.000Z"],
  ] as const)("마감 %s 는 지금 + 기간이다", (deadline, expected) => {
    expect(toCreateInput(valid({ deadline }), now)?.closesAt).toBe(expected);
  });
});
