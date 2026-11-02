"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useAuthSheetStore, useMe } from "@/features/auth";
import { CATEGORY_LABEL, POLL_CATEGORIES } from "@/features/poll";
import { MESSAGES } from "@/shared/lib/messages";
import { Screen } from "@/shared/ui/AppShell";
import { Button } from "@/shared/ui/Button";
import { Chip } from "@/shared/ui/Chip";
import { Header } from "@/shared/ui/Header";
import { Icon } from "@/shared/ui/Icon";
import { SuspendBanner } from "@/shared/ui/SuspendBanner";
import { toast } from "@/shared/ui/toast/toast-store";

import { useCreatePoll } from "../api/mutations";
import { optionPlaceholder, questionCounter, WRITE_COPY } from "../copy";
import {
  DEADLINES,
  initialWriteForm,
  OPTION_MAX,
  OPTIONS_LIMIT,
  OPTIONS_MIN,
  QUESTION_MAX,
  stripLineBreaks,
  toCreateInput,
  validateWriteForm,
  type WriteFormValues,
} from "../model/form";

/** 고민 쓰기. 로그인이 필요하므로 비회원이면 홈으로 보내고 로그인 시트를 연다. */
export function WriteScreen() {
  const router = useRouter();
  const { role } = useMe();
  const openAuthSheet = useAuthSheetStore((s) => s.open);
  const { create, isPending } = useCreatePoll();

  const { control, setValue } = useForm<WriteFormValues>({
    defaultValues: initialWriteForm(),
  });
  const values = useWatch({ control }) as WriteFormValues;
  const [tried, setTried] = useState(false);
  const allErrors = validateWriteForm(values);
  const errors = tried ? allErrors : [];

  useEffect(() => {
    if (role !== "guest") return;
    router.replace("/");
    openAuthSheet("login");
  }, [role, router, openAuthSheet]);

  if (role === "guest") return null;

  const setOption = (index: number, text: string) =>
    setValue(
      "options",
      values.options.map((option, i) => (i === index ? text : option)),
    );
  const addOption = () => setValue("options", [...values.options, ""]);
  const removeOption = (index: number) =>
    setValue(
      "options",
      values.options.filter((_, i) => i !== index),
    );

  const submit = () => {
    if (role === "suspended") return toast(MESSAGES.write.suspended);
    setTried(true);
    const input = toCreateInput(values, new Date());
    if (input) create(input);
  };

  const sectionTitle = "tracking-heading pt-1 text-[16px] font-extrabold";
  const hint = "text-muted text-[12.5px] font-normal tracking-normal";

  return (
    <>
      <Header backHref="/" />
      {role === "suspended" && <SuspendBanner />}
      <Screen className="flex flex-col gap-3.5">
        <h1 className="tracking-head pt-0.5 pb-3.5 text-[30px] leading-[1.3] font-extrabold">
          {WRITE_COPY.title}
        </h1>

        <div className="bg-surface rounded-cta px-5 pt-3.5 pb-2.5">
          <textarea
            aria-label={WRITE_COPY.questionLabel}
            value={values.question}
            maxLength={QUESTION_MAX}
            placeholder={WRITE_COPY.questionPlaceholder}
            onChange={(e) => setValue("question", stripLineBreaks(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            className="placeholder:text-faint block h-23 w-full resize-none bg-transparent text-[15.5px] leading-[1.6] font-bold outline-none"
          />
          <p className="text-faint text-right text-[11.5px]">
            {questionCounter(values.question.length, QUESTION_MAX)}
          </p>
        </div>

        <section aria-label={WRITE_COPY.categoryGroup} className="flex flex-col gap-3.5">
          <h2 className={sectionTitle}>
            {WRITE_COPY.categoryGroup}{" "}
            <span className={hint}>{WRITE_COPY.categoryHint}</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {POLL_CATEGORIES.map((category) => (
              <Chip
                key={category}
                size="lg"
                selected={values.category === category}
                onClick={() => setValue("category", category)}
              >
                {CATEGORY_LABEL[category]}
              </Chip>
            ))}
          </div>
        </section>

        <section aria-label={WRITE_COPY.optionsGroup} className="flex flex-col gap-3.5">
          <h2 className={sectionTitle}>
            {WRITE_COPY.optionsGroup}{" "}
            <span className={hint}>{WRITE_COPY.optionsHint}</span>
          </h2>
          <div className="flex flex-col gap-2">
            {values.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  aria-label={optionPlaceholder(index)}
                  value={option}
                  maxLength={OPTION_MAX}
                  placeholder={optionPlaceholder(index)}
                  onChange={(e) => setOption(index, e.target.value)}
                  className="bg-surface rounded-control placeholder:text-faint h-14 min-w-0 flex-1 px-5 text-[15px] font-bold outline-none"
                />
                {values.options.length > OPTIONS_MIN && (
                  <button
                    type="button"
                    aria-label={`${optionPlaceholder(index)} ${WRITE_COPY.removeOption}`}
                    onClick={() => removeOption(index)}
                    className="press text-muted flex size-11 flex-none cursor-pointer items-center justify-center"
                  >
                    <Icon name="close" size={20} />
                  </button>
                )}
              </div>
            ))}
            {values.options.length < OPTIONS_LIMIT && (
              <button
                type="button"
                onClick={addOption}
                className="press border-dash text-accent-text rounded-control h-12.5 cursor-pointer border-2 border-dashed text-[14px] font-bold"
              >
                {WRITE_COPY.addOption}
              </button>
            )}
          </div>
        </section>

        <section aria-label={WRITE_COPY.deadlineGroup} className="flex flex-col gap-3.5">
          <h2 className={sectionTitle}>
            {WRITE_COPY.deadlineGroup}{" "}
            <span className={hint}>{WRITE_COPY.deadlineHint}</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {DEADLINES.map(({ value, label }) => (
              <Chip
                key={value}
                size="lg"
                selected={values.deadline === value}
                onClick={() => setValue("deadline", value)}
              >
                {label}
              </Chip>
            ))}
          </div>
        </section>

        {errors.length > 0 && (
          <ul role="alert" className="flex flex-col gap-3.5">
            {errors.map((message) => (
              <li
                key={message}
                className="text-danger text-[12.5px] leading-normal font-bold"
              >
                · {message}
              </li>
            ))}
          </ul>
        )}

        <p className="text-muted text-[12.5px] leading-[1.6]">{WRITE_COPY.notice}</p>
      </Screen>

      <div className="animate-cta flex-none px-5 pt-2.5 pb-7">
        <Button
          fullWidth
          inactive={allErrors.length > 0 || role === "suspended"}
          disabled={isPending}
          onClick={submit}
        >
          {WRITE_COPY.submit}
        </Button>
      </div>
    </>
  );
}
