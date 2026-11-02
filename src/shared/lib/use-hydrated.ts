import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * 하이드레이션이 끝났는지. 서버 렌더와 하이드레이션 첫 렌더에서는 false, 그 뒤로는 true.
 * 서버 HTML 이 만들어진 뒤에 늦게 하이드레이트되는 영역(스트리밍되는 동적 경로)이
 * 이미 받아 둔 클라이언트 데이터로 다른 화면을 그리면 서버 HTML 과 어긋난다.
 * 그런 데이터(예: 계정 역할)로 화면을 가르는 곳은 이 값이 true 가 된 뒤에 가른다.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
