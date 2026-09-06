import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { readSession } from "@/lib/auth";
import { ensureDemoData } from "@/lib/demo-games";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://openastra.cc"),
  title: "openAstra · 玩别人做好的，也做一局自己的",
  description:
    "openAstra 收集能在浏览器打开的 Astra 游戏和 3D，也能用一句话做一局自己的。不是 OpenAI 官方站。",
  applicationName: "openAstra",
  openGraph: {
    title: "openAstra",
    description: "玩别人做好的 Astra 游戏，也做一局自己的。",
    url: "https://openastra.cc",
    siteName: "openAstra",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  await ensureDemoData();
  const user = await readSession();

  return (
    <html
      lang="zh-CN"
      className={`${outfit.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
