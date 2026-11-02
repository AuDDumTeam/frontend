import { setupWorker } from "msw/browser";

import { getOpenAPIDefinitionMock } from "../generated/auddum.msw";
import { createMockState } from "./db";
import { createHandlers } from "./handlers";
import { readMockRole } from "./role";

// 직접 만든 핸들러(시드 데이터와 투표 규칙)가 먼저 매칭되고,
// 나머지 엔드포인트는 Orval 이 openapi.json 에서 만든 기본 핸들러가 받는다.
export const worker = setupWorker(
  ...createHandlers(createMockState(), readMockRole),
  ...getOpenAPIDefinitionMock(),
);
