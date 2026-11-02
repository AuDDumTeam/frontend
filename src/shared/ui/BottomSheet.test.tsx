import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BottomSheet } from "./BottomSheet";

function setup(open = true) {
  const onOpenChange = vi.fn();
  render(
    <BottomSheet open={open} onOpenChange={onOpenChange} title="이 고민을 삭제할까요?">
      <button type="button">삭제</button>
    </BottomSheet>,
  );
  return { onOpenChange };
}

describe("BottomSheet", () => {
  it("열려 있으면 제목과 내용을 대화상자로 보여준다", () => {
    setup();
    expect(
      screen.getByRole("dialog", { name: "이 고민을 삭제할까요?" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
  });

  it("닫혀 있으면 아무것도 그리지 않는다", () => {
    setup(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("ESC 를 누르면 닫기를 요청한다", async () => {
    const { onOpenChange } = setup();
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
