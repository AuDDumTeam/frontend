import { setupWorker } from "msw/browser";

import { getOpenAPIDefinitionMock } from "../generated/auddum.msw";

// Orval 이 openapi.json 의 모든 엔드포인트에 대해 만든 기본 목 핸들러.
// 화면별로 시나리오(마감, 정지, 이미 투표함 등)가 필요하면 handlers 앞에 덮어쓰는 핸들러를 추가한다.
export const worker = setupWorker(...getOpenAPIDefinitionMock());
