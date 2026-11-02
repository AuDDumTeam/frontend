"use client";

import { useState } from "react";

import { Screen } from "@/shared/ui/AppShell";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { Chip } from "@/shared/ui/Chip";
import { Header } from "@/shared/ui/Header";
import { Icon, type IconName } from "@/shared/ui/Icon";
import { Pill } from "@/shared/ui/Pill";
import { SuspendBanner } from "@/shared/ui/SuspendBanner";
import { TabBar } from "@/shared/ui/TabBar";
import { toast } from "@/shared/ui/toast/toast-store";
import { Yolk, type YolkName } from "@/shared/ui/Yolk";

const ICONS: IconName[] = [
  "home",
  "mine",
  "posted",
  "profile",
  "plus",
  "back",
  "next",
  "check",
  "close",
  "more",
];
const YOLKS: YolkName[] = ["happy", "wonder", "sad", "love", "shy", "surprise", "think"];
const CATEGORIES = ["전체", "썸", "소개팅", "연락", "연애 중", "이별"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-line border-b py-5">
      <h2 className="text-muted mb-3 text-[13px] font-extrabold">{title}</h2>
      {children}
    </section>
  );
}

export function Gallery() {
  const [category, setCategory] = useState("전체");
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <Header backHref="/" onMenu={() => toast("메뉴를 눌렀어요")} />
      <SuspendBanner />
      <Screen>
        <Section title="버튼">
          <div className="flex flex-col gap-2.5">
            <Button fullWidth onClick={() => toast("답장이 전달됐어요")}>
              이 답장 보내기
            </Button>
            <Button fullWidth inactive onClick={() => toast("답장을 하나 골라주세요")}>
              이 답장 보내기 (비활성)
            </Button>
            <div className="flex gap-2.5">
              <Button size="lg" variant="secondary" className="flex-1">
                기각 · 투표 유지
              </Button>
              <Button size="lg" variant="peach" className="flex-1">
                숨김
              </Button>
              <Button size="lg" variant="danger" className="flex-1">
                삭제
              </Button>
            </div>
            <Button variant="kakao" size="md" className="w-55">
              카카오로 시작하기
            </Button>
            <div className="flex gap-2.5">
              <Button size="pill" variant="secondary">
                더 보기
              </Button>
              <Button size="pill-sm" variant="secondary">
                전체 보기
              </Button>
            </div>
          </div>
        </Section>

        <Section title="칩 (선택 상태 전환)">
          <div className="-mx-5 flex scrollbar-none gap-2 overflow-x-auto px-5">
            {CATEGORIES.map((c) => (
              <Chip key={c} selected={c === category} onClick={() => setCategory(c)}>
                {c}
              </Chip>
            ))}
          </div>
        </Section>

        <Section title="상태 pill">
          <div className="flex gap-2">
            <Pill tone="closed">마감</Pill>
            <Pill tone="joined">참여 완료</Pill>
            <Pill tone="soon">곧 마감</Pill>
          </div>
        </Section>

        <Section title="아이콘">
          <div className="flex flex-wrap gap-4">
            {ICONS.map((n) => (
              <div key={n} className="flex w-12 flex-col items-center gap-1">
                <Icon name={n} />
                <span className="text-faint text-[11px]">{n}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="캐릭터 (어떰이)">
          <div className="flex flex-wrap gap-3">
            {YOLKS.map((n) => (
              <Yolk key={n} name={n} size={56} />
            ))}
          </div>
        </Section>

        <Section title="시트 · 토스트">
          <div className="flex gap-2.5">
            <Button size="pill" onClick={() => setSheetOpen(true)}>
              시트 열기
            </Button>
            <Button
              size="pill"
              variant="secondary"
              onClick={() => toast("올렸어요 · 바로 공개됐어요")}
            >
              토스트
            </Button>
          </div>
        </Section>
      </Screen>

      <TabBar onPlus={() => toast("+ 버튼")} />

      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="이 고민을 삭제할까요?"
      >
        <p className="text-muted mt-2 text-[14px] leading-[1.65]">
          삭제하면 복구할 수 없어요. 참여 기록은 보존돼요.
        </p>
        <div className="mt-5 flex gap-2.5">
          <Button
            size="lg"
            variant="secondary"
            className="flex-1"
            onClick={() => setSheetOpen(false)}
          >
            취소
          </Button>
          <Button
            size="lg"
            variant="danger"
            className="flex-1"
            onClick={() => setSheetOpen(false)}
          >
            삭제
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
