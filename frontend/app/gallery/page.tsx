"use client";

import { useState } from "react";
import { useDocuments } from "@/context/DocumentContext";
import { Search, Book, Calendar, Trash2, ExternalLink, Ghost } from "lucide-react";

export default function GalleryPage() {
  const { documents, removeDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen p-6 md:p-12 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Library</h1>
            <p className="text-slate-400">Manage and read your collection of books.</p>
          </div>
          
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </header>

        {filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDocs.map((doc) => (
              <div 
                key={doc.id} 
                className="group glass-morphism rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all hover:-translate-y-1 shadow-xl"
              >
                <div className="aspect-[3/4] bg-slate-800 relative overflow-hidden flex items-center justify-center">
                  <Book className="w-16 h-16 text-slate-700 group-hover:scale-110 group-hover:text-blue-500/20 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
                  
                  <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => removeDocument(doc.id)}
                      className="p-2 bg-rose-500/20 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                      title="Open"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-white text-lg mb-2 truncate group-hover:text-blue-400 transition-colors">
                    {doc.name}
                  </h3>
                  <div className="flex items-center text-sm text-slate-500 gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Uploaded: {doc.uploadDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 text-slate-700">
              <Ghost className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {searchQuery ? "No books found" : "Your library is empty"}
            </h3>
            <p className="text-slate-400 max-w-sm">
              {searchQuery 
                ? `We couldn't find any books matching "${searchQuery}"` 
                : "Start by uploading your favorite PDF books on the home page."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}