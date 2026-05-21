"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Shield,
  Zap,
  Layers,
  Compass,
  Upload,
  Eye,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  // Intersection observer for scroll-triggered animations
  const observedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen overflow-hidden">
      {/* ======== HERO SECTION ======== */}
      <section className="relative pt-16 pb-32">
        {/* Background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-indigo-600/12 via-purple-600/5 to-transparent blur-3xl -z-10" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-gradient-radial from-indigo-500/6 to-transparent blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center animate-fade-in">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/8 border border-indigo-500/15 mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-indigo-300 text-xs font-medium tracking-wide">
              Now with multi-source discovery
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-7 leading-[0.95]">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500">
              Read Everything.
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient glow-text">
              One Place.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Upload your books, discover new ones from multiple sources, and read
            them all in a beautifully crafted reader. Dark mode, bookmarks,
            progress tracking — everything you need.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <Link
              href="/gallery"
              className="btn-primary text-base px-8 py-4 group"
            >
              Browse Library
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/sources" className="btn-ghost text-base px-8 py-4">
              <Compass className="w-5 h-5" />
              Discover Sources
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left stagger-children">
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Secure Storage"
              description="Choose between local or S3 cloud storage. Your books, your rules."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Blazing Fast"
              description="Byte-range streaming loads only what you need. Even 500-page PDFs open instantly."
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6" />}
              title="Multi-Source"
              description="Pull content from MangaDex, Open Library, and more. One search, many sources."
            />
          </div>
        </div>
      </section>

      {/* ======== HOW IT WORKS ======== */}
      <section className="py-28 section-glow" data-animate>
        <div className="max-w-7xl mx-auto px-6 opacity-0">
          <div className="text-center mb-16">
            <span className="badge badge-accent mb-4">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Three steps to reading bliss
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              icon={<Upload className="w-7 h-7" />}
              title="Upload or Discover"
              description="Drag-and-drop your PDFs, or search across multiple online sources to find your next read."
            />
            <StepCard
              number="02"
              icon={<BookOpen className="w-7 h-7" />}
              title="Read Beautifully"
              description="Open books in our custom reader with dark mode, pagination, zoom, and distraction-free fullscreen."
            />
            <StepCard
              number="03"
              icon={<Eye className="w-7 h-7" />}
              title="Track Progress"
              description="Bookmark pages, see your reading progress, and pick up exactly where you left off."
            />
          </div>
        </div>
      </section>

      {/* ======== READER PREVIEW ======== */}
      <section className="py-28" data-animate>
        <div className="max-w-7xl mx-auto px-6 opacity-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge badge-accent mb-4">The Reader</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
                Built for long
                <br />
                reading sessions
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Every detail is designed for comfort. Switch between light, dark,
                and sepia modes. Adjust font size, line spacing, and reading
                width. Navigate with keyboard shortcuts or the table of contents.
              </p>

              <div className="space-y-4">
                <ReaderFeature
                  icon={<Sparkles className="w-4 h-4" />}
                  label="Dark, Light & Sepia modes"
                />
                <ReaderFeature
                  icon={<Sparkles className="w-4 h-4" />}
                  label="Keyboard navigation (←/→ or j/k)"
                />
                <ReaderFeature
                  icon={<Sparkles className="w-4 h-4" />}
                  label="Bookmarks & reading progress"
                />
                <ReaderFeature
                  icon={<Sparkles className="w-4 h-4" />}
                  label="Table of contents sidebar"
                />
              </div>

              <div className="mt-10">
                <Link href="/gallery" className="btn-primary">
                  Try the Reader
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Reader Mockup */}
            <div className="relative">
              <div className="card p-1 overflow-hidden">
                <div className="bg-[#1a1a2e] rounded-[16px] overflow-hidden">
                  {/* Toolbar mockup */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      reader — The Great Gatsby
                    </span>
                    <div className="flex items-center gap-3 text-slate-600">
                      <span className="text-[10px]">☾</span>
                      <span className="text-[10px]">🔍</span>
                    </div>
                  </div>
                  {/* Page content mockup */}
                  <div className="px-12 py-10 min-h-[320px]">
                    <p className="text-slate-300 text-sm leading-[1.9] font-serif">
                      In my younger and more vulnerable years my father gave me
                      some advice that I&apos;ve been turning over in my mind ever
                      since.
                    </p>
                    <p className="text-slate-300 text-sm leading-[1.9] font-serif mt-4">
                      &ldquo;Whenever you feel like criticizing anyone,&rdquo; he told
                      me, &ldquo;just remember that all the people in this world
                      haven&apos;t had the advantages that you&apos;ve had.&rdquo;
                    </p>
                    <p className="text-slate-400/50 text-sm leading-[1.9] font-serif mt-4">
                      He didn&apos;t say any more, but we&apos;ve always been
                      unusually communicative in a reserved way, and I understood
                      that he meant a great deal more than that...
                    </p>
                  </div>
                  {/* Bottom bar */}
                  <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                    <span className="text-[10px] text-slate-600 font-mono">
                      ◄ Page 3 of 180 ►
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="w-[6%] h-full bg-indigo-500 rounded-full" />
                      </div>
                      <span className="text-[10px] text-slate-600">2%</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow behind card */}
              <div className="absolute -inset-10 bg-gradient-radial from-indigo-500/8 to-transparent -z-10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ======== CTA SECTION ======== */}
      <section className="py-28" data-animate>
        <div className="max-w-4xl mx-auto px-6 text-center opacity-0">
          <div className="card p-16 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-[80px]" />

            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 relative z-10">
              Ready to start reading?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
              Upload your first book or discover content from your favorite
              sources. It&apos;s free and always will be.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                href="/upload"
                className="btn-primary text-base px-8 py-4"
              >
                Upload Your First Book
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/sources"
                className="btn-ghost text-base px-8 py-4"
              >
                Explore Sources
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======== FOOTER ======== */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-tight">BIBLIO</span>
          </div>
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} Biblio Reader. Built with care.
          </p>
          <div className="flex gap-8">
            <a
              href="#"
              className="text-sm text-slate-600 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-slate-600 hover:text-white transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-slate-600 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card p-8 group">
      <div className="w-12 h-12 bg-indigo-500/8 rounded-xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-500/15 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-[0.95rem]">
        {description}
      </p>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative card p-8 group">
      <span className="absolute top-6 right-6 text-5xl font-black text-white/3 select-none">
        {number}
      </span>
      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/15 to-purple-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function ReaderFeature({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 text-slate-300">
      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}