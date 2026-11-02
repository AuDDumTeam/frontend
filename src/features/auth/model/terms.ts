export const TERMS_IDS = ["service", "privacy"] as const;
export type TermsId = (typeof TERMS_IDS)[number];
export type TermsChecks = Record<TermsId, boolean>;

export const emptyTermsChecks = (): TermsChecks => ({ service: false, privacy: false });

/** 필수 약관 두 개를 모두 체크해야 가입을 마칠 수 있다. */
export const canJoin = (checks: TermsChecks): boolean =>
  TERMS_IDS.every((id) => checks[id]);
