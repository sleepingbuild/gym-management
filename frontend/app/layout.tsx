import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IronFit Pro — Gym Management",
  description: "Nền tảng quản lý phòng gym toàn diện với AI Personal Trainer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}