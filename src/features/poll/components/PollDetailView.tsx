"use client";

import { useEffect, useRef, useState } from "react";

import type { Role } from "@/features/auth";
import { MESSAGES } from "@/shared/lib/messages";
import { Screen } from "@/shared/ui/AppShell";
import { Button } from "@/shared/ui/Button";
import { toast } from "@/shared/ui/toast/toast-store";

import { participantsLabel, POLL_COPY } from "../copy";
import { CATEGORY_LABEL } from "../model/category";
import { formatRemaining } from "../model/closing";
import type { Poll } from "../model/poll";
import { buildResultRows } from "../model/result";
import { getPollView } from "../model/view-state";
import { ChoiceBubble } from "./ChoiceBubble";
import { ResultList } from "./ResultList";

type PollDetailViewProps = {
  poll: Poll;
  /** 확인 중이면 undefined. 정지 여부만 구분한다. */
  role: Role | undefined;
  submitting: boolean;
  onVote: (position: number) => void;
};

/** 고민 상세. 미참여+진행 중이면 투표 화면, 참여했거나 마감됐으면 결과 화면. */
export function PollDetailView({ poll, role, submitting, onVote }: PollDetailViewProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [now] = useState(() => new Date());

  const view = getPollView(poll);
  const suspended = role === "suspended";
  const remaining = poll.closed ? null : formatRemaining(poll.closesAt, now);
  const rows = buildResultRows(poll);
  const myAnswer = poll.options.find((o) => o.position === poll.myChoice);

  // 투표 화면에서 결과 화면으로 바뀌는 순간, 사라진 선택지 대신 결과 제목으로 포커스를 옮긴다.
  // (키보드·스크린리더 사용자가 포커스를 잃고 문서 맨 위로 튕기지 않도록)
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const wasVoting = useRef(view.kind === "vote");
  useEffect(() => {
    if (wasVoting.current && view.kind === "result") resultHeadingRef.current?.focus();
    wasVoting.current = view.kind === "vote";
  }, [view.kind]);

  const pick = (position: number) => {
    if (suspended) return toast(MESSAGES.account.suspended);
    setSelected(position);
  };

  const submit = () => {
    if (suspended) return toast(MESSAGES.vote.suspended);
    if (selected === null) return toast(MESSAGES.vote.pick);
    onVote(selected);
  };

  return (
    <>
      <Screen>
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex items-center gap-1.75">
            <span className="text-accent-text text-[13px] font-extrabold whitespace-nowrap">
              {CATEGORY_LABEL[poll.category]}
            </span>
            <span className="text-muted text-[13px] whitespace-nowrap">
              · {participantsLabel(poll.participantCount)}
            </span>
            {remaining && (
              <span className="text-muted text-[13px] whitespace-nowrap">
                · {remaining}
              </span>
            )}
          </div>
          <h1 className="tracking-title text-[26px] leading-[1.4] font-extrabold">
            {poll.question}
          </h1>
        </div>

        {view.kind === "result" && view.closed && (
          <p className="bg-sand text-muted rounded-control mt-4.5 px-4.5 py-3.5 text-[13px] leading-[1.6] font-bold">
            {POLL_COPY.closedNotice}
          </p>
        )}

        {view.kind === "vote" && (
          <div className="mt-5.5 flex flex-col items-end gap-2.5">
            <p className="text-muted self-start pb-1 text-[13px]">{POLL_COPY.voteHint}</p>
            {poll.options.map((option) => (
              <ChoiceBubble
                key={option.position}
                content={option.content}
                selected={selected === option.position}
                dimmed={suspended}
                onPick={() => pick(option.position)}
              />
            ))}
          </div>
        )}

        {view.kind === "result" && (
          <>
            {myAnswer && (
              <div className="mt-5 flex items-center justify-end gap-2.5">
                <span className="text-muted text-[12px] whitespace-nowrap">
                  {POLL_COPY.myAnswer}
                </span>
                <span className="bg-ink text-bg animate-cta rounded-bubble max-w-[78%] px-5.5 py-3.75 text-[15.5px] leading-[1.4] font-bold">
                  {myAnswer.content}
                </span>
              </div>
            )}
            {rows && poll.result && (
              <ResultList
                rows={rows}
                total={poll.result.total}
                headingRef={resultHeadingRef}
              />
            )}
          </>
        )}
      </Screen>

      {view.kind === "vote" && (
        <div className="animate-cta flex flex-none flex-col gap-3 px-5 pt-2.5 pb-7">
          <Button
            fullWidth
            inactive={selected === null || suspended}
            disabled={submitting}
            onClick={submit}
          >
            {POLL_COPY.submit}
          </Button>
          <p className="text-faint text-center text-[12.5px]">
            {POLL_COPY.immutableNote}
          </p>
        </div>
      )}
    </>
  );
}
