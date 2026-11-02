/**
 * 모든 API 호출이 지나가는 단일 fetch 래퍼 (Orval mutator).
 * - 로그인 쿠키를 항상 보낸다 (credentials: include).
 * - 서버가 실패 응답을 주면 ApiError, 요청 자체가 나가지 못하면 NetworkError 로 던진다.
 *   화면은 둘을 구분해 문구를 고른다 (error-messages.ts).
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

/** 서버에 닿지 못했다: 오프라인, DNS, 연결 거부 등. 코드 버그로 난 TypeError 와 구분하기 위한 오류. */
export class NetworkError extends Error {
  constructor(cause: unknown) {
    super("네트워크에 연결할 수 없어요", { cause });
    this.name = "NetworkError";
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const customFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${url}`, { ...options, credentials: "include" });
  } catch (error) {
    // 요청을 취소(AbortController)한 경우는 네트워크 문제가 아니므로 그대로 던진다.
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new NetworkError(error);
  }

  const text = res.status === 204 ? "" : await res.text();
  const body: unknown = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const err = (body ?? {}) as { code?: string; message?: string };
    throw new ApiError(res.status, err.code ?? "UNKNOWN", err.message ?? "");
  }
  return { data: body, status: res.status, headers: res.headers } as T;
};
