import type { Metadata } from "next";
import { Noto_Sans_KR, Press_Start_2P } from "next/font/google";
import "./globals.css";
import AuthHydrator from "@/components/AuthHydrator";
import ThemeProvider from "@/components/ThemeProvider";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto",
  display: "swap",
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
  display: "swap",
});

export const metadata: Metadata = {
  title: "redoceanmap — 서울 상권 분석",
  description: "예산이랑 업종만 알려주세요. 괜찮은 동네 골라드릴게요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${noto.variable} ${pressStart.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <AuthHydrator />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
