// poll feature 의 공개 API. 다른 feature 는 이 파일로만 접근한다.
export { PollScreen } from "./components/PollScreen";
export { participantsLabel } from "./copy";
export {
  CATEGORY_LABEL,
  POLL_CATEGORIES,
  isPollCategory,
  type PollCategory,
} from "./model/category";
export { CLOSING_SOON_LABEL, formatRemaining, isClosingSoon } from "./model/closing";
export { toCategory, toDate } from "./model/parse";
