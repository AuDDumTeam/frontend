/**
 * 여러 feature 가 함께 알아야 하는 쿼리 키 접두사.
 * 피드는 feed 가 읽고, 투표 후 무효화는 poll 이 한다. 키 모양을 한 곳에 두어 서로의 문자열을 흉내 내지 않게 한다.
 * (다른 키는 각 feature 가 소유한다.)
 */
export const FEED_KEY_PREFIX = ["feed"] as const;
