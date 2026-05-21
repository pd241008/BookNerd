"use client";

import { useState } from "react";
import { useDocuments } from "@/context/DocumentContext";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Calendar,
  Trash2,
  Ghost,
  LayoutGrid,
  List,
  ArrowUpDown,
  HardDrive,
} from "lucide-react";

type SortKey = "name" | "date" | "size";
type ViewMode = "grid" | "list";

// Generate a deterministic gradient from a string
function stringToGradient(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 50%, 25%), hsl(${hue2}, 60%, 15%))`;
}

export default function GalleryPage() {
  const { documents, removeDocument, resetSession } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredDocs = documents
    .filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "date")
        return (
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
      return 0;
    });

  return (
    <main className="min-h-screen p-6 md:p-12 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
                My Library
              </h1>
              <p className="text-slate-400">
                {documents.length} book{documents.length !== 1 ? "s" : ""} in
                your collection
              </p>
            </div>

            <button
              onClick={() => {
                if (
                  confirm(
                    "Reset session? This clears all non-persistent books."
                  )
                ) {
                  resetSession();
                }
              }}
              className="btn-ghost text-sm py-2.5 px-5"
            >
              Reset Session
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-11 py-3"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="appearance-none bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-[var(--radius-md)] pl-9 pr-4 py-3 text-sm text-slate-300 cursor-pointer focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                </select>
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              {/* View toggle */}
              <div className="flex bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-[var(--radius-md)] overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 transition-colors ${
                    viewMode === "grid"
                      ? "text-white bg-white/5"
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 transition-colors ${
                    viewMode === "list"
                      ? "text-white bg-white/5"
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        {filteredDocs.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="group card overflow-hidden cursor-pointer"
                >
                  <Link href={`/read/${doc.id}`}>
                    {/* Cover */}
                    <div
                      className="aspect-[3/4] relative overflow-hidden flex items-end p-6"
                      style={{ background: stringToGradient(doc.name) }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <h3 className="relative text-lg font-bold text-white leading-tight line-clamp-3">
                        {doc.name}
                      </h3>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/10 backdrop-blur-sm text-white text-sm font-semibold px-5 py-2.5 rounded-xl border border-white/20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                          Open Reader
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Meta */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center text-xs text-slate-500 gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{doc.uploadDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.storageType && (
                        <span
                          className={`badge text-[9px] ${
                            doc.storageType === "standard"
                              ? "badge-warning"
                              : "badge-accent"
                          }`}
                        >
                          <HardDrive className="w-2.5 h-2.5" />
                          {doc.storageType}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeDocument(doc.id);
                        }}
                        className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2 stagger-children">
              {filteredDocs.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/read/${doc.id}`}
                  className="group card p-4 flex items-center gap-4 hover:border-indigo-500/20"
                >
                  <div
                    className="w-12 h-16 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: stringToGradient(doc.name) }}
                  >
                    <BookOpen className="w-5 h-5 text-white/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Uploaded {doc.uploadDate}
                    </p>
                  </div>
                  {doc.storageType && (
                    <span
                      className={`badge text-[9px] ${
                        doc.storageType === "standard"
                          ? "badge-warning"
                          : "badge-accent"
                      }`}
                    >
                      {doc.storageType}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeDocument(doc.id);
                    }}
                    className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-[var(--bg-surface)] rounded-3xl flex items-center justify-center mb-8 text-slate-700">
              <Ghost className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {searchQuery ? "No books found" : "Your library is empty"}
            </h3>
            <p className="text-slate-400 max-w-sm mb-8">
              {searchQuery
                ? `Nothing matches "${searchQuery}". Try a different search.`
                : "Start by uploading your favorite books or discovering new ones."}
            </p>
            <div className="flex gap-3">
              <Link href="/upload" className="btn-primary">
                Upload a Book
              </Link>
              <Link href="/sources" className="btn-ghost">
                Discover Sources
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}