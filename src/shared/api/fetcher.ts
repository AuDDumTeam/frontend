/**
 * 모든 API 호출이 지나가는 단일 fetch 래퍼 (Orval mutator).
 * - 로그인 쿠키를 항상 보낸다 (credentials: include).
 * - 실패 응답은 ApiError 로 바꿔 던진다. 화면은 code 를 문구로 바꿔 쓴다 (error-messages.ts).
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const customFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: "include",
  });

  const text = res.status === 204 ? "" : await res.text();
  const body: unknown = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const err = (body ?? {}) as { code?: string; message?: string };
    throw new ApiError(res.status, err.code ?? "UNKNOWN", err.message ?? "");
  }
  return { data: body, status: res.status, headers: res.headers } as T;
};
