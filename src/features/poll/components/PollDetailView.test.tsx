import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Role } from "@/features/auth";
import { useToastStore } from "@/shared/ui/toast/toast-store";

import type { Poll } from "../model/poll";
import { PollDetailView } from "./PollDetailView";

const poll = (overrides: Partial<Poll> = {}): Poll => ({
  id: "p1",
  category: "SOME",
  question: "답장이 늦는 건 관심이 없다는 뜻일까요?",
  participantCount: 292,
  closed: false,
  closesAt: null,
  status: "PUBLIC",
  options: [
    { position: 0, content: "그런 편이에요" },
    { position: 1, content: "바빠서일 수도 있어요" },
    { position: 2, content: "직접 물어봐요" },
  ],
  myChoice: null,
  result: null,
  mine: false,
  ...overrides,
});

function setup(p: Poll, role: Role | undefined = "member") {
  const onVote = vi.fn();
  render(<PollDetailView poll={p} role={role} submitting={false} onVote={onVote} />);
  return { onVote };
}

const toastMessage = () => useToastStore.getState().message;
const sendButton = () => screen.getByRole("button", { name: "이 답장 보내기" });

beforeEach(() => useToastStore.getState().hide());

describe("투표 화면 (미참여 + 진행 중)", () => {
  it("안내와 선택지, 제출 버튼을 보여준다", () => {
    setup(poll());
    expect(screen.getByText("하나 골라 답장하면 결과가 보여요")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(3);
    expect(sendButton()).toBeInTheDocument();
  });

  it("고르지 않고 보내면 안내 토스트만 뜨고 제출하지 않는다", async () => {
    const { onVote } = setup(poll());
    await userEvent.click(sendButton());
    expect(toastMessage()).toBe("답장을 하나 골라주세요");
    expect(onVote).not.toHaveBeenCalled();
  });

  it("선택지를 고르고 보내면 그 선택지의 position 으로 제출한다", async () => {
    const { onVote } = setup(poll());
    await userEvent.click(screen.getByRole("button", { name: "바빠서일 수도 있어요" }));
    await userEvent.click(sendButton());
    expect(onVote).toHaveBeenCalledWith(1);
  });

  it("position 이 0인 선택지도 제출된다", async () => {
    const { onVote } = setup(poll());
    await userEvent.click(screen.getByRole("button", { name: "그런 편이에요" }));
    await userEvent.click(sendButton());
    expect(onVote).toHaveBeenCalledWith(0);
  });

  it("다른 선택지를 누르면 선택이 옮겨간다", async () => {
    setup(poll());
    await userEvent.click(screen.getByRole("button", { name: "그런 편이에요" }));
    await userEvent.click(screen.getByRole("button", { name: "직접 물어봐요" }));
    expect(screen.getByRole("button", { name: "직접 물어봐요" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "그런 편이에요" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("정지 계정은 선택해도 안내 토스트만, 제출도 막힌다", async () => {
    const { onVote } = setup(poll(), "suspended");

    await userEvent.click(screen.getByRole("button", { name: "그런 편이에요" }));
    expect(toastMessage()).toBe("이용이 정지된 계정이에요");
    expect(screen.getByRole("button", { name: "그런 편이에요" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    await userEvent.click(sendButton());
    expect(toastMessage()).toBe("이용이 정지된 계정이라 참여할 수 없어요");
    expect(onVote).not.toHaveBeenCalled();
  });

  it("마감까지 남은 시간을 메타에 보여준다", () => {
    const closesAt = new Date(Date.now() + 5 * 60 * 60_000 + 60_000);
    setup(poll({ closesAt }));
    expect(screen.getByText("· 5시간 남음")).toBeInTheDocument();
  });
});

describe("결과 화면 (참여했거나 마감)", () => {
  const result = { total: 10, counts: { 0: 2, 1: 5, 2: 3 } };

  it("내 답장과 퍼센트를 보여주고 제출 버튼은 없다", () => {
    setup(poll({ myChoice: 1, result, participantCount: 10 }));

    expect(screen.getByText("10명은 이렇게 답했어요")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument(); // 내 선택 50%
    expect(screen.getAllByText("내 답장").length).toBeGreaterThan(0);
    expect(
      screen.queryByRole("button", { name: "이 답장 보내기" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("제출한 답장은 바꿀 수 없어요")).toBeInTheDocument();
  });

  it("position 이 0인 선택지에 투표해도 결과 화면이다", () => {
    setup(poll({ myChoice: 0, result }));
    expect(screen.getByText("10명은 이렇게 답했어요")).toBeInTheDocument();
  });

  it("마감된 고민은 안내 박스와 결과를 함께 보여주고, 미참여면 '내 답장'이 없다", () => {
    setup(poll({ closed: true, result }));

    expect(
      screen.getByText(
        "마감된 고민이에요. 새로 참여할 수 없고 결과는 누구나 볼 수 있어요",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("10명은 이렇게 답했어요")).toBeInTheDocument();
    expect(screen.queryByText("내 답장")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "이 답장 보내기" }),
    ).not.toBeInTheDocument();
  });

  it("마감된 고민에는 남은 시간을 붙이지 않는다", () => {
    setup(poll({ closed: true, result, closesAt: new Date(Date.now() + 60 * 60_000) }));
    expect(screen.queryByText(/남음|곧 마감/)).not.toBeInTheDocument();
  });
});

describe("투표 직후 포커스", () => {
  const result = { total: 10, counts: { 0: 2, 1: 5, 2: 3 } };

  it("투표 화면에서 결과 화면으로 바뀌면 결과 제목으로 포커스를 옮긴다", () => {
    const onVote = vi.fn();
    const { rerender } = render(
      <PollDetailView poll={poll()} role="member" submitting={false} onVote={onVote} />,
    );

    rerender(
      <PollDetailView
        poll={poll({ myChoice: 1, result })}
        role="member"
        submitting={false}
        onVote={onVote}
      />,
    );

    expect(screen.getByRole("heading", { name: "10명은 이렇게 답했어요" })).toHaveFocus();
  });

  it("처음부터 결과 화면이면 포커스를 가져가지 않는다", () => {
    setup(poll({ myChoice: 1, result }));
    expect(
      screen.getByRole("heading", { name: "10명은 이렇게 답했어요" }),
    ).not.toHaveFocus();
  });
});
