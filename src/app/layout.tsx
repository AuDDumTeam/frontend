import type { Metadata } from "next";

import { nanumSquareRound } from "@/shared/styles/fonts";
import { AppShell } from "@/shared/ui/AppShell";
import { ToastViewport } from "@/shared/ui/toast/ToastViewport";

import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "어떰?",
  description: "연애 고민에 답장해주세요",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={nanumSquareRound.variable}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
          <ToastViewport />
        </Providers>
      </body>
    </html>
  );
}
