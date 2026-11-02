/**
 * 여러 feature 가 함께 알아야 하는 쿼리 키 접두사.
 * 피드는 feed 가 읽고, 투표 후 무효화는 poll 이 한다. 키 모양을 한 곳에 두어 서로의 문자열을 흉내 내지 않게 한다.
 * (다른 키는 각 feature 가 소유한다.)
 */
export const FEED_KEY_PREFIX = ["feed"] as const;

/** 참여한 고민·내가 올린 고민 목록. 투표·작성·로그아웃에서 무효화한다. */
export const MY_KEY_PREFIX = ["my"] as const;

/** 고민 상세 캐시. 내 선택·결과처럼 계정마다 다른 값이 들어 있어 세션이 바뀌면 비운다. */
export const POLL_KEY_PREFIX = ["poll"] as const;
