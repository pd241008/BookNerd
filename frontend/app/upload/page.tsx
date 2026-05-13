"use client";

import { useRef, useState } from "react";
import { useDocuments } from "@/context/DocumentContext";
import { Upload, CheckCircle2, ArrowLeft, FileText, Info } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  const { addDocument } = useDocuments();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpload = async (selectedFile: File) => {
    if (!name) {
      setMessage({ type: "error", text: "Please enter a book title first." });
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
        storageType: "standard",
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
    <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 px-6">
      <div className="max-w-4xl w-full">
        {/* Breadcrumb/Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Side: Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-4">Upload Book</h1>
              <p className="text-slate-400 leading-relaxed">
                Add new PDF documents to your personal library. We&apos;ll handle the processing and make them ready for reading.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="shrink-0 w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">PDF Format</h4>
                  <p className="text-sm text-slate-400">Only PDF files are supported currently for the best reading experience.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="shrink-0 w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Metadata</h4>
                  <p className="text-sm text-slate-400">Enter a descriptive title to help you organize your library.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20">
              <p className="text-sm text-blue-400">
                <strong>Tip:</strong> You can also browse your library to see all your uploaded books.
              </p>
              <Link href="/gallery" className="text-sm font-bold text-blue-500 hover:underline mt-2 inline-block">
                View Library
              </Link>
            </div>
          </div>

          {/* Right Side: Upload Form */}
          <div className="lg:col-span-3">
            <div className="glass-morphism p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 blur-[80px] -z-10" />
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">Book Title</label>
                  <input
                    type="text"
                    placeholder="Enter the name of the book..."
                    value={name}
                    disabled={isUploading}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder:text-slate-600"
                  />
                </div>

                <div 
                  onClick={() => !isUploading && fileRef.current?.click()}
                  className={`group border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${
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
                  <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Upload className="w-10 h-10" />
                  </div>
                  <h3 className="font-bold text-white text-xl mb-2">
                    {isUploading ? "Uploading..." : "Select PDF File"}
                  </h3>
                  <p className="text-slate-500 text-center max-w-[200px]">
                    Drag and drop your PDF here or click to browse
                  </p>
                </div>

                {message && (
                  <div className={`p-5 rounded-2xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
                    message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {message.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <Info className="w-5 h-5 shrink-0" />}
                    {message.text}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}