"use client";

import { useParams, useRouter } from "next/navigation";
import { useDocuments } from "@/context/DocumentContext";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  Bookmark,
  BookOpen,
  List,
  Settings,
  Type,
  X,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { TocItem } from "@/components/PdfViewer";

// Dynamic import to avoid SSR issues with react-pdf
const PdfViewer = dynamic(
  () => import("@/components/PdfViewer").then((mod) => mod.PdfViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <div className="aspect-[8.5/11] w-[600px] max-w-full bg-white/5 rounded-xl animate-shimmer" />
      </div>
    ),
  }
);

type ReadingMode = "dark" | "light" | "sepia";

interface ReaderSettings {
  readingMode: ReadingMode;
  zoom: number;
  fontSize: number;
  lineSpacing: "compact" | "normal" | "relaxed";
  pageWidth: "narrow" | "medium" | "wide";
}

const DEFAULT_SETTINGS: ReaderSettings = {
  readingMode: "dark",
  zoom: 100,
  fontSize: 16,
  lineSpacing: "normal",
  pageWidth: "medium",
};

function loadSettings(): ReaderSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const saved = localStorage.getItem("source_engine_reader_settings");
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: ReaderSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem("source_engine_reader_settings", JSON.stringify(settings));
}

function loadBookmarks(bookId: string): number[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(`source_engine_bookmarks_${bookId}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(bookId: string, pages: number[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`source_engine_bookmarks_${bookId}`, JSON.stringify(pages));
}

function loadReadingProgress(bookId: string): number {
  if (typeof window === "undefined") return 1;
  try {
    const saved = localStorage.getItem(`source_engine_progress_${bookId}`);
    return saved ? parseInt(saved, 10) : 1;
  } catch {
    return 1;
  }
}

function saveReadingProgress(bookId: string, page: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`source_engine_progress_${bookId}`, String(page));
}

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const { documents } = useDocuments();
  const bookId = params.id as string;
  const doc = documents.find((d) => d.id === bookId);

  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>([]);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const [toolbarTimeout, setToolbarTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load persisted state on mount
  useEffect(() => {
    const s = loadSettings();
    setSettings(s);
    if (bookId) {
      setBookmarkedPages(loadBookmarks(bookId));
      setCurrentPage(loadReadingProgress(bookId));
    }
  }, [bookId]);

  // Persist settings when they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Persist bookmarks
  useEffect(() => {
    if (bookId && pdfLoaded) saveBookmarks(bookId, bookmarkedPages);
  }, [bookmarkedPages, bookId, pdfLoaded]);

  // Persist reading progress
  useEffect(() => {
    if (bookId && pdfLoaded) saveReadingProgress(bookId, currentPage);
  }, [currentPage, bookId, pdfLoaded]);

  // Auto-hide toolbar in fullscreen
  const resetToolbarTimer = useCallback(() => {
    setShowToolbar(true);
    if (toolbarTimeout) clearTimeout(toolbarTimeout);
    if (isFullscreen) {
      const t = setTimeout(() => setShowToolbar(false), 3000);
      setToolbarTimeout(t);
    }
  }, [isFullscreen, toolbarTimeout]);

  useEffect(() => {
    if (!isFullscreen) {
      setShowToolbar(true);
      if (toolbarTimeout) clearTimeout(toolbarTimeout);
    }
  }, [isFullscreen, toolbarTimeout]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" || e.key === "j") {
        setCurrentPage((p) => Math.min(p + 1, totalPages || 1));
      } else if (e.key === "ArrowLeft" || e.key === "k") {
        setCurrentPage((p) => Math.max(p - 1, 1));
      } else if (e.key === "f" && !e.ctrlKey && !e.metaKey) {
        toggleFullscreen();
      } else if (e.key === "b") {
        toggleBookmark();
      } else if (e.key === "Escape") {
        setShowTOC(false);
        setShowSettings(false);
      }
    },
    [totalPages]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Mouse move for toolbar visibility
  useEffect(() => {
    const handler = () => resetToolbarTimer();
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [resetToolbarTimer]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleBookmark = () => {
    setBookmarkedPages((prev) =>
      prev.includes(currentPage)
        ? prev.filter((p) => p !== currentPage)
        : [...prev, currentPage].sort((a, b) => a - b)
    );
  };

  const updateSetting = <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const modeStyles: Record<ReadingMode, { bg: string; text: string }> = {
    dark: { bg: "bg-[#1a1a2e]", text: "text-slate-200" },
    light: { bg: "bg-[#f5f1eb]", text: "text-gray-800" },
    sepia: { bg: "bg-[#f4ecd8]", text: "text-[#5b4636]" },
  };

  const mode = modeStyles[settings.readingMode];

  if (!doc) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <BookOpen className="w-16 h-16 text-slate-700 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-3">Book not found</h1>
        <p className="text-slate-400 mb-8">
          This book may have been removed or the session was reset.
        </p>
        <Link href="/gallery" className="btn-primary">
          Back to Library
        </Link>
      </main>
    );
  }

  const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

  // Determine PDF URL — use fileUrl from document, or fallback to backend
  const pdfUrl =
    doc.fileUrl && doc.fileUrl !== "#"
      ? doc.fileUrl
      : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/book?name=${encodeURIComponent(doc.name)}`;

  return (
    <div
      className={`fixed inset-0 flex flex-col ${mode.bg} transition-colors duration-300 z-50`}
      onMouseMove={resetToolbarTimer}
    >
      {/* ===== PROGRESS BAR (top) ===== */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-black/20 z-50">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ===== TOOLBAR ===== */}
      <header
        className={`flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-black/40 backdrop-blur-xl z-40 transition-all duration-300 ${
          showToolbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <h2 className="text-sm font-semibold text-white truncate max-w-[300px]">
              {doc.name}
            </h2>
            {totalPages > 0 && (
              <p className="text-[11px] text-slate-500">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Reading Mode */}
          <button
            onClick={() =>
              updateSetting(
                "readingMode",
                settings.readingMode === "dark"
                  ? "light"
                  : settings.readingMode === "light"
                  ? "sepia"
                  : "dark"
              )
            }
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            title={`Mode: ${settings.readingMode}`}
          >
            {settings.readingMode === "dark" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>

          {/* Zoom controls */}
          <button
            onClick={() => updateSetting("zoom", Math.max(settings.zoom - 10, 50))}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500 w-10 text-center tabular-nums">
            {settings.zoom}%
          </span>
          <button
            onClick={() => updateSetting("zoom", Math.min(settings.zoom + 10, 200))}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Bookmark */}
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-lg transition-colors hover:bg-white/5 ${
              bookmarkedPages.includes(currentPage)
                ? "text-indigo-400"
                : "text-slate-400 hover:text-white"
            }`}
            title="Bookmark page (B)"
          >
            <Bookmark
              className="w-4 h-4"
              fill={bookmarkedPages.includes(currentPage) ? "currentColor" : "none"}
            />
          </button>

          {/* TOC */}
          <button
            onClick={() => { setShowTOC(!showTOC); setShowSettings(false); }}
            className={`p-2 rounded-lg transition-colors hover:bg-white/5 ${
              showTOC ? "text-indigo-400" : "text-slate-400 hover:text-white"
            }`}
            title="Table of contents"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={() => { setShowSettings(!showSettings); setShowTOC(false); }}
            className={`p-2 rounded-lg transition-colors hover:bg-white/5 ${
              showSettings ? "text-indigo-400" : "text-slate-400 hover:text-white"
            }`}
            title="Reader settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            title="Fullscreen (F)"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (TOC or Settings) */}
        {(showTOC || showSettings) && (
          <aside className="w-72 border-r border-white/5 bg-black/30 backdrop-blur-xl overflow-y-auto animate-slide-right shrink-0">
            {showTOC && (
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Contents
                  </h3>
                  <button
                    onClick={() => setShowTOC(false)}
                    className="p-1 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {toc.length > 0 ? (
                  <div className="space-y-0.5">
                    {toc.map((item, i) => (
                      <TocEntry
                        key={i}
                        item={item}
                        currentPage={currentPage}
                        onNavigate={(page) => {
                          setCurrentPage(page);
                          setShowTOC(false);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 italic">
                    {pdfLoaded
                      ? "This PDF does not contain a table of contents."
                      : "Loading document outline..."}
                  </p>
                )}

                {/* Bookmarks section */}
                {bookmarkedPages.length > 0 && (
                  <>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 mt-8">
                      Bookmarks ({bookmarkedPages.length})
                    </h3>
                    <div className="space-y-1">
                      {bookmarkedPages.map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentPage === page
                              ? "bg-indigo-500/10 text-indigo-400"
                              : "text-slate-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Bookmark className="w-3 h-3 inline mr-2" fill="currentColor" />
                          Page {page}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {showSettings && (
              <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Reader Settings
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-1 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Background Mode */}
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-2 block">
                      Background
                    </label>
                    <div className="flex gap-2">
                      {(["dark", "light", "sepia"] as ReadingMode[]).map((m) => (
                        <button
                          key={m}
                          onClick={() => updateSetting("readingMode", m)}
                          className={`flex-1 py-2.5 rounded-lg text-xs font-medium capitalize transition-all ${
                            settings.readingMode === m
                              ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                              : "bg-white/3 text-slate-400 border border-white/5 hover:bg-white/5"
                          }`}
                        >
                          {m === "dark" && <Moon className="w-3 h-3 inline mr-1" />}
                          {m === "light" && <Sun className="w-3 h-3 inline mr-1" />}
                          {m === "sepia" && <Type className="w-3 h-3 inline mr-1" />}
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Zoom Slider */}
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-2 block">
                      Zoom: {settings.zoom}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      step="10"
                      value={settings.zoom}
                      onChange={(e) => updateSetting("zoom", Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                      <span>50%</span>
                      <span>100%</span>
                      <span>200%</span>
                    </div>
                  </div>

                  {/* Page Width */}
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-2 block">
                      Page Width
                    </label>
                    <div className="flex gap-2">
                      {(["narrow", "medium", "wide"] as const).map((w) => (
                        <button
                          key={w}
                          onClick={() => updateSetting("pageWidth", w)}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                            settings.pageWidth === w
                              ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                              : "bg-white/3 text-slate-400 border border-white/5 hover:bg-white/5"
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Keyboard shortcuts */}
                <div className="mt-8 p-3 rounded-xl bg-white/3 border border-white/5">
                  <p className="text-[11px] text-slate-500">
                    <strong className="text-slate-400">Shortcuts:</strong>
                    <br />
                    ← / → or j / k — navigate pages
                    <br />
                    b — toggle bookmark
                    <br />
                    f — toggle fullscreen
                    <br />
                    Esc — close panels
                  </p>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* PDF Viewer Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center">
          <PdfViewer
            fileUrl={pdfUrl}
            currentPage={currentPage}
            zoom={settings.zoom}
            readingMode={settings.readingMode}
            onPageChange={setCurrentPage}
            onTotalPagesChange={setTotalPages}
            onTocLoad={setToc}
            onLoadSuccess={() => setPdfLoaded(true)}
          />
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <footer
        className={`flex items-center justify-between px-4 py-2 border-t border-white/5 bg-black/40 backdrop-blur-xl z-40 transition-all duration-300 ${
          showToolbar ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage <= 1}
          className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-white/5"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          {/* Page input */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Page</span>
            <input
              type="number"
              min={1}
              max={totalPages || 1}
              value={currentPage}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (v >= 1 && v <= totalPages) setCurrentPage(v);
              }}
              className="w-14 text-center text-xs bg-white/5 border border-white/10 rounded-md py-1 text-white outline-none focus:border-indigo-500/50 tabular-nums"
            />
            <span className="text-xs text-slate-500">of {totalPages || "..."}</span>
          </div>

          {/* Progress bar */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 tabular-nums w-10">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages || 1))}
          disabled={currentPage >= totalPages}
          className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-white/5"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}

/** Recursive TOC entry component */
function TocEntry({
  item,
  currentPage,
  onNavigate,
}: {
  item: TocItem;
  currentPage: number;
  onNavigate: (page: number) => void;
}) {
  const isActive = item.pageNumber === currentPage;
  return (
    <>
      <button
        onClick={() => onNavigate(item.pageNumber)}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? "bg-indigo-500/10 text-indigo-400"
            : "text-slate-400 hover:text-white hover:bg-white/5"
        }`}
        style={{ paddingLeft: `${12 + item.level * 16}px` }}
      >
        <span className="truncate block">{item.title}</span>
        <span className="text-[10px] text-slate-600 ml-1">p.{item.pageNumber}</span>
      </button>
      {item.children?.map((child, i) => (
        <TocEntry key={i} item={child} currentPage={currentPage} onNavigate={onNavigate} />
      ))}
    </>
  );
}
