import type { Metadata } from "next";
import "./globals.css";
import { DocumentProvider } from "@/context/DocumentContext";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SourceEngine | Your Ultimate Reading Companion",
  description:
    "Upload, read, and discover books from multiple sources. A premium reading experience with dark mode, pagination, and more.",
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
          <div className="ambient-glow" aria-hidden="true" />
          <Navbar />
          <div className="pt-20">{children}</div>
        </DocumentProvider>
      </body>
    </html>
  );
}
