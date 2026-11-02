import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// globals 를 켜지 않으면 Testing Library 가 자동 정리를 하지 않아,
// 포털(시트 등)로 그려진 DOM 이 다음 테스트로 새어 나간다.
afterEach(cleanup);
