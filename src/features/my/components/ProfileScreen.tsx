"use client";

import Link from "next/link";
import { useState } from "react";

import { ADMIN_COPY, pendingCountLabel, usePendingCount } from "@/features/admin";
import { LoginButton, useLogout, useMe, type Role } from "@/features/auth";
import { Screen } from "@/shared/ui/AppShell";
import { Header } from "@/shared/ui/Header";
import { Icon } from "@/shared/ui/Icon";
import { ScreenTitle } from "@/shared/ui/ScreenTitle";
import { SuspendBanner } from "@/shared/ui/SuspendBanner";
import { Yolk } from "@/shared/ui/Yolk";

import { useMyPosts, useMyVotes } from "../api/queries";
import { MY_COPY } from "../copy";
import { WithdrawSheet } from "./WithdrawSheet";

const ROW =
  "press border-line flex h-15 w-full cursor-pointer items-center border-b text-left text-[16px] font-bold";

function Stat({ value, label }: { value: number | undefined; label: string }) {
  return (
    <div className="text-center">
      <div className="tracking-heading text-[26px] font-extrabold">
        {value ?? MY_COPY.profile.statsUnknown}
      </div>
      <div className="text-muted text-[12px]">{label}</div>
    </div>
  );
}

function RowChevron() {
  return <Icon name="next" size={18} className="text-faint" />;
}

/** 프로필: 계정 상태, 통계(내 답장·올린 고민), 로그아웃·탈퇴. */
export function ProfileScreen() {
  const { role, nickname } = useMe();
  const { logout, isPending: loggingOut } = useLogout();
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const isMember = role !== undefined && role !== "guest";
  const votes = useMyVotes();
  const posts = useMyPosts(isMember);
  const { profile } = MY_COPY;
  const shownRole: Role = role ?? "guest";
  const pending = usePendingCount(role === "admin");

  return (
    <>
      <Header />
      {role === "suspended" && <SuspendBanner />}
      <Screen>
        <ScreenTitle title={profile.title} />
        <div className="flex flex-col items-center gap-2 pb-4.5">
          <div className="bg-peach flex size-28 items-center justify-center rounded-full">
            <Yolk name="happy" size={88} />
          </div>
          <p className="tracking-head text-[24px] font-extrabold">
            {shownRole === "guest"
              ? profile.guestNickname
              : (nickname ?? profile.fallbackNickname)}
          </p>
          <p className="text-muted text-[13.5px]">{profile.roleLine[shownRole]}</p>
        </div>

        {role === "guest" && (
          <div className="bg-peach rounded-card-lg flex flex-col gap-3.5 p-6">
            <p className="tracking-title text-[20px] leading-[1.4] font-extrabold">
              {profile.guestCard.titleLines[0]}
              <br />
              {profile.guestCard.titleLines[1]}
            </p>
            <LoginButton size="lg" fullWidth />
            <p className="text-muted text-[12.5px]">{profile.guestCard.hint}</p>
          </div>
        )}

        {isMember && (
          <div className="border-line grid grid-cols-2 border-y py-3.5">
            <Stat value={votes.data?.pages[0]?.totalCount} label={profile.stats.votes} />
            <Stat value={posts.data?.pages[0]?.totalCount} label={profile.stats.posts} />
          </div>
        )}

        {role === "admin" && (
          <Link
            href="/admin"
            className="press bg-ink text-bg rounded-control mt-4 flex h-14 w-full items-center justify-between px-5.5 text-[14px] font-extrabold"
          >
            <span>{ADMIN_COPY.profileBar}</span>
            {pending.count !== undefined && (
              <span>{pendingCountLabel(pending.count, pending.more)}</span>
            )}
          </Link>
        )}

        {isMember && (
          <div className="mt-2 flex flex-col">
            <button
              type="button"
              className={ROW}
              disabled={loggingOut}
              onClick={() => logout()}
            >
              <span className="flex-1">{profile.logout}</span>
              <RowChevron />
            </button>
            <button type="button" className={ROW} onClick={() => setWithdrawOpen(true)}>
              <span className="text-danger flex-1">{profile.withdraw}</span>
              <RowChevron />
            </button>
          </div>
        )}
      </Screen>
      <WithdrawSheet open={withdrawOpen} onOpenChange={setWithdrawOpen} />
    </>
  );
}
