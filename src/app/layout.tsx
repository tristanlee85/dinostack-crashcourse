import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DinoStack Reading Room",
  description: "A personal reading list and to-read tracker.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              DinoStack Reading Room
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link href="/" className="text-slate-600 hover:text-slate-900">
                Reading List
              </Link>
              <Link
                href="/discover"
                className="text-slate-600 hover:text-slate-900"
              >
                Discover
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
