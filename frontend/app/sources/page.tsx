"use client";

import { useState } from "react";
import {
  Compass,
  Search,
  Plus,
  ExternalLink,
  BookOpen,
  Globe,
  ChevronRight,
  Loader2,
  X,
  Star,
} from "lucide-react";
import Link from "next/link";

// Hardcoded available source providers
const availableSources = [
  {
    id: "mangadex",
    name: "MangaDex",
    description: "Free, open-source manga library with thousands of titles.",
    url: "https://mangadex.org",
    icon: "📚",
    enabled: true,
  },
  {
    id: "openlibrary",
    name: "Open Library",
    description: "Internet Archive's open, editable library catalog with millions of books.",
    url: "https://openlibrary.org",
    icon: "📖",
    enabled: true,
  },
  {
    id: "gutenberg",
    name: "Project Gutenberg",
    description: "Over 70,000 free eBooks — public domain classics.",
    url: "https://gutenberg.org",
    icon: "📜",
    enabled: false,
  },
];

// Simulated search results for demo
const mockResults = [
  {
    id: "1",
    sourceId: "openlibrary",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.",
    relevance: 0.97,
  },
  {
    id: "2",
    sourceId: "mangadex",
    title: "One Piece",
    author: "Eiichiro Oda",
    description: "Monkey D. Luffy explores the Grand Line in search of the world's ultimate treasure.",
    relevance: 0.92,
  },
  {
    id: "3",
    sourceId: "openlibrary",
    title: "1984",
    author: "George Orwell",
    description: "A dystopian novel set in a totalitarian society ruled by Big Brother.",
    relevance: 0.88,
  },
];

export default function SourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof mockResults>([]);
  const [activeSourceFilters, setActiveSourceFilters] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // Simulate API call — will be replaced with real Scala backend call
    await new Promise((r) => setTimeout(r, 800));
    setResults(mockResults);
    setIsSearching(false);
  };

  const toggleSourceFilter = (sourceId: string) => {
    setActiveSourceFilters((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const filteredResults =
    activeSourceFilters.length > 0
      ? results.filter((r) => activeSourceFilters.includes(r.sourceId))
      : results;

  const getSourceMeta = (sourceId: string) =>
    availableSources.find((s) => s.id === sourceId);

  return (
    <main className="min-h-screen p-6 md:p-12 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
                Discover
              </h1>
              <p className="text-slate-400">
                Search across multiple sources. Find your next read.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search across all sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-13 pr-32 py-4 text-base"
              style={{ paddingLeft: "3.25rem" }}
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2.5 px-5 text-sm"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Search"
              )}
            </button>
          </form>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar — Sources */}
          <aside className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Active Sources
              </h3>
              <div className="space-y-2">
                {availableSources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => source.enabled && toggleSourceFilter(source.id)}
                    disabled={!source.enabled}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      activeSourceFilters.includes(source.id)
                        ? "bg-indigo-500/10 border border-indigo-500/20"
                        : source.enabled
                        ? "card hover:border-indigo-500/20"
                        : "card opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{source.icon}</span>
                        <span className="font-semibold text-white text-sm">
                          {source.name}
                        </span>
                      </div>
                      {!source.enabled && (
                        <span className="badge text-[8px] bg-white/5 text-slate-500 border-white/10">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 ml-8 leading-relaxed">
                      {source.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Add Source Placeholder */}
            <div className="card p-4 border-dashed border-2 border-slate-800 hover:border-indigo-500/30 cursor-pointer transition-all group">
              <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-300 transition-colors">
                <Plus className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Add Source</p>
                  <p className="text-xs text-slate-600">
                    Connect more content providers
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {!hasSearched ? (
              /* Initial State */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-[var(--bg-surface)] rounded-3xl flex items-center justify-center mb-6">
                  <Compass className="w-10 h-10 text-indigo-500/40" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Search across sources
                </h3>
                <p className="text-slate-400 max-w-md text-sm">
                  Enter a title, author, or keyword above. We&apos;ll search all
                  enabled sources and show you the closest matches to choose
                  from.
                </p>
              </div>
            ) : isSearching ? (
              /* Loading */
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-6" />
                <p className="text-slate-400">
                  Searching across {availableSources.filter((s) => s.enabled).length} sources...
                </p>
              </div>
            ) : filteredResults.length > 0 ? (
              /* Results */
              <div className="space-y-3 stagger-children">
                <p className="text-xs text-slate-500 mb-4">
                  Found {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
                  {activeSourceFilters.length > 0 &&
                    ` from ${activeSourceFilters.length} source${activeSourceFilters.length !== 1 ? "s" : ""}`}
                </p>
                {filteredResults.map((result) => {
                  const source = getSourceMeta(result.sourceId);
                  return (
                    <div
                      key={result.id}
                      className="card p-5 group cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        {/* Cover placeholder */}
                        <div className="w-16 h-20 bg-gradient-to-br from-indigo-500/15 to-purple-500/10 rounded-lg flex items-center justify-center shrink-0">
                          <BookOpen className="w-6 h-6 text-indigo-400/50" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {source && (
                              <span className="badge badge-accent text-[8px]">
                                {source.icon} {source.name}
                              </span>
                            )}
                            <div className="flex items-center gap-0.5 text-amber-500">
                              <Star className="w-3 h-3" fill="currentColor" />
                              <span className="text-[10px] font-bold">
                                {(result.relevance * 100).toFixed(0)}% match
                              </span>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                            {result.title}
                          </h3>
                          {result.author && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              by {result.author}
                            </p>
                          )}
                          <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                            {result.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-center">
                          <button className="btn-primary py-2 px-4 text-xs">
                            <Plus className="w-3.5 h-3.5" />
                            Add
                          </button>
                          <a
                            href="#"
                            className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                            title="View on source"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* No Results */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Globe className="w-12 h-12 text-slate-700 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">
                  No results found
                </h3>
                <p className="text-slate-400 max-w-sm text-sm">
                  Try a different search term or enable more sources.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
