import { notFound } from "next/navigation";

import { Gallery } from "./Gallery";

// 공통 컴포넌트를 한눈에 확인하는 개발용 페이지. 운영 빌드에서는 열리지 않는다.
export default function GalleryPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Gallery />;
}
