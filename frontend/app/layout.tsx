import type { Metadata } from "next";
import "./globals.css";
import { DocumentProvider } from "@/context/DocumentContext";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Aegis | Book Reader",
  description: "Experience reading like never before with Aegis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DocumentProvider>
          <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-white/5 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                  <BookOpen className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">AEGIS</span>
              </Link>
              <div className="flex items-center gap-8">
                <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Home</Link>
                <Link href="/gallery" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Library</Link>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                  Get Started
                </button>
              </div>
            </div>
          </nav>
          <div className="pt-20">
            {children}
          </div>
        </DocumentProvider>
      </body>
    </html>
  );
}
