// 서버(SSR) 번들에서 'msw/browser' 를 대신하는 빈 모듈.
// msw/browser 는 exports 에서 node 조건이 null 이라 서버 번들이 해석하지 못한다.
// 실제 워커는 브라우저에서만 시작되므로(MockProvider) 이 스텁이 호출되는 일은 없다.
export const setupWorker = (): never => {
  throw new Error("MSW 브라우저 워커는 서버에서 사용할 수 없어요");
};
