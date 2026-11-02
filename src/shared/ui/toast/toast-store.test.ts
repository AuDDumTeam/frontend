import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TOAST_DURATION_MS, toast, useToastStore } from "./toast-store";

describe("toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useToastStore.getState().hide();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("문구를 보여주고 2.6초 뒤에 사라진다", () => {
    toast("답장이 전달됐어요");
    expect(useToastStore.getState().message).toBe("답장이 전달됐어요");

    vi.advanceTimersByTime(TOAST_DURATION_MS - 1);
    expect(useToastStore.getState().message).toBe("답장이 전달됐어요");

    vi.advanceTimersByTime(1);
    expect(useToastStore.getState().message).toBe("");
  });

  it("연달아 띄우면 새 문구로 바뀌고 시간이 다시 시작된다", () => {
    toast("첫 번째");
    vi.advanceTimersByTime(2000);

    toast("두 번째");
    vi.advanceTimersByTime(2000); // 첫 번째 기준이면 이미 사라졌을 시간
    expect(useToastStore.getState().message).toBe("두 번째");

    vi.advanceTimersByTime(600);
    expect(useToastStore.getState().message).toBe("");
  });

  it("같은 문구를 다시 띄워도 id 가 바뀌어 모션이 다시 재생된다", () => {
    toast("같은 문구");
    const first = useToastStore.getState().id;
    toast("같은 문구");
    expect(useToastStore.getState().id).toBe(first + 1);
  });
});
