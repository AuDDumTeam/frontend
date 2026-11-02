/** 목(MSW) 모드 여부. 빌드 시점에 정해지는 환경변수라 한 곳에서만 판단한다. */
export const MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";
