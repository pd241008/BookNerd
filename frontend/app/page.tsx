"use client";

import { useRef, useState } from "react";
import { useDocuments } from "@/context/DocumentContext";
import { Upload, Shield, Zap, Layout, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { addDocument } = useDocuments();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpload = async (selectedFile: File) => {
    if (!name) {
      setMessage({ type: "error", text: "Please enter a document name first." });
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("myFile", selectedFile);
      formData.append("name", name);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/upload";
      const response = await fetch(backendUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      addDocument({
        id: data.id || Date.now().toString(),
        name,
        type: "document",
        uploadDate: new Date().toISOString().split("T")[0],
        fileUrl: URL.createObjectURL(selectedFile),
      });

      setMessage({ type: "success", text: `Successfully uploaded: ${name}` });
      setName("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Upload failed" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/20 to-transparent blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New: Enhanced PDF Rendering
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500 leading-tight">
            Read Smarter with <span className="glow-text text-blue-500">Aegis</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            The ultimate digital library for your PDF collection. Fast, secure, and accessible anywhere.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/gallery" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all group shadow-xl shadow-blue-900/40">
              Browse Library <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-xl font-bold border border-slate-700 hover:bg-slate-800 transition-all text-slate-300"
            >
              Start Uploading
            </button>
          </div>

          {/* Feature Grid Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="glass-morphism p-8 rounded-2xl border border-white/5 group hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Secure Storage</h3>
              <p className="text-slate-400 leading-relaxed">Your books are encrypted and safely stored in your private digital vault.</p>
            </div>
            <div className="glass-morphism p-8 rounded-2xl border border-white/5 group hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Blazing Fast</h3>
              <p className="text-slate-400 leading-relaxed">Instantly load even the largest PDF files with our optimized rendering engine.</p>
            </div>
            <div className="glass-morphism p-8 rounded-2xl border border-white/5 group hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Beautiful UI</h3>
              <p className="text-slate-400 leading-relaxed">A clean, distraction-free interface designed specifically for long reading sessions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload-section" className="py-24 bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Add Your Collection</h2>
            <p className="text-slate-400">Upload your PDF documents to begin your reading journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Automatic Metadata</h4>
                  <p className="text-sm text-slate-400">We automatically extract titles and authors from your PDFs.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">High Resolution</h4>
                  <p className="text-sm text-slate-400">Crisp rendering across all devices, from mobile to desktop.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Offline Access</h4>
                  <p className="text-sm text-slate-400">Read your books even when you're not connected to the internet.</p>
                </div>
              </div>
            </div>

            <div className="glass-morphism p-8 rounded-3xl border border-white/10 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Book Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Foundation - Isaac Asimov"
                    value={name}
                    disabled={isUploading}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white"
                  />
                </div>

                <div 
                  onClick={() => !isUploading && fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isUploading ? "opacity-50 cursor-not-allowed border-slate-800" : "border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5"
                  }`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const selected = e.target.files?.[0];
                      if (selected) handleUpload(selected);
                    }}
                  />
                  <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-white text-lg">
                    {isUploading ? "Processing..." : "Drop PDF here"}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">or click to browse files</p>
                </div>

                {message && (
                  <div className={`p-4 rounded-xl text-sm animate-fade-in ${
                    message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {message.text}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-white">AEGIS</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 Aegis Book Reader. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </main>
  );
}