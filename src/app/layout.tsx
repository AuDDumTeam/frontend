import type { Metadata } from "next";

import { MockProvider } from "@/shared/api/mocks/MockProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "어떰?",
  description: "연애 고민에 답장해주세요",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>
        <MockProvider>{children}</MockProvider>
      </body>
    </html>
  );
}
